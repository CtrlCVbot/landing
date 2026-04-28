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
  "reference": "../../../.references/design/hero-01",
  "reference_files": [
    "../../../.references/design/hero-01/hero.html",
    "../../../.references/design/hero-01/global.css"
  ],
  "prd_required": true,
  "wireframe_required": true,
  "bridge_required": true,
  "epic_binding": null,
  "entryPoint": "plan-prd",
  "draft": "01-draft.md",
  "prd": "02-prd.md",
  "review": "03-prd-review.md",
  "feature_package": "../../features/active/hero-01-reference-hero-refresh/00-context/00-index.md",
  "dev_package": "../../features/active/hero-01-reference-hero-refresh/02-package/00-overview.md",
  "bridge_context": "../../features/active/hero-01-reference-hero-refresh/00-context/00-index.md",
  "architecture_binding": "../../features/active/hero-01-reference-hero-refresh/00-context/06-architecture-binding.md",
  "triggers_matched": [
    "reference-copy-fidelity",
    "light-dark-theme-token-impact",
    "hero-first-viewport-conversion-risk",
    "motion-and-reduced-motion-qa",
    "possible-canvas-or-webgl-implementation"
  ],
  "source_feature": "hero-liquid-gradient-background",
  "source_archive": "../../archive/hero-liquid-gradient-background/ARCHIVE-HLG.md",
  "source_idea": "../../ideas/20-approved/IDEA-20260427-004.md",
  "screening": "../../ideas/20-approved/SCREENING-20260427-004.md",
  "implementation_boundary": "Do not implement during plan-draft or plan-prd. Decide CSS-only, Canvas 2D, or WebGL route in PRD before dev handoff. Reference controls, color adjuster, export UI, and custom cursor are out of production scope.",
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
  "review_status": "PASS, follow-up resolved",
  "wireframe_status": "draft-reviewed",
  "bridge_status": "completed",
  "dev_status": "completed",
  "implementation_commit": "c06cd06",
  "wireframes": {
    "screens": "../../wireframes/hero-01-reference-hero-refresh/screens.md",
    "navigation": "../../wireframes/hero-01-reference-hero-refresh/navigation.md",
    "components": "../../wireframes/hero-01-reference-hero-refresh/components.md",
    "review": "../../wireframes/hero-01-reference-hero-refresh/04-wireframe-review.md"
  },
  "next": "plan-archive optional",
  "next_command": "/plan-archive hero-01-reference-hero-refresh",
  "fallback_next": "/plan-improve hero-01-reference-hero-refresh \"<요청명>\" if a new improvement request appears"
}
```
