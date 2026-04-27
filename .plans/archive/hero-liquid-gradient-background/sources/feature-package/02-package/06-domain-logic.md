# 06. Domain Logic - Hero 섹션 liquid gradient 배경

> 본 Feature는 business domain logic이 아니라 visual state logic 중심이다.

---

## 1. Visual State Inputs

| 입력 | 출처 | 영향 |
|---|---|---|
| Theme | `data-theme` from `next-themes` | light/dark gradient token 선택 |
| Reduced motion | `prefers-reduced-motion` | animation 제거 또는 축소 |
| Viewport | CSS responsive rules | mobile intensity/size 축소 |
| Layer order | DOM + z-index/isolation | content/preview 가시성 보장 |

## 2. Token Logic

```txt
theme token source
  -> --landing-accent-start / --landing-accent-end
  -> --color-accent-start / --color-accent-end
  -> optional --hero-gradient-* token
  -> CSS gradient background
```

규칙:

- hard-coded 단일 palette로 끝내지 않는다.
- 새 token은 light/dark 양쪽에 정의한다.
- CodePen palette는 reference일 뿐 값 복사 대상이 아니다.

## 3. Layering Logic

```txt
Hero section (relative / overflow-hidden)
  ├─ decorative background layer (aria-hidden, pointer-events-none)
  ├─ hero text + CTA group
  └─ DashboardPreview wrapper
```

규칙:

- background가 CTA click/focus를 가로채지 않는다.
- `DashboardPreview` 내부를 수정하지 않는다.
- negative z-index로 section 밖에 빠지는 방식을 피한다.

## 4. Motion Logic

| 조건 | 동작 |
|---|---|
| default | subtle CSS animation |
| mobile | lower intensity 또는 reduced blur/size |
| `prefers-reduced-motion: reduce` | static 또는 near-static fallback |

## 5. Failure Modes

| 실패 모드 | 대응 |
|---|---|
| light mode에서 배경이 흐리고 탁함 | opacity, blur, overlay 조정 |
| dark mode에서 glow가 과함 | opacity와 blend 조정 |
| theme toggle 후 이전 색 잔존 | CSS variable 연결 확인 |
| preview 위로 background가 올라옴 | stacking context와 z-index 재조정 |
| mobile horizontal overflow | absolute layer bounds와 overflow 확인 |
