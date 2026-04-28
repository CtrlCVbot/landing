# Routing Metadata — f1-optic-brand-cta

| 항목 | 값 |
|---|---|
| Feature slug | `f1-optic-brand-cta` |
| IDEA | `IDEA-20260428-001` |
| Epic | `EPIC-20260428-001` |
| Epic 상태 | `planning` |
| Lane | `Lite` |
| Scenario | `A` |
| Feature type | `dev` |
| Hybrid | `false` |
| PRD required | `false` |
| Wireframe required | `false` |
| Stitch required | `false` |
| Recommended next | `/plan-bridge f1-optic-brand-cta` 또는 Lite dev handoff |

## 근거

- 변경 범위가 `src/lib/constants.ts`, `src/components/sections/header.tsx`, `src/components/sections/footer.tsx`, `src/components/icons/optic-logo.tsx`에 집중된다.
- 신규 API, DB, 인증, 외부 연동 호출은 없다.
- `OPTIC 바로가기`는 외부 URL 링크만 추가하며 실제 서비스 연동 로직은 포함하지 않는다.
- 로고 자산 승인과 Open Graph 적용은 F5 release readiness로 분리한다.

## 다음 게이트

1. 서비스 URL 공개 가능성 확인
2. Draft scope 확인
3. Lite dev handoff 또는 `/plan-bridge`
