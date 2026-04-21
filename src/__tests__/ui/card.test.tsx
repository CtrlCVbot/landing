import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

/**
 * T-DASH3-M1-06 shadcn Card 단위 테스트
 * REQ-DASH3-051 — shadcn Card (Header/Title/Description/Content/Footer)
 */

describe('Card (shadcn)', () => {
  it('Card + 하위 컴포넌트가 올바른 구조로 렌더링된다', () => {
    render(
      <Card data-testid="card-root">
        <CardHeader data-testid="card-header">
          <CardTitle>Title</CardTitle>
          <CardDescription>Desc</CardDescription>
        </CardHeader>
        <CardContent data-testid="card-content">Body</CardContent>
        <CardFooter data-testid="card-footer">Footer</CardFooter>
      </Card>,
    )

    expect(screen.getByTestId('card-root')).toBeInTheDocument()
    expect(screen.getByTestId('card-header')).toBeInTheDocument()
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Desc')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('Card에 shadcn 표준 클래스가 포함된다 (rounded + border)', () => {
    render(<Card data-testid="card">X</Card>)
    const card = screen.getByTestId('card')
    expect(card.className).toContain('rounded-')
    expect(card.className).toContain('border')
  })

  it('CardTitle은 h3 또는 semantic heading 스타일을 가진다', () => {
    render(<CardTitle data-testid="title">Heading</CardTitle>)
    const title = screen.getByTestId('title')
    // font-semibold (shadcn 표준)
    expect(title.className).toMatch(/font-(semibold|bold)/)
  })

  it('className 병합 (cn) - Card', () => {
    render(
      <Card className="extra-card" data-testid="card-merge">
        M
      </Card>,
    )
    const card = screen.getByTestId('card-merge')
    expect(card.className).toContain('extra-card')
    expect(card.className).toContain('rounded-')
  })
})
