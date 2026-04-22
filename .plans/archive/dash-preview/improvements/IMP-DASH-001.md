# IMP-DASH-001: DashboardPreview를 실제 ai-register 레이아웃/컴포넌트로 완전 재현

> **Archive**: [dash-preview](../ARCHIVE-DASH.md)
> **Status**: draft
> **Created**: 2026-04-15
> **Category**: enhancement
> **Priority**: P1

---

## 1. 요청 요약 (한 줄)

현재 추려서 단순 재구성한 축소 뷰를 실제 `ai-register/page.tsx`의 레이아웃과 컴포넌트를 그대로 재현하여 "진짜 제품 화면의 스크린샷" 수준으로 픽셀 정확도를 확보한다.

---

## 2. 배경

### 현재 상태

Phase 1/2 구현에서는 **시각적 단순화**를 우선하여 다음과 같이 축약했다:

- `AiPanelPreview`: `AiPanel` 구조를 추려서 `AiTabBar` + `AiInputArea` + `AiResultButtons`만 재현
- `FormPreview`: 5개 Card 블록(CargoInfo, Location x2, TransportOptions, Estimate)만 유지, 실제 폼 필드 상세(Company/Manager, 주소 검색 UI, DateTime 셀렉터 등) 생략
- **실제 ai-register/page.tsx와는 다른 DOM 구조**로, 픽셀 정확도는 낮음

### 문제점

1. **신뢰감 한계**: "실제 제품 화면 같다"는 인상이 목표였으나, 실제 제품 사용자가 보면 다른 UI로 인지 가능
2. **유지보수 이중화**: 실제 제품 UI가 업데이트되면 축소 뷰도 수동으로 맞춰야 함
3. **설득력 감소**: 랜딩 방문자 중 실제 OPTIC 사용자 또는 시연 경험자가 진짜 화면과 차이를 발견하면 신뢰도 하락

### 요청자 의도

**"스크린샷처럼"** — 실제 제품을 캡처한 듯한 1:1 재현. 현재는 "비슷한 느낌"이지만 목표는 "실제 그 화면".

---

## 3. 범위 정의

### 포함 (In-scope)

1. **Form 영역 완전 재현**:
   - CompanyManagerInfoSection (업체/담당자 영역) — 현재 생략됨, 추가 필요
   - LocationFormVer01 x2 — 주소 검색 다이얼로그 UI까지 정적 재현
   - DateTimeCard x2 — 프리셋 버튼(지금/오늘/내일) + 날짜/시간 셀렉터
   - RegisterCargoInfoForm — 차량/중량 드롭다운 + 최근 화물 제안
   - RegisterTransportOptionCard — 8가지 옵션 전체 (fast/roundTrip/direct/trace/forklift/manual/cod/special)
   - RegisterEstimateInfoCard — 거리/운임 + 자동 배차 토글
   - Settlement 영역 — charge/dispatch 기본금액 + 추가 요금 그리드

2. **AI 패널 완전 재현**:
   - `AiPanel` 확장/축소 토글
   - `AiInputArea` 이미지 업로드 탭 추가 (현재 텍스트 탭만)
   - `AiResultButtons` 각 카테고리별 세부 버튼 (현재 그룹 단위, 실제는 개별 버튼)
   - `AiWarningBadges` 추가
   - `AiExtractJsonViewer` 추가 (하단 접히는 JSON 섹션)

3. **레이아웃 재현**:
   - ai-register page.tsx의 `<main>` 내부 flex 구조 정확히 재현
   - 3-column grid 대신 실제의 AiPanel(380px) + OrderRegisterForm(flex-1) 구조 유지

### 제외 (Out-of-scope)

- 실제 API 호출 (기존과 동일하게 mock data 유지)
- 실제 입력 가능한 기능 (Phase 2 인터랙티브 모드는 유지하되 클릭으로 mock 전환)
- 회원가입/로그인 플로우 재현
- 서버 사이드 렌더링 도입

### 제약 조건

- 번들 예산 30KB gzipped 유지 (현재 57.3kB 페이지 전체 중 dash-preview 청크 기준)
- `output: 'export'` 정적 빌드 호환 유지
- Mobile/Tablet 반응형 전략 유지
- Phase 2 인터랙티브 모드는 계속 동작

---

## 3-1. 업계 레퍼런스: Cursor.com demo-window-cursor-ide

**Cursor** (AI IDE)의 랜딩 페이지 `id="demo-window-cursor-ide"` 섹션이 우리가 목표로 하는 완성 수준의 레퍼런스이다.

### 관찰 사실

| 항목 | Cursor demo-window 동작 |
|------|----------------------|
| DOM 구조 | 실제 IDE 근접 재현 (파일트리 + 에디터 + 터미널 + 팔레트 등) |
| 입력 가능성 | 불가 — 시각 모형 |
| 애니메이션 | AI 제안 타이핑, 코드 하이라이트, Diff 효과 |
| 인터랙티브 | hover 하이라이트, 탭 전환, 일부 클릭 |
| 반응형 | 뷰포트별 DOM 자체가 변화 (이미지 swap 아님) |
| 빌드 방식 | 랜딩 전용 React 컴포넌트 (IDE 본체와 별개) |

