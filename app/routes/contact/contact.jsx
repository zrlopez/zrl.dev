import { Button } from '~/components/button';
import { DecoderText } from '~/components/decoder-text';
import { Divider } from '~/components/divider';
import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { Icon } from '~/components/icon';
import { Input } from '~/components/input';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { Turnstile } from '~/components/turnstile';
import { tokens } from '~/components/theme-provider/theme';
import { Transition } from '~/components/transition';
import { useFormInput } from '~/hooks';
import { useRef, useState } from 'react';
import { cssProps, msToNum, numToMs } from '~/utils/style';
import { baseMeta } from '~/utils/meta';
import { resolveRuntimeEnv, validateContactEnv } from '~/utils/env';
import { checkContactRateLimit } from '~/utils/rate-limit';
import {
  hashIp,
  htmlEscape,
  sanitizeField,
  sanitizeHeaderField,
  validateEmail,
} from '~/utils/security';
import { verifyTurnstile } from '~/utils/turnstile';
import { Form, useActionData, useLoaderData, useNavigation } from '@remix-run/react';
import { json } from '@remix-run/cloudflare';
import styles from './contact.module.css';

export const meta = () => {
  return baseMeta({
    title: 'Contact',
    description:
      'Send me a message if you’re interested in discussing a project or if you just want to say hi',
  });
};

const LIMITS = {
  name: 100,
  email: 254,
  subject: 200,
  message: 5_000,
  turnstileToken: 2_048,
};

