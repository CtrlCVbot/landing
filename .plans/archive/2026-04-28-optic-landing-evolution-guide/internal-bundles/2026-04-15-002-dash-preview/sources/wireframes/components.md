# Component Specification: Dashboard Preview

> **PRD**: `dash-preview` (Approved 2026-04-14)
> **Last Updated**: 2026-04-14

---

## 1. 컴포넌트 트리

```
DashboardPreview (container)
  |
  +-- PreviewChrome
  |     +-- ChromeHeader
  |     +-- ScaledContent
  |           +-- MainContentLayout
  |                 +-- AiPanelPreview
  |                 |     +-- AiTabBar
  |                 |     +-- AiInputAreaPreview
  |                 |     +-- AiExtractButton
  |                 |     +-- AiResultButtonsPreview
  |                 |           +-- AiCategoryGroup x4
  |                 |                 +-- AiButtonItem x N
  |                 |
  |                 +-- FormPreview
  |                       +-- CargoInfoPreview
  |                       +-- LocationPreview (상차지)
  |                       +-- LocationPreview (하차지)
  |                       +-- TransportOptionsPreview
  |                       +-- EstimatePreview
  |
  +-- StepIndicator
  |     +-- StepDot x5
  |
  +-- InteractiveOverlay (Phase 2)
        +-- HitArea x11
        +-- Tooltip
```

---

## 2. 컴포넌트 명세 상세

### 2-1. DashboardPreview (Container)

| 항목 | 값 |
|------|---|
| **파일** | `dashboard-preview.tsx` |
| **역할** | 최상위 컨테이너. 상태 머신 + 자동 재생 관리 + 모드 전환 |
| **REQ** | REQ-DASH-001~003, 010~013, 023~026, 027~029, 033~035 |

**Props**

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| className | string? | - | 외부 스타일 확장 |

**State (내부)**

| State | Type | Initial | 설명 |
|-------|------|---------|------|
| currentStep | number | 0 | 현재 step index (0~4) |
| mode | 'cinematic' \| 'interactive' \| 'static' | 'cinematic' | 현재 모드 |
| isPlaying | boolean | true | 자동 재생 여부 |

**Hooks**

| Hook | 파일 | 역할 |
|------|------|------|
| useAutoPlay | `use-auto-play.ts` | 자동 재생 타이머, pause/resume, timeout 우선순위 |
| useMediaQuery | (기존 유틸) | 반응형 뷰포트 감지 |
| useReducedMotion | (기존 유틸) | prefers-reduced-motion 감지 |

**동작**

| 이벤트 | 동작 | 조건 |
|--------|------|------|
| mount | delay 0.6s 후 자동 재생 시작 | reduced-motion 아닌 경우 |
| mount (reduced-motion) | Step 5(COMPLETE) 정적 표시 | prefers-reduced-motion |
| viewport resize | 반응형 모드 전환 | Desktop/Tablet/Mobile |

**렌더링 분기**

```
Desktop/Tablet: <PreviewChrome> + <StepIndicator>
Mobile:         <MobileCardView> + <MobileDotIndicator>
```

---

### 2-2. PreviewChrome

| 항목 | 값 |
|------|---|
| **파일** | `preview-chrome.tsx` |
| **역할** | 브라우저 스타일 chrome 프레임. ChromeHeader + ScaledContent 포함 |
| **REQ** | REQ-DASH-001~003 |

**Props**

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| children | ReactNode | - | ScaledContent 내부 콘텐츠 |
| title | string | "OPTIC Broker" | chrome 타이틀 바 텍스트 |

**스타일 토큰**

