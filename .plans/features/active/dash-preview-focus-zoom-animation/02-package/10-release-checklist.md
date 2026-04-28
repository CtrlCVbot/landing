# Release Checklist: dash-preview-focus-zoom-animation

> **Feature**: Dash Preview Focus Zoom Animation
> **Requirements SSOT**: `01-requirements.md`
> **Dev Tasks**: `08-dev-tasks.md`
> **Test Cases**: `09-test-cases.md`
> **Updated**: 2026-04-28
> **Implementation branch**: `codex/dash-preview-focus-zoom-animation`

---

## 0. Purpose

이 체크리스트는 `dash-preview` focus zoom animation 구현 후 `release-ready` 판단을 위한 증거 기록이다.
판정 기준은 실제 코드 변경, 테스트 결과, 브라우저 스크린샷, 남은 리스크다.

---

## 1. Scope Gate

| 항목 | 기준 | 결과 |
| --- | --- | --- |
| Mobile preservation | `MobileCardView` 구현 변경 없음 | [x] |
| Hero layout | landing hero 구조 변경 없음 | [x] |
| Dependency | animation dependency 추가 없음 | [x] |
| API/DB | API, DB, auth, analytics 변경 없음 | [x] |
| Feature boundary | `dashboard-preview` 컴포넌트와 `preview-steps` metadata 중심 변경 | [x] |

확인 근거:

- `src/components/dashboard-preview/mobile-card-view.tsx`는 변경하지 않았다.
- `package.json`, `package-lock.json` 변경 없음.
- 변경 범위는 `src/components/dashboard-preview/**`, `src/lib/preview-steps.ts`, 관련 테스트, 본 체크리스트로 한정했다.

---

## 2. Functional Gate

| 항목 | 기준 | TC | 결과 |
| --- | --- | --- | --- |
| Fixed camera frame | `dash-preview` 외부 프레임은 고정되고 내부 content만 이동/확대 | `TC-FZ-VIS-01~03` | [x] |
| Slower animation | 기존 대비 약 2배 느린 duration과 focus hold 적용 | `TC-FZ-UNIT-01` | [x] |
| `AI_INPUT` focus | 카톡 텍스트 입력창으로 camera focus | `TC-FZ-VIS-01` | [x] |
| `AI_EXTRACT` focus | 추출하기 버튼으로 camera focus | `TC-FZ-VIS-02` | [x] |
| `US-FZ-003` 4단계 | 상차지 -> 하차지 -> 화물 정보 -> 운임 순서 | `TC-FZ-INT-01` | [x] |
| Result-to-card loop | 추출 정보 -> 입력 카드 -> 다음 추출 정보 반복 | `TC-FZ-INT-01` | [x] |
| Mobile preservation | 모바일은 기존 카드 뷰 유지 | `TC-FZ-INT-02` | [x] |

구현 확인:

- `AI_APPLY` focus path가 `ai-result-departure -> form-pickup-location -> ai-result-destination -> form-delivery-location -> ai-result-cargo -> form-cargo-info -> ai-result-fare -> form-estimate-info` 순서로 자동 진행된다.
- `AI_APPLY_FOCUS_PHASE_HOLD_MS = 1800`으로 result/card 사이 전환을 느리게 유지한다.
- `ScaledContent`에 `data-camera-frame="fixed"`와 `aspect-ratio: 16 / 9`를 적용해 외부 프레임 크기를 고정했다.
- 내부 content는 `FocusViewport` transform으로 이동/확대되어 카메라가 움직이는 방식으로 보인다.

---

## 3. Visual Evidence Gate

| Viewport | 확인 항목 | 결과 |
| --- | --- | --- |
| Desktop | input, extract, apply subphase에서 frame crop 없이 focus 이동 | [x] |
| Tablet | apply fare card focus에서 frame 유지 | [x] |
| Mobile | 기존 `MobileCardView` 유지 | [x] |

Evidence 경로:

