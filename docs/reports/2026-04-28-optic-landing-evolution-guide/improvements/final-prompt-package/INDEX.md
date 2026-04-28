# OPTIC Landing Final Prompt Package

> 작성일: 2026-04-28
> 목적: 최종 프롬프트를 실제 문서 패키지로 전환한다.
> 범위: 분석/기획/카피/구현 가이드 문서만 작성한다. 실제 코드 수정은 하지 않는다.

## 패키지 구성

| 순서 | 문서 | 역할 |
| ---: | --- | --- |
| 0 | [00-brand-application-guide.md](00-brand-application-guide.md) | OPTIC/OPTICS 브랜드 v1.0 적용 기준 |
| 1 | [01-service-context-and-current-state.md](01-service-context-and-current-state.md) | 참고 문서 기반 서비스 이해, 현재 랜딩 진단 |
| 2 | [02-improvement-options.md](02-improvement-options.md) | 랜딩 개선 콘셉트 5안 비교 |
| 3 | [03-animation-section-manual.md](03-animation-section-manual.md) | 기능별 애니메이션, hero 이후 섹션 구조 |
| 4 | [04-copy-and-cta-guide.md](04-copy-and-cta-guide.md) | 문구 개선안, 상단 헤더 실제 서비스 이동 CTA |
| 5 | [05-final-recommendation-and-review.md](05-final-recommendation-and-review.md) | 최종 추천안, MVP/확장 범위, self-review |
| 6 | [06-logo-asset-application-guide.md](06-logo-asset-application-guide.md) | 제공 이미지 기반 OPTIC 로고 자산 적용 기준 |
| 7 | [07-implementation-roadmap.md](07-implementation-roadmap.md) | 실제 코드 반영을 위한 phase별 구현 로드맵 |

## 최종 반영된 프롬프트 변경점

| 항목 | 반영 내용 |
| --- | --- |
| 브랜드명 | `Optic Cargo`가 아니라 `OPTIC` 기준으로 정리 |
| 브랜드 아키텍처 | 고객 노출은 `OPTIC`, 내부 엔진/기술 레이어는 `OPTICS`로 분리 |
| hero | 현재 hero와 AI 오더 등록 애니메이션 방향은 유지 |
| hero 이후 | 상하차지 관리, 화물맨 연동, 매출 정산 번들화, 세금계산서 발행을 매뉴얼형 스크롤로 제안 |
| CTA | `서비스 테스트` 표현은 제외하고, 실제 서비스 이동 버튼으로 정리 |
| 서비스 URL | `https://mm-broker-test.vercel.app/`를 OPTIC 주선사/화주 실제 서비스 진입 링크로 반영 |
| 언어 정책 | `Cargo` 중심 표현을 줄이고 `order/transport/coordination` 중심으로 정리 |
| 로고 자산 | 제공 이미지 `ChatGPT Image 2026년 4월 28일 오후 03_23_39.png`를 OPTIC 로고 작업 기준 이미지로 반영 |
| 구현 로드맵 | 브랜드/CTA/로고/업무 매뉴얼형 섹션/검증을 phase별 실행 순서로 정리 |
| 산출물 성격 | 코드 수정 없이 랜딩 개선 계획과 구현 가이드 문서로 작성 |

## 주요 참고 근거

| 근거 문서 | 사용한 내용 |
| --- | --- |
| `.references/code/mm-broker/.plans/guide/domain-guide/address-domain-snapshot-strategy.md` | 상차지/하차지 주소 도메인, 반복 주소 관리 |
| `.references/code/mm-broker/.plans/guide/domain-guide/order-domain-model.md` | 화주, 주선사, 배차, 운송 완료, Charge 흐름 |
| `.references/code/mm-broker/.plans/guide/domain-guide/order-flow-guide.md` | 운송요청부터 운송완료까지 상태 전이 |
| `.references/code/mm-broker/.plans/guide/domain-guide/charge-domain-guide.md` | 매출/매입, 마진, 정산, 세금계산서 |
| `.references/code/mm-broker/.plans/guide/domain-guide/settlement-process-guide.md` | SalesBundle, PurchaseBundle, 묶음 정산, 입금/송금 |
| `.references/code/mm-broker/.plans/reviews/handbook/09-user-manual-broker.md` | 주선사 메뉴, AI 오더 등록, 상하차지 관리, 매출/매입 정산 |
| `.references/code/mm-broker/.plans/reviews/handbook/10-user-manual-shipper.md` | 화주 주소, 주문 등록, 현황, 정산 조회 |
| `.references/code/mm-broker/.plans/reviews/handbook/11-feature-reference-index.md` | 정산 번들 관련 기능 레퍼런스 |
