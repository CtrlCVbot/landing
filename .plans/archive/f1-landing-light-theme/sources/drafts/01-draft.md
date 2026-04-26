# F1 라이트 모드 전환 인프라 — 1차 기능 기획 (Draft)

> **Feature slug**: `f1-landing-light-theme`
> **IDEA**: [IDEA-20260423-002](../../ideas/00-inbox/IDEA-20260423-002.md)
> **Epic**: [EPIC-20260422-001](../../epics/20-active/EPIC-20260422-001/00-epic-brief.md) (Phase A, F1)
> **작성일**: 2026-04-23
> **작성자**: `plan-draft-writer` (Phase A Step 5, F1 부분)
> **상태**: draft (사용자 승인 대기)

---

## 1. 3 중 판정 결과

| 축 | 결과 | 근거 |
|----|------|------|
| **Lane (카테고리)** | **Standard** | `triggers_matched: [1, 2, 3, 5, 6]` — 6 트리거 중 5 건 매칭. ① 3+ 화면 변경 (landing 전역 수십 파일 스윕), ② 아키텍처 변경 (ThemeProvider 인프라 레벨 도입), ③ 외부 의존 후보 (next-themes 채택 시 신규 npm dependency), ⑤ 2+ 도메인 영향 (presentation 레이어 + app shell + 디자인 토큰 레이어 동시 편집), ⑥ 1주+ 구현 (Effort 10 인·일). PRD 필수. IDEA §8-5 Standard 확정과 정합. 6 트리거 스키마 상세 매핑은 `07-routing-metadata.md` §3 참조. |
| **시나리오** | **A (Greenfield)** | copy 도메인 활성 프로젝트 (`domains: core, dev, plan, copy`). **라이트 팔레트는 기존 구현 없음** — 현재 `src/app/globals.css` 의 `@theme inline` 블록은 다크 단일 팔레트 하드코딩 (`--color-background: #0a0a0a`, `--color-foreground: #ffffff` 등) 으로, 라이트 모드 팔레트를 0 에서 신규 구축한다. IDEA §6 시나리오 예상 A 확정. 단 Feature 유형이 `dev` 이므로 시나리오 판정은 기록용 (copy 파이프라인 미진입). |
| **Feature 유형** | **dev** | 시각 차이 닫기(copy)가 아닌 **CSS 변수 토큰 이중화 · ThemeProvider 인프라 · 컴포넌트 className 치환**. 원본 디자인 시안 대조 불필요 — Phase 3 archive 직후 사용자 피드백 ("라이트 모드가 없어서 사용하기 어렵다", 2026-04-22) 을 직접 반영. 레퍼런스 캡처 불필요. IDEA §6 확정. |
| **Hybrid** | **false** | dev + 레퍼런스 시그널 없음. IDEA frontmatter `reference-needed: true` 없음, SCREENING `hybrid-candidate: true` 없음, 본문에 "레퍼런스 캡처 필요"·"기존 사이트 참조"·"디자인 기반"·"시각 참조" 키워드 없음. `/copy-reference-refresh --reference-only` 불필요. |

> 표의 시나리오 "A" 는 copy 도메인 활성 프로젝트 convention 에 따른 기록. `07-routing-metadata.md` 에는 `scenario: "A"` 로 기록하되, Feature 유형이 `dev` 이므로 copy 파이프라인은 진입하지 않는다.

---

## 2. 유저 스토리

1. **As a** `prefers-color-scheme: light` 환경 (주간 창가·밝은 모니터) 의 landing 방문자,
   **I want** landing 전체 페이지 (hero · features · pricing · testimonials · footer · navbar · dash-preview) 가 내 시스템 선호에 맞춰 라이트 팔레트로 표시되기를,
   **so that** 과도한 대비 없이 편안하게 콘텐츠를 읽고 Optic 가치 제안을 이해할 수 있다.

2. **As a** 개인 선호로 라이트 모드를 원하는 방문자,
   **I want** navbar 우측 상단의 sun/moon 토글 버튼으로 언제든 테마를 바꿀 수 있기를,
   **so that** 시스템 설정을 바꾸지 않고도 현재 환경에 맞는 시각 경험을 즉시 선택한다.

3. **As a** WCAG AA 접근성을 검증하는 QA,
   **I want** axe-core 가 landing 전역의 라이트 모드 상태에서 0 violations 를 보고하기를,
   **so that** Epic §2 성공 지표 4 (라이트/다크 양 팔레트 + 전환 경로, 접근성 AA) 가 정량 검증된다.

