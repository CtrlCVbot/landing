# Requirements SSOT: dash-preview-focus-zoom-animation

> **Feature**: Dash Preview Focus Zoom Animation
> **PRD Freeze**: `../00-context/01-prd-freeze.md`
> **Overview**: `00-overview.md`
> **Architecture Binding**: `../00-context/06-architecture-binding.md`
> **Created**: 2026-04-28

---

## 0. 이 문서의 역할

이 문서는 구현 단계의 요구사항 단일 기준(SSOT)이다. PRD의 긴 ID는 유지하되, 구현 문서에서는 읽기 쉬운 alias `REQ-FZ-###`를 병기한다.

TASK와 TC는 반드시 이 문서의 `REQ-FZ-###`를 참조한다.

---

## 1. ID 체계

| 유형 | 형식 | 예시 |
|---|---|---|
| Requirement alias | `REQ-FZ-###` | `REQ-FZ-005` |
| 원문 PRD ID | `REQ-dash-preview-focus-zoom-animation-###` | `REQ-dash-preview-focus-zoom-animation-005` |
| Task ID | `T-FZ-M#-##` | `T-FZ-M2-01` |
| Test Case ID | `TC-FZ-{TYPE}-##` | `TC-FZ-UNIT-03` |

---

## 2. Functional Requirements

| Alias | 원문 PRD ID | 우선 | 요구사항 | 수용 기준 | TASK | TC |
|---|---|:---:|---|---|---|---|
| `REQ-FZ-001` | `REQ-dash-preview-focus-zoom-animation-001` | Must | 각 자동 재생 단계는 primary focus target을 가진다. | `INITIAL`, `AI_INPUT`, `AI_EXTRACT`, `AI_APPLY` 모두 focus mapping에 포함된다. | `T-FZ-M1-01` | `TC-FZ-UNIT-01` |
| `REQ-FZ-002` | `REQ-dash-preview-focus-zoom-animation-002` | Must | `AI_INPUT`에서 입력창이 화면 중심에서 확대되어 보인다. | desktop/tablet screenshot에서 입력창이 가장 명확한 시각 초점이다. | `T-FZ-M2-01` | `TC-FZ-VIS-01` |
| `REQ-FZ-003` | `REQ-dash-preview-focus-zoom-animation-003` | Must | `AI_EXTRACT`에서 추출하기 버튼이 강조된다. | 버튼 focus/highlight가 기존 press animation과 충돌하지 않는다. | `T-FZ-M2-02` | `TC-FZ-VIS-02` |
| `REQ-FZ-004` | `REQ-dash-preview-focus-zoom-animation-004` | Must | 추출 결과 단계에서 `ai-result-*` 그룹이 중심에 보인다. | 결과 버튼 그룹이 crop 없이 보인다. | `T-FZ-M2-03` | `TC-FZ-VIS-03` |
| `REQ-FZ-005` | `REQ-dash-preview-focus-zoom-animation-005` | Must | `AI_APPLY`는 추출정보 클릭과 입력 카드 이동이 짝을 이루는 4개 sub-phase로 나뉜다. | 상차지, 하차지, 화물 정보, 운임 순서가 metadata와 visual flow에 모두 반영된다. | `T-FZ-M3-01` | `TC-FZ-INT-01` |
| `REQ-FZ-006` | `REQ-dash-preview-focus-zoom-animation-006` | Must | 각 추출정보 item은 대응 입력 카드 focus target과 1:1로 연결된다. | pickup, delivery, cargo/vehicle, fare/estimate target이 모두 존재한다. | `T-FZ-M3-02` | `TC-FZ-UNIT-02` |
| `REQ-FZ-007` | `REQ-dash-preview-focus-zoom-animation-007` | Must | focus metadata는 데이터로 분리된다. | step id, target id, viewport preset, duration, reduced motion fallback을 테스트할 수 있다. | `T-FZ-M1-01` | `TC-FZ-UNIT-01` |
| `REQ-FZ-008` | `REQ-dash-preview-focus-zoom-animation-008` | Should | Desktop/Tablet focus preset은 분리 가능해야 한다. | tablet preset이 desktop 값을 무조건 공유하지 않아도 된다. | `T-FZ-M1-02` | `TC-FZ-UNIT-03` |
| `REQ-FZ-009` | `REQ-dash-preview-focus-zoom-animation-009` | Must | Mobile은 현재 구현된 `MobileCardView`를 변경하지 않는다. | mobile path와 `mobile-card-view.tsx`가 현행 유지되고 regression check만 수행된다. | `T-FZ-M4-01` | `TC-FZ-INT-02` |
| `REQ-FZ-010` | `REQ-dash-preview-focus-zoom-animation-010` | Must | `prefers-reduced-motion`을 지원한다. | 큰 scale/translate가 꺼지고 highlight-only 표현으로 대체된다. | `T-FZ-M4-02` | `TC-FZ-A11Y-01` |
| `REQ-FZ-011` | `REQ-dash-preview-focus-zoom-animation-011` | Must | 기존 `StepIndicator`와 `goToStep` 동작을 유지한다. | step indicator 클릭 후 해당 단계 focus state가 맞게 표시된다. | `T-FZ-M4-03` | `TC-FZ-INT-03` |
| `REQ-FZ-012` | `REQ-dash-preview-focus-zoom-animation-012` | Must | 기존 interactive mode를 깨지 않는다. | overlay 진입, tooltip, area execute가 유지된다. | `T-FZ-M4-04` | `TC-FZ-INT-04` |
| `REQ-FZ-013` | `REQ-dash-preview-focus-zoom-animation-013` | Must | focus viewport는 frame crop을 관리한다. | 확대된 target이 `PreviewChrome` 안에서 읽기 어렵게 잘리지 않는다. | `T-FZ-M2-04` | `TC-FZ-VIS-04` |
| `REQ-FZ-014` | `REQ-dash-preview-focus-zoom-animation-014` | Must | animation timing은 기존 step duration 안에서 완료된다. | focus 전환이 다음 step으로 밀리지 않는다. | `T-FZ-M1-03` | `TC-FZ-UNIT-04` |
| `REQ-FZ-015` | `REQ-dash-preview-focus-zoom-animation-015` | Must | focus layer는 접근성 노이즈를 만들지 않는다. | 장식 레이어는 `aria-hidden` 또는 동등 처리된다. | `T-FZ-M4-05` | `TC-FZ-A11Y-02` |
| `REQ-FZ-016` | `REQ-dash-preview-focus-zoom-animation-016` | Should | QA evidence 기준을 정의한다. | desktop, tablet, mobile, reduced-motion 확인 항목이 release checklist에 있다. | `T-FZ-M5-01` | `TC-FZ-REL-01` |

