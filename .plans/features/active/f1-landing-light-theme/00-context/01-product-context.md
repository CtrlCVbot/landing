# 01. Product Context — F1 라이트 모드 전환 인프라

> **Feature slug**: `f1-landing-light-theme`
> **IDEA**: [IDEA-20260423-002](../../../../ideas/00-inbox/IDEA-20260423-002.md) (상태 `approved`)
> **Draft**: [01-draft.md](../../../../drafts/f1-landing-light-theme/01-draft.md)
> **PRD**: [02-prd.md](../../../../drafts/f1-landing-light-theme/02-prd.md)
> **Epic**: [EPIC-20260422-001 — dash-preview Phase 4](../../../../epics/20-active/EPIC-20260422-001/00-epic-brief.md) (Phase A, F1)
> **Routing**: Standard / 시나리오 A / dev / hybrid false ([07-routing-metadata.md](../../../../drafts/f1-landing-light-theme/07-routing-metadata.md))
> **작성일**: 2026-04-23
> **작성자**: `plan-bridge-writer` (Phase A Step 7)

---

## 1. 목적 (Why)

landing 사이트 전역에 **라이트/다크 양 팔레트** + **사용자 전환 경로** (시스템 follow + 수동 토글) 를 도입하여 Phase 3 archive 직후 사용자 피드백 10 건 중 **이슈 [1]** (라이트/다크 모드 부재) 을 단일 Feature 로 해소한다.

현재 `src/app/globals.css` 의 `@theme inline` 블록은 다크 단일 팔레트 (19 개 CSS 변수) 로 하드코딩되어 있어 `prefers-color-scheme: light` 환경 사용자 · 주간 환경 · 밝은 디스플레이 컨텍스트를 수용하지 못하며, axe-core 라이트 모드 검증 경로 자체가 부재해 WCAG AA 확장 경로가 차단되어 있다.

본 Feature 의 4 축 작업:

1. **CSS 변수 토큰 이중화** — Tailwind 4 `@theme inline` 내부를 `var(--landing-*)` 로 간접화 + `:root` (라이트) + `[data-theme="dark"]` (다크) 2 세트 신규 정의
2. **ThemeProvider 주입** — `next-themes` v0.3+ 기반 ThemeProvider 를 `src/app/layout.tsx` 에 도입 + SSR hydration 3 중 방어
3. **landing 전역 컴포넌트 스윕** — hero · features · pricing · testimonials · footer · navbar 메인 섹션 + dash-preview 7 파일 + shared UI 의 다크 하드코딩 클래스 (`bg-white/5`·`text-white`·`from-gray-900/50` 등) 를 토큰 기반 클래스로 전수 치환
4. **전환 트리거 UI** — navbar 우상단에 `lucide-react` Sun/Moon 아이콘 기반 토글 버튼 (`ThemeToggle`) 배치

본 Feature 는 Epic §2 성공 지표 4 (landing 전역 라이트/다크 양 팔레트 + 전환 경로 + axe-core 0 violations) 를 **단독 충족** 하는 자식 Feature 로서, F5 (UI 잔재 정리) 와 **Phase A 에서 병렬 실행** 된다 (Epic 의존성 매트릭스 F1↔F5 `✓`). F1 을 Kill 하면 Epic Phase A 목표 (M-Epic-1, 2026-05-06) 달성 경로 자체가 소멸한다.

---

## 2. 성공 지표 (What)

> **Epic §2 성공 지표 4 직접 인용 (IMP-AGENT-011 준수)**:
> **지표 4 — 라이트/다크 양 팔레트 지원 + 전환 경로**: `prefers-color-scheme` 또는 토글 기준으로 라이트 모드 전환 시 **landing 사이트 전역** (hero · features · pricing · footer · navbar · dash-preview 포함) 모든 컴포넌트가 식별 가능한 대비 확보. axe-core 라이트 모드 0 violations.

