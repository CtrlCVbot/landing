# Decision Log: hero-01-reference-hero-refresh

> **Feature Slug**: `hero-01-reference-hero-refresh`
> **Status**: accepted for dev handoff
> **Created**: 2026-04-28

---

## 1. Accepted Decisions

| ID | 결정 | 근거 |
|---|---|---|
| `D-HR-001` | Feature lane은 Standard, type은 copy-dev hybrid로 진행한다. | local reference fidelity와 app theme adaptation이 함께 필요하다. |
| `D-HR-002` | 기본 구현 후보는 Canvas 2D first-pass + CSS fallback이다. | `hero-01`의 liquid field에 가까우면서 heavy dependency risk를 낮출 수 있다. |
| `D-HR-003` | `WebGL/Three.js`는 명시 승인 gate 없이는 도입하지 않는다. | bundle size, GPU fallback, mobile 성능 리스크가 있다. |
| `D-HR-004` | Hero headline은 현재 product copy인 `운송 운영을 한눈에`를 유지한다. | reference는 visual hierarchy의 기준이며 제품 메시지의 source가 아니다. |
| `D-HR-005` | `DashboardPreview`는 유지하고, headline/CTA보다 낮은 visual priority로 배치한다. | 제품 증거는 필요하지만 첫 시선과 CTA를 가리면 전환 리스크가 생긴다. |
| `D-HR-006` | Reference controls, custom cursor, footer attribution은 production DOM에서 제외한다. | debug/design UI이며 landing 사용자 행동과 맞지 않는다. |
| `D-HR-007` | Light/dark palette는 current theme token 기반으로 재구성한다. | 기존 theme 전환과 landing visual identity를 유지해야 한다. |
| `D-HR-008` | QA evidence는 screenshot 중심으로 남긴다. | 자동 테스트만으로 reference similarity를 검증하기 어렵다. |

---

## 2. Deferred Decisions

| ID | 보류 항목 | dev에서 결정할 기준 |
|---|---|---|
| `O-HR-001` | 기존 `HeroLiquidGradientBackground`를 유지할지, `HeroFieldLayer`로 rename/split할지 | 변경 범위와 test churn이 작은 쪽을 선택한다. |
| `O-HR-002` | Canvas 2D 구현 route 최종 채택 여부 | lifecycle 구현 비용과 visual gap evidence를 비교한다. |
| `O-HR-003` | CSS fallback의 token 이름 | `globals.css`의 현재 `--hero-gradient-*` 구조와 가장 덜 충돌하는 이름을 선택한다. |
| `O-HR-004` | screenshot evidence 저장 위치 | 기존 output 관례가 있으면 따르고, 없으면 `output/hero-01-parity-qa/`를 사용한다. |

---

## 3. Out of Scope

| 항목 | 사유 |
|---|---|
| Hero 외 landing section 재설계 | 이번 feature는 첫 viewport Hero로 닫힌다. |
| CTA 목적지 변경 | 전환 흐름 변경은 별도 product decision이다. |
| DashboardPreview 내부 business flow 변경 | 이번 feature는 preview placement와 visual hierarchy만 다룬다. |
| API/DB/analytics 추가 | visual refresh와 무관하다. |
| Reference app의 controls UI 이전 | production UX가 아니라 design utility다. |

---

## 4. Risk Notes

| Risk | Severity | 대응 |
|---|---|---|
| Canvas lifecycle 누락 | high | resize, DPR cap, visibility pause, cleanup을 dev task와 test case에 포함한다. |
| Light mode contrast 저하 | high | contrast veil과 screenshot review를 release gate에 둔다. |
| Mobile overflow | high | mobile viewport measurement와 screenshot evidence를 필수로 둔다. |
| Visual fidelity 부족 | medium | browser screenshot gap board로 남기고, 필요 시 route revision을 제안한다. |
| Dependency creep | medium | `package.json` diff와 WebGL approval gate를 release checklist에 둔다. |
