# 09. Test Cases — F5 UI 잔재 정리

> 각 R (R1~R9) / K (K1~K5) 를 검증하는 테스트 케이스.
> Test runner: Vitest.

---

## TC 목록 요약

| TC | 제목 | R/K | TASK | 유형 |
|----|------|-----|------|------|
| TC-F5-01 | ai-panel 렌더 경로 제거 검증 | R1, R2, R3, R4 | T-CLEANUP-01 | 회귀 검증 (grep + 단위) |
| TC-F5-02 | estimate-info-card 라벨 + JSDoc | R6, R7 | T-CLEANUP-02 | 회귀 검증 (grep + 스냅샷) |
| TC-F5-03 | 통합 테스트 미렌더 단정 + 기대 문자열 동기 | R5, R9 | T-CLEANUP-03 | 통합 |
| TC-F5-04 | Tooltip `auto-dispatch` 문구 | R8 | T-CLEANUP-04 | 회귀 검증 (grep) |
| TC-F5-05 | 가역성 (NOOP 항목) 유지 | K1~K5 | 전 TASK | 회귀 검증 |

---

## TC-F5-01 — ai-panel 렌더 경로 제거 검증

**목적**: `<AiExtractJsonViewer>` 화면 비노출 + 관련 hit-area/tooltip 엔트리 제거.

### 검증

```bash
# R1: import 제거
grep -n "import.*AiExtractJsonViewer" src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx  # 0

# R2: JSX 렌더 제거
grep -n "<AiExtractJsonViewer" src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx  # 0

# R3: hit-area 엔트리 제거
grep -n "ai-json-viewer" src/components/dashboard-preview/hit-areas.ts  # 0

# R4: mock tooltip 엔트리 제거
grep -n "ai-json-viewer" src/lib/mock-data.ts  # 0

# 전역 확인
grep -rn "<AiExtractJsonViewer" src/  # 0
```

### 수용 기준 (Draft §2)
- 지표 1: `AiExtractJsonViewer` 화면 비노출 → grep 결과 0
- 지표 2: 미사용 식별자 잔존 제거 → grep 결과 0

---

## TC-F5-02 — estimate-info-card 라벨 + JSDoc

**목적**: "자동 배차" → "자동 배차 대기" 사용자 가시 라벨 + JSDoc 주석 동기.

### 검증

```bash
# 라벨 전수 확인
grep -n "자동 배차" src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx
# 기대: 모든 결과가 "자동 배차 대기"

# 구(舊) JSDoc 잔존 확인
grep -n "자동 배차 토글" src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx
# 기대: 0

# 신(新) JSDoc 반영 확인
grep -n "자동 배차 대기 토글" src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx
# 기대: 5 (JSDoc line 2, 13, 19-20, 51)
```

### 스냅샷 검증 (선택)

```bash
pnpm test estimate-info-card.test.tsx -- --update-snapshot
# 수동 검토 후 stashdiff 확인: span 내부 텍스트만 변경, className 불변
```

### 수용 기준 (Draft §2 지표 4)
- 지표 4: 라벨 반영 → grep 결과 "자동 배차" 모두 "자동 배차 대기"

---

## TC-F5-03 — 통합 테스트 미렌더 단정 + 기대 문자열 동기

**목적**: 회귀 방지 — 변경된 런타임 동작을 테스트가 검증.

### ai-panel 통합 테스트 갱신 (R5)

```tsx
// src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/ai-panel.test.tsx (가정)

describe('AI 패널', () => {
  it('JSON 뷰어를 렌더하지 않는다', () => {
    render(<AiPanel {...defaultProps} />)
    expect(screen.queryByTestId('ai-extract-json-viewer')).not.toBeInTheDocument()
  })
})
```

### estimate-info-card 기대 문자열 동기 (R9)

```tsx
// estimate-info-card.test.tsx (line 117, 154, 168)

// 기존:
expect(screen.getByText('자동 배차')).toBeInTheDocument()

// 변경:
expect(screen.getByText('자동 배차 대기')).toBeInTheDocument()
```

### Red-Green 2차 검증

