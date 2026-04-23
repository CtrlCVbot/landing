# 01. Product Context — F5 UI 잔재 정리

> **Feature slug**: `f5-ui-residue-cleanup`
> **IDEA**: [IDEA-20260423-001](../../../../ideas/00-inbox/IDEA-20260423-001.md) (상태 `approved`)
> **Draft**: [01-draft.md](../../../../drafts/f5-ui-residue-cleanup/01-draft.md)
> **Epic**: [EPIC-20260422-001 — dash-preview Phase 4](../../../../epics/20-active/EPIC-20260422-001/00-epic-brief.md) (Phase A, F5)
> **Routing**: Lite / 시나리오 B / dev / hybrid false ([07-routing-metadata.md](../../../../drafts/f5-ui-residue-cleanup/07-routing-metadata.md))
> **작성일**: 2026-04-23
> **작성자**: `plan-bridge-writer` (Phase A Step 7)

---

## 1. 목적 (Why)

dash-preview Phase 3 (2026-04-22 archived) 직후 사용자 피드백 10 건 중 **이슈 [5]·[6]** 을 단일 Feature 로 묶어 해소한다.

- **이슈 [5]** — `AiExtractJsonViewer` 가 AI 패널 하단에 **항상 렌더** 중. Phase 3 초기 디버그용 JSON 뷰어였으나 시연 완성도가 확보된 지금은 시네마틱 흐름을 방해하는 군더더기. 컴포넌트 파일·`jsonViewerOpen` mock 필드는 유지하여 **가역성 확보** (재활성화 시 JSX 1줄 복원).
- **이슈 [6]** — `estimate-info-card.tsx` 의 "자동 배차" 라벨이 실제 의미("자동 배차를 **기다리는** 상태") 와 달리 "이미 완료됨" 으로 오해됨. 라벨을 "자동 배차 대기" 로 교체.

두 이슈 모두 "숨김·치환" 계열이므로 Lite Lane 에 적합하며, F1 (라이트 모드) 과 독립 파일이라 **Phase A 에 F1 과 병렬 투입** 가능 (Epic 의존성 매트릭스 F1↔F5 `✓`).

---

## 2. 성공 지표 (What)

본 Feature 단독 성공 기준. Epic §2 성공 지표와의 연결은 §3 참조.

| # | 지표 | 측정 방식 |
|---|------|----------|
| 1 | `AiExtractJsonViewer` 화면 비노출 | `grep -rn "<AiExtractJsonViewer" src/` → **0 결과**. 단 `ai-extract-json-viewer.tsx` 컴포넌트 파일은 유지. |
| 2 | 미사용 식별자 잔존 제거 | `grep -rn "ai-json-viewer" src/components/dashboard-preview/hit-areas.ts src/lib/mock-data.ts` → **0 결과** |
| 3 | `jsonViewerOpen` mock 필드 보존 | `src/lib/mock-data.ts` line 160 (타입) · line 438 (값) · `src/lib/preview-steps.ts` 각 Step 의 `jsonViewerOpen` 필드 **유지** (F2 재설계 시 이관 예정) |
| 4 | 라벨 "자동 배차 대기" 반영 | `grep -n "자동 배차" src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx` → 새 문구만 (JSDoc 포함) |
| 5 | Tooltip 동기 (결정 포인트 §4-1) | `src/lib/mock-data.ts` line 414 `'auto-dispatch'` 값이 "자동 배차 대기 중 — 조건 충족 시 자동 배차합니다" 로 반영 |
| 6 | 통합 테스트 미렌더 단정 갱신 | `ai-panel` 통합 테스트에서 `expect(screen.queryByTestId('ai-extract-json-viewer')).not.toBeInTheDocument()` 류 단정문 확인 + `estimate-info-card.test.tsx` line 117·154·168 의 기대 문자열 "자동 배차 대기" 로 동기 |

**가역성 체크**: `ai-extract-json-viewer.tsx` 삭제 금지, `ai-extract-json-viewer.test.tsx` 단위 테스트 유지.

---

## 3. Epic 배경 — Phase 4 에서의 F5 위치

