/**
 * TransportOptionCard — Col 3 상단 운송 옵션 카드 (8 옵션 체크박스-like 토글).
 *
 * T-DASH3-M3-07 — 원본 `transport-option-card.tsx` (mm-broker) + `option-selector.tsx` 의
 * Checkbox/shadcn 연동 제거, landing Phase 3 demo 용으로 stateless 시각 복제.
 *
 * 정책 (Phase 3 스펙 §2-1 Dumb Components 원칙)
 *  - 상위(`OrderFormContainer`) 에서 주입한 `options` (8 bool 필드) 를 그대로 표시.
 *  - 체크 표시는 SVG `<polyline>` (3,8 → 7,12 → 13,4) 로 그린다. 체크 완성 시 dashoffset=0.
 *  - `options[key]=true` 이고 `strokeTargets` 에 포함되지 않은 옵션 → 정적 체크 (dashoffset=0, no anim).
 *  - `options[key]=true` 이고 `strokeTargets` 에 포함된 옵션 →
 *    - strokeTriggerAt=null : 대기 상태 (dashoffset=20, 체크 미완성).
 *    - strokeTriggerAt>=0   : mount 후 triggerAt(ms) 경과 시 dashoffset 20 → 0 애니 (200ms ease-out).
 *  - `options[key]=false` 옵션 → dashoffset=20 고정 (체크 없음).
 *
 * 스타일 (REQ-DASH-005 landing 팔레트, F1 T-THEME-08 토큰 전환 완료)
 *  - 카드: `bg-card/50 border border-border rounded-xl p-4 space-y-3`.
 *  - polyline 체크: `stroke-accent` (옵션 on), `stroke-muted-foreground` (옵션 off).
 *  - dashoffset 트랜지션: `200ms ease-out`.
 *  - grid 2xN: `grid grid-cols-2 gap-2`.
 *
 * 접근성 (REQ-DASH-007)
 *  - `role="group" aria-label="운송 옵션"` landmark.
 *  - SVG 는 `aria-hidden="true"`.
 *
 * @see REQ-DASH3-004 (OrderForm 컴포넌트 복제 매니페스트 — TransportOptionCard)
 * @see REQ-DASH3-028 (#9 stroke 애니)
 * @see REQ-DASH3-011 (options 8 bool 필드)
 * @see REQ-DASH-005  (landing 팔레트)
 * @see REQ-DASH-007  (접근성)
 * @see TC-DASH3-UNIT-TRANSOPT
 * @see TC-DASH3-UNIT-STROKE
 */

'use client'

import { Settings2 } from 'lucide-react'

import { useTriggerAt } from '@/components/dashboard-preview/interactions/use-trigger-at'
import type { TransportOptions } from '@/lib/mock-data'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TransportOptionKey = keyof TransportOptions

export interface TransportOptionCardProps {
  readonly options: TransportOptions
  /**
   * #9 stroke 애니 대상 키 배열. 여기 포함된 옵션만 AI_APPLY beat 에서 stroke-dashoffset 애니.
   * 미지정 → 모든 옵션 정적 체크.
   */
  readonly strokeTargets?: ReadonlyArray<TransportOptionKey>
  /**
   * 애니 시작 시각 (mount 후 offset ms).
   * null 이면 strokeTargets 에 포함된 옵션은 대기 상태 (dashoffset=20 유지).
   */
  readonly strokeTriggerAt?: number | null
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CARD_CLASSES =
  'bg-card/50 border border-border rounded-xl p-4 space-y-3 backdrop-blur-sm'

const OPTION_LABELS: ReadonlyArray<{ key: TransportOptionKey; label: string }> = [
  { key: 'fast', label: '급송' },
  { key: 'roundTrip', label: '왕복' },
  { key: 'direct', label: '직행' },
  { key: 'trace', label: '이력' },
  { key: 'forklift', label: '지게차' },
  { key: 'manual', label: '수작업' },
  { key: 'cod', label: '착불' },
  { key: 'special', label: '특수' },
]

const STROKE_DASH_TOTAL = 20

// ---------------------------------------------------------------------------
// Sub-component — OptionItem
// ---------------------------------------------------------------------------

interface OptionItemProps {
  readonly optionKey: TransportOptionKey
  readonly label: string
  readonly checked: boolean
  readonly animating: boolean
  readonly dashOffset: number
}

function OptionItem({
  optionKey,
  label,
  checked,
  animating,
  dashOffset,
}: OptionItemProps) {
  const strokeClassName = checked ? 'stroke-accent' : 'stroke-muted-foreground'

  return (
    <div
      data-testid={`transport-option-${optionKey}`}
      data-checked={checked}
      className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-card/50 border border-border"
    >
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className="shrink-0"
      >
        <polyline
          points="3,8 7,12 13,4"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={strokeClassName}
          data-animating={animating}
          strokeDasharray={STROKE_DASH_TOTAL}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke-dashoffset 200ms ease-out',
          }}
        />
      </svg>
      <span className="text-xs text-foreground">{label}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function TransportOptionCard({
  options,
  strokeTargets,
  strokeTriggerAt,
}: TransportOptionCardProps) {
  // M3-review#2 — useStrokeTriggered 삭제 후 공통 useTriggerAt 로 교체.
  // strokeTriggerAt 이 null/undefined/음수이면 hook 이 false 를 유지하므로 active: true 고정.
  const triggered = useTriggerAt({ active: true, triggerAt: strokeTriggerAt })

  return (
    <section
      role="group"
      aria-label="운송 옵션"
      data-testid="transport-option-card"
      className={CARD_CLASSES}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Settings2
          aria-hidden="true"
          data-icon="options"
          className="h-4 w-4 text-accent shrink-0"
        />
        <h3 className="text-sm font-semibold text-foreground truncate">운송 옵션</h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {OPTION_LABELS.map(({ key, label }) => {
          const checked = options[key]
          const isAnimTarget = strokeTargets?.includes(key) ?? false

          // dashoffset 계산
          //  - checked=false → 20 (체크 없음)
          //  - checked=true + isAnimTarget=false → 0 (정적 체크)
          //  - checked=true + isAnimTarget=true  →
          //      triggered=false → 20 (대기)
          //      triggered=true  → 0  (애니 완료)
          let dashOffset: number
          if (!checked) {
            dashOffset = STROKE_DASH_TOTAL
          } else if (!isAnimTarget) {
            dashOffset = 0
          } else {
            dashOffset = triggered ? 0 : STROKE_DASH_TOTAL
          }

          const animating = checked && isAnimTarget

          return (
            <OptionItem
              key={key}
              optionKey={key}
              label={label}
              checked={checked}
              animating={animating}
              dashOffset={dashOffset}
            />
          )
        })}
      </div>
    </section>
  )
}
