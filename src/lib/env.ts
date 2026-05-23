/**
 * env.ts
 * Centralized environment variable validation with format guards.
 *
 * Call validateEnv() at the top of any server-side handler that requires
 * runtime configuration. Fails loudly and early rather than producing
 * cryptic downstream errors from Resend (401) or Turnstile (403).
 *
 * This module is intentionally server-only — never import into client
 * components (it would expose expected secret shapes to the browser bundle).
 *
 * REM-10: Added format guards:
 *   - RESEND_API_KEY must start with 're_' (Resend's issued key prefix)
 *   - TURNSTILE_SECRET_KEY must be >= 20 characters
 * Errors are deliberately vague in production (no secret value leakage)
 * but include the variable name and the expected format for operators.
 */

import 'server-only'

interface ServerEnv {
  RESEND_API_KEY: string
  TURNSTILE_SECRET_KEY: string
}

/**
 * Validates that all required server-side environment variables are present,
 * non-empty, and match their expected formats. Throws a descriptive error
 * listing every failed check so operators can fix all issues in one restart.
 */
export function validateEnv(): ServerEnv {
  const errors: string[] = []

  const RESEND_API_KEY       = process.env.RESEND_API_KEY       ?? ''
  const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY ?? ''

  // Presence checks
  if (!RESEND_API_KEY)       errors.push('RESEND_API_KEY is missing')
  if (!TURNSTILE_SECRET_KEY) errors.push('TURNSTILE_SECRET_KEY is missing')

  // Format guards — only check format when the value is present
  if (RESEND_API_KEY && !RESEND_API_KEY.startsWith('re_')) {
    errors.push(
      'RESEND_API_KEY has an unexpected format (expected prefix: re_). ' +
      'Verify the key was copied correctly from resend.com/api-keys.',
    )
  }

  if (TURNSTILE_SECRET_KEY && TURNSTILE_SECRET_KEY.length < 20) {
    errors.push(
      'TURNSTILE_SECRET_KEY appears too short (expected >= 20 characters). ' +
      'Verify the key was copied correctly from the Cloudflare Turnstile dashboard.',
    )
  }

  if (errors.length > 0) {
    throw new Error(
      '[env] Environment configuration errors:\n' +
      errors.map(e => `  • ${e}`).join('\n') +
      '\nCheck your Vercel project settings or local .env.local file.',
    )
  }

  return { RESEND_API_KEY, TURNSTILE_SECRET_KEY }
}
