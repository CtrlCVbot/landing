# 01. Requirements - F2 Mock 스키마 재설계

> 본 문서가 F2 요구사항 정의의 SSOT다. 모든 TASK와 TC는 아래 REQ ID를 참조한다.

---

## 1. Functional Requirements

| ID | 우선순위 | 요구사항 | 수용 기준 |
|---|:---:|---|---|
| REQ-f2-mock-schema-001 | Must | `PREVIEW_MOCK_SCENARIOS` 배열을 도입한다. | 최소 3개 scenario가 존재한다: `default`, `partial`, `mismatch-risk`. |
| REQ-f2-mock-schema-002 | Must | 각 scenario에 `extractedFrame`을 정의한다. | AI panel/result에서 쓰는 값은 `extractedFrame`을 기준으로 읽힌다. |
| REQ-f2-mock-schema-003 | Must | 각 scenario에 `appliedFrame`을 정의한다. | order form, estimate, settlement에서 쓰는 값은 `appliedFrame`을 기준으로 읽힌다. |
| REQ-f2-mock-schema-004 | Must | deterministic default scenario selector helper를 제공한다. | 기본 preview는 항상 같은 default scenario를 사용하며 테스트가 흔들리지 않는다. |
| REQ-f2-mock-schema-005 | Must | `fare`와 `estimate.amount` 정합성을 검증한다. | default scenario에서 두 값이 일치하거나 명시적 변환 규칙으로 같은 의미임이 테스트된다. |
| REQ-f2-mock-schema-006 | Must | Step 기반 visibility state를 명시적으로 생성한다. | `estimateVisible`, `settlementVisible` 또는 동등한 상태가 Step에서 파생된다. |
| REQ-f2-mock-schema-007 | Must | `AI_EXTRACT` 이전에는 estimate/settlement 완성값이 노출되지 않는다. | pre-apply 단계 렌더 테스트가 완성값 미노출을 검증한다. |
| REQ-f2-mock-schema-008 | Must | `AI_APPLY` 이후에는 `appliedFrame` 기준 값이 order form에 반영된다. | `EstimateInfoCard`, `SettlementSection`이 `appliedFrame` 기준 값을 표시한다. |
| REQ-f2-mock-schema-009 | Should | 기존 `jsonViewerOpen` 필드는 유지, 이관, 제거 중 하나로 정리한다. | 결정 결과가 decision log에 남고 테스트 기대값이 동기화된다. |
| REQ-f2-mock-schema-010 | Could | 사용자-facing scenario selector UI는 MVP 범위에서 제외한다. | public UI는 만들지 않고 helper 또는 test fixture 수준으로 제한된다. |

---

## 2. Non-Functional Requirements

| ID | 요구사항 | 수용 기준 |
|---|---|---|
| NFR-f2-001 | 기존 preview 첫 화면의 deterministic 동작 유지 | page reload 후 default scenario가 바뀌지 않는다. |
| NFR-f2-002 | schema migration 중 테스트 신뢰도 유지 | compatibility helper 또는 adapter로 기존 consumer를 단계적으로 이전한다. |
| NFR-f2-003 | F4와 파일 충돌 최소화 | `hit-areas.ts`, `interactive-overlay.tsx`를 수정하지 않는다. |
| NFR-f2-004 | 신규 dependency 금지 | `package.json` 변경이 없다. |
| NFR-f2-005 | 구현 검증 가능성 | 관련 test subset과 `pnpm typecheck`가 통과한다. |

---

## 3. Out of Scope

- 실제 AI API 연동.
- F3의 `OPTION_FEE_MAP` 구현.
- F4 layout, hit-area, overlay anchor 변경.
- 사용자-facing scenario selector UI.
- backend route, persistence, analytics 추가.

---

## 4. 미결정 항목

| 항목 | 기본안 | 결정 위치 |
|---|---|---|
| compatibility helper API | 기존 consumers가 깨지지 않도록 adapter 우선 | `00-context/02-decision-log.md` |
| `jsonViewerOpen` 처리 | schema 내부 이관을 우선 검토하되 불필요하면 제거 | `00-context/02-decision-log.md` |
| `mismatch-risk` 노출 범위 | 테스트 fixture 중심 | `00-context/02-decision-log.md` |
