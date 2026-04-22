# 요구사항 SSOT: dash-preview-phase3

> **Feature**: Dashboard Preview Phase 3
> **PRD 원문 (권위)**: [`../00-context/01-prd-freeze.md`](../00-context/01-prd-freeze.md)
> **Phase 1/2 요구사항 SSOT (승계)**: [`../../../../archive/dash-preview/sources/feature-package/02-package/01-requirements.md`](../../../../archive/dash-preview/sources/feature-package/02-package/01-requirements.md)
> **Created**: 2026-04-17

---

## 0. 이 문서의 역할

PRD의 REQ 목록을 **TASK 친화 형태**로 정리한다. TASK 매핑·TC 매핑·우선순위·수용 기준을 한눈에 볼 수 있게 구조화. **PRD 원문을 재복제하지 않고** 각 REQ의 목적·수용 기준 요약 + TASK/TC ID만 유지.

상세 수용 기준(타이밍 값, 스타일 상수, 원본 라인 번호 등)은 **PRD 섹션 참조 링크**를 따라간다.

---

## 1. REQ ID 체계

| 접두어 | 범위 | 설명 |
|--------|------|------|
| `REQ-DASH-NNN` | 001~045 | Phase 1/2에서 확립된 요구사항. Phase 3는 **수정 범위만 명시**. |
| `REQ-DASH3-NNN` | 001~074 sparse | Phase 3 신규 (복제/데이터모델/조작감/2단/아키/성능/테스트 7 그룹) |

TASK/TC ID 체계:
- TASK: `T-DASH3-{Mn}-{NN}` (M0 = Spike, M1~M5)
- TC: `TC-DASH3-{범주}-{NN}` (UNIT / INT / A11Y / PERF / SSOT)

---

## 2. Phase 1/2 REQ 수정 범위 (REQ-DASH-NNN)

본 Phase 3에서 **수정/확장되는** REQ-DASH-NNN만 명시. 수정되지 않는 REQ는 그대로 승계.

### 2-1. 구조·레이아웃 수정

| REQ ID | 수정 유형 | 수정 내용 요약 | TASK | TC |
|--------|-----------|----------------|------|-----|
| REQ-DASH-003 | 확장 | AiPanel 380px + OrderForm **3-column grid** (원본 `register-form.tsx:939` 1:1) | T-DASH3-M1-03, T-DASH3-M3-01 | TC-DASH3-INT-GRID |
| REQ-DASH-005 | 확장 | AiInputArea 타이핑 → **#1 변동 리듬 타이핑** | T-DASH3-M2-03 | TC-DASH3-UNIT-TYP |
| REQ-DASH-006 | 확장 | AiResultButtons 4카테고리 + 관련 4 파일 (ai-button-item, warning, json-viewer) | T-DASH3-M2-05~08 | TC-DASH3-UNIT-RESBT |
| REQ-DASH-007 | 확장 | OrderForm 3-col 배치: Col 1 (Company/Loc상차/Loc하차) / Col 2 (예상거리/DateTime2-col/Cargo) / Col 3 (Transport/Estimate/Settlement) | T-DASH3-M3-01 | TC-DASH3-INT-COLS |
| REQ-DASH-008 | 수정 | AI 적용 → #4 ripple + #6 fill-in + #8 number-rolling 결합 | T-DASH3-M3-10 | TC-DASH3-INT-APPLY |
| REQ-DASH-009 | 승격 (Should→Must) | 운임 카운팅 → **#8 standard**, Must | T-DASH3-M3-07 | TC-DASH3-UNIT-ROLL |
| REQ-DASH-010 | 축소 | 5-Step → **4-Step** (COMPLETE 제거) | T-DASH3-M1-02 | TC-DASH3-UNIT-STEPS |
| REQ-DASH-011 | 재조정 | 총 루프 **6~8초** (기존 13~18초에서 50% 단축) | T-DASH3-M2-12 + M3-12 | TC-DASH3-PERF-LOOP |
| REQ-DASH-013 | 재정의 | cross-fade → **오버랩 100~200ms** | T-DASH3-M2-12 | TC-DASH3-INT-OVERLAP |
| REQ-DASH-014 | 수정 | Step Indicator **4-dot** | T-DASH3-M1-04 | TC-DASH3-UNIT-IND |
| REQ-DASH-023/024 | 재조정 | Desktop **0.45** + 3-col / **Tablet 0.40 + 3-col 유지 C안** / Mobile MobileCardView 불변 | T-DASH3-M5-01 | TC-DASH3-PERF-SCALE |
| REQ-DASH-026 | 삭제 예정 | MobileCardView 내부 Step 매핑 4단계 구조 재검토 → 본 Bridge에서 **유지 확정 (AI_EXTRACT + AI_APPLY 완료 2단계)** | T-DASH3-M5-02 | TC-DASH3-INT-MOBILE |
| REQ-DASH-027 | 재정의 | `prefers-reduced-motion` 시 각 Step 최종 스냅 + 조작감 10종 모두 즉시 스냅 | T-DASH3-M5-06 | TC-DASH3-A11Y-REDMO |
| REQ-DASH-030 | 재협상 | 번들 30KB → **80~100KB** (Q1 수용) | T-DASH3-M5-04 | TC-DASH3-PERF-BUNDLE |
| REQ-DASH-037 | 확장 | 히트 11개 → **19~20개** (AiPanel 9 + OrderForm 10 + Dialog 1) | T-DASH3-M4-04 | TC-DASH3-UNIT-HITAREA |

