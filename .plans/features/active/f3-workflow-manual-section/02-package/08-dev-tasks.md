# 08. Dev Tasks - F3 업무 매뉴얼형 스크롤 섹션 MVP

> SSOT for `/dev-run` execution.
> TASK ID: `T-F3-{NN}`.

---

## 1. Task Status

| TASK | 제목 | 상태 | 주요 파일 | 검증 |
|---|---|:---:|---|---|
| T-F3-01 | workflow data와 data test 작성 | pending | `src/lib/landing-workflow.ts`, `src/__tests__/lib/landing-workflow.test.ts` | targeted test |
| T-F3-02 | `WorkflowManual` section 구현 | pending | `src/components/sections/workflow-manual.tsx`, section test | targeted test |
| T-F3-03 | page composition에 section 배치 | pending | `src/app/page.tsx`, page smoke 또는 section order test | targeted test |
| T-F3-04 | 기존 section과 중복/spacing 최소 조정 | pending | `features.tsx`, `integrations.tsx`, `products.tsx` 중 필요 파일만 | review + targeted test |
| T-F3-05 | 검증, 문구 스캔, responsive evidence | pending | test output, browser evidence | full checks |

## 2. T-F3-01 - workflow data와 data test 작성

**REQ**: REQ-F3-002, REQ-F3-003, REQ-F3-005, REQ-F3-006, REQ-F3-007, REQ-F3-009, REQ-F3-010, REQ-F3-013

### Edit Scope

```txt
src/lib/landing-workflow.ts
src/__tests__/lib/landing-workflow.test.ts
```

### Acceptance

- [ ] `WORKFLOW_STEPS`가 6개 step을 가진다.
- [ ] step id는 `ai-order`, `locations`, `dispatch-status`, `hwamulman`, `settlement`, `invoice`다.
- [ ] `hwamulman`은 order 4다.
- [ ] `settlement`와 `invoice`는 별도 step이다.
- [ ] 모든 step에 customization 값이 있다.
- [ ] 실제 API/설정 저장을 약속하는 문구가 없다.

## 3. T-F3-02 - `WorkflowManual` section 구현

**REQ**: REQ-F3-001, REQ-F3-002, REQ-F3-003, REQ-F3-004, REQ-F3-005, REQ-F3-006, REQ-F3-007, REQ-F3-011, REQ-F3-012

### Edit Scope

```txt
src/components/sections/workflow-manual.tsx
src/components/sections/__tests__/workflow-manual.test.tsx
```

### Acceptance

- [ ] section heading이 렌더링된다.
- [ ] 화주/주선사별 커스텀 가능성 메시지가 보인다.
- [ ] 6단계 title이 모두 노출된다.
- [ ] 각 step의 customization 문구가 노출된다.
- [ ] `ol/li` 또는 접근 가능한 반복 구조를 사용한다.
- [ ] hover/focus가 layout height를 바꾸지 않는다.

## 4. T-F3-03 - page composition에 section 배치

**REQ**: REQ-F3-001, REQ-F3-008

### Edit Scope

```txt
src/app/page.tsx
src/__tests__/app/page.test.tsx
```

### Acceptance

- [ ] `WorkflowManual`이 import된다.
- [ ] `Products` 이후, `Integrations` 이전에 렌더링된다.
- [ ] 제품 라인업 카드 구조를 복제하지 않는다.

## 5. T-F3-04 - 기존 section과 중복/spacing 최소 조정

**REQ**: REQ-F3-008, REQ-F3-013

### Conditional Edit Scope

```txt
src/components/sections/features.tsx
src/components/sections/integrations.tsx
src/components/sections/products.tsx
src/app/globals.css
```

### Acceptance

- [ ] 기존 section 문구가 F3 신규 section과 불필요하게 중복되면 최소 조정한다.
- [ ] Products section은 제품 라인업 역할을 유지한다.
- [ ] Integrations section은 외부 연동 보조 설명 역할을 유지한다.
- [ ] global CSS는 component class로 해결할 수 없을 때만 수정한다.

## 6. T-F3-05 - 검증, 문구 스캔, responsive evidence

**REQ**: REQ-F3-001 ~ REQ-F3-014

### Verification

```powershell
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

### Copy Scan

```powershell
Select-String -Path 'src\**\*.ts','src\**\*.tsx' -Pattern 'AI 오더 등록','상하차지 관리','배차/운송 상태','화물맨 연동','정산 자동화','세금계산서 관리'
Select-String -Path 'src\**\*.ts','src\**\*.tsx' -Pattern '설정 저장','실시간 API','자동 연동 완료','자동 발행 완료','성공 보장'
```

### Manual Checks

- [ ] desktop viewport에서 Products 이후 Workflow section이 자연스럽게 이어진다.
- [ ] 375px mobile에서 step card 텍스트가 겹치지 않는다.
- [ ] keyboard focus가 CTA에서 보인다.
- [ ] DashboardPreview 동작이 변경되지 않았다.

## 7. Execution Order

1. T-F3-01 Red-Green
2. T-F3-02 Red-Green
3. T-F3-03 Red-Green
4. T-F3-04 필요 시 최소 조정
5. T-F3-05 verification
