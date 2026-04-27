# Archive: Hero Liquid Gradient Background

> **Key**: HLG | **Slug**: `hero-liquid-gradient-background` | **IDEA**: IDEA-20260427-001
> **Category**: Lite | **RICE Score**: 59.1 (Go override) | **Archived**: 2026-04-27
> **Code Location**: `src/components/sections/hero.tsx`, `src/components/shared/hero-liquid-gradient-background.tsx`, `src/app/globals.css`
> **Pipeline**: Idea -> Screening -> Draft -> PRD -> Review -> Bridge -> Dev -> Verify -> Archive
> **Epic**: -

---

## 1. Summary

Hero section에 CSS-first liquid gradient background를 추가했다. CodePen은 visual reference로만 사용했고 source code 직접 복사는 하지 않았다. `Three.js` / WebGL 구현은 deferred로 유지하고, 현재 landing theme token에 맞춘 light/dark gradient variant와 reduced-motion fallback을 적용했다.

Animation은 최초 구현 후 사용자가 preview에서 체감 강도가 약하다고 확인해 duration `18s -> 9s`, transform 이동량/scale 상향, blur 축소를 반영했다. 최종 preview QA에서 animation이 `running` 상태이며 1.2초 동안 transform delta가 `x +107.49px`, `y +43.38px`, scale `+0.0514`로 측정됐다.

## 2. Source Manifest

| 원본 경로 | 현재 위치 | 유형 |
|---|---|---|
| `.plans/ideas/20-approved/IDEA-20260427-001.md` | `sources/ideas/IDEA-20260427-001.md` | IDEA |
| `.plans/ideas/20-approved/SCREENING-20260427-001.md` | `sources/ideas/SCREENING-20260427-001.md` | Screening |
| `.plans/drafts/hero-liquid-gradient-background/` | `sources/drafts/` | Draft / PRD / Review / Routing / Reference evidence |
| `.plans/features/active/hero-liquid-gradient-background/` | `sources/feature-package/` | Bridge context / Feature Package / Dev notes |
| `output/hero-liquid-gradient-qa/*.json`, `*.png` | `sources/qa-evidence/` | Browser QA evidence copy |

Source file count:

| 묶음 | 파일 수 |
|---|---:|
| `sources/ideas` | 2 |
| `sources/drafts` | 11 |
| `sources/feature-package` | 18 |
| `sources/qa-evidence` | 21 |
| Total | 52 |

## 3. Code Changes

| 영역 | 파일 | 결과 |
|---|---|---|
| Hero integration | `src/components/sections/hero.tsx` | background layer mount, `relative isolate overflow-hidden`, content `z-10` |
| Background component | `src/components/shared/hero-liquid-gradient-background.tsx` | decorative layer, `aria-hidden`, `pointer-events-none`, `data-testid` |
| Theme and motion | `src/app/globals.css` | `--hero-gradient-*` light/dark token, animation, reduced motion |
| Hero tests | `src/components/sections/__tests__/hero.test.tsx` | layer, CTA, stacking, fallback 검증 |
| Theme tests | `src/__tests__/light-theme.test.tsx` | token alignment, CSS animation/reduced-motion guard |

## 4. Verification Evidence

| 검증 | 결과 | 근거 |
|---|:---:|---|
| `pnpm test src/components/sections/__tests__/hero.test.tsx` | 통과 | 10 tests |
| `pnpm test src/__tests__/light-theme.test.tsx` | 통과 | 371 tests |
| `pnpm typecheck` | 통과 | TypeScript errors 없음 |
| `pnpm lint` | 통과 | 기존 `dashboard-preview` warning은 unrelated |
| `pnpm build` | 통과 | 첫 `/dev-verify` build는 transient manifest miss, `.next` clean retry 후 성공 |
| Browser QA | 통과 | desktop/mobile light/dark, theme toggle, reduced motion |
| Preview animation QA | 통과 | `sources/qa-evidence/dev-verify-summary.json` |
| `git diff --check` | 통과 | LF/CRLF warning만 존재 |

## 5. Final Preview Measurement

| 항목 | 값 |
|---|---|
| `animationName` | `hero-liquid-gradient-drift` |
| `animationDuration` | `9s` |
| `animationPlayState` | `running` |
| transform delta | `x +107.49px`, `y +43.38px`, scale `+0.0514` |
| reduced motion | `animationName: none`, `transform: none` |
| desktop overflow-x | false |
| mobile overflow-x | false |

## 6. Decisions

| Decision | 내용 |
|---|---|
| D-HLG-001 | 첫 구현은 CSS-first MVP |
| D-HLG-002 | `Three.js` / WebGL은 deferred |
| D-HLG-003 | CodePen은 reference-only, source copy 금지 |
| D-HLG-005 | light/dark theme별 gradient variant 제공 |
| D-HLG-011 | `HeroLiquidGradientBackground` component split |
| D-HLG-012 | `--hero-gradient-*` token을 `:root`와 `[data-theme="dark"]`에 정의 |
| D-HLG-013 | 기존 `GradientBlob` fallback 유지 |
| D-HLG-014 | CodePen capture blocked 상태에서 local Playwright evidence 사용 |

## 7. Remaining Notes

| 항목 | 수준 | 메모 |
|---|---|---|
| CodePen 정량 비교 | low | Cloudflare verification으로 자동 캡처 blocked |
| Existing dirty worktree | medium | `dashboard-preview` 관련 변경은 archive 범위 밖 |
| Next build transient manifest miss | medium | `.next` clean retry 후 통과, release 전 clean build 재확인 권장 |
| `.references/design/hero-01` | medium | untracked local reference folder로 보이며 archive에 포함하지 않음 |

## 8. Improvement Entry Point

Archive 이후 개선 요청은 다음 명령으로 시작한다.

```bash
/plan-improve hero-liquid-gradient-background "개선 제목"
```

변경 규모별 권장 재진입:

| 변경 유형 | 재진입 |
|---|---|
| animation 수치 미세 조정 | Dev only |
| 배경 layer 배치/색상 체계 변경 | P7 Bridge -> Dev |
| WebGL/Three.js 구현 전환 | P3 Draft -> P7 Bridge -> Dev |
| hero 구조나 CTA 전략 변경 | P1/P3부터 재검토 |

## 9. Archive Result

Archive bundle 생성과 source relocation을 완료했다. Planning 원본은 `sources/` 아래로 이동했고, QA evidence는 archive에 복사했다. 구현 코드는 source tree에 남아 있으며, archive bundle은 구현 위치를 참조한다.
