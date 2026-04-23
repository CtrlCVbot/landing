# 06. Architecture Binding — F5 UI 잔재 정리

> **Feature slug**: `f5-ui-residue-cleanup`
> **Source Profile**: [`.plans/project/00-dev-architecture.md`](../../../../project/00-dev-architecture.md) (status: approved)
> **작성일**: 2026-04-23
> **작성자**: `/dev-architecture f5-ui-residue-cleanup` (메인 세션)
> **Epic**: [EPIC-20260422-001](../../../../epics/20-active/EPIC-20260422-001/00-epic-brief.md) Phase A

---

## 1. Structure Binding

| 항목 | 값 |
|------|-----|
| Workspace Topology | `monorepo-leaf-single-app` (상위 Profile §3 상속) |
| Selected Structure Mode | `hybrid` (type-based outer + feature-scoped pocket, Profile §4 상속) |
| Layer Style | `layered` (Profile §5 상속) |
| Stack Contract | TypeScript + Next.js 15 App Router + Vitest + Tailwind 4 (Profile §6 상속) |

본 Feature는 **신규 파일·구조·의존성을 추가하지 않는다** (순수 제거/치환 작업). Architecture Profile 영향 없음.

---

## 2. Allowed Target Paths

본 Feature가 **수정**할 수 있는 경로. 이 외 경로 편집 시 `dev-feature-scope-guard.js` 경고. 파일별 변경 라인은 `02-scope-boundaries.md §1` SSOT.

### 2-1. 수정 (edit existing) — 6 파일

**Feature pocket — dashboard-preview**:
1. `src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx`
   - R1: `import { AiExtractJsonViewer } ...` line 45 **삭제**
   - R2: JSX `<AiExtractJsonViewer ... />` line 201-204 **제거**
2. `src/components/dashboard-preview/ai-register-main/ai-panel/` 내 통합 테스트 (실파일명 구현 시 확인)
   - R5: JSON 뷰어 렌더 단정 → 미렌더 단정으로 갱신
3. `src/components/dashboard-preview/hit-areas.ts`
   - R3: `{ id: 'ai-json-viewer', ... }` 엔트리 line 99-102 **제거**
4. `src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx`
   - R6: line 226 `자동 배차` → `자동 배차 대기`
   - R7: JSDoc line 2, 13, 19-20, 51 `자동 배차 토글` → `자동 배차 대기 토글`
5. `src/components/dashboard-preview/ai-register-main/order-form/__tests__/estimate-info-card.test.tsx`
   - R9: line 117, 154, 168 기대 문자열 동기

**추가 (D-006 확장 반영, 2026-04-23)**:
7. `src/__tests__/lib/mock-data.test.ts` (T-CLEANUP-03)
   - canonical tooltips key 16종 → 15종 (`'ai-json-viewer'` 제거)
   - R8 RED 신규 단정 추가 (T-CLEANUP-04)
8. `src/components/dashboard-preview/__tests__/hit-areas.test.ts` (T-CLEANUP-03)
   - canonical 19 → 18 (hit-area `'ai-json-viewer'` 제거)
   - migration 주석 추가

**Utilities 레이어**:
6. `src/lib/mock-data.ts`
   - R4: `'ai-json-viewer': '...'` tooltip 엔트리 line 407 **제거**
   - R8: `'auto-dispatch'` tooltip 값 line 414 **변경** (T-CLEANUP-04)

### 2-2. 명시적 보존 (NOOP — 건드리지 않음)

**가역성 확보 파일** (`02-scope-boundaries.md §2-2` 상세):
- `src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer.tsx` — 컴포넌트 파일 **유지**
- `src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer.test.tsx` — 단위 테스트 **유지**
- `src/lib/mock-data.ts` line 160 (`jsonViewerOpen: boolean` 타입) + line 438 (`jsonViewerOpen: false` 값) — F2 이관 대기
- `src/lib/preview-steps.ts` 각 Step의 `jsonViewerOpen` 필드 — F2 이관 대기

### 2-3. 명시적 금지 (out-of-scope)

F5 범위 외 (`02-scope-boundaries.md §2-1/§2-2`):
- `src/components/dashboard-preview/hit-areas.ts`의 `form-auto-dispatch` / `auto-dispatch` key 변경 금지 (구조적 식별자)
- `autoDispatch` state/props/이벤트 핸들러 변경 금지
- `estimate-info-card.tsx` ON/OFF 뱃지 텍스트 변경 금지
- `delivery-info-card.tsx`, `cargo-info-card.tsx`, `customer-info-card.tsx` 등 유사 구조 컴포넌트 검토 금지 (별도 IDEA 필요)

