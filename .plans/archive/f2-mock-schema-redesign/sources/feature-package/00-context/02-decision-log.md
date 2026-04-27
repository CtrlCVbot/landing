# 02. Decision Log — F2 Mock 스키마 재설계

> 본 Feature 구현 중 발생하는 결정을 누적 기록한다.
> Draft/PRD 단계에서 확정된 결정은 [`03-design-decisions.md`](./03-design-decisions.md)를 우선 참조한다.

---

## 1. 기 확정 결정 요약

| ID | 결정 | 상태 |
|---|---|---|
| D-F2-001 | `extractedFrame` / `appliedFrame` source 분리 | accepted |
| D-F2-002 | `PREVIEW_MOCK_SCENARIOS` 최소 3개 | accepted |
| D-F2-003 | deterministic default scenario selector | accepted |
| D-F2-004 | Step visibility 명시 | accepted |
| D-F2-005 | scenario selector UI는 MVP 제외 | accepted |

## 2. Bridge 결정

### D-F2-006. Bridge 범위는 `00-context`까지로 제한

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-24 |
| 결정자 | 사용자 요청 + Codex |
| 내용 | `/plan-bridge` 단계에서는 active feature의 `00-context`만 생성하고, 공식 TASK 문서는 `/dev-feature`에서 생성한다. |
| 근거 | 사용자 요청은 다음 단계 1,2 Bridge 실행이며 구현/TASK 확정은 아직 요청되지 않음. |

### D-F2-007. Feature Package와 TASK 문서 생성

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-24 |
| 결정자 | 사용자 요청 + Codex |
| 내용 | `/dev-feature` Step 6 대응으로 `02-package` 공식 문서와 `03-dev-notes/migration-notes.md` 템플릿을 생성한다. |
| 근거 | F2는 PRD Review Approve + Bridge 완료 상태이며, 다음 단계가 `/dev-feature`로 명시되어 있음. |
| 다음 단계 | `/dev-run .plans/features/active/f2-mock-schema-redesign/` |

## 3. 구현 전 확정 필요 결정

| ID | 결정 필요 항목 | 기본안 |
|---|---|---|
| D-F2-008 | compatibility helper API | `selectPreviewMockScenario`, `getDefaultPreviewMockScenario`, `createPreviewMockData` |
| D-F2-009 | `jsonViewerOpen` 처리 | `extractedFrame.aiResult.jsonViewerOpen`에 유지하되 기본값은 `false` |
| D-F2-010 | mismatch-risk scenario 노출 범위 | 테스트 fixture 중심, user-facing UI는 제외 |

## 4. 구현 중 신규 결정

아래 결정은 2026-04-27 `/dev-run` 구현 중 확정했다.

```md
### D-F2-NNN. {결정 제목}

| 항목 | 값 |
|---|---|
| 결정일 | YYYY-MM-DD |
| 배경 | {왜 결정이 필요했는가} |
| 선택값 | {확정값} |
| 영향 범위 | {파일/TASK 영향} |
| Rollback | {되돌리기 방법} |
```

### D-F2-008. Compatibility helper API

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-27 |
| 배경 | 기존 consumer가 `PREVIEW_MOCK_DATA` 단일 객체에 의존하므로 frame split을 바로 노출하면 연쇄 수정 위험이 있음. |
| 선택값 | `selectPreviewMockScenario`, `getDefaultPreviewMockScenario`, `createPreviewMockData`를 제공하고 `PREVIEW_MOCK_DATA`는 default scenario 기반 compatibility object로 유지. |
| 영향 범위 | `src/lib/mock-data.ts`, mock-data/AI panel/order form tests |
| Rollback | `PREVIEW_MOCK_DATA` 직접 객체 export로 되돌리고 helper export 제거 |

### D-F2-009. `jsonViewerOpen` handling

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-27 |
| 배경 | F5에서 JSON viewer UI는 제거됐지만 schema compatibility와 tests는 boolean field를 요구함. |
| 선택값 | `extractedFrame.aiResult.jsonViewerOpen`에 유지하고 모든 scenario 기본값은 `false`. |
| 영향 범위 | `src/lib/mock-data.ts`, `src/__tests__/lib/mock-data.test.ts` |
| Rollback | json viewer UI가 복구될 때 scenario별 open state로 확장 |

