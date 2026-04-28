# PRD: Dash Preview 단계별 포커스 줌 애니메이션

> **Feature slug**: `dash-preview-focus-zoom-animation`
> **IDEA**: [IDEA-20260427-003](../../ideas/20-approved/IDEA-20260427-003.md)
> **Screening**: [SCREENING-20260427-003](../../ideas/20-approved/SCREENING-20260427-003.md)
> **Draft**: [01-draft.md](./01-draft.md)
> **Routing metadata**: [07-routing-metadata.md](./07-routing-metadata.md)
> **작성일**: 2026-04-27
> **상태**: draft-reviewed (Lite direct-to-dev-feature 대기)
> **Lane**: Lite
> **Scenario**: B (기존 `dash-preview` 자동 재생 표현 개선)
> **Feature type**: dev
> **schema**: PRD 10 섹션 표준

---

## 1. Overview

`dash-preview`의 자동 재생 데모에 단계별 포커스 줌 애니메이션을 추가한다. 사용자가 축소된 전체 제품 화면을 한 번에 해석하지 않아도, 현재 단계에서 중요한 입력창, 추출 버튼, 추출 결과, 적용 대상 폼이 화면 중심에 더 크게 보이도록 한다.

이 기능은 새로운 업무 기능이 아니라 **시선 유도와 이해도 개선**이다. 기존 AI 화물 등록 시나리오, mock data, step state는 유지하고, `PreviewChrome` 안에서 보이는 장면의 확대, 이동, highlight 표현을 정리한다.

## 2. Problem Statement

현재 `DashboardPreview`는 `PREVIEW_STEPS`의 `INITIAL`, `AI_INPUT`, `AI_EXTRACT`, `AI_APPLY` 단계를 자동 재생한다. Desktop/Tablet에서는 `PreviewChrome` 안에 실제 등록 화면에 가까운 `AiRegisterMain` 또는 legacy preview가 축소 표시되고, Mobile에서는 `MobileCardView`가 렌더링된다.

이 구조는 제품의 정보 밀도와 전체 흐름을 보여주는 데 강점이 있다. 그러나 축소 화면 안의 요소가 작기 때문에 방문자가 "지금 어디를 봐야 하는지"를 놓칠 수 있다. 특히 카톡 입력창, 추출하기 버튼, 결과 버튼, 폼 입력 영역의 관계가 빠르게 지나가면 AI 자동화 가치가 충분히 전달되지 않는다.

이번 PRD는 기존 자동 재생 흐름을 유지하면서, 단계마다 핵심 영역을 더 크게 보여주는 focus viewport를 정의한다. focus viewport는 화면 안의 카메라처럼 동작하는 표현 계층이며, 실제 업무 데이터나 API 동작을 바꾸지 않는다.

## 3. Goals & Non-Goals

### Goals

- `AI_INPUT` 단계에서 AI 텍스트 입력창이 화면 중심에 더 크게 보인다.
- `AI_EXTRACT` 단계에서 추출하기 버튼과 press 동작이 명확히 강조된다.
- `AI_APPLY` 단계에서 추출 결과 버튼 그룹과 폼 적용 대상이 클릭 기반으로 연결된다. 사용자가 추출된 상차지 정보를 클릭하면 상차지 입력 카드로 이동해 보여주고, 다시 하차지 추출정보로 돌아와 클릭하면 하차지 입력 카드로 이동하는 흐름을 화물 정보와 운임까지 반복한다.
- 기존 `useAutoPlay`, `goToStep`, hover pause, step indicator 동작을 유지한다.
- 기존 interactive mode의 hit-area 클릭 흐름을 깨지 않는다.
- Desktop/Tablet에서는 pan/zoom preset을 적용한다. Mobile은 현재 구현된 `MobileCardView` 동작을 그대로 유지하고 이번 feature에서 변경하지 않는다.
- `prefers-reduced-motion`에서는 큰 이동이나 확대를 줄이고 highlight 중심으로 대체한다.
- focus target, scale, offset, reduced-motion fallback은 테스트 가능한 데이터로 분리한다.

