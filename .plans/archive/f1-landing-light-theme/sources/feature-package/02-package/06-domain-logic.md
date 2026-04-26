# 06. Domain Logic — F1 라이트 모드 전환 인프라

> 본 Feature 의 도메인 로직 명세. landing 은 도메인 로직이 최소이며, 본 Feature 는 **UI 테마 상태 관리** 만 도입.

---

## 1. 테마 상태 관리

### 1-1. 상태 소유

- **Owner**: `next-themes` v0.3+ 라이브러리 (ThemeProvider 내부)
- **API**: `useTheme()` hook — `{ theme, setTheme, systemTheme, resolvedTheme }` 반환
- **Persistence**: `localStorage` key `theme` (next-themes 기본값)

### 1-2. 상태 전이

```
초기 (cookie 없음, localStorage 없음)
  ↓
prefers-color-scheme 검출
  ↓ (OS dark)        ↓ (OS light)
theme = "dark"      theme = "light"
  ↓
사용자 토글 클릭
  ↓
setTheme(theme === "dark" ? "light" : "dark")
  ↓
document.documentElement.setAttribute('data-theme', newTheme)
  ↓
localStorage.setItem('theme', newTheme)
  ↓
다음 방문 시: localStorage 우선 (OS 설정 무시)
```

### 1-3. 허용 값

| 값 | 의미 |
|-----|------|
| `"light"` | 라이트 팔레트 강제 |
| `"dark"` | 다크 팔레트 강제 |
| `"system"` | OS `prefers-color-scheme` 추종 |

본 Feature 는 `defaultTheme="system"` + `enableSystem` 으로 시작. 사용자가 토글 클릭 시 "light" 또는 "dark"로 명시적 전이.

### 1-4. 렌더 결정

```
data-theme 속성 → CSS 변수 해석 → 컴포넌트 className 토큰 매핑
```

- `:root` 라이트 팔레트가 기본 (data-theme 속성 없거나 "light" 시 활성)
- `[data-theme="dark"]` 다크 팔레트가 오버라이드

---

## 2. 의존성 다이어그램

```
User 토글 클릭
   ↓
<ThemeToggle> (onClick)
   ↓
setTheme() ← next-themes/useTheme()
   ↓
<ThemeProvider> (attribute="data-theme")
   ↓
document.documentElement.setAttribute('data-theme', ...)
   ↓
CSS 변수 재해석 (--landing-*)
   ↓
@theme inline (--color-*) → Tailwind utility class 재계산
   ↓
모든 컴포넌트 재렌더 (disableTransitionOnChange로 transition 0)
```

---

## 3. 불변 규칙

### 3-1. SSR 안정성

- `<html suppressHydrationWarning>` 필수 (REQ-006)
- ThemeToggle `mounted` state 방어 필수 (REQ-007)
- Provider 순서: `ThemeProvider > MotionProvider > children` 고정

### 3-2. 토큰 해석

- 모든 landing 전역 컴포넌트는 `--landing-*` 변수를 참조하는 Tailwind 토큰 클래스 사용
- 다크 하드코딩 클래스 (`bg-white/5`, `text-white`, `bg-black` 등) 신규 추가 금지 (REQ-010, REQ-014)
- `tailwind.config.ts` 참조 금지 (Tailwind 4 — `@theme inline` 대체)

### 3-3. 접근성

- 라이트/다크 양쪽 WCAG AA 4.5:1 (텍스트) / 3:1 (UI) 확보
- `prefers-reduced-motion` 블록 유지 (기존 `@layer base`, NFR-006)
- `disableTransitionOnChange` 로 reduced-motion 환경 자동 보호

---

## 4. Out-of-scope

- 다국어 i18n (aria-label "테마 전환" 한국어 고정)
- 3번째 테마 (high-contrast 등) 실제 값 정의 — 구조만 확장 가능하게
- 컴포넌트별 개별 테마 오버라이드 (모든 컴포넌트 단일 data-theme 준수)
- Server Action / API 연동 (클라이언트 단독)

---

## 5. 변경 이력

| 날짜 | 변경 |
|------|------|
| 2026-04-23 | 초안 — 테마 상태 관리 로직 명세. |
