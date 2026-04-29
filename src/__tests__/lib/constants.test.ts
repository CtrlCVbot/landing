import { describe, expect, it } from 'vitest'

import {
  BRAND,
  CTA_LINKS,
  FEATURES,
  INTEGRATIONS,
  PRODUCTS,
  PROBLEMS,
} from '@/lib/constants'

const customerFacingCopy = JSON.stringify({
  BRAND,
  CTA_LINKS,
  FEATURES,
  INTEGRATIONS,
  PRODUCTS,
  PROBLEMS,
})

describe('F2 copy and product lineup constants', () => {
  it('keeps OPTIC as the customer-facing primary brand', () => {
    expect(BRAND.primary).toBe('OPTIC')
    expect(BRAND.auxiliary).toBe('OPTICS')
    expect(BRAND.poweredByLabel).toBe('Powered by OPTICS')
  })

  it('removes deprecated test and provider copy from customer-facing constants', () => {
    expect(customerFacingCopy).not.toContain('Optic Cargo')
    expect(customerFacingCopy).not.toContain('서비스 테스트')
    expect(customerFacingCopy).not.toContain('테스트 서버')
    expect(customerFacingCopy).not.toContain('데모 테스트')
    expect(customerFacingCopy).not.toContain('Google Gemini AI')
    expect(customerFacingCopy).not.toContain('카카오 맵')
    expect(customerFacingCopy).not.toContain('팝빌')
    expect(customerFacingCopy).not.toContain('로지스엠')
  })

  it('defines Features around AI order, dispatch Hwamulman, settlement, and invoice work', () => {
    expect(FEATURES.map((feature) => feature.title)).toEqual(
      expect.arrayContaining([
        'AI 오더 등록',
        '화물맨 연동',
        '정산 자동화',
        '세금계산서 관리',
      ]),
    )

    const hwamulmanFeature = FEATURES.find(
      (feature) => feature.title === '화물맨 연동',
    )
    expect(hwamulmanFeature?.description).toContain('배차')
    expect(hwamulmanFeature?.description).toContain('중복')
  })

  it('separates implemented Broker/Shipper products from upcoming products', () => {
    const implemented = PRODUCTS.filter(
      (product) => product.status === 'implemented',
    )
    const upcoming = PRODUCTS.filter((product) => product.status === 'upcoming')

    expect(implemented.map((product) => product.key)).toEqual([
      'broker',
      'shipper',
    ])
    expect(upcoming.map((product) => product.key)).toEqual([
      'carrier',
      'ops',
      'billing',
    ])
  })

  it('uses Korean role titles first and OPTIC product names as secondary labels', () => {
    expect(PRODUCTS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'broker',
          title: '주선사용 운송 운영 콘솔',
          productLabel: 'OPTIC Broker',
          status: 'implemented',
        }),
        expect.objectContaining({
          key: 'shipper',
          title: '화주용 운송 요청 포털',
          productLabel: 'OPTIC Shipper',
          status: 'implemented',
        }),
        expect.objectContaining({
          key: 'ops',
          title: '운영 조율 콘솔',
          productLabel: 'OPTIC Ops',
          status: 'upcoming',
        }),
      ]),
    )
  })
})
