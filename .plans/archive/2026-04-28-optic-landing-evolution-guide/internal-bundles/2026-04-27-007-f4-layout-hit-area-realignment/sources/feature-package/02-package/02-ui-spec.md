# 02. UI Spec - F4 레이아웃 정비 + Hit-Area 재정렬

---

## 1. DateTime Layout

| viewport | layout | 기준 |
|---|---|---|
| 390 mobile | 1열 | 작은 화면에서 텍스트 찌그러짐 방지 |
| 768 tablet | 2열 | `md` 이상 2열 기준 |
| 1440 desktop | 2열 | pickup/delivery 비교 가독성 강화 |

pickup/delivery `DateTimeCard`의 label, icon, value 읽기 순서는 유지한다. layout wrapper만 변경하는 것을 기본값으로 둔다.

---

## 2. Hit-Area Highlight

| 항목 | 기준 |
|---|---|
| target count | 18개 유지 |
| desktop 오차 목표 | <= 2px |
| tablet 판정 | <= 2px면 desktop bounds 공유, 초과 시 tablet 전용 bounds |
| hover/focus | 같은 target을 가리켜야 함 |

좌표값만 바꾸는 변경은 완료로 보지 않는다. evidence table과 관련 테스트가 함께 있어야 한다.

---

## 3. Overlay Anchor

Proposal A는 `interactive-overlay.tsx` anchor를 `ScaledContent` 내부 좌표계로 맞추는 것이다. 구현자는 기존 anchor와 Proposal A를 비교하고, 적용 또는 보류 결정을 decision log에 남긴다.

| 결정 | 조건 |
|---|---|
| 적용 | scale transform과 scroll offset에서 좌표계가 더 단순하고 테스트가 통과 |
| 보류 | 기존 anchor가 더 안정적이거나 Proposal A가 scale/scroll과 충돌 |

---

## 4. 시각 안정성

- Tooltip/ring이 이전 또는 다음 UI를 과하게 가리지 않는다.
- Keyboard focus outline은 theme token과 충돌하지 않는다.
- F1 라이트/다크 토큰 결과를 되돌리지 않는다.
- F2의 data source 변경과 섞지 않는다.
