# Draft — Dash Preview 단계별 포커스 줌 애니메이션

> **IDEA**: [IDEA-20260427-003](../../ideas/20-approved/IDEA-20260427-003.md)
> **Screening**: [SCREENING-20260427-003](../../ideas/20-approved/SCREENING-20260427-003.md)
> **Lane**: Lite
> **Scenario**: B (기존 `dash-preview` 자동 재생 표현 개선)
> **Feature type**: dev
> **Hybrid**: false
> **Epic**: -
> **Slug**: `dash-preview-focus-zoom-animation`

---

## 1. 목표

기존 `dash-preview`의 자동 재생 흐름을 단계별 포커스 줌 방식으로 개선한다. 사용자가 전체 축소 화면을 한 번에 해석하지 않아도, 현재 단계에서 봐야 할 UI 영역이 화면 중심에 더 크게 보이도록 한다.

핵심은 새로운 업무 기능을 추가하는 것이 아니라, 이미 있는 AI 입력 → 추출 → 결과 → 폼 적용 흐름을 더 선명하게 보여주는 것이다.

## 2. 배경

현재 `dash-preview`는 `PREVIEW_STEPS` 기반으로 `INITIAL`, `AI_INPUT`, `AI_EXTRACT`, `AI_APPLY` 단계를 자동 재생한다. Desktop/Tablet에서는 `PreviewChrome` 내부에 `AiRegisterMain` 또는 legacy preview가 축소 표시되고, Mobile에서는 `MobileCardView`로 단순화된다.

이 구조는 제품 화면의 밀도와 전체 흐름을 보여주는 데 강점이 있지만, 화면 안의 요소가 작아 각 단계의 시선 위치가 흐려질 수 있다. 포커스 줌은 단계별로 입력창, 추출 버튼, 추출 결과, 적용 대상 폼을 더 크게 보여줘 시선을 유도한다.

## 3. 범위

| 영역 | In-scope |
|---|---|
| Step focus model | 각 `PreviewStep` 또는 별도 mapping에 focus target을 정의한다. |
| Cinematic viewport | `PreviewChrome` 내부 content를 `scale`/`translate`로 이동하거나 focus layer로 전환한다. |
| 단계별 연출 | 입력창, 추출 버튼, 결과 버튼, 적용 대상 폼, 완료 요약을 순서대로 강조한다. |
| Reduced motion | `prefers-reduced-motion`에서 과한 이동 대신 highlight/opacity 중심으로 대체한다. |
| Responsive | Desktop/Tablet/Mobile별 포커스 preset 또는 단순화 전략을 정의한다. |
| QA 기준 | screenshot/browser 확인과 interaction 회귀 확인 기준을 둔다. |

## 4. 제외 범위

- `dash-preview` 업무 시나리오 자체 변경
- `PREVIEW_MOCK_DATA` 구조 재설계
- 실제 AI/API 연동
- 새 제품 화면 추가
- Hero 전체 레이아웃 재설계
- 기존 `InteractiveOverlay` hit-area 전면 재작성
- PRD 승인 전 구현 착수

## 5. 핵심 결정

| 항목 | 결정 |
|---|---|
| 첫 접근 | 기존 step state에 focus metadata를 얹는 방식으로 검토한다. |
| 구현 후보 | `transform: translate(...) scale(...)` 기반 viewport pan/zoom을 1순위로 둔다. |
| 대체 후보 | 단계별 scene layer를 따로 렌더링하는 방식은 transform 방식이 불안정할 때 검토한다. |
| Mobile | 현재 구현된 `MobileCardView`를 변경하지 않는다. |
| Accessibility | reduced motion에서는 scale/translate 이동 폭을 줄이고 현재 영역 border/highlight만 남긴다. |
| Interactive mode | 자동 재생 focus 모델과 click hit-area 모델은 공유하되, 책임은 분리한다. |

## 6. 단계별 초안

