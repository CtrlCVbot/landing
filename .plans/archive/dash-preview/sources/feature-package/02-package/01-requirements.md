# 요구사항 SSOT: dash-preview

> **Feature**: Dashboard Preview (Hero Interactive Demo)
> **PRD**: `.plans/prd/10-approved/dashboard-preview-prd.md`
> **Created**: 2026-04-14

---

## 1. Phase 1 — 시네마틱 뷰

### 1-1. Container & Chrome (Must)

| REQ ID | 요구사항 | 우선순위 | TASK ID | TC ID | 수용 기준 |
|--------|---------|---------|---------|-------|----------|
| REQ-DASH-001 | DashboardPreview 컴포넌트는 브라우저/앱 스타일 chrome 프레임을 표시한다. 창 제어 점 3개, 타이틀 바("OPTIC Broker"), border(border-gray-800)와 배경(bg-gray-900/50)을 포함한다. | Must | TASK-DASH-001 | TC-DASH-001 | chrome 프레임이 렌더링되고, "OPTIC Broker" 타이틀이 표시됨 |
| REQ-DASH-002 | chrome 프레임 내부 전체를 축소 스케일(~40~50% 크기)로 표시한다. 폰트, 컴포넌트, 간격 모두 축소되어 영상 녹화물처럼 보인다. | Must | TASK-DASH-001 | TC-DASH-002 | 내부 콘텐츠가 축소되어 표시됨. 일반 텍스트가 6~8px 수준으로 보임 |
| REQ-DASH-003 | chrome 프레임 내부에는 ai-register 페이지의 main 컨텐츠 영역만 재현한다. Header, Breadcrumb, Sidebar 등 페이지 셸 요소는 제외한다. 내부 구조: 좌측 AiPanel(380px 비율) + 우측 OrderRegisterForm(flex-1)의 2열 레이아웃. | Must | TASK-DASH-001 | TC-DASH-003 | chrome 내부에 AiPanel + Form 2열 구조만 축소 렌더링됨. header/breadcrumb 없음 |

### 1-2. AI Panel (Must)

| REQ ID | 요구사항 | 우선순위 | TASK ID | TC ID | 수용 기준 |
|--------|---------|---------|---------|-------|----------|
| REQ-DASH-004 | AiPanel 영역이 좌측 사이드바로 표시된다. 실제 ai-register 페이지의 AiPanel 구조(380px, border-r, flex-col)를 축소 재현한다. 확장 상태(expanded)로 고정 표시한다. | Must | TASK-DASH-003 | TC-DASH-004 | 축소 뷰 내 좌측에 AiPanel 사이드바가 보임 |
| REQ-DASH-005 | AiPanel 내부에 AiInputArea를 재현한다: 텍스트 탭이 활성화된 상태의 textarea 영역 + "추출하기" 버튼. Step 2에서 카카오톡 메시지가 타이핑 효과로 입력된다. | Must | TASK-DASH-003 | TC-DASH-005 | Step 2에서 textarea에 메시지 텍스트가 타이핑 효과로 등장하고, "추출하기" 버튼이 보임 |
| REQ-DASH-006 | AiPanel 하단에 AiResultButtons를 재현한다: 4개 카테고리(상차지/MapPin, 하차지/Flag, 화물·차량/Package, 운임/Banknote)의 버튼 그룹. 각 버튼은 라벨 + 값 + 상태 아이콘으로 구성. | Must | TASK-DASH-003 | TC-DASH-006 | Step 3에서 4개 카테고리의 버튼이 "대기"(파랑) 상태로 stagger 등장 |

### 1-3. Form Panel (Must/Should)

| REQ ID | 요구사항 | 우선순위 | TASK ID | TC ID | 수용 기준 |
|--------|---------|---------|---------|-------|----------|
| REQ-DASH-007 | OrderRegisterForm의 스크롤 가능한 폼 영역을 축소 재현한다. 실제 구조: CargoInfoForm + LocationForm x2 + TransportOptionCard + EstimateInfoCard. 각 섹션은 Card 형태로 시각적 구분. | Must | TASK-DASH-004 | TC-DASH-007 | Form 영역에 여러 Card 블록이 세로로 나열된 축소 뷰가 인지됨 |
| REQ-DASH-008 | AI 적용 단계(Step 4)에서 AiResultButtons의 각 버튼이 "적용됨"(초록) 상태로 전환되면서, 대응하는 폼 필드가 순차적으로 채워진다. | Must | TASK-DASH-005, TASK-DASH-006 | TC-DASH-008 | 버튼 색상 전환(파랑→초록)과 동시에 해당 폼 Card 내 필드에 값이 등장 |
| REQ-DASH-009 | 운임 금액이 EstimateInfoCard에 표시될 때 숫자 카운팅 애니메이션을 적용한다. | Should | TASK-DASH-006 | TC-DASH-009 | 금액 전환 시 0.5~1초 동안 숫자가 점진적으로 변화 |