### Option 매핑

Cursor.com은 **Option B (landing 내부 복제)** 의 고충실도 완성형이다:

- ❌ Option A (shared package) — Cursor IDE는 Electron, 웹 랜딩과 공유 구조 불가
- ✅ **Option B (landing 복제)** — 랜딩 전용 컴포넌트로 재현
- ❌ Option C (iframe) — Electron 앱은 iframe 불가
- ❌ Option D (스크린샷) — DOM inspection 시 실제 요소, 이미지 아님

### 포지셔닝

```
Cursor.com demo-window              ← Option B "고충실도" (IMP 목표 지점)
        ↑
        │  IMP-DASH-001의 개선 방향
        │
현재 dash-preview (Phase 1+2)        ← Option B "축약 버전"
```

현재 구조는 Cursor 방식과 동일하나 **축약되어** 있으므로, IMP는 "동일 방식의 완성도 업그레이드"이다.

### 시사점

1. **전략 정당성**: 업계 선두 SaaS(Cursor)가 채택한 방식 → Option B 선택에 대한 기술 검증 완료
2. **번들 예산 기준**: Cursor demo-window의 번들 크기(추정 수백 KB) 대비 우리의 30KB 제약은 과도하게 엄격 → 재협상 근거
3. **충실도 기준**: "Cursor 수준의 픽셀 정확도" 또는 "Cursor 방식 + ai-register 구조"로 구체화 가능
4. **인터랙션 기대치**: hover/타이핑/일부 클릭 등 기본 패턴을 Cursor가 이미 검증

---

## 4. 구현 옵션 (트레이드오프 분석)

### Option A: broker 컴포넌트를 shared package로 추출 후 재사용

```
packages/order-ui/   (신규)
  ├── ai-panel/      (mm-broker에서 추출)
  ├── order-register-form/
  └── ...

apps/broker/         (mm-broker 통합 시)
apps/landing/        (dash-preview에서 import)
```

**장점**:
- 단일 source of truth
- 실제 제품 업데이트 시 자동 반영 (리빌드만으로)
- 픽셀 정확도 100%

**단점**:
- broker 앱이 아직 mologado 모노레포에 없음 (`.references/code/mm-broker`는 참조용)
- broker 컴포넌트들의 외부 의존성(stores, API client, i18n 등) 정리 필요
- shared package 추출은 broker 앱 먼저 통합되어야 의미 있음

### Option B: dash-preview 내부에 컴포넌트를 복제 (static snapshot)

```
apps/landing/src/components/dashboard-preview/
  ai-panel-full/           (신규 - 실제 AiPanel 구조 복제)
  register-form-full/      (신규 - 실제 OrderRegisterForm 구조 복제)
  ...
```

**장점**:
- 즉시 착수 가능
- landing 앱 독립 유지
- 필요한 부분만 복제 (interactive 기능 제거 버전)

**단점**:
- 수동 동기화 필요 (실제 제품 변경 시)
- 컴포넌트 로직/의존성 복잡도 (Zustand 스토어, API client, i18n 등) 정리 필요
- 번들 크기 증가 위험 (30KB 예산 초과 가능성 높음)

### Option C: iframe으로 실제 ai-register 페이지 embed (정적 buildout)

```html
<iframe src="/demo/ai-register" sandbox="allow-scripts" />
```

**장점**:
- 실제 화면 그대로
- landing 코드 최소화

**단점**:
- broker 앱이 mologado 내에 없어서 불가능
- 이벤트 제어/축소 뷰 스타일링 복잡
- SEO/LCP 영향
- Phase 2 인터랙티브 모드 통합 어려움

### Option D: 스크린샷 이미지 기반 (최소 코드)

고화질 스크린샷 이미지 + 클릭 가능한 hotspot 오버레이로 재현.

**장점**:
- 픽셀 정확도 100% (스크린샷이므로)
- 번들 부담 낮음 (이미지만)
- 즉시 착수 가능

**단점**:
- 자동 재생(Phase 1) 5단계 전환을 5개 이미지로 표현해야 함
- 반응형에서 이미지 여러 세트 필요 (Desktop/Tablet/Mobile)
- 애니메이션 부자연스러움
- 접근성 낮음 (텍스트 크롤링 불가)

### 추천: **Option B (landing 내부 복제)** + 단계적 Option A 전환

**선정 근거**: Cursor.com `demo-window-cursor-ide`가 동일한 Option B 방식으로 프로덕트 신뢰도를 확보한 업계 레퍼런스 (§3-1 참조).

1. 1단계: landing 내부에 복제 — 즉시 착수 가능, 번들 예산 재협상
2. 2단계: broker 앱이 mologado 통합되면 shared package로 추출

> **상세 구현 설계**: [IMP-DASH-001-option-b-spec.md](./IMP-DASH-001-option-b-spec.md)

---

## 5. 영향도 분석 (예비)

