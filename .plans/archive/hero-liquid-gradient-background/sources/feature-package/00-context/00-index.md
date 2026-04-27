# 00. Context Index — Hero 섹션 liquid gradient 배경

> Feature slug `hero-liquid-gradient-background`의 **00-context/** 디렉터리 인덱스.
> Bridge 작성일: 2026-04-27

---

## 파일 일람

| 파일 | 작성자 | 역할 | 상태 |
|---|---|---|---|
| [`00-index.md`](./00-index.md) | `plan-bridge` | 컨텍스트 인덱스 | current |
| [`01-product-context.md`](./01-product-context.md) | `plan-bridge` | 제품 컨텍스트 | frozen |
| [`01-prd-freeze.md`](./01-prd-freeze.md) | `plan-bridge` | PRD 동결 스냅샷 | frozen |
| [`02-scope-boundaries.md`](./02-scope-boundaries.md) | `plan-bridge` | In-scope / Out-of-scope | frozen |
| [`02-decision-log.md`](./02-decision-log.md) | `plan-bridge` | 결정 로그 | active |
| [`03-design-decisions.md`](./03-design-decisions.md) | `plan-bridge` | visual/UX 결정 | frozen |
| [`04-implementation-hints.md`](./04-implementation-hints.md) | `plan-bridge` | 구현 힌트 | reference |
| [`06-architecture-binding.md`](./06-architecture-binding.md) | `plan-bridge` | 구조 계약 바인딩 | current |
| [`08-routing-binding.md`](./08-routing-binding.md) | `plan-bridge` | 라우팅/다음 단계 바인딩 | current |

---

## 참조 우선순위

1. **PRD Freeze**: [`01-prd-freeze.md`](./01-prd-freeze.md)
2. **Scope Boundaries**: [`02-scope-boundaries.md`](./02-scope-boundaries.md)
3. **Architecture Binding**: [`06-architecture-binding.md`](./06-architecture-binding.md)
4. **Implementation Hints**: [`04-implementation-hints.md`](./04-implementation-hints.md)

## 주요 링크

- **IDEA**: [IDEA-20260427-001](../../../../ideas/20-approved/IDEA-20260427-001.md)
- **Screening**: [SCREENING-20260427-001](../../../../ideas/20-approved/SCREENING-20260427-001.md)
- **Draft**: [`../../../../drafts/hero-liquid-gradient-background/01-draft.md`](../../../../drafts/hero-liquid-gradient-background/01-draft.md)
- **PRD**: [`../../../../drafts/hero-liquid-gradient-background/02-prd.md`](../../../../drafts/hero-liquid-gradient-background/02-prd.md)
- **PRD Review**: [`../../../../drafts/hero-liquid-gradient-background/03-prd-review.md`](../../../../drafts/hero-liquid-gradient-background/03-prd-review.md)
- **Routing**: [`../../../../drafts/hero-liquid-gradient-background/07-routing-metadata.md`](../../../../drafts/hero-liquid-gradient-background/07-routing-metadata.md)
- **Reference Evidence**: [`../../../../drafts/hero-liquid-gradient-background/evidence/REFERENCE.md`](../../../../drafts/hero-liquid-gradient-background/evidence/REFERENCE.md)
- **Feature Package**: [`../02-package/00-overview.md`](../02-package/00-overview.md)
- **Dev Tasks**: [`../02-package/08-dev-tasks.md`](../02-package/08-dev-tasks.md)
- **Test Cases**: [`../02-package/09-test-cases.md`](../02-package/09-test-cases.md)

## Wireframe / Stitch 상태

본 Feature는 `Lite / dev / Scenario B`로 분류된 hero background 개선이다. 별도 wireframe 또는 Stitch HTML 산출물은 없으며, 구현 핸드오프는 PRD + reference evidence + 현재 코드 구조를 기준으로 진행한다.

## 다음 단계

```bash
/dev-run .plans/features/active/hero-liquid-gradient-background/
```

본 `/dev-feature` 단계에서 `02-package`와 `03-dev-notes/qa-notes.md`가 생성됐다. 다음 단계는 TASK 기준 구현이다.
