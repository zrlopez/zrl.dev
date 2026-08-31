/**
 * Shared server-side security utilities for contact / form handling.
 * Keep this module free of React imports so it stays server-safe.
 */

export function sanitizeField(str, allowNewlines = false) {
  if (typeof str !== 'string') return '';
  const controlChars = allowNewlines
    ? /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F\u0080-\u009F]/g
    : /[\u0000-\u001F\u007F\u0080-\u009F]/g;
  return str.replace(controlChars, '').trim();
}

export function sanitizeHeaderField(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[\r\n\t]/g, ' ')
    .replace(/[\u0000-\u001F\u007F\u0080-\u009F]/g, '')
    .trim();
}

export function htmlEscape(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#96;');
}

export function validateEmail(email) {
  if (!email || typeof email !== 'string' || email.length > 254) return false;
  if (/[\r\n]/.test(email)) return false;
  if (/[^\x00-\x7F]/.test(email)) return false;
  const pattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,63}$/;
  return pattern.test(email.trim());
}

export async function hashIp(ip) {
  const data = new TextEncoder().encode(ip || 'unknown');
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16);
}
