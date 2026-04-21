/**
 * T-DASH3-M1-04 — StepIndicator Phase 3 4-dot 동적 렌더링 테스트
 *
 * TC
 *  - TC-DASH3-UNIT-IND: totalSteps 기반 동적 dot 렌더 (Phase 3 4개, legacy 5개 호환)
 *
 * REQ
 *  - REQ-DASH-014 (Step Indicator 4-dot 전환, Phase 3)
 *  - REQ-DASH3-052 (COMPLETE 제거 = 4단계)
 *
 * 범위
 *  - Phase 3 기본 4-dot 케이스 검증
 *  - steps.length 파라미터 변경 시 동적 반영 확인
 *  - Phase 1/2 backward compat 5-dot 은 LEGACY 전용 (legacy/step-indicator.test.tsx 에 유지)
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { StepIndicator } from '@/components/dashboard-preview/step-indicator'
import { PREVIEW_STEPS } from '@/lib/preview-steps'

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('StepIndicator — Phase 3 dynamic dot rendering', () => {
  describe('TC-DASH3-UNIT-IND: 4-dot by default (Phase 3)', () => {
    it('renders 4 dots when totalSteps=4', () => {
      render(
        <StepIndicator totalSteps={4} currentStep={0} onStepClick={vi.fn()} />,
      )
      expect(screen.getAllByRole('tab')).toHaveLength(4)
    })

    it('renders exactly PREVIEW_STEPS.length dots (integration with Phase 3 4-step)', () => {
      render(
        <StepIndicator
          totalSteps={PREVIEW_STEPS.length}
          currentStep={0}
          onStepClick={vi.fn()}
        />,
      )
      // Phase 3: PREVIEW_STEPS has 4 entries (INITIAL / AI_INPUT / AI_EXTRACT / AI_APPLY)
      expect(PREVIEW_STEPS).toHaveLength(4)
      expect(screen.getAllByRole('tab')).toHaveLength(4)
    })

    it('Phase 3 4-dot: aria-selected tracks currentStep=3 (AI_APPLY)', () => {
      render(
        <StepIndicator totalSteps={4} currentStep={3} onStepClick={vi.fn()} />,
      )
      const tabs = screen.getAllByRole('tab')
      expect(tabs[3]).toHaveAttribute('aria-selected', 'true')
      expect(tabs[0]).toHaveAttribute('aria-selected', 'false')
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false')
      expect(tabs[2]).toHaveAttribute('aria-selected', 'false')
    })

    it('Phase 3 4-dot: ArrowRight wraps from index 3 to index 0', () => {
      const onStepClick = vi.fn()
      render(
        <StepIndicator totalSteps={4} currentStep={3} onStepClick={onStepClick} />,
      )
      const tabs = screen.getAllByRole('tab')
      fireEvent.keyDown(tabs[3], { key: 'ArrowRight' })
      expect(onStepClick).toHaveBeenCalledWith(0)
    })

    it('Phase 3 4-dot: ArrowLeft wraps from index 0 to index 3', () => {
      const onStepClick = vi.fn()
      render(
        <StepIndicator totalSteps={4} currentStep={0} onStepClick={onStepClick} />,
      )
      const tabs = screen.getAllByRole('tab')
      fireEvent.keyDown(tabs[0], { key: 'ArrowLeft' })
      expect(onStepClick).toHaveBeenCalledWith(3)
    })
  })

  describe('TC-DASH3-UNIT-IND: totalSteps parameter drives rendering', () => {
    it('renders 3 dots when totalSteps=3', () => {
      render(
        <StepIndicator totalSteps={3} currentStep={0} onStepClick={vi.fn()} />,
      )
      expect(screen.getAllByRole('tab')).toHaveLength(3)
    })

    it('renders 6 dots when totalSteps=6', () => {
      render(
        <StepIndicator totalSteps={6} currentStep={0} onStepClick={vi.fn()} />,
      )
      expect(screen.getAllByRole('tab')).toHaveLength(6)
    })

    it('renders 0 dots when totalSteps=0 (defensive)', () => {
      render(
        <StepIndicator totalSteps={0} currentStep={0} onStepClick={vi.fn()} />,
      )
      expect(screen.queryAllByRole('tab')).toHaveLength(0)
    })
  })
})
