'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  readonly id: string
  readonly className?: string
  readonly children: ReactNode
}

export function SectionWrapper({ id, className, children }: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={cn(
        'max-w-7xl mx-auto px-5 md:px-10 lg:px-20 py-20 lg:py-30',
        className,
      )}
    >
      {children}
    </motion.section>
  )
}
