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
| Wireframe required | `conditional` |
| Stitch required | `conditional` |
| Draft scope | `draft` |
| Bridge | `pending` |
| Dev feature | `pending` |
| Dev run | `pending` |
| Dev verify | `pending` |
| Archive | `pending` |
| Recommended next | `/plan-prd .plans/drafts/f2-optic-copy-product-lineup/` |

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
  "wireframe_required": "conditional",
  "stitch_required": "conditional",
  "epic_binding": "EPIC-20260428-001",
  "triggers_matched": [1],
  "entryPoint": "P3-plan-draft",
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

**Standard + dev + hybrid=false** → `/plan-prd` 필수.

F2는 텍스트와 상수 정리 중심이므로 wireframe/stitch는 기본적으로 생략 후보지만, PRD에서 섹션 구조나 카드 배치를 크게 바꾸는 것으로 확정되면 P5/P6를 재평가한다.

```bash
/plan-prd .plans/drafts/f2-optic-copy-product-lineup/
```

## 4. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-29 | 초안 — Standard / A / dev / hybrid false, PRD 필수 경로 확정 |
