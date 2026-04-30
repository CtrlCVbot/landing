# Archive: F3 업무 매뉴얼형 스크롤 섹션 MVP

> **Key**: F3 | **Slug**: `f3-workflow-manual-section` | **IDEA**: IDEA-20260429-002
> **Category**: Standard | **RICE Score**: 81.6 | **Archived**: 2026-04-30
> **Code Location**: `src/lib/landing-workflow.ts`, `src/components/sections/workflow-manual.tsx`, `src/app/page.tsx`
> **Pipeline**: Idea -> Screening -> Draft -> PRD -> Wireframe -> Bridge -> Dev Feature -> Dev Run -> Dev Verify -> Archive
> **Epic**: EPIC-20260428-001

---

## 1. 요약

F3는 OPTIC 랜딩에 업무 매뉴얼형 스크롤 섹션을 추가한 작업이다. F2에서 정리한 제품 라인업과 카피 기준을 반복하지 않고, 방문자가 실제 운송 업무 흐름을 이해할 수 있도록 `AI 오더 등록 → 상하차지 관리 → 배차/운송 상태 → 화물맨 연동 → 정산 자동화 → 세금계산서 관리` 순서를 신규 section으로 연결했다.

핵심 결과는 다음과 같다.

- 신규 `WorkflowManual` section을 `Products` 이후, `Integrations` 이전에 배치했다.
- workflow data를 `src/lib/landing-workflow.ts`로 분리하고 stable id를 남겼다.
- 화주/주선사별 커스텀 가능성을 요청 양식, 배차 방식, 정산 기준, 전송 필드 조율 수준으로 표현했다.
- 실제 API 연동, 설정 저장, 자동 처리 완료처럼 과장될 수 있는 문구는 제외했다.
- 1440px, 768px, 375px browser check에서 section 순서와 overflow 0건을 확인했다.

---

## 2. 원본 파일 매니페스트

| 원본 경로 | 현재 위치 | 유형 |
|---|---|---|
| `.plans/ideas/20-approved/IDEA-20260429-002.md` | `sources/ideas/IDEA-20260429-002.md` | IDEA |
| `.plans/ideas/20-approved/SCREENING-20260429-002.md` | `sources/ideas/SCREENING-20260429-002.md` | Screening |
| `.plans/drafts/f3-workflow-manual-section/` | `sources/drafts/` | Draft / PRD Review / Routing |
| `.plans/prd/10-approved/f3-workflow-manual-section-prd.md` | `sources/prd/f3-workflow-manual-section-prd.md` | PRD |
| `.plans/wireframes/f3-workflow-manual-section/` | `sources/wireframes/` | Wireframe |
| `.plans/features/active/f3-workflow-manual-section/` | `sources/feature-package/` | Feature Package / Dev Notes / Verify Report |

---

## 3. 구현 요약

| 영역 | 파일 | 결과 |
|---|---|---|
| Workflow data | `src/lib/landing-workflow.ts` | 6단계 workflow, stable id, customization copy |
| Section UI | `src/components/sections/workflow-manual.tsx` | 신규 업무 매뉴얼형 section, semantic list, CTA focus |
| Page composition | `src/app/page.tsx` | `Products` 이후, `Integrations` 이전 배치 |
| Tests | `src/__tests__/lib/landing-workflow.test.ts`, `src/components/sections/__tests__/workflow-manual.test.tsx`, `src/__tests__/app/page.test.tsx` | data/order/render/page composition regression |

---

## 4. 완료 근거

| 항목 | 결과 | 근거 |
|---|:---:|---|
| `/dev-run` | PASS | `sources/feature-package/03-dev-notes/dev-output-summary.md` |
| `/dev-verify` | PASS with existing warnings | `sources/feature-package/03-dev-notes/dev-verify-report.md` |
| Typecheck | PASS | `pnpm typecheck` |
| Full tests | PASS with existing warnings | 55 files, 1118 tests |
| Lint | PASS with existing warnings | 기존 dashboard-preview warnings만 남음 |
| Build | PASS with existing warnings | Next.js static export 성공 |
| Copy scan | PASS | 필수 문구 존재, 금지/과장 문구 0건 |
| Browser QA | PASS | 1440px/768px/375px overflow 0건, CTA focus 확인 |
| Scope guard | PASS | DashboardPreview, mock-data, preview-steps, dependency 파일 변경 없음 |

---

## 5. 검증 요약

| 검증 | 결과 | 메모 |
|---|:---:|---|
| `pnpm typecheck` | PASS | TypeScript error 0 |
| `pnpm test` | PASS with WARN | 기존 React `act(...)` warning 출력 |
| `pnpm lint` | PASS with WARN | 기존 dashboard-preview lint warnings |
| `pnpm build` | PASS with WARN | static export 생성 |
| `git diff --check` | PASS | whitespace error 없음 |
| Browser check | PASS | `products < workflow-manual < integrations`, mobile/tablet overflow 0건 |

---

## 6. 남은 참고사항

| 항목 | 상태 | 후속 |
|---|---|---|
| dashboard-preview lint/test warnings | deferred | F3 범위 밖 cleanup task로 분리 |
| F4 업무 흐름 애니메이션과 상태 표현 | ready | F3의 `WORKFLOW_STEP_IDS`와 `WORKFLOW_STEPS`를 기반으로 진행 |
| F5 브랜드 자산, 메타데이터, 검증 정리 | pending | F1~F3 archive 기준을 참조 |

---

## 7. 다음 단계

1. F4 업무 흐름 애니메이션과 상태 표현 IDEA를 등록한다.
2. F4에서 F3 stable id를 기준으로 motion과 mock status를 추가한다.
3. F5에서 브랜드 자산, Open Graph, 최종 release readiness를 정리한다.
