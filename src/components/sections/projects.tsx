'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github, Calendar, Tag, ArrowRight, BookOpen, FlaskConical } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { projects } from '@/lib/projects-data'

const categories = ['All', ...new Set(projects.map(p => p.category))]

export function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const filteredProjects = projects.filter(project =>
    selectedCategory === 'All' || project.category === selectedCategory
  )

  const displayedProjects = filteredProjects.slice(0, 3)

  return (
    <section id="projects" className="section-padding bg-secondary/20">
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
            <h2 className="text-3xl md:text-4xl font-bold">Projects</h2>
          </div>

          {/* Category Filter */}
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
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
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

                <div className="flex items-center gap-4">
                  {project.docs && (
                    <Link
                      href={project.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200"
                    >
                      <BookOpen className="w-4 h-4" />
                      Docs
                    </Link>
                  )}
                  {project.demo && (
                    <Link
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200"
                    >
                      <FlaskConical className="w-4 h-4" />
                      Demo
                    </Link>
                  )}
                  {project.link && (
                    <Link
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Project
                    </Link>
                  )}
                  {project.github && (
                    <Link
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </Link>
                  )}
                  {!project.docs && !project.demo && !project.link && !project.github && (
                    <span className="text-sm text-muted-foreground italic">Available upon request</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg font-medium hover:bg-secondary transition-colors duration-200"
          >
            View All Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
