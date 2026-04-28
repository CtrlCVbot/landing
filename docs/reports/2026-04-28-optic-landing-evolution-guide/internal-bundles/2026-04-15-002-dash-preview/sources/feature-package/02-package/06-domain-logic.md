# 상태 머신 + 애니메이션 로직: dash-preview

> **Feature**: Dashboard Preview (Hero Interactive Demo)
> **PRD**: `.plans/prd/10-approved/dashboard-preview-prd.md`
> **Created**: 2026-04-14

---

## 1. useAutoPlay 훅 상세 설계

### 1-1. 인터페이스

```typescript
interface UseAutoPlayOptions {
  steps: PreviewStep[]
  initialStep?: number
  enabled?: boolean  // false = reduced-motion
}

interface UseAutoPlayReturn {
  currentStep: number
  isPlaying: boolean
  pause: (source: 'hover' | 'click') => void
  resume: () => void
  goToStep: (index: number) => void
}
```

### 1-2. 타이머 로직

```
마운트 → delay 0.6s → 자동 재생 시작
  │
  ├── 현재 step의 duration 경과 → 다음 step으로 전환
  │   └── step === 4 (COMPLETE) → step = 0 (INITIAL) 루프
  │
  ├── pause('hover') 호출 → 타이머 정지
  │   └── resume() → 2초 지연 후 타이머 재개
  │
  └── pause('click') 호출 → 타이머 정지
      └── resume() → 5초 지연 후 타이머 재개
```

### 1-3. Timeout 우선순위 규칙 (REQ-DASH-019)

```typescript
// pause 호출 시 source 기록
const lastPauseSource = useRef<'hover' | 'click'>('hover')

function pause(source: 'hover' | 'click') {
  // click이 hover보다 우선
  if (source === 'click' || lastPauseSource.current !== 'click') {
    lastPauseSource.current = source
  }
  clearTimer()
  setIsPlaying(false)
}

function resume() {
  const delay = lastPauseSource.current === 'click' ? 5000 : 2000
  resumeTimer = setTimeout(() => {
    lastPauseSource.current = 'hover'  // resume 후 source 초기화
    setIsPlaying(true)
    startTimer()
  }, delay)
}
// 규칙: resume 후 lastPauseSource를 'hover'(기본)로 리셋.
// 리셋하지 않으면 한 번의 click pause가 이후 모든 hover pause를 5초로 고정하는 버그 발생.
```

핵심: `click`(5s)과 `hover`(2s)가 동시 발생 시, `lastPauseSource`가 `click`이면 5초 적용.

---

## 2. PreviewStep 인터페이스

```typescript
interface PreviewStep {
  id: 'INITIAL' | 'AI_INPUT' | 'AI_EXTRACT' | 'AI_APPLY' | 'COMPLETE'
  label: string           // "빈 폼", "AI 입력", "AI 분석", "자동 적용", "완료"
  duration: number        // ms (3000, 4000, 4000, 4000, 3000)
  aiPanelState: AiPanelState
  formState: FormState
}
```

### 5단계 정의

> **Step 번호 규칙**: 문서에서는 Step 1~5(PRD 기준 1-based), 코드 구현은 index 0~4. Step ID로 참조하면 모호성 없음.

| Step (PRD) | Index (코드) | ID | Label | Duration | 핵심 변화 |
|------------|-------------|-----|-------|----------|----------|
| Step 1 | 0 | INITIAL | 빈 폼 | 3000ms | 빈 textarea, 비활성 버튼, 빈 폼 Card |
| Step 2 | 1 | AI_INPUT | AI 입력 | 4000ms | 카톡 메시지 타이핑, 추출하기 활성화 |
| Step 3 | 2 | AI_EXTRACT | AI 분석 | 4000ms | 로딩 스피너 → 4카테고리 버튼(파랑) 생성 |
| Step 4 | 3 | AI_APPLY | 자동 적용 | 4000ms | 버튼 순차 초록 전환 + 폼 필드 채움 |
| Step 5 | 4 | COMPLETE | 완료 | 3000ms | 전체 적용됨, 금액 표시, settled |

