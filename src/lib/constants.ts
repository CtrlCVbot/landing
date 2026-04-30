export const BRAND = {
  primary: 'OPTIC',
  auxiliary: 'OPTICS',
  poweredByLabel: 'Powered by OPTICS',
  logoLabel: 'OPTIC 로고',
  openGraphAlt: 'OPTIC 맞춤 운송 운영 플랫폼',
  copyrightLabel: '© 2026 OPTIC. All rights reserved.',
} as const

export const BRAND_ASSETS = {
  logo: '/brand/optic-logo.svg',
  mark: '/brand/optic-mark.svg',
  favicon: '/favicon.svg',
  openGraph: '/brand/optic-og.svg',
} as const

export const SITE_METADATA = {
  title: 'OPTIC - 화주와 주선사를 위한 맞춤 운송 운영',
  description:
    '화주와 주선사별 업무 방식에 맞춰 오더, 배차, 정산, 세금계산서를 한 흐름으로 정리하는 운송 운영 플랫폼입니다.',
  url: 'https://optic.app',
} as const

export const CTA_LINKS = {
  service: {
    label: 'OPTIC 바로가기',
    ariaLabel: 'OPTIC 서비스 새 창으로 열기',
    href: 'https://mm-broker-test.vercel.app/',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
  contact: {
    label: '도입 문의하기',
    ariaLabel: '도입 문의 섹션으로 이동',
    href: '#contact',
  },
} as const

export const NAV_LINKS = [
  { label: '기능', href: '#features' },
  { label: '제품', href: '#products' },
  { label: '연동', href: '#integrations' },
  { label: '문의하기', href: '#contact' },
] as const

export const PROBLEMS = [
  {
    before: '회사마다 다른 주문 양식 반복 입력',
    after: 'AI 오더 등록으로 핵심 정보 정리',
  },
  {
    before: '배차 정보 중복 등록과 전송 누락',
    after: '배차 단계 화물맨 연동으로 전송 흐름 정리',
  },
  {
    before: '정산/세금계산서 수작업',
    after: '정산 자동화와 세금계산서 관리',
  },
  {
    before: '화주와 주선사별 운영 기준 분산',
    after: '요청 양식과 정산 기준에 맞춘 운영 조율',
  },
  {
    before: '주소/경로 분산 검색',
    after: '주소와 거리 계산을 운송 흐름 안에서 정리',
  },
  {
    before: '정산 이후 증빙 상태 추적 누락',
    after: '세금계산서 상태까지 이어서 관리',
  },
] as const

export const FEATURES = [
  {
    icon: 'sparkles',
    title: 'AI 오더 등록',
    description: '회사별 오더 양식을 읽어 반복 입력과 누락을 줄입니다.',
  },
  {
    icon: 'truck',
    title: '화물맨 연동',
    description: '배차 단계에서 운송 정보를 화물맨으로 이어 보내 중복 등록을 줄입니다.',
  },
  {
    icon: 'calculator',
    title: '정산 자동화',
    description: '화주별 청구와 주선사별 매출·매입 기준을 흐름 안에서 관리합니다.',
  },
  {
    icon: 'receipt',
    title: '세금계산서 관리',
    description: '정산 이후 증빙 발행과 상태 확인까지 이어서 관리합니다.',
  },
  {
    icon: 'clipboard-list',
    title: '운영 방식 맞춤',
    description: '회사별 요청 양식과 담당자 기준에 맞춰 운송 운영을 조율합니다.',
  },
  {
    icon: 'map-pin',
    title: '주소/거리 계산',
    description: '상하차지 주소와 예상 거리 정보를 운송 흐름 안에서 정리합니다.',
  },
] as const

export const PRODUCTS = [
  {
    key: 'broker',
    title: '주선사용 운송 운영 콘솔',
    productLabel: 'OPTIC Broker',
    target: '주선사',
    status: 'implemented',
    description: '오더 접수, 배차, 화물맨 연동, 정산 흐름을 주선사 업무 방식에 맞춰 관리합니다.',
    features: [
      'AI 오더 등록',
      '배차/운송 상태 추적',
      '정산 자동화',
      '세금계산서 관리',
    ],
  },
  {
    key: 'shipper',
    title: '화주용 운송 요청 포털',
    productLabel: 'OPTIC Shipper',
    target: '화주',
    status: 'implemented',
    description: '화주별 요청 양식과 진행 확인 방식을 맞춰, 운송 의뢰부터 상태 확인까지 한 흐름으로 정리합니다.',
    features: ['운송 요청 등록', '진행 상태 확인', '요청 양식 맞춤'],
  },
  {
    key: 'carrier',
    title: '운송사용 배차 수행 도구',
    productLabel: 'OPTIC Carrier',
    target: '운송사/차주',
    status: 'upcoming',
    description: '운송사와 차주가 필요한 배차 수행 정보를 간결하게 확인합니다.',
    features: ['배차 수락', '운송 수행'],
  },
  {
    key: 'ops',
    title: '운영 조율 콘솔',
    productLabel: 'OPTIC Ops',
    target: '운영/관제팀',
    status: 'upcoming',
    description: '여러 고객사와 운영 기준을 한 화면에서 조율합니다.',
    features: ['전체 현황 모니터링', '운영 기준 조율'],
  },
  {
    key: 'billing',
    title: '정산 관리 도구',
    productLabel: 'OPTIC Billing',
    target: '회계/정산',
    status: 'upcoming',
    description: '회사별 정산 기준과 세금계산서 흐름을 놓치지 않게 관리합니다.',
    features: ['정산 기준 관리', '세금계산서 상태 확인'],
  },
] as const

export const INTEGRATIONS = [
  {
    key: 'ai-order',
    name: 'AI 오더 등록',
    description: '주문서 텍스트를 운송 오더로 정리',
  },
  {
    key: 'distance',
    name: '주소/거리 계산',
    description: '상하차지 주소와 예상 거리 정보 정리',
  },
  {
    key: 'invoice',
    name: '세금계산서 관리',
    description: '정산 이후 증빙 발행 상태 관리',
  },
  {
    key: 'hwamulman',
    name: '화물맨',
    description: '배차 단계에서 운송 정보를 이어 보내 중복 등록과 전송 누락 감소',
  },
] as const

export const FOOTER_LINKS = [
  {
    group: '제품',
    links: [
      {
        label: 'Broker',
        href: 'https://brkr.optic.app',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      {
        label: 'Shipper',
        href: 'https://shpr.optic.app',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      { label: 'Carrier', href: '#' },
      { label: 'Ops', href: '#' },
      { label: 'Billing', href: '#' },
    ],
  },
  {
    group: '회사',
    links: [
      { label: '회사 소개', href: '#' },
      { label: '채용', href: '#' },
    ],
  },
  {
    group: '법적 고지',
    links: [
      { label: '이용약관', href: '#' },
      { label: '개인정보처리방침', href: '#' },
    ],
  },
] as const
