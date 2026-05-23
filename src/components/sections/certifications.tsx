'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, ExternalLink, X } from 'lucide-react'

interface Certification {
  id: string
  title: string
  issuer: string
  date: string
  status: 'earned' | 'expected'
  // To use base64: set placeholderSrc to `data:image/png;base64,${yourBase64String}`
  placeholderSrc: string | null
  verifyUrl?: string
}

const CERTS: Certification[] = [
  {
    id: 'harvard-cs50p',
    title: 'Programming with Python (CS50P)',
    issuer: 'Harvard University',
    date: 'May 20, 2026',
    status: 'earned',
    placeholderSrc: '/certs/Harvard-CS50P-Zachary-Ryan-Lopez.png',
    verifyUrl: 'https://cs50.harvard.edu/certificates/a2fb0892-7781-498c-b3e0-2552de74b397',
  },
  {
    id: 'kaggle-python',
    title: 'Python',
    issuer: 'Kaggle',
    date: 'May 18, 2026',
    status: 'earned',
    placeholderSrc: '/certs/Zachary-Ryan-Lopez-Python.png',
    verifyUrl: 'https://www.kaggle.com/learn/certification/zrlopez/python',
  },
  {
    id: 'kaggle-pandas',
    title: 'Pandas',
    issuer: 'Kaggle',
    date: 'May 19, 2026',
    status: 'earned',
    placeholderSrc: '/certs/Zachary-Ryan-Lopez-Pandas.png',
    verifyUrl: 'https://www.kaggle.com/learn/certification/zrlopez/pandas',
  },
  {
    id: 'kaggle-ml',
    title: 'Intermediate Machine Learning',
    issuer: 'Kaggle',
    date: 'May 19, 2026',
    status: 'earned',
    placeholderSrc: '/certs/Zachary-Ryan-Lopez-Intermediate-Machine-Learning.png',
    verifyUrl: 'https://www.kaggle.com/learn/certification/zrlopez/intermediate-machine-learning',
  },
  {
    id: 'kaggle-sql',
    title: 'Advanced SQL',
    issuer: 'Kaggle',
    date: 'May 19, 2026',
    status: 'earned',
    placeholderSrc: '/certs/Zachary-Ryan-Lopez-Advanced-SQL.png',
    verifyUrl: 'https://www.kaggle.com/learn/certification/zrlopez/advanced-sql',
  },
  {
    id: 'hubspot-seoii',
    title: 'SEO II Certification',
    issuer: 'HubSpot Academy',
    date: 'May 18, 2026',
    status: 'earned',
    placeholderSrc: '/certs/HubSpot_SEO_II_Certification_Zachary_Lopez_May_2026.png',
    verifyUrl: 'https://app-na2.hubspot.com/academy/achievements/3z03ccxd/en/1/zachary-lopez/seo-ii',
  },
  {
    id: 'hubspot-servicehub',
    title: 'Service Hub Software Certified',
    issuer: 'HubSpot Academy',
    date: 'May 18, 2026',
    status: 'earned',
    placeholderSrc: '/certs/HubSpot_Service_Hub_Software_Zachary_Lopez_2026.png',
    verifyUrl: 'https://app-na2.hubspot.com/academy/achievements/6dhmh4p0/en/1/zachary-lopez/service-hub-software',
  },
  {
    id: 'apple-acit',
    title: 'Apple Certified iOS Technician (ACiT)',
    issuer: 'Apple',
    date: 'March 14, 2019',
    status: 'earned',
    placeholderSrc: null, // cert image coming soon
  },
]

export function Certifications() {
  const [openCert, setOpenCert] = useState<Certification | null>(null)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenCert(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (openCert) setImgLoaded(false)
  }, [openCert])

  return (
    <section id="certifications" className="section-padding">
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
            <h2 className="text-3xl md:text-4xl font-bold">Certifications</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A growing collection of certifications across data science, machine learning, SQL, and digital marketing.
          </p>
        </motion.div>

        {/* Cert Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CERTS.map((cert, i) => (
            <motion.article
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="bg-secondary/30 rounded-xl p-5 flex flex-col gap-4 border border-border hover:border-primary/40 transition-colors duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold leading-tight">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{cert.issuer}</p>
                  <p className="text-xs text-muted-foreground mt-1">{cert.date}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
                <button
                  onClick={() => setOpenCert(cert)}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200"
                  aria-haspopup="dialog"
                >
                  View Certificate
                </button>

                {cert.verifyUrl && (
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                    aria-label={`Verify ${cert.title}`}
                  >
                    Verify <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {openCert && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${openCert.title} certificate`}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpenCert(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal panel */}
            <motion.div
              className="relative bg-background rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-border"
              initial={{ y: 24, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-5 border-b border-border">
                <div>
                  <h3 className="font-semibold text-lg">{openCert.title}</h3>
                  <p className="text-sm text-muted-foreground">{openCert.issuer} &middot; {openCert.date}</p>
                </div>
                <button
                  onClick={() => setOpenCert(null)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200"
                  aria-label="Close certificate"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image — loads only when modal opens */}
              <div className="flex-1 overflow-auto p-5">
                {openCert.placeholderSrc === null ? (
                  <div className="w-full h-64 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Award className="w-10 h-10 opacity-30" />
                    <p className="text-sm">Certificate image coming soon</p>
                  </div>
                ) : (
                  <>
                    {!imgLoaded && (
                      <div className="w-full h-64 flex items-center justify-center text-muted-foreground text-sm">
                        Loading…
                      </div>
                    )}
                    <Image
                      src={openCert.placeholderSrc}
                      alt={`${openCert.title} — ${openCert.issuer} certificate`}
                      width={800}
                      height={600}
                      className={`w-full h-auto object-contain rounded-lg transition-opacity duration-300 ${
                        imgLoaded ? 'opacity-100' : 'opacity-0 absolute'
                      }`}
                      onLoad={() => setImgLoaded(true)}
                      unoptimized
                    />
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-border flex items-center justify-end gap-4">
                {openCert.verifyUrl && (
                  <a
                    href={openCert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                  >
                    Open Verification <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setOpenCert(null)}
                  className="px-4 py-2 text-sm rounded-lg bg-secondary hover:bg-secondary/80 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
