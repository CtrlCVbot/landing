/**
 * OrderFormContainer — 우측 3-column grid + 자식 9개 주입.
 *
 * T-DASH3-M1-03 — shell (grid 레이아웃)
 * T-DASH3-M3-01 — 자식 9개 주입
 * T-DASH3-M3-11 — AI_APPLY 2단 구조 (partialBeat → allBeat) 트리거 분배
 *
 * 레이아웃 (REQ-DASH3-053)
 *  - `flex-1` + `grid grid-cols-1 lg:grid-cols-3 gap-4`
 *  - `p-4` padding + `overflow-auto`
 *  - landing 팔레트 `bg-gradient-to-br from-gray-900/50 to-gray-950/50`
 *
 * 컬럼 구성 (M3-01)
 *  - Col 1: CompanyManagerSection (pre-filled) + LocationForm(pickup) + LocationForm(delivery)
 *  - Col 2: EstimateDistanceInfo + DateTimeCard(pickup/delivery 2열) + CargoInfoForm
 *  - Col 3: TransportOptionCard + EstimateInfoCard + SettlementSection
 *
 * AI_APPLY 2단 구조 (M3-11, REQ-DASH3-041 / 042 / 043)
 *  - partialBeat: categoryOrder (departure / destination / cargo / fare) × intervalMs 기반으로
 *    fillInFields 가 pickup / delivery / vehicle+cargo 의 active 상태를 분배.
 *  - allBeat: TransportOption stroke 애니 + Estimate/Settlement 롤링 트리거.
 *  - `fillInFields[].delay` 가 partialBeat.intervalMs 의 배수이므로 delay 값 자체가 카테고리 offset.
 *
 * 접근성 (REQ-DASH-007)
 *  - `aria-label="주문 등록 폼"` 으로 landmark 명시.
 */

'use client'

import { useColumnPulse } from '@/components/dashboard-preview/interactions/use-column-pulse'
import type { PreviewMockData } from '@/lib/mock-data'
import type { PreviewStep } from '@/lib/preview-steps'
import type { TransportOptionKey } from './transport-option-card'

import { CargoInfoForm } from './cargo-info-form'
import { CompanyManagerSection } from './company-manager-section'
import { DateTimeCard, type DateTimePreset } from './datetime-card'
import { EstimateDistanceInfo } from './estimate-distance-info'
import { EstimateInfoCard } from './estimate-info-card'
import { LocationForm } from './location-form'
import { SettlementSection } from './settlement-section'
import { TransportOptionCard } from './transport-option-card'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OrderFormContainerProps {
  readonly step: PreviewStep
  readonly formData: PreviewMockData['formData']
}

// ---------------------------------------------------------------------------
// Helpers — partialBeat 카테고리별 fill-in active 판정
// ---------------------------------------------------------------------------

const DATE_TIME_PRESETS: ReadonlyArray<DateTimePreset> = ['지금', '오늘', '내일']

function asDateTimePreset(raw: string | undefined): DateTimePreset | undefined {
  if (raw === undefined) return undefined
  return DATE_TIME_PRESETS.find((preset) => preset === raw)
}

interface PartialBeatActiveFlags {
  readonly pickup: boolean
  readonly delivery: boolean
  readonly cargo: boolean
}

/**
 * partialBeat.fillInFields 의 fieldId prefix 로 카테고리별 active 를 분배.
 *  - pickup-* (pickup-address / pickup-datetime) → pickup active
 *  - delivery-* (delivery-address / delivery-datetime) → delivery active
 *  - vehicle-* / cargo-* → cargo active (CargoInfoForm 대상)
 */
function computePartialBeatFlags(step: PreviewStep): PartialBeatActiveFlags {
  if (step.id !== 'AI_APPLY') {
    return { pickup: false, delivery: false, cargo: false }
  }
  const fields = step.interactions.partialBeat?.fillInFields ?? []
  if (fields.length === 0) {
    return { pickup: false, delivery: false, cargo: false }
  }
  return {
    pickup: fields.some((f) => f.fieldId.startsWith('pickup-')),
    delivery: fields.some((f) => f.fieldId.startsWith('delivery-')),
    cargo: fields.some(
      (f) => f.fieldId.startsWith('vehicle-') || f.fieldId.startsWith('cargo-'),
    ),
  }
}

// ---------------------------------------------------------------------------
// Helpers — allBeat (stroke / rolling) 트리거
// ---------------------------------------------------------------------------

interface AllBeatFlags {
  readonly active: boolean
  readonly strokeTargets: ReadonlyArray<TransportOptionKey>
  readonly rollingTriggerAt: number | null
}

