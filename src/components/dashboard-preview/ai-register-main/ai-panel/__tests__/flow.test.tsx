/**
 * T-DASH3-M2-09 — AI Panel 4-Step 플로우 통합 검증
 *
 * TC
 *  - TC-DASH3-INT-FLOW-AIPANEL: INITIAL → AI_INPUT → AI_EXTRACT → AI_APPLY
 *    각 Step 에서 AiPanelContainer 가 올바른 자식 상태로 변화하는지 검증.
 *
 * REQ
 *  - REQ-DASH3-010 (4단계 흐름)
 *  - REQ-DASH3-011 (Step 스냅샷)
 *  - REQ-DASH3-020 (#1 fake-typing, AI_INPUT 에서 active=true)
 *  - REQ-DASH3-021 (#3 button-press, AI_EXTRACT 에서 자동 press)
 *
 * 범위
 *  - 각 Step 객체(`PREVIEW_STEPS.find(s => s.id === 'INITIAL')` 등)를
 *    `<AiPanelContainer step={...} />` 에 주입한 상태에서
 *    AiTabBar / AiInputArea / AiExtractButton / AiResultButtons 의
 *    렌더 결과가 Step 스냅샷과 일치하는지 확인.
 *  - OrderForm fill-in 동기화(M3 범위)는 여기서 다루지 않는다.
 */

import { render, screen, act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AiPanelContainer } from '@/components/dashboard-preview/ai-register-main/ai-panel'
import { PREVIEW_MOCK_DATA } from '@/lib/mock-data'
import { PREVIEW_STEPS } from '@/lib/preview-steps'
import type { StepId } from '@/lib/preview-steps'

// ---------------------------------------------------------------------------
// matchMedia helper (prefers-reduced-motion: no-preference)
// ---------------------------------------------------------------------------

function mockMatchMedia(reducedMotion: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches:
          query === '(prefers-reduced-motion: reduce)' ? reducedMotion : false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  })
}

function findStep(id: StepId) {
  const step = PREVIEW_STEPS.find((s) => s.id === id)
  if (!step) throw new Error(`Step ${id} not found`)
  return step
}

beforeEach(() => {
  mockMatchMedia(false)
})

afterEach(() => {
  vi.useRealTimers()
})

// ---------------------------------------------------------------------------
// TC-DASH3-INT-FLOW-AIPANEL
// ---------------------------------------------------------------------------

