# 10. Release Checklist - Hero Liquid Gradient Background

---

## 1. Implementation Checklist

| 항목 | 상태 |
|---|:---:|
| Hero background layer 추가 | [x] |
| `aria-hidden` / `pointer-events: none` 유지 | [x] |
| 기존 `GradientBlob` fallback 유지 | [x] |
| CSS-first 구현 유지 | [x] |
| light/dark gradient variant 적용 | [x] |
| 기존 theme token 기반 `--hero-gradient-*` token alignment 확인 | [x] |
| stacking context 명시 | [x] |
| reduced motion fallback 적용 | [x] |
| mobile horizontal overflow 없음 | [x] |
| CodePen source code 직접 복사 없음 | [x] |

## 2. Forbidden Path Check

| 경로 | 기대 | 상태 |
|---|---|:---:|
| `src/components/dashboard-preview/**` | 이번 feature에서 변경 없음 | 확인 필요: 기존 dirty 변경 존재 |
| `package.json` / lockfile | dependency 변경 없음 | [x] |
| `tailwind.config.ts` | 생성/수정 없음 | [x] |
| `src/components/providers/theme-provider.tsx` | 변경 없음 | [x] |
| `src/app/layout.tsx` | 변경 없음 | [x] |

## 3. Automated Verification

| 명령 | 상태 | 메모 |
|---|:---:|---|
| `pnpm test src/components/sections/__tests__/hero.test.tsx` | 통과 | Hero acceptance |
| `pnpm test src/__tests__/light-theme.test.tsx` | 통과 | theme token coverage |
| `pnpm typecheck` | 통과 | TypeScript check |
| `pnpm lint` | 통과 | 기존 unrelated warnings 존재 |
| `pnpm build` | 통과 | `/dev-verify` 첫 실행은 transient manifest miss, `.next` clean retry 후 성공 |

## 4. Browser QA

| 항목 | 상태 | Evidence |
|---|:---:|---|
| desktop dark screenshot review | [x] | `output/hero-liquid-gradient-qa/desktop-dark.png` |
| desktop light screenshot review | [x] | `output/hero-liquid-gradient-qa/desktop-light.png` |
| mobile dark 390px screenshot review | [x] | `output/hero-liquid-gradient-qa/mobile-dark.png` |
| mobile light 390px screenshot review | [x] | `output/hero-liquid-gradient-qa/mobile-light.png` |
| reduced motion check | [x] | `output/hero-liquid-gradient-qa/reduced-motion-mobile-dark.png` |
| theme toggle check | [x] | `output/hero-liquid-gradient-qa/theme-toggle-after-dark.png` |
| CTA `#contact` clickability guard | [x] | `pointer-events: none`, `href="#contact"` |
| animation tuning check | [x] | `output/hero-liquid-gradient-qa/dev-verify-summary.json` |

## 5. Dev Notes

- [x] QA 결과가 `03-dev-notes/qa-notes.md`에 기록됨
- [x] WebGL deferred 결정이 기록됨
- [x] CodePen visual capture blocked 상태가 기록됨
- [x] TASK별 결과가 `08-dev-tasks.md`에 체크됨
- [x] 주요 구현 결과가 `03-dev-notes/dev-output-summary.md`에 기록됨

## 6. Archive Readiness

| 항목 | 상태 | 메모 |
|---|:---:|---|
| 테스트 결과가 최종 보고에 포함됨 | 준비됨 | final response에서 정리 |
| 주요 결정이 `00-context/02-decision-log.md`에 append됨 | [x] | D-HLG-011~014 확정 |
| `/plan-archive hero-liquid-gradient-background` 실행 가능 | 준비됨 | build 통과 후 권장 |
