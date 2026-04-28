# IMP-DASH-001 Option B 상세 설계 — landing 내부 복제 방식

> **Parent**: [IMP-DASH-001.md](./IMP-DASH-001.md)
> **Reference**: Cursor.com `demo-window-cursor-ide`
> **Status**: draft
> **Created**: 2026-04-15

---

## 0. 한 줄 요약

`ai-register/page.tsx`의 **main 콘텐츠 영역**(AiPanel + OrderRegisterForm)을 **landing 앱 내부에 시각 모형으로 복제**하여 Cursor.com demo-window 수준의 픽셀 정확도를 확보한다. 실제 API/스토어/인증 로직은 모두 제거하고 props 기반 stateless 컴포넌트로 재작성한다.

---

## 1. 설계 철학

### 1-1. 원칙

| 원칙 | 설명 |
|------|------|
| **Dumb Components** | 모든 컴포넌트는 stateless, props in → JSX out. 스토어/API/라우터 의존 제거 |
| **Data Injection** | 상태는 상위 `DashboardPreview`가 `PREVIEW_STEPS`의 스냅샷에서 props로 주입 |
| **No Side Effects** | `useEffect`는 시각 효과(애니메이션)에만. 네트워크/스토어 금지 |
| **Framework-Free Core** | zustand/react-query/react-hook-form 등 무거운 의존성 미도입 |
| **Cursor Fidelity** | Cursor demo-window 수준 — 실제 구조 인지 가능, 단 입력 불가 |

### 1-2. 무엇을 복제하고, 무엇을 제거하는가

| 항목 | 원본 ai-register | 복제 후 (landing) |
|------|-----------------|-----------------|
| DOM 구조 | 실제 제품 구조 | **동일 (픽셀 정확도 목표)** |
| 시각 스타일 | Tailwind/shadcn | **동일 (디자인 토큰 공유)** |
| Zustand 스토어 | `useOrderRegisterStore`, `useAiApplyStore` 등 5+개 | ❌ 제거 — props 주입 |
| React Hook Form | `useForm<IOrderRegisterData>()` | ❌ 제거 — static values |
| API Client | `/api/ai/extract-order`, 회사/담당자 목록 등 | ❌ 제거 — mock 데이터 |
| Auth (`useAuthStore`) | 로그인 세션/회사ID 참조 | ❌ 제거 — 고정 mock user |
| 라우터 (`searchParams`) | copy/edit 모드 파라미터 | ❌ 제거 — 항상 "new" 상태 |
| Dialog 포털 | AlertDialog, Dialog 등 | △ 일부 **시각만** (기능 없음) |
| Framer Motion | 이미 공유 | ✅ 유지 |
| Lucide Icons | 이미 공유 | ✅ 유지 |

### 1-3. Cursor.com 패턴과의 대응

| Cursor demo 특징 | 우리 대응 |
|-----------------|----------|
| IDE의 실제 레이아웃 | ai-register page.tsx `<main>` 레이아웃 그대로 |
| 텍스트 타이핑 애니메이션 | AiInputArea 카카오톡 메시지 타이핑 (기존 유지) |
| AI 제안 하이라이트 | AiResultButtons pending → applied 전환 (기존 유지) |
| 코드 Diff 효과 | Form 필드 fade-in + glow (기존 유지) |
| 파일트리 hover | Phase 2 히트 영역 hover + 툴팁 (기존 유지) |

---

## 2. 복제 대상 매니페스트

### 2-1. 원본 파일 (참조)

`.references/code/mm-broker/app/broker/order/ai-register/` 하위 파일:

