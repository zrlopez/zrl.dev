'use client'

import { motion } from 'framer-motion'
import { CalendarDays, MapPin } from 'lucide-react'

const experiences = [
    {
    title: 'AI/ML Data Operations Researcher',
    company: 'Independent',
    location: 'Austin, TX',
    period: 'Jun 2024–Present',
    description: 'Independent research and portfolio development focused on AI/ML data operations, annotation quality, ETL validation, and workflow analytics.',
    highlights: [
      'Built Python and SQL utilities for annotation QA, data validation, and lightweight analysis.',
      'Designed and tested annotation experiments to evaluate consistency, taxonomy drift, and workflow assumptions.',
      'Published methodology notes, dashboards, or supporting artifacts on GitHub and zrl.dev.'
    ]
  },
  {
    title: 'Data Operations Analyst',
    company: 'Apple',
    location: 'Austin, TX',
    period: 'Sep 2021–Jun 2024',
    description: 'Reviewed high-volume assistant interactions, improved annotation quality, and supported taxonomy governance across multiple locales.',
    highlights: [
      'Improved accuracy in targeted domains through QA review and labeling refinement.',
      'Tuned prompts, intents, and fallbacks across en_US, en_CA, and en_UK.',
      'Built dashboards to monitor throughput, error classes, and taxonomy drift.'
    ]
  },
  {
    title: 'Technical Expert',
    company: 'Apple',
    location: 'Austin, TX',
    period: 'Mar 2019–Sep 2021',
    description: 'Diagnosed recurring technical issues using logs and structured troubleshooting, helping reduce repeat visits and improve team resolution quality.',
    highlights: [
      'Reduced repeat customer visits through better diagnostics and escalation handling.',
      'Created or refined playbooks to improve triage speed and consistency.',
      'Supported teammates with repeatable troubleshooting patterns.'
    ]
  },
  {
    title: 'Business Development (Apple Pay)',
    company: 'Apple',
    location: 'Austin, TX',
    period: 'Jan 2021–Jun 2021',
    description: 'Supported merchant onboarding and technical integration for Apple Pay, bridging business development and SDK/API testing.',
    highlights: [
      'Helped merchants work through onboarding and integration steps.',
      'Improved conversion through clearer checkout and implementation guidance.',
      'Supported testing and technical validation for payment flows.'
    ]
  },
  {
    title: 'AppleCare Support Advisor',
    company: 'Apple',
    location: 'Austin, TX',
    period: 'Mar 2020–Jan 2021',
    description: 'Delivered remote diagnostics and customer support for iOS issues across a large volume of cases.',
    highlights: [
      'Maintained strong same-call resolution performance.',
      'Resolved high case volume with low escalation rates.',
      'Used documentation and diagnostics to improve consistency.'
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
                      {experience.highlights.map((highlight) => (
                        <div key={highlight} className="flex items-start gap-2">
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
