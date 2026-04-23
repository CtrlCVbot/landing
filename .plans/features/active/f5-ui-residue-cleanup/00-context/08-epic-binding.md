# 08. Epic Binding — F5 UI 잔재 정리

> Feature ↔ Epic cross-reference (IMP-AGENT-010). 본 파일과 Epic `01-children-features.md` F5 섹션이 **양방향 링크** 관계. 불일치 시 `plan-epic-integrity.js` (Phase 3 enable 예정) 경고.
> 연계 룰: [`.claude/rules/plan-epic-hierarchy.md` §8 Epic ↔ Feature Binding](../../../../../.claude/rules/plan-epic-hierarchy.md)

---

## 1. Epic 메타

| 항목 | 값 |
|------|---|
| **Epic ID** | `EPIC-20260422-001` |
| **Epic 제목** | dash-preview Phase 4 — Phase 3 피드백 반영 |
| **Epic 상태** | `active` (2026-04-23 기준, Phase A Step 3 `draft → planning` 전이 + Step 8 `planning → active` 전이 완료) |
| **Epic 기간** | 2026-04-23 ~ 2026-05-20 (예상, 약 4주) |
| **Epic 파일** | [`../../../../epics/20-active/EPIC-20260422-001/00-epic-brief.md`](../../../../epics/20-active/EPIC-20260422-001/00-epic-brief.md) |
| **Children 파일** | [`../../../../epics/20-active/EPIC-20260422-001/01-children-features.md`](../../../../epics/20-active/EPIC-20260422-001/01-children-features.md) |

---

## 2. F5 의 Epic 내 위치

| 항목 | 값 |
|------|---|
| **Phase 소속** | **Phase A** (2026-04-23 ~ 2026-05-06, 약 2주) — 기반 정리 + 라이트 모드 |
| **자매 Feature (Phase A)** | [F1 — 라이트 모드 전환 인프라 (landing 전역)](../../../../ideas/00-inbox/IDEA-20260423-002.md) |
| **자매 Feature (Phase B, 대기)** | F2 (Mock 스키마 재설계), F4 (레이아웃+Hit-Area) |
| **자매 Feature (Phase C, 대기)** | F3 (옵션↔추가요금 파생) |
| **Lane** | **Lite** (Draft §1 확정) |
| **Feature 유형** | **dev** (copy 파이프라인 미진입) |
| **시나리오** | **B (Partial)** — copy 도메인 활성 프로젝트 convention 에 따른 기록. `feature_type: dev` 로 copy 커맨드 미사용. |
| **Hybrid** | **false** (`/copy-reference-refresh --reference-only` 불필요) |
| **예상 TASK** | T-CLEANUP-01 ~ T-CLEANUP-04 (4 건, 상세는 `04-implementation-hints.md`) |
| **예상 총 소요** | 약 1.75 ~ 2 인·일 |

---

## 3. Epic §2 성공 지표 연결 (간접 지원)

Epic 5 대 성공 지표 중 **지표 2** (AI_EXTRACT 이전 단계 미노출) + **지표 3** (3 개 이상 시나리오 세트 순환) 에 **간접 연결**.

### 3-1. Epic 지표 2 — AI_EXTRACT 이전 단계에서 완성 수치 미노출

- **F5 의 기여 (간접)**: 본 Feature 가 제거하는 `<AiExtractJsonViewer>` 는 "AI 추출 이전 단계에 미리 보이는 내부 디버그 UI" 의 대표 사례. 화면 비노출로써 AI_EXTRACT 내러티브 진입 전 **미완성 상태 은폐** 의 선행 정리 효과.
- **직접 지표 달성은 F2 담당**: Step 미만일 때 `EstimateInfoCard`·`SettlementSection` 의 placeholder/미렌더 구현은 F2 의 Step 기반 `visible` prop 이 수행. F5 는 "디버그 JSON 을 먼저 치운다" 의 부수 효과만.

### 3-2. Epic 지표 3 — 3 개 이상 시나리오 세트 순환

- **F5 의 기여 (간접, 선행 조건)**: F2 가 `extractedFrame`/`appliedFrame` 분리 스키마 + `PREVIEW_MOCK_SCENARIOS` 배열을 도입할 때, F5 가 `jsonViewerOpen` 필드와 관련 tooltip/hit-area 엔트리를 **선행 정리한 mock-data.ts 기반** 위에 얹힘.
- **`jsonViewerOpen` mock 필드 유지 근거**: F5 는 필드를 **제거하지 않고 유지** → F2 가 `extractedFrame` 또는 `appliedFrame` 내부 속성으로 이관. **F5 에서 필드를 삭제하면 F2 의 사전 작업이 파괴됨** (Epic 의존성 매트릭스 F2↔F5 `→` 의 핵심 근거).

### 3-3. 직접 지원하지 않는 지표

- **지표 1** (AI 추출값 ↔ 폼 적용값 완전 일치): F2 담당. F5 무관.
- **지표 4** (라이트/다크 양 팔레트): F1 담당. F5 무관.
- **지표 5** (hit-area 위치 정확도 ≤ 2px): F4 담당. F5 는 hit-area 단일 엔트리 **제거** 만 수행 (좌표 재측정 범위 아님).

---

## 4. Epic 의존성 매트릭스 §2 인용

Epic `01-children-features.md` §2 의존성 매트릭스에서 F5 행·열 관계:

