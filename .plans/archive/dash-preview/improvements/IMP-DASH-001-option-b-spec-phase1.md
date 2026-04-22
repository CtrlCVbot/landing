# IMP-DASH-001 Option B — Phase 1 통합 실행안

> **Parent**: [IMP-DASH-001.md](./IMP-DASH-001.md)
> **Supersedes**: [IMP-DASH-001-option-b-spec.md](./IMP-DASH-001-option-b-spec.md) (Phase 1 범위 한정판)
> **Reference**: Cursor.com `demo-window-cursor-ide`
> **Status**: draft (Phase 1)
> **Updated**: 2026-04-17

---

## 0. 한 줄 요약

ai-register page.tsx의 **main 콘텐츠 영역 전체**를 landing 앱에 시각 모형으로 복제하되, **1차 시연 플로우는 AI 화물 등록까지(INITIAL → AI_APPLY)로 한정**하고, **"실제 버튼/입력 조작감"을 시각 레이어로 추가**하여 Cursor.com demo-window 이상의 체감을 확보한다.

---

## 1. Phase 1 실행 범위

### 1-1. 범위 매트릭스

| 구분 | Phase 1 (이번) | Phase 2 (후순위) |
|------|---------------|-----------------|
| 복제 범위 | ai-register main **전체 컴포넌트** | 변경 없음 |
| 시연 플로우 | INITIAL → AI_INPUT → AI_EXTRACT → AI_APPLY | + COMPLETE (성공 다이얼로그) |
| 조작감 레이어 | 10개 시각 피드백 유틸 | 고도화/최적화 |
| 서사 아이디어 | — | 시간 압축, 실패 케이스, 주인공, Before/After, 입력 소스 다변화, Evidence 하이라이트, Hero 연결, 가이드 투어 (8종) |

### 1-2. 포함 / 제외

**포함**: §3 매니페스트 전체 컴포넌트 복제(AiPanel + OrderForm 전 섹션), 4단계 PREVIEW_STEPS, 조작감 강화 시각 레이어
**제외(Phase 2 유보)**: COMPLETE 단계 등록 확정 연출, RegisterSuccessDialog **플로우 호출**(파일은 복제), 서사 아이디어 8종

---

## 2. 설계 철학

### 2-1. 원칙

| 원칙 | 설명 |
|------|------|
| Dumb Components | 모든 컴포넌트는 stateless, props in → JSX out |
| Data Injection | 상태는 상위 `DashboardPreview`가 props로 주입 |
| No Side Effects | `useEffect`는 **시각 효과(애니메이션)에만 허용**. 네트워크/스토어 금지 |
| Framework-Free Core | zustand/react-query/react-hook-form 등 무거운 의존성 미도입 |
| Cursor Fidelity | Cursor demo-window 수준 — 실제 구조 인지 가능, 단 입력 불가 |
| **Tactile Visual Layer** (신규) | "입력 불가" 기조 위에 **시각 피드백 전용 인터랙션 레이어**. state 변경/API 호출 없이 조작감만 연출 |

### 2-2. 무엇을 복제하고 무엇을 제거하는가

| 항목 | 원본 ai-register | 복제 후 (landing) |
|------|-----------------|-----------------|
| DOM 구조 | 실제 제품 구조 | **동일** |
| 시각 스타일 | Tailwind/shadcn | **동일** |
| Zustand 스토어 | `useOrderRegisterStore` 등 5+개 | ❌ props 주입 |
| React Hook Form | `useForm<IOrderRegisterData>()` | ❌ static values |
| API Client | `/api/ai/extract-order` 등 | ❌ mock 데이터 |
| Auth | 로그인 세션/회사ID | ❌ 고정 mock user |
| 라우터 | copy/edit 파라미터 | ❌ 항상 "new" |
| Dialog 포털 | AlertDialog, Dialog | △ 시각만 (기능 없음) |
| Framer Motion | 공유 | ✅ 유지 |
| Lucide Icons | 공유 | ✅ 유지 |

### 2-3. Cursor.com 패턴 대응

