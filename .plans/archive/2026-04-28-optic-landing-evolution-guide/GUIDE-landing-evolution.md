# OPTIC Landing Evolution Guide

> 작성일: 2026-04-28
> 목적: `.plans/archive`에 흩어진 기획/개발 archive bundle을 하나의 흐름으로 읽을 수 있게 정리한다.
> 대표 산출물: 이 문서가 최종 guide이며, package index는 [INDEX.md](INDEX.md), 원문 archive는 `internal-bundles/` 아래에 보존한다.

## 1. Guide 목적

이 guide는 OPTIC landing이 초기 랜딩 페이지에서 dashboard preview, hero visual, focus motion까지 발전한 과정을 한 번에 읽을 수 있게 만든 문서다.

기존 `ARCHIVE-*.md`와 `sources/` 문서는 원문 보존용 source archive로 유지한다. 이 guide는 원문 전체를 다시 붙여 넣는 문서가 아니라, 기획 결정과 최종 구현결과를 연결하는 대표 문서다.

## 2. 읽는 방법

처음 읽는 사람은 `3. 전체 발전 타임라인`과 `11. Final Implementation Result Detail`을 먼저 보면 된다. 기획 의사결정이 궁금하면 `12. Planning Package Summary`, 실제 코드와 검증 근거가 궁금하면 `13. Development Package Summary`와 `16. Verification Evidence Index`를 보면 된다.

문서 링크는 모두 현재 archive 재배치 구조를 기준으로 한다.

## 3. 전체 발전 타임라인

| 순서 | 날짜 | Bundle | 핵심 변화 | Source |
| ---: | --- | --- | --- | --- |
| 001 | 2026-04-02 | `optic-landing-page` | OPTIC landing의 초기 제품 메시지, IA, wireframe, bridge 구성 | [ARCHIVE-OLP](internal-bundles/2026-04-02-001-optic-landing-page/ARCHIVE-OLP.md) |
| 002 | 2026-04-15 | `dash-preview` | AI 화물 등록 흐름을 cinematic dashboard preview로 도입 | [ARCHIVE-DASH](internal-bundles/2026-04-15-002-dash-preview/ARCHIVE-DASH.md) |
| 003 | 2026-04-22 | `dash-preview-phase3` | preview를 pixel-perfect 조작감 중심으로 강화 | [ARCHIVE-DASH3](internal-bundles/2026-04-22-003-dash-preview-phase3/ARCHIVE-DASH3.md) |
| 004 | 2026-04-24 | `f5-ui-residue-cleanup` | preview UI 잔재를 정리하고 후속 개선의 바닥을 다짐 | [ARCHIVE-F5](internal-bundles/2026-04-24-004-f5-ui-residue-cleanup/ARCHIVE-F5.md) |
| 005 | 2026-04-24 | `f1-landing-light-theme` | light theme 전환 인프라와 전역 표현층을 정비 | [ARCHIVE-F1](internal-bundles/2026-04-24-005-f1-landing-light-theme/ARCHIVE-F1.md) |
| 006 | 2026-04-27 | `f2-mock-schema-redesign` | preview mock schema를 실제 AI 등록 흐름에 맞게 재설계 | [ARCHIVE-F2](internal-bundles/2026-04-27-006-f2-mock-schema-redesign/ARCHIVE-F2.md) |
| 007 | 2026-04-27 | `f4-layout-hit-area-realignment` | dashboard layout과 hit-area를 실제 조작 지점 기준으로 재정렬 | [ARCHIVE-F4](internal-bundles/2026-04-27-007-f4-layout-hit-area-realignment/ARCHIVE-F4.md) |
| 008 | 2026-04-27 | `hero-liquid-gradient-background` | hero에 canvas 기반 liquid gradient visual을 도입 | [ARCHIVE-HLG](internal-bundles/2026-04-27-008-hero-liquid-gradient-background/ARCHIVE-HLG.md) |
| 009 | 2026-04-28 | `hero-01-reference-hero-refresh` | hero-01 reference 기반으로 hero visual QA와 closeout을 확정 | [ARCHIVE-HR01](internal-bundles/2026-04-28-009-hero-01-reference-hero-refresh/ARCHIVE-HR01.md) |
| 010 | 2026-04-28 | `dash-preview-focus-zoom-animation` | preview 단계별 focus zoom animation과 target-only focus를 정리 | [ARCHIVE-FZ](internal-bundles/2026-04-28-010-dash-preview-focus-zoom-animation/ARCHIVE-FZ.md) |

