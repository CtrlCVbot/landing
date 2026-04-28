# 테스트 케이스: dash-preview-phase3

> **Feature**: Dashboard Preview Phase 3
> **Framework**: Vitest + React Testing Library + vitest-axe + (검토 중: Playwright 통합 스냅샷)
> **Coverage Target**: 80%+ (Phase 3 신규 컴포넌트/유틸) — REQ-DASH3-070
> **PRD**: [`../00-context/01-prd-freeze.md`](../00-context/01-prd-freeze.md)
> **TASK Mapping**: [`08-dev-tasks.md`](./08-dev-tasks.md)
> **Created**: 2026-04-17

---

## 0. 이 문서의 역할

Phase 3의 TDD 테스트 케이스 목록. **단위 / 통합 / 접근성 / 성능 / SSOT / Spike / Legacy** 7개 범주로 구조화. 각 TC는 관련 REQ와 TASK를 역추적 가능.

**TC ID 체계**: `TC-DASH3-{범주}-{식별자}`
- UNIT: 컴포넌트/유틸 단위
- INT: 통합 (Step 시퀀스, 렌더링 결합)
- A11Y: 접근성
- PERF: 성능
- SSOT: mock 값 SSOT 정합
- SPIKE: Spike 검증
- LEGACY: Phase 1/2 테스트 격리

---

## 1. 단위 테스트 (UNIT)

### 1-1. Interactions 유틸 6개 (REQ-DASH3-030/072, 각 최소 2개)

| TC ID | 테스트 케이스 | 대상 | 관련 REQ |
|-------|-------------|------|---------|
| TC-DASH3-UNIT-TYP-1 | `use-fake-typing`: 문자 간격 표준편차 > 0 | use-fake-typing.ts | REQ-DASH3-020, 072 |
| TC-DASH3-UNIT-TYP-2 | `use-fake-typing`: 최종 텍스트 완성 시간 ≤ 1500ms | use-fake-typing.ts | REQ-DASH3-020 |
| TC-DASH3-UNIT-PRESS-1 | `use-button-press`: 클릭 시 scale(0.97) 적용 | use-button-press.ts | REQ-DASH3-021 |
| TC-DASH3-UNIT-PRESS-2 | `use-button-press`: 150ms 내 복귀 | use-button-press.ts | REQ-DASH3-021 |
| TC-DASH3-UNIT-FOCUS-1 | `use-focus-walk`: 순차 focus ring 이동 | use-focus-walk.ts | REQ-DASH3-024 |
| TC-DASH3-UNIT-FOCUS-2 | `use-focus-walk`: outline 4px CSS 적용 | use-focus-walk.ts | REQ-DASH3-024 |
| TC-DASH3-UNIT-RIPPLE-1 | `use-ripple`: 원형 wave 300ms 확산 | use-ripple.ts | REQ-DASH3-025 |
| TC-DASH3-UNIT-RIPPLE-2 | `use-ripple`: 클릭 좌표 기준 확산 중심 | use-ripple.ts | REQ-DASH3-025 |
| TC-DASH3-UNIT-FILLIN-1 | `use-fill-in-caret`: caret blink 150~200ms 후 값 즉시 | use-fill-in-caret.ts | REQ-DASH3-022 |
| TC-DASH3-UNIT-FILLIN-2 | `use-fill-in-caret`: 필드 간 간격 ≤ 120ms | use-fill-in-caret.ts | REQ-DASH3-022 |
| TC-DASH3-UNIT-ROLL-1 | `use-number-rolling`: 시작값→종료값 전이 | use-number-rolling.ts | REQ-DASH3-023 |
| TC-DASH3-UNIT-ROLL-2 | `use-number-rolling`: 애니 0.3~0.5초 범위 | use-number-rolling.ts | REQ-DASH3-023 |

**합계**: 12 테스트 (유틸 6개 × 2). REQ-DASH3-072 수용 기준 충족.

### 1-2. AiPanel 8 컴포넌트

