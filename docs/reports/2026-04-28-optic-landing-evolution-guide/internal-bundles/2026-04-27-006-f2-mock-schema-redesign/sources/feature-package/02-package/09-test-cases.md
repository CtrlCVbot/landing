# 09. Test Cases - F2 Mock 스키마 재설계

---

## 테스트 케이스 목록

| TC | REQ | 검증 대상 | 권장 명령 |
|---|---|---|---|
| TC-F2-01 | REQ-f2-mock-schema-001 | scenario 3개 이상 존재 | `pnpm test src/__tests__/lib/mock-data.test.ts` |
| TC-F2-02 | REQ-f2-mock-schema-002 | `extractedFrame` 필수 필드 | `pnpm test src/__tests__/lib/mock-data.test.ts` |
| TC-F2-03 | REQ-f2-mock-schema-003 | `appliedFrame` 필수 필드 | `pnpm test src/__tests__/lib/mock-data.test.ts` |
| TC-F2-04 | REQ-f2-mock-schema-004 | default selector deterministic | `pnpm test src/__tests__/lib/mock-data.test.ts` |
| TC-F2-05 | REQ-f2-mock-schema-006, 007, 008 | Step visibility + apply 이후 표시 | `pnpm test src/__tests__/lib/preview-steps.test.ts` |
| TC-F2-06 | REQ-f2-mock-schema-002 | AI panel source가 `extractedFrame` | `pnpm test src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/index.test.tsx` |
| TC-F2-07 | REQ-f2-mock-schema-005 | `fare`와 `estimate.amount` 정합성 | `pnpm test src/__tests__/lib/mock-data.test.ts` |
| TC-F2-08 | REQ-f2-mock-schema-009 | `jsonViewerOpen` 처리 동기 | 관련 mock-data/AI tests |
| TC-F2-09 | REQ-f2-mock-schema-010 | user-facing selector UI 미추가 | preview integration test 또는 DOM query |
| TC-F2-10 | REQ-f2-mock-schema-012 | random pool에서 fixture-only scenario 제외 | `pnpm test src/__tests__/lib/mock-data.test.ts` |
| TC-F2-11 | REQ-f2-mock-schema-004 | `excludeId` 기준 연속 scenario 방지 | `pnpm test src/__tests__/lib/mock-data.test.ts` |
| TC-F2-12 | REQ-f2-mock-schema-007 | `INITIAL`/`AI_INPUT`/`AI_EXTRACT`에서 추출 대상 전체 미노출 | `pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx` |
| TC-F2-13 | REQ-f2-mock-schema-011 | `AI_APPLY` staged reveal 순서 | `pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx` |
| TC-F2-14 | REQ-f2-mock-schema-011 | child card hidden/revealed state | order-form 하위 카드 component tests |
| TC-F2-15 | NFR-f2-001 | Step 4 → Step 1 전환 시 scenario 교체 | `pnpm test src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx` |

---

## Red-Green 권장 순서

1. TC-F2-01~04를 먼저 추가해 schema/selector RED를 만든다.
2. T-F2-SCHEMA-01~02 구현 후 TC-F2-01~04를 GREEN으로 만든다.
3. TC-F2-05를 추가해 Step visibility RED를 만든다.
4. T-F2-VISIBILITY-03~APPLY-04 구현 후 order form tests를 GREEN으로 만든다.
5. TC-F2-06~08로 AI source와 consistency를 마무리한다.
6. TC-F2-10~15로 randomization, pre-apply hidden state, staged reveal을 마무리한다.

---

## 전체 회귀 기준

F2 완료 선언 전 최소 기준:

```bash
pnpm test src/__tests__/lib/mock-data.test.ts
pnpm test src/__tests__/lib/preview-steps.test.ts
pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx
pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/cargo-info-form.test.tsx
pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/estimate-info-card.test.tsx
pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/settlement-section.test.tsx
pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/transport-option-card.test.tsx
pnpm test src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/index.test.tsx
pnpm test src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

## 2026-04-27 검증 결과

| 검증 | 결과 | 근거 |
|---|---|---|
| Unit/component suite | PASS | `pnpm test` 45 files / 1039 tests |
| TypeScript | PASS | `pnpm typecheck` |
| Lint | PASS with warnings | 신규 error 없음 |
| Build | PASS | `pnpm build` 단독 재실행 성공 |
| Manual preview evidence | PASS | `output/verification/dash-preview-step4-staged-samples.json`, `output/verification/dash-preview-step4-staged-final.png` |
