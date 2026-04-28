# Domain Logic: hero-01-reference-hero-refresh

> **Feature**: hero-01 레퍼런스 기반 Hero 섹션 재개선
> **Requirements**: `01-requirements.md`
> **Created**: 2026-04-28

---

## 0. 이 문서의 역할

이 feature는 업무 도메인 로직이 아니라 visual field 로직을 가진다. 이 문서는 palette, blob, motion, lifecycle을 구현자가 일관되게 다루기 위한 invariant를 정의한다.

---

## 1. Visual Field Model

| 개념 | 설명 |
|---|---|
| Field | Hero viewport를 채우는 decorative background surface |
| Blob | field 안에서 depth와 color transition을 만드는 gradient body |
| Pointer highlight | desktop pointer 주변에 약하게 생기는 보조 glow |
| Contrast veil | headline/CTA readability를 보호하는 overlay |
| Fallback | CSS-only 또는 static field 상태 |

---

## 2. Palette Rules

| Rule | 기준 |
|---|---|
| `PAL-HR-001` | light와 dark palette는 별도 preset을 가진다. |
| `PAL-HR-002` | violet/blue 외에 cyan 또는 warm accent를 최소 1개 포함한다. |
| `PAL-HR-003` | text contrast가 낮아지면 blob 값을 키우기보다 veil을 조정한다. |
| `PAL-HR-004` | token은 `globals.css`의 current CSS variable 구조와 충돌하지 않는다. |

---

## 3. Motion Rules

| Rule | 기준 |
|---|---|
| `MOT-HR-001` | normal motion에서만 continuous loop를 허용한다. |
| `MOT-HR-002` | reduced-motion에서는 loop를 끄거나 first paint 뒤 정지한다. |
| `MOT-HR-003` | pointer highlight는 desktop fine pointer에서만 켠다. |
| `MOT-HR-004` | mobile preset은 lower intensity를 기본값으로 둔다. |
| `MOT-HR-005` | CTA hover/focus와 motion layer는 서로 영향을 주지 않는다. |

---

## 4. Canvas Lifecycle Invariants

Canvas route를 선택하면 아래 invariant는 필수다.

| Invariant | 기준 |
|---|---|
| Size | mount와 resize에서 container size에 맞춘다. |
| DPR | devicePixelRatio를 cap해서 mobile 성능 리스크를 줄인다. |
| Animation frame | unmount 시 `cancelAnimationFrame`을 호출한다. |
| Visibility | page hidden 상태에서는 loop를 pause한다. |
| Theme change | palette 변경 시 repaint한다. |
| Reduced motion | loop와 pointer tracking을 끈다. |

---

## 5. CSS Fallback Invariants

CSS route 또는 fallback은 아래 기준을 만족해야 한다.

| Invariant | 기준 |
|---|---|
| Static render | JavaScript가 늦게 실행되어도 Hero가 빈 배경으로 보이지 않는다. |
| Reduced motion | `prefers-reduced-motion`에서 animation을 끈다. |
| Theme | light/dark CSS variable이 모두 정의된다. |
| Clickability | decorative layer는 `pointer-events: none` 상태다. |

---

## 6. Exclusion Invariants

| Invariant | 기준 |
|---|---|
| No controls | color scheme button, adjuster, export button이 production DOM에 없다. |
| No custom cursor | 전역 cursor 변경을 하지 않는다. |
| No footer attribution | reference footer UI를 Hero에 넣지 않는다. |
| No source clone | reference source를 그대로 붙여 넣지 않는다. |
