# 10. Release Checklist — F1 라이트 모드 전환 인프라

> **6 PR 순차/병렬 릴리스 체크리스트**. 각 PR 독립 검증 + 전체 Feature 최종 검증.
> 각 PR merge 전 모든 체크박스 통과 필수.

---

## PR-1 — Infrastructure (T-THEME-01 + T-THEME-02 + T-THEME-03)

### 구현 체크

- [ ] `src/app/globals.css`: 19개 변수 `var(--landing-*)` 간접화
- [ ] `:root` 라이트 팔레트 19개 정의 (WCAG AA 4.5:1 검증 완료)
- [ ] `[data-theme="dark"]` 다크 팔레트 19개 정의 (기존 값 이관)
- [ ] `@layer base` + `prefers-reduced-motion` 블록 유지
- [ ] `src/app/layout.tsx`: `<html suppressHydrationWarning>` + `<ThemeProvider>` 4속성 + Provider 순서
- [ ] `package.json`: `next-themes ^0.3.0` 추가 + lock 파일 업데이트
- [ ] 토큰 매핑 결정표 (REQ-013) 문서화 완료 (Decision log 또는 별도 파일)

### 검증 체크

- [ ] **NFR-007 실험 검증**: 1 컴포넌트 `bg-white` → `bg-background` 치환 → 런타임 토글 → 색상 변화 확인
- [ ] **실패 시 SPIKE-THEME-01 분기 확인** (1일 cap, 3 대안 평가 완료)
- [ ] `pnpm typecheck` 0 errors
- [ ] `pnpm lint` 0 errors
- [ ] `pnpm test src/__tests__/light-theme.test.tsx` (TC-F1-01~03) 0 failures
- [ ] `pnpm build` 성공
- [ ] 번들 증분 ≤ 1.8 kB gzipped (NFR-003)
- [ ] `pnpm dev --turbopack` 기동 + hydration 경고 0건
- [ ] `pnpm start` (production) 기동 + hydration 경고 0건 (NFR-008)
- [ ] 기존 다크 렌더 스냅샷 100% 일치 (REQ-003 회귀)

---

## PR-2 — Navbar + ThemeToggle (T-THEME-04)

**선행**: PR-1 merge 완료

### 구현 체크

- [ ] `src/components/ThemeToggle.tsx` 신규 작성
- [ ] `useTheme()` hook + `mounted` state + Sun/Moon 아이콘
- [ ] `aria-label="테마 전환"` + focus-visible ring
- [ ] `lucide-react` Sun/Moon 재사용 (Non-Duplication 확인)
- [ ] `src/components/sections/header.tsx` 에 `<ThemeToggle />` 우측 상단 배치
- [ ] navbar 자체 다크 하드코딩 클래스 토큰 치환

### 검증 체크

- [ ] 5 뷰포트 (1440/1280/1024/768/390) 가시성 수동 확인
- [ ] 768/390 hamburger menu 상대 위치 결정 (decision-log 기록)
- [ ] `pnpm test` TC-F1-04 PASS
- [ ] axe-core 라이트 모드 navbar 0 violations
- [ ] navbar 3중 grep 0결과

---

## PR-3 — Hero + Features (T-THEME-05)

**선행**: PR-1 merge 완료 (PR-2와 병렬 가능)

### 구현 체크

- [ ] `src/components/sections/hero.tsx` 토큰 치환
- [ ] `src/components/sections/features.tsx` 토큰 치환

### 검증 체크

- [ ] hero/features 3중 grep 0결과
- [ ] 스냅샷 회귀 100% 일치
- [ ] `pnpm test` TC-F1-05 PASS
- [ ] axe-core 라이트 모드 hero/features 0 violations
- [ ] WCAG AA 4.5:1 (`text-muted-foreground` 검증)

---

## ~~PR-4~~ — ⚠️ SKIPPED

**상태**: SKIPPED ([decision-log D-003](../00-context/02-decision-log.md) 참조)

**사유**: `src/components/sections/pricing.tsx`, `testimonials.tsx` 파일 미존재. Landing 실제 구조에 해당 섹션 없음.

**결정**: 본 F1 은 5 PR 로 완결. Pricing/Testimonials 신규 요구 발생 시 별도 Feature.

**체크**:
- [x] 파일 미존재 확인 완료 (2026-04-23)
- [x] decision-log D-003 등록
- [x] dev-tasks.md T-THEME-06 SKIPPED 표기
- [x] test-cases.md TC-F1-06 SKIPPED 표기
- [x] release-checklist PR-4 SKIPPED 표기 (본 섹션)

---

## PR-5 — Footer + Shared UI (T-THEME-07)

**선행**: PR-1 merge 완료

### 구현 체크

