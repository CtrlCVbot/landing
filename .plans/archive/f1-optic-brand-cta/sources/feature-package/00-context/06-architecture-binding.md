# 06. Architecture Binding - F1 브랜드, 로고, CTA 최소 반영

> **Feature slug**: `f1-optic-brand-cta`
> **Source Profile**: [00-dev-architecture.md](../../../../project/00-dev-architecture.md) (status: approved)
> **작성일**: 2026-04-28
> **Epic**: [EPIC-20260428-001](../../../../epics/10-planning/EPIC-20260428-001/00-epic-brief.md) Phase A, F1

---

## 1. Structure Binding

| 항목 | 값 |
|---|---|
| Workspace Topology | `monorepo-leaf-single-app` |
| Selected Structure Mode | `hybrid` |
| Layer Style | `layered` |
| Stack Contract | TypeScript + Next.js 15 App Router + Vitest + Tailwind 4 |

본 Feature는 새 구조를 도입하지 않는다. 기존 landing leaf app의 type-based sections 구조와 `src/lib` 유틸/상수 레이어를 그대로 사용한다.

## 2. Allowed Target Paths

### 2-1. 수정 허용

| 경로 | 레이어 | 목적 |
|---|---|---|
| `src/lib/constants.ts` | Utility | 브랜드명, 서비스 URL, CTA label 상수화 |
| `src/components/sections/header.tsx` | Presentation / Section | desktop/mobile CTA 분리 |
| `src/components/sections/footer.tsx` | Presentation / Section | 주/보조 브랜드 표기 기준 유지 |
| `src/components/icons/optic-logo.tsx` | Presentation / Icon | 임시 로고 접근성 label 확인 |

### 2-2. 신규 생성 허용

| 경로 | 목적 |
|---|---|
| `src/components/sections/__tests__/header.test.tsx` | Header CTA 렌더/동작 검증 |
| `src/components/sections/__tests__/footer.test.tsx` | Footer 브랜드 표기 검증 |
| `src/__tests__/lib/constants.test.ts` | 브랜드/CTA 상수 검증 |

### 2-3. 명시적 금지

| 경로 | 이유 |
|---|---|
| `src/components/dashboard-preview/**` | 현재 F1 범위 밖이며 다른 active work와 충돌 위험 |
| `src/lib/mock-data.ts` | F2/F3/F5 계열 데이터 범위 |
| `src/lib/preview-steps.ts` | dash-preview 시나리오 범위 |
| `src/app/globals.css` | 브랜드/CTA 문서 범위가 아니며 theme 작업 범위 |
| `package.json` | 신규 dependency 필요 없음 |

## 3. Recommended Test Paths

| 테스트 유형 | 권장 경로 |
|---|---|
| Header CTA | `src/components/sections/__tests__/header.test.tsx` |
| Footer 브랜드 표기 | `src/components/sections/__tests__/footer.test.tsx` |
| 브랜드/CTA 상수 | `src/__tests__/lib/constants.test.ts` |

## 4. Shared Package Touch Points

없음. 본 Feature는 `apps/landing` leaf app 내부 수정만 허용한다.

## 5. Verification Notes

| 검증 | 기준 |
|---|---|
| Targeted tests | Header/Footer/constants 관련 테스트 통과 |
| `pnpm typecheck` | 0 errors |
| `pnpm build` | 성공 |
| 수동 responsive 확인 | 1440px, 768px, 375px에서 CTA 겹침 없음 |
| 링크 속성 확인 | 외부 링크 `target="_blank"`, `rel="noopener noreferrer"` |
