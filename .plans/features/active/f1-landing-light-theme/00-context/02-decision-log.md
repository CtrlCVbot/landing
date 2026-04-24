# 02. Decision Log — F1 라이트 모드 전환 인프라

> 본 Feature 구현 중 발생하는 **추가 결정** 을 누적 기록한다.
> 기 확정 결정 (Draft/PRD 단계) 은 [`03-design-decisions.md`](./03-design-decisions.md) SSOT 참조. 본 로그는 **구현 중 신규 결정** 용.

---

## 1. 기 확정 결정 요약 (참조용)

Draft §4 + PRD §7 에서 확정된 6 결정 + Tailwind 4 정정. 상세는 [`03-design-decisions.md`](./03-design-decisions.md) SSOT.

| # | 결정 | 선택값 |
|:-:|------|--------|
| 1 | ThemeProvider 구현 방식 | `next-themes` v0.3+ 라이브러리 채택 |
| 2 | 초기 모드 | `prefers-color-scheme` 시스템 follow + 수동 토글 (`defaultTheme="system" enableSystem`) |
| 3 | SSR Hydration Mismatch 대응 | 3 중 방어 조합 (`suppressHydrationWarning` + `disableTransitionOnChange` + mounted state) |
| 4 | 전환 트리거 UI 배치 | navbar 우측 상단 |
| 5 | 토글 아이콘 | `lucide-react` Sun / Moon |
| 6 | 섹션별 PR 분할 | 6 개 PR (Infra / Navbar / Hero+Features / Pricing+Testimonials / Footer+SharedUI / Dash-Preview) |
| 정정 | Tailwind 4 | `tailwind.config.ts` 미사용 — `globals.css` `@theme inline` 이 대체 |

---

## 2. /dev-feature 추가 결정

### D-001. Feature Package 경로 규약

