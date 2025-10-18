'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const stats = [
  { value: 7, suffix: '', label: 'Years in Apple ecosystem' },
  { value: 12, suffix: '%', label: 'accuracy lift (targeted domains)' },
  { value: 500, suffix: '', label: 'Assistant interactions/day reviewed' },
  { value: 20, suffix: '%', label: 'repeat visits reduced' },
]

function AnimatedCounter({ value, suffix, duration = 2 }: { value: number, suffix: string, duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const startTime = Date.now()
      const startValue = 0
      const endValue = value

      const updateCount = () => {
        const now = Date.now()
        const elapsed = (now - startTime) / 1000
        const progress = Math.min(elapsed / duration, 1)
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart)
        
        setCount(currentValue)
        
        if (progress < 1) {
          requestAnimationFrame(updateCount)
        }
      }
      
      updateCount()
    }
  }, [isInView, value, duration])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section id="stats" className="section-padding">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-medium text-muted-foreground">02</span>
            <h2 className="text-3xl md:text-4xl font-bold">Stats</h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors duration-300"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2 text-primary">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}