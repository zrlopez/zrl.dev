// Cloudflare Pages Function — /api/contact
// Replaces Next.js App Router route (incompatible with next-on-pages edge requirement).
// Uses Resend REST API directly via fetch — no Node.js SDK needed.
//
// Security controls (in order of execution):
//   1. CORS / Origin check        — CSRF mitigation
//   2. Content-Length guard        — oversized payload rejection
//   3. Env validation             — fail-fast on misconfiguration
//   4. Rate limiting (KV)         — 5 submissions / IP / 60 min
//   5. JSON parse                 — malformed body rejection
//   6. Presence + type check      — required field enforcement
//   7. Length validation          — bounded field sizes
//   8. Email format validation    — RFC 5321 + header-injection guard
//   9. Turnstile verification     — bot / automated submission mitigation
//  10. Sanitize + htmlEscape      — XSS / injection prevention in email body
//  11. Resend delivery            — send via REST API with no SDK dependency

interface Env {
  RESEND_API_KEY: string
  TURNSTILE_SECRET_KEY: string
  // Cloudflare KV namespace bound as RateLimitKV in Pages settings.
  // Add binding: wrangler pages project create --kv RateLimitKV
  // or via Cloudflare Dashboard → Pages → Settings → Functions → KV namespace bindings
  RateLimitKV: KVNamespace
}

// ── Constants ────────────────────────────────────────────────────────────────

const ALLOWED_ORIGINS = ['https://zrl.dev'] as const

const FIELD_LIMITS = {
  name:    100,
  email:   254,
  subject: 200,
  message: 5_000,
} as const

// Rate limit: 5 submissions per IP per 60-minute rolling window.
// Aggressive enough to block replay attacks while accommodating legitimate use.
const RATE_LIMIT = {
  max:            5,
  windowSeconds:  3_600, // 1 hour
} as const

// ── Security Utilities ───────────────────────────────────────────────────────

/**
 * Escapes HTML special characters for safe rendering inside email body HTML.
 * Must NOT be applied to values used in RFC 5321 header fields (e.g. reply_to).
 */
function htmlEscape(str: string): string {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g,  '&#96;')
}

/**
 * Strips C0/C1 control characters and trims whitespace.
 * Safe for use on both header values and HTML body content (before htmlEscape).
 */
function sanitizeField(str: string): string {
  // Remove NUL, BS, VT, FF, SO–US, DEL control characters
  return str
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
}

/**
 * Validates email format and guards against SMTP header injection.
 * Rejects any value containing \r or \n which could split mail headers.
 */
function validateEmail(email: string): boolean {
  if (/[\r\n]/.test(email)) return false
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,63}$/.test(email)
}

// ── Rate Limiting ─────────────────────────────────────────────────────────────

interface RateLimitResult {
  allowed:   boolean
  current:   number
  remaining: number
  resetAt:   number // Unix epoch seconds
}

/**
 * KV-backed sliding window rate limiter.
 *
 * Key pattern: `contact_rl:{ip}`
 * Value:        JSON string { count: number, windowStart: number }
 *
 * On each request:
 *   - If key is missing or window has expired → reset counter, allow
 *   - If count < max → increment counter, allow
 *   - If count >= max → deny
 *
 * TTL is set to windowSeconds on every write so KV auto-expires stale keys.
 */
async function checkRateLimit(
  kv: KVNamespace,
  ip: string
): Promise<RateLimitResult> {
  const key    = `contact_rl:${ip}`
  const now    = Math.floor(Date.now() / 1_000)
  const rawVal = await kv.get(key)

  let count       = 0
  let windowStart = now

  if (rawVal !== null) {
    try {
      const parsed = JSON.parse(rawVal) as { count: number; windowStart: number }
      // If the stored window hasn't expired, continue counting within it
      if (now - parsed.windowStart < RATE_LIMIT.windowSeconds) {
        count       = parsed.count
        windowStart = parsed.windowStart
      }
      // else: window expired — treat as fresh (count stays 0)
    } catch {
      // Corrupt KV value — treat as fresh
    }
  }

  const resetAt   = windowStart + RATE_LIMIT.windowSeconds
  const newCount  = count + 1
  const allowed   = newCount <= RATE_LIMIT.max
  const remaining = Math.max(0, RATE_LIMIT.max - newCount)

  if (allowed) {
    // Write updated count back to KV with TTL so it auto-expires
    await kv.put(
      key,
      JSON.stringify({ count: newCount, windowStart }),
      { expirationTtl: RATE_LIMIT.windowSeconds }
    )
  }

  return { allowed, current: newCount, remaining, resetAt }
}

