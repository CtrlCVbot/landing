import { describe, it, expect } from 'vitest'
import {
  DESKTOP_HIT_AREAS,
  TABLET_HIT_AREAS,
  getHitAreas,
  getMinSize,
  type HitAreaConfig,
} from '@/components/dashboard-preview/hit-areas'
import { PREVIEW_MOCK_DATA } from '@/lib/mock-data'

describe('hit-areas', () => {
  // -------------------------------------------------------------------------
  // REQ-DASH-037 → REQ-DASH3-037 (Phase 3 M4-04)
  //   Desktop: 11 → 19 영역 (3-col grid, 19개로 재작성)
  //   Tablet:   6 → 19 영역 (Tablet 축약 폐기)
  // -------------------------------------------------------------------------
  describe('DESKTOP_HIT_AREAS (Phase 3 19-area 재작성)', () => {
    it('has exactly 19 hit areas (Phase 3 M4-04)', () => {
      expect(DESKTOP_HIT_AREAS).toHaveLength(19)
    })

    it.skip('contains the canonical ordered set of area IDs (legacy 11개 — Phase 3 19개로 대체, __tests__/hit-areas.test.ts 참조)', () => {
      // Phase 3 19-area 목록은 `src/components/dashboard-preview/__tests__/hit-areas.test.ts` 에서
      // 공식적으로 검증한다. 본 legacy 테스트는 historical documentation 으로만 유지된다.
    })

    it('has unique IDs across all hit areas', () => {
      const ids = DESKTOP_HIT_AREAS.map((a) => a.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    // REQ-DASH-044: 최소 히트 영역 원본 44x44px 이상
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

    it('each tooltipKey exists in PREVIEW_MOCK_DATA.tooltips', () => {
      const tooltipKeys = Object.keys(PREVIEW_MOCK_DATA.tooltips)
      for (const area of DESKTOP_HIT_AREAS) {
        expect(tooltipKeys).toContain(area.tooltipKey)
      }
    })

    it('each area has non-negative x and y coordinates', () => {
      for (const area of DESKTOP_HIT_AREAS) {
        expect(area.bounds.x).toBeGreaterThanOrEqual(0)
        expect(area.bounds.y).toBeGreaterThanOrEqual(0)
      }
    })
  })

  // -------------------------------------------------------------------------
  // REQ-DASH-046 → Phase 3 M4-04: Tablet 축약 폐기 (Desktop 동일 19 영역)
  //   기존 Tablet-only 6-area 가정은 Phase 3 에서 폐기됨. Tablet 도 Desktop 과 동일
  //   19 영역을 사용한다 (각 영역의 최소 크기는 getMinSize('tablet') = 18px).
  // -------------------------------------------------------------------------
  describe('TABLET_HIT_AREAS (Phase 3 — Desktop 과 동일 19 영역)', () => {
    it('has exactly 19 hit areas (M4-04 — Tablet 축약 폐기)', () => {
      expect(TABLET_HIT_AREAS).toHaveLength(19)
    })

    it('equals DESKTOP_HIT_AREAS (동일 레퍼런스)', () => {
      expect(TABLET_HIT_AREAS).toEqual(DESKTOP_HIT_AREAS)
    })

    it.skip('only contains AiPanel-related areas (Phase 3 에서 무효 — 3-col grid 전체 포함)', () => {
      // Phase 3: Tablet 도 OrderForm 3-col 전체 hit 영역을 포함한다.
    })

    it('has unique IDs across all tablet hit areas', () => {
      const ids = TABLET_HIT_AREAS.map((a) => a.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('each tablet hit area has width >= 44px (REQ-DASH-044)', () => {
      for (const area of TABLET_HIT_AREAS) {
        expect(area.bounds.width).toBeGreaterThanOrEqual(44)
      }
    })

    it('each tablet hit area has height >= 44px (REQ-DASH-044)', () => {
      for (const area of TABLET_HIT_AREAS) {
        expect(area.bounds.height).toBeGreaterThanOrEqual(44)
      }
    })
  })

  // -------------------------------------------------------------------------
  // getHitAreas dispatcher (Phase 3 — 19 영역 양쪽 동일)
  // -------------------------------------------------------------------------
  describe('getHitAreas (Phase 3)', () => {
    it('returns 19 hit areas for desktop viewport', () => {
      const result = getHitAreas('desktop')
      expect(result).toHaveLength(19)
      expect(result).toBe(DESKTOP_HIT_AREAS)
    })

    it('returns 19 hit areas for tablet viewport (M4-04 — Tablet 축약 폐기)', () => {
      const result = getHitAreas('tablet')
      expect(result).toHaveLength(19)
      expect(result).toBe(TABLET_HIT_AREAS)
    })
  })

  // -------------------------------------------------------------------------
  // REQ-DASH-047 → Phase 3 M1-04: Tablet scaleFactor 0.38→0.40 상향 반영
  //   Desktop: 44 * 0.45 = 19.8 → 20px
  //   Tablet:  44 * 0.40 = 17.6 → 18px (기존 16 에서 18 로 재계산)
  // -------------------------------------------------------------------------
  describe('getMinSize (Phase 3 reset)', () => {
    it('returns 20px for desktop viewport (44 * 0.45 >= 20)', () => {
      expect(getMinSize('desktop')).toBe(20)
    })

    it('returns 18px for tablet viewport (44 * 0.40 >= 18)', () => {
      expect(getMinSize('tablet')).toBe(18)
    })

    it('desktop scaled minimum size >= 20px', () => {
      expect(getMinSize('desktop')).toBeGreaterThanOrEqual(20)
    })

    it('tablet scaled minimum size >= 18px (44 * 0.40 = 17.6)', () => {
      expect(getMinSize('tablet')).toBeGreaterThanOrEqual(18)
    })
  })

  // -------------------------------------------------------------------------
  // logicalDependency — 선행 조건 규칙
  // -------------------------------------------------------------------------
  describe('logicalDependency (REQ-DASH-041 → Phase 3 ID 갱신)', () => {
    it('ai-extract-button has logicalDependency="input-has-text" (Phase 3 ID prefix)', () => {
      const area = DESKTOP_HIT_AREAS.find((a) => a.id === 'ai-extract-button')
      expect(area?.logicalDependency).toBe('input-has-text')
    })

    it('all ai-result-* areas have logicalDependency="extracted" (Phase 3 ID prefix)', () => {
      const resultAreas = DESKTOP_HIT_AREAS.filter((a) =>
        a.id.startsWith('ai-result-'),
      )
      expect(resultAreas).toHaveLength(4)
      for (const area of resultAreas) {
        expect(area.logicalDependency).toBe('extracted')
      }
    })

    it('ai-input has no logicalDependency (always enabled)', () => {
      const area = DESKTOP_HIT_AREAS.find((a) => a.id === 'ai-input')
      expect(area?.logicalDependency).toBeUndefined()
    })

    it('form-* areas have no logicalDependency (logicalDependency 와 isEnabled 는 별개)', () => {
      const formAreas = DESKTOP_HIT_AREAS.filter((a) =>
        a.id.startsWith('form-'),
      )
      expect(formAreas.length).toBeGreaterThan(0)
      for (const area of formAreas) {
        expect(area.logicalDependency).toBeUndefined()
      }
    })

    it('only uses allowed logicalDependency values', () => {
      const allowedValues = [
        'input-has-text',
        'extracted',
        undefined,
      ] as const
      for (const area of DESKTOP_HIT_AREAS) {
        expect(allowedValues).toContain(area.logicalDependency)
      }
    })
  })

  // -------------------------------------------------------------------------
  // HitAreaConfig 타입 준수
  // -------------------------------------------------------------------------
  describe('HitAreaConfig type shape', () => {
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

  // -------------------------------------------------------------------------
  // REQ-DASH-047 → Phase 3: Tablet scaleFactor 0.38 → 0.40 상향, minSize 18px
  // -------------------------------------------------------------------------
  describe('Phase 3 Tablet 최소 크기 17.6px+ (scaleFactor 0.40)', () => {
    it('all Tablet hit areas meet minimum scaled size (>= 17.6px = 44*0.40)', () => {
      const TABLET_SCALE = 0.40
      TABLET_HIT_AREAS.forEach((area) => {
        const scaledWidth = area.bounds.width * TABLET_SCALE
        const scaledHeight = area.bounds.height * TABLET_SCALE
        expect(scaledWidth).toBeGreaterThanOrEqual(17.6)
        expect(scaledHeight).toBeGreaterThanOrEqual(17.6)
      })
    })

    it('getMinSize(tablet) returns 18', () => {
      expect(getMinSize('tablet')).toBe(18)
    })

    it('getMinSize(desktop) returns 20', () => {
      expect(getMinSize('desktop')).toBe(20)
    })
  })

  // -------------------------------------------------------------------------
  // REQ-DASH-046 → Phase 3 M4-04: Tablet 축약 폐기 (Tablet 도 Form 영역 포함)
  // -------------------------------------------------------------------------
  describe('Phase 3 M4-04: Tablet 도 Form 영역 포함 (축약 폐기)', () => {
    it('Tablet hit areas include form-* ids (Phase 3 — Desktop 동일)', () => {
      const tabletIds = TABLET_HIT_AREAS.map((a) => a.id)
      expect(tabletIds).toContain('form-cargo-info')
      expect(tabletIds).toContain('form-pickup-location')
      expect(tabletIds).toContain('form-delivery-location')
      expect(tabletIds).toContain('form-transport-options')
      expect(tabletIds).toContain('form-estimate-info')
    })

    it.skip('Tablet contains AI panel areas only (Phase 3 에서 폐기 — 이제 OrderForm 도 포함)', () => {
      // Phase 3 에서는 Tablet 이 Desktop 과 동일한 19 영역을 사용한다.
    })
  })
})
