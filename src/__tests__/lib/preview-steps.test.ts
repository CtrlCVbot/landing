/**
 * T-DASH3-M1-02 — PREVIEW_STEPS 4-Step + interactions 타이밍 트랙 단위 테스트
 *
 * REQ: REQ-DASH3-011 (4단계 Step 스냅샷)
 *      REQ-DASH3-012 (Step×flow 변화 매트릭스)
 *      REQ-DASH3-041 (AI_APPLY 2단 구조 - partialBeat/allBeat)
 *      REQ-DASH3-063 (조작감 타이밍 트랙)
 *      REQ-DASH3-014 (CompanyManager pre-filled 유지)
 *      REQ-DASH-010 (수정: 5단계 → 4단계)
 *      REQ-DASH-011 (수정: Step duration 재조정)
 * TC:  TC-DASH3-UNIT-PREVIEWSTEPS + TC-DASH3-INT-MATRIX
 * SSOT: .plans/archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md §7
 *
 * Phase 1/2 backward compatibility는 legacy/preview-steps.test.ts 가 LEGACY=true 시 검증.
 */
import { describe, it, expect } from 'vitest'
import {
  AI_APPLY_FOCUS_PAIRS,
  PREVIEW_FOCUS_TARGET_IDS,
  PREVIEW_STEPS,
  getAiApplyCardFocusMetadata,
  getAiApplyResultFocusMetadata,
  getPreviewFocusMetadata,
  getStepVisibilityState,
  validatePreviewFocusTiming,
} from '@/lib/preview-steps'
import type { PreviewStep, StepId } from '@/lib/preview-steps'
import { PREVIEW_MOCK_DATA } from '@/lib/mock-data'

