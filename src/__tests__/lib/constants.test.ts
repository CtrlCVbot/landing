import { describe, expect, it } from 'vitest'

import { BRAND, CTA_LINKS } from '@/lib/constants'

describe('brand and CTA constants (T-BRAND-01)', () => {
  it('exposes the primary and auxiliary brand names', () => {
    expect(BRAND.primary).toBe('OPTIC')
    expect(BRAND.auxiliary).toBe('OPTICS')
  })

  it('exposes the service and contact CTA contract', () => {
    expect(CTA_LINKS.service).toEqual({
      label: 'OPTIC 바로가기',
      href: 'https://mm-broker-test.vercel.app/',
      target: '_blank',
      rel: 'noopener noreferrer',
    })

    expect(CTA_LINKS.contact).toEqual({
      label: '도입 문의하기',
      href: '#contact',
    })
  })
})
