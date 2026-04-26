# 02. Evidence Inventory

> 최종 피드백 리포트에서 사용할 증거 목록입니다.
> 이 문서는 "무엇을 근거로 말할 수 있는가"와 "아직 말하면 안 되는 부분은 무엇인가"를 나눕니다.

## 1. Git commit evidence

| Commit | 제목 | 증거로 쓰는 이유 |
| --- | --- | --- |
| `144937a` | `docs(dash-preview): 대시 프리뷰 아카이브 추가` | `dash-preview` archive 패키지의 최초 기준선입니다. PRD, Wireframe, Stitch, Feature Package, Dev Notes가 모두 archive에 포함됩니다. |
| `8d49a8f` | `docs(dash-preview-phase3): 대시 프리뷰 3단계 아카이브 추가` | Phase 3의 full pipeline archive입니다. P1~P7, Dev Spike, M1~M5, verification evidence가 포함됩니다. |
| `6a55af0` | `docs(plan): Phase A 기획 완료 - EPIC-20260422-001 + F1/F5 Feature Package` | Codex/Claude-kit Phase A 계획과 `phase-a-dry-run` 피드백 패키지가 만들어진 시점입니다. |
| `8064565` | `docs(plan): Phase A Feature Package 생성 - F1 라이트 테마 + F5 UI 잔재 정리` | F1/F5 Feature Package의 `00-context`, `02-package`, verification report 흐름을 확인할 수 있습니다. |
| `636128e` | `docs(epic): add phase b roadmap` | Phase B 로드맵이 Epic children 문서에 추가된 기준점입니다. |

## 2. Claude Code archive evidence

| Archive | 경로 | 확인한 내용 | 최종 리포트 활용 |
| --- | --- | --- | --- |
| `dash-preview` | `.plans/archive/dash-preview/ARCHIVE-DASH.md` | Pipeline이 `P4 -> P5 -> P6 -> P7 -> Dev -> Archive`로 기록되어 있고, PRD/Wireframe/Stitch/Feature Package/Dev Notes가 함께 보존됩니다. | 초기 dashboard preview 문서화 방식의 기준선 |
| `dash-preview` sources | `.plans/archive/dash-preview/sources/` | PRD, wireframes, stitch, feature package, dev notes가 source bundle로 묶였습니다. | archive package completeness 비교 |
| `dash-preview-phase3` | `.plans/archive/dash-preview-phase3/ARCHIVE-DASH3.md` | `P1 -> P2 -> P3 -> P4 -> P5 -> P6 skipped -> P7 -> Dev -> Archive` 흐름, 622 Phase 3 tests, 916 legacy tests, `/dev-verify PASS`가 기록됩니다. | mature pipeline과 verification evidence 비교 |
| `dash-preview-phase3` package | `.plans/archive/dash-preview-phase3/sources/feature-package/` | `00-context`, `02-package`, `03-dev-notes`, `sources`, `evidence`가 함께 보존됩니다. | Codex Bridge context와 비교할 archive 구조 |

## 3. Current Codex pipeline evidence

| 영역 | 경로 | 확인한 내용 | 최종 리포트 활용 |
| --- | --- | --- | --- |
| Epic children | `.plans/epics/20-active/EPIC-20260422-001/01-children-features.md` | F1/F5 archived, F2/F4 approved and Bridge complete, Phase B next step is `/dev-feature`. | 현재 pipeline state의 source |
| F2 PRD Review | `.plans/drafts/f2-mock-schema-redesign/03-prd-review.md` | Verdict `Approve`, critical/high 없음, medium feedback 2건, low feedback 1건. | Codex PRD review 품질과 남은 feedback 예시 |
| F4 PRD Review | `.plans/archive/f4-layout-hit-area-realignment/sources/drafts/03-prd-review.md` | Verdict `Approve`, critical/high 없음, medium feedback 1건, low feedback 1건. | Codex PRD review 품질과 남은 feedback 예시 |
| F2 Bridge context | `.plans/features/active/f2-mock-schema-redesign/00-context/` | `00-index`, `01-prd-freeze`, `01-product-context`, `02-decision-log`, `02-scope-boundaries`, `03-design-decisions`, `04-implementation-hints`, `06-architecture-binding`, `08-epic-binding` 총 9개 파일. | Codex Bridge output 구조 |
| F4 Bridge context | `.plans/archive/f4-layout-hit-area-realignment/sources/feature-package/00-context/` | F2와 같은 9개 context 파일 구조. | Codex Bridge output 구조 |
| Phase A feedback | `.plans/kit-feedback/phase-a-dry-run-20260423/` | pipeline overview, positive findings, pain points, improvement proposals, command-agent matrix가 이미 문서 패키지로 존재합니다. | 기존 feedback과 새 Codex 개선 후보 매핑 |

## 4. Working tree snapshot and scope notes

| 항목 | 현재 상태 | 의미 |
| --- | --- | --- |
| `.plans` 변경 | 패키지 작성 시점에 staged 상태로 다수 존재 | 현재 작업은 문서 산출물 중심으로 진행되었습니다. 최종 리포트 작성 직전 재측정이 필요합니다. |
| `package.json` | unstaged modified | 이번 문서 패키지 범위 밖입니다. 건드리지 않습니다. |
| `%SystemDrive%/` | untracked | 이번 문서 패키지 범위 밖입니다. 원인 조사는 별도 작업입니다. |
| Branch | `main`, `origin/main`보다 ahead 1 | 문서 작업 전 기존 commit이 하나 앞서 있습니다. |

## 5. Evidence gaps

| 공백 | 영향 | 최종 리포트 처리 |
| --- | --- | --- |
| Claude Code 세션 transcript 원문 없음 | 실제 대화 흐름의 불편함은 archive/commit으로만 추정해야 합니다. | "archive와 commit 기준 관찰"로 명시합니다. |
| F2/F4 `/dev-feature` 미실행 | Bridge 이후 구현 준비도는 검증했지만 구현 단계 피드백은 아직 없습니다. | Phase B dev feedback은 후속 리포트로 분리합니다. |
| Codex subagent 병렬 구현 경험 없음 | Codex worker ownership/race를 현재 작업에서 직접 측정하지 않았습니다. | 개선 후보로만 두고 verified finding처럼 쓰지 않습니다. |
| `%SystemDrive%/` untracked 원인 미확인 | repo hygiene 리스크는 보이나 이번 작업의 근거는 부족합니다. | 남은 리스크로만 기록합니다. |
| `package.json` unstaged 변경 출처 미확인 | 문서 패키지와 무관한 변경입니다. | 최종 리포트에서 범위 제외로 명시합니다. |
