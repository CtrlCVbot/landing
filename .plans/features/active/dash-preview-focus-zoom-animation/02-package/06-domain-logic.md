# Domain Logic: dash-preview-focus-zoom-animation

> **Feature**: Dash Preview Focus Zoom Animation
> **Requirements SSOT**: `01-requirements.md`
> **Flow**: `03-flow.md`
> **Created**: 2026-04-28

---

## 0. 이 문서의 역할

이 feature에는 업무 도메인 로직이 없다. 여기서 말하는 domain logic은 `DashboardPreview` 시각 상태를 결정하는 metadata, mode, timing 규칙이다.

API, DB, 권한, 실제 form submit은 scope 밖이다.

---

## 1. State Model

| 상태 축 | 값 | 설명 |
|---|---|---|
| `stepId` | `INITIAL`, `AI_INPUT`, `AI_EXTRACT`, `AI_APPLY` | 기존 `PREVIEW_STEPS` 기반 |
| `focusPhaseId` | `overview`, `input`, `extract`, `result`, `pickup`, `delivery`, `cargo`, `fare` | focus viewport가 볼 sub-phase |
| `viewport` | `desktop`, `tablet`, `mobile` | mobile은 focus zoom 적용 안 함 |
| `motionMode` | `normal`, `reduced` | reduced는 highlight-only |
| `interactionMode` | `cinematic`, `interactive` | interactive mode에서는 overlay 좌표 보호 우선 |

---

## 2. Focus Metadata Rule

focus metadata는 아래 중 하나로 구현할 수 있다.

| 옵션 | 설명 | 권장 |
|---|---|---|
| `src/lib/preview-steps.ts` 확장 | 기존 step/timing data와 같이 둔다. | 우선 |
| `src/lib/preview-focus.ts` 신규 | focus preset이 커질 때 분리한다. | 복잡도 증가 시 |

최소 데이터:

```ts
interface PreviewFocusPhase {
  readonly stepId: 'INITIAL' | 'AI_INPUT' | 'AI_EXTRACT' | 'AI_APPLY'
  readonly phaseId: string
  readonly targetId: string
  readonly desktop: FocusPreset
  readonly tablet?: FocusPreset
  readonly reducedMotion: 'highlight-only' | 'none'
}
```

---

## 3. Phase Selection Rule

| 조건 | phase |
|---|---|
| `stepId === 'INITIAL'` | `overview` |
| `stepId === 'AI_INPUT'` | `input` |
| `stepId === 'AI_EXTRACT'` and result not ready | `extract` |
| `stepId === 'AI_EXTRACT'` and result ready | `result` |
| `stepId === 'AI_APPLY'` early partial beat | `pickup`, `delivery`, `cargo`, `fare` 순서 |
| reduced motion | 같은 phase, transform 대신 highlight |
| mobile | phase 계산하지 않음 |

---

## 4. US-FZ-003 Mapping

| Phase | result target | form target | data relation |
|---|---|---|---|
| `pickup` | `result-departure` | `pickup-card` | 상차지 |
| `delivery` | `result-destination` | `delivery-card` | 하차지 |
| `cargo` | `result-cargo` | `cargo-card` 또는 `vehicle-card` | 화물 정보 |
| `fare` | `result-fare` | `fare-card` 또는 `estimate-card` | 운임 |

이 mapping은 user-facing order의 기준이다. 내부 field fill order가 달라져도 화면 표현은 이 순서를 유지한다.

---

## 5. Transform Composition Rule

`PreviewChrome`에는 이미 base scale이 있다. focus zoom은 base scale을 덮어쓰지 말고 별도 wrapper 또는 계산된 transform composition으로 다룬다.

| 레이어 | 책임 |
|---|---|
| Base scaled content | 전체 preview를 chrome 안에 맞춘다. |
| Focus viewport layer | 특정 target을 중심에 오게 한다. |
| Highlight layer | target border/shadow/opacity를 보여준다. |
| Overlay layer | interactive hit-area 좌표를 유지한다. |

---

## 6. Reduced Motion Rule

```ts
if (prefersReducedMotion) {
  return {
    transform: 'none',
    highlightOnly: true,
    durationMs: 0,
  }
}
```

Reduced motion은 feature disable이 아니다. 순서와 의미는 유지하고 큰 이동만 제거한다.

---

## 7. Mobile Rule

Mobile은 domain state 계산 대상이 아니다.

```tsx
if (isMobile) {
  return <MobileCardView />
}
```

`MobileCardView`는 수정하지 않는다. 필요한 것은 regression check뿐이다.

---

## 8. Invariants

| ID | invariant |
|---|---|
| `INV-FZ-001` | 모든 non-mobile step은 focus phase를 가진다. |
| `INV-FZ-002` | `AI_APPLY` phase order는 pickup → delivery → cargo → fare다. |
| `INV-FZ-003` | mobile path는 `MobileCardView`를 유지한다. |
| `INV-FZ-004` | reduced motion에서 큰 scale/translate는 발생하지 않는다. |
| `INV-FZ-005` | interactive overlay 좌표가 focus transform 때문에 어긋나면 안 된다. |
