/**
 * useDashV3 — Phase 3 Feature flag hook.
 *
 * T-DASH3-M1-04 (M5 closeout — default 승격)
 *
 * 판정 규칙 (Phase 1/2 opt-out 전환 후)
 *  - 기본                                              → **활성** (Phase 3)
 *  - env  `NEXT_PUBLIC_DASH_V3` 가 legacy 집합에 포함   → 비활성 (Phase 1/2 fallback)
 *    허용 legacy 값: `'legacy' | 'phase1' | 'phase2' | 'off' | '0'`
 *  - env  `NEXT_PUBLIC_DASH_V3 === 'phase3'`            → 활성 (명시적 opt-in, 기본값과 동일)
 *  - query `?dashV3=0`                                   → 비활성 (세션 단위 opt-out)
 *  - query `?dashV3=1`                                   → 활성 (명시적 opt-in)
 *
 * 히스토리 (M5 closeout)
 *  - M1-04 최초 도입 시: default OFF, env/query 에서 opt-in 해야 활성. 구현 검증 단계.
 *  - M1~M5 완료 후: Phase 3 구현이 완성되어 default ON 으로 승격. Phase 1/2 는 fallback.
 *  - Phase 1/2 legacy 테스트는 `LEGACY=true pnpm test` 로 계속 검증.
 *
 * SSR 안전성
 *  - 초기 state 는 `true` (default ON). SSR/CSR hydration 시 동일.
 *  - `useEffect` 안에서 `typeof window !== 'undefined'` 확인 후 env/query 파싱.
 *  - env 값은 Next.js 가 빌드 타임에 `NEXT_PUBLIC_*` 접두사로 클라이언트 번들에 주입.
 */

'use client'

import { useEffect, useState } from 'react'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ENV_KEY = 'NEXT_PUBLIC_DASH_V3'
/** env 값이 이 집합에 포함되면 Phase 1/2 로 회귀 (opt-out). */
const ENV_VALUES_DISABLE = ['legacy', 'phase1', 'phase2', 'off', '0'] as const
const QUERY_KEY = 'dashV3'
const QUERY_VALUE_DISABLE = '0'
const QUERY_VALUE_ENABLE = '1'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isEnvOptOut(): boolean {
  const envValue = process.env[ENV_KEY]
  if (!envValue) return false
  return (ENV_VALUES_DISABLE as ReadonlyArray<string>).includes(envValue)
}

type QuerySignal = 'enable' | 'disable' | 'unset'

function readQuerySignal(): QuerySignal {
  if (typeof window === 'undefined') return 'unset'
  try {
    const params = new URLSearchParams(window.location.search)
    const raw = params.get(QUERY_KEY)
    if (raw === QUERY_VALUE_DISABLE) return 'disable'
    if (raw === QUERY_VALUE_ENABLE) return 'enable'
    return 'unset'
  } catch {
    return 'unset'
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useDashV3(): boolean {
  // default ON (Phase 3) — SSR 와 CSR 모두 동일 초기값.
  const [enabled, setEnabled] = useState<boolean>(true)

  useEffect(() => {
    const querySignal = readQuerySignal()
    // query 가 명시적이면 최우선 (사용자 세션 opt-in/out).
    if (querySignal === 'enable') {
      setEnabled(true)
      return
    }
    if (querySignal === 'disable') {
      setEnabled(false)
      return
    }
    // query 미지정 → env 기반 (없으면 default ON).
    setEnabled(!isEnvOptOut())
  }, [])

  return enabled
}
