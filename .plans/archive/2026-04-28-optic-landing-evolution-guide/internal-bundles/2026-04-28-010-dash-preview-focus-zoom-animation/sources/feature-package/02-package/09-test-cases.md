# Test Cases: dash-preview-focus-zoom-animation

> **Feature**: Dash Preview Focus Zoom Animation
> **Requirements SSOT**: `01-requirements.md`
> **Dev Tasks**: `08-dev-tasks.md`
> **Created**: 2026-04-28

---

## 0. 이 문서의 역할

이 문서는 구현 후 검증해야 할 test case 목록이다. 자동 테스트와 browser visual check를 분리한다.

---

## 1. Unit Tests

| TC | 목적 | 검증 | REQ |
|---|---|---|---|
| `TC-FZ-UNIT-01` | focus metadata coverage | 모든 `PREVIEW_STEPS`가 focus phase를 가진다. | `REQ-FZ-001`, `REQ-FZ-007` |
| `TC-FZ-UNIT-02` | result-to-card mapping | departure/destination/cargo/fare가 pickup/delivery/cargo/fare target에 1:1 연결된다. | `REQ-FZ-006` |
| `TC-FZ-UNIT-03` | viewport preset 분리 | desktop/tablet preset 구조가 존재하거나 override 가능하다. | `REQ-FZ-008` |
| `TC-FZ-UNIT-04` | focus timing validation | focus duration이 step duration을 넘지 않는다. | `REQ-FZ-014` |

---

## 2. Integration / Component Tests

| TC | 목적 | 검증 | REQ |
|---|---|---|---|
| `TC-FZ-INT-01` | `AI_APPLY` 4단계 loop | pickup → delivery → cargo → fare 순서가 UI state에 반영된다. | `REQ-FZ-005` |
| `TC-FZ-INT-02` | mobile preservation | mobile viewport에서 `MobileCardView`가 렌더링되고 focus viewport가 적용되지 않는다. | `REQ-FZ-009` |
| `TC-FZ-INT-03` | step control regression | `StepIndicator` 클릭 후 해당 step focus state로 이동한다. | `REQ-FZ-011` |
| `TC-FZ-INT-04` | interactive overlay regression | interactive mode에서 overlay area execute와 tooltip이 유지된다. | `REQ-FZ-012` |
| `TC-FZ-INT-05` | unified AI_APPLY phase order | departure result → pickup card → destination result → delivery card → estimate card → cargo result → cargo card → fare result → settlement card 순서가 유지된다. | `REQ-FZ-005`, `REQ-FZ-006` |
| `TC-FZ-INT-06` | card-only fill/highlight | focus-driven `AI_APPLY`에서 현재 카드만 revealed/active 되고 column pulse는 꺼진다. | `REQ-FZ-013`, `REQ-FZ-015` |

---

## 3. Accessibility Tests

| TC | 목적 | 검증 | REQ |
|---|---|---|---|
| `TC-FZ-A11Y-01` | reduced motion | `prefers-reduced-motion`에서 큰 scale/translate가 발생하지 않는다. | `REQ-FZ-010` |
| `TC-FZ-A11Y-02` | decorative layer noise | focus visual layer가 keyboard order와 screen reader output을 방해하지 않는다. | `REQ-FZ-015` |

---

## 4. Visual / Browser Checks

| TC | Viewport | 검증 | REQ |
|---|---|---|---|
| `TC-FZ-VIS-01` | Desktop/Tablet | `AI_INPUT`에서 입력창이 중심 target으로 보인다. | `REQ-FZ-002` |
| `TC-FZ-VIS-02` | Desktop/Tablet | `AI_EXTRACT`에서 추출 버튼이 강조된다. | `REQ-FZ-003` |
| `TC-FZ-VIS-03` | Desktop/Tablet | 결과 버튼 그룹이 crop 없이 보인다. | `REQ-FZ-004` |
| `TC-FZ-VIS-04` | Desktop/Tablet | focus target이 `PreviewChrome` frame 안에서 읽기 어렵게 잘리지 않는다. | `REQ-FZ-013` |

---

## 5. Release Evidence

| TC | 검증 | REQ |
|---|---|---|
| `TC-FZ-REL-01` | release checklist에 desktop/tablet/mobile/reduced-motion 확인 결과를 기록한다. | `REQ-FZ-016` |
| `TC-FZ-REL-02` | `package.json` diff에서 새 animation dependency가 없음을 확인한다. | `REQ-FZ-016` |
| `TC-FZ-REL-03` | `pnpm run typecheck`, targeted tests, build 결과를 기록한다. | `REQ-FZ-016` |

---

## 6. Suggested Commands

```bash
pnpm run typecheck
pnpm run test -- dashboard-preview
pnpm run build
```

Browser evidence는 desktop, tablet, mobile viewport를 각각 확인한다. 이 feature는 시각 품질이 중요하므로 자동 테스트만으로 release-ready를 선언하지 않는다.
