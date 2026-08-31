/**
 * Canonical Turnstile siteverify helper.
 * Tokens are single-use; fail closed on network / schema errors.
 */

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * @param {{
 *   token: string,
 *   secret: string,
 *   ip?: string,
 *   expectedAction?: string,
 *   expectedHostnames?: string[],
 * }} opts
 */
export async function verifyTurnstile({
  token,
  secret,
  ip,
  expectedAction = 'contact',
  expectedHostnames = [],
}) {
  if (typeof token !== 'string' || token.length === 0 || token.length > 2048) {
    return { ok: false, reason: 'invalid_token' };
  }
  if (typeof secret !== 'string' || secret.length === 0) {
    return { ok: false, reason: 'missing_secret' };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (ip && ip !== 'unknown') body.set('remoteip', ip);

  let result;
  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout?.(10_000),
    });
    if (!response.ok) return { ok: false, reason: 'siteverify_http' };
    result = await response.json();
  } catch {
    return { ok: false, reason: 'siteverify_network' };
  }

  if (!result?.success) {
    return {
      ok: false,
      reason: 'not_success',
      errorCodes: result?.['error-codes'] ?? [],
    };
  }

  if (expectedAction && result.action && result.action !== expectedAction) {
    return { ok: false, reason: 'action_mismatch', action: result.action };
  }

  if (expectedHostnames?.length) {
    const hostname = String(result.hostname || '').toLowerCase();
    const allowed = new Set(expectedHostnames.map(h => h.toLowerCase()));
    if (!allowed.has(hostname)) {
      return { ok: false, reason: 'hostname_mismatch', hostname };
    }
  }

  return { ok: true, hostname: result.hostname, action: result.action };
}
