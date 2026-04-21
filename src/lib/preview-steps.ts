/**
 * T-DASH3-M1-02 — PREVIEW_STEPS Phase 3 4-Step + interactions 타이밍 트랙
 *
 * REQ
 *  - REQ-DASH3-011: INITIAL → AI_INPUT → AI_EXTRACT → AI_APPLY 4단계 Step 스냅샷
 *  - REQ-DASH3-012: Step × flow 변화 매트릭스 (Phase 1 스펙 §7-3)
 *  - REQ-DASH3-041: AI_APPLY 2단 구조 (partialBeat → allBeat, 안 B)
 *  - REQ-DASH3-063: 조작감 타이밍 트랙 (typingRhythm, pressTargets, fillInFields, numberRolling, ...)
 *  - REQ-DASH3-014: CompanyManagerSection INITIAL 부터 pre-filled 유지
 *  - REQ-DASH3-022: AI_APPLY fill-in 대상에서 CompanyManager 제외
 *  - REQ-DASH3-029: Column-wise Border Pulse (columnPulseTargets)
 *  - REQ-DASH-010 / REQ-DASH-011 (수정): 5단계 → 4단계, duration 500 / 1500 / 1000 / 2500
 *
 * SSOT
 *  - Phase 1 스펙 §7 — Step 상태 스냅샷 (4단계 한정)
 *    `.plans/archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md`
 *  - Wireframe decision-log §4-3 — CompanyManager pre-filled
 *
 * 타이밍 (PRD §6-1)
 *   INITIAL   500ms  — 빈 폼 + caret 대기
 *   AI_INPUT  1500ms — #1 fake-typing
 *   AI_EXTRACT 1000ms — #3 button-press + spinner
 *   AI_APPLY  2500ms — partialBeat(1500: 4 × 300ms 간격) + allBeat(800ms 토글/정산)
 *   ────────── 5500ms + hold 500ms = 6000ms 루프
 *
 * Phase 1/2 backward compatibility
 *  - `PREVIEW_STEPS` 이름 유지
 *  - 각 Step 에 legacy 필드 (`id`, `label`, `duration`, `aiPanelState`, `formState`) 유지
 *  - legacy `aiPanelState.inputText/extractState/buttons` 와 `formState.filledCards/highlightedCard/estimateAmount`
 *    를 Phase 3 스냅샷으로부터 계산되는 alias 로 제공한다.
 *  - 기존 legacy 테스트의 5단계 가정은 Phase 3 기준으로 갱신 (방안 A).
 */

import { PREVIEW_MOCK_DATA } from './mock-data'
import type { AiCategoryId } from './mock-data'

// =============================================================================
// Types — Phase 3 snapshot
// =============================================================================

export type StepId = 'INITIAL' | 'AI_INPUT' | 'AI_EXTRACT' | 'AI_APPLY'

export type AiButtonStatus = 'pending' | 'applied' | 'unavailable'

/** Phase 1 스펙 §7-2 — AI 상태 스냅샷 */
export interface AiStateSnapshot {
  readonly activeTab: 'text' | 'image'
  /** 0~1 — 타이핑 진행률. 1 이면 최종 텍스트 전부 표시. */
  readonly textProgress: number
  readonly extractState: 'idle' | 'loading' | 'resultReady'
  /** 카테고리 버튼 상태 Record. key = AiCategoryId */
  readonly buttons: Readonly<Record<AiCategoryId, AiButtonStatus>>
  readonly warningsVisible: boolean
  readonly jsonViewerOpen: boolean
}

