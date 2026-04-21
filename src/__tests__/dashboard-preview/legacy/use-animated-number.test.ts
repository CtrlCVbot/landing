import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useAnimatedNumber } from '@/components/dashboard-preview/use-animated-number'

describe('useAnimatedNumber', () => {
  it('returns 0 when target is null', () => {
    const { result } = renderHook(() => useAnimatedNumber({ target: null }))
    expect(result.current).toBe(0)
  })

  it('returns target immediately when enabled is false', () => {
    const { result } = renderHook(() =>
      useAnimatedNumber({ target: 420000, enabled: false }),
    )
    expect(result.current).toBe(420000)
  })

  it('returns target immediately when target equals previous value', () => {
    const { result, rerender } = renderHook(
      ({ target }: { target: number | null }) =>
        useAnimatedNumber({ target, enabled: false }),
      { initialProps: { target: 100 as number | null } },
    )

    expect(result.current).toBe(100)
    rerender({ target: 100 })
    expect(result.current).toBe(100)
  })

  it('resets to 0 when target becomes null', () => {
    const { result, rerender } = renderHook(
      ({ target }: { target: number | null }) =>
        useAnimatedNumber({ target, enabled: false }),
      { initialProps: { target: 100 as number | null } },
    )

    expect(result.current).toBe(100)
    rerender({ target: null })
    expect(result.current).toBe(0)
  })

  it('returns rounded integer value', () => {
    const { result } = renderHook(() =>
      useAnimatedNumber({ target: 420500, enabled: false }),
    )
    expect(Number.isInteger(result.current)).toBe(true)
  })
})
