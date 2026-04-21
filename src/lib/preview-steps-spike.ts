/**
 * @spike T-DASH3-SPIKE-01 — 종료 시 이관 or 폐기
 *
 * Spike 4-Step 스냅샷 + interactions 타이밍 트랙.
 *
 * Step ID: INITIAL / AI_INPUT / AI_EXTRACT / AI_APPLY
 * Duration: 500 / 1500 / 1000 / 2500 (ms)
 * 총 루프: 5500ms (오버랩 미포함), PRD 목표 6~8초 범위 내 측정 예정
 *
 * 개발자가 Chrome DevTools Console에서 beat 타이밍 관찰하기 위한
 * performance.now() 로깅 헬퍼 `logSpikeStep` 포함.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SpikeStepId = 'INITIAL' | 'AI_INPUT' | 'AI_EXTRACT' | 'AI_APPLY'

/** 조작감 타이밍 트랙 */
export interface SpikeInteractionsTrack {
  /** #1 fake-typing 대상 (AiInputArea textarea) */
  readonly typingRhythm: ReadonlyArray<{
    readonly target: 'ai-input-textarea'
    readonly active: boolean
  }>
  /** #3 button-press 자동 트리거 대상 (AiExtractButton) */
  readonly pressTargets: ReadonlyArray<{
    readonly target: 'ai-extract-button'
    /** step 시작 기준 offset (ms). null이면 press 비활성 */
    readonly triggerAt: number | null
  }>
  /** #6 fill-in caret 대상 (Spike는 placeholder — M1에서 활성) */
  readonly fillInFields: ReadonlyArray<{
    readonly fieldKey: string
    readonly active: boolean
  }>
  /** #8 number-rolling 대상 (EstimateInfoCard 숫자 필드) */
  readonly numberRollingTargets: ReadonlyArray<{
    readonly target: 'estimate-distance' | 'estimate-duration' | 'estimate-amount'
    readonly active: boolean
  }>
}

export interface SpikeStepSnapshot {
  readonly id: SpikeStepId
  readonly index: number
  readonly label: string
  /** Step 지속시간 (ms) */
  readonly duration: number
  /** AI 입력 textarea에 표시될 (타이핑 진행된) 텍스트 */
  readonly aiInputText: string
  /** Estimate 카드 활성 여부 (AI_APPLY 에서만 true) */
  readonly estimateActive: boolean
  /** 조작감 타이밍 트랙 */
  readonly interactions: SpikeInteractionsTrack
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const STEP_DURATIONS: Readonly<Record<SpikeStepId, number>> = {
  INITIAL: 500,
  AI_INPUT: 1500,
  AI_EXTRACT: 1000,
  AI_APPLY: 2500,
}

export const STEP_ORDER: ReadonlyArray<SpikeStepId> = [
  'INITIAL',
  'AI_INPUT',
  'AI_EXTRACT',
  'AI_APPLY',
] as const

// ---------------------------------------------------------------------------
// Snapshots (INITIAL → AI_INPUT → AI_EXTRACT → AI_APPLY)
// ---------------------------------------------------------------------------

export const SPIKE_STEPS: ReadonlyArray<SpikeStepSnapshot> = [
  {
    id: 'INITIAL',
    index: 0,
    label: '시작',
    duration: STEP_DURATIONS.INITIAL,
    aiInputText: '',
    estimateActive: false,
    interactions: {
      typingRhythm: [{ target: 'ai-input-textarea', active: false }],
      pressTargets: [{ target: 'ai-extract-button', triggerAt: null }],
      fillInFields: [],
      numberRollingTargets: [
        { target: 'estimate-distance', active: false },
        { target: 'estimate-duration', active: false },
        { target: 'estimate-amount', active: false },
      ],
    },
  },
  {
    id: 'AI_INPUT',
    index: 1,
    label: 'AI 입력',
    duration: STEP_DURATIONS.AI_INPUT,
    // 타이핑 애니메이션 중 표시되는 최종값. use-fake-typing 이 progress 관리.
    aiInputText: '내일 오전 서울 강남에서 부산까지 5톤 화물 보내주세요',
    estimateActive: false,
    interactions: {
      typingRhythm: [{ target: 'ai-input-textarea', active: true }],
      pressTargets: [{ target: 'ai-extract-button', triggerAt: null }],
      fillInFields: [],
      numberRollingTargets: [
        { target: 'estimate-distance', active: false },
        { target: 'estimate-duration', active: false },
        { target: 'estimate-amount', active: false },
      ],
    },
  },
  {
    id: 'AI_EXTRACT',
    index: 2,
    label: 'AI 추출',
    duration: STEP_DURATIONS.AI_EXTRACT,
    aiInputText: '내일 오전 서울 강남에서 부산까지 5톤 화물 보내주세요',
    estimateActive: false,
    interactions: {
      typingRhythm: [{ target: 'ai-input-textarea', active: false }],
      // Step 시작 50ms 후 버튼 press (150ms) — 사용자가 클릭하는 느낌
      pressTargets: [{ target: 'ai-extract-button', triggerAt: 50 }],
      fillInFields: [],
      numberRollingTargets: [
        { target: 'estimate-distance', active: false },
        { target: 'estimate-duration', active: false },
        { target: 'estimate-amount', active: false },
      ],
    },
  },
  {
    id: 'AI_APPLY',
    index: 3,
    label: 'AI 적용',
    duration: STEP_DURATIONS.AI_APPLY,
    aiInputText: '내일 오전 서울 강남에서 부산까지 5톤 화물 보내주세요',
    estimateActive: true,
    interactions: {
      typingRhythm: [{ target: 'ai-input-textarea', active: false }],
      pressTargets: [{ target: 'ai-extract-button', triggerAt: null }],
      fillInFields: [],
      numberRollingTargets: [
        { target: 'estimate-distance', active: true },
        { target: 'estimate-duration', active: true },
        { target: 'estimate-amount', active: true },
      ],
    },
  },
]

// ---------------------------------------------------------------------------
// Performance logging (Dev 전용)
// ---------------------------------------------------------------------------

/** 전역 비활성화 플래그 (production build 영향 최소화) */
const IS_DEV =
  typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'

/**
 * Step 전환 시점을 Chrome DevTools Console에 기록.
 * 개발자가 beat 간격 실측할 때 사용.
 */
export function logSpikeStep(stepId: SpikeStepId, phase: 'enter' | 'exit'): void {
  if (!IS_DEV) return
  if (typeof performance === 'undefined') return

  const timestamp = performance.now().toFixed(2)
  console.info(`[spike][${timestamp}ms] ${stepId} ${phase}`)
}

/** Spike 컨테이너에서 사용할 step 정의 묶음 */
export const SPIKE_PREVIEW = {
  steps: SPIKE_STEPS,
  order: STEP_ORDER,
  durations: STEP_DURATIONS,
  log: logSpikeStep,
} as const
