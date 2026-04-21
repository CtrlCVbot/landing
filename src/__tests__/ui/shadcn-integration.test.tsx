import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/**
 * T-DASH3-M1-06 shadcn 3-C 하이브리드 통합 테스트
 * TC-DASH3-INT-SHADCN / REQ-DASH3-051
 *
 * 검증:
 *   1. 5개 shadcn 컴포넌트가 한 페이지에 모두 렌더링된다
 *   2. 각 컴포넌트가 cn() 유틸을 통해 className을 병합한다
 *   3. shadcn v2 표준 token 클래스(bg-primary 등)가 적용된다
 *      (jsdom은 computed style 미지원 — 클래스 존재 여부로 검증)
 *   4. 5개 외 컴포넌트(Select/Dialog/Popover 등)는 설치 대상 아님 (Phase 1 스펙 §4)
 */

describe('shadcn 3-C 하이브리드 통합 (TC-DASH3-INT-SHADCN)', () => {
  it('5개 컴포넌트가 한 페이지에 모두 렌더링된다', () => {
    render(
      <Card data-testid="root-card">
        <CardHeader>
          <CardTitle>AI 운송 등록</CardTitle>
          <CardDescription>카고 정보를 입력하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <label htmlFor="dep">출발지</label>
          <Input id="dep" placeholder="서울" />

          <label htmlFor="note">메모</label>
          <Textarea id="note" placeholder="상세 요청" />

          <div>
            <Badge data-testid="badge-new">신규</Badge>
            <Badge variant="secondary" data-testid="badge-hot">
              인기
            </Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Button data-testid="submit-btn" type="submit">
            등록
          </Button>
          <Button variant="outline" data-testid="cancel-btn">
            취소
          </Button>
        </CardFooter>
      </Card>,
    )

    // 5개 컴포넌트 존재
    expect(screen.getByTestId('root-card')).toBeInTheDocument()
    expect(screen.getByText('AI 운송 등록')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('서울')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('상세 요청')).toBeInTheDocument()
    expect(screen.getByTestId('badge-new')).toBeInTheDocument()
    expect(screen.getByTestId('badge-hot')).toBeInTheDocument()
    expect(screen.getByTestId('submit-btn')).toBeInTheDocument()
    expect(screen.getByTestId('cancel-btn')).toBeInTheDocument()
  })

  it('shadcn 표준 토큰 클래스(bg-primary / bg-secondary 등)가 올바르게 적용된다', () => {
    render(
      <>
        <Button data-testid="primary-btn">primary</Button>
        <Button variant="secondary" data-testid="secondary-btn">
          secondary
        </Button>
        <Badge data-testid="primary-badge">P</Badge>
        <Badge variant="destructive" data-testid="destructive-badge">
          D
        </Badge>
      </>,
    )

    // globals.css alias: bg-primary → --color-accent (#8b5cf6)
    expect(screen.getByTestId('primary-btn').className).toContain('bg-primary')
    expect(screen.getByTestId('secondary-btn').className).toContain(
      'bg-secondary',
    )
    expect(screen.getByTestId('primary-badge').className).toContain('bg-primary')
    expect(screen.getByTestId('destructive-badge').className).toContain(
      'bg-destructive',
    )
  })

  it('cn() 병합이 5개 컴포넌트 모두에서 동작한다', () => {
    render(
      <>
        <Button className="u-btn" data-testid="b">
          B
        </Button>
        <Input className="u-input" placeholder="i" />
        <Textarea className="u-ta" placeholder="t" />
        <Card className="u-card" data-testid="c">
          C
        </Card>
        <Badge className="u-badge" data-testid="bd">
          Bd
        </Badge>
      </>,
    )

    expect(screen.getByTestId('b').className).toContain('u-btn')
    expect(screen.getByPlaceholderText('i').className).toContain('u-input')
    expect(screen.getByPlaceholderText('t').className).toContain('u-ta')
    expect(screen.getByTestId('c').className).toContain('u-card')
    expect(screen.getByTestId('bd').className).toContain('u-badge')
  })
})
