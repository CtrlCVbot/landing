import { BRAND } from '@/lib/constants'

interface OpticLogoProps {
  readonly className?: string
  readonly width?: number
  readonly height?: number
}

export function OpticLogo({
  className,
  width = 120,
  height = 32,
}: OpticLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 112 40"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label={BRAND.logoLabel}
    >
      <text
        x="0"
        y="50%"
        dominantBaseline="central"
        fill="currentColor"
        fontWeight="900"
        fontSize="24"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {BRAND.primary}
      </text>
    </svg>
  )
}
