/**
 * AiResultButtons — 4 카테고리 그룹 shell (stateless dumb component).
 *
 * T-DASH3-M2-05 — 원본 `ai-result-buttons.tsx` (mm-broker) 의 4 카테고리 구조만
 * landing Phase 3 demo 용 stateless dumb component 로 복제.
 *
 * 범위 (이 TASK)
 *  - 4 카테고리(departure / destination / cargo / fare) 헤더 + 아이콘 + 그룹 컨테이너 복제.
 *  - 개별 버튼(AiButtonItem) 은 M2-06 에서 renderButton prop 을 통해 주입.
 *  - 본 TASK 는 default slot (data-testid 슬롯만 찍힌 stub 카드) 을 기본 구현으로 두어
 *    prop 미지정 시에도 hover:bg-white/10 + transition-colors 가 작동하도록 한다.
 *
 * 상태별 렌더 (REQ-DASH3-003)
 *  - idle / loading : 카테고리 헤더만 렌더, 버튼 리스트는 placeholder (hidden).
 *  - resultReady    : 각 카테고리의 buttons 를 default slot 또는 renderButton 으로 렌더.
 *
 * 스타일 (REQ-DASH-005 landing 팔레트)
 *  - 그룹 카드 : `bg-white/5 border-white/10` + `rounded-lg`.
 *  - 카테고리 라벨 : `text-accent` + 소형 대문자 스타일.
 *  - default slot 버튼 : `hover:bg-white/10 transition-colors` (#5 CSS-only hover, REQ-DASH-006).
 *
 * 접근성 (REQ-DASH-007)
 *  - 각 카테고리 `role="group"` + `aria-label="AI 추출 결과 — {label}"`.
 *
 * @see REQ-DASH3-003 (AiPanel 컴포넌트 복제 매니페스트)
 * @see REQ-DASH3-026 (카테고리 그룹 4종)
 * @see REQ-DASH-006 (#5 hover 미세 전환)
 * @see TC-DASH3-UNIT-RESBT
 * @see TC-DASH3-UNIT-HOVER
 */

'use client'

import type { ReactNode } from 'react'
import { Banknote, Flag, MapPin, Package } from 'lucide-react'

import type {
  AiCategoryButton,
  AiCategoryGroup,
  AiCategoryIcon,
  AiCategoryId,
} from '@/lib/mock-data'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AiResultButtonsExtractState = 'idle' | 'loading' | 'resultReady'

export interface AiResultButtonsProps {
  readonly categories: ReadonlyArray<AiCategoryGroup>
  readonly extractState: AiResultButtonsExtractState
  /** M2-06 에서 AiButtonItem 주입. 미지정 시 default slot stub 렌더. */
  readonly renderButton?: (button: AiCategoryButton, groupId: AiCategoryId) => ReactNode
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ICON_MAP: Readonly<Record<AiCategoryIcon, typeof MapPin>> = {
  MapPin,
  Flag,
  Package,
  Banknote,
} as const

const GROUP_CARD_CLASSES =
  'rounded-lg bg-white/5 border border-white/10 p-3 flex flex-col gap-2'

const CATEGORY_LABEL_CLASSES =
  'text-xs font-bold uppercase tracking-wider text-accent'

const DEFAULT_SLOT_CLASSES =
  'rounded-md bg-white/[0.03] border border-white/10 px-3 py-2 text-xs text-white/80 ' +
  'transition-colors hover:bg-white/10'

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function AiResultButtons({
  categories,
  extractState,
  renderButton,
}: AiResultButtonsProps) {
  const showButtons = extractState === 'resultReady'

  return (
    <div className="flex flex-col gap-3 px-4 py-3">
      {categories.map((group) => {
        const Icon = ICON_MAP[group.icon]
        return (
          <div
            key={group.id}
            data-testid={`ai-category-${group.id}`}
            role="group"
            aria-label={`AI 추출 결과 — ${group.label}`}
            className={GROUP_CARD_CLASSES}
          >
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
              <span className={CATEGORY_LABEL_CLASSES}>{group.label}</span>
            </div>

            {showButtons ? (
              <div className="flex flex-wrap gap-2">
                {group.buttons.map((button) =>
                  renderButton ? (
                    renderButton(button, group.id)
                  ) : (
                    <DefaultSlot key={button.id} button={button} />
                  ),
                )}
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Default slot — M2-06 AiButtonItem 주입 전까지 hover/transition 검증용 stub
// ---------------------------------------------------------------------------

interface DefaultSlotProps {
  readonly button: AiCategoryButton
}

function DefaultSlot({ button }: DefaultSlotProps) {
  return (
    <div
      data-testid={`ai-button-slot-${button.id}`}
      data-field-key={button.fieldKey}
      data-status={button.status}
      className={DEFAULT_SLOT_CLASSES}
    >
      <span className="font-medium">{button.label}</span>
      <span className="ml-1 text-white/60">{button.displayValue}</span>
    </div>
  )
}
