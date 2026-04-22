# Architecture Binding: dash-preview-phase3

> **Feature Slug**: `dash-preview-phase3`
> **Source PRD**: [`01-prd-freeze.md`](./01-prd-freeze.md)
> **Phase 1 스펙 §5 파일 구조 (권위)**: [`archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md`](../../../../archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md#5-파일-구조)
> **Skills 참조**: `dev-architecture-decision`, `dev-feature-module`
> **Status**: approved (Bridge 단계에서 확정)
> **Created**: 2026-04-17

---

## 0. 이 문서의 역할

Phase 3 기능을 **mologado 모노레포 구조 SSOT에 바인딩**한다. 구조 모드 확정, 허용 파일 경로 나열, shared-vs-local 경계, verification 명령 정의, Phase 1/2와의 호환성(Feature flag 병행 운영) 보장.

재복제 금지: Phase 1 스펙 §5 원문은 재복제하지 않고 경로 확장만 수행.

---

## 1. Selected Structure Mode

```
feature-local (within apps/landing)
```

### 1-1. 모드 결정 근거 (`dev-architecture-decision` 기반)

| 기준 | 판정 |
|------|------|
| 기능 범위 | `apps/landing` 내부로 한정. shared packages(`@mologado/core`, `@mologado/db`, `@mologado/ui`) 의존 없음 |
| 상태 관리 | 없음 (stateless props, PREVIEW_STEPS가 컴파일타임 reducer 역할) |
| 외부 연결 | 없음 (API/DB 접근 없음) |
| 재사용 범위 | landing 내부 전용 (다른 앱으로 확장 안 함) |
| 구조 결정 | **feature-local**: `apps/landing/src/components/dashboard-preview/` 단일 feature 디렉토리 내 자체 완결 |

### 1-2. Phase 1/2와 동일 모드 유지

Phase 1/2에서 `feature-local` 모드로 검증 완료. Phase 3도 동일 모드를 유지하여 아키텍처 일관성 보장. Feature flag 병행 운영(REQ-DASH3-052) 전제 조건.

---

## 2. Allowed Target Paths

### 2-1. 신규 파일 (Phase 3)

#### AiRegisterMain (17 파일)

```
apps/landing/src/components/dashboard-preview/ai-register-main/
  index.tsx                                  # AiRegisterMain container
  ai-panel/
    index.tsx                                # AiPanel root
    ai-tab-bar.tsx
    ai-input-area.tsx                        # ← 조작감 #1/#2
    ai-extract-button.tsx                    # ← 조작감 #3
    ai-result-buttons.tsx
    ai-button-item.tsx                       # ← 조작감 #3/#4/#5
    ai-warning-badges.tsx                    # Phase 3 신규, hidden
    ai-extract-json-viewer.tsx               # Phase 3 신규, 접힘
  order-form/
    index.tsx                                # grid-cols-3 루트 + #10 Column Pulse
    company-manager-section.tsx              # pre-filled, AI 영향 없음
    location-form.tsx                        # pickup/delivery 재사용, 조작감 #6
    datetime-card.tsx                        # pickup/delivery 재사용 + md:grid-cols-2, 조작감 #6
    cargo-info-form.tsx                      # 조작감 #6/#7
    transport-option-card.tsx                # 조작감 #9
    estimate-info-card.tsx                   # 조작감 #6/#8/#9/#10
    settlement-section.tsx                   # 조작감 #8
    register-success-dialog.tsx              # 파일만 복제, open=false 고정
```

#### Interactions 유틸 (6 파일)

```
apps/landing/src/components/dashboard-preview/interactions/
  use-fake-typing.ts          # #1 변동 리듬 타이핑
  use-button-press.ts         # #3 scale+shadow press
  use-focus-walk.ts           # #2 focus ring 순차
  use-ripple.ts               # #4 click ripple
  use-fill-in-caret.ts        # #6 필드 fill-in
  use-number-rolling.ts       # #8 숫자 롤링
  # #5 CSS only, #7 전용 prop, #9 stroke-dashoffset CSS, #10 border glow CSS
```

#### shadcn/ui (3-C 하이브리드, 5 파일)

```
apps/landing/src/components/ui/
  button.tsx
  input.tsx
  textarea.tsx
  card.tsx
  badge.tsx
```

### 2-2. 수정 파일 (기존)

| 파일 | 변경 내용 | 근거 REQ |
|------|----------|----------|
| `apps/landing/src/components/dashboard-preview/dashboard-preview.tsx` | 내부 콘텐츠 렌더 분기 (Phase 1/2 ↔ Phase 3 Feature flag) | REQ-DASH3-052, 053 |
| `apps/landing/src/components/dashboard-preview/preview-chrome.tsx` | Tablet scaleFactor 0.32 → **0.40** 변경 | REQ-DASH-023/024 (재조정) |
| `apps/landing/src/components/dashboard-preview/step-indicator.tsx` | 5-dot → **4-dot** | REQ-DASH-014 (수정) |
| `apps/landing/src/components/dashboard-preview/hit-areas.ts` | 재작성 — 히트 영역 19~20개 3-col 좌표 재매핑 | REQ-DASH-037 (확장) |
| `apps/landing/src/lib/mock-data.ts` | 확장 — Phase 1 스펙 §6 스키마 + SSOT mock 값 | REQ-DASH3-010, 014 |
| `apps/landing/src/lib/preview-steps.ts` | 4단계 + interactions 타이밍 트랙 (partialBeat/allBeat) | REQ-DASH3-011, 012, 041 |
| `apps/landing/src/lib/motion.ts` | Phase 3 variants 추가만 (기존 수정 없음) | REQ-DASH-013 (재정의) |
| `apps/landing/src/components/sections/hero.tsx` | 변경 없음 (Phase 1에서 이미 `<DashboardPreview />` 삽입 완료) | REQ-DASH3-053 |

### 2-3. 유지 파일 (건드리지 않음)

| 파일 | 근거 |
|------|------|
| `apps/landing/src/components/dashboard-preview/mobile-card-view.tsx` | MobileCardView 불변 (REQ-DASH-025/026 승계) |
| `apps/landing/src/components/dashboard-preview/use-auto-play.ts` | 기존 타이머 로직 유지, Phase 3 duration 상수만 preview-steps에서 주입 |
| `apps/landing/src/components/dashboard-preview/use-interactive-mode.ts` | Phase 2 모드 전환 로직 유지 |
| `apps/landing/src/components/dashboard-preview/interactive-overlay.tsx` | 히트 영역 렌더링 로직 유지, `hit-areas.ts` 재작성만 |
| `apps/landing/src/components/dashboard-preview/interactive-tooltip.tsx` | 기존 유지 |
| `apps/landing/src/components/dashboard-preview/use-animated-number.ts` | Phase 3에서 `interactions/use-number-rolling.ts`로 **승격 검토** (동일 유틸이면 재사용, 확장이면 복제) |

---

## 3. Layer Mapping

```
components/dashboard-preview/                    → Presentation Layer (기능 전용)
components/dashboard-preview/ai-register-main/   → Presentation Layer (Phase 3 신규 sub-feature)
components/dashboard-preview/interactions/       → Interaction Layer (조작감 유틸, stateless hooks)
components/ui/                                   → UI Primitive Layer (shadcn, shared)
lib/mock-data.ts                                 → Infrastructure Layer (기능 데이터 SSOT)
lib/preview-steps.ts                             → Infrastructure Layer (Step 정의 + interactions 트랙)
__tests__/dashboard-preview/                     → Test Layer
```

### 3-1. 의존성 방향

```
ai-register-main/
    ↓ props
DashboardPreview (container) ←── useAutoPlay, useInteractiveMode
    ↓ uses
preview-steps.ts ←── mock-data.ts (SSOT)
    ↓ imports
ai-register-main/* ←── interactions/* ←── components/ui/* (shadcn)
```

**금지 방향**: `interactions/` → `ai-register-main/` (유틸은 UI 컴포넌트에 의존하지 않음).

---

## 4. Shared Package Touch Points

```
없음
```

`apps/landing`은 현재 shared packages(`@mologado/core`, `@mologado/db`, `@mologado/ui`)를 사용하지 않으며, Phase 3도 shared package에 의존하지 않는다. 모든 코드는 `apps/landing` 내부에 배치.

### 4-1. Future Migration Alignment (Q2 미해소 대비)

**IDEA §2 "broker 앱 모노레포 통합 일정"(Q2)이 미해소** 상태. Option A 전환 대비 다음 경계를 유지:

| 경계 | 설계 방침 |
|------|----------|
| `ai-register-main/` 디렉토리 | Option A 전환 시 **shared 추출 경계** 역할. 외부 의존 (zustand/RHF/api) 0건 유지 |
| `interactions/` 디렉토리 | Option A 전환 시 **landing 전용 레이어로 남김**. broker 앱으로 이식하지 않음 |
| `mock-data.ts` | Option A 전환 시 **제거** (실제 store/API 연결). 현재는 landing 단독 SSOT |
| shadcn `ui/` | Option A 전환 시 **broker의 shadcn과 통합 검토**. 현재는 landing 전용 |

이 경계 설계는 Option A 전환이 별도 Feature로 분리되더라도 `ai-register-main/` 기반 추출만으로 마이그레이션 가능하게 한다.

---

## 5. Recommended Test Paths

```
apps/landing/src/__tests__/dashboard-preview/
  # 기존 (Phase 1/2) — legacy 격리 대상 (REQ-DASH3-071)
  legacy/                                    # (Q7 확정 후 이동, 기존 300+ 테스트)
    ...

  # Phase 3 신규
  ai-register-main/
    index.test.tsx
    ai-panel/
      index.test.tsx
      ai-tab-bar.test.tsx
      ai-input-area.test.tsx
      ai-extract-button.test.tsx
      ai-result-buttons.test.tsx
      ai-button-item.test.tsx
      ai-warning-badges.test.tsx
      ai-extract-json-viewer.test.tsx
    order-form/
      index.test.tsx                          # 3-column grid 구조 검증
      company-manager-section.test.tsx        # pre-filled 검증
      location-form.test.tsx
      datetime-card.test.tsx
      cargo-info-form.test.tsx
      transport-option-card.test.tsx
      estimate-info-card.test.tsx
      settlement-section.test.tsx
  interactions/
    use-fake-typing.test.ts                   # 2 테스트 이상
    use-button-press.test.ts
    use-focus-walk.test.ts
    use-ripple.test.ts
    use-fill-in-caret.test.ts
    use-number-rolling.test.ts

  # 통합 테스트
  dashboard-preview-phase3.integration.test.tsx   # 4-Step 시퀀스 전체
  ai-apply-two-beat.integration.test.tsx          # AI_APPLY partialBeat → allBeat
  mock-data-ssot.test.ts                          # decision-log §4-3 정확 매칭
```

Legacy 격리 전략 상세는 [`02-package/09-test-cases.md`](../02-package/09-test-cases.md) §6 참조.

---

## 6. Verification Notes

| 검증 | 명령 | 기대 결과 |
|------|------|-----------|
| 타입 체크 | `pnpm run typecheck` | 0 errors |
| 린트 | `pnpm run lint` | 0 warnings in new files |
| Phase 3 신규 테스트 | `pnpm run test -- ai-register-main interactions` | 전부 통과 |
| Phase 3 커버리지 | `pnpm run test -- --coverage ai-register-main interactions` | 80%+ |
| 빌드 | `pnpm run build` | exit 0, static export |
| 번들 크기 | `next build` 출력 | `ai-register-main` 청크 80~100KB gzipped (REQ-DASH3-060) |
| LCP | Lighthouse CI | +100ms 미만 (REQ-DASH3-061) |
| Mobile 청크 비로드 | Network tab @ <768px | `ai-register-main` 청크 요청 0건 (REQ-DASH3-062) |
| a11y | `pnpm run test -- a11y` (vitest-axe) | WCAG AA 통과 (REQ-DASH3-066) |
| Reduced-motion | devtools 에뮬레이션 | 조작감 10종 즉시 스냅 (REQ-DASH3-031) |

---

## 7. Feature-Architecture Compliance

| 규칙 | 준수 |
|------|------|
| 기능 컴포넌트는 `components/{feature}/`에 배치 | ✅ `components/dashboard-preview/` 확장 |
| sub-feature는 하위 디렉토리로 분리 | ✅ `ai-register-main/`, `interactions/` |
| 기능 전용 훅은 feature 디렉토리 내 배치 | ✅ `use-*.ts` (기존 유지) + `interactions/*.ts` |
| 기능 전용 데이터는 `lib/` 또는 feature 내 배치 | ✅ `lib/mock-data.ts`, `lib/preview-steps.ts` (확장) |
| shared 컴포넌트 수정 금지 (추가만) | ✅ `motion.ts` variants 추가만 |
| 기존 레이아웃 변경 금지 | ✅ `hero.tsx` 변경 없음 (Phase 1에서 완료) |
| 테스트는 `__tests__/` 미러링 | ✅ `__tests__/dashboard-preview/ai-register-main/` |
| shadcn 도입 최소화 (3-C) | ✅ 5 컴포넌트만 (REQ-DASH3-051) |
| Phase 1/2 테스트 legacy 격리 | 🟡 Q7 해소 전까지 보류 — `/dev-feature` 진입 직전 확정 |
| Zustand / RHF / React Query / API import 0건 | ✅ (REQ-DASH3-002, 007) |
| Next.js 15 App Router (static export) | ✅ 기존 유지 |

---

## 8. Feature Flag 병행 운영 (REQ-DASH3-052)

### 8-1. 토글 구조

```typescript
// dashboard-preview.tsx
export function DashboardPreview(props: { version?: 'phase12' | 'phase3' }) {
  const version = props.version ?? process.env.NEXT_PUBLIC_DASH_PREVIEW_VERSION ?? 'phase12'

  if (version === 'phase3') {
    return <DashboardPreviewPhase3 />
  }
  return <DashboardPreviewPhase12 />  // 기존 Phase 1/2 로직
}
```

### 8-2. 롤백 안전장치

- Phase 3 배포 후 문제 발생 시 환경변수 하나 변경으로 **즉시 Phase 1/2로 복귀 가능**
- Phase 3 청크(`ai-register-main`)는 dynamic import로 분할 — Phase 1/2 모드에서는 로드되지 않음
- Mobile 뷰포트는 항상 MobileCardView (version 무관)

### 8-3. Feature flag 제거 시점

Phase 3 2주 안정 운영 확인 후 Phase 1/2 경로 제거 (별도 Feature로 분리 처리).

---

## 9. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-04-17 | 초안 — Structure Mode / Allowed Paths (신규 23 + 수정 8) / Layer Mapping / Future Migration Alignment(Q2) / Test Paths (legacy 격리) / Verification / Feature flag 병행 운영 구조 |
