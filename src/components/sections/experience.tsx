'use client'

import { motion } from 'framer-motion'
import { CalendarDays, MapPin } from 'lucide-react'

const experiences = [
  {
    title: 'AI/ML Data Operations Researcher',
    company: 'Independent',
    location: 'Austin, TX',
    period: 'Jun 2024–Present',
    description: 'Builds and ships production-adjacent AI/ML tooling — a FastAPI incident-response system, a real-time annotation analytics dashboard, and ETL validation pipelines — while maintaining a public portfolio at zrl.dev.',
    highlights: [
      'Built a production-grade ML incident-response system in Python, FastAPI, and async SQLAlchemy with audit trails, SEV1–SEV3 state handling, and versioned runbooks.',
      'Developed a real-time annotation analytics dashboard tracking labeling quality trends, alert thresholds, and capacity forecasting; live at zrl.dev.',
      'Engineered ETL and data-validation pipelines with Pandas and SQLite, reducing reporting time by 40%.',
    ]
  },
  {
    title: 'Data Operations Analyst',
    company: 'Apple',
    location: 'Austin, TX',
    period: 'Sep 2021–Jun 2024',
    description: 'Partnered with global cross-functional teams to close annotation workflow gaps, audit Siri NLP datasets, and improve labeling consistency across fast-paced review cycles.',
    highlights: [
      'Partnered with global teams to identify and close annotation workflow gaps, reducing escalation resolution time by 43%.',
      'Audited high-volume audiovisual datasets against Siri NLP guidelines, maintaining policy-compliant labeling through fast-paced review cycles.',
      'Applied guideline-based QA and linguistic judgment to ambiguous utterances, improving labeling consistency across NLP annotation pipelines.',
    ]
  },
  {
    title: 'Technical Expert',
    company: 'Apple',
    location: 'Austin, TX',
    period: 'Mar 2019–Sep 2021',
    description: 'Diagnosed recurring technical faults using log analysis and trend review, reducing repeat contacts and building playbooks adopted across the team.',
    highlights: [
      'Diagnosed recurring faults via log analysis and trend pattern review, reducing repeat contacts by 20%; authored playbooks adopted by 5+ teammates.',
      'Resolved 1,200+ escalations with a 95% first-time fix rate and 4.9/5 CSAT using structured de-escalation techniques.',
    ]
  },
  {
    title: 'Business Development (Apple Pay)',
    company: 'Apple',
    location: 'Austin, TX',
    period: 'Jan 2021–Jun 2021',
    description: 'Supported merchant onboarding and technical integration for Apple Pay, bridging business development and SDK/API testing.',
    highlights: [
      'Prospected hundreds of e-commerce merchants and supported Apple Pay onboarding, integration, and adoption efforts.',
      'Developed tailored value propositions based on API capabilities, reducing adoption resistance through direct outreach and Webex collaboration.',
    ]
  },
  {
    title: 'AppleCare Support Advisor',
    company: 'Apple',
    location: 'Austin, TX',
    period: 'Mar 2020–Jan 2021',
    description: 'Delivered remote diagnostics and customer support across 2,000+ cases, maintaining 90%+ same-call resolution with low escalation rates.',
    highlights: [
      'Delivered 90%+ same-call resolution across 2,000+ cases through remote diagnostics and knowledge base workflows.',
      'Minimized escalations through structured triage and consistent documentation.',
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
            <span className="text-sm font-medium text-muted-foreground">05</span>
            <h2 className="text-3xl md:text-4xl font-bold">Experiences</h2>
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
