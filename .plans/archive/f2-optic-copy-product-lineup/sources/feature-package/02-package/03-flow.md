# 03. Flow - F2 카피와 제품 라인업 정리

---

## 1. Landing Scroll Flow

```mermaid
flowchart TD
    A["Hero: OPTIC 브랜드와 오더-정산 약속"] --> B["Problems: 수작업과 누락 문제"]
    B --> C["Features: AI 오더 등록, 배차 단계 화물맨 연동, 정산 자동화, 세금계산서 관리"]
    C --> D["Products: 주선사용 / 화주용 서비스 구분"]
    D --> E["Integrations: 화물맨 외 provider명 일반화"]
    E --> F["Contact CTA"]
```

## 2. 주선사 업무 메시지 흐름

```mermaid
flowchart LR
    A["AI 오더 등록"] --> B["배차/운송 상태 추적"]
    B --> C["화물맨 연동"]
    C --> D["정산 자동화"]
    D --> E["세금계산서 관리"]
```

`화물맨 연동`은 C 단계다. 독립 제품, 정산 기능, 일반 provider 로고 나열로 처리하지 않는다.

## 3. Products Interaction Flow

```mermaid
flowchart TD
    A["Products section 진입"] --> B["구현 대상 2개 확인"]
    B --> C["주선사용 운송 운영 콘솔 / OPTIC Broker"]
    B --> D["화주용 운송 요청 포털 / OPTIC Shipper"]
    A --> E["구현 예정 compact 영역"]
    E --> F["OPTIC Carrier / Ops / Billing"]
```

## 4. F3 Handoff Flow

F2는 새 업무 매뉴얼형 섹션을 만들지 않는다. 다만 F3가 이어받을 흐름은 아래 순서로 고정한다.

1. 운영 방식 선택
2. AI 오더 등록
3. 상하차지 재사용
4. 배차 단계의 화물맨 연동
5. 정산 기준 적용
6. 세금계산서 확인
