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
| Wireframe required | `false` |
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
  "wireframe_required": false,
  "stitch_required": false,
  "epic_binding": "EPIC-20260428-001",
  "triggers_matched": [1],
  "entryPoint": "P7-plan-bridge",
  "bridge_status": "completed",
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

**Standard + dev + hybrid=false** → `/plan-prd` 필수. PRD review 결과 `Approve`로 통과했으며, F2는 기존 섹션의 copy/data 정리이므로 wireframe/stitch는 생략한다. Bridge context는 생성 완료 상태다.

F2는 텍스트와 상수 정리 중심이므로 wireframe/stitch는 기본적으로 생략 후보지만, PRD에서 섹션 구조나 카드 배치를 크게 바꾸는 것으로 확정되면 P5/P6를 재평가한다.

```bash
/dev-feature .plans/features/active/f2-optic-copy-product-lineup/
```

## 4. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-29 | 초안 — Standard / A / dev / hybrid false, PRD 필수 경로 확정 |
| 2026-04-29 | PRD draft 생성 — 다음 단계 PRD review |
| 2026-04-29 | PRD review 통과 — 한글 역할명 우선 + Broker/Shipper 보조 라벨 기준 반영, wireframe/stitch 생략, 다음 단계 `/plan-bridge` |
| 2026-04-29 | Bridge context 생성 — 다음 단계 `/dev-feature` |
