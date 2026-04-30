import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OpticLogo } from '@/components/icons/optic-logo'
import { Footer } from '@/components/sections/footer'
import { BRAND } from '@/lib/constants'

describe('Footer and logo brand treatment (T-BRAND-03)', () => {
  it('keeps OPTIC as the main footer brand and OPTICS as auxiliary copy', () => {
    render(<Footer />)

    expect(
      screen.getByRole('img', { name: BRAND.logoLabel }),
    ).toBeInTheDocument()
    expect(screen.getByText(BRAND.primary)).toBeInTheDocument()
    expect(screen.getByText(BRAND.poweredByLabel)).toBeInTheDocument()
    expect(screen.getByText(BRAND.copyrightLabel)).toBeInTheDocument()
  })

  it('applies safe external-link attributes to product links', () => {
    render(<Footer />)

    const brokerLink = screen.getByRole('link', { name: 'Broker' })

    expect(brokerLink).toHaveAttribute('href', 'https://brkr.optic.app')
    expect(brokerLink).toHaveAttribute('target', '_blank')
    expect(brokerLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('keeps the logo accessible name aligned with the primary brand', () => {
    const { container } = render(<OpticLogo />)

    expect(
      screen.getByRole('img', { name: BRAND.logoLabel }),
    ).toBeInTheDocument()
    expect(container.querySelector('text')?.textContent).toBe(BRAND.primary)
    expect(container.querySelector('path')).not.toBeInTheDocument()
  })
})
