/**
 * @spike T-DASH3-SPIKE-01 — 종료 시 이관 or 폐기
 *
 * Spike 4-Step 자동 재생 컨테이너.
 *
 * 레이아웃:
 * - 좌측: AiPanelSpike (380px) — AiInputAreaSpike + AiExtractButtonSpike
 * - 우측 Col 1: CompanyManagerSectionSpike (pre-filled, 정적)
 * - 우측 Col 3: EstimateInfoCardSpike (AI_APPLY 에서 활성)
 * - Col 2: Spike 범위 외 placeholder
 *
 * Step 전환 오버랩 150ms (AnimatePresence mode="sync" + framer opacity fade).
 * Performance.now() 로깅: `logSpikeStep` 사용 → DevTools Console 관찰.
 *
 * export default/Named 둘 다 제공.
 */

'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { SPIKE_MOCK_DATA } from '@/lib/mock-data-spike'
import {
  SPIKE_PREVIEW,
  SPIKE_STEPS,
  type SpikeStepSnapshot,
} from '@/lib/preview-steps-spike'
import { useFakeTyping } from '@/components/dashboard-preview/interactions/use-fake-typing'

import { AiInputAreaSpike } from './ai-panel/ai-input-area'
import { AiExtractButtonSpike } from './ai-panel/ai-extract-button'
import { CompanyManagerSectionSpike } from './order-form/company-manager-section'
import { EstimateInfoCardSpike } from './order-form/estimate-info-card'

// ---------------------------------------------------------------------------
// Auto-play state
// ---------------------------------------------------------------------------

function useSpikeAutoPlay() {
  const [stepIndex, setStepIndex] = useState<number>(0)

  useEffect(() => {
    const current = SPIKE_STEPS[stepIndex]
    if (!current) return

    SPIKE_PREVIEW.log(current.id, 'enter')

    const timer = setTimeout(() => {
      SPIKE_PREVIEW.log(current.id, 'exit')
      setStepIndex((previousIndex) => (previousIndex + 1) % SPIKE_STEPS.length)
    }, current.duration)

    return () => clearTimeout(timer)
  }, [stepIndex])

  const current = SPIKE_STEPS[stepIndex] ?? SPIKE_STEPS[0]
  return { step: current as SpikeStepSnapshot, stepIndex }
}

// ---------------------------------------------------------------------------
// Sub-layout: AiPanelSpike
// ---------------------------------------------------------------------------

interface AiPanelSpikeProps {
  readonly step: SpikeStepSnapshot
}

function AiPanelSpike({ step }: AiPanelSpikeProps) {
  const typingTrack = step.interactions.typingRhythm[0]
  const typingActive = Boolean(typingTrack?.active)
  const fullText = step.aiInputText

  const { displayedText, progress } = useFakeTyping(fullText, {
    active: typingActive,
    totalDurationMs: 1400, // Step AI_INPUT duration 1500ms 보다 약간 짧게 (버퍼 100ms)
  })

  // 타이핑이 끝났으면 전체 텍스트 유지, 아직 active 아니면 빈 문자열 or 유지
  const textForDisplay = typingActive
    ? displayedText
    : step.id === 'INITIAL'
      ? ''
      : fullText

  const progressForDisplay = typingActive ? progress : step.id === 'INITIAL' ? 0 : 1

  const pressTarget = step.interactions.pressTargets[0]
  const autoPressAt =
    step.id === 'AI_EXTRACT' && pressTarget?.triggerAt !== null
      ? pressTarget?.triggerAt ?? null
      : null

  const loading = step.id === 'AI_EXTRACT'

  return (
    <aside className="w-[380px] flex-shrink-0 border-r border-white/10 bg-black/40 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-purple-600 to-blue-600 text-white text-[10px] font-bold shadow-sm shadow-purple-500/30"
          >
            AI
          </span>
          <h3 className="font-bold text-sm text-white">AI 화물 등록</h3>
        </div>
        <span className="text-[10px] text-gray-400">
          Step {step.index + 1}/4 ·{' '}
          <span className="text-accent">{step.label}</span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AiInputAreaSpike
          text={textForDisplay}
          progress={progressForDisplay}
          active={typingActive}
        />

        <div className="px-4 pb-4">
          <AiExtractButtonSpike
            key={`extract-${step.id}`}
            autoPressAt={autoPressAt}
            loading={loading}
          />
        </div>
      </div>
    </aside>
  )
}

// ---------------------------------------------------------------------------
// Sub-layout: OrderFormSpike (3-column 중 Col 1 + Col 3)
// ---------------------------------------------------------------------------

interface OrderFormSpikeProps {
  readonly step: SpikeStepSnapshot
}

function OrderFormSpike({ step }: OrderFormSpikeProps) {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 p-4 bg-gradient-to-br from-gray-900/50 to-gray-950/50">
      {/* Col 1: Company/Manager (pre-filled) */}
      <div className="lg:col-span-1 space-y-4">
        <CompanyManagerSectionSpike
          company={SPIKE_MOCK_DATA.company}
          manager={SPIKE_MOCK_DATA.manager}
        />
      </div>

      {/* Col 2: Spike 범위 외 placeholder */}
      <div className="lg:col-span-1 space-y-4">
        <div className="p-4 border border-dashed border-white/10 rounded-xl bg-white/[0.02] text-xs text-gray-600 text-center">
          Col 2 (Spike 범위 외)
          <br />
          <span className="text-[10px]">LocationForm / DateTime / CargoInfo</span>
        </div>
      </div>

      {/* Col 3: EstimateInfoCard (AI_APPLY 에서 활성) */}
      <div className="lg:col-span-1 space-y-4">
        <EstimateInfoCardSpike
          distance={SPIKE_MOCK_DATA.estimate.distance}
          duration={SPIKE_MOCK_DATA.estimate.duration}
          amount={SPIKE_MOCK_DATA.estimate.amount}
          active={step.estimateActive}
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step overlay fade (오버랩 100~200ms)
// ---------------------------------------------------------------------------

interface StepFadeProps {
  readonly step: SpikeStepSnapshot
}

function StepFade({ step }: StepFadeProps) {
  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }} // 150ms 오버랩
      className="flex-1 flex min-h-0"
    >
      <AiPanelSpike step={step} />
      <OrderFormSpike step={step} />
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Container
// ---------------------------------------------------------------------------

export function DashboardPreviewSpike() {
  const { step, stepIndex } = useSpikeAutoPlay()

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10 shadow-2xl text-foreground">
      {/* Preview chrome header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-white/5 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <span className="text-gray-400">
          dash-preview Spike ·{' '}
          <span className="text-accent">{step.id}</span>{' '}
          <span className="text-gray-500">
            ({stepIndex + 1}/4)
          </span>
        </span>
        <span className="text-[10px] text-gray-500">
          T-DASH3-SPIKE-01
        </span>
      </div>

      {/* Body */}
      <div className="flex min-h-[480px]">
        <AnimatePresence mode="sync">
          <StepFade key={step.id} step={step} />
        </AnimatePresence>
      </div>
    </div>
  )
}

export default DashboardPreviewSpike
