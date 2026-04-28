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
| Fixed normal frame | `dash-preview` 외부 프레임은 내부 전체 컴포넌트의 정상 사이즈에 맞춰 고정 | `TC-FZ-VIS-01~03` | [x] |
| Target-only focus | 내부 전체 컴포넌트는 이동하지 않고 관계된 target만 확대/강조 | `TC-FZ-VIS-01~03` | [x] |
| Taller preview frame | 내부 3-column component가 잘리지 않도록 원본 900px 높이 기준으로 frame 확대 | `TC-FZ-VIS-01~03` | [x] |
| Directional anchor | 오른쪽 운임/거리/정산 target은 오른쪽 기준으로 왼쪽 방향 확대 | `TC-FZ-VIS-03` | [x] |
| Slower animation | 기존 대비 약 2배 느린 duration과 focus hold 적용 | `TC-FZ-UNIT-01` | [x] |
| `AI_INPUT` focus | 카톡 텍스트 입력창으로 camera focus | `TC-FZ-VIS-01` | [x] |
| `AI_EXTRACT` focus | 추출하기 버튼으로 camera focus | `TC-FZ-VIS-02` | [x] |
| `US-FZ-003` 4단계 | 상차지 -> 하차지 -> 화물 정보 -> 운임 순서 | `TC-FZ-INT-01` | [x] |
| Result-to-card loop | 추출 정보 -> 입력 카드 -> 다음 추출 정보 반복 | `TC-FZ-INT-01` | [x] |
| Mobile preservation | 모바일은 기존 카드 뷰 유지 | `TC-FZ-INT-02` | [x] |

구현 확인:

- `AI_APPLY` focus path가 `ai-result-departure -> form-pickup-location -> ai-result-destination -> form-delivery-location -> form-estimate-info -> ai-result-cargo -> form-cargo-info -> ai-result-fare -> form-settlement` 순서로 자동 진행된다.
- `AI_APPLY_FOCUS_PHASE_HOLD_MS = 2000`으로 result/card 사이 전환을 느리게 유지하고, subphase scale duration은 `1800ms`로 둔다.
- `ScaledContent`에 `data-camera-frame="fixed-height-reduced"`와 content height `832px` 기준 frame height를 적용해 focus target과 무관하게 frame 높이를 고정했다.
- 내부 전체 content는 base scale만 유지하고 `FocusViewport` transform은 `none`으로 고정했다.
- `preview-content`와 `AiRegisterMain` shell도 `h-full` / `min-h-[900px]` 기준으로 맞춰 frame 내부 빈 공간과 하단 잘림을 줄였다.
- focus zoom은 `[data-hit-area-id="..."]` target selector에만 `scale(...)`을 적용해 글자 깨짐과 전체 화면 이동감을 줄였다.
- 좌측 AI panel target은 `top left` 기준 + 최대 `1.1` scale로 제한해 오른쪽 화면을 덮는 정도를 줄였다.
- 우측 fare/distance/settlement target은 `top right` 기준 + 최대 `1.08` scale로 제한해 카드가 왼쪽 방향으로 확대되게 했다.

---

### 2.1 Unified Event Follow-up

| 항목 | 상태 | 근거 |
| --- | --- | --- |
| AI panel expansion | [x] | `focusTargetId`가 AI panel target이면 shell `min-h-[1040px]`, panel `w-[440px]`로 확장 |
| Fixed reduced preview height | [x] | 이전 최대 content height `1040px`에 `4/5` 비율을 적용한 `832px` 고정 height 적용 |
| Estimate auto phase | [x] | 하차지 카드 후 `form-estimate-info` 자동 focus |
| Settlement final phase | [x] | 운임 정보 클릭 후 `form-settlement` focus/fill |
| Unnecessary highlight cleanup | [x] | focus-driven `AI_APPLY`에서 column pulse와 full-frame highlight 비활성화 |

## 3. Visual Evidence Gate

| Viewport | 확인 항목 | 결과 |
| --- | --- | --- |
| Desktop | input, extract, apply subphase에서 전체 내부 layout 고정 + target-only 확대 | [x] |
| Desktop | 고정 축소 height에서도 focus 단계별 frame 높이 유지 | [x] |
| Tablet | apply fare card focus에서 오른쪽 기준 target-only 확대 | [x] |
| Mobile | 기존 `MobileCardView` 유지 | [x] |

Evidence 경로:

| Evidence | Path |
| --- | --- |
| Desktop input | `output/playwright/dash-preview-focus-zoom-animation/desktop-target-only-ai-input.png` |
| Desktop extract | `output/playwright/dash-preview-focus-zoom-animation/desktop-target-only-ai-extract.png` |
| Desktop departure card | `output/playwright/dash-preview-focus-zoom-animation/desktop-target-only-departure-card.png` |
| Desktop fare card | `output/playwright/dash-preview-focus-zoom-animation/desktop-target-only-fare-card.png` |
| Tablet fare card | `output/playwright/dash-preview-focus-zoom-animation/tablet-target-only-fare-card.png` |
| Mobile card view | `output/playwright/dash-preview-focus-zoom-animation/mobile-target-only-card-view.png` |
| Desktop taller input | `output/playwright/dash-preview-focus-zoom-animation/desktop-height-ai-input-autoplay.png` |
| Desktop right-anchor fare | `output/playwright/dash-preview-focus-zoom-animation/desktop-autoplay-right-anchor-fare-card.png` |
| Tablet right-anchor fare | `output/playwright/dash-preview-focus-zoom-animation/tablet-autoplay-right-anchor-fare-card.png` |
| Mobile preserved | `output/playwright/dash-preview-focus-zoom-animation/mobile-preserved-card-view.png` |
| Desktop filled height input | `output/playwright/dash-preview-focus-zoom-animation/desktop-filled-height-ai-input.png` |
| Desktop filled right-anchor fare | `output/playwright/dash-preview-focus-zoom-animation/desktop-filled-right-anchor-fare-card.png` |
| Tablet filled right-anchor fare | `output/playwright/dash-preview-focus-zoom-animation/tablet-filled-right-anchor-fare-card.png` |
| Tablet filled fullpage | `output/playwright/dash-preview-focus-zoom-animation/tablet-filled-right-anchor-fare-card-fullpage.png` |
| Mobile latest preserved | `output/playwright/dash-preview-focus-zoom-animation/mobile-preserved-card-view-latest.png` |

