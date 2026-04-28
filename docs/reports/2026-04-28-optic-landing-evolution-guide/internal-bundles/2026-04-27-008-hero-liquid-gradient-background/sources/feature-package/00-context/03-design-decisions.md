# 03. Design Decisions — Hero 섹션 liquid gradient 배경

> Draft와 PRD에서 확정한 visual/UX 결정을 구현 관점으로 재정리한다.

---

## 1. Visual direction

| 항목 | 결정 |
|---|---|
| 스타일 | liquid gradient 느낌의 decorative background |
| 색상 방향 | 현재 landing의 purple/blue accent 유지 |
| 제외 palette | CodePen의 orange/navy/teal palette 직접 이식 금지 |
| 강도 | CTA, headline, `DashboardPreview`보다 낮은 시각 우선순위 |

## 2. Theme adaptation

| 항목 | 결정 |
|---|---|
| Light mode | opacity/blur를 낮춰 탁함과 번짐을 줄인다 |
| Dark mode | 현재 hero의 깊이감을 유지하되 과한 glow를 피한다 |
| Token | 기존 `--landing-accent-start`, `--landing-accent-end`, `--color-accent-start`, `--color-accent-end` 우선 |
| 새 token | 필요 시 `--hero-gradient-*`를 `:root`와 `[data-theme="dark"]` 양쪽에 정의 |

## 3. Layering

| 항목 | 결정 |
|---|---|
| Background | `aria-hidden`, `pointer-events: none`, content보다 낮은 layer |
| Hero text/CTA | 항상 background 위에 위치 |
| `DashboardPreview` | background에 가려지지 않고 현재 wrapper 폭 유지 |
| 금지 | negative z-index로 section 밖으로 빠지는 방식 |

## 4. Motion

| 항목 | 결정 |
|---|---|
| Motion tone | business landing page에 맞는 subtle motion |
| Reduced motion | static gradient 또는 기존 `GradientBlob` fallback |
| Mobile | desktop보다 animation intensity, layer size, blur를 줄이는 방향 |

## 5. Reference policy

| 항목 | 결정 |
|---|---|
| CodePen 사용 | visual direction + 구조 참고 |
| 직접 복사 | 금지 |
| 가져오지 않을 요소 | controls, color panel, custom cursor, footer, demo heading |
| blocked evidence | Cloudflare verification blocked 상태를 기록하고 필요 시 수동 capture |
