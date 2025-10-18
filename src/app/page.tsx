'use client'

import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { Stats } from '@/components/sections/stats'
import { Skills } from '@/components/sections/skills'
import { Experience } from '@/components/sections/experience'
import { Projects } from '@/components/sections/projects'
import { Contact } from '@/components/sections/contact'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <About />
      <Stats />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
    </div>
  )
}