| Cursor demo 특징 | 우리 대응 |
|-----------------|----------|
| IDE의 실제 레이아웃 | ai-register `<main>` 레이아웃 그대로 |
| 텍스트 타이핑 애니메이션 | AiInputArea 변동 리듬 타이핑 (조작감 #1) |
| AI 제안 하이라이트 | AiResultButtons pending→applied + ripple (조작감 #4) |
| 코드 Diff 효과 | Form 필드 fade-in + fill-in caret (조작감 #6) |
| 파일트리 hover | Phase 2 히트 영역 hover + 툴팁 |

---

## 3. 복제 대상 매니페스트

`.references/code/mm-broker/app/broker/order/ai-register/` 하위 파일 복제.

| 파일 | 역할 | 복제 방식 |
|------|------|----------|
| `page.tsx` | 최상위 | `<main>` 내부만 복제 |
| `ai-panel.tsx` | AI 사이드바 | **DOM/스타일 1:1** |
| `ai-input-area.tsx` | 텍스트/이미지 입력 | DOM 복제, 입력 불가 |
| `ai-result-buttons.tsx` | 카테고리 버튼 그룹 | DOM 복제 |
| `ai-button-item.tsx` | 개별 AI 버튼 | DOM 복제, popover 시각만 |
| `ai-warning-badges.tsx` | 경고 뱃지 | DOM 복제 (신규) |
| `ai-extract-json-viewer.tsx` | JSON 뷰어 | DOM 복제 (신규, 접힘) |
| `register-form.tsx` | 폼 전체 | DOM 복제 |
| `cargo-info-form.tsx` | 차량/화물 | DOM 복제 |
| `location-form.tsx` | 주소 폼 | DOM 복제 |
| `datetime/*` | 날짜·시간 | DOM 복제 |
| `transport-option-card.tsx` | 운송 옵션 | DOM 복제 |
| `option-selector.tsx` | 옵션 선택기 | DOM 복제 |
| `estimate-info-card.tsx` | 거리/운임 | DOM 복제 |
| `company-manager-section.tsx` | 업체/담당자 | DOM 복제 (신규) |
| `company-manager-list.tsx` | 담당자 리스트 | DOM 복제 |
| `company-manager-form.tsx` | 업체 폼 | DOM 복제 |
| `company-warning.tsx` | 업체 경고 | DOM 복제 |
| `search-address-dialog.tsx` | 주소 검색 다이얼로그 | DOM 복제, 닫힌 상태만 |
| `company-manager-dialog.tsx` | 업체 다이얼로그 | 시각 스냅샷 (선택) |
| `register-success-dialog.tsx` | 성공 다이얼로그 | **Phase 1에서 복제만, 호출 없음** |
| `register-summary.tsx` | 주문 요약 | 제외 |

### 의존성 제거 대상

| 원본 import | 처리 |
|-------------|------|
| `@/store/*` | 제거 — props로 대체 |
| `react-hook-form` | 제거 — 정적 값 |
| `@tanstack/react-query` | 제거 |
| `next/navigation` | 제거 |
| `@/lib/api/*` | 제거 |
| `@/components/ui/*` (shadcn) | 유지 또는 선택 복제 (§4) |

---

## 4. shadcn/ui 처리 전략

### 추천: **3-C 하이브리드**

```
shadcn CLI 설치:
  - Button, Input, Textarea, Card, Badge

Tailwind 재작성:
  - Select → <div role="combobox">
  - Dialog/Popover → static snapshot
  - Calendar → static grid
  - Checkbox → <div> + icon
```

### 번들 영향 예측

| 방식 | 누적 bundle |
|------|------------|
| 현재 | 57.3kB |
| 3-A 전체 | 137kB |
| 3-B 재작성 | 77kB |
| **3-C 하이브리드** | **97kB** |

---

## 5. 파일 구조

```
apps/landing/src/
  components/
    dashboard-preview/
      dashboard-preview.tsx
      preview-chrome.tsx
      use-auto-play.ts
      use-interactive-mode.ts
      use-animated-number.ts
      step-indicator.tsx
      mobile-card-view.tsx
      interactive-overlay.tsx
      interactive-tooltip.tsx
      hit-areas.ts
      
      # ai-register 복제
      ai-register-main/
        index.tsx
        ai-panel/
          index.tsx
          ai-tab-bar.tsx
          ai-input-area.tsx
          ai-extract-button.tsx
          ai-result-buttons.tsx
          ai-button-item.tsx
          ai-warning-badges.tsx
          ai-extract-json-viewer.tsx
        order-form/
          index.tsx
          company-manager-section.tsx
          cargo-info-form.tsx
          location-form.tsx
          datetime-card.tsx
          transport-option-card.tsx
          estimate-info-card.tsx
          settlement-section.tsx
          register-success-dialog.tsx   # 복제만, 호출 없음
      
      # 조작감 레이어 유틸 (신규)
      interactions/
        use-fake-typing.ts              # 변동 리듬 타이핑
        use-button-press.ts             # scale + shadow press
        use-focus-walk.ts               # focus ring 순차 이동
        use-ripple.ts                   # click ripple
        use-fill-in-caret.ts            # 필드 fill-in caret
        use-number-rolling.ts           # 숫자 카운터 롤링
    
    ui/                                  # shadcn (3-C)
      button.tsx
      input.tsx
      textarea.tsx
      card.tsx
      badge.tsx
  
  lib/
    mock-data.ts                        # 4단계 기준 확장
    preview-steps.ts                    # 4단계 + interactions 타이밍 트랙
    utils.ts
```

---

## 6. 데이터 모델 (mock-data.ts)

```typescript
interface PreviewMockData {
  aiInput: {
    activeTab: 'text' | 'image'
    textValue: string
    imagePreviewUrl?: string
  }
  
  aiResult: {
    extractState: 'idle' | 'loading' | 'resultReady'
    categories: AiCategoryGroup[]
    warnings: string[]
    evidence: Record<string, string>
    jsonViewerOpen: boolean
  }
  
  formData: {
    company: { id, name, businessNumber, ceoName }
    manager: { id, name, contact, email, department }
    availableManagers: Array<{ id, name, department }>
    pickup: {
      company, address, roadAddress, jibunAddress, detailAddress
      latitude, longitude, contactName, contactPhone
      date, time, datePresetActive?
    }
    delivery: { /* 동일 */ }
    vehicle: { type, weight, recentCargoSuggestions }
    cargo: { name, remark }
    options: { fast, roundTrip, direct, trace, forklift, manual, cod, special }
    estimate: { distance, duration, amount, autoDispatch }
    settlement: {
      chargeBaseAmount, dispatchBaseAmount
      additionalFees: Array<{ id, type, amount, memo, target }>
      totals: { chargeTotal, dispatchTotal, profit }
    }
    dialogs: {
      searchAddress: { open: boolean; query? }
      companyManager: { open: boolean }
      success: { open: boolean; orderId? }   // Phase 1에서 항상 false
    }
  }
  
  tooltips: Record<string, string>
}

interface AiCategoryGroup {
  id: 'departure' | 'destination' | 'cargo' | 'fare'
  label: string
  icon: 'MapPin' | 'Flag' | 'Package' | 'Banknote'
  buttons: Array<{
    id, fieldKey, label, displayValue
    status: 'pending' | 'applied' | 'unavailable'
    unavailableReason?, fallbackQuery?, evidenceSnippet?
  }>
}
```

---

## 7. Step 상태 스냅샷 (4단계 한정)

### 7-1. 플로우 다이어그램

```
[INITIAL] ──▶ [AI_INPUT] ──▶ [AI_EXTRACT] ──▶ [AI_APPLY]   ⊗ COMPLETE (Phase 2)
  빈 폼        텍스트 타이핑     추출 로딩        필드 적용
```

### 7-2. PreviewStep 확장 스키마

```typescript
interface PreviewStep {
  id: StepId
  label: string
  duration: number
  aiState: AiStateSnapshot
  formState: FormStateSnapshot
  interactions?: {                         // 신규 타이밍 트랙
    typingRhythm?: TypingRhythmConfig
    focusWalk?: string[]
    pressTargets?: string[]
    fillInFields?: Array<{ fieldId: string; value: string; delay: number }>
  }
}

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
  successDialogOpen: false             // Phase 1 고정
}
```

### 7-3. Step 변화 매트릭스

| Step | aiInput | extractState | buttons | form fields | 조작감 레이어 |
|------|---------|--------------|---------|-------------|-------------|
| INITIAL | empty | idle | all pending | all empty | caret 대기 |
| AI_INPUT | typing | idle | all pending | empty | #1 fake-typing |
| AI_EXTRACT | filled | loading | all pending | empty | #3 button-press + spinner |
| AI_APPLY | filled | resultReady | pending→applied 순차 | fill-in 순차 | #4 ripple + #6 fill-in + #8 number-rolling |

---

## 8. 상태 관리 아키텍처

### 8-1. 단일 방향 데이터 흐름

```
DashboardPreview (state: currentStep, mode)
        │
        │ PREVIEW_STEPS[currentStep] → { aiState, formState, interactions }
        ▼
AiRegisterMain (props: aiState, formState, interactions)
        ├─ AiPanel (props: aiState + interactions.typingRhythm/focusWalk/pressTargets)
        │    ├─ AiInputArea
        │    ├─ AiExtractButton
        │    └─ AiResultButtons
        │
        └─ OrderForm (props: formState + interactions.fillInFields)
             ├─ CompanyManagerSection
             ├─ LocationForm x2
             ├─ CargoInfoForm
             ├─ TransportOptionCard
             ├─ EstimateInfoCard
             ├─ SettlementSection
             └─ RegisterSuccessDialog (always hidden in Phase 1)
```

### 8-2. 없는 것들

- ❌ Zustand / RHF / React Query / useReducer (PREVIEW_STEPS가 컴파일타임 reducer 역할)

---

## 9. 반응형 전략

| 뷰포트 | 전략 |
|--------|------|
| Desktop ≥1024 | scale 0.45, 전체 main 재현 |
| Tablet 768~1023 | scale 0.32, 전체 main (옵션 1 추천) |
| Mobile <768 | MobileCardView 유지 |

---

## 10. Phase 2 인터랙티브 모드 (히트 영역)

| 카테고리 | 영역 | 수 |
|---------|------|---|
| AI Panel | tab-bar, textarea, extract-button, 결과 버튼, warnings, json-viewer | 7~8 |
| Form | company-manager, pickup, delivery, datetime x2, cargo, options, estimate, settlement, auto-dispatch | 10 |
| 다이얼로그 | search-address (시각), success (Phase 2에서만 활성) | 2 |

**Phase 1**: AI_APPLY 경로 상 히트 영역 우선 활성화. Settlement/Dialog는 정적 존재만.

---

## 11. 조작감 강화 레이어 (신규)

### 11-1. 원칙

- **시각 피드백 전용**: React state 변경/API 호출 없음
- **useEffect 허용 범위**: 애니메이션 타이밍 제어에 한정
- 모든 애니메이션은 `transform` / `opacity` 중심
- `prefers-reduced-motion` 시 즉시 최종 상태 fallback
- 한 Step당 총 애니 지속 시간 2초 이내

### 11-2. 조작감 아이디어 10종

| # | 아이디어 | 적용 컴포넌트 | Step | 유틸 |
|---|---------|-------------|------|------|
| 1 | 변동 리듬 타이핑 (고유명사 느리게, 조사 빠르게) | `AiInputArea` | AI_INPUT | use-fake-typing |
| 2 | Focus Ring 순차 이동 (Tab 키 감각) | Input→Extract→Results | Step 전환 시 | use-focus-walk |
| 3 | Button Press 물리 (scale 0.97 + shadow, 150ms) | `AiExtractButton`, `AiButtonItem` | AI_EXTRACT, AI_APPLY | use-button-press |
| 4 | Ripple / Click Wave | `AiButtonItem` | AI_APPLY | use-ripple |
| 5 | Hover→Active 상태 전환 | `AiResultButtons` | AI_APPLY 직전 | CSS only |
| 6 | 필드 Fill-in Caret | Location/Cargo/DateTime/Company 모든 필드 | AI_APPLY | use-fill-in-caret |
| 7 | Dropdown 펼침 순간 (열림→하이라이트→닫힘) | `CargoInfoForm` select | AI_APPLY | 전용 prop |
| 8 | 숫자 카운터 롤링 | `EstimateInfoCard` 거리·운임 | AI_APPLY | use-number-rolling |
| 9 | Toggle/Checkbox stroke 애니 | `TransportOptionCard` 8옵션, 자동 배차 | AI_APPLY | CSS + SVG stroke |
| 10 | Section Scroll Snap + Border Pulse | `OrderForm` 섹션 | AI_APPLY 중 | scrollIntoView + CSS |

### 11-3. 우선순위

- **MVP (필수 4개)**: #1, #3, #6, #8 — 타이핑·버튼·필드·숫자의 기본 조작감 축
- **Nice-to-have (6개)**: #2, #4, #5, #7, #9, #10 — 공수/효과 저울질 후 순차 추가

---

## 12. 성능 전략

### 번들 예산 재협상

| 예산 | 현재 | Phase 1 제안 |
|------|------|-----------|
| Dashboard Preview chunk | 30KB | **80~100KB** |
| 전체 landing Page | 57.3KB | **130~150KB** |
| First Load JS (shared) | 102KB | 102KB |
| 총 First Load | 159KB | **232~252KB** |

### 최적화 기법

1. Dynamic import + lazy loading (Mobile/Desktop 분할)
2. Code splitting — `ai-register-main` Hero 진입 후 `requestIdleCallback` 로드
3. Tree-shaking (shadcn 3-C)
4. Font/Image 최적화 (SVG placeholder)

### LCP 전략

- 현재 LCP: `h1` "운송 운영을 한눈에"
- Dashboard Preview는 `delay: 0.6` 이후 로드 (LCP 미포함)
- Lighthouse CI로 LCP +100ms 미만 확인

---

## 13. 구현 단계 (Phase 1)

### Milestone 1: 기반 (3일)

- [ ] mock-data.ts 4단계 스키마 + 값
- [ ] preview-steps.ts + interactions 타이밍 트랙
- [ ] ai-register-main/index.tsx shell
- [ ] shadcn 3-C 설치
- [ ] interactions/ 유틸 6개 스캐폴드

### Milestone 2: AI Panel + 조작감 MVP (4~5일)

- [ ] AiPanel 6개 컴포넌트 TDD 복제
- [ ] 조작감 #1 (fake-typing), #3 (button-press) 통합
- [ ] INITIAL → AI_EXTRACT 시각 연결
- [ ] 스크린샷 비교 테스트

### Milestone 3: Order Form 복제 (5~7일)

- [ ] order-form 8개 컴포넌트 TDD 복제 (SuccessDialog 포함, 호출 없음)
- [ ] 조작감 #6 (fill-in caret), #8 (number-rolling), #9 (toggle stroke) 통합
- [ ] AI_APPLY 필드 순차 채움 연출

### Milestone 4: 조작감 나머지 + 히트 영역 재매핑 (3~4일)

- [ ] 조작감 #2, #4, #5, #7, #10 통합
- [ ] hit-areas.ts 재작성 (AI_APPLY 경로 우선)
- [ ] tooltips 확장

### Milestone 5: 반응형 + 성능 + 최종 검증 (3일)

- [ ] Desktop scale 0.45, Tablet scale 0.32 검증
- [ ] Dynamic import + prefers-reduced-motion fallback
- [ ] Lighthouse CI / 번들 크기 승인
- [ ] hero.tsx 통합

**Phase 1 총 예상**: 18~22일 (1명 FT)

---

## 14. 리스크 및 대응

| # | 리스크 | 영향 | 확률 | 대응 |
|---|--------|------|------|------|
| R1 | 번들 30KB 초과 → 승인 거절 | 높음 | 높음 | 사전 재협상 + Cursor 벤치마크 |
| R2 | shadcn 설치 시 Radix 의존성 폭증 | 중간 | 중간 | 3-C 하이브리드로 필수 5개만 |
| R3 | 원본 broker drift | 중간 | 높음 | 분기별 스크린샷 diff |
| R4 | 복제 공수 과소평가 | 높음 | 중간 | Milestone 2 전 AiPanel spike 1일 |
| R5 | Tablet scale 0.32 가독성 | 중간 | 낮음 | A/B 테스트 |
| R6 | 시각 다이얼로그 난이도 | 낮음 | 중간 | Phase 2로 유보 |
| R7 | 테스트 300개 재작성 | 높음 | 매우 높음 | legacy 격리 + 병행 |
| **R8** | **조작감 애니 과다로 LCP/TBT 악화** | 중간 | 중간 | §11-1 원칙 준수 + Lighthouse CI |
| **R9** | **prefers-reduced-motion에서 플로우 어색** | 낮음 | 중간 | 각 Step 최종 상태로 즉시 스냅 fallback |

---

## 15. 선결 질문

1. 번들 예산 30KB → **80~100KB** 수용 가능?
2. broker 앱 통합 일정 — 6개월 이내?
3. shadcn 도입 방침 — 3-C 하이브리드 확정?
4. Mobile 전략 — MobileCardView 유지?
5. Tablet 레이아웃 — scale 0.32?
6. 다이얼로그 처리 — 검색 닫힘 + Success는 Phase 2?
7. 테스트 스트래티지 — legacy 격리 + 신규 작성?
8. 마이그레이션 방식 — Feature flag 병행?
9. **(신규)** 조작감 MVP 4개(#1, #3, #6, #8) 선착수 합의?

---

## 16. 성공 기준

### 정량 지표

| 지표 | Phase 1 목표 |
|------|-----------|
| 픽셀 정확도 | 실제 ai-register와 95%+ 일치 (COMPLETE 제외 구간) |
| 번들 크기 | 재협상 예산 내 |
| LCP | +100ms 미만 |
| 테스트 커버리지 | 신규 컴포넌트 80%+ |
| 조작감 체감 | 사내 블라인드 테스트 "실제 앱처럼 느껴짐" 4/5+ |

### 정성 지표

- 내부 이해관계자: "실제 제품 같다" 5/5
- 외부 사용자 블라인드 테스트는 Phase 2(COMPLETE 포함)에서 측정

---

## 17. 문서 간 관계

```
IMP-DASH-001.md (부모, 이슈 등록)
    ├── Cursor.com 레퍼런스
    ├── 영향도 분석
    └── 재진입 지점 권고
        │
        └── IMP-DASH-001-option-b-spec.md (Option B 원본 설계)
            │
            └── IMP-DASH-001-option-b-spec-phase1.md (본 문서)
                ├── 복제 범위 전체 유지
                ├── 플로우 4단계 한정
                ├── 조작감 레이어 10종
                └── Phase 2 유보 명시
```

---

## 18. 다음 액션

1. **§15 선결 질문 중 Q1/Q2/Q7/Q9 먼저 의사결정**
2. **Spike (1일)**: AiPanel 하나 + 조작감 #1, #3 검증
3. 파이프라인 진입: `/plan-idea "dash-preview Phase 3: Pixel-Perfect Preview"` (신규 IDEA 권장)
4. Phase 2 착수 시점: Phase 1 완료 + 내부 리뷰 통과 이후

---

## 변경 이력

| 날짜 | 변경 | 비고 |
|------|------|------|
| 2026-04-15 | 초안 작성 | Option B 상세 설계 (원본) |
| 2026-04-17 | Phase 1 통합안 | 전체 복제 + 플로우 4단계 한정 + 조작감 10종 추가 |
