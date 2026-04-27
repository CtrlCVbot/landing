# PRD: Hero 섹션 liquid gradient 배경

> **Feature slug**: `hero-liquid-gradient-background`
> **IDEA**: [IDEA-20260427-001](../../ideas/20-approved/IDEA-20260427-001.md)
> **Screening**: [SCREENING-20260427-001](../../ideas/20-approved/SCREENING-20260427-001.md)
> **Draft**: [01-draft.md](./01-draft.md)
> **Routing metadata**: [07-routing-metadata.md](./07-routing-metadata.md)
> **Reference evidence**: [evidence/REFERENCE.md](./evidence/REFERENCE.md), [evidence/manifest.json](./evidence/manifest.json)
> **작성일**: 2026-04-27
> **상태**: draft (PRD review 완료 후 plan-bridge 대기)
> **Lane**: Lite
> **Scenario**: B (기존 정적 `GradientBlob` 배경 보강)
> **Feature type**: dev
> **Hybrid**: true
> **schema**: PRD 10 섹션 표준

---

## 1. Overview

landing page의 `Hero` 섹션 배경을 현재 정적인 `GradientBlob` 중심 표현에서, 은은하게 움직이는 liquid gradient 배경 레이어로 보강한다. 핵심 목표는 첫 화면의 제품 인상을 더 현대적이고 완성도 있게 만들되, headline, CTA, `DashboardPreview`의 가독성과 클릭 가능성을 해치지 않는 것이다.

첫 구현은 **CSS-first MVP**로 제한한다. CSS-first는 새 heavy dependency 없이 CSS gradient, blur, opacity, animation 조합으로 먼저 효과를 만드는 접근이다. CodePen reference는 visual direction과 구조적 참고 자료로만 사용하며, source code를 직접 복사하지 않는다.

## 2. Problem Statement

현재 `Hero`는 `src/components/sections/hero.tsx`에서 `GradientBlob` 2개를 absolute background 장식으로 사용한다. `GradientBlob`은 `src/components/shared/gradient-blob.tsx`의 radial gradient + blur 기반 정적 요소라서 안정적이고 가볍지만, landing 첫 화면이 보여주는 AI/product 분위기는 제한적이다.

이 아이디어는 CodePen의 interactive liquid gradient 스타일을 참고해 첫인상을 강화하려는 시도다. 다만 CodePen 원본은 `Three.js`, shader, pointer interaction, color control UI, custom cursor까지 포함하는 demo 성격이 강하다. 이를 그대로 가져오면 bundle size, mobile performance, accessibility, license 리스크가 커지고, landing page의 목적이 CTA 전환에서 visual demo로 흐려질 수 있다.

따라서 이번 PRD는 "Hero 배경을 더 풍부하게 만든다"는 사용자 가치를 살리면서도, 구현 범위를 **장식용 배경 레이어 1개**로 고정한다. WebGL 또는 `Three.js` 전환은 CSS-first 결과가 부족하다는 근거와 별도 승인 없이는 진행하지 않는다.

## 3. Goals & Non-Goals

### Goals

- Hero content 뒤에 liquid gradient 느낌의 장식용 background layer를 추가한다.
- 기존 hero copy, CTA, `DashboardPreview` 배치는 유지한다.
- 새 background는 `pointer-events: none` 성격을 유지해 링크, 버튼, hover 동작을 가로채지 않는다.
- `prefers-reduced-motion` 사용자는 animation이 꺼지거나 크게 줄어든 상태를 본다.
- light/dark theme에 맞춰 gradient color, opacity, contrast가 조정된다.
- mobile에서는 horizontal overflow 없이 부드러운 scroll과 안정적인 렌더링을 유지한다.
- 기존 `GradientBlob`은 새 layer 검증 전까지 fallback 또는 reduced-motion 대안으로 보존한다.
- CodePen은 reference-only로 다루고, source code 직접 복사와 demo UI 이식은 금지한다.

### Non-Goals

- Hero 전체 layout 재설계.
- `DashboardPreview` 교체 또는 내부 flow 변경.
- CodePen의 heading, color scheme buttons, color adjuster panel, footer, custom cursor 추가.
- 첫 구현 범위에서 `Three.js` 또는 WebGL shader dependency 추가.
- 새 analytics, backend, API, auth, database 변경.
- 전체 landing site visual system 재설계.
- 사용자-facing color/theme control UI 추가.

