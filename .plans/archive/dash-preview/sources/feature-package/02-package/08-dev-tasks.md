# 개발 태스크: dash-preview

> **Feature**: Dashboard Preview (Hero Interactive Demo)
> **PRD**: `.plans/prd/10-approved/dashboard-preview-prd.md`
> **Created**: 2026-04-14

---

## 1. Phase 1 — 시네마틱 뷰

### Step 1-1: Foundation (2~3일)

| TASK ID | 설명 | 파일 | 의존성 | 예상 기간 | 관련 REQ | TDD 테스트 우선 항목 |
|---------|------|------|--------|---------|---------|------------------|
| TASK-DASH-001 | PreviewChrome 컴포넌트 구현: ChromeHeader(window dots + title) + ScaledContent(transform scale 래퍼). Desktop/Tablet scaleFactor 분기. overflow: hidden 처리 | `preview-chrome.tsx` | 없음 | 1일 | REQ-DASH-001, 002, 003 | chrome 프레임 렌더링 테스트, scaleFactor 적용 테스트 |
| TASK-DASH-002 | mock-data.ts + preview-steps.ts 생성: PreviewMockData 인터페이스 정의, 카카오톡 메시지, AI 추출 결과, 폼 데이터, PreviewStep[] 상수 정의 | `mock-data.ts`, `preview-steps.ts` | 없음 | 1일 | REQ-DASH-020, 021, 022 | PreviewStep 구조 타입 테스트, mock data 완전성 테스트 |

### Step 1-2: Core UI (3~4일)

| TASK ID | 설명 | 파일 | 의존성 | 예상 기간 | 관련 REQ | TDD 테스트 우선 항목 |
|---------|------|------|--------|---------|---------|------------------|
| TASK-DASH-003 | AiPanelPreview 컴포넌트: AiTabBar(정적), AiInputAreaPreview(empty/typing/filled), AiExtractButton(disabled/active/pressed/loading), AiResultButtonsPreview(4 카테고리, pending/applied 상태) | `ai-panel-preview.tsx` | TASK-DASH-002 | 2일 | REQ-DASH-004, 005, 006 | Step별 AiPanel 상태 렌더링 테스트, 버튼 상태 전환 테스트 |
| TASK-DASH-004 | FormPreview 컴포넌트: CargoInfoPreview, LocationPreview x2, TransportOptionsPreview, EstimatePreview. 빈 상태 + 채워진 상태 | `form-preview.tsx` | TASK-DASH-002 | 2일 | REQ-DASH-007 | Card별 빈/채워진 상태 렌더링 테스트 |

### Step 1-3: Animations (2~3일)

| TASK ID | 설명 | 파일 | 의존성 | 예상 기간 | 관련 REQ | TDD 테스트 우선 항목 |
|---------|------|------|--------|---------|---------|------------------|
| TASK-DASH-005 | useAutoPlay 훅 구현: 5단계 자동 재생 타이머, 루프, pause/resume, timeout 우선순위 (click 5s > hover 2s). DashboardPreview 컨테이너에서 상태 머신 통합 | `use-auto-play.ts`, `dashboard-preview.tsx` | TASK-DASH-003, TASK-DASH-004 | 1.5일 | REQ-DASH-008, 010, 011, 012, 013 | **useAutoPlay 단위 테스트 (핵심)**: step 진행 테스트, 루프 테스트, pause/resume 테스트, timeout 우선순위 테스트 |
| TASK-DASH-006 | 애니메이션 구현: cross-fade 단계 전환, 타이핑 효과, stagger 등장, 버튼→폼 연결 (glow + fade-in), 금액 카운팅. motion.ts에 variants 추가 | `dashboard-preview.tsx`, `ai-panel-preview.tsx`, `form-preview.tsx`, `motion.ts` | TASK-DASH-005 | 1.5일 | REQ-DASH-009, 013, 032 | cross-fade 전환 테스트, 금액 카운팅 범위 테스트 |

### Step 1-4: Step Indicator (1~2일)

| TASK ID | 설명 | 파일 | 의존성 | 예상 기간 | 관련 REQ | TDD 테스트 우선 항목 |
|---------|------|------|--------|---------|---------|------------------|
| TASK-DASH-007 | StepIndicator 컴포넌트: 5 dots 렌더링, active 상태 시각, 클릭 핸들러(goToStep + pause), hover 상태 | `step-indicator.tsx` | TASK-DASH-005 | 1.5일 | REQ-DASH-014, 015, 016 | **StepIndicator 테스트**: dot 렌더링 테스트, 클릭 이벤트 테스트, active 상태 테스트 |

### Step 1-5: Responsive (2~3일)

