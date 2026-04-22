# Feature Context Index: dash-preview-phase3

> **Feature**: Dashboard Preview Phase 3 — Pixel-Perfect Preview + 조작감 10종
> **Slug**: `dash-preview-phase3`
> **Scope**: Standard
> **Scenario**: C (충실도 교정)
> **Feature Type**: Hybrid (reference-only)
> **Status**: Active — P7 Bridge (in-progress)
> **Created**: 2026-04-17
> **Last Updated**: 2026-04-17

---

## 0. 이 파일의 역할

Feature Package 전체 인덱스. 각 파일의 역할과 상태를 한 줄로 요약하여 **네비게이션 허브** 역할을 한다. 새 파일 추가 시 본 인덱스도 반드시 갱신.

---

## 1. Context Files (`00-context/`)

| # | 파일 | 상태 | 한 줄 설명 |
|---|------|------|-----------|
| 00 | [`00-index.md`](./00-index.md) | ✅ | 이 파일 (네비게이션 허브) |
| 01 | [`01-prd-freeze.md`](./01-prd-freeze.md) | ✅ | PRD 동결 — REQ-DASH3 001~074 절대 권위 |
| 02 | [`02-decision-log.md`](./02-decision-log.md) | ✅ | 기획 결정 요약 (P1~P5 + PCC/선결 질문 해소 이력) |
| 03 | [`03-bridge-wireframe.md`](./03-bridge-wireframe.md) | ✅ | wireframe ↔ 구현 매핑 (screens/components/navigation/decision-log → React 컴포넌트) |
| 04 | [`04-bridge-stitch.md`](./04-bridge-stitch.md) | ✅ | stitch skipped 기록 (Hybrid reference-only) |
| 05 | [`05-bridge-context.md`](./05-bridge-context.md) | ✅ | PRD ↔ wireframe ↔ 구현 3자 연결 맵 |
| 06 | [`06-architecture-binding.md`](./06-architecture-binding.md) | ✅ | 구조 SSOT + feature binding (apps/landing 내 dashboard-preview 확장) |
| 07 | [`07-routing-metadata.md`](./07-routing-metadata.md) | ✅ | 라우팅 판정 (Standard / C / Hybrid) |

---

## 2. Package Files (`02-package/`)

| # | 파일 | 상태 | 한 줄 설명 |
|---|------|------|-----------|
| 00 | [`02-package/00-overview.md`](../02-package/00-overview.md) | ✅ | Feature 요약 + 범위 + 의존성 + 일정 |
| 01 | [`02-package/01-requirements.md`](../02-package/01-requirements.md) | ✅ | 요구사항 SSOT (REQ-DASH 수정분 + REQ-DASH3 001~074) |
| 02 | [`02-package/02-ui-spec.md`](../02-package/02-ui-spec.md) | ✅ | UI 명세 (wireframe 기반, 3-column grid + 반응형 전략) |
| 06 | [`02-package/06-domain-logic.md`](../02-package/06-domain-logic.md) | ✅ | 상태 머신 + interactions 타이밍 트랙 (stateless props 기반, 최소화) |
| 08 | [`02-package/08-dev-tasks.md`](../02-package/08-dev-tasks.md) | ✅ | TASK 분해 (Spike + M1~M5, T-DASH3-NNN) |
| 09 | [`02-package/09-test-cases.md`](../02-package/09-test-cases.md) | ✅ | TDD 테스트 케이스 + legacy 격리 전략 |
| 10 | [`02-package/10-release-checklist.md`](../02-package/10-release-checklist.md) | ✅ | 릴리스 전 게이트 체크리스트 |

> 03-flow, 04-api-spec, 05-db-migration-spec, 07-error-handling: **해당 없음** (프론트엔드 전용, API/DB 없음).

---

## 3. Sources (원본 기획 산출물)

| 유형 | 경로 | 역할 |
|------|------|------|
| PRD (절대 권위) | [`01-prd-freeze.md`](./01-prd-freeze.md) | REQ 원문 |
| Wireframe screens | [`sources/wireframes/screens.md`](../sources/wireframes/screens.md) | Step × Viewport 매트릭스 ASCII |
| Wireframe components | [`sources/wireframes/components.md`](../sources/wireframes/components.md) | 컴포넌트 트리 + interactions 주입 지점 |
| Wireframe navigation | [`sources/wireframes/navigation.md`](../sources/wireframes/navigation.md) | 상태 전이 Mermaid + Gantt |
| Wireframe decision-log | [`sources/wireframes/decision-log.md`](../sources/wireframes/decision-log.md) | **mock 값 SSOT** (§4-3), AI_APPLY 안 B, 3-col C안, pre-filled 결정 |
| First-pass | [`drafts/dash-preview-phase3/first-pass.md`](../../../drafts/dash-preview-phase3/first-pass.md) | 1차 기획 (Standard 3중 판정 원본) |
| IDEA | [`ideas/20-approved/IDEA-20260417-001.md`](../../../../ideas/20-approved/IDEA-20260417-001.md) | 승인 IDEA |
| Screening | [`ideas/20-approved/SCREENING-20260417-001.md`](../../../../ideas/20-approved/SCREENING-20260417-001.md) | RICE 재평가 (70.0 / Go) |

---

## 4. External Authority (절대 권위 외부 문서)

| 문서 | 경로 | 비고 |
|------|------|------|
| Phase 1 스펙 | [`archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md`](../../../../archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md) | §3/§5/§6/§7/§11/§13/§14/§16 재복제 금지, 섹션 참조만 |
| Phase 1/2 요구사항 SSOT | [`archive/dash-preview/sources/feature-package/02-package/01-requirements.md`](../../../../archive/dash-preview/sources/feature-package/02-package/01-requirements.md) | REQ-DASH-001~045 원문 (Phase 3에서 REQ-DASH-NNN 수정 범위만 명시) |
| 원본 ai-register | `.references/code/mm-broker/app/broker/order/ai-register/` | source code 원본 (운영 URL 아님) |
| `register-form.tsx:939` | 원본 파일 | `grid grid-cols-1 lg:grid-cols-3 gap-4` 3-column 루트 |

---

## 5. Stage Manifest (파이프라인 진행 상태)

위치: [`.plans/stage-manifest.json`](../../../../stage-manifest.json)

| Stage | 상태 | 비고 |
|-------|------|------|
| P1 Idea | done (2026-04-17) | IDEA-20260417-001 |
| P2 Screen | done / review passed | RICE 70.0 / Go |
| P3 Draft | done (2026-04-17) | Standard / C / Hybrid 3중 판정 |
| P4 PRD | done / review passed | REQ-DASH3 001~074, PCC 7/7 pass |
| P5 Wireframe | done / review passed | Step × Viewport 매트릭스, AI_APPLY 안 B 확정, PCC-04 28/28 |
| P6 Stitch | **skipped** | Hybrid reference-only (외부 HTML 시안 없음) |
| P7 Bridge | **in-progress** | 본 작업 |

---

## 6. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-04-17 | 초안 — 12개 신규 파일 + stage-manifest.json 인덱스, P1~P5 done, P6 skipped, P7 in-progress 등록 |
