# Children Features — EPIC-20260422-001

> dash-preview Phase 4 — Phase 3 피드백 반영 의 자식 Feature 실행 지도.
>
> 입력: [`../../../archive/dash-preview-phase3/improvements/issues.md`](../../../archive/dash-preview-phase3/improvements/issues.md) (10 이슈) + [`../../../archive/dash-preview-phase3/improvements/proposals.md`](../../../archive/dash-preview-phase3/improvements/proposals.md) (방안 A/B/C + 공통 C1/C2).

---

## 1. Feature 목록

### F1 — 라이트 모드 전환 인프라 (landing 전역)

- **IDEA**: [IDEA-20260423-002](../../../ideas/00-inbox/IDEA-20260423-002.md)
- **Lane**: Standard (전역 팔레트 + 전환 인프라 + **landing 사이트 전역** 컴포넌트 스윕, 2026-04-23 범위 확장)
- **RICE 예상**: 스크리닝 시 확정 — 사용자 모든 세션·전 페이지 영향 (Reach 최대), 라이트/다크 시각 선호 만족 (Impact 큼), 트리거 방식 미정 (Confidence 중간), landing 전역 스윕 범위 매우 큼 (Effort 매우 큼)
- **범위**: `src/app/globals.css` `@theme inline` 토큰 이중화 (**Tailwind 4 — `tailwind.config.ts` 미사용**, PRD §7.1 정정 반영), `src/app/layout.tsx` `ThemeProvider` 또는 `data-theme` 속성. **landing 사이트 전역 컴포넌트 스윕** — `src/app/page.tsx` · `src/components/**/*.tsx` (hero · features · pricing · testimonials · footer · navbar 등 메인 섹션 + dash-preview 하위 7 개 파일 + shared UI) 의 `bg-white/5`·`text-white`·`from-gray-900/50`·`border-gray-800` 류 다크 하드코딩 클래스 토큰 치환. 전수 조사는 `grep` 기반 후보 목록 → 토큰 매핑 결정표 작성. 전환 트리거 방식·초기 모드·hydration 방어 등은 Draft §4 에서 확정 (next-themes + system follow + 3 중 방어).
- **Draft**: [`.plans/drafts/f1-landing-light-theme/01-draft.md`](../../../drafts/f1-landing-light-theme/01-draft.md) (Standard/A/dev)
- **PRD**: [`.plans/drafts/f1-landing-light-theme/02-prd.md`](../../../drafts/f1-landing-light-theme/02-prd.md) (REQ-14 + NFR-10 + SM-10, PCC 5/5 PASS)
- **Feature Package**: [`.plans/features/active/f1-landing-light-theme/`](../../../features/active/f1-landing-light-theme/00-context/01-product-context.md) (Bridge 완료 2026-04-23, TASK 8 건 예정 T-THEME-01~08, 6 PR 분할)
- **포함 이슈**: [1]
- **상태**: approved

### F2 — Mock 스키마 재설계 (추출/적용 분리 + 시나리오 세트)

- **IDEA**: 미등록
- **Lane**: Standard (스키마·주입 로직·테스트 광범위 갱신)
- **RICE 예상**: 스크리닝 시 확정 — Phase 3 내러티브 완성도 직결 (Impact 최고), 공통 방안 C1+C2 선행 투자 필요 (Effort 큼)
- **범위**: `src/lib/mock-data.ts` 에 `extractedFrame` / `appliedFrame` 분리 스키마 도입 + `PREVIEW_MOCK_SCENARIOS: [세트A, B, C, (D)]` 배열화 + 세트 선택기 함수 (랜덤/고정/버튼 트리거 중 `/plan-draft` 결정). `order-form/index.tsx` 에서 `EstimateInfoCard` · `SettlementSection` 에 Step 기반 `visible` prop 주입. AI 카테고리 `fare` 값을 `estimate.amount` 와 일치시켜 자릿수 혼동 제거. `dashboard-preview.tsx` 에 세트 선택 트리거 UI 추가 (옵션).
- **포함 이슈**: [2-1], [2-2], [2-3], [2-4]
- **상태**: pending

### F3 — 옵션↔추가요금 파생 로직

