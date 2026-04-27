# 00. Context Index — F2 Mock 스키마 재설계

> Feature slug `f2-mock-schema-redesign` 의 **00-context/** 디렉터리 인덱스.
> Bridge 작성일: 2026-04-24

---

## 파일 일람

| 파일 | 작성자 | 역할 | 상태 |
|---|---|---|---|
| [`00-index.md`](./00-index.md) | `plan-bridge` | 컨텍스트 인덱스 | current |
| [`01-product-context.md`](./01-product-context.md) | `plan-bridge` | 제품 컨텍스트 | frozen |
| [`01-prd-freeze.md`](./01-prd-freeze.md) | `plan-bridge` | PRD 동결 스냅샷 | frozen |
| [`02-scope-boundaries.md`](./02-scope-boundaries.md) | `plan-bridge` | In-scope / Out-of-scope | frozen |
| [`02-decision-log.md`](./02-decision-log.md) | `plan-bridge` | 결정 로그 | active |
| [`03-design-decisions.md`](./03-design-decisions.md) | `plan-bridge` | 주요 설계 결정 | frozen |
| [`04-implementation-hints.md`](./04-implementation-hints.md) | `plan-bridge` | 구현 힌트 | reference |
| [`06-architecture-binding.md`](./06-architecture-binding.md) | `plan-bridge` | 구조 계약 바인딩 | current |
| [`08-epic-binding.md`](./08-epic-binding.md) | `plan-bridge` | Epic ↔ Feature cross-reference | current |

---

## 참조 우선순위

1. **PRD Freeze**: [`01-prd-freeze.md`](./01-prd-freeze.md)
2. **Scope Boundaries**: [`02-scope-boundaries.md`](./02-scope-boundaries.md)
3. **Architecture Binding**: [`06-architecture-binding.md`](./06-architecture-binding.md)
4. **Implementation Hints**: [`04-implementation-hints.md`](./04-implementation-hints.md)

## 주요 링크

- **Epic**: [EPIC-20260422-001](../../../../epics/20-active/EPIC-20260422-001/00-epic-brief.md)
- **IDEA**: [IDEA-20260424-001](../../../../ideas/20-approved/IDEA-20260424-001.md)
- **Screening**: [SCREENING-20260424-001](../../../../ideas/20-approved/SCREENING-20260424-001.md)
- **Draft**: [`../../../../drafts/f2-mock-schema-redesign/01-draft.md`](../../../../drafts/f2-mock-schema-redesign/01-draft.md)
- **PRD**: [`../../../../drafts/f2-mock-schema-redesign/02-prd.md`](../../../../drafts/f2-mock-schema-redesign/02-prd.md)
- **PRD Review**: [`../../../../drafts/f2-mock-schema-redesign/03-prd-review.md`](../../../../drafts/f2-mock-schema-redesign/03-prd-review.md)
- **Routing**: [`../../../../drafts/f2-mock-schema-redesign/07-routing-metadata.md`](../../../../drafts/f2-mock-schema-redesign/07-routing-metadata.md)
- **Feature Package**: [`../02-package/00-overview.md`](../02-package/00-overview.md)
- **Dev Tasks**: [`../02-package/08-dev-tasks.md`](../02-package/08-dev-tasks.md)
- **Test Cases**: [`../02-package/09-test-cases.md`](../02-package/09-test-cases.md)

## 다음 단계

```bash
/dev-run .plans/features/active/f2-mock-schema-redesign/
```

본 Bridge 이후 `/dev-feature` Step 6 대응으로 `02-package`와 공식 TASK 문서가 생성됐다. 다음 단계는 TASK 기준 구현이다.
