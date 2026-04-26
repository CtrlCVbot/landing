# 04. Implementation Hints — F5 UI 잔재 정리

> 구현 에이전트 (`dev-implementer`) 와 사용자 개발 시 참고할 TASK 힌트·TDD 예시·회귀 검증 명령.
> 이 문서는 **힌트** 이며 확정 TASK 는 `/dev-feature` 가 `dev-tasks.md` 로 생성. 본 문서는 RICE Effort 2 인·일 기반 예상치.

---

## 1. 예상 TASK 분할 (T-CLEANUP-01 ~ T-CLEANUP-04)

### T-CLEANUP-01 — AiExtractJsonViewer 렌더 경로 제거

**목표**: 화면에서 JSON 뷰어 비노출 (가역성 보존: 컴포넌트 파일 유지).

**편집 파일 (4 건)**:

| 파일 | 변경 | 라인 |
|------|------|------|
| `src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx` | `import { AiExtractJsonViewer } ...` **삭제** | 45 |
| `src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx` | `<AiExtractJsonViewer json={...} defaultOpen={...} />` JSX **제거** | 201-204 |
| `src/components/dashboard-preview/hit-areas.ts` | `{ id: 'ai-json-viewer', ... }` 엔트리 **제거** | 99-102 |
| `src/lib/mock-data.ts` | `'ai-json-viewer': '원본 추출 결과를 ...'` tooltip **제거** | 407 |

**유지 (NOOP)**:
- `src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer.tsx` (컴포넌트 파일)
- `src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer.test.tsx` (단위 테스트)
- `src/lib/mock-data.ts` line 160 (`jsonViewerOpen: boolean` 타입), line 438 (`jsonViewerOpen: false` 값)
- `src/lib/preview-steps.ts` 각 Step 의 `jsonViewerOpen` 필드

**완료 조건**:
- [ ] `grep -rn "<AiExtractJsonViewer" src/` → 0 결과
- [ ] `grep -rn "ai-json-viewer" src/components/dashboard-preview/hit-areas.ts src/lib/mock-data.ts` → 0 결과
- [ ] `grep -n "AiExtractJsonViewer" src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx` → 0 결과 (import·JSX 모두 제거)
- [ ] `ls src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer.tsx` → 파일 존재 확인
- [ ] `grep -rn "jsonViewerOpen" src/lib/mock-data.ts src/lib/preview-steps.ts` → 여전히 존재 (유지 확인)
- [ ] `pnpm test` 또는 `pnpm typecheck` 통과

**예상 소요**: 0.5 인·일

---

### T-CLEANUP-02 — estimate-info-card 라벨 교체 + JSDoc 동기

**목표**: "자동 배차" → "자동 배차 대기" 로 사용자 가시 라벨과 JSDoc 주석 동기.

**편집 파일 (1 건)**:

| 파일 | 변경 | 라인 |
|------|------|------|
| `src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx` | `<span className="text-xs font-medium">자동 배차</span>` → `자동 배차 대기` | 226 |
| `src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx` | JSDoc "자동 배차 토글" → "자동 배차 대기 토글" | 2, 13, 19-20, 51 |

**Out-of-scope (건드리지 않음)**:
- `autoDispatch` state/props 타입·이벤트 핸들러
- ON/OFF 뱃지 내부 텍스트
- hit-area key `form-auto-dispatch`, `auto-dispatch` (구조적 식별자 유지)

**완료 조건**:
- [ ] `grep -n "자동 배차" src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx` → 모든 결과가 "자동 배차 대기"
- [ ] `grep -n "자동 배차 토글" src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx` → 0 결과
- [ ] `grep -n "자동 배차 대기 토글" src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx` → JSDoc 5 곳 모두 반영
- [ ] `pnpm typecheck` 통과 (JSDoc 변경은 TS 체크 비대상이지만 별도 린터 정책이 있을 경우 확인)

**예상 소요**: 0.25 인·일

---

### T-CLEANUP-03 — 테스트 갱신 (ai-panel 통합 + estimate-info-card)

**목표**: 변경된 런타임 동작을 테스트가 보호하도록 단정문 갱신.

**편집 파일 (2 건)**:

