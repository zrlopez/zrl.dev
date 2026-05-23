// Cloudflare Pages Function — /api/contact
// Replaces Next.js App Router route (incompatible with next-on-pages edge requirement).
// Uses Resend REST API directly via fetch — no Node.js SDK needed.
//
// SECURITY CONTROLS (in order of execution):
//   1. CORS / Origin check                  — CSRF mitigation
//   2. Content-Length body-size guard        — DoS mitigation
//   3. Per-IP rate limiting via KV           — spam / quota-exhaustion mitigation
//   4. Env variable presence validation      — fail-fast on misconfiguration
//   5. JSON parse with error boundary        — malformed-body rejection
//   6. Presence + type + length + format     — input validation
//   7. Turnstile server-side verification    — bot / automation mitigation
//   8. Control-character sanitization        — injection mitigation
//   9. HTML escaping for email body only     — XSS in email client mitigation
//  10. RFC-safe reply_to (no HTML encoding)  — header-injection mitigation

interface Env {
  RESEND_API_KEY: string
  TURNSTILE_SECRET_KEY: string
  // KV namespace bound in Cloudflare Pages → Settings → Functions → KV bindings
  // Binding name must be exactly: RateLimitKV
  RateLimitKV: KVNamespace
}

const ALLOWED_ORIGINS = ['https://zrl.dev'] as const

// Field length limits — mirrored in the frontend contact.tsx maxLength attrs.
const LIMITS = {
  name:           100,
  email:          254,   // RFC 5321 maximum
  subject:        200,
  message:        5_000,
  turnstileToken: 2_048, // Cloudflare Turnstile tokens are well under 1 KB in practice
} as const

// Rate limiting: 5 submissions per IP per hour.
const RATE_LIMIT = {
  maxRequests:     5,
  windowSeconds:   3_600, // 1 hour
  retryAfterLabel: '3600',
} as const

