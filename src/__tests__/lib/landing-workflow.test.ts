import { describe, expect, it } from 'vitest'

import { WORKFLOW_STEP_IDS, WORKFLOW_STEPS } from '@/lib/landing-workflow'

const customerFacingWorkflowCopy = JSON.stringify(WORKFLOW_STEPS)

describe('F3 landing workflow data', () => {
  it('keeps the six workflow steps in the approved order', () => {
    expect(WORKFLOW_STEPS).toHaveLength(6)
    expect(WORKFLOW_STEPS.map((step) => step.id)).toEqual(WORKFLOW_STEP_IDS)
    expect(WORKFLOW_STEPS.map((step) => step.order)).toEqual([
      1, 2, 3, 4, 5, 6,
    ])
  })

  it('keeps Hwamulman between dispatch and settlement', () => {
    expect(WORKFLOW_STEPS[2]).toMatchObject({
      id: 'dispatch-status',
      title: '배차/운송 상태',
    })
    expect(WORKFLOW_STEPS[3]).toMatchObject({
      id: 'hwamulman',
      order: 4,
      title: '화물맨 연동',
    })
    expect(WORKFLOW_STEPS[4]).toMatchObject({
      id: 'settlement',
      title: '정산 자동화',
    })
    expect(WORKFLOW_STEPS[5]).toMatchObject({
      id: 'invoice',
      title: '세금계산서 관리',
    })
  })

  it('gives every step customization copy without overclaiming implementation scope', () => {
    for (const step of WORKFLOW_STEPS) {
      expect(step.customization.length).toBeGreaterThan(0)
    }

    expect(customerFacingWorkflowCopy).not.toContain('설정 저장')
    expect(customerFacingWorkflowCopy).not.toContain('실시간 API')
    expect(customerFacingWorkflowCopy).not.toContain('자동 연동 완료')
    expect(customerFacingWorkflowCopy).not.toContain('자동 발행 완료')
    expect(customerFacingWorkflowCopy).not.toContain('성공 보장')
  })
})
