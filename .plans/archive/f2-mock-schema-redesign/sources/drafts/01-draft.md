# Draft — F2 Mock 스키마 재설계

> **IDEA**: [IDEA-20260424-001](../../ideas/20-approved/IDEA-20260424-001.md)
> **Screening**: [SCREENING-20260424-001](../../ideas/20-approved/SCREENING-20260424-001.md)
> **Lane**: Standard
> **Scenario**: B (기존 Phase 3 preview의 핵심 mock 구조 재설계)
> **Feature type**: dev
> **Hybrid**: false
> **Epic**: EPIC-20260422-001

---

## 1. 목표

AI가 추출한 정보와 실제 폼에 적용된 정보를 분리해 dash-preview의 내러티브를 더 정확하게 만든다. 사용자는 "AI가 무엇을 읽었고, 폼에는 무엇이 들어갔는지"를 Step 흐름에 맞춰 이해할 수 있어야 한다.

## 2. 범위

| 영역 | In-scope |
|---|---|
| Mock schema | `extractedFrame`, `appliedFrame`, `PREVIEW_MOCK_SCENARIOS` 도입 |
| Scenario selection | 기본 고정 scenario + selector helper 제공 |
| Order form visibility | `EstimateInfoCard`, `SettlementSection` 의 Step 기반 노출 제어 |
| Data consistency | AI category `fare` 와 `estimate.amount` 정합성 검증 |
| Tests | mock-data, preview-steps, order-form/ai-panel integration test 갱신 |

## 3. Out-of-scope

- 실제 AI API 연동
- F3의 `OPTION_FEE_MAP` 요금 파생 구현
- F4의 layout/hit-area 좌표 재측정
- 사용자가 직접 선택하는 scenario UI. 필요하면 F2 PRD에서 옵션으로 재평가한다.

## 4. 핵심 결정

| 항목 | 결정 |
|---|---|
| Scenario trigger | 1차 구현은 deterministic default scenario. selector helper만 노출 |
| Scenario count | 총 5개: default, regional-cold-chain, short-industrial-hop, partial, mismatch-risk |
| Random preview | demo-safe 3개만 loop 시작 시 random 선택, 직전 scenario 제외 |
| Data split | `extractedFrame` 은 AI panel/result 기준, `appliedFrame` 은 form state 기준 |
| `jsonViewerOpen` | F5에서 유지된 필드를 F2 schema 내부로 이관하거나 제거 여부 결정 |
| Visibility | Step state와 `formRevealTimeline`으로 추출 전 hidden, 적용 중 staged reveal |

## 5. Acceptance Criteria

- `PREVIEW_MOCK_SCENARIOS.length >= 3`
- default scenario의 `fare` 와 `estimate.amount` 가 일치한다.
- AI_APPLY 전에는 CompanyManager 외 추출 대상 완성값이 노출되지 않는다.
- AI_APPLY 단계에서는 appliedFrame 기준 값이 order form에 반영된다.
- AI_APPLY 내부에서는 상차지 → 하차지 → 예상 운임/거리 → 화물/차량+옵션 → 정산 순서로 적용된다.
- 기존 `pnpm test` 통과, 관련 mock-data/order-form 테스트 갱신.

## 6. 리스크

| 리스크 | 수준 | 대응 |
|---|:---:|---|
| 기존 테스트 대량 수정 | high | schema compatibility helper를 먼저 만들고 테스트를 단계적으로 이전 |
| F3와 `mock-data.ts` 충돌 | medium | F2를 먼저 merge하고 F3는 F2 schema 위에 `OPTION_FEE_MAP` 추가 |
| scenario UI 범위 확장 | medium | Draft에서는 helper까지만, UI는 PRD에서 별도 옵션으로 결정 |

## 7. 다음 단계

1. `/plan-prd .plans/drafts/f2-mock-schema-redesign/` 완료.
2. `/plan-bridge f2-mock-schema-redesign` 완료.
3. `/dev-feature`와 `/dev-run` 완료.
4. `/plan-archive f2-mock-schema-redesign`로 archive 완료.

## 8. 구현 후 정리

2026-04-27 사용자 추가 피드백을 반영해 원래 Draft보다 범위가 넓어졌다. 공개 scenario selector UI는 만들지 않았고, 대신 preview loop마다 demo-safe scenario를 random 선택한다. 또한 estimate/settlement만 숨기는 범위에서 CompanyManager 외 전체 추출 대상 값을 숨기는 방향으로 확정했다.
