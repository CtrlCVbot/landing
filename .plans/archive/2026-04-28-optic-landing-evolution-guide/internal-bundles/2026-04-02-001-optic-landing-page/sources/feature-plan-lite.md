# Feature Plan Lite: OPTIC 랜딩 페이지

> **Key**: OLP | **Slug**: optic-landing-page | **판정**: Lite (Go, 80.25점)
> **생성일**: 2026-03-31

---

## 1. 기본 정보

| 항목 | 값 |
|------|-----|
| Feature Key | OLP |
| Slug | optic-landing-page |
| IDEA | IDEA-001 |
| Lite 근거 | 상태머신 없음, 외부 연동 없음, API/DB 없음, 고위험 도메인 아님 |
| 프로젝트 위치 | `apps/landing/` (신규) |

### 소스 산출물

| 산출물 | 경로 |
|--------|------|
| Feature Overview | `.plans/features/active/optic-landing-page.md` |
| Wireframe Screens | `.plans/wireframes/optic-landing-page/screens.md` |
| Wireframe Navigation | `.plans/wireframes/optic-landing-page/navigation.md` |
| Wireframe Components | `.plans/wireframes/optic-landing-page/components.md` |
| Bridge Overview | `.plans/bridge/optic-landing-page/01-overview.md` |
| Bridge Wireframe Summary | `.plans/bridge/optic-landing-page/02-wireframe-summary.md` |
| Bridge Dev Context | `.plans/bridge/optic-landing-page/03-dev-context.md` |
| 브랜딩 가이드 | `.plan/idea/2026-03-31-optic-landing-page/optic-branding.md` |

---

## 2. 요구사항 (OLP-REQ)

### 기능 요구사항

