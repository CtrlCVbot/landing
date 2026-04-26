# PRD: F4 레이아웃 정비 + Hit-Area 재정렬

> **Epic**: [EPIC-20260422-001 dash-preview Phase 4](../../epics/20-active/EPIC-20260422-001/00-epic-brief.md) (Phase B, F4)
> **Feature slug**: `f4-layout-hit-area-realignment`
> **IDEA**: [IDEA-20260424-002](../../ideas/20-approved/IDEA-20260424-002.md)
> **Screening**: [SCREENING-20260424-002](../../ideas/20-approved/SCREENING-20260424-002.md)
> **Draft**: [01-draft.md](./01-draft.md)
> **Routing metadata**: [07-routing-metadata.md](./07-routing-metadata.md)
> **작성일**: 2026-04-24
> **상태**: draft (PRD review 완료 후 plan-bridge 대기)
> **schema**: PRD 10 섹션 표준

---

## 1. Overview

F4는 dash-preview Phase 4의 Phase B Feature로, order form의 세로 밀도와 interactive overlay의 위치 정확도를 함께 개선한다. 핵심은 pickup/delivery `DateTimeCard`를 desktop/tablet에서 더 촘촘한 2열 구조로 정리하고, `hit-areas.ts`의 19개 bounds를 실제 DOM 위치에 맞게 재측정하는 것이다.

본 Feature는 Epic 성공 지표 5인 "19개 hit-area의 실제 DOM bounding box와 highlight 편차 <= 2px"에 직접 연결된다. F2 Mock 스키마 재설계와는 병렬 가능하지만, F4 내부에서는 layout 변경 후 hit-area 재측정과 overlay anchor 검토를 순차로 처리해야 한다.

## 2. Problem Statement

Phase 3 preview는 시각적 내러티브를 전달하지만, 일부 order form 영역에서 세로 공간을 과하게 사용하고 hover/focus tooltip이 실제 대상과 어긋날 가능성이 남아 있다. 특히 pickup/delivery 시간 카드, tablet bounds 공유, `interactive-overlay.tsx`의 기준 좌표가 서로 맞물려 있어 단순 좌표 수정만으로는 품질을 안정적으로 보장하기 어렵다.

이 문제가 남으면 사용자는 tooltip과 highlight가 가리키는 대상이 실제 UI와 다르다고 느끼게 된다. 이는 demo 신뢰도와 사용성에 직접 영향을 주며, 이후 F2/F3에서 데이터 내러티브를 개선해도 화면상의 안내 정확도가 떨어지는 결과를 만든다.

## 3. Goals & Non-Goals

### Goals

- `DateTimeCard` pickup/delivery 영역을 `md` 이상에서 2열로 배치하고 mobile에서는 1열을 유지한다.
- 19개 hit-area bounds를 실제 DOM 기준으로 재측정하고 desktop 기준 오차를 <= 2px 목표로 맞춘다.
- tablet viewport에서 desktop bounds 재사용 가능 여부를 검증하고, 오차가 2px를 초과하면 tablet 전용 bounds를 분리한다.
- `interactive-overlay.tsx` anchor를 `ScaledContent` 내부 기준으로 맞추는 방안을 우선 검토한다.
- hit-area, dashboard-preview, layout 관련 테스트를 변경된 구조에 맞게 갱신한다.

### Non-Goals

- F2의 mock schema, `extractedFrame`/`appliedFrame`, scenario set 변경.
- F3의 옵션별 추가요금 파생 로직.
- F1 이후 라이트/다크 theme token 재스윕.
- 새로운 tutorial UI나 별도 설명 패널 추가.
- 실제 AI API 연동 또는 데이터 source 변경.

## 4. User Stories

