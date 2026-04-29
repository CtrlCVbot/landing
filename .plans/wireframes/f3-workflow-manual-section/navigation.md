# Wireframe Navigation: f3-workflow-manual-section

> F3는 단일 신규 섹션이므로 별도 페이지 전환이 아니라 landing scroll flow 안의 위치와 CTA 이동만 정의한다.

---

## 1. Landing Flow

```mermaid
flowchart TD
    A["Hero"] --> B["Problems / Features"]
    B --> C["Products: 주선사용 / 화주용 제품 구분"]
    C --> D["Workflow Manual: 6단계 업무 흐름"]
    D --> E["Integrations: 화물맨 등 연동 설명"]
    E --> F["Final CTA / Footer"]
```

## 2. Section Interaction Flow

```mermaid
flowchart TD
    A["Workflow section intro"] --> B["Step 01: AI 오더 등록"]
    B --> C["Step 02: 상하차지 관리"]
    C --> D["Step 03: 배차/운송 상태"]
    D --> E["Step 04: 화물맨 연동"]
    E --> F["Step 05: 정산 자동화"]
    F --> G["Step 06: 세금계산서 관리"]
    G --> H["Service CTA"]
    H -->|서비스 이동| I["OPTIC 바로가기"]
    H -->|문의| J["문의 CTA"]
```

## 3. Navigation Rules

| 항목 | 기준 |
|---|---|
| 섹션 위치 | 기본 추천은 Products 직후 |
| 내부 이동 | F3 MVP에서는 step tab이나 carousel 없이 자연 scroll |
| CTA | 기존 랜딩 CTA 정책을 재사용하고, 새 URL 정책은 만들지 않음 |
| keyboard | CTA가 있을 경우 DOM 순서대로 focus 이동 |
| reduced motion | scroll animation 없이도 전체 흐름 이해 가능 |

## 4. Out-of-Scope Navigation

- 단계별 상세 페이지 이동 없음
- tab/carousel로 단계 내용을 숨기지 않음
- 실제 서비스 화면 라우팅 설계 없음
- F4 이전에는 scroll progress animation 없음
