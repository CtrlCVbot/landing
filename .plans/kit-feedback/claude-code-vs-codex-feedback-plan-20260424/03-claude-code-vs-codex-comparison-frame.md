# 03. Claude Code vs Codex Comparison Frame

> 최종 피드백 리포트에서 사용할 비교 프레임입니다.
> 목적은 도구 우열 판단이 아니라, 같은 `claude-kit` pipeline을 두 runtime에서 더 안정적으로 쓰기 위한 차이를 찾는 것입니다.

## 1. 비교 원칙

| 원칙 | 설명 |
| --- | --- |
| 같은 질문으로 비교 | Claude Code와 Codex를 동일한 pipeline 질문으로 비교합니다. |
| 증거 없는 단정 금지 | archive, commit, 현재 파일 중 하나로 확인되는 내용만 finding으로 씁니다. |
| runtime 차이 인정 | Claude Code command/hook 모델과 Codex AGENTS/skill/tool 모델은 1:1 대응이 아닙니다. |
| 개선안 분리 | 공통 `claude-kit` 개선과 Codex target 개선을 나눕니다. |

## 2. 비교 표

| 비교 항목 | Claude Code evidence | Codex evidence | 분석 포인트 | Codex 개선 후보 |
| --- | --- | --- | --- | --- |
| Pipeline coverage | `dash-preview-phase3`가 P1~P7, Dev Spike, M1~M5, Archive를 기록 | F2/F4는 IDEA~Bridge까지 완료, `/dev-feature` 대기 | Claude Code archive는 full lifecycle evidence가 강하고, Codex는 현재 진행 상태 노출이 좋습니다. | 단계별 `handoff-manifest.md` 생성 |
| Archive completeness | `sources/feature-package/00-context`, `02-package`, `03-dev-notes`, `evidence` 보존 | F2/F4 Bridge는 `00-context` 9개 파일만 생성, `02-package`는 `/dev-feature` 전 미생성 | Codex는 "아직 만들지 않은 것"이 명확해야 혼동이 줄어듭니다. | Bridge index에 "not yet generated" 섹션 표준화 |
| Verification evidence | Phase 3 archive에 tests, build, axe, `/dev-verify PASS` 기록 | 현재 문서 패키지는 docs-only라 코드 검증 대신 diff/check 검증 중심 | 구현 완료와 문서 계획 완료의 검증 기준이 다릅니다. | report template에서 docs-only verification 문구 분리 |
| State visibility | archive 후 상태가 안정적으로 보존됨 | active Epic children, draft review, Bridge context가 현재 상태를 보여줌 | Codex는 live state 확인에 강하지만 여러 파일 동기화 부담이 있습니다. | `plan-status-sync` 또는 state summary generator |
| Link and path stability | archive bundle이 source path를 한곳에 모음 | staged rename/archive와 active context가 함께 존재 | 이동/아카이브 후 링크 rewrite가 계속 리스크입니다. | archive/advance 후 link check 자동화 |
| Agent/file ownership | Phase A feedback에서 Epic shared file race가 pain point로 기록 | Codex는 subagent가 명시 요청시에만 쓰이므로 main session ownership이 뚜렷함 | Codex에서도 future worker 사용 시 ownership 규칙이 필요합니다. | Codex worker prompt에 write scope contract 추가 |
| User checkpoint | Claude Code pipeline은 checkpoint/approval gate가 풍부함 | Codex final report와 plan update로 상태를 노출 | Codex에는 command-level checkpoint 대신 "다음 단계 제안"이 중요합니다. | Codex용 phase checkpoint wording 템플릿 |
| Read/cache issue | Phase A feedback에 Read cache invalidation 문제 기록 | Codex는 파일 수정 전 직접 읽고 `apply_patch` 사용 | Codex는 cache 이슈보다 read-before-edit 습관과 변경 범위 확인이 더 중요합니다. | read-before-edit checklist |
| Windows shell compatibility | Claude Code docs는 bash/sed 예시가 많음 | 현재 환경은 PowerShell이고 `rg` 실패 시 fallback 필요 | Codex target은 Windows 사용성을 더 분명히 다뤄야 합니다. | PowerShell fallback block을 skills에 추가 |
| Prompt handling | Claude Code commands는 실행 의도가 뚜렷함 | 사용자가 `$prompts-chat`로 prompt rewrite를 요청할 수 있음 | Codex에서는 "프롬프트 정리"와 "작업 실행"을 구분해야 합니다. | prompt rewrite vs execution guard |
| Git hygiene | archive commit 단위가 분리되어 있음 | staged `.plans`와 unrelated `package.json`, `%SystemDrive%/`가 공존 | Codex final report는 scope 분리가 특히 중요합니다. | 개선 후보가 아니라 evidence scope note로만 처리 |
| Feedback packaging | `phase-a-dry-run`이 5문서 패키지로 정리됨 | 이번 패키지는 final report 전 planning package | feedback은 단일 문서보다 패키지가 재사용성이 높습니다. | feedback package template 도입 |

## 3. 최종 리포트에서 사용할 관찰 문장 초안

| 주제 | 문장 초안 |
| --- | --- |
| Claude Code 강점 | Claude Code archive는 full lifecycle evidence를 한 bundle에 남기는 능력이 강합니다. 특히 `dash-preview-phase3`는 planning, implementation, verification, archive가 한 흐름으로 재현됩니다. |
| Codex 강점 | Codex는 현재 repo의 live state, AGENTS.md guidance, skill output을 바탕으로 "지금 어디까지 왔는지"를 짧게 보여주는 데 강합니다. |
| 공통 개선점 | 두 runtime 모두 상태 동기화와 링크 rewrite가 반복 부담입니다. 이 영역은 `claude-kit` 공통 자동화 후보입니다. |
| Codex 추가 개선점 | Codex는 Claude Code hook/command와 달리 `AGENTS.md`, skill, final report, tool discipline에 의존하므로 Codex target 전용 handoff와 verification wording이 필요합니다. |

## 4. 결론 작성 기준

최종 리포트 결론은 다음 판정으로 정리합니다.

| 판정 | 의미 |
| --- | --- |
| Confirmed | archive, commit, 현재 파일에서 모두 확인되는 사실 |
| Likely | 여러 증거가 가리키지만 직접 실행 transcript는 없는 내용 |
| Tentative | 개선 후보로는 유효하지만 현재 작업만으로 확정하면 안 되는 내용 |
