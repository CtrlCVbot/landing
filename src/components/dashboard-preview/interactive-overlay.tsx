'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { PREVIEW_MOCK_DATA } from '@/lib/mock-data'
import type { HitAreaConfig } from './hit-areas'
import { InteractiveTooltip } from './interactive-tooltip'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface InteractiveOverlayProps {
  readonly hitAreas: ReadonlyArray<HitAreaConfig>
  readonly scaleFactor: number
  /**
   * 클릭 시 호출되는 콜백 (REQ-DASH-039, REQ-DASH-040).
   * 호출자는 id에 따라 mock 기능을 실행한다.
   */
  readonly onAreaExecute?: (areaId: string) => void
  /**
   * 영역별 활성 여부 판정 (REQ-DASH-041).
   * 반환값 false이면 클릭해도 onAreaExecute가 호출되지 않는다.
   * 생략 시 모든 영역이 활성으로 간주된다.
   */
  readonly isAreaEnabled?: (area: HitAreaConfig) => boolean
  readonly className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Phase 2 인터랙티브 모드의 투명 오버레이 (REQ-DASH-043).
 *
 * - 축소 뷰 위에 `position: absolute; inset: 0` 로 겹침
 * - 컨테이너는 `pointer-events-none` — 축소 뷰의 일반 흐름을 방해하지 않는다
 * - 각 HitArea button은 `pointer-events-auto` — 개별 영역에서만 클릭 수신
 * - 원본 좌표(bounds)는 `scaleFactor`를 곱해 화면 좌표로 변환
 *
 * Hover/클릭 동작 (REQ-DASH-036, REQ-DASH-038, REQ-DASH-039):
 * - mouseEnter → `ring-2 ring-purple-500` 하이라이트 + `InteractiveTooltip` 표시
 * - mouseLeave → 하이라이트/툴팁 제거
 * - click → 활성 상태일 때만 `onAreaExecute(area.id)` 호출
 *
 * 키보드 접근성 (REQ-DASH-048, REQ-DASH-049, REQ-DASH-050):
 * - Tab 키로 각 HitArea 순차 탐색 (native button + tabIndex={0})
 * - focus → hover와 동일한 `ring-2 ring-purple-500` 하이라이트 + 툴팁 표시
 * - Enter/Space 키 → `onAreaExecute(area.id)` 호출 (aria-disabled 시 무시)
 * - focus-visible 전용 오프셋 ring 으로 키보드 포커스 강조 (마우스 클릭 시엔 hover 스타일만)
 *
 * 접근성 (REQ-DASH-042):
 * - 각 button의 `aria-label`은 `tooltips[tooltipKey]` — 툴팁 미표시 시에도 스크린리더 접근 가능
 * - `aria-disabled`로 논리적 비활성 상태 표시
 */
export function InteractiveOverlay({
  hitAreas,
  scaleFactor,
  onAreaExecute,
  isAreaEnabled,
  className,
}: InteractiveOverlayProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const tooltips = PREVIEW_MOCK_DATA.tooltips

  // hover가 우선권을 갖되, 없으면 focus된 영역이 툴팁/하이라이트를 구동한다.
  const activeId = hoveredId ?? focusedId
  const activeArea =
    activeId !== null
      ? hitAreas.find((area) => area.id === activeId) ?? null
      : null

  const handleMouseEnter = (id: string) => {
    setHoveredId(id)
  }

  const handleMouseLeave = () => {
    setHoveredId(null)
  }

  const handleFocus = (id: string) => {
    setFocusedId(id)
  }

  const handleBlur = () => {
    setFocusedId(null)
  }

  /**
   * 영역 실행 가능 여부.
   *  - `area.isEnabled === false` → 영구 비활성 (#11 company-manager, M4-04).
   *  - `isAreaEnabled` prop 이 있으면 논리 조건(AI_INPUT 텍스트 유무 등) 추가 검증.
   *  - 두 조건 모두 통과해야 onAreaExecute 호출.
   */
  const computeEnabled = (area: HitAreaConfig): boolean => {
    if (area.isEnabled === false) return false
    if (isAreaEnabled) return isAreaEnabled(area)
    return true
  }

  const handleExecute = (area: HitAreaConfig) => {
    if (computeEnabled(area) && onAreaExecute) {
      onAreaExecute(area.id)
    }
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    area: HitAreaConfig,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleExecute(area)
    }
  }

  return (
    <div
      data-testid="interactive-overlay"
      className={cn('absolute inset-0 pointer-events-none', className)}
      role="region"
      aria-label="AI 화물 등록 데모 체험 영역"
    >
      {hitAreas.map((area) => {
        const isHighlighted =
          hoveredId === area.id || focusedId === area.id
        const enabled = computeEnabled(area)
        return (
          <button
            key={area.id}
            data-testid={`hit-area-${area.id}`}
            data-area-id={area.id}
            type="button"
            aria-label={tooltips[area.tooltipKey]}
            aria-disabled={!enabled}
            className={cn(
              'absolute pointer-events-auto transition-all duration-200 rounded',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1',
              enabled ? 'cursor-pointer' : 'cursor-not-allowed',
              isHighlighted && 'ring-2 ring-purple-500',
            )}
            style={{
              left: `${area.bounds.x * scaleFactor}px`,
              top: `${area.bounds.y * scaleFactor}px`,
              width: `${area.bounds.width * scaleFactor}px`,
              height: `${area.bounds.height * scaleFactor}px`,
            }}
            onMouseEnter={() => handleMouseEnter(area.id)}
            onMouseLeave={handleMouseLeave}
            onFocus={() => handleFocus(area.id)}
            onBlur={handleBlur}
            onClick={() => handleExecute(area)}
            onKeyDown={(event) => handleKeyDown(event, area)}
          />
        )
      })}

      {activeArea !== null && (
        <InteractiveTooltip
          text={tooltips[activeArea.tooltipKey]}
          anchorBounds={{
            x: activeArea.bounds.x * scaleFactor,
            y: activeArea.bounds.y * scaleFactor,
            width: activeArea.bounds.width * scaleFactor,
            height: activeArea.bounds.height * scaleFactor,
          }}
        />
      )}
    </div>
  )
}
