# 04. Implementation Hints - F1 브랜드, 로고, CTA 최소 반영

> 이 문서는 구현 힌트다. 공식 TASK는 다음 단계 `/dev-feature .plans/features/active/f1-optic-brand-cta/`에서 확정한다.

---

## 1. 예상 TASK 분할

### T-BRAND-01 - 브랜드/CTA 상수 정리

**목표**: 브랜드명, 서비스 URL, CTA label을 `src/lib/constants.ts`에서 한 번에 참조할 수 있게 만든다.

**대상 파일**

| 파일 | 변경 |
|---|---|
| `src/lib/constants.ts` | `BRAND`, `CTA_LINKS` 또는 이에 준하는 상수 추가 |
| `src/__tests__/lib/constants.test.ts` | 상수 값과 URL을 검증하는 테스트 추가 또는 기존 위치에 병합 |

**완료 조건**

- [ ] 주 브랜드는 `OPTIC`
- [ ] 보조 브랜드는 `OPTICS`
- [ ] 서비스 URL은 `https://mm-broker-test.vercel.app/`
- [ ] `OPTIC 바로가기`, `도입 문의하기` label을 상수로 참조 가능

### T-BRAND-02 - Header desktop/mobile CTA 분리

**목표**: Header에서 서비스 확인 CTA와 문의 CTA를 분리한다.

**대상 파일**

| 파일 | 변경 |
|---|---|
| `src/components/sections/header.tsx` | desktop action 영역과 mobile menu에 `OPTIC 바로가기` 추가 |
| `src/components/sections/__tests__/header.test.tsx` | 외부 링크 속성, mobile menu 렌더, click close 검증 |

**완료 조건**

- [ ] desktop header에 `OPTIC 바로가기`와 `도입 문의하기`가 모두 보인다.
- [ ] mobile menu에 두 CTA가 모두 보이고 목적이 구분된다.
- [ ] `OPTIC 바로가기`는 `target="_blank"`와 `rel="noopener noreferrer"`를 가진다.
- [ ] mobile menu CTA 클릭 후 메뉴가 닫힌다.

### T-BRAND-03 - Footer/Logo 기준 유지

**목표**: `OPTIC` 주 표기와 `Powered by OPTICS` 보조 표기를 유지하고 접근성 이름을 확인한다.

**대상 파일**

| 파일 | 변경 |
|---|---|
| `src/components/sections/footer.tsx` | 브랜드 상수 참조, 보조 표기 유지 |
| `src/components/icons/optic-logo.tsx` | `aria-label`과 임시 logo 기준 확인 |
| `src/components/sections/__tests__/footer.test.tsx` | 주/보조 브랜드 노출 검증 |

**완료 조건**

- [ ] footer 주 브랜드는 `OPTIC`으로 보인다.
- [ ] `Powered by OPTICS`는 보조 표기로만 남는다.
- [ ] logo 접근성 이름이 유지된다.

### T-BRAND-04 - 검증과 responsive evidence

**목표**: 자동 검증과 최소 수동 검증으로 F1 범위를 닫는다.

**검증**

| 검증 | 기준 |
|---|---|
| `pnpm test -- header.test.tsx footer.test.tsx constants.test.ts` | 관련 테스트 통과 |
| `pnpm typecheck` | TypeScript 오류 없음 |
| `pnpm build` | production build 성공 |
| 수동 확인 | 1440px, 768px, 375px에서 header/mobile menu CTA 겹침 없음 |

## 2. Red-Green 힌트

1. 먼저 Header 테스트에서 `OPTIC 바로가기`가 없다는 실패를 만든다.
2. `constants.ts`에 브랜드/CTA 상수를 추가한다.
3. Header에 desktop/mobile CTA를 연결한다.
4. Footer/Logo 테스트를 추가하고 상수 참조로 정리한다.
5. 전체 검증 후 서비스 URL 공개 가능성 확인 항목을 release note에 남긴다.

## 3. 주의할 점

- `https://mm-broker-test.vercel.app/`는 고객 노출 가능성을 확인해야 한다. 불가하면 구현 전에 상수 값을 비활성/대체 URL로 바꿔야 한다.
- `서비스 테스트` 같은 내부 검증성 문구는 추가하지 않는다.
- DashboardPreview 관련 파일은 이 Feature 범위가 아니다.
