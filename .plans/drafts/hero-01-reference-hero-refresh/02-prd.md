# PRD: hero-01 레퍼런스 기반 Hero 섹션 재개선

> **Feature slug**: `hero-01-reference-hero-refresh`
> **IDEA**: [IDEA-20260427-004](../../ideas/20-approved/IDEA-20260427-004.md)
> **Screening**: [SCREENING-20260427-004](../../ideas/20-approved/SCREENING-20260427-004.md)
> **Draft**: [01-draft.md](./01-draft.md)
> **Routing metadata**: [07-routing-metadata.md](./07-routing-metadata.md)
> **작성일**: 2026-04-28
> **상태**: draft-reviewed (wireframe 대기)
> **Lane**: Standard
> **Scenario**: C (local design reference 기반 Hero visual refresh)
> **Feature type**: copy-dev hybrid
> **schema**: PRD 10 섹션 표준

---

## 1. Overview

현재 landing Hero는 `hero-liquid-gradient-background` 구현 이후에도 사용자가 원하는 `hero-01` 레퍼런스의 첫 화면 인상에 도달하지 못했다. 이 PRD는 `.references/design/hero-01`의 full-bleed liquid field, 중앙 집중형 hierarchy, pointer-reactive canvas 감각을 현재 landing의 light/dark theme에 맞게 재해석하는 요구사항을 정의한다.

이번 작업은 제품 업무 기능 추가가 아니라 **첫 화면 visual target 재정의와 구현 handoff 기준 고정**이다. Hero의 headline, CTA, `DashboardPreview`는 전환 목적을 위해 유지하되, 배경이 단순 보조 장식이 아니라 첫 viewport의 주요 시각 신호로 보이도록 만든다.

## 2. Problem Statement

현재 `Hero`는 `HeroLiquidGradientBackground`와 `GradientBlob` 2개를 decorative layer로 사용한다. CSS radial gradient 기반 animation은 존재하지만, `hero-01` 레퍼런스의 full-viewport canvas, multi-blob depth, pointer 반응형 field, 대형 중앙 heading이 만드는 몰입감과는 거리가 있다.

사용자 피드백은 "색만 조금 바꾸면 된다"가 아니라 "문서대로 구현했지만 원하는 방향이 아니다"에 가깝다. 따라서 PRD는 기존 배경을 미세 조정하는 수준이 아니라 reference fidelity, theme adaptation, conversion clarity, implementation route를 함께 잠가야 한다.

현재 gap은 다음과 같다.

| Gap | 현재 상태 | 필요한 변화 |
|---|---|---|
| Visual priority | gradient가 Hero 뒤 보조 장식처럼 보인다. | full-bleed liquid field가 first viewport의 주 시각 신호가 되어야 한다. |
| Motion texture | CSS radial gradient 3개가 scale/translate/rotate로 움직인다. | multi-blob depth와 pointer-reactive 후보가 필요하다. |
| Theme fit | violet/blue accent 중심이라 단조롭게 보일 수 있다. | light/dark별 cyan 또는 warm accent를 추가해 one-note palette를 피한다. |
| Layout hierarchy | headline, CTA, `DashboardPreview`가 같은 축에서 경쟁한다. | reference hierarchy와 landing 전환 목적 사이 우선순위를 다시 잡는다. |
| QA 기준 | 기존 QA는 animation running 여부 중심이다. | reference visual similarity, light/dark screenshot, mobile/reduced-motion evidence가 필요하다. |

## 3. Goals & Non-Goals

### Goals

- `hero-01`의 full-bleed liquid field 인상을 Hero first viewport에 반영한다.
- light mode와 dark mode 모두 현재 landing theme token에서 파생된 palette를 사용한다.
- CTA, headline, subtitle, `DashboardPreview`의 가독성과 클릭 가능성을 유지한다.
- desktop에서는 pointer 위치에 subtle하게 반응하는 Canvas 2D 후보를 우선 검토한다.
- CSS-only fallback을 유지하고, `WebGL/Three.js`는 별도 dependency와 bundle-size gate를 둔다.
- mobile에서는 overflow, clipping, text overlap, motion 부담이 없도록 별도 강도 기준을 둔다.
- `prefers-reduced-motion`에서는 움직임과 pointer-reactive effect를 끄거나 low-motion으로 대체한다.
- reference controls UI는 production Hero에 노출하지 않는다.