본 F1 이 단독 충족하는 SMART 지표는 PRD §10 SM-1 ~ SM-10 을 승계한다 (SSOT: [02-prd.md §10](../../../../drafts/f1-landing-light-theme/02-prd.md#10-success-metrics)):

| ID | 지표 | 목표값 | 측정 방법 |
|---|------|--------|----------|
| **SM-1** | axe-core 라이트 모드 landing 전역 0 violations (= Epic §2 지표 4) | 0 violations | `@axe-core/react` + `jest-axe` — 6 섹션 + dash-preview 7 파일 × 5 뷰포트 라이트 모드 검증 |
| **SM-2** | FOUC 프레임 | 0 프레임 | Chrome DevTools Performance recording |
| **SM-3** | 번들 크기 증분 | ≤ 2 kB gzipped | `next build` 출력 비교 |
| **SM-4** | 다크 하드코딩 클래스 잔존 | 0 건 | `grep -rn "bg-white\|text-white\|from-gray\|to-gray\|border-gray\|bg-black\|bg-slate\|border-white\|ring-gray" src/` |
| **SM-5** | Hydration 경고 | 0 건 | dev 콘솔 (`pnpm dev --turbopack`) + production (`pnpm build && pnpm start`) |
| **SM-6** | 테마 전환 시각 지연 | ≤ 100 ms | Chrome DevTools Performance recording |
| **SM-7** | 6 개 PR 순차 merge | 6/6 | GitHub PR merge 상태 + 각 PR axe-core 0 violations |
| **SM-8** | Tailwind 4 정합 검증 | 통과 | PR-1 실험 컴포넌트 런타임 토글 동작 확인 |
| **SM-9** | WCAG AA 대비 비율 | ≥ 4.5:1 (text) / ≥ 3:1 (UI) | 토큰 매핑 결정표 + axe-core color-contrast |
| **SM-10** | 테스트 커버리지 | 60 스냅샷 + 6 jest-axe + 1 SSR 초기 렌더 | `pnpm test` |

세부 수용 기준 · 완료 조건 · Red-Green 검증 절차는 PRD 를 참조. 본 문서는 요약만 보존하며 값 변경 시 PRD 가 SSOT.

---

## 3. Epic 배경 — Phase 4 에서의 F1 위치

### 3-1. Epic 목적과 F1 의 기여

Epic EPIC-20260422-001 은 Phase 3 피드백 10 건을 5 Feature (F1 ~ F5) 로 그룹화해 **충실도·신뢰성·접근성** 을 Round 2 로 끌어올리는 것이 목표. F1 은 Epic 5 대 성공 지표 중 **지표 4 (라이트/다크 양 팔레트 + 전환 경로, axe-core 0 violations)** 를 **단독 충족** 하는 유일한 자식 Feature 다.

- **F1 Kill 시 영향**: Epic §2 지표 4 달성 경로 자체 소멸 → Phase A 목표 (M-Epic-1, 2026-05-06) 자동 실패 → Epic 전체 일정 재구성 필요.
- **Phase A 범위 확장 (2026-04-23)**: 원래 dash-preview 한정이던 F1 이 landing 사이트 전역으로 범위 확장됨 → Effort 10 인·일 (Epic Children §1 F1 Lane Standard) + 섹션별 PR 6 개 분할 필수.

### 3-2. Phase A 병렬 실행

F1 은 Phase A (2026-04-23 ~ 2026-05-06) 에서 F5 (UI 잔재 정리) 와 **완전 병렬** 실행된다. Epic Children `§2 의존성 매트릭스` 행 인용:

| 관계 | 타입 | 근거 |
|------|:---:|------|
| **F1 ↔ F5** | **✓** (완전 병렬) | F5 편집 파일 범위 (ai-panel/index.tsx, estimate-info-card.tsx 라벨 한 줄 등) 가 F1 landing 전역 토큰 스윕과 **수정 라인이 다른 라인** → 실질 병렬 가능. F1 내부 PR-6 (dash-preview 7 파일) 만 F5 merge 후 실행. |
| **F1 ↔ F2** | **△** (부분 충돌) | F1 이 `settlement-section` · `order-form/index` 등 dash-preview 토큰 치환 + F2 가 동일 파일의 mock 주입·Step 가시성 로직 재설계. **Phase A (F1) vs Phase B (F2) 시간 분리** 로 충돌 회피. |
| **F1 ↔ F3** | **△** (부분 충돌) | F1 의 `settlement-section` 토큰 치환 + F3 의 `OPTION_FEE_MAP` 연동 편집. **Phase A vs Phase C 시간 분리** 로 충돌 회피. |
| **F1 ↔ F4** | **△** (부분 충돌) | F1 의 `order-form/index` · `datetime-card` 토큰 치환 + F4 의 layout grid 재구성 · hit-area 재정렬. **Phase A vs Phase B 시간 분리** 로 충돌 회피. |

F1 ↔ F2/F3/F4 `△` 관계는 **PR-6 이 이미 merge 된 상태** 에서 Phase B/C 가 진입하므로 이미 토큰화된 기반 위에서 작업 가능 → 머지 충돌 확률 최소화 (Epic §6 리스크 1 완화).

### 3-3. Phase A 종료 조건 중 F1 담당 항목 (Epic Children §4)

Phase A 종료 조건 (M-Epic-1, 2026-05-06) 중 F1 이 담당하는 항목:

- [ ] **F1 구현 완료 + 테스트 통과 + 리뷰 승인** → F1 Feature 상태 `archived`
- [ ] **라이트 모드 MVP 작동** (토글 또는 `prefers-color-scheme` 자동 전환 중 **양쪽 모두 동작** — 결정 포인트 §4-2 확정)
- [ ] **axe-core 라이트 모드 0 violations** (**landing 전역** 기준, 지표 4 중간 평가)

F5 는 UI 잔재 정리 (별도 범위) 로 Phase A 완료에는 F1 + F5 양쪽 Feature archived 필요. **본 Feature 는 Phase A 의 핵심 경로** — F5 단독 완료 (F1 Kill/Hold) 는 Phase A 를 F5 단독 (Effort 2 인·일) 으로 축소시켜 Phase 경제성 대폭 악화 + Epic 전체 일정 재구성 필요.

---

## 4. 다음 단계

- **Step 8**: `/plan-epic advance EPIC-20260422-001 --to=active` (메인 세션)
- **Step 9**: `/dev-feature .plans/features/active/f1-landing-light-theme/` → `/dev-run` (F5 와 병렬, TeamCreate `dash-preview-phase4-phase-a`)
- 예상 TASK: `T-THEME-01 ~ T-THEME-08` (6~8 건, 상세는 `04-implementation-hints.md`)
- 예상 총 소요: 약 10 인·일 (PR-1 3 일 + PR-2~5 병렬 6 일 + PR-6 1 일, PRD §8 Milestones 정합)
