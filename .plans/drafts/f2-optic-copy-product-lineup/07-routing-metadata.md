# Routing Metadata — f2-optic-copy-product-lineup

| 항목 | 값 |
|---|---|
| Feature slug | `f2-optic-copy-product-lineup` |
| IDEA | `IDEA-20260429-001` |
| Epic | `EPIC-20260428-001` |
| Epic 상태 | `planning` |
| Lane | `Standard` |
| Scenario | `A` |
| Feature type | `dev` |
| Hybrid | `false` |
| PRD required | `true` |
| PRD approved | [f2-optic-copy-product-lineup-prd.md](../../prd/10-approved/f2-optic-copy-product-lineup-prd.md) |
| PRD review | [03-prd-review.md](./03-prd-review.md) |
| Wireframe required | `true` |
| Wireframe | [screens.md](../../wireframes/f2-optic-copy-product-lineup/screens.md) |
| Wireframe review | [04-wireframe-review.md](../../wireframes/f2-optic-copy-product-lineup/04-wireframe-review.md) |
| Stitch required | `false` |
| Draft scope | `draft` |
| Bridge | `done` |
| Dev feature | `pending` |
| Dev run | `pending` |
| Dev verify | `pending` |
| Archive | `pending` |
| Bridge context | [00-index.md](../../features/active/f2-optic-copy-product-lineup/00-context/00-index.md) |
| Recommended next | `/dev-feature .plans/features/active/f2-optic-copy-product-lineup/` |

---

## 1. 판정 결과 (JSON)

```json
{
  "schema_version": "1.0",
  "slug": "f2-optic-copy-product-lineup",
  "idea_id": "IDEA-20260429-001",
  "epic_id": "EPIC-20260428-001",
  "category": "Standard",
  "scenario": "A",
  "feature_type": "dev",
  "hybrid": false,
  "copy_needed": false,
  "reference_needed": false,
  "prd_required": true,
  "prd": ".plans/prd/10-approved/f2-optic-copy-product-lineup-prd.md",
  "prd_review": ".plans/drafts/f2-optic-copy-product-lineup/03-prd-review.md",
  "bridge": ".plans/features/active/f2-optic-copy-product-lineup/00-context/00-index.md",
  "wireframe_required": true,
  "wireframes": {
    "screens": ".plans/wireframes/f2-optic-copy-product-lineup/screens.md",
    "navigation": ".plans/wireframes/f2-optic-copy-product-lineup/navigation.md",
    "components": ".plans/wireframes/f2-optic-copy-product-lineup/components.md",
    "review": ".plans/wireframes/f2-optic-copy-product-lineup/04-wireframe-review.md"
  },
  "stitch_required": false,
  "epic_binding": "EPIC-20260428-001",
  "triggers_matched": [1],
  "entryPoint": "P5-plan-wireframe-review",
  "wireframe_status": "draft-reviewed",
  "bridge_status": "completed-after-wireframe-refresh",
  "next": "/dev-feature .plans/features/active/f2-optic-copy-product-lineup/",
  "post_wireframe_path": null,
  "override": null
}
```

## 2. 근거

- Screening 결과 `78.0 / 100`, Go, Standard lane이다.
- `features`, `problems`, `products`, `integrations`, `constants` 등 3개 이상 섹션의 문구가 함께 변경된다.
- DB, API, 인증, 실제 외부 연동 호출은 변경하지 않는다.
- `화물맨` 외 외부 브랜드명 정리는 고객 노출 카피 기준이며, integration runtime 변경이 아니다.
- 신규 layout이나 신규 workflow 섹션은 F3 범위로 분리한다.

## 3. 경로 분기

**Standard + dev + hybrid=false** → `/plan-prd` 필수. PRD review 결과 `Approve`로 통과했다. 사용자 확인에 따라 제품 라인업 표시 구조는 wireframe으로 고정했고, F2는 visual design handoff가 아닌 dev feature이므로 Stitch는 생략한다. Bridge context는 wireframe-aware 상태로 갱신했다.

F2는 전체 랜딩 재설계가 아니라 제품 섹션 구조와 주변 copy-only 섹션 정리다. 따라서 P5 wireframe은 제품 라인업 표시 기준을 고정하는 용도로 완료했고, P6 Stitch는 생략한다.

```bash
/dev-feature .plans/features/active/f2-optic-copy-product-lineup/
```

## 4. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-29 | 초안 — Standard / A / dev / hybrid false, PRD 필수 경로 확정 |
| 2026-04-29 | PRD draft 생성 — 다음 단계 PRD review |
| 2026-04-29 | PRD review 통과 — 한글 역할명 우선 + Broker/Shipper 보조 라벨 기준 반영, 다음 단계 `/plan-bridge` |
| 2026-04-29 | Bridge context 생성 — 다음 단계 `/dev-feature` |
| 2026-04-29 | 사용자 피드백 반영 — 제품 라인업 wireframe 작성 및 Bridge context 갱신 |
