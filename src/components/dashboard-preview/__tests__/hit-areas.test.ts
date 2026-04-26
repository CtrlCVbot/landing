/**
 * T-DASH3-M4-04 — hit-areas.ts Phase 3 재작성 단위 테스트
 *
 * TC
 *  - TC-DASH3-UNIT-HITAREA
 *
 * REQ
 *  - REQ-DASH3-037 (Phase 3 히트 영역 19~20, Tablet 축약 폐기)
 *  - REQ-DASH-041 (logicalDependency)
 *  - REQ-DASH-044 (원본 44x44px 이상)
 *  - REQ-DASH-047 (scaleFactor 축소 후 최소 크기)
 *
 * 범위
 *  - Phase 3 3-col grid 기준 18 히트 영역 (F5 T-CLEANUP-03: ai-json-viewer 제거 반영).
 *  - #11 company-manager: isEnabled=false (pre-filled 영역 클릭 차단, hover 툴팁은 유지).
 *  - Tablet 축약 폐기 → getHitAreas('tablet') 이 Desktop 과 동일 18 영역 반환.
 */

import { describe, expect, it } from 'vitest'

import {
  DESKTOP_HIT_AREAS,
  getHitAreas,
  getMinSize,
  type HitAreaConfig,
} from '@/components/dashboard-preview/hit-areas'
import { PREVIEW_MOCK_DATA } from '@/lib/mock-data'

// ---------------------------------------------------------------------------
// 18 영역 구성 검증 (F5 T-CLEANUP-03: ai-json-viewer 제거 → 19 → 18)
// ---------------------------------------------------------------------------

