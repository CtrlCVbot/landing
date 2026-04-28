# 08. Dev Tasks - F2 Mock 스키마 재설계

> **SSOT** for `/dev-run` TASK 실행. TASK ID: `T-F2-{AREA}-{NN}`.
> 상세 힌트: [`04-implementation-hints.md`](../00-context/04-implementation-hints.md) 참조.

---

## TASK 목록

| TASK | 제목 | 선행 | 주요 파일 | Effort |
|---|---|---|---|:---:|
| T-F2-SCHEMA-01 | scenario array + frame split 도입 | - | `mock-data.ts`, `mock-data.test.ts` | 1.5 인·일 |
| T-F2-SELECTOR-02 | deterministic selector + compatibility helper | T-F2-SCHEMA-01 | `mock-data.ts`, consumers | 1 인·일 |
| T-F2-VISIBILITY-03 | Step visibility state 도입 | T-F2-SELECTOR-02 | `preview-steps.ts`, `preview-steps.test.ts` | 1 인·일 |
| T-F2-APPLY-04 | order form을 `appliedFrame` 기준으로 연결 | T-F2-VISIBILITY-03 | `order-form/index.tsx`, `estimate-info-card.tsx`, `settlement-section.tsx` | 1.5 인·일 |
| T-F2-AI-05 | AI panel을 `extractedFrame` 기준으로 연결 | T-F2-SELECTOR-02 | `ai-panel/index.tsx`, AI tests | 1 인·일 |
| T-F2-CONSISTENCY-06 | fee consistency + `jsonViewerOpen` 결정 반영 | T-F2-APPLY-04, T-F2-AI-05 | `mock-data.ts`, decision log, tests | 1 인·일 |
| T-F2-RANDOM-07 | demo-safe random scenario rotation | T-F2-SELECTOR-02 | `mock-data.ts`, `dashboard-preview.tsx`, tests | 0.5 인·일 |
| T-F2-STAGED-08 | `AI_APPLY` 내부 파트별 reveal timeline | T-F2-VISIBILITY-03, T-F2-APPLY-04 | `preview-steps.ts`, `order-form/**`, tests | 1 인·일 |

**합계**: 8.5 인·일 예상. T-F2-RANDOM-07/T-F2-STAGED-08은 사용자 추가 피드백을 반영한 구현 중 확장 TASK다.

---

## TASK 완료 현황

| TASK | 상태 | 구현 결과 |
|---|:---:|---|
| T-F2-SCHEMA-01 | [x] | `PREVIEW_MOCK_SCENARIOS`와 frame split 도입 |
| T-F2-SELECTOR-02 | [x] | deterministic helper + compatibility helper 제공 |
| T-F2-VISIBILITY-03 | [x] | pre-apply hidden state와 Step visibility 테스트 갱신 |
| T-F2-APPLY-04 | [x] | order form을 `appliedFrame` + revealed/visible 기준으로 연결 |
| T-F2-AI-05 | [x] | AI panel/result source를 `extractedFrame` compatibility object로 연결 |
| T-F2-CONSISTENCY-06 | [x] | demo scenario fare/estimate 정합성 및 `jsonViewerOpen=false` 결정 반영 |
| T-F2-RANDOM-07 | [x] | loop 시작 시 randomizable scenario 교체, 연속 중복 방지 |
| T-F2-STAGED-08 | [x] | `formRevealTimeline` 기반 파트별 적용 timing 구현 |

---

## T-F2-SCHEMA-01 - scenario array + frame split 도입

**REQ**: REQ-f2-mock-schema-001, REQ-f2-mock-schema-002, REQ-f2-mock-schema-003

### Scope

- `PREVIEW_MOCK_SCENARIOS` 배열 추가.
- 최소 scenario 3개 작성: `default`, `partial`, `mismatch-risk`.
- 각 scenario에 `extractedFrame`, `appliedFrame` 추가.
- 기존 `PREVIEW_MOCK_DATA`가 있다면 compatibility를 고려해 제거보다 adapter 우선.

### Acceptance

- [x] `PREVIEW_MOCK_SCENARIOS.length >= 3`
- [x] 모든 scenario에 `extractedFrame`과 `appliedFrame` 존재
- [x] `pnpm test src/__tests__/lib/mock-data.test.ts` 통과

---

## T-F2-SELECTOR-02 - deterministic selector + compatibility helper

**REQ**: REQ-f2-mock-schema-004, REQ-f2-mock-schema-010

### Scope

- default scenario selector/helper 작성.
- test 또는 내부 QA에서 특정 scenario를 고를 수 있는 helper 제공.
- user-facing selector UI는 만들지 않는다.

### Acceptance

- [x] default helper는 deterministic하게 동작
- [x] `default`, `partial`, `mismatch-risk`를 test에서 선택 가능
- [x] public UI에 selector control이 추가되지 않음
- [x] random helper는 randomizable pool만 사용하고 `excludeId`를 지원

---

