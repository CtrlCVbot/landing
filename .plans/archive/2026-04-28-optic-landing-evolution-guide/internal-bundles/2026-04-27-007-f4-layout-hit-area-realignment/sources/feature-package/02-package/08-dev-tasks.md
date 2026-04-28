# 08. Dev Tasks - F4 레이아웃 정비 + Hit-Area 재정렬

> **SSOT** for `/dev-run` TASK 실행. TASK ID: `T-F4-{AREA}-{NN}`.
> 상세 힌트: [`04-implementation-hints.md`](../00-context/04-implementation-hints.md) 참조.

---

## TASK 목록

| TASK | 제목 | 선행 | 주요 파일 | Effort |
|---|---|---|---|:---:|
| T-F4-LAYOUT-01 | DateTime 2열 layout 적용 | - | `order-form/index.tsx`, `datetime-card.tsx`, tests | 1 인·일 |
| T-F4-HITAREA-02 | desktop 18 bounds 재측정 | T-F4-LAYOUT-01 | `hit-areas.ts`, `hit-areas.test.ts` | 1.5 인·일 |
| T-F4-TABLET-03 | tablet 공유/분리 판정 | T-F4-HITAREA-02 | `hit-areas.ts`, evidence note | 1 인·일 |
| T-F4-OVERLAY-04 | overlay anchor 적용/보류 결정 | T-F4-TABLET-03 | `interactive-overlay.tsx`, overlay tests | 1 인·일 |
| T-F4-QA-05 | evidence 정리 + regression 검증 | T-F4-OVERLAY-04 | `03-dev-notes/**`, related tests | 1 인·일 |

**합계**: 5.5 인·일 예상.

---

## T-F4-LAYOUT-01 - DateTime 2열 layout 적용

**REQ**: REQ-f4-layout-hit-area-001

### Scope

- pickup/delivery `DateTimeCard` wrapper를 `md` 이상 2열로 변경.
- 390px mobile은 1열 유지.
- label/value, icon, focus 순서 유지.

### Acceptance

- [x] 390px에서 1열 유지
- [x] 768px 이상에서 2열
- [x] `datetime-card`와 order form tests 통과

---

## T-F4-HITAREA-02 - desktop 18 bounds 재측정

**REQ**: REQ-f4-layout-hit-area-002

### Scope

- layout 변경 후 1440px desktop 기준 18개 bounds 재측정.
- target id를 유지하고 좌표만 필요한 범위에서 갱신.
- evidence table에 max delta 기록.

### Acceptance

- [x] target count 18 유지
- [x] desktop max delta <= 2px 목표 evidence 기록
- [x] `hit-areas.test.ts` 통과

---

## T-F4-TABLET-03 - tablet 공유/분리 판정

**REQ**: REQ-f4-layout-hit-area-003

### Scope

- 768px tablet 기준 bounds 오차 측정.
- desktop bounds 공유 또는 `TABLET_HIT_AREAS` 분리 결정.
- 결정 결과를 decision log에 기록.

### Acceptance

- [x] tablet max delta 기록
- [x] 공유/분리 결정 기록
- [x] 필요한 경우 tablet 전용 bounds 테스트 통과

---

## T-F4-OVERLAY-04 - overlay anchor 적용/보류 결정

**REQ**: REQ-f4-layout-hit-area-004, REQ-f4-layout-hit-area-005

### Scope

- `ScaledContent` 내부 anchor Proposal A 평가.
- 적용하거나 보류한다.
- hover와 keyboard focus가 같은 target을 가리키는지 확인.

### Acceptance

- [x] anchor 적용/보류 결정이 decision log에 기록됨
- [x] overlay regression tests 통과
- [x] hover/focus target 일치

---

## T-F4-QA-05 - evidence 정리 + regression 검증

**REQ**: REQ-f4-layout-hit-area-006, REQ-f4-layout-hit-area-007

### Scope

- `03-dev-notes/hit-area-evidence.md` 갱신.
- F2 충돌 방지를 위해 `mock-data.ts` 변경 여부 확인.
- 관련 test subset과 전체 회귀 검증.

### Acceptance

- [x] evidence table 완료
- [x] `src/lib/mock-data.ts` 변경 없음
- [x] 관련 tests + `pnpm typecheck` + `pnpm lint` 통과

---

## 공통 검증

```bash
pnpm test src/components/dashboard-preview/__tests__/hit-areas.test.ts
pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/datetime-card.test.tsx
pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx
pnpm test src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx
pnpm typecheck
pnpm lint
```
