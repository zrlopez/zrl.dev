'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Mail, MessageSquare, Send, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'

// ── Field length limits (mirrors functions/api/contact.ts LIMITS) ────────────
const FIELD_LIMITS = {
  name:    100,
  email:   254,
  subject: 200,
  message: 5_000,
} as const

// Maximum retry attempts when waiting for Turnstile to load (~10 seconds).
const TURNSTILE_MAX_ATTEMPTS = 50

// Fetch timeout in milliseconds — fail fast when Resend API is degraded.
const FETCH_TIMEOUT_MS = 15_000

declare global {
  interface Window {
    turnstile: {
      render:  (container: string | HTMLElement, options: Record<string, unknown>) => string
      reset:   (widgetId: string) => void
      remove:  (widgetId: string) => void
    }
  }
}

interface FormData {
  name:    string
  email:   string
  subject: string
  message: string
}

type FieldName = keyof FormData

const INITIAL_FORM: FormData = { name: '', email: '', subject: '', message: '' }

/**
 * Reads the CSP nonce injected by middleware.ts via a <meta name="x-nonce">
 * element in the page layout. Returns an empty string when running on the
 * client before hydration or when the meta tag is absent (dev without middleware).
 */
function getCspNonce(): string {
  if (typeof document === 'undefined') return ''
  return (
    document
      .querySelector<HTMLMetaElement>('meta[name="x-nonce"]')
      ?.getAttribute('content') ?? ''
  )
}

export function Contact() {
  const [formData,       setFormData]       = useState<FormData>(INITIAL_FORM)
  const [isSubmitting,   setIsSubmitting]   = useState(false)
  const [submitted,      setSubmitted]      = useState(false)
  const [error,          setError]          = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [captchaError,   setCaptchaError]   = useState(false)

  const widgetRef    = useRef<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const attemptsRef  = useRef(0)
  // Keeps the AbortController for the in-flight fetch so we can cancel
  // it on unmount or when a new submission starts.
  const abortRef     = useRef<AbortController | null>(null)

  // ── Load and render Turnstile widget ──────────────────────────────────
  const tryRender = useCallback(() => {
    if (attemptsRef.current >= TURNSTILE_MAX_ATTEMPTS) {
      setCaptchaError(true)
      return
    }
    attemptsRef.current += 1

    if (window.turnstile && containerRef.current && !widgetRef.current) {
      widgetRef.current = window.turnstile.render(containerRef.current, {
        sitekey:           process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        callback:          (token: string) => {
          setTurnstileToken(token)
          setCaptchaError(false)
        },
        'expired-callback': () => setTurnstileToken(null),
        'error-callback':   () => {
          setTurnstileToken(null)
          setCaptchaError(true)
        },
        theme: 'auto',
      })
    } else {
      timeoutRef.current = setTimeout(tryRender, 200)
    }
  }, [])

  useEffect(() => {
    const scriptId = 'cf-turnstile-script'

    if (!document.getElementById(scriptId)) {
      const script       = document.createElement('script')
      script.id          = scriptId
      script.src         = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async       = true
      script.defer       = true
      script.crossOrigin = 'anonymous'

      // ── REM-14 FIX: apply CSP nonce so middleware's nonce-gated
      //    script-src directive permits this dynamically created element.
      //    Without this the browser blocks the script silently and the
      //    Turnstile widget never renders.
      const nonce = getCspNonce()
      if (nonce) script.nonce = nonce

      document.head.appendChild(script)
    }

    attemptsRef.current = 0
    tryRender()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      // Cancel any in-flight fetch on unmount.
      abortRef.current?.abort()

      if (widgetRef.current && window.turnstile) {
        window.turnstile.remove(widgetRef.current)
        widgetRef.current = null
      }
    }
  }, [tryRender])

  // ── Form field handler — REM-16: enforce limits in state ──────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const field = name as FieldName
    const limit = FIELD_LIMITS[field]
    // Slice in state so the controlled component value can never exceed the
    // server-side limit even if the input is programmatically populated.
    setFormData(prev => ({ ...prev, [field]: value.slice(0, limit) }))
  }

  // ── Submit handler — REM-15: 15 s AbortController timeout ────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!turnstileToken) {
      setError('Please complete the security check before submitting.')
      return
    }

    // Cancel any stale in-flight request before starting a new one.
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    // Auto-abort after FETCH_TIMEOUT_MS to prevent indefinite spinner
    // when Resend's API is degraded or the network is unreachable.
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...formData, turnstileToken }),
        signal:  controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await res.json() as { error?: string; requestId?: string }

      if (!res.ok) {
        throw new Error(data.error ?? 'Something went wrong. Please try again.')
      }

      setSubmitted(true)
      setFormData(INITIAL_FORM)
      setTurnstileToken(null)
      attemptsRef.current = 0

      if (widgetRef.current && window.turnstile) {
        window.turnstile.reset(widgetRef.current)
      }

      setTimeout(() => setSubmitted(false), 6_000)

    } catch (err) {
      clearTimeout(timeoutId)
      // AbortError is thrown when the signal fires (timeout or unmount).
      // Distinguish between user-visible timeout and a server error.
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Request timed out. Please check your connection and try again.')
      } else {
        const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
        setError(message)
      }
    } finally {
      setIsSubmitting(false)
      abortRef.current = null
    }
  }

  const messageRemaining = FIELD_LIMITS.message - formData.message.length
  const isOverLimit      = messageRemaining < 0
  const isNearLimit      = messageRemaining >= 0 && messageRemaining < 200

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
            {/* Success Banner */}
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
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={FIELD_LIMITS.name}
                    autoComplete="name"
                    aria-required="true"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    maxLength={FIELD_LIMITS.email}
                    autoComplete="email"
                    aria-required="true"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject <span aria-hidden="true" className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  maxLength={FIELD_LIMITS.subject}
                  aria-required="true"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                  placeholder="What&apos;s this about?"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="message" className="block text-sm font-medium">
                    Message <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  {(isNearLimit || isOverLimit) && (
                    <span
                      id="message-count"
                      className={`text-xs tabular-nums ${
                        isOverLimit ? 'text-red-500 font-medium' : 'text-muted-foreground'
                      }`}
                      aria-live="polite"
                    >
                      {isOverLimit
                        ? `${Math.abs(messageRemaining)} over limit`
                        : `${messageRemaining} remaining`}
                    </span>
                  )}
                </div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  maxLength={FIELD_LIMITS.message}
                  aria-required="true"
                  aria-describedby={isNearLimit || isOverLimit ? 'message-count' : undefined}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 resize-none"
                  placeholder="Tell me about your project or just say hello!"
                />
              </div>

              {/* Turnstile Widget */}
              {captchaError ? (
                <div
                  role="alert"
                  className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-600 dark:text-yellow-400"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Security check failed to load. Please{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setCaptchaError(false)
                      attemptsRef.current = 0
                      tryRender()
                    }}
                    className="underline hover:no-underline"
                  >
                    try again
                  </button>
                  {' '}or refresh the page.
                </div>
              ) : (
                <div ref={containerRef} aria-label="Security verification" />
              )}

              {/* Error message */}
              {error && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" aria-hidden="true" />
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || submitted || !turnstileToken || isOverLimit}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 group"
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="sr-only">Sending message, please wait.</span>
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
