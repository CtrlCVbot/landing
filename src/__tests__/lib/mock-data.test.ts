/**
 * T-DASH3-M1-01 — PREVIEW_MOCK_DATA Phase 3 전체 스키마 단위 테스트
 *
 * REQ: REQ-DASH3-010 (4단계 흐름 기반), REQ-DASH3-014 (CompanyManager pre-filled),
 *      REQ-DASH3-065 (한국어)
 * TC:  TC-DASH3-UNIT-MOCKSCHEMA + TC-DASH3-SSOT-MOCK
 * SSOT: .plans/features/active/dash-preview-phase3/sources/wireframes/decision-log.md §4-3
 * 스펙: .plans/archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md §6
 *
 * Phase 1/2 backward compatibility는 legacy/mock-data.test.ts 가 LEGACY=true 시 검증.
 */
import { describe, it, expect } from 'vitest'
import {
  PREVIEW_MOCK_DATA,
  PREVIEW_MOCK_SCENARIOS,
  createPreviewMockData,
  getDefaultPreviewMockScenario,
  getRandomizablePreviewMockScenarios,
  selectPreviewMockScenario,
  selectRandomPreviewMockScenario,
} from '@/lib/mock-data'

function parseWonDisplay(displayValue: string): number {
  return Number(displayValue.replace(/[^\d]/g, ''))
}

function getExtractedFareAmount(scenario = getDefaultPreviewMockScenario()): number {
  const fareCategory = scenario.extractedFrame.aiResult.categories.find(
    (category) => category.id === 'fare',
  )
  const fareButton = fareCategory?.buttons.find(
    (button) => button.fieldKey === 'fare-amount',
  )

  expect(fareButton).toBeDefined()
  return parseWonDisplay(fareButton?.displayValue ?? '')
}

