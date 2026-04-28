# 08. Routing Binding — Hero 섹션 liquid gradient 배경

> Feature 라우팅과 다음 실행 경로를 고정한다.

---

## 1. Routing Metadata

| 항목 | 값 |
|---|---|
| Slug | `hero-liquid-gradient-background` |
| Category | Lite |
| Scenario | B |
| Feature type | dev |
| Hybrid | true |
| Copy needed | false |
| Reference needed | true |
| PRD required | true |
| Epic binding | 없음 |
| Current stage | Feature Package complete |
| Next | `/dev-run .plans/features/active/hero-liquid-gradient-background/` |

## 2. Source Artifacts

| 산출물 | 경로 |
|---|---|
| IDEA | [`../../../../ideas/20-approved/IDEA-20260427-001.md`](../../../../ideas/20-approved/IDEA-20260427-001.md) |
| Screening | [`../../../../ideas/20-approved/SCREENING-20260427-001.md`](../../../../ideas/20-approved/SCREENING-20260427-001.md) |
| Draft | [`../../../../drafts/hero-liquid-gradient-background/01-draft.md`](../../../../drafts/hero-liquid-gradient-background/01-draft.md) |
| PRD | [`../../../../drafts/hero-liquid-gradient-background/02-prd.md`](../../../../drafts/hero-liquid-gradient-background/02-prd.md) |
| PRD Review | [`../../../../drafts/hero-liquid-gradient-background/03-prd-review.md`](../../../../drafts/hero-liquid-gradient-background/03-prd-review.md) |
| Routing metadata | [`../../../../drafts/hero-liquid-gradient-background/07-routing-metadata.md`](../../../../drafts/hero-liquid-gradient-background/07-routing-metadata.md) |
| Reference evidence | [`../../../../drafts/hero-liquid-gradient-background/evidence/REFERENCE.md`](../../../../drafts/hero-liquid-gradient-background/evidence/REFERENCE.md) |

## 3. Next Command

```bash
/dev-run .plans/features/active/hero-liquid-gradient-background/
```

`/dev-run`에서는 본 `00-context`와 `02-package`를 기준으로 구현한다. 특히 `REQ-012` theme token alignment, `REQ-013` stacking context, `REQ-014` theme toggle stability는 TASK acceptance criteria에서 제거하지 않는다.

## 4. Fallback

사용자가 구현 단계로 바로 넘어가길 원하면 `/dev-run .plans/features/active/hero-liquid-gradient-background/`를 실행한다. 이 Feature는 visual polish처럼 보이지만 theme token, reduced motion, layering, screenshot QA가 포함되어 있어 TASK 순서를 지켜야 한다.
