# 04. Implementation Hints — F2 Mock 스키마 재설계

> 구현자를 위한 힌트 문서다. 공식 TASK ID와 순서는 `/dev-feature`에서 확정한다.

---

## 1. 예상 TASK 분할

| 예상 TASK | 목표 | 주요 파일 |
|---|---|---|
| T-F2-SCHEMA-01 | scenario array와 frame split 도입 | `mock-data.ts`, `mock-data.test.ts` |
| T-F2-SELECTOR-02 | deterministic default selector + compatibility helper | `mock-data.ts`, consumers |
| T-F2-VISIBILITY-03 | Step visibility state 도입 | `preview-steps.ts`, `preview-steps.test.ts` |
| T-F2-APPLY-04 | order form이 `appliedFrame` 기준으로 읽도록 연결 | `order-form/index.tsx`, tests |
| T-F2-AI-05 | AI panel이 `extractedFrame` 기준으로 읽도록 연결 | `ai-panel/index.tsx`, tests |
| T-F2-CONSISTENCY-06 | fee consistency + `jsonViewerOpen` 결정 반영 | `mock-data.ts`, decision log |
| T-F2-RANDOM-07 | demo-safe scenario random rotation | `mock-data.ts`, `dashboard-preview.tsx`, tests |
| T-F2-STAGED-08 | `AI_APPLY` 내부 파트별 reveal timeline | `preview-steps.ts`, `order-form/**`, tests |

## 2. 권장 실행 순서

1. 기존 `PREVIEW_MOCK_DATA` consumers를 조사한다.
2. compatibility helper 테스트를 먼저 만든다.
3. scenario array와 frame split을 추가한다.
4. Step visibility를 preview steps에 연결한다.
5. order form과 AI panel source를 분리한다.
6. randomizable scenario pool과 Step loop rotation을 추가한다.
7. `AI_APPLY` 내부 staged reveal timing을 연결한다.
8. `jsonViewerOpen` 처리 결정을 기록하고 관련 테스트를 동기화한다.

## 3. 검색 힌트

```bash
Select-String -Path 'src/**/*.ts','src/**/*.tsx' -Pattern 'PREVIEW_MOCK_DATA','jsonViewerOpen','estimate.amount','fare'
Select-String -Path 'src/**/*.test.ts','src/**/*.test.tsx' -Pattern 'PREVIEW_MOCK_DATA','jsonViewerOpen','fare','estimate'
```

## 4. 검증 힌트

```bash
pnpm test src/__tests__/lib/mock-data.test.ts
pnpm test src/__tests__/lib/preview-steps.test.ts
pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx
pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/cargo-info-form.test.tsx
pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/estimate-info-card.test.tsx
pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/transport-option-card.test.tsx
pnpm test src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/index.test.tsx
pnpm test src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx
```

필요 시 구현 완료 후 전체 검증:

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

## 5. 주의

- F4 대상인 `hit-areas.ts`와 `interactive-overlay.tsx`는 건드리지 않는다.
- user-facing scenario selector UI는 만들지 않는다.
- F3 fee map을 미리 구현하지 않는다.
- compatibility helper 없이 consumers를 한 번에 깨뜨리면 테스트 migration 비용이 커진다.

## 6. 구현 완료 메모

- `DashboardPreview`는 더 이상 static `PREVIEW_MOCK_DATA`를 직접 쓰지 않고 selected scenario 기반 `createPreviewMockData`를 사용한다.
- `LocationForm`, `DateTimeCard`, `CargoInfoForm`, `TransportOptionCard`, `EstimateInfoCard`, `SettlementSection`은 hidden/revealed 상태를 명시 prop으로 받는다.
- `EstimateInfoCard`와 `SettlementSection` rolling trigger는 각각 `estimateAt`, `settlementAt`으로 분리됐다.
