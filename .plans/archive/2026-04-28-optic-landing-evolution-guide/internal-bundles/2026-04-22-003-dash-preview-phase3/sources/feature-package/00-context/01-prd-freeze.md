# PRD: dash-preview Phase 3 — Pixel-Perfect Preview (AI 화물 등록 조작감 강화)

> **Slug**: `dash-preview-phase3`
> **IDEA**: [IDEA-20260417-001](../../../../ideas/20-approved/IDEA-20260417-001.md)
> **Screening**: [SCREENING-20260417-001](../../../../ideas/20-approved/SCREENING-20260417-001.md) (Go, 70.0, Standard)
> **Status**: prd-draft
> **Created**: 2026-04-17
> **Author**: plan-prd-writer
> **시나리오**: C (충실도 교정) — Spike 결과에 따라 A 전환 여지 유지
> **Feature 유형**: Hybrid (reference-only) — `/copy-reference-refresh`만 사용
> **규모**: Standard (6개 트리거 충족)

---

## 참고 문서 (권위 순)

> 본 PRD는 아래 문서의 내용을 **재복제하지 않고 섹션 참조**로 처리한다.

| # | 문서 | 역할 |
|---|------|------|
| 1 | [IMP-DASH-001-option-b-spec-phase1.md](../../../../archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md) | **절대 권위** — 실행 범위, 복제 매니페스트, 조작감 레이어, Milestone, 리스크 원본 |
| 2 | [first-pass.md](../../../drafts/dash-preview-phase3/first-pass.md) | 1차 기획 |
| 3 | [07-routing-metadata.md](./07-routing-metadata.md) | 라우팅 판정 (Standard / C / Hybrid) |
| 4 | [IDEA-20260417-001.md](../../../../ideas/20-approved/IDEA-20260417-001.md) | 승인 IDEA |
| 5 | [SCREENING-20260417-001.md](../../../../ideas/20-approved/SCREENING-20260417-001.md) | 스크리닝 (70.0 / Go) |
| 6 | [IMP-DASH-001-option-b-spec.md](../../../../archive/dash-preview/improvements/IMP-DASH-001-option-b-spec.md) | 참고 (Option B 원본) |
| 7 | [IMP-DASH-001.md](../../../../archive/dash-preview/improvements/IMP-DASH-001.md) | 참고 (문제정의/옵션 비교) |
| 8 | [dash-preview 01-requirements.md](../../../../archive/dash-preview/sources/feature-package/02-package/01-requirements.md) | Phase 1/2 SSOT (REQ-DASH-001~045, 본 PRD 수정 대상) |

### REQ ID 체계

| 접두어 | 범위 | 설명 |
|---|---|---|
| `REQ-DASH-NNN` | 기존 (001~045) | Phase 1/2에서 확립된 요구사항. 본 PRD는 **수정 범위만 명시**하고 재복제하지 않음. |
| `REQ-DASH3-NNN` | 신규 (001~) | Phase 3에서 새로 추가되는 요구사항 (전체 복제 + 조작감 레이어 + AI_APPLY 2단 구조) |

---

## 1. Overview

랜딩의 `DashboardPreview`를 ai-register main 콘텐츠 영역의 **전체 시각 모형 복제 + 조작감 시각 레이어 10종**으로 업그레이드한다. Phase 1/2의 축약 구조를 벗어나 Cursor.com `demo-window-cursor-ide` 이상의 체감 품질을 목표로 한다.

