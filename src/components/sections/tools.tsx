'use client'

import { motion } from 'framer-motion'

const toolCategories = [
  {
    title: 'Languages & Data',
    tools: [
      'Python', 'SQL', 'TypeScript', 'JSON',
      'Pandas', 'SQLite', 'Jupyter',
    ],
  },
  {
    title: 'Frameworks & APIs',
    tools: [
      'FastAPI', 'Next.js', 'Tailwind CSS',
      'Pydantic', 'async SQLAlchemy',
    ],
  },
  {
    title: 'AI & ML',
    tools: [
      'Hugging Face', 'scikit-learn', 'Gradio',
      'OpenAI API', 'Anthropic API', 'Claude Code',
      'OpenAI Codex', 'LangChain', 'Weights & Biases',
    ],
  },
  {
    title: 'Infrastructure & Dev',
    tools: [
      'Docker', 'Git', 'GitHub', 'Vercel', 'Cloudflare',
      'VS Code', 'Jira', 'Confluence', 'Notion', 'Linear',
    ],
  },
  {
    title: 'Analytics & Visualization',
    tools: [
      'Tableau', 'Power BI', 'Excel', 'Recharts',
    ],
  },
]

export function Tools() {
  return (
    <section id="tools" className="section-padding">
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
            <h2 className="text-3xl md:text-4xl font-bold">Tools & Technologies</h2>
          </div>
        </motion.div>

        <div className="space-y-12">
          {toolCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-base font-semibold mb-5 text-muted-foreground uppercase tracking-widest">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1.5 bg-background border border-border rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors duration-200 cursor-default"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
