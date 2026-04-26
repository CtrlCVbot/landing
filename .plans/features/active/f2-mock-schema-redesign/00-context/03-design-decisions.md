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
| 필수 scenario | default, partial, mismatch-risk |
| 기본 selector | deterministic default helper |
| 이유 | 테스트 안정성과 demo 예측 가능성 우선 |

## 3. Step visibility

| 항목 | 결정 |
|---|---|
| 선택값 | Step에서 `estimateVisible`, `settlementVisible` 또는 동등한 상태 파생 |
| 목표 | `AI_EXTRACT` 전 estimate/settlement 완성값 미노출 |
| 검증 | `AI_APPLY` 전/후 렌더 차이 테스트 |

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
