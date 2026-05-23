interface Env {
  RESEND_API_KEY: string
  TURNSTILE_SECRET_KEY: string
  RateLimitKV: KVNamespace
}

interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
  turnstileToken: string
}

interface RateLimitState {
  count: number
  windowStart: number
}

const ALLOWED_ORIGINS = new Set(['https://zrl.dev'])
const MAX_BODY_BYTES = 10_240
const LIMITS = {
  name: 100,
  email: 254,
  subject: 200,
  message: 5_000,
  turnstileToken: 2_048,
} as const
const RATE_LIMIT = {
  maxRequests: 5,
  windowMs: 3_600_000,
  expirationTtl: 3_660,
} as const

function buildResponseHeaders(requestId: string): Record<string, string> {
  return {
    'X-Request-Id': requestId,
    'Cache-Control': 'no-store, max-age=0',
    Pragma: 'no-cache',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
  }
}

function jsonResponse(
  payload: Record<string, unknown>,
  status: number,
  requestId: string,
  extraHeaders: Record<string, string> = {},
): Response {
  return Response.json(payload, {
    status,
    headers: {
      ...buildResponseHeaders(requestId),
      ...extraHeaders,
    },
  })
}

function sanitizeField(str: string, allowNewlines = false): string {
  const controlChars = allowNewlines
    ? /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F\u0080-\u009F]/g
    : /[\u0000-\u001F\u007F\u0080-\u009F]/g

  return str.replace(controlChars, '').trim()
}

function htmlEscape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#96;')
}

function validateEmail(email: string): boolean {
  if (/[\r\n]/.test(email)) return false
  return /^[a-zA-Z0-9._\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,63}$/.test(email)
}

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16)
}

async function readBodyAsText(request: Request, maxBytes: number): Promise<string | null> {
  const reader = request.body?.getReader()
  if (!reader) return ''

  const decoder = new TextDecoder()
  let totalBytes = 0
  let bodyText = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    totalBytes += value.byteLength
    if (totalBytes > maxBytes) {
      await reader.cancel('body_too_large')
      return null
    }

    bodyText += decoder.decode(value, { stream: true })
  }

  bodyText += decoder.decode()
  return bodyText
}

function validatePayload(body: Record<string, unknown>):
  | { ok: true; value: ContactPayload }
  | { ok: false; error: string } {
  const { name, email, subject, message, turnstileToken } = body

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof subject !== 'string' ||
    typeof message !== 'string' ||
    typeof turnstileToken !== 'string'
  ) {
    return { ok: false, error: 'Invalid field types' }
  }

  const sanitized: ContactPayload = {
    name: sanitizeField(name),
    email: sanitizeField(email),
    subject: sanitizeField(subject),
    message: sanitizeField(message, true),
    turnstileToken: sanitizeField(turnstileToken),
  }

  if (!sanitized.name || !sanitized.email || !sanitized.subject || !sanitized.message || !sanitized.turnstileToken) {
    return { ok: false, error: 'Missing required fields' }
  }

  if (sanitized.name.length > LIMITS.name) return { ok: false, error: `Name must be ${LIMITS.name} characters or fewer` }
  if (sanitized.email.length > LIMITS.email) return { ok: false, error: `Email must be ${LIMITS.email} characters or fewer` }
  if (sanitized.subject.length > LIMITS.subject) return { ok: false, error: `Subject must be ${LIMITS.subject} characters or fewer` }
  if (sanitized.message.length > LIMITS.message) return { ok: false, error: `Message must be ${LIMITS.message} characters or fewer` }
  if (sanitized.turnstileToken.length > LIMITS.turnstileToken) return { ok: false, error: 'Invalid security token' }
  if (!validateEmail(sanitized.email)) return { ok: false, error: 'Invalid email address' }

  return { ok: true, value: sanitized }
}

async function verifyTurnstile(token: string, ip: string, secret: string): Promise<boolean> {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  })

  if (!response.ok) return false
  const data = (await response.json()) as { success?: boolean }
  return data.success === true
}

async function checkRateLimit(
  ip: string,
  kv: KVNamespace | undefined,
  requestId: string,
): Promise<
  | { allowed: true; remaining: number }
  | { allowed: false; reason: 'limit'; retryAfter: number }
  | { allowed: false; reason: 'unavailable' }
