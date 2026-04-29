# Archive: F2 카피와 제품 라인업 정리

> **Key**: F2 | **Slug**: `f2-optic-copy-product-lineup` | **IDEA**: IDEA-20260429-001
> **Category**: Standard | **RICE Score**: 78.0 | **Archived**: 2026-04-29
> **Code Location**: `src/lib/constants.ts`, `src/components/sections/products.tsx`, `src/components/sections/hero.tsx`
> **Pipeline**: Idea -> Screening -> Draft -> PRD -> Wireframe -> Bridge -> Dev Feature -> Dev Run -> Dev Verify -> Archive
> **Epic**: EPIC-20260428-001

---

## 1. 요약

F2는 F1에서 고정한 `OPTIC` 브랜드 기준을 landing 본문 카피와 제품 라인업으로 확장한 작업이다.

핵심 결과는 다음과 같다.

- 제품 라인업에서 `주선사용 운송 운영 콘솔` / `OPTIC Broker`와 `화주용 운송 요청 포털` / `OPTIC Shipper`를 현재 구현 대상으로 구분했다.
- `OPTIC Carrier`, `OPTIC Ops`, `OPTIC Billing`은 구현 예정 제품으로 분리했다.
- `화물맨 연동`을 배차 단계 기능으로 추가했다.
- `정산 자동화`, `세금계산서 관리`, 회사별 요청 양식/정산 기준 맞춤 메시지를 customer-facing copy에 반영했다.
- `Google Gemini AI`, `카카오 맵`, `팝빌`, `로지스엠` 등 provider-first 표현은 production copy에서 제거했다.

## 2. 원본 파일 매니페스트

| 원본 경로 | 현재 위치 | 유형 |
|---|---|---|
| `.plans/ideas/20-approved/IDEA-20260429-001.md` | `sources/ideas/IDEA-20260429-001.md` | IDEA |
| `.plans/ideas/20-approved/SCREENING-20260429-001.md` | `sources/ideas/SCREENING-20260429-001.md` | Screening |
| `.plans/drafts/f2-optic-copy-product-lineup/` | `sources/drafts/` | Draft / PRD Review / Routing |
| `.plans/prd/10-approved/f2-optic-copy-product-lineup-prd.md` | `sources/prd/f2-optic-copy-product-lineup-prd.md` | PRD |
| `.plans/wireframes/f2-optic-copy-product-lineup/` | `sources/wireframes/` | Wireframe |
| `.plans/features/active/f2-optic-copy-product-lineup/` | `sources/feature-package/` | Feature Package / Dev Notes |

## 3. 코드 커밋

| 커밋 | 역할 |
|---|---|
| `8b25cd6` | F2 OPTIC 카피와 제품 라인업 구현 |
| `77babf4` | F2 `/dev-verify` 결과 기록 |

## 4. 완료 근거

| 항목 | 결과 | 근거 |
|---|:---:|---|
| `/dev-run` | pass | `sources/feature-package/03-dev-notes/dev-output-summary.md` |
| `/dev-verify` | pass with warnings | `sources/feature-package/03-dev-notes/dev-verify-report.md` |
| Targeted tests | pass | 5 files, 27 tests |
| Full tests | pass | 52 files, 1111 tests |
| Typecheck | pass | `pnpm typecheck` |
| Lint | pass with warnings | 기존 dashboard-preview warnings만 남음 |
| Build | pass with warnings | static export 생성 |
| Copy scan | pass | 금지 문구 0건, 필수 F2 문구 모두 발견 |
| Browser QA | pass | 1440px, 768px, 375px overflow 없음 |

## 5. 검증 요약

| 검증 | 결과 | 메모 |
|---|:---:|---|
| `pnpm test -- constants.test.ts features.test.tsx products.test.tsx integrations.test.tsx hero.test.tsx` | pass | F2 targeted regression |
| `pnpm test` | pass with WARN | 기존 React `act(...)` warning 출력 |
| `pnpm typecheck` | pass | 0 errors |
| `pnpm lint` | pass with WARN | 기존 dashboard-preview lint warnings |
| `pnpm build` | pass with WARN | static export 성공 |
| production copy scan | pass | `__tests__` 제외 production source 기준 |
| viewport screenshot/DOM check | pass | `.tmp/verify-f2/cdp/` evidence로 확인 |

## 6. 남은 참고사항

| 항목 | 상태 | 후속 |
|---|---|---|
| dashboard-preview lint/test warnings | deferred | F2 범위 밖 cleanup task로 분리 |
| F3 업무 매뉴얼형 섹션 | ready | F2 제품/기능 카피 기준을 참조해 진행 |
| F5 브랜드 자산 검증 | pending | CTA/metadata/release gate에서 이어서 확인 |

## 7. 다음 단계

1. F3 업무 매뉴얼형 섹션 IDEA를 등록하고 screening을 진행한다.
2. F3에서 F2의 제품 라인업과 기능명 기준을 반복 설명하지 않고 업무 흐름으로 확장한다.
3. F5에서 브랜드 자산, metadata, release readiness를 마무리한다.
