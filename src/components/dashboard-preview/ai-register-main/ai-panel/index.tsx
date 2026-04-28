/**
 * AiPanelContainer — 좌측 AI 패널 380px 고정 + 자식 6 컴포넌트 조립.
 *
 * T-DASH3-M1-03 (shell) + T-DASH3-M2-01 (자식 주입) + T-DASH3-M3-11 (AI_APPLY partialBeat 주입)
 *
 * 레이아웃
 *  - width: `w-[380px]` 고정 (REQ-DASH3-050)
 *  - background: `bg-card/50` + 우측 `border-r border-border` (T-THEME-09 토큰 치환, D-015/D-016 원칙; 원본: `bg-black/40` / `border-white/10`)
 *  - flex flex-col overflow-hidden — 자식을 세로 스택으로 배치
 *
 * 접근성 (REQ-DASH-007)
 *  - `<aside aria-label="AI 화물 등록 패널">` landmark
 *
 * 주입 자식 (M2-01)
 *  - AiTabBar — 텍스트/이미지 탭
 *  - AiInputArea — fake-typing 결과 표시 (role="textbox")
 *  - AiExtractButton — idle/loading/resultReady 3 상태
 *  - AiWarningBadges — warnings 배열 있을 때만 렌더
 *  - AiResultButtons + AiButtonItem — 4 카테고리 결과 버튼
 *
 * 조작감 연동
 *  - #1 fake-typing : step.interactions.typingRhythm.active 시 활성
 *  - #3 button-press:
 *    - AI_EXTRACT Step: pressTargets 에 'ai-extract-button' 포함 시 AiExtractButton 에
 *      pressTriggerAt=0 주입 → 즉시 자동 press.
 *    - AI_APPLY Step: partialBeat.categoryOrder × intervalMs 기반으로 categoryIndex 마다
 *      AiButtonItem 에 pressTriggerAt 주입. 같은 카테고리 내 복수 버튼은 동일 offset 사용.
 *      (M3-11 — REQ-DASH3-041 / 042 / 043)
 *
 * SSOT
 *  - Phase 1 스펙 §2-1 Dumb Components 원칙:
 *    부모(이 컨테이너)가 hook 을 호출하여 자식에 결과를 주입.
 */

'use client'

import { useFakeTyping } from '@/components/dashboard-preview/interactions/use-fake-typing'
import { useFocusWalk } from '@/components/dashboard-preview/interactions/use-focus-walk'
import type { AiCategoryId, PreviewMockData } from '@/lib/mock-data'
import type { PreviewStep } from '@/lib/preview-steps'

import { AiButtonItem } from './ai-button-item'
import { AiExtractButton } from './ai-extract-button'
import { AiInputArea } from './ai-input-area'
import { AiResultButtons } from './ai-result-buttons'
import { AiTabBar } from './ai-tab-bar'
import { AiWarningBadges } from './ai-warning-badges'

/**
 * M4 review#3 — #2 focus-walk 전진 간격 (ms).
 * AI_APPLY partialBeat.intervalMs(300) 보다 약간 넉넉하게 설정하여 press 비트와
 * 겹치지 않도록 조율한다 (REQ-DASH3-021).
 */
const FOCUS_WALK_INTERVAL_MS = 650

export interface AiPanelContainerProps {
  readonly step: PreviewStep
  readonly aiInput: PreviewMockData['aiInput']
  readonly aiResult: PreviewMockData['aiResult']
  readonly onResultApply?: (categoryId: AiCategoryId) => void
}

/**
 * AI_APPLY Step 에서 카테고리별 pressTriggerAt 을 계산한다.
 *  - partialBeat 가 없거나 Step 이 AI_APPLY 가 아니면 null 반환 (press 비활성).
 *  - categoryIndex 가 categoryOrder 에 존재하면 `index × intervalMs` 를 반환.
 *  - 같은 카테고리 내 복수 버튼은 동일 offset 을 사용한다.
 */
function computeCategoryPressTriggerAt(
  step: PreviewStep,
  groupId: AiCategoryId,
): number | null {
  if (step.id !== 'AI_APPLY') return null
  const partialBeat = step.interactions.partialBeat
  if (!partialBeat) return null
  const categoryIndex = partialBeat.categoryOrder.indexOf(groupId)
  if (categoryIndex < 0) return null
  return categoryIndex * partialBeat.intervalMs
}

/**
 * M4-review#1 — 카테고리별 rippleTriggerAt 계산.
 * partialBeat.rippleTargets 에 포함된 groupId 만 auto ripple 대상.
 * 미포함 시 null 반환 (ripple 비활성, 수동 클릭 ripple 은 유지).
 */
function computeCategoryRippleTriggerAt(
  step: PreviewStep,
  groupId: AiCategoryId,
): number | null {
  if (step.id !== 'AI_APPLY') return null
  const partialBeat = step.interactions.partialBeat
  if (!partialBeat) return null
  if (!partialBeat.rippleTargets.includes(groupId)) return null
  return computeCategoryPressTriggerAt(step, groupId)
}

