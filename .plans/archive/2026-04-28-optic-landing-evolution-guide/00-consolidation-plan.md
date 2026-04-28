# Archive Consolidation Guide Plan

> 작성일: 2026-04-28
> 대상 경로: `.plans/archive`
> 범위: 계획 수립만 진행. 기존 문서 통합, 이동, 삭제, 원문 수정은 하지 않는다.

## 1. 현재 상태 요약

`.plans/archive`는 기능별 archive bundle을 이미 보유하고 있다. 각 bundle은 대체로 `ARCHIVE-*.md` 단일 요약 문서와 `sources/` 원문 묶음으로 구성되어 있으며, 일부 bundle은 `improvements/`, `evidence/`, `qa-evidence/`를 함께 가진다.

현재 구조는 개별 기능 추적에는 좋지만, OPTIC landing이 기획에서 개발까지 어떻게 발전했는지 한 번에 읽기에는 진입점이 분산되어 있다. 따라서 최종 가이드 문서는 "문서 원문을 재배치하는 archive"가 아니라, 기존 archive bundle을 근거로 삼아 발전 순서를 설명하는 대표 guide layer가 되어야 한다.

## 2. 문서 인벤토리

### 2.1 Archive bundle 목록

| 순서 | Bundle | 대표 문서 | 단계 성격 | 통합 가이드 내 역할 |
| --- | --- | --- | --- | --- |
| 1 | `optic-landing-page` | `ARCHIVE-OLP.md` | 초기 제품/랜딩 foundation | 제품 목표, 초기 IA, 기본 guide의 출발점 |
| 2 | `dash-preview` | `ARCHIVE-DASH.md` | dashboard preview 1차 확장 | 핵심 데모 영역 도입과 화면 구조 확장 |
| 3 | `dash-preview-phase3` | `ARCHIVE-DASH3.md` | preview 조작감/정밀도 강화 | pixel-perfect preview와 interaction 품질 기준 |
| 4 | `f5-ui-residue-cleanup` | `ARCHIVE-F5.md` | UI 잔재 정리 | 후속 개선 전 품질 정리와 scope 축소 |
| 5 | `f1-landing-light-theme` | `ARCHIVE-F1.md` | light theme infrastructure | theme 전환과 전역 표현층 정비 |
| 6 | `f2-mock-schema-redesign` | `ARCHIVE-F2.md` | mock data model 재설계 | preview 데이터 구조와 단계 모델 정비 |
| 7 | `f4-layout-hit-area-realignment` | `ARCHIVE-F4.md` | layout / hit-area 정렬 | dashboard preview 사용성 개선 |
| 8 | `hero-liquid-gradient-background` | `ARCHIVE-HLG.md` | hero visual refresh 1차 | hero background와 animation 기반 도입 |
| 9 | `hero-01-reference-hero-refresh` | `ARCHIVE-HR01.md` | hero reference 반영 closeout | reference 기반 hero 품질 확정과 QA 증거 |
| 10 | `dash-preview-focus-zoom-animation` | `ARCHIVE-FZ.md` | focus zoom animation | preview 단계별 focus 흐름과 motion polish |

### 2.2 파일 규모

| 항목 | 수량 | 메모 |
| --- | ---: | --- |
| Archive bundle | 10 | `.plans/archive/*/ARCHIVE-*.md` 기준 |
| Markdown 파일 | 238 | 기존 원문과 요약 문서 포함 |
| PNG evidence | 30 | 주로 hero visual QA evidence |
| JSON evidence | 6 | manifest, browser QA, animation regression 요약 |

### 2.3 단계별 문서 분포

| 분류 | 수량 | 의미 |
| --- | ---: | --- |
| `archive-bundle` | 10 | 기능별 대표 archive 문서 |
| `idea-screen` | 16 | 아이디어와 screening 문서 |
| `draft-prd` | 42 | draft, PRD, review, routing metadata |
| `wireframe` | 14 | 화면 구조, navigation, component 설계 |
| `stitch` | 3 | PRD + wireframe + HTML 통합 흔적 |
| `bridge` | 3 | 개발 전달용 bridge context |
| `dev-package` | 57 | requirements, UI spec, flow, dev tasks, test cases |
| `dev-notes` | 14 | 구현 결과, verification report, migration notes |
| `improvement` | 8 | 후속 개선 요청과 option spec |
| `evidence` | 31 | screenshot, manifest, QA 결과 |
| `other` | 76 | context, decision log, architecture binding, source note 등 |

