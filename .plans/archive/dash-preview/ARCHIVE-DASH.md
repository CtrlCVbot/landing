# Archive: Dashboard Preview — AI 화물 등록 시네마틱 축소 뷰 + 인터랙티브 탐색

> **Key**: DASH | **Slug**: `dash-preview` | **IDEA**: — (Parent Feature: IDEA-001 OPTIC 랜딩의 improvement)
> **Category**: Standard | **RICE Score**: — | **Archived**: 2026-04-15
> **Code Location**: `apps/landing/src/components/dashboard-preview/`
> **Pipeline**: P4(PRD) → P5(Wireframe) → P6(Stitch) → P7(Bridge) → Dev → Archive
> **Improvements**: 0

---

## 메타데이터

| 항목 | 값 |
|------|---|
| Feature Key | DASH |
| Feature Slug | dash-preview |
| 파생 출처 | OPTIC 랜딩 개선 (archive/optic-landing-page/improvements/2026-04-14-dashboard-preview-phase-1.md) |
| Category | Standard (Phase 1 시네마틱 + Phase 2 인터랙티브) |
| Verdict | Go (구현 완료) |
| Pipeline Path | P4 → P5 → P6 → P7 → Dev → Archive |
| Code Location | `apps/landing/src/components/dashboard-preview/` + `apps/landing/src/lib/mock-data.ts`, `preview-steps.ts` |
| 참조 UI | `.references/code/mm-broker/app/broker/order/ai-register/page.tsx` |
| Archived Date | 2026-04-15 |
| Commits | 4개 — Phase 1 초기(`5416930`), 선택 개선(`8605d0e`), Phase 2(`484a877`), StrictMode 핫픽스(`1cb343f`) |

## 원본 파일 매니페스트

| 원본 경로 | 현재 위치 | 유형 |
|-----------|----------|------|
| .plans/prd/10-approved/dashboard-preview-prd.md | sources/dashboard-preview-prd.md | PRD |
| .plans/wireframes/dash-preview/screens.md | sources/wireframes/screens.md | Wireframe |
| .plans/wireframes/dash-preview/navigation.md | sources/wireframes/navigation.md | Wireframe |
| .plans/wireframes/dash-preview/components.md | sources/wireframes/components.md | Wireframe |
| .plans/stitch/dash-preview/mapping.md | sources/stitch/mapping.md | Stitch |
| .plans/stitch/dash-preview/context.md | sources/stitch/context.md | Stitch |
| .plans/stitch/dash-preview/validation.md | sources/stitch/validation.md | Stitch |
| .plans/features/active/dash-preview/ | sources/feature-package/ | Feature Package (Context+Package+DevNotes) |

---

## 1. Feature 요약

`apps/landing` Hero 영역의 placeholder를 **AI 화물 등록 시네마틱 축소 뷰**로 교체하고, Phase 2에서 **인터랙티브 탐색 모드**를 추가했다.

### Phase 1 — 시네마틱 뷰 (자동 재생)

5단계 자동 재생 데모 (18초 루프):
1. **INITIAL** (3s) — 빈 폼 + AI 패널
2. **AI_INPUT** (4s) — 카톡 메시지 타이핑 효과
3. **AI_EXTRACT** (4s) — 로딩 스피너 → 4개 카테고리 버튼 생성
4. **AI_APPLY** (4s) — 버튼 순차 초록 전환 + 폼 필드 자동 채움
5. **COMPLETE** (3s) — 완성된 폼 + 운임 420,000원

### Phase 2 — 인터랙티브 탐색

축소 뷰 내부 클릭 → interactive 모드 진입:
- **11개 히트 영역** (Desktop) / **6개** (Tablet, AI 패널만)
- Hover 하이라이트 + 설명 툴팁 (원본 크기 14px)
- 클릭 mock 실행 → goToStep으로 step 점프
- Tab/Enter/Space 키보드 접근성
- Escape 즉시 종료 / 10초 비활동 자동 복귀
- aria-live 스크린리더 안내