4. **As a** 후속 Feature (F2 Mock 재설계 · F3 옵션↔요금 파생 · F4 레이아웃) 를 담당하는 개발자,
   **I want** dash-preview 7 개 파일의 다크 하드코딩 클래스가 토큰 기반 (`bg-card` / `text-foreground` / `border-border` 등) 으로 선행 치환되어 있기를,
   **so that** Phase B/C 작업이 이미 토큰화된 기반 위에서 머지 충돌 없이 수행된다 (Epic §2 F1↔F2/F3/F4 `△` 완화).

5. **As a** 향후 3 번째 테마 (예: high-contrast 변형) 또는 브랜드 팔레트 확장을 고려하는 메인테이너,
   **I want** CSS 변수 2 세트 (`:root` 라이트 + `[data-theme="dark"]` 다크) 구조가 확장 가능한 형태로 확립되기를,
   **so that** `[data-theme="high-contrast"]` 세트를 추가하는 것으로 신규 테마를 도입할 수 있다 (IDEA §4-4 차기 Epic 연동).

---

## 3. 러프 요구사항

### 3.1 토큰 이중화 (IDEA §3-A)

- **R1**: `src/app/globals.css` 의 기존 `@theme inline { ... }` 블록 내 컬러 변수 (현재 19 개: `--color-background`, `--color-foreground`, `--color-card`, `--color-card-foreground`, `--color-border`, `--color-muted`, `--color-muted-foreground`, `--color-accent-start`, `--color-accent-end`, `--color-accent`, `--color-accent-foreground`, `--color-primary`, `--color-primary-foreground`, `--color-secondary`, `--color-secondary-foreground`, `--color-destructive`, `--color-destructive-foreground`, `--color-input`, `--color-ring`) 의 값을 **CSS 변수 참조 형태** (`var(--landing-background)` 등) 로 간접화한다.
- **R2**: `:root` 블록에 **라이트 팔레트 1 세트** (`--landing-background`, `--landing-foreground`, `--landing-card`, ... 19 개 변수) 를 신규 작성한다. 토큰 매핑 결정표 (R3) 에 따라 값 확정.
- **R3**: `[data-theme="dark"]` 셀렉터 (또는 `.dark` — 결정 포인트 §4-1 next-themes 기본 `class` 속성 사용) 블록에 **다크 팔레트 1 세트** 를 신규 작성한다 (기존 `@theme inline` 의 하드코딩 값을 그대로 이관).
- **R4**: `@media (prefers-color-scheme: light)` 는 R1 ~ R3 이 `data-theme` 속성 기반으로 작동하므로 **사용하지 않는다** (next-themes 가 `prefers-color-scheme` 을 읽어 `data-theme` 를 주입 — 결정 포인트 §4-2).
- **R5**: **Tailwind 4 `@theme` 규칙과 `[data-theme="dark"]` 셀렉터의 런타임 재계산 검증** — Tailwind 4 는 `@theme inline` 블록 내 CSS 변수를 빌드 시점에 해석하므로, `[data-theme="dark"]` 런타임 오버라이드가 의도대로 작동하는지 실험 PR (또는 SPIKE-THEME-01) 로 사전 검증한다 (IDEA §8-4 리스크 "기술적" 3).

### 3.2 ThemeProvider 도입 (IDEA §3-B)

- **R6**: **`next-themes` 라이브러리 채택** (결정 포인트 §4-1 확정). `package.json` 에 `next-themes` dependency 추가 (Next.js 15 + React 18 호환).
- **R7**: `src/app/layout.tsx` 의 `<body>` 내부 최상위에 `<ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>` 래퍼를 추가한다. 속성 선택 근거:
  - `attribute="data-theme"`: `class="dark"` 가 아닌 `data-theme="dark"` 속성 사용 (R1 ~ R3 팔레트 셀렉터와 일치).
  - `defaultTheme="system"`: `prefers-color-scheme` 시스템 follow 기본 (결정 포인트 §4-2).
  - `enableSystem`: 사용자가 "System" 을 명시적으로 선택 가능.
  - `disableTransitionOnChange`: 테마 전환 순간 색상 트랜지션 차단 (결정 포인트 §4-3 hydration 방어 3 중 2).
- **R8**: `src/app/layout.tsx` 의 `<html>` 태그에 `suppressHydrationWarning` 속성 추가 (next-themes 표준 패턴, 결정 포인트 §4-3 hydration 방어 3 중 1).