---

## 3. Phase 3 신규 REQ (REQ-DASH3-NNN)

각 REQ의 **한 줄 요약 + 수용 기준 핵심 + TASK/TC 매핑**만 기록. 상세는 PRD §5-{subsection} 참조.

### 3-1. 복제 범위 확장 (REQ-DASH3-001~007) — PRD §5-2

| REQ | 우선순위 | 한 줄 요약 | TASK | TC |
|-----|:-------:|-----------|------|-----|
| REQ-DASH3-001 | Must | page.tsx main 영역 DOM 계층/클래스/Tailwind 1:1 복제 → 시각 diff 95%+ | T-DASH3-M1-03 + M2/M3 전체 | TC-DASH3-INT-DOM |
| REQ-DASH3-002 | Must | 모든 복제 컴포넌트 stateless + props 주입, zustand/RHF/react-query/next-navigation/api 0건 | 전 TASK 공통 | TC-DASH3-INT-NOSTATE |
| REQ-DASH3-003 | Must | AiPanel 8 파일 복제: ai-panel / tab-bar / input-area / extract-button / result-buttons / button-item / warning-badges / json-viewer | T-DASH3-M2-01~08 | TC-DASH3-INT-AIPANEL |
| REQ-DASH3-004 | Must | OrderForm 9 파일 복제 (8 섹션 + register-success-dialog 파일만, open=false 고정) | T-DASH3-M3-01~08 | TC-DASH3-INT-ORDERFORM |
| REQ-DASH3-005 | Should | search-address-dialog, company-manager-dialog 닫힌 상태 시각 스냅샷만 | T-DASH3-M3-09 | TC-DASH3-INT-DIALOG |
| REQ-DASH3-006 | Must | register-summary.tsx 제외 (복제 안 함) | (작업 없음) | TC-DASH3-INT-NOSUMMARY |
| REQ-DASH3-007 | Must | 외부 import 제거: `@/store/*`, `react-hook-form`, `@tanstack/react-query`, `next/navigation`, `@/lib/api/*` | 전 복제 TASK 공통 | TC-DASH3-INT-IMPORTS |

### 3-2. 데이터 모델 + Step 스냅샷 (REQ-DASH3-010~014) — PRD §5-3

| REQ | 우선순위 | 한 줄 요약 | TASK | TC |
|-----|:-------:|-----------|------|-----|
| REQ-DASH3-010 | Must | mock-data.ts 스키마를 Phase 1 스펙 §6 기준 확장 | T-DASH3-M1-01 | TC-DASH3-UNIT-MOCKSCHEMA |
| REQ-DASH3-011 | Must | preview-steps.ts 4단계 + interactions 타이밍 트랙 (`typingRhythm`, `focusWalk`, `pressTargets`, `fillInFields`, **`partialBeat`, `allBeat`** — 안 B 반영) | T-DASH3-M1-02 | TC-DASH3-UNIT-PREVIEWSTEPS |
| REQ-DASH3-012 | Must | Step 변화 매트릭스 Phase 1 스펙 §7-3 준수 | T-DASH3-M1-02 | TC-DASH3-INT-MATRIX |
| REQ-DASH3-013 | Must | SuccessDialog `open=false` 고정 (Phase 1 범위) | T-DASH3-M3-08 | TC-DASH3-UNIT-SUCCESSOFF |
| REQ-DASH3-014 | Must | CompanyManagerSection pre-filled (옵틱물류/이매니저), mock 값 SSOT는 wireframe decision-log §4-3. 전 Step 동일 값 유지 | T-DASH3-M1-01 + M3-02 | TC-DASH3-SSOT-MOCK + TC-DASH3-INT-PREFILLED |

