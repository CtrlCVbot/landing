# Architecture Binding: dash-preview

> **Feature Slug**: `dash-preview`  
> **Source Architecture**: `.plans/project/00-dev-architecture.md`  
> **Status**: approved  
> **Created**: 2026-04-14

---

## Selected Structure Mode

```
feature-local (within apps/landing)
```

`dash-preview` 기능은 Hero 영역의 DashboardPreview 컴포넌트로, `apps/landing` 내에서 자체 완결된 feature 디렉토리로 배치한다.

---

## Allowed Target Paths

### Phase 1 (시네마틱 뷰)

**컴포넌트:**
- `apps/landing/src/components/dashboard-preview/dashboard-preview.tsx`
- `apps/landing/src/components/dashboard-preview/preview-chrome.tsx`
- `apps/landing/src/components/dashboard-preview/ai-panel-preview.tsx`
- `apps/landing/src/components/dashboard-preview/form-preview.tsx`
- `apps/landing/src/components/dashboard-preview/step-indicator.tsx`
- `apps/landing/src/components/dashboard-preview/mobile-card-view.tsx`
- `apps/landing/src/components/dashboard-preview/use-auto-play.ts`

**라이브러리/데이터:**
- `apps/landing/src/lib/mock-data.ts`
- `apps/landing/src/lib/preview-steps.ts`

**수정 파일 (기존):**
- `apps/landing/src/components/sections/hero.tsx` — placeholder를 `<DashboardPreview />`로 교체
- `apps/landing/src/lib/motion.ts` — Preview 전용 variants 추가 가능 (기존 수정 없음)

### Phase 2 (인터랙티브 탐색)

**추가 컴포넌트/훅:**
- `apps/landing/src/components/dashboard-preview/interactive-overlay.tsx` — 오버레이 + HitArea 버튼 렌더링
- `apps/landing/src/components/dashboard-preview/use-interactive-mode.ts` — 상태 + 모드 전환 훅 (DEC-011 후속, Phase 2 상세는 `02-package/06-domain-logic.md` §8 참조)
- `apps/landing/src/components/dashboard-preview/hit-areas.ts` — viewport별 HitAreaConfig 정의 (Desktop 11개, Tablet 6개)

**추가 데이터 (mock-data.ts 확장):**
- tooltips 객체는 Phase 1에서 이미 정의됨 (mock-data.ts 확인)
- Phase 2에서는 수정 없음. hit-areas.ts가 tooltipKey로 참조만 함

---

## Recommended Test Paths

- `apps/landing/src/__tests__/dashboard-preview/dashboard-preview.test.tsx`
- `apps/landing/src/__tests__/dashboard-preview/use-auto-play.test.ts`
- `apps/landing/src/__tests__/dashboard-preview/step-indicator.test.tsx`
- `apps/landing/src/__tests__/dashboard-preview/ai-panel-preview.test.tsx`
- `apps/landing/src/__tests__/dashboard-preview/form-preview.test.tsx`
- `apps/landing/src/__tests__/dashboard-preview/mobile-card-view.test.tsx`
- `apps/landing/src/__tests__/dashboard-preview/interactive-overlay.test.tsx` (Phase 2)
- `apps/landing/src/__tests__/dashboard-preview/use-interactive-mode.test.ts` (Phase 2)
- `apps/landing/src/__tests__/dashboard-preview/hit-areas.test.ts` (Phase 2)

---

## Shared Package Touch Points

```
없음
```

`apps/landing`은 현재 shared packages(`@mologado/core`, `@mologado/db`, `@mologado/ui`)를 사용하지 않으며, `dash-preview` 기능도 shared package에 의존하지 않는다. 모든 코드는 `apps/landing` 내부에 배치.

---

## Verification Notes

| 검증 | 명령 | 기대 결과 |
|------|------|----------|
| 타입 체크 | `pnpm run typecheck` | 0 errors |
| 린트 | `pnpm run lint` | 0 warnings in new files |
| 테스트 | `pnpm run test` | 80%+ coverage in `dashboard-preview/` |
| 빌드 | `pnpm run build` | exit 0, static export 성공 |
| 번들 크기 | `next build` 출력 확인 | dashboard-preview chunk <30KB gzipped |
| LCP | Lighthouse CI | +100ms 미만 |

---

## Feature-Architecture Compliance

| 규칙 | 준수 |
|------|------|
| 기능 컴포넌트는 `components/{feature}/`에 배치 | ✅ `components/dashboard-preview/` |
| 기능 전용 훅은 feature 디렉토리 내 배치 | ✅ `dashboard-preview/use-auto-play.ts` |
| 기능 전용 데이터는 `lib/` 또는 feature 내 배치 | ✅ `lib/mock-data.ts`, `lib/preview-steps.ts` |
| 기존 shared 컴포넌트 수정 금지 (추가만) | ✅ `motion.ts`에 variants 추가만 |
| 기존 레이아웃 변경 금지 | ✅ `hero.tsx` placeholder 교체만 |
| 테스트는 `__tests__/` 미러링 | ✅ `__tests__/dashboard-preview/` |
| 새 npm 패키지 추가 금지 | ✅ 기존 의존성만 사용 |
