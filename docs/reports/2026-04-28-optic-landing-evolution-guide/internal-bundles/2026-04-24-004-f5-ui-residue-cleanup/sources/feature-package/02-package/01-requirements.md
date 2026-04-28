# 01. Requirements — F5 UI 잔재 정리

> **SSOT for requirements**. Draft §3 R1~~R9 + K1~~K5를 본 Feature Package의 구현 단위로 번역.
> 원본 Draft: `[../../../../drafts/f5-ui-residue-cleanup/01-draft.md](../../../../drafts/f5-ui-residue-cleanup/01-draft.md)`.
> freeze 스냅샷: `[../00-context/01-prd-freeze.md](../00-context/01-prd-freeze.md)`.
> Lane `Lite` → PRD 생략 (Draft 기반).

---

## 1. 편집 요구사항 (R1~R9)

### R1 — `AiExtractJsonViewer` import 삭제

`src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx` line 45 의 `import { AiExtractJsonViewer } ...` **삭제** (주석 처리 금지 — Draft §4-3).

**수용 기준**:

- `grep -n "import.*AiExtractJsonViewer" ai-panel/index.tsx` → 0
- `pnpm typecheck` 통과 (import 누락 에러 없음)

### R2 — JSX 렌더 제거

같은 파일 line 201-204 의 `<AiExtractJsonViewer json={...} defaultOpen={...} />` JSX **제거**.

**수용 기준**:

- `grep -n "<AiExtractJsonViewer" ai-panel/index.tsx` → 0
- 렌더 트리에 JSON 뷰어 비노출

### R3 — hit-area 엔트리 제거

`src/components/dashboard-preview/hit-areas.ts` line 99-102 의 `{ id: 'ai-json-viewer', bounds: {...}, tooltipKey: 'ai-json-viewer' }` 엔트리 **제거**.

**수용 기준**:

- `grep -n "ai-json-viewer" hit-areas.ts` → 0
- overlay highlight 대상에서 제거

### R4 — mock tooltip 엔트리 제거

`src/lib/mock-data.ts` line 407 의 `'ai-json-viewer': '원본 추출 결과를 JSON 형태로 확인합니다'` 엔트리 **제거** (R3 연쇄).

**수용 기준**:

- `grep -n "ai-json-viewer" mock-data.ts` → 0

### R5 — 통합 테스트 미렌더 단정

`src/components/dashboard-preview/ai-register-main/ai-panel/` 내 통합 테스트 (실파일명 구현 시 확인) 의 JSON 뷰어 렌더 단정을 **미렌더 단정** 으로 갱신.

**변경 예**:

```diff
- expect(screen.getByTestId('ai-extract-json-viewer')).toBeInTheDocument()
+ expect(screen.queryByTestId('ai-extract-json-viewer')).not.toBeInTheDocument()
```

**수용 기준**:

- Red-Green 2차 순환 통과 (T-CLEANUP-01 rollback 시 FAIL)

### R6 — 라벨 교체

`src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx` line 226 의 `<span className="text-xs font-medium">자동 배차</span>` → `자동 배차 대기`.

**수용 기준**:

- `grep -n "자동 배차" estimate-info-card.tsx` → 모두 "자동 배차 대기"
- 시각 회귀: span className 불변, 내부 텍스트만 변경

### R7 — JSDoc 동기

같은 파일 line 2, 13, 19-20, 51 의 JSDoc "자동 배차 토글" → "자동 배차 대기 토글" (5곳).

**수용 기준**:

- `grep -n "자동 배차 토글" estimate-info-card.tsx` → 0
- `grep -n "자동 배차 대기 토글" estimate-info-card.tsx` → 5

### R8 — Tooltip 문구 변경

`src/lib/mock-data.ts` line 414 의 tooltip `'auto-dispatch'` 값:

```diff
- 'auto-dispatch': '조건에 맞는 차량에 자동으로 배차합니다',
+ 'auto-dispatch': '자동 배차 대기 중 — 배차요청 자동 승인되어 배차대기상태로 전환합니다',
```

