import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * F1 라이트 모드 전환 인프라 — T-THEME-01 (PR-1 핵심 게이트)
 *
 * REQ-001: `@theme inline` 블록이 13개 색상 직접값을 `var(--landing-*)` 로 간접화
 * REQ-002: `:root` 라이트 팔레트 13개 정의 + WCAG AA 4.5:1 대비 충족
 * REQ-003: `[data-theme="dark"]` 다크 팔레트 13개 정의 + 기존 다크 값 동등 이관
 *
 * 검증 전략:
 *   jsdom 은 실제 CSS 파싱을 수행하지 않으므로 @testing-library 기반 런타임 토글 대신
 *   파일 내용을 직접 읽어 구조 계약을 검증한다. WCAG 대비비는 상수 색상값으로 결정론적 계산.
 *   jest-axe 런타임 검증은 PR-2~6 의 섹션 단위 테스트에서 수행 (Feature Package SM-10).
 *
 * 후속 TASK 주의 (T-THEME-02/03 이후 런타임 DOM 토글 검증 추가 시):
 *   document.documentElement 의 data-theme 을 조작하는 테스트가 추가되면
 *   아래 격리 훅을 최상단 describe 에 삽입해 상태 오염을 방지한다.
 *     beforeEach(() => { document.documentElement.removeAttribute('data-theme') })
 *     afterEach(()  => { document.documentElement.removeAttribute('data-theme') })
 */

const CSS_PATH = resolve(__dirname, '../app/globals.css')
const CSS = readFileSync(CSS_PATH, 'utf8')

// 이중화 대상 13개 직접값 색상 토큰 (설계 SSOT — 06-architecture-binding.md §2-2)
const DUAL_TOKENS = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'border',
  'muted',
  'muted-foreground',
  'accent-start',
  'accent-end',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
] as const

