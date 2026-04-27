# 초안: Hero 섹션 liquid gradient 배경
> **아이디어**: [IDEA-20260427-001](../../ideas/20-approved/IDEA-20260427-001.md)
> **스크리닝**: [SCREENING-20260427-001](../../ideas/20-approved/SCREENING-20260427-001.md)
> **처리 레인**: Lite
> **시나리오**: B (기존 정적 `GradientBlob` 배경 보강)
> **기능 유형**: dev
> **Hybrid 여부**: true
> **참고 자료 캡처 필요**: true
> **Epic**: -

---

## 1. 목표

현재 landing page의 `Hero` 섹션 첫인상을 개선하기 위해, 정적인 `GradientBlob` 배경을 은은한 liquid gradient 배경 레이어로 보강하거나 대체한다.

첫 구현은 가벼운 MVP로 제한한다. CodePen reference는 원하는 visual 방향을 정의하기 위한 참고 자료로만 사용하고, source code를 복사하지 않는다.

참고 링크:
- https://codepen.io/cameronknight/pen/ogxWmBP

## 1.1 CodePen 구현 코드 확인 메모

CodePen page의 `class="top-boxes editor-parent"` editor 영역에서 HTML/CSS/JS 구성을 확인했다. 이 reference는 실제 구현 구조를 이해하기 위한 자료이며, source code를 직접 복사하지 않는다.

Reference-only visual capture도 시도했지만, CodePen의 Cloudflare security verification에 막혀 실제 liquid gradient 화면은 캡처하지 못했다. 해당 시도와 blocked screenshot은 [`evidence/REFERENCE.md`](evidence/REFERENCE.md)와 [`evidence/manifest.json`](evidence/manifest.json)에 기록했다.

| 구분 | 확인 내용 | 현재 프로젝트 반영 방향 |
|---|---|---|
| HTML | `heading`, color scheme controls, color adjuster panel, footer, custom cursor, `three.js` CDN script가 함께 있다. | hero 배경과 renderer mount에 필요한 구조만 참고한다. heading/control/footer/cursor는 제외한다. |
| CSS | `#webGLApp`를 full-screen fixed layer로 두고, heading/control/panel/cursor는 별도 fixed UI로 올린다. | 현재 `Hero` 안의 background layer 개념으로 바꿔 적용한다. 전역 `body overflow: hidden`과 custom cursor는 가져오지 않는다. |
| JS 구조 | `TouchTexture`, `GradientBackground`, `App` class로 나뉜다. | 첫 구현은 CSS-first이지만, 향후 WebGL 전환 시 책임 분리 구조의 reference로 삼는다. |
| WebGL setup | `THREE.WebGLRenderer`, `PerspectiveCamera`, `Scene`, `PlaneGeometry`, `ShaderMaterial`, uniform 기반 fragment shader를 사용한다. | `Three.js` route를 선택하는 경우에만 별도 dependency 결정 후 검토한다. |
| Interaction | mouse/touch 위치를 texture trail로 기록하고 shader distortion에 반영한다. | hero에서는 과한 pointer interaction보다 subtle background motion을 우선한다. |
| Color system | 여러 color scheme을 uniform으로 바꾸고, navy base와 orange/teal 계열 accent를 섞는다. | 현재 landing theme에 맞게 purple/blue accent를 우선한다. |
| Animation loop | `requestAnimationFrame`, resize listener, visibility change wake-up 처리가 있다. | WebGL 후보에서만 검토한다. CSS-first MVP에서는 browser-native animation과 reduced motion을 우선한다. |

### 재사용 가능한 구현 아이디어

- 배경을 content와 분리된 독립 layer로 둔다.
- color value를 hard-coded UI control이 아니라 내부 token 또는 prop으로 관리한다.
- gradient center, speed, intensity 같은 값을 조절 가능한 parameter로 분리한다.
- interaction이 필요하더라도 background가 click/hover를 가로채지 않게 한다.
- animation은 resize, visibility, reduced motion 정책과 함께 설계한다.

### 가져오지 않을 요소

- CodePen heading과 typography layout
- color scheme buttons
- color adjuster panel과 color picker UI
- footer attribution UI
- custom cursor
- 전역 `body` cursor/overflow 제어
- CodePen source code 직접 복사