| 파일 | 역할 | 복제 방식 |
|------|------|----------|
| `page.tsx` | 최상위 페이지 | `<main>` 내부 구조만 복제, shell 제거 |
| `_components/ai-panel.tsx` | AI 사이드바 | **DOM/스타일 1:1 복제**, 이벤트 제거 |
| `_components/ai-input-area.tsx` | 텍스트/이미지 입력 | DOM 복제, 실제 입력 불가 |
| `_components/ai-result-buttons.tsx` | 카테고리 버튼 그룹 | DOM 복제, 클릭 시 mock만 |
| `_components/ai-button-item.tsx` | 개별 AI 버튼 | DOM 복제, popover 시각만 |
| `_components/ai-warning-badges.tsx` | 경고 뱃지 | DOM 복제 (신규) |
| `_components/ai-extract-json-viewer.tsx` | JSON 뷰어 | DOM 복제 (신규, 접힌 상태 기본) |
| `_components/register-form.tsx` | 폼 전체 | DOM 복제, form 엘리먼트만 |
| `_components/cargo-info-form.tsx` | 차량/화물 | DOM 복제, select 시각만 |
| `_components/location-form.tsx` | 주소 폼 | DOM 복제, 검색 다이얼로그 시각만 |
| `_components/datetime/*` | 날짜·시간 | DOM 복제, 캘린더 시각만 |
| `_components/transport-option-card.tsx` | 운송 옵션 | DOM 복제, 토글만 |
| `_components/option-selector.tsx` | 옵션 선택기 | DOM 복제 |
| `_components/estimate-info-card.tsx` | 거리/운임 카드 | DOM 복제 |
| `_components/company-manager-section.tsx` | 업체/담당자 | DOM 복제 (신규 추가) |
| `_components/company-manager-list.tsx` | 담당자 리스트 | DOM 복제 |
| `_components/company-manager-form.tsx` | 업체 폼 | DOM 복제 |
| `_components/company-warning.tsx` | 업체 경고 | DOM 복제 |
| `_components/search-address-dialog.tsx` | 주소 검색 다이얼로그 | DOM 복제, 닫힌 상태만 |
| `_components/company-manager-dialog.tsx` | 업체 다이얼로그 | 시각 스냅샷 (선택) |
| `_components/register-success-dialog.tsx` | 성공 다이얼로그 | Step 5 COMPLETE 시에만 표시 |
| `_components/register-summary.tsx` | 주문 요약 모달 | 제외 (시나리오 외) |

### 2-2. 의존성 제거 대상

| 원본 import | 처리 |
|-------------|------|
| `@/store/useOrderRegisterStore` | 제거 — props로 대체 |
| `@/store/useAuthStore` | 제거 — mock user 상수 |
| `@/store/useCompanyStore` | 제거 — PREVIEW_MOCK_DATA에 |
| `@/store/useBrokerCompanyManagerStore` | 제거 — mock list 상수 |
| `react-hook-form` | 제거 — 정적 값 |
| `@tanstack/react-query` | 제거 — async 없음 |
| `next/navigation` (`useSearchParams`) | 제거 — 항상 new |
| `@/lib/api/*` | 제거 |
| `@/components/ui/*` (shadcn) | **유지 또는 선택 복제** (아래 §3 참조) |

---

## 3. shadcn/ui 처리 전략

원본 broker 앱은 shadcn/ui 컴포넌트를 다수 사용한다 (`Button`, `Input`, `Select`, `Card`, `Dialog`, `Popover`, `Checkbox`, `Calendar`, `Badge` 등).

### 옵션

| 방식 | 장점 | 단점 |
|------|------|------|
| **3-A. shadcn CLI로 landing에 설치** | 원본과 동일, 복제 품질 최고 | 번들 증가 (+50~80KB), Radix 의존성 도입 |
| **3-B. Tailwind 프리미티브로 재작성** | 번들 최소, 정적 빌드 최적 | 작업량 많음, 스타일 편차 위험 |
| **3-C. 하이브리드** — shadcn 선택 설치 + 나머지 재작성 | 균형 | 판단 기준 필요 |

### 추천: **3-C 하이브리드**

```
shadcn CLI 설치:
  - Button, Input, Textarea (사용 빈도 높음)
  - Card (shell 역할)
  - Badge (상태 표시)

Tailwind 재작성:
  - Select → <div role="combobox"> (기능 불필요)
  - Dialog/Popover → static snapshot (열림 상태 하드코딩 or 미표시)
  - Calendar → static grid
  - Checkbox → <div> + icon
```

### 번들 영향 예측

