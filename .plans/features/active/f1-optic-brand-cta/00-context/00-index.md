# 00. Context Index - F1 브랜드, 로고, CTA 최소 반영

> Feature slug `f1-optic-brand-cta`의 `/plan-bridge` 산출물 인덱스.
> Lite lane이므로 PRD, Wireframe, Stitch는 생략하고 Draft + Scope Review를 개발 핸드오프 기준으로 고정한다.

---

## 파일 일람

| 파일 | 역할 | 상태 |
|---|---|:---:|
| [00-index.md](./00-index.md) | bridge context 인덱스 | current |
| [01-product-context.md](./01-product-context.md) | 제품/브랜드 맥락과 현재 코드 상태 | frozen |
| [02-scope-boundaries.md](./02-scope-boundaries.md) | In/Out/Deferred 범위와 확인 gate | frozen |
| [04-implementation-hints.md](./04-implementation-hints.md) | 구현 TASK 힌트와 검증 기준 | reference |
| [06-architecture-binding.md](./06-architecture-binding.md) | 구조 SSOT 기반 경로 계약 | current |
| [08-epic-binding.md](./08-epic-binding.md) | Epic, IDEA, Draft 연결과 다음 경로 | current |

---

## 참조 우선순위

1. **Draft SSOT**: [01-draft.md](../../../../drafts/f1-optic-brand-cta/01-draft.md)
2. **Scope Review**: [03-scope-review.md](../../../../drafts/f1-optic-brand-cta/03-scope-review.md)
3. **Architecture Profile**: [00-dev-architecture.md](../../../../project/00-dev-architecture.md)
4. **Routing Metadata**: [07-routing-metadata.md](../../../../drafts/f1-optic-brand-cta/07-routing-metadata.md)

---

## Pipeline 판정

| 항목 | 값 |
|---|---|
| Lane | `Lite` |
| Scenario | `A` |
| Feature type | `dev` |
| Hybrid | `false` |
| Bridge status | `done` |
| Recommended next | `/dev-feature .plans/features/active/f1-optic-brand-cta/` |

## 유지해야 할 확인 항목

| 항목 | Severity | Action |
|---|---|---|
| 서비스 URL 공개 가능성 | medium | `needs-verification` |
| 로고 자산 최종 승인 | medium | `queued` |
| 모바일 CTA 배치 | low | `queued` |
