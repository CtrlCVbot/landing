# Pipeline Gap And Improvement

> **Purpose**: 이번 작업에서 드러난 Claude Kit pipeline 보강점을 정리한다.

---

## 1. Improvement Summary

| 우선순위 | 개선점 | 한 줄 요약 |
|---|---|---|
| High | Worktree split checklist | 여러 세션이 같은 app을 만질 때 분리 기준을 문서화한다. |
| High | Dev summary template | `/plan-archive` 전에 구현 결과 요약을 표준화한다. |
| High | Merge conflict checklist | `.plans` 인덱스 충돌 해결 기준을 만든다. |
| Medium | Preview port registry | worktree별 dev server port를 기록한다. |
| Medium | Warning ledger | 기존 warning과 신규 warning을 분리해 기록한다. |
| Medium | User decision override log | 사용자가 확정한 수치와 디자인 결정을 별도 로그로 남긴다. |
| Low | Archive post-merge guide | archive 이후 원본 merge/push/worktree cleanup 절차를 안내한다. |

## 2. Worktree Split Checklist

| 항목 | 내용 |
|---|---|
| 문제 | 여러 세션이 `apps/landing`을 동시에 수정하면서 변경이 섞일 위험이 있었다. |
| 왜 중요한지 | 같은 파일이나 `.plans` 인덱스를 동시에 수정하면 merge conflict가 늘어난다. |
| 개선 제안 | `/dev-run` 전후로 "같은 app에서 다른 세션이 진행 중인가?"를 확인하는 checklist를 추가한다. |
| 기대 효과 | worktree 분리 시점이 빨라지고, 나중에 원본에 합칠 때 범위가 명확해진다. |

추천 checklist:

- 같은 repo에서 다른 세션이 active 상태인지 확인한다.
- 새 branch 이름은 feature slug와 맞춘다.
- 새 worktree path는 app folder 밖 sibling으로 둔다.
- dev server port를 원본과 다르게 잡는다.
- 원본 worktree의 dirty file을 건드리지 않는다.

## 3. Dev Summary Template

| 항목 | 내용 |
|---|---|
| 문제 | 구현 완료 후 archive 전에 무엇이 바뀌었는지 한 번 더 요약할 필요가 있었다. |
| 왜 중요한지 | archive bundle만 보면 구현 코드와 검증 결과 사이의 연결이 늦게 보인다. |
| 개선 제안 | `03-dev-notes/dev-output-summary.md` template을 pipeline에 포함한다. |
| 기대 효과 | `/plan-archive`가 더 빠르고 정확해진다. |

Template에 포함할 항목:

- feature name
- branch
- implementation commits
- runtime changed areas
- test and verification summary
- traceability
- archive handoff source set

## 4. Merge Conflict Checklist

| 항목 | 내용 |
|---|---|
| 문제 | 원본 `main`에도 `HR01`, `F3` 관련 `.plans` 변경이 있어 merge conflict가 발생했다. |
| 왜 중요한지 | 인덱스 파일은 한쪽만 선택하면 다른 기능의 기록이 사라질 수 있다. |
| 개선 제안 | `.plans/archive/index.md`, `backlog.md`, `screening-matrix.md` 충돌 해결 규칙을 문서화한다. |
| 기대 효과 | archive row, idea row, screening row를 누락하지 않는다. |

기본 규칙:

- 날짜별 마지막 채번은 더 큰 값을 유지한다.
- archive index는 양쪽 row를 모두 살린다.
- backlog는 IDEA ID 순서 또는 등록일 순서를 유지한다.
- screening matrix는 active/screened/archived 상태를 그대로 보존한다.
- conflict marker 제거 후 `Select-String`으로 Git conflict marker 문자열이 남았는지 검색한다.

## 5. Preview Port Registry

| 항목 | 내용 |
|---|---|
| 문제 | `3102`, `3103`, `3104`가 동시에 쓰였다. |
| 왜 중요한지 | 사용자가 보는 browser tab과 실제 worktree가 다르면 잘못된 화면을 검토할 수 있다. |
| 개선 제안 | worktree별 preview port를 기록하는 작은 표를 report 또는 session note에 남긴다. |
| 기대 효과 | 원본 preview와 실험 worktree preview가 헷갈리지 않는다. |

예시:

| Worktree | Branch | Port | Status |
|---|---|---:|---|
| `apps/landing` | `main` | 3104 | active preview |
| `apps/landing-dash-preview-focus-zoom-animation` | `codex/dash-preview-focus-zoom-animation` | 3102 | removed |

## 6. Warning Ledger

| 항목 | 내용 |
|---|---|
| 문제 | build와 test는 통과했지만 기존 warning이 반복됐다. |
| 왜 중요한지 | 새 warning인지 기존 warning인지 구분하지 않으면 실제 regression을 놓칠 수 있다. |
| 개선 제안 | `/dev-verify` 산출물에 `known warnings`와 `new warnings`를 분리하는 표를 추가한다. |
| 기대 효과 | warning이 있어도 "무시"가 아니라 "분류된 잔여 리스크"로 관리된다. |

이번 작업에서 기록된 warning:

- React `act(...)` warning in dashboard a11y tests
- `_groupId`, `_rest` unused variable warning
- `use-focus-walk.ts` hook dependency warning
- Next.js multi-lockfile root warning

## 7. User Decision Override Log

| 항목 | 내용 |
|---|---|
| 문제 | `4/5` height 값을 agent가 `5/6`로 잘못 보정했다. |
| 왜 중요한지 | 디자인 수치와 timing은 "정답"보다 "의도"가 더 중요할 수 있다. |
| 개선 제안 | 사용자가 확정한 값은 `Decision Update` 또는 `User Override` 표에 남긴다. |
| 기대 효과 | 후속 검증에서 같은 값을 다시 잘못 고치지 않는다. |

예시:

| 결정 | 확정값 | 근거 |
|---|---|---|
| Preview height ratio | `4 / 5` | 사용자 확인 |
| Mobile behavior | `MobileCardView` 유지 | `US-FZ-004` |

## 8. Archive Post-Merge Guide

| 항목 | 내용 |
|---|---|
| 문제 | archive는 끝났지만, 원본 `main` merge, push, worktree cleanup은 별도 운영 작업이었다. |
| 왜 중요한지 | archive가 됐다고 원본 repo에 통합됐다는 뜻은 아니다. |
| 개선 제안 | `/plan-archive` 이후 `merge-to-main checklist`를 안내한다. |
| 기대 효과 | archive 완료와 배포 준비 상태를 구분할 수 있다. |

추천 순서:

1. 원본 worktree clean 확인
2. 보호 branch 생성
3. feature branch merge
4. `.plans` conflict 수동 병합
5. typecheck/test/build
6. merge commit
7. push
8. worktree cleanup

## 9. Overall Recommendation

가장 먼저 해야 할 개선은 세 가지다.

1. Worktree split checklist
2. Dev summary template
3. Merge conflict checklist

이 세 가지는 기능 구현 품질보다 **작업이 섞이지 않게 하는 안전장치**에 가깝다. 초보자에게는 안전벨트와 같다. 차를 잘 운전하는 것도 중요하지만, 안전벨트를 먼저 매면 실수했을 때 피해가 줄어든다.
