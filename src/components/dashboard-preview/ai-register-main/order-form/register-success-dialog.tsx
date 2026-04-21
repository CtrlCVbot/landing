/**
 * RegisterSuccessDialog — 화물 등록 완료 시 출력되는 성공 다이얼로그.
 *
 * T-DASH3-M3-10 — 원본 mm-broker `register-success-dialog.tsx` 의 shadcn Dialog /
 * Next.js router / Zustand store 연동을 제거한 landing Phase 3 stateless 복제.
 *
 * Phase 1 범위
 *  - 파일만 복제. Phase 1 에서는 상위에서 `open={false}` 고정으로 주입한다.
 *  - Phase 4 에서 AI_APPLY 완료 직후 `open={true}` 로 전환 예정 (REQ-DASH3-013).
 *  - 현재는 시각적 준비만 수행 (닫기 버튼 onClick no-op).
 *
 * 정책 (Phase 3 스펙 §2-1 Dumb Components 원칙)
 *  - `open=false` → null 반환 (DOM 미노출).
 *  - `open=true`  → 기본 다이얼로그 구조 (제목/orderId/닫기).
 *  - CompanyManager 등 다른 컴포넌트와 props 격리 — open/orderId 만 받는다.
 *
 * 스타일 (REQ-DASH-005 landing 팔레트)
 *  - 컨테이너: `bg-white/5 border-white/10 rounded-xl p-6 backdrop-blur-md`.
 *  - 성공 아이콘: lucide `CheckCircle2` (`text-emerald-400`).
 *
 * 접근성 (REQ-DASH-007)
 *  - `role="dialog" aria-label="화물 등록 완료"` landmark.
 *  - 아이콘은 `aria-hidden="true"`.
 *
 * @see REQ-DASH3-004 (OrderForm 컴포넌트 복제 매니페스트 — RegisterSuccessDialog)
 * @see REQ-DASH3-013 (Phase 4 유보 — 현재는 파일 복제만)
 * @see REQ-DASH-005  (landing 팔레트)
 * @see REQ-DASH-007  (접근성)
 * @see TC-DASH3-UNIT-SUCCESSOFF
 */

'use client'

import { CheckCircle2 } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RegisterSuccessDialogProps {
  /**
   * 다이얼로그 노출 여부.
   *  - false → null 반환 (Phase 1 기본값 — Phase 4 이전까지 항상 false).
   *  - true  → 다이얼로그 구조 렌더 (Phase 4 에서 호출 예정).
   */
  readonly open: boolean
  /** 등록된 화물 ID (open=true 시 본문에 표시) */
  readonly orderId?: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CARD_CLASSES =
  'bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md space-y-4 max-w-sm mx-auto'

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function RegisterSuccessDialog({
  open,
  orderId,
}: RegisterSuccessDialogProps) {
  if (!open) {
    return null
  }

  return (
    <div
      role="dialog"
      aria-label="화물 등록 완료"
      data-testid="register-success-dialog"
      className={CARD_CLASSES}
    >
      <SuccessHeader />
      <OrderIdBlock orderId={orderId} />
      <CloseButton />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-component — SuccessHeader
// ---------------------------------------------------------------------------

function SuccessHeader() {
  return (
    <div className="flex flex-col items-center gap-2">
      <CheckCircle2
        aria-hidden="true"
        data-icon="register-success"
        className="h-12 w-12 text-emerald-400 shrink-0"
      />
      <h3 className="text-base font-semibold text-white">화물 등록 완료</h3>
      <p className="text-xs text-white/60 text-center">
        화물이 성공적으로 등록되었습니다.
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-component — OrderIdBlock
// ---------------------------------------------------------------------------

interface OrderIdBlockProps {
  readonly orderId: string | undefined
}

function OrderIdBlock({ orderId }: OrderIdBlockProps) {
  return (
    <div className="flex flex-col gap-1 items-center px-4 py-2 rounded-md bg-white/5 border border-white/10">
      <span className="text-[10px] text-white/50">등록된 화물 ID</span>
      <span
        data-testid="register-success-order-id"
        className="font-mono text-sm text-accent tabular-nums"
      >
        {orderId ?? '-'}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-component — CloseButton
//
// Phase 4 에서 Router / Store 연동 (목록 이동) 예정. 현재는 no-op.
// ---------------------------------------------------------------------------

function CloseButton() {
  return (
    <div className="flex justify-center">
      <button
        type="button"
        data-testid="register-success-close"
        className="px-4 py-2 rounded-md bg-white/10 text-white/80 text-xs font-medium hover:bg-white/20 transition-colors"
        onClick={() => {
          // Phase 1 범위 외 — Phase 4 에서 onClose 콜백 주입 예정.
        }}
      >
        닫기
      </button>
    </div>
  )
}
