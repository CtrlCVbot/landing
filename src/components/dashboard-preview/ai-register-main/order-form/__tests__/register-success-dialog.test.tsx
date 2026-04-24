/**
 * T-DASH3-M3-10 — RegisterSuccessDialog 단위 테스트
 *
 * TC
 *  - TC-DASH3-UNIT-SUCCESSOFF (open=false 기본 동작 + open=true 시 구조 노출)
 *
 * REQ
 *  - REQ-DASH3-004 (OrderForm 컴포넌트 복제 매니페스트 — RegisterSuccessDialog)
 *  - REQ-DASH3-013 (Phase 4 유보 — Phase 1 에서는 파일만 복제)
 *  - REQ-DASH-005 (landing 팔레트 일관성)
 *  - REQ-DASH-007 (접근성)
 *
 * 범위
 *  - stateless, open/orderId prop 주입.
 *  - open=false 시 null 반환 (DOM 미노출).
 *  - open=true 시 Phase 4 준비 구조 렌더 (시각만 — 버튼 onClick no-op).
 *  - CompanyManager pre-filled 과 독립 (다른 props 격리).
 *
 * 원본 참조
 *  - mm-broker `register-success-dialog.tsx` — Dialog/Router/Store 연동 제거,
 *    landing palette stateless 복제.
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { RegisterSuccessDialog } from '@/components/dashboard-preview/ai-register-main/order-form/register-success-dialog'

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-SUCCESSOFF — open=false 시 DOM 미노출
// ---------------------------------------------------------------------------

describe('RegisterSuccessDialog — TC-DASH3-UNIT-SUCCESSOFF (Phase 1 기본 동작)', () => {
  it('open=false 시 null 반환 — DOM 미노출', () => {
    const { container } = render(<RegisterSuccessDialog open={false} />)
    expect(container.firstChild).toBeNull()
    expect(screen.queryByTestId('register-success-dialog')).toBeNull()
  })

  it('open=false + orderId 지정 시에도 DOM 미노출', () => {
    const { container } = render(
      <RegisterSuccessDialog open={false} orderId="order-12345" />,
    )
    expect(container.firstChild).toBeNull()
    expect(screen.queryByText(/order-12345/)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-SUCCESSOFF — open=true 시 Phase 4 준비 구조 렌더
// ---------------------------------------------------------------------------

describe('RegisterSuccessDialog — TC-DASH3-UNIT-SUCCESSOFF (open=true 구조)', () => {
  it('open=true 시 다이얼로그 구조가 렌더된다 (data-testid="register-success-dialog")', () => {
    render(<RegisterSuccessDialog open={true} />)
    expect(screen.getByTestId('register-success-dialog')).toBeInTheDocument()
  })

  it('open=true + orderId 주입 시 orderId 가 본문에 표시된다', () => {
    render(<RegisterSuccessDialog open={true} orderId="order-ABC-001" />)
    const dialog = screen.getByTestId('register-success-dialog')
    expect(dialog.textContent).toMatch(/order-ABC-001/)
  })

  it('open=true 시 제목 "화물 등록 완료" 가 노출된다', () => {
    render(<RegisterSuccessDialog open={true} orderId="order-1" />)
    const dialog = screen.getByTestId('register-success-dialog')
    expect(dialog.textContent).toMatch(/화물 등록 완료/)
  })

  it('open=true 시 닫기 버튼이 존재한다 (no-op, onClick 부작용 없음)', () => {
    render(<RegisterSuccessDialog open={true} orderId="order-1" />)
    const closeButton = screen.getByTestId('register-success-close')
    expect(closeButton).toBeInTheDocument()
    // no-op: 클릭해도 에러나 부작용이 없어야 한다 (Phase 4 이전 동작).
    expect(() => fireEvent.click(closeButton)).not.toThrow()
  })

  it('open=true 시 role="dialog" + aria-label 로 landmark 를 제공한다', () => {
    render(<RegisterSuccessDialog open={true} orderId="order-1" />)
    expect(
      screen.getByRole('dialog', { name: '화물 등록 완료' }),
    ).toBeInTheDocument()
  })

  it('open=true 시 landing 팔레트 (bg-card/50 border-border rounded-xl) 가 적용된다 (T-THEME-13 토큰 치환; 원본: bg-white/5 border-white/10)', () => {
    render(<RegisterSuccessDialog open={true} orderId="order-1" />)
    const dialog = screen.getByTestId('register-success-dialog')
    expect(dialog.className).toMatch(/bg-card\/50/)
    expect(dialog.className).toMatch(/border-border(?![a-z-])/)
    expect(dialog.className).toMatch(/rounded-xl/)
  })

  it('open=true + orderId 미지정 시에도 정상 렌더 (orderId 는 optional)', () => {
    render(<RegisterSuccessDialog open={true} />)
    expect(screen.getByTestId('register-success-dialog')).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-SUCCESSOFF — CompanyManager 와의 독립 (props 격리)
// ---------------------------------------------------------------------------

describe('RegisterSuccessDialog — TC-DASH3-UNIT-SUCCESSOFF (props 격리)', () => {
  it('open toggle 만으로 DOM 노출/미노출이 완전히 제어된다 (CompanyManager pre-filled 무관)', () => {
    const { rerender, container } = render(
      <RegisterSuccessDialog open={false} orderId="order-X" />,
    )
    // 초기: open=false → 미노출
    expect(container.firstChild).toBeNull()

    // open=true 전환 → 노출
    rerender(<RegisterSuccessDialog open={true} orderId="order-X" />)
    expect(screen.getByTestId('register-success-dialog')).toBeInTheDocument()

    // 다시 open=false 전환 → 미노출
    rerender(<RegisterSuccessDialog open={false} orderId="order-X" />)
    expect(screen.queryByTestId('register-success-dialog')).toBeNull()
  })
})
