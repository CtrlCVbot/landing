# 08. Dev Tasks - F3 업무 매뉴얼형 스크롤 섹션 MVP

> SSOT for `/dev-run` execution.
> TASK ID: `T-F3-{NN}`.
> **Dev Run 상태**: completed
> **완료일**: 2026-04-29

---

## 1. Task Status

| TASK | 제목 | 상태 | 주요 파일 | 검증 |
|---|---|:---:|---|---|
| T-F3-01 | workflow data와 data test 작성 | done | `src/lib/landing-workflow.ts`, `src/__tests__/lib/landing-workflow.test.ts` | `pnpm test -- landing-workflow workflow-manual page` |
| T-F3-02 | `WorkflowManual` section 구현 | done | `src/components/sections/workflow-manual.tsx`, `src/components/sections/__tests__/workflow-manual.test.tsx` | targeted test + browser spot check |
| T-F3-03 | page composition에 section 배치 | done | `src/app/page.tsx`, `src/__tests__/app/page.test.tsx` | page composition test + browser order check |
| T-F3-04 | 기존 section과 중복/spacing 최소 조정 | done | 신규 section `scroll-margin` 보강, 기존 section 수정 없음 | review + browser spot check |
| T-F3-05 | 검증, 문구 스캔, responsive evidence | done | test output, browser evidence | full checks |

---

## 2. T-F3-01 - workflow data와 data test 작성

**REQ**: REQ-F3-002, REQ-F3-003, REQ-F3-005, REQ-F3-006, REQ-F3-007, REQ-F3-009, REQ-F3-010, REQ-F3-013

### Edit Scope

```txt
src/lib/landing-workflow.ts
src/__tests__/lib/landing-workflow.test.ts
```

### Acceptance

- [x] `WORKFLOW_STEPS`가 6개 step을 가진다.
- [x] step id는 `ai-order`, `locations`, `dispatch-status`, `hwamulman`, `settlement`, `invoice`다.
- [x] `hwamulman`은 order 4다.
- [x] `settlement`와 `invoice`는 별도 step이다.
- [x] 모든 step에 customization 값이 있다.
- [x] 실제 API/설정 저장을 약속하는 문구가 없다.

---

## 3. T-F3-02 - `WorkflowManual` section 구현

**REQ**: REQ-F3-001, REQ-F3-002, REQ-F3-003, REQ-F3-004, REQ-F3-005, REQ-F3-006, REQ-F3-007, REQ-F3-011, REQ-F3-012

### Edit Scope

```txt
src/components/sections/workflow-manual.tsx
src/components/sections/__tests__/workflow-manual.test.tsx
```

### Acceptance

- [x] section heading이 렌더링된다.
- [x] 화주/주선사별 커스텀 가능성 메시지가 보인다.
- [x] 6단계 title이 모두 노출된다.
- [x] 각 step의 customization 문구가 노출된다.
- [x] `ol/li` 기반의 접근 가능한 반복 구조를 사용한다.
- [x] hover/focus가 layout height를 바꾸지 않는다.
- [x] sticky header가 섹션 상단을 덮지 않도록 신규 section에 `scroll-margin`을 적용했다.

---

## 4. T-F3-03 - page composition에 section 배치

**REQ**: REQ-F3-001, REQ-F3-008

### Edit Scope

```txt
src/app/page.tsx
src/__tests__/app/page.test.tsx
```

### Acceptance

- [x] `WorkflowManual`을 import한다.
- [x] `Products` 이후, `Integrations` 이전에 렌더링된다.
- [x] 제품 라인업 카드 구조를 복제하지 않는다.

---

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

- [x] 기존 section 문구가 F3 신규 section과 불필요하게 중복되지 않는지 검토했다.
- [x] Products section은 제품 라인업 역할을 유지한다.
- [x] Integrations section은 외부 연동 보조 설명 역할을 유지한다.
- [x] global CSS 수정은 필요하지 않았다.
- [x] 기존 section 파일은 수정하지 않았다.

---

## 6. T-F3-05 - 검증, 문구 스캔, responsive evidence

**REQ**: REQ-F3-001 ~ REQ-F3-014

### Verification

```powershell
pnpm test -- landing-workflow workflow-manual page
pnpm typecheck
pnpm test
pnpm lint
pnpm build
```

### Copy Scan

```powershell
Select-String -Path 'src\**\*.ts','src\**\*.tsx' -Pattern 'AI 오더 등록','상하차지 관리','배차/운송 상태','화물맨 연동','정산 자동화','세금계산서 관리'
Select-String -Path 'src\**\*.ts','src\**\*.tsx' -Pattern '설정 저장','실시간 API','자동 연동 완료','자동 발행 완료','성공 보장'
```

### Manual / Browser Checks

- [x] desktop viewport에서 Products 이후 Workflow section이 자연스럽게 이어진다.
- [x] tablet 768px에서 workflow section의 텍스트가 viewport 밖으로 나가지 않는다.
- [x] 375px mobile에서 step card 텍스트가 겹치지 않는다.
- [x] keyboard focus가 CTA에서 보인다.
- [x] DashboardPreview 관련 파일은 변경하지 않았다.

---

## 7. Execution Order

1. T-F3-01 Red-Green
2. T-F3-02 Red-Green
3. T-F3-03 Red-Green
4. T-F3-04 최소 조정
5. T-F3-05 verification

---

## 8. Dev Run Result

| 항목 | 결과 |
|---|---|
| Red | 신규 data/component/page 테스트가 구현 전 실패하는 것을 확인 |
| Green | `WorkflowManual`, `landing-workflow` data, page composition 구현 |
| Refactor | 한글 카피 인코딩 복구, 신규 section `scroll-margin` 보강 |
| Next | `/dev-verify .plans/features/active/f3-workflow-manual-section/` |