## 4. User Stories

1. **As a** landing page 방문자, **I want** 첫 화면 배경이 더 동적이고 정돈되어 보이기를, **so that** 제품이 더 현대적이고 완성도 있게 느껴진다.
2. **As a** CTA를 검토하는 방문자, **I want** headline과 button이 배경보다 항상 선명하게 보이기를, **so that** 다음 행동을 방해받지 않고 이해할 수 있다.
3. **As a** mobile 사용자, **I want** animated background가 scroll과 첫 로딩을 무겁게 만들지 않기를, **so that** 작은 화면에서도 페이지가 매끄럽게 느껴진다.
4. **As a** motion에 민감한 사용자, **I want** OS의 reduced motion 설정이 존중되기를, **so that** 과한 움직임 없이 편안하게 페이지를 볼 수 있다.
5. **As a** 구현자, **I want** visual reference와 실제 구현 범위가 분리되어 있기를, **so that** CodePen demo UI나 WebGL 구조가 MVP 범위로 새어 들어오지 않는다.
6. **As a** QA, **I want** desktop/mobile과 reduced motion 상태에서 핵심 hero 요소가 보이고 클릭 가능한지 확인하기를, **so that** 배경 개선이 전환 흐름을 깨지 않았다고 판단할 수 있다.

## 5. Functional Requirements

| ID | 요구사항 | 우선순위 | 수용 기준 |
|---|---|:---:|---|
| REQ-hero-liquid-gradient-background-001 | Hero 전용 liquid gradient background layer를 추가한다. | Must | `Hero` content 뒤에 장식용 layer가 렌더링되고, headline, subtitle, CTA, `DashboardPreview`보다 시각적으로 뒤에 위치한다. |
| REQ-hero-liquid-gradient-background-002 | 새 background layer는 상호작용을 가로채지 않는다. | Must | background wrapper 또는 equivalent element가 `pointer-events: none`을 유지하고 CTA link click이 가능하다. |
| REQ-hero-liquid-gradient-background-003 | 기존 `GradientBlob`은 fallback 또는 reduced-motion 대안으로 보존한다. | Must | 새 layer 검증 전까지 `GradientBlob`을 삭제하지 않거나, 삭제 시 동등한 static fallback이 명시적으로 존재한다. |
| REQ-hero-liquid-gradient-background-004 | CSS-first MVP로 구현한다. | Must | 첫 구현 diff에 `Three.js`, WebGL renderer, shader material, canvas runtime dependency가 추가되지 않는다. |
| REQ-hero-liquid-gradient-background-005 | `prefers-reduced-motion`을 지원한다. | Must | reduced motion 환경에서 background animation이 제거되거나 duration/intensity가 크게 낮아진다. |
| REQ-hero-liquid-gradient-background-006 | 색상은 현재 landing theme에 맞게 조정한다. | Must | primary accent는 purple 계열, secondary accent는 blue 계열을 우선하며 CodePen의 orange 중심 palette를 직접 이식하지 않는다. |
| REQ-hero-liquid-gradient-background-007 | Hero content 가독성을 유지한다. | Must | headline, subtitle, CTA text가 desktop/mobile screenshot review에서 배경과 충돌하지 않는다. 필요 시 overlay, opacity, blur, contrast 조정이 적용된다. |
| REQ-hero-liquid-gradient-background-008 | `DashboardPreview`가 배경에 가려지지 않는다. | Must | 현재 `max-w-[1440px]` preview wrapper와 preview content가 계속 보이고 배경 layer가 preview 위로 올라오지 않는다. |
| REQ-hero-liquid-gradient-background-009 | mobile horizontal overflow를 만들지 않는다. | Must | 390px급 viewport에서 body 또는 hero에 의도치 않은 가로 스크롤이 생기지 않는다. |
| REQ-hero-liquid-gradient-background-010 | CodePen source code 직접 복사를 금지한다. | Must | 구현 diff에 CodePen의 `TouchTexture`, `GradientBackground`, `App` class 구조나 shader source가 직접 복사되지 않는다. 참고 구조는 문서에만 남긴다. |
| REQ-hero-liquid-gradient-background-011 | light/dark theme별 gradient variant를 제공한다. | Must | light mode와 dark mode에서 같은 gradient 값을 그대로 쓰지 않고, 각 theme의 background/foreground contrast에 맞는 color, opacity, blend, overlay 값이 분리된다. |
| REQ-hero-liquid-gradient-background-012 | 기존 theme token 체계와 연결한다. | Must | 새 gradient가 단일 hard-coded palette로 고립되지 않고 `--landing-accent-start`, `--landing-accent-end`, `--color-accent-start`, `--color-accent-end` 또는 이를 확장한 `--hero-gradient-*` token을 사용한다. 새 token을 만들면 `:root`와 `[data-theme="dark"]` 양쪽에 정의한다. |
| REQ-hero-liquid-gradient-background-013 | stacking context를 명시한다. | Must | background layer, hero content, `DashboardPreview`의 z-index 또는 DOM layering 규칙이 분명하며 background가 section 밖이나 content 위로 새지 않는다. |
| REQ-hero-liquid-gradient-background-014 | theme 전환 flash와 hydration mismatch를 만들지 않는다. | Must | `ThemeProvider`의 `data-theme` 전환과 충돌하지 않고, 최초 로드와 theme toggle 후 gradient가 잘못된 theme 색으로 남지 않는다. |
| REQ-hero-liquid-gradient-background-015 | visual reference evidence 상태를 명시한다. | Should | CodePen capture가 Cloudflare verification에 막혔다는 사실과 후속 capture option이 PRD 또는 review에 연결된다. |
| REQ-hero-liquid-gradient-background-016 | WebGL 전환 조건을 별도 gate로 둔다. | Should | CSS-first 결과가 부족할 때만 `Three.js`/WebGL spike를 별도 승인 대상으로 올리고, renderer cleanup, resize, visibility, mobile performance 기준을 추가한다. |

