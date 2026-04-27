/**
 * T-DASH3-M1-08 — Hero DashboardPreview 래퍼 max-w 확장 (Spike 발굴 해소)
 *
 * TC
 *  - TC-DASH3-INT-RESPONSIVE-3COL: DashboardPreview 블록 전용 래퍼가
 *    max-w-[1440px]로 확장되어 OrderForm의 lg:grid-cols-3 (≥1024px) 충족에
 *    필요한 가용폭을 확보한다.
 *
 * REQ
 *  - REQ-DASH3-007 + PRD §6-4
 *
 * 배경 (Spike 발굴)
 *  - 기존 Hero 래퍼 max-w-4xl(896px)에서는 AiPanel(380px) + OrderForm(flex-1)
 *    구조상 OrderForm 가용폭 ≈ 514px → lg breakpoint(1024px) 미달 →
 *    3-column grid가 세로 stack으로 접힘.
 *  - Hero 텍스트/버튼은 가독성을 위해 max-w-4xl을 유지하되, DashboardPreview
 *    블록만 독립 래퍼에서 max-w-[1440px]로 확장한다.
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { Hero } from '@/components/sections/hero'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('framer-motion', () => ({
  motion: {
    h1: ({
      children,
      className,
    }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className={className}>{children}</h1>
    ),
    p: ({
      children,
      className,
    }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className={className}>{children}</p>
    ),
    div: ({
      children,
      className,
    }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

vi.mock('@/components/shared/gradient-blob', () => ({
  GradientBlob: ({ className }: { className?: string }) => (
    <div data-testid="gradient-blob" className={className} />
  ),
}))

vi.mock('@/components/dashboard-preview/dashboard-preview', () => ({
  DashboardPreview: () => (
    <div data-testid="dashboard-preview">DashboardPreview</div>
  ),
}))

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Hero — DashboardPreview wrapper (T-DASH3-M1-08)', () => {
  describe('TC-DASH3-INT-RESPONSIVE-3COL', () => {
    it('DashboardPreview 래퍼가 max-w-[1440px] class를 포함한다', () => {
      render(<Hero />)
      const preview = screen.getByTestId('dashboard-preview')
      const wrapper = preview.parentElement
      expect(wrapper).not.toBeNull()
      expect(wrapper?.className).toContain('max-w-[1440px]')
    })

    it('DashboardPreview 래퍼가 w-full를 유지한다', () => {
      render(<Hero />)
      const preview = screen.getByTestId('dashboard-preview')
      const wrapper = preview.parentElement
      expect(wrapper?.className).toContain('w-full')
    })

    it('DashboardPreview 래퍼는 Hero 텍스트의 max-w-4xl과 독립적이다', () => {
      render(<Hero />)
      const preview = screen.getByTestId('dashboard-preview')
      const wrapper = preview.parentElement
      // 내부 래퍼는 max-w-4xl을 가지면 안 된다 (Hero 텍스트 전용)
      expect(wrapper?.className).not.toContain('max-w-4xl')
    })

    it('DashboardPreview 바깥 컨테이너가 mt-16 spacing을 유지한다', () => {
      render(<Hero />)
      const preview = screen.getByTestId('dashboard-preview')
      // preview → wrapper(max-w-[1440px]) → outer(mt-16 ...)
      const outerContainer = preview.parentElement?.parentElement
      expect(outerContainer).not.toBeNull()
      expect(outerContainer?.className).toContain('mt-16')
    })

    it('DashboardPreview 바깥 컨테이너가 flex justify-center로 중앙 정렬한다', () => {
      render(<Hero />)
      const preview = screen.getByTestId('dashboard-preview')
      const outerContainer = preview.parentElement?.parentElement
      expect(outerContainer?.className).toContain('flex')
      expect(outerContainer?.className).toContain('justify-center')
    })

    it('Hero 타이틀 영역은 기존대로 렌더링된다 (텍스트 가독성 유지)', () => {
      render(<Hero />)
      expect(screen.getByText('운송 운영을 한눈에')).toBeInTheDocument()
      expect(screen.getByText('오더부터 정산까지')).toBeInTheDocument()
    })
  })
})

describe('Hero — liquid gradient background (T-HLG-TEST-01)', () => {
  it('decorative liquid gradient background layer를 렌더링한다', () => {
    render(<Hero />)
    const background = screen.getByTestId('hero-liquid-gradient-background')

    expect(background).toBeInTheDocument()
    expect(background).toHaveAttribute('aria-hidden', 'true')
  })

  it('background layer가 CTA 상호작용을 가로채지 않는다', () => {
    render(<Hero />)
    const background = screen.getByTestId('hero-liquid-gradient-background')
    const cta = screen.getByRole('link', { name: '도입 문의하기' })

    expect(background.className).toContain('pointer-events-none')
    expect(cta).toHaveAttribute('href', '#contact')
  })

  it('background와 foreground layer 순서가 class로 명시된다', () => {
    render(<Hero />)
    const background = screen.getByTestId('hero-liquid-gradient-background')
    const title = screen.getByRole('heading', { name: '운송 운영을 한눈에' })
    const preview = screen.getByTestId('dashboard-preview')
    const previewOuter = preview.parentElement?.parentElement

    expect(background.className).toContain('z-0')
    expect(title.className).toContain('z-10')
    expect(previewOuter?.className).toContain('z-10')
  })

  it('기존 GradientBlob fallback을 보존한다', () => {
    render(<Hero />)

    expect(screen.getAllByTestId('gradient-blob')).toHaveLength(2)
  })
})
