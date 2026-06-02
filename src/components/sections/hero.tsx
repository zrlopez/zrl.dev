'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Download } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto container-padding section-padding w-full">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <p className="text-primary font-medium mb-4 tracking-wider text-sm uppercase">
              AI / ML Data Operations &amp; Technical Support
            </p>

            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-none tracking-tight">
              <span className="block">Zachary Ryan</span>
              <span className="block text-primary">Lopez</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl leading-relaxed">
              Building reliable data systems, ML infrastructure, and precise annotation pipelines
              — where operational rigor meets technical depth.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="#contact"
                className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 group"
              >
                Get In Touch
                <ArrowDown className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform duration-200" />
              </Link>

              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center px-8 py-3 border border-border rounded-lg font-medium hover:bg-secondary transition-colors duration-200 group"
              >
                <Download className="mr-2 w-4 h-4" />
                Resume
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
