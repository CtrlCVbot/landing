# Routing Metadata: f3-workflow-manual-section

```json
{
  "schema_version": "1.0",
  "slug": "f3-workflow-manual-section",
  "idea": "IDEA-20260429-002",
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
    "screens": "../../../../wireframes/f3-workflow-manual-section/screens.md",
    "navigation": "../../../../wireframes/f3-workflow-manual-section/navigation.md",
    "components": "../../../../wireframes/f3-workflow-manual-section/components.md",
    "review": "../../../../wireframes/f3-workflow-manual-section/04-wireframe-review.md"
  },
  "stitch_required": false,
  "bridge_required": true,
  "draft": "../../../../drafts/f3-workflow-manual-section/01-draft.md",
  "prd": "../../../../prd/10-approved/f3-workflow-manual-section-prd.md",
  "prd_review": "../../../../drafts/f3-workflow-manual-section/03-prd-review.md",
  "source_routing": "../../../../drafts/f3-workflow-manual-section/07-routing-metadata.md",
  "feature_context": "00-index.md",
  "architecture_binding": "06-architecture-binding.md",
  "epic_binding": "08-epic-binding.md",
  "entryPoint": "P7-plan-bridge",
  "draft_status": "completed",
  "prd_status": "approved",
  "review_status": "Approve",
  "wireframe_status": "draft-reviewed",
  "wireframe_review_status": "Approve",
  "stitch_status": "skipped",
  "bridge_status": "completed",
  "dev_feature_status": "completed",
  "dev_run_status": "completed",
  "dev_verify_status": "completed",
  "archive_status": "completed",
  "workflow_steps": [
    "ai-order",
    "locations",
    "dispatch-status",
    "hwamulman",
    "settlement",
    "invoice"
  ],
  "recommended_placement": "after-products",
  "feature_package": "../02-package/00-overview.md",
  "dev_output": "../03-dev-notes/dev-output-summary.md",
  "dev_verify_report": "../03-dev-notes/dev-verify-report.md",
  "archive": "../../../ARCHIVE-F3.md",
  "next": "f4-planning",
  "next_command": "/plan-idea F4 업무 흐름 애니메이션과 상태 표현",
  "fallback_next": "/plan-archive f3-workflow-manual-section"
}
```

---

## Routing Notes

- P6 Stitch는 생략한다. F3는 visual design handoff가 아니라 dev feature package로 직행한다.
- P7 Bridge는 approved PRD, PRD review, wireframe, wireframe review를 dev handoff context로 동결한다.
- `/dev-feature`는 이 `00-context`를 입력으로 `02-package` 요구사항, UI spec, TASK, test case 생성을 완료했다.
- `/dev-run`은 완료되었으며, 구현 결과와 검증 evidence는 `../03-dev-notes/dev-output-summary.md`에 기록한다.
- `/dev-verify`도 완료되었으며, fresh 검증 결과는 `../03-dev-notes/dev-verify-report.md`에 기록한다.
- `/plan-archive f3-workflow-manual-section`도 완료되었으며, archive bundle은 `../../../ARCHIVE-F3.md`에 기록한다.
- 다음 단계는 F4 업무 흐름 애니메이션과 상태 표현 기획이다.
