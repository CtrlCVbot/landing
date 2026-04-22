# Domain Logic: dash-preview-phase3 (최소화)

> **Feature**: Dashboard Preview Phase 3
> **Principle**: **stateless + props 주입** (REQ-DASH3-002/007). 비즈니스 로직 0건.
> **PRD**: [`../00-context/01-prd-freeze.md`](../00-context/01-prd-freeze.md)
> **Phase 1 스펙 §6/§7/§8**: [`archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md`](../../../../archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md)
> **Created**: 2026-04-17

---

## 0. 이 문서의 역할 (의도적 최소화)

Phase 3는 **stateless props 기반 시각 모형**이므로 전통적 "도메인 로직"이 거의 없다. 본 문서는 다음 3개 요소만 기록:

1. **`PREVIEW_STEPS` 컴파일타임 reducer 역할** — runtime 상태 전이 없음
2. **Mock data 스키마** — Phase 1 스펙 §6 승계 + pre-filled SSOT
3. **Interactions 타이밍 트랙 설계** — partialBeat/allBeat (안 B 확정)

### 0-1. 비즈니스 로직 없음을 명시

| 항목 | 상태 |
|------|------|
| zustand store | ❌ 없음 (REQ-DASH3-007) |
| React Hook Form | ❌ 없음 |
| React Query / API client | ❌ 없음 |
| Next.js router | ❌ 없음 |
| 인증/세션 로직 | ❌ 없음 (pre-filled로 시뮬레이션) |
| 폼 검증 로직 | ❌ 없음 (stateless) |
| 다이얼로그 포털 로직 | ❌ 없음 (open=false 고정, 시각 스냅샷만) |
| useReducer | ❌ 없음 (PREVIEW_STEPS 배열이 컴파일타임 reducer 역할) |

**유일한 useEffect 허용 범위**: 시각 애니메이션 타이밍 제어 (Phase 1 스펙 §2-1 원칙). 네트워크/스토어 호출 금지.

---

## 1. PREVIEW_STEPS — 컴파일타임 reducer

### 1-1. 타입 정의

```typescript
export type StepId = 'INITIAL' | 'AI_INPUT' | 'AI_EXTRACT' | 'AI_APPLY'

export interface PreviewStep {
  readonly id: StepId
  readonly label: string            // "빈 폼" / "AI 입력" / "AI 분석" / "자동 적용"
  readonly duration: number         // ms (INITIAL ≤ 500 / AI_INPUT ≤ 2000 / AI_EXTRACT ≤ 1000 / AI_APPLY ≤ 2500)
  readonly aiState: AiStateSnapshot
  readonly formState: FormStateSnapshot
  readonly interactions?: InteractionsTrack
}

export const PREVIEW_STEPS: readonly PreviewStep[] = [
  /* [0] INITIAL  */ { id: 'INITIAL',    ... },
  /* [1] AI_INPUT */ { id: 'AI_INPUT',   ... },
  /* [2] AI_EXTRACT */ { id: 'AI_EXTRACT', ... },
  /* [3] AI_APPLY   */ { id: 'AI_APPLY',   ... },
]
```

### 1-2. 상태 스냅샷 인터페이스 (Phase 1 스펙 §7-2 승계)

```typescript
export interface AiStateSnapshot {
  readonly activeTab: 'text' | 'image'
  readonly textProgress: number                          // 0~1, #1 fake-typing 진행률
  readonly extractState: 'idle' | 'loading' | 'resultReady'
  readonly buttons: Record<'departure' | 'destination' | 'cargo' | 'fare', 'pending' | 'applied' | 'unavailable'>
  readonly warningsVisible: boolean
  readonly jsonViewerOpen: boolean
}

export interface FormStateSnapshot {
  readonly companyManagerFilled: boolean                 // 항상 true (REQ-DASH3-014 pre-filled)
  readonly pickupFilled: boolean
  readonly deliveryFilled: boolean
  readonly pickupDateTimeFilled: boolean
  readonly deliveryDateTimeFilled: boolean
  readonly vehicleFilled: boolean
  readonly cargoFilled: boolean
  readonly optionsActive: readonly string[]
  readonly estimateVisible: boolean
  readonly settlementVisible: boolean
  readonly highlightedSection: string | null
  readonly successDialogOpen: false                      // Phase 3 고정 (REQ-DASH3-013)
}
```

### 1-3. Runtime 사용

