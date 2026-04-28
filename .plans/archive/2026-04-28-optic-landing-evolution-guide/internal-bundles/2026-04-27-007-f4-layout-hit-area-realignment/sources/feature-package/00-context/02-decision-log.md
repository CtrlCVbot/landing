# 02. Decision Log — F4 레이아웃 정비 + Hit-Area 재정렬

> 본 Feature 구현 중 발생하는 결정을 누적 기록한다.
> Draft/PRD 단계에서 확정된 결정은 [`03-design-decisions.md`](./03-design-decisions.md)를 우선 참조한다.

---

## 1. 기 확정 결정 요약

| ID | 결정 | 상태 |
|---|---|---|
| D-F4-001 | DateTime layout은 `md` 이상 2열, mobile 1열 | accepted |
| D-F4-002 | 1차 hit-area 전략은 static bounds 재측정 | accepted |
| D-F4-003 | tablet 오차가 2px 초과하면 별도 bounds 분리 | accepted |
| D-F4-004 | overlay anchor는 `ScaledContent` 내부 기준 Proposal A 우선 평가 | accepted |
| D-F4-005 | `mock-data.ts` 변경 회피 | accepted |

## 2. Bridge 결정

### D-F4-006. Bridge 범위는 `00-context`까지로 제한

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-24 |
| 결정자 | 사용자 요청 + Codex |
| 내용 | `/plan-bridge` 단계에서는 active feature의 `00-context`만 생성하고, 공식 TASK 문서는 `/dev-feature`에서 생성한다. |
| 근거 | 사용자 요청은 다음 단계 1,2 Bridge 실행이며 구현/TASK 확정은 아직 요청되지 않음. |

### D-F4-007. Feature Package와 TASK 문서 생성

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-24 |
| 결정자 | 사용자 요청 + Codex |
| 내용 | `/dev-feature` Step 6 대응으로 `02-package` 공식 문서와 `03-dev-notes/hit-area-evidence.md` 템플릿을 생성한다. |
| 근거 | F4는 PRD Review Approve + Bridge 완료 상태이며, 다음 단계가 `/dev-feature`로 명시되어 있음. |
| 다음 단계 | `/dev-run .plans/features/active/f4-layout-hit-area-realignment/` |

## 3. 구현 중 신규 결정

### D-F4-008. F5 이후 hit-area target count는 18개로 유지

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-24 |
| 배경 | PRD/초기 로드맵은 Phase 3 원본 19개 hit-area를 기준으로 작성됐지만, F5에서 `ai-json-viewer` hit-area가 제거되어 현재 code/test SSOT는 18개다. |
| 선택값 | F4는 제거된 JSON viewer 영역을 되살리지 않고, 현재 18개 target 기준으로 DateTime/layout bounds만 재정렬한다. |
| 영향 범위 | `hit-areas.ts`, `hit-areas.test.ts`, `03-dev-notes/hit-area-evidence.md` |
| Rollback | JSON viewer UI/hit-area를 별도 Feature로 복원할 때 target count를 다시 조정한다. |

### D-F4-009. Overlay anchor는 `ScaledContent` 내부로 이동

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-24 |
| 배경 | 기존 overlay는 `PreviewChrome` 밖 sibling으로 렌더되어 chrome header 높이만큼 content 좌표계와 어긋날 수 있었다. |
| 선택값 | `InteractiveOverlay`를 `PreviewChrome` children 내부, 즉 `scaled-content-inner` 안에 렌더하고 `scaleFactor={1}`을 전달한다. 부모 transform이 content와 overlay를 함께 scale한다. |
| 영향 범위 | `dashboard-preview.tsx`, `dashboard-preview.test.tsx` |
| Rollback | overlay를 `PreviewChrome` 밖으로 되돌리고 header offset 보정 로직을 별도 추가한다. |

### D-F4-010. Hit-area 좌표는 DOM 실측값을 static bounds보다 우선한다

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-24 |
| 배경 | 사용자 스크린샷 기준 tooltip/ring이 실제 컴포넌트 위치에서 크게 어긋났다. `hit-areas.ts`의 static bounds는 scale, grid width, padding, font rendering 변화에 계속 취약하다. |
| 선택값 | 실제 target root에 `data-hit-area-id`를 부여하고, `InteractiveOverlay`가 `getBoundingClientRect()`로 target 위치를 측정해 overlay 좌표로 변환한다. 측정 target이 없을 때만 static bounds fallback을 사용한다. |
| 영향 범위 | `interactive-overlay.tsx`, `ai-panel/**`, `order-form/**`, overlay/order-form/ai-panel tests |
| Rollback | `data-hit-area-id` marker와 DOM 측정 hook을 제거하고 `hit-areas.ts` static bounds만 사용한다. 단, 현재 시각 오프셋 문제가 재발할 수 있다. |

### D-F4-011. 초기 측정 전에는 fallback hit-area를 렌더하지 않는다

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-27 |
| 배경 | 브라우저 spot check에서 overlay 생성 직후 1차 렌더 시점에는 static fallback 위치가 잠깐 노출될 수 있음을 확인했다. hover 이후에는 DOMRect 재측정으로 맞지만, 사용자가 빠르게 클릭하면 이전 오프셋을 다시 체감할 수 있다. |
| 선택값 | `measuredBounds` 초기값을 `null`로 두고, 첫 DOM 측정이 끝난 뒤에만 hit-area button과 tooltip을 렌더한다. target이 없는 경우의 static fallback은 측정 완료 이후에만 사용한다. |
| 영향 범위 | `interactive-overlay.tsx`, `interactive-overlay.test.tsx`, browser spot check evidence |
| Rollback | 첫 렌더부터 static fallback을 표시하도록 되돌릴 수 있으나, 초기 클릭 오프셋 문제가 재발할 수 있다. |

```md
### D-F4-NNN. {결정 제목}

| 항목 | 값 |
|---|---|
| 결정일 | YYYY-MM-DD |
| 배경 | {왜 결정이 필요했는가} |
| 선택값 | {확정값} |
| 영향 범위 | {파일/TASK 영향} |
| Rollback | {되돌리기 방법} |
```
