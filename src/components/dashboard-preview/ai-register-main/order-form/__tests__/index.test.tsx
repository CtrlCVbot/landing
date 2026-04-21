/**
 * T-DASH3-M1-03 — OrderFormContainer shell 단위 테스트
 *
 * TC
 *  - TC-DASH3-INT-COLS: 3-column grid (Col 1/2/3) + space-y-4 + landing 팔레트
 *
 * REQ
 *  - REQ-DASH3-053 (OrderForm 3-column grid)
 *  - REQ-DASH-003 (outer shell)
 *  - REQ-DASH-007 (접근성)
 *
 * 범위
 *  - shell 만. 자식 컴포넌트는 M3 에서 주입.
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { OrderFormContainer } from '@/components/dashboard-preview/ai-register-main/order-form'
import { PREVIEW_MOCK_DATA } from '@/lib/mock-data'
import { PREVIEW_STEPS } from '@/lib/preview-steps'

const INITIAL_STEP = PREVIEW_STEPS[0]!

describe('OrderFormContainer shell', () => {
  describe('TC-DASH3-INT-COLS', () => {
    it('renders with aria-label "주문 등록 폼"', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      expect(screen.getByLabelText('주문 등록 폼')).toBeInTheDocument()
    })

    it('outer grid data-testid = order-form-grid', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      expect(screen.getByTestId('order-form-grid')).toBeInTheDocument()
    })

    it('applies exact 3-column grid classes (grid grid-cols-1 lg:grid-cols-3 gap-4)', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      const grid = screen.getByTestId('order-form-grid')
      expect(grid).toHaveClass('grid')
      expect(grid).toHaveClass('grid-cols-1')
      expect(grid).toHaveClass('lg:grid-cols-3')
      expect(grid).toHaveClass('gap-4')
    })

    it('grid container is flex-1 (fills remaining space)', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      const grid = screen.getByTestId('order-form-grid')
      expect(grid).toHaveClass('flex-1')
    })

    it('renders Col 1/2/3 with data-testid col-1, col-2, col-3', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      expect(screen.getByTestId('col-1')).toBeInTheDocument()
      expect(screen.getByTestId('col-2')).toBeInTheDocument()
      expect(screen.getByTestId('col-3')).toBeInTheDocument()
    })

    it('each column has space-y-4 + lg:col-span-1', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      for (const testId of ['col-1', 'col-2', 'col-3'] as const) {
        const col = screen.getByTestId(testId)
        expect(col).toHaveClass('space-y-4')
        expect(col).toHaveClass('lg:col-span-1')
      }
    })

    it('each column has data-col attribute for column ordinal', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      expect(screen.getByTestId('col-1')).toHaveAttribute('data-col', '1')
      expect(screen.getByTestId('col-2')).toHaveAttribute('data-col', '2')
      expect(screen.getByTestId('col-3')).toHaveAttribute('data-col', '3')
    })

    it('applies landing palette gradient (from-gray-900/50 to-gray-950/50)', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      const grid = screen.getByTestId('order-form-grid')
      expect(grid).toHaveClass('bg-gradient-to-br')
      expect(grid).toHaveClass('from-gray-900/50')
      expect(grid).toHaveClass('to-gray-950/50')
    })

    it('applies p-4 padding + overflow-auto', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      const grid = screen.getByTestId('order-form-grid')
      expect(grid).toHaveClass('p-4')
      expect(grid).toHaveClass('overflow-auto')
    })
  })
})
