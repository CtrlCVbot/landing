/**
 * T-DASH3-M2-06 — AiButtonItem 단위 테스트
 *
 * TC
 *  - TC-DASH3-UNIT-BTNITM
 *
 * REQ
 *  - REQ-DASH3-003 (AiPanel 컴포넌트 복제 매니페스트 — AiButtonItem)
 *  - REQ-DASH3-021 (#3 조작감 — 버튼 press)
 *  - REQ-DASH3-025 (#4 조작감 — 클릭 ripple wave)
 *
 * 범위
 *  - 3 상태(pending / applied / unavailable) 시각 표현.
 *  - #3 use-button-press 훅 연동 (pressTriggerAt 자동 press, data-pressed 속성).
 *  - #4 use-ripple 훅 연동 (클릭 시 ripple DOM 추가, 300ms 후 제거, unavailable 시 미트리거).
 *  - 원본 `ai-button-item.tsx` (mm-broker) 의 3 상태 시각만 landing Phase 3 demo 용으로 복제.
 *    (실제 폼 적용/확인 로직, Popover/Tooltip 은 stateless 원칙상 제거)
 *
 * 주의
 *  - jsdom 에서 getBoundingClientRect 는 0 을 반환하므로 ripple 좌표는 smoke test 만 수행.
 */

import { render, screen, fireEvent, act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AiButtonItem } from '@/components/dashboard-preview/ai-register-main/ai-panel/ai-button-item'
import type { AiCategoryButton } from '@/lib/mock-data'

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

const PENDING_BUTTON: AiCategoryButton = {
  id: 'btn-departure-address1',
  fieldKey: 'departure-address1',
  label: '주소',
  displayValue: '서울 강남구 물류센터',
  status: 'pending',
  evidenceSnippet: '서울 강남구 물류센터',
} as const

const APPLIED_BUTTON: AiCategoryButton = {
  id: 'btn-fare-amount',
  fieldKey: 'fare-amount',
  label: '운임',
  displayValue: '420,000원',
  status: 'applied',
} as const

const UNAVAILABLE_BUTTON: AiCategoryButton = {
  id: 'btn-cargo-quantity',
  fieldKey: 'cargo-quantity',
  label: '수량',
  displayValue: '',
  status: 'unavailable',
  unavailableReason: '메시지에 수량 정보가 없습니다.',
} as const

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
// TC-DASH3-UNIT-BTNITM — status=pending
// ---------------------------------------------------------------------------

