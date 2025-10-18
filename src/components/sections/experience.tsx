'use client'

import { motion } from 'framer-motion'
import { CalendarDays, MapPin } from 'lucide-react'

const experiences = [
  {
    title: 'Data Operations Analyst',
    company: 'Apple',
    location: 'Cupertino, CA',
    period: 'Sep 2021–Jun 2024',
    description: 'Reviewed high-volume assistant interactions with linguistic tagging and QA, driving a 12% accuracy lift across targeted domains; refined prompts, intents, and fallbacks across en_US, en_CA, en_UK; built dashboards to monitor throughput, error classes, and taxonomy drift.',
    highlights: [
      '12% accuracy improvement across targeted domains',
      'Multi-locale prompt optimization (en_US, en_CA, en_UK)',
      'Built operational dashboards for ML teams'
    ]
  },
  {
    title: 'Technical Expert',
    company: 'Apple',
    location: 'Austin, TX',
    period: 'Mar 2019–Sep 2021',
    description: 'Diagnosed recurring faults via log analysis; reduced repeat visits by ~20% and mentored teammates with playbooks that improved first-time resolution and triage speed.',
    highlights: [
      '20% reduction in repeat customer visits',
      'Developed diagnostic playbooks for team',
      'Improved first-time resolution rates'
    ]
  },
  {
    title: 'Business Development (Apple Pay)',
    company: 'Apple',
    location: 'Austin, TX',
    period: 'Jan 2021–Jun 2021',
    description: 'Prospected e-merchants and supported SDK/API onboarding and testing; improved conversion with optimized integration paths and checkout messaging.',
    highlights: [
      'E-merchant SDK/API integration support',
      'Optimized payment flow conversion rates',
      'Technical onboarding facilitation'
    ]
  },
  {
    title: 'iOS Technical Support Advisor',
    company: 'Apple',
    location: 'Austin, TX',
    period: 'Mar 2020–Jan 2021',
    description: 'Achieved 90%+ same-call resolution across 2,000+ cases with minimal escalations using remote diagnostics and precise documentation.',
    highlights: [
      '90%+ same-call resolution rate',
      '2,000+ customer cases handled',
      'Expert in remote diagnostics'
    ]
  }
]

export function Experience() {
  return (
    <section id="experience" className="section-padding">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-medium text-muted-foreground">04</span>
            <h2 className="text-3xl md:text-4xl font-bold">Experience</h2>
          </div>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden md:block" />
          
          <div className="space-y-12">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.title + experience.period}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative flex flex-col md:flex-row md:items-start gap-8"
              >
                {/* Timeline dot */}
                <div className="hidden md:block absolute left-6 w-4 h-4 bg-primary rounded-full border-4 border-background" />
                
                {/* Content */}
                <div className="md:ml-20 flex-1">
                  <div className="bg-secondary/30 rounded-xl p-6 hover:bg-secondary/50 transition-colors duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{experience.title}</h3>
                        <p className="text-primary font-medium">{experience.company}</p>
                      </div>
                      <div className="flex flex-col sm:items-end text-sm text-muted-foreground mt-2 sm:mt-0">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="w-4 h-4" />
                          <span>{experience.period}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{experience.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {experience.description}
                    </p>
                    
                    <div className="space-y-2">
                      {experience.highlights.map((highlight, highlightIndex) => (
                        <div key={highlightIndex} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}