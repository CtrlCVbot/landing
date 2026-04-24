/**
 * T-DASH3-M2-05 — AiResultButtons 단위 테스트
 *
 * TC
 *  - TC-DASH3-UNIT-RESBT: 4 카테고리 그룹 렌더 + lucide 아이콘 + extractState 조건부
 *  - TC-DASH3-UNIT-HOVER: #5 CSS only hover (hover:bg-white/10 + transition-colors)
 *
 * REQ
 *  - REQ-DASH3-003 (AiPanel 컴포넌트 복제 매니페스트 — AiResultButtons)
 *  - REQ-DASH3-026 (카테고리 그룹 4종 — departure / destination / cargo / fare)
 *  - REQ-DASH-006  (#5 hover 미세 전환)
 *
 * 범위
 *  - AiResultButtons 는 stateless dumb component.
 *  - 개별 버튼은 renderButton prop 을 통해 M2-06 에서 AiButtonItem 을 주입 (본 TASK 는 슬롯만).
 *  - extractState === 'resultReady' 에서만 buttons 렌더, idle/loading 에선 placeholder.
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { AiResultButtons } from '@/components/dashboard-preview/ai-register-main/ai-panel/ai-result-buttons'
import type { AiCategoryButton, AiCategoryGroup } from '@/lib/mock-data'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const MOCK_CATEGORIES: ReadonlyArray<AiCategoryGroup> = [
  {
    id: 'departure',
    label: '상차지',
    icon: 'MapPin',
    buttons: [
      {
        id: 'btn-dep-addr',
        fieldKey: 'departure-address1',
        label: '주소',
        displayValue: '서울 강남구 물류센터',
        status: 'pending',
      },
    ],
  },
  {
    id: 'destination',
    label: '하차지',
    icon: 'Flag',
    buttons: [
      {
        id: 'btn-dst-addr',
        fieldKey: 'destination-address1',
        label: '주소',
        displayValue: '대전 유성구 산업단지',
        status: 'pending',
      },
    ],
  },
  {
    id: 'cargo',
    label: '화물/차량',
    icon: 'Package',
    buttons: [
      {
        id: 'btn-cargo-type',
        fieldKey: 'cargo-vehicleType',
        label: '차량종류',
        displayValue: '카고 5톤',
        status: 'pending',
      },
    ],
  },
  {
    id: 'fare',
    label: '운임',
    icon: 'Banknote',
    buttons: [
      {
        id: 'btn-fare-amt',
        fieldKey: 'fare-amount',
        label: '운임',
        displayValue: '420,000원',
        status: 'pending',
      },
    ],
  },
] as const

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-RESBT — 4 카테고리 구조
// ---------------------------------------------------------------------------

describe('AiResultButtons — TC-DASH3-UNIT-RESBT', () => {
  it('categories 4개 모두 렌더 (departure / destination / cargo / fare)', () => {
    render(<AiResultButtons categories={MOCK_CATEGORIES} extractState="resultReady" />)

    expect(screen.getByTestId('ai-category-departure')).toBeInTheDocument()
    expect(screen.getByTestId('ai-category-destination')).toBeInTheDocument()
    expect(screen.getByTestId('ai-category-cargo')).toBeInTheDocument()
    expect(screen.getByTestId('ai-category-fare')).toBeInTheDocument()
  })

  it('카테고리 라벨 4개 모두 렌더 (그룹 헤더 범위)', () => {
    render(<AiResultButtons categories={MOCK_CATEGORIES} extractState="resultReady" />)

    // 카테고리 라벨은 각 그룹 컨테이너 안의 헤더로만 쿼리
    expect(screen.getByTestId('ai-category-departure')).toHaveTextContent('상차지')
    expect(screen.getByTestId('ai-category-destination')).toHaveTextContent('하차지')
    expect(screen.getByTestId('ai-category-cargo')).toHaveTextContent('화물/차량')
    expect(screen.getByTestId('ai-category-fare')).toHaveTextContent('운임')
  })

  it('카테고리 id=departure 에 MapPin 아이콘 (lucide-map-pin)', () => {
    const { container } = render(
      <AiResultButtons categories={MOCK_CATEGORIES} extractState="resultReady" />,
    )
    const group = container.querySelector('[data-testid="ai-category-departure"]')
    expect(group?.querySelector('.lucide-map-pin')).not.toBeNull()
  })

  it('카테고리 id=destination 에 Flag 아이콘 (lucide-flag)', () => {
    const { container } = render(
      <AiResultButtons categories={MOCK_CATEGORIES} extractState="resultReady" />,
    )
    const group = container.querySelector('[data-testid="ai-category-destination"]')
    expect(group?.querySelector('.lucide-flag')).not.toBeNull()
  })

  it('카테고리 id=cargo 에 Package 아이콘 (lucide-package)', () => {
    const { container } = render(
      <AiResultButtons categories={MOCK_CATEGORIES} extractState="resultReady" />,
    )
    const group = container.querySelector('[data-testid="ai-category-cargo"]')
    expect(group?.querySelector('.lucide-package')).not.toBeNull()
  })

  it('카테고리 id=fare 에 Banknote 아이콘 (lucide-banknote)', () => {
    const { container } = render(
      <AiResultButtons categories={MOCK_CATEGORIES} extractState="resultReady" />,
    )
    const group = container.querySelector('[data-testid="ai-category-fare"]')
    expect(group?.querySelector('.lucide-banknote')).not.toBeNull()
  })

  it('카테고리 라벨에 text-accent 클래스 (landing 팔레트)', () => {
    render(<AiResultButtons categories={MOCK_CATEGORIES} extractState="resultReady" />)
    const label = screen.getByText('상차지')
    expect(label).toHaveClass('text-accent')
  })

  it('그룹 컨테이너에 bg-card/50 border-border 클래스 (landing 팔레트 — T-THEME-09 토큰 치환; 원본: bg-white/5 border-white/10)', () => {
    render(<AiResultButtons categories={MOCK_CATEGORIES} extractState="resultReady" />)
    const group = screen.getByTestId('ai-category-departure')
    expect(group.className).toMatch(/bg-card\/50/)
    expect(group.className).toMatch(/border-border/)
  })

  it('extractState=idle 시 버튼 리스트 미렌더 (placeholder)', () => {
    render(<AiResultButtons categories={MOCK_CATEGORIES} extractState="idle" />)
    expect(screen.queryByTestId('ai-button-slot-btn-dep-addr')).not.toBeInTheDocument()
    expect(screen.queryByTestId('ai-button-slot-btn-fare-amt')).not.toBeInTheDocument()
  })

  it('extractState=loading 시 버튼 리스트 미렌더 (placeholder)', () => {
    render(<AiResultButtons categories={MOCK_CATEGORIES} extractState="loading" />)
    expect(screen.queryByTestId('ai-button-slot-btn-dep-addr')).not.toBeInTheDocument()
  })

  it('extractState=idle 시에도 카테고리 그룹 자체는 렌더됨 (구조 고정)', () => {
    render(<AiResultButtons categories={MOCK_CATEGORIES} extractState="idle" />)
    expect(screen.getByTestId('ai-category-departure')).toBeInTheDocument()
    expect(screen.getByTestId('ai-category-fare')).toBeInTheDocument()
  })

  it('extractState=resultReady 시 각 카테고리의 buttons 렌더 (default slot)', () => {
    render(<AiResultButtons categories={MOCK_CATEGORIES} extractState="resultReady" />)
    // default slot: 각 button 은 data-testid="ai-button-slot-{id}" 로 렌더
    expect(screen.getByTestId('ai-button-slot-btn-dep-addr')).toBeInTheDocument()
    expect(screen.getByTestId('ai-button-slot-btn-dst-addr')).toBeInTheDocument()
    expect(screen.getByTestId('ai-button-slot-btn-cargo-type')).toBeInTheDocument()
    expect(screen.getByTestId('ai-button-slot-btn-fare-amt')).toBeInTheDocument()
  })

  it('renderButton prop 전달 시 자식 커스텀 렌더', () => {
    const renderButton = vi.fn(
      (button: AiCategoryButton, _groupId: string) => (
        <div key={button.id} data-testid={`custom-${button.id}`}>
          {button.label}
        </div>
      ),
    )

    render(
      <AiResultButtons
        categories={MOCK_CATEGORIES}
        extractState="resultReady"
        renderButton={renderButton}
      />,
    )

    expect(screen.getByTestId('custom-btn-dep-addr')).toBeInTheDocument()
    expect(screen.getByTestId('custom-btn-fare-amt')).toBeInTheDocument()
    // 모든 카테고리의 모든 버튼에 대해 호출되어야 함 (4 카테고리 × 1 버튼 = 4 회)
    expect(renderButton).toHaveBeenCalledTimes(4)
  })

  it('renderButton 호출 시 groupId 두 번째 인자 전달', () => {
    const renderButton = vi.fn(
      (button: AiCategoryButton, _groupId: string) => (
        <div key={button.id} />
      ),
    )

    render(
      <AiResultButtons
        categories={MOCK_CATEGORIES}
        extractState="resultReady"
        renderButton={renderButton}
      />,
    )

    // departure 카테고리의 버튼 호출 — groupId='departure'
    const departureCall = renderButton.mock.calls.find(
      ([button]) => (button as AiCategoryButton).id === 'btn-dep-addr',
    )
    expect(departureCall?.[1]).toBe('departure')

    // fare 카테고리의 버튼 호출 — groupId='fare'
    const fareCall = renderButton.mock.calls.find(
      ([button]) => (button as AiCategoryButton).id === 'btn-fare-amt',
    )
    expect(fareCall?.[1]).toBe('fare')
  })

  it('카테고리 그룹에 role="group" + aria-label (접근성)', () => {
    render(<AiResultButtons categories={MOCK_CATEGORIES} extractState="resultReady" />)
    const group = screen.getByTestId('ai-category-departure')
    expect(group).toHaveAttribute('role', 'group')
    expect(group).toHaveAttribute('aria-label', expect.stringContaining('상차지'))
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-HOVER — #5 CSS only hover (REQ-DASH-006)
// ---------------------------------------------------------------------------

describe('AiResultButtons — TC-DASH3-UNIT-HOVER (#5 CSS only)', () => {
  it('default slot 버튼 컨테이너에 hover:bg-muted/50 className (T-THEME-09 토큰 치환; 원본: hover:bg-white/10)', () => {
    render(<AiResultButtons categories={MOCK_CATEGORIES} extractState="resultReady" />)
    const slot = screen.getByTestId('ai-button-slot-btn-dep-addr')
    expect(slot.className).toMatch(/hover:bg-muted\/50/)
  })

  it('default slot 버튼 컨테이너에 transition-colors className', () => {
    render(<AiResultButtons categories={MOCK_CATEGORIES} extractState="resultReady" />)
    const slot = screen.getByTestId('ai-button-slot-btn-dep-addr')
    expect(slot.className).toMatch(/transition-colors/)
  })

  it('모든 default slot 버튼에 hover + transition 적용 (T-THEME-09 토큰 치환)', () => {
    render(<AiResultButtons categories={MOCK_CATEGORIES} extractState="resultReady" />)
    const slots = [
      'ai-button-slot-btn-dep-addr',
      'ai-button-slot-btn-dst-addr',
      'ai-button-slot-btn-cargo-type',
      'ai-button-slot-btn-fare-amt',
    ]
    for (const id of slots) {
      const slot = screen.getByTestId(id)
      expect(slot.className).toMatch(/hover:bg-muted\/50/)
      expect(slot.className).toMatch(/transition-colors/)
    }
  })
})
