# Plan: focus event unification and adaptive preview frame

> **Feature**: Dash Preview Focus Zoom Animation
> **Status**: planning-only
> **Created**: 2026-04-28
> **Related docs**: `01-requirements.md`, `02-ui-spec.md`, `03-flow.md`, `08-dev-tasks.md`, `09-test-cases.md`, `10-release-checklist.md`
> **Non-goal**: this document does not implement code changes.

---

## Summary

현재 `dash-preview` focus zoom은 target-only 방식으로 글자 깨짐은 줄였지만, AI 패널과 `AI_APPLY` 구간에서 아직 이벤트가 겹쳐 보이는 문제가 남아 있다.

다음 개선은 `focus scale`, `data fill`, `result click cue`, `card highlight`를 따로 움직이게 두지 않고 하나의 phase event로 묶는 것이 목표다. 또한 `dash-preview` height는 고정값만 쓰지 않고 내부 컴포넌트 상태 변화에 맞춰 조정될 수 있는 adaptive frame 방식으로 재검토한다.

---

### Decision Update - 2026-04-28

The follow-up implementation keeps the `dash-preview` frame fixed again and reduces the previous maximum content height by `1/6`.
Current fixed content height is `867px`; visible frame height is `390.15px` on desktop scale `0.45` and `346.8px` on tablet scale `0.40`.
The adaptive height proposal below is retained as historical context, not the current implementation target.

## Current Problems

| 문제 | 현재 증상 | 영향 |
| --- | --- | --- |
| AI 패널 focus clipping | AI 패널 내부 target만 커지면서 패널 경계와 주변 화면을 침범하거나 잘려 보인다. | 카톡 입력창, 추출 버튼, 추출 결과 항목의 focus가 부자연스럽다. |
| 고정 height 한계 | `dash-preview` frame이 특정 높이에 고정되면 내부 상태 변화와 맞지 않는 빈 공간 또는 잘림이 생긴다. | preview가 화면 상태와 따로 노는 느낌을 준다. |
| 이벤트 중복 진행 | 추출 정보 클릭, 입력 카드 scale up, 실제 데이터 입력, column pulse가 서로 다른 타이밍으로 겹친다. | 하나의 적용 흐름이 아니라 여러 효과가 동시에 번지는 것처럼 보인다. |
| target mismatch | 실제 데이터가 적용되는 카드와 scale up되는 target이 정확히 일치하지 않는 구간이 있다. | 사용자가 "어디에 입력되는지" 바로 읽기 어렵다. |
| 불필요한 하이라이트 | 현재 단계와 직접 관련 없는 column pulse, 주변 card glow, 중복 ring이 focus 이벤트와 겹친다. | 현재 대상 카드 하나에 시선이 모이지 않는다. |

---

## Proposed Direction

### 1. Adaptive Preview Height

`PreviewChrome`은 단순 고정 height 대신 현재 focus phase의 layout 요구량을 반영하는 adaptive height를 사용한다.

| Mode | 설명 | 기본값 |
| --- | --- | --- |
| `overview` | 전체 구도 확인용, 내부 전체 화면이 잘리지 않도록 충분한 높이 | 900px 기반 |
| `ai-panel-focus` | AI 패널 내부 target scale up 시 패널 자체도 함께 확장 | AI panel expanded height/width |
| `form-card-focus` | 입력 카드 단위 focus 시 해당 카드가 잘리지 않는 높이 | card bounds + safe padding |
| `mobile` | 기존 `MobileCardView` 유지 | 변경 없음 |

구현은 CSS variable 또는 metadata 기반으로 시작한다. 예를 들어 `focus.frame.height`, `focus.frame.panelWidth`, `focus.frame.safePadding` 같은 값을 metadata에 두고 `PreviewChrome`이 frame 크기를 계산한다.

### 2. AI Panel Container Expansion

AI 패널 내부 요소가 focus될 때는 target만 scale up하지 말고 AI panel container도 같이 확장한다.

| Target | Container behavior | Target behavior |
| --- | --- | --- |
| `ai-input-textarea` / `ai-input` | AI panel width/height 확장 | 입력창만 scale up |
| `ai-extract-button` | AI panel width는 유지하거나 약간 확장 | 버튼만 scale up |
| `ai-result-*` | AI panel result list 영역이 잘리지 않도록 세로 확장 | 해당 result item만 scale up |

