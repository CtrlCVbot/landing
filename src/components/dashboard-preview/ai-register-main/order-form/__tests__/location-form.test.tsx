/**
 * T-DASH3-M3-03 — LocationForm 단위 테스트
 *
 * TC
 *  - TC-DASH3-UNIT-LOCFORM (pickup / delivery 분기, 시각 뼈대)
 *  - TC-DASH3-UNIT-FILLIN 적용 검증 (active=true 시 caret → 값 등장)
 *
 * REQ
 *  - REQ-DASH3-004 (OrderForm 컴포넌트 복제 매니페스트 — LocationForm)
 *  - REQ-DASH3-022 (AI_APPLY fill-in 대상 — pickup/delivery 주소·담당자·연락처)
 *  - REQ-DASH-005 (landing 팔레트 일관성)
 *  - REQ-DASH-007 (접근성)
 *
 * 범위
 *  - stateless, kind prop(pickup/delivery) 로 시각/레이블 분기.
 *  - active prop 으로 #6 fill-in caret 4개 필드(company/address/contactName/contactPhone) 동시 제어.
 *  - 주소 검색 버튼은 "Search" 아이콘 + "주소 검색" 라벨의 시각 자리만 (M3 범위 외 — 비활성).
 *  - 원본 mm-broker `location-form.tsx` (1046줄) 의 Dialog/Popover/검색/API 로직은 전부 제거.
 *
 * 주의
 *  - useFillInCaret 훅은 내부에서 4회 호출된다. M2 ai-button-item 이 useRipple/useButtonPress 를
 *    dumb component 안에서 호출한 패턴과 일관 (스펙 §2-1 원칙 내 허용).
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

import { LocationForm } from '@/components/dashboard-preview/ai-register-main/order-form/location-form'
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
// TC-DASH3-UNIT-LOCFORM — kind=pickup
// ---------------------------------------------------------------------------

describe('LocationForm — TC-DASH3-UNIT-LOCFORM (kind=pickup)', () => {
  it('제목 "상차지" 를 렌더한다', () => {
    render(<LocationForm kind="pickup" data={PICKUP} active={false} />)
    expect(screen.getByText('상차지')).toBeInTheDocument()
  })

  it('MapPin 아이콘을 렌더한다 (data-icon="map-pin")', () => {
    render(<LocationForm kind="pickup" data={PICKUP} active={false} />)
    expect(screen.getByTestId('location-form-pickup')).toContainElement(
      document.querySelector('[data-icon="map-pin"]') as HTMLElement,
    )
  })

  it('회사명/주소/담당자/연락처 data 값을 렌더한다 (active=false 기본 pre-filled)', () => {
    render(<LocationForm kind="pickup" data={PICKUP} active={false} />)
    expect(screen.getByText(PICKUP.company)).toBeInTheDocument()
    expect(screen.getByText(PICKUP.roadAddress)).toBeInTheDocument()
    expect(screen.getByText(PICKUP.contactName)).toBeInTheDocument()
    expect(screen.getByText(PICKUP.contactPhone)).toBeInTheDocument()
  })

  it('role="region" + aria-label "상차지 정보" 로 접근성을 제공한다', () => {
    render(<LocationForm kind="pickup" data={PICKUP} active={false} />)
    expect(
      screen.getByRole('region', { name: '상차지 정보' }),
    ).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-LOCFORM — kind=delivery
// ---------------------------------------------------------------------------

describe('LocationForm — TC-DASH3-UNIT-LOCFORM (kind=delivery)', () => {
  it('제목 "하차지" 를 렌더한다', () => {
    render(<LocationForm kind="delivery" data={DELIVERY} active={false} />)
    expect(screen.getByText('하차지')).toBeInTheDocument()
  })

  it('Flag 아이콘을 렌더한다 (data-icon="flag")', () => {
    render(<LocationForm kind="delivery" data={DELIVERY} active={false} />)
    expect(screen.getByTestId('location-form-delivery')).toContainElement(
      document.querySelector('[data-icon="flag"]') as HTMLElement,
    )
  })

  it('회사명/주소/담당자/연락처 data 값을 렌더한다', () => {
    render(<LocationForm kind="delivery" data={DELIVERY} active={false} />)
    expect(screen.getByText(DELIVERY.company)).toBeInTheDocument()
    expect(screen.getByText(DELIVERY.roadAddress)).toBeInTheDocument()
    expect(screen.getByText(DELIVERY.contactName)).toBeInTheDocument()
    expect(screen.getByText(DELIVERY.contactPhone)).toBeInTheDocument()
  })

  it('role="region" + aria-label "하차지 정보" 로 접근성을 제공한다', () => {
    render(<LocationForm kind="delivery" data={DELIVERY} active={false} />)
    expect(
      screen.getByRole('region', { name: '하차지 정보' }),
    ).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-LOCFORM — active=false (AI_APPLY 전)
// ---------------------------------------------------------------------------

describe('LocationForm — TC-DASH3-UNIT-LOCFORM (active=false, pre-AI_APPLY)', () => {
  it('caret 요소가 DOM 에 존재하지 않는다', () => {
    const { container } = render(
      <LocationForm kind="pickup" data={PICKUP} active={false} />,
    )
    // active=false 면 caret 숨김 유지
    expect(container.querySelectorAll('[data-caret]').length).toBe(0)
  })

  it('data 값이 pre-filled 상태로 그대로 노출된다 (placeholder 아님)', () => {
    render(<LocationForm kind="pickup" data={PICKUP} active={false} />)
    // fill-in 전이지만 pre-filled 로 보여주므로 data 그대로 렌더
    expect(screen.getByText(PICKUP.company)).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-FILLIN — active=true 적용 검증 (AI_APPLY)
// ---------------------------------------------------------------------------

describe('LocationForm — TC-DASH3-UNIT-FILLIN (active=true, AI_APPLY)', () => {
  it('초기에는 caret 요소가 4개 노출된다 (4개 필드 동시 fill-in)', () => {
    const { container } = render(
      <LocationForm kind="pickup" data={PICKUP} active={true} />,
    )
    // caret 깜박임 시작 시점에 4개 caret 요소 존재
    expect(container.querySelectorAll('[data-caret]').length).toBe(4)
  })

  it('fill-in 중에는 data 값이 아직 노출되지 않는다 (빈 값)', () => {
    render(<LocationForm kind="pickup" data={PICKUP} active={true} />)
    // active=true 초기에는 isFilling=true 이며 displayedValue=''
    expect(screen.queryByText(PICKUP.company)).not.toBeInTheDocument()
    expect(screen.queryByText(PICKUP.roadAddress)).not.toBeInTheDocument()
    expect(screen.queryByText(PICKUP.contactName)).not.toBeInTheDocument()
    expect(screen.queryByText(PICKUP.contactPhone)).not.toBeInTheDocument()
  })

  it('delay 경과 후 4개 필드 값이 모두 등장한다 (caret 제거)', () => {
    const { container } = render(
      <LocationForm kind="pickup" data={PICKUP} active={true} />,
    )
    // useFillInCaret 기본 delay=400
    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(screen.getByText(PICKUP.company)).toBeInTheDocument()
    expect(screen.getByText(PICKUP.roadAddress)).toBeInTheDocument()
    expect(screen.getByText(PICKUP.contactName)).toBeInTheDocument()
    expect(screen.getByText(PICKUP.contactPhone)).toBeInTheDocument()
    // caret 제거 확인
    expect(container.querySelectorAll('[data-caret]').length).toBe(0)
  })

  it('delivery kind 에서도 active=true 시 4개 caret 이 노출된다', () => {
    const { container } = render(
      <LocationForm kind="delivery" data={DELIVERY} active={true} />,
    )
    expect(container.querySelectorAll('[data-caret]').length).toBe(4)
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-LOCFORM — 주소 검색 버튼 (시각 자리만)
// ---------------------------------------------------------------------------

describe('LocationForm — TC-DASH3-UNIT-LOCFORM (주소 검색 버튼)', () => {
  it('주소 검색 버튼을 렌더한다 (label "주소 검색")', () => {
    render(<LocationForm kind="pickup" data={PICKUP} active={false} />)
    const btn = screen.getByRole('button', { name: /주소 검색/ })
    expect(btn).toBeInTheDocument()
  })

  it('Search 아이콘을 포함한다 (data-icon="search")', () => {
    const { container } = render(
      <LocationForm kind="pickup" data={PICKUP} active={false} />,
    )
    expect(container.querySelector('[data-icon="search"]')).not.toBeNull()
  })

  it('버튼이 disabled=true 이다 (데모 — 실제 다이얼로그는 M3 범위 외)', () => {
    render(<LocationForm kind="pickup" data={PICKUP} active={false} />)
    const btn = screen.getByRole('button', { name: /주소 검색/ })
    expect(btn).toBeDisabled()
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-LOCFORM — 구조 / landing 팔레트
// ---------------------------------------------------------------------------

describe('LocationForm — TC-DASH3-UNIT-LOCFORM (구조 / landing 팔레트)', () => {
  it('카드 className 은 landing 팔레트 (bg-card/50 border-border rounded-xl p-4) 를 가진다 (T-THEME-13 토큰 치환; 원본: bg-white/5 border-white/10)', () => {
    render(<LocationForm kind="pickup" data={PICKUP} active={false} />)
    const card = screen.getByTestId('location-form-pickup')
    expect(card.className).toMatch(/bg-card\/50/)
    expect(card.className).toMatch(/border-border(?![a-z-])/)
    expect(card.className).toMatch(/rounded-xl/)
    expect(card.className).toMatch(/p-4/)
  })

  it('delivery kind 도 동일한 landing 팔레트 카드 스타일을 갖는다 (T-THEME-13 토큰 치환; 원본: bg-white/5 border-white/10)', () => {
    render(<LocationForm kind="delivery" data={DELIVERY} active={false} />)
    const card = screen.getByTestId('location-form-delivery')
    expect(card.className).toMatch(/bg-card\/50/)
    expect(card.className).toMatch(/border-border(?![a-z-])/)
    expect(card.className).toMatch(/rounded-xl/)
    expect(card.className).toMatch(/p-4/)
  })

  it('data-kind 속성이 prop 값과 일치한다 (pickup)', () => {
    render(<LocationForm kind="pickup" data={PICKUP} active={false} />)
    expect(screen.getByTestId('location-form-pickup')).toHaveAttribute(
      'data-kind',
      'pickup',
    )
  })

  it('data-kind 속성이 prop 값과 일치한다 (delivery)', () => {
    render(<LocationForm kind="delivery" data={DELIVERY} active={false} />)
    expect(screen.getByTestId('location-form-delivery')).toHaveAttribute(
      'data-kind',
      'delivery',
    )
  })
})