### 2.4 내부 bundle 재배치 폴더명 후보

기존 `optic-landing-page/` 같은 bundle 폴더를 나중에 내부 archive 하위로 옮길 경우, 폴더명 앞에 구현 또는 archive 완료 날짜와 전체 순번을 붙인다. 기본 규칙은 아래와 같다.

`{YYYY-MM-DD}-{NNN}-{slug}`

- `YYYY-MM-DD`: 해당 bundle의 구현 완료일 또는 archive 완료일을 사용한다. 두 값이 다르면 `ARCHIVE-*.md`에 기록된 구현 commit / closeout commit / archived 날짜를 확인해 더 정확한 구현 완료일을 선택한다.
- `NNN`: 전체 발전 순서를 나타내는 3자리 순번이다. 같은 날짜에 여러 bundle이 있으면 제품 발전 흐름과 의존 관계를 기준으로 정한다.
- `slug`: 기존 folder slug를 그대로 유지한다.

| 순서 | 기존 폴더 | 재배치 폴더명 후보 | 기준 |
| ---: | --- | --- | --- |
| 001 | `optic-landing-page` | `2026-04-02-001-optic-landing-page` | 초기 landing foundation |
| 002 | `dash-preview` | `2026-04-15-002-dash-preview` | dashboard preview 1차 확장 |
| 003 | `dash-preview-phase3` | `2026-04-22-003-dash-preview-phase3` | preview 조작감 강화 |
| 004 | `f5-ui-residue-cleanup` | `2026-04-24-004-f5-ui-residue-cleanup` | Phase A cleanup |
| 005 | `f1-landing-light-theme` | `2026-04-24-005-f1-landing-light-theme` | theme infrastructure |
| 006 | `f2-mock-schema-redesign` | `2026-04-27-006-f2-mock-schema-redesign` | mock schema 재설계 |
| 007 | `f4-layout-hit-area-realignment` | `2026-04-27-007-f4-layout-hit-area-realignment` | layout / hit-area 정렬 |
| 008 | `hero-liquid-gradient-background` | `2026-04-27-008-hero-liquid-gradient-background` | hero visual refresh 1차 |
| 009 | `hero-01-reference-hero-refresh` | `2026-04-28-009-hero-01-reference-hero-refresh` | reference 기반 hero closeout |
| 010 | `dash-preview-focus-zoom-animation` | `2026-04-28-010-dash-preview-focus-zoom-animation` | focus motion polish |

## 3. 문서 분류 기준

최종 통합 단계에서는 모든 원문을 그대로 합치지 않는다. 원문 전체를 합치면 가이드가 아니라 archive dump가 되어 읽기 어려워진다.

| 분류 | 최종 가이드 반영 방식 | 원문 보존 방식 |
| --- | --- | --- |
| 아이디어 / 문제 정의 | 왜 이 작업이 시작됐는지 1~2문단으로 요약 | 기존 `sources/ideas/` 유지 |
| 기획 / PRD | 사용자 가치, 핵심 요구사항, scope decision만 발췌 | 기존 `sources/drafts/`, PRD 문서 유지 |
| 와이어프레임 / 디자인 | 화면 구조 변화와 중요한 UX 결정만 요약 | 기존 `sources/wireframes/` 유지 |
| 개발 계획 | 구현 단위, task order, acceptance criteria만 정리 | 기존 `feature-package/02-package/` 유지 |
| 구현 기록 | 실제 반영 범위, commit, verification 핵심을 정리하고, 최종 구현결과 상세 설명으로 확장 | 기존 `03-dev-notes/` 유지 |
| 최종 구현결과 | 사용자가 보는 최종 동작, 화면 변화, 데이터 흐름, 주요 코드 위치, 검증 증거를 상세 설명 | 기존 code, dev notes, QA evidence를 근거로 링크 |
| 검증 / 리뷰 / 회고 | 통과한 검증과 남은 리스크만 표로 통합 | 기존 evidence, report 문서 유지 |
| 개선 요청 | parent-child 관계와 이후 반영 여부만 연결 | 기존 `improvements/` 유지 |

## 4. 최종 가이드 문서 추천 목차

추천 최종 산출물 경로:

