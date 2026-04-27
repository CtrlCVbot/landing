'use client'

import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/motion'
import { GradientBlob } from '@/components/shared/gradient-blob'
import { HeroLiquidGradientBackground } from '@/components/shared/hero-liquid-gradient-background'
import { DashboardPreview } from '@/components/dashboard-preview/dashboard-preview'

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center pt-16 relative isolate overflow-hidden">
      <HeroLiquidGradientBackground />
      <GradientBlob className="-top-20 -left-20 z-0 w-96 h-96" />
      <GradientBlob className="-bottom-20 -right-20 z-0 w-80 h-80" />

      <motion.h1
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-4xl md:text-5xl lg:text-7xl font-bold text-foreground"
      >
        운송 운영을 한눈에
      </motion.h1>

      <motion.p
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="relative z-10 text-lg md:text-xl text-muted-foreground mt-6"
      >
        오더부터 정산까지
      </motion.p>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
        className="relative z-10 mt-10 flex gap-4 flex-col sm:flex-row"
      >
        <a
          href="#contact"
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold"
        >
          도입 문의하기
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-border text-foreground px-8 py-4 rounded-xl hover:border-foreground transition-colors"
        >
          데모 보기
        </a>
      </motion.div>

      {/**
       * Phase 3 3-column grid 수용 위한 1440px 확장 (M1-08).
       * Hero 텍스트/버튼은 max-w-4xl(896px) 가독성 유지, DashboardPreview 블록만
       * 별도 래퍼에서 max-w-[1440px]로 확장해 OrderForm의 lg:grid-cols-3
       * (≥1024px) 충족에 필요한 가용폭(≈1060px)을 확보한다.
       */}
      <div className="relative z-10 mt-16 w-full flex justify-center">
        <div className="max-w-[1440px] w-full">
          <DashboardPreview />
        </div>
      </div>
    </section>
  )
}
