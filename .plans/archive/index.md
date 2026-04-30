# Archive Index

> Role: global registry for `.plans/archive`.
> Package-level details live inside each package folder's `INDEX.md`.

## Active Archive Packages

| Package | Status | Purpose | Package Index | Main Guide | Internal Bundles |
| --- | --- | --- | --- | --- | --- |
| `2026-04-28-optic-landing-evolution-guide` | active | OPTIC landing planning/development evolution guide | [INDEX](../../docs/reports/2026-04-28-optic-landing-evolution-guide/INDEX.md) | [GUIDE](../../docs/reports/2026-04-28-optic-landing-evolution-guide/GUIDE-landing-evolution.md) | [internal-bundles](../../docs/reports/2026-04-28-optic-landing-evolution-guide/internal-bundles/) |

## Feature Archives

| Slug | Status | Purpose | Bundle | Sources |
| --- | --- | --- | --- | --- |
| `f4-workflow-motion-state` | archived | OPTIC 업무 흐름 애니메이션과 상태 표현 | [ARCHIVE-F4](./f4-workflow-motion-state/ARCHIVE-F4.md) | [sources](./f4-workflow-motion-state/sources/) |
| `f3-workflow-manual-section` | archived | OPTIC 업무 매뉴얼형 스크롤 섹션 MVP | [ARCHIVE-F3](./f3-workflow-manual-section/ARCHIVE-F3.md) | [sources](./f3-workflow-manual-section/sources/) |
| `f2-optic-copy-product-lineup` | archived | OPTIC 카피와 제품 라인업 정리 | [ARCHIVE-F2](./f2-optic-copy-product-lineup/ARCHIVE-F2.md) | [sources](./f2-optic-copy-product-lineup/sources/) |
| `f1-optic-brand-cta` | archived | OPTIC 브랜드, 로고, CTA 최소 반영 | [ARCHIVE-F1](./f1-optic-brand-cta/ARCHIVE-F1.md) | [sources](./f1-optic-brand-cta/sources/) |

## Archive Management Rules

| Rule | Meaning |
| --- | --- |
| Root index stays global | This file lists archive packages only. It should not duplicate every package's internal bundle map. |
| Package owns its source map | Each archive package keeps its own `INDEX.md`, guide, plan, and `internal-bundles/` together. |
| Bundle folders keep order prefix | Historical bundles use `YYYY-MM-DD-NNN-slug` so folder sorting follows implementation order. |
| Original docs remain preserved | Source bundle documents stay in `internal-bundles/`; package guides summarize the reading path. |

## Current Package Layout

```text
.plans/archive/
  index.md

docs/reports/
  2026-04-28-optic-landing-evolution-guide/
    INDEX.md
    GUIDE-landing-evolution.md
    00-consolidation-plan.md
    internal-bundles/
      2026-04-02-001-optic-landing-page/
      2026-04-15-002-dash-preview/
      ...
```

## Add New Archive Package

1. Create `docs/reports/YYYY-MM-DD-title/` for report-style archive packages.
2. Put `INDEX.md`, the final guide, supporting plan docs, and `internal-bundles/` inside that package folder.
3. Add one row to `Active Archive Packages`.
4. Keep package-specific source maps inside the package `INDEX.md`.
