# 10. Release Checklist - F2 카피와 제품 라인업 정리

---

## 1. 구현 완료 체크

| 항목 | 상태 |
|---|:---:|
| `src/lib/constants.ts` copy/data 정리 | done |
| Features 섹션에 배차 단계의 `화물맨 연동` 반영 | done |
| Products 섹션 한글 역할명 우선 표시 | done |
| Carrier/Ops/Billing 구현 예정 분리 | done |
| Integrations provider명 일반화 | done |
| F1 브랜드/CTA 회귀 확인 | done |

## 2. 검증 체크

| 검증 | 상태 | 명령/근거 |
|---|:---:|---|
| Targeted tests | done | `pnpm test -- constants products features integrations` |
| Full tests | done | `pnpm test` |
| Typecheck | done | `pnpm typecheck` |
| Lint | done | `pnpm lint` |
| Build | done | `pnpm build` |
| Copy scan | done | 금지 문구, 제한 provider명, 필수 문구 scan |
| Browser preview open | done | `http://localhost:3102/` returned `200` |

## 3. Release Guardrails

- DashboardPreview 관련 파일 diff가 없어야 한다.
- 신규 dependency가 없어야 한다.
- `화물맨`은 유지하되 배차 단계 기능으로 설명되어야 한다.
- `Google Gemini AI`, `카카오 맵`, `팝빌`, `로지스엠`은 customer-facing copy에서 전면 노출되지 않아야 한다.
- F2에서 F3 신규 업무 매뉴얼형 섹션을 만들지 않는다.

## 4. 다음 명령

```bash
/dev-verify .plans/features/active/f2-optic-copy-product-lineup/
```
