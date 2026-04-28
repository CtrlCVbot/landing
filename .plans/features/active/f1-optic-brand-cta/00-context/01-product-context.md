# 01. Product Context - F1 브랜드, 로고, CTA 최소 반영

> Draft의 제품 맥락을 개발자가 바로 읽을 수 있게 고정한 bridge 문서.

---

## 1. 한 줄 요약

현재 랜딩에서 고객이 보는 주 브랜드를 `OPTIC`으로 정렬하고, 서비스 확인 CTA(`OPTIC 바로가기`)와 문의 CTA(`도입 문의하기`)를 Header desktop/mobile에서 명확히 분리한다.

## 2. 사용자 가치

| 사용자 | 원하는 결과 | 이유 |
|---|---|---|
| 랜딩 방문자 | 서비스 이름을 `OPTIC`으로 일관되게 인지 | 브랜드 기억과 클릭 판단 혼선을 줄인다 |
| 도입 검토자 | 서비스 확인과 문의 행동을 분리 | 실제 서비스 확인과 영업 문의를 빠르게 선택한다 |
| 모바일 방문자 | 메뉴 안에서도 두 CTA를 구분 | 작은 화면에서도 주요 행동을 놓치지 않는다 |
| 후속 개발자 | 브랜드 기준을 상수와 문서에서 확인 | F2~F5 카피/자산 작업의 기준점을 유지한다 |

## 3. 현재 코드 상태

| 파일 | 현재 상태 | F1에서 필요한 변화 |
|---|---|---|
| `src/lib/constants.ts` | `NAV_LINKS`, `FOOTER_LINKS` 등 데이터 상수는 있으나 브랜드/CTA 전용 상수는 없음 | `OPTIC`, `OPTICS`, 서비스 URL, CTA label을 한 곳에서 참조하도록 정리 |
| `src/components/sections/header.tsx` | desktop/mobile 모두 `도입 문의하기`만 CTA로 노출 | `OPTIC 바로가기` 외부 링크 CTA를 추가하고 문의 CTA와 구분 |
| `src/components/sections/footer.tsx` | `OPTIC` 주 표기와 `Powered by OPTICS` 보조 표기가 이미 있음 | 상수 참조 기준으로 유지, 보조 표기 범위를 명시 |
| `src/components/icons/optic-logo.tsx` | 텍스트 기반 SVG와 `aria-label="OPTIC logo"` 존재 | production 승인 전 임시 로고로 유지, 접근성 이름 확인 |

## 4. 요구사항 요약

| ID | 요구사항 | 구현 힌트 |
|---|---|---|
| R1 | 브랜드명, 서비스 URL, CTA label 상수화 | `src/lib/constants.ts`에 브랜드/CTA 객체 또는 named export 추가 |
| R2 | `OPTIC 바로가기`와 `도입 문의하기` 목적 분리 | Header action 영역과 mobile menu 모두 반영 |
| R3 | `OPTICS`는 footer/About 보조 표기로 제한 | footer의 `Powered by OPTICS` 수준 유지 |
| R4 | 내부 검증성 문구 추가 금지 | `서비스 테스트` 같은 문구를 고객 화면에 추가하지 않음 |
| R5-R8 | Header desktop/mobile CTA 동작 | 외부 링크 `target="_blank"` + `rel="noopener noreferrer"`, mobile click close |
| R9-R11 | Footer/Logo 접근성 유지 | 주/보조 브랜드 표기, logo label 확인 |

## 5. 비목표

- Hero 구조와 DashboardPreview 핵심 동작 재설계
- 공식 도메인 전환
- 신규 로고 권리/상표 최종 승인
- F2 카피 전면 교체
- F3 업무 매뉴얼형 섹션 추가