---

## 3. Recommended Test Paths

| 테스트 유형 | 경로 |
|------------|------|
| ai-panel 통합 테스트 단정 갱신 | `src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/` (또는 feature pocket 내부 `__tests__/`) |
| estimate-info-card 단위 테스트 | `src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.test.tsx` (기존 유지 + 기대 문자열 동기) |
| ai-extract-json-viewer 단위 테스트 | `src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer.test.tsx` (**유지**, 컴포넌트 파일 살아있음) |

**선행 조사 명령** (TDD RED 진입 전 필수):
```bash
grep -rln "AiExtractJsonViewer\|ai-extract-json-viewer\|ai-json-viewer" src/components/dashboard-preview/ai-register-main/ai-panel/*.test.tsx
grep -rn "자동 배차" src/components/dashboard-preview/ai-register-main/order-form/*.test.tsx
```

---

## 4. Shared Package Touch Points

현재 Profile §8-4 — `@mologado/*` 내부 패키지 의존 없음. 본 F5는 leaf app 내부 경로 6 파일만 수정.

향후 고려:
- 없음 (F5는 제거/치환 위주로 새 추상화 도입 없음)

**본 Feature에서는 공유 패키지 touch 없음** (`package.json` 변경 금지).

---

## 5. Verification Notes

### 5-1. 필수 검증 (Profile §9-1 상속)

- `pnpm typecheck` — 0 errors
- `pnpm lint` — 0 errors (ESLint warning 신규 발생 금지)
- `pnpm test src/components/dashboard-preview/ai-register-main/` — 0 failures
- `pnpm dev --turbopack -p 3100` — 정상 기동, JSON 뷰어 비노출 확인

### 5-2. Feature 특화 검증 (`04-implementation-hints.md §3`)

```bash
# JSON 뷰어 완전 비노출
grep -rn "<AiExtractJsonViewer" src/                          # 0 결과
grep -rn "ai-json-viewer" src/components/dashboard-preview/hit-areas.ts src/lib/mock-data.ts  # 0 결과
grep -n "AiExtractJsonViewer" src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx  # 0 결과

# 컴포넌트 파일·mock 필드 유지
ls src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer.tsx  # 존재
grep -rn "jsonViewerOpen" src/lib/mock-data.ts src/lib/preview-steps.ts  # 여러 결과

# 라벨 교체
grep -n "자동 배차" src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx  # 모두 "자동 배차 대기"
grep -n "자동 배차 토글" src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx  # 0 결과
grep -n "자동 배차 대기 토글" src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx  # 5 결과

# Tooltip 동기 (T-CLEANUP-04)
grep -n "조건에 맞는 차량에 자동으로 배차합니다" src/lib/mock-data.ts  # 0 결과
grep -n "자동 배차 대기 중" src/lib/mock-data.ts  # 1 결과

# hit-area key 유지 (구조적 식별자)
grep -n "form-auto-dispatch\|auto-dispatch" src/components/dashboard-preview/hit-areas.ts  # 두 key 존재
```

### 5-3. Red-Green 회귀 검증

T-CLEANUP-03 테스트는 T-CLEANUP-01 편집을 rollback했을 때 FAIL 해야 함 (verification.md Red-Green 3단계).

### 5-4. F1 병렬 실행 시 경계 충돌 해소 (`02-scope-boundaries.md §4`)

| 잠재 충돌 파일 | F1 편집 | F5 편집 | 해소 |
|---------------|---------|---------|------|
| `ai-panel/index.tsx` | className 토큰 치환 | import + JSX 제거 | 같은 라인 충돌 낮음 — F5 선행 merge 권장 |
| `order-form/estimate-info-card.tsx` | className 토큰 치환 | 문자열 + JSDoc | 같은 라인 충돌 낮음 — F5 선행 merge 권장 |

**권장**: F5 선행 merge (Lite, 1.75 인·일) → F1 rebase.

---

## 6. 다음 단계

- `/dev-feature .plans/features/active/f5-ui-residue-cleanup/` 진행 — Phase A/B/C 로 `02-package/` 문서 생성
- Feature Package TASK는 04-implementation-hints.md 의 T-CLEANUP-01~04 초안을 공식 승격
- Epic Phase A 병렬 상대: F1 (`f1-landing-light-theme`)
