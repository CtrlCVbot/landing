# 08. Epic Binding — F4 레이아웃 정비 + Hit-Area 재정렬

> Feature ↔ Epic cross-reference. 본 파일과 Epic `01-children-features.md` F4 섹션이 양방향 링크 관계다.

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

## 2. F4의 Epic 내 위치

| 항목 | 값 |
|---|---|
| Phase | Phase B — 핵심 스키마 + 레이아웃 정확도 |
| Lane | Standard |
| Feature type | dev |
| Scenario | B |
| Hybrid | false |
| 병렬 Feature | F2 Mock 스키마 재설계 |
| 다음 단계 | F2 Mock 스키마 재설계 구현 |

## 3. Epic 성공 지표 연결

| Epic 지표 | 연결 |
|---|---|
| 지표 5 — 18개 hit-area 위치 정확도 | 직접 담당 |
| 지표 1 — AI 추출값 ↔ 폼 적용값 일치 | F2 담당, F4는 직접 담당 아님 |
| 지표 2 — AI_EXTRACT 이전 수치 미노출 | F2 담당 |
| 지표 3 — 시나리오 세트 | F2 담당 |
| 지표 4 — 라이트/다크 팔레트 | F1 완료 |

## 4. 의존성

| 관계 | 타입 | 실행 규칙 |
|---|:---:|---|
| F2 ↔ F4 | ✓ | 병렬 가능. 단 `order-form/index.tsx`가 겹치면 binding 갱신 후 조정 |
| F4 ↔ F5 | ✓ | F5 archived 후 진행. hit-area 단일 엔트리 제거와 F4 좌표 재측정은 시간 분리됨 |
| F4 ↔ F1 | △ | F1 theme sweep archived 후 진행하므로 현재 충돌 없음 |

## 5. 상태 라인

| 시점 | Epic 상태 | F4 Feature 상태 |
|---|---|---|
| 2026-04-24 IDEA/Screen/Draft | active | approved |
| 2026-04-24 PRD Review | active | approved, Bridge 대기 |
| 2026-04-24 Bridge | active | active feature context 생성 |
| 2026-04-27 Archive 이후 | active | archived |

## 6. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-24 | Bridge 생성 — F4 active feature context와 Epic binding 작성. |
| 2026-04-24 | `/dev-run` 완료 — DateTime 2열, 18 bounds 재정렬, overlay anchor 내부 이동, local verification PASS. |
| 2026-04-24 | `/dev-verify` 완료 — build/typecheck/lint/test PASS with warnings, archive 준비 상태. |
| 2026-04-24 | D-F4-010 반영 — `data-hit-area-id` target DOMRect 우선 측정으로 tooltip/hit-area 위치 기준 전환, 990 tests PASS. |
| 2026-04-27 | D-F4-011 반영 — 첫 측정 전 fallback hit-area 미렌더, browser spot check 1440/1024/768 PASS. |
| 2026-04-27 | Archive 완료 — `ARCHIVE-F4.md` 생성 및 sources 이동. |
