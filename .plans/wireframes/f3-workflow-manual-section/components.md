# Wireframe Components: f3-workflow-manual-section

> 업무 매뉴얼형 섹션의 UI 요소, 상태, 데이터 구조, PRD 매핑 기준.

---

## 1. Component Spec

| 컴포넌트 | 타입 | 상태 | 동작 | PRD 요구사항 |
|---|---|---|---|---|
| WorkflowManualSection | Section | default | 섹션 전체 layout과 heading 제공 | `REQ-f3-workflow-manual-section-001`, `012` |
| WorkflowIntro | Text block | default | 핵심 메시지와 커스텀 가능성 설명 | `REQ-f3-workflow-manual-section-004` |
| CustomizationPillList | Badge/List | default/mobile-stack | 요청 양식, 배차 방식, 정산 기준, 화물맨 연동 기준 표시 | `REQ-f3-workflow-manual-section-004`, `005` |
| WorkflowTimeline | Timeline/List | default/mobile-stack | 6단계 순서 렌더링 | `REQ-f3-workflow-manual-section-002`, `011` |
| WorkflowStepCard | Card/Row | default/hover/focus | 단계 제목, 설명, 맞춤 포인트 표시 | `REQ-f3-workflow-manual-section-003`, `005` |
| StepNumber | Text/Badge | default | 01~06 단계 번호 표시 | `REQ-f3-workflow-manual-section-002` |
| StepTitle | Text | default | 단계 제목 표시 | `REQ-f3-workflow-manual-section-003` |
| StepDescription | Text | default | 1~2문장 업무 설명 | `REQ-f3-workflow-manual-section-003` |
| StepCustomization | Text/List | default | 회사별 맞춤 포인트 표시 | `REQ-f3-workflow-manual-section-005` |
| WorkflowCTAGroup | Button group | default/focus/mobile-stack | 기존 문의/서비스 이동 CTA 재사용 | `REQ-f3-workflow-manual-section-012`, `013` |

---

## 2. Workflow Data Shape Hint

실제 구현에서는 필드명보다 역할 분리가 중요하다. F4가 이어받기 쉽도록 단계별 stable id를 둔다.

```ts
type WorkflowStep = {
  id: 'ai-order' | 'locations' | 'dispatch-status' | 'hwamulman' | 'settlement' | 'invoice'
  order: number
  title: string
  description: string
  customization: string[]
  handoff?: string
  statusLabel?: string
}
```

## 3. Step Content Baseline

| id | title | description | customization |
|---|---|---|---|
| `ai-order` | AI 오더 등록 | 여러 형식의 운송 요청을 오더 정보로 정리한다 | 화주별 요청 양식, 필수 입력값 |
| `locations` | 상하차지 관리 | 장소, 담당자, 현장 메모를 반복 입력 없이 재사용한다 | 장소명, 담당자, 현장 메모 |
| `dispatch-status` | 배차/운송 상태 | 배차 진행과 운송 상태를 한 흐름에서 확인한다 | 상태명, 승인 흐름 |
| `hwamulman` | 화물맨 연동 | 배차 단계에서 운송 정보를 외부 채널로 이어 보낸다 | 전송 시점, 전송 필드 |
| `settlement` | 정산 자동화 | 운송 완료 후 매출 정산 기준을 묶어 관리한다 | 청구 기준, 정산 기준 |
| `invoice` | 세금계산서 관리 | 정산 이후 증빙 상태까지 이어서 확인한다 | 발행 상태, 담당자 확인 |

## 4. State Rules

| 상태 | 시각 기준 | 접근성 기준 |
|---|---|---|
| default | 모든 단계 정보 표시 | heading hierarchy 유지 |
| hover | background/border만 변경 | layout shift 없음 |
| focus | CTA와 interactive item에 focus ring | keyboard visible focus |
| mobile | 카드 단일 열 | 제목/본문/맞춤 포인트가 겹치지 않음 |
| reduced motion | static display | 정보 전달이 animation에 의존하지 않음 |

## 5. Copy Rules

| 항목 | 사용 | 피함 |
|---|---|---|
| 섹션 headline | `화주와 주선사마다 다른 운송 운영을 하나의 흐름으로 조율` | `OPTIC은 모든 설정을 자동으로 완성` |
| 화물맨 | `배차 단계에서 운송 정보를 이어 보냄` | 정산/증빙 기능처럼 설명 |
| 정산 | `정산 자동화`, `세금계산서 관리` | `정산/세금계산서 연결`처럼 모호한 표현 |
| 커스텀 | `요청 양식`, `정산 기준`, `전송 필드` | tenant admin 또는 설정 저장 구현 약속 |
| 제품 설명 | 업무 흐름 중심 | F2 제품 카드 반복 |

## 6. PRD Mapping

| PRD ID | Component 반영 |
|---|---|
| `REQ-f3-workflow-manual-section-001` | WorkflowManualSection |
| `REQ-f3-workflow-manual-section-002` | WorkflowTimeline, StepNumber |
| `REQ-f3-workflow-manual-section-003` | WorkflowStepCard, StepTitle, StepDescription |
| `REQ-f3-workflow-manual-section-004` | WorkflowIntro, CustomizationPillList |
| `REQ-f3-workflow-manual-section-005` | StepCustomization |
| `REQ-f3-workflow-manual-section-006` | `hwamulman` step |
| `REQ-f3-workflow-manual-section-007` | `settlement`, `invoice` steps |
| `REQ-f3-workflow-manual-section-008` | Copy rules, landing flow placement |
| `REQ-f3-workflow-manual-section-009` | Workflow data shape |
| `REQ-f3-workflow-manual-section-010` | stable id and optional status fields |
| `REQ-f3-workflow-manual-section-011` | mobile state rules |
| `REQ-f3-workflow-manual-section-012` | focus/reduced motion rules |
| `REQ-f3-workflow-manual-section-013` | copy rules |
| `REQ-f3-workflow-manual-section-014` | testable step content baseline |
