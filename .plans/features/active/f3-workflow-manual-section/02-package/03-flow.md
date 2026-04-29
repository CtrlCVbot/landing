# 03. Flow - F3 업무 매뉴얼형 스크롤 섹션 MVP

---

## 1. Landing Scroll Flow

```text
Hero
  -> Problems
  -> Features
  -> Products
  -> WorkflowManual (F3)
  -> Integrations
  -> Cta
  -> Footer
```

F3는 제품 라인업을 다시 설명하지 않고, 제품을 이해한 방문자에게 실제 업무가 어떤 순서로 이어지는지 보여주는 역할을 맡는다.

## 2. User Reading Flow

| 순서 | 사용자가 이해해야 할 것 | UI 단서 |
|---:|---|---|
| 1 | OPTIC은 회사별 운영 방식에 맞춰 조율된다 | intro headline, customization summary |
| 2 | 운송 요청은 AI 오더로 정리된다 | step 01 |
| 3 | 상하차지와 현장 정보가 반복 입력 없이 이어진다 | step 02 |
| 4 | 배차와 운송 상태를 한 흐름에서 본다 | step 03 |
| 5 | 화물맨 연동은 배차 단계의 외부 채널 연결이다 | step 04 |
| 6 | 정산과 세금계산서는 후속 단계로 분리된다 | step 05, 06 |

## 3. Data Flow

```text
src/lib/landing-workflow.ts
  -> WORKFLOW_STEPS
  -> src/components/sections/workflow-manual.tsx
  -> src/app/page.tsx
```

권장 data export:

```ts
export const WORKFLOW_STEPS = [
  { id: 'ai-order', order: 1, title: 'AI 오더 등록', ... },
  ...
] as const
```

## 4. Render Flow

1. `WorkflowManual`이 `WORKFLOW_STEPS`를 import한다.
2. Intro 영역에서 커스텀 가능성 메시지를 보여준다.
3. `WORKFLOW_STEPS`를 order 기준으로 렌더링한다.
4. Step card는 title, description, customization을 보여준다.
5. Page composition에서 `Products` 다음에 배치한다.

## 5. State and Interaction

F3는 static MVP다.

| 상태 | 기준 |
|---|---|
| default | 모든 단계가 처음부터 읽을 수 있어야 한다 |
| hover | 카드 강조만 가능, 정보 노출 여부가 바뀌지 않는다 |
| focus | CTA와 링크에 visible focus가 있어야 한다 |
| active/scroll | F3 범위 아님, F4로 보류 |

## 6. F4 Handoff Flow

F4는 아래 값을 이어받는다.

| 값 | 이유 |
|---|---|
| `id` | animation target, mock state key |
| `order` | timeline progress 순서 |
| `title` | 상태 mock label |
| `handoff` 또는 `statusLabel` | F4에서 상태 표시로 확장 가능 |

F3 구현 중 id/order가 변경되면 F4 문서와 테스트도 함께 갱신해야 한다.
