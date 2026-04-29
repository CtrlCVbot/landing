# PRD: F2 카피와 제품 라인업 정리

> **Epic**: [EPIC-20260428-001](../../epics/10-planning/EPIC-20260428-001/00-epic-brief.md) (Phase B, F2)
> **Feature slug**: `f2-optic-copy-product-lineup`
> **IDEA**: [IDEA-20260429-001](../../ideas/20-approved/IDEA-20260429-001.md)
> **Screening**: [SCREENING-20260429-001](../../ideas/20-approved/SCREENING-20260429-001.md)
> **Draft**: [01-draft.md](../../drafts/f2-optic-copy-product-lineup/01-draft.md)
> **Routing metadata**: [07-routing-metadata.md](../../drafts/f2-optic-copy-product-lineup/07-routing-metadata.md)
> **작성일**: 2026-04-29
> **상태**: approved
> **schema**: PRD 10 섹션 표준

---

## 1. Overview

F2는 F1에서 고정한 `OPTIC` 브랜드와 `OPTIC 바로가기` CTA 기준을 랜딩 본문 전체로 확장하는 카피 정렬 Feature다. 현재 목적은 새 기능을 구현하는 것이 아니라, 기존 `features`, `problems`, `products`, `integrations`, `constants`의 문구를 `OPTIC`의 핵심 가치인 맞춤형 운송 운영 조율로 정리하는 것이다.

`OPTIC`은 하나의 고정된 운송 관리 화면이 아니라, 화주와 주선사마다 다른 오더 접수 방식, 연동 방식, 정산 기준을 하나의 운영 흐름으로 조율하는 맞춤형 운송 운영 플랫폼으로 설명되어야 한다. 이 PRD는 F3 업무 매뉴얼형 스크롤 섹션이 같은 메시지 기준을 이어받을 수 있도록 카피 기준, 제품 라인업, 검증 기준을 고정한다.

## 2. Problem Statement

F1 이후 header/footer/CTA의 브랜드 기준은 정리됐지만, 본문에는 여전히 기능명 중심 또는 외부 브랜드명 중심의 표현이 남아 있다. 현재 코드 스캔 기준으로 `src/lib/constants.ts`에는 `주문 관리`, `AI 주문 추출`, `팝빌`, `Google Gemini AI`, `카카오 맵`, `로지스엠/화물맨`, `OPTIC Operations` 같은 표현이 확인된다. Hero에는 `데모 보기` CTA도 남아 있다.

이 상태가 유지되면 방문자는 `OPTIC`이 단순 기능 묶음인지, 특정 외부 연동 모음인지, 화주/주선사별 운영 방식에 맞출 수 있는 플랫폼인지 즉시 이해하기 어렵다. 특히 F3에서 업무 매뉴얼형 섹션을 추가하기 전에 기존 섹션의 언어가 정리되지 않으면 같은 설명이 여러 곳에서 반복되거나, `화물맨` 외 외부 브랜드가 서비스 가치보다 앞에 보일 위험이 있다.

## 3. Goals & Non-Goals

### Goals

- 고객 노출 주 브랜드를 `OPTIC`으로 유지하고, `OPTICS`는 내부 엔진 또는 footer/About 보조 설명으로 제한한다.
- `OPTIC`의 의미를 약어 설명이 아니라 고객 가치 문장으로 풀어, 맞춤형 운송 운영 조율 메시지를 전면화한다.
- 이번 구현 대상 제품 라인업은 `OPTIC Broker`, `OPTIC Shipper` 두 가지로 고정하되, 방문자가 바로 이해할 수 있도록 한글 역할명을 1차 제목으로 보여준다.
- `OPTIC Broker`는 `주선사용 운송 운영 콘솔`, `OPTIC Shipper`는 `화주용 운송 요청 포털`로 설명하고, 영문 제품명은 보조 라벨로 병기한다.
- `OPTIC Carrier`, `OPTIC Ops`, `OPTIC Billing`은 현재 구현 범위가 아니라 구현 예정 제품으로 분리해 과장 없이 표시한다.
- 화주/주선사별 운영 방식, 정산 기준, 연동 흐름을 맞출 수 있다는 메시지를 주요 섹션에 반영한다.
- `화물맨`을 제외한 외부 AI, 지도, 전자세금계산서 서비스명은 고객 화면에서 일반 기능명으로 낮춘다.
- F3 업무 매뉴얼형 섹션이 이어받을 단계 흐름과 중복 방지 기준을 남긴다.
- 변경 후 문구 스캔, 제품명 스캔, responsive spot check로 긴 한글 문구와 잔존 금지어를 검증한다.

### Non-Goals

