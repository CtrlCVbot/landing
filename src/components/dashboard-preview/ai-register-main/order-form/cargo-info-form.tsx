/**
 * CargoInfoForm — Col 2 하단 화물/차량 정보 stateless 카드.
 *
 * T-DASH3-M3-06 — 원본 `cargo-info-form.tsx` (mm-broker, 352줄) 의 시각 뼈대만
 * landing Phase 3 demo 용으로 복제. 내부 API 호출/useRecentCargos/shadcn Select 다이얼로그
 * 전부 제거하고 시각 자리만 유지.
 *
 * 정책 (Phase 3 스펙 §2-1 Dumb Components 원칙)
 *  - 차량 타입/중량/화물명/비고/최근 화물 제안 5개 요소를 상위(`OrderFormContainer`) 주입값으로 렌더.
 *  - 내부 상태 없음. select trigger 는 `<button disabled>` 로 시각 자리만 유지 (데모 정적).
 *  - `active` prop 으로 #6 fill-in caret 2필드(cargo.name/cargo.remark) 동시 제어.
 *    `useFillInCaret` 훅을 내부에서 2회 호출 (LocationForm / DateTimeCard 일관 패턴).
 *
 * #7 dropdown 펼침 연출 (REQ-DASH3-027)
 *  - `dropdownBeat` prop 으로 특정 select(`vehicle-type` | `weight`) 를 일시 펼침.
 *  - triggerAt(ms, mount 후 offset) 경과 시점에 해당 select 의 `data-expanded="true"` 전환,
 *    600ms 후 자동으로 `data-expanded="false"` 복귀.
 *  - 펼침 상태에서 하이라이트 마커(`data-highlight="true"`) 가 첫 옵션에 노출.
 *  - "열림 → 하이라이트 → 닫힘" 3 beat 를 CSS opacity/height 전환과 결합해 자연스럽게 표현.
 *  - `prefers-reduced-motion: reduce` 시 트랜지션은 소비 측 CSS 가 disable (이 컴포넌트는 data-*
 *    속성만 토글).
 *
 * 스타일 (REQ-DASH-005 landing 팔레트, T-THEME-13 토큰 치환)
 *  - 카드: `bg-card/50 border-border rounded-xl p-4 space-y-3` (원본: bg-white/5 border-white/10).
 *  - select trigger (disabled): `bg-card/50 border-border text-foreground cursor-not-allowed` (원본: bg-white/5 border-white/10 text-white/80).
 *  - 펼침 패널: `bg-card border-border shadow-lg` (원본: bg-gray-900 border-white/10).
 *  - 최근 화물 칩: `bg-card/50 border-border text-foreground/80` (원본: bg-white/5 border-white/10 text-white/70).
 *  - caret: `bg-accent w-[2px] h-4 animate-pulse`.
 *
 * 접근성 (REQ-DASH-007)
 *  - `<section role="region" aria-label="화물 정보">` landmark.
 *  - select trigger 에 `aria-expanded`, `aria-haspopup="listbox"` 부여.
 *  - caret 은 `aria-hidden="true"`.
 *
 * @see REQ-DASH3-004 (OrderForm 컴포넌트 복제 매니페스트 — CargoInfoForm)
 * @see REQ-DASH3-027 (#7 dropdown — 차량 타입/중량 select 펼침 연출)
 * @see REQ-DASH-005  (landing 팔레트 일관성)
 * @see REQ-DASH-007  (접근성)
 * @see TC-DASH3-UNIT-CARGOFORM
 * @see TC-DASH3-UNIT-DROP
 * @see TC-DASH3-UNIT-FILLIN
 */

'use client'

import { useEffect, useState } from 'react'
import {
  Container,
  Weight,
  Truck,
  Package,
  ChevronDown,
} from 'lucide-react'

import { useFillInCaret } from '@/components/dashboard-preview/interactions/use-fill-in-caret'
import type { PreviewMockData } from '@/lib/mock-data'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CargoDropdownTargetId = 'vehicle-type' | 'weight'

export interface CargoDropdownBeat {
  /** 펼침 대상 select 식별자. 'vehicle-type' | 'weight'. */
  readonly targetId: CargoDropdownTargetId
  /** mount 후 펼침 발동 offset(ms). null 이면 비활성. */
  readonly triggerAt: number | null
}

