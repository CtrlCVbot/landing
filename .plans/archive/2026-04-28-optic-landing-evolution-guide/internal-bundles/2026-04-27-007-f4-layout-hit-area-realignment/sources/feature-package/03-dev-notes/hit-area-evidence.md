# F4 Hit-Area Evidence

> 구현 중 bounds 측정 결과를 누적한다. 좌표값만 변경하지 말고 이 표를 같이 갱신한다.

---

## Viewport Evidence

| viewport | target count | max delta | 판정 | 메모 |
|---|---:|---:|---|---|
| 1440 desktop | 18 | 0.1px | pass | 브라우저 spot check. static bounds는 측정 완료 후 fallback으로만 유지 |
| 1024 desktop | 18 | 0.1px | pass | 사용자 제보 스크린샷과 가까운 폭에서 hover tooltip center delta 0~0.1px |
| 768 tablet | 18 | 0px | pass | `TABLET_HIT_AREAS = DESKTOP_HIT_AREAS`는 metadata 공유. 실제 위치는 viewport별 DOMRect 측정 |
| 390 mobile | N/A | N/A | pass by layout contract | mobile은 `MobileCardView` 경로라 interactive overlay 미렌더. DateTime wrapper는 `grid-cols-1` 유지 |

---

## Anchor Decision

| 항목 | 값 |
|---|---|
| Proposal A (`ScaledContent` 내부 anchor) | 적용 |
| 기존 anchor 유지 여부 | 미유지 |
| decision log entry | D-F4-009, D-F4-010, D-F4-011 |

---

## 측정 메모

- target id 18개 유지 여부: 유지. F5에서 `ai-json-viewer` 제거된 상태를 되살리지 않음.
- desktop bounds source: `data-hit-area-id` target DOMRect + static fallback unit test.
- tablet bounds source: `data-hit-area-id` target DOMRect + static fallback unit test.
- hover/focus target 일치 여부: `dashboard-preview.test.tsx` regression으로 확인.
- browser spot check: 2026-04-27, `desktop-1440` / `desktop-1024` / `tablet-768`에서 target 18개와 hit-area 18개 모두 매칭. hover sample(`form-pickup-location`, `form-delivery-location`, `form-cargo-info`, `form-estimate-info`, `ai-input`)은 hit target delta 0~0.1px, tooltip center delta 0~0.1px.
