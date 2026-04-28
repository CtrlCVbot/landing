# 00. Feature Package Overview — F5 UI 잔재 정리

> **Feature slug**: `f5-ui-residue-cleanup`
> **Lane**: Lite
> **Scenario**: B (Partial — copy convention 기록용, copy 파이프라인 미진입)
> **Feature type**: dev
> **Hybrid**: false
> **작성일**: 2026-04-23
> **작성자**: `/dev-feature` Phase A
> **승인 대기**: 사용자 Human Review (Phase B)

---

## 1. 한 줄 요약

dash-preview Phase 3 archived 직후 사용자 피드백 10건 중 이슈 [5]·[6]을 4개 TASK 로 해소한다 — `AiExtractJsonViewer` 렌더 제거 (컴포넌트 파일 유지) + "자동 배차" → "자동 배차 대기" 라벨 교체 + 관련 mock/tooltip/테스트 동기.

---

## 2. Structure Mode

| 항목 | 값 |
|------|-----|
| Workspace Topology | `monorepo-leaf-single-app` (Profile §3 상속) |
| Structure Mode | `hybrid` (Profile §4 상속) |
| Layer Style | `layered` (Profile §5 상속) |

본 Feature 는 **신규 파일 · 구조 · 의존성을 추가하지 않는다** (순수 제거/치환). Architecture Profile 영향 없음.

---

## 3. Allowed Target Paths

본 Feature 가 **수정** 허용 경로 (신규 생성 없음). 상세 SSOT: [`06-architecture-binding.md §2`](../00-context/06-architecture-binding.md).

### 3-1. 수정 (편집 대상 6 파일)

```
src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx                        (R1, R2)
src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/*.test.tsx            (R5, 실파일명 구현 시 확인)
src/components/dashboard-preview/hit-areas.ts                                                (R3)
src/lib/mock-data.ts                                                                          (R4, R8)
src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx          (R6, R7)
src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.test.tsx     (R9)
```

### 3-2. 명시적 보존 (NOOP — 가역성)

```
src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer.tsx         (컴포넌트 파일)
src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer.test.tsx    (단위 테스트)
src/lib/mock-data.ts:160                                                                       (jsonViewerOpen 타입)
src/lib/mock-data.ts:438                                                                       (jsonViewerOpen 값)
src/lib/preview-steps.ts                                                                       (각 Step jsonViewerOpen)
src/components/dashboard-preview/hit-areas.ts                                                  (form-auto-dispatch / auto-dispatch key)
```

### 3-3. 금지 (out-of-scope)

```
autoDispatch state/props/이벤트 핸들러 변경
estimate-info-card.tsx ON/OFF 뱃지 텍스트 변경
delivery-info-card.tsx, cargo-info-card.tsx, customer-info-card.tsx 등 유사 컴포넌트 검토
AiExtractJsonViewer.tsx 컴포넌트 내부 로직 변경
package.json 의존성 추가
```

---

## 4. Layer Mapping

Profile §7 상속. 본 Feature 가 건드리는 레이어:

| 레이어 | 경로 | 변경 성격 |
|--------|------|-----------|
| Feature pocket | `src/components/dashboard-preview/**/*.tsx` (4파일) | 렌더 제거 + 라벨 치환 |
| Utility | `src/lib/mock-data.ts` | 엔트리 제거 + 문구 변경 |
| Tests | `src/components/dashboard-preview/**/__tests__/*.test.tsx` | 단정문 동기 |

본 Feature 는 **App Shell · Sections · UI primitives · Shared · Providers · 신규 테스트 파일 touch 없음**.

---

## 5. Stack Contract

Profile §6 상속. 본 Feature **Stack 증분 없음**:

| 영역 | 변경 |
|------|------|
| Dependency | 없음 (`package.json` 변경 금지) |
| Test matrix | 기존 테스트 단정문 갱신만 |
| Framework | 없음 |

**금지** (Profile §6 forbidden 재확인):
- `tailwind.config.ts` 참조 금지
- 새 라이브러리 도입 금지
- 신규 테스트 파일 생성 최소화 (기존 테스트 갱신 위주)

