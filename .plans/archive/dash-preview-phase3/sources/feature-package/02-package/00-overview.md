# Feature Overview: dash-preview-phase3

> **Feature**: Dashboard Preview Phase 3 — Pixel-Perfect Preview + 조작감 10종
> **Slug**: `dash-preview-phase3`
> **Scope**: Standard
> **Scenario**: C (충실도 교정)
> **Feature Type**: Hybrid (reference-only)
> **PRD**: [`../00-context/01-prd-freeze.md`](../00-context/01-prd-freeze.md)
> **Architecture Binding**: [`../00-context/06-architecture-binding.md`](../00-context/06-architecture-binding.md)
> **Created**: 2026-04-17

---

## 1. Feature 요약

`apps/landing` Hero 영역의 `DashboardPreview` 내부 콘텐츠를 **`.references/code/mm-broker/app/broker/order/ai-register/` main 영역 전체 복제 + 조작감 10종 시각 레이어**로 업그레이드한다. Phase 1/2의 축약 뷰에서 벗어나 **원본 `register-form.tsx:939`의 `grid grid-cols-1 lg:grid-cols-3 gap-4` 3-column 구조를 1:1 재현**하고, INITIAL → AI_INPUT → AI_EXTRACT → AI_APPLY 4단계를 **총 루프 6~8초**로 순환 재생한다. AI_APPLY 단계는 **안 B (내부 타임라인 분할)** 으로 파트별 beat(1.2~1.5초) → 전체 beat(0.5~0.8초) 2단 연출.

