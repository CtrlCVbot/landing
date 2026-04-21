/**
 * T-DASH3-M3-04 — DateTimeCard 단위 테스트
 *
 * TC
 *  - TC-DASH3-UNIT-DTCARD (pickup / delivery 분기, 시각 뼈대, 프리셋 버튼)
 *  - TC-DASH3-UNIT-FILLIN 적용 검증 (active=true 시 caret → 값 등장)
 *
 * REQ
 *  - REQ-DASH3-004 (OrderForm 컴포넌트 복제 매니페스트 — DateTimeCard)
 *  - REQ-DASH3-022 (AI_APPLY fill-in 대상 — pickup/delivery 일시)
 *  - REQ-DASH-005 (landing 팔레트 일관성)
 *  - REQ-DASH-007 (접근성)
 *
 * 범위
 *  - stateless, kind prop(pickup/delivery) 로 시각/레이블 분기.
 *  - 프리셋 버튼 3개 (지금/오늘/내일) — 정적/disabled, `datePresetActive` 기반 accent 강조.
 *  - 날짜·시간 2필드 #6 fill-in caret (active=true 시).
 *  - 원본 mm-broker `datetime-card.tsx` (260줄) 의 Popover/Calendar/Select/react-hook-form 로직 전부 제거.
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

import { DateTimeCard } from '@/components/dashboard-preview/ai-register-main/order-form/datetime-card'
import { PREVIEW_MOCK_DATA } from '@/lib/mock-data'

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
// Fixtures
// ---------------------------------------------------------------------------

const PICKUP = PREVIEW_MOCK_DATA.formData.pickup
const DELIVERY = PREVIEW_MOCK_DATA.formData.delivery

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.useFakeTimers()
  mockMatchMedia(false)
})

afterEach(() => {
  vi.useRealTimers()
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-DTCARD — kind=pickup
// ---------------------------------------------------------------------------

describe('DateTimeCard — TC-DASH3-UNIT-DTCARD (kind=pickup)', () => {
  it('제목 "상차 일시" 를 렌더한다', () => {
    render(
      <DateTimeCard
        kind="pickup"
        date={PICKUP.date}
        time={PICKUP.time}
        active={false}
      />,
    )
    expect(screen.getByText('상차 일시')).toBeInTheDocument()
  })

  it('Calendar 아이콘을 렌더한다 (data-icon="calendar")', () => {
    render(
      <DateTimeCard
        kind="pickup"
        date={PICKUP.date}
        time={PICKUP.time}
        active={false}
      />,
    )
    expect(screen.getByTestId('datetime-card-pickup')).toContainElement(
      document.querySelector('[data-icon="calendar"]') as HTMLElement,
    )
  })

  it('Clock 아이콘도 렌더한다 (시간 필드용 data-icon="clock")', () => {
    const { container } = render(
      <DateTimeCard
        kind="pickup"
        date={PICKUP.date}
        time={PICKUP.time}
        active={false}
      />,
    )
    expect(container.querySelector('[data-icon="clock"]')).not.toBeNull()
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-DTCARD — kind=delivery
// ---------------------------------------------------------------------------

describe('DateTimeCard — TC-DASH3-UNIT-DTCARD (kind=delivery)', () => {
  it('제목 "하차 일시" 를 렌더한다', () => {
    render(
      <DateTimeCard
        kind="delivery"
        date={DELIVERY.date}
        time={DELIVERY.time}
        active={false}
      />,
    )
    expect(screen.getByText('하차 일시')).toBeInTheDocument()
  })

  it('Calendar 아이콘을 렌더한다 (data-icon="calendar")', () => {
    render(
      <DateTimeCard
        kind="delivery"
        date={DELIVERY.date}
        time={DELIVERY.time}
        active={false}
      />,
    )
    expect(screen.getByTestId('datetime-card-delivery')).toContainElement(
      document.querySelector('[data-icon="calendar"]') as HTMLElement,
    )
  })

  it('date-kind 속성이 prop 값과 일치한다 (delivery)', () => {
    render(
      <DateTimeCard
        kind="delivery"
        date={DELIVERY.date}
        time={DELIVERY.time}
        active={false}
      />,
    )
    expect(screen.getByTestId('datetime-card-delivery')).toHaveAttribute(
      'data-kind',
      'delivery',
    )
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-DTCARD — 프리셋 버튼 (지금 / 오늘 / 내일)
// ---------------------------------------------------------------------------

describe('DateTimeCard — TC-DASH3-UNIT-DTCARD (프리셋 버튼)', () => {
  it('3개의 프리셋 버튼을 렌더한다 (지금 / 오늘 / 내일)', () => {
    render(
      <DateTimeCard
        kind="pickup"
        date={PICKUP.date}
        time={PICKUP.time}
        active={false}
      />,
    )
    expect(screen.getByRole('button', { name: '지금' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '오늘' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '내일' })).toBeInTheDocument()
  })

  it('datePresetActive="내일" 시 "내일" 버튼이 accent 색상으로 강조된다', () => {
    render(
      <DateTimeCard
        kind="pickup"
        date={PICKUP.date}
        time={PICKUP.time}
        datePresetActive="내일"
        active={false}
      />,
    )
    const tomorrowBtn = screen.getByRole('button', { name: '내일' })
    expect(tomorrowBtn.className).toMatch(/text-accent/)
    expect(tomorrowBtn.className).toMatch(/border-accent/)
  })

  it('datePresetActive="내일" 시 "지금" / "오늘" 버튼은 비활성 색상(text-gray-500)', () => {
    render(
      <DateTimeCard
        kind="pickup"
        date={PICKUP.date}
        time={PICKUP.time}
        datePresetActive="내일"
        active={false}
      />,
    )
    const nowBtn = screen.getByRole('button', { name: '지금' })
    const todayBtn = screen.getByRole('button', { name: '오늘' })
    expect(nowBtn.className).toMatch(/text-gray-500/)
    expect(todayBtn.className).toMatch(/text-gray-500/)
  })

  it('datePresetActive 생략 시 3개 모두 비활성 색상이다', () => {
    render(
      <DateTimeCard
        kind="pickup"
        date={PICKUP.date}
        time={PICKUP.time}
        active={false}
      />,
    )
    expect(
      screen.getByRole('button', { name: '지금' }).className,
    ).toMatch(/text-gray-500/)
    expect(
      screen.getByRole('button', { name: '오늘' }).className,
    ).toMatch(/text-gray-500/)
    expect(
      screen.getByRole('button', { name: '내일' }).className,
    ).toMatch(/text-gray-500/)
  })

  it('datePresetActive="오늘" 시 "오늘" 버튼만 accent 강조된다', () => {
    render(
      <DateTimeCard
        kind="pickup"
        date={PICKUP.date}
        time={PICKUP.time}
        datePresetActive="오늘"
        active={false}
      />,
    )
    const todayBtn = screen.getByRole('button', { name: '오늘' })
    expect(todayBtn.className).toMatch(/text-accent/)
    expect(todayBtn.className).toMatch(/border-accent/)
  })

  it('datePresetActive="지금" 시 "지금" 버튼만 accent 강조된다', () => {
    render(
      <DateTimeCard
        kind="pickup"
        date={PICKUP.date}
        time={PICKUP.time}
        datePresetActive="지금"
        active={false}
      />,
    )
    const nowBtn = screen.getByRole('button', { name: '지금' })
    expect(nowBtn.className).toMatch(/text-accent/)
    expect(nowBtn.className).toMatch(/border-accent/)
  })

  it('프리셋 버튼 3개 모두 disabled 이다 (정적, 데모)', () => {
    render(
      <DateTimeCard
        kind="pickup"
        date={PICKUP.date}
        time={PICKUP.time}
        active={false}
      />,
    )
    expect(screen.getByRole('button', { name: '지금' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '오늘' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '내일' })).toBeDisabled()
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-DTCARD — 날짜 / 시간 표시 (active=false)
// ---------------------------------------------------------------------------

describe('DateTimeCard — TC-DASH3-UNIT-DTCARD (날짜/시간 표시 / active=false)', () => {
  it('pickup date 값이 렌더된다', () => {
    render(
      <DateTimeCard
        kind="pickup"
        date={PICKUP.date}
        time={PICKUP.time}
        active={false}
      />,
    )
    expect(screen.getByText(PICKUP.date)).toBeInTheDocument()
  })

  it('pickup time 값이 렌더된다', () => {
    render(
      <DateTimeCard
        kind="pickup"
        date={PICKUP.date}
        time={PICKUP.time}
        active={false}
      />,
    )
    expect(screen.getByText(PICKUP.time)).toBeInTheDocument()
  })

  it('delivery date / time 값도 렌더된다', () => {
    render(
      <DateTimeCard
        kind="delivery"
        date={DELIVERY.date}
        time={DELIVERY.time}
        active={false}
      />,
    )
    expect(screen.getByText(DELIVERY.date)).toBeInTheDocument()
    expect(screen.getByText(DELIVERY.time)).toBeInTheDocument()
  })

  it('caret 요소가 DOM 에 존재하지 않는다 (active=false)', () => {
    const { container } = render(
      <DateTimeCard
        kind="pickup"
        date={PICKUP.date}
        time={PICKUP.time}
        active={false}
      />,
    )
    expect(container.querySelectorAll('[data-caret]').length).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-FILLIN — active=true 적용 검증 (AI_APPLY)
// ---------------------------------------------------------------------------

describe('DateTimeCard — TC-DASH3-UNIT-FILLIN (active=true, AI_APPLY)', () => {
  it('초기에는 caret 요소가 2개 노출된다 (date + time 동시 fill-in)', () => {
    const { container } = render(
      <DateTimeCard
        kind="pickup"
        date={PICKUP.date}
        time={PICKUP.time}
        active={true}
      />,
    )
    expect(container.querySelectorAll('[data-caret]').length).toBe(2)
  })

  it('fill-in 중에는 date / time 값이 아직 노출되지 않는다', () => {
    render(
      <DateTimeCard
        kind="pickup"
        date={PICKUP.date}
        time={PICKUP.time}
        active={true}
      />,
    )
    expect(screen.queryByText(PICKUP.date)).not.toBeInTheDocument()
    expect(screen.queryByText(PICKUP.time)).not.toBeInTheDocument()
  })

  it('delay 경과 후 date / time 값이 모두 등장한다 (caret 제거)', () => {
    const { container } = render(
      <DateTimeCard
        kind="pickup"
        date={PICKUP.date}
        time={PICKUP.time}
        active={true}
      />,
    )
    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(screen.getByText(PICKUP.date)).toBeInTheDocument()
    expect(screen.getByText(PICKUP.time)).toBeInTheDocument()
    expect(container.querySelectorAll('[data-caret]').length).toBe(0)
  })

  it('delivery kind 에서도 active=true 시 2개 caret 이 노출된다', () => {
    const { container } = render(
      <DateTimeCard
        kind="delivery"
        date={DELIVERY.date}
        time={DELIVERY.time}
        active={true}
      />,
    )
    expect(container.querySelectorAll('[data-caret]').length).toBe(2)
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-DTCARD — 구조 / landing 팔레트 / 접근성
// ---------------------------------------------------------------------------

describe('DateTimeCard — TC-DASH3-UNIT-DTCARD (구조 / landing 팔레트 / 접근성)', () => {
  it('카드 className 은 landing 팔레트 (bg-white/5 border-white/10 rounded-xl p-4) 를 가진다', () => {
    render(
      <DateTimeCard
        kind="pickup"
        date={PICKUP.date}
        time={PICKUP.time}
        active={false}
      />,
    )
    const card = screen.getByTestId('datetime-card-pickup')
    expect(card.className).toMatch(/bg-white\/5/)
    expect(card.className).toMatch(/border-white\/10/)
    expect(card.className).toMatch(/rounded-xl/)
    expect(card.className).toMatch(/p-4/)
  })

  it('delivery kind 도 동일한 landing 팔레트 카드 스타일을 갖는다', () => {
    render(
      <DateTimeCard
        kind="delivery"
        date={DELIVERY.date}
        time={DELIVERY.time}
        active={false}
      />,
    )
    const card = screen.getByTestId('datetime-card-delivery')
    expect(card.className).toMatch(/bg-white\/5/)
    expect(card.className).toMatch(/border-white\/10/)
    expect(card.className).toMatch(/rounded-xl/)
    expect(card.className).toMatch(/p-4/)
  })

  it('pickup: role="region" + aria-label "상차 일시 정보" 로 접근성을 제공한다', () => {
    render(
      <DateTimeCard
        kind="pickup"
        date={PICKUP.date}
        time={PICKUP.time}
        active={false}
      />,
    )
    expect(
      screen.getByRole('region', { name: '상차 일시 정보' }),
    ).toBeInTheDocument()
  })

  it('delivery: role="region" + aria-label "하차 일시 정보" 로 접근성을 제공한다', () => {
    render(
      <DateTimeCard
        kind="delivery"
        date={DELIVERY.date}
        time={DELIVERY.time}
        active={false}
      />,
    )
    expect(
      screen.getByRole('region', { name: '하차 일시 정보' }),
    ).toBeInTheDocument()
  })

  it('data-kind 속성이 prop 값과 일치한다 (pickup)', () => {
    render(
      <DateTimeCard
        kind="pickup"
        date={PICKUP.date}
        time={PICKUP.time}
        active={false}
      />,
    )
    expect(screen.getByTestId('datetime-card-pickup')).toHaveAttribute(
      'data-kind',
      'pickup',
    )
  })
})
