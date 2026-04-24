'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/use-media-query'
import { PREVIEW_MOCK_DATA } from '@/lib/mock-data'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CARD_DURATION = 4000
const CROSS_FADE_DURATION = 0.3

const CATEGORY_CONFIG = [
  { id: 'departure', label: '상차지', icon: 'MapPin' },
  { id: 'destination', label: '하차지', icon: 'Flag' },
  { id: 'cargo', label: '화물/차량', icon: 'Package' },
  { id: 'fare', label: '운임', icon: 'Banknote' },
] as const

type CardPhase = 'extract' | 'complete'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MobileCardViewProps {
  readonly className?: string
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CategoryIcon({ icon }: { readonly icon: string }) {
  const iconMap: Record<string, string> = {
    MapPin: '\u{1F4CD}',
    Flag: '\u{1F3C1}',
    Package: '\u{1F4E6}',
    Banknote: '\u{1F4B5}',
  }
  return <span className="text-sm">{iconMap[icon] ?? ''}</span>
}

function ExtractCard() {
  const { categories } = PREVIEW_MOCK_DATA.aiResult

  return (
    <div data-testid="mobile-card-extract">
      <h3 className="mb-3 text-sm font-semibold text-foreground">AI 분석 결과</h3>
      <div className="space-y-2">
        {CATEGORY_CONFIG.map((config) => {
          const category = categories.find((c) => c.id === config.id)
          const firstButton = category?.buttons[0]

          return (
            <div
              key={config.id}
              className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2"
            >
              <CategoryIcon icon={config.icon} />
              <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent">
                {config.label}
              </span>
              <span className="ml-auto text-sm text-foreground/80">
                {firstButton?.displayValue ?? ''}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CompleteCard() {
  const { formData } = PREVIEW_MOCK_DATA

  const pickupCity = formData.pickup.company.split(' ')[0]
  const deliveryCity = formData.delivery.company.split(' ')[0]
  const vehicleLabel = `${formData.vehicle.type} ${formData.vehicle.weight}`
  const fareLabel = `${formData.estimate.amount.toLocaleString()}원`

  return (
    <div data-testid="mobile-card-complete">
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-sm font-semibold text-foreground">등록 완료</h3>
        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-600">
          완료
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
          <span className="text-xs text-muted-foreground">경로</span>
          <span className="text-sm text-foreground">
            {pickupCity} → {deliveryCity}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
          <span className="text-xs text-muted-foreground">차량</span>
          <span className="text-sm text-foreground">{vehicleLabel}</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
          <span className="text-xs text-muted-foreground">운임</span>
          <span className="text-lg font-semibold text-foreground">{fareLabel}</span>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Hook: useMobileAutoPlay
// ---------------------------------------------------------------------------

function useMobileAutoPlay(enabled: boolean): CardPhase {
  const [phase, setPhase] = useState<CardPhase>(enabled ? 'extract' : 'complete')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    timerRef.current = setTimeout(() => {
      setPhase((prev) => (prev === 'extract' ? 'complete' : 'extract'))
    }, CARD_DURATION)

    return () => {
      clearTimer()
    }
  }, [phase, enabled, clearTimer])

  return phase
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function MobileCardView({ className }: MobileCardViewProps) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const phase = useMobileAutoPlay(!prefersReducedMotion)

  return (
    <div
      data-testid="mobile-card-view"
      className={cn(
        'rounded-xl border border-border bg-card/50 p-4',
        className,
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: CROSS_FADE_DURATION }}
        >
          {phase === 'extract' ? <ExtractCard /> : <CompleteCard />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
