# 04. Codex Improvement Planning

> Claude Code와 비교했을 때 Codex target에 추가하면 좋은 개선 후보입니다.
> 이 문서는 최종 피드백 리포트의 backlog 초안으로 사용합니다.

## 1. 우선순위 기준

| 기준 | 설명 |
| --- | --- |
| 사용자 반복 부담 감소 | 매번 손으로 확인하거나 복붙해야 하는 작업을 줄입니다. |
| evidence 품질 향상 | 완료 주장과 검증 근거를 더 명확히 남깁니다. |
| runtime 적합성 | Claude Code 전용 command/hook 개념을 Codex 방식으로 바꿉니다. |
| 구현 난이도 | 문서/skill 변경으로 먼저 해결 가능한 것을 우선합니다. |

## 2. 개선 후보

| ID | 개선 후보 | 우선순위 | 근거 | 다음 액션 |
| --- | --- | --- | --- | --- |
| C-01 | Codex phase handoff manifest | High | F2/F4 Bridge는 9개 context 파일이 있지만, 다음 실행자가 볼 한 장짜리 handoff가 없습니다. | `00-context/handoff-manifest.md` 템플릿 설계 |
| C-02 | docs-only verification wording | High | 문서 패키지는 code test가 아니라 파일 수, 링크, diff check, 섹션 coverage 검증이 핵심입니다. | final report template에 docs-only 검증 표준 문구 추가 |
| C-04 | PowerShell fallback guide | Medium | Windows 환경에서 `rg`/bash/sed 예시가 그대로 맞지 않을 수 있습니다. | repo-local skills에 PowerShell fallback 예시 추가 |
| C-05 | prompt rewrite vs execution guard | Medium | `$prompts-chat` 요청은 prompt 정리인지 실제 실행인지 분리해야 합니다. | prompt 개선 skill에 intent guard 문구 추가 |
| C-06 | Bridge output expectation marker | Medium | F2/F4는 `00-context`만 있고 `02-package`는 아직 없습니다. 이 차이를 문서가 명시해야 합니다. | `00-index.md`에 "generated now / generated later" 표준 섹션 추가 |
| C-07 | routing metadata validator | Medium | F2/F4 next step은 `/dev-feature`입니다. next route가 틀리면 pipeline이 흔들립니다. | `entryPoint`, `next`, `featureType` 체크 스크립트 또는 checklist 작성 |
| C-08 | feedback package template | Medium | `phase-a-dry-run`과 이번 패키지가 모두 다문서 구조에 적합합니다. | `.plans/kit-feedback/_template/` 설계 |
| C-09 | Codex worker write-scope contract | Medium | 향후 subagent/worker를 쓰면 file ownership 충돌이 다시 생길 수 있습니다. | worker prompt에 "write set"과 "do not revert others" 블록 추가 |
| C-10 | existing I-01~I-18 Codex mapping | Medium | 기존 Phase A 개선안은 Claude Code 중심 표현이 섞여 있습니다. | 최종 리포트에서 `I-* -> C-*` 매핑 표 작성 |
| C-11 | archive link check after move | Low | archive 이동 후 relative link rewrite가 반복 리스크입니다. | `git diff --check` 외에 markdown link scan 추가 |
| C-12 | evidence inventory generator | Low | 매번 commit/archive evidence를 손으로 모으고 있습니다. | `git log` + archive manifest 요약 스크립트 후보화 |

## 3. 기존 Phase A 제안과의 연결

| 기존 제안 | Codex에서의 해석 | 연결 후보 |
| --- | --- | --- |
| I-01 Epic advance link rewrite | Codex에서도 archive/advance 후 링크 안정성이 중요합니다. | C-11 |
| I-02 Feature state SSOT | Codex final report와 handoff에서도 state source를 명시해야 합니다. | C-01, C-07 |
| I-03 Agent file ownership | Codex subagent는 명시 요청시에만 쓰지만, future worker에는 같은 문제가 생길 수 있습니다. | C-09 |
| I-04 Read cache invalidation | Codex에서는 read-before-edit로 충분히 대응 가능하므로 별도 개선 후보로 두지 않습니다. | 미반영 |
| I-07 Phase roadmap templating | Codex에서도 다음 단계 제안과 phase handoff가 template화될 수 있습니다. | C-01 |
| I-09 Writer output standard | Codex skill output도 "created files / decisions / verification / next step" 형식이 필요합니다. | C-02, C-08 |

## 4. 추천 roadmap

| 순서 | 묶음 | 이유 |
| --- | --- | --- |
| 1 | C-01, C-02 | 문서와 보고만 바꿔도 즉시 혼동을 줄일 수 있습니다. |
| 2 | C-06, C-07, C-08 | pipeline output 구조를 안정화합니다. |
| 3 | C-04, C-05 | Codex 사용자 경험을 환경/프롬프트 측면에서 개선합니다. |
| 4 | C-09, C-10, C-11, C-12 | 더 큰 자동화와 backlog 정리에 적합합니다. |

## 5. 최종 리포트 반영 방식

최종 리포트에서는 위 후보를 모두 같은 무게로 쓰지 않습니다.

| 구분 | 포함 방식 |
| --- | --- |
| High | 본문 핵심 제안으로 포함 |
| Medium | backlog 표와 우선순위 근거에 포함 |
| Low | "후속 자동화 후보"로 짧게 포함 |
