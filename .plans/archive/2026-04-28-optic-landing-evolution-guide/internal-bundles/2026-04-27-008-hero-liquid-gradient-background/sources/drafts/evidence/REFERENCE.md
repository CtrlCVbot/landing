# Hero Liquid Gradient 참고 자료 증거

> `hero-liquid-gradient-background`의 reference-only 캡처 기록.
> 생성일: 2026-04-27

---

## 원본

- CodePen: https://codepen.io/cameronknight/pen/ogxWmBP
- Full preview: https://codepen.io/cameronknight/full/ogxWmBP
- Embed preview: https://codepen.io/cameronknight/embed/ogxWmBP?default-tab=result&theme-id=dark

## 캡처 결과

Playwright로 editor, full preview, embed URL 캡처를 시도했다. 하지만 모든 캡처가 CodePen의 Cloudflare security verification 화면에서 막혀 실제 liquid gradient visual evidence는 확보하지 못했다.

| 파일 | viewport | 결과 |
|---|---|---|
| `design-hero-liquid-gradient-editor-desktop-blocked.png` | desktop | Cloudflare verification screen |
| `design-hero-liquid-gradient-preview-desktop-blocked.png` | desktop | Cloudflare verification screen |
| `design-hero-liquid-gradient-preview-mobile-blocked.png` | mobile | Cloudflare verification screen |
| `design-hero-liquid-gradient-embed-desktop-blocked.png` | desktop | Cloudflare verification screen |
| `design-hero-liquid-gradient-embed-mobile-blocked.png` | mobile | Cloudflare verification screen |

## Reference Code 요약

visual capture는 막혔지만, draft에는 CodePen editor 구조 분석 내용을 반영했다.

- HTML에는 demo heading, color scheme controls, color adjuster panel, footer, custom cursor, `three.js` CDN script가 함께 있다.
- CSS는 `#webGLApp`를 full-screen fixed layer로 두고 demo-only controls를 overlay한다.
- JavaScript는 `TouchTexture`, `GradientBackground`, `App`으로 책임을 나눈다.
- rendering은 `THREE.WebGLRenderer`, `PerspectiveCamera`, `Scene`, `PlaneGeometry`, `ShaderMaterial`, shader uniform을 사용한다.
- pointer movement를 texture trail로 기록하고 shader distortion에 반영한다.

이 내용은 reference-only다. CodePen source code를 직접 복사하지 않는다.

## 프로젝트 적용 메모

- 첫 구현은 CSS-first로 유지한다.
- `Three.js` / WebGL은 visual과 performance 필요성이 입증될 때까지 deferred로 둔다.
- CodePen의 orange/navy/teal palette 대신 현재 landing theme의 purple/blue accent 방향을 우선한다.
- `GradientBlob`은 새 layer가 검증될 때까지 fallback 또는 reduced-motion 대안으로 유지한다.
- `pointer-events: none`을 유지하고, demo controls, custom cursor, global body behavior는 가져오지 않는다.

## 다음 캡처 옵션

1. CodePen을 manual browser session에서 열고 Cloudflare verification을 통과한 뒤 reference capture를 다시 실행한다.
2. visual capture 전까지는 code-structure summary를 planning evidence로 사용한다.
3. 허용된다면 local derived reference spike를 만든 뒤 CodePen 대신 해당 화면을 캡처한다.
