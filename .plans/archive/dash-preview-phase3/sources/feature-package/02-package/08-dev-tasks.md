# 개발 태스크: dash-preview-phase3

> **Feature**: Dashboard Preview Phase 3
> **PRD**: [`../00-context/01-prd-freeze.md`](../00-context/01-prd-freeze.md)
> **Architecture Binding**: [`../00-context/06-architecture-binding.md`](../00-context/06-architecture-binding.md)
> **요구사항 SSOT**: [`01-requirements.md`](./01-requirements.md)
> **Created**: 2026-04-17

---

## 0. 이 문서의 역할

Phase 3 구현 TASK를 **Spike + M1~M5**로 그룹화. 각 TASK는 `T-DASH3-{Mn}-{NN}` 네이밍을 따르며 수용 기준·의존 관계·예상 공수·관련 REQ/TC를 명시.

TDD 원칙: **각 TASK는 테스트 우선 작성** (REQ-DASH3-070/072). 유틸 TASK는 단위 테스트 2건 이상 동반.

---

## 1. Spike (선행, 1일)

**목적**: R4(복제 공수 과소평가) 정량 검증 + 2차 확인 #6 전체 beat 타이밍 예비 실측. 전체 4-Step flow를 얇게 구현해 설계 재조정 트리거 조기 확보 (PRD §8-0).

**범위** (얇게 but 전 Column·전 Step):

| TASK ID | 설명 | 파일 | 예상 | 관련 REQ |
|---------|------|------|:----:|---------|
| T-DASH3-SPIKE-01 | **수직 슬라이스 구현** — `ai-panel/ai-input-area.tsx` + `ai-panel/ai-extract-button.tsx` + 조작감 **#1 fake-typing** + **#3 button-press**. `order-form/estimate-info-card.tsx` + **#8 number-rolling**. `order-form/company-manager-section.tsx` **정적 pre-filled**. 4-Step 자동재생 골격(INITIAL→AI_INPUT→AI_EXTRACT→AI_APPLY) + MVP 조작감 3종(#1/#3/#8)만 통합. **동반 TDD 테스트 세트 작성** (REQ-DASH3-074). | 신규 5~6 파일 | 1일 | REQ-DASH3-074 + 부분적 001/003/010/011/014/020/021/023 |

**Spike 종료 의사결정 분기** (PRD §8-0):

- R4 실측 **+50% 초과** → 시나리오 **C → A 전환** 재평가
- 전체 beat **0.8초 부족/과다** → PRD §6-2 duration 재조정
- **#10 Column Pulse** / **Tablet 정식 가독성**은 Spike 외 → M4/M5에서 별도 처리

**Spike 산출물**:
- 수직 슬라이스 코드 (feature flag 오프 상태로 머지 가능)
- 공수·번들·LCP·전체 beat 타이밍 실측 기록 (evidence 디렉터리)
- Spike 테스트 세트 pass 상태

---

## 2. M1 기반 (3일)

**목적**: Phase 3 신규 디렉터리 구조 확립, mock/preview-steps 확장, interactions 유틸 스캐폴드, shadcn 5 컴포넌트 설치.

