# 08. Dev Tasks — F1 라이트 모드 전환 인프라

> **SSOT** for `/dev-run` TASK 실행. TASK ID: `T-THEME-{NN}` ([task-id-naming.md](../../../../../.claude/rules/task-id-naming.md) IMP-KIT-015 준수).
> Lane `Standard` → 8 TASK + 6 PR 분할.
> 상세 힌트: [`04-implementation-hints.md`](../00-context/04-implementation-hints.md) 참조 (라인 번호·치환 규칙·grep 명령).

---

## TASK 목록

| TASK | 제목 | PR | 선행 | 파일 | Effort |
|------|------|:-:|------|------|:------:|
| T-THEME-01 | globals.css 토큰 이중화 | PR-1 | — | 1 | 1 인·일 |
| T-THEME-02 | layout.tsx ThemeProvider 주입 | PR-1 | T-THEME-01 | 1 | 0.5 인·일 |
| T-THEME-03 | next-themes 설치 + Tailwind 4 정합 검증 (NFR-007 게이트) | PR-1 | T-THEME-01/02 | 2~3 | 1.5 인·일 |
| T-THEME-04 | ThemeToggle + Navbar | PR-2 | PR-1 merge | 2~3 | 1.5 인·일 |
| T-THEME-05 | Hero + Features 토큰 치환 | PR-3 | PR-1 merge | 2~5 | 1.5 인·일 |
| ~~T-THEME-06~~ | ~~Pricing + Testimonials 토큰 치환~~ **⚠️ SKIPPED (D-003)** | ~~PR-4~~ | — | 0 | 0 |
| T-THEME-07 | Footer + Shared UI 토큰 치환 | PR-5 | PR-1 merge | 5~10 | 2 인·일 |
| T-THEME-08 | Dash-Preview 7파일 토큰 치환 | PR-6 | PR-1 merge + F5 merge | 7 | 1 인·일 |
| T-THEME-09 | AI 패널 8파일 토큰 치환 (D-016, **P0**) | PR-7 | T-THEME-08 | 8 | 1 인·일 |
| T-THEME-10 | Legacy 4파일 토큰 치환 (D-016, **P1**) | PR-7 | T-THEME-09 | 4 | 0.5 인·일 |
| T-THEME-11 | Products/Integrations 카드 배경 강화 (D-016, **P1**) | PR-7 | T-THEME-10 | 2 | 0.25 인·일 |
| T-THEME-12 | Problems/order-form 미세 조정 (D-016, **P2**) | PR-7 | T-THEME-11 | 2+ | 0.25 인·일 |

**합계**: 11 인·일 (T-THEME-06 skip 반영 + T-THEME-09~12 D-016 확장 +2 인·일, 직렬) / 약 10.5 인·일 (PR 병렬).
**PR 개수**: 6 → **6** (PR-4 Skip, PR-7 신설 D-016, [decision-log D-003](../00-context/02-decision-log.md) + [D-016](../00-context/02-decision-log.md) 참조).

---

## T-THEME-01 — globals.css 토큰 이중화

**REQ**: REQ-001, REQ-002, REQ-003
**PR**: PR-1

### Scope
- `src/app/globals.css` 수정
  - `@theme inline` **13개 직접값 색상 토큰** → `var(--landing-*)` 간접화 (shadcn alias 7개는 기존 `var(--color-*)` 참조로 자동 상속)
  - `:root { --landing-*: ... }` 라이트 팔레트 **13개** 신규 정의 (WCAG AA ≥ 4.5:1)
  - `[data-theme="dark"] { --landing-*: ... }` 다크 팔레트 **13개** 정의 (기존 다크 값 이관)
  - 기존 `@layer base` + `prefers-reduced-motion` 블록 **유지** (NFR-006)
  - 근거: [decision-log D-005](../00-context/02-decision-log.md) — radius/font(색상 아님) + shadcn alias 7개 제외한 실제 직접값 13개

### TDD RED (선행)
`src/__tests__/light-theme.test.tsx` 작성 — `:root` 라이트 팔레트 대비 규칙 검증 (axe color-contrast)