- **IDEA**: 미등록
- **Lane**: Lite (파일 1~2 건 중심, 스펙만 확정되면 구현 단순)
- **RICE 예상**: 스크리닝 시 확정 — 체크 시 즉각 피드백이라는 UX 효과 큼 (Impact 중상), 매핑 스펙 부재 리스크 (Confidence 중간)
- **범위**: `src/lib/mock-data.ts` 에 `OPTION_FEE_MAP` 상수 추가 (예: `direct → { type: '직송', amount: 50000 }` 등, 스펙은 `/plan-draft` 확정). `settlement-section.tsx` 또는 `order-form/index.tsx` 에서 `options` 변화 시 `additionalFees` 파생. 기존 고정 `{ id: 'fee-toll', ... }` 은 기본값으로 유지 또는 제거 결정.
- **포함 이슈**: [2-5]
- **상태**: pending

### F4 — 레이아웃 정비 + Hit-Area 재정렬

- **IDEA**: 미등록
- **Lane**: Standard (hit-area 전 좌표 + Tablet 분리 검토 + overlay 앵커 재설계 검토)
- **RICE 예상**: 스크리닝 시 확정 — 세로 밀도 개선 + 툴팁 정확도 직결 (Impact 큼), Proposal A/B/C 중 선택 따라 Effort 변동 큼
- **범위**: Col 2 내부 pickup/delivery `DateTimeCard` 를 `grid grid-cols-2 gap-4` 로 래핑 (이슈 [3] Proposal A 기본). `src/components/dashboard-preview/hit-areas.ts` 의 19 개 bounds 를 실제 DOM 기준으로 재측정 (또는 Proposal B "DOM 측정 기반 동적 bounds" 로 재설계 여부 결정). `TABLET_HIT_AREAS = DESKTOP_HIT_AREAS` 단일화 유지 여부 결정. `interactive-overlay.tsx` 의 앵커를 ScaledContent 내부로 이동 여부 결정 (이슈 [4] Proposal A).
- **포함 이슈**: [3], [4]
- **상태**: pending

### F5 — UI 잔재 정리 (JSON 뷰어 숨김 + 라벨 변경)

- **IDEA**: [IDEA-20260423-001](../../../ideas/00-inbox/IDEA-20260423-001.md)
- **Lane**: Lite (렌더 제외·엔트리 제거·치환 위주, 단 참조 지점 분산)
- **RICE 예상**: 스크리닝 시 확정 — 화면 군더더기 숨김 (Impact 중하), 참조 지점 많아 Effort 중간
- **범위**: `AiExtractJsonViewer` 컴포넌트 파일 **유지** + `ai-panel/index.tsx` 의 import · JSX 렌더 제거 + `hit-areas.ts` `ai-json-viewer` 엔트리 제거 + `mock-data.ts` tooltip `ai-json-viewer` 엔트리 제거 (`jsonViewerOpen` 필드는 유지 — F2 스키마 재설계 시 일괄 이관) + 통합 테스트 "JSON 뷰어 미렌더" 단정으로 갱신 (이슈 [5] Proposal A 변형 — 파일 유지 + 화면 숨김 방향, 2026-04-23 수정). `estimate-info-card.tsx` 의 "자동 배차" 문자열을 "자동 배차 대기" 로 교체 + tooltip `auto-dispatch` 문구·JSDoc·테스트 기대 문자열 동기 여부 결정 (이슈 [6]).
- **Draft**: [`.plans/drafts/f5-ui-residue-cleanup/01-draft.md`](../../../drafts/f5-ui-residue-cleanup/01-draft.md) (Lite/B/dev)
- **Feature Package**: [`.plans/features/active/f5-ui-residue-cleanup/`](../../../features/active/f5-ui-residue-cleanup/00-context/01-product-context.md) (Bridge 완료 2026-04-23, TASK 4 건 예정 T-CLEANUP-01~04)
- **포함 이슈**: [5], [6]
- **상태**: approved

---

## 2. 의존성 매트릭스

|        | F1  | F2  | F3  | F4  | F5  |
|---|:---:|:---:|:---:|:---:|:---:|
| F1 (라이트 모드)      | —   | △   | △   | △   | ✓   |
| F2 (Mock 재설계)     |     | —   | →   | ✓   | →   |
| F3 (옵션↔요금 파생)   |     |     | —   | ✓   | ✓   |
| F4 (레이아웃+HitArea) |     |     |     | —   | ✓   |
| F5 (UI 잔재 정리)    |     |     |     |     | —   |

