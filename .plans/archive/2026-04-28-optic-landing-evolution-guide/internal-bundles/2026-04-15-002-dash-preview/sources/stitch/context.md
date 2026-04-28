# 개발 핸드오프 컨텍스트: Dashboard Preview

> **Feature Slug**: `dash-preview`
> **생성일**: 2026-04-14
> **PRD 상태**: Approved
> **참조 PRD**: `.plans/prd/10-approved/dashboard-preview-prd.md`
> **참조 Wireframe**: `.plans/wireframes/dash-preview/`

---

## 1. Feature 개요

| 항목 | 값 |
|------|---|
| Slug | `dash-preview` |
| 범위 | `apps/landing/` Hero 영역 placeholder 교체 |
| 목적 | Hero의 회색 placeholder를 AI 화물 등록 시네마틱 데모로 교체 |
| 참조 UI | `.references/code/mm-broker/app/broker/order/ai-register/page.tsx` main 영역 |
| 기술 스택 | Next.js 15, React 18, Framer Motion ^11.15.0, Tailwind CSS v4, 정적 빌드 |
| 빌드 제약 | `output: 'export'` 정적 빌드 호환, 서버 사이드 데이터 없음 |
| 번들 예산 | 30KB gzipped 이하 (Phase 1 + Phase 2 합산) |

---

## 2. 구현 범위

### Phase 1 — 시네마틱 뷰 (MVP)

자동 재생 5단계 루프. 사용자 개입 없이 AI 화물 등록 과정이 영상처럼 재생됨.

| Milestone | 기간 | 산출물 |
|-----------|------|--------|
| 1-1 Foundation | 2~3일 | 파일 구조, PreviewChrome, ScaledContent, mock-data.ts, preview-steps.ts |
| 1-2 Core UI | 3~4일 | AiPanelPreview, FormPreview, 축소 뷰 스타일링 |
| 1-3 Animations | 2~3일 | useAutoPlay 훅, 5단계 전환, 타이핑 효과, 버튼→필드 연결 |
| 1-4 Step Indicator | 1~2일 | StepIndicator, click/hover 인터랙션 |
| 1-5 Responsive | 2~3일 | Desktop/Tablet/Mobile 분기 |
| 1-6 Polish | 1~2일 | 접근성, 성능, 크로스 브라우저 |

### Phase 2 — 인터랙티브 탐색 (Phase 1 완료 후 착수)

축소 뷰 위에 투명 오버레이 레이어 추가. 사용자가 컴포넌트를 hover/클릭하여 AI 등록 과정을 직접 체험.

| Milestone | 기간 | 산출물 |
|-----------|------|--------|
| 2-1 Hit Area Layer | 2~3일 | 투명 오버레이, 히트 영역 11개, scale 역변환 좌표 |
| 2-2 Highlight & Tooltip | 2~3일 | hover 아웃라인, 툴팁 컴포넌트 |
| 2-3 Click Interactions | 3~4일 | 영역별 mock 기능 실행 |
| 2-4 Mode Switch | 1~2일 | 시네마틱↔인터랙티브 모드 전환, 10초 비활동 복귀 |
| 2-5 Polish | 1~2일 | 비순서 클릭 처리, Tablet 히트 영역 조정 |

---

## 3. 파일 구조

```
apps/landing/src/
  components/
    dashboard-preview/
      dashboard-preview.tsx       # Container: 상태 머신 + useAutoPlay + 모드 전환
      preview-chrome.tsx          # 브라우저 프레임: ChromeHeader + ScaledContent
      ai-panel-preview.tsx        # AiPanel 축소 뷰: AiTabBar + AiInputArea + AiResultButtons
      form-preview.tsx            # OrderRegisterForm 축소 뷰: 5개 Card 블록
      step-indicator.tsx          # 하단 5-dot 네비게이션 (Phase 1)
      mobile-card-view.tsx        # Mobile 전용 2단계 카드 뷰
      interactive-overlay.tsx     # Phase 2: 투명 오버레이 + 히트 영역 + 툴팁
      use-auto-play.ts            # 자동 재생 훅 (timeout 우선순위 관리)
  lib/
    mock-data.ts                  # AI 입력/추출 결과/폼 데이터/툴팁 텍스트
    preview-steps.ts              # PreviewStep[] 상수: id, label, duration, aiPanelState, formState
```

