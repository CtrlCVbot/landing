# 06. Domain/Data Logic - F3 업무 매뉴얼형 스크롤 섹션 MVP

---

## 1. Data Model

권장 타입:

```ts
export type WorkflowStep = {
  id: 'ai-order' | 'locations' | 'dispatch-status' | 'hwamulman' | 'settlement' | 'invoice'
  order: number
  title: string
  description: string
  customization: readonly string[]
  handoff?: string
  statusLabel?: string
}
```

`handoff`, `statusLabel`은 F4가 이어받기 위한 확장 필드다. F3 UI가 사용하지 않더라도 data shape에는 남길 수 있다.

## 2. Data Invariants

| 규칙 | 이유 | 테스트 |
|---|---|---|
| step은 정확히 6개다 | PRD와 wireframe 고정 범위 | TC-F3-01 |
| `order`는 1부터 6까지 중복 없이 증가한다 | timeline 순서 보장 | TC-F3-01 |
| `id`는 stable union 안에 있다 | F4 handoff | TC-F3-01 |
| `hwamulman`은 order 4다 | 배차 단계 연동 기준 | TC-F3-03 |
| `settlement`, `invoice`는 별도 step이다 | 정산/세금계산서 분리 | TC-F3-03 |
| 모든 step은 customization을 가진다 | 커스텀 가능성 메시지 | TC-F3-02 |

## 3. Copy Logic

| 단계 | 카피 방향 |
|---|---|
| AI 오더 등록 | 다양한 요청 형식을 오더 정보로 정리 |
| 상하차지 관리 | 장소/담당자/현장 메모 재사용 |
| 배차/운송 상태 | 배차 진행과 운송 상태 확인 |
| 화물맨 연동 | 배차 단계에서 외부 채널로 정보 전송 |
| 정산 자동화 | 운송 완료 후 정산 기준 관리 |
| 세금계산서 관리 | 정산 이후 증빙 상태 관리 |

## 4. Guard Logic

구현자는 아래를 데이터와 UI에서 모두 피한다.

- 실제 API 호출처럼 보이는 문구
- 고객별 설정 저장 UI가 이미 있는 것처럼 보이는 문구
- 화물맨 배차 성공을 보장하는 문구
- 정산 또는 세금계산서 자동 발행 완료를 약속하는 문구

## 5. No Backend Logic

F3는 공개 랜딩의 설명 section이다.

| 항목 | 결정 |
|---|---|
| API route | 만들지 않음 |
| DB migration | 없음 |
| Server action | 없음 |
| External SDK | 없음 |
| Environment variable | 없음 |
