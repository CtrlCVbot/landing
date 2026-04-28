# Beginner Friendly Explanation

> **Purpose**: Claude Kit pipeline을 처음 보는 사람도 이해할 수 있게 설명한다.

---

## 1. One Sentence

Claude Kit pipeline은 "아이디어를 실제 기능으로 만들고, 검사하고, 기록까지 남기는 작업 흐름"이다.

## 2. Factory Analogy

기능 개발을 공장에 비유해보자.

사용자가 "이런 기능이 있으면 좋겠다"고 말하면, 그것은 아직 제품이 아니라 원재료다. 공장은 이 원재료가 쓸 만한지 확인하고, 설계도를 만들고, 조립하고, 검사한 다음, 완성품과 설명서를 창고에 보관한다.

Claude Kit pipeline도 똑같다.

| 공장 단계 | Pipeline 단계 | 설명 |
|---|---|---|
| 원재료 접수 | Idea | 사용자의 요청을 기능 아이디어로 등록한다. |
| 품질 선별 | Screening | 지금 만들 가치가 있는지 판단한다. |
| 설계도 작성 | PRD | 무엇을 만들고, 무엇은 안 만들지 정한다. |
| 조립 설명서 작성 | Feature Package | 개발자가 바로 볼 수 있는 요구사항, UI, 테스트 문서를 묶는다. |
| 조립 | Dev | 실제 코드를 만든다. |
| 검사 | Verify | 만든 기능이 설계대로 작동하는지 확인한다. |
| 창고 보관 | Archive | 완성된 기록을 한 곳에 모아 나중에 찾기 쉽게 한다. |

## 3. What Happened In This Feature

이번 기능의 목표는 `dash-preview` 안에서 각 단계의 중요한 부분이 더 잘 보이게 만드는 것이었다.

처음 아이디어는 "화면 안에서 특정 파트가 zoom in/out되면 좋겠다"였다. 구현하면서 이 요구는 더 구체화됐다.

- 카톡 메시지 입력창을 focus한다.
- 추출 버튼을 focus한다.
- 추출된 정보 화면을 보여준다.
- 추출된 상차지 정보를 클릭하면 상차지 입력 카드가 focus된다.
- 하차지, 예상 운임/거리, 화물 정보, 정산 정보까지 순서대로 보여준다.
- 모바일은 기존 화면을 유지한다.

이 흐름은 무대 조명으로 이해하면 쉽다. 무대 전체를 움직이는 것이 아니라, 현재 중요한 배우에게만 조명을 비춘다. 최종 구현도 이 방향으로 갔다.

## 4. Why Documents Matter

초보자에게 문서는 가끔 "코드보다 덜 중요한 것"처럼 보일 수 있다. 하지만 pipeline에서는 문서가 지도 역할을 한다.

지도 없이 산을 오르면 정상에 갈 수도 있지만, 돌아오는 길을 잃기 쉽다. 문서가 있으면 다음 사람이 같은 길을 다시 찾을 수 있다.

이번 작업에서 문서가 맡은 역할:

| 문서 | 역할 |
|---|---|
| IDEA | 처음 요청이 무엇이었는지 보관한다. |
| PRD | 최종 요구사항을 고정한다. |
| Feature Package | 구현자가 어디를 고쳐야 하는지 알려준다. |
| Dev Notes | 구현 중 어떤 결정을 했는지 기록한다. |
| Verification Report | 검사 결과와 warning을 남긴다. |
| Archive | 완성된 전체 기록을 한 상자에 담는다. |

## 5. What Is A Worktree

Worktree는 같은 Git 저장소의 다른 작업공간이다.

비유하면 같은 창고에서 부품을 가져오지만, 조립대는 따로 쓰는 방식이다.

이번에는 원본 `apps/landing`에서 다른 landing page 작업도 진행 중이었다. 그래서 `dash-preview-focus-zoom-animation`만 별도 worktree로 분리했다. 이렇게 하면 서로 다른 작업의 부품이 섞이지 않는다.

## 6. What Is A Branch

Branch는 Git에서 작업 흐름을 나누는 이름표다.

비유하면 공장의 생산 라인 이름이다. `main`은 본 생산 라인이고, `codex/dash-preview-focus-zoom-animation`은 이번 기능만 만드는 임시 생산 라인이다.

작업이 끝나면 임시 생산 라인에서 만든 결과를 `main`에 합친다. 이것을 merge라고 한다.

## 7. What Is A Merge Conflict

Merge conflict는 두 작업이 같은 문서를 다르게 고쳐서 Git이 자동으로 고르지 못하는 상황이다.

비유하면 두 사람이 같은 게시판 같은 위치에 서로 다른 공지문을 붙인 상황이다. 한쪽만 남기면 다른 공지가 사라진다. 그래서 사람이 직접 보고 둘 다 필요한지 판단해야 한다.

이번에는 아래 문서에서 conflict가 났다.

- `.plans/archive/index.md`
- `.plans/ideas/backlog.md`
- `.plans/ideas/screening-matrix.md`

해결 기준은 간단했다. `HR01`, `F3`, `FZ` 기록을 모두 살렸다.

## 8. Why Archive Matters

Archive는 "끝난 일 보관함"이다.

완성된 기능을 계속 active folder에 두면 지금 진행 중인 일인지, 끝난 일인지 헷갈린다. Archive로 옮기면 "이 기능은 완료됐고, 이 파일들이 그 증거다"라고 말할 수 있다.

이번 archive 위치:

```text
.plans/archive/dash-preview-focus-zoom-animation/
```

대표 파일:

```text
.plans/archive/dash-preview-focus-zoom-animation/ARCHIVE-FZ.md
```

## 9. Most Important Lesson

Pipeline은 기능을 대신 만들어주는 마법이 아니다. 대신 실수하지 않게 단계와 기록을 잡아주는 안전장치다.

이번 작업에서 가장 중요한 교훈은 두 가지다.

1. 사용자의 의도값은 검증보다 우선해서 확인해야 한다.
2. 기능 구현과 Git 운영은 별개이므로, worktree, merge, push, preview port도 pipeline 주변 문서로 관리해야 한다.

쉽게 말하면, 좋은 제품을 만드는 것과 제품을 안전하게 배송하는 것은 둘 다 중요하다. Claude Kit pipeline은 제품 제작을 도와줬고, 이번 report는 배송 과정까지 더 잘 관리하기 위한 기록이다.
