# Test Cases: hero-01-reference-hero-refresh

> **Feature**: hero-01 레퍼런스 기반 Hero 섹션 재개선
> **Requirements SSOT**: `01-requirements.md`
> **Dev Tasks**: `08-dev-tasks.md`
> **Created**: 2026-04-28

---

## 0. 이 문서의 역할

이 문서는 구현 후 검증해야 할 test case 목록이다. 자동 테스트와 browser visual check를 분리한다.

---

## 1. Component Tests

| TC | 목적 | 검증 | REQ |
|---|---|---|---|
| `TC-HR-COMP-01` | Hero field render | decorative field가 content 뒤에 있고 `aria-hidden` 또는 동등한 처리를 가진다. | `REQ-HR-001`, `REQ-HR-002` |
| `TC-HR-COMP-02` | CTA click/focus regression | primary/secondary CTA가 렌더링되고 click/focus target이 background에 막히지 않는다. | `REQ-HR-005`, `REQ-HR-006` |
| `TC-HR-COMP-03` | reference exclusion guard | color controls, adjuster, export UI, custom cursor가 DOM에 없다. | `REQ-HR-008`, `REQ-HR-009` |

---

## 2. Theme Tests

| TC | 목적 | 검증 | REQ |
|---|---|---|---|
| `TC-HR-THEME-01` | light palette tokens | light mode Hero field와 veil token이 존재한다. | `REQ-HR-003`, `REQ-HR-007` |
| `TC-HR-THEME-02` | dark palette tokens | dark mode Hero field와 veil token이 존재한다. | `REQ-HR-004`, `REQ-HR-007` |

---

## 3. Accessibility / Motion Tests

| TC | 목적 | 검증 | REQ |
|---|---|---|---|
| `TC-HR-A11Y-01` | reduced motion | `prefers-reduced-motion`에서 animation loop와 pointer tracking이 꺼지거나 static 처리된다. | `REQ-HR-014` |
| `TC-HR-A11Y-02` | decorative layer accessibility | background가 keyboard order와 screen reader output을 방해하지 않는다. | `REQ-HR-006`, `REQ-HR-014` |

---

## 4. Visual / Browser Checks

| TC | Viewport | 검증 | REQ |
|---|---|---|---|
| `TC-HR-VIS-01` | Desktop | full-bleed liquid field가 first viewport의 주 visual signal로 보인다. | `REQ-HR-001` |
| `TC-HR-VIS-02` | Desktop | headline과 primary CTA가 field 위에서도 명확하다. | `REQ-HR-005`, `REQ-HR-006` |
| `TC-HR-VIS-03` | Desktop light | light mode palette가 탁하거나 washed-out 되지 않는다. | `REQ-HR-003`, `REQ-HR-007` |
| `TC-HR-VIS-04` | Desktop dark | dark mode가 violet/blue 한 톤으로만 보이지 않는다. | `REQ-HR-004`, `REQ-HR-007` |
| `TC-HR-VIS-05` | Mobile | text/CTA/preview overlap과 horizontal overflow가 없다. | `REQ-HR-012`, `REQ-HR-013` |
| `TC-HR-VIS-06` | Reduced motion | static 또는 low-motion field가 hierarchy를 유지한다. | `REQ-HR-014`, `REQ-HR-015` |

---

## 5. Release Evidence

| TC | 검증 | REQ |
|---|---|---|
| `TC-HR-REL-01` | release checklist에 desktop/mobile, light/dark, reduced-motion screenshot evidence를 기록한다. | `REQ-HR-015` |
| `TC-HR-REL-02` | browser measurement 또는 screenshot으로 overflow-x 없음 확인을 기록한다. | `REQ-HR-012` |
| `TC-HR-REL-03` | `package.json` diff에서 승인 없는 heavy graphics dependency가 없음을 확인한다. | `REQ-HR-016` |
| `TC-HR-REL-04` | implementation route, targeted tests, typecheck, lint, build 결과를 기록한다. | `REQ-HR-015`, `REQ-HR-016` |

---

## 6. Suggested Commands

```bash
pnpm run test -- hero light-theme
pnpm run typecheck
pnpm run lint
pnpm run build
```

Browser evidence는 desktop light/dark, mobile light/dark, reduced-motion을 각각 확인한다. 이 feature는 시각 품질이 핵심이므로 자동 테스트만으로 release-ready를 선언하지 않는다.

---

## 7. Executed Evidence

| Check | Result | Evidence |
|---|---|---|
| `pnpm run test -- hero light-theme` | Pass | 2 files, 408 tests |
| `pnpm run typecheck` | Pass | `tsc --noEmit` |
| `pnpm run lint` | Pass | 기존 dashboard-preview warning만 있음 |
| `pnpm run build` | Pass | Next.js production build/export 완료 |
| Browser QA | Pass | `output/hero-01-parity-qa/browser-qa.json`, `failureCount: 0` |
| User visual approval | Pass | "만족 스럽습니다" 피드백 수신 |

Browser QA는 `localhost:3103`의 최신 dev server 기준으로 desktop light/dark, transition screenshots, mobile light/dark, reduced-motion을 확인했다. 기존 `localhost:3101` process는 stale `500` 상태였으므로 release evidence에는 포함하지 않는다.
