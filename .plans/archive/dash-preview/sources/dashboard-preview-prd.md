# PRD: Dashboard Preview (Hero Interactive Demo)

> **Feature Slug**: `dash-preview`  
> **Status**: Approved  
> **Created**: 2026-04-14  
> **Revised**: 2026-04-14  
> **Scope**: `apps/landing/` Hero 영역  
> **요구사항 ID 체계**: `REQ-DASH-{NNN}`  
> **First-Pass 문서**: [`.plans/archive/optic-landing-page/improvements/2026-04-14-dashboard-preview-phase-1.md`](.plans/archive/optic-landing-page/improvements/2026-04-14-dashboard-preview-phase-1.md)

---

## 1. Overview

Dashboard Preview는 `apps/landing` Hero 영역의 placeholder(회색 박스)를 **AI 화물 등록 데모 영상**으로 교체하는 기능이다.

현재 Hero에는 다음 코드만 존재한다:

```tsx
// hero.tsx:62-64
<div className="rounded-2xl border border-gray-800 bg-gray-900/50 aspect-video flex items-center justify-center">
  <span className="text-gray-500 text-lg">Dashboard Preview</span>
</div>
```

이것을 OPTIC Broker의 **AI 화물 등록 워크플로우**를 시각적으로 재현하는 **시네마틱 축소 뷰**로 대체한다. 참조 화면은 **AI 화물 등록 페이지**(`.references/code/mm-broker/app/broker/order/ai-register/page.tsx`)의 **main 컨텐츠 영역**이다.

**핵심 접근**:
- **시네마틱 축소 뷰**: ai-register 페이지의 main 컨텐츠(AiPanel + OrderRegisterForm)를 축소하여 영상처럼 보여준다. Header, Breadcrumb, Sidebar 등 페이지 셸 요소는 제외하고 **순수 기능 영역만** 표시한다. 폰트와 컴포넌트가 모두 작아지며, 읽기 위한 UI가 아니라 **밀도와 느낌을 전달하는 비주얼**이다.
- **AI 등록 시나리오**: 카카오톡 메시지를 AI가 분석하여 자동으로 폼을 채워가는 과정을 보여준다. "AI가 복잡한 운송 업무를 빠르게 처리한다"는 메시지를 전달한다.
- **레이아웃 보존**: 현재 Hero의 중앙 정렬 단일 컬럼 구조를 유지하고, placeholder 위치에만 Preview를 삽입한다.
- **참조 구조**: ai-register 페이지의 main은 `<div class="flex flex-col md:flex-row h-full">` 안에 좌측 AiPanel(380px) + 우측 OrderRegisterForm(flex-1)로 구성된다. chrome 프레임이 페이지 셸 역할을 대신하므로 내부에는 이 기능 영역만 축소 표시한다.

**범위**: `apps/landing` Hero 섹션 내 placeholder 교체로 한정. headline, subtitle, CTA 등 기존 구성 요소는 변경하지 않는다.

**Phase 구분**:
- **Phase 1 (시네마틱 뷰)**: 자동 재생 데모. AI 등록 과정이 영상처럼 자동으로 재생된다. 사용자 개입은 step indicator 클릭/hover 수준으로 제한.
- **Phase 2 (인터랙티브 탐색)**: 클릭 체험 모드. 사용자가 축소 뷰 위의 컴포넌트를 직접 hover/클릭하여 AI 등록 과정을 단계별로 체험한다. hover 시 컴포넌트 하이라이트 + 설명 툴팁, 클릭 시 mock 기능 실행.

---

## 2. Problem Statement

### 2-1. 현재 상태 문제점

| # | 항목 | 현재 상태 | 문제 | 코드 증거 |
|---|------|----------|------|----------|
| 1 | 제품 이해 | Hero가 텍스트("운송 운영을 한눈에", "오더부터 정산까지") 중심 | 실제로 무엇을 하는 제품인지 한눈에 와닿지 않음. 운송 SaaS의 작동 방식을 텍스트만으로 전달하기에 한계 | `hero.tsx:19` -- h1, `hero.tsx:28` -- p |
| 2 | 시각 설득력 | Dashboard 영역이 placeholder 수준 (회색 박스 + "Dashboard Preview" 텍스트) | 랜딩 핵심 비주얼로서 존재감이 없음. 첫 화면에서 시각적 앵커 부재 | `hero.tsx:62-64` -- bg-gray-900/50 빈 div |
| 3 | 업무 신뢰감 | 도메인 특화 시각 요소 전무 | 운송 SaaS 특유의 현실감(주소, 차량, 운임, 상태 배지)이 전혀 드러나지 않아 잠재 고객이 업무 적합성을 즉시 판단할 수 없음 | `constants.ts` -- FEATURES 배열이 텍스트 설명만 포함 |
| 4 | 기능 전달 방식 | Features 섹션(`features.tsx`)에서 아이콘+텍스트 카드로 설명 | 입력 -> 정리 -> 요약 흐름이 시각적으로 보이지 않음 | `features.tsx:39-40` -- 텍스트 description만 |
| 5 | AI 차별화 부재 | AI 기능이 `constants.ts`의 텍스트 설명("AI 운임 추천")으로만 전달 | OPTIC의 핵심 경쟁력인 AI 자동화가 시각적으로 증명되지 않음. 경쟁사와 차별화 실패 | `constants.ts` -- FEATURES[4] AI 항목, 텍스트 only |
| 6 | CTA 연결 | "데모 보기" 버튼이 `href="#"`으로 연결 | 실질적 데모가 없어 CTA가 사실상 비활성 | `hero.tsx:46` -- `href="#"` |

### 2-2. 문제 요약

현재 Hero는 **"무슨 제품인가"는 설명하지만 "어떻게 작동하고 어떤 느낌인가"는 전달하지 못하는 상태**다. 특히 AI 자동 화물 등록이라는 핵심 차별화 포인트가 텍스트 한 줄로만 전달되고 있어, 방문자가 AI의 실질적 가치를 체감할 수 없다.

---

## 3. Goals & Non-Goals

### Goals

**Phase 1 Goals (시네마틱 뷰):**

| ID | 목표 | 설명 | 측정 가능한 기준 |
|----|------|------|----------------|
| G1 | 첫 화면 제품 이해 | 방문자가 페이지 로드 후 5초 내에 "AI로 운송 주문을 관리하는 SaaS 제품"이라는 카테고리를 인지 | 사용자 테스트에서 5초 내 제품 카테고리 인지율 70%+ |
| G2 | AI Workflow 데모 | AI가 카톡 메시지 하나로 화물 등록 폼을 자동 채우는 과정을 시네마틱 축소 뷰로 전달 | 5단계 시퀀스가 16~22초 내 완전한 루프를 수행 |
| G3 | 전문성 신뢰 | 실제 OrderRegisterForm을 축소한 시네마틱 뷰로 업무용 SaaS의 정보 밀도와 완성도를 전달 | 이해관계자 리뷰에서 "실제 제품 같다" 4/5점+ |
| G4 | CTA 증폭 | Preview가 도입 문의/데모 보기 버튼으로 관심을 연결하는 시각적 트리거 역할 | Hero 영역 CTA 클릭률 현재 대비 15%+ 증가 |
| G5 | 성능 유지 | Preview 추가로 인한 LCP 영향 최소화, JS 번들 기여 30KB gzipped 이하 | Lighthouse LCP +100ms 미만, 번들 <30KB gzipped |
| G6 | 유지보수성 | mock data, step 구성, 카피를 컴포넌트 코드 수정 없이 교체 가능 | mock-data.ts 파일만 편집하면 데모 내용이 바뀌는 구조 |

**Phase 2 Goals (인터랙티브 탐색):**

| ID | 목표 | 설명 | 측정 가능한 기준 |
|----|------|------|----------------|
| G7 | 체험형 데모 | 방문자가 직접 클릭하여 AI 등록 과정을 단계별로 체험. "보는 것"에서 "해보는 것"으로 전환 | 인터랙티브 모드 진입율 20%+ (hover 후 클릭한 사용자 비율) |
| G8 | 기능별 이해 | 각 컴포넌트의 역할과 가치를 hover 시 설명 툴팁으로 전달 | 사용자 테스트에서 3개 이상 컴포넌트 hover 비율 50%+ |
| G9 | 체류 시간 증가 | 인터랙티브 탐색으로 Hero 영역 체류 시간 증가 → CTA 전환 확대 | Hero 평균 체류 시간 Phase 1 대비 30%+ 증가 |

### Non-Goals

| ID | 비목표 | 이유 |
|----|--------|------|
| NG1 | 실제 DB/API 연동 | 모든 인터랙션은 mock data 기반. `output: 'export'` 정적 빌드 유지 |
| NG2 | 다중 시나리오 지원 | Phase 1/2 모두 "AI 화물 등록" 시나리오 1개만 |
| NG3 | 제품 전환 (Broker/Shipper/Carrier 탭) | 단일 화면만 다룸 |
| NG4 | 실제 제품 UI 완전 복제 | 구조감과 밀도만 차용, 운영 복잡도 제거 |
| NG5 | 다국어 지원 | 한국어 단일 언어 |
| NG6 | 실제 텍스트 입력 | Phase 2에서도 사용자가 직접 텍스트를 타이핑하는 것은 범위 밖. 클릭 시 mock data가 채워지는 방식 |

---

## 4. User Stories

