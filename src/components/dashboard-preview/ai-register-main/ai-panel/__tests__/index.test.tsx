/**
 * T-DASH3-M1-03 + M2-01 + M3-11 — AiPanelContainer 단위 테스트
 *
 * TC
 *  - TC-DASH3-INT-GRID:     AiPanel 380px 고정 + border-r + bg-black/40 (M1-03)
 *  - TC-DASH3-INT-AIPANEL:  자식 7 컴포넌트 주입 검증 (M2-01)
 *  - TC-DASH3-INT-APPLY-2BEAT: AI_APPLY partialBeat 카테고리 순차 press (M3-11)
 *
 * REQ
 *  - REQ-DASH3-050 (AiPanel 380px 고정)
 *  - REQ-DASH-003  (outer shell)
 *  - REQ-DASH-007  (접근성)
 *  - REQ-DASH3-003 (AiPanel 자식 컴포넌트 조립)
 *  - REQ-DASH3-020 (#1 fake-typing 통합)
 *  - REQ-DASH3-021 (#3 button-press 자동 트리거)
 *  - REQ-DASH3-041 / 042 / 043 (AI_APPLY 2단 구조 — partialBeat 카테고리 순차 press)
 *
 * 범위
 *  - shell 레이아웃 + aria-label 검증 (M1-03 유지)
 *  - 자식 6 컴포넌트 렌더 검증 (M2-01; F5 T-CLEANUP-01: AiExtractJsonViewer 제거)
 *    * AiTabBar (role="tablist")
 *    * AiInputArea (role="textbox", textValue 주입 via useFakeTyping)
 *    * AiExtractButton (state, pressTriggerAt)
 *    * AiWarningBadges (warnings 있을 때만)
 *    * AiResultButtons (role="group") + AiButtonItem
 *    * 헤더에 step.label 표시
 *  - M3-11: AI_APPLY Step 에서 categoryIndex × intervalMs 기반으로 AiButtonItem pressTriggerAt 계산.
 */

import { render, screen, act } from '@testing-library/react'
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'

import { AiPanelContainer } from '@/components/dashboard-preview/ai-register-main/ai-panel'
import { PREVIEW_MOCK_DATA, selectPreviewMockScenario } from '@/lib/mock-data'
import { PREVIEW_STEPS } from '@/lib/preview-steps'

const INITIAL_STEP = PREVIEW_STEPS[0]!
const AI_APPLY_STEP = PREVIEW_STEPS[3]!
const AI_APPLY_PARTIAL_INTERVAL_MS =
  AI_APPLY_STEP.interactions.partialBeat!.intervalMs

// ---------------------------------------------------------------------------
// M1-03 — shell 레이아웃
// ---------------------------------------------------------------------------

describe('AiPanelContainer shell (M1-03)', () => {
  it('renders with aria-label "AI 화물 등록 패널"', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    expect(screen.getByLabelText('AI 화물 등록 패널')).toBeInTheDocument()
  })

  it('renders as <aside> landmark', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const aside = screen.getByLabelText('AI 화물 등록 패널')
    expect(aside.tagName).toBe('ASIDE')
  })

  it('has w-[380px] fixed width + flex-shrink-0', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const aside = screen.getByLabelText('AI 화물 등록 패널')
    expect(aside).toHaveClass('w-[380px]')
    expect(aside).toHaveClass('flex-shrink-0')
  })

  it('has border-r border-border + bg-card/50 palette (T-THEME-09 토큰 치환)', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const aside = screen.getByLabelText('AI 화물 등록 패널')
    expect(aside).toHaveClass('border-r')
    // T-THEME-09 — 토큰 치환 (원본: border-white/10 bg-black/40)
    expect(aside).toHaveClass('border-border')
    expect(aside).toHaveClass('bg-card/50')
  })

  it('uses flex flex-col overflow-hidden (vertical stacking)', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const aside = screen.getByLabelText('AI 화물 등록 패널')
    expect(aside).toHaveClass('flex')
    expect(aside).toHaveClass('flex-col')
    expect(aside).toHaveClass('overflow-hidden')
  })
})

