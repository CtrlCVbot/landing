/**
 * T-DASH3-M2-02 — AiTabBar 단위 테스트 (TC-DASH3-UNIT-TABBAR)
 *
 * TC
 *  - TC-DASH3-UNIT-TABBAR: 텍스트/이미지 탭 stateless 렌더 + aria-selected + 활성 클래스
 *
 * REQ
 *  - REQ-DASH3-003 (AiPanel 컴포넌트 복제 매니페스트 — 텍스트/이미지 탭)
 *
 * 범위
 *  - stateless props 기반 AiTabBar 컴포넌트.
 *  - onTabChange 는 optional — 호출 시 전달된 tab key 로 호출되어야 한다.
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { AiTabBar } from '@/components/dashboard-preview/ai-register-main/ai-panel/ai-tab-bar'

describe('AiTabBar — TC-DASH3-UNIT-TABBAR', () => {
  it('탭 2개 렌더 (텍스트, 이미지)', () => {
    render(<AiTabBar activeTab="text" />)

    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(2)
    expect(screen.getByRole('tab', { name: '텍스트' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '이미지' })).toBeInTheDocument()
  })

  it('activeTab="text" 시 텍스트 탭 aria-selected=true', () => {
    render(<AiTabBar activeTab="text" />)

    const textTab = screen.getByRole('tab', { name: '텍스트' })
    const imageTab = screen.getByRole('tab', { name: '이미지' })

    expect(textTab).toHaveAttribute('aria-selected', 'true')
    expect(imageTab).toHaveAttribute('aria-selected', 'false')
  })

  it('activeTab="image" 시 이미지 탭 aria-selected=true', () => {
    render(<AiTabBar activeTab="image" />)

    const textTab = screen.getByRole('tab', { name: '텍스트' })
    const imageTab = screen.getByRole('tab', { name: '이미지' })

    expect(imageTab).toHaveAttribute('aria-selected', 'true')
    expect(textTab).toHaveAttribute('aria-selected', 'false')
  })

  it('active 탭에 bg-accent/20 text-accent 클래스', () => {
    render(<AiTabBar activeTab="text" />)

    const textTab = screen.getByRole('tab', { name: '텍스트' })
    expect(textTab).toHaveClass('bg-accent/20')
    expect(textTab).toHaveClass('text-accent')
  })

  it('inactive 탭에 text-gray-500 클래스', () => {
    render(<AiTabBar activeTab="text" />)

    const imageTab = screen.getByRole('tab', { name: '이미지' })
    expect(imageTab).toHaveClass('text-gray-500')
  })

  it('onTabChange 콜백 호출 (탭 클릭 시)', () => {
    const onTabChange = vi.fn()
    render(<AiTabBar activeTab="text" onTabChange={onTabChange} />)

    const imageTab = screen.getByRole('tab', { name: '이미지' })
    fireEvent.click(imageTab)

    expect(onTabChange).toHaveBeenCalledTimes(1)
    expect(onTabChange).toHaveBeenCalledWith('image')
  })

  it('role="tablist" + aria-label 접근성', () => {
    render(<AiTabBar activeTab="text" />)

    const tablist = screen.getByRole('tablist')
    expect(tablist).toBeInTheDocument()
    expect(tablist).toHaveAttribute('aria-label', 'AI 입력 타입 선택')
  })
})