**범례**:
- `✓`: 완전 독립 병렬 가능
- `→`: 순차 필요 (왼쪽 완료 후 오른쪽 착수)
- `X`: 파일/범위 충돌 (동시 실행 금지)
- `△`: 대부분 독립 (부분 충돌, 주의 필요)

**주요 근거**:
- **F1 ↔ F2/F3/F4 (`△`)**: F1 의 **landing 전역 토큰 스윕** (2026-04-23 범위 확장) 이 dash-preview 파일을 포함해 F2/F3/F4 와 동일 파일 편집 → 머지 충돌 가능. F1 을 Phase A 에 독립 선행시켜 Phase B/C 의 다른 Feature 와 시간 분리. F1 내부는 **섹션별 PR 분할** (hero / features / pricing / footer / dash-preview 등 5~6 개 PR) 권장.
- **F2 ↔ F3 (`→`)**: 둘 다 `src/lib/mock-data.ts` 에 새로운 상수/필드 추가 → F2 의 스키마 재설계가 먼저 merge 되어야 F3 의 `OPTION_FEE_MAP` 이 깔끔히 얹힘.
- **F2 ↔ F5 (`→`)**: F5 가 `ai-panel/index.tsx` 렌더 · `hit-areas.ts` · `mock-data.ts` tooltip 엔트리를 먼저 정리 → F2 의 `extractedFrame` / `appliedFrame` 스키마는 정리된 mock-data 기반 위에서 설계. `jsonViewerOpen` 필드는 F5 에서 유지 → F2 재설계 시 스키마 내부로 일괄 이관. (Phase A 에 F5 배치, Phase B 에 F2 배치.)
- **F1 ↔ F5 (`✓`)**: F5 는 독립 파일 (ai-extract-json-viewer, estimate-info-card 의 라벨 한 줄) 만 수정 → F1 의 전역 스윕과 충돌 없음. 병렬 가능.

---

## 3. 실행 순서 (Phase 기반)

### Phase A (2026-04-23 ~ 2026-05-06, 약 2주) — 기반 정리 + 라이트 모드

**이유**: F5 (UI 잔재 정리) 는 가장 작고 F2 의 스키마 설계에 선행되어야 함. F1 (라이트 모드) 은 가장 광범위하므로 다른 Feature 와 시간 분리 필요. 둘은 서로 독립 파일이라 병렬 가능.

- **F1 + F5 병렬**
- F1: `globals.css` 토큰 이중화 → `layout.tsx` ThemeProvider → **landing 전역 컴포넌트 스윕** (hero / features / pricing / footer / navbar / dash-preview 섹션별 순차 토큰 치환, 5~6 개 PR 분할)
- F5: `AiExtractJsonViewer` 숨김 (컴포넌트 파일 유지 + `ai-panel/index.tsx` 렌더·`hit-areas.ts`·tooltip 엔트리 제거) + "자동 배차 대기" 라벨 치환
- 예상 완료: **M-Epic-1 (2026-05-06)**

### Phase B (2026-05-01 ~ 2026-05-14, 약 2주) — 핵심 스키마 + 레이아웃 정확도

**이유**: F5 완료 후 mock 스키마 재설계 (F2) 투입. F4 는 F2 와 다른 파일 (order-form 레이아웃 vs mock-data) 이라 병렬 가능.

- **F2 + F4 병렬**
- F2: `extractedFrame` / `appliedFrame` 분리 → `PREVIEW_MOCK_SCENARIOS` 배열화 → 선택기 함수 → `EstimateInfoCard` / `SettlementSection` Step 기반 가시성 → 기존 테스트 갱신
- F4: Col 2 내부 2열 래핑 → `hit-areas.ts` 전 좌표 재측정 → Tablet 분리 결정 → `interactive-overlay.tsx` 앵커 위치 결정
- 예상 완료: **M-Epic-2 (2026-05-14)**

### Phase C (2026-05-14 ~ 2026-05-20, 약 1주) — 옵션 파생 로직

