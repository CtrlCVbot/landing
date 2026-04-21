/**
 * @task T-DASH3-M1-05
 * @req REQ-DASH3-020, REQ-DASH3-072
 *
 * #1 조작감: 변동 리듬 타이핑 훅 테스트.
 *
 * - displayedText 점진 증가 (0 → fullText)
 * - progress 0 → 1
 * - active=false 시 빈 문자열
 * - prefers-reduced-motion 시 즉시 최종 텍스트
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
import { useFakeTyping } from '@/components/dashboard-preview/interactions/use-fake-typing'

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

describe('useFakeTyping', () => {
  describe('TC-DASH3-UNIT-TYP-01: displayedText 점진 증가', () => {
    it('초기에는 빈 문자열이고 시간 경과 후 최종 텍스트로 확장된다', () => {
      const { result } = renderHook(() =>
        useFakeTyping('부산발 서울도착', { totalDurationMs: 600 }),
      )

      // 초기 progress 0, displayedText 빈 문자열
      expect(result.current.displayedText).toBe('')
      expect(result.current.progress).toBe(0)

      // 전체 duration + 여유 경과 → 최종 텍스트
      act(() => {
        vi.advanceTimersByTime(1500)
      })

      expect(result.current.displayedText).toBe('부산발 서울도착')
      expect(result.current.progress).toBe(1)
    })

    it('progress 가 0 과 1 사이의 점진적 중간 값을 가진다', () => {
      const { result } = renderHook(() =>
        useFakeTyping('ABCDEFGHIJ', { totalDurationMs: 500 }),
      )

      const progressSnapshots: number[] = []

      for (let step = 0; step < 5; step += 1) {
        act(() => {
          vi.advanceTimersByTime(100)
        })
        progressSnapshots.push(result.current.progress)
      }

      // 단조 비감소 (순차적으로 증가 혹은 유지)
      for (let i = 1; i < progressSnapshots.length; i += 1) {
        const prev = progressSnapshots[i - 1] ?? 0
        const curr = progressSnapshots[i] ?? 0
        expect(curr).toBeGreaterThanOrEqual(prev)
      }
      // 마지막 시점에는 1 에 도달
      expect(result.current.progress).toBe(1)
    })
  })

  describe('TC-DASH3-UNIT-TYP-02: active=false', () => {
    it('active=false 이면 displayedText 를 빈 문자열로 유지한다', () => {
      const { result } = renderHook(() =>
        useFakeTyping('부산발 서울도착', { active: false }),
      )

      expect(result.current.displayedText).toBe('')
      expect(result.current.progress).toBe(0)

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      // 여전히 비활성 상태
      expect(result.current.displayedText).toBe('')
      expect(result.current.progress).toBe(0)
    })
  })

  describe('TC-DASH3-UNIT-TYP-03: prefers-reduced-motion', () => {
    it('prefers-reduced-motion: reduce 인 경우 즉시 최종 텍스트를 반환한다', () => {
      mockMatchMedia(true)

      const { result } = renderHook(() =>
        useFakeTyping('부산발 서울도착', { totalDurationMs: 1500 }),
      )

      // 타이머를 돌리지 않아도 즉시 최종 상태
      expect(result.current.displayedText).toBe('부산발 서울도착')
      expect(result.current.progress).toBe(1)
    })
  })
})
