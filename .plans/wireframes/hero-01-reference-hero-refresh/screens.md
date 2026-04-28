# Wireframe Screens — hero-01 레퍼런스 기반 Hero 섹션 재개선

> **Feature slug**: `hero-01-reference-hero-refresh`
> **PRD**: [../../drafts/hero-01-reference-hero-refresh/02-prd.md](../../drafts/hero-01-reference-hero-refresh/02-prd.md)
> **Routing metadata**: [../../drafts/hero-01-reference-hero-refresh/07-routing-metadata.md](../../drafts/hero-01-reference-hero-refresh/07-routing-metadata.md)
> **작성일**: 2026-04-28
> **상태**: draft-reviewed

---

## 1. Screen List

| Screen ID | 화면 | Viewport | 목적 | 연결 REQ |
|---|---|---|---|---|
| SCR-001 | Desktop first viewport | 1280px+ | `hero-01`의 full-bleed liquid field와 landing CTA를 함께 보여준다. | REQ-001~011, 015 |
| SCR-002 | Tablet first viewport | 768px-1279px | Desktop hierarchy를 유지하되 preview와 CTA 충돌을 줄인다. | REQ-001~014 |
| SCR-003 | Mobile first viewport | ~767px | motion과 layout을 낮은 강도로 줄이고 overflow 없이 보여준다. | REQ-003~014 |
| SCR-004 | Reduced motion state | all | animation/pointer response 없이 같은 hierarchy를 유지한다. | REQ-014, 015 |

요구사항 ID는 PRD의 `REQ-hero-01-reference-hero-refresh-###`를 짧게 표기했다.

## 2. Reference Mapping

| `hero-01` 요소 | Wireframe 반영 | Production 노출 |
|---|---|---|
| full-screen `canvas#liquidCanvas` | `HeroFieldLayer` full-bleed background | 예 |
| centered `.heading` | current product headline의 larger visual hierarchy | 예 |
| 10개 blob + pointer blob | Canvas 2D 후보의 multi-blob field와 subtle pointer highlight | 예, desktop only |
| color scheme controls | 제외 | 아니오 |
| color adjuster panel | 제외 | 아니오 |
| custom cursor | 제외 | 아니오 |
| footer attribution | 제외 | 아니오 |

## 3. SCR-001 Desktop First Viewport

### Layout

```text
Viewport 1440 x 900

+--------------------------------------------------------------------------------+
| [Site header / existing nav remains above or overlay-safe if present]           |
|                                                                                |
|  Hero section: relative isolate, min-height: 100svh, overflow hidden            |
|                                                                                |
|  +--------------------------------------------------------------------------+  |
|  | HeroFieldLayer (canvas or canvas-like full bleed)                         |  |
|  | - base field fills entire viewport                                        |  |
|  | - multi-blob color depth: violet + blue + cyan/warm                       |  |
|  | - subtle pointer highlight on desktop                                     |  |
|  | - contrast veil behind content                                           |  |
|  +--------------------------------------------------------------------------+  |
|                                                                                |
|                          [Headline]                                            |
|                    "운송 운영을 한눈에"                                        |
|                                                                                |
|                         [Subtitle]                                             |
|                       "오더부터 정산까지"                                      |
|                                                                                |
|                   [Primary CTA] [Secondary CTA]                                |
|                                                                                |
|        +----------------------------------------------------------------+      |
|        | DashboardPreview                                                 |      |
|        | - lower visual weight than headline/CTA                          |      |
|        | - max width retained, no overlap with CTA                        |      |
|        +----------------------------------------------------------------+      |
|                                                                                |
+--------------------------------------------------------------------------------+
```

### Desktop Placement Rules

| 영역 | 위치 | 규칙 |
|---|---|---|
| HeroFieldLayer | absolute inset 0 또는 canvas full viewport | content보다 낮은 z-index, `pointer-events: none`, `aria-hidden=true` |
| Contrast veil | content vertical band behind headline/CTA | light/dark별 opacity 조정, text 대비 보호 |
| Headline | viewport center보다 약간 위 | reference처럼 first visual anchor가 되게 scale 확대 |
| CTA group | headline 아래 | primary CTA가 가장 선명해야 함 |
| DashboardPreview | CTA 아래, lower third | preview가 headline/CTA를 밀어내면 안 됨 |

### Desktop States

| 상태 | 표현 | 연결 REQ |
|---|---|---|
| Default light | white base + violet/blue/cyan/warm low-opacity field | REQ-003, 007 |
| Default dark | black base + vivid violet/blue + cyan/warm field | REQ-004, 007 |
| Pointer active | pointer 주변에 subtle primary glow | REQ-010 |
| CTA hover/focus | current button state 유지, background 영향 없음 | REQ-005, 006 |

