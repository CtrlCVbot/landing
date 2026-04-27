# 01. Product Context — Hero 섹션 liquid gradient 배경

> **Feature slug**: `hero-liquid-gradient-background`
> **IDEA**: [IDEA-20260427-001](../../../../ideas/20-approved/IDEA-20260427-001.md)
> **PRD**: [02-prd.md](../../../../drafts/hero-liquid-gradient-background/02-prd.md)
> **Routing**: Lite / Scenario B / dev / hybrid true
> **Epic**: 없음
> **작성일**: 2026-04-27

---

## 1. 목적

Hero 섹션의 첫인상을 강화하기 위해 현재 정적 `GradientBlob` 기반 배경을 은은한 liquid gradient background layer로 보강한다. 제품 가치는 layout을 크게 바꾸지 않고도 landing page가 더 현대적이고 완성도 있게 느껴지도록 만드는 것이다.

본 Feature는 시각 효과 자체보다 **CTA 전환 흐름을 방해하지 않는 visual polish**가 핵심이다. headline, CTA, `DashboardPreview`가 계속 읽히고 클릭 가능해야 하며, light/dark theme과 reduced motion 설정을 모두 존중해야 한다.

## 2. 현재 제품 맥락

| 영역 | 현재 상태 |
|---|---|
| Hero entry | `src/components/sections/hero.tsx` |
| 기존 배경 | `src/components/shared/gradient-blob.tsx`의 purple/blue radial gradient 2개 |
| Theme system | `src/app/globals.css`의 `:root` / `[data-theme="dark"]` CSS token |
| Theme provider | `src/app/layout.tsx`의 `ThemeProvider attribute="data-theme"` |
| Preview block | `DashboardPreview`는 hero 안에서 `max-w-[1440px]` wrapper로 렌더링 |

## 3. 완료 후 사용자 변화

- 첫 화면 배경이 현재보다 더 동적이고 고급스럽게 보인다.
- CTA와 headline은 배경과 경쟁하지 않고 계속 선명하다.
- light mode에서는 gradient가 탁하거나 번져 보이지 않고, dark mode에서는 깊이감이 유지된다.
- reduced motion 사용자는 과한 animation 없이 static 또는 low-motion 배경을 본다.
- mobile 사용자에게 가로 스크롤이나 무거운 animation 부담이 생기지 않는다.

## 4. Reference 정책

CodePen reference는 visual direction과 구조 이해용이다. source code를 직접 복사하지 않는다. 현재 자동 visual capture는 CodePen Cloudflare verification 때문에 blocked 상태이며, 필요한 경우 manual browser verification 이후 capture를 재시도한다.