**이유**: F2 의 mock 스키마가 정착된 뒤 `OPTION_FEE_MAP` 을 얹어야 충돌 없음.

- **F3 단독**
- `OPTION_FEE_MAP` 스펙 확정 (`/plan-draft` 결정) → `settlement-section` 소스 전환 → 파생 로직 테스트
- 예상 완료: **M-Epic-3 (2026-05-20)** — Epic archive 준비

---

## 4. Phase A 실행 로드맵 (9단계)

Phase A 는 `/plan-idea → /plan-screen → /plan-draft → (/plan-prd) → /plan-bridge → /dev-feature → /dev-run` 파이프라인을 **F5 · F1** 두 Feature 에 대해 수행한다. Epic 상태는 `draft → planning → active` 2회 전이한다. 목표: **M-Epic-1 (2026-05-06)**.

### Step 1. F5 IDEA 등록

```bash
/plan-idea "F5 UI 잔재 정리 — AiExtractJsonViewer 제거 + '자동 배차 대기' 라벨" --epic=EPIC-20260422-001
```

- 실행 주체: 사용자 → `plan-idea-collector` 에이전트
- 산출: `.plans/ideas/00-inbox/IDEA-{YYYYMMDD}-{NNN}.md` + `backlog.md` 등록 + Epic 의 `01-children-features.md` F5 행 IDEA 필드 자동 갱신 (IMP-AGENT-010)
- 선행: Epic `draft` 상태에서도 자식 IDEA 등록 허용
- 소요: 5 분

### Step 2. F1 IDEA 등록

```bash
/plan-idea "F1 라이트 모드 전환 인프라 — 토큰 이중화 + ThemeProvider" --epic=EPIC-20260422-001
```

- 실행 주체: 사용자 → `plan-idea-collector` 에이전트
- 산출: F1 IDEA 파일 + `backlog.md` 행 + Epic F1 행 IDEA 필드 갱신
- 소요: 5 분

### Step 3. Epic 상태 전이 `draft → planning`

```bash
/plan-epic advance EPIC-20260422-001 --to=planning
```

- 게이트: `00-epic-brief.md` (✅ 존재) + `01-children-features.md` (✅ 존재) + 자식 IDEA 최소 1 건 (Step 1 이후 충족)
- 산출: `.plans/epics/00-draft/EPIC-.../` → `.plans/epics/10-planning/EPIC-.../` `git mv` + `.plans/epics/index.md` 상태 컬럼 `draft → planning`
- Checkpoint: 게이트 통과 후 `git mv` 전 **사용자 승인** (type: `checkpoint-generic`, critical 아님 → `autoProceedOnPass=true` 시 자동 통과)
- 소요: 3 분

### Step 4. Screening (순차)

```bash
/plan-screen {F5-IDEA-ID} --framework=rice   # F5 권장 Lite 판정
/plan-screen {F1-IDEA-ID} --framework=rice   # F1 권장 Standard 판정
```

- 실행 주체: 사용자 지시 → `plan-idea-screener` 에이전트
- Checkpoint: 각 IDEA 스크리닝 후 Go/Hold/Kill **사용자 승인 필수** (type: `initial-approval-gate`, Critical → `autoProceedOnPass` 무관 항상 정지)
- 산출: 각 IDEA 파일에 SCREENING 섹션 추가 + 상태 `inbox → screened → approved` 2단 전이
- 소요: 각 10 분

### Step 5. Draft (순차 또는 병렬)

```bash
/plan-draft {F5-IDEA-ID}
/plan-draft {F1-IDEA-ID}
```

- 실행 주체: `plan-draft-writer` 에이전트
- 산출: Lite/Standard + 시나리오(A/B/C) + Feature 유형(copy/dev) + routing metadata 3 중 판정
  - **F5 예상**: Lite + 시나리오 B (부분 구현 완성) + dev Feature
  - **F1 예상**: Standard + 시나리오 A (Greenfield, 라이트 팔레트 신규) + dev Feature
- Checkpoint: 3 중 판정 결과 **사용자 승인** (type: `scope-confirmation`)
- 소요: 각 15~30 분

### Step 6. PRD 작성 (Standard Feature 만)