const ALLOWED_ORIGINS = new Set([
  'https://zrl.dev',
  'https://www.zrl.dev',
  'http://localhost:7777',
  'http://127.0.0.1:7777',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);

function getClientIp(request) {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

function isAllowedOrigin(origin, env) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;

  // Allow Vercel preview hosts for this project only.
  try {
    const { hostname, protocol } = new URL(origin);
    if (protocol !== 'https:') return false;
    if (hostname.endsWith('.vercel.app') && hostname.includes('zrl')) return true;
    if (hostname.endsWith('.pages.dev') && hostname.includes('zrl')) return true;
  } catch {
    return false;
  }

  // Explicit extra origins via env (comma-separated).
  const extra = String(env.CONTACT_ALLOWED_ORIGINS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  return extra.includes(origin);
}

export async function loader({ context }) {
  const env = resolveRuntimeEnv(context);
  const siteKey =
    env.TURNSTILE_SITE_KEY ||
    env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
    env.VITE_TURNSTILE_SITE_KEY ||
    '';

  return json({
    turnstileSiteKey: siteKey,
  });
}

export async function action({ context, request }) {
  const startedAt = Date.now();
  const requestId = crypto.randomUUID();
  const env = resolveRuntimeEnv(context);
  const origin = request.headers.get('origin') || '';

  const actionHeaders = {
    'X-Request-Id': requestId,
    'Cache-Control': 'no-store, max-age=0',
    Pragma: 'no-cache',
  };

  try {
    if (!isAllowedOrigin(origin, env)) {
      console.warn(
        JSON.stringify({
          event: 'contact_origin_rejected',
          requestId,
          origin,
          ts: new Date().toISOString(),
        })
      );
      return json(
        { errors: { form: 'Forbidden origin.' } },
        { status: 403, headers: actionHeaders }
      );
    }

    const ip = getClientIp(request);
    const kv = env.RateLimitKV || env.RATE_LIMIT_KV || null;
    const rateLimit = await checkContactRateLimit(ip, kv, requestId);

    if (!rateLimit.allowed) {
      console.warn(
        JSON.stringify({
          event: 'contact_rate_limited',
          requestId,
          ip_hash: await hashIp(ip),
          retryAfter: rateLimit.retryAfter,
          ts: new Date().toISOString(),
        })
      );
      return json(
        { errors: { form: 'Too many requests. Please try again later.' } },
        {
          status: 429,
          headers: {
            ...actionHeaders,
            'Retry-After': String(rateLimit.retryAfter || 60),
          },
        }
      );
    }

    let contactEnv;
    try {
      contactEnv = validateContactEnv(env);
    } catch (error) {
      console.error(
        JSON.stringify({
          event: 'contact_env_missing',
          requestId,
          error: error instanceof Error ? error.message : String(error),
          ts: new Date().toISOString(),
        })
      );
      return json(
        { errors: { form: 'Server configuration error. Please try again later.' } },
        { status: 500, headers: actionHeaders }
      );
    }

    const formData = await request.formData();

    // Honeypot — bots fill hidden "website" field; humans don't.
    const honeypot = String(formData.get('website') || '');
    if (honeypot) {
      console.warn(
        JSON.stringify({
          event: 'contact_honeypot_tripped',
          requestId,
          ts: new Date().toISOString(),
        })
      );
      // Fake success so bots don't iterate.
      return json({ success: true, requestId }, { headers: actionHeaders });
    }

    const name = sanitizeField(String(formData.get('name') || ''));
    const email = sanitizeField(String(formData.get('email') || ''));
    const subject = sanitizeField(String(formData.get('subject') || ''));
    const message = sanitizeField(String(formData.get('message') || ''), true);
    const turnstileToken = sanitizeField(
      String(
        formData.get('cf-turnstile-response') ||
          formData.get('turnstileToken') ||
          ''
      )
    );

    const errors = {};

    if (!name) errors.name = 'Please enter your name.';
    else if (name.length > LIMITS.name)
      errors.name = `Name must be ${LIMITS.name} characters or fewer.`;

    if (!email || !validateEmail(email))
      errors.email = 'Please enter a valid email address.';
    else if (email.length > LIMITS.email)
      errors.email = `Email must be ${LIMITS.email} characters or fewer.`;

    if (!subject) errors.subject = 'Please enter a subject.';
    else if (subject.length > LIMITS.subject)
      errors.subject = `Subject must be ${LIMITS.subject} characters or fewer.`;

    if (!message) errors.message = 'Please enter a message.';
    else if (message.length > LIMITS.message)
      errors.message = `Message must be ${LIMITS.message} characters or fewer.`;

    if (!turnstileToken || turnstileToken.length > LIMITS.turnstileToken) {
      errors.form = 'Security check required. Please complete the verification.';
    }

    if (Object.keys(errors).length > 0) {
      return json({ errors }, { status: 400, headers: actionHeaders });
    }

    const turnstile = await verifyTurnstile({
      token: turnstileToken,
      secret: contactEnv.TURNSTILE_SECRET_KEY,
      ip,
      expectedAction: 'contact',
      expectedHostnames: contactEnv.TURNSTILE_HOSTNAMES,
    });

    if (!turnstile.ok) {
      console.warn(
        JSON.stringify({
          event: 'contact_turnstile_failed',
          requestId,
          reason: turnstile.reason,
          ts: new Date().toISOString(),
        })
      );
      return json(
        { errors: { form: 'Security check failed. Please try again.' } },
        { status: 403, headers: actionHeaders }
      );
    }

    const safeName = htmlEscape(name);
    const safeEmail = htmlEscape(email);
    const safeSubject = htmlEscape(subject);
    const safeMessage = htmlEscape(message);
    const headerSubject = sanitizeHeaderField(subject);
    const replyTo = sanitizeHeaderField(email);

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${contactEnv.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: contactEnv.CONTACT_FROM,
        to: [contactEnv.CONTACT_TO],
        reply_to: replyTo,
        subject: `[zrl.dev contact] ${headerSubject}`,
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
          `      <td style="padding:8px 0;"><a href="mailto:${encodeURIComponent(email)}">${safeEmail}</a></td>`,
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
    });

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text();
      console.error(
        JSON.stringify({
          event: 'contact_resend_error',
          requestId,
          status: resendResponse.status,
          error: errorBody.slice(0, 500),
          ts: new Date().toISOString(),
        })
      );
      return json(
        { errors: { form: 'Email delivery failed. Please try again later.' } },
        { status: 502, headers: actionHeaders }
      );
    }

    console.log(
      JSON.stringify({
        event: 'contact_form_sent',
        requestId,
        durationMs: Date.now() - startedAt,
        subjectLength: subject.length,
        messageLength: message.length,
        remaining: rateLimit.remaining,
        ts: new Date().toISOString(),
      })
    );

    return json({ success: true, requestId }, { headers: actionHeaders });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: 'contact_form_error',
        requestId,
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error),
        ts: new Date().toISOString(),
      })
    );
    return json(
      { errors: { form: 'Internal server error. Please try again later.' }, requestId },
      { status: 500, headers: actionHeaders }
    );
  }
}