### Non-Goals

- `hero-01` source code의 무검토 직접 복사.
- color scheme buttons, color adjuster panel, export palette UI, custom cursor, footer attribution UI 도입.
- Hero 외 섹션의 대규모 재설계.
- `DashboardPreview` 업무 시나리오 또는 내부 기능 변경.
- 새 API, DB, auth, analytics 연동.
- 사용자의 별도 승인 없는 `Three.js` 또는 heavy dependency 추가.
- PRD 단계에서 실제 구현 착수.

## 4. User Stories

| ID | 사용자 이야기 | 연결 요구사항 |
|---|---|---|
| US-HR-001 | As a landing 방문자, I want 첫 화면에서 더 몰입감 있는 Hero를 보기를, so that 제품이 더 현대적이고 완성도 높게 느껴진다. | REQ-hero-01-reference-hero-refresh-001, 002 |
| US-HR-002 | As a landing 방문자, I want CTA와 headline을 배경 위에서도 쉽게 읽기를, so that 다음 행동을 망설이지 않는다. | REQ-hero-01-reference-hero-refresh-005, 006 |
| US-HR-003 | As a light mode 사용자, I want 밝은 화면에서도 gradient가 흐리거나 탁하지 않기를, so that light theme의 깨끗한 인상을 유지하면서 시각적 밀도를 느낄 수 있다. | REQ-hero-01-reference-hero-refresh-003, 007 |
| US-HR-004 | As a dark mode 사용자, I want gradient가 보라/파랑 덩어리로만 보이지 않기를, so that 어두운 화면에서도 색상 depth가 살아난다. | REQ-hero-01-reference-hero-refresh-004, 007 |
| US-HR-005 | As a 모바일 사용자, I want Hero가 잘리거나 겹치지 않기를, so that 첫 화면에서 텍스트와 데모를 편하게 볼 수 있다. | REQ-hero-01-reference-hero-refresh-012, 013 |
| US-HR-006 | As a motion에 민감한 사용자, I want 움직임이 과하지 않거나 꺼지기를, so that 페이지를 불편함 없이 볼 수 있다. | REQ-hero-01-reference-hero-refresh-014 |
| US-HR-007 | As a 개발자, I want reference에서 가져올 요소와 제외할 요소가 명확하기를, so that 구현 중 scope가 controls UI나 custom cursor로 번지지 않는다. | REQ-hero-01-reference-hero-refresh-008, 009 |
| US-HR-008 | As a QA, I want reference 비교와 theme별 screenshot 기준이 있기를, so that "원하는 방향"에 가까운지 검증할 수 있다. | REQ-hero-01-reference-hero-refresh-015, 016 |

## 5. Functional Requirements

