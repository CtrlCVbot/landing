# Feature Context Index: hero-01-reference-hero-refresh

> **Feature**: hero-01 레퍼런스 기반 Hero 섹션 재개선
> **Scope**: Standard
> **Status**: Phase C bridge package complete, ready for `/dev-run` planning review
> **Created**: 2026-04-28
> **Plan Bridge**: completed

---

## 1. Context Files

| # | 파일 | 상태 | 설명 |
|---|---|---|---|
| 00 | `00-index.md` | 완료 | 이 파일 |
| 01 | `01-prd-freeze.md` | 완료 | PRD freeze, 요구사항 alias, 변경 통제 기준 |
| 02 | `02-decision-log.md` | 완료 | 수용된 결정, 보류 결정, out-of-scope |
| 06 | `06-architecture-binding.md` | 완료 | 구조 SSOT 기반 허용 경로와 검증 경계 |
| 07 | `07-routing-metadata.md` | 완료 | Standard bridge 이후 `/dev-run` 라우팅 metadata |

## 1-1. Package Files

| # | 파일 | 상태 | 설명 |
|---|---|---|---|
| 00 | `../02-package/00-overview.md` | 완료 | Feature overview와 handoff 요약 |
| 01 | `../02-package/01-requirements.md` | 완료 | Requirements SSOT와 trace table |
| 02 | `../02-package/02-ui-spec.md` | 완료 | Hero first viewport UI spec |
| 03 | `../02-package/03-flow.md` | 완료 | Theme, motion, CTA, reduced-motion 흐름 |
| 06 | `../02-package/06-domain-logic.md` | 완료 | Hero visual field 모델과 lifecycle invariant |
| 08 | `../02-package/08-dev-tasks.md` | 완료 | M1~M5 구현 task 목록 |
| 09 | `../02-package/09-test-cases.md` | 완료 | 자동 테스트, browser visual QA, release evidence |
| 10 | `../02-package/10-release-checklist.md` | 완료 | 구현 완료 전 evidence checklist |

---

## 2. Source Documents

| 문서 | 경로 |
|---|---|
| Idea | `.plans/ideas/20-approved/IDEA-20260427-004.md` |
| Screening | `.plans/ideas/20-approved/SCREENING-20260427-004.md` |
| Draft | `.plans/drafts/hero-01-reference-hero-refresh/01-draft.md` |
| PRD | `.plans/drafts/hero-01-reference-hero-refresh/02-prd.md` |
| PRD Review | `.plans/drafts/hero-01-reference-hero-refresh/03-prd-review.md` |
| Draft Routing Metadata | `.plans/drafts/hero-01-reference-hero-refresh/07-routing-metadata.md` |
| Wireframe Screens | `.plans/wireframes/hero-01-reference-hero-refresh/screens.md` |
| Wireframe Navigation | `.plans/wireframes/hero-01-reference-hero-refresh/navigation.md` |
| Wireframe Components | `.plans/wireframes/hero-01-reference-hero-refresh/components.md` |
| Wireframe Review | `.plans/wireframes/hero-01-reference-hero-refresh/04-wireframe-review.md` |
| Architecture SSOT | `.plans/project/00-dev-architecture.md` |
| Reference HTML | `.references/design/hero-01/hero.html` |
| Reference CSS | `.references/design/hero-01/global.css` |

---

## 3. Handoff Summary

이 feature는 기존 Hero 배경의 색만 바꾸는 작업이 아니다. `.references/design/hero-01`의 full-bleed liquid field 인상을 landing Hero 첫 viewport에 맞게 다시 설계하고, 현재 light/dark theme과 CTA 전환 흐름을 유지하는 작업이다.

핵심 구현 방향:

1. `HeroFieldLayer`는 full-bleed background로 동작한다.
2. 기본 후보는 Canvas 2D이며, CSS fallback을 반드시 유지한다.
3. `WebGL/Three.js`는 명시 승인, bundle budget, fallback gate 없이는 도입하지 않는다.
4. reference의 controls, color adjuster, export UI, custom cursor, footer attribution은 production DOM에 넣지 않는다.
5. 현재 product headline인 `운송 운영을 한눈에`, CTA, `DashboardPreview`는 유지하되 first viewport hierarchy를 재조정한다.
6. dev QA는 screenshot 기반 light/dark, desktop/mobile, reduced-motion evidence를 포함해야 한다.

---

## 4. Omitted Package Files

| 파일 | 상태 | 사유 |
|---|---|---|
| `04-api-spec.md` | 생략 | API 변경 없음 |
| `05-db-migration-spec.md` | 생략 | DB 변경 없음 |
| `07-error-handling.md` | 생략 | 별도 runtime error surface 없음. Canvas lifecycle와 fallback 위험은 `06-domain-logic.md`, `10-release-checklist.md`에 포함 |

---

## 5. Next Step

Phase C bridge 산출물은 완료됐다. 다음 단계는 문서 review 후 구현 실행이다.

```bash
/dev-run .plans/features/active/hero-01-reference-hero-refresh
```
