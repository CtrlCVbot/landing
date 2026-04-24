/**
 * AiInputArea — 텍스트 / 이미지 탭 콘텐츠 (stateless).
 *
 * T-DASH3-M2-03 — 원본 `ai-input-area.tsx` (mm-broker, 285줄) 의 핵심 영역을
 * landing Phase 3 demo 용 stateless dumb component 로 복제.
 *
 * 정책 (Phase 3 스펙 §2-1 Dumb Components 원칙)
 *  - React Hook Form, 파일 업로드(`processFile` / `FileReader`), Reset /
 *    ExtractState 상태 머신, Toast, Loading spinner 등은 전부 제거.
 *  - fake-typing 훅은 상위(`ai-panel/index.tsx`) 에서 호출하여 결과를
 *    `text` / `progress` / `active` props 로 주입한다.
 *  - 이미지 탭은 시각적 placeholder 만 표시하고 실제 업로드 기능은 제거한다.
 *
 * 접근성 (REQ-DASH-007)
 *  - 텍스트 뷰: `role="textbox"` + `aria-readonly="true"` + `aria-label`.
 *  - caret 은 `aria-hidden="true"`.
 *
 * 스타일 (REQ-DASH-005 landing 팔레트, T-THEME-09 토큰 치환)
 *  - `bg-card/50` / `border-border` / `rounded-lg` / `text-foreground` (원본: `bg-black/40` / `border-white/10` / `text-gray-200`).
 *  - caret 색상: `text-accent` / `animate-pulse`.
 *
 * @see REQ-DASH3-003  (AiPanel 컴포넌트 복제 매니페스트)
 * @see REQ-DASH3-020  (#1 조작감 — 변동 리듬 타이핑 연동)
 * @see REQ-DASH-005   (랜딩 팔레트 일관성)
 * @see TC-DASH3-UNIT-INPAREA
 * @see TC-DASH3-UNIT-TYP
 */

'use client'

import type { AiTabKey } from './ai-tab-bar'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AiInputAreaProps {
  /** 현재 활성 탭. */
  readonly activeTab: AiTabKey
  /** 표시할 현재 텍스트 (fake-typing 결과). */
  readonly text: string
  /** fake-typing 진행도 0~1. */
  readonly progress: number
  /** fake-typing active 여부. 이 값이 true 이고 text 가 존재할 때만 caret 깜빡임. */
  readonly active: boolean
  /**
   * #2 focus-walk 대상 여부 (M4-01 / REQ-DASH3-021).
   * true 일 때 ring 스타일 + `data-focus-active="true"` 속성 부여.
   */
  readonly focused?: boolean
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PLACEHOLDER =
  '카톡 메시지나 오더 내용을 붙여넣기 해주세요.\nAI가 자동으로 항목을 추출합니다.'

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function AiInputArea({
  activeTab,
  text,
  progress,
  active,
  focused = false,
}: AiInputAreaProps) {
  if (activeTab === 'image') {
    return <ImageTabPlaceholder />
  }

  const showCaret = active && text.length > 0
  const progressLabel = active ? `${Math.round(progress * 100)}%` : ''

  return (
    <div className="relative">
      <div
        role="textbox"
        aria-readonly="true"
        aria-label="AI 입력 영역 (데모)"
        data-focus-active={focused ? 'true' : 'false'}
        className={
          'bg-card/50 border rounded-lg p-3 min-h-[140px] text-sm text-foreground whitespace-pre-wrap transition-shadow ' +
          (focused
            ? 'border-accent/70 ring-2 ring-accent/40 shadow-[0_0_0_2px_rgba(96,165,250,0.15)]'
            : 'border-border')
        }
      >
        {text.length > 0 ? (
          text
        ) : (
          <span className="text-muted-foreground/70">{PLACEHOLDER}</span>
        )}
        {showCaret && (
          <span
            className="inline-block w-[2px] h-4 bg-accent ml-0.5 animate-pulse align-middle"
            aria-hidden="true"
          />
        )}
      </div>
      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
        <span>{progressLabel}</span>
        <span>{text.length}자</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Image Tab — 시각 placeholder 만 (실제 업로드 로직은 M2 범위 외)
// ---------------------------------------------------------------------------

function ImageTabPlaceholder() {
  return (
    <div className="bg-card/50 border border-border border-dashed rounded-lg p-8 text-center text-muted-foreground text-sm">
      이미지를 드래그 앤 드롭 또는 클릭하여 업로드
      <div className="text-xs text-muted-foreground/70 mt-2">(데모 — 실제 업로드는 비활성)</div>
    </div>
  )
}
