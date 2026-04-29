# PRD: F3 업무 매뉴얼형 스크롤 섹션 MVP

> **Epic**: [EPIC-20260428-001](../../epics/10-planning/EPIC-20260428-001/00-epic-brief.md) (Phase C, F3)
> **Feature slug**: `f3-workflow-manual-section`
> **IDEA**: [IDEA-20260429-002](../../ideas/20-approved/IDEA-20260429-002.md)
> **Screening**: [SCREENING-20260429-002](../../ideas/20-approved/SCREENING-20260429-002.md)
> **Draft**: [01-draft.md](../../drafts/f3-workflow-manual-section/01-draft.md)
> **PRD Review**: [03-prd-review.md](../../drafts/f3-workflow-manual-section/03-prd-review.md)
> **Wireframe**: [screens.md](../../wireframes/f3-workflow-manual-section/screens.md)
> **Wireframe Review**: [04-wireframe-review.md](../../wireframes/f3-workflow-manual-section/04-wireframe-review.md)
> **Bridge Context**: [00-index.md](../../features/active/f3-workflow-manual-section/00-context/00-index.md)
> **Routing metadata**: [07-routing-metadata.md](../../drafts/f3-workflow-manual-section/07-routing-metadata.md)
> **작성일**: 2026-04-29
> **상태**: approved
> **schema**: PRD 10 섹션 표준

---

## 1. Overview

F3는 OPTIC 랜딩에 업무 매뉴얼형 스크롤 섹션을 추가하는 Feature다. F1은 브랜드와 CTA를 정리했고, F2는 제품 라인업과 카피 기준을 정리했다. F3는 그 다음 단계로, 방문자가 OPTIC의 주 서비스를 실제 운송 운영 흐름으로 이해하게 만드는 역할을 맡는다.

핵심 메시지는 “OPTIC은 고정된 단일 운송 관리 화면이 아니라, 화주와 주선사마다 다른 오더 접수 방식, 배차 방식, 정산 기준, 외부 채널 연동을 하나의 운영 흐름으로 조율하는 맞춤형 운송 운영 플랫폼”이라는 점이다. 이 PRD는 신규 섹션의 단계 구조, 카피 기준, UX 요구사항, 검증 기준을 고정해 이후 Wireframe, Bridge, Dev Feature가 같은 기준으로 이어지게 한다.

## 2. Problem Statement

현재 랜딩은 F2 이후 `OPTIC` 브랜드, 역할별 제품 라인업, 화물맨 연동, 정산 자동화, 세금계산서 관리 같은 핵심 표현이 정리된 상태다. 하지만 방문자가 “실제로 업무가 어떤 순서로 이어지는가”를 한 번에 따라갈 수 있는 단계형 설명은 아직 부족하다.

이 상태에서는 `OPTIC Broker`와 `OPTIC Shipper`가 어떤 업무 흐름을 함께 다루는지, 화주와 주선사별로 다른 요청 양식과 정산 기준이 어떻게 조율되는지, 화물맨 연동이 어느 단계의 기능인지가 분리된 정보로 보일 수 있다. F3는 기능 목록과 제품 라인업 사이를 이어, `AI 오더 등록 → 상하차지 관리 → 배차/운송 상태 → 화물맨 연동 → 정산 자동화 → 세금계산서 관리` 흐름을 고객이 한 번에 이해하도록 만든다.

## 3. Goals & Non-Goals

### Goals

- 랜딩에 신규 업무 매뉴얼형 섹션을 추가한다.
- 섹션은 제품 카드가 아니라 업무 단계형 흐름으로 구성한다.
- 단계 순서는 `AI 오더 등록`, `상하차지 관리`, `배차/운송 상태`, `화물맨 연동`, `정산 자동화`, `세금계산서 관리`를 기본값으로 둔다.
- 각 단계는 `무엇을 입력하는가`, `무엇이 이어지는가`, `무엇을 회사별로 맞출 수 있는가`를 짧게 설명한다.
- 화주/주선사별 커스텀 가능성을 headline, intro copy, 단계별 copy에 반영한다.
- `화물맨 연동`은 배차 단계의 외부 채널 연결로 설명한다.
- 정산 파트 문구는 `정산 자동화`, `세금계산서 관리`로 고정한다.
- F4에서 애니메이션과 상태 mock을 얹을 수 있도록 단계 데이터와 UI 구조를 분리한다.
- 375px 모바일 폭에서도 텍스트, 단계 번호, 카드, 버튼이 겹치지 않도록 한다.

### Non-Goals

