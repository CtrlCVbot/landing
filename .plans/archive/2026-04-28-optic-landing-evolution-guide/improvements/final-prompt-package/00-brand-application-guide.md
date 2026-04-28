# 00. OPTIC / OPTICS 브랜드 적용 가이드

> 기준: `OPTIC / OPTICS 브랜드 가이드 v1.0`, Last updated 2026-02-27 KST
> 적용 대상: 이번 랜딩 개선 문서 패키지와 이후 구현 문구

## 1. 브랜드 역할 분리

| 브랜드 | 역할 | 랜딩 적용 |
| --- | --- | --- |
| `OPTIC` | 고객이 쓰는 업무용 SaaS 제품 브랜드 | 랜딩, 헤더, 제품명, CTA, 고객용 문구는 모두 `OPTIC` 기준 |
| `OPTICS` | OPTIC을 움직이는 최적화, 데이터, AI 엔진 브랜드 | 내부 기술 설명, footer/About의 `Powered by OPTICS` 정도로 제한 |

핵심 원칙은 **OPTIC = Experience(경험)**, **OPTICS = Engine(엔진)** 이다.

## 2. 외부 노출 원칙

| 항목 | 기준 |
| --- | --- |
| 랜딩 메인 타이틀 | `OPTIC`만 사용 |
| 제품 라인업 | `OPTIC Broker`, `OPTIC Shipper`, `OPTIC Carrier`, `OPTIC Ops`, `OPTIC Billing` |
| CTA | `OPTIC 바로가기`, `도입 문의하기`처럼 고객 행동 중심 |
| footer/About | `Powered by OPTICS` 허용 |
| 금지 | 고객이 보는 메뉴, 도메인, 메인 타이틀에 `OPTICS` 전면 배치 |

## 3. 의미 확장 정책

외부 고객에게는 풀네임을 노출하지 않는다. 내부 정렬용으로만 아래 의미를 사용한다.

| 브랜드 | 내부 의미 |
| --- | --- |
| `OPTIC` | Optimized Platform for Transport Intelligence & Coordination |
| `OPTICS` | Optimization Platform for Transport Intelligence & Coordination Suite |

여기서 `C`는 `Cargo`가 아니라 `Coordination`이다. 따라서 랜딩 문구도 특정 화물 도메인에 갇히기보다 `오더`, `운송`, `운영 조율`, `정산` 중심으로 넓게 잡는다.

## 4. 문구 적용 규칙

| 기존 경향 | 개선 기준 |
| --- | --- |
| `Cargo`, `화물` 중심 브랜드 설명 | `운송 오더`, `transport`, `coordination`, `운영 흐름` 중심 |
| `AI 화물등록`만 강조 | `AI 오더 등록` 또는 `AI 운송 오더 등록`으로 확장 |
| 기능명 나열 | “운영을 선명하게 보이게 한다”는 브랜드 가치와 연결 |
| 내부 엔진 설명 없음 | 필요한 경우 `OPTICS Ledger`, `OPTICS Match`, `OPTICS Route` 같은 내부 엔진으로 구현 근거 설명 |
| 외부 브랜드명 나열 | `화물맨`을 제외한 외부 AI/알림/전자세금계산서 서비스명은 일반 기능명으로 처리 |

단, `화물맨`은 외부 플랫폼 고유명으로 유지한다.

## 5. 랜딩 카피 기준

| 위치 | 추천 방향 |
| --- | --- |
| hero | `오더부터 정산까지 한눈에.` 또는 `운영을 통제 가능한 흐름으로.` |
| overview | AI가 등록한 운송 오더가 상하차지, 연동, 정산, 계산서로 이어지는 흐름 |
| section copy | `선명하게`, `흐름`, `통제`, `누락 방지`, `조율` 같은 단어를 우선 |
| 기술 보조 문구 | footer/About에서만 `Powered by OPTICS` 사용 |

## 6. 로고 자산 적용 기준

| 항목 | 기준 |
| --- | --- |
| 기준 이미지 | `C:/Users/user/Downloads/ChatGPT Image 2026년 4월 28일 오후 03_23_39.png` |
| 로고 표기 | `OPTIC` 워드마크 기준 |
| 시각 방향 | 검정 단색, 원형 심볼, 굵은 대문자 워드마크 |
| 사용 위치 | 헤더, footer, favicon/app icon 후보, Open Graph 이미지 |
| 주의점 | `OPTICS`를 메인 로고로 사용하지 않는다 |

제공 이미지는 OPTIC 고객 접점 브랜드의 로고 기준 이미지로 반영한다.
단, 구현 전에는 투명 배경, SVG 또는 고해상도 PNG, dark mode 대응 버전을 별도로 준비한다.
상세 적용 기준은 [06-logo-asset-application-guide.md](06-logo-asset-application-guide.md)를 따른다.

## 7. 제품/엔진 매핑

| 고객 제품 | 주 사용자 | 관련 내부 엔진 표현 |
| --- | --- | --- |
| `OPTIC Broker` | 주선사 | `OPTICS Match`, `OPTICS Ledger`, `OPTICS Signal` |
| `OPTIC Shipper` | 화주 | `OPTICS Core`, `OPTICS Signal` |
| `OPTIC Carrier` | 운송사/차주 | `OPTICS Route`, `OPTICS Signal` |
| `OPTIC Ops` | 운영/관제 | `OPTICS Core`, `OPTICS Signal` |
| `OPTIC Billing` | 정산/회계 | `OPTICS Ledger` |

고객 랜딩에서는 엔진명을 전면에 내세우지 않는다. “정산이 누락되지 않도록 계산과 상태를 맞춘다”처럼 효과를 먼저 말하고, 내부 문서나 구현 가이드에서만 엔진명을 보조 근거로 사용한다.

## 8. 도메인/CTA 적용 기준

| 항목 | 기준 |
| --- | --- |
| 도메인 패턴 | `{service}.{tenant}.{root}` |
| 서비스 코드 | `brkr`, `shpr`, `carr` 또는 `drv`, `ops`, `fin` 또는 `bill`, `admin`, `api`, `docs` |
| 현재 실제 서비스 URL | `https://mm-broker-test.vercel.app/` |
| 랜딩 버튼 문구 | `OPTIC 바로가기` |
| 공개 전 확인 | 현재 URL이 브랜드 도메인 표준과 다르므로 공개 사용 가능 여부를 확인해야 한다 |

## 9. 적용 체크리스트

| 체크 | 상태 |
| --- | --- |
| 외부 문서에서 고객 브랜드는 `OPTIC`으로 통일 | 적용 |
| `OPTICS`는 엔진/내부 기술/Powered by 문구로 제한 | 적용 |
| `Cargo` 중심 설명을 `order/transport/coordination` 중심으로 전환 | 적용 |
| 제품 라인업을 `OPTIC + 역할명` 구조로 정리 | 적용 |
| 실제 서비스 CTA를 `서비스 테스트`가 아니라 `OPTIC 바로가기`로 정리 | 적용 |
| 제공 로고 이미지를 OPTIC 로고 작업 기준 이미지로 반영 | 적용 |