`C:\Program Files (user)\mologado\apps\landing\.plans\archive\2026-04-28-optic-landing-evolution-guide\GUIDE-landing-evolution.md`

폴더명 규칙:

`{YYYY-MM-DD}-{guide-title-kebab-case}`

이번 작업의 기본 폴더명은 `2026-04-28-optic-landing-evolution-guide`로 둔다. 날짜는 계획 수립일 기준이며, 제목은 최종 guide의 역할이 바로 보이도록 영문 kebab-case로 정리한다.

추천 목차:

```md
# OPTIC Landing Evolution Guide

## 1. Guide 목적
## 2. 읽는 방법
## 3. 전체 발전 타임라인
## 4. Product Foundation: `optic-landing-page`
## 5. Dashboard Preview Foundation: `dash-preview`
## 6. Preview Interaction Hardening: `dash-preview-phase3`
## 7. Phase A Cleanup and Theme Base: `f5-ui-residue-cleanup`, `f1-landing-light-theme`
## 8. Phase B Data and Layout Refactor: `f2-mock-schema-redesign`, `f4-layout-hit-area-realignment`
## 9. Hero Visual Refresh: `hero-liquid-gradient-background`, `hero-01-reference-hero-refresh`
## 10. Focus Motion Polish: `dash-preview-focus-zoom-animation`
## 11. Final Implementation Result Detail
## 12. Planning Package Summary
## 13. Development Package Summary
## 14. Current Architecture Snapshot
## 15. Current UX Principles
## 16. Verification Evidence Index
## 17. Known Risks and Deferred Decisions
## 18. Source Archive Map
```

### 4.1 최종 구현결과 상세 설명 템플릿

최종 guide에는 각 bundle별 압축 요약 외에도, 전체 구현 결과를 사용자가 이해할 수 있는 수준으로 자세히 설명하는 장을 둔다. 이 장은 개발자가 아닌 사람도 "무엇이 최종적으로 만들어졌는지"를 확인할 수 있어야 하고, 개발자는 "어느 코드와 검증 결과를 보면 되는지" 바로 따라갈 수 있어야 한다.

각 주요 영역은 아래 템플릿을 따른다.

| 항목 | 설명 |
| --- | --- |
| 최종 사용자 경험 | 화면에서 사용자가 실제로 보는 변화와 동작 |
| 핵심 구현 결과 | 최종적으로 완성된 기능, 컴포넌트, 상태, motion, visual behavior |
| 주요 코드 위치 | 관련 `src/` 파일과 책임 |
| 데이터 / 상태 흐름 | mock data, preview step, state machine, animation trigger 등 |
| 기획 대비 반영 결과 | PRD, wireframe, bridge 요구사항 중 반영된 내용 |
| 의도적 차이 | 기획과 다르게 구현했거나 후속으로 미룬 내용 |
| 검증 증거 | test, build, screenshot, QA report, dev verification 링크 |
| 남은 리스크 | 운영, UX, 유지보수 관점에서 남은 점 |

### 4.2 기획 / 개발 문서 패키지 구성

최종 폴더는 단일 guide만 담는 폴더가 아니라, 최종 guide를 중심으로 한 문서 패키지로 취급한다. 단, 사용자가 읽는 대표 문서는 `GUIDE-landing-evolution.md` 하나로 유지한다.

```text
.plans/archive/2026-04-28-optic-landing-evolution-guide/
  00-consolidation-plan.md
  GUIDE-landing-evolution.md
```

`GUIDE-landing-evolution.md` 내부에는 아래 두 패키지 관점을 모두 포함한다.

| 패키지 관점 | 포함 내용 | 목적 |
| --- | --- | --- |
| 기획 문서 패키지 | 문제 정의, 사용자 가치, PRD 결정, UX 흐름, acceptance criteria, 발전 타임라인 | 왜 이 기능들이 필요했고 어떤 순서로 결정됐는지 설명 |
| 개발 문서 패키지 | 최종 구현결과, 코드 위치, 데이터/상태 흐름, 구현 trade-off, 검증 증거, 남은 리스크 | 실제로 무엇이 구현됐고 어떻게 검증됐는지 설명 |

필요하면 추후 `planning-package.md`, `development-package.md`를 support artifact로 분리할 수 있지만, 1차 산출물은 단일 guide 문서 안에 두 패키지 관점을 함께 담는다.

