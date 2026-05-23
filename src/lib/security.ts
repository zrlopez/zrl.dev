/**
 * security.ts
 * Shared server-side security utilities.
 *
 * IMPORTANT: This module is server-only. The 'server-only' import below
 * causes Next.js to throw a build error if this module is ever imported
 * into a Client Component or the browser bundle — preventing accidental
 * exposure of sanitization logic and keeping the client bundle clean.
 *
 * REM-06: htmlEscape() is now re-exported from html-escaper (a direct
 * dependency of Next.js) to eliminate the risk of the two implementations
 * diverging over time. The API is identical — existing callers require
 * no changes.
 *
 * Functions:
 *   sanitizeField()       — strip control chars, normalize whitespace
 *   sanitizeHeaderField() — sanitizeField + strip RFC 5322 header-folding chars
 *   htmlEscape()          — escape for HTML body contexts ONLY (not headers)
 *   validateEmail()       — RFC 5321 format check + header injection guard
 */

import 'server-only'
import { escape as _htmlEscaperEscape } from 'html-escaper'

/**
 * Removes non-printable Unicode control characters and normalizes whitespace.
 *
 * Strips C0 and C1 control characters (U+0000–U+001F, U+007F, U+0080–U+009F)
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
 * Do NOT also run htmlEscape() on the result — that would corrupt the header.
 */
export function sanitizeHeaderField(str: string): string {
  return str
    .replace(/[\r\n\t]/g, ' ') // flatten before broader strip
    .replace(/[\u0000-\u001F\u007F\u0080-\u009F]/g, '')
    .trim()
}

/**
 * Escapes HTML special characters for safe insertion into HTML body content.
 *
 * REM-06: Delegates to html-escaper rather than maintaining an inline
 * implementation. html-escaper is a production-hardened library that encodes
 * & < > " ' — identical coverage to the previous inline implementation.
 *
 * Use ONLY for HTML body contexts (e.g., HTML email body).
 * Do NOT use for email header fields (To, From, Subject) — HTML encoding
 * is not valid in RFC 5322 headers and will corrupt the header value.
 */
export function htmlEscape(str: string): string {
  return _htmlEscaperEscape(str)
}

/**
 * Validates an email address against an RFC 5321-compatible pattern.
 *
 * Blocks \r and \n unconditionally to prevent header injection regardless
 * of upstream sanitization. Defense in depth.
 *
 * Returns false for empty strings, strings with whitespace-only content,
 * addresses exceeding 254 characters (RFC 5321 max), or any that fail
 * the format pattern. Also rejects addresses with non-ASCII characters
 * (IDN / punycode) to prevent encoding-based bypass attempts.
 */
export function validateEmail(email: string): boolean {
  if (!email || email.length > 254) return false
  if (/[\r\n]/.test(email))         return false  // header injection guard
  if (/[^\x00-\x7F]/.test(email))   return false  // block IDN / non-ASCII
  const pattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,63}$/
  return pattern.test(email.trim())
}