### 1-4. Auto-Play Sequence (Must)

| REQ ID | 요구사항 | 우선순위 | TASK ID | TC ID | 수용 기준 |
|--------|---------|---------|---------|-------|----------|
| REQ-DASH-010 | 5단계 스크립트 시퀀스를 자동 재생한다: INITIAL → AI_INPUT → AI_EXTRACT → AI_APPLY → COMPLETE | Must | TASK-DASH-005 | TC-DASH-010 | 5개 단계가 순서대로 전환되며 AI 등록 과정이 시각적으로 재현됨 |
| REQ-DASH-011 | 각 단계는 2~4초간 유지된다. Step별 권장 시간: INITIAL 3초, AI_INPUT 4초, AI_EXTRACT 4초, AI_APPLY 4초, COMPLETE 3초. 전체 루프는 16~22초이다. | Must | TASK-DASH-005 | TC-DASH-011 | 전체 시퀀스가 16초 이상 22초 이하로 완료됨 |
| REQ-DASH-012 | 시퀀스는 Step 5 완료 후 Step 1로 돌아가며 연속 루프 재생한다. | Must | TASK-DASH-005 | TC-DASH-012 | Step 5 이후 자동으로 Step 1으로 전환 |
| REQ-DASH-013 | 단계 전환은 Framer Motion 기반 cross-fade로 구현한다. 기존 motion.ts 패턴과 시각적 일관성을 유지한다. | Must | TASK-DASH-005, TASK-DASH-006 | TC-DASH-013 | 부드러운 opacity/위치 기반 전환. easeOut 이징 |

### 1-5. Step Indicator (Must)

| REQ ID | 요구사항 | 우선순위 | TASK ID | TC ID | 수용 기준 |
|--------|---------|---------|---------|-------|----------|
| REQ-DASH-014 | chrome 프레임 하단에 5단계 Step Indicator를 표시한다. 현재 활성 단계를 accent color로 구분한다. | Must | TASK-DASH-007 | TC-DASH-014 | 5개 dot이 렌더링되고 현재 단계만 강조됨 |
| REQ-DASH-015 | Step Indicator의 각 단계를 클릭하면 해당 단계로 즉시 이동한다. | Must | TASK-DASH-007 | TC-DASH-015 | 클릭 시 해당 단계가 즉시 표시됨 |
| REQ-DASH-016 | Step Indicator 클릭 시 자동 재생이 일시정지된다. 클릭 후 5초 동안 사용자 비활동 시 자동 재생이 재개된다. | Must | TASK-DASH-007 | TC-DASH-016 | 클릭 후 자동 재생 중단, 5초 비활동 후 재개 |

### 1-6. Interactions (Should)

| REQ ID | 요구사항 | 우선순위 | TASK ID | TC ID | 수용 기준 |
|--------|---------|---------|---------|-------|----------|
| REQ-DASH-017 | Preview 영역에 마우스 hover 시 자동 재생이 일시정지되고, 현재 단계가 강조 유지된다. | Should | TASK-DASH-008 | TC-DASH-017 | hover 진입 시 타이머 정지, 현재 단계 상태 유지 |
| REQ-DASH-018 | 마우스가 Preview 영역을 벗어난 후 2초 뒤 자동 재생이 재개된다. | Should | TASK-DASH-008 | TC-DASH-018 | mouseout 후 2초 지연 후 재개 |
| REQ-DASH-019 | Timeout 우선순위 규칙: Step Indicator 클릭(5초 timeout)과 hover 해제(2초 timeout)가 동시에 발생하는 경우, Step Indicator 클릭의 5초 timeout이 우선한다. | Should | TASK-DASH-008 | TC-DASH-019 | step 클릭 + 즉시 mouseout 시 5초 후 재개 (2초가 아님) |