### 3.3 전환 트리거 UI (IDEA §3-D)

- **R9**: `src/components/ThemeToggle.tsx` (신규) 생성 — `useTheme()` hook 기반 + sun/moon 아이콘 토글. 초기 마운트 전에는 아이콘 렌더 지연 (`mounted` state 로 hydration mismatch 방어, 결정 포인트 §4-3 방어 3 중 3).
- **R10**: `ThemeToggle` 을 navbar 컴포넌트 (`src/components/**` 내 navbar 파일 — 전수 조사로 위치 확정) 의 **우측 상단** 에 배치한다 (결정 포인트 §4-4 확정).
- **R11**: 아이콘은 `lucide-react` 의 `Sun` · `Moon` 컴포넌트 사용 (결정 포인트 §4-5 확정, 기존 `package.json` 에 `lucide-react ^0.474.0` 이미 존재).
- **R12**: 토글 버튼은 **키보드 접근 가능** (`<button>` element, `aria-label="테마 전환"`, focus ring 토큰 기반 — `--color-ring`).

### 3.4 landing 전역 컴포넌트 스윕 (IDEA §3-C)

- **R13**: 전수 조사 — `grep -rn "bg-white\|text-white\|from-gray\|to-gray\|border-gray\|bg-black\|bg-slate\|border-white\|ring-gray" src/` 로 다크 하드코딩 클래스 후보 목록 생성 (Phase A 구현 진입 전 D+1~D+2 선행 작성, IDEA §8-4 리스크 "일정" 6 완화책).
- **R14**: **토큰 매핑 결정표** 를 `.plans/drafts/f1-landing-light-theme/` (또는 PRD 단계에서) 에 마크다운 표로 작성. 각 행은 `(파일 경로 + 라인 + 현재 클래스 → 토큰 클래스)` 형태. 예시:
  - `bg-white/5` → `bg-card/50` (또는 `bg-muted/50`)
  - `text-white` → `text-foreground`
  - `from-gray-900/50` → `from-background/50`
  - `to-gray-900/50` → `to-background/50`
  - `border-gray-800` → `border-border`
  - `bg-gray-900` → `bg-card`
  - `bg-black` → `bg-background`
  - `text-gray-300` → `text-muted-foreground` (대비 비율 WCAG AA 검증 전제)
  - `text-gray-400` → `text-muted-foreground`
- **R15**: **섹션별 PR 분할** (결정 포인트 §4-6 확정) — 각 PR 은 독립 섹션 범위 + 각 PR 당 axe-core 라이트 모드 0 violations 검증.
- **R16**: **Tailwind className 내부 조건부 클래스** (`cn({ 'bg-white/5': isActive })`, `clsx(...)` 등) 도 전수 조사에 포함 — `grep` 패턴 이스케이프 + 리뷰 체크리스트에 명시.

### 3.5 테스트 및 검증

- **R17**: **axe-core 라이트 모드 회귀 테스트** 추가 (`@axe-core/react` + `jest-axe` 기존 사용 중) — landing 전역 주요 섹션 (hero / features / pricing / footer / navbar / dash-preview) 별 1 건씩 라이트 모드 상태에서 axe 실행 + 0 violations 단정.
- **R18**: **스냅샷 회귀 테스트** — 5 개 뷰포트 (`1440` / `1280` / `1024` / `768` / `390`) × 2 개 테마 (light / dark) = 10 개 스냅샷 매트릭스. 각 섹션별 스냅샷 기준선 (baseline) 확립 후 PR 별 diff 검토.
- **R19**: **SSR 초기 렌더 테스트** — `defaultTheme="system"` + cookie 없는 최초 방문 시 서버 렌더와 클라이언트 hydration 이 불일치하지 않는지 확인 (`suppressHydrationWarning` + `disableTransitionOnChange` + `mounted` state 3 중 방어 검증).

### 3.6 Out-of-scope (명시)

- 라이트 모드를 계기로 한 **대규모 디자인 시스템 리팩토링** (차기 Epic 후보, IDEA §3 Out-of-scope 승계).
- landing **이외 영역** 의 라이트 모드 대응 (관리자·대시보드·docs 등 별도 앱 — IDEA §3 Out-of-scope 승계).
- 다국어(i18n) 연동 (Epic §3 Out-of-scope 와 정합).
- 모바일 전용 팔레트 분리 (Phase 5+ 후보, IDEA §3 Out-of-scope 승계).
- 브랜드 컬러·로고 등 **팔레트 외 자산** 의 라이트/다크 분기 (별도 Theme 후보, IDEA §3 Out-of-scope 승계).
- `autoDispatch` 로직·Mock 스키마 재설계 등 F2/F3/F4/F5 범위.

