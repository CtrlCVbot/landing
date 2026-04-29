# Routing Metadata — f3-workflow-manual-section

```json
{
  "schema_version": "1.0",
  "feature_slug": "f3-workflow-manual-section",
  "title": "F3 업무 매뉴얼형 스크롤 섹션 MVP",
  "idea_id": "IDEA-20260429-002",
  "epic_id": "EPIC-20260428-001",
  "phase": "C",
  "lane": "Standard",
  "scenario": "A",
  "feature_type": "dev",
  "hybrid": false,
  "copy_needed": false,
  "reference_needed": false,
  "prd_required": true,
  "wireframe_required": true,
  "stitch_required": false,
  "bridge_required": true,
  "statuses": {
    "idea": "approved",
    "screening": "approved",
    "draft": "completed",
    "prd": "approved",
    "prd_review": "approved",
    "wireframe": "approved",
    "wireframe_review": "approved",
    "bridge": "completed",
    "dev_feature": "pending",
    "archive": "pending"
  },
  "source_documents": {
    "idea": "../../ideas/20-approved/IDEA-20260429-002.md",
    "screening": "../../ideas/20-approved/SCREENING-20260429-002.md",
    "prd": "../../prd/10-approved/f3-workflow-manual-section-prd.md",
    "prd_review": "../../drafts/f3-workflow-manual-section/03-prd-review.md",
    "wireframe_screens": "../../wireframes/f3-workflow-manual-section/screens.md",
    "wireframe_navigation": "../../wireframes/f3-workflow-manual-section/navigation.md",
    "wireframe_components": "../../wireframes/f3-workflow-manual-section/components.md",
    "wireframe_review": "../../wireframes/f3-workflow-manual-section/04-wireframe-review.md",
    "bridge_context": "../../features/active/f3-workflow-manual-section/00-context/00-index.md",
    "architecture_binding": "../../features/active/f3-workflow-manual-section/00-context/06-architecture-binding.md",
    "epic_binding": "../../features/active/f3-workflow-manual-section/00-context/08-epic-binding.md",
    "epic": "../../epics/10-planning/EPIC-20260428-001/00-epic-brief.md",
    "children_features": "../../epics/10-planning/EPIC-20260428-001/01-children-features.md",
    "roadmap": "../../epics/10-planning/EPIC-20260428-001/02-roadmap.md",
    "f1_archive": "../../archive/f1-optic-brand-cta/ARCHIVE-F1.md",
    "f2_archive": "../../archive/f2-optic-copy-product-lineup/ARCHIVE-F2.md"
  },
  "next": "dev-feature",
  "next_command": "/dev-feature .plans/features/active/f3-workflow-manual-section/"
}
```

## 결정 메모

- F3는 신규 업무 매뉴얼형 섹션이므로 Standard lane으로 둔다.
- 제품 라인업 설명은 F2에서 이미 처리했으므로 F3는 업무 순서와 커스텀 가능성에 집중한다.
- F4의 애니메이션과 상태 mock은 F3 구조 확정 이후 진행한다.
- PRD review 결과 Approve로 판정되어 다음 단계는 Wireframe이다.
- Wireframe review 결과 Approve로 판정되어 다음 단계는 Bridge다.
- Bridge context 생성이 완료되어 다음 단계는 `/dev-feature`다.
