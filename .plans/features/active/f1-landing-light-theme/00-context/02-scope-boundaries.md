# 02. Scope Boundaries — F1 라이트 모드 전환 인프라

> 본 Feature 의 **포함 범위 (In-scope)** 와 **제외 범위 (Out-of-scope)** 를 명시한다. 의사결정 SSOT 는 PRD §3 Goals / Non-Goals + §5 Requirements + §1 Overview. 본 문서는 요약 + 빠른 참조.

---

## 1. In-scope (PRD §5 Requirements 기반)

### 1-1. 디자인 토큰 레이어 (REQ-001 ~ REQ-003)

**편집 대상 파일**: `src/app/globals.css` 1 개

- **REQ-001**: `@theme inline` 블록 내 19 개 컬러 변수를 `var(--landing-*)` 로 간접화
- **REQ-002**: `:root` 블록에 **라이트 팔레트 1 세트** (19 개 `--landing-*` 변수) 신규 정의 — WCAG AA 대비 ≥ 4.5:1 (텍스트) / ≥ 3:1 (UI)
- **REQ-003**: `[data-theme="dark"]` 블록에 **다크 팔레트 1 세트** 신규 정의 (기존 `@theme inline` 다크 값 이관)

### 1-2. App Shell 레이어 (REQ-004 ~ REQ-006)

**편집 대상 파일**: `src/app/layout.tsx` + `package.json`

- **REQ-004**: `next-themes` v0.3+ 라이브러리 `package.json` dependency 추가
- **REQ-005**: `<ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>` 래퍼 추가 (Provider 순서: `ThemeProvider > MotionProvider > children`)
- **REQ-006**: `<html>` 태그에 `suppressHydrationWarning` 속성 추가

### 1-3. 전환 트리거 UI 레이어 (REQ-007 ~ REQ-009)

**편집 대상 파일**: `src/components/ThemeToggle.tsx` (신규) + navbar 컴포넌트

- **REQ-007**: `ThemeToggle.tsx` 신규 구현 — `useTheme()` hook + Sun/Moon 아이콘 + `mounted` state 방어
- **REQ-008**: navbar **우측 상단** 액션 영역에 배치 (sticky 노출)
- **REQ-009**: `lucide-react` 의 `Sun` · `Moon` 컴포넌트 사용 (기존 dep 재사용, Non-Duplication)

### 1-4. landing 전역 컴포넌트 스윕 (REQ-010 ~ REQ-014)

**편집 대상 영역 7 개 분류** (PR-2 ~ PR-6 범위):

1. **Navbar** (PR-2) — navbar 자체 토큰 치환
2. **Hero** (PR-3) — hero 섹션 토큰 치환
3. **Features** (PR-3) — features 섹션 토큰 치환
4. **Pricing** (PR-4) — pricing 섹션 토큰 치환
5. **Testimonials** (PR-4) — testimonials 섹션 토큰 치환
6. **Footer + Shared UI** (PR-5) — footer 섹션 + `src/components/ui/` 공용 컴포넌트 토큰 치환
7. **Dash-Preview 7 파일** (PR-6, **F5 merge 후**) — `datetime-card.tsx` · `estimate-info-card.tsx` · `settlement-section.tsx` · `transport-option-card.tsx` · `order-form/index.tsx` · `preview-chrome.tsx` · `interactive-tooltip.tsx`

**치환 규칙** (REQ-010 ~ REQ-012):

- `bg-white/5` → `bg-card/50` (또는 `bg-muted/50`)
- `text-white` → `text-foreground`
- `from-gray-900/50` → `from-background/50`
- `to-gray-900/50` → `to-background/50`
- `border-gray-800` → `border-border`
- `bg-gray-900` → `bg-card`
- `bg-black` → `bg-background`
- `text-gray-300` / `text-gray-400` → `text-muted-foreground` (WCAG AA 4.5:1 검증 전제)

**지원 작업** (REQ-013 ~ REQ-014):

