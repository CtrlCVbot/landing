# 06. Architecture Binding — F1 라이트 모드 전환 인프라

> **Feature slug**: `f1-landing-light-theme`
> **Source Profile**: [`.plans/project/00-dev-architecture.md`](../../../../project/00-dev-architecture.md) (status: approved)
> **작성일**: 2026-04-23
> **작성자**: `/dev-architecture f1-landing-light-theme` (메인 세션)
> **Epic**: [EPIC-20260422-001](../../../../epics/20-active/EPIC-20260422-001/00-epic-brief.md) Phase A

---

## 1. Structure Binding

| 항목 | 값 |
|------|-----|
| Workspace Topology | `monorepo-leaf-single-app` (상위 Profile §3 상속) |
| Selected Structure Mode | `hybrid` (type-based outer + feature-scoped pocket, Profile §4 상속) |
| Layer Style | `layered` (Profile §5 상속) |
| Stack Contract | TypeScript + Next.js 15 App Router + Vitest + Tailwind 4 (Profile §6 상속) |

본 Feature는 **새 구조를 도입하지 않으며** 기존 Architecture Profile을 그대로 승계한다.

---

## 2. Allowed Target Paths

본 Feature가 **신규 생성 또는 수정**할 수 있는 경로. 이 외 경로 편집 시 `dev-feature-scope-guard.js` 경고.

### 2-1. 신규 생성 (new files)

- `src/components/ThemeToggle.tsx` — 테마 토글 버튼 컴포넌트 (REQ-007~009)
  - **배치 근거**: Profile §7 Layer Mapping — 공용 presentational 컴포넌트. 단 navbar 상단 고정 배치가 본 Feature 한정이므로 `src/components/` 루트 허용 (추후 재사용 시 `src/components/shared/` 또는 `src/components/providers/`로 승격 검토).
- `src/components/providers/theme-provider.tsx` — next-themes 래퍼 (선택, REQ-005 별도 파일 분리 시)
  - **배치 근거**: Profile §7 Providers 레이어. 기존 `motion-provider.tsx`와 동일 디렉터리.
- `src/__tests__/light-theme.test.tsx` — 라이트 모드 axe-core + 스냅샷 + SSR 테스트
  - **배치 근거**: Profile §9-2 테스트 위치 — 소스 트리 대칭.

### 2-2. 수정 (edit existing)

**App Shell 레이어**:
- `src/app/globals.css` — 토큰 이중화 (REQ-001~003)
- `src/app/layout.tsx` — ThemeProvider 주입 + `suppressHydrationWarning` (REQ-005, REQ-006)

**Dependency**:
- `package.json` — `next-themes ^0.3.0` 추가 (REQ-004)

**Sections 레이어** (`src/components/sections/*.tsx`):
- `cta.tsx`, `features.tsx`, `footer.tsx`, `header.tsx`, `hero.tsx`, `integrations.tsx`, `problems.tsx`, `products.tsx`
- 각 섹션의 다크 하드코딩 클래스 → 토큰 클래스 치환 (REQ-010)
- 섹션별 PR 매핑:
  - **PR-2**: `header.tsx` (navbar 자체) + `ThemeToggle` 통합
  - **PR-3**: `hero.tsx`, `features.tsx`
  - **PR-4**: 향후 추가될 `pricing.tsx`, `testimonials.tsx` (현재 미존재 — 범위 확인)
  - **PR-5**: `footer.tsx`, `cta.tsx`, `integrations.tsx`, `problems.tsx`, `products.tsx`

**UI primitives** (`src/components/ui/*.tsx`):
- `badge.tsx`, `button.tsx`, `card.tsx`, `input.tsx`, `textarea.tsx`
- shadcn 기반 컴포넌트의 다크 하드코딩 전수 치환 (REQ-012), PR-5에 포함

**Shared presentational** (`src/components/shared/*.tsx`):
- `gradient-blob.tsx`, `section-wrapper.tsx`
- 다크 하드코딩 클래스 치환, PR-5에 포함

**Feature pocket — dashboard-preview 7 파일** (`src/components/dashboard-preview/`):
- `preview-chrome.tsx`
- `interactive-tooltip.tsx`
- `ai-register-main/order-form/datetime-card.tsx`
- `ai-register-main/order-form/estimate-info-card.tsx`
- `ai-register-main/order-form/settlement-section.tsx`
- `ai-register-main/order-form/transport-option-card.tsx`
- `ai-register-main/order-form/index.tsx`
- PR-6 (F5 merge 후)에 포함 (REQ-011)

**Feature pocket — ai-panel 8 파일 (D-016 확장)** (`src/components/dashboard-preview/ai-register-main/ai-panel/`):
- `index.tsx`, `ai-tab-bar.tsx`, `ai-input-area.tsx`, `ai-extract-button.tsx`
- `ai-result-buttons.tsx`, `ai-button-item.tsx`, `ai-warning-badges.tsx`, `ai-extract-json-viewer.tsx`
- PR-7 (T-THEME-09). F5 T-CLEANUP-01 은 **렌더 흐름 제거** 수준이며 파일 삭제 아님 → 잔존 컴포넌트가 프리뷰 경로 일부에서 로딩. F1 라이트 모드 완결성 위해 토큰화 주체는 F1.
- 근거: [decision-log D-016](./02-decision-log.md)

**Feature pocket — legacy 4 파일 (D-016 확장)** (`src/components/dashboard-preview/`):
- `ai-panel-preview.tsx`, `form-preview.tsx`, `mobile-card-view.tsx`, `step-indicator.tsx`
- PR-7 (T-THEME-10).
- 근거: [decision-log D-016](./02-decision-log.md)

