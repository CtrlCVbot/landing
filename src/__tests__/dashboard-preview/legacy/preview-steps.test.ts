import { describe, it, expect } from 'vitest'
import { PREVIEW_STEPS } from '@/lib/preview-steps'
import type { PreviewStep, StepId } from '@/lib/preview-steps'

describe('PREVIEW_STEPS', () => {
  it('should have exactly 5 steps', () => {
    expect(PREVIEW_STEPS).toHaveLength(5)
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
      'COMPLETE',
    ]

    it('should have step IDs in correct order', () => {
      const ids = PREVIEW_STEPS.map((s) => s.id)
      expect(ids).toEqual(EXPECTED_IDS)
    })
  })

  describe('duration', () => {
    it('should have total duration between 16000ms and 22000ms', () => {
      const total = PREVIEW_STEPS.reduce((sum, s) => sum + s.duration, 0)
      expect(total).toBeGreaterThanOrEqual(16000)
      expect(total).toBeLessThanOrEqual(22000)
    })

    it('should have total duration of 18000ms', () => {
      const total = PREVIEW_STEPS.reduce((sum, s) => sum + s.duration, 0)
      expect(total).toBe(18000)
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

    it('should have empty formState (same as INITIAL)', () => {
      const aiInput = PREVIEW_STEPS[1]
      expect(aiInput.formState.filledCards).toEqual([])
      expect(aiInput.formState.highlightedCard).toBeNull()
      expect(aiInput.formState.estimateAmount).toBeNull()
    })
  })

  describe('AI_EXTRACT step', () => {
    it('should have resultReady extractState', () => {
      const aiExtract = PREVIEW_STEPS[2]
      expect(aiExtract.aiPanelState.extractState).toBe('resultReady')
    })

    it('should have 4 buttons all with pending status', () => {
      const aiExtract = PREVIEW_STEPS[2]
      expect(aiExtract.aiPanelState.buttons).toHaveLength(4)
      for (const button of aiExtract.aiPanelState.buttons) {
        expect(button.status).toBe('pending')
      }
    })

    it('should have buttons for departure, destination, cargo, fare', () => {
      const aiExtract = PREVIEW_STEPS[2]
      const ids = aiExtract.aiPanelState.buttons.map((b) => b.id)
      expect(ids).toEqual(['departure', 'destination', 'cargo', 'fare'])
    })

    it('should have empty formState (same as INITIAL)', () => {
      const aiExtract = PREVIEW_STEPS[2]
      expect(aiExtract.formState.filledCards).toEqual([])
      expect(aiExtract.formState.highlightedCard).toBeNull()
      expect(aiExtract.formState.estimateAmount).toBeNull()
    })
  })

  describe('AI_APPLY step', () => {
    it('should have all buttons with applied status', () => {
      const aiApply = PREVIEW_STEPS[3]
      expect(aiApply.aiPanelState.buttons).toHaveLength(4)
      for (const button of aiApply.aiPanelState.buttons) {
        expect(button.status).toBe('applied')
      }
    })

    it('should have 4 or more filledCards', () => {
      const aiApply = PREVIEW_STEPS[3]
      expect(aiApply.formState.filledCards.length).toBeGreaterThanOrEqual(4)
    })

    it('should have estimateAmount of 420000', () => {
      const aiApply = PREVIEW_STEPS[3]
      expect(aiApply.formState.estimateAmount).toBe(420000)
    })

    it('should have null highlightedCard', () => {
      const aiApply = PREVIEW_STEPS[3]
      expect(aiApply.formState.highlightedCard).toBeNull()
    })
  })

  describe('COMPLETE step', () => {
    it('should have all buttons with applied status', () => {
      const complete = PREVIEW_STEPS[4]
      expect(complete.aiPanelState.buttons).toHaveLength(4)
      for (const button of complete.aiPanelState.buttons) {
        expect(button.status).toBe('applied')
      }
    })

    it('should have 4 or more filledCards', () => {
      const complete = PREVIEW_STEPS[4]
      expect(complete.formState.filledCards.length).toBeGreaterThanOrEqual(4)
    })

    it('should have null highlightedCard', () => {
      const complete = PREVIEW_STEPS[4]
      expect(complete.formState.highlightedCard).toBeNull()
    })

    it('should have estimateAmount of 420000', () => {
      const complete = PREVIEW_STEPS[4]
      expect(complete.formState.estimateAmount).toBe(420000)
    })
  })
})
