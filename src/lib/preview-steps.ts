import { PREVIEW_MOCK_DATA } from './mock-data'

export type StepId = 'INITIAL' | 'AI_INPUT' | 'AI_EXTRACT' | 'AI_APPLY' | 'COMPLETE'

export interface AiPanelState {
  readonly inputText: string
  readonly extractState: 'idle' | 'loading' | 'resultReady'
  readonly buttons: ReadonlyArray<{
    readonly id: 'departure' | 'destination' | 'cargo' | 'fare'
    readonly status: 'pending' | 'applied'
  }>
}

export interface FormState {
  readonly filledCards: readonly string[]
  readonly highlightedCard: string | null
  readonly estimateAmount: number | null
}

export interface PreviewStep {
  readonly id: StepId
  readonly label: string
  readonly duration: number
  readonly aiPanelState: AiPanelState
  readonly formState: FormState
}

const EMPTY_FORM_STATE: FormState = {
  filledCards: [],
  highlightedCard: null,
  estimateAmount: null,
} as const

const CATEGORY_IDS = ['departure', 'destination', 'cargo', 'fare'] as const

const ALL_PENDING_BUTTONS: AiPanelState['buttons'] = CATEGORY_IDS.map((id) => ({
  id,
  status: 'pending' as const,
}))

const ALL_APPLIED_BUTTONS: AiPanelState['buttons'] = CATEGORY_IDS.map((id) => ({
  id,
  status: 'applied' as const,
}))

const FILLED_FORM_STATE: FormState = {
  filledCards: ['cargoInfo', 'location-departure', 'location-destination', 'estimate'],
  highlightedCard: null,
  estimateAmount: PREVIEW_MOCK_DATA.formData.estimate.amount,
} as const

export const PREVIEW_STEPS: readonly PreviewStep[] = [
  {
    id: 'INITIAL',
    label: '초기 화면',
    duration: 3000,
    aiPanelState: {
      inputText: '',
      extractState: 'idle',
      buttons: [],
    },
    formState: EMPTY_FORM_STATE,
  },
  {
    id: 'AI_INPUT',
    label: '메시지 입력',
    duration: 4000,
    aiPanelState: {
      inputText: PREVIEW_MOCK_DATA.aiInput.message,
      extractState: 'idle',
      buttons: [],
    },
    formState: EMPTY_FORM_STATE,
  },
  {
    id: 'AI_EXTRACT',
    label: 'AI 분석 완료',
    duration: 4000,
    aiPanelState: {
      inputText: PREVIEW_MOCK_DATA.aiInput.message,
      extractState: 'resultReady',
      buttons: ALL_PENDING_BUTTONS,
    },
    formState: EMPTY_FORM_STATE,
  },
  {
    id: 'AI_APPLY',
    label: '폼 자동 입력',
    duration: 4000,
    aiPanelState: {
      inputText: PREVIEW_MOCK_DATA.aiInput.message,
      extractState: 'resultReady',
      buttons: ALL_APPLIED_BUTTONS,
    },
    formState: FILLED_FORM_STATE,
  },
  {
    id: 'COMPLETE',
    label: '완료',
    duration: 3000,
    aiPanelState: {
      inputText: PREVIEW_MOCK_DATA.aiInput.message,
      extractState: 'resultReady',
      buttons: ALL_APPLIED_BUTTONS,
    },
    formState: FILLED_FORM_STATE,
  },
] as const