## 5. 기존 문서 내부 아카이브 구조 제안

기존 bundle은 이미 archive 상태이므로, 바로 대규모 이동하지 않는 것을 1순위로 추천한다. 대신 최종 guide는 `.plans/archive/{날짜}-{제목}/` 전용 폴더에 둔다. 이렇게 하면 기존 archive bundle을 건드리지 않으면서도 최종 guide 산출물의 경계가 명확해진다.

### 5.1 추천안 A: 날짜-제목 guide folder 방식

추천도: 높음

```text
.plans/archive/
  2026-04-28-optic-landing-evolution-guide/
    INDEX.md
    00-consolidation-plan.md
    GUIDE-landing-evolution.md
  index.md
  optic-landing-page/
  dash-preview/
  ...
```

장점:
- 기존 링크와 git history가 깨지지 않는다.
- `index.md`의 bundle 링크를 거의 유지할 수 있다.
- 최종 guide 산출물이 날짜와 제목 기준으로 분리되어 찾기 쉽다.
- 실제 통합 작업의 리스크가 낮다.

단점:
- 최종 guide 폴더 내부에는 단일 guide 문서만 두는 원칙을 지켜야 한다.
- 날짜가 들어가므로 guide를 여러 번 재작성할 경우 최신 폴더 판단 기준이 필요하다.

### 5.2 추천안 B: 내부 archive 하위 폴더 이동

추천도: 높음, 단 guide 본문 확정 후 별도 단계로 진행

```text
.plans/archive/
  2026-04-28-optic-landing-evolution-guide/
    INDEX.md
    00-consolidation-plan.md
    GUIDE-landing-evolution.md
    internal-bundles/
      2026-04-02-001-optic-landing-page/
      2026-04-15-002-dash-preview/
      2026-04-22-003-dash-preview-phase3/
      ...
  index.md
```

장점:
- 최종 guide가 archive 루트의 대표 진입점이 된다.
- 기존 bundle이 "source archive" 역할로 명확히 분리된다.
- 기존 bundle이 구현된 순서대로 정렬되어 folder view만 봐도 발전 흐름을 읽을 수 있다.

단점:
- `index.md`, 기존 문서 내부 상대 링크, 외부 참조 링크를 모두 갱신해야 한다.
- 이미지 evidence와 JSON manifest 경로가 깨질 수 있다.
- `git mv` 단위가 커져 review 비용이 증가한다.

### 5.3 추천안 C: guide package 방식

추천도: 낮음

```text
.plans/archive/
  2026-04-28-optic-landing-evolution-guide/
    00-consolidation-plan.md
    GUIDE-landing-evolution.md
    source-map.md
    verification-index.md
    planning-package.md
    development-package.md
  internal-bundles/
    2026-04-02-001-optic-landing-page/
    2026-04-15-002-dash-preview/
    ...
```

장점:
- guide, source map, evidence index를 분리해 확장하기 좋다.
- 최종 구현결과 상세 설명을 `development-package.md`로 분리할 수 있어 개발자용 참고성이 높다.

단점:
- 사용자가 요청한 "하나의 문서" 목표와 약간 어긋난다.
- 단일 최종 가이드보다 탐색 진입점이 늘어난다.

## 6. 단계별 실행 계획

### Phase 0. 승인 전 준비

1. 이 계획서에서 최종 guide 경로와 내부 archive 방식 추천안을 확정한다.
2. 사용자 요청에 따라 추천안 A, 즉 날짜-제목 guide folder 방식을 기본값으로 둔다.
3. `needs-user-input`: 최종 guide 제목을 `OPTIC Landing Evolution Guide`로 둘지 확인한다.

### Phase 1. Guide skeleton 작성

1. `.plans/archive/2026-04-28-optic-landing-evolution-guide/` 폴더를 사용한다. 폴더가 없으면 새로 만든다.
2. `.plans/archive/2026-04-28-optic-landing-evolution-guide/GUIDE-landing-evolution.md`를 새로 만든다.
3. 목차와 타임라인 표만 먼저 작성한다.
4. 각 bundle의 `ARCHIVE-*.md`를 source of truth로 링크한다.
5. 원문 `sources/` 문서는 직접 합치지 않고 필요한 결정만 요약한다.

