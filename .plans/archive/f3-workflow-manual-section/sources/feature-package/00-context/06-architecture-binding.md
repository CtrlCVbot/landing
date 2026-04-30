# Architecture Binding: f3-workflow-manual-section

> **Feature Slug**: `f3-workflow-manual-section`
> **Source Architecture**: [00-dev-architecture.md](../../../../project/00-dev-architecture.md)
> **Source PRD**: [f3-workflow-manual-section-prd.md](../../../../prd/10-approved/f3-workflow-manual-section-prd.md)
> **Status**: approved
> **Created**: 2026-04-29
> **Scope**: Standard, dev, 신규 landing section

---

## 1. Binding Decision

이 Feature는 landing page에 신규 업무 매뉴얼형 section을 추가한다. 새 route, 새 dependency, dashboard-preview feature pocket 변경 없이 현재 구조 SSOT의 type-based section 구조와 `src/lib/` 데이터 계층을 따른다.

구현의 중심은 `src/components/sections/workflow-manual.tsx`, workflow data 파일, `src/app/page.tsx` composition이다.

---

## 2. Selected Structure Mode

```text
hybrid
```

Landing app은 type-based outer structure와 `dashboard-preview` feature pocket을 함께 사용한다. F3는 type-based outer structure 안의 `sections/`와 `lib/`에 닫히는 presentation/data feature다. `dashboard-preview` pocket은 보존 대상이다.

---

## 3. Allowed Target Paths

### 3-1. Primary Editable Paths

| 경로 | 레이어 | 목적 |
|---|---|---|
| `src/components/sections/workflow-manual.tsx` | Presentation / Section | 신규 업무 매뉴얼형 섹션 UI |
| `src/lib/landing-workflow.ts` | Utility / Workflow Data | 6단계 workflow data와 stable id |
| `src/lib/constants.ts` | Utility / Copy Data | 기존 constants에 통합하는 경우에만 workflow data 또는 section copy 추가 |
| `src/app/page.tsx` | Route / Composition | Products 직후 또는 가장 가까운 적절한 위치에 신규 섹션 배치 |

### 3-2. Conditional Editable Paths

| 경로 | 조건 |
|---|---|
| `src/components/sections/products.tsx` | Products 직후 배치에 anchor나 spacing 조정이 필요할 때만 최소 수정 |
| `src/components/sections/integrations.tsx` | Workflow section과 중복 문구가 심해 조정이 필요할 때만 최소 copy 보정 |
| `src/components/sections/features.tsx` | Workflow section과 `화물맨 연동` 설명 중복이 커질 때만 최소 copy 보정 |
| `src/app/globals.css` | 375px overflow를 component class로 해결할 수 없을 때만 최소 수정 |

### 3-3. Recommended Test Paths

| 경로 | 검증 목적 |
|---|---|
| `src/__tests__/lib/landing-workflow.test.ts` | 6단계 id/order/title 순서와 문구 검증 |
| `src/components/sections/__tests__/workflow-manual.test.tsx` | 섹션 렌더링, 단계 제목, 커스텀 메시지 확인 |
| `src/__tests__/app/page.test.tsx` 또는 기존 page smoke test | Products 이후 Workflow section 배치 확인 |

### 3-4. Read-only / Preservation Paths

| 경로 | 정책 |
|---|---|
| `src/components/dashboard-preview/**` | F3 범위 밖. preview 동작, focus animation, overlay는 보존한다. |
| `src/lib/mock-data.ts` | Dashboard preview mock data 범위이므로 F3에서 수정하지 않는다. |
| `src/lib/preview-steps.ts` | dash-preview 시나리오 범위이므로 F3에서 수정하지 않는다. |
| `package.json` | 신규 dependency 필요 없음. |

---

## 4. Layer Mapping

| Layer | Project Path | 이 Feature에서의 의미 |
|---|---|---|
| Route/App Shell | `src/app/page.tsx` | landing section composition |
| Presentation | `src/components/sections/workflow-manual.tsx` | 신규 workflow section |
| Utility / Workflow Data | `src/lib/landing-workflow.ts` 또는 `src/lib/constants.ts` | 단계 데이터 SSOT |
| Test | `src/**/__tests__/**` | data, section render, page composition regression |

---

## 5. Shared Package Touch Points

없음.

F3는 `apps/landing` leaf app 내부에서 닫힌다. `packages/*`, API, DB, 외부 서비스 SDK는 건드리지 않는다.

---

## 6. Verification Notes

| 검증 | 명령 또는 방식 | 기대 결과 |
|---|---|---|
| Targeted tests | `pnpm test -- workflow` 또는 관련 Vitest filter | workflow data/section render 통과 |
| Full tests | `pnpm test` | 0 failures |
| Typecheck | `pnpm typecheck` | TypeScript error 0 |
| Lint | `pnpm lint` | lint error 0 |
| Build | `pnpm build` | production build 성공 |
| Copy scan | `Select-String` 또는 `rg` | 핵심 문구 노출과 과장 표현 부재 |
| Browser spot check | desktop/mobile 375px | 단계 카드/CTA 텍스트 겹침 없음 |

---

## 7. Binding Guardrails

- Products 라인업 카드 구조를 재구현하지 않는다.
- `화물맨 연동`은 배차 단계의 외부 채널 연결로만 표현한다.
- `정산 자동화`와 `세금계산서 관리`는 분리한다.
- 실제 API, 설정 저장, tenant admin 구현으로 오해될 문구를 피한다.
- F4 animation/state mock scope를 F3에 포함하지 않는다.
