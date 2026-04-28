# Bridge: Development Context — dash-preview-phase3

> **Feature**: Dashboard Preview Phase 3
> **PRD**: [`01-prd-freeze.md`](./01-prd-freeze.md)
> **Wireframe**: [`sources/wireframes/`](../sources/wireframes/)
> **Architecture Binding**: [`06-architecture-binding.md`](./06-architecture-binding.md)
> **Phase 1 스펙 (절대 권위)**: [`archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md`](../../../../archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md)
> **Created**: 2026-04-17

---

## 0. 이 문서의 역할

**PRD ↔ wireframe ↔ 구현** 3자 연결 맵. 각 REQ가 어느 wireframe 섹션에서 시각화되고 어느 TASK에 배정되는지 **3-way 추적**을 제공한다. 테스트 케이스(TC)와 릴리스 체크리스트도 본 매핑을 공통 근거로 사용한다.

재복제 금지: REQ 원문은 PRD를, 와이어 도식은 wireframe을, TASK 목록은 [`02-package/08-dev-tasks.md`](../02-package/08-dev-tasks.md) 를 참조.

---

## 1. Feature 요약 (한 단락)

`apps/landing` Hero 영역의 `DashboardPreview` 내부 콘텐츠를 **ai-register main 전체 재현 + 조작감 10종 시각 레이어**로 업그레이드한다. Phase 1/2의 축약 뷰를 대체하지 않고 **내부 콘텐츠만 교체** (REQ-DASH3-053) 하며, Feature flag로 병행 운영 (REQ-DASH3-052). 총 루프 6~8초, Step 4개, OrderForm 3-column grid 재현, Tablet scale 0.40 + 3-column 유지 C안, CompanyManagerSection pre-filled (옵틱물류/이매니저) + AI_APPLY 영향 제외.

## 2. 기술 스택

| 항목 | 값 |
|------|----|
| Framework | Next.js 15 (static export) |
| React | 19 |
| Animation | Framer Motion (기존 공유) |
| Styling | Tailwind CSS v4 + clsx + tailwind-merge |
| UI 라이브러리 | **shadcn 3-C 신규** (Button/Input/Textarea/Card/Badge 5개) |
| Icons | Lucide React (기존) |
| Test | Vitest + React Testing Library + vitest-axe + Playwright (전체 루프 스냅샷) |
| 신규 패키지 | `@radix-ui/react-slot`, `@radix-ui/react-label` (shadcn 최소 의존) |

## 3. REQ ↔ wireframe ↔ TASK 3-way 매핑

### 3-1. 복제 범위 (REQ-DASH-003/007 + REQ-DASH3-001~007)

| REQ | wireframe 섹션 | TASK |
|-----|----------------|------|
| REQ-DASH-003 (AiPanel 380 + OrderForm 3-col) | [`screens.md` §2-1](../sources/wireframes/screens.md) 공통 외곽 구조 | T-DASH3-M1-03 (AiRegisterMain shell) |
| REQ-DASH-007 (OrderForm 3-column) | [`screens.md` §1](../sources/wireframes/screens.md) 3-col 배치 규약 표 | T-DASH3-M3-01 (order-form/index.tsx 루트) |
| REQ-DASH3-001 (DOM/스타일 1:1) | [`components.md` §2](../sources/wireframes/components.md) 컴포넌트 트리 | T-DASH3-M1-03 + M2 전체 + M3 전체 |
| REQ-DASH3-002 (stateless props) | [`components.md` §6](../sources/wireframes/components.md) 공통 props 규약 | 전 TASK 공통 원칙 |
| REQ-DASH3-003 (AiPanel 8 파일) | [`components.md` §3](../sources/wireframes/components.md) | T-DASH3-M2-01~08 |
| REQ-DASH3-004 (OrderForm 9 파일) | [`components.md` §4](../sources/wireframes/components.md) | T-DASH3-M3-01~08 |

### 3-2. Step 전환 + 타이밍 (REQ-DASH-010/011/013 + REQ-DASH3-010~014)

