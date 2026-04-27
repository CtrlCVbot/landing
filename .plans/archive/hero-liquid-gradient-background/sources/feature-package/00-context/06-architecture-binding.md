# 06. Architecture Binding — Hero 섹션 liquid gradient 배경

> **Feature slug**: `hero-liquid-gradient-background`
> **Source Profile**: [`.plans/project/00-dev-architecture.md`](../../../../project/00-dev-architecture.md) (status: approved)
> **작성일**: 2026-04-27

---

## 1. Structure Binding

| 항목 | 값 |
|---|---|
| Workspace Topology | `monorepo-leaf-single-app` |
| Selected Structure Mode | `hybrid` (type-based outer + feature-scoped pocket) |
| Layer Style | `layered` |
| Stack Contract | TypeScript + Next.js 15 App Router + Vitest + Tailwind 4 |
| Section layer | `src/components/sections/` |
| Shared visual | `src/components/shared/` |
| Theme token source | `src/app/globals.css` |

본 Feature는 landing section presentation과 shared visual layer를 다룬다. dashboard-preview feature pocket 내부, backend, external IO, shared package는 만들지 않는다.

## 2. Allowed Target Paths

| Layer | Path | 용도 |
|---|---|---|
| Presentation / Section | `src/components/sections/hero.tsx` | background layer mount, layer ordering |
| Presentation / Shared | `src/components/shared/gradient-blob.tsx` | fallback 유지 또는 정리 |
| Presentation / Shared | `src/components/shared/hero-liquid-gradient-background.tsx` | 필요 시 신규 CSS-first component |
| Theme / CSS | `src/app/globals.css` | theme token 또는 reduced-motion CSS |
| Test | `src/components/sections/__tests__/hero.test.tsx` | Hero acceptance tests |
| Test | `src/__tests__/light-theme.test.tsx` | theme token alignment test |
| Plan evidence | `.plans/features/active/hero-liquid-gradient-background/**` | QA notes/evidence |

## 3. Recommended Test Paths

- `src/components/sections/__tests__/hero.test.tsx`
- `src/__tests__/light-theme.test.tsx`

## 4. Shared Package Touch Points

없음. 본 Feature는 `@mologado/landing` leaf app 내부에서만 처리한다.

## 5. Verification Notes

| 검증 | 기대 |
|---|---|
| `pnpm test src/components/sections/__tests__/hero.test.tsx` | background layer, CTA, preview wrapper 조건 통과 |
| `pnpm test src/__tests__/light-theme.test.tsx` | token 추가 시 light/dark token alignment 통과 |
| `pnpm typecheck` | TypeScript 0 errors |
| `pnpm lint` | 신규 lint error 없음 |
| Browser screenshot review | light/dark desktop/mobile 가독성 통과 |
| Browser theme toggle check | 이전 theme gradient 잔존 없음 |

## 6. 금지

- `tailwind.config.ts` 추가/수정 금지.
- `Three.js` / WebGL runtime dependency 추가 금지.
- `src/components/dashboard-preview/**` 내부 변경 금지.
- `ThemeProvider` 구조 변경 금지.
- 실제 API, backend route, persistence 추가 금지.
