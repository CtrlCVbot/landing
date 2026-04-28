# Draft — hero-01 레퍼런스 기반 Hero 섹션 재개선

> **IDEA**: [IDEA-20260427-004](../../ideas/20-approved/IDEA-20260427-004.md)
> **Screening**: [SCREENING-20260427-004](../../ideas/20-approved/SCREENING-20260427-004.md)
> **Lane**: Standard
> **Scenario**: C (local design reference 기반 Hero visual refresh)
> **Feature type**: copy-dev hybrid
> **Hybrid**: true
> **Reference (repo root)**: `.references/design/hero-01`
> **Reference (from this draft)**: `../../../.references/design/hero-01`
> **Epic**: -
> **Slug**: `hero-01-reference-hero-refresh`

---

## 1. 목표

현재 Hero 구현이 사용자가 원하는 시각 결과와 다르므로, `.references/design/hero-01`을 기준으로 Hero 섹션의 visual target을 다시 고정한다.

이번 draft의 목표는 바로 구현하는 것이 아니다. 다음 PRD와 개발 handoff에서 흔들리지 않도록, 어떤 부분을 `hero-01`에서 가져오고 어떤 부분은 현재 landing theme에 맞게 바꿀지 결정한다.

핵심 결과는 다음 4가지다.

| 목표 | 설명 |
|---|---|
| Reference fidelity | `hero-01`의 full-bleed liquid field, 중앙 집중형 hierarchy, 움직임의 밀도를 Hero 목표로 삼는다. |
| Theme adaptation | 색상은 reference palette를 그대로 쓰지 않고 현재 light/dark token과 조화시킨다. |
| Conversion clarity | CTA, headline, `DashboardPreview` 가독성과 클릭 가능성을 유지한다. |
| Implementation route | `CSS-only`, `Canvas 2D`, `WebGL/Three.js` 후보를 비교하고 PRD에서 확정할 기준을 둔다. |

## 2. 배경

이전 작업 `hero-liquid-gradient-background`는 CSS-first liquid gradient background를 구현했다. 하지만 결과가 사용자의 기대와 다르다는 피드백이 확인됐다. 따라서 이번 개선은 기존 CSS gradient를 조금 더 강하게 조정하는 방식이 아니라, `hero-01` 레퍼런스를 기준으로 첫 화면의 구조와 visual weight를 재정의하는 방향으로 진행한다.

현재 구현 맥락:

| 영역 | 현재 상태 |
|---|---|
| Hero shell | `src/components/sections/hero.tsx`에서 headline, subtitle, CTA, `DashboardPreview`를 한 섹션에 배치 |
| Background | `HeroLiquidGradientBackground` + `GradientBlob` 2개가 decorative layer로 존재 |
| Theme | `src/app/globals.css`에서 light/dark token과 `--hero-gradient-*` token을 관리 |
| Reference | `.references/design/hero-01/hero.html`, `.references/design/hero-01/global.css`에 full-viewport canvas demo가 있음 |

로드 경로 주의: 이 draft 파일은 `.plans/drafts/hero-01-reference-hero-refresh/` 아래에 있으므로, PRD/라우팅 도구가 draft 파일 기준 상대 경로를 해석할 때는 `../../../.references/design/hero-01`를 사용해야 한다.

## 3. 레퍼런스에서 가져올 것

| 요소 | 가져올 방향 | 이유 |
|---|---|---|
| Full-bleed liquid field | Hero의 배경이 섹션 전체를 채우는 주 시각 신호가 되게 한다. | 현재 구현은 보조 장식처럼 보여 reference 인상이 약하다. |
| Central visual hierarchy | headline 중심축을 더 강하게 잡고 first viewport의 시선을 한곳에 모은다. | `hero-01`의 첫인상은 중앙 대형 heading과 배경 움직임의 결합에서 나온다. |
| Multi-blob depth | blob 수, blur, 색 혼합, scale 변화를 더 풍부하게 설계한다. | 현재 3개 radial gradient보다 liquid field 질감이 필요하다. |
| Pointer-reactive option | desktop에서 pointer 위치에 subtle highlight가 따라오는 후보를 검토한다. | reference의 interactive 감각을 제품 landing에 맞게 약하게 이식할 수 있다. |
| Responsive guardrail | mobile에서 heading scale, overflow, motion 강도를 별도로 줄인다. | 현재 Hero에는 `DashboardPreview`가 있어 reference보다 layout 충돌 가능성이 높다. |

