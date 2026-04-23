# F5 UI 잔재 정리 — 1차 기능 기획 (Draft)

> **Feature slug**: `f5-ui-residue-cleanup`
> **IDEA**: [IDEA-20260423-001](../../ideas/00-inbox/IDEA-20260423-001.md)
> **Epic**: [EPIC-20260422-001](../../epics/20-active/EPIC-20260422-001/00-epic-brief.md) (Phase A, F5)
> **작성일**: 2026-04-23
> **작성자**: `plan-draft-writer` (Phase A Step 5, F5 부분)
> **상태**: draft (사용자 승인 대기)

---

## 1. 3 중 판정 결과

| 축 | 결과 | 근거 |
|----|------|------|
| **Lane (카테고리)** | **Lite** | `triggers_matched: []` — 6 트리거 모두 미해당. Effort 2 인·일 (IDEA §8-1 RICE), 파일 범위 5 건이지만 모두 **렌더 제거·엔트리 제거·라벨 치환**. 신규 기능 추가 없음 (IDEA §3 Out-of-scope: autoDispatch 상태 로직 변경 제외). 아키텍처/API/DB/보안/외부 의존/도메인 2+ 전부 ✗. |
| **시나리오** | **B (Partial)** | copy 도메인 활성 프로젝트 (`domains: core, dev, plan, copy`). Phase 3 로 **일부 구현된** dash-preview (2026-04-22 archived) 를 사용자 피드백 반영해 **완성 시키는 정리 작업**. 기존 구현 존재 (`ai-panel/index.tsx`, `estimate-info-card.tsx`) + Phase 3 내러티브 완성도 확보 후 군더더기 제거 — "부분 완성 상태의 교정" 정의와 일치. 단, 본 Feature 는 Feature 유형이 `dev` 이므로 시나리오 판정은 기록용 (copy 파이프라인 미진입). |
| **Feature 유형** | **dev** | 시각적 차이 닫기(copy)가 아닌 **코드 내 렌더 경로 제외·mock 엔트리 제거·라벨 문자열 치환**. 레퍼런스 캡처 불필요 — 원본 디자인 시안과의 대조가 본 Feature 의 핵심이 아님 (사용자 피드백 직접 반영). |
| **Hybrid** | **false** | dev + 레퍼런스 시그널 없음. IDEA frontmatter `reference-needed: true` 없음, SCREENING `hybrid-candidate: true` 없음, 본문에 "레퍼런스 캡처 필요"·"기존 사이트 참조"·"디자인 기반"·"시각 참조" 키워드 없음. `/copy-reference-refresh --reference-only` 불필요. |

> 표의 시나리오 "B" 는 copy 도메인 활성 프로젝트 convention 에 따른 기록. `07-routing-metadata.md` 에는 `scenario: "B"` 로 기록하되, Feature 유형이 `dev` 이므로 copy 파이프라인은 진입하지 않는다.

---

## 2. 유저 스토리

1. **As a** dash-preview 데모를 보는 방문자,
   **I want** AI 패널 하단에 더 이상 디버그성 JSON 뷰어가 보이지 않기를,
   **so that** "AI 추출 → 폼 적용" 시네마틱 내러티브에 집중할 수 있다.

2. **As a** 견적 카드를 확인하는 방문자,
   **I want** "자동 배차" 라벨이 "자동 배차 대기"로 표시되기를,
   **so that** 실제 상태(자동 배차를 기다리는 중)를 오해 없이 즉시 인지한다.

3. **As a** F2 Mock 스키마 재설계를 담당하는 개발자,
   **I want** `ai-panel/index.tsx` 렌더 · `hit-areas.ts` · tooltip 엔트리가 선행 정리된 mock 기반 위에서 작업하기를,
   **so that** `extractedFrame`/`appliedFrame` 스키마 재설계가 깔끔한 mock 위에 얹힌다 (Epic F2↔F5 `→` 의존성 해소).

