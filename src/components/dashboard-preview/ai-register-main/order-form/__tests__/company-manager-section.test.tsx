/**
 * T-DASH3-M3-02 — CompanyManagerSection 단위 테스트
 *
 * TC
 *  - TC-DASH3-UNIT-COMPMANSEC
 *
 * REQ
 *  - REQ-DASH3-004 (OrderForm 컴포넌트 복제 매니페스트 — CompanyManagerSection)
 *  - REQ-DASH3-014 (CompanyManagerSection INITIAL pre-filled — 옵틱물류 / 이매니저)
 *
 * 범위
 *  - stateless, pre-filled 고정 카드 (회사/담당자 정보 뼈대)
 *  - INITIAL 부터 filled=true 유지 (AI_APPLY 대상 제외 — REQ-DASH3-022)
 *  - SSOT §4-3 값 표시: 옵틱물류 / ***-**-***** / 김옵틱 / 이매니저 /
 *    010-****-**** / example@optics.com / 물류운영팀
 *
 * 주의
 *  - 원본 mm-broker `company-manager-section.tsx` 의 검색/Popover/Dialog 로직은
 *    전부 제거. landing demo 용 stateless dumb component.
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { CompanyManagerSection } from '@/components/dashboard-preview/ai-register-main/order-form/company-manager-section'
import { PREVIEW_MOCK_DATA } from '@/lib/mock-data'

const COMPANY = PREVIEW_MOCK_DATA.formData.company
const MANAGER = PREVIEW_MOCK_DATA.formData.manager

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-COMPMANSEC — Pre-filled 기본 상태 (filled=true 또는 생략)
// ---------------------------------------------------------------------------

describe('CompanyManagerSection — TC-DASH3-UNIT-COMPMANSEC (pre-filled 기본 상태)', () => {
  it('회사명 "옵틱물류" 를 렌더한다', () => {
    render(<CompanyManagerSection company={COMPANY} manager={MANAGER} />)
    expect(screen.getByText('옵틱물류')).toBeInTheDocument()
  })

  it('대표 "김옵틱" 을 렌더한다', () => {
    render(<CompanyManagerSection company={COMPANY} manager={MANAGER} />)
    expect(screen.getByText('김옵틱')).toBeInTheDocument()
  })

  it('사업자번호 "***-**-*****" 마스킹을 렌더한다', () => {
    render(<CompanyManagerSection company={COMPANY} manager={MANAGER} />)
    expect(screen.getByText('***-**-*****')).toBeInTheDocument()
  })

  it('담당자 "이매니저" 를 렌더한다', () => {
    render(<CompanyManagerSection company={COMPANY} manager={MANAGER} />)
    expect(screen.getByText('이매니저')).toBeInTheDocument()
  })

  it('연락처 "010-****-****" 를 렌더한다', () => {
    render(<CompanyManagerSection company={COMPANY} manager={MANAGER} />)
    expect(screen.getByText('010-****-****')).toBeInTheDocument()
  })

  it('이메일 "example@optics.com" 을 렌더한다', () => {
    render(<CompanyManagerSection company={COMPANY} manager={MANAGER} />)
    expect(screen.getByText('example@optics.com')).toBeInTheDocument()
  })

  it('부서 "물류운영팀" 을 렌더한다', () => {
    render(<CompanyManagerSection company={COMPANY} manager={MANAGER} />)
    expect(screen.getByText('물류운영팀')).toBeInTheDocument()
  })

  it('Pre-filled 배지를 렌더한다 (accent 색상 — text-accent bg-accent/10)', () => {
    render(<CompanyManagerSection company={COMPANY} manager={MANAGER} />)
    const badge = screen.getByTestId('company-manager-prefilled-badge')
    expect(badge).toBeInTheDocument()
    expect(badge.className).toMatch(/text-accent/)
    expect(badge.className).toMatch(/bg-accent\/10/)
    expect(badge.className).toMatch(/border-accent\/20/)
  })

  it('담당자 아바타가 원형 gradient (from-purple-600/80 to-blue-600/80) 로 렌더된다', () => {
    render(<CompanyManagerSection company={COMPANY} manager={MANAGER} />)
    const avatar = screen.getByTestId('company-manager-avatar')
    expect(avatar).toBeInTheDocument()
    expect(avatar.className).toMatch(/rounded-full/)
    expect(avatar.className).toMatch(/from-purple-600\/80/)
    expect(avatar.className).toMatch(/to-blue-600\/80/)
    expect(avatar.className).toMatch(/bg-gradient-to-br/)
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-COMPMANSEC — filled=false placeholder
// ---------------------------------------------------------------------------

describe('CompanyManagerSection — TC-DASH3-UNIT-COMPMANSEC (filled=false placeholder)', () => {
  it('filled=false 일 때 placeholder "—" 를 표시한다 (회사명 대체)', () => {
    render(
      <CompanyManagerSection company={COMPANY} manager={MANAGER} filled={false} />,
    )
    expect(screen.queryByText('옵틱물류')).not.toBeInTheDocument()
    // 여러 placeholder "—" 중 하나 이상 존재
    expect(screen.getAllByText('—').length).toBeGreaterThan(0)
  })

  it('filled=false 일 때 Pre-filled 배지를 렌더하지 않는다', () => {
    render(
      <CompanyManagerSection company={COMPANY} manager={MANAGER} filled={false} />,
    )
    expect(
      screen.queryByTestId('company-manager-prefilled-badge'),
    ).not.toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// TC-DASH3-UNIT-COMPMANSEC — 구조
// ---------------------------------------------------------------------------

describe('CompanyManagerSection — TC-DASH3-UNIT-COMPMANSEC (구조)', () => {
  it('카드 className 은 landing 팔레트 (bg-white/5 border-white/10 rounded-xl backdrop-blur-sm) 를 가진다', () => {
    render(<CompanyManagerSection company={COMPANY} manager={MANAGER} />)
    const card = screen.getByTestId('company-manager-section')
    expect(card.className).toMatch(/bg-white\/5/)
    expect(card.className).toMatch(/border-white\/10/)
    expect(card.className).toMatch(/rounded-xl/)
    expect(card.className).toMatch(/backdrop-blur-sm/)
  })

  it('role="region" + aria-label "회사 및 담당자 정보" 로 접근성을 제공한다', () => {
    render(<CompanyManagerSection company={COMPANY} manager={MANAGER} />)
    const section = screen.getByRole('region', { name: '회사 및 담당자 정보' })
    expect(section).toBeInTheDocument()
  })

  it('filled prop 생략 시 기본값 true 로 pre-filled 배지를 렌더한다 (REQ-DASH3-014)', () => {
    render(<CompanyManagerSection company={COMPANY} manager={MANAGER} />)
    expect(
      screen.getByTestId('company-manager-prefilled-badge'),
    ).toBeInTheDocument()
  })
})
