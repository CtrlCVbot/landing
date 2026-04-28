# 01. PRD Freeze — F1 라이트 모드 전환 인프라

> **Frozen at**: 2026-04-23 (Phase A Step 9 `/dev-feature` 진입 시점)
> **PRD source (SSOT)**: [`../../../../drafts/f1-landing-light-theme/02-prd.md`](../../../../drafts/f1-landing-light-theme/02-prd.md)
> **Freeze 의미**: 본 Feature 구현 시점의 PRD 스냅샷. PRD 원본 변경 시 Feature Package 재승인 필요.

---

## 1. 범위 (Scope)

- **Lane**: Standard (PRD 10 섹션 + 14 REQ + 10 NFR + 10 SM)
- **시나리오**: A (Greenfield — 라이트 팔레트 신규 도입)
- **Feature 유형**: dev (코드 구현 중심)
- **Hybrid**: false (레퍼런스 캡처 불필요)
- **PCC 리뷰**: 5/5 PASS (plan-reviewer 2026-04-23)

---

## 2. 요구사항 요약 (PRD §5 승계)

### Functional Requirements (14건)

| ID | 제목 | 파일 |
|----|------|------|
| REQ-001 | `@theme inline` 19개 변수 `var(--landing-*)` 간접화 | `src/app/globals.css` |
| REQ-002 | `:root` 라이트 팔레트 19개 변수 정의 | `src/app/globals.css` |
| REQ-003 | `[data-theme="dark"]` 다크 팔레트 19개 변수 정의 | `src/app/globals.css` |
| REQ-004 | `next-themes ^0.3.0` dependency 추가 | `package.json` |
| REQ-005 | `<ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>` 주입 | `src/app/layout.tsx` |
| REQ-006 | `<html suppressHydrationWarning>` 속성 추가 | `src/app/layout.tsx` |
| REQ-007 | `ThemeToggle` 컴포넌트 신규 + `mounted` state 방어 | `src/components/ThemeToggle.tsx` |
| REQ-008 | navbar 우측 상단 `<ThemeToggle />` 배치 | `src/components/sections/header.tsx` |
| REQ-009 | lucide-react `Sun` / `Moon` 재사용 | `src/components/ThemeToggle.tsx` |
| REQ-010 | landing 섹션 전역 다크 하드코딩 클래스 토큰 치환 | `src/components/sections/*.tsx` |
| REQ-011 | dash-preview 7파일 토큰 치환 (F5 merge 후) | `src/components/dashboard-preview/**/*.tsx` |
| REQ-012 | shared UI 전수 치환 | `src/components/ui/*.tsx`, `src/components/shared/*.tsx` |
| REQ-013 | 토큰 매핑 결정표 작성 (PR-1 포함) | 문서 |
| REQ-014 | 3중 grep 스윕 (기본 + cn/clsx + template literal) | 검증 |

### Non-Functional Requirements (10건)

| ID | 내용 | 목표값 |
|----|------|--------|
| NFR-001 | axe-core 라이트 모드 landing 전역 | 0 violations |
| NFR-002 | FOUC 프레임 | 0 프레임 |
| NFR-003 | 번들 크기 증분 | ≤ 2 kB gzipped |
| NFR-004 | Hydration 경고 | 0 건 |
| NFR-005 | 테마 전환 시각 지연 | ≤ 100 ms |
| NFR-006 | `prefers-reduced-motion` 존중 | 유지 |
| NFR-007 | Tailwind 4 `@theme inline` + `[data-theme="dark"]` 정합 | PR-1 실험 검증 |
| NFR-008 | Turbopack dev + production 호환 | 양쪽 호환 |
| NFR-009 | WCAG AA 대비 비율 | ≥ 4.5:1 (text) / ≥ 3:1 (UI) |
| NFR-010 | 테스트 커버리지 | 60 스냅샷 + 6 jest-axe + 1 SSR |

### Success Metrics (10건)

| ID | 지표 | 목표 | 측정 |
|----|------|------|------|
| SM-1 | axe-core 라이트 모드 | 0 violations | `@axe-core/react` + `jest-axe` |
| SM-2 | FOUC 프레임 | 0 | Chrome DevTools Performance |
| SM-3 | 번들 증분 | ≤ 2 kB gzipped | `next build` |
| SM-4 | 다크 하드코딩 잔존 | 0 건 | 3중 grep |
| SM-5 | Hydration 경고 | 0 건 | dev/production 콘솔 |
| SM-6 | 전환 지연 | ≤ 100 ms | Chrome DevTools Performance |
| SM-7 | PR 순차 merge | 6/6 | GitHub PR |
| SM-8 | Tailwind 4 정합 | 통과 | PR-1 실험 |
| SM-9 | WCAG AA 대비 | ≥ 4.5:1 / ≥ 3:1 | axe color-contrast |
| SM-10 | 테스트 커버리지 | 67 tests | `pnpm test` |

---

## 3. Milestones (PRD §8)

| PR | 범위 | 기간 | 의존 |
|----|------|------|------|
| PR-1 | Infrastructure (globals.css + layout.tsx + next-themes + 토큰 매핑 + NFR-007 실험) | D+0~D+3 | — |
| PR-2 | Navbar + ThemeToggle | D+3~D+5 | PR-1 merge |
| PR-3 | Hero + Features | D+3~D+5 | PR-1 merge (PR-2 병렬) |
| PR-4 | Pricing + Testimonials (existence 확인) | D+5~D+7 | PR-1 merge (PR-2/3 병렬) |
| PR-5 | Footer + Shared UI | D+5~D+9 | PR-1 merge |
| PR-6 | Dash-Preview 7파일 | D+9~D+10 | PR-1 merge + F5 merge |

**총 기간**: 10 영업일 (2026-04-23 ~ 2026-05-06) — RICE Effort 10 인·일 정합.
**D+7 진척 평가** (2026-05-02): PR-1 + PR-2/3 merge 완료. 미달 시 Phase A 1주 연장 판단 (Epic §6 리스크 6).

---

## 4. Risks (PRD §9 주요)

| ID | 리스크 | 완화책 |
|----|--------|-------|
| R-1 | Tailwind 4 `@theme inline` + `[data-theme="dark"]` 런타임 오버라이드 실패 | PR-1 실험 검증 (NFR-007), 실패 시 SPIKE-THEME-01 (1일 cap, IMP-KIT-036) |
| R-2 | 3중 grep 스윕 누락 (조건부 클래스) | REQ-014 — cn/clsx + template literal 이스케이프 패턴 필수 |
| R-3 | Hydration mismatch | 3중 방어 (suppressHydrationWarning + disableTransitionOnChange + mounted state) |
| R-4 | F1↔F2/F3/F4 파일 충돌 (dash-preview) | PR-6 F5 merge 후 진행 + Phase A/B/C 시간 분리 |
| R-5 | F1 내부 PR 6개 리뷰 오버헤드 | 섹션별 검증 독립 + 회귀 스냅샷 병렬 |
| R-6 | Phase A 2주 타이트 | D+7 진척 평가 → 미달 시 1주 연장 |

---

## 5. Freeze 조건 변경 시

PRD 원본 (`02-prd.md`) 의 다음 항목 변경 시 본 freeze 무효:

- REQ / NFR / SM 추가·삭제·수정
- Milestones PR 구성 변경
- Lane 재판정 (Standard → Lite 또는 역방향)
- 시나리오 재판정 (A ↔ B ↔ C)

변경 발생 시 `/dev-feature` 재실행으로 Feature Package 갱신.