4. **As a** Phase 4 품질을 검증하는 QA,
   **I want** `ai-panel` 통합 테스트가 "JSON 뷰어 미렌더" 를 단정하고 `estimate-info-card.test.tsx` 가 "자동 배차 대기" 를 단정하기를,
   **so that** 회귀가 발생해도 테스트가 즉시 감지한다.

5. **As a** 향후 JSON 뷰어 재활성화 필요성을 판단할 메인테이너,
   **I want** `AiExtractJsonViewer.tsx` 컴포넌트 파일과 `jsonViewerOpen` mock 필드가 유지되기를,
   **so that** `ai-panel/index.tsx` 에 JSX 렌더만 복원하면 즉시 재활성화할 수 있다 (가역성 확보).

---

## 3. 러프 요구사항

### 3.1 AiExtractJsonViewer 화면 비노출 (이슈 [5])

- **R1**: `src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx` 의 `AiExtractJsonViewer` import 라인 (line 45) 을 **제거**한다 (주석 처리 아님 — 결정 포인트 §4-3 참조).
- **R2**: 같은 파일의 JSX 렌더 `<AiExtractJsonViewer json={aiResult.evidence} defaultOpen={aiResult.jsonViewerOpen} />` (line 201-204) 을 제거한다.
- **R3**: `src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer.tsx` **컴포넌트 파일은 유지**한다 (삭제 금지).
- **R4**: `src/components/dashboard-preview/hit-areas.ts` (line 99-102) 의 `{ id: 'ai-json-viewer', bounds: {...}, tooltipKey: 'ai-json-viewer' }` 엔트리를 제거한다 (렌더되지 않으므로 overlay highlight 대상 아님).
- **R5**: `src/lib/mock-data.ts` (line 407) 의 `'ai-json-viewer': '원본 추출 결과를 JSON 형태로 확인합니다'` tooltip 엔트리를 제거한다 (R4 의 hit-area 의존 연쇄 제거).
- **R6**: `src/lib/mock-data.ts` (line 160 타입 · line 438 값) 의 `jsonViewerOpen: boolean` · `jsonViewerOpen: false` 는 **유지**한다 (F2 스키마 재설계 시 `extractedFrame`/`appliedFrame` 내부로 일괄 이관 예정).
- **R7**: `src/lib/preview-steps.ts` 각 Step 의 `jsonViewerOpen` 필드는 **유지**한다 (mock 과 동기, F2 에서 일괄 정리).
- **R8**: `src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer.test.tsx` 단위 테스트는 **유지**한다 (컴포넌트 파일 살아있음).
- **R9**: `ai-panel` 통합 테스트의 JSON 뷰어 렌더 단정문을 **미렌더 단정으로 갱신**한다 (예: `expect(screen.queryByTestId('ai-extract-json-viewer')).not.toBeInTheDocument()`).

### 3.2 "자동 배차" → "자동 배차 대기" 라벨 교체 (이슈 [6])

- **R10**: `src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx` (line 226) 의 `<span className="text-xs font-medium">자동 배차</span>` 문자열을 `자동 배차 대기` 로 교체한다.
- **R11**: 같은 파일의 JSDoc 주석 (line 2, 13, 19-20, 51) 중 "자동 배차 토글" 표기를 **"자동 배차 대기 토글"** 로 동기화한다 (코드 의미와 일치).
- **R12**: `estimate-info-card.test.tsx` (line 117, 154, 168) 의 describe/it 블록 + 단정문에서 기대 문자열을 `자동 배차 대기` 로 동기화한다.
- **R13**: `src/lib/mock-data.ts` (line 414) 의 tooltip `'auto-dispatch': '조건에 맞는 차량에 자동으로 배차합니다'` 문구를 라벨과 일관되게 **변경**한다 (결정 포인트 §4-1 확정 값 적용).
- **R14**: hit-area key `form-auto-dispatch`, `auto-dispatch` 네임스페이스는 **유지**한다 (결정 포인트 §4-2 확정).

### 3.3 Out-of-scope (명시)

