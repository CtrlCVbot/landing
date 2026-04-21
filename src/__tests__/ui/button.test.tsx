import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from '@/components/ui/button'

/**
 * T-DASH3-M1-06 shadcn Button 단위 테스트
 * REQ-DASH3-051 — shadcn 3-C 하이브리드 (Button 포함)
 *
 * 검증:
 *   - 기본 렌더링 (default variant + size)
 *   - variants (default/secondary/destructive/outline/ghost/link)
 *   - sizes (default/sm/lg/icon)
 *   - asChild prop (Slot 위임)
 *   - className 병합 (cn() 동작)
 */

describe('Button (shadcn)', () => {
  // --- 기본 렌더링 ----------------------------------------------------

  it('기본 variant/size로 렌더링된다', () => {
    render(<Button>Click me</Button>)
    const btn = screen.getByRole('button', { name: /click me/i })
    expect(btn).toBeInTheDocument()
    // default variant는 bg-primary를 가져야 함 (globals.css alias로 --color-accent 연결)
    expect(btn.className).toContain('bg-primary')
  })

  // --- variant 검증 ---------------------------------------------------

  it('variant="secondary" 적용 시 bg-secondary 클래스가 포함된다', () => {
    render(<Button variant="secondary">S</Button>)
    const btn = screen.getByRole('button', { name: 'S' })
    expect(btn.className).toContain('bg-secondary')
  })

  it('variant="destructive" 적용 시 bg-destructive 클래스가 포함된다', () => {
    render(<Button variant="destructive">D</Button>)
    const btn = screen.getByRole('button', { name: 'D' })
    expect(btn.className).toContain('bg-destructive')
  })

  it('variant="outline" 적용 시 border 클래스가 포함된다', () => {
    render(<Button variant="outline">O</Button>)
    const btn = screen.getByRole('button', { name: 'O' })
    expect(btn.className).toContain('border')
  })

  it('variant="ghost" 적용 시 hover:bg-accent 클래스가 포함된다', () => {
    render(<Button variant="ghost">G</Button>)
    const btn = screen.getByRole('button', { name: 'G' })
    expect(btn.className).toContain('hover:bg-accent')
  })

  it('variant="link" 적용 시 underline-offset 클래스가 포함된다', () => {
    render(<Button variant="link">L</Button>)
    const btn = screen.getByRole('button', { name: 'L' })
    expect(btn.className).toContain('underline-offset')
  })

  // --- size 검증 ------------------------------------------------------

  it('size="sm" 적용 시 h-8 또는 h-9 크기 클래스가 포함된다', () => {
    render(<Button size="sm">SM</Button>)
    const btn = screen.getByRole('button', { name: 'SM' })
    expect(btn.className).toMatch(/h-(8|9)/)
  })

  it('size="lg" 적용 시 h-10 이상 높이 클래스가 포함된다', () => {
    render(<Button size="lg">LG</Button>)
    const btn = screen.getByRole('button', { name: 'LG' })
    expect(btn.className).toMatch(/h-1[0-2]/)
  })

  it('size="icon" 적용 시 정사각 크기 클래스가 포함된다', () => {
    render(<Button size="icon" aria-label="icon">i</Button>)
    const btn = screen.getByRole('button', { name: 'icon' })
    expect(btn.className).toMatch(/w-(8|9|10)/)
  })

  // --- asChild (Slot) -------------------------------------------------

  it('asChild={true}일 때 자식 엘리먼트로 렌더링된다 (link)', () => {
    render(
      <Button asChild>
        <a href="/test">Link</a>
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Link' })
    expect(link).toBeInTheDocument()
    expect(link.tagName).toBe('A')
    expect(link.getAttribute('href')).toBe('/test')
    // Button의 클래스가 자식(a)에 병합되어야 함
    expect(link.className).toContain('bg-primary')
  })

  // --- className 병합 (cn) --------------------------------------------

  it('외부 className이 기본 클래스와 병합된다', () => {
    render(<Button className="custom-extra">Merge</Button>)
    const btn = screen.getByRole('button', { name: 'Merge' })
    expect(btn.className).toContain('custom-extra')
    // 기본 클래스도 유지
    expect(btn.className).toContain('bg-primary')
  })

  // --- HTML attr forwarding -------------------------------------------

  it('disabled, type 등 HTML 속성이 전달된다', () => {
    render(
      <Button disabled type="submit">
        Submit
      </Button>,
    )
    const btn = screen.getByRole('button', { name: 'Submit' })
    expect(btn).toBeDisabled()
    expect(btn.getAttribute('type')).toBe('submit')
  })
})
