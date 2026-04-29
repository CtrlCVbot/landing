# PRD Review — F3 업무 매뉴얼형 스크롤 섹션 MVP

> **대상 PRD**: [f3-workflow-manual-section-prd.md](../../prd/10-approved/f3-workflow-manual-section-prd.md)
> **Feature slug**: `f3-workflow-manual-section`
> **Review type**: PRD
> **검토일**: 2026-04-29
> **판정**: Approve
> **다음 단계**: `/plan-wireframe .plans/prd/10-approved/f3-workflow-manual-section-prd.md`

---

## 1. 종합 판정

**Approve**. F3 PRD는 업무 매뉴얼형 스크롤 섹션의 목적, 범위, 6단계 흐름, 화주/주선사별 커스텀 가능성, 배차 단계의 화물맨 연동, 정산 자동화/세금계산서 관리 분리 기준을 충분히 정의한다.

진행 차단 수준의 `CRITICAL` 또는 `HIGH` 이슈는 없다. PRD는 `10-approved`로 승격하고 다음 단계는 Wireframe 설계로 진행한다.

## 2. 4축 평가

| 축 | 등급 | 근거 |
|---|:---:|---|
| 완전성 | A | PRD 10개 필수 섹션, REQ-ID, Non-Goals, Milestones, Success Metrics가 포함되어 있다. |
| 일관성 | A | IDEA, Screening, Draft의 6단계 흐름과 PRD 요구사항이 일치한다. |
| 실현가능성 | A- | 신규 섹션, 데이터 구조, 페이지 배치 중심이라 프론트엔드 범위에서 현실적이다. Wireframe에서 정보 밀도만 확정하면 된다. |
| 사용자 중심성 | A | 화주, 주선사, 정산 담당자, 도입 검토자 관점이 분리되어 있고 모바일/접근성 기준도 포함되어 있다. |

## 3. PRD 체크리스트

| 항목 | 결과 | 메모 |
|---|:---:|---|
| 10개 섹션 모두 존재 | PASS | Overview부터 Success Metrics까지 존재하며 Review Checklist/다음 단계도 보강되어 있다. |
| 모든 요구사항에 REQ-ID 부여 | PASS | `REQ-f3-workflow-manual-section-001`~`014` 확인. |
| User Story 표준 형식 | PASS | As a / I want / So that 형식 준수. |
| 비기능 요구사항 포함 | PASS | responsive, accessibility, reduced motion, 과장 표현 방지 포함. |
| Success Metrics 측정 가능 | PASS | 문구 스캔, 렌더 테스트, 375px spot check 등 측정 방식 명시. |
| Risks에 대응 전략 포함 | PASS | 주요 리스크별 영향/확률/완화가 기록되어 있다. |
| Non-Goals 명시 | PASS | API, 설정 UI, F4/F5 범위, 제품 라인업 재설계를 제외했다. |
| 기술적 제약과 의존성 식별 | PASS | 예상 파일, 데이터 분리, API/DB 미변경, 기존 untracked 산출물 제외 기준 명시. |
| Milestones 현실성 | PASS | PRD review → Wireframe → Bridge → Dev Feature → Implementation 순서가 적절하다. |
| 용어 일관성 | PASS | `화물맨 연동`, `정산 자동화`, `세금계산서 관리`, `업무 매뉴얼형` 표현이 일관적이다. |
| 내부 참조 일관성 | PASS | IDEA/Screening/Draft/PRD 간 범위가 일치한다. |
| 이전 단계 범위와 일치 | PASS | Draft의 static MVP와 F4 분리 기준을 유지한다. |

## 4. PCC 검증

| PCC | 결과 | 근거 |
|---|:---:|---|
| PCC-01 Idea ↔ Screen | PASS | IDEA-20260429-002와 SCREENING-20260429-002가 모두 approved 상태이며 Go/Standard 판정이 일치한다. |
| PCC-02 Screen ↔ Feature | PASS | Screening의 Standard lane과 Draft의 신규 섹션/데이터 구조 범위가 일치한다. |
| PCC-03 Feature ↔ PRD | PASS | Draft의 6단계 흐름, 커스텀 가능성, F4 분리 기준이 PRD 요구사항과 Metrics에 반영되어 있다. |
| PCC-04 PRD ↔ Wireframe | N/A | Wireframe 단계 전이다. 다음 단계에서 검증한다. |
| PCC-05 Wireframe ↔ Stitch | N/A | Wireframe/Stitch 전이다. |
| PCC-06 Gap Board ↔ Detail PRD | N/A | copy Scenario C가 아니며 gap board 대상이 아니다. |
| PCC-07 Epic Binding 양방향 무결성 | N/A | plan-bridge 이후 생성되는 binding 대상이다. |
| PCC-08 Feature 상태 SSOT 동기 | PASS | 이 리뷰에서 IDEA, Draft, Routing, Epic, backlog를 `prd-reviewed` 기준으로 갱신한다. |
| PCC-09 의존성 매트릭스 현재성 | PASS | F2 → F3 → F4 순차 관계와 현재 Phase C 진입이 충돌하지 않는다. |

## 5. Review Findings

| ID | Severity | Confidence | Action | 내용 |
|---|:---:|:---:|:---:|---|
| RF-F3-PRD-001 | LOW | likely | queued | Wireframe 단계에서 섹션 배치 위치(hero 직후 vs 제품 라인업 직후)를 최종 확정해야 한다. PRD 차단 이슈는 아니다. |
| RF-F3-PRD-002 | LOW | likely | queued | i18n은 현재 한국어 랜딩 기준에서는 별도 요구사항이 아니지만, 추후 영문 제품명 보조 라벨이 늘어나면 overflow 검증을 강화해야 한다. |

## 6. 적용 결정

| 항목 | 결정 | 메모 |
|---|---|---|
| PRD 상태 | approved | `10-approved`로 승격한다. |
| 다음 단계 | plan-wireframe | desktop/mobile 구조와 375px 정보 밀도를 확정한다. |
| 자동 반영 | 완료 | 상태 문서와 routing metadata를 `prd-reviewed`/`plan-wireframe` 기준으로 갱신한다. |
| 보류 피드백 | 있음 | LOW 2건은 Wireframe 단계에서 처리한다. |

## 7. 다음 단계

1. `/plan-wireframe .plans/prd/10-approved/f3-workflow-manual-section-prd.md`로 desktop/mobile 와이어프레임을 작성한다.
2. Wireframe에서 섹션 배치 위치, 단계별 정보 밀도, 375px 모바일 줄바꿈 기준을 확정한다.
