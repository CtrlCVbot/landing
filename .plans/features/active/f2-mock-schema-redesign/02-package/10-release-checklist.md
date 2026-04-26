# 10. Release Checklist - F2 Mock 스키마 재설계

---

## 1. 구현 완료 체크

| 항목 | 상태 |
|---|:---:|
| `PREVIEW_MOCK_SCENARIOS` 3개 이상 | [ ] |
| `extractedFrame` / `appliedFrame` 분리 | [ ] |
| deterministic default selector | [ ] |
| Step visibility helper | [ ] |
| order form `appliedFrame` 연결 | [ ] |
| AI panel `extractedFrame` 연결 | [ ] |
| `fare` / `estimate.amount` 정합성 테스트 | [ ] |
| `jsonViewerOpen` 처리 결정 기록 | [ ] |

---

## 2. 금지 경로 확인

| 경로 | 기대 |
|---|---|
| `src/components/dashboard-preview/hit-areas.ts` | 변경 없음 |
| `src/components/dashboard-preview/interactive-overlay.tsx` | 변경 없음 |
| `tailwind.config.ts` | 생성/수정 없음 |
| `package.json` | dependency 변경 없음 |

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
```

---

## 4. Archive 준비

- [ ] TASK별 결과가 `08-dev-tasks.md`에 체크됨
- [ ] 테스트 결과가 최종 보고에 남음
- [ ] 주요 결정이 `00-context/02-decision-log.md`에 append됨
- [ ] F3 착수에 필요한 fee source 기준이 명확함
- [ ] `/plan-archive f2-mock-schema-redesign` 실행 가능 상태