### 1-7. Mock Data (Must)

| REQ ID | 요구사항 | 우선순위 | TASK ID | TC ID | 수용 기준 |
|--------|---------|---------|---------|-------|----------|
| REQ-DASH-020 | AI 입력 mock data로 카카오톡 스타일 메시지를 사용한다. | Must | TASK-DASH-002 | TC-DASH-020 | AI 입력 영역에 카카오톡 메시지가 표시됨 |
| REQ-DASH-021 | AI 추출 결과 mock data: 상차지("서울 강남구 물류센터"), 하차지("대전 유성구 산업단지"), 차량("카고 5톤"), 화물("파레트 적재 공산품 3파레트"), 옵션("직송, 지게차"), 운임(420,000원). | Must | TASK-DASH-002 | TC-DASH-021 | 4개 카테고리에 한국 운송 현실 데이터가 표시됨 |
| REQ-DASH-022 | 폼에 채워지는 값은 실제 OrderRegisterForm의 필드 구조를 반영한다. | Must | TASK-DASH-002 | TC-DASH-022 | 축소 뷰에서 OrderRegisterForm의 필드 구조가 인지됨 |

### 1-8. Responsive Design (Must)

| REQ ID | 요구사항 | 우선순위 | TASK ID | TC ID | 수용 기준 |
|--------|---------|---------|---------|-------|----------|
| REQ-DASH-023 | Desktop(>=1024px): chrome 프레임 내 OrderRegisterForm 축소 뷰 전체를 표시한다. | Must | TASK-DASH-009 | TC-DASH-023 | 1024px 이상에서 전체 축소 뷰가 렌더링됨 |
| REQ-DASH-024 | Tablet(768~1023px): chrome 프레임을 유지하되 AI 패널 + 폼 핵심 영역만 축약 표시한다. | Must | TASK-DASH-009 | TC-DASH-024 | 768~1023px에서 축약된 축소 뷰가 표시됨 |
| REQ-DASH-025 | Mobile(<768px): chrome 프레임 없이 AI 등록 과정의 핵심 장면만 보여주는 전용 카드 뷰를 표시한다. | Must | TASK-DASH-010 | TC-DASH-025 | 768px 미만에서 전용 카드 뷰 표시, 텍스트 가독성 유지 |
| REQ-DASH-026 | Mobile에서는 Step 3(AI_EXTRACT)과 Step 5(COMPLETE) 2단계만 자동 전환한다. | Must | TASK-DASH-010 | TC-DASH-026 | 모바일에서 2단계 자동 전환 |

### 1-9. Accessibility (Should)

| REQ ID | 요구사항 | 우선순위 | TASK ID | TC ID | 수용 기준 |
|--------|---------|---------|---------|-------|----------|
| REQ-DASH-027 | `prefers-reduced-motion` 감지 시 자동 재생을 비활성화하고 정적 최종 상태(Step 5 COMPLETE)를 표시한다. | Should | TASK-DASH-011 | TC-DASH-027 | reduced-motion 환경에서 정적 최종 상태 표시 |
| REQ-DASH-028 | DashboardPreview 컨테이너에 `aria-label="AI 화물 등록 워크플로우 데모 미리보기"`를 적용한다. | Should | TASK-DASH-011 | TC-DASH-028 | aria-label 속성 존재 |
| REQ-DASH-029 | Step Indicator가 키보드 Tab 탐색 + Enter/Space 활성화를 지원한다. | Should | TASK-DASH-011 | TC-DASH-029 | Tab 키 이동, Enter/Space 활성화 |

### 1-10. Performance (Must)

| REQ ID | 요구사항 | 우선순위 | TASK ID | TC ID | 수용 기준 |
|--------|---------|---------|---------|-------|----------|
| REQ-DASH-030 | Preview 관련 JavaScript 번들 기여가 30KB gzipped 이하이다. | Must | TASK-DASH-012 | TC-DASH-030 | gzipped 크기 30KB 미만 |
| REQ-DASH-031 | Preview는 heading/CTA 이후 `transition={{ delay: 0.6 }}` 시점에 등장하여 LCP에 영향을 주지 않는다. | Must | TASK-DASH-012 | TC-DASH-031 | LCP 차이 +100ms 미만 |
| REQ-DASH-032 | CSS 애니메이션(transform, opacity)을 우선 사용한다. JS 애니메이션은 숫자 카운팅에만 제한 사용한다. | Must | TASK-DASH-006, TASK-DASH-012 | TC-DASH-032 | CSS 전환 주 사용, JS는 금액 카운팅에만 |