- F3 업무 매뉴얼형 신규 섹션 구현.
- F4 애니메이션과 상태 mock 구현.
- F5 favicon, Open Graph, 브랜드 자산 확정.
- 실제 화물맨 API, 지도 API, 전자세금계산서 API 연동.
- hero 구조 또는 DashboardPreview 핵심 동작 재설계.
- 화주/주선사별 설정 UI, tenant admin, 설정 저장 구조 신규 구현.
- `OPTIC Carrier`, `OPTIC Ops`, `OPTIC Billing`의 실제 제품 카드, 권한, 도메인, 라우팅 정책 구현.

## 4. User Stories

1. **As a** 랜딩 방문자, **I want** `주선사용`과 `화주용` 서비스 구분을 먼저 이해하기를, **so that** `OPTIC Broker/Shipper`라는 영문 제품명을 몰라도 내 업무에 맞는 제품을 빠르게 찾을 수 있다.
2. **As a** 주선사 운영자, **I want** 오더, 운송, 연동, 정산, 세금계산서 흐름이 같은 언어로 설명되기를, **so that** 단순 기능 목록이 아니라 실제 운영 흐름으로 이해할 수 있다.
3. **As a** 화주 또는 의사결정자, **I want** OPTIC이 우리 조직의 운송 요청 방식과 정산 기준에 맞춰질 수 있음을 알기를, **so that** 범용 SaaS가 아니라 도입 가능한 운영 플랫폼으로 판단할 수 있다.
4. **As a** 정산/회계 담당자, **I want** 정산과 세금계산서 설명이 외부 서비스명보다 업무 결과 중심으로 보이기를, **so that** 후속 업무 누락을 줄이는 가치를 이해할 수 있다.
5. **As a** F3 구현자, **I want** 기존 섹션 카피와 업무 매뉴얼형 섹션의 역할이 구분되기를, **so that** 신규 섹션에서 같은 내용을 반복하지 않는다.

## 5. Functional Requirements

| ID | 요구사항 | 우선순위 | 수용 기준 |
|---|---|:---:|---|
| REQ-f2-optic-copy-product-lineup-001 | 고객 노출 주 브랜드는 `OPTIC`으로 유지한다. | Must | header/footer 이후 본문 섹션에서도 주 브랜드가 `OPTIC` 기준으로 보인다. |
| REQ-f2-optic-copy-product-lineup-002 | `OPTICS`는 내부 엔진 또는 보조 설명 수준으로 제한한다. | Must | 고객-facing 본문 제목/제품명에서 `OPTICS`가 전면 브랜드로 쓰이지 않는다. |
| REQ-f2-optic-copy-product-lineup-003 | `Optic Cargo`, `서비스 테스트`, `테스트 서버`, `데모 테스트`를 제거한다. | Must | 문구 스캔에서 해당 문자열이 고객-facing 코드에 남지 않는다. |
| REQ-f2-optic-copy-product-lineup-004 | `Cargo` 중심 표현을 `오더`, `운송`, `운영 조율`, `정산` 중심 표현으로 바꾼다. | Must | `Cargo`가 브랜드 의미나 주요 가치 설명을 주도하지 않는다. |
| REQ-f2-optic-copy-product-lineup-005 | `OPTIC` 의미를 고객 가치 문장으로 풀어쓴다. | Must | `Optimized/Platform/Transport/Intelligence/Coordination`을 나열하는 대신 최적화, AI, 조율, 맞춤 운영 가치가 카피에 반영된다. |
| REQ-f2-optic-copy-product-lineup-006 | 화주/주선사별 커스텀 가능성을 핵심 메시지로 반영한다. | Must | 주요 섹션 중 최소 2곳 이상에서 회사별 운영 방식, 요청 양식, 정산 기준을 맞출 수 있다는 메시지가 보인다. |
| REQ-f2-optic-copy-product-lineup-007 | 현재 구현 제품 라인업은 한글 역할명 우선으로 표시한다. | Must | `주선사용 운송 운영 콘솔` 아래 `OPTIC Broker`, `화주용 운송 요청 포털` 아래 `OPTIC Shipper`가 보이며, `OPTIC Operations`는 활성 제품명으로 남지 않는다. |
| REQ-f2-optic-copy-product-lineup-008 | 나머지 제품은 구현 예정으로 분리한다. | Must | `OPTIC Carrier`, `OPTIC Ops`, `OPTIC Billing`은 활성 제품처럼 보이지 않고, 로드맵 또는 구현 예정 상태로만 언급된다. |
| REQ-f2-optic-copy-product-lineup-009 | 기능 섹션은 기능명보다 업무 결과를 먼저 말한다. | Should | `주문 관리` 중심 표현은 `AI 오더 등록`, 반복 입력 감소, 정산/증빙 연결 문맥으로 정리된다. |
| REQ-f2-optic-copy-product-lineup-010 | 문제/해결 섹션은 수작업 감소와 누락 방지를 먼저 말한다. | Should | 외부 브랜드명 나열보다 중복 입력, 전송 누락, 정산 누락 방지 가치가 먼저 보인다. |
| REQ-f2-optic-copy-product-lineup-011 | 연동 섹션은 `화물맨`만 고유 외부 플랫폼명으로 유지한다. | Must | `Google Gemini AI`, `카카오 맵`, `팝빌`, `로지스엠` 같은 노출은 일반 기능명 또는 `화물맨` 예외 기준으로 정리된다. |
| REQ-f2-optic-copy-product-lineup-012 | Hero는 구조 변경 없이 카피 스캔 대상에 포함한다. | Should | `데모 보기`가 남는 경우 의도된 예외인지 PRD review에서 확인하고, 기본안은 `OPTIC 바로가기` 또는 문의 CTA와 역할을 맞춘다. |
| REQ-f2-optic-copy-product-lineup-013 | F3 매뉴얼형 섹션으로 이어질 단계 흐름을 남긴다. | Must | 운영 방식 선택 → AI 오더 등록 → 상하차지 → 화물맨 → 정산 → 세금계산서 흐름이 후속 문서에 추적 가능하다. |
| REQ-f2-optic-copy-product-lineup-014 | 변경 후 문구와 UI 안정성을 검증한다. | Must | 문구 스캔, 제품명 스캔, 외부 브랜드명 스캔, desktop/mobile spot check가 검증 계획에 포함된다. |

