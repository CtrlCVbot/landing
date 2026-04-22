# Component Specification: dash-preview Phase 3

> **PRD**: [`01-prd-freeze.md`](../../00-context/01-prd-freeze.md)
> **Phase 1 스펙**: [`IMP-DASH-001-option-b-spec-phase1.md`](../../../../../archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md) §5 파일 구조 — **본 문서는 재복제하지 않고 링크 + 배치 위주로 기술**
> **Last Updated**: 2026-04-17
> **Authored by**: plan-wireframe-designer

---

## 0. 이 문서 구성

- §1 Decision Log (AI_APPLY 2단 구조 안 B 확정)
- §2 컴포넌트 트리 + 파일 구조 요약
- §3 AiPanel 8 파일 명세
- §4 OrderForm 9 파일 명세
- §5 interactions 6 유틸 명세
- §6 공통 props/상태 규약
- §7 shadcn/ui 3-C 하이브리드 5 컴포넌트
- §8 PCC-04 자체 사전 점검 결과

---

## 1. Decision Log

### 1-1. AI_APPLY 2단 구조 확정: **안 B (내부 타임라인 분할)**

> REQ-DASH3-040 ~ REQ-DASH3-044에서 위임된 와이어프레임 단계 최종 확정 사항.

| 항목 | 내용 |
|------|------|
| **선정안** | **안 B — 내부 타임라인 분할** (4단계 유지, AI_APPLY 내부에 `partial beat → all beat` 2비트 구성) |
| **결정일** | 2026-04-17 |
| **결정자** | plan-wireframe-designer (위임 완료) |
| **반영 위치** | `screens.md` §2-5/§2-6, `navigation.md` §2-4, 본 문서 §3/§4 주입 지점 |

**선정 사유** (1문단):

> 안 B는 **Phase 1 스펙 §1-1의 "4단계 한정" 원칙을 유지하면서** "파트별 → 전체" 2단 시연 요구(PRD G4, REQ-DASH3-040)를 충족하는 유일한 방법이다. AI_APPLY 단일 Step의 `interactions` 타이밍 트랙 내부에 `partialBeat`(T=0~1500ms) · `allBeat`(T=1500~2300ms) 2개의 필드 스케줄을 정의하여, Step 전환 경계를 추가하지 않고도 두 beat의 리듬 차이(카테고리 간격 150~250ms vs 필드 간격 80~120ms)를 시각적으로 구분한다. **partial→all 내부 경계는 오버랩 없이 자연 연결**(마지막 partial 운임 ripple의 꼬리가 첫 all Company fill-in과 이어짐)되어 PRD §2-3 "끊김 없는 연속 동작" 원칙과도 정합한다. 총 AI_APPLY Step 지속 2.0~2.3s로 REQ-DASH3-063 상한 2.5s 이내 수렴.

**대안 기각 근거:**

| 대안 | 기각 사유 |
|------|----------|
| **안 A** (Step 분할 5단계) | Phase 1 스펙 §1-1의 "4단계 한정" 원칙 위배. `StepIndicator` 5-dot 복귀로 REQ-DASH-014(4-dot) 모순. PREVIEW_STEPS enum 변경으로 Phase 2 Mobile 2단계 매핑 재설계 필요 → 회귀 범위 과다. |
| **안 C** (모드별 분기: 파트별 모드 / 전체 모드 토글) | `useAutoPlay` 훅 내부에 mode 상태 추가로 코드 분기 복잡도 증가. "자동 재생 + 일관된 시연" 랜딩 목적에 모드 토글은 UX 혼란 야기. 더 나아가 PRD G2 "단일 흐름" 원칙 위배. |

### 1-2. UI 시각 힌트 확정 (REQ-DASH3-044)

| 항목 | 결정 |
|------|------|
| **메시지** | "골라 받을 수도, 한 번에 받을 수도 있다" |
| **위치** | Preview 프레임 외곽 직하 (StepIndicator 아래) — chrome 내부 여백 |
| **형태** | inline caption — 💡 아이콘 + `text-xs text-muted-foreground` (Tablet: text-[10px]) |
| **노출 조건** | AI_APPLY 단계(partial beat 시작 ~ HOLD 종료)에만 `opacity 0→1 (200ms fade-in)` |
| **접근성** | `aria-live="polite"` — AI_APPLY 진입 시 스크린리더 1회 읽기 |
| **Mobile** | 미표시 (CardView 타이틀로 대체) |

**기각된 대안:**
- chrome header 우측 뱃지 → Phase 2 `[인터랙티브 모드]` 뱃지와 공간 충돌
- AiPanel 상단 툴팁 → StepIndicator와 시선 경합
- 캡션 상시 표시 → "스크린샷 나열" 인상 유발 (G2 위배)

---

## 2. 컴포넌트 트리 + 파일 구조 요약

```
DashboardPreview (container, 기존 유지 — REQ-DASH3-053)
  │
  ├─ PreviewChrome (기존 유지)
  │     ├─ ChromeHeader (dots + "OPTIC Broker" + [인터랙티브 모드] 뱃지)
  │     └─ ScaledContent (scale 0.45 Desktop / 0.40 Tablet)
  │           └─ AiRegisterMain [신규, Phase 3 entry]
  │                 │
  │                 ├─ AiPanel (8 파일) ............ §3
  │                 │     ├─ index.tsx
  │                 │     ├─ ai-tab-bar.tsx
  │                 │     ├─ ai-input-area.tsx      ← 조작감 #1/#2
  │                 │     ├─ ai-extract-button.tsx  ← 조작감 #3
  │                 │     ├─ ai-result-buttons.tsx
  │                 │     ├─ ai-button-item.tsx     ← 조작감 #3/#4/#5
  │                 │     ├─ ai-warning-badges.tsx  (Phase 3 신규, hidden)
  │                 │     └─ ai-extract-json-viewer.tsx (Phase 3 신규, 접힘)
  │                 │
  │                 └─ OrderForm (9 파일) ........... §4
  │                       ├─ index.tsx
  │                       ├─ company-manager-section.tsx  ← 조작감 #6
  │                       ├─ location-form.tsx            ← 조작감 #6 (pickup/delivery 재사용)
  │                       ├─ datetime-card.tsx            ← 조작감 #6 (pickup/delivery 재사용)
  │                       ├─ cargo-info-form.tsx          ← 조작감 #6/#7
  │                       ├─ transport-option-card.tsx    ← 조작감 #9
  │                       ├─ estimate-info-card.tsx       ← 조작감 #6/#8/#9/#10
  │                       ├─ settlement-section.tsx       ← 조작감 #8
  │                       └─ register-success-dialog.tsx  (파일 복제만, open=false)
  │
  ├─ StepIndicator (4-dot, REQ-DASH-014 수정)
  ├─ InteractiveOverlay (히트 19~20개)
  ├─ Tooltip (기존 유지, 콘텐츠 확장)
  └─ UI Hint Caption (신규, AI_APPLY 중 표시, §1-2)

interactions/ (6 유틸) ........................... §5
  ├─ use-fake-typing.ts       ← MVP #1
  ├─ use-button-press.ts      ← MVP #3
  ├─ use-focus-walk.ts        ← NTH #2
  ├─ use-ripple.ts            ← NTH #4
  ├─ use-fill-in-caret.ts     ← MVP #6
  └─ use-number-rolling.ts    ← MVP #8

components/ui/ (shadcn 3-C, 5 파일) .............. §7
  ├─ button.tsx
  ├─ input.tsx
  ├─ textarea.tsx
  ├─ card.tsx
  └─ badge.tsx
```

