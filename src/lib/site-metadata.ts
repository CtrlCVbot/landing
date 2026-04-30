import type { Metadata } from 'next'

import { BRAND, BRAND_ASSETS, SITE_METADATA } from '@/lib/constants'

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_METADATA.url),
  title: SITE_METADATA.title,
  description: SITE_METADATA.description,
  icons: {
    icon: [{ url: BRAND_ASSETS.favicon, type: 'image/svg+xml' }],
  },
  openGraph: {
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    url: SITE_METADATA.url,
    siteName: 'OPTIC',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: BRAND_ASSETS.openGraph,
        width: 1200,
        height: 630,
        alt: BRAND.openGraphAlt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    images: [BRAND_ASSETS.openGraph],
  },
  robots: {
    index: true,
    follow: true,
  },
}
