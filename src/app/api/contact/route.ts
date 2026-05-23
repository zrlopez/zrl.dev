import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { htmlEscape, validateEmail, sanitizeField } from '@/lib/security'
import { validateEnv } from '@/lib/env'

// Node.js runtime: required for Resend SDK (uses node:buffer internals).
// Edge runtime would fail at module resolution for this route.
export const runtime = 'nodejs'

// Allowlisted origins — CSRF protection
const ALLOWED_ORIGINS = ['https://zrl.dev']

// Field length constraints
const LIMITS = {
  name: 100,
  email: 254,   // RFC 5321 maximum
  subject: 200,
  message: 5000,
} as const

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const { TURNSTILE_SECRET_KEY } = validateEnv()
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: ip,
    }),
  })
  const data = await res.json() as { success: boolean }
  return data.success === true
}

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID()

  try {
    // ── CSRF: Origin check ────────────────────────────────────────────────────
    const origin = req.headers.get('origin')
    if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
      console.warn(JSON.stringify({
        event: 'contact_origin_rejected',
        requestId,
        origin: origin ?? 'none',
        ts: new Date().toISOString(),
      }))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // ── Body size guard ───────────────────────────────────────────────────────
    const contentLength = req.headers.get('content-length')
    if (contentLength && parseInt(contentLength, 10) > 10_000) {
      return NextResponse.json({ error: 'Request too large' }, { status: 413 })
    }

    const { RESEND_API_KEY } = validateEnv()
    const resend = new Resend(RESEND_API_KEY)

    // ── Parse body ────────────────────────────────────────────────────────────
    let body: Record<string, unknown>
    try {
      body = await req.json() as Record<string, unknown>
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { name, email, subject, message, turnstileToken } = body

    // ── Presence check ───────────────────────────────────────────────────────
    if (!name || !email || !subject || !message || !turnstileToken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // ── Type narrowing ───────────────────────────────────────────────────────
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof subject !== 'string' ||
      typeof message !== 'string' ||
      typeof turnstileToken !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid field types' }, { status: 400 })
    }

    // ── Length validation ────────────────────────────────────────────────────
    if (name.length > LIMITS.name) {
      return NextResponse.json({ error: `Name must be ${LIMITS.name} characters or fewer` }, { status: 400 })
    }
    if (email.length > LIMITS.email) {
      return NextResponse.json({ error: `Email must be ${LIMITS.email} characters or fewer` }, { status: 400 })
    }
    if (subject.length > LIMITS.subject) {
      return NextResponse.json({ error: `Subject must be ${LIMITS.subject} characters or fewer` }, { status: 400 })
    }
    if (message.length > LIMITS.message) {
      return NextResponse.json({ error: `Message must be ${LIMITS.message} characters or fewer` }, { status: 400 })
    }

    // ── Email format validation ──────────────────────────────────────────────
    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // ── Turnstile verification ───────────────────────────────────────────────
    // Prefer cf-connecting-ip (set by Cloudflare, not spoofable by client);
    // fall back to x-forwarded-for only when not behind Cloudflare proxy.
    const ip =
      req.headers.get('cf-connecting-ip') ??
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      ''

    const isHuman = await verifyTurnstile(turnstileToken, ip)
    if (!isHuman) {
      console.warn(JSON.stringify({
        event: 'contact_turnstile_failed',
        requestId,
        ts: new Date().toISOString(),
      }))
      return NextResponse.json({ error: 'Turnstile verification failed' }, { status: 403 })
    }

    // ── Sanitize all user-controlled fields before HTML interpolation ─────────
    // htmlEscape() converts <, >, &, ", ' to their HTML entity equivalents,
    // preventing HTML/script injection in the outbound email body.
    const safeName    = htmlEscape(sanitizeField(name))
    const safeEmail   = htmlEscape(sanitizeField(email))
    const safeSubject = htmlEscape(sanitizeField(subject))
    const safeMessage = htmlEscape(sanitizeField(message))

    // ── Send email ────────────────────────────────────────────────────────────
    const { error: sendError } = await resend.emails.send({
      from: 'Contact Form <hello@zrl.dev>',
      to:   ['hello@zrl.dev'],
      replyTo: safeEmail,
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
              <td style="padding: 8px 0;">
                <a href="mailto:${safeEmail}">${safeEmail}</a>
              </td>
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
    })

    // ── Resend v4: check discriminated union error ────────────────────────────
    if (sendError) {
      throw new Error(`Resend delivery failed: ${sendError.message}`)
    }

    // ── Structured audit log (no PII) ─────────────────────────────────────────
    console.log(JSON.stringify({
      event: 'contact_form_sent',
      requestId,
      subjectLength: subject.length,
      messageLength: message.length,
      ts: new Date().toISOString(),
    }))

    return NextResponse.json({ success: true, requestId })

  } catch (err) {
    console.error(JSON.stringify({
      event: 'contact_form_error',
      requestId,
      error: err instanceof Error ? err.message : String(err),
      ts: new Date().toISOString(),
    }))
    return NextResponse.json(
      { error: 'Internal server error', requestId },
      { status: 500 }
    )
  }
}
