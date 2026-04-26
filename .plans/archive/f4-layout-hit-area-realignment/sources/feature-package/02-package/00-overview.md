# 00. Feature Package Overview - F4 레이아웃 정비 + Hit-Area 재정렬

> **Feature slug**: `f4-layout-hit-area-realignment`
> **Lane**: Standard
> **Scenario**: B (Partial - 기존 preview layout/interaction 정비)
> **Feature type**: dev
> **작성일**: 2026-04-24
> **작성자**: Codex (`/dev-feature` Step 6 대응)
> **승인 근거**: 사용자 "다음단계 진행" 요청에 따라 Bridge 이후 Feature Package 확정

---

## 1. 한 줄 요약

dash-preview order form의 DateTime 영역을 desktop/tablet에서 2열로 정리하고, F5 이후 현재 code/test SSOT 기준 18개 hit-area bounds와 overlay anchor를 실제 DOM 위치에 맞게 검증해 tooltip/highlight 정확도를 높인다.

---

## 2. Structure Mode

| 항목 | 값 |
|---|---|
| Workspace Topology | `monorepo-leaf-single-app` |
| Structure Mode | `hybrid` (type-based outer + feature-scoped pocket) |
| Layer Style | `layered` |

본 Feature는 existing dashboard-preview feature pocket 내부의 presentation/interaction 정비다. 새 구조나 shared package를 추가하지 않는다.

---

## 3. Allowed Target Paths

상세 SSOT는 [`06-architecture-binding.md`](../00-context/06-architecture-binding.md)다. 구현자는 아래 경로 밖으로 확장하지 않는다.

### 3-1. 수정 가능

```txt
src/components/dashboard-preview/ai-register-main/order-form/index.tsx
src/components/dashboard-preview/ai-register-main/order-form/datetime-card.tsx
src/components/dashboard-preview/hit-areas.ts
src/components/dashboard-preview/interactive-overlay.tsx
```

### 3-2. 테스트

```txt
src/components/dashboard-preview/__tests__/hit-areas.test.ts
src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx
src/components/dashboard-preview/ai-register-main/order-form/__tests__/datetime-card.test.tsx
src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx
src/__tests__/dashboard-preview/legacy/interactive-overlay.test.tsx
```

### 3-3. Plan evidence

```txt
.plans/features/active/f4-layout-hit-area-realignment/03-dev-notes/**
```

### 3-4. 금지

```txt
src/lib/mock-data.ts
tailwind.config.ts
새 좌표 엔진 또는 외부 dependency
```

---

## 4. Layer Mapping

| 레이어 | 경로 | 변경 성격 |
|---|---|---|
| Presentation | `order-form/index.tsx`, `datetime-card.tsx` | DateTime 2열 layout |
| Interaction | `hit-areas.ts` | 18개 bounds 재측정 |
| Interaction | `interactive-overlay.tsx` | anchor 기준 적용 또는 보류 결정 |
| Tests | allowed test paths | layout, bounds, overlay regression |
| Plan evidence | `03-dev-notes/**` | bounds evidence, viewport matrix |

---

## 5. Stack Contract

| 영역 | 계약 |
|---|---|
| Language | TypeScript |
| Framework | Next.js 15 App Router + React 18 |
| Styling | Tailwind 4 |
| Test | Vitest + jsdom |
| Dependency | 신규 dependency 추가 없음 |

---

## 6. Shared vs Local Rule

- 모든 변경은 `src/components/dashboard-preview/` pocket 내부 local 변경이다.
- 좌표 측정 helper가 필요해도 본 Feature에서는 외부 dependency를 도입하지 않는다.
- dynamic DOM measurement는 fallback proposal로만 남기고, 이번 기본안은 static bounds evidence 기반이다.

---

## 7. 요구사항 추적

| REQ | TASK | TC |
|---|---|---|
| REQ-f4-layout-hit-area-001 | T-F4-LAYOUT-01 | TC-F4-01, TC-F4-02 |
| REQ-f4-layout-hit-area-002 | T-F4-HITAREA-02 | TC-F4-03 |
| REQ-f4-layout-hit-area-003 | T-F4-TABLET-03 | TC-F4-04 |
| REQ-f4-layout-hit-area-004 | T-F4-OVERLAY-04 | TC-F4-05 |
| REQ-f4-layout-hit-area-005 | T-F4-OVERLAY-04 | TC-F4-05 |
| REQ-f4-layout-hit-area-006 | T-F4-QA-05 | TC-F4-06 |
| REQ-f4-layout-hit-area-007 | 전 TASK | TC-F4-07 |

---

## 8. 경로 계약 (`/dev-run` 필요 정보)

| 항목 | 값 |
|---|---|
| Feature root | `.plans/features/active/f4-layout-hit-area-realignment/` |
| Dev tasks SSOT | `02-package/08-dev-tasks.md` |
| Test cases SSOT | `02-package/09-test-cases.md` |
| Architecture binding | `00-context/06-architecture-binding.md` |
| Requirements SSOT | `02-package/01-requirements.md` |

---

## 9. 일관성 점검

| 항목 | PRD/Bridge | Package | 판정 |
|---|---|---|---|
| Lane | Standard | Standard | 일치 |
| Feature type | dev | dev | 일치 |
| REQ 개수 | 7 | 7 | 일치 |
| 예상 TASK | 5 | 5 | 일치 |
| F2 충돌 회피 | `mock-data.ts` 금지 | 금지 경로 명시 | 일치 |
| Evidence 필요 | hit-area evidence 요구 | `03-dev-notes` 템플릿 추가 | 일치 |

---

## 10. 다음 단계

```bash
/dev-run .plans/features/active/f4-layout-hit-area-realignment/
```

권장 순서는 F4를 먼저 구현한 뒤 F2로 넘어가는 것이다. F4는 화면 구조와 좌표 evidence가 핵심이라, 완료 후 F2의 order form data source 변경을 더 안정적으로 적용할 수 있다.
