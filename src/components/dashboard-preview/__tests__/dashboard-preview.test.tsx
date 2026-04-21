/**
 * T-DASH3-M1-04 — DashboardPreview Phase 3 Feature flag 분기 통합 테스트
 *
 * TC
 *  - TC-DASH3-INT-FLAG: env / query 기반 AiRegisterMain 렌더 분기
 *
 * REQ
 *  - REQ-DASH3-052, 053 (Phase 3 활성화 조건)
 *  - REQ-DASH-023, 024 (Tablet scale 0.40, Mobile MobileCardView)
 *
 * 범위
 *  - Flag OFF (기본): 기존 Phase 1/2 AiPanelPreview + FormPreview 렌더
 *  - Flag ON (env NEXT_PUBLIC_DASH_V3=phase3): AiRegisterMain 렌더
 *  - Flag ON (env NEXT_PUBLIC_DASH_V3=spike):  AiRegisterMain 렌더
 *  - Flag ON (query ?dashV3=1): AiRegisterMain 렌더
 *  - 두 렌더 경로 상호 배타
 *  - Tablet 뷰포트 scale 0.40 (REQ-DASH-023)
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'

import { DashboardPreview } from '@/components/dashboard-preview/dashboard-preview'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

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

let mediaQueryResults: Record<string, boolean> = {}
vi.mock('@/hooks/use-media-query', () => ({
  useMediaQuery: (query: string) => mediaQueryResults[query] ?? false,
}))

vi.mock('@/components/dashboard-preview/mobile-card-view', () => ({
  MobileCardView: ({ className }: { className?: string }) => (
    <div data-testid="mobile-card-view" className={className}>
      MobileCardView
    </div>
  ),
}))

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

const ORIGINAL_HREF = window.location.href

function setQuery(search: string) {
  const url = new URL(ORIGINAL_HREF)
  url.search = search
  window.history.replaceState({}, '', url.toString())
}

function resetQuery() {
  window.history.replaceState({}, '', ORIGINAL_HREF)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DashboardPreview — Phase 3 Feature flag', () => {
  beforeEach(() => {
    setDesktop()
  })

  afterEach(() => {
    resetQuery()
    vi.unstubAllEnvs()
  })

  describe('TC-DASH3-INT-FLAG: flag OFF renders Phase 1/2', () => {
    it('renders AiPanelPreview + FormPreview (legacy path) by default', () => {
      render(<DashboardPreview />)
      expect(screen.getByTestId('ai-panel')).toBeInTheDocument()
      expect(screen.getByTestId('form-preview')).toBeInTheDocument()
    })

    it('does NOT render AiRegisterMain regions when flag is off', () => {
      render(<DashboardPreview />)
      expect(screen.queryByLabelText('AI 화물 등록 패널')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('주문 등록 폼')).not.toBeInTheDocument()
    })
  })

  describe('TC-DASH3-INT-FLAG: flag ON via env NEXT_PUBLIC_DASH_V3', () => {
    it('env=phase3: renders AiRegisterMain (2-col shell regions)', () => {
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'phase3')
      render(<DashboardPreview />)
      expect(screen.getByLabelText('AI 화물 등록 패널')).toBeInTheDocument()
      expect(screen.getByLabelText('주문 등록 폼')).toBeInTheDocument()
    })

    it('env=phase3: does NOT render Phase 1/2 components', () => {
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'phase3')
      render(<DashboardPreview />)
      expect(screen.queryByTestId('ai-panel')).not.toBeInTheDocument()
      expect(screen.queryByTestId('form-preview')).not.toBeInTheDocument()
    })

    it('env=spike: renders AiRegisterMain too (shared Phase 3 path)', () => {
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'spike')
      render(<DashboardPreview />)
      expect(screen.getByLabelText('AI 화물 등록 패널')).toBeInTheDocument()
      expect(screen.getByLabelText('주문 등록 폼')).toBeInTheDocument()
    })

    it('env=something-else: keeps Phase 1/2', () => {
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'something-else')
      render(<DashboardPreview />)
      expect(screen.getByTestId('ai-panel')).toBeInTheDocument()
      expect(screen.queryByLabelText('AI 화물 등록 패널')).not.toBeInTheDocument()
    })
  })

  describe('TC-DASH3-INT-FLAG: flag ON via query ?dashV3=1', () => {
    it('query=1: renders AiRegisterMain', () => {
      setQuery('?dashV3=1')
      render(<DashboardPreview />)
      expect(screen.getByLabelText('AI 화물 등록 패널')).toBeInTheDocument()
      expect(screen.getByLabelText('주문 등록 폼')).toBeInTheDocument()
    })

    it('query=0: stays Phase 1/2', () => {
      setQuery('?dashV3=0')
      render(<DashboardPreview />)
      expect(screen.getByTestId('ai-panel')).toBeInTheDocument()
      expect(screen.queryByLabelText('AI 화물 등록 패널')).not.toBeInTheDocument()
    })
  })

  describe('TC-DASH3-INT-FLAG: exclusive rendering', () => {
    it('flag ON: Phase 1/2 and AiRegisterMain do not coexist', () => {
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'phase3')
      render(<DashboardPreview />)

      const ariaPanel = screen.queryByLabelText('AI 화물 등록 패널')
      const legacyPanel = screen.queryByTestId('ai-panel')
      // Exactly one of them is present
      expect(Boolean(ariaPanel) !== Boolean(legacyPanel)).toBe(true)
      expect(ariaPanel).toBeInTheDocument()
      expect(legacyPanel).not.toBeInTheDocument()
    })
  })

  describe('REQ-DASH-023/024: Tablet scaleFactor 0.40', () => {
    it('tablet uses scaleFactor 0.40 in Phase 1/2 path', () => {
      setTablet()
      render(<DashboardPreview />)
      const scaledInner = screen.getByTestId('scaled-content-inner')
      expect(scaledInner.style.transform).toBe('scale(0.4)')
    })

    it('desktop keeps scaleFactor 0.45', () => {
      setDesktop()
      render(<DashboardPreview />)
      const scaledInner = screen.getByTestId('scaled-content-inner')
      expect(scaledInner.style.transform).toBe('scale(0.45)')
    })

    it('mobile renders MobileCardView (no PreviewChrome)', () => {
      setMobile()
      render(<DashboardPreview />)
      expect(screen.getByTestId('mobile-card-view')).toBeInTheDocument()
      expect(screen.queryByTestId('preview-chrome')).not.toBeInTheDocument()
    })

    it('tablet with Phase 3 flag ON: scaleFactor still 0.40', () => {
      setTablet()
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'phase3')
      render(<DashboardPreview />)
      const scaledInner = screen.getByTestId('scaled-content-inner')
      expect(scaledInner.style.transform).toBe('scale(0.4)')
    })
  })
})
