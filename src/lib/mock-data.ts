/**
 * dash-preview Phase 3 mock data
 *
 * SSOT
 *  - 회사/담당자 pre-filled 값: `.plans/features/active/dash-preview-phase3/sources/wireframes/decision-log.md` §4-3
 *  - 전체 스키마: `.plans/archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md` §6
 *
 * 관련 요구사항
 *  - REQ-DASH3-010: INITIAL → AI_INPUT → AI_EXTRACT → AI_APPLY 4단계 흐름
 *  - REQ-DASH3-014: CompanyManagerSection INITIAL pre-filled (옵틱물류/이매니저)
 *  - REQ-DASH3-022: AI_APPLY fill-in 대상에서 CompanyManager 제외
 *  - REQ-DASH3-029: Column-wise Border Pulse
 *  - REQ-DASH3-043: AI_APPLY 전체 beat 구성 (옵션/자동배차/정산 중심)
 *  - REQ-DASH3-044: "골라 받을 수도, 한 번에 받을 수도" UI 힌트
 *  - REQ-DASH3-065: 한국어 카피
 *
 * Phase 1/2 backward compatibility
 *  - 기존 export 이름 `PREVIEW_MOCK_DATA` / 타입 `PreviewMockData` 유지
 *  - `aiInput.message`, `aiResult.categories[].buttons[].fieldKey/status`,
 *    `formData.pickup|delivery.{company,address,date,time}`, `formData.vehicle.{type,weight}`,
 *    `formData.cargo.{name,remark}`, `formData.estimate.{distance,amount}`,
 *    legacy tooltip 11개 key 모두 유지.
 *  - `formData.options`: Phase 1/2 `string[]` 형태에서 Phase 3 `Record<string, boolean>` 형태로 전환.
 *    Phase 1/2 legacy 코드는 `options.includes('direct')` 패턴을 사용하므로 helper `getActiveOptionKeys()` 를 함께 export.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** AI Panel 카테고리 버튼 상태 (unavailable: Phase 3 신규) */
export type AiButtonStatus = 'pending' | 'applied' | 'unavailable'

/** AI Panel 카테고리 아이콘 */
export type AiCategoryIcon = 'MapPin' | 'Flag' | 'Package' | 'Banknote'

/** AI Panel 카테고리 ID */
export type AiCategoryId = 'departure' | 'destination' | 'cargo' | 'fare'

export interface AiCategoryButton {
  readonly id: string
  readonly fieldKey: string
  readonly label: string
  readonly displayValue: string
  readonly status: AiButtonStatus
  readonly unavailableReason?: string
  readonly fallbackQuery?: string
  readonly evidenceSnippet?: string
}

export interface AiCategoryGroup {
  readonly id: AiCategoryId
  readonly label: string
  readonly icon: AiCategoryIcon
  readonly buttons: ReadonlyArray<AiCategoryButton>
}

/** AI_APPLY 옵션 토글 (TransportOptionCard 8옵션) */
export interface TransportOptions {
  readonly fast: boolean
  readonly roundTrip: boolean
  readonly direct: boolean
  readonly trace: boolean
  readonly forklift: boolean
  readonly manual: boolean
  readonly cod: boolean
  readonly special: boolean
}

export interface CompanyMock {
  readonly id: string
  readonly name: string
  /** SSOT §4-3 — 마스킹 표기 `***-**-*****` 유지 */
  readonly businessNumber: string
  readonly ceoName: string
}

export interface ManagerMock {
  readonly id: string
  readonly name: string
  /** SSOT §4-3 — 마스킹 표기 `010-****-****` 유지 */
  readonly contact: string
  readonly email: string
  readonly department: string
}

export interface LocationMock {
  readonly company: string
  readonly address: string
  readonly roadAddress: string
  readonly jibunAddress: string
  readonly detailAddress: string
  readonly latitude: number
  readonly longitude: number
  readonly contactName: string
  /** 개인정보 보호: `010-****-****` 마스킹 유지 (SSOT §4-3) */
  readonly contactPhone: string
  readonly date: string
  readonly time: string
  readonly datePresetActive?: string
}

export interface SettlementFee {
  readonly id: string
  readonly type: string
  readonly amount: number
  readonly memo: string
  readonly target: 'charge' | 'dispatch' | 'both'
}

export interface SettlementTotals {
  readonly chargeTotal: number
  readonly dispatchTotal: number
  readonly profit: number
}

