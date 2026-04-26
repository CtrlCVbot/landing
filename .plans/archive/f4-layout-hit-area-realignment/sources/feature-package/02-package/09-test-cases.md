# 09. Test Cases - F4 레이아웃 정비 + Hit-Area 재정렬

---

## 테스트 케이스 목록

| TC | REQ | 검증 대상 | 권장 명령 |
|---|---|---|---|
| TC-F4-01 | REQ-f4-layout-hit-area-001 | 390px mobile 1열 | `pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/datetime-card.test.tsx` |
| TC-F4-02 | REQ-f4-layout-hit-area-001 | 768px 이상 2열 | `pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx` |
| TC-F4-03 | REQ-f4-layout-hit-area-002 | desktop 18 bounds count/delta | `pnpm test src/components/dashboard-preview/__tests__/hit-areas.test.ts` |
| TC-F4-04 | REQ-f4-layout-hit-area-003 | tablet 공유/분리 판정 | `pnpm test src/components/dashboard-preview/__tests__/hit-areas.test.ts` |
| TC-F4-05 | REQ-f4-layout-hit-area-004, 005 | overlay anchor + hover/focus target | `pnpm test src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx` |
| TC-F4-06 | REQ-f4-layout-hit-area-006 | preview integration regression | `pnpm test src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx` |
| TC-F4-07 | REQ-f4-layout-hit-area-007 | `mock-data.ts` 변경 없음 | `git diff -- src/lib/mock-data.ts` |

---

## Red-Green 권장 순서

1. TC-F4-01~02로 layout 기대값을 먼저 고정한다.
2. T-F4-LAYOUT-01 구현 후 layout tests를 GREEN으로 만든다.
3. TC-F4-03~04로 bounds evidence 기준을 고정한다.
4. T-F4-HITAREA-02~03으로 desktop/tablet evidence를 채운다.
5. TC-F4-05로 overlay anchor decision을 검증한다.
6. TC-F4-06~07로 preview regression과 F2 충돌 회피를 확인한다.

---

## 전체 회귀 기준

F4 완료 선언 전 최소 기준:

```bash
pnpm test src/components/dashboard-preview/__tests__/hit-areas.test.ts
pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/datetime-card.test.tsx
pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx
pnpm test src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx
pnpm test
pnpm typecheck
pnpm lint
```
