# Verification And Risk Checklist

> **Purpose**: 이 report package가 제대로 작성됐는지 확인하고, 후속 개선 시 주의할 리스크를 정리한다.

---

## 1. Document Package Verification

| Check | Status | Evidence |
|---|---|---|
| 날짜/제목 폴더 사용 | Done | `docs/report/2026-04-28-dash-preview-focus-zoom-pipeline-review/` |
| `00-index.md` 존재 | Done | 전체 목차와 읽기 순서 포함 |
| pipeline review 존재 | Done | `01-pipeline-progress-review.md` |
| extra work log 존재 | Done | `02-extra-work-log.md` |
| improvement report 존재 | Done | `03-pipeline-gap-and-improvement.md` |
| beginner explanation 존재 | Done | `04-beginner-friendly-explanation.md` |
| roadmap 존재 | Done | `05-next-action-roadmap.md` |
| verification checklist 존재 | Done | `06-verification-and-risk-checklist.md` |

## 2. Content Quality Checklist

| 항목 | 기준 | 확인 |
|---|---|---|
| 초보자 설명 | 처음 보는 사람도 pipeline 의미를 이해할 수 있어야 한다. | 공장, 조명, 작업대, 게시판, 방 번호 비유 사용 |
| docs-only 경계 | 코드 수정이나 기존 archive 수정이 없어야 한다. | 새 `docs/report/...` 파일만 추가 |
| 근거 기반 | archive와 dev verification 산출물을 근거로 해야 한다. | `ARCHIVE-FZ.md`, dev summary, verification report 참조 |
| 추가 작업 정리 | worktree, merge, push, preview, cleanup이 포함돼야 한다. | `02-extra-work-log.md` |
| 개선 제안 구조 | 문제, 중요성, 제안, 기대 효과가 보여야 한다. | `03-pipeline-gap-and-improvement.md` |
| 실행 가능성 | roadmap이 바로 실행 가능한 단위여야 한다. | High/Medium/Low priority 분리 |

## 3. Local Verification Commands

문서 작성 후 아래 명령으로 최소 검증을 수행한다.

```powershell
git status --short
git diff --check
```

선택 검증:

```powershell
Select-String -Path "docs/report/2026-04-28-dash-preview-focus-zoom-pipeline-review/*.md" -Pattern "<unfinished-keyword-pattern>"
Select-String -Path "docs/report/2026-04-28-dash-preview-focus-zoom-pipeline-review/*.md" -Pattern "<git-conflict-marker-pattern>"
```

## 4. Risks

| 리스크 | 수준 | 설명 | 대응 |
|---|---|---|---|
| Report가 pipeline source처럼 오해될 수 있음 | Medium | 이 문서는 회고 보고서이지 Claude Kit source of truth가 아니다. | `00-index.md`에 docs-only와 non-goal을 명시했다. |
| 개선 제안이 실제 template으로 반영되지 않음 | Medium | report만 만들면 다음 작업에서 다시 반복될 수 있다. | `05-next-action-roadmap.md`의 High priority부터 실행한다. |
| Warning이 계속 누적됨 | Medium | 기존 warning이 많아지면 신규 warning을 놓칠 수 있다. | Warning ledger template을 후속 작업으로 만든다. |
| Preview port 혼동 | Low | 여러 dev server가 동시에 켜질 수 있다. | Port registry를 후속 개선으로 둔다. |
| 사용자 확정값 누락 | Medium | `4/5` 같은 확정값이 후속 작업에서 다시 바뀔 수 있다. | User decision override log를 추가한다. |

## 5. Side-Effect Review

이번 report package는 문서 추가만 수행하므로 runtime side effect는 없다.

| 영역 | 영향 |
|---|---|
| Runtime code | 없음 |
| Tests | 없음 |
| Build output | 없음 |
| `.plans/archive/**` | 없음 |
| Git branch/worktree | 없음 |

## 6. Done Criteria

이 report package는 아래 조건을 만족하면 완료로 본다.

- 7개 문서가 모두 생성됐다.
- 모든 문서가 `docs/report/2026-04-28-dash-preview-focus-zoom-pipeline-review/` 안에 있다.
- 코드와 기존 pipeline archive 문서를 수정하지 않았다.
- `git diff --check`가 통과했다.
- conflict marker가 없다.
- final report에서 생성 문서와 남은 리스크를 명확히 알린다.

## 7. Next Verification For Follow-up Work

후속으로 pipeline template을 실제 반영할 때는 이 문서보다 더 강한 검증이 필요하다.

추천 검증:

1. 새 template 파일 경로 확인
2. 기존 Claude Kit pipeline 문서와 중복 여부 확인
3. 실제 다음 feature에서 checklist를 적용해보기
4. 적용 결과를 다시 report로 남기기
