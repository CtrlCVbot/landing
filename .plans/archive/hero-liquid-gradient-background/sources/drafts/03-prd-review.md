# PRD Review: Hero 섹션 liquid gradient 배경

> **PRD**: [02-prd.md](./02-prd.md)
> **Draft**: [01-draft.md](./01-draft.md)
> **Routing metadata**: [07-routing-metadata.md](./07-routing-metadata.md)
> **작성일**: 2026-04-27
> **상태**: PASS with noted follow-up

---

## 1. Review Summary

| 항목 | 판정 | 근거 |
|---|---|---|
| 10개 필수 섹션 | PASS | Overview, Problem, Goals, User Stories, Functional Requirements, UX, Technical, Milestones, Risks, Metrics 포함 |
| Draft 일관성 | PASS | CSS-first MVP, WebGL deferred, `GradientBlob` fallback, reference-only 정책 승계 |
| 요구사항 ID 체계 | PASS | `REQ-hero-liquid-gradient-background-###` 형식으로 16건 작성 |
| Scope control | PASS | CodePen controls, custom cursor, `Three.js` 첫 구현 제외 명시 |
| 검증 가능성 | PASS | component test, screenshot review, browser check 기준 분리 |
| 남은 blocker | 없음 | PRD 작성 단계 blocker 없음 |

## 2. PRD Checklist

| 체크 항목 | 상태 | 메모 |
|---|---|---|
| 10개 PRD 섹션 존재 | 완료 | 1~10 섹션 충족, 11~13은 산출물/다음 단계/변경 이력 |
| User Story 형식 | 완료 | 6개 story 모두 As a / I want / so that 형식 |
| Functional Requirement ID | 완료 | REQ 16건 |
| 우선순위 명시 | 완료 | Must/Should 사용 |
| 수용 기준 측정 가능성 | 완료 | test, screenshot review, diff review, browser check로 분리 |
| Non-Goals 명시 | 완료 | WebGL, CodePen UI, layout redesign 제외 |
| 기술 제약 연결 | 완료 | 실제 `Hero`, `GradientBlob`, test, dependency 상태 반영 |
| Milestone 현실성 | 완료 | PRD review -> bridge -> CSS-first -> QA -> decision gate |
| Risk와 mitigation | 완료 | CTA, mobile, motion, license, evidence 리스크 포함 |
| Success Metrics 측정 가능성 | 완료 | SM 12건, 측정 방법 포함 |
| Reference evidence 상태 | 완료 | Cloudflare blocked 상태를 visual evidence 리스크로 분리 |
| 이전 단계 범위와 일치 | 완료 | screening/draft의 Lite, dev, hybrid, scenario B 유지 |

## 3. Feedback Items

| 항목 | Severity | Score | Confidence | Action | 결과 |
|---|---|---:|---|---|---|
| WebGL 범위가 MVP로 섞일 수 있음 | medium | 4 | confirmed | auto-fixed | Non-Goals, REQ-004, REQ-016, M5 decision gate에 분리 |
| CodePen visual capture가 blocked 상태임 | medium | 4 | confirmed | queued | PRD의 Technical/Risk/Next Steps에 남김. 구현 전 필요하면 manual capture 재시도 |
| light/dark theme별 gradient 대응 누락 | high | 5 | confirmed | auto-fixed | REQ-011, UX, Technical, Risk, Success Metric에 theme별 gradient variant와 QA 기준 추가 |
| 기존 F1 theme token 연결이 약함 | medium | 4 | confirmed | auto-fixed | REQ-012와 Technical Considerations에 기존 `--landing-accent-*` / `--color-accent-*` token 연결 기준 추가 |
| stacking context 기준이 느슨함 | medium | 4 | likely | auto-fixed | REQ-013과 layer QA metric 추가 |
| theme toggle 안정성 기준이 없음 | medium | 4 | likely | auto-fixed | REQ-014와 browser check metric 추가 |
| 요구사항이 구현 방법으로 과도하게 기울 수 있음 | low | 2 | likely | auto-fixed | CSS-first는 constraint로만 두고, 실제 component 설계는 bridge/dev 단계로 넘김 |

### Severity Score Detail

| 항목 | Impact | Reach | Recovery | Total | Confidence | Action |
|---|---:|---:|---:|---:|---|---|
| WebGL scope creep | 2 | 1 | 1 | 4 | confirmed | auto-fixed |
| Visual evidence blocked | 2 | 1 | 1 | 4 | confirmed | queued |
| Theme adaptation missing | 3 | 1 | 1 | 5 | confirmed | auto-fixed |
| Theme token drift | 2 | 1 | 1 | 4 | confirmed | auto-fixed |
| Layering ambiguity | 2 | 1 | 1 | 4 | likely | auto-fixed |
| Theme toggle mismatch | 2 | 1 | 1 | 4 | likely | auto-fixed |
| Implementation leakage | 1 | 1 | 0 | 2 | likely | auto-fixed |

## 4. Review Decision

**PASS with noted follow-up**.

PRD는 `/plan-bridge hero-liquid-gradient-background`로 넘길 수 있다. 단, CodePen visual evidence는 현재 Cloudflare verification 때문에 blocked 상태이므로, 구현자가 reference와의 visual similarity를 강하게 요구받는다면 manual capture를 먼저 보강해야 한다.

사용자 피드백으로 확인된 light/dark theme별 gradient 대응 누락은 반영 완료했다. 구현 단계에서는 light mode와 dark mode screenshot review를 별도 acceptance check로 다룬다.

추가 self-review에서 확인한 theme token 연결, stacking context, theme toggle 안정성 기준도 PRD에 반영했다. 현재 PRD는 `/plan-bridge`로 넘길 수 있으며, bridge 단계에서는 이 3개 항목을 구현 TASK의 acceptance criteria에 그대로 유지해야 한다.

## 5. Next Steps

1. 사용자 승인 후 `/plan-bridge hero-liquid-gradient-background`를 실행한다.
2. Bridge에서 allowed target paths를 `src/components/sections/hero.tsx`, `src/components/shared/**`, hero test 범위로 좁힌다.
3. 구현 전 visual reference가 더 필요하면 manual browser verification 후 reference capture를 재시도한다.
