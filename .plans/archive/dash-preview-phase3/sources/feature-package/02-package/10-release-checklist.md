# 릴리스 체크리스트: dash-preview-phase3

> **Feature**: Dashboard Preview Phase 3
> **PRD**: [`../00-context/01-prd-freeze.md`](../00-context/01-prd-freeze.md)
> **TASK Mapping**: [`08-dev-tasks.md`](./08-dev-tasks.md)
> **Test Cases**: [`09-test-cases.md`](./09-test-cases.md)
> **Created**: 2026-04-17

---

## 0. 이 문서의 역할

Phase 3 릴리스(Phase 1/2 → Phase 3 Feature flag 전환) 전에 만족해야 할 모든 게이트 체크리스트. 각 항목은 **증거 기반 완료** 원칙(verification.md)에 따라 **실제 실행/측정 결과**를 기록한다.

---

## 1. 기능 검증 (M1~M4)

### 1-1. 구조 검증

| # | 항목 | 검증 방법 | 통과 기준 | TC | 결과 |
|---|------|----------|----------|-----|------|
| 1 | Chrome 프레임 + AiRegisterMain 렌더링 | 시각 확인 | "OPTIC Broker" + window dots + ai-register-main container | TC-DASH3-INT-CHROME | [ ] |
| 2 | AiPanel 380 + OrderForm 3-col 구조 | DevTools 검사 | `grid grid-cols-1 lg:grid-cols-3 gap-4` 루트 + 3 자식 `lg:col-span-1 space-y-4` | TC-DASH3-INT-GRID, TC-DASH3-INT-COLS | [ ] |
| 3 | AiPanel 8 컴포넌트 | 시각 확인 | TabBar/InputArea/ExtractButton/ResultButtons/ButtonItem/WarningBadges/JsonViewer 존재 | TC-DASH3-INT-AIPANEL | [ ] |
| 4 | OrderForm 9 컴포넌트 + Col 순서 | 시각 확인 | Col 1(Company/상차/하차) / Col 2(거리/DateTime/Cargo) / Col 3(Transport/Estimate/Settlement) | TC-DASH3-INT-ORDERFORM | [ ] |
| 5 | 외부 import 0건 | grep | `@/store / react-hook-form / @tanstack/react-query / next/navigation / @/lib/api` in `ai-register-main/` = 0 | TC-DASH3-INT-NOSTATE | [ ] |
| 6 | RegisterSummary 미복제 | 파일 존재 확인 | `order-form/register-summary.tsx` 없음 | TC-DASH3-INT-NOSUMMARY | [ ] |
| 7 | SuccessDialog open=false 고정 | DevTools + E2E | 전 Step에서 Dialog DOM 비가시 | TC-DASH3-UNIT-SUCCESSOFF | [ ] |
| 8 | shadcn 5 컴포넌트만 | `components/ui/` 파일 카운트 | 5 파일 (Button/Input/Textarea/Card/Badge), Radix 2개만 package.json 추가 | TC-DASH3-INT-SHADCN | [ ] |

### 1-2. Step 시퀀스 + 조작감

| # | 항목 | 검증 방법 | 통과 기준 | TC | 결과 |
|---|------|----------|----------|-----|------|
| 9 | 4-Step 자동 재생 | 8초 관찰 | INITIAL → AI_INPUT → AI_EXTRACT → AI_APPLY 순서 + 루프 | TC-DASH3-INT-MATRIX | [ ] |
| 10 | 총 루프 6~8초 | Playwright 타임라인 | 6000 ≤ 루프 시간 ≤ 8000 ms | TC-DASH3-PERF-LOOP | [ ] |
| 11 | Step 전환 오버랩 100~200ms | Playwright 타임라인 | 각 경계에서 100~200ms 오버랩 측정 | TC-DASH3-INT-OVERLAP | [ ] |
| 12 | Step duration 상한 | Playwright 타임라인 | INITIAL ≤ 500 / AI_INPUT ≤ 2000 / AI_EXTRACT ≤ 1000 / AI_APPLY ≤ 2500 ms | TC-DASH3-PERF-STEPDUR | [ ] |
| 13 | #1 fake-typing | AI_INPUT 관찰 | 변동 리듬 (표준편차 > 0), ≤ 1.5s 완성 | TC-DASH3-UNIT-TYP-1/2 | [ ] |
| 14 | #3 button-press | AI_EXTRACT + AI_APPLY 관찰 | scale 0.97 + shadow, 150ms 복귀 | TC-DASH3-UNIT-PRESS-1/2 | [ ] |
| 15 | #6 fill-in caret | AI_APPLY 관찰 | Location/Cargo/DateTime/Estimate caret 150~200ms + 즉시 값, 간격 ≤ 120ms | TC-DASH3-UNIT-FILLIN-1/2 | [ ] |
| 16 | #8 number-rolling | AI_APPLY 관찰 | Estimate 운임 + Settlement 합계 0.3~0.5초 롤링 | TC-DASH3-UNIT-ROLL-1/2 | [ ] |
| 17 | #6 CompanyManager 제외 | 조작감 trigger 확인 | CompanyManager 필드 caret trigger 0건 | TC-DASH3-INT-PREFILLED-SKIP | [ ] |
| 18 | #10 Column Pulse | AI_APPLY 관찰 | 활성 Column 자식에 outline + shadow 400ms. Col 1 all beat 0건 | TC-DASH3-INT-COLPULSE | [ ] |
| 19 | #2 focus-walk (Should) | AI_INPUT → AI_EXTRACT 관찰 | outline 4px 순차 이동 | TC-DASH3-UNIT-FOCUS | [ ] |
| 20 | #4 ripple (Should) | AI_APPLY partialBeat | 원형 wave 300ms | TC-DASH3-UNIT-RIPPLE | [ ] |
| 21 | #5 hover CSS (Should) | 수동 hover | `:hover` 전환 | TC-DASH3-UNIT-HOVER | [ ] |
| 22 | #7 dropdown (Should) | AI_APPLY CargoInfoForm | 열림-하이라이트-닫힘 3 beat, 600ms 이내 | TC-DASH3-UNIT-DROP | [ ] |
| 23 | #9 toggle stroke (Should) | AI_APPLY TransportOption | stroke-dashoffset 200ms × 8옵션 stagger 60ms + 자동배차 | TC-DASH3-UNIT-STROKE | [ ] |

