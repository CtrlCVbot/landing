# 00. Feature Package Overview - F1 브랜드, 로고, CTA 최소 반영

> **Feature slug**: `f1-optic-brand-cta`
> **Lane**: Lite
> **Scenario**: A
> **Feature type**: dev
> **Hybrid**: false
> **작성일**: 2026-04-28
> **작성자**: Codex (`/dev-feature` 대응)
> **승인 근거**: Draft scope review Approve

---

## 1. 한 줄 요약

랜딩의 브랜드 기준을 `OPTIC` 중심으로 정렬하고, Header desktop/mobile에서 서비스 확인 CTA(`OPTIC 바로가기`)와 문의 CTA(`도입 문의하기`)를 분리한다.

## 2. Structure Mode

| 항목 | 값 |
|---|---|
| Workspace Topology | `monorepo-leaf-single-app` |
| Structure Mode | `hybrid` |
| Layer Style | `layered` |

본 Feature는 새 app 구조, backend, shared package를 만들지 않는다.
기존 landing section layer와 `src/lib/constants.ts`를 사용한다.

## 3. Allowed Target Paths

상세 SSOT는 [06-architecture-binding.md](../00-context/06-architecture-binding.md)다.

### 3-1. 수정 가능

```txt
src/lib/constants.ts
src/components/sections/header.tsx
src/components/sections/footer.tsx
src/components/icons/optic-logo.tsx
```

### 3-2. 테스트

```txt
src/__tests__/lib/constants.test.ts
src/components/sections/__tests__/header.test.tsx
src/components/sections/__tests__/footer.test.tsx
```

### 3-3. 금지

```txt
src/components/dashboard-preview/**
src/lib/mock-data.ts
src/lib/preview-steps.ts
src/app/globals.css
package.json
lockfile
backend route, persistence, API
```

## 4. Layer Mapping

| 레이어 | 경로 | 변경 성격 |
|---|---|---|
| Utility | `src/lib/constants.ts` | 브랜드/CTA 상수 |
| Presentation / Section | `src/components/sections/header.tsx` | desktop/mobile CTA 분리 |
| Presentation / Section | `src/components/sections/footer.tsx` | 주/보조 브랜드 표기 |
| Presentation / Icon | `src/components/icons/optic-logo.tsx` | 접근성 이름 확인 |
| Tests | allowed test paths | 상수, CTA 링크 속성, 렌더 검증 |

## 5. Stack Contract

| 영역 | 계약 |
|---|---|
| Language | TypeScript |
| Framework | Next.js 15 App Router + React 18 |
| Styling | Tailwind 4, 기존 class/token만 사용 |
| Test | Vitest + Testing Library |
| Dependency | 신규 dependency 추가 없음 |

## 6. Shared vs Local Rule

- 브랜드/CTA 값은 `src/lib/constants.ts`에서 shared utility로 관리한다.
- Header/Footer 표현은 section-local 구현으로 유지한다.
- 다른 앱이나 패키지로 공용화하지 않는다.
- `OPTIC 바로가기`가 다른 섹션에서도 반복되면 후속 Feature에서 CTA helper 승격을 검토한다.

## 7. 요구사항 추적

| REQ | TASK | TC |
|---|---|---|
| REQ-BRAND-001 | T-BRAND-01 | TC-BRAND-01 |
| REQ-BRAND-002 | T-BRAND-02 | TC-BRAND-02 |
| REQ-BRAND-003 | T-BRAND-03 | TC-BRAND-03 |
| REQ-BRAND-004 | T-BRAND-01, T-BRAND-02 | TC-BRAND-04 |
| REQ-BRAND-005 | T-BRAND-02 | TC-BRAND-05 |
| REQ-BRAND-006 | T-BRAND-02 | TC-BRAND-06 |
| REQ-BRAND-007 | T-BRAND-03 | TC-BRAND-07 |
| REQ-BRAND-008 | T-BRAND-04 | TC-BRAND-08 |

## 8. 경로 계약

| 항목 | 값 |
|---|---|
| Feature root | `.plans/features/active/f1-optic-brand-cta/` |
| Requirements SSOT | `02-package/01-requirements.md` |
| Dev tasks SSOT | `02-package/08-dev-tasks.md` |
| Test cases SSOT | `02-package/09-test-cases.md` |
| Architecture binding | `00-context/06-architecture-binding.md` |

## 9. 일관성 점검

| 항목 | Draft/Bridge | Package | 판정 |
|---|---|---|---|
| Lane | Lite | Lite | 일치 |
| Feature type | dev | dev | 일치 |
| REQ 개수 | 8개로 승격 | 8개 | 일치 |
| 예상 TASK | 4개 | 4개 | 일치 |
| DashboardPreview 보호 | 수정 금지 | disallowed path 명시 | 일치 |
| 서비스 URL gate | needs-verification | release checklist 유지 | 일치 |

## 10. 다음 단계

```bash
/dev-run .plans/features/active/f1-optic-brand-cta/
```

구현은 테스트를 먼저 추가한 뒤 `constants`, `Header`, `Footer/Logo` 순서로 진행한다.
