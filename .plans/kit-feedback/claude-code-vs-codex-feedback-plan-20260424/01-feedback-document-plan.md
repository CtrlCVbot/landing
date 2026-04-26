# 01. Feedback Document Plan

> 작성 목표: 현재까지 진행된 `claude-kit` 파이프라인 경험을 친절하고 자세한 피드백 문서로 정리하기 위한 실행 계획입니다.
> 이 문서는 최종 피드백 자체가 아니라, 최종 피드백을 쓰기 위한 설계도입니다.

## 1. 작성 목표

최종 피드백 문서는 다음 질문에 답해야 합니다.

| 질문 | 답해야 하는 내용 |
| --- | --- |
| 무엇이 잘 작동했나? | Epic/Feature/Task 구조, PRD Review, Bridge, archive, verification evidence 중 유지할 강점 |
| 어디서 사용자가 불편했나? | 상태 동기화, 수동 링크 갱신, agent/file ownership, handoff, cache/read 문제 |
| Claude Code 작업과 Codex 작업은 무엇이 달랐나? | command/hook 중심 흐름과 Codex skill/tool 중심 흐름의 차이 |
| Codex용으로 무엇을 더 개선해야 하나? | Codex target, repo-local skill, AGENTS.md, handoff manifest, verification/reporting 개선안 |
| 다음 `claude-kit` 개선으로 무엇을 올릴까? | 바로 backlog화 가능한 제안과 검증이 더 필요한 제안 구분 |

## 2. 작성 범위

| 영역 | 포함할 내용 | 이유 |
| --- | --- | --- |
| Claude Code archive | `dash-preview`, `dash-preview-phase3` archive와 관련 commit | 이전 문서화 작업의 기준선 |
| Landing Phase A baseline | `phase-a-dry-run-20260423` 피드백 패키지, F1/F5 archive 흐름 | 메인 Claude 세션이 남긴 실사용 피드백 기준선 |
| Current Phase B evidence | F2/F4 IDEA, Screening, Draft, PRD, PRD Review, Bridge context | 이번 Codex 문서화 작업에서 확인한 최신 pipeline evidence |
| 작업 경계 | 현재 작업 전후 Git 상태와 unrelated 변경 분리 | 문서 작업의 범위 통제 증거 |
| Codex 개선점 | skill/report/handoff/verification 중심 개선 후보 | Claude Code와 다르게 보강해야 할 부분 |

## 3. 작성하지 않을 내용

| 제외 항목 | 제외 이유 |
| --- | --- |
| 최종 verdict 단정 | 아직 사용자 결정 항목과 evidence gap이 남아 있습니다. |
| 코드 수정 | 이번 요청은 문서/문서 패키지 작업입니다. |
| `/dev-feature` 구현 평가 | F2/F4는 Bridge 완료 상태이며 구현 검증은 아직 다음 단계입니다. |
| Claude Code 내부 세션 로그 재구성 | 현재 근거는 archive와 git commit 기준입니다. |

## 4. 작성 단계

| 단계 | 작업 | 산출물 |
| --- | --- | --- |
| 1. Evidence 수집 | archive, commit, current `.plans` 상태를 표로 정리 | `02-evidence-inventory.md` |
| 2. 비교 기준 정의 | Claude Code와 Codex를 같은 질문으로 비교 | `03-claude-code-vs-codex-comparison-frame.md` |
| 3. 개선 후보 추출 | Codex 특화 개선점을 backlog 후보로 작성 | `04-codex-improvement-planning.md` |
| 4. 최종 리포트 목차 설계 | 독자가 읽을 순서와 상세 수준 결정 | 이 문서의 `7. 최종 리포트 목차 초안` |
| 5. 리뷰 | 증거 추적성, 추정 배제, 범위 통제 확인 | `05-review-checklist.md` |

## 5. 최종 리포트에서 다룰 피드백 카테고리