### 색상 adaptation 방향

현재 프로젝트의 `GradientBlob`은 `rgba(168,85,247,0.8)`에서 `rgba(59,130,246,0.6)`로 이어지는 purple/blue radial gradient를 사용한다. `Hero` CTA도 `from-purple-600 to-blue-600` 계열이다.

따라서 CodePen의 orange/navy/teal scheme은 그대로 가져오지 않는다. 첫 구현의 색상 방향은 다음처럼 잡는다.

| 역할 | 권장 방향 |
|---|---|
| Base | 현재 dark background와 어울리는 deep neutral 또는 subdued navy |
| Primary accent | purple 계열, 현 `GradientBlob`의 `rgba(168,85,247,0.8)`와 조화 |
| Secondary accent | blue 계열, 현 `GradientBlob`의 `rgba(59,130,246,0.6)`와 조화 |
| Optional highlight | CTA 가독성을 해치지 않는 낮은 opacity의 cyan/indigo 보조색 |
| 제외 | CodePen의 orange 중심 palette 직접 이식 |

## 2. 범위

| 영역 | 포함 범위 |
|---|---|
| Hero 배경 | hero content 뒤에 장식용 animated gradient layer를 추가한다. |
| 현재 fallback | 새 배경이 검증될 때까지 `GradientBlob`을 fallback 또는 reduced-motion 대안으로 유지한다. |
| 모션 정책 | `prefers-reduced-motion`에서 static 또는 크게 줄인 motion을 지원한다. |
| 가독성 | headline, CTA, `DashboardPreview`가 계속 선명하게 보이도록 한다. |
| 참고 자료 처리 | CodePen은 visual reference로만 다룬다. |

## 3. 제외 범위

- hero 전체 layout 재구성
- `DashboardPreview` 교체
- CodePen color scheme button 추가
- color adjuster panel 추가
- custom cursor 추가
- CodePen source code 직접 복사
- 첫 구현 경로에 `Three.js` 추가

## 4. 핵심 결정

| 항목 | 결정 |
|---|---|
| MVP 구현 경로 | CSS-first 배경 레이어 |
| WebGL / `Three.js` | CSS/canvas fallback이 부족하다는 근거가 생길 때까지 deferred |
| 참고 자료 정책 | reference-only, CodePen code 직접 복사 금지 |
| 기존 `GradientBlob` | visual과 motion 검증 전까지 fallback으로 보존 |
| 상호작용 | 장식 전용, `pointer-events: none` |
| 모션 | `prefers-reduced-motion` 준수 |

## 5. 사용자 이야기

1. landing page 방문자로서, 첫 화면이 더 정돈되고 동적으로 느껴지길 원한다. 그래야 제품이 더 현대적이고 완성도 높게 보인다.
2. CTA를 검토하는 방문자로서, headline과 button이 계속 읽기 쉬워야 한다. 그래야 animated background가 다음 행동을 방해하지 않는다.
3. mobile 사용자로서, 페이지가 부드럽게 유지되길 원한다. 그래야 visual effect 때문에 loading이나 scroll이 무겁게 느껴지지 않는다.
4. motion에 민감한 사용자로서, reduced motion 설정이 존중되길 원한다. 그래야 페이지를 편안하게 사용할 수 있다.

## 6. 초기 요구사항

- 독립적으로 끌 수 있는 hero 전용 background layer를 추가한다.
- 모든 hero 텍스트와 CTA 상호작용은 배경 레이어보다 위에 유지한다.
- background load 시 layout shift가 발생하지 않게 한다.
- static 또는 low-motion fallback을 제공한다.
- reference palette를 그대로 복사하지 않고 현재 landing theme에 맞게 색상을 조정한다.
- 초기 경로는 dependency-light하게 유지한다. 별도 승인이 있기 전까지 `Three.js`를 추가하지 않는다.
- CodePen reference와 다른 visual 차이는 의도적인 project adaptation으로 문서화한다.
- CodePen의 `TouchTexture`/shader 구조는 WebGL 후보의 참고 자료로만 유지하고, CSS-first MVP scope에는 포함하지 않는다.
- WebGL 후보로 전환할 경우 renderer mount 위치, cleanup, resize, visibility handling, reduced motion, mobile performance budget을 별도 수용 기준으로 추가한다.

