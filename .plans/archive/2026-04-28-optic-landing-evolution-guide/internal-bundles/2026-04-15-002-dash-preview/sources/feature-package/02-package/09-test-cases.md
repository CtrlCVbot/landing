# 테스트 케이스: dash-preview

> **Feature**: Dashboard Preview (Hero Interactive Demo)
> **PRD**: `.plans/prd/10-approved/dashboard-preview-prd.md`
> **Test Framework**: Vitest + React Testing Library
> **Coverage Target**: 80%+ (dashboard-preview/)
> **Created**: 2026-04-14

---

## 1. 단위 테스트

### 1-1. useAutoPlay 훅 (`use-auto-play.test.ts`)

| TC ID | 테스트 케이스 | 관련 REQ | 검증 항목 |
|-------|-------------|---------|----------|
| TC-DASH-010 | Step 0→1→2→3→4 순차 진행 확인. 각 step의 duration 경과 후 다음 step으로 전환 | REQ-DASH-010 | currentStep이 0→1→2→3→4 순서로 변화 |
| TC-DASH-011 | 각 step의 유지 시간이 정의된 duration과 일치 (3000, 4000, 4000, 4000, 3000ms) | REQ-DASH-011 | vi.advanceTimersByTime으로 검증 |
| TC-DASH-012 | Step 4 완료 후 Step 0으로 루프 재개 | REQ-DASH-012 | 18초 후 currentStep === 0 |
| TC-DASH-016 | pause('click') 호출 후 5초 동안 step 변화 없음, 5초 후 자동 재개 | REQ-DASH-016 | isPlaying === false → 5s → isPlaying === true |
| TC-DASH-017 | pause('hover') 호출 후 step 변화 없음 | REQ-DASH-017 | isPlaying === false |
| TC-DASH-018 | resume() 후 2초 대기, hover source 경우 2초 후 재개 | REQ-DASH-018 | 2s 후 isPlaying === true |
| TC-DASH-019 | **Timeout 우선순위**: pause('click') 후 즉시 resume(hover) 호출 시, 5초 timeout 유지 (2초에 재개되지 않음) | REQ-DASH-019 | 2s 시점: isPlaying === false, 5s 시점: isPlaying === true |
| TC-DASH-019-2 | **Timeout 우선순위 역순**: pause('hover') 중 pause('click') 호출 시, 기존 2s timeout 취소, 5s timeout 적용 | REQ-DASH-019 | click 시점 + 5s 후 재개 |
| TC-DASH-031 | enabled=true 시 0.6초 delay 후 자동 재생 시작 | REQ-DASH-031 | 0.5s: isPlaying === false, 0.7s: isPlaying === true |
| TC-DASH-027 | enabled=false(reduced-motion) 시 자동 재생 시작하지 않음 | REQ-DASH-027 | isPlaying === false, currentStep은 초기값 유지 |

### 1-2. StepIndicator (`step-indicator.test.tsx`)

| TC ID | 테스트 케이스 | 관련 REQ | 검증 항목 |
|-------|-------------|---------|----------|
| TC-DASH-014 | 5개 dot이 렌더링되고, currentStep에 해당하는 dot만 active 스타일 | REQ-DASH-014 | role="tab" 5개, aria-selected="true" 1개 |
| TC-DASH-015 | dot 클릭 시 onStepClick(index)가 호출됨 | REQ-DASH-015 | fireEvent.click → onStepClick mock 호출 확인 |
| TC-DASH-029 | 키보드 Tab으로 StepIndicator 진입, ArrowRight/Left로 이동, Enter/Space로 활성화 | REQ-DASH-029 | fireEvent.keyDown → focus 이동 + onStepClick 호출 |
| TC-DASH-029-2 | role="tablist" 적용, 각 dot에 role="tab" 적용, active dot만 tabIndex=0 | REQ-DASH-029 | getByRole('tablist'), getAllByRole('tab') |

### 1-3. AiPanelPreview (`ai-panel-preview.test.tsx`)

