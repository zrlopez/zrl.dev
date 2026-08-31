import { createCookieSessionStorage } from '@remix-run/cloudflare';

export function getSessionSecret(context) {
  return (
    context?.cloudflare?.env?.SESSION_SECRET ||
    context?.env?.SESSION_SECRET ||
    process.env.SESSION_SECRET ||
    null
  );
}

export function getSessionStorage(sessionSecret) {
  if (!sessionSecret) {
    return null;
  }

  return createCookieSessionStorage({
    cookie: {
      name: '__session',
      httpOnly: true,
      maxAge: 604_800,
      path: '/',
      sameSite: 'lax',
      secrets: [sessionSecret],
      secure: true,
    },
  });
}