- `autoDispatch` 상태 로직 변경 (라벨만 바꾸고 로직 그대로) — IDEA §3 Out-of-scope 승계.
- 다른 dash-preview 컴포넌트의 유사 라벨 검토 (본 Feature 는 `estimate-info-card` 한정).
- ON/OFF 뱃지 텍스트 (자체는 그대로 유지).
- `AiExtractJsonViewer.tsx` 컴포넌트 내부 로직 변경.

---

## 4. 결정 포인트 3 건 확정 (plan-draft 단계)

> IDEA §3-B 의 "범위 결정 포인트 (plan-draft 확정)" 3 건을 본 Draft 에서 확정한다.

### 4-1. Tooltip `auto-dispatch` 문구 변경 — **변경 (확정)**

- **현재 값**: `'조건에 맞는 차량에 자동으로 배차합니다'` (`src/lib/mock-data.ts` line 414)
- **변경 후 값**: `'자동 배차 대기 중 — 조건 충족 시 자동 배차합니다'`
- **근거**: 라벨이 "자동 배차 대기" 로 바뀌는데 tooltip 이 "조건에 맞는 차량에 자동으로 배차합니다" 로 남으면 **UX 불일치** 발생 (라벨=대기 / tooltip=즉시 배차 완료 뉘앙스). 사용자가 hover 시 라벨과 설명이 일치해야 "기다리는 상태" 임을 이해할 수 있다. IDEA §8-4 리스크 "비즈니스" 항목 ("라벨만 바뀌고 tooltip 이 옛 문구 유지 시 UX 불일치") 을 직접 완화. R13 에 반영.

### 4-2. hit-area key 네임스페이스 (`form-auto-dispatch`, `auto-dispatch`) — **유지 (확정)**

- **결정**: 두 key 모두 **유지** (변경 금지).
- **근거**: hit-area key 는 **구조적 식별자** — overlay 의 bounds·tooltip 참조 키로 사용되며 사용자 화면에 노출되지 않는다. 라벨 문자열이 바뀌어도 코드 내부 식별자와 일관성은 별개 이슈. key 를 변경하면 `hit-areas.ts` 좌표 참조·`mock-data.ts` tooltip 참조·통합 테스트의 key 참조가 연쇄 변경되어 **Lite Lane 스코프를 초과**한다. IDEA §3-B 권장 ("구조적 이름은 유지 권장") 수용. R14 에 반영.

### 4-3. `ai-panel/index.tsx` import 라인 처리 — **제거 (확정)**

- **결정**: import 라인 (line 45) 을 **제거** (주석 처리 금지).
- **근거**:
  1. **Dead code 방지 + Tree-shake**: 주석 처리는 번들 빌드에서 제거되지만, 소스 레벨에 dead code 가 남아 향후 메인테이너가 "주석 해제하면 동작하나?" 같은 불확실성을 유발한다. 명시적 제거가 읽기 쉽다.
  2. **재활성화 경로 명확**: 컴포넌트 파일 (`ai-extract-json-viewer.tsx`) 이 유지되므로 재활성화 시 `import { AiExtractJsonViewer } from './ai-extract-json-viewer'` 한 줄 추가 + JSX 삽입이면 충분. git 이력으로 어느 커밋에서 제거했는지 추적 가능.
  3. **린터 준수**: `@typescript-eslint/no-unused-vars` 규칙과 충돌 없음.
- R1 에 반영.

---

## 5. 실현 가능성 평가

### 5.1 아키텍처 정합성

**OK**. 변경 범위가 **렌더 경로 제외 · mock 엔트리 제거 · 문자열 치환** 에 한정되어 Rich Domain Model · Hexagonal Architecture 계약 (도메인 레이어 ↔ 인프라 레이어 분리) 에 영향 없음. 모든 변경은 **presentation 레이어**(`src/components/dashboard-preview/**`) + **mock 데이터 레이어**(`src/lib/mock-data.ts` 문자열 엔트리) 내부에서 완결된다.

### 5.2 주요 기술 리스크

