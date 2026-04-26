# 10. Release Checklist - F4 레이아웃 정비 + Hit-Area 재정렬

---

## 1. 구현 완료 체크

| 항목 | 상태 |
|---|:---:|
| DateTime mobile 1열 유지 | [x] |
| DateTime md+ 2열 적용 | [x] |
| desktop 18 bounds 재측정 | [x] |
| tablet bounds 공유/분리 결정 | [x] |
| overlay anchor 적용/보류 결정 | [x] |
| hover/focus target 일치 | [x] |
| DOMRect 기반 hit-area 측정 적용 | [x] |
| 초기 측정 전 fallback hit-area 미렌더 | [x] |
| evidence table 갱신 | [x] |

---

## 2. 금지 경로 확인

| 경로 | 기대 |
|---|---|
| `src/lib/mock-data.ts` | 변경 없음 |
| `tailwind.config.ts` | 생성/수정 없음 |
| `package.json` | dependency 변경 없음 |

---

## 3. 검증

```bash
pnpm test src/components/dashboard-preview/__tests__/hit-areas.test.ts
pnpm test src/components/dashboard-preview/__tests__/interactive-overlay.test.tsx
pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/datetime-card.test.tsx
pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx
pnpm test src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/index.test.tsx
pnpm test src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx
pnpm test
pnpm typecheck
pnpm lint
git diff -- src/lib/mock-data.ts
```

### 2026-04-24 실행 결과

| 검증 | 결과 | 메모 |
|---|---|---|
| `pnpm test src/components/dashboard-preview/__tests__/interactive-overlay.test.tsx src/components/dashboard-preview/__tests__/dashboard-preview.test.tsx src/components/dashboard-preview/__tests__/hit-areas.test.ts src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/index.test.tsx` | PASS | 5 files, 132 tests |
| `pnpm test` | PASS | 45 files, 990 tests |
| `pnpm build` | PASS with warnings | route `/` first load JS 165 kB |
| `pnpm typecheck` | PASS | `tsc --noEmit` |
| `pnpm lint` | PASS with warnings | 기존 unused var / hook dependency / Next.js deprecated 경고 |
| Playwright browser spot check | PASS | 1440/1024/768 viewport, max delta 0~0.1px |
| `git diff -- src/lib/mock-data.ts tailwind.config.ts` | PASS | F4 금지 경로 변경 없음 |
| `git diff -- package.json` | pre-existing dirty | F4에서는 수정하지 않음. 현재 working tree에 `claude-kit` dependency diff 존재 |

---

## 4. Archive 준비

- [x] TASK별 결과가 `08-dev-tasks.md`에 체크됨
- [x] bounds evidence가 `03-dev-notes/hit-area-evidence.md`에 기록됨
- [x] overlay/tablet 결정이 `00-context/02-decision-log.md`에 append됨
- [x] DOMRect 우선 측정 결정이 `00-context/02-decision-log.md`에 append됨
- [x] 초기 측정 전 fallback hit-area 미렌더 결정이 `00-context/02-decision-log.md`에 append됨
- [x] F2와 충돌하는 파일 변경이 없음
- [x] `/plan-archive f4-layout-hit-area-realignment` 실행 가능 상태
- [x] 실제 브라우저에서 dash-preview hover/focus spot check
- [x] `/plan-archive f4-layout-hit-area-realignment` 실행 완료 (2026-04-27)