describe('AiButtonItem — TC-DASH3-UNIT-BTNITM (status=pending)', () => {
  it('label + displayValue 를 모두 렌더한다', () => {
    render(<AiButtonItem button={PENDING_BUTTON} groupId="departure" />)
    const btn = screen.getByTestId(`ai-button-item-${PENDING_BUTTON.id}`)
    expect(btn).toHaveTextContent('주소')
    expect(btn).toHaveTextContent('서울 강남구 물류센터')
  })

  it('accent 계열 border/text className 을 가진다 (pending 시각)', () => {
    render(<AiButtonItem button={PENDING_BUTTON} groupId="departure" />)
    const btn = screen.getByTestId(`ai-button-item-${PENDING_BUTTON.id}`)
    // landing 팔레트: accent 색 사용
    expect(btn.className).toMatch(/border-accent|text-accent|ring-accent/)
  })

  it('클릭 시 onApply 콜백이 button.id 와 함께 호출된다', () => {
    const onApply = vi.fn()
    render(
      <AiButtonItem
        button={PENDING_BUTTON}
        groupId="departure"
        onApply={onApply}
      />,
    )
    const btn = screen.getByTestId(`ai-button-item-${PENDING_BUTTON.id}`)
    fireEvent.click(btn)
    expect(onApply).toHaveBeenCalledTimes(1)
    expect(onApply).toHaveBeenCalledWith(PENDING_BUTTON.id)
  })

  it('unavailableReason hint 를 표시하지 않는다', () => {
    render(<AiButtonItem button={PENDING_BUTTON} groupId="departure" />)
    expect(
      screen.queryByTestId(`ai-button-item-reason-${PENDING_BUTTON.id}`),
    ).not.toBeInTheDocument()
  })

  it('disabled=false (조작 가능)', () => {
    render(<AiButtonItem button={PENDING_BUTTON} groupId="departure" />)
    const btn = screen.getByTestId(`ai-button-item-${PENDING_BUTTON.id}`)
    expect(btn).not.toBeDisabled()
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-BTNITM — status=applied
// ---------------------------------------------------------------------------

describe('AiButtonItem — TC-DASH3-UNIT-BTNITM (status=applied)', () => {
  it('lucide Check 아이콘이 렌더된다', () => {
    const { container } = render(
      <AiButtonItem button={APPLIED_BUTTON} groupId="fare" />,
    )
    // lucide-react Check 아이콘은 svg.lucide-check 클래스로 렌더됨
    expect(container.querySelector('.lucide-check')).not.toBeNull()
  })

  it('green 계열 color className 을 가진다', () => {
    render(<AiButtonItem button={APPLIED_BUTTON} groupId="fare" />)
    const btn = screen.getByTestId(`ai-button-item-${APPLIED_BUTTON.id}`)
    expect(btn.className).toMatch(/green/)
  })

  it('label + displayValue 를 모두 렌더한다 (applied 시에도 텍스트 유지)', () => {
    render(<AiButtonItem button={APPLIED_BUTTON} groupId="fare" />)
    const btn = screen.getByTestId(`ai-button-item-${APPLIED_BUTTON.id}`)
    expect(btn).toHaveTextContent('운임')
    expect(btn).toHaveTextContent('420,000원')
  })

  it('disabled=false — onApply 재호출 가능 (취소/토글 용)', () => {
    const onApply = vi.fn()
    render(
      <AiButtonItem
        button={APPLIED_BUTTON}
        groupId="fare"
        onApply={onApply}
      />,
    )
    const btn = screen.getByTestId(`ai-button-item-${APPLIED_BUTTON.id}`)
    expect(btn).not.toBeDisabled()
    fireEvent.click(btn)
    expect(onApply).toHaveBeenCalledWith(APPLIED_BUTTON.id)
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-BTNITM — status=unavailable
// ---------------------------------------------------------------------------

describe('AiButtonItem — TC-DASH3-UNIT-BTNITM (status=unavailable)', () => {
  it('disabled=true 로 렌더된다', () => {
    render(<AiButtonItem button={UNAVAILABLE_BUTTON} groupId="cargo" />)
    const btn = screen.getByTestId(`ai-button-item-${UNAVAILABLE_BUTTON.id}`)
    expect(btn).toBeDisabled()
  })

  it('muted/회색 계열 className 을 가진다', () => {
    render(<AiButtonItem button={UNAVAILABLE_BUTTON} groupId="cargo" />)
    const btn = screen.getByTestId(`ai-button-item-${UNAVAILABLE_BUTTON.id}`)
    expect(btn.className).toMatch(/opacity-|muted|text-white\/40|bg-white\/5/)
  })

  it('unavailableReason 이 있으면 hint 요소가 렌더된다', () => {
    render(<AiButtonItem button={UNAVAILABLE_BUTTON} groupId="cargo" />)
    const reason = screen.getByTestId(
      `ai-button-item-reason-${UNAVAILABLE_BUTTON.id}`,
    )
    expect(reason).toHaveTextContent('메시지에 수량 정보가 없습니다.')
  })

  it('unavailableReason 이 없으면 hint 요소가 없다', () => {
    const button: AiCategoryButton = {
      ...UNAVAILABLE_BUTTON,
      unavailableReason: undefined,
    }
    render(<AiButtonItem button={button} groupId="cargo" />)
    expect(
      screen.queryByTestId(`ai-button-item-reason-${button.id}`),
    ).not.toBeInTheDocument()
  })

  it('클릭해도 onApply 가 호출되지 않는다', () => {
    const onApply = vi.fn()
    render(
      <AiButtonItem
        button={UNAVAILABLE_BUTTON}
        groupId="cargo"
        onApply={onApply}
      />,
    )
    const btn = screen.getByTestId(`ai-button-item-${UNAVAILABLE_BUTTON.id}`)
    fireEvent.click(btn)
    expect(onApply).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-BTNITM — 조작감 #3 button-press
// ---------------------------------------------------------------------------

describe('AiButtonItem — #3 button-press (REQ-DASH3-021)', () => {
  it('pressTriggerAt 경과 시 data-pressed="true" 로 전환된다', () => {
    render(
      <AiButtonItem
        button={PENDING_BUTTON}
        groupId="departure"
        pressTriggerAt={200}
      />,
    )
    const btn = screen.getByTestId(`ai-button-item-${PENDING_BUTTON.id}`)
    expect(btn).toHaveAttribute('data-pressed', 'false')

    // pressTriggerAt (200ms) 경과
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(btn).toHaveAttribute('data-pressed', 'true')

    // pressDurationMs(150) 경과 후 복귀
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(btn).toHaveAttribute('data-pressed', 'false')
  })

  it('pressTriggerAt=null 이면 자동 press 가 발생하지 않는다', () => {
    render(
      <AiButtonItem
        button={PENDING_BUTTON}
        groupId="departure"
        pressTriggerAt={null}
      />,
    )
    const btn = screen.getByTestId(`ai-button-item-${PENDING_BUTTON.id}`)
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(btn).toHaveAttribute('data-pressed', 'false')
  })

  it('data-pressed 속성이 항상 존재한다 (초기 false)', () => {
    render(<AiButtonItem button={PENDING_BUTTON} groupId="departure" />)
    const btn = screen.getByTestId(`ai-button-item-${PENDING_BUTTON.id}`)
    expect(btn).toHaveAttribute('data-pressed')
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-BTNITM — 조작감 #4 ripple
// ---------------------------------------------------------------------------

describe('AiButtonItem — #4 ripple (REQ-DASH3-025)', () => {
  it('클릭 시 ripple 요소가 DOM 에 추가된다 (smoke test)', () => {
    const { container } = render(
      <AiButtonItem button={PENDING_BUTTON} groupId="departure" />,
    )
    const btn = screen.getByTestId(`ai-button-item-${PENDING_BUTTON.id}`)

    // 클릭 전: ripple wrapper 없음
    expect(container.querySelectorAll('[data-ripple]').length).toBe(0)

    fireEvent.click(btn)

    // 클릭 후: ripple 요소 1개 이상
    expect(container.querySelectorAll('[data-ripple]').length).toBeGreaterThan(
      0,
    )
  })

  it('ripple 은 300ms 후 자동 제거된다', () => {
    const { container } = render(
      <AiButtonItem button={PENDING_BUTTON} groupId="departure" />,
    )
    const btn = screen.getByTestId(`ai-button-item-${PENDING_BUTTON.id}`)

    fireEvent.click(btn)
    expect(container.querySelectorAll('[data-ripple]').length).toBeGreaterThan(
      0,
    )

    // 300ms 경과
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(container.querySelectorAll('[data-ripple]').length).toBe(0)
  })

  it('unavailable 상태에서는 클릭해도 ripple 이 생성되지 않는다', () => {
    const { container } = render(
      <AiButtonItem button={UNAVAILABLE_BUTTON} groupId="cargo" />,
    )
    const btn = screen.getByTestId(`ai-button-item-${UNAVAILABLE_BUTTON.id}`)
    fireEvent.click(btn)
    expect(container.querySelectorAll('[data-ripple]').length).toBe(0)
  })

  it('applied 상태에서도 ripple 이 생성된다 (pending/applied 모두 허용)', () => {
    const { container } = render(
      <AiButtonItem button={APPLIED_BUTTON} groupId="fare" />,
    )
    const btn = screen.getByTestId(`ai-button-item-${APPLIED_BUTTON.id}`)
    fireEvent.click(btn)
    expect(container.querySelectorAll('[data-ripple]').length).toBeGreaterThan(
      0,
    )
  })
})

// ---------------------------------------------------------------------------
// M4-02 — AiButtonItem 자동 ripple 트리거 (rippleTriggerAt 구동)
// ---------------------------------------------------------------------------

describe('AiButtonItem — M4-02 자동 ripple (rippleTriggerAt)', () => {
  beforeEach(() => {
    mockMatchMedia(false)
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('rippleTriggerAt=0 이면 mount 즉시 센터 ripple 이 자동 생성된다', () => {
    const { container } = render(
      <AiButtonItem
        button={PENDING_BUTTON}
        groupId="departure"
        rippleTriggerAt={0}
      />,
    )
    // mount 시점의 rAF/setTimeout 예약 처리.
    act(() => {
      vi.advanceTimersByTime(0)
    })
    expect(container.querySelectorAll('[data-ripple]').length).toBeGreaterThan(
      0,
    )
  })

  it('rippleTriggerAt=300 이면 300ms 경과 후에 자동 ripple 생성', () => {
    const { container } = render(
      <AiButtonItem
        button={PENDING_BUTTON}
        groupId="destination"
        rippleTriggerAt={300}
      />,
    )

    // 299ms: 아직 미생성
    act(() => {
      vi.advanceTimersByTime(299)
    })
    expect(container.querySelectorAll('[data-ripple]').length).toBe(0)

    // 300ms: 자동 생성
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(container.querySelectorAll('[data-ripple]').length).toBeGreaterThan(
      0,
    )
  })

  it('rippleTriggerAt=null 이면 자동 ripple 이 생성되지 않는다', () => {
    const { container } = render(
      <AiButtonItem
        button={PENDING_BUTTON}
        groupId="departure"
        rippleTriggerAt={null}
      />,
    )
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(container.querySelectorAll('[data-ripple]').length).toBe(0)
  })

  it('unavailable 상태에서는 rippleTriggerAt 이 지정되어도 ripple 미생성', () => {
    const { container } = render(
      <AiButtonItem
        button={UNAVAILABLE_BUTTON}
        groupId="cargo"
        rippleTriggerAt={0}
      />,
    )
    act(() => {
      vi.advanceTimersByTime(0)
    })
    expect(container.querySelectorAll('[data-ripple]').length).toBe(0)
  })
})
