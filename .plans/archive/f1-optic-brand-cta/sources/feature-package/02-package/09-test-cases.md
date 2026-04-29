# 09. Test Cases - F1 브랜드, 로고, CTA 최소 반영

---

## 1. Test Case 목록

| TC | REQ | 검증 대상 | 권장 명령 |
|---|---|---|---|
| TC-BRAND-01 | REQ-BRAND-001 | 브랜드/CTA 상수 값 | `pnpm test -- constants.test.ts` |
| TC-BRAND-02 | REQ-BRAND-002 | desktop header CTA 렌더링 | `pnpm test -- header.test.tsx` |
| TC-BRAND-03 | REQ-BRAND-003 | `OPTIC 바로가기` href/target/rel | `pnpm test -- header.test.tsx` |
| TC-BRAND-04 | REQ-BRAND-004 | `도입 문의하기` `#contact` 유지 | `pnpm test -- header.test.tsx` |
| TC-BRAND-05 | REQ-BRAND-005 | mobile menu CTA 렌더링 | `pnpm test -- header.test.tsx` |
| TC-BRAND-06 | REQ-BRAND-006 | mobile menu CTA click close | `pnpm test -- header.test.tsx` |
| TC-BRAND-07 | REQ-BRAND-007 | footer `OPTIC`/`OPTICS` 표기 | `pnpm test -- footer.test.tsx` |
| TC-BRAND-08 | REQ-BRAND-008 | logo 접근성 이름 | `pnpm test -- footer.test.tsx` 또는 logo test |

## 2. Red-Green 권장 순서

1. constants test에서 브랜드/CTA 상수 부재를 RED로 확인한다.
2. Header test에서 `OPTIC 바로가기` 부재와 외부 링크 속성 부재를 RED로 확인한다.
3. Footer/Logo test에서 주/보조 브랜드와 접근성 이름을 고정한다.
4. 구현 후 targeted tests를 GREEN으로 만든다.
5. `pnpm typecheck`, `pnpm build`로 전체 안정성을 확인한다.

## 3. Browser QA Matrix

| 상태 | Viewport | 확인 |
|---|---|---|
| desktop | 1440px | Header action group에 두 CTA가 구분되어 보임 |
| tablet | 768px | 메뉴 또는 header 전환 구간에서 CTA가 겹치지 않음 |
| mobile | 375px | mobile menu에서 CTA text overflow 없음 |
| keyboard | any | menu open/close button label 유지 |

## 4. Forbidden Diff Check

```bash
git diff --name-only -- src/components/dashboard-preview src/lib/mock-data.ts src/lib/preview-steps.ts src/app/globals.css package.json
```

기대 결과는 빈 출력이다.