describe('AiPanelContainer F2 extractedFrame source', () => {
  it('renders AI result values from extractedFrame, not appliedFrame', () => {
    const scenario = selectPreviewMockScenario('mismatch-risk')
    const fareButton = scenario.extractedFrame.aiResult.categories
      .find((category) => category.id === 'fare')
      ?.buttons.find((button) => button.fieldKey === 'fare-amount')

    expect(fareButton).toBeDefined()

    render(
      <AiPanelContainer
        step={AI_APPLY_STEP}
        aiInput={scenario.extractedFrame.aiInput}
        aiResult={scenario.extractedFrame.aiResult}
      />,
    )

    expect(screen.getByText(fareButton!.displayValue)).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// M2-01 — 자식 컴포넌트 주입
// ---------------------------------------------------------------------------

describe('AiPanelContainer 자식 주입 (M2-01)', () => {
  it('AiTabBar 렌더 (role="tablist" + "AI 입력 타입 선택")', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const tablist = screen.getByRole('tablist', { name: 'AI 입력 타입 선택' })
    expect(tablist).toBeInTheDocument()
  })

  it('AiInputArea 렌더 (role="textbox" + aria-readonly)', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const textbox = screen.getByRole('textbox', { name: 'AI 입력 영역 (데모)' })
    expect(textbox).toHaveAttribute('aria-readonly', 'true')
  })

  it('AiExtractButton 렌더 (INITIAL → idle/"추출하기")', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const button = screen.getByRole('button', { name: '추출하기' })
    expect(button).toHaveAttribute('data-state', 'idle')
  })

  it('AiResultButtons 4 카테고리 role="group" 렌더', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    // 카테고리 헤더는 idle/loading 상태에서도 렌더 (buttons 는 미노출)
    expect(screen.getByRole('group', { name: /AI 추출 결과 — 상차지/ })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /AI 추출 결과 — 하차지/ })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /AI 추출 결과 — 화물\/차량/ })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /AI 추출 결과 — 운임/ })).toBeInTheDocument()
  })

  it('AI_APPLY Step 에서 AiButtonItem (renderButton) 주입 확인', () => {
    render(
      <AiPanelContainer
        step={AI_APPLY_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    // AI_APPLY 에서는 extractState=resultReady → AiButtonItem 렌더
    // AiButtonItem 은 data-testid="ai-button-item-{id}" 속성을 갖는다.
    const firstButton = screen.getByTestId('ai-button-item-btn-departure-address1')
    expect(firstButton).toBeInTheDocument()
    expect(firstButton).toHaveAttribute('data-group-id', 'departure')
  })

  it('AiWarningBadges: warnings 가 빈 배열이면 미렌더', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    // PREVIEW_MOCK_DATA.aiResult.warnings === [] 이므로 role="list" 미렌더
    expect(screen.queryByRole('list', { name: 'AI 추출 경고' })).not.toBeInTheDocument()
  })

  it('AiWarningBadges: warnings 주입 시 렌더', () => {
    const dataWithWarnings = {
      ...PREVIEW_MOCK_DATA.aiResult,
      warnings: ['경고 예시: 상차지 확인 필요'] as readonly string[],
    }
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={dataWithWarnings}
      />,
    )

    const list = screen.getByRole('list', { name: 'AI 추출 경고' })
    expect(list).toBeInTheDocument()
    expect(screen.getByText(/경고 예시: 상차지 확인 필요/)).toBeInTheDocument()
  })

  // F5 T-CLEANUP-01 (R5) — AiExtractJsonViewer 렌더 경로 제거.
  // 컴포넌트 파일/단위 테스트는 K1/K2 로 유지되지만, AiPanelContainer 는 더 이상 렌더하지 않음.
  it('AiExtractJsonViewer 미렌더 — JSON 뷰어 토글 버튼이 존재하지 않음 (F5 R1/R2)', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    expect(
      screen.queryByRole('button', { name: /추출 결과 JSON/ }),
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('ai-json-body')).not.toBeInTheDocument()
  })

  it('DOM 기반 hit-area 측정을 위한 marker를 AiPanel 핵심 영역에 부여한다', () => {
    render(
      <AiPanelContainer
        step={AI_APPLY_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    expect(screen.getByRole('tablist', { name: 'AI 입력 타입 선택' })).toHaveAttribute(
      'data-hit-area-id',
      'ai-tab-bar',
    )
    expect(screen.getByRole('textbox', { name: 'AI 입력 영역 (데모)' })).toHaveAttribute(
      'data-hit-area-id',
      'ai-input',
    )
    expect(screen.getByRole('button', { name: '재추출' })).toHaveAttribute(
      'data-hit-area-id',
      'ai-extract-button',
    )
    for (const id of ['departure', 'destination', 'cargo', 'fare'] as const) {
      expect(screen.getByTestId(`ai-category-${id}`)).toHaveAttribute(
        'data-hit-area-id',
        `ai-result-${id}`,
      )
    }
  })

  it('헤더에 step.label 표시 (INITIAL → "초기 화면")', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    expect(screen.getByText('초기 화면')).toBeInTheDocument()
  })

  it('헤더에 step.label 표시 (AI_APPLY → "폼 자동 입력")', () => {
    render(
      <AiPanelContainer
        step={AI_APPLY_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    expect(screen.getByText('폼 자동 입력')).toBeInTheDocument()
  })

  it('AI 화물 등록 제목 영역 표시', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    expect(screen.getByText('AI 화물 등록')).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// M3-11 — partialBeat 카테고리 순차 press (TC-DASH3-INT-APPLY-2BEAT)
// ---------------------------------------------------------------------------

describe('AiPanelContainer partialBeat 카테고리 순차 press (M3-11)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('AI_APPLY: departure(index 0) 카테고리 버튼은 즉시 press (0ms 후 data-pressed=true)', () => {
    render(
      <AiPanelContainer
        step={AI_APPLY_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const btn = screen.getByTestId('ai-button-item-btn-departure-address1')
    // 초기 상태: 아직 press 미발동
    expect(btn).toHaveAttribute('data-pressed', 'false')

    // 0ms offset — setTimeout(fn, 0) 는 다음 tick 에 실행
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(btn).toHaveAttribute('data-pressed', 'true')
  })

  it('AI_APPLY: destination(index 1) 카테고리 버튼은 intervalMs(300) 경과 후 press', () => {
    render(
      <AiPanelContainer
        step={AI_APPLY_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const btn = screen.getByTestId('ai-button-item-btn-destination-address1')
    expect(btn).toHaveAttribute('data-pressed', 'false')

    // 299ms: 아직 press 전
    act(() => {
      vi.advanceTimersByTime(AI_APPLY_PARTIAL_INTERVAL_MS - 1)
    })
    expect(btn).toHaveAttribute('data-pressed', 'false')

    // 300ms: press 발동
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(btn).toHaveAttribute('data-pressed', 'true')
  })

  it('AI_APPLY: cargo(index 2) 카테고리 버튼은 600ms 경과 후 press', () => {
    render(
      <AiPanelContainer
        step={AI_APPLY_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const btn = screen.getByTestId('ai-button-item-btn-cargo-vehicleType')
    expect(btn).toHaveAttribute('data-pressed', 'false')

    act(() => {
      vi.advanceTimersByTime(AI_APPLY_PARTIAL_INTERVAL_MS * 2 - 1)
    })
    expect(btn).toHaveAttribute('data-pressed', 'false')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(btn).toHaveAttribute('data-pressed', 'true')
  })

  it('AI_APPLY: fare(index 3) 카테고리 버튼은 900ms 경과 후 press', () => {
    render(
      <AiPanelContainer
        step={AI_APPLY_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const btn = screen.getByTestId('ai-button-item-btn-fare-amount')
    expect(btn).toHaveAttribute('data-pressed', 'false')

    act(() => {
      vi.advanceTimersByTime(AI_APPLY_PARTIAL_INTERVAL_MS * 3 - 1)
    })
    expect(btn).toHaveAttribute('data-pressed', 'false')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(btn).toHaveAttribute('data-pressed', 'true')
  })

  it('AI_APPLY: 같은 카테고리 내 2개 버튼(departure-address1, departure-datetime) 은 동일 offset 에서 press', () => {
    render(
      <AiPanelContainer
        step={AI_APPLY_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const addressBtn = screen.getByTestId('ai-button-item-btn-departure-address1')
    const datetimeBtn = screen.getByTestId('ai-button-item-btn-departure-datetime')
    // 둘 다 index 0 (departure) → 동시에 press
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(addressBtn).toHaveAttribute('data-pressed', 'true')
    expect(datetimeBtn).toHaveAttribute('data-pressed', 'true')
  })

  it('INITIAL Step 에서는 partialBeat 미존재 → 카테고리 버튼도 미렌더', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    // extractState=idle → AiButtonItem 미렌더 (부모 AiResultButtons 의 showButtons=false)
    expect(
      screen.queryByTestId('ai-button-item-btn-departure-address1'),
    ).not.toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// M4-01 — #2 focus-walk (TC-DASH3-UNIT-FOCUS 적용 검증)
// ---------------------------------------------------------------------------

const AI_INPUT_STEP = PREVIEW_STEPS[1]!
const AI_EXTRACT_STEP = PREVIEW_STEPS[2]!

describe('AiPanelContainer #2 focus-walk 적용 (M4-01)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('AI_INPUT Step: ai-input-textarea 영역에 data-focus-active="true" 적용', () => {
    render(
      <AiPanelContainer
        step={AI_INPUT_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const textbox = screen.getByRole('textbox', { name: 'AI 입력 영역 (데모)' })
    expect(textbox).toHaveAttribute('data-focus-active', 'true')
  })

  it('AI_EXTRACT Step: ai-extract-button 에 data-focus-active="true" 적용', () => {
    render(
      <AiPanelContainer
        step={AI_EXTRACT_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    // AI_EXTRACT 상태에서 버튼 label 은 "추출 중..." (exact)
    // F5 이전: AiExtractJsonViewer toggle 과 충돌 방지 목적이었음 (R1/R2 로 해결됨).
    // exact name 은 그대로 유지 (의미 변화 없음).
    const btn = screen.getByRole('button', { name: '추출 중...' })
    expect(btn).toHaveAttribute('data-focus-active', 'true')
  })

  it('INITIAL Step: focusWalk 이 빈 배열 → 어떤 요소도 data-focus-active 비활성', () => {
    render(
      <AiPanelContainer
        step={INITIAL_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const textbox = screen.getByRole('textbox', { name: 'AI 입력 영역 (데모)' })
    expect(textbox).toHaveAttribute('data-focus-active', 'false')
    const btn = screen.getByRole('button', { name: '추출하기' })
    expect(btn).toHaveAttribute('data-focus-active', 'false')
  })

  it('AI_APPLY Step: departure 카테고리 그룹이 mount 즉시 data-focus-active', () => {
    render(
      <AiPanelContainer
        step={AI_APPLY_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    const departureGroup = screen.getByRole('group', {
      name: /AI 추출 결과 — 상차지/,
    })
    expect(departureGroup).toHaveAttribute('data-focus-active', 'true')
    const destinationGroup = screen.getByRole('group', {
      name: /AI 추출 결과 — 하차지/,
    })
    expect(destinationGroup).toHaveAttribute('data-focus-active', 'false')
  })

  it('AI_APPLY Step: 400ms 경과 후 destination 그룹으로 focus 이동', () => {
    render(
      <AiPanelContainer
        step={AI_APPLY_STEP}
        aiInput={PREVIEW_MOCK_DATA.aiInput}
        aiResult={PREVIEW_MOCK_DATA.aiResult}
      />,
    )

    act(() => {
      vi.advanceTimersByTime(AI_APPLY_PARTIAL_INTERVAL_MS)
    })

    const departureGroup = screen.getByRole('group', {
      name: /AI 추출 결과 — 상차지/,
    })
    expect(departureGroup).toHaveAttribute('data-focus-active', 'false')
    const destinationGroup = screen.getByRole('group', {
      name: /AI 추출 결과 — 하차지/,
    })
    expect(destinationGroup).toHaveAttribute('data-focus-active', 'true')
  })
})