---

## 3. 상태 인터페이스

### 3-1. AiPanelState

```typescript
interface AiPanelState {
  inputText: string
  // 현재까지 타이핑된 텍스트 (INITIAL: "", AI_INPUT: 점진 증가, AI_EXTRACT~: 전체)
  
  extractState: 'idle' | 'loading' | 'resultReady'
  // INITIAL/AI_INPUT: idle, AI_EXTRACT 초반: loading, AI_EXTRACT 후반~: resultReady
  
  buttons: Array<{
    id: 'departure' | 'destination' | 'cargo' | 'fare'
    status: 'pending' | 'applied'
    // AI_EXTRACT: 전부 pending, AI_APPLY: 순차 applied, COMPLETE: 전부 applied
  }>
}
```

### 3-2. FormState

```typescript
interface FormState {
  filledCards: string[]
  // AI_APPLY에서 순차 추가: ['location-departure', 'location-destination', 'cargoInfo', 'estimate']
  
  highlightedCard: string | null
  // AI_APPLY 중 현재 채워지는 Card에 glow 효과. COMPLETE에서 null
  
  estimateAmount: number | null
  // AI_APPLY 운임 적용 시: 420000. 이전: null
}
```

---

## 4. 애니메이션 타이밍 상세

### 4-1. Step 전환 (cross-fade)

```
duration: 400ms
easing: easeOut
properties:
  - 나가는 step: opacity 1→0, y 0→-8
  - 들어오는 step: opacity 0→1, y 8→0
trigger: currentStep 변경 시 AnimatePresence
```

### 4-2. 카톡 메시지 타이핑 (AI_INPUT)

```
방식: 글자 단위 순차 표시
속도: ~50ms/글자 (4초 동안 약 80자)
cursor: blinking cursor 효과 (500ms interval)
완료: 전체 메시지 표시 후 cursor 숨김
```

### 4-3. 추출하기 버튼 클릭 + 로딩 (AI_EXTRACT)

```
0~0.5초: 버튼 pressed 효과 (scale 0.95)
0.5~3초: Loader2 아이콘 spin (1s linear infinite) + "분석 중..."
3~4초: 4카테고리 버튼 stagger 등장
  - stagger: 150ms 간격
  - 각 버튼: fade-in + slide-down, 300ms
  - 초기 상태: pending (파랑)
```

### 4-4. 버튼 적용 + 폼 채움 (AI_APPLY)

```
순서: departure → destination → cargo → fare (0.5초 간격 stagger)
각 버튼:
  - 색상 전환: blue-500 → green-500, 300ms
  - 아이콘: Clock → Check, fade 200ms
폼 연동:
  - 버튼 전환과 동시에 대응 Card에 glow 효과 (accent border)
  - 값 fade-in: opacity 0→1, 300ms
  - glow 해제: 값 표시 후 500ms
```

### 4-5. 금액 카운팅 (AI_APPLY 운임 적용 시)

```
시작: 0
종료: 420,000
duration: 800ms
easing: easeOut
format: toLocaleString('ko-KR') + '원'
```

### 4-6. DashboardPreview 등장 (마운트)

```
delay: 600ms (heading/CTA 이후)
duration: 600ms
easing: easeOut
properties: opacity 0→1, y 24→0 (기존 fadeInUp 변형)
```

---

## 5. Phase 2 모드 전환 로직

### 5-1. 모드 상태

```typescript
type PreviewMode = 'cinematic' | 'interactive' | 'static'

// static = prefers-reduced-motion (Step 4 COMPLETE 정적 표시)
```

### 5-2. 전환 규칙

```
[cinematic] ──(축소 뷰 내부 클릭)──> [interactive]
     ^                                      |
     |                                      |
     +────────(10초 비활동)────────────────+

Step Indicator 클릭: cinematic 모드에서만 동작 (step 이동)
축소 뷰 내부 클릭: interactive 모드 진입 트리거
```

### 5-3. 비활동 감지