**수용 기준**:

- `grep -n "조건에 맞는 차량에 자동으로 배차합니다" mock-data.ts` → 0
- `grep -n "자동 배차 대기 중" mock-data.ts` → 1

### R9 — 기대 문자열 동기

`src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.test.tsx` line 117, 154, 168 의 describe/it 블록 + 단정문 기대 문자열 `자동 배차` → `자동 배차 대기`.

**수용 기준**:

- `pnpm test estimate-info-card.test.tsx` → 0 failures

---

## 2. 유지 요구사항 (K1~K5 — NOOP)

### K1 — `AiExtractJsonViewer.tsx` 컴포넌트 파일 유지

**금지**: 파일 삭제.
**근거**: 가역성 확보 (IDEA §3-A 2026-04-23 수정 방향). 재활성화 시 JSX 1줄 복원으로 복귀.

### K2 — `ai-extract-json-viewer.test.tsx` 단위 테스트 유지

**금지**: 테스트 파일 삭제.
**근거**: 컴포넌트 파일 살아있으므로 단위 테스트 보존.

### K3 — `jsonViewerOpen` mock 필드 유지

`src/lib/mock-data.ts` line 160 (타입 `jsonViewerOpen: boolean`) + line 438 (값 `jsonViewerOpen: false`) **유지**.

**근거**: F2 스키마 재설계 시 `extractedFrame`/`appliedFrame` 내부로 일괄 이관 예정 (Epic §2 F2↔F5 `→`). 이 필드 제거 시 F2 사전 작업 파괴.

### K4 — `preview-steps.ts` `jsonViewerOpen` 필드 유지

`src/lib/preview-steps.ts` 각 Step 의 `jsonViewerOpen` 필드 **유지** (mock과 동기, F2 이관 대기).

### K5 — hit-area key 네임스페이스 유지

`src/components/dashboard-preview/hit-areas.ts` 의 `form-auto-dispatch`, `auto-dispatch` key **변경 금지** (구조적 식별자, 사용자 화면 비노출).

**근거**: 변경 시 `hit-areas.ts` 좌표·`mock-data.ts` tooltip·통합 테스트 key 참조 연쇄 변경 → Lite Lane 스코프 초과.

---

## 3. 성공 지표

Draft §2 → `[../00-context/01-prd-freeze.md §3](../00-context/01-prd-freeze.md#3-성공-지표-draft-2--00-context01-product-context-2-승계)` 승계.


| #   | 지표                  | 측정           |
| --- | ------------------- | ------------ |
| 1   | JSON 뷰어 비노출         | R1~R4 수용 기준  |
| 2   | 미사용 식별자 제거          | R3, R4 수용 기준 |
| 3   | `jsonViewerOpen` 보존 | K3, K4 수용 기준 |
| 4   | 라벨 반영               | R6 수용 기준     |
| 5   | Tooltip 동기          | R8 수용 기준     |
| 6   | 미렌더 단정              | R5 수용 기준     |


---

## 4. Non-Goals

Draft §3.3 + IDEA §3 Out-of-scope 승계. 상세: `[../00-context/02-scope-boundaries.md §2](../00-context/02-scope-boundaries.md#2-out-of-scope-명시)`.

핵심:

- `autoDispatch` 상태 로직 변경 금지
- 유사 라벨 검토 금지 (delivery-info-card, cargo-info-card 등)
- ON/OFF 뱃지 텍스트 변경 금지
- AiExtractJsonViewer 내부 로직 변경 금지

---

## 5. 요구사항 추적 (R ↔ TASK ↔ TC)

`[00-overview.md §7](./00-overview.md#7-요구사항-추적-r--task--tc)` 매트릭스 참조.

---

## 6. 변경 이력


| 날짜         | 변경                                                        |
| ---------- | --------------------------------------------------------- |
| 2026-04-23 | 초안 — `/dev-feature` Phase C 진입. Draft §3 + 00-context 승계. |


