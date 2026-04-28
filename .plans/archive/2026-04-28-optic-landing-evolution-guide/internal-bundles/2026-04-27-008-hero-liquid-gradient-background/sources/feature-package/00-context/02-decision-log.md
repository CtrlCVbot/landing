# 02. Decision Log - Hero Liquid Gradient Background

> Feature 구현 중 발생한 결정을 추적한다.
> Draft/PRD 단계의 확정 결정은 [`03-design-decisions.md`](./03-design-decisions.md)를 우선 참조한다.

---

## 1. Existing Accepted Decisions

| ID | 결정 | 상태 |
|---|---|---|
| D-HLG-001 | 첫 구현은 CSS-first MVP | accepted |
| D-HLG-002 | `Three.js` / WebGL은 deferred | accepted |
| D-HLG-003 | CodePen은 reference-only, source copy 금지 | accepted |
| D-HLG-004 | 기존 `GradientBlob`은 fallback 또는 reduced-motion 자산으로 보존 | accepted |
| D-HLG-005 | light/dark theme별 gradient variant 제공 | accepted |
| D-HLG-006 | 기존 F1 theme token 체계에 연결 | accepted |
| D-HLG-007 | stacking context와 theme toggle 안정성을 acceptance criteria로 유지 | accepted |

## 2. Bridge Decisions

### D-HLG-008. Bridge 범위는 `00-context`까지로 제한

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-27 |
| 결정자 | 사용자 요청 + Codex |
| 내용 | `/plan-bridge` 단계에서는 active feature의 `00-context`만 생성하고, 공식 TASK 문서는 `/dev-feature`에서 생성한다. |
| 근거 | 사용자 선택은 `/plan-bridge hero-liquid-gradient-background` 진행이었고, 구현/TASK 확정은 아직 요청되지 않았다. |

### D-HLG-009. Wireframe/Stitch 생략

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-27 |
| 결정자 | Codex |
| 내용 | 이 feature는 Lite/dev hero background 개선이므로 별도 wireframe/Stitch 산출물을 요구하지 않는다. |
| 근거 | routing metadata의 `post_wireframe_path: null`, `copy_needed: false`, `feature_type: dev`, PRD scope. |

### D-HLG-010. Feature Package와 TASK 문서 생성

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-27 |
| 결정자 | 사용자 요청 + Codex |
| 내용 | `/dev-feature` 대응으로 `02-package` 공식 문서와 `03-dev-notes/qa-notes.md` 템플릿을 생성했다. |
| 근거 | Bridge 완료 후 사용자가 다음 단계 1번을 선택했고, 다음 실행 단위로 `/dev-run` 가능한 TASK가 필요했다. |
| 다음 단계 | `/dev-run .plans/features/active/hero-liquid-gradient-background/` |

## 3. Implementation Decisions

### D-HLG-011. Background component split

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-27 |
| 결정자 | Codex |
| 선택값 | `src/components/shared/hero-liquid-gradient-background.tsx` 신규 component |
| 근거 | `Hero`의 책임은 layout/composition으로 유지하고, gradient layer class와 test id를 독립 component로 분리하면 acceptance test가 명확해진다. |
| 영향 범위 | `src/components/sections/hero.tsx`, `src/components/shared/hero-liquid-gradient-background.tsx` |
| Rollback | component import와 render를 제거하면 기존 `GradientBlob` fallback만 남는다. |

### D-HLG-012. Theme token extension

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-27 |
| 결정자 | Codex |
| 선택값 | `--hero-gradient-*` token을 `:root`와 `[data-theme="dark"]`에 동시 정의 |
| 근거 | 사용자가 지적한 light/dark gradient 누락을 theme token layer에서 해결해야 theme toggle 후에도 배경 색이 고정되지 않는다. |
| 영향 범위 | `src/app/globals.css`, `src/__tests__/light-theme.test.tsx` |
| Rollback | `--hero-gradient-*` 정의와 component CSS block을 제거한다. |

### D-HLG-013. Fallback preservation

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-27 |
| 결정자 | Codex |
| 선택값 | 기존 `GradientBlob` 2개를 유지하고 신규 layer를 그 아래/동일 background group에 배치 |
| 근거 | CodePen 원본과 1:1 WebGL parity가 deferred이므로 기존 fallback을 제거하면 회귀 리스크가 커진다. |
| 영향 범위 | `src/components/sections/hero.tsx`, Hero acceptance test |
| Rollback | 신규 layer 제거 시 기존 `GradientBlob` 기반 visual fallback 유지. |

### D-HLG-014. Visual evidence policy

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-27 |
| 결정자 | Codex |
| 선택값 | CodePen 자동 캡처는 blocked로 기록하고, local Playwright QA screenshots와 JSON을 release evidence로 사용 |
| 근거 | Cloudflare verification으로 CodePen 자동 캡처가 막혔고, source code 직접 복사는 금지되어 있다. |
| 영향 범위 | `03-dev-notes/qa-notes.md`, `output/hero-liquid-gradient-qa/**` |
| Rollback | CodePen 접근 가능 시 manual/reference screenshot을 추가 evidence로 append한다. |