### 1-3. AI_APPLY 2단 + UI 힌트

| # | 항목 | 검증 방법 | 통과 기준 | TC | 결과 |
|---|------|----------|----------|-----|------|
| 24 | partialBeat 타이밍 | Playwright | 4 카테고리 150~250ms 간격, 총 ≤ 1.5s | TC-DASH3-INT-PARTIAL | [ ] |
| 25 | allBeat 타이밍 | Playwright | TransportOption 8 + 자동배차 + Settlement 80~120ms 간격, 총 ≤ 0.6s | TC-DASH3-INT-ALL | [ ] |
| 26 | allBeat 담당자 연락처 제외 | fillInFields entry 확인 | manager-* 대상 entry 0건 | TC-DASH3-INT-PREFILLED-SKIP | [ ] |
| 27 | UI 힌트 Caption | AI_APPLY 관찰 | "골라 받을 수도, 한 번에 받을 수도 있다" fade-in 200ms, AI_APPLY 중만 표시 | TC-DASH3-INT-HINT | [ ] |
| 28 | 아이콘 + 텍스트 스타일 | DevTools | 💡 아이콘 + text-xs (Desktop) / text-[10px] (Tablet), Preview 외곽 직하 | TC-DASH3-INT-HINT | [ ] |

### 1-4. Pre-filled (REQ-DASH3-014 핵심)

| # | 항목 | 검증 방법 | 통과 기준 | TC | 결과 |
|---|------|----------|----------|-----|------|
| 29 | mock-data SSOT 정합 | `TC-DASH3-SSOT-MOCK-1~8` 실행 | 모든 필드 wireframe decision-log §4-3 exact match | TC-DASH3-SSOT-MOCK-* | [ ] |
| 30 | CompanyManager 전 Step pre-filled | E2E 4 Step 모두 | 옵틱물류 / 이매니저 / 010-****-**** / 물류운영팀 유지 | TC-DASH3-INT-PREFILLED | [ ] |
| 31 | 마스킹 규칙 | 시각 확인 | 연락처 `010-****-****`, 사업자 `***-**-*****`, 이메일 `example@optics.com` | TC-DASH3-SSOT-MOCK-2/5/6 | [ ] |
| 32 | 히트 영역 #11 비활성 | 인터랙티브 모드 | click → mock 동작 0건. hover → 툴팁 표시만 | TC-DASH3-UNIT-HITAREA-2 | [ ] |

---

## 2. 반응형 검증 (M5)

