# Bridge: Wireframe ↔ 구현 매핑 — dash-preview-phase3

> **Source Wireframes**: [`sources/wireframes/`](../sources/wireframes/)
> - [`screens.md`](../sources/wireframes/screens.md) — Step × Viewport 매트릭스
> - [`components.md`](../sources/wireframes/components.md) — 컴포넌트 트리 + props
> - [`navigation.md`](../sources/wireframes/navigation.md) — 상태 전이 + Gantt
> - [`decision-log.md`](../sources/wireframes/decision-log.md) — 설계 결정 + **mock 값 SSOT**
> **Source PRD**: [`01-prd-freeze.md`](./01-prd-freeze.md)
> **Created**: 2026-04-17

---

## 0. 이 문서의 역할

wireframe ASCII 도식·컴포넌트 트리·상태 전이 다이어그램에 명시된 요소가 **어느 React 컴포넌트/CSS 클래스/interactions 유틸로 매핑되는지** 명시한다. 본 매핑은 `/dev-run` 단계에서 TDD 구현 순서의 출발점이 된다.

**재복제 금지 원칙**: wireframe 원문(ASCII, Mermaid, 상세 규약)은 본문에 재복제하지 않고 **섹션 번호 + 상대 링크**로 참조한다.

---

## 1. 컴포넌트 트리 ↔ 파일 매핑

wireframe [`components.md` §2](../sources/wireframes/components.md) 의 컴포넌트 트리를 파일 경로로 맵핑.

### 1-1. 전체 트리 (기존 유지 + 신규)

```
apps/landing/src/components/dashboard-preview/
  dashboard-preview.tsx          (기존 유지, REQ-DASH3-053)
  preview-chrome.tsx             (기존 유지, scale 0.45/0.40 분기만 추가)
  step-indicator.tsx             (수정, 5-dot → 4-dot, REQ-DASH-014)
  mobile-card-view.tsx           (Phase 1/2 승계, 불변)
  interactive-overlay.tsx        (기존 유지, 히트 영역 19~20 확장)
  interactive-tooltip.tsx        (기존 유지)
  hit-areas.ts                   (재작성, REQ-DASH-037 19~20 영역)
  use-auto-play.ts               (기존 유지)
  use-interactive-mode.ts        (기존 유지)
  use-animated-number.ts         (Phase 3에서는 interactions/use-number-rolling.ts로 승격 검토)

  ai-register-main/              (Phase 3 신규 entry)
    index.tsx                    (AiRegisterMain, container)
    ai-panel/                    (8 파일, AiPanel)
      index.tsx
      ai-tab-bar.tsx
      ai-input-area.tsx          ← 조작감 #1/#2
      ai-extract-button.tsx      ← 조작감 #3
      ai-result-buttons.tsx
      ai-button-item.tsx         ← 조작감 #3/#4/#5
      ai-warning-badges.tsx
      ai-extract-json-viewer.tsx
    order-form/                  (9 파일, OrderForm 3-column)
      index.tsx                  ← 3-column grid 루트
      company-manager-section.tsx  ← pre-filled, AI 영향 없음
      location-form.tsx          ← 조작감 #6, pickup/delivery 재사용
      datetime-card.tsx          ← 조작감 #6, pickup/delivery 재사용
      cargo-info-form.tsx        ← 조작감 #6/#7
      transport-option-card.tsx  ← 조작감 #9
      estimate-info-card.tsx     ← 조작감 #6/#8/#9/#10
      settlement-section.tsx     ← 조작감 #8
      register-success-dialog.tsx  (복제만, open=false 고정)

  interactions/                   (Phase 3 신규, 6 유틸 + CSS 4종)
    use-fake-typing.ts            (#1)
    use-button-press.ts           (#3)
    use-focus-walk.ts             (#2)
    use-ripple.ts                 (#4)
    use-fill-in-caret.ts          (#6)
    use-number-rolling.ts         (#8)
    # #5 CSS only, #7 전용 prop, #9 stroke-dashoffset CSS, #10 border glow CSS

apps/landing/src/components/ui/   (shadcn 3-C)
  button.tsx
  input.tsx
  textarea.tsx
  card.tsx
  badge.tsx

apps/landing/src/lib/
  mock-data.ts                    (확장, Phase 1 스펙 §6 스키마)
  preview-steps.ts                (4단계 + interactions 타이밍 트랙)
  motion.ts                       (기존 유지, variants 추가만)
```

