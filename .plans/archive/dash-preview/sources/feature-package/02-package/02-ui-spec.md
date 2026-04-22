# UI 명세: dash-preview

> **Feature**: Dashboard Preview (Hero Interactive Demo)
> **PRD**: `.plans/prd/10-approved/dashboard-preview-prd.md`
> **Wireframe**: `.plans/wireframes/dash-preview/components.md`
> **Created**: 2026-04-14

---

## 1. 디자인 토큰 참조

기존 `globals.css` CSS 변수 및 Tailwind 클래스를 사용한다. 새로운 디자인 토큰은 추가하지 않는다.

| 용도 | 토큰 / 값 | Tailwind 클래스 |
|------|----------|---------------|
| chrome 배경 | `oklch(0.15 0.01 260 / 0.5)` | `bg-gray-900/50` (`--color-card`) |
| chrome border | `#1f2937` | `border-gray-800` (`--color-border`) |
| chrome 모서리 | - | `rounded-2xl` |
| window dot - red | `#ef4444` | - |
| window dot - yellow | `#eab308` | - |
| window dot - green | `#22c55e` | - |
| 축소 뷰 내 라벨 | `#9ca3af` | `text-gray-400` (`--color-muted-foreground`) |
| AI 버튼 대기(pending) | `#3b82f6` | `bg-blue-500` |
| AI 버튼 적용됨(applied) | `#22c55e` | `bg-green-500` |
| AI 버튼 적용불가(unavailable) | `#6b7280` | `bg-gray-500` |
| accent glow (border/shadow) | `#9333ea` | `--color-accent-start` (purple-600) |
| 금액 강조 | `#3b82f6` | `--color-accent-end` (blue-600) |
| 툴팁 배경 (Phase 2) | `bg-gray-900/90` | - |
| 툴팁 텍스트 (Phase 2) | `text-white` | font-size: 14px |

---

## 2. 컴포넌트별 시각 명세

### 2-1. PreviewChrome