### 3-3. 조작감 시각 레이어 MVP 4종 (REQ-DASH3-020~023) — PRD §5-4

| REQ | # | Must | 한 줄 요약 | TASK | TC |
|-----|:-:|:----:|-----------|------|-----|
| REQ-DASH3-020 | 1 | Must | `use-fake-typing` — 고유명사 느리게/조사 빠르게, ≤ 1.5s 완성 | T-DASH3-M1-05 (유틸) + T-DASH3-M2-03 (적용) | TC-DASH3-UNIT-TYP |
| REQ-DASH3-021 | 3 | Must | `use-button-press` — scale 0.97 + shadow 150ms | T-DASH3-M1-05 + M2-04 | TC-DASH3-UNIT-PRESS |
| REQ-DASH3-022 | 6 | Must | `use-fill-in-caret` — Location/Cargo/DateTime, caret 150~200ms + 값 즉시. **CompanyManager 제외 (REQ-DASH3-014)** | T-DASH3-M1-05 + M3-02~06 | TC-DASH3-UNIT-FILLIN + TC-DASH3-INT-PREFILLED-SKIP |
| REQ-DASH3-023 | 8 | Must | `use-number-rolling` — Estimate 거리/운임 + Settlement 합계, 0.3~0.5초 | T-DASH3-M1-05 + M3-07/M3-08 | TC-DASH3-UNIT-ROLL |

### 3-4. 조작감 Nice-to-have 6종 (REQ-DASH3-024~031) — PRD §5-4

| REQ | # | 우선 | 한 줄 요약 | TASK | TC |
|-----|:-:|:---:|-----------|------|-----|
| REQ-DASH3-024 | 2 | Should | `use-focus-walk` — Input → Extract → Result 순차 outline 4px | T-DASH3-M1-05 + M4-01 | TC-DASH3-UNIT-FOCUS |
| REQ-DASH3-025 | 4 | Should | `use-ripple` — 원형 wave 300ms | T-DASH3-M1-05 + M4-02 | TC-DASH3-UNIT-RIPPLE |
| REQ-DASH3-026 | 5 | Should | CSS only hover 전환 | T-DASH3-M2-05 | TC-DASH3-UNIT-HOVER |
| REQ-DASH3-027 | 7 | Should | dropdown 열림-하이라이트-닫힘 3 beat, 600ms | T-DASH3-M3-05 | TC-DASH3-UNIT-DROP |
| REQ-DASH3-028 | 9 | Should | `stroke-dashoffset` 애니 200ms (TransportOption 8 + 자동배차) | T-DASH3-M3-06 | TC-DASH3-UNIT-STROKE |
| REQ-DASH3-029 | 10 | Should | **Column-wise Border Pulse** — 3-col 활성 섹션 outline + shadow 400ms (기존 Section Scroll Snap 폐기) | T-DASH3-M3-01 + M4-03 | TC-DASH3-INT-COLPULSE |
| REQ-DASH3-030 | — | Must | 유틸 6개 각각 독립 파일 (`use-fake-typing/button-press/focus-walk/ripple/fill-in-caret/number-rolling.ts`) | T-DASH3-M1-05 | TC-DASH3-UNIT-UTILS |
| REQ-DASH3-031 | — | Must | `prefers-reduced-motion` 시 조작감 10종 모두 duration=0 | T-DASH3-M5-06 | TC-DASH3-A11Y-REDMO |

### 3-5. AI_APPLY 2단 구조 (REQ-DASH3-040~044) — PRD §5-5