중요한 기준은 AI 패널 내부 scale up이 오른쪽 form 영역을 과하게 덮지 않도록 panel 자체의 확장 폭과 scale cap을 함께 조정하는 것이다.

### 3. Unified Phase Event

`AI_APPLY`의 각 단계는 아래 하나의 이벤트 단위로 통합한다.

```text
result click cue -> card scale up -> card-local data fill -> hold -> next result cue
```

현재처럼 여러 효과가 동시에 겹쳐 보이면 안 된다. 필요한 경우 기존 column pulse, 주변 card glow, 중복 ring은 제거하거나 비활성화한다.

최종 목표는 현재 적용 중인 카드 하나만 명확하게 보이는 것이다.

---

## Target Flow

### Desired AI_APPLY Sequence

| 순서 | Result cue | Scale target | Data fill target | 다음 단계 |
| --- | --- | --- | --- | --- |
| 1 | `상차지 추출정보` 클릭 | `상차지 입력 카드` | 상차지 카드 내부 필드 | `하차지 추출정보` |
| 2 | `하차지 추출정보` 클릭 | `하차지 입력 카드` | 하차지 카드 내부 필드 | `예상 운임/거리 카드` |
| 3 | 하차지 입력 완료 후 자동 전환 | `예상 운임/거리 카드` | 거리/소요 정보 표시 | `화물 정보 추출정보` |
| 4 | `화물 정보 추출정보` 클릭 | `화물 정보 입력 카드` | 차량/화물 카드 내부 필드 | `운임 정보` |
| 5 | `운임 정보` 클릭 | `정산 정보 카드` | 정산 정보 카드 내부 금액/수익 | 완료 또는 전체 preview 복귀 |

### Important Corrections

| 기존 해석 | 수정된 기준 |
| --- | --- |
| 운임 정보 클릭 후 `예상 운임/거리 카드` focus | 운임 정보 클릭 후 `정산 정보 카드` focus |
| 하차지 다음 바로 화물 정보로 이동 | 하차지 입력 후 `예상 운임/거리 카드` scale up을 먼저 보여준 뒤 화물 정보로 이동 |
| 카드가 속한 column 단위 강조 | 현재 phase의 단일 카드만 scale/highlight |
| focus 효과와 입력 효과가 별도 진행 | 하나의 phase event 안에서 순차 진행 |

---

## Scope

### Expected Files

| 영역 | 예상 파일 | 변경 성격 |
| --- | --- | --- |
| focus metadata | `src/lib/preview-steps.ts` 또는 신규 `src/lib/preview-focus.ts` | phase event, target, timing, adaptive frame metadata 정리 |
| preview frame | `src/components/dashboard-preview/preview-chrome.tsx` | adaptive height/panel expansion 지원 |
| flow controller | `src/components/dashboard-preview/dashboard-preview.tsx` | unified phase state와 transition 순서 조정 |
| AI panel | `src/components/dashboard-preview/ai-register-main/ai-panel/**` | AI panel focus 시 container expansion hook/prop 연결 |
| order form cards | `src/components/dashboard-preview/ai-register-main/order-form/**` | card-local fill/highlight target 정렬 |
| tests | `src/components/dashboard-preview/**/__tests__/**`, `src/__tests__/lib/preview-steps.test.ts` | phase sequence, target mapping, side effect regression |
| docs | `02-ui-spec.md`, `03-flow.md`, `09-test-cases.md`, `10-release-checklist.md` | 승인 후 구현 기준 갱신 |

### Out of Scope

| 항목 | 정책 |
| --- | --- |
| `MobileCardView` | 변경하지 않는다. 모바일은 현행 유지한다. |
| 실제 API/DB/AI 연동 | 하지 않는다. 데모용 mock flow만 조정한다. |
| 신규 animation dependency | 추가하지 않는다. |
| hero copy/layout 전체 개편 | 필요하면 별도 작업으로 분리한다. |

---

## Implementation Plan

### Phase 1. Target Mapping Audit

목표는 "result cue", "scale target", "data fill target"을 같은 phase id로 묶는 것이다.

작업:

