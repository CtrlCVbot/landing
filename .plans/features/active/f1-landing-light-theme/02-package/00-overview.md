# 00. Feature Package Overview — F1 라이트 모드 전환 인프라

> **Feature slug**: `f1-landing-light-theme`
> **Lane**: Standard
> **Scenario**: A (Greenfield — 라이트 팔레트 신규)
> **Feature type**: dev
> **Hybrid**: false
> **작성일**: 2026-04-23
> **작성자**: `/dev-feature` Phase A
> **승인 대기**: 사용자 Human Review (Phase B)

---

## 1. 한 줄 요약

landing 사이트 전역에 라이트/다크 양 팔레트 + `next-themes` 기반 ThemeProvider + navbar Sun/Moon 토글을 6개 PR로 도입하여 axe-core 라이트 모드 0 violations 를 달성한다 (Epic §2 지표 4 단독 충족).

---

## 2. Structure Mode

| 항목 | 값 |
|------|-----|
| Workspace Topology | `monorepo-leaf-single-app` ([Profile §3](../../../../project/00-dev-architecture.md) 상속) |
| Structure Mode | `hybrid` (type-based outer + feature-scoped pocket, Profile §4 상속) |
| Layer Style | `layered` (Profile §5 상속) |

본 Feature는 **새 구조를 도입하지 않는다**. 기존 landing leaf app 구조를 그대로 승계.

---

## 3. Allowed Target Paths

본 Feature 가 **신규 생성 또는 수정** 허용 경로. 상세 SSOT: [`06-architecture-binding.md §2`](../00-context/06-architecture-binding.md).

### 3-1. 신규 생성

```
src/components/ThemeToggle.tsx
src/components/providers/theme-provider.tsx         (선택, REQ-005 분리 시)
src/__tests__/light-theme.test.tsx
```

### 3-2. 수정 (App Shell + Dependency)

```
src/app/globals.css                                  (REQ-001~003 토큰 이중화)
src/app/layout.tsx                                   (REQ-005/006 Provider + suppressHydrationWarning)
package.json                                         (REQ-004 next-themes 추가)
```

### 3-3. 수정 (Sections — `src/components/sections/*.tsx`)

```
cta.tsx, features.tsx, footer.tsx, header.tsx,
hero.tsx, integrations.tsx, problems.tsx, products.tsx
```

PR 분할:
- **PR-2**: `header.tsx` (+ `<ThemeToggle />` 통합)
- **PR-3**: `hero.tsx`, `features.tsx`
- ~~**PR-4**~~: ⚠️ **SKIPPED** (`pricing.tsx` / `testimonials.tsx` 파일 미존재, [D-003](../00-context/02-decision-log.md))
- **PR-5**: `footer.tsx`, `cta.tsx`, `integrations.tsx`, `problems.tsx`, `products.tsx`

### 3-4. 수정 (UI primitives + Shared)

```
src/components/ui/badge.tsx, button.tsx, card.tsx, input.tsx, textarea.tsx    (PR-5)
src/components/shared/gradient-blob.tsx, section-wrapper.tsx                   (PR-5)
```

### 3-5. 수정 (Feature pocket — dash-preview 7 파일, PR-6 F5 merge 후)

```
src/components/dashboard-preview/preview-chrome.tsx
src/components/dashboard-preview/interactive-tooltip.tsx
src/components/dashboard-preview/ai-register-main/order-form/datetime-card.tsx
src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx
src/components/dashboard-preview/ai-register-main/order-form/settlement-section.tsx
src/components/dashboard-preview/ai-register-main/order-form/transport-option-card.tsx
src/components/dashboard-preview/ai-register-main/order-form/index.tsx
```

### 3-6. 금지 (out-of-scope)

```
src/lib/mock-data.ts                                  (F2/F3/F5 범위)
src/components/dashboard-preview/hit-areas.ts         (F4/F5 범위)
src/lib/preview-steps.ts                              (F2 범위)
src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx  (F5 범위 — 렌더 제거)
```

---

## 4. Layer Mapping

Profile §7 상속. 본 Feature 가 건드리는 레이어:

| 레이어 | 경로 | 변경 성격 |
|--------|------|-----------|
| Route + App Shell | `src/app/globals.css`, `src/app/layout.tsx` | 토큰 + Provider |
| Sections | `src/components/sections/*.tsx` | 클래스 치환 |
| Feature pocket | `src/components/dashboard-preview/*.tsx` (7파일) | 클래스 치환 (PR-6, F5 merge 후) |
| UI primitives | `src/components/ui/*.tsx` | 클래스 치환 |
| Shared presentational | `src/components/shared/*.tsx` | 클래스 치환 |
| Providers | `src/components/providers/theme-provider.tsx` (선택) | 신규 |
| 공용 Presentational | `src/components/ThemeToggle.tsx` | 신규 |
| Tests (global) | `src/__tests__/light-theme.test.tsx` | 신규 |

본 Feature 는 **도메인 로직 계층 · 외부 포트 계층 touch 없음** (랜딩 페이지 특성).

---

## 5. Stack Contract

Profile §6 상속. 본 Feature 도입 Stack 증분:

| 영역 | 추가/변경 | 버전 |
|------|----------|------|
| Theme library | **신규** `next-themes` | `^0.3.0` |
| Test matrix | **신규** `src/__tests__/light-theme.test.tsx` (axe + 스냅샷 + SSR) | — |

기존 Stack 변경 **없음** (next ^15.1, react ^18.3, tailwindcss ^4.0, vitest ^3.0 유지).