| TASK ID | 설명 | 파일 | 의존 | 예상 | 관련 REQ | TDD 우선 |
|---------|------|------|------|:----:|---------|---------|
| T-DASH3-M1-01 | **mock-data.ts 확장** — Phase 1 스펙 §6 스키마 전체 구현 (aiInput/aiResult/formData/tooltips). **pre-filled SSOT 반영** (wireframe decision-log §4-3 exact match). 타입 정의 + 유효 값 세트 1개. | `lib/mock-data.ts` | — | 1일 | REQ-DASH3-010, 014, 065 | `TC-DASH3-UNIT-MOCKSCHEMA` + `TC-DASH3-SSOT-MOCK` |
| T-DASH3-M1-02 | **preview-steps.ts 작성** — 4단계 정의 + interactions 타이밍 트랙 (typingRhythm / focusWalk / pressTargets / fillInFields / **partialBeat / allBeat** 포함). | `lib/preview-steps.ts` | M1-01 | 0.5일 | REQ-DASH3-011, 012, 041, 063 + REQ-DASH-010, 011 | `TC-DASH3-UNIT-PREVIEWSTEPS` + `TC-DASH3-INT-MATRIX` |
| T-DASH3-M1-03 | **AiRegisterMain shell 작성** — `ai-register-main/index.tsx` 빈 컨테이너 (AiPanel + OrderForm 2-col flex) + `ai-register-main/ai-panel/index.tsx` 빈 컨테이너 + `ai-register-main/order-form/index.tsx` 3-col grid 루트 (`grid grid-cols-1 lg:grid-cols-3 gap-4`). | `ai-register-main/index.tsx`, `ai-register-main/ai-panel/index.tsx`, `ai-register-main/order-form/index.tsx` | M1-02 | 0.5일 | REQ-DASH3-001, 050, 053 + REQ-DASH-003, 007 | `TC-DASH3-INT-GRID` + `TC-DASH3-INT-COLS` |
| T-DASH3-M1-04 | **dashboard-preview.tsx 분기 로직** — Phase 1/2 vs Phase 3 Feature flag 구조. `preview-chrome.tsx` Tablet scaleFactor 0.32 → 0.40. `step-indicator.tsx` 5-dot → 4-dot. | `dashboard-preview.tsx`, `preview-chrome.tsx`, `step-indicator.tsx` | M1-03 | 0.5일 | REQ-DASH3-052, 053 + REQ-DASH-014, 023/024 | `TC-DASH3-INT-FLAG` + `TC-DASH3-UNIT-IND` |
| T-DASH3-M1-05 | **interactions 유틸 6개 스캐폴드 + TDD** — `use-fake-typing.ts`, `use-button-press.ts`, `use-focus-walk.ts`, `use-ripple.ts`, `use-fill-in-caret.ts`, `use-number-rolling.ts`. 각 유틸 **최소 2개 단위 테스트** 동반. | `interactions/*.ts` (6 파일) | — | 1일 | REQ-DASH3-020~025, 030, 072 | `TC-DASH3-UNIT-TYP`, `TC-DASH3-UNIT-PRESS`, `TC-DASH3-UNIT-FOCUS`, `TC-DASH3-UNIT-RIPPLE`, `TC-DASH3-UNIT-FILLIN`, `TC-DASH3-UNIT-ROLL` |
| T-DASH3-M1-06 | **shadcn 3-C 설치** — CLI로 `Button / Input / Textarea / Card / Badge` 5개 설치. `components/ui/` 경로 확인. package.json 변화 확인 (Radix 2개만 추가). | `components/ui/*.tsx` (5 파일) | — | 0.5일 | REQ-DASH3-051 | `TC-DASH3-INT-SHADCN` |
| T-DASH3-M1-07 | **Legacy 테스트 300개 격리 (A안)** — `__tests__/dashboard-preview/legacy/` 디렉터리 이동 (`git mv` 권장) + `vitest.config.ts` include 패턴 재구성 (`LEGACY=true` 토글). M1 3일 범위 내 0.5일 흡수. | `__tests__/dashboard-preview/legacy/` (파일 이동) + `vitest.config.ts` | — | 0.5일 | REQ-DASH3-071 | `TC-DASH3-INT-LEGACY-1/2/3` |
| T-DASH3-M1-08 | **Hero 레이아웃 확장 (Spike 발굴)** — Hero `max-w-4xl`(896px) → `max-w-6xl`(1152px) 또는 Spike/Phase 3 전용 래퍼. 원본 `register-form.tsx` `lg:grid-cols-3` breakpoint(1024px) 충족 위해 가용 폭 확보. breakpoint 축소(`md:grid-cols-3`)는 **비권장** (원본 DOM 1:1 유지). | `sections/hero.tsx` (또는 신규 `dashboard-preview-outer-wrapper.tsx`) | M1-03 | 0.25일 | REQ-DASH3-007 + PRD §6-4 | `TC-DASH3-INT-RESPONSIVE-3COL` |
| T-DASH3-M1-09 | **Mobile 뷰포트 분기 추가 (Spike 발굴)** — `ai-register-main/index.tsx`에 `useMediaQuery('(max-width: 767px)')` 분기 삽입 → Mobile 시 기존 `<MobileCardView />` 렌더. Dynamic import로 `ai-register-main` 청크 Mobile 로드 회피. | `ai-register-main/index.tsx` + `dashboard-preview.tsx` (dynamic import) | M1-03 | 0.25일 | REQ-DASH3-062 + PRD §6-4 | `TC-DASH3-INT-MOBILE-FALLBACK` |

