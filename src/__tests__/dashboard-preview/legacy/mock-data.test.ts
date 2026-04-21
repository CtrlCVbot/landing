import { describe, it, expect } from 'vitest'
import { PREVIEW_MOCK_DATA } from '@/lib/mock-data'
import type { PreviewMockData } from '@/lib/mock-data'

describe('PREVIEW_MOCK_DATA', () => {
  it('should satisfy the PreviewMockData type', () => {
    const data: PreviewMockData = PREVIEW_MOCK_DATA
    expect(data).toBeDefined()
  })

  describe('aiInput', () => {
    it('should have a non-empty message', () => {
      expect(PREVIEW_MOCK_DATA.aiInput.message).toBeTruthy()
      expect(PREVIEW_MOCK_DATA.aiInput.message.length).toBeGreaterThan(0)
    })
  })

  describe('aiResult.categories', () => {
    it('should have exactly 4 categories', () => {
      expect(PREVIEW_MOCK_DATA.aiResult.categories).toHaveLength(4)
    })

    it('should contain departure, destination, cargo, fare categories', () => {
      const ids = PREVIEW_MOCK_DATA.aiResult.categories.map((c) => c.id)
      expect(ids).toEqual(['departure', 'destination', 'cargo', 'fare'])
    })

    it('should have at least 1 button per category', () => {
      for (const category of PREVIEW_MOCK_DATA.aiResult.categories) {
        expect(category.buttons.length).toBeGreaterThanOrEqual(1)
      }
    })

    it('should have label and icon for each category', () => {
      for (const category of PREVIEW_MOCK_DATA.aiResult.categories) {
        expect(category.label).toBeTruthy()
        expect(category.icon).toBeTruthy()
      }
    })

    it('should have correct labels for each category', () => {
      const labels = PREVIEW_MOCK_DATA.aiResult.categories.map((c) => c.label)
      expect(labels).toEqual(['상차지', '하차지', '화물/차량', '운임'])
    })

    it('should have correct icons for each category', () => {
      const icons = PREVIEW_MOCK_DATA.aiResult.categories.map((c) => c.icon)
      expect(icons).toEqual(['MapPin', 'Flag', 'Package', 'Banknote'])
    })

    it('should have buttons with fieldKey, label, displayValue, and status', () => {
      for (const category of PREVIEW_MOCK_DATA.aiResult.categories) {
        for (const button of category.buttons) {
          expect(button.fieldKey).toBeTruthy()
          expect(button.label).toBeTruthy()
          expect(button.displayValue).toBeTruthy()
          expect(['pending', 'applied']).toContain(button.status)
        }
      }
    })
  })

  describe('formData', () => {
    it('should have all pickup fields filled', () => {
      const { pickup } = PREVIEW_MOCK_DATA.formData
      expect(pickup.company).toBeTruthy()
      expect(pickup.address).toBeTruthy()
      expect(pickup.date).toBeTruthy()
      expect(pickup.time).toBeTruthy()
    })

    it('should have all delivery fields filled', () => {
      const { delivery } = PREVIEW_MOCK_DATA.formData
      expect(delivery.company).toBeTruthy()
      expect(delivery.address).toBeTruthy()
      expect(delivery.date).toBeTruthy()
      expect(delivery.time).toBeTruthy()
    })

    it('should have vehicle type and weight filled', () => {
      const { vehicle } = PREVIEW_MOCK_DATA.formData
      expect(vehicle.type).toBeTruthy()
      expect(vehicle.weight).toBeTruthy()
    })

    it('should have cargo name and remark filled', () => {
      const { cargo } = PREVIEW_MOCK_DATA.formData
      expect(cargo.name).toBeTruthy()
      expect(cargo.remark).toBeTruthy()
    })

    it('should have at least one option', () => {
      expect(PREVIEW_MOCK_DATA.formData.options.length).toBeGreaterThanOrEqual(1)
    })

    it('should have estimate with distance and amount', () => {
      const { estimate } = PREVIEW_MOCK_DATA.formData
      expect(estimate.distance).toBeGreaterThan(0)
      expect(estimate.amount).toBeGreaterThan(0)
    })
  })

  describe('tooltips', () => {
    const REQUIRED_TOOLTIP_KEYS = [
      'ai-input',
      'extract-button',
      'result-departure',
      'result-destination',
      'result-cargo',
      'result-fare',
      'cargo-info',
      'location-departure',
      'location-destination',
      'transport-options',
      'estimate-info',
    ] as const

    it('should have all 11 required tooltip keys', () => {
      expect(Object.keys(PREVIEW_MOCK_DATA.tooltips)).toHaveLength(11)
    })

    it('should contain every required tooltip key', () => {
      for (const key of REQUIRED_TOOLTIP_KEYS) {
        expect(PREVIEW_MOCK_DATA.tooltips).toHaveProperty(key)
      }
    })

    it('should have non-empty tooltip values', () => {
      for (const key of REQUIRED_TOOLTIP_KEYS) {
        expect(PREVIEW_MOCK_DATA.tooltips[key]).toBeTruthy()
      }
    })
  })
})
