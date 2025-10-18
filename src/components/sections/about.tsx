'use client'

import { motion } from 'framer-motion'
import { MapPin, Focus, Heart } from 'lucide-react'

const quickFacts = [
  { icon: MapPin, label: 'Base', value: 'Austin, TX' },
  { icon: Focus, label: 'Focus', value: 'AI/ML data quality, diagnostics, and practical web builds' },
  { icon: Heart, label: 'Interests', value: 'cinematography, performance, and design systems' },
]

export function About() {
  return (
    <section id="about" className="section-padding bg-secondary/20">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-medium text-muted-foreground">01</span>
            <h2 className="text-3xl md:text-4xl font-bold">About</h2>
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12">
            I'm an AI/ML data operations specialist with 7+ years improving annotation quality 
            and UX for high-volume pipelines. I partner with ML and Product to reduce error classes, 
            tune taxonomies, and accelerate iteration through dashboards and QA rigor.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickFacts.map((fact, index) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <fact.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{fact.label}</h3>
                  <p className="text-sm text-muted-foreground">{fact.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}