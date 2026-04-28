# 08. Dev Tasks - Hero Liquid Gradient Background

> SSOT for `/dev-run` execution.
> TASK ID: `T-HLG-{AREA}-{NN}`.
> Detailed hints: [`04-implementation-hints.md`](../00-context/04-implementation-hints.md)

---

## 1. Task Status

| TASK | 제목 | 상태 | 주요 파일 | 검증 |
|---|---|:---:|---|---|
| T-HLG-TEST-01 | Hero acceptance test 추가 | 완료 | `src/components/sections/__tests__/hero.test.tsx` | pass |
| T-HLG-TOKEN-02 | theme token alignment 확정 | 완료 | `src/app/globals.css`, `src/__tests__/light-theme.test.tsx` | pass |
| T-HLG-COMP-03 | CSS-first background component 구현 | 완료 | `src/components/shared/hero-liquid-gradient-background.tsx`, `src/components/sections/hero.tsx` | pass |
| T-HLG-MOTION-04 | reduced motion + mobile fallback 정리 | 완료 | `src/app/globals.css` | pass |
| T-HLG-QA-05 | visual QA evidence + release gate 정리 | 완료 | `03-dev-notes/**`, `output/hero-liquid-gradient-qa/**` | pass |

## 2. T-HLG-TEST-01 - Hero Acceptance Test

**REQ**: REQ-hero-liquid-gradient-background-002, REQ-hero-liquid-gradient-background-013

### Acceptance

- [x] background layer render test 존재
- [x] CTA `href="#contact"` 유지
- [x] `DashboardPreview` wrapper `max-w-[1440px]` 유지
- [x] `pnpm test src/components/sections/__tests__/hero.test.tsx` 통과

## 3. T-HLG-TOKEN-02 - Theme Token Alignment

**REQ**: REQ-hero-liquid-gradient-background-006, REQ-hero-liquid-gradient-background-011, REQ-hero-liquid-gradient-background-012, REQ-hero-liquid-gradient-background-014

### Acceptance

- [x] gradient가 단일 hard-coded palette에 고립되지 않음
- [x] `--hero-gradient-*` token이 `:root`와 `[data-theme="dark"]`에 정의됨
- [x] theme toggle 전환 후 gradient token이 light -> dark로 변경됨
- [x] `pnpm test src/__tests__/light-theme.test.tsx` 통과

## 4. T-HLG-COMP-03 - CSS-first Background Component

**REQ**: REQ-hero-liquid-gradient-background-001, REQ-hero-liquid-gradient-background-003, REQ-hero-liquid-gradient-background-004, REQ-hero-liquid-gradient-background-007, REQ-hero-liquid-gradient-background-008, REQ-hero-liquid-gradient-background-010, REQ-hero-liquid-gradient-background-013

### Acceptance

- [x] `Three.js`, WebGL, canvas shader dependency 없음
- [x] background가 content와 preview보다 아래 layer에 위치
- [x] CTA, headline, preview 가시성 유지
- [x] CodePen source code 직접 복사 없음
- [x] Hero test 통과

## 5. T-HLG-MOTION-04 - Reduced Motion + Mobile Fallback

**REQ**: REQ-hero-liquid-gradient-background-003, REQ-hero-liquid-gradient-background-005, REQ-hero-liquid-gradient-background-009

### Acceptance

- [x] reduced motion에서 animation 제거
- [x] 390px viewport에서 horizontal overflow 없음
- [x] 기존 `GradientBlob` fallback 유지

## 6. T-HLG-QA-05 - Visual QA Evidence + Release Gate

**REQ**: REQ-hero-liquid-gradient-background-007, REQ-hero-liquid-gradient-background-008, REQ-hero-liquid-gradient-background-009, REQ-hero-liquid-gradient-background-010, REQ-hero-liquid-gradient-background-011, REQ-hero-liquid-gradient-background-014, REQ-hero-liquid-gradient-background-015, REQ-hero-liquid-gradient-background-016

### Acceptance

- [x] light/dark desktop/mobile QA 결과 기록
- [x] reduced motion check 기록
- [x] theme toggle check 기록
- [x] CodePen reference policy 위반 없음
- [x] WebGL deferred 유지 기록

## 7. Common Verification

```bash
pnpm test src/components/sections/__tests__/hero.test.tsx
pnpm test src/__tests__/light-theme.test.tsx
pnpm typecheck
pnpm lint
```

Browser QA는 local dev server `http://localhost:3100`에서 실행했다.
