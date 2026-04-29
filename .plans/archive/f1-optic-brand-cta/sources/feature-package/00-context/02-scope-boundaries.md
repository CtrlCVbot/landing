# 02. Scope Boundaries - F1 브랜드, 로고, CTA 최소 반영

> 구현 범위가 작기 때문에 이 문서의 In/Out 경계를 `/dev-feature`와 `/dev-run`의 기준으로 삼는다.

---

## 1. In Scope

| 영역 | 파일 | 허용 변경 |
|---|---|---|
| 브랜드/CTA 상수 | `src/lib/constants.ts` | `OPTIC`, `OPTICS`, 서비스 URL, CTA label 상수 추가 또는 정리 |
| Header CTA | `src/components/sections/header.tsx` | desktop action과 mobile menu에 `OPTIC 바로가기` 추가, 문의 CTA와 구분 |
| Footer 보조 표기 | `src/components/sections/footer.tsx` | `OPTIC` 주 표기와 `Powered by OPTICS` 보조 표기 기준 유지 |
| Logo 확인 | `src/components/icons/optic-logo.tsx` | 임시 로고 유지, 접근성 이름과 색상 토큰 필요성 확인 |
| Tests | `src/components/sections/__tests__/*.test.tsx`, `src/__tests__/lib/*.test.ts` | CTA href/target/rel, 모바일 menu 렌더, 상수 export 검증 |

## 2. Out of Scope

| 영역 | 이유 |
|---|---|
| Hero 구조 변경 | F1의 목적은 브랜드/CTA 최소 반영이며 Hero 재설계는 별도 visual improvement 범위 |
| DashboardPreview 동작 변경 | 현재 활성 작업과 충돌 가능성이 있어 F1에서는 touch 금지 |
| workflow/manual 섹션 추가 | F3 범위 |
| 카피 전면 교체 | F2 범위 |
| 공식 도메인 전환 | 서비스 URL 공개 가능성 확인 후 별도 결정 |
| 신규 로고 최종 승인 | F5 release gate로 유지 |

## 3. Deferred

| 항목 | 처리 시점 | 메모 |
|---|---|---|
| 로고 asset 최종 승인 | F5 release gate | F1은 기존 텍스트/SVG 기반 임시 로고를 유지 |
| 서비스 URL 공개 가능성 | 구현 전 gate | `https://mm-broker-test.vercel.app/` 고객 노출 가능성 확인 필요 |
| 모바일 CTA 최종 시각 검수 | 구현 검증 | 375px 기준 겹침과 목적 구분 확인 |

## 4. Scope Guard 메모

- `src/lib/mock-data.ts`, `src/lib/preview-steps.ts`, `src/components/dashboard-preview/**`는 F1에서 수정하지 않는다.
- 범위 밖 파일을 수정해야 하는 상황이 생기면 먼저 `06-architecture-binding.md`를 갱신하고 사용자 확인을 받는다.
- 문구 변경이 F2 카피 전면 교체로 커지면 F1을 멈추고 F2로 분리한다.