## 6. UX Requirements

- Background는 content를 설명하는 UI가 아니라 분위기를 만드는 장식이다. 사용자가 읽고 클릭해야 하는 요소가 항상 우선한다.
- Motion은 "시각 데모"가 아니라 business landing page에 어울리는 수준으로 절제한다.
- CTA 영역 근처의 gradient 밝기와 contrast가 CTA text를 방해하면 안 된다.
- Light mode에서는 배경이 탁하거나 번져 보이지 않도록 opacity와 blur를 낮추고, dark mode에서는 현재 hero의 깊이감을 유지하되 CTA 대비를 해치지 않는다.
- Theme 전환 시 gradient가 갑자기 튀어 보이지 않도록 색상 token, opacity, blend mode를 theme별로 관리한다.
- `DashboardPreview` 뒤쪽에는 배경이 보조적으로만 보여야 하며, preview 내부 UI와 경쟁하지 않는다.
- Hero background, text/CTA group, `DashboardPreview`의 layer 순서는 구현자가 다시 해석하지 않아도 될 만큼 명확해야 한다.
- Mobile에서는 blur radius, layer size, animation intensity를 desktop보다 줄이는 방향을 우선한다.
- Reduced motion 상태에서는 static gradient 또는 기존 `GradientBlob` fallback을 우선한다.
- Background layer는 `aria-hidden="true"` 또는 동등한 방식으로 보조 기술에 노출되지 않는다. 보조 기술은 스크린리더 같은 accessibility 도구를 뜻한다.
- 새 background 때문에 페이지 첫 화면에서 추가 설명 문구, 안내 문구, control panel을 노출하지 않는다.

## 7. Technical Considerations

