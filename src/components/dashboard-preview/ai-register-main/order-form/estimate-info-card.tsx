/**
 * EstimateInfoCard — Col 3 중단 예상 운임/거리/소요 + 자동 배차 대기 토글 카드.
 *
 * T-DASH3-M3-08 — 원본 `estimate-info-card.tsx` (mm-broker) 의 RHF/Card/Dialog 연동을 제거하고
 * landing Phase 3 demo 용 stateless 시각 복제. 거리/소요/운임 3 수치에 #8 number-rolling 적용.
 *
 * 정책 (Phase 3 스펙 §2-1 Dumb Components 원칙)
 *  - 상위(`OrderFormContainer`) 에서 주입한 `distance`/`duration`/`amount`/`autoDispatch` 를 그대로 표시.
 *  - `active` + `rollingTriggerAt` 으로 #8 롤링 애니 활성화 제어:
 *    - `active=false` → useNumberRolling(active:false) → 즉시 target 정적 표시.
 *    - `active=true` + `rollingTriggerAt=null` → 아직 발동 전 (초기 0 유지).
 *    - `active=true` + `rollingTriggerAt>=0` → 주어진 ms 경과 후 0→target 카운트업 (400ms easeOut).
 *  - 자동 배차 대기 토글은 시각적 표시만 (onClick 없음). mock-data `formData.estimate.autoDispatch` 와 동기.
 *
 * 스타일 (REQ-DASH-005 landing 팔레트, F1 T-THEME-08 토큰 전환 완료)
 *  - 카드: `bg-card/50 border border-border rounded-xl p-4 backdrop-blur-sm`.
 *  - 제목 아이콘: lucide `Calculator`.
 *  - active=true glow: `ring-1 ring-accent/30 shadow-lg shadow-accent/10`.
 *  - 자동 배차 대기 토글 ON: `bg-gradient-to-r from-purple-600 to-blue-600 text-white` (D-010 브랜드 고정).
 *  - 자동 배차 대기 토글 OFF: `bg-muted/50 text-foreground/80`.
 *
 * 접근성 (REQ-DASH-007)
 *  - `<section role="region" aria-label="예상 운임/거리">` landmark.
 *  - 아이콘은 `aria-hidden="true"`.
 *
 * @see REQ-DASH3-004 (OrderForm 컴포넌트 복제 매니페스트 — EstimateInfoCard)
 * @see REQ-DASH3-023 (#8 number-rolling — 운임/거리/소요 0→target)
 * @see REQ-DASH-005 (landing 팔레트 일관성)
 * @see REQ-DASH-007 (접근성)
 * @see TC-DASH3-UNIT-ESTINFO + TC-DASH3-UNIT-ROLL
 */

'use client'

import { Calculator, Zap } from 'lucide-react'