| ID | 요구사항 | 섹션 | 우선순위 |
|----|---------|------|---------|
| OLP-REQ-001 | 고정 헤더에 OPTIC 로고, 4개 앵커 네비(기능/제품/연동/문의), CTA 버튼 표시 | SCR-001 | P0 |
| OLP-REQ-002 | 스크롤 시(scrollY >= 100px) 헤더 배경에 블러 효과 적용 | SCR-001 | P1 |
| OLP-REQ-003 | 모바일에서 햄버거 메뉴로 전환, 클릭 시 풀스크린 오버레이 메뉴 표시 | SCR-001 | P0 |
| OLP-REQ-004 | Hero 섹션에 메인 카피("운송 운영을 한눈에"), 서브 카피("오더부터 정산까지") 표시 | SCR-002 | P0 |
| OLP-REQ-005 | Hero에 Primary CTA("도입 문의하기" → #contact 스크롤), Secondary CTA("데모 체험하기" → 외부 링크) 배치 | SCR-002 | P0 |
| OLP-REQ-006 | Hero에 대시보드 프리뷰 비주얼(이미지 또는 모션) 표시 | SCR-002 | P1 |
| OLP-REQ-007 | Hero 배경에 그라데이션 glow 장식 효과 | SCR-002 | P2 |
| OLP-REQ-008 | Problems 섹션에 6개 Before/After 대비 카드 표시 | SCR-003 | P0 |
| OLP-REQ-009 | Features 섹션에 6개 핵심 기능 카드(아이콘+제목+설명) 3x2 그리드 표시 | SCR-004 | P0 |
| OLP-REQ-010 | Feature 카드 hover 시 lift(-4px) + glow 효과 | SCR-004 | P1 |
| OLP-REQ-011 | Products 섹션에 5개 제품 탭(Broker/Shipper/Carrier/Operations/Billing) 전환 | SCR-005 | P0 |
| OLP-REQ-012 | 탭 전환 시 콘텐츠 fade 애니메이션 (0.3s) | SCR-005 | P1 |
| OLP-REQ-013 | Integrations 섹션에 4개 외부 연동 서비스 카드(로고+이름+설명) 표시 | SCR-006 | P0 |
| OLP-REQ-014 | CTA 섹션에 그라데이션 배경 + 대형 CTA 버튼("도입 문의하기") | SCR-007 | P0 |
| OLP-REQ-015 | Footer에 3열 링크(제품/회사/법적), "Powered by OPTICS", 저작권 표시 | SCR-008 | P0 |

### 반응형 요구사항

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| OLP-REQ-016 | Desktop(1280px+): 3열 그리드, 탭 네비, padding 80px | P0 |
| OLP-REQ-017 | Tablet(768-1279px): 2열 그리드, padding 40px | P0 |
| OLP-REQ-018 | Mobile(~767px): 1열, 풀폭 버튼, 햄버거 메뉴, 스와이프 탭, padding 20px | P0 |

### 디자인/브랜딩 요구사항

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| OLP-REQ-019 | 다크 테마: bg #0a0a0a, text white, secondary gray-400, accent purple→blue gradient | P0 |
| OLP-REQ-020 | OpenAI Codex 스타일: 대형 헤딩, 넓은 여백, 카드 그리드 | P0 |
| OLP-REQ-021 | OPTIC 브랜딩 가이드 v1.0 준수 (외부=OPTIC, Footer만 "Powered by OPTICS") | P0 |
| OLP-REQ-022 | 스크롤 기반 섹션 fade-in-up 애니메이션 (0.6s, staggered) | P1 |

### 비기능 요구사항

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| OLP-REQ-023 | Lighthouse Performance >= 90 | P0 |
| OLP-REQ-024 | Lighthouse Accessibility >= 90 | P0 |
| OLP-REQ-025 | 빌드 성공 (0 에러), Static Export (`output: "export"`) | P0 |
| OLP-REQ-026 | SEO 메타데이터: title, description, OpenGraph, Twitter Card | P1 |
| OLP-REQ-027 | 한국어 폰트 지원 (Inter + Pretendard) | P0 |

---

## 3. UI 스펙 요약

### 컴포넌트 → 파일 매핑

| 컴포넌트 | 파일 | 와이어프레임 | 핵심 상태 |
|----------|------|------------|----------|
| Header | `src/components/sections/header.tsx` | SCR-001 | transparent / blurred |
| MobileMenu | `src/components/shared/mobile-menu.tsx` | SCR-001 | hidden / visible |
| Hero | `src/components/sections/hero.tsx` | SCR-002 | 정적 |
| Problems | `src/components/sections/problems.tsx` | SCR-003 | 정적 + scroll fade |
| Features | `src/components/sections/features.tsx` | SCR-004 | default / hover |
| Products | `src/components/sections/products.tsx` | SCR-005 | 탭 active 상태 |
| Integrations | `src/components/sections/integrations.tsx` | SCR-006 | 정적 |
| CTA | `src/components/sections/cta.tsx` | SCR-007 | 정적 |
| Footer | `src/components/sections/footer.tsx` | SCR-008 | 정적 |
| SectionWrapper | `src/components/shared/section-wrapper.tsx` | 공통 | 정적 + scroll fade |
| GradientBlob | `src/components/shared/gradient-blob.tsx` | 공통 | 정적 |
| Button | `src/components/ui/button.tsx` | 공통 | default / hover / active |
| Tabs | `src/components/ui/tabs.tsx` | SCR-005 | default / active |

### 디자인 토큰

| 토큰 | 값 |
|------|-----|
| bg-primary | #0a0a0a |
| bg-card | gray-900/50 |
| border-card | gray-800 |
| text-primary | white |
| text-secondary | gray-400 |
| accent-start | purple-600 |
| accent-end | blue-600 |
| font-heading-desktop | 48-64px |
| font-heading-mobile | 28-32px |
| spacing-section-desktop | 120px |
| spacing-section-mobile | 80px |
| radius-xl | 12px |
| radius-lg | 8px |

---

## 4. 개발 태스크 (OLP-TASK)

### Phase 1: 프로젝트 스캐폴딩

| ID | 태스크 | REQ 매핑 | 의존성 |
|----|--------|---------|--------|
| OLP-TASK-001 | `apps/landing/package.json` 생성 (@mologado/landing, scripts, deps) | OLP-REQ-025 | - |
| OLP-TASK-002 | `apps/landing/tsconfig.json` 생성 (extends tsconfig.base.json) | OLP-REQ-025 | - |
| OLP-TASK-003 | `apps/landing/next.config.ts` 생성 (output: export, optimizePackageImports) | OLP-REQ-025 | - |
| OLP-TASK-004 | `apps/landing/postcss.config.mjs` 생성 | OLP-REQ-019 | - |
| OLP-TASK-005 | `apps/landing/vitest.config.ts` 생성 | OLP-REQ-025 | - |
| OLP-TASK-006 | `src/app/globals.css` 생성 (Tailwind v4 + 다크 디자인 토큰) | OLP-REQ-019 | TASK-004 |
| OLP-TASK-007 | `src/app/layout.tsx` 생성 (Inter + Pretendard 폰트, 메타데이터) | OLP-REQ-027 | TASK-006 |
| OLP-TASK-008 | `src/app/page.tsx` 스텁 생성 | OLP-REQ-025 | TASK-007 |
| OLP-TASK-009 | `src/lib/utils.ts` 생성 (cn 유틸리티) | OLP-REQ-025 | - |
| OLP-TASK-010 | `pnpm install` + 빌드 검증 (dev 서버 3100, static export) | OLP-REQ-025 | TASK-001~009 |

### Phase 2: 공통 컴포넌트 + 디자인 시스템

| ID | 태스크 | REQ 매핑 | 의존성 |
|----|--------|---------|--------|
| OLP-TASK-011 | shadcn/ui 초기화 (components.json) + Button 컴포넌트 (gradient variant 추가) | OLP-REQ-005, 014 | TASK-010 |
| OLP-TASK-012 | shadcn Tabs 컴포넌트 (다크 테마 스타일) | OLP-REQ-011 | TASK-011 |
| OLP-TASK-013 | `src/lib/motion.ts` (fadeInUp, staggerContainer, hoverLift, tabContent variants) | OLP-REQ-022 | TASK-010 |
| OLP-TASK-014 | `src/lib/constants.ts` (NAV_LINKS, PROBLEMS, FEATURES, PRODUCTS, INTEGRATIONS, FOOTER_LINKS) | 전체 | TASK-010 |
| OLP-TASK-015 | `src/components/shared/section-wrapper.tsx` (공통 래퍼 + fade-in) | OLP-REQ-016~018, 022 | TASK-013 |
| OLP-TASK-016 | `src/components/shared/gradient-blob.tsx` (장식용 glow) | OLP-REQ-007 | TASK-010 |
| OLP-TASK-017 | `src/components/icons/optic-logo.tsx` (SVG 컴포넌트) | OLP-REQ-001, 021 | TASK-010 |
| OLP-TASK-018 | `src/hooks/use-scroll-spy.ts` (IntersectionObserver 활성 섹션 추적) | OLP-REQ-001 | TASK-010 |
| OLP-TASK-019 | `src/hooks/use-media-query.ts` (SSR-safe 반응형 훅) | OLP-REQ-003 | TASK-010 |

### Phase 3: 섹션 구현 (TDD)

| ID | 태스크 | REQ 매핑 | 의존성 |
|----|--------|---------|--------|
| OLP-TASK-020 | Header 섹션 (header.tsx + mobile-menu.tsx) | OLP-REQ-001~003 | TASK-015~019 |
| OLP-TASK-021 | Hero 섹션 (hero.tsx) | OLP-REQ-004~007 | TASK-015, 016 |
| OLP-TASK-022 | Problems 섹션 (problems.tsx) | OLP-REQ-008 | TASK-014, 015 |
| OLP-TASK-023 | Features 섹션 (features.tsx) | OLP-REQ-009~010 | TASK-013~015 |
| OLP-TASK-024 | Products 섹션 (products.tsx) | OLP-REQ-011~012 | TASK-012~015 |
| OLP-TASK-025 | Integrations 섹션 (integrations.tsx) | OLP-REQ-013 | TASK-014, 015 |
| OLP-TASK-026 | CTA 섹션 (cta.tsx) | OLP-REQ-014 | TASK-011, 015 |
| OLP-TASK-027 | Footer 섹션 (footer.tsx) | OLP-REQ-015, 021 | TASK-014, 017 |
| OLP-TASK-028 | page.tsx 조립 (8개 섹션 import + 렌더) | 전체 | TASK-020~027 |

### Phase 4: SEO + 성능 최적화

| ID | 태스크 | REQ 매핑 | 의존성 |
|----|--------|---------|--------|
| OLP-TASK-029 | layout.tsx에 OpenGraph, Twitter Card 메타데이터 추가 | OLP-REQ-026 | TASK-028 |
| OLP-TASK-030 | sitemap.ts + robots.ts 생성 | OLP-REQ-026 | TASK-028 |
| OLP-TASK-031 | 이미지 최적화 (webp, lazy loading, 명시적 width/height) | OLP-REQ-023 | TASK-028 |
| OLP-TASK-032 | Lighthouse 감사 실행 (Performance >= 90, A11y >= 90) | OLP-REQ-023~024 | TASK-029~031 |

### Phase 5: CI 통합

| ID | 태스크 | REQ 매핑 | 의존성 |
|----|--------|---------|--------|
| OLP-TASK-033 | `.claude/launch.json` 업데이트 (landing dev 서버 설정) | OLP-REQ-025 | TASK-010 |
| OLP-TASK-034 | 루트 빌드/테스트/타입체크 통합 검증 | OLP-REQ-025 | TASK-032 |

---

## 5. 테스트 케이스 (OLP-TC)

### 컴포넌트 렌더링 테스트

| ID | 테스트 | REQ 매핑 | 파일 |
|----|--------|---------|------|
| OLP-TC-001 | Header: 로고, 4개 네비 링크, CTA 버튼 렌더 | OLP-REQ-001 | `__tests__/sections/header.test.tsx` |
| OLP-TC-002 | Header: 모바일 햄버거 아이콘 aria-label 존재 | OLP-REQ-003 | `__tests__/sections/header.test.tsx` |
| OLP-TC-003 | Hero: h1 "운송 운영을 한눈에" 텍스트 렌더 | OLP-REQ-004 | `__tests__/sections/hero.test.tsx` |
| OLP-TC-004 | Hero: 2개 CTA 버튼 렌더 (도입 문의 + 데모) | OLP-REQ-005 | `__tests__/sections/hero.test.tsx` |
| OLP-TC-005 | Problems: 6개 Before/After 카드 렌더 | OLP-REQ-008 | `__tests__/sections/problems.test.tsx` |
| OLP-TC-006 | Features: 6개 기능 카드 (제목+설명) 렌더 | OLP-REQ-009 | `__tests__/sections/features.test.tsx` |
| OLP-TC-007 | Products: 5개 탭 트리거 렌더 | OLP-REQ-011 | `__tests__/sections/products.test.tsx` |
| OLP-TC-008 | Products: 탭 클릭 시 콘텐츠 전환 | OLP-REQ-011 | `__tests__/sections/products.test.tsx` |
| OLP-TC-009 | Integrations: 4개 연동 카드 (이름) 렌더 | OLP-REQ-013 | `__tests__/sections/integrations.test.tsx` |
| OLP-TC-010 | CTA: 헤딩 + CTA 버튼 렌더 | OLP-REQ-014 | `__tests__/sections/cta.test.tsx` |
| OLP-TC-011 | Footer: 3개 링크 그룹 + 저작권 텍스트 렌더 | OLP-REQ-015 | `__tests__/sections/footer.test.tsx` |
| OLP-TC-012 | Footer: "Powered by OPTICS" 텍스트 존재 | OLP-REQ-021 | `__tests__/sections/footer.test.tsx` |

### 통합 테스트

| ID | 테스트 | REQ 매핑 | 파일 |
|----|--------|---------|------|
| OLP-TC-013 | 전체 페이지: 8개 섹션 landmark(id) 존재 | 전체 | `__tests__/page.test.tsx` |
| OLP-TC-014 | SectionWrapper: children 렌더, id 속성 적용 | OLP-REQ-016~018 | `__tests__/shared/section-wrapper.test.tsx` |
| OLP-TC-015 | useScrollSpy: IntersectionObserver 기반 활성 섹션 반환 | OLP-REQ-001 | `__tests__/hooks/use-scroll-spy.test.tsx` |

### 접근성 테스트

| ID | 테스트 | REQ 매핑 | 파일 |
|----|--------|---------|------|
| OLP-TC-016 | axe-core: 각 섹션 WCAG 2.1 AA 위반 없음 | OLP-REQ-024 | `__tests__/accessibility.test.tsx` |

### 빌드 검증

| ID | 테스트 | REQ 매핑 | 검증 방법 |
|----|--------|---------|----------|
| OLP-TC-017 | Static export 빌드 성공 (exit 0) | OLP-REQ-025 | `pnpm --filter @mologado/landing build` |
| OLP-TC-018 | 타입체크 통과 (0 에러) | OLP-REQ-025 | `pnpm --filter @mologado/landing typecheck` |

---

## 6. 기술 결정

| 결정 | 선택 | 근거 |
|------|------|------|
| 렌더링 모드 | `output: "export"` (완전 정적) | API/DB/Auth 없음, CDN 최적, TTFB 최소 |
| 개발 서버 포트 | 3100 | mm-broker(3000) 충돌 방지 |
| 폰트 | Inter (next/font/google) + Pretendard (CDN) | 한국어 지원, font-display: swap |
| 이미지 | `<img>` + 사전 최적화 webp | Static export에서 next/image 비활성 |
| 애니메이션 | Framer Motion | scroll-triggered fade-in, tab transition |
| UI 컴포넌트 | shadcn/ui (Button, Tabs) | 기존 스택 일관성 |
| 아이콘 | Lucide React | 기존 스택 일관성 |
| 테스트 | Vitest + Testing Library + vitest-axe | 컴포넌트 렌더링 + 접근성 |

---

## 7. 릴리스 체크리스트

- [ ] 모든 OLP-TC 통과 (18개)
- [ ] `pnpm --filter @mologado/landing build` 성공
- [ ] `pnpm --filter @mologado/landing typecheck` 성공
- [ ] Lighthouse Performance >= 90
- [ ] Lighthouse Accessibility >= 90
- [ ] 반응형 확인: 375px / 768px / 1280px
- [ ] 브랜딩 가이드 v1.0 준수 확인
- [ ] SEO 메타데이터 (OG, Twitter Card) 확인
- [ ] Vercel 프리뷰 배포 확인

---

## 다음 단계

`/dev optic-landing-page` → Phase D: TDD 기반 코드 구현 (OLP-TASK-001부터 순차 실행)
