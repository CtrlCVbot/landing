# 06. Domain Logic - F2 카피와 제품 라인업 정리

---

## 1. Copy Data Rules

| 데이터 | 규칙 |
|---|---|
| Brand | 고객-facing 주 브랜드는 `OPTIC` |
| Auxiliary brand | `OPTICS`는 footer/About 또는 내부 엔진 보조 설명으로 제한 |
| Product title | 한글 역할명 우선 |
| Product label | `OPTIC Broker/Shipper`는 보조 라벨 |
| Product status | `implemented`, `upcoming` 또는 동등한 상태를 데이터로 구분 |
| External provider | `화물맨`만 고유명 예외, 나머지는 기능명으로 낮춤 |

## 2. Product Data Shape

구현 시 기존 `PRODUCTS` 구조를 확장하거나 교체할 수 있지만 아래 의미는 보존한다.

```ts
type ProductLineupItem = {
  key: 'broker' | 'shipper' | 'carrier' | 'ops' | 'billing'
  title: string
  productLabel: string
  target: string
  status: 'implemented' | 'upcoming'
  description: string
  features?: string[]
}
```

필드명은 repo convention에 맞게 바꿀 수 있다. 단, `title`과 `productLabel`의 역할은 섞지 않는다.

## 3. Feature Copy Rules

| 기능 | 카피 의미 |
|---|---|
| AI 오더 등록 | 반복 입력과 누락 감소 |
| 화물맨 연동 | 배차 단계에서 운송 정보를 외부 채널로 이어 보냄 |
| 정산 자동화 | 매출/매입 정산 흐름 자동화 |
| 세금계산서 관리 | 정산 이후 증빙 상태 관리 |

## 4. Runtime Non-Changes

- 실제 외부 API 호출은 추가하지 않는다.
- 내부 key(`gemini`, `kakao`, `popbill`, `logishm`)는 customer-facing copy와 분리해서 판단한다.
- DB, 인증, route, env는 변경하지 않는다.
- DashboardPreview mock data와 preview steps는 변경하지 않는다.
