/**
 * CompanyManagerSection — 회사 + 담당자 pre-filled 카드 (stateless).
 *
 * T-DASH3-M3-02 — 원본 `company-manager-section.tsx` (mm-broker, 399줄) 의
 * 핵심 뼈대만 landing Phase 3 demo 용으로 복제.
 *
 * 정책 (Phase 3 스펙 §2-1 Dumb Components 원칙)
 *  - 원본의 회사 검색 Popover / 담당자 추가 Dialog / react-hook-form 연동 로직 전부 제거.
 *  - INITIAL 부터 pre-filled 유지 (AI_APPLY fill-in 대상 제외 — REQ-DASH3-022).
 *  - `filled` prop 은 호환성을 위해 유지하되 기본 true. false 일 땐 placeholder "—".
 *
 * 스타일 (REQ-DASH-005 landing 팔레트)
 *  - 카드: `bg-card/50 border-border rounded-xl backdrop-blur-sm` (T-THEME-13 토큰 치환; 원본: bg-white/5 border-white/10)
 *  - Pre-filled 배지: `text-accent bg-accent/10 border-accent/20`
 *  - 담당자 아바타: `bg-gradient-to-br from-purple-600/80 to-blue-600/80 rounded-full`
 *
 * 접근성 (REQ-DASH-007)
 *  - `<section role="region" aria-label="회사 및 담당자 정보">` landmark
 *
 * 표시값 (SSOT §4-3)
 *  - 회사: 옵틱물류 / ***-**-***** / 김옵틱
 *  - 담당자: 이매니저 / 010-****-**** / example@optics.com / 물류운영팀
 *
 * @see REQ-DASH3-004 (OrderForm 컴포넌트 복제 매니페스트)
 * @see REQ-DASH3-014 (CompanyManagerSection INITIAL pre-filled)
 * @see REQ-DASH3-022 (AI_APPLY fill-in 대상에서 CompanyManager 제외)
 * @see TC-DASH3-UNIT-COMPMANSEC
 */

'use client'

import { Building2, User, Phone, Mail, Briefcase } from 'lucide-react'

import type { PreviewMockData } from '@/lib/mock-data'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CompanyManagerSectionProps {
  readonly company: PreviewMockData['formData']['company']
  readonly manager: PreviewMockData['formData']['manager']
  /**
   * Pre-filled 여부. REQ-DASH3-014 에 따라 INITIAL 부터 true 유지.
   * false 일 경우 placeholder "—" 로 대체 (이론적 대비 — demo 에서 사용 안 함).
   * @default true
   */
  readonly filled?: boolean
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CARD_CLASSES =
  'bg-card/50 border border-border rounded-xl backdrop-blur-sm p-4 space-y-3'

const PREFILLED_BADGE_CLASSES =
  'inline-flex items-center text-accent bg-accent/10 border border-accent/20 text-[10px] px-2 py-0.5 rounded-full'

const AVATAR_CLASSES =
  'flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/80 to-blue-600/80 flex items-center justify-center'

const PLACEHOLDER = '—'

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function CompanyManagerSection({
  company,
  manager,
  filled = true,
}: CompanyManagerSectionProps) {
  const companyName = filled ? company.name : PLACEHOLDER
  const businessNumber = filled ? company.businessNumber : PLACEHOLDER
  const ceoName = filled ? company.ceoName : PLACEHOLDER
  const managerName = filled ? manager.name : PLACEHOLDER
  const managerContact = filled ? manager.contact : PLACEHOLDER
  const managerEmail = filled ? manager.email : PLACEHOLDER
  const managerDepartment = filled ? manager.department : PLACEHOLDER

  return (
    <section
      role="region"
      aria-label="회사 및 담당자 정보"
      data-testid="company-manager-section"
      className={CARD_CLASSES}
    >
      {/* Header: 회사명 + pre-filled 배지 */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Building2
            aria-hidden="true"
            data-icon="building2"
            className="h-4 w-4 text-accent shrink-0"
          />
          <h3 className="text-sm font-semibold text-foreground truncate">
            {companyName}
          </h3>
        </div>
        {filled && (
          <span
            data-testid="company-manager-prefilled-badge"
            className={PREFILLED_BADGE_CLASSES}
          >
            Pre-filled
          </span>
        )}
      </div>

      {/* 회사 상세: 사업자번호 + 대표 */}
      <div className="flex flex-col gap-1 text-xs text-foreground/80">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">사업자번호</span>
          <span className="font-mono">{businessNumber}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">대표</span>
          <span>{ceoName}</span>
        </div>
      </div>

      {/* 담당자 정보 카드: 아바타 + 이름/부서/연락처/이메일 */}
      <div className="flex items-start gap-3 pt-2 border-t border-border/50">
        <div
          data-testid="company-manager-avatar"
          className={AVATAR_CLASSES}
        >
          <User
            aria-hidden="true"
            data-icon="user"
            className="h-5 w-5 text-foreground"
          />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground truncate">
              {managerName}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Briefcase
              aria-hidden="true"
              data-icon="briefcase"
              className="h-3 w-3 shrink-0"
            />
            <span className="truncate">{managerDepartment}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Phone
              aria-hidden="true"
              data-icon="phone"
              className="h-3 w-3 shrink-0"
            />
            <span className="font-mono truncate">{managerContact}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Mail
              aria-hidden="true"
              data-icon="mail"
              className="h-3 w-3 shrink-0"
            />
            <span className="truncate">{managerEmail}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
