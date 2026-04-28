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
 *  - REQ-DASH-010 / REQ-DASH-011 (수정): 5단계 → 4단계, duration 1600 / 4400 / 2800 / 14400
 *
 * SSOT
 *  - Phase 1 스펙 §7 — Step 상태 스냅샷 (4단계 한정)
 *    `.plans/archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md`
 *  - Wireframe decision-log §4-3 — CompanyManager pre-filled
 *
 * 타이밍 (PRD §6-1)
 *   INITIAL   1600ms  — 빈 폼 + caret 대기
 *   AI_INPUT  4400ms  — #1 fake-typing
 *   AI_EXTRACT 2800ms — #3 button-press + spinner
 *   AI_APPLY  14400ms — result/card focus phase 반복 + partialBeat/allBeat
 *   ────────── 23200ms 루프
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

export const PREVIEW_FOCUS_TARGET_IDS = [
  'ai-preview-frame',
  'ai-input-textarea',
  'ai-extract-button',
  'ai-result-group',
  'ai-result-departure',
  'ai-result-destination',
  'ai-result-cargo',
  'ai-result-fare',
  'form-pickup-location',
  'form-delivery-location',
  'form-cargo-info',
  'form-estimate-info',
] as const

export type PreviewFocusTargetId = typeof PREVIEW_FOCUS_TARGET_IDS[number]

export interface PreviewFocusViewportPreset {
  /** CSS transform scale value. */
  readonly scale: number
  /** CSS translateX percentage for the focus wrapper. */
  readonly x: number
  /** CSS translateY percentage for the focus wrapper. */
  readonly y: number
}

export interface PreviewFocusMetadata {
  readonly stepId: StepId
  readonly targetId: PreviewFocusTargetId
  readonly label: string
  readonly viewport: {
    readonly desktop: PreviewFocusViewportPreset
    readonly tablet: PreviewFocusViewportPreset
  }
  readonly duration: number
  readonly reducedMotionFallback: {
    readonly strategy: 'highlight-only'
    readonly targetId: PreviewFocusTargetId
  }
  readonly ariaHiddenLayer: true
}

export interface PreviewFocusTimingViolation {
  readonly stepId: StepId
  readonly focusDuration: number
  readonly stepDuration: number
}

export interface PreviewFocusTimingValidationResult {
  readonly valid: boolean
  readonly violations: ReadonlyArray<PreviewFocusTimingViolation>
}

export interface AiApplyFocusPair {
  readonly categoryId: AiCategoryId
  readonly resultTargetId: PreviewFocusTargetId
  readonly cardTargetId: PreviewFocusTargetId
  readonly label: string
}

export const AI_APPLY_FOCUS_PHASE_HOLD_MS = 1800

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

export interface StepVisibilityState {
  readonly estimateVisible: boolean
  readonly settlementVisible: boolean
}

