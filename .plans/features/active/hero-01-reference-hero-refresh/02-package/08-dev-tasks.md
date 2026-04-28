# Dev Tasks: hero-01-reference-hero-refresh

> **Feature**: hero-01 레퍼런스 기반 Hero 섹션 재개선
> **Requirements SSOT**: `01-requirements.md`
> **Test Cases**: `09-test-cases.md`
> **Created**: 2026-04-28

---

## 0. 이 문서의 역할

이 문서는 `/dev-run`에서 실행할 수 있는 구현 단위 TASK 목록이다. 각 TASK는 요구사항과 test case를 연결한다.

---

## M1. Route and Component Foundation

| TASK | 목표 | 주요 파일 | REQ | TC |
|---|---|---|---|---|
| `T-HR-M1-01` | implementation route를 Canvas 2D 또는 CSS enhanced field 중 선택하고 기록 | `hero-liquid-gradient-background.tsx`, `10-release-checklist.md` | `REQ-HR-002`, `REQ-HR-016` | `TC-HR-REL-04` |
| `T-HR-M1-02` | Hero shell의 z-index, full-bleed layer, content order 정리 | `hero.tsx` | `REQ-HR-001`, `REQ-HR-011` | `TC-HR-COMP-01`, `TC-HR-VIS-01` |

완료 게이트:

- background layer와 content layer 책임이 분리된다.
- `DashboardPreview`는 유지된다.
- WebGL dependency는 승인 없이 추가하지 않는다.

---

## M2. Hero Field and Motion Policy

| TASK | 목표 | 주요 파일 | REQ | TC |
|---|---|---|---|---|
| `T-HR-M2-01` | full-bleed liquid field 구현 | `hero-liquid-gradient-background.tsx` 또는 `hero-field-layer.tsx` | `REQ-HR-001`, `REQ-HR-002` | `TC-HR-COMP-01`, `TC-HR-VIS-01` |
| `T-HR-M2-02` | light palette preset 연결 | `globals.css`, background component | `REQ-HR-003`, `REQ-HR-007` | `TC-HR-THEME-01`, `TC-HR-VIS-03` |
| `T-HR-M2-03` | dark palette preset 연결 | `globals.css`, background component | `REQ-HR-004`, `REQ-HR-007` | `TC-HR-THEME-02`, `TC-HR-VIS-04` |
| `T-HR-M2-04` | reduced-motion, mobile low-intensity, pointer policy 구현 | background component | `REQ-HR-010`, `REQ-HR-013`, `REQ-HR-014` | `TC-HR-A11Y-01`, `TC-HR-VIS-05` |

완료 게이트:

- `prefers-reduced-motion`에서 loop와 pointer response가 비활성화된다.
- mobile에서 blob intensity를 줄일 수 있다.
- Canvas route면 cleanup과 visibility pause가 구현된다.

---

## M3. Hero Hierarchy and Theme Readability

| TASK | 목표 | 주요 파일 | REQ | TC |
|---|---|---|---|---|
| `T-HR-M3-01` | headline/subtitle/CTA hierarchy 조정 | `hero.tsx` | `REQ-HR-005`, `REQ-HR-011` | `TC-HR-COMP-02`, `TC-HR-VIS-02` |
| `T-HR-M3-02` | contrast veil 또는 text treatment 구현 | `hero.tsx`, `globals.css` | `REQ-HR-005`, `REQ-HR-007` | `TC-HR-VIS-03`, `TC-HR-VIS-04` |
| `T-HR-M3-03` | mobile/tablet layout overflow와 overlap 방지 | `hero.tsx`, CSS tokens | `REQ-HR-012`, `REQ-HR-013` | `TC-HR-VIS-05`, `TC-HR-REL-02` |

완료 게이트:

- product headline은 `운송 운영을 한눈에`로 유지된다.
- Primary CTA가 first visual action으로 보인다.
- mobile screenshot에서 horizontal overflow가 없다.

---

## M4. Regression Guards

| TASK | 목표 | 주요 파일 | REQ | TC |
|---|---|---|---|---|
| `T-HR-M4-01` | reference exclusion DOM guard 추가 | `hero.test.tsx` | `REQ-HR-008`, `REQ-HR-009` | `TC-HR-COMP-03`, `TC-HR-REL-03` |
| `T-HR-M4-02` | CTA click/focus regression 보강 | `hero.test.tsx` | `REQ-HR-006` | `TC-HR-COMP-02` |
| `T-HR-M4-03` | theme token regression 보강 | `light-theme.test.tsx` | `REQ-HR-003`, `REQ-HR-004` | `TC-HR-THEME-01`, `TC-HR-THEME-02` |

완료 게이트:

- reference controls와 custom cursor가 test에서 금지된다.
- background는 CTA interaction을 막지 않는다.
- theme token은 light/dark 모두 검증된다.

---

## M5. QA Evidence and Release Prep

| TASK | 목표 | 주요 파일 | REQ | TC |
|---|---|---|---|---|
| `T-HR-M5-01` | desktop/mobile light/dark screenshot evidence 수집 | `10-release-checklist.md`, `output/hero-01-parity-qa/` if used | `REQ-HR-015` | `TC-HR-REL-01` |
| `T-HR-M5-02` | type/lint/test/build 결과 기록 | `10-release-checklist.md` | `REQ-HR-015`, `REQ-HR-016` | `TC-HR-REL-04` |

완료 게이트:

- targeted tests 통과.
- typecheck, lint, build 통과 또는 실패 사유 기록.
- visual gap board 또는 screenshot notes가 남는다.

---

## Recommended Execution Order

1. `T-HR-M1-01`~`T-HR-M1-02`
2. `T-HR-M2-01`~`T-HR-M2-04`
3. `T-HR-M3-01`~`T-HR-M3-03`
4. `T-HR-M4-01`~`T-HR-M4-03`
5. `T-HR-M5-01`~`T-HR-M5-02`