---

## 4. 결정 포인트 6 건 확정 (plan-draft 단계)

> IDEA §3-B, §3-D 의 "범위 결정 포인트 (plan-draft 확정)" + Screening §8-4 리스크 완화 목적으로 6 건을 본 Draft 에서 확정한다.

### 4-1. ThemeProvider 구현 방식 — **next-themes 라이브러리 채택 (확정)**

- **결정**: `next-themes` (Next.js 특화 표준 라이브러리, React 18 + SSR 지원) 를 도입한다.
- **근거 1 — 업계 표준 + SSR hydration 패턴 내장**: Next.js App Router + React 18 환경에서 테마 토큰 관리의 **사실상 표준** (vercel/next.js 공식 예제 + shadcn/ui 공식 가이드 채택). `<script>` 인라인 주입으로 FOUC (Flash of Unstyled Content) 를 차단하고 `data-theme` 속성을 서버/클라이언트 동기적으로 설정 — 직접 구현 시 수일 작업이 라이브러리 채택으로 1 인·일 이내 해결.
- **근거 2 — 번들 사이즈 수용 가능**: next-themes 는 gzip 기준 약 1.5kB (미니멀). landing 이 이미 `framer-motion ^11.15` (gzip ~40kB) 를 포함하고 있어 추가 1.5kB 는 허용 범위. 직접 구현의 유지보수 부담 대비 이득 명확.
- **근거 3 — SemVer 안정성 + Next.js 15 호환 검증**: next-themes v0.3+ 는 Next.js 13/14/15 App Router 호환 공식 확인. 본 프로젝트 `next ^15.1.0` + `react ^18.3` 와 정합.
- **대안 비교**: 직접 구현 시 ① cookie SSR 초기값 주입, ② `<script>` 인라인 hydration 방어, ③ useTheme hook 추상화, ④ storage 동기화, ⑤ cross-tab sync 를 모두 자체 작성 — 최소 3~4 인·일 + 리스크 높음. 거절.
- R6 ~ R8 에 반영. Screening §8-4 리스크 "기술적 2 (SSR hydration mismatch)" 직접 완화.

### 4-2. 초기 모드 — **`prefers-color-scheme` 시스템 follow + 수동 토글 병행 (확정)**

- **결정**: next-themes `defaultTheme="system"` + `enableSystem`. 최초 방문자는 OS 설정에 따라 라이트/다크 자동 선택. 사용자가 토글 사용 시 선택 값이 localStorage 에 저장되어 다음 방문부터 우선.
- **근거 1 — 사용자 선호 존중 + 접근성 원칙**: WCAG 2.2 가이드라인 및 Apple HIG · Material Design 공통 원칙 — 시스템 설정은 사용자의 접근성 선택 (시력·눈부심·야간 근무 등) 을 반영하는 1 차 signal. 강제 라이트/강제 다크는 접근성 후퇴.
- **근거 2 — IDEA §4-2 "사용자 선호 대응" 직접 실현**: 주간/야간 환경 구분이 자동으로 되면서 수동 override 로도 개인 취향 수용. IDEA §1 이슈 [1] "`prefers-color-scheme: light` 환경에서 다크 팔레트 노출" 을 근본 해소.
- **근거 3 — 실험적 전면 라이트 교체 대비 전환 비용 낮음**: "강제 라이트 기본" 을 선택하면 기존 다크 방문자 (Phase 3 베타 사용자 다수 다크 환경) 의 경험이 급변 — 리텐션 리스크. 시스템 follow 는 기존 다크 사용자는 다크 유지, 라이트 환경 사용자만 전환되어 이탈 리스크 없음.
- **대안 비교**: ① 강제 라이트 기본 (거절 — 기존 다크 환경 방문자 이탈 리스크), ② 토글만 표시 + defaultTheme=dark (거절 — 라이트 선호 사용자가 토글 발견 전까지 다크 노출), ③ 시스템 follow + 토글 없음 (거절 — IDEA §3-D "트리거 UI" 범위 포함 요구).
- R7 에 반영. Screening §8-4 리스크 "비즈니스 (전환 트리거 방식 결정 지연)" 직접 완화.

