/**
 * T-DASH3-M1-03 — AiPanelContainer shell 단위 테스트
 *
 * TC
 *  - TC-DASH3-INT-GRID: AiPanel 380px 고정 + border-r + bg-black/40
 *
 * REQ
 *  - REQ-DASH3-050 (AiPanel 380px 고정)
 *  - REQ-DASH-003 (outer shell)
 *  - REQ-DASH-007 (접근성)
 *
 * 범위
 *  - shell 만. 자식 컴포넌트는 M2 에서 주입.
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { AiPanelContainer } from '@/components/dashboard-preview/ai-register-main/ai-panel'
import { PREVIEW_MOCK_DATA } from '@/lib/mock-data'
import { PREVIEW_STEPS } from '@/lib/preview-steps'

const INITIAL_STEP = PREVIEW_STEPS[0]!

describe('AiPanelContainer shell', () => {
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
