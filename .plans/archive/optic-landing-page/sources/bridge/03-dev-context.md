# Bridge: OPTIC 랜딩 페이지 — 개발 참조 컨텍스트

> `/dev-feature optic-landing-page` 진입 시 이 파일을 참조

---

## 기술 스택

| 항목 | 선택 |
|------|------|
| 프레임워크 | Next.js 15 (App Router, Static Export) |
| UI | React 19 + TypeScript |
| 스타일 | Tailwind CSS v4 + shadcn/ui |
| 애니메이션 | Framer Motion |
| 배포 | Vercel (optic.app 도메인) |
| 패키지 매니저 | pnpm (workspace) |
| 빌드 | Turborepo |

## 프로젝트 위치

```
apps/landing/                    ← 신규 생성
├── app/
│   ├── layout.tsx               # 루트 레이아웃 (메타데이터, 폰트, 글로벌 스타일)
│   ├── page.tsx                 # 메인 랜딩 (섹션 컴포넌트 조합)
│   └── globals.css              # Tailwind 글로벌 스타일
├── components/
│   ├── header.tsx               # SCR-001: 고정 헤더 + 네비게이션
│   ├── hero-section.tsx         # SCR-002: Hero (카피 + CTA + 비주얼)
│   ├── problems-section.tsx     # SCR-003: Before/After 대비
│   ├── features-section.tsx     # SCR-004: 6개 기능 카드 그리드
│   ├── products-section.tsx     # SCR-005: 5개 제품 탭
│   ├── integrations-section.tsx # SCR-006: 4개 연동 카드
│   ├── cta-section.tsx          # SCR-007: CTA
│   └── footer.tsx               # SCR-008: Footer
├── components/ui/               # 공통 UI (SectionWrapper, Button 등)
├── lib/
│   └── constants.ts             # 카피, 제품 데이터, 연동 데이터
├── public/
│   └── images/                  # 로고, 아이콘, 스크린샷
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 컴포넌트 → 와이어프레임 매핑

| 컴포넌트 파일 | 와이어프레임 | 핵심 참조 |
|--------------|------------|----------|
| `header.tsx` | SCR-001 | 고정, 앵커 스크롤, 스크롤 블러, 모바일 햄버거 |
| `hero-section.tsx` | SCR-002 | 100vh, 중앙 정렬, 2x CTA, 그라데이션 glow |
| `problems-section.tsx` | SCR-003 | 2열 Before/After, 6개 항목, staggered fade |
| `features-section.tsx` | SCR-004 | 3x2 카드 그리드, hover lift+glow |
| `products-section.tsx` | SCR-005 | 탭 전환, 5개 제품, 모바일 스와이프 |
| `integrations-section.tsx` | SCR-006 | 4열 카드, 로고+이름+설명 |
| `cta-section.tsx` | SCR-007 | 그라데이션 bg, 대형 CTA |
| `footer.tsx` | SCR-008 | 3열 링크, "Powered by OPTICS" |

## 데이터 상수 (lib/constants.ts)

### 제품 데이터

```typescript
readonly products = [
  { key: 'broker', label: 'OPTIC Broker', target: '주선사', description: '주선사를 위한 통합 운영 솔루션', features: ['오더 생성 및 관리', '배차/진행 상태 추적', '매출/매입 정산', '거래처/차주 관리'] },
  { key: 'shipper', label: 'OPTIC Shipper', target: '화주', description: '화주를 위한 운송 요청 솔루션', features: ['오더 생성/조회', '상하차지/거래처 관리'] },
  { key: 'carrier', label: 'OPTIC Carrier', target: '운송사/차주', description: '운송사/차주를 위한 배차 솔루션', features: ['배차 수락', '운송 수행', '상하차지 확인'] },
  { key: 'operations', label: 'OPTIC Operations', target: '운영/관제팀', description: '운영/관제팀을 위한 모니터링 솔루션', features: ['전체 현황 모니터링', '데이터 유지보수'] },
  { key: 'billing', label: 'OPTIC Billing', target: '회계/정산', description: '회계/정산 담당을 위한 정산 솔루션', features: ['매출/매입 정산', '대사', '세금계산서'] },
] as const
```

### 기능 데이터

```typescript
readonly features = [
  { icon: 'clipboard', title: '주문 관리', description: '화물 등록부터 상태 추적까지 한 화면에서' },
  { icon: 'truck', title: '배차 관리', description: '기사 배정, 진행 상황 실시간 모니터링' },
  { icon: 'calculator', title: '정산 자동화', description: '매출/매입 자동 계산, 대사 처리' },
  { icon: 'receipt', title: '세금계산서', description: '팝빌 연동 전자 세금계산서 발행' },
  { icon: 'sparkles', title: 'AI 주문 추출', description: 'Gemini AI로 주문서 텍스트 자동 인식' },
  { icon: 'map', title: '지도 연동', description: '카카오 맵 주소 검색, 경로·거리 계산' },
] as const
```

### 연동 데이터

```typescript
readonly integrations = [
  { key: 'gemini', name: 'Google Gemini AI', description: '주문서 자동 추출' },
  { key: 'kakao', name: '카카오 맵', description: '주소 검색, 경로 계산' },
  { key: 'popbill', name: '팝빌', description: '세금계산서 발행' },
  { key: 'logishm', name: '로지스엠/화물맨', description: '물류 플랫폼 연동' },
] as const
```

### 문제-해결 대비 데이터

```typescript
readonly problems = [
  { before: '엑셀/수기 주문 관리', after: '주문 등록·상태 추적·이력 자동화' },
  { before: '배차 현황 파악 어려움', after: '실시간 배차 상태 대시보드' },
  { before: '정산/세금계산서 수작업', after: '매출/매입 정산 자동 + 세금계산서 연동' },
  { before: '외부 플랫폼 별도 관리', after: '로지스엠(화물맨) 통합 연동' },
  { before: '주소/경로 분산 검색', after: '카카오 맵 통합 검색' },
  { before: '주문서 반복 입력', after: 'AI 기반 주문서 자동 추출' },
] as const
```

## 브랜딩 규칙 (개발 시 준수)

| 규칙 | 적용 |
|------|------|
| 외부 브랜드명 | **OPTIC** (대문자) |
| 기술 브랜드명 | **OPTICS** (Footer "Powered by OPTICS"에만) |
| 메인 카피 | "운송 운영을 한눈에" |
| 서브 카피 | "오더부터 정산까지" |
| CTA 카피 | "도입 문의하기" / "데모 체험하기" |
| 도메인 체계 | {service}.{tenant}.optic.app |

## 참조 파일 경로

| 산출물 | 경로 |
|--------|------|
| Feature Overview | `.plans/features/active/optic-landing-page.md` |
| 와이어프레임 Screens | `.plans/wireframes/optic-landing-page/screens.md` |
| 와이어프레임 Navigation | `.plans/wireframes/optic-landing-page/navigation.md` |
| 와이어프레임 Components | `.plans/wireframes/optic-landing-page/components.md` |
| 브랜딩 가이드 | `.plan/idea/2026-03-31-optic-landing-page/optic-branding.md` |
| 서비스 참조 | `.references/code/mm-broker/docs/handbook-claude/` |
| RICE 스크리닝 | `.plans/ideas/screening-matrix.md` |