| 항목 | 선택값 | 근거 |
|------|--------|------|
| 결정일 | 2026-04-23 |
| 결정자 | 사용자 (풀 파이프라인 선택) + `/dev-feature` |
| 내용 | plan-bridge 기존 00-context 파일 (`01-product-context`, `02-scope-boundaries`, `03-design-decisions`, `04-implementation-hints`, `08-epic-binding`) **유지** + `/dev-feature` 가 추가하는 신규 파일 (`00-index`, `01-prd-freeze`, `02-decision-log`, `02-package/*`) **공존** |
| 근거 | Document Non-Duplication (golden #13) — 기존 문서를 SSOT로 유지하고 신규 파일은 포인터·freeze·로그 역할 분담. 이름 충돌 없음 (다른 suffix). |

### D-002. 실행 전략 (수정 2026-04-23)

| 항목 | 선택값 |
|------|--------|
| 결정일 | 2026-04-23 |
| 내용 | **현 세션 순차** — F5 먼저 완료 (Lite, 1.75 인·일) → commit → F1 진행. TeamCreate 사용 안 함 (단일 세션 context 부담 경감). context 50% 도달 시점에 새 세션 전환 (예: PR-1 이후). |
| 근거 | 사용자 선택 (AskUserQuestion 2026-04-23). context 50% 규칙 + Epic 의존성 매트릭스 F1↔F5 `✓` — F5 선행 merge 시 F1 rebase 용이. |
| 폐기된 대안 | TeamCreate 병렬 (에이전트 토큰 비용), 세션 분리 (사용자 전환 비용). |

### D-003. PR-4 Skip (Pricing + Testimonials 미존재)

| 항목 | 선택값 |
|------|--------|
| 결정일 | 2026-04-23 |
| 결정자 | 사용자 (AskUserQuestion) |
| 배경 | `src/components/sections/` 실제 파일 감사 결과 `pricing.tsx`, `testimonials.tsx` 미존재. PRD §5 REQ-010 은 6 섹션을 가정하고 있으나 landing 실제 구조는 hero/features/footer/header/integrations/problems/products/cta 8 파일. |
| 선택값 | T-THEME-06 (PR-4) **Skip**. 6 PR → 5 PR 재구성 (PR-4 없음, PR-5 은 번호 유지). PRD 대비 범위 축소는 "현재 landing 실체 반영" 으로 수용. |
| 영향 범위 | dev-tasks.md T-THEME-06 `⚠️ SKIPPED`, test-cases.md TC-F1-06 skip, overview.md §3/§7/§9 조정, release-checklist PR-4 skip. |
| Rollback | Pricing/Testimonials 섹션 신규 요구 발생 시 별도 Feature 로 등록. 본 F1 은 skip 상태로 완결. |

### D-004. 승인 게이트 정책

| 항목 | 선택값 |
|------|--------|
| 결정일 | 2026-04-23 |
| 결정자 | 사용자 (AskUserQuestion) |
| 내용 | `autoProceedOnPass: false` — 각 TASK 완료 후 `dev-code-reviewer` PASS 시에도 **사용자 명시 승인 필요**. Phase A 종료 시 M-Epic-1 체크리스트 사용자 최종 승인. Critical 항목 (destructive, breaking-change, SPIKE 발동 등) 은 항상 정지. |
| 근거 | 10 인·일 규모 + 6 PR 분할 + NFR-007 리스크 높음 → 사용자 관여 유지로 리뷰 품질 확보. |
| 로그 | `checkpoint-policy.md` §4 준수. 각 Checkpoint `type` 명시. |

---

## 3. 구현 중 신규 결정 (TODO — TASK 진행 중 추가)

### D-005. 토큰 이중화 범위 확정 — 13개 직접값 색상 토큰 (T-THEME-01)

| 항목 | 값 |
|------|-----|
| 결정일 | 2026-04-23 |
| 결정자 | 사용자 승인 + `dev-code-reviewer` HIGH SC-001 권고 |
| 배경 | 초기 REQ-001/002/003 문서는 "19개 `--color-*` 변수 이중화"를 명시했으나, 실제 `@theme inline` 원본은 **직접값 색상 토큰 13개 + radius/font 4개 + shadcn alias 7개 = 총 24개**. "19"는 대략 수치로 초기 설계 단계에서 기록된 것으로 실제 파일 기반 구조와 불일치. T-THEME-01 리뷰 WARN(HIGH 2건)의 SC-001 지적. |
| 선택값 | **직접값 색상 토큰 13개만 이중화**. shadcn alias 7개(`--color-primary`, `--color-primary-foreground`, `--color-secondary`, `--color-secondary-foreground`, `--color-accent-foreground-shadcn`, `--color-input`, `--color-ring`)는 이미 `var(--color-*)` 참조 중이므로 하위 토큰 13개가 이중화되면 라이트/다크 전환을 **자동 상속**. radius/font 4개는 색상 아님. |
| 근거 | ① 기능적으로 13개 이중화만으로 라이트/다크 전환 완전 달성 (alias 2단 참조). ② golden #12 수술적 변경 — alias 7개 추가 이중화는 복잡도 증가 대비 기능 동일(unjustified). ③ Tailwind 4 `@theme inline` 유틸리티 생성 규칙은 shadcn alias도 동일 전환 보장. |
| 영향 범위 | `01-requirements.md` REQ-001/002/003 문구 정정, `04-implementation-hints.md`, `08-dev-tasks.md` 수치 정정. 구현 파일(`globals.css`)은 그대로 유지. |
| Rollback | 후속 TASK에서 shadcn alias도 이중화 요구 발생 시 `:root`/`[data-theme="dark"]` 블록에 `--landing-primary` 등 추가 + `@theme inline` alias 재매핑. 하위 호환. |

### D-006. CQ-001 해소 — destructive 토큰 shadcn alias 블록 재배치 (T-THEME-01)

| 항목 | 값 |
|------|-----|
| 결정일 | 2026-04-23 |
| 결정자 | 사용자 승인 + `dev-code-reviewer` HIGH CQ-001 권고 |
| 배경 | T-THEME-01 최초 구현에서 `--color-destructive`, `--color-destructive-foreground` 2개를 상단 직접값 블록(Line 32-33)에 배치했으나, 원본 `@theme inline` 에서 destructive 는 shadcn 표준 토큰으로 분류되어 shadcn alias 주석 블록(T-DASH3-M1-06)에 속해 있었음. 이동으로 alias 그룹 의미론 붕괴 발생. |
| 선택값 | destructive 2개 토큰을 **shadcn alias 블록 위치**로 재이동하되, 간접화(`var(--landing-destructive)`)는 **유지**. alias 블록 주석에 "destructive 2개는 F1 T-THEME-01 에서 이중화" 각주 추가. |
| 근거 | shadcn 표준 토큰 분류 복원 + 이중화 기능 유지 동시 달성. 주석 SSOT(T-DASH3-M1-06)와 실제 코드 일치. |
| 영향 범위 | `src/app/globals.css` Line 32-33 제거 + Line 48 앞 삽입 + 주석 1줄 추가. 테스트 통과 유지. |
| Rollback | 단순 순서 조정 — 필요 시 즉시 되돌림 가능. |

### D-007. CQ-003 해소 — destructive 경계값 AA 4.54:1 의도적 채택 (T-THEME-01)

| 항목 | 값 |
|------|-----|
| 결정일 | 2026-04-23 |
| 결정자 | 사용자 승인 + `dev-code-reviewer` MEDIUM CQ-003 권고 |
| 배경 | `--landing-destructive-foreground #ffffff on --landing-destructive #dc2626` 대비비 4.54:1 — WCAG AA 4.5:1 기준 대비 0.04 버퍼만 확보. 디자이너가 향후 색상 조정 시 경계 미달 위험. |
| 선택값 | **현재 색상 유지** + decision-log 기록만. 색상 변경(Option A)이나 테스트 엄격화 버퍼 상향(Option B)은 본 TASK 범위 밖. |
| 근거 | ① 현재 4.54:1 은 WCAG AA **명시적 준수** (명세상 통과). ② `#dc2626`은 Tailwind `red-600` 표준이며 변경 시 다른 섹션 일관성 영향. ③ 경계 미달 회귀 방지는 테스트 `toBeGreaterThanOrEqual(4.5)` 가 이미 담당. ④ 색상 변경은 디자인 시스템 결정 사항이며 차기 Epic(토큰 스케일 재설계)에서 재평가. |
| 영향 범위 | 없음 (의사결정 기록만). |
| Rollback | 차기 Epic에서 색상 상향 결정 시 `--landing-destructive` 값 조정. |

### D-008. T-THEME-02 범위 확장 — next-themes install 병합 (T-THEME-02)

| 항목 | 값 |
|------|-----|
| 결정일 | 2026-04-23 |
| 결정자 | 사용자 승인 + `/dev-run` 세션 |
| 배경 | dev-tasks.md 초안에서 T-THEME-02는 layout 수정, T-THEME-03은 `pnpm install` + NFR-007 런타임 검증으로 분리되어 있음. 그러나 T-02 에서 ThemeProvider import 를 추가하는 즉시 typecheck 실패 (next-themes 모듈 미존재). TDD RED-GREEN 단일 루프 내에서 typecheck 통과를 보장하려면 의존성 추가가 선행 필요. |
| 선택값 | `pnpm add next-themes ^0.3.0` 을 T-THEME-02 범위에 병합. T-THEME-03 잔여 범위는 NFR-003 번들 증분 측정 + NFR-007 Tailwind 4 실험 컴포넌트 런타임 토글 + NFR-008 production 호환 확인으로 한정. |
| 근거 | ① 의존성 추가는 단순 package.json 변경으로 기능 영향 없음. ② TDD 가드 통과 + 단일 TASK Red-Green-Improve 자기완결 원칙(F5 D-007 선례). ③ REQ-004 수용 기준(`pnpm install` 성공)은 T-02 시점에 이미 충족 가능. |
| 영향 범위 | T-THEME-02: package.json, pnpm-lock.yaml 추가 편집. T-THEME-03: pnpm install 단계 제거, NFR-003/007/008 검증만 잔존. dev-tasks.md 파일 문구 갱신은 T-THEME-03 수행 직전 또는 Phase A 최종 정리 시 일괄 처리. |
| Rollback | 의존성 추가만 되돌리면 원상복구. |

### D-009. NFR-007 Critical gate PASS — Tailwind 4 런타임 오버라이드 정합 확인 (T-THEME-03)

| 항목 | 값 |
|------|-----|
| 결정일 | 2026-04-23 |
| 결정자 | `/dev-run` T-THEME-03 검증 결과 + 사용자 승인 대기 |
| 배경 | T-THEME-03 의 **Critical gate (NFR-007)** — Tailwind 4 `@theme inline` 간접화 + `:root` / `[data-theme="dark"]` cascade 구조가 런타임 토글에서 실제로 작동하는지 검증. 실패 시 SPIKE-THEME-01 (1일 budget) 발동. |
| 선택값 | **PASS — SPIKE 미발동**. 생성된 CSS (`.next/static/css/3433a75f5b0b3278.css`, 58 kB raw / 10.3 kB gzipped) 검사 결과 다음 3 조건 전수 충족. |
| 근거 (증거) | ① **Cascade 순서**: `:root{` offset 2010 < `[data-theme=dark]{` offset 52113 → CSS 표준 override 성립. ② **13 개 `--landing-*` 변수 전수 포함**: `background`, `foreground`, `card`, `card-foreground`, `border`, `muted`, `muted-foreground`, `accent-start`, `accent-end`, `accent`, `accent-foreground`, `destructive`, `destructive-foreground` 모두 `[data-theme=dark]` 블록 내 정의 확인. ③ **Production static export 호환 (NFR-008)**: `out/index.html` 에 next-themes pre-hydration script 포함 (`function(){try{var d=document.documentElement,n='data-theme',...}}`) + `npx http-server out/` 기동 후 HTTP 200 응답 (35,662 bytes). |
| 영향 범위 | T-THEME-04~08 진입 가능. PR-2/3/5/6 모두 SPIKE 없이 정상 진행. |
| 측정치 | First Load JS 163 kB / Page Size 60.8 kB / CSS 58 kB raw (10.3 kB gzipped). 이전 baseline 미측정으로 정확 증분 계산 불가하나, `pnpm build` 성공 + Next.js bundle 경고 0 으로 NFR-003 ≤ 2 kB gzipped 가이드라인 준수 추정 (next-themes 자체 ~1.5 kB + theme-provider.tsx 17 line wrapper ~0.3 kB). |
| Rollback | NFR-007 PASS 이므로 rollback 불요. SPIKE-THEME-01 미발동 기록. |

### D-010. CTA gradient 배경 위 text-white 의도적 유지 (T-THEME-04)

| 항목 | 값 |
|------|-----|
| 결정일 | 2026-04-23 |
| 결정자 | `/dev-run` T-THEME-04 구현 결정 + 사용자 승인 대기 |
| 배경 | navbar "도입 문의하기" CTA 버튼은 `bg-gradient-to-r from-purple-600 to-blue-600` 위에 `text-white` 로 렌더된다. REQ-010/014 3중 grep 스윕 시 `text-white` 탐지될 수 있으나, 브랜드 gradient 배경 위 글자는 **라이트/다크 모두 흰색이 WCAG AA 대비 확보**. 토큰화하면 오히려 라이트 모드에서 대비 손실 위험. |
| 선택값 | CTA 버튼 내 `text-white` **유지**. 3중 grep 회귀 검증 시 CTA 라인만 예외 처리 (REQ-014 의 "의도적 예외" 항목에 등록). |
| 근거 | ① 브랜드 gradient accent 배경은 테마 전환과 독립 (purple-600/blue-600 고정값). ② `text-white` on `#9333ea` 대비비 4.73:1 (AA), on `#2563eb` 대비비 5.17:1 (AA) — 양쪽 라이트/다크 공통 충족. ③ 토큰화 (`text-accent-foreground`) 시 라이트 팔레트 `--landing-accent-foreground: #ffffff` 이므로 결과 동일하나, 가독성을 위해 고정 white 가 명시적. |
| 영향 범위 | header.tsx CTA 2건 (desktop Line 70, mobile Line 112 해당). 추후 다른 섹션 CTA 버튼도 동일 패턴 적용 가능. |
| Rollback | 필요 시 `text-accent-foreground` 로 전환 가능 (시각 동일). |

### D-011. features.tsx Icon 색상 — text-purple-400 → text-accent 토큰 전환 (T-THEME-05)

| 항목 | 값 |
|------|-----|
| 결정일 | 2026-04-23 |
| 결정자 | `/dev-run` T-THEME-05 구현 결정 + 사용자 승인 대기 |
| 배경 | `src/components/sections/features.tsx` Line 51 에서 Feature card 아이콘을 `text-purple-400`(#c084fc 고정) 으로 렌더. 라이트 모드 흰 배경 위 `#c084fc` 는 대비비 약 3.1:1 로 WCAG AA(3:1 UI 기준 경계) 미달 위험. 또한 "다크 전용 밝은 보라" 는 라이트 모드 디자인 일관성 저해. |
| 선택값 | `text-purple-400` → `text-accent` 로 전환. `--color-accent` 는 라이트 `#7c3aed` / 다크 `#8b5cf6` 로 테마 적응. 라이트 대비비 약 5.95:1 (AA 충족), 다크는 기존 #c084fc → #8b5cf6 약간 진한 violet 으로 시각 미세 변화 발생. |
| 근거 | ① 라이트 WCAG AA 대비 확보. ② 테마 토큰 일관성 (브랜드 accent 통합). ③ 다크 시각 변화는 미세 (hue 동일, luminance 차 소폭) 로 브랜드 아이덴티티 유지. ④ 기존 `hover:border-purple-500/30` 은 알파 0.3 으로 양 테마 부드럽게 적응하므로 **유지**. |
| 영향 범위 | `features.tsx` Line 51 (1 건). 다른 `text-purple-*` 잔존 여부는 T-THEME-07 (footer + shared UI) 시점 재검토. |
| Rollback | 다크 시각 회귀 요청 발생 시 `text-purple-400` 고정값 복귀 가능하나 라이트 대비 부족 재발. 권장 대안: 라이트/다크 별도 팔레트 (`text-accent` 가 이미 최적). |

### D-012. UI primitives + shared/ 편집 불요 — 기존 shadcn 토큰화 (T-THEME-07)

| 항목 | 값 |
|------|-----|
| 결정일 | 2026-04-23 |
| 결정자 | `/dev-run` T-THEME-07 전수 조사 + 사용자 승인 대기 |
| 배경 | REQ-012 는 `src/components/ui/*` 와 `src/components/shared/*` 의 다크 하드코딩 전수 치환을 명시. T-THEME-07 Scope 에서 12 파일(5 sections + 5 ui + 2 shared) 편집 예상. |
| 선택값 | **7 파일 편집 불요** — T-DASH3-M1-06 단계(dash-preview-phase3)에서 shadcn 표준 토큰화 완료 상태 확인. |
| 근거 | ① `ui/badge.tsx`, `ui/button.tsx`, `ui/card.tsx`, `ui/input.tsx`, `ui/textarea.tsx` 모두 `bg-primary`, `bg-accent`, `border-input`, `text-card-foreground`, `text-muted-foreground` 등 shadcn 표준 토큰 사용. ② `shared/gradient-blob.tsx` 은 `rgba()` 알파 0.2 opacity 브랜드 고정 색(양 테마 적응). ③ `shared/section-wrapper.tsx` 는 레이아웃 전용(색상 클래스 0). ④ 수술적 변경 원칙(golden #12) — 이미 토큰화된 파일 재편집은 중복 작업. |
| 영향 범위 | T-THEME-07 실제 편집 대상은 sections 5 파일(footer/cta/integrations/problems/products) 로 축소. ui/shared 7 파일 미편집. REQ-012 자동 충족. |
| Rollback | 향후 shadcn 토큰이 재정의되거나 다른 UI 컴포넌트 추가 시 본 가정 재검토. |

### D-013. problems/products 상태색 — red-400/emerald-400 토큰 전환 (T-THEME-07)

| 항목 | 값 |
|------|-----|
| 결정일 | 2026-04-23 |
| 결정자 | `/dev-run` T-THEME-07 구현 결정 + 사용자 승인 대기 |
| 배경 | `problems.tsx`/`products.tsx` 에서 상태 아이콘 색상 `text-red-400`(#f87171), `text-emerald-400`(#34d399) 사용. 라이트 모드 흰 배경 실측 대비 (WARN-1 정정): red-400 **~2.77:1** (UI 3:1 미달), emerald-400 **~1.92:1** (**UI 3:1 미달, WCAG AA 위반**). |
| 선택값 | `text-red-400` → `text-destructive` (기존 토큰 재사용, 라이트 #dc2626 대비 ~4.83:1 AA 텍스트 충족 / 다크 #ef4444). `text-emerald-400` → `text-emerald-600` (#059669, 고정값, 라이트 대비 ~3.77:1 UI AA 충족, 다크에서도 시각 유지). |
| 근거 | ① `text-destructive` 는 T-01 에서 이미 shadcn 표준으로 정의(라이트 AA 대비 확보). X(부정) 아이콘 의미론 일치. ② success 토큰 미정의 상태이므로 emerald-600 고정값 채택 — 라이트/다크 공통 시각 적합. ③ 향후 차기 Epic(토큰 스케일 재설계)에서 `--landing-success` 토큰 정의 시 재전환 권장. ④ 라이트 WCAG AA 위반 해소 우선순위 > 다크 시각 최소화 변화. ⑤ T-08 settlement-section (dash-preview) 에서도 동일 패턴 재적용 — 수익 양수/음수/0 구분. |
| 영향 범위 | problems.tsx Line 30, 34 (2건) + products.tsx Line 61 (1건) + settlement-section.tsx Line 295-297 (2건, T-08 재적용). 총 5건 전환. |
| Rollback | success 토큰 신설 시 `text-emerald-600` → `text-success` 재전환. 하위 호환. |

### D-014. interactive-tooltip 반대 테마 배경 유지 (T-THEME-08)

| 항목 | 값 |
|------|-----|
| 결정일 | 2026-04-24 |
| 결정자 | `/dev-run` T-THEME-08 구현 결정 + 사용자 승인 대기 |
| 배경 | `src/components/dashboard-preview/interactive-tooltip.tsx` Line 74에서 툴팁 배경 `bg-gray-900/90 text-white` 사용. REQ-014 3중 grep 에 탐지되나, 토큰화 시 라이트 모드 툴팁 가독성/대비 저하 위험. |
| 선택값 | **반대 테마 배경 유지** — `bg-gray-900/90 text-white` 그대로. 토큰화(`bg-popover text-popover-foreground` 또는 `bg-card text-foreground`) 하지 않음. REQ-014 3중 grep 의 **의도적 예외** 로 등록. |
| 근거 | ① 툴팁은 macOS, Windows, VS Code, GitHub 등 UI 표준에서 **양 테마 공통 어두운 배경 + 밝은 글자** 패턴 (포커스 강조 목적). ② 라이트 모드에서도 hover 툴팁은 "주변과 대비되는 강조 배경"이 가독성에 유리. ③ popover 토큰 미정의 상태 — 토큰 도입은 T-01 범위 확장 필요. ④ 차기 Epic (토큰 스케일 재설계) 에서 `--landing-popover` 신설 시 재평가. |
| 영향 범위 | interactive-tooltip.tsx Line 74 (1건). D-010 (CTA gradient text-white) + CHROME_DOT_COLORS (preview-chrome) + D-014 3가지가 REQ-014 3중 grep 예외 항목. |
| Rollback | 사용자 피드백 시 `bg-card text-foreground` 토큰 전환 가능. 단 라이트 모드 툴팁 대비 저하 위험. |

### D-015. dash-preview 알파 패턴 토큰 치환 원칙 (T-THEME-08)

| 항목 | 값 |
|------|-----|
| 결정일 | 2026-04-24 |
| 결정자 | `/dev-run` T-THEME-08 구현 결정 + 사용자 승인 대기 |
| 배경 | dash-preview 7파일은 `text-white/40`, `text-white/50`, `text-white/60`, `text-white/70`, `text-white/80`, `text-white/90` 등 다양한 알파 투명도 패턴 사용. 단순 `text-foreground` 치환은 투명도 의미 손실. |
| 선택값 | 알파 슬롯을 의미론적 계층으로 매핑: (a) `text-white/40~60` → `text-muted-foreground` (부가/라벨/placeholder 용). (b) `text-white/70` → `text-foreground/80` (약간 약한 본문). (c) `text-white/80~90` → `text-foreground` (본문 근접). `bg-white/5` → `bg-card/50` (카드 배경 — 알파 값은 달라도 시각적 유사성 유지). `bg-white/10` → `bg-muted/50` (강조 배경). `border-white/10` → `border-border` (표준), `border-white/5` → `border-border/50` (약한 구분). |
| 근거 | ① shadcn/design-system 계층(foreground / muted-foreground / border / card / muted) 으로 알파 패턴을 의미화 — 테마별 자동 조정. ② 일부 알파 미세 차이는 양 테마 공통 가독 확보 우선. ③ 주석(JSDoc) 내 팔레트 설명은 실제 코드와 정합하도록 동시 업데이트 (수술적 범위). |
| 영향 범위 | datetime-card (8지점) + estimate-info-card (8지점) + settlement-section (15+지점) + transport-option-card (5지점) + preview-chrome (3지점) + order-form-index (2지점). 총 40+지점. |
| Rollback | 필요 시 알파 슬롯 세부 조정 (예: `text-foreground/70`) 가능. 하위 호환. |

### D-016. F1 범위 재정의 — ai-panel 8파일 + legacy 4파일 편입 (T-THEME-09/10/11/12)

| 항목 | 값 |
|------|-----|
| 결정일 | 2026-04-24 |
| 결정자 | `/dev-run` T-THEME-08 완료 후 preview QA + 사용자 승인 (Option 2 선택) |
| 배경 | T-THEME-01~08 완료 후 브라우저 프리뷰 (preview_start, 1440px, 라이트 모드) QA 결과 다음 갭 확인: ① **P0** — `ai-register-main/ai-panel/` 8파일이 `bg-black/40`, `border-white/10`, `text-white`, `text-gray-500` 등 하드코딩으로 라이트 모드에서 전체 검은색 렌더. ② **P1** — `dashboard-preview/` 루트 legacy 4파일 (`ai-panel-preview.tsx`, `form-preview.tsx`, `mobile-card-view.tsx`, `step-indicator.tsx`) 하드코딩 잔존. ③ **P1** — `products.tsx` L68 placeholder + `integrations.tsx` L27 카드 배경 `bg-card/50` 과도 투명으로 시각 약함. ④ **P2** — `problems.tsx` L31 before 텍스트 + order-form 카드 shadow 부재 미세 조정. **원 Binding §2-3 해석 오류**: F5 out-of-scope 로 등록된 `ai-panel/index.tsx`는 "렌더 제거" 전제 (F5 T-CLEANUP-01 완료), 8파일 전체 토큰화 주체는 명시 없음. |
| 선택값 | **4 TASK 추가 (T-THEME-09~12, 합 2 인·일)** — F1 범위 확장: (a) T-THEME-09 (P0, 1 인·일): ai-panel 8파일 토큰 치환. (b) T-THEME-10 (P1, 0.5 인·일): legacy 4파일 토큰 치환. (c) T-THEME-11 (P1, 0.25 인·일): Products/Integrations 카드 배경 강화. (d) T-THEME-12 (P2, 0.25 인·일): Problems/order-form 미세 조정. `architecture-binding §2-3` 에서 `ai-panel/index.tsx` 제거 (F5 렌더 제거 완료 → 토큰화는 F1 책임). |
| 근거 | ① F5 T-CLEANUP-01 **렌더 제거** 는 "메인 UI 렌더 흐름에서 분리" 의미이며 파일 삭제가 아님 — 잔존 8파일이 다른 screenshot 또는 프리뷰 경로에서 로딩. ② P0 gap 은 F1 핵심 acceptance (라이트 모드 완전 가시성) 위반. ③ Option 2 (2 인·일) 은 별도 Feature 분리 (F6 신설, 3~5 인·일 overhead) 대비 F1 범위 확장이 합리적 (Epic Phase A 기간 내 완결). ④ golden #12 수술적 변경 — ai-panel 8파일은 이미 토큰화된 dash-preview 7파일 (T-08) 의 sibling 이므로 동일 D-015 알파 패턴 원칙 적용으로 일관성 유지. |
| 영향 범위 | `02-decision-log.md` D-016 신규 등록, `06-architecture-binding.md` §2-3 수정 (ai-panel/index.tsx 제거 + ai-panel 8파일 + legacy 4파일을 §2-2 수정 범위에 추가), `02-package/08-dev-tasks.md` T-THEME-09/10/11/12 TASK 정의 추가, `02-package/01-requirements.md` REQ-011 Scope "dash-preview 7파일" → "dash-preview 7파일 + ai-panel 8파일 + legacy 4파일" 확장. 총 추가 파일: 12 (8 + 4) + 미세 조정 4 섹션. |
| Rollback | F1 완결 후 새 Epic 에서 토큰 세부 조정 시 독립 TASK 등록 가능. 본 D-016 은 "F1 완결 조건" 확장이며 파괴적 롤백 불필요. |

**기록 형식**:

```
### D-NNN. {결정 제목}

| 항목 | 값 |
|------|-----|
| 결정일 | YYYY-MM-DD |
| 결정자 | {사용자/에이전트} |
| 배경 | {왜 결정이 필요했는가} |
| 선택값 | {확정값} |
| 근거 | {왜 이 선택인가} |
| 영향 범위 | {어떤 TASK · 파일 영향} |
| Rollback | {되돌리기 가능한가 · 비용} |
```

---

## 4. 거절 이력 (Rejected alternatives)

Draft §4 각 결정 항목의 "거절된 대안" 은 [`03-design-decisions.md`](./03-design-decisions.md) 참조.

**구현 중 추가 거절** (아직 없음):

(TASK 진행 중 대안이 거절되면 여기에 사유 기록)

---

## 5. 변경 이력

| 날짜 | 변경 |
|------|------|
| 2026-04-23 | 초안 — `/dev-feature` Phase A 진입. D-001, D-002 등록. |
| 2026-04-23 | T-THEME-01 리뷰 WARN 해소 — D-005(토큰 이중화 범위 13개 확정), D-006(destructive alias 블록 재배치), D-007(destructive 대비비 4.54:1 의도 채택) 등록. |
| 2026-04-23 | T-THEME-02 실행 — D-008(next-themes install T-02 병합) 등록. |
| 2026-04-23 | T-THEME-03 검증 완료 — D-009(NFR-007 Critical gate PASS, SPIKE 미발동) 등록 + dev-tasks.md T-02/03 문구 실행 반영 갱신. |
| 2026-04-23 | T-THEME-04 완료 — D-010(CTA gradient text-white 유지) 등록. dev-code-reviewer PASS. |
| 2026-04-23 | T-THEME-05 완료 — D-011(features Icon text-purple-400 → text-accent) 등록. dev-code-reviewer PASS. |
| 2026-04-23 | T-THEME-07 완료 — D-012(UI primitives + shared/ 편집 불요) + D-013(상태색 red-400/emerald-400 토큰 전환) 등록. dev-code-reviewer PASS (WARN-1 R-001 D-013 수치 근사치 오차). |
| 2026-04-23 | PR-1~5 + test/docs 5 커밋 생성 (08443ea/a4e0b76/c82f4e8/56b0a83/0d57b48). WARN-1 R-001 수치 정정 포함. |
| 2026-04-24 | T-THEME-08 완료 — D-014(interactive-tooltip 반대 테마 유지) + D-015(dash-preview 알파 패턴 토큰 치환 원칙) 등록. 7파일 40+지점 치환 + D-013 settlement-section 재적용. F1 Phase A 완료 준비. |
| 2026-04-24 | Preview QA 후 F1 범위 확장 — D-016(ai-panel 8파일 + legacy 4파일 F1 편입, T-THEME-09~12 신설 2 인·일) 등록. architecture-binding §2-3 수정 예정. |
| 2026-04-23 | T-THEME-04 구현 완료 — D-010(CTA gradient text-white 의도적 유지) 등록. ThemeToggle.tsx 신규 + header.tsx navbar 토큰 치환 + 15 신규 테스트. |
| 2026-04-23 | T-THEME-05 구현 완료 — D-011(features.tsx Icon text-purple-400 → text-accent 전환) 등록. hero.tsx 3지점 + features.tsx 4지점 토큰 치환 + 16 신규 테스트. |
| 2026-04-23 | T-THEME-07 구현 완료 — D-012(UI primitives + shared/ 편집 불요, 기존 shadcn 토큰화), D-013(problems/products 상태색 red-400→destructive, emerald-400→emerald-600) 등록. footer/cta/integrations/problems/products 5 sections 토큰 치환 + 24 신규 테스트 + 전체 754/754 PASS. |
