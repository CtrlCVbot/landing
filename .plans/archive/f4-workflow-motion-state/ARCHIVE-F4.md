# Archive: F4 업무 흐름 애니메이션과 상태 표현

> **Key**: F4 | **Slug**: `f4-workflow-motion-state` | **IDEA**: IDEA-20260430-001
> **Category**: Standard | **RICE Score**: 74.4 | **Archived**: 2026-04-30
> **Code Location**: `src/lib/landing-workflow.ts`, `src/lib/motion.ts`, `src/components/sections/workflow-manual.tsx`
> **Pipeline**: Idea -> Screening -> Draft -> PRD -> Wireframe -> Bridge -> Dev Feature -> Dev Run -> Dev Verify -> Archive
> **Epic**: EPIC-20260428-001

---

## 1. 요약

F4는 F3에서 만든 업무 매뉴얼형 섹션에 단계별 motion과 샘플 상태 표현을 더한 작업이다. 방문자가 `AI 오더 등록 -> 상하차지 관리 -> 배차/운송 상태 -> 화물맨 연동 -> 정산 자동화 -> 세금계산서 관리` 흐름을 실제 운영 상태처럼 이해할 수 있도록, 각 step card 안에 mock status board를 추가했다.

핵심 결과는 다음과 같다.

- `WorkflowManual`에 `샘플 상태 보드`와 단계별 상태 event를 추가했다.
- `WORKFLOW_STEPS`에 `state` mock data를 추가했다.
- `workflowListReveal`, `workflowStepReveal` motion variant를 추가했다.
- `useReducedMotion`으로 reduced motion 환경에서는 reveal animation을 비활성화했다.
- 실제 API 연동, 자동 발행 완료, 성공 보장 같은 과장 문구는 제외했다.

---

## 2. 원본 파일 매니페스트

| 원본 경로 | 현재 위치 | 유형 |
|---|---|---|
| `.plans/ideas/20-approved/IDEA-20260430-001.md` | `sources/ideas/IDEA-20260430-001.md` | IDEA |
| `.plans/ideas/20-approved/SCREENING-20260430-001.md` | `sources/ideas/SCREENING-20260430-001.md` | Screening |
| `.plans/drafts/f4-workflow-motion-state/` | `sources/drafts/` | Draft / PRD Review / Routing |
| `.plans/prd/10-approved/f4-workflow-motion-state-prd.md` | `sources/prd/f4-workflow-motion-state-prd.md` | PRD |
| `.plans/wireframes/f4-workflow-motion-state/` | `sources/wireframes/` | Wireframe |
| `.plans/features/active/f4-workflow-motion-state/` | `sources/feature-package/` | Feature Package / Dev Notes / Verify Report |

---

## 3. 구현 요약

| 영역 | 파일 | 결과 |
|---|---|---|
| Workflow data | `src/lib/landing-workflow.ts` | 단계별 `state` mock data 추가 |
| Motion | `src/lib/motion.ts` | workflow 전용 reveal/stagger variant 추가 |
| Section UI | `src/components/sections/workflow-manual.tsx` | status board, event chip, reduced motion guard 추가 |
| Tests | `src/__tests__/lib/landing-workflow.test.ts`, `src/components/sections/__tests__/workflow-manual.test.tsx` | data/state/UI regression |

---

## 4. 완료 근거

| 항목 | 결과 | 근거 |
|---|:---:|---|
| `/dev-run` | PASS | `sources/feature-package/03-dev-notes/dev-output-summary.md` |
| `/dev-verify` | PASS with existing warnings | `sources/feature-package/03-dev-notes/dev-verify-report.md` |
| Typecheck | PASS | `pnpm typecheck` |
| Full tests | PASS with existing warnings | 55 files, 1120 tests |
| Lint | PASS with existing warnings | 기존 dashboard-preview warnings만 남음 |
| Build | PASS with existing warnings | Next.js static export 성공 |
| Copy scan | PASS | 필수 상태 문구 존재, 금지/과장 문구 0건 |
| Browser QA | PASS | 1440px/375px workflow section overflow 0건 |

---

## 5. 검증 요약

| 검증 | 결과 | 메모 |
|---|:---:|---|
| `pnpm test -- landing-workflow workflow-manual` | PASS | 2 files / 8 tests |
| `pnpm typecheck` | PASS | TypeScript error 0 |
| `pnpm test` | PASS with WARN | 기존 React `act(...)` warning 출력 |
| `pnpm lint` | PASS with WARN | 기존 dashboard-preview lint warnings |
| `pnpm build` | PASS with WARN | static export 생성 |
| Browser check | PASS | desktop/mobile overflow 0건 |

---

## 6. 남은 참고사항

| 항목 | 상태 | 후속 |
|---|---|---|
| dashboard-preview lint/test warnings | deferred | F4 범위 밖 cleanup task로 분리 |
| F5 브랜드 자산, 메타데이터, 검증 정리 | pending | F1~F4 archive 기준을 참조 |
| 미리보기 보조 파일 | local only | `.tmp`는 archive 대상이 아님 |

---

## 7. 다음 단계

1. F5 브랜드 자산, 메타데이터, 검증 정리 IDEA를 등록한다.
2. F5에서 favicon/Open Graph/접근성 라벨/문구 스캔을 release readiness 기준으로 정리한다.
3. F5 완료 후 Epic 전체 closeout 여부를 판단한다.
