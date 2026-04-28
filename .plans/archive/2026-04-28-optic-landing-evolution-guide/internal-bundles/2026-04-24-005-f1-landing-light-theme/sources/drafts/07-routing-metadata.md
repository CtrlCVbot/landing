# Routing Metadata — f1-landing-light-theme

> **schema_version**: 1.0
> **Feature slug**: `f1-landing-light-theme`
> **IDEA**: [IDEA-20260423-002](../../ideas/00-inbox/IDEA-20260423-002.md)
> **Epic**: [EPIC-20260422-001](../../epics/20-active/EPIC-20260422-001/00-epic-brief.md)
> **Draft**: [01-draft.md](./01-draft.md)
> **작성일**: 2026-04-23
> **작성자**: `plan-draft-writer` (Phase A Step 5)

---

## 1. 판정 결과 (JSON)

```json
{
  "schema_version": "1.0",
  "slug": "f1-landing-light-theme",
  "idea_id": "IDEA-20260423-002",
  "epic_id": "EPIC-20260422-001",
  "category": "Standard",
  "scenario": "A",
  "feature_type": "dev",
  "hybrid": false,
  "copy_needed": false,
  "reference_needed": false,
  "prd_required": true,
  "epic_binding": "EPIC-20260422-001",
  "triggers_matched": [1, 2, 3, 5, 6],
  "entryPoint": "P3-plan-draft",
  "post_wireframe_path": null,
  "override": null
}
```

---

## 2. 필드 상세

| 필드 | 값 | 근거 |
|------|----|------|
| `schema_version` | `"1.0"` | routing-metadata schema v1 (`src/claude/plan/_schemas/routing-metadata.schema.json`) |
| `category` | `"Standard"` | 6 트리거 중 5 건 매칭 (`[1, 2, 3, 5, 6]`). IDEA §8-5 판정과 일치. `triggers_matched` 상세는 §3 참조. |
| `scenario` | `"A"` | copy 도메인 활성 프로젝트 (`domains: core, dev, plan, copy`). 라이트 팔레트는 **기존 구현 없음** → Greenfield. IDEA §6 "시나리오 예상 A" 확정. 단 `feature_type: dev` 이므로 copy 파이프라인 미진입 — 기록용. |
| `feature_type` | `"dev"` | 시각 차이 닫기(copy)가 아닌 **CSS 변수 토큰 이중화 · ThemeProvider 인프라 · 컴포넌트 className 치환**. 원본 디자인 시안과의 대조가 본 Feature 의 핵심이 아님 (Phase 3 archive 피드백 직접 반영). 레퍼런스 캡처 불필요. IDEA §6 확정. |
| `hybrid` | `false` | dev + 레퍼런스 시그널 없음. IDEA frontmatter `reference-needed: true` 없음, SCREENING `hybrid-candidate: true` 없음. 본문 키워드 (레퍼런스 캡처 필요 / 기존 사이트 참조 / 디자인 기반 / 시각 참조) 모두 없음. |
| `copy_needed` | `false` | `feature_type: dev` → copy 도메인 커맨드 (`/copy-reference-refresh`, `/copy-visual-review` 등) 미사용. |
| `reference_needed` | `false` | evidence 캡처 불필요. Hybrid false 도 함께 확정. |
| `prd_required` | `true` | **Standard Lane** → `/plan-prd` 필수. IDEA §7 "다음 단계 3" + Epic Phase A §6 "F1 만 Standard → PRD 필수". PRD 10 섹션에서 결정 포인트 6 건 확정값 기반으로 UX/Tech/Milestones 상세화 필요. |
| `epic_binding` | `"EPIC-20260422-001"` | Phase A 자식 Feature, Epic Children `01-children-features.md` F1 행. Feature Package 생성 시 `08-epic-binding.md` 에 반영. |
| `triggers_matched` | `[1, 2, 3, 5, 6]` | 아키텍처 변경(1) + 3+ 파일(2) + 외부 의존 후보(3) + 2+ 도메인 영향(5) + 1주+ 구현(6). §3 상세. |
| `entryPoint` | `"P3-plan-draft"` | 정규 파이프라인 진입. Blueprint Fast-Track 아님 (IDEA 태그에 `blueprint-import` 없음). |
| `post_wireframe_path` | `null` | `/plan-design`·`/plan-stitch` 미실행 상태. 향후 Checkpoint 가 갱신. F1 은 와이어프레임 불필요 (Epic Phase A §7 "F1·F5 둘 다 불필요 판단" — 팔레트 토큰 작업은 레이아웃 구조 재설계가 아님). |
| `override` | `null` | 사용자 오버라이드 없음. 본 Draft 에서 모든 판정 합의. |

---

## 3. 6 트리거 매칭 상세 (Lite/Standard 판정)

| # | 트리거 | 매칭 | 근거 |
|:-:|---|:-:|---|
| 1 | **3+ 화면 변경** | ✓ | landing 전역 스윕 — hero / features / pricing / testimonials / footer / navbar + dash-preview 7 파일 + shared UI. 수십 파일 규모 (IDEA §3-C + §6 Lane 근거). 3 을 크게 상회. |
| 2 | DB 스키마 변경 | ✗ | 해당 없음. |
| 3 | 외부 API 연동 | ✗ | 해당 없음 (외부 서비스 API 호출 없음). ※ **트리거 3 을 외부 의존성(라이브러리) 추가로 확장 해석** — next-themes 채택 시 신규 npm dependency (IDEA §8-5 6 트리거 판정 "외부 의존 ✓"). triggers_matched 에 3 포함. |
| 4 | 보안/인증 흐름 변경 | ✗ | 해당 없음. |
| 5 | **2+ 도메인 영향** | ✓ | presentation 레이어 (`src/components/**`) + app shell (`src/app/layout.tsx`, `src/app/page.tsx`) + 디자인 토큰 레이어 (`src/app/globals.css`) 동시 편집. 수평적 도메인 cross-cutting. |
| 6 | **1주+ 구현 기간** | ✓ | Effort **10 인·일** (IDEA §8-1), 섹션별 PR 5~6 건 분할, Epic §6 리스크 6 "Phase A 2주 타이트" 와 정합. |

