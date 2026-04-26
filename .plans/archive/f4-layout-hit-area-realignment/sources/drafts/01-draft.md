# Draft — F4 레이아웃 정비 + Hit-Area 재정렬

> **IDEA**: [IDEA-20260424-002](../../ideas/20-approved/IDEA-20260424-002.md)
> **Screening**: [SCREENING-20260424-002](../../ideas/20-approved/SCREENING-20260424-002.md)
> **Lane**: Standard
> **Scenario**: B (기존 Phase 3 preview의 layout/interaction 정밀도 개선)
> **Feature type**: dev
> **Hybrid**: false
> **Epic**: EPIC-20260422-001

---

## 1. 목표

order form의 세로 밀도를 낮추고, hit-area와 tooltip이 실제 DOM 위치에 더 정확하게 맞도록 조정한다. 사용자는 hover/focus 상태에서 설명이 엉뚱한 위치를 가리킨다는 느낌 없이 preview를 탐색할 수 있어야 한다.

## 2. 범위

| 영역 | In-scope |
|---|---|
| DateTime layout | pickup/delivery `DateTimeCard` 2열 배치 검토 및 적용 |
| Hit areas | 19개 bounds 재측정 |
| Tablet behavior | desktop bounds 공유 유지 여부 결정 |
| Overlay anchor | ScaledContent 기준 anchor 재검토 |
| Tests | hit-area, dashboard-preview, layout 회귀 테스트 갱신 |

## 3. Out-of-scope

- F2 mock schema 변경
- F3 옵션 요금 파생
- landing theme token 재스윕
- 신규 tutorial 또는 설명 UI 추가

## 4. 핵심 결정

| 항목 | 결정 |
|---|---|
| DateTime layout | `md:grid-cols-2` 기반 2열을 기본 후보로 둔다. 모바일은 1열 유지 |
| Hit-area strategy | 1차는 static bounds 재측정. dynamic DOM measurement는 fallback proposal로 보류 |
| Tablet bounds | 재측정 결과 오차가 2px를 넘으면 tablet 별도 bounds로 분리 |
| Overlay anchor | ScaledContent 내부 기준으로 맞추는 Proposal A를 우선 검토 |

## 5. Acceptance Criteria

- pickup/delivery time block이 desktop/tablet에서 더 압축된 2열 구조로 보인다.
- 19개 hit-area bounds가 실제 target과 2px 이내 오차를 목표로 한다.
- Tablet viewport에서 tooltip/ring 위치가 desktop scale 가정 때문에 어긋나지 않는다.
- `hit-areas.test.ts` 및 dashboard-preview 관련 테스트가 통과한다.
- F2와 병렬 진행 시 `mock-data.ts` 수정 충돌을 만들지 않는다.

## 6. 리스크

| 리스크 | 수준 | 대응 |
|---|:---:|---|
| static bounds 재측정 오차 | high | desktop/tablet screenshot 기준 evidence 확보 |
| layout 변경으로 기존 tests 깨짐 | medium | DateTimeCard 단위 테스트와 hit-area 테스트를 먼저 갱신 |
| overlay anchor 이동 범위 확장 | medium | PRD에서 Proposal A/B를 최종 결정하고 구현 범위 고정 |

## 7. 다음 단계

1. `/plan-prd .plans/drafts/f4-layout-hit-area-realignment/`
2. PRD에서 dynamic DOM measurement 도입 여부를 최종 판단한다.
3. `/plan-bridge f4-layout-hit-area-realignment`
