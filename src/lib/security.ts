/**
 * security.ts
 * Shared server-side security utilities.
 *
 * IMPORTANT: Import only in server components and Cloudflare Pages Functions.
 * Never import into client bundles — this module has no client-safe surface.
 *
 * Functions in this module are intentionally narrow and composable:
 *   sanitizeField()       — strip control chars, normalize whitespace
 *   sanitizeHeaderField() — sanitizeField + strip RFC 5322 header-folding chars
 *   htmlEscape()          — escape for HTML body contexts ONLY (not headers)
 *   validateEmail()       — RFC 5321 format check + header injection guard
 */

/**
 * Removes non-printable Unicode control characters and normalizes whitespace.
 *
 * Strips all C0 and C1 control characters (U+0000–U+001F, U+007F, U+0080–U+009F)
 * which have no legitimate use in form input and could confuse downstream
 * parsers, log aggregators, or email clients.
 *
 * @param str           Raw user input string.
 * @param allowNewlines If true, preserves \n (U+000A) for multi-line fields
 *                      such as the message body. All other control chars are
 *                      still stripped. Defaults to false.
 */
export function sanitizeField(str: string, allowNewlines = false): string {
  const controlChars = allowNewlines
    ? /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F\u0080-\u009F]/g
    : /[\u0000-\u001F\u007F\u0080-\u009F]/g
  return str.replace(controlChars, '').trim()
}

/**
 * Sanitizes a string for safe inclusion in RFC 5322 email header fields
 * (To, From, Reply-To, Subject).
 *
 * Extends sanitizeField by also stripping:
 *   - Carriage return (\r, U+000D) — header injection
 *   - Line feed (\n, U+000A)       — header injection
 *   - Horizontal tab (\t, U+0009)  — header folding
 *
 * Safe to use directly in email API payloads as From/To/Subject values.
 * Do NOT then also run htmlEscape() on the result — that would corrupt the header.
 */
export function sanitizeHeaderField(str: string): string {
  return str
    .replace(/[\r\n\t]/g, ' ') // flatten newlines/tabs before broader strip
    .replace(/[\u0000-\u001F\u007F\u0080-\u009F]/g, '')
    .trim()
}

/**
 * Escapes HTML special characters.
 *
 * Use ONLY when inserting user-controlled strings into an HTML body context
 * (e.g., the body of an HTML email). Do NOT use for email header fields
 * (To, From, Reply-To, Subject) — HTML encoding is not valid in RFC 5322
 * headers and will break email clients.
 *
 * Converts: & < > " ' / `
 */
export function htmlEscape(str: string): string {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;')
    .replace(/\//g, '&#x2F;')  // closes HTML tags in some legacy parsers
    .replace(/`/g,  '&#96;')   // template-literal injection guard
}

/**
 * Validates an email address against an RFC 5321-compatible pattern.
 *
 * Explicitly blocks \r and \n to prevent email header injection regardless
 * of what sanitization has already been applied upstream. Defense in depth.
 *
 * Returns false for empty strings, strings with whitespace-only content,
 * addresses exceeding 254 characters (RFC 5321 max), or any that fail
 * the format pattern.
 */
export function validateEmail(email: string): boolean {
  if (!email || email.length > 254) return false
  if (/[\r\n]/.test(email))         return false  // header injection guard
  const pattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,63}$/
  return pattern.test(email.trim())
}
