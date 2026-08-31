import { json } from '@remix-run/cloudflare';
import { getSessionSecret, getSessionStorage } from '~/utils/session.server';

export async function action({ request, context }) {
  const formData = await request.formData();
  const theme = formData.get('theme');
  const sessionStorage = getSessionStorage(getSessionSecret(context));

  if (!sessionStorage) {
    return json({ status: 'success', persisted: false });
  }

  const { getSession, commitSession } = sessionStorage;

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
