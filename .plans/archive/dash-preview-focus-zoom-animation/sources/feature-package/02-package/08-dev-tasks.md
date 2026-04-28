# Dev Tasks: dash-preview-focus-zoom-animation

> **Feature**: Dash Preview Focus Zoom Animation
> **Requirements SSOT**: `01-requirements.md`
> **Test Cases**: `09-test-cases.md`
> **Created**: 2026-04-28

---

## 0. 이 문서의 역할

이 문서는 `/dev-run`에서 실행할 수 있는 구현 단위 TASK 목록이다. 각 TASK는 요구사항과 테스트 케이스를 연결한다.

---

## M1. Metadata Foundation

| TASK | 목표 | 주요 파일 | REQ | TC |
|---|---|---|---|---|
| `T-FZ-M1-01` | focus phase metadata 정의 | `src/lib/preview-steps.ts` 또는 `src/lib/preview-focus.ts` | `REQ-FZ-001`, `REQ-FZ-007` | `TC-FZ-UNIT-01` |
| `T-FZ-M1-02` | desktop/tablet preset 구조 분리 | focus metadata file | `REQ-FZ-008` | `TC-FZ-UNIT-03` |
| `T-FZ-M1-03` | step duration 안에서 focus timing이 완료되도록 validation 추가 | focus metadata file | `REQ-FZ-014` | `TC-FZ-UNIT-04` |

완료 게이트:

- 모든 step이 focus mapping을 가진다.
- mobile preset은 만들지 않는다.
- timing validation이 실패 케이스를 잡는다.

---

## M2. Focus Viewport UI

| TASK | 목표 | 주요 파일 | REQ | TC |
|---|---|---|---|---|
| `T-FZ-M2-01` | `AI_INPUT` 입력창 focus 적용 | `dashboard-preview.tsx`, `preview-chrome.tsx` | `REQ-FZ-002`, `REQ-FZ-013` | `TC-FZ-VIS-01`, `TC-FZ-VIS-04` |
| `T-FZ-M2-02` | `AI_EXTRACT` 추출 버튼 focus 적용 | `dashboard-preview.tsx`, `preview-chrome.tsx` | `REQ-FZ-003`, `REQ-FZ-013` | `TC-FZ-VIS-02`, `TC-FZ-VIS-04` |
| `T-FZ-M2-03` | result group focus 적용 | `dashboard-preview.tsx`, `preview-chrome.tsx` | `REQ-FZ-004`, `REQ-FZ-013` | `TC-FZ-VIS-03`, `TC-FZ-VIS-04` |
| `T-FZ-M2-04` | crop safe area와 transform composition 정리 | `preview-chrome.tsx` | `REQ-FZ-013` | `TC-FZ-VIS-04` |

완료 게이트:

- base scale과 focus transform 책임이 분리된다.
- Desktop/Tablet screenshot에서 target이 잘리지 않는다.

---

## M3. AI_APPLY Click-to-card Loop

| TASK | 목표 | 주요 파일 | REQ | TC |
|---|---|---|---|---|
| `T-FZ-M3-01` | `AI_APPLY` 4개 sub-phase 구현 | focus metadata file, `dashboard-preview.tsx` | `REQ-FZ-005` | `TC-FZ-INT-01` |
| `T-FZ-M3-02` | result item과 form card target 1:1 mapping 구현 | `ai-register-main/**` if marker needed, focus metadata file | `REQ-FZ-006` | `TC-FZ-UNIT-02` |

완료 게이트:

- 상차지 → 하차지 → 화물 정보 → 운임 순서가 metadata와 UI에서 일치한다.
- 실제 입력 기능으로 scope가 확장되지 않는다.

---

## M4. Regression and Accessibility

| TASK | 목표 | 주요 파일 | REQ | TC |
|---|---|---|---|---|
| `T-FZ-M4-01` | mobile preservation regression | `dashboard-preview.test.tsx`, `mobile-card-view.tsx` read-only | `REQ-FZ-009` | `TC-FZ-INT-02` |
| `T-FZ-M4-02` | reduced motion fallback | `dashboard-preview.tsx`, `motion.ts` | `REQ-FZ-010` | `TC-FZ-A11Y-01` |
| `T-FZ-M4-03` | `StepIndicator`/`goToStep` regression | `dashboard-preview.test.tsx`, `step-indicator.test.tsx` | `REQ-FZ-011` | `TC-FZ-INT-03` |
| `T-FZ-M4-04` | `InteractiveOverlay` 좌표 regression | `interactive-overlay.test.tsx`, `hit-areas.test.ts` | `REQ-FZ-012` | `TC-FZ-INT-04` |
| `T-FZ-M4-05` | decorative layer accessibility 처리 | `a11y.test.tsx` | `REQ-FZ-015` | `TC-FZ-A11Y-02` |

완료 게이트:

- `MobileCardView`는 변경되지 않는다.
- interactive mode에서 focus viewport가 좌표를 흔들지 않는다.
- reduced motion에서 의미는 유지되고 큰 이동만 제거된다.

---

## M5. QA Evidence and Release Prep

| TASK | 목표 | 주요 파일 | REQ | TC |
|---|---|---|---|---|
| `T-FZ-M5-01` | release checklist와 screenshot evidence 채우기 | `10-release-checklist.md`, evidence folder if used | `REQ-FZ-016` | `TC-FZ-REL-01` |

완료 게이트:

- targeted tests 통과.
- desktop/tablet/mobile screenshot 또는 browser spot check 기록.
- `package.json` dependency diff 없음.

---

## Recommended Execution Order

1. `T-FZ-M1-01`~`T-FZ-M1-03`
2. `T-FZ-M2-01`~`T-FZ-M2-04`
3. `T-FZ-M3-01`~`T-FZ-M3-02`
4. `T-FZ-M4-01`~`T-FZ-M4-05`
5. `T-FZ-M5-01`
