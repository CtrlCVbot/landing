# UI 명세: dash-preview-phase3

> **Feature**: Dashboard Preview Phase 3
> **Wireframe**: [`../sources/wireframes/`](../sources/wireframes/) — ASCII 도식 원문
> **PRD**: [`../00-context/01-prd-freeze.md`](../00-context/01-prd-freeze.md)
> **Phase 1 스펙 §5 파일 구조 / §11 조작감 (권위)**: [`archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md`](../../../../archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md)
> **Created**: 2026-04-17

---

## 0. 이 문서의 역할

wireframe ASCII 도식을 **UI 구현 친화적** 형태로 재정리. Step별 상태, Component props, visual 연출 타이밍, 반응형 전략, UI 시각 힌트 위치를 컴포넌트 단위 표로 정리한다.

**재복제 금지**: ASCII 전체 도식은 wireframe에 있음. 본 문서는 **컴포넌트 props 규약 + Step별 prop 변화 표 + visual 타이밍**에 집중.

---

## 1. 디자인 토큰 (기존 유지)

신규 토큰 **추가 없음**. 기존 `globals.css` + Tailwind 클래스 사용.

| 용도 | Tailwind / CSS 변수 | 비고 |
|------|---------------------|------|
| chrome 배경 | `bg-gray-900/50` | REQ-DASH-001 승계 |
| chrome border | `border-gray-800 rounded-2xl` | REQ-DASH-001 승계 |
| chrome window dot red | `#ef4444` | 승계 |
| chrome window dot yellow | `#eab308` | 승계 |
| chrome window dot green | `#22c55e` | 승계 |
| AI 버튼 pending | `bg-blue-500` (#3b82f6) | 승계 |
| AI 버튼 applied | `bg-green-500` (#22c55e) | 승계 |
| AI 버튼 unavailable | `bg-gray-500` | Phase 3 신규 상태 |
| accent glow / border pulse | `var(--color-accent-start)` purple-600 | #10 Column Pulse |
| 금액 강조 | `var(--color-accent-end)` blue-600 | 숫자 롤링 텍스트 |
| 3-col gap | `gap-4` (16px) | 원본 동일 |
| 3-col Column 래퍼 | `lg:col-span-1 space-y-4` | 원본 동일 |
| UI 힌트 caption (Desktop) | `text-xs text-muted-foreground` | REQ-DASH3-044 |
| UI 힌트 caption (Tablet) | `text-[10px]` | REQ-DASH3-044 |

---

## 2. 반응형 전략

### 2-1. Breakpoint × scale

| Viewport | 범위 | Scale | 구조 | ScaledContent `transformOrigin` |
|----------|------|:-----:|------|-------------------------------|
| Desktop | ≥ 1024px | **0.45** | AiPanel 380 + OrderForm **3-col grid** | top left |
| Tablet | 768~1023px | **0.40** | **동일 3-col 유지** (C안, 원본과 의도적 divergence) | top left |
| Mobile | < 768px | — | **MobileCardView** 불변 (Phase 1/2 승계) | — |

### 2-2. Tablet C안 근거

원본은 `lg:grid-cols-3` breakpoint(≥1024px)에서만 3-col이고 Tablet(<1024px)에서 1-col reflow된다. Phase 3는 랜딩 demo의 "**데스크탑 구조 압축 표시**" 성격을 우선하여 Tablet에서도 3-col 유지 (wireframe [`decision-log.md` §3](../sources/wireframes/decision-log.md#3-2026-04-17--orderform-3-column-재현--tablet-c안-040--3-column-유지-확정)).

**R5 리스크 모니터링**: Milestone 5 A/B 검증. 실패 시 폴백 ① Tablet 0.45 상향 또는 ② 원본 동일 1-col reflow.

### 2-3. Mobile MobileCardView 유지

- 2-card 자동 전환: AI_EXTRACT 요약 카드 + AI_APPLY 완료 카드
- Phase 3 조작감 10종 **미적용** (Non-Goals)
- Step 전환 cross-fade 300ms (Desktop 오버랩 규칙 비적용, 콘텐츠 형상 차이)

---

## 3. 컴포넌트별 UI 규약

### 3-1. AiRegisterMain (container)

```tsx
interface AiRegisterMainProps {
  readonly aiState: AiStateSnapshot
  readonly formState: FormStateSnapshot
  readonly interactions?: InteractionsTrack   // partialBeat + allBeat 포함
}
```

- 역할: AiPanel + OrderForm 2영역 2-col flex 레이아웃
- 최상위 className: `flex gap-4 h-full`
- 자식: `<AiPanel>` + `<OrderForm>`

### 3-2. AiPanel (380px 고정 너비)

```tsx
interface AiPanelProps {
  readonly state: AiStateSnapshot
  readonly interactions?: {
    typingRhythm?: TypingRhythmConfig
    focusWalk?: string[]
    pressTargets?: string[]
  }
}
```

- 최상위 className: `flex flex-col gap-3 w-[380px] border-r border-gray-700 shrink-0`
- 자식 (세로 배열): AiTabBar → AiInputArea → AiExtractButton → AiResultButtons → AiWarningBadges → AiExtractJsonViewer

### 3-3. OrderForm (3-column grid 루트)

```tsx
interface OrderFormProps {
  readonly formState: FormStateSnapshot
  readonly interactions?: {
    fillInFields?: FillInField[]
    dropdownBeat?: DropdownBeatConfig
    columnPulseTargets?: ColumnPulseTarget[]   // #10 Column Pulse
    strokeBeats?: StrokeBeatConfig[]
    rollingTargets?: RollingTarget[]
  }
}
```

- **루트 className**: `grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1` (원본 `register-form.tsx:939` 1:1)
- Column 1 자식 (`<div className="lg:col-span-1 space-y-4">`): CompanyManagerSection → LocationForm(pickup) → LocationForm(delivery)
- Column 2 자식: DistanceInfo → DateTimeCard(2-col md:grid-cols-2) → CargoInfoForm
- Column 3 자식: TransportOptionCard → EstimateInfoCard → SettlementSection
- Register SuccessDialog는 자식 아님 (flow 외부, `open=false` 고정)

---

## 4. Step별 시각 상태 매트릭스

wireframe [`screens.md` §2-2~§2-6](../sources/wireframes/screens.md) ASCII 기반 + 조작감 타이밍.

### 4-1. STATE-001 INITIAL (≤ 500ms)

| 영역 | 상태 | visual |
|------|------|--------|
| AiInputArea | empty + placeholder "카톡 메시지를 붙여넣으세요" | caret blink (CSS 기본) |
| AiExtractButton | disabled opacity-50 | — |
| AiResultButtons | hidden (buttons 배열 비어있음) | — |
| **Col 1 CompanyManagerSection** | **pre-filled** (옵틱물류/이매니저/010-****-****) | 정적 (조작감 없음) |
| Col 1 LocationForm (pickup) | empty | 필드 회색 placeholder |
| Col 1 LocationForm (delivery) | empty | 필드 회색 |
| Col 2 DistanceInfo | empty "🗺 거리/시간: 측정전" | — |
| Col 2 DateTimeCard pickup/dropoff | empty | 필드 회색 |
| Col 2 CargoInfoForm | empty | 필드 회색 |
| Col 3 TransportOptionCard | 모두 unchecked | — |
| Col 3 EstimateInfoCard | "--km / --원" | — |
| Col 3 SettlementSection | "합계 --원" | — |
| StepIndicator | `● ○ ○ ○` (4-dot, active=0) | — |
| UI 힌트 Caption | hidden (opacity-0) | — |

### 4-2. STATE-002 AI_INPUT (1.5~2.0s)

| 영역 | 상태 | visual / 조작감 |
|------|------|---------------|
| AiInputArea | **#1 fake-typing** 진행 | 변동 리듬 (고유명사 느리게/조사 빠르게, ≤ 1.5s 완성) |
| AiExtractButton | active + (타이핑 ≥ 0.7 시점부터) **#2 focus-walk** 도착 | outline 4px |
| Col 1 CompanyManagerSection | pre-filled 유지 | — |
| OrderForm 나머지 | empty 유지 | — |
| StepIndicator | `○ ● ○ ○` | — |

**오버랩**: 마지막 타이핑 100~200ms 전 추출 버튼 focus ring 시각화 시작 → AI_EXTRACT press와 자연 연결.

### 4-3. STATE-003 AI_EXTRACT (0.8~1.0s)

| 영역 | 상태 | visual / 조작감 |
|------|------|---------------|
| AiInputArea | 완성 (inputText 전체) | — |
| AiExtractButton | **#3 button-press** 150ms → spinner ≤ 400ms | scale 0.97 + shadow 축소 |
| AiResultButtons | 4 카테고리 stagger fade-in (40~60ms 간격) | pending blue |
| Col 1 CompanyManagerSection | pre-filled 유지 | — |
| OrderForm 나머지 | empty 유지 | — |
| StepIndicator | `○ ○ ● ○` | — |

**총 0.8s**: press 150ms + spinner 400ms + 4카테고리 등장 stagger 250ms.

**오버랩**: 마지막 카테고리 등장 후 100ms 내 첫 카테고리 "📍 상차지"에서 AI_APPLY partialBeat 시작.

### 4-4. STATE-004a AI_APPLY / partialBeat (1.2~1.5s)

**Column 이동 경로**: Col 1 상차 → Col 1 하차 → Col 2 화물(+DateTime 동반) → Col 3 Estimate 일부.

| T (ms) | AiPanel | OrderForm 영향 | 조작감 |
|:------:|---------|----------------|--------|
| 0 | 📍 상차지 applied | **Col 1** LocationForm(pickup) | #3 press + #4 ripple + #6 fill-in caret + #10 Column Pulse 400ms |
| 200 | 🚩 하차지 applied | **Col 1** LocationForm(delivery) + **Col 2** DateTimeCard pickup 2-col 동반 | #3 + #4 + #6 (DateTime 2필드) + #10 |
| 400 | 📦 화물/차량 applied | **Col 2** CargoInfoForm (차량/중량/화물명) + #7 dropdown (select 열림-닫힘) | #3 + #4 + #6 + #7 + #10 |
| 600 | 💰 운임 applied | **Col 3** EstimateInfoCard 거리/시간 + **#8 운임 롤링 시작** | #3 + #4 + #6 + #8 (rolling) + #10 |
| — | — | **UI 힌트 fade-in 200ms** (T=0~200 구간) | opacity 0→1 |
| — | StepIndicator `○ ○ ○ ●` | — | — |

**오버랩**: 운임 ripple 꼬리 T=800ms 시점에 allBeat 첫 TransportOption stroke 시작.

### 4-5. STATE-004b AI_APPLY / allBeat (0.5~0.8s)

**Column 이동 경로**: Col 3 전체 (Transport → Estimate 자동배차 → Settlement 청구/지급/추가/합계).

| T (ms, partial 완료 기준) | Column | 섹션 | 조작감 | 비고 |
|:-------------------------:|:------:|------|--------|------|
| 0 | Col 3 | TransportOptionCard 8옵션 | **#9 stroke 200ms + #10 pulse**, stagger 60ms | 직송/왕복/급송/지게차/수작업/대금회수/추적/특송 |
| 150 | Col 3 | EstimateInfoCard 자동배차 | **#9 stroke 200ms** | 단일 체크박스 |
| 200 | Col 3 | SettlementSection 청구/지급 기본 | **#8 rolling + #10 pulse** | 청구 420,000 + 지급 350,000 동시 |
| 300 | Col 3 | SettlementSection 추가 요금 | **#8 rolling** | +30,000원 |
| 400 | Col 3 | SettlementSection 합계 | **#8 rolling 최종** | 450,000원 |

**제외 대상 (REQ-DASH3-014)**:
- **CompanyManagerSection**: pre-filled 유지, 조작감 0건
- **Col 1 pulse**: 전체 beat Col 1 대상 섹션 없으므로 pulse 0건
- **담당자 연락처 fill-in**: 전체 beat 대상 아님

**hold 0.5s + 다음 loop INITIAL 오버랩 100~200ms**.

---

## 5. UI 시각 힌트 (💡 Caption)

### 5-1. 위치·형태·타이밍 (wireframe [`decision-log.md` §2](../sources/wireframes/decision-log.md) 확정)

| 항목 | 값 |
|------|----|
| 위치 | **Preview 프레임 외곽 직하** (StepIndicator 아래, chrome 내부) |
| 형태 | 💡 아이콘 + `text-xs text-muted-foreground` (Desktop) / `text-[10px]` (Tablet) |
| 메시지 | "골라 받을 수도, 한 번에 받을 수도 있다" |
| 노출 조건 | AI_APPLY 단계 (partialBeat 시작 ~ hold 종료) |
| 전환 | `opacity 0 → 1 (200ms fade-in)` / AI_APPLY 종료 시 fade-out |
| 접근성 | `aria-live="polite"` — 스크린리더 AI_APPLY 진입 시 1회 |
| Mobile | **미표시** (CardView 타이틀로 대체) |

### 5-2. 컴포넌트 인터페이스

```tsx
interface UiHintCaptionProps {
  readonly visible: boolean         // AI_APPLY 단계에만 true
  readonly message: string          // mock-data.ts 또는 상수
  readonly ariaLive?: 'polite' | 'off'
}
```

---

## 6. Step 전환 정책

### 6-1. 오버랩 (REQ-DASH-013 재정의)

| 구간 | 방식 |
|------|------|
| INITIAL → AI_INPUT | caret 유지 상태에서 첫 글자 타이핑 시작 (100~200ms 오버랩) |
| AI_INPUT → AI_EXTRACT | 마지막 글자 100~200ms 전 Extract 버튼 focus ring 시각화 시작 |
| AI_EXTRACT → AI_APPLY | 마지막 카테고리 등장 후 100ms 내 파트별 첫 press 시작 |
| partial → all (AI_APPLY 내부) | 운임 ripple 꼬리 T=800ms에 TransportOption stroke 시작 |
| allBeat → INITIAL (loop) | 합계 롤링 완료 후 hold 500ms → INITIAL caret 100~200ms 오버랩 등장 |

### 6-2. Framer Motion variants 추가

`lib/motion.ts`에 다음 variants 추가 (기존 variants 수정 없음):

```ts
export const previewStepVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.15, ease: 'easeIn' } },
}

export const uiHintCaptionVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
}
```

---

## 7. 히트 영역 레이아웃 (Phase 3, 19~20개)

상세는 wireframe [`screens.md` §5-2](../sources/wireframes/screens.md) 매핑 표.

### 7-1. 좌표 체계 요약

| Group | Count | Column | 핵심 IDs |
|-------|:-----:|:------:|----------|
| AiPanel | 9 | — | #1 tab-bar, #2 ai-input-area, #3 extract-button, #4~#7 결과 카테고리, #8 warning(Phase 3 신규), #9 json-viewer(Phase 3 신규) |
| OrderForm Col 1 | 3 | 1 | #11 company-manager (**비활성**), #12 location-pickup, #14 location-delivery |
| OrderForm Col 2 | 3 | 2 | #13 distance-info, #15 datetime-pickup-dropoff (2-col 통합), #16 cargo-info |
| OrderForm Col 3 | 3 | 3 | #17 transport-options, #18 estimate-info, #19 settlement |
| Dialog | 1 | — | #20 search-address (hidden, 정적) |

### 7-2. 우선 활성화 (AI_APPLY 경로)

10개: #2, #3, #4, #5, #6, #7, #12, #14, #16, #18.

### 7-3. Tablet 축약 폐기

Phase 2의 "Tablet 축약 6개" 규칙 **폐기**. Phase 3에서는 Tablet도 Desktop과 동일 19~20 영역 전체 활성.

---

## 8. prefers-reduced-motion 처리

- 조작감 10종 duration **즉시 스냅** (0ms)
- Step 자동 재생 **비활성**
- 기본 표시 상태: **STATE-004b** (AI_APPLY 완료)
- StepIndicator 클릭만 허용 — 클릭한 Step의 최종 상태로 즉시 전환
- UI 힌트 💡 **상시 표시**

---

## 9. 접근성

| 항목 | 구현 |
|------|------|
| aria-label (외곽) | `"AI 화물 등록 워크플로우 데모 미리보기"` (REQ-DASH3-064) |
| aria-live (UI 힌트) | `polite` — AI_APPLY 진입 시 1회 |
| 키보드 탐색 | StepIndicator Tab + Enter/Space (REQ-DASH-029 승계) |
| Focus outline | StepDot + HitArea accent outline 2px |
| 색상 대비 | WCAG AA (REQ-DASH3-066) |
| prefers-reduced-motion | §8 참조 |

---

## 10. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-04-17 | 초안 — 반응형 전략 (C안 Tablet 0.40), 컴포넌트 props 규약 (AiRegisterMain/AiPanel/OrderForm 3-col 루트), Step별 상태 매트릭스 (5 STATE, pre-filled 제외), UI 힌트 위치·타이밍, 히트 영역 19~20 재매핑, reduced-motion 처리 |