## 6. UX Requirements

- 본문 카피는 “기능을 제공합니다”보다 “무엇이 줄어들고 어떤 운영 흐름이 선명해지는가”를 먼저 말한다.
- `OPTIC` 의미는 약어 풀이를 전면에 세우지 않는다. 방문자에게는 “회사별 운송 운영을 맞춰 정리한다”는 문장으로 전달한다.
- 제품 라인업은 현재 구현 대상과 구현 예정 대상을 혼동 없이 구분해야 한다. 활성 제품 카피는 `주선사용 운송 운영 콘솔`과 `화주용 운송 요청 포털`을 먼저 보여주고, `OPTIC Broker/Shipper`는 보조 라벨로 학습되게 한다.
- 제품 카드에서 영문 제품명만 단독 제목으로 쓰지 않는다. 방문자가 역할을 즉시 인지할 수 있도록 제목, 보조 라벨, 설명 순서를 유지한다.
- 커스텀 가능성은 실제 설정 UI가 있는 것처럼 과장하지 않는다. “운영 방식, 요청 양식, 정산 기준에 맞춰 조율”처럼 카피 기준으로 표현한다.
- 연동 섹션은 브랜드 로고/이름 나열보다 “한 번 입력한 정보를 어디로 이어 보내고, 무엇을 줄이는가”를 먼저 보여준다.
- 긴 한글 문구는 카드와 버튼 안에서 줄바꿈되어야 하며, 375px 모바일 폭에서도 텍스트가 겹치지 않아야 한다.
- F3 매뉴얼형 섹션은 F2 본문 섹션을 반복하지 않고, 실제 업무 단계의 연결감만 이어받아야 한다.

## 7. Technical Considerations

- 주요 예상 파일은 `src/lib/constants.ts`, `src/components/sections/features.tsx`, `src/components/sections/problems.tsx`, `src/components/sections/products.tsx`, `src/components/sections/integrations.tsx`, `src/components/sections/hero.tsx`다.
- 현재 `src/lib/constants.ts`에는 `OPTIC Operations`, `Google Gemini AI`, `카카오 맵`, `팝빌`, `로지스엠/화물맨`, `주문 관리`, `AI 주문 추출` 등이 있어 F2 스캔 기준으로 삼는다. 특히 제품 라인업 구현 범위는 `OPTIC Broker`와 `OPTIC Shipper` 두 가지로 제한하고, 표시 데이터는 한글 역할명과 영문 보조 라벨을 함께 가질 수 있어야 한다.
- F2는 copy/data 정리 중심이다. API 호출, DB schema, 인증, tenant admin, 설정 저장 구조는 변경하지 않는다.
- 외부 브랜드명 제거는 고객-facing 카피 기준이다. 내부 구현 key인 `gemini`, `kakao`, `popbill`, `logishm`은 코드 식별자라서 변경 필요 여부를 구현 단계에서 별도 판단한다.
- 문구 스캔은 `Select-String` 또는 `rg`를 사용한다. Windows 환경에서 `rg` 접근 오류가 나면 `Select-String`을 사용한다.
- 테스트 후보는 constants 데이터 검증, 섹션 렌더링 테스트, CTA/제품명 렌더 테스트다.
- 구현 검증 후보는 `pnpm typecheck`, `pnpm test`, `pnpm lint`, 필요 시 `pnpm build`다.

## 8. Milestones

