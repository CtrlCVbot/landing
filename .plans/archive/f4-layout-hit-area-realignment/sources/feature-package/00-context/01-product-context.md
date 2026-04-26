# 01. Product Context — F4 레이아웃 정비 + Hit-Area 재정렬

> **Feature slug**: `f4-layout-hit-area-realignment`
> **IDEA**: [IDEA-20260424-002](../../../../ideas/20-approved/IDEA-20260424-002.md)
> **PRD**: [02-prd.md](../../../../drafts/f4-layout-hit-area-realignment/02-prd.md)
> **Epic**: [EPIC-20260422-001](../../../../epics/20-active/EPIC-20260422-001/00-epic-brief.md) Phase B
> **Routing**: Standard / Scenario B / dev / hybrid false
> **작성일**: 2026-04-24

---

## 1. 목적

F4는 dash-preview Phase 3 이후 남은 **레이아웃 밀도**와 **상호작용 위치 정확도** 문제를 해결한다. pickup/delivery 시간 카드가 세로 공간을 많이 쓰고, 현재 18개 hit-area bounds와 tooltip/ring 위치가 실제 DOM과 어긋날 수 있는 부분을 정리한다.

사용자 관점의 핵심 가치는 "어디를 설명하는지 정확히 보이는 preview"다. highlight가 실제 target과 어긋나면 demo 신뢰도가 떨어지므로, layout 변경과 hit-area 재측정은 같은 Feature 안에서 순차 처리한다.

## 2. Epic 성공 지표 연결

| Epic 지표 | F4 기여 |
|---|---|
| 지표 5 — 인터랙티브 오버레이 위치 정확도 | 18개 hit-area bounds 재측정, desktop/tablet 오차 <= 2px 목표 |
| 지표 2 — Step 기반 미노출 | 직접 담당 아님. F2 담당 |
| 지표 1/3 — Mock data 정합성/시나리오 | 직접 담당 아님. F2/F3 담당 |

## 3. Phase B 내 위치

F4는 F2와 병렬 가능하다. 단, F4 내부에서는 `DateTimeCard` 2열 layout 적용 후 `hit-areas.ts` 재측정과 `interactive-overlay.tsx` anchor 검토가 이어져야 한다.

| 관계 | 타입 | 근거 |
|---|:---:|---|
| F2 ↔ F4 | ✓ | F2는 mock data/step visibility 중심, F4는 layout/hit-area/overlay 중심 |
| F4 → F3 | ✓ | F3는 F2 schema 이후 옵션 fee 로직을 얹는 작업이라 F4와 직접 의존 없음 |

## 4. 완료 후 사용자 변화

- pickup/delivery 시간 정보가 desktop/tablet에서 더 조밀하게 보인다.
- hover/focus tooltip과 ring이 실제 target 위치에 더 정확히 붙는다.
- tablet에서 desktop bounds를 공유할지 별도로 분리할지 근거가 남는다.
- 후속 layout 변경 시 bounds evidence를 기준으로 회귀를 빠르게 찾을 수 있다.