import { useNumberRolling } from '@/components/dashboard-preview/interactions/use-number-rolling'
import { useTriggerAt } from '@/components/dashboard-preview/interactions/use-trigger-at'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EstimateInfoCardProps {
  /** 예상 거리 (km) */
  readonly distance: number
  /** 예상 소요 시간 (분) */
  readonly duration: number
  /** 예상 운임 (원) */
  readonly amount: number
  /** 자동 배차 대기 토글 활성 여부 */
  readonly autoDispatch: boolean
  /**
   * #8 number-rolling 활성 여부.
   *  - false → 최종값 즉시 정적 표시.
   *  - true  → `rollingTriggerAt` 경과 시 0→target 롤링 (400ms).
   */
  readonly active: boolean
  /**
   * 롤링 애니 시작 오프셋 (mount 후 ms).
   *  - null/undefined → 애니 발동 대기 (초기 0 유지).
   *  - number(>=0)   → 해당 ms 경과 시 롤링 시작.
   */
  readonly rollingTriggerAt?: number | null
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BASE_CARD_CLASSES =
  'bg-card/50 border border-border rounded-xl p-4 backdrop-blur-sm space-y-3'

const ACTIVE_GLOW_CLASSES = 'ring-1 ring-accent/30 shadow-lg shadow-accent/10'

const ROLLING_DURATION_MS = 400

// D-010 — 브랜드 gradient CTA: text-white 고정 유지 (양 테마 공통 가독).
const TOGGLE_ON_CLASSES =
  'bg-gradient-to-r from-purple-600 to-blue-600 text-white'

const TOGGLE_OFF_CLASSES = 'bg-muted/50 text-foreground/80'

// ---------------------------------------------------------------------------
// Rolling values hook — 3 수치 롤링을 단일 진입점으로 묶는다.
//
// useNumberRolling 은 active=true 일 때 즉시 0→target 롤링을 시작하므로,
// rollingTriggerAt 이 지정된 경우 해당 ms 경과 전까지 hook 이 false 를 반환해
// "대기" 상태를 구현한다 (M3-review#2 — useTriggerAt 공통 훅 사용).
// ---------------------------------------------------------------------------

interface RollingValues {
  readonly distance: number
  readonly duration: number
  readonly amount: number
}

function useRollingValues(
  props: Pick<
    EstimateInfoCardProps,
    'distance' | 'duration' | 'amount' | 'active' | 'rollingTriggerAt'
  >,
): RollingValues {
  const { distance, duration, amount, active, rollingTriggerAt } = props
  const triggered = useTriggerAt({ active, triggerAt: rollingTriggerAt })

  // active=true + triggered=false → 0 target (애니 대기 상태로 0 유지)
  // 그 외 → 실제 target (active=false 면 useNumberRolling 이 즉시 반환)
  const waiting = active && !triggered
  const options = { active, durationMs: ROLLING_DURATION_MS } as const

  const displayDistance = useNumberRolling(waiting ? 0 : distance, options)
  const displayDuration = useNumberRolling(waiting ? 0 : duration, options)
  const displayAmount = useNumberRolling(waiting ? 0 : amount, options)

  return {
    distance: displayDistance,
    duration: displayDuration,
    amount: displayAmount,
  }
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function EstimateInfoCard(props: EstimateInfoCardProps) {
  const { autoDispatch, active } = props
  const rolling = useRollingValues(props)

  const cardClassName = active
    ? `${BASE_CARD_CLASSES} ${ACTIVE_GLOW_CLASSES}`
    : BASE_CARD_CLASSES

  return (
    <section
      role="region"
      aria-label="예상 운임/거리"
      data-testid="estimate-info-card"
      data-active={active}
      className={cardClassName}
    >
      <CardHeader />
      <MetricGrid
        distance={rolling.distance}
        duration={rolling.duration}
        amount={rolling.amount}
      />
      <AutoDispatchToggle autoDispatch={autoDispatch} />
    </section>
  )
}

// ---------------------------------------------------------------------------
// Sub-component — CardHeader
// ---------------------------------------------------------------------------

function CardHeader() {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <Calculator
        aria-hidden="true"
        data-icon="estimate-info"
        className="h-4 w-4 text-accent shrink-0"
      />
      <h3 className="text-sm font-semibold text-foreground truncate">
        예상 운임/거리
      </h3>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-component — MetricGrid (3 수치)
// ---------------------------------------------------------------------------

interface MetricGridProps {
  readonly distance: number
  readonly duration: number
  readonly amount: number
}

function MetricGrid({ distance, duration, amount }: MetricGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <MetricCell
        testId="estimate-info-distance"
        label="거리"
        value={distance}
        unit="km"
      />
      <MetricCell
        testId="estimate-info-duration"
        label="소요"
        value={duration}
        unit="분"
      />
      <MetricCell
        testId="estimate-info-amount"
        label="운임"
        value={amount}
        unit="원"
        formatThousands
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-component — AutoDispatchToggle
// ---------------------------------------------------------------------------

interface AutoDispatchToggleProps {
  readonly autoDispatch: boolean
}

function AutoDispatchToggle({ autoDispatch }: AutoDispatchToggleProps) {
  const toggleClassName = autoDispatch ? TOGGLE_ON_CLASSES : TOGGLE_OFF_CLASSES

  return (
    <div
      data-testid="estimate-auto-dispatch-toggle"
      data-auto-dispatch={autoDispatch}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${toggleClassName}`}
    >
      <Zap aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span className="text-xs font-medium">자동 배차 대기</span>
      <span className="ml-auto text-xs font-semibold tabular-nums">
        {autoDispatch ? 'ON' : 'OFF'}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-component — MetricCell
// ---------------------------------------------------------------------------

interface MetricCellProps {
  readonly testId: string
  readonly label: string
  readonly value: number
  readonly unit: string
  /** true 시 천 단위 구분자 (toLocaleString) 적용 */
  readonly formatThousands?: boolean
}

function MetricCell({
  testId,
  label,
  value,
  unit,
  formatThousands = false,
}: MetricCellProps) {
  const formatted = formatThousands ? value.toLocaleString() : String(value)

  return (
    <div
      className="flex flex-col gap-0.5 items-start px-2 py-2 rounded-md bg-card/50 border border-border"
    >
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <span
        data-testid={testId}
        className="text-sm font-bold text-foreground tabular-nums"
      >
        {formatted}
        <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">
          {unit}
        </span>
      </span>
    </div>
  )
}