- 현재 진입점은 `src/components/sections/hero.tsx`다. `Hero`는 `GradientBlob`, `framer-motion`, `DashboardPreview`를 함께 사용한다.
- 현재 background component는 `src/components/shared/gradient-blob.tsx`다. 새 구현은 이 파일을 확장하거나, 별도 shared visual component를 추가하는 방식이 후보가 될 수 있다.
- 현재 `Hero` test는 `src/components/sections/__tests__/hero.test.tsx`에 있으며, `GradientBlob`과 `DashboardPreview`를 mock해 wrapper class와 text rendering을 검증한다.
- 예상 테스트는 hero background layer 렌더링, `pointer-events: none`, fallback/reduced-motion class 또는 prop, CTA link 유지, `DashboardPreview` wrapper 유지 확인이다.
- `package.json` 기준 현재 dependencies에는 `framer-motion`은 있지만 `three`는 없다. CSS-first MVP에서는 dependency 추가 없이 진행한다.
- CSS animation은 Tailwind utility, component-scoped CSS, 또는 기존 project styling pattern 중 가장 작은 변경으로 구현한다.
- Theme 대응은 hard-coded 단일 gradient보다 CSS variable 또는 theme variant class를 우선 검토한다. 현재 `src/app/globals.css`에는 `:root`와 `[data-theme="dark"]` 기준 `--landing-accent-start`, `--landing-accent-end`, `--color-accent-start`, `--color-accent-end` token이 이미 있으므로, 새 gradient는 이 체계에 연결한다.
- 새 `--hero-gradient-*` token을 추가하는 경우에는 `:root`와 `[data-theme="dark"]` 양쪽 값을 동시에 정의하고, 기존 F1 light-theme token과 중복되거나 충돌하지 않게 한다.
- Light mode QA와 dark mode QA를 분리한다. 같은 background layer라도 light mode에서는 contrast wash-out, dark mode에서는 과한 glow가 주요 리스크다.
- Theme toggle QA를 포함한다. `next-themes`의 `data-theme` 변경 후 gradient가 이전 theme 색으로 남거나 hydration mismatch를 만들면 안 된다.
- Layering은 `relative`, `absolute`, `z-index`, `isolation` 등 필요한 규칙을 명시적으로 사용한다. negative z-index로 section 밖으로 빠지는 방식은 회귀 위험이 크므로 피한다.
- `prefers-reduced-motion` 검증은 class/static state 검증과 browser screenshot 확인을 조합한다. CSS media query 자체는 jsdom에서 완전 검증이 어려울 수 있으므로 visual QA가 필요하다.
- CodePen reference는 Cloudflare verification 때문에 자동 visual capture가 blocked 상태다. 현재 evidence는 blocked screenshot과 editor structure summary이며, 실제 visual parity 증거는 아니다.

## 8. Milestones

| 단계 | 범위 | 완료 조건 |
|---|---|---|
| M1 - PRD review | 본 PRD 품질, 범위, risk gate 검토 | `03-prd-review.md`에서 PASS 또는 조건부 PASS 판정 |
| M2 - Bridge | dev handoff context 생성 | `/plan-bridge hero-liquid-gradient-background` 완료 |
| M3 - CSS-first background | Hero background layer 구현 | REQ-001~006, REQ-011~014 관련 test pass |
| M4 - Readability, theme & motion QA | light/dark desktop/mobile, reduced motion, CTA clickability 확인 | screenshot review와 수동 확인 기록 |
| M5 - WebGL decision gate | CSS-first 결과 평가 | 유지, 보강, WebGL spike 중 하나를 결정하고 근거 기록 |

## 9. Risks & Mitigations

| 리스크 | 영향 | 확률 | 완화 |
|---|:---:|:---:|---|
| CTA 가독성 저하 | High | Medium | opacity, overlay, layer 위치를 조정하고 desktop/mobile screenshot review를 필수로 둔다. |
| Mobile performance 저하 | High | Medium | CSS-first로 시작하고 mobile에서 blur radius와 animation intensity를 낮춘다. |
| Motion discomfort | Medium | Medium | `prefers-reduced-motion`에서 static 또는 low-motion fallback을 제공한다. |
| CodePen demo UI scope creep | Medium | Medium | controls, custom cursor, footer, color picker를 Non-Goals와 REQ-010에서 제외한다. |
| Theme별 contrast 불일치 | High | Medium | light/dark 각각 gradient token, opacity, overlay를 분리하고 screenshot review를 양쪽 theme에서 수행한다. |
| Token 체계 중복 또는 drift | Medium | Medium | 기존 F1 theme token을 우선 사용하고, 새 token 추가 시 `:root`와 `[data-theme="dark"]`를 함께 정의한다. |
| Stacking context 회귀 | Medium | Medium | background/content/preview layer 순서를 test와 screenshot review로 확인한다. |
| Theme 전환 flash | Medium | Low | `data-theme` toggle 후 gradient token이 즉시 바뀌는지 browser check에 포함한다. |
| Dependency bloat | Medium | Low | `Three.js`는 M5 decision gate 전까지 추가하지 않는다. |
| CodePen license 불명확 | Medium | Medium | source code 직접 복사를 금지하고 visual/code structure reference로만 사용한다. |
| Visual evidence 부재 | Medium | High | blocked evidence를 명시하고, 필요 시 manual browser verification 이후 capture를 재시도한다. |
| `DashboardPreview` layer 충돌 | Medium | Low | z-index/layering test와 screenshot review로 preview 가시성을 확인한다. |