1. **As a** landing 방문자, **I want** pickup/delivery 시간이 한눈에 비교되는 구조로 보이기를, **so that** preview 흐름을 빠르게 이해할 수 있다.
2. **As a** preview에서 hover/focus 안내를 확인하는 사용자, **I want** highlight와 tooltip이 실제 대상 위에 정확히 표시되기를, **so that** 안내가 가리키는 의미를 혼동하지 않는다.
3. **As a** tablet 크기 화면에서 preview를 보는 사용자, **I want** desktop과 같은 UI 밀도를 유지하되 좌표 어긋남이 없기를, **so that** 화면 크기에 따라 안내 품질이 흔들리지 않는다.
4. **As a** QA 또는 유지보수자, **I want** 19개 hit-area의 좌표와 테스트 근거가 문서화되기를, **so that** 후속 layout 변경 때 깨진 지점을 빠르게 찾을 수 있다.

## 5. Functional Requirements

| ID | 요구사항 | 우선순위 | 수용 기준 |
|---|---|:---:|---|
| REQ-f4-layout-hit-area-001 | pickup/delivery `DateTimeCard`를 `md` 이상에서 2열, mobile에서 1열로 배치한다. | Must | 390px mobile은 1열, 768px 이상은 2열로 렌더된다. 기존 label과 value가 겹치지 않는다. |
| REQ-f4-layout-hit-area-002 | `hit-areas.ts`의 19개 bounds를 layout 변경 후 실제 DOM 기준으로 재측정한다. | Must | desktop viewport에서 각 bounds와 실제 target 간 오차 <= 2px를 목표로 evidence를 남긴다. |
| REQ-f4-layout-hit-area-003 | tablet bounds를 desktop과 공유할 수 있는지 검증한다. | Must | tablet 오차가 <= 2px이면 공유 유지, 초과하면 `TABLET_HIT_AREAS`를 별도 정의한다. |
| REQ-f4-layout-hit-area-004 | overlay anchor 기준을 `ScaledContent` 내부 좌표계로 맞추는 Proposal A를 우선 평가한다. | Must | anchor 변경 여부와 근거가 decision log에 기록된다. |
| REQ-f4-layout-hit-area-005 | tooltip/ring 표시가 hover와 keyboard focus 양쪽에서 같은 target을 가리키도록 유지한다. | Must | pointer hover, keyboard focus 상태에서 highlight target이 동일하다. |
| REQ-f4-layout-hit-area-006 | hit-area와 layout 관련 테스트를 변경된 구조에 맞게 갱신한다. | Must | 관련 테스트가 새 bounds와 2열 layout을 기준으로 통과한다. |
| REQ-f4-layout-hit-area-007 | F2 mock schema와 충돌하지 않도록 `mock-data.ts` 변경을 피한다. | Should | F4 구현 diff에 `src/lib/mock-data.ts` 변경이 없거나, 필요한 경우 F2와 충돌 위험이 별도 승인된다. |

## 6. UX Requirements

- layout 변경은 정보 밀도를 높이되 버튼, label, value의 읽기 순서를 바꾸지 않는다.
- tooltip과 ring은 target 위에 자연스럽게 붙어야 하며, 이전/다음 UI를 가리지 않는 방향을 우선한다.
- focus outline은 keyboard 사용자에게도 충분히 보이고 theme token과 충돌하지 않아야 한다.
- mobile 390px에서는 2열 강제 적용으로 텍스트가 찌그러지지 않아야 한다.
- tablet 768px은 별도 검증 기준으로 취급한다. desktop과 같아 보이더라도 좌표 evidence가 없으면 공유를 확정하지 않는다.

## 7. Technical Considerations

- 주요 예상 파일은 `src/components/dashboard-preview/order-form/index.tsx`, `datetime-card.tsx`, `hit-areas.ts`, `interactive-overlay.tsx`다.
- 1차 구현은 draft 결정대로 static bounds 재측정을 우선한다. dynamic DOM measurement는 fallback proposal로 남기며, static bounds가 반복적으로 깨질 때만 별도 결정한다.
- `ScaledContent` 내부 anchor 이동은 좌표계가 단순해질 가능성이 크지만, existing scale transform과 scroll offset 영향을 같이 확인해야 한다.
- F2와 병렬 진행 시 F4는 layout/overlay 파일 중심으로 제한하고, `mock-data.ts` 편집은 피한다.
- 테스트는 수치 좌표만 비교하지 않고 "어떤 target을 가리키는지"를 함께 검증해야 한다.