| TC ID | 테스트 케이스 | 대상 | 관련 REQ |
|-------|-------------|------|---------|
| TC-DASH3-UNIT-AIPANEL-1 | AiPanel 컨테이너 380px 고정 너비 | ai-panel/index.tsx | REQ-DASH3-003 |
| TC-DASH3-UNIT-TABBAR | AiTabBar 텍스트/이미지 탭 상태 렌더 | ai-tab-bar.tsx | REQ-DASH3-003 |
| TC-DASH3-UNIT-INPAREA-1 | AiInputArea empty 상태 placeholder 표시 | ai-input-area.tsx | REQ-DASH3-003 |
| TC-DASH3-UNIT-INPAREA-2 | AiInputArea `textProgress` prop 기반 부분 텍스트 렌더 | ai-input-area.tsx | REQ-DASH3-003, 020 |
| TC-DASH3-UNIT-EXTRBTN-1 | AiExtractButton disabled/active/loading 3 상태 | ai-extract-button.tsx | REQ-DASH3-003 |
| TC-DASH3-UNIT-EXTRBTN-2 | AiExtractButton pressed 상태 visual | ai-extract-button.tsx | REQ-DASH3-021 |
| TC-DASH3-UNIT-RESBT-1 | AiResultButtons 4 카테고리 그룹 렌더 | ai-result-buttons.tsx | REQ-DASH3-003 + REQ-DASH-006 |
| TC-DASH3-UNIT-RESBT-2 | AiResultButtons stagger 등장 타이밍 | ai-result-buttons.tsx | REQ-DASH3-003 |
| TC-DASH3-UNIT-BTNITM-1 | AiButtonItem pending/applied/unavailable 3 상태 | ai-button-item.tsx | REQ-DASH3-003 |
| TC-DASH3-UNIT-BTNITM-2 | AiButtonItem hover CSS 전환 | ai-button-item.tsx | REQ-DASH3-026 |
| TC-DASH3-UNIT-WARN (alias: `TC-DASH3-UNIT-WARNBADGE`) | AiWarningBadges — 빈 배열 null, 색상 amber, AlertTriangle 아이콘, warnings props 기반 badge 렌더 | ai-warning-badges.tsx | REQ-DASH3-003 |
| TC-DASH3-UNIT-JSONV (alias: `TC-DASH3-UNIT-JSONVIEWER`) | AiExtractJsonViewer — 접힘/펼침 토글, JSON pretty print, chevron 방향, aria-expanded / aria-controls 토글 | ai-extract-json-viewer.tsx | REQ-DASH3-003 |

### 1-3. OrderForm 9 컴포넌트

| TC ID | 테스트 케이스 | 대상 | 관련 REQ |
|-------|-------------|------|---------|
| TC-DASH3-UNIT-ORDERFORM-1 | OrderForm 루트 className `grid grid-cols-1 lg:grid-cols-3 gap-4` **exact match** | order-form/index.tsx | REQ-DASH3-004 + REQ-DASH-007 |
| TC-DASH3-UNIT-ORDERFORM-2 | Col 1/2/3 자식 `lg:col-span-1 space-y-4` | order-form/index.tsx | REQ-DASH-007 |
| TC-DASH3-UNIT-ORDERFORM-3 | Col 1 자식 순서: CompanyManager → LocationForm(pickup) → LocationForm(delivery) | order-form/index.tsx | REQ-DASH-007 |
| TC-DASH3-UNIT-ORDERFORM-4 | Col 2 자식 순서: DistanceInfo → DateTimeCard(2-col) → CargoInfoForm | order-form/index.tsx | REQ-DASH-007 |
| TC-DASH3-UNIT-ORDERFORM-5 | Col 3 자식 순서: TransportOptionCard → EstimateInfoCard → SettlementSection | order-form/index.tsx | REQ-DASH-007 |
| TC-DASH3-UNIT-COMPMGR | CompanyManagerSection pre-filled 값 렌더 (옵틱물류/이매니저/010-****-****) | company-manager-section.tsx | REQ-DASH3-014 |
| TC-DASH3-UNIT-LOCFORM | LocationForm pickup/delivery 재사용 + 필드 3개 렌더 | location-form.tsx | REQ-DASH3-004 |
| TC-DASH3-UNIT-DTCARD | DateTimeCard md:grid-cols-2 2-col 구조 | datetime-card.tsx | REQ-DASH3-004 |
| TC-DASH3-UNIT-CARGO | CargoInfoForm 4필드 (차량/중량/화물명/비고) | cargo-info-form.tsx | REQ-DASH3-004 |
| TC-DASH3-UNIT-TRANS | TransportOptionCard 8 옵션 렌더 | transport-option-card.tsx | REQ-DASH3-004 |
| TC-DASH3-UNIT-ESTIM | EstimateInfoCard 거리/시간/운임 + 자동배차 체크박스 | estimate-info-card.tsx | REQ-DASH3-004 |
| TC-DASH3-UNIT-SETTLE | SettlementSection 청구/지급/추가/합계 4숫자 | settlement-section.tsx | REQ-DASH3-004 |
| TC-DASH3-UNIT-SUCCESSOFF | RegisterSuccessDialog `open=false` 고정, 전 Step hidden | register-success-dialog.tsx | REQ-DASH3-013 |

