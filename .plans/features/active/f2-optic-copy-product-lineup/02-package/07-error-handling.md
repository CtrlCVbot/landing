# 07. Error Handling - F2 카피와 제품 라인업 정리

---

## 1. 사용자 오류 상태

F2는 정적 landing 카피 변경이므로 runtime error state를 새로 만들지 않는다.

## 2. 구현 중 방어 기준

| 항목 | 방어 기준 |
|---|---|
| 알 수 없는 icon key | 기존처럼 icon이 없으면 렌더 생략 또는 안전 fallback |
| 비어 있는 product features | 빈 목록이면 list 영역을 렌더하지 않거나 빈 상태를 만들지 않음 |
| upcoming product | primary CTA와 active tab으로 오인되지 않게 텍스트 상태 표시 |
| 긴 한글 문구 | CSS truncation보다 자연 줄바꿈 우선 |

## 3. 검증 실패 처리

| 실패 | 대응 |
|---|---|
| 금지 문구 스캔 실패 | constants와 section copy를 먼저 수정 |
| 외부 provider명 잔존 | customer-facing text인지 내부 key인지 분리해 판단 |
| product 상태 혼동 | 구현 대상과 구현 예정 표시를 데이터와 UI 양쪽에서 분리 |
| mobile overflow | 텍스트 축소보다 layout, 줄바꿈, card 구조를 먼저 조정 |
