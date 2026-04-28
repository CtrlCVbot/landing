# REQ-ID ↔ Screen-ID 매핑: Dashboard Preview

> **Feature Slug**: `dash-preview`
> **생성일**: 2026-04-14
> **소스**: PRD `dashboard-preview-prd.md` + Wireframe `screens.md / navigation.md / components.md`

---

## 전체 매핑 매트릭스

| REQ ID | 요구사항 요약 | Phase | Screen ID | 컴포넌트 | 와이어프레임 위치 |
|--------|-------------|-------|-----------|---------|----------------|
| REQ-DASH-001 | chrome 프레임: 창 제어 점 3개 + "OPTIC Broker" 타이틀, border-gray-800, bg-gray-900/50 | 1 | SCR-001, SCR-002, SCR-004 | PreviewChrome, ChromeHeader | SCR-001 레이아웃 치수, SCR-002 chrome header, components.md 2-2절 |
| REQ-DASH-002 | chrome 내부 전체 축소 스케일(~40~50%), 시네마틱 뷰 | 1 | SCR-001, SCR-002, SCR-004 | ScaledContent | SCR-001 레이아웃 치수(scale 0.4~0.5), components.md 2-2절 |
| REQ-DASH-003 | chrome 내부에 AiPanel(~30%) + OrderRegisterForm(~70%) 2열만 재현, Header/Breadcrumb 제외 | 1 | SCR-001, SCR-002 | MainContentLayout | SCR-001 레이아웃 치수, SCR-002 내부 구조 |
| REQ-DASH-004 | AiPanel 좌측 사이드바, 확장 상태 고정 표시 | 1 | SCR-002 (전 Step), SCR-004 | AiPanelPreview | SCR-002 전 Step 와이어프레임, components.md 2-3절 |
| REQ-DASH-005 | AiInputArea: textarea + "추출하기" 버튼, Step 2에서 타이핑 효과 | 1 | SCR-002 (Step 2~3) | AiInputAreaPreview, AiExtractButton | SCR-002 Step 2, Step 3 와이어프레임, components.md 2-3절 |
| REQ-DASH-006 | AiResultButtons: 4개 카테고리(상차지/하차지/화물·차량/운임) 버튼 그룹, Step 3에서 stagger 등장 | 1 | SCR-002 (Step 3~5) | AiResultButtonsPreview, AiCategoryGroup, AiButtonItem | SCR-002 Step 3 와이어프레임, components.md 2-3절 |
| REQ-DASH-007 | OrderRegisterForm 스크롤 영역 축소 재현: CargoInfoForm + LocationForm x2 + TransportOptionCard + EstimateInfoCard | 1 | SCR-002 (전 Step), SCR-004 | FormPreview, CargoInfoPreview, LocationPreview, TransportOptionsPreview, EstimatePreview | SCR-002 전 Step FormPanel 와이어프레임, components.md 2-4절 |
| REQ-DASH-008 | Step 4에서 AI 버튼 blue→green 전환과 동시에 대응 폼 필드 순차 채움 | 1 | SCR-002 (Step 4) | AiResultButtonsPreview, FormPreview | SCR-002 Step 4 와이어프레임 (glow effect, green 전환) |
| REQ-DASH-009 | EstimateInfoCard 운임 금액 숫자 카운팅 애니메이션 (0.5~1초) | 1 | SCR-002 (Step 4~5) | EstimatePreview | SCR-002 Step 4(카운팅 중), Step 5(420,000원), components.md 2-4절 EstimatePreview |
| REQ-DASH-010 | 5단계 자동 재생 시퀀스: INITIAL→AI_INPUT→AI_EXTRACT→AI_APPLY→COMPLETE | 1 | SCR-002 | DashboardPreview, PreviewSteps | SCR-002 전체 (Step 1~5 와이어프레임) |
| REQ-DASH-011 | 각 단계 유지 시간: INITIAL 3s, AI_INPUT 4s, AI_EXTRACT 4s, AI_APPLY 4s, COMPLETE 3s (총 16~22s) | 1 | SCR-002 | useAutoPlay | navigation.md 2절 타이밍 상세 표 (총 18s) |
| REQ-DASH-012 | Step 5 완료 후 Step 1로 연속 루프 재생 | 1 | SCR-002 | useAutoPlay | navigation.md 2절 상태 다이어그램 (COMPLETE→INITIAL) |
| REQ-DASH-013 | 단계 전환: Framer Motion cross-fade (opacity + y 이동, easeOut) | 1 | SCR-002 | DashboardPreview (motion 설정) | navigation.md 2절 (cross-fade 전환) |
| REQ-DASH-014 | chrome 하단 5단계 Step Indicator, 활성 단계 accent color 강조 | 1 | SCR-001, SCR-002, SCR-004 | StepIndicator, StepDot | SCR-001 하단 StepIndicator, SCR-002 각 Step 하단, components.md 2-5절 |
| REQ-DASH-015 | Step Indicator 클릭 시 해당 단계 즉시 이동 | 1 | SCR-001, SCR-002, SCR-004 | StepIndicator | navigation.md 3절, 8절 이벤트 표 (step click) |
| REQ-DASH-016 | Step Indicator 클릭 시 자동 재생 일시정지, 5초 비활동 후 재개 | 1 | SCR-001, SCR-002 | StepIndicator, useAutoPlay | navigation.md 3절 인터랙션 상태, 8절 이벤트 표 |
| REQ-DASH-017 | Preview 영역 hover 시 자동 재생 일시정지 | 1 | SCR-001 | DashboardPreview | navigation.md 3절 상태 다이어그램 (mouseenter→PAUSED) |
| REQ-DASH-018 | mouseout 후 2초 뒤 자동 재생 재개 | 1 | SCR-001 | useAutoPlay | navigation.md 3절 (mouseleave→2초 후 재개), 8절 이벤트 표 |
| REQ-DASH-019 | Timeout 우선순위: Step 클릭(5초) > Hover 해제(2초) | 1 | SCR-001 | useAutoPlay | navigation.md 3절 Timeout 우선순위 다이어그램, 8절 (click+mouseout) |
| REQ-DASH-020 | AI 입력 mock data: 카카오톡 스타일 메시지 | 1 | SCR-002 (Step 2~5) | mock-data.ts | SCR-002 Step 2 textarea 내용 ("서울 강남구 물류센터에서...") |
| REQ-DASH-021 | AI 추출 결과 mock data: 4개 카테고리 (상차지/하차지/차량/화물/운임 420,000원) | 1 | SCR-002 (Step 3~5) | mock-data.ts | SCR-002 Step 3 AI 결과 버튼, Step 5 완료 상태 |
| REQ-DASH-022 | 폼 채워지는 값이 OrderRegisterForm 필드 구조 반영 | 1 | SCR-002 (Step 4~5) | mock-data.ts, FormPreview | SCR-002 Step 4~5 FormPanel 상세 값 |
| REQ-DASH-023 | Desktop(>=1024px): chrome 프레임 내 전체 축소 뷰 표시 | 1 | SCR-001 | DashboardPreview | SCR-001 Desktop Hero 와이어프레임 전체 |
| REQ-DASH-024 | Tablet(768~1023px): chrome 프레임 유지, AI 패널 + 핵심 폼 영역 축약 표시 | 1 | SCR-004 | DashboardPreview (tablet 분기) | SCR-004 Tablet 뷰 와이어프레임 전체 |
| REQ-DASH-025 | Mobile(<768px): chrome 없는 전용 카드 뷰 표시 | 1 | SCR-005 | MobileCardView | SCR-005 Mobile 카드 뷰 전체 |
| REQ-DASH-026 | Mobile: Step 3(AI_EXTRACT)과 Step 5(COMPLETE) 2단계만 자동 전환 | 1 | SCR-005 | MobileCardView | SCR-005 Mobile Step A/B 카드, navigation.md 5절 Mobile 상태 플로우 |
| REQ-DASH-027 | prefers-reduced-motion 시 자동 재생 비활성화, Step 5 정적 표시 | 1 | SCR-001 (공통) | DashboardPreview, useReducedMotion | navigation.md 6절 접근성 분기 다이어그램, screens.md 접근성 고려사항 |
| REQ-DASH-028 | DashboardPreview 컨테이너 aria-label="AI 화물 등록 워크플로우 데모 미리보기" | 1 | SCR-001 (공통) | DashboardPreview | screens.md 접근성 고려사항 (aria-label) |
| REQ-DASH-029 | Step Indicator 키보드 Tab 탐색 + Enter/Space 활성화 | 1 | SCR-001, SCR-004 | StepIndicator, StepDot | components.md 2-5절 StepIndicator 접근성 (tablist, tab role) |
| REQ-DASH-030 | Preview JavaScript 번들 기여 30KB gzipped 이하 | 1 | SCR-001 (공통) | (빌드 설정) | PRD 7-8절 성능 전략 테이블 |
| REQ-DASH-031 | transition delay 0.6s 지연 등장, LCP 미영향 | 1 | SCR-001 | DashboardPreview | SCR-001 레이아웃 주석 (delay: 0.6s fade-in), PRD 7-8절 |
| REQ-DASH-032 | CSS 애니메이션(transform, opacity) 우선, JS는 금액 카운팅만 | 1 | SCR-002 (공통) | (구현 전략) | PRD 7-8절, components.md EstimatePreview (JS 예외 허용) |
| REQ-DASH-033 | 두 가지 모드 지원: 시네마틱(기본) / 인터랙티브. 기본은 시네마틱 | 2 | SCR-003 | DashboardPreview (mode state) | navigation.md 4절 모드 전환 다이어그램 |
| REQ-DASH-034 | 축소 뷰 내부 클릭 → 인터랙티브 모드 진입 (Step Indicator 클릭과 구분) | 2 | SCR-003 | DashboardPreview, InteractiveOverlay | navigation.md 4절, 8절 이벤트 표 (inner click) |
| REQ-DASH-035 | 인터랙티브 모드에서 10초 비활동 시 시네마틱 모드 자동 복귀 | 2 | SCR-003 | DashboardPreview, useAutoPlay 확장 | navigation.md 4절 (10초 비활동), 8절 이벤트 표 |
| REQ-DASH-036 | 인터랙티브 모드 hover 시 accent 색상 사각 테두리(2px) 표시 | 2 | SCR-003 | InteractiveOverlay, HitArea | SCR-003 Hover 하이라이트 상태 와이어프레임, components.md 2-6절 |
| REQ-DASH-037 | 인터랙티브 영역 8~10개 히트 영역 분할: AiInputArea, 추출하기 버튼, AI결과 4카테고리, CargoInfoForm, LocationForm x2, TransportOptionCard, EstimateInfoCard | 2 | SCR-003 | InteractiveOverlay, HitArea x11 | SCR-003 히트 영역 매핑 표 (11개), components.md 2-6절 |
| REQ-DASH-038 | hover 시 원본 크기(14px) 설명 툴팁 표시 | 2 | SCR-003 | Tooltip | SCR-003 Hover 상태 (툴팁 14px), components.md 2-6절 Tooltip |
| REQ-DASH-039 | 히트 영역 클릭 시 mock 기능 실행 (mock-data.ts 기반, 실제 API 없음) | 2 | SCR-003 | InteractiveOverlay, HitArea | SCR-003 클릭 실행 시퀀스, navigation.md 4절 시퀀스 다이어그램 |
| REQ-DASH-040 | 클릭 mock 기능 매핑: AiInputArea→타이핑, 추출하기→스피너+버튼생성, AI버튼→필드채움, TransportOption→토글, EstimateInfoCard→카운팅 | 2 | SCR-003 | InteractiveOverlay, 각 Preview 컴포넌트 | SCR-003 클릭 실행 시퀀스 (1~7번) |
| REQ-DASH-041 | 클릭 권장 흐름 있되 강제하지 않음, 비순서 클릭도 독립 실행 | 2 | SCR-003 | InteractiveOverlay, HitArea (dependsOn) | SCR-003 논리적 의존 관계, 비순서 클릭 허용 설명 |
| REQ-DASH-042 | 툴팁 텍스트를 mock-data.ts에서 관리, 컴포넌트 코드 수정 없이 교체 가능 | 2 | SCR-003 | mock-data.ts (tooltips 필드) | components.md 3-4절 PreviewMockData (tooltips 필드) |
| REQ-DASH-043 | 히트 영역은 투명 오버레이 레이어로 구현, 원본 크기 좌표 scale 역변환 매핑 | 2 | SCR-003 | InteractiveOverlay, HitArea | SCR-003 오버레이 구조 설명, components.md 2-6절 InteractiveOverlay |
| REQ-DASH-044 | 히트 영역 최소 크기 원본 기준 44x44px 이상 | 2 | SCR-003 | HitArea (minSize) | components.md 2-6절 HitAreaConfig (minSize: {w:44, h:44}) |
| REQ-DASH-045 | Mobile(<768px)에서 인터랙티브 모드 비활성화 | 2 | SCR-005 | DashboardPreview (viewport check) | SCR-005 Mobile 전용 사항 (Phase 2 미지원), screens.md 반응형 요약 |

