# PRD: F1 라이트 모드 전환 인프라 (landing 전역)

> **Epic**: [EPIC-20260422-001 dash-preview Phase 4](../../epics/20-active/EPIC-20260422-001/00-epic-brief.md) (Phase A, F1)
> **자매 Feature**: [IDEA-20260423-001 F5 UI 잔재 정리](../../ideas/00-inbox/IDEA-20260423-001.md) (Phase A 병렬), F2 Mock 재설계 · F3 옵션↔요금 파생 · F4 레이아웃+HitArea (Phase B/C)
> **Feature slug**: `f1-landing-light-theme`
> **IDEA**: [IDEA-20260423-002](../../ideas/00-inbox/IDEA-20260423-002.md)
> **Draft**: [01-draft.md](./01-draft.md)
> **Routing metadata**: [07-routing-metadata.md](./07-routing-metadata.md)
> **작성일**: 2026-04-23
> **작성자**: `plan-prd-writer` (Phase A Step 6)
> **상태**: draft (PCC 리뷰 + 사용자 승인 대기)
> **schema**: PRD 10 섹션 표준

---

## 1. Overview

landing 사이트 전역에 **라이트/다크 양 팔레트** 와 **사용자 전환 경로** (시스템 follow + 수동 토글) 를 도입한다. 

현재 `src/app/globals.css` 의 `@theme inline` 블록은 다크 단일 팔레트 (19 개 CSS 변수) 로 하드코딩되어 `prefers-color-scheme: light` 사용자 · 주간 환경 · 밝은 디스플레이 컨텍스트를 수용하지 못한다. 

본 Feature 는 

① CSS 변수 토큰 이중화 (Tailwind 4 `@theme inline` 내부 + `[data-theme="dark"]` 런타임 오버라이드), 

② `next-themes` 기반 ThemeProvider 주입, 

③ landing 전역 (hero · features · pricing · testimonials · footer · navbar + dash-preview 7 파일 + shared UI) 의 다크 하드코딩 클래스 토큰 치환, 

④ navbar 우상단 Sun/Moon 토글 UI 를 6 개 PR 로 분할해 단계적으로 전달한다.

Epic §2 성공 지표 4 (landing 전역 라이트/다크 양 팔레트 지원 + 전환 경로 + axe-core 0 violations) 를 **단독 충족** 하는 자식 Feature 로서, Phase A (2026-04-23 ~ 2026-05-06) 기간 동안 F5 (UI 잔재 정리) 와 **병렬 실행** 된다. F1 을 Kill 하면 Epic Phase A 목표 (M-Epic-1, 2026-05-06) 달성 경로 자체가 소멸한다 (Epic Children §1 F1 RICE 근거).

---

## 2. Problem Statement

### 현재 상태 (As-is)

`src/app/globals.css` 의 `@theme inline { ... }` 블록은 단일 다크 팔레트 하드코딩:

```css
@theme inline {
  --color-background: #0a0a0a;   /* 다크 고정 */
  --color-foreground: #ffffff;   /* 다크 고정 */
  --color-card: oklch(0.15 0.01 260 / 0.5);  /* 다크 고정 */
  /* ... 19 개 변수 모두 다크 값 하드코딩 */
}
```

컴포넌트 층은 `bg-white/5`·`text-white`·`from-gray-900/50`·`border-gray-800`·`bg-black`·`bg-slate-*` 등 **다크 전용** 유틸 클래스가 수십 파일에 걸쳐 하드코딩되어 있다 (IDEA §1, §3-C). `ThemeProvider` 는 존재하지 않으며 (`src/app/layout.tsx` 에 `MotionProvider` 만 존재), 테마 전환 트리거 UI 도 없다.

### 이슈 (Why this matters)

IDEA §1 이슈 [1] + Phase 3 archive 직후 사용자 피드백 (2026-04-22 "라이트 모드가 없어서 사용하기 어렵다"):

1. **접근성 WCAG AA 후퇴**: `prefers-color-scheme: light` 환경 사용자 (주간 창가 · 밝은 모니터) 에게 대비 과도 + 눈부심 유발. axe-core 라이트 모드 검증 경로 자체가 부재 — landing 전역 기준 0 violations 달성 불가.
2. **사용자 선호 대응 부재**: 주간/야간 환경 구분 · 개인 취향 · 야간 근무자 등의 접근성 선택을 1 차 signal (OS `prefers-color-scheme`) 로 반영하지 못함.
3. **차기 Epic 디자인 시스템 부채 누적**: 다크 하드코딩 클래스가 landing 전반에 쌓여 있어 향후 토큰 기반 디자인 시스템 도입 시 광범위 마이그레이션 비용 발생 (IDEA §2-3).

### Epic 맥락

Epic Brief §1 은 "충실도·신뢰성·접근성을 Round 2 로 끌어올리는 것" 을 목적으로 하며, 라이트 모드 부재는 5 영역 피드백 (라이트 모드 부재·데이터 불일치·레이아웃 밀도·상호작용 정확도·UI 잔재) 중 **접근성 영역** 의 핵심 gap 이다. F1 은 이 gap 을 단독으로 닫는 유일한 자식 Feature 다.

---

## 3. Goals & Non-Goals

### Goals

> **Epic §2 성공 지표 4 (직접 인용, IMP-AGENT-011 준수)**:
> **지표 4 — 라이트/다크 양 팔레트 지원 + 전환 경로**: `prefers-color-scheme` 또는 토글 기준으로 라이트 모드 전환 시 **landing 사이트 전역** (hero · features · pricing · footer · navbar · dash-preview 포함) 모든 컴포넌트가 식별 가능한 대비 확보. axe-core 라이트 모드 0 violations.

본 F1 이 기여하는 SMART 목표:

- **G1 — axe-core 라이트 모드 landing 전역 0 violations** (Epic §2 지표 4 직접 대응): 5 개 뷰포트 (1440/1280/1024/768/390) × 라이트·다크 2 개 테마 × 6 개 섹션 (hero · features · pricing · testimonials · footer · navbar) + dash-preview 7 파일 모두 WCAG AA 기준 0 violations.
- **G2 — FOUC (Flash of Unstyled Content) 0 건**: SSR hydration 3 중 방어 (`suppressHydrationWarning` + `disableTransitionOnChange` + `mounted` state) 로 최초 진입 시 테마 전환 flash 프레임 0. Chrome DevTools Performance recording 으로 측정.
- **G3 — 번들 크기 증분 ≤ 2 kB gzipped**: `next-themes` (~1.5 kB gzip) + `ThemeToggle` 컴포넌트 (예상 ~0.3 kB) = 총 ≤ 2 kB. `next build` 출력 전후 비교.
- **G4 — landing 전역 다크 하드코딩 클래스 0 건 잔존**: `grep -rn "bg-white\|text-white\|from-gray\|to-gray\|border-gray\|bg-black\|bg-slate\|border-white\|ring-gray" src/` 결과 0 건 (토큰 매핑 결정표 (R14, Draft §3-C) 에 등록된 값 치환 완료).
- **G5 — 6 개 PR 순차 merge 완료**: PR-1 ~ PR-6 각 PR 당 axe-core 라이트 모드 0 violations 검증 통과 + 머지 충돌 없이 Phase A 내 완료.

