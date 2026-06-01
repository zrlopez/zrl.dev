import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// ── Constants ────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = new Set(['https://zrl.dev'])
const MAX_BODY_BYTES  = 10_240
const LIMITS = {
  name:           100,
  email:          254,
  subject:        200,
  message:        5_000,
  turnstileToken: 2_048,
} as const

// ── Types ────────────────────────────────────────────────────────────────────
interface ContactPayload {
  name:           string
  email:          string
  subject:        string
  message:        string
  turnstileToken: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function buildHeaders(requestId: string): Record<string, string> {
  return {
    'X-Request-Id':          requestId,
    'Cache-Control':         'no-store, max-age=0',
    'Pragma':                'no-cache',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy':       'no-referrer',
    'Content-Security-Policy':
      "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
  }
}

function json(
  payload: Record<string, unknown>,
  status:  number,
  requestId: string,
  extra: Record<string, string> = {},
): NextResponse {
  return NextResponse.json(payload, {
    status,
    headers: { ...buildHeaders(requestId), ...extra },
  })
}

function sanitize(str: string, allowNewlines = false): string {
  const pattern = allowNewlines
    ? /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F\u0080-\u009F]/g
    : /[\u0000-\u001F\u007F\u0080-\u009F]/g
  return str.replace(pattern, '').trim()
}

function validateEmail(email: string): boolean {
  if (/[\r\n]/.test(email)) return false
  return /^[a-zA-Z0-9._\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,63}$/.test(email)
}

function validatePayload(
  body: Record<string, unknown>,
): { ok: true; value: ContactPayload } | { ok: false; error: string } {
  const { name, email, subject, message, turnstileToken } = body

  if (
    typeof name           !== 'string' ||
    typeof email          !== 'string' ||
    typeof subject        !== 'string' ||
    typeof message        !== 'string' ||
    typeof turnstileToken !== 'string'
  ) {
    return { ok: false, error: 'Invalid field types' }
  }

  const v: ContactPayload = {
    name:           sanitize(name),
    email:          sanitize(email),
    subject:        sanitize(subject),
    message:        sanitize(message, true),
    turnstileToken: sanitize(turnstileToken),
  }

  if (!v.name || !v.email || !v.subject || !v.message || !v.turnstileToken)
    return { ok: false, error: 'Missing required fields' }
  if (v.name.length           > LIMITS.name)           return { ok: false, error: `Name must be ${LIMITS.name} characters or fewer` }
  if (v.email.length          > LIMITS.email)          return { ok: false, error: `Email must be ${LIMITS.email} characters or fewer` }
  if (v.subject.length        > LIMITS.subject)        return { ok: false, error: `Subject must be ${LIMITS.subject} characters or fewer` }
  if (v.message.length        > LIMITS.message)        return { ok: false, error: `Message must be ${LIMITS.message} characters or fewer` }
  if (v.turnstileToken.length > LIMITS.turnstileToken) return { ok: false, error: 'Invalid security token' }
  if (!validateEmail(v.email))                         return { ok: false, error: 'Invalid email address' }

  return { ok: true, value: v }
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY env var missing')
    return false
  }

  try {
    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    new URLSearchParams({ secret, response: token, remoteip: ip }),
      },
    )
    if (!res.ok) return false
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return false
  }
}

async function sendEmail(payload: ContactPayload, requestId: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY env var missing')
    return false
  }

  const escape = (s: string) =>
    s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;')

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:    'contact@zrl.dev',
        to:      ['hi@zrl.dev'],
        replyTo: payload.email,
        subject: `[zrl.dev] ${payload.subject}`,
        html: [
          `<p><strong>From:</strong> ${escape(payload.name)} &lt;${escape(payload.email)}&gt;</p>`,
          `<p><strong>Subject:</strong> ${escape(payload.subject)}</p>`,
          `<p><strong>Message:</strong></p>`,
          `<blockquote>${escape(payload.message).replace(/\n/g, '<br>')}</blockquote>`,
          `<hr><p style="color:#888;font-size:12px">Request ID: ${requestId}</p>`,
        ].join('\n'),
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

// ── Route Handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID()

  // Origin check — only accept requests from the portfolio domain.
  // In development the origin header may be absent; allow localhost.
  const origin = req.headers.get('origin') ?? ''
  const isDev  = process.env.NODE_ENV === 'development'

  if (!isDev && !ALLOWED_ORIGINS.has(origin)) {
    return json({ error: 'Forbidden' }, 403, requestId)
  }

  // Content-type guard
  const contentType = req.headers.get('content-type') ?? ''
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return json({ error: 'Unsupported content type' }, 415, requestId)
  }

  // Body size guard
  const raw = await req.text()
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    return json({ error: 'Request body too large' }, 413, requestId)
  }

  // Parse JSON
  let body: Record<string, unknown>
  try {
    body = JSON.parse(raw) as Record<string, unknown>
  } catch {
    return json({ error: 'Invalid JSON' }, 400, requestId)
  }

  // Validate fields
  const validation = validatePayload(body)
  if (!validation.ok) {
    return json({ error: validation.error }, 400, requestId)
  }
  const payload = validation.value

  // Turnstile verification
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  const turnstileOk = await verifyTurnstile(payload.turnstileToken, ip)
  if (!turnstileOk) {
    console.warn(JSON.stringify({ event: 'turnstile_failed', requestId, ts: new Date().toISOString() }))
    return json({ error: 'Security verification failed. Please try again.' }, 400, requestId)
  }

  // Send email
  const sent = await sendEmail(payload, requestId)
  if (!sent) {
    console.error(JSON.stringify({ event: 'email_send_failed', requestId, ts: new Date().toISOString() }))
    return json({ error: 'Failed to send message. Please try again later.' }, 500, requestId)
  }

  console.info(JSON.stringify({ event: 'contact_sent', requestId, ts: new Date().toISOString() }))
  return json({ success: true }, 200, requestId)
}

// Reject non-POST methods explicitly
export async function GET():    Promise<NextResponse> { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }) }
export async function PUT():    Promise<NextResponse> { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }) }
export async function DELETE(): Promise<NextResponse> { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }) }
