interface OpticLogoProps {
  readonly className?: string
  readonly width?: number
  readonly height?: number
}

export function OpticLogo({ className, width = 120, height = 32 }: OpticLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 32"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="OPTIC logo"
    >
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="white"
        fontWeight="bold"
        fontSize="24"
        letterSpacing="4"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        OPTIC
      </text>
    </svg>
  )
}