## T-F2-VISIBILITY-03 - Step visibility state 도입

**REQ**: REQ-f2-mock-schema-006, REQ-f2-mock-schema-007

### Scope

- Step에서 `estimateVisible`, `settlementVisible` 또는 동등한 상태 파생.
- `AI_EXTRACT` 이전에 완성값 숨김.
- 기존 step id를 유지하고 helper로 파생하는 방식을 우선.

### Acceptance

- [x] pre-apply 단계에서 CompanyManager 외 추출 대상 값 미노출
- [x] `AI_APPLY` 이후 표시 상태 true
- [x] `pnpm test src/__tests__/lib/preview-steps.test.ts` 통과

---

## T-F2-APPLY-04 - order form을 `appliedFrame` 기준으로 연결

**REQ**: REQ-f2-mock-schema-003, REQ-f2-mock-schema-007, REQ-f2-mock-schema-008

### Scope

- `order-form/index.tsx` consumer를 `appliedFrame` 기준으로 이전.
- `EstimateInfoCard`, `SettlementSection` 표시 source와 visibility 연결.
- 빈 값 scenario에서 placeholder/pending state 유지.

### Acceptance

- [x] `AI_APPLY` 이후 order form이 `appliedFrame` 값을 표시
- [x] 적용 전 상/하차지, 일시, 화물, 옵션, estimate, settlement 값 미노출
- [x] order form 관련 tests 통과

---

## T-F2-AI-05 - AI panel을 `extractedFrame` 기준으로 연결

**REQ**: REQ-f2-mock-schema-002

### Scope

- `ai-panel/index.tsx`가 AI result/source 값을 `extractedFrame`에서 읽도록 이전.
- F5에서 숨긴 JSON viewer UI는 되살리지 않는다.

### Acceptance

- [x] AI panel/result는 `extractedFrame` 기준 값을 표시
- [x] `appliedFrame` 전용 값이 AI 추출 단계에 먼저 노출되지 않음
- [x] AI panel tests 통과

---

## T-F2-CONSISTENCY-06 - fee consistency + `jsonViewerOpen` 결정 반영

**REQ**: REQ-f2-mock-schema-005, REQ-f2-mock-schema-009

### Scope

- default scenario의 `fare`와 `estimate.amount` 정합성 테스트.
- `jsonViewerOpen` 유지/이관/제거 결정.
- decision log에 D-F2-007 이후 항목으로 기록.

### Acceptance

- [x] `fare`와 `estimate.amount` 정합성 테스트 통과
- [x] `jsonViewerOpen` 처리 결정이 `00-context/02-decision-log.md`에 기록됨
- [x] `pnpm test`, `pnpm typecheck` 통과

---

## T-F2-RANDOM-07 - demo-safe random scenario rotation

**REQ**: REQ-f2-mock-schema-004, REQ-f2-mock-schema-012

### Scope

- `randomizable` flag 추가.
- `default`, `regional-cold-chain`, `short-industrial-hop`만 random pool에 포함.
- `partial`, `mismatch-risk`는 fixture-only로 유지.
- `DashboardPreview`가 Step 4에서 Step 1로 돌아올 때 새 scenario 선택.

### Acceptance

- [x] randomizable scenario가 3개 이상
- [x] `mismatch-risk`가 random pool에서 제외됨
- [x] 같은 scenario가 연속 선택되지 않음

---

## T-F2-STAGED-08 - `AI_APPLY` 내부 파트별 reveal timeline

**REQ**: REQ-f2-mock-schema-007, REQ-f2-mock-schema-011

### Scope

- `FormRevealTimeline` 추가.
- `pickupAt`, `deliveryAt`, `estimateAt`, `cargoAt`, `optionsAt`, `fareAt`, `settlementAt` 기준으로 order form 표시를 세분화.
- `EstimateInfoCard`와 `SettlementSection` rolling trigger 분리.
- transport option stroke trigger를 `optionsAt`에 정렬.

### Acceptance

- [x] `AI_APPLY` 진입 직후 상차지만 먼저 표시
- [x] `estimateAt` 이후 거리/시간/운임 금액 표시
- [x] `cargoAt`/`optionsAt` 이후 화물/차량과 옵션 checked 표시
- [x] `settlementAt` 이후 정산 정보 표시

---

## 공통 검증

```bash
pnpm test src/__tests__/lib/mock-data.test.ts
pnpm test src/__tests__/lib/preview-steps.test.ts
pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx
pnpm test src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/index.test.tsx
pnpm typecheck
pnpm lint
pnpm build
```

### 2026-04-27 fresh verification

| 검증 | 결과 | 메모 |
|---|---|---|
| `git diff --check` | PASS | whitespace error 없음 |
| `pnpm typecheck` | PASS | `tsc --noEmit` |
| `pnpm lint` | PASS with warnings | 기존 warning만 존재 |
| `pnpm test` | PASS | 45 files / 1039 tests |
| `pnpm build` | PASS | 단독 재실행 기준 성공 |