### 1-4. mock-data + preview-steps

| TC ID | 테스트 케이스 | 대상 | 관련 REQ |
|-------|-------------|------|---------|
| TC-DASH3-UNIT-MOCKSCHEMA | mock-data.ts 타입 완전성 (aiInput/aiResult/formData 전체 필드) | lib/mock-data.ts | REQ-DASH3-010 |
| TC-DASH3-UNIT-PREVIEWSTEPS-1 | preview-steps.ts 4 steps 배열 길이 | lib/preview-steps.ts | REQ-DASH3-011 + REQ-DASH-010 |
| TC-DASH3-UNIT-PREVIEWSTEPS-2 | 각 step의 interactions 필드 존재 (AI_APPLY에 partialBeat/allBeat 포함) | lib/preview-steps.ts | REQ-DASH3-011, 041 |
| TC-DASH3-UNIT-PREVIEWSTEPS-3 | 각 step duration 상한 (INITIAL ≤ 500, AI_INPUT ≤ 2000, AI_EXTRACT ≤ 1000, AI_APPLY ≤ 2500) | lib/preview-steps.ts | REQ-DASH3-063 |
| TC-DASH3-UNIT-IND | StepIndicator 4-dot 렌더, active dot 1개 | step-indicator.tsx | REQ-DASH-014 |
| TC-DASH3-UNIT-LOCALE | mock-data.ts 모든 텍스트 한국어 | lib/mock-data.ts | REQ-DASH3-065 |
| TC-DASH3-UNIT-HITAREA-1 | hit-areas.ts 19~20 영역 정의 | hit-areas.ts | REQ-DASH-037 + REQ-DASH3-037 확장 |
| TC-DASH3-UNIT-HITAREA-2 | #11 company-manager `isEnabled=false` (pre-filled 비활성) | hit-areas.ts | REQ-DASH3-014 |
| TC-DASH3-UNIT-HITAREA-3 | #15 datetime-pickup-dropoff 2-col 통합 (단일 히트) | hit-areas.ts | wireframe §5-2 |

---

## 2. 통합 테스트 (INT)

### 2-1. 구조 검증

