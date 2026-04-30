# Feature Context Index: f3-workflow-manual-section

> **Feature**: F3 업무 매뉴얼형 스크롤 섹션 MVP
> **Epic**: [EPIC-20260428-001](../../../../epics/10-planning/EPIC-20260428-001/00-epic-brief.md) Phase C, F3
> **Scope**: Standard, dev, 신규 landing section
> **Status**: archived
> **Created**: 2026-04-29
> **Plan Bridge**: completed
> **Dev Feature**: completed
> **Dev Run**: completed
> **Dev Verify**: completed
> **Archive**: completed

---

## 1. Context Files

| # | 파일 | 상태 | 설명 |
|---|---|---|---|
| 00 | [00-index.md](./00-index.md) | current | Bridge context 인덱스 |
| 01 | [01-prd-freeze.md](./01-prd-freeze.md) | frozen | 승인 PRD, PRD review, wireframe 결과 동결 |
| 02 | [02-decision-log.md](./02-decision-log.md) | active | 배치, 단계 구조, 범위 분리 결정 |
| 04 | [04-implementation-hints.md](./04-implementation-hints.md) | reference | dev-feature/dev-run에서 유지할 구현 힌트 |
| 06 | [06-architecture-binding.md](./06-architecture-binding.md) | current | 구조 SSOT 기반 허용 경로와 검증 경계 |
| 07 | [07-routing-metadata.md](./07-routing-metadata.md) | current | P1-P7 routing metadata와 다음 단계 |
| 08 | [08-epic-binding.md](./08-epic-binding.md) | current | Epic, IDEA, PRD, Wireframe 연결과 의존성 |

---

## 1-1. Feature Package Files

| # | 파일 | 상태 | 설명 |
|---|---|---|---|
| 00 | [00-overview.md](../02-package/00-overview.md) | current | 구조 계약, 허용 경로, 추적성 요약 |
| 01 | [01-requirements.md](../02-package/01-requirements.md) | SSOT | 구현 요구사항 |
| 02 | [02-ui-spec.md](../02-package/02-ui-spec.md) | current | 섹션 UI, layout, accessibility 기준 |
| 03 | [03-flow.md](../02-package/03-flow.md) | current | scroll flow, data flow, F4 handoff |
| 06 | [06-domain-logic.md](../02-package/06-domain-logic.md) | current | workflow data model과 invariant |
| 07 | [07-error-handling.md](../02-package/07-error-handling.md) | current | static section failure mode |
| 08 | [08-dev-tasks.md](../02-package/08-dev-tasks.md) | SSOT | `/dev-run` TASK |
| 09 | [09-test-cases.md](../02-package/09-test-cases.md) | SSOT | 테스트 케이스 |
| 10 | [10-release-checklist.md](../02-package/10-release-checklist.md) | current | release readiness checklist |
| 11 | [dev-output-summary.md](../03-dev-notes/dev-output-summary.md) | current | `/dev-run` 구현 결과와 검증 evidence |

---

## 2. Source Documents

| 문서 | 경로 | 상태 |
|---|---|---|
| IDEA | [IDEA-20260429-002.md](../../../../ideas/20-approved/IDEA-20260429-002.md) | approved |
| Screening | [SCREENING-20260429-002.md](../../../../ideas/20-approved/SCREENING-20260429-002.md) | approved, Go, Standard |
| Draft | [01-draft.md](../../../../drafts/f3-workflow-manual-section/01-draft.md) | reviewed |
| PRD | [f3-workflow-manual-section-prd.md](../../../../prd/10-approved/f3-workflow-manual-section-prd.md) | approved |
| PRD Review | [03-prd-review.md](../../../../drafts/f3-workflow-manual-section/03-prd-review.md) | Approve |
| Wireframe Screens | [screens.md](../../../../wireframes/f3-workflow-manual-section/screens.md) | reviewed |
| Wireframe Navigation | [navigation.md](../../../../wireframes/f3-workflow-manual-section/navigation.md) | reviewed |
| Wireframe Components | [components.md](../../../../wireframes/f3-workflow-manual-section/components.md) | reviewed |
| Wireframe Review | [04-wireframe-review.md](../../../../wireframes/f3-workflow-manual-section/04-wireframe-review.md) | Approve |
| Draft Routing Metadata | [07-routing-metadata.md](../../../../drafts/f3-workflow-manual-section/07-routing-metadata.md) | bridge done |
| Architecture SSOT | [00-dev-architecture.md](../../../../project/00-dev-architecture.md) | approved |

---

## 3. Handoff Summary

F3는 OPTIC 랜딩에 업무 매뉴얼형 스크롤 섹션을 추가하는 Feature다. F2가 제품 라인업과 카피 기준을 정리했으므로, F3는 제품 카드나 외부 연동 나열을 반복하지 않고 실제 업무가 이어지는 순서를 보여준다.

핵심 기준은 다음과 같다.

1. 신규 섹션은 `Products` 직후 배치를 기본 추천으로 한다.
2. 섹션은 제품 카드가 아니라 업무 단계형 흐름이다.
3. 6단계는 `AI 오더 등록 → 상하차지 관리 → 배차/운송 상태 → 화물맨 연동 → 정산 자동화 → 세금계산서 관리` 순서로 고정한다.
4. `화물맨 연동`은 배차 단계의 외부 채널 연결로만 설명한다.
5. `정산 자동화`와 `세금계산서 관리`는 후반부 단계로 분리한다.
6. 화주/주선사별 커스텀 가능성은 요청 양식, 배차 방식, 정산 기준, 전송 필드 조율 수준으로 표현한다.
7. 실제 API, tenant admin, 설정 저장, 실시간 상태 UI는 구현하지 않는다.
8. F4 애니메이션과 상태 mock이 이어받을 수 있도록 단계별 stable id와 data shape를 남긴다.

---

## 4. Pipeline Position

| 단계 | 상태 | 산출물 |
|---|---|---|
| P1 Idea | done | IDEA-20260429-002 |
| P2 Screen | done | Go, RICE 81.6, Standard |
| P3 Draft | done | draft + routing metadata |
| P4 PRD | done | approved PRD + PRD review |
| P5 Wireframe | done | desktop/mobile/landing flow 구조 고정 |
| P6 Stitch | skipped | visual design handoff 대상이 아니므로 생략 |
| P7 Bridge | done | context package |
| Dev Feature | done | feature package |
| Dev Run | done | implementation + verification evidence |
| Dev Verify | done | verification report |
| Archive | done | [ARCHIVE-F3](../../../ARCHIVE-F3.md) |

---

## 5. Next Step

F3 산출물은 [ARCHIVE-F3](../../../ARCHIVE-F3.md)와 [sources](../../../sources/)에 보존한다.
