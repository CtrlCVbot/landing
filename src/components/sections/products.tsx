'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { PRODUCTS } from '@/lib/constants'
import { fadeInUp, staggerContainer } from '@/lib/motion'
import { SectionWrapper } from '@/components/shared/section-wrapper'

export function Products() {
  const implementedProducts = PRODUCTS.filter(
    (product) => product.status === 'implemented',
  )
  const upcomingProducts = PRODUCTS.filter(
    (product) => product.status === 'upcoming',
  )

  return (
    <SectionWrapper id="products">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <p className="text-sm font-semibold text-accent">제품 라인업</p>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-foreground">
          화주와 주선사, 각자의 업무 방식에 맞춘 OPTIC
        </h2>
        <p className="mt-4 text-muted-foreground">
          회사별 요청 양식과 정산 기준에 맞춰 운송 운영을 조율합니다.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        {implementedProducts.map((product) => (
          <motion.div
            key={product.key}
            variants={fadeInUp}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                구현 대상
              </span>
              <span className="text-sm text-muted-foreground">
                {product.productLabel}
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-bold text-foreground">
              {product.title}
            </h3>
            <p className="mt-1 text-sm font-medium text-accent">
              {product.target}
            </p>
            <p className="mt-4 text-muted-foreground">
              {product.description}
            </p>
            <ul className="mt-6 space-y-3">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="h-5 w-5 shrink-0 text-emerald-600" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-10">
        <h3 className="text-base font-semibold text-foreground">
          구현 예정 제품
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {upcomingProducts.map((product) => (
            <div
              key={product.key}
              className="rounded-xl border border-border/70 bg-muted/30 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-foreground">
                  {product.title}
                </span>
                <span className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">
                  구현 예정
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {product.productLabel}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
