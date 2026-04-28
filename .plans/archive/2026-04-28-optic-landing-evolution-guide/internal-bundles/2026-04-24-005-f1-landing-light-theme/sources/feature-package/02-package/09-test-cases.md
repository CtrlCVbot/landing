# 09. Test Cases — F1 라이트 모드 전환 인프라

> 각 REQ / NFR / SM 을 검증하는 테스트 케이스. SSOT for Red-Green-Improve 사이클.
> Test runner: Vitest. A11y: `@axe-core/react` + `jest-axe`.
> 신규 파일: `src/__tests__/light-theme.test.tsx`.

---

## TC 목록 요약

| TC | 제목 | REQ/NFR/SM | TASK | 유형 |
|----|------|-----------|------|------|
| TC-F1-01 | globals.css 토큰 이중화 검증 | REQ-001/002/003, SM-4, NFR-009 | T-THEME-01 | 단위 + 통합 |
| TC-F1-02 | ThemeProvider + SSR hydration | REQ-005/006, NFR-004/005, SM-5 | T-THEME-02 | 통합 (SSR) |
| TC-F1-03 | next-themes 번들 증분 | REQ-004, NFR-003, SM-3 | T-THEME-03 | 회귀 측정 |
| TC-F1-04 | ThemeToggle 컴포넌트 + navbar 배치 | REQ-007/008/009, NFR-001 | T-THEME-04 | 단위 + 통합 (axe) |
| TC-F1-05 | Hero + Features 라이트 axe | REQ-010, NFR-001/009, SM-1/9 | T-THEME-05 | 통합 (axe + 스냅샷) |
| ~~TC-F1-06~~ | ~~Pricing + Testimonials 라이트 axe~~ **⚠️ SKIPPED (D-003)** | — | — | — |
| TC-F1-07 | Footer + Shared UI 라이트 axe | REQ-010/012, NFR-001 | T-THEME-07 | 통합 (axe + 스냅샷) |
| TC-F1-08 | Dash-Preview 라이트 axe | REQ-011, NFR-001 | T-THEME-08 | 통합 (axe + 스냅샷) |
| TC-F1-09 | 다크 하드코딩 3중 grep 0건 | REQ-014, SM-4 | 전 TASK | 회귀 검증 |
| TC-F1-10 | 기존 다크 스냅샷 회귀 0 | REQ-003 수용 기준 | 전 TASK | 스냅샷 |

---

## TC-F1-01 — globals.css 토큰 이중화 검증

**목적**: 토큰 이중화 구조 정합 + 라이트 팔레트 WCAG AA 4.5:1 확보.

### 검증

```bash
# 구조 검증
grep -n "var(--landing-" src/app/globals.css           # 19 라인 기대
grep -n "^:root" src/app/globals.css                   # 1 결과 (라이트 블록)
grep -n "\[data-theme=\"dark\"\]" src/app/globals.css  # 1 결과 (다크 블록)

# WCAG AA 대비 검증 (axe color-contrast)
pnpm test src/__tests__/light-theme.test.tsx -- -t "globals.css palette"
```

### 테스트 코드 골격

```tsx
describe('globals.css palette', () => {
  it(':root 라이트 팔레트가 WCAG AA 4.5:1 대비 충족', async () => {
    document.documentElement.setAttribute('data-theme', 'light')
    const { container } = render(<TestGrid />)  // 19개 변수 모두 사용하는 TestGrid
    const results = await axe(container, { rules: { 'color-contrast': { enabled: true } } })
    expect(results).toHaveNoViolations()
  })
})
```

### 수용 기준 (PRD §5 REQ-001~003)
- 19개 변수 모두 `var(--landing-*)` 간접화
- `:root` + `[data-theme="dark"]` 블록 둘 다 19개 변수 완비
- WCAG AA 4.5:1 (텍스트) / ≥ 3:1 (UI) 충족

---

## TC-F1-02 — ThemeProvider + SSR hydration

**목적**: `<html suppressHydrationWarning>` + ThemeProvider 4속성 + Provider 순서 + 콘솔 경고 0건.

### 검증 조합 (4개)

| # | cookie | localStorage | OS 설정 | 기대 초기 테마 |
|---|:------:|:------------:|:-------:|:-------------:|
| a | 없음 | 없음 | light | light |
| b | 없음 | 없음 | dark | dark |
| c | 없음 | `theme=dark` 있음 | light | dark (localStorage 우선) |
| d | 없음 | `theme=light` 있음 | dark | light (localStorage 우선) |

### 테스트 코드 골격

```tsx
describe('ThemeProvider SSR', () => {
  it.each(scenarios)('초기 테마 결정 (%o)', async ({ localStorage: ls, os, expected }) => {
    if (ls) window.localStorage.setItem('theme', ls)
    Object.defineProperty(window, 'matchMedia', { value: mockMatchMedia(os) })
    const { container } = render(<RootLayout><TestPage /></RootLayout>)
    expect(document.documentElement.getAttribute('data-theme')).toBe(expected)
    expect(spyConsoleError).not.toHaveBeenCalledWith(expect.stringContaining('hydration'))
  })
})
```

### 수용 기준
- NFR-004: Hydration 경고 0건
- NFR-005: 전환 지연 ≤ 100ms

---

## TC-F1-03 — next-themes 번들 증분