export interface SettlementMock {
  readonly chargeBaseAmount: number
  readonly dispatchBaseAmount: number
  readonly additionalFees: ReadonlyArray<SettlementFee>
  readonly totals: SettlementTotals
}

export interface DialogsMock {
  readonly searchAddress: { readonly open: boolean; readonly query?: string }
  readonly companyManager: { readonly open: boolean }
  /** Phase 1에서 항상 false (REQ-DASH3-010 — Phase 1 유보) */
  readonly success: { readonly open: boolean; readonly orderId?: string }
}

export interface EstimateMock {
  readonly distance: number
  readonly duration: number
  readonly amount: number
  readonly autoDispatch: boolean
}

export interface VehicleMock {
  readonly type: string
  readonly weight: string
  readonly recentCargoSuggestions: ReadonlyArray<string>
}

export interface PreviewMockData {
  readonly aiInput: {
    readonly activeTab: 'text' | 'image'
    readonly textValue: string
    readonly imagePreviewUrl?: string
    /**
     * Phase 1/2 backward compatibility alias (= textValue).
     * preview-steps.ts 및 legacy 테스트가 참조.
     */
    readonly message: string
  }
  readonly aiResult: {
    readonly extractState: 'idle' | 'loading' | 'resultReady'
    readonly categories: ReadonlyArray<AiCategoryGroup>
    readonly warnings: ReadonlyArray<string>
    readonly evidence: Readonly<Record<string, string>>
    readonly jsonViewerOpen: boolean
  }
  readonly formData: {
    readonly company: CompanyMock
    readonly manager: ManagerMock
    readonly availableManagers: ReadonlyArray<{
      readonly id: string
      readonly name: string
      readonly department: string
    }>
    readonly pickup: LocationMock
    readonly delivery: LocationMock
    readonly vehicle: VehicleMock
    readonly cargo: {
      readonly name: string
      readonly remark: string
    }
    readonly options: TransportOptions
    readonly estimate: EstimateMock
    readonly settlement: SettlementMock
    readonly dialogs: DialogsMock
  }
  readonly tooltips: Readonly<Record<string, string>>
}

// ---------------------------------------------------------------------------
// Const data (SSOT §4-3)
// ---------------------------------------------------------------------------

/** SSOT §4-3 — 가상 화주 "옵틱물류". 실존 기업과 무관. */
const COMPANY_MOCK: CompanyMock = {
  id: 'company-optic-logis',
  name: '옵틱물류',
  businessNumber: '***-**-*****',
  ceoName: '김옵틱',
} as const

/** SSOT §4-3 — 담당자 이매니저. 연락처/이메일 마스킹/가상 도메인. */
const MANAGER_MOCK: ManagerMock = {
  id: 'manager-lee',
  name: '이매니저',
  contact: '010-****-****',
  email: 'example@optics.com',
  department: '물류운영팀',
} as const

/** 담당자 선택 드롭다운 mock (companyManager 다이얼로그 오픈 시 노출 용도) */
const AVAILABLE_MANAGERS_MOCK: ReadonlyArray<{
  readonly id: string
  readonly name: string
  readonly department: string
}> = [
  { id: 'manager-lee', name: '이매니저', department: '물류운영팀' },
  { id: 'manager-park', name: '박담당', department: '물류운영팀' },
  { id: 'manager-choi', name: '최운영', department: '운송지원팀' },
] as const

const PICKUP_MOCK: LocationMock = {
  company: '아이다스로지스',
  address: '서울특별시 강남구 삼성로 512',
  roadAddress: '서울특별시 강남구 삼성로 512',
  jibunAddress: '서울특별시 강남구 삼성동 159-8',
  detailAddress: '지하 1층 하역장',
  latitude: 37.5091,
  longitude: 127.0625,
  contactName: '김과장',
  contactPhone: '010-****-****',
  date: '2026-04-18',
  time: '09:00',
  datePresetActive: '내일',
} as const

const DELIVERY_MOCK: LocationMock = {
  company: '부산물류허브',
  address: '부산광역시 강서구 녹산산업중로 333',
  roadAddress: '부산광역시 강서구 녹산산업중로 333',
  jibunAddress: '부산광역시 강서구 송정동 1565',
  detailAddress: 'A동 5번 도크',
  latitude: 35.0981,
  longitude: 128.8501,
  contactName: '이차장',
  contactPhone: '010-****-****',
  date: '2026-04-18',
  time: '15:00',
  datePresetActive: '내일',
} as const

