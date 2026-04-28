# Archive: F1 라이트 모드 전환 인프라

> **Key**: F1 | **Slug**: `f1-landing-light-theme` | **IDEA**: IDEA-20260423-002
> **Category**: Standard | **RICE Score**: 1.89 (Standard Lane 보정 Go) | **Archived**: 2026-04-24
> **Code Location**: `src/app/globals.css`, `src/app/layout.tsx`, `src/components/**`
> **Pipeline**: Idea -> Screening -> Draft -> PRD -> Bridge -> Dev -> Verify -> Archive
> **Epic**: EPIC-20260422-001

---

## 1. 요약

landing 전역에 라이트/다크 테마 전환 인프라를 도입한 Phase A 핵심 Feature다. `next-themes`, `data-theme`, Tailwind 4 `@theme inline` 기반 토큰, navbar `ThemeToggle`, landing 전역 컴포넌트 스윕, dash-preview 확장까지 포함한다.

## 2. 원본 파일 매니페스트

| 원본 경로 | 현재 위치 | 유형 |
|---|---|---|
| `.plans/ideas/00-inbox/IDEA-20260423-002.md` | `sources/ideas/IDEA-20260423-002.md` | IDEA |
| `.plans/drafts/f1-landing-light-theme/` | `sources/drafts/` | Draft / PRD / Routing |
| `.plans/features/active/f1-landing-light-theme/` | `sources/feature-package/` | Feature Package |

## 3. 완료 근거

| 항목 | 결과 | 근거 |
|---|---|---|
| TASK | 완료 | T-THEME-01~14 완료, T-06 skip per D-003 |
| Feature 상태 | archived | 2026-04-24 archive bundle 생성 및 원본 이동 |
| 현재 baseline 검증 | 통과 | `pnpm test` 44 files / 980 tests PASS |
| 기존 Feature 검증 기록 | 통과 | dev-verify PASS with WARN, typecheck 0, lint 0, build 164 kB 기록 |

## 4. 남은 참고사항

- 이번 archive 직전 `pnpm test` 는 통과했지만 React `act(...)` warning 이 stderr 에 남아 있다.
- 문서 원본은 `sources/` 아래로 보존했다. 이후 F2/F4는 이 archived 상태를 기준선으로 삼는다.

## 5. Phase 연결

F1 archive 완료로 Phase A 종료 조건 중 `/plan-archive f1-landing-light-theme` 항목을 충족했다. Phase B에서는 F2/F4가 active Epic 상태를 유지한 채 새 IDEA에서 시작한다.