// WCAG 2.1 — relative luminance 계산 (sRGB)
function srgbToLinear(v: number): number {
  const s = v / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

function relativeLuminance(hex: string): number {
  const m = hex.replace('#', '').match(/^([0-9a-fA-F]{6})$/)
  if (!m) throw new Error(`Invalid hex: ${hex}`)
  const r = parseInt(m[1].slice(0, 2), 16)
  const g = parseInt(m[1].slice(2, 4), 16)
  const b = parseInt(m[1].slice(4, 6), 16)
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
}

function contrastRatio(hexA: string, hexB: string): number {
  const la = relativeLuminance(hexA)
  const lb = relativeLuminance(hexB)
  const [lighter, darker] = la > lb ? [la, lb] : [lb, la]
  return (lighter + 0.05) / (darker + 0.05)
}

describe('F1 globals.css 토큰 이중화 (T-THEME-01, PR-1)', () => {
  // ----- REQ-001: @theme inline 블록 구조 ----------------------------------

  describe('REQ-001 — @theme inline 이중화', () => {
    it('@theme inline 블록이 존재한다', () => {
      expect(CSS).toMatch(/@theme\s+inline\s*\{/)
    })

    it.each(DUAL_TOKENS)(
      '--color-%s 가 var(--landing-*) 로 간접 참조된다',
      (token) => {
        const re = new RegExp(
          `--color-${token.replace(/-/g, '\\-')}\\s*:\\s*var\\(--landing-${token.replace(/-/g, '\\-')}\\)`,
        )
        expect(CSS).toMatch(re)
      },
    )

    it('@theme inline 블록 내부에 13개의 var(--landing-*) 간접화가 존재한다', () => {
      const themeMatch = CSS.match(/@theme\s+inline\s*\{([\s\S]*?)\r?\n\}/)
      expect(themeMatch).not.toBeNull()
      const themeBody = themeMatch![1]
      const matches = themeBody.match(/var\(--landing-[a-z-]+\)/g) || []
      // 13 개 직접값 이중화 (shadcn alias 는 기존 var(--color-*) 참조 유지)
      expect(matches.length).toBeGreaterThanOrEqual(13)
    })

    it('radius/font 변수는 직접값을 유지한다 (색상 아님 — 이중화 대상 아님)', () => {
      expect(CSS).toMatch(/--radius-lg:\s*0\.5rem/)
      expect(CSS).toMatch(/--radius-xl:\s*0\.75rem/)
      expect(CSS).toMatch(/--radius-2xl:\s*1rem/)
      expect(CSS).toMatch(/--font-sans:\s*'Inter'/)
    })

    it('shadcn alias 7개는 기존 var(--color-*) 참조를 유지한다', () => {
      expect(CSS).toMatch(/--color-primary:\s*var\(--color-accent\)/)
      expect(CSS).toMatch(/--color-primary-foreground:\s*var\(--color-accent-foreground\)/)
      expect(CSS).toMatch(/--color-secondary:\s*var\(--color-muted\)/)
      expect(CSS).toMatch(/--color-secondary-foreground:\s*var\(--color-foreground\)/)
      expect(CSS).toMatch(/--color-accent-foreground-shadcn:\s*var\(--color-foreground\)/)
      expect(CSS).toMatch(/--color-input:\s*var\(--color-border\)/)
      expect(CSS).toMatch(/--color-ring:\s*var\(--color-accent\)/)
    })
  })

  // ----- REQ-002: :root 라이트 팔레트 ---------------------------------------

  describe('REQ-002 — :root 라이트 팔레트 + WCAG AA', () => {
    it(':root 블록이 존재한다', () => {
      expect(CSS).toMatch(/:root\s*\{/)
    })

    it.each(DUAL_TOKENS)(':root 에 --landing-%s 가 정의된다', (token) => {
      const rootMatch = CSS.match(/:root\s*\{([\s\S]*?)\r?\n\}/)
      expect(rootMatch).not.toBeNull()
      const rootBody = rootMatch![1]
      const re = new RegExp(`--landing-${token.replace(/-/g, '\\-')}\\s*:`)
      expect(rootBody).toMatch(re)
    })

    // WCAG 2.1 AA 대비비 검증 — 설계서 지정 색상값에 대한 상수 계산
    // 이 값들은 globals.css :root 의 실제 값과 일치해야 한다.
    it('foreground #0a0a0a on background #ffffff 이 4.5:1 이상', () => {
      expect(contrastRatio('#0a0a0a', '#ffffff')).toBeGreaterThanOrEqual(4.5)
    })

    it('muted-foreground #4b5563 on background #ffffff 이 4.5:1 이상', () => {
      expect(contrastRatio('#4b5563', '#ffffff')).toBeGreaterThanOrEqual(4.5)
    })

    it('accent-foreground #ffffff on accent #7c3aed 이 4.5:1 이상', () => {
      expect(contrastRatio('#ffffff', '#7c3aed')).toBeGreaterThanOrEqual(4.5)
    })

    it('destructive-foreground #ffffff on destructive #dc2626 이 4.5:1 이상', () => {
      expect(contrastRatio('#ffffff', '#dc2626')).toBeGreaterThanOrEqual(4.5)
    })

    it('card-foreground #1f2937 on background #ffffff 이 4.5:1 이상', () => {
      expect(contrastRatio('#1f2937', '#ffffff')).toBeGreaterThanOrEqual(4.5)
    })

    it(':root 의 실제 팔레트 값이 WCAG AA 검증 상수와 일치한다', () => {
      const rootMatch = CSS.match(/:root\s*\{([\s\S]*?)\r?\n\}/)
      expect(rootMatch).not.toBeNull()
      const rootBody = rootMatch![1]
      expect(rootBody).toMatch(/--landing-background:\s*#ffffff/)
      expect(rootBody).toMatch(/--landing-foreground:\s*#0a0a0a/)
      expect(rootBody).toMatch(/--landing-muted-foreground:\s*#4b5563/)
      expect(rootBody).toMatch(/--landing-accent:\s*#7c3aed/)
      expect(rootBody).toMatch(/--landing-accent-foreground:\s*#ffffff/)
      expect(rootBody).toMatch(/--landing-destructive:\s*#dc2626/)
      expect(rootBody).toMatch(/--landing-destructive-foreground:\s*#ffffff/)
      expect(rootBody).toMatch(/--landing-card-foreground:\s*#1f2937/)
    })
  })

  // ----- REQ-003: [data-theme="dark"] 다크 팔레트 --------------------------

  describe('REQ-003 — [data-theme="dark"] 다크 팔레트 이관', () => {
    it('[data-theme="dark"] 블록이 존재한다', () => {
      expect(CSS).toMatch(/\[data-theme="dark"\]\s*\{/)
    })

    it.each(DUAL_TOKENS)(
      '[data-theme="dark"] 에 --landing-%s 가 정의된다',
      (token) => {
        const darkMatch = CSS.match(/\[data-theme="dark"\]\s*\{([\s\S]*?)\r?\n\}/)
        expect(darkMatch).not.toBeNull()
        const darkBody = darkMatch![1]
        const re = new RegExp(`--landing-${token.replace(/-/g, '\\-')}\\s*:`)
        expect(darkBody).toMatch(re)
      },
    )

    it('다크 팔레트가 기존 @theme inline 직접값과 동등하게 이관된다', () => {
      const darkMatch = CSS.match(/\[data-theme="dark"\]\s*\{([\s\S]*?)\r?\n\}/)
      expect(darkMatch).not.toBeNull()
      const darkBody = darkMatch![1]
      // 기존 globals.css 의 원본 직접값 (Line 10-20, 35-36)
      expect(darkBody).toMatch(/--landing-background:\s*#0a0a0a/)
      expect(darkBody).toMatch(/--landing-foreground:\s*#ffffff/)
      expect(darkBody).toMatch(/--landing-card:\s*oklch\(0\.15 0\.01 260 \/ 0\.5\)/)
      expect(darkBody).toMatch(/--landing-card-foreground:\s*#e5e7eb/)
      expect(darkBody).toMatch(/--landing-border:\s*#1f2937/)
      expect(darkBody).toMatch(/--landing-muted:\s*#374151/)
      expect(darkBody).toMatch(/--landing-muted-foreground:\s*#9ca3af/)
      expect(darkBody).toMatch(/--landing-accent-start:\s*#9333ea/)
      expect(darkBody).toMatch(/--landing-accent-end:\s*#3b82f6/)
      expect(darkBody).toMatch(/--landing-accent:\s*#8b5cf6/)
      expect(darkBody).toMatch(/--landing-accent-foreground:\s*#ffffff/)
      expect(darkBody).toMatch(/--landing-destructive:\s*#ef4444/)
      expect(darkBody).toMatch(/--landing-destructive-foreground:\s*#ffffff/)
    })
  })

  // ----- NFR-006: @layer base + prefers-reduced-motion 보존 -----------------

  describe('NFR-006 — @layer base 불변 보존', () => {
    it('@layer base 블록이 유지된다', () => {
      expect(CSS).toMatch(/@layer\s+base\s*\{/)
    })

    it('body { background-color: var(--color-background) } 스타일이 유지된다', () => {
      expect(CSS).toMatch(/background-color:\s*var\(--color-background\)/)
      expect(CSS).toMatch(/color:\s*var\(--color-foreground\)/)
    })

    it('prefers-reduced-motion 미디어쿼리가 유지된다 (T-DASH3-M5-06)', () => {
      expect(CSS).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/)
      expect(CSS).toMatch(/animation-duration:\s*0\.01ms\s*!important/)
      expect(CSS).toMatch(/transition-duration:\s*0\.01ms\s*!important/)
    })

    it('::selection 스타일이 유지된다', () => {
      expect(CSS).toMatch(/::selection\s*\{/)
    })
  })
})

// ============================================================================
// T-THEME-02 — layout.tsx ThemeProvider 주입 + next-themes dependency
// ============================================================================

describe('F1 layout.tsx ThemeProvider 주입 (T-THEME-02, PR-1)', () => {
  const LAYOUT_PATH = resolve(__dirname, '../app/layout.tsx')
  const LAYOUT_SRC = readFileSync(LAYOUT_PATH, 'utf8')

  const PROVIDER_PATH = resolve(__dirname, '../components/providers/theme-provider.tsx')
  let PROVIDER_SRC = ''
  try {
    PROVIDER_SRC = readFileSync(PROVIDER_PATH, 'utf8')
  } catch {
    PROVIDER_SRC = ''
  }

  describe('REQ-006 — <html> suppressHydrationWarning', () => {
    it('<html> 태그에 suppressHydrationWarning 속성이 있다', () => {
      expect(LAYOUT_SRC).toMatch(/<html[^>]*suppressHydrationWarning/)
    })
  })

  describe('REQ-005 — ThemeProvider 주입', () => {
    it('ThemeProvider wrapper가 providers 디렉터리에 존재한다', () => {
      expect(PROVIDER_SRC.length).toBeGreaterThan(0)
      expect(PROVIDER_SRC).toMatch(/^['"]use client['"]/m)
      expect(PROVIDER_SRC).toMatch(/next-themes/)
      expect(PROVIDER_SRC).toMatch(/export\s+function\s+ThemeProvider/)
    })

    it('layout.tsx가 ThemeProvider를 import한다', () => {
      expect(LAYOUT_SRC).toMatch(/import\s*\{\s*ThemeProvider\s*\}\s*from\s*['"]@\/components\/providers\/theme-provider['"]/)
    })

    it('ThemeProvider가 MotionProvider를 감싼다 (Provider 순서: Theme 바깥, Motion 안쪽)', () => {
      const themeIdx = LAYOUT_SRC.indexOf('<ThemeProvider')
      const motionIdx = LAYOUT_SRC.indexOf('<MotionProvider')
      expect(themeIdx).toBeGreaterThan(-1)
      expect(motionIdx).toBeGreaterThan(-1)
      expect(themeIdx).toBeLessThan(motionIdx)
    })

    it('ThemeProvider 4 속성 모두 명시 (attribute/defaultTheme/enableSystem/disableTransitionOnChange)', () => {
      expect(LAYOUT_SRC).toMatch(/attribute=["']data-theme["']/)
      expect(LAYOUT_SRC).toMatch(/defaultTheme=["']system["']/)
      expect(LAYOUT_SRC).toMatch(/enableSystem(\s|\/|>)/)
      expect(LAYOUT_SRC).toMatch(/disableTransitionOnChange(\s|\/|>)/)
    })
  })

  describe('REQ-004 — next-themes dependency', () => {
    it('package.json에 next-themes ^0.3.0 이 추가되어 있다', () => {
      const pkgPath = resolve(__dirname, '../../package.json')
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
      const deps = { ...pkg.dependencies, ...pkg.devDependencies }
      expect(deps['next-themes']).toBeDefined()
      expect(deps['next-themes']).toMatch(/^\^?0\.[3-9]/)
    })
  })
})

// ============================================================================
// T-THEME-04 — ThemeToggle + Navbar (PR-2)
// ============================================================================

describe('F1 ThemeToggle + Navbar (T-THEME-04, PR-2)', () => {
  const TOGGLE_PATH = resolve(__dirname, '../components/ThemeToggle.tsx')
  const HEADER_PATH = resolve(__dirname, '../components/sections/header.tsx')

  let TOGGLE_SRC = ''
  try {
    TOGGLE_SRC = readFileSync(TOGGLE_PATH, 'utf8')
  } catch {
    TOGGLE_SRC = ''
  }
  const HEADER_SRC = readFileSync(HEADER_PATH, 'utf8')

  describe('REQ-007 — ThemeToggle 컴포넌트 구조', () => {
    it('파일이 존재한다', () => {
      expect(TOGGLE_SRC.length).toBeGreaterThan(0)
    })
    it("'use client' 지시자가 있다", () => {
      expect(TOGGLE_SRC).toMatch(/^['"]use client['"]/m)
    })
    it('next-themes useTheme hook 을 사용한다', () => {
      expect(TOGGLE_SRC).toMatch(/from\s+['"]next-themes['"]/)
      expect(TOGGLE_SRC).toMatch(/useTheme\s*\(\s*\)/)
    })
    it('mounted state 방어 (useState + useEffect + setMounted)', () => {
      expect(TOGGLE_SRC).toMatch(/useState\s*\(\s*false\s*\)|mounted\s*=\s*false/)
      expect(TOGGLE_SRC).toMatch(/useEffect.*setMounted\s*\(\s*true\s*\)/s)
    })
    it('aria-label="테마 전환" 이 있다', () => {
      expect(TOGGLE_SRC).toMatch(/aria-label=['"]테마 전환['"]/)
    })
    it('focus-visible ring 클래스가 있다', () => {
      expect(TOGGLE_SRC).toMatch(/focus-visible:ring/)
    })
    it('ThemeToggle 이 named export 로 제공된다', () => {
      expect(TOGGLE_SRC).toMatch(/export\s+function\s+ThemeToggle/)
    })
  })

  describe('REQ-009 — lucide-react Sun/Moon 24×24', () => {
    it('Sun 과 Moon 이 lucide-react 에서 import 된다', () => {
      expect(TOGGLE_SRC).toMatch(
        /import\s*\{[^}]*(Sun[^}]*Moon|Moon[^}]*Sun)[^}]*\}\s*from\s*['"]lucide-react['"]/,
      )
    })
    it('Sun 과 Moon 이 24×24 (w-6 h-6) 로 렌더된다', () => {
      expect(TOGGLE_SRC).toMatch(/<Sun\s+className=['"][^'"]*w-6[^'"]*h-6/)
      expect(TOGGLE_SRC).toMatch(/<Moon\s+className=['"][^'"]*w-6[^'"]*h-6/)
    })
  })

  describe('REQ-008 — navbar 배치', () => {
    it('header.tsx 가 ThemeToggle 을 import 한다', () => {
      expect(HEADER_SRC).toMatch(
        /import\s*\{\s*ThemeToggle\s*\}\s*from\s*['"]@\/components\/ThemeToggle['"]/,
      )
    })
    it('<ThemeToggle /> 렌더가 존재한다', () => {
      expect(HEADER_SRC).toMatch(/<ThemeToggle\s*\/?>/)
    })
  })

  describe('REQ-010 navbar — 다크 하드코딩 토큰 치환 (CTA gradient 예외 허용)', () => {
    it('bg-black 하드코딩이 제거되었다 (scroll 배경 + mobile overlay)', () => {
      expect(HEADER_SRC).not.toMatch(/bg-black\//)
      expect(HEADER_SRC).not.toMatch(/bg-black(?![/-])/)
    })
    it('border-gray-800 하드코딩이 제거되었다', () => {
      expect(HEADER_SRC).not.toMatch(/border-gray-800/)
    })
    it('text-gray-400 / text-gray-200 inactive nav 하드코딩이 제거되었다', () => {
      expect(HEADER_SRC).not.toMatch(/text-gray-400/)
      expect(HEADER_SRC).not.toMatch(/text-gray-200/)
    })
    it('로고/active-nav/hamburger 의 text-white 가 text-foreground 로 전환되었다', () => {
      expect(HEADER_SRC).toMatch(/text-foreground/)
      expect(HEADER_SRC).toMatch(/text-muted-foreground/)
      expect(HEADER_SRC).toMatch(/bg-background/)
      expect(HEADER_SRC).toMatch(/border-border/)
    })
    it('CTA gradient 배경 위 text-white 는 의도적 예외로 유지 (decision-log D-010)', () => {
      expect(HEADER_SRC).toMatch(
        /text-white[^;]*from-purple-600|from-purple-600[^;]*text-white/s,
      )
    })
  })
})

// ============================================================================
// T-THEME-05 — Hero + Features 토큰 치환 (PR-3)
// ============================================================================

describe('F1 Hero + Features 토큰 치환 (T-THEME-05, PR-3)', () => {
  const HERO_PATH = resolve(__dirname, '../components/sections/hero.tsx')
  const FEATURES_PATH = resolve(__dirname, '../components/sections/features.tsx')

  const HERO_SRC = readFileSync(HERO_PATH, 'utf8')
  const FEATURES_SRC = readFileSync(FEATURES_PATH, 'utf8')

  describe('REQ-010 — Hero 다크 하드코딩 제거', () => {
    it('hero.tsx 에 text-gray-400/200 이 없다', () => {
      expect(HERO_SRC).not.toMatch(/text-gray-400/)
      expect(HERO_SRC).not.toMatch(/text-gray-200/)
    })
    it('hero.tsx 에 border-gray-600 이 없다', () => {
      expect(HERO_SRC).not.toMatch(/border-gray-600/)
    })
    it('hero.tsx 에 hover:border-white 가 없다', () => {
      expect(HERO_SRC).not.toMatch(/hover:border-white(?![a-z])/)
    })
    it('hero.tsx 의 h1/subtitle 이 토큰화되었다', () => {
      expect(HERO_SRC).toMatch(/text-foreground/)
      expect(HERO_SRC).toMatch(/text-muted-foreground/)
      expect(HERO_SRC).toMatch(/border-border/)
    })
    it('CTA gradient 내 text-white 는 의도적 예외로 유지 (D-010)', () => {
      expect(HERO_SRC).toMatch(/text-white[^;]*from-purple-600|from-purple-600[^;]*text-white/s)
    })
  })

  describe('REQ-010 — Features 다크 하드코딩 제거', () => {
    it('features.tsx 에 text-gray-400 이 없다', () => {
      expect(FEATURES_SRC).not.toMatch(/text-gray-400/)
    })
    it('features.tsx 에 text-white 가 없다 (CTA 없음 — 예외 불필요)', () => {
      expect(FEATURES_SRC).not.toMatch(/text-white(?![a-z/-])/)
    })
    it('features.tsx 의 h2/h3/description 이 토큰화되었다', () => {
      expect(FEATURES_SRC).toMatch(/text-foreground/)
      expect(FEATURES_SRC).toMatch(/text-muted-foreground/)
    })
    it('features.tsx 아이콘이 text-accent 로 토큰화되었다 (D-011)', () => {
      expect(FEATURES_SRC).toMatch(/text-accent(?![a-z-])/)
      expect(FEATURES_SRC).not.toMatch(/text-purple-400/)
    })
    it('features.tsx 의 bg-card/border-border 기존 토큰은 유지된다', () => {
      expect(FEATURES_SRC).toMatch(/bg-card/)
      expect(FEATURES_SRC).toMatch(/border-border/)
    })
  })

  describe('REQ-014 — Hero/Features 범위 3중 grep 0건', () => {
    const SECTIONS = [
      { name: 'hero.tsx', src: HERO_SRC },
      { name: 'features.tsx', src: FEATURES_SRC },
    ]
    it.each(SECTIONS)('$name — bg-black 하드코딩 없음', ({ src }) => {
      expect(src).not.toMatch(/bg-black(?![-/])/)
    })
    it.each(SECTIONS)('$name — border-gray-\\d+ 하드코딩 없음', ({ src }) => {
      expect(src).not.toMatch(/border-gray-\d+/)
    })
    it.each(SECTIONS)('$name — text-gray-\\d+ 하드코딩 없음', ({ src }) => {
      expect(src).not.toMatch(/text-gray-\d+/)
    })
  })
})

// ============================================================================
// T-THEME-07 — Footer + Sections 토큰 치환 (PR-5)
// ============================================================================

describe('F1 Footer + Sections 토큰 치환 (T-THEME-07, PR-5)', () => {
  const FILES = {
    footer: readFileSync(resolve(__dirname, '../components/sections/footer.tsx'), 'utf8'),
    cta: readFileSync(resolve(__dirname, '../components/sections/cta.tsx'), 'utf8'),
    integrations: readFileSync(resolve(__dirname, '../components/sections/integrations.tsx'), 'utf8'),
    problems: readFileSync(resolve(__dirname, '../components/sections/problems.tsx'), 'utf8'),
    products: readFileSync(resolve(__dirname, '../components/sections/products.tsx'), 'utf8'),
  }

  describe('REQ-010 — sections 다크 하드코딩 제거 (3중 grep)', () => {
    const SECTIONS = Object.entries(FILES).map(([name, src]) => ({ name, src }))

    it.each(SECTIONS)('$name — text-gray-\\d+ 하드코딩 0건', ({ src }) => {
      expect(src).not.toMatch(/text-gray-\d+/)
    })
    it.each(SECTIONS)('$name — border-gray-\\d+ 하드코딩 0건', ({ src }) => {
      expect(src).not.toMatch(/border-gray-\d+/)
    })
    it.each(SECTIONS)('$name — bg-gray-\\d+ 하드코딩 0건', ({ src }) => {
      expect(src).not.toMatch(/bg-gray-\d+/)
    })
  })

  describe('REQ-010 — sections text-white 제거 (CTA gradient 예외)', () => {
    it('footer.tsx 에 text-white 없음', () => {
      expect(FILES.footer).not.toMatch(/text-white(?![a-z/-])/)
    })
    it('cta.tsx 의 text-white 는 gradient CTA 1건만 (D-010)', () => {
      const matches = FILES.cta.match(/text-white/g) || []
      expect(matches.length).toBe(1)
      expect(FILES.cta).toMatch(/text-white[^;]*from-purple-600|from-purple-600[^;]*text-white/s)
    })
    it('integrations.tsx 에 text-white 없음', () => {
      expect(FILES.integrations).not.toMatch(/text-white(?![a-z/-])/)
    })
    it('problems.tsx 에 text-white 없음', () => {
      expect(FILES.problems).not.toMatch(/text-white(?![a-z/-])/)
    })
    it('products.tsx 에 text-white 없음 (CTA 없음, 모두 치환)', () => {
      expect(FILES.products).not.toMatch(/text-white(?![a-z/-])/)
    })
  })

  describe('REQ-010 — 토큰 사용 확인', () => {
    const SECTIONS = Object.entries(FILES).map(([name, src]) => ({ name, src }))
    it.each(SECTIONS)('$name — text-foreground 또는 text-muted-foreground 사용', ({ src }) => {
      expect(src).toMatch(/text-(muted-)?foreground/)
    })
  })

  describe('D-011 — integrations Icon text-accent 전환', () => {
    it('integrations.tsx Icon 이 text-accent (text-purple-400 제거)', () => {
      expect(FILES.integrations).toMatch(/text-accent(?![a-z-])/)
      expect(FILES.integrations).not.toMatch(/text-purple-400/)
    })
  })

  describe('D-013 — problems/products 상태색 전환', () => {
    it('problems.tsx X 아이콘이 text-destructive (text-red-400 제거)', () => {
      expect(FILES.problems).toMatch(/text-destructive/)
      expect(FILES.problems).not.toMatch(/text-red-400/)
    })
    it('problems.tsx Check 아이콘이 text-emerald-600 (text-emerald-400 제거)', () => {
      expect(FILES.problems).toMatch(/text-emerald-600/)
      expect(FILES.problems).not.toMatch(/text-emerald-400/)
    })
    it('products.tsx Check 아이콘이 text-emerald-600 (text-emerald-400 제거)', () => {
      expect(FILES.products).toMatch(/text-emerald-600/)
      expect(FILES.products).not.toMatch(/text-emerald-400/)
    })
  })

  describe('REQ-012 (D-012) — UI primitives + shared 이미 토큰화 확인 (편집 불요 증거)', () => {
    const UI_FILES = ['badge', 'button', 'card', 'input', 'textarea']
    it.each(UI_FILES)('ui/%s.tsx 에 text-gray-/border-gray-/bg-gray- 없음', (name) => {
      const src = readFileSync(resolve(__dirname, `../components/ui/${name}.tsx`), 'utf8')
      expect(src).not.toMatch(/text-gray-\d+/)
      expect(src).not.toMatch(/border-gray-\d+/)
      expect(src).not.toMatch(/bg-gray-\d+/)
    })
  })

  describe('브랜드 색 알파 유지 — 양 테마 적응', () => {
    it('cta.tsx gradient + border-purple-500/20 유지', () => {
      expect(FILES.cta).toMatch(/from-purple-900\/30/)
      expect(FILES.cta).toMatch(/to-blue-900\/30/)
      expect(FILES.cta).toMatch(/border-purple-500\/20/)
    })
    it('products.tsx active tab border-purple-500 유지', () => {
      expect(FILES.products).toMatch(/border-purple-500(?![/-])/)
    })
  })
})

describe('F1 Dash-Preview 토큰 치환 (T-THEME-08, PR-6)', () => {
  const FILES = {
    'preview-chrome': readFileSync(
      resolve(__dirname, '../components/dashboard-preview/preview-chrome.tsx'),
      'utf8',
    ),
    'interactive-tooltip': readFileSync(
      resolve(
        __dirname,
        '../components/dashboard-preview/interactive-tooltip.tsx',
      ),
      'utf8',
    ),
    'datetime-card': readFileSync(
      resolve(
        __dirname,
        '../components/dashboard-preview/ai-register-main/order-form/datetime-card.tsx',
      ),
      'utf8',
    ),
    'estimate-info-card': readFileSync(
      resolve(
        __dirname,
        '../components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx',
      ),
      'utf8',
    ),
    'settlement-section': readFileSync(
      resolve(
        __dirname,
        '../components/dashboard-preview/ai-register-main/order-form/settlement-section.tsx',
      ),
      'utf8',
    ),
    'transport-option-card': readFileSync(
      resolve(
        __dirname,
        '../components/dashboard-preview/ai-register-main/order-form/transport-option-card.tsx',
      ),
      'utf8',
    ),
    'order-form-index': readFileSync(
      resolve(
        __dirname,
        '../components/dashboard-preview/ai-register-main/order-form/index.tsx',
      ),
      'utf8',
    ),
  }

  describe('REQ-011 — 실 코드 다크 하드코딩 제거 (interactive-tooltip 예외)', () => {
    const FILES_EXCEPT_TOOLTIP = Object.entries(FILES).filter(
      ([name]) => name !== 'interactive-tooltip',
    )

    /**
     * 주석(JSDoc) 영역은 테스트 범위에서 제외하고 **실 코드 라인**만 검사한다.
     * 각 파일의 JSDoc 블록을 소거한 후 패턴 탐지 — 수술적 변경 원칙 준수.
     */
    function stripComments(src: string): string {
      return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')
    }

    it.each(FILES_EXCEPT_TOOLTIP)(
      '%s — bg-white 알파 하드코딩 0건 (실 코드)',
      (_name, src) => {
        expect(stripComments(src)).not.toMatch(/bg-white\/\d+/)
      },
    )
    it.each(FILES_EXCEPT_TOOLTIP)(
      '%s — text-white 알파/solid 0건 (gradient CTA 예외 제외, 실 코드)',
      (_name, src) => {
        const code = stripComments(src)
        // 알파 패턴 완전 제거
        expect(code).not.toMatch(/text-white\/\d+/)
        // solid text-white 는 gradient CTA 컨텍스트만 허용
        const solidMatches = code.match(/text-white(?![a-z/-])/g) || []
        const gradientContext =
          (code.match(
            /text-white[^;"\n]*from-purple-600|from-purple-600[^;"\n]*text-white/gs,
          ) || []).length
        expect(solidMatches.length).toBe(gradientContext)
      },
    )
    it.each(FILES_EXCEPT_TOOLTIP)(
      '%s — border-white 알파 하드코딩 0건 (실 코드)',
      (_name, src) => {
        expect(stripComments(src)).not.toMatch(/border-white\/\d+/)
      },
    )
    it.each(FILES_EXCEPT_TOOLTIP)(
      '%s — text-gray-* 하드코딩 0건 (실 코드)',
      (_name, src) => {
        expect(stripComments(src)).not.toMatch(/text-gray-\d+/)
      },
    )
    it.each(FILES_EXCEPT_TOOLTIP)(
      '%s — border-gray-* 하드코딩 0건 (실 코드)',
      (_name, src) => {
        expect(stripComments(src)).not.toMatch(/border-gray-\d+/)
      },
    )
    it.each(FILES_EXCEPT_TOOLTIP)(
      '%s — bg-gray-* 하드코딩 0건 (실 코드)',
      (_name, src) => {
        expect(stripComments(src)).not.toMatch(/bg-gray-\d+/)
      },
    )
  })

  describe('REQ-011 — 토큰 사용 확인', () => {
    it('datetime-card — text-foreground/muted-foreground/border-border/bg-card 사용', () => {
      expect(FILES['datetime-card']).toMatch(/text-(muted-)?foreground/)
      expect(FILES['datetime-card']).toMatch(/border-border/)
      expect(FILES['datetime-card']).toMatch(/bg-card\/50/)
    })
    it('estimate-info-card — 토큰 전수 사용', () => {
      expect(FILES['estimate-info-card']).toMatch(/text-(muted-)?foreground/)
      expect(FILES['estimate-info-card']).toMatch(/border-border/)
      expect(FILES['estimate-info-card']).toMatch(/bg-card\/50|bg-muted/)
    })
    it('settlement-section — 토큰 전수 사용', () => {
      expect(FILES['settlement-section']).toMatch(/text-(muted-)?foreground/)
      expect(FILES['settlement-section']).toMatch(/border-border/)
      expect(FILES['settlement-section']).toMatch(/bg-card\/50/)
    })
    it('transport-option-card — 토큰 전수 사용 + stroke-muted-foreground', () => {
      expect(FILES['transport-option-card']).toMatch(/text-(muted-)?foreground/)
      expect(FILES['transport-option-card']).toMatch(/border-border/)
      expect(FILES['transport-option-card']).toMatch(/bg-card\/50/)
      expect(FILES['transport-option-card']).toMatch(/stroke-muted-foreground/)
    })
    it('order-form-index — gradient 배경 토큰화 (bg-gradient-to-br from-muted/30 to-muted/50)', () => {
      expect(FILES['order-form-index']).toMatch(/from-muted\/30/)
      expect(FILES['order-form-index']).toMatch(/to-muted\/50/)
      expect(FILES['order-form-index']).toMatch(/ring-offset-background/)
    })
    it('preview-chrome — border-border + bg-card/50 + text-muted-foreground', () => {
      expect(FILES['preview-chrome']).toMatch(/border border-border/)
      expect(FILES['preview-chrome']).toMatch(/bg-card\/50/)
      expect(FILES['preview-chrome']).toMatch(/text-muted-foreground/)
    })
  })

  describe('D-013 — settlement-section 상태색 전환', () => {
    it('text-emerald-400 제거 + text-emerald-600 도입', () => {
      expect(FILES['settlement-section']).not.toMatch(/text-emerald-400/)
      expect(FILES['settlement-section']).toMatch(/text-emerald-600/)
    })
    it('text-red-400 제거 + text-destructive 도입', () => {
      // 주석 제외, 실 코드에서만 검증
      const code = FILES['settlement-section']
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/[^\n]*/g, '')
      expect(code).not.toMatch(/text-red-400/)
      expect(code).toMatch(/text-destructive/)
    })
  })

  describe('D-014 — interactive-tooltip 반대 테마 배경 유지', () => {
    it('bg-gray-900/90 + text-white 유지 (실 코드 Line 74)', () => {
      expect(FILES['interactive-tooltip']).toMatch(/bg-gray-900\/90/)
      expect(FILES['interactive-tooltip']).toMatch(/text-white/)
    })
  })

  describe('브랜드 고정 색 유지', () => {
    it('preview-chrome CHROME_DOT_COLORS (red-500/yellow-500/green-500) 유지', () => {
      expect(FILES['preview-chrome']).toMatch(/bg-red-500/)
      expect(FILES['preview-chrome']).toMatch(/bg-yellow-500/)
      expect(FILES['preview-chrome']).toMatch(/bg-green-500/)
    })
    it('estimate-info-card CTA gradient from-purple-600 to-blue-600 text-white 유지 (D-010)', () => {
      expect(FILES['estimate-info-card']).toMatch(
        /from-purple-600[^;"\n]*to-blue-600[^;"\n]*text-white|text-white[^;"\n]*from-purple-600[^;"\n]*to-blue-600/s,
      )
    })
  })
})

// ============================================================================
// T-THEME-09 — AI 패널 8파일 토큰 치환 (PR-7, D-016 P0)
// ============================================================================

describe('F1 AI 패널 토큰 치환 (T-THEME-09, PR-7)', () => {
  const AI_PANEL_DIR = '../components/dashboard-preview/ai-register-main/ai-panel'
  const FILES = {
    'index': readFileSync(
      resolve(__dirname, `${AI_PANEL_DIR}/index.tsx`),
      'utf8',
    ),
    'ai-tab-bar': readFileSync(
      resolve(__dirname, `${AI_PANEL_DIR}/ai-tab-bar.tsx`),
      'utf8',
    ),
    'ai-input-area': readFileSync(
      resolve(__dirname, `${AI_PANEL_DIR}/ai-input-area.tsx`),
      'utf8',
    ),
    'ai-extract-button': readFileSync(
      resolve(__dirname, `${AI_PANEL_DIR}/ai-extract-button.tsx`),
      'utf8',
    ),
    'ai-result-buttons': readFileSync(
      resolve(__dirname, `${AI_PANEL_DIR}/ai-result-buttons.tsx`),
      'utf8',
    ),
    'ai-button-item': readFileSync(
      resolve(__dirname, `${AI_PANEL_DIR}/ai-button-item.tsx`),
      'utf8',
    ),
    'ai-warning-badges': readFileSync(
      resolve(__dirname, `${AI_PANEL_DIR}/ai-warning-badges.tsx`),
      'utf8',
    ),
    'ai-extract-json-viewer': readFileSync(
      resolve(__dirname, `${AI_PANEL_DIR}/ai-extract-json-viewer.tsx`),
      'utf8',
    ),
  }

  /**
   * 주석(JSDoc) 영역은 테스트 범위에서 제외하고 **실 코드 라인**만 검사한다.
   * D-015 알파 패턴 원칙 — 주석 내 REQ-DASH3-* 레퍼런스는 보존.
   */
  function stripComments(src: string): string {
    return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')
  }

  describe('REQ-011 확장 (D-016) — 8파일 다크 하드코딩 제거', () => {
    const ALL_FILES = Object.entries(FILES)

    it.each(ALL_FILES)(
      '%s — bg-black 알파/solid 하드코딩 0건 (실 코드)',
      (_name, src) => {
        expect(stripComments(src)).not.toMatch(/bg-black(?![-/])/)
        expect(stripComments(src)).not.toMatch(/bg-black\/\d+/)
      },
    )
    it.each(ALL_FILES)(
      '%s — border-white 알파 하드코딩 0건 (LoadingSpinner brand-contrast 예외만 허용, 실 코드)',
      (name, src) => {
        const code = stripComments(src)
        // ai-extract-button 의 LoadingSpinner 는 gradient 배경 위에 있어 brand-contrast 로 유지 (D-010 승계)
        // 그 외 모든 파일은 border-white 알파 0건
        if (name === 'ai-extract-button') {
          const matches = code.match(/border-white\/\d+/g) || []
          // LoadingSpinner 의 border-white/30 1건만 허용
          expect(matches.length).toBeLessThanOrEqual(1)
          if (matches.length === 1) {
            // 동일 클래스 리스트에 border-t-white 가 함께 있어야 LoadingSpinner 컨텍스트 인증
            expect(code).toMatch(/border-white\/30[^'"]*border-t-white/)
          }
        } else {
          expect(code).not.toMatch(/border-white\/\d+/)
        }
      },
    )
    it.each(ALL_FILES)(
      '%s — bg-white 알파 하드코딩 0건 (실 코드, ripple wave 예외 — foreground/30 으로 치환)',
      (_name, src) => {
        expect(stripComments(src)).not.toMatch(/bg-white\/\d+/)
        expect(stripComments(src)).not.toMatch(/bg-white\/\[[^\]]+\]/)
      },
    )
    it.each(ALL_FILES)(
      '%s — text-gray-* 하드코딩 0건 (실 코드)',
      (_name, src) => {
        expect(stripComments(src)).not.toMatch(/text-gray-\d+/)
      },
    )
    it.each(ALL_FILES)(
      '%s — text-white 알파 하드코딩 0건 (실 코드)',
      (_name, src) => {
        expect(stripComments(src)).not.toMatch(/text-white\/\d+/)
      },
    )
    it.each(ALL_FILES)(
      '%s — ring-offset-black 하드코딩 0건 (실 코드)',
      (_name, src) => {
        expect(stripComments(src)).not.toMatch(/ring-offset-black\/\d+/)
      },
    )
    it.each(ALL_FILES)(
      '%s — text-white solid 은 gradient CTA + LoadingSpinner 예외만 허용 (실 코드)',
      (_name, src) => {
        const code = stripComments(src)
        // solid text-white 는 gradient / border-white context (LoadingSpinner 에서 brand-contrast) 만 허용
        const solidMatches = code.match(/text-white(?![a-z/-])/g) || []
        const gradientContext = (code.match(
          /text-white[^;"\n]*from-purple-600|from-purple-600[^;"\n]*text-white/gs,
        ) || []).length
        const loadingSpinnerContext = (code.match(
          /border-t-white(?![a-z/-])/g,
        ) || []).length
        expect(solidMatches.length).toBe(gradientContext + loadingSpinnerContext)
      },
    )
  })

  describe('REQ-011 확장 — 토큰 사용 확인', () => {
    it('index.tsx — bg-card/50 + border-border + text-foreground + text-muted-foreground 사용', () => {
      expect(FILES['index']).toMatch(/bg-card\/50/)
      expect(FILES['index']).toMatch(/border-border/)
      expect(FILES['index']).toMatch(/text-foreground/)
      expect(FILES['index']).toMatch(/text-muted-foreground/)
    })
    it('ai-tab-bar.tsx — bg-card/50 + border-border + text-muted-foreground 사용', () => {
      expect(FILES['ai-tab-bar']).toMatch(/bg-card\/50/)
      expect(FILES['ai-tab-bar']).toMatch(/border-border/)
      expect(FILES['ai-tab-bar']).toMatch(/text-muted-foreground/)
    })
    it('ai-input-area.tsx — bg-card/50 + border-border + text-foreground + text-muted-foreground 사용', () => {
      expect(FILES['ai-input-area']).toMatch(/bg-card\/50/)
      expect(FILES['ai-input-area']).toMatch(/border-border/)
      expect(FILES['ai-input-area']).toMatch(/text-foreground/)
      expect(FILES['ai-input-area']).toMatch(/text-muted-foreground/)
    })
    it('ai-extract-button.tsx — ring-offset-background 사용 (focus-visible + focused)', () => {
      expect(FILES['ai-extract-button']).toMatch(/ring-offset-background/)
      expect(FILES['ai-extract-button']).toMatch(/ring-foreground\/60/)
    })
    it('ai-result-buttons.tsx — bg-card/50 + border-border + bg-muted + text-foreground + text-muted-foreground 사용', () => {
      expect(FILES['ai-result-buttons']).toMatch(/bg-card\/50/)
      expect(FILES['ai-result-buttons']).toMatch(/border-border/)
      expect(FILES['ai-result-buttons']).toMatch(/bg-muted\/30/)
      expect(FILES['ai-result-buttons']).toMatch(/text-foreground/)
      expect(FILES['ai-result-buttons']).toMatch(/text-muted-foreground/)
      expect(FILES['ai-result-buttons']).toMatch(/ring-offset-background/)
    })
    it('ai-button-item.tsx — ring-offset-background + border-border + bg-muted/30 + text-foreground/80 + text-muted-foreground 사용', () => {
      expect(FILES['ai-button-item']).toMatch(/ring-offset-background/)
      expect(FILES['ai-button-item']).toMatch(/border-border/)
      expect(FILES['ai-button-item']).toMatch(/bg-muted\/30/)
      expect(FILES['ai-button-item']).toMatch(/text-foreground\/80/)
      expect(FILES['ai-button-item']).toMatch(/text-muted-foreground/)
    })
    it('ai-extract-json-viewer.tsx — bg-card/50 + border-border + text-foreground + text-muted-foreground 사용', () => {
      expect(FILES['ai-extract-json-viewer']).toMatch(/bg-card\/50/)
      expect(FILES['ai-extract-json-viewer']).toMatch(/border-border/)
      expect(FILES['ai-extract-json-viewer']).toMatch(/text-foreground/)
      expect(FILES['ai-extract-json-viewer']).toMatch(/text-muted-foreground/)
      expect(FILES['ai-extract-json-viewer']).toMatch(/bg-muted\/50/)
    })
  })

  describe('D-013 재적용 — ai-button-item / ai-warning-badges 상태색 WCAG AA', () => {
    it('ai-button-item — text-green-400 제거 + text-emerald-600 도입 (applied 상태)', () => {
      const code = stripComments(FILES['ai-button-item'])
      expect(code).not.toMatch(/text-green-400/)
      expect(code).toMatch(/text-emerald-600/)
    })
    it('ai-warning-badges — text-amber-300 제거 + text-amber-700 도입 (WCAG AA)', () => {
      const code = stripComments(FILES['ai-warning-badges'])
      expect(code).not.toMatch(/text-amber-300/)
      expect(code).toMatch(/text-amber-700/)
    })
  })

  describe('ripple wave 테마 적응 — ai-button-item', () => {
    it('ripple wave 가 bg-foreground/30 으로 전환되었다 (bg-white/30 제거)', () => {
      const code = stripComments(FILES['ai-button-item'])
      expect(code).not.toMatch(/bg-white\/30/)
      expect(code).toMatch(/bg-foreground\/30/)
    })
  })

  describe('브랜드 고정 예외 유지 — gradient text-white + LoadingSpinner', () => {
    it('ai-extract-button gradient from-purple-600 to-blue-600 text-white 유지 (D-010)', () => {
      // 이 파일은 BASE_CLASSES 가 multi-line 문자열 concat 이므로 text-white 와 gradient 가 별도 줄에 존재.
      // 양쪽 모두 동일 상수에 존재함을 증거로 삼는다.
      const code = stripComments(FILES['ai-extract-button'])
      expect(code).toMatch(/from-purple-600/)
      expect(code).toMatch(/to-blue-600/)
      expect(code).toMatch(/text-white(?![a-z/-])/)
    })
    it('ai-extract-button LoadingSpinner border-white/30 border-t-white 유지 (brand-contrast on gradient)', () => {
      const code = stripComments(FILES['ai-extract-button'])
      // LoadingSpinner 는 gradient 배경 위에 있으므로 brand-contrast 로 유지 (예외)
      // 단, stripComments + 위 bg-white/\d+ 차단 테스트가 있어 별도 처리 필요 — 본 예외 검증은
      // border-t-white (solid) 존재만 확인. border-white/30 은 alpha 형태로 위 테스트를 위반하므로
      // ring/border-t-white 쪽은 alpha 가 아닌 solid 또는 주석 처리된 형태 검증.
      expect(code).toMatch(/border-t-white(?![a-z/-])/)
    })
    it('ai-panel/index.tsx AI 로고 gradient from-purple-600 to-blue-600 text-white 유지 (D-010)', () => {
      const code = stripComments(FILES['index'])
      expect(code).toMatch(
        /from-purple-600[^;"\n]*to-blue-600[^;"\n]*text-white|text-white[^;"\n]*from-purple-600[^;"\n]*to-blue-600/s,
      )
    })
  })
})

// ============================================================================
// T-THEME-10 — Legacy Dash-Preview 4파일 토큰 치환 (PR-7, D-016 확장)
// ============================================================================

describe('F1 Legacy Dash-Preview 토큰 치환 (T-THEME-10, PR-7)', () => {
  const DP_DIR = '../components/dashboard-preview'
  const FILES = {
    'ai-panel-preview': readFileSync(
      resolve(__dirname, `${DP_DIR}/ai-panel-preview.tsx`),
      'utf8',
    ),
    'form-preview': readFileSync(
      resolve(__dirname, `${DP_DIR}/form-preview.tsx`),
      'utf8',
    ),
    'mobile-card-view': readFileSync(
      resolve(__dirname, `${DP_DIR}/mobile-card-view.tsx`),
      'utf8',
    ),
    'step-indicator': readFileSync(
      resolve(__dirname, `${DP_DIR}/step-indicator.tsx`),
      'utf8',
    ),
  }

  /**
   * 주석(JSDoc) 영역은 테스트 범위에서 제외하고 **실 코드 라인**만 검사한다.
   * D-015 알파 패턴 원칙 — 주석 내 REQ-DASH3-* 레퍼런스는 보존.
   */
  function stripComments(src: string): string {
    return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')
  }

  describe('REQ-011 확장 (D-016) — 4파일 다크 하드코딩 제거', () => {
    const ALL_FILES = Object.entries(FILES)

    it.each(ALL_FILES)(
      '%s — bg-gray-* 하드코딩 0건 (실 코드)',
      (_name, src) => {
        expect(stripComments(src)).not.toMatch(/bg-gray-\d+/)
      },
    )
    it.each(ALL_FILES)(
      '%s — text-gray-* 하드코딩 0건 (실 코드)',
      (_name, src) => {
        expect(stripComments(src)).not.toMatch(/text-gray-\d+/)
      },
    )
    it.each(ALL_FILES)(
      '%s — border-gray-* 하드코딩 0건 (실 코드)',
      (_name, src) => {
        expect(stripComments(src)).not.toMatch(/border-gray-\d+/)
      },
    )
    it.each(ALL_FILES)(
      '%s — text-white solid 은 gradient CTA 예외만 허용 (실 코드)',
      (_name, src) => {
        const code = stripComments(src)
        const solidMatches = code.match(/text-white(?![a-z/-])/g) || []
        const gradientContext = (code.match(
          /text-white[^;"\n]*from-purple-600|from-purple-600[^;"\n]*text-white/gs,
        ) || []).length
        expect(solidMatches.length).toBe(gradientContext)
      },
    )
    it.each(ALL_FILES)(
      '%s — text-blue-400 하드코딩 0건 (실 코드)',
      (_name, src) => {
        expect(stripComments(src)).not.toMatch(/text-blue-400/)
      },
    )
    it.each(ALL_FILES)(
      '%s — text-green-400 하드코딩 0건 (실 코드)',
      (_name, src) => {
        expect(stripComments(src)).not.toMatch(/text-green-400/)
      },
    )
    it.each(ALL_FILES)(
      '%s — text-purple-300 하드코딩 0건 (실 코드)',
      (_name, src) => {
        expect(stripComments(src)).not.toMatch(/text-purple-300/)
      },
    )
  })

  describe('REQ-011 확장 — 토큰 사용 확인', () => {
    const TOKEN_USING_FILES = Object.entries(FILES).filter(
      ([name]) => name !== 'step-indicator',
    )

    it.each(TOKEN_USING_FILES)(
      '%s — bg-card/50 사용',
      (_name, src) => {
        expect(src).toMatch(/bg-card\/50/)
      },
    )
    it.each(TOKEN_USING_FILES)(
      '%s — border-border 사용',
      (_name, src) => {
        expect(src).toMatch(/border-border/)
      },
    )
    it.each(TOKEN_USING_FILES)(
      '%s — text-foreground 사용',
      (_name, src) => {
        expect(src).toMatch(/text-foreground/)
      },
    )
    it.each(TOKEN_USING_FILES)(
      '%s — text-muted-foreground 사용',
      (_name, src) => {
        expect(src).toMatch(/text-muted-foreground/)
      },
    )
  })

  describe('D-011 재적용 — ai-panel-preview 탭 accent 전환', () => {
    it('ai-panel-preview.tsx — border-accent 존재', () => {
      expect(FILES['ai-panel-preview']).toMatch(/border-accent(?![a-z-])/)
    })
    it('ai-panel-preview.tsx — text-accent 존재', () => {
      expect(FILES['ai-panel-preview']).toMatch(/text-accent(?![a-z-])/)
    })
  })

  describe('D-013 재적용 — 상태색 변환 (green-400 → emerald-600)', () => {
    it('ai-panel-preview.tsx — text-emerald-600 존재', () => {
      expect(FILES['ai-panel-preview']).toMatch(/text-emerald-600/)
    })
    it('mobile-card-view.tsx — text-emerald-600 존재', () => {
      expect(FILES['mobile-card-view']).toMatch(/text-emerald-600/)
    })
    it('ai-panel-preview.tsx — text-green-400 제거됨 (실 코드)', () => {
      expect(stripComments(FILES['ai-panel-preview'])).not.toMatch(/text-green-400/)
    })
    it('mobile-card-view.tsx — text-green-400 제거됨 (실 코드)', () => {
      expect(stripComments(FILES['mobile-card-view'])).not.toMatch(/text-green-400/)
    })
  })

  describe('브랜드 예외 — step-indicator gradient 유지', () => {
    it('step-indicator.tsx — active dot brand gradient 유지 (D-010)', () => {
      expect(FILES['step-indicator']).toMatch(
        /bg-gradient-to-r\s+from-purple-500\s+to-blue-500/,
      )
    })
  })
})

// ---------------------------------------------------------------------------
// T-THEME-11 — Products / Integrations 카드 배경 강화 (D-016, PR-7)
// ---------------------------------------------------------------------------

describe('F1 Products/Integrations 카드 배경 강화 (T-THEME-11, PR-7)', () => {
  const PRODUCTS = readFileSync(
    resolve(process.cwd(), 'src/components/sections/products.tsx'),
    'utf-8',
  )
  const INTEGRATIONS = readFileSync(
    resolve(process.cwd(), 'src/components/sections/integrations.tsx'),
    'utf-8',
  )

  describe('D-016 QA — products placeholder 시각 강화', () => {
    it('products.tsx — aspect-video 컨테이너에 bg-muted/50 적용', () => {
      expect(PRODUCTS).toMatch(/aspect-video[^"]*bg-muted\/50/)
    })

    it('products.tsx — shadow-sm 존재 (깊이감 확보)', () => {
      expect(PRODUCTS).toMatch(/aspect-video[^"]*shadow-sm/)
    })

    it('products.tsx — border border-border 유지', () => {
      expect(PRODUCTS).toMatch(/aspect-video[^"]*border border-border/)
    })

    it('products.tsx — 기존 bg-card/50 placeholder 제거', () => {
      const placeholderBlock = PRODUCTS.match(/aspect-video[^"]*"/s)?.[0] ?? ''
      expect(placeholderBlock).not.toMatch(/bg-card\/50/)
    })
  })

  describe('D-016 QA — integrations card 시각 강화', () => {
    it('integrations.tsx — card 에 shadow-sm 적용', () => {
      expect(INTEGRATIONS).toMatch(/bg-card[^"]*shadow-sm/)
    })

    it('integrations.tsx — bg-card + border border-border 유지', () => {
      expect(INTEGRATIONS).toMatch(/bg-card border border-border/)
    })
  })
})

// ---------------------------------------------------------------------------
// T-THEME-12 — Problems/order-form 미세 조정 (D-016, PR-7)
// ---------------------------------------------------------------------------

describe('F1 Problems/order-form 미세 조정 (T-THEME-12, PR-7)', () => {
  const PROBLEMS = readFileSync(
    resolve(process.cwd(), 'src/components/sections/problems.tsx'),
    'utf-8',
  )
  const DATETIME = readFileSync(
    resolve(
      process.cwd(),
      'src/components/dashboard-preview/ai-register-main/order-form/datetime-card.tsx',
    ),
    'utf-8',
  )
  const ESTIMATE = readFileSync(
    resolve(
      process.cwd(),
      'src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx',
    ),
    'utf-8',
  )
  const SETTLEMENT = readFileSync(
    resolve(
      process.cwd(),
      'src/components/dashboard-preview/ai-register-main/order-form/settlement-section.tsx',
    ),
    'utf-8',
  )
  const TRANSPORT = readFileSync(
    resolve(
      process.cwd(),
      'src/components/dashboard-preview/ai-register-main/order-form/transport-option-card.tsx',
    ),
    'utf-8',
  )

  describe('D-016 QA — problems before 텍스트 대비 강화', () => {
    it('problems.tsx — before 텍스트 text-foreground/70 적용 (기존 text-muted-foreground 대체)', () => {
      expect(PROBLEMS).toMatch(/text-foreground\/70[^"]*line-through/)
    })
  })

  describe('D-016 QA — order-form 카드 shadow-sm 추가', () => {
    it('datetime-card.tsx — 최상위 카드에 shadow-sm 포함', () => {
      expect(DATETIME).toMatch(/bg-card\/50 border border-border[^'"]*shadow-sm/)
    })

    it('estimate-info-card.tsx — 최상위 카드에 shadow-sm 포함', () => {
      expect(ESTIMATE).toMatch(/bg-card\/50 border border-border[^'"]*shadow-sm/)
    })

    it('settlement-section.tsx — 최상위 카드에 shadow-sm 포함', () => {
      expect(SETTLEMENT).toMatch(/bg-card\/50 border border-border[^'"]*shadow-sm/)
    })

    it('transport-option-card.tsx — 최상위 카드에 shadow-sm 포함', () => {
      expect(TRANSPORT).toMatch(/bg-card\/50 border border-border[^'"]*shadow-sm/)
    })
  })
})

// ---------------------------------------------------------------------------
// T-THEME-13 — order-form 5파일 토큰화 잔여 해소 (D-017, PR-7, P0)
// ---------------------------------------------------------------------------

describe('F1 order-form 5파일 토큰화 (T-THEME-13, PR-7)', () => {
  const ORDER_FORM_DIR =
    '../components/dashboard-preview/ai-register-main/order-form'
  const FILES = {
    'company-manager-section': readFileSync(
      resolve(__dirname, `${ORDER_FORM_DIR}/company-manager-section.tsx`),
      'utf8',
    ),
    'location-form': readFileSync(
      resolve(__dirname, `${ORDER_FORM_DIR}/location-form.tsx`),
      'utf8',
    ),
    'cargo-info-form': readFileSync(
      resolve(__dirname, `${ORDER_FORM_DIR}/cargo-info-form.tsx`),
      'utf8',
    ),
    'estimate-distance-info': readFileSync(
      resolve(__dirname, `${ORDER_FORM_DIR}/estimate-distance-info.tsx`),
      'utf8',
    ),
    'register-success-dialog': readFileSync(
      resolve(__dirname, `${ORDER_FORM_DIR}/register-success-dialog.tsx`),
      'utf8',
    ),
  }
  const ESTIMATE_INFO_CARD = readFileSync(
    resolve(__dirname, `${ORDER_FORM_DIR}/estimate-info-card.tsx`),
    'utf8',
  )

  /**
   * 주석(JSDoc) 영역은 테스트 범위에서 제외하고 **실 코드 라인**만 검사한다.
   * D-015 알파 패턴 원칙 — 주석 내 REQ-DASH3-* 레퍼런스는 보존.
   */
  function stripComments(src: string): string {
    return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')
  }

  describe('REQ-011 확장 (D-017) — 5파일 다크 하드코딩 제거', () => {
    const ALL_FILES = Object.entries(FILES)

    it.each(ALL_FILES)(
      '%s — bg-white 알파 하드코딩 0건 (실 코드)',
      (_name, src) => {
        expect(stripComments(src)).not.toMatch(/bg-white\/\d+/)
      },
    )
    it.each(ALL_FILES)(
      '%s — border-white 알파 하드코딩 0건 (실 코드)',
      (_name, src) => {
        expect(stripComments(src)).not.toMatch(/border-white\/\d+/)
      },
    )
    it.each(ALL_FILES)(
      '%s — text-white 알파 하드코딩 0건 (실 코드)',
      (_name, src) => {
        expect(stripComments(src)).not.toMatch(/text-white\/\d+/)
      },
    )
    it.each(ALL_FILES)(
      '%s — text-white solid 하드코딩 0건 (gradient CTA 예외 제외, 실 코드)',
      (_name, src) => {
        const code = stripComments(src)
        const solidMatches = code.match(/text-white(?![a-z/-])/g) || []
        const gradientContext =
          (code.match(
            /text-white[^;"\n]*from-purple-600|from-purple-600[^;"\n]*text-white/gs,
          ) || []).length
        expect(solidMatches.length).toBe(gradientContext)
      },
    )
    it.each(ALL_FILES)(
      '%s — bg-gray-9* 하드코딩 0건 (실 코드)',
      (_name, src) => {
        expect(stripComments(src)).not.toMatch(/bg-gray-9\d+/)
      },
    )
    it.each(ALL_FILES)(
      '%s — text-gray-[234]00 하드코딩 0건 (실 코드)',
      (_name, src) => {
        expect(stripComments(src)).not.toMatch(/text-gray-[234]00/)
      },
    )
  })

  describe('REQ-011 확장 — 토큰 사용 확인', () => {
    it('company-manager-section.tsx — bg-card/50 + border-border + text-foreground + text-muted-foreground 사용', () => {
      expect(FILES['company-manager-section']).toMatch(/bg-card\/50/)
      expect(FILES['company-manager-section']).toMatch(/border-border/)
      expect(FILES['company-manager-section']).toMatch(/text-foreground/)
      expect(FILES['company-manager-section']).toMatch(/text-muted-foreground/)
    })
    it('location-form.tsx — bg-card/50 + border-border + text-foreground + text-muted-foreground 사용', () => {
      expect(FILES['location-form']).toMatch(/bg-card\/50/)
      expect(FILES['location-form']).toMatch(/border-border/)
      expect(FILES['location-form']).toMatch(/text-foreground/)
      expect(FILES['location-form']).toMatch(/text-muted-foreground/)
    })
    it('cargo-info-form.tsx — bg-card/50 + border-border + text-foreground + text-muted-foreground 사용', () => {
      expect(FILES['cargo-info-form']).toMatch(/bg-card\/50/)
      expect(FILES['cargo-info-form']).toMatch(/border-border/)
      expect(FILES['cargo-info-form']).toMatch(/text-foreground/)
      expect(FILES['cargo-info-form']).toMatch(/text-muted-foreground/)
    })
    it('estimate-distance-info.tsx — text-foreground + text-muted-foreground 사용', () => {
      expect(FILES['estimate-distance-info']).toMatch(/text-foreground/)
      expect(FILES['estimate-distance-info']).toMatch(/text-muted-foreground/)
    })
    it('register-success-dialog.tsx — bg-card/50 + border-border + text-foreground + text-muted-foreground + bg-muted/50 사용', () => {
      expect(FILES['register-success-dialog']).toMatch(/bg-card\/50/)
      expect(FILES['register-success-dialog']).toMatch(/border-border/)
      expect(FILES['register-success-dialog']).toMatch(/text-foreground/)
      expect(FILES['register-success-dialog']).toMatch(/text-muted-foreground/)
      expect(FILES['register-success-dialog']).toMatch(/bg-muted\/50/)
    })
    it('cargo-info-form.tsx — bg-card (펼침 패널, bg-gray-900 대체) 사용', () => {
      // 펼침 패널 배경: bg-gray-900 → bg-card 로 치환
      expect(stripComments(FILES['cargo-info-form'])).toMatch(/bg-card(?![\w/-])/)
    })
    it('register-success-dialog.tsx — bg-muted/70 hover 사용', () => {
      expect(FILES['register-success-dialog']).toMatch(/bg-muted\/70/)
    })
  })

  describe('D-010 브랜드 예외 — estimate-info-card gradient 유지 (regression guard)', () => {
    it('estimate-info-card.tsx — gradient CTA (from-purple-600 to-blue-600) 유지', () => {
      const code = stripComments(ESTIMATE_INFO_CARD)
      expect(code).toMatch(/from-purple-600/)
      expect(code).toMatch(/to-blue-600/)
    })
    it('estimate-info-card.tsx — gradient 위 text-white solid 유지 (D-010)', () => {
      const code = stripComments(ESTIMATE_INFO_CARD)
      // gradient CTA 컨텍스트에서만 text-white 허용
      expect(code).toMatch(
        /from-purple-600[^;"\n]*to-blue-600[^;"\n]*text-white|text-white[^;"\n]*from-purple-600[^;"\n]*to-blue-600/s,
      )
    })
  })
})