### 4-1. 방문자 (Primary Persona)

| ID | 역할 | 스토리 | 수용 기준 |
|----|------|--------|----------|
| US-01 | 잠재 고객 | As a 잠재 고객, I want Hero에서 AI가 화물 등록을 자동으로 처리하는 모습을 보고 싶다, so that 이 제품이 AI로 업무를 자동화하는 SaaS임을 즉시 이해할 수 있다 | Hero 진입 시 AI 등록 데모가 자동 재생됨 |
| US-02 | 물류 운영 관리자 | As a 물류 운영 관리자, I want 실제 업무 화면과 유사한 축소 뷰에서 한국 운송 데이터가 채워지는 모습을 보고 싶다, so that 내 업종에 맞는 제품임을 직감할 수 있다 | OrderRegisterForm 축소 뷰에 한국 운송 데이터가 사용됨 |
| US-03 | 바쁜 의사결정자 | As a 바쁜 의사결정자, I want 별도 조작 없이 자동 재생되는 영상 같은 데모를 보고 싶다, so that 스크롤하면서 자연스럽게 AI 가치를 흡수할 수 있다 | 자동 재생이 사용자 개입 없이 시작되고 연속 루프됨 |
| US-04 | 관심 있는 방문자 | As a 관심 있는 방문자, I want 특정 단계를 hover/클릭으로 탐색하고 싶다, so that AI 등록 과정을 내 페이스로 이해할 수 있다 | step indicator 클릭으로 특정 단계 이동 가능 |
| US-05 | 모바일 사용자 | As a 모바일 사용자, I want 작은 화면에서도 AI 등록의 핵심 장면을 보고 싶다, so that 데스크톱 없이도 제품을 이해할 수 있다 | 모바일에서 전용 요약 뷰가 표시됨 |

### 4-2. 마케팅팀 (Secondary Persona)

| ID | 역할 | 스토리 | 수용 기준 |
|----|------|--------|----------|
| US-06 | 마케팅 담당자 | As a 마케팅 담당자, I want 컴포넌트 코드 수정 없이 mock data를 교체하고 싶다, so that 실제 비즈니스 사례로 데모를 업데이트할 수 있다 | mock-data.ts 파일만 수정하면 Preview 내 모든 값이 반영됨 |
| US-07 | 마케팅 담당자 | As a 마케팅 담당자, I want Preview가 실제 업무 화면의 축소판처럼 보이길 원한다, so that 엔터프라이즈 고객의 신뢰를 얻을 수 있다 | OrderRegisterForm의 3열 그리드 + AI 패널이 축소 뷰로 표현됨 |

### 4-3. 개발팀 (Secondary Persona)

| ID | 역할 | 스토리 | 수용 기준 |
|----|------|--------|----------|
| US-08 | 개발자 | As a 개발자, I want Dashboard Preview가 독립적 컴포넌트 트리이길 원한다, so that 랜딩 페이지 나머지와 별도로 유지보수할 수 있다 | `components/dashboard-preview/` 디렉토리에 자체 완결된 컴포넌트 트리 |
| US-09 | 개발자 | As a 개발자, I want 애니메이션 상태 머신이 선언적이고 테스트 가능하길 원한다, so that 시각 테스트 없이 단계 전환을 검증할 수 있다 | step 전환 로직이 순수 함수/훅으로 분리, Vitest 단위 테스트 가능 |
| US-10 | 개발자 | As a 개발자, I want 번들 크기가 예산 내이길 원한다, so that Core Web Vitals를 해치지 않기 위해 | Preview 관련 JS 번들 기여 <30KB gzipped |

---

## 5. Functional Requirements

### 5-1. Container & Chrome

| ID | 요구사항 | 우선순위 | 수용 기준 |
|----|---------|---------|----------|
| REQ-DASH-001 | DashboardPreview 컴포넌트는 브라우저/앱 스타일 chrome 프레임을 표시한다. 창 제어 점 3개, 타이틀 바("OPTIC Broker"), border(border-gray-800)와 배경(bg-gray-900/50)을 포함한다. | Must | chrome 프레임이 렌더링되고, "OPTIC Broker" 타이틀이 표시됨 |
| REQ-DASH-002 | chrome 프레임 내부 전체를 **축소 스케일(~40~50% 크기)**로 표시한다. 폰트, 컴포넌트, 간격 모두 축소되어 영상 녹화물처럼 보인다. 읽기 위한 UI가 아니라 밀도와 느낌을 전달하는 시네마틱 뷰이다. | Must | 내부 콘텐츠가 축소되어 표시됨. 일반 텍스트가 6~8px 수준으로 보임 |
| REQ-DASH-003 | chrome 프레임 내부에는 ai-register 페이지의 **main 컨텐츠 영역만** 재현한다. Header, Breadcrumb, Sidebar 등 페이지 셸 요소는 **제외**한다. 내부 구조: 좌측 AiPanel(380px 비율) + 우측 OrderRegisterForm(flex-1)의 2열 레이아웃. 참조: `ai-register/page.tsx`의 `<main>` 내부 `flex flex-col md:flex-row` 컨테이너. | Must | chrome 내부에 AiPanel + Form 2열 구조만 축소 렌더링됨. header/breadcrumb 없음 |

### 5-2. AI Panel (좌측 사이드바)

참조: `.references/code/mm-broker/app/broker/order/ai-register/_components/ai-panel.tsx` 및 하위 컴포넌트

| ID | 요구사항 | 우선순위 | 수용 기준 |
|----|---------|---------|----------|
| REQ-DASH-004 | AiPanel 영역이 좌측 사이드바로 표시된다. 실제 ai-register 페이지의 AiPanel 구조(380px, border-r, flex-col)를 축소 재현한다. 확장 상태(expanded)로 고정 표시한다. | Must | 축소 뷰 내 좌측에 AiPanel 사이드바가 보임 |
| REQ-DASH-005 | AiPanel 내부에 AiInputArea를 재현한다: 텍스트 탭이 활성화된 상태의 textarea 영역 + "추출하기" 버튼. Step 2에서 카카오톡 메시지가 타이핑 효과로 입력된다. 참조: `ai-input-area.tsx`의 textarea + 추출 버튼 구조. | Must | Step 2에서 textarea에 메시지 텍스트가 타이핑 효과로 등장하고, "추출하기" 버튼이 보임 |
| REQ-DASH-006 | AiPanel 하단에 AiResultButtons를 재현한다: 4개 카테고리(상차지/MapPin, 하차지/Flag, 화물·차량/Package, 운임/Banknote)의 버튼 그룹. 각 버튼은 라벨 + 값 + 상태 아이콘으로 구성. 참조: `ai-result-buttons.tsx` + `ai-button-item.tsx`의 카테고리 그룹 구조. | Must | Step 3에서 4개 카테고리의 버튼이 "대기"(파랑) 상태로 stagger 등장 |

### 5-3. Form Panel (OrderRegisterForm 축소 뷰)

참조: `.references/code/mm-broker/app/broker/order/ai-register/_components/register-form.tsx` 및 하위 컴포넌트

| ID | 요구사항 | 우선순위 | 수용 기준 |
|----|---------|---------|----------|
| REQ-DASH-007 | OrderRegisterForm의 스크롤 가능한 폼 영역을 축소 재현한다. 실제 구조: CargoInfoForm(차량/중량/화물명) + LocationForm x2(상차지/하차지 주소·연락처·일시) + TransportOptionCard(옵션 토글) + EstimateInfoCard(거리/금액). 각 섹션은 Card 형태로 시각적 구분. 참조: `register-form.tsx`의 폼 섹션 순서. | Must | Form 영역에 여러 Card 블록이 세로로 나열된 축소 뷰가 인지됨 |
| REQ-DASH-008 | AI 적용 단계(Step 4)에서 AiResultButtons의 각 버튼이 "적용됨"(초록) 상태로 전환되면서, 대응하는 폼 필드(LocationForm 주소, CargoInfoForm 차량/화물, EstimateInfoCard 금액)가 순차적으로 채워진다. | Must | 버튼 색상 전환(파랑→초록)과 동시에 해당 폼 Card 내 필드에 값이 등장 |
| REQ-DASH-009 | 운임 금액이 EstimateInfoCard에 표시될 때 숫자 카운팅 애니메이션을 적용한다. | Should | 금액 전환 시 0.5~1초 동안 숫자가 점진적으로 변화 |

### 5-4. Auto-Play Sequence

| ID | 요구사항 | 우선순위 | 수용 기준 |
|----|---------|---------|----------|
| REQ-DASH-010 | 5단계 스크립트 시퀀스를 자동 재생한다: (1) INITIAL -- 빈 폼 + AI 패널 (2) AI_INPUT -- 카톡 메시지 입력 (3) AI_EXTRACT -- AI 분석 + 결과 버튼 생성 (4) AI_APPLY -- 버튼 순차 적용 + 폼 자동 채움 (5) COMPLETE -- 등록 완료 상태 | Must | 5개 단계가 순서대로 전환되며 AI 등록 과정이 시각적으로 재현됨 |
| REQ-DASH-011 | 각 단계는 2~4초간 유지된다. Step별 권장 시간: INITIAL 3초, AI_INPUT 4초, AI_EXTRACT 4초, AI_APPLY 4초, COMPLETE 3초. 전체 루프는 16~22초이다. | Must | 전체 시퀀스가 16초 이상 22초 이하로 완료됨 |
| REQ-DASH-012 | 시퀀스는 Step 5 완료 후 Step 1로 돌아가며 연속 루프 재생한다. | Must | Step 5 이후 자동으로 Step 1으로 전환 |
| REQ-DASH-013 | 단계 전환은 Framer Motion 기반 cross-fade로 구현한다. 기존 `motion.ts` 패턴과 시각적 일관성을 유지한다. | Must | 부드러운 opacity/위치 기반 전환. easeOut 이징 |