```typescript
const INACTIVITY_TIMEOUT = 10000 // 10초

// interactive 모드에서:
// - hover 또는 click 이벤트 → 타이머 리셋
// - 10초 무이벤트 → cinematic 모드 복귀
```

---

## 6. Phase 2 히트 영역 매핑

### 6-1. Scale 역변환

```typescript
function getOriginalCoords(clickX: number, clickY: number, scaleFactor: number): Point {
  return {
    x: clickX / scaleFactor,
    y: clickY / scaleFactor
  }
}
```

### 6-2. 히트 영역 정의

```typescript
interface HitArea {
  id: string
  bounds: { x: number; y: number; width: number; height: number }  // 원본 좌표
  tooltip: string
  onClick: () => void
  isEnabled: (state: PreviewState) => boolean  // 논리적 의존
}
```

### 6-3. 논리적 의존 규칙

| 영역 | 선행 조건 |
|------|----------|
| AiInputArea | 항상 활성 |
| 추출하기 버튼 | AiInputArea에 텍스트가 있을 때 |
| AI 결과 버튼 (4개) | 추출하기 실행 후 |
| CargoInfoForm | 항상 활성 (표시 전용) |
| LocationForm x2 | 항상 활성 (표시 전용) |
| TransportOptionCard | 항상 활성 |
| EstimateInfoCard | 항상 활성 (표시 전용) |

---

## 7. Mobile 상태 머신

```
모바일(<768px)에서는 축소 뷰 대신 전용 카드 뷰:

Step A (AI_EXTRACT 카드) ──(4s)──> Step B (COMPLETE 카드) ──(4s)──> Step A (루프)

cross-fade: 300ms (Desktop 400ms보다 짧음 — 모바일 카드 단순)
인터랙티브 모드: 비활성화 (REQ-DASH-045)
```

---

## 8. Phase 2 상태 관리 인터페이스 (상세 설계)

> W-03 해결: Phase 2 전용 상태 인터페이스와 관리 훅의 구조 정의.

### 8-1. InteractiveState 타입

```typescript
interface InteractiveState {
  mode: PreviewMode                              // 'cinematic' | 'interactive' | 'static'
  hoveredAreaId: string | null                   // 현재 hover/focus 중인 히트 영역 ID
  focusedAreaId: string | null                   // 키보드 포커스 영역 (hover와 별도 추적)
  executedAreaIds: ReadonlySet<string>           // 클릭/Enter로 실행된 영역 기록 (mock 기능 상태 유지용)
  inactivityTimer: number | null                 // setTimeout ID (10초 비활동 복귀용)
}

type InteractiveAction =
  | { type: 'ENTER_INTERACTIVE' }                // 축소 뷰 내부 클릭/Enter → 모드 진입
  | { type: 'EXIT_INTERACTIVE' }                 // Escape 키 또는 10초 비활동 → cinematic 복귀
  | { type: 'HOVER_AREA'; id: string }           // 마우스 hover 진입
  | { type: 'LEAVE_AREA' }                       // 마우스 hover 해제
  | { type: 'FOCUS_AREA'; id: string }           // Tab/Arrow 키 포커스
  | { type: 'BLUR_AREA' }                        // 포커스 해제
  | { type: 'EXECUTE_AREA'; id: string }         // 클릭/Enter → mock 기능 실행 + executedAreaIds 추가
  | { type: 'RESET_EXECUTED' }                   // 모드 종료 시 선택적 초기화
```

### 8-2. useInteractiveMode 훅

```typescript
interface UseInteractiveModeOptions {
  readonly enabled: boolean                      // Mobile에서 false (REQ-DASH-045)
  readonly onModeChange?: (mode: PreviewMode) => void  // 모드 전환 부수 효과용
}

interface UseInteractiveModeReturn {
  state: InteractiveState
  enterInteractive: () => void                   // 축소 뷰 내부 클릭 시
  exitInteractive: () => void                    // Escape 또는 외부 트리거
  hoverArea: (id: string) => void
  leaveArea: () => void
  focusArea: (id: string) => void
  blurArea: () => void
  executeArea: (id: string) => void              // mock 기능 실행 트리거
}

// 내부 로직:
// 1. useReducer로 InteractiveState 관리
// 2. inactivity 타이머: executeArea/hoverArea/focusArea 이벤트마다 리셋
// 3. 10초 경과 → EXIT_INTERACTIVE 액션 자동 디스패치
// 4. enabled=false면 모든 액션 no-op (Mobile 대응)
```

