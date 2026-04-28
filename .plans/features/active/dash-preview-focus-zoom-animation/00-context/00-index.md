# Feature Context Index: dash-preview-focus-zoom-animation

> **Feature**: Dash Preview Focus Zoom Animation
> **Scope**: Lite
> **Status**: Phase C package complete, ready for `/dev-run` planning review
> **Created**: 2026-04-27
> **Plan Bridge**: skipped (`Lite` feature, `/plan-bridge` is Standard-only)

---

## 1. Context Files

| # | 파일 | 상태 | 설명 |
|---|---|---|---|
| 00 | `00-index.md` | 완료 | 이 파일 |
| 01 | `01-prd-freeze.md` | 완료 | PRD freeze and trace source |
| 02 | `02-decision-log.md` | 완료 | Phase A decisions and open items |
| 06 | `06-architecture-binding.md` | 완료 | feature-level allowed paths and test paths |
| 07 | `07-routing-metadata.md` | 완료 | Lite direct-to-dev-feature routing metadata |

## 1-1. Package Files

| # | 파일 | 상태 | 설명 |
|---|---|---|---|
| 00 | `../02-package/00-overview.md` | 완료 | Feature Overview + structure contract |
| 01 | `../02-package/01-requirements.md` | 완료 | Requirements SSOT + REQ/TASK/TC trace |
| 02 | `../02-package/02-ui-spec.md` | 완료 | Focus target UI and responsive policy |
| 03 | `../02-package/03-flow.md` | 완료 | Autoplay and click-to-card flow |
| 06 | `../02-package/06-domain-logic.md` | 완료 | Focus metadata, mode, timing invariants |
| 08 | `../02-package/08-dev-tasks.md` | 완료 | M1~M5 implementation tasks |
| 09 | `../02-package/09-test-cases.md` | 완료 | Unit, integration, a11y, visual, release tests |
| 10 | `../02-package/10-release-checklist.md` | 완료 | Release-ready evidence checklist |

---

## 2. Source Documents

| 문서 | 경로 |
|---|---|
| Draft | `.plans/drafts/dash-preview-focus-zoom-animation/01-draft.md` |
| PRD | `.plans/drafts/dash-preview-focus-zoom-animation/02-prd.md` |
| PRD Review | `.plans/drafts/dash-preview-focus-zoom-animation/03-prd-review.md` |
| Draft Routing Metadata | `.plans/drafts/dash-preview-focus-zoom-animation/07-routing-metadata.md` |
| Architecture SSOT | `.plans/project/00-dev-architecture.md` |
| Previous dash-preview archive | `.plans/archive/dash-preview/ARCHIVE-DASH.md` |

---

## 3. Handoff Summary

`US-FZ-003`은 `AI_APPLY`에서 추출정보 클릭과 입력 카드 이동을 4번 반복한다.

1. 상차지 추출정보 클릭 → 상차지 입력 카드
2. 하차지 추출정보 클릭 → 하차지 입력 카드
3. 화물 정보 추출정보 클릭 → 화물 정보 입력 카드
4. 운임 추출정보 클릭 → 운임 카드

`US-FZ-004`에 따라 mobile path는 변경하지 않는다. 현재 구현된 `MobileCardView`는 수정 대상이 아니라 regression check 대상이다.

---

## 4. Omitted Package Files

| 파일 | 상태 | 사유 |
|---|---|---|
| `04-api-spec.md` | 생략 | API 변경 없음 |
| `05-db-migration-spec.md` | 생략 | DB 변경 없음 |
| `07-error-handling.md` | 생략 | 별도 runtime error surface 없음. 관련 위험은 `06-domain-logic.md`, `10-release-checklist.md`에 포함 |

---

## 5. Next Step

Phase C 산출물은 완료됐다. 다음 단계는 문서 review 후 구현 실행이다.

```bash
/dev-run .plans/features/active/dash-preview-focus-zoom-animation
```