## 4. Product Foundation: `optic-landing-page`

초기 `optic-landing-page`는 OPTIC landing의 제품 메시지와 화면 골격을 만들었다. 이 시점의 핵심은 "운송 운영을 한눈에"라는 제품 방향을 랜딩 페이지 구조, 섹션 흐름, wireframe, bridge 문서로 개발 가능한 형태까지 끌고 가는 것이었다.

이 bundle은 이후 dashboard preview가 붙을 수 있는 제품 문맥을 제공했다. 즉, 화면의 목적은 단순 소개 페이지가 아니라 "AI 화물 등록과 운영 흐름을 미리 보여주는 제품 경험"으로 확장될 준비를 갖추었다.

## 5. Dashboard Preview Foundation: `dash-preview`

`dash-preview`는 landing의 핵심 데모 영역을 만든 단계다. AI 화물 등록을 cinematic 축소 view로 보여주고, 사용자가 등록 흐름을 보는 것만으로 제품 가치를 이해하도록 구성했다.

기획상으로는 PRD, wireframe, stitch, bridge를 거쳐 개발 패키지로 내려갔다. 개발상으로는 `src/components/dashboard-preview/` 아래에 preview chrome, AI panel, form preview, step indicator, interaction overlay 같은 표면이 들어왔다.

## 6. Preview Interaction Hardening: `dash-preview-phase3`

`dash-preview-phase3`는 preview를 실제 조작감에 가까운 상태로 끌어올렸다. 초기 preview가 "보여주는 화면"이었다면, Phase 3는 "AI가 입력하고 추출하고 적용하는 흐름을 단계별로 이해시키는 화면"으로 바뀌었다.

핵심 변화는 `INITIAL -> AI_INPUT -> AI_EXTRACT -> AI_APPLY` 4단계 상태 모델이다. `src/lib/preview-steps.ts`는 각 단계의 duration, AI state, form state, interaction track을 한 곳에 모으고, `src/lib/mock-data.ts`는 실제 업무 도메인에 가까운 mock data schema를 제공한다.

## 7. Phase A Cleanup and Theme Base

`f5-ui-residue-cleanup`은 기존 preview UI 잔재를 정리해 후속 작업의 혼선을 줄였다. 이 단계는 새로운 기능을 크게 얹기보다, 남아 있던 UI 흔적과 불필요한 상태를 줄여 이후 theme, mock schema, layout 재정렬이 안전하게 들어갈 수 있도록 했다.

`f1-landing-light-theme`는 light theme 전환 인프라를 정비했다. hero, dashboard preview, 전체 layout이 light/dark 양쪽에서 읽히도록 전역 token과 component 표현층을 정리했다.

## 8. Phase B Data and Layout Refactor

`f2-mock-schema-redesign`은 dashboard preview의 데이터 모델을 실제 AI 화물 등록 흐름에 맞췄다. `src/lib/mock-data.ts`는 회사, 담당자, 상/하차지, 차량, 화물, 옵션, 운임, 정산 구조를 분리하고, 개인정보성 값은 masking된 mock으로 유지한다.

`f4-layout-hit-area-realignment`는 preview 내부 layout과 hit-area를 실제 DOM, visual target, interaction overlay 기준으로 정렬했다. 그 결과 사용자가 클릭하거나 focus되는 지점이 화면에서 어긋나지 않도록 조정되었다.

## 9. Hero Visual Refresh

`hero-liquid-gradient-background`는 hero 배경을 정적인 장식에서 canvas 기반 liquid gradient field로 바꾸었다. 이 구현은 CSS variable을 읽어 theme에 맞는 palette를 만들고, `prefers-reduced-motion`, mobile viewport, pointer capability를 고려한다.

