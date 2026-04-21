import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { StepIndicator } from '@/components/dashboard-preview/step-indicator'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderIndicator(overrides: Partial<Parameters<typeof StepIndicator>[0]> = {}) {
  const defaultProps = {
    totalSteps: 5,
    currentStep: 0,
    onStepClick: vi.fn(),
    ...overrides,
  }
  return {
    ...render(<StepIndicator {...defaultProps} />),
    onStepClick: defaultProps.onStepClick,
  }
}

// ---------------------------------------------------------------------------
// TC-014: 5-dot rendering, active dot accent style
// ---------------------------------------------------------------------------

describe('StepIndicator', () => {
  describe('TC-014: dot rendering and active style', () => {
    it('renders 5 dots', () => {
      renderIndicator()

      const tabs = screen.getAllByRole('tab')
      expect(tabs).toHaveLength(5)
    })

    it('applies accent gradient to the active dot (currentStep=0)', () => {
      renderIndicator({ currentStep: 0 })

      const tabs = screen.getAllByRole('tab')
      expect(tabs[0]).toHaveClass('bg-gradient-to-r', 'from-purple-500', 'to-blue-500')
    })

    it('applies accent gradient to a different active dot (currentStep=3)', () => {
      renderIndicator({ currentStep: 3 })

      const tabs = screen.getAllByRole('tab')
      expect(tabs[3]).toHaveClass('bg-gradient-to-r', 'from-purple-500', 'to-blue-500')
    })

    it('applies inactive style to non-active dots', () => {
      renderIndicator({ currentStep: 2 })

      const tabs = screen.getAllByRole('tab')
      expect(tabs[0]).toHaveClass('bg-gray-600')
      expect(tabs[1]).toHaveClass('bg-gray-600')
      expect(tabs[3]).toHaveClass('bg-gray-600')
      expect(tabs[4]).toHaveClass('bg-gray-600')
    })

    it('applies scale-125 to the active dot only', () => {
      renderIndicator({ currentStep: 1 })

      const tabs = screen.getAllByRole('tab')
      expect(tabs[1]).toHaveClass('scale-125')
      expect(tabs[0]).not.toHaveClass('scale-125')
    })
  })

  // -------------------------------------------------------------------------
  // TC-015: dot click -> onStepClick(index)
  // -------------------------------------------------------------------------

  describe('TC-015: click interaction', () => {
    it('calls onStepClick with the clicked dot index', () => {
      const { onStepClick } = renderIndicator()

      const tabs = screen.getAllByRole('tab')
      fireEvent.click(tabs[3])

      expect(onStepClick).toHaveBeenCalledWith(3)
      expect(onStepClick).toHaveBeenCalledTimes(1)
    })

    it('calls onStepClick with index 0 when first dot is clicked', () => {
      const { onStepClick } = renderIndicator({ currentStep: 2 })

      const tabs = screen.getAllByRole('tab')
      fireEvent.click(tabs[0])

      expect(onStepClick).toHaveBeenCalledWith(0)
    })
  })

  // -------------------------------------------------------------------------
  // TC-016: accessibility roles
  // -------------------------------------------------------------------------

  describe('TC-016: accessibility', () => {
    it('has role="tablist" on the container', () => {
      renderIndicator()

      expect(screen.getByRole('tablist')).toBeInTheDocument()
    })

    it('each dot has role="tab"', () => {
      renderIndicator()

      const tabs = screen.getAllByRole('tab')
      expect(tabs).toHaveLength(5)
    })

    it('active dot has aria-selected="true"', () => {
      renderIndicator({ currentStep: 2 })

      const tabs = screen.getAllByRole('tab')
      expect(tabs[2]).toHaveAttribute('aria-selected', 'true')
    })

    it('inactive dots have aria-selected="false"', () => {
      renderIndicator({ currentStep: 2 })

      const tabs = screen.getAllByRole('tab')
      expect(tabs[0]).toHaveAttribute('aria-selected', 'false')
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false')
      expect(tabs[3]).toHaveAttribute('aria-selected', 'false')
      expect(tabs[4]).toHaveAttribute('aria-selected', 'false')
    })

    it('each dot has an aria-label', () => {
      renderIndicator()

      const tabs = screen.getAllByRole('tab')
      tabs.forEach((tab, index) => {
        expect(tab).toHaveAttribute('aria-label', `Step ${index + 1}`)
      })
    })
  })

  // -------------------------------------------------------------------------
  // TC-029: keyboard Enter/Space -> onStepClick
  // -------------------------------------------------------------------------

  describe('TC-029: keyboard interaction', () => {
    it('calls onStepClick on Enter key press', () => {
      const { onStepClick } = renderIndicator()

      const tabs = screen.getAllByRole('tab')
      fireEvent.keyDown(tabs[2], { key: 'Enter' })

      expect(onStepClick).toHaveBeenCalledWith(2)
    })

    it('calls onStepClick on Space key press', () => {
      const { onStepClick } = renderIndicator()

      const tabs = screen.getAllByRole('tab')
      fireEvent.keyDown(tabs[4], { key: ' ' })

      expect(onStepClick).toHaveBeenCalledWith(4)
    })

    it('moves to next step on ArrowRight key (with wrap-around)', () => {
      const { onStepClick } = renderIndicator({ currentStep: 2 })

      const tabs = screen.getAllByRole('tab')
      fireEvent.keyDown(tabs[2], { key: 'ArrowRight' })

      expect(onStepClick).toHaveBeenCalledWith(3)
    })

    it('wraps from last step to first on ArrowRight', () => {
      const { onStepClick } = renderIndicator({ currentStep: 4 })

      const tabs = screen.getAllByRole('tab')
      fireEvent.keyDown(tabs[4], { key: 'ArrowRight' })

      expect(onStepClick).toHaveBeenCalledWith(0)
    })

    it('moves to previous step on ArrowLeft key', () => {
      const { onStepClick } = renderIndicator({ currentStep: 2 })

      const tabs = screen.getAllByRole('tab')
      fireEvent.keyDown(tabs[2], { key: 'ArrowLeft' })

      expect(onStepClick).toHaveBeenCalledWith(1)
    })

    it('wraps from first step to last on ArrowLeft', () => {
      const { onStepClick } = renderIndicator({ currentStep: 0 })

      const tabs = screen.getAllByRole('tab')
      fireEvent.keyDown(tabs[0], { key: 'ArrowLeft' })

      expect(onStepClick).toHaveBeenCalledWith(4)
    })
  })

  // -------------------------------------------------------------------------
  // Additional: className merging
  // -------------------------------------------------------------------------

  describe('className merging', () => {
    it('merges custom className onto the container', () => {
      renderIndicator({ className: 'custom-test' })

      const tablist = screen.getByRole('tablist')
      expect(tablist).toHaveClass('custom-test')
    })
  })
})
