# 01. PRD Freeze — F4 레이아웃 정비 + Hit-Area 재정렬

> **Frozen at**: 2026-04-24 (Bridge 생성 시점)
> **PRD source**: [`../../../../drafts/f4-layout-hit-area-realignment/02-prd.md`](../../../../drafts/f4-layout-hit-area-realignment/02-prd.md)
> **PRD Review**: [`../../../../drafts/f4-layout-hit-area-realignment/03-prd-review.md`](../../../../drafts/f4-layout-hit-area-realignment/03-prd-review.md) — Approve, critical/high 없음
> **Freeze 의미**: 구현은 아래 범위를 기준으로 진행한다. PRD 원본 변경 시 Bridge 재승인 필요.

---

## 1. 고정 범위

| 항목 | 값 |
|---|---|
| Lane | Standard |
| Scenario | B |
| Feature type | dev |
| Hybrid | false |
| Epic | EPIC-20260422-001 Phase B |

## 2. 고정 요구사항

| ID | 요약 | 우선순위 |
|---|---|:---:|
| REQ-f4-layout-hit-area-001 | pickup/delivery `DateTimeCard` md+ 2열, mobile 1열 | Must |
| REQ-f4-layout-hit-area-002 | 현재 code/test SSOT 기준 18개 bounds 실제 DOM 기준 재측정 | Must |
| REQ-f4-layout-hit-area-003 | tablet bounds 공유/분리 판정 | Must |
| REQ-f4-layout-hit-area-004 | `ScaledContent` 내부 anchor Proposal A 우선 평가 | Must |
| REQ-f4-layout-hit-area-005 | hover/focus tooltip/ring target 일치 유지 | Must |
| REQ-f4-layout-hit-area-006 | hit-area/layout 관련 테스트 갱신 | Must |
| REQ-f4-layout-hit-area-007 | F2와 충돌하지 않도록 `mock-data.ts` 변경 회피 | Should |

## 3. 성공 지표

| ID | 목표 |
|---|---|
| SM-f4-001 | 390px mobile 1열, 768/1440px 2열 확인 |
| SM-f4-002 | desktop 18개 target bounds 오차 <= 2px 목표 |
| SM-f4-003 | tablet bounds 공유 또는 분리 결정 완료 |
| SM-f4-004 | overlay anchor 적용/보류 근거 decision log 기록 |
| SM-f4-005 | 관련 테스트 통과 |

## 4. PRD Review 후속 피드백

| ID | Severity | Action | 처리 시점 |
|---|---|---|---|
| F4-PRD-FB-01 | medium | queued | `/dev-feature`에서 evidence artifact 경로 고정 |
| F4-PRD-FB-02 | low | queued | 구현 중 dynamic DOM measurement 전환 기준 보강 |

## 5. Freeze 무효 조건

- `DateTimeCard` layout 기준이 2열이 아닌 다른 구조로 바뀌는 경우.
- static bounds 우선 전략이 dynamic measurement 선도입으로 바뀌는 경우.
- F2 mock schema 변경을 F4 범위 안에 포함하는 경우.
- Epic 성공 지표 5의 오차 목표가 바뀌는 경우.

> 구현 기준 보정: PRD 원문은 Phase 3의 19개 target을 기준으로 작성됐지만, F5에서 `ai-json-viewer`가 제거된 뒤 현재 code/test SSOT는 18개다. D-F4-008에 따라 F4는 18개 target 기준으로 실행한다.
