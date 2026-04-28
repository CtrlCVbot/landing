# OPTIC 랜딩 진화 패키지 인덱스

> 역할: `2026-04-28-optic-landing-evolution-guide` 패키지 전용 목차입니다.
> 가이드, 실행 계획, 원본 번들 지도, 검증 근거를 찾을 때 이 파일에서 시작합니다.

## 패키지 구성

| 항목 | 역할 | 링크 |
| --- | --- | --- |
| 최종 가이드 | 기획과 개발 진화 과정을 한 번에 읽을 수 있는 종합 가이드 | [GUIDE-landing-evolution.md](GUIDE-landing-evolution.md) |
| 통합 계획 | 이 패키지를 만들 때 사용한 실행 계획과 문서 이관 규칙 | [00-consolidation-plan.md](00-consolidation-plan.md) |
| `claude-kit` 피드백 | `plan-archive` 패키지 모드 개선 피드백 | [PLAN-ARCHIVE-FEEDBACK.md](PLAN-ARCHIVE-FEEDBACK.md) |
| 최종 프롬프트 패키지 | OPTIC/OPTICS 브랜드 v1.0과 로고 자산 가이드를 반영한 랜딩 개선 계획 | [improvements/final-prompt-package/](improvements/final-prompt-package/) |
| 내부 번들 | 이전 기획/개발 산출물을 보존한 원본 아카이브 번들 | [internal-bundles/](internal-bundles/) |
| 루트 아카이브 인덱스 | 전체 아카이브 패키지를 모아 보는 전역 목록 | [../index.md](../index.md) |

## 읽는 순서

| 순서 | 읽을 문서 | 목적 |
| ---: | --- | --- |
| 1 | [GUIDE-landing-evolution.md](GUIDE-landing-evolution.md) | 제품과 구현이 어떻게 발전했는지 전체 흐름을 파악합니다. |
| 2 | 최종 구현 결과 상세 섹션 | 사용자에게 보이는 최종 결과와 구현 구성을 확인합니다. |
| 3 | 기획 패키지 요약 섹션 | 기획 산출물이 어떤 방향으로 바뀌었는지 확인합니다. |
| 4 | 개발 패키지 요약 섹션 | 코드 영역, 구조, 검증 근거를 확인합니다. |
| 5 | 아래 내부 번들 지도 | 특정 원본 아카이브 번들로 바로 이동합니다. |

## 내부 번들 지도

