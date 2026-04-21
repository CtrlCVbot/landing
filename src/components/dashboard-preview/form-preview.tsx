'use client'

import { type FormState } from '@/lib/preview-steps'
import { PREVIEW_MOCK_DATA } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { useAnimatedNumber } from './use-animated-number'

interface FormPreviewProps {
  readonly formState: FormState
  readonly className?: string
}

const CARD_BASE = 'rounded-lg border border-gray-800 bg-gray-900/30 p-3'
const LABEL_STYLE = 'text-xs font-medium text-gray-400 mb-2'
const FIELD_LABEL_STYLE = 'text-[10px] text-gray-500'
const FIELD_VALUE_STYLE = 'text-xs text-white'
const PLACEHOLDER_STYLE = 'border border-dashed border-gray-700 rounded px-2 py-1 text-xs text-gray-600'

const TRANSPORT_OPTIONS = [
  { key: 'direct', label: '직송' },
  { key: 'forklift', label: '지게차' },
  { key: 'roundtrip', label: '왕복' },
  { key: 'urgent', label: '긴급' },
] as const

function isCardHighlighted(highlightedCard: string | null, cardId: string): boolean {
  return highlightedCard === cardId
}

function formatAmount(amount: number): string {
  return amount.toLocaleString('ko-KR')
}

