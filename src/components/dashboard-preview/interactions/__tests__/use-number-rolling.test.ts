/**
 * @task T-DASH3-M1-05
 * @req REQ-DASH3-025, REQ-DASH3-072
 *
 * #8 조작감: 숫자 카운터 롤링 훅 테스트.
 *
 * - 초기값 0 (active=true) 또는 target (active=false)
 * - target 도달
 * - prefers-reduced-motion 시 즉시 최종값
 */

import { renderHook, act } from '@testing-library/react'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { useNumberRolling } from '@/components/dashboard-preview/interactions/use-number-rolling'

// ---------------------------------------------------------------------------
// matchMedia helper
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

// ---------------------------------------------------------------------------
// rAF helper — jsdom 에서 performance.now + rAF 를 fake timer 로 제어
// ---------------------------------------------------------------------------

function installRafShim(): () => void {
  const originalRaf = globalThis.requestAnimationFrame
  const originalCaf = globalThis.cancelAnimationFrame
  const FRAME_MS = 16
  let nowRef = 0

  globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) =>
    setTimeout(() => {
      nowRef += FRAME_MS
      cb(nowRef)
    }, FRAME_MS) as unknown as number) as typeof requestAnimationFrame
  globalThis.cancelAnimationFrame = ((id: number) =>
    clearTimeout(id as unknown as ReturnType<typeof setTimeout>)) as typeof cancelAnimationFrame

  const originalNow = performance.now.bind(performance)
  ;(performance as unknown as { now: () => number }).now = () => nowRef

  return () => {
    globalThis.requestAnimationFrame = originalRaf
    globalThis.cancelAnimationFrame = originalCaf
    ;(performance as unknown as { now: () => number }).now = originalNow
  }
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

let teardownRaf: (() => void) | null = null

beforeEach(() => {
  vi.useFakeTimers()
  mockMatchMedia(false)
  teardownRaf = installRafShim()
})

afterEach(() => {
  teardownRaf?.()
  teardownRaf = null
  vi.useRealTimers()
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useNumberRolling', () => {
  describe('TC-DASH3-UNIT-ROLL-01: 초기 및 target 도달', () => {
    it('active 기본값에서 초기값 0 으로 시작한다', () => {
      const { result } = renderHook(() => useNumberRolling(1000))
      expect(result.current).toBe(0)
    })

    it('충분한 시간 경과 후 target 에 도달한다', () => {
      const { result } = renderHook(() =>
        useNumberRolling(1000, { durationMs: 400 }),
      )

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current).toBe(1000)
    })
  })

  describe('TC-DASH3-UNIT-ROLL-02: active=false', () => {
    it('active=false 이면 즉시 target 값을 반환한다', () => {
      const { result } = renderHook(() =>
        useNumberRolling(500, { active: false }),
      )

      expect(result.current).toBe(500)
    })
  })

  describe('TC-DASH3-UNIT-ROLL-03: prefers-reduced-motion', () => {
    it('prefers-reduced-motion: reduce 인 경우 즉시 target 값을 반환한다', () => {
      mockMatchMedia(true)

      const { result } = renderHook(() =>
        useNumberRolling(777, { durationMs: 400 }),
      )

      expect(result.current).toBe(777)
    })
  })
})
