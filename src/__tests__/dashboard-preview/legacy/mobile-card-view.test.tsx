import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MobileCardView } from '@/components/dashboard-preview/mobile-card-view'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      className,
      'data-testid': dataTestId,
      ..._rest
    }: React.HTMLAttributes<HTMLDivElement> & { 'data-testid'?: string }) => (
      <div className={className} data-testid={dataTestId}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

// Default: no reduced motion
let mockReducedMotion = false
vi.mock('@/hooks/use-media-query', () => ({
  useMediaQuery: (query: string) => {
    if (query === '(prefers-reduced-motion: reduce)') {
      return mockReducedMotion
    }
    return false
  },
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderMobileCardView(className?: string) {
  return render(<MobileCardView className={className} />)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('MobileCardView', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockReducedMotion = false
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // -------------------------------------------------------------------------
  // TC-025: MobileCardView renders a card
  // -------------------------------------------------------------------------

  it('TC-025: renders a card container', () => {
    renderMobileCardView()

    const container = screen.getByTestId('mobile-card-view')
    expect(container).toBeInTheDocument()
  })

  it('TC-025: merges custom className', () => {
    renderMobileCardView('custom-class')

    const container = screen.getByTestId('mobile-card-view')
    expect(container).toHaveClass('custom-class')
  })

  // -------------------------------------------------------------------------
  // TC-025-extract: AI_EXTRACT card shows 4 categories
  // -------------------------------------------------------------------------

  it('TC-025-extract: initially shows AI_EXTRACT card with 4 categories', () => {
    renderMobileCardView()

    expect(screen.getByText('AI 분석 결과')).toBeInTheDocument()

    // 4 category labels
    expect(screen.getByText('상차지')).toBeInTheDocument()
    expect(screen.getByText('하차지')).toBeInTheDocument()
    expect(screen.getByText('화물/차량')).toBeInTheDocument()
    expect(screen.getByText('운임')).toBeInTheDocument()
  })

  it('TC-025-extract: each category shows displayValue', () => {
    renderMobileCardView()

    // Check representative displayValues from mock data
    expect(screen.getByText('서울 강남구 물류센터')).toBeInTheDocument()
    expect(screen.getByText('대전 유성구 산업단지')).toBeInTheDocument()
    expect(screen.getByText('카고 5톤')).toBeInTheDocument()
    expect(screen.getByText('420,000원')).toBeInTheDocument()
  })

  // -------------------------------------------------------------------------
  // TC-025-complete: COMPLETE card shows route/vehicle/fare summary
  // -------------------------------------------------------------------------

  it('TC-025-complete: after 4 seconds shows COMPLETE card with summary', () => {
    renderMobileCardView()

    // Advance 4 seconds to switch to COMPLETE card
    act(() => {
      vi.advanceTimersByTime(4000)
    })

    expect(screen.getByText('등록 완료')).toBeInTheDocument()

    // Phase 3 mock-data.ts (SSOT §4-3):
    //  - pickup.company = '아이다스로지스' → split(' ')[0] → '아이다스로지스'
    //  - delivery.company = '부산물류허브' → split(' ')[0] → '부산물류허브'
    //  - estimate.amount = 850000 → toLocaleString() → '850,000'
    // Route summary
    expect(screen.getByText('아이다스로지스 → 부산물류허브')).toBeInTheDocument()

    // Vehicle summary
    expect(screen.getByText('카고 5톤')).toBeInTheDocument()

    // Fare summary
    expect(screen.getByText('850,000원')).toBeInTheDocument()

    // Status badge
    expect(screen.getByText('완료')).toBeInTheDocument()
  })

  // -------------------------------------------------------------------------
  // TC-026: 2-step auto-transition (4s interval)
  // -------------------------------------------------------------------------

  it('TC-026: cycles between AI_EXTRACT and COMPLETE every 4 seconds', () => {
    renderMobileCardView()

    // Step 0: AI_EXTRACT
    expect(screen.getByText('AI 분석 결과')).toBeInTheDocument()

    // After 4s -> COMPLETE
    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(screen.getByText('등록 완료')).toBeInTheDocument()
    expect(screen.queryByText('AI 분석 결과')).not.toBeInTheDocument()

    // After another 4s -> back to AI_EXTRACT
    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(screen.getByText('AI 분석 결과')).toBeInTheDocument()
    expect(screen.queryByText('등록 완료')).not.toBeInTheDocument()
  })

  // -------------------------------------------------------------------------
  // prefers-reduced-motion: static COMPLETE
  // -------------------------------------------------------------------------

  it('shows static COMPLETE card when prefers-reduced-motion', () => {
    mockReducedMotion = true

    renderMobileCardView()

    expect(screen.getByText('등록 완료')).toBeInTheDocument()
    expect(screen.queryByText('AI 분석 결과')).not.toBeInTheDocument()

    // After 4s nothing should change
    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(screen.getByText('등록 완료')).toBeInTheDocument()
  })
})
