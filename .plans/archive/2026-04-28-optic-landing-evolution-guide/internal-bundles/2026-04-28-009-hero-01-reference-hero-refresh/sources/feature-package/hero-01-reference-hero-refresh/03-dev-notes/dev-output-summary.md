# Dev Output Summary: hero-01-reference-hero-refresh

> **Feature**: hero-01 레퍼런스 기반 Hero 섹션 재개선
> **Status**: implementation complete, verification complete
> **Created**: 2026-04-28
> **Source package**: `../02-package/00-overview.md`

---

## 1. 구현 요약

`hero-01` reference의 full-bleed liquid field 인상을 현재 landing Hero에 맞게 구현했다. 구현 route는 Canvas 2D + CSS fallback이며, `WebGL/Three.js` 또는 새 graphics dependency는 추가하지 않았다.

| 영역 | 결과 |
|---|---|
| Hero field | `canvas` 기반 liquid field + CSS fallback layer |
| Theme | light/dark `--hero-field-*` token 추가 |
| Motion | reduced-motion에서 animation/pointer loop 중지 |
| Mobile | lower intensity preset과 DPR cap 적용 |
| CTA | background `pointer-events: none`, `#contact` 유지 |
| Reference exclusions | controls, color adjuster, export UI, custom cursor 미노출 |

---

## 2. 변경 파일

| 파일 | 변경 |
|---|---|
| `src/components/shared/hero-liquid-gradient-background.tsx` | Canvas 2D renderer, CSS fallback, theme repaint, resize/DPR/visibility cleanup |
| `src/components/sections/hero.tsx` | full-bleed layer 기준 Hero hierarchy, contrast veil, CTA/mobile layout 조정 |
| `src/app/globals.css` | light/dark hero field tokens, fallback field, content veil, reduced-motion CSS |
| `src/components/sections/__tests__/hero.test.tsx` | canvas/fallback, contrast veil, CTA, reference exclusion guard |
| `src/__tests__/light-theme.test.tsx` | `--hero-field-*` light/dark token regression |
| `output/hero-01-parity-qa/` | desktop/mobile light/dark/reduced-motion screenshot evidence |

---

## 3. TASK/REQ/TC Trace

| TASK | 상태 | REQ | TC |
|---|---|---|---|
| `T-HR-M1-01` | 완료 | `REQ-HR-002`, `REQ-HR-016` | `TC-HR-REL-04` |
| `T-HR-M1-02` | 완료 | `REQ-HR-001`, `REQ-HR-011` | `TC-HR-COMP-01`, `TC-HR-VIS-01` |
| `T-HR-M2-01` | 완료 | `REQ-HR-001`, `REQ-HR-002` | `TC-HR-COMP-01`, `TC-HR-VIS-01` |
| `T-HR-M2-02` | 완료 | `REQ-HR-003`, `REQ-HR-007` | `TC-HR-THEME-01`, `TC-HR-VIS-03` |
| `T-HR-M2-03` | 완료 | `REQ-HR-004`, `REQ-HR-007` | `TC-HR-THEME-02`, `TC-HR-VIS-04` |
| `T-HR-M2-04` | 완료 | `REQ-HR-010`, `REQ-HR-013`, `REQ-HR-014` | `TC-HR-A11Y-01`, `TC-HR-VIS-05` |
| `T-HR-M3-01` | 완료 | `REQ-HR-005`, `REQ-HR-011` | `TC-HR-COMP-02`, `TC-HR-VIS-02` |
| `T-HR-M3-02` | 완료 | `REQ-HR-005`, `REQ-HR-007` | `TC-HR-VIS-03`, `TC-HR-VIS-04` |
| `T-HR-M3-03` | 완료 | `REQ-HR-012`, `REQ-HR-013` | `TC-HR-VIS-05`, `TC-HR-REL-02` |
| `T-HR-M4-01` | 완료 | `REQ-HR-008`, `REQ-HR-009` | `TC-HR-COMP-03`, `TC-HR-REL-03` |
| `T-HR-M4-02` | 완료 | `REQ-HR-006` | `TC-HR-COMP-02` |
| `T-HR-M4-03` | 완료 | `REQ-HR-003`, `REQ-HR-004` | `TC-HR-THEME-01`, `TC-HR-THEME-02` |
| `T-HR-M5-01` | 완료 | `REQ-HR-015` | `TC-HR-REL-01` |
| `T-HR-M5-02` | 완료 | `REQ-HR-015`, `REQ-HR-016` | `TC-HR-REL-04` |