| 방식 | 예상 증가 | 누적 bundle |
|------|----------|------------|
| 현재 | — | 57.3kB |
| 3-A 전체 | +80kB | 137kB |
| 3-B 재작성 | +20kB | 77kB |
| 3-C 하이브리드 | +40kB | 97kB |

번들 예산 재협상 필요 (REQ-DASH-030).

---

## 4. 파일 구조

```
apps/landing/src/
  components/
    dashboard-preview/
      dashboard-preview.tsx             # [유지] 최상위 컨테이너 (Phase 1+2 통합)
      preview-chrome.tsx                # [유지] Chrome + ScaledContent
      use-auto-play.ts                  # [유지]
      use-interactive-mode.ts           # [유지]
      use-animated-number.ts            # [유지]
      step-indicator.tsx                # [유지]
      mobile-card-view.tsx              # [유지]
      interactive-overlay.tsx           # [유지]
      interactive-tooltip.tsx           # [유지]
      hit-areas.ts                      # [업데이트] 새 UI 좌표 재계산
      │
      # ↓ 이하 신규 (ai-register 복제)
      ai-register-main/
        index.tsx                        # 이 feature의 main — ai-register page.tsx main 내부 재현
        ai-panel/
          index.tsx                      # AiPanel 래퍼
          ai-tab-bar.tsx                 # 텍스트/이미지 탭
          ai-input-area.tsx              # textarea + 업로드 영역
          ai-extract-button.tsx          # 추출하기 버튼 (상태 확장)
          ai-result-buttons.tsx          # 4 카테고리 + 내부 버튼들
          ai-button-item.tsx             # 개별 pending/applied/unavailable
          ai-warning-badges.tsx          # 경고 뱃지
          ai-extract-json-viewer.tsx     # 하단 JSON (접힘)
        order-form/
          index.tsx                      # register-form.tsx 레이아웃
          company-manager-section.tsx    # 업체/담당자 (신규)
          cargo-info-form.tsx            # 차량/중량/화물명
          location-form.tsx              # 상차/하차 주소 (2회 호출)
          datetime-card.tsx              # 날짜/시간 카드 (2회 호출)
          transport-option-card.tsx      # 8개 옵션
          estimate-info-card.tsx         # 거리/운임
          settlement-section.tsx         # 정산 영역 (신규)
          register-success-dialog.tsx    # Step 5 완료 다이얼로그 (시각)
      │
      # 기존 (deprecated 예정)
      ai-panel-preview.tsx              # [DEPRECATED] ai-register-main/ai-panel/로 대체
      form-preview.tsx                  # [DEPRECATED] ai-register-main/order-form/으로 대체

    ui/                                  # shadcn/ui (3-C 하이브리드로 선택 설치)
      button.tsx
      input.tsx
      textarea.tsx
      card.tsx
      badge.tsx

  lib/
    mock-data.ts                         # [대폭 확장] ai-register의 모든 필드 스키마 반영
    preview-steps.ts                     # [확장] Step별 신규 상태 반영
    utils.ts                             # [유지] cn()
```

---

## 5. 데이터 모델 (mock-data.ts 확장)

### 5-1. 현재 구조

```typescript
interface PreviewMockData {
  aiInput: { message: string }
  aiResult: { categories: Array<{ id, label, icon, buttons: [...] }> }
  formData: { pickup, delivery, vehicle, cargo, options, estimate }
  tooltips: Record<string, string>
}
```

### 5-2. 확장 구조

