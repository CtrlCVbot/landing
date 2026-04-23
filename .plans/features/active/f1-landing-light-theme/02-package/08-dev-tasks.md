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

**합계**: 9 인·일 (T-THEME-06 skip 반영, 직렬) / 약 8.5 인·일 (PR 병렬).
**PR 개수**: 6 → **5** (PR-4 Skip, [decision-log D-003](../00-context/02-decision-log.md) 참조).

---

## T-THEME-01 — globals.css 토큰 이중화

**REQ**: REQ-001, REQ-002, REQ-003
**PR**: PR-1

### Scope
- `src/app/globals.css` 수정
  - `@theme inline` 19개 `--color-*` 변수 → `var(--landing-*)` 간접화
  - `:root { --landing-*: ... }` 라이트 팔레트 19개 신규 정의 (WCAG AA ≥ 4.5:1)
  - `[data-theme="dark"] { --landing-*: ... }` 다크 팔레트 19개 정의 (기존 다크 값 이관)
  - 기존 `@layer base` + `prefers-reduced-motion` 블록 **유지** (NFR-006)

### TDD RED (선행)
`src/__tests__/light-theme.test.tsx` 작성 — `:root` 라이트 팔레트 대비 규칙 검증 (axe color-contrast)

### Acceptance
- [ ] 19개 변수 `var(--landing-*)` 간접화 확인 (grep)
- [ ] `:root` 라이트 팔레트 19개 정의 완료
- [ ] `[data-theme="dark"]` 다크 팔레트 19개 정의 완료
- [ ] `pnpm build` 성공 (Tailwind 4 빌드 통과)
- [ ] 기존 다크 렌더 시각 회귀 스냅샷 100% 일치

### Non-goals
- 토큰 값 스케일 재설계 (차기 Epic)
- 3번째 테마 값 정의 (구조만 확장 가능하게)

---

## T-THEME-02 — layout.tsx ThemeProvider 주입

**REQ**: REQ-005, REQ-006
**PR**: PR-1

### Scope
- `src/app/layout.tsx` 수정
  - `<html>` 태그에 `suppressHydrationWarning` 추가 (REQ-006)
  - `<body>` 내부 최상위에 `<ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>` 래퍼 추가 (REQ-005)
  - Provider 순서: `ThemeProvider > MotionProvider > children` (PRD §7.3)

### TDD RED
SSR 초기 렌더 테스트 작성 (cookie 없음 · localStorage 있음 · OS 다크·라이트 4 조합)

### Acceptance
- [ ] `<html lang="ko" className={inter.variable} suppressHydrationWarning>` 확인
- [ ] ThemeProvider 4개 속성 모두 명시
- [ ] Provider 순서 정확 (ThemeProvider 바깥, MotionProvider 안쪽)
- [ ] `pnpm dev --turbopack` 콘솔 hydration 경고 0건 (NFR-004)

### Non-goals
- Cookie 기반 SSR 초기값 주입 (next-themes 내부 처리)

---

## T-THEME-03 — next-themes 설치 + Tailwind 4 정합 검증 (PR-1 핵심 게이트)

**REQ**: REQ-004
**PR**: PR-1
**Critical gate**: NFR-007 (Tailwind 4 런타임 오버라이드 정합)

### Scope
- `package.json` — `next-themes ^0.3.0` dependency 추가
- `pnpm-lock.yaml` — `pnpm install` 산출물
- 실험 컴포넌트 1개 (예: `src/components/sections/header.tsx` 일부, 또는 임시 test 파일) — `bg-white` → `bg-background` 1건 치환 → 런타임 토글 검증

### NFR-007 검증 절차
1. `pnpm install`
2. `document.documentElement.setAttribute('data-theme', 'dark')` 콘솔 실행
3. 배경색 변화 발생 확인
4. 실패 시 → **SPIKE-THEME-01** 분기 (1일 budget, IMP-KIT-036):
   - 대안 1: `darkMode: 'selector'` 우선순위
   - 대안 2: `@layer` 활용 특이성 상승
   - 대안 3: next-themes `attribute="class"` + `.dark` 전환

### Acceptance
- [ ] `pnpm install` 성공 + 번들 증분 ≤ 1.8 kB gzipped (NFR-003 측정)
- [ ] 런타임 토글 → 색상 변화 발생
- [ ] `pnpm build && pnpm start` (production) 호환 확인 (NFR-008)

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

**D+7 진척 평가** (2026-05-02): PR-1 + PR-2/3 merge 완료 여부 확인. 미달 시 Phase A 1주 연장 (Epic §6 리스크 6).
