'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { previewFadeIn } from '@/lib/motion'
import { PREVIEW_STEPS } from '@/lib/preview-steps'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useAutoPlay } from './use-auto-play'
import { useInteractiveMode } from './use-interactive-mode'
import { PreviewChrome } from './preview-chrome'
import { StepIndicator } from './step-indicator'
import { AiPanelPreview } from './ai-panel-preview'
import { FormPreview } from './form-preview'
import { MobileCardView } from './mobile-card-view'
import { InteractiveOverlay } from './interactive-overlay'
import { getHitAreas, type HitAreaConfig } from './hit-areas'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DashboardPreviewProps {
  readonly className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * HitArea 클릭 시 useAutoPlay.goToStep 으로 점프할 Step 인덱스 매핑.
 * - ai-input → AI_INPUT (1)
 * - extract-button → AI_EXTRACT (2)
 * - result-* → AI_APPLY (3)
 * - result-fare → COMPLETE (4)
 */
const AREA_TO_STEP: Readonly<Record<string, number>> = {
  'ai-input': 1,
  'extract-button': 2,
  'result-departure': 3,
  'result-destination': 3,
  'result-cargo': 3,
  'result-fare': 4,
} as const

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DashboardPreview({ className }: DashboardPreviewProps) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')

  const interactive = useInteractiveMode({
    enabled: !isMobile && !prefersReducedMotion,
  })

  // EC-02: Mobile에서는 축소 뷰가 렌더링되지 않으므로 useAutoPlay 비활성화 (타이머 정지)
  const { currentStep, pause, resume, goToStep } = useAutoPlay({
    steps: PREVIEW_STEPS,
    enabled: !prefersReducedMotion && !isMobile,
  })

  // 모드 전환에 따른 useAutoPlay 제어
  useEffect(() => {
    if (interactive.mode === 'interactive') {
      pause('click')
    } else if (interactive.mode === 'cinematic') {
      resume()
    }
  }, [interactive.mode, pause, resume])

  const step = PREVIEW_STEPS[currentStep]
  const scaleFactor = isTablet ? 0.38 : 0.45

  if (isMobile) {
    return (
      <motion.div
        variants={previewFadeIn}
        initial="hidden"
        animate="visible"
        className={cn('w-full max-w-4xl mx-auto', className)}
        aria-label="AI 화물 등록 워크플로우 데모 미리보기"
      >
        <MobileCardView />
      </motion.div>
    )
  }

  const viewport = isTablet ? 'tablet' : 'desktop'
  const hitAreas = getHitAreas(viewport)

  const isAreaEnabled = (area: HitAreaConfig): boolean => {
    switch (area.logicalDependency) {
      case 'input-has-text':
        return interactive.executedAreaIds.has('ai-input')
      case 'extracted':
        return interactive.executedAreaIds.has('extract-button')
      default:
        return true
    }
  }

  const handleAreaExecute = (areaId: string) => {
    interactive.executeArea(areaId)
    const targetStep = AREA_TO_STEP[areaId]
    if (targetStep !== undefined) {
      goToStep(targetStep)
    }
  }

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (interactive.mode !== 'cinematic') return
    const target = event.target as HTMLElement | null
    // Step Indicator(role=tablist) 클릭은 인터랙티브 진입 트리거가 아님
    if (target?.closest('[role="tablist"]')) return
    interactive.enterInteractive()
  }

  return (
    <motion.div
      variants={previewFadeIn}
      initial="hidden"
      animate="visible"
      className={cn('w-full max-w-4xl mx-auto', className)}
      onMouseEnter={() => {
        if (interactive.mode === 'cinematic') pause('hover')
      }}
      onMouseLeave={() => {
        if (interactive.mode === 'cinematic') resume()
      }}
      onClick={handleContainerClick}
      aria-label="AI 화물 등록 워크플로우 데모 미리보기"
    >
      <div className="relative">
        <PreviewChrome scaleFactor={scaleFactor}>
          <div className="flex h-full">
            <AiPanelPreview aiPanelState={step.aiPanelState} />
            <FormPreview formState={step.formState} className="flex-1" />
          </div>
        </PreviewChrome>
        {interactive.mode === 'interactive' && (
          <InteractiveOverlay
            hitAreas={hitAreas}
            scaleFactor={scaleFactor}
            onAreaExecute={handleAreaExecute}
            isAreaEnabled={isAreaEnabled}
          />
        )}
      </div>
      <StepIndicator
        totalSteps={PREVIEW_STEPS.length}
        currentStep={currentStep}
        onStepClick={goToStep}
      />
      {/* REQ-DASH-048: 모드 전환 스크린리더 안내 (aria-live polite) */}
      <div role="status" aria-live="polite" className="sr-only">
        {interactive.statusMessage}
      </div>
    </motion.div>
  )
}
