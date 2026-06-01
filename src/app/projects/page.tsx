import { Metadata } from 'next'
import { ProjectsGrid } from '@/components/projects-grid'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'A collection of data operations, ML/AI, and engineering projects by Zachary Ryan Lopez.',
}

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto container-padding py-24">
        <div className="mb-12">
          <p className="text-sm text-muted-foreground mb-2 tracking-widest uppercase">
            zrl.dev / projects
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Projects</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Data operations, ML/AI tooling, and engineering work — built for real-world impact.
          </p>
        </div>
        <ProjectsGrid />
      </div>
    </main>
  )
}
