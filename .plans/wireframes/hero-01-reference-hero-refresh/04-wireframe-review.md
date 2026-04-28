# Wireframe Review: hero-01 레퍼런스 기반 Hero 섹션 재개선

> **Screens**: [screens.md](./screens.md)
> **Navigation**: [navigation.md](./navigation.md)
> **Components**: [components.md](./components.md)
> **PRD**: [../../drafts/hero-01-reference-hero-refresh/02-prd.md](../../drafts/hero-01-reference-hero-refresh/02-prd.md)
> **작성일**: 2026-04-28
> **상태**: PASS, follow-up resolved

---

## 1. Review Summary

| 항목 | 판정 | 근거 |
|---|---|---|
| 주요 화면 포함 | PASS | Desktop, Tablet, Mobile, Reduced motion 4개 screen 정의 |
| Layout 명확성 | PASS | 각 viewport의 HeroFieldLayer, headline, CTA, DashboardPreview 위치 정의 |
| Navigation flow | PASS | page load, theme, motion, CTA, pointer state flow 정의 |
| Component spec | PASS | 8개 component/policy/guard 정의 |
| PRD mapping | PASS | REQ 16건이 screens/components에 mapping됨 |
| Accessibility | PASS | `aria-hidden`, focus order, reduced motion, no controls leakage 기준 포함 |

## 2. PCC 검증

| PCC | 판정 | 근거 |
|---|---|---|
| PCC-01 Idea ↔ Screen | PASS | IDEA-20260427-004와 SCREENING-20260427-004가 approved |
| PCC-02 Screen ↔ Feature | PASS | Draft와 PRD가 존재하고 wireframe slug가 일치 |
| PCC-03 Feature ↔ PRD | PASS | PRD의 reference fidelity, theme, motion, CTA, mobile 요구사항이 wireframe에 반영 |
| PCC-04 PRD ↔ Wireframe | PASS | PRD 주요 화면과 REQ 16건이 wireframe 산출물에 mapping됨 |
| PCC-06 Reference Gap ↔ Detail PRD | PASS, follow-up resolved | reference include/exclude, DOM leakage guard, browser QA, user approval까지 완료됨 |
| PCC-07~09 Epic 계층 | 해당 없음 | Epic binding 없음 |

## 3. Feedback Items

| 항목 | Severity | Score | Confidence | Action | 결과 |
|---|---|---:|---|---|---|
| DashboardPreview가 first viewport에서 headline/CTA와 경쟁할 수 있음 | high | 5 | likely | auto-fixed | Visual Priority에서 DashboardPreview를 4순위로 낮추고 lower third 규칙 명시 |
| Canvas lifecycle이 component spec에서 빠질 위험 | high | 5 | confirmed | auto-fixed | mount/resize/theme/visibility/unmount lifecycle table 추가 |
| mobile에서 pointer-reactive effect가 남을 위험 | medium | 4 | likely | auto-fixed | Mobile rules와 HeroMotionPolicy에서 pointer disabled 명시 |
| reference controls가 production DOM에 섞일 위험 | medium | 3 | likely | auto-fixed | Reference Mapping과 ExclusionGuard에 controls/custom cursor 제외 명시 |
| Wireframe이 visual target만 있고 navigation decision이 약할 위험 | medium | 3 | confirmed | auto-fixed | navigation.md에 theme/motion/CTA state flow 추가 |
| formal visual gap board 부재 | medium | 4 | confirmed | queued | bridge 또는 QA 단계에서 screenshot-based gap board 생성 권장 |

### Severity Score Detail

| 항목 | Impact | Reach | Recovery | Total | Confidence | Action |
|---|---:|---:|---:|---:|---|---|
| DashboardPreview hierarchy | 3 | 1 | 1 | 5 | likely | auto-fixed |
| Canvas lifecycle | 3 | 1 | 1 | 5 | confirmed | auto-fixed |
| Mobile pointer response | 2 | 1 | 1 | 4 | likely | auto-fixed |
| Reference controls leakage | 2 | 1 | 0 | 3 | likely | auto-fixed |
| Navigation flow weakness | 2 | 1 | 0 | 3 | confirmed | auto-fixed |
| Visual gap board missing | 2 | 1 | 1 | 4 | confirmed | queued |

## 4. Review Decision

**PASS, follow-up resolved**.

Wireframe은 PRD의 주요 요구사항을 충족한다. 다음 단계는 Standard lane에 맞춰 `/plan-bridge`로 dev handoff context를 만드는 것이다.

남은 follow-up이던 screenshot 기반 visual gap review는 browser QA와 사용자 visual approval로 처리되었다. `output/hero-01-parity-qa/browser-qa.json`은 `failureCount: 0`이며, dark/light/mobile/reduced-motion evidence가 존재한다.

## 5. Next Steps

1. `/plan-bridge .plans/drafts/hero-01-reference-hero-refresh/`를 실행한다.
2. Bridge에서 PRD + wireframe + reference mapping을 dev handoff context로 묶는다.
3. Dev 단계에서는 `output/hero-01-parity-qa/`에 screenshot evidence와 gap board를 남긴다.
