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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
                <rect width="32" height="32" rx="7" fill="#c0281d"/>
                <text
                  x="16"
                  y="23"
                  textAnchor="middle"
                  fontFamily="Nunito, ui-rounded, system-ui, sans-serif"
                  fontWeight="800"
                  fontStyle="italic"
                  fontSize="16"
                  letterSpacing="-1"
                  fill="#ffffff"
                >zrl</text>
              </svg>
              <span className="font-semibold">Zachary Ryan Lopez</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              AI/ML data operations specialist focused on building systems that improve 
              data quality and user experience. Based in Austin, TX.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                href="https://github.com/zrlopez"
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
                href="mailto:z@zrl.dev"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {[
                { name: 'About', href: '/#about' },
                { name: 'Experience', href: '/#experience' },
                { name: 'Projects', href: '/#projects' },
                { name: 'Contact', href: '/#contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h3 className="font-semibold mb-4">Projects</h3>
            <ul className="space-y-2">
              {[
                { name: 'ML Incident Playbook', href: 'https://mlops.zrl.dev' },
                { name: 'Annotation Dashboard', href: '/projects/annotation-dashboard' },
                { name: 'All Projects', href: '/projects' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
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
                Duloup Holdings
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
