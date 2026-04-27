/**
 * T-DASH3-M3-09 — SettlementSection 단위 테스트
 *
 * TC
 *  - TC-DASH3-UNIT-SETTLEMENT (기본금액 2 + 추가요금 그리드 + 합계 3 + landing 팔레트 + 접근성)
 *  - TC-DASH3-UNIT-ROLL 적용 (#8 number-rolling — 합계 3개 0→target 롤링)
 *
 * REQ
 *  - REQ-DASH3-004 (OrderForm 컴포넌트 복제 매니페스트 — SettlementSection)
 *  - REQ-DASH3-023 (#8 number-rolling — 합계 0→target)
 *  - REQ-DASH3-031 (정산 정보 카드)
 *  - REQ-DASH-005 (landing 팔레트 일관성)
 *  - REQ-DASH-007 (접근성)
 *
 * 범위
 *  - stateless, settlement/active/rollingTriggerAt prop 주입.
 *  - 기본금액 2개 (청구/지급) 표시.
 *  - additionalFees 그리드 (type/amount/memo).
 *  - 합계 3개 (청구합계/지급합계/수익).
 *  - active=false 시 최종값 즉시 정적 표시.
 *  - active=true + rollingTriggerAt 시 합계 3개 0→target 롤링.
 *
 * 원본 참조
 *  - mm-broker `register-form.tsx` §1365-1539 인라인 운임 관리 Card 섹션.
 *    shadcn Card / CurrencyInput / Checkbox 연동 제거, landing palette stateless 복제.
 */

import { render, screen, act } from '@testing-library/react'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { SettlementSection } from '@/components/dashboard-preview/ai-register-main/order-form/settlement-section'
import type { SettlementMock } from '@/lib/mock-data'

// ---------------------------------------------------------------------------
// matchMedia helper (prefers-reduced-motion 기본 off)
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

// ---------------------------------------------------------------------------
// rAF shim — jsdom 에서 useNumberRolling 의 performance.now + rAF 를
// fake timer 로 제어 (estimate-info-card.test.tsx 와 동일 패턴).
// ---------------------------------------------------------------------------

function installRafShim(): () => void {
  const originalRaf = globalThis.requestAnimationFrame
  const originalCaf = globalThis.cancelAnimationFrame
  const FRAME_MS = 16
  let nowRef = 0

  globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) =>
    setTimeout(() => {
      nowRef += FRAME_MS
      cb(nowRef)
    }, FRAME_MS) as unknown as number) as typeof requestAnimationFrame
  globalThis.cancelAnimationFrame = ((id: number) =>
    clearTimeout(id as unknown as ReturnType<typeof setTimeout>)) as typeof cancelAnimationFrame

  const originalNow = performance.now.bind(performance)
  ;(performance as unknown as { now: () => number }).now = () => nowRef

  return () => {
    globalThis.requestAnimationFrame = originalRaf
    globalThis.cancelAnimationFrame = originalCaf
    ;(performance as unknown as { now: () => number }).now = originalNow
  }
}

// ---------------------------------------------------------------------------
// Fixtures — mock-data SETTLEMENT_MOCK 와 일치
// ---------------------------------------------------------------------------

