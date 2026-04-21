/**
 * AiPanelContainer — 좌측 AI 패널 380px 고정 + 자식 7 컴포넌트 조립.
 *
 * T-DASH3-M1-03 (shell) + T-DASH3-M2-01 (자식 주입)
 *
 * 레이아웃
 *  - width: `w-[380px]` 고정 (REQ-DASH3-050)
 *  - background: `bg-black/40` + 우측 `border-r border-white/10` (landing 팔레트)
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
 *  - AiExtractJsonViewer — 기본 접힘
 *
 * 조작감 연동
 *  - #1 fake-typing : step.interactions.typingRhythm.active 시 활성
 *  - #3 button-press: step.id === 'AI_EXTRACT' + pressTargets 에 'ai-extract-button' 포함 시
 *                     AiExtractButton 에 pressTriggerAt=0 주입 → 즉시 자동 press
 *  - AiButtonItem 개별 카테고리 순차 press (partialBeat.categoryOrder) 는 M3 에서 구현.
 *
 * SSOT
 *  - Phase 1 스펙 §2-1 Dumb Components 원칙:
 *    부모(이 컨테이너)가 hook 을 호출하여 자식에 결과를 주입.
 */

'use client'

import { useFakeTyping } from '@/components/dashboard-preview/interactions/use-fake-typing'
import type { PreviewMockData } from '@/lib/mock-data'
import type { PreviewStep } from '@/lib/preview-steps'

import { AiButtonItem } from './ai-button-item'
import { AiExtractButton } from './ai-extract-button'
import { AiExtractJsonViewer } from './ai-extract-json-viewer'
import { AiInputArea } from './ai-input-area'
import { AiResultButtons } from './ai-result-buttons'
import { AiTabBar } from './ai-tab-bar'
import { AiWarningBadges } from './ai-warning-badges'

export interface AiPanelContainerProps {
  readonly step: PreviewStep
  readonly aiInput: PreviewMockData['aiInput']
  readonly aiResult: PreviewMockData['aiResult']
}

export function AiPanelContainer({
  step,
  aiInput,
  aiResult,
}: AiPanelContainerProps) {
  // -------------------------------------------------------------------------
  // #1 fake-typing — AI_INPUT Step 에서 typingRhythm.active=true
  // -------------------------------------------------------------------------
  const typingActive = step.interactions.typingRhythm?.active === true
  const { displayedText, progress } = useFakeTyping(aiInput.textValue, {
    active: typingActive,
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
      className="w-[380px] flex-shrink-0 border-r border-white/10 bg-black/40 flex flex-col overflow-hidden"
    >
      {/* 헤더 — 제목 + Step label */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-gradient-to-br from-purple-600 to-blue-600 text-white text-xs flex items-center justify-center font-bold">
            AI
          </span>
          AI 화물 등록
        </h3>
        <span className="text-[10px] text-gray-400">{step.label}</span>
      </div>

      {/* 본문 — 자식 7 컴포넌트 세로 스택 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <AiTabBar activeTab={activeTab} />
          <AiInputArea
            activeTab={activeTab}
            text={displayedText}
            progress={progress}
            active={typingActive}
          />
          <AiExtractButton
            state={extractState}
            pressTriggerAt={extractTriggerAt}
          />
          <AiWarningBadges warnings={aiResult.warnings} />
        </div>

        <AiResultButtons
          categories={aiResult.categories}
          extractState={extractState}
          renderButton={(button, groupId) => (
            <AiButtonItem
              key={button.id}
              button={button}
              groupId={groupId}
              pressTriggerAt={null}
            />
          )}
        />

        <AiExtractJsonViewer
          json={aiResult.evidence}
          defaultOpen={aiResult.jsonViewerOpen}
        />
      </div>
    </aside>
  )
}