| 요소 | 토큰 | 값 |
|------|------|---|
| 배경 | --color-card | oklch(0.15 0.01 260 / 0.5) |
| border | --color-border | #1f2937 (gray-800) |
| 모서리 | - | rounded-2xl |
| dots | - | red(#ef4444), yellow(#eab308), green(#22c55e), 각 8px circle |

**내부 구조**

```
┌─────────────────────────────────────────┐
│ ChromeHeader                            │
│ ┌─────────────────────────────────────┐ │
│ │ ● ● ●    {title}                    │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ ScaledContent (overflow: hidden)        │
│ ┌─────────────────────────────────────┐ │
│ │ transform: scale(scaleFactor)       │ │
│ │ transformOrigin: top left           │ │
│ │ width: 100/scaleFactor %            │ │
│ │                                     │ │
│ │ {children}                          │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Scale Factor (뷰포트별)**

| 뷰포트 | scaleFactor | 설명 |
|--------|-------------|------|
| Desktop (>=1024px) | 0.45 | 전체 축소 뷰 |
| Tablet (768~1023px) | 0.38 | 약간 더 축소 |
| Mobile (<768px) | - | chrome 비렌더링 |

---

### 2-3. AiPanelPreview

| 항목 | 값 |
|------|---|
| **파일** | `ai-panel-preview.tsx` |
| **역할** | AiPanel 축소 재현: AiInputArea + AiResultButtons |
| **REQ** | REQ-DASH-004~006 |

**Props**

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| step | number | - | 현재 step index |
| aiPanelState | AiPanelState | - | Step별 AI 패널 상태 |

**상태별 렌더링**

| Step | AiInputArea | ExtractButton | AiResultButtons |
|------|-------------|---------------|-----------------|
| 0 (INITIAL) | textarea 비어있음 | disabled | 비표시 |
| 1 (AI_INPUT) | 타이핑 애니메이션 | active(enabled) | 비표시 |
| 2 (AI_EXTRACT) | 메시지 완성 | pressed -> loading | 4개 그룹 등장 (all blue) |
| 3 (AI_APPLY) | 메시지 유지 | disabled | 순차 blue->green |
| 4 (COMPLETE) | 메시지 유지 | disabled | all green |

**하위 컴포넌트**

#### AiTabBar

| 항목 | 값 |
|------|---|
| 역할 | [텍스트] [이미지] 탭 표시, "텍스트" 탭 고정 활성 |
| 상태 | 정적 (변화 없음) |
| 렌더링 | 2개 탭 버튼, 첫 번째 active 스타일 |

#### AiInputAreaPreview

| 항목 | 값 |
|------|---|
| 역할 | textarea 영역 재현 |
| 상태 | empty -> typing -> filled |

| State | 시각 | 설명 |
|-------|------|------|
| empty | 빈 textarea, placeholder 표시 | INITIAL |
| typing | 글자가 순차 등장, cursor 깜빡임 | AI_INPUT (4초 동안) |
| filled | 전체 메시지 표시 | AI_EXTRACT ~ COMPLETE |

#### AiExtractButton

| 항목 | 값 |
|------|---|
| 역할 | "추출하기" 버튼 재현 |

| State | 시각 | 조건 |
|-------|------|------|
| disabled | opacity: 0.5, cursor: not-allowed | INITIAL |
| active | opacity: 1, hover 가능 | AI_INPUT |
| pressed | scale: 0.95, bg 진하게 | AI_EXTRACT 시작 (0~0.5s) |
| loading | Loader2 아이콘 회전(spin, 1s linear infinite) + "분석 중..." 텍스트 | AI_EXTRACT 중반 (0.5~3s) |
| disabled | opacity: 0.5 | AI_APPLY ~ COMPLETE |

#### AiResultButtonsPreview

| 항목 | 값 |
|------|---|
| 역할 | 4개 카테고리 버튼 그룹 재현 |

**카테고리 그룹 구조**

| # | Category | Icon | Label | 하위 버튼 |
|---|----------|------|-------|----------|
| 1 | departure | MapPin | 상차지 | 주소명, 담당자, 연락처, 상차일시 |
| 2 | destination | Flag | 하차지 | 주소명, 담당자, 연락처, 하차일시 |
| 3 | cargo | Package | 화물/차량 | 차량종류, 중량, 화물명, 비고 |
| 4 | fare | Banknote | 운임 | 운임금액 |

#### AiButtonItem

| 항목 | 값 |
|------|---|
| 역할 | 개별 AI 결과 버튼 |

| State | 배경색 | 아이콘 | 텍스트 |
|-------|--------|--------|--------|
| pending | #3b82f6 (blue-500) | Clock/Loader | "{label}: {displayValue}" |
| applied | #22c55e (green-500) | Check | "{label}: {displayValue}" |
| unavailable | #6b7280 (gray-500) | X | "{label}: --" |

**애니메이션**

| 동작 | 애니메이션 | Duration |
|------|----------|----------|
| 버튼 등장 (AI_EXTRACT) | fade-in + slide-down, stagger 0.15s | 카테고리당 0.15s |
| pending→applied (AI_APPLY) | bg-color transition + check 아이콘 fade-in | 0.3s, stagger 0.5s |

---

### 2-4. FormPreview

| 항목 | 값 |
|------|---|
| **파일** | `form-preview.tsx` |
| **역할** | OrderRegisterForm 축소 재현. 5개 Card 블록 |
| **REQ** | REQ-DASH-007~009 |

**Props**

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| step | number | - | 현재 step index |
| formState | FormState | - | Step별 폼 상태 |

**하위 컴포넌트 명세**

#### CargoInfoPreview

| 항목 | 값 |
|------|---|
| 역할 | 차량 타입/중량/화물명 Card 재현 |

| 필드 | 빈 상태 | 채워진 상태 | 채워지는 Step |
|------|---------|------------|-------------|
| 차량타입 | [______] | 카고 5톤 | AI_APPLY (화물/차량 버튼 적용 시) |
| 중량 | [______] | 5톤 | AI_APPLY |
| 화물명 | [______] | 파레트적재 공산품 3파레트 | AI_APPLY |

#### LocationPreview

| 항목 | 값 |
|------|---|
| 역할 | LocationForm(상차지/하차지) Card 재현 |
| 인스턴스 | x2 (상차지, 하차지) |

**Props**

| Prop | Type | 설명 |
|------|------|------|
| type | 'departure' \| 'destination' | 상차지/하차지 구분 |
| data | LocationData \| null | 채워진 데이터 |
| isHighlighted | boolean | glow 효과 적용 여부 |

| 필드 | 상차지 값 (채워진 상태) | 하차지 값 |
|------|----------------------|----------|
| 주소 | 서울 강남구 물류센터 | 대전 유성구 산업단지 |
| 담당자 | -- | -- |
| 연락처 | -- | -- |
| 날짜 | 내일 | -- |
| 시간 | 오전 9시 | -- |

| State | 시각 | 조건 |
|-------|------|------|
| empty | 모든 필드 비어있음, 라벨만 표시 | INITIAL ~ AI_EXTRACT |
| filling | 값이 fade-in으로 등장 + Card glow | AI_APPLY (해당 버튼 적용 시) |
| filled | 값이 표시됨, glow 해제 | AI_APPLY 이후 |

#### TransportOptionsPreview

| 항목 | 값 |
|------|---|
| 역할 | 운송 옵션 토글 Card 재현 |

| 옵션 | 빈 상태 | 채워진 상태 |
|------|---------|------------|
| 직송 | [ ] | [x] |
| 지게차 | [ ] | [x] |
| 왕복 | [ ] | [ ] |
| 긴급 | [ ] | [ ] |

| State | 조건 |
|-------|------|
| unchecked all | INITIAL ~ AI_EXTRACT |
| partial checked | AI_APPLY (직송, 지게차 활성화) |

#### EstimatePreview

| 항목 | 값 |
|------|---|
| 역할 | EstimateInfoCard 재현, 금액 카운팅 |
| REQ | REQ-DASH-009 |

| 필드 | 빈 상태 | 채워진 상태 |
|------|---------|------------|
| 거리 | --km | 140km |
| 운임 | --원 | 420,000원 |

| State | 시각 | 조건 |
|-------|------|------|
| empty | "--km", "--원" | INITIAL ~ AI_EXTRACT |
| counting | 숫자 카운팅 애니메이션 (0 -> 420,000) | AI_APPLY 운임 버튼 적용 시 |
| settled | "140km", "420,000원" 고정 | 카운팅 완료 후 |

**금액 카운팅 애니메이션**: 0.5~1초, easeOut, JS 애니메이션 (REQ-DASH-032 예외 허용)

---

### 2-5. StepIndicator

| 항목 | 값 |
|------|---|
| **파일** | `step-indicator.tsx` |
| **역할** | 하단 5-dot 네비게이션 |
| **REQ** | REQ-DASH-014~016, REQ-DASH-029 |

**Props**

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| totalSteps | number | 5 | 전체 step 수 |
| currentStep | number | - | 현재 활성 step (0-indexed) |
| onStepClick | (step: number) => void | - | step 클릭 핸들러 |

**StepDot 상태**

| State | 시각 | 조건 |
|-------|------|------|
| inactive | w: 8px, h: 8px, bg: gray-600, rounded-full | 비활성 |
| active | w: 8px, h: 8px, bg: accent gradient, rounded-full, scale: 1.25 | 현재 step |
| hover | bg: gray-400, cursor: pointer | 마우스 hover |
| focus | outline: 2px accent, offset: 2px | 키보드 포커스 |

**접근성**

| 속성 | 값 |
|------|---|
| role | tablist |
| StepDot role | tab |
| aria-selected | active dot만 true |
| tabIndex | active: 0, inactive: -1 |
| 키보드 | Tab: 진입, Arrow Left/Right: 이동, Enter/Space: 활성화 |

---

### 2-6. InteractiveOverlay (Phase 2)

| 항목 | 값 |
|------|---|
| **파일** | `interactive-overlay.tsx` (Phase 2에서 추가) |
| **역할** | 축소 뷰 위 투명 오버레이 + 히트 영역 + 툴팁 |
| **REQ** | REQ-DASH-036~038, 043~044 |

**Props**

| Prop | Type | 설명 |
|------|------|------|
| isActive | boolean | 인터랙티브 모드 활성 여부 |
| scaleFactor | number | 축소 비율 (역변환 계산용) |
| hitAreas | HitAreaConfig[] | 히트 영역 정의 |
| onHitAreaClick | (id: string) => void | 히트 영역 클릭 핸들러 |

**HitAreaConfig**

```typescript
interface HitAreaConfig {
  id: string                    // "AiInputArea", "ExtractButton" 등
  label: string                 // 표시 라벨
  tooltip: string               // 툴팁 텍스트 (mock-data.ts에서 관리)
  bounds: {                     // 원본 크기 기준 좌표
    top: number
    left: number
    width: number
    height: number
  }
  minSize: { w: 44, h: 44 }    // 원본 기준 최소 히트 영역 (REQ-DASH-044)
  onClick: () => void           // mock 기능 실행
  dependsOn?: string[]          // 논리적 의존 (예: ["ExtractButton"])
}
```

**Tooltip 컴포넌트**

| State | 시각 | 조건 |
|-------|------|------|
| hidden | 비표시 | hover 없음 |
| visible | bg-gray-900/90, text-white, rounded-md, px-3 py-2, font: 14px, 원본 크기 | 히트 영역 hover |

| 속성 | 값 | 설명 |
|------|---|------|
| 위치 | 히트 영역 상단 또는 우측 | 뷰포트 내 표시 보장 |
| z-index | 오버레이 최상단 | 축소 뷰 위에 표시 |
| font-size | 14px (원본 크기) | 가독성 보장 (REQ-DASH-038) |
| max-width | 280px | 긴 텍스트 줄바꿈 |

---

### 2-7. MobileCardView (Mobile 전용)

| 항목 | 값 |
|------|---|
| **파일** | `mobile-card-view.tsx` |
| **역할** | Mobile 전용 요약 카드 뷰. Desktop 축소 뷰와 완전히 다른 레이아웃 |
| **REQ** | REQ-DASH-025~026 |

**Props**

| Prop | Type | 설명 |
|------|------|------|
| currentMobileStep | 0 \| 1 | 0: AI_EXTRACT, 1: COMPLETE |

**카드 상태**

| Step | 카드 제목 | 내용 |
|------|----------|------|
| 0 (AI_EXTRACT) | "AI가 분석한 결과" | 4개 카테고리 결과 (상차지/하차지/화물/운임) |
| 1 (COMPLETE) | "AI가 완성한 화물등록" | 완성된 오더 정보 (주소/일시/화물/옵션/금액) |

**스타일**

| 요소 | 값 |
|------|---|
| 카드 배경 | bg-gray-900/50 |
| 카드 border | border-gray-800 |
| 모서리 | rounded-xl |
| 텍스트 크기 | 14~16px (가독성 유지) |
| padding | px-4 py-5 |

---

## 3. 공유 데이터 구조

### 3-1. PreviewStep (preview-steps.ts)

```typescript
interface PreviewStep {
  id: string                // 'INITIAL' | 'AI_INPUT' | 'AI_EXTRACT' | 'AI_APPLY' | 'COMPLETE'
  label: string             // '빈 폼' | 'AI 입력' | 'AI 분석' | '자동 적용' | '완료'
  duration: number          // ms (3000, 4000, 4000, 4000, 3000)
  aiPanelState: AiPanelState
  formState: FormState
}

const PREVIEW_STEPS: readonly PreviewStep[] = [
  {
    id: 'INITIAL',
    label: '빈 폼',
    duration: 3000,
    aiPanelState: {
      inputText: '',
      extractState: 'idle',
      buttons: []
    },
    formState: {
      filledCards: [],
      highlightedCard: null,
      estimateAmount: null
    }
  },
  // ... 나머지 4개 step
]
```

### 3-2. AiPanelState

```typescript
interface AiPanelState {
  inputText: string               // 현재 타이핑된 텍스트
  extractState: 'idle' | 'loading' | 'resultReady'
  buttons: Array<{
    id: string                    // categoryGroup ID
    status: 'pending' | 'applied'
  }>
}
```

### 3-3. FormState

```typescript
interface FormState {
  filledCards: string[]           // ['cargoInfo', 'location-departure', ...]
  highlightedCard: string | null  // glow 효과 적용 Card ID
  estimateAmount: number | null   // EstimateInfoCard 금액 (null = --)
}
```

### 3-4. PreviewMockData (mock-data.ts)

```typescript
interface PreviewMockData {
  aiInput: {
    message: string               // 카카오톡 메시지
  }
  aiResult: {
    categories: Array<{
      id: 'departure' | 'destination' | 'cargo' | 'fare'
      label: string
      icon: string                // lucide-react 아이콘 이름
      buttons: Array<{
        fieldKey: string
        label: string
        displayValue: string
        status: 'pending' | 'applied'
      }>
    }>
  }
  formData: {
    pickup: { company: string; address: string; date: string; time: string }
    delivery: { company: string; address: string; date: string; time: string }
    vehicle: { type: string; weight: string }
    cargo: { name: string; remark: string }
    options: string[]
    estimate: { distance: number; amount: number }
  }
  tooltips: Record<string, string>  // Phase 2 히트 영역 ID -> 툴팁 텍스트
}
```

---

## 4. 애니메이션 명세

### 4-1. Step 전환 (cross-fade)

| 속성 | 값 | 설명 |
|------|---|------|
| type | cross-fade | REQ-DASH-013 |
| exit | opacity: 0, y: -8 | 현재 step 퇴장 |
| enter | opacity: 1, y: 0 | 다음 step 등장 |
| duration | 0.4s | 전환 시간 |
| easing | easeOut | Framer Motion easeOut |

### 4-2. 타이핑 효과 (AI_INPUT)

| 속성 | 값 | 설명 |
|------|---|------|
| 방식 | 글자 단위 추가 | message.slice(0, charIndex) |
| 속도 | ~30ms/글자 | 4초 동안 ~133글자 |
| cursor | 깜빡이는 커서 | border-right: 2px, animation: blink |
| 축소 뷰 인지 | 텍스트 블록이 점진적으로 채워짐 | 가독성 아님, 움직임 인지 |

### 4-3. 버튼 stagger 등장 (AI_EXTRACT)

| 속성 | 값 | 설명 |
|------|---|------|
| 방식 | 카테고리별 순차 fade-in | top -> bottom |
| stagger | 0.15s | 카테고리 간 간격 |
| enter | opacity: 0, y: 12 -> opacity: 1, y: 0 | slide-up + fade-in |
| duration | 0.3s (개별) | 개별 버튼 전환 |

### 4-4. 버튼 적용 + 폼 채움 (AI_APPLY)

| 속성 | 값 | 설명 |
|------|---|------|
| 순서 | 상차지 -> 하차지 -> 화물 -> 운임 | 0.5s 간격 stagger |
| 버튼 전환 | bg: #3b82f6 -> #22c55e, 0.3s | color transition |
| 체크 아이콘 | scale: 0 -> 1, 0.2s | 팝 애니메이션 |
| 폼 필드 채움 | opacity: 0 -> 1, 0.3s + Card border glow 0.5s | fade-in + glow |
| glow | border-color: accent, shadow: accent/20 | 0.5s 후 해제 |

### 4-5. 금액 카운팅 (AI_APPLY / COMPLETE)

| 속성 | 값 | 설명 |
|------|---|------|
| 방식 | 0 -> 420,000 숫자 증가 | JS requestAnimationFrame |
| duration | 0.8s | REQ-DASH-009 (0.5~1초) |
| easing | easeOut | 처음 빠르게, 끝 느리게 |
| 포맷 | Intl.NumberFormat('ko-KR') | 420,000원 |

### 4-6. DashboardPreview 등장 (Hero 내)

| 속성 | 값 | 설명 |
|------|---|------|
| delay | 0.6s | REQ-DASH-031, 기존 placeholder 동일 |
| enter | opacity: 0, y: 20 -> opacity: 1, y: 0 | fade-in + slide-up |
| duration | 0.6s | |
| easing | easeOut | |

### 4-7. Phase 2 hover 하이라이트

| 속성 | 값 | 설명 |
|------|---|------|
| border | 2px solid var(--color-accent-start) | REQ-DASH-036 |
| border-radius | 4px | 축소 뷰 내 영역 구분 |
| transition | border-color 0.15s ease | 즉시 느낌 |
| 툴팁 등장 | opacity: 0 -> 1, 0.15s | fade-in |

---

## 5. 성능 예산 매핑

| 컴포넌트 | 예상 크기 (gzipped) | 비고 |
|---------|------------------|------|
| DashboardPreview (container) | ~2KB | 상태 머신 + 훅 |
| PreviewChrome | ~1KB | DOM 단순 |
| AiPanelPreview (전체) | ~4KB | textarea + 버튼 + 상태 |
| FormPreview (전체) | ~5KB | 5개 Card 블록 |
| StepIndicator | ~1KB | 5 dot |
| useAutoPlay hook | ~1.5KB | 타이머 로직 |
| mock-data.ts | ~2KB | JSON 데이터 |
| preview-steps.ts | ~1KB | Step 정의 |
| 애니메이션 (Framer Motion 기여) | ~8KB | 이미 번들에 포함 |
| InteractiveOverlay (Phase 2) | ~4KB | 오버레이 + 히트 영역 |
| **합계** | **~29.5KB** | 예산 30KB 이내 (REQ-DASH-030). 버퍼 0.5KB. 초과 시: lucide-react tree-shaking 검토, framer-motion 선택적 import 최적화, CSS-only 전환 대체 순으로 절감 |

---

## 6. 디자인 토큰 참조 (전 컴포넌트 공통)

| 용도 | 토큰/클래스 | 값 | 사용 컴포넌트 |
|------|----------|---|-------------|
| chrome 배경 | --color-card | oklch(0.15 0.01 260 / 0.5) | PreviewChrome |
| chrome border | border-gray-800 | #1f2937 | PreviewChrome |
| 축소 뷰 라벨 | text-gray-400 | #9ca3af | AiPanel, Form 라벨 |
| AI 버튼 - 대기 | bg-blue-500 | #3b82f6 | AiButtonItem |
| AI 버튼 - 적용됨 | bg-green-500 | #22c55e | AiButtonItem |
| AI 버튼 - 적용불가 | bg-gray-500 | #6b7280 | AiButtonItem |
| accent (glow/indicator) | --color-accent-start | #9333ea (purple-600) | StepDot, glow, Phase 2 border |
| accent end | --color-accent-end | #3b82f6 (blue-600) | gradient |
| 모서리 | rounded-2xl | 1rem | PreviewChrome 외곽 |
| 페이지 배경 | - | #0a0a0a | 다크 테마 기반 |
| 폰트 | Inter, Pretendard | system | 전체 |

---

## 7. 요구사항 -> 컴포넌트 추적 매트릭스

| REQ ID | 컴포넌트 | 설명 |
|--------|---------|------|
| REQ-DASH-001 | PreviewChrome, ChromeHeader | chrome 프레임, dots, 타이틀 |
| REQ-DASH-002 | ScaledContent (PreviewChrome 내부) | 축소 스케일 |
| REQ-DASH-003 | MainContentLayout | AiPanel + Form 2열 구조 |
| REQ-DASH-004 | AiPanelPreview | 좌측 사이드바 구조 |
| REQ-DASH-005 | AiInputAreaPreview, AiExtractButton | textarea + 추출하기 |
| REQ-DASH-006 | AiResultButtonsPreview, AiButtonItem | 4개 카테고리 버튼 |
| REQ-DASH-007 | FormPreview (전체) | 5개 Card 블록 |
| REQ-DASH-008 | AiButtonItem -> LocationPreview/CargoInfoPreview | 버튼 적용 -> 폼 채움 |
| REQ-DASH-009 | EstimatePreview | 금액 카운팅 |
| REQ-DASH-010 | DashboardPreview (useAutoPlay) | 5단계 시퀀스 |
| REQ-DASH-011 | useAutoPlay | Step별 duration |
| REQ-DASH-012 | useAutoPlay | 연속 루프 |
| REQ-DASH-013 | DashboardPreview (Framer Motion) | cross-fade 전환 |
| REQ-DASH-014 | StepIndicator, StepDot | 5 dot, accent 강조 |
| REQ-DASH-015 | StepIndicator (onStepClick) | 클릭 이동 |
| REQ-DASH-016 | useAutoPlay (pause/resume) | 클릭 후 5초 재개 |
| REQ-DASH-017 | DashboardPreview (onMouseEnter) | hover 일시정지 |
| REQ-DASH-018 | DashboardPreview (onMouseLeave) | 2초 후 재개 |
| REQ-DASH-019 | useAutoPlay (priority) | timeout 우선순위 |
| REQ-DASH-020 | mock-data.ts | 카카오톡 메시지 |
| REQ-DASH-021 | mock-data.ts | AI 추출 결과 |
| REQ-DASH-022 | mock-data.ts + FormPreview | 폼 필드 구조 |
| REQ-DASH-023 | DashboardPreview (Desktop 분기) | Desktop 전체 축소 뷰 |
| REQ-DASH-024 | DashboardPreview (Tablet 분기) | Tablet 축약 |
| REQ-DASH-025 | MobileCardView | Mobile 전용 카드 |
| REQ-DASH-026 | MobileCardView | Mobile 2단계 |
| REQ-DASH-027 | DashboardPreview (useReducedMotion) | reduced-motion 정적 |
| REQ-DASH-028 | DashboardPreview (aria-label) | 접근성 라벨 |
| REQ-DASH-029 | StepIndicator (keyboard) | 키보드 탐색 |
| REQ-DASH-030 | 전체 (번들 예산) | <30KB gzipped |
| REQ-DASH-031 | DashboardPreview (delay) | 0.6s 지연 등장 |
| REQ-DASH-032 | 전체 (CSS 우선) | CSS 애니메이션 우선 |
| REQ-DASH-033 | DashboardPreview (mode) | 시네마틱/인터랙티브 모드 |
| REQ-DASH-034 | DashboardPreview (onClick) | 내부 클릭 -> 인터랙티브 |
| REQ-DASH-035 | DashboardPreview (idle timer) | 10초 비활동 -> 복귀 |
| REQ-DASH-036 | InteractiveOverlay (hover) | accent border 2px |
| REQ-DASH-037 | InteractiveOverlay (HitArea) | 8~10개 히트 영역 |
| REQ-DASH-038 | Tooltip | 원본 크기 14px 설명 |
| REQ-DASH-039 | InteractiveOverlay (onClick) | mock 기능 실행 |
| REQ-DASH-040 | InteractiveOverlay (action map) | 영역별 클릭 동작 |
| REQ-DASH-041 | InteractiveOverlay (independence) | 비순서 클릭 허용 |
| REQ-DASH-042 | mock-data.ts (tooltips) | 툴팁 텍스트 관리 |
| REQ-DASH-043 | InteractiveOverlay (scale 역변환) | 투명 오버레이 좌표 매핑 |
| REQ-DASH-044 | HitArea (minSize) | 최소 44x44px |
| REQ-DASH-045 | DashboardPreview (Mobile) | Mobile 인터랙티브 미지원 |
