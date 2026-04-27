/**
 * T-DASH3-M3-12 — OrderForm 4-Step 플로우 통합 검증
 *
 * TC
 *  - TC-DASH3-INT-FLOW-ORDERFORM:
 *    INITIAL → AI_INPUT → AI_EXTRACT → AI_APPLY 각 Step 에서
 *    OrderFormContainer 가 9개 자식을 올바른 상태 (active / visible / rolling / stroke) 로 렌더하는지 검증.
 *
 * REQ
 *  - REQ-DASH3-010 (4단계 흐름)
 *  - REQ-DASH3-011 (Step 스냅샷)
 *  - REQ-DASH3-041 (AI_APPLY 2단 구조 — partialBeat)
 *  - REQ-DASH3-042 (AI_APPLY 2단 구조 — allBeat)
 *  - REQ-DASH3-043 (AI_APPLY allBeat 구성: Transport 토글 / 자동배차 / 정산)
 *
 * 범위
 *  - 각 Step 을 `<OrderFormContainer step={...} />` 에 주입하고
 *    Col 1/2/3 자식의 렌더 상태가 Step 스냅샷과 일치하는지 검증.
 *  - INITIAL / AI_INPUT / AI_EXTRACT 는 fill-in/rolling 모두 비활성.
 *  - AI_APPLY 는 partialBeat (pickup/delivery/cargo fill-in active)
 *    + allBeat (Transport stroke / Estimate·Settlement rolling) 활성.
 *  - AiPanel fill-in 동기화는 ai-panel/flow.test.tsx 에서 다룸.
 */

import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { OrderFormContainer } from '@/components/dashboard-preview/ai-register-main/order-form'
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
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

// ---------------------------------------------------------------------------
// TC-DASH3-INT-FLOW-ORDERFORM — INITIAL
// ---------------------------------------------------------------------------

