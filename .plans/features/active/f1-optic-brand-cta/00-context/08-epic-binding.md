# 08. Epic Binding - F1 브랜드, 로고, CTA 최소 반영

> EPIC-20260428-001의 Phase A/F1을 개발 가능한 Feature context로 연결한다.

---

## 1. 연결 정보

| 항목 | 값 |
|---|---|
| Epic | [EPIC-20260428-001](../../../../epics/10-planning/EPIC-20260428-001/00-epic-brief.md) |
| Child Feature | F1 - 브랜드, 로고, CTA 최소 반영 |
| IDEA | [IDEA-20260428-001](../../../../ideas/20-approved/IDEA-20260428-001.md) |
| Screening | [SCREENING-20260428-001](../../../../ideas/20-approved/SCREENING-20260428-001.md) |
| Draft | [01-draft.md](../../../../drafts/f1-optic-brand-cta/01-draft.md) |
| Scope Review | [03-scope-review.md](../../../../drafts/f1-optic-brand-cta/03-scope-review.md) |
| Routing | [07-routing-metadata.md](../../../../drafts/f1-optic-brand-cta/07-routing-metadata.md) |

## 2. Epic 내 역할

F1은 Epic의 첫 실행 단위다. `OPTIC` 주 브랜드, `OPTICS` 보조 표기, 서비스 CTA 기준을 먼저 고정해야 F2 카피 정리와 F3 업무 매뉴얼형 섹션이 같은 브랜드 기준 위에서 진행된다.

## 3. 의존성

| 관계 | 상태 | 메모 |
|---|:---:|---|
| F1 -> F2 | 선행 권장 | 카피 전면 정리 전에 브랜드/CTA 기준 고정 |
| F1 -> F3 | 선행 권장 | 업무 매뉴얼형 섹션의 CTA/브랜드 기준 재사용 |
| F1 -> F5 | 일부 deferred | logo asset 최종 승인은 F5 release gate로 유지 |

## 4. 다음 경로

| 단계 | 명령 | 목적 |
|---|---|---|
| Dev package | `/dev-feature .plans/features/active/f1-optic-brand-cta/` | TASK와 test case를 공식 package로 승격 |
| Dev run | `/dev-run .plans/features/active/f1-optic-brand-cta/` | TDD 구현 |
| Dev verify | `/dev-verify .plans/features/active/f1-optic-brand-cta/` | typecheck/build/test/responsive evidence |

## 5. Bridge 완료 조건

- [x] Draft scope review 통과
- [x] Architecture Profile 상속 확인
- [x] Allowed target paths 정의
- [x] 서비스 URL 공개 가능성 확인 항목 유지
- [x] 다음 단계 `/dev-feature` 경로 명시