## 4. 가져오지 않을 것

| 제외 항목 | 이유 |
|---|---|
| Color scheme buttons | 제품 CTA로 오해될 수 있고 landing 목적과 맞지 않는다. |
| Color adjuster panel | 사용자가 조작하는 도구 UI가 아니므로 Hero에 노출하지 않는다. |
| Export palette / copy UI | 데모 제작용 UI이며 제품 가치 전달과 무관하다. |
| Custom cursor | landing 전체 cursor를 바꾸면 사용성 리스크가 크다. |
| Footer attribution UI | 현재 사이트 구조와 맞지 않는다. |
| Reference source 무검토 복사 | source/license 확인 전 직접 복사는 금지한다. |

## 5. 구현 후보 비교

| 후보 | 적합도 | 장점 | 리스크 | Draft 판단 |
|---|---|---|---|---|
| CSS-only enhanced field | 중간 | dependency 추가 없이 현재 구조를 확장 가능 | pointer 반응성과 liquid 질감 한계 | fallback 또는 MVP 후보 |
| Canvas 2D field | 높음 | `hero-01`의 multi-blob 느낌과 pointer 반응을 비교적 가볍게 구현 가능 | canvas lifecycle, DPR, resize, test 전략 필요 | 1순위 검토 후보 |
| WebGL/Three.js | 높음 | reference에 가장 가까운 field와 shader 가능 | bundle size, GPU, cleanup, mobile 성능 리스크 | 별도 승인 gate 필요 |
| Static bitmap/video | 낮음 | 빠른 visual alignment 가능 | theme toggle, pointer, motion, 접근성 대응이 약함 | 기본 제외 |

초기 추천은 **Canvas 2D 우선 검토 + CSS fallback 유지**다. 이유는 `hero-01`의 질감과 pointer 반응을 CSS-only보다 더 잘 맞출 수 있고, WebGL/Three.js보다 bundle 리스크가 낮기 때문이다.

## 6. Theme adaptation 방향

색상은 `hero-01`의 scheme을 그대로 복사하지 않는다. 현재 landing이 이미 light/dark theme과 violet/blue accent를 갖고 있으므로, reference의 "강한 color field"라는 원리를 token 기반 palette로 바꾼다.

| Token | Light 후보 | Dark 후보 | 역할 |
|---|---|---|---|
| `--hero-field-base` | `#f8fafc` | `#05030a` | muted light surface와 dark purple field 기준 |
| `--hero-field-primary` | `#7c3aed` 30-36% | `#9333ea` 48-56% | violet 주 accent |
| `--hero-field-secondary` | `#2563eb` 24-30% | `#3b82f6` 38-46% | blue 보조 accent |
| `--hero-field-highlight` | `#06b6d4` 14-20% | `#22d3ee` 20-28% | cyan highlight |
| `--hero-field-warm` | `#f472b6` 8-14% | `#fb7185` 10-16% | 보라/파랑 단색화 방지 |
| `--hero-field-contrast-veil` | `rgba(255,255,255,0.52)` | `rgba(0,0,0,0.34)` | 텍스트와 CTA 대비 보호 |

PRD에서는 위 값을 확정값이 아니라 검증 가능한 후보로 다룬다. Browser QA에서 light/dark screenshot을 보고 opacity와 veil 강도를 조정한다.

### 6-1. Final Implemented Palette