| ID | 요구사항 | 우선순위 | 수용 기준 |
|---|---|:---:|---|
| REQ-hero-01-reference-hero-refresh-001 | Hero background는 first viewport 전체를 덮는 full-bleed liquid field로 보인다. | Must | desktop screenshot에서 background가 작은 장식이 아니라 Hero의 주 시각 신호로 보인다. |
| REQ-hero-01-reference-hero-refresh-002 | background layer는 `canvas` 또는 canvas-like structure를 사용할 수 있어야 한다. | Must | Canvas 2D 후보를 선택하면 DPR, resize, cleanup, visibility handling 기준이 dev task에 포함된다. |
| REQ-hero-01-reference-hero-refresh-003 | light mode palette는 current theme token에서 파생한다. | Must | `#ffffff`, `#7c3aed`, `#2563eb`, cyan/warm 후보가 token 또는 equivalent value로 연결된다. |
| REQ-hero-01-reference-hero-refresh-004 | dark mode palette는 current theme token에서 파생한다. | Must | `#0a0a0a`, `#9333ea`, `#3b82f6`, cyan/warm 후보가 token 또는 equivalent value로 연결된다. |
| REQ-hero-01-reference-hero-refresh-005 | headline, subtitle, CTA는 모든 theme에서 읽을 수 있어야 한다. | Must | screenshot review와 contrast check에서 CTA/heading이 background에 묻히지 않는다. |
| REQ-hero-01-reference-hero-refresh-006 | CTA와 link click 영역은 background layer에 가로막히지 않는다. | Must | background layer는 `pointer-events: none` 또는 동등한 처리로 클릭을 가로채지 않는다. |
| REQ-hero-01-reference-hero-refresh-007 | palette는 violet/blue 단색화가 되지 않도록 highlight 색을 포함한다. | Must | cyan 또는 warm accent가 적어도 1개 이상 포함되고 light/dark screenshot에서 식별된다. |
| REQ-hero-01-reference-hero-refresh-008 | `hero-01`의 controls UI는 production DOM에 노출하지 않는다. | Must | color scheme buttons, color adjuster, export palette UI, custom cursor가 Hero production DOM에 없다. |
| REQ-hero-01-reference-hero-refresh-009 | source reuse는 license/source 확인 전 금지한다. | Must | reference source를 직접 복사하지 않고 behavior와 layout intent를 현재 code style로 재구현한다. |
| REQ-hero-01-reference-hero-refresh-010 | desktop pointer-reactive effect는 subtle해야 한다. | Should | pointer highlight가 CTA와 headline 집중을 방해하지 않고 reduced-motion에서는 꺼진다. |
| REQ-hero-01-reference-hero-refresh-011 | `DashboardPreview`는 유지하되 first viewport hierarchy와 충돌하지 않아야 한다. | Must | desktop/mobile screenshot에서 preview가 headline/CTA와 겹치지 않고, background에 묻히지 않는다. |
| REQ-hero-01-reference-hero-refresh-012 | mobile layout은 horizontal overflow가 없어야 한다. | Must | mobile viewport screenshot 또는 browser measurement에서 overflow-x가 없다. |
| REQ-hero-01-reference-hero-refresh-013 | mobile에서는 blob 수, blur, DPR, animation intensity를 낮출 수 있어야 한다. | Should | mobile fallback 또는 low-intensity preset이 정의된다. |
| REQ-hero-01-reference-hero-refresh-014 | `prefers-reduced-motion`을 지원한다. | Must | reduced motion에서 animation loop와 pointer-reactive effect가 꺼지거나 static/low-motion 상태가 된다. |
| REQ-hero-01-reference-hero-refresh-015 | visual QA evidence는 desktop/mobile, light/dark, reduced-motion을 포함한다. | Must | dev verify 산출물에 screenshot 또는 measurement evidence가 남는다. |
| REQ-hero-01-reference-hero-refresh-016 | implementation route는 PRD/bridge에서 명확히 결정되어야 한다. | Must | dev handoff 전에 `Canvas 2D`, `CSS-only`, `WebGL/Three.js` 중 선택과 gate가 문서화된다. |

## 6. UX Requirements

### 6-1. First viewport hierarchy

| 영역 | UX 기준 |
|---|---|
| Background | `hero-01`처럼 viewport 전체에 깔리며, Hero 첫인상을 결정하는 큰 색 field가 된다. |
| Heading | 현재 copy는 유지 후보지만 scale, line-height, placement는 reference에 더 가깝게 조정한다. |
| Subtitle | headline을 보조하되 color field와 대비가 충분해야 한다. |
| CTA | primary CTA는 가장 읽기 쉬운 action으로 남아야 한다. |
| DashboardPreview | 제품 신뢰를 보여주는 장면으로 유지하되, first viewport에서 background/headline과 경쟁하지 않게 한다. |

### 6-2. Reference fidelity 기준

| Reference 요소 | 적용 수준 |
|---|---|
| full-screen canvas | 구조/인상은 반영하되, 실제 구현 방식은 app에 맞게 선택한다. |
| large centered heading | current product copy에 맞춰 hierarchy 원리만 반영한다. |
| 10개 blob motion | Canvas 2D 후보에서 multi-blob depth 기준으로 참고한다. |
| pointer trail | desktop subtle highlight 후보로만 반영한다. |
| color controls | 제외한다. |
| custom cursor | 제외한다. |

### 6-3. Theme policy