### 5-5. Step Indicator

| ID | 요구사항 | 우선순위 | 수용 기준 |
|----|---------|---------|----------|
| REQ-DASH-014 | chrome 프레임 하단에 5단계 Step Indicator를 표시한다. 현재 활성 단계를 accent color로 구분한다. | Must | 5개 dot이 렌더링되고 현재 단계만 강조됨 |
| REQ-DASH-015 | Step Indicator의 각 단계를 클릭하면 해당 단계로 즉시 이동한다. | Must | 클릭 시 해당 단계가 즉시 표시됨 |
| REQ-DASH-016 | Step Indicator 클릭 시 자동 재생이 일시정지된다. 클릭 후 5초 동안 사용자 비활동 시 자동 재생이 재개된다. | Must | 클릭 후 자동 재생 중단, 5초 비활동 후 재개 |

### 5-6. Interactions

| ID | 요구사항 | 우선순위 | 수용 기준 |
|----|---------|---------|----------|
| REQ-DASH-017 | Preview 영역에 마우스 hover 시 자동 재생이 일시정지되고, 현재 단계가 강조 유지된다. | Should | hover 진입 시 타이머 정지, 현재 단계 상태 유지 |
| REQ-DASH-018 | 마우스가 Preview 영역을 벗어난 후 2초 뒤 자동 재생이 재개된다. | Should | mouseout 후 2초 지연 후 재개 |
| REQ-DASH-019 | **Timeout 우선순위 규칙**: Step Indicator 클릭(5초 timeout, REQ-DASH-016)과 hover 해제(2초 timeout, REQ-DASH-018)가 동시에 발생하는 경우, **Step Indicator 클릭의 5초 timeout이 우선**한다. 즉, step 클릭 후 즉시 mouseout해도 5초 후에 재개된다. | Should | step 클릭 + 즉시 mouseout 시 5초 후 재개 (2초가 아님) |

### 5-7. Mock Data

| ID | 요구사항 | 우선순위 | 수용 기준 |
|----|---------|---------|----------|
| REQ-DASH-020 | AI 입력 mock data로 카카오톡 스타일 메시지를 사용한다. 예: "서울 강남구 물류센터에서 대전 유성구 산업단지로 5톤 카고 파레트 공산품 3파레트 보내주세요. 내일 오전 9시 상차, 직송 지게차 필요합니다." | Must | AI 입력 영역에 카카오톡 메시지가 표시됨 |
| REQ-DASH-021 | AI 추출 결과 mock data: 상차지("서울 강남구 물류센터"), 하차지("대전 유성구 산업단지"), 차량("카고 5톤"), 화물("파레트 적재 공산품 3파레트"), 옵션("직송, 지게차"), 운임(420,000원). | Must | 4개 카테고리에 한국 운송 현실 데이터가 표시됨 |
| REQ-DASH-022 | 폼에 채워지는 값은 실제 OrderRegisterForm의 필드 구조를 반영한다: 상차지 주소, 하차지 주소, 상차 일시, 하차 일시, 차량 타입, 중량, 화물명, 운송 옵션 토글, 정산 금액. | Must | 축소 뷰에서 OrderRegisterForm의 필드 구조가 인지됨 |

### 5-8. Responsive Design

| ID | 요구사항 | 우선순위 | 수용 기준 |
|----|---------|---------|----------|
| REQ-DASH-023 | Desktop(>=1024px): chrome 프레임 내 OrderRegisterForm 축소 뷰(3열 + AI 패널) 전체를 표시한다. | Must | 1024px 이상에서 전체 축소 뷰가 렌더링됨 |
| REQ-DASH-024 | Tablet(768~1023px): chrome 프레임을 유지하되 AI 패널 + 폼 핵심 영역만 축약 표시한다. | Must | 768~1023px에서 축약된 축소 뷰가 표시됨 |
| REQ-DASH-025 | Mobile(<768px): chrome 프레임 없이 AI 등록 과정의 핵심 장면만 보여주는 전용 카드 뷰를 표시한다. 데스크톱 축소판이 아닌 별도 레이아웃이다. | Must | 768px 미만에서 전용 카드 뷰 표시, 텍스트 가독성 유지 |
| REQ-DASH-026 | Mobile에서는 Step 3(AI_EXTRACT)과 Step 5(COMPLETE) 2단계만 자동 전환한다. AI가 분석하고 → 폼이 완성되는 핵심 대비만 보여준다. | Must | 모바일에서 2단계 자동 전환 |

### 5-9. Accessibility

| ID | 요구사항 | 우선순위 | 수용 기준 |
|----|---------|---------|----------|
| REQ-DASH-027 | `prefers-reduced-motion` 감지 시 자동 재생을 비활성화하고 정적 최종 상태(Step 5 COMPLETE)를 표시한다. | Should | reduced-motion 환경에서 정적 최종 상태 표시 |
| REQ-DASH-028 | DashboardPreview 컨테이너에 `aria-label="AI 화물 등록 워크플로우 데모 미리보기"`를 적용한다. | Should | aria-label 속성 존재 |
| REQ-DASH-029 | Step Indicator가 키보드 Tab 탐색 + Enter/Space 활성화를 지원한다. | Should | Tab 키 이동, Enter/Space 활성화 |

### 5-10. Performance

| ID | 요구사항 | 우선순위 | 수용 기준 |
|----|---------|---------|----------|
| REQ-DASH-030 | Preview 관련 JavaScript 번들 기여가 30KB gzipped 이하이다. | Must | gzipped 크기 30KB 미만 |
| REQ-DASH-031 | Preview는 heading/CTA 이후 `transition={{ delay: 0.6 }}` 시점에 등장하여 LCP에 영향을 주지 않는다. | Must | LCP 차이 +100ms 미만 |
| REQ-DASH-032 | CSS 애니메이션(transform, opacity)을 우선 사용한다. JS 애니메이션은 숫자 카운팅에만 제한 사용한다. | Must | CSS 전환 주 사용, JS는 금액 카운팅에만 |

### 5-11. Phase 2 — 인터랙티브 탐색 모드

> Phase 1(시네마틱 뷰) 완료 후 구현한다. Phase 1의 축소 뷰 인프라 위에 인터랙티브 레이어를 추가한다.

#### 5-11-1. 모드 전환

| ID | 요구사항 | 우선순위 | 수용 기준 |
|----|---------|---------|----------|
| REQ-DASH-033 | DashboardPreview는 두 가지 모드를 지원한다: **시네마틱 모드**(자동 재생, Phase 1)와 **인터랙티브 모드**(클릭 체험, Phase 2). 기본은 시네마틱 모드이다. | Must | 기본 상태에서 자동 재생이 동작하고, 클릭 시 인터랙티브 모드로 전환됨 |
| REQ-DASH-034 | 축소 뷰 내부를 **클릭**하면 시네마틱 모드가 멈추고 인터랙티브 모드로 진입한다. Step Indicator의 hover/클릭(Phase 1)과 구분되어, 축소 뷰 **내부 컴포넌트** 클릭이 인터랙티브 모드 트리거이다. | Must | 축소 뷰 내부 클릭 → 자동 재생 중단 + 인터랙티브 모드 활성화 |
| REQ-DASH-035 | 인터랙티브 모드에서 **10초 동안 사용자 비활동**(hover/click 없음) 시 시네마틱 모드로 자동 복귀한다. | Must | 10초 비활동 후 자동 재생 재개 |

#### 5-11-2. 컴포넌트 하이라이트 (Hover)

| ID | 요구사항 | 우선순위 | 수용 기준 |
|----|---------|---------|----------|
| REQ-DASH-036 | 인터랙티브 모드에서 축소 뷰 위에 마우스를 이동하면, 현재 hover 중인 **인터랙티브 영역**에 accent 색상의 사각 테두리(아웃라인)가 표시된다. | Must | hover 영역에 2px accent border가 즉시 표시됨 |
| REQ-DASH-037 | 인터랙티브 영역은 주요 컴포넌트 단위로 분할한다: (1) AiInputArea (2) "추출하기" 버튼 (3) AiResultButtons 각 카테고리 그룹(상차지/하차지/화물/운임) (4) CargoInfoForm 영역 (5) LocationForm 상차지 (6) LocationForm 하차지 (7) TransportOptionCard (8) EstimateInfoCard. 총 8~11개 히트 영역. (DEC-008에 의해 범위 확장) | Must | 각 영역에 독립적으로 hover 아웃라인이 표시됨 |
| REQ-DASH-038 | hover 시 아웃라인과 함께 **설명 툴팁**이 표시된다. 툴팁은 해당 컴포넌트의 기능을 1줄로 설명한다. 툴팁은 축소 뷰 위에 **원본 크기**(읽을 수 있는 크기)로 표시한다. | Must | hover 시 읽을 수 있는 크기의 툴팁이 아웃라인 근처에 표시됨 |

