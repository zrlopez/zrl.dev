// Cloudflare Pages Function — /api/contact
// Replaces Next.js App Router route (incompatible with next-on-pages edge requirement).
// Uses Resend REST API directly via fetch — no Node.js SDK needed.

interface Env {
  RESEND_API_KEY: string
  TURNSTILE_SECRET_KEY: string
}

const ALLOWED_ORIGINS = ['https://zrl.dev']

const LIMITS = {
  name: 100,
  email: 254,
  subject: 200,
  message: 5000,
} as const

function htmlEscape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function sanitizeField(str: string): string {
  return str.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function verifyTurnstile(
  token: string,
  ip: string,
  secret: string
): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  })
  const data = await res.json() as { success: boolean }
  return data.success === true
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const requestId = crypto.randomUUID()

  try {
    // ── CSRF: Origin check ────────────────────────────────────────────────────
    const origin = request.headers.get('origin')
    if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    // ── Body size guard ───────────────────────────────────────────────────────
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength, 10) > 10_000) {
      return Response.json({ error: 'Request too large' }, { status: 413 })
    }

    // ── Env validation ───────────────────────────────────────────────────────
    if (!env.RESEND_API_KEY || !env.TURNSTILE_SECRET_KEY) {
      console.error(JSON.stringify({ event: 'contact_env_missing', requestId, ts: new Date().toISOString() }))
      return Response.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // ── Parse body ────────────────────────────────────────────────────────────
    let body: Record<string, unknown>
    try {
      body = await request.json() as Record<string, unknown>
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { name, email, subject, message, turnstileToken } = body

    // ── Presence check ───────────────────────────────────────────────────────
    if (!name || !email || !subject || !message || !turnstileToken) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // ── Type narrowing ───────────────────────────────────────────────────────
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof subject !== 'string' ||
      typeof message !== 'string' ||
      typeof turnstileToken !== 'string'
    ) {
      return Response.json({ error: 'Invalid field types' }, { status: 400 })
    }

    // ── Length validation ────────────────────────────────────────────────────
    if (name.length > LIMITS.name)
      return Response.json({ error: `Name must be ${LIMITS.name} characters or fewer` }, { status: 400 })
    if (email.length > LIMITS.email)
      return Response.json({ error: `Email must be ${LIMITS.email} characters or fewer` }, { status: 400 })
    if (subject.length > LIMITS.subject)
      return Response.json({ error: `Subject must be ${LIMITS.subject} characters or fewer` }, { status: 400 })
    if (message.length > LIMITS.message)
      return Response.json({ error: `Message must be ${LIMITS.message} characters or fewer` }, { status: 400 })

    // ── Email format validation ──────────────────────────────────────────────
    if (!validateEmail(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // ── Turnstile verification ───────────────────────────────────────────────
    const ip =
      request.headers.get('cf-connecting-ip') ??
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      ''

    const isHuman = await verifyTurnstile(turnstileToken, ip, env.TURNSTILE_SECRET_KEY)
    if (!isHuman) {
      console.warn(JSON.stringify({ event: 'contact_turnstile_failed', requestId, ts: new Date().toISOString() }))
      return Response.json({ error: 'Turnstile verification failed' }, { status: 403 })
    }

    // ── Sanitize ──────────────────────────────────────────────────────────────
    const safeName    = htmlEscape(sanitizeField(name))
    const safeEmail   = htmlEscape(sanitizeField(email))
    const safeSubject = htmlEscape(sanitizeField(subject))
    const safeMessage = htmlEscape(sanitizeField(message))

    // ── Send via Resend REST API (no SDK — pure fetch) ────────────────────────
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Contact Form <hello@zrl.dev>',
        to:   ['hello@zrl.dev'],
        reply_to: safeEmail,
        subject: `[zrl.dev] ${safeSubject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #111;">New message from zrl.dev</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #555; width: 80px;"><strong>Name:</strong></td>
                <td style="padding: 8px 0;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555;"><strong>Email:</strong></td>
                <td style="padding: 8px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555;"><strong>Subject:</strong></td>
                <td style="padding: 8px 0;">${safeSubject}</td>
              </tr>
            </table>
            <hr style="margin: 16px 0; border: none; border-top: 1px solid #eee;" />
            <p style="white-space: pre-wrap; color: #333; word-break: break-word;">${safeMessage}</p>
            <hr style="margin: 16px 0; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 11px; color: #aaa;">Request ID: ${requestId}</p>
          </div>
        `,
      }),
    })

    if (!resendRes.ok) {
      const errBody = await resendRes.text()
      throw new Error(`Resend API error ${resendRes.status}: ${errBody}`)
    }

    console.log(JSON.stringify({
      event: 'contact_form_sent',
      requestId,
      subjectLength: subject.length,
      messageLength: message.length,
      ts: new Date().toISOString(),
    }))

    return Response.json({ success: true, requestId })

  } catch (err) {
    console.error(JSON.stringify({
      event: 'contact_form_error',
      requestId,
      error: err instanceof Error ? err.message : String(err),
      ts: new Date().toISOString(),
    }))
    return Response.json({ error: 'Internal server error', requestId }, { status: 500 })
  }
}
