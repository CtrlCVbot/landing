# dash-preview Phase 3 — 해결 방안 제안서

> `[issues.md](.plans/archive/dash-preview-phase3/improvements/issues.md)`에 정리된 8건의 이슈별로 가능한 해결 방안을 병렬 제시한다.
> 선택은 사용자 몫 — 이 문서는 중립 병기까지만 담당한다.
>
> - 작성일: 2026-04-22
> - 범위: `apps/landing` 내 dash-preview 관련 영역
> - 공통 방안은 문서 하단 "공통 방안" 섹션에 한 번만 상세 기술, 각 이슈에서는 참조 표기.

## 요약 표


| 이슈 ID | 고유 방안   | 공통 방안 참조 |
| ----- | ------- | -------- |
| [1]   | A, B, C | —        |
| [2-1] | A       | C1, C2   |
| [2-2] | A       | C1, C2   |
| [2-3] | A, C    | C1       |
| [2-4] | B, C    | C2       |
| [2-5] | A, B    | —        |
| [3]   | A, B, C | —        |
| [4]   | A, B, C | —        |
| [5]   | A, B, C | —        |
| [6]   | A (단일)  | —        |


---

## [1] 라이트 모드 전환

#### A. CSS 변수 이중 팔레트 (가정: 토글식)

- 접근: `@theme`에 라이트/다크 토큰 세트를 모두 정의하고 `html[data-theme]`로 분기.
- 변경 영역: `globals.css` · `layout.tsx` · 테마 토글 UI · 컴포넌트 색 클래스 토큰화.
- 트레이드오프: 사용자 제어 가능, 단 `bg-white/5`류 하드코딩 클래스를 광범위 스윕해야 함.

#### B. `prefers-color-scheme` 자동 추종 (가정: 자동 전환)

- 접근: 라이트를 기본값으로 두고 `@media (prefers-color-scheme: dark)`로 다크 오버라이드.
- 변경 영역: `globals.css` 한 파일 중심.
- 트레이드오프: 인프라 비용 최소, 사용자 수동 제어 불가.

#### C. 라이트 전면 교체

- 접근: 다크 값·클래스를 라이트로 스윕 치환, 전환 개념 제거.
- 변경 영역: `globals.css` · dash-preview 전체 컴포넌트의 회색/백색 계열 클래스.
- 트레이드오프: 구조 변경 없이 최단 경로, 추후 다크 복귀 시 재작업 필요.

---

## [2-1] 하차지명 추출-적용 불일치

#### A. `DELIVERY_MOCK`을 AI 추출값과 동일 값으로 치환

- 접근: `formData.delivery.company/address`를 "대전 유성구 산업단지" 세트로 맞춤.
- 변경 영역: `src/lib/mock-data.ts` 상수 1~2건.
- 트레이드오프: 즉시 해소, "추출→적용" 변화 연출은 더 약해짐(항상 같은 값).

#### B. → 공통 방안 **C1** 참조 (추출/적용 분리 스키마)

#### C. → 공통 방안 **C2** 참조 (시나리오 세트 교체)

---

## [2-2] 화물 품목 추출-적용 불일치

#### A. `CARGO_MOCK` 값을 AI 추출 결과와 동일 문자열로 맞춤

- 접근: `cargo.name`을 "공산품 3파레트" 계열로 치환 (또는 반대로 AI 쪽을 "전자제품"으로).
- 변경 영역: `src/lib/mock-data.ts` 상수 1건.
- 트레이드오프: 최소 변경, [2-1]과 동일한 연출 약화 현상.

#### B. → 공통 방안 **C1** 참조

#### C. → 공통 방안 **C2** 참조

---

## [2-3] 거리·소요·운임이 AI_EXTRACT 전부터 노출

#### A. Step 기반 가시성 게이트

- 접근: `EstimateInfoCard`·`SettlementSection`에 `visible`/`phase` prop을 두고 AI_APPLY 이전엔 placeholder.
- 변경 영역: `order-form/index.tsx` · 두 카드 컴포넌트 조건부 렌더.
- 트레이드오프: 로컬 수정으로 충분, 카드 내부 롤링 애니는 그대로 유지.

#### B. → 공통 방안 **C1** 참조