const VEHICLE_MOCK: VehicleMock = {
  type: '카고',
  weight: '5톤',
  recentCargoSuggestions: ['전자제품', '공산품', '가구'],
} as const

const CARGO_MOCK = {
  name: '전자제품',
  remark: '파손 주의',
} as const

/** AI_APPLY 예시 — direct + forklift = true (SSOT §4-3 후속, decision-log AI_APPLY beat) */
const OPTIONS_MOCK: TransportOptions = {
  fast: false,
  roundTrip: false,
  direct: true,
  trace: false,
  forklift: true,
  manual: false,
  cod: false,
  special: false,
} as const

const ESTIMATE_MOCK: EstimateMock = {
  distance: 360,
  duration: 300,
  amount: 850000,
  autoDispatch: true,
} as const

const SETTLEMENT_MOCK: SettlementMock = {
  chargeBaseAmount: 850000,
  dispatchBaseAmount: 750000,
  additionalFees: [
    { id: 'fee-toll', type: '고속료', amount: 30000, memo: '경부/남해선', target: 'both' },
  ],
  totals: {
    chargeTotal: 880000,
    dispatchTotal: 780000,
    profit: 100000,
  },
} as const

const DIALOGS_MOCK: DialogsMock = {
  searchAddress: { open: false },
  companyManager: { open: false },
  // Phase 1 유보 — 항상 false 고정
  success: { open: false },
} as const

/** Phase 1/2 하위 호환용 AI 입력 문장. */
const AI_INPUT_MESSAGE =
  '서울 강남구 물류센터에서 대전 유성구 산업단지로 5톤 카고 파레트 공산품 3파레트 보내주세요. 내일 오전 9시 상차, 직송 지게차 필요합니다.'

// ---------------------------------------------------------------------------
// AI categories (Phase 1/2 shape + Phase 3 확장 필드)
// ---------------------------------------------------------------------------

const AI_CATEGORIES: ReadonlyArray<AiCategoryGroup> = [
  {
    id: 'departure',
    label: '상차지',
    icon: 'MapPin',
    buttons: [
      {
        id: 'btn-departure-address1',
        fieldKey: 'departure-address1',
        label: '주소',
        displayValue: '서울 강남구 물류센터',
        status: 'pending',
        evidenceSnippet: '서울 강남구 물류센터',
      },
      {
        id: 'btn-departure-datetime',
        fieldKey: 'departure-datetime',
        label: '상차일시',
        displayValue: '내일 09:00',
        status: 'pending',
        evidenceSnippet: '내일 오전 9시 상차',
      },
    ],
  },
  {
    id: 'destination',
    label: '하차지',
    icon: 'Flag',
    buttons: [
      {
        id: 'btn-destination-address1',
        fieldKey: 'destination-address1',
        label: '주소',
        displayValue: '대전 유성구 산업단지',
        status: 'pending',
        evidenceSnippet: '대전 유성구 산업단지',
      },
    ],
  },
  {
    id: 'cargo',
    label: '화물/차량',
    icon: 'Package',
    buttons: [
      {
        id: 'btn-cargo-vehicleType',
        fieldKey: 'cargo-vehicleType',
        label: '차량종류',
        displayValue: '카고 5톤',
        status: 'pending',
        evidenceSnippet: '5톤 카고',
      },
      {
        id: 'btn-cargo-cargoName',
        fieldKey: 'cargo-cargoName',
        label: '화물명',
        displayValue: '파레트 적재 공산품 3파레트',
        status: 'pending',
        evidenceSnippet: '파레트 공산품 3파레트',
      },
    ],
  },
  {
    id: 'fare',
    label: '운임',
    icon: 'Banknote',
    buttons: [
      {
        id: 'btn-fare-amount',
        fieldKey: 'fare-amount',
        label: '운임',
        displayValue: '420,000원',
        status: 'pending',
        evidenceSnippet: '예상 운임 42만원',
      },
    ],
  },
] as const

// ---------------------------------------------------------------------------
// Tooltips — Phase 1/2 legacy 11개 + Phase 3 15개 (히트 영역 18 대응, F5 T-CLEANUP-01 반영)
// ---------------------------------------------------------------------------

