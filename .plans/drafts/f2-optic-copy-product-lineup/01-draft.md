# F2 카피와 제품 라인업 정리 — 1차 기능 기획 (Draft)

> **Feature slug**: `f2-optic-copy-product-lineup`
> **IDEA**: [IDEA-20260429-001](../../ideas/20-approved/IDEA-20260429-001.md)
> **Screening**: [SCREENING-20260429-001](../../ideas/20-approved/SCREENING-20260429-001.md)
> **Epic**: [EPIC-20260428-001](../../epics/10-planning/EPIC-20260428-001/00-epic-brief.md) (Phase B, F2)
> **작성일**: 2026-04-29
> **상태**: draft
> **Lane**: Standard

---

## 1. 3중 판정 결과

| 축 | 결과 | 근거 |
|---|---|---|
| Lane | Standard | `features`, `problems`, `products`, `integrations`, `constants` 등 3개 이상 섹션 카피가 함께 바뀐다. |
| 시나리오 | A | 신규 reference copy fidelity 작업이 아니라 `final-prompt-package`의 브랜드/카피 기준을 현재 랜딩에 정렬하는 작업이다. |
| Feature 유형 | dev | 구현 대상은 코드 상수와 섹션 컴포넌트의 문구, 테스트, 문구 스캔이다. 별도 reference capture는 필요하지 않다. |
| Hybrid | false | visual/interaction gap board가 필요한 copy fidelity 작업이 아니며, 레이아웃 재현보다 카피 기준 정렬이 핵심이다. |

## 2. 사용자 스토리

1. **As a** 랜딩 방문자, **I want** `OPTIC`의 제품 라인업을 역할별로 이해하기를, **so that** 내 업무에 맞는 제품을 빠르게 찾을 수 있다.
2. **As a** 주선사 운영자, **I want** 기능 설명이 `오더`, `운송`, `정산`, `세금계산서` 흐름으로 이어지기를, **so that** 단순 기능 목록이 아니라 실제 업무 흐름으로 받아들일 수 있다.
3. **As a** 화주 또는 의사결정자, **I want** OPTIC이 화주와 주선사의 운영 방식에 맞춰 조율되고 커스텀될 수 있음을 바로 이해하기를, **so that** 우리 조직의 업무 방식에 적용 가능한 서비스로 판단할 수 있다.
4. **As a** 화주 또는 의사결정자, **I want** 외부 브랜드명 나열보다 줄어드는 수작업과 누락 방지를 먼저 보기를, **so that** 도입 가치가 더 명확해진다.
5. **As a** 이후 F3를 구현할 개발자, **I want** 기존 섹션 카피 기준이 먼저 정리되기를, **so that** 업무 매뉴얼형 섹션을 만들 때 같은 설명을 반복하지 않는다.

## 3. 러프 요구사항

### 3.1 카피 기준

- **R1**: 고객 화면의 주 브랜드는 `OPTIC`으로 유지한다.
- **R2**: `Optic Cargo`, `서비스 테스트`, `테스트 서버`, `데모 테스트` 같은 이전/내부 검증성 문구를 랜딩 본문에서 제거한다.
- **R3**: `Cargo` 중심 표현은 필요한 맥락을 제외하고 `오더`, `운송`, `운영 조율`, `정산` 중심 표현으로 바꾼다.
- **R4**: `OPTICS`는 footer/About의 `Powered by OPTICS` 또는 내부 엔진 보조 설명 수준으로 제한한다.
- **R5**: `화물맨`은 외부 플랫폼 고유명으로 유지하고, 그 외 외부 AI/알림/전자세금계산서 서비스명은 일반 기능명으로 처리한다.
- **R6**: `OPTIC`의 `Coordination` 의미를 고객 가치로 풀어, 화주와 주선사별 운영 방식·정산 기준·연동 흐름에 맞춰 커스텀 가능한 서비스임을 주요 메시지로 반영한다.

### 3.2 섹션별 범위

