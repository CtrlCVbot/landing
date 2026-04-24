/**
 * AiWarningBadges — AI 추출 경고 배지 리스트 (stateless).
 *
 * T-DASH3-M2-07 — 원본 `ai-warning-badges.tsx` (mm-broker) 를 landing Phase 3
 * demo 용 stateless dumb component 로 복제.
 *
 * 정책 (Phase 3 스펙 §2-1 Dumb Components 원칙)
 *  - 원본의 `getWarningInfo` / `resolvedKeys` / severity 분기(`info` vs `warning`)
 *    로직은 전부 제거하고, 받은 문자열을 그대로 amber 배지로 렌더.
 *  - 빈 배열이면 null 반환 (렌더 안 함).
 *  - 한국어 warning 메시지 그대로 표시 (상위에서 이미 변환된 사용자 메시지 가정).
 *
 * 스타일 (REQ-DASH-005 landing 팔레트, T-THEME-09 토큰 치환)
 *  - amber/warning 계열 — `bg-amber-500/10 border-amber-500/30 text-amber-700` (원본: `text-amber-300` → D-013 WCAG AA 승계).
 *  - `lucide-react` 의 `AlertTriangle` 아이콘 + `data-icon="alert-triangle"` 속성
 *    으로 테스트/스타일링 hook 제공.
 *
 * 접근성 (REQ-DASH-007)
 *  - `role="list"` + `aria-label="AI 추출 경고"` — 배지가 존재할 때만 렌더.
 *  - 각 배지는 `role="listitem"`.
 *
 * @see REQ-DASH3-003 (AiPanel 컴포넌트 복제 매니페스트 — AiWarningBadges)
 * @see TC-DASH3-UNIT-WARNBADGE
 */

'use client'

import { AlertTriangle } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AiWarningBadgesProps {
  readonly warnings: readonly string[]
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BADGE_CLASSES =
  'flex items-start gap-2 rounded-lg border px-3 py-2 text-xs font-medium ' +
  'bg-amber-500/10 border-amber-500/30 text-amber-700'

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function AiWarningBadges({ warnings }: AiWarningBadgesProps) {
  if (warnings.length === 0) return null

  return (
    <ul
      role="list"
      aria-label="AI 추출 경고"
      className="flex flex-col gap-1.5 px-4 py-2"
    >
      {warnings.map((warning, index) => (
        <li
          key={`${warning}-${index}`}
          role="listitem"
          data-testid={`ai-warning-badge-${index}`}
          className={BADGE_CLASSES}
        >
          <AlertTriangle
            aria-hidden="true"
            data-icon="alert-triangle"
            className="h-3.5 w-3.5 shrink-0 mt-0.5"
          />
          <span className="leading-relaxed">{warning}</span>
        </li>
      ))}
    </ul>
  )
}
