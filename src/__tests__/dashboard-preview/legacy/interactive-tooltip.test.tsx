import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { InteractiveTooltip } from '@/components/dashboard-preview/interactive-tooltip'

describe('InteractiveTooltip', () => {
  // -------------------------------------------------------------------------
  // 기본 렌더링
  // -------------------------------------------------------------------------
  describe('rendering', () => {
    it('renders tooltip with role="tooltip"', () => {
      render(
        <InteractiveTooltip
          text="테스트 툴팁"
          anchorBounds={{ x: 100, y: 200, width: 100, height: 50 }}
        />,
      )
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })

    it('renders with data-testid="interactive-tooltip"', () => {
      render(
        <InteractiveTooltip
          text="테스트 툴팁"
          anchorBounds={{ x: 100, y: 200, width: 100, height: 50 }}
        />,
      )
      expect(screen.getByTestId('interactive-tooltip')).toBeInTheDocument()
    })

    it('renders provided text content', () => {
      render(
        <InteractiveTooltip
          text="클릭 한 번으로 메시지에서 운송 정보를 추출합니다"
          anchorBounds={{ x: 100, y: 200, width: 100, height: 50 }}
        />,
      )
      expect(
        screen.getByText('클릭 한 번으로 메시지에서 운송 정보를 추출합니다'),
      ).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // 위치 계산
  // -------------------------------------------------------------------------
  describe('positioning', () => {
    it('places tooltip above anchor when anchor y > 50 (y - 40)', () => {
      render(
        <InteractiveTooltip
          text="위쪽 배치"
          anchorBounds={{ x: 100, y: 200, width: 100, height: 50 }}
        />,
      )
      const tooltip = screen.getByTestId('interactive-tooltip') as HTMLElement
      expect(tooltip.style.top).toBe('160px')
    })

    it('places tooltip below anchor when anchor y <= 50 (y + height + 8)', () => {
      render(
        <InteractiveTooltip
          text="아래쪽 배치"
          anchorBounds={{ x: 100, y: 30, width: 100, height: 50 }}
        />,
      )
      const tooltip = screen.getByTestId('interactive-tooltip') as HTMLElement
      expect(tooltip.style.top).toBe('88px')
    })

    it('places tooltip below anchor when anchor y === 50 (boundary case)', () => {
      render(
        <InteractiveTooltip
          text="경계 케이스"
          anchorBounds={{ x: 100, y: 50, width: 100, height: 50 }}
        />,
      )
      const tooltip = screen.getByTestId('interactive-tooltip') as HTMLElement
      expect(tooltip.style.top).toBe('108px')
    })

    it('centers tooltip horizontally relative to anchor (x + width/2)', () => {
      render(
        <InteractiveTooltip
          text="중앙 정렬"
          anchorBounds={{ x: 100, y: 200, width: 80, height: 50 }}
        />,
      )
      const tooltip = screen.getByTestId('interactive-tooltip') as HTMLElement
      expect(tooltip.style.left).toBe('140px')
    })
  })

  // -------------------------------------------------------------------------
  // 스타일링
  // -------------------------------------------------------------------------
  describe('styling', () => {
    it('applies max-width 280px via max-w-[280px] class', () => {
      render(
        <InteractiveTooltip
          text="max-width"
          anchorBounds={{ x: 100, y: 200, width: 100, height: 50 }}
        />,
      )
      const tooltip = screen.getByTestId('interactive-tooltip')
      expect(tooltip).toHaveClass('max-w-[280px]')
    })

    it('applies z-10 for stacking above overlay content', () => {
      render(
        <InteractiveTooltip
          text="z-index"
          anchorBounds={{ x: 100, y: 200, width: 100, height: 50 }}
        />,
      )
      const tooltip = screen.getByTestId('interactive-tooltip')
      expect(tooltip).toHaveClass('z-10')
    })

    it('applies pointer-events-none to avoid blocking hover on the underlying area', () => {
      render(
        <InteractiveTooltip
          text="pointer-events"
          anchorBounds={{ x: 100, y: 200, width: 100, height: 50 }}
        />,
      )
      const tooltip = screen.getByTestId('interactive-tooltip')
      expect(tooltip).toHaveClass('pointer-events-none')
    })

    it('applies bg-gray-900/90 for semi-transparent dark background (REQ-DASH-038)', () => {
      render(
        <InteractiveTooltip
          text="배경"
          anchorBounds={{ x: 100, y: 200, width: 100, height: 50 }}
        />,
      )
      const tooltip = screen.getByTestId('interactive-tooltip')
      expect(tooltip).toHaveClass('bg-gray-900/90')
    })

    it('applies rounded-md px-3 py-2 for consistent padding (REQ-DASH-038)', () => {
      render(
        <InteractiveTooltip
          text="패딩"
          anchorBounds={{ x: 100, y: 200, width: 100, height: 50 }}
        />,
      )
      const tooltip = screen.getByTestId('interactive-tooltip')
      expect(tooltip).toHaveClass('rounded-md', 'px-3', 'py-2')
    })

    it('applies -translate-x-1/2 so the tooltip is visually centered on the anchor', () => {
      render(
        <InteractiveTooltip
          text="중앙 변환"
          anchorBounds={{ x: 100, y: 200, width: 100, height: 50 }}
        />,
      )
      const tooltip = screen.getByTestId('interactive-tooltip')
      expect(tooltip).toHaveClass('-translate-x-1/2')
    })

    it('uses absolute positioning within overlay coordinate space', () => {
      render(
        <InteractiveTooltip
          text="absolute"
          anchorBounds={{ x: 100, y: 200, width: 100, height: 50 }}
        />,
      )
      const tooltip = screen.getByTestId('interactive-tooltip')
      expect(tooltip).toHaveClass('absolute')
    })
  })
})
