'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Mail, MessageSquare, Send, MapPin, Clock, CheckCircle } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

// ── Field length limits (must mirror backend FIELD_LIMITS in functions/api/contact.ts)
const FIELD_LIMITS = {
  name:    100,
  email:   254,
  subject: 200,
  message: 5_000,
} as const

// ── Turnstile retry budget: 50 attempts × 200 ms = 10 seconds maximum wait
const MAX_TURNSTILE_ATTEMPTS = 50

declare global {
  interface Window {
    turnstile: {
      render:  (container: string | HTMLElement, options: Record<string, unknown>) => string
      reset:   (widgetId: string) => void
      remove:  (widgetId: string) => void
    }
  }
}

export function Contact() {
  const [formData, setFormData] = useState({
    name:    '',
    email:   '',
    subject: '',
    message: '',
  })
  const [isSubmitting,   setIsSubmitting]   = useState(false)
  const [submitted,      setSubmitted]      = useState(false)
  const [error,          setError]          = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const widgetRef       = useRef<string | null>(null)
  const containerRef    = useRef<HTMLDivElement>(null)
  const attemptsRef     = useRef(0)

  useEffect(() => {
    const scriptId = 'cf-turnstile-script'
    if (!document.getElementById(scriptId)) {
      const script        = document.createElement('script')
      script.id           = scriptId
      script.src          = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async        = true
      script.defer        = true
      script.crossOrigin  = 'anonymous'   // ← best practice for external scripts
      document.head.appendChild(script)
    }

    // Reset attempt counter on mount / re-mount
    attemptsRef.current = 0

    const tryRender = () => {
      // Bail out after MAX_TURNSTILE_ATTEMPTS to prevent infinite polling
      if (attemptsRef.current >= MAX_TURNSTILE_ATTEMPTS) {
        setError(
          'Security check failed to load. Please refresh the page and try again.'
        )
        return
      }
      attemptsRef.current += 1

      if (window.turnstile && containerRef.current && !widgetRef.current) {
        widgetRef.current = window.turnstile.render(containerRef.current, {
          sitekey:          process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          callback:         (token: string) => setTurnstileToken(token),
          'expired-callback': () => setTurnstileToken(null),
          'error-callback':   () => {
            setTurnstileToken(null)
            setError('Security check encountered an error. Please refresh the page.')
          },
          theme: 'auto',
        })
      } else {
        setTimeout(tryRender, 200)
      }
    }
    tryRender()

    return () => {
      if (widgetRef.current && window.turnstile) {
        window.turnstile.remove(widgetRef.current)
        widgetRef.current = null
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!turnstileToken) {
      setError('Please complete the security check before submitting.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...formData, turnstileToken }),
      })

      if (!res.ok) {
        const data = await res.json() as { error?: string }
        throw new Error(data.error ?? 'Something went wrong')
      }

      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTurnstileToken(null)
      if (widgetRef.current && window.turnstile) {
        window.turnstile.reset(widgetRef.current)
      }

      setTimeout(() => setSubmitted(false), 6_000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="section-padding">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-medium text-muted-foreground">06</span>
            <h2 className="text-3xl md:text-4xl font-bold">Get In Touch</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            I&apos;m always interested in new opportunities and interesting projects.
            Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">hello@zrl.dev</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">Houston, TX</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-muted-foreground">Usually within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-secondary/30 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h4 className="font-medium">Let&apos;s discuss</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                I&apos;m particularly interested in opportunities involving AI/ML data operations,
                product analytics, or building systems that improve data quality and user experience.
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Success Banner — role=status for polite screen-reader announcement */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  role="status"
                  aria-live="polite"
                  className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-green-500">Message sent!</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Thanks for reaching out — I&apos;ll get back to you as soon as possible.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={FIELD_LIMITS.name}
                    autoComplete="name"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    maxLength={FIELD_LIMITS.email}
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  maxLength={FIELD_LIMITS.subject}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                  placeholder="What&apos;s this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  maxLength={FIELD_LIMITS.message}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 resize-none"
                  placeholder="Tell me about your project or just say hello!"
                />
              </div>

              {/* Turnstile Widget */}
              <div ref={containerRef} aria-label="Security verification" />

              {/* Error — role=alert for immediate screen-reader announcement */}
              {error && (
                <p role="alert" aria-live="assertive" className="text-sm text-red-500">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || submitted || !turnstileToken}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 group"
              >
                {isSubmitting ? (
                  <>
                    <span className="sr-only">Sending message…</span>
                    <span aria-hidden="true">Sending…</span>
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
