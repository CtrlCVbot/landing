# 02. Scope Boundaries — F2 Mock 스키마 재설계

> 본 Feature의 In-scope / Out-of-scope 경계. 이 경계를 넘는 편집은 `/dev-feature`에서 재승인이 필요하다.

---

## 1. In-scope

### 1-A. Mock schema

| 영역 | 허용 변경 |
|---|---|
| `src/lib/mock-data.ts` | `extractedFrame`, `appliedFrame`, `PREVIEW_MOCK_SCENARIOS`, default selector helper |
| `src/__tests__/lib/mock-data.test.ts` | scenario count, source 분리, fee consistency 테스트 |

### 1-B. Step visibility

| 영역 | 허용 변경 |
|---|---|
| `src/lib/preview-steps.ts` | `estimateVisible`, `settlementVisible` 또는 동등한 Step 파생 상태 |
| `src/__tests__/lib/preview-steps.test.ts` | Step별 visibility 테스트 |

### 1-C. Order form 적용

| 영역 | 허용 변경 |
|---|---|
| `src/components/dashboard-preview/ai-register-main/order-form/index.tsx` | `appliedFrame` 기준 값 연결, Step visibility prop 연결 |
| `estimate-info-card.tsx` / `settlement-section.tsx` | visibility나 값 source 연결을 위한 최소 props 조정 |

### 1-D. AI panel 읽기 source

| 영역 | 허용 변경 |
|---|---|
| `src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx` | AI 표시값이 `extractedFrame` 기준으로 읽히도록 연결 |
| AI panel tests | extracted source 기준 회귀 테스트 |

## 2. Out-of-scope

- 실제 AI API 연동.
- F3 `OPTION_FEE_MAP` 구현.
- F4 `hit-areas.ts` 19 bounds 재측정 또는 `interactive-overlay.tsx` anchor 변경.
- 사용자-facing scenario selector UI 추가.
- backend schema, persistence, analytics 추가.

## 3. Allowed Target Paths

| 구분 | 경로 |
|---|---|
| Data | `src/lib/mock-data.ts` |
| Data | `src/lib/preview-steps.ts` |
| Presentation | `src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx` |
| Presentation | `src/components/dashboard-preview/ai-register-main/order-form/index.tsx` |
| Presentation | `src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx` |
| Presentation | `src/components/dashboard-preview/ai-register-main/order-form/settlement-section.tsx` |
| Tests | `src/__tests__/lib/mock-data.test.ts` |
| Tests | `src/__tests__/lib/preview-steps.test.ts` |
| Tests | `src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/index.test.tsx` |
| Tests | `src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/flow.test.tsx` |
| Tests | `src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx` |
| Tests | `src/components/dashboard-preview/ai-register-main/order-form/__tests__/settlement-section.test.tsx` |
| Plan evidence | `.plans/features/active/f2-mock-schema-redesign/03-dev-notes/**` |

## 4. Explicitly Disallowed Paths

| 경로 | 이유 |
|---|---|
| `src/components/dashboard-preview/hit-areas.ts` | F4 bounds 재측정 범위 |
| `src/components/dashboard-preview/interactive-overlay.tsx` | F4 overlay anchor 범위 |
| `src/app/globals.css` | F1 theme 범위 |
| 신규 backend/API 경로 | 본 Feature는 mock preview 내부 범위 |

## 5. 병렬 작업 충돌 규칙

F4와 `order-form/index.tsx`가 겹칠 수 있다. F2는 data source와 visibility 연결에 집중하고, F4는 layout wrapper에 집중한다. 같은 block을 동시에 수정해야 하면 F2/F4 dev-task 순서를 조정한다.