/** Phase 1 스펙 §7-2 — Form 상태 스냅샷 */
export interface FormStateSnapshot {
  readonly companyManagerFilled: boolean
  readonly pickupFilled: boolean
  readonly deliveryFilled: boolean
  readonly pickupDateTimeFilled: boolean
  readonly deliveryDateTimeFilled: boolean
  readonly vehicleFilled: boolean
  readonly cargoFilled: boolean
  readonly optionsActive: ReadonlyArray<string>
  readonly estimateVisible: boolean
  readonly settlementVisible: boolean
  readonly highlightedSection: string | null
  /** Phase 1 고정 — 항상 false */
  readonly successDialogOpen: false
  // ----- Phase 1/2 legacy aliases (기존 소비자 보존) -----
  /** legacy form-preview.tsx 가 읽는 cardId 배열 (cargoInfo, location-*, estimate). */
  readonly filledCards: ReadonlyArray<string>
  readonly highlightedCard: string | null
  readonly estimateAmount: number | null
}

/** AI_APPLY partialBeat (안 B) — 카테고리 순차 적용 */
export interface AiApplyPartialBeat {
  readonly categoryOrder: ReadonlyArray<AiCategoryId>
  /** 카테고리 간 간격 (ms) */
  readonly intervalMs: number
  readonly pressTargets: ReadonlyArray<string>
  readonly rippleTargets: ReadonlyArray<string>
  readonly fillInFields: ReadonlyArray<{
    readonly fieldId: string
    readonly value: string
    readonly delay: number
  }>
}

/** AI_APPLY allBeat (안 B) — 전체 적용 비트 (토글/자동배차/정산/숫자 롤링) */
export interface AiApplyAllBeat {
  readonly durationMs: number
  /** TransportOption 8옵션 토글 stroke 대상 */
  readonly toggleStrokeTargets: ReadonlyArray<string>
  readonly autoDispatchTrigger: boolean
  readonly settlementReveal: boolean
  readonly numberRollingTargets: ReadonlyArray<{
    readonly targetId: string
    readonly finalValue: number
  }>
}

/** 조작감 타이밍 트랙 (Phase 1 스펙 §7-2 + §11) */
export interface InteractionsTrack {
  /** #1 fake-typing (AI_INPUT) */
  readonly typingRhythm?: {
    readonly target: 'ai-input-textarea'
    readonly active: boolean
  }
  /** #2 focus-walk 대상 id 순서 */
  readonly focusWalk?: ReadonlyArray<string>
  /** #3 button-press 자동 트리거 대상 id */
  readonly pressTargets?: ReadonlyArray<string>
  /** #6 fill-in caret — 비 partialBeat 경로 (선택) */
  readonly fillInFields?: ReadonlyArray<{
    readonly fieldId: string
    readonly value: string
    readonly delay: number
  }>
  /** AI_APPLY 2단 구조 — 부분 적용 */
  readonly partialBeat?: AiApplyPartialBeat
  /** AI_APPLY 2단 구조 — 전체 적용 */
  readonly allBeat?: AiApplyAllBeat
  /** #8 number-rolling 대상 id (AI_APPLY) */
  readonly numberRollingTargets?: ReadonlyArray<{
    readonly targetId: string
    readonly finalValue: number
  }>
  /** #10 column pulse — 섹션 Border Pulse 대상 (REQ-DASH3-029) */
  readonly columnPulseTargets?: ReadonlyArray<string>
}

// =============================================================================
// Types — Phase 1/2 legacy shape (compat)
// =============================================================================

/**
 * Phase 1/2 legacy AiPanelState — ai-panel-preview.tsx 가 읽는 shape.
 * Phase 3 aiState 로부터 계산되는 alias 로 제공된다.
 */
export interface AiPanelState {
  readonly inputText: string
  readonly extractState: 'idle' | 'loading' | 'resultReady'
  readonly buttons: ReadonlyArray<{
    readonly id: AiCategoryId
    readonly status: 'pending' | 'applied'
  }>
}

/**
 * Phase 1/2 legacy FormState — form-preview.tsx 가 읽는 shape.
 * 3 필드만 포함하는 좁은 인터페이스로, step.formState (FormStateSnapshot) 를 assignable 하게 만든다.
 * FormStateSnapshot 은 이 세 필드를 alias 로 포함하므로 `FormState` 가 요구하는 shape 를 만족한다.
 */
