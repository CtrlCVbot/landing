# Routing Metadata — hero-01-reference-hero-refresh

```json
{
  "slug": "hero-01-reference-hero-refresh",
  "idea": "IDEA-20260427-004",
  "category": "Standard",
  "scenario": "C",
  "feature_type": "copy-dev hybrid",
  "hybrid": true,
  "copy_needed": true,
  "reference_needed": true,
  "reference": "../../../../../.references/design/hero-01",
  "reference_files": [
    "../../../../../.references/design/hero-01/hero.html",
    "../../../../../.references/design/hero-01/global.css"
  ],
  "prd_required": true,
  "wireframe_required": true,
  "bridge_required": true,
  "epic_binding": null,
  "entryPoint": "dev-run",
  "draft": "../../../../drafts/hero-01-reference-hero-refresh/01-draft.md",
  "prd": "../../../../drafts/hero-01-reference-hero-refresh/02-prd.md",
  "review": "../../../../drafts/hero-01-reference-hero-refresh/03-prd-review.md",
  "wireframes": {
    "screens": "../../../../wireframes/hero-01-reference-hero-refresh/screens.md",
    "navigation": "../../../../wireframes/hero-01-reference-hero-refresh/navigation.md",
    "components": "../../../../wireframes/hero-01-reference-hero-refresh/components.md",
    "review": "../../../../wireframes/hero-01-reference-hero-refresh/04-wireframe-review.md"
  },
  "feature_package": "00-index.md",
  "dev_package": "../02-package/00-overview.md",
  "architecture_binding": "06-architecture-binding.md",
  "triggers_matched": [
    "reference-copy-fidelity",
    "light-dark-theme-token-impact",
    "hero-first-viewport-conversion-risk",
    "motion-and-reduced-motion-qa",
    "possible-canvas-or-webgl-implementation"
  ],
  "source_feature": "hero-liquid-gradient-background",
  "source_archive": "../../../../archive/hero-liquid-gradient-background/ARCHIVE-HLG.md",
  "implementation_boundary": "Implement only after /dev-run. Keep current product copy, CTA paths, and DashboardPreview behavior. Reference controls, color adjuster, export UI, custom cursor, and footer attribution are excluded from production.",
  "recommended_implementation_route": "Canvas 2D first-pass candidate with CSS fallback; WebGL/Three.js requires explicit dependency and bundle-size gate.",
  "copy_fidelity_scope": [
    "full-bleed liquid field",
    "central first-viewport hierarchy",
    "multi-blob color depth",
    "subtle desktop pointer-reactive field"
  ],
  "theme_adaptation_scope": [
    "light mode palette",
    "dark mode palette",
    "contrast veil",
    "reduced-motion fallback"
  ],
  "excluded_reference_elements": [
    "color scheme buttons",
    "color adjuster panel",
    "export palette UI",
    "custom cursor",
    "footer attribution UI"
  ],
  "draft_status": "completed",
  "prd_status": "draft-reviewed",
  "wireframe_status": "draft-reviewed",
  "bridge_status": "completed",
  "review_status": "PASS with noted follow-up",
  "next": "dev-run",
  "next_command": "/dev-run .plans/features/active/hero-01-reference-hero-refresh",
  "fallback_next": "revise-wireframe or plan-design if visual direction changes before implementation"
}
```