#### C. 숫자 일관성만 맞추기 (노출 시점은 유지)

- 접근: AI 카테고리 `fare`의 420,000원을 `estimate.amount` 850,000원과 동일하게 통일.
- 변경 영역: `src/lib/mock-data.ts` AI 카테고리 값.
- 트레이드오프: "추출 전부터 보임" 이슈는 남음. 자릿수 혼동만 제거.

---

## [2-4] 단일 목 데이터 — 랜덤 세트 부재

#### A. → 공통 방안 **C2** 참조

#### B. 사용자 트리거 방식 (가정: "다음 예시 보기" 버튼)

- 접근: C2 기반 + DashboardPreview 상단에 세트 순환 버튼.
- 변경 영역: C2 + `dashboard-preview.tsx` + `step-indicator` 근처 UI.
- 트레이드오프: 사용자 제어감, UI 면적 추가·테스트 범위 증가.

#### C. 마운트 1회 랜덤 (가정: 자동)

- 접근: C2 기반 + `useMemo`로 페이지 진입 시 세트 1개 샘플링.
- 변경 영역: C2 + `dashboard-preview.tsx`.
- 트레이드오프: 자연스러움, SSR/hydration 불일치 방지를 위한 시드 처리 필요.

---

## [2-5] 추가 요금 ↔ 운송옵션 연동

#### A. Option→Fee 매핑 테이블 (가정: 매핑 스펙 별도 정의 필요)

- 접근: `OPTION_FEE_MAP`을 도입해 `options`가 바뀌면 `additionalFees`가 파생되도록.
- 변경 영역: `src/lib/mock-data.ts` + `settlement-section` 소스 전환.
- 트레이드오프: 실제 비즈니스 규칙과 근접, 옵션·요금 매핑 스펙 선행 필요.

#### B. 정적 Option-Fee 쌍 몇 건만 토글 연동

- 접근: `direct`, `forklift` 등 일부 옵션에만 고정 수수료 항목 1:1 바인딩.
- 변경 영역: `src/lib/mock-data.ts` + `settlement-section` 필터 한 줄.
- 트레이드오프: 빠른 데모 효과, 매핑 확장성은 낮음.

---

## [3] `DateTimeCard` 수직 스택

#### A. pickup/delivery만 2열 grid로 래핑

- 접근: Col 2 내부의 두 `DateTimeCard`를 `grid grid-cols-2 gap-4`로 감쌈.
- 변경 영역: `order-form/index.tsx` Col 2 블록 + `hit-areas.ts` 좌표 갱신.
- 트레이드오프: 최소 변경, 좁은 열폭에서 날짜·시간 필드 가독성 저하 여지.

#### B. 두 카드를 가로 병합한 단일 카드로 재설계

- 접근: `DateTimeCard`에 "pickup+delivery" 레이아웃 kind 추가, 하나의 카드로 통합.
- 변경 영역: `datetime-card.tsx` 레이아웃 확장 + 호출부 + `hit-areas.ts`.
- 트레이드오프: 밀도 증가·시각 통일, 컴포넌트 책임 확대.

#### C. Col 구성 재편 (DateTime 전용 열 분리)

- 접근: 3열 grid를 4열로 확장하거나 DateTime을 Col 1로 이동.
- 변경 영역: `order-form/index.tsx` grid 구조 + `hit-areas.ts` 전반.
- 트레이드오프: 전체 레이아웃 균형에 영향 큼, 변경 범위가 가장 넓음.

---

## [4] 인터랙티브 오버레이 테두리 어긋남

#### A. 오버레이 앵커를 ScaledContent 내부로 이동

- 접근: `InteractiveOverlay`를 PreviewChrome 바깥이 아니라 `ScaledContent`와 동일 좌표계에 배치.
- 변경 영역: `dashboard-preview.tsx` · `preview-chrome.tsx` · `interactive-overlay.tsx`.
- 트레이드오프: ChromeHeader 오프셋 제거, pointer-events와 scale 연산 재검증 필요.

#### B. DOM 측정 기반 동적 bounds

