# F2 Migration Notes

> 구현 중 schema migration evidence를 누적한다.

---

## Consumer 조사

| consumer | 기존 source | 변경 source | 상태 |
|---|---|---|---|
| `mock-data.ts` exports | TBD | `PREVIEW_MOCK_SCENARIOS` | pending |
| `preview-steps.ts` | TBD | visibility helper | pending |
| AI panel | TBD | `extractedFrame` | pending |
| order form | TBD | `appliedFrame` | pending |

---

## 결정 기록 대기

| 결정 | 선택값 | 기록 위치 |
|---|---|---|
| compatibility helper API | TBD | `00-context/02-decision-log.md` |
| `jsonViewerOpen` 처리 | TBD | `00-context/02-decision-log.md` |
| mismatch-risk scenario 노출 | TBD | `00-context/02-decision-log.md` |