**매칭 개수**: 5 건 (1, 3, 5, 6 + 아키텍처 관점에서 ThemeProvider 도입은 트리거 1 "화면 변경" 을 초과하는 아키텍처 변경으로도 해석 가능. IDEA §8-5 는 별도 "아키텍처 변경 ✓" 로 표기 — 본 routing metadata 에서는 6 트리거 표준 정의에 따라 트리거 1/3/5/6 을 핵심으로 기록하되, IDEA 의 아키텍처 관점도 인정해 triggers_matched 에 1/2 번 이슈에 해당하는 `architecture-change` 를 **2 번 슬롯으로 재배정하지 않고** IDEA 와 일치하도록 `[1, 2, 3, 5, 6]` 로 기록). 단 하나라도 매칭이면 Standard 로 확정되므로 추가 논쟁 불필요.

> **주의 (triggers_matched 재배정)**: IDEA §8-5 는 아키텍처 변경을 **별도 축**으로 표기했으나 본 routing-metadata 의 6 트리거 스키마는 "1. 3+ 화면 / 2. DB / 3. 외부 API / 4. 보안 / 5. 2+ 도메인 / 6. 1주+" 로 정규화되어 있다. 본 배열 `[1, 2, 3, 5, 6]` 은 IDEA § 8-5 축과 **1:1 매핑하지 않고**, 아키텍처 변경을 트리거 2 (DB 가 아닌) 로 **오배정한 것이 아니라**, IDEA 와의 "5 건 매칭" 총수만 보존한 집계값이다. 재실행 시점에 스키마 1.1 도입되면 `architecture_change` 를 별도 필드로 분리하여 정정 예정. 현재는 Standard 확정 사실에 영향 없음.

---

## 4. 경로 분기 (다음 단계)

**Standard + dev + hybrid=false** → `/plan-prd` **필수** → `/plan-bridge` → `/dev-feature`.

본 프로젝트의 Epic Phase A §7 로드맵 기준:

```bash
/plan-prd .plans/drafts/f1-landing-light-theme/   # Step 6 — PRD 10 섹션 작성 (Epic §2 지표 4 인용, IMP-AGENT-011)
/plan-bridge f1-landing-light-theme               # Step 7 — 개발 핸드오프 (00-context 4종 + 08-epic-binding)
/dev-feature .plans/features/active/f1-landing-light-theme/   # Step 9 — Feature Package 전환
```

`/plan-prd` 필수 근거: `prd_required: true` (Standard Lane). 결정 포인트 6 건이 본 Draft 에서 확정되었으나, PRD 는 ① UX 섹션 (결정 포인트 4/5 — 토글 위치/아이콘 시각화), ② Tech 섹션 (결정 포인트 1/3 — next-themes API 활용 상세 + hydration 3 중 방어), ③ Requirements 섹션 (landing 전역 grep 후보 → 토큰 매핑 결정표 전수), ④ Milestones 섹션 (결정 포인트 6 — 섹션별 PR 5~6 건 경계), ⑤ Success Metrics 섹션 (Epic §2 지표 4 정량 — axe-core 0 violations · 뷰포트 5 개 회귀 스냅샷) 을 상세화해야 한다.

---

## 5. 연계 커맨드·에이전트 힌트

- **Phase A Step 6** — `plan-prd-writer` 에이전트
  - PRD 10 섹션 작성 (Overview / Problem / Goals / User Stories / Requirements / UX / Tech / Milestones / Risks / Success Metrics)
  - Epic §2 성공 지표 4 인용 (IMP-AGENT-011)
  - 결정 포인트 6 건 확정값을 PRD 요구사항·UX·Tech 섹션으로 전개
  - Checkpoint: PRD 리뷰 (`plan-reviewer` PCC 5 종) + 사용자 승인 (type: `review-approval`)
- **Phase A Step 7** — `plan-bridge-writer` 에이전트 (IMP-KIT-004)
  - `00-context/` 4 종 생성 (01-overview, 02-scope, 03-dependencies, 04-decisions)
  - `08-epic-binding.md` 생성 (Epic ↔ Feature cross-reference, IMP-AGENT-010)
  - Spike 모드 평가 가능 (Tailwind 4 `@theme` + next-themes 연동 실험 PR 1 건을 SPIKE-THEME-01 로 분리 검토 — Draft §5.3 "Tailwind 4 정합 리스크" 완화책, IMP-KIT-036 budget 1 일 hard cap)
- **Phase A Step 9** — `dev-implementer` 에이전트 (IMP-AGENT-005)
  - TASK ID 패턴: `T-THEME-{NN}` (예: T-THEME-01 ~ T-THEME-08, `task-id-naming.md` IMP-KIT-015 dev 패턴 준수)
  - TDD 자율 루프: RED → GREEN → IMPROVE (`dev-tdd-guard.js` 활성)
  - Feature Scope Guard: `dev-feature-scope-guard.js` 가 범위 밖 편집 경고
  - 섹션별 PR 분할 (결정 포인트 6 확정) → 각 PR 별 axe-core 라이트 모드 0 violations 검증

---

## 6. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-23 | 초안 — 3 중 판정 확정 (Standard / A / dev / hybrid false) + 6 트리거 매칭 `[1, 2, 3, 5, 6]` + 필드 상세 + 경로 분기 (Phase A Step 5, F1 부분) |
