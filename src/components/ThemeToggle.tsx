'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  readonly className?: string
}

/**
 * F1 T-THEME-04 — 테마 전환 버튼 (Sun/Moon 토글).
 *
 * REQ-007: mounted state 방어 (SSR hydration mismatch 방지, Decision 3 3 중 방어).
 * REQ-008: navbar 우측 상단 배치 (sticky 노출, 5 뷰포트 가시).
 * REQ-009: lucide-react Sun/Moon 24×24 (Non-Duplication, 별도 SVG 금지).
 *
 * 구현 메모:
 * - `resolvedTheme` 사용 — `theme` 은 사용자 선택값('system'|'light'|'dark'),
 *   `resolvedTheme` 은 system 인 경우 실제 활성 테마(light|dark) 를 반환.
 *   아이콘 표시는 실제 색상 상태에 기반해야 하므로 `resolvedTheme` 이 정답.
 * - 현재 dark → Sun 아이콘(light 로 전환 의도 표시),
 *   현재 light → Moon 아이콘(dark 로 전환 의도 표시).
 * - w-10 h-10 (40×40) — 터치 타겟 접근성 (WCAG 2.5.5 AAA 권장 44×44 근사).
 * - mounted 전에는 w-10 h-10 placeholder 로 레이아웃 시프트 0.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // SSR + 초기 mount 동안 placeholder (REQ-007, D-003 3 중 방어)
  if (!mounted) {
    return <div className={cn('w-10 h-10', className)} aria-hidden />
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      aria-label="테마 전환"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'inline-flex items-center justify-center w-10 h-10 rounded-md',
        'text-foreground hover:bg-accent/10',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'transition-colors',
        className,
      )}
    >
      {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
    </button>
  )
}
