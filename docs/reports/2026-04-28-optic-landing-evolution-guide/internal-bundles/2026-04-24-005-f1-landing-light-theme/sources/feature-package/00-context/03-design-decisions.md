# 03. Design Decisions — F1 라이트 모드 전환 인프라

> Draft §4 + PRD §6 UX + §7 Tech 에서 확정된 **6 결정 포인트** + **Tailwind 4 기술 정정** + **6 PR 분할 경계**. 각 결정의 선택값 · 근거 · 대안 거절 사유 기록.
> SSOT: [Draft §4](../../../../drafts/f1-landing-light-theme/01-draft.md#4-결정-포인트-6-건-확정-plan-draft-단계) + [PRD §7](../../../../drafts/f1-landing-light-theme/02-prd.md#7-technical-considerations). 본 문서는 요약 + 빠른 참조.

---

## 1. 결정 1 — ThemeProvider 구현 방식

### 선택값: **`next-themes` v0.3+ 라이브러리 채택**

| 항목 | 내용 |
|------|------|
| **확정값** | `next-themes ^0.3.0` (Next.js 15 + React 18 공식 호환, gzip ~1.5 kB) |
| **적용 위치** | `src/app/layout.tsx` (Provider 래퍼) + `package.json` (신규 dependency) |
| **관련 REQ** | REQ-004 (설치), REQ-005 (Provider 주입) |

### 근거

1. **업계 표준 + SSR hydration 패턴 내장**: Next.js App Router + React 18 환경에서 테마 토큰 관리의 **사실상 표준** (Vercel/Next.js 공식 예제 + shadcn/ui 공식 가이드 채택). `<script>` 인라인 주입으로 FOUC 차단 + `data-theme` 속성 서버/클라이언트 동기 설정.
2. **번들 사이즈 수용 가능**: gzip ~1.5 kB. landing 이 이미 `framer-motion ^11.15` (gzip ~40 kB) 포함 → 추가 1.5 kB 허용 범위.
3. **SemVer 안정성 + Next.js 15 호환 검증**: next-themes v0.3+ 는 Next.js 13/14/15 App Router 호환 공식 확인. 본 프로젝트 `next ^15.1.0` + `react ^18.3` 와 정합.

### 거절된 대안

- **직접 구현**: ① cookie SSR 초기값 주입, ② `<script>` 인라인 hydration 방어, ③ useTheme hook 추상화, ④ storage 동기화, ⑤ cross-tab sync — 모두 자체 작성 시 최소 3~4 인·일 + 리스크 높음. **거절**.

---

## 2. 결정 2 — 초기 모드

### 선택값: **`prefers-color-scheme` 시스템 follow + 수동 토글 병행**

| 항목 | 내용 |
|------|------|
| **확정값** | `defaultTheme="system"` + `enableSystem` (next-themes 속성) |
| **동작** | 최초 방문자는 OS 설정에 따라 라이트/다크 자동 선택. 토글 사용 시 localStorage 저장 → 다음 방문부터 우선. |
| **관련 REQ** | REQ-005 (Provider 속성) |

### 근거

1. **사용자 선호 존중 + 접근성 원칙**: WCAG 2.2 + Apple HIG + Material Design 공통 원칙 — 시스템 설정은 사용자의 접근성 선택 (시력·눈부심·야간 근무 등) 을 반영하는 **1 차 signal**.
2. **IDEA §1 이슈 [1] 근본 해소**: "`prefers-color-scheme: light` 환경에서 다크 팔레트 노출" 문제를 자동 대응.
3. **기존 다크 방문자 이탈 리스크 0**: 시스템 follow 는 기존 다크 환경 Phase 3 베타 사용자 (다수 다크) 의 경험 불변 + 라이트 환경 사용자만 전환.

### 거절된 대안

- **강제 라이트 기본**: 기존 다크 환경 방문자 이탈 리스크. **거절**.
- **토글만 표시 + `defaultTheme="dark"`**: 라이트 선호 사용자가 토글 발견 전까지 다크 노출. **거절**.
- **시스템 follow + 토글 없음**: IDEA §3-D "트리거 UI" 범위 포함 요구 불충족. **거절**.

---

## 3. 결정 3 — SSR Hydration Mismatch 대응

### 선택값: **3 중 방어 조합** (3 가지를 **모두** 적용)

| # | 방어 | 위치 | 역할 |
|:-:|------|------|------|
| 1 | `<html suppressHydrationWarning>` | `layout.tsx` | React 의 hydration 경고 억제 (실제 next-themes 가 `<script>` 동기 주입으로 최종 DOM 일치시킴) |
| 2 | `<ThemeProvider disableTransitionOnChange>` | `layout.tsx` | 테마 전환 시점 CSS transition duration 을 0 으로 강제 → 시각 flash 억제 |
| 3 | `ThemeToggle mounted state` | `ThemeToggle.tsx` | `useEffect(() => setMounted(true), [])` — 서버 렌더에는 placeholder (아이콘 미정), 클라이언트 마운트 후 Sun/Moon 렌더 → 아이콘 자체 mismatch 원천 차단 |

| 항목 | 내용 |
|------|------|
| **관련 REQ** | REQ-005 (disableTransitionOnChange), REQ-006 (suppressHydrationWarning), REQ-007 (mounted state) |
| **관련 NFR** | NFR-004 (hydration 경고 0 건), NFR-005 (전환 지연 ≤ 100 ms) |
| **검증 경로** | NFR-010 — SSR 초기 렌더 테스트 1 건 (cookie 없음 · localStorage 있음 · OS 다크·라이트 4 개 조합) |

### 근거

1. **각 방어의 역할 분담**: `suppressHydrationWarning` (경고 억제) ↔ `disableTransitionOnChange` (시각 flash 억제) ↔ `mounted` state (아이콘 자체 mismatch 차단) — 각각 다른 계층의 문제를 커버.
2. **표준 패턴**: shadcn/ui 공식 theming 가이드 및 next-themes 공식 README 권장 조합. 커스텀 대응 없음.
3. **회귀 방지 경로 확보**: SSR 초기 렌더 테스트 (NFR-010) 로 cookie 없음 · localStorage 있음 · OS 다크·라이트 4 개 조합 모두 커버.

---

## 4. 결정 4 — 전환 트리거 UI 배치

### 선택값: **navbar 우측 상단**

| 항목 | 내용 |
|------|------|
| **확정값** | landing navbar 우측 끝 액션 영역 (sticky 노출) |
| **관련 REQ** | REQ-008 (배치 위치) |
| **뷰포트 반응** | 1440/1280/1024/768/390 모두 navbar 우측 끝. 768/390 에서 hamburger menu 와의 상대 위치는 PR-2 navbar 전수 조사 시점에 확정 (PRD §6.5) |

### 근거

1. **발견성 (discoverability)**: navbar 는 스크롤 위치 무관 지속 노출 (특히 `sticky` 적용 시). 라이트 모드 사용자는 다크 상태에서 landing 진입 시 **즉시 토글 발견** → 전환 가능.
2. **업계 관행**: GitHub · Vercel · Stripe · Linear 등 주요 SaaS 랜딩 페이지 공통 — 사용자 학습 곡선 0.
3. **접근성 위반 방지**: 전면 자동 전환 (scroll 트리거) 은 사용자 의도 무관 상태 변화로 혼란 유발 + `prefers-reduced-motion` 사용자에게 접근성 위반.

### 거절된 대안

- **footer 배치**: 스크롤 필요 → 사용자가 다 읽기 전 이탈 시 토글 미발견. **거절**.
- **settings 페이지**: landing 은 settings 페이지 없음. **거절**.
- **전면 자동 전환** (scroll 트리거 등): 접근성 위반 + 사용자 혼란. **거절**.

---

## 5. 결정 5 — 토글 아이콘

### 선택값: **`lucide-react` 의 `Sun` / `Moon` 컴포넌트**

| 항목 | 내용 |
|------|------|
| **확정값** | `import { Sun, Moon } from 'lucide-react'`, 크기 24×24 |
| **표시 규칙** | 현재 테마 `dark` → `<Sun />` 렌더 (= "라이트로 전환" 암시) / 현재 테마 `light` → `<Moon />` 렌더 (= "다크로 전환" 암시) |
| **관련 REQ** | REQ-009 (아이콘 라이브러리 지정), REQ-007 (mounted state 방어) |

### 근거

1. **기존 dep 재사용 (Non-Duplication, golden #13)**: `package.json` 에 `lucide-react ^0.474.0` 이미 존재. 신규 아이콘 라이브러리 추가는 번들 중복 + Non-Duplication 위반. lucide-react 는 tree-shakable → 아이콘 2 개 추가 비용 무시 가능.
2. **시각 관습**: sun/moon 은 테마 토글의 **사실상 표준 아이콘** → 사용자 라벨 없이도 기능 즉시 인지.
3. **접근성**: SVG 기반 + 크기 조정 가능 + `aria-label` 보조 (REQ-007 `aria-label="테마 전환"`).

### 거절된 대안

- **자체 SVG**: 유지보수 부담. **거절**.
- **`react-icons`**: 중복 의존성 (Non-Duplication 위반). **거절**.
- **이모지 (☀️🌙)**: 플랫폼별 렌더링 차이. **거절**.

---

## 6. 결정 6 — 섹션별 PR 분할 경계

### 선택값: **6 개 PR 분할**

| PR | 범위 | 사전 조건 | 관련 REQ |
|----|------|----------|---------|
| **PR-1 Infrastructure** | `globals.css` 토큰 이중화 (REQ-001~003) + `layout.tsx` ThemeProvider (REQ-005/006) + `package.json` next-themes 설치 (REQ-004) + 토큰 매핑 결정표 (REQ-013) + NFR-007 실험 검증 | — (최우선) | REQ-001~006, REQ-013, NFR-007 |
| **PR-2 Navbar + ThemeToggle** | `ThemeToggle.tsx` 신규 (REQ-007~009) + navbar 자체 토큰 치환 | PR-1 merge 완료 | REQ-007~009, REQ-010 (navbar 부분) |
| **PR-3 Hero + Features** | hero · features 섹션 토큰 치환 | PR-1 merge 완료 (PR-2 와 병렬) | REQ-010 (hero/features 부분) |
| **PR-4 Pricing + Testimonials** | pricing · testimonials 섹션 토큰 치환 | PR-1 merge 완료 (PR-2/PR-3 과 병렬) | REQ-010 (pricing/testimonials 부분) |
| **PR-5 Footer + Shared UI** | footer 섹션 + `src/components/ui/` 공용 컴포넌트 토큰 치환 | PR-1 merge 완료 | REQ-010 (footer), REQ-012 (shared UI) |
| **PR-6 Dash-Preview 7 파일** | dash-preview 7 파일 토큰 치환 | **F5 merge 완료 후** + PR-1 merge 완료 | REQ-011 |

### 근거

1. **머지 충돌 최소화 (Epic §6 리스크 1 완화)**: 각 PR 이 독립 섹션 범위 → 동시 리뷰 가능 + F2/F3/F4 Phase B/C 진입 시점에 PR-6 dash-preview 가 이미 merge 된 상태 → F1 ↔ F2/F3/F4 `△` 충돌 가능성 해소.
2. **TDD 루프 가능한 최소 단위**: 섹션별 스냅샷 + axe-core 검증 각 PR 당 독립 수행 가능. PR-1 은 TDD 진입 전 필수 기반이므로 **최우선 merge**.
3. **D+7 시점 진척 평가 가능**: Screening §8-4 리스크 "일정 6 (Phase A 2주 타이트)" 완화책으로 제안된 D+7 평가에서 PR-1 ~ PR-3 merge 상태 점검 가능.

### 경계 결정 근거 — 왜 5 개나 7 개가 아닌 6 개인가

- **Hero + Features (PR-3)**: 두 섹션 모두 상단 visual heavy — 토큰 적용 영향권 유사 + 한 번의 시각 회귀 검증 배치 가능.
- **Pricing + Testimonials (PR-4)**: 카드 기반 컴포넌트 공유 패턴 (`bg-card` 등) — 같은 토큰 매핑 반복 검증.
- **Footer + Shared UI (PR-5)**: footer 는 작고 shared UI 는 공용 — 묶지 않으면 너무 작은 PR 2 개.
- **Dash-preview (PR-6)**: 7 개 파일이 같은 디렉터리 + F5 의존성 → 독립 PR 필요.
- 더 나눌 경우 **PR 수 8+** 로 리뷰 오버헤드 급증, 더 합칠 경우 **PR 당 파일 수 급증 + diff 300+ 줄 초과**.

---

## 7. Tailwind 4 기술 정정 (중요)

> 상세 정정 사실 + 파일 부재 확인 + 언급 금지 원칙은 [`02-scope-boundaries.md` §4 Tailwind 4 기술 정정](./02-scope-boundaries.md) SSOT 참조.

### 현재 상태 (As-is)

- 본 프로젝트는 **Tailwind 4** (`tailwindcss ^4.0.0` + `@tailwindcss/postcss`) 기반
- 테마 정의는 `src/app/globals.css` 의 `@theme inline` 블록이 레거시 JS 설정 파일 역할을 대체
- 본 Feature 의 **모든 토큰 작업은 `src/app/globals.css` 에서 수행** (Draft §5.1 + PRD §7.1 명시)

### 본 Feature 의 토큰 이중화 구조 (PRD §7.2 기반)

```css
/* src/app/globals.css */
@import 'tailwindcss';
@source "../app/**/*.{ts,tsx,mdx}";
@source "../components/**/*.{ts,tsx}";

/* 1. Tailwind 4 @theme inline 블록 — CSS 변수 간접화 */
@theme inline {
  --color-background: var(--landing-background);
  --color-foreground: var(--landing-foreground);
  --color-card: var(--landing-card);
  /* ... 19 개 변수 모두 var(--landing-*) 참조 */
}

/* 2. 라이트 팔레트 (기본, :root) */
:root {
  --landing-background: #ffffff;
  --landing-foreground: #0a0a0a;
  /* ... 19 개 라이트 팔레트 값 (WCAG AA ≥ 4.5:1 확보) */
}

/* 3. 다크 팔레트 (런타임 오버라이드) */
[data-theme="dark"] {
  --landing-background: #0a0a0a;
  --landing-foreground: #ffffff;
  /* ... 19 개 다크 팔레트 값 */
}

/* 4. 기존 @layer base 유지 — prefers-reduced-motion 블록 포함 */
```

### 최우선 리스크 — PR-1 실험 검증 (NFR-007)

**Tailwind 4 `@theme inline` + `[data-theme="dark"]` 런타임 오버라이드 정합** 은 **최우선 리스크**. PR-1 최초 단계에서 최소 1 컴포넌트 (예: navbar 배경) 에 토큰 이중화 적용 → 런타임 토글 확인 → 색상 변화 발생 확인.

**실패 시 분기**: **SPIKE-THEME-01** (IMP-KIT-036 1 일 budget hard cap, SPIKE-{AREA}-NN 형식 — IMP-KIT-015 준수) 으로 설계 재검토:

- 대안 1: `darkMode: 'selector'` 스타일 강제 우선순위 활용 (Tailwind 3 패턴)
- 대안 2: `@layer` 활용으로 `[data-theme="dark"]` 특이성 명시 상승
- 대안 3: next-themes `attribute="class"` + `.dark` 셀렉터 전환

---

## 8. 관련 NFR 매핑 요약

| NFR | 내용 | 관련 결정 |
|-----|------|----------|
| NFR-001 | axe-core 라이트 모드 landing 전역 0 violations | 결정 6 (6 PR 각 axe 검증) |
| NFR-002 | FOUC 0 건 | 결정 1 (next-themes) + 결정 3 (3 중 방어) |
| NFR-003 | 번들 크기 증분 ≤ 2 kB gzipped | 결정 1 (next-themes ~1.5kB) + 결정 5 (lucide 재사용) |
| NFR-004 | Hydration mismatch 경고 0 건 | 결정 3 (3 중 방어) |
| NFR-005 | 테마 전환 시각 지연 ≤ 100 ms | 결정 3 (disableTransitionOnChange) |
| NFR-006 | `prefers-reduced-motion` 존중 | 결정 3 (disableTransitionOnChange + globals.css 블록) |
| NFR-007 | Tailwind 4 `@theme inline` + `[data-theme="dark"]` 정합 | 본 문서 §7 (PR-1 실험 검증, SPIKE 분기) |
| NFR-008 | Turbopack dev + production 양쪽 호환 | 결정 1 (next-themes) |
| NFR-009 | 라이트 팔레트 WCAG AA 대비 ≥ 4.5:1 | REQ-002 (토큰 매핑 결정표) |
| NFR-010 | 테스트 커버리지 (60 스냅샷 + 6 jest-axe + 1 SSR) | 결정 6 (각 PR axe + 스냅샷) |

---

## 9. 다음 단계

- [`04-implementation-hints.md`](./04-implementation-hints.md) — TASK 힌트 (T-THEME-01 ~ T-THEME-08) + PR 매핑 + TDD 사이클 예시 + 회귀 검증 grep
- [`08-epic-binding.md`](./08-epic-binding.md) — Epic ↔ Feature cross-reference + Phase A 종료 조건 중 F1 담당