### Non-Goals

- `PREVIEW_MOCK_DATA` 또는 AI 등록 업무 시나리오 재설계.
- 실제 AI/API, database, auth, analytics 연동.
- Hero 전체 layout 재설계.
- `InteractiveOverlay` hit-area 전면 재작성.
- 기존 `dash-preview` archive나 PRD 원본 수정.
- 3D, WebGL, 영상 파일, 외부 animation library 추가.
- 사용자가 직접 텍스트를 입력하는 실제 interactive form 구현.

## 4. User Stories

| ID | 사용자 이야기 | 연결 요구사항 |
|---|---|---|
| US-FZ-001 | As a landing 방문자, I want 카톡 메시지 입력 단계에서 입력창이 크게 보이기를, so that AI 등록 흐름의 시작점을 바로 이해할 수 있다. | REQ-dash-preview-focus-zoom-animation-001, 002 |
| US-FZ-002 | As a landing 방문자, I want 추출하기 버튼을 누른 뒤 결과 영역으로 시선이 이동하기를, so that 버튼과 결과의 관계를 이해할 수 있다. | REQ-dash-preview-focus-zoom-animation-003, 004 |
| US-FZ-003 | As a landing 방문자, I want 추출된 상차지 정보를 클릭하면 상차지 입력 카드로 이동하고, 다시 하차지 추출정보로 돌아와 클릭하면 하차지 입력 카드로 이동하는 식으로 화물 정보와 운임까지 반복해 보고 싶다, so that AI가 추출한 정보와 실제 입력 카드가 어떻게 연결되는지 단계별로 이해할 수 있다. | REQ-dash-preview-focus-zoom-animation-005, 006 |
| US-FZ-004 | As a 모바일 사용자, I want 현재 구현된 모바일 데모 화면이 그대로 유지되기를, so that desktop/tablet 전용 포커스 줌 변경 때문에 모바일 경험이 흔들리지 않는다. | REQ-dash-preview-focus-zoom-animation-009 |
| US-FZ-005 | As a motion에 민감한 사용자, I want 과한 줌 이동 없이 현재 단계가 무엇인지 알 수 있기를, so that 페이지를 편안하게 볼 수 있다. | REQ-dash-preview-focus-zoom-animation-010 |
| US-FZ-006 | As a QA, I want 기존 step indicator와 interactive overlay가 유지되는지 확인하고 싶다, so that animation 개선이 기존 탐색 기능을 깨지 않았다고 판단할 수 있다. | REQ-dash-preview-focus-zoom-animation-011, 012 |

## 5. Functional Requirements

