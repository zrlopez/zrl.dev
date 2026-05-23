import { NextResponse, type NextRequest } from 'next/server'

function buildContentSecurityPolicy(nonce: string): string {
  return [
    "default-src 'self'",
    // script-src: nonce-gated; no 'unsafe-inline'
    `script-src 'self' 'nonce-${nonce}' https://challenges.cloudflare.com`,
    "script-src-attr 'none'",
    // style-src: nonce-gated; 'unsafe-inline' removed
    `style-src 'self' 'nonce-${nonce}'`,
    // font-src: trailing whitespace removed
    "font-src 'self'",
    "img-src 'self' blob: https://avatars.githubusercontent.com https://github.com",
    "connect-src 'self' https://challenges.cloudflare.com",
    "frame-src https://challenges.cloudflare.com",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    'upgrade-insecure-requests',
  ].join('; ')
}

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  // Forward nonce to server components via request header so they can
  // render <meta name="x-nonce" content={nonce} /> and pass it to
  // child components that need to nonce dynamic script/style tags.
  requestHeaders.set('x-nonce', nonce)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  response.headers.set(
    'Content-Security-Policy',
    buildContentSecurityPolicy(nonce),
  )

  return response
}

export const config = {
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon.ico|apple-touch-icon.png|site.webmanifest|robots.txt|sitemap.xml).*)',
  ],
}
