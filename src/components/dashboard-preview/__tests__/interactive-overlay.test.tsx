import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { InteractiveOverlay } from '@/components/dashboard-preview/interactive-overlay'
import type { HitAreaConfig } from '@/components/dashboard-preview/hit-areas'

const MEASURED_AREA: HitAreaConfig = {
  id: 'measured-target',
  bounds: { x: 999, y: 999, width: 111, height: 111 },
  tooltipKey: 'ai-input',
}

function rect(left: number, top: number, width: number, height: number): DOMRect {
  return {
    x: left,
    y: top,
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    toJSON: () => ({}),
  } as DOMRect
}

describe('InteractiveOverlay DOM measurement', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('data-hit-area-id target의 실제 DOMRect를 overlay 좌표로 변환해 사용한다', async () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
      function getMockRect(this: Element) {
        const testId = this.getAttribute('data-testid')
        if (testId === 'interactive-overlay') return rect(10, 20, 200, 100)
        if (testId === 'measured-target') return rect(60, 90, 120, 40)
        return rect(0, 0, 0, 0)
      },
    )
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(
      function getOffsetWidth(this: HTMLElement) {
        return this.getAttribute('data-testid') === 'interactive-overlay' ? 400 : 0
      },
    )
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(
      function getOffsetHeight(this: HTMLElement) {
        return this.getAttribute('data-testid') === 'interactive-overlay' ? 200 : 0
      },
    )

    render(
      <div>
        <div data-hit-area-id="measured-target" data-testid="measured-target" />
        <InteractiveOverlay hitAreas={[MEASURED_AREA]} scaleFactor={0.5} />
      </div>,
    )

    const button = screen.getByTestId('hit-area-measured-target')

    await waitFor(() => {
      expect(button.style.left).toBe('100px')
      expect(button.style.top).toBe('140px')
      expect(button.style.width).toBe('240px')
      expect(button.style.height).toBe('80px')
    })

    fireEvent.mouseEnter(button)

    const tooltip = screen.getByRole('tooltip')
    expect(tooltip.style.left).toBe('220px')
    expect(tooltip.style.top).toBe('100px')
  })

  it('측정 대상이 없으면 static bounds와 scaleFactor fallback을 유지한다', () => {
    render(<InteractiveOverlay hitAreas={[MEASURED_AREA]} scaleFactor={0.5} />)

    const button = screen.getByTestId('hit-area-measured-target')
    expect(button.style.left).toBe('499.5px')
    expect(button.style.top).toBe('499.5px')
    expect(button.style.width).toBe('55.5px')
    expect(button.style.height).toBe('55.5px')
  })
})