| 관계 | 타입 | 의미 | 실행 순서 |
|------|:---:|------|----------|
| **F1 ↔ F5** | **✓** | 완전 독립 병렬 가능 | Phase A 동시 진행 (F1 은 Standard, F5 는 Lite) |
| **F2 ↔ F5** | **→** | F5 먼저, F2 나중 (순차 필수) | **F5 는 Phase A 에서 완료** 되어야 F2 가 Phase B 에서 `jsonViewerOpen` 이관 가능. F5 를 Kill/지연 시 F2 리스크 2 (테스트 대량 갱신) 증가 |
| **F3 ↔ F5** | **✓** | 완전 독립 병렬 | 파일 범위 겹침 없음. Phase A/C 시간 분리. |
| **F4 ↔ F5** | **✓** | 완전 독립 병렬 | F4 는 `hit-areas.ts` 전 좌표 재측정, F5 는 단일 엔트리 제거. Phase A/B 시간 분리. |

### 핵심 의존성: F2↔F5 순차 (**→**)

**근거 (Epic Children §2 주요 근거 F2↔F5 행 인용)**:

> F5 가 `ai-panel/index.tsx` 렌더 · `hit-areas.ts` · `mock-data.ts` tooltip 엔트리를 먼저 정리 → F2 의 `extractedFrame` / `appliedFrame` 스키마는 정리된 mock-data 기반 위에서 설계. `jsonViewerOpen` 필드는 F5 에서 유지 → F2 재설계 시 스키마 내부로 일괄 이관. (Phase A 에 F5 배치, Phase B 에 F2 배치.)

**영향**:
- F5 를 Phase A 내 조기 완료 시 F2 의 Phase B 착수 리스크 감소
- F5 지연은 Epic Phase B (2026-05-01 ~ 2026-05-14) M-Epic-2 마일스톤 슬립 가능성 증가
- 따라서 **F5 는 Phase A 의 독립 완료 가능 항목** — F1 지연과 무관하게 선행 완료 가능

---

## 5. Phase A 로드맵 Step 9 — TeamCreate 팀 소속

Epic Children §4 Phase A 실행 로드맵 Step 9 의 TeamCreate 팀 구성에서 F5 는 아래 팀에 소속:

| 항목 | 값 |
|------|---|
| **팀 이름** | `dash-preview-phase4-phase-a` |
| **팀 구성 (예정)** | `dev-implementer` × 2 인 (F1 1인 + F5 1인) |
| **F5 담당 에이전트** | `dev-implementer` (IMP-AGENT-005, TASK 별 TDD 자율 루프 RED → GREEN → IMPROVE) |
| **병렬 구조** | F1 + F5 동시 진행, Feature Package 경로 독립 |

**메인 세션 Team 구성 예시** (사용자가 Step 9 진입 시 실행):

```bash
# 각 Feature 를 Feature Package 로 전환
/dev-feature .plans/features/active/f1-landing-light-theme/
/dev-feature .plans/features/active/f5-ui-residue-cleanup/

# 병렬 구현 (에이전트 팀)
TeamCreate team_name="dash-preview-phase4-phase-a"
  → Agent(dev-implementer) for f1-landing-light-theme
  → Agent(dev-implementer) for f5-ui-residue-cleanup
```

---

## 6. Phase A 종료 조건 중 F5 담당 항목

Epic Children §4 Phase A 종료 조건 (M-Epic-1, 2026-05-06) 중 F5 가 담당하는 항목:

- [ ] **F5 구현 완료 + 테스트 통과 + 리뷰 승인** → F5 Feature 상태 `archived`
- [ ] **JSON 뷰어 화면 비노출 확인** (`grep -rn "<AiExtractJsonViewer" src/` → 0 결과, 컴포넌트 파일 자체는 유지)
- [ ] **"자동 배차 대기" 라벨 반영 확인** (`grep -n "자동 배차" src/components/dashboard-preview/` → 새 문구만)

**F5 외 Phase A 종료 조건** (F1 담당):
- [ ] F1 구현 완료 + 테스트 통과 + 리뷰 승인 → F1 Feature 상태 `archived`
- [ ] 라이트 모드 MVP 작동 (토글 또는 `prefers-color-scheme` 자동 전환)
- [ ] axe-core 라이트 모드 0 violations (landing 전역 기준, 지표 4 중간 평가)

**F5 + F1 공통 조건**:
- [ ] Phase A 회고 (선택, 다음 Phase 착수 전)

---

## 7. 상태 라인 동기

Epic 상태 변화 시 본 파일을 동기 갱신한다 (IMP-AGENT-010 cross-reference 원칙):

| 시점 | Epic 상태 | F5 Feature 상태 |
|------|-----------|------------------|
| 2026-04-22 | draft | — (아직 IDEA 미등록) |
| 2026-04-23 Step 7 | **planning** | `approved` (IDEA screened → approved) → bridge 작성 완료 (본 파일 포함 5 파일) |
| 2026-04-23 Step 8 (현재) | **`active`** | `approved` (Feature 는 `/dev-feature` 에서 active 승격 예정) |
| 2026-04-23 이후 Step 9 완료 | `active` | `archived` (F5 구현 완료) |
| Phase C 완료 후 | `completed` → `archived` | `archived` (유지) |

**상태 갱신 주체**:
- Epic 상태: `/plan-epic advance` 커맨드 (메인 세션 수행)
- Feature 상태: `/dev-feature` (active 승격) + archive 커맨드 (archive 승격)
- 본 파일 `§1 Epic 상태` 라인 갱신은 Epic advance 시 메인 세션이 직접 편집 (bridge-writer 는 초기 작성만)

---

## 8. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-23 | 초안 — Epic EPIC-20260422-001 F5 자식 Feature binding 작성 (Phase A Step 7, IMP-AGENT-010) |
