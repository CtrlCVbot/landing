import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Features } from '@/components/sections/features'

vi.mock('framer-motion', () => ({
  motion: {
    section: ({
      children,
      className,
      id,
    }: React.HTMLAttributes<HTMLElement>) => (
      <section id={id} className={className}>{children}</section>
    ),
    div: ({
      children,
      className,
    }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className}>{children}</div>
    ),
  },
}))

describe('Features section - F2 copy alignment', () => {
  it('renders dispatch-stage Hwamulman integration as a feature', () => {
    render(<Features />)

    expect(screen.getByText('화물맨 연동')).toBeInTheDocument()
    expect(screen.getByText(/배차 단계/)).toBeInTheDocument()
  })

  it('renders work-result feature names instead of provider names', () => {
    render(<Features />)

    expect(screen.getByText('AI 오더 등록')).toBeInTheDocument()
    expect(screen.getByText('정산 자동화')).toBeInTheDocument()
    expect(screen.getByText('세금계산서 관리')).toBeInTheDocument()
    expect(screen.queryByText('Google Gemini AI')).not.toBeInTheDocument()
    expect(screen.queryByText('팝빌')).not.toBeInTheDocument()
  })
})
