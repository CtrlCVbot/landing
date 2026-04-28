# Dev Output Summary: dash-preview-focus-zoom-animation

> **Feature**: Dash Preview Focus Zoom Animation
> **Branch**: `codex/dash-preview-focus-zoom-animation`
> **Implementation commits**: `09efc86`, `bf24663`
> **Current decision update**: `4/5` fixed preview height ratio confirmed by user
> **Status**: Dev implementation verified, ready for `/plan-archive`

---

## 1. Implementation Summary

`dash-preview`의 단계별 focus zoom animation을 구현했다.

핵심 결과:

1. `AI_INPUT`, `AI_EXTRACT`, `AI_APPLY` 단계에 target-only focus 표현을 적용했다.
2. `AI_APPLY`는 추출정보와 입력 카드가 하나의 phase event로 진행되도록 정리했다.
3. `US-FZ-003` 흐름은 상차지, 하차지, 예상 운임/거리, 화물 정보, 운임/정산 순서로 연결된다.
4. Mobile은 `US-FZ-004` 기준에 따라 기존 `MobileCardView`를 유지한다.
5. `dash-preview` frame은 `fixed-height-reduced`로 고정하고, content height는 `1040px * 4 / 5 = 832px`를 사용한다.

---

## 2. Changed Runtime Areas

| 영역 | 파일 | 결과 |
| --- | --- | --- |
| Step metadata | `src/lib/preview-steps.ts` | `AI_APPLY` phase order와 focus target metadata 확장 |
| Preview shell | `src/components/dashboard-preview/dashboard-preview.tsx` | phase index 기반 focus orchestration 적용 |
| Preview frame | `src/components/dashboard-preview/preview-chrome.tsx` | target-only focus CSS, `4/5` fixed height ratio 적용 |
| AI panel | `src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx` | result item press/focus target 연동 |
| Form panel | `src/components/dashboard-preview/ai-register-main/order-form/index.tsx` | current target card 중심 fill/focus 적용 |

---

## 3. Test and Verification Summary

| 검증 | 결과 | 메모 |
| --- | --- | --- |
| Focus and dashboard preview tests | PASS | `43 tests passed` |
| Dashboard-preview full suite | PASS | `36 files / 559 tests passed` |
| Typecheck | PASS | `npm run typecheck` exit 0 |
| Build | PASS | `npm run build` exit 0, 기존 warning만 남음 |
| Browser DOM | PASS | `inlineHeight: 374.4px`, `innerHeight: 832px` |

Known warnings:

- Existing React `act(...)` warnings in a11y tests
- Existing unused variable lint warnings in tests
- Existing `use-focus-walk.ts` hook dependency warning
- Existing Next.js multi-lockfile workspace root warning

---

## 4. Traceability

| Requirement / Test | Status | Evidence |
| --- | --- | --- |
| `REQ-FZ-001` focus phase metadata | done | `preview-steps.ts`, preview chrome tests |
| `REQ-FZ-005` / `US-FZ-003` apply sequence | done | dashboard preview tests |
| `REQ-FZ-009` / `US-FZ-004` mobile preservation | done | mobile branch tests |
| `TC-FZ-VIS-01~04` target-only visual behavior | done | preview chrome tests + DOM evidence |
| `TC-FZ-REL-01` release checklist | done | `02-package/10-release-checklist.md` |

---

## 5. Archive Handoff

`/plan-archive` 진행 시 포함해야 할 source set:

- `.plans/ideas/20-approved/IDEA-20260427-003.md`
- `.plans/ideas/20-approved/SCREENING-20260427-003.md`
- `.plans/drafts/dash-preview-focus-zoom-animation/**`
- `.plans/features/active/dash-preview-focus-zoom-animation/**`
- `.plans/ideas/backlog.md`의 `IDEA-20260427-003` row/history update
- `.plans/ideas/screening-matrix.md`의 `IDEA-20260427-003` row update

권장 archive key:

```text
FZ
```

권장 archive bundle:

```text
.plans/archive/dash-preview-focus-zoom-animation/ARCHIVE-FZ.md
```