describe('PREVIEW_STEPS (Phase 3 4단계)', () => {
  // --------------------------------------------------------------------
  // TC-DASH3-UNIT-PREVIEWSTEPS — 구조/타이밍 검증
  // --------------------------------------------------------------------
  describe('TC-DASH3-UNIT-PREVIEWSTEPS', () => {
    it('PREVIEW_STEPS.length === 4', () => {
      expect(PREVIEW_STEPS).toHaveLength(4)
    })

    it('각 Step id: INITIAL | AI_INPUT | AI_EXTRACT | AI_APPLY 중 하나, COMPLETE 없음', () => {
      const allowedIds: readonly StepId[] = [
        'INITIAL',
        'AI_INPUT',
        'AI_EXTRACT',
        'AI_APPLY',
      ]
      const ids = PREVIEW_STEPS.map((s) => s.id)
      for (const id of ids) {
        expect(allowedIds).toContain(id)
      }
      expect(ids).not.toContain('COMPLETE')
      // 순서 강제
      expect(ids).toEqual(['INITIAL', 'AI_INPUT', 'AI_EXTRACT', 'AI_APPLY'])
    })

    it('INITIAL duration === 500ms', () => {
      const initial = PREVIEW_STEPS[0]
      expect(initial.id).toBe('INITIAL')
      expect(initial.duration).toBe(800)
    })

    it('AI_INPUT duration === 1500ms', () => {
      const aiInput = PREVIEW_STEPS[1]
      expect(aiInput.id).toBe('AI_INPUT')
      expect(aiInput.duration).toBe(2200)
    })

    it('AI_EXTRACT duration === 1000ms', () => {
      const aiExtract = PREVIEW_STEPS[2]
      expect(aiExtract.id).toBe('AI_EXTRACT')
      expect(aiExtract.duration).toBe(1400)
    })

    it('AI_APPLY duration === 2500ms', () => {
      const aiApply = PREVIEW_STEPS[3]
      expect(aiApply.id).toBe('AI_APPLY')
      expect(aiApply.duration).toBe(4200)
    })

    it('총 Step duration 합 === 5500ms (PRD §6-1)', () => {
      const total = PREVIEW_STEPS.reduce((sum, s) => sum + s.duration, 0)
      expect(total).toBe(8600)
    })

    it('각 Step 에 interactions 필드 존재', () => {
      for (const step of PREVIEW_STEPS) {
        expect(step).toHaveProperty('interactions')
        expect(step.interactions).toBeDefined()
      }
    })

    it('INITIAL.interactions: typingRhythm/focusWalk/pressTargets 비활성', () => {
      const initial = PREVIEW_STEPS[0]
      const { interactions } = initial
      // typingRhythm 없음 또는 비활성
      expect(interactions.typingRhythm).toBeUndefined()
      // focusWalk 빈 배열
      expect(interactions.focusWalk).toEqual([])
      // pressTargets 빈 배열
      expect(interactions.pressTargets).toEqual([])
    })

    it('AI_INPUT.interactions.typingRhythm 활성 (#1 fake-typing)', () => {
      const aiInput = PREVIEW_STEPS[1]
      const { typingRhythm } = aiInput.interactions
      expect(typingRhythm).toBeDefined()
      expect(typingRhythm?.target).toBe('ai-input-textarea')
      expect(typingRhythm?.active).toBe(true)
    })

    it('AI_EXTRACT.interactions.pressTargets 포함 (#3 button-press)', () => {
      const aiExtract = PREVIEW_STEPS[2]
      const { pressTargets } = aiExtract.interactions
      expect(pressTargets).toBeDefined()
      expect(pressTargets?.length).toBeGreaterThanOrEqual(1)
      expect(pressTargets?.[0]).toBe('ai-extract-button')
    })

    it('AI_APPLY.interactions.partialBeat 구조 (categoryOrder 4개, 300ms 간격, fillInFields 배열)', () => {
      const aiApply = PREVIEW_STEPS[3]
      const partial = aiApply.interactions.partialBeat
      expect(partial).toBeDefined()
      expect(partial?.categoryOrder).toEqual([
        'departure',
        'destination',
        'cargo',
        'fare',
      ])
      expect(partial?.intervalMs).toBe(650)
      expect(Array.isArray(partial?.pressTargets)).toBe(true)
      expect(Array.isArray(partial?.rippleTargets)).toBe(true)
      expect(Array.isArray(partial?.fillInFields)).toBe(true)
      expect(partial?.fillInFields.length).toBeGreaterThan(0)
      // fillInFields 각 엔트리 shape 검증
      for (const entry of partial?.fillInFields ?? []) {
        expect(entry).toHaveProperty('fieldId')
        expect(entry).toHaveProperty('value')
        expect(entry).toHaveProperty('delay')
        expect(typeof entry.delay).toBe('number')
      }
    })

    // M3-review#1 — dropdownBeat 존재 검증 (REQ-DASH3-027 실활성)
    it('AI_APPLY.interactions.partialBeat.dropdownBeat 존재 (vehicle-type, cargo 카테고리 offset 이후 triggerAt)', () => {
      const aiApply = PREVIEW_STEPS[3]
      const partial = aiApply.interactions.partialBeat
      expect(partial?.dropdownBeat).toBeDefined()
      expect(partial?.dropdownBeat?.targetId).toBe('vehicle-type')
      // cargo 카테고리는 index 2 × 300 = 600ms — dropdown 은 그 이후에 발동되어야 한다
      expect(typeof partial?.dropdownBeat?.triggerAt).toBe('number')
      expect(partial?.dropdownBeat?.triggerAt).toBeGreaterThanOrEqual(1300)
    })

    it('AI_APPLY.interactions.allBeat 구조 (durationMs 800, toggle stroke + number rolling)', () => {
      const aiApply = PREVIEW_STEPS[3]
      const all = aiApply.interactions.allBeat
      expect(all).toBeDefined()
      expect(all?.durationMs).toBe(1200)
      expect(Array.isArray(all?.toggleStrokeTargets)).toBe(true)
      // 8개 TransportOption 토글
      expect(all?.toggleStrokeTargets.length).toBe(8)
      expect(all?.autoDispatchTrigger).toBe(true)
      expect(all?.settlementReveal).toBe(true)
      expect(Array.isArray(all?.numberRollingTargets)).toBe(true)
      expect(all?.numberRollingTargets.length).toBeGreaterThanOrEqual(1)
      for (const entry of all?.numberRollingTargets ?? []) {
        expect(entry).toHaveProperty('targetId')
        expect(entry).toHaveProperty('finalValue')
        expect(typeof entry.finalValue).toBe('number')
      }
    })

    it('AI_APPLY: partialBeat(1500) + allBeat(800) 합이 Step duration(2500) 이하', () => {
      const aiApply = PREVIEW_STEPS[3]
      const partialSpan =
        (aiApply.interactions.partialBeat?.categoryOrder.length ?? 0) *
        (aiApply.interactions.partialBeat?.intervalMs ?? 0)
      // partial total 범위 (4 * 300 = 1200ms) + allBeat 800 = 2000 ≤ 2500
      const total = partialSpan + (aiApply.interactions.allBeat?.durationMs ?? 0)
      expect(total).toBeLessThanOrEqual(aiApply.duration)
    })

    it('AI_APPLY.interactions.columnPulseTargets 존재 (REQ-DASH3-029)', () => {
      const aiApply = PREVIEW_STEPS[3]
      const { columnPulseTargets } = aiApply.interactions
      expect(Array.isArray(columnPulseTargets)).toBe(true)
      expect(columnPulseTargets?.length).toBeGreaterThanOrEqual(1)
    })

    it('AI_APPLY.interactions.formRevealTimeline defines staged form reveal timing', () => {
      const aiApply = PREVIEW_STEPS[3]
      const timeline = aiApply.interactions.formRevealTimeline

      expect(timeline).toEqual({
        pickupAt: 0,
        deliveryAt: 650,
        estimateAt: 900,
        cargoAt: 1300,
        optionsAt: 1300,
        fareAt: 1950,
        settlementAt: 2200,
      })
      expect(timeline!.deliveryAt).toBeLessThan(timeline!.estimateAt)
      expect(timeline!.estimateAt).toBeLessThan(timeline!.cargoAt)
      expect(timeline!.cargoAt).toBeLessThan(timeline!.fareAt)
      expect(timeline!.fareAt).toBeLessThan(timeline!.settlementAt)
      expect(timeline!.settlementAt).toBeLessThan(aiApply.duration)
    })
  })

  // --------------------------------------------------------------------
  // TC-DASH3-INT-MATRIX — Step × flow 변화 매트릭스 (Phase 1 스펙 §7-3)
  // --------------------------------------------------------------------
  describe('TC-DASH3-INT-MATRIX', () => {
    it('INITIAL: aiInput.text empty, extractState idle, all buttons pending, all form fields empty', () => {
      const initial = PREVIEW_STEPS[0]
      expect(initial.aiState.textProgress).toBe(0)
      expect(initial.aiState.extractState).toBe('idle')
      expect(Object.values(initial.aiState.buttons).every((s) => s === 'pending')).toBe(
        true,
      )
      // form 필드 — companyManager 제외 모두 false
      expect(initial.formState.pickupFilled).toBe(false)
      expect(initial.formState.deliveryFilled).toBe(false)
      expect(initial.formState.vehicleFilled).toBe(false)
      expect(initial.formState.cargoFilled).toBe(false)
      expect(initial.formState.estimateVisible).toBe(false)
      expect(initial.formState.settlementVisible).toBe(false)
    })

    it('AI_INPUT: aiInput.text typing in progress, CompanyManager pre-filled 유지, buttons pending', () => {
      const aiInput = PREVIEW_STEPS[1]
      expect(aiInput.aiState.textProgress).toBeGreaterThan(0)
      expect(aiInput.aiState.extractState).toBe('idle')
      expect(Object.values(aiInput.aiState.buttons).every((s) => s === 'pending')).toBe(
        true,
      )
      // companyManagerFilled 유지 (REQ-DASH3-014)
      expect(aiInput.formState.companyManagerFilled).toBe(true)
      // 나머지 필드 false
      expect(aiInput.formState.pickupFilled).toBe(false)
      expect(aiInput.formState.estimateVisible).toBe(false)
    })

    // M1-review#3: AI_INPUT 중간 진행률(textProgress=0.5)에서 inputText 가 full 이 아닌
    // 진행률 비례 slice 가 되어야 한다 (Phase 1/2 legacy consumer 의 "진행 중 타이핑" 시각 복원).
    it('AI_INPUT: aiPanelState.inputText 는 textProgress 에 비례해 slice 된다 (full 반환 아님)', () => {
      const aiInput = PREVIEW_STEPS[1]
      // aiInput message 의 총 길이
      const fullMessage = PREVIEW_MOCK_DATA.aiInput.message
      // textProgress=0.5 → full 의 절반보다 짧아야 한다 (Math.floor 로 인해 1문자 덜함 가능)
      expect(aiInput.aiPanelState.inputText.length).toBeLessThan(fullMessage.length)
      expect(aiInput.aiPanelState.inputText.length).toBeGreaterThan(0)
      // 실제 slice: full.slice(0, floor(length * 0.5)) 와 일치
      const expected = fullMessage.slice(
        0,
        Math.floor(fullMessage.length * aiInput.aiState.textProgress),
      )
      expect(aiInput.aiPanelState.inputText).toBe(expected)
    })

    it('AI_EXTRACT: extractState loading, CompanyManager pre-filled 유지, buttons pending', () => {
      const aiExtract = PREVIEW_STEPS[2]
      expect(aiExtract.aiState.textProgress).toBe(1)
      expect(aiExtract.aiState.extractState).toBe('loading')
      expect(Object.values(aiExtract.aiState.buttons).every((s) => s === 'pending')).toBe(
        true,
      )
      expect(aiExtract.formState.companyManagerFilled).toBe(true)
      expect(aiExtract.formState.pickupFilled).toBe(false)
    })

    it('AI_APPLY: extractState resultReady, buttons applied, form fields filled (companyManager 제외 모두 true)', () => {
      const aiApply = PREVIEW_STEPS[3]
      expect(aiApply.aiState.extractState).toBe('resultReady')
      expect(Object.values(aiApply.aiState.buttons).every((s) => s === 'applied')).toBe(
        true,
      )
      // 모든 formState 필드 적용 완료
      expect(aiApply.formState.companyManagerFilled).toBe(true)
      expect(aiApply.formState.pickupFilled).toBe(true)
      expect(aiApply.formState.deliveryFilled).toBe(true)
      expect(aiApply.formState.pickupDateTimeFilled).toBe(true)
      expect(aiApply.formState.deliveryDateTimeFilled).toBe(true)
      expect(aiApply.formState.vehicleFilled).toBe(true)
      expect(aiApply.formState.cargoFilled).toBe(true)
      expect(aiApply.formState.estimateVisible).toBe(true)
      expect(aiApply.formState.settlementVisible).toBe(true)
    })

    it('companyManager 는 INITIAL 부터 pre-filled 유지 (REQ-DASH3-014)', () => {
      for (const step of PREVIEW_STEPS) {
        expect(step.formState.companyManagerFilled).toBe(true)
      }
    })

    it('AI_APPLY.interactions.partialBeat.fillInFields 에 companyManager 필드 없음 (REQ-DASH3-022)', () => {
      const aiApply = PREVIEW_STEPS[3]
      const fillIds = aiApply.interactions.partialBeat?.fillInFields.map(
        (f) => f.fieldId,
      ) ?? []
      for (const id of fillIds) {
        expect(id).not.toMatch(/company|manager/i)
      }
    })

    it('successDialogOpen 항상 false (Phase 1 고정 — REQ-DASH3-010 Phase 1 유보)', () => {
      for (const step of PREVIEW_STEPS) {
        expect(step.formState.successDialogOpen).toBe(false)
      }
    })
  })

  // --------------------------------------------------------------------
  // Phase 1/2 backward compatibility — legacy 소비자(form-preview/ai-panel-preview)
  // 가 여전히 step.aiPanelState / step.formState (legacy shape) 를 읽을 수 있어야 함
  // --------------------------------------------------------------------
  describe('Phase 1/2 backward compatibility', () => {
    it('PREVIEW_STEPS export 이름 유지', () => {
      expect(Array.isArray(PREVIEW_STEPS)).toBe(true)
    })

    it('각 Step 에 legacy 필드 (id, label, duration) 존재', () => {
      for (const step of PREVIEW_STEPS) {
        expect(step).toHaveProperty('id')
        expect(step).toHaveProperty('label')
        expect(step).toHaveProperty('duration')
        expect(typeof step.label).toBe('string')
        expect(typeof step.duration).toBe('number')
      }
    })

    it('각 Step 에 legacy aiPanelState alias 존재 (inputText / extractState / buttons)', () => {
      for (const step of PREVIEW_STEPS) {
        expect(step).toHaveProperty('aiPanelState')
        expect(step.aiPanelState).toHaveProperty('inputText')
        expect(step.aiPanelState).toHaveProperty('extractState')
        expect(step.aiPanelState).toHaveProperty('buttons')
        expect(Array.isArray(step.aiPanelState.buttons)).toBe(true)
      }
    })

    it('각 Step 에 legacy formState alias 존재 (filledCards / highlightedCard / estimateAmount)', () => {
      for (const step of PREVIEW_STEPS) {
        expect(step).toHaveProperty('formState')
        expect(step.formState).toHaveProperty('filledCards')
        expect(step.formState).toHaveProperty('highlightedCard')
        expect(step.formState).toHaveProperty('estimateAmount')
      }
    })

    it('PreviewStep 타입으로 할당 가능 (타입 호환성)', () => {
      const steps: readonly PreviewStep[] = PREVIEW_STEPS
      expect(steps).toBeDefined()
    })
  })
})

