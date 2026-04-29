# Routing Metadata: f2-optic-copy-product-lineup

```json
{
  "schema_version": "1.0",
  "slug": "f2-optic-copy-product-lineup",
  "idea": "IDEA-20260429-001",
  "epic": "EPIC-20260428-001",
  "category": "Standard",
  "scenario": "A",
  "feature_type": "dev",
  "hybrid": false,
  "copy_needed": false,
  "reference_needed": false,
  "prd_required": true,
  "wireframe_required": true,
  "wireframes": {
    "screens": "../../../../wireframes/f2-optic-copy-product-lineup/screens.md",
    "navigation": "../../../../wireframes/f2-optic-copy-product-lineup/navigation.md",
    "components": "../../../../wireframes/f2-optic-copy-product-lineup/components.md",
    "review": "../../../../wireframes/f2-optic-copy-product-lineup/04-wireframe-review.md"
  },
  "stitch_required": false,
  "bridge_required": true,
  "draft": "../../../../drafts/f2-optic-copy-product-lineup/01-draft.md",
  "prd": "../../../../prd/10-approved/f2-optic-copy-product-lineup-prd.md",
  "prd_review": "../../../../drafts/f2-optic-copy-product-lineup/03-prd-review.md",
  "source_routing": "../../../../drafts/f2-optic-copy-product-lineup/07-routing-metadata.md",
  "feature_context": "00-index.md",
  "architecture_binding": "06-architecture-binding.md",
  "epic_binding": "08-epic-binding.md",
  "entryPoint": "P7-plan-bridge",
  "draft_status": "completed",
  "prd_status": "approved",
  "review_status": "Approve",
  "wireframe_status": "draft-reviewed",
  "stitch_status": "skipped",
  "bridge_status": "completed-after-wireframe-refresh",
  "dev_feature_status": "completed",
  "dev_run_status": "completed",
  "dev_verify_status": "pending",
  "archive_status": "pending",
  "product_display_contract": {
    "current": [
      {
        "title": "주선사용 운송 운영 콘솔",
        "label": "OPTIC Broker",
        "status": "implemented-target"
      },
      {
        "title": "화주용 운송 요청 포털",
        "label": "OPTIC Shipper",
        "status": "implemented-target"
      }
    ],
    "upcoming": [
      "OPTIC Carrier",
      "OPTIC Ops",
      "OPTIC Billing"
    ]
  },
  "feature_package": "../02-package/00-overview.md",
  "next": "dev-verify",
  "next_command": "/dev-verify .plans/features/active/f2-optic-copy-product-lineup/",
  "fallback_next": "/plan-review .plans/features/active/f2-optic-copy-product-lineup/00-context --type=bridge"
}
```

---

## Routing Notes

- P5는 사용자 피드백에 따라 진행했다. 제품 라인업 표시 구조를 wireframe으로 고정한다.
- P6 Stitch는 생략한다. F2는 visual design handoff가 아니라 dev feature package로 직행한다.
- `/dev-feature`는 완료되어 `02-package`를 생성했다.
- `/dev-run`은 이 package를 SSOT로 사용해 TDD 구현을 진행한다.