- 실제 화물맨 API 연동 구현.
- 실제 정산 API, 세금계산서 API, 회계 시스템 연동 구현.
- 화주/주선사별 설정 저장 구조, tenant admin, 고객별 설정 UI 구현.
- F4 범위인 스크롤 애니메이션, stagger, 진행 상태 mock 고도화.
- F5 범위인 favicon, Open Graph, 브랜드 자산 확정.
- 제품 라인업 재설계. F3는 F2의 제품 구조를 반복하지 않고 업무 흐름만 담당한다.
- 실제 권한, 라우팅, 로그인 후 서비스 화면 설계.

## 4. User Stories

1. **As a** 화주 의사결정자, **I want** 운송 요청이 OPTIC에서 어떤 순서로 처리되는지 보기를, **so that** 우리 회사 요청 방식에 맞춰 쓸 수 있는지 판단할 수 있다.
2. **As a** 주선사 운영자, **I want** AI 오더 등록, 배차, 화물맨 연동, 정산, 세금계산서 흐름을 한 번에 이해하기를, **so that** 기존 수작업 흐름과 비교할 수 있다.
3. **As a** 정산 담당자, **I want** 운송 완료 후 정산 자동화와 세금계산서 관리가 어떻게 이어지는지 확인하기를, **so that** 후속 증빙 업무 누락을 줄이는 가치를 이해할 수 있다.
4. **As a** 도입 검토자, **I want** 화주와 주선사별 요청 양식, 담당자 흐름, 정산 기준을 조율할 수 있음을 알기를, **so that** OPTIC을 단순 SaaS 화면이 아니라 맞춤형 운영 서비스로 판단할 수 있다.
5. **As a** F4 구현자, **I want** 단계별 데이터와 UI 구조가 먼저 확정되기를, **so that** 애니메이션과 상태 mock을 추가할 때 재작업을 줄일 수 있다.

## 5. Functional Requirements

| ID | 요구사항 | 우선순위 | 수용 기준 |
|---|---|:---:|---|
| REQ-f3-workflow-manual-section-001 | 신규 업무 매뉴얼형 섹션을 랜딩에 추가한다. | Must | `src/app/page.tsx` 또는 equivalent page composition에서 신규 섹션이 렌더링된다. |
| REQ-f3-workflow-manual-section-002 | 섹션은 6단계 업무 흐름을 순서대로 보여준다. | Must | `AI 오더 등록 → 상하차지 관리 → 배차/운송 상태 → 화물맨 연동 → 정산 자동화 → 세금계산서 관리` 순서가 유지된다. |
| REQ-f3-workflow-manual-section-003 | 각 단계는 고객이 이해할 수 있는 짧은 제목과 설명을 가진다. | Must | 각 단계에 제목, 1~2문장 설명, 커스텀 포인트 또는 다음 흐름 설명이 존재한다. |
| REQ-f3-workflow-manual-section-004 | 화주/주선사별 커스텀 가능성을 섹션 핵심 메시지로 반영한다. | Must | headline 또는 intro copy에 회사별 운영 방식 조율 메시지가 포함된다. |
| REQ-f3-workflow-manual-section-005 | 단계별 copy에는 커스텀 포인트가 포함된다. | Should | 요청 양식, 장소/담당자, 상태명/승인 흐름, 전송 필드, 정산 기준, 증빙 확인 중 단계별 관련 포인트가 노출된다. |
| REQ-f3-workflow-manual-section-006 | `화물맨 연동`은 배차 단계의 기능으로 배치한다. | Must | 화물맨 연동이 정산/세금계산서 단계가 아니라 배차 또는 운송 정보 전송 흐름에 위치한다. |
| REQ-f3-workflow-manual-section-007 | 정산 단계는 `정산 자동화`와 `세금계산서 관리`로 나누어 설명한다. | Must | 두 문구가 각각 별도 단계 또는 명확히 분리된 영역으로 노출된다. |
| REQ-f3-workflow-manual-section-008 | F2 제품 라인업을 반복하지 않는다. | Must | `주선사용 운송 운영 콘솔`, `화주용 운송 요청 포털` 카드 구조를 중복 생성하지 않는다. |
| REQ-f3-workflow-manual-section-009 | workflow data와 UI 컴포넌트는 분리 가능해야 한다. | Should | 단계 데이터가 `src/lib/landing-workflow.ts` 또는 constants 계층에 모여 있고, 컴포넌트는 데이터를 렌더링한다. |
| REQ-f3-workflow-manual-section-010 | F4가 이어받을 수 있는 상태 hook 또는 데이터 구조를 남긴다. | Could | 각 단계에 stable id, label, description, optional status/meta가 있어 animation/state 확장이 가능하다. |
| REQ-f3-workflow-manual-section-011 | 모바일에서 텍스트 겹침을 방지한다. | Must | 375px 폭에서 단계 번호, 제목, 설명, CTA가 겹치거나 카드 밖으로 넘치지 않는다. |
| REQ-f3-workflow-manual-section-012 | 접근성 기본값을 지킨다. | Must | 섹션 heading hierarchy, focusable element, decorative icon aria 처리, color contrast를 점검한다. |
| REQ-f3-workflow-manual-section-013 | 실제 API/설정 기능이 구현된 것처럼 보이는 표현을 피한다. | Must | “설정 저장”, “자동 연동 완료”, “실시간 API 처리”처럼 구현 범위를 초과하는 확정 표현이 없다. |
| REQ-f3-workflow-manual-section-014 | 검증 가능한 테스트 또는 스캔 기준을 추가한다. | Must | 단계 제목과 핵심 문구가 테스트 또는 문구 스캔으로 확인 가능하다. |

