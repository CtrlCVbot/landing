/**
 * OrderFormContainer — 우측 3-column grid shell.
 *
 * T-DASH3-M1-03 — shell 만 작성. 자식 컴포넌트 주입은 M3 에서 수행.
 *
 * 레이아웃 (REQ-DASH3-053)
 *  - `flex-1` + `grid grid-cols-1 lg:grid-cols-3 gap-4`
 *  - `p-4` padding + `overflow-auto`
 *  - landing 팔레트 `bg-gradient-to-br from-gray-900/50 to-gray-950/50`
 *
 * 컬럼 구성 (M3 에서 주입 예정)
 *  - Col 1: CompanyManagerSection (pre-filled) + LocationForm(pickup) + LocationForm(delivery)
 *  - Col 2: (예상거리 Info) + DateTimeCard(pickup) + DateTimeCard(delivery) + CargoInfoForm
 *  - Col 3: TransportOptionCard + EstimateInfoCard + SettlementSection
 *
 * 접근성 (REQ-DASH-007)
 *  - `aria-label="주문 등록 폼"` 으로 landmark 명시.
 */

'use client'

import type { PreviewMockData } from '@/lib/mock-data'
import type { PreviewStep } from '@/lib/preview-steps'

export interface OrderFormContainerProps {
  readonly step: PreviewStep
  readonly formData: PreviewMockData['formData']
}

export function OrderFormContainer(_props: OrderFormContainerProps) {
  return (
    <div
      aria-label="주문 등록 폼"
      data-testid="order-form-grid"
      className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-gradient-to-br from-gray-900/50 to-gray-950/50 overflow-auto"
    >
      <div
        data-col="1"
        data-testid="col-1"
        className="lg:col-span-1 space-y-4"
      >
        {/* M3: CompanyManagerSection + LocationForm(pickup) + LocationForm(delivery) */}
      </div>
      <div
        data-col="2"
        data-testid="col-2"
        className="lg:col-span-1 space-y-4"
      >
        {/* M3: (예상거리 Info) + DateTimeCard(pickup) + DateTimeCard(delivery) + CargoInfoForm */}
      </div>
      <div
        data-col="3"
        data-testid="col-3"
        className="lg:col-span-1 space-y-4"
      >
        {/* M3: TransportOptionCard + EstimateInfoCard + SettlementSection */}
      </div>
    </div>
  )
}
