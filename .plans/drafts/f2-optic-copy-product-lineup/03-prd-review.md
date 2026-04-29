# PRD Review: F2 카피와 제품 라인업 정리

> **PRD**: [f2-optic-copy-product-lineup-prd.md](../../prd/10-approved/f2-optic-copy-product-lineup-prd.md)
> **Draft**: [01-draft.md](./01-draft.md)
> **Routing metadata**: [07-routing-metadata.md](./07-routing-metadata.md)
> **작성일**: 2026-04-29
> **판정**: Approve
> **상태**: PASS with queued follow-up

---

## 1. Review Summary

| 항목 | 판정 | 근거 |
|---|---|---|
| 10개 필수 섹션 | PASS | Overview, Problem, Goals, User Stories, Functional Requirements, UX, Technical, Milestones, Risks, Metrics 포함 |
| Draft 일관성 | PASS | `OPTIC` 브랜드 기준, 화주/주선사별 커스텀 가능성, 외부 브랜드명 제한, F3 handoff 범위가 draft와 일치 |
| 제품 라인업 범위 | PASS after fix | 사용자 피드백에 따라 현재 구현 대상은 한글 역할명 우선으로 표시하고, `OPTIC Broker/Shipper`는 보조 라벨로 병기 |
| 요구사항 ID 체계 | PASS | `REQ-f2-optic-copy-product-lineup-###` 형식 14건 작성 |
| Scope control | PASS | 실제 외부 API, tenant admin, 설정 저장 구조, F3 신규 섹션, F4 motion, F5 자산 확정 제외 |
| 검증 가능성 | PASS | 금지 문구, 제품명, 외부 브랜드명, 커스텀 메시지, desktop/mobile spot check 기준 포함 |
| 남은 blocker | 없음 | PRD 단계 critical/high 잔여 blocker 없음 |

## 2. PRD Checklist

| 체크 항목 | 상태 | 메모 |
|---|---|---|
| 10개 PRD 섹션 존재 | 완료 | 1~10 섹션 충족 |
| User Story 형식 | 완료 | 5개 story 모두 As a / I want / so that 형식 |
| Functional Requirement ID | 완료 | REQ 14건, 우선순위와 수용 기준 포함 |
| 비기능 요구사항 | 부분완료 | 모바일 텍스트 안정성과 responsive spot check는 포함. 접근성 label 세부 기준은 F5 또는 dev package에서 보강 필요 |
| Success Metrics 측정 가능성 | 완료 | SM 8건, 측정 방법 포함 |
| Risks와 mitigation | 완료 | 커스텀 과장, 외부 브랜드명, F3 중복, 구현 예정 제품 혼동 리스크 포함 |
| Non-Goals 명시 | 완료 | API, tenant admin, route/권한 설계, F3/F4/F5 범위 제외 |
| 기술 제약 연결 | 완료 | `src/lib/constants.ts`, 섹션 컴포넌트, 내부 key와 고객-facing 카피 분리 기준 포함 |
| Milestone 현실성 | 완료 | review → copy map → constants update → section render → verification → handoff 흐름 |
| 용어 일관성 | 완료 | `OPTIC`, `OPTICS`, `화물맨`, 한글 역할명 우선 제품 카드, Broker/Shipper 보조 라벨 기준 정리 |
| 내부 참조 일관성 | 완료 | REQ, Risk, Metrics가 제품 라인업 변경과 연결됨 |
| 이전 단계 범위 일치 | 완료 | IDEA/Screening/Draft의 Standard dev copy/data 범위와 일치 |

## 3. PCC 검증

| PCC | 판정 | 근거 |
|---|---|---|
| PCC-01 Idea ↔ Screen | PASS | IDEA와 SCREENING 모두 `20-approved` 상태이며 RICE 78.0, Go, Standard lane 기준 유지 |
| PCC-02 Screen ↔ Feature | PASS | 승인 IDEA 기반 draft `01-draft.md`와 routing metadata 존재 |
| PCC-03 Feature ↔ PRD | PASS | draft의 카피 기준, 커스텀 가능성, 제품 라인업, F3 handoff가 PRD에 반영됨 |
| PCC-04 PRD ↔ Wireframe | PASS | 제품 라인업 표시 구조 변경 필요가 확인되어 `wireframes/f2-optic-copy-product-lineup` 작성 |
| PCC-05 Wireframe ↔ Stitch | SKIP | F2는 visual design handoff가 아니라 dev Feature Package로 직행 |
| PCC-06 Gap Board ↔ Detail PRD | 해당 없음 | copy fidelity Scenario C가 아니라 Standard dev copy 정리 |
| PCC-07 Epic Binding | PASS | Epic brief와 children features가 `EPIC-20260428-001 / F2`를 가리킴 |
| PCC-08 Feature 상태 동기 | PASS after fix | routing, IDEA, backlog, Epic brief, children features가 PRD review 완료와 다음 `/plan-bridge`를 같은 방향으로 표시 |
| PCC-09 의존성 매트릭스 | PASS | F2는 F3 선행 카피 기준이며 Children matrix의 순차 의존성과 일치 |