export const Contact = () => {
  const { turnstileSiteKey } = useLoaderData();
  const errorRef = useRef();
  const name = useFormInput('');
  const email = useFormInput('');
  const subject = useFormInput('');
  const message = useFormInput('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const initDelay = tokens.base.durationS;
  const actionData = useActionData();
  const { state } = useNavigation();
  const sending = state === 'submitting';

  const errorMessage =
    actionData?.errors?.form ||
    actionData?.errors?.name ||
    actionData?.errors?.email ||
    actionData?.errors?.subject ||
    actionData?.errors?.message;

  return (
    <Section className={styles.contact}>
      <Transition unmount in={!actionData?.success} timeout={1600}>
        {({ status, nodeRef }) => (
          <Form
            unstable_viewTransition
            className={styles.form}
            method="post"
            ref={nodeRef}
          >
            <Heading
              className={styles.title}
              data-status={status}
              level={3}
              as="h1"
              style={getDelay(tokens.base.durationXS, initDelay, 0.3)}
            >
              <DecoderText text="Say hello" start={status !== 'exited'} delay={300} />
            </Heading>
            <Divider
              className={styles.divider}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay, 0.4)}
            />

            {/* Honeypot — leave empty */}
            <Input
              className={styles.botkiller}
              label="Website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />

            <Input
              required
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay)}
              autoComplete="name"
              label="Your name"
              name="name"
              maxLength={LIMITS.name}
              {...name}
            />
            <Input
              required
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay, 1.05)}
              autoComplete="email"
              label="Your email"
              type="email"
              name="email"
              maxLength={LIMITS.email}
              {...email}
            />
            <Input
              required
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay, 1.1)}
              autoComplete="off"
              label="Subject"
              name="subject"
              maxLength={LIMITS.subject}
              {...subject}
            />
            <Input
              required
              multiline
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationS, initDelay)}
              autoComplete="off"
              label="Message"
              name="message"
              maxLength={LIMITS.message}
              {...message}
            />

            <div
              className={styles.turnstile}
              data-status={status}
              style={getDelay(tokens.base.durationM, initDelay)}
            >
              <Turnstile
                siteKey={turnstileSiteKey}
                action="contact"
                onTokenChange={setTurnstileToken}
              />
            </div>

            <Transition
              unmount
              in={!sending && !!errorMessage}
              timeout={msToNum(tokens.base.durationM)}
            >
              {({ status: errorStatus, nodeRef: errNodeRef }) => (
                <div
                  className={styles.formError}
                  ref={errNodeRef}
                  data-status={errorStatus}
                  style={cssProps({
                    height: errorStatus ? errorRef.current?.offsetHeight : 0,
                  })}
                >
                  <div className={styles.formErrorContent} ref={errorRef}>
                    <div className={styles.formErrorMessage}>
                      <Icon className={styles.formErrorIcon} icon="error" />
                      {errorMessage}
                    </div>
                  </div>
                </div>
              )}
            </Transition>

            <Button
              className={styles.button}
              data-status={status}
              data-sending={sending}
              style={getDelay(tokens.base.durationM, initDelay)}
              disabled={sending || !turnstileToken}
              loading={sending}
              loadingText="Sending..."
              icon="send"
              type="submit"
            >
              Send message
            </Button>
          </Form>
        )}
      </Transition>
      <Transition unmount in={!!actionData?.success}>
        {({ status, nodeRef }) => (
          <div className={styles.complete} aria-live="polite" ref={nodeRef}>
            <Heading
              level={3}
              as="h3"
              className={styles.completeTitle}
              data-status={status}
            >
              Message Sent
            </Heading>
            <Text
              size="l"
              as="p"
              className={styles.completeText}
              data-status={status}
              style={getDelay(tokens.base.durationXS)}
            >
              I’ll get back to you within a couple days, sit tight
            </Text>
            <Button
              secondary
              iconHoverShift
              className={styles.completeButton}
              data-status={status}
              style={getDelay(tokens.base.durationM)}
              href="/"
              icon="chevron-right"
            >
              Back to homepage
            </Button>
          </div>
        )}
      </Transition>
      <Footer className={styles.footer} />
    </Section>
  );
};

function getDelay(delayMs, offset = numToMs(0), multiplier = 1) {
  const numDelay = msToNum(delayMs) * multiplier;
  return cssProps({ delay: numToMs((msToNum(offset) + numDelay).toFixed(0)) });
}