### Non-Goals (Out-of-scope)

Epic Brief §3 + IDEA §3 Out-of-scope + Draft §3-6 Out-of-scope 승계 (중복 제거):

- 토큰 치환을 계기로 한 **대규모 디자인 시스템 리팩토링** — 토큰 값·스케일 재설계 미포함, 차기 Epic 후보 (Epic §3).
- **landing 이외 영역** (관리자 · 대시보드 · docs · 별도 앱) 의 라이트 모드 대응 (IDEA §3, Epic §3).
- **다국어 (i18n)** 연동 (Epic §3).
- **모바일 전용 팔레트** 분리 (Phase 5+ 후보).
- **브랜드 컬러 · 로고** 등 팔레트 외 자산의 라이트/다크 분기 (별도 Theme 후보).
- **3 번째 테마** (예: high-contrast 변형) 도입 — 본 F1 에서는 **확장 가능한 구조** 만 확립 (`[data-theme="high-contrast"]` 세트 추가 가능한 CSS 변수 이중화 패턴), 실제 3 번째 테마 값 정의는 차기 Epic 연동 (IDEA §4-4).
- `**autoDispatch` 로직 · Mock 스키마 재설계** 등 F2/F3/F4/F5 범위 (Epic Children §1).
- **SSR/SSG 전환** (Epic §3 — 현재 CSR 가정 유지).

---

## 4. User Stories

1. **As a** `prefers-color-scheme: light` 환경 (주간 창가 · 밝은 모니터) 의 landing 방문자,
  **I want** landing 전체 페이지 (hero · features · pricing · testimonials · footer · navbar · dash-preview) 가 내 시스템 선호에 맞춰 라이트 팔레트로 자동 표시되기를,
   **so that** 과도한 대비 없이 편안하게 콘텐츠를 읽고 Optic 가치 제안을 이해할 수 있다.
2. **As a** 기존 다크 환경 Phase 3 베타 사용자,
  **I want** 시스템 다크 설정이 그대로 유지되어 기존 시각 경험을 잃지 않기를,
   **so that** 라이트 모드 도입으로 인한 급격한 UI 변화 없이 기존 사용 패턴을 이어갈 수 있다 (Draft §4-2 근거 3: 기존 다크 사용자 이탈 리스크 0).
3. **As a** 개인 선호로 시스템 설정과 다른 테마를 원하는 방문자,
  **I want** navbar 우측 상단의 Sun/Moon 토글 버튼으로 언제든 테마를 바꿀 수 있기를,
   **so that** 시스템 설정을 바꾸지 않고도 현재 환경에 맞는 시각 경험을 즉시 선택한다 (선택 값은 localStorage 에 저장되어 재방문 시 우선 적용).
4. **As a** 저시력 · 눈부심 민감 · 야간 근무자 등 접근성 제약이 있는 사용자,
  **I want** OS 시스템 설정 (`prefers-color-scheme`) 이 1 차 signal 로 존중되기를,
   **so that** 내 접근성 설정이 웹사이트 수준에서 자동으로 반영되고 (WCAG 2.2 + Apple HIG + Material Design 공통 원칙, Draft §4-2 근거 1), 매번 수동 토글 없이도 편안한 시각 환경을 얻는다.
5. **As a** WCAG AA 접근성을 검증하는 QA,
  **I want** axe-core 가 landing 전역의 라이트 모드 상태에서 0 violations 를 보고하기를,
   **so that** Epic §2 성공 지표 4 (라이트/다크 양 팔레트 + 전환 경로 + 접근성 AA) 가 정량 검증된다.
6. **As a** 후속 Feature (F2 Mock 재설계 · F3 옵션↔요금 파생 · F4 레이아웃) 를 담당하는 개발자,
  **I want** dash-preview 7 개 파일 + landing 전역의 다크 하드코딩 클래스가 토큰 기반 (`bg-card` / `text-foreground` / `border-border` 등) 으로 선행 치환되어 있기를,
   **so that** Phase B/C 작업이 이미 토큰화된 기반 위에서 머지 충돌 없이 수행된다 (Epic Children §2 F1↔F2/F3/F4 `△` 완화).
7. **As a** 향후 3 번째 테마 (high-contrast 변형) 또는 브랜드 팔레트 확장을 고려하는 메인테이너,
  **I want** CSS 변수 2 세트 (`:root` 라이트 + `[data-theme="dark"]` 다크) 구조가 확장 가능한 형태로 확립되기를,
   **so that** `[data-theme="high-contrast"]` 세트를 추가하는 것으로 신규 테마를 도입할 수 있다 (IDEA §4-4 차기 Epic 연동).

---

## 5. Functional & Non-Functional Requirements

### 5.1 Functional Requirements


