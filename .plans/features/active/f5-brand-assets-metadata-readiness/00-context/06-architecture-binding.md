# F5 Architecture Binding

> **Architecture profile**: `.plans/project/00-dev-architecture.md`

## 적용 구조

| 영역 | 배치 |
|---|---|
| App metadata | `src/app/layout.tsx` |
| 브랜드/카피 상수 | `src/lib/constants.ts` |
| 로고 컴포넌트 | `src/components/icons/optic-logo.tsx` |
| 랜딩 섹션 | `src/components/sections/header.tsx`, `footer.tsx` |
| 정적 공개 자산 | `public/brand/**`, `public/favicon.svg` |
| 테스트 | `src/__tests__/**`, `src/components/sections/__tests__/**` |

## 제약

- Tailwind 4 구조를 유지하고 `tailwind.config.ts`를 새로 만들지 않는다.
- 신규 dependency를 추가하지 않는다.
- generated `out/`은 build 결과로만 갱신한다.