---

## 2. Phase 2 — 인터랙티브 탐색 모드

### 2-1. 모드 전환 (Must)

| REQ ID | 요구사항 | 우선순위 | TASK ID | TC ID | 수용 기준 |
|--------|---------|---------|---------|-------|----------|
| REQ-DASH-033 | DashboardPreview는 시네마틱 모드(자동 재생)와 인터랙티브 모드(클릭 체험) 두 가지를 지원한다. 기본은 시네마틱 모드이다. | Must | TASK-DASH-016 | TC-DASH-033 | 기본 상태에서 자동 재생이 동작하고, 클릭 시 인터랙티브 모드로 전환됨 |
| REQ-DASH-034 | 축소 뷰 내부를 클릭하면 시네마틱 모드가 멈추고 인터랙티브 모드로 진입한다. Step Indicator의 hover/클릭(Phase 1)과 구분된다. | Must | TASK-DASH-016 | TC-DASH-034 | 축소 뷰 내부 클릭 → 자동 재생 중단 + 인터랙티브 모드 활성화 |
| REQ-DASH-035 | 인터랙티브 모드에서 10초 동안 사용자 비활동(hover/click 없음) 시 시네마틱 모드로 자동 복귀한다. | Must | TASK-DASH-016 | TC-DASH-035 | 10초 비활동 후 자동 재생 재개 |

### 2-2. 컴포넌트 하이라이트 — Hover (Must)

| REQ ID | 요구사항 | 우선순위 | TASK ID | TC ID | 수용 기준 |
|--------|---------|---------|---------|-------|----------|
| REQ-DASH-036 | 인터랙티브 모드에서 축소 뷰 위에 마우스를 이동하면, 현재 hover 중인 인터랙티브 영역에 accent 색상의 사각 테두리(아웃라인)가 표시된다. | Must | TASK-DASH-014 | TC-DASH-036 | hover 영역에 2px accent border가 즉시 표시됨 |
| REQ-DASH-037 | 인터랙티브 영역은 주요 컴포넌트 단위로 분할한다: AiInputArea, 추출하기 버튼, AiResultButtons 각 카테고리 그룹(4개), CargoInfoForm, LocationForm 상차지, LocationForm 하차지, TransportOptionCard, EstimateInfoCard. 총 11개 히트 영역. | Must | TASK-DASH-013 | TC-DASH-037 | 각 영역에 독립적으로 hover 아웃라인이 표시됨 |
| REQ-DASH-038 | hover 시 아웃라인과 함께 설명 툴팁이 표시된다. 툴팁은 축소 뷰 위에 원본 크기(14px)로 표시한다. | Must | TASK-DASH-014 | TC-DASH-038 | hover 시 읽을 수 있는 크기의 툴팁이 아웃라인 근처에 표시됨 |

### 2-3. 클릭 인터랙션 — Mock 기능 실행 (Must/Should)

| REQ ID | 요구사항 | 우선순위 | TASK ID | TC ID | 수용 기준 |
|--------|---------|---------|---------|-------|----------|
| REQ-DASH-039 | 인터랙티브 영역을 클릭하면 해당 컴포넌트의 mock 기능이 실행된다. 실제 DB/API 호출은 없다. | Must | TASK-DASH-015 | TC-DASH-039 | 클릭 시 mock 데이터 기반 시각 변화가 발생함 |
| REQ-DASH-040 | 클릭 시 mock 기능 매핑: (1) AiInputArea → 타이핑 효과 (2) 추출하기 → 로딩 스피너 후 버튼 생성 (3) AI 결과 버튼 → 폼 필드 채움 + 적용됨 전환 (4) TransportOption 토글 전환 (5) EstimateInfoCard → 금액 카운팅 | Must | TASK-DASH-015 | TC-DASH-040 | 각 영역 클릭 시 정의된 mock 기능이 시각적으로 실행됨 |
| REQ-DASH-041 | 클릭 순서에 권장 흐름이 있되 강제하지 않는다. 비순서 클릭 시에도 해당 컴포넌트의 mock 기능은 독립 실행된다. 단, 추출하기 미클릭 상태에서 AI 결과 버튼 클릭 시 반응 없음 (논리적 의존). | Should | TASK-DASH-015 | TC-DASH-041 | 아무 순서로 클릭해도 각 컴포넌트가 독립적으로 반응함. 논리적 의존 존중 |