// ── Turnstile Verification ────────────────────────────────────────────────────

async function verifyTurnstile(
  token:  string,
  ip:     string,
  secret: string
): Promise<boolean> {
  const res = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    new URLSearchParams({ secret, response: token, remoteip: ip }),
    }
  )
  const data = await res.json() as { success: boolean }
  return data.success === true
}

// ── Rate Limit Response Headers ───────────────────────────────────────────────

function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit':     String(RATE_LIMIT.max),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset':     String(result.resetAt),
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const requestId = crypto.randomUUID()

  try {
    // ── 1. CSRF: Origin check ─────────────────────────────────────────────────
    const origin = request.headers.get('origin')
    if (!origin || !(ALLOWED_ORIGINS as readonly string[]).includes(origin)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    // ── 2. Body size guard ────────────────────────────────────────────────────
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength, 10) > 10_000) {
      return Response.json({ error: 'Request too large' }, { status: 413 })
    }

    // ── 3. Env validation ─────────────────────────────────────────────────────
    if (!env.RESEND_API_KEY || !env.TURNSTILE_SECRET_KEY) {
      console.error(JSON.stringify({
        event: 'contact_env_missing',
        requestId,
        ts: new Date().toISOString(),
      }))
      return Response.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // ── 4. Rate limiting ──────────────────────────────────────────────────────
    // Resolve client IP: cf-connecting-ip is set by Cloudflare and is the
    // authoritative real client IP (not spoofable through x-forwarded-for
    // when behind Cloudflare's network).
    const clientIp =
      request.headers.get('cf-connecting-ip') ??
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      'unknown'

    // Only apply rate limiting when KV binding is available (it will be
    // undefined in local wrangler dev without --kv flag).
    if (env.RateLimitKV) {
      const rl = await checkRateLimit(env.RateLimitKV, clientIp)
      if (!rl.allowed) {
        console.warn(JSON.stringify({
          event:     'contact_rate_limited',
          requestId,
          ip:        clientIp,
          current:   rl.current,
          resetAt:   rl.resetAt,
          ts:        new Date().toISOString(),
        }))
        return new Response(
          JSON.stringify({
            error: 'Too many requests. Please try again later.',
            retryAfter: rl.resetAt,
          }),
          {
            status:  429,
            headers: {
              'Content-Type':  'application/json',
              'Retry-After':   String(rl.resetAt - Math.floor(Date.now() / 1_000)),
              ...rateLimitHeaders(rl),
            },
          }
        )
      }
    }

    // ── 5. Parse body ─────────────────────────────────────────────────────────
    let body: Record<string, unknown>
    try {
      body = await request.json() as Record<string, unknown>
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { name, email, subject, message, turnstileToken } = body

    // ── 6. Presence + type check ──────────────────────────────────────────────
    if (!name || !email || !subject || !message || !turnstileToken) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (
      typeof name          !== 'string' ||
      typeof email         !== 'string' ||
      typeof subject       !== 'string' ||
      typeof message       !== 'string' ||
      typeof turnstileToken !== 'string'
    ) {
      return Response.json({ error: 'Invalid field types' }, { status: 400 })
    }

    // ── 7. Length validation ──────────────────────────────────────────────────
    if (name.length    > FIELD_LIMITS.name)
      return Response.json({ error: `Name must be ${FIELD_LIMITS.name} characters or fewer` },    { status: 400 })
    if (email.length   > FIELD_LIMITS.email)
      return Response.json({ error: `Email must be ${FIELD_LIMITS.email} characters or fewer` },   { status: 400 })
    if (subject.length > FIELD_LIMITS.subject)
      return Response.json({ error: `Subject must be ${FIELD_LIMITS.subject} characters or fewer` }, { status: 400 })
    if (message.length > FIELD_LIMITS.message)
      return Response.json({ error: `Message must be ${FIELD_LIMITS.message} characters or fewer` }, { status: 400 })

    // ── 8. Email format + header-injection guard ──────────────────────────────
    if (!validateEmail(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // ── 9. Turnstile verification ─────────────────────────────────────────────
    const isHuman = await verifyTurnstile(turnstileToken, clientIp, env.TURNSTILE_SECRET_KEY)
    if (!isHuman) {
      console.warn(JSON.stringify({
        event:     'contact_turnstile_failed',
        requestId,
        ts:        new Date().toISOString(),
      }))
      return Response.json({ error: 'Turnstile verification failed. Please refresh and try again.' }, { status: 403 })
    }

    // ── 10. Sanitize ──────────────────────────────────────────────────────────
    // sanitizeField: strips control chars, trims whitespace (safe for headers)
    // htmlEscape:    HTML-encodes special chars (safe for HTML email body)
    //
    // IMPORTANT: rawEmail is sanitized but NOT HTML-escaped. It is used only
    // in RFC 5321 header fields (reply_to) where HTML encoding is invalid.
    // safeEmail is HTML-escaped and used ONLY inside the HTML body string.
    const rawName    = sanitizeField(name)
    const rawEmail   = sanitizeField(email)   // ← used in reply_to header
    const rawSubject = sanitizeField(subject)
    const rawMessage = sanitizeField(message)

    const safeName    = htmlEscape(rawName)
    const safeEmail   = htmlEscape(rawEmail)   // ← used in HTML body only
    const safeSubject = htmlEscape(rawSubject)
    const safeMessage = htmlEscape(rawMessage)

    // ── 11. Send via Resend REST API ──────────────────────────────────────────
    const resendRes = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:     'Contact Form <hello@zrl.dev>',
        to:       ['hello@zrl.dev'],
        reply_to: rawEmail,  // RFC 5321 header — must NOT be HTML-escaped
        subject:  `[zrl.dev] ${rawSubject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
            <h2 style="color: #111; margin-bottom: 16px;">New message from zrl.dev</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
              <tr>
                <td style="padding: 8px 0; color: #555; width: 80px; vertical-align: top;"><strong>Name:</strong></td>
                <td style="padding: 8px 0;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555; vertical-align: top;"><strong>Email:</strong></td>
                <td style="padding: 8px 0;"><a href="mailto:${safeEmail}" style="color: #0070f3;">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555; vertical-align: top;"><strong>Subject:</strong></td>
                <td style="padding: 8px 0;">${safeSubject}</td>
              </tr>
            </table>
            <hr style="margin: 16px 0; border: none; border-top: 1px solid #eee;" />
            <p style="white-space: pre-wrap; color: #333; word-break: break-word; line-height: 1.6;">${safeMessage}</p>
            <hr style="margin: 16px 0; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 11px; color: #aaa; margin: 0;">Request ID: ${requestId}</p>
          </div>
        `,
      }),
    })

    if (!resendRes.ok) {
      const errBody = await resendRes.text()
      throw new Error(`Resend API error — status: ${resendRes.status}, body: ${errBody}`)
    }

    console.log(JSON.stringify({
      event:         'contact_form_sent',
      requestId,
      subjectLength: rawSubject.length,
      messageLength: rawMessage.length,
      ts:            new Date().toISOString(),
    }))

    return Response.json({ success: true, requestId })

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error(JSON.stringify({
      event:     'contact_form_error',
      requestId,
      error:     errorMessage,
      ts:        new Date().toISOString(),
    }))
    return Response.json({ error: 'Internal server error', requestId }, { status: 500 })
  }
}
