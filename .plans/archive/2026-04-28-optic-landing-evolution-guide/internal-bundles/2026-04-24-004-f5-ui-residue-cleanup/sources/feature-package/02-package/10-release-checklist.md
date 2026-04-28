# 10. Release Checklist — F5 UI 잔재 정리

> **단일 PR 권고** (Lite, 1.75 인·일, 파일 6개) — 필요 시 2 PR 분할 ([08-dev-tasks.md PR 구성 권고](./08-dev-tasks.md#pr-구성-권고) 참조).

---

## 1. TASK 구현 체크

### T-CLEANUP-01 — AiExtractJsonViewer 렌더 제거 (R1~R4)

- [ ] `ai-panel/index.tsx` line 45 — `import { AiExtractJsonViewer }` 삭제 (주석 처리 아님)
- [ ] `ai-panel/index.tsx` line 201-204 — JSX `<AiExtractJsonViewer ... />` 제거
- [ ] `hit-areas.ts` line 99-102 — `{ id: 'ai-json-viewer', ... }` 엔트리 제거
- [ ] `mock-data.ts` line 407 — `'ai-json-viewer': '...'` tooltip 제거
- [ ] **K1 확인**: `ls ai-extract-json-viewer.tsx` → 컴포넌트 파일 존재
- [ ] **K2 확인**: `ls ai-extract-json-viewer.test.tsx` → 단위 테스트 존재
- [ ] **K3 확인**: `grep -n "jsonViewerOpen" mock-data.ts` → 2 결과 (유지)
- [ ] **K4 확인**: `grep -n "jsonViewerOpen" preview-steps.ts` → 여러 결과 (유지)

### T-CLEANUP-02 — 라벨 + JSDoc 동기 (R6, R7)

- [ ] `estimate-info-card.tsx` line 226 — "자동 배차" → "자동 배차 대기"
- [ ] JSDoc line 2 — "자동 배차 대기 토글"
- [ ] JSDoc line 13 — "자동 배차 대기 토글"
- [ ] JSDoc line 19-20 — "자동 배차 대기 토글"
- [ ] JSDoc line 51 — "자동 배차 대기 토글"

### T-CLEANUP-03 — 테스트 갱신 (R5, R9)

- [ ] `ai-panel` 통합 테스트 미렌더 단정 교체 (`queryByTestId(...).not.toBeInTheDocument()`)
- [ ] `estimate-info-card.test.tsx` line 117, 154, 168 기대 문자열 "자동 배차 대기" 동기
- [ ] Red-Green 2차 순환 검증 (T-CLEANUP-01 rollback 시 FAIL 확인)

### T-CLEANUP-04 — Tooltip 문구 (R8)

- [ ] `mock-data.ts` line 414 — `'auto-dispatch'` 값 "자동 배차 대기 중 — 배차요청 자동 승인되어 배차대기상태로 전환합니다"
- [ ] 기존 단정 테스트에서 구 문구 사용 여부 확인 → 발견 시 동기

---

## 2. 회귀 검증 체크

### 제거 확인

- [ ] `grep -rn "<AiExtractJsonViewer" src/` → 0 결과
- [ ] `grep -rn "ai-json-viewer" src/components/dashboard-preview/hit-areas.ts src/lib/mock-data.ts` → 0
- [ ] `grep -n "AiExtractJsonViewer" ai-panel/index.tsx` → 0

### 라벨 확인

- [ ] `grep -n "자동 배차" estimate-info-card.tsx` → 모두 "자동 배차 대기"
- [ ] `grep -n "자동 배차 토글" estimate-info-card.tsx` → 0
- [ ] `grep -n "자동 배차 대기 토글" estimate-info-card.tsx` → 5

### Tooltip 확인

- [ ] `grep -n "조건에 맞는 차량에 자동으로 배차합니다" mock-data.ts` → 0
- [ ] `grep -n "자동 배차 대기 중 — 배차요청 자동 승인되어 배차대기상태로 전환합니다" mock-data.ts` → 1
- [ ] `grep -rn "조건에 맞는 차량에 자동으로 배차합니다" src/` → 0 (전역)

### 유지 (NOOP) 확인

- [ ] `ls ai-extract-json-viewer.tsx` → 존재 (K1)
- [ ] `ls ai-extract-json-viewer.test.tsx` → 존재 (K2)
- [ ] `pnpm test ai-extract-json-viewer.test.tsx` → PASS (단위 테스트 유지)
- [ ] `grep -n "jsonViewerOpen" mock-data.ts` → 2 결과 (K3)
- [ ] `grep -n "jsonViewerOpen" preview-steps.ts` → 여러 결과 (K4)
- [ ] `grep -n "form-auto-dispatch\|auto-dispatch" hit-areas.ts` → 두 key 존재 (K5)

---

## 3. 빌드·테스트·린트 체크

- [ ] `pnpm typecheck` → 0 errors
- [ ] `pnpm lint` → 0 errors (신규 warning 없음)
- [ ] `pnpm test src/components/dashboard-preview/ai-register-main/` → 0 failures
- [ ] `pnpm build` → 성공
- [ ] `pnpm dev --turbopack` 기동 → JSON 뷰어 비노출 수동 확인

---

## 4. F1 병렬 실행 조정

- [ ] F5 선행 merge (F1 rebase 대기)
- [ ] F1 PR-6 (T-THEME-08) 은 F5 merge 후 진입 확인 (Epic §2 F1↔F5)

---

## 5. Epic Phase A 종료 조건 기여 (Epic Children §4)

- [ ] F5 구현 완료 + 테스트 통과 + 리뷰 승인 → F5 Feature 상태 `archived`
- [ ] JSON 뷰어 화면 비노출 확인 (`grep -rn "<AiExtractJsonViewer" src/` → 0 결과)
- [ ] "자동 배차 대기" 라벨 반영 확인 (`grep -n "자동 배차" src/components/dashboard-preview/` → 새 문구)

---

## 6. Archive 준비 (F5 완료 후)

- [ ] Epic `01-children-features.md` F5 상태 `approved → archived` 갱신
- [ ] `/plan-archive f5-ui-residue-cleanup` 실행 (또는 Epic archive 일괄 처리)
- [ ] 관련 drafts (`.plans/drafts/f5-ui-residue-cleanup/`) 이관
- [ ] `.plans/archive/index.md` 갱신

---

## 변경 이력

| 날짜 | 변경 |
|------|------|
| 2026-04-23 | 초안 — 4 TASK + 회귀 검증 체크리스트. |
