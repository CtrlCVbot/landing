# Ideas Backlog

> `.plans/ideas/` 의 모든 IDEA 를 한 눈에 볼 수 있는 인덱스. 상태별 이동 (`00-inbox → 10-screening → 20-approved → 90-archive`) 시 이 파일의 "위치" 컬럼을 함께 갱신한다.

## 마지막 채번

| 날짜 | 마지막 NNN |
|---|:---:|
| 2026-04-23 | 002 |
| 2026-04-24 | 002 |
| 2026-04-27 | 004 |
| 2026-04-28 | 001 |

## IDEA 목록

| ID | 제목 | 카테고리 | 상태 | 등록일 | 위치 | 파일 | Epic |
|---|---|---|---|---|---|---|---|
| IDEA-20260423-001 | F5 UI 잔재 정리 (AiExtractJsonViewer 숨김 + '자동 배차 대기' 라벨) | improvement | archived | 2026-04-23 | `archive/f5-ui-residue-cleanup/sources/ideas` | [링크](../archive/f5-ui-residue-cleanup/sources/ideas/IDEA-20260423-001.md) | [EPIC-20260422-001](../epics/20-active/EPIC-20260422-001/00-epic-brief.md) |
| IDEA-20260423-002 | F1 라이트 모드 전환 인프라 (토큰 이중화 + ThemeProvider) | improvement | archived | 2026-04-23 | `archive/f1-landing-light-theme/sources/ideas` | [링크](../archive/f1-landing-light-theme/sources/ideas/IDEA-20260423-002.md) | [EPIC-20260422-001](../epics/20-active/EPIC-20260422-001/00-epic-brief.md) |
| IDEA-20260424-001 | F2 Mock 스키마 재설계 | feature | archived | 2026-04-24 | `archive/f2-mock-schema-redesign/sources/ideas` | [링크](../archive/f2-mock-schema-redesign/sources/ideas/IDEA-20260424-001.md) | [EPIC-20260422-001](../epics/20-active/EPIC-20260422-001/00-epic-brief.md) |
| IDEA-20260424-002 | F4 레이아웃 정비 + Hit-Area 재정렬 | feature | archived | 2026-04-24 | `archive/f4-layout-hit-area-realignment/sources/ideas` | [링크](../archive/f4-layout-hit-area-realignment/sources/ideas/IDEA-20260424-002.md) | [EPIC-20260422-001](../epics/20-active/EPIC-20260422-001/00-epic-brief.md) |
| IDEA-20260427-001 | Hero 섹션 interactive liquid gradient 배경 도입 | improvement | archived | 2026-04-27 | `archive/hero-liquid-gradient-background/sources/ideas` | [링크](../archive/hero-liquid-gradient-background/sources/ideas/IDEA-20260427-001.md) | - |
| IDEA-20260427-002 | F3 옵션↔추가요금 파생 로직 | feature | screened | 2026-04-27 | `10-screening` | [링크](10-screening/IDEA-20260427-002.md) | [EPIC-20260422-001](../epics/20-active/EPIC-20260422-001/00-epic-brief.md) |
| IDEA-20260427-003 | Dash Preview 단계별 포커스 줌 애니메이션 | improvement | archived | 2026-04-27 | `archive/dash-preview-focus-zoom-animation/sources/ideas` | [링크](../archive/dash-preview-focus-zoom-animation/sources/ideas/IDEA-20260427-003.md) | - |
| IDEA-20260427-004 | hero-01 레퍼런스 기반 Hero 섹션 재개선 | improvement | archived | 2026-04-27 | `archive/hero-01-reference-hero-refresh/sources/ideas` | [링크](../archive/hero-01-reference-hero-refresh/sources/ideas/IDEA-20260427-004.md) | - |
| IDEA-20260428-001 | F1 브랜드, 로고, CTA 최소 반영 | improvement | approved | 2026-04-28 | `20-approved` | [링크](20-approved/IDEA-20260428-001.md) | [EPIC-20260428-001](../epics/10-planning/EPIC-20260428-001/00-epic-brief.md) |

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
| 2026-04-24 | IDEA-20260423-001 (F5), IDEA-20260423-002 (F1) 상태 `approved → archived` — Phase A archive bundle 생성 및 sources 이동 |
| 2026-04-24 | IDEA-20260424-001 (F2), IDEA-20260424-002 (F4) 등록 — Phase B 착수 입력 생성, 마지막 채번 002 |
| 2026-04-24 | IDEA-20260424-001 (F2) screening Go 승인 + draft 생성 (`f2-mock-schema-redesign`) |
| 2026-04-24 | IDEA-20260424-001 (F2), IDEA-20260424-002 (F4) PRD 작성 및 PRD review 완료 — 두 리뷰 모두 Approve, critical/high 없음. Bridge 대기 상태로 전환 |
| 2026-04-24 | IDEA-20260424-002 (F4), IDEA-20260424-001 (F2) Bridge 완료 — active feature `00-context` 생성, 다음 단계 `/dev-feature` |
| 2026-04-27 | IDEA-20260424-001 (F2) 상태 `approved → archived` — mock schema 재설계, random scenario rotation, staged apply timing 구현 및 archive bundle 생성 |
| 2026-04-27 | IDEA-20260427-001 신규 등록: Hero 배경 전용 interactive liquid gradient 탐색 아이디어 |
| 2026-04-27 | IDEA-20260427-001 상태 `new → screened` — RICE 59.1, Hold 제안, Lite lane |
| 2026-04-27 | IDEA-20260427-001 사용자 override 승인 + draft/bridge/dev 진행 (`hero-liquid-gradient-background`) |
| 2026-04-27 | IDEA-20260427-001 상태 `screened → archived` — hero liquid gradient 구현, theme 대응, animation QA evidence 포함 archive bundle 생성 |
| 2026-04-27 | IDEA-20260427-002 신규 등록: F3 옵션↔추가요금 파생 로직 — Epic EPIC-20260422-001 Phase C 착수 |
| 2026-04-27 | IDEA-20260427-002 상태 `new → screened` — RICE-style weighted score 77.8, Go 제안, Lite lane, 사용자 승인 대기 |
| 2026-04-27 | IDEA-20260427-003 신규 등록: Dash Preview 단계별 포커스 줌 애니메이션 — 기존 dash-preview 후속 improvement |
| 2026-04-27 | IDEA-20260427-003 상태 `new → screened` — RICE-style weighted score 73.8, Go 제안, Lite lane, 사용자 승인 대기 |
| 2026-04-27 | IDEA-20260427-003 사용자 Go 승인 — 상태 `screened → approved`, `20-approved` 이동 |
| 2026-04-27 | IDEA-20260427-003 draft 생성 — `dash-preview-focus-zoom-animation`, 다음 단계 `/plan-prd` |
| 2026-04-27 | IDEA-20260427-003 PRD 작성 및 PRD review 완료 — PASS with noted follow-up, Lite gate 확인 후 `/dev-feature` 직행 |
| 2026-04-28 | IDEA-20260427-003 `/dev-feature` Phase A/B/C 완료 — active feature package 생성, 다음 단계 `/dev-run` |
| 2026-04-28 | IDEA-20260427-003 dev 구현 검증 완료 및 `/plan-archive` 실행 -> `archive/dash-preview-focus-zoom-animation/ARCHIVE-FZ.md` |
| 2026-04-27 | IDEA-20260427-004 신규 등록: `hero-01` 레퍼런스 기반 Hero 섹션 재개선 — `hero-liquid-gradient-background` 후속 visual copy fidelity improvement |
| 2026-04-27 | IDEA-20260427-004 상태 `new → approved` — RICE-style weighted score 79.8, Go, Standard lane, 사용자 `go` 승인 반영 |
| 2026-04-27 | IDEA-20260427-004 draft 생성 — `hero-01-reference-hero-refresh`, Scenario C, copy-dev hybrid, 다음 단계 `/plan-prd` |
| 2026-04-28 | IDEA-20260427-004 PRD 작성 및 PRD review 완료 — PASS with noted follow-up, 다음 단계 `/plan-wireframe` |
| 2026-04-28 | IDEA-20260427-004 wireframe 작성 및 review 완료 — Desktop/Tablet/Mobile/Reduced motion, 다음 단계 `/plan-bridge` |
| 2026-04-28 | IDEA-20260427-004 `/plan-bridge` 완료 — active feature context/package 생성, 다음 단계 `/dev-run` |
| 2026-04-28 | IDEA-20260427-004 상태 `approved → archived` — Hero 색감 개선 구현, 사용자 승인, `c06cd06`/`24afa8a` push, P8 archive bundle 생성 |
| 2026-04-28 | IDEA-20260428-001 신규 등록: EPIC-20260428-001 F1 브랜드, 로고, CTA 최소 반영 — 다음 단계 `/plan-screen` |
| 2026-04-28 | IDEA-20260428-001 상태 `new → screened` — RICE-style weighted score 76.35, Go 제안, Lite lane, 사용자 승인 대기 |
| 2026-04-28 | IDEA-20260428-001 사용자 Go 승인 — 상태 `screened → approved`, `20-approved` 이동 |
| 2026-04-28 | IDEA-20260428-001 draft 생성 — `f1-optic-brand-cta`, Lite lane, 다음 단계 scope 확인 후 `/plan-bridge` 또는 dev handoff |
| 2026-04-28 | IDEA-20260428-001 Bridge 완료 — active feature context 생성, 다음 단계 `/dev-feature` |
