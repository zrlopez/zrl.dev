'use client'

import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary/20 border-t border-border">
      <div className="max-w-7xl mx-auto container-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">ZRL</span>
              </div>
              <span className="font-semibold">Zachary Ryan Lopez</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              AI/ML data operations specialist focused on building systems that improve 
              data quality and user experience. Based in Austin, TX.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                href="https://github.com/zrduloup"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="https://linkedin.com/in/zrlopez"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:hello@zrl.dev"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="#about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                About
              </Link>
              <Link href="#experience" className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                Experience
              </Link>
              <Link href="#projects" className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                Projects
              </Link>
              <Link href="#contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                Contact
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <div className="space-y-2">
              <Link href="/resume.pdf" className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                Resume
              </Link>
              <Link href="/privacy" className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>
              © {currentYear}{' '}
              <Link 
                href="https://duloup.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors duration-200"
              >
                DULOUP
              </Link>
              . All rights reserved.
            </p>
            <p className="mt-2 sm:mt-0">
              Built with Next.js, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}