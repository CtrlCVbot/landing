'use client'

import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { PROBLEMS } from '@/lib/constants'
import { staggerContainer, fadeInUp } from '@/lib/motion'
import { SectionWrapper } from '@/components/shared/section-wrapper'

export function Problems() {
  return (
    <SectionWrapper id="problems">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
        이런 문제, 겪고 계신가요?
      </h2>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {PROBLEMS.map((problem) => (
          <motion.div
            key={problem.before}
            variants={fadeInUp}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-start gap-3">
              <X className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
              <span className="text-foreground/70 line-through">{problem.before}</span>
            </div>
            <div className="flex items-start gap-3 mt-3">
              <Check className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <span className="text-foreground font-medium">{problem.after}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  )
}