const TOOLTIPS: Readonly<Record<string, string>> = {
  // ----- Phase 1/2 legacy (hit-areas.ts 의존성 보존) -----
  'ai-input': '카카오톡 메시지를 붙여넣으면 AI가 자동으로 분석합니다',
  'extract-button': '클릭 한 번으로 메시지에서 운송 정보를 추출합니다',
  'result-departure': 'AI가 추출한 상차지 정보를 폼에 자동 적용합니다',
  'result-destination': 'AI가 추출한 하차지 정보를 폼에 자동 적용합니다',
  'result-cargo': '차량 종류와 화물 정보를 자동으로 입력합니다',
  'result-fare': '예상 운임을 자동 계산하여 반영합니다',
  'cargo-info': '차량 타입, 중량, 화물 종류를 한 화면에서 관리합니다',
  'location-departure': '상차지 주소, 담당자, 연락처를 입력합니다',
  'location-destination': '하차지 주소, 담당자, 연락처를 입력합니다',
  'transport-options': '직송, 지게차 등 운송 옵션을 선택합니다',
  'estimate-info': '거리와 예상 운임이 자동 계산됩니다',

  // ----- Phase 3 신규 (히트 영역 15개, F5 T-CLEANUP-01 로 ai-json-viewer 제거) -----
  'ai-tab-bar': '텍스트와 이미지 입력을 전환합니다',
  'ai-extract-button': '메시지 분석을 시작해 운송 정보를 추출합니다',
  'ai-result-buttons': '추출 결과를 골라서 폼에 적용합니다',
  'ai-warning-badges': '누락되거나 불확실한 항목을 알려줍니다',
  'company-manager': '로그인 시 선택된 회사와 담당자 정보입니다',
  'pickup-location': '상차지 주소와 현장 담당자를 관리합니다',
  'delivery-location': '하차지 주소와 현장 담당자를 관리합니다',
  'pickup-datetime': '상차 일자와 시간을 지정합니다',
  'delivery-datetime': '하차 일자와 시간을 지정합니다',
  settlement: '청구·지급 금액과 추가 요금을 관리합니다',
  'auto-dispatch': '자동 배차 대기 중 — 배차요청 자동 승인되어 배차대기상태로 전환합니다',
} as const

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export type PreviewScenarioId = 'default' | 'partial' | 'mismatch-risk'

export interface PreviewExtractedFrame {
  readonly aiInput: PreviewMockData['aiInput']
  readonly aiResult: PreviewMockData['aiResult']
}

export interface PreviewAppliedFrame {
  readonly formData: PreviewMockData['formData']
}

export interface PreviewMockScenario {
  readonly id: PreviewScenarioId
  readonly label: string
  readonly description: string
  readonly extractedFrame: PreviewExtractedFrame
  readonly appliedFrame: PreviewAppliedFrame
}

export const DEFAULT_PREVIEW_SCENARIO_ID: PreviewScenarioId = 'default'

const DEFAULT_AI_INPUT: PreviewMockData['aiInput'] = {
  activeTab: 'text',
  textValue: AI_INPUT_MESSAGE,
  message: AI_INPUT_MESSAGE,
} as const

const DEFAULT_FORM_DATA: PreviewMockData['formData'] = {
  company: COMPANY_MOCK,
  manager: MANAGER_MOCK,
  availableManagers: AVAILABLE_MANAGERS_MOCK,
  pickup: PICKUP_MOCK,
  delivery: DELIVERY_MOCK,
  vehicle: VEHICLE_MOCK,
  cargo: CARGO_MOCK,
  options: OPTIONS_MOCK,
  estimate: ESTIMATE_MOCK,
  settlement: SETTLEMENT_MOCK,
  dialogs: DIALOGS_MOCK,
} as const

function replaceFareAmount(
  categories: ReadonlyArray<AiCategoryGroup>,
  displayValue: string,
  evidenceSnippet: string,
): ReadonlyArray<AiCategoryGroup> {
  return categories.map((category) => {
    if (category.id !== 'fare') return category

    return {
      ...category,
      buttons: category.buttons.map((button) =>
        button.fieldKey === 'fare-amount'
          ? {
              ...button,
              displayValue,
              evidenceSnippet,
            }
          : button,
      ),
    }
  })
}

