# 02. UI Spec - F2 카피와 제품 라인업 정리

---

## 1. Features Section

| 항목 | 기준 | 연결 REQ |
|---|---|---|
| 섹션 제목 | `OPTIC이 제공하는 핵심 기능` 유지 가능, 필요 시 업무 결과 중심으로 보강 | `REQ-F2-003`, `REQ-F2-004` |
| 카드 구성 | 기존 3열 grid 유지 | `REQ-F2-010` |
| 필수 기능명 | `AI 오더 등록`, `화물맨 연동`, `정산 자동화`, `세금계산서 관리` | `REQ-F2-009` |
| 화물맨 위치 | 배차 단계 기능. `배차 관리`와 같은 흐름에 붙거나 별도 카드로 보여도 배차 문맥을 명시 | `REQ-F2-009`, `REQ-F2-011` |
| 피해야 할 표현 | `Google Gemini AI`, `팝빌`, `카카오 맵` 같은 provider명 전면 노출 | `REQ-F2-011` |

`화물맨 연동`은 정산/세금계산서 기능과 섞지 않는다. 설명 예시는 “배차 단계에서 운송 정보를 화물맨으로 이어 보내 중복 등록과 전송 누락을 줄입니다.”다.

## 2. Products Section

Wireframe 기준은 [screens.md](../../../../wireframes/f2-optic-copy-product-lineup/screens.md)를 따른다.

| 영역 | 표시 기준 | 연결 REQ |
|---|---|---|
| Broker title | `주선사용 운송 운영 콘솔` | `REQ-F2-006` |
| Broker label | `OPTIC Broker` 보조 라벨 | `REQ-F2-006` |
| Broker features | `AI 오더 등록`, `배차/운송 상태 추적`, `정산 자동화`, `세금계산서 관리` | `REQ-F2-007`, `REQ-F2-009` |
| Shipper title | `화주용 운송 요청 포털` | `REQ-F2-006` |
| Shipper label | `OPTIC Shipper` 보조 라벨 | `REQ-F2-006` |
| Upcoming | `OPTIC Carrier`, `OPTIC Ops`, `OPTIC Billing`은 `구현 예정`으로 낮춤 | `REQ-F2-008` |

기존 tab UI를 유지한다면 활성 tab은 Broker/Shipper만 허용한다. Carrier/Ops/Billing은 tab 밖의 muted list/card로 분리한다.

## 3. Problems Section

| 현재 방향 | 목표 방향 |
|---|---|
| 개별 provider와 기능 나열 | 수작업 감소, 전송 누락 방지, 정산 누락 방지 |
| `로지스엠/화물맨` 통합 연동 | 배차 단계의 `화물맨 연동` 또는 `배차 정보 전송` |
| `카카오 맵 통합 검색` | `주소/거리 계산` |

## 4. Integrations Section

| 항목 | 기준 |
|---|---|
| `화물맨` | 유지 가능. 단, 배차 정보 전송/중복 등록 감소 문맥으로 설명 |
| AI | provider명 대신 `AI 오더 등록` 또는 `주문서 자동 인식` |
| 지도 | provider명 대신 `주소/거리 계산` |
| 세금계산서 | provider명 대신 `세금계산서 관리` 또는 `전자세금계산서 관리` |

## 5. Responsive / A11y

| 항목 | 기준 |
|---|---|
| Mobile width | 375px에서 제목, 보조 라벨, badge, 버튼 텍스트 겹침 없음 |
| Product status | `구현 대상`, `구현 예정` 상태가 텍스트로도 읽힘 |
| Focus | clickable card/tab/button은 focus visible 유지 |
| Layout shift | hover/focus로 카드 크기 변경 없음 |