### 2-1. M1 병렬 가능 그룹

| 그룹 | 병렬 TASK | 선행 |
|------|-----------|------|
| 초기 설정 | M1-01 + M1-06 | — |
| 유틸 구현 | M1-05 (6개 유틸 개별 병렬) | — |
| Shell | M1-03 + M1-04 | M1-02 |

### 2-2. M1 완료 게이트

- [ ] `mock-data.ts` 초기값이 wireframe decision-log §4-3 SSOT와 **정확히 일치** (TC 통과)
- [ ] `preview-steps.ts`의 4 steps 각각 `interactions` 필드 구조 검증 통과
- [ ] interactions 6 유틸 × 각 2테스트 = **최소 12 테스트** pass
- [ ] shadcn 5 컴포넌트 + Radix 2개 외 신규 의존 **0건** (package.json 검증)
- [ ] `ai-register-main/order-form/index.tsx` 루트 className `grid grid-cols-1 lg:grid-cols-3 gap-4` **exact match**
- [ ] `legacy/` 디렉터리 이동 완료 (`git mv` 로 이동, git log 유지 확인)
- [ ] `vitest.config.ts` include 패턴 수정 검증 (`pnpm run test` 에서 legacy 제외 통과 + `LEGACY=true pnpm run test -- legacy` 통과)
- [ ] **Hero max-w 확장 후 `?spike=1` 또는 Phase 3 활성 시 OrderForm 3-column grid가 Desktop(≥1024px)에서 실제로 가로 배치** (Spike 실측에서 세로 stack 확인됨 → M1-08 해소 필수)
- [ ] **Mobile(<768px)에서 `DashboardPreviewSpike/AiRegisterMain`이 아닌 `MobileCardView`가 렌더링** + `ai-register-main` 청크가 network에 로드되지 않음 (M1-09 해소)
- [ ] 타입 체크 + 린트 0 errors

---

## 3. M2 AiPanel + 조작감 MVP (4~5일)

**목적**: AiPanel 8 파일 TDD 복제 + 조작감 #1/#3 통합. INITIAL → AI_INPUT → AI_EXTRACT 플로우 연결.