```tsx
// dashboard-preview.tsx
const currentStep = useAutoPlay({ steps: PREVIEW_STEPS, initialStep: 0, enabled: !reducedMotion })
const step = PREVIEW_STEPS[currentStep]

<AiRegisterMain
  aiState={step.aiState}
  formState={step.formState}
  interactions={step.interactions}
/>
```

- `currentStep`은 단순 index (0~3)
- `PREVIEW_STEPS[currentStep]`이 render할 스냅샷을 결정
- 이전 Step과 현재 Step 간 계산/diff 없음 — **각 Step은 독립 스냅샷**

---

## 2. Mock Data 스키마 (Phase 1 스펙 §6 승계 + SSOT 주입)

### 2-1. 타입 정의 (요약)

```typescript
export interface PreviewMockData {
  aiInput: {
    activeTab: 'text' | 'image'
    textValue: string                // "서울 강남구 물류센터에서..."
    imagePreviewUrl?: string
  }
  aiResult: {
    extractState: 'idle' | 'loading' | 'resultReady'
    categories: readonly AiCategoryGroup[]
    warnings: readonly string[]
    evidence: Record<string, string>
    jsonViewerOpen: boolean
  }
  formData: {
    company: CompanyMock               // REQ-DASH3-014 pre-filled
    manager: ManagerMock               // REQ-DASH3-014 pre-filled
    availableManagers: readonly { id: string; name: string; department: string }[]
    pickup: LocationMock
    delivery: LocationMock
    vehicle: { type: string; weight: number; recentCargoSuggestions: readonly string[] }
    cargo: { name: string; remark: string }
    options: { fast: boolean; roundTrip: boolean; direct: boolean; trace: boolean; forklift: boolean; manual: boolean; cod: boolean; special: boolean }
    estimate: { distance: number; duration: string; amount: number; autoDispatch: boolean }
    settlement: SettlementMock
    dialogs: {
      searchAddress: { open: false; query?: string }
      companyManager: { open: false }
      success: { open: false; orderId?: string }  // Phase 3 고정
    }
  }
  tooltips: Record<string, string>
}
```

상세 필드는 Phase 1 스펙 §6 그대로 사용.

### 2-2. Pre-filled mock 값 SSOT (REQ-DASH3-014)