### Acceptance
- [ ] 13개 직접값 `var(--landing-*)` 간접화 확인 (grep, 코드 기준)
- [ ] shadcn alias 7개 `var(--color-*)` 참조 유지 확인
- [ ] `:root` 라이트 팔레트 13개 정의 완료
- [ ] `[data-theme="dark"]` 다크 팔레트 13개 정의 완료
- [ ] `pnpm build` 성공 (Tailwind 4 빌드 통과)
- [ ] 기존 다크 렌더 시각 회귀 스냅샷 100% 일치

### Non-goals
- 토큰 값 스케일 재설계 (차기 Epic)
- 3번째 테마 값 정의 (구조만 확장 가능하게)

---

## T-THEME-02 — layout.tsx ThemeProvider 주입 + next-themes install 병합

**REQ**: REQ-004 (병합), REQ-005, REQ-006
**PR**: PR-1
**범위 확장**: [decision-log D-008](../00-context/02-decision-log.md) — next-themes install 을 T-02 로 병합 (typecheck 선행 통과 목적)

### Scope
- `src/components/providers/theme-provider.tsx` 신규 — 'use client' next-themes pass-through 래퍼 (motion-provider.tsx 패턴 준수)
- `src/app/layout.tsx` 수정
  - `<html>` 태그에 `suppressHydrationWarning` 추가 (REQ-006)
  - `<body>` 내부 최상위에 `<ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>` 래퍼 추가 (REQ-005)
  - Provider 순서: `ThemeProvider > MotionProvider > children` (PRD §7.3)
- `package.json` — `next-themes ^0.3.0` dependency 추가 (REQ-004)
- `pnpm-lock.yaml` — `pnpm add` 자동 생성

### TDD RED
`src/__tests__/light-theme.test.tsx` 에 T-THEME-02 describe 블록 추가. layout.tsx, theme-provider.tsx, package.json 구조 계약 검증 (파일 파싱 기반 — jsdom 한계 대응).

### Acceptance
- [x] `<html lang="ko" className={inter.variable} suppressHydrationWarning>` 확인
- [x] ThemeProvider 4개 속성 모두 명시
- [x] Provider 순서 정확 (ThemeProvider 바깥, MotionProvider 안쪽)
- [x] theme-provider.tsx pass-through 래퍼 작성 + 'use client' 지시자
- [x] `package.json` 에 `next-themes: ^0.3.0` 추가
- [x] typecheck 0 errors + 전체 테스트 686/686 PASS

### Non-goals
- Cookie 기반 SSR 초기값 주입 (next-themes 내부 처리)
- NFR-004 `pnpm dev --turbopack` hydration 경고 0건 수동 검증은 PR-2 머지 직전 수행

---

## T-THEME-03 — NFR 검증 (PR-1 핵심 게이트, install 제외)

**REQ**: REQ-004 수용 기준 (번들 증분), NFR-003, NFR-007 (Critical gate), NFR-008
**PR**: PR-1
**Critical gate**: NFR-007 (Tailwind 4 런타임 오버라이드 정합)
**범위 축소**: [decision-log D-008](../00-context/02-decision-log.md) — install 단계는 T-02 로 이동. 본 TASK 는 NFR 측정/검증만 잔존.

### Scope (검증 전용 — 코드 변경 없음)
1. **NFR-003 번들 증분 측정** — `pnpm build` 후 First Load JS / CSS 크기 기록
2. **NFR-007 Tailwind 4 런타임 오버라이드 정합** — 생성된 CSS (`.next/static/css/*.css`) 에서:
   - `:root` 블록과 `[data-theme=dark]` 블록 양쪽 생성 확인
   - `[data-theme=dark]` 블록에 13 개 `--landing-*` 변수 전수 포함
   - CSS cascade 순서 (`:root` 먼저, `[data-theme=dark]` 뒤) 로 override 성립
3. **NFR-008 production 호환** — static export 모드 (`output: export`) 검증:
   - `pnpm build` 성공 + `out/` 디렉터리 생성
   - `out/index.html` 에 next-themes pre-hydration script 포함
   - `npx http-server out/` 로 정적 서빙 + HTTP 200 응답
4. **decision-log D-009 기록** — NFR-007 PASS 증거

### 산출물
- `.plans/features/active/f1-landing-light-theme/00-context/02-decision-log.md` — D-009 등록
- Phase A 최종 정리 시 NFR 측정치는 본 TASK decision-log 에 기록