const SETTLEMENT_FIXTURE: SettlementMock = {
  chargeBaseAmount: 850000,
  dispatchBaseAmount: 750000,
  additionalFees: [
    {
      id: 'fee-toll',
      type: '고속료',
      amount: 30000,
      memo: '경부/남해선',
      target: 'both',
    },
  ],
  totals: {
    chargeTotal: 880000,
    dispatchTotal: 780000,
    profit: 100000,
  },
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

let teardownRaf: (() => void) | null = null

beforeEach(() => {
  vi.useFakeTimers()
  mockMatchMedia(false)
  teardownRaf = installRafShim()
})

afterEach(() => {
  teardownRaf?.()
  teardownRaf = null
  vi.useRealTimers()
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-SETTLEMENT — 기본 렌더 (기본금액 + 추가요금 + 합계)
// ---------------------------------------------------------------------------

describe('SettlementSection — TC-DASH3-UNIT-SETTLEMENT (기본 렌더)', () => {
  it('visible=false 이면 청구/배차/수익/추가요금 숫자를 숨기고 정산 전 상태를 표시한다', () => {
    render(
      <SettlementSection
        settlement={SETTLEMENT_FIXTURE}
        active={false}
        visible={false}
      />,
    )

    const section = screen.getByTestId('settlement-section')
    expect(section).toHaveAttribute('data-visible', 'false')
    expect(section).toHaveTextContent('정산 전')
    expect(section.textContent).not.toMatch(/850[,.]?000|750[,.]?000|880[,.]?000|780[,.]?000|100[,.]?000|30[,.]?000/)
  })

  it('chargeBaseAmount 값이 표시된다 (850,000)', () => {
    render(
      <SettlementSection settlement={SETTLEMENT_FIXTURE} active={false} />,
    )
    const baseCharge = screen.getByTestId('settlement-base-charge')
    expect(baseCharge.textContent).toMatch(/850[,.]?000/)
  })

  it('dispatchBaseAmount 값이 표시된다 (750,000)', () => {
    render(
      <SettlementSection settlement={SETTLEMENT_FIXTURE} active={false} />,
    )
    const baseDispatch = screen.getByTestId('settlement-base-dispatch')
    expect(baseDispatch.textContent).toMatch(/750[,.]?000/)
  })

  it('additionalFees 각 항목 (type/amount/memo) 이 그리드에 표시된다', () => {
    render(
      <SettlementSection settlement={SETTLEMENT_FIXTURE} active={false} />,
    )
    const fee = screen.getByTestId('settlement-fee-fee-toll')
    expect(fee.textContent).toMatch(/고속료/)
    expect(fee.textContent).toMatch(/30[,.]?000/)
    expect(fee.textContent).toMatch(/경부\/남해선/)
  })

  it('추가요금이 없는 경우에도 빈 상태로 정상 렌더된다', () => {
    const emptyFees: SettlementMock = {
      ...SETTLEMENT_FIXTURE,
      additionalFees: [],
    }
    render(
      <SettlementSection settlement={emptyFees} active={false} />,
    )
    expect(screen.getByTestId('settlement-section')).toBeInTheDocument()
    expect(screen.queryByTestId(/^settlement-fee-/)).toBeNull()
  })

  it('합계 3개 (청구/지급/수익) 각 값이 data-testid 로 렌더된다 (active=false)', () => {
    render(
      <SettlementSection settlement={SETTLEMENT_FIXTURE} active={false} />,
    )
    const chargeTotal = screen.getByTestId('settlement-total-charge')
    const dispatchTotal = screen.getByTestId('settlement-total-dispatch')
    const profit = screen.getByTestId('settlement-total-profit')

    expect(chargeTotal.textContent).toMatch(/880[,.]?000/)
    expect(dispatchTotal.textContent).toMatch(/780[,.]?000/)
    expect(profit.textContent).toMatch(/100[,.]?000/)
  })

  it('원(KRW) 단위가 합계 값 옆에 표시된다', () => {
    render(
      <SettlementSection settlement={SETTLEMENT_FIXTURE} active={false} />,
    )
    const section = screen.getByTestId('settlement-section')
    expect(section.textContent).toMatch(/원/)
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-ROLL — #8 number-rolling (합계 3개 0 → target)
// ---------------------------------------------------------------------------

describe('SettlementSection — TC-DASH3-UNIT-ROLL (#8 number-rolling 합계)', () => {
  it('active=false 시 합계 3개 모두 target 을 즉시 정적 표시한다', () => {
    render(
      <SettlementSection settlement={SETTLEMENT_FIXTURE} active={false} />,
    )
    expect(screen.getByTestId('settlement-total-charge').textContent).toMatch(/880[,.]?000/)
    expect(screen.getByTestId('settlement-total-dispatch').textContent).toMatch(/780[,.]?000/)
    expect(screen.getByTestId('settlement-total-profit').textContent).toMatch(/100[,.]?000/)
  })

  it('active=true + rollingTriggerAt=0 시 초기값 0 에서 시작한다', () => {
    render(
      <SettlementSection
        settlement={SETTLEMENT_FIXTURE}
        active={true}
        rollingTriggerAt={0}
      />,
    )
    const chargeTotal = screen.getByTestId('settlement-total-charge')
    const dispatchTotal = screen.getByTestId('settlement-total-dispatch')
    const profit = screen.getByTestId('settlement-total-profit')

    // 초기 target 미도달 — 합계 3개 모두 target value 에 미수렴
    expect(chargeTotal.textContent).not.toMatch(/880/)
    expect(dispatchTotal.textContent).not.toMatch(/780/)
    expect(profit.textContent).not.toMatch(/100[,.]?000/)
  })

  it('active=true + rollingTriggerAt=0 시 충분한 시간 경과 후 target 3개 모두 수렴한다', () => {
    render(
      <SettlementSection
        settlement={SETTLEMENT_FIXTURE}
        active={true}
        rollingTriggerAt={0}
      />,
    )
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByTestId('settlement-total-charge').textContent).toMatch(/880[,.]?000/)
    expect(screen.getByTestId('settlement-total-dispatch').textContent).toMatch(/780[,.]?000/)
    expect(screen.getByTestId('settlement-total-profit').textContent).toMatch(/100[,.]?000/)
  })

  it('rollingTriggerAt=null 시 active=true 여도 롤링 대기 상태 (0 유지)', () => {
    render(
      <SettlementSection
        settlement={SETTLEMENT_FIXTURE}
        active={true}
        rollingTriggerAt={null}
      />,
    )
    const chargeTotal = screen.getByTestId('settlement-total-charge')
    expect(chargeTotal.textContent).not.toMatch(/880/)
    expect(chargeTotal.textContent?.startsWith('0')).toBe(true)
  })

  it('rollingTriggerAt=100 시 100ms 이전에는 0, 경과 후 롤링 시작', () => {
    render(
      <SettlementSection
        settlement={SETTLEMENT_FIXTURE}
        active={true}
        rollingTriggerAt={100}
      />,
    )

    // 초기 50ms — 아직 trigger 미발동
    act(() => {
      vi.advanceTimersByTime(50)
    })
    let chargeTotal = screen.getByTestId('settlement-total-charge')
    expect(chargeTotal.textContent).not.toMatch(/880/)

    // 추가 60ms → 총 110ms: trigger 발동
    act(() => {
      vi.advanceTimersByTime(60)
    })
    // 추가 1000ms → 프레임 드레인 → target 도달
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    chargeTotal = screen.getByTestId('settlement-total-charge')
    expect(chargeTotal.textContent).toMatch(/880[,.]?000/)
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-SETTLEMENT — 구조 / landing 팔레트 / 접근성
// ---------------------------------------------------------------------------

describe('SettlementSection — TC-DASH3-UNIT-SETTLEMENT (구조 / landing 팔레트 / 접근성)', () => {
  it('카드 className 에 landing 팔레트 (bg-card/50 border-border rounded-xl) 가 적용된다 (F1 T-THEME-08)', () => {
    render(
      <SettlementSection settlement={SETTLEMENT_FIXTURE} active={false} />,
    )
    const section = screen.getByTestId('settlement-section')
    expect(section.className).toMatch(/bg-card\/50/)
    expect(section.className).toMatch(/border-border/)
    expect(section.className).toMatch(/rounded-xl/)
  })

  it('제목 "정산 정보" 와 헤더 아이콘 (Wallet/ReceiptText) 이 렌더된다', () => {
    render(
      <SettlementSection settlement={SETTLEMENT_FIXTURE} active={false} />,
    )
    const section = screen.getByTestId('settlement-section')
    expect(section.textContent).toMatch(/정산 정보/)
    const icon = section.querySelector('[data-icon="settlement"]')
    expect(icon).not.toBeNull()
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  it('role="region" + aria-label 로 landmark 를 제공한다', () => {
    render(
      <SettlementSection settlement={SETTLEMENT_FIXTURE} active={false} />,
    )
    expect(
      screen.getByRole('region', { name: '정산 정보' }),
    ).toBeInTheDocument()
  })

  it('active=true 시 glow 클래스 (ring-accent/30 + shadow-accent/10) 가 있다', () => {
    render(
      <SettlementSection
        settlement={SETTLEMENT_FIXTURE}
        active={true}
        rollingTriggerAt={0}
      />,
    )
    const section = screen.getByTestId('settlement-section')
    expect(section.className).toMatch(/ring-accent\/30/)
    expect(section.className).toMatch(/shadow-accent\/10/)
  })

  it('active=false 시 glow 클래스가 없다', () => {
    render(
      <SettlementSection settlement={SETTLEMENT_FIXTURE} active={false} />,
    )
    const section = screen.getByTestId('settlement-section')
    expect(section.className).not.toMatch(/ring-accent\/30/)
    expect(section.className).not.toMatch(/shadow-accent\/10/)
  })
})