- **복제 범위**: `.references/code/mm-broker/app/broker/order/ai-register/` 하위 AiPanel + OrderForm 전체 섹션 (21+ 컴포넌트). 상세 매니페스트는 [Phase 1 스펙 §3](../../../../archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md#3-복제-대상-매니페스트) 참조.
- **시연 플로우**: `INITIAL → AI_INPUT → AI_EXTRACT → AI_APPLY` 4단계. COMPLETE 단계는 Phase 4 유보.
- **조작감**: 시각 피드백 전용 레이어 10종. MVP 4종(#1/#3/#6/#8) 필수 + Nice-to-have 6종 단계 적용.
- **차별점**: 원본은 운영 URL이 아닌 **소스 코드 참조**. 따라서 일반 copy live 캡처 워크플로우 대신 **Phase 1 스펙을 spec source로 하는 Hybrid (reference-only) 모드**로 운영한다.

---

## 2. Problem Statement

### 2-1. 현재 상태 (Phase 1/2)

- `DashboardPreview`는 AiPanel + OrderForm을 **단순 재구성**한 축약 뷰. 실제 ai-register 구조와 시각 DIFF가 존재.
- 5단계 자동 재생과 11개 히트 영역 인터랙티브 모드는 동작하나, **조작감(체감 피드백)이 부재**. 버튼 클릭·타이핑·필드 채움이 "살아있는 느낌"을 주지 못한다.
- Cursor.com `demo-window-cursor-ide` 대비 픽셀 정확도·동작 생동감 모두 열위.

### 2-2. 발생하는 문제

| 구분 | 내용 |
|---|---|
| **신뢰감 갭** | 실제 OPTIC 사용자 또는 시연 경험자가 진짜 제품과 차이를 즉시 인식한다. 랜딩 설득력 저하. |
| **전환율 저항** | "비슷한 느낌"에 그쳐 방문자가 제품 완성도에 확신을 가지지 못한다. |
| **메시지 전달 실패** | "AI가 화물 등록을 대신한다"는 핵심 가치 제안을 시각적으로 증명하지 못한다. |
| **자산 재사용 불가** | 현재 축약 뷰는 영업/마케팅 스크린샷으로 활용하기에 품질이 부족. |

### 2-3. 해결 접근

**실제 구조 복제 + 시각 피드백 전용 레이어**의 이중 전략 (IMP-DASH-001 Option B 확정). **"끊김 없는 연속 동작" 원칙**으로 스크린샷 나열 인상을 제거한다.

- **복제**: DOM/스타일을 1:1 복제하되 비즈니스 로직(zustand/RHF/API)은 제거, stateless props 주입으로 전환.
- **조작감 레이어**: state 변경/API 호출 없이 `transform`/`opacity` 애니메이션만으로 타이핑·버튼 press·필드 fill-in·숫자 롤링 등 10종의 체감 피드백을 부여.
- **연속 동작 원칙** (신규): 각 Step·beat 간 경계를 숨기고 **"클릭 → 즉시 반응 → 자연스러운 이어짐"** 단일 흐름으로 시연. 총 루프 **6~8초** 범위에서 각 단계 duration을 짧게 잡고, Step 전환은 cross-fade가 아닌 **오버랩**으로 구성한다.

---

## 3. Goals & Non-Goals

### 3-1. Goals

| # | 목표 | 측정 |
|---|---|---|
| G1 | 실제 ai-register와 **픽셀 정확도 95%+** 일치 (AI_APPLY 완료 구간 기준, COMPLETE 제외) | Phase 1 스펙 §16 정량 지표 |
| G2 | Cursor.com `demo-window-cursor-ide` **이상의 체감 품질** — 스크린샷 나열이 아닌 **연속 동작의 단일 흐름** | 내부 블라인드 테스트 "실제 앱처럼 느껴짐" 4/5+ + "스크린샷 나열 아님" 합의 판정 |
| G3 | **조작감 MVP 4종**(#1 변동 리듬 타이핑, #3 Button Press, #6 Fill-in Caret, #8 숫자 카운터 롤링) 필수 탑재 | 4종 모두 구현 + `prefers-reduced-motion` fallback |
| G4 | AI_APPLY 단계의 **"파트별 적용 → 전체 적용" 2단 구조** 시연 | 채택 방향 권고: 안 **B (내부 타임라인 분할)** / 최종 확정: `/plan-wireframe` 단계 |
| G5 | 번들/LCP 예산 준수 — Dashboard Preview chunk **80~100KB**, LCP +100ms 미만 | Lighthouse CI |
| G6 | 기존 Phase 1/2의 **인터랙티브 모드와 MobileCardView 유지** (회귀 금지) | 기존 REQ-DASH-033~045 호환 |

### 3-2. Non-Goals

- **COMPLETE 단계(등록 확정 연출)** — Phase 4 유보. RegisterSuccessDialog는 **파일 복제만** 하고 플로우에서 호출하지 않는다.
- **서사 아이디어 8종** (시간 압축 지표, 실패 케이스 노출, 주인공 설정, Before/After, 입력 소스 다변화, Evidence 하이라이트, Hero 카피 연결, 가이드 투어) — Phase 2(후속) 유보.
- **비즈니스 로직 이식** — zustand/RHF/react-query/API 호출은 전부 제거. 실제 화물 등록 기능 아님.
- **모바일 정밀 조작감** — MobileCardView는 Phase 1/2 구조 유지, 조작감 레이어 적용 안 함.
- **원본 broker 앱 통합** — Option A 전환은 Q2 해소 후 별도 Feature로 처리.

---

## 4. User Stories

### 4-1. Primary

- **As a** 주선사 의사결정자, **I want** 랜딩에서 실제 제품 수준의 화면을 체감으로 확인하고 싶다, **so that** OPTIC 완성도를 즉각 판단하고 도입 의사결정 시간을 단축할 수 있다.
- **As a** 브로커 실무자(기존 OPTIC 사용자), **I want** 랜딩 demo와 실제 제품 간 차이를 느끼지 않고 싶다, **so that** 제품 일관성에 대한 신뢰를 유지할 수 있다.
- **As a** 랜딩 방문자, **I want** 버튼·타이핑·필드 채움이 살아있는 느낌으로 동작하는 demo를 보고 싶다, **so that** "정적 모형"이 아닌 "실제 동작 캡처"로 인식할 수 있다.

### 4-2. Secondary

- **As a** 사내 영업/마케팅 담당자, **I want** demo 화면을 스크린샷처럼 재사용 가능하고 싶다, **so that** 별도 캡처 자산 관리 부담 없이 영업 자료를 만들 수 있다.
- **As a** 프론트엔드 유지보수자, **I want** broker 원본과 landing 복제본의 drift를 분기별로 추적할 수 있다, **so that** 원본 업데이트 시 복제본 동기화 비용을 통제할 수 있다.

---

## 5. Functional Requirements

### 5-1. 기존 REQ-DASH-NNN 수정 범위

Phase 1/2에서 확립된 요구사항 중 Phase 3에서 **수정/확장**되는 항목만 명시한다. 수정되지 않는 REQ는 그대로 승계한다.

| REQ ID | 수정 유형 | 수정 내용 | 근거 |
|---|---|---|---|
| REQ-DASH-003 | **확장** | "AiPanel 380px + OrderForm flex-1 2열" → **AiPanel 380px + OrderForm 3-column grid 전 섹션** (원본 `register-form.tsx:939` `grid-cols-1 lg:grid-cols-3` 1:1 재현). AiPanel 8 파일 + OrderForm 9 파일. | Phase 1 스펙 §1-1, §3, 원본 register-form.tsx:939 |
| REQ-DASH-005 | **확장** | AiInputArea text 타이핑 → **조작감 #1 변동 리듬 타이핑**(고유명사 느리게, 조사 빠르게)로 교체. | Phase 1 스펙 §11-2 |
| REQ-DASH-006 | **확장** | AiResultButtons 4카테고리(상차/하차/화물/운임) → Phase 1 스펙 §3 `ai-result-buttons.tsx` + `ai-button-item.tsx` + `ai-warning-badges.tsx` + `ai-extract-json-viewer.tsx` 포함. | Phase 1 스펙 §3 |
| REQ-DASH-007 | **확장** | OrderForm 축약 Card → **3-column grid 레이아웃**으로 전 섹션 배치: **Col 1** CompanyManagerSection + LocationForm(상차지) + LocationForm(하차지) / **Col 2** (예상거리 Info) + DateTimeCard 상·하차 2-col + CargoInfoForm / **Col 3** TransportOptionCard + EstimateInfoCard + SettlementSection. 원본 `register-form.tsx:939~1302` 구조 재현. | Phase 1 스펙 §3, §5, 원본 register-form.tsx |
| REQ-DASH-008 | **수정** | AI 적용 단계 버튼 색상 전환 + 필드 채움 → **조작감 #4 ripple + #6 fill-in caret + #8 숫자 카운터 롤링** 연출 결합. | Phase 1 스펙 §7-3 Step 변화 매트릭스 |
| REQ-DASH-009 | **승격 Should → Must** | 운임 카운팅 → **조작감 #8 숫자 카운터 롤링**으로 표준화. Must로 승격 (MVP 포함). | Phase 1 스펙 §11-3 |
| REQ-DASH-010 | **축소** | 5단계 → **4단계 (`INITIAL → AI_INPUT → AI_EXTRACT → AI_APPLY`)**. COMPLETE 제거. | Phase 1 스펙 §1-1 |
| REQ-DASH-011 | **재조정** | 단계별 duration **대폭 단축** — 스크린샷 나열 인상 제거, 자연스러운 연속 동작 확보. 4단계 총 루프 목표 **6~8초** (기존 13~18초에서 약 50% 단축). 정확한 값은 `/plan-wireframe`에서 확정. | Phase 1 스펙 §7, 피드백 2026-04-17 |
| REQ-DASH-013 | **재정의** | Step 전환 Framer Motion **cross-fade → 경계 없는 오버랩**으로 변경. 앞 Step의 조작감 종료와 다음 Step의 첫 동작이 **100~200ms 오버랩**하여 "클릭 → 즉시 반응" 체감을 확보한다. | 피드백 2026-04-17 |
| REQ-DASH-014 | **수정** | 5단계 Step Indicator → **4단계**. | REQ-DASH-010 변경 동기화 |
| REQ-DASH-023/024 | **재조정** | Desktop scale **0.45** + 3-column grid 유지 / Tablet scale **0.40** + **3-column 유지** (원본 `lg:grid-cols-3` breakpoint와 의도적 divergence — C안 가독성 절충). Mobile은 MobileCardView 불변. | Phase 1 스펙 §9, 피드백 2026-04-17 |
| REQ-DASH-026 | **삭제 예정** | 모바일 "Step 3/5 2단계 전환" → **MobileCardView는 전체 유지하되 내부 Step 매핑을 4단계 구조에 맞춰 재검토**. 최종 결정 `/plan-wireframe`. | §6 UX에서 후속 판단 |
| REQ-DASH-027 | **재정의** | 원 REQ는 `prefers-reduced-motion` 시 **Step 5 COMPLETE 단일 상태** 표시였으나, 4단계 축소(REQ-DASH-010)로 대상 범위를 **각 Step 최종 상태로 즉시 스냅**으로 재정의. 또한 `prefers-reduced-motion` 대응에 **조작감 10종 모두 포함**하도록 확장. | Phase 1 스펙 §11-1, §14 R9 |
| REQ-DASH-030 | **재협상 완료** | 번들 **30KB → 80~100KB** (Q1 수용 확정). | IDEA 재판정 2026-04-17 |
| REQ-DASH-037 | **확장** | 11개 히트 영역 → **Phase 1 스펙 §10** 기준 AI Panel 7~8 + Form 10 + Dialog 2 = 최대 **19~20개**. AI_APPLY 경로 우선 활성화. | Phase 1 스펙 §10 |

### 5-2. 신규 요구사항 — 복제 범위 확장

| REQ ID | 요구사항 | 우선순위 | 수용 기준 |
|---|---|---|---|
| REQ-DASH3-001 | `page.tsx` main 영역 내부 구조를 **Phase 1 스펙 §3 매니페스트** 기준으로 1:1 복제한다. DOM 계층/클래스명/Tailwind 유틸/간격은 원본과 동일. | Must | diff 도구로 DOM 구조 비교 시 의미 차이 0건. 시각 diff 95%+ |
| REQ-DASH3-002 | 모든 복제 컴포넌트는 **stateless + props 주입** 원칙을 준수한다. `useEffect`는 애니메이션 타이밍에만 허용. | Must | zustand/RHF/react-query/next-navigation/api client import 0건. grep 통과 |
| REQ-DASH3-003 | AiPanel 하위 **8개 파일**(핵심 6개 + `ai-warning-badges.tsx` + `ai-extract-json-viewer.tsx`)을 모두 복제한다: `ai-panel.tsx`, `ai-tab-bar.tsx`, `ai-input-area.tsx`, `ai-extract-button.tsx`, `ai-result-buttons.tsx`, `ai-button-item.tsx`, `ai-warning-badges.tsx`, `ai-extract-json-viewer.tsx`. | Must | 파일 8개 존재 + 각 파일 렌더링 테스트 통과 |
| REQ-DASH3-004 | OrderForm 하위 **9개 파일**(8개 섹션 컴포넌트 + `register-success-dialog.tsx` 파일 복제)을 대상으로 한다: `company-manager-section.tsx`, `location-form.tsx`(pickup/delivery 재사용), `cargo-info-form.tsx`, `datetime-card.tsx`(pickup/delivery 재사용), `transport-option-card.tsx`, `estimate-info-card.tsx`, `settlement-section.tsx`. `register-success-dialog.tsx`는 **파일만 복제** (Phase 1에서 호출 없음). | Must | 파일 9개 존재. SuccessDialog `open` prop은 항상 `false` |
| REQ-DASH3-005 | `search-address-dialog.tsx`, `company-manager-dialog.tsx`는 **닫힌 상태 시각 스냅샷**만 복제한다. 포털/트리거 로직은 제거. | Should | 파일 존재 + `open=false` 기본값 |
| REQ-DASH3-006 | `register-summary.tsx`는 Phase 3 범위에서 **제외**한다. | Must | 복제 안 함 |
| REQ-DASH3-007 | 복제된 컴포넌트의 의존성 제거 대상: `@/store/*`, `react-hook-form`, `@tanstack/react-query`, `next/navigation`, `@/lib/api/*`. | Must | package.json 신규 추가 없음. import grep 0건 |

### 5-3. 신규 요구사항 — 데이터 모델 및 Step 스냅샷

| REQ ID | 요구사항 | 우선순위 | 수용 기준 |
|---|---|---|---|
| REQ-DASH3-010 | `mock-data.ts` 스키마를 **Phase 1 스펙 §6** 기준으로 확장한다 (aiInput, aiResult, formData 전체 섹션 포함). | Must | TypeScript 인터페이스 일치. 유효 값 세트 1개 이상 |
| REQ-DASH3-011 | `preview-steps.ts`에 **4단계 스냅샷 + interactions 타이밍 트랙**을 정의한다 (`typingRhythm`, `focusWalk`, `pressTargets`, `fillInFields`). Phase 1 스펙 §7-2. | Must | 4개 Step 정의 + interactions 필드 존재 |
| REQ-DASH3-012 | Step 변화 매트릭스는 **Phase 1 스펙 §7-3**을 따른다 (INITIAL: caret 대기 / AI_INPUT: #1 fake-typing / AI_EXTRACT: #3 button-press + spinner / AI_APPLY: #4 ripple + #6 fill-in + #8 number-rolling). | Must | 각 Step 렌더 결과 스크린샷이 매트릭스와 일치 |
| REQ-DASH3-013 | `successDialogOpen`은 Phase 1 범위에서 **항상 `false` 고정**이다. | Must | 전체 Step에서 Dialog DOM 비가시 |
| REQ-DASH3-014 | **CompanyManagerSection**은 INITIAL부터 **가상 화주 "옵틱물류" + 담당자 이매니저**로 pre-filled 상태로 렌더링된다. 로그인 + 회사 선택 완료 상태를 시뮬레이션한다. mock 값 SSOT는 **wireframe decision-log §4-3** 고정값 표를 따른다. 전체 Step(INITIAL~AI_APPLY)에서 동일 값 유지. | Must | `mock-data.ts` `formData.companyManager` 초기값이 decision-log §4-3 표와 일치. STATE-001/002/003/004a/004b 모든 스냅샷에서 `companyManagerFilled=true` 유지 |

### 5-4. 신규 요구사항 — 조작감 시각 레이어 (Phase 1 스펙 §11)

> **원칙**: 시각 피드백 전용. React state 변경/API 호출 없음. `transform`/`opacity` 중심. `prefers-reduced-motion` 시 최종 상태로 즉시 스냅. 한 Step 당 총 애니 지속 2초 이내. 상세는 [Phase 1 스펙 §11-1](../../../../archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md#11-조작감-강화-레이어-신규).

#### MVP 4종 (Must)

| REQ ID | 아이디어 # | 요구사항 | 우선순위 | 수용 기준 |
|---|---|---|---|---|
| REQ-DASH3-020 | #1 변동 리듬 타이핑 | `AiInputArea`에 `use-fake-typing` 유틸을 적용하여 고유명사(주소·회사명)는 느리게, 조사(을/를/으로)는 빠르게 타이핑되는 연출을 구현한다. **체감 속도는 빠르게 유지하되 리듬감은 살림**. | Must | 문자 간격이 일정하지 않음 (표준편차 > 0). 최종 텍스트 완성 시간 **≤ 1.5초** |
| REQ-DASH3-021 | #3 Button Press | `AiExtractButton`, `AiButtonItem`에 `use-button-press` 유틸을 적용하여 클릭 시 **scale 0.97 + shadow 축소 (150ms)** 연출. | Must | `transform: scale(0.97)`가 150ms 내 적용 후 복귀 |
| REQ-DASH3-022 | #6 Fill-in Caret | Location/Cargo/DateTime 필드에 `use-fill-in-caret` 유틸을 적용하여 AI_APPLY 단계에서 caret이 **짧게 깜빡인 후 값이 즉시** 채워지는 연출. "클릭 즉시 적용" 체감 유지. **CompanyManagerSection은 pre-filled(REQ-DASH3-014)이므로 적용 대상에서 제외**한다. | Must | caret blink **150~200ms** → 값 즉시 등장. 필드 간 순차 간격 **≤ 120ms**. CompanyManagerSection 필드 대상 caret 트리거 0건 |
| REQ-DASH3-023 | #8 숫자 카운터 롤링 | `EstimateInfoCard` 거리·운임, `SettlementSection` 합계에 `use-number-rolling` 유틸을 적용하여 숫자가 **짧게** 롤링되며 최종값에 도달. | Must | 롤링 애니 **0.3~0.5초**. 최종 숫자가 mock-data 값과 일치 |

#### Nice-to-have 6종 (Should)

| REQ ID | 아이디어 # | 요구사항 | 우선순위 | 수용 기준 |
|---|---|---|---|---|
| REQ-DASH3-024 | #2 Focus Walk | Input → Extract → Result 버튼 순차 focus ring 이동 (`use-focus-walk`). | Should | Step 전환 시 outline 4px가 순차 이동 |
| REQ-DASH3-025 | #4 Ripple | `AiButtonItem` 클릭 시 ripple wave (`use-ripple`). | Should | 원형 wave가 클릭 지점에서 확산 (300ms) |
| REQ-DASH3-026 | #5 Hover→Active | `AiResultButtons` CSS only 호버 전환. | Should | `:hover` 시 배경/border 전환 |
| REQ-DASH3-027 | #7 Dropdown 펼침 | `CargoInfoForm` select 영역 열림→하이라이트→닫힘 연출 (전용 prop). | Should | 열림-하이라이트-닫힘 3 beat, 총 600ms 이내 |
| REQ-DASH3-028 | #9 Toggle/Checkbox stroke | `TransportOptionCard` 8옵션 + `EstimateInfoCard` 자동 배차 SVG stroke 애니. | Should | stroke-dashoffset 애니 200ms |
| REQ-DASH3-029 | #10 Column-wise Border Pulse | 3-column grid 배치에서 AI_APPLY 진행 중 **현재 적용 중인 column의 활성 섹션**에 border pulse 연출. scrollIntoView는 3-column 축소 렌더에서 효과가 작으므로 **column 단위 focus 강조 + border glow**로 대체. | Should | AI_APPLY 파트별/전체 beat에 맞춰 활성 섹션 border glow 400ms |
| REQ-DASH3-030 | 통합 | 10개 조작감 유틸은 `interactions/` 하위에 **각각 독립 파일**로 배치 (`use-fake-typing.ts`, `use-button-press.ts`, `use-focus-walk.ts`, `use-ripple.ts`, `use-fill-in-caret.ts`, `use-number-rolling.ts`). | Must | 6개 유틸 파일 존재 + 각각 dedicated 단위 테스트 |
| REQ-DASH3-031 | Reduced Motion | `prefers-reduced-motion: reduce` 감지 시 조작감 10종 모두 **최종 상태 즉시 스냅**. | Must | OS 설정 또는 devtools 에뮬레이션으로 검증. 모든 애니 duration = 0 |

### 5-5. 신규 요구사항 — AI_APPLY 2단 구조

> IDEA §2 "AI_APPLY 2단 구조 확장 아이디어"는 3안(A/B/C)을 제시하며 **추천안 B** (내부 타임라인 분할). 최종 결정은 `/plan-wireframe`에서 확정.

| REQ ID | 요구사항 | 우선순위 | 수용 기준 |
|---|---|---|---|
| REQ-DASH3-040 | AI_APPLY 단계는 **"파트별 적용 → 전체 적용" 2단 연출**을 포함한다. | Must | 파트별 beat와 전체 beat가 시각적으로 구분됨 |
| REQ-DASH3-041 | 구현 방식은 **안 B (내부 타임라인 분할)** 을 권고 채택하되, `/plan-wireframe`에서 최종 확정한다. 대안 A (Step 분할 5단계) / C (모드별 분기)도 기록 유지. | Must | `/plan-wireframe` 문서에 3안 중 1안 확정 기록 |
| REQ-DASH3-042 | 파트별 비트는 카테고리 단위(상차지/하차지/화물/운임)로 **#3 press + #4 ripple + #6 fill-in caret**이 **연속 동작**으로 발생한다. 각 카테고리 사이에 끊김·대기 없이 자연스럽게 이어져 **스크린샷 나열 느낌을 주지 않는다**. | Should | 4개 카테고리가 각각 **150~250ms 간격**으로 적용. 파트별 beat 총 지속 **≤ 1.5초** |
| REQ-DASH3-043 | 전체 비트는 **옵션 토글(TransportOptionCard 8개) + 자동 배차 토글(EstimateInfoCard) + 정산 항목(SettlementSection 청구/지급/추가 요금/합계)** 이 **짧은 간격으로 연속 적용**되며, `#8 숫자 카운터 롤링`이 합계값에 트리거된다. 파트별 비트와 **경계 없이** 이어진다. **담당자 연락처는 pre-filled(REQ-DASH3-014)이므로 전체 비트 대상에서 제외**한다. | Should | 필드 간 간격 **80~120ms**. 전체 비트 지속 **≤ 0.6초**. 카운터 롤링 완료 포함. 담당자 연락처 관련 fill-in 트리거 0건 |
| REQ-DASH3-044 | "골라 받을 수도, 한 번에 받을 수도 있다" 메시지를 전달하는 **UI 시각 힌트**(캡션/보조 텍스트/아이콘) 위치 결정은 `/plan-wireframe`에서 확정한다. | Must | `/plan-wireframe` 문서에 힌트 위치·형태 기록 |

### 5-6. 신규 요구사항 — 아키텍처/파일 구조

| REQ ID | 요구사항 | 우선순위 | 수용 기준 |
|---|---|---|---|
| REQ-DASH3-050 | 파일 구조는 **Phase 1 스펙 §5**를 따른다 (`ai-register-main/ai-panel/`, `ai-register-main/order-form/`, `interactions/`, `ui/` shadcn). | Must | tree diff로 구조 일치 |
| REQ-DASH3-051 | shadcn/ui는 **3-C 하이브리드**로 도입한다: **Button, Input, Textarea, Card, Badge** 5개만 CLI 설치. Select/Dialog/Popover/Calendar/Checkbox는 Tailwind 재작성 또는 정적 스냅샷. | Must | `components/ui/` 하위 5개 파일만 존재. package.json Radix 의존성 최소화 |
| REQ-DASH3-052 | Feature flag 병행 운영 구조를 유지한다 (기존 Phase 1/2와 Phase 3 복제 뷰 토글 가능). | Should | env 또는 prop으로 토글 가능. 두 버전 동시 존재 |
| REQ-DASH3-053 | 기존 `dashboard-preview.tsx` / `preview-chrome.tsx` 외곽 구조는 **재사용**하고, 내부 콘텐츠만 교체한다. | Must | chrome 컴포넌트 diff 최소 |

### 5-7. 신규 요구사항 — 성능/접근성/국제화

| REQ ID | 요구사항 | 우선순위 | 수용 기준 |
|---|---|---|---|
| REQ-DASH3-060 | Dashboard Preview chunk 번들 크기는 **80~100KB gzipped 이내**. 전체 landing First Load JS ≤ 252KB. | Must | `next build` 산출물 측정 |
| REQ-DASH3-061 | LCP 영향은 **+100ms 미만**. `ai-register-main`은 Hero 진입 후 `requestIdleCallback` 또는 `transition.delay: 0.6` 이후 로드. | Must | Lighthouse CI LCP 비교 (전/후) |
| REQ-DASH3-062 | Dynamic import로 Mobile/Desktop 분할 로드. Mobile 뷰에서는 `ai-register-main` 청크를 로드하지 않는다. | Must | Mobile 뷰에서 해당 청크 네트워크 요청 0건 |
| REQ-DASH3-063 | 조작감 레이어 포함 시에도 **INITIAL/AI_INPUT/AI_EXTRACT 각 Step duration ≤ 1.5초**, **AI_APPLY 전체(파트별 + 전체 beat) ≤ 2.5초**를 유지한다. 스크린샷 나열 인상 방지. | Must | `duration`: INITIAL ≤ 500ms, AI_INPUT ≤ 2000ms, AI_EXTRACT ≤ 1000ms, AI_APPLY ≤ 2500ms |
| REQ-DASH3-064 | `prefers-reduced-motion` 외에도 `aria-label`, 키보드 탐색 등 기존 REQ-DASH-027~029 접근성 요구사항은 그대로 유지한다. | Must | axe-core 스캔 통과 |
| REQ-DASH3-065 | 모든 mock 텍스트는 **한국어 기본**. 국제화 미대응 (랜딩 현 정책). 텍스트는 `mock-data.ts`에서 관리하여 차후 i18n 가능 구조만 유지. | Should | hardcoded 한국어 ≤ 5건 |
| REQ-DASH3-066 | 시각 요소의 색상 대비는 WCAG AA 이상. shadcn 기본 대비 기준 준수. | Should | 대비 스캔 통과 |

### 5-8. 신규 요구사항 — 테스트 전략

| REQ ID | 요구사항 | 우선순위 | 수용 기준 |
|---|---|---|---|
| REQ-DASH3-070 | 신규 Phase 3 컴포넌트는 **TDD**로 작성하며, 단위 테스트 커버리지 ≥ **80%**. | Must | `vitest run --coverage` 보고서 |
| REQ-DASH3-071 | 기존 Phase 1/2의 테스트 300개 처리 전략은 **legacy 격리**로 확정한다 (Q7 해소, Dev 착수 전 최종 확정 필요). | Must | legacy 디렉토리 또는 suite 태그로 격리. 신규 테스트와 분리 실행 가능 |
| REQ-DASH3-072 | 조작감 **유틸 6개**(#1 fake-typing, #2 focus-walk, #3 button-press, #4 ripple, #6 fill-in-caret, #8 number-rolling)는 각각 **단위 테스트 + 타이밍 검증 테스트**를 포함한다. CSS/DOM 처리 **4종**(#5 hover, #7 dropdown, #9 stroke, #10 scroll snap)은 렌더링 테스트에서 상태만 검증한다. | Must | 유틸 6개 × 최소 2개 테스트 + CSS 4종 렌더 테스트 각 1건 |
| REQ-DASH3-073 | AI_APPLY 2단 구조 시연은 **통합 테스트**(전체 Step 렌더)로 검증한다. | Must | 4단계 시퀀스 렌더링 테스트 통과 |
| REQ-DASH3-074 | Spike 단계에서 **AiPanel + 조작감 #1/#3** 검증 테스트 세트를 선행 작성한다. | Must | Spike 종료 시 spike 테스트 세트가 pass 상태 |

### 5-9. 잔여 선결 질문 (해소 필요)

| Q# | 질문 | 해소 시점 | 영향 REQ |
|---|---|---|---|
| Q1 | 번들 예산 80~100KB 수용 | **해소 완료 (2026-04-17)** | REQ-DASH3-060 |
| Q9 | 조작감 MVP 4종(#1/#3/#6/#8) 합의 | **본 PRD에서 확정** | REQ-DASH3-020~023 |
| Q2 | broker 통합 일정 (6개월 이내?) | 아키텍처 파일 구조 확정 전 | REQ-DASH3-050 (Option A 전환 설계) |
| Q3 | shadcn 3-C 하이브리드 확정 | **본 PRD에서 확정** | REQ-DASH3-051 |
| Q7 | 테스트 legacy 격리 전략 | **Dev 착수 전 최종 확정** | REQ-DASH3-071 |

---

## 6. UX Requirements

### 6-1. 시연 플로우 (자동 재생)

```
[INITIAL] ~0.5s ─▶ [AI_INPUT] 1.5~2.0s ─▶ [AI_EXTRACT] 0.8~1.0s ─▶ [AI_APPLY] 2.0~2.5s ─▶ (hold 0.5s) ─▶ loop
 빈 폼, caret 대기   변동 리듬 타이핑       press + 짧은 spinner    파트별 → 전체 연속 beat
 단, Company는 pre-filled
 (옵틱물류/이매니저)
```

- 총 루프 **6~8초** (Phase 1/2 대비 약 50% 단축). 정확한 duration 할당은 `/plan-wireframe` 단계.
- **연속 동작 원칙**: Step 경계는 cross-fade가 아닌 **오버랩(100~200ms)** 으로 처리. 앞 Step의 마지막 조작감이 사라지기 전에 다음 Step의 첫 동작이 시작되어 "스크린샷 넘김" 인상을 제거한다 (REQ-DASH-013 재정의).
- **"클릭 → 즉시 반응"**: AI_EXTRACT 버튼 press 직후 로딩 spinner는 **최소 피드백용**(≤ 1초)이며, 결과 카드가 **100ms 내** 등장을 시작해야 한다.
- **INITIAL 상태 특례**: `CompanyManagerSection`은 **가상 화주 "옵틱물류" + 담당자 이매니저로 pre-filled** 상태로 시작한다 (REQ-DASH3-014). 로그인 + 회사 선택 완료 상태 시뮬레이션 — 랜딩 데모는 "사전 세팅 완료 후 주문 등록 flow"에만 집중. mock 값 SSOT는 wireframe decision-log §4-3.
- COMPLETE 단계는 렌더하지 않음. Step Indicator는 **4 dot**.

### 6-2. AI_APPLY 단계 상세

1. **파트별 beat (1.2~1.5초)**: 카테고리 4개(상차지→하차지→화물→운임) 각각 press → ripple → fill-in caret → 값 등장이 **150~250ms 간격**으로 연속 발생. 각 카테고리가 **경계 없이** 이어져 스크린샷 단위로 보이지 않는다. CompanyManagerSection은 pre-filled이므로 파트별 beat 대상에 **포함되지 않는다**.
2. **전체 beat (0.5~0.8초)**: **옵션 토글(TransportOptionCard 8개)** + **자동 배차 토글(EstimateInfoCard)** + **정산 추가 요금(SettlementSection)** 이 **80~120ms 간격**으로 연속 적용 + 숫자 롤링 트리거. **담당자 연락처는 pre-filled이므로 전체 beat 대상 아님 (REQ-DASH3-014)**. 파트별 beat와 **경계 없이 이어진다**. 상세 타이밍은 wireframe decision-log §4-4 참조.
3. **UI 시각 힌트**: "골라 받을 수도, 한 번에 받을 수도 있다" — `components.md` §1-2에서 Preview 프레임 외곽 직하 inline caption으로 확정.

### 6-3. 인터랙티브 모드 (Phase 2 승계 + 확장)

- 기존 REQ-DASH-033~044 **그대로 유지**. 10초 비활동 자동 복귀 규칙 동일.
- 히트 영역은 Phase 1 스펙 §10 기준 **최대 19~20개**로 확장. AI_APPLY 경로 우선 활성화. Settlement/Dialog는 정적 존재만.
- 툴팁 콘텐츠는 `mock-data.ts` `tooltips` 섹션에서 관리 (REQ-DASH-042 승계).

### 6-4. 반응형 전략 (Phase 1 스펙 §9)

| 뷰포트 | 전략 | 근거 |
|--------|------|------|
| Desktop ≥ 1024px | **scale 0.45** + OrderForm **3-column grid** 유지 | 원본 `register-form.tsx:939` `lg:grid-cols-3` 1:1 재현 |
| Tablet 768~1023px | **scale 0.40** + **3-column 유지** (원본과 의도적 divergence) | 원본은 Tablet에서 1-column reflow하나, Phase 3는 가독성 절충 C안으로 Desktop 구조 유지 (R5 A/B 검증 대상) |
| Mobile < 768px | **MobileCardView 유지** (불변) | 터치 정밀도 한계, 조작감 전달 제한 |

### 6-5. 상호작용 기본 상태

- 마우스 hover: 자동 재생 일시정지 (REQ-DASH-017 승계).
- 클릭: 인터랙티브 모드 진입 (REQ-DASH-034 승계).
- 키보드 Tab: Step Indicator 탐색 + Enter/Space 활성화 (REQ-DASH-029 승계).
- `prefers-reduced-motion`: 조작감 10종 포함 전체 애니 비활성, 각 Step 최종 상태 정적 표시 (REQ-DASH3-031).

### 6-6. 화면 흐름 요약

```
Hero 영역
  └─ DashboardPreview (delay 0.6s)
       └─ PreviewChrome
            └─ AiRegisterMain  (Phase 3 신규)
                 ├─ AiPanel
                 │    ├─ AiTabBar
                 │    ├─ AiInputArea          ← 조작감 #1
                 │    ├─ AiExtractButton      ← 조작감 #3
                 │    ├─ AiResultButtons
                 │    │    └─ AiButtonItem x4 ← 조작감 #3/#4/#5
                 │    ├─ AiWarningBadges
                 │    └─ AiExtractJsonViewer  (접힘)
                 └─ OrderForm
                      ├─ CompanyManagerSection ← INITIAL pre-filled (옵틱물류/이매니저), AI_APPLY 영향 없음
                      ├─ LocationForm (pickup) ← 조작감 #6
                      ├─ LocationForm (delivery) ← 조작감 #6
                      ├─ CargoInfoForm         ← 조작감 #6/#7
                      ├─ DateTimeCard x2       ← 조작감 #6
                      ├─ TransportOptionCard   ← 조작감 #9 (AI_APPLY 전체 beat 8옵션 stroke)
                      ├─ EstimateInfoCard      ← 조작감 #8/#9/#10
                      ├─ SettlementSection     ← 조작감 #8
                      └─ RegisterSuccessDialog (항상 hidden)
```

---

## 7. Technical Considerations

### 7-1. 기술 스택 정합성

| 항목 | 유지 | 변경 |
|---|---|---|
| Next.js 15, React 19, Tailwind | ✅ | — |
| Framer Motion | ✅ | interactions 타이밍 트랙과 통합 |
| Lucide icons | ✅ | — |
| shadcn/ui | 신규 | 3-C 하이브리드, 5개 컴포넌트 (Button/Input/Textarea/Card/Badge) |
| zustand / RHF / react-query | ❌ | 복제 대상 컴포넌트에서 제거 |
| next/navigation, api client | ❌ | 제거 |

### 7-2. 번들/성능 예산 (Phase 1 스펙 §12)

| 예산 | Phase 1/2 | Phase 3 | Δ |
|---|---|---|---|
| Dashboard Preview chunk | 30KB | **80~100KB** | +50~70KB (승인) |
| landing Page 전체 | 57.3KB | **130~150KB** | +73~93KB |
| First Load JS (shared) | 102KB | 102KB | 0 |
| **총 First Load** | 159KB | **232~252KB** | +73~93KB |
| LCP 영향 | baseline | +100ms 미만 | Lighthouse CI |

**최적화 기법**: dynamic import (Mobile/Desktop 분할), code splitting (`ai-register-main`은 Hero 진입 후 `requestIdleCallback` 로드), shadcn tree-shaking (3-C), Font/Image SVG placeholder.

### 7-3. 원본 drift 관리 (R3 대응)

- 원본 위치: `.references/code/mm-broker/app/broker/order/ai-register/` (source code, 운영 URL 아님).
- **분기별 스크린샷 diff** 프로세스 수립 필요 (유지보수자 역할).
- visual 검증은 "원본을 실제로 빌드/렌더링한 결과" vs "landing 복제본" 비교 또는 Phase 1 스펙을 spec source로 삼아 정성 검증.
- Hybrid (reference-only) 모드에 따라 `/copy-reference-refresh`만 활용. `/copy-visual-review`, `/copy-interaction-review`는 Phase 1 스펙을 기준으로 대체 수행.

### 7-4. 의존성 신규 도입

shadcn CLI를 통해 아래 Radix primitives가 신규 도입된다 (3-C 하이브리드).

- `@radix-ui/react-slot`, `@radix-ui/react-label` (Button, Input 기본)
- Badge/Card는 순수 Tailwind (Radix 불필요)
- Select/Dialog/Popover/Calendar/Checkbox는 **도입하지 않음** (Tailwind 재작성 또는 정적 스냅샷)

### 7-5. Feature flag

환경변수 또는 prop 토글로 **Phase 1/2 구 버전 ↔ Phase 3 신 버전** 병행 운영 가능 구조 유지. 롤백 안전장치.

### 7-6. 제약사항

- `useEffect`는 **시각 애니메이션 타이밍에만 허용**. 네트워크/스토어 호출 금지 (Phase 1 스펙 §2-1 원칙).
- 모든 조작감 레이어는 `transform`/`opacity` 중심 — layout thrash 금지.
- 한 Step당 애니 지속 시간 **2초 이내**.

---

## 8. Milestones

> 상세: [Phase 1 스펙 §13 구현 단계](../../../../archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md#13-구현-단계-phase-1). 공수는 1명 FT 기준.

### 8-0. Spike (1일, Milestone 1 선행) — **수직 슬라이스**

**목적**: R4(복제 공수 과소평가) 정량 검증 + 2차 확인 **#6 전체 beat 타이밍** 예비 실측. 전체 4-Step flow를 얇게 구현해 설계 재조정 트리거를 조기 확보.

**범위** (얇게 but 전 Column·전 Step):
- [ ] AiPanel: `ai-input-area.tsx` + `ai-extract-button.tsx` 복제 + 조작감 **#1** (fake-typing), **#3** (button-press)
- [ ] OrderForm Col 3: `estimate-info-card.tsx` 복제 + 조작감 **#8** (number-rolling)
- [ ] OrderForm Col 1: `company-manager-section.tsx` **정적 pre-filled** 렌더 (조작감 없음, Tablet 0.40 Col 1 가독성 눈대중 평가)
- [ ] 4-Step 자동재생 골격(INITIAL → AI_INPUT → AI_EXTRACT → AI_APPLY) 연결 + MVP 조작감 3종(#1/#3/#8)만 통합
- [ ] 공수·번들·LCP·**전체 beat 타이밍** 실측 기록

**Spike 결과 의사결정 분기**:
- R4 실측이 Phase 1 스펙 추정 대비 **+50% 초과** → 시나리오 **C → A 전환** 재평가
- 전체 beat **0.8초 부족/과다** → PRD §6-2 duration 재조정
- **#10 Column-wise Border Pulse**와 **Tablet 정식 가독성 검증**은 Spike 범위 외 → Milestone 4~5에서 별도 처리

**2차 확인 커버리지**:
| 2차 확인 | Spike 포함 | 정식 검증 시점 |
|---|:---:|:---:|
| #6 전체 beat 0.8초 | ✅ 예비 실측 | M3 종료 |
| #7 #10 Column Pulse | ❌ | M4 |
| #8 Tablet 0.40 가독성 | 🟡 눈대중만 | M5 |
| #9 하차지 연락처 마스킹 | ❌ (디자인 결정, A 유지) | — |

### 8-1. Milestone 표

| # | 범위 | 예상 기간 | 주요 산출 |
|---|---|---|---|
| M1 | 기반 (mock-data 확장, preview-steps 4단계 + interactions 트랙, shell, shadcn 3-C 설치, interactions 유틸 6개 스캐폴드) | 3일 | `mock-data.ts`, `preview-steps.ts`, `ai-register-main/index.tsx`, `interactions/*.ts`, shadcn 5 컴포넌트 |
| M2 | AI Panel + 조작감 MVP (AiPanel 6 컴포넌트 TDD 복제, 조작감 #1/#3 통합, INITIAL→AI_EXTRACT 연결) | 4~5일 | AiPanel 전체 + 스크린샷 테스트 |
| M3 | Order Form 복제 (8 컴포넌트 TDD 복제, 조작감 #6/#8/#9 통합, AI_APPLY 필드 순차 채움 + 파트별/전체 2단 연출) | 5~7일 | OrderForm 전체 + AI_APPLY 2단 |
| M4 | 조작감 나머지 + 히트 영역 재매핑 (조작감 #2/#4/#5/#7/#10, `hit-areas.ts` 재작성, tooltips 확장) | 3~4일 | 조작감 10종 완료 + 인터랙티브 모드 Phase 3 대응 |
| M5 | 반응형 + 성능 + 최종 검증 (Desktop 0.45, Tablet 0.32, dynamic import, `prefers-reduced-motion` fallback, Lighthouse CI, 번들 검증, hero 통합) | 3일 | 성능 승인 + hero.tsx 통합 |
| **합계** | | **18~22일** (+Spike 1일) | Phase 3 완료 |

### 8-2. Phase 게이트

- 각 Milestone 종료 시 사용자 승인 필요. 자동 진행 금지.
- P0 이슈(번들 초과, 기능 누락) 남아 있으면 다음 Milestone 진입 금지.

---

## 9. Risks & Mitigations

### 9-1. Phase 1 스펙 §14 승계 리스크

| # | 리스크 | 영향 | 확률 | 대응 |
|---|---|---|---|---|
| R1 | 번들 예산 재협상 **실패** | 높음 | **해소** (Q1 수용, 2026-04-17) | 모니터링: 실구현이 100KB 초과 시 feature-flag로 롤백 |
| R2 | shadcn 설치 시 Radix 의존성 폭증 | 중간 | 중간 | 3-C 하이브리드로 5개만 설치 (REQ-DASH3-051) |
| R3 | 원본 broker drift | 중간 | 높음 | 분기별 스크린샷 diff 프로세스 수립 (§7-3) |
| R4 | 복제 공수 과소평가 | 높음 | 중간 | **Spike 1일 선행** (§8-0) — Milestone 2 전 실측 검증 |
| R5 | Tablet scale 0.32 가독성 | 중간 | 낮음 | A/B 테스트 (M5) — 실패 시 0.36 등 조정 |
| R6 | 시각 다이얼로그 난이도 | 낮음 | 중간 | Phase 1 범위에서 닫힌 상태만 복제 (REQ-DASH3-005) |
| R7 | 테스트 300개 재작성 | 높음 | 매우 높음 | **legacy 격리 + 신규 병행** (REQ-DASH3-071). Dev 착수 전 최종 확정 |
| R8 | 조작감 애니 과다로 LCP/TBT 악화 | 중간 | 중간 | `transform`/`opacity` 제한, Lighthouse CI (REQ-DASH3-061~063) |
| R9 | `prefers-reduced-motion`에서 플로우 어색 | 낮음 | 중간 | 각 Step 최종 상태 즉시 스냅 (REQ-DASH3-031) |

### 9-2. 본 PRD 추가 리스크

| # | 리스크 | 영향 | 확률 | 대응 |
|---|---|---|---|---|
| R10 | AI_APPLY 2단 구조 **최종 안 미확정** (A/B/C) → 재작업 발생 | 중간 | 중간 | `/plan-wireframe`에서 안 B 추천으로 확정 (REQ-DASH3-041). 와이어프레임 단계에 3안 비교 기록 보존 |
| R11 | Phase 1/2 테스트 마이그레이션 전략 불확정 시 Dev 착수 블로킹 | 높음 | 중간 | Q7 해소 게이트를 `/dev-feature` 진입 조건으로 설정 (REQ-DASH3-071) |
| R12 | broker 앱 모노레포 통합 일정(Q2) 미결정 → Option A 전환 파일 구조 설계 어려움 | 중간 | 중간 | Option A 전환 대비 shared 추출 경계를 `ai-register-main/` 단위로 설계 유지 (REQ-DASH3-050 연장) |
| R13 | `ai-register-main/` 청크가 Hero 진입 전 로드되면 LCP 악화 | 중간 | 낮음 | `requestIdleCallback` 로드 의무화 (REQ-DASH3-061), CI에서 LCP 차이 측정 |
| R14 | 조작감 10종 상호 간섭 (예: #3 press와 #4 ripple 동시 발생 시 어색) | 중간 | 중간 | interactions 타이밍 트랙 설계에서 Step 별 동시 실행 조작감 상한 설정 (M1 단계) |
| R15 | Hybrid (reference-only) 모드에서 visual review 지표가 **주관적**으로 흐를 위험 | 중간 | 중간 | Phase 1 스펙 §16 정량 지표 고정 사용. `/copy-reference-refresh`로 원본 캡처 확보 |

---

## 10. Success Metrics

### 10-1. 정량 지표 (Phase 1 스펙 §16 승계)

| 지표 | Phase 1/2 baseline | Phase 3 목표 | 측정 방법 |
|---|---|---|---|
| 픽셀 정확도 (원본 대비) | ~70% (축약) | **95%+** (AI_APPLY 완료 구간, COMPLETE 제외) | 원본 빌드 스크린샷 vs 복제본 diff 도구 |
| Dashboard Preview chunk | 30KB | **80~100KB 이내** | `next build` output |
| 총 First Load JS | 159KB | **232~252KB 이내** | `next build` output |
| LCP 영향 | baseline | **+100ms 미만** | Lighthouse CI (전/후) |
| 조작감 10종 적용 | 0종 | **MVP 4종 Must + NTH 6종 Should** | interactions/ 유틸 파일 카운트 + Step 렌더 테스트 |
| 신규 컴포넌트 테스트 커버리지 | — | **80%+** | `vitest run --coverage` |
| 반응형 동작 | 3 뷰포트 | **Desktop 0.45 / Tablet 0.32 / Mobile CardView 유지** | 수동 검증 + Playwright 스냅샷 |
| `prefers-reduced-motion` fallback | 부분 | **조작감 10종 모두 즉시 스냅** | devtools 에뮬레이션 |
| 총 루프 시간 | Phase 1/2 baseline | **6~8초** | 자동 재생 타이밍 측정 |
| Step별 duration | baseline | **INITIAL ≤ 500ms / AI_INPUT ≤ 2000ms / AI_EXTRACT ≤ 1000ms / AI_APPLY ≤ 2500ms** | interactions 타이밍 트랙 검증 테스트 |
| Step 전환 오버랩 | cross-fade (경계 명확) | **100~200ms 오버랩** (경계 제거) | Playwright 시간축 캡처 |
| "스크린샷 나열 아님" 합의 | — | 내부 리뷰 합의 | 블라인드 리뷰 (3인 이상) |

### 10-2. 정성 지표

| 지표 | 목표 | 측정 방법 |
|---|---|---|
| 내부 블라인드 테스트 "실제 앱처럼 느껴짐" | **4/5+** | Phase 3 완료 후 사내 리뷰 (5인 이상) |
| 이해관계자 인식 "실제 제품 같다" | **5/5** | Phase 3 완료 후 제품/영업/디자인 피드백 |
| 외부 사용자 블라인드 테스트 | **측정 보류** | Phase 2 (COMPLETE 포함) 완료 후 측정 |
| Cursor.com demo-window 비교 | **동등 이상의 체감 품질** | 내부 리뷰 3인 이상 합의 |

### 10-3. 측정 타임라인

- **M1 종료**: 번들 예산 초기 측정, 성능 baseline 확정
- **M2 종료**: AI Panel + 조작감 MVP 2종(#1/#3) 체감 평가
- **M3 종료**: OrderForm + AI_APPLY 2단 구조 체감 평가
- **M5 종료**: 전체 정량 지표 수집 + 내부 블라인드 테스트 실행

---

## 11. 다음 단계

1. **`/plan-review`** — PRD 품질 검증 (선택, 권장)
2. **`/plan-wireframe`** — 와이어프레임 작성 (**AI_APPLY 2단 구조 A/B/C 확정 포함**, Step duration 할당 확정)
3. **`/copy-reference-refresh`** — 원본(`.references/code/mm-broker`) 및 현재 구현 캡처 (Hybrid reference-only)
4. **Spike 1일** — `/plan-wireframe`과 병행 권장. AiPanel + 조작감 #1/#3 검증 → R4 리스크 실측
5. Q2/Q7 해소 → `/plan-stitch` → `/plan-bridge` → `/dev-feature` → `/dev-run`

---

## 12. PCC (Planning Consistency Check) 대상 체크리스트

본 PRD는 다음 일관성 검증 대상이다.

- [ ] 요구사항 ID 중복 없음 (REQ-DASH-NNN 기존과 REQ-DASH3-NNN 신규 구분 명확)
- [ ] User Story ↔ Requirements ↔ Success Metrics 대조 통과
- [ ] Phase 1 스펙 §3/§5/§6/§7/§11/§13/§14/§16 섹션 번호 링크 유효
- [ ] Goals ↔ Non-Goals 모순 없음 (특히 COMPLETE 단계, 모바일 조작감 처리)
- [ ] Milestones 합계 공수가 Phase 1 스펙 §13과 일치 (18~22일 + Spike 1일)
- [ ] 리스크 9종 승계 + 추가 6종 모두 대응 명시
- [ ] 잔여 선결 질문 (Q2/Q7) 해소 시점 명시

---

## 변경 이력

| 날짜 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-17 | 초안 작성 (**12개 섹션**: 필수 10 + PCC·다음단계 2, REQ-DASH3 범위 001~074 내 **47개 ID 그룹별 sparse 할당** — 복제/데이터모델/조작감/2단/아키/성능/테스트 7개 그룹) | plan-prd-writer |
| 2026-04-17 | 리뷰 피드백 반영 — MEDIUM 2건(REQ-DASH3-072 유틸 개수 정합, REQ-DASH-027 재정의 분류) + LOW 3건(변경이력 정밀화, REQ-DASH3-003/004 파일 수 표현, G4 권고/확정 분리) | manual |
| 2026-04-17 | UX 피드백 반영 — 총 루프 13~18초 → **6~8초** 단축, "끊김 없는 연속 동작" 원칙 추가(§2-3/G2), Step 전환 cross-fade → **오버랩 100~200ms** 재정의(REQ-DASH-013), 조작감 개별 duration 단축(REQ-DASH3-020/022/023/042/043/063), §6-1/§6-2 타임라인 재작성, §10-1에 duration/오버랩 정량 지표 4건 추가 | manual |
| 2026-04-17 | 레이아웃 피드백 반영 — OrderForm **3-column grid** 재현 결정 (REQ-DASH-003/007 명시), Tablet scale 0.32→**0.40** + 3-column 유지 C안 (REQ-DASH-023/024), REQ-DASH3-029 Section Scroll Snap → **Column-wise Border Pulse** 재정의, §6-4 반응형 표 업데이트 | manual |
| 2026-04-17 | 가상 화주 피드백 반영 — **REQ-DASH3-014 신설** (CompanyManagerSection pre-filled "옵틱물류"/이매니저), REQ-DASH3-022 CompanyManager 제외 명시, §6-1 INITIAL 특례 주석, §6-2 AI_APPLY 전체 beat 담당자 연락처 제거 및 옵션/자동배차/정산 중심 재작성, §6-6 화면 흐름 CompanyManager 옆 pre-filled 주석 추가. mock 값 SSOT는 wireframe decision-log §4-3 참조 | plan-wireframe-designer |
| 2026-04-17 | §8-0 Spike 범위 **수직 슬라이스로 확장** — AiPanel 2개(`ai-input-area` + `ai-extract-button`) + OrderForm Col 3 1개(`estimate-info-card`) + CompanyManager 정적 pre-filled + 4-Step 골격 + MVP 조작감 3종(#1/#3/#8). 2차 확인 #6 전체 beat 타이밍 예비 실측 포함. 1일 원칙 유지 | manual |