| TASK ID | 설명 | 파일 | 의존 | 예상 | 관련 REQ | TDD 우선 |
|---------|------|------|------|:----:|---------|---------|
| T-DASH3-M2-01 | **ai-panel/index.tsx** — 380px 고정 너비 컨테이너, flex col, border-r. AiTabBar/AiInputArea/AiExtractButton/AiResultButtons/AiWarningBadges/AiExtractJsonViewer 자식 조합. | `ai-panel/index.tsx` | M1-03 | 0.5일 | REQ-DASH3-003 | `TC-DASH3-INT-AIPANEL` |
| T-DASH3-M2-02 | **ai-tab-bar.tsx** — 텍스트/이미지 탭 (stateless, active prop). | `ai-panel/ai-tab-bar.tsx` | M1-01 | 0.5일 | REQ-DASH3-003 | `TC-DASH3-UNIT-TABBAR` |
| T-DASH3-M2-03 | **ai-input-area.tsx + #1 fake-typing 통합** — textarea 렌더 + `use-fake-typing` 훅 주입. `typingRhythm` prop 구독. | `ai-panel/ai-input-area.tsx` | M2-02, M1-05 | 1일 | REQ-DASH3-003, 020 + REQ-DASH-005 | `TC-DASH3-UNIT-INPAREA` + `TC-DASH3-UNIT-TYP` 적용 검증 |
| T-DASH3-M2-04 | **ai-extract-button.tsx + #3 button-press 통합** — `pressTargets` prop 구독. disabled/active/loading 3 상태. | `ai-panel/ai-extract-button.tsx` | M2-03, M1-05 | 0.5일 | REQ-DASH3-003, 021 | `TC-DASH3-UNIT-EXTRBTN` + `TC-DASH3-UNIT-PRESS` 적용 검증 |
| T-DASH3-M2-05 | **ai-result-buttons.tsx + #5 hover (CSS)** — 4 카테고리 그룹 (상차/하차/화물/운임). CSS only hover 전환. | `ai-panel/ai-result-buttons.tsx` | M2-01 | 0.5일 | REQ-DASH3-003, 026 + REQ-DASH-006 | `TC-DASH3-UNIT-RESBT` + `TC-DASH3-UNIT-HOVER` |
| T-DASH3-M2-06 | **ai-button-item.tsx + #3/#4 통합** — pending/applied/unavailable 3 상태. press + ripple 유틸 주입. | `ai-panel/ai-button-item.tsx` | M2-05, M1-05 | 0.5일 | REQ-DASH3-003, 021, 025 | `TC-DASH3-UNIT-BTNITM` |
| T-DASH3-M2-07 | **ai-warning-badges.tsx** (Phase 3 신규) — warnings 배열 렌더, hidden 기본. | `ai-panel/ai-warning-badges.tsx` | M2-01 | 0.5일 | REQ-DASH3-003 | `TC-DASH3-UNIT-WARN` |
| T-DASH3-M2-08 | **ai-extract-json-viewer.tsx** (Phase 3 신규) — 접힘 기본, jsonViewerOpen prop. | `ai-panel/ai-extract-json-viewer.tsx` | M2-01 | 0.5일 | REQ-DASH3-003 | `TC-DASH3-UNIT-JSONV` |
| T-DASH3-M2-09 | **AiPanel 플로우 통합 테스트** — 4-Step 전환 통합 테스트 (INITIAL→AI_INPUT→AI_EXTRACT→AI_APPLY). AiPanelContainer 조립 검증. | `ai-panel/__tests__/flow.test.tsx` (신규) | M2-01 | 0.25일 | REQ-DASH3-010, 011, 020, 021 | `TC-DASH3-INT-FLOW-AIPANEL` |
| T-DASH3-M2-12 | **AiPanel 통합 + Step 전환 오버랩 100~200ms** — INITIAL → AI_INPUT → AI_EXTRACT 연결. `useAutoPlay` duration 주입. | `ai-register-main/index.tsx`, `dashboard-preview.tsx` | M2-01~08 | 0.5일 | REQ-DASH-013 재정의 + REQ-DASH3-063 | `TC-DASH3-INT-OVERLAP` + `TC-DASH3-PERF-STEPDUR` (M2 한정) |

### 3-1. M2 병렬 가능 그룹

M2-02 + M2-03 + M2-04 + M2-05 + M2-06 + M2-07 + M2-08 는 **M2-01 완료 후 모두 병렬** 가능 (각각 AiPanel 컨테이너에 독립 장착).

### 3-2. M2 완료 게이트

- [ ] AiPanel 8 파일 모두 렌더링 테스트 통과
- [ ] #1 fake-typing AiInputArea에 적용 + 단위 테스트 (typing rhythm 표준편차 > 0) 통과
- [ ] #3 button-press AiExtractButton + AiButtonItem에 적용 + 150ms scale 0.97 검증 통과
- [ ] INITIAL → AI_INPUT → AI_EXTRACT 시퀀스 E2E 통합 테스트 통과 (M2 부분)
- [ ] Step 전환 오버랩 100~200ms 측정 확인

---

## 4. M3 OrderForm + AI_APPLY 2단 (5~7일)

**목적**: OrderForm 9 파일 TDD 복제 + 조작감 #6/#8/#9 통합 + AI_APPLY partial/all beat 구조 구현 + UI 힌트 Caption.