export interface CargoInfoFormProps {
  readonly vehicle: PreviewMockData['formData']['vehicle']
  readonly cargo: PreviewMockData['formData']['cargo']
  /**
   * #6 fill-in caret 활성 여부 (AI_APPLY Step).
   * true  → cargo.name / cargo.remark 2필드 동시에 caret 깜박임 후 값 등장.
   * false → pre-filled 값 그대로 노출 (caret 숨김).
   */
  readonly active: boolean
  readonly revealed?: boolean
  /**
   * #7 dropdown 펼침 연출 제어.
   * 미지정/null 이면 select 는 항상 닫힘.
   */
  readonly dropdownBeat?: CargoDropdownBeat
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CARD_CLASSES =
  'bg-card/50 border border-border rounded-xl p-4 space-y-3 backdrop-blur-sm'

const CARET_CLASSES =
  'inline-block w-[2px] h-4 bg-accent ml-0.5 align-middle animate-pulse'

const FIELD_LABEL_CLASSES = 'text-xs text-muted-foreground flex items-center gap-1.5 mb-1.5'

const FIELD_LABEL_ICON_CLASSES = 'h-3.5 w-3.5 shrink-0'

const SELECT_TRIGGER_BASE =
  'w-full flex items-center justify-between gap-2 px-3 py-2 text-xs text-foreground bg-card/50 border border-border rounded-md cursor-not-allowed disabled:opacity-80 transition-colors'

const SELECT_TRIGGER_EXPANDED = 'border-accent/50 bg-accent/10'

const SELECT_PANEL_BASE =
  'relative mt-1 rounded-md border bg-card border-border text-xs text-foreground/80 overflow-hidden transition-all duration-200 ease-out'

const SELECT_PANEL_CLOSED =
  'max-h-0 opacity-0 pointer-events-none'

const SELECT_PANEL_EXPANDED =
  'max-h-32 opacity-100'

const CHIP_BASE_CLASSES =
  'inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded-md border border-border bg-card/50 text-foreground/80 cursor-not-allowed'

const DROPDOWN_OPEN_DURATION_MS = 600

// select 옵션 더미(시각 자리) — ORDER_VEHICLE_TYPES/WEIGHTS 의 축약
const VEHICLE_TYPE_OPTIONS: ReadonlyArray<string> = ['카고', '탑차', '윙바디']
const VEHICLE_WEIGHT_OPTIONS: ReadonlyArray<string> = ['1톤', '2.5톤', '5톤']

// ---------------------------------------------------------------------------
// Sub-component — FilledTextField (#6 fill-in 적용)
// ---------------------------------------------------------------------------

interface FilledTextFieldProps {
  readonly label: string
  readonly value: string
  readonly active: boolean
  readonly revealed: boolean
  readonly multiline?: boolean
  readonly testId?: string
}

function FilledTextField({
  label,
  value,
  active,
  revealed,
  multiline = false,
  testId,
}: FilledTextFieldProps) {
  const { displayedValue, caretVisible, isFilling } = useFillInCaret(value, {
    active,
  })

  const shown = revealed ? (active ? displayedValue : value) : '—'
  const showCaret = revealed && active && isFilling && caretVisible

  return (
    <div data-testid={testId}>
      <div className={FIELD_LABEL_CLASSES}>
        <span>{label}</span>
      </div>
      <div
        className={
          multiline
            ? 'min-h-[3rem] px-3 py-2 text-xs text-foreground bg-card/50 border border-border rounded-md whitespace-pre-wrap'
            : 'px-3 py-2 text-xs text-foreground bg-card/50 border border-border rounded-md'
        }
      >
        <span>{shown}</span>
        {showCaret && (
          <span
            data-caret
            aria-hidden="true"
            className={CARET_CLASSES}
          />
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-component — DropdownSelect (#7 dropdown 펼침 연출)
// ---------------------------------------------------------------------------

interface DropdownSelectProps {
  readonly targetId: CargoDropdownTargetId
  readonly label: string
  readonly icon: React.ReactNode
  readonly value: string
  readonly options: ReadonlyArray<string>
  readonly expanded: boolean
}

function DropdownSelect({
  targetId,
  label,
  icon,
  value,
  options,
  expanded,
}: DropdownSelectProps) {
  const triggerTestId =
    targetId === 'vehicle-type'
      ? 'cargo-vehicle-type-trigger'
      : 'cargo-weight-trigger'

  const triggerClassName = `${SELECT_TRIGGER_BASE} ${
    expanded ? SELECT_TRIGGER_EXPANDED : ''
  }`.trim()

  const panelClassName = `${SELECT_PANEL_BASE} ${
    expanded ? SELECT_PANEL_EXPANDED : SELECT_PANEL_CLOSED
  }`.trim()

  return (
    <div data-dropdown={targetId}>
      <div className={FIELD_LABEL_CLASSES}>
        {icon}
        <span>{label}</span>
      </div>
      <button
        type="button"
        disabled
        data-testid={triggerTestId}
        data-expanded={expanded}
        aria-expanded={expanded}
        aria-haspopup="listbox"
        className={triggerClassName}
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
        />
      </button>
      <div
        role="listbox"
        aria-hidden={!expanded}
        className={panelClassName}
      >
        {options.map((opt, idx) => {
          const isHighlighted = expanded && idx === 0
          return (
            <div
              key={opt}
              data-highlight={isHighlighted || undefined}
              className={
                isHighlighted
                  ? 'px-3 py-1.5 bg-accent/10 text-accent'
                  : 'px-3 py-1.5'
              }
            >
              {opt}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Hook — #7 dropdown 발동/복귀 타이머
// ---------------------------------------------------------------------------

function useDropdownBeat(
  beat: CargoDropdownBeat | undefined,
): CargoDropdownTargetId | null {
  const [expandedTarget, setExpandedTarget] =
    useState<CargoDropdownTargetId | null>(null)

  useEffect(() => {
    if (!beat || beat.triggerAt === null || beat.triggerAt < 0) {
      setExpandedTarget(null)
      return
    }

    const openTimer = setTimeout(() => {
      setExpandedTarget(beat.targetId)
    }, beat.triggerAt)

    const closeTimer = setTimeout(() => {
      setExpandedTarget(null)
    }, beat.triggerAt + DROPDOWN_OPEN_DURATION_MS)

    return () => {
      clearTimeout(openTimer)
      clearTimeout(closeTimer)
    }
  }, [beat])

  return expandedTarget
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function CargoInfoForm({
  vehicle,
  cargo,
  active,
  revealed = true,
  dropdownBeat,
}: CargoInfoFormProps) {
  const expandedTarget = useDropdownBeat(dropdownBeat)

  // 유효하지 않은 targetId 는 자동으로 무시 (expandedTarget 이 vehicle-type/weight 가 아니면
  // 각 select 모두 닫힘 상태를 유지).
  const vehicleTypeExpanded = expandedTarget === 'vehicle-type'
  const weightExpanded = expandedTarget === 'weight'

  return (
    <section
      role="region"
      aria-label="화물 정보"
      data-testid="cargo-info-form"
      data-hit-area-id="form-cargo-info"
      data-revealed={revealed}
      className={CARD_CLASSES}
    >
      {/* Header: Container 아이콘 + 제목 */}
      <div className="flex items-center gap-2 min-w-0">
        <Container
          aria-hidden="true"
          data-icon="container"
          className="h-4 w-4 text-accent shrink-0"
        />
        <h3 className="text-sm font-semibold text-foreground truncate">화물 정보</h3>
      </div>

      {/* 차량 타입 / 중량 select (#7 dropdown 대상) */}
      <div className="grid grid-cols-2 gap-2">
        <DropdownSelect
          targetId="vehicle-type"
          label="종류"
          icon={
            <Truck
              aria-hidden="true"
              className={FIELD_LABEL_ICON_CLASSES}
            />
          }
          value={revealed ? vehicle.type : '선택 전'}
          options={VEHICLE_TYPE_OPTIONS}
          expanded={revealed && vehicleTypeExpanded}
        />
        <DropdownSelect
          targetId="weight"
          label="중량"
          icon={
            <Weight
              aria-hidden="true"
              className={FIELD_LABEL_ICON_CLASSES}
            />
          }
          value={revealed ? vehicle.weight : '선택 전'}
          options={VEHICLE_WEIGHT_OPTIONS}
          expanded={revealed && weightExpanded}
        />
      </div>

      {/* 화물명 (#6 fill-in) */}
      <FilledTextField
        label="화물 품목"
        value={cargo.name}
        active={active}
        revealed={revealed}
        testId="cargo-name-field"
      />

      {/* 비고 (#6 fill-in, multiline) */}
      <FilledTextField
        label="비고"
        value={cargo.remark}
        active={active}
        revealed={revealed}
        multiline
        testId="cargo-remark-field"
      />

      {/* 최근 화물 제안 칩 */}
      <div>
        <div className={FIELD_LABEL_CLASSES}>
          <Package
            aria-hidden="true"
            className={FIELD_LABEL_ICON_CLASSES}
          />
          <span>최근 사용 화물</span>
        </div>
        <div
          data-testid="cargo-recent-suggestions"
          className="flex flex-wrap gap-1.5"
        >
          {(revealed ? vehicle.recentCargoSuggestions : ['적용 전']).map(
            (suggestion) => (
              <button
                key={suggestion}
                type="button"
                disabled
                className={CHIP_BASE_CLASSES}
              >
                <span>{suggestion}</span>
              </button>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
