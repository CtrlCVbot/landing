'use client'

import { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const CHROME_DOT_COLORS = ['bg-red-500', 'bg-yellow-500', 'bg-green-500'] as const

const DEFAULT_SCALE_FACTOR = 0.45

interface PreviewChromeProps {
  readonly children: React.ReactNode
  readonly scaleFactor?: number
  readonly className?: string
}

function ChromeHeader() {
  return (
    <div
      data-testid="chrome-header"
      className="flex items-center gap-1.5 border-b border-border px-3 py-2"
    >
      {CHROME_DOT_COLORS.map((color) => (
        <div
          key={color}
          data-testid="chrome-dot"
          className={cn('h-2.5 w-2.5 rounded-full', color)}
        />
      ))}
      <span className="ml-2 text-xs text-muted-foreground">OPTIC Broker</span>
    </div>
  )
}

function ScaledContent({
  children,
  scaleFactor,
}: {
  readonly children: React.ReactNode
  readonly scaleFactor: number
}) {
  const innerRef = useRef<HTMLDivElement>(null)
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(
    undefined,
  )

  useEffect(() => {
    if (!innerRef.current) return

    const updateHeight = () => {
      if (innerRef.current) {
        setScaledHeight(innerRef.current.scrollHeight * scaleFactor)
      }
    }

    updateHeight()

    const observer = new ResizeObserver(updateHeight)
    observer.observe(innerRef.current)
    return () => observer.disconnect()
  }, [scaleFactor])

  return (
    <div
      data-testid="scaled-content"
      className="overflow-hidden"
      style={scaledHeight ? { height: `${scaledHeight}px` } : undefined}
    >
      <div
        ref={innerRef}
        data-testid="scaled-content-inner"
        style={{
          transform: `scale(${scaleFactor})`,
          transformOrigin: 'top left',
          width: `${100 / scaleFactor}%`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export function PreviewChrome({
  children,
  scaleFactor = DEFAULT_SCALE_FACTOR,
  className,
}: PreviewChromeProps) {
  return (
    <div
      data-testid="preview-chrome"
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-card/50',
        className,
      )}
    >
      <ChromeHeader />
      <ScaledContent scaleFactor={scaleFactor}>{children}</ScaledContent>
    </div>
  )
}
