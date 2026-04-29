# 00. Feature Package Overview - F2 카피와 제품 라인업 정리

> **Feature slug**: `f2-optic-copy-product-lineup`
> **Lane**: Standard
> **Scenario**: A
> **Feature type**: dev
> **Hybrid**: false
> **작성일**: 2026-04-29
> **작성자**: Codex (`/dev-feature` 대응)
> **승인 근거**: approved PRD + wireframe review Approve

---

## 1. 한 줄 요약

랜딩 본문 카피를 `OPTIC`의 맞춤형 운송 운영 가치에 맞춰 정리하고, 제품 라인업을 `주선사용 운송 운영 콘솔`과 `화주용 운송 요청 포털` 중심으로 재구성한다.

## 2. Structure Mode

| 항목 | 값 |
|---|---|
| Workspace Topology | `monorepo-leaf-single-app` |
| Structure Mode | `hybrid` |
| Layer Style | `layered` |

본 Feature는 새 route, backend, API, DB, shared package를 만들지 않는다. 기존 landing section layer와 `src/lib/constants.ts`를 사용한다.

## 3. Allowed Target Paths

상세 SSOT는 [06-architecture-binding.md](../00-context/06-architecture-binding.md)다.

### 3-1. 수정 가능

```txt
src/lib/constants.ts
src/components/sections/features.tsx
src/components/sections/problems.tsx
src/components/sections/products.tsx
src/components/sections/integrations.tsx
src/components/sections/hero.tsx
```

### 3-2. 조건부 수정

```txt
src/components/sections/footer.tsx
src/components/sections/header.tsx
src/components/sections/cta.tsx
```

조건부 파일은 F1 브랜드/CTA 기준과 F2 금지어 기준이 충돌할 때만 최소 수정한다.

### 3-3. 테스트

```txt
src/__tests__/lib/constants.test.ts
src/components/sections/__tests__/products.test.tsx
src/components/sections/__tests__/features.test.tsx
src/components/sections/__tests__/integrations.test.tsx
src/components/sections/__tests__/hero.test.tsx
src/components/sections/__tests__/footer.test.tsx
```

### 3-4. 금지

```txt
src/components/dashboard-preview/**
src/lib/mock-data.ts
src/lib/preview-steps.ts
package.json
lockfile
backend route, persistence, API
```

## 4. Layer Mapping

| 레이어 | 경로 | 변경 성격 |
|---|---|---|
| Utility / Copy Data | `src/lib/constants.ts` | 브랜드, 문제, 기능, 제품, 연동 카피 데이터 |
| Presentation / Section | `src/components/sections/features.tsx` | 기능 카드 표시, 화물맨 배차 단계 반영 |
| Presentation / Section | `src/components/sections/problems.tsx` | 수작업 감소와 누락 방지 중심 카피 |
| Presentation / Section | `src/components/sections/products.tsx` | 역할명 우선 제품 라인업과 구현 예정 분리 |
| Presentation / Section | `src/components/sections/integrations.tsx` | provider명 일반화, 화물맨 보조 설명 |
| Tests | allowed test paths | copy/data와 section render regression |

## 5. Stack Contract

| 영역 | 계약 |
|---|---|
| Language | TypeScript |
| Framework | Next.js 15 App Router + React 18 |
| Styling | Tailwind 4, 기존 class/token만 사용 |
| Animation | 기존 framer-motion pattern 유지 |
| Icons | 기존 lucide-react icon map 안에서 처리 |
| Test | Vitest + Testing Library |
| Dependency | 신규 dependency 추가 없음 |

## 6. Shared vs Local Rule

- 문구와 제품 데이터는 `src/lib/constants.ts`에서 shared utility로 관리한다.
- section display 로직은 각 section 컴포넌트 안에 유지한다.
- 제품 라인업용 타입이 필요하면 우선 `constants.ts` 근처의 local type으로 처리한다.
- 2개 이상 section에서 반복되는 UI primitive가 생기기 전까지 `src/components/ui/` 승격은 하지 않는다.

## 7. 요구사항 추적

| REQ | TASK | TC |
|---|---|---|
| REQ-F2-001 | T-F2-01, T-F2-04 | TC-F2-01, TC-F2-07 |
| REQ-F2-002 | T-F2-01, T-F2-04 | TC-F2-01, TC-F2-07 |
| REQ-F2-003 | T-F2-01, T-F2-05 | TC-F2-01, TC-F2-06 |
| REQ-F2-004 | T-F2-01, T-F2-02 | TC-F2-02, TC-F2-06 |
| REQ-F2-005 | T-F2-01, T-F2-02 | TC-F2-02 |
| REQ-F2-006 | T-F2-01, T-F2-02, T-F2-03 | TC-F2-02, TC-F2-04 |
| REQ-F2-007 | T-F2-01, T-F2-03 | TC-F2-04 |
| REQ-F2-008 | T-F2-01, T-F2-03 | TC-F2-04 |
| REQ-F2-009 | T-F2-01, T-F2-02 | TC-F2-02, TC-F2-03 |
| REQ-F2-010 | T-F2-01, T-F2-02 | TC-F2-02 |
| REQ-F2-011 | T-F2-01, T-F2-02, T-F2-05 | TC-F2-05, TC-F2-06 |
| REQ-F2-012 | T-F2-04 | TC-F2-07 |
| REQ-F2-013 | T-F2-05 | TC-F2-08 |
| REQ-F2-014 | T-F2-03, T-F2-05 | TC-F2-08 |

## 8. 경로 계약

| 항목 | 값 |
|---|---|
| Feature root | `.plans/features/active/f2-optic-copy-product-lineup/` |
| Requirements SSOT | `02-package/01-requirements.md` |
| Dev tasks SSOT | `02-package/08-dev-tasks.md` |
| Test cases SSOT | `02-package/09-test-cases.md` |
| Architecture binding | `00-context/06-architecture-binding.md` |
| Wireframe source | `.plans/wireframes/f2-optic-copy-product-lineup/screens.md` |

## 9. 일관성 점검

| 항목 | Bridge | Package | 판정 |
|---|---|---|---|
| Lane | Standard | Standard | 일치 |
| Feature type | dev | dev | 일치 |
| Structure | existing sections + constants | same | 일치 |
| Wireframe | products structure fixed | used in UI spec | 일치 |
| 화물맨 기준 | 외부 브랜드 예외 | Features의 배차 단계 기능 | 일치 |
| DashboardPreview 보호 | 수정 금지 | forbidden path 명시 | 일치 |

## 10. 다음 단계

```bash
/dev-run .plans/features/active/f2-optic-copy-product-lineup/
```

구현은 테스트를 먼저 추가한 뒤 `constants`, `Features/Problems/Integrations`, `Products`, 검증 순서로 진행한다.
