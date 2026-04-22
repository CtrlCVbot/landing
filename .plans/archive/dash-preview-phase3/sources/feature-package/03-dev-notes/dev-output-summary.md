# Dev Output Summary: dash-preview-phase3

> **Feature**: Dashboard Preview Phase 3
> **Status**: Implementation Complete — `/dev-verify` PASS (commit `af9a0fe`)
> **Period**: 2026-04-17 ~ 2026-04-22 (6 일)
> **Commits (landing repo, CtrlCVbot)**: 36 commits (`d7c1c76` ← HEAD)
> **관련 문서**: [`dev-verification-report.md`](./dev-verification-report.md)

---

## 1. 개요

`apps/landing` Hero 섹션의 **DashboardPreview 데모**를 Phase 1/2 의 2-column 축약 뷰에서 **Phase 3 의 AiPanel 380px + OrderForm 3-column grid + 조작감 10종 + AI_APPLY 2-beat 자동재생**으로 전환. Feature flag 로 점진 도입 후 M5 closeout 에서 default ON 으로 승격. Phase 1/2 legacy 경로는 `?dashV3=0` / env opt-out 으로 회귀 가능.

- **Structure Mode**: `feature-local` (within `apps/landing`)
- **Total LOC (신규)**: 약 +6,800 LOC (src 기준)
- **Forbidden imports (`zustand` / `react-hook-form` / `@tanstack/react-query` / `next/navigation` / `@/lib/api`)**: **0건**
- **Shared packages 의존**: **0건**

---

## 2. Milestone 타임라인