```bash
# F1 만 Standard → PRD 필수
/plan-prd .plans/drafts/{F1-slug}/
# F5 는 Lite → PRD 생략 가능 (draft + bridge 로 개발 진입)
```

- 실행 주체: `plan-prd-writer` 에이전트
- 산출: F1 PRD 10 섹션 (Overview/Problem/Goals/User Stories/Requirements/UX/Tech/Milestones/Risks/Success Metrics). Epic §2 성공지표 인용 (IMP-AGENT-011)
- Checkpoint: PRD 리뷰 (`plan-reviewer` PCC 5 종) + **사용자 승인** (type: `review-approval`)
- 소요: 30~60 분

### Step 7. Bridge (개발 핸드오프)

```bash
/plan-bridge {F5-slug}
/plan-bridge {F1-slug}
```

- 실행 주체: `plan-bridge-writer` 에이전트
- 산출: `.plans/features/active/{slug}/00-context/` 4 종 컨텍스트 파일 (01~04) + **Epic binding** (`08-epic-binding.md`) 생성
- 선행: `/plan-design` 또는 `/plan-stitch` 는 F1 · F5 둘 다 불필요 판단 (팔레트 토큰 + UI 잔재 수준 작업). 필요 시 Step 6 직후 삽입
- 소요: 각 15~20 분

### Step 8. Epic 상태 전이 `planning → active`

```bash
/plan-epic advance EPIC-20260422-001 --to=active
```

- 게이트: 자식 Feature 중 최소 1 건 `approved` 이상 (Step 7 완료 후 둘 다 충족)
- 산출: `.plans/epics/10-planning/EPIC-.../` → `.plans/epics/20-active/EPIC-.../` 이동 + `index.md` 갱신 + 자식 Feature 의 `08-epic-binding.md` 의 Epic 상태 라인 `planning → active`
- 소요: 3 분

### Step 9. 병렬 구현 (TeamCreate + /dev-run)

```bash
# 각 Feature 를 Feature Package 로 전환 (PRD → Feature Package)
/dev-feature .plans/features/active/{F1-slug}/
/dev-feature .plans/features/active/{F5-slug}/

# F1 + F5 병렬 구현 (에이전트 팀)
# 메인이 TeamCreate 로 팀 구성 후 각 Feature 에 dev-implementer 1 인 할당
TeamCreate team_name="dash-preview-phase4-phase-a"
  → Agent(dev-implementer) for F1
  → Agent(dev-implementer) for F5
```

- 실행 주체: `dev-implementer` 에이전트 (IMP-AGENT-005, TASK 별 TDD 자율 루프: RED → GREEN → IMPROVE)
- Checkpoint: 각 Feature TASK 완료 후 `dev-code-reviewer` + `dev-security-reviewer` 검증 → 사용자 승인 → 다음 TASK
- 산출: 구현 코드 + 테스트 (`mock-data.test.ts`, `light-theme.test.ts` 등) + 커밋 + PR
- 예상 TASK 수: F1 약 6~8 건 (T-THEME-01 ~ T-THEME-08), F5 약 3~4 건 (T-CLEANUP-01 ~ T-CLEANUP-04)
- 소요: F1 약 5~7 일 + F5 약 2~3 일 (병렬 기준 최장 경로 **F1 ≈ 7 일**)

---

### Phase A 종료 조건 (M-Epic-1, 2026-05-06)

- [ ] F1 구현 완료 + 테스트 통과 + 리뷰 승인 → F1 Feature 상태 `archived`
- [ ] F5 구현 완료 + 테스트 통과 + 리뷰 승인 → F5 Feature 상태 `archived`
- [ ] 라이트 모드 MVP 작동 (토글 또는 `prefers-color-scheme` 자동 전환)
- [ ] JSON 뷰어 화면 비노출 확인 (`grep -r "<AiExtractJsonViewer" src/` → 0 결과, 컴포넌트 파일 자체는 유지)
- [ ] "자동 배차 대기" 라벨 반영 확인 (`grep "자동 배차" src/components/dashboard-preview/` → 새 문구만)
- [ ] axe-core 라이트 모드 0 violations (**landing 전역** 기준, 지표 4 중간 평가)
- [ ] Phase A 회고 (선택, 다음 Phase 착수 전)

