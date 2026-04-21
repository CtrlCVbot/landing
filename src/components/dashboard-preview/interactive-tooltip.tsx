'use client'

import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface InteractiveTooltipProps {
  readonly text: string
  readonly anchorBounds: {
    readonly x: number
    readonly y: number
    readonly width: number
    readonly height: number
  }
  readonly className?: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * 뷰포트 상단 근접 경계값.
 * anchor.y > VIEWPORT_EDGE_THRESHOLD → 툴팁을 anchor 위쪽에 배치.
 * anchor.y ≤ VIEWPORT_EDGE_THRESHOLD → 툴팁을 anchor 아래쪽에 배치 (짤림 방지).
 */
const VIEWPORT_EDGE_THRESHOLD = 50

/**
 * anchor 위쪽 배치 시 툴팁과 anchor 사이 gap (툴팁 높이 + 여백 포함 추정치).
 */
const TOOLTIP_OFFSET_ABOVE = 40

/**
 * anchor 아래쪽 배치 시 툴팁과 anchor 사이 gap.
 */
const TOOLTIP_OFFSET_BELOW = 8

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * 히트 영역 hover 시 표시되는 설명 툴팁 (REQ-DASH-038, REQ-DASH-042).
 *
 * - 원본 크기 14px 텍스트 (`text-sm`) — 축소 뷰 위에 렌더링되므로 scale 영향 없음
 * - `bg-gray-900/90` 반투명 어두운 배경, `rounded-md px-3 py-2` 패딩
 * - `max-w-[280px]` 텍스트 줄바꿈 허용
 * - `pointer-events-none` — 밑의 HitArea hover 상태를 방해하지 않음
 *
 * 배치 규칙:
 * - 기본: anchor 위쪽 (`y - 40`)
 * - anchor가 뷰포트 상단 근접 (`y <= 50`)인 경우: 아래쪽 (`y + height + 8`)
 * - 좌우 정렬: anchor 가로 중앙 (`x + width/2`) + `-translate-x-1/2`
 */
export function InteractiveTooltip({
  text,
  anchorBounds,
  className,
}: InteractiveTooltipProps) {
  const placeAbove = anchorBounds.y > VIEWPORT_EDGE_THRESHOLD
  const top = placeAbove
    ? anchorBounds.y - TOOLTIP_OFFSET_ABOVE
    : anchorBounds.y + anchorBounds.height + TOOLTIP_OFFSET_BELOW
  const left = anchorBounds.x + anchorBounds.width / 2

  return (
    <div
      data-testid="interactive-tooltip"
      role="tooltip"
      className={cn(
        'absolute z-10 pointer-events-none bg-gray-900/90 text-white text-sm rounded-md px-3 py-2 max-w-[280px] -translate-x-1/2',
        className,
      )}
      style={{
        top: `${top}px`,
        left: `${left}px`,
      }}
    >
      {text}
    </div>
  )
}
