const CORE_SKILLS = new Set([
  'Python',
  'SQL',
  'Annotation QA',
  'NLP Evaluation',
  'ETL Pipelines',
  'Prompt Engineering',
  'MLOps',
])

const skillCategories = [
  {
    title: 'AI & Data Operations',
    skills: [
      'Annotation QA', 'ETL Pipelines', 'MLOps', 'NLP Evaluation',
      'Prompt Engineering', 'RLHF', 'Data Validation', 'Error Analysis',
      'Taxonomy Governance', 'PII Handling', 'A/B Testing',
      'Ontology Design', 'UX Evaluation', 'IAA', 'IRR',
    ],
  },
  {
    title: 'Professional',
    skills: [
      'Cross-functional Collaboration', 'Stakeholder Communication',
      'SOP & Guideline Authoring', 'Training & Enablement',
      'Escalation Resolution', 'Project Coordination',
      'Workflow Improvement', 'Process Automation',
      'Experiment Design',
    ],
  },
  {
    title: 'Creative & Platform',
    skills: [
      'Xcode', 'Swift', 'Final Cut Pro', 'Logic Pro', 'Figma',
    ],
  },
]

export function Skills() {
  return (
    <section id="skills" className="section-padding bg-secondary/20">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="mb-16 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-medium text-muted-foreground">03</span>
            <h2 className="text-3xl md:text-4xl font-bold">Skills</h2>
          </div>
        </div>

        <div className="space-y-12">
          {skillCategories.map((category, categoryIndex) => (
            <div
              key={category.title}
              className="animate-fade-in-up"
              style={{ animationDelay: `${categoryIndex * 120}ms`, animationFillMode: 'both' }}
            >
              <h3 className="text-base font-semibold mb-5 text-muted-foreground uppercase tracking-widest">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => {
                  const isCore = CORE_SKILLS.has(skill)
                  return (
                    <span
                      key={skill}
                      className={
                        isCore
                          ? 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border border-primary/40 bg-primary/10 text-foreground cursor-default'
                          : 'px-3 py-1.5 bg-background border border-border rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors duration-200 cursor-default'
                      }
                    >
                      {isCore && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
                      )}
                      {skill}
                      {isCore && (
                        <span className="ml-0.5 text-[10px] font-bold uppercase tracking-wider text-primary/70">Core</span>
                      )}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
