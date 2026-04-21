/**
 * T-DASH3-M1-03 — AiRegisterMain shell 단위 테스트
 *
 * TC
 *  - TC-DASH3-INT-GRID: AiPanel + OrderForm 2-col flex 쉘 구조
 *
 * REQ
 *  - REQ-DASH3-001 (AiRegisterMain 신규 컨테이너)
 *  - REQ-DASH3-050 (AiPanel 380px 고정)
 *  - REQ-DASH-003 (outer shell 구조)
 *  - REQ-DASH-007 (접근성 aria-label)
 *
 * 범위
 *  - shell 만 (자식 컴포넌트 미주입 상태에서도 구조 성립 검증).
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { AiRegisterMain } from '@/components/dashboard-preview/ai-register-main'
import { PREVIEW_MOCK_DATA } from '@/lib/mock-data'
import { PREVIEW_STEPS } from '@/lib/preview-steps'

const INITIAL_STEP = PREVIEW_STEPS[0]!

describe('AiRegisterMain shell', () => {
  describe('TC-DASH3-INT-GRID', () => {
    it('renders AiPanel + OrderForm 2-col flex container', () => {
      render(<AiRegisterMain step={INITIAL_STEP} mockData={PREVIEW_MOCK_DATA} />)

      const aiPanel = screen.getByLabelText('AI 화물 등록 패널')
      const orderForm = screen.getByLabelText('주문 등록 폼')

      expect(aiPanel).toBeInTheDocument()
      expect(orderForm).toBeInTheDocument()
    })

    it('outer container uses flex + min-h-[480px]', () => {
      const { container } = render(
        <AiRegisterMain step={INITIAL_STEP} mockData={PREVIEW_MOCK_DATA} />,
      )

      const outer = container.firstElementChild as HTMLElement | null
      expect(outer).not.toBeNull()
      expect(outer).toHaveClass('flex')
      expect(outer).toHaveClass('h-full')
      expect(outer).toHaveClass('min-h-[480px]')
    })

    it('AiPanel has w-[380px] width class (380px fixed)', () => {
      render(<AiRegisterMain step={INITIAL_STEP} mockData={PREVIEW_MOCK_DATA} />)

      const aiPanel = screen.getByLabelText('AI 화물 등록 패널')
      expect(aiPanel).toHaveClass('w-[380px]')
    })

    it('OrderForm flex-1 stretches to remaining space', () => {
      render(<AiRegisterMain step={INITIAL_STEP} mockData={PREVIEW_MOCK_DATA} />)

      const orderForm = screen.getByLabelText('주문 등록 폼')
      expect(orderForm).toHaveClass('flex-1')
    })

    it('both regions expose aria-label (accessibility)', () => {
      render(<AiRegisterMain step={INITIAL_STEP} mockData={PREVIEW_MOCK_DATA} />)

      // aria-label 존재 자체를 getByLabelText 로 확인했으므로, 여기서는 각 요소의 role/label 유지를 재확인.
      expect(screen.getByLabelText('AI 화물 등록 패널')).toBeInTheDocument()
      expect(screen.getByLabelText('주문 등록 폼')).toBeInTheDocument()
    })
  })
})
