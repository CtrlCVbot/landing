import type { PreviewMockData } from '@/lib/mock-data'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * HitArea 논리적 선행 조건 (REQ-DASH-041).
 * - 'input-has-text': AI 입력 영역에 텍스트가 있을 때만 활성
 * - 'extracted': AI 추출이 완료된 이후에만 활성
 * - undefined: 항상 활성
 */
export type HitAreaDependency = 'input-has-text' | 'extracted'

export interface HitAreaBounds {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export interface HitAreaConfig {
  readonly id: string
  readonly bounds: HitAreaBounds
  readonly tooltipKey: keyof PreviewMockData['tooltips']
  readonly logicalDependency?: HitAreaDependency
}

export type Viewport = 'desktop' | 'tablet'

// ---------------------------------------------------------------------------
// Hit area definitions
// ---------------------------------------------------------------------------

/**
 * Desktop 히트 영역 11개 (REQ-DASH-037).
 * 원본 좌표 (scale 역변환 전 기준).
 * 각 영역은 최소 44x44px (REQ-DASH-044).
 *
 * 레이아웃:
 * - AiPanel 좌측 약 380px: 1~6번 영역
 * - FormPreview 우측 flex-1 약 480px: 7~11번 영역
 */
export const DESKTOP_HIT_AREAS: ReadonlyArray<HitAreaConfig> = [
  // AiPanel (좌측 380px)
  {
    id: 'ai-input',
    bounds: { x: 16, y: 60, width: 348, height: 140 },
    tooltipKey: 'ai-input',
  },
  {
    id: 'extract-button',
    bounds: { x: 16, y: 210, width: 348, height: 44 },
    tooltipKey: 'extract-button',
    logicalDependency: 'input-has-text',
  },
  {
    id: 'result-departure',
    bounds: { x: 16, y: 280, width: 348, height: 72 },
    tooltipKey: 'result-departure',
    logicalDependency: 'extracted',
  },
  {
    id: 'result-destination',
    bounds: { x: 16, y: 360, width: 348, height: 72 },
    tooltipKey: 'result-destination',
    logicalDependency: 'extracted',
  },
  {
    id: 'result-cargo',
    bounds: { x: 16, y: 440, width: 348, height: 72 },
    tooltipKey: 'result-cargo',
    logicalDependency: 'extracted',
  },
  {
    id: 'result-fare',
    bounds: { x: 16, y: 520, width: 348, height: 72 },
    tooltipKey: 'result-fare',
    logicalDependency: 'extracted',
  },
  // FormPreview (우측 flex-1 약 480px)
  {
    id: 'form-cargo-info',
    bounds: { x: 396, y: 16, width: 480, height: 120 },
    tooltipKey: 'cargo-info',
  },
  {
    id: 'form-location-departure',
    bounds: { x: 396, y: 150, width: 480, height: 140 },
    tooltipKey: 'location-departure',
  },
  {
    id: 'form-location-destination',
    bounds: { x: 396, y: 304, width: 480, height: 140 },
    tooltipKey: 'location-destination',
  },
  {
    id: 'form-transport-options',
    bounds: { x: 396, y: 458, width: 480, height: 80 },
    tooltipKey: 'transport-options',
  },
  {
    id: 'form-estimate',
    bounds: { x: 396, y: 552, width: 480, height: 80 },
    tooltipKey: 'estimate-info',
  },
] as const

/**
 * Tablet 히트 영역 6개 (REQ-DASH-046).
 * Desktop 영역의 앞 6개 (AiPanel 영역만 유지 — AiInput, ExtractButton, AiResult 4개).
 */
export const TABLET_HIT_AREAS: ReadonlyArray<HitAreaConfig> =
  DESKTOP_HIT_AREAS.slice(0, 6)

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

/**
 * viewport 별 히트 영역 조회.
 *
 * @param viewport 'desktop' | 'tablet'
 * @returns Desktop 11개 | Tablet 6개
 */
export function getHitAreas(
  viewport: Viewport,
): ReadonlyArray<HitAreaConfig> {
  return viewport === 'tablet' ? TABLET_HIT_AREAS : DESKTOP_HIT_AREAS
}

/**
 * viewport 별 축소 후 최소 히트 영역 크기 (REQ-DASH-047).
 *
 * - Desktop (scaleFactor 0.45): 44 * 0.45 = 19.8 → 20px
 * - Tablet (scaleFactor 0.38): 44 * 0.38 = 16.72 → 16px
 *
 * @param viewport 'desktop' | 'tablet'
 * @returns 축소 후 최소 픽셀 크기
 */
export function getMinSize(viewport: Viewport): number {
  return viewport === 'tablet' ? 16 : 20
}
