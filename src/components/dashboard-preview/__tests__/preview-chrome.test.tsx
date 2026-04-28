import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { PreviewChrome } from '@/components/dashboard-preview/preview-chrome'
import { PREVIEW_STEPS } from '@/lib/preview-steps'

describe('PreviewChrome focus viewport (TC-FZ-VIS-01/02/03/04)', () => {
  it('composes base scale and desktop focus transform without changing scaled content', () => {
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
    expect(focusViewport.style.transform).toBe(
      'translate3d(14%, 8%, 0) scale(1.22)',
    )
    expect(focusViewport.style.transitionDuration).toBe('1800ms')
    expect(focusViewport).toContainElement(screen.getByTestId('child-element'))
  })

  it('keeps the outer preview frame fixed while the inner camera moves', () => {
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
    expect(scaledContent).toHaveAttribute('data-camera-frame', 'fixed')
    expect(scaledContent.style.aspectRatio).toBe('16 / 9')
    expect(screen.getByTestId('scaled-content-inner').style.transform).toBe(
      'scale(0.45)',
    )
    expect(screen.getByTestId('focus-viewport').style.transform).toBe(
      'translate3d(14%, 8%, 0) scale(1.22)',
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
    expect(focusViewport).toHaveAttribute(
      'data-focus-target',
      'ai-extract-button',
    )
    expect(focusViewport.style.transform).toBe(
      'translate3d(10%, 12%, 0) scale(1.12)',
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
    expect(focusViewport.style.transform).toBe('translate3d(0%, 0%, 0) scale(1)')
    expect(focusViewport.style.transitionDuration).toBe('0ms')
    expect(focusViewport).toHaveAttribute('data-focus-reduced-motion', 'true')
  })

  it('renders a decorative focus highlight layer outside the accessibility tree', () => {
    render(
      <PreviewChrome focus={PREVIEW_STEPS[1].focus} viewport="desktop">
        content
      </PreviewChrome>,
    )

    const layer = screen.getByTestId('focus-highlight-layer')
    expect(layer).toHaveAttribute('aria-hidden', 'true')
    expect(layer).toHaveAttribute('data-focus-target', 'ai-input-textarea')
  })
})