| Token | Light | Dark | Role |
|---|---|---|---|
| `--hero-field-base` | `#f8fafc` | `#05030a` | final base field |
| `--hero-field-aurora-rgb` | `139 92 246` | `126 34 206` | purple main accent |
| `--hero-field-tide-rgb` | `99 102 241` | `88 80 236` | purple-blue secondary accent |
| `--hero-field-signal-rgb` | `14 165 233` | `30 64 175` | muted cyan/edge depth |
| `--hero-field-warm-rgb` | `168 85 247` | `168 85 247` | purple glow, not yellow warmth |
| `--hero-field-bottom-fade` | `rgba(248,250,252,0.94)` | `rgba(5,3,10,0.96)` | Hero 하단 transition 보호 |

## 7. Hero layout 초안

| 영역 | 초안 결정 |
|---|---|
| Section height | `min-h-screen` 유지, first viewport에서 Hero가 주 시각 경험이 되도록 여백 재조정 |
| Background layer | `absolute` 또는 `canvas` full-bleed layer, `pointer-events: none`, `aria-hidden=true` |
| Heading | 현재 문구 유지 여부는 PRD에서 확인하되, visual scale과 line-height는 reference에 더 가깝게 조정 |
| CTA | 기존 `도입 문의하기`, `데모 보기`는 유지하되 contrast veil 위에 배치 |
| DashboardPreview | 유지하되 first viewport에서 background/headline과 경쟁하지 않도록 위치와 z-index 재검토 |
| Theme toggle | light/dark 전환 시 background palette가 즉시 맞게 바뀌어야 함 |

## 8. 초기 요구사항

| ID | 요구사항 | 우선순위 |
|---|---|:---:|
| REQ-HR-001 | Hero background는 `hero-01`처럼 full-bleed liquid field로 보인다. | Must |
| REQ-HR-002 | light mode와 dark mode 모두 현재 landing theme token에서 파생된 palette를 사용한다. | Must |
| REQ-HR-003 | CTA와 headline은 모든 theme에서 충분한 대비를 유지한다. | Must |
| REQ-HR-004 | background layer는 클릭, hover, focus event를 가로채지 않는다. | Must |
| REQ-HR-005 | `hero-01`의 controls UI는 production Hero에 노출하지 않는다. | Must |
| REQ-HR-006 | desktop pointer-reactive 효과는 있더라도 subtle해야 하며 CTA 집중을 방해하지 않는다. | Should |
| REQ-HR-007 | mobile에서는 overflow, clipping, text overlap이 없어야 한다. | Must |
| REQ-HR-008 | `prefers-reduced-motion`에서는 움직임을 끄거나 low-motion으로 대체한다. | Must |
| REQ-HR-009 | WebGL/Three.js를 선택하려면 dependency, bundle, cleanup, fallback 근거를 PRD에 남긴다. | Must |
| REQ-HR-010 | visual QA는 desktop/mobile, light/dark, reduced-motion screenshot을 포함한다. | Must |

## 9. 수용 기준

- Hero first viewport가 기존 CSS gradient보다 `hero-01`에 가까운 full-bleed liquid field 인상을 준다.
- light mode에서 배경이 너무 흐리거나 washed-out으로 보이지 않는다.
- dark mode에서 배경이 보라/파랑 단색 덩어리로 뭉치지 않는다.
- headline, subtitle, CTA가 background 위에서 읽힌다.
- CTA 클릭 가능성이 유지된다.
- `DashboardPreview`가 배경에 묻히거나 텍스트와 겹치지 않는다.
- mobile viewport에서 horizontal overflow가 없다.
- reduced-motion 환경에서 무한 움직임 또는 pointer-reactive motion이 사실상 비활성화된다.
- reference controls, color picker, custom cursor가 production DOM에 노출되지 않는다.

## 10. 예상 작업 영역