/**
 * allBeat 전환 타이밍.
 *  - partialBeat 의 마지막 카테고리(fare = index 3) 가 끝난 직후 allBeat 가 시작되는 구조.
 *  - stroke / rolling trigger offset 은 모두 "mount 후 즉시" (=0) 로 통일.
 *    - use-number-rolling 은 active=true 일 때 mount 시점 rAF 예약으로 400ms 롤링.
 *    - transport-option-card 의 useStrokeTriggered 도 triggerAt=0 일 때 즉시 발동.
 *  - AI_APPLY Step 진입 시 container 는 mount 되며, 그 시점부터 rolling/stroke 애니가 시작된다.
 *  - 별도의 offset 을 부여하지 않는 이유: PreviewStep duration(2500ms) 내부에서 partialBeat
 *    1500ms + allBeat 800ms 가 포함되지만, 이 컨테이너는 Step 전환을 감지해 매번 재마운트되는
 *    자식(rerender) 가 아니므로 자식 훅이 active 변경에 반응하여 롤링을 시작한다.
 */
function computeAllBeatFlags(step: PreviewStep): AllBeatFlags {
  if (step.id !== 'AI_APPLY') {
    return { active: false, strokeTargets: [], rollingTriggerAt: null }
  }
  const allBeat = step.interactions.allBeat
  if (!allBeat) {
    return { active: false, strokeTargets: [], rollingTriggerAt: null }
  }
  const strokeTargets = allBeat.toggleStrokeTargets
    .map(stripTransportOptionPrefix)
    .filter((k): k is TransportOptionKey => k !== null)
  return {
    active: true,
    strokeTargets,
    rollingTriggerAt: 0,
  }
}

/**
 * `toggleStrokeTargets` 는 `transport-option-{key}` 형태의 id.
 * transport-option-card 의 `strokeTargets` prop 은 raw option key 를 요구하므로 prefix 제거 후
 * `VALID_TRANSPORT_OPTION_KEYS` 화이트리스트에 포함된 경우에만 반환한다.
 *
 * M3-review#3 — 오타/타이밍 이슈로 invalid key 가 유입되는 것을 런타임 대신 이 경계에서 차단한다.
 * 유효하지 않으면 `null` 반환; 호출부에서 `.filter((k): k is TransportOptionKey => k !== null)` 로 제거한다.
 */
const VALID_TRANSPORT_OPTION_KEYS = [
  'fast',
  'roundTrip',
  'direct',
  'trace',
  'forklift',
  'manual',
  'cod',
  'special',
] as const satisfies ReadonlyArray<TransportOptionKey>

export function stripTransportOptionPrefix(
  fullId: string,
): TransportOptionKey | null {
  const prefix = 'transport-option-'
  const key = fullId.startsWith(prefix) ? fullId.slice(prefix.length) : fullId
  return (VALID_TRANSPORT_OPTION_KEYS as ReadonlyArray<string>).includes(key)
    ? (key as TransportOptionKey)
    : null
}

// ---------------------------------------------------------------------------
// #10 Column-wise Border Pulse (M4-03 / REQ-DASH3-029)
// ---------------------------------------------------------------------------

/**
 * Column 별 pulse 시작 offset (AI_APPLY partialBeat/allBeat 정렬, ms).
 *  - col-1 (pickup/delivery) : partialBeat departure/destination 동시 시작
 *  - col-2 (vehicle/cargo)   : partialBeat cargo offset (2 × 300ms)
 *  - col-3 (options/estimate): partialBeat 종료 → allBeat 진입 (~1500ms)
 *
 * M4 review#2 — pulse duration / reduced-motion 처리는 `interactions/use-column-pulse.ts`
 * 공용 훅이 담당한다. 여기서는 offset 상수만 보관한다.
 */
const COLUMN_PULSE_OFFSETS_MS = {
  col1: 0,
  col2: 600,
  col3: 1500,
} as const

/** Column pulse 활성 시 적용하는 ring + shadow 클래스 조합. */
const COL_PULSE_RING_CLASSES =
  ' ring-2 ring-accent/60 ring-offset-2 ring-offset-background/40 shadow-[0_0_24px_rgba(96,165,250,0.35)]'

/**
 * M4-review#1 — column pulse 대상 id 집합을 반환.
 * AI_APPLY 외 Step 은 항상 빈 Set (pulse 비활성).
 * 각 column 의 data-testid(col-1/col-2/col-3) 를 includes 로 판정한다.
 */
