import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Header } from '@/components/sections/header'
import { CTA_LINKS } from '@/lib/constants'

vi.mock('@/components/ThemeToggle', () => ({
  ThemeToggle: () => <button type="button">테마 전환</button>,
}))

vi.mock('@/hooks/use-scroll-spy', () => ({
  useScrollSpy: () => 'features',
}))

describe('Header brand CTAs (T-BRAND-02)', () => {
  it('renders separate desktop service and contact CTAs', () => {
    render(<Header />)

    const serviceCta = screen.getByRole('link', {
      name: CTA_LINKS.service.label,
    })
    const contactCta = screen.getByRole('link', {
      name: CTA_LINKS.contact.label,
    })

    expect(serviceCta).toHaveAttribute('href', CTA_LINKS.service.href)
    expect(serviceCta).toHaveAttribute('target', CTA_LINKS.service.target)
    expect(serviceCta).toHaveAttribute('rel', CTA_LINKS.service.rel)
    expect(contactCta).toHaveAttribute('href', CTA_LINKS.contact.href)
  })

  it('renders both CTAs in the mobile menu and closes after selecting one', () => {
    render(<Header />)

    fireEvent.click(screen.getByRole('button', { name: '메뉴 열기' }))

    const overlay = screen.getByRole('button', { name: '메뉴 닫기' })
      .parentElement

    expect(overlay).not.toBeNull()
    expect(
      within(overlay as HTMLElement).getByRole('link', {
        name: CTA_LINKS.service.label,
      }),
    ).toHaveAttribute('href', CTA_LINKS.service.href)

    const mobileContactCta = within(overlay as HTMLElement).getByRole('link', {
      name: CTA_LINKS.contact.label,
    })
    fireEvent.click(mobileContactCta)

    expect(
      screen.queryByRole('button', { name: '메뉴 닫기' }),
    ).not.toBeInTheDocument()
  })
})