| ID                                 | 요구사항                                                                                                                                                                                                                                      | 우선순위 | 수용 기준                                                                                                                                                                                                                          |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **REQ-f1-landing-light-theme-001** | `src/app/globals.css` 의 `@theme inline` 블록 내 19 개 컬러 변수 값을 **CSS 변수 참조** (`var(--landing-*)`) 로 간접화한다                                                                                                                                     | Must | `@theme inline { --color-background: var(--landing-background); ... }` 형태로 19 개 모두 간접화. Tailwind 4 빌드 통과 + 기존 다크 렌더 회귀 0.                                                                                                      |
| **REQ-f1-landing-light-theme-002** | `:root` 블록에 **라이트 팔레트 1 세트** (19 개 `--landing-`* 변수) 를 토큰 매핑 결정표 (R14) 기반으로 신규 정의한다                                                                                                                                                       | Must | 19 개 변수 모두 WCAG AA 대비 비율 ≥ 4.5:1 확보 (텍스트) / ≥ 3:1 확보 (UI 컴포넌트). 각 값은 `@theme inline` 와 별개 `:root` 블록에 위치.                                                                                                                      |
| **REQ-f1-landing-light-theme-003** | `[data-theme="dark"]` 셀렉터 블록에 **다크 팔레트 1 세트** 를 신규 정의 (기존 `@theme inline` 다크 값 이관)                                                                                                                                                        | Must | `[data-theme="dark"] { --landing-background: #0a0a0a; ... }` 19 개. 기존 다크 렌더 시각 회귀 스냅샷 100% 일치.                                                                                                                                 |
| **REQ-f1-landing-light-theme-004** | `next-themes` 라이브러리 (v0.3+, Next.js 15 + React 18 호환) 를 `package.json` dependency 로 추가한다                                                                                                                                                  | Must | `pnpm install next-themes` 후 `pnpm build` 성공 + 번들 증분 ≤ 1.8 kB gzipped (실제 측정).                                                                                                                                                 |
| **REQ-f1-landing-light-theme-005** | `src/app/layout.tsx` 의 `<body>` 내부 최상위에 `<ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>` 래퍼를 추가한다 (`MotionProvider` 와 중첩 — Provider 순서는 `ThemeProvider > MotionProvider > children`) | Must | 4 개 속성 모두 명시. 서버 렌더와 클라이언트 hydration 결과 일치 (React devtools 확인).                                                                                                                                                                |
| **REQ-f1-landing-light-theme-006** | `src/app/layout.tsx` 의 `<html>` 태그에 `suppressHydrationWarning` 속성을 추가한다                                                                                                                                                                   | Must | `<html lang="ko" className={inter.variable} suppressHydrationWarning>` 형태. Next.js dev 콘솔 hydration 경고 0 건.                                                                                                                    |
| **REQ-f1-landing-light-theme-007** | `src/components/ThemeToggle.tsx` (신규) — `useTheme()` hook + Sun/Moon 아이콘 + `mounted` state 방어 컴포넌트를 구현한다                                                                                                                                  | Must | `const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), [])`. 마운트 전에는 아이콘 placeholder (빈 div 24×24). 마운트 후 `theme === 'dark' ? <Sun/> : <Moon/>` 토글. 키보드 포커스 가능 (`<button>` + `aria-label="테마 전환"`). |
| **REQ-f1-landing-light-theme-008** | `ThemeToggle` 을 landing navbar 의 **우측 상단** 에 배치한다                                                                                                                                                                                         | Must | navbar 컴포넌트 (전수 조사로 위치 확정 — Draft §4-4 근거) 의 우측 끝 액션 영역에 sticky 노출. 1440 / 1280 / 1024 / 768 / 390 5 뷰포트에서 가시성 확인.                                                                                                             |
| **REQ-f1-landing-light-theme-009** | Sun / Moon 아이콘은 `lucide-react` 의 `Sun` · `Moon` 컴포넌트를 사용한다 (기존 dep 재사용, Non-Duplication 원칙)                                                                                                                                               | Must | `import { Sun, Moon } from 'lucide-react'`. 아이콘 크기 24×24. 추가 아이콘 라이브러리 도입 금지.                                                                                                                                                  |
| **REQ-f1-landing-light-theme-010** | landing 메인 섹션 (hero · features · pricing · testimonials · footer · navbar) 의 다크 하드코딩 클래스를 토큰 클래스로 전수 치환한다                                                                                                                                 | Must | `grep -rn "bg-white|text-white|from-gray|to-gray|border-gray|bg-black|bg-slate|border-white|ring-gray" src/app/ src/components/` 결과 (shared UI 제외) 에서 landing 메인 섹션 범위 0 건 (PR-2 ~ PR-5 누적 merge 후).                           |
| **REQ-f1-landing-light-theme-011** | dash-preview 7 파일 (`datetime-card.tsx` · `estimate-info-card.tsx` · `settlement-section.tsx` · `transport-option-card.tsx` · `order-form/index.tsx` · `preview-chrome.tsx` · `interactive-tooltip.tsx`) 의 다크 하드코딩 클래스를 토큰 클래스로 치환한다       | Must | 7 파일 내 다크 하드코딩 클래스 0 건. 기존 다크 렌더 시각 회귀 스냅샷 100% 일치. **F5 merge 완료 후** PR-6 로 진행.                                                                                                                                               |
| **REQ-f1-landing-light-theme-012** | shared UI (`src/components/ui/`) 공용 컴포넌트의 다크 하드코딩 클래스를 토큰 클래스로 치환한다                                                                                                                                                                       | Must | `src/components/ui/` 범위 0 건 (PR-5 merge 후). shadcn 호환 alias (기존 `--color-primary` 등) 와 정합.                                                                                                                                     |
| **REQ-f1-landing-light-theme-013** | 토큰 매핑 결정표 (R14) — `(파일 경로 + 라인 + 현재 클래스 → 토큰 클래스 + WCAG 대비 비율)` 전수 작성 — 를 PR-1 에 포함한다                                                                                                                                                     | Must | 매핑 결정표 파일 (마크다운 표) 가 `.plans/features/active/f1-landing-light-theme/00-context/` 또는 PR-1 diff 에 포함. 각 행에 WCAG 4.5:1 (text) / 3:1 (UI) 확인 컬럼.                                                                                   |
| **REQ-f1-landing-light-theme-014** | Tailwind className 내부 **조건부 클래스** (`cn({ 'bg-white/5': isActive })`, `clsx(...)`, template literal 동적 구성) 도 grep 스윕에 포함한다                                                                                                                 | Must | 3 중 grep (기본 문자열 + 이스케이프 + `cn/clsx` 주변 문맥 grep) 수행. PR 리뷰 체크리스트에 명시.                                                                                                                                                          |


### 5.2 Non-Functional Requirements


