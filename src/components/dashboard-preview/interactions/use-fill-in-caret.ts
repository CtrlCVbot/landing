/**
 * @task T-DASH3-M1-05
 * @req REQ-DASH3-030
 *
 * #6 조작감: fill-in caret 훅.
 *
 * 원칙:
 * - caret 이 잠깐 깜박이다 (caretBlinkMs 간격) delay 후 값이 즉시 등장
 *   → 스크린샷 나열(타이핑) 방식의 어색함을 회피
 * - isFilling: caret 깜박임 중 true, 값 등장 후 false
 * - `prefers-reduced-motion: reduce` 시 즉시 최종 상태 (값 노출, caret 숨김)
 * - active=false 면 빈 값 + caret 숨김 유지
 */

'use client'

import { useEffect, useState } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseFillInCaretOptions {
  /** 훅 활성 여부. 기본 true */
  readonly active?: boolean
  /** caret visible 토글 간격 (ms). 기본 180 */
  readonly caretBlinkMs?: number
  /** 값 등장까지의 delay (ms). 기본 400 */
  readonly delay?: number
}

export interface UseFillInCaretResult {
  /** 화면에 표시할 값. 등장 전에는 빈 문자열 */
  readonly displayedValue: string
  /** caret 을 화면에 그릴지 */
  readonly caretVisible: boolean
  /** 아직 filling 중인지 (true = caret 깜박임 단계) */
  readonly isFilling: boolean
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

export function useFillInCaret(
  targetValue: string,
  options: UseFillInCaretOptions = {},
): UseFillInCaretResult {
  const { active = true, caretBlinkMs = 180, delay = 400 } = options

  const [displayedValue, setDisplayedValue] = useState<string>('')
  const [caretVisible, setCaretVisible] = useState<boolean>(false)
  const [isFilling, setIsFilling] = useState<boolean>(false)

  useEffect(() => {
    // 비활성: 모든 상태 초기화
    if (!active) {
      setDisplayedValue('')
      setCaretVisible(false)
      setIsFilling(false)
      return
    }

    // reduced-motion: 즉시 최종 상태
    if (prefersReducedMotion()) {
      setDisplayedValue(targetValue)
      setCaretVisible(false)
      setIsFilling(false)
      return
    }

    // 초기: caret 깜박이기 시작
    setDisplayedValue('')
    setIsFilling(true)
    setCaretVisible(true)

    const blinkTimer = setInterval(() => {
      setCaretVisible((prev) => !prev)
    }, caretBlinkMs)

    const fillTimer = setTimeout(() => {
      clearInterval(blinkTimer)
      setCaretVisible(false)
      setDisplayedValue(targetValue)
      setIsFilling(false)
    }, delay)

    return () => {
      clearInterval(blinkTimer)
      clearTimeout(fillTimer)
    }
  }, [targetValue, active, caretBlinkMs, delay])

  return { displayedValue, caretVisible, isFilling }
}