### 4-3. SSR hydration mismatch 대응 — **3 중 방어 조합 (확정)**

- **결정**: 다음 3 가지를 **모두** 적용한다.
  1. `<html suppressHydrationWarning>` (next-themes 표준 패턴 — `layout.tsx` 의 html 태그)
  2. `<ThemeProvider ... disableTransitionOnChange>` (테마 전환 순간 transition 차단으로 flash 최소화)
  3. `ThemeToggle` 컴포넌트 내 `mounted` state (`useEffect` 로 마운트 후에만 아이콘 렌더 — 서버 렌더에는 placeholder, 클라이언트 마운트 후 sun/moon)
- **근거 1 — 각 방어의 역할 분담**:
  - `suppressHydrationWarning` 은 **React 의 경고만 억제** (실제 hydration 은 여전히 일어남). next-themes 가 `<script>` 태그로 `data-theme` 을 동기 주입하므로 서버/클라이언트 최종 DOM 은 일치.
  - `disableTransitionOnChange` 는 **시각 flash 억제**. 테마 전환 시점에 모든 CSS transition duration 을 순간적으로 0 으로 강제해 색상 섞임 방지.
  - `mounted` state 는 **아이콘 자체의 mismatch 방어**. 서버 렌더 시점에는 현재 테마를 알 수 없어 sun/moon 중 어느 것을 그릴지 확정 불가 → 마운트 후에만 그려 경고 원천 차단.
- **근거 2 — 세 방어 모두 표준 패턴**: shadcn/ui 공식 theming 가이드 및 next-themes 공식 README 권장 조합. 커스텀 대응 없음.
- **근거 3 — 검증 경로 확보**: R19 (SSR 초기 렌더 테스트) 로 회귀 방지. cookie 없는 최초 방문 · localStorage 값 존재 방문 · OS 다크·라이트 4 개 조합 모두 테스트.
- R7, R8, R9 에 반영. Screening §8-4 리스크 "기술적 2" 심화 완화.

### 4-4. 전환 트리거 UI 배치 — **navbar 우측 상단 (확정)**

- **결정**: `ThemeToggle` 을 navbar 의 **우측 상단** 에 배치. footer · 전면 자동 전환은 거절.
- **근거 1 — 발견성 (discoverability)**: navbar 는 스크롤 위치 무관 지속 노출 (특히 `sticky` 적용 시). 라이트 모드 사용자는 다크 상태에서 landing 진입 시 즉시 토글을 발견해 전환 가능. footer 배치 시 스크롤 필요 — 사용자가 다 읽기 전에 이탈할 가능성 있어 접근성 후퇴.
- **근거 2 — 업계 관행**: GitHub·Vercel·Stripe·Linear 등 주요 SaaS 랜딩 페이지가 공통적으로 navbar 우측 (로그인/CTA 근처) 에 테마 토글 배치. 사용자 학습 곡선 0.
- **근거 3 — 전면 자동 전환 거절 근거**: "전면 자동 전환" (scroll 트리거 등) 은 사용자 의도 무관 상태 변화로 혼란 유발 + `prefers-reduced-motion` 사용자에게 접근성 위반. 기술적으로도 구현 난이도 높고 테스트 부담 큼.
- **대안 비교**: footer (거절 — 발견성 부족), settings 페이지 (거절 — landing 은 settings 페이지 없음), 전면 자동 (거절 — 접근성·혼란).
- R10 에 반영.

### 4-5. 토글 아이콘 — **lucide-react 의 Sun/Moon 컴포넌트 (확정)**

- **결정**: `import { Sun, Moon } from 'lucide-react'` 를 사용. sun (라이트 모드 표시) / moon (다크 모드 표시) 아이콘.
- **근거 1 — 기존 icon lib 재사용 (Non-Duplication)**: `package.json` 에 `lucide-react ^0.474.0` 이미 존재 (다른 컴포넌트에서 사용 중 추정). 신규 아이콘 라이브러리 추가는 번들 중복 + `golden-principles.md` #13 Non-Duplication 위반. lucide-react 는 tree-shakable 이므로 추가 아이콘 2 개 비용 무시 가능.
- **근거 2 — 시각 관습**: sun/moon 은 테마 토글의 **사실상 표준 아이콘** — 사용자가 라벨 없이도 기능을 즉시 인지. 대안 (낮/밤 그림 · 밝기 조절 슬라이더 등) 은 학습 곡선 유발.
- **근거 3 — 접근성**: lucide-react 의 아이콘은 SVG 기반 + 크기 조정 가능 + `aria-label` 로 보조 — 시각 장애 사용자에게도 버튼 의미 전달 (R12 와 정합).
- **대안 비교**: 자체 SVG (거절 — 유지보수 부담), react-icons (거절 — 중복 의존성), 이모지 (거절 — 플랫폼별 렌더링 차이).
- R11 에 반영.