- light mode는 깨끗한 white surface 위에 낮은 opacity color field를 얹는다.
- dark mode는 더 높은 saturation을 허용하되, violet/blue 단색 덩어리가 되지 않게 cyan 또는 warm accent를 포함한다.
- contrast veil은 theme별로 다르게 둘 수 있다.
- palette token은 현재 `--landing-*`와 `--hero-gradient-*` 구조를 확장하거나 새 `--hero-field-*` token으로 분리한다.

### 6-4. Motion policy

- desktop pointer-reactive field는 optional이고, 구현되더라도 CTA 집중을 방해하지 않아야 한다.
- mobile은 animation intensity를 줄인다.
- reduced motion에서는 animation loop, pointer tracking, large transform을 끈다.
- Canvas 2D 선택 시 `requestAnimationFrame` loop는 visibility와 cleanup을 반드시 다룬다.

### 6-5. Accessibility

- background layer는 `aria-hidden=true` 또는 동등한 방식으로 보조 기술에 노출되지 않는다.
- keyboard focus 순서는 CTA와 navigation에 영향을 주지 않는다.
- color-only 정보 전달은 하지 않는다.
- text contrast는 visual QA와 contrast check로 확인한다.

## 7. Technical Considerations

- 현재 Hero shell은 `src/components/sections/hero.tsx`이며 `min-h-screen`, `relative isolate overflow-hidden`, `z-10` content stack을 사용한다.
- 현재 background component는 `src/components/shared/hero-liquid-gradient-background.tsx`이고 `aria-hidden`, `pointer-events-none`, `data-testid`를 갖고 있다.
- 현재 theme token은 `src/app/globals.css`의 `:root`, `[data-theme="dark"]`, `--hero-gradient-*`에 정의되어 있다.
- Canvas 2D route를 선택하면 새 component 후보는 기존 `HeroLiquidGradientBackground`를 대체하거나 내부 구현을 canvas로 바꾸는 방식이다.
- Canvas lifecycle은 `devicePixelRatio`, `resize`, `visibilitychange`, `beforeunload` 또는 React cleanup, reduced motion listener를 포함해야 한다.
- CSS fallback은 SSR/static export와 reduced-motion 환경에서 항상 동작해야 한다.
- `WebGL/Three.js` route는 이번 PRD의 기본값이 아니다. 선택하려면 `package.json` diff, bundle size, GPU fallback, cleanup, mobile fallback을 별도 승인 gate로 둔다.
- `DashboardPreview`는 현재 Hero 안의 wide wrapper에서 렌더링된다. first viewport hierarchy 변경이 크므로 P5 wireframe에서 배치안을 먼저 확정한다.
- tests 후보는 `src/components/sections/__tests__/hero.test.tsx`, `src/__tests__/light-theme.test.tsx`, 새 canvas utility test, browser screenshot QA다.
- output evidence 후보는 `output/hero-01-parity-qa/`다.

## 8. Milestones

| 단계 | 범위 | 완료 조건 |
|---|---|---|
| M1 - PRD review | 본 PRD 품질과 범위 검증 | `03-prd-review.md`에서 PASS 또는 조건부 PASS |
| M2 - Wireframe | first viewport hierarchy와 mobile layout 결정 | `.plans/wireframes/hero-01-reference-hero-refresh/` 생성 |
| M3 - Bridge | PRD + wireframe 기반 dev handoff context 생성 | `.plans/features/active/hero-01-reference-hero-refresh/00-context/` 생성 |
| M4 - Implementation route | Canvas 2D/CSS/WebGL 중 실제 route 확정 | feature package에 decision과 gate 반영 |
| M5 - Dev implementation | Hero shell, background component, theme token, tests 구현 | targeted tests와 type/lint/build 통과 |
| M6 - Browser QA | desktop/mobile light/dark/reduced-motion evidence 수집 | screenshot 또는 measurement evidence 저장 |
| M7 - Review closeout | visual gap, theme gap, residual risk 정리 | closeout 또는 archive bundle에 기록 |

## 9. Risks & Mitigations

