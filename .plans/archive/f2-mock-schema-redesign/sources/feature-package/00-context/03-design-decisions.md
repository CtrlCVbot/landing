# 03. Design Decisions — F2 Mock 스키마 재설계

> Draft와 PRD에서 확정한 설계 결정을 구현 관점으로 재정리한다.

---

## 1. Source split

| 항목 | 결정 |
|---|---|
| 선택값 | `extractedFrame` / `appliedFrame` 분리 |
| 의미 | AI panel은 읽은 값, order form은 적용된 값을 사용 |
| 근거 | Step 내러티브와 fee source를 명확히 하기 위함 |
| 검증 | source별 component/integration test |

## 2. Scenario set

| 항목 | 결정 |
|---|---|
| 선택값 | `PREVIEW_MOCK_SCENARIOS.length >= 3` |
| 최종 scenario | default, regional-cold-chain, short-industrial-hop, partial, mismatch-risk |
| randomizable | default, regional-cold-chain, short-industrial-hop |
| fixture-only | partial, mismatch-risk |
| 기본 selector | deterministic helper + random helper 병행 |
| 이유 | 테스트 안정성과 demo 다양성 동시 확보 |

## 3. Step visibility

| 항목 | 결정 |
|---|---|
| 선택값 | Step에서 기본 visibility를 만들고 `AI_APPLY` 내부는 `formRevealTimeline`으로 세분화 |
| 목표 | `AI_APPLY` 전 전체 추출 대상 값 미노출 |
| 검증 | `INITIAL`/`AI_INPUT`/`AI_EXTRACT` hidden state와 `AI_APPLY` staged reveal 테스트 |

## 4. Fee consistency

| 항목 | 결정 |
|---|---|
| 선택값 | default scenario에서 `fare`와 `estimate.amount` 정합성 검증 |
| 이유 | AI category 표시값과 order form 금액 혼동 제거 |
| F3 연결 | F3 `OPTION_FEE_MAP`은 F2 schema 이후 추가 |

## 5. Scenario selector UI

| 항목 | 결정 |
|---|---|
| 선택값 | MVP 제외, helper까지만 Must |
| 이유 | preview 첫 화면 복잡도 증가 방지 |
| 확장 | 사용자 요청 시 별도 IDEA 또는 scope confirmation 필요 |

## 6. F4 충돌 회피

| 항목 | 결정 |
|---|---|
| 선택값 | `hit-areas.ts`, `interactive-overlay.tsx` 편집 금지 |
| 이유 | F4 layout/hit-area 범위와 병렬 가능성 유지 |

## 7. Staged Apply Timing

| 항목 | 결정 |
|---|---|
| 선택값 | 4-dot Step 구조 유지, `AI_APPLY` 내부 reveal만 세분화 |
| 순서 | 상차지 → 하차지 → 예상 운임/거리 → 화물/차량+운송 옵션 → 정산 정보 |
| 타이밍 | `0 / 650 / 900 / 1300 / 2200ms` 중심 |
| 이유 | 사용자가 파트별 적용을 눈으로 따라갈 수 있게 하기 위함 |

## 8. Animation Speed

| 항목 | 결정 |
|---|---|
| Step duration | `800 / 2200 / 1400 / 4200ms` |
| partial interval | `650ms` |
| all beat | `1200ms` |
| number rolling | `700ms` |
| option stroke | `350ms` |
