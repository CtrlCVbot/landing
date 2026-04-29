# Feature Context Index: f2-optic-copy-product-lineup

> **Feature**: F2 카피와 제품 라인업 정리
> **Epic**: [EPIC-20260428-001](../../../../epics/10-planning/EPIC-20260428-001/00-epic-brief.md) Phase B, F2
> **Scope**: Standard, dev, copy/data 정리
> **Status**: bridged
> **Created**: 2026-04-29
> **Plan Bridge**: completed

---

## 1. Context Files

| # | 파일 | 상태 | 설명 |
|---|---|---|---|
| 00 | [00-index.md](./00-index.md) | current | Bridge context 인덱스 |
| 01 | [01-prd-freeze.md](./01-prd-freeze.md) | frozen | 승인 PRD와 review 결과 동결 |
| 02 | [02-decision-log.md](./02-decision-log.md) | active | 제품 라인업, 외부 브랜드명, F3 분리 결정 |
| 04 | [04-implementation-hints.md](./04-implementation-hints.md) | reference | dev-feature/dev-run에서 유지할 구현 힌트 |
| 06 | [06-architecture-binding.md](./06-architecture-binding.md) | current | 구조 SSOT 기반 허용 경로와 검증 경계 |
| 07 | [07-routing-metadata.md](./07-routing-metadata.md) | current | P1-P7 routing metadata와 다음 단계 |
| 08 | [08-epic-binding.md](./08-epic-binding.md) | current | Epic, IDEA, PRD 연결과 의존성 |

---

## 2. Source Documents

| 문서 | 경로 | 상태 |
|---|---|---|
| IDEA | [IDEA-20260429-001.md](../../../../ideas/20-approved/IDEA-20260429-001.md) | approved |
| Screening | [SCREENING-20260429-001.md](../../../../ideas/20-approved/SCREENING-20260429-001.md) | approved, Go, Standard |
| Draft | [01-draft.md](../../../../drafts/f2-optic-copy-product-lineup/01-draft.md) | reviewed |
| PRD | [f2-optic-copy-product-lineup-prd.md](../../../../prd/10-approved/f2-optic-copy-product-lineup-prd.md) | approved |
| PRD Review | [03-prd-review.md](../../../../drafts/f2-optic-copy-product-lineup/03-prd-review.md) | Approve |
| Draft Routing Metadata | [07-routing-metadata.md](../../../../drafts/f2-optic-copy-product-lineup/07-routing-metadata.md) | bridge done |
| Architecture SSOT | [00-dev-architecture.md](../../../../project/00-dev-architecture.md) | approved |

---

## 3. Handoff Summary

F2는 F1에서 고정한 `OPTIC` 브랜드와 CTA 기준을 본문 섹션으로 확장하는 카피 정리 Feature다. 구현 목적은 신규 화면이나 외부 연동을 추가하는 것이 아니라, 현재 landing의 `constants`, `features`, `problems`, `products`, `integrations`, `hero` 카피를 고객이 이해하기 쉬운 운송 운영 흐름으로 정렬하는 것이다.

핵심 기준은 다음과 같다.

1. 제품 라인업은 `주선사용 운송 운영 콘솔` + `OPTIC Broker`, `화주용 운송 요청 포털` + `OPTIC Shipper`를 현재 구현 대상으로 둔다.
2. `OPTIC Carrier`, `OPTIC Ops`, `OPTIC Billing`은 구현 예정으로만 표시하고 활성 제품처럼 보이지 않게 한다.
3. `OPTIC`은 약어 풀이가 아니라 회사별 운송 운영을 맞춰 조율하는 가치 문장으로 풀어쓴다.
4. 화주/주선사별 운영 방식, 요청 양식, 정산 기준에 맞출 수 있다는 메시지를 주요 섹션에 반영한다.
5. `화물맨` 외 외부 AI, 지도, 전자세금계산서 서비스명은 일반 기능명으로 낮춘다.
6. F3 업무 매뉴얼형 섹션은 별도 Feature로 유지하고, F2는 F3가 이어받을 카피 기준만 남긴다.

---

## 4. Pipeline Position

| 단계 | 상태 | 산출물 |
|---|---|---|
| P1 Idea | done | IDEA-20260429-001 |
| P2 Screen | done | Go, RICE 78.0, Standard |
| P3 Draft | done | draft + routing metadata |
| P4 PRD | done | approved PRD + PRD review |
| P5 Wireframe | skipped | 기존 섹션 copy/data 정리라 신규 화면 구조 없음 |
| P6 Stitch | skipped | Wireframe 생략에 따라 Stitch 생략 |
| P7 Bridge | done | 이 context package |
| Dev Feature | pending | 다음 단계 |

---

## 5. Next Step

```bash
/dev-feature .plans/features/active/f2-optic-copy-product-lineup/
```

`/dev-feature`에서는 이 context를 바탕으로 `02-package` 요구사항, UI spec, dev tasks, test cases를 생성한다. 구현은 그 다음 `/dev-run`에서 수행한다.
