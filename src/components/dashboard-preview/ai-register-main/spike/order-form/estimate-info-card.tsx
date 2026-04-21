/**
 * @spike T-DASH3-SPIKE-01 — 종료 시 이관 or 폐기
 *
 * 원본: `.references/code/mm-broker/.../estimate-info-card.tsx`
 *
 * Spike 범위:
 * - 거리 / 소요 시간 / 운임 3개 수치 표시
 * - use-number-rolling 로 각 수치 애니메이션
 * - 자동 배차 토글 (시각 only, 정적 — 동작 없음)
 * - 원본의 "측정 전" / "협의" 분기 제거, active=true 시 숫자만 표시
 */

'use client'

import { useNumberRolling } from '@/components/dashboard-preview/interactions/use-number-rolling'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface EstimateInfoCardSpikeProps {
  /** 예상 거리 (km) */
  readonly distance: number
  /** 예상 소요 시간 (hour) */
  readonly duration: number
  /** 운임 (원) */
  readonly amount: number
  /** 롤링 활성 여부 (AI_APPLY step 에서만 true) */
  readonly active: boolean
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EstimateInfoCardSpike({
  distance,
  duration,
  amount,
  active,
}: EstimateInfoCardSpikeProps) {
  const rolledDistance = useNumberRolling(distance, { active, durationMs: 400 })
  const rolledDuration = useNumberRolling(duration, { active, durationMs: 400 })
  const rolledAmount = useNumberRolling(amount, { active, durationMs: 500 })

  const cardClassName = active
    ? 'p-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm ring-1 ring-accent/30 shadow-lg shadow-accent/10 transition-all'
    : 'p-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm opacity-60 transition-all'

  const amountClassName = active
    ? 'text-2xl font-bold tabular-nums bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'
    : 'text-2xl font-bold tabular-nums text-gray-500'

  const primaryNumberClassName = active
    ? 'text-2xl font-bold text-white tabular-nums'
    : 'text-2xl font-bold text-gray-500 tabular-nums'

  return (
    <div className={cardClassName}>
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-300">
          <span aria-hidden="true" className="text-accent">◆</span>
          운임 정보
        </h4>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">
          예상 견적
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <div>
          <div className="text-[11px] text-gray-400 mb-1">예상 거리</div>
          <div className={primaryNumberClassName}>
            {active ? rolledDistance.toLocaleString() : '—'}
            <span className="ml-1 text-xs font-normal text-gray-400">km</span>
          </div>
        </div>

        <div>
          <div className="text-[11px] text-gray-400 mb-1">소요</div>
          <div className={primaryNumberClassName}>
            {active ? rolledDuration.toLocaleString() : '—'}
            <span className="ml-1 text-xs font-normal text-gray-400">h</span>
          </div>
        </div>

        <div>
          <div className="text-[11px] text-gray-400 mb-1">운임</div>
          <div className={amountClassName}>
            {active ? rolledAmount.toLocaleString() : '—'}
            <span className="ml-1 text-xs font-normal text-gray-400">원</span>
          </div>
        </div>
      </div>

      {/* 자동 배차 토글 (정적) */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
        <label
          className="text-xs font-medium text-gray-300"
          htmlFor="spike-auto-dispatch"
        >
          자동 배차
        </label>
        <span
          id="spike-auto-dispatch"
          role="switch"
          aria-checked={true}
          aria-label="자동 배차 활성 (정적)"
          className="relative inline-block w-9 h-5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-inner shadow-black/40"
        >
          <span className="absolute top-0.5 left-[18px] w-4 h-4 rounded-full bg-white shadow-sm" />
        </span>
      </div>
    </div>
  )
}