- 접근: 각 카드에 `data-hit-id`를 부여하고 `getBoundingClientRect` + `ResizeObserver`로 실시간 측정.
- 변경 영역: `hit-areas.ts` 대체 시스템 + 각 카드에 data 속성 부여.
- 트레이드오프: 레이아웃 변경에 자동 대응, 측정 비용·초기 렌더 타이밍 복잡.

#### C. 좌표 원점 보정 + 뷰포트별 좌표 분리

- 접근: `hit-areas.ts`에 ChromeHeader 오프셋을 더하고 Tablet 좌표를 Desktop과 분리 정의.
- 변경 영역: `hit-areas.ts` + `interactive-overlay.tsx` 좌표 계산.
- 트레이드오프: 현재 구조 유지, 수동 좌표 유지보수 부담이 계속 남음.

---

## [5] "추출 결과 JSON" 뷰어 제거

#### A. 컴포넌트·참조 전면 제거

- 접근: `AiExtractJsonViewer` 컴포넌트, 호출부, hit-area, tooltip key, mock `jsonViewerOpen` 필드, 관련 테스트까지 일괄 삭제.
- 변경 영역: `ai-register-main/ai-panel` 하위 파일·전용 테스트 · `hit-areas.ts` · `mock-data.ts` · `preview-steps.ts` · 통합 테스트.
- 트레이드오프: 잔재 없음·가장 깔끔, 변경 범위 가장 넓음·테스트 다수 갱신.

#### B. AiPanel에서 렌더만 제외

- 접근: `ai-panel/index.tsx`의 `<AiExtractJsonViewer ...>` 호출만 제거, 컴포넌트·훅·hit-area·테스트는 유지.
- 변경 영역: `ai-panel/index.tsx` 한 곳 (hit-area `ai-json-viewer` 포함 여부는 별도 결정).
- 트레이드오프: 되돌리기 쉬움, 미사용 코드가 남아 유지보수 부담.

#### C. 토글 버튼만 숨김 (DOM 잔존)

- 접근: `AiExtractJsonViewer` 내부 토글 버튼을 `hidden` 클래스나 조건부 렌더로 비노출 처리.
- 변경 영역: `ai-extract-json-viewer.tsx` 한 지점.
- 트레이드오프: 최소 변경, 접근성·시맨틱상 어정쩡(실질적으로는 죽은 컴포넌트).

---

## [6] "자동 배차" → "자동 배차 대기"

#### A. 라벨 문자열 치환 (단일 방안)

- 접근: `estimate-info-card.tsx`의 `<span>자동 배차</span>` 텍스트를 "자동 배차 대기"로 교체.
- 변경 영역: `estimate-info-card.tsx` 1줄 (tooltip·JSDoc·테스트 기대 문자열 동반 변경 여부는 issues.md "확인 필요" 참조).
- 트레이드오프: 최소 변경, ON/OFF 뱃지·tooltip·테스트 문자열과의 정합은 별도 결정 필요.

---

## 공통 방안

#### C1. Mock 데이터 스키마 재설계 — 추출/적용 분리

- 대상 이슈: [2-1], [2-2], [2-3]
- 접근: mock-data에 `extractedFrame`(AI 추출 상태)과 `appliedFrame`(폼 최종 상태)을 분리, Step 진행에 따라 `applied`가 `extracted` 값을 점진 흡수하도록 설계.
- 변경 영역: `src/lib/mock-data.ts` 스키마 · `order-form/index.tsx` 주입 로직 · `ai-register-main` 경계.
- 트레이드오프: "추출→적용" 내러티브 완성도 최상, 스키마·컴포넌트 협업 넓음·테스트 갱신 필요.

#### C2. 시나리오 세트 컬렉션

- 대상 이슈: [2-4] 주 대상, [2-1]·[2-2]에도 부가 효과.
- 접근: `PREVIEW_MOCK_DATA` 단일 상수를 `PREVIEW_MOCK_SCENARIOS: [세트A, 세트B, ...]` 배열로 전환하고 선택기 함수(고정·랜덤·사용자 트리거) 분리.
- 변경 영역: `src/lib/mock-data.ts` 최상위 구조 · `dashboard-preview.tsx` 선택 트리거.
- 트레이드오프: 다양성·재방문 인상 향상, SSR/hydration 및 세트 간 내부 일관성 보장 필요.

