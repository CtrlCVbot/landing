# plan-archive Improvement Feedback for claude-kit

> 작성일: 2026-04-28
> 작성 배경: `OPTIC Landing Evolution Guide` archive 재구성 작업에서 확인한 `plan-archive` 기능 개선 포인트를 정리한다.
> 대상: `claude-kit`의 `plan-archive-workflow` / `/plan-archive` 기능 설계 개선.

## 1. 요약

현재 `plan-archive`는 단일 feature를 `.plans/archive/{slug}/`로 보관하는 흐름에는 잘 맞는다.
하지만 여러 feature archive를 하나의 최종 guide package로 묶고, 기존 원문 bundle을 내부 보존하면서 읽기 순서를 재구성하는 작업에는 수동 판단이 많이 필요했다.

이번 작업에서 가장 유용했던 최종 구조는 아래와 같다.

```text
.plans/archive/
  index.md
  2026-04-28-optic-landing-evolution-guide/
    INDEX.md
    GUIDE-landing-evolution.md
    00-consolidation-plan.md
    internal-bundles/
      2026-04-02-001-optic-landing-page/
      2026-04-15-002-dash-preview/
      ...
```

핵심 개선 방향은 `plan-archive`가 단일 feature archive뿐 아니라 "archive package"와 "consolidated guide"를 first-class workflow로 지원하는 것이다.

## 2. 이번 작업에서 확인한 문제

| 문제 | 영향 | 실제 작업에서 드러난 지점 |
| --- | --- | --- |
| 단일 feature archive만 기본 모델로 가정 | 여러 archive를 하나로 묶는 guide 작업이 수동화됨 | 10개 archive bundle을 직접 순서화하고 guide package로 재배치해야 했다. |
| root `index.md`와 package index 역할이 섞임 | 전체 archive 목록과 개별 package source map이 한 문서에 섞일 수 있음 | root index를 global registry로 줄이고 package-local `INDEX.md`를 새로 만들어야 했다. |
| 기존 bundle 위치 정책이 고정적임 | `internal-bundles/`를 archive root에 둘지 package 내부에 둘지 명확하지 않음 | 사용자가 package 안에 같이 관리되길 원해 재이동했다. |
| 구현 날짜와 순서 prefix가 자동화되지 않음 | 폴더 정렬만으로 발전 순서를 읽기 어려움 | `YYYY-MM-DD-NNN-slug`를 수동으로 붙였다. |
| 최종 구현 결과 설명이 archive bundle에 흩어짐 | 최종 guide에서 사용자 관점 결과를 다시 재구성해야 함 | `Final Implementation Result Detail` 섹션을 별도로 작성했다. |
| 링크 검증 범위가 분리되지 않음 | 오래된 원문 내부의 historical link까지 broken link처럼 보임 | entry docs 링크 검증과 internal source historical link 스캔을 분리해야 했다. |

## 3. 제안 기능: Archive Package Mode

`plan-archive`에 package 단위 실행 모드를 추가한다.

예시:

```bash
/plan-archive --package "optic-landing-evolution-guide" --date 2026-04-28 --consolidate
```

생성 구조:

```text
.plans/archive/{YYYY-MM-DD-title}/
  INDEX.md
  GUIDE-{title}.md
  00-consolidation-plan.md
  internal-bundles/
```

기본 동작:

| 동작 | 설명 |
| --- | --- |
| package folder 생성 | `.plans/archive/YYYY-MM-DD-title/` 생성 |
| package-local `INDEX.md` 생성 | guide, plan, internal bundle map, evidence entry points 관리 |
| root `index.md` 갱신 | archive package 목록만 global registry로 유지 |
| 기존 bundle 보존 | 기존 archive 원문은 `internal-bundles/` 아래로 이동하거나 참조 |
| 최종 guide 생성 | 기획 발전 순서, 개발 발전 순서, 최종 구현 결과를 하나의 guide로 정리 |

