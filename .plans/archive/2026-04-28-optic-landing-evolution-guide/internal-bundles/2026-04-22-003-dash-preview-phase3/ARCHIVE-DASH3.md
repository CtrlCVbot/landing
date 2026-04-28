# Archive: dash-preview Phase 3 — Pixel-Perfect Preview (AI 화물 등록 조작감 강화)

> **Key**: DASH3 | **Slug**: `dash-preview-phase3` | **IDEA**: IDEA-20260417-001 (Parent: DASH Phase 1/2)
> **Category**: Standard | **RICE Score**: 70.0 (재평가) | **Archived**: 2026-04-22
> **Code Location**: `apps/landing/src/components/dashboard-preview/ai-register-main/` + `interactions/` + `lib/{mock-data,preview-steps}.ts`
> **Pipeline**: P1(Idea) → P2(Screening) → P3(Draft) → P4(PRD) → P5(Wireframe) → P6(Stitch=skipped) → P7(Bridge) → Dev (Spike + M1~M5 + review) → Archive
> **Improvements**: 0

---

## 메타데이터

| 항목 | 값 |
|------|---|
| Feature Key | DASH3 |
| Feature Slug | dash-preview-phase3 |
| 파생 출처 | dash-preview Phase 1/2 의 IMP-DASH-001 Option B Phase 1 실행안 (`archive/dash-preview/improvements/`) |
| Category | Standard (Phase 3 복제 + 조작감 10종 + AI_APPLY 2-beat) |
| Verdict | Go (Score 70.0, 구현 완료) |
| Pipeline Path | P1 → P2 → P3 → P4 → P5 → P7 → Dev → Archive (P6 Stitch skipped) |
| Code Location | `apps/landing/src/components/dashboard-preview/ai-register-main/`, `interactions/`, `lib/{mock-data,preview-steps}.ts`, `app/{layout,globals.css}` |
| 참조 UI | `.references/code/mm-broker/app/broker/order/ai-register/page.tsx` (Phase 1/2 대비 full 복제) |
| Archived Date | 2026-04-22 |
| Commits (landing repo) | 36 (CtrlCVbot, `d7c1c76` ← HEAD 기준) |
| Commits (root mologado) | 6 (기획/문서/검증) |
| Tests | 622 Phase 3 / 916 LEGACY + 3 skipped |
| Bundle (ai-register-main chunk) | 12 KB gzipped (목표 80~100 KB) |
| Accessibility | axe-core 0 violations (4 Step × 2 container) |
| `/dev-verify` 결과 | PASS (ERROR 0, commit `af9a0fe`) |

## 원본 파일 매니페스트

| 원본 경로 | 현재 위치 | 유형 |
|-----------|----------|------|
| .plans/ideas/20-approved/IDEA-20260417-001.md | sources/ideas/IDEA-20260417-001.md | IDEA |
| .plans/ideas/20-approved/SCREENING-20260417-001.md | sources/ideas/SCREENING-20260417-001.md | Screening (RICE) |
| .plans/features/active/dash-preview-phase3/ | sources/feature-package/ | Feature Package (Context + Package + Sources + DevNotes) |

Feature Package 내부 (sources/feature-package/):
- `00-context/` — 01-prd-freeze (PRD) / 02-decision-log / 03-bridge-wireframe / 04-bridge-stitch / 05-bridge-context / 06-architecture-binding / 07-routing-metadata
- `02-package/` — 00-overview / 01-requirements / 02-ui-spec / 06-domain-logic / 08-dev-tasks / 09-test-cases / 10-release-checklist
- `03-dev-notes/` — dev-verification-report / dev-output-summary
- `sources/` — spike-plan / spike-notes / wireframes (screens/components/navigation/decision-log)
- `evidence/` — 캡처 / manifest (있는 경우)

---

## 1. Feature 요약

