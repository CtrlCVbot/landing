# 06. Domain Logic - F4 레이아웃 정비 + Hit-Area 재정렬

> F4의 domain logic은 업무 계산이 아니라 preview interaction coordinate contract다.

---

## 1. Bounds Contract

| 항목 | 계약 |
|---|---|
| Source | `data-hit-area-id` target DOMRect 우선, `hit-areas.ts` static bounds fallback |
| Target count | 18개 유지 (F5 이후 code/test SSOT) |
| Desktop 기준 | 실제 DOM bounding box 기준 |
| Tablet 기준 | 실제 DOM bounding box 기준 |
| 허용 오차 목표 | <= 2px |

---

## 2. Layout -> Bounds 순서

1. DateTime layout을 먼저 바꾼다.
2. 실제 target root에 `data-hit-area-id` marker를 부여한다.
3. overlay가 marker DOMRect를 측정해 동일 좌표계로 변환한다.
4. marker가 없는 target만 static bounds fallback을 사용한다.
5. evidence와 test를 갱신한다.

layout 변경 전 좌표를 먼저 바꾸면 다시 어긋날 수 있으므로 금지한다.

---

## 3. Tablet Decision Rule

| 조건 | 결정 |
|---|---|
| tablet max delta <= 2px | `TABLET_HIT_AREAS = DESKTOP_HIT_AREAS` 또는 기존 공유 유지 |
| tablet max delta > 2px | `TABLET_HIT_AREAS` 별도 정의 |
| evidence 없음 | 공유 확정 금지 |

---

## 4. Overlay Anchor Rule

`ScaledContent` 내부 anchor가 좌표계 단순화에 유리한지 먼저 검토한다. 단, scale transform과 scroll offset 때문에 회귀가 생기면 기존 anchor를 유지하고 decision log에 보류 근거를 남긴다.

---

## 5. F2 충돌 방지

F4는 `mock-data.ts`를 수정하지 않는다. `order-form/index.tsx`는 F2와 공유 가능성이 있으므로 F4에서는 layout wrapper와 DateTime placement에만 집중한다.