| REQ | wireframe 섹션 | TASK |
|-----|----------------|------|
| REQ-DASH-010 (4-Step) | [`screens.md` §1](../sources/wireframes/screens.md) STATE 목록 | T-DASH3-M1-02 (preview-steps.ts) |
| REQ-DASH-011 (6~8초 루프) | [`navigation.md` §3](../sources/wireframes/navigation.md) Gantt | T-DASH3-M2-12 + M3-12 (타이밍 통합) |
| REQ-DASH-013 (오버랩 100~200ms) | [`screens.md` §2-2~§2-6](../sources/wireframes/screens.md) 각 STATE "오버랩 구간" 주석 | T-DASH3-M2-12 |
| REQ-DASH3-010 (mock-data 확장) | [`components.md` §6](../sources/wireframes/components.md) | T-DASH3-M1-01 (mock-data.ts) |
| REQ-DASH3-011 (interactions 타이밍 트랙) | [`components.md` §6-1](../sources/wireframes/components.md) `InteractionsTrack` 타입 | T-DASH3-M1-02 |
| REQ-DASH3-012 (Step 매트릭스) | [`screens.md` §2-2~§2-6](../sources/wireframes/screens.md) | T-DASH3-M1-02 |
| REQ-DASH3-013 (SuccessDialog open=false 고정) | [`components.md` §4](../sources/wireframes/components.md) order-form/register-success-dialog | T-DASH3-M3-08 |
| REQ-DASH3-014 (CompanyManager pre-filled) | [`decision-log.md` §4](../sources/wireframes/decision-log.md#4-2026-04-17--가상-화주-옵틱물류--담당자-이매니저-pre-filled-확정-ssot) SSOT | T-DASH3-M1-01 (mock 초기값) + T-DASH3-M3-02 (컴포넌트 렌더) |

### 3-3. 조작감 10종 (REQ-DASH3-020~031)

| # | REQ | wireframe 주석 위치 | TASK |
|---|-----|---------------------|------|
| 1 | REQ-DASH3-020 (#1 fake-typing, Must) | [`screens.md` §2-3](../sources/wireframes/screens.md#2-3-state-002-ai_input-15-20s) `← #1 fake-typing` | T-DASH3-M1-05 (유틸) + T-DASH3-M2-03 (적용) |
| 2 | REQ-DASH3-024 (#2 focus-walk, Should) | [`screens.md` §2-3](../sources/wireframes/screens.md) `← #2 focus-walk stop` | T-DASH3-M1-05 + M4-01 |
| 3 | REQ-DASH3-021 (#3 button-press, Must) | [`screens.md` §2-4](../sources/wireframes/screens.md#2-4-state-003-ai_extract-08-10s) `▸ #3 button-press` | T-DASH3-M1-05 + M2-04 |
| 4 | REQ-DASH3-025 (#4 ripple, Should) | [`screens.md` §2-5](../sources/wireframes/screens.md) `▸ #4 ripple 300ms` | T-DASH3-M1-05 + M4-02 |
| 5 | REQ-DASH3-026 (#5 hover, Should) | [`components.md` §3](../sources/wireframes/components.md) ai-result-buttons | T-DASH3-M2-05 (CSS only) |
| 6 | REQ-DASH3-022 (#6 fill-in, Must, CompanyManager 제외) | [`screens.md` §2-5](../sources/wireframes/screens.md) `← #6 fill-in (caret 150ms)` | T-DASH3-M1-05 + M3-02~06 |
| 7 | REQ-DASH3-027 (#7 dropdown, Should) | [`screens.md` §2-5](../sources/wireframes/screens.md) `▸ #7 dropdown 펼침` | T-DASH3-M3-05 (전용 prop) |
| 8 | REQ-DASH3-023 (#8 number-rolling, Must) | [`screens.md` §2-6](../sources/wireframes/screens.md) `← #8 number-rolling` | T-DASH3-M1-05 + M3-07/M3-08 |
| 9 | REQ-DASH3-028 (#9 stroke, Should) | [`screens.md` §2-6](../sources/wireframes/screens.md) `← #9 toggle stroke` | T-DASH3-M3-06 (CSS) |
| 10 | REQ-DASH3-029 (#10 Column-wise Border Pulse, 재정의) | [`decision-log.md` §3](../sources/wireframes/decision-log.md#3-2026-04-17--orderform-3-column-재현--tablet-c안-040--3-column-유지-확정) | T-DASH3-M3-01 (루트 CSS) + M4-03 (적용) |

### 3-4. AI_APPLY 2단 구조 (REQ-DASH3-040~044)

| REQ | wireframe 섹션 | TASK |
|-----|----------------|------|
| REQ-DASH3-040 (파트별→전체 2단 연출) | [`screens.md` §2-5/§2-6](../sources/wireframes/screens.md) STATE-004a/004b | T-DASH3-M3-10 (AI_APPLY 통합 시퀀스) |
| REQ-DASH3-041 (안 B 확정) | [`components.md` §1-1](../sources/wireframes/components.md#1-1-ai_apply-2단-구조-확정-안-b-내부-타임라인-분할) | T-DASH3-M1-02 (interactions partialBeat/allBeat) |
| REQ-DASH3-042 (파트별 beat 150~250ms) | [`screens.md` §2-5](../sources/wireframes/screens.md) 타이밍 표 | T-DASH3-M3-10 |
| REQ-DASH3-043 (전체 beat 80~120ms, 담당자 제외) | [`screens.md` §2-6](../sources/wireframes/screens.md) 전체 beat 구성 표 | T-DASH3-M3-10 |
| REQ-DASH3-044 (UI 힌트 위치) | [`decision-log.md` §2](../sources/wireframes/decision-log.md#2-2026-04-17--ui-시각-힌트-위치-확정) | T-DASH3-M3-11 (Caption 컴포넌트) |

### 3-5. 아키텍처/파일 구조 (REQ-DASH3-050~053)

| REQ | wireframe 섹션 | TASK |
|-----|----------------|------|
| REQ-DASH3-050 (Phase 1 스펙 §5 구조) | Phase 1 스펙 §5 (직접 참조) | T-DASH3-M1-04 (shell 디렉터리 생성) |
| REQ-DASH3-051 (shadcn 3-C, 5 컴포넌트) | [`components.md` §7](../sources/wireframes/components.md) shadcn 명세 | T-DASH3-M1-06 (shadcn CLI 설치) |
| REQ-DASH3-052 (Feature flag 병행 운영) | — | T-DASH3-M5-03 (env/prop 토글) |
| REQ-DASH3-053 (외곽 chrome 재사용) | [`components.md` §2](../sources/wireframes/components.md) 컴포넌트 트리 상단 | T-DASH3-M1-04 (기존 유지) |

### 3-6. 성능/접근성/국제화 (REQ-DASH3-060~066)

| REQ | TASK |
|-----|------|
| REQ-DASH3-060 (번들 80~100KB) | T-DASH3-M5-04 (번들 측정) |
| REQ-DASH3-061 (LCP +100ms 미만) | T-DASH3-M5-05 (Lighthouse CI) |
| REQ-DASH3-062 (dynamic import 분할) | T-DASH3-M5-02 (Mobile 분할) |
| REQ-DASH3-063 (Step duration 상한) | T-DASH3-M2-12 + M3-12 |
| REQ-DASH3-064 (axe-core 통과) | T-DASH3-M5-06 (a11y) |
| REQ-DASH3-065 (한국어 기본, i18n 구조) | T-DASH3-M1-01 (mock-data 텍스트 관리) |
| REQ-DASH3-066 (WCAG AA 대비) | T-DASH3-M5-06 |

### 3-7. 테스트 전략 (REQ-DASH3-070~074)

| REQ | TASK |
|-----|------|
| REQ-DASH3-070 (TDD, 80%+ 커버리지) | 전 TASK 공통 원칙 |
| REQ-DASH3-071 (legacy 격리, Q7) | **Gate TASK** — `/dev-feature` 진입 직전 사용자 확정 |
| REQ-DASH3-072 (유틸 6개 × 최소 2개 테스트) | T-DASH3-M1-05 (각 유틸 TDD 동반) |
| REQ-DASH3-073 (AI_APPLY 2단 통합 테스트) | T-DASH3-M3-10 |
| REQ-DASH3-074 (Spike 선행 테스트) | T-DASH3-SPIKE-01 (테스트 세트) |

---

## 4. 파일 구조 요약 (본 Bridge에서 확정)

상세 매핑은 [`06-architecture-binding.md`](./06-architecture-binding.md). 요약:

```
apps/landing/src/components/dashboard-preview/
  (기존) dashboard-preview.tsx, preview-chrome.tsx, step-indicator.tsx, mobile-card-view.tsx
  (기존) use-auto-play.ts, use-interactive-mode.ts, use-animated-number.ts
  (기존) interactive-overlay.tsx, interactive-tooltip.tsx, hit-areas.ts
  (Phase 3 신규)
    ai-register-main/
      index.tsx
      ai-panel/             (8 파일)
      order-form/           (9 파일)
    interactions/           (6 유틸)

apps/landing/src/components/ui/   (shadcn 3-C, 5 파일 신규)

apps/landing/src/lib/
  mock-data.ts                (확장)
  preview-steps.ts            (4단계 + interactions 트랙)
```

---

## 5. 구현 순서 (Spike + M1~M5)

[`02-package/08-dev-tasks.md`](../02-package/08-dev-tasks.md) 상세 참조. 요약:

| Stage | 기간 | 주 산출 |
|-------|------|--------|
| **Spike** | 1일 | 수직 슬라이스 (AiInputArea + AiExtractButton + EstimateInfoCard + Company 정적 pre-filled + 4-Step 골격 + MVP #1/#3/#8) |
| M1 | 3일 | mock-data 확장, preview-steps 4단계, shell, shadcn 5개, interactions 유틸 6개 스캐폴드 |
| M2 | 4~5일 | AiPanel 8 파일 + 조작감 #1/#3 통합 |
| M3 | 5~7일 | OrderForm 9 파일 + 조작감 #6/#8/#9 + AI_APPLY 2단 |
| M4 | 3~4일 | 조작감 #2/#4/#5/#7/#10 나머지 + 히트 영역 19~20 재매핑 |
| M5 | 3일 | 반응형 (Desktop 0.45/Tablet 0.40), dynamic import, reduced-motion, Lighthouse CI, hero 통합 |
| 합계 | **18~22일** (+Spike 1일 = 19~23일) | Phase 3 완료 |

---

## 6. 성능 제약 Summary

| 제약 | 값 | 검증 명령 |
|------|----|-----------|
| JS 번들 | **80~100KB gzipped** (Q1 수용) | `pnpm run build` → chunk 크기 |
| 전체 First Load JS | ≤ 252KB | `pnpm run build` |
| LCP | +100ms 미만 | Lighthouse CI |
| Step duration | INITIAL ≤ 500 / AI_INPUT ≤ 2000 / AI_EXTRACT ≤ 1000 / AI_APPLY ≤ 2500 ms | Playwright 시간축 캡처 |
| 총 루프 | 6~8초 | 자동 재생 타이밍 측정 |
| Step 전환 오버랩 | 100~200ms | Playwright 캡처 |

---

## 7. Verification Contract

```bash
pnpm run typecheck    # 0 errors
pnpm run lint         # 0 warnings in new files
pnpm run test         # Phase 3 신규 80%+ coverage, legacy 격리 성공
pnpm run build        # exit 0, 번들 80~100KB gzipped 이내
```

Dev 단계에서 [`dev-verification-engine`](../../../../../.claude/rules/verification.md) 에 따라 **증거 기반 완료** 원칙 준수.

---

## 8. 외부 문서 참조 전체 목록

| 문서 | 경로 |
|------|------|
| PRD (freeze) | [`01-prd-freeze.md`](./01-prd-freeze.md) |
| Routing Metadata | [`07-routing-metadata.md`](./07-routing-metadata.md) |
| Wireframe screens | [`sources/wireframes/screens.md`](../sources/wireframes/screens.md) |
| Wireframe components | [`sources/wireframes/components.md`](../sources/wireframes/components.md) |
| Wireframe navigation | [`sources/wireframes/navigation.md`](../sources/wireframes/navigation.md) |
| Wireframe decision-log (mock SSOT) | [`sources/wireframes/decision-log.md`](../sources/wireframes/decision-log.md) |
| First-pass | [`drafts/dash-preview-phase3/first-pass.md`](../../../drafts/dash-preview-phase3/first-pass.md) |
| IDEA | [`ideas/20-approved/IDEA-20260417-001.md`](../../../../ideas/20-approved/IDEA-20260417-001.md) |
| Screening | [`ideas/20-approved/SCREENING-20260417-001.md`](../../../../ideas/20-approved/SCREENING-20260417-001.md) |
| Phase 1 스펙 (절대 권위) | [`archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md`](../../../../archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md) |
| Phase 1/2 요구사항 SSOT | [`archive/dash-preview/sources/feature-package/02-package/01-requirements.md`](../../../../archive/dash-preview/sources/feature-package/02-package/01-requirements.md) |
| 원본 ai-register | `.references/code/mm-broker/app/broker/order/ai-register/` |

---

## 9. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-04-17 | 초안 — PRD ↔ wireframe ↔ TASK 3-way 매핑 (복제/Step/조작감/AI_APPLY/아키/성능/테스트 7 그룹) + 구현 순서 + Verification Contract |