#### 5-11-3. 클릭 인터랙션 (Mock 기능 실행)

| ID | 요구사항 | 우선순위 | 수용 기준 |
|----|---------|---------|----------|
| REQ-DASH-039 | 인터랙티브 영역을 클릭하면 해당 컴포넌트의 **mock 기능이 실행**된다. 모든 데이터는 mock-data.ts의 사전 정의 데이터를 사용하며, 실제 DB/API 호출은 없다. | Must | 클릭 시 mock 데이터 기반 시각 변화가 발생함 |
| REQ-DASH-040 | 클릭 시 mock 기능 매핑: (1) AiInputArea 클릭 → 카톡 메시지 자동 입력(타이핑 효과) (2) "추출하기" 버튼 클릭 → 로딩 스피너 후 AI 결과 버튼 생성 (3) AI 결과 버튼(카테고리) 클릭 → 해당 폼 필드에 값 채움 + 버튼 "적용됨"(초록) 전환 (4) TransportOption 토글 클릭 → 옵션 활성/비활성 전환 (5) EstimateInfoCard 클릭 → 금액 카운팅 애니메이션 | Must | 각 영역 클릭 시 정의된 mock 기능이 시각적으로 실행됨 |
| REQ-DASH-041 | 클릭 순서에 **권장 흐름**이 있되 강제하지 않는다. 권장: AiInputArea → 추출하기 → AI 버튼들 → 옵션. 비순서 클릭 시에도 해당 컴포넌트의 mock 기능은 독립 실행된다. | Should | 아무 순서로 클릭해도 각 컴포넌트가 독립적으로 반응함 |

#### 5-11-4. 툴팁 콘텐츠

| ID | 요구사항 | 우선순위 | 수용 기준 |
|----|---------|---------|----------|
| REQ-DASH-042 | 각 인터랙티브 영역의 툴팁 텍스트를 `mock-data.ts`에서 관리한다. 컴포넌트 코드 수정 없이 툴팁 내용을 교체 가능하다. | Must | mock-data.ts 수정으로 툴팁 텍스트 변경 가능 |

**권장 툴팁 내용:**

| 영역 | 툴팁 텍스트 (예시) |
|------|-----------------|
| AiInputArea | "카카오톡 메시지를 붙여넣으면 AI가 자동으로 분석합니다" |
| 추출하기 버튼 | "클릭 한 번으로 메시지에서 운송 정보를 추출합니다" |
| AI 결과 - 상차지 | "AI가 추출한 상차지 정보를 폼에 자동 적용합니다" |
| AI 결과 - 하차지 | "AI가 추출한 하차지 정보를 폼에 자동 적용합니다" |
| AI 결과 - 화물/차량 | "차량 종류와 화물 정보를 자동으로 입력합니다" |
| AI 결과 - 운임 | "예상 운임을 자동 계산하여 반영합니다" |
| CargoInfoForm | "차량 타입, 중량, 화물 종류를 한 화면에서 관리합니다" |
| LocationForm 상차지 | "상차지 주소, 담당자, 연락처를 입력합니다" |
| LocationForm 하차지 | "하차지 주소, 담당자, 연락처를 입력합니다" |
| TransportOptionCard | "직송, 지게차 등 운송 옵션을 선택합니다" |
| EstimateInfoCard | "거리와 예상 운임이 자동 계산됩니다" |

#### 5-11-5. Phase 2 히트 영역 구현

| ID | 요구사항 | 우선순위 | 수용 기준 |
|----|---------|---------|----------|
| REQ-DASH-043 | 히트 영역은 축소 뷰 위에 **투명 오버레이 레이어**로 구현한다. 축소된 컴포넌트를 직접 클릭하는 것이 아니라, 원본 크기 좌표를 scale 역변환하여 매핑한다. | Must | 축소 뷰에서 정확한 영역 클릭 시 올바른 컴포넌트가 반응함 |
| REQ-DASH-044 | 히트 영역의 최소 크기는 원본 뷰 기준 44x44px 이상이다. 축소 후에도 탭/클릭 가능한 크기를 보장한다. | Should | 축소 뷰에서 각 히트 영역이 최소 18x18px(scale 0.4 기준) 이상 |

#### 5-11-6. Phase 2 반응형

| ID | 요구사항 | 우선순위 | 수용 기준 |
|----|---------|---------|----------|
| REQ-DASH-045 | Mobile(<768px)에서는 인터랙티브 모드를 **비활성화**한다. 축소 뷰 내부 클릭 시 인터랙티브 모드로 진입하지 않는다. 터치 정밀도 한계로 히트 영역 조작이 불가능하기 때문이다. | Must | 768px 미만에서 축소 뷰 내부 클릭/탭 시 인터랙티브 모드 미진입. 시네마틱 모드만 유지 |
| REQ-DASH-046 | Tablet(768~1023px)에서는 히트 영역을 **축약**한다. Desktop 전체 11개 중 다음 **6개 핵심 영역**만 유지: (1) AiInputArea (2) "추출하기" 버튼 (3) AiResult 4개 카테고리(상차지/하차지/화물·차량/운임) — 단, 화물·차량과 운임은 단일 영역으로 병합하지 않고 개별 유지. Form 영역 히트 영역(CargoInfo/Location x2/TransportOptions/Estimate)은 축소된 밀도에서 클릭 정밀도가 낮아 Tablet에서는 제외. | Must | Tablet에서 6개 히트 영역만 활성화됨. Form 영역 클릭 시 인터랙티브 반응 없음 |
| REQ-DASH-047 | Tablet 히트 영역의 최소 크기는 scaleFactor 0.38 기준 **16x16px 이상**이다. Desktop(scale 0.45) 최소 18x18px보다 작으므로 간격/패딩을 조정하여 오탭 방지. | Should | Tablet에서 각 히트 영역이 최소 16x16px 확보됨 |

#### 5-11-7. Phase 2 접근성 (키보드)

| ID | 요구사항 | 우선순위 | 수용 기준 |
|----|---------|---------|----------|
| REQ-DASH-048 | 인터랙티브 모드에서 히트 영역은 **Tab 키로 순차 탐색** 가능하다. 각 히트 영역은 `role="button"` + `tabIndex={0}` + `aria-label` 속성을 가진다. 탐색 순서: AiInputArea → 추출하기 → AI 결과 버튼(상차지→하차지→화물→운임) → Form Card(Phase 2에서는 hover 대상만, 클릭 Enter 시 해당 영역의 툴팁 표시). | Must | Tab 키로 히트 영역 순차 포커스, Shift+Tab으로 역방향 탐색 가능 |
| REQ-DASH-049 | 히트 영역이 **키보드 포커스**를 받으면 hover와 동일한 accent 아웃라인 + 툴팁이 표시된다. 포커스 이동 시 이전 영역의 하이라이트/툴팁 해제. | Must | Tab으로 이동 시 accent 아웃라인 + 툴팁 즉시 표시 |
| REQ-DASH-050 | **Enter 키** 또는 **Space 키**로 포커스된 히트 영역의 mock 기능 실행(REQ-DASH-040 매핑과 동일). 마우스 클릭과 동등한 동작. | Must | Tab 포커스 후 Enter/Space 키 → 대응 mock 기능 실행 |
| REQ-DASH-051 | **Escape 키**로 인터랙티브 모드를 즉시 종료하고 시네마틱 모드로 복귀한다. 10초 비활동 대기 없이 즉시 전환. | Should | Escape 키 → 즉시 cinematic 모드 복귀 |
| REQ-DASH-052 | StepIndicator Arrow Left/Right 키 내비게이션(REQ-DASH-029 확장)은 인터랙티브 모드에서도 동작한다. 단, Arrow 키 동작 시 인터랙티브 모드는 유지(시네마틱 전환 없음). | Should | 인터랙티브 모드에서 ArrowLeft/Right 시 step 이동 + 모드 유지 |

### 5-12. 요구사항 요약 매트릭스

| Phase | 우선순위 | 개수 | 카테고리별 |
|-------|---------|------|----------|
| Phase 1 | Must | 25개 | Container(001-003), AI Panel(004-006), Form(007-008), Auto-Play(010-013), Step Indicator(014-016), Mock Data(020-022), Responsive(023-026), Performance(030-032) |
| Phase 1 | Should | 7개 | Form(009), Interactions(017-019), Accessibility(027-029) |
| Phase 2 | Must | 15개 | Mode Switch(033-035), Highlight(036-038), Click(039-040), Tooltip(042), Hit Area(043), Responsive(045-046), A11y(048-050) |
| Phase 2 | Should | 5개 | Click(041), Hit Area(044), Responsive(047), A11y(051-052) |

---

## 6. UX Requirements

### 6-1. Hero 레이아웃 (현재 구조 유지)

현재 Hero는 **중앙 정렬 단일 컬럼 구조**이다. 이 구조를 변경하지 않는다. DashboardPreview는 기존 placeholder 위치에만 삽입한다.