```typescript
interface PreviewMockData {
  // --- AI Panel ---
  aiInput: {
    activeTab: 'text' | 'image'
    textValue: string
    imagePreviewUrl?: string  // Step 2에서 점진적 표시
  }
  
  aiResult: {
    extractState: 'idle' | 'loading' | 'resultReady'
    categories: AiCategoryGroup[]  // 아래 상세
    warnings: string[]             // ["datetime_ambiguous", "multi_order_suspected"]
    evidence: Record<string, string>  // 원본 추출 근거 텍스트 (JSON 뷰어용)
    jsonViewerOpen: boolean        // false (기본 접힘)
  }
  
  // --- Form ---
  formData: {
    // 신규: 업체/담당자
    company: {
      id: string
      name: string
      businessNumber: string
      ceoName: string
    }
    manager: {
      id: string
      name: string
      contact: string
      email: string
      department: string
    }
    availableManagers: Array<{ id, name, department }>  // company-manager-list에 표시
    
    // 기존: 위치 (확장)
    pickup: {
      company: string
      address: string
      roadAddress: string
      jibunAddress: string
      detailAddress: string
      latitude: number
      longitude: number
      contactName: string
      contactPhone: string
      date: string
      time: string
      datePresetActive?: '지금' | '오늘' | '내일'
    }
    delivery: { /* 동일 구조 */ }
    
    // 차량/화물
    vehicle: {
      type: '카고' | '윙바디' | '탑차' | ...  // ORDER_VEHICLE_TYPES
      weight: '1톤' | '2.5톤' | '5톤' | ...    // ORDER_VEHICLE_WEIGHTS
      recentCargoSuggestions: string[]  // 최근 화물 (드롭다운 아래)
    }
    cargo: {
      name: string
      remark: string
    }
    
    // 옵션 (8개)
    options: {
      fast: boolean
      roundTrip: boolean
      direct: boolean
      trace: boolean
      forklift: boolean
      manual: boolean
      cod: boolean
      special: boolean
    }
    
    // 추정
    estimate: {
      distance: number      // km
      duration: number      // minutes
      amount: number        // 원
      autoDispatch: boolean // 자동 배차 토글
    }
    
    // 정산 (신규)
    settlement: {
      chargeBaseAmount: number
      dispatchBaseAmount: number
      additionalFees: Array<{
        id: string
        type: '대기' | '고속' | '커스텀'
        amount: number
        memo: string
        target: { charge: boolean; dispatch: boolean }
      }>
      totals: {
        chargeTotal: number
        dispatchTotal: number
        profit: number
      }
    }
    
    // 시각 다이얼로그 상태 (정적 스냅샷)
    dialogs: {
      searchAddress: { open: boolean; query?: string }
      companyManager: { open: boolean }
      success: { open: boolean; orderId?: string }
    }
  }
  
  tooltips: Record<string, string>  // [확장] 새 히트 영역 추가
}

interface AiCategoryGroup {
  id: 'departure' | 'destination' | 'cargo' | 'fare'
  label: string
  icon: 'MapPin' | 'Flag' | 'Package' | 'Banknote'
  buttons: Array<{
    id: string
    fieldKey: string
    label: string
    displayValue: string
    status: 'pending' | 'applied' | 'unavailable'
    unavailableReason?: string
    fallbackQuery?: string
    evidenceSnippet?: string
  }>
}
```

### 5-3. Mock 데이터 분량 추정

| 섹션 | 필드 수 | 대략 크기 (JSON) |
|------|--------|-----------------|
| aiInput | 3 | ~300 B |
| aiResult | 10+ | ~2 KB |
| formData | 40+ | ~3 KB |
| tooltips | 15+ (확장 후) | ~1 KB |
| **합계** | | **~6 KB** (minified, non-gzipped) |

---

## 6. Step별 상태 스냅샷 확장

### 6-1. PREVIEW_STEPS 구조 확장

```typescript
interface PreviewStep {
  id: StepId
  label: string
  duration: number
  // 기존 aiPanelState / formState 를 더 세분화
  aiState: AiStateSnapshot          // 이전 AiPanelState 확장
  formState: FormStateSnapshot      // 이전 FormState 확장
}

interface AiStateSnapshot {
  activeTab: 'text' | 'image'
  textProgress: number              // 0~1 (타이핑 진행률)
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
  optionsActive: string[]            // ['direct', 'forklift'] 등
  estimateVisible: boolean
  settlementVisible: boolean
  highlightedSection: string | null  // hover/glow 대상
  successDialogOpen: boolean         // Step 5에서 true
}
```

### 6-2. 단계별 변화 매트릭스 (예시)

| Step | companyManager | pickup | delivery | dateTime | vehicle | cargo | options | estimate | settlement | dialog |
|------|----------------|--------|----------|----------|---------|-------|---------|----------|-----------|--------|
| INITIAL | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | — |
| AI_INPUT | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | — |
| AI_EXTRACT | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | — |
| AI_APPLY | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅(2개) | ✅ | ✅ | — |
| COMPLETE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **success** |