### 1-2. 대응 근거 (Phase 1 스펙)

파일 배치 기준은 [Phase 1 스펙 §5](../../../../archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md#5-파일-구조) 를 따른다. 본 Bridge는 경로 확장만 수행하고 원본 스펙을 재복제하지 않는다.

---

## 2. Step × Viewport 매트릭스 ↔ 구현 매핑

wireframe [`screens.md`](../sources/wireframes/screens.md) §1의 Step 상태 목록이 `preview-steps.ts`의 PREVIEW_STEPS 배열로 매핑된다.

| Wireframe STATE ID | 섹션 | PREVIEW_STEPS[i] | duration | interactions 트랙 |
|--------------------|------|-------------------|----------|-------------------|
| STATE-001 INITIAL | [§2-2](../sources/wireframes/screens.md#2-2-state-001-initial-05s) | `[0]` INITIAL | ≤ 500ms | (없음 — caret 대기만) |
| STATE-002 AI_INPUT | [§2-3](../sources/wireframes/screens.md#2-3-state-002-ai_input-15-20s) | `[1]` AI_INPUT | ≤ 2000ms | `typingRhythm` (#1 fake-typing) + `focusWalk` (#2) |
| STATE-003 AI_EXTRACT | [§2-4](../sources/wireframes/screens.md#2-4-state-003-ai_extract-08-10s) | `[2]` AI_EXTRACT | ≤ 1000ms | `pressTargets` (#3 button-press) + spinner + stagger |
| STATE-004a AI_APPLY partial | [§2-5](../sources/wireframes/screens.md#2-5-state-004a-ai_apply--파트별-beat-12-15s) | `[3]` AI_APPLY (partialBeat 0~1500ms) | 1.2~1.5s | `fillInFields` + `pressTargets` + `rippleTargets` + `columnPulseTargets` |
| STATE-004b AI_APPLY all | [§2-6](../sources/wireframes/screens.md#2-6-state-004b-ai_apply--전체-beat-05-08s) | `[3]` AI_APPLY (allBeat 1500~2300ms, 내부 타임라인) | 0.5~0.8s | `strokeBeats` (#9) + `fillInFields` (SettlementSection) + `rollingTargets` (#8) |
| STATE-005 hold | §1 표 | `[3]` AI_APPLY 말미 hold | 0.5s | (없음) |

### 2-1. AI_APPLY 안 B 구조 상세

[`components.md` §1-1](../sources/wireframes/components.md#1-1-ai_apply-2단-구조-확정-안-b-내부-타임라인-분할) 확정 방식:

- **Step 4개 유지** (INITIAL/AI_INPUT/AI_EXTRACT/AI_APPLY). StepIndicator 4-dot.
- **AI_APPLY 내부 2-beat**: `interactions.partialBeat` (T=0~1500ms) + `interactions.allBeat` (T=1500~2300ms).
- **경계 자연 연결**: 운임 ripple 꼬리(T=800ms)에서 allBeat의 TransportOption stroke(T=0 of allBeat) 시작.
- **타입 스키마**: `preview-steps.ts` `PreviewStep['interactions']`에 `partialBeat` / `allBeat` 필드 추가 (§3 참조).

---

## 3. Interactions 10종 ↔ 유틸 파일 매핑

[Phase 1 스펙 §11-2](../../../../archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md#11-2-조작감-아이디어-10종) 10종 → 6 유틸 + 4 CSS/prop

| # | 아이디어 | 우선순위 | 대상 컴포넌트 | 구현 방식 | 파일/CSS |
|---|----------|----------|--------------|-----------|----------|
| 1 | 변동 리듬 타이핑 | **Must (MVP)** | ai-input-area.tsx | 유틸 | `interactions/use-fake-typing.ts` |
| 2 | Focus Walk | Should | ai-input-area → extract → results | 유틸 | `interactions/use-focus-walk.ts` |
| 3 | Button Press | **Must (MVP)** | ai-extract-button.tsx, ai-button-item.tsx | 유틸 | `interactions/use-button-press.ts` |
| 4 | Ripple | Should | ai-button-item.tsx | 유틸 | `interactions/use-ripple.ts` |
| 5 | Hover→Active | Should | ai-result-buttons.tsx | CSS only | Tailwind `:hover` |
| 6 | Fill-in Caret | **Must (MVP)** | location-form, cargo-info-form, datetime-card, estimate-info-card | 유틸 | `interactions/use-fill-in-caret.ts` |
| 7 | Dropdown 펼침 | Should | cargo-info-form.tsx | 전용 prop | `dropdownBeat?: { open, highlight, close }` |
| 8 | 숫자 카운터 롤링 | **Must (MVP)** | estimate-info-card.tsx, settlement-section.tsx | 유틸 | `interactions/use-number-rolling.ts` |
| 9 | Toggle/Checkbox stroke | Should | transport-option-card.tsx, estimate-info-card.tsx 자동배차 | CSS `stroke-dashoffset` | SVG 인라인 |
| 10 | Column-wise Border Pulse (재정의) | Should | order-form/index.tsx 3-column 자식 | CSS `outline + box-shadow` 400ms | Tailwind `animate-pulse-column` |

### 3-1. #10 Column-wise Border Pulse 재정의 근거

[`decision-log.md` §3](../sources/wireframes/decision-log.md#3-2026-04-17--orderform-3-column-재현--tablet-c안-040--3-column-유지-확정) 기반. 기존 Section Scroll Snap → Column Pulse로 재정의.

- **폐기 이유**: scale 0.45/0.40 축소 렌더에서 `scrollIntoView` 실질 효과 없음
- **대체**: Column 자식 `<div>`에 `outline: 2px solid var(--color-accent-start)` + `box-shadow` 400ms
- **적용 대상**: AI_APPLY partial/all beat 진행 중 **활성 섹션의 직계 Column**에만 순차 적용

---

## 4. Mock 값 ↔ 파일 매핑 (SSOT)

**유일한 진실**: wireframe [`decision-log.md` §4-3](../sources/wireframes/decision-log.md#4-3-mock-값-전체-표-ssot).

본 Bridge는 값을 재복제하지 않고 매핑 경로만 명시.

| wireframe 필드 | mock-data.ts 경로 | 비고 |
|---------------|-------------------|------|
| 회사명 "옵틱물류" | `formData.company.name` | REQ-DASH3-014 pre-filled |
| 사업자등록번호 `***-**-*****` | `formData.company.businessNumber` | 마스킹 |
| 대표 "김옵틱" | `formData.company.ceoName` | — |
| 담당자 "이매니저" | `formData.manager.name` | — |
| 담당자 연락처 `010-****-****` | `formData.manager.contact` | 마스킹 |
| 이메일 `example@optics.com` | `formData.manager.email` | 가상 도메인 |
| 부서 "물류운영팀" | `formData.manager.department` | — |

**검증 경로**: `02-package/09-test-cases.md` TC-DASH3-MOCK-SSOT 에서 `mock-data.ts`의 초기값이 SSOT 표와 정확히 일치하는지 단언.

---

## 5. 히트 영역 ↔ hit-areas.ts 매핑

wireframe [`screens.md` §5-2](../sources/wireframes/screens.md#5-2-히트-영역-매핑-표-1920개-3-column-좌표-재매핑) 의 20개 영역 → `hit-areas.ts` 재작성.

### 5-1. 재매핑 요약

| 그룹 | # | 비고 |
|------|---|------|
| AiPanel | 9 (#1~#9) | #1 tab-bar, #2 ai-input-area, #3 extract-button, #4~#7 결과 4카테고리, #8 warning, #9 json-viewer (#8/#9 Phase 3 신규) |
| OrderForm Col 1 | 3 (#11/#12/#14) | #11 company-manager (비활성, pre-filled hover만) / #12 location-pickup / #14 location-delivery |
| OrderForm Col 2 | 3 (#13/#15/#16) | #13 distance-info / #15 datetime-pickup-dropoff (2-col 통합) / #16 cargo-info |
| OrderForm Col 3 | 3 (#17/#18/#19) | #17 transport-options / #18 estimate-info / #19 settlement |
| Dialog | 1 (#20) | search-address (정적, hidden) |
| 합계 | **19** | (#10 예비, #21 Success 는 Phase 4 유보) |

### 5-2. 우선 활성화 (Phase 3 AI_APPLY 경로)

10개: **#2, #3, #4, #5, #6, #7, #12, #14, #16, #18**

Settlement(#19), TransportOption(#17), Dialog(#20)은 Should/정적 — Phase 3 파트별 beat 우선 활성화 대상 아님. 인터랙티브 모드에서는 hover 가능.

### 5-3. Tablet 히트 영역

기존 Phase 2의 "Tablet 축약 6개" 규칙 **폐기**. Tablet에서도 Desktop 동일 19개 전체 활성 (scale 0.40 + 3-column 유지 C안 영향).

---

## 6. CSS 디자인 토큰 ↔ Tailwind 매핑

wireframe [`components.md` §6](../sources/wireframes/components.md) 표에서 참조되는 토큰.

| 용도 | Tailwind 클래스 | 근거 |
|------|-----------------|------|
| pending blue | `bg-blue-500` | #3b82f6, AiButtonItem pending 상태 |
| applied green | `bg-green-500` | #22c55e, AiButtonItem applied 상태 |
| unavailable gray | `bg-gray-500` | 적용불가 상태 |
| accent start (border pulse) | `var(--color-accent-start)` | purple-600, Column Pulse outline |
| accent end (금액 강조) | `var(--color-accent-end)` | blue-600, 숫자 롤링 텍스트 |
| chrome bg | `bg-gray-900/50` | 기존 (REQ-DASH-001 승계) |
| chrome border | `border-gray-800` | 기존 |
| UI 힌트 caption | `text-xs text-muted-foreground` / Tablet `text-[10px]` | REQ-DASH3-044 |

신규 토큰 추가 **없음** (globals.css 수정 0건).

---

## 7. PCC-04 결과 요약 (Wireframe 자체 점검)

[`components.md` §8 PCC-04](../sources/wireframes/components.md) 자체 사전 점검 **28/28 전부 pass**.

| 그룹 | 건수 | 비고 |
|------|------|------|
| 기존 PCC 기본 | 20 | AI_APPLY 안 B, UI 힌트 위치, 파일 구조 정합 |
| 3-column 재매핑 신규 | 4 | Col 1/2/3 배치, 원본 라인 대응, Tablet C안, #10 재정의 |
| Pre-filled 신규 | 3 | mock 값 SSOT, AI_APPLY 제외 확인, 히트 #11 비활성 |
| (SSOT 단일 포인트 검증) | 1 | wireframe decision-log §4-3이 유일한 진실임 명시 |

### 본 Bridge에서 추가 검증 필요 항목

Dev 단계에서 **증거 기반 완료** 원칙에 따라 검증:

- [ ] `mock-data.ts` 초기값 ↔ wireframe decision-log §4-3 **exact match**
- [ ] `order-form/index.tsx` 루트 className **`grid grid-cols-1 lg:grid-cols-3 gap-4`**
- [ ] `preview-steps.ts` interactions 트랙에 `partialBeat` / `allBeat` 필드 존재
- [ ] `hit-areas.ts` #11 `company-manager.isEnabled` 기본 `false` (pre-filled 비활성)
- [ ] 조작감 유틸 6개 파일 존재 + dedicated 단위 테스트 (REQ-DASH3-030/072)

---

## 8. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-04-17 | 초안 — 컴포넌트 트리 / Step × Viewport / interactions 10종 / mock SSOT / 히트 영역 / CSS 토큰 매핑 + PCC-04 결과 28/28 요약 |
