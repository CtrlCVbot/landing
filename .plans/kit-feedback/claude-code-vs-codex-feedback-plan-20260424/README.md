# claude-kit Pipeline Feedback Plan - Claude Code vs Codex (2026-04-24)

> 이 패키지는 최종 피드백 리포트가 아니라, 최종 리포트를 쓰기 위한 작성 계획과 증거 묶음입니다.
> 대상은 `claude-kit` 기획/개발 파이프라인이며, 현재 repo의 Phase A/B 산출물과 이번 Codex 문서화 작업을 이전 Claude Code 문서화 작업과 비교합니다.

## 1. 목적

이번 패키지의 목적은 다음 3가지를 분리해서 정리하는 것입니다.

| 구분 | 목적 | 결과 |
| --- | --- | --- |
| 증거 정리 | 이전 Claude Code 산출물과 현재 Codex 산출물을 같은 기준으로 모읍니다. | 어떤 판단이 어떤 파일/커밋에 근거하는지 추적 가능 |
| 비교 프레임 | Claude Code와 Codex의 파이프라인 경험 차이를 항목별로 비교합니다. | 최종 피드백 리포트의 본문 구조 확보 |
| 개선 후보 | Codex에서 더 잘 돌아가게 만들 개선점을 별도 backlog로 뽑습니다. | `claude-kit` Codex target 개선안으로 전환 가능 |

## 2. 범위

| 범위 | 포함 | 제외 |
| --- | --- | --- |
| 이전 Claude Code 작업 | `dash-preview`, `dash-preview-phase3` archive, 관련 git commit | 원격 이슈, Claude Code 내부 세션 로그 원문 |
| 현재 repo/Codex 작업 | EPIC-20260422-001 Phase A/B 문서, F2/F4 PRD Review와 Bridge, 기존 `phase-a-dry-run` 피드백 | `/dev-feature`, `/dev-run` 실제 구현 단계 |
| 개선 방향 | Codex용 skill, handoff, 검증, 상태 동기화, 문서 패키징 개선 | 코드 구현, hook 실제 수정 |

## 3. 패키지 구성

| 파일 | 역할 |
| --- | --- |
| [`01-feedback-document-plan.md`](./01-feedback-document-plan.md) | 최종 피드백 문서 작성 계획. 목표, 범위, 단계, 최종 목차를 정의합니다. |
| [`02-evidence-inventory.md`](./02-evidence-inventory.md) | 커밋, archive, 현재 Codex 산출물, 남은 증거 공백을 정리합니다. |
| [`03-claude-code-vs-codex-comparison-frame.md`](./03-claude-code-vs-codex-comparison-frame.md) | Claude Code와 Codex를 같은 질문으로 비교할 수 있는 분석 표입니다. |
| [`04-codex-improvement-planning.md`](./04-codex-improvement-planning.md) | Codex target 개선 후보와 우선순위 초안입니다. |
| [`05-review-checklist.md`](./05-review-checklist.md) | 최종 리포트 작성 전 확인할 리뷰 체크리스트와 사용자 결정 항목입니다. |
| [`06-document-review-feedback.md`](./06-document-review-feedback.md) | 패키지 전체 리뷰 결과와 자동 반영/보류 피드백입니다. |

## 4. 빠른 결론

이 패키지가 제안하는 최종 리포트 방향은 다음과 같습니다.

1. Claude Code archive는 `PRD/Wireframe/Stitch/Bridge/Dev/Archive` 산출물이 풍부하고, 구현 검증 evidence가 촘촘합니다.
2. Codex current pipeline은 `AGENTS.md`, repo-local skills, current repo state, bridge context, routing metadata를 통해 현재 상태를 명시하기 좋지만, 단계별 handoff manifest와 status sync를 더 구조화해야 합니다.
3. 기존 `phase-a-dry-run` 피드백의 `I-01~I-18`은 유지하되, Codex에서는 `handoff/report wording`, `PowerShell fallback`, `prompt rewrite vs execution guard` 같은 별도 개선 축을 추가해야 합니다.
4. 최종 산출물은 단일 문서보다 문서 패키지가 적합합니다. 증거와 제안을 분리해야 나중에 `claude-kit` 개선 backlog로 전환하기 쉽습니다.

## 5. 다음 액션

1. 이 패키지의 증거 목록을 확인합니다.
2. `05-review-checklist.md`의 사용자 결정 항목을 확정합니다.
3. 확정 후 최종 피드백 리포트 패키지를 별도로 작성합니다.
