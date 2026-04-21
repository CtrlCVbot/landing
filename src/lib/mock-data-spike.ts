/**
 * @spike T-DASH3-SPIKE-01 — 종료 시 이관 or 폐기
 *
 * Spike 전용 최소 mock 데이터.
 *
 * SSOT: `.plans/features/active/dash-preview-phase3/sources/wireframes/decision-log.md §4-3`
 * - 회사: 옵틱물류 (사업자등록번호 마스킹, 대표 김옵틱)
 * - 담당자: 이매니저 / 010-****-**** / example@optics.com / 물류운영팀
 * - AI 입력: 한 줄 예시 메시지
 * - Estimate: 거리 360km, 소요 5h, 운임 850,000원
 *
 * 실제 PREVIEW_MOCK_DATA(`mock-data.ts`)와는 독립. Spike 기간 한정 사용.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CompanyData {
  readonly name: string
  readonly businessNumber: string
  readonly ceoName: string
}

export interface ManagerData {
  readonly name: string
  readonly contact: string
  readonly email: string
  readonly department: string
}

export interface AiInputData {
  readonly message: string
}

export interface EstimateData {
  /** 거리 (km) */
  readonly distance: number
  /** 예상 소요 시간 (hour) */
  readonly duration: number
  /** 운임 (원) */
  readonly amount: number
}

export interface SpikeMockData {
  readonly company: CompanyData
  readonly manager: ManagerData
  readonly aiInput: AiInputData
  readonly estimate: EstimateData
}

// ---------------------------------------------------------------------------
// Data (SSOT: decision-log.md §4-3)
// ---------------------------------------------------------------------------

export const SPIKE_MOCK_DATA: SpikeMockData = {
  company: {
    name: '옵틱물류',
    businessNumber: '***-**-*****',
    ceoName: '김옵틱',
  },
  manager: {
    name: '이매니저',
    contact: '010-****-****',
    email: 'example@optics.com',
    department: '물류운영팀',
  },
  aiInput: {
    message:
      '내일 오전 서울 강남에서 부산까지 5톤 화물 보내주세요',
  },
  estimate: {
    distance: 360,
    duration: 5,
    amount: 850_000,
  },
}