| Milestone | 기간 | TASK | 커밋 | 주요 산출 |
|---|---|:---:|:---:|---|
| **Spike** | 04-17 | 1 | 1 | 수직 슬라이스 (#1/#3/#8 조작감 + 4-Step 골격) |
| **M1 기반** | 04-17 ~ 04-18 | 9 | 9 | mock-data/preview-steps + shell + interactions 유틸 6개 + shadcn 5 + legacy 격리 + Hero max-w 1440px + Mobile 분기 |
| **M2 AiPanel + 조작감 MVP** | 04-19 ~ 04-20 | 9 | 11 (review 포함) | ai-panel 8 파일 + `#1 fake-typing` + `#3 button-press` + flow 통합 |
| **M3 OrderForm + AI_APPLY 2단** | 04-20 ~ 04-21 | 12 | 13 (review 포함) | order-form 10 파일 + `#6/#7/#8/#9` + partialBeat → allBeat + UI 힌트 Caption |
| **M4 조작감 나머지 + 히트** | 04-21 ~ 04-22 | 4 | 7 (review 포함) | `#2 focus-walk` + `#4 ripple` + `#10 column pulse` + hit-areas 19-area 재작성 |
| **M5 반응형 + 성능 + 검증** | 04-22 | 6 | 5 (review 포함, default ON 포함) | a11y axe-core + reduced-motion CSS/MotionConfig + 번들 측정 + **Phase 3 default 승격** |

---

## 3. 조작감 10종 구현 매핑

| # | 이름 | 대상 | 구현 | 커밋 |
|:---:|---|---|---|---|
| 1 | fake-typing (변동 리듬) | AiInputArea | `interactions/use-fake-typing.ts` + M2-03 통합 | M1-05 / M2-03 |
| 2 | focus-walk (순차 outline) | AiPanel Input→Extract→Results | `use-focus-walk.ts` + AiPanelContainer intervalMs=400 | M1-05 / **M4-01 `873b516`** |
| 3 | button-press (scale+shadow 150ms) | ExtractButton + AiButtonItem | `use-button-press.ts` + partialBeat 카테고리별 offset | M1-05 / M2-04/06 |
| 4 | ripple (click wave 300ms) | AiButtonItem | `use-ripple.ts` + **자동 centered ripple** at rippleTargets | M1-05 / **M4-02 `505f8ed`** |
| 5 | hover (CSS 미세 전환) | AiResultButtons | Tailwind `hover:bg-white/10 transition-colors` | M2-05 |
| 6 | fill-in caret (200ms char-by-char) | Location/DateTime/Cargo/Estimate | `use-fill-in-caret.ts` + partialBeat.fillInFields | M1-05 / M3-03~07 |
| 7 | dropdown beat (600ms open/close) | CargoInfoForm vehicle-type | `partialBeat.dropdownBeat` prop | M3-05 / **review#1 `2d80d16`** |
| 8 | number-rolling (400ms easing) | Estimate/Settlement 금액/거리/시간 | `use-number-rolling.ts` + rollingTriggerAt | M1-05 / M3-07/08 |
| 9 | SVG stroke (dashoffset 200ms) | TransportOptionCard 8옵션 | CSS `stroke-dashoffset` + `use-trigger-at.ts` | M3-06 |
| 10 | column-wise border pulse (400ms ring) | OrderForm grid col-1/col-2/col-3 | `interactions/use-column-pulse.ts` + reduced-motion 가드 | **M4-03 `00103cb`** / review#2 `a80de59` |

**MVP (Must)**: #1 / #3 / #6 / #8 — 4개
**Should (NTH)**: #2 / #4 / #5 / #7 / #9 / #10 — 6개

---

## 4. 주요 기술 결정

### 4-1. Dumb Components + Framework-Free Core (REQ-DASH3-002, 007)
- 모든 ai-register-main 컴포넌트는 `'use client'` + stateless props. 내부 상태 0건.
- zustand / react-hook-form / react-query / next-navigation / @/lib/api import 금지. `grep` 검증 0 match.
- Mock data + preview-steps 가 SSOT 역할. 컴파일 타임에 4-Step 시퀀스 정의.

### 4-2. AI_APPLY 2-beat 구조 (REQ-DASH3-040~043)
- `partialBeat`: 4 카테고리 순차 적용 (departure → destination → cargo → fare, 300ms 간격 × 4 = 1200ms)
- `allBeat`: transport options stroke + number rolling + column 3 pulse 동시 발동 (800ms)
- Total AI_APPLY Step: **2500ms** (1200ms + 800ms + 500ms buffer)
- 전체 loop: 500 + 1500 + 1000 + 2500 + 500(hold) = **6000ms** (REQ-DASH-011 "6~8초" 충족)

### 4-3. Feature Flag 전략 (`useDashV3`)
- M1-04 도입: **default OFF** (env `phase3` / query `?dashV3=1` 로 opt-in)
- M5 closeout `d7c1c76`: **default ON 승격** (opt-out 방향으로 전환)
- opt-out 경로: env `legacy|phase1|phase2|off|0` 또는 query `?dashV3=0`
- query 가 env 보다 우선순위 상위 (세션 단위 명시 opt-in/out 보장)

### 4-4. 동적 청크 분할 (REQ-DASH3-062)
- `AiRegisterMain = dynamic(() => import('./ai-register-main'), { ssr: false })`
- Mobile (<768px) → `MobileCardView` 조기 return + ai-register-main 청크 네트워크 요청 0건
- 청크 크기: **12 KB gzipped** (목표 80~100KB 대비 매우 여유)

### 4-5. 접근성 2-단 fallback (REQ-DASH3-031, 064, 066)
- **globals.css** `@media (prefers-reduced-motion: reduce)` — CSS transition/animation duration 0.01ms
- **MotionProvider** (app/layout.tsx) `<MotionConfig reducedMotion="user">` — framer-motion JS 애니메이션 duration 0 강제
- **JS 훅 가드**: fake-typing / focus-walk / button-press / ripple / fill-in-caret / number-rolling / column-pulse 7종 모두 `prefersReducedMotion()` 검사
- **axe-core**: 4 Step × 2 container = **0 violations**

### 4-6. Hit Areas 19-area 재작성 (M4-04)
- Phase 1/2: Desktop 11 + Tablet 축약 6 → **Phase 3: Desktop=Tablet 동일 19 영역 (Tablet 축약 폐기)**
- AiPanel 8 (tab-bar/input/extract + result-*×4 + json-viewer) + Col 1 × 3 + Col 2 × 4 + Col 3 × 4
- `#11 form-company-manager`: `isEnabled=false` — 클릭 차단 (pre-filled 읽기전용) + hover 툴팁 유지

### 4-7. Phase 1/2 legacy 격리 (M1-07, REQ-DASH3-071)
- `src/__tests__/dashboard-preview/legacy/` 디렉터리 분리 + `vitest.config.ts` include 패턴 토글
- default run (`pnpm test`) 에서 legacy 제외, `LEGACY=true pnpm test` 로 양쪽 동시 검증
- legacy 테스트 현재 58 files / 916 PASS + 3 skipped (Phase 3 M4-04 이후 정리 반영)

---

## 5. 핵심 지표

| 카테고리 | 지표 | 수치 | 목표 | 상태 |
|---|---|---|---|:---:|
| **테스트** | Phase 3 tests | 622 passed / 43 files | 전부 통과 | ✅ |
| | LEGACY tests | 916 + 3 skipped / 58 files | 전부 통과 | ✅ |
| | Coverage | ~85% (신규 파일) | ≥ 80% (REQ-DASH3-070) | ✅ |
| **빌드** | `tsc --noEmit` | exit 0 | 0 errors | ✅ |
| | `pnpm build` | exit 0 | success | ✅ |
| **번들** | ai-register-main chunk | **12 KB gz** | 80~100 KB (REQ-DASH3-060) | ✅ (여유) |
| | Route `/` | 60.8 KB | — | ℹ |
| | First Load JS | 163 KB | — | ℹ |
| **성능** | Dev LCP (Phase 3 ON) | 904 ms | — | ℹ |
| | Production Lighthouse LCP | 미집행 | +100ms 미만 (REQ-DASH3-061) | 🟡 인프라 대기 |
| **접근성** | axe-core violations | 0 | 0 (REQ-DASH3-066) | ✅ |
| | WCAG AA contrast | 통과 | AA (REQ-DASH3-064) | ✅ |
| | Landmark 완전성 | aside + section[role=region] | — | ✅ |
| **구조** | Forbidden imports | 0건 | 0 (REQ-DASH3-002/007) | ✅ |
| | Shared packages | 0건 | 0 | ✅ |
| | shadcn 컴포넌트 수 | 5 | 5 exact (REQ-DASH3-051) | ✅ |

---

## 6. 디렉터리 구조 (최종)

```
apps/landing/src/
├── app/
│   ├── layout.tsx                   ← MotionProvider 래핑 (M5 review#1)
│   └── globals.css                  ← @media reduce fallback (M5-06)
├── components/
│   ├── providers/
│   │   └── motion-provider.tsx      ← MotionConfig reducedMotion="user" (M5 review#1)
│   ├── dashboard-preview/
│   │   ├── dashboard-preview.tsx    ← Feature flag 분기 + Mobile dynamic + AI_APPLY UiHintCaption
│   │   ├── preview-chrome.tsx       ← scaleFactor 0.45/0.40
│   │   ├── step-indicator.tsx       ← 4-dot (M1-04)
│   │   ├── hit-areas.ts             ← Phase 3 19-area (M4-04)
│   │   ├── interactive-overlay.tsx  ← area.isEnabled 반영
│   │   ├── use-dash-v3.ts           ← Feature flag hook (M5 default ON)
│   │   ├── use-auto-play.ts         ← enabled=false → last Step (reduced-motion)
│   │   ├── ai-register-main/        ← Phase 3 메인 (17 파일)
│   │   │   ├── index.tsx
│   │   │   ├── ai-panel/            ← 8 파일
│   │   │   └── order-form/          ← 10 파일 (M3-07 distance info 분리)
│   │   └── interactions/            ← 조작감 훅 (8 파일)
│   │       ├── use-fake-typing.ts
│   │       ├── use-button-press.ts
│   │       ├── use-focus-walk.ts
│   │       ├── use-ripple.ts
│   │       ├── use-fill-in-caret.ts
│   │       ├── use-number-rolling.ts
│   │       ├── use-trigger-at.ts    ← M3 review#2 공통 훅
│   │       └── use-column-pulse.ts  ← M4 review#2 공통 훅
│   └── ui/                          ← shadcn 5 (Button/Input/Textarea/Card/Badge)
├── lib/
│   ├── mock-data.ts                 ← SSOT (기업/담당자/주소/운임/정산 mock)
│   └── preview-steps.ts             ← 4-Step + partialBeat/allBeat 타이밍 트랙
└── __tests__/
    └── dashboard-preview/
        └── legacy/                  ← Phase 1/2 격리 (LEGACY=true 에서만 실행)
```

---

## 7. Post-release 권고

### 7-1. 즉시 (이번 주)
- **Production Lighthouse CI** — `next build && next start` 에서 Phase 3 ON/OFF LCP 비교 (+100ms 미만 입증)
- **apps/landing PR 생성** — CtrlCVbot 로컬 커밋 → 원격 push → PR → staging merge
- **실기기 QA** — Desktop XL / Laptop / iPad / Android Chrome 에서 조작감 10종 수동 검증

### 7-2. 단기 (1~2주)
- **Phase 1/2 legacy 제거 결정** — staging 안정성 관찰 후 `AiPanelPreview` / `FormPreview` / `useDashV3` 훅 / legacy 테스트 디렉터리 제거 시점 결정
- **kit-improvements 2개 패키지 반영** (`.claude/docs/kit-improvements/20260417-dash-preview-phase3/` + `-retrospective/`)
- **문서 Back-propagation** (dev-verification-report §Back-Propagation 제안 4건)

### 7-3. 백로그 (중장기)
- Mobile CardView fidelity 보강 (현재 AI_APPLY 최종 스냅만)
- 조작감 #5 hover 디테일 튜닝
- 실시간 WebSocket 연동 데모
- 다국어 레이아웃 (일본어/영어)

---

## 8. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-22 | 초안 — M1~M5 완료 요약 + 조작감 10종 매핑 + 기술 결정 + 핵심 지표 + 디렉터리 구조 + post-release 권고 |