**목적**: NFR-003 번들 증분 ≤ 2 kB gzipped.

### 검증

```bash
# 베이스라인 측정 (T-THEME-03 전)
pnpm build 2>&1 | tee base-bundle.log

# next-themes 설치 후 재측정
pnpm install
pnpm build 2>&1 | tee new-bundle.log

# 증분 계산 (gzipped 기준)
diff base-bundle.log new-bundle.log
```

### 수용 기준
- SM-3: 번들 증분 ≤ 2 kB gzipped
- next-themes 단독 ~1.5 kB + ThemeToggle 포함 ≤ 2 kB

---

## TC-F1-04 — ThemeToggle + navbar 배치

### 검증 항목

- `mounted` state 방어 (`useEffect`로 setMounted, mounted false일 때 placeholder)
- `aria-label="테마 전환"` 존재
- lucide-react Sun/Moon 24×24
- navbar 우측 상단 배치 (5 뷰포트 확인)
- axe 라이트 모드 navbar 0 violations

### 테스트 코드 골격

```tsx
describe('ThemeToggle', () => {
  it('초기 렌더는 placeholder (mounted false)', () => {
    const { container } = render(<ThemeToggle />)
    expect(container.querySelector('svg')).toBeNull()
  })

  it('mount 후 Sun/Moon 아이콘 렌더', async () => {
    const { container } = render(<ThemeToggle />)
    await waitFor(() => expect(container.querySelector('svg')).toBeInTheDocument())
  })

  it('aria-label 존재', () => {
    const { getByRole } = render(<ThemeToggle />)
    expect(getByRole('button', { name: '테마 전환' })).toBeInTheDocument()
  })
})

describe('Navbar a11y', () => {
  it.each(['light', 'dark'])('%s 모드 axe violations 0', async (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
    const { container } = render(<Header />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

---

## TC-F1-05 ~ TC-F1-08 — 섹션별 axe + 스냅샷

**공통 구조**:

```tsx
const sections = ['Hero', 'Features', 'Pricing', 'Testimonials', 'Footer', 'DashboardPreview']
const themes = ['light', 'dark']
const viewports = [1440, 1280, 1024, 768, 390]

describe.each(sections)('%s — light theme a11y', (sectionName) => {
  it.each(themes)('%s axe violations 0', async (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
    const Section = sectionComponents[sectionName]
    const { container } = render(<ThemeProvider forcedTheme={theme}><Section /></ThemeProvider>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it.each(viewports)('%ipx snapshot (light)', (width) => {
    setViewport(width)
    document.documentElement.setAttribute('data-theme', 'light')
    const { container } = render(<Section />)
    expect(container).toMatchSnapshot()
  })
})
```

**스냅샷 매트릭스**: 6 섹션 × 2 테마 × 5 뷰포트 = **60 스냅샷** (SM-10).
**axe 매트릭스**: 6 섹션 × 1 라이트 = **6 건** (SM-10).

### PR별 커버리지 분할

| PR | 포함 TC | axe 범위 | 스냅샷 |
|:-:|---------|---------|-------|
| PR-3 | TC-F1-05 | Hero + Features | 20 (2섹션 × 2테마 × 5뷰포트) |
| PR-4 | TC-F1-06 | Pricing + Testimonials | 20 (해당 섹션 존재 시) |
| PR-5 | TC-F1-07 | Footer + Shared UI | 10 (footer 단독) |
| PR-6 | TC-F1-08 | Dash-Preview | 10 (dash-preview 단독) |

---

## TC-F1-09 — 다크 하드코딩 3중 grep 0건

**목적**: REQ-014 3중 grep 전수 통과.

### 검증 스크립트

```bash
# (1) 기본 문자열
grep -rn "bg-white\|text-white\|from-gray\|to-gray\|border-gray\|bg-black\|bg-slate\|border-white\|ring-gray" src/

# (2) cn/clsx 동적 클래스
grep -rn "cn({ *'bg-white\|cn({ *'text-white\|cn({ *'from-gray\|cn({ *'border-gray" src/

# (3) template literal
grep -rn '`.*\${.*}.*bg-white\|`.*\${.*}.*text-white' src/
```

### 수용 기준
- 전 TASK 완료 시 3 명령 모두 **0 결과**
- 의도적 예외 (예: favicon 생성 코드 내부 하드코딩 색상) 발견 시 decision-log D-NNN 등록

---

## TC-F1-10 — 기존 다크 스냅샷 회귀 0

**목적**: REQ-003 수용 기준 — 다크 팔레트 이관 시 기존 다크 렌더 100% 일치.

### 검증

```bash
# 기존 스냅샷 갱신 없이 테스트 실행
pnpm test --no-update-snapshot
```

### 수용 기준
- 기존 다크 렌더 스냅샷 100% 일치
- 실패 시: 다크 팔레트 이관 값 drift 발생 → 원인 추적 후 수정

---

## 공통 실행

```bash
# 전체 테스트
pnpm test

# 커버리지
pnpm test --coverage

# a11y 전용 (watch)
pnpm test:watch src/__tests__/light-theme.test.tsx
```

**목표 (SM-10)**: 60 스냅샷 + 6 jest-axe + 1 SSR = 67 tests, 0 failures.

**통과 조건**: 전 TC PASS + 3중 grep 0건 + `pnpm build` 성공 + `pnpm typecheck` 0 errors.