| 리스크 | 영향 | 확률 | 완화 |
|---|:---:|:---:|---|
| reference fidelity와 CTA 전환 목적 충돌 | High | Medium | wireframe에서 first viewport hierarchy와 CTA 위치를 먼저 고정한다. |
| Canvas lifecycle 누락 | High | Medium | DPR, resize, visibility, cleanup, reduced-motion을 dev acceptance criteria에 포함한다. |
| light mode에서 contrast 저하 | High | Medium | contrast veil, text shadow, overlay token을 theme별로 검증한다. |
| dark mode에서 one-note palette 발생 | Medium | Medium | cyan 또는 warm accent를 필수 포함하고 screenshot review에서 확인한다. |
| mobile 성능 저하 | Medium | Medium | mobile preset에서 blob 수, DPR, blur, animation intensity를 낮춘다. |
| source/license 불명확 | Medium | Low | reference source 직접 복사를 금지하고 behavior만 재설계한다. |
| WebGL dependency creep | High | Low | `WebGL/Three.js`는 별도 승인 gate 없이는 dev scope에 넣지 않는다. |
| test는 통과하지만 visual이 기대와 다름 | High | Medium | browser screenshot과 reference comparison review를 필수 QA로 둔다. |
| existing Hero comments/preview wrapper와 충돌 | Medium | Medium | current Hero structure를 wireframe과 bridge에서 명시적으로 재검토한다. |

## 10. Success Metrics

| ID | 지표 | 목표 | 측정 방법 |
|---|---|---|---|
| SM-hero-01-reference-hero-refresh-001 | Reference similarity | first viewport가 `hero-01`의 full-bleed liquid field 인상을 가진다. | visual review screenshot |
| SM-hero-01-reference-hero-refresh-002 | Theme fit | light/dark 모두 어색하지 않고 CTA가 읽힌다. | theme screenshot + contrast check |
| SM-hero-01-reference-hero-refresh-003 | Palette depth | dark mode가 violet/blue 단색 덩어리로 보이지 않는다. | visual review |
| SM-hero-01-reference-hero-refresh-004 | CTA usability | primary CTA click이 background에 막히지 않는다. | browser interaction check |
| SM-hero-01-reference-hero-refresh-005 | Mobile stability | mobile overflow-x와 text overlap이 없다. | mobile screenshot/measurement |
| SM-hero-01-reference-hero-refresh-006 | Reduced motion support | reduced motion에서 animation/pointer response가 꺼지거나 low-motion이다. | browser emulation |
| SM-hero-01-reference-hero-refresh-007 | Scope control | controls UI, color adjuster, custom cursor가 production DOM에 없다. | DOM/screenshot review |
| SM-hero-01-reference-hero-refresh-008 | Dependency control | 새 heavy dependency 추가가 없거나 승인 gate가 기록된다. | `package.json` diff review |
| SM-hero-01-reference-hero-refresh-009 | Test stability | Hero/theme 관련 targeted tests가 통과한다. | test output |
| SM-hero-01-reference-hero-refresh-010 | Build stability | type/lint/build가 통과한다. | verification output |

## 11. Generated Files

- **Draft**: `.plans/drafts/hero-01-reference-hero-refresh/01-draft.md`
- **PRD 본 파일**: `.plans/drafts/hero-01-reference-hero-refresh/02-prd.md`
- **Review 파일**: `.plans/drafts/hero-01-reference-hero-refresh/03-prd-review.md`
- **Routing metadata**: `.plans/drafts/hero-01-reference-hero-refresh/07-routing-metadata.md`

## 12. Next Steps

1. `03-prd-review.md`의 PRD 리뷰 판정을 확인한다.
2. first viewport hierarchy 변경이 포함되므로 `/plan-wireframe .plans/drafts/hero-01-reference-hero-refresh/`로 P5를 진행한다.
3. wireframe에서 desktop/mobile Hero 배치와 reference 요소 mapping을 확정한다.
4. 이후 `/plan-bridge`에서 Standard dev handoff context를 생성한다.

## 13. Change History

| 날짜 | 내용 |
|---|---|
| 2026-04-28 | 초안 작성 - PRD 10 섹션, REQ 16건, UX/Technical/Risk/Success Metric 정리. Canvas 2D 우선 검토, CSS fallback, WebGL gate, wireframe 필요 결정을 기록. |
