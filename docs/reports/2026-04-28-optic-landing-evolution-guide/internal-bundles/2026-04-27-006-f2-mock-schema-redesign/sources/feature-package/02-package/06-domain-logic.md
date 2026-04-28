# 06. Domain Logic - F2 Mock 스키마 재설계

> F2의 domain logic은 실제 사업 도메인 계산이 아니라 preview 상태 모델이다. 핵심은 "AI 추출 frame"과 "폼 적용 frame"의 source를 분리하는 것이다.

---

## 1. 권장 모델

```ts
type PreviewMockScenario = {
  id:
    | 'default'
    | 'regional-cold-chain'
    | 'short-industrial-hop'
    | 'partial'
    | 'mismatch-risk'
  label: string
  randomizable: boolean
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
| `jsonViewerOpen` | `extractedFrame.aiResult.jsonViewerOpen=false` | schema compatibility |
| random pool | `scenario.randomizable === true` | preview loop |

---

## 3. Helper Rule

| helper | 역할 | 요구사항 |
|---|---|---|
| `getDefaultPreviewMockScenario` | 기본 scenario 반환 | REQ-004 |
| `selectPreviewMockScenario` | 테스트/QA용 scenario 선택 | REQ-001, REQ-010 |
| `getRandomizablePreviewMockScenarios` | demo-safe random pool 반환 | REQ-011, REQ-012 |
| `selectRandomPreviewMockScenario` | loop 시작 시 random scenario 선택, `excludeId` 지원 | REQ-004, NFR-f2-001 |
| `createPreviewMockData` | 기존 `PreviewMockData` consumer용 compatibility object 생성 | NFR-f2-002 |
| `formRevealTimeline` | Step 4 내부 표시 타이밍 전달 | REQ-006, REQ-007, REQ-011 |

구현 결과 위 helper 명칭으로 확정됐다. `PREVIEW_MOCK_DATA` compatibility export는 default scenario 기반으로 유지한다.

## 3-1. Randomization Rule

| scenario | randomizable | 용도 |
|---|:---:|---|
| `default` | true | 서울 강남 → 부산 강서, 5톤 카고, 850,000원 |
| `regional-cold-chain` | true | 인천 남동 → 광주 첨단, 1톤 냉장, 420,000원 |
| `short-industrial-hop` | true | 수원 권선 → 평택 고덕, 2.5톤 윙바디, 360,000원 |
| `partial` | false | 부분 추출 fixture |
| `mismatch-risk` | false | fare/estimate mismatch 회귀 fixture |

`DashboardPreview`는 preview loop가 마지막 Step에서 Step 1로 돌아올 때 `selectRandomPreviewMockScenario({ excludeId })`를 호출한다. 공개 selector UI는 만들지 않는다.

## 3-2. Form Reveal Rule

| Trigger | Time | 의미 |
|---|---:|---|
| `pickupAt` | 0ms | 상차지와 상차일시 적용 |
| `deliveryAt` | 650ms | 하차지와 하차일시 적용 |
| `estimateAt` | 900ms | 예상 거리/시간/운임 표시 |
| `cargoAt` | 1300ms | 화물/차량 정보 표시 |
| `optionsAt` | 1300ms | 운송 옵션 checked 표시 |
| `fareAt` | 1950ms | 운임 category beat |
| `settlementAt` | 2200ms | 정산 정보 표시 |

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
4. randomizable scenario pool과 loop-start rotation을 추가한다.
5. order form과 AI panel consumer를 각각 source에 맞게 이전한다.
6. 추출 전 전체 대상 값 hidden/placeholder 상태를 추가한다.
7. `AI_APPLY` 내부 staged reveal timeline을 추가한다.
8. `jsonViewerOpen` 처리 결정을 decision log에 남긴다.