| REQ | 우선 | 한 줄 요약 | TASK | TC |
|-----|:---:|-----------|------|-----|
| REQ-DASH3-040 | Must | 파트별 적용 → 전체 적용 2단 연출 | T-DASH3-M3-10 | TC-DASH3-INT-2BEAT |
| REQ-DASH3-041 | Must | 안 B (내부 타임라인 분할) 확정 (wireframe §1-1) | T-DASH3-M1-02 | TC-DASH3-UNIT-ABPLAN |
| REQ-DASH3-042 | Should | 파트별: 상차지→하차지→화물→운임 150~250ms 간격, ≤ 1.5s | T-DASH3-M3-10 | TC-DASH3-INT-PARTIAL |
| REQ-DASH3-043 | Should | 전체: TransportOption 8 + 자동배차 + Settlement 청구/지급/추가/합계 80~120ms 간격, ≤ 0.6s. **담당자 연락처 제외 (REQ-DASH3-014)** | T-DASH3-M3-10 | TC-DASH3-INT-ALL |
| REQ-DASH3-044 | Must | UI 힌트 "골라 받을 수도, 한 번에 받을 수도 있다" — Preview 외곽 직하 inline caption, AI_APPLY 중 opacity 0→1 200ms fade-in (wireframe §1-2) | T-DASH3-M3-11 | TC-DASH3-INT-HINT |

### 3-6. 아키텍처/파일 구조 (REQ-DASH3-050~053) — PRD §5-6

| REQ | 우선 | 한 줄 요약 | TASK | TC |
|-----|:---:|-----------|------|-----|
| REQ-DASH3-050 | Must | Phase 1 스펙 §5 파일 구조 준수 (ai-register-main/ai-panel + order-form + interactions + ui) | T-DASH3-M1-04 | TC-DASH3-INT-STRUCTURE |
| REQ-DASH3-051 | Must | shadcn 3-C 하이브리드 5 컴포넌트만 (Button/Input/Textarea/Card/Badge). Select/Dialog/Popover/Calendar/Checkbox 미도입 | T-DASH3-M1-06 | TC-DASH3-INT-SHADCN |
| REQ-DASH3-052 | Should | Feature flag 병행 운영 구조 (env/prop 토글) | T-DASH3-M5-03 | TC-DASH3-INT-FLAG |
| REQ-DASH3-053 | Must | dashboard-preview.tsx / preview-chrome.tsx 외곽 재사용, 내부 콘텐츠만 교체 | T-DASH3-M1-04 | TC-DASH3-INT-CHROME |

### 3-7. 성능/접근성/국제화 (REQ-DASH3-060~066) — PRD §5-7

| REQ | 우선 | 한 줄 요약 | TASK | TC |
|-----|:---:|-----------|------|-----|
| REQ-DASH3-060 | Must | Dashboard Preview chunk 80~100KB gzipped, 전체 First Load JS ≤ 252KB | T-DASH3-M5-04 | TC-DASH3-PERF-BUNDLE |
| REQ-DASH3-061 | Must | LCP +100ms 미만, `ai-register-main`은 Hero 진입 후 `requestIdleCallback`/`transition.delay: 0.6` | T-DASH3-M5-05 | TC-DASH3-PERF-LCP |
| REQ-DASH3-062 | Must | Dynamic import Mobile/Desktop 분할. Mobile에서 `ai-register-main` 청크 로드 0건 | T-DASH3-M5-02 | TC-DASH3-PERF-MOBILE |
| REQ-DASH3-063 | Must | Step duration 상한: INITIAL ≤ 500 / AI_INPUT ≤ 2000 / AI_EXTRACT ≤ 1000 / AI_APPLY ≤ 2500 ms | T-DASH3-M2-12 + M3-12 | TC-DASH3-PERF-STEPDUR |
| REQ-DASH3-064 | Must | axe-core 스캔 통과 (aria-label, 키보드 탐색 REQ-DASH-027~029 승계) | T-DASH3-M5-06 | TC-DASH3-A11Y-AXE |
| REQ-DASH3-065 | Should | 모든 mock 텍스트 한국어 기본, i18n 대응 구조 (mock-data.ts 중앙 관리) | T-DASH3-M1-01 | TC-DASH3-UNIT-LOCALE |
| REQ-DASH3-066 | Should | WCAG AA 색상 대비 | T-DASH3-M5-06 | TC-DASH3-A11Y-CONTRAST |

### 3-8. 테스트 전략 (REQ-DASH3-070~074) — PRD §5-8