## 7. 수용 기준

- hero content 뒤에 새 background layer가 렌더링된다.
- CTA link는 계속 클릭 가능하다.
- `DashboardPreview`가 배경에 가려지지 않고 계속 보인다.
- `prefers-reduced-motion`에서 animation이 꺼지거나 크게 줄어든다.
- mobile layout에서 horizontal overflow가 생기지 않는다.
- CodePen source code가 project에 복사되지 않는다.
- 새 dependency가 제안되면 구현 전에 결정 근거가 문서화된다.
- CodePen editor code 확인 결과가 문서에 요약되어 있고, 제외 UI와 재사용 후보가 구분되어 있다.
- 적용 색상은 현 프로젝트의 purple/blue accent와 조화를 이루도록 조정된다.

## 8. 실현 가능성

| 주제 | 평가 |
|---|---|
| 아키텍처 적합성 | 좋음. 현재 hero도 이미 장식용 배경 컴포넌트를 사용한다. |
| 초기 구현 리스크 | CSS-first라면 low~medium 수준이다. |
| WebGL 리스크 | deferred가 필요할 정도로 높다. bundle size와 GPU 사용량은 별도 승인과 검증이 필요하다. |
| 테스트 가능성 | component test로 rendering과 reduced-motion 상태를 확인할 수 있다. visual QA는 별도 필요하다. |
| 디자인 리스크 | medium. background 밝기와 motion이 CTA 가독성과 경쟁할 수 있다. |

## 9. 예상 작업 영역

| 영역 | 후보 파일 |
|---|---|
| Hero 섹션 | `src/components/sections/hero.tsx` |
| 배경 컴포넌트 | `src/components/shared/gradient-blob.tsx` 또는 새 shared visual component |
| 테스트 | `src/components/sections/__tests__/hero.test.tsx` |
| 스타일링 | Tailwind class 또는 project가 이미 쓰는 component-scoped CSS pattern |

## 10. 리스크

| 리스크 | 수준 | 대응 |
|---|---|---|
| CTA 가독성 저하 | high | overlay/contrast 기준을 두고 screenshot review를 수행한다. |
| Mobile performance | high | CSS-first MVP로 시작하고, small screen에서는 blur와 animation을 줄인다. |
| CodePen tool UI로 scope creep | medium | control, cursor, color panel은 제외 범위로 유지한다. |
| Dependency bloat | medium | `Three.js`는 별도 결정 전까지 deferred로 둔다. |
| Motion discomfort | medium | 첫 구현부터 `prefers-reduced-motion`을 준수한다. |
| CodePen license 불명확 | medium | source code 직접 복사는 금지하고, 실제 재사용 전 license를 확인한다. |
| WebGL cleanup 누락 | medium | WebGL route 선택 시 renderer dispose, event listener cleanup, resize handling을 TASK에 포함한다. |

## 11. 라우팅 결과

| 축 | 결과 | 근거 |
|---|---|---|
| 범주 | Lite | hero background layer 1개 중심이며 DB/API/auth 변경이 없다. |
| 시나리오 | B | 기존 정적 `GradientBlob` background를 보강하는 작업이다. |
| 기능 유형 | dev | copy parity가 아니라 현재 project에 맞춘 구현/디자인 조정 작업이다. |
| Hybrid 여부 | true | 외부 visual reference는 reference-only evidence로 캡처하는 것이 좋다. |

## 12. 다음 단계

1. `/plan-prd .plans/drafts/hero-liquid-gradient-background/`로 상세 PRD를 작성한다.
2. PRD에서 CSS-first MVP, WebGL deferred, reduced-motion, mobile performance, CTA 가독성 기준을 수용 기준으로 고정한다.
3. CodePen visual evidence가 꼭 필요하면 manual browser에서 Cloudflare verification을 통과한 뒤 reference capture를 다시 실행한다.
4. PRD 승인 후 `/plan-bridge hero-liquid-gradient-background`로 dev handoff context를 만든다.
