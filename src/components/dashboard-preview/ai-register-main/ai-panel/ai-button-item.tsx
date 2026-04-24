/**
 * AiButtonItem — 3 상태 AI 결과 버튼 (stateless).
 *
 * T-DASH3-M2-06 — 원본 `ai-button-item.tsx` (mm-broker) 의 3 상태 시각 + 조작감을
 * landing Phase 3 demo 용 stateless dumb component 로 복제.
 *
 * 정책 (Phase 3 스펙 §2-1 Dumb Components 원칙)
 *  - 실제 폼 적용(useAiApply), Popover/Tooltip 확인 UX, needsConfirm 상태 머신, revertable
 *    로직은 전부 제거. 3 상태 시각 + 조작감 #3/#4 통합만 담당.
 *  - `button.status` 로 pending / applied / unavailable 3 상태 시각 분기.
 *  - `pressTriggerAt` prop 으로 내부 `useButtonPress` 훅 자동 press 제어.
 *  - `useRipple` 훅을 내부에서 호출하여 클릭 시 wave 오버레이를 렌더.
 *
 * 3 상태 시각 (REQ-DASH3-003)
 *  - pending     : accent 테두리 + 흰 글자, 클릭 가능.
 *  - applied     : green 테두리 + lucide Check 아이콘, 클릭 가능 (취소/토글).
 *  - unavailable : 회색 fade + disabled, unavailableReason hint (optional).
 *
 * 조작감 (REQ-DASH3-021, REQ-DASH3-025)
 *  - #3 use-button-press : pressTriggerAt 도달 시 150ms scale(0.97) + shadow 축소.
 *  - #4 use-ripple       : 클릭 시 좌표 기반 wave 오버레이, 300ms 후 제거.
 *  - unavailable 상태에서는 두 훅 모두 비활성 (disabled button 이므로 click 이벤트 차단).
 *
 * 스타일 (REQ-DASH-005 landing 팔레트, T-THEME-09 토큰 치환)
 *  - pending     : `border-accent/40 text-accent bg-accent/5`.
 *  - applied     : `border-green-500/40 text-emerald-600 bg-green-500/10` (D-013 WCAG AA 승계; 원본: `text-green-400`).
 *  - unavailable : `opacity-50 bg-muted/30 text-muted-foreground/60 border-border` + `cursor-not-allowed` (원본: `bg-white/5 text-white/40 border-white/10`).
 *
 * 접근성 (REQ-DASH-007)
 *  - `<button type="button">` + `aria-label` (label + displayValue).
 *  - unavailable 시 `aria-disabled="true"` + `title={unavailableReason}` (native tooltip).
 *
 * @see REQ-DASH3-003 (AiPanel 컴포넌트 복제 매니페스트)
 * @see REQ-DASH3-021 (#3 조작감 — 버튼 press)
 * @see REQ-DASH3-025 (#4 조작감 — 클릭 ripple wave)
 * @see TC-DASH3-UNIT-BTNITM
 */

'use client'

import { useEffect } from 'react'
import { Check } from 'lucide-react'

