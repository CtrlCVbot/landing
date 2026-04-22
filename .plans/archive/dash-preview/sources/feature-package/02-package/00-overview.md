# Feature Overview: dash-preview

> **Feature**: Dashboard Preview (Hero Interactive Demo)
> **Scope**: Standard
> **PRD**: `.plans/prd/10-approved/dashboard-preview-prd.md`
> **Architecture Binding**: `.plans/features/active/dash-preview/00-context/06-architecture-binding.md`
> **Created**: 2026-04-14

---

## 1. Feature 요약

`apps/landing` Hero 영역의 placeholder를 **AI 화물 등록 시네마틱 축소 뷰**로 교체한다. ai-register 페이지의 main 컨텐츠(AiPanel + OrderRegisterForm)를 CSS `transform: scale()`로 축소하여 영상처럼 보여준다.

- **Phase 1**: 자동 재생 5단계 데모 (INITIAL→AI_INPUT→AI_EXTRACT→AI_APPLY→COMPLETE, 18초 루프)
- **Phase 2**: 인터랙티브 탐색 (hover 하이라이트 + 클릭 mock 실행, 11개 히트 영역)

---

## 2. Structure Contract

### Structure Mode

```
feature-local (within apps/landing)
```

### Allowed Target Paths

**Phase 1 — 신규 파일:**

| 파일 | 경로 | 역할 |
|------|------|------|
| dashboard-preview.tsx | `apps/landing/src/components/dashboard-preview/` | Container: 상태 머신 + useAutoPlay |
| preview-chrome.tsx | `apps/landing/src/components/dashboard-preview/` | Chrome 프레임 + ScaledContent |
| ai-panel-preview.tsx | `apps/landing/src/components/dashboard-preview/` | AiPanel 축소 뷰 |
| form-preview.tsx | `apps/landing/src/components/dashboard-preview/` | OrderRegisterForm 축소 뷰 |
| step-indicator.tsx | `apps/landing/src/components/dashboard-preview/` | 5-dot 하단 내비게이션 |
| mobile-card-view.tsx | `apps/landing/src/components/dashboard-preview/` | Mobile 전용 카드 뷰 |
| use-auto-play.ts | `apps/landing/src/components/dashboard-preview/` | 자동 재생 훅 |
| mock-data.ts | `apps/landing/src/lib/` | Mock 데이터 |
| preview-steps.ts | `apps/landing/src/lib/` | Step 정의 |

**Phase 1 — 수정 파일:**

| 파일 | 경로 | 변경 |
|------|------|------|
| hero.tsx | `apps/landing/src/components/sections/` | placeholder → `<DashboardPreview />` |
| motion.ts | `apps/landing/src/lib/` | Preview variants 추가 (기존 수정 없음) |

**Phase 2 — 추가 파일:**

| 파일 | 경로 | 역할 |
|------|------|------|
| interactive-overlay.tsx | `apps/landing/src/components/dashboard-preview/` | 히트 영역 + 툴팁 오버레이 |

### Layer Mapping

```
components/dashboard-preview/  → Presentation Layer (기능 전용)
hooks/ (기존)                   → Application Layer (공유 훅)
lib/mock-data.ts, preview-steps.ts → Infrastructure Layer (기능 데이터)
__tests__/dashboard-preview/   → Test Layer (기능 테스트)
```

### Stack Contract

| 항목 | 값 |
|------|---|
| Language | TypeScript ^5.7 |
| Framework | Next.js 15 (static export, App Router) |
| React | ^18.3 |
| Animation | Framer Motion ^11.15 |
| Styling | Tailwind CSS ^4.0 + cn(clsx + tailwind-merge) |
| Icons | Lucide React ^0.474 |
| Test | Vitest ^3.0 + React Testing Library ^16 |
| 새 패키지 | 없음 |

### Shared-vs-Local Rule

| 위치 | 기준 |
|------|------|
| `components/dashboard-preview/` | 이 기능에만 사용되는 모든 컴포넌트 |
| `lib/mock-data.ts` | 이 기능 전용 데이터 (lib에 배치하여 마케팅팀 접근 용이) |
| `lib/preview-steps.ts` | 이 기능 전용 Step 설정 |
| `lib/motion.ts` | 기존 공유 파일에 variants 추가만 (삭제/수정 금지) |
| `components/shared/` | 터치하지 않음 |

---

## 3. 요구사항 요약 (PRD → Package 추적)

| Phase | Must | Should | 총 |
|-------|------|--------|----|
| Phase 1 | 25 | 7 | 32 |
| Phase 2 | 11 | 2 | 13 |
| **합계** | **36** | **9** | **45** |

**Phase 1 구현 우선**: Phase 1 완료 + 배포 후 Phase 2 착수.

---

## 4. 구현 순서 (Phase 1)

| Step | 기간 | 산출물 | 의존성 |
|------|------|--------|--------|
| 1-1 Foundation | 2~3일 | mock-data, preview-steps, preview-chrome | — |
| 1-2 Core UI | 3~4일 | ai-panel-preview, form-preview | 1-1 |
| 1-3 Animations | 2~3일 | useAutoPlay, 5단계 전환 | 1-2 |
| 1-4 Step Indicator | 1~2일 | step-indicator, 클릭/hover | 1-3 |
| 1-5 Responsive | 2~3일 | mobile-card-view, Tablet 축약 | 1-2 |
| 1-6 Polish | 1~2일 | a11y, 성능, hero.tsx 통합 | 1-3,4,5 |

---

## 5. 성능 제약

| 제약 | 값 | 검증 명령 |
|------|---|----------|
| JS 번들 | <30KB gzipped | `pnpm run build` → chunk 크기 확인 |
| LCP | +100ms 미만 | Lighthouse CI |
| 프레임율 | 60fps | Chrome DevTools Performance |
| 등장 지연 | 0.6s | heading/CTA 이후 |

---

## 6. Verification Contract

```bash
pnpm run typecheck    # 0 errors
pnpm run lint         # 0 warnings in new files
pnpm run test         # 80%+ coverage in dashboard-preview/
pnpm run build        # exit 0, static export
```

---

## 7. 미결정 사항

| # | 항목 | 선택지 | 결정 시점 |
|---|------|--------|----------|
| 1 | 축소 스케일 팩터 정확한 값 | 0.4 vs 0.45 vs 0.5 | 1-2 Core UI 구현 시 시각 테스트 |
| 2 | Tablet 하차지 LocationForm 처리 | 축약형 유지 vs 생략+상차지에 피드백 | 1-5 Responsive 구현 시 |
| 3 | DateTimePreview 분리 여부 | LocationPreview에 포함 vs 별도 컴포넌트 | 1-2 Core UI 구현 시 |
| 4 | 카톡 메시지 타이핑 속도 | 글자당 30ms vs 50ms vs 80ms | 1-3 Animations 구현 시 |
