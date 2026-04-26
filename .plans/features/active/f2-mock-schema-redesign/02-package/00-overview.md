# 00. Feature Package Overview - F2 Mock 스키마 재설계

> **Feature slug**: `f2-mock-schema-redesign`
> **Lane**: Standard
> **Scenario**: B (Partial - 기존 preview 데이터 구조 재설계)
> **Feature type**: dev
> **작성일**: 2026-04-24
> **작성자**: Codex (`/dev-feature` Step 6 대응)
> **승인 근거**: 사용자 "다음단계 진행" 요청에 따라 Bridge 이후 Feature Package 확정

---

## 1. 한 줄 요약

dash-preview의 mock data를 `extractedFrame`(AI가 읽은 값)과 `appliedFrame`(폼에 적용된 값)으로 분리하고, `PREVIEW_MOCK_SCENARIOS`와 Step visibility를 도입해 F3 옵션 요금 파생 로직이 얹힐 수 있는 안정된 기반을 만든다.

---

## 2. Structure Mode

| 항목 | 값 |
|---|---|
| Workspace Topology | `monorepo-leaf-single-app` |
| Structure Mode | `hybrid` (type-based outer + feature-scoped pocket) |
| Layer Style | `layered` |

본 Feature는 새 app 구조, backend, shared package를 만들지 않는다. 기존 `src/lib/` 데이터 유틸과 `src/components/dashboard-preview/` feature pocket 내부만 사용한다.

---

## 3. Allowed Target Paths

상세 SSOT는 [`06-architecture-binding.md`](../00-context/06-architecture-binding.md)다. 구현자는 아래 경로 밖으로 확장하지 않는다.

### 3-1. 수정 가능

```txt
src/lib/mock-data.ts
src/lib/preview-steps.ts
src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx
src/components/dashboard-preview/ai-register-main/order-form/index.tsx
src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx
src/components/dashboard-preview/ai-register-main/order-form/settlement-section.tsx
```

### 3-2. 테스트

```txt
src/__tests__/lib/mock-data.test.ts
src/__tests__/lib/preview-steps.test.ts
src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/index.test.tsx
src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/flow.test.tsx
src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx
src/components/dashboard-preview/ai-register-main/order-form/__tests__/settlement-section.test.tsx
```

### 3-3. Plan evidence

```txt
.plans/features/active/f2-mock-schema-redesign/03-dev-notes/**
```

### 3-4. 금지

```txt
src/components/dashboard-preview/hit-areas.ts
src/components/dashboard-preview/interactive-overlay.tsx
tailwind.config.ts
backend route, persistence, 실제 AI API
```

---

## 4. Layer Mapping

| 레이어 | 경로 | 변경 성격 |
|---|---|---|
| Utility/Data | `src/lib/mock-data.ts` | scenario array, frame split, selector/helper |
| Utility/Data | `src/lib/preview-steps.ts` | Step visibility 파생 상태 |
| Presentation | `ai-panel/index.tsx` | `extractedFrame` source 연결 |
| Presentation | `order-form/**` | `appliedFrame` source 연결 및 표시 제어 |
| Tests | allowed test paths | schema, visibility, source 연결 검증 |

---

## 5. Stack Contract

| 영역 | 계약 |
|---|---|
| Language | TypeScript |
| Framework | Next.js 15 App Router + React 18 |
| Styling | Tailwind 4 (`@theme inline`, `tailwind.config.ts` 금지) |
| Test | Vitest + jsdom |
| Dependency | 신규 dependency 추가 없음 |

---

## 6. Shared vs Local Rule

- 기본은 local 유지다.
- `PREVIEW_MOCK_SCENARIOS`, selector/helper는 `src/lib/mock-data.ts` 안에 둔다.
- React Hook이나 shared package 승격은 하지 않는다.
- F3에서 재사용할 fee 확장 지점은 schema에 남기되, `OPTION_FEE_MAP`은 본 Feature에서 구현하지 않는다.

---

## 7. 요구사항 추적

| REQ | TASK | TC |
|---|---|---|
| REQ-f2-mock-schema-001 | T-F2-SCHEMA-01 | TC-F2-01 |
| REQ-f2-mock-schema-002 | T-F2-SCHEMA-01, T-F2-AI-05 | TC-F2-02, TC-F2-06 |
| REQ-f2-mock-schema-003 | T-F2-SCHEMA-01, T-F2-APPLY-04 | TC-F2-03, TC-F2-05 |
| REQ-f2-mock-schema-004 | T-F2-SELECTOR-02 | TC-F2-04 |
| REQ-f2-mock-schema-005 | T-F2-CONSISTENCY-06 | TC-F2-07 |
| REQ-f2-mock-schema-006 | T-F2-VISIBILITY-03 | TC-F2-05 |
| REQ-f2-mock-schema-007 | T-F2-VISIBILITY-03, T-F2-APPLY-04 | TC-F2-05 |
| REQ-f2-mock-schema-008 | T-F2-APPLY-04 | TC-F2-05 |
| REQ-f2-mock-schema-009 | T-F2-CONSISTENCY-06 | TC-F2-08 |
| REQ-f2-mock-schema-010 | T-F2-SELECTOR-02 | TC-F2-09 |

---

## 8. 경로 계약 (`/dev-run` 필요 정보)

| 항목 | 값 |
|---|---|
| Feature root | `.plans/features/active/f2-mock-schema-redesign/` |
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
| REQ 개수 | 10 | 10 | 일치 |
| 예상 TASK | 6 | 6 | 일치 |
| F4 충돌 회피 | `hit-areas.ts`/overlay 금지 | 금지 경로 명시 | 일치 |
| F3 선행 기반 | fee 확장 지점만 남김 | `OPTION_FEE_MAP` 미구현 | 일치 |

---

## 10. 다음 단계

```bash
/dev-run .plans/features/active/f2-mock-schema-redesign/
```

권장 순서는 F4 layout이 먼저 끝난 뒤 F2 schema를 적용하는 것이다. 병렬 구현도 가능하지만, `order-form/index.tsx`는 두 Feature가 모두 볼 수 있으므로 같은 시간대 동시 편집은 피한다.
