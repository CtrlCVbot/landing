# Wireframe Components: f2-optic-copy-product-lineup

> 제품 라인업 표시 구조와 copy-only 섹션의 컴포넌트 기준.

---

## 1. Component Spec

| 컴포넌트 | 타입 | 상태 | 동작 | PRD 요구사항 |
|---|---|---|---|---|
| ProductSectionHeading | Text block | default | products section의 목적 설명 | `REQ-F2-005`, `REQ-F2-006` |
| ImplementedProductCard | Card | default/hover/focus | 현재 구현 대상 제품 2개 표시 | `REQ-F2-007`, `REQ-F2-014` |
| ProductStatusBadge | Badge | implemented/upcoming | `구현 대상`, `구현 예정` 상태 표시 | `REQ-F2-007`, `REQ-F2-008` |
| ProductRoleTitle | Text | default | 한글 역할명을 1차 제목으로 표시 | `REQ-F2-007` |
| ProductCodeLabel | Text/Badge | default | `OPTIC Broker/Shipper` 보조 라벨 표시 | `REQ-F2-007` |
| ProductDescription | Text | default | 업무 방식, 요청 양식, 정산 기준 맞춤 설명 | `REQ-F2-006`, `REQ-F2-007` |
| ProductFeatureList | List | default | 2-3개 핵심 업무 가치 표시 | `REQ-F2-009`, `REQ-F2-014` |
| UpcomingProductList | Compact list/card | default | Carrier/Ops/Billing 구현 예정 표시 | `REQ-F2-008` |
| CopyOnlySection | Existing section | default | layout 유지, 문구만 교체 | `REQ-F2-009`, `REQ-F2-010`, `REQ-F2-011` |

---

## 2. Product Data Shape Hint

실제 구현에서 constants 구조를 바꾼다면 아래 개념을 보존한다.

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

필드명은 구현자가 repo convention에 맞게 바꿀 수 있지만, `title`과 `productLabel`의 역할은 분리되어야 한다.

---

## 3. State Rules

| 상태 | 시각 기준 | 접근성 기준 |
|---|---|---|
| implemented | 선명한 text, border, feature list | badge text가 screen reader에서도 읽힘 |
| upcoming | muted tone, compact text, no primary CTA | `구현 예정` 상태가 텍스트로 명시됨 |
| hover | border/elevation만 변경 | layout shift 없음 |
| focus | focus ring 또는 outline | keyboard focus visible |
| mobile | 1열 stack | 긴 제목이 줄바꿈되어도 카드 밖으로 넘치지 않음 |

---

## 4. Copy Rules

| 항목 | 사용 | 피함 |
|---|---|---|
| 제품 제목 | `주선사용 운송 운영 콘솔`, `화주용 운송 요청 포털` | `OPTIC Broker` 단독 제목 |
| 보조 라벨 | `OPTIC Broker`, `OPTIC Shipper` | 제품 의미를 설명 없이 영문명만 노출 |
| 구현 예정 | `구현 예정`, `로드맵` | 활성 탭, 주요 CTA |
| 외부 브랜드명 | `화물맨` | `Google Gemini AI`, `카카오 맵`, `팝빌` 전면 노출 |

---

## 5. PRD Mapping

| PRD ID | Wireframe 반영 |
|---|---|
| `REQ-F2-007` | ImplementedProductCard의 한글 제목 + 보조 라벨 |
| `REQ-F2-008` | UpcomingProductList |
| `REQ-F2-009` | ProductFeatureList와 Features copy 기준 |
| `REQ-F2-010` | Problems copy-only preservation |
| `REQ-F2-011` | Integrations copy-only preservation |
| `REQ-F2-014` | mobile stack, no overflow, focus state |
