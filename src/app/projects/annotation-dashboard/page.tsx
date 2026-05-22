'use client'

import { motion } from 'framer-motion'
import { Github, ArrowLeft, BarChart2, AlertTriangle, Users, Cpu, Tag, Calendar, Code2, Layers } from 'lucide-react'
import Link from 'next/link'
import { AnnotationDashboardDemo } from './_components/AnnotationDashboardDemo'

const tech = [
  'Next.js 14',
  'TypeScript',
  'Recharts',
  'Tailwind CSS',
  'React Hooks',
  'Real-time State',
]

const highlights = [
  { icon: BarChart2,     title: 'Live KPI Metrics',        description: 'Four real-time KPI cards — throughput, error rate, team efficiency, and capacity utilization — update every 5 seconds with independent variation per metric.' },
  { icon: AlertTriangle, title: 'Alert Threshold Engine',  description: 'Alert thresholds sync live to KPI values each tick, automatically flagging warning states when error rate or capacity cross configured limits.' },
  { icon: Users,         title: 'Team Performance View',   description: 'Per-member productivity cards, task completion bar charts, and a weekly utilization heatmap with low / medium / high classification.' },
  { icon: Cpu,           title: 'Capacity Forecasting',    description: 'Historical vs. predicted capacity trend chart with forward-looking forecast bands to surface resource bottlenecks before they occur.' },
]

const fixes = [
  'Independent ±2.5% variation per metric — no correlated ticks',
  'Live trend badge text re-rendered each interval',
  'Error rate precision preserved to 2 decimal places',
  'Inverted color logic for error rate (lower = green)',
  'Alert threshold current values wired to live KPIs',
  'Chart.js pinned to 4.4.4 with SRI integrity hash',
  'Null-guarded tab listeners via loop with if(btn) check',
  'loadOverviewTab wrapped in tryLoadTab error boundary',
  'Inline theme script prevents light-mode flash on load',
  'ARIA labelledby targets resolved — all tabpanels accessible',
]

export default function AnnotationDashboardPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="section-padding border-b border-border">
        <div className="max-w-5xl mx-auto container-padding">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />Back to Projects
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">Analytics</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> 2025–Present</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Annotation Analytics Dashboard</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">An interactive real-time dashboard for tracking annotation quality trends, ML support metrics, and workflow performance patterns — rebuilt in Next.js + Recharts with live state updates.</p>
            <div className="flex flex-wrap gap-3">
              <a href="https://github.com/zrlopez/performance-analytics-tool" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Github className="w-4 h-4" />View on GitHub
              </a>
              <Link href="/#projects" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors">
                <ArrowLeft className="w-4 h-4" />All Projects
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="section-padding border-b border-border">
        <div className="max-w-5xl mx-auto container-padding">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-muted-foreground mb-4">Built to simulate the kind of operational visibility used in ML data operations — tracking pipeline throughput, annotation error rates, team efficiency, and infrastructure capacity in one unified view.</p>
              <p className="text-muted-foreground mb-4">Real-time updates are driven by a 5-second interval hook that recalculates each KPI independently, updates trend badges, syncs alert thresholds, and re-applies color logic — all without page refresh.</p>
              <p className="text-muted-foreground">Went through a full code review cycle covering metric calculation correctness, accessibility, error resilience, and UI polish — resulting in 10+ targeted fixes across all severity tiers.</p>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-secondary/30 p-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Project Details</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Role</dt><dd className="font-medium">Developer</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Year</dt><dd className="font-medium">2025–Present</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Type</dt><dd className="font-medium">Frontend / Analytics</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Tabs</dt><dd className="font-medium">6 views</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Update Interval</dt><dd className="font-medium">5 seconds</dd></div>
                </dl>
              </div>
              <div className="rounded-xl border border-border bg-secondary/30 p-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2"><Code2 className="w-4 h-4" /> Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {tech.map((t) => (<span key={t} className="text-xs px-2.5 py-1 rounded-md bg-background border border-border font-mono">{t}</span>))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="section-padding border-b border-border bg-secondary/10">
        <div className="max-w-5xl mx-auto container-padding">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mb-10">
            <div className="flex items-center gap-4 mb-2"><Layers className="w-5 h-5 text-primary" /><h2 className="text-2xl font-bold">Feature Highlights</h2></div>
            <p className="text-muted-foreground">Core capabilities across the six dashboard tabs.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {highlights.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }} className="rounded-xl border border-border bg-background p-6">
                <item.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo */}
      <section className="section-padding border-b border-border">
        <div className="max-w-5xl mx-auto container-padding">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <BarChart2 className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold">Live Demo</h2>
            </div>
            <p className="text-muted-foreground">Fully interactive — KPIs update every 5 seconds. Toggle dark mode inside the demo independently of the page theme.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }} className="rounded-2xl border border-border overflow-hidden">
            <div className="max-h-[780px] overflow-y-auto">
              <AnnotationDashboardDemo />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Code Review Fixes */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto container-padding">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mb-10">
            <div className="flex items-center gap-4 mb-2"><Tag className="w-5 h-5 text-primary" /><h2 className="text-2xl font-bold">Code Review Fixes</h2></div>
            <p className="text-muted-foreground">Issues identified and resolved across a full multi-pass review — high, medium, and low priority.</p>
          </motion.div>
          <motion.ul initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="grid sm:grid-cols-2 gap-3">
            {fixes.map((fix, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                {fix}
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding border-t border-border bg-secondary/10">
        <div className="max-w-5xl mx-auto container-padding text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold mb-3">See the source</h2>
            <p className="text-muted-foreground mb-6">Full codebase with commit history available on GitHub.</p>
            <a href="https://github.com/zrlopez/performance-analytics-tool" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
              <Github className="w-4 h-4" />View Repository
            </a>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