**변경 대상 기존 파일:**

| 파일 | 변경 유형 | 내용 |
|------|---------|------|
| `hero.tsx` | 수정 | placeholder div → `<DashboardPreview />` 교체. 레이아웃 구조 변경 없음 |
| `motion.ts` | 추가 가능 | Preview 전용 Variants 추가(stepTransition). 기존 변형 수정 없음 |
| `constants.ts` | 변경 없음 | mock data는 별도 mock-data.ts 분리 |
| `globals.css` | 변경 없음 | 기존 디자인 토큰 그대로 사용 |

---

## 4. 컴포넌트 트리

```
DashboardPreview                     # dashboard-preview.tsx
  ├── PreviewChrome                  # preview-chrome.tsx (Desktop/Tablet)
  │   ├── ChromeHeader               # "● ● ●  OPTIC Broker" 바
  │   └── ScaledContent              # transform: scale(0.45/0.38)
  │       └── MainContentLayout      # flex-row: AiPanel(~30%) + Form(~70%)
  │           ├── AiPanelPreview     # ai-panel-preview.tsx
  │           │   ├── AiTabBar       # [텍스트][이미지] 탭, 텍스트 고정 활성
  │           │   ├── AiInputAreaPreview  # textarea: empty→typing→filled
  │           │   ├── AiExtractButton     # disabled→active→pressed→loading→disabled
  │           │   └── AiResultButtonsPreview  # 4 카테고리 그룹
  │           │       └── AiCategoryGroup x4   # departure/destination/cargo/fare
  │           │           └── AiButtonItem x N  # pending(blue)→applied(green)
  │           └── FormPreview        # form-preview.tsx
  │               ├── CargoInfoPreview      # 차량타입/중량/화물명 Card
  │               ├── LocationPreview (상차지)  # 주소/담당자/연락처/일시 Card
  │               ├── LocationPreview (하차지)  # 동일 구조
  │               ├── TransportOptionsPreview  # 직송/지게차/왕복/긴급 토글
  │               └── EstimatePreview          # 거리/운임 Card, 금액 카운팅
  ├── StepIndicator                  # step-indicator.tsx (Desktop/Tablet)
  │   └── StepDot x5                 # inactive/active/hover/focus 상태
  ├── MobileCardView                 # mobile-card-view.tsx (Mobile <768px)
  │   └── MobileDotIndicator         # 2-dot
  └── InteractiveOverlay             # interactive-overlay.tsx (Phase 2)
      ├── HitArea x11                # 투명 클릭 영역, scale 역변환 좌표
      └── Tooltip                    # 원본 크기(14px) 설명 툴팁
```

**참조 원본 컴포넌트 매핑:**

| Preview 컴포넌트 | 참조 원본 파일 | 재현 수준 |
|-----------------|-------------|----------|
| AiPanelPreview | `ai-panel.tsx` (확장 상태) | 구조 + 색상 |
| AiInputAreaPreview | `ai-input-area.tsx` (텍스트 탭) | textarea + 버튼 |
| AiResultButtonsPreview | `ai-result-buttons.tsx` + `ai-button-item.tsx` | 4 카테고리 + 상태 색상 |
| FormPreview | `register-form.tsx` | Card 블록 구조 |
| CargoInfoPreview | CargoInfoForm | 필드 라벨 + 값 |
| LocationPreview | LocationForm x2 | 주소 + 연락처 |
| EstimatePreview | EstimateInfoCard | 금액 표시 |

---

## 5. 상태 관리

### 상태 구조 (DashboardPreview 로컬 상태)

```typescript
// DashboardPreview 내부 상태
currentStep: number          // 0~4 (INITIAL~COMPLETE)
mode: 'cinematic' | 'interactive' | 'static'  // static = reduced-motion
isPlaying: boolean           // 자동 재생 여부
```

**Zustand 불필요** — 순수 로컬 컴포넌트 상태로 완결.

### useAutoPlay 훅

```typescript
interface UseAutoPlayReturn {
  isPlaying: boolean
  pause(source: 'hover' | 'click'): void   // source 기록으로 timeout 결정
  resume(): void                           // source에 따라 2s(hover) / 5s(click)
}
```

**Timeout 우선순위**: `click` (5초) > `hover` (2초). 동시 발생 시 5초 적용.

