/**
 * AiTabBar — 텍스트 / 이미지 탭 전환 (stateless).
 *
 * T-DASH3-M2-02 — 원본 `ai-input-area.tsx` 의 Tabs/TabsList/TabsTrigger 영역을
 * landing 팔레트 기반 native 버튼으로 복제. spike demo 는 데모 모형이므로 실제
 * 탭 전환 로직(fake-typing) 은 M2-03 AiInputArea 가 담당하며, 본 컴포넌트는 시각
 * 표현과 접근성만 제공한다.
 *
 * 접근성 (REQ-DASH-007 + M5-06)
 *  - `role="tablist"` + `aria-label="AI 입력 타입 선택"`
 *  - 각 탭은 `role="tab"` + `aria-selected`
 *  - aria-controls 는 의도적으로 미지정 — tabpanel 요소가 별도로 존재하지 않는 데모 렌더
 *    이므로 dangling aria-controls 를 회피 (axe-core aria-valid-attr-value 위반 방지).
 *
 * @see REQ-DASH3-003 (AiPanel 컴포넌트 복제 매니페스트)
 * @see TC-DASH3-UNIT-TABBAR
 * @see TC-DASH3-A11Y-AXE (M5-06)
 */

'use client'

export type AiTabKey = 'text' | 'image'

export interface AiTabBarProps {
  readonly activeTab: AiTabKey
  readonly onTabChange?: (tab: AiTabKey) => void
}

const TABS: ReadonlyArray<{ readonly key: AiTabKey; readonly label: string }> = [
  { key: 'text', label: '텍스트' },
  { key: 'image', label: '이미지' },
] as const

const ACTIVE_CLASSES =
  'text-xs font-semibold py-1.5 rounded-md bg-accent/20 text-accent border border-accent/30'

const INACTIVE_CLASSES =
  'text-xs font-semibold py-1.5 rounded-md text-gray-500 hover:text-gray-300 transition-colors'

export function AiTabBar({ activeTab, onTabChange }: AiTabBarProps) {
  return (
    <div
      role="tablist"
      aria-label="AI 입력 타입 선택"
      className="grid grid-cols-2 gap-0 bg-black/40 border border-white/10 rounded-lg p-1"
    >
      {TABS.map(({ key, label }) => {
        const isActive = activeTab === key
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            data-tab={key}
            data-active={isActive}
            onClick={() => onTabChange?.(key)}
            className={isActive ? ACTIVE_CLASSES : INACTIVE_CLASSES}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
