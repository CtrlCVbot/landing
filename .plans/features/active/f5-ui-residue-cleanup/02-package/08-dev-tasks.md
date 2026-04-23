# 08. Dev Tasks — F5 UI 잔재 정리

> **SSOT** for `/dev-run` TASK 실행. TASK ID: `T-CLEANUP-{NN}` (task-id-naming.md IMP-KIT-015 준수).
> Lane `Lite` → 4 TASK + 단일 PR 권고 (또는 2 PR 분할).
> 상세 힌트: [`04-implementation-hints.md`](../00-context/04-implementation-hints.md) 참조 (라인 번호·치환 규칙·grep 명령).

---

## TASK 목록

| TASK | 제목 | 선행 | 파일 | Effort |
|------|------|------|------|:------:|
| T-CLEANUP-01 | AiExtractJsonViewer 렌더 경로 제거 | — | 4 | 0.5 인·일 |
| T-CLEANUP-02 | estimate-info-card 라벨 + JSDoc 동기 | — (T-01 병렬 가능) | 1 | 0.25 인·일 |
| T-CLEANUP-03 | 테스트 갱신 (ai-panel 통합 + estimate-info-card) | T-CLEANUP-01 선행 (RED 기반) | 2 | 0.75 인·일 |
| T-CLEANUP-04 | Tooltip `auto-dispatch` 문구 변경 | T-CLEANUP-02 병합 권고 | 1 | 0.25 인·일 |

**합계**: 1.75 인·일 (RICE Effort 2 인·일 이내).

---

## T-CLEANUP-01 — AiExtractJsonViewer 렌더 경로 제거

**R**: R1, R2, R3, R4

### Scope (4파일)
- `src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx` line 45 — import 삭제 (R1)
- `src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx` line 201-204 — JSX 제거 (R2)
- `src/components/dashboard-preview/hit-areas.ts` line 99-102 — `{ id: 'ai-json-viewer', ... }` 엔트리 제거 (R3)
- `src/lib/mock-data.ts` line 407 — `'ai-json-viewer': '...'` tooltip 제거 (R4)

### NOOP (건드리지 않음)
- `ai-extract-json-viewer.tsx` 컴포넌트 파일 유지
- `ai-extract-json-viewer.test.tsx` 단위 테스트 유지
- `mock-data.ts` line 160 (`jsonViewerOpen` 타입), line 438 (값) 유지
- `preview-steps.ts` `jsonViewerOpen` 필드 유지

### TDD RED (선행)
`ai-panel` 통합 테스트에서 JSON 뷰어 렌더 단정이 실패하도록 **미렌더 단정으로 먼저 교체** (T-CLEANUP-03 RED 가 본 TASK의 RED 역할)

### Acceptance
- [ ] `grep -rn "<AiExtractJsonViewer" src/` → 0 결과
- [ ] `grep -rn "ai-json-viewer" src/components/dashboard-preview/hit-areas.ts src/lib/mock-data.ts` → 0
- [ ] `grep -n "AiExtractJsonViewer" src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx` → 0
- [ ] `ls src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer.tsx` → 존재
- [ ] `grep -rn "jsonViewerOpen" src/lib/mock-data.ts src/lib/preview-steps.ts` → 여러 결과 (유지 확인)
- [ ] `pnpm typecheck` 통과

### Rollback
JSX 1줄 + import 1줄 복원으로 즉시 재활성화 가능 (가역성 확보).

---

## T-CLEANUP-02 — estimate-info-card 라벨 + JSDoc 동기

**R**: R6, R7

### Scope (1파일)
- `src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx`
  - line 226: `자동 배차` → `자동 배차 대기` (R6)
  - line 2, 13, 19-20, 51: JSDoc `자동 배차 토글` → `자동 배차 대기 토글` (R7) — 5곳

### Out-of-scope (금지)
- `autoDispatch` state/props/이벤트 핸들러 변경
- ON/OFF 뱃지 내부 텍스트 변경
- hit-area key (`form-auto-dispatch`, `auto-dispatch`) 변경

### TDD RED (선행)
`estimate-info-card.test.tsx` line 117/154/168 기대 문자열 "자동 배차 대기"로 먼저 교체 → FAIL 확인

### Acceptance
- [ ] `grep -n "자동 배차" estimate-info-card.tsx` → 모두 "자동 배차 대기"
- [ ] `grep -n "자동 배차 토글" estimate-info-card.tsx` → 0
- [ ] `grep -n "자동 배차 대기 토글" estimate-info-card.tsx` → 5 결과 (JSDoc)
- [ ] `pnpm typecheck` 통과

