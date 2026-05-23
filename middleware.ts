import { NextResponse, type NextRequest } from 'next/server'

function buildContentSecurityPolicy(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://challenges.cloudflare.com`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' ",
    "img-src 'self'  blob: https://avatars.githubusercontent.com https://github.com",
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

  requestHeaders.set('x-nonce', nonce)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  response.headers.set('Content-Security-Policy', buildContentSecurityPolicy(nonce))
  return response
}

export const config = {
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon.ico|apple-touch-icon.png|site.webmanifest|robots.txt|sitemap.xml).*)',
  ],
}
