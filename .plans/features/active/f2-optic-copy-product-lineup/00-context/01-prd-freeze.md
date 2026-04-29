# PRD Freeze: f2-optic-copy-product-lineup

> **Feature Slug**: `f2-optic-copy-product-lineup`
> **Source PRD**: [f2-optic-copy-product-lineup-prd.md](../../../../prd/10-approved/f2-optic-copy-product-lineup-prd.md)
> **PRD Review**: [03-prd-review.md](../../../../drafts/f2-optic-copy-product-lineup/03-prd-review.md)
> **Wireframe**: [screens.md](../../../../wireframes/f2-optic-copy-product-lineup/screens.md)
> **Status**: frozen for dev handoff
> **Created**: 2026-04-29

---

## 1. Frozen Summary

F2는 랜딩 본문 카피와 제품 라인업을 `OPTIC`의 핵심 가치에 맞춰 정렬하는 Feature다. 구현은 현재 섹션과 상수 데이터의 customer-facing copy를 정리하는 데 닫힌다.

방문자는 `OPTIC Broker`와 `OPTIC Shipper`라는 영문 제품명을 몰라도, 먼저 `주선사용 운송 운영 콘솔`과 `화주용 운송 요청 포털`이라는 역할명으로 본인에게 맞는 서비스를 이해해야 한다.

---

## 2. Frozen Scope

| 범위 | 결정 |
|---|---|
| 포함 | `OPTIC` 주 브랜드 유지, `OPTICS` 보조 설명 제한 |
| 포함 | `Cargo`, 테스트성 문구, 외부 브랜드명 중심 카피 정리 |
| 포함 | 제품 라인업의 한글 역할명 우선 표시 |
| 포함 | `OPTIC Broker/Shipper` 보조 라벨 병기 |
| 포함 | `OPTIC Carrier/Ops/Billing` 구현 예정 표시 |
| 포함 | 화주/주선사별 커스텀 가능성 메시지 반영 |
| 포함 | F3 매뉴얼형 섹션이 이어받을 단계 흐름 기준 유지 |
| 제외 | F3 신규 업무 매뉴얼형 섹션 구현 |
| 제외 | F4 애니메이션과 상태 mock 구현 |
| 제외 | F5 favicon, Open Graph, 브랜드 자산 확정 |
| 제외 | 실제 화물맨, 지도, 전자세금계산서 API 연동 |
| 제외 | tenant admin, 설정 저장 구조, 권한/라우팅 정책 구현 |
| 제외 | Hero 구조 또는 DashboardPreview 핵심 동작 재설계 |

---

## 3. Requirement Alias

PRD 원본 ID가 길기 때문에 dev package에서는 아래 alias를 병기할 수 있다.

| Alias | 원본 PRD 요구사항 | 요약 |
|---|---|---|
| `REQ-F2-001` | `REQ-f2-optic-copy-product-lineup-001` | 고객 노출 주 브랜드 `OPTIC` 유지 |
| `REQ-F2-002` | `REQ-f2-optic-copy-product-lineup-002` | `OPTICS` 보조 설명 제한 |
| `REQ-F2-003` | `REQ-f2-optic-copy-product-lineup-003` | 금지 문구 제거 |
| `REQ-F2-004` | `REQ-f2-optic-copy-product-lineup-004` | `Cargo` 중심 표현 축소 |
| `REQ-F2-005` | `REQ-f2-optic-copy-product-lineup-005` | `OPTIC` 의미를 고객 가치 문장으로 표현 |
| `REQ-F2-006` | `REQ-f2-optic-copy-product-lineup-006` | 화주/주선사별 커스텀 가능성 반영 |
| `REQ-F2-007` | `REQ-f2-optic-copy-product-lineup-007` | 한글 역할명 우선 제품 라인업 |
| `REQ-F2-008` | `REQ-f2-optic-copy-product-lineup-008` | 구현 예정 제품 분리 |
| `REQ-F2-009` | `REQ-f2-optic-copy-product-lineup-009` | 기능 섹션 업무 결과 중심화 |
| `REQ-F2-010` | `REQ-f2-optic-copy-product-lineup-010` | 문제/해결 섹션 수작업 감소 중심화 |
| `REQ-F2-011` | `REQ-f2-optic-copy-product-lineup-011` | `화물맨` 외 외부 브랜드명 일반화 |
| `REQ-F2-012` | `REQ-f2-optic-copy-product-lineup-012` | Hero CTA 문구 스캔 대상 포함 |
| `REQ-F2-013` | `REQ-f2-optic-copy-product-lineup-013` | F3 handoff 단계 흐름 유지 |
| `REQ-F2-014` | `REQ-f2-optic-copy-product-lineup-014` | 문구/UI 안정성 검증 |

