# 08. Epic Binding — F2 Mock 스키마 재설계

> Feature ↔ Epic cross-reference. 본 파일과 Epic `01-children-features.md` F2 섹션이 양방향 링크 관계다.

---

## 1. Epic 메타

| 항목 | 값 |
|---|---|
| Epic ID | `EPIC-20260422-001` |
| Epic 제목 | dash-preview Phase 4 — Phase 3 피드백 반영 |
| Epic 상태 | `active` |
| Epic 기간 | 2026-04-23 ~ 2026-05-20 |
| Epic 파일 | [`../../../../epics/20-active/EPIC-20260422-001/00-epic-brief.md`](../../../../epics/20-active/EPIC-20260422-001/00-epic-brief.md) |
| Children 파일 | [`../../../../epics/20-active/EPIC-20260422-001/01-children-features.md`](../../../../epics/20-active/EPIC-20260422-001/01-children-features.md) |

## 2. F2의 Epic 내 위치

| 항목 | 값 |
|---|---|
| Phase | Phase B — 핵심 스키마 + 레이아웃 정확도 |
| Lane | Standard |
| Feature type | dev |
| Scenario | B |
| Hybrid | false |
| 병렬 Feature | F4 레이아웃 정비 + Hit-Area 재정렬 |
| 후속 Feature | F3 옵션↔추가요금 파생 |
| 다음 단계 | `/dev-feature .plans/features/active/f2-mock-schema-redesign/` |

## 3. Epic 성공 지표 연결

| Epic 지표 | 연결 |
|---|---|
| 지표 1 — AI 추출값 ↔ 폼 적용값 완전 일치 | 직접 담당 |
| 지표 2 — AI_EXTRACT 이전 완성 수치 미노출 | 직접 담당 |
| 지표 3 — 3개 이상 시나리오 세트 순환 | 직접 담당 |
| 지표 4 — 라이트/다크 팔레트 | F1 완료 |
| 지표 5 — hit-area 위치 정확도 | F4 담당 |

## 4. 의존성

| 관계 | 타입 | 실행 규칙 |
|---|:---:|---|
| F2 ↔ F4 | ✓ | 병렬 가능. 단 `order-form/index.tsx` 충돌 시 TASK 순서 조정 |
| F2 → F3 | → | F3는 F2 schema 위에서 `OPTION_FEE_MAP` 추가 |
| F5 → F2 | → | F5 archived 완료 후 `jsonViewerOpen` 잔재 처리 가능 |

## 5. 상태 라인

| 시점 | Epic 상태 | F2 Feature 상태 |
|---|---|---|
| 2026-04-24 IDEA/Screen/Draft | active | approved |
| 2026-04-24 PRD Review | active | approved, Bridge 대기 |
| 2026-04-24 Bridge | active | active feature context 생성 |
| 다음 `/dev-feature` 이후 | active | TASK 정의 대기 |

## 6. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-24 | Bridge 생성 — F2 active feature context와 Epic binding 작성. |