---

## 2. 구현 통계

| 항목 | Phase 1 | Phase 2 | 합계 |
|------|---------|---------|------|
| 컴포넌트 | 7 | 4 | 11 |
| 라이브러리 | 3 (mock-data, preview-steps, motion) | 0 | 3 |
| 테스트 파일 | 10 (9 + setup) | 5 | 15 |
| **테스트 수** | 154 | 146 | **300** |
| 번들 증가 | 55.7KB | +1.6KB | 57.3KB |
| REQ 요구사항 | 32 | 20 | 52 (REQ-DASH-001~052) |

### Quality Gate (최종)

| 게이트 | 결과 |
|--------|------|
| TypeCheck | 0 errors |
| Lint | 0 warnings |
| Test | 300 passed, 0 failed |
| Build | 57.3kB page size, 정적 export 성공 |
| DVC (Dev Verification) | 전체 PASS |

---

## 3. Decision Log 요약 (12건)

| ID | 결정 | 핵심 근거 |
|----|------|----------|
| DEC-001 | 수동 주문 등록 → AI 화물 등록 시나리오 | AI 자동화 차별화 강화 |
| DEC-002 | 참조 UI `register` → `ai-register` | AI 실제 구현체 반영 |
| DEC-003 | chrome 내부에서 Header/Breadcrumb 제외 | main 기능 영역만 표시 |
| DEC-004 | Hero 레이아웃 변경 철회 | 중앙 정렬 단일 컬럼 유지 |
| DEC-005 | Phase 1/2 분리 | 독립 가치 제공 + 리스크 관리 |
| DEC-006 | CSS transform scale 시네마틱 축소 뷰 | 밀도/느낌 전달 목적 |
| DEC-007 | Mobile 인터랙티브 모드 미지원 | 터치 정밀도 한계 |
| DEC-008 | 히트 영역 11개 확정 (PRD Amendment) | Wireframe 설계 결과 반영 |
| DEC-009 | Tablet scaleFactor 0.38 허용 | 레이아웃 수용을 위한 범위 확장 |
| DEC-010 | ScaledContent ref 기반 동적 높이 | transform: scale은 레이아웃 공간 유지 이슈 해결 |
| DEC-011 | DateTimePreview를 LocationPreview 내 통합 | 컴포넌트 파일 축소 |
| DEC-012 | Phase 1 실측 결과 확정 | 0.45/0.38 scale, 18초 루프, 155KB 번들 |

---

## 4. 리뷰 이력 요약

### PRD 리뷰 (v1~v4)

- **v1**: 초안 작성 후 WARN 판정, 카피 가이드라인/모바일 자동 재생/메트릭 등 MEDIUM 5건 개선
- **v2**: HIGH 1건(timeout 우선순위) 해결 + Phase 1/2 분리 + 시네마틱 축소 뷰 도입
- **v3**: 참조 UI `ai-register`로 변경, chrome 내부 main 컨텐츠만 표시
- **v4**: Phase 2 세부 요구사항 추가(REQ-DASH-046~052), 리뷰 HIGH 3건 해결 → PASS

### Wireframe 리뷰

- HIGH 1건(Step 인덱싱 0-based vs 1-based 혼용) → Step ID로 통일
- MEDIUM 5건(Tablet 하차지 생략 영향, 모드 전환 시각 큐, 로딩 스피너 상세, 파일명 확정 등) 해결
- LOW 3건(히트 영역 11개 표기, Mobile cross-fade 시간, 번들 버퍼) 반영
- 최종 PASS

### Feature Package 리뷰

- HIGH 4건 해결: Step 인덱싱 혼재, 리스크 번호 재배치, Phase 2 모바일 비활성 REQ 추가, 매트릭스 정합성
- MEDIUM 5건(useAutoPlay lastPauseSource 리셋, Tablet scaleFactor 범위, TC 매트릭스 등) 보정
- 최종 PASS

