# PRD: F2 Mock 스키마 재설계

> **Epic**: [EPIC-20260422-001 dash-preview Phase 4](../../epics/20-active/EPIC-20260422-001/00-epic-brief.md) (Phase B, F2)
> **Feature slug**: `f2-mock-schema-redesign`
> **IDEA**: [IDEA-20260424-001](../../ideas/20-approved/IDEA-20260424-001.md)
> **Screening**: [SCREENING-20260424-001](../../ideas/20-approved/SCREENING-20260424-001.md)
> **Draft**: [01-draft.md](./01-draft.md)
> **Routing metadata**: [07-routing-metadata.md](./07-routing-metadata.md)
> **작성일**: 2026-04-24
> **상태**: draft (PRD review 완료 후 plan-bridge 대기)
> **schema**: PRD 10 섹션 표준

---

## 1. Overview

F2는 dash-preview의 mock data를 "AI가 추출한 값"과 "사용자 폼에 적용된 값"으로 분리하는 Phase B 핵심 Feature다. 현재 preview는 AI 분석 결과와 order form 상태가 같은 구조 안에 섞여 있어, `AI_EXTRACT` 이전에 완성 수치가 보이거나 AI category의 `fare`와 `estimate.amount`가 다르게 읽히는 문제가 발생할 수 있다.

본 Feature는 `extractedFrame`, `appliedFrame`, `PREVIEW_MOCK_SCENARIOS`를 도입해 preview 내러티브를 명확히 한다. F5에서 JSON viewer UI 잔재가 정리된 상태를 전제로 하며, F3 옵션별 추가요금 파생 로직의 선행 기반이 된다.

## 2. Problem Statement

Phase 3 이후 피드백은 "AI가 무엇을 읽었는지"와 "폼에 무엇이 들어갔는지"가 명확히 분리되어야 한다는 점을 드러냈다. 현재 단일 mock 구조는 보여줄 값과 적용할 값을 동시에 담고 있어 Step별 visibility, 여러 scenario, fee consistency를 테스트하기 어렵다.

이 상태가 유지되면 preview는 실제 AI workflow처럼 보이지만, 내부적으로는 AI 추출 단계와 폼 적용 단계가 섞인 demo에 머문다. 사용자는 이미 적용된 값을 AI가 추출하기 전부터 보게 될 수 있고, 유지보수자는 F3에서 `OPTION_FEE_MAP`을 추가할 때 어떤 값이 source of truth인지 다시 해석해야 한다.

## 3. Goals & Non-Goals

### Goals

- `extractedFrame`을 AI panel/result 표시 기준으로 정의한다.
- `appliedFrame`을 order form과 settlement 표시 기준으로 정의한다.
- `PREVIEW_MOCK_SCENARIOS`를 최소 3개 이상 도입한다: default, partial, mismatch-risk.
- default scenario에서 AI category `fare`와 `estimate.amount` 정합성을 보장한다.
- `AI_EXTRACT` 전에는 estimate/settlement 완성값이 노출되지 않도록 Step 기반 visibility를 명시한다.
- F3가 F2 schema 위에 `OPTION_FEE_MAP`을 얹을 수 있도록 확장 지점을 남긴다.

### Non-Goals

- 실제 AI API 연동.
- F3의 옵션별 추가요금 계산과 `OPTION_FEE_MAP` 구현.
- F4의 layout, hit-area, overlay anchor 좌표 변경.
- 사용자-facing scenario selector UI의 MVP 포함. 본 PRD에서는 selector helper까지만 Must로 두고 UI는 Could로 남긴다.
- 새 analytics, persistence, backend schema 추가.

## 4. User Stories

1. **As a** preview 방문자, **I want** AI가 읽은 값과 폼에 적용된 값이 단계에 맞게 보이기를, **so that** demo 흐름을 실제 작업처럼 이해할 수 있다.
2. **As a** AI extraction 단계의 품질을 확인하는 사용자, **I want** `AI_EXTRACT` 단계에서 AI가 추출한 값만 보기를, **so that** 아직 적용되지 않은 값과 혼동하지 않는다.
3. **As a** order form 흐름을 확인하는 사용자, **I want** `AI_APPLY` 이후에만 estimate와 settlement 값이 표시되기를, **so that** 단계 진행의 의미가 분명해진다.
4. **As a** QA, **I want** default, partial, mismatch-risk scenario를 테스트할 수 있기를, **so that** 정상/부분/불일치 위험 흐름을 모두 검증할 수 있다.
5. **As a** F3 구현자, **I want** fee source가 명확한 mock schema를 사용하기를, **so that** 옵션별 추가요금 파생 로직을 충돌 없이 추가할 수 있다.

