# 00. Feature Package Overview - F3 업무 매뉴얼형 스크롤 섹션 MVP

> **Feature slug**: `f3-workflow-manual-section`
> **Lane**: Standard
> **Scenario**: A
> **Feature type**: dev
> **Hybrid**: false
> **작성일**: 2026-04-29
> **작성자**: Codex (`/dev-feature` 대응)
> **승인 근거**: approved PRD + wireframe review Approve + Bridge context
> **다음 단계**: `/dev-run .plans/features/active/f3-workflow-manual-section/`

---

## 1. 한 줄 요약

OPTIC 랜딩에 `AI 오더 등록 → 상하차지 관리 → 배차/운송 상태 → 화물맨 연동 → 정산 자동화 → 세금계산서 관리` 순서의 신규 업무 매뉴얼형 섹션을 추가해, 화주와 주선사별로 다른 운송 운영을 OPTIC이 맞춤 조율한다는 핵심 가치를 보여준다.

## 2. Structure Mode

| 항목 | 값 |
|---|---|
| Workspace Topology | `monorepo-leaf-single-app` |
| Structure Mode | `hybrid` |
| Layer Style | `layered` |
| Source Binding | [06-architecture-binding.md](../00-context/06-architecture-binding.md) |

F3는 새 route, API, DB, dependency를 만들지 않는다. 기존 landing section 구조에 신규 presentation component와 workflow data만 추가한다.

## 3. Allowed Target Paths

### 3-1. 수정 가능

```txt
src/components/sections/workflow-manual.tsx
src/lib/landing-workflow.ts
src/app/page.tsx
```

### 3-2. 조건부 수정

```txt
src/lib/constants.ts
src/components/sections/products.tsx
src/components/sections/features.tsx
src/components/sections/integrations.tsx
src/app/globals.css
```

조건부 파일은 신규 섹션 배치, 중복 문구 정리, 375px overflow 방지에 꼭 필요할 때만 최소 수정한다.

### 3-3. 테스트 경로

```txt
src/__tests__/lib/landing-workflow.test.ts
src/components/sections/__tests__/workflow-manual.test.tsx
src/__tests__/app/page.test.tsx
```

`src/__tests__/app/page.test.tsx`는 기존 page smoke test가 없을 때 선택적으로 만든다.

### 3-4. 금지 경로

```txt
src/components/dashboard-preview/**
src/lib/mock-data.ts
src/lib/preview-steps.ts
package.json
lockfile
backend route, persistence, API
```

## 4. Layer Mapping

| 레이어 | 경로 | 변경 성격 |
|---|---|---|
| Utility / Workflow Data | `src/lib/landing-workflow.ts` | 6단계 workflow data, stable id, copy seed |
| Presentation / Section | `src/components/sections/workflow-manual.tsx` | 신규 업무 매뉴얼형 섹션 UI |
| Route / Composition | `src/app/page.tsx` | `Products` 직후 신규 섹션 배치 |
| Tests | allowed test paths | data order, section render, page composition regression |

## 5. Stack Contract

| 영역 | 계약 |
|---|---|
| Language | TypeScript |
| Framework | Next.js 15 App Router + React 18 |
| Styling | Tailwind 4, 기존 token/class 사용 |
| Animation | F3에서는 과한 scroll animation 금지, 기본 transition만 허용 |
| Icons | 기존 `lucide-react` 안에서 선택 |
| Test | Vitest + Testing Library |
| Dependency | 신규 dependency 추가 없음 |

## 6. Shared vs Local Rule

- workflow data는 `src/lib/landing-workflow.ts`에 둔다.
- section display logic은 `workflow-manual.tsx` 안에 둔다.
- 기존 여러 section에서 재사용할 UI primitive가 생기기 전까지 `src/components/ui/` 승격은 하지 않는다.
- F4가 이어받을 수 있도록 workflow step의 `id`, `order`는 안정적으로 유지한다.

## 7. 요구사항 추적

| REQ | TASK | TC |
|---|---|---|
| REQ-F3-001 | T-F3-01, T-F3-02, T-F3-03 | TC-F3-01, TC-F3-04 |
| REQ-F3-002 | T-F3-01, T-F3-02 | TC-F3-01, TC-F3-02 |
| REQ-F3-003 | T-F3-01, T-F3-02 | TC-F3-02, TC-F3-03 |
| REQ-F3-004 | T-F3-01, T-F3-02 | TC-F3-02, TC-F3-07 |
| REQ-F3-005 | T-F3-01, T-F3-02 | TC-F3-02 |
| REQ-F3-006 | T-F3-01, T-F3-02 | TC-F3-03 |
| REQ-F3-007 | T-F3-01, T-F3-02 | TC-F3-03 |
| REQ-F3-008 | T-F3-03, T-F3-04 | TC-F3-04, TC-F3-07 |
| REQ-F3-009 | T-F3-01 | TC-F3-01 |
| REQ-F3-010 | T-F3-01, T-F3-05 | TC-F3-01 |
| REQ-F3-011 | T-F3-02, T-F3-05 | TC-F3-05 |
| REQ-F3-012 | T-F3-02, T-F3-05 | TC-F3-06 |
| REQ-F3-013 | T-F3-01, T-F3-05 | TC-F3-07 |
| REQ-F3-014 | T-F3-05 | TC-F3-08 |

## 8. 경로 계약

| 항목 | 값 |
|---|---|
| Feature root | `.plans/features/active/f3-workflow-manual-section/` |
| Requirements SSOT | `02-package/01-requirements.md` |
| Dev tasks SSOT | `02-package/08-dev-tasks.md` |
| Test cases SSOT | `02-package/09-test-cases.md` |
| Architecture binding | `00-context/06-architecture-binding.md` |
| Wireframe source | `.plans/wireframes/f3-workflow-manual-section/screens.md` |

## 9. 일관성 점검

| 항목 | Bridge | Package | 판정 |
|---|---|---|---|
| Lane | Standard | Standard | 일치 |
| Feature type | dev | dev | 일치 |
| Structure | sections + lib + page composition | same | 일치 |
| 배치 | Products 직후 기본 추천 | Products 직후 구현 기준 | 일치 |
| 화물맨 | 배차 단계 | 4단계 `hwamulman` | 일치 |
| 정산/세금계산서 | 분리 | 5, 6단계 분리 | 일치 |
| API/DB | 제외 | out of scope | 일치 |
| DashboardPreview | 보존 | forbidden path | 일치 |

## 10. 다음 단계

```bash
/dev-run .plans/features/active/f3-workflow-manual-section/
```

구현은 `landing-workflow` data test를 먼저 추가한 뒤, `workflow-manual` section과 page composition을 순서대로 연결한다.
