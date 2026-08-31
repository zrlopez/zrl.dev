import { humansText } from '~/utils/humans';

export function loader() {
  return new Response(humansText, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