| TASK ID | 설명 | 파일 | 의존 | 예상 | 관련 REQ | TDD 우선 |
|---------|------|------|------|:----:|---------|---------|
| T-DASH3-M3-01 | **order-form/index.tsx** — 3-col grid 루트 (이미 M1-03에서 스캐폴드). 자식 배치 + **#10 Column Pulse** 구독 (`columnPulseTargets`). | `ai-register-main/order-form/index.tsx` | M1-03 | 0.5일 | REQ-DASH3-004, 029 + REQ-DASH-007 | `TC-DASH3-INT-COLS` + `TC-DASH3-INT-COLPULSE` |
| T-DASH3-M3-02 | **company-manager-section.tsx** (pre-filled) — SSOT mock 값 정적 렌더, **조작감 0건**. hit-area #11 비활성. | `order-form/company-manager-section.tsx` | M1-01 | 0.5일 | REQ-DASH3-004, 014 | `TC-DASH3-INT-PREFILLED` + `TC-DASH3-INT-PREFILLED-SKIP` |
| T-DASH3-M3-03 | **location-form.tsx (pickup/delivery 재사용) + #6 fill-in** — 주소/담당자/연락처 3필드 + `fillInFields` 구독. | `order-form/location-form.tsx` | M3-02, M1-05 | 1일 | REQ-DASH3-004, 022 + REQ-DASH-008 | `TC-DASH3-UNIT-LOCFORM` + `TC-DASH3-UNIT-FILLIN` 적용 검증 |
| T-DASH3-M3-04 | **datetime-card.tsx (pickup/delivery 재사용) + #6 fill-in** — md:grid-cols-2 2-col 내부 구조. | `order-form/datetime-card.tsx` | M3-02, M1-05 | 0.5일 | REQ-DASH3-004, 022 | `TC-DASH3-UNIT-DTCARD` |
| T-DASH3-M3-05 | **cargo-info-form.tsx + #6 + #7 dropdown** — 차량/중량/화물명/비고 4필드. dropdown 전용 prop (`dropdownBeat`). | `order-form/cargo-info-form.tsx` | M3-02, M1-05 | 1일 | REQ-DASH3-004, 022, 027 | `TC-DASH3-UNIT-CARGO` + `TC-DASH3-UNIT-DROP` |
| T-DASH3-M3-06 | **transport-option-card.tsx + #9 stroke** — 8 옵션 (직송/왕복/급송/지게차/수작업/대금회수/추적/특송) + SVG stroke-dashoffset 애니 CSS. | `order-form/transport-option-card.tsx` | M3-02 | 0.5일 | REQ-DASH3-004, 028 | `TC-DASH3-UNIT-TRANS` + `TC-DASH3-UNIT-STROKE` |
| T-DASH3-M3-07 | **estimate-info-card.tsx + #6 + #8 + #9 + #10** — 거리/시간/운임 + 자동배차 체크. `rollingTargets` + `strokeBeats` + `fillInFields` + `columnPulseTargets` 통합. | `order-form/estimate-info-card.tsx` | M3-02, M1-05 | 1일 | REQ-DASH3-004, 022, 023, 028, 029 + REQ-DASH-009 | `TC-DASH3-UNIT-ESTIM` + `TC-DASH3-UNIT-ROLL` 적용 검증 |
| T-DASH3-M3-08 | **settlement-section.tsx + #8 rolling** — 청구/지급/추가/합계 4숫자. | `order-form/settlement-section.tsx` | M3-02, M1-05 | 0.5일 | REQ-DASH3-004, 023 | `TC-DASH3-UNIT-SETTLE` |
| T-DASH3-M3-09 | **register-success-dialog.tsx 파일 복제만** — `open=false` 고정 prop, 항상 hidden. search-address-dialog / company-manager-dialog 닫힌 상태 정적 스냅샷 (선택). | `order-form/register-success-dialog.tsx` | M3-02 | 0.5일 | REQ-DASH3-004, 005, 013 | `TC-DASH3-UNIT-SUCCESSOFF` + `TC-DASH3-INT-DIALOG` |
| T-DASH3-M3-10 | **AI_APPLY 2단 구조 통합** — STATE-004a partialBeat (Col 1→1→2→3 순차) + STATE-004b allBeat (Col 3 전체). 모든 조작감 유틸 시퀀스 조율. | `ai-register-main/order-form/index.tsx`, `ai-register-main/index.tsx` | M3-03~08 | 1일 | REQ-DASH3-040, 041, 042, 043, 073 + REQ-DASH-008 | `TC-DASH3-INT-2BEAT` + `TC-DASH3-INT-PARTIAL` + `TC-DASH3-INT-ALL` |
| T-DASH3-M3-11 | **UI 힌트 Caption 컴포넌트** — 💡 inline caption + `aria-live="polite"` + AI_APPLY 중 opacity 0→1 fade-in. | `dashboard-preview.tsx` (UiHintCaption 내부 컴포넌트) | M3-10 | 0.5일 | REQ-DASH3-044 | `TC-DASH3-INT-HINT` |
| T-DASH3-M3-12 | **총 루프 6~8초 타이밍 튜닝** — INITIAL/AI_INPUT/AI_EXTRACT/AI_APPLY duration 최종 조정. | `lib/preview-steps.ts` | M3-10 | 0.5일 | REQ-DASH-011 + REQ-DASH3-063 | `TC-DASH3-PERF-LOOP` |

