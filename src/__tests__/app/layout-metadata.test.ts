import { describe, expect, it } from 'vitest'

import { BRAND, BRAND_ASSETS, SITE_METADATA } from '@/lib/constants'
import { siteMetadata } from '@/lib/site-metadata'

describe('Root metadata brand readiness (T-F5-META-01)', () => {
  it('uses the shared OPTIC metadata copy', () => {
    expect(siteMetadata.title).toBe(SITE_METADATA.title)
    expect(siteMetadata.description).toBe(SITE_METADATA.description)
    expect(siteMetadata.description).toContain('화주')
    expect(siteMetadata.description).toContain('주선사')
  })

  it('connects favicon and Open Graph assets', () => {
    expect(siteMetadata.icons).toMatchObject({
      icon: [{ url: BRAND_ASSETS.favicon, type: 'image/svg+xml' }],
    })

    expect(siteMetadata.openGraph).toMatchObject({
      images: [
        {
          url: BRAND_ASSETS.openGraph,
          width: 1200,
          height: 630,
          alt: BRAND.openGraphAlt,
        },
      ],
    })

    expect(siteMetadata.twitter).toMatchObject({
      images: [BRAND_ASSETS.openGraph],
    })
  })
})
