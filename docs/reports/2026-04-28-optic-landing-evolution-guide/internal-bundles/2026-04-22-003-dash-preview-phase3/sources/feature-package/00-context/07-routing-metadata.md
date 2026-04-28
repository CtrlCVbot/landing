# dash-preview Phase 3 — Routing Metadata

> **IDEA**: [IDEA-20260417-001](../../../../ideas/20-approved/IDEA-20260417-001.md)
> **First Pass**: [first-pass.md](../../../drafts/dash-preview-phase3/first-pass.md)
> **Slug**: `dash-preview-phase3`
> **Created**: 2026-04-17

---

## 3중 판정

### Lite/Standard: **Standard**

claude-kit 6개 트리거 전부 충족:

- [x] 신규 컴포넌트 10개 이상 생성 (21+)
- [x] 기존 컴포넌트 구조적 변경 (dashboard-preview 전면 확장)
- [x] 외부 라이브러리 신규 도입 (shadcn 3-C 하이브리드)
- [x] 18~22일 (1 FT) 공수
- [x] 테스트 전략 재설계 필요
- [x] 성능 예산 재협상 필요 (승인 완료)

### 시나리오: **C (충실도 교정)**

- 기존 구현: Phase 1/2 (축약 버전)
- 원본 대응: `.references/code/mm-broker/app/broker/order/ai-register/`
- 목표: 기존 축약 → 원본 수준 픽셀 정확도로 교정 + 조작감 레이어 추가

### Feature 유형: **Hybrid (copy + dev 공존)**

| 축 | 판정 | 근거 |
|---|:---:|------|
| copy 요소 | O | ai-register 원본 대응, 시각/인터랙션 차이 닫기 |
| dev 요소 | O | 조작감 레이어 10종은 landing 독자 연출 (원본에 없음) |
| 특수성 | URL 아닌 source code 원본 | 일반 copy live 캡처 워크플로우와 상이 |

**운영 모드 제안**: copy `reference-only` 모드 (원본 캡처/빌드만 사용, visual/interaction review는 Phase 1 스펙을 spec source로 대체).

---

## 경로 분기

Standard + Hybrid 판정에 따른 권장 경로:

```
first-pass (여기)
    ↓
/plan-prd  (범위 PRD)
    ↓
(Hybrid copy 성격 확정 시) /copy-reference-refresh
    ↓
Spike 1일 (AiPanel + 조작감 #1/#3)
    ↓
/plan-wireframe → /plan-stitch → /plan-bridge
    ↓
/dev-feature → /dev-run
```

※ Feature 유형 최종 확정은 Human Checkpoint에서 수행.

---

## Human Checkpoint 결과 (확정)

| 항목 | 확정값 | 확정일 |
|------|--------|--------|
| Feature 유형 | **Hybrid (reference-only)** | 2026-04-17 |
| 시나리오 | **C (충실도 교정)** — Spike 결과에 따라 A 전환 여지 유지 | 2026-04-17 |
| Slug | **`dash-preview-phase3`** | 2026-04-17 |

확정 절차: 추천 조합에 대한 사용자 명시 승인 ("추천항목들로 진행").

**운영 모드**: copy 도구 중 `/copy-reference-refresh`만 활용. visual/interaction review는 Phase 1 스펙을 spec source로 대체.

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-04-17 | 최초 판정 (Standard / 시나리오 C / Hybrid Feature) |
| 2026-04-17 | Human Checkpoint 통과 — 3개 항목 모두 추천값 확정 |
