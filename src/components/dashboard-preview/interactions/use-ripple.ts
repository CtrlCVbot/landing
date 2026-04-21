/**
 * @task T-DASH3-M1-05
 * @req REQ-DASH3-023
 *
 * #4 조작감: 클릭 ripple wave 훅.
 *
 * - trigger 호출 시 클릭 좌표(currentTarget 기준)로 ripple 추가
 * - durationMs (기본 300) 이 지나면 해당 ripple 을 배열에서 제거
 * - `prefers-reduced-motion: reduce` 시 ripple 미생성 (빈 배열 유지)
 *
 * 소비 컴포넌트는 ripples 를 렌더링하고 trigger 를 onClick 에 바인딩한다.
 */

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Ripple {
  readonly id: string
  readonly x: number
  readonly y: number
}

export interface UseRippleOptions {
  /** ripple 지속시간 (ms). 기본 300 */
  readonly durationMs?: number
}

export interface UseRippleResult {
  readonly ripples: ReadonlyArray<Ripple>
  readonly trigger: (event: ReactMouseEvent<HTMLElement>) => void
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

export function useRipple(options: UseRippleOptions = {}): UseRippleResult {
  const { durationMs = 300 } = options
  const [ripples, setRipples] = useState<ReadonlyArray<Ripple>>([])
  const counterRef = useRef<number>(0)
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())

  // 언마운트 시 타이머 정리
  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((timer) => clearTimeout(timer))
      timers.clear()
    }
  }, [])

  const trigger = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      if (prefersReducedMotion()) return

      const element = event.currentTarget
      const rect = element.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      counterRef.current += 1
      const id = `ripple-${counterRef.current}`

      const ripple: Ripple = { id, x, y }
      setRipples((prev) => [...prev, ripple])

      const timer = setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
        timersRef.current.delete(timer)
      }, durationMs)
      timersRef.current.add(timer)
    },
    [durationMs],
  )

  return { ripples, trigger }
}
