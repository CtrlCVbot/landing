# Feature Overview: dash-preview-focus-zoom-animation

> **Feature**: Dash Preview Focus Zoom Animation
> **Scope**: Lite
> **PRD Freeze**: `../00-context/01-prd-freeze.md`
> **Architecture Binding**: `../00-context/06-architecture-binding.md`
> **Routing**: `../00-context/07-routing-metadata.md`
> **Status**: Dev implementation verified, ready for archive
> **Created**: 2026-04-27

---

## 1. Feature Summary

`DashboardPreview` 자동 재생 데모에 focus zoom 표현을 추가한다. 사용자가 축소된 전체 화면을 읽지 않아도 현재 단계의 핵심 영역을 따라갈 수 있게 만드는 시각 보조 기능이다.

핵심 흐름은 다음과 같다.

1. `AI_INPUT`: 카톡 텍스트 입력창을 중심 focus로 보여준다.
2. `AI_EXTRACT`: 추출하기 버튼과 결과 생성 흐름을 강조한다.
3. `AI_APPLY`: 추출정보 클릭과 입력 카드 이동을 상차지, 하차지, 화물 정보, 운임 순서로 반복한다.
4. Mobile: 현재 `MobileCardView`를 그대로 유지한다.

---

## 2. Structure Contract

### 2-1. Structure Mode

```text
hybrid
```

Landing app은 type-based outer structure와 `src/components/dashboard-preview/` feature-scoped pocket이 함께 있는 구조다. 이 feature는 기존 dashboard-preview pocket 내부에서만 동작한다.

### 2-2. Allowed Target Paths

#### Primary Editable Paths

| 경로 | 역할 | 제한 |
|---|---|---|
| `src/components/dashboard-preview/dashboard-preview.tsx` | focus viewport orchestration, autoplay/interactive mode 연결 | Mobile 조기 return은 유지 |
| `src/components/dashboard-preview/preview-chrome.tsx` | 고정 frame, transform wrapper, crop safe area | 기존 base scale과 focus transform 책임 분리 |
| `src/lib/preview-steps.ts` | `AI_APPLY` click-to-card sub-phase metadata | 상차지, 하차지, 화물 정보, 운임 순서 유지 |
| `src/lib/motion.ts` | preview 전용 motion variants | 새 package 추가 없이 기존 framer-motion 사용 |

#### Conditional Editable Paths

| 경로 | 조건 |
|---|---|
| `src/components/dashboard-preview/ai-register-main/**` | 실제 입력 카드 target id 또는 focus marker가 필요할 때만 수정 |
| `src/components/dashboard-preview/hit-areas.ts` | interactive overlay와 focus target mapping 충돌이 있을 때만 수정 |
| `src/components/dashboard-preview/interactive-overlay.tsx` | transform 기준 공유 또는 interactive mode 비활성화가 필요할 때만 수정 |
| `src/components/dashboard-preview/interactions/**` | 기존 interaction hook 재사용으로 부족할 때만 최소 수정 |

#### Preservation Paths

| 경로 | 정책 |
|---|---|
| `src/components/dashboard-preview/mobile-card-view.tsx` | 변경하지 않는다. 현행 유지 검증만 수행한다. |
| `src/components/sections/hero.tsx` | Hero layout 변경은 scope 밖이다. |
| `package.json` | 새 animation dependency 추가 금지. |

### 2-3. Layer Mapping

| Layer | Project Path | 이 feature에서의 의미 |
|---|---|---|
| Presentation | `src/components/dashboard-preview/**/*.tsx` | 화면, 카드, overlay, focus viewport |
| State/Effect | `src/components/dashboard-preview/use-*.ts`, `src/components/dashboard-preview/interactions/*.ts` | autoplay, interaction mode, motion timing hook |
| Utility/Data | `src/lib/preview-steps.ts`, `src/lib/motion.ts` | step metadata와 motion variants |
| Test | `src/components/dashboard-preview/**/__tests__`, `src/lib/**/*.test.ts` | behavior and regression safety net |

### 2-4. Stack Contract

| 영역 | 계약 |
|---|---|
| Language | TypeScript |
| Framework | Next.js App Router |
| Runtime | React 18 |
| Styling | Tailwind CSS |
| Animation | Existing `framer-motion` only |
| Icons | Existing `lucide-react` only if needed |
| Test | Vitest + React Testing Library |
| New dependency | 금지 |

### 2-5. Shared-vs-Local Rule