### D-F2-010. `mismatch-risk` exposure

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-27 |
| 배경 | fee mismatch 회귀를 검증해야 하지만 MVP에서 user-facing scenario selector는 제외됨. |
| 선택값 | `mismatch-risk`는 test fixture로만 제공하고 공개 selector UI는 만들지 않음. |
| 영향 범위 | `src/lib/mock-data.ts`, AI panel/order form source tests |
| Rollback | F3 이후 내부 debug selector가 승인되면 scenario picker로 연결 |

### D-F2-011. Demo-safe random scenario rotation

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-27 |
| 배경 | 사용자가 mock data가 매번 같은 값만 반복되어 각 입력값 적용을 확인하기 어렵다고 피드백했다. |
| 선택값 | `default`, `regional-cold-chain`, `short-industrial-hop` 3개를 `randomizable=true`로 두고 preview loop가 마지막 Step에서 Step 1로 돌아올 때 새 scenario를 선택한다. |
| 영향 범위 | `src/lib/mock-data.ts`, `src/components/dashboard-preview/dashboard-preview.tsx`, dashboard-preview tests |
| Rollback | `DashboardPreview`에서 random helper 호출을 제거하고 `getDefaultPreviewMockScenario()`로 고정한다. |

### D-F2-012. Pre-apply full target placeholder

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-27 |
| 배경 | 추출 전에 정산 정보, 예상 운임/거리, 운송 옵션, 화물 정보에 실제 값이 보여 적용 오류처럼 보일 수 있었다. |
| 선택값 | CompanyManager만 pre-filled로 유지하고 상/하차지, 일시, 화물, 옵션, estimate, settlement는 `AI_APPLY` 전까지 placeholder/neutral 상태로 표시한다. |
| 영향 범위 | `order-form/index.tsx`, `location-form.tsx`, `datetime-card.tsx`, `cargo-info-form.tsx`, `transport-option-card.tsx`, `estimate-info-card.tsx`, `settlement-section.tsx`, component tests |
| Rollback | 각 child card의 `revealed`/`visible` prop을 제거하고 기존 `step.formState`만 사용한다. |

### D-F2-013. `AI_APPLY` staged reveal timeline

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-27 |
| 배경 | 파트별 적용 순서를 사용자가 눈으로 확인해야 했고, estimate/settlement는 각 파트의 의미에 맞춰 늦게 보여야 했다. |
| 선택값 | `formRevealTimeline`을 추가하고 `pickupAt=0`, `deliveryAt=650`, `estimateAt=900`, `cargoAt=1300`, `optionsAt=1300`, `fareAt=1950`, `settlementAt=2200`으로 확정한다. |
| 영향 범위 | `preview-steps.ts`, `order-form/index.tsx`, 하위 카드 tests |
| Rollback | `formRevealTimeline`을 제거하고 `AI_APPLY` 진입 시 모든 값을 동시에 표시한다. |

### D-F2-014. Rolling trigger 분리와 animation slowdown

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-27 |
| 배경 | 기존 animation이 빨라 파트별 적용을 확인하기 어려웠고 estimate와 settlement rolling이 같은 trigger를 공유했다. |
| 선택값 | Step duration을 `800/2200/1400/4200ms`, partial interval을 `650ms`, all beat를 `1200ms`로 늦추고 estimate rolling은 `estimateAt`, settlement rolling은 `settlementAt`으로 분리한다. |
| 영향 범위 | `preview-steps.ts`, `ai-panel/index.tsx`, `estimate-info-card.tsx`, `settlement-section.tsx`, `transport-option-card.tsx` |
| Rollback | duration constants와 rolling trigger를 이전 단일 trigger 방식으로 되돌린다. |

### D-F2-015. Verification gate 결과

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-27 |
| 배경 | archive 전 fresh verification evidence가 필요했다. |
| 선택값 | `git diff --check`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`를 실행했고 최종 gate는 PASS로 기록한다. |
| 영향 범위 | release checklist, archive bundle |
| Rollback | 해당 없음. 실패가 발생하면 archive를 보류하고 수정 루프를 재개한다. |