## 10. Success Metrics

| ID | 지표 | 목표 | 측정 방법 |
|---|---|---|---|
| SM-hero-liquid-gradient-001 | Background layer 렌더링 | Hero에 새 decorative background layer 존재 | component test |
| SM-hero-liquid-gradient-002 | CTA clickability | `#contact` CTA가 계속 클릭 가능한 구조 유지 | component test + browser check |
| SM-hero-liquid-gradient-003 | Readability | headline, subtitle, CTA, `DashboardPreview`가 배경과 충돌하지 않음 | desktop/mobile screenshot review |
| SM-hero-liquid-gradient-004 | Reduced motion | reduced motion에서 animation 제거 또는 크게 축소 | CSS/media query 확인 + browser check |
| SM-hero-liquid-gradient-005 | Mobile overflow | 390px viewport에서 horizontal overflow 없음 | browser check |
| SM-hero-liquid-gradient-006 | Dependency control | CSS-first MVP에서 `three` dependency 추가 없음 | `package.json` diff review |
| SM-hero-liquid-gradient-007 | Theme adaptation | light/dark mode에서 gradient contrast와 opacity가 각각 적절함 | light/dark desktop/mobile screenshot review |
| SM-hero-liquid-gradient-008 | Theme token alignment | gradient가 기존 theme token 또는 양쪽 theme에 정의된 `--hero-gradient-*` token을 사용함 | CSS/class diff review |
| SM-hero-liquid-gradient-009 | Layering stability | background가 content/preview 위로 올라오지 않음 | component test + screenshot review |
| SM-hero-liquid-gradient-010 | Theme toggle stability | theme toggle 후 이전 theme gradient가 남지 않음 | browser check |
| SM-hero-liquid-gradient-011 | Reference policy | CodePen source code 직접 복사 없음 | diff review |
| SM-hero-liquid-gradient-012 | Test stability | hero 관련 test pass | `pnpm test -- src/components/sections/__tests__/hero.test.tsx` 또는 project script 기준 관련 subset |

## 11. Generated Files

- **PRD 본 파일**: `.plans/drafts/hero-liquid-gradient-background/02-prd.md`
- **리뷰 파일**: `.plans/drafts/hero-liquid-gradient-background/03-prd-review.md`
- **근거 파일**: `.plans/drafts/hero-liquid-gradient-background/evidence/REFERENCE.md`, `.plans/drafts/hero-liquid-gradient-background/evidence/manifest.json`

## 12. Next Steps

1. `03-prd-review.md`의 PRD 리뷰 판정을 확인한다.
2. 사용자 승인 후 `/plan-bridge hero-liquid-gradient-background`를 실행한다.
3. Bridge 이후 `/dev-feature`에서 CSS-first implementation TASK와 allowed target paths를 확정한다.
4. 구현 전에 CodePen visual evidence가 꼭 필요하면 manual browser에서 Cloudflare verification을 통과한 뒤 capture를 재시도한다.

## 13. Change History

| 날짜 | 내용 |
|---|---|
| 2026-04-27 | 초안 작성 - PRD 10 섹션, REQ 12건, UX/Tech/Milestone/Risk/Success Metric 정리. CSS-first MVP, WebGL deferred, reference-only 원칙을 고정. |
| 2026-04-27 | theme 대응 보강 - light/dark mode별 gradient variant, contrast QA, success metric을 추가. REQ 13건으로 확장. |
| 2026-04-27 | 추가 리뷰 반영 - 기존 F1 theme token 연결, stacking context, theme toggle stability 요구를 추가. REQ 16건, SM 12건으로 확장. |