### 4-1. M3 병렬 가능 그룹

M3-03 ~ M3-09는 **M3-02 완료 후 모두 병렬**. M3-10/11/12는 M3-03~09 완료 후.

### 4-2. M3 완료 게이트

- [ ] OrderForm 9 파일 렌더링 테스트 통과
- [ ] #6 fill-in caret Location/Cargo/DateTime/Estimate에 적용 (CompanyManager 제외 확인)
- [ ] #8 number-rolling Estimate/Settlement 적용
- [ ] AI_APPLY partialBeat(Col 1→2→3) + allBeat(Col 3) 시퀀스 통합 테스트 통과
- [ ] UI 힌트 Caption AI_APPLY 중만 표시 + aria-live 동작 검증
- [ ] 총 루프 6~8초 범위 (`TC-DASH3-PERF-LOOP` 통과)
- [ ] #10 Column Pulse AI_APPLY 파트별/전체 beat에 맞춰 해당 Column에 400ms glow

---

## 5. M4 조작감 나머지 + 히트 영역 (3~4일)

**목적**: Should 조작감 5종 적용 + 히트 영역 19~20 재매핑.

| TASK ID | 설명 | 파일 | 의존 | 예상 | 관련 REQ | TDD 우선 |
|---------|------|------|------|:----:|---------|---------|
| T-DASH3-M4-01 | **#2 focus-walk 적용** — AiPanel 내 Input → Extract → Results 순차 outline. | `ai-panel/*.tsx` 통합 | M2-06 | 0.5일 | REQ-DASH3-024 | `TC-DASH3-UNIT-FOCUS` 적용 검증 |
| T-DASH3-M4-02 | **#4 ripple 적용** — AiButtonItem에 이미 주입된 ripple 타이밍 최종 조율 + 파트별 beat 연결. | `ai-panel/ai-button-item.tsx` | M3-10 | 0.5일 | REQ-DASH3-025 | `TC-DASH3-UNIT-RIPPLE` 적용 검증 |
| T-DASH3-M4-03 | **#10 Column-wise Border Pulse 최종 조율** — order-form/index.tsx의 `columnPulseTargets` 구독에서 각 Column 자식에 outline + box-shadow 400ms. Tailwind `animate-pulse-column` 유틸 추가. | `ai-register-main/order-form/index.tsx`, `tailwind.config.ts` (기본 유지) or CSS variables | M3-10 | 0.5일 | REQ-DASH3-029 | `TC-DASH3-INT-COLPULSE` |
| T-DASH3-M4-04 | **hit-areas.ts 재작성** — 19~20 영역 3-col 좌표 + #11 `company-manager.isEnabled = false` (pre-filled) + Tablet 축약 폐기 (Desktop 동일 19~20). | `hit-areas.ts` | — | 1~1.5일 | REQ-DASH3-037 + wireframe §5-2 | `TC-DASH3-UNIT-HITAREA` + interactive 모드 회귀 테스트 |

### 5-1. M4 완료 게이트

