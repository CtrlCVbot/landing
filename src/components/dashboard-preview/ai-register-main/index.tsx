/**
 * AiRegisterMain — dash-preview-phase3 메인 컨테이너 shell.
 *
 * T-DASH3-M1-03 — shell 만 작성. 실제 자식 컴포넌트 주입은 M2 (AiPanel) + M3 (OrderForm) 에서 수행.
 *
 * 레이아웃 (REQ-DASH3-001, 050, 053)
 *  - 2-col flex: `AiPanel 380px 고정 + OrderForm flex-1`
 *  - `h-full min-h-[480px]` 로 외곽 chrome 과 공존.
 *
 * Step 4단계 (INITIAL → AI_INPUT → AI_EXTRACT → AI_APPLY) 의 자동 재생은
 * 상위 `dashboard-preview.tsx` (M1-04 에서 연결) 에서 전달한다.
 *
 * SSOT
 *  - Phase 1 스펙 §7 / PRD §6-1
 */

'use client'

import type { PreviewMockData } from '@/lib/mock-data'
import type { PreviewStep } from '@/lib/preview-steps'

import { AiPanelContainer } from './ai-panel'
import { OrderFormContainer } from './order-form'

export interface AiRegisterMainProps {
  readonly step: PreviewStep
  readonly mockData: PreviewMockData
}

export function AiRegisterMain({ step, mockData }: AiRegisterMainProps) {
  return (
    <div className="flex h-full min-h-[480px]">
      <AiPanelContainer
        step={step}
        aiInput={mockData.aiInput}
        aiResult={mockData.aiResult}
      />
      <OrderFormContainer step={step} formData={mockData.formData} />
    </div>
  )
}

export default AiRegisterMain
