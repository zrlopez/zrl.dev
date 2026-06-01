'use client'

import { useState } from 'react'
import { Github, ExternalLink, BookOpen, FlaskConical, Calendar, Tag } from 'lucide-react'
import { projects } from '@/lib/projects-data'
import type { Project } from '@/lib/projects-data'

const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))]

function ProjectLinks({ project }: { project: Project }) {
  const links = [
    project.docs  && { href: project.docs,   label: 'Docs',   icon: <BookOpen className="w-3.5 h-3.5" /> },
    project.demo  && { href: project.demo,   label: 'Demo',   icon: <FlaskConical className="w-3.5 h-3.5" /> },
    project.github && { href: project.github, label: 'GitHub', icon: <Github className="w-3.5 h-3.5" /> },
    project.link  && { href: project.link,   label: 'View',   icon: <ExternalLink className="w-3.5 h-3.5" /> },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[]

  if (links.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
      {links.map(({ href, label, icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
                     bg-secondary hover:bg-secondary/80 text-foreground
                     border border-border hover:border-primary/40
                     transition-all duration-200"
          aria-label={`${label} — ${project.title}`}
        >
          {icon}
          {label}
        </a>
      ))}
    </div>
  )
}

function FlagshipCard({ project }: { project: Project }) {
  return (
    <div className="col-span-full bg-background rounded-xl border border-primary/40 ring-2 ring-primary/20 overflow-hidden mb-4">
      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                             bg-primary/10 text-primary border border-primary/30 mb-3">
              Flagship Project
            </span>
            <h2 className="text-2xl md:text-3xl font-bold">{project.title}</h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1 text-sm text-muted-foreground shrink-0">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {project.year}
            </span>
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              {project.role}
            </span>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed mb-4 max-w-3xl">{project.summary}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-secondary text-xs font-medium rounded-full text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <ProjectLinks project={project} />
      </div>
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <div
      className={`group bg-background rounded-xl border border-border overflow-hidden
                  hover:shadow-lg transition-all duration-300 hover:-translate-y-1
                  ${ project.featured ? 'ring-1 ring-primary/10' : '' }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{project.year}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tag className="w-4 h-4" />
            <span>{project.role}</span>
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{project.summary}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-secondary text-xs font-medium rounded-full text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <ProjectLinks project={project} />
      </div>
    </div>
  )
}

export function ProjectsGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const flagship = projects.find((p) => p.flagship)
  const rest = projects.filter((p) => !p.flagship)

  const filtered = rest.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  )

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-background border border-border hover:bg-secondary'
            }`}
            aria-pressed={selectedCategory === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Flagship always at top, full width */}
        {flagship && selectedCategory === 'All' && (
          <FlagshipCard project={flagship} />
        )}

        {/* Rest of projects */}
        {filtered.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  )
}
