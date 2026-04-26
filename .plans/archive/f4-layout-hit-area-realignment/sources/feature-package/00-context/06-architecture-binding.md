# 06. Architecture Binding — F4 레이아웃 정비 + Hit-Area 재정렬

> **Feature slug**: `f4-layout-hit-area-realignment`
> **Source Profile**: [`.plans/project/00-dev-architecture.md`](../../../../project/00-dev-architecture.md) (status: approved)
> **작성일**: 2026-04-24
> **Epic**: [EPIC-20260422-001](../../../../epics/20-active/EPIC-20260422-001/00-epic-brief.md) Phase B

---

## 1. Structure Binding

| 항목 | 값 |
|---|---|
| Workspace Topology | `monorepo-leaf-single-app` |
| Selected Structure Mode | `hybrid` (type-based outer + feature-scoped pocket) |
| Layer Style | `layered` |
| Stack Contract | TypeScript + Next.js 15 App Router + Vitest + Tailwind 4 |
| Feature pocket | `src/components/dashboard-preview/` |

F4는 existing dashboard-preview feature pocket 내부의 presentation/interaction 정비다. 신규 app-level 구조나 shared package는 만들지 않는다.

## 2. Allowed Target Paths

| Layer | Path | 용도 |
|---|---|---|
| Presentation | `src/components/dashboard-preview/ai-register-main/order-form/index.tsx` | DateTime layout wrapper |
| Presentation | `src/components/dashboard-preview/ai-register-main/order-form/datetime-card.tsx` | 카드 presentation 보정 |
| Interaction | `src/components/dashboard-preview/hit-areas.ts` | bounds 재측정 |
| Interaction | `src/components/dashboard-preview/interactive-overlay.tsx` | anchor 기준 검토 |
| Test | `src/components/dashboard-preview/__tests__/hit-areas.test.ts` | bounds regression |
| Test | `src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx` | preview integration |
| Test | `src/components/dashboard-preview/ai-register-main/order-form/__tests__/datetime-card.test.tsx` | layout component |
| Test | `src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx` | order form integration |
| Test | `src/__tests__/dashboard-preview/legacy/interactive-overlay.test.tsx` | legacy overlay regression |
| Plan evidence | `.plans/features/active/f4-layout-hit-area-realignment/03-dev-notes/**` | bounds evidence |

## 3. Recommended Test Paths

- `src/components/dashboard-preview/__tests__/hit-areas.test.ts`
- `src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx`
- `src/components/dashboard-preview/ai-register-main/order-form/__tests__/datetime-card.test.tsx`
- `src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx`
- `src/__tests__/dashboard-preview/legacy/interactive-overlay.test.tsx`

## 4. Shared Package Touch Points

없음. 본 Feature는 leaf app 내부 dashboard-preview pocket만 수정한다.

## 5. Verification Notes

| 검증 | 기대 |
|---|---|
| `pnpm test src/components/dashboard-preview/__tests__/hit-areas.test.ts` | bounds 관련 테스트 통과 |
| `pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/datetime-card.test.tsx` | DateTime layout 회귀 없음 |
| `pnpm typecheck` | TypeScript 0 errors |
| `pnpm lint` | 신규 lint error 없음 |
| `pnpm test` | 전체 회귀 통과 |

## 6. 금지

- `tailwind.config.ts` 추가/수정 금지.
- `mock-data.ts` schema 변경 금지.
- 새 좌표 엔진 또는 외부 dependency 도입 금지.