### 3-1. Epic 목적과 F5 의 기여

Epic EPIC-20260422-001 은 Phase 3 피드백 10 건을 5 Feature (F1~F5) 로 그룹화해 **충실도·신뢰성·접근성** 을 Round 2 로 끌어올리는 것이 목표. F5 의 기여는 Epic 5 대 성공 지표 중 **지표 2** (AI_EXTRACT 이전 단계 미노출) 와 **지표 3** (3 개 이상 시나리오 세트 순환) 에 **간접 연결**:

- **Epic 지표 2 와의 간접 연결**: F5 가 제거하는 `<AiExtractJsonViewer>` 는 "AI 추출 이전 단계에서 미리 보이는 내부 디버그 UI" 의 대표 사례. 화면 비노출로써 "AI_EXTRACT 내러티브 진입 전 미완성 수치 은폐" 원칙의 **선행 정리**.
- **Epic 지표 3 와의 간접 연결**: F2 (Phase B) 가 `extractedFrame`/`appliedFrame` 스키마 + `PREVIEW_MOCK_SCENARIOS` 배열을 도입할 때, F5 가 `jsonViewerOpen` 필드와 관련 tooltip/hit-area 엔트리를 **선행 정리한 mock-data.ts 기반** 위에 얹힘. → F2 리스크 2 (테스트 대량 갱신) 완화.

### 3-2. Phase A 병렬 실행

F5 는 Phase A (2026-04-23 ~ 2026-05-06) 에서 F1 (라이트 모드) 과 병렬 실행된다. Epic Children `§2 의존성 매트릭스` 행 인용:

| 관계 | 타입 | 근거 |
|------|:---:|------|
| F1 ↔ F5 | **✓** (완전 병렬) | F5 편집 파일 (ai-panel/index.tsx, estimate-info-card.tsx 라벨 한 줄 등) 은 F1 landing 전역 토큰 스윕 대상 파일과 **교차점이 있지만 수정 범위가 다른 라인** — 머지 충돌 위험은 파일 단위 리베이스로 해소 가능. 실질 병렬 가능. |
| F2 ↔ F5 | **→** (F5 먼저) | F5 의 `hit-areas.ts`·tooltip 정리가 F2 스키마 재설계의 선행 조건. F5 가 `jsonViewerOpen` 필드를 **유지**하여 F2 에서 `extractedFrame`/`appliedFrame` 스키마 내부로 일괄 이관 가능. |
| F3 ↔ F5 | ✓ | 파일 범위 독립. |
| F4 ↔ F5 | ✓ | F4 는 `hit-areas.ts` 전 좌표 **재측정**, F5 는 단일 엔트리 **제거**. Phase A 완료 후 Phase B 진입이라 시간 분리. |

### 3-3. Phase A 종료 조건 중 F5 담당 항목 (Epic Children §4)

- [ ] F5 구현 완료 + 테스트 통과 + 리뷰 승인 → F5 Feature 상태 `archived`
- [ ] JSON 뷰어 화면 비노출 확인 (`grep -rn "<AiExtractJsonViewer" src/` → 0 결과)
- [ ] "자동 배차 대기" 라벨 반영 확인 (`grep -n "자동 배차" src/components/dashboard-preview/` → 새 문구)

본 Feature 는 Phase A 의 **독립 완료 가능 항목** (F1 지연과 무관하게 선행 완료). Epic 리스크 §6 #1 ("F1 의 landing 전역 토큰 스윕" 지연) 시에도 F5 는 Phase A 종료 조건 중 2/3 를 단독 커버.

---

## 4. 다음 단계

- **Step 8**: `/plan-epic advance EPIC-20260422-001 --to=active`
- **Step 9**: `/dev-feature .plans/features/active/f5-ui-residue-cleanup/` → `/dev-run` (병렬: `/dev-feature .plans/features/active/f1-landing-light-theme/` + `/dev-run`)
- 예상 TASK: `T-CLEANUP-01 ~ T-CLEANUP-04` (4 건, 상세는 `04-implementation-hints.md`)
