# 02. Scope Boundaries — Hero 섹션 liquid gradient 배경

> 본 Feature의 In-scope / Out-of-scope 경계. 이 경계를 넘는 편집은 `/dev-feature`에서 재승인이 필요하다.

---

## 1. In-scope

### 1-A. Hero background layer

| 영역 | 허용 변경 |
|---|---|
| `src/components/sections/hero.tsx` | decorative liquid gradient layer mount, layer ordering, CTA/preview layering 유지 |
| `src/components/shared/gradient-blob.tsx` | fallback 유지 또는 static/reduced-motion 대안으로 조정 |
| 신규 shared visual component | 필요 시 `src/components/shared/hero-liquid-gradient-background.tsx` 같은 작은 presentation component 추가 |

### 1-B. Theme token / CSS

| 영역 | 허용 변경 |
|---|---|
| `src/app/globals.css` | 기존 `--landing-accent-*` / `--color-accent-*` token 사용 또는 `--hero-gradient-*` token 추가 |
| `:root` / `[data-theme="dark"]` | 새 token이 생기면 양쪽 theme 값 동시 정의 |

### 1-C. Tests

| 영역 | 허용 변경 |
|---|---|
| `src/components/sections/__tests__/hero.test.tsx` | background layer render, `pointer-events-none`, layer class, CTA/preview 유지 테스트 |
| `src/__tests__/light-theme.test.tsx` | 새 theme token 또는 light/dark token alignment 테스트가 필요할 때만 최소 추가 |

### 1-D. Evidence

| 영역 | 허용 변경 |
|---|---|
| `.plans/features/active/hero-liquid-gradient-background/**` | 구현 전/후 notes, QA evidence |
| `.plans/drafts/hero-liquid-gradient-background/evidence/**` | CodePen reference capture 재시도 결과 추가 |

## 2. Out-of-scope

- Hero 전체 layout 재설계.
- `DashboardPreview` 내부 컴포넌트 교체 또는 flow 변경.
- `src/components/dashboard-preview/**` 내부 구현 변경.
- CodePen의 heading, controls, color panel, footer, custom cursor 이식.
- `Three.js`, WebGL, canvas shader runtime dependency 추가.
- backend/API/auth/database/analytics 변경.
- user-facing theme 또는 color control UI 추가.
- 전역 visual system 재설계.

## 3. Allowed Target Paths

| 구분 | 경로 |
|---|---|
| Hero section | `src/components/sections/hero.tsx` |
| Shared visual | `src/components/shared/gradient-blob.tsx` |
| Shared visual | `src/components/shared/hero-liquid-gradient-background.tsx` |
| Theme/CSS token | `src/app/globals.css` |
| Tests | `src/components/sections/__tests__/hero.test.tsx` |
| Tests | `src/__tests__/light-theme.test.tsx` |
| Plan evidence | `.plans/features/active/hero-liquid-gradient-background/**` |
| Reference evidence | `.plans/drafts/hero-liquid-gradient-background/evidence/**` |

## 4. Explicitly Disallowed Paths

| 경로 | 이유 |
|---|---|
| `src/components/dashboard-preview/**` | 본 Feature는 preview 내부 기능 변경이 아니라 hero background layer 변경 |
| `package.json` / lockfile | CSS-first MVP에서 새 runtime dependency 추가 금지 |
| `src/components/providers/theme-provider.tsx` | 기존 theme provider 동작 유지 |
| `src/app/layout.tsx` | 기존 `ThemeProvider` 구성 유지 |
| 신규 backend/API 경로 | visual-only Feature 범위 밖 |

## 5. 병렬 작업 충돌 규칙

`src/app/globals.css`는 F1 light-theme token의 source of truth다. 새 token을 추가할 때는 기존 `--landing-*` / `--color-*` 체계를 우선 사용하고, 중복 token을 만들지 않는다. `src/components/sections/hero.tsx`는 hero copy/CTA/layout 변경과 충돌할 수 있으므로, background layer 추가와 layer ordering 외의 변경은 `/dev-feature`에서 별도 확인한다.