| TC ID | 테스트 케이스 | 관련 REQ |
|-------|-------------|---------|
| TC-DASH3-INT-GRID | AiRegisterMain: AiPanel 380 + OrderForm 3-col grid 컨테이너 구조 | REQ-DASH3-001 + REQ-DASH-003 |
| TC-DASH3-INT-COLS | OrderForm 3-col 자식 배치 (Col 1/2/3 각각 올바른 섹션 순서) | REQ-DASH-007 + REQ-DASH3-004 |
| TC-DASH3-INT-AIPANEL | AiPanel 8 자식 컴포넌트 조합 렌더링 | REQ-DASH3-003 |
| TC-DASH3-INT-FLOW-AIPANEL | AiPanelContainer 4-Step 플로우 (INITIAL→AI_INPUT→AI_EXTRACT→AI_APPLY) 통합 — 각 Step 에서 AiTabBar/AiInputArea/AiExtractButton/AiResultButtons 렌더 결과가 Step 스냅샷과 일치 | REQ-DASH3-010, 011, 020, 021 |
| TC-DASH3-INT-ORDERFORM | OrderForm 9 자식 컴포넌트 조합 렌더링 | REQ-DASH3-004 |
| TC-DASH3-INT-DOM | DOM 계층/클래스 원본과 95%+ 일치 (diff 도구) | REQ-DASH3-001 |
| TC-DASH3-INT-NOSTATE | `ai-register-main/*` 전체에서 zustand/RHF/react-query/next-navigation/api import grep = 0건 | REQ-DASH3-002, 007 |
| TC-DASH3-INT-IMPORTS | 위와 동일 grep 자동화 | REQ-DASH3-007 |
| TC-DASH3-INT-NOSUMMARY | register-summary.tsx 파일 부재 | REQ-DASH3-006 |
| TC-DASH3-INT-STRUCTURE | Phase 1 스펙 §5 파일 구조 정합 (디렉터리 tree 비교) | REQ-DASH3-050 |
| TC-DASH3-INT-SHADCN | components/ui/ 5 파일만 존재, Radix 최소 의존 확인 | REQ-DASH3-051 |
| TC-DASH3-INT-CHROME | dashboard-preview.tsx / preview-chrome.tsx 외곽 재사용 확인 (diff 최소) | REQ-DASH3-053 |

### 2-2. Step 시퀀스

| TC ID | 테스트 케이스 | 관련 REQ |
|-------|-------------|---------|
| TC-DASH3-INT-MATRIX | Step 변화 매트릭스 (Phase 1 스펙 §7-3) — 각 Step 렌더 결과가 매트릭스와 일치 | REQ-DASH3-012 |
| TC-DASH3-INT-OVERLAP | Step 전환 오버랩 100~200ms (Playwright 타임라인 캡처) | REQ-DASH-013 재정의 |
| TC-DASH3-INT-MOBILE | Mobile MobileCardView 2-card 자동 전환 유지 | REQ-DASH-026 재검토 (유지 확정) |
| TC-DASH3-INT-TABLET | Tablet scale 0.40 + 3-col 유지 (CSS reflow 차단) | REQ-DASH-023/024 |
| TC-DASH3-INT-APPLY | AI_APPLY 단계: 버튼 색상 전환 + 필드 채움 + #8 rolling 결합 | REQ-DASH-008 + REQ-DASH3-023 |
| TC-DASH3-INT-PREFILLED | 전 Step(INITIAL/AI_INPUT/AI_EXTRACT/AI_APPLY)에서 CompanyManagerSection pre-filled 값 유지 | REQ-DASH3-014 |
| TC-DASH3-INT-PREFILLED-SKIP | AI_APPLY partial/all beat에서 CompanyManager 대상 #6 fill-in caret trigger 0건 | REQ-DASH3-014, 022 |

### 2-3. AI_APPLY 2단 구조

| TC ID | 테스트 케이스 | 관련 REQ |
|-------|-------------|---------|
| TC-DASH3-INT-2BEAT | AI_APPLY partial → all 2단 시퀀스 전체 렌더링 | REQ-DASH3-040, 073 |
| TC-DASH3-INT-ABPLAN | preview-steps.ts AI_APPLY `interactions.partialBeat` + `allBeat` 구조 검증 | REQ-DASH3-041 |
| TC-DASH3-INT-PARTIAL | partialBeat: 카테고리 4개 150~250ms 간격, 총 ≤ 1.5s | REQ-DASH3-042 |
| TC-DASH3-INT-ALL | allBeat: TransportOption 8 + 자동배차 + Settlement 80~120ms 간격, 총 ≤ 0.6s. **담당자 연락처 entry 0건** | REQ-DASH3-043, 014 |
| TC-DASH3-INT-HINT | UI 힌트 Caption AI_APPLY 중만 opacity 0→1 fade-in, aria-live polite | REQ-DASH3-044 |
| TC-DASH3-INT-COLPULSE | #10 Column Pulse partial/all beat의 Column 순서대로 400ms glow. Col 1 all beat pulse 0건 (pre-filled) | REQ-DASH3-029 |