### NFR-007 검증 절차 (실제 수행)
1. `pnpm build` → `.next/static/css/*.css` 생성 확인
2. Python으로 CSS 파일 파싱 → `:root` offset < `[data-theme=dark]` offset 검증 (cascade)
3. `[data-theme=dark]` 블록 내 `--landing-{token}:` 13 개 전수 포함 검증
4. 실패 시 → **SPIKE-THEME-01** 분기 (1일 budget, IMP-KIT-036):
   - 대안 1: `darkMode: 'selector'` 우선순위
   - 대안 2: `@layer` 활용 특이성 상승
   - 대안 3: next-themes `attribute="class"` + `.dark` 전환

### Acceptance
- [ ] 번들 크기 기록 (First Load JS / CSS gzipped)
- [ ] NFR-007: Cascade 순서 `:root` → `[data-theme=dark]` + 13 개 `--landing-*` 전수 포함 증거
- [ ] NFR-008: `pnpm build` 성공 + `out/` 정적 서빙 HTTP 200 확인
- [ ] decision-log D-009 등록

### Rollback 조건
NFR-007 실패 + 3 대안 모두 실패 → SPIKE 보고 + 사용자 승인 후 설계 전환 또는 F1 Hold

---

## T-THEME-04 — ThemeToggle + Navbar

**REQ**: REQ-007, REQ-008, REQ-009, REQ-010 (navbar 부분)
**PR**: PR-2 (PR-1 merge 후)

### Scope
- `src/components/ThemeToggle.tsx` 신규
  - `useTheme()` hook + `mounted` state + Sun/Moon 아이콘
  - `aria-label="테마 전환"` + focus-visible ring
- `src/components/sections/header.tsx` — `<ThemeToggle />` 우측 상단 배치 + navbar 자체 다크 하드코딩 클래스 치환

### TDD RED
`src/__tests__/ThemeToggle.test.tsx` (선택) + `light-theme.test.tsx` navbar axe 검증

### Acceptance
- [ ] ThemeToggle 컴포넌트 작성 완료
- [ ] lucide-react Sun/Moon 사용 (Non-Duplication)
- [ ] `mounted` state 방어 존재
- [ ] 5 뷰포트 모두 navbar 우측 상단 가시 (768/390 hamburger 상대 위치 확정)
- [ ] navbar 다크 하드코딩 3중 grep 0결과
- [ ] axe-core 라이트 모드 navbar 0 violations (NFR-001)

---

## T-THEME-05 — Hero + Features 토큰 치환

**REQ**: REQ-010 (hero/features 부분)
**PR**: PR-3 (PR-1 merge 후, PR-2와 병렬 가능)

### Scope
- `src/components/sections/hero.tsx`
- `src/components/sections/features.tsx`
- 다크 하드코딩 → 토큰 클래스 치환 (상세: [04-implementation-hints.md §1 T-THEME-05](../00-context/04-implementation-hints.md))

### TDD RED
Hero + Features 섹션별 axe-core 라이트 모드 테스트

### Acceptance
- [ ] hero/features 범위 3중 grep 0건
- [ ] 스냅샷 회귀 100% 일치
- [ ] axe-core 라이트 모드 0 violations
- [ ] WCAG AA 4.5:1 (text-muted-foreground 검증)

---

## ~~T-THEME-06~~ — ⚠️ SKIPPED

**상태**: SKIPPED ([decision-log D-003](../00-context/02-decision-log.md) 참조, 결정일 2026-04-23)

**사유**: `src/components/sections/pricing.tsx`, `testimonials.tsx` 파일 **미존재** 감사 완료. Landing 실제 구조는 hero/features/footer/header/integrations/problems/products/cta 8 파일로 구성되며 pricing/testimonials 섹션이 존재하지 않음.

**영향**:
- PR-4 제거, 6 PR → **5 PR** 재구성
- ~~REQ-010 (pricing/testimonials 부분)~~ 비해당
- ~~TC-F1-06~~ 비해당

**재등록 조건**: Pricing/Testimonials 섹션 신규 요구 발생 시 **별도 Feature** 로 등록 (본 F1 은 skip 상태로 완결).

---

## T-THEME-07 — Footer + Shared UI 토큰 치환

**REQ**: REQ-010 (footer), REQ-012 (shared UI)
**PR**: PR-5