`apps/landing` Hero 섹션의 **DashboardPreview 데모**를 Phase 1/2 의 2-column 축약 뷰에서 **Phase 3 의 AiPanel 380px + OrderForm 3-column grid + 조작감 10종 + AI_APPLY 2-beat 자동재생**으로 전환했다. Feature flag (`useDashV3`) 로 점진 도입 후 M5 closeout 에서 default ON 으로 승격. Phase 1/2 legacy 경로는 env / query opt-out 으로 회귀 가능.

### 1-1. 핵심 변경

| 영역 | Phase 1/2 | Phase 3 |
|------|-----------|---------|
| 레이아웃 | AiPanel 축약 + FormPreview 단일 2-col | AiPanel 380px + OrderForm 3-col grid |
| Step | 5-Step 18초 | **4-Step 6초** (INITIAL 500 + AI_INPUT 1500 + AI_EXTRACT 1000 + AI_APPLY 2500 + hold 500) |
| 조작감 | 없음 (정적 스냅) | **10종** (#1~#10) |
| AI_APPLY | 단일 fill | **2-beat** (partialBeat 4 카테고리 순차 + allBeat stroke/rolling/column pulse 동시) |
| Hit Areas | Desktop 11 / Tablet 6 (축약) | **Desktop = Tablet 19** (Tablet 축약 폐기) |
| Mobile | CardView | CardView (불변, dynamic import 로 청크 분리) |
| Feature Flag | 없음 | `useDashV3` (default ON, env/query opt-out) |

### 1-2. 조작감 10종 매핑

| # | 이름 | 훅 | 적용 대상 |
|:---:|---|---|---|
| 1 | fake-typing | `use-fake-typing.ts` | AiInputArea |
| 2 | focus-walk | `use-focus-walk.ts` | AiPanel Input → Extract → Results |
| 3 | button-press | `use-button-press.ts` | ExtractButton + AiButtonItem |
| 4 | ripple | `use-ripple.ts` + `triggerCenter` | AiButtonItem (자동 centered ripple) |
| 5 | hover | CSS only | AiResultButtons |
| 6 | fill-in caret | `use-fill-in-caret.ts` | Location/DateTime/Cargo/Estimate |
| 7 | dropdown beat | partialBeat.dropdownBeat prop | CargoInfoForm vehicle-type |
| 8 | number-rolling | `use-number-rolling.ts` | Estimate/Settlement 금액/거리/시간 |
| 9 | SVG stroke | CSS stroke-dashoffset + `use-trigger-at.ts` | TransportOptionCard 8옵션 |
| 10 | column pulse | `use-column-pulse.ts` | OrderForm col-1/col-2/col-3 |

---

## 2. Pipeline 이력

| 단계 | 일자 | 산출물 | 비고 |
|---|---|---|---|
| **P1 IDEA** | 2026-04-17 | IDEA-20260417-001 | IMP-DASH-001 Option B Phase 1 재진입 트리거 |
| **P2 Screening** | 2026-04-17 | SCREENING-20260417-001 (RICE 70.0) | Go / Standard |
| **P3 Draft** | 2026-04-17 | first-pass draft (integrated) | Lite/Standard 판정, copy/dev 분기 |
| **P4 PRD** | 2026-04-17 | `01-prd-freeze.md` (12 sections / 74 REQ) | REQ-DASH3-001~074 SSOT |
| **P5 Wireframe** | 2026-04-17 | `sources/wireframes/*` (screens/components/navigation/decision-log) | ASCII + Mermaid |
| **P6 Stitch** | — (skipped) | — | Wireframe 후 Stitch 대신 Bridge 직접 진입 |
| **P7 Bridge** | 2026-04-17 | `00-context/03~07`, `02-package/*` | Feature Package 생성 |
| **Dev Spike** | 2026-04-17 | 수직 슬라이스 1일 | #1/#3/#8 조작감 + 4-Step 골격 검증 |
| **Dev M1 기반** | 2026-04-17~18 | 9 TASK | mock-data / preview-steps / shell / interactions 유틸 6 / shadcn 5 / legacy 격리 / Hero 확장 / Mobile 분기 |
| **Dev M2 AiPanel** | 2026-04-19~20 | 9 TASK + review 3 | ai-panel 8 + #1/#3 + flow integration |
| **Dev M3 OrderForm** | 2026-04-20~21 | 12 TASK + review 3 | order-form 10 + #6/#7/#8/#9 + AI_APPLY 2-beat + UI 힌트 Caption |
| **Dev M4 조작감 나머지** | 2026-04-21~22 | 4 TASK + review 3 | #2/#4/#10 + hit-areas 19-area |
| **Dev M5 반응형/성능/접근성** | 2026-04-22 | 6 TASK + review 3 + default ON | axe-core 0 / reduced-motion 2단 fallback / 번들 12KB gz / Feature flag default 승격 |
| **`/dev-verify`** | 2026-04-22 | dev-verification-report.md (DVC-01~06 PASS, ERROR 0) | root commit `af9a0fe` |
| **`/dev-output-summary`** | 2026-04-22 | dev-output-summary.md | root commit `80af8c8` |
| **Archive** | 2026-04-22 | 본 번들 | |

---

## 3. 주요 기술 결정

### 3-1. Dumb Components + Framework-Free Core (REQ-DASH3-002, 007)
- ai-register-main 전 컴포넌트 stateless props. 내부 상태 0건.
- zustand / react-hook-form / react-query / next-navigation / `@/lib/api` import 0건 (grep 검증).
- Mock data + preview-steps 가 SSOT. 컴파일타임 4-Step 시퀀스 정의.

### 3-2. AI_APPLY 2-beat 구조 (REQ-DASH3-040~043)
- `partialBeat`: 4 카테고리 순차 (departure → destination → cargo → fare, 300ms × 4 = 1200ms)
- `allBeat`: transport stroke + number rolling + column 3 pulse 동시 (800ms)
- Total loop: 500 + 1500 + 1000 + 2500 + 500 = **6000ms** (REQ-DASH-011 "6~8초" 충족)

### 3-3. Feature Flag default ON 승격 (M5 closeout)
- M1-04 도입: default OFF (env/query 로 opt-in)
- `d7c1c76` commit: default ON 으로 반전 (opt-out 방향 전환)
- opt-out: env `legacy|phase1|phase2|off|0` 또는 query `?dashV3=0`
- query 가 env 보다 우선 (세션 명시 opt-in/out)

### 3-4. 동적 청크 분할 (REQ-DASH3-062)
- `AiRegisterMain = dynamic(() => import(...), { ssr: false })`
- Mobile (<768px) 조기 return → ai-register-main 청크 요청 0건
- 청크 크기: **12 KB gzipped** (목표 80~100KB 대비 큰 여유)

### 3-5. 접근성 2-단 fallback (REQ-DASH3-031, 064, 066)
- `app/globals.css` @media `prefers-reduced-motion: reduce` — CSS transition/animation 0.01ms
- `app/layout.tsx` MotionProvider (`<MotionConfig reducedMotion="user">`) — framer-motion JS 애니 duration 0
- JS 훅 가드 7종 (fake-typing / focus-walk / button-press / ripple / fill-in-caret / number-rolling / column-pulse)
- axe-core: 4 Step × 2 container = **0 violations**

### 3-6. Hit Areas 19-area 재작성 (M4-04)
- Phase 1/2: Desktop 11 + Tablet 6 (축약)
- Phase 3: Desktop = Tablet 동일 19 영역 (축약 폐기)
- `#11 form-company-manager`: `isEnabled=false` (pre-filled 읽기전용, hover 툴팁만 유지)

### 3-7. Phase 1/2 legacy 격리 (M1-07)
- `src/__tests__/dashboard-preview/legacy/` 디렉터리 분리
- `vitest.config.ts` include 패턴 토글 (LEGACY=true)
- default run 에서 legacy 제외, `LEGACY=true pnpm test` 로 양쪽 동시 검증

---

## 4. 핵심 지표

| 카테고리 | 지표 | 수치 |
|---|---|---|
| 테스트 | Phase 3 | 622 passed / 43 files |
| | LEGACY | 916 passed + 3 skipped / 58 files |
| | 커버리지 | ~85% (신규 파일) |
| 빌드 | `tsc --noEmit` | exit 0 |
| | `pnpm build` | exit 0 |
| 번들 | ai-register-main chunk | **12 KB gzipped** |
| | Route `/` | 60.8 KB |
| | First Load JS | 163 KB |
| 성능 | Dev LCP (Phase 3 ON) | 904 ms |
| | Production Lighthouse LCP | 미집행 (인프라 대기) |
| 접근성 | axe-core violations | 0 |
| | Landmark | aside + section[role=region] |
| 구조 | Forbidden imports | 0 |
| | Shared packages | 0 |
| | shadcn 컴포넌트 | 5 exact |

---

## 5. 관련 커밋 (landing 레포, CtrlCVbot)

### 5-1. Milestone 요약
- **Spike**: `2ebaf62` (수직 슬라이스 + cleanup `be2e997`)
- **M1 기반 (9 TASK)**: `157a24b` (M1-01 mock) → `a7b593b` (M1-02 steps) → `66f9f8b` (M1-03/04 shell + flag) → `M1-05 interactions` → `M1-06 shadcn` → `M1-07 legacy 격리` → `M1-08 hero` → `cf61f6b` (M1-09 Mobile dynamic)
- **M2 AiPanel (9 TASK + review 3)**: `2201ee1` ~ `ee41198` (11 commits)
- **M3 OrderForm (12 TASK + review 3)**: `bd359b5` ~ `2d80d16` (13 commits)
- **M4 조작감 + hit (4 TASK + review 3)**: `873b516` → `505f8ed` → `00103cb` → `73a7b0b` → `1f41c0d` → `a80de59` → `b88d723`
- **M5 반응형/성능/접근성 (6 TASK + review 3 + default ON)**: `a8eb698` → `44c867d` → `d7c1c76`

### 5-2. Root 레포 (mologado)
- `af9a0fe` docs(verify): /dev-verify dash-preview-phase3 — PASS
- `80af8c8` docs(summary): dev-output-summary.md

---

## 6. Post-release 권고

### 즉시 (이번 주)
- Production Lighthouse CI (M5-05 residual) — `next build && next start` LCP 측정
- apps/landing PR 생성 + staging merge + QA
- 실기기 QA (Desktop XL / Laptop / iPad / Android Chrome) 조작감 10종 수동 검증

### 단기 (1~2주)
- Phase 1/2 legacy 제거 결정 (staging 안정성 관찰 후)
- kit-improvements 2개 패키지 반영 (`.claude/docs/kit-improvements/20260417-dash-preview-phase3/` + `-retrospective/`)
- 문서 Back-propagation (dev-verification-report §Back-Propagation 제안 4건)

### 백로그
- Mobile CardView fidelity 보강 (현재 AI_APPLY 최종 스냅만)
- 조작감 #5 hover 디테일 튜닝
- 실시간 WebSocket 연동 데모
- 다국어 레이아웃 (일본어 / 영어)

---

## 7. 개선요청 이력

현재 없음. 후속 개선요청은 `.plans/archive/dash-preview-phase3/improvements/` 에 기록하거나 `/plan-improve dash-preview-phase3 "{제목}"` 으로 생성.

---

## 8. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-22 | 초안 — Archive 번들 생성 (Pipeline 이력 + 기술 결정 7개 + 지표 + 커밋 매핑 + post-release 권고) |