1. `AI_APPLY` 관련 현재 target id를 모두 목록화한다.
2. `ai-result-*`와 form card id를 1:1 또는 1:N으로 재정의한다.
3. `form-estimate-info`와 `form-settlement`의 역할을 명확히 분리한다.
4. column-level pulse와 card-level focus가 동시에 켜지는 조건을 찾는다.

산출물:

| phaseId | result target | scale target | fill target | next |
| --- | --- | --- | --- | --- |
| `departure` | `ai-result-departure` | `form-pickup-location` | pickup fields | `destination` |
| `destination` | `ai-result-destination` | `form-delivery-location` | delivery fields | `distance-estimate` |
| `distance-estimate` | none or auto cue | `form-estimate-info` | distance/duration/amount | `cargo` |
| `cargo` | `ai-result-cargo` | `form-cargo-info` | vehicle/cargo fields | `settlement` |
| `settlement` | `ai-result-fare` | `form-settlement` | settlement totals/fees | done |

### Phase 2. Adaptive Frame and AI Panel Expansion

목표는 focus target이 커질 때 frame과 panel이 같이 대응하도록 만드는 것이다.

작업:

1. `PreviewChrome`에 `frameMode` 또는 `framePreset` metadata를 추가한다.
2. AI panel focus phase에서는 panel container expansion 값을 계산한다.
3. form card focus phase에서는 card bounds를 기준으로 height를 조정한다.
4. height transition은 너무 빠르게 튀지 않게 `duration`과 easing을 phase event와 맞춘다.

주의:

- 전체 화면 pan/zoom 방식으로 되돌리지 않는다.
- adaptive height가 hero layout shift를 만들 수 있으므로 최대/최소 높이를 둔다.
- desktop/tablet 값은 분리한다.

### Phase 3. Card-only Focus and Highlight Cleanup

목표는 현재 phase의 카드 하나만 시각적으로 명확하게 보이게 하는 것이다.

작업:

1. column pulse를 `AI_APPLY` card focus 중에는 비활성화하거나 phase별로 제한한다.
2. `active`, `focused`, `pulse`, `ring`, `glow`가 중복되는 class를 정리한다.
3. card component마다 `data-focus-card-id` 같은 명확한 marker를 추가할지 검토한다.
4. scale target과 fill target이 같은 DOM subtree 안에 있는지 검증한다.

완료 기준:

- 상차지 phase에서는 상차지 카드만 scale/highlight된다.
- 하차지 phase에서는 하차지 카드만 scale/highlight된다.
- 예상 운임/거리 phase에서는 `form-estimate-info` 카드만 scale/highlight된다.
- 화물 정보 phase에서는 화물 정보 카드만 scale/highlight된다.
- 운임 phase에서는 정산 정보 카드만 scale/highlight된다.

### Phase 4. Unified Timing

목표는 scale up과 데이터 입력이 서로 따로 놀지 않게 만드는 것이다.

권장 timing:

| Segment | Duration | 설명 |
| --- | ---: | --- |
| result click cue | 300-500ms | result item press/ripple |
| card scale up | 700-900ms | target card focus 확대 |
| card-local fill | 1000-1600ms | 해당 카드 내부 데이터 입력/롤링 |
| hold | 500-800ms | 사용자가 결과를 읽는 시간 |
| next cue | 300-500ms | 다음 result item으로 이동 |

정책:

- data fill은 card scale up이 시작된 직후가 아니라 scale이 어느 정도 진행된 뒤 시작한다.
- number rolling은 정산/거리 카드의 focus phase 안에서만 실행한다.
- 기존 `partialBeat`, `allBeat`, `formRevealTimeline`은 phase event 중심으로 재구성한다.

### Phase 5. Evidence and Docs

작업:

1. `02-ui-spec.md`의 flow와 target map을 새 순서로 갱신한다.
2. `03-flow.md`의 mermaid flow를 새 5-step AI_APPLY 흐름으로 갱신한다.
3. `09-test-cases.md`에 event overlap regression을 추가한다.
4. `10-release-checklist.md`에 screenshot evidence 항목을 갱신한다.

---

## Side Effect Review

