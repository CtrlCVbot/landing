import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useAutoPlay } from '@/components/dashboard-preview/use-auto-play'
import { PREVIEW_STEPS } from '@/lib/preview-steps'

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useAutoPlay', () => {
  // TC-010: Initial state
  describe('TC-010: initial state', () => {
    it('starts at step 0 with isPlaying=true when enabled', () => {
      const { result } = renderHook(() =>
        useAutoPlay({ steps: PREVIEW_STEPS, enabled: true }),
      )

      expect(result.current.currentStep).toBe(0)
      expect(result.current.isPlaying).toBe(true)
    })
  })

  // TC-011: Step progression
  describe('TC-011: step progression', () => {
    it('advances from step 0 to step 1 after INITIAL duration (3000ms)', () => {
      const { result } = renderHook(() =>
        useAutoPlay({ steps: PREVIEW_STEPS, enabled: true }),
      )

      expect(result.current.currentStep).toBe(0)

      act(() => {
        vi.advanceTimersByTime(3000)
      })

      expect(result.current.currentStep).toBe(1)
    })
  })

  // TC-012: Loop back to step 0 after COMPLETE
  describe('TC-012: loop', () => {
    it('loops from step 4 (COMPLETE) back to step 0 after its duration', () => {
      const { result } = renderHook(() =>
        useAutoPlay({ steps: PREVIEW_STEPS, enabled: true }),
      )

      // step 0 (INITIAL): 3000ms
      act(() => {
        vi.advanceTimersByTime(3000)
      })
      expect(result.current.currentStep).toBe(1)

      // step 1 (AI_INPUT): 4000ms
      act(() => {
        vi.advanceTimersByTime(4000)
      })
      expect(result.current.currentStep).toBe(2)

      // step 2 (AI_EXTRACT): 4000ms
      act(() => {
        vi.advanceTimersByTime(4000)
      })
      expect(result.current.currentStep).toBe(3)

      // step 3 (AI_APPLY): 4000ms
      act(() => {
        vi.advanceTimersByTime(4000)
      })
      expect(result.current.currentStep).toBe(4)

      // step 4 (COMPLETE): 3000ms -> loops to 0
      act(() => {
        vi.advanceTimersByTime(3000)
      })
      expect(result.current.currentStep).toBe(0)
    })
  })

  // TC-016: pause('click') and resume with 5s delay
  describe('TC-016: pause(click) and resume', () => {
    it('pauses on click and resumes after 5000ms delay', () => {
      const { result } = renderHook(() =>
        useAutoPlay({ steps: PREVIEW_STEPS, enabled: true }),
      )

      act(() => {
        result.current.pause('click')
      })
      expect(result.current.isPlaying).toBe(false)

      act(() => {
        result.current.resume()
      })

      // Not yet playing — 5s delay
      expect(result.current.isPlaying).toBe(false)

      act(() => {
        vi.advanceTimersByTime(4999)
      })
      expect(result.current.isPlaying).toBe(false)

      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(result.current.isPlaying).toBe(true)
    })
  })

  // TC-017: pause('hover') and resume with 2s delay
  describe('TC-017: pause(hover) and resume', () => {
    it('pauses on hover and resumes after 2000ms delay', () => {
      const { result } = renderHook(() =>
        useAutoPlay({ steps: PREVIEW_STEPS, enabled: true }),
      )

      act(() => {
        result.current.pause('hover')
      })
      expect(result.current.isPlaying).toBe(false)

      act(() => {
        result.current.resume()
      })

      // Not yet playing — 2s delay
      expect(result.current.isPlaying).toBe(false)

      act(() => {
        vi.advanceTimersByTime(1999)
      })
      expect(result.current.isPlaying).toBe(false)

      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(result.current.isPlaying).toBe(true)
    })
  })

  // TC-019: Timeout priority — click overrides hover
  describe('TC-019: timeout priority', () => {
    it('uses click delay (5s) when pause(click) followed by pause(hover)', () => {
      const { result } = renderHook(() =>
        useAutoPlay({ steps: PREVIEW_STEPS, enabled: true }),
      )

      act(() => {
        result.current.pause('click')
      })

      act(() => {
        result.current.pause('hover')
      })

      act(() => {
        result.current.resume()
      })

      // Should use click's 5s delay, not hover's 2s
      act(() => {
        vi.advanceTimersByTime(2000)
      })
      expect(result.current.isPlaying).toBe(false)

      act(() => {
        vi.advanceTimersByTime(3000)
      })
      expect(result.current.isPlaying).toBe(true)
    })
  })

  // TC-019-2: After resume, lastPauseSource resets — subsequent hover uses 2s
  describe('TC-019-2: resume resets lastPauseSource', () => {
    it('uses hover delay (2s) after a previous click+resume cycle', () => {
      const { result } = renderHook(() =>
        useAutoPlay({ steps: PREVIEW_STEPS, enabled: true }),
      )

      // First cycle: click pause + resume
      act(() => {
        result.current.pause('click')
      })
      act(() => {
        result.current.resume()
      })
      act(() => {
        vi.advanceTimersByTime(5000)
      })
      expect(result.current.isPlaying).toBe(true)

      // Second cycle: hover pause + resume — should use 2s
      act(() => {
        result.current.pause('hover')
      })
      act(() => {
        result.current.resume()
      })

      act(() => {
        vi.advanceTimersByTime(1999)
      })
      expect(result.current.isPlaying).toBe(false)

      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(result.current.isPlaying).toBe(true)
    })
  })

  // TC-027: enabled=false — static mode
  describe('TC-027: enabled=false', () => {
    it('sets currentStep=4 and isPlaying=false when disabled', () => {
      const { result } = renderHook(() =>
        useAutoPlay({ steps: PREVIEW_STEPS, enabled: false }),
      )

      expect(result.current.currentStep).toBe(4)
      expect(result.current.isPlaying).toBe(false)
    })

    it('does not advance steps when disabled', () => {
      const { result } = renderHook(() =>
        useAutoPlay({ steps: PREVIEW_STEPS, enabled: false }),
      )

      act(() => {
        vi.advanceTimersByTime(10000)
      })

      expect(result.current.currentStep).toBe(4)
      expect(result.current.isPlaying).toBe(false)
    })
  })

  // goToStep
  describe('goToStep', () => {
    it('jumps to specified step and triggers click pause', () => {
      const { result } = renderHook(() =>
        useAutoPlay({ steps: PREVIEW_STEPS, enabled: true }),
      )

      act(() => {
        result.current.goToStep(3)
      })

      expect(result.current.currentStep).toBe(3)
      expect(result.current.isPlaying).toBe(false)
    })
  })
})
