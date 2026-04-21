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
import { PREVIEW_STEPS } from '@/lib/preview-steps'
import type { PreviewStep, StepId } from '@/lib/preview-steps'

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
      expect(initial.duration).toBe(500)
    })

    it('AI_INPUT duration === 1500ms', () => {
      const aiInput = PREVIEW_STEPS[1]
      expect(aiInput.id).toBe('AI_INPUT')
      expect(aiInput.duration).toBe(1500)
    })

    it('AI_EXTRACT duration === 1000ms', () => {
      const aiExtract = PREVIEW_STEPS[2]
      expect(aiExtract.id).toBe('AI_EXTRACT')
      expect(aiExtract.duration).toBe(1000)
    })

    it('AI_APPLY duration === 2500ms', () => {
      const aiApply = PREVIEW_STEPS[3]
      expect(aiApply.id).toBe('AI_APPLY')
      expect(aiApply.duration).toBe(2500)
    })

    it('총 Step duration 합 === 5500ms (PRD §6-1)', () => {
      const total = PREVIEW_STEPS.reduce((sum, s) => sum + s.duration, 0)
      expect(total).toBe(5500)
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
      expect(partial?.intervalMs).toBe(300)
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

    it('AI_APPLY.interactions.allBeat 구조 (durationMs 800, toggle stroke + number rolling)', () => {
      const aiApply = PREVIEW_STEPS[3]
      const all = aiApply.interactions.allBeat
      expect(all).toBeDefined()
      expect(all?.durationMs).toBe(800)
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
