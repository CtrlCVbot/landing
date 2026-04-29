# Wireframe Navigation: f2-optic-copy-product-lineup

> F2는 신규 page route를 만들지 않는다. 기존 landing page scroll flow 안에서 products section의 정보 구조만 보강한다.

---

## 1. Page Flow

```mermaid
flowchart TD
    Hero["Hero: OPTIC 브랜드와 CTA"]
    Problems["Problems: 수작업과 누락 문제"]
    Features["Features: 업무 결과 중심 기능"]
    Products["Products: 주선사용/화주용 제품 구분"]
    Current["현재 구현 대상: Broker/Shipper"]
    Upcoming["구현 예정: Carrier/Ops/Billing"]
    Integrations["Integrations: 화물맨 중심 연동"]
    CTA["CTA/Contact"]

    Hero --> Problems
    Problems --> Features
    Features --> Products
    Products --> Current
    Products --> Upcoming
    Current --> Integrations
    Upcoming --> Integrations
    Integrations --> CTA
```

---

## 2. Interaction Flow

```mermaid
flowchart LR
    User["방문자"] --> Scan["제품 섹션 진입"]
    Scan --> Role{"내 역할은?"}
    Role -->|주선사| Broker["주선사용 운송 운영 콘솔 / OPTIC Broker"]
    Role -->|화주| Shipper["화주용 운송 요청 포털 / OPTIC Shipper"]
    Role -->|운송사/운영/정산| Upcoming["구현 예정 목록 확인"]
    Broker --> CTA["도입 문의 또는 OPTIC 바로가기"]
    Shipper --> CTA
    Upcoming --> CTA
```

---

## 3. Navigation Rules

| 항목 | 규칙 |
|---|---|
| Route | 새 route 없음. 기존 landing page 내부 section anchor 유지 |
| Products tab | 기존 tab UI를 유지해도 되지만 활성 제품은 Broker/Shipper만 두고, 구현 예정은 별도 영역으로 분리 |
| Upcoming item | 활성 제품 CTA처럼 보이면 안 됨 |
| CTA | F1의 `OPTIC 바로가기`와 `도입 문의하기` 목적을 깨지 않음 |
| Keyboard | 제품 카드나 CTA가 focusable이면 focus order는 Broker → Shipper → Upcoming → CTA 순서 |

---

## 4. Scroll Anchor Impact

| Anchor | 변경 |
|---|---|
| `#features` | 유지 |
| `#products` | 유지, 내부 레이아웃만 변경 |
| `#integrations` | 유지 |
| `#contact` | 유지 |