### 8-3. 모드 전환 조건 (확장)

```
[cinematic] ──(축소 뷰 내부 클릭 OR Enter on HitArea)──> [interactive]
     ^                                                          │
     │                                                          │
     ├────────────(10초 비활동 타이머 만료)───────────────────┤
     │                                                          │
     └────────────(Escape 키)──────────────────────────────────┘

[static]  // prefers-reduced-motion 시 고정, 모드 전환 불가
```

### 8-4. 이벤트-액션 매핑

| 이벤트 소스 | 이벤트 | Action | 조건 |
|------------|--------|--------|------|
| 축소 뷰 내부 | click | ENTER_INTERACTIVE | mode=cinematic |
| InteractiveOverlay | mouseenter(HitArea) | HOVER_AREA | mode=interactive |
| InteractiveOverlay | mouseleave(HitArea) | LEAVE_AREA | mode=interactive |
| HitArea 버튼 | focus (Tab) | FOCUS_AREA | mode=interactive |
| HitArea 버튼 | blur | BLUR_AREA | mode=interactive |
| HitArea 버튼 | click / Enter / Space | EXECUTE_AREA | mode=interactive + isEnabled(state) |
| 전역 | keydown Escape | EXIT_INTERACTIVE | mode=interactive |
| 타이머 | 10초 만료 | EXIT_INTERACTIVE | mode=interactive |

### 8-5. DashboardPreview 통합 구조

```tsx
export function DashboardPreview() {
  const { currentStep, pause, resume, goToStep } = useAutoPlay({...})
  const interactive = useInteractiveMode({ enabled: !isMobile })

  // 인터랙티브 모드 진입 시 useAutoPlay 일시정지
  useEffect(() => {
    if (interactive.state.mode === 'interactive') pause('click')
    else if (interactive.state.mode === 'cinematic') resume()
  }, [interactive.state.mode, pause, resume])

  return (
    <div
      onClick={(e) => {
        // chrome 내부 클릭 감지 (Step Indicator 제외)
        if (e.target !== stepIndicatorRef.current) interactive.enterInteractive()
      }}
    >
      <PreviewChrome>...</PreviewChrome>
      {interactive.state.mode === 'interactive' && (
        <InteractiveOverlay
          hitAreas={getHitAreas(viewport)}
          state={interactive.state}
          onHover={interactive.hoverArea}
          onFocus={interactive.focusArea}
          onExecute={interactive.executeArea}
        />
      )}
      <StepIndicator ... />
    </div>
  )
}
```

### 8-6. 파일 구조 (Phase 2 추가)

```
components/dashboard-preview/
  interactive-overlay.tsx        # Phase 2: 오버레이 + HitArea 렌더링
  use-interactive-mode.ts        # Phase 2: 상태 + 모드 전환 훅
  hit-areas.ts                   # Phase 2: viewport별 HitArea 정의 (Desktop 11개, Tablet 6개)
```

---

## 9. Phase 2 히트 영역 매핑 (반응형 확장)

> W-02 해결: Tablet 히트 영역 세부 명세.

### 9-1. Viewport별 히트 영역 목록

| # | Area ID | Desktop (11개) | Tablet (6개) | 논리적 선행 조건 |
|---|---------|----------------|--------------|----------------|
| 1 | `ai-input` | ✅ | ✅ | 항상 활성 |
| 2 | `extract-button` | ✅ | ✅ | AiInputArea에 텍스트 있음 |
| 3 | `result-departure` | ✅ | ✅ | 추출 완료 |
| 4 | `result-destination` | ✅ | ✅ | 추출 완료 |
| 5 | `result-cargo` | ✅ | ✅ | 추출 완료 |
| 6 | `result-fare` | ✅ | ✅ | 추출 완료 |
| 7 | `form-cargo-info` | ✅ | ❌ | 항상 활성 (표시 전용) |
| 8 | `form-location-departure` | ✅ | ❌ | 항상 활성 (표시 전용) |
| 9 | `form-location-destination` | ✅ | ❌ | 항상 활성 (표시 전용) |
| 10 | `form-transport-options` | ✅ | ❌ | 항상 활성 |
| 11 | `form-estimate` | ✅ | ❌ | 항상 활성 (표시 전용) |

