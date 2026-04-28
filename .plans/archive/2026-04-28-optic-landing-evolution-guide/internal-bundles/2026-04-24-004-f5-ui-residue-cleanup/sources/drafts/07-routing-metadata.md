# Routing Metadata — f5-ui-residue-cleanup

> **schema_version**: 1.0
> **Feature slug**: `f5-ui-residue-cleanup`
> **IDEA**: [IDEA-20260423-001](../../ideas/00-inbox/IDEA-20260423-001.md)
> **Epic**: [EPIC-20260422-001](../../epics/20-active/EPIC-20260422-001/00-epic-brief.md)
> **Draft**: [01-draft.md](./01-draft.md)
> **작성일**: 2026-04-23
> **작성자**: `plan-draft-writer` (Phase A Step 5)

---

## 1. 판정 결과 (JSON)

```json
{
  "schema_version": "1.0",
  "slug": "f5-ui-residue-cleanup",
  "idea_id": "IDEA-20260423-001",
  "epic_id": "EPIC-20260422-001",
  "category": "Lite",
  "scenario": "B",
  "feature_type": "dev",
  "hybrid": false,
  "copy_needed": false,
  "reference_needed": false,
  "prd_required": false,
  "epic_binding": "EPIC-20260422-001",
  "triggers_matched": [],
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
| `category` | `"Lite"` | 6 트리거 중 매칭 0 건. 아키텍처 변경 ✗ / API ✗ / DB 스키마 ✗ / 보안 ✗ / 도메인 2+ ✗ / 구현 1주+ ✗ (Effort 2 인·일). IDEA §8-5 + 본 Draft §1. |
| `scenario` | `"B"` | copy 도메인 활성 프로젝트 (`domains: core, dev, plan, copy`). Phase 3 부분 구현 (2026-04-22 archived) → 완성 정리 맥락. 단 `feature_type: dev` 이므로 copy 파이프라인 미진입 — 기록용. |
| `feature_type` | `"dev"` | 시각 차이 닫기(copy)가 아닌 **렌더 경로 제외 · mock 엔트리 제거 · 라벨 문자열 치환**. 사용자 피드백 직접 반영 — 레퍼런스 캡처 불필요. |
| `hybrid` | `false` | dev + 레퍼런스 시그널 없음. IDEA frontmatter `reference-needed: true` 없음, SCREENING `hybrid-candidate: true` 없음. 본문 키워드 (레퍼런스 캡처 필요/기존 사이트 참조/디자인 기반/시각 참조) 모두 없음. |
| `copy_needed` | `false` | `feature_type: dev` → copy 도메인 커맨드 (`/copy-reference-refresh`, `/copy-visual-review` 등) 미사용. |
| `reference_needed` | `false` | evidence 캡처 불필요. Hybrid false 도 함께 확정. |
| `prd_required` | `false` | Lite Lane → `/plan-prd` 생략 가능 (IDEA §7 다음 단계 3, Epic Phase A §6). |
| `epic_binding` | `"EPIC-20260422-001"` | Phase A 자식 Feature, Epic Children `01-children-features.md` F5 행. Feature Package 생성 시 `08-epic-binding.md` 에 반영. |
| `triggers_matched` | `[]` | Lite 유지. 모든 트리거 미매칭. |
| `entryPoint` | `"P3-plan-draft"` | 정규 파이프라인 진입. Blueprint Fast-Track 아님 (IDEA 태그에 `blueprint-import` 없음). |
| `post_wireframe_path` | `null` | `/plan-design`·`/plan-stitch` 미실행 상태. 향후 Checkpoint 가 갱신. F5 는 와이어프레임 불필요 (Epic Phase A §7 "F1·F5 둘 다 불필요 판단"). |
| `override` | `null` | 사용자 오버라이드 없음. 본 Draft 에서 모든 판정 합의. |

---

## 3. 경로 분기 (다음 단계)

**Lite + dev + hybrid=false** → `/dev-feature` **직행 가능** (Epic 컨텍스트 상 `/plan-bridge` 거쳐 개발 핸드오프).

본 프로젝트의 Epic Phase A §7 로드맵 기준:

```bash
/plan-bridge f5-ui-residue-cleanup     # Step 7 — 개발 핸드오프 (00-context 4종 + 08-epic-binding)
/dev-feature .plans/features/active/f5-ui-residue-cleanup/   # Step 9 — Feature Package 전환
```

`/plan-prd` 는 `prd_required: false` 로 **생략**. 사용자가 Standard 로 상향 판정할 경우에만 `/plan-prd .plans/drafts/f5-ui-residue-cleanup/` 삽입.

---

## 4. 연계 커맨드·에이전트 힌트

- **Phase A Step 7** — `plan-bridge-writer` 에이전트 (IMP-KIT-004)
  - `00-context/` 4 종 생성 (01-overview, 02-scope, 03-dependencies, 04-decisions)
  - `08-epic-binding.md` 생성 (Epic ↔ Feature cross-reference, IMP-AGENT-010)
  - Spike 모드 불필요 (Lite Lane)
- **Phase A Step 9** — `dev-implementer` 에이전트 (IMP-AGENT-005)
  - TASK ID 패턴: `T-CLEANUP-{NN}` (예: T-CLEANUP-01 ~ T-CLEANUP-04, `task-id-naming.md` IMP-KIT-015 dev 패턴 준수)
  - TDD 자율 루프: RED → GREEN → IMPROVE (`dev-tdd-guard.js` 활성)
  - Feature Scope Guard: `dev-feature-scope-guard.js` 가 범위 밖 편집 경고

---

## 5. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-23 | 초안 — 3 중 판정 확정 (Lite / B / dev / hybrid false) + 필드 상세 + 경로 분기 (Phase A Step 5, F5 부분) |
