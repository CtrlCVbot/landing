import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { DashboardPreview } from '@/components/dashboard-preview/dashboard-preview'
import { PREVIEW_STEPS } from '@/lib/preview-steps' // eslint-disable-line @typescript-eslint/no-unused-vars

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Mock framer-motion to avoid animation complexities in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      className,
      'aria-label': ariaLabel,
      onMouseEnter,
      onMouseLeave,
      onClick,
      ..._rest
    }: React.HTMLAttributes<HTMLDivElement>) => (
      <div
        className={className}
        aria-label={ariaLabel}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

// Configurable media query mock
let mediaQueryResults: Record<string, boolean> = {}
vi.mock('@/hooks/use-media-query', () => ({
  useMediaQuery: (query: string) => mediaQueryResults[query] ?? false,
}))

// Mock MobileCardView so we can detect its rendering without its internals
vi.mock('@/components/dashboard-preview/mobile-card-view', () => ({
  MobileCardView: ({ className }: { className?: string }) => (
    <div data-testid="mobile-card-view" className={className}>
      MobileCardView
    </div>
  ),
}))

// Spy useAutoPlay to verify enabled flag in EC-02
const useAutoPlaySpy = vi.fn()
vi.mock('@/components/dashboard-preview/use-auto-play', async () => {
  const actual = await vi.importActual<
    typeof import('@/components/dashboard-preview/use-auto-play')
  >('@/components/dashboard-preview/use-auto-play')
  return {
    useAutoPlay: (options: Parameters<typeof actual.useAutoPlay>[0]) => {
      useAutoPlaySpy(options)
      return actual.useAutoPlay(options)
    },
  }
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function setDesktop() {
  mediaQueryResults = {
    '(prefers-reduced-motion: reduce)': false,
    '(max-width: 767px)': false,
    '(min-width: 768px) and (max-width: 1023px)': false,
  }
}

function setTablet() {
  mediaQueryResults = {
    '(prefers-reduced-motion: reduce)': false,
    '(max-width: 767px)': false,
    '(min-width: 768px) and (max-width: 1023px)': true,
  }
}

function setMobile() {
  mediaQueryResults = {
    '(prefers-reduced-motion: reduce)': false,
    '(max-width: 767px)': true,
    '(min-width: 768px) and (max-width: 1023px)': false,
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DashboardPreview', () => {
  beforeEach(() => {
    setDesktop()
    useAutoPlaySpy.mockClear()
  })

  it('renders PreviewChrome, AiPanelPreview, and FormPreview', () => {
    render(<DashboardPreview />)

    expect(screen.getByTestId('preview-chrome')).toBeInTheDocument()
    expect(screen.getByTestId('ai-panel')).toBeInTheDocument()
    expect(screen.getByTestId('form-preview')).toBeInTheDocument()
  })

  it('has aria-label for accessibility', () => {
    render(<DashboardPreview />)

    const container = screen.getByLabelText('AI 화물 등록 워크플로우 데모 미리보기')
    expect(container).toBeInTheDocument()
  })

  it('passes PREVIEW_STEPS[0] aiPanelState to AiPanelPreview in initial state', () => {
    render(<DashboardPreview />)

    // INITIAL step has empty inputText and idle extractState
    const textarea = screen.getByTestId('ai-textarea')
    expect(textarea).toHaveTextContent('카카오톡 메시지를 입력하세요')

    // No result buttons in INITIAL step
    expect(screen.queryByTestId('ai-result-buttons')).not.toBeInTheDocument()
  })

  it('merges custom className', () => {
    render(<DashboardPreview className="custom-test" />)

    const container = screen.getByLabelText('AI 화물 등록 워크플로우 데모 미리보기')
    expect(container).toHaveClass('custom-test')
  })

  // -------------------------------------------------------------------------
  // REQ-DASH-023: Desktop scaleFactor=0.45
  // -------------------------------------------------------------------------

  it('REQ-DASH-023: desktop uses scaleFactor 0.45', () => {
    setDesktop()
    render(<DashboardPreview />)

    const scaledInner = screen.getByTestId('scaled-content-inner')
    expect(scaledInner.style.transform).toBe('scale(0.45)')
  })

  // -------------------------------------------------------------------------
  // REQ-DASH-023/024 (M1-04): Tablet scaleFactor=0.40
  //   기존 0.38 → 0.40 로 상향. Phase 3 REQ-DASH3-053 연동 (Tablet 가독성 개선).
  // -------------------------------------------------------------------------

  it('REQ-DASH-023: tablet uses scaleFactor 0.40', () => {
    setTablet()
    render(<DashboardPreview />)

    const scaledInner = screen.getByTestId('scaled-content-inner')
    expect(scaledInner.style.transform).toBe('scale(0.4)')
  })

  // -------------------------------------------------------------------------
  // REQ-DASH-024: Mobile renders MobileCardView instead of PreviewChrome
  // -------------------------------------------------------------------------

  it('REQ-DASH-024: mobile renders MobileCardView, not PreviewChrome', () => {
    setMobile()
    render(<DashboardPreview />)

    expect(screen.getByTestId('mobile-card-view')).toBeInTheDocument()
    expect(screen.queryByTestId('preview-chrome')).not.toBeInTheDocument()
    expect(screen.queryByTestId('ai-panel')).not.toBeInTheDocument()
    expect(screen.queryByTestId('form-preview')).not.toBeInTheDocument()
  })

  it('REQ-DASH-024: mobile still has aria-label', () => {
    setMobile()
    render(<DashboardPreview />)

    const container = screen.getByLabelText('AI 화물 등록 워크플로우 데모 미리보기')
    expect(container).toBeInTheDocument()
  })

  // -------------------------------------------------------------------------
  // EC-02: Mobile에서는 useAutoPlay enabled=false (타이머 정지 최적화)
  // -------------------------------------------------------------------------

  it('EC-02: desktop calls useAutoPlay with enabled=true', () => {
    setDesktop()
    render(<DashboardPreview />)

    const lastCall = useAutoPlaySpy.mock.calls[useAutoPlaySpy.mock.calls.length - 1]
    expect(lastCall[0].enabled).toBe(true)
  })

  it('EC-02: mobile calls useAutoPlay with enabled=false', () => {
    setMobile()
    render(<DashboardPreview />)

    const lastCall = useAutoPlaySpy.mock.calls[useAutoPlaySpy.mock.calls.length - 1]
    expect(lastCall[0].enabled).toBe(false)
  })

  // -------------------------------------------------------------------------
  // Phase 2: cinematic ↔ interactive mode integration
  // (REQ-DASH-033, REQ-DASH-034, REQ-DASH-035, REQ-DASH-051)
  // -------------------------------------------------------------------------

  describe('Phase 2: interactive mode', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('TC-033: initial mode is cinematic — InteractiveOverlay not rendered', () => {
      setDesktop()
      render(<DashboardPreview />)

      expect(screen.queryByTestId('interactive-overlay')).not.toBeInTheDocument()
    })

    it('TC-034: clicking inside preview enters interactive mode — Overlay renders', () => {
      setDesktop()
      render(<DashboardPreview />)

      const container = screen.getByLabelText(
        'AI 화물 등록 워크플로우 데모 미리보기',
      )

      act(() => {
        fireEvent.click(container)
      })

      expect(screen.getByTestId('interactive-overlay')).toBeInTheDocument()
    })

    it('TC-034: clicking on Step Indicator does NOT enter interactive mode', () => {
      setDesktop()
      render(<DashboardPreview />)

      const tabs = screen.getAllByRole('tab')
      act(() => {
        fireEvent.click(tabs[2])
      })

      expect(screen.queryByTestId('interactive-overlay')).not.toBeInTheDocument()
    })

    it('TC-035: inactive 10s → returns to cinematic (Overlay disappears)', () => {
      setDesktop()
      render(<DashboardPreview />)

      const container = screen.getByLabelText(
        'AI 화물 등록 워크플로우 데모 미리보기',
      )
      act(() => {
        fireEvent.click(container)
      })
      expect(screen.getByTestId('interactive-overlay')).toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(10_000)
      })

      expect(screen.queryByTestId('interactive-overlay')).not.toBeInTheDocument()
    })

    it('TC-051: Escape key in interactive mode returns to cinematic immediately', () => {
      setDesktop()
      render(<DashboardPreview />)

      const container = screen.getByLabelText(
        'AI 화물 등록 워크플로우 데모 미리보기',
      )
      act(() => {
        fireEvent.click(container)
      })
      expect(screen.getByTestId('interactive-overlay')).toBeInTheDocument()

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      })

      expect(screen.queryByTestId('interactive-overlay')).not.toBeInTheDocument()
    })

    it('Mobile: click does not enter interactive mode (Overlay never renders)', () => {
      setMobile()
      render(<DashboardPreview />)

      const container = screen.getByLabelText(
        'AI 화물 등록 워크플로우 데모 미리보기',
      )
      act(() => {
        fireEvent.click(container)
      })

      expect(screen.queryByTestId('interactive-overlay')).not.toBeInTheDocument()
    })

    it('Tablet: renders 6 hit areas after entering interactive mode', () => {
      setTablet()
      render(<DashboardPreview />)

      const container = screen.getByLabelText(
        'AI 화물 등록 워크플로우 데모 미리보기',
      )
      act(() => {
        fireEvent.click(container)
      })

      expect(screen.getByTestId('interactive-overlay')).toBeInTheDocument()
      // Tablet hit areas = 6 (TABLET_HIT_AREAS.slice(0, 6))
      expect(screen.getAllByTestId(/^hit-area-/)).toHaveLength(6)
    })

    it('Desktop: renders 11 hit areas after entering interactive mode', () => {
      setDesktop()
      render(<DashboardPreview />)

      const container = screen.getByLabelText(
        'AI 화물 등록 워크플로우 데모 미리보기',
      )
      act(() => {
        fireEvent.click(container)
      })

      expect(screen.getAllByTestId(/^hit-area-/)).toHaveLength(11)
    })

    // -----------------------------------------------------------------------
    // TASK-DASH-018: aria-live status region
    // -----------------------------------------------------------------------
    it('TC-048: renders a role="status" aria-live="polite" sr-only region', () => {
      setDesktop()
      render(<DashboardPreview />)

      const status = screen.getByRole('status')
      expect(status).toBeInTheDocument()
      expect(status).toHaveAttribute('aria-live', 'polite')
      expect(status).toHaveClass('sr-only')
    })

    it('TC-048: status region announces entering interactive mode', () => {
      setDesktop()
      render(<DashboardPreview />)

      const status = screen.getByRole('status')
      expect(status).toHaveTextContent('')

      const container = screen.getByLabelText(
        'AI 화물 등록 워크플로우 데모 미리보기',
      )
      act(() => {
        fireEvent.click(container)
      })

      expect(status).toHaveTextContent('데모 체험 모드를 시작했습니다')
    })

    it('TC-048: status region announces exiting interactive mode (Escape)', () => {
      setDesktop()
      render(<DashboardPreview />)

      const container = screen.getByLabelText(
        'AI 화물 등록 워크플로우 데모 미리보기',
      )
      act(() => {
        fireEvent.click(container)
      })
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      })

      const status = screen.getByRole('status')
      expect(status).toHaveTextContent('데모 체험 모드를 종료했습니다')
    })
  })

  // ---------------------------------------------------------------------------
  // EC-03: Mobile 인터랙티브 비활성화 엣지 케이스 (REQ-DASH-045)
  // ---------------------------------------------------------------------------
  describe('EC-03: Mobile 인터랙티브 비활성화 엣지 케이스', () => {
    it('REQ-DASH-045: mobile click does not call enterInteractive (mode stays cinematic)', () => {
      setMobile()
      render(<DashboardPreview />)

      // Mobile에서는 MobileCardView가 렌더링되므로 interactive-overlay 절대 존재하지 않음
      const container = screen.getByLabelText(
        'AI 화물 등록 워크플로우 데모 미리보기',
      )
      act(() => {
        fireEvent.click(container)
      })

      expect(screen.queryByTestId('interactive-overlay')).not.toBeInTheDocument()
    })

    it('mobile: Escape key does not exit (mode was never interactive)', () => {
      setMobile()
      render(<DashboardPreview />)

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      })

      // Mobile에서 Escape는 아무 영향 없음 (error 없음)
      expect(screen.getByTestId('mobile-card-view')).toBeInTheDocument()
    })
  })

  // ---------------------------------------------------------------------------
  // REQ-DASH-046/047: Tablet 히트 영역 검증
  // ---------------------------------------------------------------------------
  describe('REQ-DASH-046/047: Tablet 히트 영역 검증', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('Tablet: hit area IDs match TABLET_HIT_AREAS', () => {
      setTablet()
      render(<DashboardPreview />)

      const container = screen.getByLabelText(
        'AI 화물 등록 워크플로우 데모 미리보기',
      )
      act(() => {
        fireEvent.click(container)
      })

      const expectedIds = [
        'ai-input',
        'extract-button',
        'result-departure',
        'result-destination',
        'result-cargo',
        'result-fare',
      ]
      expectedIds.forEach((id) => {
        expect(screen.getByTestId(`hit-area-${id}`)).toBeInTheDocument()
      })
      // Form 영역 없음 검증
      expect(
        screen.queryByTestId('hit-area-form-cargo-info'),
      ).not.toBeInTheDocument()
    })
  })
})
