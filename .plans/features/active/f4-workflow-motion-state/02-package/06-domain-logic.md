# F4 Domain Logic

## Data Shape

```ts
type WorkflowStepState = {
  title: string
  summary: string
  tone: 'progress' | 'success' | 'warning' | 'neutral'
  events: readonly string[]
}
```

## Copy Constraints

- Mock state는 샘플임을 명시한다.
- 실제 연동 완료, 자동 발행 완료, 성공 보장을 쓰지 않는다.
