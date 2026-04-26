# Ideas Backlog

> `.plans/ideas/` 의 모든 IDEA 를 한 눈에 볼 수 있는 인덱스. 상태별 이동 (`00-inbox → 10-screening → 20-approved → 90-archive`) 시 이 파일의 "위치" 컬럼을 함께 갱신한다.

## 마지막 채번

| 날짜 | 마지막 NNN |
|---|:---:|
| 2026-04-23 | 002 |
| 2026-04-24 | 002 |

## IDEA 목록

| ID | 제목 | 카테고리 | 상태 | 등록일 | 위치 | 파일 | Epic |
|---|---|---|---|---|---|---|---|
| IDEA-20260423-001 | F5 UI 잔재 정리 (AiExtractJsonViewer 숨김 + '자동 배차 대기' 라벨) | improvement | approved | 2026-04-23 | `00-inbox` | [링크](00-inbox/IDEA-20260423-001.md) | [EPIC-20260422-001](../epics/20-active/EPIC-20260422-001/00-epic-brief.md) |
| IDEA-20260423-002 | F1 라이트 모드 전환 인프라 (토큰 이중화 + ThemeProvider) | improvement | approved | 2026-04-23 | `00-inbox` | [링크](00-inbox/IDEA-20260423-002.md) | [EPIC-20260422-001](../epics/20-active/EPIC-20260422-001/00-epic-brief.md) |
| IDEA-20260424-002 | F4 레이아웃 정비 + Hit-Area 재정렬 | feature | archived | 2026-04-24 | `archive/f4-layout-hit-area-realignment/sources/ideas` | [링크](../archive/f4-layout-hit-area-realignment/sources/ideas/IDEA-20260424-002.md) | [EPIC-20260422-001](../epics/20-active/EPIC-20260422-001/00-epic-brief.md) |

---

## 상태 범례

- `inbox`: 수집만 된 상태 (아직 screening 미진행)
- `screening`: RICE 스크리닝 진행 중
- `approved`: Go 판정 완료, draft 대기 또는 진행 중
- `archived`: Feature 완료 및 아카이브
- `killed`: Kill 판정
- `held`: Hold 판정 (보류)

## 변경 이력

| 날짜 | 변경 |
|---|---|
| 2026-04-23 | 초안 — IDEA-20260423-001 (F5) 최초 등록, Epic EPIC-20260422-001 자식 |
| 2026-04-23 | IDEA-20260423-002 (F1) 등록, Epic EPIC-20260422-001 자식 — 마지막 채번 002 |
| 2026-04-23 | IDEA-20260423-001 (F5) 상태 `inbox → screened` — RICE 5.95, Go 제안, Lite 확정 (Phase A Step 4). Epic 링크 `00-draft → 10-planning` 동기 |
| 2026-04-23 | IDEA-20260423-001 (F5) 상태 `screened → approved` — 사용자 Go 승인 (Phase A Step 4 완료 for F5) |
| 2026-04-23 | IDEA-20260423-002 (F1) 상태 `inbox → screened` — RICE 1.89 (raw Kill, Standard Lane 가중 Go), Go 제안, Standard 확정 (Phase A Step 4). Epic 링크 `00-draft → 10-planning` 동기 |
| 2026-04-23 | IDEA-20260423-002 (F1) 상태 `screened → approved` — 사용자 Go 승인 (Phase A Step 4 완료) |
| 2026-04-24 | IDEA-20260424-002 (F4) screening Go 승인 + draft 생성 (`f4-layout-hit-area-realignment`) |
| 2026-04-27 | IDEA-20260424-002 (F4) 상태 `approved → archived` — DOMRect hit-area 보강, browser spot check, archive bundle 생성 및 sources 이동 |