### 2-4. Dialog 및 기타

| TC ID | 테스트 케이스 | 관련 REQ |
|-------|-------------|---------|
| TC-DASH3-INT-DIALOG | SearchAddressDialog `open=false` 정적 스냅샷, 포털/트리거 로직 0건 | REQ-DASH3-005 |
| TC-DASH3-INT-FLAG | Feature flag env/prop 토글로 Phase 1/2 ↔ Phase 3 전환 | REQ-DASH3-052 |
| TC-DASH3-INT-FILLIN-VALUE | interactions.fillInFields[].value ↔ mock-data.ts 해당 필드 값 일치 | REQ-DASH3-011 SSOT |

---

## 3. 접근성 테스트 (A11Y)

| TC ID | 테스트 케이스 | 관련 REQ |
|-------|-------------|---------|
| TC-DASH3-A11Y-REDMO | `prefers-reduced-motion` 감지 시 조작감 10종 모두 duration=0, STATE-004b 기본 표시 | REQ-DASH3-031 + REQ-DASH-027 재정의 |
| TC-DASH3-A11Y-AXE | vitest-axe 스캔 0 violations | REQ-DASH3-064 |
| TC-DASH3-A11Y-CONTRAST | WCAG AA 색상 대비 (pending blue, applied green, chrome neutral, UI 힌트) | REQ-DASH3-066 |
| TC-DASH3-A11Y-KBD | StepIndicator Tab + Enter/Space 활성화 | REQ-DASH-029 승계 |
| TC-DASH3-A11Y-ARIA | aria-label `"AI 화물 등록 워크플로우 데모 미리보기"` 존재 | REQ-DASH3-064 + REQ-DASH-028 승계 |
| TC-DASH3-A11Y-ARIALIVE | UI 힌트 Caption `aria-live="polite"` AI_APPLY 진입 시 1회 읽힘 | REQ-DASH3-044 |
| TC-DASH3-A11Y-HIT | HitArea 인터랙티브 모드 Tab/Enter/Space + focus outline | REQ-DASH-048~050 (Phase 2 승계) |

---

## 4. 성능 테스트 (PERF)

| TC ID | 테스트 케이스 | 검증 도구 | 관련 REQ |
|-------|-------------|---------|---------|
| TC-DASH3-PERF-BUNDLE | ai-register-main chunk 80~100KB gzipped | `next build` 출력 | REQ-DASH3-060 + REQ-DASH-030 재협상 |
| TC-DASH3-PERF-FIRSTLOAD | 전체 First Load JS ≤ 252KB | `next build` | REQ-DASH3-060 |
| TC-DASH3-PERF-LCP | LCP 영향 +100ms 미만 | Lighthouse CI 전/후 비교 | REQ-DASH3-061 |
| TC-DASH3-PERF-MOBILE | Mobile 뷰포트(<768px)에서 ai-register-main 청크 네트워크 요청 0건 | Chrome DevTools Network | REQ-DASH3-062 |
| TC-DASH3-PERF-LOOP | 총 루프 6~8초 범위 | 자동 재생 타이밍 측정 (Playwright) | REQ-DASH-011 재조정 + REQ-DASH3-063 |
| TC-DASH3-PERF-STEPDUR | Step duration 상한 검증 (INITIAL ≤ 500, AI_INPUT ≤ 2000, AI_EXTRACT ≤ 1000, AI_APPLY ≤ 2500 ms) | Playwright 타임라인 | REQ-DASH3-063 |
| TC-DASH3-PERF-SCALE | Desktop 0.45 / Tablet 0.40 scale 적용 | `transform: scale()` style 검증 | REQ-DASH-023/024 |

---

## 5. SSOT 정합 (SSOT) — REQ-DASH3-014 핵심

