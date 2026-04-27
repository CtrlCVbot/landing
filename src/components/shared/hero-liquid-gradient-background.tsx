'use client'

import { cn } from '@/lib/utils'

interface HeroLiquidGradientBackgroundProps {
  readonly className?: string
}

export function HeroLiquidGradientBackground({
  className,
}: HeroLiquidGradientBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      data-testid="hero-liquid-gradient-background"
      className={cn(
        'hero-liquid-gradient-background absolute inset-x-[-9rem] -top-24 bottom-[-3rem] z-0 pointer-events-none overflow-hidden',
        'sm:inset-x-[-12rem] md:inset-x-[-16rem] md:-top-32',
        className,
      )}
    >
      <div className="hero-liquid-gradient-background__field" />
    </div>
  )
}
