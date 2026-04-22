# 릴리스 체크리스트: dash-preview

> **Feature**: Dashboard Preview (Hero Interactive Demo)
> **PRD**: `.plans/prd/10-approved/dashboard-preview-prd.md`
> **Created**: 2026-04-14

---

## 1. Phase 1 릴리스 전 체크리스트

### 1-1. 기능 검증

| # | 항목 | 검증 방법 | 통과 기준 | 결과 |
|---|------|----------|----------|------|
| 1 | Chrome 프레임 렌더링 | 시각 확인 | "OPTIC Broker" 타이틀 + 3 dots 표시 | [ ] |
| 2 | 축소 뷰 표시 | 시각 확인 | 내부 콘텐츠 축소됨 (텍스트 6~8px 수준) | [ ] |
| 3 | AiPanel + Form 2열 구조 | 시각 확인 | 좌측 AiPanel, 우측 Form 구분 가능 | [ ] |
| 4 | 5단계 자동 재생 | 18초 관찰 | INITIAL→AI_INPUT→AI_EXTRACT→AI_APPLY→COMPLETE 순서 | [ ] |
| 5 | 루프 재생 | 36초 관찰 | Step 5 이후 Step 1으로 복귀 | [ ] |
| 6 | 타이핑 효과 (Step 2) | AI_INPUT 단계 관찰 | 카카오톡 메시지 글자 순차 등장 | [ ] |
| 7 | AI 버튼 stagger (Step 3) | AI_EXTRACT 단계 관찰 | 4 카테고리 순차 등장, 파란색 | [ ] |
| 8 | 버튼→폼 연결 (Step 4) | AI_APPLY 단계 관찰 | 파랑→초록 전환 + 폼 값 순차 채움 | [ ] |
| 9 | 금액 카운팅 (Step 4) | AI_APPLY 운임 적용 시 | 0→420,000원 점진적 변화 | [ ] |
| 10 | StepIndicator 렌더링 | 시각 확인 | 5 dots, 현재 step accent 강조 | [ ] |
| 11 | Step 클릭 이동 | dot 클릭 | 해당 단계로 즉시 이동 | [ ] |
| 12 | Step 클릭 pause | dot 클릭 후 5초 대기 | 5초 후 자동 재개 | [ ] |
| 13 | Hover pause | Preview 영역 hover | 자동 재생 정지 | [ ] |
| 14 | Mouseout resume | Preview 영역 mouseout | 2초 후 자동 재개 | [ ] |
| 15 | Timeout 우선순위 | step 클릭 → 즉시 mouseout | 5초 후 재개 (2초 아님) | [ ] |
| 16 | Mock data 확인 | AI 입력/결과/폼 데이터 | 카카오톡 메시지, 한국 운송 데이터 표시 | [ ] |

### 1-2. 반응형 검증

| # | 항목 | 뷰포트 | 검증 방법 | 통과 기준 | 결과 |
|---|------|--------|----------|----------|------|
| 17 | Desktop 전체 뷰 | >=1024px | Chrome 개발도구 | Chrome + AiPanel + Form 전체 + 5 dots | [ ] |
| 18 | Tablet 축약 뷰 | 768~1023px | Chrome 개발도구 | Chrome + 축약된 Form + 5 dots | [ ] |
| 19 | Mobile 카드 뷰 | <768px | Chrome 개발도구 | Chrome 없음, 2단계 카드 뷰, 2 dots | [ ] |
| 20 | Mobile 가독성 | <768px | 시각 확인 | 텍스트 14~16px, 읽을 수 있음 | [ ] |

### 1-3. 접근성 검증

| # | 항목 | 검증 방법 | 통과 기준 | 결과 |
|---|------|----------|----------|------|
| 21 | reduced-motion | OS 설정 변경 | 자동 재생 비활성화, COMPLETE 정적 표시 | [ ] |
| 22 | aria-label | DevTools 검사 | "AI 화물 등록 워크플로우 데모 미리보기" | [ ] |
| 23 | 키보드 탐색 | Tab + Arrow + Enter | StepIndicator 진입, 이동, 활성화 | [ ] |
| 24 | ARIA roles | DevTools 검사 | tablist + tab + aria-selected | [ ] |

### 1-4. 성능 검증

| # | 항목 | 검증 명령/도구 | 통과 기준 | 결과 |
|---|------|-------------|----------|------|
| 25 | JS 번들 크기 | `pnpm run build` → chunk 확인 | <30KB gzipped | [ ] |
| 26 | LCP 영향 | Lighthouse CI | +100ms 미만 | [ ] |
| 27 | 프레임율 | Chrome DevTools Performance | 60fps | [ ] |
| 28 | CSS 우선 애니메이션 | 코드 검토 | JS는 금액 카운팅에만 사용 | [ ] |
| 29 | 등장 지연 | 시각 확인 | heading/CTA 이후 0.6s delay | [ ] |

### 1-5. 빌드/테스트 검증

