# 와이어프레임 컴포넌트 — hero-01 레퍼런스 기반 Hero 섹션 재개선

> **Feature slug**: `hero-01-reference-hero-refresh`
> **화면 정의**: [screens.md](./screens.md)
> **네비게이션**: [navigation.md](./navigation.md)
> **작성일**: 2026-04-28

---

## 1. 컴포넌트 목록

컴포넌트 이름은 구현 대상 식별자이므로 영어로 유지하고, 설명과 동작 기준은 한국어로 정리한다.

| 컴포넌트 | 유형 | 상태 | 동작 | PRD 요구사항 |
|---|---|---|---|---|
| `HeroSection` | section shell | desktop/tablet/mobile | content stack, z-index, viewport spacing을 관리한다. | REQ-001, 005, 011, 012 |
| `HeroFieldLayer` | 장식용 canvas/background | light/dark, normal/reduced motion, pointer idle/active | full-bleed field를 렌더링하고 click을 가로채지 않는다. | REQ-001~004, 006, 010, 014 |
| `HeroContrastVeil` | 시각 overlay | light/dark | text와 CTA contrast를 보호한다. | REQ-005, 007 |
| `HeroHeadlineBlock` | text content | default, mobile wrapped | headline/subtitle hierarchy를 만든다. | REQ-005, 011, 012 |
| `HeroCTAGroup` | action group | default, hover, focus, mobile stacked | primary/secondary CTA를 클릭 가능하게 유지한다. | REQ-005, 006 |
| `DashboardPreviewMount` | 제품 증거 영역 | desktop/tablet/mobile | preview를 CTA 아래에 두고 text와 겹치지 않게 한다. | REQ-011, 012 |
| `HeroMotionPolicy` | 동작 정책 | normal, reduced, coarse pointer | pointer response와 animation loop를 제어한다. | REQ-010, 013, 014 |
| `HeroReferenceExclusionGuard` | 구현 가드 | always | controls, custom cursor, panel이 production DOM에 섞이지 않게 막는다. | REQ-008, 009 |

## 2. `HeroSection`

| 항목 | 정의 |
|---|---|
| 레이아웃 | `relative isolate overflow-hidden`, `min-height: 100svh` 후보 |
| Content order | field -> veil -> headline/subtitle -> CTA -> `DashboardPreview` |
| Responsive | desktop 중앙 stack, tablet compact stack, mobile vertical stack |
| Constraints | text와 CTA가 preview와 겹치면 안 된다. |

수용 기준:

- headline과 CTA는 background layer보다 위에 있어야 한다.
- mobile에서 가로 overflow가 없어야 한다.
- 기존 Header/nav 동작은 이 feature에서 재정의하지 않는다.

## 3. `HeroFieldLayer`

| 항목 | 정의 |
|---|---|
| 기본 route | Canvas 2D first-pass 후보 |
| 대체 route | CSS enhanced field |
| 선택 route | WebGL/Three.js는 approval gate 이후에만 검토 |
| Accessibility | `aria-hidden=true` |
| Events | `pointer-events: none`; pointer data는 click을 막지 않는 방식으로만 읽는다. |

상태표:

| 상태 | 렌더링 규칙 |
|---|---|
| light | `#ffffff` base 위에 낮은 opacity field |
| dark | `#0a0a0a` base 위에 더 높은 saturation field |
| pointer idle | ambient blob drift |
| pointer active | desktop에서만 subtle pointer highlight |
| mobile | 낮은 blob 수, 낮은 blur, capped DPR |
| reduced motion | static frame 또는 animation loop 없음 |

Lifecycle 요구사항:

| Lifecycle | 요구사항 |
|---|---|
| mount | container size와 capped DPR 기준으로 canvas size 설정 |
| resize | layout shift 없이 canvas와 blob position 갱신 |
| theme change | palette repaint |
| visibility hidden | animation loop pause |
| unmount | animation frame cancel 및 event listener 제거 |

## 4. `HeroContrastVeil`

| 항목 | Light | Dark |
|---|---|---|
| Base | `rgba(255,255,255,0.52)` 후보 | `rgba(0,0,0,0.34)` 후보 |
| 위치 | headline/CTA 뒤 vertical band | headline/CTA 뒤 vertical band |
| 목적 | washed-out text 방지 | 과포화 blob이 text 뒤에 오는 문제 방지 |

수용 기준:

- veil은 별도 card처럼 보이면 안 된다.
- veil은 color field와 자연스럽게 섞여야 한다.
- CTA contrast는 visual review와 contrast check를 통과해야 한다.

