# F5 Implementation Hints

- `src/lib/constants.ts`에 `BRAND_ASSETS`, `SITE_METADATA`를 추가하고 `layout.tsx`에서 재사용한다.
- `OpticLogo`는 텍스트만이 아니라 mark + wordmark 조합으로 만든다.
- `header.tsx`와 `footer.tsx`는 직접 텍스트 대신 `OpticLogo`를 사용한다.
- 외부 링크는 `target`과 `rel`을 상수에서 받아 적용한다.
- 테스트는 metadata, constants, header, footer에 집중한다.
- 문구 스캔은 고객 화면 상수와 `src/app/layout.tsx`를 대상으로 한다.