---

## 7. 상태 관리 아키텍처

### 7-1. 단일 방향 데이터 흐름

```
DashboardPreview (state: currentStep, mode)
        │
        │ PREVIEW_STEPS[currentStep] → { aiState, formState }
        ▼
AiRegisterMain (props: aiState, formState)
        ├─ AiPanel (props: aiState)
        │    ├─ AiInputArea (props: aiState.activeTab, textProgress)
        │    ├─ AiExtractButton (props: aiState.extractState)
        │    └─ AiResultButtons (props: aiState.buttons)
        │
        └─ OrderForm (props: formState)
             ├─ CompanyManagerSection (props: formState.companyManagerFilled)
             ├─ LocationForm (props: formState.pickup + pickupDateTime)
             ├─ LocationForm (props: formState.delivery + deliveryDateTime)
             ├─ CargoInfoForm (props: formState.vehicle + cargo)
             ├─ TransportOptionCard (props: formState.optionsActive)
             ├─ EstimateInfoCard (props: formState.estimate)
             └─ SettlementSection (props: formState.settlement)
```

### 7-2. 없는 것들 (원본에 있었지만 우리에게 없는)

- ❌ Zustand slice/middleware
- ❌ React Hook Form register/watch
- ❌ React Query invalidate
- ❌ useReducer (PREVIEW_STEPS가 이미 컴파일타임 reducer 역할)

---

## 8. 반응형 전략 (확장)

### 8-1. 현재 vs 개선 후

| 뷰포트 | 현재 | 개선 후 |
|--------|------|--------|
| Desktop ≥1024 | scale 0.45, 5 Card 축약 | **scale 0.45, 전체 ai-register main 재현** |
| Tablet 768~1023 | scale 0.38, 축약 | **scale 0.38, ai-register main (일부 선택 축약 가능)** |
| Mobile <768 | MobileCardView (별도) | **MobileCardView 유지** (복잡한 UI를 모바일에 축소하는 것은 의미 없음) |

### 8-2. Tablet에서의 타협점

ai-register의 실제 레이아웃이 Tablet에 맞지 않으면:

- 옵션 1: Tablet에서도 Desktop 뷰 그대로 scale 0.32 등으로 더 축소
- 옵션 2: Tablet에서 AiPanel width를 축소 (380 → 280)
- 옵션 3: Tablet에서는 현재의 축약 뷰 유지 (불일치 감수)

→ **옵션 1** 추천 (픽셀 정확도 유지, 시각 밀도만 조정)

---

## 9. Phase 2 인터랙티브 모드 재구성

### 9-1. 히트 영역 재매핑

현재 11개 히트 영역 → 실제 UI 구조에서 20~30개로 확장 가능.

**그러나 너무 많으면 사용자 피로도 증가**. 추천:

| 카테고리 | 영역 | 수 |
|---------|------|---|
| AI Panel | tab-bar, textarea, extract-button, 각 결과 버튼, warnings, json-viewer | 7~8 |
| Form | company-manager, pickup-location, delivery-location, pickup-datetime, delivery-datetime, cargo-info, transport-options, estimate, settlement, auto-dispatch-toggle | 10 |
| 다이얼로그 | search-address (시각만), success-dialog (Step 5 한정) | 2 |

**총 ~20개** (Desktop), **Tablet 10개로 축소**

### 9-2. 툴팁 재작성

실제 UI 요소에 맞춰 툴팁 텍스트 확장 필요 (현재 11개 → 20개).

예시:
- `company-manager`: "업체와 담당자를 선택하면 이후 필드들이 활성화됩니다"
- `pickup-location`: "주소 검색으로 정확한 위치를 지정할 수 있습니다"
- `auto-dispatch-toggle`: "체크하면 등록 즉시 배차대기 상태로 전환됩니다"

---

## 10. 성능 전략

### 10-1. 번들 예산 재협상