export function FormPreview({ formState, className }: FormPreviewProps) {
  const { filledCards, highlightedCard, estimateAmount } = formState
  const { formData } = PREVIEW_MOCK_DATA

  const isCargoFilled = filledCards.includes('cargoInfo')
  const isDepartureFilled = filledCards.includes('location-departure')
  const isDestinationFilled = filledCards.includes('location-destination')
  const isEstimateFilled = estimateAmount !== null

  // 운임 금액 카운팅 애니메이션 (REQ-DASH-009)
  const animatedAmount = useAnimatedNumber({ target: estimateAmount })

  return (
    <div
      data-testid="form-preview"
      className={cn('flex-1 overflow-y-auto p-4 space-y-3', className)}
    >
      {/* CargoInfo Card */}
      <div
        data-testid="card-cargoInfo"
        className={cn(
          CARD_BASE,
          isCardHighlighted(highlightedCard, 'cargoInfo') && 'ring-1 ring-purple-500/50',
        )}
      >
        <div className={LABEL_STYLE}>차량 정보</div>
        <div className="space-y-1.5">
          <div>
            <div className={FIELD_LABEL_STYLE}>차량타입</div>
            {isCargoFilled ? (
              <div className={FIELD_VALUE_STYLE}>{formData.vehicle.type}</div>
            ) : (
              <div data-testid="field-placeholder" className={PLACEHOLDER_STYLE}>--</div>
            )}
          </div>
          <div>
            <div className={FIELD_LABEL_STYLE}>중량</div>
            {isCargoFilled ? (
              <div className={FIELD_VALUE_STYLE}>{formData.vehicle.weight}</div>
            ) : (
              <div data-testid="field-placeholder" className={PLACEHOLDER_STYLE}>--</div>
            )}
          </div>
          <div>
            <div className={FIELD_LABEL_STYLE}>화물명</div>
            {isCargoFilled ? (
              <div className={FIELD_VALUE_STYLE}>{formData.cargo.name}</div>
            ) : (
              <div data-testid="field-placeholder" className={PLACEHOLDER_STYLE}>--</div>
            )}
          </div>
        </div>
      </div>

      {/* Location Departure Card */}
      <div
        data-testid="card-location-departure"
        className={cn(
          CARD_BASE,
          isCardHighlighted(highlightedCard, 'location-departure') && 'ring-1 ring-purple-500/50',
        )}
      >
        <div className={LABEL_STYLE}>상차지</div>
        <div className="space-y-1.5">
          <div>
            <div className={FIELD_LABEL_STYLE}>주소</div>
            {isDepartureFilled ? (
              <div className={FIELD_VALUE_STYLE}>{formData.pickup.company}</div>
            ) : (
              <div data-testid="field-placeholder" className={PLACEHOLDER_STYLE}>--</div>
            )}
          </div>
          <div>
            <div className={FIELD_LABEL_STYLE}>담당자</div>
            {isDepartureFilled ? (
              <div className={FIELD_VALUE_STYLE}>--</div>
            ) : (
              <div data-testid="field-placeholder" className={PLACEHOLDER_STYLE}>--</div>
            )}
          </div>
          <div>
            <div className={FIELD_LABEL_STYLE}>연락처</div>
            {isDepartureFilled ? (
              <div className={FIELD_VALUE_STYLE}>--</div>
            ) : (
              <div data-testid="field-placeholder" className={PLACEHOLDER_STYLE}>--</div>
            )}
          </div>
          <div>
            <div className={FIELD_LABEL_STYLE}>일시</div>
            {isDepartureFilled ? (
              <div className={FIELD_VALUE_STYLE}>{formData.pickup.date} {formData.pickup.time}</div>
            ) : (
              <div data-testid="field-placeholder" className={PLACEHOLDER_STYLE}>--</div>
            )}
          </div>
        </div>
      </div>

      {/* Location Destination Card */}
      <div
        data-testid="card-location-destination"
        className={cn(
          CARD_BASE,
          isCardHighlighted(highlightedCard, 'location-destination') && 'ring-1 ring-purple-500/50',
        )}
      >
        <div className={LABEL_STYLE}>하차지</div>
        <div className="space-y-1.5">
          <div>
            <div className={FIELD_LABEL_STYLE}>주소</div>
            {isDestinationFilled ? (
              <div className={FIELD_VALUE_STYLE}>{formData.delivery.company}</div>
            ) : (
              <div data-testid="field-placeholder" className={PLACEHOLDER_STYLE}>--</div>
            )}
          </div>
          <div>
            <div className={FIELD_LABEL_STYLE}>담당자</div>
            {isDestinationFilled ? (
              <div className={FIELD_VALUE_STYLE}>--</div>
            ) : (
              <div data-testid="field-placeholder" className={PLACEHOLDER_STYLE}>--</div>
            )}
          </div>
          <div>
            <div className={FIELD_LABEL_STYLE}>연락처</div>
            {isDestinationFilled ? (
              <div className={FIELD_VALUE_STYLE}>--</div>
            ) : (
              <div data-testid="field-placeholder" className={PLACEHOLDER_STYLE}>--</div>
            )}
          </div>
          <div>
            <div className={FIELD_LABEL_STYLE}>일시</div>
            {isDestinationFilled ? (
              <div className={FIELD_VALUE_STYLE}>{formData.delivery.date} {formData.delivery.time}</div>
            ) : (
              <div data-testid="field-placeholder" className={PLACEHOLDER_STYLE}>--</div>
            )}
          </div>
        </div>
      </div>

      {/* Transport Options Card */}
      <div
        data-testid="card-transportOptions"
        className={cn(
          CARD_BASE,
          isCardHighlighted(highlightedCard, 'transportOptions') && 'ring-1 ring-purple-500/50',
        )}
      >
        <div className={LABEL_STYLE}>운송 옵션</div>
        <div className="flex flex-wrap gap-1.5">
          {TRANSPORT_OPTIONS.map(({ key, label }) => (
            <span
              key={key}
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px]',
                // Phase 3: formData.options 는 Record<string, boolean>.
                // legacy TRANSPORT_OPTIONS 키는 'direct' | 'forklift' | 'roundtrip' | 'urgent' 인데
                // Phase 3 스키마에는 'direct' / 'forklift' 만 매칭된다 (roundtrip/urgent는 Phase 1/2 전용).
                (formData.options as unknown as Record<string, boolean | undefined>)[key] === true
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-gray-800 text-gray-500',
              )}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Estimate Card */}
      <div
        data-testid="card-estimate"
        className={cn(
          CARD_BASE,
          isCardHighlighted(highlightedCard, 'estimate') && 'ring-1 ring-purple-500/50',
        )}
      >
        <div className={LABEL_STYLE}>예상 정보</div>
        <div className="space-y-1.5">
          <div>
            <div className={FIELD_LABEL_STYLE}>거리</div>
            <div className={FIELD_VALUE_STYLE}>
              {isEstimateFilled ? `${formData.estimate.distance}km` : '--km'}
            </div>
          </div>
          <div>
            <div className={FIELD_LABEL_STYLE}>금액</div>
            <div className={FIELD_VALUE_STYLE} data-testid="estimate-amount">
              {isEstimateFilled ? `${formatAmount(animatedAmount)}원` : '--원'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
