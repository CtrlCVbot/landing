# Archive Index

> Role: global registry for `.plans/archive`.
> Package-level details live inside each package folder's `INDEX.md`.

## Active Archive Packages

| Package | Status | Purpose | Package Index | Main Guide | Internal Bundles |
| --- | --- | --- | --- | --- | --- |
| `2026-04-28-optic-landing-evolution-guide` | active | OPTIC landing planning/development evolution guide | [INDEX](2026-04-28-optic-landing-evolution-guide/INDEX.md) | [GUIDE](2026-04-28-optic-landing-evolution-guide/GUIDE-landing-evolution.md) | [internal-bundles](2026-04-28-optic-landing-evolution-guide/internal-bundles/) |

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

1. Create `.plans/archive/YYYY-MM-DD-title/`.
2. Put `INDEX.md`, the final guide, supporting plan docs, and `internal-bundles/` inside that package folder.
3. Add one row to `Active Archive Packages`.
4. Keep package-specific source maps inside the package `INDEX.md`.
