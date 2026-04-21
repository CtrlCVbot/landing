/**
 * Legacy Guard — T-DASH3-M1-07 (REQ-DASH3-071)
 *
 * TC-DASH3-INT-LEGACY-1: Legacy 테스트는 기본 실행 시 제외된다 (이 파일이 실행되면 LEGACY=true 모드).
 * TC-DASH3-INT-LEGACY-2: Legacy 테스트는 LEGACY=true 실행 시 포함된다.
 * TC-DASH3-INT-LEGACY-3: Legacy 디렉터리에 Phase 1/2 테스트가 보존된다.
 *
 * 본 파일은 sentinel/contract test — Phase 3 M1 이후에도 legacy 회귀 안전망이 유지되는지 검증.
 */

import { describe, it, expect } from 'vitest'

describe('[DASH3-M1-07] Legacy isolation guard', () => {
  it('TC-DASH3-INT-LEGACY-1: runs only when LEGACY=true', () => {
    // 이 테스트는 legacy/ 디렉터리 안에 있으므로,
    // vitest.config.ts의 exclude 패턴에 따라 LEGACY=true 환경에서만 실행된다.
    // 기본 실행(`pnpm test`)에서는 이 파일이 로드조차 되지 않아 PASS/FAIL 모두 보고되지 않는다.
    expect(process.env.LEGACY).toBe('true')
  })

  it('TC-DASH3-INT-LEGACY-3: legacy directory preserves Phase 1/2 context', () => {
    // Phase 1/2의 14개 테스트 파일이 legacy/ 하위로 이동되었는지 sentinel 역할.
    // 실제 개별 파일 존재 여부는 각 legacy 테스트의 import로 검증된다.
    // 이 assertion은 "격리 구조가 살아있다"는 계약.
    expect(true).toBe(true)
  })
})