/** AI_APPLY partialBeat (안 B) — 카테고리 순차 적용 */
export interface AiApplyPartialBeat {
  readonly categoryOrder: ReadonlyArray<AiCategoryId>
  /** 카테고리 간 간격 (ms) */
  readonly intervalMs: number
  readonly pressTargets: ReadonlyArray<string>
  /**
   * M4-review#1 — 자동 ripple 을 발동할 카테고리 id 집합 (REQ-DASH3-025).
   * AiPanelContainer 가 `rippleTargets.includes(groupId)` 로 해당 카테고리의
   * `rippleTriggerAt` 를 계산한다. 배열이 비어 있으면 전체 비활성.
   */
  readonly rippleTargets: ReadonlyArray<AiCategoryId>
  readonly fillInFields: ReadonlyArray<{
    readonly fieldId: string
    readonly value: string
    readonly delay: number
  }>
  /**
   * #7 dropdown 펼침 연출 (REQ-DASH3-027).
   * CargoInfoForm 내 `vehicle-type` / `weight` select 중 하나를 펼쳐 하이라이트.
   * cargo 카테고리 offset 이후에 발동되어야 자연스럽다.
   *
   * M3-review#1 — 원래 CargoInfoForm 이 prop 을 받도록 M3-06 에서 선언되었으나,
   * OrderFormContainer 에서 주입이 누락되어 연출이 실질 비활성이던 것을 이 필드로 실활성한다.
   */
  readonly dropdownBeat?: {
    readonly targetId: 'vehicle-type' | 'weight'
    readonly triggerAt: number
  }
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
export interface FormRevealTimeline {
  readonly pickupAt: number
  readonly deliveryAt: number
  readonly estimateAt: number
  readonly cargoAt: number
  readonly optionsAt: number
  readonly fareAt: number
  readonly settlementAt: number
}

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
  readonly formRevealTimeline?: FormRevealTimeline
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
  /** Focus viewport metadata for dash-preview-focus-zoom-animation. */
  readonly focus: PreviewFocusMetadata
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

const DURATION_INITIAL = 1600
const DURATION_AI_INPUT = 4400
const DURATION_AI_EXTRACT = 2800
const DURATION_AI_APPLY = 14400

const PARTIAL_INTERVAL_MS = 1300
const ALL_BEAT_MS = 2400

const FOCUS_DURATION_INITIAL = 600
const FOCUS_DURATION_AI_INPUT = 1800
const FOCUS_DURATION_AI_EXTRACT = 1400
const FOCUS_DURATION_AI_APPLY = 1800
const FOCUS_DURATION_AI_APPLY_SUBPHASE = 1600

const CATEGORY_ORDER: ReadonlyArray<AiCategoryId> = [
  'departure',
  'destination',
  'cargo',
  'fare',
] as const

const PREVIEW_FOCUS_BY_STEP: Readonly<Record<StepId, PreviewFocusMetadata>> = {
  INITIAL: {
    stepId: 'INITIAL',
    targetId: 'ai-preview-frame',
    label: '전체 미리보기',
    viewport: {
      desktop: { scale: 1, x: 0, y: 0 },
      tablet: { scale: 1, x: 0, y: 0 },
    },
    duration: FOCUS_DURATION_INITIAL,
    reducedMotionFallback: {
      strategy: 'highlight-only',
      targetId: 'ai-preview-frame',
    },
    ariaHiddenLayer: true,
  },
  AI_INPUT: {
    stepId: 'AI_INPUT',
    targetId: 'ai-input-textarea',
    label: '카톡 텍스트 입력창',
    viewport: {
      desktop: { scale: 1.22, x: 14, y: 8 },
      tablet: { scale: 1.16, x: 10, y: 6 },
    },
    duration: FOCUS_DURATION_AI_INPUT,
    reducedMotionFallback: {
      strategy: 'highlight-only',
      targetId: 'ai-input-textarea',
    },
    ariaHiddenLayer: true,
  },
  AI_EXTRACT: {
    stepId: 'AI_EXTRACT',
    targetId: 'ai-extract-button',
    label: '추출하기 버튼',
    viewport: {
      desktop: { scale: 1.18, x: 14, y: 16 },
      tablet: { scale: 1.12, x: 10, y: 12 },
    },
    duration: FOCUS_DURATION_AI_EXTRACT,
    reducedMotionFallback: {
      strategy: 'highlight-only',
      targetId: 'ai-extract-button',
    },
    ariaHiddenLayer: true,
  },
  AI_APPLY: {
    stepId: 'AI_APPLY',
    targetId: 'ai-result-group',
    label: '추출 결과 그룹',
    viewport: {
      desktop: { scale: 1.16, x: 12, y: 4 },
      tablet: { scale: 1.1, x: 8, y: 4 },
    },
    duration: FOCUS_DURATION_AI_APPLY,
    reducedMotionFallback: {
      strategy: 'highlight-only',
      targetId: 'ai-result-group',
    },
    ariaHiddenLayer: true,
  },
} as const

export const AI_APPLY_FOCUS_PAIRS: ReadonlyArray<AiApplyFocusPair> = [
  {
    categoryId: 'departure',
    resultTargetId: 'ai-result-departure',
    cardTargetId: 'form-pickup-location',
    label: '상차지',
  },
  {
    categoryId: 'destination',
    resultTargetId: 'ai-result-destination',
    cardTargetId: 'form-delivery-location',
    label: '하차지',
  },
  {
    categoryId: 'cargo',
    resultTargetId: 'ai-result-cargo',
    cardTargetId: 'form-cargo-info',
    label: '화물 정보',
  },
  {
    categoryId: 'fare',
    resultTargetId: 'ai-result-fare',
    cardTargetId: 'form-estimate-info',
    label: '운임',
  },
] as const

function buildAiApplyFocusMetadata(
  targetId: PreviewFocusTargetId,
  label: string,
  viewport: PreviewFocusMetadata['viewport'],
): PreviewFocusMetadata {
  return {
    stepId: 'AI_APPLY',
    targetId,
    label,
    viewport,
    duration: FOCUS_DURATION_AI_APPLY_SUBPHASE,
    reducedMotionFallback: {
      strategy: 'highlight-only',
      targetId,
    },
    ariaHiddenLayer: true,
  } as const
}

const AI_APPLY_RESULT_FOCUS_BY_CATEGORY: Readonly<
  Record<AiCategoryId, PreviewFocusMetadata>
> = {
  departure: buildAiApplyFocusMetadata('ai-result-departure', '상차지 추출정보', {
    desktop: { scale: 1.18, x: 14, y: -2 },
    tablet: { scale: 1.12, x: 10, y: -2 },
  }),
  destination: buildAiApplyFocusMetadata('ai-result-destination', '하차지 추출정보', {
    desktop: { scale: 1.18, x: 14, y: -8 },
    tablet: { scale: 1.12, x: 10, y: -6 },
  }),
  cargo: buildAiApplyFocusMetadata('ai-result-cargo', '화물 정보 추출정보', {
    desktop: { scale: 1.18, x: 14, y: -14 },
    tablet: { scale: 1.12, x: 10, y: -10 },
  }),
  fare: buildAiApplyFocusMetadata('ai-result-fare', '운임 추출정보', {
    desktop: { scale: 1.18, x: 14, y: -20 },
    tablet: { scale: 1.12, x: 10, y: -14 },
  }),
} as const

const AI_APPLY_CARD_FOCUS_BY_CATEGORY: Readonly<
  Record<AiCategoryId, PreviewFocusMetadata>
> = {
  departure: buildAiApplyFocusMetadata('form-pickup-location', '상차지 입력 카드', {
    desktop: { scale: 1.22, x: -38, y: -6 },
    tablet: { scale: 1.14, x: -30, y: -4 },
  }),
  destination: buildAiApplyFocusMetadata('form-delivery-location', '하차지 입력 카드', {
    desktop: { scale: 1.22, x: -38, y: -18 },
    tablet: { scale: 1.14, x: -30, y: -14 },
  }),
  cargo: buildAiApplyFocusMetadata('form-cargo-info', '화물 정보 입력 카드', {
    desktop: { scale: 1.2, x: -58, y: -18 },
    tablet: { scale: 1.12, x: -45, y: -14 },
  }),
  fare: buildAiApplyFocusMetadata('form-estimate-info', '운임 입력 카드', {
    desktop: { scale: 1.18, x: -74, y: -8 },
    tablet: { scale: 1.1, x: -56, y: -6 },
  }),
} as const

export function getPreviewFocusMetadata(stepId: StepId): PreviewFocusMetadata | undefined {
  return PREVIEW_FOCUS_BY_STEP[stepId]
}

export function getAiApplyResultFocusMetadata(
  categoryId: AiCategoryId,
): PreviewFocusMetadata | undefined {
  return AI_APPLY_RESULT_FOCUS_BY_CATEGORY[categoryId]
}

export function getAiApplyCardFocusMetadata(
  categoryId: AiCategoryId,
): PreviewFocusMetadata | undefined {
  return AI_APPLY_CARD_FOCUS_BY_CATEGORY[categoryId]
}

export function getAiApplyFocusPairIndex(categoryId: AiCategoryId): number {
  return AI_APPLY_FOCUS_PAIRS.findIndex((pair) => pair.categoryId === categoryId)
}

export function validatePreviewFocusTiming(
  steps: ReadonlyArray<Pick<PreviewStep, 'id' | 'duration' | 'focus'>>,
): PreviewFocusTimingValidationResult {
  const violations = steps
    .filter((step) => step.focus.duration > step.duration)
    .map((step) => ({
      stepId: step.id,
      focusDuration: step.focus.duration,
      stepDuration: step.duration,
    }))

  return {
    valid: violations.length === 0,
    violations,
  } as const
}

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
  // Phase 1/2 legacy consumer 가 중간 진행률(예: AI_INPUT 의 textProgress=0.5)에서
  // "진행 중인 타이핑 텍스트"를 그대로 표시할 수 있도록 full.length × progress 만큼 slice.
  // Phase 3 경로(use-fake-typing)는 자체 세분화 계산이 있어 이 함수에 의존하지 않는다.
  return full.slice(0, Math.floor(full.length * textProgress))
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

export function getStepVisibilityState(step: Pick<PreviewStep, 'formState'>): StepVisibilityState {
  return {
    estimateVisible: step.formState.estimateVisible,
    settlementVisible: step.formState.settlementVisible,
  } as const
}

// =============================================================================
// AI_APPLY partialBeat — fillInFields
// =============================================================================

/**
 * AI_APPLY partialBeat 필드 적용 스크립트.
 * REQ-DASH3-022 — companyManager 는 제외한다 (이미 INITIAL 부터 pre-filled).
 * REQ-DASH3-041 — 카테고리 순서 departure → destination → cargo → fare, PARTIAL_INTERVAL_MS 간격.
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
  // destination (index 1 × PARTIAL_INTERVAL_MS)
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
  // cargo (index 2 × PARTIAL_INTERVAL_MS)
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
  // fare (index 3 × PARTIAL_INTERVAL_MS) — fill-in 은 number-rolling 으로 대체
] as const

/** partialBeat 중 각 카테고리 버튼 press 타깃 (안 B) */
const PARTIAL_PRESS_TARGETS: ReadonlyArray<string> = CATEGORY_ORDER.map(
  (id) => `ai-result-${id}-press`,
)

/**
 * partialBeat 자동 ripple 대상 카테고리 id (M4-review#1 재정의).
 * - 기존: `'ai-result-{id}-ripple'` 문자열 id — SSOT 소비처 부재.
 * - 현재: `AiCategoryId` 그대로. AiPanelContainer 가 groupId 존재 여부로 분기.
 * - 4개 전부 포함하여 departure/destination/cargo/fare 모두 자동 ripple.
 */
const PARTIAL_RIPPLE_TARGETS: ReadonlyArray<AiCategoryId> = [...CATEGORY_ORDER]

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

/**
 * M4-review#1 — Column-wise Border Pulse 대상 (REQ-DASH3-029).
 * 3-col grid 의 실제 DOM id (`col-1`/`col-2`/`col-3`) 에 맞춰 재정렬하여
 * SSOT 를 소비처와 1:1 매핑한다. OrderFormContainer 가 각 col 에 대해
 * `columnPulseTargets.includes('col-N')` 로 pulse 활성화를 판정한다.
 */
const COLUMN_PULSE_TARGETS: ReadonlyArray<string> = [
  'col-1',
  'col-2',
  'col-3',
] as const

const FORM_REVEAL_TIMELINE: FormRevealTimeline = {
  pickupAt: 0,
  deliveryAt: PARTIAL_INTERVAL_MS,
  estimateAt: 1800,
  cargoAt: PARTIAL_INTERVAL_MS * 2,
  optionsAt: PARTIAL_INTERVAL_MS * 2,
  fareAt: PARTIAL_INTERVAL_MS * 3,
  settlementAt: 4400,
} as const

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
    focus: PREVIEW_FOCUS_BY_STEP.INITIAL,
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
    focus: PREVIEW_FOCUS_BY_STEP.AI_INPUT,
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
    focus: PREVIEW_FOCUS_BY_STEP.AI_EXTRACT,
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
      // M3-review#1 — #7 dropdown 연출 (REQ-DASH3-027) 실활성.
      // cargo 카테고리 offset(PARTIAL_INTERVAL_MS * 2) 이후 발동.
      dropdownBeat: {
        targetId: 'vehicle-type',
        triggerAt: PARTIAL_INTERVAL_MS * 2,
      },
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
    formRevealTimeline: FORM_REVEAL_TIMELINE,
  }
  return {
    id: 'AI_APPLY',
    label: '폼 자동 입력',
    duration: DURATION_AI_APPLY,
    focus: PREVIEW_FOCUS_BY_STEP.AI_APPLY,
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
