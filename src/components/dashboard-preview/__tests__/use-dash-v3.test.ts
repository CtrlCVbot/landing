/**
 * T-DASH3-M1-04 — useDashV3 feature flag hook 단위 테스트
 *
 * TC
 *  - TC-DASH3-INT-FLAG: env 또는 query 기반 Phase 3 Feature flag 판정
 *
 * REQ
 *  - REQ-DASH3-052, 053 (Phase 3 활성화 조건)
 *
 * 판정 규칙 (Phase 1 스펙 §5 Feature flag)
 *  - env  `NEXT_PUBLIC_DASH_V3 === 'phase3'` → 활성
 *  - env  `NEXT_PUBLIC_DASH_V3 === 'spike'`  → 활성 (Spike 도 ai-register-main 경로)
 *  - env  그 외 값 / undefined             → 비활성
 *  - query `?dashV3=1`                       → 활성 (env 와 OR 결합)
 *  - 기본                                   → 비활성
 *
 * SSR 안전성: typeof window === 'undefined' 일 때 초기값 false.
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

describe('useDashV3', () => {
  afterEach(() => {
    resetQuery()
    vi.unstubAllEnvs()
  })

  describe('TC-DASH3-INT-FLAG: env NEXT_PUBLIC_DASH_V3', () => {
    it('returns false by default (no env, no query)', () => {
      const { result } = renderHook(() => useDashV3())
      expect(result.current).toBe(false)
    })

    it('returns true when NEXT_PUBLIC_DASH_V3="phase3"', () => {
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'phase3')
      const { result } = renderHook(() => useDashV3())
      expect(result.current).toBe(true)
    })

    it('returns true when NEXT_PUBLIC_DASH_V3="spike"', () => {
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'spike')
      const { result } = renderHook(() => useDashV3())
      expect(result.current).toBe(true)
    })

    it('returns false when NEXT_PUBLIC_DASH_V3="something-else"', () => {
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'something-else')
      const { result } = renderHook(() => useDashV3())
      expect(result.current).toBe(false)
    })
  })

  describe('TC-DASH3-INT-FLAG: query ?dashV3=1', () => {
    it('returns true when ?dashV3=1 is present', () => {
      setQuery('?dashV3=1')
      const { result } = renderHook(() => useDashV3())
      expect(result.current).toBe(true)
    })

    it('returns false when ?dashV3=0', () => {
      setQuery('?dashV3=0')
      const { result } = renderHook(() => useDashV3())
      expect(result.current).toBe(false)
    })

    it('returns false when ?dashV3 is missing', () => {
      setQuery('?other=1')
      const { result } = renderHook(() => useDashV3())
      expect(result.current).toBe(false)
    })
  })

  describe('TC-DASH3-INT-FLAG: env + query OR', () => {
    it('returns true when env=phase3 even if query missing', () => {
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'phase3')
      setQuery('')
      const { result } = renderHook(() => useDashV3())
      expect(result.current).toBe(true)
    })

    it('returns true when query=1 even if env disabled', () => {
      setQuery('?dashV3=1')
      const { result } = renderHook(() => useDashV3())
      expect(result.current).toBe(true)
    })

    it('returns true when both env=phase3 AND query=1', () => {
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'phase3')
      setQuery('?dashV3=1')
      const { result } = renderHook(() => useDashV3())
      expect(result.current).toBe(true)
    })
  })
})
