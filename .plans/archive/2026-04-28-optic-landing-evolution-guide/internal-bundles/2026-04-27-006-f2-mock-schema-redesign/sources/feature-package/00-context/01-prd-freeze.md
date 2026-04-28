# 01. PRD Freeze — F2 Mock 스키마 재설계

> **Frozen at**: 2026-04-24 (Bridge 생성 시점)
> **PRD source**: [`../../../../drafts/f2-mock-schema-redesign/02-prd.md`](../../../../drafts/f2-mock-schema-redesign/02-prd.md)
> **PRD Review**: [`../../../../drafts/f2-mock-schema-redesign/03-prd-review.md`](../../../../drafts/f2-mock-schema-redesign/03-prd-review.md) — Approve, critical/high 없음
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
| REQ-f2-mock-schema-001 | `PREVIEW_MOCK_SCENARIOS` 최소 3개 도입 | Must |
| REQ-f2-mock-schema-002 | 각 scenario에 `extractedFrame` 정의 | Must |
| REQ-f2-mock-schema-003 | 각 scenario에 `appliedFrame` 정의 | Must |
| REQ-f2-mock-schema-004 | deterministic default selector helper 제공 | Must |
| REQ-f2-mock-schema-005 | `fare`와 `estimate.amount` 정합성 검증 | Must |
| REQ-f2-mock-schema-006 | Step 기반 visibility state 명시 | Must |
| REQ-f2-mock-schema-007 | `AI_EXTRACT` 이전 estimate/settlement 완성값 미노출 | Must |
| REQ-f2-mock-schema-008 | `AI_APPLY` 이후 `appliedFrame` 값 반영 | Must |
| REQ-f2-mock-schema-009 | `jsonViewerOpen` 유지/이관/제거 결정 | Should |
| REQ-f2-mock-schema-010 | user-facing scenario selector UI는 MVP 제외 | Could |

## 3. 성공 지표

| ID | 목표 |
|---|---|
| SM-f2-001 | `PREVIEW_MOCK_SCENARIOS.length >= 3` |
| SM-f2-002 | AI panel은 `extractedFrame`, order form은 `appliedFrame` 기준 |
| SM-f2-003 | `AI_EXTRACT` 전 estimate/settlement 완성값 미노출 |
| SM-f2-004 | `AI_APPLY` 이후 `appliedFrame` 값 표시 |
| SM-f2-005 | default scenario `fare`와 `estimate.amount` 정합 |
| SM-f2-006 | 관련 테스트 통과 |

## 4. PRD Review 후속 피드백

| ID | Severity | Action | 처리 시점 |
|---|---|---|---|
| F2-PRD-FB-01 | medium | queued | `/dev-feature`에서 compatibility helper API 고정 |
| F2-PRD-FB-02 | medium | queued | 구현 전 `jsonViewerOpen` 처리 결정 기록 |
| F2-PRD-FB-03 | low | queued | scenario selector UI 요청 시 별도 scope 확인 |

## 5. Freeze 무효 조건

- `extractedFrame` / `appliedFrame` 분리를 제거하는 경우.
- scenario count 목표가 3개 미만으로 바뀌는 경우.
- user-facing scenario selector UI가 Must 범위로 승격되는 경우.
- F4 layout/hit-area 변경을 F2 범위에 포함하는 경우.
