# F4 Implementation Hints

## Files

```txt
src/lib/landing-workflow.ts
src/lib/motion.ts
src/components/sections/workflow-manual.tsx
src/__tests__/lib/landing-workflow.test.ts
src/components/sections/__tests__/workflow-manual.test.tsx
```

## Notes

- `WORKFLOW_STEPS`에 `state` 객체를 추가한다.
- `motion.ol`, `motion.li`를 사용하되 reduced motion에서는 animation props를 끈다.
- status events는 `li`가 아닌 `span`으로 렌더링해 workflow step listitem 개수를 유지한다.