---

## 4. Frozen User Stories

| Story | 요약 | 연결 요구사항 |
|---|---|---|
| `US-F2-001` | 방문자가 주선사용/화주용 서비스 구분을 먼저 이해한다. | `REQ-F2-007`, `REQ-F2-008` |
| `US-F2-002` | 주선사 운영자가 오더-배차-연동-정산 흐름을 업무 흐름으로 이해한다. | `REQ-F2-005`, `REQ-F2-006`, `REQ-F2-009` |
| `US-F2-003` | 화주 의사결정자가 조직 방식에 맞출 수 있는 플랫폼으로 판단한다. | `REQ-F2-006`, `REQ-F2-007` |
| `US-F2-004` | 정산/회계 담당자가 외부 서비스명보다 업무 결과를 먼저 본다. | `REQ-F2-010`, `REQ-F2-011` |
| `US-F2-005` | F3 구현자가 기존 카피와 신규 매뉴얼형 섹션 역할을 분리한다. | `REQ-F2-013`, `REQ-F2-014` |

---

## 5. Acceptance Criteria

| AC | 기준 |
|---|---|
| `AC-F2-001` | 고객-facing 본문에서 주 브랜드는 `OPTIC`으로 보인다. |
| `AC-F2-002` | `OPTICS`는 내부 엔진 또는 footer/About 보조 설명 수준으로만 남는다. |
| `AC-F2-003` | `Optic Cargo`, `서비스 테스트`, `테스트 서버`, `데모 테스트`가 고객-facing 코드에 남지 않는다. |
| `AC-F2-004` | 제품 라인업에서 `주선사용 운송 운영 콘솔` + `OPTIC Broker`가 함께 보인다. |
| `AC-F2-005` | 제품 라인업에서 `화주용 운송 요청 포털` + `OPTIC Shipper`가 함께 보인다. |
| `AC-F2-006` | `OPTIC Carrier`, `OPTIC Ops`, `OPTIC Billing`은 구현 예정으로만 구분된다. |
| `AC-F2-007` | `화물맨` 외 외부 서비스명은 고객-facing 카피에서 일반 기능명으로 낮아진다. |
| `AC-F2-008` | 화주/주선사별 운영 방식, 요청 양식, 정산 기준에 맞출 수 있다는 메시지가 최소 2개 주요 섹션에 반영된다. |
| `AC-F2-009` | 375px 모바일 폭에서 제품 카드와 버튼 텍스트가 겹치지 않는다. |
| `AC-F2-010` | F3가 이어받을 업무 단계 흐름이 문서 또는 후속 package에 추적 가능하다. |

---

## 6. Dev Handoff

다음 단계는 `/dev-feature .plans/features/active/f2-optic-copy-product-lineup/`다.

구현자는 이 문서와 [06-architecture-binding.md](./06-architecture-binding.md)를 먼저 읽고, 실제 TASK와 test case는 `/dev-feature`가 생성할 `02-package` 문서를 SSOT로 사용한다.

제품 라인업 화면 구조는 [screens.md](../../../../wireframes/f2-optic-copy-product-lineup/screens.md), [components.md](../../../../wireframes/f2-optic-copy-product-lineup/components.md)를 함께 따른다.
