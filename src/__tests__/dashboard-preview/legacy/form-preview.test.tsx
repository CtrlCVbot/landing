import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FormPreview } from '@/components/dashboard-preview/form-preview'
import { type FormState } from '@/lib/preview-steps'

const EMPTY_FORM_STATE: FormState = {
  filledCards: [],
  highlightedCard: null,
  estimateAmount: null,
}

const FILLED_FORM_STATE: FormState = {
  filledCards: ['cargoInfo', 'location-departure', 'location-destination', 'estimate'],
  highlightedCard: null,
  estimateAmount: 420000,
}

describe('FormPreview', () => {
  // TC-007: FormPreview 렌더링
  describe('TC-007: FormPreview rendering', () => {
    it('renders 5 Card blocks (CargoInfo, Location x2, TransportOptions, Estimate)', () => {
      render(<FormPreview formState={EMPTY_FORM_STATE} />)

      expect(screen.getByTestId('card-cargoInfo')).toBeInTheDocument()
      expect(screen.getByTestId('card-location-departure')).toBeInTheDocument()
      expect(screen.getByTestId('card-location-destination')).toBeInTheDocument()
      expect(screen.getByTestId('card-transportOptions')).toBeInTheDocument()
      expect(screen.getByTestId('card-estimate')).toBeInTheDocument()
    })

    it('displays label for each card', () => {
      render(<FormPreview formState={EMPTY_FORM_STATE} />)

      expect(screen.getByText('차량 정보')).toBeInTheDocument()
      expect(screen.getByText('상차지')).toBeInTheDocument()
      expect(screen.getByText('하차지')).toBeInTheDocument()
      expect(screen.getByText('운송 옵션')).toBeInTheDocument()
      expect(screen.getByText('예상 정보')).toBeInTheDocument()
    })

    it('applies consistent card styling classes', () => {
      render(<FormPreview formState={EMPTY_FORM_STATE} />)

      const cardIds = [
        'card-cargoInfo',
        'card-location-departure',
        'card-location-destination',
        'card-transportOptions',
        'card-estimate',
      ]

      cardIds.forEach((testId) => {
        const card = screen.getByTestId(testId)
        expect(card).toHaveClass('rounded-lg', 'border', 'border-gray-800', 'p-3')
      })
    })

    it('merges custom className on container', () => {
      render(<FormPreview formState={EMPTY_FORM_STATE} className="custom-class" />)

      const container = screen.getByTestId('form-preview')
      expect(container).toHaveClass('custom-class')
    })
  })

  // TC-007-empty: 빈 상태 (filledCards=[])
  describe('TC-007-empty: empty state (filledCards=[])', () => {
    it('shows placeholder dashes for cargo fields', () => {
      render(<FormPreview formState={EMPTY_FORM_STATE} />)

      const cargoCard = screen.getByTestId('card-cargoInfo')
      const placeholders = cargoCard.querySelectorAll('[data-testid="field-placeholder"]')
      expect(placeholders.length).toBeGreaterThanOrEqual(3)
    })

    it('shows placeholder dashes for location departure fields', () => {
      render(<FormPreview formState={EMPTY_FORM_STATE} />)

      const locationCard = screen.getByTestId('card-location-departure')
      const placeholders = locationCard.querySelectorAll('[data-testid="field-placeholder"]')
      expect(placeholders.length).toBeGreaterThanOrEqual(1)
    })

    it('shows placeholder dashes for location destination fields', () => {
      render(<FormPreview formState={EMPTY_FORM_STATE} />)

      const locationCard = screen.getByTestId('card-location-destination')
      const placeholders = locationCard.querySelectorAll('[data-testid="field-placeholder"]')
      expect(placeholders.length).toBeGreaterThanOrEqual(1)
    })

    it('displays "--원" for estimate amount', () => {
      render(<FormPreview formState={EMPTY_FORM_STATE} />)

      const estimateCard = screen.getByTestId('card-estimate')
      expect(estimateCard.textContent).toContain('--원')
    })

    it('displays "--km" for estimate distance', () => {
      render(<FormPreview formState={EMPTY_FORM_STATE} />)

      const estimateCard = screen.getByTestId('card-estimate')
      expect(estimateCard.textContent).toContain('--km')
    })
  })

  // TC-007-filled: 채워진 상태
  describe('TC-007-filled: filled state', () => {
    it('shows "카고" in CargoInfo card', () => {
      render(<FormPreview formState={FILLED_FORM_STATE} />)

      const cargoCard = screen.getByTestId('card-cargoInfo')
      expect(cargoCard.textContent).toContain('카고')
    })

    it('shows "5톤" in CargoInfo card', () => {
      render(<FormPreview formState={FILLED_FORM_STATE} />)

      const cargoCard = screen.getByTestId('card-cargoInfo')
      expect(cargoCard.textContent).toContain('5톤')
    })

    it('shows "파레트 적재 공산품" in CargoInfo card', () => {
      render(<FormPreview formState={FILLED_FORM_STATE} />)

      const cargoCard = screen.getByTestId('card-cargoInfo')
      expect(cargoCard.textContent).toContain('파레트 적재 공산품')
    })

    it('shows "서울 강남구 물류센터" in departure location card', () => {
      render(<FormPreview formState={FILLED_FORM_STATE} />)

      const locationCard = screen.getByTestId('card-location-departure')
      expect(locationCard.textContent).toContain('서울 강남구 물류센터')
    })

    it('shows "대전 유성구 산업단지" in destination location card', () => {
      render(<FormPreview formState={FILLED_FORM_STATE} />)

      const locationCard = screen.getByTestId('card-location-destination')
      expect(locationCard.textContent).toContain('대전 유성구 산업단지')
    })

    it('shows "420,000" in estimate card amount', () => {
      render(<FormPreview formState={FILLED_FORM_STATE} />)

      const estimateCard = screen.getByTestId('card-estimate')
      expect(estimateCard.textContent).toContain('420,000')
    })

    it('shows "160" in estimate card distance', () => {
      render(<FormPreview formState={FILLED_FORM_STATE} />)

      const estimateCard = screen.getByTestId('card-estimate')
      expect(estimateCard.textContent).toContain('160')
    })
  })

  // TC-007-highlight: 하이라이트 상태
  describe('TC-007-highlight: highlight state', () => {
    it('applies accent style to highlighted card (cargoInfo)', () => {
      const highlightState: FormState = {
        ...EMPTY_FORM_STATE,
        highlightedCard: 'cargoInfo',
      }

      render(<FormPreview formState={highlightState} />)

      const card = screen.getByTestId('card-cargoInfo')
      expect(card).toHaveClass('ring-1', 'ring-purple-500/50')
    })

    it('does not apply accent style to non-highlighted cards', () => {
      const highlightState: FormState = {
        ...EMPTY_FORM_STATE,
        highlightedCard: 'cargoInfo',
      }

      render(<FormPreview formState={highlightState} />)

      const otherCards = [
        'card-location-departure',
        'card-location-destination',
        'card-transportOptions',
        'card-estimate',
      ]

      otherCards.forEach((testId) => {
        const card = screen.getByTestId(testId)
        expect(card).not.toHaveClass('ring-1')
        expect(card).not.toHaveClass('ring-purple-500/50')
      })
    })

    it('applies no accent style when highlightedCard is null', () => {
      render(<FormPreview formState={EMPTY_FORM_STATE} />)

      const allCards = [
        'card-cargoInfo',
        'card-location-departure',
        'card-location-destination',
        'card-transportOptions',
        'card-estimate',
      ]

      allCards.forEach((testId) => {
        const card = screen.getByTestId(testId)
        expect(card).not.toHaveClass('ring-1')
        expect(card).not.toHaveClass('ring-purple-500/50')
      })
    })
  })
})
