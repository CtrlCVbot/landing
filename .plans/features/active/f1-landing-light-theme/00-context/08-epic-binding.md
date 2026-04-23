# 08. Epic Binding — F1 라이트 모드 전환 인프라

> Feature ↔ Epic cross-reference (IMP-AGENT-010). 본 파일과 Epic `01-children-features.md` F1 섹션이 **양방향 링크** 관계. 불일치 시 `plan-epic-integrity.js` (Phase 3 enable 예정) 경고.
> 연계 룰: [`.claude/rules/plan-epic-hierarchy.md` §8 Epic ↔ Feature Binding](../../../../../.claude/rules/plan-epic-hierarchy.md)

---

## 1. Epic 메타

| 항목 | 값 |
|------|---|
| **Epic ID** | `EPIC-20260422-001` |
| **Epic 제목** | dash-preview Phase 4 — Phase 3 피드백 반영 |
| **Epic 상태** | `active` (2026-04-23 기준, Phase A Step 3 `draft → planning` + Step 8 `planning → active` 전이 완료) |
| **Epic 기간** | 2026-04-23 ~ 2026-05-20 (예상, 약 4 주) |
| **Epic 파일** | [`../../../../epics/20-active/EPIC-20260422-001/00-epic-brief.md`](../../../../epics/20-active/EPIC-20260422-001/00-epic-brief.md) |
| **Children 파일** | [`../../../../epics/20-active/EPIC-20260422-001/01-children-features.md`](../../../../epics/20-active/EPIC-20260422-001/01-children-features.md) |

---

## 2. F1 의 Epic 내 위치

| 항목 | 값 |
|------|---|
| **Phase 소속** | **Phase A** (2026-04-23 ~ 2026-05-06, 약 2 주) — 기반 정리 + 라이트 모드 |
| **자매 Feature (Phase A, `✓` 병렬)** | [F5 — UI 잔재 정리 (JSON 뷰어 숨김 + 라벨 변경)](../../../../ideas/00-inbox/IDEA-20260423-001.md) |
| **자매 Feature (Phase B, `△` 부분 충돌 대기)** | F2 (Mock 스키마 재설계), F4 (레이아웃+Hit-Area) |
| **자매 Feature (Phase C, `△` 부분 충돌 대기)** | F3 (옵션↔추가요금 파생) |
| **Lane** | **Standard** (PRD 필수, 6 트리거 중 5 매칭 `[1, 2, 3, 5, 6]`) |
| **Feature 유형** | **dev** (copy 파이프라인 미진입) |
| **시나리오** | **A (Greenfield)** — 라이트 팔레트 기존 구현 없음. `feature_type: dev` 로 copy 커맨드 미사용. |
| **Hybrid** | **false** (`/copy-reference-refresh --reference-only` 불필요) |
| **예상 TASK** | T-THEME-01 ~ T-THEME-08 (6~8 건, 상세는 [`04-implementation-hints.md`](./04-implementation-hints.md)) |
| **예상 총 소요** | 약 **10 인·일** (RICE Effort 10 인·일 예측치 정합, PRD §8 Milestones 정합) |

---

## 3. Epic §2 성공 지표 연결 — **지표 4 단독 충족 (직접, IMP-AGENT-011 인용)**

본 F1 은 Epic 5 대 성공 지표 중 **지표 4** 를 **단독 충족** 하는 유일한 자식 Feature 다. Epic Brief §2 지표 4 원문 직접 인용:

### 3-1. Epic §2 지표 4 원문 (인용)

> **지표 4 — 라이트/다크 양 팔레트 지원 + 전환 경로**: `prefers-color-scheme` 또는 토글 기준으로 라이트 모드 전환 시 **landing 사이트 전역** (hero · features · pricing · footer · navbar · dash-preview 포함) 모든 컴포넌트가 식별 가능한 대비 확보. axe-core 라이트 모드 0 violations.