### 9-2. hit-areas.ts 구조

```typescript
interface HitAreaConfig {
  readonly id: string
  readonly bounds: { x: number; y: number; width: number; height: number }
  readonly tooltipKey: keyof PreviewMockData['tooltips']
  readonly isEnabled: (state: PreviewState) => boolean
  readonly onExecute: (dispatch: PreviewDispatch) => void
}

export const DESKTOP_HIT_AREAS: ReadonlyArray<HitAreaConfig> = [/* 11개 */]
export const TABLET_HIT_AREAS: ReadonlyArray<HitAreaConfig> = [/* 6개 (DESKTOP의 1~6) */]

export function getHitAreas(viewport: 'desktop' | 'tablet'): ReadonlyArray<HitAreaConfig> {
  return viewport === 'tablet' ? TABLET_HIT_AREAS : DESKTOP_HIT_AREAS
}
```

### 9-3. 최소 히트 영역 크기 (scaleFactor별)

| Viewport | scaleFactor | 최소 원본 크기 | 최소 축소 후 크기 |
|----------|-------------|---------------|-----------------|
| Desktop | 0.45 | 44x44px | 20x20px |
| Tablet | 0.38 | 44x44px | 16x16px |

---

## 10. Phase 2 키보드 접근성 (상세)

> W-03 해결: HitArea 키보드 접근성 명세.

### 10-1. HitArea DOM 구조

```tsx
<button
  role="button"
  tabIndex={isInteractiveMode ? 0 : -1}
  aria-label={tooltip}
  aria-pressed={isExecuted}
  data-area-id={id}
  onFocus={() => onFocus(id)}
  onBlur={() => onBlur()}
  onClick={() => onExecute(id)}
  onKeyDown={handleKeyDown}
  style={{ position: 'absolute', ...scaledBounds }}
>
  {/* 시각적으로 투명 — hover/focus 시에만 border/tooltip 표시 */}
</button>
```

### 10-2. 키보드 이벤트 매핑

| 키 | 동작 | 조건 |
|----|------|------|
| Tab | 다음 히트 영역으로 포커스 이동 | mode=interactive, HitArea 순서: 1→11 (Desktop) / 1→6 (Tablet) |
| Shift+Tab | 이전 히트 영역 | 동일 |
| Enter | 포커스된 영역의 mock 기능 실행 | mode=interactive, isEnabled(state)=true |
| Space | 포커스된 영역의 mock 기능 실행 | 동일 |
| Escape | 인터랙티브 모드 종료 → cinematic 복귀 | mode=interactive |
| ArrowLeft/Right | StepIndicator step 이동 (인터랙티브 모드 유지) | mode=interactive, focus가 StepIndicator에 있을 때만 |

### 10-3. 포커스 시각 피드백

- hover와 동일한 accent border + tooltip 표시
- `:focus-visible` 셀렉터로 키보드 포커스만 감지 (마우스 클릭 후 포커스는 hover가 담당)
- focus ring: `outline-none ring-2 ring-purple-500/50 ring-offset-0`

### 10-4. 스크린 리더 지원

- InteractiveOverlay 컨테이너: `role="region"` + `aria-label="AI 화물 등록 데모 체험 영역"`
- 각 HitArea의 `aria-label`: 툴팁 텍스트와 동일 (mock-data.ts tooltips에서 참조)
- mode 전환 시 `aria-live="polite"` 영역에 안내 메시지:
  - "데모 체험 모드를 시작했습니다"
  - "데모 체험 모드를 종료했습니다"