검증:
- 모든 bundle이 source map에 1회 이상 등장하는지 확인한다.
- guide가 문서 발전 순서로 읽히는지 self-review한다.

### Phase 2. Bundle별 내용 압축

1. 각 bundle을 "문제 -> 결정 -> 구현 -> 검증 -> 남은 리스크" 형식으로 5~10문장 안에 압축한다.
2. 중복되는 PRD 문구, task checklist, test case 원문은 guide에 직접 복사하지 않는다.
3. product, dashboard preview, hero 영역을 독립 장으로 묶는다.
4. 각 영역마다 기획 문서 패키지 관점과 개발 문서 패키지 관점을 분리해 작성한다.
5. 최종 구현결과는 별도 "Final Implementation Result Detail" 장에서 다시 자세히 설명한다.

검증:
- 같은 사실이 여러 장에 반복되지 않는지 확인한다.
- 최종 guide만 읽어도 현재 제품 상태를 이해할 수 있는지 확인한다.
- 기획 결정과 최종 구현결과가 서로 추적 가능한지 확인한다.

### Phase 2A. 최종 구현결과 상세 설명 작성

1. 각 주요 구현 영역을 `Product Foundation`, `Dashboard Preview`, `Hero Visual`, `Focus Motion`으로 묶는다.
2. 각 영역에 대해 최종 사용자 경험, 핵심 구현 결과, 주요 코드 위치, 데이터/상태 흐름, 기획 대비 반영 결과, 의도적 차이, 검증 증거, 남은 리스크를 작성한다.
3. 구현 설명은 코드 목록만 나열하지 않고, "사용자가 무엇을 보게 되는지 -> 그 동작이 어떤 코드와 데이터로 구성되는지 -> 무엇으로 검증했는지" 순서로 쓴다.
4. 개발 문서 패키지 관점에서는 `src/` 경로, component 책임, state/motion/data 흐름, QA evidence를 우선 연결한다.
5. 기획 문서 패키지 관점에서는 PRD, wireframe, bridge decision과 실제 구현 결과의 연결을 우선 설명한다.

검증:
- 각 구현 영역에 사용자 관점 설명과 개발자 관점 설명이 모두 있는지 확인한다.
- `src/` 경로와 archive evidence 링크가 실제 존재하는지 확인한다.
- 기획 요구사항과 구현 결과 사이에 누락 또는 의도적 차이가 있으면 `Known Risks and Deferred Decisions`에 남긴다.

### Phase 3. Evidence index 정리

1. screenshot, JSON manifest, verification report를 "증거 목록"으로만 연결한다.
2. 이미지와 JSON 내용을 guide에 직접 붙이지 않는다.
3. `hero-liquid-gradient-background`, `hero-01-reference-hero-refresh`처럼 evidence가 많은 bundle은 대표 evidence만 3~5개로 축약한다.

검증:
- evidence 링크가 존재하는지 확인한다.
- 브라우저 QA, reduced motion, desktop/mobile 같은 핵심 검증 축이 빠지지 않았는지 확인한다.

### Phase 4. 내부 archive 재배치 여부 결정

추천안 A를 선택하면 기존 archive bundle 이동 없이 종료한다. 이 경우 새로 생기는 것은 날짜-제목 guide folder와 그 안의 최종 guide 문서뿐이다.

추천안 B 또는 C를 선택하면 아래 순서로 진행한다.

1. `git status --short`로 사용자 변경과 작업 범위를 확인한다.
2. 각 bundle의 구현 완료일 또는 archive 완료일을 확인한다.
3. `YYYY-MM-DD-NNN-slug` 규칙으로 새 폴더명을 확정한다.
4. `git mv`로 bundle 폴더를 새 내부 archive 위치로 이동한다.
5. `.plans/archive/index.md` 링크를 갱신한다.
6. package-local `INDEX.md`를 만들고 internal bundle map을 옮긴다.
7. guide의 source map 링크를 새 위치 기준으로 갱신한다.
7. 상대 링크와 evidence 파일 경로를 검증한다.

검증:
- 이동 전후 파일 수가 일치하는지 확인한다.
- `internal-bundles/` 폴더명이 날짜와 순번 기준으로 정렬되는지 확인한다.
- `Select-String` 또는 링크 스캔으로 깨진 archive 링크를 찾는다.
- 큰 이동이므로 commit은 guide 작성 commit과 archive 재배치 commit을 분리한다.