| 예산 항목 | 현재 | 개선 후 제안 |
|----------|------|-----------|
| Dashboard Preview chunk | 30KB | **80~100KB** |
| 전체 landing Page | 57.3KB | **130~150KB** |
| First Load JS (shared) | 102KB | 102KB (변경 없음) |
| **총 First Load** | 159KB | **232~252KB** |

### 10-2. 최적화 기법

1. **Dynamic import + lazy loading**: MobileCardView와 Desktop 뷰를 dynamic import로 분할 (모바일은 무거운 ai-register-main 로드 불필요)
2. **Code splitting**: `ai-register-main` 전체를 Hero 뷰포트 진입 후 `requestIdleCallback`으로 로드
3. **Tree-shaking**: shadcn 일부만 사용 (3-C 하이브리드)
4. **Font optimization**: 이미 Inter/Pretendard 공유, 추가 없음
5. **Image optimization**: Mock 이미지 업로드 프리뷰는 SVG placeholder로 대체

### 10-3. LCP 전략

- **현재 LCP 요소**: `h1` "운송 운영을 한눈에"
- **개선 후에도 유지**: Dashboard Preview는 `delay: 0.6` 이후 로드 (LCP 미포함)
- **검증**: Lighthouse CI로 LCP +100ms 미만 확인 (기존 REQ-DASH-031 유지)

---

## 11. 구현 단계 (마일스톤)

### Milestone 1: 기반 (3일)

- [ ] 새 `mock-data.ts` 스키마 작성 + 전체 값 채움
- [ ] 새 `preview-steps.ts` 스냅샷 5단계 구성
- [ ] `ai-register-main/index.tsx` 빈 shell + routing
- [ ] shadcn/ui 3-C 하이브리드 설치 (Button, Input, Card, Badge)
- [ ] 기존 테스트 유지하며 회귀 확인

### Milestone 2: AI Panel 복제 (3~4일)

- [ ] `ai-register-main/ai-panel/` 6개 컴포넌트 TDD 구현
- [ ] 기존 `ai-panel-preview.tsx` deprecated 처리
- [ ] Phase 1 자동 재생 시퀀스 연결
- [ ] 스크린샷 비교 테스트 (Playwright 또는 Chromatic)

### Milestone 3: Order Form 복제 (5~7일)

- [ ] `ai-register-main/order-form/` 8개 컴포넌트 TDD 구현
  - CompanyManagerSection (신규)
  - CargoInfoForm (확장)
  - LocationForm (확장)
  - DateTimeCard (확장)
  - TransportOptionCard (확장)
  - EstimateInfoCard (확장)
  - SettlementSection (신규)
  - RegisterSuccessDialog (신규, Step 5 전용)
- [ ] 기존 `form-preview.tsx` deprecated 처리
- [ ] Step별 상태 전환 시각 연결

### Milestone 4: 인터랙티브 모드 재매핑 (2~3일)

- [ ] `hit-areas.ts` 재작성 (20개 Desktop, 10개 Tablet)
- [ ] `mock-data.ts` tooltips 확장
- [ ] AREA_TO_STEP 매핑 재검토
- [ ] Phase 2 테스트 재작성

### Milestone 5: 반응형 재조정 (2일)

- [ ] Desktop scale 0.45 검증
- [ ] Tablet scale 0.32로 조정 + 테스트
- [ ] MobileCardView는 그대로 유지

### Milestone 6: 성능 + 최종 검증 (2~3일)

- [ ] Dynamic import 적용
- [ ] 번들 크기 측정 + 예산 승인
- [ ] Lighthouse CI LCP 검증
- [ ] 브라우저 시각 검증 (Phase 2 때와 동일 프로토콜)
- [ ] hero.tsx 통합

**총 예상: 17~22일** (1명 FT 기준)

---

## 12. 리스크 및 대응

