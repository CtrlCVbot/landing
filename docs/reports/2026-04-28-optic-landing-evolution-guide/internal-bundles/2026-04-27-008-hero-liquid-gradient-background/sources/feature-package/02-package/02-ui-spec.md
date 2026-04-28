# 02. UI Spec - Hero 섹션 liquid gradient 배경

---

## 1. 화면 범위

| 화면 | 범위 | 변경 |
|---|---|---|
| Landing Hero | `src/components/sections/hero.tsx` | background layer 추가 |
| DashboardPreview | Hero 내부 preview block | 내부 변경 없음, 가시성만 보호 |

## 2. Visual Layer

| Layer | 역할 | 요구 |
|---|---|---|
| Background liquid gradient | decorative visual | `aria-hidden`, `pointer-events: none`, content보다 낮은 layer |
| Existing fallback | static/reduced-motion 대안 | 기존 `GradientBlob` 유지 또는 동등 fallback |
| Hero text/CTA | primary content | 항상 readable, clickable |
| `DashboardPreview` | product preview | background 위에 안정적으로 표시 |

## 3. Theme Variants

| Theme | 방향 | 확인 |
|---|---|---|
| Light | opacity/blur 낮춤, wash-out 방지 | CTA와 preview가 흐려 보이지 않음 |
| Dark | 깊이감 유지, 과한 glow 방지 | headline/CTA 대비 유지 |
| Theme toggle | token 즉시 전환 | 이전 theme gradient 잔존 없음 |

Token 우선순위:

1. 기존 `--landing-accent-start`, `--landing-accent-end`
2. 기존 `--color-accent-start`, `--color-accent-end`
3. 필요 시 신규 `--hero-gradient-*` token

신규 token을 쓰면 `:root`와 `[data-theme="dark"]`에 모두 정의한다.

## 4. Motion

| 상태 | 요구 |
|---|---|
| Default | subtle motion, business landing page 수준 |
| Mobile | desktop보다 intensity, size, blur 축소 |
| Reduced motion | static 또는 거의 정지된 상태 |

## 5. Accessibility

- Decorative background는 screen reader에 노출하지 않는다.
- CTA와 link focus 동작을 방해하지 않는다.
- Motion-sensitive 사용자 설정을 존중한다.
- Color contrast는 text/CTA 기준으로 판단하고, background effect는 보조 역할로 유지한다.

## 6. Responsive QA Matrix

| Viewport | Theme | 확인 |
|---|---|---|
| desktop | light | gradient가 탁하지 않고 CTA 대비 유지 |
| desktop | dark | glow가 과하지 않고 text readable |
| mobile 390px | light | horizontal overflow 없음 |
| mobile 390px | dark | preview와 background layer 충돌 없음 |
| any | reduced motion | animation 제거 또는 크게 축소 |
| any | theme toggle | 이전 theme 색 잔존 없음 |

## 7. 금지 UI

- color scheme buttons.
- color picker / adjuster panel.
- custom cursor.
- footer attribution UI.
- CodePen demo heading.
- 사용자가 조작하는 background control UI.