| Evidence | Path |
| --- | --- |
| Desktop input | `output/playwright/dash-preview-focus-zoom-animation/desktop-ai-input.png` |
| Desktop extract | `output/playwright/dash-preview-focus-zoom-animation/desktop-ai-extract.png` |
| Desktop departure card | `output/playwright/dash-preview-focus-zoom-animation/desktop-ai-apply-departure-card.png` |
| Desktop destination result | `output/playwright/dash-preview-focus-zoom-animation/desktop-ai-apply-destination-result.png` |
| Desktop cargo card | `output/playwright/dash-preview-focus-zoom-animation/desktop-ai-apply-cargo-card.png` |
| Desktop fare card | `output/playwright/dash-preview-focus-zoom-animation/desktop-ai-apply-fare-card.png` |
| Tablet fare card | `output/playwright/dash-preview-focus-zoom-animation/tablet-ai-apply-fare-card.png` |
| Mobile card view | `output/playwright/dash-preview-focus-zoom-animation/mobile-card-view.png` |

Visual feedback 반영:

| 항목 | Severity | Confidence | Action | 메모 |
| --- | --- | --- | --- | --- |
| `AI_APPLY` result/card 반복이 부족함 | high | confirmed | auto-fixed | 4개 category 모두 result -> card -> next result 흐름으로 자동 진행 |
| animation 속도가 빠름 | medium | confirmed | auto-fixed | step duration, focus duration, partialBeat interval, typing duration 확대 |
| dash-preview가 zoom 대상에 따라 자체 크기가 바뀌면 안 됨 | high | confirmed | auto-fixed | fixed camera frame + inner transform 구조로 변경 |
| 모바일 변경 금지 | high | confirmed | preserved | `MobileCardView` 미수정, 모바일 screenshot 확인 |

---

## 4. Command Gate

| 명령 | 기대 결과 | 결과 |
| --- | --- | --- |
| `npm run test -- src/__tests__/lib/preview-steps.test.ts src/components/dashboard-preview/__tests__/preview-chrome.test.tsx src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/flow.test.tsx` | focus metadata와 핵심 흐름 통과 | [x] 4 files, 98 tests passed |
| `npm run test -- src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/index.test.tsx src/components/dashboard-preview/ai-register-main/order-form/__tests__/flow.test.tsx src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx` | 느려진 timeline 회귀 통과 | [x] 3 files, 124 tests passed |
| `npm run test -- dashboard-preview` | dash-preview 전체 test 통과 | [x] 36 files, 551 tests passed |
| `npm run typecheck` | exit 0 | [x] |
| `npm run build` | exit 0 | [x] |
| `git diff --check` | whitespace error 없음 | [x] CRLF 변환 경고만 발생 |
| `Invoke-WebRequest http://127.0.0.1:3102/?dashV3=1` | dev server 200 응답 | [x] |
| `npx --yes playwright screenshot ...` | desktop/tablet/mobile evidence 생성 | [x] |

Build warning 기록:

- `npm run build`는 성공했지만 기존 lint warning이 남아 있다.
- 기존 warning: `_groupId`, `_rest` unused, `use-focus-walk.ts` hook dependency warning.
- Next.js workspace root inference warning은 기존 multi-lockfile 구성에서 발생한다.

---

## 5. Release Decision

| 판단 항목 | 상태 |
| --- | --- |
| 기능 요구사항 충족 | [x] |
| regression risk 해소 | [x] |
| visual evidence 확보 | [x] |
| 검증 명령 통과 | [x] |
| release-ready | [x] |

남은 리스크:

| 항목 | 수준 | 대응 |
| --- | --- | --- |
| 기존 lint warning | low | 이번 feature 범위 밖으로 기록만 유지 |
| 기존 multi-lockfile warning | low | dependency 변경 없음, build 성공 상태로 기록 |
| visual taste tuning 가능성 | low | 현재 evidence 기준 통과, PM 취향 조정은 후속 개선으로 분리 가능 |
