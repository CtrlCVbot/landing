/**
 * T-DASH3-M3-07 — TransportOptionCard 단위 테스트
 *
 * TC
 *  - TC-DASH3-UNIT-TRANSOPT (8옵션 렌더 + 체크 표시 + 한국어 라벨)
 *  - TC-DASH3-UNIT-STROKE (#9 SVG stroke-dashoffset 애니, strokeTargets 필터)
 *
 * REQ
 *  - REQ-DASH3-004 (OrderForm 컴포넌트 복제 매니페스트 — TransportOptionCard)
 *  - REQ-DASH3-028 (#9 stroke 애니 — 8 옵션 중 active 항목 체크 마크 그리기)
 *  - REQ-DASH3-011 (mock-data.formData.options — 8 bool 필드)
 *  - REQ-DASH-005 (landing 팔레트 일관성)
 *  - REQ-DASH-007 (접근성)
 *
 * 범위
 *  - stateless. options(8 bool) + strokeTargets + strokeTriggerAt prop 주입.
 *  - options[key]=true 시 체크 마크 SVG polyline 노출.
 *  - strokeTargets 배열에 포함된 옵션만 stroke-dashoffset 애니 (AI_APPLY beat 시).
 *  - strokeTargets 미포함 시 정적 체크(즉시 dashoffset=0).
 *  - 원본 mm-broker `transport-option-card.tsx` 의 OptionSelector/Checkbox 제거 — SVG polyline 으로 대체.
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

import { TransportOptionCard } from '@/components/dashboard-preview/ai-register-main/order-form/transport-option-card'
import type { TransportOptions } from '@/lib/mock-data'

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
// Fixtures — OPTIONS_MOCK 수준의 예시 (direct+forklift=true)
// ---------------------------------------------------------------------------

const OPTIONS_ALL_FALSE: TransportOptions = {
  fast: false,
  roundTrip: false,
  direct: false,
  trace: false,
  forklift: false,
  manual: false,
  cod: false,
  special: false,
}

const OPTIONS_DIRECT_FORKLIFT: TransportOptions = {
  fast: false,
  roundTrip: false,
  direct: true,
  trace: false,
  forklift: true,
  manual: false,
  cod: false,
  special: false,
}

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
// TC-DASH3-UNIT-TRANSOPT — 8 옵션 렌더
// ---------------------------------------------------------------------------

describe('TransportOptionCard — TC-DASH3-UNIT-TRANSOPT (8 옵션 렌더)', () => {
  it('8개 옵션 항목이 렌더된다 (fast/roundTrip/direct/trace/forklift/manual/cod/special)', () => {
    render(<TransportOptionCard options={OPTIONS_ALL_FALSE} />)
    const keys: Array<keyof TransportOptions> = [
      'fast',
      'roundTrip',
      'direct',
      'trace',
      'forklift',
      'manual',
      'cod',
      'special',
    ]
    keys.forEach((key) => {
      expect(screen.getByTestId(`transport-option-${key}`)).toBeInTheDocument()
    })
  })

  it('한국어 라벨이 각 옵션에 노출된다 (급송/왕복/직행/이력/지게차/수작업/착불/특수)', () => {
    render(<TransportOptionCard options={OPTIONS_ALL_FALSE} />)
    const labels: Array<{ key: keyof TransportOptions; label: string }> = [
      { key: 'fast', label: '급송' },
      { key: 'roundTrip', label: '왕복' },
      { key: 'direct', label: '직행' },
      { key: 'trace', label: '이력' },
      { key: 'forklift', label: '지게차' },
      { key: 'manual', label: '수작업' },
      { key: 'cod', label: '착불' },
      { key: 'special', label: '특수' },
    ]
    labels.forEach(({ key, label }) => {
      const item = screen.getByTestId(`transport-option-${key}`)
      expect(within(item).getByText(label)).toBeInTheDocument()
    })
  })

  it('options.direct=true, options.forklift=true 시 해당 옵션만 data-checked="true"', () => {
    render(<TransportOptionCard options={OPTIONS_DIRECT_FORKLIFT} />)
    expect(
      screen.getByTestId('transport-option-direct'),
    ).toHaveAttribute('data-checked', 'true')
    expect(
      screen.getByTestId('transport-option-forklift'),
    ).toHaveAttribute('data-checked', 'true')
    // 체크되지 않은 옵션
    expect(
      screen.getByTestId('transport-option-fast'),
    ).toHaveAttribute('data-checked', 'false')
    expect(
      screen.getByTestId('transport-option-cod'),
    ).toHaveAttribute('data-checked', 'false')
  })

  it('모든 옵션이 false 일 때 어떤 항목도 data-checked="true" 상태가 아니다', () => {
    render(<TransportOptionCard options={OPTIONS_ALL_FALSE} />)
    const keys: Array<keyof TransportOptions> = [
      'fast',
      'roundTrip',
      'direct',
      'trace',
      'forklift',
      'manual',
      'cod',
      'special',
    ]
    keys.forEach((key) => {
      expect(
        screen.getByTestId(`transport-option-${key}`),
      ).toHaveAttribute('data-checked', 'false')
    })
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-STROKE — #9 SVG stroke-dashoffset 애니
// ---------------------------------------------------------------------------

describe('TransportOptionCard — TC-DASH3-UNIT-STROKE (#9 stroke 애니)', () => {
  it('options[key]=true + strokeTargets 미포함 시 정적 체크 (dashoffset=0, no anim)', () => {
    render(
      <TransportOptionCard
        options={OPTIONS_DIRECT_FORKLIFT}
        strokeTargets={[]}
        strokeTriggerAt={null}
      />,
    )
    const direct = screen.getByTestId('transport-option-direct')
    const polyline = direct.querySelector('polyline')
    expect(polyline).not.toBeNull()
    // 정적 체크 — strokeDashoffset="0" (체크 완성)
    expect(polyline).toHaveAttribute('data-animating', 'false')
    expect(polyline?.getAttribute('stroke-dashoffset')).toBe('0')
  })

  it('strokeTargets=["direct"] + strokeTriggerAt=null 시 아직 애니 미시작 (dashoffset=20)', () => {
    render(
      <TransportOptionCard
        options={OPTIONS_DIRECT_FORKLIFT}
        strokeTargets={['direct']}
        strokeTriggerAt={null}
      />,
    )
    const direct = screen.getByTestId('transport-option-direct')
    const polyline = direct.querySelector('polyline')
    // strokeTargets 포함 + triggerAt=null → 애니 대기 상태 (offset=20)
    expect(polyline?.getAttribute('stroke-dashoffset')).toBe('20')
  })

  it('strokeTargets=["direct"] + strokeTriggerAt=0 시 trigger 경과 후 dashoffset=0 수렴', () => {
    render(
      <TransportOptionCard
        options={OPTIONS_DIRECT_FORKLIFT}
        strokeTargets={['direct']}
        strokeTriggerAt={0}
      />,
    )
    act(() => {
      vi.advanceTimersByTime(0)
    })
    const direct = screen.getByTestId('transport-option-direct')
    const polyline = direct.querySelector('polyline')
    expect(polyline?.getAttribute('stroke-dashoffset')).toBe('0')
  })

  it('strokeTargets=["direct"] + strokeTriggerAt=100 시 100ms 이전에는 dashoffset=20, 경과 후 dashoffset=0', () => {
    render(
      <TransportOptionCard
        options={OPTIONS_DIRECT_FORKLIFT}
        strokeTargets={['direct']}
        strokeTriggerAt={100}
      />,
    )
    // 초기 50ms — 아직 발동 전
    act(() => {
      vi.advanceTimersByTime(50)
    })
    const direct = screen.getByTestId('transport-option-direct')
    let polyline = direct.querySelector('polyline')
    expect(polyline?.getAttribute('stroke-dashoffset')).toBe('20')
    // 추가 60ms → 총 110ms 경과: 발동됨
    act(() => {
      vi.advanceTimersByTime(60)
    })
    polyline = direct.querySelector('polyline')
    expect(polyline?.getAttribute('stroke-dashoffset')).toBe('0')
  })

  it('strokeTargets 에 미포함된 옵션은 options[key]=true 여도 정적 (dashoffset=0)', () => {
    render(
      <TransportOptionCard
        options={OPTIONS_DIRECT_FORKLIFT}
        strokeTargets={['direct']}
        strokeTriggerAt={0}
      />,
    )
    act(() => {
      vi.advanceTimersByTime(0)
    })
    // forklift 는 strokeTargets 에 없음 → 정적 체크
    const forklift = screen.getByTestId('transport-option-forklift')
    const polyline = forklift.querySelector('polyline')
    expect(polyline?.getAttribute('data-animating')).toBe('false')
    expect(polyline?.getAttribute('stroke-dashoffset')).toBe('0')
  })

  it('options[key]=false 인 옵션은 strokeTargets 포함 여부와 무관하게 dashoffset=20 (체크 없음)', () => {
    render(
      <TransportOptionCard
        options={OPTIONS_ALL_FALSE}
        strokeTargets={['direct']}
        strokeTriggerAt={0}
      />,
    )
    act(() => {
      vi.advanceTimersByTime(0)
    })
    // direct 는 options=false → polyline 은 체크 없음 상태 (dashoffset=20)
    const direct = screen.getByTestId('transport-option-direct')
    const polyline = direct.querySelector('polyline')
    expect(polyline?.getAttribute('stroke-dashoffset')).toBe('20')
  })

  it('strokeTargets 미지정 시 options=true 모든 항목이 정적 체크 (기본 동작)', () => {
    render(<TransportOptionCard options={OPTIONS_DIRECT_FORKLIFT} />)
    const direct = screen.getByTestId('transport-option-direct')
    const forklift = screen.getByTestId('transport-option-forklift')
    expect(direct.querySelector('polyline')?.getAttribute('stroke-dashoffset')).toBe('0')
    expect(forklift.querySelector('polyline')?.getAttribute('stroke-dashoffset')).toBe('0')
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-TRANSOPT — 구조 / landing 팔레트 / 접근성
// ---------------------------------------------------------------------------

describe('TransportOptionCard — TC-DASH3-UNIT-TRANSOPT (구조 / landing 팔레트 / 접근성)', () => {
  it('카드 className 은 landing 팔레트 (bg-white/5 border-white/10 rounded-xl) 를 가진다', () => {
    render(<TransportOptionCard options={OPTIONS_ALL_FALSE} />)
    const card = screen.getByTestId('transport-option-card')
    expect(card.className).toMatch(/bg-white\/5/)
    expect(card.className).toMatch(/border-white\/10/)
    expect(card.className).toMatch(/rounded-xl/)
  })

  it('role="group" + aria-label "운송 옵션" 로 landmark 를 제공한다', () => {
    render(<TransportOptionCard options={OPTIONS_ALL_FALSE} />)
    expect(
      screen.getByRole('group', { name: '운송 옵션' }),
    ).toBeInTheDocument()
  })

  it('제목 "운송 옵션" 이 노출되고 lucide 아이콘이 함께 렌더된다', () => {
    render(<TransportOptionCard options={OPTIONS_ALL_FALSE} />)
    const card = screen.getByTestId('transport-option-card')
    expect(within(card).getByText('운송 옵션')).toBeInTheDocument()
    // 헤더 아이콘 (data-icon="options")
    expect(card.querySelector('[data-icon="options"]')).not.toBeNull()
  })

  it('체크된 polyline 은 stroke-accent 클래스, 체크 안된 polyline 은 stroke-gray-600 클래스를 가진다', () => {
    render(<TransportOptionCard options={OPTIONS_DIRECT_FORKLIFT} />)
    const direct = screen.getByTestId('transport-option-direct')
    const fast = screen.getByTestId('transport-option-fast')
    expect(direct.querySelector('polyline')?.getAttribute('class')).toMatch(/stroke-accent/)
    expect(fast.querySelector('polyline')?.getAttribute('class')).toMatch(/stroke-gray-600/)
  })
})
