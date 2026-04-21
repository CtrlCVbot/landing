/**
 * @spike T-DASH3-SPIKE-01 — 종료 시 이관 or 폐기
 *
 * 원본: `.references/code/mm-broker/.../ai-input-area.tsx` 내 "추출하기" Button 부분.
 *
 * Spike 범위:
 * - 단일 primary 버튼 ("추출하기" / "추출 중...")
 * - `use-button-press` 연동 (triggerAt / 수동 모드 둘 다 지원)
 * - loading 상태: 작은 CSS spinner (lucide-react 미사용)
 * - shadcn Button 미의존 — native button + className
 */

'use client'

import type { CSSProperties } from 'react'

import { useButtonPress } from '@/components/dashboard-preview/interactions/use-button-press'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface AiExtractButtonSpikeProps {
  /** 수동 클릭 콜백 (선택) */
  readonly onPress?: () => void
  /** 로딩 상태 */
  readonly loading?: boolean
  /** 외부에서 강제로 pressed 상태 반영 (Spike 자동 재생) */
  readonly pressed?: boolean
  /** use-button-press 자동 트리거 offset (ms). null/undefined 면 비활성 */
  readonly autoPressAt?: number | null
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AiExtractButtonSpike({
  onPress,
  loading = false,
  pressed,
  autoPressAt = null,
}: AiExtractButtonSpikeProps) {
  const { pressed: hookPressed, handlers, pressStyle } = useButtonPress({
    triggerAt: autoPressAt,
  })

  const isPressed = pressed ?? hookPressed

  const style: CSSProperties = {
    ...pressStyle,
    // pressed prop 으로 강제 제어 시 hook 의 style 을 덮어쓴다
    ...(pressed === true
      ? { transform: 'scale(0.97)', boxShadow: '0 0 0 rgba(0,0,0,0)' }
      : {}),
    ...(pressed === false
      ? { transform: 'scale(1)', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }
      : {}),
  }

  return (
    <button
      type="button"
      aria-label={loading ? 'AI 추출 진행 중' : 'AI 추출하기'}
      aria-pressed={isPressed}
      data-pressed={isPressed}
      onClick={onPress}
      onMouseDown={handlers.onMouseDown}
      onMouseUp={handlers.onMouseUp}
      onMouseLeave={handlers.onMouseLeave}
      disabled={loading}
      style={style}
      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed data-[pressed=true]:shadow-inner"
    >
      {loading ? (
        <>
          <SpikeSpinner />
          <span>추출 중...</span>
        </>
      ) : (
        <span>추출하기</span>
      )}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Inline spinner (no external deps)
// ---------------------------------------------------------------------------

function SpikeSpinner() {
  return (
    <>
      <span
        className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white spike-spinner"
        aria-hidden="true"
      />
      <style jsx>{`
        .spike-spinner {
          animation: spike-spin 0.8s linear infinite;
        }
        @keyframes spike-spin {
          to {
            transform: rotate(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .spike-spinner {
            animation: none;
          }
        }
      `}</style>
    </>
  )
}