- [ ] `src/components/sections/footer.tsx` 토큰 치환
- [ ] `src/components/sections/cta.tsx` 토큰 치환
- [ ] `src/components/sections/integrations.tsx` 토큰 치환
- [ ] `src/components/sections/problems.tsx` 토큰 치환
- [ ] `src/components/sections/products.tsx` 토큰 치환
- [ ] `src/components/ui/badge.tsx` 토큰 치환
- [ ] `src/components/ui/button.tsx` 토큰 치환
- [ ] `src/components/ui/card.tsx` 토큰 치환
- [ ] `src/components/ui/input.tsx` 토큰 치환
- [ ] `src/components/ui/textarea.tsx` 토큰 치환
- [ ] `src/components/shared/gradient-blob.tsx` 토큰 치환
- [ ] `src/components/shared/section-wrapper.tsx` 토큰 치환

### 검증 체크

- [ ] 전체 파일 3중 grep 0결과
- [ ] shadcn UI alias 정합 확인 (`--color-primary` 등)
- [ ] `pnpm test` TC-F1-07 PASS
- [ ] axe-core 라이트 모드 footer/shared UI 0 violations

---

## PR-6 — Dash-Preview 7파일 (T-THEME-08)

**선행**: PR-1 merge 완료 **+ F5 merge 완료** (Epic §2 F1↔F5 순서)

### F5 완료 확인 (선행 게이트)

- [ ] `grep -rn "<AiExtractJsonViewer" src/` → 0 결과 (F5 T-CLEANUP-01 완료)
- [ ] `grep -n "자동 배차" estimate-info-card.tsx` → 모두 "자동 배차 대기" (F5 T-CLEANUP-02 완료)

### 구현 체크

- [ ] `preview-chrome.tsx` 토큰 치환
- [ ] `interactive-tooltip.tsx` 토큰 치환
- [ ] `datetime-card.tsx` 토큰 치환
- [ ] `estimate-info-card.tsx` 토큰 치환
- [ ] `settlement-section.tsx` 토큰 치환
- [ ] `transport-option-card.tsx` 토큰 치환
- [ ] `order-form/index.tsx` 토큰 치환

### 검증 체크

- [ ] 7파일 3중 grep 0결과
- [ ] 기존 다크 렌더 스냅샷 100% 일치 (REQ-011 수용 기준)
- [ ] `pnpm test` TC-F1-08 PASS
- [ ] axe-core 라이트 모드 dash-preview 0 violations

---

## Phase A 최종 검증 (M-Epic-1, 2026-05-06)

### 전수 검증

- [ ] **SM-1**: axe-core 라이트 모드 landing 전역 0 violations (5 뷰포트 × 2 테마 × 6 섹션 + dash-preview)
- [ ] **SM-2**: FOUC 0 프레임 (Chrome DevTools Performance 측정)
- [ ] **SM-3**: 번들 증분 ≤ 2 kB gzipped
- [ ] **SM-4**: 다크 하드코딩 3중 grep 0건
- [ ] **SM-5**: Hydration 경고 0건 (dev + production)
- [ ] **SM-6**: 전환 지연 ≤ 100ms (Chrome DevTools Performance)
- [ ] **SM-7**: 6 PR 순차 merge 완료
- [ ] **SM-8**: Tailwind 4 정합 검증 통과 (NFR-007)
- [ ] **SM-9**: WCAG AA 대비 비율 ≥ 4.5:1 / ≥ 3:1
- [ ] **SM-10**: 테스트 커버리지 67 tests (60 스냅샷 + 6 jest-axe + 1 SSR) 0 failures

### Epic Phase A 종료 조건 충족 (Epic Children §4)

- [ ] F1 구현 완료 + 테스트 통과 + 리뷰 승인 → F1 Feature 상태 `archived`
- [ ] 라이트 모드 MVP 작동 (토글 + `prefers-color-scheme` 자동 전환 양쪽)
- [ ] axe-core 라이트 모드 0 violations (landing 전역 기준, 지표 4 중간 평가)

### D+7 진척 평가 (2026-05-02)

- [ ] PR-1 merge 완료
- [ ] PR-2 + PR-3 merge 완료 (또는 진행 중)
- [ ] 미달 시: Phase A 1주 연장 즉시 판단 (Epic §6 리스크 6)

---

## Archive 준비 (Phase A 종료 후)

- [ ] Epic `01-children-features.md` F1 상태 `approved → archived` 갱신
- [ ] `/plan-archive f1-landing-light-theme` 실행 (또는 Epic archive 일괄 처리)
- [ ] 관련 drafts (`.plans/drafts/f1-landing-light-theme/`) 이관
- [ ] `.plans/archive/index.md` 갱신

---

## 변경 이력

| 날짜 | 변경 |
|------|------|
| 2026-04-23 | 초안 — 6 PR 체크리스트 + Phase A 최종 검증. |
