# Epic Binding: f2-optic-copy-product-lineup

> EPIC-20260428-001의 Phase B/F2를 개발 가능한 Feature context로 연결한다.

---

## 1. 연결 정보

| 항목 | 값 |
|---|---|
| Epic | [EPIC-20260428-001](../../../../epics/10-planning/EPIC-20260428-001/00-epic-brief.md) |
| Child Feature | F2 - 카피와 제품 라인업 정리 |
| IDEA | [IDEA-20260429-001](../../../../ideas/20-approved/IDEA-20260429-001.md) |
| Screening | [SCREENING-20260429-001](../../../../ideas/20-approved/SCREENING-20260429-001.md) |
| Draft | [01-draft.md](../../../../drafts/f2-optic-copy-product-lineup/01-draft.md) |
| PRD | [f2-optic-copy-product-lineup-prd.md](../../../../prd/10-approved/f2-optic-copy-product-lineup-prd.md) |
| PRD Review | [03-prd-review.md](../../../../drafts/f2-optic-copy-product-lineup/03-prd-review.md) |
| Routing | [07-routing-metadata.md](../../../../drafts/f2-optic-copy-product-lineup/07-routing-metadata.md) |

---

## 2. Epic 내 역할

F2는 F1에서 고정한 `OPTIC` 브랜드 기준을 본문 카피와 제품 라인업으로 확장한다. 이 기준이 먼저 정리되어야 F3 업무 매뉴얼형 스크롤 섹션이 같은 용어와 가치 문장 위에서 이어질 수 있다.

F2는 구현 대상 제품을 `주선사용 운송 운영 콘솔` + `OPTIC Broker`, `화주용 운송 요청 포털` + `OPTIC Shipper`로 제한한다. `Carrier/Ops/Billing`은 현재 구현 범위가 아니라 구현 예정으로만 남긴다.

---

## 3. 의존성

| 관계 | 상태 | 메모 |
|---|---|---|
| F1 -> F2 | 충족 | F1 archive 완료, 브랜드/CTA 기준 고정 |
| F2 -> F3 | 선행 필요 | F3 신규 업무 섹션이 F2 카피 기준을 재사용 |
| F2 -> F5 | 일부 영향 | 제품명, 외부 브랜드명, 접근성 label 검증이 F5 release readiness로 이어짐 |

---

## 4. 다음 경로

| 단계 | 명령 | 목적 |
|---|---|---|
| Dev package | `/dev-feature .plans/features/active/f2-optic-copy-product-lineup/` | TASK와 test case를 공식 package로 승격 |
| Dev run | `/dev-run .plans/features/active/f2-optic-copy-product-lineup/` | TDD 구현 |
| Dev verify | `/dev-verify .plans/features/active/f2-optic-copy-product-lineup/` | typecheck/test/lint/build/copy scan/responsive evidence |

---

## 5. Bridge 완료 조건

- [x] Approved PRD 존재
- [x] PRD review `Approve`
- [x] Wireframe/Stitch 생략 사유 기록
- [x] Architecture Profile 상속 확인
- [x] Allowed target paths 정의
- [x] 제품 라인업 표시 계약 정의
- [x] F3 handoff 기준 유지
- [x] 다음 단계 `/dev-feature` 경로 명시
