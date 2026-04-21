/**
 * #3 조작감: 버튼 press 훅. scale(0.97) + shadow 축소, duration 150ms.
 *
 * 사용 모드:
 * 1. 수동 모드: `handlers` 이벤트 (onMouseDown/Up/Leave)로 토글
 * 2. 자동 모드: `triggerAt` (ms) 경과 시 자동 press → 150ms 후 자동 복귀
 *
 * `prefers-reduced-motion: reduce` 시 transform/shadow 변화 없이 pressed 상태만 토글
 * (소비 컴포넌트가 CSS로 대응).
 */

'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import type { CSSProperties } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseButtonPressOptions {
  /** ms (>=0). 지정 시 mount 후 해당 offset 에 자동 press 발동. null 이면 비활성 */
  readonly triggerAt?: number | null
  /** press 지속시간 (ms). 기본 150 */
  readonly pressDurationMs?: number
}

export interface UseButtonPressHandlers {
  readonly onMouseDown: () => void
  readonly onMouseUp: () => void
  readonly onMouseLeave: () => void
}

export interface UseButtonPressResult {
  readonly pressed: boolean
  readonly handlers: UseButtonPressHandlers
  readonly pressStyle: CSSProperties
}

// ---------------------------------------------------------------------------
// Reduced-motion
// ---------------------------------------------------------------------------

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useButtonPress(
  options: UseButtonPressOptions = {},
): UseButtonPressResult {
  const { triggerAt = null, pressDurationMs = 150 } = options
  const [pressed, setPressed] = useState<boolean>(false)
  const releaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 자동 press 트리거
  useEffect(() => {
    if (triggerAt === null || triggerAt < 0) return

    const startTimer = setTimeout(() => {
      setPressed(true)
      releaseTimerRef.current = setTimeout(() => {
        setPressed(false)
        releaseTimerRef.current = null
      }, pressDurationMs)
    }, triggerAt)

    return () => {
      clearTimeout(startTimer)
      if (releaseTimerRef.current !== null) {
        clearTimeout(releaseTimerRef.current)
        releaseTimerRef.current = null
      }
    }
  }, [triggerAt, pressDurationMs])

  const handlers = useMemo<UseButtonPressHandlers>(
    () => ({
      onMouseDown: () => setPressed(true),
      onMouseUp: () => setPressed(false),
      onMouseLeave: () => setPressed(false),
    }),
    [],
  )

  const pressStyle = useMemo<CSSProperties>(() => {
    if (!pressed) {
      return {
        transform: 'scale(1)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
        transition: `transform ${pressDurationMs}ms ease-out, box-shadow ${pressDurationMs}ms ease-out`,
      }
    }
    if (prefersReducedMotion()) {
      // 축소 동작: 그림자만 살짝 줄여 누름을 암시
      return {
        transform: 'scale(1)',
        boxShadow: '0 0 0 rgba(0,0,0,0)',
        transition: `box-shadow ${pressDurationMs}ms ease-out`,
      }
    }
    return {
      transform: 'scale(0.97)',
      boxShadow: '0 0 0 rgba(0,0,0,0)',
      transition: `transform ${pressDurationMs}ms ease-out, box-shadow ${pressDurationMs}ms ease-out`,
    }
  }, [pressed, pressDurationMs])

  return { pressed, handlers, pressStyle }
}
