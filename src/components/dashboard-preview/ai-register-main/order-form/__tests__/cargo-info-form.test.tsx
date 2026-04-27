/**
 * T-DASH3-M3-06 — CargoInfoForm 단위 테스트
 *
 * TC
 *  - TC-DASH3-UNIT-CARGOFORM (시각 뼈대: 차량 타입/중량/화물명/비고/최근 화물 칩)
 *  - TC-DASH3-UNIT-DROP (#7 dropdown 연출 — 600ms 이내 열림 → 닫힘)
 *  - TC-DASH3-UNIT-FILLIN 적용 검증 (active=true 시 화물명/비고 caret → 값 등장)
 *
 * REQ
 *  - REQ-DASH3-004 (OrderForm 컴포넌트 복제 매니페스트 — CargoInfoForm)
 *  - REQ-DASH3-027 (#7 dropdown — 차량 타입/중량 select 펼침 연출)
 *  - REQ-DASH-005 (landing 팔레트 일관성)
 *  - REQ-DASH-007 (접근성)
 *
 * 범위
 *  - stateless. active prop 으로 #6 fill-in caret 2개 필드(cargo.name/cargo.remark) 제어.
 *  - dropdownBeat prop 으로 #7 dropdown 펼침 연출 제어 (triggerAt 기반).
 *  - 원본 mm-broker `cargo-info-form.tsx` (352줄) 의 useRecentCargos/API 호출/Select 다이얼로그 제거.
 */

import { render, screen, act, within } from '@testing-library/react'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { CargoInfoForm } from '@/components/dashboard-preview/ai-register-main/order-form/cargo-info-form'
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

const VEHICLE = PREVIEW_MOCK_DATA.formData.vehicle
const CARGO = PREVIEW_MOCK_DATA.formData.cargo

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
// TC-DASH3-UNIT-CARGOFORM — 기본 렌더 (active=false)
// ---------------------------------------------------------------------------

