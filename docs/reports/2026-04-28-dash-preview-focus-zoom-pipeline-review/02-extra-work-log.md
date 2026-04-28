# Extra Work Log

> **Purpose**: pipeline 기본 단계 밖에서 추가로 수행한 작업을 정리한다.

---

## 1. Why Extra Work Happened

Pipeline은 기능을 만드는 표준 길이다. 하지만 실제 작업에서는 표준 길만으로 충분하지 않을 때가 있다.

비유하면, 기차는 정해진 역을 지나가면 되지만, 중간에 선로가 겹치거나 다른 열차가 들어오면 선로 정비와 신호 조정이 필요하다. 이번 작업의 추가 작업들은 그런 **선로 정비**에 가까웠다.

## 2. Extra Work Summary

| 추가 작업 | 왜 필요했나 | 결과 |
|---|---|---|
| Prompt 정리 | 사용자의 시각 피드백이 길고 세부적이라 실행 가능한 요구사항으로 정리해야 했다. | 애니메이션 속도, focus 방식, card별 sequence가 명확해졌다. |
| Worktree 분리 | 원본 `apps/landing`에서 여러 세션이 동시에 landing page를 작업 중이었다. | `codex/dash-preview-focus-zoom-animation` branch와 별도 worktree로 분리했다. |
| Dev summary 추가 | 구현 결과를 archive 전에 한 번 정리할 필요가 있었다. | `dev-output-summary.md`가 만들어졌다. |
| Verification correction | `4/5` height를 agent가 `5/6`로 잘못 보정했다. | 사용자 확인 후 `4/5`로 복원했다. |
| Archive packaging | 완료된 기능을 active 상태로 남겨두면 후속 추적이 흐려진다. | `ARCHIVE-FZ.md`와 `sources/`가 생성됐다. |
| Original merge | 별도 worktree 작업을 원본 `main`에 합쳐야 했다. | merge commit `a90320e`가 생성됐다. |
| Conflict resolution | 원본 `main`에도 HR01/F3 문서 변경이 있었다. | `.plans` 인덱스 3개에서 양쪽 row를 모두 보존했다. |
| Push | 원본 `main` 변경을 remote에 반영해야 했다. | `origin/main`에 push 완료했다. |
| Preview server | 통합 결과를 브라우저에서 확인해야 했다. | 원본 `main` 기준 `http://localhost:3104/?dashV3=1`를 띄웠다. |
| Worktree removal | 분리 작업이 끝난 후 중복 작업공간을 치워야 했다. | 별도 worktree와 `3102` dev server를 제거했다. |

## 3. Worktree Separation

### What happened

처음에는 원본 `apps/landing`에서 여러 작업이 섞여 있었다. 그래서 `dash-preview-focus-zoom-animation`만 별도 worktree로 분리했다.

### Beginner explanation

작업대가 하나뿐이면 두 사람이 동시에 가구를 조립할 때 부품이 섞인다. Worktree는 같은 창고에서 나온 부품을 **별도 작업대**에 펼쳐두는 방식이다.

### What to keep

- 별도 branch 이름을 기능 slug와 맞춘다.
- 원본 작업대에는 다른 세션 작업을 남겨둔다.
- dev server port를 다르게 쓴다.

## 4. Verification Correction

### What happened

`dash-preview` height를 줄이는 과정에서 `4/5`와 `5/6` 기준이 충돌했다. 처음에는 `5/6`로 보정됐지만, 사용자가 `4/5`가 의도값이라고 확인했다. 이후 code, tests, docs가 `4/5` 기준으로 복원됐다.

### Beginner explanation

요리 레시피에서 "물을 4/5컵 넣기"라고 했는데 조리자가 "조금 줄이는 거면 5/6컵이겠지"라고 추측한 상황과 비슷하다. 최종 기준은 레시피 작성자의 의도다.

### Lesson

숫자, 비율, 색상, timing처럼 시각 품질에 직접 닿는 값은 검증보다 먼저 사용자 의도를 확인해야 한다.

## 5. Archive Packaging

### What happened

완료된 idea, screening, draft, feature package, dev notes가 archive로 이동했다.

### Beginner explanation

완성된 제품을 계속 조립대 위에 두면 다음 제품을 만들 때 방해된다. Archive는 완성품과 설명서를 박스에 넣어 창고 위치표에 등록하는 일이다.

### What was useful

- `ARCHIVE-FZ.md` 하나로 전체 완료 상태를 볼 수 있다.
- `sources/`에 원본 문서가 보존됐다.
- backlog와 screening matrix가 `archived` 상태로 바뀌었다.

## 6. Merge Into Original Main

### What happened

별도 worktree의 작업 branch를 원본 `main`에 merge했다. 이때 아래 파일들이 충돌했다.

| 충돌 파일 | 해결 방식 |
|---|---|
| `.plans/archive/index.md` | `HR01`과 `FZ` row를 모두 보존했다. |
| `.plans/ideas/backlog.md` | `IDEA-20260427-002`, `003`, `004`를 모두 보존했다. |
| `.plans/ideas/screening-matrix.md` | `F3`, `FZ`, `HR01` row를 모두 보존했다. |

### Beginner explanation

두 사람이 같은 게시판에 서로 다른 공지사항을 붙인 상황이다. 한쪽 공지를 떼어내는 것이 아니라, 둘 다 읽을 수 있게 순서를 정리해서 붙여야 한다.

## 7. Preview Port Handling

### What happened

기존에 `3102`, `3103`이 이미 사용 중이어서 원본 `main` preview는 `3104`로 띄웠다.

### Beginner explanation

port는 건물의 방 번호와 같다. 이미 누가 `3102`번 방을 쓰고 있으면 새 회의는 `3104`번 방을 잡아야 한다.

### Lesson

frontend 작업이 여러 worktree에서 동시에 돌면 port registry가 필요하다.

## 8. Extra Work Verdict

추가 작업은 모두 기능 자체를 바꾸기 위한 작업이라기보다, 기능을 안전하게 만들고 정리하기 위한 운영 작업이었다.

다음 pipeline에는 이 운영 작업들을 checklist로 넣으면 좋다. 그러면 매번 즉흥적으로 선로를 고치는 대신, 출발 전에 점검표를 보고 움직일 수 있다.