| TASK ID | 설명 | 파일 | 의존성 | 예상 기간 | 관련 REQ | TDD 테스트 우선 항목 |
|---------|------|------|--------|---------|---------|------------------|
| TASK-DASH-008 | useAutoPlay hover/click 인터랙션: Preview 영역 hover pause, mouseout 2s resume, timeout 우선순위 통합 | `use-auto-play.ts`, `dashboard-preview.tsx` | TASK-DASH-005 | 0.5일 | REQ-DASH-017, 018, 019 | timeout 우선순위 시나리오 테스트 |
| TASK-DASH-009 | Desktop/Tablet 반응형: scaleFactor 분기 (0.45/0.38), Tablet FormPanel 축약 (CargoInfo + Location 상차지 축약 + Estimate) | `preview-chrome.tsx`, `form-preview.tsx`, `dashboard-preview.tsx` | TASK-DASH-003, TASK-DASH-004 | 1일 | REQ-DASH-023, 024 | 뷰포트별 렌더링 분기 테스트 |
| TASK-DASH-010 | MobileCardView 컴포넌트: 2단계 카드 뷰 (AI_EXTRACT + COMPLETE), MobileDotIndicator (2-dot), 4초 유지 + 0.3s cross-fade. DashboardPreview에서 Mobile 조건부 렌더링 | `mobile-card-view.tsx`, `dashboard-preview.tsx` | TASK-DASH-002 | 1.5일 | REQ-DASH-025, 026 | Mobile 카드 렌더링 테스트, 2단계 전환 테스트 |

### Step 1-6: Polish (1~2일)

| TASK ID | 설명 | 파일 | 의존성 | 예상 기간 | 관련 REQ | TDD 테스트 우선 항목 |
|---------|------|------|--------|---------|---------|------------------|
| TASK-DASH-011 | 접근성: prefers-reduced-motion 감지 → static 모드(COMPLETE 정적 표시), aria-label, StepIndicator 키보드 탐색 (Tab, Arrow, Enter/Space), role="tablist"/"tab", aria-selected | `dashboard-preview.tsx`, `step-indicator.tsx` | TASK-DASH-005, TASK-DASH-007, TASK-DASH-010 | 1일 | REQ-DASH-027, 028, 029 | reduced-motion 테스트, 키보드 탐색 테스트, aria 속성 테스트 |
| TASK-DASH-012 | 성능 최적화 + hero.tsx 통합: 번들 크기 확인 (<30KB gzipped), LCP 검증, CSS 우선 애니메이션 확인, hero.tsx placeholder → `<DashboardPreview />` 교체 | `hero.tsx`, 전체 파일 | TASK-DASH-005, TASK-DASH-007, TASK-DASH-010 | 1일 | REQ-DASH-030, 031, 032 | 빌드 성공 테스트, 번들 크기 측정 |

---

## 2. Phase 2 — 인터랙티브 탐색 (Phase 1 완료 후)

### Step 2-1: Hit Area Layer (2~3일)

| TASK ID | 설명 | 파일 | 의존성 | 예상 기간 | 관련 REQ | TDD 테스트 우선 항목 |
|---------|------|------|--------|---------|---------|------------------|
| TASK-DASH-013 | InteractiveOverlay 컴포넌트 기반: 투명 오버레이 레이어, HitAreaConfig[] 기반 11개 히트 영역, scale 역변환 좌표, 최소 44x44px 히트 영역. mock-data.ts에 tooltips 추가 | `interactive-overlay.tsx`, `mock-data.ts` | Phase 1 전체 | 2일 | REQ-DASH-037, 043, 044 | 히트 영역 렌더링 테스트, 클릭 영역 정확도 테스트 |

### Step 2-2: Highlight & Tooltip (2~3일)

| TASK ID | 설명 | 파일 | 의존성 | 예상 기간 | 관련 REQ | TDD 테스트 우선 항목 |
|---------|------|------|--------|---------|---------|------------------|
| TASK-DASH-014 | Hover 하이라이트 + Tooltip 컴포넌트: accent border 2px 아웃라인, 설명 툴팁(원본 크기 14px), 한 번에 하나만 표시, 뷰포트 경계 고려, mock-data.ts 기반 텍스트 관리 | `interactive-overlay.tsx` | TASK-DASH-013 | 2일 | REQ-DASH-036, 038, 042 | 하이라이트 토글 테스트, 툴팁 표시 테스트, 뷰포트 경계 테스트 |

### Step 2-3: Click Interactions (3~4일)

| TASK ID | 설명 | 파일 | 의존성 | 예상 기간 | 관련 REQ | TDD 테스트 우선 항목 |
|---------|------|------|--------|---------|---------|------------------|
| TASK-DASH-015 | 히트 영역별 mock 기능 실행: AiInputArea(타이핑), ExtractButton(로딩→버튼생성), AiResult 4개(버튼전환+폼채움), TransportOption(토글), EstimateInfoCard(카운팅). 논리적 의존 처리 | `interactive-overlay.tsx`, `dashboard-preview.tsx` | TASK-DASH-013, TASK-DASH-014 | 3일 | REQ-DASH-039, 040, 041 | 각 영역 클릭 mock 기능 테스트, 논리적 의존 테스트, 비순서 클릭 안전성 테스트 |

