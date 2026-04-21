'use client'

import { type AiPanelState } from '@/lib/preview-steps'
import { PREVIEW_MOCK_DATA } from '@/lib/mock-data'
import { MapPin, Flag, Package, Banknote, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AiPanelPreviewProps {
  readonly aiPanelState: AiPanelState
  readonly className?: string
}

type CategoryId = 'departure' | 'destination' | 'cargo' | 'fare'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORY_META: ReadonlyArray<{
  readonly id: CategoryId
  readonly label: string
  readonly Icon: typeof MapPin
}> = [
  { id: 'departure', label: '상차지', Icon: MapPin },
  { id: 'destination', label: '하차지', Icon: Flag },
  { id: 'cargo', label: '화물·차량', Icon: Package },
  { id: 'fare', label: '운임', Icon: Banknote },
] as const

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function AiTabBar() {
  return (
    <div data-testid="ai-tab-bar" className="flex border-b border-gray-800">
      <div className="flex-1 px-4 py-2 text-center text-sm border-b-2 border-blue-400 text-blue-400">
        텍스트
      </div>
      <div className="flex-1 px-4 py-2 text-center text-sm border-b-2 border-transparent text-gray-500">
        이미지
      </div>
    </div>
  )
}

function AiTextarea({ inputText }: { readonly inputText: string }) {
  const isEmpty = inputText === ''

  return (
    <div
      data-testid="ai-textarea"
      className="rounded-lg border border-gray-700 bg-gray-800/50 p-3 min-h-[120px] text-sm"
    >
      {isEmpty ? (
        <span className="text-gray-500">카카오톡 메시지를 입력하세요</span>
      ) : (
        <span className="text-gray-200">{inputText}</span>
      )}
    </div>
  )
}

function AiExtractButton({
  extractState,
  inputText,
}: {
  readonly extractState: AiPanelState['extractState']
  readonly inputText: string
}) {
  const isDisabled =
    (extractState === 'idle' && inputText === '') || extractState === 'resultReady'
  const isLoading = extractState === 'loading'

  return (
    <div
      data-testid="extract-button"
      className={cn(
        'mt-3 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white',
        isDisabled && 'opacity-50',
      )}
    >
      {isLoading ? (
        <>
          <Loader2 data-testid="extract-spinner" className="h-4 w-4 animate-spin" />
          <span>분석 중...</span>
        </>
      ) : (
        <span>추출하기</span>
      )}
    </div>
  )
}

function AiResultButtons({
  buttons,
}: {
  readonly buttons: AiPanelState['buttons']
}) {
  if (buttons.length === 0) {
    return null
  }

  const mockCategories = PREVIEW_MOCK_DATA.aiResult.categories

  return (
    <div data-testid="ai-result-buttons" className="mt-4 flex flex-col gap-3">
      {CATEGORY_META.map((meta) => {
        const buttonState = buttons.find((b) => b.id === meta.id)
        if (!buttonState) return null

        const isPending = buttonState.status === 'pending'
        const mockCategory = mockCategories.find((c) => c.id === meta.id)

        return (
          <div
            key={meta.id}
            data-testid={`category-group-${meta.id}`}
            className="flex flex-col gap-1"
          >
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <meta.Icon
                data-testid={`icon-${meta.id}`}
                className="h-3.5 w-3.5"
              />
              <span>{meta.label}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {mockCategory?.buttons.map((btn) => (
                <div
                  key={btn.fieldKey}
                  data-testid={`category-button-${btn.fieldKey}`}
                  className={cn(
                    'rounded-lg px-3 py-2 text-xs',
                    isPending
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-green-500/20 text-green-400',
                  )}
                >
                  <span className="font-medium">{btn.label}</span>
                  <span className="ml-1">{btn.displayValue}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function AiPanelPreview({ aiPanelState, className }: AiPanelPreviewProps) {
  const { inputText, extractState, buttons } = aiPanelState

  return (
    <div
      data-testid="ai-panel"
      className={cn(
        'w-[380px] flex-shrink-0 border-r border-gray-800 bg-gray-900/30 flex flex-col overflow-hidden',
        className,
      )}
    >
      <AiTabBar />
      <div className="flex-1 p-4 overflow-y-auto">
        <AiTextarea inputText={inputText} />
        <AiExtractButton extractState={extractState} inputText={inputText} />
        <AiResultButtons buttons={buttons} />
      </div>
    </div>
  )
}