| 영역 | 후보 파일 |
|---|---|
| Hero shell | `src/components/sections/hero.tsx` |
| Background component | `src/components/shared/hero-liquid-gradient-background.tsx` 또는 새 canvas component |
| Theme tokens | `src/app/globals.css` |
| Hero tests | `src/components/sections/__tests__/hero.test.tsx` |
| Theme tests | `src/__tests__/light-theme.test.tsx` |
| QA output | `output/hero-01-parity-qa/` |

## 11. 리스크

| 리스크 | 수준 | 대응 |
|---|:---:|---|
| Reference fidelity와 CTA 전환 목적 충돌 | high | PRD에서 first viewport hierarchy와 CTA contrast 기준을 잠근다. |
| Canvas/WebGL lifecycle 누락 | high | resize, DPR, visibility, cleanup, reduced-motion을 구현 task에 포함한다. |
| light mode 대비 저하 | medium | contrast veil token과 screenshot QA를 필수화한다. |
| mobile 성능 저하 | medium | mobile에서는 blob 수, DPR, animation intensity를 낮추거나 static fallback을 둔다. |
| source/license 불명확 | medium | reference source 직접 복사는 금지하고 visual behavior만 재설계한다. |
| one-note palette | medium | cyan 또는 warm accent를 반드시 포함해 violet/blue 단색화를 피한다. |

## 12. 검증 계획

| 검증 | 범위 |
|---|---|
| Unit/component | Hero background layer 존재, CTA clickability, controls UI 미노출 |
| Theme | light/dark token alignment, contrast veil 존재 |
| Type/Lint/Build | `pnpm typecheck`, `pnpm lint`, `pnpm build` |
| Browser QA | desktop/mobile light/dark screenshot |
| Motion QA | pointer movement, animation running 여부, reduced-motion fallback |
| Visual review | `hero-01` reference와 first viewport 구조, color density, hierarchy 비교 |

## 13. 라우팅 결과

| 축 | 결과 | 근거 |
|---|---|---|
| 범주 | Standard | Hero layout, theme token, motion/accessibility, visual QA가 함께 영향을 받는다. |
| 시나리오 | C | local design reference를 기준으로 현재 Hero visual target을 다시 잡는다. |
| 기능 유형 | copy-dev hybrid | reference fidelity가 중요하지만 실제 구현은 현재 app/theme에 맞춘 dev 작업이다. |
| Hybrid 여부 | true | `.references/design/hero-01` 분석과 현재 app adaptation이 함께 필요하다. |
| PRD 필요 | true | 구현 후보, acceptance criteria, QA 기준을 더 상세히 잠글 필요가 있다. |
| Wireframe 필요 | conditional | PRD에서 Hero first viewport 배치 변경 폭이 크면 P5 wireframe을 진행한다. |
| Bridge 필요 | true | Standard lane이므로 PRD/review 이후 dev handoff context가 필요하다. |
| 다음 경로 | `/plan-prd` | 상세 요구사항과 decision gate를 확정한다. |

## 14. Implementation Delta

| Item | Final Result |
|---|---|
| Pipeline route | Standard copy-dev hybrid completed through Dev |
| Color decision | dark purple field + black-purple bottom fade; light muted lavender/cyan |
| Scope control | reference controls, color adjuster, export UI, custom cursor excluded |
| Evidence | browser QA `failureCount: 0`, user visual approval, pushed commit `c06cd06` |
| Remaining | optional P8 archive or future `/plan-improve` loop |

## 15. 다음 단계

1. `/plan-prd .plans/drafts/hero-01-reference-hero-refresh/`로 상세 PRD를 작성한다.
2. PRD에서 구현 후보를 `Canvas 2D 우선 검토 + CSS fallback + WebGL gate`로 비교 확정한다.
3. PRD review에서 visual target, theme palette, CTA contrast, mobile/reduced-motion QA 기준을 검증한다.
4. 배치 변경이 크면 `/plan-wireframe`, 그렇지 않으면 `/plan-bridge`로 진행한다.