Visual feedback 반영:

| 항목 | Severity | Confidence | Action | 메모 |
| --- | --- | --- | --- | --- |
| `AI_APPLY` result/card 반복이 부족함 | high | confirmed | auto-fixed | 4개 category 모두 result -> card -> next result 흐름으로 자동 진행 |
| animation 속도가 빠름 | medium | confirmed | auto-fixed | step duration, focus duration, partialBeat interval, typing duration 확대 |
| dash-preview 외부 프레임은 정상 내부 전체 사이즈 기준으로 고정 | high | confirmed | auto-fixed | normal-size fixed frame + base scale 구조로 변경 |
| 내부 전체 컴포넌트 이동으로 글자 깨짐 | high | confirmed | auto-fixed | `FocusViewport` transform 제거, target-only scale/highlight 적용 |
| preview height 부족으로 내부 컴포넌트가 잘림 | high | confirmed | auto-fixed | normal content height `480px` -> `900px`로 확대 |
| 왼쪽 AI panel focus가 오른쪽 화면을 덮음 | medium | likely | auto-fixed | edge-left target scale cap `1.1` 적용 |
| 오른쪽 fare/distance/settlement focus가 반대편을 침범함 | medium | likely | auto-fixed | right-edge target `transform-origin: top right`, scale cap `1.08` 적용 |
| 모바일 변경 금지 | high | confirmed | preserved | `MobileCardView` 미수정, 모바일 screenshot 확인 |

---

## 4. Command Gate

| 명령 | 기대 결과 | 결과 |
| --- | --- | --- |
| `npm run test -- src/__tests__/lib/preview-steps.test.ts src/components/dashboard-preview/__tests__/preview-chrome.test.tsx src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/flow.test.tsx` | focus metadata와 핵심 흐름 통과 | [x] 4 files, 98 tests passed |
| `npm run test -- src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/index.test.tsx src/components/dashboard-preview/ai-register-main/order-form/__tests__/flow.test.tsx src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx` | 느려진 timeline 회귀 통과 | [x] 3 files, 124 tests passed |
| `npm run test -- src/components/dashboard-preview/__tests__/preview-chrome.test.tsx src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx src/components/dashboard-preview/ai-register-main/__tests__/index.test.tsx src/__tests__/lib/preview-steps.test.ts` | target-only focus, fixed normal frame, right-anchor metadata, 900px shell 통과 | [x] 4 files, 87 tests passed |
| `npm run test -- dashboard-preview` | dash-preview 전체 test 통과 | [x] 36 files, 554 tests passed |
| `npm run typecheck` | exit 0 | [x] |
| `npm run build` | exit 0 | [x] |
| `git diff --check` | whitespace error 없음 | [x] CRLF 변환 경고만 발생 |
| `Invoke-WebRequest http://127.0.0.1:3102/?dashV3=1` | dev server 200 응답 | [x] |
| `npx --yes playwright screenshot ...` | desktop/tablet/mobile evidence 생성 | [x] |

Latest verification update:

| Command / evidence | Result |
| --- | --- |
| `npm run test -- src/__tests__/lib/preview-steps.test.ts src/components/dashboard-preview/__tests__/preview-chrome.test.tsx src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx src/components/dashboard-preview/ai-register-main/__tests__/index.test.tsx src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx` | [x] 5 files, 157 tests passed |
| `npm run typecheck` | [x] exit 0 |
| `npm run test -- dashboard-preview` | [x] 36 files, 559 tests passed |
| `npm run build` | [x] exit 0 after clearing stale `.next` cache |
| `git diff --check` | [x] whitespace error 없음, CRLF warning only |
| `http://127.0.0.1:3102/?dashV3=1` | [x] dev server 200 after restart |
| Playwright DOM/visual check | [x] AI panel expansion, 9-phase focus order, no column pulse, final settlement focus confirmed |

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
| target 확대 효과가 landing 전체 화면에서는 다소 절제되어 보임 | low | 글자 선명도와 layout 안정성을 우선한 의도적 차이, 필요 시 scale/outline만 후속 조정 |
| fixed reduced height로 일부 하단 영역이 덜 보일 수 있음 | low | 사용자 요청에 맞춰 frame height를 고정 축소, 필요 시 내부 spacing은 별도 튜닝 |

### Height Adjustment Update - 2026-04-28

- `PreviewChrome` frame height is fixed again with `data-camera-frame="fixed-height-reduced"`.
- The internal content height is `832px`, which applies the confirmed `4/5` ratio to the previous maximum `1040px` height.
- The visible outer frame height is `374.4px` on desktop scale `0.45` and `332.8px` on tablet scale `0.40`.
- Mobile remains unchanged because it still renders through `MobileCardView`.