| 순서 | 키 | 번들 | 제목 | 유형 | 아카이브일 | 링크 |
| ---: | --- | --- | --- | --- | --- | --- |
| 001 | OLP | `2026-04-02-001-optic-landing-page` | OPTIC 랜딩 페이지 기반 작업 | Lite | 2026-04-02 | [ARCHIVE-OLP](internal-bundles/2026-04-02-001-optic-landing-page/ARCHIVE-OLP.md) |
| 002 | DASH | `2026-04-15-002-dash-preview` | 대시보드 프리뷰 기반 작업 | Standard | 2026-04-15 | [ARCHIVE-DASH](internal-bundles/2026-04-15-002-dash-preview/ARCHIVE-DASH.md) |
| 003 | DASH3 | `2026-04-22-003-dash-preview-phase3` | 대시보드 프리뷰 Phase 3 픽셀 정밀도 개선 | Standard | 2026-04-22 | [ARCHIVE-DASH3](internal-bundles/2026-04-22-003-dash-preview-phase3/ARCHIVE-DASH3.md) |
| 004 | F5 | `2026-04-24-004-f5-ui-residue-cleanup` | UI 잔여 요소 정리 | Lite | 2026-04-24 | [ARCHIVE-F5](internal-bundles/2026-04-24-004-f5-ui-residue-cleanup/ARCHIVE-F5.md) |
| 005 | F1 | `2026-04-24-005-f1-landing-light-theme` | 랜딩 라이트 테마 기반 작업 | Standard | 2026-04-24 | [ARCHIVE-F1](internal-bundles/2026-04-24-005-f1-landing-light-theme/ARCHIVE-F1.md) |
| 006 | F2 | `2026-04-27-006-f2-mock-schema-redesign` | 목업 스키마 재설계 | Standard | 2026-04-27 | [ARCHIVE-F2](internal-bundles/2026-04-27-006-f2-mock-schema-redesign/ARCHIVE-F2.md) |
| 007 | F4 | `2026-04-27-007-f4-layout-hit-area-realignment` | 레이아웃과 클릭 영역 재정렬 | Standard | 2026-04-27 | [ARCHIVE-F4](internal-bundles/2026-04-27-007-f4-layout-hit-area-realignment/ARCHIVE-F4.md) |
| 008 | HLG | `2026-04-27-008-hero-liquid-gradient-background` | Hero 리퀴드 그라디언트 배경 | Lite | 2026-04-27 | [ARCHIVE-HLG](internal-bundles/2026-04-27-008-hero-liquid-gradient-background/ARCHIVE-HLG.md) |
| 009 | HR01 | `2026-04-28-009-hero-01-reference-hero-refresh` | `hero-01` 레퍼런스 기반 Hero 새로고침 | Standard | 2026-04-28 | [ARCHIVE-HR01](internal-bundles/2026-04-28-009-hero-01-reference-hero-refresh/ARCHIVE-HR01.md) |
| 010 | FZ | `2026-04-28-010-dash-preview-focus-zoom-animation` | 대시보드 프리뷰 포커스 줌 애니메이션 | Lite | 2026-04-28 | [ARCHIVE-FZ](internal-bundles/2026-04-28-010-dash-preview-focus-zoom-animation/ARCHIVE-FZ.md) |

## 검증 근거 진입점

| 영역 | 먼저 볼 문서 |
| --- | --- |
| 대시보드 프리뷰 기반 작업 | [DASH 개발 산출 요약](internal-bundles/2026-04-15-002-dash-preview/sources/feature-package/03-dev-notes/dev-output-summary.md) |
| 대시보드 프리뷰 Phase 3 | [DASH3 검증 리포트](internal-bundles/2026-04-22-003-dash-preview-phase3/sources/feature-package/03-dev-notes/dev-verification-report.md) |
| 라이트 테마 | [F1 검증 리포트](internal-bundles/2026-04-24-005-f1-landing-light-theme/sources/feature-package/03-dev-notes/dev-verification-report.md) |
| 레이아웃과 클릭 영역 | [F4 검증 리포트](internal-bundles/2026-04-27-007-f4-layout-hit-area-realignment/sources/feature-package/03-dev-notes/dev-verification-report.md) |
| Hero 리퀴드 그라디언트 | [HLG 개발 산출 요약](internal-bundles/2026-04-27-008-hero-liquid-gradient-background/sources/feature-package/03-dev-notes/dev-output-summary.md) |
| `hero-01` 새로고침 | [HR01 개발 산출 요약](internal-bundles/2026-04-28-009-hero-01-reference-hero-refresh/sources/feature-package/hero-01-reference-hero-refresh/03-dev-notes/dev-output-summary.md) |
| 포커스 줌 애니메이션 | [FZ 개발 산출 요약](internal-bundles/2026-04-28-010-dash-preview-focus-zoom-animation/sources/feature-package/03-dev-notes/dev-output-summary.md) |

## 유지보수 메모

| 주제 | 규칙 |
| --- | --- |
| 패키지 내부 링크 | 이 파일의 링크는 이 패키지 폴더 기준 상대 경로를 유지합니다. |
| 루트 인덱스 | 루트 `../index.md`에는 모든 내부 번들이 아니라 아카이브 패키지만 나열합니다. |
| 원본 보존 | 과거 원본 번들 문서는 경로 표준화만을 이유로 다시 쓰지 않습니다. |
| 새 번들 추가 | 새 번들은 `internal-bundles/YYYY-MM-DD-NNN-slug/` 아래에 추가하고, 내부 번들 지도에 한 줄을 추가합니다. |
