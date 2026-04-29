# 09. Test Cases - F3 업무 매뉴얼형 스크롤 섹션 MVP

---

## 1. Test Matrix

| TC | 제목 | REQ | 방식 | 기대 결과 |
|---|---|---|---|---|
| TC-F3-01 | workflow data shape/order 검증 | REQ-F3-002, 009, 010 | unit | 6개 step, stable id, order 유지 |
| TC-F3-02 | step content 렌더링 검증 | REQ-F3-003, 004, 005 | component | title/description/customization 노출 |
| TC-F3-03 | 화물맨/정산/세금계산서 순서 검증 | REQ-F3-006, 007 | unit/component | `hwamulman` 4번, settlement/invoice 분리 |
| TC-F3-04 | page composition 검증 | REQ-F3-001, 008 | smoke/component | Products 이후 Workflow section |
| TC-F3-05 | 375px 모바일 visual check | REQ-F3-011 | manual/browser | 텍스트 겹침 없음 |
| TC-F3-06 | 접근성 기본 검증 | REQ-F3-012 | component/manual | heading/list/focus 유지 |
| TC-F3-07 | copy guard 검증 | REQ-F3-013 | scan/review | 과장 문구 없음 |
| TC-F3-08 | full verification | REQ-F3-014 | command | test/typecheck/lint/build 통과 |

## 2. Suggested Unit Tests

### `src/__tests__/lib/landing-workflow.test.ts`

```ts
expect(WORKFLOW_STEPS).toHaveLength(6)
expect(WORKFLOW_STEPS.map((step) => step.id)).toEqual([
  'ai-order',
  'locations',
  'dispatch-status',
  'hwamulman',
  'settlement',
  'invoice',
])
expect(WORKFLOW_STEPS.find((step) => step.id === 'hwamulman')?.order).toBe(4)
```

## 3. Suggested Component Tests

### `src/components/sections/__tests__/workflow-manual.test.tsx`

- section heading이 보인다.
- `AI 오더 등록`, `화물맨 연동`, `정산 자동화`, `세금계산서 관리`가 보인다.
- 커스텀 가능성 메시지가 보인다.
- `OPTIC Broker`, `OPTIC Shipper` 제품 카드가 반복 렌더링되지 않는다.

## 4. Suggested Page Composition Test

### `src/__tests__/app/page.test.tsx`

필요할 때만 만든다.

- `Products` section 이후 `WorkflowManual` heading이 나온다.
- `WorkflowManual` 이후 `Integrations` section이 나온다.

테스트가 page import mocking 비용을 크게 만들면, `/dev-run`에서 component-level smoke와 manual evidence로 대체하고 이유를 기록한다.

## 5. Copy Scan

```powershell
Select-String -Path 'src\**\*.ts','src\**\*.tsx' -Pattern 'AI 오더 등록','상하차지 관리','배차/운송 상태','화물맨 연동','정산 자동화','세금계산서 관리'
Select-String -Path 'src\**\*.ts','src\**\*.tsx' -Pattern '설정 저장','실시간 API','자동 연동 완료','자동 발행 완료','성공 보장'
```

첫 번째 스캔은 필수 문구가 들어왔는지 확인한다. 두 번째 스캔은 과장 또는 범위 초과 문구가 들어오지 않았는지 확인한다.

## 6. Manual Browser Checks

| Viewport | 확인 |
|---|---|
| Desktop 1440px | Products 이후 Workflow section이 자연스럽게 보임 |
| Tablet 768px | layout이 2열 또는 single column으로 무너지지 않음 |
| Mobile 375px | 긴 한글 문구, step number, CTA가 겹치지 않음 |
| Keyboard | CTA focus visible |

## 7. Required Verification Commands

```powershell
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```
