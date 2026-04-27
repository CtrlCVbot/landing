# 06. Architecture Binding — F2 Mock 스키마 재설계

> **Feature slug**: `f2-mock-schema-redesign`
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
| Data utilities | `src/lib/` |
| Feature pocket | `src/components/dashboard-preview/` |

F2는 `src/lib`의 mock/step data와 dashboard-preview pocket의 presentation 연결을 함께 다룬다. 신규 backend, external IO, shared package는 만들지 않는다.

## 2. Allowed Target Paths

| Layer | Path | 용도 |
|---|---|---|
| Utility/Data | `src/lib/mock-data.ts` | scenario array, frame split, selector/helper |
| Utility/Data | `src/lib/preview-steps.ts` | Step visibility state, `formRevealTimeline`, duration constants |
| Presentation | `src/components/dashboard-preview/dashboard-preview.tsx` | loop-start scenario rotation |
| Presentation | `src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx` | `extractedFrame` source 연결 |
| Presentation | `src/components/dashboard-preview/ai-register-main/order-form/index.tsx` | `appliedFrame` source 연결 |
| Presentation | `src/components/dashboard-preview/ai-register-main/order-form/location-form.tsx` | hidden/revealed placeholder 표시 |
| Presentation | `src/components/dashboard-preview/ai-register-main/order-form/datetime-card.tsx` | hidden/revealed placeholder 표시 |
| Presentation | `src/components/dashboard-preview/ai-register-main/order-form/cargo-info-form.tsx` | hidden/revealed placeholder 표시 |
| Presentation | `src/components/dashboard-preview/ai-register-main/order-form/transport-option-card.tsx` | hidden 상태 neutral, revealed 상태 options checked |
| Presentation | `src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx` | visibility/value source 최소 조정 |
| Presentation | `src/components/dashboard-preview/ai-register-main/order-form/settlement-section.tsx` | visibility/value source 최소 조정 |
| Test | `src/__tests__/lib/mock-data.test.ts` | schema/consistency |
| Test | `src/__tests__/lib/preview-steps.test.ts` | Step visibility |
| Test | `src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx` | scenario rotation |
| Test | `src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/index.test.tsx` | AI source |
| Test | `src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/flow.test.tsx` | AI flow |
| Test | `src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/ai-result-buttons.test.tsx` | AI result compatibility |
| Test | `src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx` | order form source |
| Test | `src/components/dashboard-preview/ai-register-main/order-form/__tests__/cargo-info-form.test.tsx` | hidden/revealed cargo state |
| Test | `src/components/dashboard-preview/ai-register-main/order-form/__tests__/estimate-info-card.test.tsx` | hidden/rolling estimate state |
| Test | `src/components/dashboard-preview/ai-register-main/order-form/__tests__/settlement-section.test.tsx` | settlement visibility |
| Test | `src/components/dashboard-preview/ai-register-main/order-form/__tests__/transport-option-card.test.tsx` | hidden/revealed option checked state |
| Plan evidence | `.plans/features/active/f2-mock-schema-redesign/03-dev-notes/**` | migration notes |

## 3. Recommended Test Paths

- `src/__tests__/lib/mock-data.test.ts`
- `src/__tests__/lib/preview-steps.test.ts`
- `src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx`
- `src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/index.test.tsx`
- `src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/flow.test.tsx`
- `src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx`
- `src/components/dashboard-preview/ai-register-main/order-form/__tests__/cargo-info-form.test.tsx`
- `src/components/dashboard-preview/ai-register-main/order-form/__tests__/estimate-info-card.test.tsx`
- `src/components/dashboard-preview/ai-register-main/order-form/__tests__/settlement-section.test.tsx`
- `src/components/dashboard-preview/ai-register-main/order-form/__tests__/transport-option-card.test.tsx`

## 4. Shared Package Touch Points

없음. 본 Feature는 leaf app 내부 `src/lib`와 dashboard-preview pocket만 수정한다.

## 5. Verification Notes

| 검증 | 기대 |
|---|---|
| `pnpm test src/__tests__/lib/mock-data.test.ts` | scenario/frame/fee consistency 통과 |
| `pnpm test src/__tests__/lib/preview-steps.test.ts` | Step visibility 통과 |
| `pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx` | applied source 연결 통과 |
| `pnpm test src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/index.test.tsx` | extracted source 연결 통과 |
| `pnpm typecheck` | TypeScript 0 errors |
| `pnpm lint` | 신규 lint error 없음 |
| `pnpm test` | 전체 회귀 통과 |
| `pnpm build` | production build 통과 |

## 6. 금지

- `hit-areas.ts` bounds 변경 금지.
- `interactive-overlay.tsx` anchor 변경 금지.
- 실제 AI API, backend route, persistence 추가 금지.
- `tailwind.config.ts` 추가/수정 금지.

## 7. 구현 후 실제 검증 기록

| 검증 | 결과 | 메모 |
|---|---|---|
| `git diff --check` | PASS | whitespace error 없음 |
| `pnpm typecheck` | PASS | `tsc --noEmit` |
| `pnpm lint` | PASS with warnings | 기존 unused var / hook dependency / Next workspace warning |
| `pnpm test` | PASS | 45 files / 1039 tests |
| `pnpm build` | PASS | 단독 재실행 기준 production build 성공 |