| 단계 | 범위 | 완료 조건 |
|---|---|---|
| M1 — PRD review | 본 PRD 품질과 범위 검토 | PRD 10 섹션, REQ-ID, Non-Goals, Metric 검토 완료 |
| M2 — Copy map | 섹션별 기존 문구와 목표 문구 확정 | features/problems/products/integrations/hero 변경표 작성 |
| M3 — Constants update | `src/lib/constants.ts` 중심 데이터 정리 | 금지 문구, 제품명, 외부 브랜드명 기준 반영 |
| M4 — Section render update | 관련 섹션의 표시 문구 정리 | 한글 역할명 우선 제품 카드, Broker/Shipper 보조 라벨, 구현 예정 제품 분리, 커스텀 메시지 표시 |
| M5 — Verification | 문구 스캔, 테스트, responsive spot check | 금지어 잔존 없음, 제품명 기준 일치, 모바일 텍스트 겹침 없음 |
| M6 — Handoff | F3가 이어받을 카피/매뉴얼 기준 정리 | Bridge 또는 후속 planning 문서에서 F3 입력 기준 확정 |

## 9. Risks & Mitigations

| 리스크 | 영향 | 확률 | 완화 |
|---|:---:|:---:|---|
| 커스텀 가능성 표현이 실제 설정 기능 약속처럼 보임 | High | Medium | F2는 카피 기준으로 제한하고 tenant admin, 설정 저장 구조는 Non-Goals에 명시한다. |
| 외부 브랜드명 제거가 내부 구현 key 변경으로 번짐 | Medium | Medium | 고객-facing 카피와 내부 식별자를 분리하고, 코드 key 변경은 구현 단계에서 별도 판단한다. |
| F3 업무 매뉴얼형 섹션과 기존 섹션 설명이 중복됨 | Medium | High | F2는 섹션별 카피 기준, F3는 단계형 업무 흐름으로 역할을 분리한다. |
| 구현 예정 제품이 활성 제품처럼 보임 | Medium | Medium | Broker/Shipper만 현재 구현 대상으로 두고 Carrier/Ops/Billing은 구현 예정으로 표시한다. |
| 영문 제품명만으로 사용자가 역할을 인지하지 못함 | High | Medium | 한글 역할명 우선 제목과 영문 제품명 보조 라벨을 함께 사용한다. |
| 긴 한글 문구가 카드 UI를 깨뜨림 | Medium | Medium | desktop/mobile spot check와 텍스트 줄바꿈 확인을 검증 게이트로 둔다. |
| `화물맨`과 `로지스엠` 표기 기준이 흔들림 | Medium | Medium | 고객-facing 표기는 `화물맨` 기준으로 두고, 법무/마케팅 승인 전 다른 외부 브랜드명은 일반 기능명으로 처리한다. |
| PRD가 카피 후보만 많고 구현 기준이 약해짐 | Medium | Low | Functional Requirements와 Success Metrics에 스캔 문자열, 제품명, 섹션 범위를 명시한다. |

## 10. Success Metrics

| ID | 지표 | 목표 | 측정 방법 |
|---|---|---|---|
| SM-f2-copy-product-lineup-001 | 금지 문구 제거 | `Optic Cargo`, `서비스 테스트`, `테스트 서버`, `데모 테스트` 0건 | 문구 스캔 |
| SM-f2-copy-product-lineup-002 | 제품명/역할명 정합성 | `주선사용 운송 운영 콘솔` + `OPTIC Broker`, `화주용 운송 요청 포털` + `OPTIC Shipper`가 함께 보이고, `OPTIC Carrier/Ops/Billing`은 구현 예정으로만 구분 | 제품명/역할명 스캔 또는 constants test |
| SM-f2-copy-product-lineup-003 | 커스텀 메시지 반영 | 화주/주선사별 맞춤 또는 운영 조율 메시지 2개 이상 섹션 반영 | 카피 스캔 + 수동 review |
| SM-f2-copy-product-lineup-004 | OPTIC 의미 반영 | 약어 나열보다 고객 가치 문장으로 표현 | PRD/copy review |
| SM-f2-copy-product-lineup-005 | 외부 브랜드명 제한 | `화물맨` 외 외부 브랜드명 고객-facing 노출 없음 또는 의도된 예외 기록 | 외부 브랜드명 스캔 |
| SM-f2-copy-product-lineup-006 | F3 handoff 기준 | 매뉴얼형 단계 흐름 6단계가 후속 문서에 남음 | PRD/Bridge review |
| SM-f2-copy-product-lineup-007 | UI 텍스트 안정성 | desktop/mobile에서 버튼과 카드 텍스트 겹침 없음 | browser spot check |
| SM-f2-copy-product-lineup-008 | 테스트 안정성 | 관련 테스트와 type/lint 검증 통과 | `pnpm test`, `pnpm typecheck`, `pnpm lint` |
