/**
 * AiExtractButton — "추출하기" / "추출 중..." / "재추출" 3 상태 버튼 (stateless).
 *
 * T-DASH3-M2-04 — 원본 `ai-input-area.tsx` (mm-broker) 의 추출/로딩 버튼 영역을
 * landing Phase 3 demo 용 stateless dumb component 로 복제.
 *
 * 정책 (Phase 3 스펙 §2-1 Dumb Components 원칙)
 *  - 실제 추출 API, 폼 검증, Toast, ExtractState 상태 머신 로직은 전부 제거.
 *  - `state` prop 으로 idle / loading / resultReady 3 상태 시각 표현만 담당.
 *  - `pressTriggerAt` prop 을 받아 내부에서 `useButtonPress` 훅을 호출하여 자동
 *    press scale 애니메이션을 수행한다 (Dumb Components 원칙을 유지하기 위해
 *    상위에서 trigger 시각만 내려준다).
 *
 * #3 조작감 (REQ-DASH3-021)
 *  - pressTriggerAt 도달 시 150ms 동안 scale(0.97) + shadow 축소.
 *  - data-pressed 속성으로 현재 press 상태를 노출 (테스트/스타일링 용).
 *
 * 스타일 (REQ-DASH-005 landing 팔레트, T-THEME-09 토큰 치환)
 *  - idle:    gradient `from-purple-600 to-blue-600` + 흰 글자 (D-010 브랜드 고정 예외).
 *  - loading: 버튼은 disabled + spinner (border-white/30 border-t-white — gradient 배경 brand-contrast 예외로 유지).
 *  - resultReady: "재추출" label + disabled (spike demo 상 실제 재시도 차단).
 *  - focus-visible: `focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:ring-offset-background` (원본: `ring-white/60` / `ring-offset-black/40`).
 *
 * @see REQ-DASH3-003 (AiPanel 컴포넌트 복제 매니페스트)
 * @see REQ-DASH3-021 (#3 조작감 — 버튼 press)
 * @see TC-DASH3-UNIT-EXTRBTN
 * @see TC-DASH3-UNIT-PRESS
 */

'use client'

import { useButtonPress } from '@/components/dashboard-preview/interactions/use-button-press'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AiExtractButtonState = 'idle' | 'loading' | 'resultReady'

export interface AiExtractButtonProps {
  /** aiResult.extractState 에 매핑. */
  readonly state: AiExtractButtonState
  /** use-button-press 자동 press 트리거 (ms). null 또는 undefined 면 비활성. */
  readonly pressTriggerAt?: number | null
  /**
   * #2 focus-walk 대상 여부 (M4-01 / REQ-DASH3-021).
   * true 일 때 `data-focus-active="true"` + accent ring 스타일.
   */
  readonly focused?: boolean
  /** 수동 클릭 시 호출되는 콜백 (데모 시각용 optional). idle 상태에서만 호출. */
  readonly onPress?: () => void
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BASE_CLASSES =
  'w-full h-10 rounded-lg text-sm font-semibold text-white ' +
  'bg-gradient-to-r from-purple-600 to-blue-600 ' +
  'flex items-center justify-center gap-2 ' +
  'transition-opacity duration-150 ' +
  'disabled:opacity-60 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background'

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function AiExtractButton({
  state,
  pressTriggerAt = null,
  focused = false,
  onPress,
}: AiExtractButtonProps) {
  const { pressed, handlers, pressStyle } = useButtonPress({
    triggerAt: pressTriggerAt ?? null,
    pressDurationMs: 150,
  })

  const isIdle = state === 'idle'
  const isLoading = state === 'loading'
  const isResultReady = state === 'resultReady'
  const disabled = isLoading || isResultReady

  const label = isLoading ? '추출 중...' : isResultReady ? '재추출' : '추출하기'

  // M4-01: focused=true 면 accent ring 스타일 추가 (base 의 focus-visible 과 구분되는 자동 focus walk 용).
  const focusedClasses = focused
    ? ' ring-2 ring-accent/70 ring-offset-2 ring-offset-background'
    : ''

  return (
    <button
      type="button"
      disabled={disabled}
      data-hit-area-id="ai-extract-button"
      data-pressed={pressed}
      data-state={state}
      data-focus-active={focused ? 'true' : 'false'}
      aria-label={label}
      onClick={() => {
        if (isIdle) {
          onPress?.()
        }
      }}
      onMouseDown={handlers.onMouseDown}
      onMouseUp={handlers.onMouseUp}
      onMouseLeave={handlers.onMouseLeave}
      className={BASE_CLASSES + focusedClasses}
      style={pressStyle}
    >
      {isLoading ? <LoadingSpinner /> : null}
      <span>{label}</span>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Loading Spinner — CSS-only
// ---------------------------------------------------------------------------

function LoadingSpinner() {
  return (
    <span
      data-testid="extract-spinner"
      aria-hidden="true"
      className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
    />
  )
}
