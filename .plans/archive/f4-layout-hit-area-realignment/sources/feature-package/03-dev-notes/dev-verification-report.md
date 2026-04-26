# F4 Dev Verification Report

> 작성일: 2026-04-24
> 갱신일: 2026-04-27
> 대상: `.plans/features/active/f4-layout-hit-area-realignment/`
> 판정: PASS with warnings after D-F4-011

---

## 1. 검증 요약

| 항목 | 결과 | 근거 |
|---|---|---|
| Build | PASS with warnings | `pnpm build` exit 0, route `/` first load JS 165 kB |
| Typecheck | PASS | `pnpm typecheck` exit 0 |
| Lint | PASS with warnings | `pnpm lint` exit 0, 기존 ESLint/Next.js warning 출력 |
| Test | PASS with warnings | `pnpm test` exit 0, 45 files / 990 tests |
| Browser spot check | PASS | 1440/1024/768 viewport, 18 targets, max delta 0~0.1px |
| Scope Guard | PASS with note | `src/lib/mock-data.ts`, `tailwind.config.ts` F4 diff 없음 |

---

## 2. 실행 명령

| 순서 | 명령 | 결과 |
|---:|---|---|
| 1 | `pnpm test src/components/dashboard-preview/__tests__/interactive-overlay.test.tsx src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx src/components/dashboard-preview/__tests__/hit-areas.test.ts src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/index.test.tsx` | PASS |
| 2 | `pnpm typecheck` | PASS |
| 3 | `pnpm lint` | PASS |
| 4 | `pnpm test` | PASS |
| 5 | `pnpm build` | PASS |
| 6 | `git diff -- src/lib/mock-data.ts tailwind.config.ts package.json` | PASS for F4, `package.json` pre-existing dirty |
| 7 | `git diff --check -- .plans/features/active/f4-layout-hit-area-realignment .plans/epics/20-active/EPIC-20260422-001/01-children-features.md src/components/dashboard-preview` | PASS |
| 8 | Playwright browser spot check (`1440`, `1024`, `768`) | PASS |

---

## 3. Warning 분류

| Warning | 영향 | Action |
|---|---|---|
| ESLint unused var / hook dependency warnings | F4 차단 아님 | queued |
| `next lint` deprecated warning | F4 차단 아님, Next.js 16 전 migration 후보 | queued |
| Next.js workspace root 추론 warning | F4 차단 아님, multiple lockfiles 상태 확인 후보 | queued |
| React `act(...)` test warning | 테스트는 PASS, 기존 a11y test 비동기 update warning | queued |
| `package.json` dirty diff | F4 수정 아님. `claude-kit` dependency diff가 기존 working tree에 존재 | needs-verification before commit |

---

## 4. 최종 판정

D-F4-010 이후 hit-area 위치 기준은 static bounds 우선이 아니라 `data-hit-area-id`가 붙은 실제 DOM 요소의 `DOMRect`를 우선 사용한다. static bounds는 DOM target을 찾지 못하는 경우의 fallback과 문서화 metadata로 남긴다.

D-F4-011 이후 첫 DOM 측정 전에는 hit-area button을 렌더하지 않는다. 따라서 overlay 진입 직후 static fallback 위치가 클릭 가능한 상태로 잠깐 노출되는 문제도 차단한다.

자동 검증과 브라우저 spot check 기준으로 F4는 archive 가능한 상태다.
