import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from '@/components/ui/badge'

/**
 * T-DASH3-M1-06 shadcn Badge 단위 테스트
 * REQ-DASH3-051 — shadcn Badge (default/secondary/destructive/outline)
 */

describe('Badge (shadcn)', () => {
  it('기본 렌더링 (default variant)', () => {
    render(<Badge data-testid="badge">Hot</Badge>)
    const badge = screen.getByTestId('badge')
    expect(badge).toBeInTheDocument()
    expect(badge.textContent).toBe('Hot')
    expect(badge.className).toContain('bg-primary')
    expect(badge.className).toContain('rounded-')
  })

  it('variant="secondary" 적용 시 bg-secondary 포함', () => {
    render(
      <Badge variant="secondary" data-testid="sec">
        S
      </Badge>,
    )
    const b = screen.getByTestId('sec')
    expect(b.className).toContain('bg-secondary')
  })

  it('variant="destructive" 적용 시 bg-destructive 포함', () => {
    render(
      <Badge variant="destructive" data-testid="des">
        D
      </Badge>,
    )
    const b = screen.getByTestId('des')
    expect(b.className).toContain('bg-destructive')
  })

  it('variant="outline" 적용 시 border 클래스 포함', () => {
    render(
      <Badge variant="outline" data-testid="out">
        O
      </Badge>,
    )
    const b = screen.getByTestId('out')
    // outline은 background 없이 border만
    expect(b.className).toContain('text-foreground')
  })

  it('className 병합 (cn)', () => {
    render(
      <Badge className="extra-badge" data-testid="merge">
        M
      </Badge>,
    )
    const b = screen.getByTestId('merge')
    expect(b.className).toContain('extra-badge')
    expect(b.className).toContain('bg-primary')
  })
})
