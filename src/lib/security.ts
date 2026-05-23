/**
 * security.ts
 * Shared server-side security utilities.
 * Import only in server components and API routes — never in client bundles.
 */

/**
 * Escapes HTML special characters to prevent injection into email bodies
 * or any server-rendered HTML context.
 *
 * Converts: & < > " ' → &amp; &lt; &gt; &quot; &#39;
 */
export function htmlEscape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;')  // forward-slash: closes HTML tags in some parsers
    .replace(/`/g, '&#96;')    // backtick: template literal injection in some JS engines
}

/**
 * Validates an email address against an RFC 5321-compatible pattern.
 * Blocks header-injection characters (\r, \n) explicitly.
 */
export function validateEmail(email: string): boolean {
  if (/[\r\n]/.test(email)) return false  // header injection guard
  const pattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,63}$/
  return pattern.test(email.trim())
}

/**
 * Trims and normalizes whitespace in a user-supplied string field.
 * Collapses internal runs of whitespace to single spaces.
 * Does NOT strip content — that is htmlEscape's job.
 */
export function sanitizeField(value: string): string {
  return value.trim().replace(/[\t\r]+/g, ' ')
}
