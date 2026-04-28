# 04. Implementation Hints — F4 레이아웃 정비 + Hit-Area 재정렬

> 구현자를 위한 힌트 문서다. 공식 TASK ID와 순서는 `/dev-feature`에서 확정한다.

---

## 1. 예상 TASK 분할

| 예상 TASK | 목표 | 주요 파일 |
|---|---|---|
| T-F4-LAYOUT-01 | DateTime 2열 layout 적용 | `order-form/index.tsx`, `datetime-card.tsx`, 관련 tests |
| T-F4-HITAREA-02 | desktop 18 bounds 재측정 | `hit-areas.ts`, `hit-areas.test.ts` |
| T-F4-TABLET-03 | tablet 공유/분리 판정 | `hit-areas.ts`, evidence note |
| T-F4-OVERLAY-04 | overlay anchor 적용/보류 결정 | `interactive-overlay.tsx`, overlay tests |
| T-F4-QA-05 | evidence 정리 + regression 검증 | `03-dev-notes/**`, 관련 tests |

## 2. 권장 실행 순서

1. `DateTimeCard` layout 변경 테스트를 먼저 작성한다.
2. layout 변경 후 desktop bounds를 재측정한다.
3. tablet viewport evidence를 수집하고 공유/분리 결정을 기록한다.
4. overlay anchor를 기존 방식과 Proposal A로 비교한다.
5. 관련 test subset과 전체 `pnpm test`를 실행한다.

## 3. 검증 힌트

```bash
pnpm test src/components/dashboard-preview/__tests__/hit-areas.test.ts
pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/datetime-card.test.tsx
pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx
pnpm test src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx
```

필요 시 구현 완료 후 전체 검증:

```bash
pnpm test
pnpm typecheck
pnpm lint
```

## 4. Evidence 힌트

`03-dev-notes/hit-area-evidence.md` 같은 파일을 만들어 아래 정보를 남긴다.

| viewport | target count | max delta | 판정 |
|---|---:|---:|---|
| 1440 desktop | 18 | TBD | TBD |
| 768 tablet | 18 | TBD | 공유/분리 결정 |

## 5. 주의

- `mock-data.ts`는 건드리지 않는다.
- layout 변경과 bounds 변경을 같은 커밋에 크게 섞지 않는다.
- 좌표값만 바꾸고 evidence를 남기지 않으면 PRD review의 medium 피드백이 해소되지 않는다.