export interface FormState {
  readonly filledCards: ReadonlyArray<string>
  readonly highlightedCard: string | null
  readonly estimateAmount: number | null
}

// =============================================================================
// Types — PreviewStep
// =============================================================================

export interface PreviewStep {
  readonly id: StepId
  readonly label: string
  /** Step 지속시간 (ms). PRD §6-1 타이밍 고정. */
  readonly duration: number
  /** Phase 3 AI 상태 스냅샷 */
  readonly aiState: AiStateSnapshot
  /** Phase 3 Form 상태 스냅샷 (legacy alias 포함) */
  readonly formState: FormStateSnapshot
  /** 조작감 타이밍 트랙 */
  readonly interactions: InteractionsTrack
  /** Phase 1/2 legacy AiPanelState alias (ai-panel-preview.tsx) */
  readonly aiPanelState: AiPanelState
}

// =============================================================================
// Constants — durations (PRD §6-1)
// =============================================================================

const DURATION_INITIAL = 500
const DURATION_AI_INPUT = 1500
const DURATION_AI_EXTRACT = 1000
const DURATION_AI_APPLY = 2500

const PARTIAL_INTERVAL_MS = 300
const ALL_BEAT_MS = 800

const CATEGORY_ORDER: ReadonlyArray<AiCategoryId> = [
  'departure',
  'destination',
  'cargo',
  'fare',
] as const

// =============================================================================
// Helpers — build legacy aliases from Phase 3 snapshots
// =============================================================================

function buttonsRecord(status: AiButtonStatus): Readonly<Record<AiCategoryId, AiButtonStatus>> {
  return {
    departure: status,
    destination: status,
    cargo: status,
    fare: status,
  } as const
}

function legacyButtons(
  buttons: Readonly<Record<AiCategoryId, AiButtonStatus>>,
  includeEmpty: boolean,
): AiPanelState['buttons'] {
  // Phase 1/2 legacy 계약: AI_EXTRACT/AI_APPLY 에서만 4개 엔트리 노출,
  // INITIAL/AI_INPUT 에서는 빈 배열 (ai-panel-preview.tsx AiResultButtons 렌더링 조건)
  if (includeEmpty) return []
  return CATEGORY_ORDER.map((id) => {
    const status = buttons[id]
    // 'unavailable' 은 legacy shape 에서 'pending' 으로 매핑
    const legacyStatus: 'pending' | 'applied' =
      status === 'applied' ? 'applied' : 'pending'
    return { id, status: legacyStatus }
  })
}

function computeInputText(textProgress: number): string {
  const full = PREVIEW_MOCK_DATA.aiInput.message
  if (textProgress <= 0) return ''
  if (textProgress >= 1) return full
  // INITIAL/AI_INPUT 간 중간 표시는 use-fake-typing 훅이 세분화 제어.
  // 스냅샷 계산에서는 최종값 반환으로 legacy 테스트 호환성 확보.
  return full
}

function legacyFilledCards(snap: {
  readonly pickupFilled: boolean
  readonly deliveryFilled: boolean
  readonly cargoFilled: boolean
  readonly estimateVisible: boolean
}): ReadonlyArray<string> {
  const cards: string[] = []
  if (snap.cargoFilled) cards.push('cargoInfo')
  if (snap.pickupFilled) cards.push('location-departure')
  if (snap.deliveryFilled) cards.push('location-destination')
  if (snap.estimateVisible) cards.push('estimate')
  return cards
}

// =============================================================================
// Shared constants — Phase 3 form snapshots
// =============================================================================

