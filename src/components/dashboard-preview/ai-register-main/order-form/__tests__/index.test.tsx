/**
 * T-DASH3-M1-03 + M3-01 — OrderFormContainer 단위 테스트
 *
 * TC
 *  - TC-DASH3-INT-COLS:    3-column grid (Col 1/2/3) + space-y-4 + landing 팔레트 (M1-03)
 *  - TC-DASH3-INT-ORDERFORM: 자식 9 컴포넌트 주입 검증 (M3-01)
 *
 * REQ
 *  - REQ-DASH3-053 (OrderForm 3-column grid)
 *  - REQ-DASH-003 (outer shell)
 *  - REQ-DASH-007 (접근성)
 *  - REQ-DASH3-001 / 003~005 / 050 (M3-01 — 자식 주입)
 *  - REQ-DASH3-041 / 042 / 043 (AI_APPLY 2단 구조)
 *
 * 범위
 *  - M1-03 shell 레이아웃
 *  - M3-01: 자식 9개 (CompanyManager + Location×2 + DistanceInfo + DateTime×2 + Cargo +
 *    TransportOption + Estimate + Settlement) 의 3-column 배치 검증.
 *  - AI_APPLY Step 에서 partialBeat / allBeat 기반 active / trigger 가 자식에 전달되는지 검증.
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { OrderFormContainer } from '@/components/dashboard-preview/ai-register-main/order-form'
import { PREVIEW_MOCK_DATA } from '@/lib/mock-data'
import { PREVIEW_STEPS } from '@/lib/preview-steps'

const INITIAL_STEP = PREVIEW_STEPS[0]!
const AI_INPUT_STEP = PREVIEW_STEPS[1]!
const AI_EXTRACT_STEP = PREVIEW_STEPS[2]!
const AI_APPLY_STEP = PREVIEW_STEPS[3]!

// ===========================================================================
// M1-03 — shell 레이아웃 (기존 검증 유지)
// ===========================================================================

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

// ===========================================================================
// M3-01 — 자식 9개 주입 (TC-DASH3-INT-ORDERFORM)
// ===========================================================================

describe('OrderFormContainer 자식 주입 (M3-01 — TC-DASH3-INT-ORDERFORM)', () => {
  // -----------------------------------------------------------------
  // Col 1
  // -----------------------------------------------------------------
  describe('Col 1 — CompanyManager + LocationForm × 2', () => {
    it('CompanyManagerSection 을 Col 1 에 배치한다', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      const col1 = screen.getByTestId('col-1')
      const companyManager = screen.getByTestId('company-manager-section')
      expect(col1).toContainElement(companyManager)
    })

    it('LocationForm (pickup) 을 Col 1 에 배치한다', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      const col1 = screen.getByTestId('col-1')
      const pickup = screen.getByTestId('location-form-pickup')
      expect(col1).toContainElement(pickup)
    })

    it('LocationForm (delivery) 을 Col 1 에 배치한다', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      const col1 = screen.getByTestId('col-1')
      const delivery = screen.getByTestId('location-form-delivery')
      expect(col1).toContainElement(delivery)
    })
  })

  // -----------------------------------------------------------------
  // Col 2
  // -----------------------------------------------------------------
  describe('Col 2 — DistanceInfo + DateTime × 2 + Cargo', () => {
    it('EstimateDistanceInfo 를 Col 2 에 배치한다', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      const col2 = screen.getByTestId('col-2')
      const distanceInfo = screen.getByTestId('estimate-distance-info')
      expect(col2).toContainElement(distanceInfo)
    })

    it('DateTimeCard (pickup) 을 Col 2 에 배치한다', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      const col2 = screen.getByTestId('col-2')
      const pickupDT = screen.getByTestId('datetime-card-pickup')
      expect(col2).toContainElement(pickupDT)
    })

    it('DateTimeCard (delivery) 를 Col 2 에 배치한다', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      const col2 = screen.getByTestId('col-2')
      const deliveryDT = screen.getByTestId('datetime-card-delivery')
      expect(col2).toContainElement(deliveryDT)
    })

    it('CargoInfoForm 을 Col 2 에 배치한다', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      const col2 = screen.getByTestId('col-2')
      const cargo = screen.getByTestId('cargo-info-form')
      expect(col2).toContainElement(cargo)
    })
  })

  // -----------------------------------------------------------------
  // Col 3
  // -----------------------------------------------------------------
  describe('Col 3 — TransportOption + Estimate + Settlement', () => {
    it('TransportOptionCard 를 Col 3 에 배치한다', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      const col3 = screen.getByTestId('col-3')
      const transport = screen.getByTestId('transport-option-card')
      expect(col3).toContainElement(transport)
    })

    it('EstimateInfoCard 를 Col 3 에 배치한다', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      const col3 = screen.getByTestId('col-3')
      const estimate = screen.getByTestId('estimate-info-card')
      expect(col3).toContainElement(estimate)
    })

    it('SettlementSection 을 Col 3 에 배치한다', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      const col3 = screen.getByTestId('col-3')
      const settlement = screen.getByTestId('settlement-section')
      expect(col3).toContainElement(settlement)
    })
  })

  // -----------------------------------------------------------------
  // 총 9개 자식 렌더 확인
  // -----------------------------------------------------------------
  describe('총 9 자식 컴포넌트 렌더', () => {
    it('INITIAL Step 에서 9 자식 컴포넌트 전부 노출', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      expect(screen.getByTestId('company-manager-section')).toBeInTheDocument()
      expect(screen.getByTestId('location-form-pickup')).toBeInTheDocument()
      expect(screen.getByTestId('location-form-delivery')).toBeInTheDocument()
      expect(screen.getByTestId('estimate-distance-info')).toBeInTheDocument()
      expect(screen.getByTestId('datetime-card-pickup')).toBeInTheDocument()
      expect(screen.getByTestId('datetime-card-delivery')).toBeInTheDocument()
      expect(screen.getByTestId('cargo-info-form')).toBeInTheDocument()
      expect(screen.getByTestId('transport-option-card')).toBeInTheDocument()
      expect(screen.getByTestId('estimate-info-card')).toBeInTheDocument()
      expect(screen.getByTestId('settlement-section')).toBeInTheDocument()
    })

    it('AI_APPLY Step 에서도 9 자식 컴포넌트 전부 노출 (Step 전환에 관계없이)', () => {
      render(
        <OrderFormContainer step={AI_APPLY_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      expect(screen.getByTestId('company-manager-section')).toBeInTheDocument()
      expect(screen.getByTestId('location-form-pickup')).toBeInTheDocument()
      expect(screen.getByTestId('location-form-delivery')).toBeInTheDocument()
      expect(screen.getByTestId('estimate-distance-info')).toBeInTheDocument()
      expect(screen.getByTestId('datetime-card-pickup')).toBeInTheDocument()
      expect(screen.getByTestId('datetime-card-delivery')).toBeInTheDocument()
      expect(screen.getByTestId('cargo-info-form')).toBeInTheDocument()
      expect(screen.getByTestId('transport-option-card')).toBeInTheDocument()
      expect(screen.getByTestId('estimate-info-card')).toBeInTheDocument()
      expect(screen.getByTestId('settlement-section')).toBeInTheDocument()
    })
  })
})

// ===========================================================================
// M3-01 — AI_APPLY 2단 구조 (partialBeat / allBeat) 트리거 분배
// ===========================================================================

describe('OrderFormContainer AI_APPLY 2단 구조 (M3-01 / M3-11)', () => {
  // -----------------------------------------------------------------
  // EstimateDistanceInfo visible
  // -----------------------------------------------------------------
  describe('EstimateDistanceInfo visible 분기', () => {
    it('INITIAL: visible=false → "측정 전" placeholder', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      const distanceInfo = screen.getByTestId('estimate-distance-info')
      expect(distanceInfo).toHaveAttribute('data-visible', 'false')
      expect(distanceInfo).toHaveTextContent('측정 전')
    })

    it('AI_INPUT: visible=false', () => {
      render(
        <OrderFormContainer step={AI_INPUT_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )
      expect(screen.getByTestId('estimate-distance-info')).toHaveAttribute(
        'data-visible',
        'false',
      )
    })

    it('AI_EXTRACT: visible=false', () => {
      render(
        <OrderFormContainer step={AI_EXTRACT_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )
      expect(screen.getByTestId('estimate-distance-info')).toHaveAttribute(
        'data-visible',
        'false',
      )
    })

    it('AI_APPLY: visible=true → 수치 표시', () => {
      render(
        <OrderFormContainer step={AI_APPLY_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )

      const distanceInfo = screen.getByTestId('estimate-distance-info')
      expect(distanceInfo).toHaveAttribute('data-visible', 'true')
      expect(distanceInfo).not.toHaveTextContent('측정 전')
    })
  })

  // -----------------------------------------------------------------
  // EstimateInfoCard / SettlementSection active (allBeat)
  // -----------------------------------------------------------------
  describe('Estimate / Settlement active (allBeat)', () => {
    it('INITIAL: EstimateInfoCard data-active="false"', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )
      expect(screen.getByTestId('estimate-info-card')).toHaveAttribute(
        'data-active',
        'false',
      )
    })

    it('INITIAL: SettlementSection data-active="false"', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )
      expect(screen.getByTestId('settlement-section')).toHaveAttribute(
        'data-active',
        'false',
      )
    })

    it('AI_APPLY: EstimateInfoCard data-active="true" (allBeat 존재)', () => {
      render(
        <OrderFormContainer step={AI_APPLY_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )
      expect(screen.getByTestId('estimate-info-card')).toHaveAttribute(
        'data-active',
        'true',
      )
    })

    it('AI_APPLY: SettlementSection data-active="true" (allBeat 존재)', () => {
      render(
        <OrderFormContainer step={AI_APPLY_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )
      expect(screen.getByTestId('settlement-section')).toHaveAttribute(
        'data-active',
        'true',
      )
    })
  })

  // -----------------------------------------------------------------
  // TransportOption (allBeat stroke)
  // -----------------------------------------------------------------
  describe('TransportOption allBeat stroke', () => {
    it('INITIAL: option stroke 애니 비활성 (data-animating=false)', () => {
      render(
        <OrderFormContainer step={INITIAL_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )
      // 'direct' 옵션은 checked=true
      const direct = screen.getByTestId('transport-option-direct')
      expect(direct).toHaveAttribute('data-checked', 'true')
      // polyline data-animating 속성을 확인 (allBeat 미활성)
      const polyline = direct.querySelector('polyline')
      expect(polyline).toHaveAttribute('data-animating', 'false')
    })

    it('AI_APPLY: option stroke 애니 활성 (direct 는 strokeTargets 에 포함되어 animating=true)', () => {
      render(
        <OrderFormContainer step={AI_APPLY_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )
      const direct = screen.getByTestId('transport-option-direct')
      const polyline = direct.querySelector('polyline')
      // strokeTargets 에 'direct' 포함 + options.direct=true → animating=true
      expect(polyline).toHaveAttribute('data-animating', 'true')
    })

    it('AI_APPLY: forklift 도 strokeTargets 에 포함 + checked=true → animating=true', () => {
      render(
        <OrderFormContainer step={AI_APPLY_STEP} formData={PREVIEW_MOCK_DATA.formData} />,
      )
      const forklift = screen.getByTestId('transport-option-forklift')
      const polyline = forklift.querySelector('polyline')
      expect(polyline).toHaveAttribute('data-animating', 'true')
    })
  })
})