| TC ID | 테스트 케이스 | 관련 REQ | 검증 항목 |
|-------|-------------|---------|----------|
| TC-DASH-004 | AiPanel 좌측 사이드바가 렌더링됨 | REQ-DASH-004 | 컨테이너 요소 존재 확인 |
| TC-DASH-005 | Step 0: textarea 비어있음, 추출하기 disabled | REQ-DASH-005 | textarea value === '', button disabled |
| TC-DASH-005-2 | Step 1: AiInputArea에 텍스트가 표시됨 (aiPanelState.inputText) | REQ-DASH-005 | textarea에 텍스트 포함 |
| TC-DASH-006 | Step 2: 4개 카테고리 버튼 그룹이 렌더링됨, 모두 pending 상태 | REQ-DASH-006 | 4개 카테고리 라벨 + blue 배경 확인 |
| TC-DASH-006-2 | Step 3: 버튼이 순차적으로 applied(green) 상태로 전환됨 | REQ-DASH-006 | applied 상태 확인 (bg-green 클래스) |

### 1-4. FormPreview (`form-preview.test.tsx`)

| TC ID | 테스트 케이스 | 관련 REQ | 검증 항목 |
|-------|-------------|---------|----------|
| TC-DASH-007 | 5개 Card 블록(CargoInfo, Location x2, TransportOptions, Estimate)이 렌더링됨 | REQ-DASH-007 | 5개 Card 컨테이너 존재 |
| TC-DASH-008 | Step 3 formState에서 filledCards에 포함된 Card만 값이 표시됨 | REQ-DASH-008 | 채워진 카드에 mock data 값 존재 |
| TC-DASH-009 | estimateAmount가 숫자일 때 포맷팅 표시 ("420,000원") | REQ-DASH-009 | 텍스트에 "420,000원" 포함 |

### 1-5. MobileCardView (`mobile-card-view.test.tsx`)

| TC ID | 테스트 케이스 | 관련 REQ | 검증 항목 |
|-------|-------------|---------|----------|
| TC-DASH-025 | Mobile 전용 카드가 렌더링됨 (chrome 프레임 없음) | REQ-DASH-025 | chrome 요소 부재, 카드 컨테이너 존재 |
| TC-DASH-026 | Step 0(AI_EXTRACT) 카드: "AI가 분석한 결과" 제목 + 4개 카테고리 항목 | REQ-DASH-026 | 카드 제목 + 상차지/하차지/화물/운임 항목 |
| TC-DASH-026-2 | Step 1(COMPLETE) 카드: "AI가 완성한 화물등록" 제목 + 전체 폼 정보 | REQ-DASH-026 | 카드 제목 + 주소/일시/화물/옵션/금액 항목 |

---

## 2. 통합 테스트

### 2-1. DashboardPreview 5단계 루프 (`dashboard-preview.test.tsx`)

| TC ID | 테스트 케이스 | 관련 REQ | 검증 항목 |
|-------|-------------|---------|----------|
| TC-DASH-001 | DashboardPreview 마운트 시 chrome 프레임 렌더링 | REQ-DASH-001 | "OPTIC Broker" 텍스트 존재, window dots 존재 |
| TC-DASH-002 | 축소 스케일 적용 확인 (ScaledContent transform) | REQ-DASH-002 | transform style에 scale 포함 |
| TC-DASH-003 | AiPanel + FormPanel 2열 구조 렌더링 | REQ-DASH-003 | 두 패널 컨테이너 존재 |
| TC-DASH-013 | 5단계 전체 루프 통합 테스트: 마운트 → 0.6s delay → INITIAL(3s) → AI_INPUT(4s) → AI_EXTRACT(4s) → AI_APPLY(4s) → COMPLETE(3s) → INITIAL 루프 | REQ-DASH-010~013 | vi.advanceTimersByTime으로 전체 루프 검증 |
| TC-DASH-020 | 카카오톡 메시지 mock data가 타이핑 시 표시됨 | REQ-DASH-020 | AI_INPUT step에서 메시지 텍스트 일부 존재 |
| TC-DASH-021 | AI 추출 결과에 4개 카테고리 데이터 표시 | REQ-DASH-021 | "상차지", "하차지", "화물/차량", "운임" 라벨 존재 |
| TC-DASH-022 | 폼에 채워지는 값이 OrderRegisterForm 필드 구조 반영 | REQ-DASH-022 | 서울 강남구 물류센터, 카고 5톤 등 값 존재 |

### 2-2. 반응형 전환 (`dashboard-preview.test.tsx`)