### Scope
- `src/components/sections/footer.tsx`
- `src/components/sections/cta.tsx`
- `src/components/sections/integrations.tsx`
- `src/components/sections/problems.tsx`
- `src/components/sections/products.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/shared/gradient-blob.tsx`
- `src/components/shared/section-wrapper.tsx`

### Acceptance
- [ ] 전체 파일 3중 grep 0건
- [ ] shadcn UI alias 정합 (`--color-primary` 등) 확인
- [ ] axe 라이트 모드 0 violations

---

## T-THEME-08 — Dash-Preview 7파일 토큰 치환 (F5 merge 후)

**REQ**: REQ-011
**PR**: PR-6 (PR-1 merge 후 + **F5 merge 후**)

### Scope (7파일)
- `src/components/dashboard-preview/preview-chrome.tsx`
- `src/components/dashboard-preview/interactive-tooltip.tsx`
- `src/components/dashboard-preview/ai-register-main/order-form/datetime-card.tsx`
- `src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx`
- `src/components/dashboard-preview/ai-register-main/order-form/settlement-section.tsx`
- `src/components/dashboard-preview/ai-register-main/order-form/transport-option-card.tsx`
- `src/components/dashboard-preview/ai-register-main/order-form/index.tsx`

### 선행 조건 확인 (F5 완료)
```bash
grep -rn "<AiExtractJsonViewer" src/                                           # 0 기대 (F5 T-CLEANUP-01)
grep -n "자동 배차" src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx  # 모두 "자동 배차 대기" (F5 T-CLEANUP-02)
```

### Acceptance
- [ ] F5 merge 선행 확인
- [ ] 7파일 3중 grep 0건
- [ ] 기존 다크 렌더 스냅샷 100% 일치
- [ ] axe-core 라이트 모드 0 violations
- [ ] F2/F3/F4 Phase B/C 진입용 토큰화된 기반 확보

---

## T-THEME-09 — AI 패널 8파일 토큰 치환 (D-016, P0)

**REQ**: REQ-011 확장 (D-016)
**PR**: PR-7 (T-THEME-08 merge 후)
**Priority**: **P0** (라이트 모드 완전 가시성 — 프리뷰 QA 결과 검은색 블록 완전 노출)

### Scope (8파일)
- `src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx`
- `src/components/dashboard-preview/ai-register-main/ai-panel/ai-tab-bar.tsx`
- `src/components/dashboard-preview/ai-register-main/ai-panel/ai-input-area.tsx`
- `src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-button.tsx`
- `src/components/dashboard-preview/ai-register-main/ai-panel/ai-result-buttons.tsx`
- `src/components/dashboard-preview/ai-register-main/ai-panel/ai-button-item.tsx`
- `src/components/dashboard-preview/ai-register-main/ai-panel/ai-warning-badges.tsx`
- `src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer.tsx`

### 치환 패턴 (D-015 알파 패턴 원칙 재사용)
- `bg-black/40` → `bg-card/50` (AI 패널 컨테이너)
- `bg-black/20~30` → `bg-muted/30~50`
- `text-white` → `text-foreground`
- `text-white/40~60` → `text-muted-foreground`
- `text-white/70` → `text-foreground/80`
- `text-white/80~90` → `text-foreground`
- `text-gray-400~500` → `text-muted-foreground`
- `border-white/10` → `border-border`
- `border-white/5` → `border-border/50`
- 브랜드 gradient 배경 위 `text-white` 는 **유지** (D-010 원칙 승계)

### TDD RED
`src/__tests__/light-theme.test.tsx` T-THEME-09 describe 블록 추가. 8파일 각각 3중 grep 0건 검증.