---

## T-CLEANUP-03 — 테스트 갱신

**R**: R5, R9

### Scope (2파일)
- `src/components/dashboard-preview/ai-register-main/ai-panel/` 내 통합 테스트 (실파일명 구현 시 확인)
  - JSON 뷰어 렌더 단정 → 미렌더 단정 (`expect(screen.queryByTestId('ai-extract-json-viewer')).not.toBeInTheDocument()`) (R5)
- `src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.test.tsx`
  - line 117, 154, 168: describe/it 블록 + 단정문 기대 문자열 `자동 배차` → `자동 배차 대기` (R9)

### 선행 조사 (RED 진입 전 필수)
```bash
grep -rln "AiExtractJsonViewer\|ai-extract-json-viewer\|ai-json-viewer" src/components/dashboard-preview/ai-register-main/ai-panel/*.test.tsx
grep -rn "자동 배차" src/components/dashboard-preview/ai-register-main/order-form/*.test.tsx
```

### Red-Green 회귀 검증
```bash
git stash                              # T-CLEANUP-01 편집만 stash
pnpm test ai-panel.test.tsx           # FAIL 재확인 (테스트가 변경 검증 중)
git stash pop
pnpm test ai-panel.test.tsx           # PASS 재확인
```

### Acceptance
- [ ] `pnpm test src/components/dashboard-preview/ai-register-main/` → 0 failure
- [ ] `ai-extract-json-viewer.test.tsx` 단위 테스트 유지 확인
- [ ] Red-Green 2차 순환 검증 통과

---

## T-CLEANUP-04 — Tooltip `auto-dispatch` 문구 변경

**R**: R8

### Scope (1파일)
- `src/lib/mock-data.ts` line 414:
  ```diff
  - 'auto-dispatch': '조건에 맞는 차량에 자동으로 배차합니다',
  + 'auto-dispatch': '자동 배차 대기 중 — 배차요청 자동 승인되어 배차대기상태로 전환합니다',
  ```

### 병합 권고
T-CLEANUP-02와 같은 커밋에 포함 (라벨 ↔ tooltip UX 일관성 함께 적용). TASK ID는 분리해 추적성 유지.

### Acceptance
- [ ] `grep -n "조건에 맞는 차량에 자동으로 배차합니다" src/lib/mock-data.ts` → 0
- [ ] `grep -n "자동 배차 대기 중 — 배차요청 자동 승인되어 배차대기상태로 전환합니다" src/lib/mock-data.ts` → 1
- [ ] 기존 tooltip 문구 단정 테스트가 있으면 동기 (`grep -rn "조건에 맞는 차량에 자동으로 배차합니다" src/` → 0)

---

## 공통 검증 (전 TASK)

```bash
pnpm typecheck                                                      # 0 errors
pnpm lint                                                           # 0 errors
pnpm test src/components/dashboard-preview/ai-register-main/       # 0 failures

# F5 특화 회귀 검증 (04-implementation-hints.md §3 전수)
grep -rn "<AiExtractJsonViewer" src/                               # 0
grep -rn "ai-json-viewer" src/components/dashboard-preview/hit-areas.ts src/lib/mock-data.ts  # 0
ls src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer.tsx  # 존재
grep -rn "jsonViewerOpen" src/lib/mock-data.ts src/lib/preview-steps.ts  # 여러 결과
grep -n "자동 배차" estimate-info-card.tsx                          # 모두 "자동 배차 대기"
grep -n "form-auto-dispatch\|auto-dispatch" hit-areas.ts           # 두 key 유지
```

---

## PR 구성 권고

**권고 A: 단일 PR**
- 4 TASK → 1 PR (Lite 범위, 파일 6개)
- 장점: 리뷰 단순, F1 rebase 타이밍 명확
- 단점: 리뷰 범위 중간 (import + JSX + mock + 라벨 + 테스트 + tooltip)

**권고 B: 2 PR 분할**
- PR-A: T-CLEANUP-01 + T-CLEANUP-03 (JSON 뷰어 제거 + 관련 테스트)
- PR-B: T-CLEANUP-02 + T-CLEANUP-04 (라벨 + tooltip)
- 장점: 기능 축별 분리, 롤백 단위 명확
- 단점: F1 rebase 시점 2회

**선택**: 기본 **권고 A (단일 PR)** — Lite 범위에서 과분할 지양. 구현 중 예상 외 복잡도 발생 시 권고 B로 전환.

**F1과의 관계**: F5 선행 merge → F1 rebase. F1 PR-6 (T-THEME-08)은 F5 merge 완료 후 진행.