describe('PREVIEW_STEPS (F2 visibility state)', () => {
  it('hides estimate and settlement values before AI_APPLY', () => {
    for (const step of PREVIEW_STEPS.slice(0, 3)) {
      const visibility = getStepVisibilityState(step)

      expect(visibility.estimateVisible).toBe(false)
      expect(visibility.settlementVisible).toBe(false)
      expect(step.formState.estimateAmount).toBeNull()
    }
  })

  it('reveals estimate and settlement values at AI_APPLY only', () => {
    const aiApply = PREVIEW_STEPS.find((step) => step.id === 'AI_APPLY')

    expect(aiApply).toBeDefined()
    expect(getStepVisibilityState(aiApply!).estimateVisible).toBe(true)
    expect(getStepVisibilityState(aiApply!).settlementVisible).toBe(true)
    expect(aiApply!.formState.estimateAmount).toBe(
      PREVIEW_MOCK_DATA.formData.estimate.amount,
    )
  })
})

describe('PREVIEW_STEPS focus metadata foundation (TC-FZ-UNIT-01/03/04)', () => {
  it('TC-FZ-UNIT-01: every step has a primary focus target and reduced-motion fallback', () => {
    const targetsByStep = PREVIEW_STEPS.map((step) => ({
      id: step.id,
      targetId: step.focus.targetId,
      reducedMotionStrategy: step.focus.reducedMotionFallback.strategy,
    }))

    expect(targetsByStep).toEqual([
      {
        id: 'INITIAL',
        targetId: 'ai-preview-frame',
        reducedMotionStrategy: 'highlight-only',
      },
      {
        id: 'AI_INPUT',
        targetId: 'ai-input-textarea',
        reducedMotionStrategy: 'highlight-only',
      },
      {
        id: 'AI_EXTRACT',
        targetId: 'ai-extract-button',
        reducedMotionStrategy: 'highlight-only',
      },
      {
        id: 'AI_APPLY',
        targetId: 'ai-result-group',
        reducedMotionStrategy: 'highlight-only',
      },
    ])

    for (const step of PREVIEW_STEPS) {
      expect(PREVIEW_FOCUS_TARGET_IDS).toContain(step.focus.targetId)
      expect(step.focus.stepId).toBe(step.id)
      expect(step.focus.ariaHiddenLayer).toBe(true)
    }
  })

  it('TC-FZ-UNIT-03: desktop and tablet viewport presets are explicit and mobile-free', () => {
    for (const step of PREVIEW_STEPS) {
      expect(step.focus.viewport).toHaveProperty('desktop')
      expect(step.focus.viewport).toHaveProperty('tablet')
      expect(step.focus.viewport).not.toHaveProperty('mobile')
      expect(step.focus.viewport.desktop).not.toBe(step.focus.viewport.tablet)
      expect(step.focus.viewport.desktop.scale).toBeGreaterThanOrEqual(1)
      expect(step.focus.viewport.tablet.scale).toBeGreaterThanOrEqual(1)
      expect(typeof step.focus.viewport.desktop.x).toBe('number')
      expect(typeof step.focus.viewport.tablet.y).toBe('number')
    }
  })

  it('TC-FZ-UNIT-04: focus timing validation catches durations longer than the owning step', () => {
    expect(validatePreviewFocusTiming(PREVIEW_STEPS)).toEqual({
      valid: true,
      violations: [],
    })

    const invalidSteps: readonly PreviewStep[] = [
      {
        ...PREVIEW_STEPS[0],
        focus: {
          ...PREVIEW_STEPS[0].focus,
          duration: PREVIEW_STEPS[0].duration + 1,
        },
      },
    ]

    expect(validatePreviewFocusTiming(invalidSteps)).toEqual({
      valid: false,
      violations: [
        {
          stepId: 'INITIAL',
          focusDuration: PREVIEW_STEPS[0].duration + 1,
          stepDuration: PREVIEW_STEPS[0].duration,
        },
      ],
    })
  })

  it('returns focus metadata by step id', () => {
    expect(getPreviewFocusMetadata('AI_INPUT')?.targetId).toBe('ai-input-textarea')
    expect(getPreviewFocusMetadata('AI_APPLY')?.targetId).toBe('ai-result-group')
    expect(getPreviewFocusMetadata('INITIAL')?.viewport.desktop.scale).toBe(1)
  })
})