| TC ID | 테스트 케이스 | 관련 REQ | 검증 항목 |
|-------|-------------|---------|----------|
| TC-DASH-023 | Desktop(1024px+): 전체 축소 뷰 렌더링, scaleFactor 0.45 | REQ-DASH-023 | PreviewChrome 존재, transform scale(0.45) |
| TC-DASH-024 | Tablet(768~1023px): 축약 뷰 렌더링, scaleFactor 0.38 | REQ-DASH-024 | PreviewChrome 존재, 축약된 FormPanel |
| TC-DASH-028 | aria-label 속성 확인 | REQ-DASH-028 | `aria-label="AI 화물 등록 워크플로우 데모 미리보기"` |

---

## 3. Phase 2 테스트

### 3-1. 모드 전환 (`dashboard-preview.test.tsx` Phase 2 섹션)

| TC ID | 테스트 케이스 | 관련 REQ | 검증 항목 |
|-------|-------------|---------|----------|
| TC-DASH-033 | 기본 상태에서 cinematic 모드 (자동 재생 동작) | REQ-DASH-033 | isPlaying === true, mode === 'cinematic' |
| TC-DASH-034 | 축소 뷰 내부 클릭 → interactive 모드 전환, 자동 재생 중단 | REQ-DASH-034 | fireEvent.click(scaledContent) → mode === 'interactive' |
| TC-DASH-035 | interactive 모드에서 10초 비활동 → cinematic 복귀 | REQ-DASH-035 | 10s advanceTimer → mode === 'cinematic', isPlaying === true |

### 3-2. 히트 영역 클릭 (`interactive-overlay.test.tsx`)

| TC ID | 테스트 케이스 | 관련 REQ | 검증 항목 |
|-------|-------------|---------|----------|
| TC-DASH-036 | hover 시 accent border 아웃라인 표시 | REQ-DASH-036 | hover 이벤트 → border style 변화 |
| TC-DASH-037 | 11개 히트 영역이 독립적으로 렌더링됨 | REQ-DASH-037 | 11개 HitArea 요소 존재 |
| TC-DASH-038 | hover 시 툴팁 표시 (원본 크기 14px) | REQ-DASH-038 | 툴팁 요소 존재 + font-size 14px |
| TC-DASH-039 | AiInputArea 클릭 → 타이핑 효과 실행 | REQ-DASH-039 | 클릭 후 textarea 텍스트 변화 |
| TC-DASH-040-1 | ExtractButton 클릭 → 로딩 스피너 → AI 결과 버튼 생성 | REQ-DASH-040 | 클릭 후 4개 카테고리 등장 |
| TC-DASH-040-2 | AI 결과 상차지 클릭 → 버튼 green + Location 상차지 채움 | REQ-DASH-040 | 버튼 색상 전환 + 폼 값 채움 |
| TC-DASH-040-3 | TransportOption 클릭 → 토글 전환 | REQ-DASH-040 | 토글 상태 변화 |
| TC-DASH-040-4 | EstimateInfoCard 클릭 → 금액 카운팅 | REQ-DASH-040 | 금액 표시 변화 |
| TC-DASH-041 | 비순서 클릭: 추출하기 미클릭 상태에서 AI 결과 버튼 클릭 → 반응 없음 | REQ-DASH-041 | 클릭 시 상태 변화 없음 |
| TC-DASH-042 | 툴팁 텍스트가 mock-data.ts의 tooltips에서 가져옴 | REQ-DASH-042 | 표시된 텍스트 === mockData.tooltips[id] |
| TC-DASH-043 | 히트 영역 클릭이 올바른 컴포넌트에 매핑됨 (scale 역변환 검증) | REQ-DASH-043 | 각 영역 클릭 → 올바른 onHitAreaClick(id) 호출 |
| TC-DASH-044 | 모든 히트 영역이 최소 44x44px(원본 기준) 이상 | REQ-DASH-044 | HitAreaConfig.bounds.width >= 44, height >= 44 |
| TC-DASH-045 | Mobile(<768px)에서 인터랙티브 모드 비활성화 | REQ-DASH-045 | Mobile viewport에서 축소 뷰 클릭 → 모드 변화 없음 |

---

## 4. 접근성 테스트

| TC ID | 테스트 케이스 | 관련 REQ | 검증 항목 |
|-------|-------------|---------|----------|
| TC-DASH-027 | prefers-reduced-motion 매체 쿼리 감지 시 자동 재생 비활성화, COMPLETE 상태 정적 표시 | REQ-DASH-027 | matchMedia('prefers-reduced-motion: reduce') mock → isPlaying === false, Step 4 상태 |
| TC-DASH-028 | aria-label 존재 확인 | REQ-DASH-028 | getByLabelText('AI 화물 등록 워크플로우 데모 미리보기') |
| TC-DASH-029 | StepIndicator 키보드 탐색: Tab 진입 → ArrowRight → Enter | REQ-DASH-029 | focus 이동 + 활성화 검증 |
| TC-DASH-032 | CSS 애니메이션 우선 확인 (JS는 금액 카운팅에만 사용) | REQ-DASH-032 | 컴포넌트에 requestAnimationFrame 호출이 금액 카운팅에만 존재 |

