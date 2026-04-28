# 00. Feature Package Overview - Hero 섹션 liquid gradient 배경

> **Feature slug**: `hero-liquid-gradient-background`
> **Lane**: Lite
> **Scenario**: B (기존 `GradientBlob` 배경 보강)
> **Feature type**: dev
> **작성일**: 2026-04-27
> **작성자**: Codex (`/dev-feature` 대응)
> **승인 근거**: 사용자 "1" 선택에 따라 Bridge 이후 Feature Package 확정

---

## 1. 한 줄 요약

Hero 섹션에 CSS-first liquid gradient background layer를 추가하되, 기존 `GradientBlob` fallback, light/dark theme token, reduced motion, stacking context, theme toggle 안정성을 함께 고정한다.

---

## 2. Structure Mode

| 항목 | 값 |
|---|---|
| Workspace Topology | `monorepo-leaf-single-app` |
| Structure Mode | `hybrid` (type-based outer + feature-scoped pocket) |
| Layer Style | `layered` |

본 Feature는 새 app 구조, backend, shared package를 만들지 않는다. 기존 landing section layer와 shared visual layer, theme token source만 사용한다.

---

## 3. Allowed Target Paths

상세 SSOT는 [`06-architecture-binding.md`](../00-context/06-architecture-binding.md)다. 구현자는 아래 경로 밖으로 확장하지 않는다.

### 3-1. 수정 가능

```txt
src/components/sections/hero.tsx
src/components/shared/gradient-blob.tsx
src/components/shared/hero-liquid-gradient-background.tsx
src/app/globals.css
```

### 3-2. 테스트

```txt
src/components/sections/__tests__/hero.test.tsx
src/__tests__/light-theme.test.tsx
```

### 3-3. Plan evidence

```txt
.plans/features/active/hero-liquid-gradient-background/**
.plans/drafts/hero-liquid-gradient-background/evidence/**
```

### 3-4. 금지

```txt
src/components/dashboard-preview/**
package.json
lockfile
tailwind.config.ts
src/components/providers/theme-provider.tsx
src/app/layout.tsx
backend route, persistence, API, analytics
```

---

## 4. Layer Mapping

| 레이어 | 경로 | 변경 성격 |
|---|---|---|
| Presentation / Section | `src/components/sections/hero.tsx` | background layer mount, layer ordering |
| Presentation / Shared | `src/components/shared/**` | reusable visual component 또는 fallback |
| Theme / CSS | `src/app/globals.css` | theme token, reduced-motion CSS |
| Tests | allowed test paths | rendering, token, theme, layer 검증 |

---

## 5. Stack Contract

| 영역 | 계약 |
|---|---|
| Language | TypeScript |
| Framework | Next.js 15 App Router + React 18 |
| Styling | Tailwind 4 (`@theme inline`, CSS variable token, `tailwind.config.ts` 금지) |
| Theme | `next-themes` + `data-theme` |
| Animation | CSS-first, `framer-motion` 추가 사용은 기존 Hero 흐름 유지 수준 |
| Test | Vitest + jsdom |
| Dependency | 신규 runtime dependency 추가 없음 |

---

## 6. Shared vs Local Rule

- 새 background가 Hero 전용이면 `src/components/shared/hero-liquid-gradient-background.tsx`처럼 작은 shared visual component로 둔다.
- 다른 section 재사용 요구가 생기기 전까지 public API를 넓히지 않는다.
- CSS token은 `src/app/globals.css`의 기존 `--landing-*` / `--color-*` 체계를 우선 사용한다.
- 새 `--hero-gradient-*` token이 필요하면 `:root`와 `[data-theme="dark"]` 양쪽에 동시에 정의한다.

---

## 7. 요구사항 추적

| REQ | TASK | TC |
|---|---|---|
| REQ-hero-liquid-gradient-background-001 | T-HLG-COMP-03 | TC-HLG-01 |
| REQ-hero-liquid-gradient-background-002 | T-HLG-TEST-01, T-HLG-COMP-03 | TC-HLG-02 |
| REQ-hero-liquid-gradient-background-003 | T-HLG-COMP-03, T-HLG-MOTION-04 | TC-HLG-03 |
| REQ-hero-liquid-gradient-background-004 | T-HLG-COMP-03 | TC-HLG-08 |
| REQ-hero-liquid-gradient-background-005 | T-HLG-MOTION-04 | TC-HLG-04 |
| REQ-hero-liquid-gradient-background-006 | T-HLG-TOKEN-02 | TC-HLG-05 |
| REQ-hero-liquid-gradient-background-007 | T-HLG-COMP-03, T-HLG-QA-05 | TC-HLG-06 |
| REQ-hero-liquid-gradient-background-008 | T-HLG-COMP-03, T-HLG-QA-05 | TC-HLG-07 |
| REQ-hero-liquid-gradient-background-009 | T-HLG-MOTION-04, T-HLG-QA-05 | TC-HLG-09 |
| REQ-hero-liquid-gradient-background-010 | T-HLG-QA-05 | TC-HLG-10 |
| REQ-hero-liquid-gradient-background-011 | T-HLG-TOKEN-02, T-HLG-QA-05 | TC-HLG-05 |
| REQ-hero-liquid-gradient-background-012 | T-HLG-TOKEN-02 | TC-HLG-11 |
| REQ-hero-liquid-gradient-background-013 | T-HLG-TEST-01, T-HLG-COMP-03 | TC-HLG-12 |
| REQ-hero-liquid-gradient-background-014 | T-HLG-TOKEN-02, T-HLG-QA-05 | TC-HLG-13 |
| REQ-hero-liquid-gradient-background-015 | T-HLG-QA-05 | TC-HLG-14 |
| REQ-hero-liquid-gradient-background-016 | T-HLG-QA-05 | TC-HLG-15 |

---

## 8. 경로 계약 (`/dev-run` 필요 정보)

| 항목 | 값 |
|---|---|
| Feature root | `.plans/features/active/hero-liquid-gradient-background/` |
| Dev tasks SSOT | `02-package/08-dev-tasks.md` |
| Test cases SSOT | `02-package/09-test-cases.md` |
| Architecture binding | `00-context/06-architecture-binding.md` |
| Requirements SSOT | `02-package/01-requirements.md` |

---

## 9. 일관성 점검

| 항목 | PRD/Bridge | Package | 판정 |
|---|---|---|---|
| Lane | Lite | Lite | 일치 |
| Feature type | dev | dev | 일치 |
| REQ 개수 | 16 | 16 | 일치 |
| 예상 TASK | 5 | 5 | 일치 |
| WebGL deferred | deferred | dependency 금지 | 일치 |
| Theme 대응 | REQ-011~014 | token/theme QA TASK | 일치 |
| DashboardPreview 보호 | 내부 변경 금지 | disallowed path 명시 | 일치 |

---

## 10. 다음 단계

```bash
/dev-run .plans/features/active/hero-liquid-gradient-background/
```

구현은 TDD 순서로 진행한다. 특히 `T-HLG-TEST-01`과 `T-HLG-TOKEN-02`가 먼저 실행되어야 theme/layering 회귀를 조기에 잡을 수 있다.
