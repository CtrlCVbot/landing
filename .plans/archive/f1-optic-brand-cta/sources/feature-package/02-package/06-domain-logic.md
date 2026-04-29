# 06. Domain Logic - F1 브랜드, 로고, CTA 최소 반영

> 이 Feature는 도메인 모델 변경이 없다. 아래는 presentation logic 기준이다.

---

## 1. Domain Impact

| 항목 | 영향 |
|---|---|
| DB | 없음 |
| API | 없음 |
| Auth | 없음 |
| Server action | 없음 |
| External integration | 외부 링크 이동만 있음 |

## 2. Presentation Rules

| 규칙 | 설명 |
|---|---|
| Brand source | 브랜드/CTA 값은 `src/lib/constants.ts`에서 참조 |
| Service CTA | `OPTIC 바로가기`는 외부 서비스 URL로 이동 |
| Inquiry CTA | `도입 문의하기`는 기존 `#contact` 문의 anchor |
| Mobile close | mobile menu CTA click 후 overlay close |
| Accessibility | logo와 menu buttons의 label 유지 |

## 3. State

| 상태 | 위치 | 변경 |
|---|---|---|
| `isMobileOpen` | `src/components/sections/header.tsx` | 기존 state 유지 |
| `isScrolled` | `src/components/sections/header.tsx` | 변경 없음 |
| `activeId` | `useScrollSpy` | 변경 없음 |

## 4. Error Handling

별도 runtime error handling은 없다.
서비스 URL 공개 불가 시 구현 전 상수 값을 조정하거나 service CTA를 비활성 처리하는 별도 결정이 필요하다.
