'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/motion'
import { GradientBlob } from '@/components/shared/gradient-blob'
import { DashboardPreview } from '@/components/dashboard-preview/dashboard-preview'
import { DashboardPreviewSpike } from '@/components/dashboard-preview/ai-register-main/spike'

export function Hero() {
  // Spike feature flag: `?spike=1` (client-side post-mount parsing, static export 호환 + Suspense 불필요)
  // NOTE: useSearchParams는 output: 'export' 시 Suspense boundary 없으면 전체 페이지 fallback 발생 → 회피
  const [spikeEnabled, setSpikeEnabled] = useState(false)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setSpikeEnabled(params.get('spike') === '1')
  }, [])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center pt-16 relative overflow-hidden">
      <GradientBlob className="-top-20 -left-20 w-96 h-96" />
      <GradientBlob className="-bottom-20 -right-20 w-80 h-80" />

      <motion.h1
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="text-4xl md:text-5xl lg:text-7xl font-bold text-white"
      >
        운송 운영을 한눈에
      </motion.h1>

      <motion.p
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="text-lg md:text-xl text-gray-400 mt-6"
      >
        오더부터 정산까지
      </motion.p>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
        className="mt-10 flex gap-4 flex-col sm:flex-row"
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
          className="border border-gray-600 text-gray-200 px-8 py-4 rounded-xl hover:border-white transition-colors"
        >
          데모 보기
        </a>
      </motion.div>

      <div className="mt-16 max-w-4xl w-full">
        {spikeEnabled ? <DashboardPreviewSpike /> : <DashboardPreview />}
      </div>
    </section>
  )
}