| 영향 영역 | 리스크 | 수준 | 대응 |
| --- | --- | --- | --- |
| Hero layout | adaptive height가 hero 아래 여백과 section 위치를 흔들 수 있다. | medium | min/max height와 transition duration을 둔다. |
| Desktop visual | AI panel expansion이 오른쪽 form 영역을 가릴 수 있다. | medium | panel expansion cap과 form dim/scale 정책을 함께 둔다. |
| Tablet visual | 3-column preview가 좁아져 card focus가 잘릴 수 있다. | medium | tablet 전용 frame preset과 lower scale cap을 둔다. |
| Mobile | 잘못 연결하면 `MobileCardView` 대신 desktop preview가 렌더될 수 있다. | high | mobile branch regression test 유지, 파일 미수정 원칙. |
| Interactive overlay | adaptive frame/target scale이 hit area 좌표와 어긋날 수 있다. | high | interactive mode에서는 focus scaling disable 또는 overlay recompute. |
| Reduced motion | unified phase가 motion 없는 환경에서 의미를 잃을 수 있다. | medium | highlight-only + phase label 유지. |
| Timing regression | 기존 autoplay duration을 넘겨 다음 step과 겹칠 수 있다. | medium | total phase duration validation 추가. |
| 불필요한 highlight 제거 | 기존 visual cue가 줄어 사용자가 변화 인지를 덜 할 수 있다. | low | 단일 card focus + local fill cue를 더 명확하게 만든다. |

---

## Test Plan

### Unit / Component

| 검증 | 목적 |
| --- | --- |
| `preview-steps.test.ts` | phase event 순서와 target mapping 검증 |
| `preview-chrome.test.tsx` | adaptive frame, panel expansion, target-only scaling 검증 |
| `dashboard-preview.test.tsx` | click-to-card unified phase flow 검증 |
| `order-form/*/flow.test.tsx` | 해당 카드 내부 fill만 실행되는지 검증 |
| `interactive-overlay.test.tsx` | interactive mode 좌표 regression 검증 |
| `mobile-card-view` 관련 test | 모바일 유지 검증 |

### Commands

```bash
npm run test -- src/__tests__/lib/preview-steps.test.ts src/components/dashboard-preview/__tests__/preview-chrome.test.tsx src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx
npm run test -- dashboard-preview
npm run typecheck
npm run build
git diff --check
```

### Visual Evidence

| Viewport | 확인 항목 |
| --- | --- |
| Desktop | AI input, extract button, each result-to-card phase |
| Desktop | 하차지 입력 후 예상 운임/거리 카드 phase |
| Desktop | 운임 정보 클릭 후 정산 정보 카드 phase |
| Tablet | right-side card focus clipping 여부 |
| Mobile | 기존 `MobileCardView` 유지 |
| Reduced motion | 큰 scale 없이 순서가 이해되는지 |

---

## Open Questions

| ID | 질문 | 기본 제안 |
| --- | --- | --- |
| `OPEN-FZ-UF-001` | adaptive height가 hero layout을 움직여도 되는가? | preview 내부 잘림 해소가 우선이면 허용하되 max height를 둔다. |
| `OPEN-FZ-UF-002` | AI panel expansion이 form 영역을 일부 덮어도 되는가? | 덮기보다 panel width/height와 target scale을 같이 제한한다. |
| `OPEN-FZ-UF-003` | 하차지 후 예상 운임/거리 phase는 자동 phase인가 클릭 phase인가? | 하차지 입력 완료 후 자동 phase로 둔다. |
| `OPEN-FZ-UF-004` | 운임 정보 클릭 후 정산 정보 카드에 어떤 데이터가 먼저 보여야 하는가? | 청구/지급/수익 totals rolling을 우선한다. |
| `OPEN-FZ-UF-005` | column pulse를 완전히 제거할지, 특정 phase에서만 끌지? | `AI_APPLY` unified phase에서는 기본 비활성화한다. |

---

## Recommended Next Step

먼저 `Phase 1. Target Mapping Audit`을 실행해 phase event table을 코드 metadata와 맞춘 뒤 구현에 들어가는 것을 추천한다.

이유:

- 현재 문제의 핵심은 scale 값 자체보다 event ownership이 겹쳐 있는 것이다.
- target mapping을 먼저 고정하지 않으면 height, panel expansion, timing 조정이 다시 서로 어긋날 가능성이 높다.
- mapping이 고정되면 이후 구현은 `PreviewChrome`, `dashboard-preview`, `preview-steps`, card tests로 좁게 나눌 수 있다.
