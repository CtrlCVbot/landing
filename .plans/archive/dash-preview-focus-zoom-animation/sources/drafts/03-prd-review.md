# PRD Review: Dash Preview 단계별 포커스 줌 애니메이션

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
| Draft 일관성 | PASS | focus zoom, click-to-card flow, mobile preservation, reduced motion, interactive regression 범위가 draft와 일치 |
| 요구사항 ID 체계 | PASS | `REQ-dash-preview-focus-zoom-animation-###` 형식으로 16건 작성 |
| Scope control | PASS | mock data, API, Hero layout, overlay 전면 재작성 제외 |
| 검증 가능성 | PASS | unit, component, browser screenshot, diff review 기준 분리 |
| 남은 blocker | 없음 | PRD 작성 단계 blocker 없음 |

## 2. PRD Checklist

| 체크 항목 | 상태 | 메모 |
|---|---|---|
| 10개 PRD 섹션 존재 | 완료 | 1~10 섹션 충족, 11~13은 산출물/다음 단계/변경 이력 |
| User Story 형식 | 완료 | 6개 story 모두 As a / I want / so that 형식. `US-FZ-003`은 click-to-card 반복 흐름, `US-FZ-004`는 mobile 현행 유지로 구체화 |
| Functional Requirement ID | 완료 | REQ 16건 |
| 우선순위 명시 | 완료 | Must/Should 사용 |
| 수용 기준 측정 가능성 | 완료 | unit/component/screenshot/browser check로 분리 |
| Non-Goals 명시 | 완료 | 업무 시나리오, API, Hero layout, overlay rewrite 제외 |
| 기술 제약 연결 | 완료 | `PreviewChrome`, `useAutoPlay`, `PREVIEW_STEPS`, `InteractiveOverlay`, `MobileCardView` 반영 |
| Milestone 현실성 | 완료 | PRD review -> architecture binding -> dev-feature -> metadata -> viewport -> mobile preservation -> QA |
| Risk와 mitigation | 완료 | transform, overlay 좌표, timing, mobile, motion 리스크 포함 |
| Success Metrics 측정 가능성 | 완료 | SM 10건, 측정 방법 포함 |
| 이전 단계 범위와 일치 | 완료 | Lite, scenario B, dev, hybrid false 유지 |
| 접근성 고려 | 완료 | reduced motion, aria-live, keyboard flow 영향 분리 |

## 3. PCC 검증

| PCC | 판정 | 근거 |
|---|---|---|
| PCC-01 Idea ↔ Screen | PASS | IDEA와 SCREENING 모두 `20-approved` 상태 |
| PCC-02 Screen ↔ Feature | PASS | 승인 IDEA 기반 draft `01-draft.md` 존재 |
| PCC-03 Feature ↔ PRD | PASS | draft의 focus metadata, click-to-card flow, mobile preservation, reduced motion, overlay regression 범위가 PRD에 반영됨 |
| PCC-07~09 Epic 계층 | 해당 없음 | Epic binding 없음 |

## 4. Feedback Items

| 항목 | Severity | Score | Confidence | Action | 결과 |
|---|---|---:|---|---|---|
| full slug 기반 REQ-ID가 길어 가독성이 낮을 수 있음 | low | 2 | confirmed | queued | 표준 요구사항 ID 체계를 우선해 유지 |
| `PreviewChrome` 기존 scale과 새 focus transform 충돌 가능성 | medium | 4 | confirmed | auto-fixed | Technical/Risk에 transform composition 책임 분리 추가 |
| interactive overlay 좌표 회귀 가능성 | medium | 4 | confirmed | auto-fixed | REQ-012, Technical, Risk, Success Metric에 regression check 추가 |
| `AI_APPLY` sub-phase timing 누락 가능성 | medium | 4 | likely | auto-fixed | `partialBeat`, `allBeat`, `formRevealTimeline` 정렬 기준 추가 |
| Mobile에서 pan/zoom 강제 위험 | medium | 4 | likely | auto-fixed | Mobile은 현재 `MobileCardView` 유지로 고정 |
| reduced motion이 단순 언급에 그칠 위험 | medium | 4 | likely | auto-fixed | REQ-010, UX, Success Metric에 reduced motion 검증 추가 |
| US-FZ-003 적용 순서가 추상적임 | low | 2 | confirmed | auto-fixed | 상차지, 하차지, 화물 정보, 운임 4단계 흐름으로 PRD/Draft에 반영 |
| US-FZ-003 클릭 반복 흐름 누락 | medium | 3 | confirmed | auto-fixed | 추출정보 클릭 → 대응 입력 카드 이동 → 다음 추출정보 복귀/이동 반복으로 재정의 |
| US-FZ-004 mobile 범위가 열려 있음 | medium | 3 | confirmed | auto-fixed | Mobile은 현재 구현된 `MobileCardView` 유지로 고정 |
| Lite feature인데 `/plan-bridge`로 안내됨 | medium | 3 | confirmed | auto-fixed | `/plan-bridge`는 Standard 전용이므로 Lite direct-to-dev-feature 경로로 정정 |

