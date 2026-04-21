/**
 * #1 조작감: 변동 리듬 타이핑 훅.
 *
 * 원칙:
 * - 고유명사(한글 2글자 이상 연속)는 평균 대비 1.4배 느리게
 * - 조사(을/를/으로/에서/까지/에게/부터) 바로 앞 글자는 평균 대비 0.7배 빠르게
 * - 전체 타이핑 시간 ≤ 1.5s (옵션 totalDurationMs 기본값)
 * - `prefers-reduced-motion: reduce` 시 즉시 최종 텍스트
 */

'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseFakeTypingOptions {
  /** 전체 타이핑에 배정할 시간 (ms). 기본 1500 */
  readonly totalDurationMs?: number
  /** false면 타이핑 비활성 (빈 문자열 표시) */
  readonly active?: boolean
}

export interface UseFakeTypingResult {
  /** 현재까지 표시된 텍스트 */
  readonly displayedText: string
  /** 진행도 0~1 */
  readonly progress: number
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** 한글 조사 (이 문자열들로 시작하는 토큰 직전 글자를 빠르게) */
const PARTICLES = ['을', '를', '으로', '에서', '까지', '에게', '부터', '에']

const KOREAN_RE = /[가-힣]/

// ---------------------------------------------------------------------------
// Internal: 문자별 가중치 계산
// ---------------------------------------------------------------------------

/**
 * 각 문자에 가중치를 부여한다. 가중치 총합 기준으로 시간을 배분.
 *
 * - 고유명사(한글 2글자 이상 연속): 1.4 (느림)
 * - 조사 앞 글자: 0.7 (빠름)
 * - 일반 문자: 1.0
 */
function computeWeights(text: string): ReadonlyArray<number> {
  const weights: number[] = new Array(text.length).fill(1.0)

  // 1. 고유명사 구간 탐색 — 한글 2글자 이상 연속
  let runStart = -1
  for (let i = 0; i <= text.length; i += 1) {
    const ch = text[i]
    if (ch && KOREAN_RE.test(ch)) {
      if (runStart === -1) runStart = i
    } else {
      if (runStart !== -1 && i - runStart >= 2) {
        for (let j = runStart; j < i; j += 1) weights[j] = 1.4
      }
      runStart = -1
    }
  }

  // 2. 조사 앞 글자는 빠르게
  for (const particle of PARTICLES) {
    let fromIndex = 0
    while (true) {
      const foundAt = text.indexOf(particle, fromIndex)
      if (foundAt === -1) break
      if (foundAt - 1 >= 0) {
        weights[foundAt - 1] = 0.7
      }
      fromIndex = foundAt + particle.length
    }
  }

  return weights
}

/**
 * 각 문자별 소요 시간(ms) 배열로 변환.
 * totalDurationMs 를 가중치 총합 비례로 분배.
 */
function computeCharDurations(
  weights: ReadonlyArray<number>,
  totalDurationMs: number,
): ReadonlyArray<number> {
  const sum = weights.reduce((acc, w) => acc + w, 0)
  if (sum === 0) return []
  const unit = totalDurationMs / sum
  return weights.map((w) => w * unit)
}

// ---------------------------------------------------------------------------
// Reduced-motion helper
// ---------------------------------------------------------------------------

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useFakeTyping(
  fullText: string,
  options: UseFakeTypingOptions = {},
): UseFakeTypingResult {
  const { totalDurationMs = 1500, active = true } = options
  const [displayedText, setDisplayedText] = useState<string>('')
  const [progress, setProgress] = useState<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const charDurations = useMemo(
    () => computeCharDurations(computeWeights(fullText), totalDurationMs),
    [fullText, totalDurationMs],
  )

  useEffect(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (!active) {
      setDisplayedText('')
      setProgress(0)
      return
    }

    // reduced-motion: 즉시 최종
    if (prefersReducedMotion()) {
      setDisplayedText(fullText)
      setProgress(1)
      return
    }

    if (fullText.length === 0) {
      setDisplayedText('')
      setProgress(0)
      return
    }

    let charIndex = 0

    const typeNextChar = () => {
      charIndex += 1
      setDisplayedText(fullText.slice(0, charIndex))
      setProgress(charIndex / fullText.length)

      if (charIndex < fullText.length) {
        const nextDelay = charDurations[charIndex] ?? 0
        timerRef.current = setTimeout(typeNextChar, nextDelay)
      } else {
        timerRef.current = null
      }
    }

    // 첫 글자까지의 delay 는 charDurations[0]
    const firstDelay = charDurations[0] ?? 0
    timerRef.current = setTimeout(typeNextChar, firstDelay)

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [fullText, active, charDurations])

  return { displayedText, progress }
}
