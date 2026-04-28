# 01. Requirements - Hero 섹션 liquid gradient 배경

> 본 문서가 `hero-liquid-gradient-background` 요구사항 정의의 SSOT다. 모든 TASK와 TC는 아래 REQ ID를 참조한다.

---

## 1. Functional Requirements

| ID | 우선순위 | 요구사항 | 수용 기준 |
|---|:---:|---|---|
| REQ-hero-liquid-gradient-background-001 | Must | Hero 전용 liquid gradient background layer를 추가한다. | `Hero` content 뒤에 장식용 layer가 렌더링된다. |
| REQ-hero-liquid-gradient-background-002 | Must | 새 background layer는 상호작용을 가로채지 않는다. | background layer가 `pointer-events: none`을 유지하고 CTA link click이 가능하다. |
| REQ-hero-liquid-gradient-background-003 | Must | 기존 `GradientBlob`은 fallback 또는 reduced-motion 대안으로 보존한다. | 새 layer 검증 전까지 기존 fallback이 사라지지 않거나 동등한 static fallback이 존재한다. |
| REQ-hero-liquid-gradient-background-004 | Must | CSS-first MVP로 구현한다. | `Three.js`, WebGL renderer, shader material, canvas runtime dependency가 추가되지 않는다. |
| REQ-hero-liquid-gradient-background-005 | Must | `prefers-reduced-motion`을 지원한다. | reduced motion 환경에서 animation이 제거되거나 duration/intensity가 크게 낮아진다. |
| REQ-hero-liquid-gradient-background-006 | Must | 색상은 현재 landing theme에 맞게 조정한다. | purple/blue accent를 우선하며 CodePen orange palette를 직접 이식하지 않는다. |
| REQ-hero-liquid-gradient-background-007 | Must | Hero content 가독성을 유지한다. | headline, subtitle, CTA text가 desktop/mobile screenshot review에서 배경과 충돌하지 않는다. |
| REQ-hero-liquid-gradient-background-008 | Must | `DashboardPreview`가 배경에 가려지지 않는다. | 현재 preview wrapper와 preview content가 계속 보이고 배경 layer가 preview 위로 올라오지 않는다. |
| REQ-hero-liquid-gradient-background-009 | Must | mobile horizontal overflow를 만들지 않는다. | 390px급 viewport에서 의도치 않은 가로 스크롤이 생기지 않는다. |
| REQ-hero-liquid-gradient-background-010 | Must | CodePen source code 직접 복사를 금지한다. | CodePen의 class 구조나 shader source가 직접 복사되지 않는다. |
| REQ-hero-liquid-gradient-background-011 | Must | light/dark theme별 gradient variant를 제공한다. | light/dark에서 color, opacity, blend, overlay 값이 분리된다. |
| REQ-hero-liquid-gradient-background-012 | Must | 기존 theme token 체계와 연결한다. | 기존 `--landing-accent-*`, `--color-accent-*` 또는 양쪽 theme에 정의된 `--hero-gradient-*` token을 사용한다. |
| REQ-hero-liquid-gradient-background-013 | Must | stacking context를 명시한다. | background, hero content, `DashboardPreview`의 z-index 또는 DOM layering 규칙이 분명하다. |
| REQ-hero-liquid-gradient-background-014 | Must | theme 전환 flash와 hydration mismatch를 만들지 않는다. | `data-theme` 전환 후 gradient가 잘못된 theme 색으로 남지 않는다. |
| REQ-hero-liquid-gradient-background-015 | Should | visual reference evidence 상태를 명시한다. | CodePen capture blocked 상태와 후속 capture option이 evidence 또는 QA notes에 남는다. |
| REQ-hero-liquid-gradient-background-016 | Should | WebGL 전환 조건을 별도 gate로 둔다. | CSS-first 결과가 부족할 때만 별도 spike로 제안하고 본 TASK에서 dependency를 추가하지 않는다. |

---

## 2. Non-Functional Requirements

| ID | 요구사항 | 수용 기준 |
|---|---|---|
| NFR-HLG-001 | runtime dependency 증가 없음 | `package.json`과 lockfile에 신규 runtime dependency가 없다. |
| NFR-HLG-002 | theme token drift 방지 | 새 token 추가 시 `:root`와 `[data-theme="dark"]` 모두에 정의된다. |
| NFR-HLG-003 | 접근성 보존 | decorative layer는 `aria-hidden`이며 reduced motion을 지원한다. |
| NFR-HLG-004 | visual QA 가능성 | light/dark, desktop/mobile, reduced motion, theme toggle 확인 기준이 release checklist에 남는다. |
| NFR-HLG-005 | 기존 layout 보호 | Hero text/CTA와 `DashboardPreview` wrapper 폭을 변경하지 않는다. |

---

## 3. Out of Scope

- Hero 전체 layout 재설계.
- `DashboardPreview` 내부 flow 또는 component 변경.
- CodePen demo UI 이식.
- `Three.js` / WebGL / canvas shader dependency 추가.
- backend/API/auth/database/analytics 변경.
- user-facing color/theme control UI 추가.

---

## 4. 미결정 항목

| 항목 | 기본안 | 결정 위치 |
|---|---|---|
| component 분리 방식 | `src/components/shared/hero-liquid-gradient-background.tsx` 신규 component | `00-context/02-decision-log.md` |
| token 확장 방식 | 기존 token 우선, 부족하면 `--hero-gradient-*` 추가 | `00-context/02-decision-log.md` |
| fallback 방식 | 기존 `GradientBlob` 유지 또는 new component 내부 static fallback | `00-context/02-decision-log.md` |
| CodePen visual capture | 필요할 때 manual capture 재시도 | `03-dev-notes/qa-notes.md` |