### Dev Verification

- **Phase 1 DVC**: DVC-01~06 모두 PASS, 143 tests
- **Phase 2 DVC**: DVC-01~06 모두 PASS, 148 추가 tests (누적 300)

### 브라우저 시각 검증

- Phase 1: 시네마틱 5단계 자동 재생 + 반응형 확인 완료
- Phase 2: 인터랙티브 모드 진입, hover 툴팁, 클릭 mock 실행(step 점프), Escape 종료, Tab+Enter 키보드, Tablet 6개 히트 영역, Mobile 비활성화 **전부 PASS**
- **StrictMode 버그 발견 및 수정** (`1cb343f`): useInteractiveMode의 setState updater 내부 side effect를 바깥으로 이동

---

## 5. 구조 계약

| 축 | 값 |
|---|---|
| Workspace topology | monorepo (pnpm + turborepo) |
| Structure mode | feature-local (within `apps/landing`) |
| Layer style | hexagonal (presentation/application/infrastructure 간소화) |
| Stack contract | TypeScript 5.7 + Next.js 15 + React 18 + Framer Motion 11 + Tailwind CSS v4 + Vitest |

### Allowed Target Paths

**Phase 1 (신규):**
- `apps/landing/src/components/dashboard-preview/dashboard-preview.tsx`
- `apps/landing/src/components/dashboard-preview/preview-chrome.tsx`
- `apps/landing/src/components/dashboard-preview/ai-panel-preview.tsx`
- `apps/landing/src/components/dashboard-preview/form-preview.tsx`
- `apps/landing/src/components/dashboard-preview/step-indicator.tsx`
- `apps/landing/src/components/dashboard-preview/mobile-card-view.tsx`
- `apps/landing/src/components/dashboard-preview/use-auto-play.ts`
- `apps/landing/src/lib/mock-data.ts`
- `apps/landing/src/lib/preview-steps.ts`

**Phase 1 선택적 개선 (신규):**
- `apps/landing/src/components/dashboard-preview/use-animated-number.ts`

**Phase 2 (신규):**
- `apps/landing/src/components/dashboard-preview/interactive-overlay.tsx`
- `apps/landing/src/components/dashboard-preview/interactive-tooltip.tsx`
- `apps/landing/src/components/dashboard-preview/use-interactive-mode.ts`
- `apps/landing/src/components/dashboard-preview/hit-areas.ts`

**수정 (기존):**
- `apps/landing/src/components/sections/hero.tsx` (placeholder → DashboardPreview)
- `apps/landing/src/lib/motion.ts` (Preview variants 추가)
- `apps/landing/src/__tests__/setup.ts` (ResizeObserver mock)

---

## 6. 주요 요구사항 (REQ-DASH-001~052)

### Phase 1 (REQ-DASH-001~032)

- **Container & Chrome** (001~003): 브라우저 프레임, 축소 스케일, main 컨텐츠만
- **AI Panel** (004~006): 좌측 사이드바, textarea, 추출하기 버튼, 4 카테고리 결과 버튼
- **Form Panel** (007~009): 5 Card 블록, AI 적용 시 필드 채움, 금액 카운팅
- **Auto-Play** (010~013): 5단계 시퀀스, 2~4초/단계, 18초 루프, cross-fade 전환
- **Step Indicator** (014~016): 5-dot, 클릭 이동, 5초 후 재개
- **Interactions** (017~019): hover pause, mouseout 2초 재개, timeout 우선순위
- **Mock Data** (020~022): 한국 운송 현실 데이터
- **Responsive** (023~026): Desktop/Tablet/Mobile 3단계
- **Accessibility** (027~029): reduced-motion, aria-label, 키보드
- **Performance** (030~032): <30KB 번들, LCP +100ms 미만, CSS 우선

