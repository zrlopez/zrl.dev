import { Nunito } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import './globals.css'
import type { Metadata } from 'next'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Zachary Ryan Lopez | AI/ML Data Specialist',
    template: '%s | ZRL',
  },
  description: 'Portfolio of Zachary Ryan Lopez — AI/ML, data ops, support engineering, and brand systems.',
  keywords: ['AI/ML', 'Data Operations', 'Support Engineering', 'Portfolio', 'Houston', 'Texas'],
  authors: [{ name: 'Zachary Ryan Lopez' }],
  creator: 'Zachary Ryan Lopez',
  metadataBase: new URL('https://zrl.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zrl.dev',
    siteName: 'Zachary Ryan Lopez',
    title: 'Zachary Ryan Lopez | AI/ML Data Specialist',
    description: 'Portfolio of Zachary Ryan Lopez — AI/ML, data ops, support engineering, and brand systems.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Zachary Ryan Lopez Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zachary Ryan Lopez | AI/ML Data Specialist',
    description: 'Portfolio of Zachary Ryan Lopez — AI/ML, data ops, support engineering, and brand systems.',
    images: ['/og-image.jpg'],
  },
  robots: {
    // Indexing enabled — this portfolio supports active job search visibility.
    // Previously disabled (index: false). Flipped intentionally.
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // suppressHydrationWarning is intentional here — next-themes writes the
    // resolved color scheme (class="dark" or class="light") to <html> on the
    // client after SSR, which always causes a mismatch. Suppressing at the
    // <html> element only prevents false-positive hydration warnings without
    // masking real component-level hydration bugs.
    <html lang="en" className={nunito.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#2B2B2B" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