- **R7**: `src/lib/constants.ts`에서 기능 카드, 제품 라인업, 연동 문구의 기준 데이터를 정리한다.
- **R8**: `src/components/sections/features.tsx`는 `주문 관리` 중심 표현을 `AI 오더 등록`, 정산, 전자세금계산서 흐름과 연결한다.
- **R9**: `src/components/sections/problems.tsx`는 브랜드명 나열보다 수작업 감소, 전송 누락 방지, 정산 누락 방지를 먼저 말한다.
- **R10**: `src/components/sections/products.tsx`는 제품명을 `OPTIC Broker`, `OPTIC Shipper`, `OPTIC Carrier`, `OPTIC Ops`, `OPTIC Billing` 기준으로 정렬하고, 화주/주선사별 커스텀 가능성을 역할별 가치로 연결한다.
- **R11**: `src/components/sections/integrations.tsx`는 `화물맨`, `AI 오더 등록`, `전자세금계산서`, `주소/거리 계산`처럼 기능명 중심으로 설명한다.
- **R12**: `src/components/sections/hero.tsx`는 구조 변경 없이 CTA 문구 스캔 대상에만 포함하되, PRD에서 hero 보조 문구에 커스텀 가능성 메시지를 넣을지 검토한다.

### 3.3 Out-of-scope

- F3 업무 매뉴얼형 신규 섹션 추가
- F4 애니메이션과 상태 mock 추가
- F5 favicon, Open Graph, 브랜드 자산 확정
- 실제 화물맨 API, 지도 API, 전자세금계산서 API 연동
- hero 구조 또는 DashboardPreview 핵심 동작 재설계
- 제품 라인업의 실제 권한/도메인 라우팅 설계
- 화주/주선사별 설정 UI, tenant admin, 설정 저장 구조 신규 구현

## 4. 결정 포인트

| 항목 | 결정 | 근거 |
|---|---|---|
| 제품 라인업 | `OPTIC Broker/Shipper/Carrier/Ops/Billing` 유지 | 브랜드 가이드와 CTA 가이드의 고객용 제품명 기준 |
| 커스텀 가능성 메시지 | 전면 반영 | `OPTIC`의 Coordination 의미와 서비스 핵심 가치가 화주/주선사별 운영 조율과 커스텀 가능성에 있다 |
| 외부 브랜드명 | `화물맨`만 예외로 유지 | 고유 외부 플랫폼명이며, 나머지는 기능명으로 낮추는 것이 가이드 기준 |
| hero 범위 | 문구 스캔만 포함, 구조 변경 없음 | F2의 목적은 기존 섹션 카피 정렬이고 hero 구조 변경은 리스크가 커진다 |
| 신규 업무 섹션 | F3로 분리 | F2에서 중복 설명 기준을 정리한 뒤 F3에서 추가한다 |
| PRD 필요 여부 | 필요 | Standard lane이며 여러 섹션 카피와 검증 기준을 상세 요구사항으로 풀어야 한다 |

## 5. 예상 작업 범위

| 영역 | 파일 | 작업 |
|---|---|---|
| 상수/카피 데이터 | `src/lib/constants.ts` | 금지 문구 제거, 제품명/기능명/연동 문구 정리 |
| 기능 섹션 | `src/components/sections/features.tsx` | 기능 카드 제목과 설명을 업무 가치 중심으로 정렬 |
| 문제 섹션 | `src/components/sections/problems.tsx` | 수작업 감소와 누락 방지 중심 문구로 정리 |
| 제품 섹션 | `src/components/sections/products.tsx` | `OPTIC + 역할명` 라인업 기준 확인 및 설명 보강 |
| 연동 섹션 | `src/components/sections/integrations.tsx` | `화물맨` 외 외부 브랜드명 노출 축소 |
| 커스텀 메시지 | `src/lib/constants.ts`, 주요 섹션 카피 | 화주/주선사별 운영 방식에 맞춰 조율 가능한 서비스라는 핵심 메시지 반영 |
| 테스트/검증 | 관련 테스트 또는 문구 스캔 명령 | 금지 문구, 제품명, 외부 브랜드명 잔존 여부 확인 |

