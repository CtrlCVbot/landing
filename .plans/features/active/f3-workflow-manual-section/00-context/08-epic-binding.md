# Epic Binding: f3-workflow-manual-section

> EPIC-20260428-001의 Phase C/F3를 개발 가능한 Feature context로 연결한다.

---

## 1. 연결 정보

| 항목 | 값 |
|---|---|
| Epic | [EPIC-20260428-001](../../../../epics/10-planning/EPIC-20260428-001/00-epic-brief.md) |
| Child Feature | F3 - 업무 매뉴얼형 스크롤 섹션 MVP |
| IDEA | [IDEA-20260429-002](../../../../ideas/20-approved/IDEA-20260429-002.md) |
| Screening | [SCREENING-20260429-002](../../../../ideas/20-approved/SCREENING-20260429-002.md) |
| Draft | [01-draft.md](../../../../drafts/f3-workflow-manual-section/01-draft.md) |
| PRD | [f3-workflow-manual-section-prd.md](../../../../prd/10-approved/f3-workflow-manual-section-prd.md) |
| PRD Review | [03-prd-review.md](../../../../drafts/f3-workflow-manual-section/03-prd-review.md) |
| Wireframe | [screens.md](../../../../wireframes/f3-workflow-manual-section/screens.md) |
| Wireframe Review | [04-wireframe-review.md](../../../../wireframes/f3-workflow-manual-section/04-wireframe-review.md) |
| Routing | [07-routing-metadata.md](../../../../drafts/f3-workflow-manual-section/07-routing-metadata.md) |

---

## 2. Epic 내 역할

F3는 EPIC-20260428-001의 핵심 사용자 가치인 업무 매뉴얼형 스크롤 섹션이다. F1이 브랜드와 CTA를 고정하고 F2가 제품/카피 기준을 정리한 뒤, F3는 실제 업무 흐름을 새 섹션으로 보여준다.

F3가 고정한 static workflow section은 F4의 애니메이션과 상태 표현이 이어받을 기반이다. F3는 구조와 카피, 데이터 shape를 고정하고, F4는 motion과 mock state를 확장한다.

---

## 3. 의존성

| 관계 | 상태 | 메모 |
|---|---|---|
| F1 -> F3 | 충족 | 브랜드/CTA 기준 archive 완료 |
| F2 -> F3 | 충족 | 제품 라인업과 카피 기준 archive 완료 |
| F3 -> F4 | 선행 필요 | F4는 F3의 workflow section 구조와 stable id를 이어받음 |
| F3 -> F5 | 일부 영향 | 접근성, 메타, release readiness 검증이 F5로 이어짐 |

---

## 4. 다음 경로

| 단계 | 명령 | 목적 |
|---|---|---|
| Dev package | completed | TASK와 test case를 공식 package로 승격 |
| Dev run | `/dev-run .plans/features/active/f3-workflow-manual-section/` | TDD 구현 |
| Dev verify | `/dev-verify .plans/features/active/f3-workflow-manual-section/` | typecheck/test/lint/build/copy scan/responsive evidence |

---

## 5. Bridge 완료 조건

- [x] Approved PRD 존재
- [x] PRD review `Approve`
- [x] Wireframe 작성 및 review `Approve`
- [x] Stitch 생략 사유 기록
- [x] Architecture Profile 상속 확인
- [x] Allowed target paths 정의
- [x] workflow 6단계와 stable id 기준 정의
- [x] F2/F4 의존성 기록
- [x] 다음 단계 `/dev-run` 경로 명시