// ── Utility: HTML-escape for use in email HTML body ONLY ─────────────────────
// Do NOT use this for RFC 5321 header fields (To, Reply-To, Subject, etc.).
function htmlEscape(str: string): string {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;')
    .replace(/\//g, '&#x2F;')  // closes HTML tags in some legacy parsers
    .replace(/`/g,  '&#96;')   // template-literal injection guard
}

// ── Utility: strip control characters ────────────────────────────────────────
// Removes non-printable Unicode control characters that have no legitimate
// use in form input and could confuse downstream parsers or log aggregators.
// Preserves \n (0x0A) in the message field only — callers trim at field level.
function sanitizeField(str: string, allowNewlines = false): string {
  const controlChars = allowNewlines
    ? /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F\u0080-\u009F]/g
    : /[\u0000-\u001F\u007F\u0080-\u009F]/g
  return str.replace(controlChars, '').trim()
}

// ── Utility: email format validation ─────────────────────────────────────────
// RFC 5321-compatible; blocks header-injection chars (\r \n) explicitly.
function validateEmail(email: string): boolean {
  if (/[\r\n]/.test(email)) return false // header injection guard
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,63}$/.test(email.trim())
}

// ── Utility: Turnstile server-side verification ───────────────────────────────
async function verifyTurnstile(
  token:  string,
  ip:     string,
  secret: string,
): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    new URLSearchParams({ secret, response: token, remoteip: ip }),
  })
  const data = await res.json() as { success: boolean }
  return data.success === true
}

// ── Utility: KV-backed per-IP rate limiting ───────────────────────────────────
// Returns { allowed: true } if the request is within quota, or
// { allowed: false } if the IP has exceeded RATE_LIMIT.maxRequests.
//
// KV key: `cf_rl:{ip}` with TTL = RATE_LIMIT.windowSeconds.
// On KV unavailability the function logs a warning and ALLOWS the request
// (fail-open) so that a KV outage does not break the contact form entirely.
async function checkRateLimit(
  ip:        string,
  kv:        KVNamespace | undefined,
  requestId: string,
): Promise<{ allowed: boolean; remaining: number }> {
  if (!kv) {
    console.warn(JSON.stringify({
      event:     'contact_rate_limit_kv_unavailable',
      requestId,
      ts:        new Date().toISOString(),
      note:      'RateLimitKV binding not found — rate limiting is disabled. Bind RateLimitKV in Cloudflare Pages dashboard.',
    }))
    return { allowed: true, remaining: RATE_LIMIT.maxRequests }
  }

  const key     = `cf_rl:${ip}`
  const rawVal  = await kv.get(key)
  const current = rawVal ? parseInt(rawVal, 10) : 0

  if (current >= RATE_LIMIT.maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  // Increment counter; reset TTL on every write so the window is sliding.
  await kv.put(key, String(current + 1), {
    expirationTtl: RATE_LIMIT.windowSeconds,
  })

  return { allowed: true, remaining: RATE_LIMIT.maxRequests - current - 1 }
}

// ── Main handler ──────────────────────────────────────────────────────────────
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const requestId = crypto.randomUUID()

  // Common security response headers applied to every response from this endpoint.
  const baseHeaders: Record<string, string> = {
    'X-Request-Id':              requestId,
    'X-Content-Type-Options':    'nosniff',
    'Cache-Control':             'no-store',
  }

  try {
    // ── 1. CSRF: strict Origin check ─────────────────────────────────────────
    const origin = request.headers.get('origin')
    if (!origin || !(ALLOWED_ORIGINS as readonly string[]).includes(origin)) {
      return Response.json(
        { error: 'Forbidden' },
        { status: 403, headers: baseHeaders },
      )
    }

    // ── 2. Body-size guard (before JSON parse) ────────────────────────────────
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength, 10) > 10_000) {
      return Response.json(
        { error: 'Request too large' },
        { status: 413, headers: baseHeaders },
      )
    }

    // ── 3. Per-IP rate limiting ───────────────────────────────────────────────
    const ip = (
      request.headers.get('cf-connecting-ip') ??
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      'unknown'
    )

    const rateLimit = await checkRateLimit(ip, env.RateLimitKV, requestId)
    if (!rateLimit.allowed) {
      console.warn(JSON.stringify({
        event:     'contact_rate_limited',
        requestId,
        ip_hash:   await hashIp(ip), // log hashed IP only — GDPR-safe
        ts:        new Date().toISOString(),
      }))
      return Response.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            ...baseHeaders,
            'Retry-After': RATE_LIMIT.retryAfterLabel,
          },
        },
      )
    }

    // ── 4. Env validation ─────────────────────────────────────────────────────
    if (!env.RESEND_API_KEY || !env.TURNSTILE_SECRET_KEY) {
      console.error(JSON.stringify({
        event:     'contact_env_missing',
        requestId,
        ts:        new Date().toISOString(),
      }))
      return Response.json(
        { error: 'Server configuration error' },
        { status: 500, headers: baseHeaders },
      )
    }

    // ── 5. Parse body ─────────────────────────────────────────────────────────
    let body: Record<string, unknown>
    try {
      body = await request.json() as Record<string, unknown>
    } catch {
      return Response.json(
        { error: 'Invalid JSON body' },
        { status: 400, headers: baseHeaders },
      )
    }

    const { name, email, subject, message, turnstileToken } = body

    // ── 6a. Presence check ────────────────────────────────────────────────────
    if (!name || !email || !subject || !message || !turnstileToken) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400, headers: baseHeaders },
      )
    }

    // ── 6b. Type narrowing ────────────────────────────────────────────────────
    if (
      typeof name           !== 'string' ||
      typeof email          !== 'string' ||
      typeof subject        !== 'string' ||
      typeof message        !== 'string' ||
      typeof turnstileToken !== 'string'
    ) {
      return Response.json(
        { error: 'Invalid field types' },
        { status: 400, headers: baseHeaders },
      )
    }

    // ── 6c. Length validation ─────────────────────────────────────────────────
    if (name.length           > LIMITS.name)
      return Response.json({ error: `Name must be ${LIMITS.name} characters or fewer` },           { status: 400, headers: baseHeaders })
    if (email.length          > LIMITS.email)
      return Response.json({ error: `Email must be ${LIMITS.email} characters or fewer` },         { status: 400, headers: baseHeaders })
    if (subject.length        > LIMITS.subject)
      return Response.json({ error: `Subject must be ${LIMITS.subject} characters or fewer` },     { status: 400, headers: baseHeaders })
    if (message.length        > LIMITS.message)
      return Response.json({ error: `Message must be ${LIMITS.message} characters or fewer` },     { status: 400, headers: baseHeaders })
    if (turnstileToken.length > LIMITS.turnstileToken)
      return Response.json({ error: 'Invalid security token' },                                    { status: 400, headers: baseHeaders })

    // ── 6d. Email format validation ───────────────────────────────────────────
    if (!validateEmail(email)) {
      return Response.json(
        { error: 'Invalid email address' },
        { status: 400, headers: baseHeaders },
      )
    }

    // ── 7. Turnstile verification ─────────────────────────────────────────────
    const isHuman = await verifyTurnstile(turnstileToken, ip, env.TURNSTILE_SECRET_KEY)
    if (!isHuman) {
      console.warn(JSON.stringify({
        event:     'contact_turnstile_failed',
        requestId,
        ts:        new Date().toISOString(),
      }))
      return Response.json(
        { error: 'Security check failed. Please try again.' },
        { status: 403, headers: baseHeaders },
      )
    }

    // ── 8. Sanitize — strip control characters ────────────────────────────────
    // rawEmail is used for RFC 5321 headers (reply_to) — no HTML encoding.
    // HTML-escaped variants are used only inside the email HTML body.
    const rawEmail    = sanitizeField(email)             // RFC 5321-safe
    const rawName     = sanitizeField(name)
    const rawSubject  = sanitizeField(subject)
    const rawMessage  = sanitizeField(message, true)     // preserve \n for message body

    // ── 9. HTML-escape for email body only ────────────────────────────────────
    const safeName    = htmlEscape(rawName)
    const safeEmail   = htmlEscape(rawEmail)             // display only
    const safeSubject = htmlEscape(rawSubject)
    const safeMessage = htmlEscape(rawMessage)

    // ── 10. Send via Resend REST API ──────────────────────────────────────────
    const resendRes = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:     'Contact Form <hello@zrl.dev>',
        to:       ['hello@zrl.dev'],
        reply_to: rawEmail,  // RFC 5321 header — use raw sanitized value, NOT htmlEscape'd
        subject:  `[zrl.dev contact] ${rawSubject}`,
        html: [
          '<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">',
          '  <h2 style="color:#111;">New message from zrl.dev</h2>',
          '  <table style="width:100%;border-collapse:collapse;">',
          '    <tr>',
          '      <td style="padding:8px 0;color:#555;width:80px;"><strong>Name:</strong></td>',
          `      <td style="padding:8px 0;">${safeName}</td>`,
          '    </tr>',
          '    <tr>',
          '      <td style="padding:8px 0;color:#555;"><strong>Email:</strong></td>',
          `      <td style="padding:8px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>`,
          '    </tr>',
          '    <tr>',
          '      <td style="padding:8px 0;color:#555;"><strong>Subject:</strong></td>',
          `      <td style="padding:8px 0;">${safeSubject}</td>`,
          '    </tr>',
          '  </table>',
          '  <hr style="margin:16px 0;border:none;border-top:1px solid #eee;"/>',
          `  <p style="white-space:pre-wrap;color:#333;word-break:break-word;">${safeMessage}</p>`,
          '  <hr style="margin:16px 0;border:none;border-top:1px solid #eee;"/>',
          `  <p style="font-size:11px;color:#aaa;">Request ID: ${requestId}</p>`,
          '</div>',
        ].join('\n'),
      }),
    })

    if (!resendRes.ok) {
      const errBody = await resendRes.text()
      throw new Error(`Resend API error ${resendRes.status}: ${errBody}`)
    }

    console.log(JSON.stringify({
      event:          'contact_form_sent',
      requestId,
      subjectLength:  subject.length,
      messageLength:  message.length,
      remaining:      rateLimit.remaining,
      ts:             new Date().toISOString(),
    }))

    return Response.json(
      { success: true, requestId },
      { status: 200, headers: baseHeaders },
    )

  } catch (err) {
    console.error(JSON.stringify({
      event:     'contact_form_error',
      requestId,
      error:     err instanceof Error ? err.message : String(err),
      ts:        new Date().toISOString(),
    }))
    return Response.json(
      { error: 'Internal server error', requestId },
      { status: 500, headers: baseHeaders },
    )
  }
}

// ── Utility: one-way SHA-256 IP hash for GDPR-safe logging ───────────────────
// We never log raw IPs. The hash allows correlation across a session without
// storing personally identifiable data.
async function hashIp(ip: string): Promise<string> {
  const data   = new TextEncoder().encode(ip)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16) // 8-byte prefix is sufficient for log correlation
}
