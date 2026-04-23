# Architecture Profile — @mologado/landing

> **Source**: detected from existing codebase on 2026-04-23
> **Status**: approved (detected 구조 채택, 기존 증거 강함)
> **Applied by**: `/dev-architecture` Phase A Step 9 선행 작업 (EPIC-20260422-001)

---

## 1. Status

- **State**: `approved`
- **Detected**: 2026-04-23
- **Approved by**: 사용자 (풀 파이프라인 경로 선택, 본 문서 생성 승인)

---

## 2. Detection Summary

본 리포는 `mologado` 모노레포의 **leaf app** (`apps/landing/`)으로, 자체는 **단일 Next.js 15 App Router 앱**이다. 구조 증거:

- `profile.json`: `type: "monorepo"` (상위 mologado), `framework: "turborepo"` — 본 leaf는 단일 앱 성격
- `package.json`: `@mologado/landing`, `next ^15.1.0`, `react ^18.3`, `vitest ^3.0`, `tailwindcss ^4.0`
- `src/app/`: App Router entry (`globals.css` + `layout.tsx` + `page.tsx`)
- `src/components/`: type-based 그룹 (`sections/`, `ui/`, `shared/`, `providers/`, `icons/`) + feature-scoped pocket (`dashboard-preview/`)
- `src/lib/`, `src/hooks/`: 공용 유틸/훅 집중
- `src/__tests__/`: 소스 트리 대칭 테스트 (Vitest)

기존 패턴이 명확히 반복되므로 **신규 구조를 추천하지 않고 감지 구조를 그대로 SSOT로 채택**.

---

## 3. Workspace Topology

