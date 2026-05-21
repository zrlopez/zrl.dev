'use client'

import { motion } from 'framer-motion'

const skillCategories = [
  {
    title: 'Computer Languages',
    skills: [
      'Python', 'SQL', 'HTML', 'CSS', 'JSON'
    ]
  },
  {
    title: 'Tools & Platforms',
    skills: [
      'Pandas', 'SQLite', 'Tableau', 'Power BI', 'Jupyter',
      'Git', 'GitHub', 'Jira', 'Confluence', 'Excel'
    ]
  },
  {
    title: 'AI & Data',
    skills: [
      'Annotation QA', 'ETL Pipeline Design', 'Data Validation', 'Error Analysis',
      'Taxonomy Governance', 'PII Handling', 'NLP Evaluation', 'RLHF',
      'Prompt Engineering', 'IAA', 'MLOps', 'A/B Testing', 'UX Evaluation',
      'Ontology Design', 'IRR'
    ]
  },
  {
    title: 'Professional Skills',
    skills: [
      'Cross-functional Collaboration', 'Stakeholder Communication',
      'SOP & Guideline Authoring', 'Training & Enablement',
      'Escalation Resolution', 'Customer-facing Support',
      'Experiment Design', 'Evidence-driven Decision Making',
      'Project Coordination', 'Workflow Improvement', 'Process Automation'
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