describe('PREVIEW_MOCK_DATA (Phase 3 full schema)', () => {
  // --------------------------------------------------------------------
  // TC-DASH3-UNIT-MOCKSCHEMA — 구조/타입 검증
  // --------------------------------------------------------------------
  describe('TC-DASH3-UNIT-MOCKSCHEMA', () => {
    it('최상위 구조: aiInput / aiResult / formData / tooltips 모두 존재', () => {
      expect(PREVIEW_MOCK_DATA).toHaveProperty('aiInput')
      expect(PREVIEW_MOCK_DATA).toHaveProperty('aiResult')
      expect(PREVIEW_MOCK_DATA).toHaveProperty('formData')
      expect(PREVIEW_MOCK_DATA).toHaveProperty('tooltips')
    })

    it('aiInput.activeTab 은 text | image 중 하나', () => {
      expect(['text', 'image']).toContain(PREVIEW_MOCK_DATA.aiInput.activeTab)
    })

    it('aiInput.textValue 는 비어 있지 않은 문자열', () => {
      expect(typeof PREVIEW_MOCK_DATA.aiInput.textValue).toBe('string')
      expect(PREVIEW_MOCK_DATA.aiInput.textValue.length).toBeGreaterThan(0)
    })

    it('aiResult.extractState 는 idle | loading | resultReady 중 하나', () => {
      expect(['idle', 'loading', 'resultReady']).toContain(
        PREVIEW_MOCK_DATA.aiResult.extractState,
      )
    })

    it('aiResult.categories 는 정확히 4개 (departure / destination / cargo / fare)', () => {
      expect(PREVIEW_MOCK_DATA.aiResult.categories).toHaveLength(4)
      const ids = PREVIEW_MOCK_DATA.aiResult.categories.map((c) => c.id)
      expect(ids).toEqual(['departure', 'destination', 'cargo', 'fare'])
    })

    it('aiResult.categories 각 아이콘: MapPin / Flag / Package / Banknote', () => {
      const icons = PREVIEW_MOCK_DATA.aiResult.categories.map((c) => c.icon)
      expect(icons).toEqual(['MapPin', 'Flag', 'Package', 'Banknote'])
    })

    it('aiResult.categories 버튼 status 는 pending | applied | unavailable 중 하나', () => {
      for (const category of PREVIEW_MOCK_DATA.aiResult.categories) {
        for (const button of category.buttons) {
          expect(['pending', 'applied', 'unavailable']).toContain(button.status)
          expect(button.id).toBeTruthy()
          expect(button.fieldKey).toBeTruthy()
          expect(button.label).toBeTruthy()
          expect(button.displayValue).toBeTruthy()
        }
      }
    })

    it('aiResult.warnings / evidence / jsonViewerOpen 존재', () => {
      expect(Array.isArray(PREVIEW_MOCK_DATA.aiResult.warnings)).toBe(true)
      expect(typeof PREVIEW_MOCK_DATA.aiResult.evidence).toBe('object')
      expect(typeof PREVIEW_MOCK_DATA.aiResult.jsonViewerOpen).toBe('boolean')
    })

    it('formData.options 는 정확히 8개 불리언 필드 키', () => {
      const options = PREVIEW_MOCK_DATA.formData.options
      const keys = Object.keys(options).sort()
      expect(keys).toEqual(
        [
          'cod',
          'direct',
          'fast',
          'forklift',
          'manual',
          'roundTrip',
          'special',
          'trace',
        ].sort(),
      )
      for (const k of keys) {
        expect(typeof (options as unknown as Record<string, unknown>)[k]).toBe('boolean')
      }
    })

    it('formData.estimate 은 distance / duration / amount / autoDispatch 포함', () => {
      const e = PREVIEW_MOCK_DATA.formData.estimate
      expect(typeof e.distance).toBe('number')
      expect(typeof e.duration).toBe('number')
      expect(typeof e.amount).toBe('number')
      expect(typeof e.autoDispatch).toBe('boolean')
    })

    it('formData.settlement.additionalFees 배열, 각 항목 id/type/amount/memo/target', () => {
      const fees = PREVIEW_MOCK_DATA.formData.settlement.additionalFees
      expect(Array.isArray(fees)).toBe(true)
      expect(fees.length).toBeGreaterThanOrEqual(1)
      for (const fee of fees) {
        expect(fee).toHaveProperty('id')
        expect(fee).toHaveProperty('type')
        expect(fee).toHaveProperty('amount')
        expect(fee).toHaveProperty('memo')
        expect(fee).toHaveProperty('target')
      }
    })

    it('formData.settlement.totals 는 chargeTotal / dispatchTotal / profit 포함', () => {
      const t = PREVIEW_MOCK_DATA.formData.settlement.totals
      expect(typeof t.chargeTotal).toBe('number')
      expect(typeof t.dispatchTotal).toBe('number')
      expect(typeof t.profit).toBe('number')
    })

    it('formData.settlement.chargeBaseAmount / dispatchBaseAmount 존재', () => {
      expect(typeof PREVIEW_MOCK_DATA.formData.settlement.chargeBaseAmount).toBe('number')
      expect(typeof PREVIEW_MOCK_DATA.formData.settlement.dispatchBaseAmount).toBe('number')
    })

    it('formData.dialogs.success.open 은 false (Phase 1 유보)', () => {
      expect(PREVIEW_MOCK_DATA.formData.dialogs.success.open).toBe(false)
    })

    it('formData.dialogs.searchAddress / companyManager 존재', () => {
      expect(typeof PREVIEW_MOCK_DATA.formData.dialogs.searchAddress.open).toBe('boolean')
      expect(typeof PREVIEW_MOCK_DATA.formData.dialogs.companyManager.open).toBe('boolean')
    })

    it('formData.availableManagers 는 최소 1명 (id/name/department)', () => {
      const mgrs = PREVIEW_MOCK_DATA.formData.availableManagers
      expect(Array.isArray(mgrs)).toBe(true)
      expect(mgrs.length).toBeGreaterThanOrEqual(1)
      for (const m of mgrs) {
        expect(m).toHaveProperty('id')
        expect(m).toHaveProperty('name')
        expect(m).toHaveProperty('department')
      }
    })

    it('formData.vehicle.recentCargoSuggestions 는 최소 1개', () => {
      const suggestions = PREVIEW_MOCK_DATA.formData.vehicle.recentCargoSuggestions
      expect(Array.isArray(suggestions)).toBe(true)
      expect(suggestions.length).toBeGreaterThanOrEqual(1)
    })

    it('formData.pickup 주소 세부 필드 (roadAddress / jibunAddress / detailAddress / latitude / longitude)', () => {
      const p = PREVIEW_MOCK_DATA.formData.pickup
      expect(typeof p.roadAddress).toBe('string')
      expect(typeof p.jibunAddress).toBe('string')
      expect(typeof p.detailAddress).toBe('string')
      expect(typeof p.latitude).toBe('number')
      expect(typeof p.longitude).toBe('number')
      expect(typeof p.contactName).toBe('string')
      expect(typeof p.contactPhone).toBe('string')
    })

    it('formData.delivery 주소 세부 필드 (pickup 과 동일 구조)', () => {
      const d = PREVIEW_MOCK_DATA.formData.delivery
      expect(typeof d.roadAddress).toBe('string')
      expect(typeof d.jibunAddress).toBe('string')
      expect(typeof d.detailAddress).toBe('string')
      expect(typeof d.latitude).toBe('number')
      expect(typeof d.longitude).toBe('number')
      expect(typeof d.contactName).toBe('string')
      expect(typeof d.contactPhone).toBe('string')
    })

    it('tooltips 는 15개 이상 (히트 영역 19~20 대응)', () => {
      expect(Object.keys(PREVIEW_MOCK_DATA.tooltips).length).toBeGreaterThanOrEqual(15)
    })

    // F5 T-CLEANUP-03 (R4/R5) — 'ai-json-viewer' tooltip 키 제거 반영 (16 → 15종).
    it('tooltips: Phase 3 신규 key 15종 모두 존재', () => {
      const REQUIRED_PHASE3_KEYS = [
        'ai-tab-bar',
        'ai-input',
        'ai-extract-button',
        'ai-result-buttons',
        'ai-warning-badges',
        'company-manager',
        'pickup-location',
        'delivery-location',
        'pickup-datetime',
        'delivery-datetime',
        'cargo-info',
        'transport-options',
        'estimate-info',
        'settlement',
        'auto-dispatch',
      ] as const
      for (const key of REQUIRED_PHASE3_KEYS) {
        expect(PREVIEW_MOCK_DATA.tooltips).toHaveProperty(key)
        expect(PREVIEW_MOCK_DATA.tooltips[key]).toBeTruthy()
      }
    })

    // F5 T-CLEANUP-04 (R8) — 'auto-dispatch' tooltip 문구 업데이트.
    // SSOT: .plans/features/active/f5-ui-residue-cleanup/02-package/01-requirements.md §R8 (D-005, 2026-04-23).
    it(`'auto-dispatch' tooltip 문구가 신 SSOT 로 반영 (F5 R8)`, () => {
      expect(PREVIEW_MOCK_DATA.tooltips['auto-dispatch']).toBe(
        '자동 배차 대기 중 — 배차요청 자동 승인되어 배차대기상태로 전환합니다',
      )
    })
  })

  // --------------------------------------------------------------------
  // TC-DASH3-SSOT-MOCK — SSOT §4-3 값 일치 검증
  // --------------------------------------------------------------------
  describe('TC-DASH3-SSOT-MOCK (wireframe decision-log §4-3)', () => {
    it('company.name === 옵틱물류', () => {
      expect(PREVIEW_MOCK_DATA.formData.company.name).toBe('옵틱물류')
    })

    it('company.businessNumber === ***-**-***** (마스킹 유지)', () => {
      expect(PREVIEW_MOCK_DATA.formData.company.businessNumber).toBe('***-**-*****')
    })

    it('company.ceoName === 김옵틱', () => {
      expect(PREVIEW_MOCK_DATA.formData.company.ceoName).toBe('김옵틱')
    })

    it('manager.name === 이매니저', () => {
      expect(PREVIEW_MOCK_DATA.formData.manager.name).toBe('이매니저')
    })

    it('manager.contact === 010-****-**** (마스킹 유지)', () => {
      expect(PREVIEW_MOCK_DATA.formData.manager.contact).toBe('010-****-****')
    })

    it('manager.email === example@optics.com', () => {
      expect(PREVIEW_MOCK_DATA.formData.manager.email).toBe('example@optics.com')
    })

    it('manager.department === 물류운영팀', () => {
      expect(PREVIEW_MOCK_DATA.formData.manager.department).toBe('물류운영팀')
    })

    it('pickup.contactPhone: 010-****-**** 마스킹 유지', () => {
      expect(PREVIEW_MOCK_DATA.formData.pickup.contactPhone).toBe('010-****-****')
    })

    it('delivery.contactPhone: 010-****-**** 마스킹 유지', () => {
      expect(PREVIEW_MOCK_DATA.formData.delivery.contactPhone).toBe('010-****-****')
    })

    it('options.direct === true (AI_APPLY 예시)', () => {
      expect(PREVIEW_MOCK_DATA.formData.options.direct).toBe(true)
    })

    it('options.forklift === true (AI_APPLY 예시)', () => {
      expect(PREVIEW_MOCK_DATA.formData.options.forklift).toBe(true)
    })

    it('estimate.autoDispatch === true', () => {
      expect(PREVIEW_MOCK_DATA.formData.estimate.autoDispatch).toBe(true)
    })
  })

  // --------------------------------------------------------------------
  // Phase 1/2 backward compatibility (export 이름/주요 필드 유지)
  // --------------------------------------------------------------------
  describe('Phase 1/2 backward compatibility', () => {
    it('PREVIEW_MOCK_DATA export 이름 유지', () => {
      expect(PREVIEW_MOCK_DATA).toBeDefined()
    })

    it('aiInput.message 필드 유지 (Phase 1/2 preview-steps.ts 참조)', () => {
      expect(typeof PREVIEW_MOCK_DATA.aiInput.message).toBe('string')
      expect(PREVIEW_MOCK_DATA.aiInput.message.length).toBeGreaterThan(0)
    })

    it('aiResult.categories[].buttons[].fieldKey/status: pending|applied 포함', () => {
      const firstButton = PREVIEW_MOCK_DATA.aiResult.categories[0].buttons[0]
      expect(firstButton.fieldKey).toBeTruthy()
      // Phase 1/2 status (pending|applied) 은 Phase 3 status 셋의 부분집합이어야 함
      expect(['pending', 'applied', 'unavailable']).toContain(firstButton.status)
    })

    it('formData.pickup.{company,address,date,time} 필드 유지', () => {
      const p = PREVIEW_MOCK_DATA.formData.pickup
      expect(typeof p.company).toBe('string')
      expect(typeof p.address).toBe('string')
      expect(typeof p.date).toBe('string')
      expect(typeof p.time).toBe('string')
    })

    it('formData.delivery.{company,address,date,time} 필드 유지', () => {
      const d = PREVIEW_MOCK_DATA.formData.delivery
      expect(typeof d.company).toBe('string')
      expect(typeof d.address).toBe('string')
      expect(typeof d.date).toBe('string')
      expect(typeof d.time).toBe('string')
    })

    it('formData.vehicle.{type,weight} 필드 유지', () => {
      const v = PREVIEW_MOCK_DATA.formData.vehicle
      expect(typeof v.type).toBe('string')
      expect(typeof v.weight).toBe('string')
    })

    it('formData.cargo.{name,remark} 필드 유지', () => {
      const c = PREVIEW_MOCK_DATA.formData.cargo
      expect(typeof c.name).toBe('string')
      expect(typeof c.remark).toBe('string')
    })

    it('formData.estimate.{distance,amount} 필드 유지', () => {
      const e = PREVIEW_MOCK_DATA.formData.estimate
      expect(typeof e.distance).toBe('number')
      expect(typeof e.amount).toBe('number')
    })

    it('tooltips: Phase 1/2 11개 key 유지 (legacy hit-areas.ts 의존성)', () => {
      const LEGACY_KEYS = [
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
      for (const key of LEGACY_KEYS) {
        expect(PREVIEW_MOCK_DATA.tooltips).toHaveProperty(key)
        expect(PREVIEW_MOCK_DATA.tooltips[key]).toBeTruthy()
      }
    })
  })
})

describe('PREVIEW_MOCK_SCENARIOS (F2 frame split)', () => {
  it('defines at least default, partial, and mismatch-risk scenarios', () => {
    const ids = PREVIEW_MOCK_SCENARIOS.map((scenario) => scenario.id)

    expect(PREVIEW_MOCK_SCENARIOS.length).toBeGreaterThanOrEqual(3)
    expect(ids).toEqual(expect.arrayContaining(['default', 'partial', 'mismatch-risk']))
  })

  it('keeps extractedFrame and appliedFrame separate for every scenario', () => {
    for (const scenario of PREVIEW_MOCK_SCENARIOS) {
      expect(scenario.extractedFrame).toHaveProperty('aiInput')
      expect(scenario.extractedFrame).toHaveProperty('aiResult')
      expect(scenario.appliedFrame).toHaveProperty('formData')
      expect(scenario.appliedFrame).not.toHaveProperty('aiResult')
      expect(scenario.extractedFrame).not.toHaveProperty('formData')
    }
  })

  it('selects the default scenario deterministically, including unknown input fallback', () => {
    const byDefault = selectPreviewMockScenario()
    const byId = selectPreviewMockScenario('default')
    const byUnknown = selectPreviewMockScenario('unknown-scenario')

    expect(byDefault.id).toBe('default')
    expect(byId).toBe(byDefault)
    expect(byUnknown).toBe(byDefault)
  })

  it('builds PREVIEW_MOCK_DATA from the default scenario as a compatibility object', () => {
    const defaultScenario = getDefaultPreviewMockScenario()

    expect(PREVIEW_MOCK_DATA).toEqual(createPreviewMockData(defaultScenario))
    expect(PREVIEW_MOCK_DATA.aiInput).toBe(defaultScenario.extractedFrame.aiInput)
    expect(PREVIEW_MOCK_DATA.aiResult).toBe(defaultScenario.extractedFrame.aiResult)
    expect(PREVIEW_MOCK_DATA.formData).toBe(defaultScenario.appliedFrame.formData)
  })

  it('keeps the default extracted fare consistent with the applied estimate amount', () => {
    const defaultScenario = getDefaultPreviewMockScenario()

    expect(getExtractedFareAmount(defaultScenario)).toBe(
      defaultScenario.appliedFrame.formData.estimate.amount,
    )
  })

  it('keeps mismatch-risk as a fixture where extracted fare and applied estimate differ', () => {
    const mismatchRisk = selectPreviewMockScenario('mismatch-risk')

    expect(getExtractedFareAmount(mismatchRisk)).not.toBe(
      mismatchRisk.appliedFrame.formData.estimate.amount,
    )
  })

  it('keeps jsonViewerOpen closed inside extracted frames', () => {
    for (const scenario of PREVIEW_MOCK_SCENARIOS) {
      expect(scenario.extractedFrame.aiResult.jsonViewerOpen).toBe(false)
    }
  })
})

describe('PREVIEW_MOCK_SCENARIOS random preview pool', () => {
  it('exposes at least three demo-safe randomizable scenarios', () => {
    const randomizable = getRandomizablePreviewMockScenarios()
    const ids = randomizable.map((scenario) => scenario.id)

    expect(randomizable.length).toBeGreaterThanOrEqual(3)
    expect(ids).toEqual(
      expect.arrayContaining([
        'default',
        'regional-cold-chain',
        'short-industrial-hop',
      ]),
    )
  })

  it('keeps mismatch-risk out of the random preview pool', () => {
    const ids = getRandomizablePreviewMockScenarios().map(
      (scenario) => scenario.id,
    )
    const mismatchRisk = selectPreviewMockScenario('mismatch-risk')

    expect(mismatchRisk.randomizable).toBe(false)
    expect(ids).not.toContain('mismatch-risk')
  })

  it('selects a scenario deterministically when random() is injected', () => {
    const pool = getRandomizablePreviewMockScenarios()

    expect(selectRandomPreviewMockScenario({ random: () => 0 })).toBe(pool[0])
    expect(selectRandomPreviewMockScenario({ random: () => 0.999 })).toBe(
      pool[pool.length - 1],
    )
  })

  it('does not select the excluded previous scenario when alternatives exist', () => {
    const previous = getRandomizablePreviewMockScenarios()[0]!
    const selected = selectRandomPreviewMockScenario({
      excludeId: previous.id,
      random: () => 0,
    })

    expect(selected.id).not.toBe(previous.id)
  })

  it('keeps extracted fare and applied estimate consistent for every demo scenario', () => {
    for (const scenario of getRandomizablePreviewMockScenarios()) {
      expect(getExtractedFareAmount(scenario)).toBe(
        scenario.appliedFrame.formData.estimate.amount,
      )
    }
  })
})