| 리스크 | 발생 조건 | 완화 방법 |
|--------|----------|----------|
| 참조 지점 5 파일 분산 → 엔트리 제거 누락 시 미사용 tooltip key 잔존 | `hit-areas.ts` 엔트리 제거만 하고 `mock-data.ts` tooltip 엔트리 제거 누락 | 구현 시 `grep -r "ai-json-viewer" src/` · `grep -r "jsonViewerOpen" src/` 전수 스캔을 TASK 완료 조건에 포함 |
| `ai-panel` 통합 테스트 갱신 범위 파악 부족 | JSON 뷰어 렌더를 단정하는 통합 테스트를 선별 못 함 | 구현 진입 전 `grep -rE "AiExtractJsonViewer\|ai-extract-json-viewer\|ai-json-viewer" src/**/*.test.tsx` 로 테스트 영향 맵 작성 |
| JSDoc 주석과 코드 라벨 불일치 | JSDoc line 2, 13, 19-20, 51 갱신 누락 시 문서-코드 drift | R11 을 명시 요구사항화 + 구현 시 `grep -n "자동 배차 토글" src/components/dashboard-preview/` 전수 확인 |
| F2 스키마 재설계 시 `jsonViewerOpen` 필드 이관 혼선 | 본 Feature 에서 mock 필드 유지 결정의 근거가 F2 문서에 전달 안 됨 | F5 구현 완료 시점에 `.plans/features/active/f5-ui-residue-cleanup/00-context/` 에 F2 핸드오프 메모 포함 (`/plan-bridge` 단계) |

### 5.3 대략 작업 범위

| 영역 | 해당 | 비고 |
|------|:---:|------|
| 화면 (컴포넌트 렌더) | ✅ | `ai-panel/index.tsx` 렌더 제거, `estimate-info-card.tsx` 라벨 교체 |
| Mock 데이터 | ✅ | `mock-data.ts` tooltip 엔트리 제거 + 수정, `hit-areas.ts` 엔트리 제거 |
| 테스트 | ✅ | `ai-panel` 통합 테스트 미렌더 단정, `estimate-info-card.test.tsx` 단정문 동기 |
| API | ❌ | 해당 없음 |
| DB 스키마 | ❌ | 해당 없음 |
| 외부 연동 | ❌ | 해당 없음 |
| 도메인 로직 | ❌ | `autoDispatch` 상태 로직 불변 (IDEA §3 Out-of-scope) |

예상 TASK 수: 3~4 건 (`T-CLEANUP-01 ~ T-CLEANUP-04`) — Epic Phase A §9 예측과 일치.

---

## 6. 생성된 파일

- **Draft 본 파일**: `.plans/drafts/f5-ui-residue-cleanup/01-draft.md` (본 문서)
- **Routing metadata**: `.plans/drafts/f5-ui-residue-cleanup/07-routing-metadata.md`
- 재실행 백업: 해당 없음 (최초 작성)

---

## 7. 다음 단계

본 Draft 승인 후 **Lite 경로** 를 따른다 (PRD 생략):

```bash
# Phase A Step 5b (다음 즉시) — F1 Draft 작성
/plan-draft IDEA-20260423-002

# Phase A Step 7 — Bridge (개발 핸드오프, PRD 생략)
/plan-bridge f5-ui-residue-cleanup

# Phase A Step 9 — 구현
/dev-feature .plans/features/active/f5-ui-residue-cleanup/
```

`/plan-prd` 생략 근거: Lite Lane 확정 (§1) + Epic Phase A §6 "F5 는 Lite → PRD 생략 가능" + 결정 포인트 3 건이 본 Draft 에서 모두 확정되어 추가 상세 PRD 가 불필요.

> Standard 로 상향 판정될 경우 Step 6 `/plan-prd .plans/drafts/f5-ui-residue-cleanup/` 삽입 필요. 현재 판정: **Lite 유지**.

---

## 8. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-23 | 초안 — 3 중 판정 (Lite / 시나리오 B / dev / hybrid false) + 유저 스토리 5 건 + 러프 요구사항 14 건 + 결정 포인트 3 건 확정 + 실현 가능성 평가 (Phase A Step 5, F5 부분) |
