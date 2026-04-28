# Archive: hero-01 reference Hero refresh

> **Key**: HR01 | **Slug**: `hero-01-reference-hero-refresh` | **IDEA**: IDEA-20260427-004
> **Category**: Standard | **RICE Score**: 79.8 | **Archived**: 2026-04-28
> **Code Location**: `src/components/sections/hero.tsx`, `src/components/shared/hero-liquid-gradient-background.tsx`, `src/app/globals.css`
> **Implementation Commit**: `c06cd06 feat: hero-01 레퍼런스 기반 Hero 배경 개선`
> **Closeout Commit**: `24afa8a docs: hero-01 파이프라인 closeout 반영`
> **Pipeline**: Idea -> Screening -> Draft -> PRD -> Wireframe -> Bridge -> Dev -> Verify -> Closeout -> Archive

---

## 1. Summary

`.references/design/hero-01` reference의 full-bleed liquid field 인상을 현재 landing Hero에 맞게 재구성했다. 구현은 Canvas 2D + CSS fallback route로 확정했고, WebGL/Three.js 같은 새 graphics dependency는 추가하지 않았다.

최종 색감은 사용자 피드백을 반영해 dark mode에서 `#05030a` base 위의 purple-centered field가 중심이 되도록 조정했다. 하단에는 `hero-bottom-fade`와 canvas bottom veil을 추가해 밝은 blob이 다음 section으로 잘려 보이지 않게 했다. Light mode는 pastel 확산을 줄이고 muted lavender/cyan field로 낮췄다.

사용자는 최신 미리보기 확인 후 "만족 스럽습니다"라고 승인했고, 구현 commit은 `origin/main`에 push되었다.

---

## 2. Source Manifest

| Original Path | Archive Location | Type |
|---|---|---|
| `.plans/ideas/20-approved/IDEA-20260427-004.md` | `sources/ideas/IDEA-20260427-004.md` | IDEA |
| `.plans/ideas/20-approved/SCREENING-20260427-004.md` | `sources/ideas/SCREENING-20260427-004.md` | Screening |
| `.plans/drafts/hero-01-reference-hero-refresh/` | `sources/drafts/hero-01-reference-hero-refresh/` | Draft / PRD / Review / Routing |
| `.plans/wireframes/hero-01-reference-hero-refresh/` | `sources/wireframes/hero-01-reference-hero-refresh/` | Wireframes |
| `.plans/features/active/hero-01-reference-hero-refresh/` | `sources/feature-package/hero-01-reference-hero-refresh/` | Bridge / Feature Package / Dev notes |
| `output/hero-01-parity-qa/` | `sources/qa-evidence/` | Browser QA evidence copy |

Source file count:

| Bundle | Files |
|---|---:|
| `sources/ideas` | 2 |
| `sources/drafts` | 4 |
| `sources/wireframes` | 4 |
| `sources/feature-package` | 15 |
| `sources/qa-evidence` | 8 |
| Total | 33 |

---

## 3. Code Changes

| Area | Files | Result |
|---|---|---|
| Hero shell | `src/components/sections/hero.tsx` | Full-bleed field layering, `hero-bottom-fade`, existing headline/CTA/preview retained |
| Background renderer | `src/components/shared/hero-liquid-gradient-background.tsx` | Canvas 2D liquid field, CSS fallback, theme repaint, resize/DPR/visibility cleanup |
| Theme tokens | `src/app/globals.css` | `--hero-field-*` light/dark tokens, muted light field, purple dark field, bottom fade |
| Tests | `src/components/sections/__tests__/hero.test.tsx`, `src/__tests__/light-theme.test.tsx` | DOM guards, token regression, bottom fade regression |

---

## 4. Verification Evidence

| Check | Result | Evidence |
|---|:---:|---|
| `pnpm run test -- hero light-theme` | Pass | 2 files, 408 tests |
| `pnpm run typecheck` | Pass | `tsc --noEmit` |
| `pnpm run lint` | Pass | exit 0, existing dashboard-preview warnings only |
| `pnpm run build` | Pass | Next.js production build/export passed |
| Browser QA | Pass | `sources/qa-evidence/browser-qa.json`, `failureCount: 0` |
| Desktop screenshots | Pass | `desktop-light.png`, `desktop-dark.png`, transition screenshots |
| Mobile screenshots | Pass | `mobile-light.png`, `mobile-dark.png`, `overflowX: 0` |
| Reduced motion | Pass | `desktop-reduced-motion.png`, static field retained |
| User approval | Pass | "만족 스럽습니다" |

---

## 5. Final Decisions

| Decision | Result |
|---|---|
| Implementation route | Canvas 2D + CSS fallback |
| Dark palette | `#05030a` base, purple-centered `aurora/tide`, weak blue edge depth |
| Light palette | muted `#f8fafc` base, lavender/cyan low-opacity field |
| Bright accent | cyan/yellow spread removed from primary field; warm is purple glow |
| Hero bottom | `hero-bottom-fade` and canvas bottom veil |
| Reference exclusions | controls, color adjuster, export UI, custom cursor, footer attribution omitted |
| Heavy dependency | No new graphics dependency |

---

## 6. Remaining Notes

| Item | Level | Note |
|---|---|---|
| Production deploy QA | low | This archive closes planning/dev pipeline; deploy/staging verification is separate |
| Existing `localhost:3101` state | low | Stale process returned `500`; latest QA used `localhost:3103` |
| Unrelated dirty worktree | medium | Epic/screening/%SystemDrive% changes were intentionally excluded from this archive commit |

---

## 7. Improvement Entry Point

Future changes should start from an improvement request instead of reopening this active package.

```bash
/plan-improve hero-01-reference-hero-refresh "<요청명>"
```

Recommended restart point:

| Change Type | Restart Point |
|---|---|
| Minor color tuning | Dev only |
| Hero bottom transition adjustment | P7 Bridge -> Dev |
| Layout/hierarchy change | P5 Wireframe -> P7 Bridge -> Dev |
| Reference target replacement | P1/P3 pipeline restart |

---

## 8. Archive Result

P8 archive is complete. Planning sources were moved under `sources/`, browser QA evidence was copied into the archive bundle, and active package state is now closed.
