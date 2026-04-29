# 00. Context Index - F1 브랜드, 로고, CTA 최소 반영

> Feature slug `f1-optic-brand-cta`의 context/package 인덱스.
> Lite lane이므로 PRD, Wireframe, Stitch는 생략하고 Draft + Scope Review를 개발 핸드오프 기준으로 고정했다.

---

## 파일 일람

| 파일 | 역할 | 상태 |
|---|---|:---:|
| [00-index.md](./00-index.md) | bridge context 인덱스 | current |
| [01-product-context.md](./01-product-context.md) | 제품/브랜드 맥락과 현재 코드 상태 | frozen |
| [01-prd-freeze.md](./01-prd-freeze.md) | Draft + Scope Review 동결 스냅샷 | frozen |
| [02-scope-boundaries.md](./02-scope-boundaries.md) | In/Out/Deferred 범위와 확인 gate | frozen |
| [02-decision-log.md](./02-decision-log.md) | 결정 로그 | active |
| [04-implementation-hints.md](./04-implementation-hints.md) | 구현 TASK 힌트와 검증 기준 | reference |
| [06-architecture-binding.md](./06-architecture-binding.md) | 구조 SSOT 기반 경로 계약 | current |
| [08-epic-binding.md](./08-epic-binding.md) | Epic, IDEA, Draft 연결과 다음 경로 | current |

---

## 참조 우선순위

1. **Draft SSOT**: [01-draft.md](../../../../drafts/f1-optic-brand-cta/01-draft.md)
2. **Scope Review**: [03-scope-review.md](../../../../drafts/f1-optic-brand-cta/03-scope-review.md)
3. **Architecture Profile**: [00-dev-architecture.md](../../../../project/00-dev-architecture.md)
4. **Routing Metadata**: [07-routing-metadata.md](../../../../drafts/f1-optic-brand-cta/07-routing-metadata.md)
5. **Requirements SSOT**: [01-requirements.md](../02-package/01-requirements.md)

---

## Pipeline 판정

| 항목 | 값 |
|---|---|
| Lane | `Lite` |
| Scenario | `A` |
| Feature type | `dev` |
| Hybrid | `false` |
| Bridge status | `done` |
| Dev feature status | `done` |
| Dev run status | `done` |
| Dev verify status | `done` |
| Archive status | `done` |
| Recommended next | `F2 IDEA registration` |

## Package 문서

| 파일 | 역할 |
|---|---|
| [00-overview.md](../02-package/00-overview.md) | 구조 계약과 경로 계약 |
| [01-requirements.md](../02-package/01-requirements.md) | 요구사항 SSOT |
| [02-ui-spec.md](../02-package/02-ui-spec.md) | Header/Footer/Logo UI 기준 |
| [06-domain-logic.md](../02-package/06-domain-logic.md) | presentation logic 기준 |
| [08-dev-tasks.md](../02-package/08-dev-tasks.md) | `/dev-run` TASK SSOT |
| [09-test-cases.md](../02-package/09-test-cases.md) | 테스트 케이스 |
| [10-release-checklist.md](../02-package/10-release-checklist.md) | release gate |

## Dev Notes

| 파일 | 역할 |
|---|---|
| [dev-output-summary.md](../03-dev-notes/dev-output-summary.md) | `/dev-run` 구현 결과와 검증 요약 |
| [dev-verification-report.md](../03-dev-notes/dev-verification-report.md) | `/dev-verify` fresh verification report |

## 유지해야 할 확인 항목

| 항목 | Severity | Action |
|---|---|---|
| 서비스 URL 공개 가능성 | medium | `verified` |
| 로고 자산 최종 승인 | medium | `queued` |
| 모바일 CTA 배치 | low | `verified` |