### Phase 2 (REQ-DASH-033~052)

- **Mode Switch** (033~035): 시네마틱↔인터랙티브, 10초 비활동 복귀
- **Highlight** (036~038): accent border 2px, 원본 크기 툴팁
- **Click Mock** (039~041): 영역별 mock 실행, 논리적 의존
- **Tooltip** (042): mock-data.ts 관리
- **Hit Area** (043~044): 투명 오버레이, scale 역변환, 최소 44x44
- **Responsive** (045~047): Mobile 비활성, Tablet 6개, 최소 16x16
- **A11y** (048~052): Tab/Enter/Space, focus-visible, Escape, Arrow 키, aria-live

---

## 7. 커밋 이력

```
1cb343f fix(landing): useInteractiveMode setState updater 내부 side effect 제거
484a877 feat(landing): dash-preview Phase 2 인터랙티브 탐색 모드 구현
8605d0e feat(landing): dash-preview Phase 1 선택적 개선 3건
5416930 feat(landing): add Dashboard Preview Phase 1 — AI 화물 등록 시네마틱 축소 뷰
```

**누적**: 38 files, ~6,400 insertions, 300 tests passing

---

## 8. 교훈 (Lessons Learned)

### 기술

1. **React 18 StrictMode에서 setState updater는 pure해야 한다**
   - updater 내부에서 다른 setState/callback을 호출하면 StrictMode 이중 실행 시 race condition 발생
   - 해결: updater는 상태 전환만, side effect는 ref 비교 후 updater 바깥에서 실행
   - 테스트에서 잡히지 않고 실제 dev 환경에서 드러남 → **브라우저 시각 검증 필수**

2. **CSS `transform: scale()`은 레이아웃 공간을 보존한다**
   - 시각적으로만 축소, 원본 높이를 컨테이너가 그대로 차지
   - ref + ResizeObserver로 동적 높이 측정하여 외부 래퍼 height 설정해야 올바른 레이아웃

3. **useMediaQuery는 SSR/Hydration에서 initial mismatch 발생 가능**
   - 서버: false, 클라이언트 첫 render: false, useEffect 후 실제 값 반영
   - Mobile 첫 깜빡임 감수 또는 CSS 미디어 쿼리 병용 고려

### 프로세스

1. **Phase 분리가 리스크를 낮춘다** — Phase 1 배포 → 피드백 → Phase 2 착수 가능
2. **기획 파이프라인의 PCC 검증**이 요구사항 누락을 조기에 발견
3. **에이전트 팀 병렬 TDD**로 12 TASK를 빠르게 완료 (각 TASK ~150~200초)
4. **Hotfix도 명확히 커밋 분리** — 버그 수정 원인/증상/해결을 commit body에 기록

---

## 9. 후속 작업 가능성 (Improvements 영역)

향후 개선 요청이 있으면 `improvements/IMP-DASH-{NNN}.md`로 추가한다.

후보:
- **다중 시나리오** — 현재 AI 등록 1개, 향후 배차/정산/세금계산서 시나리오 추가
- **실제 입력 모드** — 클릭 체험을 넘어 실제 타이핑 입력 (별도 데모 페이지에서)
- **국제화** — 한국어 외 영어 지원
- **Analytics 연동** — 인터랙티브 모드 진입율, 히트 영역별 클릭 수 수집
- **A/B 테스트** — Phase 1만 vs Phase 1+2 전환율 비교

---

## 10. 개선 이력 (Improvements Log)

| IMP ID | 제목 | Category | Priority | Status | 등록일 | 경로 |
|--------|------|----------|----------|--------|-------|------|
| [IMP-DASH-001](improvements/IMP-DASH-001.md) | DashboardPreview를 실제 ai-register 레이아웃/컴포넌트로 완전 재현 | enhancement | P1 | draft | 2026-04-15 | `improvements/IMP-DASH-001.md` |