| ID | 요구사항 | 우선순위 | 수용 기준 |
|---|---|:---:|---|
| REQ-dash-preview-focus-zoom-animation-001 | 각 자동 재생 단계는 primary focus target을 가진다. | Must | `INITIAL`, `AI_INPUT`, `AI_EXTRACT`, `AI_APPLY`가 focus metadata 또는 equivalent mapping에 모두 포함된다. |
| REQ-dash-preview-focus-zoom-animation-002 | `AI_INPUT` 단계에서는 `ai-input-textarea`가 화면 중심에서 확대되어 보인다. | Must | Desktop/Tablet screenshot에서 입력창이 현재 단계의 가장 명확한 시각 초점으로 보인다. |
| REQ-dash-preview-focus-zoom-animation-003 | `AI_EXTRACT` 단계에서는 추출하기 버튼이 강조된다. | Must | 버튼 주변 focus/highlight 또는 viewport 이동이 있고, 기존 press animation과 충돌하지 않는다. |
| REQ-dash-preview-focus-zoom-animation-004 | 추출 결과 단계에서는 `ai-result-*` 그룹이 화면 중심에 보인다. | Must | 결과 버튼 그룹이 표시될 때 viewport가 결과 영역을 가리지 않고 보여준다. |
| REQ-dash-preview-focus-zoom-animation-005 | `AI_APPLY` 단계의 form fill 장면은 추출정보 클릭과 입력 카드 이동이 짝을 이루는 4개 sub-phase로 나뉜다. | Must | `상차지 추출정보 클릭 → 상차지 입력 카드 표시 → 하차지 추출정보로 복귀/이동 → 하차지 클릭 → 하차지 입력 카드 표시 → 화물 정보 추출정보 클릭 → 화물 정보 입력 카드 표시 → 운임 추출정보 클릭 → 운임 카드 표시` 흐름이 순서대로 정의된다. |
| REQ-dash-preview-focus-zoom-animation-006 | 각 추출정보 item은 대응하는 입력 카드 focus target과 1:1로 연결된다. | Must | 상차지, 하차지, 화물 정보, 운임 추출정보가 각각 pickup, delivery, cargo/vehicle, fare/estimate 입력 카드로 이동한다. |
| REQ-dash-preview-focus-zoom-animation-007 | focus metadata는 데이터로 분리된다. | Must | step id, target id, scale, offset, duration, reduced motion fallback을 테스트할 수 있다. |
| REQ-dash-preview-focus-zoom-animation-008 | Desktop/Tablet focus preset은 서로 분리할 수 있다. | Should | Tablet scale factor 차이 때문에 필요한 경우 별도 preset을 둘 수 있다. |
| REQ-dash-preview-focus-zoom-animation-009 | Mobile은 현재 구현된 `MobileCardView`를 변경하지 않는다. | Must | 이번 feature의 pan/zoom, click-to-card 이동, scene 전환 변경은 desktop/tablet 범위로 제한하고 mobile path는 현행 유지한다. |
| REQ-dash-preview-focus-zoom-animation-010 | `prefers-reduced-motion`을 지원한다. | Must | reduced motion에서는 큰 `scale`/`translate` 이동이 꺼지거나 highlight-only 표현으로 대체된다. |
| REQ-dash-preview-focus-zoom-animation-011 | 기존 `StepIndicator`와 `goToStep` 동작을 유지한다. | Must | step indicator 클릭 후 해당 단계 focus state가 맞게 표시된다. |
| REQ-dash-preview-focus-zoom-animation-012 | 기존 interactive mode를 깨지 않는다. | Must | `InteractiveOverlay` 진입, hover/focus tooltip, area execute가 기존처럼 동작한다. |
| REQ-dash-preview-focus-zoom-animation-013 | focus viewport는 frame crop을 관리한다. | Must | 확대된 target이 `PreviewChrome` 안에서 읽기 어려울 정도로 잘리지 않는다. |
| REQ-dash-preview-focus-zoom-animation-014 | animation timing은 기존 step duration 안에서 완료된다. | Must | 각 focus 전환은 해당 step duration보다 길지 않고 다음 step으로 밀리지 않는다. |
| REQ-dash-preview-focus-zoom-animation-015 | focus layer는 접근성 노이즈를 만들지 않는다. | Must | 장식/시각 보조 레이어가 추가된다면 `aria-hidden` 또는 동등한 방식으로 보조 기술에 노출되지 않는다. |
| REQ-dash-preview-focus-zoom-animation-016 | QA evidence 기준을 정의한다. | Should | Desktop, Tablet, Mobile, reduced-motion 상태에서 screenshot 또는 browser 확인 항목을 남긴다. |

## 6. UX Requirements

### 6-1. 단계 흐름