### 4-6. 섹션별 PR 분할 경계 — **6 개 PR 권장 (확정)**

- **결정**: 섹션별 PR 을 다음 6 개로 분할한다. 각 PR 은 독립 axe-core 라이트 모드 0 violations 검증.
  1. **PR-1 Infrastructure** — `src/app/globals.css` (토큰 이중화 R1~R4) + `src/app/layout.tsx` (ThemeProvider R7~R8) + `package.json` (next-themes 추가 R6) + 토큰 매핑 결정표 (R14) 확정 + 실험 검증 (R5)
  2. **PR-2 Navbar + ThemeToggle** — navbar 파일 + `src/components/ThemeToggle.tsx` (R9~R12) + navbar 자체의 토큰 치환
  3. **PR-3 Hero + Features** — hero 섹션 + features 섹션의 토큰 치환 + 해당 범위 axe-core
  4. **PR-4 Pricing + Testimonials** — pricing 섹션 + testimonials 섹션의 토큰 치환 + 해당 범위 axe-core
  5. **PR-5 Footer + Shared UI** — footer 섹션 + `src/components/ui/` 공용 컴포넌트 (shadcn 류) 토큰 치환 + 해당 범위 axe-core
  6. **PR-6 Dash-Preview 7 파일** — `datetime-card.tsx` / `estimate-info-card.tsx` / `settlement-section.tsx` / `transport-option-card.tsx` / `order-form/index.tsx` / `preview-chrome.tsx` / `interactive-tooltip.tsx` + dash-preview 전용 axe-core. **F5 완료 후 merge** (F5 가 `ai-panel/index.tsx` · `hit-areas.ts` 정리 선행 — Epic §2 F1↔F5 `✓` 병렬 가능하되 PR 순서는 F5 선행)
- **근거 1 — 머지 충돌 최소화 (Epic §6 리스크 1 완화)**: 각 PR 이 독립 섹션 범위 → 동시 리뷰 가능 + F2/F3/F4 Phase B/C 진입 시 PR-6 dash-preview 가 이미 merge 된 상태. F1↔F2/F3/F4 `△` 충돌 가능성 해소.
- **근거 2 — 각 PR 의 TDD 루프 가능한 최소 단위**: 섹션별 스냅샷 + axe-core 검증을 PR 당 독립 수행 가능. PR-1 (Infrastructure) 는 TDD 진입 전 필수 기반이므로 최우선 merge.
- **근거 3 — D+7 시점 진척 평가 가능**: Screening §8-4 리스크 "일정 6 (Phase A 2주 타이트)" 완화책으로 제안된 D+7 평가 시점에 PR-1 ~ PR-3 가 merge 된 상태라면 궤도 정상, PR-1 도 못 끝난 상태면 1주 연장 즉시 판단.
- **경계 결정 근거 — 왜 5 개나 7 개가 아닌 6 개인가**:
  - Hero + Features 묶음 (PR-3): 두 섹션 모두 상단 visual heavy — 토큰 적용 영향권이 유사 + 한 번의 시각 회귀 검증 배치 가능.
  - Pricing + Testimonials (PR-4): 카드 기반 컴포넌트 공유 패턴 (`bg-card` 등) — 같은 토큰 매핑 반복 검증.
  - Footer + Shared UI (PR-5): footer 는 작고 shared UI 는 공용 — 묶지 않으면 너무 작은 PR 2 개.
  - Dash-preview (PR-6): 7 개 파일이 같은 디렉터리 + F5 의존성 → 독립 PR 필요.
  - 더 나눌 경우 PR 수 8+ 로 리뷰 오버헤드 급증, 더 합칠 경우 PR 당 파일 수 급증 + diff 가 300 줄 초과.
- R15 에 반영. IDEA §3-C "섹션별 PR 분할 (hero / features / pricing / footer / dash-preview 등 5~6 개 PR)" + Screening §8-4 완화책 모두 충족.

---

## 5. 실현 가능성 평가

### 5.1 아키텍처 정합성