## 6. UX Requirements

- 섹션 첫 화면 메시지는 `OPTIC은 화주와 주선사마다 다른 운송 운영을 하나의 흐름으로 조율합니다`에 준하는 고객 가치 문장으로 시작한다.
- 약어 풀이보다 실제 운영 흐름을 먼저 보여준다. `Optimized`, `Platform`, `Transport`, `Intelligence`, `Coordination`은 내부 카피 기준이지 고객 화면의 긴 설명이 아니다.
- desktop에서는 단계형 timeline, split rail, 또는 process map 구조를 우선 검토한다. 카드만 나열해 기능 목록처럼 보이지 않게 한다.
- mobile에서는 한 단계씩 세로로 읽히게 구성한다. 한 화면에서 너무 많은 텍스트가 밀집되지 않아야 한다.
- 각 단계는 `입력`, `이어지는 업무`, `커스텀 포인트` 중 2개 이상이 보이게 한다.
- `화물맨 연동`은 배차 단계에서 강조하되, 외부 브랜드 나열이 아니라 중복 등록과 전송 누락 감소의 결과로 설명한다.
- `정산 자동화`와 `세금계산서 관리`는 운영 후반부의 별도 업무로 보이게 한다.
- CTA가 포함된다면 기능 설명 내부 버튼보다 섹션 말미의 자연스러운 문의 또는 서비스 이동 CTA를 우선한다.
- 긴 한글 문구는 2~3줄 안에서 안정적으로 줄바꿈되어야 한다.
- icon을 사용할 경우 lucide 등 기존 아이콘 체계를 우선하고, 의미 없는 장식은 `aria-hidden` 처리한다.
- reduced motion 환경에서는 F4 이전이라도 애니메이션 의존 없이 내용을 읽을 수 있어야 한다.

## 7. Technical Considerations

- 예상 구현 파일은 `src/components/sections/workflow-manual.tsx`, `src/lib/landing-workflow.ts` 또는 `src/lib/constants.ts`, `src/app/page.tsx`다.
- 신규 데이터 파일을 만들 경우 단계 객체는 `id`, `title`, `description`, `customization`, `handoff`, `statusLabel` 같은 안정적인 필드를 가질 수 있다.
- 기존 F2에서 정리한 `화물맨 연동`, `정산 자동화`, `세금계산서 관리` 문구를 그대로 이어받는다.
- 실제 연동 상태, 실시간 로그, 오류 상태 UI는 F4 범위다. F3에서는 static MVP를 기준으로 한다.
- API, DB, 인증, 라우팅, tenant 설정 저장 구조를 변경하지 않는다.
- 테스트 후보는 workflow data 순서 검증, 섹션 렌더링 검증, 핵심 문구 노출 검증이다.
- 검증 후보 명령은 `pnpm typecheck`, `pnpm test`, `pnpm lint`, 문구 스캔, browser spot check다.
- Windows PowerShell 환경에서는 `rg`가 실패하면 `Select-String`을 사용한다.
- 현재 워킹트리에는 기존 untracked `.tmp/`, `Python/`이 있으므로 F3 구현/검증 커밋에서는 별도 사용자 승인 없이 포함하지 않는다.

## 8. Milestones

| 단계 | 범위 | 완료 조건 |
|---|---|---|
| M1 — PRD review | 본 PRD 범위와 요구사항 검토 | 10개 섹션, REQ-ID, Non-Goals, Success Metrics 확인 |
| M2 — Wireframe | desktop/mobile 섹션 구조 설계 | 단계형 흐름, 375px 모바일 배치, 정보 밀도 확정 |
| M3 — Bridge | PRD와 Wireframe을 dev handoff로 정리 | Feature context, architecture binding, task 입력 기준 생성 |
| M4 — Dev Feature | 요구사항과 task package 생성 | `REQ-f3-*`, 테스트 케이스, 구현 task 생성 |
| M5 — Implementation | static workflow section 구현 | 신규 섹션, 데이터 구조, 페이지 배치 완료 |
| M6 — Verification | 문구/테스트/responsive 검증 | type/test/lint 또는 범위별 대체 검증과 browser spot check 기록 |
| M7 — Archive | 산출물 아카이브 | PRD, Wireframe, Bridge, Dev, Verify 결과가 archive bundle로 이동 |

