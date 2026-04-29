# 01. Requirements - F3 업무 매뉴얼형 스크롤 섹션 MVP

> 이 문서가 구현 요구사항의 SSOT다.

---

## 1. Functional Requirements

| ID | 요구사항 | Acceptance Criteria |
|---|---|---|
| REQ-F3-001 | 랜딩에 신규 업무 매뉴얼형 섹션을 추가한다 | `workflow-manual` section이 page에 렌더링된다 |
| REQ-F3-002 | 6단계 workflow를 지정 순서로 노출한다 | `AI 오더 등록`, `상하차지 관리`, `배차/운송 상태`, `화물맨 연동`, `정산 자동화`, `세금계산서 관리` 순서가 유지된다 |
| REQ-F3-003 | 각 단계는 제목, 설명, 커스텀 포인트를 포함한다 | 모든 step에 title, description, customization text가 존재한다 |
| REQ-F3-004 | OPTIC의 주 서비스가 화주/주선사별 커스텀 가능 서비스임을 전달한다 | intro 또는 summary 영역에 요청 양식, 배차 방식, 정산 기준 조율 메시지가 보인다 |
| REQ-F3-005 | 단계별 커스텀 포인트를 짧게 보여준다 | 각 step card에 회사별 조율 포인트가 1개 이상 노출된다 |
| REQ-F3-006 | `화물맨 연동`은 배차 단계로 표현한다 | `화물맨 연동`은 `배차/운송 상태` 이후, `정산 자동화` 이전에 위치한다 |
| REQ-F3-007 | `정산 자동화`와 `세금계산서 관리`를 분리한다 | 두 문구가 별도 step으로 렌더링된다 |
| REQ-F3-008 | F2 제품 라인업 카드를 반복하지 않는다 | 신규 section은 `OPTIC Broker/Shipper` 제품 카드 구조를 다시 만들지 않는다 |
| REQ-F3-009 | workflow data와 UI를 분리한다 | step data는 component 내부 하드코딩이 아니라 `src/lib/landing-workflow.ts`에서 import한다 |
| REQ-F3-010 | F4 handoff를 위한 stable id를 유지한다 | step id는 `ai-order`, `locations`, `dispatch-status`, `hwamulman`, `settlement`, `invoice`로 고정된다 |
| REQ-F3-011 | 모바일 375px에서 텍스트 겹침을 방지한다 | 긴 한글 단어가 card/button 영역을 침범하지 않는다 |
| REQ-F3-012 | 접근성 기본값을 지킨다 | section heading, semantic list, focus visible CTA를 유지한다 |
| REQ-F3-013 | 구현 범위 초과 표현을 피한다 | 실제 API 연동, 설정 저장, 자동 처리 완료처럼 오해될 문구가 없다 |
| REQ-F3-014 | 테스트 또는 스캔 기준을 남긴다 | data/order/render/copy guard 테스트 또는 스캔이 정의된다 |

## 2. Non-Functional Requirements

| ID | 기준 | 검증 |
|---|---|---|
| NFR-F3-001 | 신규 dependency 없음 | `package.json` diff 없음 |
| NFR-F3-002 | DashboardPreview 동작 변경 없음 | forbidden path diff 없음 |
| NFR-F3-003 | API/DB/인증 변경 없음 | route/schema/env diff 없음 |
| NFR-F3-004 | 기존 section과 시각 톤 일관성 유지 | `SectionWrapper`, 기존 token/class 사용 |
| NFR-F3-005 | F4 handoff 가능 | stable id와 order 테스트 |
| NFR-F3-006 | 모바일 overflow 방지 | 375px browser spot check |

## 3. Open Gates

| 항목 | Severity | Action | 구현 시 처리 |
|---|:---:|:---:|---|
| Products 직후 배치가 실제 page rhythm과 충돌할 가능성 | medium | needs-verification | `page.tsx`에서 Products 직후를 우선하고, spacing만 조정 |
| 긴 한글 문구 overflow | medium | needs-verification | copy 길이와 layout class를 함께 조정 |
| 커스텀 가능성 과장 표현 | medium | needs-verification | 설정 UI나 자동 연동 완료 약속으로 읽히는 문구 제거 |
| F4 handoff 누락 | medium | needs-verification | step id/order test 추가 |

## 4. Out of Scope

- 실제 화물맨 API 연동
- 실제 정산 API, 세금계산서 API 연동
- tenant admin, 고객별 설정 저장 UI
- scroll progress, stagger, live status mock
- 제품 라인업 구조 재설계
- DashboardPreview focus/zoom animation 변경
- favicon, Open Graph, 최종 브랜드 자산 확정
