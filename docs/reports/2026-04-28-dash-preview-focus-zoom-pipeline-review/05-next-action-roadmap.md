# Next Action Roadmap

> **Purpose**: 이번 회고에서 나온 개선점을 실제 실행 가능한 순서로 정리한다.

---

## 1. Roadmap Overview

| Priority | Action | Output |
|---|---|---|
| High | Worktree 분리 checklist 작성 | `docs/report/...` 또는 Claude Kit guide 문서 |
| High | Dev summary template 표준화 | `03-dev-notes/dev-output-summary.md` template |
| High | Merge conflict checklist 작성 | `.plans` 인덱스 충돌 해결 가이드 |
| Medium | Preview port registry 추가 | worktree별 port 기록 표 |
| Medium | Warning ledger template 추가 | known/new warning 분리 표 |
| Medium | User decision override log 추가 | 사용자 확정값 기록 표 |
| Low | Archive post-merge guide 추가 | archive 이후 merge/push/cleanup 순서 |

## 2. High Priority

### 2-1. Worktree 분리 checklist

| 항목 | 내용 |
|---|---|
| 목표 | 여러 세션이 같은 app을 작업할 때 언제 worktree를 분리할지 정한다. |
| 이유 | 변경이 섞이면 merge와 archive가 어려워진다. |
| 산출물 | `worktree-split-checklist.md` |
| 완료 기준 | branch name, worktree path, source session, 제외 항목, preview port 기준이 포함된다. |

초보자 비유:

작업대가 하나뿐이면 부품이 섞인다. worktree checklist는 "새 작업대를 언제 꺼낼지" 알려주는 기준표다.

### 2-2. Dev summary template

| 항목 | 내용 |
|---|---|
| 목표 | dev 완료 후 archive 전에 구현 결과를 항상 같은 형식으로 요약한다. |
| 이유 | archive할 때 어떤 코드와 테스트가 연결됐는지 빨리 알 수 있다. |
| 산출물 | `dev-output-summary.template.md` |
| 완료 기준 | changed runtime areas, test summary, traceability, archive handoff가 포함된다. |

### 2-3. Merge conflict checklist

| 항목 | 내용 |
|---|---|
| 목표 | `.plans` 인덱스 충돌을 해결하는 표준 규칙을 만든다. |
| 이유 | 한쪽 변경만 선택하면 다른 기능의 기록이 사라질 수 있다. |
| 산출물 | `merge-conflict-checklist.md` |
| 완료 기준 | `archive/index.md`, `backlog.md`, `screening-matrix.md`별 해결 규칙이 있다. |

## 3. Medium Priority

### 3-1. Preview port registry

| 항목 | 내용 |
|---|---|
| 목표 | worktree별 dev server port를 기록한다. |
| 이유 | 사용자가 보는 browser tab이 어느 branch인지 헷갈리지 않게 한다. |
| 산출물 | session note 또는 report 내부 `preview-port-registry.md` |
| 완료 기준 | worktree path, branch, port, process id, status가 보인다. |

### 3-2. Warning ledger

| 항목 | 내용 |
|---|---|
| 목표 | 기존 warning과 신규 warning을 분리한다. |
| 이유 | build가 통과하더라도 warning이 계속 쌓이면 품질 판단이 어려워진다. |
| 산출물 | `warning-ledger.template.md` |
| 완료 기준 | warning, source, existing/new, severity, action이 기록된다. |

### 3-3. User decision override log

| 항목 | 내용 |
|---|---|
| 목표 | 사용자가 확정한 디자인 수치와 정책을 따로 남긴다. |
| 이유 | agent가 합리적으로 보정하다가 사용자의 의도와 어긋날 수 있다. |
| 산출물 | `decision-override-log.md` |
| 완료 기준 | decision, confirmed value, date, related file, impact가 포함된다. |

## 4. Low Priority

### 4-1. Archive post-merge guide

| 항목 | 내용 |
|---|---|
| 목표 | `/plan-archive` 이후 원본 `main`에 합치는 과정을 guide로 만든다. |
| 이유 | archive 완료와 원본 통합 완료는 다른 상태다. |
| 산출물 | `archive-post-merge-guide.md` |
| 완료 기준 | merge, conflict, verification, push, worktree cleanup 순서가 있다. |

## 5. Suggested Execution Order

1. `Worktree 분리 checklist`를 먼저 만든다.
2. `Dev summary template`을 만든다.
3. `Merge conflict checklist`를 만든다.
4. 다음 기능에서 1~3번을 실제로 적용해본다.
5. 적용 중 생긴 warning과 preview port 문제를 별도 template으로 분리한다.

## 6. Acceptance Criteria

| 개선 작업 | 완료 기준 |
|---|---|
| Worktree checklist | 새 feature 시작 전 분리 여부를 판단할 수 있다. |
| Dev summary template | archive 전에 구현/검증/추적성을 한 장으로 볼 수 있다. |
| Merge checklist | `.plans` 충돌에서 어떤 row를 보존해야 하는지 명확하다. |
| Port registry | browser preview URL과 branch가 연결된다. |
| Warning ledger | 기존 warning과 새 warning이 섞이지 않는다. |
| Decision override log | 사용자 확정값이 후속 agent에게 전달된다. |

## 7. Roadmap Verdict

다음 개선의 핵심은 "더 많은 문서"가 아니라 "반복되는 판단을 checklist로 줄이는 것"이다.

초보자에게 checklist는 자전거 보조 바퀴와 같다. 계속 의존하려고 만드는 것이 아니라, 익숙해질 때까지 같은 실수를 줄이기 위해 붙인다.
