# Architecture Binding: f2-optic-copy-product-lineup

> **Feature Slug**: `f2-optic-copy-product-lineup`
> **Source Architecture**: [00-dev-architecture.md](../../../../project/00-dev-architecture.md)
> **Source PRD**: [f2-optic-copy-product-lineup-prd.md](../../../../prd/10-approved/f2-optic-copy-product-lineup-prd.md)
> **Status**: approved
> **Created**: 2026-04-29
> **Scope**: Standard, dev, copy/data 정리

---

## 1. Binding Decision

이 Feature는 landing page의 기존 섹션 카피와 상수 데이터를 정리한다. 새 route, 새 feature pocket, 새 dependency를 만들지 않고, 현재 구조 SSOT의 type-based section 구조와 `src/lib/constants.ts`를 그대로 따른다.

구현의 중심은 `src/lib/constants.ts`와 기존 section 컴포넌트다. UI 구조 변경이 필요하더라도 제품 라인업의 표시 순서와 상태 구분을 위한 최소 변경에 닫는다.

---

## 2. Selected Structure Mode

```text
hybrid
```

Landing app은 type-based outer structure와 `dashboard-preview` feature pocket을 함께 사용한다. F2는 type-based outer structure 안의 `sections/`와 `lib/`에 닫히는 presentation/copy feature다. `dashboard-preview` pocket은 보존 대상이다.

---

## 3. Allowed Target Paths

### 3-1. Primary Editable Paths

| 경로 | 레이어 | 목적 |
|---|---|---|
| `src/lib/constants.ts` | Utility / Copy Data | 브랜드, 문제/기능/제품/연동 문구 데이터 정리 |
| `src/components/sections/products.tsx` | Presentation / Section | 한글 역할명 우선 제품 카드, 보조 라벨, 구현 예정 상태 표시 |
| `src/components/sections/features.tsx` | Presentation / Section | 기능명을 업무 결과 중심으로 정리 |
| `src/components/sections/problems.tsx` | Presentation / Section | 수작업 감소, 전송/정산 누락 방지 중심 문구 |
| `src/components/sections/integrations.tsx` | Presentation / Section | `화물맨` 외 provider명 일반 기능명화 |
| `src/components/sections/hero.tsx` | Presentation / Section | 구조 변경 없이 CTA/copy scan 대상 반영 |

### 3-2. Conditional Editable Paths

| 경로 | 조건 |
|---|---|
| `src/components/sections/footer.tsx` | footer product link label이 제품 라인업 기준과 충돌할 때만 수정 |
| `src/components/sections/header.tsx` | F1 CTA 기준이 깨진 경우에만 보정 |
| `src/components/sections/cta.tsx` | CTA 문구가 F2 금지어 또는 제품 기준과 충돌할 때만 수정 |

### 3-3. Recommended Test Paths

| 경로 | 검증 목적 |
|---|---|
| `src/__tests__/lib/constants.test.ts` | 금지 문구, 제품명/역할명, 외부 브랜드명 데이터 검증 |
| `src/components/sections/__tests__/products.test.tsx` | 제품 카드/탭의 한글 역할명, 보조 라벨, 구현 예정 표시 검증 |
| `src/components/sections/__tests__/hero.test.tsx` | Hero CTA 문구와 F1 CTA 회귀 확인 |
| `src/components/sections/__tests__/footer.test.tsx` | footer 브랜드/제품 링크 회귀 확인 |

### 3-4. Read-only / Preservation Paths

| 경로 | 정책 |
|---|---|
| `src/components/dashboard-preview/**` | F2 범위 밖. preview 동작, focus animation, overlay는 보존한다. |
| `src/lib/mock-data.ts` | Dashboard preview mock data 범위이므로 F2에서 수정하지 않는다. |
| `src/lib/preview-steps.ts` | dash-preview 시나리오 범위이므로 F2에서 수정하지 않는다. |
| `src/app/globals.css` | 텍스트 overflow를 CSS만으로 해결해야 할 때만 별도 확인 후 최소 수정한다. |
| `package.json` | 신규 dependency 필요 없음. |

---

## 4. Layer Mapping

| Layer | Project Path | 이 Feature에서의 의미 |
|---|---|---|
| Route/App Shell | `src/app/page.tsx` | page composition 유지 |
| Presentation | `src/components/sections/**` | customer-facing 섹션 카피와 표시 순서 |
| Utility / Copy Data | `src/lib/constants.ts` | 제품/기능/문제/연동 데이터 SSOT |
| Test | `src/**/__tests__/**` | copy/data와 section render regression |

---

## 5. Shared Package Touch Points

없음.

F2는 `apps/landing` leaf app 내부에서 닫힌다. `packages/*`, API, DB, 외부 서비스 SDK는 건드리지 않는다.

---

## 6. Verification Notes

| 검증 | 명령 또는 방식 | 기대 결과 |
|---|---|---|
| Targeted tests | `pnpm test -- constants products` 또는 관련 Vitest filter | 제품/문구 회귀 통과 |
| Full tests | `pnpm test` | 0 failures |
| Typecheck | `pnpm typecheck` | TypeScript error 0 |
| Lint | `pnpm lint` | lint error 0 |
| Build | `pnpm build` | production build 성공 |
| Copy scan | `Select-String` 또는 `rg` | 금지 문구와 제한 외부 브랜드명 잔존 없음 |
| Browser spot check | desktop/mobile | 제품 카드/버튼 텍스트 겹침 없음 |

---

## 7. Binding Guardrails

- `OPTIC Broker/Shipper`를 영문 제품명 단독 제목으로 노출하지 않는다.
- 한글 역할명, 보조 라벨, 설명 순서를 유지한다.
- `Carrier/Ops/Billing`은 활성 제품 탭처럼 보이지 않아야 한다.
- 내부 key 변경이 필요한지와 customer-facing copy 변경은 분리해서 판단한다.
- F3 업무 매뉴얼형 섹션을 F2에 끌어오지 않는다.