| TC ID | 테스트 케이스 | 관련 REQ |
|-------|-------------|---------|
| TC-DASH3-SSOT-MOCK-1 | `mock-data.ts` `formData.company.name === '옵틱물류'` | REQ-DASH3-014 |
| TC-DASH3-SSOT-MOCK-2 | `formData.company.businessNumber === '***-**-*****'` | REQ-DASH3-014 |
| TC-DASH3-SSOT-MOCK-3 | `formData.company.ceoName === '김옵틱'` | REQ-DASH3-014 |
| TC-DASH3-SSOT-MOCK-4 | `formData.manager.name === '이매니저'` | REQ-DASH3-014 |
| TC-DASH3-SSOT-MOCK-5 | `formData.manager.contact === '010-****-****'` | REQ-DASH3-014 |
| TC-DASH3-SSOT-MOCK-6 | `formData.manager.email === 'example@optics.com'` | REQ-DASH3-014 |
| TC-DASH3-SSOT-MOCK-7 | `formData.manager.department === '물류운영팀'` | REQ-DASH3-014 |
| TC-DASH3-SSOT-MOCK-8 | `formState.companyManagerFilled === true` in STATE-001/002/003/004a/004b 전체 | REQ-DASH3-014 |

모든 SSOT TC는 [`sources/wireframes/decision-log.md` §4-3](../sources/wireframes/decision-log.md#4-3-mock-값-전체-표-ssot) 표와 exact match 검증.

---

## 6. Legacy 격리 전략 (Q7 해소 — **Phase B A안 확정**)

### 6-1. 확정안 (A안)

**Phase B에서 A안 확정** (2026-04-17). `T-DASH3-M1-07`로 실행.

| 안 | 방법 | 상태 |
|----|------|------|
| **A안 (확정)** | `__tests__/dashboard-preview/legacy/` 디렉터리로 이동 (`git mv`) + `vitest.config.ts` include 패턴 재구성 | **채택** |
| B안 (rejected) | suite 태그 (`describe.skip.if(process.env.LEGACY !== 'true')`) | 각 파일마다 조건부 래핑 필요 → 가독성 저하로 기각 |
| C안 (rejected) | 전체 삭제 후 Phase 3 신규 테스트만 운영 | Feature flag 롤백 시 회귀 안전망 상실로 기각 |

### 6-2. A안 상세 (권장)

```
apps/landing/src/__tests__/dashboard-preview/
  legacy/                                    # 이동 대상 (기존 300+ 테스트)
    dashboard-preview.test.tsx
    use-auto-play.test.ts
    step-indicator.test.tsx
    ai-panel-preview.test.tsx
    form-preview.test.tsx
    mobile-card-view.test.tsx
    interactive-overlay.test.tsx
    use-interactive-mode.test.ts
    hit-areas.test.ts
    ...

  ai-register-main/                          # Phase 3 신규
  interactions/                              # Phase 3 신규
  dashboard-preview-phase3.integration.test.tsx
  mock-data-ssot.test.ts
```

`vitest.config.ts` (예시):
```typescript
export default defineConfig({
  test: {
    include: process.env.LEGACY === 'true'
      ? ['src/__tests__/**/*.test.{ts,tsx}']
      : ['src/__tests__/**/*.test.{ts,tsx}', '!src/__tests__/dashboard-preview/legacy/**'],
  },
})
```

### 6-3. TC-DASH3-INT-LEGACY

| TC ID | 테스트 케이스 | 검증 |
|-------|-------------|------|
| TC-DASH3-INT-LEGACY-1 | Phase 3 신규 테스트 (legacy 제외) 전체 pass | `pnpm run test` |
| TC-DASH3-INT-LEGACY-2 | Legacy 테스트 `LEGACY=true pnpm run test -- legacy` 환경에서 여전히 pass (회귀 확인) | 수동 실행 |
| TC-DASH3-INT-LEGACY-3 | Feature flag version=phase12 에서 Phase 1/2 UI 정상 렌더 | 수동 시각 검증 + M5 TC |

---

## 7. Spike 검증 (SPIKE) — REQ-DASH3-074

Spike 1일 범위에서 사전 작성하고 Spike 종료 시 pass 상태 필수.

| TC ID | 테스트 케이스 | 관련 TASK |
|-------|-------------|---------|
| TC-DASH3-SPIKE-01 | AiInputArea + #1 fake-typing 수직 슬라이스 pass | T-DASH3-SPIKE-01 |
| TC-DASH3-SPIKE-02 | AiExtractButton + #3 button-press pass | T-DASH3-SPIKE-01 |
| TC-DASH3-SPIKE-03 | EstimateInfoCard + #8 number-rolling pass | T-DASH3-SPIKE-01 |
| TC-DASH3-SPIKE-04 | CompanyManager 정적 pre-filled 렌더 pass | T-DASH3-SPIKE-01 |
| TC-DASH3-SPIKE-05 | 4-Step 자동재생 골격 + MVP 3종 통합 pass | T-DASH3-SPIKE-01 |
| TC-DASH3-SPIKE-06 | 공수 실측 (TASK별 시간 로그) | T-DASH3-SPIKE-01 |
| TC-DASH3-SPIKE-07 | 전체 beat 타이밍 예비 실측 (목표 0.8초 확인) | T-DASH3-SPIKE-01 |

---

## 8. TC → REQ 역추적 매트릭스 (요약)

| REQ Group | TC 범주 | 대표 TC |
|-----------|---------|---------|
| 복제 범위 (REQ-DASH3-001~007) | INT | GRID, COLS, AIPANEL, ORDERFORM, DOM, NOSTATE |
| 데이터 모델 (010~014) | UNIT + SSOT | MOCKSCHEMA, PREVIEWSTEPS-1/2/3, SSOT-MOCK-1~8 |
| 조작감 MVP (020~023) | UNIT | TYP, PRESS, FILLIN, ROLL + 적용 검증 |
| 조작감 NTH (024~029, 030, 031) | UNIT + INT + A11Y | FOCUS, RIPPLE, HOVER, DROP, STROKE, COLPULSE, REDMO |
| AI_APPLY 2단 (040~044) | INT | 2BEAT, ABPLAN, PARTIAL, ALL, HINT |
| 아키텍처 (050~053) | INT | STRUCTURE, SHADCN, FLAG, CHROME |
| 성능 (060~063) | PERF | BUNDLE, FIRSTLOAD, LCP, MOBILE, LOOP, STEPDUR |
| 접근성 (064, 066) | A11Y | AXE, CONTRAST, KBD, ARIA, ARIALIVE, HIT |
| 테스트 전략 (070~074) | LEGACY + SPIKE | LEGACY-1~3, SPIKE-01~07 |

---

## 9. 커버리지 목표

| 대상 | 목표 | 검증 |
|------|------|------|
| `ai-register-main/` 전체 | 80%+ | `vitest run --coverage ai-register-main` |
| `interactions/` 전체 | 90%+ (유틸 핵심) | `vitest run --coverage interactions` |
| `lib/mock-data.ts` + `lib/preview-steps.ts` | 95%+ (데이터 구조) | 같은 명령 |
| `dashboard-preview.tsx` (수정 분) | 80%+ | 통합 테스트 |

---

## 10. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-04-17 | 초안 — 7 범주 (UNIT/INT/A11Y/PERF/SSOT/SPIKE/LEGACY) + 역추적 매트릭스 + Q7 격리 3안 상세 |
| 2026-04-17 | Phase C — §6 제목 "Phase B A안 확정" 갱신, §6-1 B/C안 "rejected" 표기로 간략화, TC-DASH3-INT-LEGACY-1/2/3 유지 |
| 2026-04-21 | M2 review#2/#3 — TC-DASH3-UNIT-WARN/JSONV에 코드 테스트 alias(WARNBADGE/JSONVIEWER) 명시. TC-DASH3-INT-FLOW-AIPANEL (M2-09 AiPanel 통합 플로우) 신규 등록. traceability matrix 완결 |