## 4. SCR-002 Tablet First Viewport

### Layout

```text
Viewport 834 x 1112

+--------------------------------------------------------------+
| Header / nav                                                  |
|                                                              |
| HeroFieldLayer full bleed                                    |
| - lower DPR or lower blob count if canvas route              |
| - contrast veil follows content stack                        |
|                                                              |
|                 [Headline, 2 lines allowed]                  |
|                 "운송 운영을 한눈에"                         |
|                                                              |
|                    [Subtitle]                                |
|                                                              |
|             [Primary CTA] [Secondary CTA]                    |
|                                                              |
|       +------------------------------------------------+     |
|       | DashboardPreview tablet width                  |     |
|       | preserve readable frame, no horizontal scroll   |     |
|       +------------------------------------------------+     |
|                                                              |
+--------------------------------------------------------------+
```

### Tablet Rules

| 영역 | 규칙 |
|---|---|
| Headline | 2-line wrapping 허용, viewport width 기반 font scaling 금지 |
| CTA | 한 줄 유지가 어렵다면 2열에서 vertical stack으로 전환 |
| DashboardPreview | max width를 viewport에 맞추고 side padding 확보 |
| Motion | desktop보다 낮은 intensity 또는 slower field |
| Pointer | coarse pointer라면 pointer highlight 비활성 |

## 5. SCR-003 Mobile First Viewport

### Layout

```text
Viewport 390 x 844

+----------------------------------------+
| Header / nav                            |
|                                        |
| HeroFieldLayer low intensity            |
| - static or very slow field             |
| - no custom cursor                      |
| - no controls UI                        |
|                                        |
|          [Headline, balanced]           |
|          운송 운영을                    |
|          한눈에                         |
|                                        |
|             [Subtitle]                 |
|                                        |
|          [Primary CTA]                 |
|          [Secondary CTA]               |
|                                        |
| +------------------------------------+ |
| | DashboardPreview mobile-safe        | |
| | preserve current mobile behavior    | |
| +------------------------------------+ |
|                                        |
+----------------------------------------+
```

### Mobile Rules

| 영역 | 규칙 |
|---|---|
| Background | lower blob count, lower blur, capped DPR, optional static fallback |
| Headline | text must not overlap CTA or preview |
| CTA | vertical stack preferred |
| DashboardPreview | current mobile path must remain stable |
| Overflow | `overflow-x` must be false |
| Pointer | pointer-reactive effect disabled |

## 6. SCR-004 Reduced Motion State

### Layout

```text
All viewports

HeroFieldLayer
- no requestAnimationFrame loop
- no pointer tracking
- static field or CSS fallback
- same palette tokens

Content
- same headline / subtitle / CTA / DashboardPreview hierarchy
- focus and click states unchanged
```

### Reduced Motion Rules

| 항목 | 규칙 |
|---|---|
| Canvas route | draw one static frame or stop loop after first paint |
| CSS route | animation disabled |
| Pointer route | pointer tracking disabled |
| CTA | no behavioral change |
| QA | reduced-motion screenshot or computed state evidence required |

## 7. Visual Priority

| Priority | 요소 | 이유 |
|---:|---|---|
| 1 | Headline | Hero message must remain readable and memorable. |
| 2 | Primary CTA | Landing conversion path must not be buried. |
| 3 | Full-bleed liquid field | Main visual signal and reference fidelity target. |
| 4 | DashboardPreview | Product proof, but not the first visual anchor. |
| 5 | Secondary CTA | Supporting action. |

## 8. PRD Requirement Coverage

| REQ | Covered by |
|---|---|
| REQ-001 | SCR-001/SCR-002/SCR-003 HeroFieldLayer |
| REQ-002 | SCR-001 HeroFieldLayer, SCR-004 reduced motion |
| REQ-003 | SCR-001 light state, Theme rules |
| REQ-004 | SCR-001 dark state, Theme rules |
| REQ-005 | Visual Priority, contrast veil |
| REQ-006 | Background layer rules |
| REQ-007 | Reference Mapping, Theme rules |
| REQ-008 | Reference Mapping exclusions |
| REQ-009 | Reference Mapping and component specs |
| REQ-010 | Desktop pointer active state |
| REQ-011 | Desktop/tablet/mobile DashboardPreview placement |
| REQ-012 | Mobile overflow rule |
| REQ-013 | Mobile low-intensity rules |
| REQ-014 | SCR-004 |
| REQ-015 | QA coverage in all screens |
| REQ-016 | Implementation route in components.md |
