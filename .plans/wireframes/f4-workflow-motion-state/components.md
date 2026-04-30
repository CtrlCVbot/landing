# F4 Wireframe - Components

| Component | Role |
|---|---|
| `WorkflowManual` | F4 구현 대상 section |
| `WorkflowStatusBoard` | 각 step의 mock 상태 요약 |
| `WorkflowStatusEvent` | 상태 이벤트 chip |
| `WORKFLOW_STEPS.state` | 상태 title, summary, events SSOT |

## Motion

- Section: 기존 `SectionWrapper` fade-in 유지
- List: staggered children
- Card: opacity + small y transition
- Hover: border/shadow color만 변경, height 변경 없음
