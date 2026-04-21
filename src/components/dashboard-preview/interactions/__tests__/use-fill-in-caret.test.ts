/**
 * @task T-DASH3-M1-05
 * @req REQ-DASH3-030, REQ-DASH3-072
 *
 * #6 조작감: fill-in caret 훅 테스트.
 *
 * - caret blink → 즉시 값 등장 (스크린샷 나열 방지)
 * - delay 후 isFilling=false 상태로 전환
 * - prefers-reduced-motion 시 즉시 최종 상태
 * - active=false 시 빈 값 유지
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
import { useFillInCaret } from '@/components/dashboard-preview/interactions/use-fill-in-caret'

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

describe('useFillInCaret', () => {
  describe('TC-DASH3-UNIT-FILLIN-01: caret → 값 등장', () => {
    it('초기에는 빈 값, caret 이 깜박이는 상태이고 isFilling 이 true 이다', () => {
      const { result } = renderHook(() =>
        useFillInCaret('100톤', { delay: 300, caretBlinkMs: 150 }),
      )

      expect(result.current.displayedValue).toBe('')
      expect(result.current.isFilling).toBe(true)
    })

    it('delay 경과 후 displayedValue 가 targetValue 로 즉시 등장한다', () => {
      const { result } = renderHook(() =>
        useFillInCaret('100톤', { delay: 300, caretBlinkMs: 150 }),
      )

      expect(result.current.displayedValue).toBe('')

      act(() => {
        vi.advanceTimersByTime(300)
      })

      expect(result.current.displayedValue).toBe('100톤')
      expect(result.current.isFilling).toBe(false)
    })
  })

  describe('TC-DASH3-UNIT-FILLIN-02: caret 깜박임', () => {
    it('caret 은 caretBlinkMs 간격으로 visible 상태가 토글된다', () => {
      const { result } = renderHook(() =>
        useFillInCaret('X', { delay: 800, caretBlinkMs: 150 }),
      )

      const initial = result.current.caretVisible

      act(() => {
        vi.advanceTimersByTime(150)
      })
      expect(result.current.caretVisible).toBe(!initial)

      act(() => {
        vi.advanceTimersByTime(150)
      })
      expect(result.current.caretVisible).toBe(initial)
    })
  })

  describe('TC-DASH3-UNIT-FILLIN-03: active=false', () => {
    it('active=false 이면 표시값 변경이 일어나지 않는다', () => {
      const { result } = renderHook(() =>
        useFillInCaret('100톤', { active: false, delay: 300 }),
      )

      expect(result.current.displayedValue).toBe('')
      expect(result.current.isFilling).toBe(false)

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(result.current.displayedValue).toBe('')
    })
  })

  describe('TC-DASH3-UNIT-FILLIN-04: prefers-reduced-motion', () => {
    it('reduced-motion 인 경우 즉시 최종 상태 (값 등장, caret 숨김) 가 된다', () => {
      mockMatchMedia(true)

      const { result } = renderHook(() =>
        useFillInCaret('100톤', { delay: 300, caretBlinkMs: 150 }),
      )

      expect(result.current.displayedValue).toBe('100톤')
      expect(result.current.isFilling).toBe(false)
      expect(result.current.caretVisible).toBe(false)
    })
  })
})
