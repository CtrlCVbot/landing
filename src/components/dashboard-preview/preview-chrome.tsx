'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { PreviewFocusMetadata } from '@/lib/preview-steps'

const CHROME_DOT_COLORS = ['bg-red-500', 'bg-yellow-500', 'bg-green-500'] as const

const DEFAULT_SCALE_FACTOR = 0.45
const PREVIOUS_MAX_CONTENT_HEIGHT_PX = 1040
const FIXED_CONTENT_HEIGHT_PX = Math.round(
  PREVIOUS_MAX_CONTENT_HEIGHT_PX * (5 / 6),
)
const FOCUS_TARGET_ALIASES: Partial<
  Record<PreviewFocusMetadata['targetId'], readonly string[]>
> = {
  'ai-input-textarea': ['ai-input'],
}
const EDGE_LEFT_MAX_SCALE = 1.1
const EDGE_RIGHT_MAX_SCALE = 1.08

type FocusAnchor = 'left' | 'right'

interface FocusTargetPresentation {
  readonly anchor: FocusAnchor
  readonly transformOrigin: string
  readonly maxScale?: number
}

const DEFAULT_FOCUS_TARGET_PRESENTATION: FocusTargetPresentation = {
  anchor: 'left',
  transformOrigin: 'top left',
}

const FOCUS_TARGET_PRESENTATION_BY_ID: Readonly<
  Record<string, FocusTargetPresentation>
> = {
  'ai-input-textarea': {
    anchor: 'left',
    transformOrigin: 'top left',
    maxScale: EDGE_LEFT_MAX_SCALE,
  },
  'ai-input': {
    anchor: 'left',
    transformOrigin: 'top left',
    maxScale: EDGE_LEFT_MAX_SCALE,
  },
  'ai-extract-button': {
    anchor: 'left',
    transformOrigin: 'top left',
    maxScale: EDGE_LEFT_MAX_SCALE,
  },
  'ai-result-group': {
    anchor: 'left',
    transformOrigin: 'top left',
    maxScale: EDGE_LEFT_MAX_SCALE,
  },
  'ai-result-departure': {
    anchor: 'left',
    transformOrigin: 'top left',
    maxScale: EDGE_LEFT_MAX_SCALE,
  },
  'ai-result-destination': {
    anchor: 'left',
    transformOrigin: 'top left',
    maxScale: EDGE_LEFT_MAX_SCALE,
  },
  'ai-result-cargo': {
    anchor: 'left',
    transformOrigin: 'top left',
    maxScale: EDGE_LEFT_MAX_SCALE,
  },
  'ai-result-fare': {
    anchor: 'left',
    transformOrigin: 'top left',
    maxScale: EDGE_LEFT_MAX_SCALE,
  },
  'form-estimate-distance': {
    anchor: 'right',
    transformOrigin: 'top right',
    maxScale: EDGE_RIGHT_MAX_SCALE,
  },
  'form-estimate-info': {
    anchor: 'right',
    transformOrigin: 'top right',
    maxScale: EDGE_RIGHT_MAX_SCALE,
  },
  'form-settlement': {
    anchor: 'right',
    transformOrigin: 'top right',
    maxScale: EDGE_RIGHT_MAX_SCALE,
  },
  'form-auto-dispatch': {
    anchor: 'right',
    transformOrigin: 'top right',
    maxScale: EDGE_RIGHT_MAX_SCALE,
  },
  'form-transport-options': {
    anchor: 'right',
    transformOrigin: 'top right',
    maxScale: EDGE_RIGHT_MAX_SCALE,
  },
}

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
  const fixedFrameHeight = Number(
    (FIXED_CONTENT_HEIGHT_PX * scaleFactor).toFixed(2),
  )

  return (
    <div
      data-testid="scaled-content"
      data-camera-frame="fixed-height-reduced"
      className="overflow-hidden"
      style={{ height: `${fixedFrameHeight}px` }}
    >
      <div
        data-testid="scaled-content-inner"
        style={{
          transform: `scale(${scaleFactor})`,
          transformOrigin: 'top left',
          width: `${100 / scaleFactor}%`,
          height: `${FIXED_CONTENT_HEIGHT_PX}px`,
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

function getFocusTargetSelector(targetId: PreviewFocusMetadata['targetId']) {
  const targetIds = [targetId, ...(FOCUS_TARGET_ALIASES[targetId] ?? [])]

  return targetIds
    .map((id) => `[data-hit-area-id="${id}"]`)
    .join(',\n')
}

function getFocusTargetPresentation(targetId: PreviewFocusMetadata['targetId']) {
  return (
    FOCUS_TARGET_PRESENTATION_BY_ID[targetId] ??
    DEFAULT_FOCUS_TARGET_PRESENTATION
  )
}

function getEffectiveFocusScale(
  presetScale: number,
  presentation: FocusTargetPresentation,
  reducedMotion: boolean,
) {
  if (reducedMotion) return 1
  return presentation.maxScale
    ? Math.min(presetScale, presentation.maxScale)
    : presetScale
}

function getTargetOnlyFocusCss({
  focus,
  viewport,
  reducedMotion,
}: {
  readonly focus: PreviewFocusMetadata
  readonly viewport: keyof PreviewFocusMetadata['viewport']
  readonly reducedMotion: boolean
}) {
  if (focus.targetId === 'ai-preview-frame') return ''

  const selector = getFocusTargetSelector(focus.targetId)
  const preset = focus.viewport[viewport]
  const presentation = getFocusTargetPresentation(focus.targetId)
  const focusScale = getEffectiveFocusScale(
    preset.scale,
    presentation,
    reducedMotion,
  )
  const duration = reducedMotion ? 0 : focus.duration

  return `
${selector} {
  position: relative;
  z-index: 10;
  transform: scale(${focusScale});
  transform-origin: ${presentation.transformOrigin};
  transition-duration: ${duration}ms;
  transition-property: transform, box-shadow, outline-color;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  will-change: ${reducedMotion ? 'auto' : 'transform'};
  outline: 2px solid rgba(124, 58, 237, 0.46);
  outline-offset: 3px;
  box-shadow: 0 0 0 5px rgba(124, 58, 237, 0.12), 0 18px 34px rgba(15, 23, 42, 0.16);
}
`
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
  const presentation = getFocusTargetPresentation(focus.targetId)
  const targetOnlyFocusCss = getTargetOnlyFocusCss({
    focus,
    viewport,
    reducedMotion,
  })

  return (
    <div
      data-testid="focus-viewport"
      data-focus-step={focus.stepId}
      data-focus-target={focus.targetId}
      data-focus-presentation="target-only"
      data-focus-anchor={presentation.anchor}
      data-focus-reduced-motion={reducedMotion ? 'true' : 'false'}
      className="relative h-full"
      style={{
        transform: 'none',
        transitionDuration: '0ms',
      }}
    >
      <style data-testid="focus-target-style">{targetOnlyFocusCss}</style>
      {children}
      {focus.targetId === 'ai-preview-frame' ? (
        <div
          data-testid="focus-highlight-layer"
          data-focus-target={focus.targetId}
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 rounded-xl ring-1 ring-primary/20 ring-offset-0"
        />
      ) : null}
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
