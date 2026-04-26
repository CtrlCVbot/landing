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

---

## Red-Green 권장 순서

1. TC-F2-01~04를 먼저 추가해 schema/selector RED를 만든다.
2. T-F2-SCHEMA-01~02 구현 후 TC-F2-01~04를 GREEN으로 만든다.
3. TC-F2-05를 추가해 Step visibility RED를 만든다.
4. T-F2-VISIBILITY-03~APPLY-04 구현 후 order form tests를 GREEN으로 만든다.
5. TC-F2-06~08로 AI source와 consistency를 마무리한다.

---

## 전체 회귀 기준

F2 완료 선언 전 최소 기준:

```bash
pnpm test src/__tests__/lib/mock-data.test.ts
pnpm test src/__tests__/lib/preview-steps.test.ts
pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx
pnpm test src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/index.test.tsx
pnpm test
pnpm typecheck
pnpm lint
```
