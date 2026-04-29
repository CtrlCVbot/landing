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
  "wireframe_required": false,
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
  "wireframe_status": "skipped",
  "stitch_status": "skipped",
  "bridge_status": "completed",
  "dev_feature_status": "pending",
  "dev_run_status": "pending",
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
  "next": "dev-feature",
  "next_command": "/dev-feature .plans/features/active/f2-optic-copy-product-lineup/",
  "fallback_next": "/plan-review .plans/features/active/f2-optic-copy-product-lineup/00-context --type=bridge"
}
```

---

## Routing Notes

- P5/P6는 생략한다. F2는 신규 화면 구조가 아니라 기존 섹션 copy/data 정리다.
- `/dev-feature`는 이 context를 입력으로 `02-package`를 생성한다.
- `/dev-run`은 `/dev-feature` 이후 진행한다.
