# Pipeline Progress Review

> **Purpose**: `dash-preview-focus-zoom-animation`이 Claude Kit pipeline을 어떻게 통과했는지 단계별로 정리한다.

---

## 1. Pipeline Metaphor

Claude Kit pipeline은 기능을 만드는 **공장 컨베이어 벨트**에 가깝다.

| Pipeline 단계 | 공장 비유 | 실제 의미 |
|---|---|---|
| Idea | 원재료 접수 | 사용자의 개선 아이디어를 기록한다. |
| Screening | 품질 선별 | 지금 만들 가치가 있는지 판단한다. |
| Draft / PRD | 설계도 작성 | 무엇을 만들지, 무엇을 만들지 않을지 정한다. |
| Review | 설계도 검수 | 빠진 요구사항이나 모순을 확인한다. |
| Feature Package | 조립 설명서 | 개발자가 바로 구현할 수 있게 파일, 요구사항, 테스트를 묶는다. |
| Dev | 조립 | 실제 코드와 테스트를 작성한다. |
| Verify | 검사 | 조립된 기능이 설계도대로 동작하는지 확인한다. |
| Archive | 창고 보관 | 완성된 기능의 모든 산출물을 한 곳에 보관한다. |

이번 작업은 이 흐름을 끝까지 통과했다.

## 2. Stage Timeline

| 단계 | 이번 작업에서 한 일 | 주요 산출물 |
|---|---|---|
| Idea | `dash-preview`에서 단계별 focus zoom animation을 만들자는 개선 아이디어를 등록했다. | `IDEA-20260427-003.md` |
| Screening | Lite lane으로 진행할 수 있다고 판단했다. | `SCREENING-20260427-003.md` |
| Draft | focus target, animation 방식, mobile 유지 방향을 초안으로 정리했다. | `01-draft.md` |
| PRD | `US-FZ-003`, `US-FZ-004` 같은 사용자 흐름을 요구사항으로 고정했다. | `02-prd.md` |
| PRD Review | Lite feature로 `/plan-bridge`를 생략하고 dev로 직행해도 되는지 확인했다. | `03-prd-review.md` |
| Feature Package | 구현 가능한 문서 묶음으로 변환했다. | `00-context/**`, `02-package/**` |
| Dev | `AI_INPUT`, `AI_EXTRACT`, `AI_APPLY`의 focus zoom 흐름을 구현했다. | `src/components/dashboard-preview/**`, `src/lib/preview-steps.ts` |
| Verify | 테스트, typecheck, build, browser DOM check를 수행했다. | `01-dev-verification-report.md` |
| Archive | 최종 산출물을 `.plans/archive/dash-preview-focus-zoom-animation/`로 이동했다. | `ARCHIVE-FZ.md` |

## 3. Key Decisions

| 결정 | 내용 | 이유 |
|---|---|---|
| Lite lane | Standard feature가 아니라 Lite feature로 진행했다. | API, DB, 새 dependency 변경 없이 기존 `dash-preview` 안에서 해결 가능했다. |
| `/plan-bridge` skip | Lite feature라 bridge 단계를 생략했다. | Claude Design 또는 Stitch 변환이 필요한 새 화면 제작이 아니었다. |
| Mobile preservation | `MobileCardView`는 변경하지 않았다. | 사용자가 `US-FZ-004`에서 모바일은 현재 구현 유지로 확정했다. |
| Target-only focus | 내부 전체 컴포넌트를 움직이지 않고 target만 강조했다. | 전체 transform 방식은 글자 깨짐과 clipping 문제가 있었다. |
| `4/5` height | `PreviewChrome` content height를 `1040px * 4 / 5 = 832px`로 확정했다. | 사용자가 `4 / 5`가 의도값이라고 다시 확인했다. |
| Archive after merge-ready | Dev summary와 verification report를 남긴 뒤 archive했다. | 이후 개선이 들어와도 기준점을 추적하기 쉽게 하기 위해서다. |

## 4. Implementation Output

이번 구현 결과는 아래처럼 정리된다.

| 영역 | 변경 결과 |
|---|---|
| Step metadata | `AI_APPLY`의 phase order와 focus target metadata가 확장됐다. |
| Preview shell | 현재 phase에 따라 focus orchestration이 동작한다. |
| Preview frame | `fixed-height-reduced` frame과 target-only focus CSS가 적용됐다. |
| AI panel | result item click cue와 focus target이 연결됐다. |
| Form panel | 현재 target card 중심으로 fill/focus가 연결됐다. |

쉽게 말하면, 기존에는 전체 화면을 들고 이리저리 움직이는 느낌이었다. 최종 방향은 **무대는 고정하고, 조명만 현재 배우에게 비추는 방식**에 가깝다.

## 5. Verification Result

| 검증 | 결과 | 의미 |
|---|---|---|
| Dashboard-preview full suite | PASS, 36 files / 559 tests | 관련 기능 테스트가 통과했다. |
| Typecheck | PASS | TypeScript 타입 오류가 없었다. |
| Build | PASS with warnings | production build가 성공했다. |
| Browser DOM check | PASS | `inlineHeight: 374.4px`, `innerHeight: 832px`를 확인했다. |
| Archive path check | PASS | bundle과 source files가 archive에 모였다. |

남은 warning은 기존 테스트/빌드 warning으로 기록됐고, 이번 feature의 release blocker로 보지는 않았다.

## 6. What Went Well

- 사용자 피드백이 빠르게 pipeline 문서와 구현에 반영됐다.
- `US-FZ-003` 흐름이 여러 차례 조정됐지만, 최종 archive에 결정 근거가 남았다.
- 구현 후 검증, dev summary, archive가 이어져서 추적성이 좋아졌다.
- 별도 worktree를 써서 다른 landing 작업과 섞이는 위험을 줄였다.

## 7. What Was Hard

- 시각 애니메이션 작업은 문서만으로 완전히 고정하기 어렵다.
- `4/5` height처럼 작은 수치도 사용자의 의도 확인이 중요했다.
- archive 이후 원본 `main`과 merge할 때 `.plans` 인덱스 충돌이 발생했다.
- 여러 dev server port가 동시에 떠 있어서 preview port를 구분해야 했다.

## 8. Stage Verdict

이번 feature는 pipeline 관점에서 **완료**다.

다만 pipeline 자체에는 운영 보강이 필요하다. 특히 worktree 분리, merge conflict 처리, preview port 관리, warning ledger 같은 항목은 다음 기능 전에 checklist로 만들면 좋다.