### Phase 5. 최종 review와 closeout

1. guide 내용이 "기획 -> 개발 -> 검증" 순서로 흐르는지 검토한다.
2. 문서가 현재 코드 구조와 충돌하지 않는지 대표 경로를 확인한다.
3. 남은 리스크와 의도적 생략을 마지막 장에 남긴다.

검증:
- Markdown link scan
- `git diff --check`
- 최종 guide self-review
- 필요 시 사용자 리뷰 후 accepted feedback만 반영

## 7. 검증 방법

| 검증 | 목적 | 실행 시점 |
| --- | --- | --- |
| `git status --short` | 기존 사용자 변경과 작업 범위 확인 | 매 phase 시작/종료 |
| 파일 수 비교 | 내부 archive 이동 시 누락 방지 | Phase 4 |
| Markdown link scan | 상대 링크, evidence 링크 깨짐 확인 | Phase 3 이후 |
| 구현결과 추적성 점검 | 기획 요구사항과 실제 구현 설명이 연결되는지 확인 | Phase 2A 이후 |
| `git diff --check` | trailing whitespace, patch 품질 확인 | 최종 |
| self-review | 중복, 누락, chronology 오류 확인 | 각 phase 종료 |

## 8. 리스크와 확인 필요 사항

| 항목 | Severity | Confidence | Action | 대응 |
| --- | --- | --- | --- | --- |
| 기존 bundle 이동 시 링크 깨짐 | high | likely | needs-user-input | 날짜-제목 guide folder로 시작하고, 기존 bundle 이동은 별도 승인 후 진행 |
| guide가 너무 길어져 archive dump가 될 위험 | medium | confirmed | queued | 원문 복사 금지, bundle별 요약 원칙 적용 |
| 최종 구현결과 설명이 얕아질 위험 | high | likely | queued | Phase 2A 템플릿으로 사용자 경험, 코드, 데이터, 검증을 모두 작성 |
| evidence 파일 경로 누락 | medium | likely | needs-verification | Phase 3에서 source map과 evidence index 분리 |
| 날짜-제목 폴더가 늘어날 경우 최신본 혼동 | low | likely | queued | `index.md`에서 현재 guide 폴더를 명시 |
| 구현 완료일과 archive 완료일 불일치 | medium | likely | needs-verification | 이동 전 `ARCHIVE-*.md`의 commit/date 메타데이터를 확인 |
| 일부 PowerShell 출력의 한글 렌더링 깨짐 | low | tentative | needs-verification | 실제 파일 encoding과 Markdown preview에서 재확인 |
| `docs/` untracked 변경 존재 | low | confirmed | queued | 이번 작업 범위 밖으로 두고 건드리지 않음 |

## 9. 추천 결정

현재는 단계적으로 진행하는 것이 가장 안전하다.

이유:
- 1단계는 추천안 A처럼 날짜-제목 guide folder를 만들고 최종 guide를 작성한다.
- 2단계는 추천안 B처럼 기존 bundle을 `internal-bundles/YYYY-MM-DD-NNN-slug/`로 이동한다.
- 이렇게 하면 최종 guide 산출물과 기존 원문 archive가 분리되고, 폴더 목록만 봐도 구현된 순서를 읽을 수 있다.
- 내부 archive 재배치는 링크 검증과 review 비용이 크므로, guide 본문이 확정된 뒤 별도 commit으로 분리하는 편이 안전하다.

## 10. 다음 실행 요청 예시

```md
이 계획서의 추천안 A로 진행해주세요.
`.plans/archive/2026-04-28-optic-landing-evolution-guide/GUIDE-landing-evolution.md`를 새로 만들고,
기존 archive bundle은 우선 이동하지 말고 source map 링크로만 연결해주세요.
최종 guide 안에는 기획 문서 패키지 관점과 개발 문서 패키지 관점을 모두 포함하고,
특히 `Final Implementation Result Detail` 장에서 최종 구현결과를 상세히 설명해주세요.

그 다음 별도 단계에서 기존 bundle을 `.plans/archive/2026-04-28-optic-landing-evolution-guide/internal-bundles/YYYY-MM-DD-NNN-slug/` 규칙으로 이동하고,
`index.md`와 guide source map 링크를 갱신해주세요.
```
