/**
 * @task T-DASH3-M1-05
 * @req REQ-DASH3-023, REQ-DASH3-072
 *
 * #4 조작감: 클릭 ripple wave 훅 테스트.
 *
 * - 초기 ripples 빈 배열
 * - trigger 호출 시 ripple 추가
 * - durationMs 경과 후 ripple 제거
 * - prefers-reduced-motion 시 ripple 생성 안 함
 */

import { renderHook, act } from '@testing-library/react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { useRipple } from '@/components/dashboard-preview/interactions/use-ripple'

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
// Fake click event — jsdom 의 MouseEvent 와 호환
// ---------------------------------------------------------------------------

function createClickEvent(
  clientX: number,
  clientY: number,
): ReactMouseEvent<HTMLButtonElement> {
  const rect: DOMRect = {
    left: 0,
    top: 0,
    right: 200,
    bottom: 50,
    width: 200,
    height: 50,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  }
  return {
    clientX,
    clientY,
    currentTarget: {
      getBoundingClientRect: () => rect,
    } as unknown as HTMLButtonElement,
  } as unknown as ReactMouseEvent<HTMLButtonElement>
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

describe('useRipple', () => {
  describe('TC-DASH3-UNIT-RIPPLE-01: trigger → 생성', () => {
    it('초기 ripples 는 빈 배열이다', () => {
      const { result } = renderHook(() => useRipple())
      expect(result.current.ripples).toEqual([])
    })

    it('trigger 호출 시 ripple 이 배열에 추가된다', () => {
      const { result } = renderHook(() => useRipple())

      act(() => {
        result.current.trigger(createClickEvent(100, 25))
      })

      expect(result.current.ripples).toHaveLength(1)
      const ripple = result.current.ripples[0]
      expect(ripple?.x).toBe(100)
      expect(ripple?.y).toBe(25)
      expect(typeof ripple?.id).toBe('string')
    })
  })

  describe('TC-DASH3-UNIT-RIPPLE-02: durationMs 후 자동 제거', () => {
    it('durationMs 가 경과하면 해당 ripple 이 배열에서 사라진다', () => {
      const { result } = renderHook(() => useRipple({ durationMs: 300 }))

      act(() => {
        result.current.trigger(createClickEvent(10, 10))
      })
      expect(result.current.ripples).toHaveLength(1)

      act(() => {
        vi.advanceTimersByTime(300)
      })
      expect(result.current.ripples).toHaveLength(0)
    })

    it('연속 trigger 는 ripples 가 누적되며 각자 durationMs 후 사라진다', () => {
      const { result } = renderHook(() => useRipple({ durationMs: 300 }))

      act(() => {
        result.current.trigger(createClickEvent(10, 10))
      })

      act(() => {
        vi.advanceTimersByTime(100)
      })

      act(() => {
        result.current.trigger(createClickEvent(50, 20))
      })

      expect(result.current.ripples).toHaveLength(2)

      // 첫 번째 ripple 만 사라질 때까지
      act(() => {
        vi.advanceTimersByTime(200)
      })
      expect(result.current.ripples).toHaveLength(1)

      // 두 번째도 사라짐
      act(() => {
        vi.advanceTimersByTime(100)
      })
      expect(result.current.ripples).toHaveLength(0)
    })
  })

  describe('TC-DASH3-UNIT-RIPPLE-03: prefers-reduced-motion', () => {
    it('reduced-motion 인 경우 trigger 해도 ripple 이 생성되지 않는다', () => {
      mockMatchMedia(true)

      const { result } = renderHook(() => useRipple())

      act(() => {
        result.current.trigger(createClickEvent(100, 25))
      })

      expect(result.current.ripples).toEqual([])
    })
  })
})