**금지** (Profile §6 forbidden 재확인):
- `tailwind.config.ts` 참조/도입 금지 (Tailwind 4 — `globals.css` `@theme inline` 대체)
- CSS-in-JS 라이브러리 (styled-components, emotion) 도입 금지
- Jest 도입 금지 (Vitest로 통일)

---

## 6. Shared vs Local Rule

Profile §8 상속. 본 Feature 의 적용:

### 6-1. Local (기본)

- `ThemeToggle.tsx`: 1회 사용 (navbar header) → 초기 Local 배치 `src/components/ThemeToggle.tsx`
- 섹션별 토큰 치환: 각 섹션 Local, shared 승격 없음 (단순 클래스 치환)

### 6-2. Shared 승격 후보

다음 조건 충족 시 승격 검토 (Profile §8-2):

1. `ThemeToggle.tsx` 가 다른 앱·leaf 에서 재사용되면 `src/components/shared/` 또는 `packages/ui` 로 승격
2. 라이트/다크 토큰 세트가 다른 leaf 에서도 필요하면 `packages/tokens` 추출 (별도 Feature)

**본 Feature 에서 Shared 승격 수행 없음** — 모두 Local.

### 6-3. Cross-package touch points

없음. `packages/*` 변경 금지 (monorepo 루트 격리).

---

## 7. 요구사항 추적 (REQ ↔ TASK ↔ TC)

PRD §5 REQ → 본 Feature Package TASK (T-THEME-01~08) → 테스트 케이스 (`02-package/09-test-cases.md`) 매핑.

| REQ | TASK | TC |
|-----|------|-----|
| REQ-001 ~ REQ-003 | T-THEME-01 | TC-F1-01 (globals.css 검증) |
| REQ-004 | T-THEME-03 | TC-F1-03 (번들 증분) |
| REQ-005, REQ-006 | T-THEME-02 | TC-F1-02 (hydration 0건) |
| REQ-007, REQ-009 | T-THEME-04 | TC-F1-04 (ThemeToggle 단위) |
| REQ-008 | T-THEME-04 | TC-F1-04 (navbar 배치) |
| REQ-010 (hero/features) | T-THEME-05 | TC-F1-05 (Hero/Features axe) |
| ~~REQ-010 (pricing/testimonials)~~ | ~~T-THEME-06~~ SKIPPED | ~~TC-F1-06~~ SKIPPED |
| REQ-010 (footer) + REQ-012 | T-THEME-07 | TC-F1-07 (Footer+SharedUI axe) |
| REQ-011 | T-THEME-08 | TC-F1-08 (Dash-preview axe) |
| REQ-013 | T-THEME-03 (PR-1 포함) | TC-F1-01 (매핑표 검증) |
| REQ-014 | 전 TASK | TC-F1-09 (3중 grep 검증) |

---

## 8. 경로 계약 (`/dev-run` 필요 정보)

`/dev-run` 이 `dev-implementer` 를 호출할 때 필요한 경로:

| 항목 | 값 |
|------|-----|
| Feature root | `.plans/features/active/f1-landing-light-theme/` |
| Dev tasks SSOT | `02-package/08-dev-tasks.md` |
| Test cases SSOT | `02-package/09-test-cases.md` |
| Architecture binding | `00-context/06-architecture-binding.md` |
| Allowed paths (guard) | 본 문서 §3 + binding §2 |

---

## 9. 일관성 점검 (PRD ↔ Overview)

| 항목 | PRD 값 | Overview 값 | 일치 |
|------|--------|------------|-----|
| Lane | Standard | Standard | ✓ |
| 시나리오 | A | A | ✓ |
| Feature 유형 | dev | dev | ✓ |
| Hybrid | false | false | ✓ |
| REQ 개수 | 14 | 14 (모두 TASK 매핑) | ✓ |
| NFR 개수 | 10 | 10 (모두 검증 경로 존재) | ✓ |
| PR 개수 | 6 | 5 (PR-4 Skip, D-003) | ⚠️ 실체 반영 |
| 예상 TASK 수 | 6~8 | 7 (T-THEME-01~05, 07, 08; T-THEME-06 Skip) | ⚠️ 실체 반영 |
| Effort | 10 인·일 | 9 인·일 (직렬) / 8.5 인·일 (병렬) | ⚠️ PR-4 제외 반영 |
| Milestones | M-Epic-1 (2026-05-06) | Phase A 종료 2026-05-06 | ✓ |

**PRD 이탈 없음. Overview 승인 가능**.

---

## 10. 다음 단계 (Phase B/C)

### Phase B — Human Review

사용자가 본 Overview 를 검토하고 승인한 후 Phase C 진입.

체크포인트 (type: `review-approval`, Critical 아님):
- [ ] Structure Mode 이해
- [ ] Allowed Target Paths 이상 없음
- [ ] Layer Mapping 이상 없음
- [ ] Stack Contract 이상 없음
- [ ] Shared vs Local 이상 없음
- [ ] 일관성 점검 (§9) 확인

### Phase C — Feature Package 생성

승인 후 생성할 문서:
- `01-requirements.md` — REQ-001~014 상세 수용 기준
- `02-ui-spec.md` — UI 변경 (ThemeToggle + 섹션별 토큰 클래스)
- `06-domain-logic.md` — 간단 (테마 상태 관리)
- `08-dev-tasks.md` — T-THEME-01~08 공식 승격
- `09-test-cases.md` — TC-F1-01~09
- `10-release-checklist.md` — 6 PR 체크리스트

본 Feature 는 도메인 로직이 단순 (테마 토글만) 이므로 `03-flow.md`, `04-api-spec.md`, `05-db-migration-spec.md`, `07-error-handling.md` 는 생략.