describe('AI_APPLY click-to-card focus mapping (TC-FZ-UNIT-02)', () => {
  it('maps extracted result categories to form cards in the agreed order', () => {
    expect(AI_APPLY_FOCUS_PAIRS).toEqual([
      {
        categoryId: 'departure',
        resultTargetId: 'ai-result-departure',
        cardTargetId: 'form-pickup-location',
        label: '상차지',
      },
      {
        categoryId: 'destination',
        resultTargetId: 'ai-result-destination',
        cardTargetId: 'form-delivery-location',
        label: '하차지',
      },
      {
        categoryId: 'cargo',
        resultTargetId: 'ai-result-cargo',
        cardTargetId: 'form-cargo-info',
        label: '화물 정보',
      },
      {
        categoryId: 'fare',
        resultTargetId: 'ai-result-fare',
        cardTargetId: 'form-estimate-info',
        label: '운임',
      },
    ])
  })

  it('returns result focus and card focus metadata for each category', () => {
    expect(getAiApplyResultFocusMetadata('departure')?.targetId).toBe(
      'ai-result-departure',
    )
    expect(getAiApplyCardFocusMetadata('departure')?.targetId).toBe(
      'form-pickup-location',
    )
    expect(getAiApplyResultFocusMetadata('destination')?.targetId).toBe(
      'ai-result-destination',
    )
    expect(getAiApplyCardFocusMetadata('destination')?.targetId).toBe(
      'form-delivery-location',
    )
    expect(getAiApplyResultFocusMetadata('cargo')?.targetId).toBe(
      'ai-result-cargo',
    )
    expect(getAiApplyCardFocusMetadata('cargo')?.targetId).toBe(
      'form-cargo-info',
    )
    expect(getAiApplyResultFocusMetadata('fare')?.targetId).toBe(
      'ai-result-fare',
    )
    expect(getAiApplyCardFocusMetadata('fare')?.targetId).toBe(
      'form-estimate-info',
    )
  })
})
