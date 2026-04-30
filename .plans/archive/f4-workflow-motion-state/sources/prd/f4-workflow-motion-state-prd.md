# PRD - F4 업무 흐름 애니메이션과 상태 표현

> **상태**: approved
> **날짜**: 2026-04-30
> **Feature Slug**: `f4-workflow-motion-state`

---

## 1. Overview

F4는 F3에서 만든 업무 매뉴얼형 섹션에 단계별 motion과 샘플 상태 표현을 더하는 후속 기능이다. 목표는 기능 과장을 피하면서도 OPTIC이 운송 운영 흐름을 실제로 조율한다는 감각을 강화하는 것이다.

## 2. Problem

현재 섹션은 정보 구조는 명확하지만, 각 단계가 어떤 상태로 이어지는지 시각적 단서가 부족하다. 특히 화물맨 연동, SalesBundle 묶음, 세금계산서 상태는 카피만으로는 운영 흐름의 연결감을 충분히 전달하기 어렵다.

## 3. Goals

- 단계별 순차 등장 motion을 적용한다.
- 샘플 상태 보드로 운영 흐름의 진행감을 보여준다.
- reduced motion을 고려한다.
- 모바일 375px에서도 상태 텍스트가 겹치지 않게 한다.

## 4. User Stories

- 방문자는 workflow section을 보며 각 단계가 차례로 이어진다고 이해한다.
- 주선사는 화물맨 전송 성공/오류 확인 흐름을 서비스 가능성으로 인지한다.
- 화주는 정산과 세금계산서가 별도 상태로 관리된다고 이해한다.

## 5. Requirements

| ID | Requirement |
|---|---|
| REQ-F4-001 | F3 workflow step id와 순서를 유지한다 |
| REQ-F4-002 | `샘플 상태 보드`를 추가한다 |
| REQ-F4-003 | 화물맨 전송 성공/오류 상태를 mock으로 보여준다 |
| REQ-F4-004 | SalesBundle 묶음과 세금계산서 상태를 mock으로 보여준다 |
| REQ-F4-005 | 실제 API/자동 완료를 약속하지 않는다 |
| REQ-F4-006 | reduced motion 사용자를 고려한다 |
| REQ-F4-007 | type/test/lint/build/browser check를 통과한다 |

## 6. UX

Desktop은 기존 좌측 설명/우측 단계 리스트 구조를 유지한다. 각 단계 카드 안에 짧은 상태 보드를 넣어 정보가 흩어지지 않게 한다. Mobile은 카드 내부에서 상태 이벤트가 줄바꿈되도록 한다.

## 7. Tech

기존 `framer-motion`, `src/lib/motion.ts`, `SectionWrapper`, `WORKFLOW_STEPS`를 사용한다. 신규 dependency는 추가하지 않는다.

## 8. Milestones

1. Data test Red
2. Component test Red
3. Data/state 구현
4. Motion/UI 구현
5. Fresh verification

## 9. Risks

| 리스크 | 대응 |
|---|---|
| 과장된 자동화 표현 | 금지 문구 scan과 test |
| motion 과다 | reduced motion 대응, 작은 y/opacity 중심 |
| 모바일 overflow | Playwright 375px 확인 |

## 10. Success Metrics

- Targeted test 통과
- Full type/test/lint/build 통과
- 1440px/768px/375px에서 horizontal overflow 없음
- F3 step 순서 유지
