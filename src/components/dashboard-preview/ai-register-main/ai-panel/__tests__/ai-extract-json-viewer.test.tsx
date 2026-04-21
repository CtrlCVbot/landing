/**
 * T-DASH3-M2-08 — AiExtractJsonViewer 단위 테스트 (TC-DASH3-UNIT-JSONVIEWER)
 *
 * TC
 *  - TC-DASH3-UNIT-JSONVIEWER: 접힘/펼침 토글 + JSON pretty print + chevron 아이콘
 *
 * REQ
 *  - REQ-DASH3-003 (AiPanel 컴포넌트 복제 매니페스트 — AiExtractJsonViewer)
 *
 * 범위
 *  - stateless(로컬 expanded state 만 보유) AiExtractJsonViewer 컴포넌트.
 *  - json: Record<string, unknown> 입력, defaultOpen: boolean (기본 false).
 *  - 기본 접힘 상태 — JSON 미렌더. 토글 시 <pre> 블록 렌더.
 *  - chevron 아이콘 방향(접힘: right, 펼침: down) 검증.
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { AiExtractJsonViewer } from '@/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer'

describe('AiExtractJsonViewer — TC-DASH3-UNIT-JSONVIEWER', () => {
  it('기본 접힘 상태 (JSON 미렌더)', () => {
    render(<AiExtractJsonViewer json={{ foo: 'bar' }} />)
    expect(screen.queryByTestId('ai-json-body')).toBeNull()
  })

  it('summary 클릭 시 펼침 (JSON 렌더)', () => {
    render(<AiExtractJsonViewer json={{ foo: 'bar' }} />)
    const toggle = screen.getByRole('button', { name: /추출 결과 JSON/ })
    fireEvent.click(toggle)
    const body = screen.getByTestId('ai-json-body')
    expect(body).toBeInTheDocument()
    expect(body).toHaveTextContent(/"foo": "bar"/)
  })

  it('defaultOpen=true 시 기본 펼침', () => {
    render(<AiExtractJsonViewer json={{ foo: 'bar' }} defaultOpen />)
    expect(screen.getByTestId('ai-json-body')).toBeInTheDocument()
  })

  it('JSON pretty print (2-space indent)', () => {
    render(
      <AiExtractJsonViewer
        json={{ a: 1, b: { c: 2 } }}
        defaultOpen
      />,
    )
    const body = screen.getByTestId('ai-json-body')
    // JSON.stringify(obj, null, 2) 결과와 동일해야 함
    const expected = JSON.stringify({ a: 1, b: { c: 2 } }, null, 2)
    expect(body.textContent).toBe(expected)
  })

  it('빈 객체 {} 정상 렌더', () => {
    render(<AiExtractJsonViewer json={{}} defaultOpen />)
    const body = screen.getByTestId('ai-json-body')
    expect(body.textContent).toBe('{}')
  })

  it('chevron 아이콘 방향 (접힘: right, 펼침: down)', () => {
    render(<AiExtractJsonViewer json={{ foo: 'bar' }} />)
    const toggle = screen.getByRole('button', { name: /추출 결과 JSON/ })

    // 접힘 상태 — chevron-right
    expect(toggle.querySelector('[data-icon="chevron-right"]')).not.toBeNull()
    expect(toggle.querySelector('[data-icon="chevron-down"]')).toBeNull()

    // 클릭 후 펼침 — chevron-down
    fireEvent.click(toggle)
    expect(toggle.querySelector('[data-icon="chevron-down"]')).not.toBeNull()
    expect(toggle.querySelector('[data-icon="chevron-right"]')).toBeNull()
  })

  it('모노스페이스 폰트 클래스 적용 (font-mono)', () => {
    render(<AiExtractJsonViewer json={{ foo: 'bar' }} defaultOpen />)
    const body = screen.getByTestId('ai-json-body')
    expect(body).toHaveClass('font-mono')
  })

  it('aria-expanded 토글 상태 반영', () => {
    render(<AiExtractJsonViewer json={{ foo: 'bar' }} />)
    const toggle = screen.getByRole('button', { name: /추출 결과 JSON/ })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})
