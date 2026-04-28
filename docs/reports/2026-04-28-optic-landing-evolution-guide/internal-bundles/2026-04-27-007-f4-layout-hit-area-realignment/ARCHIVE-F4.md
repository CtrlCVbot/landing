# Archive: F4 레이아웃 정비 + Hit-Area 재정렬

> **Key**: F4 | **Slug**: `f4-layout-hit-area-realignment` | **IDEA**: IDEA-20260424-002
> **Category**: Standard | **RICE Score**: 72.8 (Go) | **Archived**: 2026-04-27
> **Code Location**: `src/components/dashboard-preview/**`
> **Pipeline**: Idea -> Screening -> Draft -> PRD -> Review -> Bridge -> Dev -> Verify -> Archive
> **Epic**: EPIC-20260422-001

---

## 1. 요약

Phase B의 dash-preview 레이아웃 정확도 Feature다. `DateTimeCard`를 2열로 정리하고, hit-area와 tooltip 위치 기준을 static bounds에서 실제 DOMRect 측정으로 전환했다. 사용자 스크린샷 QA에서 확인된 tooltip/ring 오프셋은 D-F4-010/D-F4-011로 보강했다.

## 2. 원본 파일 매니페스트

| 원본 경로 | 현재 위치 | 유형 |
|---|---|---|
| `.plans/ideas/20-approved/IDEA-20260424-002.md` | `sources/ideas/IDEA-20260424-002.md` | IDEA |
| `.plans/ideas/20-approved/SCREENING-20260424-002.md` | `sources/ideas/SCREENING-20260424-002.md` | Screening |
| `.plans/drafts/f4-layout-hit-area-realignment/` | `sources/drafts/` | Draft / PRD / Review / Routing |
| `.plans/features/active/f4-layout-hit-area-realignment/` | `sources/feature-package/` | Feature Package / Dev Notes |

## 3. 완료 근거

| 항목 | 결과 | 근거 |
|---|---|---|
| TASK | 완료 | T-F4-LAYOUT-01~05 완료 |
| Feature 상태 | archived | 2026-04-27 archive bundle 생성 및 원본 이동 |
| Unit/Component tests | 통과 | `pnpm test` 45 files / 990 tests PASS |
| Typecheck | 통과 | `pnpm typecheck` PASS |
| Lint | 통과 | `pnpm lint` PASS with existing warnings |
| Build | 통과 | `pnpm build` PASS, route `/` first load JS 165 kB |
| Browser spot check | 통과 | 1440/1024/768 viewport, 18 targets, max delta 0~0.1px |

## 4. 주요 결정

| Decision | 내용 |
|---|---|
| D-F4-008 | F5 이후 hit-area target count는 18개로 유지 |
| D-F4-009 | Overlay anchor는 `ScaledContent` 내부로 이동 |
| D-F4-010 | Hit-area 좌표는 DOM 실측값을 static bounds보다 우선 |
| D-F4-011 | 초기 측정 전에는 fallback hit-area를 렌더하지 않음 |

## 5. 남은 참고사항

- `package.json`의 `claude-kit` dependency diff는 F4 변경이 아니라 기존 working tree 변경으로 분리했다.
- `pnpm lint`와 `pnpm build`는 통과했지만 기존 unused var / hook dependency / Next.js workspace warning은 남아 있다.
- F2 Mock 스키마 재설계가 Phase B의 남은 핵심 작업이다.

## 6. Phase 연결

F4 archive 완료로 Phase B의 레이아웃 정확도 축은 닫혔다. Phase B 종료를 위해서는 F2 구현과 archive가 남아 있으며, 이후 F3 옵션-요금 파생 로직으로 이어진다.