## 5. `HeroHeadlineBlock`

| Viewport | 규칙 |
|---|---|
| Desktop | large centered headline, 가능하면 현재 `lg:text-7xl`보다 강한 hierarchy |
| Tablet | balanced 1~2 line wrapping 허용 |
| Mobile | balanced 2-line wrapping, viewport-width font scaling 금지 |

Content 결정:

- 현재 copy 후보인 `운송 운영을 한눈에`는 유지한다.
- product headline을 `Liquid Gradient`로 바꾸지 않는다.
- reference는 scale과 placement 원리만 제공한다.

## 6. `HeroCTAGroup`

| Button | 규칙 |
|---|---|
| Primary CTA | action priority가 가장 높고 field 위에서도 잘 보여야 한다. |
| Secondary CTA | 보이되 primary보다 덜 강조한다. |
| Desktop | horizontal group 허용 |
| Mobile | vertical stack 우선 |

Interaction 요구사항:

- background가 click을 가로채면 안 된다.
- focus ring이 계속 보여야 한다.
- hover state가 light/dark field 위에서도 읽혀야 한다.

## 7. `DashboardPreviewMount`

| Viewport | 규칙 |
|---|---|
| Desktop | CTA 아래 lower third, max width 유지, overlap 없음 |
| Tablet | 더 좁은 max width와 side padding |
| Mobile | 현재 mobile-safe rendering 유지 |

수용 기준:

- preview가 headline/CTA보다 먼저 보이는 visual anchor가 되면 안 된다.
- preview가 field saturation에 묻히면 안 된다.
- layout conflict를 해결하기 위한 wrapper 변경 외에는 `DashboardPreview` 내부 기능을 바꾸지 않는다.

## 8. `HeroMotionPolicy`

| 조건 | 동작 |
|---|---|
| desktop + normal motion | ambient field + optional subtle pointer highlight |
| tablet | ambient field, pointer capability에 따라 pointer response 선택 |
| mobile | low-intensity 또는 static 후보 |
| `prefers-reduced-motion` | static field 또는 one-shot paint |
| coarse pointer | custom cursor 없음, pointer trail 없음 |

## 9. `HeroReferenceExclusionGuard`

production Hero DOM에 아래 요소가 나타나면 안 된다.

| 제외 항목 | reference source | 이유 |
|---|---|---|
| color scheme buttons | `.color-controls` | product action이 아니다. |
| color adjuster | `.color-adjuster-panel` | design/debug UI다. |
| export palette | `exportAllBtn` | landing 사용자에게 필요 없는 기능이다. |
| custom cursor | `.custom-cursor` | 전역 UX 리스크가 있다. |
| footer attribution | `.footer` | 현재 landing 구조와 맞지 않는다. |

## 10. 구현 route 결정표

| Route | 사용할 조건 | Blocker |
|---|---|---|
| Canvas 2D | `hero-01`에 가까운 liquid field가 필요하고 dependency risk를 낮춰야 할 때 | lifecycle과 QA 기준을 구현해야 한다. |
| CSS-only | Canvas route가 현재 wedge에서 과하다고 판단될 때 | 낮은 fidelity를 수용해야 한다. |
| WebGL/Three.js | Canvas가 fidelity를 만족하지 못한다는 근거가 생겼을 때 | explicit approval, bundle budget, fallback이 필요하다. |

## 11. 컴포넌트별 요구사항 커버리지

| REQ | 컴포넌트 |
|---|---|
| REQ-001 | `HeroFieldLayer` |
| REQ-002 | `HeroFieldLayer` |
| REQ-003 | `HeroFieldLayer`, `HeroContrastVeil` |
| REQ-004 | `HeroFieldLayer`, `HeroContrastVeil` |
| REQ-005 | `HeroHeadlineBlock`, `HeroCTAGroup`, `HeroContrastVeil` |
| REQ-006 | `HeroFieldLayer`, `HeroCTAGroup` |
| REQ-007 | `HeroFieldLayer` |
| REQ-008 | `HeroReferenceExclusionGuard` |
| REQ-009 | `HeroReferenceExclusionGuard` |
| REQ-010 | `HeroMotionPolicy` |
| REQ-011 | `DashboardPreviewMount` |
| REQ-012 | `HeroSection`, `DashboardPreviewMount` |
| REQ-013 | `HeroMotionPolicy` |
| REQ-014 | `HeroMotionPolicy` |
| REQ-015 | 모든 visual state |
| REQ-016 | 구현 route 결정표 |