[원문 출처: `00-epic-brief.md` §2](../../../../epics/20-active/EPIC-20260422-001/00-epic-brief.md#2-성공-지표-what)

### 3-2. F1 의 직접 기여 (본 Feature 단독 충족)

| Epic §2 지표 4 요구 | F1 대응 REQ/NFR | 증거 경로 |
|-----|-----|-----|
| `prefers-color-scheme` 기준 라이트 모드 전환 | **REQ-005** `defaultTheme="system"` + `enableSystem` | [PRD §7.3](../../../../drafts/f1-landing-light-theme/02-prd.md#73-next-themes-통합) |
| 토글 기준 라이트 모드 전환 | **REQ-007~009** `ThemeToggle` (Sun/Moon) navbar 우상단 | [PRD §6](../../../../drafts/f1-landing-light-theme/02-prd.md#6-ux-requirements) |
| **landing 사이트 전역** (hero · features · pricing · footer · navbar · dash-preview) | **REQ-010~012** 6 섹션 + dash-preview 7 파일 + shared UI 스윕 | [PRD §5.1 Functional Requirements](../../../../drafts/f1-landing-light-theme/02-prd.md#51-functional-requirements) |
| 식별 가능한 대비 확보 | **NFR-009** WCAG AA ≥ 4.5:1 (텍스트) / ≥ 3:1 (UI) | [PRD §5.2](../../../../drafts/f1-landing-light-theme/02-prd.md#52-non-functional-requirements) |
| **axe-core 라이트 모드 0 violations** | **NFR-001** + **SM-1** 6 섹션 + dash-preview × 5 뷰포트 × 2 테마 | [PRD §10 SM-1](../../../../drafts/f1-landing-light-theme/02-prd.md#10-success-metrics) |

**정량 측정**: F1 의 **SM-1** (axe-core 라이트 모드 landing 전역 0 violations) 이 Epic §2 지표 4 정량 검증을 **단독 수행** 한다.

### 3-3. F1 이 직접 지원하지 않는 Epic 지표

- **지표 1** (AI 추출값 ↔ 폼 적용값 완전 일치): F2 담당. F1 무관.
- **지표 2** (AI_EXTRACT 이전 단계 미노출): F2 담당. F5 간접 지원. F1 무관.
- **지표 3** (3 개 이상 시나리오 세트 순환): F2 담당. F1 무관.
- **지표 5** (hit-area 위치 정확도 ≤ 2 px): F4 담당. F1 무관.

---

## 4. Epic 의존성 매트릭스 §2 인용 — F1 ↔ 자매 Feature 관계

Epic `01-children-features.md` §2 의존성 매트릭스에서 F1 행·열 관계:

| 관계 | 타입 | 의미 | 실행 순서 |
|------|:---:|------|----------|
| **F1 ↔ F5** | **✓** | 완전 독립 병렬 가능 | **Phase A 동시 진행** (F1 Standard, F5 Lite) — 단 F1 내부 PR-6 (dash-preview 7 파일) 만 F5 merge 후 실행 |
| **F1 ↔ F2** | **△** | 부분 충돌 | Phase A (F1) vs Phase B (F2) 시간 분리 |
| **F1 ↔ F3** | **△** | 부분 충돌 | Phase A vs Phase C 시간 분리 |
| **F1 ↔ F4** | **△** | 부분 충돌 | Phase A vs Phase B 시간 분리 |

### 4-1. F1 ↔ F2/F3/F4 `△` 부분 충돌 — 3 건의 근거

Epic Children §2 주요 근거 인용:

> **F1 ↔ F2/F3/F4 (`△`)**: F1 의 **landing 전역 토큰 스윕** (2026-04-23 범위 확장) 이 dash-preview 파일을 포함해 F2/F3/F4 와 동일 파일 편집 → 머지 충돌 가능. F1 을 Phase A 에 독립 선행시켜 Phase B/C 의 다른 Feature 와 시간 분리. F1 내부는 **섹션별 PR 분할** (hero / features / pricing / footer / dash-preview 등 5~6 개 PR) 권장.

**구체 파일 충돌 지점**:

| 자매 Feature | 충돌 파일 | F1 편집 | 자매 편집 | 해소 전략 |
|-------------|----------|---------|----------|----------|
| **F2** | `src/components/dashboard-preview/ai-register-main/order-form/settlement-section.tsx` | 토큰 치환 (PR-6) | mock 주입 · Step 가시성 로직 재설계 | **Phase A vs Phase B** 시간 분리 |
| **F2** | `src/components/dashboard-preview/ai-register-main/order-form/index.tsx` | 토큰 치환 (PR-6) | Step 기반 `visible` prop 주입 | **Phase A vs Phase B** |
| **F3** | `src/components/dashboard-preview/ai-register-main/order-form/settlement-section.tsx` | 토큰 치환 (PR-6) | `OPTION_FEE_MAP` 연동 편집 | **Phase A vs Phase C** |
| **F4** | `src/components/dashboard-preview/ai-register-main/order-form/index.tsx` | 토큰 치환 (PR-6) | layout grid 재구성 | **Phase A vs Phase B** |
| **F4** | `src/components/dashboard-preview/ai-register-main/order-form/datetime-card.tsx` | 토큰 치환 (PR-6) | hit-area 재정렬 + `grid-cols-2` 래핑 | **Phase A vs Phase B** |

**핵심 해소 전략**: F1 의 **PR-6 이 F5 merge 후 + Phase A 내 완료** 되면, F2/F3/F4 는 Phase B/C 진입 시점에 이미 **토큰화된 기반** 위에서 작업 가능 → 머지 충돌 확률 최소화. Epic §6 리스크 1 완화.

### 4-2. F1 ↔ F5 `✓` 완전 병렬 — PR-6 순서 의존의 예외

Epic Children §2 F1↔F5 `✓` 라인 인용:

> **F1 ↔ F5 (`✓`)**: F5 는 독립 파일 (ai-extract-json-viewer, estimate-info-card 의 라벨 한 줄) 만 수정 → F1 의 전역 스윕과 충돌 없음. 병렬 가능.

**단, PR-6 순서 의존 (Draft §4-6 결정)**:

- F5 의 `ai-panel/index.tsx` 렌더 제거 + `hit-areas.ts` · tooltip 엔트리 제거 **선행 완료**
- F5 의 `estimate-info-card.tsx` "자동 배차 대기" 라벨 교체 **선행 완료**
- 위 2 건 완료 후 **F1 의 PR-6 (dash-preview 7 파일 토큰 치환) 시작**
- F5 는 Lite Feature (Effort 2~3 인·일, Epic Children §4 Step 9) 이므로 Phase A D+0 ~ D+4 완료 목표 → **D+4 (2026-04-29) 이후 PR-6 시작**

**병렬 가능 구간** (PR-6 제외):

- F1 PR-1 ~ PR-5 (landing 메인 섹션 + 토큰 이중화 + Provider + 토글) 은 F5 와 **완전 병렬**
- Phase A 2 주 기간 내 F5 (Lite) + F1 (Standard) 동시 merge 가능

---

## 5. Phase A 로드맵 Step 9 — TeamCreate 팀 소속

Epic Children §4 Phase A 실행 로드맵 Step 9 의 TeamCreate 팀 구성에서 F1 은 아래 팀에 소속:

| 항목 | 값 |
|------|---|
| **팀 이름** | `dash-preview-phase4-phase-a` |
| **팀 구성 (예정)** | `dev-implementer` × 2 인 (F1 1 인 + F5 1 인) |
| **F1 담당 에이전트** | `dev-implementer` (IMP-AGENT-005, TASK 별 TDD 자율 루프 RED → GREEN → IMPROVE) |
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

**Spike 모드 분기 (선택적, IMP-AGENT-004)**:

- PR-1 최초 단계 NFR-007 (Tailwind 4 `@theme inline` + `[data-theme="dark"]` 정합) 실험 검증 **실패 시**:
  - **SPIKE-THEME-01** (IMP-KIT-036 1 일 budget hard cap, SPIKE-{AREA}-NN 형식 — IMP-KIT-015 준수) 으로 분기
  - 대안 3 건 평가 (`darkMode: 'selector'` · `@layer` 특이성 · `attribute="class"` 전환)
  - `plan-bridge-writer` + `dev-architect` 협력 계약 (`.claude/rules/spike-workflow-agents.md`)
  - 결과 반영: 본 Binding 파일 + `03-design-decisions.md` §7 Tailwind 4 정정 섹션 갱신

---

## 6. Phase A 종료 조건 중 F1 담당 항목

Epic Children §4 Phase A 종료 조건 (M-Epic-1, 2026-05-06) 중 F1 이 담당하는 항목:

- [ ] **F1 구현 완료 + 테스트 통과 + 리뷰 승인** → F1 Feature 상태 `archived`
- [ ] **라이트 모드 MVP 작동** (토글 또는 `prefers-color-scheme` 자동 전환 중 **양쪽 모두 동작** — 결정 포인트 §4-2 확정)
- [ ] **axe-core 라이트 모드 0 violations** (**landing 전역** 기준, 지표 4 중간 평가 — SM-1 직접 연계)

### 6-1. F5 담당 항목 (F1 외)

- [ ] F5 구현 완료 + 테스트 통과 + 리뷰 승인 → F5 Feature 상태 `archived`
- [ ] JSON 뷰어 화면 비노출 확인 (`grep -rn "<AiExtractJsonViewer" src/` → 0 결과)
- [ ] "자동 배차 대기" 라벨 반영 확인 (`grep -n "자동 배차" src/components/dashboard-preview/` → 새 문구만)

### 6-2. F1 + F5 공통 조건

- [ ] Phase A 회고 (선택, 다음 Phase 착수 전)

---

## 7. 상태 라인 동기

Epic 상태 변화 시 본 파일을 동기 갱신한다 (IMP-AGENT-010 cross-reference 원칙):

| 시점 | Epic 상태 | F1 Feature 상태 |
|------|-----------|------------------|
| 2026-04-22 | draft | — (아직 IDEA 미등록) |
| 2026-04-23 (Step 1~6) | **planning** | `approved` (IDEA screened → approved → Draft → PRD) |
| 2026-04-23 Step 7 | **planning** | **bridge 작성 완료** (본 파일 포함 5 파일 생성) |
| 2026-04-23 Step 8 (현재) | **`active`** (메인 `/plan-epic advance` 완료) | `approved` (Feature 는 `/dev-feature` 에서 active 승격 예정) |
| 2026-04-23 이후 Step 9 완료 | `active` | `archived` (F1 구현 완료) |
| Phase C 완료 후 | `completed` → `archived` | `archived` (유지) |

**상태 갱신 주체**:

- **Epic 상태**: `/plan-epic advance` 커맨드 (메인 세션 수행)
- **Feature 상태**: `/dev-feature` (active 승격) + archive 커맨드 (archive 승격)
- 본 파일 §1 Epic 상태 라인 갱신은 Epic advance 시 **메인 세션이 직접 편집** (bridge-writer 는 초기 작성만)

---

## 8. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-23 | 초안 — Epic EPIC-20260422-001 F1 자식 Feature binding 작성 (Phase A Step 7, IMP-AGENT-010). Epic §2 지표 4 원문 직접 인용 (§3-1) + F1 단독 충족 매핑 (§3-2). 의존성 매트릭스 F1↔F5 `✓` · F1↔F2/F3/F4 `△` 전수 근거 (§4). Phase A 종료 조건 F1 담당 3 항목 (§6). PR-6 F5 merge 후 실행 근거 (§4-2). |