```
┌──────────────────────────────────────────┐
│  Hero Section (중앙 정렬, 단일 컬럼)       │
│                                          │
│          h1: "운송 운영을 한눈에"           │
│     p: "오더부터 정산까지, 하나의 플랫폼"    │
│                                          │
│    [도입 문의하기]  [데모 보기]              │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │    DashboardPreview               │    │
│  │    (기존 placeholder 교체)          │    │
│  │                                    │    │
│  │  ┌── chrome frame ────────────────┐  │    │
│  │  │ ● ● ●  OPTIC Broker           │  │    │
│  │  │ ┌─AiPanel──┐┌── Form ───────┐ │  │    │
│  │  │ │ [텍스트]  ││ CargoInfo     │ │  │    │
│  │  │ │ 카톡 메시 ││ Location x2   │ │  │    │
│  │  │ │ 지 입력   ││ DateTime x2   │ │  │    │
│  │  │ │ [추출하기]││ Options       │ │  │    │
│  │  │ │          ││ Estimate      │ │  │    │
│  │  │ │ 버튼 그룹 ││              │ │  │    │
│  │  │ └──────────┘└──────────────┘ │  │    │
│  │  │   ● ● ● ● ●  (Steps)        │  │    │
│  │  └────────────────────────────┘  │    │
│  └──────────────────────────────────┘    │
│                                          │
└──────────────────────────────────────────┘
```

**변경 범위**: placeholder div만 `<DashboardPreview />` 컴포넌트로 교체. headline, subtitle, CTA 버튼, gradient-blob 등 기존 구성 요소는 일체 변경하지 않는다.

### 6-2. 시네마틱 축소 뷰 원칙

DashboardPreview는 **영상 녹화물을 재생하는 것처럼** 보여야 한다:

- **전체 축소**: ai-register 페이지 main 영역(AiPanel + OrderRegisterForm)을 ~40~50% 스케일로 축소. Header/Breadcrumb/Sidebar 제외
- **폰트 축소**: 일반 텍스트 6~8px, 라벨 5~6px 수준. 읽기 위한 것이 아님
- **밀도 유지**: 축소해도 Card 구분, 필드 배치, 버튼 위치 등 구조가 인지됨
- **영상 느낌**: 값이 채워지고 색상이 바뀌고 버튼이 전환되는 과정이 화면 녹화를 보는 것 같은 인상
- **CSS transform**: `transform: scale(0.4~0.5)` + `transform-origin: top left`로 축소 구현

### 6-3. 5단계 AI 등록 애니메이션 상태 머신

| Step | ID | 이름 | 시간 | AI 패널 변화 | Form 변화 | 핵심 시각 |
|------|----|------|------|-------------|----------|----------|
| 1 | INITIAL | 빈 폼 | 3s | AiPanel 열림(확장), AiInputArea textarea 비어있음, "추출하기" 버튼 비활성 | CargoInfoForm/LocationForm/TransportOptionCard 등 Card 골격만 보임, 모든 필드 빈 상태 | 업무 화면의 구조감 |
| 2 | AI_INPUT | AI 입력 | 4s | AiInputArea textarea에 카카오톡 메시지가 타이핑 효과로 입력됨: "서울 강남구 물류센터에서 대전 유성구..." "추출하기" 버튼 활성화 | 폼은 여전히 빈 상태. 대기 느낌 | AI에 요청하는 장면 |
| 3 | AI_EXTRACT | AI 분석 | 4s | "추출하기" 버튼 클릭 효과 → 로딩 스피너("AI가 분석하고 있습니다") → AiResultButtons 4개 카테고리(상차지/하차지/화물·차량/운임) 버튼 그룹 생성. 모두 "대기"(파랑) 상태 | 폼은 여전히 빈 상태 | AI가 메시지를 이해하는 장면 |
| 4 | AI_APPLY | 자동 적용 | 4s | AiResultButtons의 버튼이 순차적으로 "적용됨"(초록)으로 전환. 0.5초 간격 stagger. 각 버튼에 체크 아이콘 표시 | 버튼 전환과 동시에 대응 폼 필드가 채워짐: LocationForm 주소 → CargoInfoForm 차량/화물 → EstimateInfoCard 운임 순서 | AI가 폼을 자동 채우는 핵심 장면 |
| 5 | COMPLETE | 완료 | 3s | 모든 버튼 "적용됨"(초록). "전체 적용" 버튼 비활성 | 모든 Card 내 필드 채워진 최종 상태. EstimateInfoCard에 "420,000원" 표시. 미묘한 완료 강조 | 한 번에 완성된 결과 |

**상태 전환 다이어그램:**

```
INITIAL --(3s)--> AI_INPUT --(4s)--> AI_EXTRACT --(4s)--> AI_APPLY --(4s)--> COMPLETE --(3s)--> INITIAL (루프)
                                                                                           ^
                                          Step Indicator 클릭 ---------------------------------+ 해당 Step으로 즉시 이동
                                          Hover -----------------------------------------------+ 현재 Step에서 일시정지
                                          
Timeout 우선순위: Step 클릭(5s) > Hover 해제(2s)
```

### 6-4. 인터랙션 패턴

**자동 재생 (기본 모드):**
- 페이지 로드 후 DashboardPreview 마운트 시 자동 시작 (delay: 0.6초)
- 사용자 개입 없이 연속 루프
- 단계 전환: cross-fade (opacity + 미묘한 y 이동)

**축소 뷰 내 시각 효과:**
- Step 2 타이핑: 카톡 메시지 텍스트가 글자 단위로 등장 (축소 뷰에서 텍스트가 채워지는 움직임으로 인지됨)
- Step 3 버튼 생성: 파란색 블록이 stagger로 등장
- Step 4 버튼→필드 연결: 버튼 색 전환(파랑→초록) + 대응 폼 필드 glow + 값 fade-in
- Step 5 완료: 전체 settled, 미묘한 border/shadow 변화

**Phase 1 Hover/Click 인터랙션:**
- hover: 자동 재생 일시정지, hoverLift(y: -4) 적용
- mouseout: 2초 후 재개
- step 클릭: 해당 단계 이동, 5초 후 재개
- **Timeout 우선순위**: step 클릭(5초) > hover 해제(2초). 동시 발생 시 더 긴 timeout 적용

### 6-5. Phase 2 — 인터랙티브 탐색 모드 UX

**모드 전환 흐름:**
```
[시네마틱 모드] ──(축소 뷰 내부 클릭)──> [인터랙티브 모드]
      ^                                       |
      |                                       |
      +────────(10초 비활동)──────────────────+
```

**인터랙티브 모드 시각 상태:**
- 자동 재생 정지. 현재 step 상태가 유지됨
- 축소 뷰 위에 투명 오버레이 레이어 활성화
- 마우스 커서가 pointer로 변경

**Hover 하이라이트:**
```
┌─ AiPanel ──────────────────┐
│                            │
│  ┌─────────────────────┐   │  ← hover 시 accent border 2px
│  │ AiInputArea         │   │  ← 툴팁: "카카오톡 메시지를
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓      │   │     붙여넣으면 AI가 자동으로
│  └─────────────────────┘   │     분석합니다"
│                            │
│  ┌─────────────────────┐   │
│  │ AI 결과 - 상차지     │   │  ← 각 카테고리별 독립 히트 영역
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓      │   │
│  └─────────────────────┘   │
│  ...                       │
└────────────────────────────┘
```

- 아웃라인: `border: 2px solid var(--color-accent-start)` + `border-radius: 4px`
- 툴팁: 아웃라인 상단 또는 우측에 표시. **원본 크기 텍스트**(14px)로 읽을 수 있게
- 툴팁 배경: `bg-gray-900/90 text-white rounded-md px-3 py-2`
- 한 번에 하나의 영역만 하이라이트됨

**클릭 실행 시퀀스 (권장):**
```
1. AiInputArea 클릭
   → 카톡 메시지 타이핑 효과 (2초)
   → textarea에 텍스트 채워짐
   
2. "추출하기" 버튼 클릭
   → 로딩 스피너 (1.5초)
   → AI 결과 버튼 4개 카테고리 생성 (파랑)
   
3. AI 결과 - 상차지 클릭
   → 버튼 파랑→초록, 체크 아이콘
   → LocationForm 상차지 Card에 주소 채워짐
   
4. AI 결과 - 하차지 클릭
   → 동일 패턴, 하차지 Card 채워짐
   
5. AI 결과 - 화물/차량 클릭
   → CargoInfoForm Card에 차량/화물 채워짐
   
6. AI 결과 - 운임 클릭
   → EstimateInfoCard에 금액 표시 (카운팅)
   
7. 옵션 토글 클릭 (선택)
   → 직송/지게차 토글 전환
```

**비순서 클릭 허용**: 3→5→4→2 순서로 클릭해도 각 컴포넌트가 독립 반응. 단, "추출하기"를 안 누르면 AI 결과 버튼이 없으므로 3~6은 반응 없음 (논리적 의존).

### 6-6. 반응형 전략

| 뷰포트 | Chrome | 내부 콘텐츠 | 자동 재생 | Phase 2 인터랙티브 |
|---------|--------|-----------|----------|-------------------|
| Desktop (>=1024px) | 유지 | AiPanel + Form 축소 뷰 전체 | 5단계 전체 | 전체 히트 영역 + 툴팁 |
| Tablet (768~1023px) | 유지 | AiPanel + 핵심 폼 영역 축약 | 5단계 전체 | 축약된 히트 영역 |
| Mobile (<768px) | 없음 | AI 결과 + 완성된 폼의 핵심 카드 | **2단계만**: AI_EXTRACT → COMPLETE | **인터랙티브 모드 미지원** (터치 정밀도 한계) |

### 6-7. 카피 가이드라인

> First-Pass §14에서 정의한 톤 원칙을 준수한다.

