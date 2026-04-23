# 02. UI Spec — F1 라이트 모드 전환 인프라

> UI 변경 명세. 스타일 토큰 치환은 [01-requirements.md REQ-010~012](./01-requirements.md#1-functional-requirements-14건) 참조.
> 상세 결정 근거: [`../00-context/03-design-decisions.md`](../00-context/03-design-decisions.md) SSOT.

---

## 1. ThemeToggle 컴포넌트 (REQ-007~009)

### 위치

`src/components/ThemeToggle.tsx` (신규)

### Props

```tsx
type ThemeToggleProps = {
  className?: string
}
```

### 구조

```tsx
'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className={cn('w-10 h-10', className)} aria-hidden />  // placeholder
  }

  return (
    <button
      type="button"
      aria-label="테마 전환"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'p-2 rounded-md',
        'hover:bg-accent/50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'transition-colors',
        className,
      )}
    >
      {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
    </button>
  )
}
```

### 스타일 토큰

| 토큰 | 용도 |
|------|------|
| `bg-accent/50` | hover 배경 |
| `ring-ring` | focus ring |
| `text-foreground` | 아이콘 색상 (자동 상속) |

### 접근성

- `aria-label="테마 전환"` (한국어 landing 고정)
- focus-visible ring (keyboard navigation)
- `<button type="button">` (form submit 방지)
- `mounted` state placeholder `aria-hidden` (SSR 단계 screen reader 간섭 방지)

---

## 2. Navbar 통합 (REQ-008)

### 위치

`src/components/sections/header.tsx` 우측 상단 액션 영역.

### 뷰포트별 배치

| 뷰포트 | 배치 |
|--------|------|
| 1440/1280 | 우측 끝 primary 액션 버튼 오른쪽 (또는 왼쪽, 기존 레이아웃에 맞춤) |
| 1024 | 1440/1280과 동일 |
| 768/390 | hamburger menu와 동일 line 우측 끝 (또는 menu 내부 — 구현 시 전수 조사 결정) |

### 레이아웃 패턴 (예시)

```tsx
// header.tsx 내부
<nav className="flex items-center justify-between">
  <Logo />
  <div className="hidden md:flex items-center gap-4">
    <NavLinks />
    <CtaButton />
    <ThemeToggle />  {/* 신규 */}
  </div>
  <div className="md:hidden flex items-center gap-2">
    <ThemeToggle />  {/* 신규, 모바일 hamburger 왼쪽 */}
    <HamburgerMenu />
  </div>
</nav>
```

**주의**: 위는 예시. 실제 기존 `header.tsx` 구조 확인 후 최소 침습 적용. 768/390에서 hamburger menu와 상대 위치는 구현 시 전수 조사 후 확정 (PRD §6.5).

---

## 3. 섹션별 토큰 치환 (REQ-010~012)

### 치환 맵

| Before (다크 하드코딩) | After (토큰) | WCAG 검증 |
|----------------------|-------------|----------|
| `bg-white/5` | `bg-card/50` 또는 `bg-muted/50` | 라이트 모드 4.5:1 |
| `text-white` | `text-foreground` | 라이트 모드 4.5:1 |
| `from-gray-900/50` | `from-background/50` | - |
| `to-gray-900/50` | `to-background/50` | - |
| `border-gray-800` | `border-border` | 3:1 (UI) |
| `bg-gray-900` | `bg-card` | 4.5:1 (자식 텍스트) |
| `bg-black` | `bg-background` | 4.5:1 |
| `bg-slate-*` | `bg-card` 또는 `bg-muted` | 4.5:1 |
| `text-gray-300` | `text-muted-foreground` | **4.5:1 검증 전제** |
| `text-gray-400` | `text-muted-foreground` | **4.5:1 검증 전제** |
| `border-white` | `border-border` | 3:1 |
| `ring-gray-*` | `ring-ring` | 3:1 |

### PR별 대상 파일

- **PR-1** (T-THEME-01): `src/app/globals.css` (토큰 이중화 자체)
- **PR-2** (T-THEME-04): `src/components/sections/header.tsx` + `src/components/ThemeToggle.tsx`
- **PR-3** (T-THEME-05): `src/components/sections/hero.tsx`, `features.tsx`
- **PR-4** (T-THEME-06): `pricing.tsx`, `testimonials.tsx` (존재 확인)
- **PR-5** (T-THEME-07): `footer.tsx`, `cta.tsx`, `integrations.tsx`, `problems.tsx`, `products.tsx`, `ui/*.tsx`, `shared/*.tsx`
- **PR-6** (T-THEME-08, F5 merge 후): dash-preview 7파일

---

## 4. Palette Specification (REQ-002, REQ-003)

### 라이트 팔레트 (`:root`) — 예시값 (PR-1 토큰 매핑 결정표에서 최종 확정)

```css
:root {
  --landing-background: #ffffff;
  --landing-foreground: #0a0a0a;
  --landing-card: #ffffff;
  --landing-card-foreground: #0a0a0a;
  --landing-muted: #f4f4f5;
  --landing-muted-foreground: #52525b;    /* WCAG AA 4.5:1 vs --landing-background */
  --landing-accent: #f4f4f5;
  --landing-accent-foreground: #18181b;
  --landing-border: #e4e4e7;
  --landing-input: #e4e4e7;
  --landing-ring: #a1a1aa;
  --landing-primary: #18181b;
  --landing-primary-foreground: #fafafa;
  --landing-secondary: #f4f4f5;
  --landing-secondary-foreground: #18181b;
  --landing-destructive: #ef4444;
  --landing-destructive-foreground: #fafafa;
  --landing-popover: #ffffff;
  --landing-popover-foreground: #0a0a0a;
}
```

### 다크 팔레트 (`[data-theme="dark"]`) — 기존 값 이관

```css
[data-theme="dark"] {
  --landing-background: #0a0a0a;     /* 기존 @theme inline 다크 값 이관 */
  --landing-foreground: #ffffff;
  /* ... 나머지 18개 */
}
```

**주의**: 예시값. PR-1 에서 토큰 매핑 결정표 (REQ-013) 작성 시 WCAG 검증 기반 최종값 확정.

---

## 5. Non-goals (UI)

- 컴포넌트 레이아웃 변경 (className 치환만, 구조 불변)
- 새 컴포넌트 신규 생성 (ThemeToggle 제외)
- 애니메이션 추가/제거 (`disableTransitionOnChange` 외)
- 아이콘 변경 (Sun/Moon 외)
- 반응형 브레이크포인트 변경

---

## 6. 변경 이력

| 날짜 | 변경 |
|------|------|
| 2026-04-23 | 초안 — `/dev-feature` Phase C 진입. |
