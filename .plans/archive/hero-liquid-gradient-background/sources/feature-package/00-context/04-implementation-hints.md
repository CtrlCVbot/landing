# 04. Implementation Hints — Hero 섹션 liquid gradient 배경

> 구현자를 위한 힌트 문서다. 공식 TASK ID와 순서는 `/dev-feature`에서 확정한다.

---

## 1. 예상 TASK 분할

| 예상 TASK | 목표 | 주요 파일 |
|---|---|---|
| T-HLG-TEST-01 | Hero background acceptance test 작성 | `src/components/sections/__tests__/hero.test.tsx` |
| T-HLG-TOKEN-02 | light/dark gradient token 연결 | `src/app/globals.css`, 필요 시 `src/__tests__/light-theme.test.tsx` |
| T-HLG-COMP-03 | CSS-first background component 구현 | `hero.tsx`, `src/components/shared/**` |
| T-HLG-MOTION-04 | reduced motion / mobile intensity 정리 | component class, CSS media query |
| T-HLG-QA-05 | screenshot/browser QA evidence 정리 | `.plans/features/active/hero-liquid-gradient-background/**` |

## 2. 권장 실행 순서

1. `Hero` test에 background layer, `pointer-events-none`, CTA link, `DashboardPreview` wrapper 유지 조건을 먼저 추가한다.
2. 기존 `--landing-accent-*` / `--color-accent-*` token으로 충분한지 확인한다.
3. 부족하면 `--hero-gradient-*` token을 `:root`와 `[data-theme="dark"]`에 동시에 추가한다.
4. CSS-first background component를 만들고 `Hero`에 mount한다.
5. reduced motion과 mobile class를 정리한다.
6. light/dark desktop/mobile screenshot과 theme toggle check를 수행한다.

## 3. 검색 힌트

```bash
Select-String -Path 'src/**/*.tsx','src/**/*.css' -Pattern 'GradientBlob','gradient','data-theme','landing-accent','color-accent'
Select-String -Path 'src/**/*.test.ts','src/**/*.test.tsx' -Pattern 'Hero','gradient-blob','ThemeProvider','data-theme'
```

## 4. 검증 힌트

```bash
pnpm test src/components/sections/__tests__/hero.test.tsx
pnpm test src/__tests__/light-theme.test.tsx
pnpm typecheck
pnpm lint
```

Browser QA 권장 항목:

| 항목 | 확인 |
|---|---|
| desktop dark | headline/CTA/preview 가독성 |
| desktop light | gradient가 탁하거나 과하게 번지지 않음 |
| mobile dark/light | horizontal overflow 없음 |
| reduced motion | animation 제거 또는 크게 축소 |
| theme toggle | 이전 theme gradient가 남지 않음 |
| CTA | `#contact` link click 가능 |

## 5. 주의

- `package.json`에 `three` 또는 WebGL 관련 dependency를 추가하지 않는다.
- `DashboardPreview` 내부 구현을 변경하지 않는다.
- CodePen source code를 직접 복사하지 않는다.
- theme token을 추가하면 light/dark 양쪽 값을 함께 정의한다.
- background layer는 `aria-hidden`과 `pointer-events: none`을 유지한다.
