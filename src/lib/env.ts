/**
 * env.ts
 * Centralized environment variable validation.
 *
 * Call validateEnv() at the top of any server-side handler or service that
 * requires runtime configuration. Fails loudly and early rather than
 * producing cryptic downstream errors.
 *
 * This module is intentionally server-only — never import into client
 * components (it would expose expected secret names to the browser bundle).
 */

interface ServerEnv {
  RESEND_API_KEY: string
  TURNSTILE_SECRET_KEY: string
}

/**
 * Validates that all required server-side environment variables are present
 * and non-empty. Throws a descriptive error listing every missing variable.
 */
export function validateEnv(): ServerEnv {
  const missing: string[] = []

  const RESEND_API_KEY      = process.env.RESEND_API_KEY ?? ''
  const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY ?? ''

  if (!RESEND_API_KEY)       missing.push('RESEND_API_KEY')
  if (!TURNSTILE_SECRET_KEY) missing.push('TURNSTILE_SECRET_KEY')

  if (missing.length > 0) {
    throw new Error(
      `[env] Missing required environment variables: ${missing.join(', ')}. ` +
      'Check your Vercel project settings or local .env.local file.'
    )
  }

  return { RESEND_API_KEY, TURNSTILE_SECRET_KEY }
}
