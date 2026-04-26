import type { PreviewMockData } from '@/lib/mock-data'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * HitArea 논리적 선행 조건 (REQ-DASH-041).
 * - 'input-has-text': AI 입력 영역에 텍스트가 있을 때만 활성
 * - 'extracted': AI 추출이 완료된 이후에만 활성
 * - undefined: 항상 활성 (logicalDependency 기준)
 *
 * 논리 조건과는 별개로 `isEnabled=false` 는 영구 비활성 (pre-filled 등).
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
  /**
   * #11 company-manager 처럼 pre-filled/읽기 전용인 영역을 영구 비활성 표시.
   * false → interactive-overlay 가 클릭/Enter/Space 실행을 차단한다 (tooltip 은 유지).
   * undefined/true → 활성 (기본값).
   */
  readonly isEnabled?: boolean
}

export type Viewport = 'desktop' | 'tablet'

// ---------------------------------------------------------------------------
// Phase 3 Hit Areas — 19 영역 (REQ-DASH3-037 / T-DASH3-M4-04)
// ---------------------------------------------------------------------------
//
// 레이아웃 가정 (scale 역변환 전 원본 좌표)
//  - 외곽 chrome 을 제외한 콘텐츠 영역: 1440 × 900 px
//  - AiPanel:  좌측 380px 고정, y 16~884
//  - OrderForm: 우측 flex-1 (≈1060px), 3-column grid (col 350px × 3 + gap)
//    * Col 1: x 396 ~ 746  (pickup/delivery 입력 중심)
//    * Col 2: x 766 ~ 1116 (distance + datetime 2열 + cargo)
//    * Col 3: x 1136 ~ 1486 (options/estimate/settlement/auto-dispatch)
//  - F4: DateTimeCard 2개를 Col 2 내부 2열(164px + 16px gap + 164px)로 재정렬.
//
// Tablet 축약은 폐기되어 getHitAreas('tablet') 도 동일 18 영역 반환 (M4-04 + F5).
// 각 영역은 원본 좌표 기준 44×44 이상을 만족한다 (REQ-DASH-044).

export const DESKTOP_HIT_AREAS: ReadonlyArray<HitAreaConfig> = [
  // =========================================================================
  // AiPanel (좌측 380px) — 8 영역
  // =========================================================================
  {
    id: 'ai-tab-bar',
    bounds: { x: 16, y: 16, width: 348, height: 44 },
    tooltipKey: 'ai-tab-bar',
  },
  {
    id: 'ai-input',
    bounds: { x: 16, y: 70, width: 348, height: 140 },
    tooltipKey: 'ai-input',
  },
  {
    id: 'ai-extract-button',
    bounds: { x: 16, y: 220, width: 348, height: 44 },
    tooltipKey: 'ai-extract-button',
    logicalDependency: 'input-has-text',
  },
  {
    id: 'ai-result-departure',
    bounds: { x: 16, y: 274, width: 348, height: 68 },
    tooltipKey: 'result-departure',
    logicalDependency: 'extracted',
  },
  {
    id: 'ai-result-destination',
    bounds: { x: 16, y: 350, width: 348, height: 68 },
    tooltipKey: 'result-destination',
    logicalDependency: 'extracted',
  },
  {
    id: 'ai-result-cargo',
    bounds: { x: 16, y: 426, width: 348, height: 68 },
    tooltipKey: 'result-cargo',
    logicalDependency: 'extracted',
  },
  {
    id: 'ai-result-fare',
    bounds: { x: 16, y: 502, width: 348, height: 68 },
    tooltipKey: 'result-fare',
    logicalDependency: 'extracted',
  },

  // =========================================================================
  // OrderForm Col 1 (x 396~746) — Company + Pickup/Delivery Location
  // =========================================================================
  {
    id: 'form-company-manager',
    bounds: { x: 396, y: 16, width: 344, height: 76 },
    tooltipKey: 'company-manager',
    // #11 — pre-filled 읽기 전용. click/Enter 실행 차단, hover 툴팁은 유지.
    isEnabled: false,
  },
  {
    id: 'form-pickup-location',
    bounds: { x: 396, y: 106, width: 344, height: 160 },
    tooltipKey: 'pickup-location',
  },
  {
    id: 'form-delivery-location',
    bounds: { x: 396, y: 280, width: 344, height: 160 },
    tooltipKey: 'delivery-location',
  },

  // =========================================================================
  // OrderForm Col 2 (x 766~1116) — Distance + Pickup/Delivery DateTime + Cargo
  // =========================================================================
  {
    id: 'form-estimate-distance',
    bounds: { x: 766, y: 16, width: 344, height: 76 },
    tooltipKey: 'estimate-info',
  },
  {
    id: 'form-pickup-datetime',
    bounds: { x: 766, y: 106, width: 164, height: 96 },
    tooltipKey: 'pickup-datetime',
  },
  {
    id: 'form-delivery-datetime',
    bounds: { x: 946, y: 106, width: 164, height: 96 },
    tooltipKey: 'delivery-datetime',
  },
  {
    id: 'form-cargo-info',
    bounds: { x: 766, y: 214, width: 344, height: 200 },
    tooltipKey: 'cargo-info',
  },

  // =========================================================================
  // OrderForm Col 3 (x 1136~1486) — Transport Options + Estimate + Settlement + Auto-dispatch
  // =========================================================================
  {
    id: 'form-transport-options',
    bounds: { x: 1136, y: 16, width: 344, height: 180 },
    tooltipKey: 'transport-options',
  },
  {
    id: 'form-estimate-info',
    bounds: { x: 1136, y: 208, width: 344, height: 140 },
    tooltipKey: 'estimate-info',
  },
  {
    id: 'form-settlement',
    bounds: { x: 1136, y: 360, width: 344, height: 120 },
    tooltipKey: 'settlement',
  },
  {
    id: 'form-auto-dispatch',
    bounds: { x: 1136, y: 492, width: 344, height: 56 },
    tooltipKey: 'auto-dispatch',
  },
] as const

/**
 * Tablet 축약 폐기 — Desktop 과 동일 18 영역을 반환 (M4-04 / REQ-DASH3-037 + F5).
 * Tablet 에서도 3-col grid 전체가 스케일 축소된 형태로 렌더되므로 동일 hit 영역을 사용한다.
 * 최소 크기는 `getMinSize('tablet')` 가 scaleFactor 0.40 기준으로 계산한다.
 */
export const TABLET_HIT_AREAS: ReadonlyArray<HitAreaConfig> = DESKTOP_HIT_AREAS

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

/**
 * viewport 별 히트 영역 조회 (Phase 3: Desktop=Tablet 동일 19 영역).
 */
export function getHitAreas(
  viewport: Viewport,
): ReadonlyArray<HitAreaConfig> {
  return viewport === 'tablet' ? TABLET_HIT_AREAS : DESKTOP_HIT_AREAS
}

/**
 * viewport 별 축소 후 최소 히트 영역 크기 (REQ-DASH-047).
 *
 * Phase 3 기준:
 *  - Desktop (scaleFactor 0.45): 44 * 0.45 = 19.8 → 20px
 *  - Tablet  (scaleFactor 0.40): 44 * 0.40 = 17.6 → 18px  (0.38→0.40 상향, M1-04)
 */
export function getMinSize(viewport: Viewport): number {
  return viewport === 'tablet' ? 18 : 20
}