`hero-01-reference-hero-refresh`는 hero-01 reference를 기준으로 최종 hero visual을 closeout했다. hero title, CTA, dashboard preview, liquid gradient가 하나의 첫 화면으로 보이도록 stacking context, content veil, bottom fade, reduced motion evidence까지 정리했다.

## 10. Focus Motion Polish

`dash-preview-focus-zoom-animation`은 dashboard preview의 단계별 focus를 마지막으로 다듬었다. 핵심은 전체 preview를 크게 흔드는 camera move가 아니라, 필요한 target만 강조하는 target-only focus다.

`src/components/dashboard-preview/preview-chrome.tsx`는 `PreviewFocusMetadata`를 받아 focus target에 outline, box-shadow, scale을 적용한다. edge 쪽 target은 max scale을 제한하고, reduced motion에서는 scale을 끄고 highlight 중심으로 fallback한다.

## 11. Final Implementation Result Detail

### 11.1 Product Foundation

| 항목 | 상세 |
| --- | --- |
| 최종 사용자 경험 | 사용자는 첫 화면에서 OPTIC이 운송 운영을 정리하고 자동화하는 제품이라는 메시지를 본다. hero 아래에는 실제 등록 흐름을 보여주는 preview가 이어진다. |
| 핵심 구현 결과 | landing page는 제품 메시지, CTA, hero visual, dashboard preview를 한 화면 안에서 연결한다. |
| 주요 코드 위치 | `src/components/sections/hero.tsx`, `src/app/layout.tsx`, `src/app/globals.css` |
| 기획 대비 반영 결과 | 초기 IDEA와 wireframe에서 정의한 제품 소개 흐름이 dashboard preview 중심의 제품 경험으로 확장되었다. |
| 검증 증거 | 초기 archive와 이후 dashboard/hero archive에서 build, typecheck, browser QA 근거를 누적했다. |

### 11.2 Dashboard Preview

| 항목 | 상세 |
| --- | --- |
| 최종 사용자 경험 | 사용자는 AI가 화물 등록 문장을 입력받고, 정보를 추출하고, 입력폼에 적용하는 흐름을 단계별로 본다. desktop/tablet에서는 cinematic preview와 interactive overlay가 동작하고, mobile에서는 무거운 preview 대신 `MobileCardView`가 보인다. |
| 핵심 구현 결과 | `DashboardPreview`는 media query, autoplay, interactive mode, feature flag, mock scenario rotation을 조합한다. `AiRegisterMain`은 dynamic import와 `ssr: false`로 분리되어 mobile에서 불필요한 chunk load를 피한다. |
| 주요 코드 위치 | `src/components/dashboard-preview/dashboard-preview.tsx`, `src/components/dashboard-preview/ai-register-main/**`, `src/components/dashboard-preview/interactive-overlay.tsx`, `src/components/dashboard-preview/hit-areas.ts` |
| 데이터 / 상태 흐름 | `PREVIEW_STEPS`가 4단계 상태를 제공한다. `useAutoPlay`는 현재 step을 진행시키고, `useInteractiveMode`는 click 기반 interactive mode로 전환한다. `createPreviewMockData`와 `selectRandomPreviewMockScenario`는 scenario를 순환시킨다. |
| 기획 대비 반영 결과 | PRD의 AI input, extract, apply 흐름이 `INITIAL`, `AI_INPUT`, `AI_EXTRACT`, `AI_APPLY` 상태로 반영되었다. |
| 의도적 차이 | mobile은 full preview가 아니라 `MobileCardView`를 보여준다. 이는 성능과 레이아웃 안정성을 위한 의도적 축소다. |
| 검증 증거 | `dash-preview`, `dash-preview-phase3`, `f4-layout-hit-area-realignment`, `dash-preview-focus-zoom-animation`의 verification report와 test 결과를 참조한다. |

### 11.3 Hero Visual