describe('OrderForm 플로우 — INITIAL (빈 폼)', () => {
  const step = findStep('INITIAL')

  describe('Col 1 — CompanyManager pre-filled + Location × 2 (active=false)', () => {
    it('CompanyManager pre-filled 배지 노출', () => {
      render(
        <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
      )
      expect(
        screen.getByTestId('company-manager-prefilled-badge'),
      ).toBeInTheDocument()
    })

    it('LocationForm(pickup) caret 비활성 — 추출 전 값은 숨김', () => {
      render(
        <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
      )
      const pickup = screen.getByTestId('location-form-pickup')
      // active=false → caret 미렌더
      expect(pickup.querySelector('[data-caret]')).toBeNull()
      expect(pickup).toHaveAttribute('data-revealed', 'false')
      expect(pickup).not.toHaveTextContent(PREVIEW_MOCK_DATA.formData.pickup.company)
      expect(pickup).toHaveTextContent('—')
    })

    it('LocationForm(delivery) caret 비활성 — 추출 전 값은 숨김', () => {
      render(
        <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
      )
      const delivery = screen.getByTestId('location-form-delivery')
      expect(delivery.querySelector('[data-caret]')).toBeNull()
      expect(delivery).toHaveAttribute('data-revealed', 'false')
      expect(delivery).not.toHaveTextContent(PREVIEW_MOCK_DATA.formData.delivery.company)
    })
  })

  describe('Col 2 — DistanceInfo "측정 전" + DateTime × 2 (active=false) + Cargo (active=false)', () => {
    it('DistanceInfo 는 "측정 전" placeholder', () => {
      render(
        <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
      )
      const distanceInfo = screen.getByTestId('estimate-distance-info')
      expect(distanceInfo).toHaveAttribute('data-visible', 'false')
      expect(distanceInfo).toHaveTextContent('측정 전')
    })

    it('DateTimeCard(pickup) caret 비활성', () => {
      const { container } = render(
        <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
      )
      const pickupDT = container.querySelector(
        '[data-testid="datetime-card-pickup"]',
      )!
      expect(pickupDT.querySelector('[data-caret]')).toBeNull()
    })

    it('DateTimeCard(delivery) caret 비활성', () => {
      const { container } = render(
        <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
      )
      const deliveryDT = container.querySelector(
        '[data-testid="datetime-card-delivery"]',
      )!
      expect(deliveryDT.querySelector('[data-caret]')).toBeNull()
    })

    it('CargoInfoForm caret 비활성', () => {
      const { container } = render(
        <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
      )
      const cargo = container.querySelector('[data-testid="cargo-info-form"]')!
      expect(cargo.querySelector('[data-caret]')).toBeNull()
    })
  })

  describe('Col 3 — TransportOption stroke 미적용 + Estimate/Settlement active=false', () => {
    it('TransportOption stroke 애니 비활성 (모든 polyline data-animating=false)', () => {
      const { container } = render(
        <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
      )
      const polylines = container.querySelectorAll(
        '[data-testid^="transport-option-"] polyline',
      )
      for (const polyline of polylines) {
        expect(polyline).toHaveAttribute('data-animating', 'false')
      }
    })

    it('EstimateInfoCard data-active="false"', () => {
      render(
        <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
      )
      expect(screen.getByTestId('estimate-info-card')).toHaveAttribute(
        'data-active',
        'false',
      )
    })

    it('SettlementSection data-active="false"', () => {
      render(
        <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
      )
      expect(screen.getByTestId('settlement-section')).toHaveAttribute(
        'data-active',
        'false',
      )
    })
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-INT-FLOW-ORDERFORM — AI_INPUT
// ---------------------------------------------------------------------------

describe('OrderForm 플로우 — AI_INPUT (메시지 입력 중)', () => {
  const step = findStep('AI_INPUT')

  it('INITIAL 과 동일: CompanyManager pre-filled 유지', () => {
    render(
      <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
    )
    expect(
      screen.getByTestId('company-manager-prefilled-badge'),
    ).toBeInTheDocument()
  })

  it('INITIAL 과 동일: DistanceInfo "측정 전"', () => {
    render(
      <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
    )
    expect(screen.getByTestId('estimate-distance-info')).toHaveAttribute(
      'data-visible',
      'false',
    )
  })

  it('INITIAL 과 동일: TransportOption stroke 미적용', () => {
    const { container } = render(
      <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
    )
    const polylines = container.querySelectorAll(
      '[data-testid^="transport-option-"] polyline',
    )
    for (const polyline of polylines) {
      expect(polyline).toHaveAttribute('data-animating', 'false')
    }
  })

  it('INITIAL 과 동일: Estimate/Settlement active=false', () => {
    render(
      <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
    )
    expect(screen.getByTestId('estimate-info-card')).toHaveAttribute(
      'data-active',
      'false',
    )
    expect(screen.getByTestId('settlement-section')).toHaveAttribute(
      'data-active',
      'false',
    )
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-INT-FLOW-ORDERFORM — AI_EXTRACT
// ---------------------------------------------------------------------------

describe('OrderForm 플로우 — AI_EXTRACT (AI 분석 중)', () => {
  const step = findStep('AI_EXTRACT')

  it('INITIAL 과 동일: DistanceInfo "측정 전"', () => {
    render(
      <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
    )
    expect(screen.getByTestId('estimate-distance-info')).toHaveAttribute(
      'data-visible',
      'false',
    )
  })

  it('INITIAL 과 동일: Estimate/Settlement active=false', () => {
    render(
      <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
    )
    expect(screen.getByTestId('estimate-info-card')).toHaveAttribute(
      'data-active',
      'false',
    )
    expect(screen.getByTestId('settlement-section')).toHaveAttribute(
      'data-active',
      'false',
    )
  })

  it('INITIAL 과 동일: LocationForm caret 비활성', () => {
    const { container } = render(
      <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
    )
    const pickup = container.querySelector(
      '[data-testid="location-form-pickup"]',
    )!
    expect(pickup.querySelector('[data-caret]')).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-INT-FLOW-ORDERFORM — AI_APPLY partialBeat
// ---------------------------------------------------------------------------

describe('OrderForm 플로우 — AI_APPLY partialBeat (카테고리 순차 fill-in)', () => {
  const step = findStep('AI_APPLY')

  it('pickup fill-in active=true — LocationForm(pickup) 에 caret 렌더', () => {
    const { container } = render(
      <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
    )
    const pickup = container.querySelector(
      '[data-testid="location-form-pickup"]',
    )!
    // active=true 이면 useFillInCaret 이 초기 render 에 caret 을 렌더 (isFilling=true + caretVisible=true)
    expect(pickup.querySelectorAll('[data-caret]').length).toBeGreaterThan(0)
  })

  it('delivery fill-in active=true — LocationForm(delivery) 에 caret 렌더', () => {
    const { container } = render(
      <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
    )
    act(() => {
      vi.advanceTimersByTime(650)
    })
    const delivery = container.querySelector(
      '[data-testid="location-form-delivery"]',
    )!
    expect(delivery.querySelectorAll('[data-caret]').length).toBeGreaterThan(0)
  })

  it('cargo fill-in active=true — CargoInfoForm 에 caret 렌더', () => {
    const { container } = render(
      <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
    )
    act(() => {
      vi.advanceTimersByTime(1300)
    })
    const cargo = container.querySelector('[data-testid="cargo-info-form"]')!
    expect(cargo.querySelectorAll('[data-caret]').length).toBeGreaterThan(0)
  })

  it('pickup DateTimeCard caret 렌더 (pickup active 공유)', () => {
    const { container } = render(
      <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
    )
    const pickupDT = container.querySelector(
      '[data-testid="datetime-card-pickup"]',
    )!
    expect(pickupDT.querySelectorAll('[data-caret]').length).toBeGreaterThan(0)
  })

  it('delivery DateTimeCard caret 렌더 (delivery active 공유)', () => {
    const { container } = render(
      <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
    )
    act(() => {
      vi.advanceTimersByTime(650)
    })
    const deliveryDT = container.querySelector(
      '[data-testid="datetime-card-delivery"]',
    )!
    expect(deliveryDT.querySelectorAll('[data-caret]').length).toBeGreaterThan(0)
  })

  it('CompanyManager 는 fill-in 대상 제외 (REQ-DASH3-022) — pre-filled 배지 유지', () => {
    render(
      <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
    )
    expect(
      screen.getByTestId('company-manager-prefilled-badge'),
    ).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-INT-FLOW-ORDERFORM — AI_APPLY allBeat
// ---------------------------------------------------------------------------

describe('OrderForm 플로우 — AI_APPLY allBeat (전체 비트)', () => {
  const step = findStep('AI_APPLY')

  it('Transport stroke 애니 활성 — checked=true 옵션(direct / forklift) 은 data-animating=true', () => {
    render(
      <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
    )
    // strokeTargets 는 8개 모두 포함하지만, animating = checked && isAnimTarget 이므로
    // 실제로 data-animating=true 인 것은 options.direct / options.forklift = true 2개.
    act(() => {
      vi.advanceTimersByTime(1300)
    })
    const direct = screen.getByTestId('transport-option-direct')
    const forklift = screen.getByTestId('transport-option-forklift')
    expect(direct.querySelector('polyline')).toHaveAttribute(
      'data-animating',
      'true',
    )
    expect(forklift.querySelector('polyline')).toHaveAttribute(
      'data-animating',
      'true',
    )
    // 나머지 6개 (checked=false) 는 animating=false
    const unchecked = ['fast', 'roundTrip', 'trace', 'manual', 'cod', 'special']
    for (const key of unchecked) {
      const item = screen.getByTestId(`transport-option-${key}`)
      expect(item.querySelector('polyline')).toHaveAttribute(
        'data-animating',
        'false',
      )
    }
  })

  it('EstimateInfoCard data-active="true" — 롤링 glow 활성', () => {
    render(
      <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
    )
    expect(screen.getByTestId('estimate-info-card')).toHaveAttribute(
      'data-active',
      'true',
    )
  })

  it('SettlementSection data-active="true" — 롤링 glow 활성', () => {
    render(
      <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
    )
    expect(screen.getByTestId('settlement-section')).toHaveAttribute(
      'data-active',
      'true',
    )
  })

  it('DistanceInfo visible=true — 수치 노출', () => {
    render(
      <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
    )
    act(() => {
      vi.advanceTimersByTime(900)
    })
    const distanceInfo = screen.getByTestId('estimate-distance-info')
    expect(distanceInfo).toHaveAttribute('data-visible', 'true')
    expect(distanceInfo).not.toHaveTextContent('측정 전')
    // distance/duration 값 포함
    const { distance, duration } = PREVIEW_MOCK_DATA.formData.estimate
    expect(distanceInfo).toHaveTextContent(String(distance))
    expect(distanceInfo).toHaveTextContent(String(duration))
  })

  it('AutoDispatch 토글 ON — data-auto-dispatch="true"', () => {
    render(
      <OrderFormContainer step={step} formData={PREVIEW_MOCK_DATA.formData} />,
    )
    act(() => {
      vi.advanceTimersByTime(900)
    })
    const toggle = screen.getByTestId('estimate-auto-dispatch-toggle')
    expect(toggle).toHaveAttribute('data-auto-dispatch', 'true')
    expect(toggle).toHaveTextContent('ON')
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-INT-FLOW-ORDERFORM — Step 전환 일관성
// ---------------------------------------------------------------------------

describe('OrderForm 플로우 — Step 전환 (INITIAL → AI_APPLY 토글)', () => {
  it('INITIAL → AI_APPLY: Estimate/Settlement active 전환', () => {
    const { rerender } = render(
      <OrderFormContainer
        step={findStep('INITIAL')}
        formData={PREVIEW_MOCK_DATA.formData}
      />,
    )
    expect(screen.getByTestId('estimate-info-card')).toHaveAttribute(
      'data-active',
      'false',
    )

    rerender(
      <OrderFormContainer
        step={findStep('AI_APPLY')}
        formData={PREVIEW_MOCK_DATA.formData}
      />,
    )
    expect(screen.getByTestId('estimate-info-card')).toHaveAttribute(
      'data-active',
      'true',
    )
  })

  it('INITIAL → AI_APPLY: DistanceInfo visible 전환', () => {
    const { rerender } = render(
      <OrderFormContainer
        step={findStep('INITIAL')}
        formData={PREVIEW_MOCK_DATA.formData}
      />,
    )
    expect(screen.getByTestId('estimate-distance-info')).toHaveAttribute(
      'data-visible',
      'false',
    )

    rerender(
      <OrderFormContainer
        step={findStep('AI_APPLY')}
        formData={PREVIEW_MOCK_DATA.formData}
      />,
    )
    act(() => {
      vi.advanceTimersByTime(900)
    })
    expect(screen.getByTestId('estimate-distance-info')).toHaveAttribute(
      'data-visible',
      'true',
    )
  })

  it('AI_APPLY → INITIAL: 모든 active 해제', () => {
    const { rerender } = render(
      <OrderFormContainer
        step={findStep('AI_APPLY')}
        formData={PREVIEW_MOCK_DATA.formData}
      />,
    )
    expect(screen.getByTestId('estimate-info-card')).toHaveAttribute(
      'data-active',
      'true',
    )

    rerender(
      <OrderFormContainer
        step={findStep('INITIAL')}
        formData={PREVIEW_MOCK_DATA.formData}
      />,
    )
    expect(screen.getByTestId('estimate-info-card')).toHaveAttribute(
      'data-active',
      'false',
    )
    expect(screen.getByTestId('settlement-section')).toHaveAttribute(
      'data-active',
      'false',
    )
  })
})
