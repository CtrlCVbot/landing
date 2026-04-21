import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AiPanelPreview } from '@/components/dashboard-preview/ai-panel-preview'
import { type AiPanelState } from '@/lib/preview-steps'
import { PREVIEW_MOCK_DATA } from '@/lib/mock-data'

// --- helpers -----------------------------------------------------------

function makeState(overrides: Partial<AiPanelState> = {}): AiPanelState {
  return {
    inputText: '',
    extractState: 'idle',
    buttons: [],
    ...overrides,
  }
}

const ALL_CATEGORY_IDS = ['departure', 'destination', 'cargo', 'fare'] as const

function makePendingButtons(): AiPanelState['buttons'] {
  return ALL_CATEGORY_IDS.map((id) => ({ id, status: 'pending' as const }))
}

function makeAppliedButtons(): AiPanelState['buttons'] {
  return ALL_CATEGORY_IDS.map((id) => ({ id, status: 'applied' as const }))
}

// --- TC-004: AiPanel sidebar rendering ---------------------------------

describe('AiPanelPreview', () => {
  describe('TC-004: AiPanel sidebar rendering', () => {
    it('renders the panel container', () => {
      render(<AiPanelPreview aiPanelState={makeState()} />)

      const panel = screen.getByTestId('ai-panel')
      expect(panel).toBeInTheDocument()
    })

    it('applies panel container layout classes', () => {
      render(<AiPanelPreview aiPanelState={makeState()} />)

      const panel = screen.getByTestId('ai-panel')
      expect(panel).toHaveClass(
        'w-[380px]',
        'flex-shrink-0',
        'border-r',
        'border-gray-800',
        'flex',
        'flex-col',
        'overflow-hidden',
      )
    })

    it('displays "텍스트" tab as active', () => {
      render(<AiPanelPreview aiPanelState={makeState()} />)

      const textTab = screen.getByText('텍스트')
      expect(textTab).toBeInTheDocument()
      expect(textTab).toHaveClass('border-blue-400')
    })

    it('displays "이미지" tab as inactive', () => {
      render(<AiPanelPreview aiPanelState={makeState()} />)

      const imageTab = screen.getByText('이미지')
      expect(imageTab).toBeInTheDocument()
      expect(imageTab).not.toHaveClass('border-blue-400')
    })

    it('renders tab bar with border-b', () => {
      render(<AiPanelPreview aiPanelState={makeState()} />)

      const tabBar = screen.getByTestId('ai-tab-bar')
      expect(tabBar).toHaveClass('border-b', 'border-gray-800')
    })

    it('merges custom className', () => {
      render(<AiPanelPreview aiPanelState={makeState()} className="custom-class" />)

      const panel = screen.getByTestId('ai-panel')
      expect(panel).toHaveClass('custom-class')
      expect(panel).toHaveClass('w-[380px]')
    })
  })

  // --- TC-005: AiInputArea step states ---------------------------------

  describe('TC-005: AiInputArea step states', () => {
    it('shows placeholder when inputText is empty (INITIAL)', () => {
      render(<AiPanelPreview aiPanelState={makeState({ inputText: '' })} />)

      const textarea = screen.getByTestId('ai-textarea')
      expect(textarea).toHaveTextContent('카카오톡 메시지를 입력하세요')
    })

    it('shows message text when inputText is provided (AI_INPUT)', () => {
      const message = PREVIEW_MOCK_DATA.aiInput.message

      render(<AiPanelPreview aiPanelState={makeState({ inputText: message })} />)

      const textarea = screen.getByTestId('ai-textarea')
      expect(textarea).toHaveTextContent(message)
    })

    it('does not show placeholder when inputText is provided', () => {
      render(
        <AiPanelPreview
          aiPanelState={makeState({ inputText: PREVIEW_MOCK_DATA.aiInput.message })}
        />,
      )

      const textarea = screen.getByTestId('ai-textarea')
      expect(textarea).not.toHaveTextContent('카카오톡 메시지를 입력하세요')
    })

    it('applies textarea styling classes', () => {
      render(<AiPanelPreview aiPanelState={makeState()} />)

      const textarea = screen.getByTestId('ai-textarea')
      expect(textarea).toHaveClass('rounded-lg', 'border', 'border-gray-700', 'min-h-[120px]')
    })

    // Extract button states
    it('shows disabled extract button when idle and inputText is empty', () => {
      render(
        <AiPanelPreview aiPanelState={makeState({ extractState: 'idle', inputText: '' })} />,
      )

      const button = screen.getByTestId('extract-button')
      expect(button).toHaveTextContent('추출하기')
      expect(button).toHaveClass('opacity-50')
    })

    it('shows active extract button when idle and inputText is provided', () => {
      render(
        <AiPanelPreview
          aiPanelState={makeState({
            extractState: 'idle',
            inputText: PREVIEW_MOCK_DATA.aiInput.message,
          })}
        />,
      )

      const button = screen.getByTestId('extract-button')
      expect(button).toHaveTextContent('추출하기')
      expect(button).not.toHaveClass('opacity-50')
    })

    it('shows loading state on extract button when extractState is loading', () => {
      render(
        <AiPanelPreview
          aiPanelState={makeState({
            extractState: 'loading',
            inputText: PREVIEW_MOCK_DATA.aiInput.message,
          })}
        />,
      )

      const button = screen.getByTestId('extract-button')
      expect(button).toHaveTextContent('분석 중...')
      expect(screen.getByTestId('extract-spinner')).toBeInTheDocument()
    })

    it('shows disabled extract button when extractState is resultReady', () => {
      render(
        <AiPanelPreview
          aiPanelState={makeState({
            extractState: 'resultReady',
            inputText: PREVIEW_MOCK_DATA.aiInput.message,
            buttons: makePendingButtons(),
          })}
        />,
      )

      const button = screen.getByTestId('extract-button')
      expect(button).toHaveClass('opacity-50')
    })
  })

  // --- TC-006: AiResultButtons category rendering ----------------------

  describe('TC-006: AiResultButtons category rendering', () => {
    it('does not render result buttons area when buttons is empty', () => {
      render(<AiPanelPreview aiPanelState={makeState({ buttons: [] })} />)

      expect(screen.queryByTestId('ai-result-buttons')).not.toBeInTheDocument()
    })

    it('renders 4 category groups when buttons has 4 pending items', () => {
      render(
        <AiPanelPreview
          aiPanelState={makeState({
            extractState: 'resultReady',
            inputText: PREVIEW_MOCK_DATA.aiInput.message,
            buttons: makePendingButtons(),
          })}
        />,
      )

      const resultArea = screen.getByTestId('ai-result-buttons')
      expect(resultArea).toBeInTheDocument()

      const groups = screen.getAllByTestId(/^category-group-/)
      expect(groups).toHaveLength(4)
    })

    it('renders category labels: 상차지, 하차지, 화물·차량, 운임', () => {
      render(
        <AiPanelPreview
          aiPanelState={makeState({
            extractState: 'resultReady',
            inputText: PREVIEW_MOCK_DATA.aiInput.message,
            buttons: makePendingButtons(),
          })}
        />,
      )

      expect(screen.getByText('상차지')).toBeInTheDocument()
      expect(screen.getByText('하차지')).toBeInTheDocument()
      expect(screen.getByText('화물·차량')).toBeInTheDocument()
      // '운임' appears as both category label and button label in mock data
      const fareLabels = screen.getAllByText('운임')
      expect(fareLabels.length).toBeGreaterThanOrEqual(1)
    })

    it('applies pending (blue) styling when all buttons are pending', () => {
      render(
        <AiPanelPreview
          aiPanelState={makeState({
            extractState: 'resultReady',
            inputText: PREVIEW_MOCK_DATA.aiInput.message,
            buttons: makePendingButtons(),
          })}
        />,
      )

      const buttons = screen.getAllByTestId(/^category-button-/)
      buttons.forEach((button) => {
        expect(button).toHaveClass('bg-blue-500/20', 'text-blue-400')
      })
    })

    it('applies applied (green) styling when all buttons are applied', () => {
      render(
        <AiPanelPreview
          aiPanelState={makeState({
            extractState: 'resultReady',
            inputText: PREVIEW_MOCK_DATA.aiInput.message,
            buttons: makeAppliedButtons(),
          })}
        />,
      )

      const buttons = screen.getAllByTestId(/^category-button-/)
      buttons.forEach((button) => {
        expect(button).toHaveClass('bg-green-500/20', 'text-green-400')
      })
    })

    it('renders correct icon test-ids for each category', () => {
      render(
        <AiPanelPreview
          aiPanelState={makeState({
            extractState: 'resultReady',
            inputText: PREVIEW_MOCK_DATA.aiInput.message,
            buttons: makePendingButtons(),
          })}
        />,
      )

      expect(screen.getByTestId('icon-departure')).toBeInTheDocument()
      expect(screen.getByTestId('icon-destination')).toBeInTheDocument()
      expect(screen.getByTestId('icon-cargo')).toBeInTheDocument()
      expect(screen.getByTestId('icon-fare')).toBeInTheDocument()
    })

    it('renders detail buttons from mock data inside each category group', () => {
      render(
        <AiPanelPreview
          aiPanelState={makeState({
            extractState: 'resultReady',
            inputText: PREVIEW_MOCK_DATA.aiInput.message,
            buttons: makePendingButtons(),
          })}
        />,
      )

      // departure category has 2 buttons
      const departureGroup = screen.getByTestId('category-group-departure')
      expect(departureGroup).toHaveTextContent('서울 강남구 물류센터')
      expect(departureGroup).toHaveTextContent('내일 09:00')

      // destination category has 1 button
      const destGroup = screen.getByTestId('category-group-destination')
      expect(destGroup).toHaveTextContent('대전 유성구 산업단지')

      // cargo category has 2 buttons
      const cargoGroup = screen.getByTestId('category-group-cargo')
      expect(cargoGroup).toHaveTextContent('카고 5톤')

      // fare category has 1 button
      const fareGroup = screen.getByTestId('category-group-fare')
      expect(fareGroup).toHaveTextContent('420,000원')
    })
  })
})