| 순서 | 단계 | UX 의도 | 기본 표현 |
|---|---|---|---|
| 1 | 전체 구조 | 사용자가 제품 화면의 전체 구도를 먼저 인지한다. | 전체 preview, 낮은 확대 |
| 2 | 입력 | 메시지가 어디에 들어가는지 명확히 보여준다. | 입력창 중심 zoom |
| 3 | 추출 | 사용자가 누른 버튼과 분석 시작을 연결한다. | 버튼 중심 highlight/press |
| 4 | 결과 | 추출된 카테고리 버튼이 생성되었음을 보여준다. | 결과 버튼 그룹으로 pan |
| 5 | 적용 | 추출정보 클릭과 입력 카드 이동을 4번 반복해 보여준다. | 상차지 추출정보 클릭 → 상차지 카드 → 하차지 추출정보 클릭 → 하차지 카드 → 화물 정보 추출정보 클릭 → 화물 정보 카드 → 운임 추출정보 클릭 → 운임 카드 |
| 6 | 요약 | 자동화 결과를 짧게 정리하고 루프를 닫는다. | 정산/요약 영역 또는 전체 복귀 |

### 6-1-1. US-FZ-003 클릭 기반 4단계 적용 흐름

| 순서 | 추출정보 focus | 사용자 동작 | 이동 대상 | 보여줄 내용 | 다음 복귀 지점 |
|---|---|---|---|---|---|
| 1 | 상차지 추출정보 | 상차지 정보 클릭 | pickup input card | 상차지 주소, 담당자, 상차 일시가 채워지는 장면 | 하차지 추출정보 |
| 2 | 하차지 추출정보 | 하차지 정보 클릭 | delivery input card | 하차지 주소, 담당자, 하차 일시가 채워지는 장면 | 화물 정보 추출정보 |
| 3 | 화물 정보 추출정보 | 화물 정보 클릭 | cargo/vehicle input card | 차량 종류, 중량, 화물명 등 화물 정보가 채워지는 장면 | 운임 추출정보 |
| 4 | 운임 추출정보 | 운임 정보 클릭 | fare/estimate card | 운임, 거리, 예상 시간 또는 정산 요약이 드러나는 장면 | 요약 또는 전체 복귀 |

### 6-2. Motion 정책

- scale은 "읽기 보조" 목적이어야 하며 장식용 과장 효과가 되면 안 된다.
- step 전환마다 화면이 크게 튀지 않도록 duration과 easing을 제한한다.
- 동일 step 안의 sub-phase는 `AI_APPLY`의 `partialBeat`와 `allBeat`를 기준으로 정렬하되, 사용자에게 보이는 흐름은 `추출정보 클릭 → 대응 입력 카드 이동 → 다음 추출정보 복귀/이동`을 상차지, 하차지, 화물 정보, 운임 순서로 반복한다.
- reduced motion에서는 pan/zoom 대신 border, shadow, opacity, subtle highlight를 우선한다.
- hover pause와 click pause가 걸릴 때 focus animation도 어색하게 재시작되지 않아야 한다.

### 6-3. 반응형 정책

- Desktop은 focus viewport pan/zoom을 기본 후보로 둔다.
- Tablet은 scale factor가 다르므로 별도 preset 또는 safe area 보정이 필요할 수 있다.
- Mobile은 이번 feature에서 변경하지 않는다. 현재 구현된 `MobileCardView` 흐름, 조기 return, 청크 로드 회피 의도를 그대로 유지한다.
- 모든 viewport에서 text, button, result group이 부모 frame 밖으로 어색하게 잘리지 않아야 한다.

### 6-4. 접근성

- 현재 단계 정보는 기존 aria-live 메시지를 방해하지 않는다.
- 새 시각 레이어는 keyboard focus 순서를 바꾸지 않는다.
- `StepIndicator`의 클릭/키보드 접근 흐름을 유지한다.
- reduced motion 사용자는 animation이 없어도 현재 단계와 focus 영역을 이해할 수 있어야 한다.

## 7. Technical Considerations