| # | 항목 | 뷰포트 | 검증 방법 | 통과 기준 | TC | 결과 |
|---|------|--------|----------|----------|-----|------|
| 33 | Desktop 0.45 + 3-col | ≥ 1024px | DevTools `transform: scale(0.45)` + grid | 3-col 유지, 가독성 확보 | TC-DASH3-PERF-SCALE | [ ] |
| 34 | **Tablet 0.40 + 3-col 유지 (C안)** | 768~1023px | DevTools `transform: scale(0.40)` + grid (no 1-col reflow) | 3-col 유지, 최소 가독성 | TC-DASH3-INT-TABLET + TC-DASH3-PERF-SCALE | [ ] |
| 35 | **Tablet 가독성 A/B 검증 (R5)** | 768~1023px | 사용자 리뷰 3인 이상 | "읽을 수 있음" 합의 (실패 시 0.45 상향 또는 1-col reflow 폴백) | — | [ ] |
| 36 | Mobile MobileCardView | < 768px | DevTools | chrome 없음, 2-card 자동 전환 (AI_EXTRACT + AI_APPLY 완료) | TC-DASH3-INT-MOBILE | [ ] |
| 37 | Mobile 텍스트 가독성 | < 768px | 시각 확인 | 14~16px 수준 | — | [ ] |
| 38 | Mobile 청크 비로드 | < 768px | DevTools Network | `ai-register-main` chunk 요청 0건 | TC-DASH3-PERF-MOBILE | [ ] |
| 39 | 히트 영역 Tablet 전체 활성 | 768~1023px | 인터랙티브 모드 | Phase 2의 "Tablet 축약 6개" **폐기**. Desktop 동일 19~20 전체 활성 | TC-DASH3-UNIT-HITAREA-1 | [ ] |

---

## 3. 접근성 검증

| # | 항목 | 검증 방법 | 통과 기준 | TC | 결과 |
|---|------|----------|----------|-----|------|
| 40 | axe-core 스캔 | vitest-axe | 0 violations | TC-DASH3-A11Y-AXE | [ ] |
| 41 | aria-label | DevTools | `"AI 화물 등록 워크플로우 데모 미리보기"` | TC-DASH3-A11Y-ARIA | [ ] |
| 42 | UI 힌트 aria-live | Screen reader | AI_APPLY 진입 시 1회 polite 읽힘 | TC-DASH3-A11Y-ARIALIVE | [ ] |
| 43 | 키보드 탐색 | Tab + ArrowLeft/Right + Enter/Space | StepIndicator 진입/이동/활성화 | TC-DASH3-A11Y-KBD | [ ] |
| 44 | HitArea 키보드 | Tab | 인터랙티브 모드에서 19~20 영역 순차 focus | TC-DASH3-A11Y-HIT | [ ] |
| 45 | **prefers-reduced-motion** | OS 설정 + DevTools 에뮬레이션 | 조작감 10종 duration=0, STATE-004b 정적 표시, StepIndicator 클릭만 허용 | TC-DASH3-A11Y-REDMO | [ ] |
| 46 | WCAG AA 색상 대비 | 대비 스캔 도구 | 모든 색상 조합 AA 이상 | TC-DASH3-A11Y-CONTRAST | [ ] |

---

## 4. 성능 검증

| # | 항목 | 검증 명령/도구 | 통과 기준 | TC | 결과 |
|---|------|-------------|----------|-----|------|
| 47 | **JS 번들 크기** | `pnpm run build` chunk 크기 | ai-register-main chunk **80~100KB gzipped** | TC-DASH3-PERF-BUNDLE | [ ] |
| 48 | 전체 First Load JS | `pnpm run build` | ≤ **252KB** gzipped | TC-DASH3-PERF-FIRSTLOAD | [ ] |
| 49 | **LCP 영향** | Lighthouse CI (전/후 비교) | +100ms 미만 | TC-DASH3-PERF-LCP | [ ] |
| 50 | 프레임율 | Chrome DevTools Performance | 60fps 유지 | — | [ ] |
| 51 | CSS 우선 애니메이션 | 코드 검토 | JS는 #8 number-rolling + #1 fake-typing + #6 fill-in-caret + #3 button-press + #2 focus-walk + #4 ripple에만 (6 유틸). #5/#7/#9/#10 CSS only | — | [ ] |
| 52 | `requestIdleCallback` 로드 | DevTools Performance | `ai-register-main` Hero 진입 후 로드 | TC-DASH3-PERF-LCP | [ ] |

---

## 5. 빌드/테스트 검증

| # | 항목 | 검증 명령 | 통과 기준 | 결과 |
|---|------|---------|----------|------|
| 53 | TypeScript | `pnpm run typecheck` | 0 errors | [ ] |
| 54 | Lint | `pnpm run lint` | 0 warnings in new files | [ ] |
| 55 | 신규 테스트 전체 | `pnpm run test` (legacy 제외) | 전부 통과 | [ ] |
| 56 | **커버리지 80%+** | `pnpm run test -- --coverage ai-register-main interactions` | `ai-register-main/` 80%+ / `interactions/` 90%+ / `lib/mock-data.ts` + `lib/preview-steps.ts` 95%+ | [ ] |
| 57 | **Legacy 격리 동작 (A안)** | `pnpm run test` (legacy 제외 기본 실행) | `legacy/` 디렉터리 분리 + include 패턴 동작 확인 | [ ] |
| 58 | **Legacy 회귀 확인** | `LEGACY=true pnpm run test -- legacy` | Phase 1/2 테스트 여전히 pass (회귀 확인용) | [ ] |
| 59 | 빌드 | `pnpm run build` | exit 0, static export 성공 | [ ] |

