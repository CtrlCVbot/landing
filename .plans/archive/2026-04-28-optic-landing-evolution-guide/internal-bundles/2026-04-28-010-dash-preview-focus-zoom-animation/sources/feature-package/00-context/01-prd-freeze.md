# PRD Freeze: dash-preview-focus-zoom-animation

> **Feature**: Dash Preview Focus Zoom Animation
> **Source PRD**: `.plans/drafts/dash-preview-focus-zoom-animation/02-prd.md`
> **Review**: `.plans/drafts/dash-preview-focus-zoom-animation/03-prd-review.md`
> **Architecture Binding**: `06-architecture-binding.md`
> **Status**: frozen for `/dev-feature` Phase A
> **Frozen At**: 2026-04-27

---

## 1. Freeze Summary

이 freeze는 `dash-preview` 자동 재생 데모에 단계별 focus zoom을 추가하기 위한 개발 핸드오프 기준이다. 업무 기능, mock data, API, DB는 바꾸지 않고 `DashboardPreview` 내부의 시선 유도 표현을 개선한다.

Pipeline 결정은 `Lite direct-to-dev-feature`다. `/plan-bridge`는 Standard feature 전용이므로 생략한다.

---

## 2. Scope

| 구분 | 내용 |
|---|---|
| 포함 | Desktop/Tablet focus viewport, step별 focus metadata, `AI_APPLY` click-to-card loop, reduced motion fallback, regression QA |
| 제외 | 실제 AI/API, database, auth, analytics, Hero layout 재설계, Mobile redesign, 새 animation dependency |
| 보존 | `useAutoPlay`, `goToStep`, `StepIndicator`, `InteractiveOverlay`, Mobile `MobileCardView` |

---

## 3. Frozen User Stories

| ID | Freeze 내용 | 개발상 의미 |
|---|---|---|
| `US-FZ-001` | `AI_INPUT`에서 텍스트 입력창이 중심 focus target으로 보인다. | `ai-input-textarea` 또는 동등 target metadata 필요 |
| `US-FZ-002` | `AI_EXTRACT`에서 추출 버튼과 결과 영역 관계가 보인다. | extract button highlight와 result group pan 연결 |
| `US-FZ-003` | 추출정보 클릭과 대응 입력 카드 이동을 상차지, 하차지, 화물 정보, 운임 순서로 반복한다. | 4개 click-to-card sub-phase가 acceptance criteria에 포함 |
| `US-FZ-004` | Mobile은 현재 구현된 데모를 그대로 유지한다. | `mobile-card-view.tsx`는 수정 대상이 아니라 regression 대상 |
| `US-FZ-005` | reduced motion에서는 과한 zoom/pan 없이도 단계가 보인다. | highlight-only fallback 필요 |
| `US-FZ-006` | 기존 step indicator와 interactive overlay가 유지된다. | overlay 좌표와 step control regression test 필요 |

---

## 4. Frozen Requirements

| 그룹 | REQ | 개발 기준 |
|---|---|---|
| Focus coverage | `REQ-001`~`REQ-004` | 모든 `PREVIEW_STEPS`에 primary focus target 또는 equivalent mapping 필요 |
| Apply loop | `REQ-005`, `REQ-006` | 상차지, 하차지, 화물 정보, 운임의 1:1 result-to-card mapping |
| Metadata | `REQ-007`, `REQ-008` | step id, target id, scale, offset, duration, reduced motion fallback을 테스트 가능하게 둔다 |
| Mobile | `REQ-009` | mobile path 현행 유지 |
| A11y and regression | `REQ-010`~`REQ-016` | reduced motion, step indicator, overlay, crop, timing, aria noise, QA evidence |

---

## 5. US-FZ-003 Frozen Flow

| 순서 | 추출정보 | 사용자-facing 동작 | 대응 입력 카드 |
|---|---|---|---|
| 1 | 상차지 추출정보 | 상차지 정보 클릭 | pickup input card |
| 2 | 하차지 추출정보 | 하차지 정보 클릭 | delivery input card |
| 3 | 화물 정보 추출정보 | 화물 정보 클릭 | cargo/vehicle input card |
| 4 | 운임 추출정보 | 운임 정보 클릭 | fare/estimate card |

---

## 6. Frozen Technical Constraints

- 기존 `PreviewChrome` base scale과 새 focus viewport transform의 책임을 분리한다.
- `AI_APPLY` focus timing은 기존 `partialBeat`, `allBeat`, `formRevealTimeline`과 어긋나지 않아야 한다.
- `InteractiveOverlay`가 켜진 상태에서 focus viewport가 좌표계를 흔들면 interactive mode에서는 focus viewport를 끄거나 같은 transform 기준을 공유한다.
- Mobile에서는 `DashboardPreview`의 `MobileCardView` 조기 return과 `AiRegisterMain` 청크 로드 회피 의도를 유지한다.
- 새 dependency는 추가하지 않는다.

---

## 7. Change Control

이 freeze 이후 다음 변경은 Phase B 사용자 확인 또는 별도 feedback 항목으로 처리한다.

| 변경 유형 | 처리 |
|---|---|
| `US-FZ-003` 순서 변경 | 사용자 확인 필요 |
| Mobile path 수정 | scope 변경이므로 사용자 확인 필요 |
| 새 dependency 추가 | 원칙적으로 금지, 필요 시 사용자 확인 필요 |
| target id 세부명 변경 | dev package 내부에서 결정 가능 |
| focus scale/offset 수치 조정 | screenshot QA 결과에 따라 dev task에서 조정 가능 |
