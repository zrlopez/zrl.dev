/**
 * Contact-form env validation. Reads from a resolved env bag
 * (Cloudflare context, process.env, or Vercel env).
 */

function read(env, key) {
  const value = env?.[key];
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * @param {Record<string, unknown> | undefined} env
 * @returns {{
 *   RESEND_API_KEY: string,
 *   TURNSTILE_SECRET_KEY: string,
 *   TURNSTILE_SITE_KEY: string,
 *   TURNSTILE_HOSTNAMES: string[],
 *   CONTACT_TO: string,
 *   CONTACT_FROM: string,
 * }}
 */
export function validateContactEnv(env = {}) {
  const errors = [];

  const RESEND_API_KEY = read(env, 'RESEND_API_KEY');
  const TURNSTILE_SECRET_KEY =
    read(env, 'TURNSTILE_SECRET_KEY') || read(env, 'TURNSTILE_SECRET');
  const TURNSTILE_SITE_KEY =
    read(env, 'TURNSTILE_SITE_KEY') ||
    read(env, 'NEXT_PUBLIC_TURNSTILE_SITE_KEY') ||
    read(env, 'VITE_TURNSTILE_SITE_KEY');

  const CONTACT_TO = read(env, 'CONTACT_TO') || 'hello@zrl.dev';
  const CONTACT_FROM =
    read(env, 'CONTACT_FROM') || 'Contact Form <hello@zrl.dev>';

  const hostnamesRaw =
    read(env, 'TURNSTILE_HOSTNAMES') ||
    'zrl.dev,www.zrl.dev,localhost,127.0.0.1';
  const TURNSTILE_HOSTNAMES = hostnamesRaw
    .split(',')
    .map(h => h.trim().toLowerCase())
    .filter(Boolean);

  if (!RESEND_API_KEY) errors.push('RESEND_API_KEY is missing');
  if (!TURNSTILE_SECRET_KEY) errors.push('TURNSTILE_SECRET_KEY is missing');
  if (!TURNSTILE_SITE_KEY) errors.push('TURNSTILE_SITE_KEY is missing');

  if (RESEND_API_KEY && !RESEND_API_KEY.startsWith('re_')) {
    errors.push('RESEND_API_KEY has unexpected format (expected prefix: re_)');
  }

  if (TURNSTILE_SECRET_KEY && TURNSTILE_SECRET_KEY.length < 20) {
    errors.push('TURNSTILE_SECRET_KEY appears too short (expected >= 20 characters)');
  }

  if (errors.length > 0) {
    const err = new Error(
      `[env] Contact configuration errors:\n${errors.map(e => `  • ${e}`).join('\n')}`
    );
    err.code = 'CONTACT_ENV_INVALID';
    err.details = errors;
    throw err;
  }

  return {
    RESEND_API_KEY,
    TURNSTILE_SECRET_KEY,
    TURNSTILE_SITE_KEY,
    TURNSTILE_HOSTNAMES,
    CONTACT_TO,
    CONTACT_FROM,
  };
}

export function resolveRuntimeEnv(context) {
  return (
    context?.cloudflare?.env ||
    context?.env ||
    (typeof process !== 'undefined' ? process.env : {}) ||
    {}
  );
}