### 2-4. 툴팁 콘텐츠 (Must)

| REQ ID | 요구사항 | 우선순위 | TASK ID | TC ID | 수용 기준 |
|--------|---------|---------|---------|-------|----------|
| REQ-DASH-042 | 각 인터랙티브 영역의 툴팁 텍스트를 `mock-data.ts`에서 관리한다. 컴포넌트 코드 수정 없이 툴팁 내용을 교체 가능하다. | Must | TASK-DASH-014 | TC-DASH-042 | mock-data.ts 수정으로 툴팁 텍스트 변경 가능 |

### 2-5. 히트 영역 구현 (Must/Should)

| REQ ID | 요구사항 | 우선순위 | TASK ID | TC ID | 수용 기준 |
|--------|---------|---------|---------|-------|----------|
| REQ-DASH-043 | 히트 영역은 축소 뷰 위에 투명 오버레이 레이어로 구현한다. 원본 크기 좌표를 scale 역변환하여 매핑한다. | Must | TASK-DASH-013 | TC-DASH-043 | 축소 뷰에서 정확한 영역 클릭 시 올바른 컴포넌트가 반응함 |
| REQ-DASH-044 | 히트 영역의 최소 크기는 원본 뷰 기준 44x44px 이상이다. | Should | TASK-DASH-013 | TC-DASH-044 | 축소 뷰에서 각 히트 영역이 최소 18x18px(scale 0.4 기준) 이상 |

### 2-6. Phase 2 반응형 (Must)

| REQ ID | 요구사항 | 우선순위 | TASK ID | TC ID | 수용 기준 |
|--------|---------|---------|---------|-------|----------|
| REQ-DASH-045 | Mobile(<768px)에서는 인터랙티브 모드를 비활성화한다. 터치 정밀도 한계로 히트 영역 조작이 불가능하기 때문이다. | Must | TASK-DASH-017 | TC-DASH-045 | 768px 미만에서 축소 뷰 내부 클릭/탭 시 인터랙티브 모드 미진입 |

---

## 3. 요구사항 요약 매트릭스

| Phase | 우선순위 | 개수 | ID 범위 |
|-------|---------|------|---------|
| Phase 1 | Must | 25개 | 001-003, 004-006, 007-008, 010-013, 014-016, 020-022, 023-026, 030-032 |
| Phase 1 | Should | 7개 | 009, 017-019, 027-029 |
| Phase 2 | Must | 11개 | 033-035, 036-038, 039-040, 042, 043, 045 |
| Phase 2 | Should | 2개 | 041, 044 |
| **합계** | | **45개** | |

---

## 4. TASK-DASH → REQ-DASH 역추적 매트릭스

| TASK ID | 관련 REQ |
|---------|---------|
| TASK-DASH-001 | REQ-DASH-001, 002, 003 |
| TASK-DASH-002 | REQ-DASH-020, 021, 022 |
| TASK-DASH-003 | REQ-DASH-004, 005, 006 |
| TASK-DASH-004 | REQ-DASH-007 |
| TASK-DASH-005 | REQ-DASH-008(상태 전환 로직), 010, 011, 012, 013(전환 타이밍) |
| TASK-DASH-006 | REQ-DASH-008(시각 애니메이션), 009, 013(전환 시각 효과), 032 |
| TASK-DASH-007 | REQ-DASH-014, 015, 016 |
| TASK-DASH-008 | REQ-DASH-017, 018, 019 |
| TASK-DASH-009 | REQ-DASH-023, 024 |
| TASK-DASH-010 | REQ-DASH-025, 026 |
| TASK-DASH-011 | REQ-DASH-027, 028, 029 |
| TASK-DASH-012 | REQ-DASH-030, 031, 032 |
| TASK-DASH-013 | REQ-DASH-037, 043, 044 |
| TASK-DASH-014 | REQ-DASH-036, 038, 042 |
| TASK-DASH-015 | REQ-DASH-039, 040, 041 |
| TASK-DASH-016 | REQ-DASH-033, 034, 035 |
| TASK-DASH-017 | REQ-DASH-045 |