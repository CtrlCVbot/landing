/**
 * T-DASH3-M3-review#2 — useTriggerAt 공통 훅 단위 테스트
 *
 * TC
 *  - TC-DASH3-UNIT-TRIGGERAT (active + triggerAt 기반 발동 시점 제어)
 *
 * REQ
 *  - M3 holistic review MEDIUM#2: transport-option-card/useStrokeTriggered,
 *    estimate-info-card/useRollingTriggered, settlement-section/useRollingTriggered
 *    에 동일 35줄 훅이 3벌 복제되어 있어 공통화 필요.
 *
 * 범위
 *  - active=false → triggered=false (즉시)
 *  - triggerAt=null/undefined/음수 → triggered=false
 *  - triggerAt=0 → triggered=true 즉시 (initial state)
 *  - triggerAt>0 → setTimeout 후 triggered=true
 *  - deps 변경 시 cleanup 확인
 */

import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useTriggerAt } from '@/components/dashboard-preview/interactions/use-trigger-at'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useTriggerAt — TC-DASH3-UNIT-TRIGGERAT', () => {
  it('active=false → triggered=false (triggerAt 값과 무관하게)', () => {
    const { result } = renderHook(() =>
      useTriggerAt({ active: false, triggerAt: 0 }),
    )
    expect(result.current).toBe(false)
  })

  it('active=true + triggerAt=null → triggered=false', () => {
    const { result } = renderHook(() =>
      useTriggerAt({ active: true, triggerAt: null }),
    )
    expect(result.current).toBe(false)
  })

  it('active=true + triggerAt=undefined → triggered=false', () => {
    const { result } = renderHook(() =>
      useTriggerAt({ active: true, triggerAt: undefined }),
    )
    expect(result.current).toBe(false)
  })

  it('active=true + triggerAt=음수 → triggered=false', () => {
    const { result } = renderHook(() =>
      useTriggerAt({ active: true, triggerAt: -100 }),
    )
    expect(result.current).toBe(false)
  })

  it('active=true + triggerAt=0 → triggered=true (initial state 즉시)', () => {
    const { result } = renderHook(() =>
      useTriggerAt({ active: true, triggerAt: 0 }),
    )
    // initial render 부터 true (setTimeout 대기 없음)
    expect(result.current).toBe(true)
  })

  it('active=true + triggerAt=100 → 100ms 경과 후 triggered=true', () => {
    const { result } = renderHook(() =>
      useTriggerAt({ active: true, triggerAt: 100 }),
    )
    // 초기 — 아직 발동 전
    expect(result.current).toBe(false)
    // 50ms 경과 — 여전히 false
    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(result.current).toBe(false)
    // 추가 60ms → 총 110ms 경과 — 발동됨
    act(() => {
      vi.advanceTimersByTime(60)
    })
    expect(result.current).toBe(true)
  })

  it('triggerAt 변경 시 이전 timer 가 cleanup 되고 새 timer 예약', () => {
    const { result, rerender } = renderHook(
      ({ triggerAt }: { triggerAt: number | null }) =>
        useTriggerAt({ active: true, triggerAt }),
      { initialProps: { triggerAt: 100 as number | null } },
    )
    // 50ms 경과 후 triggerAt 을 200 으로 변경
    act(() => {
      vi.advanceTimersByTime(50)
    })
    rerender({ triggerAt: 200 })
    // 원래 timer(100ms) 는 취소되었으므로, 추가 60ms(총 110ms) 경과에도 false 유지
    act(() => {
      vi.advanceTimersByTime(60)
    })
    expect(result.current).toBe(false)
    // 새 timer 완수 — 추가 150ms → 새 시점 기준 210ms 경과
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(result.current).toBe(true)
  })

  it('active=true → false 전환 시 triggered=false 로 복귀', () => {
    const { result, rerender } = renderHook(
      ({ active }: { active: boolean }) =>
        useTriggerAt({ active, triggerAt: 0 }),
      { initialProps: { active: true } },
    )
    expect(result.current).toBe(true)
    rerender({ active: false })
    expect(result.current).toBe(false)
  })
})