**Feature pocket — order-form 5 파일 (D-017 확장)** (`src/components/dashboard-preview/ai-register-main/order-form/`):
- `company-manager-section.tsx` (화주정보), `location-form.tsx` (상/하차지)
- `cargo-info-form.tsx` (화물정보), `estimate-distance-info.tsx` (거리/시간 요약)
- `register-success-dialog.tsx` (등록 성공 다이얼로그)
- PR-7 (T-THEME-13). T-THEME-08 scope 해석 오류 정정 — dash-preview 7파일 외 order-form 5파일 추가 토큰화 주체가 F1.
- 기존 `__tests__/*.test.tsx` 4파일의 legacy palette assertion (border-white/10 등) 동시 갱신.
- 근거: [decision-log D-017](./02-decision-log.md)

**라이트 팔레트 대비 강화 — globals.css (D-017)**:
- `src/app/globals.css` `:root` 3 변수 값 조정 (T-THEME-14):
  - `--landing-card: oklch(0.98 0.005 260 / 0.8)` → `#f1f5f9` (slate-100, alpha 제거)
  - `--landing-border: #e5e7eb` → `#cbd5e1` (slate-300)
  - `--landing-muted: #f3f4f6` → `#e2e8f0` (slate-200)
- 다크 팔레트 불변. WCAG AA 재검증 PASS.
- 근거: [decision-log D-017](./02-decision-log.md) 안 C 채택

### 2-3. 명시적 금지 (out-of-scope)

다음은 F1 범위 밖 (Feature Package `02-scope-boundaries.md` §3 참조):

- `src/lib/mock-data.ts` — F2/F3/F5 범위
- `src/components/dashboard-preview/hit-areas.ts` — F4/F5 범위
- `src/lib/preview-steps.ts` — F2 범위
- ~~`src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx` — F5 범위 (렌더 제거)~~ **D-016 수정**: F5 렌더 제거 완료 이후 파일 자체 토큰화 주체가 F1 로 이동. §2-2 Feature pocket — ai-panel 8 파일 로 재분류.

---

## 3. Recommended Test Paths

| 테스트 유형 | 경로 |
|------------|------|
| 라이트 모드 통합 테스트 (axe + 스냅샷 + SSR) | `src/__tests__/light-theme.test.tsx` (신규) |
| 섹션별 단위 테스트 기존 유지 | `src/components/sections/__tests__/*.test.tsx` |
| dashboard-preview 기존 테스트 유지 | `src/components/dashboard-preview/__tests__/*.test.tsx` |
| ThemeToggle 단위 테스트 | `src/__tests__/ThemeToggle.test.tsx` (필요 시, 선택) |

**검증 규모** (SM-10):
- 스냅샷 매트릭스: 6 섹션 × 2 테마 × 5 뷰포트 = 60 스냅샷
- jest-axe: 6건 (섹션별 1건, 라이트 모드 0 violations)
- SSR 초기 렌더: 1건 (cookie 없음 · localStorage 있음 · OS 다크·라이트 4 조합)

---

## 4. Shared Package Touch Points

현재 Profile §8-4 — `@mologado/*` 내부 패키지 의존 없음. 본 F1은 leaf app 내부 경로만 수정.

향후 공유 가능성:
- 라이트/다크 토큰 세트가 다른 앱에서도 공통 사용될 경우 → `packages/tokens` 추출 검토 (별도 Feature)
- `ThemeProvider` 추상화 · `ThemeToggle` 컴포넌트가 안정된 후 → `packages/ui`로 이관 검토 (2회 이상 재사용 시 — Profile §8-2)

**본 Feature에서는 공유 패키지 touch 없음** (monorepo 루트 `package.json` 변경 금지).

---

## 5. Verification Notes

### 5-1. 필수 검증 (Profile §9-1 상속)

- `pnpm typecheck` — 0 errors
- `pnpm lint` — 0 errors
- `pnpm test` — 0 failures (60 스냅샷 + 6 jest-axe + 1 SSR)
- `pnpm build` — 성공 + 번들 증분 ≤ 2 kB gzipped (NFR-003)
- `pnpm dev --turbopack -p 3100` — hydration 경고 0 건 (NFR-004)

### 5-2. Feature 특화 검증

- **3 중 grep 스윕** (REQ-014): `04-implementation-hints.md §3-1` 명령 전수 실행 → 0 결과
- **Tailwind 4 정합 검증** (NFR-007): PR-1 최초 단계에서 1 컴포넌트 런타임 토글 → 색상 변화 확인. 실패 시 SPIKE-THEME-01 (1일 hard cap, IMP-KIT-036 준수).
- **WCAG AA 4.5:1 대비** (NFR-009): axe color-contrast 규칙 + 라이트 팔레트 토큰 매핑 결정표 (REQ-013) 검증.

### 5-3. PR 게이트

6 PR 각각 독립 검증:
- PR-1 merge 완료 후에만 PR-2~6 진입 (Decision 6)
- PR-6는 F5 merge 완료 후에만 진입 (T-THEME-08 선행 조건)
- 각 PR: `pnpm test` + `pnpm typecheck` + axe-core 해당 섹션 0 violations

---

## 6. 다음 단계

- `/dev-feature .plans/features/active/f1-landing-light-theme/` 진행 — Phase A/B/C 로 `02-package/` 문서 생성
- Feature Package TASK는 04-implementation-hints.md 의 T-THEME-01~08 초안을 공식 승격
- Epic Phase A 병렬 상대: F5 (`f5-ui-residue-cleanup`)