- [ ] 조작감 10종 모두 적용 (MVP 4 + NTH 6)
- [ ] 히트 영역 19 테스트 통과 (#10, #21 은 비활성/Phase 4 유보)
- [ ] #11 company-manager 인터랙티브 클릭 시 mock 동작 0건, hover 툴팁만 동작
- [ ] Phase 1/2 기존 인터랙티브 모드 회귀 테스트 통과 (legacy 격리 전)

---

## 6. M5 반응형 + 성능 + 검증 (3일)

**목적**: Desktop 0.45 / Tablet 0.40 / Mobile 유지 + dynamic import + reduced-motion + Lighthouse CI + Feature flag + hero 통합.

| TASK ID | 설명 | 파일 | 의존 | 예상 | 관련 REQ | TDD 우선 |
|---------|------|------|------|:----:|---------|---------|
| T-DASH3-M5-01 | **반응형 분기 확정** — preview-chrome.tsx scale 분기 (Desktop 0.45 / Tablet 0.40 / Mobile MobileCardView). Tablet C안 가독성 A/B 검증. | `preview-chrome.tsx` | M1-04 | 0.5일 | REQ-DASH-023/024 | `TC-DASH3-PERF-SCALE` + `TC-DASH3-INT-TABLET` |
| T-DASH3-M5-02 | **Dynamic import Mobile/Desktop 분할** — Mobile 뷰에서 `ai-register-main` 청크 로드 0건. `next/dynamic` + SSR false. | `dashboard-preview.tsx` | M1-04 | 0.5일 | REQ-DASH3-062 | `TC-DASH3-PERF-MOBILE` |
| T-DASH3-M5-03 | **Feature flag 병행 운영** — env `NEXT_PUBLIC_DASH_PREVIEW_VERSION` 또는 prop `version` 토글. Phase 1/2 ↔ Phase 3 전환. | `dashboard-preview.tsx` | M1-04 | 0.5일 | REQ-DASH3-052 | `TC-DASH3-INT-FLAG` |
| T-DASH3-M5-04 | **번들 크기 검증** — `pnpm run build` → ai-register-main 청크 80~100KB gzipped 확인. 초과 시 추가 split 시도. | (측정만) | M3-12, M4 | 0.5일 | REQ-DASH3-060 + REQ-DASH-030 재협상 | `TC-DASH3-PERF-BUNDLE` |
| T-DASH3-M5-05 | **Lighthouse CI** — LCP 전/후 비교. +100ms 미만 검증. 초과 시 `requestIdleCallback` 적용 재확인. | (측정만) | M5-04 | 0.5일 | REQ-DASH3-061 | `TC-DASH3-PERF-LCP` |
| T-DASH3-M5-06 | **접근성 + reduced-motion fallback** — `prefers-reduced-motion` 감지 → 조작감 10종 즉시 스냅 + 기본 STATE-004b 표시. axe-core 스캔 통과. WCAG AA 대비. | `dashboard-preview.tsx`, `ai-register-main/*` | M3-10, M4 | 0.5일 | REQ-DASH3-031, 064, 066 + REQ-DASH-027 | `TC-DASH3-A11Y-REDMO` + `TC-DASH3-A11Y-AXE` + `TC-DASH3-A11Y-CONTRAST` |

### 6-1. M5 완료 게이트 (릴리스 전 필수)

- [ ] Desktop 0.45 + Tablet 0.40 + Mobile CardView 3 뷰포트 시각 검증
- [ ] 번들 80~100KB gzipped 이내 (증거: `next build` 출력)
- [ ] Lighthouse CI LCP +100ms 미만 (증거: CI 리포트)
- [ ] Mobile 청크 네트워크 요청 0건
- [ ] axe-core 0 violations
- [ ] reduced-motion 환경 정적 스냅 검증
- [ ] Feature flag 양쪽 경로 (Phase 1/2 ↔ Phase 3) 정상 동작
- [ ] Phase 1/2 legacy 테스트 격리 완료 (Q7 확정 결과 반영)

---

## 7. 의존성 그래프 전체

```
Spike (T-DASH3-SPIKE-01)
  │
  ↓ (의사결정 분기: C유지 / A전환 / 재조정)
  │
M1 기반
  ├─ M1-01 mock-data
  ├─ M1-02 preview-steps (← M1-01)
  ├─ M1-03 shell (← M1-02)
  ├─ M1-04 dashboard-preview 분기 (← M1-03)
  ├─ M1-05 interactions 유틸 6개 TDD  (병렬, 독립)
  └─ M1-06 shadcn 설치 (병렬, 독립)
        │
        ↓
M2 AiPanel
  ├─ M2-01 ai-panel/index (← M1-03)
  ├─ M2-02 ~ M2-08 (← M2-01, 7개 병렬)
  └─ M2-12 Step 전환 통합 (← M2-01~08)
        │
        ↓
M3 OrderForm + AI_APPLY
  ├─ M3-01 order-form/index 3-col 루트
  ├─ M3-02 company-manager pre-filled
  ├─ M3-03~08 섹션 6개 (← M3-02, 병렬)
  ├─ M3-09 dialog 파일 복제 (병렬)
  ├─ M3-10 AI_APPLY 2단 통합 (← M3-03~08)
  ├─ M3-11 UI 힌트 Caption (← M3-10)
  └─ M3-12 총 루프 타이밍 튜닝 (← M3-10)
        │
        ↓
M4 조작감 나머지 + 히트
  ├─ M4-01 #2 focus-walk (← M2-06)
  ├─ M4-02 #4 ripple (← M3-10)
  ├─ M4-03 #10 Column Pulse (← M3-10)
  └─ M4-04 hit-areas 재작성 (독립, 병렬)
        │
        ↓
M5 반응형 + 성능 + 검증
  ├─ M5-01 반응형 (← M1-04)
  ├─ M5-02 dynamic import (← M1-04)
  ├─ M5-03 Feature flag (← M1-04)
  ├─ M5-04 번들 측정 (← M3-12, M4)
  ├─ M5-05 Lighthouse CI (← M5-04)
  └─ M5-06 접근성 + reduced-motion (← M3-10, M4)
```

### 7-1. 전체 병렬화 요약

| 단계 | 병렬 가능 TASK 수 |
|------|:-----------------:|
| M1 | 4 (M1-01, M1-05, M1-06 독립 + M1-02→03→04 직렬) |
| M2 | 7 (M2-02 ~ M2-08) |
| M3 | 7 (M3-03 ~ M3-09) |
| M4 | 4 (모두 거의 독립) |
| M5 | 4 (M5-01/02/03 초기 병렬) |

---

## 8. Gate TASK (Q7 해소)

| Gate | 조건 | 위치 |
|------|------|------|
| **Q7 테스트 legacy 격리 전략** | **해소 완료 (Phase B A안 확정, 2026-04-17)** | [`09-test-cases.md` §6](./09-test-cases.md) A안 기준 |

A안 확정: `__tests__/dashboard-preview/legacy/` 디렉터리 이동 + `vitest.config.ts` include 재구성. `T-DASH3-M1-07`로 실행. B안/C안은 rejected (02-decision-log.md §6 참조).

---

## 9. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-04-17 | 초안 — Spike(1) + M1(6) + M2(9) + M3(12) + M4(4) + M5(6) = **37 TASK**, 의존성 그래프 + 병렬화 요약 + Q7 Gate |
| 2026-04-17 | Phase C — `T-DASH3-M1-07` 추가 (Legacy 격리 A안), M1 완료 게이트 2항목 추가, §8 Q7 Gate "해소 완료" 갱신 |
| 2026-04-17 | **Spike 결과 반영** — `T-DASH3-M1-08` (Hero max-w 확장) + `T-DASH3-M1-09` (Mobile 분기) 추가. M1 완료 게이트에 3-column grid 실동작 + Mobile CardView 렌더 검증 추가. 근거: `sources/spike-notes.md §3-3` 비계획 이슈 3건 (1 HIGH + 1 MED + 1 LOW) |
| 2026-04-21 | M2 review#2/#3 — `T-DASH3-M2-09` (AiPanel 플로우 통합 테스트) 신규 등록. 코드 `flow.test.tsx` 와 traceability 완결 |
