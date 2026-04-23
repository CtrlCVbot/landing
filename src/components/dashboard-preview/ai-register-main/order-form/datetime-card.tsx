/**
 * DateTimeCard — 상차/하차 일시 공용 stateless 카드.
 *
 * T-DASH3-M3-04 — 원본 `datetime-card.tsx` (mm-broker, 260줄) 의 시각 뼈대만
 * landing Phase 3 demo 용으로 복제. pickup/delivery 재사용을 위해 `kind` prop 으로 분기.
 *
 * 정책 (Phase 3 스펙 §2-1 Dumb Components 원칙)
 *  - Popover/Calendar/Select/react-hook-form/Zustand 스토어 연동은 전부 제거.
 *  - `date`/`time` 은 상위(`OrderFormContainer`) 에서 주입. 내부 상태 없음.
 *  - `active` prop 으로 #6 fill-in caret 2개 필드(date/time) 동시 제어.
 *    `useFillInCaret` 훅을 내부에서 2회 호출 — LocationForm 과 일관된 패턴.
 *  - 프리셋 버튼 "지금 / 오늘 / 내일" 3개는 정적/disabled (클릭 비활성, 데모).
 *    `datePresetActive` 값에 따라 accent 강조.
 *
 * kind 별 시각 분기
 *  - pickup   : 제목 "상차 일시" + lucide `Calendar` 아이콘.
 *  - delivery : 제목 "하차 일시" + lucide `Calendar` 아이콘 (통일).
 *
 * active / fill-in 동작 (#6 — REQ-DASH3-022)
 *  - active=false : date/time 2필드 모두 pre-filled 값 그대로 노출 (caret 숨김).
 *  - active=true  : 2필드 동시에 caret 깜박임 → delay(400ms) 후 값 즉시 등장.
 *  - `prefers-reduced-motion: reduce` 시 즉시 최종 상태 (`useFillInCaret` 내부 처리).
 *
 * 스타일 (REQ-DASH-005 landing 팔레트, F1 T-THEME-08 토큰 전환 완료)
 *  - 카드: `bg-card/50 border border-border rounded-xl p-4`.
 *  - 활성 프리셋: `text-accent border-accent`.
 *  - 비활성 프리셋: `text-muted-foreground border-border`.
 *  - caret: `bg-accent w-[2px] h-4 animate-pulse`.
 *
 * 접근성 (REQ-DASH-007)
 *  - `<section role="region" aria-label="{상차 일시|하차 일시} 정보">` landmark.
 *  - caret 은 `aria-hidden="true"`.
 *
 * @see REQ-DASH3-004 (OrderForm 컴포넌트 복제 매니페스트 — DateTimeCard)
 * @see REQ-DASH3-022 (AI_APPLY fill-in 대상 — pickup/delivery 일시)
 * @see REQ-DASH-005  (landing 팔레트 일관성)
 * @see REQ-DASH-007  (접근성)
 * @see TC-DASH3-UNIT-DTCARD
 * @see TC-DASH3-UNIT-FILLIN
 */

'use client'

import { Calendar, Clock } from 'lucide-react'

import { useFillInCaret } from '@/components/dashboard-preview/interactions/use-fill-in-caret'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DateTimeCardKind = 'pickup' | 'delivery'

export type DateTimePreset = '지금' | '오늘' | '내일'