## 4. Feedback Items

| 항목 | Severity | Score | Confidence | Action | 결과 |
|---|---|---:|---|---|---|
| 제품 라인업이 5개 활성 제품처럼 해석될 수 있음 | high | 5 | confirmed | auto-fixed | 한글 역할명 우선 2개 구현 대상, Carrier/Ops/Billing 구현 예정으로 PRD/Draft/IDEA/Epic 반영 |
| 영문 제품명만으로 사용자가 역할을 이해하기 어려움 | high | 5 | confirmed | auto-fixed | `주선사용 운송 운영 콘솔`, `화주용 운송 요청 포털`을 1차 제목으로 두고 Broker/Shipper는 보조 라벨로 정리 |
| wireframe 필요성을 과소평가할 수 있음 | medium | 4 | confirmed | auto-fixed | 제품 라인업 표시 구조를 screens/navigation/components wireframe으로 작성 |
| 접근성 label 세부 기준이 F5로 밀릴 수 있음 | medium | 3 | likely | queued | F2 dev package에서 텍스트 overflow와 CTA label 영향 확인 항목을 유지 |
| hero `데모 보기` CTA 처리 결론이 구현 단계에서 흐려질 수 있음 | low | 2 | likely | queued | Copy map에서 `OPTIC 바로가기` 유지/문의 CTA/예외 유지 중 하나를 확정 |

### Severity Score Detail

| 항목 | Impact | Reach | Recovery | Total | Confidence | Action |
|---|---:|---:|---:|---:|---|---|
| Product lineup over-scope | 3 | 1 | 1 | 5 | confirmed | auto-fixed |
| English product-name comprehension | 3 | 1 | 1 | 5 | confirmed | auto-fixed |
| Wireframe routing ambiguity | 2 | 1 | 1 | 4 | confirmed | auto-fixed |
| Accessibility detail deferral | 1 | 1 | 1 | 3 | likely | queued |
| Hero CTA decision drift | 1 | 1 | 0 | 2 | likely | queued |

## 5. Review Decision

**Approve**.

PRD는 F2 구현에 필요한 요구사항과 검증 기준을 충분히 담고 있다. 사용자 피드백으로 제품 라인업 범위와 표시 방식을 조정해, 현재 구현은 `주선사용 운송 운영 콘솔`, `화주용 운송 요청 포털` 두 가지에 집중하고 `OPTIC Broker`, `OPTIC Shipper`는 보조 라벨로 병기한다. `OPTIC Carrier`, `OPTIC Ops`, `OPTIC Billing`은 구현 예정으로 분리했다.

F2는 전체 랜딩 재설계는 아니지만 제품 라인업 표시 구조가 바뀐다. 사용자 확인에 따라 lightweight wireframe을 추가했고, Stitch는 생략한다. Bridge context는 wireframe-aware 상태로 갱신한 뒤 `/dev-feature .plans/features/active/f2-optic-copy-product-lineup/`로 진행한다.

## 6. Next Steps

1. [screens.md](../../wireframes/f2-optic-copy-product-lineup/screens.md), [navigation.md](../../wireframes/f2-optic-copy-product-lineup/navigation.md), [components.md](../../wireframes/f2-optic-copy-product-lineup/components.md)를 dev handoff 입력으로 유지한다.
2. `/dev-feature .plans/features/active/f2-optic-copy-product-lineup/`로 개발 패키지를 만든다.
3. Dev package에서 금지 문구, 제품명/역할명, 외부 브랜드명, 커스텀 메시지, CTA 문구 스캔을 acceptance criteria로 유지한다.
