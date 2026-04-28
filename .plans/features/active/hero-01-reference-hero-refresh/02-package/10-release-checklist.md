# Release Checklist: hero-01-reference-hero-refresh

> **Feature**: hero-01 레퍼런스 기반 Hero 섹션 재개선
> **Dev Tasks**: `08-dev-tasks.md`
> **Test Cases**: `09-test-cases.md`
> **Created**: 2026-04-28

---

## 0. 이 문서의 역할

이 checklist는 구현 완료 후 release-ready를 판단하기 위한 evidence 기록지다. 구현 전에는 비워 둔다.

---

## 1. Implementation Route

| 항목 | 상태 | 메모 |
|---|---|---|
| Route selected | 완료 | Canvas 2D + CSS fallback route 선택. `data-implementation-route="canvas-2d-css-fallback"`로 DOM evidence 남김 |
| CSS fallback | 완료 | `.hero-liquid-gradient-background__fallback` 유지. reduced-motion에서 animation 제거 |
| WebGL/Three.js gate | 완료 | `package.json` 변경 없음. 새 graphics dependency 추가하지 않음 |

---

## 2. Automated Verification

| 검증 | 상태 | 결과 기록 |
|---|---|---|
| `pnpm run test -- hero light-theme` | 통과 | 2 files, 408 tests passed |
| `pnpm run typecheck` | 통과 | `tsc --noEmit` passed |
| `pnpm run lint` | 통과 | exit 0. 기존 dashboard-preview test/use-focus-walk warning만 있음 |
| `pnpm run build` | 통과 | Next.js production build/export passed. 기존 lint warning과 lockfile root warning만 있음 |

---

## 3. Browser Evidence

| Evidence | 상태 | 파일 또는 메모 |
|---|---|---|
| Desktop light screenshot | 완료 | `output/hero-01-parity-qa/desktop-light.png` |
| Desktop dark screenshot | 완료 | `output/hero-01-parity-qa/desktop-dark.png` |
| Desktop transition screenshots | 완료 | `desktop-light-transition.png`, `desktop-dark-transition.png` |
| Mobile light screenshot | 완료 | `output/hero-01-parity-qa/mobile-light.png` |
| Mobile dark screenshot | 완료 | `output/hero-01-parity-qa/mobile-dark.png` |
| Reduced-motion screenshot 또는 computed evidence | 완료 | `output/hero-01-parity-qa/desktop-reduced-motion.png` |
| Overflow-x measurement | 완료 | `output/hero-01-parity-qa/browser-qa.json`에서 모든 case `overflowX: 0` |
| CTA click/focus browser spot check | 완료 | `browser-qa.json`에서 Hero CTA `href="#contact"`, background `pointerEvents: none` |

권장 evidence folder:

```text
output/hero-01-parity-qa/
```

---

## 4. Reference Exclusion

| 제외 항목 | 상태 | 검증 방식 |
|---|---|---|
| color scheme buttons | 완료 | `hero.test.tsx`, browser DOM check |
| color adjuster panel | 완료 | `hero.test.tsx`, browser DOM check |
| export palette UI | 완료 | `hero.test.tsx`, browser DOM check |
| custom cursor | 완료 | `hero.test.tsx`, browser DOM check |
| footer attribution UI | 완료 | browser screenshot/DOM check. reference footer UI 미노출 |

---

## 5. Visual Gap Review

| 항목 | 상태 | 메모 |
|---|---|---|
| Reference-like full-bleed field | 완료 | Canvas non-blank pixel check `9216/9216`, screenshot 확인 |
| Headline priority | 완료 | desktop/mobile screenshot에서 headline이 first visual anchor |
| Primary CTA clarity | 완료 | CTA는 field 위에서 visible, `#contact` 유지 |
| `DashboardPreview` visual weight | 완료 | CTA 아래 제품 증거 영역으로 유지. 내부 business flow 변경 없음 |
| Light palette fit | 완료 | cyan/warm accent 포함, light screenshot 확인 |
| Dark palette depth | 완료 | purple 중심 field, weak blue edge depth, 하단 black-purple fade 확인 |
| Mobile stability | 완료 | mobile light/dark `overflowX: 0`, text/CTA/preview overlap 없음 |

---

## 6. Release Decision

| 항목 | 상태 | 메모 |
|---|---|---|
| Critical/high feedback | 없음 | self-review와 automated/browser QA에서 blocker 없음 |
| Remaining intentional differences | 있음 | reference controls/custom cursor/footer는 production에서 의도적으로 제외 |
| Release-ready decision | 준비됨 | dev implementation + evidence complete. 최종 review/commit 분리 필요 |