import { useButtonPress } from '@/components/dashboard-preview/interactions/use-button-press'
import { useRipple } from '@/components/dashboard-preview/interactions/use-ripple'
import { useTriggerAt } from '@/components/dashboard-preview/interactions/use-trigger-at'
import type { AiCategoryButton, AiCategoryId } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AiButtonItemProps {
  readonly button: AiCategoryButton
  readonly groupId: AiCategoryId
  /** use-button-press 자동 press 트리거 (ms). null 또는 undefined 면 비활성. */
  readonly pressTriggerAt?: number | null
  /**
   * 자동 ripple 트리거 (ms) — M4-02 / REQ-DASH3-025.
   * AI_APPLY partialBeat 에서 해당 카테고리의 category × intervalMs offset 에 발동.
   * null/undefined 면 자동 ripple 비활성 (수동 클릭 ripple 만 동작).
   * unavailable 상태에서는 무시된다.
   */
  readonly rippleTriggerAt?: number | null
  /** 수동 클릭 시 호출되는 콜백. unavailable 상태에선 호출되지 않는다. */
  readonly onApply?: (buttonId: string) => void
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BASE_CLASSES =
  'relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ' +
  'max-w-full overflow-hidden ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
  'transition-colors'

const PENDING_CLASSES =
  'border border-accent/40 text-accent bg-accent/5 hover:bg-accent/10 cursor-pointer'

const APPLIED_CLASSES =
  'border border-green-500/40 text-emerald-600 bg-green-500/10 hover:bg-green-500/15 cursor-pointer'

const UNAVAILABLE_CLASSES =
  'border border-border bg-muted/30 text-muted-foreground/60 opacity-50 cursor-not-allowed'

const RIPPLE_SIZE_PX = 120

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function AiButtonItem({
  button,
  groupId,
  pressTriggerAt = null,
  rippleTriggerAt = null,
  onApply,
}: AiButtonItemProps) {
  const { id, label, displayValue, status, unavailableReason } = button

  const isPending = status === 'pending'
  const isApplied = status === 'applied'
  const isUnavailable = status === 'unavailable'

  const { pressed, handlers, pressStyle } = useButtonPress({
    triggerAt: isUnavailable ? null : pressTriggerAt ?? null,
    pressDurationMs: 150,
  })
  const { ripples, trigger: triggerRipple, triggerCenter: triggerCenterRipple } =
    useRipple({ durationMs: 300 })

  // M4-02 — rippleTriggerAt 기반 자동 센터 ripple.
  // unavailable 이면 항상 비활성. active 는 pending/applied 양쪽 모두 허용.
  const autoRippleFired = useTriggerAt({
    active: !isUnavailable,
    triggerAt: isUnavailable ? null : rippleTriggerAt ?? null,
  })

  useEffect(() => {
    if (autoRippleFired) {
      // jsdom 환경 대응: getBoundingClientRect 가 0 이므로 size 생략.
      // 실제 브라우저에서는 centered ripple 의 절대 좌표 정확도가 크게 중요하지 않다
      // (button width/height 의 중심은 대략 1:1 비율이며, RIPPLE_SIZE_PX=120 이 오버랩 커버).
      triggerCenterRipple()
    }
  }, [autoRippleFired, triggerCenterRipple])

  const ariaLabel = displayValue ? `${label} — ${displayValue}` : label

  return (
    <div className="flex flex-col gap-1 max-w-full">
      <button
        type="button"
        data-testid={`ai-button-item-${id}`}
        data-field-key={button.fieldKey}
        data-status={status}
        data-group-id={groupId}
        data-pressed={pressed}
        aria-label={ariaLabel}
        aria-disabled={isUnavailable || undefined}
        title={isUnavailable ? unavailableReason : undefined}
        disabled={isUnavailable}
        onClick={(event) => {
          if (isUnavailable) return
          triggerRipple(event)
          onApply?.(id)
        }}
        onMouseDown={isUnavailable ? undefined : handlers.onMouseDown}
        onMouseUp={isUnavailable ? undefined : handlers.onMouseUp}
        onMouseLeave={isUnavailable ? undefined : handlers.onMouseLeave}
        className={cn(
          BASE_CLASSES,
          isPending && PENDING_CLASSES,
          isApplied && APPLIED_CLASSES,
          isUnavailable && UNAVAILABLE_CLASSES,
        )}
        style={isUnavailable ? undefined : pressStyle}
      >
        {isApplied ? (
          <Check className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
        ) : null}
        <span className="truncate font-semibold">{label}</span>
        {displayValue ? (
          <span className="truncate text-foreground/80">{displayValue}</span>
        ) : null}

        {/* #4 ripple wave 오버레이 */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            data-ripple
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full bg-foreground/30 animate-ping"
            style={{
              left: ripple.x - RIPPLE_SIZE_PX / 2,
              top: ripple.y - RIPPLE_SIZE_PX / 2,
              width: RIPPLE_SIZE_PX,
              height: RIPPLE_SIZE_PX,
            }}
          />
        ))}
      </button>

      {isUnavailable && unavailableReason ? (
        <span
          data-testid={`ai-button-item-reason-${id}`}
          className="text-[10px] text-muted-foreground px-1 truncate"
        >
          {unavailableReason}
        </span>
      ) : null}
    </div>
  )
}
