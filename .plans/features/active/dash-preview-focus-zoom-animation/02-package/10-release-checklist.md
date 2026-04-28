# Release Checklist: dash-preview-focus-zoom-animation

> **Feature**: Dash Preview Focus Zoom Animation
> **Requirements SSOT**: `01-requirements.md`
> **Dev Tasks**: `08-dev-tasks.md`
> **Test Cases**: `09-test-cases.md`
> **Created**: 2026-04-28
> **Updated**: 2026-04-28
> **Implementation branch**: `codex/dash-preview-focus-zoom-animation`

---

## 0. 문서 역할

이 체크리스트는 구현 완료 후 `release-ready` 판단을 위한 증거 기록지다.
체크박스는 실제 명령 실행, 테스트 결과, browser screenshot 확인을 기준으로 채웠다.

---

## 1. Scope Gate

| 항목 | 기준 | 결과 |
|---|---|---|
| Mobile preservation | `src/components/dashboard-preview/mobile-card-view.tsx` 변경 없음 | [x] |
| Hero layout | `src/components/sections/hero.tsx` 변경 없음 | [x] |
| Dependency | 새 animation dependency 없음 | [x] |
| API/DB | API, DB, auth, analytics 변경 없음 | [x] |
| Feature pocket | 변경 범위가 `dashboard-preview` 컴포넌트와 `preview-steps` 메타데이터 중심 | [x] |

Scope 확인 근거:

- `git diff --name-only main...HEAD -- src/components/dashboard-preview/mobile-card-view.tsx src/components/sections/hero.tsx package.json package-lock.json src/lib/motion.ts`
- 위 명령 결과에서 mobile, hero, dependency, shared motion 파일 변경 없음.

---

## 2. Functional Gate

| 항목 | 기준 | TC | 결과 |
|---|---|---|---|
| Focus metadata coverage | 모든 preview step에 focus phase 존재 | `TC-FZ-UNIT-01` | [x] |
| `AI_INPUT` focus | 카톡 텍스트 입력창이 focus target | `TC-FZ-VIS-01` | [x] |
| `AI_EXTRACT` focus | 추출하기 버튼 focus target | `TC-FZ-VIS-02` | [x] |
| Result group focus | 추출 결과 group focus target | `TC-FZ-VIS-03` | [x] |
| `US-FZ-003` 4단계 | 상차지 -> 하차지 -> 화물 정보 -> 운임 순환 | `TC-FZ-INT-01` | [x] |
| Target mapping | result item과 입력 card target 1:1 mapping | `TC-FZ-UNIT-02` | [x] |

구현 확인:

- `AI_APPLY_FOCUS_PAIRS`가 `departure`, `destination`, `cargo`, `fare` 순서를 고정한다.
- 추출정보 클릭 시 해당 입력 카드 focus로 이동하고, 다음 추출정보 focus로 복귀한다.
- 마지막 `fare` 입력 카드에서는 다음 result target으로 넘기지 않고 유지한다.

---

## 3. Regression Gate

| 항목 | 기준 | TC | 결과 |
|---|---|---|---|
| Mobile | 기존 `MobileCardView` 유지 | `TC-FZ-INT-02` | [x] |
| StepIndicator | 클릭 시 step/focus 이동 정상 | `TC-FZ-INT-03` | [x] |
| InteractiveOverlay | hit-area, tooltip, execute 흐름 유지 | `TC-FZ-INT-04` | [x] |
| Reduced motion | pan/zoom 없이 fallback focus 유지 | `TC-FZ-A11Y-01` | [x] |
| Accessibility layer | focus highlight layer가 screen reader noise를 만들지 않음 | `TC-FZ-A11Y-02` | [x] |

Regression 확인 근거:

- `npm run test -- dashboard-preview` 통과.
- `npm run test -- src/__tests__/lib/preview-steps.test.ts src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/flow.test.tsx` 통과.
- Reduced motion은 `preview-chrome.test.tsx`, `dashboard-preview.test.tsx`에서 자동 검증.

