# Decision Log: f2-optic-copy-product-lineup

> F2 카피와 제품 라인업 정리의 승인 결정, 보류 결정, 구현 경계 기록.

---

## 1. Accepted Decisions

| ID | 결정 | 근거 | 영향 |
|---|---|---|---|
| `D-F2-001` | 고객 노출 주 브랜드는 `OPTIC` 유지 | F1에서 고정한 브랜드 기준 | 본문 섹션과 CTA 카피 정렬 |
| `D-F2-002` | `OPTICS`는 내부 엔진 또는 보조 표기로 제한 | 고객이 주 서비스명을 혼동하지 않게 함 | footer/About 또는 보조 설명만 허용 |
| `D-F2-003` | 제품 카드 제목은 한글 역할명 우선 | `OPTIC Broker/Shipper`만으로 사용자가 역할을 알기 어려움 | `주선사용 운송 운영 콘솔`, `화주용 운송 요청 포털`이 1차 제목 |
| `D-F2-004` | 영문 제품명은 보조 라벨로 병기 | 브랜드 학습은 유지하되 이해 속도를 높임 | `OPTIC Broker`, `OPTIC Shipper`는 subtitle/badge/label 성격 |
| `D-F2-005` | `Carrier/Ops/Billing`은 구현 예정으로 분리 | 현재 구현 대상은 Broker/Shipper 두 가지 | 활성 제품처럼 보이면 안 됨 |
| `D-F2-006` | `화물맨`만 외부 플랫폼 고유명으로 유지 | 사용자에게 실제 연동 맥락이 중요함 | AI/지도/세금계산서는 일반 기능명으로 낮춤 |
| `D-F2-007` | Wireframe은 작성, Stitch는 생략 | 제품 라인업 표시 구조가 구현에 직접 영향을 주므로 P5 wireframe을 추가했고, visual design handoff는 아니므로 Stitch는 생략 | 다음 단계는 `/dev-feature` |
| `D-F2-008` | F3 신규 업무 섹션은 별도 Feature | F2와 F3 설명 중복 방지 | F2는 카피 기준과 handoff만 남김 |
| `D-F2-009` | `화물맨 연동`은 Features의 배차 단계 기능으로 추가 | 사용자 피드백에 따라 화물맨은 배차 흐름의 핵심 연동으로 설명해야 함 | features copy와 integrations copy의 역할을 분리 |

---

## 2. Queued Follow-Ups

| 항목 | Severity | Confidence | Action | 처리 위치 |
|---|---|---|---|---|
| 접근성 label 세부 기준 | medium | likely | queued | F2 dev package 또는 F5 |
| Hero `데모 보기` CTA 처리 | low | likely | queued | F2 copy map 또는 dev task |
| `Carrier/Ops/Billing` 표시 방식 | medium | likely | needs-verification | 구현 시 제품 섹션 디자인에서 활성/예정 상태 구분 |
| 긴 한글 제목 overflow | medium | likely | needs-verification | desktop/mobile browser spot check |

---

## 3. Explicit Non-Decisions

| 항목 | 이유 |
|---|---|
| 실제 화주/주선사별 설정 UI | F2는 카피 기준 정리이며 tenant admin 구현 범위가 아니다. |
| 제품별 실제 route/권한 정책 | product card 표현과 실제 product routing은 분리한다. |
| `OPTIC Carrier/Ops/Billing` 출시 시점 | F2에서는 구현 예정으로만 표시하고 roadmap 상세는 별도 결정한다. |
| F3 workflow section layout | F3 신규 Feature에서 결정한다. |
| 외부 AI/지도/세금계산서 provider 교체 | customer-facing copy 정리와 runtime provider 변경은 별도다. |

---

## 4. Change Control

아래 변경은 F2 dev 진행 중 허용된다.

- 한글 제품 카드 제목의 세부 문구 조정
- `OPTIC Broker/Shipper` 보조 라벨의 badge, subtitle, eyebrow 중 표현 방식 선택
- `Carrier/Ops/Billing` 구현 예정 표시 위치와 wording 조정
- 외부 브랜드명을 일반 기능명으로 낮추는 문구 세부안 조정
- 테스트에서 문구 스캔 패턴을 더 명확히 나누는 작업

아래 변경은 별도 PRD revision 또는 사용자 확인이 필요하다.

- `Carrier/Ops/Billing`을 활성 제품으로 구현
- 새로운 제품 라인업 추가
- 실제 외부 API, DB, 인증, tenant admin 구현
- DashboardPreview 핵심 동작 변경
- F3 업무 매뉴얼형 신규 섹션을 F2에 병합
