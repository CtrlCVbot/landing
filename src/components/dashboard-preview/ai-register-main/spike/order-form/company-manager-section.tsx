/**
 * @spike T-DASH3-SPIKE-01 — 종료 시 이관 or 폐기
 *
 * 원본: `.references/code/mm-broker/.../company-manager-section.tsx`
 *
 * Spike 범위:
 * - pre-filled 상태 표시만 (회사 조회 Popover/Badge/담당자 추가 버튼 전부 생략)
 * - decision-log §4-3 SSOT mock 값 정적 렌더링
 * - 4줄: 회사명 / 담당자 / 연락처 / 부서 (이메일은 보조 줄)
 * - AI_APPLY 영향 없음 (조작감 훅 미연결)
 *
 * Tablet scale 0.40 가독성 고려 — base text-sm + department text-xs.
 */

'use client'

import type { CompanyData, ManagerData } from '@/lib/mock-data-spike'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface CompanyManagerSectionSpikeProps {
  readonly company: CompanyData
  readonly manager: ManagerData
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CompanyManagerSectionSpike({
  company,
  manager,
}: CompanyManagerSectionSpikeProps) {
  return (
    <div className="p-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
      {/* 헤더 — 회사명 + Pre-filled 배지 */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            aria-hidden="true"
            className="flex-shrink-0 inline-flex h-5 w-5 items-center justify-center rounded-md bg-accent/10 text-accent text-[10px] font-bold border border-accent/20"
          >
            ■
          </span>
          <h3 className="text-lg font-bold text-white truncate">
            {company.name}
            <span className="ml-1 text-red-400">*</span>
          </h3>
        </div>
        <span className="flex-shrink-0 text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20 uppercase tracking-wider">
          Pre-filled
        </span>
      </div>

      {/* 사업자 번호 */}
      <div className="mt-1 text-xs text-gray-500 tabular-nums">
        사업자 {company.businessNumber}
      </div>

      {/* 담당자 섹션 구분선 + 정보 */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="flex-shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-600/80 to-blue-600/80 text-white text-sm font-semibold shadow-sm"
          >
            이
          </span>
          <div className="flex-1 min-w-0 space-y-1.5">
            {/* 이름 + 부서 */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-semibold text-gray-200">
                {manager.name}
              </span>
              <span className="text-[11px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                {manager.department}
              </span>
            </div>

            {/* 연락처 + 이메일 */}
            <div className="flex flex-col gap-1 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="text-accent/70">☎</span>
                <span className="tabular-nums">{manager.contact}</span>
              </span>
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="text-accent/70">✉</span>
                <span className="truncate">{manager.email}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