---

## 3. Scope Guardrails

| Guardrail | 정책 | 연결 REQ |
|---|---|---|
| Mobile preservation | `src/components/dashboard-preview/mobile-card-view.tsx`는 수정하지 않는다. | `REQ-FZ-009` |
| No new dependency | 새 animation package를 추가하지 않는다. | `REQ-FZ-007`, `REQ-FZ-016` |
| No API/DB | 실제 AI, database, auth, analytics 연동은 하지 않는다. | 전체 |
| Hero unchanged | `src/components/sections/hero.tsx`는 이번 feature scope 밖이다. | 전체 |
| Overlay safety | interactive mode와 focus viewport 좌표계 충돌을 반드시 검증한다. | `REQ-FZ-012` |

---

## 4. TASK Coverage Matrix

| TASK | 포함 REQ |
|---|---|
| `T-FZ-M1-01` | `REQ-FZ-001`, `REQ-FZ-007` |
| `T-FZ-M1-02` | `REQ-FZ-008` |
| `T-FZ-M1-03` | `REQ-FZ-014` |
| `T-FZ-M2-01` | `REQ-FZ-002`, `REQ-FZ-013` |
| `T-FZ-M2-02` | `REQ-FZ-003`, `REQ-FZ-013` |
| `T-FZ-M2-03` | `REQ-FZ-004`, `REQ-FZ-013` |
| `T-FZ-M2-04` | `REQ-FZ-013` |
| `T-FZ-M3-01` | `REQ-FZ-005` |
| `T-FZ-M3-02` | `REQ-FZ-006` |
| `T-FZ-M4-01` | `REQ-FZ-009` |
| `T-FZ-M4-02` | `REQ-FZ-010` |
| `T-FZ-M4-03` | `REQ-FZ-011` |
| `T-FZ-M4-04` | `REQ-FZ-012` |
| `T-FZ-M4-05` | `REQ-FZ-015` |
| `T-FZ-M5-01` | `REQ-FZ-016` |

---

## 5. Open Decisions

| ID | 내용 | 기본값 | 결정 위치 |
|---|---|---|---|
| `OPEN-FZ-001` | focus metadata 파일 위치 | `src/lib/preview-steps.ts` 확장 우선, 복잡해지면 `src/lib/preview-focus.ts` 신규 | `T-FZ-M1-01` |
| `OPEN-FZ-002` | exact scale/offset 값 | desktop/tablet 별도 preset | `T-FZ-M1-02`, visual QA |
| `OPEN-FZ-003` | interactive mode 충돌 처리 | interactive mode에서는 focus viewport disable 우선 | `T-FZ-M4-04` |