### Acceptance
- [ ] 8파일 `bg-black`, `text-white`(gradient 제외), `border-white`, `text-gray-*` 3중 grep 0건
- [ ] 기존 테스트 PASS 유지 (ai-panel/__tests__/*.test.tsx)
- [ ] `pnpm typecheck` 0 errors
- [ ] axe-core 라이트 모드 0 violations
- [ ] 프리뷰 (1440px 라이트) 육안 검증: AI 패널 가시성 확보

---

## T-THEME-10 — Legacy 4파일 토큰 치환 (D-016, P1)

**REQ**: REQ-011 확장 (D-016)
**PR**: PR-7 (T-THEME-09 이후 직렬)
**Priority**: **P1** (legacy 렌더 경로 가시성 완성)

### Scope (4파일)
- `src/components/dashboard-preview/ai-panel-preview.tsx` (~8 지점)
- `src/components/dashboard-preview/form-preview.tsx` (~6 지점)
- `src/components/dashboard-preview/mobile-card-view.tsx` (~14 지점)
- `src/components/dashboard-preview/step-indicator.tsx` (~1 지점)

### 치환 패턴
T-THEME-09 와 동일 (D-015 알파 패턴 원칙).

### TDD RED
`src/__tests__/light-theme.test.tsx` T-THEME-10 describe 추가.

### Acceptance
- [ ] 4파일 3중 grep 0건 (gradient 예외 제외)
- [ ] 기존 legacy 스냅샷/테스트 PASS
- [ ] `pnpm typecheck` 0 errors

---

## T-THEME-11 — Products/Integrations 카드 배경 강화 (D-016, P1)

**REQ**: REQ-010 보강 (D-016 QA)
**PR**: PR-7 (T-THEME-10 이후)
**Priority**: **P1** (시각 가독)

### Scope (2파일)
- `src/components/sections/products.tsx` Line 68 placeholder (`bg-card/50` → `bg-muted/50` 또는 `bg-card shadow-sm`)
- `src/components/sections/integrations.tsx` Line 27 카드 (동일 treatment)

### 근거
라이트 모드에서 `bg-card/50` 알파 50%는 흰 배경 위 투명도 과도 → 카드 경계/시각 약함. `bg-muted/50` (light: `#f1f5f9` 반투명) 또는 `bg-card` 완전 + `shadow-sm` 로 깊이감 확보.

### Acceptance
- [ ] products.tsx placeholder 배경 강화 (bg-muted/50 또는 shadow-sm)
- [ ] integrations.tsx 카드 배경 강화 (동일)
- [ ] 스냅샷 차이 확인 (의도적 시각 변경)
- [ ] 다크 모드 시각 회귀 0

---

## T-THEME-12 — Problems/order-form 미세 조정 (D-016, P2)

**REQ**: REQ-010 보강 (D-016 QA)
**PR**: PR-7 (T-THEME-11 이후)
**Priority**: **P2** (개선 여지)

### Scope
- `src/components/sections/problems.tsx` Line 31 before 텍스트 `text-muted-foreground/80` 확인/조정
- order-form 카드 배경: `shadow-sm` 추가 (datetime-card / estimate-info-card / settlement-section / transport-option-card — 시각 깊이 부족 시)

### Acceptance
- [ ] problems.tsx before 텍스트 대비 확인 (WCAG AA)
- [ ] order-form 카드 shadow-sm 적용 (선택적, 시각 검토 후)
- [ ] 스냅샷 변경 최소화

---

## 공통 검증 (전 TASK)

각 TASK 완료 시 실행:

```bash
pnpm typecheck                                   # 0 errors
pnpm lint                                        # 0 errors
pnpm test src/__tests__/light-theme.test.tsx    # 0 failures (누적)
```

**3중 grep 스윕** (REQ-014, 전체 경로): [`04-implementation-hints.md §3-1`](../00-context/04-implementation-hints.md) 참조.

---

## PR 매핑 · 최종 검증

| PR | TASK | axe 검증 범위 |
|:-:|------|---------------|
| PR-1 | T-THEME-01~03 | 실험 1컴포넌트 런타임 토글 |
| PR-2 | T-THEME-04 | navbar 범위 |
| PR-3 | T-THEME-05 | hero + features |
| ~~PR-4~~ | ~~T-THEME-06~~ | ⚠️ SKIPPED (D-003) |
| PR-5 | T-THEME-07 | footer + shared UI (cta, integrations, problems, products, footer + ui/ + shared/) |
| PR-6 | T-THEME-08 | dash-preview 7파일 |
| PR-7 | T-THEME-09~12 | ai-panel 8 + legacy 4 + products/integrations + problems/order-form (D-016) |

**D+7 진척 평가** (2026-05-02): PR-1 + PR-2/3 merge 완료 여부 확인. 미달 시 Phase A 1주 연장 (Epic §6 리스크 6).