| # | 항목 | 검증 명령 | 통과 기준 | 결과 |
|---|------|---------|----------|------|
| 30 | TypeScript | `pnpm run typecheck` | 0 errors | [ ] |
| 31 | Lint | `pnpm run lint` | 0 warnings in new files | [ ] |
| 32 | 테스트 | `pnpm run test` | 전체 통과 | [ ] |
| 33 | 커버리지 | `pnpm run test -- --coverage` | dashboard-preview/ 80%+ | [ ] |
| 34 | 빌드 | `pnpm run build` | exit 0, static export 성공 | [ ] |

### 1-6. 크로스 브라우저

| # | 브라우저 | 검증 항목 | 결과 |
|---|---------|----------|------|
| 35 | Chrome (latest) | 5단계 루프 + 애니메이션 + 반응형 | [ ] |
| 36 | Firefox (latest) | 5단계 루프 + 애니메이션 + 반응형 | [ ] |
| 37 | Safari (latest) | 5단계 루프 + 애니메이션 + 반응형 (특히 CSS transform scale) | [ ] |

### 1-7. Hero 통합

| # | 항목 | 검증 방법 | 통과 기준 | 결과 |
|---|------|----------|----------|------|
| 38 | placeholder 교체 | hero.tsx diff | placeholder div → `<DashboardPreview />` | [ ] |
| 39 | 레이아웃 보존 | 전후 비교 | h1, p, CTA 위치/스타일 변경 없음 | [ ] |
| 40 | gradient-blob 유지 | 시각 확인 | 기존 배경 효과 유지 | [ ] |

---

## 2. Phase 2 릴리스 전 체크리스트

### 2-1. 인터랙티브 모드 기능

| # | 항목 | 검증 방법 | 통과 기준 | 결과 |
|---|------|----------|----------|------|
| 1 | 축소 뷰 내부 클릭 → interactive 모드 | 마우스 클릭 | 자동 재생 중단 + 오버레이 활성화 | [ ] |
| 2 | 10초 비활동 → cinematic 복귀 | 10초 대기 | 자동 재생 재개 | [ ] |
| 3 | 11개 히트 영역 hover → accent 아웃라인 | 각 영역 hover | 2px accent border 표시 | [ ] |
| 4 | Hover → 툴팁 표시 | 각 영역 hover | 읽을 수 있는 크기(14px) 툴팁 | [ ] |
| 5 | AiInputArea 클릭 → 타이핑 | 영역 클릭 | 카카오톡 메시지 타이핑 효과 (2초) | [ ] |
| 6 | ExtractButton 클릭 → 버튼 생성 | 영역 클릭 | 로딩 스피너 → 4 카테고리 버튼 등장 | [ ] |
| 7 | AI 결과 클릭 → 폼 채움 | 각 카테고리 클릭 | 버튼 green + 폼 필드 채움 | [ ] |
| 8 | TransportOption 클릭 → 토글 | 영역 클릭 | 옵션 활성/비활성 전환 | [ ] |
| 9 | EstimateInfoCard 클릭 → 카운팅 | 영역 클릭 | 금액 카운팅 애니메이션 | [ ] |
| 10 | 논리적 의존: 추출하기 미클릭 → AI 결과 반응 없음 | 순서 무시 클릭 | AI 결과 영역 클릭 시 무반응 | [ ] |
| 11 | 비순서 클릭 안전성 | 임의 순서 클릭 | 오류 없음, 각 컴포넌트 독립 반응 | [ ] |

### 2-2. 반응형 (Phase 2)

| # | 항목 | 뷰포트 | 검증 방법 | 통과 기준 | 결과 |
|---|------|--------|----------|----------|------|
| 12 | Desktop interactive | >=1024px | 전체 히트 영역 테스트 | 11개 영역 정상 동작 | [ ] |
| 13 | Tablet interactive | 768~1023px | 축약 히트 영역 테스트 | 축약된 영역 정상 동작 | [ ] |
| 14 | Mobile interactive 비활성화 | <768px | 축소 뷰 클릭 | 인터랙티브 모드 미진입 | [ ] |

### 2-3. 성능/빌드 (Phase 2)

| # | 항목 | 검증 명령/도구 | 통과 기준 | 결과 |
|---|------|-------------|----------|------|
| 15 | JS 번들 (Phase 1+2 합산) | `pnpm run build` | <30KB gzipped | [ ] |
| 16 | TypeScript | `pnpm run typecheck` | 0 errors | [ ] |
| 17 | Lint | `pnpm run lint` | 0 warnings | [ ] |
| 18 | 테스트 | `pnpm run test` | 전체 통과, 80%+ coverage | [ ] |
| 19 | 빌드 | `pnpm run build` | exit 0 | [ ] |

### 2-4. 크로스 브라우저 (Phase 2)

| # | 브라우저 | 검증 항목 | 결과 |
|---|---------|----------|------|
| 20 | Chrome (latest) | 인터랙티브 모드 전체 | [ ] |
| 21 | Firefox (latest) | 인터랙티브 모드 전체 | [ ] |
| 22 | Safari (latest) | 인터랙티브 모드 (특히 히트 영역 정밀도) | [ ] |