## 8. Milestones

| 단계 | 범위 | 완료 조건 |
|---|---|---|
| M1 — PRD review | 본 PRD 품질 및 Epic 일관성 검토 | `03-prd-review.md` 승인 판정 |
| M2 — Bridge | Feature Package 컨텍스트 생성 | `/plan-bridge f4-layout-hit-area-realignment` 완료 |
| M3 — Layout | DateTime 2열 배치 적용 | mobile 1열, md+ 2열 확인 |
| M4 — Hit-area | 19 bounds 재측정 | desktop/tablet evidence 확보 |
| M5 — Overlay/Test | anchor 결정 및 테스트 갱신 | 관련 테스트 통과 + decision log 기록 |

## 9. Risks & Mitigations

| 리스크 | 영향 | 확률 | 완화 |
|---|:---:|:---:|---|
| static bounds가 layout 변경마다 다시 깨짐 | High | Medium | 1차는 evidence 기반 재측정, 반복 파손 시 dynamic DOM measurement를 별도 decision으로 승격 |
| tablet에서 desktop bounds 공유가 맞지 않음 | Medium | Medium | tablet evidence를 별도 수집하고 2px 초과 시 별도 bounds 분리 |
| overlay anchor 변경이 scale transform과 충돌 | Medium | Medium | `ScaledContent` 내부 anchor와 기존 anchor를 비교해 decision log에 근거 기록 |
| F2와 병렬 진행 중 같은 파일 충돌 | Medium | Low | F4는 layout/overlay 파일 중심으로 제한하고 `mock-data.ts` 편집을 피함 |
| 시각 evidence 없이 숫자만 갱신 | Medium | Medium | bounds 변경마다 screenshot 또는 좌표 evidence matrix를 남김 |

## 10. Success Metrics

| ID | 지표 | 목표 | 측정 방법 |
|---|---|---|---|
| SM-f4-001 | DateTime layout 반응형 일치 | mobile 1열, md+ 2열 | 390/768/1440 viewport 렌더 확인 |
| SM-f4-002 | desktop hit-area 오차 | 19개 target 모두 <= 2px 목표 | DOM bounding box와 bounds 비교 evidence |
| SM-f4-003 | tablet bounds 판정 | 공유 또는 분리 결정 완료 | 768 viewport 오차 기록 |
| SM-f4-004 | overlay anchor 결정 | Proposal A 적용 또는 보류 근거 기록 | decision log 확인 |
| SM-f4-005 | 테스트 안정성 | 관련 test pass | `pnpm test` 또는 관련 테스트 subset |

## 11. 생성된 파일

- **PRD 본 파일**: `.plans/drafts/f4-layout-hit-area-realignment/02-prd.md`
- **리뷰 파일**: `.plans/drafts/f4-layout-hit-area-realignment/03-prd-review.md`
- **연계 파일**: IDEA, Epic children, handoff 문서는 PRD/review 완료 후 상태 동기화한다.
- **Bridge 파일**: [`.plans/features/active/f4-layout-hit-area-realignment/00-context/`](../../features/active/f4-layout-hit-area-realignment/00-context/00-index.md) 생성 완료. 공식 TASK 문서는 다음 `/dev-feature` 단계에서 생성한다.

## 12. 다음 단계

1. `03-prd-review.md` 기준 PRD 리뷰 판정을 확인한다.
2. 사용자 승인 후 `/plan-bridge f4-layout-hit-area-realignment`를 실행한다.
3. Bridge 이후 `/dev-feature`에서 TASK와 allowed target paths를 확정한다.

## 13. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-24 | 초안 작성 — PRD 10 섹션, REQ 7건, UX/Tech/Milestone/Risk/Success Metric 정리. Bridge는 사용자 요청 범위에서 제외. |
| 2026-04-24 | `/plan-bridge f4-layout-hit-area-realignment` 실행 — active feature `00-context` 생성 완료, next step을 `/dev-feature`로 전환. |