### Step 2-4: Mode Switch (1~2일)

| TASK ID | 설명 | 파일 | 의존성 | 예상 기간 | 관련 REQ | TDD 테스트 우선 항목 |
|---------|------|------|--------|---------|---------|------------------|
| TASK-DASH-016 | 시네마틱↔인터랙티브 모드 전환: `use-interactive-mode.ts` 구현(useReducer + InteractiveState). 축소 뷰 내부 클릭/Enter → interactive, Escape 또는 10초 비활동 → cinematic 복귀. DashboardPreview에서 useAutoPlay와 통합(mode=interactive 시 pause) | `use-interactive-mode.ts`, `dashboard-preview.tsx` | TASK-DASH-014, TASK-DASH-015 | 1.5일 | REQ-DASH-033, 034, 035, 051 | 모드 전환 테스트, 10초 비활동 복귀 테스트, Escape 키 전환 테스트 |

### Step 2-5: Polish + 반응형/접근성 (2~3일)

| TASK ID | 설명 | 파일 | 의존성 | 예상 기간 | 관련 REQ | TDD 테스트 우선 항목 |
|---------|------|------|--------|---------|---------|------------------|
| TASK-DASH-017 | Mobile 인터랙티브 비활성화, Tablet 히트 영역 축약(6개), 엣지 케이스, 크로스 브라우저 | `dashboard-preview.tsx`, `hit-areas.ts` | TASK-DASH-016 | 1일 | REQ-DASH-045, 046, 047 | Mobile 비활성화 테스트, Tablet 6개 히트 영역 테스트, 최소 크기(16x16) 테스트 |
| TASK-DASH-018 | Phase 2 키보드 접근성: HitArea Tab/Enter/Space, Escape 전역 핸들러, 포커스 accent 아웃라인, aria-label, aria-live 상태 안내. Arrow 키와 모드 유지 통합 | `interactive-overlay.tsx`, `use-interactive-mode.ts`, `step-indicator.tsx` | TASK-DASH-016 | 1일 | REQ-DASH-048, 049, 050, 052 | Tab 순차 포커스 테스트, Enter 실행 테스트, Escape 전환 테스트, aria 속성 테스트 |

---

## 3. 의존성 그래프

### Phase 1

```
TASK-DASH-001 (Foundation: mock-data, preview-steps, preview-chrome)
  │
  ├──→ TASK-DASH-002 (AiPanelPreview)
  │      │
  │      └──→ TASK-DASH-005 (useAutoPlay + 5단계 전환)
  │             │
  │             └──→ TASK-DASH-007 (StepIndicator)
  │
  ├──→ TASK-DASH-003 (FormPreview)
  │      │
  │      └──→ TASK-DASH-005 (useAutoPlay + 5단계 전환)
  │
  ├──→ TASK-DASH-004 (hero.tsx 통합)  ← TASK-002, 003 완료 후
  │
  ├──→ TASK-DASH-006 (애니메이션 폴리시)  ← TASK-005 완료 후
  │
  ├──→ TASK-DASH-008 (hover/click 인터랙션)  ← TASK-005 완료 후
  │
  ├──→ TASK-DASH-009 (Mobile 카드 뷰)  ← TASK-002, 003 완료 후
  │
  ├──→ TASK-DASH-010 (Tablet 축약)  ← TASK-002, 003 완료 후
  │
  └──→ TASK-DASH-011 (접근성)  ← TASK-005, 007 완료 후
       │
       └──→ TASK-DASH-012 (성능 최적화 + 빌드)  ← 전체 완료 후
```

### Phase 2

```
TASK-DASH-013 (히트 영역 오버레이 + hit-areas.ts)  ← Phase 1 전체 완료 후
  │
  ├──→ TASK-DASH-014 (hover 하이라이트 + 툴팁)
  │
  └──→ TASK-DASH-015 (클릭 mock 실행)
       │
       └──→ TASK-DASH-016 (모드 전환 로직 + use-interactive-mode.ts)
              │
              ├──→ TASK-DASH-017 (반응형 폴리시: Mobile 비활성, Tablet 6개 축약)
              │
              └──→ TASK-DASH-018 (키보드 접근성: Tab/Enter/Escape/aria)
```

### 병렬 가능 그룹

| 그룹 | 병렬 TASK | 선행 조건 |
|------|----------|----------|
| Core UI | TASK-002 + TASK-003 | TASK-001 |
| Responsive | TASK-009 + TASK-010 | TASK-002, 003 |
| Phase 2 Initial | TASK-014 + TASK-015 | TASK-013 |
| Phase 2 Polish | TASK-017 + TASK-018 | TASK-016 |
