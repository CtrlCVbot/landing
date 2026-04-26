# 01. Requirements - F4 레이아웃 정비 + Hit-Area 재정렬

> 본 문서가 F4 요구사항 정의의 SSOT다. 모든 TASK와 TC는 아래 REQ ID를 참조한다.

---

## 1. Functional Requirements

| ID | 우선순위 | 요구사항 | 수용 기준 |
|---|:---:|---|---|
| REQ-f4-layout-hit-area-001 | Must | pickup/delivery `DateTimeCard`를 `md` 이상에서 2열, mobile에서 1열로 배치한다. | 390px mobile은 1열, 768px 이상은 2열로 렌더된다. label/value가 겹치지 않는다. |
| REQ-f4-layout-hit-area-002 | Must | `hit-areas.ts`의 현재 18개 bounds를 layout 변경 후 실제 DOM 기준으로 재측정한다. | desktop viewport에서 각 bounds와 실제 target 간 오차 <= 2px를 목표로 evidence를 남긴다. |
| REQ-f4-layout-hit-area-003 | Must | tablet bounds를 desktop과 공유할 수 있는지 검증한다. | tablet 오차가 <= 2px이면 공유 유지, 초과하면 `TABLET_HIT_AREAS`를 별도 정의한다. |
| REQ-f4-layout-hit-area-004 | Must | overlay anchor 기준을 `ScaledContent` 내부 좌표계로 맞추는 Proposal A를 우선 평가한다. | anchor 변경 여부와 근거가 decision log에 기록된다. |
| REQ-f4-layout-hit-area-005 | Must | tooltip/ring 표시가 hover와 keyboard focus 양쪽에서 같은 target을 가리키도록 유지한다. | pointer hover, keyboard focus 상태에서 highlight target이 동일하다. |
| REQ-f4-layout-hit-area-006 | Must | hit-area와 layout 관련 테스트를 변경된 구조에 맞게 갱신한다. | 관련 테스트가 새 bounds와 2열 layout을 기준으로 통과한다. |
| REQ-f4-layout-hit-area-007 | Should | F2 mock schema와 충돌하지 않도록 `mock-data.ts` 변경을 피한다. | F4 구현 diff에 `src/lib/mock-data.ts` 변경이 없다. |

---

> Count 기준: PRD 원문은 Phase 3의 19개 target을 전제로 작성됐지만, F5에서 `ai-json-viewer` target이 제거되어 현재 구현 SSOT는 18개다. F4는 D-F4-008에 따라 제거된 target을 복원하지 않는다.

## 2. Non-Functional Requirements

| ID | 요구사항 | 수용 기준 |
|---|---|---|
| NFR-f4-001 | 좌표 evidence 확보 | desktop/tablet viewport별 target count와 max delta가 기록된다. |
| NFR-f4-002 | mobile 안정성 | 390px에서 text overlap이 없다. |
| NFR-f4-003 | keyboard 접근성 유지 | focus 상태에서도 같은 hit-area target을 가리킨다. |
| NFR-f4-004 | 신규 dependency 금지 | `package.json` 변경이 없다. |
| NFR-f4-005 | F2와 충돌 최소화 | `mock-data.ts`를 수정하지 않는다. |

---

## 3. Out of Scope

- F2 mock schema 변경.
- F3 옵션별 추가요금 파생 로직.
- 새로운 tutorial UI나 설명 패널.
- 실제 AI API 연동.
- 외부 좌표/측정 dependency 추가.

---

## 4. Evidence Requirement

구현 완료 전 [`03-dev-notes/hit-area-evidence.md`](../03-dev-notes/hit-area-evidence.md)에 다음을 남긴다.

| viewport | 필수 기록 |
|---|---|
| 1440 desktop | target count 18, max delta, pass/fail |
| 768 tablet | desktop 공유/분리 결정, max delta |
| 390 mobile | DateTime 1열 유지, text overlap 여부 |