| 항목 | 상세 |
| --- | --- |
| 최종 사용자 경험 | hero는 밝은 배경에서도 읽히는 liquid gradient field와 dashboard preview를 함께 보여준다. 사용자는 제품 메시지, CTA, 실제 preview를 같은 first viewport 안에서 인지한다. |
| 핵심 구현 결과 | `Hero`는 `HeroLiquidGradientBackground`, content veil, bottom fade, CTA, `DashboardPreview`를 하나의 section에 배치한다. |
| 주요 코드 위치 | `src/components/sections/hero.tsx`, `src/components/shared/hero-liquid-gradient-background.tsx`, `src/app/globals.css` |
| 데이터 / 상태 흐름 | canvas background는 CSS variable palette를 읽고, `MutationObserver`로 theme 변경을 감지한다. reduced motion이면 animation loop를 제한하고, pointer fine 환경에서만 pointer blob을 반응시킨다. |
| 기획 대비 반영 결과 | hero liquid gradient와 hero-01 reference refresh 요구가 canvas + CSS fallback 구조로 반영되었다. |
| 의도적 차이 | 배경은 장식 레이어로만 동작하며 `pointer-events: none`을 유지한다. CTA와 preview interaction을 방해하지 않기 위한 결정이다. |
| 검증 증거 | `hero-liquid-gradient-background`와 `hero-01-reference-hero-refresh`의 desktop/mobile light/dark, reduced motion, browser QA evidence를 참조한다. |

### 11.4 Focus Motion

| 항목 | 상세 |
| --- | --- |
| 최종 사용자 경험 | preview가 각 단계에서 사용자가 봐야 할 요소를 차례로 강조한다. AI 적용 단계에서는 결과 카드와 입력폼 카드가 순서대로 focus되어 "추출 결과가 폼에 들어간다"는 관계가 보인다. |
| 핵심 구현 결과 | `PreviewChrome`은 fixed frame height를 유지하면서 focus target만 scale/highlight한다. `AI_APPLY_FOCUS_PHASES`는 result-to-card 흐름을 세분화하고 2초 단위 hold를 둔다. |
| 주요 코드 위치 | `src/components/dashboard-preview/preview-chrome.tsx`, `src/lib/preview-steps.ts`, `src/components/dashboard-preview/dashboard-preview.tsx`, `src/lib/motion.ts` |
| 데이터 / 상태 흐름 | `AI_APPLY` step 진입 시 `aiApplyFocusPhaseIndex`가 순차 증가한다. category button 적용 시 `getAiApplyCardPhaseIndexForCategory`가 해당 card phase로 이동한다. |
| 기획 대비 반영 결과 | focus zoom animation 요구는 camera frame 이동이 아니라 target-only focus로 구현되어 layout shift 위험을 낮췄다. |
| 검증 증거 | `dash-preview-focus-zoom-animation`의 typecheck, build, browser DOM check, focus/dashboard preview test 결과를 참조한다. |

## 12. Planning Package Summary

| Bundle | 기획 산출물 | 핵심 결정 |
| --- | --- | --- |
| `optic-landing-page` | IDEA, feature plan lite, wireframes, bridge | 제품 메시지와 landing IA를 먼저 고정 |
| `dash-preview` | PRD, wireframe, stitch, bridge | AI 화물 등록 preview를 landing의 핵심 데모로 배치 |
| `dash-preview-phase3` | IDEA, screening, feature package, spike notes | 4-step preview state와 조작감 강화 방향 확정 |
| `f5-ui-residue-cleanup` | draft, routing, feature package | 신규 개선 전 UI 잔재 정리 |
| `f1-landing-light-theme` | draft, PRD, bridge, epic binding | light/dark theme 전환 기반 확정 |
| `f2-mock-schema-redesign` | IDEA, screening, PRD review, feature package | mock schema를 실제 화물 등록 도메인에 맞춤 |
| `f4-layout-hit-area-realignment` | IDEA, screening, PRD review, feature package | hit-area와 visual target 정렬 |
| `hero-liquid-gradient-background` | IDEA, screening, PRD review, bridge | hero visual layer를 motion-aware background로 설계 |
| `hero-01-reference-hero-refresh` | IDEA, screening, wireframe review, closeout | reference 기반 hero parity와 QA 기준 확정 |
| `dash-preview-focus-zoom-animation` | IDEA, screening, PRD review, focus event unification plan | target-only focus와 AI_APPLY phase 흐름 확정 |

