/**
 * @spike T-DASH3-SPIKE-01 — 종료 시 이관 or 폐기
 *
 * #8 조작감: 숫자 카운터 롤링 훅.
 *
 * - Duration 0.3~0.5s (기본 400ms)
 * - easeOut (1 - (1 - t)^3)
 * - active=false 시 즉시 target 반환
 * - `prefers-reduced-motion: reduce` 시 즉시 target
 *
 * 기존 `use-animated-number.ts` 와 의도는 동일하나, Spike 네이밍 규약
 * (target 을 positional arg, options 는 두 번째) 과 reduced-motion 처리를
 * 내장한 형태로 신규 구현.
 */

'use client'

import { useEffect, useRef, useState } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseNumberRollingOptions {
  /** 롤링 지속시간 (ms). 기본 400 */
  readonly durationMs?: number
  /** false 시 즉시 target 반환 (애니메이션 없음) */
  readonly active?: boolean
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

export function useNumberRolling(
  target: number,
  options: UseNumberRollingOptions = {},
): number {
  const { durationMs = 400, active = true } = options
  const [value, setValue] = useState<number>(active ? 0 : target)
  const rafRef = useRef<number | null>(null)
  const fromRef = useRef<number>(0)

  useEffect(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    // 비활성 또는 reduced-motion: 즉시 최종값
    if (!active || prefersReducedMotion()) {
      fromRef.current = target
      setValue(target)
      return
    }

    const startTime = performance.now()
    const fromValue = fromRef.current
    const delta = target - fromValue

    if (delta === 0) {
      setValue(target)
      return
    }

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const next = fromValue + delta * eased
      setValue(next)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = target
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [target, durationMs, active])

  return Math.round(value)
}
