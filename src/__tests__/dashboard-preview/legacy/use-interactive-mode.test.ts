import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useInteractiveMode } from '@/components/dashboard-preview/use-interactive-mode'

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

describe('useInteractiveMode', () => {
  // -------------------------------------------------------------------------
  // REQ-DASH-033: 초기 mode='cinematic'
  // -------------------------------------------------------------------------
  describe('initial state', () => {
    it('starts with mode="cinematic"', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true }),
      )
      expect(result.current.mode).toBe('cinematic')
    })

    it('starts with empty executedAreaIds', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true }),
      )
      expect(result.current.executedAreaIds.size).toBe(0)
    })
  })

  // -------------------------------------------------------------------------
  // REQ-DASH-045: enabled=false (Mobile) 에서 비활성
  // -------------------------------------------------------------------------
  describe('enabled=false (Mobile / reduced-motion)', () => {
    it('enterInteractive is a no-op and mode stays cinematic', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: false }),
      )

      act(() => {
        result.current.enterInteractive()
      })

      expect(result.current.mode).toBe('cinematic')
    })

    it('does not invoke onModeChange when disabled', () => {
      const onModeChange = vi.fn()
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: false, onModeChange }),
      )

      act(() => {
        result.current.enterInteractive()
      })

      expect(onModeChange).not.toHaveBeenCalled()
    })

    it('executeArea does nothing when disabled', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: false }),
      )

      act(() => {
        result.current.executeArea('ai-input')
      })

      expect(result.current.executedAreaIds.size).toBe(0)
    })
  })

  // -------------------------------------------------------------------------
  // REQ-DASH-034: enterInteractive → mode='interactive'
  // -------------------------------------------------------------------------
  describe('enterInteractive()', () => {
    it('transitions mode to "interactive"', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true }),
      )

      act(() => {
        result.current.enterInteractive()
      })

      expect(result.current.mode).toBe('interactive')
    })

    it('invokes onModeChange with "interactive"', () => {
      const onModeChange = vi.fn()
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true, onModeChange }),
      )

      act(() => {
        result.current.enterInteractive()
      })

      expect(onModeChange).toHaveBeenCalledWith('interactive')
    })

    it('does not fire onModeChange again when called while already interactive', () => {
      const onModeChange = vi.fn()
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true, onModeChange }),
      )

      act(() => {
        result.current.enterInteractive()
      })
      act(() => {
        result.current.enterInteractive()
      })

      expect(onModeChange).toHaveBeenCalledTimes(1)
    })
  })

  // -------------------------------------------------------------------------
  // exitInteractive()
  // -------------------------------------------------------------------------
  describe('exitInteractive()', () => {
    it('transitions mode back to "cinematic"', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true }),
      )

      act(() => {
        result.current.enterInteractive()
      })
      expect(result.current.mode).toBe('interactive')

      act(() => {
        result.current.exitInteractive()
      })
      expect(result.current.mode).toBe('cinematic')
    })

    it('clears executedAreaIds on exit', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true }),
      )

      act(() => {
        result.current.enterInteractive()
      })
      act(() => {
        result.current.executeArea('ai-input')
      })
      expect(result.current.executedAreaIds.has('ai-input')).toBe(true)

      act(() => {
        result.current.exitInteractive()
      })
      expect(result.current.executedAreaIds.size).toBe(0)
    })

    it('invokes onModeChange with "cinematic" on exit', () => {
      const onModeChange = vi.fn()
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true, onModeChange }),
      )

      act(() => {
        result.current.enterInteractive()
      })
      onModeChange.mockClear()

      act(() => {
        result.current.exitInteractive()
      })

      expect(onModeChange).toHaveBeenCalledWith('cinematic')
    })

    it('does not call onModeChange if mode already cinematic', () => {
      const onModeChange = vi.fn()
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true, onModeChange }),
      )

      act(() => {
        result.current.exitInteractive()
      })

      expect(onModeChange).not.toHaveBeenCalled()
    })
  })

  // -------------------------------------------------------------------------
  // REQ-DASH-035: 10초 비활동 → cinematic 복귀
  // -------------------------------------------------------------------------
  describe('inactivity timeout (REQ-DASH-035)', () => {
    it('auto-returns to cinematic after default 10 seconds of inactivity', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true }),
      )

      act(() => {
        result.current.enterInteractive()
      })
      expect(result.current.mode).toBe('interactive')

      act(() => {
        vi.advanceTimersByTime(9999)
      })
      expect(result.current.mode).toBe('interactive')

      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(result.current.mode).toBe('cinematic')
    })

    it('accepts custom inactivityTimeoutMs', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true, inactivityTimeoutMs: 3000 }),
      )

      act(() => {
        result.current.enterInteractive()
      })

      act(() => {
        vi.advanceTimersByTime(2999)
      })
      expect(result.current.mode).toBe('interactive')

      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(result.current.mode).toBe('cinematic')
    })

    it('registerActivity resets inactivity timer while interactive', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true }),
      )

      act(() => {
        result.current.enterInteractive()
      })

      act(() => {
        vi.advanceTimersByTime(8000)
      })
      expect(result.current.mode).toBe('interactive')

      act(() => {
        result.current.registerActivity()
      })

      // Another 8s — still interactive because timer reset
      act(() => {
        vi.advanceTimersByTime(8000)
      })
      expect(result.current.mode).toBe('interactive')

      // 10s since last activity → cinematic
      act(() => {
        vi.advanceTimersByTime(2000)
      })
      expect(result.current.mode).toBe('cinematic')
    })

    it('registerActivity is a no-op in cinematic mode', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true }),
      )

      expect(result.current.mode).toBe('cinematic')

      act(() => {
        result.current.registerActivity()
      })

      // No timer scheduled — advancing 20s should not change anything
      act(() => {
        vi.advanceTimersByTime(20_000)
      })
      expect(result.current.mode).toBe('cinematic')
    })
  })

  // -------------------------------------------------------------------------
  // executeArea()
  // -------------------------------------------------------------------------
  describe('executeArea()', () => {
    it('adds area id to executedAreaIds when interactive', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true }),
      )

      act(() => {
        result.current.enterInteractive()
      })
      act(() => {
        result.current.executeArea('ai-input')
      })

      expect(result.current.executedAreaIds.has('ai-input')).toBe(true)
    })

    it('is a no-op in cinematic mode', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true }),
      )

      act(() => {
        result.current.executeArea('ai-input')
      })

      expect(result.current.executedAreaIds.size).toBe(0)
    })

    it('resets inactivity timer', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true }),
      )

      act(() => {
        result.current.enterInteractive()
      })

      act(() => {
        vi.advanceTimersByTime(8000)
      })
      act(() => {
        result.current.executeArea('ai-input')
      })

      // 9s later, still interactive (timer was reset)
      act(() => {
        vi.advanceTimersByTime(9000)
      })
      expect(result.current.mode).toBe('interactive')

      // 1s more — 10s since executeArea → cinematic
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      expect(result.current.mode).toBe('cinematic')
    })

    it('does not duplicate area ids', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true }),
      )

      act(() => {
        result.current.enterInteractive()
      })
      act(() => {
        result.current.executeArea('ai-input')
      })
      act(() => {
        result.current.executeArea('ai-input')
      })

      expect(result.current.executedAreaIds.size).toBe(1)
    })
  })

  // -------------------------------------------------------------------------
  // REQ-DASH-051: Escape 키로 즉시 cinematic 복귀
  // -------------------------------------------------------------------------
  describe('Escape key (REQ-DASH-051)', () => {
    it('exits interactive mode when Escape is pressed', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true }),
      )

      act(() => {
        result.current.enterInteractive()
      })
      expect(result.current.mode).toBe('interactive')

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      })

      expect(result.current.mode).toBe('cinematic')
    })

    it('ignores Escape in cinematic mode (listener only active in interactive)', () => {
      const onModeChange = vi.fn()
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true, onModeChange }),
      )

      expect(result.current.mode).toBe('cinematic')

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      })

      expect(onModeChange).not.toHaveBeenCalled()
    })

    it('ignores non-Escape keys while interactive', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true }),
      )

      act(() => {
        result.current.enterInteractive()
      })

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
      })

      expect(result.current.mode).toBe('interactive')
    })
  })

  // -------------------------------------------------------------------------
  // Cleanup
  // -------------------------------------------------------------------------
  describe('cleanup on unmount', () => {
    it('clears inactivity timer on unmount', () => {
      const onModeChange = vi.fn()
      const { result, unmount } = renderHook(() =>
        useInteractiveMode({ enabled: true, onModeChange }),
      )

      act(() => {
        result.current.enterInteractive()
      })

      unmount()

      // Advancing time should not trigger any setState after unmount
      expect(() => {
        vi.advanceTimersByTime(20_000)
      }).not.toThrow()
    })

    it('removes keydown listener on unmount', () => {
      const { result, unmount } = renderHook(() =>
        useInteractiveMode({ enabled: true }),
      )

      act(() => {
        result.current.enterInteractive()
      })
      unmount()

      // Firing Escape should not throw post-unmount
      expect(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      }).not.toThrow()
    })
  })

  // -------------------------------------------------------------------------
  // TC-048: aria-live statusMessage (접근성 안내)
  // -------------------------------------------------------------------------
  describe('statusMessage for aria-live announcements', () => {
    it('starts with empty statusMessage', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true }),
      )
      expect(result.current.statusMessage).toBe('')
    })

    it('sets statusMessage when entering interactive mode', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true }),
      )

      act(() => {
        result.current.enterInteractive()
      })

      expect(result.current.statusMessage).toBe(
        '데모 체험 모드를 시작했습니다',
      )
    })

    it('sets statusMessage when exiting interactive mode', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true }),
      )

      act(() => {
        result.current.enterInteractive()
      })
      act(() => {
        result.current.exitInteractive()
      })

      expect(result.current.statusMessage).toBe(
        '데모 체험 모드를 종료했습니다',
      )
    })

    it('statusMessage unchanged when enterInteractive is no-op (enabled=false)', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: false }),
      )

      act(() => {
        result.current.enterInteractive()
      })

      expect(result.current.statusMessage).toBe('')
    })

    it('sets exit message on Escape key (REQ-DASH-051 + aria-live)', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true }),
      )

      act(() => {
        result.current.enterInteractive()
      })
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      })

      expect(result.current.statusMessage).toBe(
        '데모 체험 모드를 종료했습니다',
      )
    })

    it('sets exit message on inactivity timeout', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true }),
      )

      act(() => {
        result.current.enterInteractive()
      })

      act(() => {
        vi.advanceTimersByTime(10_000)
      })

      expect(result.current.statusMessage).toBe(
        '데모 체험 모드를 종료했습니다',
      )
    })

    it('exitInteractive when already cinematic does not change statusMessage', () => {
      const { result } = renderHook(() =>
        useInteractiveMode({ enabled: true }),
      )

      act(() => {
        result.current.exitInteractive()
      })

      expect(result.current.statusMessage).toBe('')
    })
  })
})
