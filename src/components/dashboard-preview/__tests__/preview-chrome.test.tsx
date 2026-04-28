import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { PreviewChrome } from '@/components/dashboard-preview/preview-chrome'
import {
  PREVIEW_STEPS,
  getAiApplyCardFocusMetadata,
} from '@/lib/preview-steps'

describe('PreviewChrome focus viewport (TC-FZ-VIS-01/02/03/04)', () => {
  it('keeps base scale stable and applies target-only focus styling', () => {
    render(
      <PreviewChrome
        scaleFactor={0.45}
        focus={PREVIEW_STEPS[1].focus}
        viewport="desktop"
      >
        <div data-testid="child-element">content</div>
      </PreviewChrome>,
    )

    expect(screen.getByTestId('scaled-content-inner').style.transform).toBe(
      'scale(0.45)',
    )

    const focusViewport = screen.getByTestId('focus-viewport')
    expect(focusViewport).toHaveAttribute('data-focus-step', 'AI_INPUT')
    expect(focusViewport).toHaveAttribute(
      'data-focus-target',
      'ai-input-textarea',
    )
    expect(focusViewport).toHaveAttribute('data-focus-presentation', 'target-only')
    expect(focusViewport.style.transform).toBe('none')
    expect(focusViewport.style.transitionDuration).toBe('0ms')
    expect(screen.getByTestId('focus-target-style')).toHaveTextContent(
      '[data-hit-area-id="ai-input"]',
    )
    expect(screen.getByTestId('focus-target-style')).toHaveTextContent(
      'scale(1.1)',
    )
    expect(screen.getByTestId('focus-target-style')).toHaveTextContent(
      'transform-origin: top left',
    )
    expect(focusViewport).toContainElement(screen.getByTestId('child-element'))
  })

  it('keeps the outer preview frame height fixed at the reduced size', () => {
    render(
      <PreviewChrome
        scaleFactor={0.45}
        focus={PREVIEW_STEPS[1].focus}
        viewport="desktop"
      >
        <div data-testid="child-element">content</div>
      </PreviewChrome>,
    )

    const scaledContent = screen.getByTestId('scaled-content')
    expect(scaledContent).toHaveAttribute(
      'data-camera-frame',
      'fixed-height-reduced',
    )
    expect(scaledContent.style.height).toBe('390.15px')
    expect(screen.getByTestId('scaled-content-inner').style.transform).toBe(
      'scale(0.45)',
    )
    expect(screen.getByTestId('scaled-content-inner').style.height).toBe(
      '867px',
    )
    expect(screen.getByTestId('focus-viewport').style.transform).toBe(
      'none',
    )
  })

  it('uses tablet preset independently from desktop preset', () => {
    render(
      <PreviewChrome
        scaleFactor={0.4}
        focus={PREVIEW_STEPS[2].focus}
        viewport="tablet"
      >
        content
      </PreviewChrome>,
    )

    const focusViewport = screen.getByTestId('focus-viewport')
    expect(screen.getByTestId('scaled-content')).toHaveAttribute(
      'data-camera-frame',
      'fixed-height-reduced',
    )
    expect(screen.getByTestId('scaled-content').style.height).toBe('346.8px')
    expect(focusViewport).toHaveAttribute(
      'data-focus-target',
      'ai-extract-button',
    )
    expect(focusViewport.style.transform).toBe('none')
    expect(screen.getByTestId('focus-target-style')).toHaveTextContent(
      'scale(1.1)',
    )
  })

  it('falls back to highlight-only presentation when reduced motion is enabled', () => {
    render(
      <PreviewChrome
        focus={PREVIEW_STEPS[3].focus}
        viewport="desktop"
        reducedMotion
      >
        content
      </PreviewChrome>,
    )

    const focusViewport = screen.getByTestId('focus-viewport')
    expect(focusViewport.style.transform).toBe('none')
    expect(focusViewport.style.transitionDuration).toBe('0ms')
    expect(focusViewport).toHaveAttribute('data-focus-reduced-motion', 'true')
    expect(screen.getByTestId('focus-target-style')).toHaveTextContent(
      'scale(1)',
    )
  })

  it('anchors the final settlement card to the right edge so it expands leftward', () => {
    const focus = getAiApplyCardFocusMetadata('fare')
    expect(focus).toBeDefined()

    render(
      <PreviewChrome
        scaleFactor={0.45}
        focus={focus}
        viewport="desktop"
      >
        <div data-testid="child-element">content</div>
      </PreviewChrome>,
    )

    expect(screen.getByTestId('focus-viewport')).toHaveAttribute(
      'data-focus-anchor',
      'right',
    )
    expect(screen.getByTestId('focus-target-style')).toHaveTextContent(
      '[data-hit-area-id="form-settlement"]',
    )
    expect(screen.getByTestId('focus-target-style')).toHaveTextContent(
      'transform-origin: top right',
    )
    expect(screen.getByTestId('focus-target-style')).toHaveTextContent(
      'scale(1.08)',
    )
  })

  it('uses the same right-edge anchor for settlement focus targets', () => {
    const focus = {
      ...PREVIEW_STEPS[3].focus,
      targetId: 'form-settlement',
      label: '정산 정보',
    } as const

    render(
      <PreviewChrome
        scaleFactor={0.45}
        focus={focus}
        viewport="desktop"
      >
        <div data-testid="child-element">content</div>
      </PreviewChrome>,
    )

    expect(screen.getByTestId('focus-viewport')).toHaveAttribute(
      'data-focus-anchor',
      'right',
    )
    expect(screen.getByTestId('focus-target-style')).toHaveTextContent(
      '[data-hit-area-id="form-settlement"]',
    )
    expect(screen.getByTestId('focus-target-style')).toHaveTextContent(
      'transform-origin: top right',
    )
  })

  it('renders a decorative focus highlight layer only for the overview frame', () => {
    const { rerender } = render(
      <PreviewChrome focus={PREVIEW_STEPS[0].focus} viewport="desktop">
        content
      </PreviewChrome>,
    )

    const layer = screen.getByTestId('focus-highlight-layer')
    expect(layer).toHaveAttribute('aria-hidden', 'true')
    expect(layer).toHaveAttribute('data-focus-target', 'ai-preview-frame')

    rerender(
      <PreviewChrome focus={PREVIEW_STEPS[1].focus} viewport="desktop">
        content
      </PreviewChrome>,
    )
    expect(screen.queryByTestId('focus-highlight-layer')).not.toBeInTheDocument()
  })
})
