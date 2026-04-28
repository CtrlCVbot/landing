import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OpticLogo } from '@/components/icons/optic-logo'
import { Footer } from '@/components/sections/footer'
import { BRAND } from '@/lib/constants'

describe('Footer and logo brand treatment (T-BRAND-03)', () => {
  it('keeps OPTIC as the main footer brand and OPTICS as auxiliary copy', () => {
    render(<Footer />)

    expect(screen.getByText(BRAND.primary)).toBeInTheDocument()
    expect(screen.getByText(BRAND.poweredByLabel)).toBeInTheDocument()
    expect(screen.getByText(BRAND.copyrightLabel)).toBeInTheDocument()
  })

  it('keeps the logo accessible name aligned with the primary brand', () => {
    render(<OpticLogo />)

    expect(
      screen.getByRole('img', { name: BRAND.logoLabel }),
    ).toBeInTheDocument()
  })
})
