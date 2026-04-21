import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Textarea } from '@/components/ui/textarea'

/**
 * T-DASH3-M1-06 shadcn Textarea 단위 테스트
 * REQ-DASH3-051 — shadcn Textarea (3-C 하이브리드)
 */

describe('Textarea (shadcn)', () => {
  it('기본 렌더링 (textarea 태그)', () => {
    render(<Textarea placeholder="note" />)
    const ta = screen.getByPlaceholderText('note')
    expect(ta).toBeInTheDocument()
    expect(ta.tagName).toBe('TEXTAREA')
    // shadcn 기본 클래스: min-h
    expect(ta.className).toContain('min-h-')
    expect(ta.className).toContain('rounded-md')
  })

  it('disabled 속성 전달', () => {
    render(<Textarea disabled placeholder="disabled-ta" />)
    const ta = screen.getByPlaceholderText('disabled-ta')
    expect(ta).toBeDisabled()
  })

  it('className 병합 (cn)', () => {
    render(<Textarea className="extra-ta" placeholder="merge-ta" />)
    const ta = screen.getByPlaceholderText('merge-ta')
    expect(ta.className).toContain('extra-ta')
    expect(ta.className).toContain('min-h-')
  })

  it('rows/cols 등 textarea 속성 전달', () => {
    render(<Textarea rows={5} placeholder="rows-ta" />)
    const ta = screen.getByPlaceholderText('rows-ta') as HTMLTextAreaElement
    expect(ta.rows).toBe(5)
  })
})
