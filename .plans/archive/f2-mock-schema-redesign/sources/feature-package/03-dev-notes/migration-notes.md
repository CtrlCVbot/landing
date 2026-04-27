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
| `DashboardPreview` | static `PREVIEW_MOCK_DATA` import | `selectRandomPreviewMockScenario` + `createPreviewMockData` | done |
| child form cards | mock value always rendered | `revealed`/`visible` prop 기반 placeholder/neutral state | done |
| number rolling | shared trigger | estimate/settlement trigger 분리 | done |

---

## 결정 기록 대기

| 결정 | 선택값 | 기록 위치 |
|---|---|---|
| compatibility helper API | `selectPreviewMockScenario`, `getDefaultPreviewMockScenario`, `createPreviewMockData` | `00-context/02-decision-log.md` |
| `jsonViewerOpen` 처리 | keep closed inside `extractedFrame.aiResult` | `00-context/02-decision-log.md` |
| mismatch-risk scenario 노출 | test fixture only, no public selector UI | `00-context/02-decision-log.md` |
| random scenario rotation | Step 4 → Step 1 전환 시 randomizable pool에서 교체, 직전 scenario 제외 | `00-context/02-decision-log.md` |
| pre-apply hidden scope | CompanyManager 외 추출 대상 전체 hidden/placeholder | `00-context/02-decision-log.md` |
| staged reveal timing | `pickupAt=0`, `deliveryAt=650`, `estimateAt=900`, `cargoAt/optionsAt=1300`, `settlementAt=2200` | `00-context/02-decision-log.md` |

---

## 구현 결과 요약

| 영역 | 결과 |
|---|---|
| Scenario | `default`, `regional-cold-chain`, `short-industrial-hop`, `partial`, `mismatch-risk` |
| Random pool | 3개 demo-safe scenario |
| Fixture-only | `partial`, `mismatch-risk` |
| Pre-apply display | CompanyManager 외 값 숨김 |
| Apply timing | 상차지 → 하차지 → 예상 운임/거리 → 화물/차량+옵션 → 정산 |
| Animation | Step duration 약 1.5배 느림, rolling trigger 분리 |

---

## 검증 기록

| 검증 | 결과 |
|---|---|
| `git diff --check` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm lint` | PASS with existing warnings |
| `pnpm test` | PASS, 45 files / 1039 tests |
| `pnpm build` | PASS, 단독 재실행 기준 |
| Manual preview | PASS, `output/verification/dash-preview-step4-staged-samples.json`와 screenshot 확인 |