- **REQ-013**: 토큰 매핑 결정표 (`(파일 경로 + 라인 + 현재 클래스 → 토큰 클래스 + WCAG 대비 비율)` 전수) — PR-1 에 포함
- **REQ-014**: **3 중 grep 스윕** (기본 문자열 + 이스케이프 처리 + `cn/clsx` 동적 조건부 문맥 grep) — 조건부 클래스 (`cn({ 'bg-white/5': isActive })`, template literal 내부) 누락 방지

### 1-5. 테스트 레이어 (NFR-010)

**신규 테스트 파일**: `src/tests/light-theme.test.tsx` + 6 개 섹션별 jest-axe 회귀 테스트

- **스냅샷 매트릭스**: 6 섹션 × 2 테마 (light/dark) × 5 뷰포트 (1440/1280/1024/768/390) = **60 스냅샷**
- **axe-core jest-axe**: 6 건 (섹션별 1 건, 라이트 모드 0 violations 단정)
- **SSR 초기 렌더 테스트**: 1 건 — `defaultTheme="system"` + cookie 없음 · localStorage 있음 · OS 다크·라이트 4 개 조합 커버

---

## 2. Out-of-scope (명시적 제외)

**SSOT**: [IDEA §3 Out-of-scope](../../../../ideas/00-inbox/IDEA-20260423-002.md#3-범위-scope) + [PRD §3 Non-Goals](../../../../drafts/f1-landing-light-theme/02-prd.md#3-goals--non-goals). 본 문서는 요약 승계.

### 2-1. 디자인 시스템 범위

- **대규모 디자인 시스템 리팩토링** (토큰 **값** 재설계 · 스케일 재정의 · 디자인 토큰 체계 변경) — 본 F1 은 **토큰 치환** 에 한정하며 토큰 값 선정·스케일 재설계는 포함하지 않음. **차기 Epic 후보** (Epic §3 Out-of-scope 승계).
- **3 번째 테마** (예: high-contrast 변형 · 브랜드 팔레트 확장) 실제 값 정의 — 본 F1 은 **확장 가능한 구조** (`[data-theme="high-contrast"]` 세트 추가 가능) 만 확립. 실제 3 번째 테마 값 정의는 차기 Epic.

### 2-2. 영역 범위

- **landing 이외 영역** — 관리자·대시보드·docs·별도 앱 등의 라이트 모드 대응 (별도 Feature/Epic).
- **브랜드 컬러·로고** 등 **팔레트 외 자산** 의 라이트/다크 분기 (별도 Theme 후보).
- **모바일 전용 팔레트** 분리 (Phase 5+ 후보) — 본 F1 은 뷰포트별 팔레트 분기 없음 (5 뷰포트 모두 동일 라이트/다크 2 팔레트 사용).

### 2-3. 국제화 범위

- **다국어 (i18n)** 연동 — Epic §3 Out-of-scope 승계. `ThemeToggle` 의 `aria-label="테마 전환"` 은 한국어 고정 (landing 자체가 한국어 전용).

### 2-4. 인프라 범위

- **SSR/SSG 전환** — Epic §3 Out-of-scope 승계. 현재 CSR 가정 유지.

### 2-5. F2/F3/F4/F5 범위 침범 금지

- **`autoDispatch` 로직**: F4 (레이아웃+HitArea) 범위 — 본 F1 에서 로직 변경 금지.
- **Mock 스키마 재설계** (`extractedFrame`/`appliedFrame` 분리, `PREVIEW_MOCK_SCENARIOS` 배열): F2 범위 — 본 F1 에서 구조 변경 금지. **`jsonViewerOpen` 필드 유지** (F5 에서 필드 보존 → F2 에서 일괄 이관, Epic §2 F2↔F5 `→` 근거).
- **`OPTION_FEE_MAP` 도입**: F3 범위 — 본 F1 에서 새 상수 추가 금지.
- **Hit-area 좌표 재측정**: F4 범위 — 본 F1 에서 `hit-areas.ts` bounds 수정 금지.
- **`<AiExtractJsonViewer>` 렌더 제거**: F5 범위 — 본 F1 은 파일 **유지** (토큰 치환만 대상이라면 스윕에 포함 가능).

---

## 3. 경계 판정 — 스윕 대상 여부

모호한 파일에 대한 판정 규칙:

| 파일/영역 | 스윕 포함? | 근거 |
|-----------|:---:|------|
| `src/app/page.tsx` (landing 메인) | ✅ | landing 전역 (PRD §1) |
| `src/app/layout.tsx` | ✅ | Provider 주입 + `<html>` 속성 (REQ-005/006) |
| `src/app/globals.css` | ✅ | 토큰 이중화 (REQ-001~003) |
| `src/components/**/*.tsx` (landing 섹션) | ✅ | hero · features · pricing · testimonials · footer · navbar |
| `src/components/dashboard-preview/**/*.tsx` (7 파일) | ✅ | PR-6, **F5 merge 후** |
| `src/components/ui/**/*.tsx` (shadcn 류) | ✅ | PR-5 |
| `src/components/ThemeToggle.tsx` | ✅ (신규 생성) | REQ-007 |
| `src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer.tsx` | ✅ (단, 토큰 치환만) | 파일 **유지** (F5 가 렌더 제거 — 본 F1 은 건드리지 않음) |
| `src/app/**/*/page.tsx` (landing 외 라우트) | ❌ | landing 이외 영역 (Out-of-scope §2-2) |
| `src/lib/mock-data.ts` | ❌ | F2/F3/F5 범위 (Mock 스키마 · 옵션 맵 · jsonViewerOpen 필드) |
| `src/components/dashboard-preview/hit-areas.ts` | ❌ | F4/F5 범위 (좌표 재측정 · 엔트리 제거) |
| `src/lib/preview-steps.ts` | ❌ | F2 범위 (Step 가시성 로직) |
| 단위 테스트 파일 (`*.test.tsx`) — 기존 다크 렌더 단정 | ⚠️ 조건부 | 다크 렌더 스냅샷 **100% 일치 유지** (REQ-003/011 수용 기준). 단정문 변경 필요 시 해당 섹션 PR 에 포함. |
| `tailwind.config.ts` | ❌ (파일 미존재) | Tailwind 4 — `@theme inline` 이 대체 (아래 §4 참조) |

---

## 4. Tailwind 4 기술 정정 (중요)

> **IDEA §3-A / §6 에서 언급된 `tailwind.config.ts` 는 본 프로젝트에 존재하지 않는다** (Draft §5.1 기술 정정 + PRD §7.1 명시).

- 본 프로젝트는 **Tailwind 4** (`tailwindcss ^4.0.0` + `@tailwindcss/postcss`) 기반
- 테마 정의는 `src/app/globals.css` 의 `@theme inline` 블록이 `tailwind.config.ts` 역할을 대체
- 본 Feature 의 모든 토큰 치환은 **`globals.css` 기반** 으로 수행
- 본 00-context/ 내 문서에서 `tailwind.config.ts` 언급 **금지** (Draft §5.1 + PRD §7.1 준수)

상세: [`03-design-decisions.md` §7 Tailwind 4 정정](./03-design-decisions.md) 참조.

---

## 5. 다음 단계

- [`03-design-decisions.md`](./03-design-decisions.md) — Draft §4 에서 확정된 6 결정 포인트 (next-themes · system follow · 3 중 hydration 방어 · navbar 우상단 · lucide Sun/Moon · 6 PR 분할) + Tailwind 4 정정
- [`04-implementation-hints.md`](./04-implementation-hints.md) — TASK 힌트 6~8 건 + TDD 사이클 예시 + 회귀 검증 grep
- [`08-epic-binding.md`](./08-epic-binding.md) — Epic ↔ Feature cross-reference (IMP-AGENT-010)