## 5. Functional Requirements

| ID | 요구사항 | 우선순위 | 수용 기준 |
|---|---|:---:|---|
| REQ-f2-mock-schema-001 | `PREVIEW_MOCK_SCENARIOS` 배열을 도입한다. | Must | 최소 3개 scenario가 존재한다: default, partial, mismatch-risk. |
| REQ-f2-mock-schema-002 | 각 scenario에 `extractedFrame`을 정의한다. | Must | AI panel/result에서 쓰는 값은 `extractedFrame`을 기준으로 읽힌다. |
| REQ-f2-mock-schema-003 | 각 scenario에 `appliedFrame`을 정의한다. | Must | order form, estimate, settlement에서 쓰는 값은 `appliedFrame`을 기준으로 읽힌다. |
| REQ-f2-mock-schema-004 | deterministic default scenario selector helper를 제공한다. | Must | 기본 preview는 항상 같은 default scenario를 사용하며 테스트가 흔들리지 않는다. |
| REQ-f2-mock-schema-005 | `fare`와 `estimate.amount` 정합성을 검증한다. | Must | default scenario에서 두 값이 일치하거나 명시적 변환 규칙으로 같은 의미임이 테스트된다. |
| REQ-f2-mock-schema-006 | Step 기반 visibility state를 명시적으로 생성한다. | Must | `estimateVisible`, `settlementVisible` 또는 동등한 상태가 Step에서 파생된다. |
| REQ-f2-mock-schema-007 | `AI_EXTRACT` 이전에는 estimate/settlement 완성값이 노출되지 않는다. | Must | 관련 컴포넌트 렌더 테스트가 pre-apply 단계의 미노출을 검증한다. |
| REQ-f2-mock-schema-008 | `AI_APPLY` 이후에는 `appliedFrame` 기준 값이 order form에 반영된다. | Must | `EstimateInfoCard`, `SettlementSection`이 `appliedFrame` 기준으로 표시된다. |
| REQ-f2-mock-schema-009 | 기존 `jsonViewerOpen` 필드는 새 schema 안에서 유지, 이관, 제거 중 하나로 정리한다. | Should | 결정 결과가 decision log에 남고 테스트 기대값이 동기화된다. |
| REQ-f2-mock-schema-010 | 사용자-facing scenario selector UI는 MVP 범위에서 제외한다. | Could | 필요 시 별도 옵션으로 문서화하되 F2 Must 범위에 포함하지 않는다. |

## 6. UX Requirements

- Step이 진행되기 전 완성 수치를 먼저 보여주지 않는다.
- AI panel은 `extractedFrame`을 기준으로 "읽은 값"을 보여주고, order form은 `appliedFrame`을 기준으로 "적용된 값"을 보여준다.
- partial scenario는 빈 값이나 불완전 값이 사용자에게 혼란스럽지 않도록 placeholder 또는 pending state를 유지한다.
- mismatch-risk scenario는 실제 화면에서 오류처럼 보이기보다 검증용 scenario로 다룬다.
- scenario selector UI는 이번 MVP에서는 숨겨진 helper 수준으로 두어 preview 첫 화면을 복잡하게 만들지 않는다.

## 7. Technical Considerations

- 주요 예상 파일은 `src/lib/mock-data.ts`, `src/lib/preview-steps.ts`, `src/components/dashboard-preview/order-form/index.tsx`, AI panel 관련 integration test다.
- schema migration은 기존 테스트를 한 번에 깨뜨릴 수 있으므로 compatibility helper 또는 단계적 adapter를 우선 고려한다.
- `PREVIEW_MOCK_SCENARIOS`는 테스트 안정성을 위해 deterministic default selector를 기본값으로 둔다.
- F3는 F2 이후 진행되므로 F2 schema에 fee 확장 지점을 남기되, 실제 `OPTION_FEE_MAP`은 구현하지 않는다.
- F4와 병렬 진행 시 layout/hit-area 파일은 건드리지 않는다.