describe('AI Panel 플로우 — TC-DASH3-INT-FLOW-AIPANEL', () => {
  // -------------------------------------------------------------------------
  // INITIAL Step
  // -------------------------------------------------------------------------
  describe('INITIAL Step — 초기 화면', () => {
    const step = findStep('INITIAL')

    it('step.label "초기 화면" 헤더 표시', () => {
      render(
        <AiPanelContainer
          step={step}
          aiInput={PREVIEW_MOCK_DATA.aiInput}
          aiResult={PREVIEW_MOCK_DATA.aiResult}
        />,
      )
      expect(screen.getByText('초기 화면')).toBeInTheDocument()
    })

    it('textarea placeholder 표시 (typing 비활성 → 빈 text)', () => {
      render(
        <AiPanelContainer
          step={step}
          aiInput={PREVIEW_MOCK_DATA.aiInput}
          aiResult={PREVIEW_MOCK_DATA.aiResult}
        />,
      )
      // active=false 이므로 text 비어있고 placeholder 노출
      expect(screen.getByText(/카톡 메시지나 오더 내용을 붙여넣기/)).toBeInTheDocument()
    })

    it('AiExtractButton idle 상태 ("추출하기")', () => {
      render(
        <AiPanelContainer
          step={step}
          aiInput={PREVIEW_MOCK_DATA.aiInput}
          aiResult={PREVIEW_MOCK_DATA.aiResult}
        />,
      )
      const button = screen.getByRole('button', { name: '추출하기' })
      expect(button).toHaveAttribute('data-state', 'idle')
      expect(button).not.toBeDisabled()
    })

    it('카테고리 버튼(AiButtonItem) 미렌더 (extractState=idle)', () => {
      render(
        <AiPanelContainer
          step={step}
          aiInput={PREVIEW_MOCK_DATA.aiInput}
          aiResult={PREVIEW_MOCK_DATA.aiResult}
        />,
      )
      // extractState=idle → showButtons=false → ai-button-item-* 미렌더
      expect(
        screen.queryByTestId('ai-button-item-btn-departure-address1'),
      ).not.toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // AI_INPUT Step
  // -------------------------------------------------------------------------
  describe('AI_INPUT Step — 메시지 입력', () => {
    const step = findStep('AI_INPUT')

    it('step.label "메시지 입력" 헤더 표시', () => {
      render(
        <AiPanelContainer
          step={step}
          aiInput={PREVIEW_MOCK_DATA.aiInput}
          aiResult={PREVIEW_MOCK_DATA.aiResult}
        />,
      )
      expect(screen.getByText('메시지 입력')).toBeInTheDocument()
    })

    it('typing 활성 → fake-typing 진행 후 최종 텍스트 도달', () => {
      vi.useFakeTimers()
      render(
        <AiPanelContainer
          step={step}
          aiInput={PREVIEW_MOCK_DATA.aiInput}
          aiResult={PREVIEW_MOCK_DATA.aiResult}
        />,
      )

      // fake-typing 은 useFakeTyping hook 의 기본 1500ms 에 완료된다.
      act(() => {
        vi.advanceTimersByTime(2000)
      })

      // 최종 텍스트가 렌더되는지 확인 (textValue 앞 일부 매칭)
      const textbox = screen.getByRole('textbox')
      expect(textbox.textContent ?? '').toContain('서울 강남구 물류센터')
    })

    it('AiExtractButton idle 유지', () => {
      render(
        <AiPanelContainer
          step={step}
          aiInput={PREVIEW_MOCK_DATA.aiInput}
          aiResult={PREVIEW_MOCK_DATA.aiResult}
        />,
      )
      const button = screen.getByRole('button', { name: '추출하기' })
      expect(button).toHaveAttribute('data-state', 'idle')
    })
  })

  // -------------------------------------------------------------------------
  // AI_EXTRACT Step
  // -------------------------------------------------------------------------
  describe('AI_EXTRACT Step — AI 분석', () => {
    const step = findStep('AI_EXTRACT')

    it('step.label "AI 분석" 헤더 표시', () => {
      render(
        <AiPanelContainer
          step={step}
          aiInput={PREVIEW_MOCK_DATA.aiInput}
          aiResult={PREVIEW_MOCK_DATA.aiResult}
        />,
      )
      expect(screen.getByText('AI 분석')).toBeInTheDocument()
    })

    it('AiExtractButton loading 상태 + spinner 렌더', () => {
      render(
        <AiPanelContainer
          step={step}
          aiInput={PREVIEW_MOCK_DATA.aiInput}
          aiResult={PREVIEW_MOCK_DATA.aiResult}
        />,
      )
      const button = screen.getByRole('button', { name: '추출 중...' })
      expect(button).toHaveAttribute('data-state', 'loading')
      expect(button).toBeDisabled()
      // spinner 가 렌더되어야 한다.
      expect(screen.getByTestId('extract-spinner')).toBeInTheDocument()
    })

    it('#3 button-press 자동 트리거 → data-pressed=true 일시 전환', () => {
      vi.useFakeTimers()
      render(
        <AiPanelContainer
          step={step}
          aiInput={PREVIEW_MOCK_DATA.aiInput}
          aiResult={PREVIEW_MOCK_DATA.aiResult}
        />,
      )

      const button = screen.getByRole('button', { name: '추출 중...' })
      // 초기 data-pressed="false"
      expect(button).toHaveAttribute('data-pressed', 'false')

      // pressTriggerAt=0 이므로 즉시 다음 tick 에 pressed=true
      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(button).toHaveAttribute('data-pressed', 'true')

      // 150ms 후 복귀
      act(() => {
        vi.advanceTimersByTime(150)
      })
      expect(button).toHaveAttribute('data-pressed', 'false')
    })

    it('AI_EXTRACT: 카테고리 버튼 여전히 미렌더 (loading 상태)', () => {
      render(
        <AiPanelContainer
          step={step}
          aiInput={PREVIEW_MOCK_DATA.aiInput}
          aiResult={PREVIEW_MOCK_DATA.aiResult}
        />,
      )
      expect(
        screen.queryByTestId('ai-button-item-btn-departure-address1'),
      ).not.toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // AI_APPLY Step
  // -------------------------------------------------------------------------
  describe('AI_APPLY Step — 폼 자동 입력', () => {
    const step = findStep('AI_APPLY')

    it('step.label "폼 자동 입력" 헤더 표시', () => {
      render(
        <AiPanelContainer
          step={step}
          aiInput={PREVIEW_MOCK_DATA.aiInput}
          aiResult={PREVIEW_MOCK_DATA.aiResult}
        />,
      )
      expect(screen.getByText('폼 자동 입력')).toBeInTheDocument()
    })

    it('AiExtractButton resultReady 상태 ("재추출")', () => {
      render(
        <AiPanelContainer
          step={step}
          aiInput={PREVIEW_MOCK_DATA.aiInput}
          aiResult={PREVIEW_MOCK_DATA.aiResult}
        />,
      )
      const button = screen.getByRole('button', { name: '재추출' })
      expect(button).toHaveAttribute('data-state', 'resultReady')
      expect(button).toBeDisabled()
    })

    it('카테고리 버튼(AiButtonItem) 4 카테고리 모두 렌더', () => {
      render(
        <AiPanelContainer
          step={step}
          aiInput={PREVIEW_MOCK_DATA.aiInput}
          aiResult={PREVIEW_MOCK_DATA.aiResult}
        />,
      )

      // departure 카테고리 2 버튼
      expect(
        screen.getByTestId('ai-button-item-btn-departure-address1'),
      ).toBeInTheDocument()
      expect(
        screen.getByTestId('ai-button-item-btn-departure-datetime'),
      ).toBeInTheDocument()

      // destination 카테고리 1 버튼
      expect(
        screen.getByTestId('ai-button-item-btn-destination-address1'),
      ).toBeInTheDocument()

      // cargo 카테고리 2 버튼
      expect(
        screen.getByTestId('ai-button-item-btn-cargo-vehicleType'),
      ).toBeInTheDocument()
      expect(
        screen.getByTestId('ai-button-item-btn-cargo-cargoName'),
      ).toBeInTheDocument()

      // fare 카테고리 1 버튼
      expect(
        screen.getByTestId('ai-button-item-btn-fare-amount'),
      ).toBeInTheDocument()
    })

    it('카테고리 버튼 group-id 속성이 올바른 카테고리로 매핑', () => {
      render(
        <AiPanelContainer
          step={step}
          aiInput={PREVIEW_MOCK_DATA.aiInput}
          aiResult={PREVIEW_MOCK_DATA.aiResult}
        />,
      )
      expect(
        screen.getByTestId('ai-button-item-btn-departure-address1'),
      ).toHaveAttribute('data-group-id', 'departure')
      expect(
        screen.getByTestId('ai-button-item-btn-destination-address1'),
      ).toHaveAttribute('data-group-id', 'destination')
      expect(
        screen.getByTestId('ai-button-item-btn-cargo-vehicleType'),
      ).toHaveAttribute('data-group-id', 'cargo')
      expect(
        screen.getByTestId('ai-button-item-btn-fare-amount'),
      ).toHaveAttribute('data-group-id', 'fare')
    })
  })

  // -------------------------------------------------------------------------
  // Step 전환 일관성 — 자식 DOM 은 Step 변경만으로 재생성되지 않는다 (flicker 방지)
  // -------------------------------------------------------------------------
  describe('Step 전환 시 일관성 (flicker 방지)', () => {
    it('INITIAL → AI_EXTRACT 전환 시 AiTabBar tablist 가 그대로 유지', () => {
      const { rerender } = render(
        <AiPanelContainer
          step={findStep('INITIAL')}
          aiInput={PREVIEW_MOCK_DATA.aiInput}
          aiResult={PREVIEW_MOCK_DATA.aiResult}
        />,
      )
      expect(
        screen.getByRole('tablist', { name: 'AI 입력 타입 선택' }),
      ).toBeInTheDocument()

      rerender(
        <AiPanelContainer
          step={findStep('AI_EXTRACT')}
          aiInput={PREVIEW_MOCK_DATA.aiInput}
          aiResult={PREVIEW_MOCK_DATA.aiResult}
        />,
      )
      // tablist 는 Step 전환 후에도 존재
      expect(
        screen.getByRole('tablist', { name: 'AI 입력 타입 선택' }),
      ).toBeInTheDocument()
    })

    it('INITIAL → AI_APPLY: 카테고리 버튼이 신규 렌더로 전환', () => {
      const { rerender } = render(
        <AiPanelContainer
          step={findStep('INITIAL')}
          aiInput={PREVIEW_MOCK_DATA.aiInput}
          aiResult={PREVIEW_MOCK_DATA.aiResult}
        />,
      )
      // INITIAL 에서는 AiButtonItem 미렌더
      expect(
        screen.queryByTestId('ai-button-item-btn-departure-address1'),
      ).not.toBeInTheDocument()

      rerender(
        <AiPanelContainer
          step={findStep('AI_APPLY')}
          aiInput={PREVIEW_MOCK_DATA.aiInput}
          aiResult={PREVIEW_MOCK_DATA.aiResult}
        />,
      )
      // AI_APPLY 에서는 렌더됨
      expect(
        screen.getByTestId('ai-button-item-btn-departure-address1'),
      ).toBeInTheDocument()
    })

    it('AI_INPUT → AI_EXTRACT: 버튼 idle → loading 전환', () => {
      const { rerender } = render(
        <AiPanelContainer
          step={findStep('AI_INPUT')}
          aiInput={PREVIEW_MOCK_DATA.aiInput}
          aiResult={PREVIEW_MOCK_DATA.aiResult}
        />,
      )
      expect(screen.getByRole('button', { name: '추출하기' })).toBeInTheDocument()

      rerender(
        <AiPanelContainer
          step={findStep('AI_EXTRACT')}
          aiInput={PREVIEW_MOCK_DATA.aiInput}
          aiResult={PREVIEW_MOCK_DATA.aiResult}
        />,
      )
      expect(screen.getByRole('button', { name: '추출 중...' })).toBeInTheDocument()
      expect(screen.getByTestId('extract-spinner')).toBeInTheDocument()
    })
  })
})