| # | 리스크 | 영향 | 확률 | 대응 |
|---|--------|------|------|------|
| R1 | **번들 30KB 초과 → 승인 거절** | 높음 | 높음 | 사전 예산 재협상 (§10-1). Cursor.com의 실제 번들 크기 벤치마크 제시 |
| R2 | shadcn 설치 시 Radix 의존성으로 번들 폭증 | 중간 | 중간 | 3-C 하이브리드로 필수 3~5개만 |
| R3 | 원본 broker 앱이 변경되면 복제본 drift | 중간 | 높음 | 분기별 스크린샷 diff 체크 프로세스 수립 |
| R4 | 실제 ai-register 컴포넌트 내부 로직 복잡 (RHF, Zustand, Query) → 복제 공수 과소평가 | 높음 | 중간 | Milestone 2 전 spike 작업 (1일) — AiPanel 하나로 검증 |
| R5 | Tablet에서 scale 0.32 너무 작아 읽을 수 없음 | 중간 | 낮음 | A/B 테스트로 시각 임계값 확인 |
| R6 | 시각 다이얼로그(검색/성공) 구현 난이도 | 낮음 | 중간 | Step 5 한정 + static snapshot으로 단순화 |
| R7 | 테스트 300개 중 다수 재작성 필요 | 높음 | 매우 높음 | 기존 테스트는 점진적 마이그레이션, 병행 운영 |

---

## 13. 선결 질문 (착수 전 해소 필수)

1. **번들 예산 재협상**: 30KB → 80~100KB 수용 가능?
2. **broker 앱 통합 일정**: 6개월 이내 mologado 통합? → Option A 전환 시점 영향
3. **shadcn 도입 방침**: landing 앱에 shadcn/ui 전면 도입? (3-C 하이브리드 vs 전체)
4. **Mobile 전략**: MobileCardView 유지 vs 축소판 재시도?
5. **Tablet 레이아웃**: scale 더 축소 vs 축약 레이아웃 유지?
6. **다이얼로그 처리**: 시각 복제 vs 단순 스킵?
7. **테스트 스트래티지**: 기존 300개 중 몇 %를 재작성/폐기?
8. **마이그레이션 방식**: big-bang vs feature flag로 점진 전환?

---

## 14. 성공 기준

### 14-1. 정량 지표

| 지표 | 목표값 | 측정 방법 |
|------|--------|----------|
| 픽셀 정확도 | 실제 ai-register 스크린샷과 95%+ 일치 | Playwright visual regression |
| 번들 크기 | 재협상 예산 내 | `next build` output |
| LCP | +100ms 미만 유지 | Lighthouse CI |
| 테스트 커버리지 | 신규 컴포넌트 80%+ | Vitest coverage |
| 회귀 없음 | 기존 300 tests 유지 또는 마이그레이션 후 전체 pass | CI |

### 14-2. 정성 지표

- 내부 이해관계자 리뷰: "실제 제품 같다" 5/5 (현재 4/5 목표였음)
- 실제 OPTIC 사용자 블라인드 테스트: "스크린샷 vs demo 구분 불가" 70%+

---

## 15. 문서 간 관계

```
IMP-DASH-001.md (부모, 이슈 등록)
    ├── §3-1 Cursor.com 레퍼런스
    ├── §5 영향도 분석 (HIGH)
    └── §6 재진입 지점: P3 또는 새 IDEA
        │
        └── IMP-DASH-001-option-b-spec.md (이 문서, 상세 설계)
            ├── Cursor 벤치마크
            ├── 복제 매니페스트
            ├── 데이터 모델 확장
            ├── 마일스톤 17~22일
            └── 선결 질문 8개
```

---

## 16. 다음 액션

1. **선결 질문 §13 의사결정**: 특히 번들 예산 + shadcn 도입
2. **결정 후 파이프라인 진입 선택**:
   - `/plan-idea "dash-preview Phase 3: Pixel-Perfect Preview"` (새 IDEA로 재시작, 권장)
   - 또는 `/plan-improve dash-preview analyze IMP-DASH-001` (기존 IMP로 영향도 재분석)
3. **Spike (1일)**: AiPanel 하나만 선행 복제해 실제 복잡도 측정 → 이 문서 §11 마일스톤 보정
4. **Cursor.com DevTools 리버스 엔지니어링**: 실제 번들 크기, 렌더링 기법, 애니메이션 타이밍 벤치마크

---

## 변경 이력

| 날짜 | 변경 | 비고 |
|------|------|------|
| 2026-04-15 | 초안 작성 | Option B 상세 설계 |
