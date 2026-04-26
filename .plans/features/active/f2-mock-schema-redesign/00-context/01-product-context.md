# 01. Product Context — F2 Mock 스키마 재설계

> **Feature slug**: `f2-mock-schema-redesign`
> **IDEA**: [IDEA-20260424-001](../../../../ideas/20-approved/IDEA-20260424-001.md)
> **PRD**: [02-prd.md](../../../../drafts/f2-mock-schema-redesign/02-prd.md)
> **Epic**: [EPIC-20260422-001](../../../../epics/20-active/EPIC-20260422-001/00-epic-brief.md) Phase B
> **Routing**: Standard / Scenario B / dev / hybrid false
> **작성일**: 2026-04-24

---

## 1. 목적

F2는 dash-preview의 mock data를 **AI가 읽은 값**과 **폼에 적용된 값**으로 분리한다. 현재 preview는 단일 mock 구조에 AI panel 표시값과 order form 적용값이 섞여 있어, 사용자가 `AI_EXTRACT` 이전에 완성 수치를 보거나 유지보수자가 fee source를 다시 해석해야 하는 문제가 생긴다.

본 Feature의 제품 가치는 "demo가 실제 업무 흐름처럼 읽히는 것"이다. `extractedFrame`과 `appliedFrame`이 분리되면 AI 추출 단계, 폼 적용 단계, 정산 표시 단계가 더 선명해지고 F3 옵션별 추가요금 파생 로직도 안정적으로 얹을 수 있다.

## 2. Epic 성공 지표 연결

| Epic 지표 | F2 기여 |
|---|---|
| 지표 1 — AI 추출값 ↔ 폼 적용값 완전 일치 | `extractedFrame` / `appliedFrame` source 분리와 `fare` ↔ `estimate.amount` 정합성 검증 |
| 지표 2 — AI_EXTRACT 이전 완성 수치 미노출 | Step 기반 `estimateVisible`, `settlementVisible` 또는 동등한 상태 생성 |
| 지표 3 — 3개 이상 시나리오 세트 순환 | `PREVIEW_MOCK_SCENARIOS.length >= 3` |
| 지표 5 — hit-area 위치 정확도 | 직접 담당 아님. F4 담당 |

## 3. Phase B 내 위치

F2는 F4와 병렬 가능하지만, F3보다 선행되어야 한다. F3는 F2 schema가 확정된 뒤 `OPTION_FEE_MAP`을 추가하는 구조다.

| 관계 | 타입 | 근거 |
|---|:---:|---|
| F2 ↔ F4 | ✓ | F2는 mock schema/step visibility, F4는 layout/hit-area 중심 |
| F2 → F3 | → | F3 fee 파생은 F2 schema 위에 얹어야 함 |
| F2 ← F5 | → | F5 archived 후 `jsonViewerOpen` 잔재 이관/정리 가능 |

## 4. 완료 후 사용자 변화

- AI panel은 "AI가 읽은 값"을 보여준다.
- order form은 "적용된 값"을 단계에 맞게 보여준다.
- `AI_EXTRACT` 전 estimate/settlement 완성값이 먼저 보이지 않는다.
- default, partial, mismatch-risk scenario로 정상/부분/불일치 위험 흐름을 테스트할 수 있다.