## 4. 제안 기능: Ordered Internal Bundle Move

기존 archive bundle을 package 내부로 옮길 때 날짜와 순서 prefix를 자동으로 붙인다.

규칙:

```text
internal-bundles/{YYYY-MM-DD}-{NNN}-{slug}/
```

예시:

```text
internal-bundles/2026-04-02-001-optic-landing-page/
internal-bundles/2026-04-15-002-dash-preview/
internal-bundles/2026-04-22-003-dash-preview-phase3/
```

정렬 기준 우선순위:

1. `ARCHIVE-*.md`의 `Archived` metadata
2. `index.md`의 `Archived` 열
3. folder/file git history의 최초 archive commit date
4. 사용자가 제공한 explicit order

동일 날짜 bundle은 `001`, `002`처럼 사용자가 읽을 구현 순서대로 안정적인 sequence를 붙인다.

## 5. 제안 기능: Index Role Separation

`plan-archive`는 index를 두 층으로 분리해야 한다.

| 파일 | 역할 | 포함해야 할 내용 |
| --- | --- | --- |
| `.plans/archive/index.md` | global archive registry | archive package 목록, package index 링크, main guide 링크 |
| `.plans/archive/{package}/INDEX.md` | package-local source map | guide, plan, internal bundle map, evidence entry points, maintenance notes |

root index에는 모든 feature bundle row를 계속 누적하지 않는 것을 기본값으로 둔다.
feature bundle map은 package-local `INDEX.md`로 이동해야 archive root가 장기적으로 복잡해지지 않는다.

## 6. 제안 기능: Consolidated Guide Template

package mode에서 `GUIDE-{title}.md` 템플릿을 제공한다.

권장 섹션:

```markdown
# {Product / Feature} Evolution Guide

## 1. Guide 목적
## 2. 읽는 방법
## 3. 전체 발전 타임라인
## 4. Product Foundation
## 5. Feature Foundation
## 6. Interaction / UX Hardening
## 7. Data and Architecture Evolution
## 8. Final Implementation Result Detail
## 9. Planning Package Summary
## 10. Development Package Summary
## 11. Architecture Snapshot
## 12. UX Principles
## 13. Verification Evidence Index
## 14. Known Risks and Deferred Decisions
## 15. Source Archive Map
```

`Final Implementation Result Detail`은 필수 섹션으로 두는 것이 좋다.
단순히 원문 문서 링크를 모으는 수준이면 "최종 guide"로서 가치가 약해지고, 구현 결과를 다시 설명해야 하는 작업이 매번 반복된다.

## 7. 제안 기능: Link Validation Profile

링크 검증을 두 프로필로 나눈다.

| Profile | 검증 대상 | 실패 처리 |
| --- | --- | --- |
| `entry-docs` | root `index.md`, package `INDEX.md`, final guide, consolidation plan | 실패 시 archive 완료 차단 |
| `source-bundles` | `internal-bundles/**` 원문 전체 | historical link로 분류하고 warning 처리 |

이번 작업에서는 source bundle 내부에 과거 `.plans/archive/...` 경로나 `src/...#L` 참조가 남아 있었다.
이는 원문 보존 관점에서는 정상일 수 있으므로 entry docs와 같은 기준으로 실패 처리하면 안 된다.

## 8. 제안 CLI / Command 옵션

| 옵션 | 목적 |
| --- | --- |
| `--package <title>` | package archive folder 생성 |
| `--consolidate` | 여러 archive bundle을 하나의 guide package로 통합 |
| `--move-existing` | 기존 `.plans/archive/{slug}` bundle을 `internal-bundles/`로 이동 |
| `--copy-existing` | 원문 이동 대신 복사본 package 생성 |
| `--order-by archived` | archived metadata 기준으로 `NNN` prefix 자동 생성 |
| `--root-index global` | root index를 package registry로 유지 |
| `--package-index` | package-local `INDEX.md` 생성 |
| `--entry-link-check` | entry docs 링크만 hard fail 검증 |
| `--source-link-scan` | internal source bundle 링크는 warning report 생성 |
| `--dry-run` | 이동/쓰기 전 예상 rename map과 index 변경 미리보기 |

