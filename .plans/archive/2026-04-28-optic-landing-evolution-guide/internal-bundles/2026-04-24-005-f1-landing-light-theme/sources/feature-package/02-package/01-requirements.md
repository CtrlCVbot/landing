# 01. Requirements — F1 라이트 모드 전환 인프라

> **SSOT for requirements**. PRD §5의 REQ-001~014 + NFR-001~010 + SM-1~10을 본 Feature Package의 구현 단위로 번역.
> 원본 PRD: [`../../../../drafts/f1-landing-light-theme/02-prd.md`](../../../../drafts/f1-landing-light-theme/02-prd.md).
> freeze 스냅샷: [`../00-context/01-prd-freeze.md`](../00-context/01-prd-freeze.md).

---

## 1. Functional Requirements (14건)

### REQ-001 — `@theme inline` 변수 간접화

`src/app/globals.css` 의 `@theme inline` 블록에서 **13개 직접값 색상 토큰**을 `var(--landing-*)` 참조로 교체한다. shadcn alias 7개(`--color-primary`, `--color-secondary`, `--color-primary-foreground`, `--color-secondary-foreground`, `--color-accent-foreground-shadcn`, `--color-input`, `--color-ring`)는 이미 `var(--color-*)` 참조 중이므로 하위 토큰 이중화로 라이트/다크 전환을 **자동 상속**한다. radius/font 변수는 색상이 아니므로 이중화 대상 아님 (decision-log D-005 참조).

**수용 기준**:
- `grep -n "var(--landing-" src/app/globals.css` → 13 라인 (코드 기준, 주석 제외)
- `pnpm build` 성공

### REQ-002 — `:root` 라이트 팔레트

`:root { --landing-*: ...; }` 에 라이트 팔레트 **13개** 변수 신규 정의.

**수용 기준**:
- WCAG AA 대비 ≥ 4.5:1 (텍스트) / ≥ 3:1 (UI) 확보 (토큰 매핑 결정표 REQ-013)
- axe-core color-contrast 라이트 모드 0 violations

### REQ-003 — `[data-theme="dark"]` 다크 팔레트

`[data-theme="dark"] { --landing-*: ...; }` 에 다크 팔레트 **13개** 변수 정의 (기존 다크 값 이관).

**수용 기준**:
- 기존 다크 렌더 스냅샷 **100% 일치** (회귀 없음)

### REQ-004 — `next-themes` dependency

`package.json` 에 `next-themes ^0.3.0` 추가.

**수용 기준**:
- `pnpm install` 성공
- 번들 증분 ≤ 1.8 kB gzipped (next-themes 단독, NFR-003 목표 2 kB 내)

### REQ-005 — ThemeProvider 주입

`src/app/layout.tsx` 에 `<ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>` 래퍼 추가.

**수용 기준**:
- 4개 속성 모두 명시
- Provider 순서: `ThemeProvider > MotionProvider > children`

### REQ-006 — `<html suppressHydrationWarning>`

`src/app/layout.tsx` 의 `<html>` 태그에 `suppressHydrationWarning` 속성 추가.

**수용 기준**:
- dev/production 콘솔 hydration 경고 0건 (NFR-004)

### REQ-007 — ThemeToggle 컴포넌트

`src/components/ThemeToggle.tsx` 신규 작성.

**수용 기준**:
- `useTheme()` hook 사용
- `mounted` state 방어 (`useEffect(() => setMounted(true), [])`)
- `aria-label="테마 전환"` 존재
- focus-visible ring 적용

### REQ-008 — 배치

navbar 우측 상단 액션 영역에 `<ThemeToggle />` 배치 (sticky 노출).

**수용 기준**:
- 5 뷰포트 (1440/1280/1024/768/390) 모두 가시
- 768/390 hamburger menu와 상대 위치 확정

### REQ-009 — 아이콘

`lucide-react` 의 `Sun` / `Moon` 컴포넌트 사용, 24×24 크기.

**수용 기준**:
- 현재 테마 dark → `<Sun />` 렌더 / light → `<Moon />` 렌더
- Non-Duplication: 기존 dep 재사용 (`lucide-react ^0.474` 이미 설치)

### REQ-010 — landing 섹션 전역 토큰 치환

`src/components/sections/*.tsx` 전수의 다크 하드코딩 클래스를 토큰 클래스로 치환.

