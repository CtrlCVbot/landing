# Architecture Binding: dash-preview-focus-zoom-animation

> **Feature Slug**: `dash-preview-focus-zoom-animation`
> **Source Architecture**: `.plans/project/00-dev-architecture.md`
> **Source PRD**: `.plans/drafts/dash-preview-focus-zoom-animation/02-prd.md`
> **Status**: approved
> **Created**: 2026-04-27
> **Scope**: Lite, dev feature, bridge skipped

---

## 1. Binding Decision

`dash-preview-focus-zoom-animation`은 기존 `DashboardPreview` 기능 안의 animation and focus behavior 개선이다. 새 feature root를 만들지 않고, 이미 존재하는 `src/components/dashboard-preview/` feature pocket 안에서 좁게 수정한다.

`US-FZ-004`에 따라 Mobile path는 변경 대상이 아니다. `src/components/dashboard-preview/mobile-card-view.tsx`는 구현 대상이 아니라 regression check 대상이다.

---

## 2. Selected Structure Mode

```text
hybrid
```

Landing app은 type-based outer structure와 `src/components/dashboard-preview/` feature-scoped pocket이 함께 있는 구조다. 이 feature는 기존 dashboard-preview pocket 내부에서만 동작한다.

---

## 3. Allowed Target Paths

### Primary Editable Paths

| 경로 | 역할 | 제한 |
|---|---|---|
| `src/components/dashboard-preview/dashboard-preview.tsx` | focus viewport orchestration, autoplay/interactive mode 연결 | Mobile 조기 return은 유지 |
| `src/components/dashboard-preview/preview-chrome.tsx` | 고정 frame, transform wrapper, crop safe area | 기존 base scale과 focus transform 책임 분리 |
| `src/lib/preview-steps.ts` | `AI_APPLY` click-to-card sub-phase metadata | 상차지, 하차지, 화물 정보, 운임 순서 유지 |
| `src/lib/motion.ts` | preview 전용 motion variants | 새 package 추가 없이 기존 framer-motion 사용 |

### Conditional Editable Paths

| 경로 | 조건 |
|---|---|
| `src/components/dashboard-preview/ai-register-main/**` | 실제 입력 카드 target id 또는 focus marker가 필요할 때만 수정 |
| `src/components/dashboard-preview/hit-areas.ts` | interactive overlay와 focus target mapping 충돌이 있을 때만 수정 |
| `src/components/dashboard-preview/interactive-overlay.tsx` | transform 기준 공유 또는 interactive mode 비활성화가 필요할 때만 수정 |
| `src/components/dashboard-preview/interactions/**` | 기존 interaction hook 재사용으로 부족할 때만 최소 수정 |

### Read-only / Preservation Paths

| 경로 | 정책 |
|---|---|
| `src/components/dashboard-preview/mobile-card-view.tsx` | `US-FZ-004`에 따라 변경하지 않는다. 현행 유지 검증만 수행한다. |
| `src/components/sections/hero.tsx` | Hero layout 변경은 scope 밖이다. |
| `package.json` | 새 animation dependency 추가 금지. |

---

## 4. Recommended Test Paths

| 경로 | 검증 목적 |
|---|---|
| `src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx` | autoplay, step transition, mobile preservation regression |
| `src/components/dashboard-preview/__tests__/a11y.test.tsx` | reduced motion, aria-live, keyboard flow 영향 |
| `src/components/dashboard-preview/__tests__/interactive-overlay.test.tsx` | overlay coordinate regression |
| `src/components/dashboard-preview/__tests__/hit-areas.test.ts` | result click target mapping |
| `src/components/dashboard-preview/ai-register-main/__tests__/index.test.tsx` | `AiRegisterMain` target section rendering |
| `src/components/dashboard-preview/ai-register-main/order-form/__tests__/*.test.tsx` | 상차지, 하차지, 화물 정보, 운임 카드 target 확인 |
| `src/lib/preview-steps.test.ts` 또는 기존 preview step 테스트 | focus metadata, timing track, 4단계 apply loop |

---

## 5. Layer Mapping

| Layer | Project Path | 이 feature에서의 의미 |
|---|---|---|
| Presentation | `src/components/dashboard-preview/**/*.tsx` | 화면, 카드, overlay, focus viewport |
| State/Effect | `src/components/dashboard-preview/use-*.ts`, `src/components/dashboard-preview/interactions/*.ts` | autoplay, interaction mode, motion timing hook |
| Utility/Data | `src/lib/preview-steps.ts`, `src/lib/motion.ts` | step metadata와 motion variants |
| Test | `src/components/dashboard-preview/**/__tests__`, `src/lib/**/*.test.ts` | behavior and regression safety net |

---

## 6. Shared Package Touch Points

없음.

이 feature는 `apps/landing` 내부 dashboard-preview pocket에만 닫힌다. `packages/*`, shared UI package, API, DB, 외부 서비스는 건드리지 않는다.

---

## 7. Verification Notes

| 검증 | 명령 또는 방식 | 기대 결과 |
|---|---|---|
| Typecheck | `pnpm run typecheck` | TypeScript error 0 |
| Unit/component test | `pnpm run test -- dashboard-preview` 또는 관련 Vitest filter | focus mapping, autoplay, mobile preservation 통과 |
| Build | `pnpm run build` | static build 성공 |
| Browser screenshot | desktop/tablet/mobile viewport spot check | desktop/tablet focus zoom 정상, mobile 현행 유지 |
| Reduced motion | browser or component check | 큰 pan/zoom 대신 highlight 중심 표현 |

---

## 8. Binding Guardrails

- `US-FZ-003`: `AI_APPLY`는 `상차지 추출정보 클릭 → 상차지 입력 카드 → 하차지 추출정보 클릭 → 하차지 입력 카드 → 화물 정보 추출정보 클릭 → 화물 정보 입력 카드 → 운임 추출정보 클릭 → 운임 카드` 흐름을 유지한다.
- `US-FZ-004`: Mobile에서는 현재 구현된 `MobileCardView`를 유지한다.
- `InteractiveOverlay`가 켜진 상태에서 focus viewport transform이 hit-area 좌표를 흔들면, interactive mode에서는 focus viewport를 비활성화하거나 동일 transform 기준을 공유한다.
- `prefers-reduced-motion`에서는 큰 scale/translate 이동을 끄고 border, shadow, opacity, highlight 중심으로 대체한다.
