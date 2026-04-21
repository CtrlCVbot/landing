import { describe, it, expect } from 'vitest'
import { PREVIEW_STEPS } from '@/lib/preview-steps'
import type { PreviewStep, StepId } from '@/lib/preview-steps'

/**
 * Legacy 테스트 — Phase 3 4단계 기준으로 갱신됨 (M1-02, 방안 A).
 *
 * 원본은 Phase 1/2 5단계(INITIAL ~ COMPLETE, total 18000ms) 기준이었으나,
 * Phase 3 M1-02 에서 PREVIEW_STEPS 가 4단계(INITIAL ~ AI_APPLY, total 5500ms) 로 축소됨.
 * legacy 소비자(ai-panel-preview.tsx / form-preview.tsx) 는 step.aiPanelState / step.formState
 * alias 를 통해 계속 동작한다.
 */

describe('PREVIEW_STEPS', () => {
  it('should have exactly 4 steps (Phase 3 축소)', () => {
    expect(PREVIEW_STEPS).toHaveLength(4)
  })

  it('should have id, label, duration, aiPanelState, formState on each step', () => {
    for (const step of PREVIEW_STEPS) {
      expect(step).toHaveProperty('id')
      expect(step).toHaveProperty('label')
      expect(step).toHaveProperty('duration')
      expect(step).toHaveProperty('aiPanelState')
      expect(step).toHaveProperty('formState')
    }
  })

  it('should satisfy PreviewStep type', () => {
    const steps: readonly PreviewStep[] = PREVIEW_STEPS
    expect(steps).toBeDefined()
  })

  describe('step ordering', () => {
    const EXPECTED_IDS: readonly StepId[] = [
      'INITIAL',
      'AI_INPUT',
      'AI_EXTRACT',
      'AI_APPLY',
    ]

    it('should have step IDs in correct order', () => {
      const ids = PREVIEW_STEPS.map((s) => s.id)
      expect(ids).toEqual(EXPECTED_IDS)
    })
  })

  describe('duration', () => {
    it('should have total duration of 5500ms (Phase 3 PRD §6-1)', () => {
      const total = PREVIEW_STEPS.reduce((sum, s) => sum + s.duration, 0)
      expect(total).toBe(5500)
    })

    it('should have positive duration for each step', () => {
      for (const step of PREVIEW_STEPS) {
        expect(step.duration).toBeGreaterThan(0)
      }
    })
  })

  describe('INITIAL step', () => {
    it('should have empty formState.filledCards', () => {
      const initial = PREVIEW_STEPS[0]
      expect(initial.formState.filledCards).toEqual([])
    })

    it('should have null highlightedCard', () => {
      const initial = PREVIEW_STEPS[0]
      expect(initial.formState.highlightedCard).toBeNull()
    })

    it('should have null estimateAmount', () => {
      const initial = PREVIEW_STEPS[0]
      expect(initial.formState.estimateAmount).toBeNull()
    })

    it('should have empty inputText', () => {
      const initial = PREVIEW_STEPS[0]
      expect(initial.aiPanelState.inputText).toBe('')
    })

    it('should have idle extractState', () => {
      const initial = PREVIEW_STEPS[0]
      expect(initial.aiPanelState.extractState).toBe('idle')
    })

    it('should have empty buttons array', () => {
      const initial = PREVIEW_STEPS[0]
      expect(initial.aiPanelState.buttons).toEqual([])
    })
  })

  describe('AI_INPUT step', () => {
    it('should have non-empty inputText', () => {
      const aiInput = PREVIEW_STEPS[1]
      expect(aiInput.aiPanelState.inputText).toBeTruthy()
      expect(aiInput.aiPanelState.inputText.length).toBeGreaterThan(0)
    })

    it('should have idle extractState', () => {
      const aiInput = PREVIEW_STEPS[1]
      expect(aiInput.aiPanelState.extractState).toBe('idle')
    })

    it('should have empty buttons', () => {
      const aiInput = PREVIEW_STEPS[1]
      expect(aiInput.aiPanelState.buttons).toEqual([])
    })

    it('should have empty formState (same as INITIAL — companyManager 제외 모두 false)', () => {
      const aiInput = PREVIEW_STEPS[1]
      expect(aiInput.formState.filledCards).toEqual([])
      expect(aiInput.formState.highlightedCard).toBeNull()
      expect(aiInput.formState.estimateAmount).toBeNull()
    })
  })

  describe('AI_EXTRACT step', () => {
    it('should have loading extractState (Phase 3: spinner)', () => {
      const aiExtract = PREVIEW_STEPS[2]
      expect(aiExtract.aiPanelState.extractState).toBe('loading')
    })

    it('should have empty buttons array (Phase 3: loading 중 버튼 미노출)', () => {
      const aiExtract = PREVIEW_STEPS[2]
      // Phase 3: AI_EXTRACT 는 loading 상태, 결과 버튼은 AI_APPLY 에서만 applied 로 노출
      expect(aiExtract.aiPanelState.buttons).toEqual([])
    })

    it('should have empty formState (same as INITIAL — companyManager 제외 모두 false)', () => {
      const aiExtract = PREVIEW_STEPS[2]
      expect(aiExtract.formState.filledCards).toEqual([])
      expect(aiExtract.formState.highlightedCard).toBeNull()
      expect(aiExtract.formState.estimateAmount).toBeNull()
    })
  })

  describe('AI_APPLY step', () => {
    it('should have all 4 buttons with applied status', () => {
      const aiApply = PREVIEW_STEPS[3]
      expect(aiApply.aiPanelState.buttons).toHaveLength(4)
      for (const button of aiApply.aiPanelState.buttons) {
        expect(button.status).toBe('applied')
      }
    })

    it('should have buttons for departure, destination, cargo, fare', () => {
      const aiApply = PREVIEW_STEPS[3]
      const ids = aiApply.aiPanelState.buttons.map((b) => b.id)
      expect(ids).toEqual(['departure', 'destination', 'cargo', 'fare'])
    })

    it('should have 4 or more filledCards', () => {
      const aiApply = PREVIEW_STEPS[3]
      expect(aiApply.formState.filledCards.length).toBeGreaterThanOrEqual(4)
    })

    it('should have estimateAmount matching mock-data (Phase 3: 850000)', () => {
      const aiApply = PREVIEW_STEPS[3]
      expect(aiApply.formState.estimateAmount).toBe(850000)
    })

    it('should have null highlightedCard', () => {
      const aiApply = PREVIEW_STEPS[3]
      expect(aiApply.formState.highlightedCard).toBeNull()
    })
  })
})
