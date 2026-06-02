'use client'

import { useState } from 'react'
import { Github, ExternalLink, BookOpen, FlaskConical, Calendar, Tag } from 'lucide-react'
import { projects } from '@/lib/projects-data'
import type { Project } from '@/lib/projects-data'
import { motion } from 'framer-motion'

function ProjectLinks({ project }: { project: Project }) {
  const links = [
    project.docs  && { href: project.docs,   label: 'Docs',   icon: <BookOpen className="w-3.5 h-3.5" /> },
    project.demo  && { href: project.demo,   label: 'Demo',   icon: <FlaskConical className="w-3.5 h-3.5" /> },
    project.github && { href: project.github, label: 'GitHub', icon: <Github className="w-3.5 h-3.5" /> },
    project.link  && { href: project.link,   label: 'View',   icon: <ExternalLink className="w-3.5 h-3.5" /> },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[]

  if (links.length === 0) return (
    <span className="text-xs text-muted-foreground italic">Available upon request</span>
  )

  return (
    <div className="flex flex-wrap gap-3">
      {links.map(({ href, label, icon }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          {icon}
          {label}
        </Link>
      ))}
    </div>
  )
}

function FlagshipCard({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="group relative bg-background rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 mb-8 ring-2 ring-primary/20"
    >
      <div className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{project.year}</span>
            <span>•</span>
            <span>{project.role}</span>
          </div>
          <div className="flex gap-2">
            <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium">
              Flagship
            </div>
            {project.featured && (
              <div className="px-2 py-1 bg-secondary text-muted-foreground text-xs rounded-md font-medium">
                Featured
              </div>
            )}
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-200">
          {project.title}
        </h3>

        <p className="text-muted-foreground leading-relaxed mb-6">
          {project.summary}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-md text-xs text-muted-foreground"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        <ProjectLinks project={project} />
      </div>
    </motion.div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`group relative bg-background rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
        project.featured ? 'ring-2 ring-primary/20' : ''
      }`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{project.year}</span>
            <span>•</span>
            <span>{project.role}</span>
          </div>
          {project.featured && (
            <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium">
              Featured
            </div>
          )}
        </div>

        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-200">
          {project.title}
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {project.summary}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-md text-xs text-muted-foreground"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        <ProjectLinks project={project} />
      </div>
    </motion.div>
  )
}

export function ProjectsGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', ...new Set(projects.map((p) => p.category))]

  const flagship = projects.find((p) => p.flagship)
  const rest = projects.filter((p) => !p.flagship)

  const filteredRest = rest.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  )

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-background border border-border hover:bg-secondary'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {flagship && selectedCategory === 'All' && (
        <FlagshipCard project={flagship} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRest.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}
