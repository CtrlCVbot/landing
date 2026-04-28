'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { PreviewFocusMetadata } from '@/lib/preview-steps'

const CHROME_DOT_COLORS = ['bg-red-500', 'bg-yellow-500', 'bg-green-500'] as const

const DEFAULT_SCALE_FACTOR = 0.45
const CAMERA_FRAME_ASPECT_RATIO = '16 / 9'

interface PreviewChromeProps {
  readonly children: ReactNode
  readonly scaleFactor?: number
  readonly focus?: PreviewFocusMetadata
  readonly viewport?: keyof PreviewFocusMetadata['viewport']
  readonly reducedMotion?: boolean
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
  focus,
  viewport,
  reducedMotion,
}: {
  readonly children: ReactNode
  readonly scaleFactor: number
  readonly focus?: PreviewFocusMetadata
  readonly viewport: keyof PreviewFocusMetadata['viewport']
  readonly reducedMotion: boolean
}) {
  return (
    <div
      data-testid="scaled-content"
      data-camera-frame="fixed"
      className="overflow-hidden"
      style={{ aspectRatio: CAMERA_FRAME_ASPECT_RATIO }}
    >
      <div
        data-testid="scaled-content-inner"
        style={{
          transform: `scale(${scaleFactor})`,
          transformOrigin: 'top left',
          width: `${100 / scaleFactor}%`,
          minHeight: '100%',
        }}
      >
        {focus ? (
          <FocusViewport
            focus={focus}
            viewport={viewport}
            reducedMotion={reducedMotion}
          >
            {children}
          </FocusViewport>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

function FocusViewport({
  children,
  focus,
  viewport,
  reducedMotion,
}: {
  readonly children: ReactNode
  readonly focus: PreviewFocusMetadata
  readonly viewport: keyof PreviewFocusMetadata['viewport']
  readonly reducedMotion: boolean
}) {
  const preset = focus.viewport[viewport]
  const transform = reducedMotion
    ? 'translate3d(0%, 0%, 0) scale(1)'
    : `translate3d(${preset.x}%, ${preset.y}%, 0) scale(${preset.scale})`

  return (
    <div
      data-testid="focus-viewport"
      data-focus-step={focus.stepId}
      data-focus-target={focus.targetId}
      data-focus-reduced-motion={reducedMotion ? 'true' : 'false'}
      className="relative"
      style={{
        transform,
        transformOrigin: 'top left',
        transitionDuration: reducedMotion ? '0ms' : `${focus.duration}ms`,
        transitionProperty: 'transform',
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: reducedMotion ? 'auto' : 'transform',
      }}
    >
      {children}
      <div
        data-testid="focus-highlight-layer"
        data-focus-target={focus.targetId}
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 rounded-xl ring-2 ring-primary/35 ring-offset-0"
      />
    </div>
  )
}

export function PreviewChrome({
  children,
  scaleFactor = DEFAULT_SCALE_FACTOR,
  focus,
  viewport = 'desktop',
  reducedMotion = false,
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
      <ScaledContent
        scaleFactor={scaleFactor}
        focus={focus}
        viewport={viewport}
        reducedMotion={reducedMotion}
      >
        {children}
      </ScaledContent>
    </div>
  )
}
