# Epic: OPTIC 랜딩 브랜드 전환과 업무 매뉴얼형 스크롤 개선

> **ID**: EPIC-20260428-001
> **상태**: draft
> **기간**: 2026-04-28 ~ 2026-05-10 (예상)
> **책임자**: landing 프론트엔드 팀
> **예상 RICE (가중합)**: 자식 Feature 등록 후 산정
> **근거 문서**: `.plans/archive/2026-04-28-optic-landing-evolution-guide/improvements/final-prompt-package/`

---

## 1. 목적 (Why)

`final-prompt-package`는 현재 랜딩의 AI 오더 등록 hero를 유지하면서, 고객이 보는 브랜드를 `OPTIC`으로 정렬하고 오더부터 정산까지 이어지는 실제 업무 흐름을 더 선명하게 보여주는 개선안이다.

이 Epic은 해당 문서 패키지를 구현 가능한 Feature 묶음으로 바꾼다. 핵심은 **브랜드/CTA 정리**, **업무 매뉴얼형 스크롤 섹션**, **화물맨 연동·정산 번들·세금계산서 흐름의 시각화**, **로고/메타/접근성 품질 기준**을 한 번에 관리하는 것이다.

---

## 2. 성공 지표 (What)

- 고객 화면의 주 브랜드가 `OPTIC`으로 통일되고, `OPTICS`는 footer/About 또는 내부 엔진 설명에만 제한된다.
- 헤더와 모바일 메뉴에서 `OPTIC 바로가기` CTA가 실제 서비스 URL `https://mm-broker-test.vercel.app/`로 새 탭 이동한다.
- hero 이후에 `AI 오더 등록 → 상하차지 관리 → 배차/운송 상태 → 화물맨 연동 → 매출 정산 번들 → 세금계산서` 흐름이 한 번에 이해된다.
- `Optic Cargo`, `서비스 테스트`, `화물맨` 외 외부 브랜드명 노출이 랜딩 문구에서 제거된다.
- `typecheck`, `test`, `build`, desktop/mobile 반응형 확인, 주요 CTA 접근성 확인이 통과한다.

---

## 3. 범위 (Scope)

### In-scope (자식 Feature 목록)

- **F1 — 브랜드, 로고, CTA 최소 반영**
  - `OPTIC/OPTICS` 역할 분리, 헤더/footer 로고 적용, `OPTIC 바로가기` CTA 추가, 모바일 메뉴 CTA 반영.

- **F2 — 카피와 제품 라인업 정리**
  - `Cargo` 중심 언어를 줄이고 `오더`, `운송`, `조율`, `정산` 중심 문구로 전환. 제품 라인업을 `OPTIC Broker/Shipper/Carrier/Ops/Billing` 기준으로 정리.

- **F3 — 업무 매뉴얼형 스크롤 섹션 MVP**
  - hero 이후에 상하차지, 배차/운송 상태, 화물맨 연동, 매출 정산 번들, 세금계산서 발행을 단계형 섹션으로 추가.

- **F4 — 업무 흐름 애니메이션과 상태 표현**
  - 단계별 fade/slide/stagger, 전송 상태 mock, SalesBundle mock, 세금계산서 상태 mock, 모바일 카드형 stepper 적용.

- **F5 — 브랜드 자산, 메타데이터, 검증 정리**
  - 로고 파생 자산, favicon/Open Graph 후보, 접근성 라벨, 문구 스캔, clean build 검증을 묶어 release readiness를 확보.

### Out-of-scope

- hero 구조 또는 DashboardPreview 핵심 동작 재설계
- 실제 지도 API, 화물맨 API, 전자세금계산서 API 연동
- 로그인/권한 기반 deep link 설계
- 공식 브랜드 도메인 전환
- 매입 정산 전체 플로우 상세화
- 로고 상표/권리 검토의 최종 승인

---

## 4. 자식 Feature 요약

상세는 [`01-children-features.md`](./01-children-features.md) 참조.

| Feature | 예상 RICE | 권장 순서 | Lane | Target 기간 |
|---|:---:|:---:|:---:|---|
| F1 — 브랜드, 로고, CTA 최소 반영 | TBD | 1차 | Lite | 2026-04-29 ~ 2026-04-30 |
| F2 — 카피와 제품 라인업 정리 | TBD | 2차 | Standard | 2026-04-30 ~ 2026-05-02 |
| F3 — 업무 매뉴얼형 스크롤 섹션 MVP | TBD | 3차 | Standard | 2026-05-02 ~ 2026-05-06 |
| F4 — 업무 흐름 애니메이션과 상태 표현 | TBD | 4차 | Standard | 2026-05-06 ~ 2026-05-08 |
| F5 — 브랜드 자산, 메타데이터, 검증 정리 | TBD | 5차 | Lite | 2026-05-08 ~ 2026-05-10 |

---

## 5. 마일스톤 (Epic 수준)

- **M-Epic-1 (2026-04-30)**: 브랜드/로고/CTA 최소 반영 완료. `OPTIC 바로가기`가 desktop/mobile에서 접근 가능.
- **M-Epic-2 (2026-05-02)**: 카피와 제품 라인업 정리 완료. 금지 문구와 외부 브랜드명 잔존 없음.
- **M-Epic-3 (2026-05-06)**: 업무 매뉴얼형 스크롤 섹션 MVP 완료. hero 이후 업무 흐름이 페이지에 연결됨.
- **M-Epic-4 (2026-05-10)**: 애니메이션, 자산, 메타데이터, 검증 정리 완료. Epic archive 후보 상태 진입.

---

## 6. 리스크

| # | 리스크 | 완화 |
|---|---|---|
| 1 | AI 생성 로고 이미지의 권리/상표 검토가 완료되지 않으면 production 로고로 확정하기 어렵다 | F1에서는 기존 `OpticLogo` 개선 또는 임시 SVG/PNG 후보로 시작하고, F5에서 승인 게이트를 명시한다 |
| 2 | 실제 서비스 URL 공개 가능성이 미확정이면 CTA가 운영 리스크가 될 수 있다 | URL을 상수로 분리하고, 공개 불가 시 feature flag 또는 임시 비활성 상태로 전환한다 |
| 3 | 신규 업무 섹션이 기존 features/integrations 섹션과 설명을 중복할 수 있다 | F3에서 신규 섹션 추가와 함께 기존 섹션 문구 중복을 줄인다 |
| 4 | 애니메이션이 과해지면 모바일 성능과 텍스트 가독성이 떨어질 수 있다 | MVP는 카드/타임라인 중심으로 제한하고, F4에서 reduced motion과 mobile layout을 별도 검증한다 |
| 5 | `.references/code/mm-broker` 근거 문서가 현재 코드와 다를 수 있다 | 구현 전 현재 landing 코드와 참고 문서의 차이를 확인하고, 불일치 항목은 문구 가정으로 남긴다 |

---

## 7. 자식 IDEA 링크

아직 자식 IDEA는 생성하지 않았다. 이 Epic은 `draft` 상태이며, `planning`으로 올리려면 아래 Feature 중 최소 1개를 `/plan-idea --epic=EPIC-20260428-001`로 등록해야 한다.

- F1 — 브랜드, 로고, CTA 최소 반영
- F2 — 카피와 제품 라인업 정리
- F3 — 업무 매뉴얼형 스크롤 섹션 MVP
- F4 — 업무 흐름 애니메이션과 상태 표현
- F5 — 브랜드 자산, 메타데이터, 검증 정리

---

## 8. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-28 | 초안 — `final-prompt-package` 8개 문서를 분석해 Epic draft로 정리 |