/** INITIAL/AI_INPUT/AI_EXTRACT 공통: companyManager 만 pre-filled. 나머지 비어 있음. */
const FORM_EMPTY_WITH_COMPANY: Omit<FormStateSnapshot, 'filledCards' | 'highlightedCard' | 'estimateAmount'> = {
  companyManagerFilled: true,
  pickupFilled: false,
  deliveryFilled: false,
  pickupDateTimeFilled: false,
  deliveryDateTimeFilled: false,
  vehicleFilled: false,
  cargoFilled: false,
  optionsActive: [],
  estimateVisible: false,
  settlementVisible: false,
  highlightedSection: null,
  successDialogOpen: false,
} as const

/** AI_APPLY: 모든 필드 적용 완료 (companyManager 포함, 이미 INITIAL 부터 true) */
const FORM_ALL_FILLED_BASE: Omit<FormStateSnapshot, 'filledCards' | 'highlightedCard' | 'estimateAmount'> = {
  companyManagerFilled: true,
  pickupFilled: true,
  deliveryFilled: true,
  pickupDateTimeFilled: true,
  deliveryDateTimeFilled: true,
  vehicleFilled: true,
  cargoFilled: true,
  optionsActive: ['direct', 'forklift'],
  estimateVisible: true,
  settlementVisible: true,
  highlightedSection: null,
  successDialogOpen: false,
} as const

function buildFormState(
  base: Omit<FormStateSnapshot, 'filledCards' | 'highlightedCard' | 'estimateAmount'>,
  estimateAmount: number | null,
): FormStateSnapshot {
  return {
    ...base,
    filledCards: legacyFilledCards({
      pickupFilled: base.pickupFilled,
      deliveryFilled: base.deliveryFilled,
      cargoFilled: base.cargoFilled,
      estimateVisible: base.estimateVisible,
    }),
    highlightedCard: base.highlightedSection,
    estimateAmount,
  }
}

// =============================================================================
// AI_APPLY partialBeat — fillInFields
// =============================================================================

/**
 * AI_APPLY partialBeat 필드 적용 스크립트.
 * REQ-DASH3-022 — companyManager 는 제외한다 (이미 INITIAL 부터 pre-filled).
 * REQ-DASH3-041 — 카테고리 순서 departure → destination → cargo → fare, 300ms 간격.
 */
const PARTIAL_FILL_IN_FIELDS: ReadonlyArray<{
  readonly fieldId: string
  readonly value: string
  readonly delay: number
}> = [
  // departure (index 0 × 300 = 0ms)
  {
    fieldId: 'pickup-address',
    value: PREVIEW_MOCK_DATA.formData.pickup.roadAddress,
    delay: 0,
  },
  {
    fieldId: 'pickup-datetime',
    value: `${PREVIEW_MOCK_DATA.formData.pickup.date} ${PREVIEW_MOCK_DATA.formData.pickup.time}`,
    delay: 0,
  },
  // destination (index 1 × 300 = 300ms)
  {
    fieldId: 'delivery-address',
    value: PREVIEW_MOCK_DATA.formData.delivery.roadAddress,
    delay: PARTIAL_INTERVAL_MS,
  },
  {
    fieldId: 'delivery-datetime',
    value: `${PREVIEW_MOCK_DATA.formData.delivery.date} ${PREVIEW_MOCK_DATA.formData.delivery.time}`,
    delay: PARTIAL_INTERVAL_MS,
  },
  // cargo (index 2 × 300 = 600ms)
  {
    fieldId: 'vehicle-type',
    value: PREVIEW_MOCK_DATA.formData.vehicle.type,
    delay: PARTIAL_INTERVAL_MS * 2,
  },
  {
    fieldId: 'vehicle-weight',
    value: PREVIEW_MOCK_DATA.formData.vehicle.weight,
    delay: PARTIAL_INTERVAL_MS * 2,
  },
  {
    fieldId: 'cargo-name',
    value: PREVIEW_MOCK_DATA.formData.cargo.name,
    delay: PARTIAL_INTERVAL_MS * 2,
  },
  // fare (index 3 × 300 = 900ms) — fill-in 은 number-rolling 으로 대체 (allBeat 진입 직전)
] as const