**유일한 진실**: wireframe [`decision-log.md` §4-3](../sources/wireframes/decision-log.md#4-3-mock-값-전체-표-ssot).

본 문서는 값 재복제 금지 — mock-data.ts 초기화 시 decision-log 표의 값을 **exact match**로 반영.

검증: `09-test-cases.md` `TC-DASH3-SSOT-MOCK`에서 `mock-data.ts` 초기값과 SSOT 표의 필드별 일치를 assert.

### 2-3. 마스킹 규칙

- 사업자등록번호 `***-**-*****` (자릿수 보존)
- 담당자 연락처 `010-****-****`
- pickup/delivery 담당자 mock 연락처도 동일 마스킹 패턴
- 이메일 도메인 `optics.com` (가상)

---

## 3. Interactions 타이밍 트랙 (안 B 반영)

### 3-1. 타입 정의 (확장)

Phase 1 스펙 §7-2의 `interactions` 필드를 다음과 같이 확장. **AI_APPLY 안 B (내부 타임라인 분할)** 반영.

```typescript
export interface InteractionsTrack {
  readonly typingRhythm?: TypingRhythmConfig          // #1 AI_INPUT에서
  readonly focusWalk?: readonly string[]              // #2 Input → Extract → Results
  readonly pressTargets?: readonly string[]           // #3 AI_EXTRACT/APPLY 클릭 대상
  readonly rippleTargets?: readonly string[]          // #4 AI_APPLY AiButtonItem
  readonly fillInFields?: readonly FillInField[]      // #6 AI_APPLY 필드
  readonly dropdownBeat?: DropdownBeatConfig          // #7 CargoInfo select
  readonly rollingTargets?: readonly RollingTarget[]  // #8 숫자 롤링
  readonly strokeBeats?: readonly StrokeBeatConfig[]  // #9 TransportOption + 자동배차
  readonly columnPulseTargets?: readonly ColumnPulseTarget[]  // #10 재정의 Column Pulse

  // AI_APPLY 안 B: 내부 2-beat 타이밍 트랙
  readonly partialBeat?: BeatSchedule                 // T=0~1500ms
  readonly allBeat?: BeatSchedule                     // T=1500~2300ms (partial 완료 기준 T=0~800ms)
}

export interface BeatSchedule {
  readonly start: number                              // ms (Step duration 내 상대 시각)
  readonly end: number                                // ms
  readonly fillInFields?: readonly FillInField[]
  readonly pressTargets?: readonly string[]
  readonly rippleTargets?: readonly string[]
  readonly columnPulseTargets?: readonly ColumnPulseTarget[]
  readonly strokeBeats?: readonly StrokeBeatConfig[]
  readonly rollingTargets?: readonly RollingTarget[]
}

export interface FillInField {
  readonly fieldId: string          // 예: 'pickup-address'
  readonly value: string
  readonly delay: number            // ms
}

export interface ColumnPulseTarget {
  readonly columnIndex: 1 | 2 | 3
  readonly sectionId: string        // 예: 'location-pickup'
  readonly delay: number            // ms
  readonly duration: number         // ms (400ms 기본)
}

export interface StrokeBeatConfig {
  readonly targetId: string         // 예: 'transport-option-direct'
  readonly delay: number
  readonly duration: number         // 200ms 기본
}

export interface RollingTarget {
  readonly targetId: string         // 예: 'settlement-total'
  readonly from: number
  readonly to: number
  readonly delay: number
  readonly duration: number         // 300~500ms
}

export interface TypingRhythmConfig {
  readonly text: string
  readonly baseSpeedMs: number      // 기본 글자 간격
  readonly slowPatterns: readonly RegExp[]   // 고유명사 pattern (느리게)
  readonly fastPatterns: readonly RegExp[]   // 조사 pattern (빠르게)
}

export interface DropdownBeatConfig {
  readonly targetId: string
  readonly openDelay: number        // ms
  readonly highlightDuration: number
  readonly closeDelay: number
}
```

### 3-2. AI_APPLY Step 예시 (의사 코드)

```typescript
{
  id: 'AI_APPLY',
  label: '자동 적용',
  duration: 2300,
  aiState: { /* buttons 전부 applied */ },
  formState: { /* 전 필드 filled, successDialogOpen: false */ },
  interactions: {
    partialBeat: {
      start: 0,
      end: 1500,
      pressTargets: ['ai-result-departure', 'ai-result-destination', 'ai-result-cargo', 'ai-result-fare'],
      rippleTargets: [...],
      fillInFields: [
        { fieldId: 'pickup-address',  value: '...', delay: 0 },
        { fieldId: 'pickup-contact',  value: '...', delay: 120 },
        { fieldId: 'delivery-address', value: '...', delay: 200 },
        // ... 120ms 간격
      ],
      columnPulseTargets: [
        { columnIndex: 1, sectionId: 'location-pickup',   delay: 0,   duration: 400 },
        { columnIndex: 1, sectionId: 'location-delivery', delay: 200, duration: 400 },
        { columnIndex: 2, sectionId: 'cargo-info',         delay: 400, duration: 400 },
        { columnIndex: 3, sectionId: 'estimate-info',     delay: 600, duration: 400 },
      ],
      rollingTargets: [
        { targetId: 'estimate-amount', from: 0, to: 420000, delay: 600, duration: 500 },
      ],
    },
    allBeat: {
      start: 1500,
      end: 2300,
      strokeBeats: [
        { targetId: 'transport-direct',   delay: 0,   duration: 200 },
        { targetId: 'transport-roundtrip', delay: 60,  duration: 200 },
        // ... 60ms stagger, 8옵션
        { targetId: 'estimate-auto-dispatch', delay: 150, duration: 200 },
      ],
      rollingTargets: [
        { targetId: 'settlement-charge',   from: 0, to: 420000, delay: 200, duration: 300 },
        { targetId: 'settlement-dispatch', from: 0, to: 350000, delay: 200, duration: 300 },
        { targetId: 'settlement-extra',    from: 0, to: 30000,  delay: 300, duration: 300 },
        { targetId: 'settlement-total',    from: 0, to: 450000, delay: 400, duration: 400 },
      ],
      columnPulseTargets: [
        { columnIndex: 3, sectionId: 'transport-options', delay: 0,   duration: 400 },
        { columnIndex: 3, sectionId: 'settlement',        delay: 200, duration: 400 },
        // Col 1 pulse 0건 (Company pre-filled)
      ],
    },
  },
}
```

### 3-3. 값 일치 검증 (SSOT)

`interactions.fillInFields[].value`는 `mock-data.ts` `formData` 해당 필드 값과 일치해야 한다. TDD에서 `TC-DASH3-INT-FILLIN-VALUE` 로 검증.

---

## 4. 단방향 데이터 흐름 (Phase 1 스펙 §8-1 승계)

```
DashboardPreview (state: currentStep, mode)
        │
        │ PREVIEW_STEPS[currentStep] → { aiState, formState, interactions }
        ▼
AiRegisterMain (props: aiState, formState, interactions)
        ├─ AiPanel (props: aiState + interactions{ typingRhythm, focusWalk, pressTargets })
        │    ├─ AiInputArea
        │    ├─ AiExtractButton
        │    └─ AiResultButtons
        │
        └─ OrderForm (props: formState + interactions{ fillInFields, dropdownBeat, columnPulseTargets, strokeBeats, rollingTargets, partialBeat, allBeat })
             ├─ CompanyManagerSection (pre-filled, interactions 무시)
             ├─ LocationForm x2 (fillInFields, columnPulseTargets 구독)
             ├─ CargoInfoForm (fillInFields, dropdownBeat)
             ├─ DateTimeCard x2
             ├─ TransportOptionCard (strokeBeats)
             ├─ EstimateInfoCard (fillInFields, rollingTargets, strokeBeats)
             ├─ SettlementSection (rollingTargets)
             └─ RegisterSuccessDialog (always hidden)
```

- 전역 상태 없음. 각 컴포넌트는 props만 읽음
- interactions는 **읽기 전용**. 각 컴포넌트 내부에서 useEffect로 타이밍 트리거 실행 (dispatch 없음)

---

## 5. 상태 전이 (useAutoPlay — 기존 유지)

- 기존 Phase 1/2 `useAutoPlay` 훅을 Phase 3에서 그대로 사용
- Phase 3 변경점: `steps` = `PREVIEW_STEPS` (4개), `duration` 값만 달라짐
- pause/resume timeout 우선순위 규칙 유지 (click 5s > hover 2s)

### 5-1. AI_APPLY 내부 2-beat 처리

`useAutoPlay`는 Step 단위(4개) 전이만 관리. **AI_APPLY 내부 partialBeat/allBeat는 `AiRegisterMain` 자식들이 `interactions.partialBeat.delay` / `allBeat.delay` 기반으로 `useEffect` + `setTimeout`으로 자체 스케줄링**.

장점: useAutoPlay 훅 수정 불필요. Phase 1/2 legacy 코드와 호환.

---

## 6. Mobile 상태 머신 (기존 유지)

```
Step A (AI_EXTRACT 요약 카드) ──(4s)──> Step B (AI_APPLY 완료 카드) ──(4s)──> Step A (루프)

cross-fade: 300ms (Desktop 오버랩 규칙 비적용)
인터랙티브 모드: 비활성화 (REQ-DASH-045)
조작감 10종: 미적용
```

---

## 7. Phase 2 인터랙티브 모드 (기존 유지)

- `useInteractiveMode` 훅 그대로 사용
- `hit-areas.ts` 재작성 (Phase 3 19~20 영역)
- #11 `company-manager.isEnabled = false` (pre-filled 비활성)
- Tablet 축약 폐기 (Desktop 동일 전체 활성)

상세: [`03-bridge-wireframe.md`](../00-context/03-bridge-wireframe.md) §5 히트 영역 매핑.

---

## 8. Verification 기준

| 항목 | 검증 명령 | 기대 결과 |
|------|-----------|-----------|
| stateless 준수 | grep `@/store`, `react-hook-form`, `@tanstack/react-query`, `next/navigation`, `@/lib/api` in `ai-register-main/` | 0건 |
| SSOT 정합 | `TC-DASH3-SSOT-MOCK` | exact match |
| interactions 타입 | `tsc --noEmit` | 0 errors |
| PREVIEW_STEPS 구조 | `TC-DASH3-UNIT-PREVIEWSTEPS` | 4 steps, interactions.partialBeat/allBeat 존재 |
| successDialogOpen 고정 | `TC-DASH3-UNIT-SUCCESSOFF` | 전 Step에서 `false` |

---

## 9. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-04-17 | 초안 — stateless 원칙 명시, PREVIEW_STEPS 컴파일타임 reducer, mock 스키마 요약, interactions 타입 확장 (partialBeat/allBeat), 단방향 데이터 흐름, Mobile/인터랙티브 기존 유지 방침 |