**치환 규칙**:
```
bg-white/5          → bg-card/50 (또는 bg-muted/50)
text-white          → text-foreground
from-gray-900/50    → from-background/50
to-gray-900/50      → to-background/50
border-gray-800     → border-border
bg-gray-900         → bg-card
bg-black            → bg-background
text-gray-300/400   → text-muted-foreground (WCAG 검증 전제)
```

**수용 기준**:
- 3중 grep (REQ-014) 0 결과
- axe 라이트 모드 0 violations

### REQ-011 — dash-preview 7파일 치환

`src/components/dashboard-preview/` 의 7파일 ([08-dev-tasks.md T-THEME-08](./08-dev-tasks.md#t-theme-08)) 토큰 치환.

**수용 기준**:
- F5 merge 선행 완료 확인
- 기존 다크 스냅샷 100% 일치
- axe 라이트 모드 0 violations

### REQ-012 — shared UI 전수 치환

`src/components/ui/*.tsx`, `src/components/shared/*.tsx` 전수의 다크 하드코딩 토큰 치환.

**수용 기준**:
- 3중 grep 0건
- shadcn UI alias 정합 (`--color-primary` 등)

### REQ-013 — 토큰 매핑 결정표 (PR-1 포함)

각 다크 하드코딩 클래스 → 토큰 클래스 매핑을 결정표로 작성 (파일 경로 + 라인 + 현재 클래스 + 토큰 + WCAG 대비 비율).

**수용 기준**:
- PR-1 에 포함 (T-THEME-03 산출물)
- WCAG AA 4.5:1 확보 확인

### REQ-014 — 3중 grep 스윕

다크 하드코딩 잔존을 3중 grep 으로 전수 검증.

**검증 명령**:
```bash
# (1) 기본 문자열
grep -rn "bg-white\|text-white\|from-gray\|to-gray\|border-gray\|bg-black\|bg-slate\|border-white\|ring-gray" src/
# (2) cn/clsx 동적 조건부
grep -rn "cn({ *'bg-white\|cn({ *'text-white" src/
# (3) template literal 동적
grep -rn '`.*\${.*}.*bg-white\|`.*\${.*}.*text-white' src/
```

**수용 기준**:
- 3 명령 모두 0 결과 (Phase A 종료 시점)

---

## 2. Non-Functional Requirements (10건)

| NFR | 내용 | 목표 | 검증 |
|-----|------|------|------|
| NFR-001 | axe 라이트 모드 landing 전역 | 0 violations | TC-F1-04~08 |
| NFR-002 | FOUC 프레임 | 0 | Chrome DevTools Performance |
| NFR-003 | 번들 증분 | ≤ 2 kB gzipped | TC-F1-03 |
| NFR-004 | Hydration 경고 | 0건 | TC-F1-02 |
| NFR-005 | 전환 지연 | ≤ 100ms | Chrome DevTools Performance |
| NFR-006 | `prefers-reduced-motion` 존중 | 유지 (기존 블록 보존) | 수동 검증 |
| NFR-007 | Tailwind 4 정합 | PR-1 실험 통과 | T-THEME-03 |
| NFR-008 | dev + production 호환 | 양쪽 기동 성공 | T-THEME-03 |
| NFR-009 | WCAG AA 대비 | ≥ 4.5:1 / ≥ 3:1 | axe color-contrast |
| NFR-010 | 테스트 커버리지 | 60 스냅샷 + 6 jest-axe + 1 SSR | TC-F1-01~10 |

---

## 3. Success Metrics

PRD §10 SM-1 ~ SM-10 승계. 상세: [`../00-context/01-prd-freeze.md §2`](../00-context/01-prd-freeze.md#2-요구사항-요약-prd-5-승계).

---

## 4. Non-Goals (명시)

PRD §3 Non-Goals 승계. 상세: [`../00-context/02-scope-boundaries.md §2`](../00-context/02-scope-boundaries.md#2-out-of-scope-명시적-제외).

핵심:
- 토큰 값 스케일 재설계 (차기 Epic)
- landing 외 영역 라이트 모드
- 3번째 테마 값 정의
- F2/F3/F4/F5 범위 침범 금지 (`hit-areas.ts`, `mock-data.ts`, `preview-steps.ts`, `ai-panel/index.tsx`)

---

## 5. 요구사항 추적 (REQ ↔ TASK ↔ TC)

[`00-overview.md §7`](./00-overview.md#7-요구사항-추적-req--task--tc) 매트릭스 참조.

---

## 6. 변경 이력

| 날짜 | 변경 |
|------|------|
| 2026-04-23 | 초안 — `/dev-feature` Phase C 진입. PRD §5 승계. |
