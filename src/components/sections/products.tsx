'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { PRODUCTS } from '@/lib/constants'
import { tabContent } from '@/lib/motion'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { cn } from '@/lib/utils'

export function Products() {
  const [activeTab, setActiveTab] = useState('broker')

  const activeProduct = PRODUCTS.find((p) => p.key === activeTab)

  return (
    <SectionWrapper id="products">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
        역할에 맞는 솔루션을 선택하세요
      </h2>

      <div className="flex gap-2 overflow-x-auto border-b border-border pb-1">
        {PRODUCTS.map((product) => (
          <button
            key={product.key}
            type="button"
            onClick={() => setActiveTab(product.key)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap',
              activeTab === product.key
                ? 'text-foreground border-b-2 border-purple-500'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {product.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeProduct && (
          <motion.div
            key={activeTab}
            variants={tabContent}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                {activeProduct.label}
                <span className="text-muted-foreground text-base font-normal ml-2">
                  {activeProduct.target}
                </span>
              </h3>
              <p className="text-muted-foreground mt-2">{activeProduct.description}</p>
              <ul className="mt-6 space-y-3">
                {activeProduct.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-foreground">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="aspect-video rounded-xl bg-muted/50 border border-border shadow-sm flex items-center justify-center">
              <span className="text-muted-foreground">{activeProduct.label}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}