---

## 6. Feature Flag 검증

| # | 항목 | 검증 방법 | 통과 기준 | TC | 결과 |
|---|------|----------|----------|-----|------|
| 60 | Feature flag OFF (Phase 1/2 경로) | `NEXT_PUBLIC_DASH_PREVIEW_VERSION=phase12` | Phase 1/2 UI 정상 렌더, 기존 회귀 테스트 통과 | TC-DASH3-INT-FLAG | [ ] |
| 61 | Feature flag ON (Phase 3 경로) | `NEXT_PUBLIC_DASH_PREVIEW_VERSION=phase3` | Phase 3 UI 렌더, 신규 테스트 통과 | TC-DASH3-INT-FLAG | [ ] |
| 62 | 기본값 확인 | env 미설정 | Phase 1/2(기존) fallback (사용자 합의 후 변경) | — | [ ] |
| 63 | 롤백 안전성 | 환경변수 변경 한 번으로 Phase 1/2 복귀 | 배포 없이 복귀 성공 | — | [ ] |

---

## 7. 크로스 브라우저

| # | 브라우저 | 검증 항목 | 결과 |
|---|---------|----------|------|
| 64 | Chrome (latest) | 4-Step 루프 + 조작감 10종 + 반응형 + Feature flag | [ ] |
| 65 | Firefox (latest) | 동일 | [ ] |
| 66 | Safari (latest) | 동일 (특히 `transform: scale()` + `stroke-dashoffset` SVG 애니) | [ ] |

---

## 8. Hero 통합

| # | 항목 | 검증 방법 | 통과 기준 | 결과 |
|---|------|----------|----------|------|
| 67 | hero.tsx 변경 없음 | git diff | Phase 1에서 이미 `<DashboardPreview />` 삽입 완료. Phase 3에서 추가 변경 0건 | [ ] |
| 68 | 레이아웃 보존 | 전후 비교 | h1, p, CTA 위치/스타일 변경 없음 | [ ] |
| 69 | 등장 지연 | 시각 확인 | heading/CTA 이후 0.6s delay | [ ] |

---

## 9. 잔여 선결 질문 (Release Gate)

| Q# | 상태 | 릴리스 전 필수 | 확인 |
|----|------|--------------|------|
| Q1 번들 예산 | 해소 | (이미 충족) | ✅ |
| Q2 broker 통합 일정 | 미해소 | **릴리스 불필요** — Option A 별도 Feature로 처리. `06-architecture-binding.md` §4-1 Future Migration Alignment 경계 유지 | [ ] 확인 |
| Q3 shadcn 3-C | 해소 | (이미 충족) | ✅ |
| **Q7 테스트 legacy 격리** | **A안 확정 (Phase B)** | **#57/#58 통과 시 충족** | [ ] |
| Q9 조작감 MVP | 해소 | (이미 충족) | ✅ |

---

## 10. 증거 첨부 양식

각 항목 "결과" 체크 시 **증거 링크/값** 기록 권장:

| 항목 | 증거 유형 | 예시 |
|------|----------|------|
| 번들 크기 | build output | `ai-register-main chunk: 92.3KB gzipped` |
| LCP | Lighthouse report URL | `https://...` |
| 테스트 커버리지 | vitest coverage report | `ai-register-main: 83.2% / interactions: 91.5%` |
| axe-core | vitest-axe report | `0 violations across 12 test files` |
| 타이밍 | Playwright 타임라인 스크린샷 | `evidence/perf/loop-timeline.png` |

증거 파일은 `.plans/features/active/dash-preview-phase3/evidence/release/` 하위에 저장.

---

## 11. 릴리스 결정 기준

**최소 합격선** (모두 충족):
- 섹션 1~5의 **Must** 관련 항목 전부 통과
- 섹션 2 #35 Tablet 가독성 R5 A/B 통과 또는 폴백 결정
- 섹션 3 #45 prefers-reduced-motion 통과
- 섹션 4 #47 번들 80~100KB, #49 LCP +100ms 미만
- 섹션 6 Feature flag 양쪽 정상
- Q7 legacy 격리 확정 (#57/#58)

**Should 미통과 시**: 릴리스 가능하되 해당 조작감(NTH)은 다음 iteration로 이관.

---

## 12. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-04-17 | 초안 — 12개 섹션 69개 체크 항목 (기능/반응형/a11y/성능/빌드/Feature flag/크로스 브라우저/Hero 통합/Q 해소/증거 양식/릴리스 결정 기준) |
| 2026-04-17 | Phase C — #57 A안 단일화, #58 설명 명확화, Q7 릴리스 게이트 "A안 확정 (Phase B)" 갱신 |