## 8. Milestones

| 단계 | 범위 | 완료 조건 |
|---|---|---|
| M1 — PRD review | 본 PRD 품질 및 Epic 일관성 검토 | `03-prd-review.md` 승인 판정 |
| M2 — Bridge | Feature Package 컨텍스트 생성 | `/plan-bridge f2-mock-schema-redesign` 완료 |
| M3 — Schema | `extractedFrame`/`appliedFrame`/scenario 배열 도입 | mock-data 관련 테스트 통과 |
| M4 — Step visibility | order form visibility 연결 | pre-apply 미노출, apply 이후 표시 테스트 통과 |
| M5 — Consistency/Test | fare/estimate 정합성 및 기존 테스트 마이그레이션 | 관련 test pass + decision log 기록 |

## 9. Risks & Mitigations

| 리스크 | 영향 | 확률 | 완화 |
|---|:---:|:---:|---|
| 기존 테스트 대량 수정으로 회귀 위험 증가 | High | High | compatibility helper를 먼저 만들고 테스트를 schema 단위에서 단계적으로 이관 |
| F3가 기대하는 fee source와 충돌 | Medium | Medium | F3는 F2 이후 진행하며 F2 PRD에 fee source 기준을 명확히 기록 |
| scenario UI 범위가 커짐 | Medium | Medium | UI는 Could로 제한하고 MVP는 deterministic helper까지만 포함 |
| `jsonViewerOpen` 잔재 처리 누락 | Medium | Medium | 유지/이관/제거 중 하나를 decision log에 기록하고 테스트 기대값 동기화 |
| F4 병렬 작업과 파일 충돌 | Medium | Low | F2는 mock-data/step/order-form data 흐름 중심, F4는 layout/overlay 중심으로 분리 |

## 10. Success Metrics

| ID | 지표 | 목표 | 측정 방법 |
|---|---|---|---|
| SM-f2-001 | scenario count | `PREVIEW_MOCK_SCENARIOS.length >= 3` | mock-data unit test |
| SM-f2-002 | source 분리 | AI panel은 `extractedFrame`, order form은 `appliedFrame` 기준 | integration test 또는 component test |
| SM-f2-003 | Step visibility | `AI_EXTRACT` 전 estimate/settlement 완성값 미노출 | preview step test |
| SM-f2-004 | apply 이후 표시 | `AI_APPLY` 이후 `appliedFrame` 값 표시 | order form test |
| SM-f2-005 | fee consistency | default scenario `fare`와 `estimate.amount` 정합 | mock-data test |
| SM-f2-006 | 테스트 안정성 | 관련 test pass | `pnpm test` 또는 관련 테스트 subset |

## 11. 생성된 파일

- **PRD 본 파일**: `.plans/drafts/f2-mock-schema-redesign/02-prd.md`
- **리뷰 파일**: `.plans/drafts/f2-mock-schema-redesign/03-prd-review.md`
- **연계 파일**: IDEA, Epic children, handoff 문서는 PRD/review 완료 후 상태 동기화한다.
- **Bridge 파일**: [`.plans/features/active/f2-mock-schema-redesign/00-context/`](../../features/active/f2-mock-schema-redesign/00-context/00-index.md) 생성 완료. 공식 TASK 문서는 다음 `/dev-feature` 단계에서 생성한다.

## 12. 다음 단계

1. `03-prd-review.md` 기준 PRD 리뷰 판정을 확인한다.
2. 사용자 승인 후 `/plan-bridge f2-mock-schema-redesign`를 실행한다.
3. Bridge 이후 `/dev-feature`에서 TASK와 allowed target paths를 확정한다.

## 13. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-24 | 초안 작성 — PRD 10 섹션, REQ 10건, UX/Tech/Milestone/Risk/Success Metric 정리. Bridge는 사용자 요청 범위에서 제외. |
| 2026-04-24 | `/plan-bridge f2-mock-schema-redesign` 실행 — active feature `00-context` 생성 완료, next step을 `/dev-feature`로 전환. |