`CompanyManagerSection`은 INITIAL부터 **가상 화주 "옵틱물류" + 담당자 이매니저로 pre-filled** (로그인 + 회사 선택 완료 시뮬레이션, AI_APPLY 영향 없음). 조작감 10종 중 **MVP 4종(#1 fake-typing / #3 button-press / #6 fill-in caret / #8 number-rolling)은 Must**, 나머지 6종은 Should.

Feature flag로 Phase 1/2와 병행 운영 가능. Mobile(<768px)은 기존 MobileCardView 불변.

---

## 2. In-scope / Out-of-scope

### 2-1. In-scope

| # | 항목 | 근거 |
|---|------|------|
| 1 | AiPanel 8 파일 복제 (DOM 1:1 + 조작감 주입) | REQ-DASH3-003 |
| 2 | OrderForm 9 파일 복제 (DOM 1:1 + 3-col grid 루트) | REQ-DASH3-004 |
| 3 | SearchAddressDialog 정적 스냅샷 (닫힌 상태만) | REQ-DASH3-005 |
| 4 | mock-data.ts 확장 (Phase 1 스펙 §6 스키마) | REQ-DASH3-010 |
| 5 | preview-steps.ts 4단계 + interactions 타이밍 트랙 | REQ-DASH3-011/012 |
| 6 | CompanyManagerSection pre-filled (옵틱물류/이매니저) | REQ-DASH3-014 |
| 7 | 조작감 유틸 6개 + CSS 4종 | REQ-DASH3-020~029 |
| 8 | AI_APPLY 2단 구조 (partialBeat + allBeat, 안 B) | REQ-DASH3-040~044 |
| 9 | shadcn 3-C 하이브리드 (5 컴포넌트) | REQ-DASH3-051 |
| 10 | Feature flag 병행 운영 | REQ-DASH3-052 |
| 11 | Desktop 0.45 / **Tablet 0.40 + 3-col C안** / Mobile 유지 | REQ-DASH-023/024 |
| 12 | 히트 영역 19~20 재매핑 (3-col 좌표) | REQ-DASH-037 |
| 13 | `prefers-reduced-motion` fallback (조작감 10종 즉시 스냅) | REQ-DASH3-031 |
| 14 | 번들 80~100KB + LCP +100ms 미만 | REQ-DASH3-060/061 |
| 15 | TDD 80%+ 커버리지 + legacy 격리 | REQ-DASH3-070/071 |

### 2-2. Out-of-scope (Non-Goals)

| # | 항목 | 유보 근거 |
|---|------|----------|
| 1 | **COMPLETE 단계 / RegisterSuccessDialog 시연** | Phase 4 유보. 파일은 복제하되 `open=false` 고정. |
| 2 | 서사 아이디어 8종 (시간 압축, Before/After 등) | Phase 2(후속) 유보 |
| 3 | 비즈니스 로직 이식 (zustand/RHF/react-query/API) | 제거 — stateless props 기반 |
| 4 | 모바일 정밀 조작감 | MobileCardView 불변, 조작감 레이어 미적용 |
| 5 | broker 앱 모노레포 통합 (Option A) | Q2 해소 후 별도 Feature (Future Migration Alignment는 본 Bridge에 반영) |
| 6 | RegisterSummary 컴포넌트 | Phase 3 범위 제외 (REQ-DASH3-006) |
| 7 | 외부 HTML 디자인 시안 통합 | Stitch 단계 skipped (Hybrid reference-only) |

---

## 3. 의존성

### 3-1. 신규 도입 패키지 (shadcn 3-C)

| 패키지 | 역할 | 근거 |
|--------|------|------|
| `@radix-ui/react-slot` | shadcn Button 기본 | REQ-DASH3-051 |
| `@radix-ui/react-label` | shadcn Input 기본 | REQ-DASH3-051 |

> `Select / Dialog / Popover / Calendar / Checkbox`는 도입하지 않고 Tailwind 재작성 또는 정적 스냅샷.

### 3-2. 유지 의존성

| 패키지 | 역할 | 비고 |
|--------|------|------|
| Next.js 15 | Framework (static export) | 기존 |
| React 19 | UI | 기존 |
| Framer Motion | Step 전환 + Preview 등장 애니 | 기존 |
| Tailwind CSS v4 + clsx + tailwind-merge | Styling | 기존 |
| Lucide React | Icons | 기존 |
| Vitest + React Testing Library | Test | 기존 |
| Playwright | 통합 스냅샷 (Phase 3 신규 추가 검토) | **Phase 3 신규 테스트 도입 검토** |
| vitest-axe | 접근성 자동 검증 | Phase 1에서 사용 여부 확인 필요 |

### 3-3. 제거 대상 (복제 컴포넌트에서)

| 원본 import | 제거 근거 |
|-------------|-----------|
| `@/store/*` | stateless props 주입 (REQ-DASH3-002/007) |
| `react-hook-form` | 정적 값 렌더 |
| `@tanstack/react-query` | API 호출 없음 |
| `next/navigation` | 라우팅 없음 |
| `@/lib/api/*` | mock 데이터 |
| broker 앱의 기타 내부 util | 복제 대상 컴포넌트 범위 밖 |

**검증**: `package.json` 신규 추가 = `@radix-ui/react-slot` + `@radix-ui/react-label` **2건만** (shadcn CLI 설치 산출).

---

## 4. Structure Contract

### 4-1. Structure Mode

```
feature-local (within apps/landing)
```

상세: [`../00-context/06-architecture-binding.md`](../00-context/06-architecture-binding.md) §1.

### 4-2. Allowed Target Paths (요약)

| 유형 | 경로 | 수량 |
|------|------|------|
| 신규 Presentation | `components/dashboard-preview/ai-register-main/` 하위 | 17 파일 |
| 신규 Interaction | `components/dashboard-preview/interactions/` | 6 파일 |
| 신규 UI Primitive | `components/ui/` (shadcn 3-C) | 5 파일 |
| 수정 Presentation | 기존 5 파일 (dashboard-preview/preview-chrome/step-indicator/hit-areas/lib/motion) | 5 파일 |
| 수정 Infrastructure | `lib/mock-data.ts` (확장) + `lib/preview-steps.ts` (확장) + `vitest.config.ts` (include 재구성) | 3 파일 |
| **총 신규/수정** | | **36 파일** |

상세: [`../00-context/06-architecture-binding.md`](../00-context/06-architecture-binding.md) §2.

### 4-3. Stack Contract

| 항목 | 값 |
|------|----|
| Language | TypeScript |
| Framework | Next.js 15 (static export, App Router) |
| React | 19 |
| Animation | Framer Motion + interactions 타이밍 트랙 |
| Styling | Tailwind CSS v4 + `cn` helper |
| UI Primitives | shadcn (3-C 하이브리드, 5 컴포넌트) |
| Icons | Lucide React |
| Test | Vitest + RTL + (검토: Playwright 통합 스냅샷) |
| 신규 패키지 | `@radix-ui/react-slot`, `@radix-ui/react-label` |

제약사항 (PRD §7-6 승계):
- `useEffect`는 **시각 애니메이션 타이밍에만 허용** — 네트워크/스토어/API 호출 금지.
- 조작감 레이어는 `transform`/`opacity` 중심 — layout thrash 금지.
- 한 Step당 애니 지속 **2초 이내**.

### 4-4. Layer Mapping

apps/landing 3층 구조(Presentation / Application / Infrastructure)에 Phase 3 신규 자산을 바인딩한다. 상세 트리·의존성 방향은 [`../00-context/06-architecture-binding.md`](../00-context/06-architecture-binding.md) §3.

| Layer | 디렉터리 | Phase 3 자산 |
|-------|---------|-------------|
| Presentation (기능 전용) | `components/dashboard-preview/` | chrome · step-indicator · interactive-overlay 등 기존 유지 |
| Presentation (sub-feature) | `components/dashboard-preview/ai-register-main/` | Phase 3 신규 17 파일 (ai-panel/ + order-form/) |
| Interaction (stateless hooks) | `components/dashboard-preview/interactions/` | 조작감 유틸 6개 (#1/#2/#3/#4/#6/#8) — #5/#7/#9/#10은 CSS/전용 prop |
| UI Primitive (shared) | `components/ui/` | shadcn 5 컴포넌트 |
| Infrastructure (기능 데이터) | `lib/mock-data.ts`, `lib/preview-steps.ts`, `lib/motion.ts` | mock SSOT 확장, 4-Step + interactions 트랙, variants 추가 |
| Test | `__tests__/dashboard-preview/{ai-register-main,interactions,legacy}/` | 신규 + legacy 격리 (A안 확정 — `T-DASH3-M1-07`) |

의존성 방향 (단방향): `ai-register-main/` → `interactions/` → `components/ui/`. 역방향 (`interactions/` → `ai-register-main/`) 금지.

### 4-5. Shared vs Local Rule

feature-local → shared → packages 승격 규칙. 현재 landing은 `packages/*` 공용 의존 0건 유지 (구조 SSOT 기준). 상세: [`../00-context/06-architecture-binding.md`](../00-context/06-architecture-binding.md) §4.

| 위치 | 적용 기준 | Phase 3 판정 |
|------|----------|-------------|
| `components/dashboard-preview/ai-register-main/` | 본 기능 전용 | ✅ feature-local (단일 앱 내) |
| `components/dashboard-preview/interactions/` | 본 기능 전용 hooks | ✅ feature-local, broker 앱 이식 대상 아님 |
| `components/ui/` (shadcn) | landing 내 여러 섹션에서 재사용 가능 | ✅ shared within app (app-local shared) |
| `lib/mock-data.ts` | 본 기능 SSOT | ✅ feature-local (Option A 전환 시 제거 대상) |
| `packages/*` | 2개 이상 app에서 사용 | ❌ 현재 landing 단독 — Phase 3 범위 밖 |

**Future Migration Alignment (Q2 미해소 대비)**: `ai-register-main/` 디렉터리는 Option A (broker 앱 모노레포 통합) 전환 시 **shared 추출 경계**로 설계되어 있으며, 외부 의존(zustand/RHF/api) 0건 유지로 추출 난이도를 최소화한다. `interactions/`는 landing 전용으로 유지, broker 앱으로 이식하지 않는다. 상세: [`../00-context/06-architecture-binding.md`](../00-context/06-architecture-binding.md) §4-1.

---

## 5. 성능/체감 예산

| 제약 | 목표 | 검증 |
|------|------|------|
| Dashboard Preview chunk | **80~100KB gzipped** (Q1 수용) | `next build` chunk 크기 |
| 전체 landing First Load JS | ≤ 252KB | `next build` |
| LCP 영향 | +100ms 미만 | Lighthouse CI |
| 총 루프 시간 | **6~8초** | 자동 재생 타이밍 측정 |
| Step duration 상한 | INITIAL ≤ 500ms / AI_INPUT ≤ 2000ms / AI_EXTRACT ≤ 1000ms / AI_APPLY ≤ 2500ms | Playwright 시간축 |
| Step 전환 오버랩 | 100~200ms | 캡처 비교 |
| 조작감 한 Step당 지속 | ≤ 2초 | 애니 duration 측정 |
| 픽셀 정확도 (원본 대비) | **95%+** (AI_APPLY 완료 구간, COMPLETE 제외) | diff 도구 |
| Tablet 가독성 (R5) | M5 A/B 검증 대상 | 사용자 리뷰 |

---

## 6. 일정 요약

| Stage | 기간 | 주 산출 | 상세 |
|-------|------|--------|------|
| **Spike** (선행) | 1일 | 수직 슬라이스 + 공수 실측 | [`08-dev-tasks.md` §1](./08-dev-tasks.md#1-spike-선행-1일) |
| M1 기반 | 3일 | mock-data 확장, preview-steps, shell, shadcn 5개, interactions 스캐폴드 | [`08-dev-tasks.md` §2](./08-dev-tasks.md#2-m1-기반-3일) |
| M2 AiPanel | 4~5일 | AiPanel 8 파일 + 조작감 #1/#3 | [`08-dev-tasks.md` §3](./08-dev-tasks.md#3-m2-aipanel--조작감-mvp-45일) |
| M3 OrderForm | 5~7일 | OrderForm 9 파일 + 조작감 #6/#8/#9 + AI_APPLY 2단 | [`08-dev-tasks.md` §4](./08-dev-tasks.md#4-m3-orderform--ai_apply-2단-57일) |
| M4 조작감+히트 | 3~4일 | 조작감 #2/#4/#5/#7/#10 + hit-areas 재매핑 | [`08-dev-tasks.md` §5](./08-dev-tasks.md#5-m4-조작감-나머지--히트-영역-34일) |
| M5 반응형+성능 | 3일 | Desktop 0.45 / Tablet 0.40, dynamic import, reduced-motion, Lighthouse CI | [`08-dev-tasks.md` §6](./08-dev-tasks.md#6-m5-반응형--성능--검증-3일) |
| **합계** | **18~22일** (+Spike 1일 = 19~23일) | Phase 3 완료 | |

### 6-1. Spike 의사결정 분기

Spike 종료 시점에 다음 조건 확인:
- R4(복제 공수) 실측 **+50% 초과** → 시나리오 **C → A 전환** 재평가
- 전체 beat **0.8초 부족/과다** → PRD §6-2 duration 재조정
- **#10 Column Pulse** / **Tablet 0.40 정식 가독성**은 Spike 범위 외 → M4~M5에서 별도 처리

---

## 7. Verification Contract

```bash
pnpm run typecheck    # 0 errors
pnpm run lint         # 0 warnings in new files
pnpm run test         # Phase 3 신규 80%+ coverage, legacy 격리 성공
pnpm run build        # exit 0, 번들 80~100KB gzipped 이내
# Lighthouse CI: LCP +100ms 미만
# vitest-axe: WCAG AA 통과
```

상세: [`../00-context/06-architecture-binding.md`](../00-context/06-architecture-binding.md) §6, [`10-release-checklist.md`](./10-release-checklist.md).

---

## 8. 미결정 사항 (Dev 착수 전 확정)

| # | 항목 | 선택지 | 확정 시점 |
|---|------|--------|----------|
| 1 | **Q7 Legacy 격리 전략** | **해소 (Phase B A안 확정)** — `legacy/` 디렉터리 이동 + `vitest.config.ts` include 재구성. `T-DASH3-M1-07` 추가 | **해소 완료 (Phase B A안, 2026-04-17)** |
| 2 | `use-animated-number.ts` 처리 | 재사용 vs `interactions/use-number-rolling.ts`로 복제 | Spike 단계 |
| 3 | Playwright 통합 스냅샷 도입 여부 | 도입 vs Vitest만 | M3 통합 테스트 착수 전 |
| 4 | Tablet 가독성 fallback | 0.40 유지 vs 0.45 상향 vs 1-col reflow | M5 A/B 검증 결과 기반 |
| 5 | Q2 broker 통합 일정 | 6개월 내 vs 장기 유보 | Option A 별도 Feature 착수 시 |

---

## 9. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-04-17 | 초안 — Feature 요약, In/Out-of-scope, 의존성, Structure Contract 요약, 성능 예산, 일정, Verification Contract, 미결정 5건 |
| 2026-04-17 | Phase A (Context Build) — Structure Contract 보강: §4-3 PRD §7-6 제약 명시, §4-4 Layer Mapping 명시, §4-5 Shared-vs-Local Rule 명시 (재복제 없이 06-architecture-binding §3/§4 참조 링크) |
| 2026-04-17 | Phase C — §8 Q7 "해소 완료 (Phase B A안)" 갱신, Allowed Target Paths 35→36 파일 반영 (`T-DASH3-M1-07`) |
