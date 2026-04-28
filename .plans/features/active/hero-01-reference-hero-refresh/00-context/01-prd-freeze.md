# PRD Freeze: hero-01-reference-hero-refresh

> **Feature Slug**: `hero-01-reference-hero-refresh`
> **Source PRD**: `.plans/drafts/hero-01-reference-hero-refresh/02-prd.md`
> **Wireframe Source**: `.plans/wireframes/hero-01-reference-hero-refresh/`
> **Status**: frozen for dev handoff
> **Created**: 2026-04-28

---

## 1. Frozen Summary

`hero-01-reference-hero-refresh`는 local design reference인 `.references/design/hero-01`의 full-bleed liquid visual language를 현재 landing Hero에 이식하는 Standard feature다.

구현의 목적은 reference를 그대로 복사하는 것이 아니라, landing app의 theme token, CTA, `DashboardPreview`, reduced-motion 정책 안에서 같은 첫인상과 depth를 재구성하는 것이다.

---

## 2. Frozen Scope

| 범위 | 결정 |
|---|---|
| 포함 | Hero first viewport visual refresh |
| 포함 | Light/dark palette adaptation |
| 포함 | Canvas 2D 후보 또는 CSS fallback 기반 full-bleed field |
| 포함 | CTA clickability, contrast, reduced-motion, mobile overflow 검증 |
| 제외 | Reference controls UI, color adjuster, export palette, custom cursor, footer attribution |
| 제외 | API, DB, auth, analytics, pricing, section copy 전체 재작성 |
| 제외 | 승인 없는 `WebGL/Three.js` dependency 도입 |

---

## 3. Requirement Alias

PRD 원본 ID가 길기 때문에 dev package에서는 아래 alias를 함께 사용한다.

| Alias | 원본 PRD 요구사항 |
|---|---|
| `REQ-HR-001` | `REQ-hero-01-reference-hero-refresh-001` |
| `REQ-HR-002` | `REQ-hero-01-reference-hero-refresh-002` |
| `REQ-HR-003` | `REQ-hero-01-reference-hero-refresh-003` |
| `REQ-HR-004` | `REQ-hero-01-reference-hero-refresh-004` |
| `REQ-HR-005` | `REQ-hero-01-reference-hero-refresh-005` |
| `REQ-HR-006` | `REQ-hero-01-reference-hero-refresh-006` |
| `REQ-HR-007` | `REQ-hero-01-reference-hero-refresh-007` |
| `REQ-HR-008` | `REQ-hero-01-reference-hero-refresh-008` |
| `REQ-HR-009` | `REQ-hero-01-reference-hero-refresh-009` |
| `REQ-HR-010` | `REQ-hero-01-reference-hero-refresh-010` |
| `REQ-HR-011` | `REQ-hero-01-reference-hero-refresh-011` |
| `REQ-HR-012` | `REQ-hero-01-reference-hero-refresh-012` |
| `REQ-HR-013` | `REQ-hero-01-reference-hero-refresh-013` |
| `REQ-HR-014` | `REQ-hero-01-reference-hero-refresh-014` |
| `REQ-HR-015` | `REQ-hero-01-reference-hero-refresh-015` |
| `REQ-HR-016` | `REQ-hero-01-reference-hero-refresh-016` |

---

## 4. Frozen User Stories

| Story | 요약 | 연결 요구사항 |
|---|---|---|
| `US-HR-001` | 방문자가 첫 화면에서 몰입감 있는 Hero를 본다. | `REQ-HR-001`, `REQ-HR-002` |
| `US-HR-002` | CTA와 headline이 배경 위에서도 명확하게 읽힌다. | `REQ-HR-005`, `REQ-HR-006` |
| `US-HR-003` | Light mode에서 gradient가 탁하거나 과하게 보이지 않는다. | `REQ-HR-003`, `REQ-HR-007` |
| `US-HR-004` | Dark mode가 violet/blue 한 톤으로만 보이지 않는다. | `REQ-HR-004`, `REQ-HR-007` |
| `US-HR-005` | Mobile에서 overflow와 text overlap이 없다. | `REQ-HR-012`, `REQ-HR-013` |
| `US-HR-006` | Motion 민감 사용자는 low-motion Hero를 본다. | `REQ-HR-014` |
| `US-HR-007` | 개발자는 reference에서 가져올 것과 제외할 것을 명확히 안다. | `REQ-HR-008`, `REQ-HR-009` |
| `US-HR-008` | QA는 reference similarity와 theme screenshot evidence로 확인한다. | `REQ-HR-015`, `REQ-HR-016` |

---

## 5. Frozen Constraints

| 제약 | 이유 |
|---|---|
| Current product copy 유지 | Hero headline은 제품 메시지이며 reference headline으로 교체하지 않는다. |
| `DashboardPreview` 유지 | 제품 증거 영역으로 남기되 first visual anchor가 되지 않게 배치한다. |
| Background layer click blocking 금지 | CTA 전환 흐름이 landing 핵심 경로다. |
| `prefers-reduced-motion` 지원 | 큰 움직임과 pointer tracking을 끌 수 있어야 한다. |
| Heavy dependency 승인 gate | visual fidelity를 이유로 bundle risk를 자동 수용하지 않는다. |
| Reference source 직접 복사 금지 | behavior와 visual intent만 current code style로 재구성한다. |

---

## 6. Change Control

아래 변경은 dev 진행 중에도 허용된다.

- `HeroFieldLayer`를 기존 `HeroLiquidGradientBackground` 내부 구현으로 유지할지, 새 shared component로 분리할지 결정
- Canvas 2D와 CSS enhanced field 중 실제 구현 route 선택
- token 이름, opacity, blob count, mobile intensity의 세부 값 조정

아래 변경은 별도 승인 또는 PRD revision이 필요하다.

- `WebGL/Three.js` 또는 새 graphics dependency 추가
- Hero product copy 또는 CTA 목적 변경
- `DashboardPreview` 내부 기능 변경
- reference controls, custom cursor, color adjuster를 production에 노출