### Step 정의 (preview-steps.ts)

```typescript
interface PreviewStep {
  id: 'INITIAL' | 'AI_INPUT' | 'AI_EXTRACT' | 'AI_APPLY' | 'COMPLETE'
  label: string
  duration: number   // ms: 3000, 4000, 4000, 4000, 3000
  aiPanelState: AiPanelState
  formState: FormState
}
```

| Step Index | ID | 레이블 | Duration |
|-----------|-----|-------|----------|
| 0 | INITIAL | 빈 폼 | 3000ms |
| 1 | AI_INPUT | AI 입력 | 4000ms |
| 2 | AI_EXTRACT | AI 분석 | 4000ms |
| 3 | AI_APPLY | 자동 적용 | 4000ms |
| 4 | COMPLETE | 완료 | 3000ms |

**전체 루프**: 18초 (PRD 허용 범위: 16~22초)

### Mock Data 인터페이스 (mock-data.ts)

```typescript
interface PreviewMockData {
  aiInput: {
    message: string   // "서울 강남구 물류센터에서 대전 유성구 산업단지로..."
  }
  aiResult: {
    categories: Array<{
      id: 'departure' | 'destination' | 'cargo' | 'fare'
      label: string          // "상차지" | "하차지" | "화물/차량" | "운임"
      icon: string           // "MapPin" | "Flag" | "Package" | "Banknote"
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
    options: string[]              // ["direct", "forklift"]
    estimate: { distance: number; amount: number }  // 140, 420000
  }
  tooltips: Record<string, string>  // Phase 2 히트 영역 ID → 툴팁 텍스트
}
```

---

## 6. 애니메이션 명세

### 6-1. 단계 전환

| 속성 | 값 |
|------|---|
| 방식 | Framer Motion cross-fade |
| opacity | 0 → 1 (진입), 1 → 0 (퇴장) |
| y | +8px → 0 (진입), 0 → -8px (퇴장) |
| easing | easeOut |
| Desktop 전환 시간 | 0.4s |
| Mobile 전환 시간 | 0.3s (단순 카드, 빠른 전환) |

### 6-2. Step 2: 타이핑 효과

| 속성 | 값 |
|------|---|
| 방식 | 글자 단위 순차 등장 |
| 총 소요 시간 | 4초 (AI_INPUT step 전체) |
| 커서 | 깜빡임 효과 (CSS blink animation) |
| 목적 | 축소 뷰에서 "텍스트가 채워지는 움직임"으로 인지 |

### 6-3. Step 3: AI 버튼 stagger 등장