| 파일 | 변경 |
|------|------|
| `src/components/dashboard-preview/ai-register-main/ai-panel/` 내 통합 테스트 (실파일명은 구현 시 확인) | JSON 뷰어 렌더 단정 → **미렌더 단정** 으로 교체 (예: `expect(screen.queryByTestId('ai-extract-json-viewer')).not.toBeInTheDocument()`) |
| `src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.test.tsx` | line 117·154·168 의 describe/it 블록 + 단정문의 기대 문자열 `자동 배차` → `자동 배차 대기` 동기 |

**테스트 영향 맵 선행 조사 (TDD RED 진입 전 필수)**:

```bash
# JSON 뷰어 렌더를 단정하는 테스트 파일 식별
grep -rln "AiExtractJsonViewer\|ai-extract-json-viewer\|ai-json-viewer" src/components/dashboard-preview/ai-register-main/ai-panel/*.test.tsx

# 라벨 "자동 배차" 단정 지점 전수 확인
grep -rn "자동 배차" src/components/dashboard-preview/ai-register-main/order-form/*.test.tsx
```

**완료 조건**:
- [ ] `pnpm test src/components/dashboard-preview/ai-register-main/` → 0 failure
- [ ] `ai-extract-json-viewer.test.tsx` 단위 테스트 **유지** (컴포넌트 파일 살아있음)
- [ ] 미렌더 단정이 T-CLEANUP-01 완료 후 **실제로 PASS** (T-CLEANUP-01 rollback 시 FAIL 확인 — Red-Green 검증)

**예상 소요**: 0.75 인·일

---

### T-CLEANUP-04 (선택) — Tooltip `auto-dispatch` 문구 변경

**목표**: 라벨 변경 (T-CLEANUP-02) 과 tooltip 문구 UX 일관성 확보.

**편집 파일 (1 건)**:

| 파일 | 변경 | 라인 |
|------|------|------|
| `src/lib/mock-data.ts` | tooltip `'auto-dispatch'` 값 교체 | 414 |

```diff
- 'auto-dispatch': '조건에 맞는 차량에 자동으로 배차합니다',
+ 'auto-dispatch': '자동 배차 대기 중 — 조건 충족 시 자동 배차합니다',
```

**근거**: `03-design-decisions.md` 결정 포인트 1 참조.

**완료 조건**:
- [ ] `grep -n "조건에 맞는 차량에 자동으로 배차합니다" src/lib/mock-data.ts` → 0 결과
- [ ] `grep -n "자동 배차 대기 중 — 조건 충족 시 자동 배차합니다" src/lib/mock-data.ts` → 1 결과
- [ ] 기존 tooltip 문구를 단정하는 테스트가 있을 경우 동기 (`grep -rn "조건에 맞는 차량에 자동으로 배차합니다" src/` → 0 결과)

**병합 권고**: T-CLEANUP-04 를 **T-CLEANUP-02 와 같은 커밋에 포함** (결정 포인트 1 의 "라벨 ↔ tooltip UX 일관성" 은 함께 적용되어야 의미). 단 TASK ID 는 분리해 추적성 유지.

**예상 소요**: 0.25 인·일

---

## 2. TDD 사이클 예시 (T-CLEANUP-03)

> 통합 테스트가 "JSON 뷰어 미렌더" 를 단정하도록 갱신하는 Red-Green-Improve 사이클.

### RED (실패 테스트 작성)

T-CLEANUP-01 편집을 수행하기 **전**에 테스트를 먼저 갱신:

```tsx
// src/components/dashboard-preview/ai-register-main/ai-panel/ai-panel.test.tsx (가정)

it('AI 패널은 JSON 뷰어를 렌더하지 않는다', () => {
  render(<AiPanel {...defaultProps} />)
  // 기존 단정: expect(screen.getByTestId('ai-extract-json-viewer')).toBeInTheDocument()
  // 신규 단정:
  expect(screen.queryByTestId('ai-extract-json-viewer')).not.toBeInTheDocument()
})
```

**실행**: `pnpm test ai-panel.test.tsx` → **FAIL** (현재 JSON 뷰어가 렌더되고 있으므로 `not.toBeInTheDocument()` 실패) → RED 확인.

### GREEN (최소 구현)

T-CLEANUP-01 편집 수행:
- `ai-panel/index.tsx` line 45 import 삭제
- `ai-panel/index.tsx` line 201-204 JSX 제거