export interface DateTimeCardProps {
  readonly kind: DateTimeCardKind
  /** ISO 날짜 문자열 또는 "YYYY-MM-DD" 표기 */
  readonly date: string
  /** "HH:mm" 표기 */
  readonly time: string
  /** 활성화된 프리셋. 지정된 버튼만 accent 강조. */
  readonly datePresetActive?: DateTimePreset
  /**
   * #6 fill-in caret 활성 여부 (AI_APPLY Step).
   * true  → date/time 2필드 동시에 caret 깜박임 후 값 등장.
   * false → pre-filled 값 그대로 노출 (caret 숨김).
   */
  readonly active: boolean
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CARD_CLASSES =
  'bg-card/50 border border-border rounded-xl p-4 space-y-3 backdrop-blur-sm'

const CARET_CLASSES =
  'inline-block w-[2px] h-4 bg-accent ml-0.5 align-middle animate-pulse'

const PRESET_BASE_CLASSES =
  'px-2.5 py-1 text-[11px] rounded-md border bg-card/50 cursor-not-allowed transition-colors'

const PRESET_ACTIVE_CLASSES =
  'text-accent border-accent bg-accent/10'

const PRESET_INACTIVE_CLASSES =
  'text-muted-foreground border-border'

const FIELD_ROW_CLASSES =
  'flex items-center gap-2 text-xs text-foreground/80'

const FIELD_ICON_CLASSES = 'h-3.5 w-3.5 shrink-0 text-muted-foreground'

const PRESETS: ReadonlyArray<DateTimePreset> = ['지금', '오늘', '내일']

// ---------------------------------------------------------------------------
// Sub-component — PresetButton (정적/disabled)
// ---------------------------------------------------------------------------

interface PresetButtonProps {
  readonly label: DateTimePreset
  readonly active: boolean
}

function PresetButton({ label, active }: PresetButtonProps) {
  const className = `${PRESET_BASE_CLASSES} ${
    active ? PRESET_ACTIVE_CLASSES : PRESET_INACTIVE_CLASSES
  }`
  return (
    <button
      type="button"
      disabled
      aria-pressed={active}
      data-active={active}
      className={className}
    >
      {label}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Sub-component — FilledDateTimeField
// ---------------------------------------------------------------------------

interface FilledDateTimeFieldProps {
  readonly icon: React.ReactNode
  readonly label: string
  readonly value: string
  readonly active: boolean
  readonly monospace?: boolean
}

/**
 * 단일 date / time 필드 (아이콘 + 라벨 + 값 + caret). `useFillInCaret` 내부 호출.
 * active=false 면 값이 즉시 노출되고 caret 은 숨김.
 */
function FilledDateTimeField({
  icon,
  label,
  value,
  active,
  monospace = false,
}: FilledDateTimeFieldProps) {
  const { displayedValue, caretVisible, isFilling } = useFillInCaret(value, {
    active,
  })

  const shown = active ? displayedValue : value
  const showCaret = active && isFilling && caretVisible

  return (
    <div className={FIELD_ROW_CLASSES}>
      {icon}
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span
        className={
          monospace
            ? 'font-mono truncate text-foreground'
            : 'truncate text-foreground'
        }
      >
        {shown}
      </span>
      {showCaret && (
        <span
          data-caret
          aria-hidden="true"
          className={CARET_CLASSES}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function DateTimeCard({
  kind,
  date,
  time,
  datePresetActive,
  active,
}: DateTimeCardProps) {
  const isPickup = kind === 'pickup'
  const title = isPickup ? '상차 일시' : '하차 일시'
  const ariaLabel = `${title} 정보`
  const testId = `datetime-card-${kind}`

  return (
    <section
      role="region"
      aria-label={ariaLabel}
      data-testid={testId}
      data-kind={kind}
      className={CARD_CLASSES}
    >
      {/* Header: 제목 + Calendar 아이콘 */}
      <div className="flex items-center gap-2 min-w-0">
        <Calendar
          aria-hidden="true"
          data-icon="calendar"
          className="h-4 w-4 text-accent shrink-0"
        />
        <h3 className="text-sm font-semibold text-foreground truncate">{title}</h3>
      </div>

      {/* 프리셋 버튼 (지금 / 오늘 / 내일) — 정적/disabled */}
      <div className="flex items-center gap-1.5">
        {PRESETS.map((preset) => (
          <PresetButton
            key={preset}
            label={preset}
            active={datePresetActive === preset}
          />
        ))}
      </div>

      {/* 날짜 / 시간 필드 — #6 fill-in */}
      <div className="flex flex-col gap-2 pt-1 border-t border-border/50">
        <FilledDateTimeField
          icon={
            <Calendar
              aria-hidden="true"
              className={FIELD_ICON_CLASSES}
            />
          }
          label="날짜"
          value={date}
          active={active}
          monospace
        />
        <FilledDateTimeField
          icon={
            <Clock
              aria-hidden="true"
              data-icon="clock"
              className={FIELD_ICON_CLASSES}
            />
          }
          label="시간"
          value={time}
          active={active}
          monospace
        />
      </div>
    </section>
  )
}
