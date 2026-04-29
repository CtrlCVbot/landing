import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Integrations } from '@/components/sections/integrations'

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

describe('Integrations section - F2 provider copy', () => {
  it('keeps Hwamulman while describing it in a dispatch-stage context', () => {
    render(<Integrations />)

    expect(screen.getByText('화물맨')).toBeInTheDocument()
    expect(screen.getByText(/배차 단계/)).toBeInTheDocument()
  })

  it('does not expose non-approved provider names as card titles', () => {
    render(<Integrations />)

    expect(screen.queryByText('Google Gemini AI')).not.toBeInTheDocument()
    expect(screen.queryByText('카카오 맵')).not.toBeInTheDocument()
    expect(screen.queryByText('팝빌')).not.toBeInTheDocument()
    expect(screen.queryByText('로지스엠/화물맨')).not.toBeInTheDocument()
  })
})