- **Topology**: `monorepo-leaf-single-app`
- **Root**: `C:\Program Files (user)\mologado\` (Turborepo)
- **This app**: `apps/landing/` — 독립 Next.js 앱
- **Packages 의존**: 본 leaf는 현재 `@mologado/*` 내부 패키지 import 없음 (standalone). 향후 공유 UI/토큰이 생기면 `packages/ui` 등으로 이관 가능 (v2+ 검토).

---

## 4. Structure Mode

- **Mode**: `hybrid` (type-based outer + feature-scoped pocket)
- **Rationale**:
  - **Outer type-based**: `src/components/{sections, ui, shared, providers, icons}/` — 랜딩 페이지 섹션·UI primitive·공용·프로바이더·아이콘 타입별 그룹. 각 섹션은 단일 파일(`hero.tsx`, `features.tsx` 등).
  - **Inner feature-scoped**: `src/components/dashboard-preview/` — 자체 `hooks/`, `interactions/`, `ai-register-main/`, `__tests__/` 하위 구조를 갖는 서브 feature. 복잡도가 높아 feature pocket으로 격리됨.
- **Convention**: 신규 단순 섹션은 `src/components/sections/` 단일 파일로, 복잡한 서브 feature는 `src/components/{feature-slug}/` 하위 pocket으로.

---

## 5. Layer Style

- **Style**: `layered` (얕은 계층)
- **Rationale**: 랜딩 페이지 특성상 도메인 로직·외부 포트가 최소. Hexagonal/Clean은 과적합. 현재 계층:
  - **Route**: `src/app/` (Next.js App Router pages/layout/globals)
  - **Presentation**: `src/components/**/*.tsx` (React 컴포넌트 — sections, UI primitives, feature pockets)
  - **State/Effect**: `src/hooks/*.ts`, `src/components/**/hooks/*.ts` (React Hooks)
  - **Utility**: `src/lib/*.ts` (constants, mock-data, motion config, preview-steps, class utils)

> 상위 mologado monorepo의 `hexagonal` 표기(`profile.json`)는 전체 조직 정책이며, landing leaf는 layered 적용.

---

## 6. Stack Contract

| 영역 | 선택 | 버전 |
|------|------|------|
| Language | TypeScript | `^5.7` |
| Framework | Next.js App Router | `^15.1` |
| Runtime | React | `^18.3` |
| Styling | Tailwind CSS | `^4.0` (`@tailwindcss/postcss` + `@theme inline`) |
| Animation | framer-motion | `^11.15` |
| Icons | lucide-react | `^0.474` |
| UI primitives | shadcn 기반 + `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge` | — |
| Test runner | Vitest | `^3.0` |
| Test env | jsdom | `^25.0` |
| A11y test | `@axe-core/react` + `jest-axe` | `^4.11`, `^10.0` |
| Lint | ESLint + `eslint-config-next` | `^9.0`, `^15.1` |
| Package manager | pnpm (상위 mologado), npm 스크립트 | — |
| Dev runner | `next dev --turbopack -p 3100` | — |

### Forbidden

- `tailwind.config.ts` **미사용** (Tailwind 4 — `src/app/globals.css` `@theme inline`이 대체). 본 문서/향후 Feature에서 언급 금지.
- Jest 사용 금지 (Vitest로 통일).
- CSS-in-JS (styled-components, emotion) 도입 금지 (Tailwind + CSS variables로 통일).

---

## 7. Layer Mapping

| 레이어 | 디렉터리 | 예시 |
|--------|----------|------|
| Route + App Shell | `src/app/` | `layout.tsx`, `page.tsx`, `globals.css` |
| Sections (landing) | `src/components/sections/` | `hero.tsx`, `features.tsx`, `footer.tsx`, `header.tsx`, `pricing.tsx` 등 |
| Feature pockets | `src/components/{feature-slug}/` | `dashboard-preview/` (자체 `__tests__/`, `hooks/`, `interactions/`, `ai-register-main/` 포함) |
| UI primitives | `src/components/ui/` | `button.tsx`, `card.tsx`, `input.tsx`, `badge.tsx`, `textarea.tsx` (shadcn 기반) |
| Shared presentational | `src/components/shared/` | `gradient-blob.tsx`, `section-wrapper.tsx` |
| Providers | `src/components/providers/` | `motion-provider.tsx` (+ 향후 `theme-provider.tsx`) |
| Icons | `src/components/icons/` | 아이콘 컴포넌트 |
| Global hooks | `src/hooks/` | `use-media-query.ts`, `use-scroll-spy.ts` |
| Utilities | `src/lib/` | `constants.ts`, `mock-data.ts`, `motion.ts`, `preview-steps.ts`, `utils.ts` |
| Tests (global) | `src/__tests__/` | 소스 트리 대칭 구조 |
| Tests (feature pocket) | `src/components/{feature-slug}/__tests__/` | `dashboard-preview/__tests__/` |

---

## 8. Shared vs Local Rules

### 8-1. Local 원칙 (기본)

새 컴포넌트·훅·유틸은 **처음 사용하는 섹션·feature pocket 내부에 Local로 작성**한다.

### 8-2. Shared 승격 기준

다음 조건 중 **2개 이상** 충족 시 shared 위치로 이관:

1. **재사용 횟수**: 2개 이상의 섹션/feature에서 import
2. **도메인 중립성**: 특정 feature에 종속되지 않는 순수 UI/로직
3. **안정성**: 인터페이스 변경 없이 3회 이상 사용

### 8-3. Shared 위치 결정표

| 성격 | 위치 |
|------|------|
| shadcn 기반 UI primitive (Button, Card 등) | `src/components/ui/` |
| 도메인 중립 presentation (그라디언트, wrapper 등) | `src/components/shared/` |
| React Context Provider | `src/components/providers/` |
| Pure function utility | `src/lib/` |
| React Hook | `src/hooks/` |
| Icon 컴포넌트 | `src/components/icons/` |

### 8-4. Cross-package touch points

현재 `@mologado/*` 내부 패키지 의존 없음. 향후 공유 토큰·UI 라이브러리 도입 시:

- 제안 경로: `packages/ui` (공유 UI), `packages/tokens` (공유 디자인 토큰)
- 결정 게이트: `/dev-architecture` 재실행 + 본 문서 `Status` `approved → revising → approved` 전이

---

## 9. Verification Contract

### 9-1. 필수 검증 명령

| 명령 | 목적 | 기대 |
|------|------|------|
| `pnpm typecheck` (`tsc --noEmit`) | TypeScript 컴파일 | 0 errors |
| `pnpm lint` (`next lint`) | ESLint | 0 errors |
| `pnpm test` (`vitest run`) | 단위/통합 테스트 | 0 failures |
| `pnpm build` (`next build`) | production 빌드 | 성공 |
| `pnpm dev --turbopack -p 3100` | dev 서버 | hydration 경고 0 건 |

### 9-2. 커버리지 기준

- 신규 코드 커버리지 ≥ **80%** (golden-principles #3)
- 테스트 위치: `src/__tests__/` 우선, feature pocket은 내부 `__tests__/` 허용

### 9-3. 접근성 검증

- `@axe-core/react` + `jest-axe`로 주요 섹션 a11y 검증
- WCAG AA: 색 대비 ≥ 4.5:1 (텍스트), ≥ 3:1 (UI)

### 9-4. 번들/성능

- production 번들 증분 변경 시 `pnpm build` 출력 비교
- FOUC·hydration·전환 지연 등 런타임 체감 지표는 각 Feature의 NFR에서 정의

---

## 10. 적용 범위 (Scope of this Profile)

본 Architecture Profile은 **@mologado/landing** leaf 앱의 개발 구조만 규정한다. 다음은 본 Profile 범위 **외**:

- 상위 mologado monorepo root 구조
- 타 leaf app (존재 시)
- packages/* 내부 구조 (향후 공유 UI 도입 시 별도 Profile)
- CI/CD 파이프라인, 릴리스 전략

---

## 11. 변경 이력

| 날짜 | 변경 | 작성자 |
|------|------|--------|
| 2026-04-23 | 초안 — `/dev-architecture f1-landing-light-theme` 실행 시점. 기존 구조 detected → approved. EPIC-20260422-001 Phase A Step 9 선행. | `/dev-architecture` (메인 세션) |