**톤 원칙:**
- 감성 문장보다 **제품 문장**을 우선한다
- 과장된 marketing copy보다 **utility copy**에 가깝게 간다
- 실무형 제품의 **신뢰감**을 우선한다

**Preview 내부 카피 (축소 뷰 — 읽히지 않아도 구조로 인지됨):**
- AI 패널 라벨: "AI 추출", "텍스트" 탭 (utility)
- "추출하기" 버튼 텍스트 (utility)
- 버튼 카테고리: "상차지", "하차지", "화물/차량", "운임" (domain)
- 폼 Card 라벨: "차량 정보", "상차지", "하차지" 등 (domain)
- ※ Header/Breadcrumb는 chrome 내부에 없으므로 해당 카피 불필요

**Hero 주변 카피 (변경하지 않음):**
- 현재 headline/subtitle/CTA 카피는 이 PRD 범위 밖. 별도 카피 개선 시 반영.

### 6-8. 디자인 토큰 매핑

| 용도 | 토큰 | 값 |
|------|------|---|
| chrome 배경 | `--color-card` | `oklch(0.15 0.01 260 / 0.5)` |
| chrome border | `--color-border` | `#1f2937` (gray-800) |
| 축소 뷰 내 라벨 | `--color-muted-foreground` | `#9ca3af` (gray-400) |
| AI 버튼 - 대기 | blue-500 | `#3b82f6` |
| AI 버튼 - 적용됨 | green-500 | `#22c55e` |
| AI 버튼 - 적용불가 | gray-500 | `#6b7280` |
| accent glow | `--color-accent-start` | `#9333ea` (purple-600) |
| 금액 강조 | `--color-accent-end` | `#3b82f6` (blue-600) |
| 모서리 반경 | `rounded-2xl` | 기존 placeholder 동일 |

---

## 7. Technical Considerations

### 7-1. 컴포넌트 아키텍처

```
DashboardPreview (container -- 상태 머신 + 자동 재생 관리)
  |
  +-- PreviewChrome (브라우저 프레임 래퍼)
  |     |
  |     +-- ChromeHeader (window dots + "OPTIC Broker" 타이틀)
  |     |
  |     +-- ScaledContent (transform: scale() 축소 래퍼)
  |           |
  |           +-- MainContentLayout (flex-row: AI 패널 + 폼)
  |                 |  ※ Header/Breadcrumb/Sidebar 제외 -- main 기능 영역만
  |                 |  참조: ai-register/page.tsx의 <main> 내부 flex 컨테이너
  |                 |
  |                 +-- AiPanelPreview (좌측 사이드바, 380px 비율)
  |                 |     +-- AiInputAreaPreview (텍스트 탭 + textarea + "추출하기" 버튼)
  |                 |     +-- AiResultButtonsPreview (4 카테고리 버튼 그룹)
  |                 |           +-- 상차지 그룹 (MapPin 아이콘)
  |                 |           +-- 하차지 그룹 (Flag 아이콘)
  |                 |           +-- 화물/차량 그룹 (Package 아이콘)
  |                 |           +-- 운임 그룹 (Banknote 아이콘)
  |                 |
  |                 +-- FormPreview (우측 스크롤 영역, flex-1)
  |                       +-- CargoInfoPreview (차량 타입/중량/화물명)
  |                       +-- LocationPreview x2 (상차지/하차지 주소·연락처·일시)
  |                       |                     ※ 날짜/시간은 LocationPreview 내 서브 필드 (DEC-011)
  |                       +-- TransportOptionsPreview (옵션 토글)
  |                       +-- EstimatePreview (거리/금액)
  |
  +-- StepIndicator (하단 탐색)
        +-- StepDot x 5
```

### 7-2. 파일 구조

```
apps/landing/src/
  components/
    dashboard-preview/
      dashboard-preview.tsx          # Container: 상태 머신 + useAutoPlay
      preview-chrome.tsx             # 브라우저 프레임 + ChromeHeader + 축소 래퍼(ScaledContent)
      ai-panel-preview.tsx           # AiPanel 축소 뷰 (AiInputArea + AiResultButtons 재현)
      form-preview.tsx               # OrderRegisterForm 축소 뷰 (Card 블록들)
      step-indicator.tsx             # 하단 스텝 내비게이션
      use-auto-play.ts              # 자동 재생 훅 (timeout 우선순위: click > hover)
  lib/
    mock-data.ts                     # AI 입력 메시지 + 추출 결과(카테고리별) + 폼 필드 데이터
    preview-steps.ts                 # Step 정의: id, label, duration, aiPanelState, formState
```

**참조 원본 파일 매핑:**

| Preview 컴포넌트 | 참조 원본 (ai-register/_components/) | 재현 수준 |
|-----------------|-------------------------------------|----------|
| AiPanelPreview | `ai-panel.tsx` (확장 상태) | 구조 + 색상 |
| AiInputAreaPreview | `ai-input-area.tsx` (텍스트 탭) | textarea + 버튼 |
| AiResultButtonsPreview | `ai-result-buttons.tsx` + `ai-button-item.tsx` | 4 카테고리 + 상태 색상 |
| FormPreview | `register-form.tsx` | Card 블록 구조 |
| CargoInfoPreview | CargoInfoForm 부분 | 필드 라벨 + 값 |
| LocationPreview | LocationForm x2 | 주소 + 연락처 |
| EstimatePreview | EstimateInfoCard | 금액 표시 |

### 7-3. 상태 관리

- **현재 step**: `useState<number>(0)` -- step index 0~4
- **자동 재생**: `useAutoPlay` 커스텀 훅
  - `isPlaying: boolean`
  - `pause(source: 'hover' | 'click')` -- source 기록으로 timeout 우선순위 결정
  - `resume()` -- source에 따라 2초(hover) 또는 5초(click) 적용
  - **Timeout 우선순위**: `click` source가 `hover`보다 우선. 동시 발생 시 5초 적용
- **Step 데이터**: `PreviewStep[]` 상수 배열
  - `{ id, label, duration, aiPanelState, formState }`
- Zustand 불필요 -- 순수 로컬 컴포넌트 상태

### 7-4. Mock Data 구조

```typescript
/**
 * Mock Data 구조
 * 참조: ai-register/_hooks/useAiExtract, useAiToFormMapper, useAiApply
 * 참조: ai-register/_store/ai-apply-store.ts의 AiButtonItem 구조
 */
interface PreviewMockData {
  aiInput: {
    message: string    // "서울 강남구 물류센터에서 대전 유성구 산업단지로..."
  }
  aiResult: {
    // AiResultButtons 카테고리 그룹 구조 참조
    categories: Array<{
      id: 'departure' | 'destination' | 'cargo' | 'fare'  // categoryGroup
      label: string    // "상차지" | "하차지" | "화물/차량" | "운임"
      icon: string     // "MapPin" | "Flag" | "Package" | "Banknote"
      buttons: Array<{
        fieldKey: string      // "departure-address1", "cargo-vehicleType" 등
        label: string         // "주소명", "차량종류" 등
        displayValue: string  // "서울 강남구 물류센터" 등
        status: 'pending' | 'applied'
      }>
    }>
  }
  formData: {
    pickup: { company: string; address: string; date: string; time: string }
    delivery: { company: string; address: string; date: string; time: string }
    vehicle: { type: string; weight: string }
    cargo: { name: string; remark: string }
    options: string[]     // ["direct", "forklift"]
    estimate: {
      distance: number          // km
      amount: number            // 420000
    }
  }
}

/**
 * AI 패널 Step별 상태
 * 참조: AiInputArea의 extractState + AiResultButtons의 button states
 */
interface AiPanelState {
  inputText: string              // 현재 타이핑된 텍스트 (Step 2에서 증가)
  extractState: 'idle' | 'loading' | 'resultReady'  // AiInputArea 상태
  buttons: Array<{
    id: string
    status: 'pending' | 'applied'
  }>
}

/**
 * Form Step별 상태
 * 참조: OrderRegisterForm의 Card 블록별 필드 채움 상태
 */
interface FormState {
  filledCards: string[]           // ["cargoInfo", "location-departure", ...]
  highlightedCard: string | null  // 현재 glow 효과 적용 Card
  estimateAmount: number | null   // EstimateInfoCard 금액
}
```

### 7-5. 축소 뷰 구현 전략

```tsx
// ScaledContent 컴포넌트 핵심 구현
<div className="overflow-hidden" style={{ height: scaledHeight }}>
  <div style={{
    transform: `scale(${scaleFactor})`,  // 0.4~0.5
    transformOrigin: 'top left',
    width: `${100 / scaleFactor}%`,      // 원본 크기로 렌더링
  }}>
    {/* OrderRegisterForm 구조를 원본 크기로 렌더링 */}
    {/* CSS transform으로 전체 축소 */}
  </div>
</div>
```

- 내부 콘텐츠를 **원본 크기로 렌더링**한 뒤 CSS `transform: scale()`로 축소
- 이 방식은 폰트, 간격, Card 크기가 자연스럽게 비례 축소됨
- `overflow: hidden`으로 축소 후 남는 영역 감춤

### 7-6. 의존성

- **새 npm 패키지 없음**. 기존 의존성만 사용:
  - `framer-motion` ^11.15.0 -- 전환 애니메이션
  - `lucide-react` ^0.474.0 -- 아이콘 (MapPin, Flag, Package, Banknote 등)
  - `clsx` + `tailwind-merge` -- cn 유틸리티

