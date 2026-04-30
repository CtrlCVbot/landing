import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { WorkflowManual } from '@/components/sections/workflow-manual'

vi.mock('framer-motion', () => ({
  motion: {
    section: ({
      children,
      className,
      id,
    }: React.HTMLAttributes<HTMLElement>) => (
      <section id={id} className={className}>{children}</section>
    ),
    div: ({
      children,
      className,
    }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className}>{children}</div>
    ),
    li: ({
      children,
      className,
    }: React.LiHTMLAttributes<HTMLLIElement>) => (
      <li className={className}>{children}</li>
    ),
  },
}))

describe('WorkflowManual section - F3 workflow section', () => {
  it('renders the customization-focused section heading and intro copy', () => {
    render(<WorkflowManual />)

    expect(
      screen.getByRole('heading', {
        name: '화주와 주선사별 운송 운영을 하나의 흐름으로 조율합니다',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        '요청 양식, 배차 방식, 정산 기준, 외부 채널 연동까지 회사별 운영 방식에 맞춰 정리합니다.',
      ),
    ).toBeInTheDocument()
  })

  it('renders all workflow steps with Hwamulman before settlement and invoice', () => {
    render(<WorkflowManual />)

    const steps = screen.getAllByRole('listitem')
    expect(steps).toHaveLength(6)
    expect(steps.map((step) => within(step).getByRole('heading').textContent)).toEqual([
      'AI 오더 등록',
      '상하차지 관리',
      '배차/운송 상태',
      '화물맨 연동',
      '정산 자동화',
      '세금계산서 관리',
    ])
  })

  it('shows per-step customization copy without repeating product cards', () => {
    render(<WorkflowManual />)

    expect(screen.getByText(/화주별 요청 양식/)).toBeInTheDocument()
    expect(screen.getByText(/전송 시점/)).toBeInTheDocument()
    expect(screen.getByText(/발행 상태/)).toBeInTheDocument()
    expect(screen.queryByText('OPTIC Broker')).not.toBeInTheDocument()
    expect(screen.queryByText('OPTIC Shipper')).not.toBeInTheDocument()
  })
})