---

## 4. Visual Evidence Gate

| Viewport | 확인 항목 | 결과 |
|---|---|---|
| Desktop | input, extract, apply 화면에서 crop 없음 | [x] |
| Tablet | apply 화면에서 crop 없음 | [x] |
| Mobile | 기존 `MobileCardView` 유지 | [x] |
| Reduced motion | highlight-only fallback 자동 테스트 통과 | [x] |

Evidence 경로:

| Evidence | 경로 |
|---|---|
| Desktop input screenshot | `output/playwright/dash-preview-focus-zoom-animation/desktop-ai-input.png` |
| Desktop extract screenshot | `output/playwright/dash-preview-focus-zoom-animation/desktop-ai-extract.png` |
| Desktop apply screenshot | `output/playwright/dash-preview-focus-zoom-animation/desktop-ai-apply.png` |
| Tablet apply screenshot | `output/playwright/dash-preview-focus-zoom-animation/tablet-ai-apply.png` |
| Mobile screenshot | `output/playwright/dash-preview-focus-zoom-animation/mobile-card-view.png` |
| Reduced motion check | `npm run test -- src/components/dashboard-preview/__tests__/preview-chrome.test.tsx src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx` |

Visual feedback 반영:

| 항목 | Severity | Confidence | Action | 메모 |
|---|---|---|---|---|
| 왼쪽 패널 focus offset이 화면 밖으로 치우칠 수 있음 | high | confirmed | auto-fixed | negative `x` 값을 positive offset으로 보정하고 screenshot 재캡처 |

---

## 5. Command Gate

이번 worktree는 `npm ci` 이후 `npm run` 기준으로 검증했다.

| 명령 | 기대 결과 | 결과 |
|---|---|---|
| `npm run test -- src/components/dashboard-preview/__tests__/preview-chrome.test.tsx src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx src/__tests__/lib/preview-steps.test.ts` | 관련 focus 테스트 통과 | [x] 3 files, 76 tests passed |
| `npm run test -- src/__tests__/lib/preview-steps.test.ts src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/flow.test.tsx` | US-FZ-003 mapping 테스트 통과 | [x] 91 tests passed |
| `npm run test -- dashboard-preview` | dash-preview 관련 회귀 테스트 통과 | [x] 36 files, 549 tests passed |
| `npm run typecheck` | exit 0 | [x] |
| `npm run build` | exit 0 | [x] |
| `git diff --check` | whitespace error 없음 | [x] |
| `Invoke-WebRequest http://127.0.0.1:3102` | dev server 200 응답 | [x] |
| `npx --yes playwright screenshot ...` | desktop/tablet/mobile evidence 생성 | [x] |

Build warning 기록:

- `npm run build`는 성공했지만 기존 lint warning이 남아 있다.
- `ai-result-buttons.test.tsx`의 `_groupId`, `dashboard-preview.test.tsx` 및 legacy test의 `_rest` unused warning.
- `use-focus-walk.ts`의 hook dependency warning.
- Next.js workspace root inference warning: 상위 `pnpm-lock.yaml`과 현재 `package-lock.json`이 함께 감지됨.

---

## 6. Release Decision

| 판단 항목 | 상태 |
|---|---|
| 기능 요구사항 충족 | [x] |
| regression risk 해소 | [x] |
| visual evidence 확보 | [x] |
| 검증 명령 통과 | [x] |
| release-ready | [x] |

남은 리스크:

| 항목 | 수준 | 대응 |
|---|---|---|
| Browser visual quality 최종 취향 조정 가능성 | low | screenshot evidence 기준 통과, PM visual approval에서 미세 조정 가능 |
| 기존 lint warning | low | 이번 feature 범위 밖. build 통과 상태로 기록 |
| multiple lockfile warning | low | 기존 workspace 구성 이슈로 기록. 이번 feature dependency 변경 없음 |