### 7-7. 정적 빌드 호환성

- 모든 컴포넌트에 `'use client'` 지시어
- `output: 'export'` 호환: 서버 사이드 데이터 없음
- `optimizePackageImports: ['lucide-react', 'framer-motion']` 활용

### 7-8. 성능 전략

| 전략 | 설명 | 관련 요구사항 |
|------|------|-------------|
| 지연 등장 | delay 0.6초 (현재 placeholder 동일) | REQ-DASH-031 |
| CSS 우선 | transform, opacity, background-color CSS 전환 우선 | REQ-DASH-032 |
| 번들 예산 | 30KB gzipped 이내 | REQ-DASH-030 |
| Tree-shaking | lucide-react/framer-motion 선택적 import | -- |
| 모바일 조건부 렌더링 | Mobile에서 축소 뷰 비렌더링, 전용 카드만 렌더링 | REQ-DASH-025 |

### 7-9. 기존 코드 변경 영향

| 파일 | 변경 유형 | 내용 |
|------|---------|------|
| `hero.tsx` | 수정 | placeholder div를 `<DashboardPreview />` 컴포넌트로 교체. **레이아웃 구조 변경 없음** |
| `motion.ts` | 추가 가능 | Preview 전용 Variants 추가 (stepTransition 등). 기존 변형 수정 없음 |
| `constants.ts` | 수정 없음 | mock data는 별도 `mock-data.ts`에 분리 |
| `globals.css` | 수정 없음 | 기존 디자인 토큰 그대로 사용 |

---

## 8. Milestones

### Phase 1 — 시네마틱 뷰 (MVP)

| Step | 이름 | 예상 기간 | 산출물 | 완료 기준 |
|------|------|----------|--------|----------|
| 1-1 | Foundation | 2~3일 | 파일 구조, `PreviewChrome` + `ScaledContent`, `mock-data.ts`, `preview-steps.ts` | Chrome 프레임 + 축소 래퍼가 Hero에 렌더링됨. mock data 타입 체크 통과 |
| 1-2 | Core UI | 3~4일 | `AiPanelPreview`, `FormPreview`, 축소 뷰 스타일링 | 정적 상태(Step 5)에서 AI 패널 + 폼 Card들이 축소 뷰로 렌더링됨 |
| 1-3 | Animations | 2~3일 | `useAutoPlay` 훅(timeout 우선순위 포함), 5단계 전환, 타이핑 효과, 버튼→필드 연결 애니메이션 | 5단계 AI 등록 루프 동작 |
| 1-4 | Step Indicator | 1~2일 | `StepIndicator`, 클릭/hover 인터랙션 | 클릭 이동, hover 일시정지, timeout 우선순위 |
| 1-5 | Responsive | 2~3일 | Desktop/Tablet/Mobile 적응 | Desktop: 전체 축소 뷰. Mobile: 2단계 카드 뷰 |
| 1-6 | Polish | 1~2일 | 접근성, 성능, 크로스 브라우저 | reduced-motion 정적 표시. 번들 <30KB. aria 속성 |

**Phase 1 총 예상 기간: 11~17일**

### Phase 2 — 인터랙티브 탐색

> Phase 1 완료 및 배포 후 착수. Phase 1의 축소 뷰 인프라 위에 인터랙티브 레이어를 추가한다.

| Step | 이름 | 예상 기간 | 산출물 | 완료 기준 |
|------|------|----------|--------|----------|
| 2-1 | Hit Area Layer | 2~3일 | 투명 오버레이 + 히트 영역 매핑(8~10개), scale 역변환 좌표 계산 | 축소 뷰 위에서 각 컴포넌트 영역 클릭 시 올바른 영역이 감지됨 |
| 2-2 | Highlight & Tooltip | 2~3일 | hover 아웃라인(accent border), 설명 툴팁(원본 크기), 툴팁 콘텐츠 관리(mock-data.ts) | hover 시 해당 영역에 아웃라인 + 읽을 수 있는 툴팁 표시 |
| 2-3 | Click Interactions | 3~4일 | 각 히트 영역별 mock 기능 실행 로직, 시각 피드백(타이핑, 로딩, 버튼 전환, 필드 채움) | 8~10개 영역 클릭 시 각각 정의된 mock 기능이 시각적으로 실행됨 |
| 2-4 | Mode Switch | 1~2일 | 시네마틱↔인터랙티브 모드 전환 로직, 10초 비활동 자동 복귀 | 축소 뷰 내부 클릭 → 인터랙티브, 10초 비활동 → 시네마틱 복귀 |
| 2-5 | Polish | 1~2일 | 엣지 케이스, 비순서 클릭 처리, Tablet 히트 영역 조정 | 모든 클릭 조합이 안전하게 동작. 논리적 의존(추출 전 AI 버튼 비활성) 처리 |

**Phase 2 총 예상 기간: 9~14일**

### 전체 의존성

```
Phase 1:
  1-1 → 1-2 → 1-3 → 1-4
                ↓
  1-2 ───────→ 1-5
  1-3, 1-4, 1-5 → 1-6

Phase 2 (Phase 1-6 완료 후):
  2-1 → 2-2
  2-1 → 2-3
  2-2, 2-3 → 2-4 → 2-5
```

---

## 9. Risks & Mitigations

| # | 리스크 | 영향도 | 확률 | 대응 전략 |
|---|--------|--------|------|----------|
| R1 | **과한 복잡성** -- OrderRegisterForm 전체를 축소 재현하면 구현 범위가 커짐 | 높음 | 중간 | 구조와 밀도만 재현, 실제 컴포넌트 로직은 전부 static. Card 틀 + 텍스트 블록 수준 |
| R2 | **축소 뷰 가독성** -- 너무 작아서 아무것도 인지되지 않음 | 높음 | 중간 | scale 0.4~0.5 범위 테스트. AI 버튼 색상 전환(파랑→초록)은 축소 뷰에서도 인지됨 확인 |
| R3 | **성능 저하** -- 축소 뷰 내 DOM 복잡도가 높아 렌더링 부담 | 높음 | 낮음 | 30KB 번들 예산. 실제 컴포넌트가 아닌 시각 모형이므로 DOM이 단순. CSS transform 축소 |
| R4 | **모바일 가독성** -- 축소판이 모바일에서 무의미 | 중간 | 중간 | 모바일 전용 2단계 카드 뷰(REQ-DASH-025, 026). 축소 뷰 비렌더링 |
| R5 | **Mock data 노후화** | 낮음 | 높음 | mock-data.ts 분리, 카톡 메시지와 AI 결과만 수정하면 전체 반영 |
| R6 | **Feature creep** -- AI 기능 확장, 실제 입력 등 범위 확장 | 높음 | 중간 | Phase 1/2 분리. Phase 1(시네마틱)을 먼저 완료 후 Phase 2(인터랙티브) 착수 |
| R7 | **브라우저 호환** -- CSS transform scale 렌더링 차이 | 중간 | 낮음 | transform: scale()은 모든 주요 브라우저 지원. Phase 1 Step 1-6(Polish)에서 테스트 |
| R8 | **접근성 위반** -- 자동 재생이 모션 민감 사용자에게 문제 | 중간 | 중간 | `prefers-reduced-motion` → 정적 최종 상태(REQ-DASH-027) |
| R9 | **기능 오해** -- 방문자가 실제 AI 기능과 데모를 혼동 | 중간 | 낮음 | Phase 1: 축소 뷰이므로 클릭해도 반응 없음. Phase 2: 인터랙티브 모드에서도 모든 데이터는 mock이며 저장/전송 없음. chrome 타이틀에 "Demo" 표시 고려 |
| R10 | **[Phase 2] 히트 영역 정밀도** -- 축소 뷰에서 클릭 영역이 너무 작아 잘못된 컴포넌트가 반응 | 중간 | 중간 | 최소 히트 영역 44x44px(원본 기준). 인접 영역 간 여백 확보. 사용자 테스트로 검증 |
| R11 | **[Phase 2] 인터랙티브 모드 혼란** -- 시네마틱↔인터랙티브 전환이 사용자에게 혼동 | 중간 | 낮음 | 모드 전환 시 미묘한 시각 피드백(오버레이 밝기 변화 등). 10초 비활동 시 자동 복귀 |

---

## 10. Success Metrics

### 10-1. UX 메트릭

| 지표 | 목표값 | 측정 방법 | 관련 Goal |
|------|--------|----------|----------|
| 제품 카테고리 인지 시간 | 사용자 테스트 5초 내 인지율 70%+ | 사용자 테스트 (5명+): "이 제품이 무엇을 하는 제품인가?" 질문에 5초 내 정답 비율 | G1 |
| Hero 인게이지먼트율 | 방문자 30%+ hover 또는 step 클릭 | Analytics 이벤트: `preview_hover`, `preview_step_click` 추적 | G4 |
| CTA 클릭률 향상 | 현재 대비 15%+ 증가 | A/B 테스트: placeholder(대조군) vs Preview(실험군) CTA 클릭률 비교 | G4 |
| 섹션 연결 효과 | Features 섹션 도달 10%+ 증가 | 스크롤 깊이 Analytics: `#features` viewport 진입 비율 | G2 (Workflow 전달 후 상세 탐색 유도) |
| 모바일 이해도 | 5초 후 제품 카테고리 인지 60%+ | 모바일 기기 사용자 테스트 (3명+) | G1, US-05 |

