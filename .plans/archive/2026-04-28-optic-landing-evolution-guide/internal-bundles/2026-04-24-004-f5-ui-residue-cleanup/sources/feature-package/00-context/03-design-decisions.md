# 03. Design Decisions — F5 UI 잔재 정리

> Draft §4 에서 확정한 결정 포인트 3 건을 구현 관점으로 재정리. 이 문서는 구현 시 **근거 참조용 SSOT**.
> 출처: [Draft §4 결정 포인트](../../../../drafts/f5-ui-residue-cleanup/01-draft.md#4-결정-포인트-3-건-확정-plan-draft-단계)

---

## 결정 포인트 1 — Tooltip `auto-dispatch` 문구: **변경 (확정)**

### 결정값

`src/lib/mock-data.ts` line 414 의 tooltip 문구를 교체:

```diff
- 'auto-dispatch': '조건에 맞는 차량에 자동으로 배차합니다',
+ 'auto-dispatch': '자동 배차 대기 중 — 조건 충족 시 자동 배차합니다',
```

### 근거

1. **UX 일관성**: 라벨이 "자동 배차 대기" (R6) 로 바뀌는데 tooltip 이 "조건에 맞는 차량에 자동으로 배차합니다" 로 남으면 **라벨=대기 / tooltip=즉시 완료 뉘앙스** 의 모순. 사용자가 hover 시 "기다리는 상태" 임을 이해할 수 없음.
2. **IDEA §8-4 리스크 "비즈니스" 직접 완화**: "라벨만 바뀌고 tooltip 이 옛 문구 유지 시 UX 불일치" 리스크를 본 결정이 직접 제거.
3. **"— 조건 충족 시 자동 배차합니다" 후미 추가 이유**: tooltip 은 라벨보다 정보 밀도 높게. "대기" 의 조건적 해소 경로를 명시해 사용자 기대를 관리.

### 대상 파일·라인

- **편집 1곳**: `src/lib/mock-data.ts` line 414 (**R8** 요구사항)

### 영향 범위

- hit-area key `auto-dispatch` 를 참조하는 `InteractiveOverlay` 컴포넌트 hover 시 자동 표시 — 별도 코드 수정 불필요 (tooltip 문구만 데이터 레이어에서 바꾸면 됨)
- 통합 테스트 중 tooltip 문구를 **단정하는 테스트가 있다면** 동기 갱신 필요 → 구현 시 `grep -rn "조건에 맞는 차량에 자동으로 배차합니다" src/` 선행

---

## 결정 포인트 2 — hit-area key 네임스페이스: **유지 (확정)**

### 결정값

`form-auto-dispatch`, `auto-dispatch` 두 key 를 **변경 금지** (유지).

### 근거

1. **구조적 식별자 성격**: hit-area key 는 `hit-areas.ts` 좌표 lookup·`mock-data.ts` tooltip 참조·`InteractiveOverlay` bounds 조회의 **내부 식별자**. 사용자 화면 노출 없음.
2. **라벨과 분리 원칙**: 라벨 (사용자 가시 문자열) 변경이 key (코드 식별자) 변경을 강제하지 않음. "자동 배차" vs "자동 배차 대기" 의 구분은 라벨 계층에서만 처리.
3. **연쇄 변경 방지 (Lite 스코프 보존)**: key 를 `auto-dispatch-waiting` 등으로 바꾸면:
   - `hit-areas.ts` 엔트리 key 변경
   - `mock-data.ts` tooltip dict key 변경
   - `InteractiveOverlay` bounds lookup 문자열 변경
   - 관련 통합 테스트의 hit-area 식별자 단정문 변경
   → 4 파일 추가 편집 발생. Lite Lane + Effort 2 인·일 원칙 초과.
4. **IDEA §3-B 권장 수용**: "구조적 이름은 유지 권장" 원문 수용.

### 대상 파일·라인

- **편집 없음** — 본 결정은 **변경 금지 선언** (NOOP 확정).

### 영향 범위

- `src/components/dashboard-preview/hit-areas.ts` 의 `{ id: 'form-auto-dispatch', ... }` · `{ id: 'auto-dispatch', ... }` 엔트리 key 필드는 그대로
- `src/lib/mock-data.ts` tooltip dict 의 `'auto-dispatch'`, `'form-auto-dispatch'` key 유지 (값만 R8 에서 변경)

---

## 결정 포인트 3 — `ai-panel/index.tsx` import 처리: **제거 (확정)**

### 결정값

`src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx` line 45 의 import 라인을 **주석 처리가 아닌 완전 삭제**:

```diff
- import { AiExtractJsonViewer } from './ai-extract-json-viewer'
```

(import 구문 전체 행 삭제)

### 근거

1. **Dead code 방지 + Tree-shake 명확성**: 주석 처리된 import 는 번들 빌드에서는 제거되지만 **소스 레벨에 dead code 가 남음** → 메인테이너가 "주석 해제하면 동작하나?" 식 불확실성 유발. 명시적 제거가 소스 가독성 우월.
2. **재활성화 경로 명확 + 낮은 비용**: 컴포넌트 파일 (`ai-extract-json-viewer.tsx`) 이 **유지**되므로 재활성화 시:
   - `import { AiExtractJsonViewer } from './ai-extract-json-viewer'` 한 줄 추가
   - JSX 블록 1회 삽입
   → 30초 작업. git 이력으로 어느 커밋에서 제거했는지 `git log --all -S 'AiExtractJsonViewer'` 로 추적 가능.
3. **린터 충돌 회피**: `@typescript-eslint/no-unused-vars` 규칙이 활성화되어 있을 경우, 주석 처리한 import 는 변수 미사용 규칙을 우회하므로 코드 일관성 저하. 완전 삭제가 린터 정책과 정합.

### 대상 파일·라인

- **편집 1곳**: `src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx` line 45 (**R1** 요구사항)

### 영향 범위

- 같은 파일 line 201-204 의 JSX 렌더 (R2) 와 **동일 TASK 에서 함께 처리** (T-CLEANUP-01 예상). import 만 제거하고 JSX 를 남기면 TS 컴파일 에러 즉시 발생 → TDD RED 신호로 유효.

---

## 결정 포인트 전체 요약

| # | 결정 | 편집 위치 | 변경 유형 |
|:-:|------|----------|----------|
| 1 | Tooltip `auto-dispatch` **변경** | `src/lib/mock-data.ts:414` | 값 교체 |
| 2 | hit-area key **유지** | (없음 — 변경 금지 선언) | NOOP |
| 3 | import **제거** | `src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx:45` | 라인 삭제 |

**결정 포인트 외 경로·라인 특정 요약**:

| 카테고리 | 파일 | 라인 |
|----------|------|------|
| ai-panel 렌더 제거 | `src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx` | 45 (import), 201-204 (JSX) |
| hit-area 제거 | `src/components/dashboard-preview/hit-areas.ts` | 99-102 |
| mock tooltip 제거·변경 | `src/lib/mock-data.ts` | 407 (제거), 414 (변경) |
| mock 필드 유지 | `src/lib/mock-data.ts` | 160 (타입), 438 (값) |
| preview-steps 필드 유지 | `src/lib/preview-steps.ts` | 각 Step `jsonViewerOpen` |
| 라벨·JSDoc 교체 | `src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx` | 226 (라벨), 2·13·19-20·51 (JSDoc) |
| 테스트 동기 | `src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.test.tsx` | 117, 154, 168 |

---

## 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-23 | 초안 — Draft §4 결정 포인트 3 건 구현 관점 재정리 (Phase A Step 7, Bridge) |
