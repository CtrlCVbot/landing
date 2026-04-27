# F2 Migration Notes

> 구현 중 schema migration evidence를 누적한다.

---

## Consumer 조사

| consumer | 기존 source | 변경 source | 상태 |
|---|---|---|---|
| `mock-data.ts` exports | `PREVIEW_MOCK_DATA` single object | `PREVIEW_MOCK_SCENARIOS` + compatibility helpers | done |
| `preview-steps.ts` | direct `formState` read | `getStepVisibilityState(step)` helper | done |
| AI panel | compatibility `mockData.aiInput/aiResult` | compatibility object built from `extractedFrame` | done |
| order form | compatibility `mockData.formData` | compatibility object built from `appliedFrame` | done |

---

## 결정 기록 대기

| 결정 | 선택값 | 기록 위치 |
|---|---|---|
| compatibility helper API | `selectPreviewMockScenario`, `getDefaultPreviewMockScenario`, `createPreviewMockData` | `00-context/02-decision-log.md` |
| `jsonViewerOpen` 처리 | keep closed inside `extractedFrame.aiResult` | `00-context/02-decision-log.md` |
| mismatch-risk scenario 노출 | test fixture only, no public selector UI | `00-context/02-decision-log.md` |
