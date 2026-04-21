/**
 * @spike T-DASH3-SPIKE-01 — 종료 시 이관 or 폐기
 *
 * 원본: `.references/code/mm-broker/app/broker/order/ai-register/_components/ai-input-area.tsx`
 *
 * Spike 범위:
 * - 텍스트 탭 only (이미지 탭 제외)
 * - Tabs / TabsTrigger / Textarea / Button 등 shadcn 의존 → native + className 대체
 * - 비즈니스 로직 제거 (extract/reset/copy 등 핸들러 없음), stateless props
 * - progress 기반 caret blink 표시 (use-fake-typing 연동은 상위에서 주입)
 */

'use client'

import { useMemo } from 'react'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface AiInputAreaSpikeProps {
  /** 현재까지 타이핑된 텍스트 (use-fake-typing displayedText) */
  readonly text: string
  /** 진행도 0~1. 1 미만이면 caret 깜빡임 표시 */
  readonly progress: number
  /** 현재 AI_INPUT 단계 활성 여부 (caret 표시 제어) */
  readonly active: boolean
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AiInputAreaSpike({ text, progress, active }: AiInputAreaSpikeProps) {
  const showCaret = active && progress < 1
  const charCount = text.length

  // 원본 hint placeholder (줄임)
  const placeholder = useMemo(
    () => '카톡 메시지나 오더 내용을 붙여넣기 해주세요.\nAI가 자동으로 항목을 추출합니다.',
    [],
  )

  return (
    <div className="p-4 space-y-4">
      {/* Tabs list — 원본 grid-cols-2 재현, 텍스트 탭만 active 표기 */}
      <div
        role="tablist"
        aria-label="AI 입력 방식"
        className="grid grid-cols-2 gap-1 p-1 bg-black/40 border border-white/10 rounded-lg"
      >
        <button
          type="button"
          role="tab"
          aria-selected="true"
          className="text-xs font-semibold py-1.5 rounded-md bg-accent/20 text-accent border border-accent/30"
        >
          텍스트
        </button>
        <button
          type="button"
          role="tab"
          aria-selected="false"
          disabled
          className="text-xs font-medium py-1.5 rounded-md text-gray-500 hover:text-gray-300 transition-colors"
        >
          이미지
        </button>
      </div>

      {/* 텍스트 탭 콘텐츠 */}
      <div className="space-y-2 mt-3">
        <div className="relative">
          {/* Textarea 대체: readOnly div 로 타이핑 중 텍스트 표시 (caret 직접 제어) */}
          <div
            aria-label="AI 입력 텍스트"
            className="min-h-[140px] text-sm leading-relaxed whitespace-pre-wrap rounded-lg border border-white/10 bg-black/40 px-3 py-3 pr-10 text-gray-200"
          >
            {text.length === 0 && !active ? (
              <span className="text-gray-600">{placeholder}</span>
            ) : (
              <>
                <span>{text}</span>
                {showCaret ? <span className="spike-caret">|</span> : null}
              </>
            )}
          </div>

          {/* 복사 버튼 placeholder (native button) */}
          <button
            type="button"
            aria-label="텍스트 복사"
            className="absolute top-2 right-2 h-7 w-7 rounded-md hover:bg-white/10 text-gray-500 hover:text-gray-300 flex items-center justify-center transition-colors"
            tabIndex={-1}
          >
            <span className="text-xs">⧉</span>
          </button>
        </div>

        <div className="text-right text-[11px] text-gray-500">{charCount}자</div>
      </div>

      {/* caret blink 로컬 스타일 */}
      <style jsx>{`
        .spike-caret {
          display: inline-block;
          margin-left: 1px;
          color: #8b5cf6; /* accent */
          animation: spike-caret-blink 1s step-start infinite;
        }

        @keyframes spike-caret-blink {
          50% {
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .spike-caret {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
