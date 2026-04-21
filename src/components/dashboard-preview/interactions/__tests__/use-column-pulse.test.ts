/**
 * T-DASH3-M4-03 (review#2) — useColumnPulse 단위 테스트
 *
 * TC
 *  - TC-DASH3-UNIT-COLPULSE (신규)
 *
 * REQ
 *  - REQ-DASH3-029 (#10 Column-wise Border Pulse)
 *  - REQ-DASH3-031 (prefers-reduced-motion fallback)
 *
 * 범위
 *  - active / triggerAt / durationMs 조합별 pulsing 상태 전환.
 *  - prefers-reduced-motion: reduce 시 pulse 미발동 (pulsing=false 고정).
 *  - deps 변경 시 timer cleanup 동작.
 */

import { renderHook, act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useColumnPulse } from '@/components/dashboard-preview/interactions/use-column-pulse'

// ---------------------------------------------------------------------------
// matchMedia helper (reduced-motion 토글)
// ---------------------------------------------------------------------------

function mockMatchMedia(reducedMotion: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches:
          query === '(prefers-reduced-motion: reduce)' ? reducedMotion : false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  })
}

describe('useColumnPulse', () => {
  beforeEach(() => {
    mockMatchMedia(false)
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('active=false 면 항상 pulsing=false', () => {
    const { result } = renderHook(() => useColumnPulse(false, 0))
    expect(result.current).toBe(false)
  })

  it('triggerAt=null 이면 pulsing=false', () => {
    const { result } = renderHook(() => useColumnPulse(true, null))
    expect(result.current).toBe(false)
  })

  it('triggerAt=0 이면 mount 즉시 pulsing=true', () => {
    const { result } = renderHook(() => useColumnPulse(true, 0))
    expect(result.current).toBe(true)
  })

  it('triggerAt=0 은 durationMs(400ms) 경과 후 pulsing=false 로 복귀', () => {
    const { result } = renderHook(() => useColumnPulse(true, 0))
    expect(result.current).toBe(true)
    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(result.current).toBe(false)
  })

  it('triggerAt=600 은 599ms 에 false, 600ms 에 true', () => {
    const { result } = renderHook(() => useColumnPulse(true, 600))

    // 0ms — 아직 미발동
    expect(result.current).toBe(false)

    // 599ms — 미발동
    act(() => {
      vi.advanceTimersByTime(599)
    })
    expect(result.current).toBe(false)

    // 600ms — pulse 시작
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe(true)
  })

  it('durationMs 옵션이 false 복귀 타이밍을 제어', () => {
    const { result } = renderHook(() =>
      useColumnPulse(true, 0, { durationMs: 200 }),
    )
    expect(result.current).toBe(true)

    // 199ms — 아직 pulse 유지
    act(() => {
      vi.advanceTimersByTime(199)
    })
    expect(result.current).toBe(true)

    // 200ms — pulse 종료
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe(false)
  })

  it('prefers-reduced-motion 시 pulse 미발동 (pulsing=false 고정)', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useColumnPulse(true, 0))
    expect(result.current).toBe(false)

    // 시간이 지나도 pulse 발동 없음
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current).toBe(false)
  })
})