---

## Phase별 요약

| Phase | Must | Should | 합계 |
|-------|------|--------|------|
| Phase 1 | 25개 | 7개 | 32개 |
| Phase 2 | 11개 | 2개 | 13개 |
| **합계** | **36개** | **9개** | **45개** |

---

## Screen ↔ REQ 역매핑

| Screen ID | 화면명 | 커버 REQ | 개수 |
|-----------|--------|---------|------|
| SCR-001 | Desktop Hero | REQ-DASH-001~003, 014~019, 023, 027~028, 030~031 | 13개 |
| SCR-002 | DashboardPreview 5단계 내부 | REQ-DASH-004~016, 020~022, 029, 032 | 20개 |
| SCR-003 | Phase 2 인터랙티브 모드 | REQ-DASH-033~045 | 13개 |
| SCR-004 | Tablet 뷰 | REQ-DASH-001~003, 024, 029 | 5개 |
| SCR-005 | Mobile 뷰 | REQ-DASH-025~026, 027~028, 045 | 5개 |

> 참고: 다수 REQ가 복수 화면에 걸쳐 매핑됨(공통 요구사항). 위 표는 각 화면의 1차 책임 REQ 기준.

---

## 누락(UNMAPPED) 항목

모든 REQ-DASH-001~045가 최소 1개 SCR에 매핑됨. UNMAPPED 항목 없음.
