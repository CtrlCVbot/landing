'use client'

import { SectionWrapper } from '@/components/shared/section-wrapper'

export function Cta() {
  return (
    <SectionWrapper id="contact">
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-500/20 p-12 md:p-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          지금 시작하세요
        </h2>
        <p className="text-muted-foreground mt-4">
          OPTIC으로 운송 운영을 바꿔보세요
        </p>
        <a
          href="#contact"
          className="mt-8 inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold"
        >
          도입 문의하기
        </a>
      </div>
    </SectionWrapper>
  )
}
