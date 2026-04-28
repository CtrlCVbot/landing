# QA Notes - Hero Liquid Gradient Background

> Feature: `hero-liquid-gradient-background`
> QA date: 2026-04-27
> Local URL: `http://localhost:3100`

---

## 1. QA Summary

| 항목 | 상태 | 근거 |
|---|:---:|---|
| desktop light | 통과 | `desktop-light.png`, `browser-qa-summary.json` |
| desktop dark | 통과 | `desktop-dark.png`, `browser-qa-summary.json` |
| mobile light 390px | 통과 | `mobile-light.png`, horizontal overflow 없음 |
| mobile dark 390px | 통과 | `mobile-dark.png`, horizontal overflow 없음 |
| reduced motion | 통과 | animation name이 `none`으로 전환됨 |
| theme toggle | 통과 | light -> dark 클릭 후 gradient token 변경 확인 |
| CTA clickability guard | 통과 | background `pointer-events: none`, CTA `href="#contact"` 유지 |
| stacking context | 통과 | background `z-index: 0`, title/preview `z-index: 10` |
| animation tuning | 통과 | `animationDuration: 9s`, transform delta 확인 |
| `/dev-verify` preview QA | 통과 | `dev-verify-summary.json` |

## 2. Evidence Files

| 파일 | 내용 |
|---|---|
| `output/hero-liquid-gradient-qa/browser-qa-summary.json` | desktop/mobile, theme toggle, reduced motion 1차 QA |
| `output/hero-liquid-gradient-qa/animation-regression-summary.json` | animation 강도 상향 후 regression QA |
| `output/hero-liquid-gradient-qa/dev-verify-summary.json` | `/dev-verify` 성격의 최종 preview QA |
| `output/hero-liquid-gradient-qa/desktop-light.png` | desktop light screenshot |
| `output/hero-liquid-gradient-qa/desktop-dark.png` | desktop dark screenshot |
| `output/hero-liquid-gradient-qa/mobile-light.png` | 390px mobile light screenshot |
| `output/hero-liquid-gradient-qa/mobile-dark.png` | 390px mobile dark screenshot |
| `output/hero-liquid-gradient-qa/reduced-motion-mobile-dark.png` | reduced motion mobile dark screenshot |
| `output/hero-liquid-gradient-qa/theme-toggle-after-dark.png` | theme toggle 후 dark 상태 screenshot |
| `output/hero-liquid-gradient-qa/dev-verify-preview-before.png` | final preview animation sample A |
| `output/hero-liquid-gradient-qa/dev-verify-preview-after.png` | final preview animation sample B |
| `output/hero-liquid-gradient-qa/dev-verify-reduced-motion.png` | final reduced motion sample |

## 3. Measured Results

| 시나리오 | 배경 | 테마 토큰 | 미리보기 | overflow-x | 모션 |
|---|:---:|---|:---:|:---:|---|
| desktop light | 있음 | `#7c3aed 34%`, `#2563eb 28%` | 표시 | 없음 | `hero-liquid-gradient-drift` |
| desktop dark | 있음 | `#9333ea 52%`, `#3b82f6 44%` | 표시 | 없음 | `hero-liquid-gradient-drift` |
| mobile light | 있음 | `#7c3aed 34%`, `#2563eb 28%` | 표시 | 없음 | `hero-liquid-gradient-drift` |
| mobile dark | 있음 | `#9333ea 52%`, `#3b82f6 44%` | 표시 | 없음 | `hero-liquid-gradient-drift` |
| reduced motion | 있음 | dark token 유지 | 표시 | 없음 | `none` |
| theme toggle | 있음 | light token -> dark token | 표시 | 없음 | 유지 |
| animation tuning | 있음 | light token 유지 | 표시 | 없음 | `9s`, running |

## 4. Final `/dev-verify` Preview Measurement

| 항목 | 값 |
|---|---|
| `animationName` | `hero-liquid-gradient-drift` |
| `animationDuration` | `9s` |
| `animationPlayState` | `running` |
| transform delta | `x +107.49px`, `y +43.38px`, scale `+0.0514` |
| reduced motion | `animationName: none`, `transform: none` |
| desktop overflow-x | false |
| mobile overflow-x | false |

## 5. Reference Evidence

| 항목 | 상태 | 메모 |
|---|---|---|
| CodePen visual capture | blocked | Cloudflare verification으로 자동 캡처 불가 |
| CodePen source policy | 준수 | source code 직접 복사 없음 |
| WebGL/Three.js parity | deferred | CSS-first MVP 범위 유지 |

## 6. Remaining QA Notes

| 항목 | 수준 | 대응 |
|---|---|---|
| CodePen 원본과 픽셀 단위 유사도 | low | 자동 캡처가 막혀 정량 비교는 보류 |
| Next build transient manifest miss | medium | 첫 `/dev-verify` build에서 `.next/routes-manifest.json` miss 발생, `.next` clean retry 후 통과 |
| Existing dirty worktree | medium | `dashboard-preview` 변경은 이번 archive 범위 밖으로 분리 필요 |