---

## 6. Shared vs Local Rule

Profile §8 상속. 본 Feature 의 적용:

### 6-1. Local (기본)

모든 변경이 Local 범위. Shared 승격 없음.

### 6-2. Shared 승격 후보

없음. 본 Feature 는 제거/치환 작업으로 새 추상화 도입 없음.

### 6-3. Cross-package touch points

없음. `packages/*` 변경 금지.

---

## 7. 요구사항 추적 (R ↔ TASK ↔ TC)

Draft §3 R → 본 Feature Package TASK (T-CLEANUP-01~04) → TC 매핑.

| R | TASK | TC |
|---|------|-----|
| R1, R2 | T-CLEANUP-01 | TC-F5-01 (ai-panel 렌더 확인) |
| R3 | T-CLEANUP-01 | TC-F5-01 (hit-area 엔트리) |
| R4 | T-CLEANUP-01 | TC-F5-01 (mock tooltip) |
| R5 | T-CLEANUP-03 | TC-F5-03 (통합 테스트 미렌더 단정) |
| R6, R7 | T-CLEANUP-02 | TC-F5-02 (라벨 + JSDoc 동기) |
| R8 | T-CLEANUP-04 | TC-F5-04 (tooltip 문구) |
| R9 | T-CLEANUP-03 | TC-F5-03 (기대 문자열 동기) |
| K1~K5 | 전 TASK | TC-F5-05 (가역성 유지 확인) |

---

## 8. 경로 계약 (`/dev-run` 필요 정보)

| 항목 | 값 |
|------|-----|
| Feature root | `.plans/features/active/f5-ui-residue-cleanup/` |
| Dev tasks SSOT | `02-package/08-dev-tasks.md` |
| Test cases SSOT | `02-package/09-test-cases.md` |
| Architecture binding | `00-context/06-architecture-binding.md` |
| Allowed paths (guard) | 본 문서 §3 + binding §2 |

---

## 9. 일관성 점검 (Draft ↔ Overview)

| 항목 | Draft 값 | Overview 값 | 일치 |
|------|----------|------------|-----|
| Lane | Lite | Lite | ✓ |
| 시나리오 | B | B | ✓ |
| Feature 유형 | dev | dev | ✓ |
| Hybrid | false | false | ✓ |
| R 개수 | 9 (R1~R9) | 9 (모두 TASK 매핑) | ✓ |
| K 개수 (유지 항목) | 5 (K1~K5) | 5 (§3-2 보존) | ✓ |
| 편집 파일 | 6 | 6 | ✓ |
| 예상 TASK 수 | 4 | 4 (T-CLEANUP-01~04) | ✓ |
| Effort | 2 인·일 | 1.75 인·일 | ✓ |
| PRD 생략 | Lite → 생략 | Lite → 생략 (D-003) | ✓ |

**Draft 이탈 없음. Overview 승인 가능**.

---

## 10. 다음 단계 (Phase B/C)

### Phase B — Human Review

사용자가 본 Overview 를 검토하고 승인한 후 Phase C 진입.

체크포인트 (type: `review-approval`):
- [ ] Structure Mode 이해
- [ ] Allowed Target Paths 이상 없음
- [ ] Layer Mapping 이상 없음
- [ ] Stack Contract 이상 없음
- [ ] Shared vs Local 이상 없음
- [ ] 일관성 점검 (§9) 확인

### Phase C — Feature Package 생성

승인 후 생성할 문서:
- `01-requirements.md` — R1~R9 + K1~K5 상세 수용 기준
- `06-domain-logic.md` — 간단 (UI 잔재 정리, 도메인 로직 변경 없음)
- `08-dev-tasks.md` — T-CLEANUP-01~04 공식 승격
- `09-test-cases.md` — TC-F5-01~05
- `10-release-checklist.md` — 4 TASK 체크리스트

본 Feature 는 UI 최소 변경 (렌더 제거 + 라벨 치환) 으로 `02-ui-spec.md`, `03-flow.md`, `04-api-spec.md`, `05-db-migration-spec.md`, `07-error-handling.md` 는 생략.
