/**
 * useTriggerAt — active + triggerAt 기반 "발동 시점 제어" 공통 훅.
 *
 * M3-review#2 — 공통 추출.
 *   transport-option-card/useStrokeTriggered,
 *   estimate-info-card/useRollingTriggered,
 *   settlement-section/useRollingTriggered
 *   에 동일 35줄 훅이 3벌 복제되어 있던 것을 1 파일로 통합한다.
 *
 * 사양
 *  - active=false → triggered=false (즉시)
 *  - triggerAt=null/undefined/음수 → triggered=false
 *  - triggerAt=0 → triggered=true 즉시 (initial state)
 *    · useNumberRolling 이 mount 시점 rAF 를 예약하는 패턴에 맞춰,
 *      테스트 단일 `vi.advanceTimersByTime` 에서 애니메이션 수렴을 관측 가능하게 한다.
 *  - triggerAt>0 → setTimeout(triggerAt) 이후 triggered=true
 *  - deps (active, triggerAt) 변경 시 이전 timer cleanup + 재평가
 *
 * @see transport-option-card.tsx (#9 stroke 애니)
 * @see estimate-info-card.tsx (#8 number-rolling)
 * @see settlement-section.tsx (#8 number-rolling 합계)
 */

'use client'

import { useEffect, useState } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseTriggerAtOptions {
  readonly active: boolean
  readonly triggerAt?: number | null
}

// ---------------------------------------------------------------------------
// Helper — initial state 계산
// ---------------------------------------------------------------------------

function computeInitialTriggered(
  active: boolean,
  triggerAt: number | null | undefined,
): boolean {
  if (!active) return false
  if (triggerAt === null || triggerAt === undefined || triggerAt < 0) {
    return false
  }
  return triggerAt === 0
}

// ---------------------------------------------------------------------------
// Hook — useTriggerAt
// ---------------------------------------------------------------------------

export function useTriggerAt({
  active,
  triggerAt,
}: UseTriggerAtOptions): boolean {
  const [triggered, setTriggered] = useState<boolean>(
    computeInitialTriggered(active, triggerAt),
  )

  useEffect(() => {
    if (!active) {
      setTriggered(false)
      return
    }
    if (triggerAt === null || triggerAt === undefined || triggerAt < 0) {
      setTriggered(false)
      return
    }
    // triggerAt=0 — initial state 에서 이미 true 이므로 setTimeout 불필요
    if (triggerAt === 0) {
      setTriggered(true)
      return
    }

    const timer = setTimeout(() => {
      setTriggered(true)
    }, triggerAt)

    return () => {
      clearTimeout(timer)
      setTriggered(false)
    }
  }, [active, triggerAt])

  return triggered
}