## 9. Risks & Mitigations

| 리스크 | 영향 | 확률 | 완화 |
|---|:---:|:---:|---|
| 커스텀 가능성 표현이 실제 설정 UI 약속처럼 보임 | High | Medium | Non-Goals에 설정 저장과 tenant admin 제외를 명시하고, copy는 운영 방식 조율 수준으로 제한한다. |
| 업무 흐름 섹션이 길어져 랜딩 리듬이 느려짐 | Medium | Medium | 단계별 본문을 짧게 제한하고 Wireframe에서 정보 밀도를 조정한다. |
| F2 제품 라인업과 설명이 중복됨 | Medium | Medium | F2는 역할별 제품, F3는 업무 순서로 역할을 분리한다. |
| 화물맨 연동이 정산 또는 API 기능처럼 오해됨 | Medium | Medium | 배차 단계의 외부 채널 연결로만 정의하고 실제 API 연동은 제외한다. |
| F4 애니메이션 범위가 F3에 섞임 | Medium | Medium | F3는 static MVP, F4는 animation/state enhancement로 milestone을 분리한다. |
| 모바일에서 단계 카드 텍스트가 겹침 | High | Medium | 375px spot check와 줄바꿈 기준을 Acceptance Criteria와 Success Metrics에 포함한다. |
| 신규 데이터 구조가 기존 constants와 충돌함 | Medium | Low | `landing-workflow.ts` 분리안을 우선 검토하고, 기존 constants에 섞을 경우 export boundary를 명확히 한다. |
| 테스트 없이 문구만 추가되어 후속 변경에 취약함 | Medium | Medium | 단계 순서와 핵심 문구를 테스트 또는 스캔으로 검증한다. |

## 10. Success Metrics

| ID | 지표 | 목표 | 측정 방법 |
|---|---|---|---|
| SM-f3-workflow-manual-section-001 | 6단계 업무 흐름 노출 | 6개 단계가 지정 순서대로 노출 | 렌더 테스트 또는 문구 스캔 |
| SM-f3-workflow-manual-section-002 | 커스텀 가능성 메시지 | headline/intro와 단계별 copy 중 최소 3곳에 화주/주선사별 조율 메시지 반영 | 카피 스캔 + 수동 review |
| SM-f3-workflow-manual-section-003 | 화물맨 배차 단계 정합성 | `화물맨 연동`이 배차/운송 상태 이후, 정산 이전에 위치 | 데이터 순서 테스트 또는 문구 review |
| SM-f3-workflow-manual-section-004 | 정산 문구 정합성 | `정산 자동화`, `세금계산서 관리`가 분리되어 노출 | 문구 스캔 |
| SM-f3-workflow-manual-section-005 | F2 중복 방지 | 제품 라인업 카드 구조 중복 없음 | UI review |
| SM-f3-workflow-manual-section-006 | 모바일 안정성 | 375px 폭에서 텍스트 겹침 없음 | browser spot check |
| SM-f3-workflow-manual-section-007 | 접근성 기본값 | heading hierarchy와 decorative icon 처리 확인 | code review 또는 accessibility spot check |
| SM-f3-workflow-manual-section-008 | 테스트 안정성 | 관련 테스트와 타입 검증 통과 | `pnpm test`, `pnpm typecheck` |
| SM-f3-workflow-manual-section-009 | F4 handoff 준비 | 단계별 stable id와 데이터 구조 존재 | code review |
| SM-f3-workflow-manual-section-010 | 과장 표현 방지 | 실제 API/설정 저장 구현으로 오해될 문구 없음 | PRD/copy review |

## 11. Review Checklist

| 항목 | 상태 | 메모 |
|---|:---:|---|
| 10개 필수 섹션 존재 | 준비됨 | Overview부터 Success Metrics까지 포함 |
| REQ-ID 부여 | 준비됨 | `REQ-f3-workflow-manual-section-*` 체계 사용 |
| User Story 표준 형식 | 준비됨 | As a / I want / So that 형식 |
| Non-Goals 명확성 | 준비됨 | API, 설정 UI, F4/F5 범위 분리 |
| 측정 가능한 지표 | 준비됨 | 문구 스캔, 렌더 테스트, 375px spot check |
| 이전 Draft와 범위 일치 | 준비됨 | Draft의 6단계 흐름과 커스텀 메시지 반영 |

## 12. 다음 단계

1. Bridge context를 확인한다: [00-index.md](../../features/active/f3-workflow-manual-section/00-context/00-index.md)
2. `/dev-feature .plans/features/active/f3-workflow-manual-section/`로 개발 패키지를 생성한다.
