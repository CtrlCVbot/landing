# Archive: Dash Preview Focus Zoom Animation

> **Key**: FZ | **Slug**: `dash-preview-focus-zoom-animation` | **IDEA**: IDEA-20260427-003
> **Category**: Lite | **RICE Score**: 73.8 (Go) | **Archived**: 2026-04-28
> **Code Location**: `src/components/dashboard-preview/**`, `src/lib/preview-steps.ts`, `src/lib/motion.ts`
> **Pipeline**: Idea -> Screening -> Draft -> PRD -> Review -> Dev Feature -> Dev -> Verify -> Archive
> **Branch**: `codex/dash-preview-focus-zoom-animation`

---

## 1. Summary

`dash-preview` 자동 재생 데모에 단계별 target-only focus zoom animation을 적용했다. 전체 내부 컴포넌트를 이동시키는 방식은 줄이고, 고정된 preview frame 안에서 현재 이벤트와 연결된 target card 또는 button만 확대되도록 정리했다.

최종 구현 기준:

- `AI_INPUT`과 `AI_EXTRACT`는 카톡 입력창, 추출 버튼, 추출 결과 영역을 순서대로 focus한다.
- `AI_APPLY`는 추출정보 클릭과 입력 카드 focus를 하나의 phase event로 통합한다.
- 하차지 입력 후 예상 운임/거리 카드가 focus되고, 마지막 운임 정보는 정산 정보 카드에 입력된다.
- `PreviewChrome` height는 사용자 확인 기준인 `1040px * 4 / 5 = 832px` content height로 고정한다.
- Mobile은 `US-FZ-004` 기준대로 기존 `MobileCardView`를 유지한다.

## 2. Source File Manifest

| Original path | Archived path | Type |
|---|---|---|
| `.plans/ideas/20-approved/IDEA-20260427-003.md` | `sources/ideas/IDEA-20260427-003.md` | IDEA |
| `.plans/ideas/20-approved/SCREENING-20260427-003.md` | `sources/ideas/SCREENING-20260427-003.md` | Screening |
| `.plans/drafts/dash-preview-focus-zoom-animation/` | `sources/drafts/` | Draft / PRD / Review / Routing |
| `.plans/features/active/dash-preview-focus-zoom-animation/` | `sources/feature-package/` | Feature Package / Dev Notes |

## 3. Implementation Result

| Area | Result | Main evidence |
|---|---|---|
| Focus metadata | `AI_APPLY` subphase order and target mapping added | `src/lib/preview-steps.ts` |
| Preview frame | Fixed reduced frame with `4/5` content height restored | `src/components/dashboard-preview/preview-chrome.tsx` |
| Animation behavior | Result click and card fill/focus unified per target | `dashboard-preview.tsx`, `ai-register-main/**` |
| Highlight cleanup | Column/full-row highlight effect reduced for apply flow | dashboard-preview tests |
| Mobile preservation | Mobile path still returns `MobileCardView` | dashboard-preview tests |

Implementation commits:

| Commit | Purpose |
|---|---|
| `09efc86` | Focus zoom 단계 애니메이션 구현 |
| `bf24663` | Preview height 축소 기준 보정 시도 |
| `fb3afb7` | 사용자 확인 기준인 `4/5` height 복원 및 dev 산출물 반영 |

## 4. Verification Evidence

| Check | Result | Evidence |
|---|---|---|
| Dashboard-preview full suite | PASS | `npm run test -- dashboard-preview` -> 36 files / 559 tests passed |
| Target focus tests | PASS | `preview-chrome.test.tsx`, `dashboard-preview.test.tsx` included in full suite |
| Typecheck | PASS | `npm run typecheck` -> `tsc --noEmit` exit 0 |
| Build | PASS with warnings | `npm run build` completed successfully |
| Browser DOM | PASS | `data-camera-frame="fixed-height-reduced"`, `inlineHeight: 374.4px`, `innerHeight: 832px` |
| Diff whitespace | PASS | `git diff --check` completed with CRLF warnings only |

Known warnings:

- Existing React `act(...)` warnings in dashboard a11y tests.
- Existing unused variable lint warnings in dashboard test files.
- Existing `use-focus-walk.ts` hook dependency warning.
- Existing Next.js multi-lockfile workspace-root warning.

## 5. Traceability

| Requirement / Test | Status | Evidence |
|---|---|---|
| `REQ-FZ-001` focus phase metadata | done | `preview-steps.ts`, preview chrome tests |
| `REQ-FZ-005` / `US-FZ-003` apply sequence | done | dashboard preview tests |
| `REQ-FZ-009` / `US-FZ-004` mobile preservation | done | mobile branch tests |
| `TC-FZ-INT-05` | done | departure -> pickup -> destination -> delivery -> estimate -> cargo -> settlement flow |
| `TC-FZ-VIS-01~04` | done | target-only focus behavior and fixed reduced height tests |
| `TC-FZ-REL-01` | done | `sources/feature-package/02-package/10-release-checklist.md` |

## 6. Archive Notes

- This is a Lite lane feature, so `/plan-bridge` was intentionally skipped.
- No API, DB migration, or package dependency change was introduced.
- The active feature package and drafts were moved into `sources/` with `git mv`.
- Future changes should be tracked as `/plan-improve dash-preview-focus-zoom-animation "..."`
