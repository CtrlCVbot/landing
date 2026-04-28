# Decision Log: dash-preview-focus-zoom-animation

> **Feature**: Dash Preview Focus Zoom Animation
> **Source PRD**: `.plans/drafts/dash-preview-focus-zoom-animation/02-prd.md`
> **Status**: Phase A decisions recorded
> **Created**: 2026-04-27

---

## 1. Accepted Decisions

| ID | 결정 | 근거 | 영향 |
|---|---|---|---|
| `DEC-FZ-001` | Lite feature로 유지하고 `/plan-bridge`를 생략한다. | routing metadata category가 `Lite`이고 `/plan-bridge`는 Standard 전용이다. | 다음 단계는 `/dev-feature`다. |
| `DEC-FZ-002` | 기존 `src/components/dashboard-preview/` feature pocket 안에서 구현한다. | Architecture SSOT가 hybrid 구조와 dashboard-preview pocket을 채택했다. | 새 feature root나 shared package를 만들지 않는다. |
| `DEC-FZ-003` | focus zoom은 시각 보조 계층이다. | PRD Non-Goals가 실제 업무/API/DB 변경을 제외한다. | 데이터 모델, API, auth, analytics 변경 없음. |
| `DEC-FZ-004` | `US-FZ-003`은 click-to-card 4단계 반복으로 고정한다. | 사용자 피드백으로 자동 순차 표시가 아니라 클릭 기반 반복 흐름이 확정됐다. | apply phase metadata와 QA 기준의 핵심이다. |
| `DEC-FZ-005` | Mobile은 현재 `MobileCardView`를 유지한다. | `US-FZ-004` 사용자 피드백과 PRD REQ-009. | mobile file은 preservation check 대상이다. |
| `DEC-FZ-006` | 새 animation dependency를 추가하지 않는다. | 기존 `framer-motion`과 CSS transform으로 우선 해결한다. | `package.json` 변경은 scope 밖이다. |
| `DEC-FZ-007` | interactive mode와 focus viewport 좌표 충돌은 사전에 gate로 둔다. | overlay는 DOM target 측정과 fallback bounds를 사용한다. | interactive mode에서 focus transform을 끄거나 기준을 공유해야 한다. |
| `DEC-FZ-008` | reduced motion은 highlight-only fallback을 가진다. | motion 민감 사용자와 접근성 요구사항 때문이다. | large scale/translate를 끄는 경로가 필요하다. |
| `DEC-FZ-009` | browser screenshot evidence를 QA 기준에 포함한다. | 시각 품질은 unit test만으로 충분하지 않다. | desktop/tablet/mobile spot check가 release gate에 포함된다. |

---

## 2. Deferred Decisions

| ID | 항목 | 결정 시점 | 후보 |
|---|---|---|---|
| `OPEN-FZ-001` | focus metadata 파일 위치 | dev package 또는 구현 시작 전 | `src/lib/preview-focus.ts` 신규 vs `src/lib/preview-steps.ts` 확장 |
| `OPEN-FZ-002` | exact scale/offset preset | browser screenshot QA 중 | desktop/tablet 별도 preset |
| `OPEN-FZ-003` | focus viewport wrapper 구조 | implementation design 중 | `PreviewChrome` 내부 wrapper 분리 vs DashboardPreview orchestration |
| `OPEN-FZ-004` | interactive mode 충돌 처리 방식 | 구현 spike 또는 TASK 설계 중 | focus viewport disable vs shared transform basis |

---

## 3. Rejected or Out-of-Scope

| 항목 | 사유 |
|---|---|
| Mobile 전용 새 scene 설계 | 사용자가 현재 구현 유지로 확정했다. |
| 실제 form 입력 기능화 | landing demo 표현 개선이 목적이며 업무 기능이 아니다. |
| Hero layout 재설계 | 이번 feature의 allowed paths 밖이다. |
| 새 3D/WebGL/영상 asset | PRD Non-Goals와 dependency control에 맞지 않는다. |

---

## 4. Risk Notes

| 리스크 | 현재 대응 |
|---|---|
| `PreviewChrome` base scale과 focus scale 충돌 | binding에서 transform 책임 분리를 guardrail로 둔다. |
| overlay 좌표 회귀 | `interactive-overlay.test.tsx`, browser spot check를 권장 test path에 포함했다. |
| Mobile regression | `mobile-card-view.tsx` 변경 금지와 mobile regression check를 명시했다. |
| 시각 품질 미흡 | screenshot evidence를 QA 산출물로 둔다. |
