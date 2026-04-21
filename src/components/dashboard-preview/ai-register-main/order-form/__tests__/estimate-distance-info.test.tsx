/**
 * T-DASH3-M3-05 — EstimateDistanceInfo 단위 테스트
 *
 * TC
 *  - TC-DASH3-UNIT-DISTINFO (visible 분기, 수치/단위 표기, 아이콘, landing 팔레트 강조, 접근성)
 *
 * REQ
 *  - REQ-DASH3-004 (OrderForm 컴포넌트 복제 매니페스트 — EstimateDistanceInfo)
 *  - REQ-DASH-005 (landing 팔레트 일관성)
 *  - REQ-DASH-007 (접근성)
 *
 * 범위
 *  - stateless, visible prop 으로 렌더 모드 분기.
 *  - visible=true  : distance (km) / duration (분) 수치 표시.
 *  - visible=false : "측정 전" placeholder 노출 (null 아님 — 레이아웃 유지 목적).
 *  - accent 강조: bg-accent/5 + border-accent/20.
 *  - lucide `Route` 아이콘.
 *  - role="region" + aria-label "예상 거리 정보".
 *
 * 원본 참조
 *  - mm-broker `register-form.tsx` L1143-1174 (예상 거리/시간 info 박스)
 *    LandPlot 아이콘 + 숫자 강조 패턴만 추출. Next.js dynamic/Card 연동 제거.
 */

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EstimateDistanceInfo } from '@/components/dashboard-preview/ai-register-main/order-form/estimate-distance-info'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const DISTANCE_KM = 360
const DURATION_MIN = 300

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-DISTINFO — visible=true (AI_APPLY 완료)
// ---------------------------------------------------------------------------

describe('EstimateDistanceInfo — TC-DASH3-UNIT-DISTINFO (visible=true)', () => {
  it('distance 값이 렌더된다 (km 단위)', () => {
    render(
      <EstimateDistanceInfo
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        visible={true}
      />,
    )
    const region = screen.getByTestId('estimate-distance-info')
    expect(region.textContent).toMatch(/360/)
    expect(region.textContent).toMatch(/km/i)
  })

  it('duration 값이 렌더된다 (분 단위)', () => {
    render(
      <EstimateDistanceInfo
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        visible={true}
      />,
    )
    const region = screen.getByTestId('estimate-distance-info')
    expect(region.textContent).toMatch(/300/)
    expect(region.textContent).toMatch(/분/)
  })

  it('Route 아이콘을 렌더한다 (data-icon="route")', () => {
    render(
      <EstimateDistanceInfo
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        visible={true}
      />,
    )
    const region = screen.getByTestId('estimate-distance-info')
    expect(region.querySelector('[data-icon="route"]')).not.toBeNull()
  })

  it('"측정 전" placeholder 는 노출되지 않는다', () => {
    render(
      <EstimateDistanceInfo
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        visible={true}
      />,
    )
    expect(screen.queryByText(/측정 전/)).not.toBeInTheDocument()
  })

  it('data-visible 속성이 "true" 이다', () => {
    render(
      <EstimateDistanceInfo
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        visible={true}
      />,
    )
    expect(screen.getByTestId('estimate-distance-info')).toHaveAttribute(
      'data-visible',
      'true',
    )
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-DISTINFO — visible=false (INITIAL/AI_INPUT/AI_EXTRACT)
// ---------------------------------------------------------------------------

describe('EstimateDistanceInfo — TC-DASH3-UNIT-DISTINFO (visible=false)', () => {
  it('"측정 전" placeholder 가 렌더된다', () => {
    render(
      <EstimateDistanceInfo
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        visible={false}
      />,
    )
    expect(screen.getByText(/측정 전/)).toBeInTheDocument()
  })

  it('distance/duration 수치가 노출되지 않는다', () => {
    render(
      <EstimateDistanceInfo
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        visible={false}
      />,
    )
    const region = screen.getByTestId('estimate-distance-info')
    expect(region.textContent).not.toMatch(/360/)
    expect(region.textContent).not.toMatch(/300\s*분/)
  })

  it('data-visible 속성이 "false" 이다', () => {
    render(
      <EstimateDistanceInfo
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        visible={false}
      />,
    )
    expect(screen.getByTestId('estimate-distance-info')).toHaveAttribute(
      'data-visible',
      'false',
    )
  })

  it('Route 아이콘은 visible=false 여도 렌더된다 (레이아웃 유지)', () => {
    render(
      <EstimateDistanceInfo
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        visible={false}
      />,
    )
    const region = screen.getByTestId('estimate-distance-info')
    expect(region.querySelector('[data-icon="route"]')).not.toBeNull()
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-DISTINFO — landing 팔레트 accent 강조
// ---------------------------------------------------------------------------

describe('EstimateDistanceInfo — TC-DASH3-UNIT-DISTINFO (accent 강조 스타일)', () => {
  it('bg-accent/5 클래스를 가진다', () => {
    render(
      <EstimateDistanceInfo
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        visible={true}
      />,
    )
    const region = screen.getByTestId('estimate-distance-info')
    expect(region.className).toMatch(/bg-accent\/5/)
  })

  it('border-accent/20 클래스를 가진다', () => {
    render(
      <EstimateDistanceInfo
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        visible={true}
      />,
    )
    const region = screen.getByTestId('estimate-distance-info')
    expect(region.className).toMatch(/border-accent\/20/)
  })

  it('visible=false 에서도 accent 강조 클래스를 유지한다 (레이아웃 일관성)', () => {
    render(
      <EstimateDistanceInfo
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        visible={false}
      />,
    )
    const region = screen.getByTestId('estimate-distance-info')
    expect(region.className).toMatch(/bg-accent\/5/)
    expect(region.className).toMatch(/border-accent\/20/)
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-DISTINFO — 접근성 (REQ-DASH-007)
// ---------------------------------------------------------------------------

describe('EstimateDistanceInfo — TC-DASH3-UNIT-DISTINFO (접근성)', () => {
  it('role="region" + aria-label "예상 거리 정보" 로 landmark 를 제공한다', () => {
    render(
      <EstimateDistanceInfo
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        visible={true}
      />,
    )
    expect(
      screen.getByRole('region', { name: '예상 거리 정보' }),
    ).toBeInTheDocument()
  })

  it('Route 아이콘은 aria-hidden 이다', () => {
    render(
      <EstimateDistanceInfo
        distance={DISTANCE_KM}
        duration={DURATION_MIN}
        visible={true}
      />,
    )
    const region = screen.getByTestId('estimate-distance-info')
    const icon = region.querySelector('[data-icon="route"]')
    expect(icon).not.toBeNull()
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-DISTINFO — 다른 수치 주입
// ---------------------------------------------------------------------------

describe('EstimateDistanceInfo — TC-DASH3-UNIT-DISTINFO (수치 주입 유연성)', () => {
  it('distance=0, duration=0 도 visible=true 시 숫자로 렌더된다', () => {
    render(
      <EstimateDistanceInfo
        distance={0}
        duration={0}
        visible={true}
      />,
    )
    const region = screen.getByTestId('estimate-distance-info')
    expect(region.textContent).toMatch(/0\s*km/i)
    expect(region.textContent).toMatch(/0\s*분/)
  })

  it('distance=1234, duration=567 주입 시 값 그대로 렌더된다', () => {
    render(
      <EstimateDistanceInfo
        distance={1234}
        duration={567}
        visible={true}
      />,
    )
    const region = screen.getByTestId('estimate-distance-info')
    expect(region.textContent).toMatch(/1234/)
    expect(region.textContent).toMatch(/567/)
  })
})
