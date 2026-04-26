'use client'

import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { PREVIEW_MOCK_DATA } from '@/lib/mock-data'
import type { HitAreaBounds, HitAreaConfig } from './hit-areas'
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

type BoundsById = Readonly<Record<string, HitAreaBounds>>

function scaleBounds(bounds: HitAreaBounds, scaleFactor: number): HitAreaBounds {
  return {
    x: bounds.x * scaleFactor,
    y: bounds.y * scaleFactor,
    width: bounds.width * scaleFactor,
    height: bounds.height * scaleFactor,
  }
}

function getTransformScale(
  overlay: HTMLDivElement,
  overlayRect: DOMRect,
): { scaleX: number; scaleY: number } {
  const scaleX =
    overlay.offsetWidth > 0 && overlayRect.width > 0
      ? overlayRect.width / overlay.offsetWidth
      : 1
  const scaleY =
    overlay.offsetHeight > 0 && overlayRect.height > 0
      ? overlayRect.height / overlay.offsetHeight
      : scaleX

  return { scaleX, scaleY }
}

function toOverlayBounds(
  targetRect: DOMRect,
  overlayRect: DOMRect,
  scale: { scaleX: number; scaleY: number },
): HitAreaBounds {
  return {
    x: (targetRect.left - overlayRect.left) / scale.scaleX,
    y: (targetRect.top - overlayRect.top) / scale.scaleY,
    width: targetRect.width / scale.scaleX,
    height: targetRect.height / scale.scaleY,
  }
}

function areBoundsEqual(a: HitAreaBounds, b: HitAreaBounds): boolean {
  return (
    a.x === b.x &&
    a.y === b.y &&
    a.width === b.width &&
    a.height === b.height
  )
}

function areBoundsMapsEqual(a: BoundsById | null, b: BoundsById): boolean {
  if (a === null) return false

  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) return false

  return aKeys.every((key) => b[key] !== undefined && areBoundsEqual(a[key], b[key]))
}

/**
 * Phase 2 인터랙티브 모드의 투명 오버레이 (REQ-DASH-043).
 *
 * - 축소 뷰 위에 `position: absolute; inset: 0` 로 겹침
 * - 컨테이너는 `pointer-events-none` — 축소 뷰의 일반 흐름을 방해하지 않는다
 * - 각 HitArea button은 `pointer-events-auto` — 개별 영역에서만 클릭 수신
 * - 실제 DOM target이 있으면 DOMRect를 overlay 좌표로 변환
 * - DOM target이 없으면 원본 좌표(bounds)에 `scaleFactor`를 곱해 fallback 렌더링
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
  const overlayRef = useRef<HTMLDivElement>(null)
  const [measuredBounds, setMeasuredBounds] = useState<BoundsById | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const tooltips = PREVIEW_MOCK_DATA.tooltips

  const measureHitAreas = useCallback(() => {
    const overlay = overlayRef.current
    const root = overlay?.parentElement
    if (!overlay || !root) return

    const overlayRect = overlay.getBoundingClientRect()
    const scale = getTransformScale(overlay, overlayRect)
    const nextBounds: Record<string, HitAreaBounds> = {}

    for (const area of hitAreas) {
      const target = root.querySelector<HTMLElement>(
        `[data-hit-area-id="${area.id}"]`,
      )
      if (!target) continue

      nextBounds[area.id] = toOverlayBounds(
        target.getBoundingClientRect(),
        overlayRect,
        scale,
      )
    }

    setMeasuredBounds((current) =>
      areBoundsMapsEqual(current, nextBounds) ? current : nextBounds,
    )
  }, [hitAreas])

  useLayoutEffect(() => {
    measureHitAreas()

    const overlay = overlayRef.current
    const root = overlay?.parentElement
    if (!overlay || !root) return

    const animationFrameId =
      typeof window.requestAnimationFrame === 'function'
        ? window.requestAnimationFrame(measureHitAreas)
        : null

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => measureHitAreas())

    resizeObserver?.observe(root)
    resizeObserver?.observe(overlay)

    for (const area of hitAreas) {
      const target = root.querySelector<HTMLElement>(
        `[data-hit-area-id="${area.id}"]`,
      )
      if (target) {
        resizeObserver?.observe(target)
      }
    }

    window.addEventListener('resize', measureHitAreas)
    return () => {
      if (
        animationFrameId !== null &&
        typeof window.cancelAnimationFrame === 'function'
      ) {
        window.cancelAnimationFrame(animationFrameId)
      }
      resizeObserver?.disconnect()
      window.removeEventListener('resize', measureHitAreas)
    }
  }, [hitAreas, measureHitAreas])

  // hover가 우선권을 갖되, 없으면 focus된 영역이 툴팁/하이라이트를 구동한다.
  const activeId = hoveredId ?? focusedId
  const activeArea =
    activeId !== null
      ? hitAreas.find((area) => area.id === activeId) ?? null
      : null

  const handleMouseEnter = (id: string) => {
    measureHitAreas()
    setHoveredId(id)
  }

  const handleMouseLeave = () => {
    setHoveredId(null)
  }

  const handleFocus = (id: string) => {
    measureHitAreas()
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

  const isMeasurementReady = measuredBounds !== null

  return (
    <div
      ref={overlayRef}
      data-testid="interactive-overlay"
      className={cn('absolute inset-0 pointer-events-none', className)}
      role="region"
      aria-label="AI 화물 등록 데모 체험 영역"
    >
      {isMeasurementReady &&
        hitAreas.map((area) => {
          const isHighlighted =
            hoveredId === area.id || focusedId === area.id
          const enabled = computeEnabled(area)
          const bounds =
            measuredBounds[area.id] ?? scaleBounds(area.bounds, scaleFactor)

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
                left: `${bounds.x}px`,
                top: `${bounds.y}px`,
                width: `${bounds.width}px`,
                height: `${bounds.height}px`,
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

      {isMeasurementReady && activeArea !== null && (
        <InteractiveTooltip
          text={tooltips[activeArea.tooltipKey]}
          anchorBounds={
            measuredBounds[activeArea.id] ??
            scaleBounds(activeArea.bounds, scaleFactor)
          }
        />
      )}
    </div>
  )
}
