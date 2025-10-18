'use client'

import { motion } from 'framer-motion'

const skillCategories = [
  {
    title: 'Data Operations & ML',
    skills: [
      'Annotation QA', 'Guideline Authoring', 'IAA', 'Taxonomy Governance',
      'Sampling/QC Plans', 'Experiment Design', 'Friction Analysis',
      'NLP/NLU/ASR', 'Prompt Evaluation', 'Data Quality', 'Localization Nuance'
    ]
  },
  {
    title: 'Tools & Technologies',
    skills: [
      'Tableau', 'Jira/Confluence', 'JSON/CSV', 'Excel', 'Basic SQL',
      'Python', 'HTML/CSS/JS', 'Cloudflare Pages', 'Design Systems'
    ]
  },
  {
    title: 'Process & Evaluation',
    skills: [
      'UX Evaluation', 'Privacy/PII', 'Quality Assurance',
      'Performance Analytics', 'Process Optimization'
    ]
  }
]

export function Skills() {
  return (
    <section id="skills" className="section-padding bg-secondary/20">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-medium text-muted-foreground">03</span>
            <h2 className="text-3xl md:text-4xl font-bold">Skills</h2>
          </div>
        </motion.div>

        <div className="space-y-12">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-6 text-primary">{category.title}</h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: categoryIndex * 0.2 + skillIndex * 0.05 
                    }}
                    viewport={{ once: true }}
                    className="px-4 py-2 bg-background border border-border rounded-full text-sm font-medium hover:bg-secondary transition-colors duration-200 cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}