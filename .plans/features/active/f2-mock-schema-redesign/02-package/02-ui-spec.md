# 02. UI Spec - F2 Mock 스키마 재설계

---

## 1. UI 원칙

F2의 UI 목표는 새 화면을 추가하는 것이 아니라, 기존 dash-preview가 단계별로 "읽은 값"과 "적용된 값"을 다르게 보여주도록 source를 분리하는 것이다.

| 영역 | 기준 source | 사용자에게 보이는 의미 |
|---|---|---|
| AI panel/result | `extractedFrame` | AI가 원문에서 읽어낸 값 |
| Order form | `appliedFrame` | 사용자가 적용 버튼 이후 확인하는 값 |
| Estimate info | `appliedFrame` + Step visibility | 적용 이후 확정된 예상 운임/거리/시간 |
| Settlement section | `appliedFrame` + Step visibility | 적용 이후 계산 가능한 정산 정보 |

---

## 2. Step Visibility

| Step | AI panel | Order form | Estimate | Settlement |
|---|---|---|---|---|
| 초기/입력 전 | 기본 placeholder | 빈 값 또는 기존 pending state | 숨김 | 숨김 |
| `AI_EXTRACT` | `extractedFrame` 표시 | 아직 적용 전 상태 유지 | 숨김 | 숨김 |
| `AI_APPLY` 이후 | 추출 결과 유지 | `appliedFrame` 반영 | 표시 | 표시 |
| 완료/등록 성공 | 적용 결과 유지 | 적용 결과 유지 | 표시 | 표시 |

구현은 기존 Step enum이나 step id를 우선 사용한다. 새 step을 추가하지 않고 visibility helper로 파생하는 방식을 기본값으로 둔다.

---

## 3. Scenario UI

| 항목 | 결정 |
|---|---|
| User-facing selector | MVP 제외 |
| Test selector/helper | 허용 |
| Default scenario | deterministic helper로 고정 |
| Scenario count | 최소 3개 (`default`, `partial`, `mismatch-risk`) |

`partial`과 `mismatch-risk`는 QA와 테스트를 위한 상태다. landing 첫 화면에 별도 컨트롤을 노출하지 않는다.

---

## 4. 표시 안정성

- 완성값은 적용 전 단계에서 먼저 노출하지 않는다.
- 값이 비어 있는 scenario에서는 `undefined`나 raw object가 화면에 노출되지 않아야 한다.
- 기존 tooltip, animation, theme token은 변경하지 않는다.
- F4가 다루는 overlay 위치와 hit-area 좌표에는 손대지 않는다.