| 단계 | 현재 step | 포커스 대상 | 연출 방향 |
|---|---|---|---|
| 1 | `INITIAL` | 전체 preview | 전체 구조를 짧게 보여준다. |
| 2 | `AI_INPUT` | `ai-input-textarea` | 입력창으로 확대 이동하고 fake typing을 보여준다. |
| 3 | `AI_EXTRACT` | `ai-extract-button` | 추출하기 버튼을 중심에 두고 press animation을 강조한다. |
| 4 | `AI_APPLY` 초반 | `ai-result-*` 그룹 | 추출 결과 버튼 그룹으로 화면을 내리고 stagger 적용을 보여준다. |
| 5 | `AI_APPLY` 중반 | result click + form card targets | 상차지 추출정보 클릭 → 상차지 입력 카드 → 하차지 추출정보 클릭 → 하차지 입력 카드 → 화물 정보 추출정보 클릭 → 화물 정보 입력 카드 → 운임 추출정보 클릭 → 운임 카드 순서로 반복한다. |
| 6 | `AI_APPLY` 후반 | settlement/summary | 정산 또는 완료 요약을 보여주고 다음 루프로 돌아간다. |

## 7. Focus Metadata 초안

```ts
type FocusZoomPreset = {
  stepId: StepId
  phase?: string
  targetId: string
  scale: number
  x: number
  y: number
  durationMs: number
  easing: 'easeOut' | 'easeInOut'
  reducedMotionMode: 'highlight-only' | 'small-shift'
}
```

초기 구현은 DOM 측정 기반보다 preset 기반을 우선한다. 현재 preview는 축소된 데모 화면이므로, 실제 DOMRect를 매번 측정하는 방식은 반응형·scale factor·dynamic import 상태와 엮여 복잡해질 수 있다.

## 8. 사용자 이야기

1. 방문자로서, 카톡 메시지 입력 단계에서 어디에 텍스트가 입력되는지 바로 보고 싶다. 그래야 AI 등록 흐름의 시작점을 이해할 수 있다.
2. 방문자로서, 추출하기 버튼을 누른 뒤 어떤 결과가 생기는지 자연스럽게 보고 싶다. 그래야 버튼과 추출 결과의 관계를 이해할 수 있다.
3. 방문자로서, 추출된 상차지 정보를 클릭하면 상차지 입력 카드로 이동하고 다시 다음 추출정보로 돌아오는 흐름을 보고 싶다. 그래야 추출정보와 실제 입력 카드의 연결을 이해할 수 있다.
4. 모바일 사용자로서, 현재 구현된 모바일 데모가 그대로 유지되길 원한다. 그래야 desktop/tablet 전용 변경 때문에 모바일 경험이 흔들리지 않는다.
5. motion에 민감한 사용자로서, 과한 줌 이동 없이도 현재 단계가 무엇인지 알 수 있길 원한다. 그래야 페이지를 편안하게 볼 수 있다.

## 9. 초기 요구사항

| ID | 요구사항 | 우선순위 |
|---|---|:---:|
| REQ-FZ-001 | 각 preview 단계는 하나의 primary focus target을 가진다. | Must |
| REQ-FZ-002 | `AI_INPUT`에서는 입력창이 화면 중심에 확대되어 보인다. | Must |
| REQ-FZ-003 | `AI_EXTRACT`에서는 추출하기 버튼 press 상태가 강조된다. | Must |
| REQ-FZ-004 | `AI_APPLY`에서는 추출정보 클릭과 대응 입력 카드 이동이 상차지, 하차지, 화물 정보, 운임 순서로 반복된다. | Must |
| REQ-FZ-005 | focus 이동은 기존 `goToStep`, autoplay, hover pause 흐름을 깨지 않는다. | Must |
| REQ-FZ-006 | `prefers-reduced-motion`에서는 큰 pan/zoom 대신 highlight 중심 표현을 사용한다. | Must |
| REQ-FZ-007 | Mobile에서는 현재 구현된 `MobileCardView`를 변경하지 않는다. | Must |
| REQ-FZ-008 | 기존 interactive hit-area 클릭 동작은 유지된다. | Must |
| REQ-FZ-009 | Desktop/Tablet에서 text와 버튼이 잘리지 않는다. | Must |
| REQ-FZ-010 | focus preset은 테스트 가능한 데이터로 분리한다. | Should |

## 10. 수용 기준

- `AI_INPUT` 단계에서 입력창이 명확한 focus 영역으로 보인다.
- `AI_EXTRACT` 단계에서 추출하기 버튼과 클릭/press 효과가 중심이 된다.
- `AI_APPLY` 단계에서 추출 결과와 폼 적용 대상이 최소 2개 이상의 sub-phase로 구분된다.
- `prefers-reduced-motion`에서 autoplay 자체는 기존 정책을 따르며, 과한 이동 애니메이션은 비활성화된다.
- Desktop과 Tablet에서 focus target이 frame 밖으로 어색하게 잘리지 않는다.
- Mobile에서 현재 `MobileCardView` 구현을 변경하지 않는다.
- 기존 `StepIndicator` 클릭과 interactive overlay 진입이 동작해야 한다.
- focus metadata는 단위 테스트로 step id, target id, reduced motion fallback을 검증할 수 있다.