## 9. Acceptance Criteria

| ID | 기준 |
| --- | --- |
| AC-01 | package mode 실행 시 `.plans/archive/YYYY-MM-DD-title/INDEX.md`가 생성된다. |
| AC-02 | package 내부에 final guide, consolidation plan, `internal-bundles/`가 함께 위치한다. |
| AC-03 | 기존 bundle 이동 시 `YYYY-MM-DD-NNN-slug` 규칙이 적용된다. |
| AC-04 | root `index.md`는 package registry 역할만 수행한다. |
| AC-05 | package `INDEX.md`는 internal bundle map과 evidence entry points를 가진다. |
| AC-06 | entry docs 링크 검증이 통과하지 않으면 archive 완료를 주장하지 않는다. |
| AC-07 | source bundle 내부 historical links는 warning report로 남기고 원문을 자동 수정하지 않는다. |
| AC-08 | `git mv` 기반 이동을 사용해 history 추적 가능성을 최대한 유지한다. |
| AC-09 | stage/commit 가이드는 archive package 범위만 포함하도록 안내한다. |

## 10. Feedback Priority

| Priority | 개선 | 이유 |
| --- | --- | --- |
| P1 | Archive Package Mode | 단일 feature archive를 넘어선 최종 guide 패키지 작업의 핵심이다. |
| P1 | Root index / package index 분리 | archive가 늘어날수록 root index가 커지는 문제를 막는다. |
| P1 | Ordered internal bundle move | 사용자가 folder view만 보고도 구현 순서를 읽을 수 있다. |
| P2 | Consolidated guide template | 기획과 개발의 발전 순서를 매번 새로 설계하지 않아도 된다. |
| P2 | Link validation profile | 원문 보존과 entry docs 품질 검증을 분리할 수 있다. |
| P3 | Dry-run rename map | 대량 `git mv` 전에 사용자 확인과 review 비용을 줄인다. |

## 11. Non-goals

| 항목 | 이유 |
| --- | --- |
| 원문 source bundle 내부 링크 전면 수정 | historical context가 바뀌고 review 비용이 커진다. |
| archive package마다 독립 repository처럼 동작 | 현재 `.plans/archive` 문서 관리 범위를 넘는다. |
| final guide를 자동 요약만으로 완성 | 최종 구현 결과 설명은 사람 검토가 필요한 대표 문서다. |

## 12. Suggested Implementation Plan

1. `plan-archive-workflow` 문서에 package mode 개념을 추가한다.
2. root index template과 package index template을 분리한다.
3. 기존 archive folder metadata를 읽어 ordered move map을 생성하는 dry-run 단계를 만든다.
4. `internal-bundles/YYYY-MM-DD-NNN-slug/` 이동을 `git mv` 기반으로 수행한다.
5. final guide template에 `Final Implementation Result Detail`을 필수 섹션으로 넣는다.
6. entry docs 링크 검증과 source bundle warning scan을 분리한다.
7. archive package만 stage/commit할 수 있는 closeout checklist를 추가한다.

## 13. Reference From This Work

| 결과물 | 경로 |
| --- | --- |
| Root archive registry | `.plans/archive/index.md` |
| Package index | `.plans/archive/2026-04-28-optic-landing-evolution-guide/INDEX.md` |
| Final guide | `.plans/archive/2026-04-28-optic-landing-evolution-guide/GUIDE-landing-evolution.md` |
| Consolidation plan | `.plans/archive/2026-04-28-optic-landing-evolution-guide/00-consolidation-plan.md` |
| Internal source bundles | `.plans/archive/2026-04-28-optic-landing-evolution-guide/internal-bundles/` |