**OK (단 Tailwind 4 정합 검증 필요)**. 변경 범위가 ① CSS 변수 토큰 레이어 (`globals.css` 디자인 시스템 경계), ② app shell (`layout.tsx` Provider 주입), ③ presentation 레이어 (`src/components/**` className 치환) 에 한정되어 Rich Domain Model · Hexagonal Architecture 계약 (도메인 레이어 ↔ 인프라 레이어 분리) 에 영향 없음. ThemeProvider 는 외부 경계 (React context) 에 위치 — 도메인 로직 불변.

**단, 주의**: IDEA §6 범위 항목에 "`tailwind.config.ts`" 가 명시되어 있으나, 본 프로젝트는 **Tailwind 4** (`@tailwindcss/postcss` + `tailwindcss ^4.0.0`) 를 사용하며 별도 `tailwind.config.ts` 파일이 **존재하지 않는다** (`globals.css` 의 `@theme inline` 블록이 테마 설정을 대체). R1~R5 는 이 현실에 맞춰 `globals.css` 기반으로 재서술되었다. PRD 단계에서 IDEA 의 `tailwind.config.ts` 표현을 Tailwind 4 `@theme` 방식으로 정정 기록 필요.

### 5.2 주요 기술 리스크

| 리스크 | 발생 조건 | 완화 방법 |
|--------|----------|----------|
| **Tailwind 4 `@theme inline` 와 `[data-theme="dark"]` 런타임 오버라이드 정합 불일치** (Screening §8-4 기술 3) | Tailwind 4 빌드 시점 토큰 해석이 런타임 `data-theme` 셀렉터를 무시하거나 특이성 경쟁 발생 | R5 — PR-1 (Infrastructure) 최초 단계에서 **실험 검증** (또는 SPIKE-THEME-01 spike 모드, IMP-KIT-036 budget 1 일 hard cap). 최소 1 개 컴포넌트 (예: navbar 배경) 에 토큰 이중화 적용 → 런타임 토글 확인 → 문제 시 대안 (`darkMode: 'selector'` 스타일 강제 우선순위 + `@layer` 활용 등) 평가 |
| **SSR hydration mismatch 경고** (Screening §8-4 기술 2) | 서버 렌더 시점에 테마 미확정 → 아이콘/배경이 클라이언트 마운트 후 변경 → React 경고 | 결정 포인트 §4-3 **3 중 방어** (suppressHydrationWarning + disableTransitionOnChange + mounted state). R19 회귀 테스트로 지속 모니터링 |
| **landing 전역 grep 스윕에서 동적 클래스 누락** (Screening §8-4 기술 1) | `cn({ 'bg-white/5': isActive })` 류 조건부 + template literal 내부 + `clsx()` 동적 구성 → grep 패턴 탈락 | R13, R16 — **3 중 grep** (기본 문자열 + 이스케이프 처리 + `cn/clsx` 호출 주변 문맥 grep). 섹션별 PR 리뷰 시 각 PR axe-core 실행 → 누락 감지 루프 + 토큰 매핑 결정표 (R14) 를 체크리스트화 |
| **next-themes 와 Next.js 15 Turbopack dev 서버 호환** | `next dev --turbopack` 모드에서 `<script>` 인라인 주입 방식이 예상과 다르게 동작 | PR-1 단계에서 `pnpm dev` (turbopack) + `pnpm build && pnpm start` (production) 양쪽 검증. 문제 시 issue 제출 + `next-themes` downgrade 또는 직접 구현 폴백 평가 |
| **F5 와의 PR 순서 충돌 (`ai-panel/index.tsx` · `hit-areas.ts`)** | F1 의 PR-6 (dash-preview 7 파일) 이 F5 의 `ai-panel` 정리 전에 merge → F5 에서 다시 토큰 치환 + JSON 뷰어 제거 중첩 편집 | PR-6 merge 는 **F5 완료 이후** 로 일정 고정 (결정 포인트 §4-6 확정). Phase A D+1 ~ D+4 에 F5 완료 목표 → D+5 부터 PR-6 시작 |
| **접근성 WCAG AA 미달 (특히 라이트 팔레트 텍스트 대비)** | R14 토큰 매핑 결정표의 라이트 팔레트 값 선정 시 `text-muted-foreground` 계열 대비 비율 AA (4.5:1) 미달 | R17 axe-core 각 PR 별 검증 + PRD 단계에서 **라이트 팔레트 값 후보** 를 대비 비율 미리 계산해 결정표에 기록 (각 값별 background 대비 4.5:1 이상 확보 확인) |