| 요소 | 크기/간격 | 스타일 |
|------|----------|--------|
| 외곽 프레임 | aspect-video, max-width 컨테이너 너비 | `rounded-2xl border border-gray-800 bg-gray-900/50` |
| ChromeHeader | height: 32px, padding: 0 12px | `flex items-center gap-2` |
| Window dots | 각 8px 원, gap: 6px | red(#ef4444), yellow(#eab308), green(#22c55e) |
| Title text | font-size: 12px | `text-gray-400 font-medium ml-3` |
| ScaledContent | `overflow: hidden`, **ref 기반 동적 높이**: `useRef`로 내부 `scrollHeight` 측정 → `scaleFactor` 곱한 값을 외부 래퍼 `height`로 설정. `ResizeObserver`로 콘텐츠 변화 자동 추적 | - |

**Scale Factor:**

| 뷰포트 | scaleFactor | transformOrigin |
|--------|-------------|-----------------|
| Desktop (>=1024px) | 0.45 | top left |
| Tablet (768~1023px) | 0.38 | top left |
| Mobile (<768px) | - (chrome 비렌더링) | - |

### 2-2. AiPanelPreview

| 요소 | 크기/간격 (원본 기준, 축소 전) | 스타일 |
|------|--------------------------|--------|
| 패널 컨테이너 | width: 380px, border-right | `flex flex-col border-r border-gray-700` |
| AiTabBar | height: 40px, 2 탭 | 활성 탭: `border-b-2 border-accent text-white`, 비활성: `text-gray-500` |
| AiInputAreaPreview textarea | min-height: 120px, padding: 12px | `bg-gray-800/50 rounded-lg border border-gray-700` |
| 추출하기 버튼 | height: 36px, width: 100%, margin-top: 8px | `rounded-lg font-medium text-sm` |
| AiResultButtonsPreview | padding: 12px, gap: 8px | 카테고리별 그룹, 수직 나열 |
| AiCategoryGroup | padding: 8px, gap: 4px | 아이콘(16px) + 라벨(font-size: 13px) + 버튼 리스트 |
| AiButtonItem | height: 32px, padding: 4px 8px | `rounded-md text-xs text-white` |

### 2-3. FormPreview

| 요소 | 크기/간격 (원본 기준, 축소 전) | 스타일 |
|------|--------------------------|--------|
| 폼 컨테이너 | flex-1, padding: 16px, gap: 16px, overflow-y: auto | `flex flex-col` |
| Card 블록 | padding: 16px, border-radius: 12px | `bg-gray-800/30 border border-gray-700/50 rounded-xl` |
| Card 라벨 | font-size: 14px, font-weight: 600, margin-bottom: 12px | `text-gray-300` |
| 필드 라벨 | font-size: 12px | `text-gray-500` |
| 필드 값 (채워진) | font-size: 14px | `text-white` |
| 필드 값 (빈) | font-size: 14px | `text-gray-600` border-bottom dashed |

**Card 블록 순서 (위→아래):**
1. CargoInfoPreview — 차량타입 / 중량 / 화물명
2. LocationPreview (상차지) — 주소 / 담당자 / 연락처 / 일시
3. LocationPreview (하차지) — 주소 / 담당자 / 연락처 / 일시
4. TransportOptionsPreview — 직송 / 지게차 / 왕복 / 긴급 토글
5. EstimatePreview — 거리 / 운임

### 2-4. StepIndicator

| 요소 | 크기/간격 | 스타일 |
|------|----------|--------|
| 컨테이너 | 중앙 정렬, padding-top: 12px, gap: 8px | `flex justify-center items-center` |
| StepDot (inactive) | 8 x 8px | `bg-gray-600 rounded-full` |
| StepDot (active) | 8 x 8px, scale: 1.25 | `bg-gradient-to-r from-accent-start to-accent-end rounded-full` |
| StepDot (hover) | 8 x 8px | `bg-gray-400 cursor-pointer` |
| StepDot (focus) | 8 x 8px | `outline: 2px solid accent, offset: 2px` |

### 2-5. MobileCardView

| 요소 | 크기/간격 | 스타일 |
|------|----------|--------|
| 카드 컨테이너 | width: 100%, padding: 16px 20px | `bg-gray-900/50 border border-gray-800 rounded-xl` |
| 카드 제목 | font-size: 16px, font-weight: 600, margin-bottom: 12px | `text-white` |
| 항목 라벨 | font-size: 14px | `text-gray-400` |
| 항목 값 | font-size: 14px | `text-white` |
| MobileDotIndicator | 2 dots, gap: 6px, 중앙 정렬, margin-top: 12px | 활성: accent gradient, 비활성: gray-600 |

### 2-6. InteractiveOverlay (Phase 2)

| 요소 | 크기/간격 | 스타일 |
|------|----------|--------|
| 오버레이 레이어 | position: absolute, inset: 0 (ScaledContent 위) | `pointer-events-auto cursor-pointer z-10` |
| HitArea | 원본 크기 좌표 x scaleFactor로 계산된 위치/크기 | `position: absolute, 투명 배경` |
| HitArea (hover) | - | `border: 2px solid var(--color-accent-start) rounded` |
| Tooltip | max-width: 280px, padding: 8px 12px | `bg-gray-900/90 text-white rounded-md text-sm(14px)` |
| Tooltip 위치 | 히트 영역 상단 또는 우측 (뷰포트 내 표시 보장) | `z-index: 최상단` |

---

## 3. 5단계별 시각 상태 상세

### Step 1 (index 0): INITIAL (3초)

| 영역 | 시각 상태 |
|------|----------|
| AiInputArea | textarea 비어있음, placeholder "카카오톡 메시지를 붙여넣으세요..." 표시 |
| 추출하기 버튼 | disabled 상태: opacity 0.5, cursor: not-allowed |
| AiResultButtons | 비표시 (hidden) |
| CargoInfoPreview | 모든 필드 빈 상태 (dashed border) |
| LocationPreview x2 | 모든 필드 빈 상태 |
| TransportOptionsPreview | 모든 토글 unchecked |
| EstimatePreview | "--km", "--원" |
| 전체 인상 | 빈 업무 화면의 구조감. "이런 UI가 있구나" |

### Step 2 (index 1): AI_INPUT (4초)

| 영역 | 시각 상태 |
|------|----------|
| AiInputArea | 타이핑 애니메이션 시작: 글자 단위로 카카오톡 메시지가 등장 (~30ms/글자). 깜빡이는 커서 (CSS blink) |
| 추출하기 버튼 | active 상태: opacity 1, hover 가능 스타일 |
| AiResultButtons | 비표시 |
| Form 전체 | 여전히 빈 상태. 대기 느낌 |
| 전체 인상 | "사용자가 AI에 요청하는 장면" |

### Step 3 (index 2): AI_EXTRACT (4초)

| 영역 | 시각 상태 |
|------|----------|
| AiInputArea | 메시지 완성 상태 (전체 텍스트 표시) |
| 추출하기 버튼 | pressed(0~0.5s): scale 0.95, 진한 bg → loading(0.5~3s): Loader2 아이콘 spin + "분석 중..." → disabled(3s~): opacity 0.5 |
| AiResultButtons | 4개 카테고리 stagger 등장 (0.15s 간격). 모든 버튼 pending(blue-500) 상태 |
| Form 전체 | 여전히 빈 상태 |
| 전체 인상 | "AI가 메시지를 이해하는 장면" |

### Step 4 (index 3): AI_APPLY (4초)

| 영역 | 시각 상태 (0.5초 간격 stagger) |
|------|--------------------------|
| AiResultButtons - 상차지 | pending(blue) → applied(green) + Check 아이콘 (0s) |
| LocationPreview 상차지 | 값 fade-in + Card border glow (accent) (0s) |
| AiResultButtons - 하차지 | pending → applied (0.5s) |
| LocationPreview 하차지 | 값 fade-in + Card glow (0.5s) |
| AiResultButtons - 화물/차량 | pending → applied (1.0s) |
| CargoInfoPreview | 값 fade-in + Card glow (1.0s) |
| AiResultButtons - 운임 | pending → applied (1.5s) |
| EstimatePreview | 금액 카운팅 시작: 0원 → 420,000원, easeOut 0.8s (1.5s) |
| TransportOptionsPreview | 직송/지게차 checked 전환 (1.5s) |
| 전체 인상 | "AI가 폼을 자동 채우는 핵심 장면" |

### Step 5 (index 4): COMPLETE (3초)

| 영역 | 시각 상태 |
|------|----------|
| AiResultButtons | 모든 버튼 applied(green) 상태 유지 |
| Form 전체 | 모든 Card 내 필드 채워진 최종 상태 |
| EstimatePreview | "140km", "420,000원" 고정 표시 |
| 전체 인상 | "한 번에 완성된 결과". settled 느낌 |

---

## 4. 반응형 브레이크포인트별 레이아웃

### Desktop (>=1024px)
