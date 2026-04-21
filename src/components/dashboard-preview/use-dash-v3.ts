/**
 * useDashV3 — Phase 3 Feature flag hook.
 *
 * T-DASH3-M1-04 — env + query 기반 Phase 3 활성 판정.
 *
 * 판정 규칙 (Phase 1 스펙 §5 Feature flag)
 *  - env  `NEXT_PUBLIC_DASH_V3 === 'phase3'` → 활성
 *  - env  `NEXT_PUBLIC_DASH_V3 === 'spike'`  → 활성 (Spike 도 ai-register-main 경로 공유)
 *  - query `?dashV3=1` (client-side post-mount)  → 활성
 *  - 기본 → 비활성
 *
 * SSR 안전성
 *  - 초기 state 는 `false` (server render 에서는 env 만 반영 가능, query 는 post-mount).
 *  - `useEffect` 안에서 `typeof window !== 'undefined'` 확인 후 query 파싱.
 *  - env 값은 Next.js 가 빌드 타임에 `NEXT_PUBLIC_*` 접두사로 클라이언트 번들에 주입.
 *
 * Hydration 주의
 *  - `enabled` 초기값은 SSR 시 false 로 직렬화 → client 에서 post-mount 시 env/query 조건에 따라 true 로 flip.
 *  - 해당 flip 은 1 frame 후 발생하므로 깜빡임 허용 가능 (FOUC 범위).
 */

'use client'

import { useEffect, useState } from 'react'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ENV_KEY = 'NEXT_PUBLIC_DASH_V3'
const ENV_VALUES_ENABLE = ['phase3', 'spike'] as const
const QUERY_KEY = 'dashV3'
const QUERY_VALUE_ENABLE = '1'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readEnv(): boolean {
  // process.env.NEXT_PUBLIC_DASH_V3 — Next.js client bundle inlining.
  const envValue = process.env[ENV_KEY]
  if (!envValue) return false
  return (ENV_VALUES_ENABLE as ReadonlyArray<string>).includes(envValue)
}

function readQuery(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const params = new URLSearchParams(window.location.search)
    return params.get(QUERY_KEY) === QUERY_VALUE_ENABLE
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useDashV3(): boolean {
  const [enabled, setEnabled] = useState<boolean>(false)

  useEffect(() => {
    const envFlag = readEnv()
    const queryFlag = readQuery()
    setEnabled(envFlag || queryFlag)
  }, [])

  return enabled
}