### 10-2. 기술 메트릭

| 지표 | 목표값 | 측정 방법 | 관련 요구사항 |
|------|--------|----------|-------------|
| JS 번들 기여 | <30KB gzipped | `next build` 후 chunk gzipped 크기 측정 | REQ-DASH-030 |
| LCP 영향 | +100ms 미만 | Lighthouse CI 전후 비교 | REQ-DASH-031 |
| 애니메이션 프레임율 | 자동 재생 중 60fps 유지 | Chrome DevTools Performance 패널 프로파일링 | REQ-DASH-013 |
| 컴포넌트 테스트 커버리지 | `dashboard-preview/` 80%+ 라인 커버리지 | `vitest run --coverage` | US-09 |
| 빌드 성공 | TypeScript 0 에러, lint 0 경고 | `pnpm run typecheck && pnpm run lint` | -- |

### 10-3. 정성 메트릭

| 지표 | 목표값 | 평가 방법 | 관련 Goal |
|------|--------|----------|----------|
| 전문성 인상 | "실제 제품 같다" 4/5점+ | 내부 리뷰: 3명+ 이해관계자 5점 척도 평가 | G3 |
| AI 가치 전달 | "AI가 자동으로 처리한다" 인지율 80%+ | 사용자 테스트: Preview 시청 후 AI 기능 인지 여부 | G2 |
| 유지보수성 | mock data 수정 = `mock-data.ts`만 편집 | 개발자 경험 검증 | G6, US-06 |

### 10-4. Phase 2 메트릭

| 지표 | 목표값 | 측정 방법 | 관련 Goal |
|------|--------|----------|----------|
| 인터랙티브 모드 진입율 | 20%+ | Analytics: `preview_interactive_enter` 이벤트 / 전체 방문자 | G7 |
| 컴포넌트 hover 수 | 평균 3개+ | Analytics: `preview_component_hover` 이벤트 집계 | G8 |
| 컴포넌트 클릭 수 | 평균 2회+ | Analytics: `preview_component_click` 이벤트 집계 | G7 |
| Hero 체류 시간 증가 | Phase 1 대비 30%+ | Analytics: Hero 섹션 viewport 체류 시간 비교 | G9 |
| 히트 영역 정확도 | 잘못된 클릭 5% 미만 | 사용자 테스트: 의도한 컴포넌트 vs 실제 반응 일치율 | REQ-DASH-043 |

### 10-5. User Story 추적 매트릭스

| User Story | 관련 요구사항 | 검증 방법 |
|-----------|-------------|----------|
| US-01 | REQ-DASH-010, 011, 012, 013 | AI 등록 5단계 자동 재생 루프 동작 |
| US-02 | REQ-DASH-007, 021, 022 | OrderRegisterForm 축소 뷰 + 한국 운송 데이터 |
| US-03 | REQ-DASH-010, 011, 012 | 자동 재생 시작 + 연속 루프 |
| US-04 | REQ-DASH-014, 015, 016, 017, 018, 019 | step 클릭, hover, timeout 우선순위 |
| US-05 | REQ-DASH-025, 026 | 모바일 전용 카드 뷰 + 2단계 자동 전환 |
| US-06 | REQ-DASH-020, 021 (mock-data.ts 분리) | mock-data.ts만 수정하여 데모 변경 |
| US-07 | REQ-DASH-001, 002, 003, 007, 디자인 토큰 | 이해관계자 "전문성" 평가 |
| US-08 | 파일 구조 (7-2절) | `dashboard-preview/` 디렉토리 자체 완결 |
| US-09 | useAutoPlay 훅 + preview-steps.ts | step 전환 Vitest 단위 테스트 |
| US-10 | REQ-DASH-030 | 번들 <30KB gzipped |

---

## Appendix A: Non-Functional Requirements Checklist

| 카테고리 | 항목 | 상태 | 관련 요구사항 |
|---------|------|------|-------------|
| **성능** | JS 번들 <30KB gzipped | 정의됨 | REQ-DASH-030 |
| **성능** | LCP 영향 +100ms 미만 | 정의됨 | REQ-DASH-031 |
| **성능** | CSS 애니메이션 우선 | 정의됨 | REQ-DASH-032 |
| **접근성** | prefers-reduced-motion 지원 | 정의됨 | REQ-DASH-027 |
| **접근성** | aria-label 적용 | 정의됨 | REQ-DASH-028 |
| **접근성** | 키보드 탐색 | 정의됨 | REQ-DASH-029 |
| **반응형** | Desktop 축소 뷰 전체 | 정의됨 | REQ-DASH-023 |
| **반응형** | Tablet 축약 축소 뷰 | 정의됨 | REQ-DASH-024 |
| **반응형** | Mobile 전용 카드 뷰 | 정의됨 | REQ-DASH-025 |
| **반응형** | Mobile 2단계 자동 전환 | 정의됨 | REQ-DASH-026 |
| **유지보수** | mock data 파일 분리 | 정의됨 | REQ-DASH-020~022 |
| **유지보수** | 독립 컴포넌트 트리 | 정의됨 | US-08 |
| **유지보수** | 테스트 가능한 상태 관리 | 정의됨 | US-09 |
| **국제화** | 한국어 단일 | 범위 외 | NG6 |

## Appendix B: 용어 정의

| 용어 | 설명 |
|------|------|
| Chrome (프레임) | 브라우저/앱 창 테두리를 모방한 시각적 프레임. 창 제어 점, 타이틀 바 포함 |
| Scripted Interaction | 사전 정의된 시나리오에 따라 자동 재생되는 연출형 인터랙션 |
| 시네마틱 축소 뷰 | OrderRegisterForm을 CSS transform: scale()로 축소하여 영상 녹화물처럼 보여주는 표현 방식 |
| Mock Data | 데모 목적으로 생성된 한국 운송 현실 데이터 (실제 API 미사용) |
| Step | 5단계 자동 재생 시퀀스의 각 단계 (INITIAL, AI_INPUT, AI_EXTRACT, AI_APPLY, COMPLETE) |
| AI 추출 | 카카오톡 메시지 텍스트를 분석하여 운송 주문 정보를 자동 추출하는 과정 |
| OrderRegisterForm | 실제 OPTIC Broker 제품의 주문 등록 폼 컴포넌트 (register-form-ver03.tsx) |
| Prefill | 빈 필드에 값이 자동으로 채워지는 시각 효과 |
| 상차지 / 하차지 | 화물을 싣는 곳(pickup) / 내리는 곳(delivery) |
| 카고 | 화물차 유형 중 하나. 적재함이 개방된 형태 |
| 직송 (Direct) | 중간 경유지 없이 직접 운송하는 옵션 |
| 지게차 (Forklift) | 상하차 시 지게차를 사용하는 옵션 |
| AiPanel | AI 입력/결과를 표시하는 좌측 사이드바(380px). 참조: `ai-register/_components/ai-panel.tsx` |
| AiInputArea | 텍스트/이미지 입력 + "추출하기" 버튼을 포함하는 AI 입력 컴포넌트. 참조: `ai-input-area.tsx` |
| AiResultButtons | AI 추출 결과를 카테고리별(상차/하차/화물/운임) 버튼 그룹으로 표시. 참조: `ai-result-buttons.tsx` |
| AiButtonItem | 개별 AI 결과 버튼. pending(파랑)/applied(초록)/unavailable(회색) 3가지 상태. 참조: `ai-button-item.tsx` |
| categoryGroup | AI 결과 버튼의 카테고리 분류: departure, destination, cargo, fare |
| Timeout 우선순위 | Step 클릭(5초)과 hover 해제(2초) timeout이 동시 발생 시, 더 긴 timeout을 적용하는 규칙 |

---

## Revision History

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| Draft v1 | 2026-04-14 | 초기 작성. 수동 주문 등록 5단계 시나리오 |
| Draft v2 | 2026-04-14 | 리뷰 반영: (1) Hero 레이아웃 변경 철회 (2) AI 화물 등록 시나리오 전환 (3) 시네마틱 축소 뷰 도입 (4) timeout 우선순위 규칙 추가 (5) 카피 가이드라인 추가 (6) 모바일 2단계 자동 전환 (7) 메트릭 수정 (8) 60fps (9) 오타 수정 |
| Draft v3 | 2026-04-14 | 참조 UI 변경: (1) `register/page.tsx` → `ai-register/page.tsx` 교체 (2) chrome 내부 Header/Breadcrumb 제외, main만 표시 (3) 실제 ai-register 컴포넌트 구조 반영 (4) Mock Data를 AiButtonItem 구조로 수정 (5) 참조 매핑 테이블 추가 |
| Draft v4 | 2026-04-14 | Phase 1/2 분리 + 리뷰 반영: (1) Phase 1 = 시네마틱 뷰, Phase 2 = 인터랙티브 탐색 (2) Phase 2 Goals(G7~G9), 요구사항(REQ-DASH-033~045), UX 상세, Milestones(9~14일), 리스크(R10~R11), 메트릭 추가 (3) 최종 리뷰 HIGH 3건 해결: 섹션 6-6 중복 번호 수정(→6-7, 6-8), 리스크 R1~R11 순차 재배치, Phase 2 모바일 비활성화 REQ-DASH-045 추가 (4) R7 "Phase 6" 오류 수정, R9 Phase 2 맥락 대응 업데이트 |