**상세 파일 구조 원본**: [Phase 1 스펙 §5](../../../../../archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md#5-파일-구조) 참조. 본 문서는 **배치/주입 지점**에 집중.

---

## 3. AiPanel — 8 파일 명세

> 모든 AiPanel 컴포넌트는 **stateless + props 주입** (REQ-DASH3-002). `useEffect`는 애니메이션 타이밍에만 허용 (Phase 1 스펙 §2-1).

### 3-1. 공통 규약

- **타입**: Server Component 가능 (애니메이션 트리거 컴포넌트만 `"use client"`)
- **제거된 의존성**: `@/store/*`, `react-hook-form`, `@tanstack/react-query`, `next/navigation`, `@/lib/api/*` (REQ-DASH3-007)
- **shadcn 의존성**: Button, Input, Textarea, Card, Badge만 사용 (REQ-DASH3-051)

### 3-2. 컴포넌트 명세 표

| 파일 | 타입 | 주요 Props (요약) | 내부 상태 | 조작감 주입 지점 | PRD REQ |
|------|------|------------------|----------|----------------|---------|
| `ai-panel/index.tsx` | Client (타이밍 루트) | `aiState: AiStateSnapshot`<br/>`interactions?: InteractionsTrack` | 없음 (props) | interactions 트랙 배포 (자식에 prop으로 전달) | REQ-DASH3-003 |
| `ai-tab-bar.tsx` | Stateless | `activeTab: 'text' \| 'image'` | 없음 | 없음 | REQ-DASH3-003 |
| `ai-input-area.tsx` | Client | `textValue: string`<br/>`textProgress: number (0~1)`<br/>`typingRhythm?: TypingRhythmConfig` | `displayText` (use-fake-typing 내부) | **#1 fake-typing** (AI_INPUT 시작 시 `typingRhythm` prop으로 트리거)<br/>**#2 focus-walk 도착점** | REQ-DASH3-003, REQ-DASH3-020 |
| `ai-extract-button.tsx` | Client | `disabled: boolean`<br/>`state: 'idle' \| 'loading' \| 'pressed'`<br/>`onPress?: () => void` (interactive 모드만) | `pressed` (use-button-press 내부) | **#3 button-press** (AI_EXTRACT 진입 시 `state='pressed'` 트리거)<br/>**#2 focus-walk 경유지** | REQ-DASH3-003, REQ-DASH3-021 |
| `ai-result-buttons.tsx` | Stateless | `categories: AiCategoryGroup[]`<br/>`staggerDelay: number` | 없음 (map) | **#5 hover→active CSS transition** (group 컨테이너)<br/>stagger 등장 타이밍 (40~60ms) | REQ-DASH3-003 |
| `ai-button-item.tsx` | Client | `button: { id, label, displayValue, status }`<br/>`beatDelay?: number` (AI_APPLY 내부 순서) | `pressed` (use-button-press)<br/>`rippling` (use-ripple) | **#3 button-press** (AI_APPLY 파트별 beat)<br/>**#4 ripple** (동일 시점, 50ms offset)<br/>**#5 hover→active** (CSS) | REQ-DASH3-003, REQ-DASH3-021, REQ-DASH3-025 |
| `ai-warning-badges.tsx` | Stateless | `warnings: string[]` (기본 `[]` → hidden) | 없음 | 없음 (Phase 3 hidden) | REQ-DASH3-003 (신규 파일 복제) |
| `ai-extract-json-viewer.tsx` | Stateless | `data: object`<br/>`open: boolean` (기본 false) | 없음 (접힘 고정) | 없음 (Phase 3 접힘 고정) | REQ-DASH3-003 (신규 파일 복제) |

### 3-3. props 흐름 요약

```
DashboardPreview [currentStep, mode]
      │
      │ PREVIEW_STEPS[currentStep] → { aiState, interactions }
      ▼
AiRegisterMain [aiState, formState, interactions]
      │
      ├─ AiPanel [aiState, interactions.{typingRhythm, focusWalk, pressTargets}]
      │     ├─ AiTabBar [activeTab]
      │     ├─ AiInputArea [textValue, textProgress, typingRhythm] ← #1 적용
      │     ├─ AiExtractButton [state, disabled] ← #3 적용
      │     ├─ AiResultButtons [categories, staggerDelay]
      │     │     └─ AiButtonItem [button, beatDelay] ← #3/#4/#5 적용
      │     ├─ AiWarningBadges [warnings=[]] (hidden)
      │     └─ AiExtractJsonViewer [data, open=false] (접힘)
      │
      └─ OrderForm [formState, interactions.{fillInFields}]  (§4)
```

---

## 4. OrderForm — 9 파일 명세

### 4-0. 3-column Grid 배치 도식 (원본 `register-form.tsx:939` 재현)

OrderForm은 `grid grid-cols-1 lg:grid-cols-3 gap-4` 레이아웃. 각 Column은 `lg:col-span-1 space-y-4`로 **세로 스택**이며, Column 간 배치는 다음과 같다.

```
┌────────────────── OrderForm (lg:grid-cols-3 gap-4) ──────────────────┐
│                                                                       │
│  ┌─ Col 1 ──────────┐ ┌─ Col 2 ──────────┐ ┌─ Col 3 ──────────────┐  │
│  │ lg:col-span-1    │ │ lg:col-span-1    │ │ lg:col-span-1         │  │
│  │ space-y-4        │ │ space-y-4        │ │ space-y-4             │  │
│  │                  │ │                  │ │                       │  │
│  │ ┌──────────────┐ │ │ ┌──────────────┐ │ │ ┌───────────────────┐ │  │
│  │ │ Company      │ │ │ │ 예상거리 Info │ │ │ │ Transport         │ │  │
│  │ │ Manager      │ │ │ │  (measuring  │ │ │ │   Option          │ │  │
│  │ │ Section      │ │ │ │  box)         │ │ │ │   Card            │ │  │
│  │ └──────────────┘ │ │ └──────────────┘ │ │ └───────────────────┘ │  │
│  │                  │ │                  │ │                       │  │
│  │ ┌──────────────┐ │ │ ┌── md:grid-  ─┐ │ │ ┌───────────────────┐ │  │
│  │ │ Location     │ │ │ │    cols-2    │ │ │ │ Estimate Info     │ │  │
│  │ │ Form         │ │ │ │ ┌──┐  ┌──┐   │ │ │ │   Card            │ │  │
│  │ │ (departure   │ │ │ │ │상│  │하│   │ │ │ │ (거리/운임/자동배차)│ │  │
│  │ │  상차지)      │ │ │ │ │차│  │차│   │ │ │ └───────────────────┘ │  │
│  │ └──────────────┘ │ │ │ └──┘  └──┘   │ │ │                       │  │
│  │                  │ │ │  DateTimeCard │ │ │ ┌───────────────────┐ │  │
│  │ ┌──────────────┐ │ │ │   x2          │ │ │ │ Settlement        │ │  │
│  │ │ Location     │ │ │ └──────────────┘ │ │ │   Section         │ │  │
│  │ │ Form         │ │ │                  │ │ │ (운임 관리)        │ │  │
│  │ │ (destination │ │ │ ┌──────────────┐ │ │ │ 청구/배차/합계      │ │  │
│  │ │  하차지)      │ │ │ │ Cargo Info   │ │ │ └───────────────────┘ │  │
│  │ └──────────────┘ │ │ │   Form       │ │ │                       │  │
│  │                  │ │ │ (차량/중량/   │ │ │                       │  │
│  │                  │ │ │  화물명/비고) │ │ │                       │  │
│  │                  │ │ └──────────────┘ │ │                       │  │
│  └──────────────────┘ └──────────────────┘ └───────────────────────┘  │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

**Column별 포함 섹션 (Must 준수, 원본 라인 대응):**

| Column | 포함 섹션 | 원본 라인 | 관련 파일 | AI_APPLY 비트 |
|--------|-----------|-----------|------------|----------------|
| **Col 1** (`lg:col-span-1 space-y-4`) | 1) CompanyManagerSection<br/>2) LocationForm (departure, 상차지)<br/>3) LocationForm (destination, 하차지) | 942~1140 | `company-manager-section.tsx`, `location-form.tsx` (variant='pickup' / 'delivery') | 파트별 T=0 (상차) · T=200 (하차) / 전체 T=0 (Company) |
| **Col 2** (`lg:col-span-1 space-y-4`) | 1) 예상거리 Info 박스 (`LandPlot` 아이콘 + 측정전 텍스트)<br/>2) DateTimeCard 2-col (`md:grid-cols-2`: pickup + dropoff)<br/>3) CargoInfoForm | 1143~1278 | 인라인 div (예상거리), `datetime-card.tsx` x2, `cargo-info-form.tsx` | 파트별 T=200 (DateTime 동반) · T=400 (Cargo + DateTime) |
| **Col 3** (`lg:col-span-1 space-y-4`) | 1) TransportOptionCard (8 옵션 토글)<br/>2) EstimateInfoCard (거리/운임/자동배차 — 원본에서는 `{false &&}`로 비활성이나 Phase 3에서 활성화)<br/>3) SettlementSection (운임 관리: 청구/배차 기본 + 합계) | 1281~ | `transport-option-card.tsx`, `estimate-info-card.tsx`, `settlement-section.tsx` | 파트별 T=600 (Estimate 시작) / 전체 T=150/250/300/500 (순차 채움) |

**3-column 대각 흐름 (AI_APPLY 파트별 beat):**

```
T=0   📍 상차지  → Col 1 row 2 (LocationForm pickup)
T=200 🚩 하차지  → Col 1 row 3 (LocationForm delivery) + Col 2 row 2 (DateTime 동반)
T=400 📦 화물    → Col 2 row 3 (CargoInfoForm) + Col 2 row 2 (DateTime 완료)
T=600 💰 운임    → Col 3 row 2 (EstimateInfoCard 일부)
      ──전체 beat──
T=800 🏢 Company → Col 1 row 1 (되감기)
T=950 🚚 Options → Col 3 row 1 (TransportOption)
T=1100 💳 자동배차 → Col 3 row 2 (EstimateInfoCard 자동배차)
T=1150 📊 Settle → Col 3 row 3 (Settlement)
```

시선 이동이 Col 1 → Col 2 → Col 3 → Col 1 → Col 3 → Col 3으로 흐르며, 최종적으로 Col 3의 합계 값에 시선이 고정된다.

### 4-1. 공통 규약

- **타입**: Stateless 우선, fill-in 애니메이션 컴포넌트만 `"use client"`
- **LocationForm / DateTimeCard는 재사용 컴포넌트** — `variant: 'pickup' \| 'delivery'` prop으로 구분 (PRD REQ-DASH3-004 "pickup/delivery 재사용")
- **RegisterSuccessDialog는 파일 복제만** — `open` prop이 **항상 `false` 고정** (REQ-DASH3-013)
- **Grid 컨테이너 규약**: `order-form/index.tsx` 루트 엘리먼트가 `grid grid-cols-1 lg:grid-cols-3 gap-4` 클래스를 반드시 포함해야 하며, 자식 3개 `<div className="lg:col-span-1 space-y-4">` 컬럼으로 분할한다.

### 4-2. 컴포넌트 명세 표

| 파일 | 타입 | 주요 Props (요약) | 내부 상태 | 조작감 주입 지점 | PRD REQ |
|------|------|------------------|----------|----------------|---------|
| `order-form/index.tsx` | Stateless | `formState: FormStateSnapshot`<br/>`fillInFields?: FillInTrack[]`<br/>**`columnPulseTargets?: ColumnPulseTrack[]`** (재정의) | 없음 | **#10 Column-wise Border Pulse** — 3-column grid 루트 래퍼. 활성 섹션의 border glow 400ms (accent 2px outline + box-shadow pulse) | REQ-DASH3-004, REQ-DASH3-029 (재정의) |
| `company-manager-section.tsx` | **Stateless (pre-filled 고정)** | `company: CompanyData` (기본값 **옵틱물류**)<br/>`manager: ManagerData` (기본값 **이매니저**)<br/>`aiApplied: false` (고정) | 없음 | **없음 (pre-filled, AI_APPLY 영향 없음)** — 상세: decision-log §4 | REQ-DASH3-004, **REQ-DASH3-014** (pre-filled) |
| `location-form.tsx` (pickup/delivery 재사용) | Client | `variant: 'pickup' \| 'delivery'`<br/>`data: LocationData`<br/>`fillIn?: FillInCommand` | `fillInCaretIdx` | **#6 fill-in caret** (AI_APPLY 파트별 T=0/T=200)<br/>필드: 주소 → 상세 → 연락처, 간격 ≤ 120ms | REQ-DASH3-004, REQ-DASH3-022 |
| `datetime-card.tsx` (pickup/delivery 재사용) | Client | `variant: 'pickup' \| 'delivery'`<br/>`data: DateTimeData`<br/>`fillIn?: FillInCommand` | `fillInCaretIdx` | **#6 fill-in caret** (AI_APPLY 파트별, location 직후)<br/>필드: 날짜 → 시간 | REQ-DASH3-004, REQ-DASH3-022 |
| `cargo-info-form.tsx` | Client | `cargo: CargoData`<br/>`fillIn?: FillInCommand`<br/>`dropdownBeat?: DropdownBeatConfig` | `fillInCaretIdx`<br/>`dropdownState: 'closed' \| 'open' \| 'highlight'` | **#6 fill-in caret**<br/>**#7 dropdown 펼침** (차량 select, 열림→하이라이트→닫힘 ≤ 600ms) | REQ-DASH3-004, REQ-DASH3-022, REQ-DASH3-027 |
| `transport-option-card.tsx` | Client | `options: TransportOptions (8개 flags)`<br/>`strokeBeats?: StrokeBeat[]` | `strokeProgress` (SVG stroke-dashoffset) | **#9 toggle stroke** (AI_APPLY 전체 beat T=150)<br/>3개 옵션 stagger 60ms | REQ-DASH3-004, REQ-DASH3-028 |
| `estimate-info-card.tsx` | Client | `estimate: EstimateData`<br/>`numberRoll?: NumberRollConfig[]`<br/>`autoDispatchStroke?: boolean` | `rollingValue` (use-number-rolling)<br/>`strokeProgress` | **#6 fill-in caret** (거리/시간)<br/>**#8 number-rolling** (예상 운임, 0.3~0.5s)<br/>**#9 toggle stroke** (자동 배차) | REQ-DASH3-004, REQ-DASH3-022, REQ-DASH3-023, REQ-DASH3-028 |
| `settlement-section.tsx` | Client | `settlement: SettlementData`<br/>`numberRoll?: NumberRollConfig[]` | `rollingValues[3]` (청구/지급/합계) | **#8 number-rolling** (AI_APPLY 전체 beat)<br/>청구+지급 동시 → 합계 stagger 200ms | REQ-DASH3-004, REQ-DASH3-023 |
| `register-success-dialog.tsx` | Stateless | `open: false (fixed)`<br/>`orderId?: string` | 없음 | 없음 (Phase 3에서 호출 없음) | REQ-DASH3-004, REQ-DASH3-013 |

### 4-2-1. CompanyManagerSection mock 고정값 (REQ-DASH3-014 SSOT)

> `company-manager-section.tsx`는 INITIAL부터 pre-filled 상태로 시작한다. 로그인 + 회사 선택 완료 상태 시뮬레이션. **상세 근거 및 AI_APPLY 제외 결정은 [decision-log §4](./decision-log.md#4-2026-04-17--가상-화주-옵틱물류--담당자-이매니저-pre-filled-확정-ssot) 참조**.

**CompanyData 기본값:**

| 필드 | 값 | 비고 |
|------|----|----|
| 회사명 | **옵틱물류** | 가상 회사명 |
| 사업자등록번호 | `***-**-*****` | 가상 번호 |
| 대표 | 김옵틱 | 가상 |

**ManagerData 기본값:**

| 필드 | 값 | 비고 |
|------|----|----|
| 이름 | **이매니저** | |
| 연락처 | `010-****-****` | |
| 이메일 | `example@optics.com` | 가상 도메인 |
| 부서 | 물류운영팀 | |

**컴포넌트 동작 규약:**

- `aiApplied` prop: **항상 `false` 고정** — AI가 회사/담당자를 변경하지 않음 (pre-filled 상태는 AI 적용 이전에 완료된 설정)
- `fillIn` prop: **수용 안 함** — 기존 props 표의 `fillIn?: FillInCommand`에서 제거
- `useEffect`: 없음 — stateless 순수 렌더
- 모든 Step(INITIAL/AI_INPUT/AI_EXTRACT/AI_APPLY partial/all)에서 **동일 값 유지**, props 변경 없음

**AI_APPLY 제외 범위 (조작감 매트릭스):**

| 조작감 | CompanyManagerSection 적용 | 근거 |
|--------|--------------------------|------|
| #6 fill-in caret | ❌ 미적용 | pre-filled이므로 caret blink 무의미 |
| #10 Column-wise Border Pulse (파트별) | ❌ 미적용 | 파트별 beat는 Col 1 Location 상/하차만 대상 |
| #10 Column-wise Border Pulse (전체) | ❌ 미적용 | 전체 beat Col 1 대상 없음 (Transport/Estimate/Settlement는 Col 3) |
| #3 press / #4 ripple | ❌ 해당 없음 | AiButtonItem에 회사 카테고리 없음 (상차/하차/화물/운임 4종만) |

### 4-3. AI_APPLY 2단 타이밍 트랙 주입

`preview-steps.ts`의 STATE-004a(partial) / STATE-004b(all) 스냅샷이 다음 구조로 trait를 전달한다.

```typescript
// STATE-004a: AI_APPLY partial beat
{
  id: 'AI_APPLY',
  phase: 'partial',  // 안 B 내부 분기
  duration: 1500,
  interactions: {
    pressTargets: [
      { id: 'ai-btn-departure', beatDelay: 0 },
      { id: 'ai-btn-destination', beatDelay: 200 },
      { id: 'ai-btn-cargo', beatDelay: 400 },
      { id: 'ai-btn-fare', beatDelay: 600 }
    ],
    rippleTargets: [/* 동일 ID, offset 50ms */],
    fillInFields: [
      // 상차지 → Col 1 row 2 (T=0~, 간격 ≤120ms)
      { fieldId: 'pickup-address', value: '서울 강남구 물류센터', delay: 50 },
      { fieldId: 'pickup-detail', value: '3층 B동', delay: 150 },
      { fieldId: 'pickup-contact', value: '010-****-****', delay: 250 },
      // DateTime 상차 → Col 2 row 2 (left)
      { fieldId: 'pickup-date', value: '2026-04-18', delay: 350 },
      { fieldId: 'pickup-time', value: '09:00', delay: 450 },
      // 하차지 → Col 1 row 3 (T=200~)
      { fieldId: 'delivery-address', value: '대전 유성구 산업단지로 123', delay: 250 },
      // ... (생략)
      // 화물 → Col 2 row 3 (T=400~)
      { fieldId: 'cargo-vehicle', value: '5톤 카고', delay: 450 },
      // ... (생략)
      // 운임 → Col 3 row 2 (T=600~)
      // EstimateInfoCard 거리/시간은 #6, 운임은 #8 number-rolling
    ],
    dropdownBeat: { fieldId: 'cargo-vehicle', sequence: ['open', 'highlight', 'close'], duration: 600 },
    numberRoll: [
      { targetId: 'estimate-fare', from: 0, to: 420000, delay: 700, duration: 400 }
    ],
    // Phase 3 신규: 3-column border pulse (REQ-DASH3-029 재정의)
    columnPulseTargets: [
      { sectionId: 'location-pickup',      column: 'col-1', delay: 0,   duration: 400 },
      { sectionId: 'location-delivery',    column: 'col-1', delay: 200, duration: 400 },
      { sectionId: 'datetime-pickup-dropoff', column: 'col-2', delay: 200, duration: 400 },
      { sectionId: 'cargo-info',           column: 'col-2', delay: 400, duration: 400 },
      { sectionId: 'estimate-info',        column: 'col-3', delay: 600, duration: 400 }
    ]
  }
}

// STATE-004b: AI_APPLY all beat (internal)
// 주의: CompanyManagerSection은 pre-filled (REQ-DASH3-014) → fillInFields/columnPulseTargets 대상 아님
{
  id: 'AI_APPLY',
  phase: 'all',
  duration: 800,
  interactions: {
    // fillInFields 제거됨 — Company/Manager 관련 entry 0건 (decision-log §4-4)
    fillInFields: [],
    strokeBeats: [
      // TransportOption → Col 3 row 1 (8옵션 전체 stagger 60ms, 기존 3옵션에서 확장)
      { targetId: 'option-direct',     delay: 0,   duration: 200 },
      { targetId: 'option-roundtrip',  delay: 60,  duration: 200 },
      { targetId: 'option-express',    delay: 120, duration: 200 },
      { targetId: 'option-forklift',   delay: 180, duration: 200 },
      { targetId: 'option-manual',     delay: 240, duration: 200 },
      { targetId: 'option-cod',        delay: 300, duration: 200 },
      { targetId: 'option-tracking',   delay: 360, duration: 200 },
      { targetId: 'option-urgent',     delay: 420, duration: 200 },
      // Estimate 자동배차 → Col 3 row 2 (150ms 앞당김)
      { targetId: 'estimate-auto-dispatch', delay: 150, duration: 200 }
    ],
    numberRoll: [
      // Settlement → Col 3 row 3 (구성 유지, delay 100ms 앞당김)
      { targetId: 'settlement-charge',   from: 0, to: 420000, delay: 200, duration: 400 },
      { targetId: 'settlement-dispatch', from: 0, to: 350000, delay: 200, duration: 400 },
      { targetId: 'settlement-extra',    from: 0, to: 30000,  delay: 300, duration: 300 },
      { targetId: 'settlement-total',    from: 0, to: 450000, delay: 400, duration: 300 }
    ],
    // 3-column border pulse — Col 1(Company) 제거, Col 3 중심으로 재구성
    columnPulseTargets: [
      { sectionId: 'transport-options',  column: 'col-3', delay: 0,   duration: 400 },
      { sectionId: 'estimate-info',      column: 'col-3', delay: 150, duration: 400 },
      { sectionId: 'settlement',         column: 'col-3', delay: 200, duration: 400 }
    ]
  }
}
```

*(위 코드는 설계 스케치 — 실제 타입/필드는 `mock-data.ts` + `preview-steps.ts` 구현 시 확정)*

**전체 beat 타이밍 매트릭스 요약 (REQ-DASH3-014 반영):**

| T (ms) | 대상 | 조작감 | Column |
|--------|------|--------|--------|
| 0 | TransportOption 8옵션 (stagger 60ms) | #9 toggle stroke | Col 3 |
| 150 | EstimateInfoCard 자동배차 | #9 toggle stroke | Col 3 |
| 200 | Settlement 청구/지급 + #10 pulse | #8 number-rolling | Col 3 |
| 300 | Settlement 추가 요금 +30k | #8 number-rolling | Col 3 |
| 400 | Settlement 합계 (0 → 450,000원) | #8 number-rolling | Col 3 |

**제거된 항목 (pre-filled로 인해):**
- `fillInFields`: `company-name`, `manager-name`, `manager-contact` (3건 전부 제거)
- `columnPulseTargets`: `sectionId: 'company-manager'` (Col 1 T=0 entry 제거)

**영향받지 않는 것:**
- 전체 beat 총 지속 ≤ 0.8s **유지** (REQ-DASH3-043)
- #10 Column-wise Border Pulse 유틸 자체 **유지**
- 파트별 beat (STATE-004a) **변화 없음**

---

## 5. interactions 6 유틸 명세

> 원본 참조: [Phase 1 스펙 §11](../../../../../archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md#11-조작감-강화-레이어-신규)

### 5-1. 유틸별 명세

| 파일 | 유틸 | 적용 대상 | 입력 (args) | 출력 (state) | Duration | Priority | PRD REQ |
|------|------|---------|-------------|-------------|----------|----------|---------|
| `use-fake-typing.ts` | #1 변동 리듬 타이핑 | AiInputArea | `fullText: string`<br/>`rhythm: { slow: number, fast: number }` | `displayText: string` (글자 누적) | ≤ 1.5s | **Must (MVP)** | REQ-DASH3-020 |
| `use-button-press.ts` | #3 Button Press | AiExtractButton, AiButtonItem | `trigger: boolean` | `pressed: boolean` (scale 0.97, shadow 축소) | 150ms | **Must (MVP)** | REQ-DASH3-021 |
| `use-focus-walk.ts` | #2 Focus Walk | AiInputArea → ExtractButton → Results | `targetIds: string[]`<br/>`delay: number` | `activeFocusId: string` | 300ms | Should | REQ-DASH3-024 |
| `use-ripple.ts` | #4 Ripple | AiButtonItem | `trigger: boolean`<br/>`origin?: { x, y }` | `rippling: boolean` (원형 wave 확산) | 300ms | Should | REQ-DASH3-025 |
| `use-fill-in-caret.ts` | #6 Fill-in Caret | Location/Cargo/DateTime/Company 필드 | `fields: FillInCommand[]` | `caretFieldId: string`<br/>`filledFields: Set<string>` | caret blink 150~200ms + 필드 간 ≤ 120ms | **Must (MVP)** | REQ-DASH3-022 |
| `use-number-rolling.ts` | #8 Number Rolling | EstimateInfoCard, SettlementSection | `from: number`<br/>`to: number`<br/>`duration: number` | `currentValue: number` | 0.3~0.5s | **Must (MVP)** | REQ-DASH3-023 |

### 5-2. 비유틸 조작감 4종 (CSS/DOM)

> REQ-DASH3-072 분류 — **렌더링 테스트에서 상태만 검증**

| # | 이름 | 구현 | 적용 대상 | PRD REQ |
|---|------|------|---------|---------|
| 5 | Hover→Active | CSS `:hover` + `transition: background 200ms` | AiResultButtons 그룹 컨테이너 | REQ-DASH3-026 |
| 7 | Dropdown 펼침 | 전용 prop `dropdownBeat` + CSS class 토글 | CargoInfoForm select | REQ-DASH3-027 |
| 9 | Toggle stroke | SVG `stroke-dashoffset` transition 200ms | TransportOptionCard 8옵션, 자동배차 | REQ-DASH3-028 |
| 10 | **Column-wise Border Pulse** (재정의) | CSS `@keyframes pulse` + `outline` + `box-shadow` (scrollIntoView 제거) | OrderForm 3-column grid 내 활성 섹션 | REQ-DASH3-029 (재정의) |

**#10 재정의 상세**:
- 기존 "Section Scroll Snap + Border Pulse"는 3-column 축소 렌더(scale 0.45) 환경에서 scrollIntoView가 실질 효과 없음 → **Column 단위 focus 강조**로 변경.
- 활성 섹션에 `outline: 2px solid var(--accent)` + `box-shadow: 0 0 0 4px rgba(accent, 0.2)` → 400ms 후 fade-out.
- 동일 Column 내 인접 섹션이 순차 활성화될 경우 pulse가 이어지며 "Column이 숨쉬는" 효과 연출.
- Column 단위 이동(Col 1 → Col 2 등)에서는 이전 Column 마지막 섹션의 pulse 종료와 새 Column 첫 섹션의 pulse 시작이 **50ms 오버랩** (시선 이동 유도).
- **타이밍 매트릭스**:

| Step | Column 활성 순서 | Pulse 타이밍 |
|------|-----------------|---------------|
| AI_APPLY 파트별 | Col 1(상차) → Col 1(하차) + Col 2(DT상차/하차) → Col 2(Cargo) → Col 3(Estimate 일부) | T=0, 200, 400, 600 각각 400ms pulse |
| AI_APPLY 전체 | Col 1(Company) → Col 3(Transport) → Col 3(Estimate 자동배차) → Col 3(Settlement) | T=0, 150, 250, 300 각각 400ms pulse |

### 5-3. prefers-reduced-motion 통합 fallback

모든 6 유틸 + 4 CSS/DOM은 `useReducedMotion()` 훅 감지 시 **duration = 0, 최종 상태 즉시 스냅** (REQ-DASH3-031).

```typescript
// use-fake-typing.ts 예시
export function useFakeTyping(fullText: string, rhythm: RhythmConfig) {
  const prefersReducedMotion = useReducedMotion()
  const [displayText, setDisplayText] = useState(prefersReducedMotion ? fullText : '')
  // ... prefersReducedMotion가 true면 바로 fullText 반환
}
```

### 5-4. 테스트 전략 (REQ-DASH3-072)

| 유틸 | 단위 테스트 | 타이밍 검증 테스트 |
|------|-----------|-------------------|
| use-fake-typing | 글자 누적 순서, rhythm 적용 | 1.5s 상한 확인, 표준편차 > 0 |
| use-button-press | trigger 시 pressed=true, 150ms 후 false | scale transform 검증 |
| use-focus-walk | 순차 이동, 경로 일치 | 300ms 내 완료 |
| use-ripple | trigger 시 wave 확산 | 300ms 내 소멸 |
| use-fill-in-caret | 필드 순서 + caret idx | 간격 ≤ 120ms, blink 150~200ms |
| use-number-rolling | from → to 선형 보간 | 0.3~0.5s 내 도달 |

---

## 6. 공통 props / 상태 규약

### 6-1. 공통 타입 (Phase 1 스펙 §6/§7 승계)

```typescript
interface AiStateSnapshot {
  activeTab: 'text' | 'image'
  textProgress: number              // 0~1
  extractState: 'idle' | 'loading' | 'resultReady'
  buttons: Record<string, 'pending' | 'applied' | 'unavailable'>
  warningsVisible: boolean
  jsonViewerOpen: boolean
}

interface FormStateSnapshot {
  companyManagerFilled: boolean
  pickupFilled: boolean
  deliveryFilled: boolean
  pickupDateTimeFilled: boolean
  deliveryDateTimeFilled: boolean
  vehicleFilled: boolean
  cargoFilled: boolean
  optionsActive: string[]
  estimateVisible: boolean
  settlementVisible: boolean
  highlightedSection: string | null
  successDialogOpen: false          // Phase 3 고정
}

interface InteractionsTrack {
  typingRhythm?: TypingRhythmConfig
  focusWalk?: string[]
  pressTargets?: Array<{ id: string, beatDelay: number }>
  rippleTargets?: Array<{ id: string, beatDelay: number }>
  fillInFields?: Array<{ fieldId: string, value: string, delay: number }>
  dropdownBeat?: { fieldId: string, sequence: string[], duration: number }
  strokeBeats?: Array<{ targetId: string, delay: number, duration: number }>
  numberRoll?: Array<{ targetId: string, from: number, to: number, delay: number, duration: number }>
  // Phase 3 재정의: #10 Column-wise Border Pulse (기존 scrollSnapTargets 대체)
  columnPulseTargets?: Array<{
    sectionId: string             // e.g., 'location-pickup', 'cargo-info', 'settlement'
    column: 'col-1' | 'col-2' | 'col-3'
    delay: number                 // ms (step 내부 시작 offset)
    duration: number              // ms (기본 400)
  }>
}
```

### 6-2. 모든 컴포넌트 공통 금지 사항 (REQ-DASH3-002/007)

- `useState`는 **애니메이션 내부 상태**(pressed, rippling, displayText 등)에만 허용. 비즈니스 상태 금지.
- `useEffect`는 **애니메이션 타이밍 제어**(setTimeout, requestAnimationFrame)에만 허용.
- 외부 imports 금지 목록:
  - `@/store/*` (zustand)
  - `react-hook-form`
  - `@tanstack/react-query`
  - `next/navigation`
  - `@/lib/api/*`
- 모든 표시 값은 **`mock-data.ts`에서 주입** — 하드코딩 금지 (REQ-DASH3-065).

### 6-3. Feature flag 병행 (REQ-DASH3-052)

- env: `NEXT_PUBLIC_DASH_PREVIEW_VERSION=phase3` (기본값 `phase2`)
- prop: `<DashboardPreview variant="phase2" | "phase3" />`
- 두 버전 **동시 존재** — dashboard-preview.tsx 내부에서 조건부 `<AiRegisterMain>` vs Phase 1/2 축약 컴포넌트 렌더.

---

## 7. shadcn/ui 3-C 하이브리드 5 컴포넌트

> REQ-DASH3-051 확정. Phase 1 스펙 §4 승계.

| 파일 | CLI 설치 | 역할 | 사용처 |
|------|---------|------|--------|
| `components/ui/button.tsx` | `npx shadcn@latest add button` | AiExtractButton 기반 | AiPanel |
| `components/ui/input.tsx` | `npx shadcn@latest add input` | LocationForm/CargoInfoForm 필드 | OrderForm |
| `components/ui/textarea.tsx` | `npx shadcn@latest add textarea` | AiInputArea | AiPanel |
| `components/ui/card.tsx` | `npx shadcn@latest add card` | 9개 섹션 컨테이너 | OrderForm |
| `components/ui/badge.tsx` | `npx shadcn@latest add badge` | AiWarningBadges, StepIndicator 뱃지 | AiPanel + Preview |

**설치 안 함 (Tailwind 재작성):**
- Select → `<div role="combobox">` + Tailwind
- Dialog/Popover → 정적 스냅샷 (open=false)
- Calendar → 정적 grid
- Checkbox → `<div>` + lucide icon

**Radix 의존성 신규 추가 (최소):**
- `@radix-ui/react-slot` (Button)
- `@radix-ui/react-label` (Input)
- 위 2개 외 추가 금지

---

## 8. PCC-04 자체 사전 점검

> PRD ↔ Wireframe 일관성 검증 (본 파일 작성 시점 기준 self-check)

| # | 항목 | 결과 | 증거 |
|---|------|------|------|
| PCC-04-01 | AI_APPLY 2단 구조 확정 기록 존재 | ✅ | §1-1 decision log |
| PCC-04-02 | UI 힌트 위치·형태 확정 기록 존재 | ✅ | §1-2 decision log |
| PCC-04-03 | AiPanel 8 파일 명세 존재 (REQ-DASH3-003) | ✅ | §3-2 (8행) |
| PCC-04-04 | OrderForm 9 파일 명세 존재 (REQ-DASH3-004) | ✅ | §4-2 (9행) |
| PCC-04-05 | interactions 6 유틸 명세 존재 (REQ-DASH3-030) | ✅ | §5-1 (6행) |
| PCC-04-06 | 조작감 MVP 4종 Must 표기 (#1/#3/#6/#8) | ✅ | §5-1 Priority 열 |
| PCC-04-07 | NTH 6종 Should 표기 (#2/#4/#5/#7/#9/#10) | ✅ | §5-1 + §5-2 |
| PCC-04-08 | Desktop scale 0.45 + 3-column 명시 (REQ-DASH-023) | ✅ | screens.md §2, §3, §6 |
| PCC-04-09 | Tablet scale **0.40** + 3-column 유지 명시 (REQ-DASH-024, C안 확정) | ✅ | screens.md §3, §6 |
| PCC-04-10 | Mobile MobileCardView 승계 명시 | ✅ | screens.md §4 |
| PCC-04-08a | **OrderForm 3-column grid 배치 도식 존재** (REQ-DASH-003/007) | ✅ | components.md §4-0, screens.md §1 (3-col 배치 표) |
| PCC-04-08b | **Col 1/2/3 섹션 포함 규약** (원본 register-form.tsx:939 대응) | ✅ | components.md §4-0 Column별 포함 섹션 표 |
| PCC-04-08c | **3-column 대각 흐름 (AI_APPLY 파트별/전체 beat Column 이동)** 기술 | ✅ | components.md §4-0 대각 흐름 / screens.md §2-5, §2-6 Column 이동 경로 |
| PCC-04-08d | **Tablet 원본과의 divergence 명시 (C안 근거)** | ✅ | screens.md §3 3-2, §6 (divergence 행) |
| PCC-04-11 | 4-Step 구조 (COMPLETE 제외) | ✅ | navigation.md §2-1 |
| PCC-04-12 | Step 전환 오버랩 100~200ms 명시 | ✅ | navigation.md §2-1, §2-3 |
| PCC-04-13 | 총 루프 6~8초 범위 검증 | ✅ | navigation.md §2-2 (4.4~6.0s, 상한 오버랩 제외 6.5~8.3s) |
| PCC-04-14 | 히트 영역 19~20개 매핑 (REQ-DASH3-037) | ✅ | screens.md §5-2 (20행) |
| PCC-04-15 | AI_APPLY 경로 우선 활성화 10개 표기 | ✅ | screens.md §5-2 + navigation.md §4-3 |
| PCC-04-16 | prefers-reduced-motion fallback 전체 | ✅ | screens.md §7, 본 파일 §5-3 |
| PCC-04-17 | shadcn 3-C 5 컴포넌트 명시 | ✅ | §7 |
| PCC-04-18 | Feature flag 병행 구조 명시 | ✅ | §6-3 |
| PCC-04-19 | RegisterSuccessDialog open=false 고정 | ✅ | §4-2, REQ-DASH3-013 |
| PCC-04-20 | SearchAddress/CompanyManagerDialog 정적 처리 | ✅ | screens.md §5-2 #20, REQ-DASH3-005 |
| PCC-04-21 | **#10 Column-wise Border Pulse 재정의** 반영 (scrollIntoView 제거) | ✅ | §4-2 order-form/index.tsx 행 columnPulseTargets / §5-2 #10 / §6-1 InteractionsTrack 타입 |
| PCC-04-22 | **히트 영역 20개 3-column 좌표 재매핑** (#13 distance-info 신규, #15 DateTime 2-col 통합) | ✅ | screens.md §5-1, §5-2 (Col 좌표 열 추가) |
| PCC-04-23 | **AI_APPLY 파트별 beat Column 이동 경로** (Col 1→Col 1→Col 2→Col 3) 타이밍 매트릭스 명시 | ✅ | screens.md §2-5 상단 표 / navigation.md §2-4 (후속 업데이트) |
| PCC-04-24 | **AI_APPLY 전체 beat Column 이동** (Col 1→Col 3 일관) 타이밍 매트릭스 명시 | ✅ | screens.md §2-6 상단 표 / components.md §4-0 대각 흐름 |
| PCC-04-25 | **CompanyManagerSection pre-filled** 가상 화주 "옵틱물류" + 담당자 이매니저 확인 (REQ-DASH3-014) | ✅ | decision-log §4-3, components.md §4-2-1, screens.md §2-2 ~ §2-6 ASCII, PRD §6-1 |
| PCC-04-26 | **AI_APPLY 전체 beat 재조정** — 담당자 연락처 제거, 옵션(8옵션)/자동배차/정산 중심 | ✅ | decision-log §4-4, components.md §4-3 STATE-004b 스케치, PRD §6-2, screens.md §2-6, navigation.md §2-4 |
| PCC-04-27 | **조작감 제외 확인** — CompanyManager는 #6 fill-in / #10 border pulse 대상 아님 | ✅ | components.md §4-2-1 조작감 매트릭스, §4-2 company-manager-section.tsx 행 "없음 (pre-filled)", §4-3 STATE-004b fillInFields 빈 배열 |
| PCC-04-28 | **히트 #11 company-manager 비활성** (Should → 비활성, pre-filled 참고 hover만) | ✅ | screens.md §5-2 (#11 행), decision-log §4-4 표 |

**결과: 28/28 통과 ✅** (가상 화주 옵틱물류 반영 후 4개 신규 항목 통과)

**미해소 항목 / 후속 이관 필요:**
- Duration 세부 숫자(특히 stagger 간격)는 `/plan-stitch` 또는 Spike 단계에서 실측 보정 필요 (PRD §8-0).
- Tablet scale **0.40** + 3-column 유지 (C안) 가독성은 Milestone 5 A/B 검증 대상 (R5 리스크). 실패 시 폴백: ① 0.45 상향 또는 ② 원본 동일 1-col reflow.
- 테스트 legacy 격리 전략은 Dev 착수 전 Q7 해소 필요 (REQ-DASH3-071).
- Tablet(scale 0.40) 환경에서 CompanyManagerSection의 pre-filled 텍스트(회사명 "옵틱물류" / 담당자 "이매니저" / "010-****-****" / "물류운영팀") 4줄이 **Col 1 row 1 박스 높이 안에 모두 가독 가능한지** Milestone 5 시각 검증 필요. 과밀 시 이메일(example@optics.com) 또는 부서(물류운영팀) 중 1개 숨김 허용.

---

## 9. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-04-17 | 초안 — AI_APPLY 2단 안 B 확정, UI 힌트 위치 확정, AiPanel 8/OrderForm 9/interactions 6 명세, PCC-04 self-check 20/20 |
| 2026-04-17 | **OrderForm 3-column 재현** — §4-0 3-column grid 배치 도식 신규 (Col 1/2/3 포함 섹션 규약 + 대각 흐름). §4-2 order-form/index.tsx 조작감 명세 `columnPulseTargets`로 재정의. §5-2 #10 "Scroll snap → Column-wise Border Pulse" 재정의 (scrollIntoView 제거 근거). §6-1 `InteractionsTrack` 타입에 `columnPulseTargets` 필드 추가. §4-3 코드 스케치에 partial/all 비트별 columnPulseTargets 주입. PCC-04 20→24 (3-column 항목 4건 신규 통과). |
| 2026-04-17 | **가상 화주 "옵틱물류" pre-filled 반영** — §4-2 company-manager-section.tsx 행을 Stateless + pre-filled 고정으로 변경, 조작감 주입 "없음 (pre-filled, AI_APPLY 영향 없음)"로 수정. §4-2-1 신규 — mock 고정값 표(CompanyData/ManagerData) + 동작 규약 + AI_APPLY 제외 매트릭스. §4-3 STATE-004b 스케치에서 Company/Manager fillInFields 3건 제거, columnPulseTargets에서 `company-manager` 제거, strokeBeats를 TransportOption 8옵션 전체로 확장, Settlement 추가 요금 +30k 신규 편입. §4-3 하단에 전체 beat 타이밍 매트릭스 요약표 추가. PCC-04 24→**28** (pre-filled 항목 4건 신규 통과). |
