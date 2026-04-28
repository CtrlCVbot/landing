# Requirements: hero-01-reference-hero-refresh

> **Feature**: hero-01 레퍼런스 기반 Hero 섹션 재개선
> **PRD Freeze**: `../00-context/01-prd-freeze.md`
> **Dev Tasks**: `08-dev-tasks.md`
> **Test Cases**: `09-test-cases.md`
> **Created**: 2026-04-28

---

## 0. 이 문서의 역할

이 문서는 구현 중 참조할 Requirements SSOT다. 원본 PRD의 긴 ID 대신 `REQ-HR-###` alias를 사용한다.

---

## 1. Functional Requirements

| REQ | 요구사항 | 우선순위 | Acceptance Criteria |
|---|---|:---:|---|
| `REQ-HR-001` | Hero background는 first viewport 전체를 덮는 full-bleed liquid field로 보인다. | Must | desktop screenshot에서 background가 장식 요소가 아니라 Hero의 주 visual signal로 보인다. |
| `REQ-HR-002` | Background layer는 `canvas` 또는 canvas-like 구조를 사용할 수 있어야 한다. | Must | Canvas route 선택 시 DPR, resize, cleanup, visibility handling 기준이 구현된다. |
| `REQ-HR-003` | Light mode palette는 현재 theme token에서 파생한다. | Must | white base와 violet/blue/cyan/warm accent가 token 또는 equivalent value로 연결된다. |
| `REQ-HR-004` | Dark mode palette는 현재 theme token에서 파생한다. | Must | dark base와 vivid accent가 theme 전환에 따라 repaint된다. |
| `REQ-HR-005` | Headline, subtitle, CTA는 모든 theme에서 읽을 수 있어야 한다. | Must | contrast veil 또는 text treatment가 screenshot review를 통과한다. |
| `REQ-HR-006` | Background layer는 CTA click과 focus를 가로막지 않는다. | Must | `pointer-events: none` 또는 동등한 처리가 유지된다. |
| `REQ-HR-007` | Palette는 violet/blue 한 톤으로만 보이면 안 된다. | Must | cyan 또는 warm accent가 light/dark screenshot에서 식별된다. |
| `REQ-HR-008` | `hero-01` controls UI는 production DOM에 나타나지 않는다. | Must | color controls, adjuster, export UI, custom cursor가 없다. |
| `REQ-HR-009` | Reference source를 무단 직접 복사하지 않는다. | Must | behavior와 visual intent를 current code style로 재구성한다. |
| `REQ-HR-010` | Desktop pointer-reactive effect는 subtle해야 한다. | Should | pointer highlight가 CTA와 headline 집중을 방해하지 않고 reduced-motion에서 꺼진다. |
| `REQ-HR-011` | `DashboardPreview`는 유지하되 first viewport hierarchy와 충돌하지 않는다. | Must | desktop/mobile screenshot에서 headline/CTA와 overlap이 없다. |
| `REQ-HR-012` | Mobile layout에는 horizontal overflow가 없다. | Must | browser measurement 또는 screenshot에서 overflow-x가 없다. |
| `REQ-HR-013` | Mobile에서는 blob 수, blur, DPR, animation intensity를 낮출 수 있어야 한다. | Should | mobile preset 또는 static fallback이 정의된다. |
| `REQ-HR-014` | `prefers-reduced-motion`을 지원한다. | Must | animation loop와 pointer tracking이 꺼지거나 low-motion 처리된다. |
| `REQ-HR-015` | Visual QA evidence는 desktop/mobile, light/dark, reduced-motion을 포함한다. | Must | screenshot 또는 measurement evidence가 release checklist에 기록된다. |
| `REQ-HR-016` | Implementation route와 gate가 bridge/dev package에 명확해야 한다. | Must | Canvas 2D, CSS-only, WebGL gate 중 선택과 이유가 기록된다. |

---

## 2. Trace Matrix

| Story | REQ | TASK | TC |
|---|---|---|---|
| `US-HR-001` | `REQ-HR-001`, `REQ-HR-002` | `T-HR-M1-01`, `T-HR-M2-01` | `TC-HR-COMP-01`, `TC-HR-VIS-01` |
| `US-HR-002` | `REQ-HR-005`, `REQ-HR-006` | `T-HR-M3-01`, `T-HR-M4-02` | `TC-HR-COMP-02`, `TC-HR-VIS-02` |
| `US-HR-003` | `REQ-HR-003`, `REQ-HR-007` | `T-HR-M2-02`, `T-HR-M3-02` | `TC-HR-THEME-01`, `TC-HR-VIS-03` |
| `US-HR-004` | `REQ-HR-004`, `REQ-HR-007` | `T-HR-M2-03`, `T-HR-M3-02` | `TC-HR-THEME-02`, `TC-HR-VIS-04` |
| `US-HR-005` | `REQ-HR-012`, `REQ-HR-013` | `T-HR-M3-03` | `TC-HR-VIS-05`, `TC-HR-REL-02` |
| `US-HR-006` | `REQ-HR-014` | `T-HR-M2-04` | `TC-HR-A11Y-01` |
| `US-HR-007` | `REQ-HR-008`, `REQ-HR-009` | `T-HR-M4-01` | `TC-HR-COMP-03`, `TC-HR-REL-03` |
| `US-HR-008` | `REQ-HR-015`, `REQ-HR-016` | `T-HR-M5-01`, `T-HR-M5-02` | `TC-HR-REL-01`, `TC-HR-REL-04` |

---

## 3. Non-Functional Requirements

| NFR | 기준 |
|---|---|
| Accessibility | decorative background는 screen reader와 keyboard order를 방해하지 않는다. |
| Performance | Canvas route는 DPR cap, visibility pause, cleanup을 구현한다. |
| Responsiveness | mobile/tablet/desktop에서 text overlap과 horizontal overflow가 없다. |
| Maintainability | token과 motion policy는 magic number가 흩어지지 않게 정리한다. |
| Dependency control | 승인 없는 heavy graphics dependency를 추가하지 않는다. |