export function AiPanelContainer({
  step,
  aiInput,
  aiResult,
  onResultApply,
}: AiPanelContainerProps) {
  // -------------------------------------------------------------------------
  // #1 fake-typing — AI_INPUT Step 에서 typingRhythm.active=true
  // -------------------------------------------------------------------------
  const typingActive = step.interactions.typingRhythm?.active === true
  const { displayedText, progress } = useFakeTyping(aiInput.textValue, {
    active: typingActive,
  })

  // -------------------------------------------------------------------------
  // #2 focus-walk — M4-01 / REQ-DASH3-021
  //  - AI_INPUT   : focusWalk=['ai-input-textarea']       → AiInputArea 에 focused 주입.
  //  - AI_EXTRACT : focusWalk=['ai-extract-button']       → AiExtractButton focused.
  //  - AI_APPLY   : focusWalk=['ai-result-departure', ...] → AiResultButtons 그룹 순차.
  //  - INITIAL    : focusWalk=[]                          → 전부 비활성.
  //
  // 간격은 AI_APPLY 의 partialBeat.intervalMs(300ms) 보다 약간 넉넉한 400ms 로 고정하여
  // focus-walk 가 press 비트와 겹치지 않게 조율한다.
  // -------------------------------------------------------------------------
  const focusWalkTargets = step.interactions.focusWalk ?? []
  const { currentTargetId: focusedTargetId } = useFocusWalk(focusWalkTargets, {
    intervalMs: FOCUS_WALK_INTERVAL_MS,
    active: focusWalkTargets.length > 0,
  })

  // -------------------------------------------------------------------------
  // #3 button-press — AI_EXTRACT Step 에서 즉시 자동 press
  // pressTargets 는 ReadonlyArray<string> — 'ai-extract-button' 포함 여부로 판정
  // -------------------------------------------------------------------------
  const pressTargets = step.interactions.pressTargets ?? []
  const extractTriggerAt =
    step.id === 'AI_EXTRACT' && pressTargets.includes('ai-extract-button')
      ? 0
      : null

  // -------------------------------------------------------------------------
  // Step 에서 파생된 AI 상태 (aiResult mock 의 정적 값 대신 Step 스냅샷 사용)
  // 이 매핑이 있어야 Step 전환 시 AiExtractButton / AiResultButtons 가
  // idle → loading → resultReady 로 올바르게 변화한다.
  // -------------------------------------------------------------------------
  const extractState = step.aiState.extractState
  const activeTab = step.aiState.activeTab

  return (
    <aside
      aria-label="AI 화물 등록 패널"
      className="w-[380px] flex-shrink-0 border-r border-border bg-card/50 flex flex-col overflow-hidden"
    >
      {/* 헤더 — 제목 + Step label */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-gradient-to-br from-purple-600 to-blue-600 text-white text-xs flex items-center justify-center font-bold">
            AI
          </span>
          AI 화물 등록
        </h3>
        <span className="text-[10px] text-muted-foreground">{step.label}</span>
      </div>

      {/* 본문 — 자식 6 컴포넌트 세로 스택 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <AiTabBar activeTab={activeTab} />
          <AiInputArea
            activeTab={activeTab}
            text={displayedText}
            progress={progress}
            active={typingActive}
            focused={focusedTargetId === 'ai-input-textarea'}
          />
          <AiExtractButton
            state={extractState}
            pressTriggerAt={extractTriggerAt}
            focused={focusedTargetId === 'ai-extract-button'}
          />
          <AiWarningBadges warnings={aiResult.warnings} />
        </div>

        <AiResultButtons
          categories={aiResult.categories}
          extractState={extractState}
          focusedTargetId={focusedTargetId}
          renderButton={(button, groupId) => (
            <AiButtonItem
              key={button.id}
              button={button}
              groupId={groupId}
              // M3-11 — AI_APPLY partialBeat 카테고리 순차 press.
              // categoryIndex × intervalMs 만큼 offset 을 두고 자동 press 발동.
              // AI_EXTRACT Step 등 AI_APPLY 가 아닌 Step 에서는 null (press 비활성).
              pressTriggerAt={computeCategoryPressTriggerAt(step, groupId)}
              // M4-02 — ripple 을 press 와 동일 offset 으로 자동 발동.
              // M4-review#1 — rippleTargets SSOT 를 실제 소비. partialBeat.rippleTargets 에
              // 포함된 카테고리만 auto ripple 이 발동된다 (data-driven 판정).
              rippleTriggerAt={computeCategoryRippleTriggerAt(step, groupId)}
              onApply={() => onResultApply?.(groupId)}
            />
          )}
        />
      </div>
    </aside>
  )
}
