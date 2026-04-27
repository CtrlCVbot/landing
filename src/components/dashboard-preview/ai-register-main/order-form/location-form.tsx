/**
 * LocationForm — 상차/하차지 공용 stateless 카드.
 *
 * T-DASH3-M3-03 — 원본 `location-form.tsx` (mm-broker, 1046줄) 의 시각 뼈대만
 * landing Phase 3 demo 용으로 복제. pickup/delivery 재사용을 위해 `kind` prop 으로 분기.
 *
 * 정책 (Phase 3 스펙 §2-1 Dumb Components 원칙)
 *  - Dialog/Popover/검색/API 호출/react-hook-form/ZUstand 스토어 연동은 전부 제거.
 *  - `data` 는 상위(`OrderFormContainer`) 에서 주입. 내부 상태 없음.
 *  - `active` prop 으로 #6 fill-in caret 4개 필드(company/address/contactName/contactPhone) 동시 제어.
 *    `useFillInCaret` 훅을 내부에서 4회 호출 — M2 `ai-button-item` 이 `useRipple`/`useButtonPress` 를
 *    dumb component 안에서 호출한 패턴과 일관 (스펙 §2-1 허용).
 *  - 주소 검색 버튼은 "Search" 아이콘 + "주소 검색" 라벨의 시각 자리만 (disabled).
 *    실제 다이얼로그는 M3 범위 외.
 *
 * kind 별 시각 분기
 *  - pickup   : 제목 "상차지" + lucide `MapPin` 아이콘.
 *  - delivery : 제목 "하차지" + lucide `Flag` 아이콘.
 *
 * active / fill-in 동작 (#6 — REQ-DASH3-022)
 *  - active=false : 4개 필드 모두 pre-filled 값 그대로 노출 (caret 숨김).
 *  - active=true  : 4개 필드 동시에 caret 깜박임 → delay(400ms) 후 값 즉시 등장.
 *  - `prefers-reduced-motion: reduce` 시 즉시 최종 상태 (`useFillInCaret` 내부 처리).
 *
 * 스타일 (REQ-DASH-005 landing 팔레트)
 *  - 카드: `bg-card/50 border-border rounded-xl p-4` (T-THEME-13 토큰 치환; 원본: bg-white/5 border-white/10).
 *  - 제목: `text-accent` 아이콘 + `text-foreground` 라벨 (T-THEME-13; 원본: text-white).
 *  - caret: `bg-accent w-[2px] h-4 animate-pulse` (값 등장 전 잠깐 깜빡임).
 *
 * 접근성 (REQ-DASH-007)
 *  - `<section role="region" aria-label="{상차지|하차지} 정보">` landmark.
 *  - caret 은 `aria-hidden="true"`.
 *
 * @see REQ-DASH3-004 (OrderForm 컴포넌트 복제 매니페스트 — LocationForm)
 * @see REQ-DASH3-022 (AI_APPLY fill-in 대상 — pickup/delivery 주소·담당자·연락처)
 * @see REQ-DASH-005  (landing 팔레트 일관성)
 * @see REQ-DASH-007  (접근성)
 * @see TC-DASH3-UNIT-LOCFORM
 * @see TC-DASH3-UNIT-FILLIN
 */

'use client'

import {
  MapPin,
  Flag,
  Building,
  User,
  Phone,
  Search,
} from 'lucide-react'

import { useFillInCaret } from '@/components/dashboard-preview/interactions/use-fill-in-caret'
import type { LocationMock } from '@/lib/mock-data'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LocationFormKind = 'pickup' | 'delivery'

