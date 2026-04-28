# 09. Test Cases - Hero 섹션 liquid gradient 배경

---

## 테스트 케이스 목록

| TC | REQ | 검증 대상 | 권장 명령 |
|---|---|---|---|
| TC-HLG-01 | REQ-hero-liquid-gradient-background-001 | Hero background layer 렌더링 | `pnpm test src/components/sections/__tests__/hero.test.tsx` |
| TC-HLG-02 | REQ-hero-liquid-gradient-background-002 | background `pointer-events: none`, CTA clickability 구조 | `pnpm test src/components/sections/__tests__/hero.test.tsx` |
| TC-HLG-03 | REQ-hero-liquid-gradient-background-003 | fallback 또는 reduced-motion 대안 존재 | Hero test + CSS review |
| TC-HLG-04 | REQ-hero-liquid-gradient-background-005 | reduced motion animation 제거/축소 | CSS review + browser check |
| TC-HLG-05 | REQ-hero-liquid-gradient-background-006, 011 | light/dark gradient variant | `pnpm test src/__tests__/light-theme.test.tsx` + screenshot review |
| TC-HLG-06 | REQ-hero-liquid-gradient-background-007 | headline/subtitle/CTA 가독성 | screenshot review |
| TC-HLG-07 | REQ-hero-liquid-gradient-background-008 | `DashboardPreview` 가시성 | Hero test + screenshot review |
| TC-HLG-08 | REQ-hero-liquid-gradient-background-004 | CSS-first dependency guard | `git diff package.json` review |
| TC-HLG-09 | REQ-hero-liquid-gradient-background-009 | mobile horizontal overflow 없음 | browser check |
| TC-HLG-10 | REQ-hero-liquid-gradient-background-010 | CodePen source copy 없음 | diff review |
| TC-HLG-11 | REQ-hero-liquid-gradient-background-012 | theme token alignment | CSS/test review |
| TC-HLG-12 | REQ-hero-liquid-gradient-background-013 | stacking context 안정성 | Hero test + screenshot review |
| TC-HLG-13 | REQ-hero-liquid-gradient-background-014 | theme toggle stability | browser check |
| TC-HLG-14 | REQ-hero-liquid-gradient-background-015 | reference evidence 상태 기록 | QA notes review |
| TC-HLG-15 | REQ-hero-liquid-gradient-background-016 | WebGL gate 유지 | package diff + decision log review |

---

## Red-Green 권장 순서

1. TC-HLG-01, 02, 07, 12를 먼저 추가해 Hero layer RED를 만든다.
2. TC-HLG-05, 11, 13 기준으로 theme token acceptance를 확정한다.
3. T-HLG-COMP-03 구현으로 Hero layer tests를 GREEN으로 만든다.
4. TC-HLG-04, 09를 기준으로 reduced motion/mobile fallback을 보강한다.
5. TC-HLG-06, 10, 14, 15로 visual QA와 policy guard를 마무리한다.

---

## Browser QA Matrix

| 상태 | Viewport | 확인 |
|---|---|---|
| dark | desktop | headline/CTA/preview readable |
| light | desktop | gradient가 탁하지 않음 |
| dark | mobile 390px | horizontal overflow 없음 |
| light | mobile 390px | CTA/preview와 background 충돌 없음 |
| reduced motion | any | animation 제거 또는 크게 축소 |
| theme toggle | any | 이전 theme gradient 잔존 없음 |

---

## 전체 회귀 기준

```bash
pnpm test src/components/sections/__tests__/hero.test.tsx
pnpm test src/__tests__/light-theme.test.tsx
pnpm typecheck
pnpm lint
```

구현 완료 선언 전 browser screenshot review 결과를 최종 보고에 남긴다.
