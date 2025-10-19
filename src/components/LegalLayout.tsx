'use client'

import Link from 'next/link'

export default function LegalLayout({ children, title }: { children: React.ReactNode, title: string }) {
  return (
    <section className="section-padding">
      <div className="max-w-4xl mx-auto container-padding">
        <div className="mb-10">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to Home</Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{title}</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {children}
        </div>
      </div>
    </section>
  )
}