function buildAiResult(
  categories: ReadonlyArray<AiCategoryGroup>,
  fareEvidence: string,
  warnings: ReadonlyArray<string> = [],
): PreviewMockData['aiResult'] {
  return {
    extractState: 'idle',
    categories,
    warnings,
    evidence: {
      'departure-address1': '서울 강남구 물류센터',
      'destination-address1': '대전 유성구 산업단지',
      'cargo-vehicleType': '5톤 카고',
      'cargo-cargoName': '파레트 공산품 3파레트',
      'fare-amount': fareEvidence,
    },
    jsonViewerOpen: false,
  } as const
}

const DEFAULT_AI_CATEGORIES = replaceFareAmount(
  AI_CATEGORIES,
  '850,000원',
  '예상 운임 85만원',
)

const PARTIAL_AI_CATEGORIES: ReadonlyArray<AiCategoryGroup> = DEFAULT_AI_CATEGORIES.map(
  (category) => {
    if (category.id !== 'cargo') return category

    return {
      ...category,
      buttons: category.buttons.map((button) =>
        button.fieldKey === 'cargo-cargoName'
          ? {
              ...button,
              status: 'unavailable',
              unavailableReason: '품목 수량 확인 필요',
              fallbackQuery: '품목 수량 확인',
            }
          : button,
      ),
    }
  },
)

export const PREVIEW_MOCK_SCENARIOS: ReadonlyArray<PreviewMockScenario> = [
  {
    id: 'default',
    label: 'Default',
    description: 'Default preview fixture with consistent extracted and applied fare.',
    extractedFrame: {
      aiInput: DEFAULT_AI_INPUT,
      aiResult: buildAiResult(DEFAULT_AI_CATEGORIES, '예상 운임 85만원'),
    },
    appliedFrame: {
      formData: DEFAULT_FORM_DATA,
    },
  },
  {
    id: 'partial',
    label: 'Partial',
    description: 'Partial extraction fixture with one cargo field requiring confirmation.',
    extractedFrame: {
      aiInput: DEFAULT_AI_INPUT,
      aiResult: buildAiResult(PARTIAL_AI_CATEGORIES, '예상 운임 85만원', [
        '품목 수량 확인 필요',
      ]),
    },
    appliedFrame: {
      formData: DEFAULT_FORM_DATA,
    },
  },
  {
    id: 'mismatch-risk',
    label: 'Mismatch Risk',
    description: 'Test fixture for extracted fare and applied estimate mismatch.',
    extractedFrame: {
      aiInput: DEFAULT_AI_INPUT,
      aiResult: buildAiResult(AI_CATEGORIES, '예상 운임 42만원', [
        '추출 운임과 적용 견적이 다를 수 있음',
      ]),
    },
    appliedFrame: {
      formData: DEFAULT_FORM_DATA,
    },
  },
] as const

export function selectPreviewMockScenario(
  scenarioId: PreviewScenarioId | string = DEFAULT_PREVIEW_SCENARIO_ID,
): PreviewMockScenario {
  return (
    PREVIEW_MOCK_SCENARIOS.find((scenario) => scenario.id === scenarioId) ??
    getDefaultPreviewMockScenario()
  )
}

export function getDefaultPreviewMockScenario(): PreviewMockScenario {
  return PREVIEW_MOCK_SCENARIOS[0]!
}

export function createPreviewMockData(
  scenario: PreviewMockScenario = getDefaultPreviewMockScenario(),
): PreviewMockData {
  return {
    aiInput: scenario.extractedFrame.aiInput,
    aiResult: scenario.extractedFrame.aiResult,
    formData: scenario.appliedFrame.formData,
    tooltips: TOOLTIPS,
  } as const
}

export const PREVIEW_MOCK_DATA: PreviewMockData = createPreviewMockData()

// ---------------------------------------------------------------------------
// Phase 1/2 backward compatibility helpers
// ---------------------------------------------------------------------------

/**
 * Phase 1/2 legacy 코드가 사용하던 `options: string[]` 배열 형태로 변환한다.
 * 활성화된 옵션 키 목록 (true 인 항목만).
 *
 * 사용 예 (legacy form-preview.tsx):
 *   getActiveOptionKeys(PREVIEW_MOCK_DATA.formData.options).includes('direct') // true
 */
export function getActiveOptionKeys(
  options: TransportOptions = PREVIEW_MOCK_DATA.formData.options,
): ReadonlyArray<keyof TransportOptions> {
  return (Object.keys(options) as Array<keyof TransportOptions>).filter((k) => options[k])
}
