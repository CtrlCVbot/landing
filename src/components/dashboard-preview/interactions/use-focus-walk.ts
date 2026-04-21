/**
 * @task T-DASH3-M1-05
 * @req REQ-DASH3-021
 *
 * #2 조작감: 순차 focus ring 이동 훅.
 *
 * 원칙:
 * - targets 배열의 DOM id 순서대로 currentTargetId 전진
 * - intervalMs 간격 (기본 400ms) 으로 자동 이동
 * - 마지막 target 도달 후에는 그 상태 유지 (loop 하지 않음)
 * - active=false 면 currentTargetId = null
 * - `prefers-reduced-motion: reduce` 시 즉시 마지막 target 반환
 *
 * 소비 컴포넌트는 currentTargetId 에 해당하는 요소에 focus ring 스타일을 적용한다.
 */

'use client'

import { useEffect, useMemo, useState } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseFocusWalkOptions {
  /** 다음 target 으로 넘어가는 간격 (ms). 기본 400 */
  readonly intervalMs?: number
  /** false 면 currentTargetId 가 null (비활성) */
  readonly active?: boolean
}

export interface UseFocusWalkResult {
  /** 현재 focus ring 을 올릴 DOM id. 없음 = null */
  readonly currentTargetId: string | null
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

export function useFocusWalk(
  targets: ReadonlyArray<string>,
  options: UseFocusWalkOptions = {},
): UseFocusWalkResult {
  const { intervalMs = 400, active = true } = options

  // targets 배열을 정체성 안정화: 참조가 달라져도 join 결과가 같으면 동일로 취급
  const targetsKey = targets.join('|')

  const [index, setIndex] = useState<number>(0)

  useEffect(() => {
    // 비활성 또는 target 없음
    if (!active || targets.length === 0) {
      setIndex(0)
      return
    }

    // reduced-motion: 마지막 target 으로 즉시 점프
    if (prefersReducedMotion()) {
      setIndex(targets.length - 1)
      return
    }

    // 새로운 targets 진입 시 첫 index 로 재시작
    setIndex(0)

    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1
        if (next >= targets.length) {
          // 마지막 도달: 타이머 정지
          clearInterval(timer)
          return targets.length - 1
        }
        return next
      })
    }, intervalMs)

    return () => {
      clearInterval(timer)
    }
    // targetsKey 로 정체성을 고정 — 참조가 매 렌더마다 바뀌더라도 내용이 같으면 재실행하지 않는다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetsKey, intervalMs, active])

  const currentTargetId = useMemo(() => {
    if (!active || targets.length === 0) return null
    return targets[index] ?? null
  }, [active, targetsKey, index])

  return { currentTargetId }
}
