import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { InteractiveOverlay } from '@/components/dashboard-preview/interactive-overlay'
import {
  DESKTOP_HIT_AREAS,
  TABLET_HIT_AREAS,
  type HitAreaConfig,
} from '@/components/dashboard-preview/hit-areas'
import { PREVIEW_MOCK_DATA } from '@/lib/mock-data'

const DESKTOP_SCALE = 0.45
const TABLET_SCALE = 0.38

describe('InteractiveOverlay', () => {
  // -------------------------------------------------------------------------
  // REQ-DASH-043: 투명 오버레이 레이어 렌더링
  // -------------------------------------------------------------------------
  describe('TC-OVERLAY-001: overlay container rendering', () => {
    it('renders an overlay container with data-testid="interactive-overlay"', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      expect(screen.getByTestId('interactive-overlay')).toBeInTheDocument()
    })

    it('overlay has role="region"', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      const overlay = screen.getByTestId('interactive-overlay')
      expect(overlay).toHaveAttribute('role', 'region')
    })

    it('overlay has aria-label describing demo area', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      const overlay = screen.getByTestId('interactive-overlay')
      expect(overlay).toHaveAttribute('aria-label')
      expect(overlay.getAttribute('aria-label')).toBeTruthy()
    })

    it('overlay has absolute position filling parent (inset-0)', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      const overlay = screen.getByTestId('interactive-overlay')
      expect(overlay).toHaveClass('absolute', 'inset-0')
    })

    it('overlay has pointer-events-none to prevent blocking (REQ-DASH-043)', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      const overlay = screen.getByTestId('interactive-overlay')
      expect(overlay).toHaveClass('pointer-events-none')
    })
  })

  // -------------------------------------------------------------------------
  // TC-OVERLAY-002: HitArea button 렌더링
  // -------------------------------------------------------------------------
  describe('TC-OVERLAY-002: hit area button rendering', () => {
    it('renders one button per hit area (Desktop: 11 buttons)', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(DESKTOP_HIT_AREAS.length)
    })

    it('renders one button per hit area (Tablet: 6 buttons)', () => {
      render(
        <InteractiveOverlay
          hitAreas={TABLET_HIT_AREAS}
          scaleFactor={TABLET_SCALE}
        />,
      )
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(TABLET_HIT_AREAS.length)
    })

    it('each button has data-testid="hit-area-{id}"', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      for (const area of DESKTOP_HIT_AREAS) {
        expect(screen.getByTestId(`hit-area-${area.id}`)).toBeInTheDocument()
      }
    })

    it('each button carries data-area-id attribute matching its id', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      for (const area of DESKTOP_HIT_AREAS) {
        const button = screen.getByTestId(`hit-area-${area.id}`)
        expect(button).toHaveAttribute('data-area-id', area.id)
      }
    })

    it('each button uses type="button" to prevent form submission', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      for (const area of DESKTOP_HIT_AREAS) {
        const button = screen.getByTestId(`hit-area-${area.id}`)
        expect(button).toHaveAttribute('type', 'button')
      }
    })

    it('each button has pointer-events-auto to re-enable clicks over the overlay', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      for (const area of DESKTOP_HIT_AREAS) {
        const button = screen.getByTestId(`hit-area-${area.id}`)
        expect(button).toHaveClass('pointer-events-auto')
      }
    })
  })

  // -------------------------------------------------------------------------
  // TC-OVERLAY-003: scale 역변환 - 원본 * scaleFactor = 화면 좌표 (REQ-DASH-043)
  // -------------------------------------------------------------------------
  describe('TC-OVERLAY-003: scale inverse transformation (REQ-DASH-043)', () => {
    it('applies scaleFactor 0.45 to each bounds at Desktop', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      for (const area of DESKTOP_HIT_AREAS) {
        const button = screen.getByTestId(`hit-area-${area.id}`) as HTMLElement
        expect(button.style.left).toBe(`${area.bounds.x * DESKTOP_SCALE}px`)
        expect(button.style.top).toBe(`${area.bounds.y * DESKTOP_SCALE}px`)
        expect(button.style.width).toBe(
          `${area.bounds.width * DESKTOP_SCALE}px`,
        )
        expect(button.style.height).toBe(
          `${area.bounds.height * DESKTOP_SCALE}px`,
        )
      }
    })

    it('applies scaleFactor 0.38 to each bounds at Tablet', () => {
      render(
        <InteractiveOverlay
          hitAreas={TABLET_HIT_AREAS}
          scaleFactor={TABLET_SCALE}
        />,
      )
      for (const area of TABLET_HIT_AREAS) {
        const button = screen.getByTestId(`hit-area-${area.id}`) as HTMLElement
        expect(button.style.left).toBe(`${area.bounds.x * TABLET_SCALE}px`)
        expect(button.style.top).toBe(`${area.bounds.y * TABLET_SCALE}px`)
        expect(button.style.width).toBe(
          `${area.bounds.width * TABLET_SCALE}px`,
        )
        expect(button.style.height).toBe(
          `${area.bounds.height * TABLET_SCALE}px`,
        )
      }
    })

    it('uses a custom scaleFactor provided by the caller', () => {
      const customArea: HitAreaConfig = {
        id: 'custom',
        bounds: { x: 100, y: 200, width: 80, height: 80 },
        tooltipKey: 'ai-input',
      }
      const customScale = 0.5
      render(
        <InteractiveOverlay hitAreas={[customArea]} scaleFactor={customScale} />,
      )
      const button = screen.getByTestId('hit-area-custom') as HTMLElement
      expect(button.style.left).toBe('50px')
      expect(button.style.top).toBe('100px')
      expect(button.style.width).toBe('40px')
      expect(button.style.height).toBe('40px')
    })

    it('positions each button absolutely within the overlay', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      for (const area of DESKTOP_HIT_AREAS) {
        const button = screen.getByTestId(`hit-area-${area.id}`)
        expect(button).toHaveClass('absolute')
      }
    })
  })

  // -------------------------------------------------------------------------
  // TC-OVERLAY-004: className merging
  // -------------------------------------------------------------------------
  describe('TC-OVERLAY-004: className merging', () => {
    it('merges custom className with default overlay classes', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
          className="custom-overlay-class"
        />,
      )
      const overlay = screen.getByTestId('interactive-overlay')
      expect(overlay).toHaveClass('custom-overlay-class')
      expect(overlay).toHaveClass('absolute', 'inset-0', 'pointer-events-none')
    })

    it('works without a custom className', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      const overlay = screen.getByTestId('interactive-overlay')
      expect(overlay).toHaveClass('absolute', 'inset-0', 'pointer-events-none')
    })
  })

  // -------------------------------------------------------------------------
  // TC-OVERLAY-005: 빈 배열 엣지 케이스
  // -------------------------------------------------------------------------
  describe('TC-OVERLAY-005: empty hitAreas edge case', () => {
    it('renders overlay container with no buttons when hitAreas is empty', () => {
      render(<InteractiveOverlay hitAreas={[]} scaleFactor={DESKTOP_SCALE} />)
      expect(screen.getByTestId('interactive-overlay')).toBeInTheDocument()
      expect(screen.queryAllByRole('button')).toHaveLength(0)
    })
  })

  // -------------------------------------------------------------------------
  // TC-036: hover 하이라이트 (REQ-DASH-036)
  // -------------------------------------------------------------------------
  describe('TC-036: hover highlight (REQ-DASH-036)', () => {
    it('applies ring-2 ring-purple-500 on mouseEnter', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      const button = screen.getByTestId('hit-area-ai-input')
      expect(button).not.toHaveClass('ring-2')
      fireEvent.mouseEnter(button)
      expect(button).toHaveClass('ring-2', 'ring-purple-500')
    })

    it('removes highlight classes on mouseLeave', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      const button = screen.getByTestId('hit-area-ai-input')
      fireEvent.mouseEnter(button)
      expect(button).toHaveClass('ring-2')
      fireEvent.mouseLeave(button)
      expect(button).not.toHaveClass('ring-2')
    })

    it('only highlights one area at a time (previous hover released on new hover)', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      const first = screen.getByTestId('hit-area-ai-input')
      const second = screen.getByTestId('hit-area-extract-button')

      fireEvent.mouseEnter(first)
      expect(first).toHaveClass('ring-2')
      expect(second).not.toHaveClass('ring-2')

      fireEvent.mouseEnter(second)
      expect(first).not.toHaveClass('ring-2')
      expect(second).toHaveClass('ring-2')
    })
  })

  // -------------------------------------------------------------------------
  // TC-038 / TC-042: 툴팁 렌더링 (REQ-DASH-038, REQ-DASH-042)
  // -------------------------------------------------------------------------
  describe('TC-038: tooltip rendering (REQ-DASH-038, REQ-DASH-042)', () => {
    it('does not render tooltip by default', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      expect(
        screen.queryByTestId('interactive-tooltip'),
      ).not.toBeInTheDocument()
    })

    it('renders tooltip when an area is hovered', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      const button = screen.getByTestId('hit-area-ai-input')
      fireEvent.mouseEnter(button)
      expect(screen.getByTestId('interactive-tooltip')).toBeInTheDocument()
    })

    it('removes tooltip when mouse leaves', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      const button = screen.getByTestId('hit-area-ai-input')
      fireEvent.mouseEnter(button)
      expect(screen.getByTestId('interactive-tooltip')).toBeInTheDocument()
      fireEvent.mouseLeave(button)
      expect(
        screen.queryByTestId('interactive-tooltip'),
      ).not.toBeInTheDocument()
    })

    it('tooltip text matches tooltips[area.tooltipKey] from mock data', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      const button = screen.getByTestId('hit-area-extract-button')
      fireEvent.mouseEnter(button)
      const expected = PREVIEW_MOCK_DATA.tooltips['extract-button']
      expect(screen.getByRole('tooltip')).toHaveTextContent(expected)
    })
  })

  // -------------------------------------------------------------------------
  // TC-040: tooltipKey 매핑 검증 (REQ-DASH-040, REQ-DASH-042)
  // -------------------------------------------------------------------------
  describe('TC-040: aria-label mirrors tooltip text for all hit areas', () => {
    it('each button aria-label equals tooltips[area.tooltipKey] (Desktop 11)', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      for (const area of DESKTOP_HIT_AREAS) {
        const button = screen.getByTestId(`hit-area-${area.id}`)
        const expected = PREVIEW_MOCK_DATA.tooltips[area.tooltipKey]
        expect(button).toHaveAttribute('aria-label', expected)
      }
    })

    it('each button aria-label equals tooltips[area.tooltipKey] (Tablet 6)', () => {
      render(
        <InteractiveOverlay
          hitAreas={TABLET_HIT_AREAS}
          scaleFactor={TABLET_SCALE}
        />,
      )
      for (const area of TABLET_HIT_AREAS) {
        const button = screen.getByTestId(`hit-area-${area.id}`)
        const expected = PREVIEW_MOCK_DATA.tooltips[area.tooltipKey]
        expect(button).toHaveAttribute('aria-label', expected)
      }
    })
  })

  // -------------------------------------------------------------------------
  // TC-039: 클릭 시 onAreaExecute 호출 (REQ-DASH-039)
  // -------------------------------------------------------------------------
  describe('TC-039: click triggers onAreaExecute (REQ-DASH-039)', () => {
    it('calls onAreaExecute with the area id when clicked', () => {
      const onAreaExecute = vi.fn()
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
          onAreaExecute={onAreaExecute}
        />,
      )
      const button = screen.getByTestId('hit-area-ai-input')
      fireEvent.click(button)
      expect(onAreaExecute).toHaveBeenCalledTimes(1)
      expect(onAreaExecute).toHaveBeenCalledWith('ai-input')
    })

    it('does nothing on click when onAreaExecute is not provided', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      const button = screen.getByTestId('hit-area-ai-input')
      expect(() => fireEvent.click(button)).not.toThrow()
    })

    it('calls the correct id for each clicked button', () => {
      const onAreaExecute = vi.fn()
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
          onAreaExecute={onAreaExecute}
        />,
      )
      fireEvent.click(screen.getByTestId('hit-area-extract-button'))
      fireEvent.click(screen.getByTestId('hit-area-result-fare'))
      expect(onAreaExecute).toHaveBeenNthCalledWith(1, 'extract-button')
      expect(onAreaExecute).toHaveBeenNthCalledWith(2, 'result-fare')
    })
  })

  // -------------------------------------------------------------------------
  // TC-041: 논리적 의존 조건 (REQ-DASH-041)
  // -------------------------------------------------------------------------
  describe('TC-041: isAreaEnabled gates execution (REQ-DASH-041)', () => {
    it('does not call onAreaExecute when isAreaEnabled returns false', () => {
      const onAreaExecute = vi.fn()
      const isAreaEnabled = (area: HitAreaConfig) => area.id !== 'extract-button'
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
          onAreaExecute={onAreaExecute}
          isAreaEnabled={isAreaEnabled}
        />,
      )
      fireEvent.click(screen.getByTestId('hit-area-extract-button'))
      expect(onAreaExecute).not.toHaveBeenCalled()
    })

    it('calls onAreaExecute for enabled areas when isAreaEnabled is provided', () => {
      const onAreaExecute = vi.fn()
      const isAreaEnabled = (area: HitAreaConfig) => area.id !== 'extract-button'
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
          onAreaExecute={onAreaExecute}
          isAreaEnabled={isAreaEnabled}
        />,
      )
      fireEvent.click(screen.getByTestId('hit-area-ai-input'))
      expect(onAreaExecute).toHaveBeenCalledWith('ai-input')
    })

    it('treats missing isAreaEnabled as always enabled', () => {
      const onAreaExecute = vi.fn()
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
          onAreaExecute={onAreaExecute}
        />,
      )
      for (const area of DESKTOP_HIT_AREAS) {
        fireEvent.click(screen.getByTestId(`hit-area-${area.id}`))
      }
      expect(onAreaExecute).toHaveBeenCalledTimes(DESKTOP_HIT_AREAS.length)
    })

    it('sets aria-disabled="true" on disabled areas', () => {
      const isAreaEnabled = (area: HitAreaConfig) => area.id !== 'extract-button'
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
          isAreaEnabled={isAreaEnabled}
        />,
      )
      expect(
        screen.getByTestId('hit-area-extract-button'),
      ).toHaveAttribute('aria-disabled', 'true')
      expect(screen.getByTestId('hit-area-ai-input')).toHaveAttribute(
        'aria-disabled',
        'false',
      )
    })

    it('applies cursor-not-allowed class to disabled areas', () => {
      const isAreaEnabled = (area: HitAreaConfig) => area.id !== 'extract-button'
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
          isAreaEnabled={isAreaEnabled}
        />,
      )
      expect(screen.getByTestId('hit-area-extract-button')).toHaveClass(
        'cursor-not-allowed',
      )
      expect(screen.getByTestId('hit-area-ai-input')).toHaveClass('cursor-pointer')
    })
  })

  // -------------------------------------------------------------------------
  // TC-048: 키보드 탐색 속성 (REQ-DASH-048)
  // -------------------------------------------------------------------------
  describe('TC-048: keyboard navigation attributes (REQ-DASH-048)', () => {
    it('each button exposes role="button" (native button role)', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      for (const area of DESKTOP_HIT_AREAS) {
        const button = screen.getByTestId(`hit-area-${area.id}`)
        // native <button> has implicit role="button"
        expect(button.tagName.toLowerCase()).toBe('button')
      }
    })

    it('each button is keyboard-focusable (tabIndex !== -1)', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      for (const area of DESKTOP_HIT_AREAS) {
        const button = screen.getByTestId(`hit-area-${area.id}`) as HTMLButtonElement
        // native button is focusable by default; explicit tabIndex shouldn't be -1
        expect(button.tabIndex).not.toBe(-1)
      }
    })

    it('receives focus via focus() call', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      const button = screen.getByTestId('hit-area-ai-input') as HTMLButtonElement
      act(() => {
        button.focus()
      })
      expect(document.activeElement).toBe(button)
    })
  })

  // -------------------------------------------------------------------------
  // TC-049: 포커스 시각 피드백 (REQ-DASH-049)
  // -------------------------------------------------------------------------
  describe('TC-049: focus visual feedback (REQ-DASH-049)', () => {
    it('applies ring-2 ring-purple-500 on focus', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      const button = screen.getByTestId('hit-area-ai-input')
      expect(button).not.toHaveClass('ring-2')
      fireEvent.focus(button)
      expect(button).toHaveClass('ring-2', 'ring-purple-500')
    })

    it('removes highlight classes on blur', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      const button = screen.getByTestId('hit-area-ai-input')
      fireEvent.focus(button)
      expect(button).toHaveClass('ring-2')
      fireEvent.blur(button)
      expect(button).not.toHaveClass('ring-2')
    })

    it('renders tooltip when a button receives focus', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      expect(
        screen.queryByTestId('interactive-tooltip'),
      ).not.toBeInTheDocument()
      const button = screen.getByTestId('hit-area-ai-input')
      fireEvent.focus(button)
      expect(screen.getByTestId('interactive-tooltip')).toBeInTheDocument()
    })

    it('tooltip disappears on blur', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      const button = screen.getByTestId('hit-area-ai-input')
      fireEvent.focus(button)
      expect(screen.getByTestId('interactive-tooltip')).toBeInTheDocument()
      fireEvent.blur(button)
      expect(
        screen.queryByTestId('interactive-tooltip'),
      ).not.toBeInTheDocument()
    })

    it('focus tooltip text matches tooltips[area.tooltipKey]', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      const button = screen.getByTestId('hit-area-extract-button')
      fireEvent.focus(button)
      const expected = PREVIEW_MOCK_DATA.tooltips['extract-button']
      expect(screen.getByRole('tooltip')).toHaveTextContent(expected)
    })

    it('exposes focus-visible styles (focus:outline-none + focus-visible:ring)', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      const button = screen.getByTestId('hit-area-ai-input')
      expect(button).toHaveClass(
        'focus:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-purple-500',
      )
    })
  })

  // -------------------------------------------------------------------------
  // TC-050: Enter/Space 키로 실행 (REQ-DASH-050)
  // -------------------------------------------------------------------------
  describe('TC-050: Enter/Space key execution (REQ-DASH-050)', () => {
    it('Enter key on focused button calls onAreaExecute', () => {
      const onAreaExecute = vi.fn()
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
          onAreaExecute={onAreaExecute}
        />,
      )
      const button = screen.getByTestId('hit-area-ai-input')
      fireEvent.keyDown(button, { key: 'Enter' })
      expect(onAreaExecute).toHaveBeenCalledTimes(1)
      expect(onAreaExecute).toHaveBeenCalledWith('ai-input')
    })

    it('Space key on focused button calls onAreaExecute', () => {
      const onAreaExecute = vi.fn()
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
          onAreaExecute={onAreaExecute}
        />,
      )
      const button = screen.getByTestId('hit-area-extract-button')
      fireEvent.keyDown(button, { key: ' ' })
      expect(onAreaExecute).toHaveBeenCalledTimes(1)
      expect(onAreaExecute).toHaveBeenCalledWith('extract-button')
    })

    it('other keys (a, Tab, Escape) do NOT call onAreaExecute', () => {
      const onAreaExecute = vi.fn()
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
          onAreaExecute={onAreaExecute}
        />,
      )
      const button = screen.getByTestId('hit-area-ai-input')
      fireEvent.keyDown(button, { key: 'a' })
      fireEvent.keyDown(button, { key: 'Tab' })
      fireEvent.keyDown(button, { key: 'Escape' })
      expect(onAreaExecute).not.toHaveBeenCalled()
    })

    it('Enter key on aria-disabled button does NOT call onAreaExecute', () => {
      const onAreaExecute = vi.fn()
      const isAreaEnabled = (area: HitAreaConfig) =>
        area.id !== 'extract-button'
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
          onAreaExecute={onAreaExecute}
          isAreaEnabled={isAreaEnabled}
        />,
      )
      const button = screen.getByTestId('hit-area-extract-button')
      fireEvent.keyDown(button, { key: 'Enter' })
      expect(onAreaExecute).not.toHaveBeenCalled()
    })

    it('Space key on aria-disabled button does NOT call onAreaExecute', () => {
      const onAreaExecute = vi.fn()
      const isAreaEnabled = (area: HitAreaConfig) =>
        area.id !== 'extract-button'
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
          onAreaExecute={onAreaExecute}
          isAreaEnabled={isAreaEnabled}
        />,
      )
      const button = screen.getByTestId('hit-area-extract-button')
      fireEvent.keyDown(button, { key: ' ' })
      expect(onAreaExecute).not.toHaveBeenCalled()
    })

    it('Enter key preventDefault is applied (avoids scroll/submit)', () => {
      const onAreaExecute = vi.fn()
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
          onAreaExecute={onAreaExecute}
        />,
      )
      const button = screen.getByTestId('hit-area-ai-input')
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      })
      button.dispatchEvent(event)
      expect(event.defaultPrevented).toBe(true)
    })

    it('Space key preventDefault is applied (avoids page scroll)', () => {
      const onAreaExecute = vi.fn()
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
          onAreaExecute={onAreaExecute}
        />,
      )
      const button = screen.getByTestId('hit-area-ai-input')
      const event = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      })
      button.dispatchEvent(event)
      expect(event.defaultPrevented).toBe(true)
    })
  })

  // -------------------------------------------------------------------------
  // Focus + hover 상호작용 (regression guard)
  // -------------------------------------------------------------------------
  describe('focus + hover interaction', () => {
    it('hover keeps working after focus+blur (no regression)', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      const button = screen.getByTestId('hit-area-ai-input')

      fireEvent.focus(button)
      expect(button).toHaveClass('ring-2')
      fireEvent.blur(button)
      expect(button).not.toHaveClass('ring-2')

      fireEvent.mouseEnter(button)
      expect(button).toHaveClass('ring-2')
      fireEvent.mouseLeave(button)
      expect(button).not.toHaveClass('ring-2')
    })

    it('tooltip persists while hovered even if focus shifts (hover takes precedence)', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      const hoverTarget = screen.getByTestId('hit-area-ai-input')
      const focusTarget = screen.getByTestId('hit-area-extract-button')

      fireEvent.mouseEnter(hoverTarget)
      expect(screen.getByTestId('interactive-tooltip')).toBeInTheDocument()

      // focus another button (e.g., Tab while mouse still on hoverTarget)
      fireEvent.focus(focusTarget)
      // Tooltip should still be rendered (either hover or focus drives it)
      expect(screen.getByTestId('interactive-tooltip')).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // REQ-DASH-046: viewport별 히트 영역 렌더링 (Tablet 6개 vs Desktop 11개)
  // REQ-DASH-047: Tablet 최소 16px 크기 보장
  // -------------------------------------------------------------------------
  describe('REQ-DASH-046: viewport별 히트 영역 렌더링', () => {
    it('Desktop renders 11 buttons', () => {
      render(
        <InteractiveOverlay
          hitAreas={DESKTOP_HIT_AREAS}
          scaleFactor={DESKTOP_SCALE}
        />,
      )
      expect(screen.getAllByRole('button')).toHaveLength(11)
    })

    it('Tablet renders 6 buttons', () => {
      render(
        <InteractiveOverlay
          hitAreas={TABLET_HIT_AREAS}
          scaleFactor={TABLET_SCALE}
        />,
      )
      expect(screen.getAllByRole('button')).toHaveLength(6)
    })

    it('REQ-DASH-047: tablet buttons have minimum 16px size after scale', () => {
      render(
        <InteractiveOverlay
          hitAreas={TABLET_HIT_AREAS}
          scaleFactor={TABLET_SCALE}
        />,
      )
      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        const styleWidth = parseFloat((button as HTMLButtonElement).style.width)
        const styleHeight = parseFloat(
          (button as HTMLButtonElement).style.height,
        )
        expect(styleWidth).toBeGreaterThanOrEqual(16)
        expect(styleHeight).toBeGreaterThanOrEqual(16)
      })
    })
  })
})
