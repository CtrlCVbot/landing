'use client'

import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/motion'
import { HeroLiquidGradientBackground } from '@/components/shared/hero-liquid-gradient-background'
import { DashboardPreview } from '@/components/dashboard-preview/dashboard-preview'
import { CTA_LINKS } from '@/lib/constants'

export function Hero() {
  return (
    <section className="min-h-[100svh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 sm:px-6 md:pt-28 relative isolate overflow-hidden">
      <HeroLiquidGradientBackground />
      <div
        aria-hidden="true"
        data-testid="hero-content-veil"
        className="hero-content-veil pointer-events-none absolute left-1/2 top-[35%] z-[1] h-[34rem] w-[min(64rem,92vw)] -translate-x-1/2 -translate-y-1/2"
      />
      <div
        aria-hidden="true"
        data-testid="hero-bottom-fade"
        className="hero-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[40%]"
      />

      <motion.h1
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl text-5xl sm:text-6xl lg:text-8xl font-bold leading-[0.95] tracking-normal text-foreground"
      >
        운송 운영을 한눈에
      </motion.h1>

      <motion.p
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="relative z-10 mt-6 max-w-2xl text-lg md:text-2xl leading-8 text-muted-foreground"
      >
        오더부터 정산까지
      </motion.p>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
        className="relative z-10 mt-10 flex w-full max-w-md flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4"
      >
        <a
          href="#contact"
          className="rounded-lg bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          도입 문의하기
        </a>
        <a
          href={CTA_LINKS.service.href}
          target={CTA_LINKS.service.target}
          rel={CTA_LINKS.service.rel}
          className="rounded-lg border border-border/80 bg-background/55 px-8 py-4 font-semibold text-foreground backdrop-blur-md transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {CTA_LINKS.service.label}
        </a>
      </motion.div>

      {/**
       * Phase 3 3-column grid 수용 위한 1440px 확장 (M1-08).
       * Hero 텍스트/버튼은 max-w-4xl(896px) 가독성 유지, DashboardPreview 블록만
       * 별도 래퍼에서 max-w-[1440px]로 확장해 OrderForm의 lg:grid-cols-3
       * (≥1024px) 충족에 필요한 가용폭(≈1060px)을 확보한다.
       */}
      <div className="relative z-10 mt-14 w-full flex justify-center md:mt-16">
        <div className="max-w-[1440px] w-full px-0">
          <DashboardPreview />
        </div>
      </div>
    </section>
  )
}
