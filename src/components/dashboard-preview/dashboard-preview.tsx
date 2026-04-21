'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { previewFadeIn } from '@/lib/motion'
import { PREVIEW_MOCK_DATA } from '@/lib/mock-data'
import { PREVIEW_STEPS } from '@/lib/preview-steps'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useAutoPlay } from './use-auto-play'
import { useDashV3 } from './use-dash-v3'
import { useInteractiveMode } from './use-interactive-mode'
import { PreviewChrome } from './preview-chrome'
import { StepIndicator } from './step-indicator'
import { AiPanelPreview } from './ai-panel-preview'
import { FormPreview } from './form-preview'
import { MobileCardView } from './mobile-card-view'
import { InteractiveOverlay } from './interactive-overlay'
import { getHitAreas, type HitAreaConfig } from './hit-areas'

// ---------------------------------------------------------------------------
// T-DASH3-M1-09: AiRegisterMain dynamic import (Spike 발굴 이슈 해소)
//
// REQ-DASH3-062: Mobile(<768px) 뷰포트에서 `ai-register-main` 청크 네트워크 요청 0건.
//  - `next/dynamic` + `ssr: false` 로 래핑 → 서버 렌더 시 번들 분리.
//  - `DashboardPreview` 상단의 `if (isMobile) return <MobileCardView />` 조기 종료와
//    결합하여, Mobile 뷰포트에서는 AiRegisterMain 자체가 import 되지 않는다.
//  - Phase 1/2 `DashboardPreview` 컴포넌트 자체가 `'use client'` + framer-motion 사용으로
//    이미 CSR 이라 SSR 분리 부담은 없다.
//  - Chrome Preview 내부 body 라 별도 loading skeleton 은 불필요 → `loading: () => null`.
// ---------------------------------------------------------------------------
const AiRegisterMain = dynamic(
  () => import('./ai-register-main').then((m) => ({ default: m.AiRegisterMain })),
  {
    ssr: false,
    loading: () => null,
  },
)

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
 * Phase 3 4단계 기준 (COMPLETE 제거됨).
 *  - ai-input → AI_INPUT (1)
 *  - extract-button → AI_EXTRACT (2)
 *  - result-* → AI_APPLY (3)
 */
const AREA_TO_STEP: Readonly<Record<string, number>> = {
  'ai-input': 1,
  'extract-button': 2,
  'result-departure': 3,
  'result-destination': 3,
  'result-cargo': 3,
  'result-fare': 3,
} as const

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DashboardPreview({ className }: DashboardPreviewProps) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')

  // T-DASH3-M1-04: Phase 3 Feature flag (env NEXT_PUBLIC_DASH_V3=phase3|spike 또는 ?dashV3=1)
  const dashV3Enabled = useDashV3()

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
  // REQ-DASH-023/024 (M1-04): Tablet scaleFactor 0.38 → 0.40 (가독성 개선)
  const scaleFactor = isTablet ? 0.4 : 0.45

  // T-DASH3-M1-09 (Spike 발굴): Mobile(<768px) 은 flag 상태와 무관하게
  // MobileCardView 를 렌더한다. 상단 `AiRegisterMain = dynamic(..., { ssr: false })`
  // 와 결합하여 Mobile 에서는 `ai-register-main` 청크가 네트워크 로드되지 않는다.
  // (REQ-DASH3-062 / TC-DASH3-INT-MOBILE-FALLBACK)
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
          {/* T-DASH3-M1-04: Phase 3 Feature flag 분기. */}
          {dashV3Enabled ? (
            <AiRegisterMain step={step} mockData={PREVIEW_MOCK_DATA} />
          ) : (
            <div className="flex h-full">
              <AiPanelPreview aiPanelState={step.aiPanelState} />
              <FormPreview formState={step.formState} className="flex-1" />
            </div>
          )}
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
