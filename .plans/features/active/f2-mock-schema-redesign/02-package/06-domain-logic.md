# 06. Domain Logic - F2 Mock 스키마 재설계

> F2의 domain logic은 실제 사업 도메인 계산이 아니라 preview 상태 모델이다. 핵심은 "AI 추출 frame"과 "폼 적용 frame"의 source를 분리하는 것이다.

---

## 1. 권장 모델

```ts
type PreviewMockScenario = {
  id: 'default' | 'partial' | 'mismatch-risk' | string
  label: string
  extractedFrame: PreviewExtractedFrame
  appliedFrame: PreviewAppliedFrame
}
```

정확한 타입 이름은 기존 `mock-data.ts` 타입과 충돌하지 않게 구현 시 확정한다. 새 타입은 exported test fixture가 아니라 production preview data 계약으로 다룬다.

---

## 2. Source Rule

| 값 종류 | Source | Consumer |
|---|---|---|
| AI category, AI result | `extractedFrame` | AI panel |
| order form field | `appliedFrame` | order form |
| estimate amount | `appliedFrame.estimate` 또는 동등 필드 | estimate card |
| settlement amount | `appliedFrame.settlement` 또는 동등 필드 | settlement section |
| `jsonViewerOpen` | 구현 결정 필요 | decision log에 기록 |

---

## 3. Helper Rule

| helper | 역할 | 요구사항 |
|---|---|---|
| `getDefaultPreviewScenario` 또는 동등 함수 | 기본 scenario 반환 | REQ-004 |
| `getPreviewScenarioById` 또는 동등 함수 | 테스트/QA용 scenario 선택 | REQ-001, REQ-010 |
| `getPreviewStepVisibility` 또는 동등 함수 | Step에서 표시 상태 파생 | REQ-006, REQ-007 |
| compatibility helper | 기존 consumer가 깨지지 않도록 이전 지원 | NFR-f2-002 |

함수명은 구현 중 기존 naming과 충돌하면 바꿀 수 있다. 단, 역할과 테스트 책임은 유지한다.

---

## 4. Consistency Rule

default scenario에서는 다음 중 하나를 만족해야 한다.

1. AI category의 `fare`와 `appliedFrame.estimate.amount`가 같은 숫자다.
2. 둘이 다른 단위라면 변환 규칙이 코드와 테스트에 명시되어 같은 의미임이 확인된다.

F3의 `OPTION_FEE_MAP`은 본 Feature에서 만들지 않는다. F3는 이 consistency rule 위에 추가 요금 파생을 얹는다.

---

## 5. Migration Rule

1. 기존 `PREVIEW_MOCK_DATA` consumer를 먼저 조사한다.
2. adapter/helper를 추가해 기존 tests를 크게 깨뜨리지 않는다.
3. scenario array와 frame split을 추가한다.
4. order form과 AI panel consumer를 각각 source에 맞게 이전한다.
5. `jsonViewerOpen` 처리 결정을 decision log에 남긴다.