## 11. 실현 가능성

| 주제 | 평가 |
|---|---|
| 아키텍처 적합성 | 좋음. `PREVIEW_STEPS`, `useAutoPlay`, `PreviewChrome`이 이미 단계 기반이다. |
| 구현 난이도 | medium. transform 계산과 반응형 preset 검증이 필요하다. |
| UX 리스크 | medium. 과한 zoom은 데모보다 장식처럼 보일 수 있다. |
| 테스트 가능성 | 좋음. focus metadata와 reduced motion 분기는 단위 테스트가 가능하다. |
| 브라우저 QA | 필요. 실제 frame crop, text overflow, motion 느낌은 screenshot 확인이 필요하다. |

## 12. 예상 작업 영역

| 영역 | 후보 파일 |
|---|---|
| Preview container | `src/components/dashboard-preview/dashboard-preview.tsx` |
| Chrome/viewport | `src/components/dashboard-preview/preview-chrome.tsx` |
| Step data | `src/lib/preview-steps.ts` 또는 새 `src/lib/preview-focus.ts` |
| Mobile preservation check | `src/components/dashboard-preview/mobile-card-view.tsx` 변경 없이 유지 확인 |
| Motion variants | `src/lib/motion.ts` |
| Tests | `src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx` |
| Tests | `src/components/dashboard-preview/__tests__/a11y.test.tsx` |
| Tests | 새 focus metadata 단위 테스트 |

## 13. 리스크

| 리스크 | 수준 | 대응 |
|---|:---:|---|
| pan/zoom이 화면 밖 crop을 만들 수 있음 | medium | scale 상한과 target별 safe area를 PRD에서 고정한다. |
| 기존 interactive overlay 좌표와 충돌 | medium | focus viewport transform과 overlay transform 책임을 분리한다. |
| Mobile scope creep | medium | Mobile은 현재 `MobileCardView` 유지로 고정한다. |
| motion 과다로 피로감 발생 | medium | reduced motion과 maximum duration 기준을 둔다. |
| Phase 3 step timing과 sub-phase timing 충돌 | medium | `AI_APPLY` sub-phase는 `interactions.partialBeat/allBeat`와 정렬한다. |

## 14. 검증 계획

| 검증 | 범위 |
|---|---|
| Unit | focus metadata schema, step id coverage, reduced motion fallback |
| Component | `DashboardPreview` render, `StepIndicator`, interactive mode 유지 |
| A11y | `prefers-reduced-motion`, aria-live 상태 메시지 유지 |
| Browser QA | Desktop/Tablet screenshot으로 crop과 overlap 확인, Mobile은 현행 유지 regression 확인 |
| Regression | existing dashboard-preview test suite 통과 |

## 15. 라우팅 결과

| 축 | 결과 | 근거 |
|---|---|---|
| 범주 | Lite | 한 landing demo 영역의 표현 개선이며 DB/API/auth 변경이 없다. |
| 시나리오 | B | 기존 `dash-preview`의 시네마틱 표현을 보강한다. |
| 기능 유형 | dev | copy parity가 아니라 현재 구현의 UX animation 개선이다. |
| Hybrid 여부 | false | 외부 reference 없이 기존 project context 안에서 정의 가능하다. |
| PRD 필요 | true | animation, reduced motion, responsive QA 기준을 명확히 잠글 필요가 있다. |
| 다음 경로 | `/plan-prd` | 구현 전 상세 요구사항과 acceptance criteria를 확정한다. |

## 16. 다음 단계

1. `/plan-prd .plans/drafts/dash-preview-focus-zoom-animation/`로 상세 PRD를 작성한다.
2. PRD에서 focus metadata schema, 클릭 기반 적용 흐름, 단계별 scale/position preset, mobile 현행 유지, reduced motion 기준을 확정한다.
3. Lite feature 게이트에 따라 `/plan-bridge`는 생략하고, feature binding 확인 후 `/dev-feature dash-preview-focus-zoom-animation`으로 넘긴다.
