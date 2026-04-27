/**
 * SettlementSection — Col 3 하단 정산 정보 카드.
 *
 * T-DASH3-M3-09 — 원본 mm-broker `register-form.tsx` §1365-1539 인라인 "운임 관리" Card
 * 섹션의 shadcn Card / CurrencyInput / Checkbox 연동을 제거하고 landing Phase 3 demo 용
 * stateless 시각 복제. 합계 3 수치 (청구/지급/수익) 에 #8 number-rolling 적용.
 *
 * 정책 (Phase 3 스펙 §2-1 Dumb Components 원칙)
 *  - 상위(`OrderFormContainer`) 에서 주입한 `settlement` mock 을 그대로 표시.
 *  - `active` + `rollingTriggerAt` 으로 #8 롤링 애니 활성화 제어
 *    (`estimate-info-card` 의 `useRollingTriggered` 와 동일 패턴):
 *    - `active=false` → useNumberRolling(active:false) → 즉시 target 정적 표시.
 *    - `active=true` + `rollingTriggerAt=null` → 아직 발동 전 (0 유지).
 *    - `active=true` + `rollingTriggerAt>=0` → 해당 ms 경과 후 0→target 카운트업 (400ms easeOut).
 *  - 추가 요금 (additionalFees) 은 type / amount / memo 를 단순 그리드로 표시.
 *
 * 스타일 (REQ-DASH-005 landing 팔레트, F1 T-THEME-08 토큰 전환 완료)
 *  - 카드: `bg-card/50 border border-border rounded-xl p-4 backdrop-blur-sm`.
 *  - 제목 아이콘: lucide `Wallet`.
 *  - active=true glow: `ring-1 ring-accent/30 shadow-lg shadow-accent/10`.
 *  - 수익 양수: `text-emerald-600` (D-013); 음수: `text-destructive` (D-013); 0: `text-foreground`.
 *
 * 접근성 (REQ-DASH-007)
 *  - `<section role="region" aria-label="정산 정보">` landmark.
 *  - 아이콘은 `aria-hidden="true"`.
 *
 * @see REQ-DASH3-004 (OrderForm 컴포넌트 복제 매니페스트 — SettlementSection)
 * @see REQ-DASH3-023 (#8 number-rolling — 합계 0→target)
 * @see REQ-DASH3-031 (정산 정보 카드)
 * @see REQ-DASH-005  (landing 팔레트 일관성)
 * @see REQ-DASH-007  (접근성)
 * @see TC-DASH3-UNIT-SETTLEMENT + TC-DASH3-UNIT-ROLL
 */

'use client'

import { Wallet } from 'lucide-react'

