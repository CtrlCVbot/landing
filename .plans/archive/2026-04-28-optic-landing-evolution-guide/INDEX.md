# OPTIC Landing Evolution Package Index

> Role: package-local index for `2026-04-28-optic-landing-evolution-guide`.
> Use this file when you need the guide, execution plan, source bundle map, or verification evidence entry points.

## Package Contents

| Item | Role | Link |
| --- | --- | --- |
| Final guide | One readable guide for planning and development evolution | [GUIDE-landing-evolution.md](GUIDE-landing-evolution.md) |
| Consolidation plan | Execution plan and migration rules used to build this package | [00-consolidation-plan.md](00-consolidation-plan.md) |
| Internal bundles | Original archived planning/development source bundles | [internal-bundles/](internal-bundles/) |
| Root archive index | Global registry for all archive packages | [../index.md](../index.md) |

## Reading Order

| Step | Read | Purpose |
| ---: | --- | --- |
| 1 | [GUIDE-landing-evolution.md](GUIDE-landing-evolution.md) | Understand the end-to-end product and implementation evolution. |
| 2 | `Final Implementation Result Detail` in the guide | Check the final user-facing result and implementation breakdown. |
| 3 | `Planning Package Summary` in the guide | Review how planning artifacts evolved. |
| 4 | `Development Package Summary` in the guide | Review code areas, architecture, and verification evidence. |
| 5 | Internal bundle map below | Jump to a specific original archive bundle. |

## Internal Bundle Map

| Order | Key | Bundle | Title | Category | Archived | Archive |
| ---: | --- | --- | --- | --- | --- | --- |
| 001 | OLP | `2026-04-02-001-optic-landing-page` | OPTIC landing page foundation | Lite | 2026-04-02 | [ARCHIVE-OLP](internal-bundles/2026-04-02-001-optic-landing-page/ARCHIVE-OLP.md) |
| 002 | DASH | `2026-04-15-002-dash-preview` | Dashboard Preview foundation | Standard | 2026-04-15 | [ARCHIVE-DASH](internal-bundles/2026-04-15-002-dash-preview/ARCHIVE-DASH.md) |
| 003 | DASH3 | `2026-04-22-003-dash-preview-phase3` | Dashboard Preview Phase 3 pixel-perfect preview | Standard | 2026-04-22 | [ARCHIVE-DASH3](internal-bundles/2026-04-22-003-dash-preview-phase3/ARCHIVE-DASH3.md) |
| 004 | F5 | `2026-04-24-004-f5-ui-residue-cleanup` | UI residue cleanup | Lite | 2026-04-24 | [ARCHIVE-F5](internal-bundles/2026-04-24-004-f5-ui-residue-cleanup/ARCHIVE-F5.md) |
| 005 | F1 | `2026-04-24-005-f1-landing-light-theme` | Landing light theme infrastructure | Standard | 2026-04-24 | [ARCHIVE-F1](internal-bundles/2026-04-24-005-f1-landing-light-theme/ARCHIVE-F1.md) |
| 006 | F2 | `2026-04-27-006-f2-mock-schema-redesign` | Mock schema redesign | Standard | 2026-04-27 | [ARCHIVE-F2](internal-bundles/2026-04-27-006-f2-mock-schema-redesign/ARCHIVE-F2.md) |
| 007 | F4 | `2026-04-27-007-f4-layout-hit-area-realignment` | Layout and hit-area realignment | Standard | 2026-04-27 | [ARCHIVE-F4](internal-bundles/2026-04-27-007-f4-layout-hit-area-realignment/ARCHIVE-F4.md) |
| 008 | HLG | `2026-04-27-008-hero-liquid-gradient-background` | Hero liquid gradient background | Lite | 2026-04-27 | [ARCHIVE-HLG](internal-bundles/2026-04-27-008-hero-liquid-gradient-background/ARCHIVE-HLG.md) |
| 009 | HR01 | `2026-04-28-009-hero-01-reference-hero-refresh` | hero-01 reference Hero refresh | Standard | 2026-04-28 | [ARCHIVE-HR01](internal-bundles/2026-04-28-009-hero-01-reference-hero-refresh/ARCHIVE-HR01.md) |
| 010 | FZ | `2026-04-28-010-dash-preview-focus-zoom-animation` | Dash Preview focus zoom animation | Lite | 2026-04-28 | [ARCHIVE-FZ](internal-bundles/2026-04-28-010-dash-preview-focus-zoom-animation/ARCHIVE-FZ.md) |

## Evidence Entry Points

| Area | Start Here |
| --- | --- |
| Dashboard preview foundation | [DASH dev output summary](internal-bundles/2026-04-15-002-dash-preview/sources/feature-package/03-dev-notes/dev-output-summary.md) |
| Dashboard preview phase 3 | [DASH3 verification report](internal-bundles/2026-04-22-003-dash-preview-phase3/sources/feature-package/03-dev-notes/dev-verification-report.md) |
| Light theme | [F1 verification report](internal-bundles/2026-04-24-005-f1-landing-light-theme/sources/feature-package/03-dev-notes/dev-verification-report.md) |
| Layout and hit-area | [F4 verification report](internal-bundles/2026-04-27-007-f4-layout-hit-area-realignment/sources/feature-package/03-dev-notes/dev-verification-report.md) |
| Hero liquid gradient | [HLG dev output summary](internal-bundles/2026-04-27-008-hero-liquid-gradient-background/sources/feature-package/03-dev-notes/dev-output-summary.md) |
| hero-01 refresh | [HR01 dev output summary](internal-bundles/2026-04-28-009-hero-01-reference-hero-refresh/sources/feature-package/hero-01-reference-hero-refresh/03-dev-notes/dev-output-summary.md) |
| Focus zoom animation | [FZ dev output summary](internal-bundles/2026-04-28-010-dash-preview-focus-zoom-animation/sources/feature-package/03-dev-notes/dev-output-summary.md) |

## Maintenance Notes

| Topic | Rule |
| --- | --- |
| Package-local links | Links from this file should stay relative to this package folder. |
| Root index | Root `../index.md` should only list archive packages, not every internal bundle. |
| Source preservation | Do not rewrite old source bundle docs just to normalize historical paths. |
| New bundle | Add new bundles under `internal-bundles/YYYY-MM-DD-NNN-slug/` and add one row to `Internal Bundle Map`. |
