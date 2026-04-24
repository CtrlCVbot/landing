/**
 * EstimateDistanceInfo — Col 2 상단 예상 거리/소요 정적 info 카드.
 *
 * T-DASH3-M3-05 — 원본 `register-form.tsx` (mm-broker, L1143-1174) 의 LandPlot 아이콘 + 숫자 강조
 * 패턴만 landing Phase 3 demo 용으로 복제. Next.js Card/shadcn 연동 제거, stateless.
 *
 * 정책 (Phase 3 스펙 §2-1 Dumb Components 원칙)
 *  - 상위(`OrderFormContainer`) 에서 주입한 `distance`/`duration` 값을 그대로 표시.
 *  - `visible` prop 으로 AI_APPLY 이전/이후를 분기:
 *    - visible=true  (AI_APPLY 이후)  : distance/duration 수치 표시.
 *    - visible=false (INITIAL/AI_INPUT/AI_EXTRACT) : "측정 전" placeholder.
 *  - 레이아웃 유지를 위해 visible=false 에도 null 반환이 아닌 placeholder 로 자리 유지
 *    (Col 2 상단 예약 공간 — 상하 이동 방지).
 *
 * 스타일 (REQ-DASH-005 landing 팔레트, T-THEME-13 토큰 치환)
 *  - 카드: `bg-accent/5 border-accent/20 rounded-xl p-4` — "예상 결과" 속성의 약한 accent 강조.
 *  - 숫자: `font-bold text-foreground` (원본: text-white) — 수치 가독성.
 *  - 아이콘: lucide `Route` — mm-broker `LandPlot` 대비 landing 라이브러리와 톤 일치.
 *
 * 접근성 (REQ-DASH-007)
 *  - `<section role="region" aria-label="예상 거리 정보">` landmark.
 *  - 아이콘은 `aria-hidden="true"`.
 *
 * @see REQ-DASH3-004 (OrderForm 컴포넌트 복제 매니페스트 — EstimateDistanceInfo)
 * @see REQ-DASH-005  (landing 팔레트 일관성)
 * @see REQ-DASH-007  (접근성)
 * @see TC-DASH3-UNIT-DISTINFO
 */

'use client'

import { Route } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EstimateDistanceInfoProps {
  /** 예상 거리 (km) */
  readonly distance: number
  /** 예상 소요 시간 (분) */
  readonly duration: number
  /**
   * AI_APPLY 완료 후 수치 표시 여부.
   * true  → distance / duration 수치 노출.
   * false → "측정 전" placeholder 노출 (레이아웃 유지).
   */
  readonly visible: boolean
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CARD_CLASSES =
  'bg-accent/5 border border-accent/20 rounded-xl p-4 backdrop-blur-sm'

const ROW_CLASSES = 'flex items-center gap-2 text-sm'

const ICON_CLASSES = 'h-4 w-4 shrink-0 text-accent'

const LABEL_CLASSES = 'text-foreground/80 shrink-0'

const VALUE_CLASSES = 'font-bold text-foreground tabular-nums'

const PLACEHOLDER_CLASSES = 'text-muted-foreground'

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function EstimateDistanceInfo({
  distance,
  duration,
  visible,
}: EstimateDistanceInfoProps) {
  return (
    <section
      role="region"
      aria-label="예상 거리 정보"
      data-testid="estimate-distance-info"
      data-visible={visible}
      className={CARD_CLASSES}
    >
      <div className={ROW_CLASSES}>
        <Route
          aria-hidden="true"
          data-icon="route"
          className={ICON_CLASSES}
        />
        <span className={LABEL_CLASSES}>예상 거리/시간</span>
        {visible ? (
          <span className={VALUE_CLASSES}>
            {distance} km / {duration} 분
          </span>
        ) : (
          <span className={PLACEHOLDER_CLASSES}>측정 전</span>
        )}
      </div>
    </section>
  )
}
