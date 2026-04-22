/**
 * T-DASH3-M5-06 (review#1) — framer-motion reduced-motion 전역 가드.
 *
 * globals.css 의 `@media (prefers-reduced-motion: reduce)` fallback 은 CSS 기반
 * transition/animation 만 차단한다. framer-motion 의 `initial`/`animate` 는 JS 기반
 * requestAnimationFrame 으로 구동되므로 CSS 룰이 미치지 않는다.
 *
 * MotionConfig `reducedMotion="user"` 설정으로 사용자의 OS `prefers-reduced-motion: reduce`
 * 값을 자동 감지하여 모든 하위 framer-motion 애니메이션의 duration 을 0 으로 강제한다.
 * WCAG 2.3.3 (Animation from Interactions) 준수 + REQ-DASH3-031 완전성 확보.
 *
 * @see https://www.framer.com/motion/motion-config/#reducedMotion
 */

'use client'

import { MotionConfig } from 'framer-motion'
import type { ReactNode } from 'react'

export function MotionProvider({ children }: { readonly children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
