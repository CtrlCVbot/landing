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

const COMPLETE_STEP_INDEX = 4

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAutoPlay({
  steps,
  initialStep = 0,
  enabled = true,
}: UseAutoPlayOptions): UseAutoPlayReturn {
  const [currentStep, setCurrentStep] = useState(
    enabled ? initialStep : COMPLETE_STEP_INDEX,
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