| REQ | 우선 | 한 줄 요약 | TASK | TC |
|-----|:---:|-----------|------|-----|
| REQ-DASH3-070 | Must | Phase 3 신규 컴포넌트 TDD, 커버리지 80%+ | 전 TASK 공통 | — (커버리지 보고서) |
| REQ-DASH3-071 | Must | 기존 Phase 1/2 테스트 300개 **legacy 격리** (Q7 해소 — **A안 확정**). `legacy/` 디렉터리 이동 + `vitest.config.ts` include 재구성 | **`T-DASH3-M1-07`** | TC-DASH3-INT-LEGACY |
| REQ-DASH3-072 | Must | 유틸 6개 × 최소 2개 테스트 (단위 + 타이밍 검증). CSS 4종은 렌더링 테스트 1건 | T-DASH3-M1-05 (유틸 TDD 동반) + M2/M3/M4 | TC-DASH3-UNIT-* |
| REQ-DASH3-073 | Must | AI_APPLY 2단 구조 통합 테스트 (4단계 시퀀스 렌더링) | T-DASH3-M3-10 | TC-DASH3-INT-2BEAT |
| REQ-DASH3-074 | Must | Spike 단계에서 AiPanel + 조작감 #1/#3 검증 테스트 선행 | T-DASH3-SPIKE-01 | TC-DASH3-SPIKE-* |

---

## 4. 우선순위 매트릭스

| 우선순위 | 개수 | 주요 ID |
|---------|:---:|---------|
| **Must** (MVP 필수) | **36** | 001~007, 010~014, 020~023, 030, 031, 040, 041, 044, 050, 051, 053, 060~064, 070~074 |
| **Should** (NTH) | **11** | 005, 024~029, 042, 043, 052, 065, 066 |
| **수정 승계 (Phase 1/2)** | **16** | REQ-DASH-003/005/006/007/008/009/010/011/013/014/023/024/026/027/030/037 |
| **합계** | **63** (신규 47 + 수정 16) | |

---

## 5. TASK → REQ 역추적 매트릭스 (요약)

| TASK 그룹 | 커버 REQ |
|-----------|----------|
| **Spike** (T-DASH3-SPIKE-01) | REQ-DASH3-074 + 부분적으로 001/003/010/011/014/020/021/023 (수직 슬라이스) |
| **M1 기반** (T-DASH3-M1-01~06) | REQ-DASH3-010, 011, 012, 014, 030, 050, 051, 053 + REQ-DASH-014 |
| **M2 AiPanel** (T-DASH3-M2-01~12) | REQ-DASH3-003, 020, 021, 025 + REQ-DASH-005, 006 |
| **M3 OrderForm** (T-DASH3-M3-01~12) | REQ-DASH3-004, 005, 006, 007, 013, 022, 023, 027, 028, 040, 041, 042, 043, 044 + REQ-DASH-007, 008, 009 |
| **M4 조작감+히트** (T-DASH3-M4-01~04) | REQ-DASH3-024, 025, 026, 029 + REQ-DASH-037 |
| **M5 반응형+성능** (T-DASH3-M5-01~06) | REQ-DASH3-031, 052, 060, 061, 062, 063, 064, 065, 066 + REQ-DASH-023, 024, 026, 027, 030 |

상세 TASK 정의는 [`08-dev-tasks.md`](./08-dev-tasks.md).

---

## 6. 잔여 선결 질문 (Q# → REQ 영향)

| Q# | 질문 | 상태 | 영향 REQ |
|----|------|------|----------|
| Q1 | 번들 예산 80~100KB | **해소** (2026-04-17) | REQ-DASH3-060 |
| Q2 | broker 통합 일정 | **미해소** (Option A 별도 Feature) | REQ-DASH3-050 — Future Migration Alignment 경계 설계 유지 (06-architecture-binding.md §4-1) |
| Q3 | shadcn 3-C 하이브리드 | **해소** | REQ-DASH3-051 |
| Q7 | 테스트 legacy 격리 | **해소 (Phase B, A안)** | REQ-DASH3-071 → `T-DASH3-M1-07` |
| Q9 | 조작감 MVP 4종 | **해소** | REQ-DASH3-020~023 |

---

## 7. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-04-17 | 초안 — REQ-DASH-NNN 16개 수정 + REQ-DASH3-NNN 47개 신규 TASK/TC 매핑, 우선순위 36 Must + 11 Should + 16 수정, 잔여 Q 5건 상태 |
| 2026-04-17 | Phase C — REQ-DASH3-071 TASK `T-DASH3-M1-07` 연결, Q7 상태 "해소 (Phase B, A안)" 갱신 |
