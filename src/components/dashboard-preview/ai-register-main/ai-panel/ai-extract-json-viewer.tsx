/**
 * AiExtractJsonViewer — AI 추출 결과 JSON 접힘/펼침 뷰어 (local state only).
 *
 * T-DASH3-M2-08 — 원본 `ai-extract-json-viewer.tsx` (mm-broker) 를 landing
 * Phase 3 demo 용으로 단순화 복제.
 *
 * 정책 (Phase 3 스펙 §2-1 Dumb Components 원칙)
 *  - 원본의 `AiExtractData` 도메인 타입 의존, 클립보드 복사(Copy/Check),
 *    외부 Copy 버튼 이벤트 전파 방지(stopPropagation) 로직은 전부 제거.
 *  - `json: Record<string, unknown>` 범용 JSON 입력으로 단순화.
 *  - 로컬 expanded state 만 보유(`useState`) — 외부 제어는 `defaultOpen` 만.
 *
 * UX (REQ-DASH3-003)
 *  - 기본 접힘 상태(`defaultOpen` 기본 false).
 *  - 상단 토글 버튼: `lucide-react` ChevronRight/ChevronDown + "추출 결과 JSON" 라벨.
 *  - 펼침 시 `<pre>` 로 `JSON.stringify(json, null, 2)` pretty print.
 *  - 모노스페이스 폰트(`font-mono`) + 스크롤 가능 max-height.
 *
 * 접근성 (REQ-DASH-007)
 *  - 토글은 `<button type="button">` + `aria-expanded` + `aria-controls`.
 *  - 접힘 시 body 는 DOM 자체가 없으므로 aria-controls 대상 id 는 항상 존재하는
 *    컨테이너가 아니라 body 자체를 가리킨다 — querySelector 호환성을 위해 id 고정.
 *
 * @see REQ-DASH3-003 (AiPanel 컴포넌트 복제 매니페스트 — AiExtractJsonViewer)
 * @see TC-DASH3-UNIT-JSONVIEWER
 */

'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Code } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AiExtractJsonViewerProps {
  readonly json: Record<string, unknown>
  readonly defaultOpen?: boolean
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BODY_ID = 'ai-extract-json-body'

const TOGGLE_CLASSES =
  'w-full flex items-center gap-2 px-4 py-2 text-xs font-medium ' +
  'text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors ' +
  'border-t border-border ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60'

const BODY_CLASSES =
  'font-mono text-[10px] leading-tight whitespace-pre-wrap break-all ' +
  'bg-card/50 border border-border rounded-md p-2 mx-4 mb-3 ' +
  'max-h-[300px] overflow-auto text-foreground'

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function AiExtractJsonViewer({
  json,
  defaultOpen = false,
}: AiExtractJsonViewerProps) {
  const [expanded, setExpanded] = useState<boolean>(defaultOpen)

  const pretty = JSON.stringify(json, null, 2)

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        aria-controls={expanded ? BODY_ID : undefined}
        className={TOGGLE_CLASSES}
      >
        <Code
          aria-hidden="true"
          data-icon="code"
          className="h-3 w-3 shrink-0"
        />
        <span className="font-semibold">추출 결과 JSON</span>
        <span className="ml-auto flex items-center">
          {expanded ? (
            <ChevronDown
              aria-hidden="true"
              data-icon="chevron-down"
              className="h-3 w-3"
            />
          ) : (
            <ChevronRight
              aria-hidden="true"
              data-icon="chevron-right"
              className="h-3 w-3"
            />
          )}
        </span>
      </button>
      {expanded ? (
        <pre
          id={BODY_ID}
          data-testid="ai-json-body"
          className={BODY_CLASSES}
        >
          {pretty}
        </pre>
      ) : null}
    </div>
  )
}
