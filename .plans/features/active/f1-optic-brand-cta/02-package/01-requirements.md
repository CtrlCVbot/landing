# 01. Requirements - F1 브랜드, 로고, CTA 최소 반영

> 이 문서가 구현 요구사항의 SSOT다.

---

## 1. Functional Requirements

| ID | 요구사항 | Acceptance Criteria |
|---|---|---|
| REQ-BRAND-001 | `src/lib/constants.ts`에서 주 브랜드, 보조 브랜드, 서비스 URL, CTA label을 참조할 수 있다 | `OPTIC`, `OPTICS`, `https://mm-broker-test.vercel.app/`, `OPTIC 바로가기`, `도입 문의하기`가 상수로 존재 |
| REQ-BRAND-002 | desktop header에 서비스 확인 CTA와 문의 CTA가 모두 보인다 | `OPTIC 바로가기`와 `도입 문의하기`가 desktop action 영역에 렌더링 |
| REQ-BRAND-003 | `OPTIC 바로가기`는 외부 서비스 링크로 동작한다 | href는 서비스 URL, `target="_blank"`, `rel="noopener noreferrer"` |
| REQ-BRAND-004 | `도입 문의하기`는 문의 CTA로 유지된다 | href는 `#contact`, label은 기존 의미 유지 |
| REQ-BRAND-005 | mobile menu에도 두 CTA가 모두 보인다 | 메뉴 open 상태에서 `OPTIC 바로가기`, `도입 문의하기` 렌더링 |
| REQ-BRAND-006 | mobile menu CTA 클릭 시 메뉴가 닫힌다 | 각 CTA click 후 menu close 동작 유지 |
| REQ-BRAND-007 | Footer는 주 브랜드 `OPTIC`과 보조 표기 `Powered by OPTICS`를 유지한다 | `OPTICS`는 보조 문맥에서만 사용 |
| REQ-BRAND-008 | Logo 접근성 이름은 유지된다 | logo는 `OPTIC logo` 또는 동등한 접근성 이름을 가진다 |

## 2. Non-Functional Requirements

| ID | 기준 | 검증 |
|---|---|---|
| NFR-BRAND-001 | 신규 dependency 추가 없음 | `package.json` diff 없음 |
| NFR-BRAND-002 | DashboardPreview, Hero 구조 변경 없음 | forbidden path diff 없음 |
| NFR-BRAND-003 | 모바일 375px에서 CTA가 겹치지 않음 | browser 또는 screenshot review |
| NFR-BRAND-004 | 외부 링크 보안 속성 유지 | 테스트와 코드 리뷰 |
| NFR-BRAND-005 | 내부 검증성 문구를 고객 화면에 새로 노출하지 않음 | 문구 스캔 |

## 3. Open Gates

| 항목 | Severity | Action | 구현 전 처리 |
|---|---|---|---|
| 서비스 URL 공개 가능성 | medium | needs-verification | URL 노출 승인 또는 대체 URL 결정 |
| 로고 asset 최종 승인 | medium | queued | F1에서는 임시 로고 유지, F5에서 처리 |
| 모바일 CTA 배치 | low | queued | 구현 후 375px 기준 확인 |

## 4. Out of Scope

- Hero 구조 변경
- DashboardPreview 동작 변경
- workflow/manual 섹션 추가
- 카피 전면 교체
- 공식 도메인 전환
- 신규 로고 최종 승인