/** partialBeat 중 각 카테고리 버튼 press 타깃 (안 B) */
const PARTIAL_PRESS_TARGETS: ReadonlyArray<string> = CATEGORY_ORDER.map(
  (id) => `ai-result-${id}-press`,
)

/** partialBeat 중 각 카테고리 버튼 ripple 타깃 */
const PARTIAL_RIPPLE_TARGETS: ReadonlyArray<string> = CATEGORY_ORDER.map(
  (id) => `ai-result-${id}-ripple`,
)

// =============================================================================
// AI_APPLY allBeat — toggle stroke + number rolling
// =============================================================================

const TOGGLE_STROKE_TARGETS: ReadonlyArray<string> = [
  'transport-option-fast',
  'transport-option-roundTrip',
  'transport-option-direct',
  'transport-option-trace',
  'transport-option-forklift',
  'transport-option-manual',
  'transport-option-cod',
  'transport-option-special',
] as const

const NUMBER_ROLLING_TARGETS: ReadonlyArray<{
  readonly targetId: string
  readonly finalValue: number
}> = [
  { targetId: 'estimate-distance', finalValue: PREVIEW_MOCK_DATA.formData.estimate.distance },
  { targetId: 'estimate-duration', finalValue: PREVIEW_MOCK_DATA.formData.estimate.duration },
  { targetId: 'estimate-amount', finalValue: PREVIEW_MOCK_DATA.formData.estimate.amount },
  { targetId: 'settlement-charge-total', finalValue: PREVIEW_MOCK_DATA.formData.settlement.totals.chargeTotal },
  { targetId: 'settlement-dispatch-total', finalValue: PREVIEW_MOCK_DATA.formData.settlement.totals.dispatchTotal },
  { targetId: 'settlement-profit', finalValue: PREVIEW_MOCK_DATA.formData.settlement.totals.profit },
] as const

const COLUMN_PULSE_TARGETS: ReadonlyArray<string> = [
  'col-pickup',
  'col-delivery',
  'col-vehicle-cargo',
  'col-options-estimate',
] as const

// =============================================================================
// Step snapshots
// =============================================================================

/** INITIAL — 빈 폼 + caret 대기 */
const INITIAL_STEP: PreviewStep = (() => {
  const aiState: AiStateSnapshot = {
    activeTab: 'text',
    textProgress: 0,
    extractState: 'idle',
    buttons: buttonsRecord('pending'),
    warningsVisible: false,
    jsonViewerOpen: false,
  }
  const formState = buildFormState(FORM_EMPTY_WITH_COMPANY, null)
  const interactions: InteractionsTrack = {
    focusWalk: [],
    pressTargets: [],
  }
  return {
    id: 'INITIAL',
    label: '초기 화면',
    duration: DURATION_INITIAL,
    aiState,
    formState,
    interactions,
    aiPanelState: {
      inputText: computeInputText(aiState.textProgress),
      extractState: aiState.extractState,
      buttons: legacyButtons(aiState.buttons, /* includeEmpty */ true),
    },
  }
})()

/** AI_INPUT — #1 fake-typing */
const AI_INPUT_STEP: PreviewStep = (() => {
  const aiState: AiStateSnapshot = {
    activeTab: 'text',
    // textProgress: 0 < x < 1 — use-fake-typing 이 세분화 제어. 스냅샷에서는 0.5 로 고정.
    textProgress: 0.5,
    extractState: 'idle',
    buttons: buttonsRecord('pending'),
    warningsVisible: false,
    jsonViewerOpen: false,
  }
  const formState = buildFormState(FORM_EMPTY_WITH_COMPANY, null)
  const interactions: InteractionsTrack = {
    typingRhythm: { target: 'ai-input-textarea', active: true },
    focusWalk: ['ai-input-textarea'],
    pressTargets: [],
  }
  return {
    id: 'AI_INPUT',
    label: '메시지 입력',
    duration: DURATION_AI_INPUT,
    aiState,
    formState,
    interactions,
    aiPanelState: {
      inputText: computeInputText(aiState.textProgress),
      extractState: aiState.extractState,
      buttons: legacyButtons(aiState.buttons, /* includeEmpty */ true),
    },
  }
})()