- 현재 preview 진입점은 `src/components/dashboard-preview/dashboard-preview.tsx`다.
- `PreviewChrome`은 `scaled-content-inner`에 `transform: scale(...)`과 `transformOrigin: top left`를 적용한다. focus zoom이 추가되면 기존 scale과 새 translate/scale의 중첩 책임을 명확히 나눠야 한다.
- `useAutoPlay`는 step duration 기반으로 current step을 넘긴다. focus sub-phase가 필요하면 step index와 별도의 phase timeline이 필요할 수 있다.
- `PREVIEW_STEPS`는 현재 4단계이며, `AI_APPLY`에는 `partialBeat`, `allBeat`, `formRevealTimeline`이 있다. `AI_APPLY` focus는 이 timing track을 재사용하되, `US-FZ-003`의 presentation은 추출정보 click target과 입력 카드 focus target의 1:1 mapping으로 정리한다.
- `InteractiveOverlay`는 DOM target 측정과 fallback bounds를 함께 사용한다. focus viewport transform이 overlay 좌표를 흔들 수 있으므로 interactive mode에서는 focus viewport를 비활성화하거나 overlay와 같은 transform 기준을 공유해야 한다.
- Mobile에서는 `DashboardPreview`가 조기 return으로 `MobileCardView`를 렌더링한다. 이 경로에서 `AiRegisterMain` 청크를 불필요하게 로드하지 않는 기존 의도를 유지해야 한다.
- 새 focus metadata 파일을 둔다면 후보는 `src/lib/preview-focus.ts`다. 이 파일은 `StepId`, target id, viewport preset, reduced motion fallback을 관리한다.
- motion variant를 공유한다면 `src/lib/motion.ts`에 preview focus 전용 variant를 추가할 수 있다.
- test 후보는 focus metadata unit test, `DashboardPreview` component test, `a11y.test.tsx`, `interactive-overlay.test.tsx`, browser screenshot 확인이다.
- 새 dependency는 추가하지 않는다. 기존 `framer-motion`과 CSS transform으로 충분한지 먼저 검토한다.

## 8. Milestones

| 단계 | 범위 | 완료 조건 |
|---|---|---|
| M1 - PRD review | 본 PRD 품질과 범위 확인 | `03-prd-review.md`에서 PASS 또는 조건부 PASS |
| M2 - Architecture binding | Lite direct-to-dev-feature용 feature binding 확인 | `.plans/features/active/dash-preview-focus-zoom-animation/00-context/06-architecture-binding.md` 존재 |
| M3 - Focus metadata | focus target, preset, reduced motion fallback 정의 | metadata unit test 통과 |
| M4 - Desktop/Tablet viewport | `PreviewChrome` 안 focus viewport 적용 | desktop/tablet screenshot에서 crop/overlap 없음 |
| M5 - Mobile preservation | 현재 `MobileCardView` 경로 유지 확인 | mobile path가 이번 feature로 변경되지 않았고 기존 핵심 장면이 계속 보임 |
| M6 - Regression QA | 기존 autoplay, step indicator, interactive overlay 확인 | 관련 test와 browser spot check 통과 |

## 9. Risks & Mitigations

| 리스크 | 영향 | 확률 | 완화 |
|---|:---:|:---:|---|
| pan/zoom이 frame crop을 만든다 | Medium | Medium | scale 상한, safe area, viewport별 preset을 PRD/dev-feature acceptance에 포함한다. |
| 기존 `PreviewChrome` scale과 새 focus transform이 충돌한다 | High | Medium | base scale과 focus transform을 별도 wrapper로 분리하거나 transform composition을 명시한다. |
| interactive overlay 좌표가 어긋난다 | High | Medium | interactive mode에서는 focus transform을 끄거나 overlay와 동일 기준으로 변환한다. |
| `AI_APPLY` sub-phase가 기존 timing과 어긋난다 | Medium | Medium | `formRevealTimeline`, `partialBeat`, `allBeat`를 focus timing의 기준으로 삼고, 사용자-facing 흐름은 추출정보 클릭과 입력 카드 이동의 4단계 반복으로 고정한다. |
| Mobile scope creep | Medium | Low | Mobile은 현재 `MobileCardView`를 그대로 유지하고 이번 feature의 변경 대상에서 제외한다. |
| motion 피로감이 커진다 | Medium | Medium | reduced motion fallback과 animation duration 상한을 둔다. |
| scope가 실제 form interaction으로 확장된다 | Medium | Low | Non-Goals에 실제 입력/API/업무 시나리오 변경 제외를 유지한다. |
| test는 통과하지만 실제 시각 품질이 낮다 | Medium | Medium | browser screenshot과 manual spot check를 필수 QA로 둔다. |

