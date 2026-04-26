# 03. Design Decisions — F4 레이아웃 정비 + Hit-Area 재정렬

> Draft와 PRD에서 확정한 설계 결정을 구현 관점으로 재정리한다.

---

## 1. DateTime layout

| 항목 | 결정 |
|---|---|
| 선택값 | `md` 이상 2열, mobile 1열 |
| 근거 | order form 세로 밀도를 낮추면서 mobile 텍스트 압축을 피함 |
| 구현 영향 | `order-form/index.tsx`의 pickup/delivery `DateTimeCard` wrapper 조정 |
| 검증 | 390px 1열, 768/1440px 2열 확인 |

## 2. Hit-area strategy

| 항목 | 결정 |
|---|---|
| 선택값 | static bounds 재측정 우선 |
| 근거 | 현재 구조가 static bounds 기반이며, dynamic DOM measurement는 범위와 리스크가 큼 |
| fallback | static bounds가 반복적으로 깨질 때 dynamic measurement를 별도 decision으로 승격 |
| 검증 | 18개 target과 bounds 오차 <= 2px 목표 |

## 3. Tablet bounds

| 항목 | 결정 |
|---|---|
| 선택값 | evidence 기반 공유/분리 판정 |
| 기준 | 768px viewport에서 desktop bounds 오차가 2px 초과하면 `TABLET_HIT_AREAS` 분리 |
| 검증 | tablet coordinate evidence를 남김 |

## 4. Overlay anchor

| 항목 | 결정 |
|---|---|
| 우선안 | `ScaledContent` 내부 기준 anchor 검토 |
| 이유 | scale transform과 overlay 좌표계를 더 단순하게 맞출 가능성이 있음 |
| 보류 조건 | 기존 anchor가 더 안정적이라는 evidence가 있으면 보류 가능 |
| 기록 | 적용/보류 근거를 `02-decision-log.md`에 추가 |

## 5. F2 충돌 회피

| 항목 | 결정 |
|---|---|
| 선택값 | `mock-data.ts`, `preview-steps.ts` 편집 금지 |
| 이유 | F2 Mock schema redesign과 병렬 가능성을 유지해야 함 |
| 예외 | F2와 순차 조정이 필요하다는 사용자 승인 후 binding 갱신 |