```bash
# 테스트 교체 후 (T-CLEANUP-01 전)
pnpm test ai-panel.test.tsx                # FAIL (JSON 뷰어가 아직 렌더 중)

# T-CLEANUP-01 수행 후
pnpm test ai-panel.test.tsx                # PASS

# 회귀 검증
git stash                                  # T-CLEANUP-01 rollback
pnpm test ai-panel.test.tsx                # FAIL (테스트가 실제로 변경을 검증 중)
git stash pop
pnpm test ai-panel.test.tsx                # PASS 복원
```

### 수용 기준
- `pnpm test src/components/dashboard-preview/ai-register-main/` → 0 failures
- Red-Green 2차 순환 통과 (verification.md 3단계)

---

## TC-F5-04 — Tooltip `auto-dispatch` 문구

**목적**: 라벨 ↔ tooltip UX 일관성.

### 검증

```bash
# 구 문구 제거
grep -n "조건에 맞는 차량에 자동으로 배차합니다" src/lib/mock-data.ts
# 기대: 0

# 신 문구 반영
grep -n "자동 배차 대기 중 — 배차요청 자동 승인되어 배차대기상태로 전환합니다" src/lib/mock-data.ts
# 기대: 1

# 기존 단정 테스트 확인 (구 문구 참조하는 테스트 있을 경우)
grep -rn "조건에 맞는 차량에 자동으로 배차합니다" src/
# 기대: 0
```

### 수용 기준 (Draft §2 지표 5)
- 지표 5: Tooltip 동기 → `'auto-dispatch'` 값이 "자동 배차 대기 중 — 배차요청 자동 승인되어 배차대기상태로 전환합니다"

---

## TC-F5-05 — 가역성 (NOOP 항목) 유지 확인

**목적**: K1~K5 "유지" 항목이 실제로 유지되는지 검증.

### 검증

```bash
# K1: 컴포넌트 파일 유지
ls src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer.tsx
# 기대: 파일 존재

# K2: 단위 테스트 유지
ls src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer.test.tsx
# 기대: 파일 존재
pnpm test ai-extract-json-viewer.test.tsx
# 기대: 단위 테스트 PASS (컴포넌트 파일 살아있으므로)

# K3: mock-data `jsonViewerOpen` 필드 유지
grep -n "jsonViewerOpen" src/lib/mock-data.ts
# 기대: 2 결과 (line 160 타입, line 438 값)

# K4: preview-steps `jsonViewerOpen` 필드 유지
grep -n "jsonViewerOpen" src/lib/preview-steps.ts
# 기대: 여러 결과 (각 Step)

# K5: hit-area key 유지 (구조적 식별자)
grep -n "form-auto-dispatch\|auto-dispatch" src/components/dashboard-preview/hit-areas.ts
# 기대: 두 key 존재
```

### 수용 기준 (Draft §2 지표 3)
- 지표 3: `jsonViewerOpen` mock 필드 보존 → grep 결과 여러

### 회귀 리스크
- 구현 중 orphan 제거 유혹: `ai-extract-json-viewer.tsx` 를 "미사용" 으로 판단하고 삭제 시도 → **금지 (K1)**. 컴포넌트 파일은 렌더 경로에서 분리되었을 뿐 파일은 살아있어야 함.

---

## 공통 실행

```bash
# F5 범위 테스트
pnpm test src/components/dashboard-preview/ai-register-main/

# F5 특화 회귀 검증 (04-implementation-hints.md §3 전수)
bash -c '
grep -rn "<AiExtractJsonViewer" src/ || true
grep -rn "ai-json-viewer" src/components/dashboard-preview/hit-areas.ts src/lib/mock-data.ts || true
ls src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer.tsx
grep -rn "jsonViewerOpen" src/lib/mock-data.ts src/lib/preview-steps.ts
grep -n "자동 배차" src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx
grep -n "form-auto-dispatch\|auto-dispatch" src/components/dashboard-preview/hit-areas.ts
'

pnpm typecheck
```

**통과 조건**: TC-F5-01~05 전수 통과 + `pnpm test src/components/dashboard-preview/ai-register-main/` 0 failures + `pnpm typecheck` 0 errors.
