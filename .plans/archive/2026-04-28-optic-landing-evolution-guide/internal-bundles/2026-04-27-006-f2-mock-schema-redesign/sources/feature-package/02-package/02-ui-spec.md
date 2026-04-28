# 02. UI Spec - F2 Mock 스키마 재설계

---

## 1. UI 원칙

F2의 UI 목표는 새 화면을 추가하는 것이 아니라, 기존 dash-preview가 단계별로 "읽은 값"과 "적용된 값"을 다르게 보여주도록 source를 분리하는 것이다.

| 영역 | 기준 source | 사용자에게 보이는 의미 |
|---|---|---|
| AI panel/result | `extractedFrame` | AI가 원문에서 읽어낸 값 |
| CompanyManager | 기존 고정 mock | 추출 전에도 이미 선택된 거래처/담당자 |
| Order form | `appliedFrame` + reveal state | 사용자가 적용 버튼 이후 확인하는 값 |
| Estimate info | `appliedFrame` + `estimateAt` | 상/하차지 적용 이후 확정되는 예상 운임/거리/시간 |
| Settlement section | `appliedFrame` + `settlementAt` | 운임 적용 이후 계산 가능한 정산 정보 |

---

## 2. Step Visibility

| Step | AI panel | Order form | Estimate | Settlement |
|---|---|---|---|---|
| 초기/입력 전 | 기본 placeholder | CompanyManager만 pre-filled, 추출 대상은 placeholder | placeholder | placeholder |
| `AI_INPUT` | 입력 진행 | CompanyManager만 pre-filled, 추출 대상은 placeholder | placeholder | placeholder |
| `AI_EXTRACT` | `extractedFrame` 표시 | 아직 적용 전 상태 유지 | placeholder | placeholder |
| `AI_APPLY` 진입 | 추출 결과 유지 | `formRevealTimeline` 기준 순차 적용 | `estimateAt` 이후 표시 | `settlementAt` 이후 표시 |
| 완료/등록 성공 | 적용 결과 유지 | 적용 결과 유지 | 표시 | 표시 |

구현은 기존 4-dot Step 구조를 유지한다. 새 Step을 추가하지 않고 `AI_APPLY` 내부의 `formRevealTimeline`으로 표시 타이밍만 세분화한다.

### `AI_APPLY` 내부 reveal timeline

| 파트 | trigger | 표시 기준 |
|---|---:|---|
| 상차지 + 상차일시 | `pickupAt: 0ms` | 즉시 적용 |
| 하차지 + 하차일시 | `deliveryAt: 650ms` | 상차지 이후 적용 |
| 예상 운임/거리/시간 | `estimateAt: 900ms` | 상/하차지 적용 직후 표시 |
| 화물/차량 | `cargoAt: 1300ms` | cargo category 적용 시 표시 |
| 운송 옵션 | `optionsAt: 1300ms` | `formData.options` 기준 checked 표시 |
| 운임 category | `fareAt: 1950ms` | 정산 적용 전 AI result beat |
| 정산 정보 | `settlementAt: 2200ms` | 운임 적용 이후 표시 |

---

## 3. Scenario UI

| 항목 | 결정 |
|---|---|
| User-facing selector | MVP 제외 |
| Test selector/helper | 허용 |
| Random preview | Step loop가 마지막 Step에서 Step 1로 돌아올 때 randomizable scenario 선택 |
| 연속 중복 방지 | `excludeId`로 직전 scenario 제외 |
| Demo-safe scenario | `default`, `regional-cold-chain`, `short-industrial-hop` |
| Fixture-only scenario | `partial`, `mismatch-risk` |
| Scenario count | 총 5개, randomizable 3개 |

`partial`과 `mismatch-risk`는 QA와 테스트를 위한 상태다. landing 첫 화면에 별도 컨트롤을 노출하지 않는다.

---

## 4. 표시 안정성

- 완성값은 적용 전 단계에서 먼저 노출하지 않는다.
- `LocationForm`, `DateTimeCard`, `CargoInfoForm`, `TransportOptionCard`, `EstimateInfoCard`, `SettlementSection`은 숨김 상태에서 실제 mock 값을 렌더하지 않는다.
- placeholder는 `—`, `선택 전`, `측정 전`, `적용 전` 계열로 통일한다.
- 값이 비어 있는 scenario에서는 `undefined`나 raw object가 화면에 노출되지 않아야 한다.
- 기존 tooltip, animation, theme token은 변경하지 않는다.
- F4가 다루는 overlay 위치와 hit-area 좌표에는 손대지 않는다.