**실행**: `pnpm test ai-panel.test.tsx` → **PASS** → GREEN 확인.

### IMPROVE (리팩토링·품질 점검)

- 관련 미사용 import 있는지 확인 (`AiExtractJsonViewer` 만 제거됐으니 orphan import 없음)
- TS 컴파일 `pnpm typecheck` 통과 확인
- 다른 테스트 회귀 `pnpm test src/components/dashboard-preview/` 통과 확인

### 회귀 검증 (Red-Green 2차 순환)

수정을 잠시 되돌려 (line 45·201-204 rollback) 테스트가 다시 실패하는지 확인:

```bash
git stash  # T-CLEANUP-01 편집만 stash
pnpm test ai-panel.test.tsx  # FAIL 재확인 → 테스트가 실제로 변경을 검증 중
git stash pop  # 편집 복원
pnpm test ai-panel.test.tsx  # PASS 재확인
```

이 사이클이 `verification.md` Red-Green Verification 의 3단계 (작성→실패→수정복원→통과) 와 정합.

---

## 3. 회귀 검증 명령 (구현 완료 시 전체 실행)

```bash
# 1. JSON 뷰어 완전 비노출 확인 (T-CLEANUP-01 검증)
grep -rn "<AiExtractJsonViewer" src/   # 0 결과 기대
grep -rn "ai-json-viewer" src/components/dashboard-preview/hit-areas.ts src/lib/mock-data.ts   # 0 결과 기대
grep -n "AiExtractJsonViewer" src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx   # 0 결과 기대

# 2. 컴포넌트 파일·mock 필드 유지 확인
ls src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer.tsx   # 존재 기대
grep -rn "jsonViewerOpen" src/lib/mock-data.ts src/lib/preview-steps.ts   # 여러 결과 기대 (유지 확인)

# 3. 라벨 교체 확인 (T-CLEANUP-02 검증)
grep -n "자동 배차" src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx   # 모두 "자동 배차 대기"
grep -n "자동 배차 토글" src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx   # 0 결과 기대
grep -n "자동 배차 대기 토글" src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx   # 5 결과 기대 (JSDoc line 2·13·19-20·51)

# 4. Tooltip 동기 확인 (T-CLEANUP-04 검증)
grep -n "조건에 맞는 차량에 자동으로 배차합니다" src/lib/mock-data.ts   # 0 결과 기대
grep -n "자동 배차 대기 중 — 조건 충족 시 자동 배차합니다" src/lib/mock-data.ts   # 1 결과 기대

# 5. 테스트 전체 통과
pnpm test src/components/dashboard-preview/ai-register-main/
pnpm typecheck

# 6. hit-area key 유지 확인 (결정 포인트 2 검증)
grep -n "form-auto-dispatch\|auto-dispatch" src/components/dashboard-preview/hit-areas.ts   # 두 key 존재 기대
```

---

## 4. 예상 총 소요

- T-CLEANUP-01: 0.5 인·일 (import + JSX + hit-area + tooltip 제거)
- T-CLEANUP-02: 0.25 인·일 (라벨 + JSDoc 5곳 동기)
- T-CLEANUP-03: 0.75 인·일 (테스트 영향 맵 선행 + 미렌더 단정 + 라벨 단정 3곳)
- T-CLEANUP-04: 0.25 인·일 (tooltip 문구 교체)

**합계**: 약 **1.75 인·일** (RICE Effort 2 인·일 예측치 이내).

TDD RED→GREEN→IMPROVE 루프 + 회귀 검증 (`pnpm test`, grep 명령) 포함. `dev-tdd-guard.js` 활성 환경에서 테스트 없는 구현은 차단됨.

---

## 5. 다음 단계

- **Step 8**: `/plan-epic advance EPIC-20260422-001 --to=active`
- **Step 9**: `/dev-feature .plans/features/active/f5-ui-residue-cleanup/` → `dev-tasks.md` 생성 (본 문서의 예상 TASK 가 공식 TASK ID 로 승격) → `/dev-run` (TDD 루프)
- F1 (`f1-landing-light-theme`) 과 병렬 실행 (메인이 TeamCreate 로 팀 구성 후 각 Feature 에 `dev-implementer` 1 인 할당)