/** AI_EXTRACT — #3 button-press + spinner */
const AI_EXTRACT_STEP: PreviewStep = (() => {
  const aiState: AiStateSnapshot = {
    activeTab: 'text',
    textProgress: 1,
    extractState: 'loading',
    buttons: buttonsRecord('pending'),
    warningsVisible: false,
    jsonViewerOpen: false,
  }
  const formState = buildFormState(FORM_EMPTY_WITH_COMPANY, null)
  const interactions: InteractionsTrack = {
    focusWalk: ['ai-extract-button'],
    pressTargets: ['ai-extract-button'],
  }
  return {
    id: 'AI_EXTRACT',
    label: 'AI 분석',
    duration: DURATION_AI_EXTRACT,
    aiState,
    formState,
    interactions,
    aiPanelState: {
      inputText: computeInputText(aiState.textProgress),
      extractState: aiState.extractState,
      // Phase 1/2 legacy 계약: 로딩 중에도 buttons 배열은 비어 있음
      buttons: legacyButtons(aiState.buttons, /* includeEmpty */ true),
    },
  }
})()

/** AI_APPLY — partialBeat + allBeat (안 B) */
const AI_APPLY_STEP: PreviewStep = (() => {
  const aiState: AiStateSnapshot = {
    activeTab: 'text',
    textProgress: 1,
    extractState: 'resultReady',
    buttons: buttonsRecord('applied'),
    warningsVisible: false,
    jsonViewerOpen: false,
  }
  const formState = buildFormState(
    FORM_ALL_FILLED_BASE,
    PREVIEW_MOCK_DATA.formData.estimate.amount,
  )
  const interactions: InteractionsTrack = {
    focusWalk: [
      'ai-result-departure',
      'ai-result-destination',
      'ai-result-cargo',
      'ai-result-fare',
    ],
    pressTargets: [...PARTIAL_PRESS_TARGETS],
    partialBeat: {
      categoryOrder: CATEGORY_ORDER,
      intervalMs: PARTIAL_INTERVAL_MS,
      pressTargets: PARTIAL_PRESS_TARGETS,
      rippleTargets: PARTIAL_RIPPLE_TARGETS,
      fillInFields: PARTIAL_FILL_IN_FIELDS,
    },
    allBeat: {
      durationMs: ALL_BEAT_MS,
      toggleStrokeTargets: TOGGLE_STROKE_TARGETS,
      autoDispatchTrigger: true,
      settlementReveal: true,
      numberRollingTargets: NUMBER_ROLLING_TARGETS,
    },
    numberRollingTargets: NUMBER_ROLLING_TARGETS,
    columnPulseTargets: COLUMN_PULSE_TARGETS,
  }
  return {
    id: 'AI_APPLY',
    label: '폼 자동 입력',
    duration: DURATION_AI_APPLY,
    aiState,
    formState,
    interactions,
    aiPanelState: {
      inputText: computeInputText(aiState.textProgress),
      extractState: aiState.extractState,
      buttons: legacyButtons(aiState.buttons, /* includeEmpty */ false),
    },
  }
})()

// =============================================================================
// Export — PREVIEW_STEPS (4단계)
// =============================================================================

export const PREVIEW_STEPS: ReadonlyArray<PreviewStep> = [
  INITIAL_STEP,
  AI_INPUT_STEP,
  AI_EXTRACT_STEP,
  AI_APPLY_STEP,
] as const
