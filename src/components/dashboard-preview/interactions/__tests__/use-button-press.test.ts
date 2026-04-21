/**
 * @task T-DASH3-M1-05
 * @req REQ-DASH3-022, REQ-DASH3-072
 *
 * #3 조작감: 버튼 press 훅 테스트.
 *
 * - pressed 초기 false
 * - triggerAt 시점 도달 시 pressed true
 * - pressDurationMs 후 pressed false
 * - handlers onMouseDown/Up/Leave 동작
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
import { useButtonPress } from '@/components/dashboard-preview/interactions/use-button-press'

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

describe('useButtonPress', () => {
  describe('TC-DASH3-UNIT-PRESS-01: 초기 상태', () => {
    it('옵션 없이 호출하면 pressed 는 false 이고 handlers 3종을 제공한다', () => {
      const { result } = renderHook(() => useButtonPress())

      expect(result.current.pressed).toBe(false)
      expect(typeof result.current.handlers.onMouseDown).toBe('function')
      expect(typeof result.current.handlers.onMouseUp).toBe('function')
      expect(typeof result.current.handlers.onMouseLeave).toBe('function')
      expect(result.current.pressStyle).toBeDefined()
    })
  })

  describe('TC-DASH3-UNIT-PRESS-02: triggerAt 자동 press', () => {
    it('triggerAt 경과 시 pressed=true 로 전환되고, pressDurationMs 후 false 로 복귀한다', () => {
      const { result } = renderHook(() =>
        useButtonPress({ triggerAt: 500, pressDurationMs: 150 }),
      )

      // 초기 false
      expect(result.current.pressed).toBe(false)

      // triggerAt 도달 직전 — 아직 false
      act(() => {
        vi.advanceTimersByTime(499)
      })
      expect(result.current.pressed).toBe(false)

      // triggerAt 도달 — press
      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(result.current.pressed).toBe(true)

      // pressDurationMs 경과 — 복귀
      act(() => {
        vi.advanceTimersByTime(150)
      })
      expect(result.current.pressed).toBe(false)
    })
  })

  describe('TC-DASH3-UNIT-PRESS-03: handlers 를 통한 수동 press', () => {
    it('onMouseDown 호출 시 pressed=true 가 되고, onMouseUp 호출 시 false 로 복귀한다', () => {
      const { result } = renderHook(() => useButtonPress())

      act(() => {
        result.current.handlers.onMouseDown()
      })
      expect(result.current.pressed).toBe(true)

      act(() => {
        result.current.handlers.onMouseUp()
      })
      expect(result.current.pressed).toBe(false)
    })

    it('onMouseLeave 호출 시에도 pressed 가 false 로 복귀한다', () => {
      const { result } = renderHook(() => useButtonPress())

      act(() => {
        result.current.handlers.onMouseDown()
      })
      expect(result.current.pressed).toBe(true)

      act(() => {
        result.current.handlers.onMouseLeave()
      })
      expect(result.current.pressed).toBe(false)
    })
  })

  describe('TC-DASH3-UNIT-PRESS-04: triggerAt 비활성', () => {
    it('triggerAt 이 null 이면 자동 press 가 발생하지 않는다', () => {
      const { result } = renderHook(() =>
        useButtonPress({ triggerAt: null, pressDurationMs: 150 }),
      )

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(result.current.pressed).toBe(false)
    })
  })
})
