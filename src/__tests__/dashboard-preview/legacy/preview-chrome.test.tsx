import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PreviewChrome } from '@/components/dashboard-preview/preview-chrome'

describe('PreviewChrome', () => {
  // TC-001: chrome 프레임 렌더링
  describe('TC-001: chrome frame rendering', () => {
    it('renders 3 window control dots', () => {
      render(<PreviewChrome>content</PreviewChrome>)

      const dots = screen.getAllByTestId('chrome-dot')
      expect(dots).toHaveLength(3)
    })

    it('renders dots with correct colors (red, yellow, green)', () => {
      render(<PreviewChrome>content</PreviewChrome>)

      const dots = screen.getAllByTestId('chrome-dot')
      expect(dots[0]).toHaveClass('bg-red-500')
      expect(dots[1]).toHaveClass('bg-yellow-500')
      expect(dots[2]).toHaveClass('bg-green-500')
    })

    it('renders dots with correct size and shape', () => {
      render(<PreviewChrome>content</PreviewChrome>)

      const dots = screen.getAllByTestId('chrome-dot')
      dots.forEach((dot) => {
        expect(dot).toHaveClass('w-2.5', 'h-2.5', 'rounded-full')
      })
    })

    it('displays "OPTIC Broker" title text', () => {
      render(<PreviewChrome>content</PreviewChrome>)

      expect(screen.getByText('OPTIC Broker')).toBeInTheDocument()
    })

    it('applies title styling classes', () => {
      render(<PreviewChrome>content</PreviewChrome>)

      const title = screen.getByText('OPTIC Broker')
      expect(title).toHaveClass('text-xs', 'text-gray-500', 'ml-2')
    })

    it('applies outer frame classes (rounded-2xl, border, bg)', () => {
      render(<PreviewChrome>content</PreviewChrome>)

      const frame = screen.getByTestId('preview-chrome')
      expect(frame).toHaveClass('rounded-2xl', 'border-gray-800', 'bg-gray-900/50', 'overflow-hidden')
    })

    it('applies chrome header border-b class', () => {
      render(<PreviewChrome>content</PreviewChrome>)

      const header = screen.getByTestId('chrome-header')
      expect(header).toHaveClass('border-b', 'border-gray-800')
    })
  })

  // TC-002: scaleFactor 적용
  describe('TC-002: scaleFactor application', () => {
    it('applies default scaleFactor of 0.45', () => {
      render(<PreviewChrome>content</PreviewChrome>)

      const scaledInner = screen.getByTestId('scaled-content-inner')
      expect(scaledInner.style.transform).toBe('scale(0.45)')
    })

    it('applies custom scaleFactor when prop is provided', () => {
      render(<PreviewChrome scaleFactor={0.38}>content</PreviewChrome>)

      const scaledInner = screen.getByTestId('scaled-content-inner')
      expect(scaledInner.style.transform).toBe('scale(0.38)')
    })

    it('sets transformOrigin to top left', () => {
      render(<PreviewChrome>content</PreviewChrome>)

      const scaledInner = screen.getByTestId('scaled-content-inner')
      expect(scaledInner.style.transformOrigin).toBe('top left')
    })

    it('calculates width as 100/scaleFactor percent', () => {
      render(<PreviewChrome>content</PreviewChrome>)

      const scaledInner = screen.getByTestId('scaled-content-inner')
      const expectedWidth = `${100 / 0.45}%`
      expect(scaledInner.style.width).toBe(expectedWidth)
    })

    it('calculates width correctly for custom scaleFactor', () => {
      render(<PreviewChrome scaleFactor={0.38}>content</PreviewChrome>)

      const scaledInner = screen.getByTestId('scaled-content-inner')
      const expectedWidth = `${100 / 0.38}%`
      expect(scaledInner.style.width).toBe(expectedWidth)
    })

    it('applies overflow-hidden on scaled content container', () => {
      render(<PreviewChrome>content</PreviewChrome>)

      const scaledContainer = screen.getByTestId('scaled-content')
      expect(scaledContainer).toHaveClass('overflow-hidden')
    })
  })

  // TC-003: children 렌더링
  describe('TC-003: children rendering', () => {
    it('renders children inside ScaledContent', () => {
      render(
        <PreviewChrome>
          <div data-testid="child-element">Hello Dashboard</div>
        </PreviewChrome>,
      )

      const child = screen.getByTestId('child-element')
      expect(child).toBeInTheDocument()
      expect(child).toHaveTextContent('Hello Dashboard')

      // child should be inside scaled-content-inner
      const scaledInner = screen.getByTestId('scaled-content-inner')
      expect(scaledInner).toContainElement(child)
    })

    it('does not render any Header or Breadcrumb elements', () => {
      render(<PreviewChrome>content</PreviewChrome>)

      expect(screen.queryByRole('banner')).not.toBeInTheDocument()
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
      expect(screen.queryByTestId('header')).not.toBeInTheDocument()
      expect(screen.queryByTestId('breadcrumb')).not.toBeInTheDocument()
    })

    it('merges custom className with outer frame', () => {
      render(<PreviewChrome className="custom-class">content</PreviewChrome>)

      const frame = screen.getByTestId('preview-chrome')
      expect(frame).toHaveClass('custom-class')
      expect(frame).toHaveClass('rounded-2xl')
    })
  })
})
