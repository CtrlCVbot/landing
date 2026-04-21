/**
 * @task T-DASH3-M4-03 (review#2)
 * @req REQ-DASH3-029 + REQ-DASH3-031 (reduced-motion)
 *
 * #10 Column-wise Border Pulse 전용 훅.
 *
 * 사양
 *  - active=false 또는 triggerAt=null/음수 → pulsing=false (즉시).
 *  - triggerAt=0 → mount 즉시 pulsing=true, durationMs 후 false.
 *  - triggerAt>0 → 해당 ms 대기 후 pulsing=true, 이어서 durationMs 후 false.
 *  - `prefers-reduced-motion: reduce` 시 pulse 미발동 (pulsing=false 고정).
 *
 * 다른 interactions 훅(use-button-press / use-fake-typing / use-ripple 등)과 동일하게
 * reduced-motion 을 존중하여 접근성(REQ-DASH3-031) 을 유지한다.
 */

'use client'

import { useEffect, useState } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseColumnPulseOptions {
  /** pulse 지속 시간 (ms). 기본 400. */
  readonly durationMs?: number
}

// ---------------------------------------------------------------------------
// Reduced-motion
// ---------------------------------------------------------------------------

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

const DEFAULT_DURATION_MS = 400

/**
 * Column pulse 활성 상태를 반환.
 * @param active — false 이면 훅 비활성 (pulsing=false).
 * @param triggerAt — pulse 시작 시점 (ms). null/undefined/음수면 비활성.
 * @param options.durationMs — pulse 지속 시간 (기본 400).
 */
export function useColumnPulse(
  active: boolean,
  triggerAt: number | null | undefined,
  options: UseColumnPulseOptions = {},
): boolean {
  const { durationMs = DEFAULT_DURATION_MS } = options

  // reduced-motion 시에는 pulse 를 절대 활성화하지 않는다.
  const [pulsing, setPulsing] = useState<boolean>(() => {
    if (prefersReducedMotion()) return false
    return active && triggerAt === 0
  })

  useEffect(() => {
    if (!active || triggerAt === null || triggerAt === undefined || triggerAt < 0) {
      setPulsing(false)
      return
    }

    if (prefersReducedMotion()) {
      setPulsing(false)
      return
    }

    let endTimer: ReturnType<typeof setTimeout> | null = null
    let startTimer: ReturnType<typeof setTimeout> | null = null

    const scheduleEnd = () =>
      setTimeout(() => setPulsing(false), durationMs)

    if (triggerAt === 0) {
      setPulsing(true)
      endTimer = scheduleEnd()
    } else {
      startTimer = setTimeout(() => {
        setPulsing(true)
        endTimer = scheduleEnd()
      }, triggerAt)
    }

    return () => {
      if (startTimer !== null) clearTimeout(startTimer)
      if (endTimer !== null) clearTimeout(endTimer)
    }
  }, [active, triggerAt, durationMs])

  return pulsing
}