### 5.3 대략 작업 범위

| 영역 | 해당 | 비고 |
|------|:---:|------|
| 화면 (컴포넌트 렌더) | ✅ | **landing 전역 수십 파일** — hero · features · pricing · testimonials · footer · navbar + dash-preview 7 파일 + shared UI |
| Mock 데이터 | ❌ | 해당 없음 (F2/F3 범위) |
| 테스트 | ✅ | axe-core 라이트 모드 회귀 + 스냅샷 매트릭스 (뷰포트 5 × 테마 2 = 10) + SSR 초기 렌더 테스트 |
| API | ❌ | 해당 없음 |
| DB 스키마 | ❌ | 해당 없음 |
| 외부 연동 | ✅ (의존성) | **next-themes** 신규 npm dependency 추가 (결정 포인트 §4-1) — 외부 서비스 API 호출 아닌 패키지 의존성 |
| 디자인 토큰 레이어 | ✅ | `src/app/globals.css` 토큰 이중화 (R1~R5) — Tailwind 4 `@theme inline` 기반 |
| app shell | ✅ | `src/app/layout.tsx` ThemeProvider 주입 (R6~R8) |
| 신규 컴포넌트 | ✅ | `src/components/ThemeToggle.tsx` (R9~R12) |

예상 TASK 수: **6~8 건** (`T-THEME-01 ~ T-THEME-08`) — Epic Phase A §9 예측 ("F1 약 6~8 건") 과 일치. 섹션별 PR 6 개가 TASK 에 1:1 또는 분할 대응.

**Epic 지표 4 (landing 전역 라이트/다크 양 팔레트 + 전환 경로, axe-core 0 violations) 직접 단독 대응** — F1 Kill 시 Epic Phase A 목표 (M-Epic-1, 2026-05-06) 자동 실패.

---

## 6. 생성된 파일

- **Draft 본 파일**: `.plans/drafts/f1-landing-light-theme/01-draft.md` (본 문서)
- **Routing metadata**: `.plans/drafts/f1-landing-light-theme/07-routing-metadata.md`
- 재실행 백업: 해당 없음 (최초 작성)

---

## 7. 다음 단계

본 Draft 승인 후 **Standard 경로** 를 따른다 (PRD 필수):

```bash
# Phase A Step 6 — PRD 상세 작성 (필수)
/plan-prd .plans/drafts/f1-landing-light-theme/

# Phase A Step 7 — Bridge (개발 핸드오프)
/plan-bridge f1-landing-light-theme

# Phase A Step 9 — 구현 (F5 와 병렬)
/dev-feature .plans/features/active/f1-landing-light-theme/
```

`/plan-prd` 필수 근거: Standard Lane 확정 (§1) + Epic Phase A §6 "F1 만 Standard → PRD 필수" + 결정 포인트 6 건 확정값을 PRD 10 섹션 (Overview / Problem / Goals / User Stories / Requirements / UX / Tech / Milestones / Risks / Success Metrics) 으로 전개 필요. PRD 작성 시 **Epic §2 성공 지표 4 인용** (IMP-AGENT-011).

PRD 단계 주요 확장 항목:
- **Requirements 섹션**: R13 landing 전역 grep 후보 → R14 토큰 매핑 결정표 전수 (각 행: 파일 경로 + 라인 + 현재 → 토큰) 작성
- **UX 섹션**: 결정 포인트 §4-4 (navbar 우상단) + §4-5 (sun/moon) 시각화 — wireframe 또는 Figma 대체 sketch
- **Tech 섹션**: 결정 포인트 §4-1 (next-themes API 상세) + §4-3 (3 중 hydration 방어 상세) + R5 (Tailwind 4 실험 검증 계획)
- **Milestones 섹션**: 결정 포인트 §4-6 (6 개 PR 경계) + D+7 진척 평가 기준 + M-Epic-1 (2026-05-06) 완료 조건
- **Success Metrics 섹션**: axe-core 0 violations (landing 전역) + 스냅샷 매트릭스 10 건 회귀 + 번들 사이즈 증분 (next-themes ~1.5kB) 예산 명시

---

## 8. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-23 | 초안 — 3 중 판정 (Standard / 시나리오 A / dev / hybrid false) + 유저 스토리 5 건 + 러프 요구사항 19 건 + 결정 포인트 6 건 확정 + 실현 가능성 평가 (Phase A Step 5, F1 부분) |
