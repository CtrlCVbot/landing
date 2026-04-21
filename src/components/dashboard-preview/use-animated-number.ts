'use client'

import { useEffect, useRef, useState } from 'react'

interface UseAnimatedNumberOptions {
  readonly target: number | null
  readonly duration?: number // ms
  readonly enabled?: boolean // false 시 즉시 target 반환 (reduced-motion 등)
}

/**
 * 숫자 카운팅 애니메이션 훅.
 * target이 변경되면 이전 값에서 새 값까지 duration 동안 점진적으로 변화.
 *
 * - target이 null이면 0 반환
 * - enabled=false면 target을 즉시 반환 (애니메이션 없음)
 * - easeOut 적용
 *
 * 참조: REQ-DASH-009 (Should)
 */
export function useAnimatedNumber({
  target,
  duration = 800,
  enabled = true,
}: UseAnimatedNumberOptions): number {
  const [value, setValue] = useState<number>(target ?? 0)
  const fromRef = useRef<number>(target ?? 0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    // target이 null이면 즉시 0
    if (target === null) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      fromRef.current = 0
      setValue(0)
      return
    }

    // enabled=false 또는 변화량 0이면 즉시 적용
    if (!enabled || fromRef.current === target) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      fromRef.current = target
      setValue(target)
      return
    }

    const startTime = performance.now()
    const fromValue = fromRef.current
    const delta = target - fromValue

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOut: 1 - (1 - t)^3
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
  }, [target, duration, enabled])

  return Math.round(value)
}