import { useNumberRolling } from '@/components/dashboard-preview/interactions/use-number-rolling'
import { useTriggerAt } from '@/components/dashboard-preview/interactions/use-trigger-at'
import type { SettlementMock } from '@/lib/mock-data'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SettlementSectionProps {
  readonly settlement: SettlementMock
  readonly visible?: boolean
  /**
   * #8 number-rolling 활성 여부.
   *  - false → 최종값 즉시 정적 표시.
   *  - true  → `rollingTriggerAt` 경과 시 0→target 롤링 (400ms).
   */
  readonly active: boolean
  /**
   * 롤링 애니 시작 오프셋 (mount 후 ms).
   *  - null/undefined → 애니 발동 대기 (0 유지).
   *  - number(>=0)   → 해당 ms 경과 시 롤링 시작.
   */
  readonly rollingTriggerAt?: number | null
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BASE_CARD_CLASSES =
  'bg-card/50 border border-border shadow-sm rounded-xl p-4 backdrop-blur-sm space-y-3'

const ACTIVE_GLOW_CLASSES = 'ring-1 ring-accent/30 shadow-lg shadow-accent/10'

const ROLLING_DURATION_MS = 700

// ---------------------------------------------------------------------------
// Rolling values hook — 합계 3 수치를 단일 진입점으로 묶는다.
//
// useNumberRolling 이 active=true 일 때 mount 즉시 rAF 를 예약하므로,
// rollingTriggerAt 이 지정된 경우 해당 ms 경과 전까지 hook 이 false 를 반환해
// "대기" 상태를 구현한다 (M3-review#2 — useTriggerAt 공통 훅 사용).
// ---------------------------------------------------------------------------

interface RollingTotals {
  readonly chargeTotal: number
  readonly dispatchTotal: number
  readonly profit: number
}

function useRollingTotals(
  totals: SettlementMock['totals'],
  active: boolean,
  triggerAt: number | null | undefined,
): RollingTotals {
  const triggered = useTriggerAt({ active, triggerAt })

  // active=true + triggered=false → 0 target (애니 대기 상태로 0 유지)
  // 그 외 → 실제 target (active=false 면 useNumberRolling 이 즉시 반환)
  const waiting = active && !triggered
  const options = { active, durationMs: ROLLING_DURATION_MS } as const

  const displayCharge = useNumberRolling(
    waiting ? 0 : totals.chargeTotal,
    options,
  )
  const displayDispatch = useNumberRolling(
    waiting ? 0 : totals.dispatchTotal,
    options,
  )
  const displayProfit = useNumberRolling(waiting ? 0 : totals.profit, options)

  return {
    chargeTotal: displayCharge,
    dispatchTotal: displayDispatch,
    profit: displayProfit,
  }
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function SettlementSection({
  settlement,
  active,
  rollingTriggerAt,
  visible = true,
}: SettlementSectionProps) {
  const rolling = useRollingTotals(settlement.totals, active, rollingTriggerAt)

  const cardClassName = active
    ? `${BASE_CARD_CLASSES} ${ACTIVE_GLOW_CLASSES}`
    : BASE_CARD_CLASSES

  return (
    <section
      role="region"
      aria-label="정산 정보"
      data-testid="settlement-section"
      data-hit-area-id="form-settlement"
      data-active={active}
      data-visible={visible}
      className={cardClassName}
    >
      <CardHeader />
      <BaseAmountGrid
        chargeBaseAmount={settlement.chargeBaseAmount}
        dispatchBaseAmount={settlement.dispatchBaseAmount}
        visible={visible}
      />
      <AdditionalFeesList fees={settlement.additionalFees} visible={visible} />
      <TotalsRow
        chargeTotal={rolling.chargeTotal}
        dispatchTotal={rolling.dispatchTotal}
        profit={rolling.profit}
        visible={visible}
      />
    </section>
  )
}

// ---------------------------------------------------------------------------
// Sub-component — CardHeader
// ---------------------------------------------------------------------------

function CardHeader() {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <Wallet
        aria-hidden="true"
        data-icon="settlement"
        className="h-4 w-4 text-accent shrink-0"
      />
      <h3 className="text-sm font-semibold text-foreground truncate">정산 정보</h3>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-component — BaseAmountGrid (청구 기본 / 배차 기본)
// ---------------------------------------------------------------------------

interface BaseAmountGridProps {
  readonly chargeBaseAmount: number
  readonly dispatchBaseAmount: number
  readonly visible: boolean
}

function BaseAmountGrid({
  chargeBaseAmount,
  dispatchBaseAmount,
  visible,
}: BaseAmountGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <BaseAmountCell
        testId="settlement-base-charge"
        label="청구 기본"
        value={chargeBaseAmount}
        visible={visible}
      />
      <BaseAmountCell
        testId="settlement-base-dispatch"
        label="배차 기본"
        value={dispatchBaseAmount}
        visible={visible}
      />
    </div>
  )
}

interface BaseAmountCellProps {
  readonly testId: string
  readonly label: string
  readonly value: number
  readonly visible: boolean
}

function BaseAmountCell({
  testId,
  label,
  value,
  visible,
}: BaseAmountCellProps) {
  return (
    <div className="flex flex-col gap-0.5 items-start px-2 py-2 rounded-md bg-card/50 border border-border">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <span
        data-testid={testId}
        className="text-sm font-bold text-foreground tabular-nums"
      >
        {visible ? (
          <>
            {value.toLocaleString()}
            <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">원</span>
          </>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-component — AdditionalFeesList
// ---------------------------------------------------------------------------

interface AdditionalFeesListProps {
  readonly fees: SettlementMock['additionalFees']
  readonly visible: boolean
}

function AdditionalFeesList({ fees, visible }: AdditionalFeesListProps) {
  if (!visible) {
    return (
      <div
        data-testid="settlement-fees-pending"
        className="text-[10px] text-muted-foreground italic px-1"
      >
        정산 전
      </div>
    )
  }

  if (fees.length === 0) {
    return (
      <div
        data-testid="settlement-fees-empty"
        className="text-[10px] text-muted-foreground italic px-1"
      >
        추가 요금 없음
      </div>
    )
  }

  return (
    <div
      data-testid="settlement-fees-list"
      className="space-y-1.5 border-t border-border pt-2"
    >
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground px-1">
        <span>추가 요금</span>
      </div>
      {fees.map((fee) => (
        <AdditionalFeeRow key={fee.id} fee={fee} />
      ))}
    </div>
  )
}

interface AdditionalFeeRowProps {
  readonly fee: SettlementMock['additionalFees'][number]
}

function AdditionalFeeRow({ fee }: AdditionalFeeRowProps) {
  return (
    <div
      data-testid={`settlement-fee-${fee.id}`}
      data-target={fee.target}
      className="grid grid-cols-12 gap-2 items-center px-2 py-1.5 rounded-md bg-card/50 border border-border"
    >
      <span className="col-span-3 text-xs text-foreground truncate">
        {fee.type}
      </span>
      <span className="col-span-3 text-xs font-semibold text-foreground tabular-nums text-right">
        {fee.amount.toLocaleString()}
        <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">원</span>
      </span>
      <span className="col-span-6 text-[10px] text-muted-foreground truncate">
        {fee.memo}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-component — TotalsRow (청구합계 / 지급합계 / 수익)
// ---------------------------------------------------------------------------

interface TotalsRowProps {
  readonly chargeTotal: number
  readonly dispatchTotal: number
  readonly profit: number
  readonly visible: boolean
}

function TotalsRow({
  chargeTotal,
  dispatchTotal,
  profit,
  visible,
}: TotalsRowProps) {
  const profitClassName =
    profit > 0
      ? 'text-emerald-600'
      : profit < 0
        ? 'text-destructive'
        : 'text-foreground'

  return (
    <div className="grid grid-cols-3 gap-2 border-t border-border pt-3">
      <TotalCell
        testId="settlement-total-charge"
        label="청구 합계"
        value={chargeTotal}
        visible={visible}
      />
      <TotalCell
        testId="settlement-total-dispatch"
        label="지급 합계"
        value={dispatchTotal}
        visible={visible}
      />
      <TotalCell
        testId="settlement-total-profit"
        label="수익"
        value={profit}
        visible={visible}
        valueClassName={profitClassName}
      />
    </div>
  )
}

interface TotalCellProps {
  readonly testId: string
  readonly label: string
  readonly value: number
  readonly visible: boolean
  readonly valueClassName?: string
}

function TotalCell({
  testId,
  label,
  value,
  visible,
  valueClassName = 'text-foreground',
}: TotalCellProps) {
  return (
    <div className="flex flex-col gap-0.5 items-start">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <span
        data-testid={testId}
        className={`text-sm font-bold tabular-nums ${valueClassName}`}
      >
        {visible ? (
          <>
            {value.toLocaleString()}
            <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">원</span>
          </>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </span>
    </div>
  )
}