## 13. Development Package Summary

| 영역 | 주요 파일 | 개발 관점 설명 |
| --- | --- | --- |
| Hero composition | `src/components/sections/hero.tsx` | hero copy, CTA, liquid gradient, dashboard preview를 first viewport에 배치 |
| Hero background | `src/components/shared/hero-liquid-gradient-background.tsx` | canvas 2D 기반 gradient, theme token, reduced motion, pointer interaction 처리 |
| Preview shell | `src/components/dashboard-preview/dashboard-preview.tsx` | media query, autoplay, interactive mode, dynamic import, focus phase orchestration |
| Preview chrome | `src/components/dashboard-preview/preview-chrome.tsx` | fixed frame, target-only focus, reduced motion fallback, target presentation map |
| Preview state | `src/lib/preview-steps.ts` | 4-step state, AI_APPLY focus phases, fill-in timeline, number rolling, column pulse |
| Mock schema | `src/lib/mock-data.ts` | masked company/manager/location/cargo/settlement mock data와 scenario 생성 |
| Motion tokens | `src/lib/motion.ts` | hero와 preview에 쓰는 framer-motion variant |
| Tests | `src/components/dashboard-preview/__tests__/**`, `src/components/sections/__tests__/hero.test.tsx`, `src/__tests__/lib/**` | preview, hit-area, a11y, hero, mock data, preview steps 검증 |

## 14. Current Architecture Snapshot

현재 구조는 크게 세 레이어로 볼 수 있다.

| 레이어 | 역할 | 대표 파일 |
| --- | --- | --- |
| Section layer | landing first viewport와 제품 메시지를 조립 | `src/components/sections/hero.tsx` |
| Presentation component layer | preview chrome, AI panel, order form, overlay, hero background 구현 | `src/components/dashboard-preview/**`, `src/components/shared/**` |
| Data / state layer | preview step, mock data, motion preset 제공 | `src/lib/preview-steps.ts`, `src/lib/mock-data.ts`, `src/lib/motion.ts` |

이 구조의 장점은 기획 문서의 "사용자 흐름"이 `PREVIEW_STEPS`와 mock schema에 직접 매핑된다는 점이다. 단점은 dashboard preview가 제품 데모의 중심이 되면서 테스트와 archive 문서량이 빠르게 늘어난다는 점이다.

## 15. Current UX Principles

| 원칙 | 설명 |
| --- | --- |
| 제품은 첫 화면에서 보인다 | hero 문구만 두지 않고 실제 dashboard preview를 first viewport에 배치한다. |
| preview는 설명보다 동작으로 이해시킨다 | AI input, extract, apply 흐름을 단계 상태와 motion으로 보여준다. |
| mobile은 안정성을 우선한다 | mobile에서는 무거운 desktop preview 대신 축약 view를 제공한다. |
| motion은 보조 정보다 | reduced motion 환경에서는 highlight-only나 animation 제한으로 전환한다. |
| mock data도 도메인 모델처럼 관리한다 | 회사, 담당자, 위치, 정산, 옵션을 분리해 실제 업무 흐름과 맞춘다. |

## 16. Verification Evidence Index

