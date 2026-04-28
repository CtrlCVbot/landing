export const BRAND = {
  primary: 'OPTIC',
  auxiliary: 'OPTICS',
  poweredByLabel: 'Powered by OPTICS',
  logoLabel: 'OPTIC logo',
  copyrightLabel: '© 2026 OPTIC. All rights reserved.',
} as const

export const CTA_LINKS = {
  service: {
    label: 'OPTIC 바로가기',
    href: 'https://mm-broker-test.vercel.app/',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
  contact: {
    label: '도입 문의하기',
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
    before: '엑셀/수기 주문 관리',
    after: '주문 등록·상태 추적·이력 자동화',
  },
  {
    before: '배차 현황 파악 어려움',
    after: '실시간 배차 상태 대시보드',
  },
  {
    before: '정산/세금계산서 수작업',
    after: '매출/매입 정산 자동 + 세금계산서 연동',
  },
  {
    before: '외부 플랫폼 별도 관리',
    after: '로지스엠(화물맨) 통합 연동',
  },
  {
    before: '주소/경로 분산 검색',
    after: '카카오 맵 통합 검색',
  },
  {
    before: '주문서 반복 입력',
    after: 'AI 기반 주문서 자동 추출',
  },
] as const

export const FEATURES = [
  {
    icon: 'clipboard-list',
    title: '주문 관리',
    description: '화물 등록부터 상태 추적까지 한 화면에서',
  },
  {
    icon: 'truck',
    title: '배차 관리',
    description: '기사 배정, 진행 상황 실시간 모니터링',
  },
  {
    icon: 'calculator',
    title: '정산 자동화',
    description: '매출/매입 자동 계산, 대사 처리',
  },
  {
    icon: 'receipt',
    title: '세금계산서',
    description: '팝빌 연동 전자 세금계산서 발행',
  },
  {
    icon: 'sparkles',
    title: 'AI 주문 추출',
    description: 'Gemini AI로 주문서 텍스트 자동 인식',
  },
  {
    icon: 'map-pin',
    title: '지도 연동',
    description: '카카오 맵 주소 검색, 경로·거리 계산',
  },
] as const

export const PRODUCTS = [
  {
    key: 'broker',
    label: 'OPTIC Broker',
    target: '주선사',
    description: '주선사를 위한 통합 운영 솔루션',
    features: [
      '오더 생성 및 관리',
      '배차/진행 상태 추적',
      '매출/매입 정산',
      '거래처/차주 관리',
    ],
  },
  {
    key: 'shipper',
    label: 'OPTIC Shipper',
    target: '화주',
    description: '화주를 위한 운송 요청 솔루션',
    features: ['오더 생성/조회', '상하차지/거래처 관리'],
  },
  {
    key: 'carrier',
    label: 'OPTIC Carrier',
    target: '운송사/차주',
    description: '운송사/차주를 위한 배차 솔루션',
    features: ['배차 수락', '운송 수행', '상하차지 확인'],
  },
  {
    key: 'operations',
    label: 'OPTIC Operations',
    target: '운영/관제팀',
    description: '운영/관제팀을 위한 모니터링 솔루션',
    features: ['전체 현황 모니터링', '데이터 유지보수'],
  },
  {
    key: 'billing',
    label: 'OPTIC Billing',
    target: '회계/정산',
    description: '회계/정산 담당을 위한 정산 솔루션',
    features: ['매출/매입 정산', '대사', '세금계산서'],
  },
] as const

export const INTEGRATIONS = [
  {
    key: 'gemini',
    name: 'Google Gemini AI',
    description: '주문서 자동 추출',
  },
  {
    key: 'kakao',
    name: '카카오 맵',
    description: '주소 검색, 경로 계산',
  },
  {
    key: 'popbill',
    name: '팝빌',
    description: '세금계산서 발행',
  },
  {
    key: 'logishm',
    name: '로지스엠/화물맨',
    description: '물류 플랫폼 연동',
  },
] as const

export const FOOTER_LINKS = [
  {
    group: '제품',
    links: [
      { label: 'Broker', href: 'https://brkr.optic.app' },
      { label: 'Shipper', href: 'https://shpr.optic.app' },
      { label: 'Carrier', href: '#' },
      { label: 'Operations', href: '#' },
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
