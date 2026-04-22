/**
 * T-DASH3-M1-04 (M5 closeout) — useDashV3 feature flag hook 단위 테스트
 *
 * TC
 *  - TC-DASH3-INT-FLAG: env 또는 query 기반 Phase 3 Feature flag 판정
 *
 * REQ
 *  - REQ-DASH3-052, 053 (Phase 3 활성화 조건)
 *
 * 판정 규칙 (M5 closeout — default ON 승격)
 *  - 기본                                                → **활성** (Phase 3)
 *  - env  `NEXT_PUBLIC_DASH_V3` in legacy 집합            → 비활성 (Phase 1/2)
 *  - env  `NEXT_PUBLIC_DASH_V3 === 'phase3'`              → 활성
 *  - query `?dashV3=0`                                    → 비활성 (세션 opt-out)
 *  - query `?dashV3=1`                                    → 활성 (세션 opt-in)
 *  - query 가 env 보다 우선
 *
 * SSR 안전성: typeof window === 'undefined' 일 때 초기값 true (default ON).
 */

import { renderHook } from '@testing-library/react'
import { describe, it, expect, afterEach, vi } from 'vitest'

import { useDashV3 } from '@/components/dashboard-preview/use-dash-v3'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ORIGINAL_HREF = window.location.href

function setQuery(search: string) {
  const url = new URL(ORIGINAL_HREF)
  url.search = search
  window.history.replaceState({}, '', url.toString())
}

function resetQuery() {
  window.history.replaceState({}, '', ORIGINAL_HREF)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useDashV3 (M5 closeout — default ON)', () => {
  afterEach(() => {
    resetQuery()
    vi.unstubAllEnvs()
  })

  describe('TC-DASH3-INT-FLAG: 기본 활성 (default ON)', () => {
    it('returns true by default (no env, no query) — Phase 3 default', () => {
      const { result } = renderHook(() => useDashV3())
      expect(result.current).toBe(true)
    })

    it('returns true when NEXT_PUBLIC_DASH_V3="phase3" (명시적 opt-in)', () => {
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'phase3')
      const { result } = renderHook(() => useDashV3())
      expect(result.current).toBe(true)
    })

    it('returns true when NEXT_PUBLIC_DASH_V3="something-unknown" (default ON 유지)', () => {
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'something-unknown')
      const { result } = renderHook(() => useDashV3())
      expect(result.current).toBe(true)
    })
  })

  describe('TC-DASH3-INT-FLAG: env 기반 opt-out (legacy 회귀)', () => {
    it.each(['legacy', 'phase1', 'phase2', 'off', '0'])(
      'returns false when NEXT_PUBLIC_DASH_V3="%s"',
      (value) => {
        vi.stubEnv('NEXT_PUBLIC_DASH_V3', value)
        const { result } = renderHook(() => useDashV3())
        expect(result.current).toBe(false)
      },
    )
  })

  describe('TC-DASH3-INT-FLAG: query 기반 세션 opt-out/in', () => {
    it('returns true when ?dashV3=1 (세션 opt-in)', () => {
      setQuery('?dashV3=1')
      const { result } = renderHook(() => useDashV3())
      expect(result.current).toBe(true)
    })

    it('returns false when ?dashV3=0 (세션 opt-out)', () => {
      setQuery('?dashV3=0')
      const { result } = renderHook(() => useDashV3())
      expect(result.current).toBe(false)
    })

    it('returns true when ?dashV3 is missing (default ON)', () => {
      setQuery('?other=1')
      const { result } = renderHook(() => useDashV3())
      expect(result.current).toBe(true)
    })
  })

  describe('TC-DASH3-INT-FLAG: query 가 env 보다 우선', () => {
    it('env=legacy + query=1 → true (query 우선)', () => {
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'legacy')
      setQuery('?dashV3=1')
      const { result } = renderHook(() => useDashV3())
      expect(result.current).toBe(true)
    })

    it('env=phase3 + query=0 → false (query 우선)', () => {
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'phase3')
      setQuery('?dashV3=0')
      const { result } = renderHook(() => useDashV3())
      expect(result.current).toBe(false)
    })

    it('env=phase3 + query missing → true (env=phase3 유지)', () => {
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'phase3')
      setQuery('')
      const { result } = renderHook(() => useDashV3())
      expect(result.current).toBe(true)
    })
  })
})
