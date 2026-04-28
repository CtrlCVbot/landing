# UI Spec: dash-preview-focus-zoom-animation

> **Feature**: Dash Preview Focus Zoom Animation
> **Requirements SSOT**: `01-requirements.md`
> **Flow**: `03-flow.md`
> **Created**: 2026-04-28

---

## 0. 이 문서의 역할

이 문서는 `DashboardPreview` 안에서 어떤 화면 요소가 언제, 어떻게 focus 되는지를 정의한다. 디자인 시스템을 새로 만들지 않고 기존 `PreviewChrome`, `AiRegisterMain`, `StepIndicator`, `InteractiveOverlay`를 유지한다.

---

## 1. Visual Principles

| 원칙 | 설명 |
|---|---|
| 읽기 보조 | zoom은 장식이 아니라 현재 단계의 읽기 보조다. |
| 고정 frame | 외부 `PreviewChrome` 사각 화면은 안정적으로 유지한다. |
| 단계별 중심 이동 | 화면 전체를 움직이는 느낌보다 target이 중심에 들어오는 느낌을 우선한다. |
| mobile 불변 | mobile은 focus zoom UI를 적용하지 않는다. |
| reduced motion 우선 | motion 민감 사용자는 큰 이동 없이 highlight만 본다. |

---

## 2. Focus Target Map

| Step | Target ID 후보 | UI target | 표현 | REQ |
|---|---|---|---|---|
| `INITIAL` | `preview-overview` | 전체 preview | 낮은 scale, 전체 구도 | `REQ-FZ-001` |
| `AI_INPUT` | `ai-input-textarea` | 카톡 텍스트 입력창 | center zoom + subtle border | `REQ-FZ-002` |
| `AI_EXTRACT` | `ai-extract-button` | 추출하기 버튼 | center focus + press highlight | `REQ-FZ-003` |
| `AI_EXTRACT_RESULT` | `ai-result-group` | 결과 버튼 그룹 | result group pan | `REQ-FZ-004` |
| `AI_APPLY_PICKUP` | `pickup-card` | 상차지 입력 카드 | result click cue → card focus | `REQ-FZ-005`, `REQ-FZ-006` |
| `AI_APPLY_DELIVERY` | `delivery-card` | 하차지 입력 카드 | result click cue → card focus | `REQ-FZ-005`, `REQ-FZ-006` |
| `AI_APPLY_CARGO` | `cargo-card` | 화물 정보 입력 카드 | result click cue → card focus | `REQ-FZ-005`, `REQ-FZ-006` |
| `AI_APPLY_FARE` | `fare-card` | 운임 카드 | result click cue → card focus | `REQ-FZ-005`, `REQ-FZ-006` |

---

## 3. Viewport Preset Shape

구현은 exact type을 조정할 수 있지만, 최소한 아래 의미를 만족해야 한다.

```ts
interface FocusPreset {
  readonly stepId: string
  readonly phaseId?: string
  readonly targetId: string
  readonly viewport: 'desktop' | 'tablet'
  readonly scale: number
  readonly x: number
  readonly y: number
  readonly durationMs: number
  readonly highlightOnly?: boolean
}
```

| 필드 | 의미 |
|---|---|
| `stepId` | `PREVIEW_STEPS`의 step id 또는 equivalent id |
| `phaseId` | `AI_APPLY` 내부 sub-phase |
| `targetId` | DOM marker 또는 metadata target |
| `viewport` | desktop/tablet preset 분리 |
| `scale`, `x`, `y` | focus viewport transform 값 |
| `durationMs` | 해당 step duration 안에서 완료되는 시간 |
| `highlightOnly` | reduced motion fallback 여부 |

---

## 4. Desktop / Tablet

| Viewport | 정책 | 확인 기준 |
|---|---|---|
| Desktop | focus zoom 기본 적용 | target이 `PreviewChrome` 안에서 crop 없이 읽힌다. |
| Tablet | 별도 preset 허용 | desktop preset을 그대로 쓰다 crop이 생기면 tablet 값 분리 |
| Mobile | 적용하지 않음 | `MobileCardView` 현행 유지 |

---

## 5. US-FZ-003 Click-to-card UI

`AI_APPLY`는 “자동으로 줄줄이 채워짐”이 아니라, 사용자가 추출정보를 클릭하면 관련 입력 카드가 보이는 듯한 흐름으로 보여준다.

| 순서 | Result cue | 이동 target | 카드에 보여야 할 정보 |
|---|---|---|---|
| 1 | 상차지 추출정보 클릭 | `pickup-card` | 상차지 주소, 담당자, 상차 일시 |
| 2 | 하차지 추출정보 클릭 | `delivery-card` | 하차지 주소, 담당자, 하차 일시 |
| 3 | 화물 정보 추출정보 클릭 | `cargo-card` | 차량 종류, 중량, 화물명 |
| 4 | 운임 추출정보 클릭 | `fare-card` | 운임, 거리, 예상 시간 또는 정산 요약 |

각 cue는 press/ripple이 없어도 된다. 다만 사용자-facing sequence가 “클릭 → 이동”으로 읽혀야 한다.

---

## 6. Reduced Motion UI

| 일반 motion | reduced motion 대체 |
|---|---|
| scale + translate | static highlight |
| pan 이동 | target border / shadow |
| click-to-card 이동 | 순서별 highlight 전환 |
| press highlight | opacity 또는 border 강조 |

Reduced motion에서도 `US-FZ-003` 순서는 유지한다.

---

## 7. Accessibility Notes

| 항목 | 정책 |
|---|---|
| Decorative layer | `aria-hidden` 또는 동등 처리 |
| Keyboard order | 기존 `StepIndicator`와 interactive overlay focus 순서를 바꾸지 않음 |
| aria-live | 기존 단계 안내를 방해하지 않음 |
| Hit area | overlay 좌표와 focus viewport transform 충돌 시 interactive mode에서는 focus viewport를 끔 |

---

## 8. Visual QA Checklist

| 항목 | Desktop | Tablet | Mobile |
|---|:---:|:---:|:---:|
| `AI_INPUT` 입력창 focus | [ ] | [ ] | 해당 없음 |
| `AI_EXTRACT` 버튼 focus | [ ] | [ ] | 해당 없음 |
| 결과 버튼 group focus | [ ] | [ ] | 해당 없음 |
| `US-FZ-003` 4단계 flow | [ ] | [ ] | 해당 없음 |
| crop/overlap 없음 | [ ] | [ ] | [ ] |
| mobile 현행 유지 | 해당 없음 | 해당 없음 | [ ] |