describe('Phase 3 hit-areas (M4-04)', () => {
  it('has exactly 18 hit areas', () => {
    expect(DESKTOP_HIT_AREAS).toHaveLength(18)
  })

  it('contains the canonical 18 ID set in canonical order', () => {
    const ids = DESKTOP_HIT_AREAS.map((a) => a.id)
    expect(ids).toEqual([
      // AiPanel (7 areas — F5 T-CLEANUP-01: ai-json-viewer 제거)
      'ai-tab-bar',
      'ai-input',
      'ai-extract-button',
      'ai-result-departure',
      'ai-result-destination',
      'ai-result-cargo',
      'ai-result-fare',
      // Col 1 (3 areas — form-company-manager 포함 disabled)
      'form-company-manager',
      'form-pickup-location',
      'form-delivery-location',
      // Col 2 (4 areas)
      'form-estimate-distance',
      'form-pickup-datetime',
      'form-delivery-datetime',
      'form-cargo-info',
      // Col 3 (4 areas)
      'form-transport-options',
      'form-estimate-info',
      'form-settlement',
      'form-auto-dispatch',
    ])
  })

  it('has unique IDs across all hit areas', () => {
    const ids = DESKTOP_HIT_AREAS.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('each hit area has width >= 44px (REQ-DASH-044)', () => {
    for (const area of DESKTOP_HIT_AREAS) {
      expect(area.bounds.width).toBeGreaterThanOrEqual(44)
    }
  })

  it('each hit area has height >= 44px (REQ-DASH-044)', () => {
    for (const area of DESKTOP_HIT_AREAS) {
      expect(area.bounds.height).toBeGreaterThanOrEqual(44)
    }
  })

  it('each area has non-negative x/y coordinates', () => {
    for (const area of DESKTOP_HIT_AREAS) {
      expect(area.bounds.x).toBeGreaterThanOrEqual(0)
      expect(area.bounds.y).toBeGreaterThanOrEqual(0)
    }
  })

  it('each tooltipKey exists in PREVIEW_MOCK_DATA.tooltips', () => {
    const tooltipKeys = Object.keys(PREVIEW_MOCK_DATA.tooltips)
    for (const area of DESKTOP_HIT_AREAS) {
      expect(tooltipKeys).toContain(area.tooltipKey)
    }
  })

  // -------------------------------------------------------------------------
  // #11 company-manager disabled
  // -------------------------------------------------------------------------

  it('form-company-manager has isEnabled=false (#11 비활성)', () => {
    const company = DESKTOP_HIT_AREAS.find((a) => a.id === 'form-company-manager')
    expect(company?.isEnabled).toBe(false)
  })

  it('form-company-manager 는 tooltipKey="company-manager" 유지 (hover 툴팁 허용)', () => {
    const company = DESKTOP_HIT_AREAS.find((a) => a.id === 'form-company-manager')
    expect(company?.tooltipKey).toBe('company-manager')
  })

  it('ai-* 와 form-* 이외 영역은 모두 기본 활성 (isEnabled undefined or true)', () => {
    const company = DESKTOP_HIT_AREAS.filter((a) => a.id === 'form-company-manager')
    expect(company).toHaveLength(1)
    const others = DESKTOP_HIT_AREAS.filter((a) => a.id !== 'form-company-manager')
    for (const area of others) {
      const enabled = area.isEnabled ?? true
      expect(enabled).toBe(true)
    }
  })

  // -------------------------------------------------------------------------
  // logicalDependency — AI_INPUT/AI_EXTRACT 이전 비활성
  // -------------------------------------------------------------------------

  it('ai-extract-button has logicalDependency="input-has-text"', () => {
    const area = DESKTOP_HIT_AREAS.find((a) => a.id === 'ai-extract-button')
    expect(area?.logicalDependency).toBe('input-has-text')
  })

  it('all ai-result-* areas have logicalDependency="extracted"', () => {
    const areas = DESKTOP_HIT_AREAS.filter((a) => a.id.startsWith('ai-result-'))
    expect(areas.length).toBe(4)
    for (const a of areas) {
      expect(a.logicalDependency).toBe('extracted')
    }
  })

  it('form-* 영역은 logicalDependency 미지정 (항상 활성 단, isEnabled 는 별개)', () => {
    const forms = DESKTOP_HIT_AREAS.filter((a) => a.id.startsWith('form-'))
    expect(forms.length).toBeGreaterThan(0)
    for (const a of forms) {
      expect(a.logicalDependency).toBeUndefined()
    }
  })

  // -------------------------------------------------------------------------
  // Tablet 축약 폐기
  // -------------------------------------------------------------------------

  it('getHitAreas("tablet") 이 Desktop 과 동일한 18 영역 반환 (Tablet 축약 폐기)', () => {
    const desktop = getHitAreas('desktop')
    const tablet = getHitAreas('tablet')
    expect(tablet).toHaveLength(18)
    expect(tablet).toEqual(desktop)
  })

  // -------------------------------------------------------------------------
  // F4 — DateTime 2열 layout bounds 재정렬
  // -------------------------------------------------------------------------

  it('F4: pickup/delivery DateTime hit-area 는 같은 행에서 좌우 2열로 정렬된다', () => {
    const pickup = DESKTOP_HIT_AREAS.find((a) => a.id === 'form-pickup-datetime')
    const delivery = DESKTOP_HIT_AREAS.find((a) => a.id === 'form-delivery-datetime')

    expect(pickup?.bounds).toEqual({ x: 766, y: 106, width: 164, height: 96 })
    expect(delivery?.bounds).toEqual({ x: 946, y: 106, width: 164, height: 96 })
  })

  it('F4: Cargo hit-area 는 DateTime 2열 아래로 당겨진 y 좌표를 사용한다', () => {
    const cargo = DESKTOP_HIT_AREAS.find((a) => a.id === 'form-cargo-info')

    expect(cargo?.bounds).toEqual({ x: 766, y: 214, width: 344, height: 200 })
  })

  // -------------------------------------------------------------------------
  // getMinSize — scaleFactor 0.40 (Tablet) 기준 재계산
  // -------------------------------------------------------------------------

  it('getMinSize("desktop") 은 20 (44 * 0.45 = 19.8 → 올림)', () => {
    expect(getMinSize('desktop')).toBe(20)
  })

  it('getMinSize("tablet") 은 18 (44 * 0.40 = 17.6 → 올림) — scaleFactor 0.38→0.40 변경 반영', () => {
    expect(getMinSize('tablet')).toBe(18)
  })

  // -------------------------------------------------------------------------
  // HitAreaConfig 타입 준수
  // -------------------------------------------------------------------------

  it('each area has required id, bounds, tooltipKey fields', () => {
    for (const area of DESKTOP_HIT_AREAS) {
      const config: HitAreaConfig = area
      expect(typeof config.id).toBe('string')
      expect(typeof config.bounds.x).toBe('number')
      expect(typeof config.bounds.y).toBe('number')
      expect(typeof config.bounds.width).toBe('number')
      expect(typeof config.bounds.height).toBe('number')
      expect(typeof config.tooltipKey).toBe('string')
    }
  })
})