### Severity Score Detail

| 항목 | Impact | Reach | Recovery | Total | Confidence | Action |
|---|---:|---:|---:|---:|---|---|
| REQ-ID readability | 1 | 1 | 0 | 2 | confirmed | queued |
| Transform composition | 2 | 1 | 1 | 4 | confirmed | auto-fixed |
| Overlay regression | 2 | 1 | 1 | 4 | confirmed | auto-fixed |
| Apply timing mismatch | 2 | 1 | 1 | 4 | likely | auto-fixed |
| Mobile pan/zoom risk | 2 | 1 | 1 | 4 | likely | auto-fixed |
| Reduced motion shallow spec | 2 | 1 | 1 | 4 | likely | auto-fixed |
| US-FZ-003 sequence clarity | 1 | 1 | 0 | 2 | confirmed | auto-fixed |
| US-FZ-003 click-to-card loop | 2 | 1 | 0 | 3 | confirmed | auto-fixed |
| US-FZ-004 mobile preservation | 2 | 1 | 0 | 3 | confirmed | auto-fixed |
| Lite routing mismatch | 2 | 1 | 0 | 3 | confirmed | auto-fixed |

## 5. Review Decision

**PASS with noted follow-up**.

PRD는 Lite feature 게이트상 `/plan-bridge`를 생략하고 `/dev-feature dash-preview-focus-zoom-animation`으로 넘기는 것이 맞다. 구현 전 dev-feature package에서는 transform composition, interactive overlay 기준, mobile 현행 유지, reduced motion QA를 TASK acceptance criteria에 그대로 남겨야 한다.

남은 follow-up은 REQ-ID 길이뿐이다. 표준 형식 준수를 위해 full slug 기반 ID를 유지했으며, dev package에서 필요하면 `REQ-FZ-###` alias를 병기할 수 있다.

사용자 피드백으로 `US-FZ-003`의 form fill 적용 순서를 상차지, 하차지, 화물 정보, 운임 4단계로 구체화했다. 이 변경은 기능 범위를 넓히지 않고, 이미 정의된 `AI_APPLY` focus 표현을 더 명확히 정리한 것이다.

추가 사용자 피드백으로 `US-FZ-003`은 자동 순차 표시가 아니라 추출정보 클릭 기반 반복 흐름으로 재정의했다. `US-FZ-004`는 mobile path를 새로 설계하지 않고 현재 구현된 `MobileCardView` 유지로 고정했다.

후속 게이트 확인에서 `category: Lite`와 `/plan-bridge` 안내가 충돌하는 것을 확인했다. `/plan-bridge`는 Standard feature 전용이므로 routing metadata와 다음 단계를 Lite direct-to-dev-feature 경로로 정정했다.

## 6. Next Steps

1. Lite feature 게이트에 따라 `/plan-bridge`를 생략한다.
2. `/dev-feature dash-preview-focus-zoom-animation`에서 allowed target paths를 `src/components/dashboard-preview/**`, `src/lib/preview-steps.ts`, `src/lib/motion.ts`, 관련 tests로 제한한다.
3. 구현 전 browser screenshot QA 계획을 feature package에 포함한다.