| 카테고리 | 핵심 질문 | 예시 |
| --- | --- | --- |
| Pipeline structure | 단계 구조가 이해하기 쉬운가? | P1~P7, Bridge, Dev, Archive |
| State management | 상태가 한 곳에서 추적되는가? | IDEA/backlog/children/binding sync |
| Evidence quality | 완료 주장의 근거가 충분한가? | tests, DVC, PRD review, artifact manifest |
| Handoff quality | 다음 단계 실행자가 바로 이어받을 수 있는가? | `00-context`, routing metadata, dev task readiness |
| Tool ergonomics | 사용자가 반복 수작업을 얼마나 해야 하는가? | link rewrite, `git mv`, PowerShell fallback |
| Codex compatibility | Codex runtime에서 자연스럽게 실행되는가? | `AGENTS.md`, repo-local skills, repo state awareness |
| Documentation packaging | 산출물이 나중에 다시 읽기 쉬운가? | archive bundle, feedback package, review checklist |

## 6. Claude Code vs Codex 비교 접근

최종 문서는 단순히 "어느 쪽이 낫다"로 쓰지 않습니다. 대신 다음처럼 관찰 가능한 차이를 정리합니다.

| 비교 축 | Claude Code 관찰 | Codex 관찰 | 최종 분석 방향 |
| --- | --- | --- | --- |
| 실행 단위 | command/hook/agent 중심 | skill/tool/AGENTS.md 중심 | 같은 pipeline 의도를 runtime별로 어떻게 보존할지 분석 |
| 증거 남김 | archive bundle과 dev verification이 강함 | current repo state와 repo-local docs가 강함 | evidence manifest를 공통 포맷으로 맞출 필요 |
| 상태 전환 | Epic advance와 archive 흐름이 명시됨 | 현재 state와 next route를 문서로 계속 갱신 | stage manifest 또는 handoff manifest 필요 |
| 사용자 확인 | checkpoint와 review가 세분화됨 | Codex final/reporting에서 범위와 리스크를 잘 보임 | checkpoint language를 Codex용으로 정리 |
| 병렬 작업 | agent ownership 이슈가 뚜렷함 | subagent 사용은 명시 요청시에만 가능 | Codex에서는 worker-less fallback 절차도 필요 |

## 7. 최종 리포트 목차 초안

1. Executive Summary
2. 분석 범위와 증거 기준
3. Claude Code archive에서 확인한 강점
4. 현재 Codex pipeline에서 확인한 강점
5. 두 환경의 차이와 원인
6. 사용 중 불편했던 지점
7. Codex target 개선 제안
8. 기존 `phase-a-dry-run` 제안과의 매핑
9. 우선순위 backlog
10. 남은 증거 공백과 다음 검증 계획

## 8. 톤과 작성 원칙

| 원칙 | 적용 방식 |
| --- | --- |
| 친절함 | 초보자도 따라올 수 있게 용어 첫 등장 시 짧게 설명합니다. |
| 증거 기반 | 각 주장 옆에 archive, commit, 파일 경로 중 하나를 붙입니다. |
| 비난 회피 | 문제를 "사용자 실수"가 아니라 "workflow가 보완할 수 있는 지점"으로 씁니다. |
| 실행 가능성 | 제안은 `무엇을 바꿀지`, `어디에 반영할지`, `검증 방법`까지 둡니다. |
| Codex 분리 | Claude Code 개선점과 Codex target 개선점을 섞지 않습니다. |

## 9. 완료 기준

최종 피드백 리포트로 넘어가기 전, 이 계획 패키지는 다음을 만족해야 합니다.

| 기준 | 상태 |
| --- | --- |
| 이전 Claude Code archive 2개가 evidence에 포함됨 | 완료 |
| 현재 repo Phase A/B evidence가 포함됨 | 완료 |
| 비교 프레임이 Claude Code/Codex 양쪽을 모두 다룸 | 완료 |
| Codex용 개선 후보가 별도 문서로 분리됨 | 완료 |
| 사용자 결정 항목이 정리됨 | 완료 |
