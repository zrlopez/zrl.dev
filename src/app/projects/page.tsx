import { Metadata } from 'next'
import { ProjectsGrid } from '@/components/projects-grid'

export const meta Metadata = {
  title: 'Projects',
  description:
    'A collection of data operations, ML/AI, and engineering projects by Zachary Ryan Lopez.',
}

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto container-padding section-padding">
        <div className="mb-16">
          <p className="text-sm font-medium text-muted-foreground mb-4">
            <a href="/" className="hover:text-foreground transition-colors duration-200">
              zrl.dev
            </a>
            {' / projects'}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Data operations, ML/AI systems, and engineering work — built to solve real problems
            and demonstrate cross-functional technical depth.
          </p>
        </div>
        <ProjectsGrid />
      </div>
    </main>
  )
}
