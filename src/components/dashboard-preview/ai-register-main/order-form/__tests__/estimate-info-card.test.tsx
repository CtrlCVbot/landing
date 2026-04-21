/**
 * T-DASH3-M3-08 — EstimateInfoCard 단위 테스트
 *
 * TC
 *  - TC-DASH3-UNIT-ESTINFO (3 수치 렌더 + 단위 + 자동 배차 토글 + landing 팔레트 + 접근성)
 *  - TC-DASH3-UNIT-ROLL 적용 (#8 number-rolling — 0→target 롤링 애니)
 *
 * REQ
 *  - REQ-DASH3-004 (OrderForm 컴포넌트 복제 매니페스트 — EstimateInfoCard)
 *  - REQ-DASH3-023 (#8 number-rolling — 운임/거리/소요 0→target)
 *  - REQ-DASH-005 (landing 팔레트 일관성)
 *  - REQ-DASH-007 (접근성)
 *
 * 범위
 *  - stateless, distance/duration/amount/autoDispatch/active/rollingTriggerAt prop 주입.
 *  - active=false 시 최종값 즉시 정적 표시 (롤링 없음).
 *  - active=true + rollingTriggerAt 주입 시 0 → target 카운트업 애니메이션 (300~500ms).
 *  - 자동 배차 토글 ON/OFF 스타일 분기.
 *  - active=true 글로우: `ring-accent/30 + shadow-accent/10`.
 *
 * 원본 참조
 *  - mm-broker `estimate-info-card.tsx` — 거리/운임 숫자 강조 패턴.
 *    React Hook Form / Next.js Card 연동 제거, landing palette 로 재구성.
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

import { EstimateInfoCard } from '@/components/dashboard-preview/ai-register-main/order-form/estimate-info-card'

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
// rAF shim — jsdom 에서 useNumberRolling 이 사용하는 performance.now + rAF 를
// fake timer 로 제어한다 (use-number-rolling.test.ts 와 동일 패턴).
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
// Fixtures — mock-data ESTIMATE_MOCK 와 일치
// ---------------------------------------------------------------------------

const DISTANCE_KM = 360
const DURATION_MIN = 300
const AMOUNT_KRW = 850000

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
// TC-DASH3-UNIT-ESTINFO — 기본 렌더 (3 수치 + 단위 + 자동배차)
// ---------------------------------------------------------------------------

describe('EstimateInfoCard — TC-DASH3-UNIT-ESTINFO (기본 렌더)', () => {
  it('distance / duration / amount 3 수치가 모두 렌더된다 (active=false)', () => {
    render(
      <EstimateInfoCard
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        amount={AMOUNT_KRW}
        autoDispatch={true}
        active={false}
      />,
    )
    const card = screen.getByTestId('estimate-info-card')
    expect(card.textContent).toMatch(/360/)
    expect(card.textContent).toMatch(/300/)
    // 850,000 은 toLocaleString 포매팅을 허용 (850,000 또는 850000)
    expect(card.textContent).toMatch(/850[,.]?000/)
  })

  it('단위 표시 (km, 분, 원) 가 각 수치 옆에 노출된다', () => {
    render(
      <EstimateInfoCard
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        amount={AMOUNT_KRW}
        autoDispatch={true}
        active={false}
      />,
    )
    const card = screen.getByTestId('estimate-info-card')
    expect(card.textContent).toMatch(/km/i)
    expect(card.textContent).toMatch(/분/)
    expect(card.textContent).toMatch(/원/)
  })

  it('autoDispatch=true 시 자동 배차 토글이 ON 상태 (data-auto-dispatch="true")', () => {
    render(
      <EstimateInfoCard
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        amount={AMOUNT_KRW}
        autoDispatch={true}
        active={false}
      />,
    )
    const toggle = screen.getByTestId('estimate-auto-dispatch-toggle')
    expect(toggle).toHaveAttribute('data-auto-dispatch', 'true')
  })

  it('autoDispatch=false 시 자동 배차 토글이 OFF 상태 (data-auto-dispatch="false")', () => {
    render(
      <EstimateInfoCard
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        amount={AMOUNT_KRW}
        autoDispatch={false}
        active={false}
      />,
    )
    const toggle = screen.getByTestId('estimate-auto-dispatch-toggle')
    expect(toggle).toHaveAttribute('data-auto-dispatch', 'false')
  })

  it('ON 상태는 gradient 배경 (from-purple-600 to-blue-600) 을 적용한다', () => {
    render(
      <EstimateInfoCard
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        amount={AMOUNT_KRW}
        autoDispatch={true}
        active={false}
      />,
    )
    const toggle = screen.getByTestId('estimate-auto-dispatch-toggle')
    expect(toggle.className).toMatch(/from-purple-600/)
    expect(toggle.className).toMatch(/to-blue-600/)
    // landing 팔레트 — bg-gradient-to-r
    expect(toggle.className).toMatch(/bg-gradient-to-r/)
  })

  it('OFF 상태는 bg-white/10 배경을 적용한다 (gradient 없음)', () => {
    render(
      <EstimateInfoCard
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        amount={AMOUNT_KRW}
        autoDispatch={false}
        active={false}
      />,
    )
    const toggle = screen.getByTestId('estimate-auto-dispatch-toggle')
    expect(toggle.className).toMatch(/bg-white\/10/)
    expect(toggle.className).not.toMatch(/from-purple-600/)
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-ROLL — #8 number-rolling (0 → target 롤링 애니)
// ---------------------------------------------------------------------------

describe('EstimateInfoCard — TC-DASH3-UNIT-ROLL (#8 number-rolling)', () => {
  it('active=false 시 최종값이 즉시 정적 표시된다 (롤링 없음)', () => {
    render(
      <EstimateInfoCard
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        amount={AMOUNT_KRW}
        autoDispatch={true}
        active={false}
      />,
    )
    // 타이머 전진 없이 최종값이 즉시 렌더되어야 함
    const card = screen.getByTestId('estimate-info-card')
    expect(card.textContent).toMatch(/360/)
    expect(card.textContent).toMatch(/300/)
    expect(card.textContent).toMatch(/850[,.]?000/)
  })

  it('active=true + rollingTriggerAt=0 시 초기값 0 에서 시작하여 target 으로 수렴한다', () => {
    render(
      <EstimateInfoCard
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        amount={AMOUNT_KRW}
        autoDispatch={true}
        active={true}
        rollingTriggerAt={0}
      />,
    )
    // 초기: 0 (아직 target 미도달) — textContent 는 "0km" / "0원"
    const distanceEl = screen.getByTestId('estimate-info-distance')
    const amountEl = screen.getByTestId('estimate-info-amount')
    expect(distanceEl.textContent).not.toMatch(/360/)
    expect(amountEl.textContent).not.toMatch(/850/)

    // 충분한 시간 경과 후 target 도달
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(distanceEl.textContent).toMatch(/360/)
    expect(amountEl.textContent).toMatch(/850[,.]?000/)
  })

  it('롤링 duration 300~500ms 범위 (기본 400ms) 내에 target 에 도달한다', () => {
    render(
      <EstimateInfoCard
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        amount={AMOUNT_KRW}
        autoDispatch={true}
        active={true}
        rollingTriggerAt={0}
      />,
    )
    // 500ms 경과 — duration 상한 도달
    act(() => {
      vi.advanceTimersByTime(500)
    })
    const card = screen.getByTestId('estimate-info-card')
    expect(card.textContent).toMatch(/360/)
    expect(card.textContent).toMatch(/300/)
    expect(card.textContent).toMatch(/850[,.]?000/)
  })

  it('최종값이 mock-data 기준과 일치한다 (850000)', () => {
    render(
      <EstimateInfoCard
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        amount={AMOUNT_KRW}
        autoDispatch={true}
        active={true}
        rollingTriggerAt={0}
      />,
    )
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    const amountEl = screen.getByTestId('estimate-info-amount')
    expect(amountEl.textContent).toMatch(/850[,.]?000/)
  })

  it('rollingTriggerAt=null 시 active=true 여도 롤링 대기 (0 유지)', () => {
    render(
      <EstimateInfoCard
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        amount={AMOUNT_KRW}
        autoDispatch={true}
        active={true}
        rollingTriggerAt={null}
      />,
    )
    // 아직 trigger 미발동 — 초기 0 유지 (target 미반영)
    const distanceEl = screen.getByTestId('estimate-info-distance')
    expect(distanceEl.textContent).not.toMatch(/360/)
    // 실제 표시: "0km"
    expect(distanceEl.textContent?.startsWith('0')).toBe(true)
  })

  it('rollingTriggerAt=100 시 100ms 이전에는 0, 경과 후 롤링 시작', () => {
    render(
      <EstimateInfoCard
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        amount={AMOUNT_KRW}
        autoDispatch={true}
        active={true}
        rollingTriggerAt={100}
      />,
    )
    // 초기 50ms — 아직 trigger 미발동
    act(() => {
      vi.advanceTimersByTime(50)
    })
    let distanceEl = screen.getByTestId('estimate-info-distance')
    expect(distanceEl.textContent).not.toMatch(/360/)
    expect(distanceEl.textContent?.startsWith('0')).toBe(true)

    // 추가 60ms → 총 110ms: trigger 발동 (setTimeout 이 setTriggered 호출)
    act(() => {
      vi.advanceTimersByTime(60)
    })
    // 추가 1000ms → trigger 이후 re-render 로 등록된 rAF 프레임 드레인 → target 도달
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    distanceEl = screen.getByTestId('estimate-info-distance')
    expect(distanceEl.textContent).toMatch(/360/)
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-ESTINFO — active glow
// ---------------------------------------------------------------------------

describe('EstimateInfoCard — TC-DASH3-UNIT-ESTINFO (active glow)', () => {
  it('active=true 시 ring-accent/30 클래스와 shadow-accent/10 클래스를 가진다', () => {
    render(
      <EstimateInfoCard
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        amount={AMOUNT_KRW}
        autoDispatch={true}
        active={true}
        rollingTriggerAt={0}
      />,
    )
    const card = screen.getByTestId('estimate-info-card')
    expect(card.className).toMatch(/ring-accent\/30/)
    expect(card.className).toMatch(/shadow-accent\/10/)
  })

  it('active=false 시 glow 클래스가 없다', () => {
    render(
      <EstimateInfoCard
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        amount={AMOUNT_KRW}
        autoDispatch={true}
        active={false}
      />,
    )
    const card = screen.getByTestId('estimate-info-card')
    expect(card.className).not.toMatch(/ring-accent\/30/)
    expect(card.className).not.toMatch(/shadow-accent\/10/)
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-ESTINFO — 구조 / landing 팔레트 / 접근성
// ---------------------------------------------------------------------------

describe('EstimateInfoCard — TC-DASH3-UNIT-ESTINFO (구조 / landing 팔레트 / 접근성)', () => {
  it('카드 className 은 landing 팔레트 (bg-white/5 border-white/10 rounded-xl) 를 가진다', () => {
    render(
      <EstimateInfoCard
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        amount={AMOUNT_KRW}
        autoDispatch={true}
        active={false}
      />,
    )
    const card = screen.getByTestId('estimate-info-card')
    expect(card.className).toMatch(/bg-white\/5/)
    expect(card.className).toMatch(/border-white\/10/)
    expect(card.className).toMatch(/rounded-xl/)
  })

  it('backdrop-blur-sm + p-4 레이아웃 클래스를 가진다', () => {
    render(
      <EstimateInfoCard
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        amount={AMOUNT_KRW}
        autoDispatch={true}
        active={false}
      />,
    )
    const card = screen.getByTestId('estimate-info-card')
    expect(card.className).toMatch(/backdrop-blur-sm/)
    expect(card.className).toMatch(/p-4/)
  })

  it('role="region" + aria-label 로 landmark 를 제공한다', () => {
    render(
      <EstimateInfoCard
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        amount={AMOUNT_KRW}
        autoDispatch={true}
        active={false}
      />,
    )
    expect(
      screen.getByRole('region', { name: '예상 운임/거리' }),
    ).toBeInTheDocument()
  })

  it('제목 "예상 운임/거리" 와 헤더 아이콘 (Calculator/Banknote) 이 렌더된다', () => {
    render(
      <EstimateInfoCard
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        amount={AMOUNT_KRW}
        autoDispatch={true}
        active={false}
      />,
    )
    const card = screen.getByTestId('estimate-info-card')
    expect(card.textContent).toMatch(/예상 운임\/거리/)
    const icon = card.querySelector('[data-icon="estimate-info"]')
    expect(icon).not.toBeNull()
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  it('distance / duration / amount 각각의 값 셀에 data-testid 가 부여되어 격리 테스트가 가능하다', () => {
    render(
      <EstimateInfoCard
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        amount={AMOUNT_KRW}
        autoDispatch={true}
        active={false}
      />,
    )
    expect(screen.getByTestId('estimate-info-distance')).toBeInTheDocument()
    expect(screen.getByTestId('estimate-info-duration')).toBeInTheDocument()
    expect(screen.getByTestId('estimate-info-amount')).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-ESTINFO — 수치 주입 유연성
// ---------------------------------------------------------------------------

describe('EstimateInfoCard — TC-DASH3-UNIT-ESTINFO (수치 주입 유연성)', () => {
  it('distance=0, duration=0, amount=0 도 active=false 시 0 으로 렌더된다', () => {
    render(
      <EstimateInfoCard
        distance={0}
        duration={0}
        amount={0}
        autoDispatch={false}
        active={false}
      />,
    )
    expect(screen.getByTestId('estimate-info-distance').textContent).toMatch(/0/)
    expect(screen.getByTestId('estimate-info-duration').textContent).toMatch(/0/)
    expect(screen.getByTestId('estimate-info-amount').textContent).toMatch(/0/)
  })

  it('다른 수치 주입 (distance=1234, duration=567, amount=99999) 도 그대로 렌더된다', () => {
    render(
      <EstimateInfoCard
        distance={1234}
        duration={567}
        amount={99999}
        autoDispatch={true}
        active={false}
      />,
    )
    expect(screen.getByTestId('estimate-info-distance').textContent).toMatch(/1234/)
    expect(screen.getByTestId('estimate-info-duration').textContent).toMatch(/567/)
    // 99,999 or 99999
    expect(screen.getByTestId('estimate-info-amount').textContent).toMatch(/99[,.]?999/)
  })
})
