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

**합계**: 7 인·일 예상.

---

## T-F2-SCHEMA-01 - scenario array + frame split 도입

**REQ**: REQ-f2-mock-schema-001, REQ-f2-mock-schema-002, REQ-f2-mock-schema-003

### Scope

- `PREVIEW_MOCK_SCENARIOS` 배열 추가.
- 최소 scenario 3개 작성: `default`, `partial`, `mismatch-risk`.
- 각 scenario에 `extractedFrame`, `appliedFrame` 추가.
- 기존 `PREVIEW_MOCK_DATA`가 있다면 compatibility를 고려해 제거보다 adapter 우선.

### Acceptance

- [ ] `PREVIEW_MOCK_SCENARIOS.length >= 3`
- [ ] 모든 scenario에 `extractedFrame`과 `appliedFrame` 존재
- [ ] `pnpm test src/__tests__/lib/mock-data.test.ts` 통과

---

## T-F2-SELECTOR-02 - deterministic selector + compatibility helper

**REQ**: REQ-f2-mock-schema-004, REQ-f2-mock-schema-010

### Scope

- default scenario selector/helper 작성.
- test 또는 내부 QA에서 특정 scenario를 고를 수 있는 helper 제공.
- user-facing selector UI는 만들지 않는다.

### Acceptance

- [ ] 기본 preview가 항상 같은 scenario를 사용
- [ ] `default`, `partial`, `mismatch-risk`를 test에서 선택 가능
- [ ] public UI에 selector control이 추가되지 않음

---

## T-F2-VISIBILITY-03 - Step visibility state 도입

**REQ**: REQ-f2-mock-schema-006, REQ-f2-mock-schema-007

### Scope

- Step에서 `estimateVisible`, `settlementVisible` 또는 동등한 상태 파생.
- `AI_EXTRACT` 이전에 완성값 숨김.
- 기존 step id를 유지하고 helper로 파생하는 방식을 우선.

### Acceptance

- [ ] pre-apply 단계에서 estimate/settlement 완성값 미노출
- [ ] `AI_APPLY` 이후 표시 상태 true
- [ ] `pnpm test src/__tests__/lib/preview-steps.test.ts` 통과

---

## T-F2-APPLY-04 - order form을 `appliedFrame` 기준으로 연결

**REQ**: REQ-f2-mock-schema-003, REQ-f2-mock-schema-007, REQ-f2-mock-schema-008

### Scope

- `order-form/index.tsx` consumer를 `appliedFrame` 기준으로 이전.
- `EstimateInfoCard`, `SettlementSection` 표시 source와 visibility 연결.
- 빈 값 scenario에서 placeholder/pending state 유지.

### Acceptance

- [ ] `AI_APPLY` 이후 order form이 `appliedFrame` 값을 표시
- [ ] 적용 전 estimate/settlement 완성값 미노출
- [ ] order form 관련 tests 통과

---

## T-F2-AI-05 - AI panel을 `extractedFrame` 기준으로 연결

**REQ**: REQ-f2-mock-schema-002

### Scope

- `ai-panel/index.tsx`가 AI result/source 값을 `extractedFrame`에서 읽도록 이전.
- F5에서 숨긴 JSON viewer UI는 되살리지 않는다.

### Acceptance

- [ ] AI panel/result는 `extractedFrame` 기준 값을 표시
- [ ] `appliedFrame` 전용 값이 AI 추출 단계에 먼저 노출되지 않음
- [ ] AI panel tests 통과

---

## T-F2-CONSISTENCY-06 - fee consistency + `jsonViewerOpen` 결정 반영

**REQ**: REQ-f2-mock-schema-005, REQ-f2-mock-schema-009

### Scope

- default scenario의 `fare`와 `estimate.amount` 정합성 테스트.
- `jsonViewerOpen` 유지/이관/제거 결정.
- decision log에 D-F2-007 이후 항목으로 기록.

### Acceptance

- [ ] `fare`와 `estimate.amount` 정합성 테스트 통과
- [ ] `jsonViewerOpen` 처리 결정이 `00-context/02-decision-log.md`에 기록됨
- [ ] `pnpm test`, `pnpm typecheck` 통과

---

## 공통 검증

```bash
pnpm test src/__tests__/lib/mock-data.test.ts
pnpm test src/__tests__/lib/preview-steps.test.ts
pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx
pnpm test src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/index.test.tsx
pnpm typecheck
pnpm lint
```
