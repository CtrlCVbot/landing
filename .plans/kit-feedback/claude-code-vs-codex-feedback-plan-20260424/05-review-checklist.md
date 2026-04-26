# 05. Review Checklist

> 최종 피드백 리포트를 쓰기 전에 확인할 체크리스트입니다.
> 이 문서의 목적은 추정과 확정 사실을 섞지 않도록 막는 것입니다.

## 1. Self-review checklist

| 항목 | 기준 | 상태 |
| --- | --- | --- |
| Evidence traceability | 주요 주장마다 파일, archive, commit 중 하나가 연결되어야 합니다. | 준비됨 |
| Scope control | 이번 작업은 문서 패키지이며 코드 구현으로 번지지 않아야 합니다. | 준비됨 |
| Claude Code comparison | `dash-preview`, `dash-preview-phase3` 둘 다 비교 근거에 포함되어야 합니다. | 준비됨 |
| Codex current state | F2/F4가 Bridge 완료, `/dev-feature` 대기 상태임을 명시해야 합니다. | 준비됨 |
| Existing feedback reuse | `phase-a-dry-run`의 I-01~I-18을 무시하지 말고 Codex 개선 후보와 연결해야 합니다. | 준비됨 |
| Unrelated changes | `package.json`, `%SystemDrive%/`는 범위 밖으로 분리해야 합니다. | 준비됨 |
| No overclaim | `/dev-feature`와 `/dev-run` 구현 피드백은 아직 확정 finding처럼 쓰면 안 됩니다. | 준비됨 |

## 2. Risk classification

| 항목 | Severity | Confidence | Action | 메모 |
| --- | --- | --- | --- | --- |
| 최종 리포트에서 구현 단계까지 단정할 위험 | medium | likely | needs-verification | F2/F4는 아직 Bridge 이후 구현 전입니다. |
| Claude Code 세션 원문 없이 사용감까지 단정할 위험 | medium | likely | needs-verification | archive/commit 근거로 관찰 범위를 제한합니다. |
| 기존 변경과 새 문서 패키지가 섞여 보일 위험 | medium | confirmed | queued | 최종 보고에서 새 산출물과 기존 변경을 분리합니다. |
| unrelated working tree 변경을 건드릴 위험 | high | confirmed | queued | `package.json`, `%SystemDrive%/`는 수정/삭제/스테이징하지 않습니다. |

## 3. User decision items

최종 피드백 리포트 작성 전에 사용자가 정하면 좋은 항목입니다.

| 질문 | 선택지 | 영향 |
| --- | --- | --- |
| 최종 리포트 범위 | `landing` 사례 중심 / `claude-kit` 일반 개선 중심 | 사례 리포트인지 제품 개선안인지 톤이 달라집니다. |
| 기존 `phase-a-dry-run` 처리 | 유지 후 참조 / 새 리포트에 병합 | 원문 보존성과 읽기 편의성의 trade-off가 있습니다. |
| 독자 | `claude-kit` maintainer / Codex target 작성자 / 내부 사용자 | 용어 깊이와 action item 수준이 달라집니다. |
| Codex 개선 후보 처리 | 리포트에만 유지 / 별도 IDEA 문서로 등록 | backlog 관리 방식이 달라집니다. |
| 최종 산출물 형식 | 단일 문서 / 문서 패키지 | 증거와 제안을 분리할지 결정합니다. |

## 4. Suggested final report package

사용자 승인 후에는 다음 구조를 추천합니다.

```text
.plans/kit-feedback/claude-code-vs-codex-feedback-20260424/
  README.md
  01-executive-summary.md
  02-evidence-and-scope.md
  03-claude-code-baseline.md
  04-codex-current-findings.md
  05-comparison-analysis.md
  06-codex-improvement-backlog.md
  07-final-recommendations.md
```

위 구조는 `01-feedback-document-plan.md`의 10개 목차를 7개 파일로 나누는 패키지형 산출물입니다. 최종 작성 시 `02-evidence-and-scope.md`에는 증거 기준과 evidence gaps를 함께 두고, `05-comparison-analysis.md`에는 Claude Code/Codex 비교와 원인 분석을 함께 둡니다.

## 5. Review result

현재 계획 패키지는 최종 피드백 리포트로 넘어가기 위한 준비 문서로 충분합니다.
다만 최종 리포트에서는 사용자 결정 항목 5개 중 최소한 `범위`, `독자`, `산출물 형식`을 먼저 고정하는 것이 좋습니다.
