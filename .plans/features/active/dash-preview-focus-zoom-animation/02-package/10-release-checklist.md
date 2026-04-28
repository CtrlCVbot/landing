# Release Checklist: dash-preview-focus-zoom-animation

> **Feature**: Dash Preview Focus Zoom Animation
> **Requirements SSOT**: `01-requirements.md`
> **Dev Tasks**: `08-dev-tasks.md`
> **Test Cases**: `09-test-cases.md`
> **Created**: 2026-04-28

---

## 0. 이 문서의 역할

이 체크리스트는 구현 완료 후 release-ready 판정을 위한 증거 기록지다. 체크박스는 실제 명령 또는 browser 확인 후 채운다.

---

## 1. Scope Gate

| 항목 | 기준 | 결과 |
|---|---|---|
| Mobile preservation | `src/components/dashboard-preview/mobile-card-view.tsx` 변경 없음 | [ ] |
| Hero layout | `src/components/sections/hero.tsx` 변경 없음 | [ ] |
| Dependency | 새 animation dependency 없음 | [ ] |
| API/DB | API, DB, auth, analytics 변경 없음 | [ ] |
| Feature pocket | 변경이 `src/components/dashboard-preview/**`, `src/lib/preview-steps.ts`, `src/lib/motion.ts` 중심으로 제한됨 | [ ] |

---

## 2. Functional Gate

| 항목 | 기준 | TC | 결과 |
|---|---|---|---|
| Focus metadata coverage | 모든 step에 focus phase 있음 | `TC-FZ-UNIT-01` | [ ] |
| `AI_INPUT` focus | 입력창이 중심 target | `TC-FZ-VIS-01` | [ ] |
| `AI_EXTRACT` focus | 추출 버튼 강조 | `TC-FZ-VIS-02` | [ ] |
| Result group focus | 결과 버튼 group 표시 | `TC-FZ-VIS-03` | [ ] |
| `US-FZ-003` 4단계 | 상차지 → 하차지 → 화물 정보 → 운임 | `TC-FZ-INT-01` | [ ] |
| Target mapping | result item과 card target 1:1 | `TC-FZ-UNIT-02` | [ ] |

---

## 3. Regression Gate

| 항목 | 기준 | TC | 결과 |
|---|---|---|---|
| Mobile | `MobileCardView` 현행 유지 | `TC-FZ-INT-02` | [ ] |
| StepIndicator | 클릭 후 step/focus 이동 정상 | `TC-FZ-INT-03` | [ ] |
| InteractiveOverlay | hit-area, tooltip, execute 정상 | `TC-FZ-INT-04` | [ ] |
| Reduced motion | 큰 pan/zoom 없음 | `TC-FZ-A11Y-01` | [ ] |
| Accessibility layer | keyboard/screen reader noise 없음 | `TC-FZ-A11Y-02` | [ ] |

---

## 4. Visual Evidence Gate

| Viewport | 확인 항목 | 결과 |
|---|---|---|
| Desktop | input, extract, result, apply loop, crop 없음 | [ ] |
| Tablet | input, extract, result, apply loop, crop 없음 | [ ] |
| Mobile | 현행 `MobileCardView` 유지 | [ ] |
| Reduced motion | highlight-only 표현 | [ ] |

Evidence 경로가 생기면 여기에 링크를 추가한다.

| Evidence | 경로 |
|---|---|
| Desktop screenshot | TBD |
| Tablet screenshot | TBD |
| Mobile screenshot | TBD |
| Reduced motion check | TBD |

---

## 5. Command Gate

| 명령 | 기대 결과 | 결과 |
|---|---|---|
| `pnpm run typecheck` | exit 0 | [ ] |
| `pnpm run test -- dashboard-preview` | 관련 테스트 통과 | [ ] |
| `pnpm run build` | exit 0 | [ ] |
| `git diff --check` | whitespace issue 없음 | [ ] |

---

## 6. Release Decision

| 판정 항목 | 상태 |
|---|---|
| 기능 요구사항 충족 | [ ] |
| regression risk 해소 | [ ] |
| visual evidence 확보 | [ ] |
| 검증 명령 통과 | [ ] |
| release-ready | [ ] |

남은 리스크:

| 항목 | 수준 | 대응 |
|---|---|---|
| Browser visual quality는 구현 후 확인 필요 | medium | screenshot evidence로 판정 |
| focus scale/offset exact value 미정 | medium | desktop/tablet QA에서 조정 |