| 영역 | 영향도 | 상세 |
|------|--------|------|
| UI/레이아웃 | **HIGH** | AiPanel + FormPreview 전면 재구성, 실제 ai-register 구조 준수 |
| 데이터/상태 | **MEDIUM** | mock-data.ts 확장 (Company/Manager, Settlement, AdditionalFees 등) |
| API/통신 | **NONE** | 계속 mock, 실제 API 호출 없음 |
| 퍼포먼스 | **HIGH** | 번들 크기 30KB 예산 초과 가능성 매우 높음, LCP 영향 재검증 필요 |
| 접근성 | **LOW** | 기존 aria/keyboard 구현 유지 |
| 테스트 | **HIGH** | 모든 스냅샷/렌더링 테스트 재작성 (현재 300개 중 상당수 영향) |

### 수정 필요 REQ-DASH

- **REQ-DASH-003** (main 컨텐츠만 재현): 더 상세한 main 컨텐츠 명세 필요
- **REQ-DASH-004~006** (AI Panel): AI 패널 구조 확장
- **REQ-DASH-007** (Form Panel): 5 Card → 실제 폼 구조로 확장
- **REQ-DASH-030** (번들 30KB): 예산 재협상 필요 (50KB 또는 90KB 가능성)
- **REQ-DASH-037** (히트 영역): 새 UI에 맞춰 좌표 재계산

---

## 6. 재진입 지점 추천

### 변경 규모: **대규모 재설계**

**추천 경로**: P3 Draft 또는 P5 Wireframe 재진입

```
P3 Draft 수정 (범위 확장 반영)
  ↓
P4 PRD 수정 (REQ-DASH Amendment + 새 REQ 추가)
  ↓
P5 Wireframe 재작성 (실제 ai-register 기반 상세 와이어)
  ↓
P6 Stitch 재검증
  ↓
P7 Bridge 업데이트
  ↓
Dev 재구현 (사실상 Phase 3로 간주)
```

### 대안: 새 IDEA로 등록

현재 dash-preview는 이미 archived 상태이므로, **Phase 3 "Pixel-Perfect Preview"**를 새 IDEA로 등록하고 기존 archive를 참조 컨텍스트로 사용하는 것이 더 깔끔할 수 있음.

---

## 7. 선결 질문

다음 질문에 대한 답이 있어야 Wireframe 단계에서 막힘 없음:

1. **broker 앱 통합 일정**: 현재 `.references/code/mm-broker`는 참조 코드. mologado 모노레포로 통합 예정 있는가?
2. **번들 예산 재협상**: 30KB → ? (50KB? 100KB?). LCP 영향 수용 범위는?
3. **충실도 수준**: "스크린샷처럼"의 정확한 기준 — 픽셀 단위 정확도인가, 구조만 동일한 정도인가?
4. **인터랙티브 모드 대응**: 더 상세한 UI에서 11개 히트 영역이 충분한가, 더 세분화(예: 개별 필드 단위) 필요한가?
5. **모바일 전략**: 더 복잡한 Desktop 뷰가 모바일에서는 어떻게 표현? (현재는 완전 다른 카드 뷰)

---

## 8. 예상 작업량

| 단계 | 규모 | 예상 기간 |
|------|------|----------|
| 선결 질문 해결 | 의사결정 회의 | 1~2일 |
| P3~P4 재기획 (PRD Amendment) | 중간 | 2~3일 |
| P5 Wireframe 재작성 | 큰 | 3~5일 |
| P6 Stitch 재검증 | 중간 | 1~2일 |
| Dev 구현 (Option B 기준) | 매우 큰 | 10~20일 |
| **합계** | | **17~32일** |

Option A (shared package 추출)는 broker 앱 통합 일정에 종속되므로 +α.

---

## 9. 대안: 점진적 접근

전면 재작업 대신 단계별 개선:

**Step 1 (Quick Win, 2~3일)**: AI 패널에 AiWarningBadges + 이미지 업로드 탭 UI 추가
**Step 2 (2~3일)**: FormPreview의 CargoInfo 영역에 최근 화물 제안 UI 추가
**Step 3 (3~4일)**: LocationForm에 주소 검색 다이얼로그 UI (정적) 추가
**Step 4 (3~4일)**: Settlement 영역(추가 요금 그리드) 추가
**Step 5 (2~3일)**: CompanyManagerInfoSection 추가

각 Step을 개별 IMP로 분리하여 순차 진행 가능 (리스크 낮음).

---

## 10. 다음 단계 권장

1. **선결 질문 해결** (특히 broker 앱 통합 일정, 번들 예산) 
2. **Option 선택**: A (shared package 대기) / B (landing 복제 즉시 착수) / 점진적 접근
3. **결정 후 `/plan-improve dash-preview analyze IMP-DASH-001`** 재실행하여 상세 영향도 분석
4. 또는 새 IDEA로 **`/plan-idea "dash-preview Phase 3: Pixel-Perfect Preview"`** 등록

---

## 11. 상태 이력

| 날짜 | 상태 | 비고 |
|------|------|------|
| 2026-04-15 | draft | IMP 최초 등록 |