function computeColumnPulseTargets(step: PreviewStep): ReadonlySet<string> {
  if (step.id !== 'AI_APPLY') return new Set<string>()
  const targets = step.interactions.columnPulseTargets ?? []
  return new Set<string>(targets)
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function OrderFormContainer({ step, formData }: OrderFormContainerProps) {
  const partial = computePartialBeatFlags(step)
  const allBeat = computeAllBeatFlags(step)

  // DistanceInfo: AI_APPLY 이후 수치 노출. 이전 Step 은 "측정 전" placeholder.
  const distanceVisible = step.id === 'AI_APPLY'

  // Stroke trigger: active 이면 mount 즉시 발동 (offset 0). 비활성 상태에선 null.
  const strokeTriggerAt = allBeat.active ? 0 : null

  // Column pulse (M4-03 + review#1) — AI_APPLY 에서 columnPulseTargets SSOT 를 소비.
  //   - targets: ReadonlySet<'col-1'|'col-2'|'col-3'> (AI_APPLY 외 Step 은 빈 Set)
  //   - 각 col 은 presence 로 active 판정, offset 은 COLUMN_PULSE_OFFSETS_MS 상수 참조.
  const pulseTargets = computeColumnPulseTargets(step)
  const col1Pulse = useColumnPulse(
    pulseTargets.has('col-1'),
    pulseTargets.has('col-1') ? COLUMN_PULSE_OFFSETS_MS.col1 : null,
  )
  const col2Pulse = useColumnPulse(
    pulseTargets.has('col-2'),
    pulseTargets.has('col-2') ? COLUMN_PULSE_OFFSETS_MS.col2 : null,
  )
  const col3Pulse = useColumnPulse(
    pulseTargets.has('col-3'),
    pulseTargets.has('col-3') ? COLUMN_PULSE_OFFSETS_MS.col3 : null,
  )

  return (
    // M5-06 review#3 — landmark 완전성: <div aria-label> 은 implicit role 이 없어
    // 스크린리더 landmark navigation 에서 누락된다. <section role="region"> 으로 변경하여
    // VoiceOver rotor / NVDA D 키 등 landmark 탐색에서 노출되도록 보장.
    <section
      role="region"
      aria-label="주문 등록 폼"
      data-testid="order-form-grid"
      className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-gradient-to-br from-muted/30 to-muted/50 overflow-auto"
    >
      {/* -------------------------------------------------------------------- */}
      {/* Col 1 — Company + Pickup + Delivery */}
      {/* -------------------------------------------------------------------- */}
      <div
        data-col="1"
        data-testid="col-1"
        data-pulse-active={col1Pulse ? 'true' : 'false'}
        className={
          'lg:col-span-1 space-y-4 rounded-lg transition-shadow duration-200' +
          (col1Pulse ? COL_PULSE_RING_CLASSES : '')
        }
      >
        <CompanyManagerSection
          company={formData.company}
          manager={formData.manager}
        />
        <LocationForm
          kind="pickup"
          data={formData.pickup}
          active={partial.pickup}
        />
        <LocationForm
          kind="delivery"
          data={formData.delivery}
          active={partial.delivery}
        />
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Col 2 — DistanceInfo + Pickup/Delivery DateTime + Cargo */}
      {/* -------------------------------------------------------------------- */}
      <div
        data-col="2"
        data-testid="col-2"
        data-pulse-active={col2Pulse ? 'true' : 'false'}
        className={
          'lg:col-span-1 space-y-4 rounded-lg transition-shadow duration-200' +
          (col2Pulse ? COL_PULSE_RING_CLASSES : '')
        }
      >
        <EstimateDistanceInfo
          distance={formData.estimate.distance}
          duration={formData.estimate.duration}
          visible={distanceVisible}
        />
        <div
          data-testid="datetime-card-grid"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <DateTimeCard
            kind="pickup"
            date={formData.pickup.date}
            time={formData.pickup.time}
            datePresetActive={asDateTimePreset(formData.pickup.datePresetActive)}
            active={partial.pickup}
          />
          <DateTimeCard
            kind="delivery"
            date={formData.delivery.date}
            time={formData.delivery.time}
            datePresetActive={asDateTimePreset(formData.delivery.datePresetActive)}
            active={partial.delivery}
          />
        </div>
        <CargoInfoForm
          vehicle={formData.vehicle}
          cargo={formData.cargo}
          active={partial.cargo}
          dropdownBeat={
            step.id === 'AI_APPLY'
              ? step.interactions.partialBeat?.dropdownBeat
              : undefined
          }
        />
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Col 3 — TransportOption + Estimate + Settlement */}
      {/* -------------------------------------------------------------------- */}
      <div
        data-col="3"
        data-testid="col-3"
        data-pulse-active={col3Pulse ? 'true' : 'false'}
        className={
          'lg:col-span-1 space-y-4 rounded-lg transition-shadow duration-200' +
          (col3Pulse ? COL_PULSE_RING_CLASSES : '')
        }
      >
        <TransportOptionCard
          options={formData.options}
          strokeTargets={allBeat.strokeTargets}
          strokeTriggerAt={strokeTriggerAt}
        />
        <EstimateInfoCard
          distance={formData.estimate.distance}
          duration={formData.estimate.duration}
          amount={formData.estimate.amount}
          autoDispatch={formData.estimate.autoDispatch}
          active={allBeat.active}
          rollingTriggerAt={allBeat.rollingTriggerAt}
        />
        <SettlementSection
          settlement={formData.settlement}
          active={allBeat.active}
          rollingTriggerAt={allBeat.rollingTriggerAt}
        />
      </div>
    </section>
  )
}