## 6. Acceptance Criteria

- 랜딩 코드와 테스트 대상 문구에서 `Optic Cargo`가 남지 않는다.
- 고객 CTA나 본문에 `서비스 테스트`, `테스트 서버`, `데모 테스트`가 남지 않는다.
- 제품 라인업은 `OPTIC Broker`, `OPTIC Shipper`, `OPTIC Carrier`, `OPTIC Ops`, `OPTIC Billing` 기준으로 보인다.
- 화주/주선사별 운영 방식에 맞춘 커스텀 가능성이 OPTIC의 핵심 가치로 보인다.
- `화물맨` 외 외부 브랜드명은 고객 화면에서 일반 기능명으로 대체된다.
- 여러 섹션의 긴 한글 문구가 desktop/mobile에서 겹치지 않는다.
- F3가 이어받을 수 있도록 기존 섹션과 신규 업무 흐름의 역할 구분이 PRD에 남는다.

## 7. 검증 계획

| 검증 | 기준 |
|---|---|
| 문구 스캔 | `Optic Cargo`, `서비스 테스트`, `테스트 서버`, `데모 테스트`, 과도한 `Cargo` 잔존 여부 확인 |
| 제품명 스캔 | `OPTIC Broker`, `OPTIC Shipper`, `OPTIC Carrier`, `OPTIC Ops`, `OPTIC Billing` 노출 확인 |
| 커스텀 메시지 스캔 | 화주/주선사별 맞춤, 커스텀, 운영 방식 조율 메시지가 주요 섹션에 반영됐는지 확인 |
| 외부 브랜드명 스캔 | `화물맨` 외 특정 외부 브랜드명 잔존 여부 확인 |
| 테스트 | 관련 섹션 렌더 테스트 또는 constants 테스트 추가/갱신 |
| 타입 체크 | TypeScript 오류 없음 |
| lint | JSX/문구 변경 중 lint 오류 없음 |
| 수동 확인 | desktop/mobile에서 섹션 카드와 버튼 텍스트 겹침 없음 |

## 8. 리스크와 완화

| 리스크 | 수준 | 완화 |
|---|---|---|
| 카피 변경이 여러 섹션에 퍼져 누락이 생길 수 있다 | medium | PRD에서 섹션별 변경표와 문구 스캔 명령을 명시한다 |
| F3 신규 섹션과 설명이 중복될 수 있다 | medium | F2는 기존 섹션 기준 정렬, F3는 신규 업무 흐름 추가로 역할을 분리한다 |
| 커스텀 가능성 표현이 실제 기능 약속으로 과장될 수 있다 | medium | F2에서는 메시지와 카피 기준을 정리하고, 실제 설정 UI·tenant admin 구현은 out-of-scope로 둔다 |
| 외부 브랜드명 제거 범위가 과할 수 있다 | medium | `화물맨`만 기본 예외로 두고, 추가 승인 브랜드는 PRD에서 별도 결정 항목으로 둔다 |
| 긴 한글 문구가 카드 UI를 깨뜨릴 수 있다 | medium | 구현 후 desktop/mobile spot check를 검증 게이트로 둔다 |

## 9. 다음 단계

1. `/plan-prd .plans/drafts/f2-optic-copy-product-lineup/`로 PRD 10개 섹션을 작성한다.
2. PRD에서 섹션별 변경표, 커스텀 가능성 메시지, 문구 스캔 명령, F3 중복 방지 기준을 확정한다.
3. PRD review 후 `/plan-bridge` 또는 필요한 설계 단계를 결정한다.

## 10. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-29 | 초안 — F2 approved IDEA 기반 Standard Draft 생성 |
| 2026-04-29 | 사용자 피드백 반영 — 화주/주선사별 커스텀 가능성을 OPTIC 핵심 메시지로 추가 |
