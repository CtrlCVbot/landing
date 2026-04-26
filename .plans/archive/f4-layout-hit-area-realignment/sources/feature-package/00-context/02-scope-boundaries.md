# 02. Scope Boundaries — F4 레이아웃 정비 + Hit-Area 재정렬

> 본 Feature의 In-scope / Out-of-scope 경계. 이 경계를 넘는 편집은 `/dev-feature`에서 재승인이 필요하다.

---

## 1. In-scope

### 1-A. DateTime layout

| 영역 | 허용 변경 |
|---|---|
| `order-form/index.tsx` | pickup/delivery `DateTimeCard`를 감싸는 responsive grid 구조 조정 |
| `datetime-card.tsx` | 2열 배치에서 label/value가 안정적으로 보이도록 presentation 단위 보정 |

### 1-B. Hit-area 재측정

| 영역 | 허용 변경 |
|---|---|
| `src/components/dashboard-preview/hit-areas.ts` | 18개 bounds 재측정, tablet bounds 공유/분리 결정 |
| `src/components/dashboard-preview/__tests__/hit-areas.test.ts` | 새 bounds와 canonical count 반영 |

### 1-C. Overlay anchor

| 영역 | 허용 변경 |
|---|---|
| `src/components/dashboard-preview/interactive-overlay.tsx` | `ScaledContent` 내부 기준 anchor 적용/보류 결정에 따른 최소 조정 |
| `src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx` | anchor 기준 변경 시 회귀 테스트 갱신 |

### 1-D. Evidence

| 영역 | 허용 변경 |
|---|---|
| `.plans/features/active/f4-layout-hit-area-realignment/03-dev-notes/` | bounds evidence, screenshot note, coordinate matrix 추가 |

## 2. Out-of-scope

- `src/lib/mock-data.ts` schema 변경.
- F2의 `extractedFrame`, `appliedFrame`, `PREVIEW_MOCK_SCENARIOS` 도입.
- F3의 `OPTION_FEE_MAP` 또는 추가요금 계산.
- F1 theme token 재스윕.
- 신규 tutorial UI, 설명 패널, 별도 interaction mode 추가.

## 3. Allowed Target Paths

| 구분 | 경로 |
|---|---|
| Primary UI | `src/components/dashboard-preview/ai-register-main/order-form/index.tsx` |
| Primary UI | `src/components/dashboard-preview/ai-register-main/order-form/datetime-card.tsx` |
| Overlay | `src/components/dashboard-preview/hit-areas.ts` |
| Overlay | `src/components/dashboard-preview/interactive-overlay.tsx` |
| Tests | `src/components/dashboard-preview/__tests__/hit-areas.test.ts` |
| Tests | `src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx` |
| Tests | `src/components/dashboard-preview/ai-register-main/order-form/__tests__/datetime-card.test.tsx` |
| Tests | `src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx` |
| Legacy tests | `src/__tests__/dashboard-preview/legacy/interactive-overlay.test.tsx` |
| Evidence | `.plans/features/active/f4-layout-hit-area-realignment/03-dev-notes/**` |

## 4. Explicitly Disallowed Paths

| 경로 | 이유 |
|---|---|
| `src/lib/mock-data.ts` | F2 schema 변경 범위 |
| `src/lib/preview-steps.ts` | F2 Step visibility 범위 |
| `src/components/dashboard-preview/ai-register-main/ai-panel/**` | F2/F5 계열 데이터/AI panel 범위 |
| `src/app/globals.css` | F1 theme 범위 |

## 5. 병렬 작업 충돌 규칙

F2와 같은 파일을 수정해야 한다면 먼저 `/dev-feature` 단계에서 binding을 갱신한다. 특히 `order-form/index.tsx`는 F2도 visibility 연결에 사용할 수 있으므로, F4는 layout wrapper와 bounds 영향에 국한한다.
