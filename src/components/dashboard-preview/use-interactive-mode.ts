'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * DashboardPreview 의 렌더 모드.
 *
 * - `cinematic`: 기본 축소 시네마틱 자동 재생 (REQ-DASH-033)
 * - `interactive`: 사용자가 축소 뷰 내부를 클릭한 이후 Phase 2 상호작용 모드 (REQ-DASH-034)
 * - `static`: 접근성 정적 모드 (prefers-reduced-motion 등)
 */
export type PreviewMode = 'cinematic' | 'interactive' | 'static'

interface UseInteractiveModeOptions {
  /** Mobile / reduced-motion 환경에서는 false (REQ-DASH-045). */
  readonly enabled: boolean
  /** 비활동 타임아웃 (REQ-DASH-035). 기본 10000ms. */
  readonly inactivityTimeoutMs?: number
  /** 모드 전환 시 호출되는 콜백. */
  readonly onModeChange?: (mode: PreviewMode) => void
}

interface UseInteractiveModeReturn {
  readonly mode: PreviewMode
  readonly executedAreaIds: ReadonlySet<string>
  /**
   * 스크린리더 안내용 상태 메시지 (REQ-DASH-048).
   * `role="status" aria-live="polite"` 영역에 바인딩하여 모드 전환을 안내한다.
   * - 인터랙티브 진입: `데모 체험 모드를 시작했습니다`
   * - 인터랙티브 종료: `데모 체험 모드를 종료했습니다`
   * - 초기값 및 no-op 시: 빈 문자열
   */
  readonly statusMessage: string
  readonly enterInteractive: () => void
  readonly exitInteractive: () => void
  readonly registerActivity: () => void
  readonly executeArea: (id: string) => void
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_INACTIVITY_MS = 10_000

const STATUS_MESSAGES = {
  enter: '데모 체험 모드를 시작했습니다',
  exit: '데모 체험 모드를 종료했습니다',
} as const

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * 시네마틱 ↔ 인터랙티브 모드 전환 상태 훅.
 *
 * - REQ-DASH-033: 초기 `mode = 'cinematic'`
 * - REQ-DASH-034: `enterInteractive()` 호출로 인터랙티브 모드 진입
 * - REQ-DASH-035: 비활동 10초 경과 → 자동 cinematic 복귀
 * - REQ-DASH-051: Escape 키로 즉시 cinematic 복귀 (인터랙티브 모드 한정)
 * - REQ-DASH-045: `enabled=false` (Mobile / reduced-motion) 일 때 모든 전환 no-op
 */
export function useInteractiveMode({
  enabled,
  inactivityTimeoutMs = DEFAULT_INACTIVITY_MS,
  onModeChange,
}: UseInteractiveModeOptions): UseInteractiveModeReturn {
  const [mode, setMode] = useState<PreviewMode>('cinematic')
  const [executedAreaIds, setExecutedAreaIds] =
    useState<ReadonlySet<string>>(new Set())
  const [statusMessage, setStatusMessage] = useState<string>('')
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // -----------------------------------------------------------------------
  // Timer helpers
  // -----------------------------------------------------------------------

  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current !== null) {
      clearTimeout(inactivityTimerRef.current)
      inactivityTimerRef.current = null
    }
  }, [])

  // `modeRef`: setState updater 바깥에서 현재 mode를 안전하게 확인하기 위한 ref.
  // React 18 StrictMode 에서 updater 함수가 중복 실행될 수 있으므로, updater 내부에
  // side effect (setStatusMessage / onModeChange) 를 두면 여러 번 실행되거나 무효화될 수 있다.
  // updater 는 pure 하게 유지하고, side effect 는 ref 비교 후 updater 바깥에서 호출한다.
  const modeRef = useRef<PreviewMode>('cinematic')

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  const exitInteractive = useCallback(() => {
    clearInactivityTimer()
    const wasInteractive = modeRef.current === 'interactive'
    setMode((prev) => (prev === 'interactive' ? 'cinematic' : prev))
    setExecutedAreaIds(new Set())
    if (wasInteractive) {
      setStatusMessage(STATUS_MESSAGES.exit)
      onModeChange?.('cinematic')
    }
  }, [clearInactivityTimer, onModeChange])

  const startInactivityTimer = useCallback(() => {
    clearInactivityTimer()
    inactivityTimerRef.current = setTimeout(() => {
      exitInteractive()
    }, inactivityTimeoutMs)
  }, [clearInactivityTimer, exitInteractive, inactivityTimeoutMs])

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  const enterInteractive = useCallback(() => {
    if (!enabled) return
    const wasNotInteractive = modeRef.current !== 'interactive'
    setMode((prev) => (prev !== 'interactive' ? 'interactive' : prev))
    if (wasNotInteractive) {
      setStatusMessage(STATUS_MESSAGES.enter)
      onModeChange?.('interactive')
    }
    startInactivityTimer()
  }, [enabled, onModeChange, startInactivityTimer])

  const registerActivity = useCallback(() => {
    if (mode === 'interactive') {
      startInactivityTimer()
    }
  }, [mode, startInactivityTimer])

  const executeArea = useCallback(
    (id: string) => {
      if (!enabled) return
      if (mode !== 'interactive') return
      setExecutedAreaIds((prev) => {
        if (prev.has(id)) return prev
        const next = new Set(prev)
        next.add(id)
        return next
      })
      startInactivityTimer()
    },
    [enabled, mode, startInactivityTimer],
  )

  // -----------------------------------------------------------------------
  // Escape key listener (REQ-DASH-051)
  // -----------------------------------------------------------------------

  useEffect(() => {
    if (mode !== 'interactive') return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        exitInteractive()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mode, exitInteractive])

  // -----------------------------------------------------------------------
  // Cleanup on unmount
  // -----------------------------------------------------------------------

  useEffect(() => {
    return () => {
      clearInactivityTimer()
    }
  }, [clearInactivityTimer])

  return {
    mode,
    executedAreaIds,
    statusMessage,
    enterInteractive,
    exitInteractive,
    registerActivity,
    executeArea,
  }
}
