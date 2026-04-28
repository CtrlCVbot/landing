# Architecture Binding: hero-01-reference-hero-refresh

> **Feature Slug**: `hero-01-reference-hero-refresh`
> **Source Architecture**: `.plans/project/00-dev-architecture.md`
> **Source PRD**: `.plans/drafts/hero-01-reference-hero-refresh/02-prd.md`
> **Status**: approved
> **Created**: 2026-04-28
> **Scope**: Standard, copy-dev hybrid, bridge completed

---

## 1. Binding Decision

이 feature는 landing page의 기존 Hero 섹션과 shared decorative background를 개선한다. 새 route나 feature pocket을 만들지 않고, 현재 구조 SSOT의 type-based section/shared component 경계를 따른다.

기본 구현 경계는 `src/components/sections/hero.tsx`, `src/components/shared/hero-liquid-gradient-background.tsx`, `src/app/globals.css`다. 구현 중 component split이 실제 복잡도를 줄이면 `src/components/shared/hero-field-layer.tsx` 같은 adjacent shared component를 만들 수 있다.

---

## 2. Selected Structure Mode

```text
hybrid
```

Landing app은 type-based outer structure와 feature pocket을 함께 사용한다. 이 feature는 기존 `sections/`와 `shared/`에 닫히는 presentation feature이며, `dashboard-preview/` pocket은 내부 기능 변경 대상이 아니다.

---

## 3. Allowed Target Paths

### Primary Editable Paths

| 경로 | 역할 | 제한 |
|---|---|---|
| `src/components/sections/hero.tsx` | Hero shell, content hierarchy, CTA와 `DashboardPreview` 배치 | product copy와 CTA 목적지는 유지 |
| `src/components/shared/hero-liquid-gradient-background.tsx` | full-bleed liquid field 구현 또는 fallback 유지 | `aria-hidden`, `pointer-events: none`, cleanup 보장 |
| `src/app/globals.css` | light/dark token, contrast veil, reduced-motion CSS fallback | Tailwind 4 `@theme inline` 구조와 충돌 금지 |
| `src/components/sections/__tests__/hero.test.tsx` | Hero DOM, CTA, exclusion guard, accessibility regression | visual screenshot을 대체하지 않음 |
| `src/__tests__/light-theme.test.tsx` | theme token regression | light/dark token이 모두 검증되어야 함 |

### Conditional Editable Paths

| 경로 | 조건 |
|---|---|
| `src/components/shared/hero-field-layer.tsx` | Canvas 2D lifecycle 또는 policy 분리가 필요할 때만 새 파일 생성 |
| `src/components/shared/hero-field-layer.test.tsx` 또는 adjacent test | Canvas lifecycle를 pure unit으로 검증할 수 있을 때만 생성 |
| `src/components/dashboard-preview/**` | Hero wrapper conflict 해결을 위한 최소 placement 조정이 필요할 때만 수정 |
| `package.json` | `WebGL/Three.js` gate가 명시 승인된 경우에만 수정 |

### Read-only / Preservation Paths

| 경로 | 정책 |
|---|---|
| `.references/design/hero-01/**` | reference only. production source로 직접 복사하지 않는다. |
| `src/components/dashboard-preview/**` | 내부 business flow와 interaction은 보존 대상이다. |
| `src/components/shared/gradient-blob.tsx` | 기존 fallback 또는 다른 section 사용 가능성을 먼저 확인한다. |
| `tailwind.config.ts` | 이 프로젝트는 Tailwind 4 CSS-first 구조라 새 config를 만들지 않는다. |

---

## 4. Recommended Test Paths

| 경로 | 검증 목적 |
|---|---|
| `src/components/sections/__tests__/hero.test.tsx` | Hero render, CTA clickability, reference exclusion DOM guard |
| `src/__tests__/light-theme.test.tsx` | light/dark theme token, CSS variable regression |
| `src/components/shared/hero-liquid-gradient-background.tsx` adjacent test if added | reduced-motion, pointer policy, canvas fallback lifecycle |
| Browser screenshot evidence | desktop/mobile, light/dark, reduced-motion visual QA |

---

## 5. Layer Mapping

| Layer | Project Path | 이 feature에서의 의미 |
|---|---|---|
| Route/App Shell | `src/app/page.tsx`, `src/app/globals.css` | page composition은 유지, global tokens만 제한적으로 수정 |
| Presentation | `src/components/sections/hero.tsx` | Hero hierarchy와 user-facing content |
| Shared Presentation | `src/components/shared/**` | decorative background field와 fallback |
| Feature Pocket | `src/components/dashboard-preview/**` | 보존 또는 wrapper-level regression 대상 |
| Test | `src/**/__tests__/**` | component/theme regression |

---

## 6. Shared Package Touch Points

없음.

이 feature는 `apps/landing` 내부에서 닫힌다. `packages/*`, API, DB, 외부 서비스는 건드리지 않는다.

---

## 7. Verification Notes

| 검증 | 명령 또는 방식 | 기대 결과 |
|---|---|---|
| Typecheck | `pnpm run typecheck` | TypeScript error 0 |
| Targeted test | `pnpm run test -- hero light-theme` 또는 관련 Vitest filter | Hero/theme regression 통과 |
| Lint | `pnpm run lint` | lint error 0 |
| Build | `pnpm run build` | production build 성공 |
| Browser screenshot | desktop/mobile light/dark/reduced-motion | no overlap, no overflow, reference-like field |
| DOM guard | test 또는 browser inspection | controls, color adjuster, custom cursor 없음 |

---

## 8. Binding Guardrails

- Background layer는 CTA click을 막으면 안 된다.
- `prefers-reduced-motion`에서는 animation loop와 pointer tracking을 끄거나 static/low-motion으로 대체한다.
- Mobile에서는 blob 수, blur, DPR, animation intensity를 낮출 수 있어야 한다.
- `DashboardPreview`는 제품 증거로 유지하되 headline과 primary CTA보다 먼저 보이는 visual anchor가 되면 안 된다.
- `WebGL/Three.js`는 별도 승인 없이 scope에 넣지 않는다.
