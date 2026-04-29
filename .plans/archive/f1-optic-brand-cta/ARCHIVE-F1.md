# Archive: F1 브랜드, 로고, CTA 최소 반영

> **Key**: F1 | **Slug**: `f1-optic-brand-cta` | **IDEA**: IDEA-20260428-001
> **Category**: Lite | **RICE Score**: 76.35 | **Archived**: 2026-04-29
> **Code Location**: `src/lib/constants.ts`, `src/components/sections/header.tsx`, `src/components/sections/footer.tsx`, `src/components/icons/optic-logo.tsx`
> **Pipeline**: Idea -> Screening -> Draft -> Bridge -> Dev Feature -> Dev Run -> Dev Verify -> Archive
> **Epic**: EPIC-20260428-001

---

## 1. 요약

`final-prompt-package`의 첫 실행 단위로, 랜딩의 주 브랜드와 서비스 진입 CTA를 `OPTIC` 기준으로 고정했다. Header와 mobile menu에는 `OPTIC 바로가기`와 `도입 문의하기`를 분리했고, Footer는 `OPTIC` 주 브랜드와 `Powered by OPTICS` 보조 표기를 유지한다.

F1은 이후 F2 카피 정리와 F5 브랜드 자산 검증이 참조할 기준점이다.

## 2. 원본 파일 매니페스트

| 원본 경로 | 현재 위치 | 유형 |
|---|---|---|
| `.plans/ideas/20-approved/IDEA-20260428-001.md` | `sources/ideas/IDEA-20260428-001.md` | IDEA |
| `.plans/ideas/20-approved/SCREENING-20260428-001.md` | `sources/ideas/SCREENING-20260428-001.md` | Screening |
| `.plans/drafts/f1-optic-brand-cta/` | `sources/drafts/` | Draft / Scope Review / Routing |
| `.plans/features/active/f1-optic-brand-cta/` | `sources/feature-package/` | Feature Package |

## 3. 코드 커밋

| 커밋 | 역할 |
|---|---|
| `b13f1a5` | 브랜드/CTA 상수, Header/Footer CTA, 테스트 구현 |
| `792f371` | `/dev-verify` fresh verification report 기록 |
| `03a8f1d` | OPTIC 로고 텍스트 두께 조정 |

## 4. 완료 근거

| 항목 | 결과 | 근거 |
|---|:---:|---|
| TASK | pass | T-BRAND-01~04 완료 |
| `/dev-verify` | pass | `sources/feature-package/03-dev-notes/dev-verification-report.md` |
| Service URL | pass | `https://mm-broker-test.vercel.app/` 200 |
| Browser QA | pass | 1440px, 768px, 375px CTA 확인 |
| Post-verify logo weight check | pass | `03a8f1d` 후 targeted tests, typecheck, lint 통과 |
| Scope guard | pass | dashboard-preview, mock-data, preview-steps, globals.css, package files 변경 없음 |

## 5. 검증 요약

| 검증 | 결과 | 메모 |
|---|:---:|---|
| `pnpm test -- header.test.tsx footer.test.tsx` | pass | 2 files, 4 tests |
| `pnpm typecheck` | pass | 0 errors |
| `pnpm lint` | pass with WARN | 기존 dashboard-preview warnings만 재노출 |
| `/dev-verify` full record | pass with WARN | 기존 React `act(...)` 및 lint warnings는 범위 외 |

## 6. 남은 참고사항

| 항목 | 상태 | 후속 |
|---|---|---|
| 로고 이미지/자산 최종 승인 | deferred | F5 브랜드 자산, 메타데이터, 검증 정리 |
| 공식 production 도메인 전환 | deferred | Epic 후속 범위 |
| F2 카피 기준 | ready | `BRAND`, `CTA_LINKS` 상수를 기준점으로 사용 |

## 7. 다음 단계

1. F2 — 카피와 제품 라인업 정리 IDEA를 등록한다.
2. F2/F5 진행 시 이 archive의 `BRAND`, `CTA_LINKS`, release checklist를 기준점으로 참조한다.
