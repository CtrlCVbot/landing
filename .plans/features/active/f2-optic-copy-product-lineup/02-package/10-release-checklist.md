# 10. Release Checklist - F2 카피와 제품 라인업 정리

---

## 1. 구현 완료 체크

| 항목 | 상태 |
|---|:---:|
| `src/lib/constants.ts` copy/data 정리 | pending |
| Features 섹션에 배차 단계의 `화물맨 연동` 반영 | pending |
| Products 섹션 한글 역할명 우선 표시 | pending |
| Carrier/Ops/Billing 구현 예정 분리 | pending |
| Integrations provider명 일반화 | pending |
| F1 브랜드/CTA 회귀 확인 | pending |

## 2. 검증 체크

| 검증 | 상태 | 명령/근거 |
|---|:---:|---|
| Targeted tests | pending | `pnpm test -- constants products features integrations` |
| Full tests | pending | `pnpm test` |
| Typecheck | pending | `pnpm typecheck` |
| Lint | pending | `pnpm lint` |
| Build | pending | `pnpm build` |
| Copy scan | pending | 금지 문구, 제한 provider명, 필수 문구 scan |
| Browser spot check | pending | 1440px, 768px, 375px |

## 3. Release Guardrails

- DashboardPreview 관련 파일 diff가 없어야 한다.
- 신규 dependency가 없어야 한다.
- `화물맨`은 유지하되 배차 단계 기능으로 설명되어야 한다.
- `Google Gemini AI`, `카카오 맵`, `팝빌`, `로지스엠`은 customer-facing copy에서 전면 노출되지 않아야 한다.
- F2에서 F3 신규 업무 매뉴얼형 섹션을 만들지 않는다.

## 4. 다음 명령

```bash
/dev-run .plans/features/active/f2-optic-copy-product-lineup/
```
