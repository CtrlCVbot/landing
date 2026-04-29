import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Products } from '@/components/sections/products'

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
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

describe('Products section - F2 product lineup', () => {
  it('renders Korean role titles before OPTIC product labels', () => {
    render(<Products />)

    expect(screen.getByText('주선사용 운송 운영 콘솔')).toBeInTheDocument()
    expect(screen.getByText('OPTIC Broker')).toBeInTheDocument()
    expect(screen.getByText('화주용 운송 요청 포털')).toBeInTheDocument()
    expect(screen.getByText('OPTIC Shipper')).toBeInTheDocument()
  })

  it('separates upcoming Carrier/Ops/Billing from implemented products', () => {
    render(<Products />)

    expect(screen.getAllByText('구현 대상')).toHaveLength(2)
    expect(screen.getAllByText('구현 예정')).toHaveLength(3)
    expect(screen.getByText('OPTIC Carrier')).toBeInTheDocument()
    expect(screen.getByText('OPTIC Ops')).toBeInTheDocument()
    expect(screen.getByText('OPTIC Billing')).toBeInTheDocument()
  })

  it('does not expose upcoming products as active tabs', () => {
    render(<Products />)

    expect(
      screen.queryByRole('button', { name: 'OPTIC Carrier' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'OPTIC Ops' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'OPTIC Billing' }),
    ).not.toBeInTheDocument()
  })
})
