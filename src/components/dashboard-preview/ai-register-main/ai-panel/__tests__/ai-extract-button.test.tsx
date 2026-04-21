/**
 * T-DASH3-M2-04 — AiExtractButton 단위 테스트
 *
 * TC
 *  - TC-DASH3-UNIT-EXTRBTN: idle / loading / resultReady 3 상태 + gradient + spinner 검증
 *  - TC-DASH3-UNIT-PRESS:   use-button-press 훅 연동 — pressTriggerAt 자동 press
 *
 * REQ
 *  - REQ-DASH3-003 (AiPanel 컴포넌트 복제 매니페스트 — AiExtractButton)
 *  - REQ-DASH3-021 (#3 조작감 — 버튼 press scale 0.97 + 150ms)
 *  - REQ-DASH-005  (랜딩 팔레트 일관성)
 *
 * 범위
 *  - AiExtractButton 은 stateless dumb component.
 *  - state prop('idle' | 'loading' | 'resultReady') 로 표현.
 *  - pressTriggerAt prop 으로 use-button-press 자동 press 트리거 — data-pressed 속성으로 노출.
 */

import { render, screen, fireEvent, act } from '@testing-library/react'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { AiExtractButton } from '@/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-button'

// ---------------------------------------------------------------------------
// matchMedia helper (prefers-reduced-motion)
// ---------------------------------------------------------------------------

function mockMatchMedia(reducedMotion: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches:
          query === '(prefers-reduced-motion: reduce)' ? reducedMotion : false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  })
}

beforeEach(() => {
  mockMatchMedia(false)
})

afterEach(() => {
  vi.useRealTimers()
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('AiExtractButton — TC-DASH3-UNIT-EXTRBTN', () => {
  // -------------------------------------------------------------------------
  // state=idle
  // -------------------------------------------------------------------------
  describe('state=idle', () => {
    it('"추출하기" 텍스트 렌더', () => {
      render(<AiExtractButton state="idle" />)
      expect(screen.getByRole('button')).toHaveTextContent('추출하기')
    })

    it('gradient className (from-purple-600, to-blue-600)', () => {
      render(<AiExtractButton state="idle" />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-gradient-to-r')
      expect(button).toHaveClass('from-purple-600')
      expect(button).toHaveClass('to-blue-600')
      expect(button).toHaveClass('text-white')
      expect(button).toHaveClass('font-semibold')
    })

    it('disabled=false', () => {
      render(<AiExtractButton state="idle" />)
      expect(screen.getByRole('button')).not.toBeDisabled()
    })

    it('onPress 콜백 호출 (수동 클릭)', () => {
      const onPress = vi.fn()
      render(<AiExtractButton state="idle" onPress={onPress} />)
      fireEvent.click(screen.getByRole('button'))
      expect(onPress).toHaveBeenCalledTimes(1)
    })

    it('focus-visible ring 클래스 적용', () => {
      render(<AiExtractButton state="idle" />)
      const button = screen.getByRole('button')
      expect(button.className).toMatch(/focus-visible:ring/)
    })
  })

  // -------------------------------------------------------------------------
  // state=loading
  // -------------------------------------------------------------------------
  describe('state=loading', () => {
    it('spinner 렌더 (border-white/30 border-t-white)', () => {
      const { container } = render(<AiExtractButton state="loading" />)
      const spinner = container.querySelector('[data-testid="extract-spinner"]')
      expect(spinner).not.toBeNull()
      expect(spinner).toHaveClass('border-white/30')
      expect(spinner).toHaveClass('border-t-white')
    })

    it('버튼 disabled=true', () => {
      render(<AiExtractButton state="loading" />)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('"추출 중..." 텍스트 렌더', () => {
      render(<AiExtractButton state="loading" />)
      expect(screen.getByRole('button')).toHaveTextContent('추출 중...')
    })

    it('loading 시 onPress 콜백 호출되지 않음', () => {
      const onPress = vi.fn()
      render(<AiExtractButton state="loading" onPress={onPress} />)
      fireEvent.click(screen.getByRole('button'))
      expect(onPress).not.toHaveBeenCalled()
    })
  })

  // -------------------------------------------------------------------------
  // state=resultReady
  // -------------------------------------------------------------------------
  describe('state=resultReady', () => {
    it('"재추출" 텍스트 렌더', () => {
      render(<AiExtractButton state="resultReady" />)
      expect(screen.getByRole('button')).toHaveTextContent('재추출')
    })

    it('버튼 disabled=true (resultReady 상태에서는 재추출 action 비활성)', () => {
      render(<AiExtractButton state="resultReady" />)
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  // -------------------------------------------------------------------------
  // #3 button-press 자동 트리거
  // -------------------------------------------------------------------------
  describe('#3 button-press 자동 트리거 — TC-DASH3-UNIT-PRESS', () => {
    it('pressTriggerAt=null 일 때 data-pressed="false" (초기)', () => {
      render(<AiExtractButton state="idle" pressTriggerAt={null} />)
      expect(screen.getByRole('button')).toHaveAttribute('data-pressed', 'false')
    })

    it('pressTriggerAt 도달 시 data-pressed="true" 로 전환', () => {
      vi.useFakeTimers()
      render(<AiExtractButton state="idle" pressTriggerAt={500} />)

      // 초기 상태
      expect(screen.getByRole('button')).toHaveAttribute('data-pressed', 'false')

      // triggerAt 도달 직전 — 아직 false
      act(() => {
        vi.advanceTimersByTime(499)
      })
      expect(screen.getByRole('button')).toHaveAttribute('data-pressed', 'false')

      // triggerAt 도달 — pressed=true
      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(screen.getByRole('button')).toHaveAttribute('data-pressed', 'true')

      // 150ms 경과 — 복귀
      act(() => {
        vi.advanceTimersByTime(150)
      })
      expect(screen.getByRole('button')).toHaveAttribute('data-pressed', 'false')
    })

    it('수동 mouseDown/mouseUp 으로도 data-pressed 가 토글됨', () => {
      render(<AiExtractButton state="idle" />)
      const button = screen.getByRole('button')

      expect(button).toHaveAttribute('data-pressed', 'false')

      fireEvent.mouseDown(button)
      expect(button).toHaveAttribute('data-pressed', 'true')

      fireEvent.mouseUp(button)
      expect(button).toHaveAttribute('data-pressed', 'false')
    })
  })
})