---

## 5. 성능 테스트 (수동/CI)

| TC ID | 테스트 케이스 | 관련 REQ | 검증 방법 |
|-------|-------------|---------|----------|
| TC-DASH-030 | JS 번들 기여 <30KB gzipped | REQ-DASH-030 | `pnpm run build` → chunk 크기 확인 |
| TC-DASH-031-2 | LCP 영향 +100ms 미만 | REQ-DASH-031 | Lighthouse CI 전후 비교 |

---

## 6. TC-DASH → REQ-DASH 역추적 매트릭스

| TC ID | REQ ID | 테스트 유형 |
|-------|--------|-----------|
| TC-DASH-001 | REQ-DASH-001 | 통합 |
| TC-DASH-002 | REQ-DASH-002 | 통합 |
| TC-DASH-003 | REQ-DASH-003 | 통합 |
| TC-DASH-004 | REQ-DASH-004 | 단위 |
| TC-DASH-005, 005-2 | REQ-DASH-005 | 단위 |
| TC-DASH-006, 006-2 | REQ-DASH-006 | 단위 |
| TC-DASH-007 | REQ-DASH-007 | 단위 |
| TC-DASH-008 | REQ-DASH-008 | 단위 |
| TC-DASH-009 | REQ-DASH-009 | 단위 |
| TC-DASH-010 | REQ-DASH-010 | 단위 |
| TC-DASH-011 | REQ-DASH-011 | 단위 |
| TC-DASH-012 | REQ-DASH-012 | 단위 |
| TC-DASH-013 | REQ-DASH-010, 011, 012, 013 | 통합 |
| TC-DASH-014 | REQ-DASH-014 | 단위 |
| TC-DASH-015 | REQ-DASH-015 | 단위 |
| TC-DASH-016 | REQ-DASH-016 | 단위 |
| TC-DASH-017 | REQ-DASH-017 | 단위 |
| TC-DASH-018 | REQ-DASH-018 | 단위 |
| TC-DASH-019, 019-2 | REQ-DASH-019 | 단위 |
| TC-DASH-020 | REQ-DASH-020 | 통합 |
| TC-DASH-021 | REQ-DASH-021 | 통합 |
| TC-DASH-022 | REQ-DASH-022 | 통합 |
| TC-DASH-023 | REQ-DASH-023 | 통합 |
| TC-DASH-024 | REQ-DASH-024 | 통합 |
| TC-DASH-025 | REQ-DASH-025 | 단위 |
| TC-DASH-026, 026-2 | REQ-DASH-026 | 단위 |
| TC-DASH-027 | REQ-DASH-027 | 접근성 |
| TC-DASH-028 | REQ-DASH-028 | 접근성 |
| TC-DASH-029, 029-2 | REQ-DASH-029 | 접근성 |
| TC-DASH-030 | REQ-DASH-030 | 성능 |
| TC-DASH-031-2 | REQ-DASH-031 | 성능 |
| TC-DASH-032 | REQ-DASH-032 | 접근성/성능 |
| TC-DASH-033 | REQ-DASH-033 | Phase 2 |
| TC-DASH-034 | REQ-DASH-034 | Phase 2 |
| TC-DASH-035 | REQ-DASH-035 | Phase 2 |
| TC-DASH-036 | REQ-DASH-036 | Phase 2 |
| TC-DASH-037 | REQ-DASH-037 | Phase 2 |
| TC-DASH-038 | REQ-DASH-038 | Phase 2 |
| TC-DASH-039 | REQ-DASH-039 | Phase 2 |
| TC-DASH-040-1~4 | REQ-DASH-040 | Phase 2 |
| TC-DASH-041 | REQ-DASH-041 | Phase 2 |
| TC-DASH-042 | REQ-DASH-042 | Phase 2 |
| TC-DASH-043 | REQ-DASH-043 | Phase 2 |
| TC-DASH-044 | REQ-DASH-044 | Phase 2 |
| TC-DASH-045 | REQ-DASH-045 | Phase 2 |