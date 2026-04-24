/**
 * T-DASH3-M2-07 — AiWarningBadges 단위 테스트 (TC-DASH3-UNIT-WARNBADGE)
 *
 * TC
 *  - TC-DASH3-UNIT-WARNBADGE: warnings props 기반 amber badge 렌더 + 아이콘 + 빈 배열 null
 *
 * REQ
 *  - REQ-DASH3-003 (AiPanel 컴포넌트 복제 매니페스트 — AiWarningBadges)
 *
 * 범위
 *  - stateless props 기반 AiWarningBadges 컴포넌트.
 *  - warnings: readonly string[] 을 받아 각 항목을 Badge 형태로 렌더.
 *  - 빈 배열이면 null (렌더 안 함).
 *  - 원본 mm-broker 버전의 resolvedKeys/severity 분기는 제거한 단순화 복제.
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { AiWarningBadges } from '@/components/dashboard-preview/ai-register-main/ai-panel/ai-warning-badges'

describe('AiWarningBadges — TC-DASH3-UNIT-WARNBADGE', () => {
  it('warnings 배열 빈 경우 null 반환', () => {
    const { container } = render(<AiWarningBadges warnings={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('warnings 배열 N개 있으면 N개 badge 렌더', () => {
    render(
      <AiWarningBadges
        warnings={['출발지 정보 부족', '도착지 정보 부족', '중량 미확인']}
      />,
    )
    const badges = screen.getAllByTestId(/^ai-warning-badge-/)
    expect(badges).toHaveLength(3)
  })

  it('badge에 amber 색상 클래스 (bg-amber-500/10, border-amber-500/30, text-amber-700 — T-THEME-09 D-013 WCAG AA 승계; 원본: text-amber-300)', () => {
    render(<AiWarningBadges warnings={['테스트 경고']} />)
    const badge = screen.getByTestId('ai-warning-badge-0')
    expect(badge).toHaveClass('bg-amber-500/10')
    expect(badge).toHaveClass('border-amber-500/30')
    expect(badge).toHaveClass('text-amber-700')
  })

  it('AlertTriangle 아이콘 sigil 렌더 (data-icon="alert-triangle")', () => {
    render(<AiWarningBadges warnings={['경고 메시지']} />)
    const badge = screen.getByTestId('ai-warning-badge-0')
    const icon = badge.querySelector('[data-icon="alert-triangle"]')
    expect(icon).not.toBeNull()
  })

  it('warnings 텍스트 그대로 표시 (한국어)', () => {
    render(
      <AiWarningBadges
        warnings={['출발지 정보가 부족합니다', '요금 산정 불가']}
      />,
    )
    expect(screen.getByText('출발지 정보가 부족합니다')).toBeInTheDocument()
    expect(screen.getByText('요금 산정 불가')).toBeInTheDocument()
  })

  it('role="list" + 각 badge role="listitem" 접근성', () => {
    render(
      <AiWarningBadges warnings={['경고 A', '경고 B']} />,
    )
    const list = screen.getByRole('list', { name: /경고/ })
    expect(list).toBeInTheDocument()
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
  })
})