export interface LocationFormProps {
  readonly kind: LocationFormKind
  readonly data: LocationMock
  /**
   * #6 fill-in caret 활성 여부 (AI_APPLY Step).
   * true  → 4개 필드 동시에 caret 깜박임 후 값 등장.
   * false → pre-filled 값 그대로 노출 (caret 숨김).
   */
  readonly active: boolean
  readonly revealed?: boolean
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CARD_CLASSES =
  'bg-card/50 border border-border rounded-xl p-4 space-y-3 backdrop-blur-sm'

const CARET_CLASSES =
  'inline-block w-[2px] h-4 bg-accent ml-0.5 align-middle animate-pulse'

const FIELD_ROW_CLASSES =
  'flex items-center gap-2 text-xs text-foreground/80'

const FIELD_LABEL_ICON_CLASSES = 'h-3.5 w-3.5 shrink-0 text-muted-foreground'

// ---------------------------------------------------------------------------
// Sub-component — FilledField
// ---------------------------------------------------------------------------

interface FilledFieldProps {
  readonly icon: React.ReactNode
  readonly label: string
  readonly value: string
  readonly active: boolean
  readonly revealed: boolean
  readonly monospace?: boolean
}

/**
 * 단일 필드 (라벨 + 값 + caret). `useFillInCaret` 내부 호출로 #6 조작감 적용.
 * active=false 면 값이 즉시 노출되고 caret 은 숨김.
 */
function FilledField({
  icon,
  label,
  value,
  active,
  revealed,
  monospace = false,
}: FilledFieldProps) {
  const { displayedValue, caretVisible, isFilling } = useFillInCaret(value, {
    active,
  })

  // active=false 이면 pre-filled 로 즉시 노출.
  // active=true 이면 useFillInCaret 결과를 따름 (초기: '' + caret, delay 후: value).
  const shown = revealed ? (active ? displayedValue : value) : '—'
  const showCaret = revealed && active && isFilling && caretVisible

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

export function LocationForm({
  kind,
  data,
  active,
  revealed = true,
}: LocationFormProps) {
  const isPickup = kind === 'pickup'
  const title = isPickup ? '상차지' : '하차지'
  const ariaLabel = `${title} 정보`
  const testId = `location-form-${kind}`

  const HeaderIcon = isPickup ? MapPin : Flag
  const headerIconName = isPickup ? 'map-pin' : 'flag'

  return (
    <section
      role="region"
      aria-label={ariaLabel}
      data-testid={testId}
      data-hit-area-id={isPickup ? 'form-pickup-location' : 'form-delivery-location'}
      data-kind={kind}
      data-revealed={revealed}
      className={CARD_CLASSES}
    >
      {/* Header: 제목 + 아이콘 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <HeaderIcon
            aria-hidden="true"
            data-icon={headerIconName}
            className="h-4 w-4 text-accent shrink-0"
          />
          <h3 className="text-sm font-semibold text-foreground truncate">
            {title}
          </h3>
        </div>
        {/* 주소 검색 버튼 — 시각 자리만 (M3 범위 외 — disabled) */}
        <button
          type="button"
          disabled
          data-testid={`${testId}-search-button`}
          aria-label="주소 검색"
          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-muted-foreground bg-card/50 border border-border rounded-md cursor-not-allowed"
        >
          <Search
            aria-hidden="true"
            data-icon="search"
            className="h-3 w-3"
          />
          <span>주소 검색</span>
        </button>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-2 pt-1 border-t border-border/50">
        <FilledField
          icon={
            <Building
              aria-hidden="true"
              className={FIELD_LABEL_ICON_CLASSES}
            />
          }
          label="회사명"
          value={data.company}
          active={active}
          revealed={revealed}
        />
        <FilledField
          icon={
            <MapPin
              aria-hidden="true"
              className={FIELD_LABEL_ICON_CLASSES}
            />
          }
          label="주소"
          value={data.roadAddress}
          active={active}
          revealed={revealed}
        />
        <FilledField
          icon={
            <User
              aria-hidden="true"
              className={FIELD_LABEL_ICON_CLASSES}
            />
          }
          label="담당자"
          value={data.contactName}
          active={active}
          revealed={revealed}
        />
        <FilledField
          icon={
            <Phone
              aria-hidden="true"
              className={FIELD_LABEL_ICON_CLASSES}
            />
          }
          label="연락처"
          value={data.contactPhone}
          active={active}
          revealed={revealed}
          monospace
        />
      </div>
    </section>
  )
}
