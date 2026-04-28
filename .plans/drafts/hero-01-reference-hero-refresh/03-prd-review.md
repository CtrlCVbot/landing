# PRD Review: hero-01 레퍼런스 기반 Hero 섹션 재개선

> **PRD**: [02-prd.md](./02-prd.md)
> **Draft**: [01-draft.md](./01-draft.md)
> **Routing metadata**: [07-routing-metadata.md](./07-routing-metadata.md)
> **작성일**: 2026-04-28
> **상태**: PASS with noted follow-up

---

## 1. Review Summary

| 항목 | 판정 | 근거 |
|---|---|---|
| 10개 필수 섹션 | PASS | Overview, Problem, Goals, User Stories, Functional Requirements, UX, Technical, Milestones, Risks, Metrics 포함 |
| Draft 일관성 | PASS | `hero-01` reference fidelity, theme adaptation, Canvas 2D 후보, WebGL gate, controls 제외 범위가 draft와 일치 |
| 요구사항 ID 체계 | PASS | `REQ-hero-01-reference-hero-refresh-###` 형식으로 16건 작성 |
| Scope control | PASS | controls UI, custom cursor, source copy, DashboardPreview 기능 변경, WebGL 무승인 도입 제외 |
| 검증 가능성 | PASS | screenshot, contrast, interaction, reduced-motion, dependency diff 기준 분리 |
| 남은 blocker | 없음 | PRD 단계 blocker 없음 |

## 2. PRD Checklist

| 체크 항목 | 상태 | 메모 |
|---|---|---|
| 10개 PRD 섹션 존재 | 완료 | 1~10 섹션 충족, 11~13은 산출물/다음 단계/변경 이력 |
| User Story 형식 | 완료 | 8개 story 모두 As a / I want / so that 형식 |
| Functional Requirement ID | 완료 | REQ 16건 |
| 우선순위 명시 | 완료 | Must/Should 사용 |
| 수용 기준 측정 가능성 | 완료 | screenshot, contrast, browser interaction, diff review로 분리 |
| Non-Goals 명시 | 완료 | reference controls, source copy, heavy dependency, Hero 외 섹션 변경 제외 |
| 기술 제약 연결 | 완료 | `Hero`, `HeroLiquidGradientBackground`, `globals.css`, Canvas lifecycle, static export 고려 |
| Milestone 현실성 | 완료 | PRD review -> wireframe -> bridge -> implementation route -> dev -> QA -> closeout |
| Risk와 mitigation | 완료 | CTA conflict, Canvas lifecycle, contrast, mobile performance, source/license, WebGL creep 포함 |
| Success Metrics 측정 가능성 | 완료 | SM 10건, 측정 방법 포함 |
| 이전 단계 범위와 일치 | 완료 | Standard, Scenario C, copy-dev hybrid 유지 |
| 접근성 고려 | 완료 | `aria-hidden`, keyboard focus, reduced motion, contrast 기준 포함 |

## 3. PCC 검증

| PCC | 판정 | 근거 |
|---|---|---|
| PCC-01 Idea ↔ Screen | PASS | IDEA와 SCREENING 모두 `20-approved` 상태 |
| PCC-02 Screen ↔ Feature | PASS | 승인 IDEA 기반 draft `01-draft.md` 존재 |
| PCC-03 Feature ↔ PRD | PASS | draft의 reference fidelity, theme adaptation, implementation route, risk가 PRD에 반영됨 |
| PCC-04 PRD ↔ Wireframe | PENDING | 다음 단계가 wireframe이므로 아직 산출물 없음 |
| PCC-06 Reference Gap ↔ Detail PRD | PASS with follow-up | formal gap board는 없지만 draft/PRD에 reference include/exclude와 current gap table이 반영됨. wireframe에서 visual mapping을 더 구체화해야 함 |
| PCC-07~09 Epic 계층 | 해당 없음 | Epic binding 없음 |

## 4. Feedback Items

| 항목 | Severity | Score | Confidence | Action | 결과 |
|---|---|---:|---|---|---|
| wireframe 필요 여부가 conditional로 남아 있으면 다음 단계가 흔들릴 수 있음 | medium | 4 | confirmed | auto-fixed | PRD에서 `/plan-wireframe` 필요로 확정 |
| Canvas 2D route가 lifecycle 기준 없이 구현될 위험 | high | 5 | confirmed | auto-fixed | Technical/REQ/Risk에 DPR, resize, visibility, cleanup, reduced-motion 기준 추가 |
| CTA 전환 목적이 reference copy에 밀릴 위험 | high | 5 | likely | auto-fixed | Goals, UX, Risks, Success Metrics에 CTA 가독성/클릭 기준 추가 |
| light/dark palette가 추상적으로 남을 위험 | medium | 4 | confirmed | auto-fixed | REQ-003/004/007과 theme policy에 token 후보와 highlight 기준 반영 |
| production DOM에 reference controls가 섞일 위험 | medium | 3 | likely | auto-fixed | REQ-008, Non-Goals, Success Metrics에 controls/custom cursor 제외 기준 추가 |
| source/license 리스크가 누락될 위험 | medium | 3 | likely | auto-fixed | REQ-009와 Risk에 source copy 금지 추가 |
| WebGL/Three.js scope creep | high | 5 | likely | auto-fixed | Non-Goals, Technical, Risk, Metrics에 explicit approval gate 추가 |
| mobile 성능/overflow 검증이 약할 위험 | medium | 4 | likely | auto-fixed | REQ-012/013, UX, Milestones, Metrics에 mobile QA 포함 |

### Severity Score Detail

| 항목 | Impact | Reach | Recovery | Total | Confidence | Action |
|---|---:|---:|---:|---:|---|---|
| Wireframe routing ambiguity | 2 | 1 | 1 | 4 | confirmed | auto-fixed |
| Canvas lifecycle | 3 | 1 | 1 | 5 | confirmed | auto-fixed |
| CTA conversion conflict | 3 | 1 | 1 | 5 | likely | auto-fixed |
| Theme palette specificity | 2 | 1 | 1 | 4 | confirmed | auto-fixed |
| Reference controls leakage | 2 | 1 | 0 | 3 | likely | auto-fixed |
| Source/license risk | 2 | 1 | 0 | 3 | likely | auto-fixed |
| WebGL scope creep | 3 | 1 | 1 | 5 | likely | auto-fixed |
| Mobile visual/performance risk | 2 | 1 | 1 | 4 | likely | auto-fixed |

## 5. Review Decision

**PASS with noted follow-up**.

PRD는 Standard lane과 Scenario C에 맞게 작성됐다. 구현으로 바로 넘어가지 않고, first viewport hierarchy와 mobile layout을 잠글 수 있도록 `/plan-wireframe`을 다음 단계로 확정하는 것이 맞다.

남은 follow-up은 formal visual mapping이다. PRD에는 reference include/exclude와 current gap이 반영되어 있지만, wireframe에서는 `hero-01`의 full-bleed field, heading hierarchy, CTA 위치, `DashboardPreview` 위치를 화면 단위로 구체화해야 한다.

## 6. Next Steps

1. `/plan-wireframe .plans/drafts/hero-01-reference-hero-refresh/`를 실행한다.
2. Wireframe에서 desktop/mobile Hero layout과 reference 요소 mapping을 확정한다.
3. 이후 `/plan-bridge`에서 Standard dev handoff context를 생성한다.
