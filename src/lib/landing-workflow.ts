export const WORKFLOW_STEP_IDS = [
  'ai-order',
  'locations',
  'dispatch-status',
  'hwamulman',
  'settlement',
  'invoice',
] as const

export type WorkflowStepId = (typeof WORKFLOW_STEP_IDS)[number]

export type WorkflowStep = {
  readonly id: WorkflowStepId
  readonly order: number
  readonly title: string
  readonly description: string
  readonly customization: readonly string[]
  readonly handoff: string
  readonly statusLabel: string
}

export const WORKFLOW_STEPS = [
  {
    id: 'ai-order',
    order: 1,
    title: 'AI 오더 등록',
    description: '여러 형식의 운송 요청을 오더 정보로 정리합니다.',
    customization: ['화주별 요청 양식', '필수 입력값'],
    handoff: '요청서와 메신저 내용을 운송 오더 기준으로 맞춥니다.',
    statusLabel: '요청 정리',
  },
  {
    id: 'locations',
    order: 2,
    title: '상하차지 관리',
    description: '장소, 담당자, 현장 메모를 반복 입력 없이 재사용합니다.',
    customization: ['장소명', '담당자', '현장 메모'],
    handoff: '자주 쓰는 상하차지 정보를 다음 배차 흐름으로 넘깁니다.',
    statusLabel: '장소 정리',
  },
  {
    id: 'dispatch-status',
    order: 3,
    title: '배차/운송 상태',
    description: '배차 진행과 운송 상태를 한 흐름에서 확인합니다.',
    customization: ['상태명', '승인 흐름'],
    handoff: '주선사별 배차 방식에 맞춰 진행 단계를 정리합니다.',
    statusLabel: '배차 확인',
  },
  {
    id: 'hwamulman',
    order: 4,
    title: '화물맨 연동',
    description: '배차 단계에서 운송 정보를 외부 채널로 이어 보냅니다.',
    customization: ['전송 시점', '전송 필드'],
    handoff: '한 번 정리한 운송 정보를 배차 채널에 맞춰 이어 보냅니다.',
    statusLabel: '외부 채널 연결',
  },
  {
    id: 'settlement',
    order: 5,
    title: '정산 자동화',
    description: '운송 완료 후 매출 정산 기준을 묶어 관리합니다.',
    customization: ['청구 기준', '정산 기준'],
    handoff: '화주별 청구 기준과 주선사별 정산 기준을 한 흐름 안에 둡니다.',
    statusLabel: '정산 기준',
  },
  {
    id: 'invoice',
    order: 6,
    title: '세금계산서 관리',
    description: '정산 이후 증빙 상태까지 이어서 확인합니다.',
    customization: ['발행 상태', '담당자 확인'],
    handoff: '정산 이후 증빙 확인까지 놓치지 않게 이어갑니다.',
    statusLabel: '증빙 확인',
  },
] as const satisfies readonly WorkflowStep[]