---

## 4. 검증 결과

| 검증 | 결과 | 메모 |
|---|---|---|
| Red test | 확인 | 새 Hero field/token/exclusion 테스트 추가 후 실패 확인 |
| `pnpm run test -- hero light-theme` | 통과 | 2 files, 408 tests passed |
| `pnpm run typecheck` | 통과 | `tsc --noEmit` passed |
| `pnpm run lint` | 통과 | exit 0, 기존 dashboard-preview warning만 있음 |
| `pnpm run build` | 통과 | Next.js production build/export passed |
| Browser QA | 통과 | `output/hero-01-parity-qa/browser-qa.json`, `failureCount: 0` |

---

## 5. Browser QA Evidence

| Case | Evidence | 주요 metric |
|---|---|---|
| Desktop light | `output/hero-01-parity-qa/desktop-light.png` | canvas nonblank `9216/9216`, overflow `0` |
| Desktop dark | `output/hero-01-parity-qa/desktop-dark.png` | canvas nonblank `9216/9216`, overflow `0` |
| Desktop light transition | `output/hero-01-parity-qa/desktop-light-transition.png` | 하단 fade transition 확인 |
| Desktop dark transition | `output/hero-01-parity-qa/desktop-dark-transition.png` | black-purple 하단 연결 확인 |
| Mobile light | `output/hero-01-parity-qa/mobile-light.png` | canvas nonblank `9216/9216`, overflow `0` |
| Mobile dark | `output/hero-01-parity-qa/mobile-dark.png` | canvas nonblank `9216/9216`, overflow `0` |
| Reduced motion | `output/hero-01-parity-qa/desktop-reduced-motion.png` | canvas nonblank `9216/9216`, overflow `0` |

---

## 6. 남은 리스크

| 항목 | 수준 | 대응 |
|---|---|---|
| Visual taste final approval | resolved | 사용자 피드백 "만족 스럽습니다" 수신 |
| Existing lint warnings | low | dashboard-preview 기존 warning. 이번 Hero 변경 blocker 아님 |
| Existing `localhost:3101` 500 | low | 기존 preview process가 stale 상태. 최신 검증은 새 dev server `localhost:3103`에서 수행 |

---

## 7. Next Step

1. P8 archive 실행 여부를 결정한다.
2. 새 색감/레이아웃 피드백이 생기면 `/plan-improve hero-01-reference-hero-refresh "<요청명>"`로 별도 improvement loop를 시작한다.

---

## 8. 2026-04-28 Color Refinement Follow-up

사용자 피드백에 따라 구조 변경 없이 Hero field 색감을 재조정했다.

| 항목 | 결과 |
|---|---|
| Dark mode palette | `#05030a` base 위에 `aurora/tide` purple 중심으로 재조정 |
| Bright accent control | cyan/yellow 계열을 제거하고 `signal`은 edge depth, `warm`은 purple glow로 축소 |
| Hero bottom transition | `hero-bottom-fade` decorative layer와 canvas bottom veil 추가 |
| Light mode palette | pastel 확산을 줄이고 muted lavender/cyan 중심으로 조정 |
| Browser QA | `localhost:3103` 기준 `failureCount: 0`, desktop/mobile/reduced-motion 통과 |
| Commit/push | `c06cd06` pushed to `origin/main` |
| User approval | "만족 스럽습니다" 피드백 수신 |
