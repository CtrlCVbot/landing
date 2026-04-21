/**
 * @task T-DASH3-M1-05
 * @req REQ-DASH3-021, REQ-DASH3-072
 *
 * #2 조작감: 순차 focus ring 이동 훅 테스트.
 *
 * - targets 배열에 지정된 DOM id 순회
 * - intervalMs 간격으로 currentTargetId 전진
 * - active=false 시 null
 * - prefers-reduced-motion 시 즉시 마지막 target
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
import { useFocusWalk } from '@/components/dashboard-preview/interactions/use-focus-walk'

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
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.useFakeTimers()
  mockMatchMedia(false)
})

afterEach(() => {
  vi.useRealTimers()
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useFocusWalk', () => {
  describe('TC-DASH3-UNIT-FOCUS-01: 순차 이동', () => {
    it('최초 tick 직후 첫 번째 target 으로 이동한다', () => {
      const { result } = renderHook(() =>
        useFocusWalk(['id-a', 'id-b', 'id-c'], { intervalMs: 300 }),
      )

      // 마운트 직후에는 null 이거나 첫 target — 규약: 첫 target 을 즉시 활성화
      expect(result.current.currentTargetId).toBe('id-a')
    })

    it('intervalMs 경과 시 다음 target 으로 전진한다', () => {
      const { result } = renderHook(() =>
        useFocusWalk(['id-a', 'id-b', 'id-c'], { intervalMs: 300 }),
      )

      expect(result.current.currentTargetId).toBe('id-a')

      act(() => {
        vi.advanceTimersByTime(300)
      })
      expect(result.current.currentTargetId).toBe('id-b')

      act(() => {
        vi.advanceTimersByTime(300)
      })
      expect(result.current.currentTargetId).toBe('id-c')
    })
  })

  describe('TC-DASH3-UNIT-FOCUS-02: 옵션', () => {
    it('active=false 이면 currentTargetId 가 null 이다', () => {
      const { result } = renderHook(() =>
        useFocusWalk(['id-a', 'id-b'], { intervalMs: 300, active: false }),
      )

      expect(result.current.currentTargetId).toBeNull()

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.currentTargetId).toBeNull()
    })

    it('targets 가 빈 배열이면 null 을 유지한다', () => {
      const { result } = renderHook(() =>
        useFocusWalk([], { intervalMs: 300 }),
      )

      expect(result.current.currentTargetId).toBeNull()

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.currentTargetId).toBeNull()
    })
  })

  describe('TC-DASH3-UNIT-FOCUS-03: prefers-reduced-motion', () => {
    it('prefers-reduced-motion: reduce 인 경우 마지막 target 만 즉시 반환한다', () => {
      mockMatchMedia(true)

      const { result } = renderHook(() =>
        useFocusWalk(['id-a', 'id-b', 'id-c'], { intervalMs: 300 }),
      )

      // 타이머를 돌리지 않아도 즉시 마지막 target
      expect(result.current.currentTargetId).toBe('id-c')

      // 타이머가 흘러도 그대로
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      expect(result.current.currentTargetId).toBe('id-c')
    })
  })
})