| 위치 | 정책 |
|---|---|
| `src/components/dashboard-preview/` | feature-local implementation home |
| `src/lib/preview-steps.ts` | step/focus metadata를 둘 수 있는 기존 data path |
| `src/lib/motion.ts` | preview motion variants만 추가 가능 |
| `src/components/shared/`, `packages/*` | 이번 feature에서 사용하지 않음 |

---

## 3. Requirement Summary

| 그룹 | Must | Should | 핵심 |
|---|:---:|:---:|---|
| Focus target coverage | 7 | 1 | step별 focus metadata와 viewport preset |
| Apply click loop | 2 | 0 | 상차지, 하차지, 화물 정보, 운임 4단계 |
| Mobile preservation | 1 | 0 | 현행 `MobileCardView` 유지 |
| Regression and accessibility | 5 | 1 | reduced motion, step indicator, overlay, crop, QA evidence |

---

## 4. US-FZ-003 Implementation Guardrail

`AI_APPLY`의 사용자-facing 흐름은 아래 순서를 벗어나면 안 된다.

| 순서 | 추출정보 클릭 | 이동 대상 |
|---|---|---|
| 1 | 상차지 추출정보 클릭 | 상차지 입력 카드 |
| 2 | 하차지 추출정보 클릭 | 하차지 입력 카드 |
| 3 | 화물 정보 추출정보 클릭 | 화물 정보 입력 카드 |
| 4 | 운임 추출정보 클릭 | 운임 카드 |

---

## 5. Verification Contract

| 검증 | 명령 또는 방식 | 기대 결과 |
|---|---|---|
| Typecheck | `pnpm run typecheck` | TypeScript error 0 |
| Unit/component test | `pnpm run test -- dashboard-preview` 또는 관련 Vitest filter | focus mapping, autoplay, mobile preservation 통과 |
| Build | `pnpm run build` | static build 성공 |
| Browser screenshot | desktop/tablet/mobile viewport spot check | desktop/tablet focus zoom 정상, mobile 현행 유지 |
| Reduced motion | browser or component check | 큰 pan/zoom 대신 highlight 중심 표현 |

---

## 6. Phase A Checks

| 항목 | 상태 | 근거 |
|---|---|---|
| PRD freeze 생성 | 완료 | `../00-context/01-prd-freeze.md` |
| Decision log 생성 | 완료 | `../00-context/02-decision-log.md` |
| Architecture binding 존재 | 완료 | `../00-context/06-architecture-binding.md` |
| Structure contract 포함 | 완료 | 본 문서 §2 |
| PRD scope와 binding 충돌 | 없음 | Mobile preservation, no dependency, allowed paths 일치 |
| Binding 밖 요구사항 | 없음 | Hero/API/DB/shared package 제외 |

---

## 7. Human Review Points

Phase B에서 아래 4가지만 확인하면 된다.

| 확인 항목 | 기본안 |
|---|---|
| `US-FZ-003` 4단계 순서 | 상차지 → 하차지 → 화물 정보 → 운임 |
| Mobile 정책 | 현행 `MobileCardView` 유지 |
| focus metadata 위치 | 구현 단계에서 `preview-steps.ts` 확장 또는 `preview-focus.ts` 신규 중 선택 |
| QA 방식 | targeted tests + browser screenshot evidence |

---

## 8. Phase C Package Files

| 파일 | 상태 | 역할 |
|---|---|---|
| `01-requirements.md` | 완료 | 요구사항 SSOT, REQ/TASK/TC trace |
| `02-ui-spec.md` | 완료 | UI target, responsive, reduced motion spec |
| `03-flow.md` | 완료 | autoplay and `US-FZ-003` click-to-card flow |
| `06-domain-logic.md` | 완료 | focus metadata, mode, timing invariants |
| `08-dev-tasks.md` | 완료 | implementation task package |
| `09-test-cases.md` | 완료 | automated and visual test cases |
| `10-release-checklist.md` | 완료 | release evidence checklist |
| `../03-dev-notes/01-dev-verification-report.md` | 완료 | dev verification evidence and side-effect review |
| `../03-dev-notes/dev-output-summary.md` | 완료 | implementation summary and archive handoff |

API/DB 변경이 없으므로 `04-api-spec.md`, `05-db-migration-spec.md`는 생성하지 않는다. 별도 runtime error surface가 없어 `07-error-handling.md`도 생략하고, transform/overlay/mobile/reduced-motion 리스크는 domain logic과 release checklist에서 관리한다.

---

## 9. Next Step

Dev implementation and verification are complete. Next gate is archive packaging.

```bash
/plan-archive dash-preview-focus-zoom-animation
```