describe('CargoInfoForm — TC-DASH3-UNIT-CARGOFORM (기본 렌더)', () => {
  it('revealed=false 이면 차량/화물 실제 값을 숨기고 placeholder 를 표시한다', () => {
    render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
        revealed={false}
      />,
    )

    expect(screen.getByTestId('cargo-vehicle-type-trigger')).toHaveTextContent(
      '선택 전',
    )
    expect(screen.getByTestId('cargo-weight-trigger')).toHaveTextContent('선택 전')
    expect(screen.getByTestId('cargo-name-field')).not.toHaveTextContent(CARGO.name)
    expect(screen.getByTestId('cargo-remark-field')).not.toHaveTextContent(CARGO.remark)
    expect(screen.getByTestId('cargo-recent-suggestions')).toHaveTextContent(
      '적용 전',
    )
  })

  it('차량 타입(vehicle.type) 값이 select trigger 에 렌더된다', () => {
    render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
      />,
    )
    const trigger = screen.getByTestId('cargo-vehicle-type-trigger')
    expect(trigger.textContent).toMatch(VEHICLE.type)
  })

  it('중량(vehicle.weight) 값이 select trigger 에 렌더된다', () => {
    render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
      />,
    )
    const trigger = screen.getByTestId('cargo-weight-trigger')
    expect(trigger.textContent).toMatch(VEHICLE.weight)
  })

  it('화물명(cargo.name) 값이 렌더된다', () => {
    render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
      />,
    )
    const field = screen.getByTestId('cargo-name-field')
    expect(within(field).getByText(CARGO.name)).toBeInTheDocument()
  })

  it('비고(cargo.remark) 값이 렌더된다', () => {
    render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
      />,
    )
    const field = screen.getByTestId('cargo-remark-field')
    expect(within(field).getByText(CARGO.remark)).toBeInTheDocument()
  })

  it('최근 화물 제안(recentCargoSuggestions) N개 칩이 렌더된다', () => {
    render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
      />,
    )
    const chipContainer = screen.getByTestId('cargo-recent-suggestions')
    VEHICLE.recentCargoSuggestions.forEach((suggestion) => {
      expect(within(chipContainer).getByText(suggestion)).toBeInTheDocument()
    })
  })

  it('최근 화물 칩 컨테이너가 data-testid="cargo-recent-suggestions" 로 렌더된다', () => {
    render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
      />,
    )
    const container = screen.getByTestId('cargo-recent-suggestions')
    expect(container).toBeInTheDocument()
    // recent suggestion 칩은 container 자식으로 존재
    expect(container.children.length).toBe(VEHICLE.recentCargoSuggestions.length)
  })

  it('caret 요소가 DOM 에 존재하지 않는다 (active=false)', () => {
    const { container } = render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
      />,
    )
    expect(container.querySelectorAll('[data-caret]').length).toBe(0)
  })

  it('차량 타입 select trigger 가 disabled 상태로 렌더된다 (정적/데모)', () => {
    render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
      />,
    )
    expect(
      screen.getByTestId('cargo-vehicle-type-trigger'),
    ).toBeDisabled()
  })

  it('중량 select trigger 가 disabled 상태로 렌더된다 (정적/데모)', () => {
    render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
      />,
    )
    expect(
      screen.getByTestId('cargo-weight-trigger'),
    ).toBeDisabled()
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-CARGOFORM — active=true (#6 fill-in)
// ---------------------------------------------------------------------------

describe('CargoInfoForm — TC-DASH3-UNIT-CARGOFORM (active=true, #6 fill-in)', () => {
  it('초기에는 caret 요소가 2개 노출된다 (cargo.name + cargo.remark 동시 fill-in)', () => {
    const { container } = render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={true}
      />,
    )
    expect(container.querySelectorAll('[data-caret]').length).toBe(2)
  })

  it('fill-in 중에는 cargo.name / cargo.remark 값이 아직 노출되지 않는다', () => {
    render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={true}
      />,
    )
    const nameField = screen.getByTestId('cargo-name-field')
    const remarkField = screen.getByTestId('cargo-remark-field')
    expect(within(nameField).queryByText(CARGO.name)).not.toBeInTheDocument()
    expect(within(remarkField).queryByText(CARGO.remark)).not.toBeInTheDocument()
  })

  it('delay 경과 후 cargo.name / cargo.remark 값이 모두 등장한다 (caret 제거)', () => {
    const { container } = render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={true}
      />,
    )
    act(() => {
      vi.advanceTimersByTime(400)
    })
    const nameField = screen.getByTestId('cargo-name-field')
    const remarkField = screen.getByTestId('cargo-remark-field')
    expect(within(nameField).getByText(CARGO.name)).toBeInTheDocument()
    expect(within(remarkField).getByText(CARGO.remark)).toBeInTheDocument()
    expect(container.querySelectorAll('[data-caret]').length).toBe(0)
  })

  it('차량 타입/중량 필드는 active=true 여도 fill-in 대상이 아니다 (pre-filled 유지)', () => {
    render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={true}
      />,
    )
    // 차량 타입/중량은 active 와 무관하게 즉시 noticeable (trigger 에 즉시 노출)
    const vehicleTrigger = screen.getByTestId('cargo-vehicle-type-trigger')
    const weightTrigger = screen.getByTestId('cargo-weight-trigger')
    expect(vehicleTrigger.textContent).toMatch(VEHICLE.type)
    expect(weightTrigger.textContent).toMatch(VEHICLE.weight)
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-DROP — #7 dropdown 펼침 연출
// ---------------------------------------------------------------------------

describe('CargoInfoForm — TC-DASH3-UNIT-DROP (#7 dropdown)', () => {
  it('dropdownBeat 미지정 시 모든 select 가 닫힘 상태 (data-expanded="false")', () => {
    render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
      />,
    )
    expect(
      screen.getByTestId('cargo-vehicle-type-trigger'),
    ).toHaveAttribute('data-expanded', 'false')
    expect(
      screen.getByTestId('cargo-weight-trigger'),
    ).toHaveAttribute('data-expanded', 'false')
  })

  it('dropdownBeat.triggerAt=null 시 닫힘 상태 유지', () => {
    render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
        dropdownBeat={{ targetId: 'vehicle-type', triggerAt: null }}
      />,
    )
    expect(
      screen.getByTestId('cargo-vehicle-type-trigger'),
    ).toHaveAttribute('data-expanded', 'false')
  })

  it('dropdownBeat.triggerAt=0 시 mount 직후 targetId select 가 펼침 상태 (data-expanded="true")', () => {
    render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
        dropdownBeat={{ targetId: 'vehicle-type', triggerAt: 0 }}
      />,
    )
    act(() => {
      vi.advanceTimersByTime(0)
    })
    expect(
      screen.getByTestId('cargo-vehicle-type-trigger'),
    ).toHaveAttribute('data-expanded', 'true')
  })

  it('targetId 가 "weight" 일 때는 중량 select 만 펼침', () => {
    render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
        dropdownBeat={{ targetId: 'weight', triggerAt: 0 }}
      />,
    )
    act(() => {
      vi.advanceTimersByTime(0)
    })
    expect(
      screen.getByTestId('cargo-weight-trigger'),
    ).toHaveAttribute('data-expanded', 'true')
    expect(
      screen.getByTestId('cargo-vehicle-type-trigger'),
    ).toHaveAttribute('data-expanded', 'false')
  })

  it('트리거 발동 후 600ms 이내에는 펼침 유지', () => {
    render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
        dropdownBeat={{ targetId: 'vehicle-type', triggerAt: 0 }}
      />,
    )
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(
      screen.getByTestId('cargo-vehicle-type-trigger'),
    ).toHaveAttribute('data-expanded', 'true')
  })

  it('트리거 발동 후 600ms 경과 시 닫힘 상태로 복귀', () => {
    render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
        dropdownBeat={{ targetId: 'vehicle-type', triggerAt: 0 }}
      />,
    )
    act(() => {
      vi.advanceTimersByTime(600)
    })
    expect(
      screen.getByTestId('cargo-vehicle-type-trigger'),
    ).toHaveAttribute('data-expanded', 'false')
  })

  it('triggerAt=100 시 초기 100ms 이전에는 닫힘, 100ms 경과 후 펼침', () => {
    render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
        dropdownBeat={{ targetId: 'vehicle-type', triggerAt: 100 }}
      />,
    )
    // mount 직후 99ms: 아직 발동 전
    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(
      screen.getByTestId('cargo-vehicle-type-trigger'),
    ).toHaveAttribute('data-expanded', 'false')
    // 추가 60ms → 총 110ms 경과: 발동됨
    act(() => {
      vi.advanceTimersByTime(60)
    })
    expect(
      screen.getByTestId('cargo-vehicle-type-trigger'),
    ).toHaveAttribute('data-expanded', 'true')
  })

  it('펼침 영역에 옵션 하이라이트 마커(data-highlight="true") 가 노출된다', () => {
    const { container } = render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
        dropdownBeat={{ targetId: 'vehicle-type', triggerAt: 0 }}
      />,
    )
    act(() => {
      vi.advanceTimersByTime(0)
    })
    // 펼침 중 하이라이트 마커 존재
    expect(
      container.querySelector(
        '[data-dropdown="vehicle-type"] [data-highlight="true"]',
      ),
    ).not.toBeNull()
  })

  it('닫힘 상태에서는 하이라이트 마커가 노출되지 않는다', () => {
    const { container } = render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
      />,
    )
    expect(
      container.querySelector('[data-highlight="true"]'),
    ).toBeNull()
  })

  it('targetId 가 유효하지 않은 값이면 어떤 select 도 펼침 상태가 되지 않는다', () => {
    render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
        // @ts-expect-error invalid targetId purposely
        dropdownBeat={{ targetId: 'unknown', triggerAt: 0 }}
      />,
    )
    act(() => {
      vi.advanceTimersByTime(0)
    })
    expect(
      screen.getByTestId('cargo-vehicle-type-trigger'),
    ).toHaveAttribute('data-expanded', 'false')
    expect(
      screen.getByTestId('cargo-weight-trigger'),
    ).toHaveAttribute('data-expanded', 'false')
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-CARGOFORM — 구조 / landing 팔레트 / 접근성
// ---------------------------------------------------------------------------

describe('CargoInfoForm — TC-DASH3-UNIT-CARGOFORM (구조 / landing 팔레트 / 접근성)', () => {
  it('카드 className 은 landing 팔레트 (bg-card/50 border-border) 를 가진다 (T-THEME-13 토큰 치환; 원본: bg-white/5 border-white/10)', () => {
    render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
      />,
    )
    const card = screen.getByTestId('cargo-info-form')
    expect(card.className).toMatch(/bg-card\/50/)
    expect(card.className).toMatch(/border-border(?![a-z-])/)
  })

  it('role="region" + aria-label "화물 정보" 로 landmark 를 제공한다', () => {
    render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
      />,
    )
    expect(
      screen.getByRole('region', { name: '화물 정보' }),
    ).toBeInTheDocument()
  })

  it('Container(화물) 아이콘이 헤더에 렌더된다 (data-icon="container")', () => {
    const { container } = render(
      <CargoInfoForm
        vehicle={VEHICLE}
        cargo={CARGO}
        active={false}
      />,
    )
    expect(container.querySelector('[data-icon="container"]')).not.toBeNull()
  })
})
