import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Input } from '@/components/ui/input'

/**
 * T-DASH3-M1-06 shadcn Input 단위 테스트
 * REQ-DASH3-051 — shadcn Input (3-C 하이브리드)
 */

describe('Input (shadcn)', () => {
  it('기본 렌더링 + type 전달', () => {
    render(<Input placeholder="email" type="email" />)
    const input = screen.getByPlaceholderText('email') as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input.type).toBe('email')
    // shadcn 기본 클래스
    expect(input.className).toContain('h-9')
    expect(input.className).toContain('rounded-md')
  })

  it('disabled 속성 전달', () => {
    render(<Input disabled placeholder="disabled-input" />)
    const input = screen.getByPlaceholderText('disabled-input')
    expect(input).toBeDisabled()
    expect(input.className).toContain('disabled:')
  })

  it('className 병합 (cn)', () => {
    render(<Input className="extra-class" placeholder="merge" />)
    const input = screen.getByPlaceholderText('merge')
    expect(input.className).toContain('extra-class')
    expect(input.className).toContain('h-9')
  })

  it('value/onChange forwarding', () => {
    render(
      <Input
        value="hello"
        onChange={() => undefined}
        placeholder="controlled"
      />,
    )
    const input = screen.getByPlaceholderText('controlled') as HTMLInputElement
    expect(input.value).toBe('hello')
  })
})
