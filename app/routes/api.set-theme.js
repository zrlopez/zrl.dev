import { json, createCookieSessionStorage } from '@remix-run/cloudflare';

export async function action({ request, context }) {
  const formData = await request.formData();
  const theme = formData.get('theme');

  let sessionSecret =
    context?.cloudflare?.env?.SESSION_SECRET ||
    context?.env?.SESSION_SECRET ||
    process.env.SESSION_SECRET;
  if (!sessionSecret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET missing — set in Vercel/Cloudflare env');
    }
    console.warn('SESSION_SECRET missing, using fallback-secret (preview only)');
    sessionSecret = 'fallback-secret';
  }
  const { getSession, commitSession } = createCookieSessionStorage({
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

  const session = await getSession(request.headers.get('Cookie'));
  session.set('theme', theme);

  return json(
    { status: 'success' },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  );
}
