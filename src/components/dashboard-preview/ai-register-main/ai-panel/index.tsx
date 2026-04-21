/**
 * AiPanelContainer — 좌측 AI 패널 380px 고정 shell.
 *
 * T-DASH3-M1-03 — shell 만 작성. 자식 컴포넌트 주입은 M2 에서 수행.
 *
 * 레이아웃
 *  - width: `w-[380px]` 고정 (REQ-DASH3-050)
 *  - background: `bg-black/40` + 우측 `border-r border-white/10` (landing 팔레트)
 *  - flex flex-col overflow-hidden — 자식을 세로 스택으로 배치
 *
 * 접근성 (REQ-DASH-007)
 *  - `<aside aria-label="AI 화물 등록 패널">` landmark
 *
 * 주입 예정 자식 (M2)
 *  - AiTabBar
 *  - AiInputArea
 *  - AiExtractButton
 *  - AiResultButtons
 *  - AiWarningBadges
 *  - AiExtractJsonViewer
 */

'use client'

import type { PreviewMockData } from '@/lib/mock-data'
import type { PreviewStep } from '@/lib/preview-steps'

export interface AiPanelContainerProps {
  readonly step: PreviewStep
  readonly aiInput: PreviewMockData['aiInput']
  readonly aiResult: PreviewMockData['aiResult']
}

export function AiPanelContainer(_props: AiPanelContainerProps) {
  return (
    <aside
      aria-label="AI 화물 등록 패널"
      className="w-[380px] flex-shrink-0 border-r border-white/10 bg-black/40 flex flex-col overflow-hidden"
    >
      {/* M2 에서 자식 컴포넌트 주입 예정. */}
      <div className="flex-1 overflow-y-auto">
        {/* placeholder — M2 에서 AiTabBar / AiInputArea / AiExtractButton / AiResultButtons / AiWarningBadges / AiExtractJsonViewer 주입 */}
      </div>
    </aside>
  )
}