| ID                                 | 요구사항                                                            | 우선순위   | 수용 기준                                                                                                                                                                                                                      |
| ---------------------------------- | --------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **NFR-f1-landing-light-theme-001** | axe-core 라이트 모드 landing 전역 0 violations (G1 = Epic §2 지표 4)     | Must   | `@axe-core/react` + `jest-axe` 기반 회귀 테스트가 6 개 섹션 (hero · features · pricing · testimonials · footer · navbar) + dash-preview 에서 각각 라이트 · 다크 양 테마 검증. WCAG AA (color-contrast · aria-* · keyboard · focus) 0 violations.    |
| **NFR-f1-landing-light-theme-002** | FOUC (Flash of Unstyled Content) 0 건 (G2)                       | Must   | Chrome DevTools Performance recording 으로 최초 진입 시각 + 테마 전환 시각에서 색상 flash 프레임 0. next-themes `<script>` 인라인 주입 + `disableTransitionOnChange` 확인.                                                                             |
| **NFR-f1-landing-light-theme-003** | 번들 크기 증분 ≤ 2 kB gzipped (G3)                                    | Must   | `next build` 출력 비교 — `next-themes` (~~1.5 kB) + `ThemeToggle` (~~0.3 kB) 합계 ≤ 2 kB. PR-1 merge 후 측정치 PR 코멘트로 기록.                                                                                                           |
| **NFR-f1-landing-light-theme-004** | Hydration mismatch 경고 0 건 (G5 보조)                               | Must   | Next.js dev 콘솔 (`pnpm dev --turbopack`) + production (`pnpm build && pnpm start`) 양쪽에서 hydration 경고 0. SSR 초기 렌더 테스트 (R19, Draft §3.5) 가 `defaultTheme="system"` + cookie 없음 + localStorage 값 있음 + OS 다크·라이트 4 개 조합 모두 커버. |
| **NFR-f1-landing-light-theme-005** | 테마 전환 시각 지연 ≤ 100 ms                                            | Should | `disableTransitionOnChange` 로 color transition 을 0 으로 강제한 뒤 사용자 클릭 → DOM `data-theme` 속성 변화 → 시각 반영까지 ≤ 100 ms. Chrome DevTools Performance recording.                                                                     |
| **NFR-f1-landing-light-theme-006** | `prefers-reduced-motion` 존중 — 테마 전환 시 motion 억제                 | Must   | 기존 `globals.css` 의 `@media (prefers-reduced-motion: reduce)` 블록과 정합 (transition 0.01ms 강제). `disableTransitionOnChange` 와 중첩 안전.                                                                                           |
| **NFR-f1-landing-light-theme-007** | Tailwind 4 `@theme inline` + `[data-theme="dark"]` 런타임 오버라이드 정합 | Must   | PR-1 실험 검증 — 최소 1 개 컴포넌트 (예: navbar 배경) 에 토큰 이중화 적용 → 런타임 토글 확인 → 색상 변화 발생 확인. 실패 시 SPIKE-THEME-01 (1 일 budget, IMP-KIT-036) 으로 설계 재검토.                                                                                    |
| **NFR-f1-landing-light-theme-008** | Next.js 15 Turbopack dev 서버 + production 빌드 양쪽 호환               | Must   | `pnpm dev` (turbopack) + `pnpm build && pnpm start` (production) 양쪽에서 테마 토글 정상 동작 + hydration 경고 0.                                                                                                                        |
| **NFR-f1-landing-light-theme-009** | 라이트 팔레트 `text-muted-foreground` 계열 WCAG AA 대비 ≥ 4.5:1           | Must   | 토큰 매핑 결정표 (REQ-013) 에 각 `text-muted-foreground` → 라이트 팔레트 값 매핑 시 background 대비 비율 계산값 기록. 미달 시 값 재선정.                                                                                                                      |
| **NFR-f1-landing-light-theme-010** | 테스트 커버리지 — 라이트 모드 회귀 테스트 + 스냅샷 매트릭스                             | Must   | `light-theme.test.tsx` (신규) — 6 섹션 × 2 테마 × 5 뷰포트 = 60 스냅샷 매트릭스. + axe-core jest-axe 6 건 (섹션별 1 건). + SSR 초기 렌더 테스트 1 건.                                                                                                   |


---

## 6. UX Requirements

### 6.1 트리거 UI 배치

- **위치**: navbar **우측 상단** 액션 영역 (sticky 노출). Draft §4-4 결정 — GitHub · Vercel · Stripe · Linear 공통 관행으로 사용자 학습 곡선 0.
- **거절된 대안**: footer (발견성 부족 — 스크롤 필요) · 전면 자동 전환 (`prefers-reduced-motion` 위반 + 사용자 혼란).

### 6.2 아이콘 + 인터랙션