| 속성 | 값 |
|------|---|
| 방식 | fade-in + slide-down |
| stagger 간격 | 카테고리당 0.15s |
| 버튼 초기 상태 | pending (blue-500, #3b82f6) |

### 6-4. Step 4: 버튼 → 폼 필드 연결

| 단계 | AI 버튼 전환 | 폼 필드 동작 | stagger 간격 |
|------|------------|------------|------------|
| 1 | 상차지 blue→green (체크 아이콘) | LocationForm 상차지 값 fade-in + Card glow | 0s |
| 2 | 하차지 blue→green | LocationForm 하차지 값 fade-in | 0.5s |
| 3 | 화물/차량 blue→green | CargoInfoForm 값 fade-in | 1.0s |
| 4 | 운임 blue→green | EstimateInfoCard 금액 카운팅 시작 | 1.5s |

- 버튼 색상 전환: 0.3s transition
- Card glow: `accent border + box-shadow`, 값 채워진 후 fade-out

### 6-5. 운임 금액 카운팅

| 속성 | 값 |
|------|---|
| 방식 | JS 애니메이션 (CSS 예외 허용 항목) |
| 시작값 | 0원 |
| 종료값 | 420,000원 |
| 소요 시간 | 0.5~1초 |
| easing | easeOut |

### 6-6. Phase 1 초기 등장

| 속성 | 값 |
|------|---|
| delay | 0.6초 (heading/CTA 이후 등장, LCP 미영향) |
| 방식 | opacity 0 → 1 (fade-in) |

---

## 7. 반응형 전략

| 뷰포트 | 범위 | Chrome | 내용 | 자동 재생 | Phase 2 | scaleFactor |
|--------|------|--------|------|----------|---------|-------------|
| Desktop | >=1024px | 있음(full) | AiPanel(30%) + Form(70%) 전체 | 5단계 루프 | 전체 히트 영역(11개) | 0.45 |
| Tablet | 768~1023px | 있음(축약) | AiPanel + 핵심 Form 3개 Card | 5단계 루프 | 축약 히트 영역 | 0.38 |
| Mobile | <768px | 없음 | 전용 2단계 카드 뷰 | 2단계 전환 | 미지원 | - |

### Tablet 축약 사항

| 항목 | Desktop | Tablet |
|------|---------|--------|
| FormPanel | 5개 Card | CargoInfo + Location 상차지(축약형) + Estimate 3개 |
| LocationForm 하차지 | 전체 표시 | 축약형으로 유지 (주소 1줄, 대응물 보존) |
| TransportOption | 전체 | 축약 또는 생략 |

> 구현 결정: Tablet에서도 AI_APPLY 4카테고리 적용 흐름 시각 완성을 위해 하차지 Card를 축약형으로 유지 권장 (screens.md SCR-004 "대응 A" 권장안).

### Mobile 전용 사항

- chrome 프레임 없음 (`MobileCardView`만 렌더링)
- Step A (AI_EXTRACT): "AI가 분석한 결과" 카드 — 상차지/하차지/화물/운임 4개 항목
- Step B (COMPLETE): "AI가 완성한 화물등록" 카드 — 주소/일시/화물/옵션/금액 전체
- 텍스트 크기: 14~16px (가독성 유지, 축소 안 함)
- Step Indicator: 2-dot (5-dot 아님)
- 전환 시간: 0.3s cross-fade, 각 카드 4초 유지

---

## 8. 디자인 토큰

| 용도 | 토큰 / 값 | Tailwind 클래스 |
|------|----------|---------------|
| chrome 배경 | `oklch(0.15 0.01 260 / 0.5)` | `bg-gray-900/50` (`--color-card`) |
| chrome border | `#1f2937` | `border-gray-800` (`--color-border`) |
| chrome 모서리 | - | `rounded-2xl` |
| window dot - red | `#ef4444` | - |
| window dot - yellow | `#eab308` | - |
| window dot - green | `#22c55e` | - |
| 축소 뷰 내 라벨 | `#9ca3af` | `text-gray-400` (`--color-muted-foreground`) |
| AI 버튼 대기 | `#3b82f6` | `bg-blue-500` |
| AI 버튼 적용됨 | `#22c55e` | `bg-green-500` |
| AI 버튼 적용불가 | `#6b7280` | `bg-gray-500` |
| accent glow | `--color-accent-start` | `#9333ea` (purple-600) |
| 금액 강조 | `--color-accent-end` | `#3b82f6` (blue-600) |
| 툴팁 배경 | `bg-gray-900/90` | - |
| 툴팁 텍스트 | `text-white` | font-size: 14px |

---

## 9. Hero 통합 (hero.tsx 수정)

### 수정 방법

```tsx
// 변경 전 (hero.tsx:62-64)
<div className="rounded-2xl border border-gray-800 bg-gray-900/50 aspect-video flex items-center justify-center">
  <span className="text-gray-500 text-lg">Dashboard Preview</span>
</div>

// 변경 후
<DashboardPreview />
```

### 수정 원칙

- placeholder div만 `<DashboardPreview />` 컴포넌트로 교체
- **레이아웃 구조 변경 없음**: h1, p, CTA 버튼, gradient-blob 등 기존 요소 일체 변경하지 않음
- `aspect-video` 비율 유지 (DashboardPreview 내부에서 동일 비율 적용)
- DashboardPreview는 `rounded-2xl border-gray-800` 외곽 스타일을 자체 포함

---

## 10. 성능 제약

| 항목 | 제약 | 구현 전략 |
|------|------|----------|
| JS 번들 | <30KB gzipped | `optimizePackageImports: ['lucide-react', 'framer-motion']`, 선택적 import |
| LCP | +100ms 미만 | delay 0.6s 지연 등장 (heading/CTA 이후) |
| 애니메이션 | CSS 우선 | transform, opacity, background-color CSS 전환 우선. JS는 금액 카운팅만 |
| Mobile | 조건부 렌더링 | Mobile에서 축소 뷰 비렌더링, MobileCardView만 렌더링 |
| 새 npm 패키지 | 없음 | framer-motion, lucide-react, clsx, tailwind-merge 기존 의존성만 사용 |

---

## 11. 접근성

| 항목 | 구현 | REQ |
|------|------|-----|
| prefers-reduced-motion | 감지 시 자동 재생 비활성화, Step 5(COMPLETE) 정적 표시 | REQ-DASH-027 |
| aria-label | `aria-label="AI 화물 등록 워크플로우 데모 미리보기"` (DashboardPreview 컨테이너) | REQ-DASH-028 |
| 키보드 탐색 | StepIndicator: Tab 진입, Arrow Left/Right 이동, Enter/Space 활성화 | REQ-DASH-029 |
| StepDot role | `role="tablist"` (StepIndicator), `role="tab"` (StepDot) | REQ-DASH-029 |
| aria-selected | 활성 dot만 true, 나머지 false | REQ-DASH-029 |
| 포커스 표시 | StepDot 포커스 시 2px accent outline | REQ-DASH-029 |

---

## 12. Phase 2 히트 영역 목록

| # | ID | 위치 | 툴팁 텍스트 | 클릭 동작 |
|---|----|------|------------|----------|
| 1 | AiInputArea | AiPanel 상단 textarea | "카카오톡 메시지를 붙여넣으면 AI가 자동으로 분석합니다" | 카톡 메시지 타이핑 효과 (2초) |
| 2 | ExtractButton | "추출하기" 버튼 | "클릭 한 번으로 메시지에서 운송 정보를 추출합니다" | 로딩 스피너 → AI 결과 버튼 4개 생성 |
| 3 | AiResult-departure | AI 결과 상차지 그룹 | "AI가 추출한 상차지 정보를 폼에 자동 적용합니다" | 상차지 버튼 green + LocationForm 상차지 채움 |
| 4 | AiResult-destination | AI 결과 하차지 그룹 | "AI가 추출한 하차지 정보를 폼에 자동 적용합니다" | 하차지 버튼 green + LocationForm 하차지 채움 |
| 5 | AiResult-cargo | AI 결과 화물/차량 그룹 | "차량 종류와 화물 정보를 자동으로 입력합니다" | 화물 버튼 green + CargoInfoForm 채움 |
| 6 | AiResult-fare | AI 결과 운임 그룹 | "예상 운임을 자동 계산하여 반영합니다" | 운임 버튼 green + EstimateInfoCard 카운팅 |
| 7 | CargoInfoForm | FormPanel 상단 Card | "차량 타입, 중량, 화물 종류를 한 화면에서 관리합니다" | 시각 강조만 (표시 전용) |
| 8 | LocationForm-departure | FormPanel 상차지 Card | "상차지 주소, 담당자, 연락처를 입력합니다" | 시각 강조만 (표시 전용) |
| 9 | LocationForm-destination | FormPanel 하차지 Card | "하차지 주소, 담당자, 연락처를 입력합니다" | 시각 강조만 (표시 전용) |
| 10 | TransportOptionCard | FormPanel 옵션 Card | "직송, 지게차 등 운송 옵션을 선택합니다" | 옵션 토글 전환 |
| 11 | EstimateInfoCard | FormPanel 하단 Card | "거리와 예상 운임이 자동 계산됩니다" | 금액 카운팅 애니메이션 |

**논리적 의존**: AiInputArea 클릭 → ExtractButton 활성화 → AiResult #3~#6 활성화. 추출하기 미클릭 상태에서 AiResult 클릭 시 반응 없음.

**히트 영역 구현**: 원본 크기 기준 좌표 사용 + scale 역변환 매핑. 최소 크기 44x44px(원본 기준).

---

## 13. 의존성 그래프

```
Phase 1:
  1-1(Foundation) → 1-2(Core UI) → 1-3(Animations) → 1-4(Step Indicator)
  1-2 ──────────────────────────→ 1-5(Responsive)
  1-3 + 1-4 + 1-5 → 1-6(Polish)

Phase 2 (Phase 1-6 완료 후 착수):
  2-1(Hit Area) → 2-2(Highlight)
  2-1           → 2-3(Click)
  2-2 + 2-3    → 2-4(Mode Switch) → 2-5(Polish)
```
