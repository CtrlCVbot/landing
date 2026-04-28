# 10. Release Checklist - F2 Mock 스키마 재설계

---

## 1. 구현 완료 체크

| 항목 | 상태 |
|---|:---:|
| `PREVIEW_MOCK_SCENARIOS` 3개 이상 | [x] |
| `extractedFrame` / `appliedFrame` 분리 | [x] |
| deterministic default selector | [x] |
| randomizable scenario 3개 이상 | [x] |
| fixture-only scenario random pool 제외 | [x] |
| loop 시작 시 scenario random rotation | [x] |
| Step visibility helper | [x] |
| 추출 전 전체 대상 값 hidden/placeholder | [x] |
| `AI_APPLY` staged reveal timeline | [x] |
| order form `appliedFrame` 연결 | [x] |
| AI panel `extractedFrame` 연결 | [x] |
| `fare` / `estimate.amount` 정합성 테스트 | [x] |
| `jsonViewerOpen` 처리 결정 기록 | [x] |

---

## 2. 금지 경로 확인

| 경로 | 기대 |
|---|---|
| `src/components/dashboard-preview/hit-areas.ts` | 변경 없음 |
| `src/components/dashboard-preview/interactive-overlay.tsx` | 변경 없음 |
| `tailwind.config.ts` | 생성/수정 없음 |
| `package.json` | dependency 변경 없음 |

금지 경로 중 `hit-areas.ts`와 `interactive-overlay.tsx`는 F4 archive 범위에서 이미 처리된 파일이며, F2 구현에서는 추가 수정하지 않았다.

---

## 3. 검증

```bash
pnpm test src/__tests__/lib/mock-data.test.ts
pnpm test src/__tests__/lib/preview-steps.test.ts
pnpm test src/components/dashboard-preview/ai-register-main/order-form/__tests__/index.test.tsx
pnpm test src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/index.test.tsx
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

### 2026-04-27 실행 결과

| 검증 | 결과 | 메모 |
|---|---|---|
| `git diff --check` | PASS | whitespace error 없음 |
| `pnpm typecheck` | PASS | `tsc --noEmit` |
| `pnpm lint` | PASS with warnings | 기존 warning만 존재 |
| `pnpm test` | PASS | 45 files / 1039 tests |
| `pnpm build` | PASS | 병렬 실행 1회 transient failure 후 단독 재실행 통과 |

---

## 4. Archive 준비

- [x] TASK별 결과가 `08-dev-tasks.md`에 체크됨
- [x] 테스트 결과가 본 release checklist와 archive bundle에 남음
- [x] 주요 결정이 `00-context/02-decision-log.md`에 append됨
- [x] F3 착수에 필요한 fee source 기준이 명확함
- [x] `/plan-archive f2-mock-schema-redesign` 실행 가능 상태
- [x] `/plan-archive f2-mock-schema-redesign` 실행 완료 (2026-04-27)
