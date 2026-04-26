# Archive: F5 UI 잔재 정리

> **Key**: F5 | **Slug**: `f5-ui-residue-cleanup` | **IDEA**: IDEA-20260423-001
> **Category**: Lite | **RICE Score**: 5.95 (Go) | **Archived**: 2026-04-24
> **Code Location**: `src/components/dashboard-preview/**`, `src/lib/mock-data.ts`
> **Pipeline**: Idea -> Screening -> Draft -> Bridge -> Dev -> Verify -> Archive
> **Epic**: EPIC-20260422-001

---

## 1. 요약

Phase 3 이후 남은 UI 잔재를 정리한 Lite Feature다. `AiExtractJsonViewer` 화면 노출을 제거하고, "자동 배차" 문구를 "자동 배차 대기"로 정리해 F2 mock schema 재설계가 더 깨끗한 상태에서 시작되도록 만들었다.

## 2. 원본 파일 매니페스트

| 원본 경로 | 현재 위치 | 유형 |
|---|---|---|
| `.plans/ideas/00-inbox/IDEA-20260423-001.md` | `sources/ideas/IDEA-20260423-001.md` | IDEA |
| `.plans/drafts/f5-ui-residue-cleanup/` | `sources/drafts/` | Draft / Routing |
| `.plans/features/active/f5-ui-residue-cleanup/` | `sources/feature-package/` | Feature Package |

## 3. 완료 근거

| 항목 | 결과 | 근거 |
|---|---|---|
| TASK | 완료 | T-CLEANUP-01~04 완료 |
| Feature 상태 | archived | 2026-04-24 archive bundle 생성 및 원본 이동 |
| 현재 baseline 검증 | 통과 | `pnpm test` 44 files / 980 tests PASS |
| 기존 Feature 검증 기록 | 통과 | /dev-verify PASS, 624 tests PASS 기록 |

## 4. 남은 참고사항

- 이번 archive 직전 `pnpm test` 는 통과했지만 React `act(...)` warning 이 stderr 에 남아 있다.
- `jsonViewerOpen` 관련 mock 정리는 F2에서 schema 재설계와 함께 이어서 다룬다.

## 5. Phase 연결

F5 archive 완료로 F2 선행 정리 조건을 충족했다. Phase B에서는 F2가 정리된 mock-data 기반 위에서 `extractedFrame` / `appliedFrame` 구조를 설계한다.
