'use client'

import { motion } from 'framer-motion'
import { Puzzle } from 'lucide-react'
import { INTEGRATIONS } from '@/lib/constants'
import { staggerContainer, fadeInUp } from '@/lib/motion'
import { SectionWrapper } from '@/components/shared/section-wrapper'

export function Integrations() {
  return (
    <SectionWrapper id="integrations">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
        강력한 외부 연동
      </h2>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {INTEGRATIONS.map((integration) => (
          <motion.div
            key={integration.key}
            variants={fadeInUp}
            className="bg-card border border-border shadow-sm rounded-xl p-6 text-center"
          >
            <div className="w-12 h-12 mx-auto rounded-lg bg-muted flex items-center justify-center">
              <Puzzle className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mt-4">
              {integration.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {integration.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  )
}
