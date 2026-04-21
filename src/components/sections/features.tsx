'use client'

import { motion } from 'framer-motion'
import {
  ClipboardList,
  Truck,
  Calculator,
  Receipt,
  Sparkles,
  MapPin,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { FEATURES } from '@/lib/constants'
import { staggerContainer, fadeInUp, hoverLift } from '@/lib/motion'
import { SectionWrapper } from '@/components/shared/section-wrapper'

const ICON_MAP: Record<string, LucideIcon> = {
  'clipboard-list': ClipboardList,
  'truck': Truck,
  'calculator': Calculator,
  'receipt': Receipt,
  'sparkles': Sparkles,
  'map-pin': MapPin,
} as const

export function Features() {
  return (
    <SectionWrapper id="features">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
        OPTIC이 제공하는 핵심 기능
      </h2>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {FEATURES.map((feature) => {
          const Icon = ICON_MAP[feature.icon]
          return (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              whileHover="hover"
              initial="rest"
              className="bg-card border border-border rounded-xl p-6 transition-shadow hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30"
            >
              <motion.div variants={hoverLift}>
                {Icon && <Icon className="w-8 h-8 text-purple-400" />}
                <h3 className="text-lg font-semibold text-white mt-4">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 mt-2">
                  {feature.description}
                </p>
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>
    </SectionWrapper>
  )
}
