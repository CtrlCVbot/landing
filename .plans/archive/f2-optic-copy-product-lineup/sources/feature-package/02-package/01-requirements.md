# 01. Requirements - F2 카피와 제품 라인업 정리

> 이 문서가 구현 요구사항의 SSOT다.

---

## 1. Functional Requirements

| ID | 요구사항 | Acceptance Criteria |
|---|---|---|
| REQ-F2-001 | 고객 노출 주 브랜드는 `OPTIC`으로 유지한다 | 본문 섹션, 제품 라인업, footer/header 회귀에서 `OPTIC`이 주 브랜드로 보임 |
| REQ-F2-002 | `OPTICS`는 내부 엔진 또는 보조 설명 수준으로 제한한다 | 고객-facing 본문 제목/제품명에서 `OPTICS`가 전면 브랜드로 쓰이지 않음 |
| REQ-F2-003 | 이전/내부 검증성 문구를 고객-facing 코드에서 제거한다 | `Optic Cargo`, `서비스 테스트`, `테스트 서버`, `데모 테스트` 스캔 0건 |
| REQ-F2-004 | `Cargo` 중심 표현을 `오더`, `운송`, `운영 조율`, `정산` 중심 표현으로 바꾼다 | `Cargo`가 주요 가치 설명을 주도하지 않음 |
| REQ-F2-005 | `OPTIC`의 가치는 맞춤형 운송 운영 조율로 표현한다 | 약어 나열보다 회사별 운송 운영을 맞춰 정리한다는 문장으로 표현 |
| REQ-F2-006 | 화주/주선사별 커스텀 가능성을 핵심 메시지로 반영한다 | 회사별 요청 양식, 운영 방식, 정산 기준에 맞춘다는 문구가 최소 2개 주요 섹션에 반영 |
| REQ-F2-007 | Products 섹션은 한글 역할명 우선으로 표시한다 | `주선사용 운송 운영 콘솔` + `OPTIC Broker`, `화주용 운송 요청 포털` + `OPTIC Shipper`가 함께 보임 |
| REQ-F2-008 | `Carrier/Ops/Billing`은 구현 예정으로 분리한다 | `OPTIC Carrier`, `OPTIC Ops`, `OPTIC Billing`이 활성 제품 탭처럼 보이지 않음 |
| REQ-F2-009 | Features 섹션은 업무 결과 중심으로 정리한다 | `AI 오더 등록`, 배차 단계의 `화물맨 연동`, `정산 자동화`, `세금계산서 관리`가 기능 흐름으로 보임 |
| REQ-F2-010 | Problems 섹션은 수작업 감소와 누락 방지를 먼저 말한다 | 외부 브랜드명 나열보다 중복 입력, 전송 누락, 정산 누락 방지 가치가 먼저 보임 |
| REQ-F2-011 | `화물맨` 외 외부 provider명은 일반 기능명으로 낮춘다 | `Google Gemini AI`, `카카오 맵`, `팝빌`, `로지스엠`이 customer-facing copy에 전면 노출되지 않음 |
| REQ-F2-012 | Hero는 구조 변경 없이 카피 스캔 대상에 포함한다 | Hero의 내부 검증성 문구와 CTA 역할이 F1 기준과 충돌하지 않음 |
| REQ-F2-013 | F3 매뉴얼형 섹션으로 이어질 단계 흐름을 남긴다 | 운영 방식 선택 → AI 오더 등록 → 상하차지 → 배차 단계 화물맨 연동 → 정산 → 세금계산서 흐름이 추적 가능 |
| REQ-F2-014 | 긴 한글 문구와 UI 안정성을 검증한다 | 375px 모바일과 desktop spot check에서 제품 카드와 버튼 텍스트 overflow 없음 |

## 2. Non-Functional Requirements

| ID | 기준 | 검증 |
|---|---|---|
| NFR-F2-001 | 신규 dependency 추가 없음 | `package.json` diff 없음 |
| NFR-F2-002 | DashboardPreview 동작 변경 없음 | forbidden path diff 없음 |
| NFR-F2-003 | API/DB/인증 변경 없음 | 관련 route, schema, env diff 없음 |
| NFR-F2-004 | 내부 key 변경과 customer-facing copy 변경을 분리 | 코드 리뷰와 tests |
| NFR-F2-005 | Stitch 없이 dev handoff 가능 | wireframe과 package가 UI 기준을 충분히 명시 |

## 3. Open Gates

| 항목 | Severity | Action | 구현 전 처리 |
|---|---|---|---|
| `화물맨` 표기와 `로지스엠/화물맨` 표기 경계 | medium | needs-verification | customer-facing 문구는 `화물맨` 우선, 내부 key는 무리하게 변경하지 않음 |
| Hero `데모 보기` CTA 처리 | low | queued | F1 CTA 기준과 충돌하면 F2에서 label/href 보정 |
| 제품 섹션 tab 유지 여부 | medium | needs-verification | 기본안은 2 primary card + upcoming compact, tab 유지 시 Broker/Shipper만 active |
| 긴 한글 제품명 overflow | medium | needs-verification | browser spot check 필수 |

## 4. Out of Scope

- F3 업무 매뉴얼형 신규 섹션 추가
- F4 애니메이션과 상태 mock 구현
- F5 favicon, Open Graph, 브랜드 자산 확정
- 실제 화물맨, 지도, 전자세금계산서 API 연동
- 화주/주선사별 설정 UI, tenant admin, 설정 저장 구조 신규 구현
- DashboardPreview 핵심 동작 변경
