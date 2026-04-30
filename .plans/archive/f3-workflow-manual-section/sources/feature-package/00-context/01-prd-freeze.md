# PRD Freeze: f3-workflow-manual-section

> **Feature Slug**: `f3-workflow-manual-section`
> **Source PRD**: [f3-workflow-manual-section-prd.md](../../../../prd/10-approved/f3-workflow-manual-section-prd.md)
> **PRD Review**: [03-prd-review.md](../../../../drafts/f3-workflow-manual-section/03-prd-review.md)
> **Wireframe**: [screens.md](../../../../wireframes/f3-workflow-manual-section/screens.md)
> **Wireframe Review**: [04-wireframe-review.md](../../../../wireframes/f3-workflow-manual-section/04-wireframe-review.md)
> **Status**: frozen for dev handoff
> **Created**: 2026-04-29

---

## 1. Frozen Summary

F3는 랜딩 방문자가 OPTIC의 주 서비스를 실제 운송 운영 흐름으로 이해하도록 만드는 신규 업무 매뉴얼형 섹션이다. 구현은 공개 랜딩의 static section MVP에 닫힌다.

방문자는 `AI 오더 등록`, `상하차지 관리`, `배차/운송 상태`, `화물맨 연동`, `정산 자동화`, `세금계산서 관리`가 하나의 흐름으로 이어지고, 그 흐름이 화주와 주선사별 요청 양식, 배차 방식, 정산 기준에 맞춰 조율될 수 있음을 이해해야 한다.

---

## 2. Frozen Scope

| 범위 | 결정 |
|---|---|
| 포함 | 신규 업무 매뉴얼형 landing section 추가 |
| 포함 | Products 직후 배치 기본 추천 |
| 포함 | 6단계 workflow 순서 고정 |
| 포함 | 화주/주선사별 커스텀 가능성 카피 반영 |
| 포함 | 배차 단계의 `화물맨 연동` 설명 |
| 포함 | `정산 자동화`, `세금계산서 관리` 분리 |
| 포함 | 375px 모바일 폭에서 텍스트 겹침 방지 |
| 포함 | F4 handoff를 위한 stable id와 data shape |
| 제외 | 실제 화물맨 API 연동 |
| 제외 | 실제 정산/세금계산서 API 연동 |
| 제외 | tenant admin, 설정 저장, 고객별 설정 UI |
| 제외 | F4 스크롤 애니메이션, stagger, 상태 mock 고도화 |
| 제외 | F5 favicon, Open Graph, 브랜드 자산 확정 |
| 제외 | 제품 라인업 재설계 |

---

## 3. Requirement Alias

PRD 원본 ID가 길기 때문에 dev package에서는 아래 alias를 병기할 수 있다.

| Alias | 원본 PRD 요구사항 | 요약 |
|---|---|---|
| `REQ-F3-001` | `REQ-f3-workflow-manual-section-001` | 신규 업무 매뉴얼형 섹션 추가 |
| `REQ-F3-002` | `REQ-f3-workflow-manual-section-002` | 6단계 업무 흐름 순서 노출 |
| `REQ-F3-003` | `REQ-f3-workflow-manual-section-003` | 단계별 제목과 설명 |
| `REQ-F3-004` | `REQ-f3-workflow-manual-section-004` | 커스텀 가능성 핵심 메시지 |
| `REQ-F3-005` | `REQ-f3-workflow-manual-section-005` | 단계별 커스텀 포인트 |
| `REQ-F3-006` | `REQ-f3-workflow-manual-section-006` | 화물맨 연동은 배차 단계 |
| `REQ-F3-007` | `REQ-f3-workflow-manual-section-007` | 정산 자동화와 세금계산서 관리 분리 |
| `REQ-F3-008` | `REQ-f3-workflow-manual-section-008` | F2 제품 라인업 반복 금지 |
| `REQ-F3-009` | `REQ-f3-workflow-manual-section-009` | workflow data와 UI 분리 |
| `REQ-F3-010` | `REQ-f3-workflow-manual-section-010` | F4 handoff 가능한 stable id |
| `REQ-F3-011` | `REQ-f3-workflow-manual-section-011` | 모바일 텍스트 겹침 방지 |
| `REQ-F3-012` | `REQ-f3-workflow-manual-section-012` | 접근성 기본값 |
| `REQ-F3-013` | `REQ-f3-workflow-manual-section-013` | 구현 범위 초과 표현 방지 |
| `REQ-F3-014` | `REQ-f3-workflow-manual-section-014` | 테스트 또는 스캔 기준 |

---

## 4. Frozen User Stories

| Story | 요약 | 연결 요구사항 |
|---|---|---|
| `US-F3-001` | 화주 의사결정자가 운송 요청 처리 순서를 이해한다. | `REQ-F3-001`, `REQ-F3-002`, `REQ-F3-004` |
| `US-F3-002` | 주선사 운영자가 AI 오더, 배차, 화물맨, 정산 흐름을 비교한다. | `REQ-F3-002`, `REQ-F3-006`, `REQ-F3-007` |
| `US-F3-003` | 정산 담당자가 정산과 세금계산서 후속 흐름을 이해한다. | `REQ-F3-007` |
| `US-F3-004` | 도입 검토자가 맞춤형 운영 서비스로 판단한다. | `REQ-F3-004`, `REQ-F3-005`, `REQ-F3-013` |
| `US-F3-005` | F4 구현자가 단계 구조를 이어받는다. | `REQ-F3-009`, `REQ-F3-010` |

---

## 5. Acceptance Criteria

| AC | 기준 |
|---|---|
| `AC-F3-001` | 랜딩에 신규 업무 매뉴얼형 섹션이 렌더링된다. |
| `AC-F3-002` | 6단계가 지정 순서대로 노출된다. |
| `AC-F3-003` | 각 단계에 제목, 설명, 커스텀 포인트가 있다. |
| `AC-F3-004` | `화물맨 연동`은 배차/운송 상태 이후, 정산 이전에 위치한다. |
| `AC-F3-005` | `정산 자동화`, `세금계산서 관리`가 분리되어 보인다. |
| `AC-F3-006` | F2 제품 라인업 카드 구조를 중복하지 않는다. |
| `AC-F3-007` | 375px 모바일 폭에서 텍스트 겹침이 없다. |
| `AC-F3-008` | 단계별 stable id가 존재해 F4가 이어받을 수 있다. |
| `AC-F3-009` | 실제 API/설정 저장 구현으로 오해될 문구가 없다. |

---

## 6. Dev Handoff

Feature Package와 `/dev-run` 구현이 완료되었으므로 다음 단계는 `/dev-verify .plans/features/active/f3-workflow-manual-section/`다.

구현자는 이 문서와 [06-architecture-binding.md](./06-architecture-binding.md)를 먼저 읽고, 실제 TASK와 test case는 [08-dev-tasks.md](../02-package/08-dev-tasks.md)와 [09-test-cases.md](../02-package/09-test-cases.md)를 SSOT로 사용한다.

화면 구조는 [screens.md](../../../../wireframes/f3-workflow-manual-section/screens.md), 데이터 구조와 컴포넌트 기준은 [components.md](../../../../wireframes/f3-workflow-manual-section/components.md)를 따른다.
