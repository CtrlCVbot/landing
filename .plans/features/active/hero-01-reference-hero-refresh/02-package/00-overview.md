# Feature Overview: hero-01-reference-hero-refresh

> **Feature**: hero-01 레퍼런스 기반 Hero 섹션 재개선
> **Context Index**: `../00-context/00-index.md`
> **Requirements**: `01-requirements.md`
> **Created**: 2026-04-28

---

## 0. 이 문서의 역할

이 문서는 `/dev-run`에서 구현자가 먼저 읽는 feature overview다. PRD와 wireframe의 핵심 결정을 구현 가능한 경계로 압축한다.

---

## 1. Goal

현재 landing Hero를 `.references/design/hero-01`의 full-bleed liquid field 인상에 가깝게 개선한다. 단, reference source를 직접 복사하지 않고 현재 Next.js/Tailwind 구조, light/dark theme, CTA, `DashboardPreview`를 유지한다.

---

## 2. User-Visible Outcome

| 영역 | 기대 결과 |
|---|---|
| 첫 화면 | Hero background가 장식 blob이 아니라 viewport를 채우는 liquid field로 보인다. |
| Light mode | white base 위에서 색이 탁하지 않고 headline/CTA가 선명하다. |
| Dark mode | violet/blue 단색 느낌을 줄이고 cyan 또는 warm accent depth가 보인다. |
| CTA | background가 click이나 focus를 막지 않는다. |
| Mobile | text, CTA, `DashboardPreview`가 겹치지 않고 horizontal overflow가 없다. |
| Reduced motion | 큰 움직임과 pointer response가 꺼지거나 static frame으로 대체된다. |

---

## 3. Implementation Boundary

| 구분 | 경계 |
|---|---|
| Primary code | `src/components/sections/hero.tsx`, `src/components/shared/hero-liquid-gradient-background.tsx`, `src/app/globals.css` |
| Primary tests | `src/components/sections/__tests__/hero.test.tsx`, `src/__tests__/light-theme.test.tsx` |
| Reference only | `.references/design/hero-01/**` |
| Out of scope | API, DB, analytics, new route, DashboardPreview business flow |
| Approval gate | `WebGL/Three.js` 또는 새 graphics dependency |

---

## 4. Recommended Route

기본 추천은 Canvas 2D first-pass + CSS fallback이다.

Canvas 2D가 과하다고 판단되면 CSS enhanced field로 축소할 수 있다. 반대로 Canvas 2D가 fidelity를 만족하지 못해 WebGL이 필요하다는 근거가 생기면, 구현을 멈추고 dependency approval gate를 먼저 열어야 한다.

---

## 5. Package Map

| 파일 | 역할 |
|---|---|
| `01-requirements.md` | 요구사항 alias와 acceptance criteria |
| `02-ui-spec.md` | 화면, component, visual priority 기준 |
| `03-flow.md` | load/theme/pointer/CTA/reduced-motion flow |
| `06-domain-logic.md` | visual field model, palette, motion, lifecycle invariant |
| `08-dev-tasks.md` | 구현 task 순서 |
| `09-test-cases.md` | test case와 evidence 기준 |
| `10-release-checklist.md` | release 전 체크리스트 |

---

## 6. Done Means

- `REQ-HR-001`~`REQ-HR-016`이 code, test, screenshot evidence 중 하나 이상으로 trace된다.
- light/dark, desktop/mobile, reduced-motion QA evidence가 남는다.
- reference controls와 custom cursor가 production DOM에 없다.
- `package.json`에 승인 없는 heavy graphics dependency가 없다.
- targeted tests, typecheck, lint, build 결과를 release checklist에 기록한다.