- **아이콘**: `lucide-react` 의 `Sun` (라이트 모드 표시) · `Moon` (다크 모드 표시). 크기 24×24. Draft §4-5 결정 — 기존 dep 재사용 (golden #13 Non-Duplication) + 사실상 표준 아이콘.
- **현재 테마 표시 규칙**: 현재 테마가 `dark` 면 `<Sun />` (= "라이트로 전환" 기능 암시), 현재 테마가 `light` 면 `<Moon />` (= "다크로 전환" 기능 암시). 일반 사용자 멘탈 모델과 일치.
- **hover 상태**: `bg-accent/50` 오버레이 (기존 `--color-accent` 토큰 활용). 커서 pointer.
- **focus 상태**: `focus-visible:ring-2 ring-ring` (기존 `--color-ring` 토큰 활용). 키보드 포커스 접근 가능.
- **transition**: `disableTransitionOnChange` 로 색상 flash 억제. `prefers-reduced-motion` 존중 (기존 globals.css 블록과 중첩 안전).

### 6.3 초기 로드 플로우

```
최초 방문 (cookie 없음)
    ↓
next-themes 가 <script> 인라인으로 prefers-color-scheme 읽음
    ↓
<html data-theme="dark"> 또는 <html data-theme="light"> 를 서버 렌더 전에 설정
    ↓
서버 렌더 + 클라이언트 hydration 일치 (FOUC 없음)
    ↓
ThemeToggle 마운트 후 Sun/Moon 아이콘 표시

재방문 (localStorage 값 있음)
    ↓
next-themes 가 localStorage 우선 읽음 → data-theme 설정
    ↓
(이하 동일)

수동 토글 클릭
    ↓
next-themes 가 새 값 localStorage 저장 + <html data-theme> 속성 변경
    ↓
CSS 변수 재계산 (disableTransitionOnChange 로 flash 억제)
    ↓
≤ 100 ms 내 시각 반영 (NFR-005)
```

### 6.4 접근성 요구

- **키보드 접근**: `ThemeToggle` 은 `<button>` element. Tab 키로 포커스 가능. Enter · Space 로 토글.
- **스크린리더**: `aria-label="테마 전환"` (한국어 landing 기준). 토글 후 `aria-live="polite"` 로 "라이트 모드로 전환됨" / "다크 모드로 전환됨" 안내 (선택 — 구현 부담 낮으면 포함, 아니면 Phase 5 후보).
- **색상 대비**: 라이트 팔레트 `text-muted-foreground` 계열 WCAG AA ≥ 4.5:1 (NFR-009). axe-core color-contrast 규칙 0 violations.
- `**prefers-reduced-motion`**: 기존 globals.css `@media (prefers-reduced-motion: reduce)` 블록 유지 + `disableTransitionOnChange` 중첩 안전 (NFR-006).

### 6.5 뷰포트 반응


| 뷰포트               | ThemeToggle 가시성 | 비고                                                 |
| ----------------- | --------------- | -------------------------------------------------- |
| 1440 (Desktop XL) | ✅               | navbar 우측 끝                                        |
| 1280 (Desktop)    | ✅               | navbar 우측 끝                                        |
| 1024 (Tablet L)   | ✅               | navbar 우측 끝                                        |
| 768 (Tablet P)    | ✅               | navbar 우측 끝 (hamburger menu 와 정렬 규칙 확정 — 전수 조사 필요) |
| 390 (Mobile)      | ✅               | navbar 우측 끝 (hamburger 왼쪽 또는 안쪽 확정 — 전수 조사 필요)     |


> 768 / 390 에서 hamburger menu 와 `ThemeToggle` 의 상대 위치는 navbar 전수 조사 (PR-2 시점) 에서 확정한다. 현재 landing 의 navbar 구조가 확인 시점에 확정되지 않았으므로 PRD 에서는 "우측 끝" 원칙만 명시.

---

## 7. Technical Considerations

### 7.1 Tailwind 4 아키텍처 정정 (중요)

> **⚠️ IDEA §3-A / §6 에서 언급된 `tailwind.config.ts` 는 본 프로젝트에 존재하지 않는다** (Draft §5.1 기술 정정 사항). 본 프로젝트는 **Tailwind 4** (`tailwindcss ^4.0.0` + `@tailwindcss/postcss`) 기반이며, 테마 정의는 `src/app/globals.css` 의 `@theme inline` 블록이 `tailwind.config.ts` 역할을 대체한다. PRD 는 이 사실을 기준으로 작성된다 — `tailwind.config.ts` 언급 금지.

### 7.2 토큰 이중화 구조

```css
/* src/app/globals.css */
@import 'tailwindcss';
@source "../app/**/*.{ts,tsx,mdx}";
@source "../components/**/*.{ts,tsx}";
@source "../lib/**/*.{ts,tsx}";
@source "../hooks/**/*.{ts,tsx}";

/* 1. Tailwind 4 @theme inline 블록 — CSS 변수 간접화 */
@theme inline {
  --color-background: var(--landing-background);
  --color-foreground: var(--landing-foreground);
  --color-card: var(--landing-card);
  --color-card-foreground: var(--landing-card-foreground);
  --color-border: var(--landing-border);
  /* ... 19 개 변수 모두 var(--landing-*) 참조 */
  --color-primary: var(--color-accent);     /* 기존 shadcn 호환 alias 유지 */
  --color-primary-foreground: var(--color-accent-foreground);
  /* ... */
  --radius-lg: 0.5rem;                       /* 기존 non-color 토큰 유지 */
  --font-sans: 'Inter', 'Pretendard', ...;
}

/* 2. 라이트 팔레트 (기본, :root) */
:root {
  --landing-background: #ffffff;             /* 토큰 매핑 결정표 REQ-013 기반 */
  --landing-foreground: #0a0a0a;
  --landing-card: oklch(0.98 0.005 260 / 0.5);
  --landing-card-foreground: #1f2937;
  --landing-border: #e5e7eb;
  /* ... 19 개 라이트 팔레트 값 (WCAG AA ≥ 4.5:1 확보) */
}

/* 3. 다크 팔레트 (런타임 오버라이드) */
[data-theme="dark"] {
  --landing-background: #0a0a0a;             /* 기존 @theme inline 값 이관 */
  --landing-foreground: #ffffff;
  --landing-card: oklch(0.15 0.01 260 / 0.5);
  --landing-card-foreground: #e5e7eb;
  --landing-border: #1f2937;
  /* ... 19 개 다크 팔레트 값 */
}

/* 4. 기존 @layer base 유지 — prefers-reduced-motion 블록 포함 */
@layer base { /* ... 변경 없음 */ }
```

### 7.3 next-themes 통합

- **버전**: `next-themes ^0.3.0` (또는 최신 stable, Next.js 15 + React 18 공식 호환).
- **layout.tsx Provider 계층**:
  ```tsx
  <html lang="ko" className={inter.variable} suppressHydrationWarning>
    <head>...</head>
    <body>
      <ThemeProvider
        attribute="data-theme"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <MotionProvider>{children}</MotionProvider>
      </ThemeProvider>
    </body>
  </html>
  ```
- **속성 근거**:
  - `attribute="data-theme"`: `class="dark"` 아닌 `data-theme="dark"` 속성 사용 — REQ-003 `[data-theme="dark"]` 셀렉터와 정합.
  - `defaultTheme="system"`: Draft §4-2 확정 — `prefers-color-scheme` 시스템 follow.
  - `enableSystem`: 사용자가 "System" 을 명시 선택 가능.
  - `disableTransitionOnChange`: 전환 flash 억제 (NFR-002, NFR-005).

### 7.4 SSR Hydration 3 중 방어

Draft §4-3 확정. 각 방어 역할 분담:


| 방어                                          | 위치                | 역할                                                                                                                       |
| ------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `<html suppressHydrationWarning>`           | `layout.tsx`      | React 의 hydration 경고 억제 (실제 next-themes 가 `<script>` 동기 주입으로 최종 DOM 일치시킴)                                                |
| `<ThemeProvider disableTransitionOnChange>` | `layout.tsx`      | 전환 시점 CSS transition duration 을 0 으로 강제 → 시각 flash 억제                                                                    |
| `ThemeToggle mounted state`                 | `ThemeToggle.tsx` | `useEffect(() => setMounted(true), [])` — 서버 렌더에는 placeholder (아이콘 미정) → 클라이언트 마운트 후 Sun/Moon 렌더 → 아이콘 자체 mismatch 원천 차단 |


### 7.5 의존성

- **신규 dependency**: `next-themes ^0.3.0` (gzip ~1.5 kB, Next.js 공식 호환).
- **재사용 (Non-Duplication)**: `lucide-react ^0.474.0` (기존) · `@radix-ui/react-slot` (기존) · `class-variance-authority` (기존) · `clsx` + `tailwind-merge` (기존).
- **Provider 중첩**: 기존 `MotionProvider` (src/components/providers/motion-provider) 와 공존 — Provider 순서는 `ThemeProvider > MotionProvider > children` 로 확정 (ThemeProvider 가 바깥). `MotionProvider` 가 테마에 의존하지 않으므로 순서 무관하나 context 생명주기 명확화 차원에서 ThemeProvider 를 바깥에 둔다.

### 7.6 PR 분할 6 개 (Draft §4-6 확정)


| PR                              | 범위                                                          | 사전 조건                               |
| ------------------------------- | ----------------------------------------------------------- | ----------------------------------- |
| **PR-1 Infrastructure**         | REQ-001~006 + REQ-013 (토큰 매핑 결정표) + NFR-007 실험 검증           | — (최우선)                             |
| **PR-2 Navbar + ThemeToggle**   | REQ-007~009 + navbar 자체 토큰 치환                               | PR-1 merge 완료                       |
| **PR-3 Hero + Features**        | hero · features 섹션 토큰 치환 (REQ-010 부분)                       | PR-1 merge 완료 (PR-2 와 병렬 가능)        |
| **PR-4 Pricing + Testimonials** | pricing · testimonials 섹션 토큰 치환 (REQ-010 부분)                | PR-1 merge 완료 (PR-2 / PR-3 과 병렬 가능) |
| **PR-5 Footer + Shared UI**     | footer + `src/components/ui/` 토큰 치환 (REQ-010 나머지 + REQ-012) | PR-1 merge 완료                       |
| **PR-6 Dash-Preview 7 파일**      | dash-preview 7 파일 토큰 치환 (REQ-011)                           | **F5 merge 완료 후** + PR-1 merge 완료   |


### 7.7 최우선 기술 리스크 (PR-1 실험 검증)

**NFR-007 Tailwind 4 `@theme inline` + `[data-theme="dark"]` 정합** 은 최우선 리스크. PR-1 최초 단계에서 최소 1 개 컴포넌트 (예: navbar 배경) 에 토큰 이중화 적용 → 런타임 토글 확인 → 색상 변화 발생 확인. 실패 시 **SPIKE-THEME-01** (1 일 budget, IMP-KIT-036 hard cap) 으로 설계 재검토:

- 대안 1: `darkMode: 'selector'` 스타일 강제 우선순위 활용 (Tailwind 3 패턴 — Tailwind 4 호환 재확인 필요).
- 대안 2: `@layer` 활용으로 `[data-theme="dark"]` 특이성 명시 상승.
- 대안 3: next-themes `attribute="class"` + `.dark` 셀렉터 전환 (Tailwind 4 에서 표준 패턴인지 재확인 필요).

### 7.8 테스트 전략

- **라이트 모드 axe-core 회귀 테스트** (NFR-001 / NFR-010): `src/tests/light-theme.test.tsx` (신규) — 6 섹션 × 2 테마 × 5 뷰포트 = 60 스냅샷 매트릭스 + jest-axe 6 건.
- **SSR 초기 렌더 테스트** (NFR-004): `defaultTheme="system"` + cookie 없음 · localStorage 있음 · OS 다크·라이트 4 개 조합 커버.
- **TDD 원칙** (golden #3): RED → GREEN → IMPROVE. `dev-tdd-guard.js` 활성 상태에서 테스트 선행 작성.
- **테스트 프레임워크**: 기존 `vitest ^3.0.0` + `@testing-library/react ^16.0.0` + `@axe-core/react ^4.11.2` + `jest-axe ^10.0.0` 재사용 (Non-Duplication).

### 7.9 아키텍처 정합성 (Draft §5.1)

변경 범위가 ① CSS 변수 토큰 레이어 (`globals.css` 디자인 시스템 경계), ② app shell (`layout.tsx` Provider 주입), ③ presentation 레이어 (`src/components/`** className 치환) 에 한정. **Rich Domain Model + Hexagonal Architecture 계약에 영향 없음** — 도메인 레이어는 불변. ThemeProvider 는 외부 경계 (React context) 에 위치.

---

## 8. Milestones

Phase A 목표: **M-Epic-1 (2026-05-06)**. 기간 2주 (10 영업일). 각 마일스톤은 Draft §4-6 확정 6 개 PR 에 매핑.


| Phase                                                  | 범위                                                                                            | 예상 기간                                                        | 완료 조건                                                                                                                |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| **M1 — PR-1 Infrastructure**                           | REQ-001 ~ 006 (토큰 이중화 + ThemeProvider + next-themes 설치) + REQ-013 (토큰 매핑 결정표) + NFR-007 실험 검증 | **D+0 ~ D+3** (2026-04-23 ~ 2026-04-28)                      | Tailwind 4 + next-themes + 토큰 이중화 런타임 정합 검증 통과. 최소 1 컴포넌트 (navbar 배경) 테마 전환 확인. 실패 시 SPIKE-THEME-01 분기 (1 일 budget). |
| **M2a — PR-2 Navbar + ThemeToggle**                    | REQ-007 ~ 009 + navbar 자체 토큰 치환                                                               | **D+3 ~ D+5** (2026-04-28 ~ 2026-04-30)                      | navbar 렌더 + ThemeToggle 키보드 접근 + 5 뷰포트 가시성 검증 + axe-core 라이트 모드 0 violations (navbar 범위).                            |
| **M2b — PR-3 Hero + Features** (PR-2 와 병렬)             | REQ-010 hero · features 부분                                                                    | **D+3 ~ D+5** (2026-04-28 ~ 2026-04-30)                      | hero · features 섹션 토큰 치환 완료 + axe-core 0 violations (해당 섹션).                                                         |
| **M2c — PR-4 Pricing + Testimonials** (PR-2/PR-3 과 병렬) | REQ-010 pricing · testimonials 부분                                                             | **D+5 ~ D+7** (2026-04-30 ~ 2026-05-02)                      | pricing · testimonials 섹션 토큰 치환 완료 + axe-core 0 violations (해당 섹션).                                                  |
| **M2d — PR-5 Footer + Shared UI**                      | REQ-010 footer + REQ-012 shared UI                                                            | **D+7 ~ D+9** (2026-05-02 ~ 2026-05-04)                      | footer + `src/components/ui/` 토큰 치환 완료 + axe-core 0 violations (해당 범위).                                              |
| **M3 — PR-6 Dash-Preview 7 파일**                        | REQ-011                                                                                       | **D+9 ~ D+10** (2026-05-04 ~ 2026-05-06) — **F5 merge 완료 후** | dash-preview 7 파일 토큰 치환 완료 + axe-core 0 violations (dash-preview 범위) + 기존 다크 렌더 시각 회귀 스냅샷 100% 일치.                   |
| **Phase A 종료 — M-Epic-1**                              | G1 ~ G5 전수 검증                                                                                 | **2026-05-06**                                               | NFR-001 ~ 010 전수 통과 + Epic §2 지표 4 정량 검증 (landing 전역 axe-core 0 violations) + 6 개 PR 모두 merge.                       |


### 8.1 D+7 진척 평가 (Screening §8-4 리스크 "일정 6" 완화책)

D+7 시점 (2026-05-02) 기준 다음 상태여야 한다:

- M1 (PR-1) merge 완료 (필수).
- M2a / M2b / M2c 중 최소 2 건 merge 완료.
- NFR-007 실험 검증 통과 확인 (SPIKE-THEME-01 발동 여부 확정).

위 조건 미달 시 Phase A 1주 연장 (2026-05-13) 을 **즉시 판단** (Epic §6 리스크 6 완화책).

### 8.2 F5 순서 의존

**PR-6 merge 는 F5 완료 이후** 고정 (Draft §4-6 결정, Epic Children §2 F1↔F5 `✓` 에도 불구하고 dash-preview 파일 중복 편집 방지). F5 는 Lite Feature (Effort 2~3 일, Epic Children §4 Step 9) 이므로 Phase A D+0 ~ D+4 완료 목표. D+4 (2026-04-29) 이후 PR-6 시작.

---

## 9. Risks & Mitigations

Epic §6 리스크 1 / 5 / 6 + Draft §5.2 기술 리스크 6 건 통합 (중복 제거):


| #      | 리스크                                                                                                                                                               | 영향                              | 확률                     | 대응                                                                                                                                                                                                                                      |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **R1** | **Tailwind 4 `@theme inline` + `[data-theme="dark"]` 런타임 오버라이드 정합 실패** (Draft §5.2 기술 1, NFR-007) — Tailwind 4 빌드 시점 토큰 해석이 런타임 `data-theme` 셀렉터를 무시하거나 특이성 경쟁 발생 | High (Feature 전체 설계 재검토 필요)     | Medium                 | PR-1 (Infrastructure) 최초 단계에서 **실험 검증** — 최소 1 컴포넌트 (navbar 배경) 토큰 이중화 + 런타임 토글 확인. 실패 시 **SPIKE-THEME-01** (IMP-KIT-036 1 일 budget hard cap) 으로 분기 — 대안 3 건 평가 (selector 전략 · @layer 특이성 · attribute="class").                         |
| **R2** | **F1 ↔ F2/F3/F4 dash-preview 파일 충돌** (Epic §6 리스크 1) — F1 의 landing 전역 토큰 스윕이 F2/F3/F4 의 dash-preview 컴포넌트 편집과 광범위 충돌 가능                                          | Medium (머지 충돌 + 리뷰 범위 확대)       | Medium                 | Phase A (F1) · Phase B/C (F2/F3/F4) 로 Phase 분리 (Epic Children §3). F1 내부는 **섹션별 PR 6 개 분할** (Draft §4-6). PR-6 (dash-preview) 은 **F5 merge 후** 진행하여 F2/F3/F4 Phase B/C 진입 시점에 이미 토큰화 기반 확보.                                             |
| **R3** | **SSR hydration mismatch 경고** (Draft §5.2 기술 2) — 서버 렌더 시점에 테마 미확정 → 아이콘/배경이 클라이언트 마운트 후 변경 → React 경고 발생                                                         | Medium (dev 콘솔 경고 + UX 잔결함)     | Low (next-themes 사용 시) | **3 중 방어 조합** (NFR-004, §7.4) — `suppressHydrationWarning` + `disableTransitionOnChange` + `mounted` state. SSR 초기 렌더 테스트 (NFR-010) 로 회귀 방지. cookie 없음 · localStorage 있음 · OS 다크·라이트 4 개 조합 전수 검증.                                      |
| **R4** | **Phase A 2주 Target 슬립** (Epic §6 리스크 6) — 범위 확장 (dash-preview → landing 전역) 으로 10 인·일 추정이 타이트                                                                    | High (M-Epic-1 2026-05-06 미달성)  | Medium                 | ① 토큰 매핑 결정표 (REQ-013) 를 PR-1 단계에 선행 작성. ② 섹션별 PR 6 개 분할로 병렬 리뷰 (PR-2 / PR-3 / PR-4 동시 진행 가능). ③ **D+7 진척 평가** (§8.1) — M1 + M2 중 2 건 merge 상태 미달 시 Phase A 1주 연장 (2026-05-13) 즉시 판단. F5 는 F1 슬립과 무관 완료 가능 (Epic Children §2 F1↔F5 `✓`). |
| **R5** | **전환 트리거 방식 결정 지연** (Epic §6 리스크 5) — 토글 vs `prefers-color-scheme` vs 전면 라이트 교체 중 UX 결정 미결                                                                        | Low (Draft §4-2, §4-4 에서 이미 확정) | Resolved               | **Draft 단계에서 이미 확정**: `prefers-color-scheme` 시스템 follow + 수동 토글 병행 (navbar 우상단). PRD §6 UX Requirements 에 고정. 추가 결정 불필요.                                                                                                                |
| **R6** | **landing 전역 grep 스윕에서 동적 클래스 누락** (Draft §5.2 기술 3) — `cn({ 'bg-white/5': isActive })` 류 조건부 + template literal 내부 → grep 패턴 탈락 → 일부 영역 다크 팔레트 유지되는 국지적 불일치      | Medium (라이트 모드 시각 회귀 일부 잔존)     | Medium                 | ① **3 중 grep** (REQ-014) — 기본 문자열 + 이스케이프 처리 + `cn/clsx` 주변 문맥 grep. ② 섹션별 PR 리뷰 시 각 PR axe-core 실행 → 누락 감지 루프. ③ 토큰 매핑 결정표 (REQ-013) 를 체크리스트화 — 파일 경로 + 라인 + 현재 클래스 + 토큰 클래스 + 대비 비율 전수 기록.                                            |
| **R7** | **next-themes 와 Next.js 15 Turbopack dev 서버 호환** (Draft §5.2 기술 4) — `<script>` 인라인 주입 방식이 예상과 다르게 동작                                                             | Medium (dev 경험 저하)              | Low                    | PR-1 단계에서 `pnpm dev --turbopack` + `pnpm build && pnpm start` 양쪽 검증 (NFR-008). 문제 시 issue 제출 + `next-themes` 버전 downgrade 또는 직접 구현 폴백 평가.                                                                                               |
| **R8** | **접근성 WCAG AA 미달 — 라이트 팔레트 텍스트 대비** (Draft §5.2 기술 6) — `text-muted-foreground` 계열 대비 비율 AA (4.5:1) 미달 가능                                                         | High (Epic §2 지표 4 달성 실패 직결)    | Medium                 | 토큰 매핑 결정표 (REQ-013) 작성 시 **각 값별 WCAG 4.5:1 (text) / 3:1 (UI) 확인 컬럼** 필수. axe-core 각 PR 별 검증 (NFR-009). 미달 시 값 재선정 + PR 리뷰에서 차단.                                                                                                         |
| **R9** | **기존 다크 경험 회귀 (토큰 치환 누락)** — 전수 조사 누락으로 일부 다크 전용 하드코딩 잔존                                                                                                          | Medium (다크 사용자 시각 회귀)           | Low                    | ① REQ-014 3 중 grep. ② 기존 다크 렌더 시각 회귀 스냅샷 100% 일치 (REQ-003, REQ-011) 검증. ③ axe-core 다크·라이트 양측 검증 (NFR-001).                                                                                                                              |


---

## 10. Success Metrics

G1 ~ G5 정량화 + Epic §2 지표 4 인용.

> **Epic §2 성공 지표 4 (landing 전역 라이트/다크 양 팔레트 지원 + 전환 경로, axe-core 0 violations)** 를 본 F1 이 단독 충족.


| ID        | 지표                                                          | 목표값                                                               | 측정 방법                                                                                                                                                             | 완료 조건                                                |
| --------- | ----------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **SM-1**  | axe-core 라이트 모드 landing 전역 0 violations (G1 = Epic §2 지표 4) | 0 violations (WCAG AA color-contrast · aria-* · keyboard · focus) | `@axe-core/react` + `jest-axe` — 6 섹션 (hero · features · pricing · testimonials · footer · navbar) + dash-preview 7 파일 × 5 뷰포트 (1440/1280/1024/768/390) 라이트 모드 검증 | Phase A 종료 시점 (2026-05-06) 전수 통과                     |
| **SM-2**  | FOUC 측정 (G2)                                                | 0 프레임                                                             | Chrome DevTools Performance recording — 최초 진입 시각 + 테마 전환 시각에서 색상 flash 프레임 카운트                                                                                    | PR-1 merge 후 1 회 측정 + Phase A 종료 시점 재측정              |
| **SM-3**  | 번들 크기 증분 (G3)                                               | ≤ 2 kB gzipped                                                    | `next build` 출력 전후 비교 — `next-themes` + `ThemeToggle` 합계                                                                                                          | PR-1 merge 후 측정값 PR 코멘트 기록 + Phase A 종료 시점 재확인       |
| **SM-4**  | 다크 하드코딩 클래스 잔존 (G4)                                         | 0 건                                                               | `grep -rn "bg-white|text-white|from-gray|to-gray|border-gray|bg-black|bg-slate|border-white|ring-gray" src/`                                                      | Phase A 종료 시점 0 건 (각 PR merge 시점 범위 내 0 건)           |
| **SM-5**  | Hydration 경고 (NFR-004)                                      | 0 건                                                               | Next.js dev 콘솔 (`pnpm dev --turbopack`) + production (`pnpm build && pnpm start`)                                                                                 | PR-1 merge 후 + Phase A 종료 시점                         |
| **SM-6**  | 테마 전환 시각 지연 (NFR-005)                                       | ≤ 100 ms                                                          | Chrome DevTools Performance recording — 사용자 클릭 → DOM `data-theme` 속성 변경 → 시각 반영 시각                                                                                | Phase A 종료 시점 1 회 측정                                 |
| **SM-7**  | 6 개 PR 순차 merge 완료 (G5)                                     | 6/6                                                               | GitHub PR merge 상태 + 각 PR axe-core 0 violations                                                                                                                   | 2026-05-06 까지 PR-1 ~ PR-6 모두 merge                   |
| **SM-8**  | Tailwind 4 정합 검증 (NFR-007)                                  | 통과                                                                | PR-1 실험 컴포넌트 (navbar 배경) 런타임 토글 동작 확인                                                                                                                             | PR-1 D+3 (2026-04-28) 까지 통과 (실패 시 SPIKE-THEME-01 발동) |
| **SM-9**  | WCAG AA 대비 비율 (NFR-009)                                     | ≥ 4.5:1 (text) / ≥ 3:1 (UI)                                       | 토큰 매핑 결정표 (REQ-013) 각 행 확인 컬럼 + axe-core color-contrast                                                                                                           | 토큰 매핑 결정표 작성 시점 + Phase A 종료 시점                      |
| **SM-10** | 테스트 커버리지 (NFR-010)                                          | 60 스냅샷 + 6 jest-axe + 1 SSR 초기 렌더 테스트                             | `pnpm test` 실행 결과                                                                                                                                                 | Phase A 종료 시점                                        |


### 10.1 M-Epic-1 기여

본 F1 의 SM-1 ~ SM-10 전수 통과가 Epic §2 지표 4 달성 + Epic Children §4 Phase A 종료 조건 ("axe-core 라이트 모드 0 violations — landing 전역 기준, 지표 4 중간 평가") 만족을 **단독 기여**. F5 는 UI 잔재 정리 (별도 범위) 로 Phase A 완료에는 F1 + F5 양쪽 Feature archived 필요.

---

## 11. 생성된 파일

- **PRD 본 파일**: `.plans/drafts/f1-landing-light-theme/02-prd.md` (본 문서)
- **연계 파일** (수정):
  - `.plans/ideas/00-inbox/IDEA-20260423-002.md` §9 PRD 엔트리 + §10 변경 이력 append
- **Epic 연계** (읽기 전용, 본 PRD 에서 수정하지 않음):
  - `.plans/epics/20-active/EPIC-20260422-001/00-epic-brief.md` (§2 성공 지표 4 인용원)
  - `.plans/epics/20-active/EPIC-20260422-001/01-children-features.md` (§1 F1, §2 의존성 매트릭스, §3 Phase A, §4 Step 9)
- **Epic Binding 파일**: `.plans/features/active/f1-landing-light-theme/00-context/08-epic-binding.md` **미생성** (Step 7 `/plan-bridge` 단계에서 생성 예정 — IMP-AGENT-010)

---

## 12. 다음 단계

```bash
# Phase A Step 6 리뷰 (본 PRD 작성 직후)
plan-reviewer  # PCC (Plan Consistency Check) 5 종 검증
                # 1. PCC-01: Epic binding 일관성 (Epic §2 지표 4 인용 확인)
                # 2. PCC-02: Draft ↔ PRD 내용 일관성 (결정 포인트 6 건 반영)
                # 3. PCC-03: 요구사항 테스트 가능성 (REQ-/NFR- ID 부여 확인)
                # 4. PCC-04: 사용자 스토리 형식 (As a / I want / So that)
                # 5. PCC-05: Success Metrics 정량성 (측정 방법 명시)

# 사용자 승인 (type: review-approval, non-critical)
# - autoProceedOnPass=true 시 PASS → 자동 통과

# Phase A Step 7 — 개발 핸드오프
/plan-bridge f1-landing-light-theme
    # → .plans/features/active/f1-landing-light-theme/ 생성
    # → 00-context/ 4 종 (01-overview, 02-scope, 03-dependencies, 04-decisions)
    # → 08-epic-binding.md 생성 (Epic cross-reference)

# Phase A Step 9 — 구현 (F5 와 병렬)
/dev-feature .plans/features/active/f1-landing-light-theme/
    # → dev-implementer 자율 TDD 루프
    # → TASK ID: T-THEME-01 ~ T-THEME-08 (6~8 건 예상)
    # → PR 분할 6 개 (PR-1 ~ PR-6)
```

---

## 13. 변경 이력


| 날짜         | 내용                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-23 | 초안 작성 — PRD 10 섹션 전수 (Overview / Problem / Goals / User Stories / Functional + Non-Functional Requirements / UX / Tech / Milestones / Risks / Success Metrics). Epic §2 지표 4 Goals + Success Metrics 양쪽 인용 (IMP-AGENT-011). Tailwind 4 정정 반영 (`@theme inline` 기반, `tailwind.config.ts` 불사용 명시). REQ-14 건 + NFR-10 건 + 10 SM 건 부여. Draft §4 결정 포인트 6 건 Tech / UX / Milestones 로 전개. 6 개 PR 분할 (Draft §4-6) Milestones M1 / M2a ~ d / M3 매핑 (Phase A Step 6). |


