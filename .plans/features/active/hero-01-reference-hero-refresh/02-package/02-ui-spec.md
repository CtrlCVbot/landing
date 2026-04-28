# UI Spec: hero-01-reference-hero-refresh

> **Feature**: hero-01 레퍼런스 기반 Hero 섹션 재개선
> **Wireframe Screens**: `../../../../wireframes/hero-01-reference-hero-refresh/screens.md`
> **Wireframe Components**: `../../../../wireframes/hero-01-reference-hero-refresh/components.md`
> **Created**: 2026-04-28

---

## 0. 이 문서의 역할

이 문서는 구현자가 Hero section을 만들 때 따라야 할 화면 기준이다. UI text, theme, layout hierarchy, reference exclusion을 한 곳에 묶는다.

---

## 1. First Viewport Hierarchy

| Priority | 요소 | 기준 |
|---:|---|---|
| 1 | Headline | `운송 운영을 한눈에`가 가장 먼저 읽힌다. |
| 2 | Primary CTA | background 위에서도 action이 분명하다. |
| 3 | Full-bleed liquid field | reference의 첫인상과 depth를 만든다. |
| 4 | `DashboardPreview` | 제품 증거로 보이되 headline/CTA를 이기지 않는다. |
| 5 | Secondary CTA | 보조 action으로 유지한다. |

---

## 2. Desktop Layout

```text
Hero section: relative isolate, min-height: 100svh, overflow hidden

[HeroFieldLayer: full-bleed background]
[HeroContrastVeil: content behind visual protection]

                  Headline
                  Subtitle
            Primary CTA / Secondary CTA

              DashboardPreview
```

Desktop 기준:

- background는 viewport를 채우고 content 뒤에 있어야 한다.
- headline은 center anchor로 보이되 현재 product copy를 유지한다.
- CTA는 background보다 위에 있고 click target이 흔들리지 않는다.
- `DashboardPreview`는 lower third에 가까운 제품 증거 영역으로 유지한다.

---

## 3. Tablet and Mobile Layout

| Viewport | 규칙 |
|---|---|
| Tablet | headline 1~2 line 허용, CTA는 공간이 부족하면 stack 가능 |
| Mobile | CTA는 vertical stack 우선, pointer response off, low-intensity field |
| All | viewport-width 기반 font scaling 금지, text overlap 금지 |

Mobile acceptance:

- horizontal overflow가 없어야 한다.
- `DashboardPreview`가 headline 또는 CTA와 겹치면 안 된다.
- reference controls와 custom cursor는 보이지 않는다.

---

## 4. Component Responsibilities

| Component | 책임 | 구현 메모 |
|---|---|---|
| `HeroSection` | shell, z-index, content order | 기존 `hero.tsx`를 우선 수정 |
| `HeroFieldLayer` | full-bleed visual field | 기존 `HeroLiquidGradientBackground` 유지 또는 분리 가능 |
| `HeroContrastVeil` | text/CTA contrast 보호 | card처럼 보이면 안 됨 |
| `HeroHeadlineBlock` | headline/subtitle hierarchy | product copy 유지 |
| `HeroCTAGroup` | primary/secondary CTA | click/focus regression 금지 |
| `DashboardPreviewMount` | preview placement | 내부 business flow 보존 |
| `HeroMotionPolicy` | reduced-motion, pointer, mobile intensity | code 또는 hook/pure utility로 표현 가능 |
| `HeroReferenceExclusionGuard` | controls/custom cursor 배제 | test case로 검증 |

---

## 5. Theme Spec

| Theme | Base | Accent | Guard |
|---|---|---|---|
| Light | `#f8fafc` muted light surface | lavender/cyan low-opacity field, reduced pastel spread | washed-out text 방지 veil + muted bottom fade |
| Dark | `#05030a` black-purple surface | purple-centered `aurora/tide`, weak blue edge depth, purple glow | black-purple bottom fade + over-saturation 방지 veil |

Theme 원칙:

- `globals.css`의 현재 CSS variable 구조를 우선 사용한다.
- 한 색상 계열만 반복되는 palette를 피하되, dark mode에서는 purple field를 중심으로 두고 cyan/yellow 확산은 제한한다.
- Hero 하단 30~40%는 `hero-bottom-fade`로 다음 섹션 배경에 자연스럽게 닫힌다.
- light/dark 모두 screenshot review로 확인한다.

---

## 6. Motion Spec

| 조건 | 동작 |
|---|---|
| Desktop normal motion | ambient drift + optional subtle pointer highlight |
| Tablet | ambient drift, coarse pointer면 pointer response off |
| Mobile | lower blob count, lower blur, capped DPR, optional static fallback |
| Reduced motion | no continuous animation loop, no pointer tracking |

Motion 원칙:

- pointer effect는 click을 막지 않는 방식으로만 읽는다.
- animation frame은 unmount에서 cancel된다.
- visibility hidden 상태에서는 loop를 pause한다.

---

## 7. Excluded Reference Elements

| Reference 요소 | Production 정책 |
|---|---|
| color scheme buttons | 제외 |
| color adjuster panel | 제외 |
| export palette UI | 제외 |
| custom cursor | 제외 |
| footer attribution UI | 제외 |

제외 요소가 production DOM에 들어오면 release blocker로 본다.