## 10. Success Metrics

| ID | 지표 | 목표 | 측정 방법 |
|---|---|---|---|
| SM-dash-preview-focus-zoom-animation-001 | Focus coverage | 모든 `PREVIEW_STEPS`가 focus metadata에 포함됨 | unit test |
| SM-dash-preview-focus-zoom-animation-002 | Input focus clarity | `AI_INPUT`에서 입력창이 명확한 중심 target으로 보임 | desktop/tablet screenshot review |
| SM-dash-preview-focus-zoom-animation-003 | Extract focus clarity | `AI_EXTRACT`에서 추출 버튼이 강조됨 | screenshot review |
| SM-dash-preview-focus-zoom-animation-004 | Apply sequence clarity | `AI_APPLY`에서 추출정보 클릭과 대응 입력 카드 이동이 상차지, 하차지, 화물 정보, 운임 순서로 구분됨 | screenshot 또는 timed browser check |
| SM-dash-preview-focus-zoom-animation-005 | Reduced motion support | reduced motion에서 큰 pan/zoom 비활성 | component/browser check |
| SM-dash-preview-focus-zoom-animation-006 | Interactive regression | overlay 진입, tooltip, area execute 유지 | existing overlay tests + browser check |
| SM-dash-preview-focus-zoom-animation-007 | Step control regression | `StepIndicator` 클릭과 `goToStep` 유지 | component test |
| SM-dash-preview-focus-zoom-animation-008 | Mobile preservation | mobile path가 현재 `MobileCardView` 구현 그대로 유지됨 | mobile component regression check |
| SM-dash-preview-focus-zoom-animation-009 | Dependency control | 새 animation dependency 추가 없음 | `package.json` diff review |
| SM-dash-preview-focus-zoom-animation-010 | Test stability | 관련 preview test suite 통과 | project test script 또는 targeted tests |

## 11. Generated Files

- **Draft**: `.plans/drafts/dash-preview-focus-zoom-animation/01-draft.md`
- **PRD 본 파일**: `.plans/drafts/dash-preview-focus-zoom-animation/02-prd.md`
- **Review 파일**: `.plans/drafts/dash-preview-focus-zoom-animation/03-prd-review.md`
- **Routing metadata**: `.plans/drafts/dash-preview-focus-zoom-animation/07-routing-metadata.md`

## 12. Next Steps

1. `03-prd-review.md`의 PRD 리뷰 판정을 확인한다.
2. Lite feature 게이트에 따라 `/plan-bridge`는 생략한다.
3. `/dev-feature dash-preview-focus-zoom-animation`에서 allowed target paths를 `src/components/dashboard-preview/**`, `src/lib/preview-steps.ts`, `src/lib/motion.ts`, 관련 tests 범위로 좁힌다.
4. 구현 단계에서는 browser screenshot evidence를 별도 산출물로 남긴다.

## 13. Change History

| 날짜 | 내용 |
|---|---|
| 2026-04-27 | 초안 작성 - PRD 10 섹션, REQ 16건, UX/Technical/Risk/Success Metric 정리. Focus metadata, reduced motion, interactive overlay regression 기준을 고정. |
| 2026-04-27 | 사용자 피드백 반영 - US-FZ-003을 상차지, 하차지, 화물 정보, 운임 4단계 form fill 흐름으로 구체화. |
| 2026-04-27 | 사용자 피드백 반영 - US-FZ-003을 추출정보 클릭 기반 반복 흐름으로 재정의하고, US-FZ-004 모바일은 현재 구현 유지로 고정. |
