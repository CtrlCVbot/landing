# 02. Decision Log - F1 브랜드, 로고, CTA 최소 반영

> 구현 중 새 결정이 생기면 `D-BRAND-###` 형식으로 append-only 추가한다.

---

## D-BRAND-001 - Lite lane에서 PRD/Wireframe/Stitch 생략

| 항목 | 값 |
|---|---|
| 상태 | accepted |
| 날짜 | 2026-04-28 |
| 근거 | Scope Review Approve |

변경 범위가 `constants`, `Header`, `Footer`, `OpticLogo`, tests에 한정되어 있다.
제품/화면 구조 변경이 아니므로 Draft + Scope Review를 PRD 대체 기준으로 동결한다.

## D-BRAND-002 - 주 브랜드는 `OPTIC`, 보조 표기는 `OPTICS`

| 항목 | 값 |
|---|---|
| 상태 | accepted |
| 날짜 | 2026-04-28 |
| 근거 | final-prompt-package 브랜드 가이드와 Draft |

고객 화면에서 기억해야 할 주 브랜드는 `OPTIC`이다.
`OPTICS`는 footer/About 수준의 `Powered by OPTICS` 보조 표기로만 남긴다.

## D-BRAND-003 - `OPTIC 바로가기`는 서비스 확인 CTA

| 항목 | 값 |
|---|---|
| 상태 | accepted |
| 날짜 | 2026-04-28 |
| 근거 | Draft R2, R5-R8 |

`OPTIC 바로가기`는 `https://mm-broker-test.vercel.app/`로 이동하는 외부 링크 CTA다.
`도입 문의하기`는 기존 `#contact` 문의 CTA로 유지한다.

## D-BRAND-004 - 서비스 URL 공개 가능성은 구현 전 gate

| 항목 | 값 |
|---|---|
| 상태 | verified |
| 날짜 | 2026-04-28 |
| 근거 | Scope Review 조건부 확인 사항 |

`https://mm-broker-test.vercel.app/`는 2026-04-28 `/dev-run` 중 실제 페이지 응답을 확인했다.
CTA는 이 URL을 그대로 사용한다.

## D-BRAND-005 - DashboardPreview와 Hero는 수정하지 않음

| 항목 | 값 |
|---|---|
| 상태 | accepted |
| 날짜 | 2026-04-28 |
| 근거 | Scope Boundaries |

현재 F1은 브랜드/CTA 최소 반영 작업이다.
Hero 구조, DashboardPreview 동작, workflow 섹션은 각각 별도 Feature 범위로 유지한다.

## D-BRAND-006 - 모바일 menu CTA는 세로 action group으로 배치

| 항목 | 값 |
|---|---|
| 상태 | accepted |
| 날짜 | 2026-04-28 |
| 근거 | 375px browser QA |

mobile menu에서 `OPTIC 바로가기`와 `도입 문의하기`를 같은 폭의 세로 action group으로 배치한다.
375px viewport에서 두 CTA의 bounding box가 겹치지 않음을 확인했다.
