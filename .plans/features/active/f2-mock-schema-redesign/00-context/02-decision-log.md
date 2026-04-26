# 02. Decision Log — F2 Mock 스키마 재설계

> 본 Feature 구현 중 발생하는 결정을 누적 기록한다.
> Draft/PRD 단계에서 확정된 결정은 [`03-design-decisions.md`](./03-design-decisions.md)를 우선 참조한다.

---

## 1. 기 확정 결정 요약

| ID | 결정 | 상태 |
|---|---|---|
| D-F2-001 | `extractedFrame` / `appliedFrame` source 분리 | accepted |
| D-F2-002 | `PREVIEW_MOCK_SCENARIOS` 최소 3개 | accepted |
| D-F2-003 | deterministic default scenario selector | accepted |
| D-F2-004 | Step visibility 명시 | accepted |
| D-F2-005 | scenario selector UI는 MVP 제외 | accepted |

## 2. Bridge 결정

### D-F2-006. Bridge 범위는 `00-context`까지로 제한

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-24 |
| 결정자 | 사용자 요청 + Codex |
| 내용 | `/plan-bridge` 단계에서는 active feature의 `00-context`만 생성하고, 공식 TASK 문서는 `/dev-feature`에서 생성한다. |
| 근거 | 사용자 요청은 다음 단계 1,2 Bridge 실행이며 구현/TASK 확정은 아직 요청되지 않음. |

### D-F2-007. Feature Package와 TASK 문서 생성

| 항목 | 값 |
|---|---|
| 결정일 | 2026-04-24 |
| 결정자 | 사용자 요청 + Codex |
| 내용 | `/dev-feature` Step 6 대응으로 `02-package` 공식 문서와 `03-dev-notes/migration-notes.md` 템플릿을 생성한다. |
| 근거 | F2는 PRD Review Approve + Bridge 완료 상태이며, 다음 단계가 `/dev-feature`로 명시되어 있음. |
| 다음 단계 | `/dev-run .plans/features/active/f2-mock-schema-redesign/` |

## 3. 구현 전 확정 필요 결정

| ID | 결정 필요 항목 | 기본안 |
|---|---|---|
| D-F2-TBD-001 | compatibility helper API | 기존 consumers가 한 번에 깨지지 않도록 adapter 우선 |
| D-F2-TBD-002 | `jsonViewerOpen` 처리 | 유지/이관/제거 중 하나를 구현 전 확정 |
| D-F2-TBD-003 | mismatch-risk scenario 노출 범위 | 테스트 fixture 중심, user-facing UI는 제외 |

## 4. 구현 중 신규 결정

아직 없음. 구현 중 다음 형식으로 append한다.

```md
### D-F2-NNN. {결정 제목}

| 항목 | 값 |
|---|---|
| 결정일 | YYYY-MM-DD |
| 배경 | {왜 결정이 필요했는가} |
| 선택값 | {확정값} |
| 영향 범위 | {파일/TASK 영향} |
| Rollback | {되돌리기 방법} |
```
