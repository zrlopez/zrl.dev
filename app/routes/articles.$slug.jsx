import { redirect } from '@remix-run/cloudflare';

export const loader = () => redirect('/experience', 301);

export default function ArticleSlugRedirect() {
  return null;
}
