/**
 * T-DASH3-M1-04 + T-DASH3-M1-09 — DashboardPreview Phase 3 Feature flag + Mobile 분기 통합 테스트
 *
 * TC
 *  - TC-DASH3-INT-FLAG: env / query 기반 AiRegisterMain 렌더 분기 (M1-04)
 *  - TC-DASH3-INT-MOBILE-FALLBACK: Mobile 뷰포트에서 flag 무관하게 MobileCardView 렌더 (M1-09, Spike 발굴)
 *
 * REQ
 *  - REQ-DASH3-052, 053 (Phase 3 활성화 조건)
 *  - REQ-DASH-023, 024 (Tablet scale 0.40, Mobile MobileCardView)
 *  - REQ-DASH3-062 (Mobile 에서 ai-register-main 청크 로드 0건 — dynamic import + ssr:false)
 *
 * 범위
 *  - Flag OFF (기본): 기존 Phase 1/2 AiPanelPreview + FormPreview 렌더
 *  - Flag ON (env NEXT_PUBLIC_DASH_V3=phase3): AiRegisterMain 렌더
 *  - Flag ON (query ?dashV3=1): AiRegisterMain 렌더
 *  - 두 렌더 경로 상호 배타
 *  - Tablet 뷰포트 scale 0.40 (REQ-DASH-023)
 *  - Mobile 뷰포트: flag 상태와 무관하게 MobileCardView 렌더 (AiRegisterMain 미 렌더)
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'

import {
  DashboardPreview,
  shouldRotatePreviewScenario,
} from '@/components/dashboard-preview/dashboard-preview'
import { DESKTOP_HIT_AREAS } from '@/components/dashboard-preview/hit-areas'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      className,
      'aria-label': ariaLabel,
      onMouseEnter,
      onMouseLeave,
      onClick,
      ..._rest
    }: React.HTMLAttributes<HTMLDivElement>) => (
      <div
        className={className}
        aria-label={ariaLabel}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

// T-DASH3-M1-09: `next/dynamic` 을 동기 컴포넌트 stub 으로 치환.
// - `./ai-register-main` 을 미리 `vi.mock` 으로 동기 치환하여 loader Promise 가 resolved 된
//   microtask 에서 cache 를 채운다. 첫 render 전에 loader 가 resolve 되므로 초기 렌더부터
//   stub 이 실제 AiRegisterMain 을 렌더링한다.
// - 실제 dynamic + ssr:false 옵션 자체는 소스 코드 레벨에서 `Dynamic import 청크 로드 회피`
//   describe 블록이 별도로 검증한다.
type DynamicLoader = () => Promise<{ default: React.ComponentType<unknown> }>
vi.mock('next/dynamic', () => {
  const cache = new WeakMap<DynamicLoader, React.ComponentType<unknown>>()
  return {
    default: (loader: DynamicLoader) => {
      loader().then((mod) => {
        cache.set(loader, mod.default)
      })
      const DynamicStub = (props: Record<string, unknown>) => {
        const Component = cache.get(loader)
        if (!Component) return null
        return <Component {...props} />
      }
      DynamicStub.displayName = 'DynamicStub'
      return DynamicStub
    },
  }
})

// T-DASH3-M1-09: AiRegisterMain 을 동기 stub 으로 치환하여 dynamic 로더의
// import() Promise 가 즉시 resolved 되도록 한다. 실제 AiRegisterMain 컴포넌트는
// 별도 단위 테스트에서 검증되므로, 여기서는 landmark aria-label 만 노출한다.
vi.mock('@/components/dashboard-preview/ai-register-main', () => ({
  AiRegisterMain: () => (
    <div className="flex h-full min-h-[480px]">
      <aside aria-label="AI 화물 등록 패널" data-testid="mock-ai-panel-container" />
      <div aria-label="주문 등록 폼" data-testid="mock-order-form-grid" />
    </div>
  ),
}))

let mediaQueryResults: Record<string, boolean> = {}
vi.mock('@/hooks/use-media-query', () => ({
  useMediaQuery: (query: string) => mediaQueryResults[query] ?? false,
}))

vi.mock('@/components/dashboard-preview/mobile-card-view', () => ({
  MobileCardView: ({ className }: { className?: string }) => (
    <div data-testid="mobile-card-view" className={className}>
      MobileCardView
    </div>
  ),
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function setDesktop() {
  mediaQueryResults = {
    '(prefers-reduced-motion: reduce)': false,
    '(max-width: 767px)': false,
    '(min-width: 768px) and (max-width: 1023px)': false,
  }
}

function setTablet() {
  mediaQueryResults = {
    '(prefers-reduced-motion: reduce)': false,
    '(max-width: 767px)': false,
    '(min-width: 768px) and (max-width: 1023px)': true,
  }
}

function setMobile() {
  mediaQueryResults = {
    '(prefers-reduced-motion: reduce)': false,
    '(max-width: 767px)': true,
    '(min-width: 768px) and (max-width: 1023px)': false,
  }
}

const ORIGINAL_HREF = window.location.href

function setQuery(search: string) {
  const url = new URL(ORIGINAL_HREF)
  url.search = search
  window.history.replaceState({}, '', url.toString())
}

function resetQuery() {
  window.history.replaceState({}, '', ORIGINAL_HREF)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DashboardPreview — Phase 3 Feature flag', () => {
  beforeEach(() => {
    setDesktop()
  })

  afterEach(() => {
    resetQuery()
    vi.unstubAllEnvs()
  })

  describe('TC-DASH3-INT-FLAG: default ON (M5 closeout)', () => {
    it('renders AiRegisterMain regions by default (Phase 3 default ON)', () => {
      render(<DashboardPreview />)
      expect(screen.getByLabelText('AI 화물 등록 패널')).toBeInTheDocument()
      expect(screen.getByLabelText('주문 등록 폼')).toBeInTheDocument()
    })

    it('does NOT render Phase 1/2 components by default', () => {
      render(<DashboardPreview />)
      expect(screen.queryByTestId('ai-panel')).not.toBeInTheDocument()
      expect(screen.queryByTestId('form-preview')).not.toBeInTheDocument()
    })
  })

  describe('preview scenario rotation helper', () => {
    it('rotates only when the preview wraps from the last step back to Step 1', () => {
      expect(shouldRotatePreviewScenario(3, 0, 4)).toBe(true)
      expect(shouldRotatePreviewScenario(2, 3, 4)).toBe(false)
      expect(shouldRotatePreviewScenario(0, 1, 4)).toBe(false)
      expect(shouldRotatePreviewScenario(3, 2, 4)).toBe(false)
    })
  })

  describe('TC-DASH3-INT-FLAG: env=phase3 (명시적 opt-in, default 와 동일)', () => {
    it('env=phase3: renders AiRegisterMain (2-col shell regions)', () => {
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'phase3')
      render(<DashboardPreview />)
      expect(screen.getByLabelText('AI 화물 등록 패널')).toBeInTheDocument()
      expect(screen.getByLabelText('주문 등록 폼')).toBeInTheDocument()
    })

    it('env=something-unknown: default ON 유지 (알 수 없는 값은 무시)', () => {
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'something-unknown')
      render(<DashboardPreview />)
      expect(screen.getByLabelText('AI 화물 등록 패널')).toBeInTheDocument()
      expect(screen.queryByTestId('ai-panel')).not.toBeInTheDocument()
    })
  })

  describe('TC-DASH3-INT-FLAG: env 기반 opt-out (Phase 1/2 fallback)', () => {
    it.each(['legacy', 'phase1', 'phase2', 'off', '0'])(
      'env="%s": Phase 1/2 렌더 (AiPanelPreview + FormPreview)',
      (value) => {
        vi.stubEnv('NEXT_PUBLIC_DASH_V3', value)
        render(<DashboardPreview />)
        expect(screen.getByTestId('ai-panel')).toBeInTheDocument()
        expect(screen.getByTestId('form-preview')).toBeInTheDocument()
        expect(screen.queryByLabelText('AI 화물 등록 패널')).not.toBeInTheDocument()
      },
    )
  })

  describe('TC-DASH3-INT-FLAG: query 기반 세션 opt-in/out', () => {
    it('query=1: renders AiRegisterMain (세션 opt-in)', () => {
      setQuery('?dashV3=1')
      render(<DashboardPreview />)
      expect(screen.getByLabelText('AI 화물 등록 패널')).toBeInTheDocument()
    })

    it('query=0: Phase 1/2 fallback (세션 opt-out)', () => {
      setQuery('?dashV3=0')
      render(<DashboardPreview />)
      expect(screen.getByTestId('ai-panel')).toBeInTheDocument()
      expect(screen.queryByLabelText('AI 화물 등록 패널')).not.toBeInTheDocument()
    })

    it('query=1 이 env=legacy 를 덮어쓴다 (query 우선)', () => {
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'legacy')
      setQuery('?dashV3=1')
      render(<DashboardPreview />)
      expect(screen.getByLabelText('AI 화물 등록 패널')).toBeInTheDocument()
    })
  })

  describe('TC-DASH3-INT-FLAG: exclusive rendering', () => {
    it('default ON: Phase 1/2 and AiRegisterMain do not coexist', () => {
      render(<DashboardPreview />)

      const ariaPanel = screen.queryByLabelText('AI 화물 등록 패널')
      const legacyPanel = screen.queryByTestId('ai-panel')
      // Exactly one of them is present
      expect(Boolean(ariaPanel) !== Boolean(legacyPanel)).toBe(true)
      expect(ariaPanel).toBeInTheDocument()
      expect(legacyPanel).not.toBeInTheDocument()
    })
  })

  describe('REQ-DASH-023/024: Tablet scaleFactor 0.40', () => {
    it('tablet uses scaleFactor 0.40 in Phase 1/2 path', () => {
      setTablet()
      render(<DashboardPreview />)
      const scaledInner = screen.getByTestId('scaled-content-inner')
      expect(scaledInner.style.transform).toBe('scale(0.4)')
    })

    it('desktop keeps scaleFactor 0.45', () => {
      setDesktop()
      render(<DashboardPreview />)
      const scaledInner = screen.getByTestId('scaled-content-inner')
      expect(scaledInner.style.transform).toBe('scale(0.45)')
    })

    it('mobile renders MobileCardView (no PreviewChrome)', () => {
      setMobile()
      render(<DashboardPreview />)
      expect(screen.getByTestId('mobile-card-view')).toBeInTheDocument()
      expect(screen.queryByTestId('preview-chrome')).not.toBeInTheDocument()
    })

    it('tablet with Phase 3 flag ON: scaleFactor still 0.40', () => {
      setTablet()
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'phase3')
      render(<DashboardPreview />)
      const scaledInner = screen.getByTestId('scaled-content-inner')
      expect(scaledInner.style.transform).toBe('scale(0.4)')
    })
  })

  describe('F4 overlay anchor', () => {
    it('interactive overlay is anchored inside scaled content and uses unscaled bounds', () => {
      setDesktop()
      render(<DashboardPreview />)

      fireEvent.click(
        screen.getByLabelText('AI 화물 등록 워크플로우 데모 미리보기'),
      )

      const scaledInner = screen.getByTestId('scaled-content-inner')
      const overlay = screen.getByTestId('interactive-overlay')
      const aiInput = DESKTOP_HIT_AREAS.find((area) => area.id === 'ai-input')!

      expect(scaledInner).toContainElement(overlay)
      expect(screen.getByTestId('hit-area-ai-input').style.left).toBe(
        `${aiInput.bounds.x}px`,
      )
      expect(screen.getByTestId('hit-area-ai-input').style.top).toBe(
        `${aiInput.bounds.y}px`,
      )
    })
  })

  // -------------------------------------------------------------------------
  // T-DASH3-M1-09: Mobile 뷰포트 분기 (Spike 발굴 이슈 해소)
  //
  // 배경
  //  - Spike 실측에서 Mobile(<768px) 뷰포트에서도 DashboardPreviewSpike/AiRegisterMain
  //    이 렌더링되는 이슈 확인. REQ-DASH3-062 "Mobile 에서 ai-register-main 청크 로드 0건"
  //    조건을 충족하기 위해 flag 상태와 무관하게 Mobile 은 MobileCardView 경로를
  //    강제한다.
  //  - 청크 로드 회피는 `next/dynamic` + `ssr:false` 로 구현하며, jsdom 환경에서
  //    실제 chunk 네트워크 요청 검증은 불가능하므로 render 결과(AiRegisterMain landmark
  //    부재 + MobileCardView 렌더) 로만 정성 검증한다. 실제 청크 0건 검증은
  //    TC-DASH3-PERF-MOBILE (DevTools Network) 에서 수행.
  // -------------------------------------------------------------------------
  describe('TC-DASH3-INT-MOBILE-FALLBACK: Mobile 뷰포트 분기', () => {
    it('useDashV3=true (env phase3) + Mobile → MobileCardView 렌더 (AiRegisterMain 아님)', () => {
      setMobile()
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'phase3')
      render(<DashboardPreview />)

      expect(screen.getByTestId('mobile-card-view')).toBeInTheDocument()
      // Phase 3 의 AiRegisterMain landmark 는 렌더되지 않아야 함 (청크 로드 회피 목적)
      expect(screen.queryByLabelText('AI 화물 등록 패널')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('주문 등록 폼')).not.toBeInTheDocument()
      // Chrome 과 Phase 1/2 레거시도 렌더되지 않아야 함
      expect(screen.queryByTestId('preview-chrome')).not.toBeInTheDocument()
      expect(screen.queryByTestId('ai-panel')).not.toBeInTheDocument()
      expect(screen.queryByTestId('form-preview')).not.toBeInTheDocument()
    })

    it('useDashV3=true (query ?dashV3=1) + Mobile → MobileCardView 렌더', () => {
      setMobile()
      setQuery('?dashV3=1')
      render(<DashboardPreview />)

      expect(screen.getByTestId('mobile-card-view')).toBeInTheDocument()
      expect(screen.queryByLabelText('AI 화물 등록 패널')).not.toBeInTheDocument()
    })

    it('useDashV3=false + Mobile → MobileCardView 렌더 (기존 Phase 1/2 동작 유지)', () => {
      setMobile()
      render(<DashboardPreview />)

      expect(screen.getByTestId('mobile-card-view')).toBeInTheDocument()
      // Phase 1/2 의 AiPanelPreview / FormPreview 도 Mobile 에서는 렌더 안 됨 (기존 동작 유지)
      expect(screen.queryByTestId('ai-panel')).not.toBeInTheDocument()
      expect(screen.queryByTestId('form-preview')).not.toBeInTheDocument()
      expect(screen.queryByTestId('preview-chrome')).not.toBeInTheDocument()
    })

    it('useDashV3=true + Desktop → AiRegisterMain 렌더 (Mobile 분기 미적용)', () => {
      setDesktop()
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'phase3')
      render(<DashboardPreview />)

      expect(screen.getByLabelText('AI 화물 등록 패널')).toBeInTheDocument()
      expect(screen.getByLabelText('주문 등록 폼')).toBeInTheDocument()
      expect(screen.queryByTestId('mobile-card-view')).not.toBeInTheDocument()
    })

    it('useDashV3=true + Tablet → AiRegisterMain 렌더 (Mobile 분기 미적용)', () => {
      setTablet()
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'phase3')
      render(<DashboardPreview />)

      expect(screen.getByLabelText('AI 화물 등록 패널')).toBeInTheDocument()
      expect(screen.getByLabelText('주문 등록 폼')).toBeInTheDocument()
      expect(screen.queryByTestId('mobile-card-view')).not.toBeInTheDocument()
    })

    it('useDashV3=false + Desktop → 기존 Phase 1/2 렌더 (Mobile 분기 미적용)', () => {
      // M5 closeout: default 가 Phase 3 로 승격되었으므로 legacy 경로를 명시적으로 opt-out.
      vi.stubEnv('NEXT_PUBLIC_DASH_V3', 'legacy')
      setDesktop()
      render(<DashboardPreview />)

      expect(screen.getByTestId('ai-panel')).toBeInTheDocument()
      expect(screen.getByTestId('form-preview')).toBeInTheDocument()
      expect(screen.queryByTestId('mobile-card-view')).not.toBeInTheDocument()
    })

    // REQ-DASH3-062: Mobile 에서 ai-register-main 청크 네트워크 요청 0건.
    // jsdom 환경에서 실제 chunk 로딩 검증은 불가능하므로, 소스 코드 레벨에서
    // `next/dynamic` + `ssr: false` 옵션으로 AiRegisterMain 이 래핑되어 있는지
    // 정성 검증한다. 실 네트워크 검증은 TC-DASH3-PERF-MOBILE (DevTools Network).
    describe('Dynamic import 청크 로드 회피 (REQ-DASH3-062)', () => {
      const SOURCE_PATH = path.resolve(
        __dirname,
        '..',
        'dashboard-preview.tsx',
      )
      const source = readFileSync(SOURCE_PATH, 'utf-8')

      it('dashboard-preview.tsx 가 next/dynamic 을 import 한다', () => {
        expect(source).toMatch(/from\s+['"]next\/dynamic['"]/)
      })

      it('AiRegisterMain 이 dynamic() 으로 래핑되어 있다', () => {
        expect(source).toMatch(/const\s+AiRegisterMain\s*=\s*dynamic\(/)
      })

      it('dynamic import 옵션에 ssr: false 가 설정되어 있다', () => {
        // `dynamic(...)` 호출의 두 번째 인자에 `ssr: false` 포함 여부 확인.
        expect(source).toMatch(/ssr:\s*false/)
      })

      it('AiRegisterMain 을 static import 하지 않는다', () => {
        // static import 는 빌드 타임에 청크가 합쳐지므로, Mobile 에서도 로드됨.
        // `next/dynamic` 으로만 참조해야 함.
        expect(source).not.toMatch(
          /import\s+\{[^}]*AiRegisterMain[^}]*\}\s+from\s+['"]\.\/ai-register-main['"]/,
        )
      })
    })
  })
})
