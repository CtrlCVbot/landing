# 06. Domain Logic — F5 UI 잔재 정리

> 본 Feature 는 **도메인 로직 변경 없음**. Presentation Layer 의 렌더 경로 제거 + mock 엔트리 정리 + 라벨 문자열 교체에 한정.

---

## 1. 변경 없음 (명시)

### 1-1. 유지되는 로직

| 항목 | 위치 | 상태 |
|------|------|------|
| `autoDispatch` state 관리 | `estimate-info-card.tsx` | **불변** (라벨만 교체) |
| `autoDispatch` props 타입 | `estimate-info-card.tsx` | **불변** |
| `autoDispatch` 이벤트 핸들러 | `estimate-info-card.tsx` | **불변** |
| `jsonViewerOpen` mock 필드 (타입·값) | `mock-data.ts` line 160, 438 | **유지** (F2 이관 대기) |
| `jsonViewerOpen` preview step 필드 | `preview-steps.ts` | **유지** (F2 이관 대기) |
| `AiExtractJsonViewer` 컴포넌트 자체 로직 | `ai-extract-json-viewer.tsx` | **불변** (파일 살아있음) |
| hit-area key `form-auto-dispatch` | `hit-areas.ts` | **유지** (구조적 식별자) |
| hit-area key `auto-dispatch` | `hit-areas.ts` | **유지** (구조적 식별자) |

### 1-2. 제거되는 참조 (로직 변경 아님)

| 항목 | 위치 | 성격 |
|------|------|------|
| `<AiExtractJsonViewer>` JSX 렌더 | `ai-panel/index.tsx:201-204` | 렌더 경로 제거 |
| `import { AiExtractJsonViewer }` | `ai-panel/index.tsx:45` | import 삭제 (orphan 제거) |
| `{ id: 'ai-json-viewer', ... }` hit-area | `hit-areas.ts:99-102` | overlay 식별자 제거 |
| `'ai-json-viewer': '...'` tooltip | `mock-data.ts:407` | tooltip 엔트리 제거 |

### 1-3. 치환되는 문자열 (로직 변경 아님)

| 항목 | Before | After |
|------|--------|-------|
| 라벨 텍스트 (line 226) | "자동 배차" | "자동 배차 대기" |
| JSDoc (5곳) | "자동 배차 토글" | "자동 배차 대기 토글" |
| Tooltip (line 414) | "조건에 맞는 차량에 자동으로 배차합니다" | "자동 배차 대기 중 — 배차요청 자동 승인되어 배차대기상태로 전환합니다" |
| 테스트 기대 문자열 (3곳) | "자동 배차" | "자동 배차 대기" |

---

## 2. 런타임 영향 분석

### 2-1. AiExtractJsonViewer 제거

| 측면 | 영향 |
|------|------|
| **렌더 트리** | `<ai-panel>` 하위에서 JSON 뷰어 노드 제거 |
| **이벤트 흐름** | 해당 없음 (JSON 뷰어는 passive display) |
| **Props 전파** | `aiResult.evidence`, `aiResult.jsonViewerOpen` 은 여전히 mock 에서 제공되지만 소비처 없음 (무해) |
| **상태 관리** | 해당 없음 |
| **성능** | 렌더 비용 감소 (미미) |
| **메모리** | JSON.stringify 실행 없음 (미미) |

### 2-2. 라벨 교체

| 측면 | 영향 |
|------|------|
| **렌더 트리** | span 내부 text node 만 변경 |
| **이벤트 흐름** | 불변 (클릭 핸들러 등 그대로) |
| **스타일** | className 불변 → 레이아웃 불변 |
| **접근성** | 라벨 의미 명확화 (오인 제거) |

### 2-3. Tooltip 변경

| 측면 | 영향 |
|------|------|
| **hit-area 발동 조건** | 불변 (key 네임스페이스 유지) |
| **overlay 내용** | tooltip 문구만 "대기 중" 명시로 교체 |

---

## 3. 불변 규칙

### 3-1. 가역성 원칙

`AiExtractJsonViewer` 재활성화는 **JSX 1줄 + import 1줄 복원** 으로 가능해야 한다. 따라서:

- 컴포넌트 파일 (`ai-extract-json-viewer.tsx`) 삭제 금지
- 단위 테스트 파일 (`ai-extract-json-viewer.test.tsx`) 삭제 금지
- `jsonViewerOpen` mock 필드 제거 금지 (JSX 복원 시 props 전달 경로 보존)

### 3-2. 구조적 식별자 보존

`form-auto-dispatch`, `auto-dispatch` hit-area key 는 사용자 화면 비노출 **구조적 식별자**. 변경 시 연쇄 변경:
- `hit-areas.ts` 좌표 참조
- `mock-data.ts` tooltip key 참조
- 통합 테스트 key 참조

따라서 Lite Lane 스코프 보호를 위해 **유지 확정** (K5).

### 3-3. 도메인 경계 보호

- `autoDispatch` 로직은 F5 범위 밖 (향후 Feature에서 재설계 가능)
- 본 F5는 Presentation Layer (라벨 + mock + 렌더 경로) 에 한정

---

## 4. Out-of-scope (명시)

- `autoDispatch` state machine 재설계 → 별도 Feature
- delivery-info-card, cargo-info-card 등 유사 컴포넌트의 라벨 검토 → 별도 IDEA
- `AiExtractJsonViewer` 내부 로직 개선 → 별도 Feature (또는 재활성화 시점)
- JSON 뷰어 UI 개선 → 차기 Epic

---

## 5. 변경 이력

| 날짜 | 변경 |
|------|------|
| 2026-04-23 | 초안 — 도메인 로직 변경 없음을 명시. Presentation Layer 한정. |
