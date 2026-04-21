/**
 * T-DASH3-M1-03 + M2-01 — AiPanelContainer 단위 테스트
 *
 * TC
 *  - TC-DASH3-INT-GRID:     AiPanel 380px 고정 + border-r + bg-black/40 (M1-03)
 *  - TC-DASH3-INT-AIPANEL:  자식 7 컴포넌트 주입 검증 (M2-01)
 *
 * REQ
 *  - REQ-DASH3-050 (AiPanel 380px 고정)
 *  - REQ-DASH-003  (outer shell)
 *  - REQ-DASH-007  (접근성)
 *  - REQ-DASH3-003 (AiPanel 자식 컴포넌트 조립)
 *  - REQ-DASH3-020 (#1 fake-typing 통합)
 *  - REQ-DASH3-021 (#3 button-press 자동 트리거)
 *
 * 범위
 *  - shell 레이아웃 + aria-label 검증 (M1-03 유지)
 *  - 자식 7 컴포넌트 렌더 검증 (M2-01)
 *    * AiTabBar (role="tablist")
 *    * AiInputArea (role="textbox", textValue 주입 via useFakeTyping)
 *    * AiExtractButton (state, pressTriggerAt)
 *    * AiWarningBadges (warnings 있을 때만)
 *    * AiResultButtons (role="group") + AiButtonItem
 *    * AiExtractJsonViewer (기본 접힘)
 *    * 헤더에 step.label 표시
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { AiPanelContainer } from '@/components/dashboard-preview/ai-register-main/ai-panel'
import { PREVIEW_MOCK_DATA } from '@/lib/mock-data'
import { PREVIEW_STEPS } from '@/lib/preview-steps'

const INITIAL_STEP = PREVIEW_STEPS[0]!
const AI_APPLY_STEP = PREVIEW_STEPS[3]!

// ---------------------------------------------------------------------------
// M1-03 — shell 레이아웃
// ---------------------------------------------------------------------------

describe('AiPanelContainer shell (M1-03)', () => {
  it('renders with aria-label "AI 화물 등록 패널"', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    expect(screen.getByLabelText('AI 화물 등록 패널')).toBeInTheDocument()
  })

  it('renders as <aside> landmark', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const aside = screen.getByLabelText('AI 화물 등록 패널')
    expect(aside.tagName).toBe('ASIDE')
  })

  it('has w-[380px] fixed width + flex-shrink-0', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const aside = screen.getByLabelText('AI 화물 등록 패널')
    expect(aside).toHaveClass('w-[380px]')
    expect(aside).toHaveClass('flex-shrink-0')
  })

  it('has border-r border-white/10 + bg-black/40 palette', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const aside = screen.getByLabelText('AI 화물 등록 패널')
    expect(aside).toHaveClass('border-r')
    expect(aside).toHaveClass('border-white/10')
    expect(aside).toHaveClass('bg-black/40')
  })

  it('uses flex flex-col overflow-hidden (vertical stacking)', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const aside = screen.getByLabelText('AI 화물 등록 패널')
    expect(aside).toHaveClass('flex')
    expect(aside).toHaveClass('flex-col')
    expect(aside).toHaveClass('overflow-hidden')
  })
})

// ---------------------------------------------------------------------------
// M2-01 — 자식 컴포넌트 주입
// ---------------------------------------------------------------------------

describe('AiPanelContainer 자식 주입 (M2-01)', () => {
  it('AiTabBar 렌더 (role="tablist" + "AI 입력 타입 선택")', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const tablist = screen.getByRole('tablist', { name: 'AI 입력 타입 선택' })
    expect(tablist).toBeInTheDocument()
  })

  it('AiInputArea 렌더 (role="textbox" + aria-readonly)', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const textbox = screen.getByRole('textbox', { name: 'AI 입력 영역 (데모)' })
    expect(textbox).toHaveAttribute('aria-readonly', 'true')
  })

  it('AiExtractButton 렌더 (INITIAL → idle/"추출하기")', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const button = screen.getByRole('button', { name: '추출하기' })
    expect(button).toHaveAttribute('data-state', 'idle')
  })

  it('AiResultButtons 4 카테고리 role="group" 렌더', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    // 카테고리 헤더는 idle/loading 상태에서도 렌더 (buttons 는 미노출)
    expect(screen.getByRole('group', { name: /AI 추출 결과 — 상차지/ })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /AI 추출 결과 — 하차지/ })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /AI 추출 결과 — 화물\/차량/ })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /AI 추출 결과 — 운임/ })).toBeInTheDocument()
  })

  it('AI_APPLY Step 에서 AiButtonItem (renderButton) 주입 확인', () => {
    render(
      <AiPanelContainer
        step={AI_APPLY_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    // AI_APPLY 에서는 extractState=resultReady → AiButtonItem 렌더
    // AiButtonItem 은 data-testid="ai-button-item-{id}" 속성을 갖는다.
    const firstButton = screen.getByTestId('ai-button-item-btn-departure-address1')
    expect(firstButton).toBeInTheDocument()
    expect(firstButton).toHaveAttribute('data-group-id', 'departure')
  })

  it('AiWarningBadges: warnings 가 빈 배열이면 미렌더', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    // PREVIEW_MOCK_DATA.aiResult.warnings === [] 이므로 role="list" 미렌더
    expect(screen.queryByRole('list', { name: 'AI 추출 경고' })).not.toBeInTheDocument()
  })

  it('AiWarningBadges: warnings 주입 시 렌더', () => {
    const dataWithWarnings = {
      ...PREVIEW_MOCK_DATA.aiResult,
      warnings: ['경고 예시: 상차지 확인 필요'] as readonly string[],
    }
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={dataWithWarnings}
      />,
    )

    const list = screen.getByRole('list', { name: 'AI 추출 경고' })
    expect(list).toBeInTheDocument()
    expect(screen.getByText(/경고 예시: 상차지 확인 필요/)).toBeInTheDocument()
  })

  it('AiExtractJsonViewer 기본 접힘 (aria-expanded="false")', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const toggle = screen.getByRole('button', { name: /추출 결과 JSON/ })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('헤더에 step.label 표시 (INITIAL → "초기 화면")', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    expect(screen.getByText('초기 화면')).toBeInTheDocument()
  })

  it('헤더에 step.label 표시 (AI_APPLY → "폼 자동 입력")', () => {
    render(
      <AiPanelContainer
        step={AI_APPLY_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    expect(screen.getByText('폼 자동 입력')).toBeInTheDocument()
  })

  it('AI 화물 등록 제목 영역 표시', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    expect(screen.getByText('AI 화물 등록')).toBeInTheDocument()
  })
})
