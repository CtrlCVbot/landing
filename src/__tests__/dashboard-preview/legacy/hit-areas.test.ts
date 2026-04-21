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
  // REQ-DASH-037: 인터랙티브 영역 8~11개 (Desktop 11개, Tablet 6개)
  // -------------------------------------------------------------------------
  describe('DESKTOP_HIT_AREAS', () => {
    it('has exactly 11 hit areas', () => {
      expect(DESKTOP_HIT_AREAS).toHaveLength(11)
    })

    it('contains the canonical ordered set of area IDs', () => {
      const ids = DESKTOP_HIT_AREAS.map((a) => a.id)
      expect(ids).toEqual([
        'ai-input',
        'extract-button',
        'result-departure',
        'result-destination',
        'result-cargo',
        'result-fare',
        'form-cargo-info',
        'form-location-departure',
        'form-location-destination',
        'form-transport-options',
        'form-estimate',
      ])
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
  // REQ-DASH-046: Tablet에서 6개 영역만 유지 (AiInput, ExtractButton, AiResult 4개)
  // -------------------------------------------------------------------------
  describe('TABLET_HIT_AREAS', () => {
    it('has exactly 6 hit areas (REQ-DASH-046)', () => {
      expect(TABLET_HIT_AREAS).toHaveLength(6)
    })

    it('contains the first 6 entries from DESKTOP_HIT_AREAS', () => {
      expect(TABLET_HIT_AREAS).toEqual(DESKTOP_HIT_AREAS.slice(0, 6))
    })

    it('only contains AiPanel-related areas (not form-* areas)', () => {
      const ids = TABLET_HIT_AREAS.map((a) => a.id)
      expect(ids).toEqual([
        'ai-input',
        'extract-button',
        'result-departure',
        'result-destination',
        'result-cargo',
        'result-fare',
      ])
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
  // getHitAreas dispatcher
  // -------------------------------------------------------------------------
  describe('getHitAreas', () => {
    it('returns 11 hit areas for desktop viewport', () => {
      const result = getHitAreas('desktop')
      expect(result).toHaveLength(11)
      expect(result).toBe(DESKTOP_HIT_AREAS)
    })

    it('returns 6 hit areas for tablet viewport (REQ-DASH-046)', () => {
      const result = getHitAreas('tablet')
      expect(result).toHaveLength(6)
      expect(result).toBe(TABLET_HIT_AREAS)
    })
  })

  // -------------------------------------------------------------------------
  // REQ-DASH-047: 최소 크기 scaleFactor 기준 16x16 / 20x20
  // -------------------------------------------------------------------------
  describe('getMinSize', () => {
    it('returns 20px for desktop viewport (44 * 0.45 >= 20)', () => {
      expect(getMinSize('desktop')).toBe(20)
    })

    it('returns 16px for tablet viewport (44 * 0.38 >= 16, REQ-DASH-047)', () => {
      expect(getMinSize('tablet')).toBe(16)
    })

    it('desktop scaled minimum size >= 20px (44 * 0.45 = 19.8, rounds to 20)', () => {
      const minSize = getMinSize('desktop')
      expect(minSize).toBeGreaterThanOrEqual(20)
    })

    it('tablet scaled minimum size >= 16px (44 * 0.38 = 16.72)', () => {
      const minSize = getMinSize('tablet')
      expect(minSize).toBeGreaterThanOrEqual(16)
    })
  })

  // -------------------------------------------------------------------------
  // logicalDependency — 선행 조건 규칙
  // -------------------------------------------------------------------------
  describe('logicalDependency (REQ-DASH-041)', () => {
    it('extract-button has logicalDependency="input-has-text"', () => {
      const area = DESKTOP_HIT_AREAS.find((a) => a.id === 'extract-button')
      expect(area?.logicalDependency).toBe('input-has-text')
    })

    it('all result-* areas have logicalDependency="extracted"', () => {
      const resultAreas = DESKTOP_HIT_AREAS.filter((a) =>
        a.id.startsWith('result-'),
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

    it('form-* areas have no logicalDependency (always enabled)', () => {
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
  // REQ-DASH-047: Tablet 최소 크기 16x16px (scaleFactor 0.38 기준)
  // -------------------------------------------------------------------------
  describe('REQ-DASH-047: Tablet 최소 크기 16x16px', () => {
    it('all Tablet hit areas meet minimum scaled size (16px)', () => {
      const TABLET_SCALE = 0.38
      TABLET_HIT_AREAS.forEach((area) => {
        const scaledWidth = area.bounds.width * TABLET_SCALE
        const scaledHeight = area.bounds.height * TABLET_SCALE
        expect(scaledWidth).toBeGreaterThanOrEqual(16)
        expect(scaledHeight).toBeGreaterThanOrEqual(16)
      })
    })

    it('getMinSize(tablet) returns 16', () => {
      expect(getMinSize('tablet')).toBe(16)
    })

    it('getMinSize(desktop) returns 20', () => {
      expect(getMinSize('desktop')).toBe(20)
    })
  })

  // -------------------------------------------------------------------------
  // REQ-DASH-046: Tablet excludes Form 영역
  // -------------------------------------------------------------------------
  describe('REQ-DASH-046: Tablet excludes Form 영역', () => {
    it('Tablet hit areas do not include form-* ids', () => {
      const tabletIds = TABLET_HIT_AREAS.map((a) => a.id)
      expect(tabletIds).not.toContain('form-cargo-info')
      expect(tabletIds).not.toContain('form-location-departure')
      expect(tabletIds).not.toContain('form-location-destination')
      expect(tabletIds).not.toContain('form-transport-options')
      expect(tabletIds).not.toContain('form-estimate')
    })

    it('Tablet contains AI panel areas only', () => {
      const tabletIds = TABLET_HIT_AREAS.map((a) => a.id)
      expect(tabletIds).toEqual([
        'ai-input',
        'extract-button',
        'result-departure',
        'result-destination',
        'result-cargo',
        'result-fare',
      ])
    })
  })
})