| Bundle | 주요 검증 | Evidence |
| --- | --- | --- |
| `dash-preview` | typecheck, lint, test, build, DVC PASS | [dev-output-summary](internal-bundles/2026-04-15-002-dash-preview/sources/feature-package/03-dev-notes/dev-output-summary.md) |
| `dash-preview-phase3` | 622 Phase 3 tests, 916 legacy tests, typecheck, build | [dev-verification-report](internal-bundles/2026-04-22-003-dash-preview-phase3/sources/feature-package/03-dev-notes/dev-verification-report.md) |
| `f1-landing-light-theme` | 980 tests, light theme sweep, typecheck | [dev-verification-report](internal-bundles/2026-04-24-005-f1-landing-light-theme/sources/feature-package/03-dev-notes/dev-verification-report.md) |
| `f4-layout-hit-area-realignment` | 990 tests, build, typecheck, browser spot check | [dev-verification-report](internal-bundles/2026-04-27-007-f4-layout-hit-area-realignment/sources/feature-package/03-dev-notes/dev-verification-report.md) |
| `hero-liquid-gradient-background` | hero tests, light theme tests, typecheck, lint, build, browser QA | [dev-output-summary](internal-bundles/2026-04-27-008-hero-liquid-gradient-background/sources/feature-package/03-dev-notes/dev-output-summary.md) |
| `hero-01-reference-hero-refresh` | hero/light-theme tests, typecheck, lint, build, browser QA failureCount 0 | [dev-output-summary](internal-bundles/2026-04-28-009-hero-01-reference-hero-refresh/sources/feature-package/hero-01-reference-hero-refresh/03-dev-notes/dev-output-summary.md) |
| `dash-preview-focus-zoom-animation` | focus tests, dashboard preview suite, typecheck, build, browser DOM check | [dev-output-summary](internal-bundles/2026-04-28-010-dash-preview-focus-zoom-animation/sources/feature-package/03-dev-notes/dev-output-summary.md) |

대표 screenshot evidence:

- [HLG desktop light](internal-bundles/2026-04-27-008-hero-liquid-gradient-background/sources/qa-evidence/desktop-light.png)
- [HLG mobile dark](internal-bundles/2026-04-27-008-hero-liquid-gradient-background/sources/qa-evidence/mobile-dark.png)
- [HR01 desktop light](internal-bundles/2026-04-28-009-hero-01-reference-hero-refresh/sources/qa-evidence/desktop-light.png)
- [HR01 mobile light](internal-bundles/2026-04-28-009-hero-01-reference-hero-refresh/sources/qa-evidence/mobile-light.png)

## 17. Known Risks and Deferred Decisions

| 항목 | 상태 | 대응 |
| --- | --- | --- |
| 내부 원문 문서의 과거 경로 | 의도적 보존 | `internal-bundles/` 아래 원문 문서에는 작성 당시의 `.plans/archive/...` 참조가 남아 있을 수 있다. 대표 진입점은 이 guide와 archive index를 기준으로 본다. |
| 외부 문서의 old path 참조 | 추가 스캔 필요 | 이 guide와 archive index는 새 `internal-bundles/` 경로로 갱신했다. archive 바깥 문서에서 old path를 직접 참조하면 별도 정리가 필요하다. |
| dashboard preview 테스트 규모 증가 | 지속 관리 필요 | legacy test와 active test 분리 정책을 유지한다. |
| hero visual QA evidence 과다 | 관리 필요 | guide에는 대표 evidence만 두고, 전체 evidence는 bundle 원문에 보존한다. |
| `docs/` untracked 변경 | 범위 밖 | 이번 archive package 작업에서는 건드리지 않는다. |

## 18. Source Archive Map

| New location | Original bundle | Key |
| --- | --- | --- |
| `internal-bundles/2026-04-02-001-optic-landing-page/` | `optic-landing-page/` | OLP |
| `internal-bundles/2026-04-15-002-dash-preview/` | `dash-preview/` | DASH |
| `internal-bundles/2026-04-22-003-dash-preview-phase3/` | `dash-preview-phase3/` | DASH3 |
| `internal-bundles/2026-04-24-004-f5-ui-residue-cleanup/` | `f5-ui-residue-cleanup/` | F5 |
| `internal-bundles/2026-04-24-005-f1-landing-light-theme/` | `f1-landing-light-theme/` | F1 |
| `internal-bundles/2026-04-27-006-f2-mock-schema-redesign/` | `f2-mock-schema-redesign/` | F2 |
| `internal-bundles/2026-04-27-007-f4-layout-hit-area-realignment/` | `f4-layout-hit-area-realignment/` | F4 |
| `internal-bundles/2026-04-27-008-hero-liquid-gradient-background/` | `hero-liquid-gradient-background/` | HLG |
| `internal-bundles/2026-04-28-009-hero-01-reference-hero-refresh/` | `hero-01-reference-hero-refresh/` | HR01 |
| `internal-bundles/2026-04-28-010-dash-preview-focus-zoom-animation/` | `dash-preview-focus-zoom-animation/` | FZ |
