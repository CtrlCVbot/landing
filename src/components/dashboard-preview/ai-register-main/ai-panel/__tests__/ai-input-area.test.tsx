/**
 * T-DASH3-M2-03 — AiInputArea 단위 테스트 (TC-DASH3-UNIT-INPAREA)
 *
 * TC
 *  - TC-DASH3-UNIT-INPAREA: 텍스트/이미지 탭 stateless 렌더 + fake-typing 연동 검증
 *  - TC-DASH3-UNIT-TYP:     use-fake-typing 훅 결과 props(text/progress/active) 표시 연동
 *
 * REQ
 *  - REQ-DASH3-003  (AiPanel 컴포넌트 복제 매니페스트 — AiInputArea)
 *  - REQ-DASH3-020  (#1 조작감 — 변동 리듬 타이핑 연동)
 *  - REQ-DASH-005   (랜딩 팔레트 일관성)
 *
 * 범위
 *  - AiInputArea 는 완전히 stateless 한 dumb component.
 *  - fake-typing 훅은 상위에서 호출하여 text/progress/active 를 주입하고,
 *    AiInputArea 는 받은 값만 렌더한다.
 *  - 이미지 탭은 시각적 placeholder 만 표시하고 실제 업로드 기능은 제거된다.
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { AiInputArea } from '@/components/dashboard-preview/ai-register-main/ai-panel/ai-input-area'

describe('AiInputArea — TC-DASH3-UNIT-INPAREA', () => {
  // -------------------------------------------------------------------------
  // 텍스트 탭
  // -------------------------------------------------------------------------
  describe('텍스트 탭', () => {
    it('text 빈 문자열 + active=false 시 placeholder 렌더', () => {
      render(<AiInputArea activeTab="text" text="" progress={0} active={false} />)

      // placeholder 문구(일부)가 노출되어야 한다.
      expect(screen.getByText(/카톡 메시지나 오더 내용을 붙여넣기/)).toBeInTheDocument()
    })

    it('text 주입 시 그대로 렌더 (whitespace-pre-wrap)', () => {
      const sample = '상차: 경기 안성시 공도읍\n하차: 서울 강남구'
      render(<AiInputArea activeTab="text" text={sample} progress={0.5} active={true} />)

      // textbox 안에 해당 텍스트가 렌더되어야 한다.
      const textbox = screen.getByRole('textbox')
      expect(textbox).toHaveTextContent('상차: 경기 안성시 공도읍')
      expect(textbox).toHaveTextContent('하차: 서울 강남구')
      // whitespace-pre-wrap 클래스가 적용되어야 줄바꿈이 보존된다.
      expect(textbox).toHaveClass('whitespace-pre-wrap')
    })

    it('active=true + text 있을 때 caret 렌더 (accent 색상 + animate-pulse)', () => {
      const { container } = render(
        <AiInputArea activeTab="text" text="abc" progress={0.3} active={true} />,
      )

      // caret 은 aria-hidden span 으로 렌더. class 기반으로 조회.
      const caret = container.querySelector('span.animate-pulse')
      expect(caret).not.toBeNull()
      expect(caret).toHaveClass('bg-accent')
      expect(caret).toHaveAttribute('aria-hidden', 'true')
    })

    it('active=false 시 caret 미렌더', () => {
      const { container } = render(
        <AiInputArea activeTab="text" text="abc" progress={0} active={false} />,
      )

      const caret = container.querySelector('span.animate-pulse')
      expect(caret).toBeNull()
    })

    it('active=true 이지만 text 가 빈 문자열이면 caret 미렌더', () => {
      const { container } = render(
        <AiInputArea activeTab="text" text="" progress={0} active={true} />,
      )

      const caret = container.querySelector('span.animate-pulse')
      expect(caret).toBeNull()
    })

    it('글자 수 표시 (N자)', () => {
      render(<AiInputArea activeTab="text" text="안녕하세요" progress={0} active={false} />)
      expect(screen.getByText('5자')).toBeInTheDocument()
    })

    it('progress 표시 (active=true 시 % 로 표시)', () => {
      render(<AiInputArea activeTab="text" text="abc" progress={0.42} active={true} />)
      // 42% 가 렌더되어야 한다.
      expect(screen.getByText('42%')).toBeInTheDocument()
    })

    it('active=false 시 progress 미표시', () => {
      const { container } = render(
        <AiInputArea activeTab="text" text="abc" progress={0.42} active={false} />,
      )
      // 42% 문구가 존재하지 않아야 한다.
      expect(container.textContent ?? '').not.toContain('42%')
    })

    it('role="textbox" aria-readonly="true" 접근성', () => {
      render(<AiInputArea activeTab="text" text="" progress={0} active={false} />)
      const textbox = screen.getByRole('textbox')
      expect(textbox).toHaveAttribute('aria-readonly', 'true')
      expect(textbox).toHaveAttribute('aria-label', 'AI 입력 영역 (데모)')
    })

    it('landing 팔레트 클래스 적용 (bg-black/40 border-white/10 text-gray-200)', () => {
      render(<AiInputArea activeTab="text" text="abc" progress={0} active={false} />)
      const textbox = screen.getByRole('textbox')
      expect(textbox).toHaveClass('bg-black/40')
      expect(textbox).toHaveClass('border-white/10')
      expect(textbox).toHaveClass('text-gray-200')
    })
  })

  // -------------------------------------------------------------------------
  // 이미지 탭
  // -------------------------------------------------------------------------
  describe('이미지 탭', () => {
    it('activeTab="image" 시 ImageTabPlaceholder 렌더', () => {
      render(<AiInputArea activeTab="image" text="" progress={0} active={false} />)
      expect(
        screen.getByText(/이미지를 드래그 앤 드롭 또는 클릭하여 업로드/),
      ).toBeInTheDocument()
    })

    it('activeTab="image" 시 텍스트 탭 textbox 는 미렌더', () => {
      render(<AiInputArea activeTab="image" text="" progress={0} active={false} />)
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })

    it('이미지 탭에 "데모" 안내 문구 노출 (M2 범위 외 업로드 기능 제거 안내)', () => {
      render(<AiInputArea activeTab="image" text="" progress={0} active={false} />)
      expect(screen.getByText(/실제 업로드는 비활성/)).toBeInTheDocument()
    })
  })
})
