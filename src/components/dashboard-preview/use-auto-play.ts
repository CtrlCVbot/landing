'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { PreviewStep } from '@/lib/preview-steps'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PauseSource = 'hover' | 'click'

interface UseAutoPlayOptions {
  readonly steps: readonly PreviewStep[]
  readonly initialStep?: number
  readonly enabled?: boolean
}

interface UseAutoPlayReturn {
  readonly currentStep: number
  readonly isPlaying: boolean
  readonly pause: (source: PauseSource) => void
  readonly resume: () => void
  readonly goToStep: (index: number) => void
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const RESUME_DELAY: Readonly<Record<PauseSource, number>> = {
  hover: 2000,
  click: 5000,
} as const

/**
 * 비활성 모드(prefers-reduced-motion / mobile)에서 고정 노출될 Step 인덱스.
 * Phase 3 에서 PREVIEW_STEPS 가 4단계로 축소되면서(Step.length - 1 = 3) 동적으로 계산한다.
 * Phase 1/2 의 5단계(index 4) 가정을 깨지 않도록 런타임 길이를 기준으로 삼는다.
 */
function getLastStepIndex(length: number): number {
  return Math.max(0, length - 1)
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAutoPlay({
  steps,
  initialStep = 0,
  enabled = true,
}: UseAutoPlayOptions): UseAutoPlayReturn {
  const [currentStep, setCurrentStep] = useState(
    enabled ? initialStep : getLastStepIndex(steps.length),
  )
  const [isPlaying, setIsPlaying] = useState(enabled)

  const stepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastPauseSourceRef = useRef<PauseSource>('hover')

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------

  const clearStepTimer = useCallback(() => {
    if (stepTimerRef.current !== null) {
      clearTimeout(stepTimerRef.current)
      stepTimerRef.current = null
    }
  }, [])

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current !== null) {
      clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = null
    }
  }, [])

  // -----------------------------------------------------------------------
  // Step advancement
  // -----------------------------------------------------------------------

  useEffect(() => {
    if (!enabled || !isPlaying) {
      return
    }

    const duration = steps[currentStep].duration

    stepTimerRef.current = setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, duration)

    return () => {
      clearStepTimer()
    }
  }, [currentStep, isPlaying, enabled, steps, clearStepTimer])

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  const pause = useCallback(
    (source: PauseSource) => {
      if (!enabled) return

      // Click overrides hover (higher priority delay)
      if (source === 'click' || lastPauseSourceRef.current !== 'click') {
        lastPauseSourceRef.current = source
      }

      clearStepTimer()
      clearResumeTimer()
      setIsPlaying(false)
    },
    [enabled, clearStepTimer, clearResumeTimer],
  )

  const resume = useCallback(() => {
    if (!enabled) return

    clearResumeTimer()

    const delay = RESUME_DELAY[lastPauseSourceRef.current]

    resumeTimerRef.current = setTimeout(() => {
      lastPauseSourceRef.current = 'hover'
      setIsPlaying(true)
    }, delay)
  }, [enabled, clearResumeTimer])

  const goToStep = useCallback(
    (index: number) => {
      if (!enabled) return

      setCurrentStep(index)
      pause('click')
    },
    [enabled, pause],
  )

  // -----------------------------------------------------------------------
  // Cleanup on unmount
  // -----------------------------------------------------------------------

  useEffect(() => {
    return () => {
      clearStepTimer()
      clearResumeTimer()
    }
  }, [clearStepTimer, clearResumeTimer])

  return { currentStep, isPlaying, pause, resume, goToStep }
}