> {
  if (!kv) {
    console.error(JSON.stringify({
      event: 'contact_rate_limit_unavailable',
      requestId,
      ts: new Date().toISOString(),
      note: 'RateLimitKV binding missing; failing closed until runtime configuration is restored.',
    }))
    return { allowed: false, reason: 'unavailable' }
  }

  try {
    const key = `cf_rl:${ip}`
    const now = Date.now()
    const stored = await kv.get(key, 'json') as RateLimitState | null
    const state = stored && now - stored.windowStart < RATE_LIMIT.windowMs
      ? stored
      : { count: 0, windowStart: now }

    if (state.count >= RATE_LIMIT.maxRequests) {
      const retryAfter = Math.max(1, Math.ceil((state.windowStart + RATE_LIMIT.windowMs - now) / 1000))
      return { allowed: false, reason: 'limit', retryAfter }
    }

    await kv.put(key, JSON.stringify({ count: state.count + 1, windowStart: state.windowStart }), {
      expirationTtl: RATE_LIMIT.expirationTtl,
    })

    return { allowed: true, remaining: RATE_LIMIT.maxRequests - state.count - 1 }
  } catch (error) {
    console.error(JSON.stringify({
      event: 'contact_rate_limit_error',
      requestId,
      error: error instanceof Error ? error.message : String(error),
      ts: new Date().toISOString(),
    }))
    return { allowed: false, reason: 'unavailable' }
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const startedAt = Date.now()
  const requestId = crypto.randomUUID()
  const origin = request.headers.get('origin')

  try {
    if (!origin || !ALLOWED_ORIGINS.has(origin)) {
      console.warn(JSON.stringify({ event: 'contact_origin_rejected', requestId, origin, ts: new Date().toISOString() }))
      return jsonResponse({ error: 'Forbidden' }, 403, requestId)
    }

    const contentType = request.headers.get('content-type') ?? ''
    if (!contentType.toLowerCase().startsWith('application/json')) {
      return jsonResponse({ error: 'Unsupported content type' }, 415, requestId)
    }

    const ip = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
    const rateLimit = await checkRateLimit(ip, env.RateLimitKV, requestId)

    if (!rateLimit.allowed) {
      if (rateLimit.reason === 'limit') {
        console.warn(JSON.stringify({
          event: 'contact_rate_limited',
          requestId,
          ip_hash: await hashIp(ip),
          retryAfter: rateLimit.retryAfter,
          ts: new Date().toISOString(),
        }))
        return jsonResponse({ error: 'Too many requests. Please try again later.' }, 429, requestId, { 'Retry-After': String(rateLimit.retryAfter) })
      }

      return jsonResponse({ error: 'Service temporarily unavailable' }, 503, requestId, { 'Retry-After': '60' })
    }

    if (!env.RESEND_API_KEY || !env.TURNSTILE_SECRET_KEY) {
      console.error(JSON.stringify({ event: 'contact_env_missing', requestId, ts: new Date().toISOString() }))
      return jsonResponse({ error: 'Server configuration error' }, 500, requestId)
    }

    const rawBody = await readBodyAsText(request, MAX_BODY_BYTES)
    if (rawBody === null) {
      return jsonResponse({ error: 'Request too large' }, 413, requestId)
    }

    let body: Record<string, unknown>
    try {
      body = JSON.parse(rawBody) as Record<string, unknown>
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400, requestId)
    }

    const validation = validatePayload(body)
    if (!validation.ok) {
      return jsonResponse({ error: validation.error }, 400, requestId)
    }

    const payload = validation.value
    const isHuman = await verifyTurnstile(payload.turnstileToken, ip, env.TURNSTILE_SECRET_KEY)
    if (!isHuman) {
      console.warn(JSON.stringify({ event: 'contact_turnstile_failed', requestId, ts: new Date().toISOString() }))
      return jsonResponse({ error: 'Security check failed. Please try again.' }, 403, requestId)
    }

    const safeName = htmlEscape(payload.name)
    const safeEmail = htmlEscape(payload.email)
    const safeSubject = htmlEscape(payload.subject)
    const safeMessage = htmlEscape(payload.message)
    const replyToHref = `mailto:${encodeURIComponent(payload.email)}`

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Contact Form <hello@zrl.dev>',
        to: ['hello@zrl.dev'],
        reply_to: payload.email,
        subject: `[zrl.dev contact] ${payload.subject}`,
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
          `      <td style="padding:8px 0;"><a href="${replyToHref}">${safeEmail}</a></td>`,
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

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text()
      console.error(JSON.stringify({
        event: 'contact_resend_error',
        requestId,
        status: resendResponse.status,
        error: errorBody.slice(0, 500),
        ts: new Date().toISOString(),
      }))
      return jsonResponse({ error: 'Email delivery failed' }, 502, requestId)
    }

    console.log(JSON.stringify({
      event: 'contact_form_sent',
      requestId,
      durationMs: Date.now() - startedAt,
      subjectLength: payload.subject.length,
      messageLength: payload.message.length,
      remaining: rateLimit.remaining,
      ts: new Date().toISOString(),
    }))

    return jsonResponse({ success: true, requestId }, 200, requestId)
  } catch (error) {
    console.error(JSON.stringify({
      event: 'contact_form_error',
      requestId,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
      ts: new Date().toISOString(),
    }))
    return jsonResponse({ error: 'Internal server error', requestId }, 500, requestId)
  }
}
