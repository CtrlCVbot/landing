# F4 업무 흐름 애니메이션과 상태 표현 - Draft

> **IDEA**: [IDEA-20260430-001](../../ideas/20-approved/IDEA-20260430-001.md)
> **상태**: draft-approved
> **Lane**: Standard

---

## 1. 목표

F3의 업무 매뉴얼형 섹션에 motion과 mock 상태 보드를 추가해, 방문자가 각 단계의 진행 상황을 더 빠르게 이해하도록 한다.

## 2. 범위

- `WORKFLOW_STEPS`에 상태 mock 데이터 추가
- `WorkflowManual`에 샘플 상태 보드 추가
- `src/lib/motion.ts`에 workflow 전용 motion variant 추가
- component/data tests 보강
- desktop/mobile/reduced motion 확인

## 3. Out of Scope

- 실제 화물맨 API 연동
- 세금계산서 자동 발행 기능
- 사용자 설정 저장 UI
- DashboardPreview 영역 수정

## 4. 주요 카피 기준

| 항목 | 표현 |
|---|---|
| 상태 보드 | 샘플 상태 보드 |
| 화물맨 | 화물맨 전송 성공, 필드 오류 재확인 |
| 정산 | SalesBundle 묶음 생성 |
| 세금계산서 | 세금계산서 상태 확인 |

## 5. 다음 단계

`/plan-prd .plans/drafts/f4-workflow-motion-state/`