---

### Phase 전환 규칙

Phase A 완료 후 **세션 종료** (context 50% 규칙 + 사용자 결정). Phase B 는 별도 세션에서 착수한다:

```bash
# Phase B 시작 시 (다른 세션)
/plan-idea "F2 Mock 스키마 재설계 ..." --epic=EPIC-20260422-001   # Step 1 재개
/plan-idea "F4 레이아웃 정비 + Hit-Area ..." --epic=EPIC-20260422-001
# 이하 Step 3 (advance 생략 — active 유지) → Step 4 screening → Step 5 draft → ...
```

Epic 상태는 **`active` 유지** (Phase B/C 완료까지). 모든 자식 Feature `archived` 시 `/plan-epic advance EPIC-20260422-001 --to=completed` 후 `--to=archived` 2 단 전이 → `/plan-epic archive EPIC-20260422-001` 단일 커맨드로도 가능.

---

## 5. 진행 대시보드

(수동 업데이트 — Phase 3 에서 `plan-epic-integrity.js` 자동화 후보)

| Feature | 상태 | TASK 진행 | 테스트 | 번들 영향 | 리뷰 |
|---|:---:|:---:|:---:|:---:|:---:|
| F1 라이트 모드 | approved | 0/7 | — | — | — |
| F2 Mock 재설계 | pending | — | — | — | — |
| F3 옵션↔요금 파생 | pending | — | — | — | — |
| F4 레이아웃+HitArea | pending | — | — | — | — |
| F5 UI 잔재 정리 | implemented | 4/4 | 624 PASS | — | /dev-verify PASS |

상태 값: `pending` / `screening` / `approved` / `active` / `archived`.

---

## 6. Screening 권장 순서

자식 IDEA 등록 후 `/plan-screen` 실행 순서:

1. **F5 (UI 잔재 정리)** — Lite, Effort 가장 작음, Phase A 선행. 가장 먼저 스크리닝해 빠른 Go 판정.
2. **F1 (라이트 모드)** — Standard, Reach 최고. Phase A 에 F5 와 병렬 투입 판단.
3. **F4 (레이아웃+HitArea)** — Standard, 기존 Phase 3 핵심 UX 품질 직결. Phase B 투입 판단.
4. **F2 (Mock 재설계)** — Standard, Impact 최고이지만 Effort 도 최고. Phase B 투입 판단.
5. **F3 (옵션↔요금 파생)** — Lite, 스펙 확정 리스크 수반. Phase C 투입 판단 (마지막).

---

## 7. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-22 | 초안 — 5 Feature 구성 + Phase A/B/C 실행 순서 + 의존성 매트릭스 |
| 2026-04-23 | §4 Phase A 실행 로드맵 (9단계) 추가 — 후속 섹션 번호 +1 |
| 2026-04-23 | F5 A 섹션 방향 수정 (IDEA-20260423-001 기반) — 파일 삭제 → 화면 숨김. §1 F5 헤더/범위 + §2 F2↔F5 근거 + §3 Phase A F5 설명 + §4 종료 조건 동기 |
| 2026-04-23 | F1 범위 확장 (IDEA-20260423-002 기반) — dash-preview 한정 → landing 사이트 전역. §1 F1 헤더/Lane/RICE/범위 + §2 F1↔F2/F3/F4 근거 + §3 Phase A F1 설명 + §4 종료 조건 동기 |
| 2026-04-23 | Phase A Step 4~7 완료 — F5/F1 Screening (Go 승인) + Draft (Lite/Standard) + F1 PRD (PCC 5/5 PASS) + F5/F1 Bridge (Feature Package 생성). §1 F5/F1 상태 `inbox → approved` + Draft/PRD/Feature Package 링크 추가. Step 8 Epic `planning → active` 진입 준비 |
| 2026-04-23 | Phase A Step 9 /dev-feature 완료 (F1 + F5) — Architecture Profile detected → approved. F5 /dev-run 완료 (T-CLEANUP-01~04, 5 커밋, 624 tests PASS, DVC PASS, F5 상태 `implemented`). F1 /dev-run 새 세션에서 진행. F1 PR-4 Skip 결정 (D-003, pricing/testimonials 미존재). |
