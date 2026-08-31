import { redirect } from '@remix-run/cloudflare';

export const loader = () => redirect('/tools', 301);

export default function UsesRedirect() {
  return null;
}
