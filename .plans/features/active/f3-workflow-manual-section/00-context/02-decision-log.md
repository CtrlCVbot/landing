# Decision Log: f3-workflow-manual-section

> F3 업무 매뉴얼형 스크롤 섹션 MVP의 승인 결정, 보류 결정, 구현 경계 기록.

---

## 1. Accepted Decisions

| ID | 결정 | 근거 | 영향 |
|---|---|---|---|
| `D-F3-001` | F3는 신규 landing section이다. | PRD와 Wireframe에서 신규 업무 매뉴얼형 섹션으로 정의 | `src/components/sections/workflow-manual.tsx` 중심 구현 |
| `D-F3-002` | 기본 배치는 Products 직후로 추천한다. | 제품 대상 이해 후 실제 업무 흐름을 보여주는 순서가 자연스러움 | `src/app/page.tsx` composition 기준 |
| `D-F3-003` | 6단계 흐름은 고정한다. | PRD, Draft, Wireframe 모두 같은 순서 사용 | 데이터 순서 테스트 필요 |
| `D-F3-004` | `화물맨 연동`은 배차 단계 기능이다. | 사용자 피드백과 F2 카피 기준 | 정산/세금계산서 단계와 섞지 않음 |
| `D-F3-005` | `정산 자동화`와 `세금계산서 관리`를 분리한다. | 사용자가 선호한 표현 기준과 PRD 요구사항 | 후반부 2단계로 구분 |
| `D-F3-006` | F3는 static MVP다. | F4가 애니메이션과 상태 mock 고도화 담당 | framer-motion 고도화는 F4로 보류 |
| `D-F3-007` | 커스텀 가능성은 운영 방식 조율 수준으로 표현한다. | tenant admin/설정 저장 구현 약속 방지 | 과장 표현 방지 테스트 또는 review 필요 |
| `D-F3-008` | Stitch는 생략한다. | visual design handoff가 아니라 dev feature package로 직행하는 Standard dev feature | 다음 단계는 `/dev-feature` |

---

## 2. Queued Follow-Ups

| 항목 | Severity | Confidence | Action | 처리 위치 |
|---|:---:|:---:|:---:|---|
| F4 애니메이션과 상태 mock | low | likely | queued | F4 업무 흐름 애니메이션과 상태 표현 |
| 실제 화물맨 전송 성공/오류 로그 표현 | low | likely | queued | F4 또는 후속 improvement |
| Open Graph/final release accessibility sweep | medium | likely | queued | F5 브랜드 자산, 메타데이터, 검증 정리 |

---

## 3. Explicit Non-Decisions

| 항목 | 이유 |
|---|---|
| 실제 API 연동 | F3는 공개 랜딩 static section이다. |
| tenant admin 또는 설정 저장 | 커스텀 가능성은 카피와 운영 방식 조율 메시지로만 표현한다. |
| 제품 라인업 구조 변경 | F2에서 이미 정리했으며 F3는 workflow section이다. |
| 스크롤 progress animation | F4에서 다룬다. |
| 신규 dependency 도입 | 현재 landing stack 안에서 구현 가능하다. |

---

## 4. Change Control

아래 변경은 F3 dev 진행 중 허용된다.

- 단계별 설명 문구의 세부 조정
- workflow data 파일명 선택 (`src/lib/landing-workflow.ts` 또는 constants extension)
- desktop layout의 split/timeline 세부 spacing 조정
- mobile card의 줄바꿈과 CTA stack 조정
- 단계 icon 선택

아래 변경은 별도 PRD revision 또는 사용자 확인이 필요하다.

- 6단계 순서 변경
- Products 직후가 아닌 다른 배치로 최종 변경
- 실제 API 연동 또는 live status UI 추가
- F2 제품 카드 구조 재설계
- F4 animation scope를 F3에 병합
