# 02. Scope Boundaries — F5 UI 잔재 정리

> 본 Feature 의 In-scope / Out-of-scope 경계. 이 문서의 경계를 넘는 편집은 `dev-feature-scope-guard.js` 경고 대상.
> 출처: [IDEA §3](../../../../ideas/00-inbox/IDEA-20260423-001.md#3-범위-scope) + [Draft §3](../../../../drafts/f5-ui-residue-cleanup/01-draft.md#3-러프-요구사항)

---

## 1. In-scope

### 1-A. AiExtractJsonViewer 화면 비노출 (이슈 [5])

| # | 파일 | 변경 | 라인 |
|---|------|------|------|
| R1 | `src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx` | `import { AiExtractJsonViewer } ...` 라인 **삭제** (주석 처리 금지 — Draft §4-3 결정) | 45 |
| R2 | `src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx` | JSX 렌더 `<AiExtractJsonViewer json={aiResult.evidence} defaultOpen={aiResult.jsonViewerOpen} />` **제거** | 201-204 |
| R3 | `src/components/dashboard-preview/hit-areas.ts` | `{ id: 'ai-json-viewer', bounds: {...}, tooltipKey: 'ai-json-viewer' }` 엔트리 **제거** | 99-102 |
| R4 | `src/lib/mock-data.ts` | Tooltip 엔트리 `'ai-json-viewer': '원본 추출 결과를 JSON 형태로 확인합니다'` **제거** (R3 연쇄) | 407 |
| R5 | `src/components/dashboard-preview/ai-register-main/ai-panel/` | **통합 테스트** (`ai-panel.test.tsx` 등) 의 JSON 뷰어 **렌더 단정** → **미렌더 단정** 으로 갱신 (예: `expect(screen.queryByTestId('ai-extract-json-viewer')).not.toBeInTheDocument()`) | 해당 테스트 파일 전체 |

### 1-B. "자동 배차" → "자동 배차 대기" 라벨 교체 (이슈 [6])

| # | 파일 | 변경 | 라인 |
|---|------|------|------|
| R6 | `src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx` | `<span className="text-xs font-medium">자동 배차</span>` → `자동 배차 대기` | 226 |
| R7 | `src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx` | JSDoc "자동 배차 토글" → "자동 배차 대기 토글" 동기 | 2, 13, 19-20, 51 |
| R8 | `src/lib/mock-data.ts` | Tooltip `'auto-dispatch'` 값을 `'자동 배차 대기 중 — 조건 충족 시 자동 배차합니다'` 로 **변경** (결정 포인트 §4-1) | 414 |
| R9 | `src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.test.tsx` | describe/it 블록 + 단정문의 기대 문자열 `자동 배차` → `자동 배차 대기` 동기 | 117, 154, 168 |

---

## 2. Out-of-scope (명시)

### 2-1. IDEA §3 Out-of-scope 승계

- **`autoDispatch` 상태 로직 변경 금지** — 라벨만 바꾸고 `autoDispatch` 토글 상태/이벤트 핸들러/props 타입은 **그대로 유지**. 본 Feature 는 Presentation Layer 문자열 + mock 엔트리에 한정되며 도메인 로직/상태 흐름은 불변.
- **다른 dash-preview 컴포넌트의 유사 라벨 검토 금지** — 본 Feature 는 `estimate-info-card.tsx` 한정. `delivery-info-card.tsx`, `cargo-info-card.tsx`, `customer-info-card.tsx` 등 유사 구조 컴포넌트의 라벨은 **검토 대상 아님**. 해당 이슈 발견 시 별도 IDEA 등록.
- **ON/OFF 뱃지 텍스트 자체 유지** — `estimate-info-card.tsx` 내부 ON/OFF 표시 문자열은 변경 금지. "자동 배차" → "자동 배차 대기" 라벨 치환만 수행.

### 2-2. Draft §3.3 추가 Out-of-scope (파일 보존)

- **`AiExtractJsonViewer.tsx` 컴포넌트 파일 삭제 금지** — 재활성화 여지 확보 (IDEA §3-A 2026-04-23 수정 방향). 컴포넌트 내부 로직 변경도 범위 밖.
- **`ai-extract-json-viewer.test.tsx` 단위 테스트 유지** — 컴포넌트 파일이 살아있으므로 단위 테스트 파일 보존. 통합 테스트 (`ai-panel.test.tsx` 등) 의 **렌더 단정문만** 미렌더 단정으로 갱신.
- **`jsonViewerOpen` mock 필드 유지** — `src/lib/mock-data.ts` line 160 (타입 선언) · line 438 (값 `false`) 은 그대로. F2 스키마 재설계 시 `extractedFrame`/`appliedFrame` 내부로 일괄 이관 예정 (Epic 의존성 매트릭스 F2↔F5 `→` 근거). **이 필드를 제거하면 F2 의 사전 작업이 파괴됨**.
- **`src/lib/preview-steps.ts` 각 Step 의 `jsonViewerOpen` 필드 유지** — mock 과 동기. F2 에서 일괄 정리.

### 2-3. hit-area key 네임스페이스 보존 (Draft §4-2)

- **`form-auto-dispatch`, `auto-dispatch` hit-area key 변경 금지** — 두 key 는 overlay bounds·tooltip 참조용 **구조적 식별자** 로 사용자 화면 비노출. 변경 시 `hit-areas.ts` 좌표·`mock-data.ts` tooltip·통합 테스트 key 참조가 연쇄 변경되어 Lite Lane 스코프 초과. → 유지 확정.

---

## 3. 변경 허용 파일 목록 (Feature Scope Guard 기준)

`dev-feature-scope-guard.js` 가 참조할 **변경 허용 경로** (이 외 경로 편집 시 경고):

1. `src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx` (R1, R2)
2. `src/components/dashboard-preview/ai-register-main/ai-panel/` 내 통합 테스트 파일 (R5)
3. `src/components/dashboard-preview/hit-areas.ts` (R3)
4. `src/lib/mock-data.ts` (R4, R8)
5. `src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx` (R6, R7)
6. `src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.test.tsx` (R9)

**예상 편집 파일 수: 6** (Epic Children §1 F5 "참조 지점 5 파일 분산" + 통합 테스트 1 건).

---

## 4. 경계 충돌 감지

Phase A 병렬 실행 중 F1 과 동일 파일을 편집할 경우의 처리:

| 잠재 충돌 파일 | F1 편집 유형 | F5 편집 유형 | 해소 방침 |
|----------------|--------------|--------------|----------|
| `src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx` | 다크 하드코딩 클래스 → 토큰 치환 | import·JSX 렌더 제거 | **같은 라인 충돌 가능성 낮음** (F1 은 className 수정, F5 는 import line 45 + JSX line 201-204 제거). 리베이스 시 수동 머지 필요 시 F5 측이 `<AiExtractJsonViewer>` 관련 block 전체 제거 우선. |
| `src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx` | className 토큰 치환 | 문자열 "자동 배차" → "자동 배차 대기" + JSDoc | **라인 충돌 가능성 낮음** (line 226 근처 className 수정 시 F5 는 `<span>` 내부 텍스트만 수정). 리베이스 시 수동 머지. |

**권장**: F5 를 **먼저 merge** 후 F1 rebase (F5 가 Lite + 2 인·일로 더 빠름). Epic 리스크 §6 #1 "F1 내부 섹션별 PR 분할" 과 정합.
