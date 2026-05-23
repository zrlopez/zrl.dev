/** @type {import('next').NextConfig} */

// ── Security Headers ─────────────────────────────────────────────────────────
// Applied to all routes. CSP is the primary XSS mitigation layer;
// HSTS enforces encrypted transport; Permissions-Policy reduces passive
// fingerprinting and API abuse surface.
//
// NOTE: 'unsafe-inline' in style-src is required by Tailwind CSS and
// next/font (Google Fonts inlined via CSS variable). Tighten to nonce-based
// CSP if inline styles are eliminated in a future refactor.
// ─────────────────────────────────────────────────────────────────────────────
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // next/script and framer-motion require inline scripts during hydration
      "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
      // Tailwind utility classes and next/font inject inline styles
      "style-src 'self' 'unsafe-inline'",
      // next/font inlines fonts; data: covers SVG data URIs in icons
      "font-src 'self' data:",
      // GitHub avatar proxy via Next.js image optimizer
      "img-src 'self' data: blob: https://avatars.githubusercontent.com https://github.com",
      // Turnstile widget and Resend (no client-side fetch to Resend)
      "connect-src 'self' https://challenges.cloudflare.com",
      // Turnstile loads its challenge iframe from Cloudflare
      "frame-src https://challenges.cloudflare.com",
      // Prevents clickjacking — belt-and-suspenders with X-Frame-Options
      "frame-ancestors 'none'",
      // Restrict form POST targets to same origin
      "form-action 'self'",
      // Prevent base tag hijacking
      "base-uri 'self'",
      // Block mixed content upgrades are handled by HSTS;
      // upgrade-insecure-requests ensures any legacy http: references upgrade
      "upgrade-insecure-requests",
    ].join('; '),
  },
  {
    // HSTS: 2 years, all subdomains, HSTS preload list eligible.
    // Once deployed, removing this header takes up to 2 years to expire in browsers.
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // strict-origin-when-cross-origin: sends full URL to same-origin,
    // origin-only to cross-origin HTTPS, nothing to HTTP.
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    // Disable browser features not used by this site.
    // Prevents passive fingerprinting and API surface abuse.
    key: 'Permissions-Policy',
    value: [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'bluetooth=()',
      'accelerometer=()',
      'gyroscope=()',
      'magnetometer=()',
    ].join(', '),
  },
  {
    // Prevents browsers from pre-fetching DNS for links on this page.
    // Reduces passive information leakage about user navigation intent.
    key: 'X-DNS-Prefetch-Control',
    value: 'off',
  },
]

const nextConfig = {
  // experimental.appDir is no longer needed in Next.js 14+ (App Router is stable)
  images: {
    // remotePatterns replaces the deprecated images.domains API.
    // Scoped to specific protocols and hostnames only — no wildcard paths.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/u/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  // Harden production builds
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
