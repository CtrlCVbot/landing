# Children Features — EPIC-20260428-001

> `OPTIC 랜딩 브랜드 전환과 업무 매뉴얼형 스크롤 개선`의 자식 Feature 실행 지도.
> 현재 상태는 `planning`이며, F1 Feature Package 생성을 완료했다.

---

## 1. Feature 목록

### F1 — 브랜드, 로고, CTA 최소 반영

- **IDEA**: [IDEA-20260428-001](../../../ideas/20-approved/IDEA-20260428-001.md)
- **Lane**: Lite (헤더/footer/상수 중심의 국소 변경)
- **RICE 예상**: TBD
- **범위**: `src/lib/constants.ts`, `src/components/sections/header.tsx`, `src/components/sections/footer.tsx`, `src/components/icons/optic-logo.tsx`
- **상태**: feature-package-ready, dev-run 대기
- **Draft**: [f1-optic-brand-cta](../../../drafts/f1-optic-brand-cta/01-draft.md)
- **Bridge**: [context index](../../../features/active/f1-optic-brand-cta/00-context/00-index.md)
- **Feature Package**: [overview](../../../features/active/f1-optic-brand-cta/02-package/00-overview.md)
- **완료 기준**:
  - 고객 화면 주 브랜드는 `OPTIC`으로 보인다.
  - `OPTICS`는 footer/About의 `Powered by OPTICS` 정도로 제한된다.
  - `OPTIC 바로가기`가 `https://mm-broker-test.vercel.app/`로 새 탭 이동한다.
  - 모바일 메뉴에서도 서비스 CTA와 문의 CTA가 구분된다.

### F2 — 카피와 제품 라인업 정리

- **IDEA**: pending
- **Lane**: Standard (여러 섹션 카피와 상수 정리)
- **RICE 예상**: TBD
- **범위**: `src/lib/constants.ts`, `src/components/sections/features.tsx`, `problems.tsx`, `products.tsx`, `integrations.tsx`
- **상태**: pending IDEA
- **완료 기준**:
  - `Optic Cargo`, `서비스 테스트`, 과도한 `Cargo` 중심 표현이 제거된다.
  - 제품 라인업은 `OPTIC Broker`, `OPTIC Shipper`, `OPTIC Carrier`, `OPTIC Ops`, `OPTIC Billing` 기준으로 정렬된다.
  - `화물맨` 외 외부 브랜드명은 일반 기능명으로 바뀐다.

### F3 — 업무 매뉴얼형 스크롤 섹션 MVP

- **IDEA**: pending
- **Lane**: Standard (신규 섹션과 데이터 구조 추가)
- **RICE 예상**: TBD
- **범위**: `src/components/sections/workflow-manual.tsx`, `src/lib/landing-workflow.ts` 또는 `src/lib/constants.ts`, `src/app/page.tsx`
- **상태**: pending IDEA
- **완료 기준**:
  - hero 이후 `AI 오더 등록 → 상하차지 관리 → 배차/운송 상태 → 화물맨 연동 → 매출 정산 번들 → 세금계산서` 흐름이 이어진다.
  - 섹션당 한 업무만 설명하고, 기존 features/integrations와 중복 설명을 줄인다.
  - 375px 모바일 폭에서도 텍스트 겹침이 없다.

### F4 — 업무 흐름 애니메이션과 상태 표현

- **IDEA**: pending
- **Lane**: Standard (motion, 상태 mock, responsive QA 포함)
- **RICE 예상**: TBD
- **범위**: `workflow-manual.tsx`, `src/lib/motion.ts`, 신규 mock 데이터 또는 상수
- **상태**: pending IDEA
- **완료 기준**:
  - 단계별 fade/slide/stagger가 과하지 않게 적용된다.
  - 화물맨 전송 성공/오류 로그, SalesBundle 묶음, 세금계산서 상태가 mock UI로 표현된다.
  - reduced motion과 모바일 레이아웃이 확인된다.

### F5 — 브랜드 자산, 메타데이터, 검증 정리

- **IDEA**: pending
- **Lane**: Lite (마무리 자산과 검증 중심)
- **RICE 예상**: TBD
- **범위**: `public/brand/**`, `src/app/layout.tsx`, header/footer/CTA 접근성 라벨, 문구 스캔 스크립트 또는 명령
- **상태**: pending IDEA
- **완료 기준**:
  - 로고 후보가 header/footer/favicon/Open Graph 적용 기준을 충족한다.
  - `alt`, `aria-label`, 외부 링크 속성이 정리된다.
  - `typecheck`, `test`, `build`, 문구 스캔, responsive 확인 결과가 남는다.

---

## 2. 의존성 매트릭스

|         | F1 | F2 | F3 | F4 | F5 |
|---|:---:|:---:|:---:|:---:|:---:|
| F1 | — | → | △ | ✓ | → |
| F2 |   | — | → | △ | → |
| F3 |   |   | — | → | → |
| F4 |   |   |   | — | → |
| F5 |   |   |   |   | — |

**범례**:
- `✓`: 완전 독립 병렬 가능
- `→`: 순차 필요
- `△`: 대부분 독립이나 문구/섹션 배치 충돌 주의

---

## 3. 실행 순서 (Phase 기반)

### Phase A (2026-04-29 ~ 2026-04-30) — 브랜드와 진입 경로 고정

**이유**: 로고, 브랜드명, CTA는 이후 카피와 섹션의 기준점이다.

- F1 실행
- 로고 사용은 production 승인 전까지 임시 기준으로 분리
- 예상 완료: **M-Epic-1**

### Phase B (2026-04-30 ~ 2026-05-02) — 카피와 제품 구조 정렬

**이유**: 신규 업무 섹션을 만들기 전에 기존 문구와 제품 라인업의 기준을 맞춘다.

- F2 실행
- 금지 문구와 외부 브랜드명 스캔 추가
- 예상 완료: **M-Epic-2**

### Phase C (2026-05-02 ~ 2026-05-06) — 업무 매뉴얼형 섹션 MVP

**이유**: 이 Epic의 핵심 사용자 가치다. hero의 AI 오더 등록 약속을 실제 운영 흐름으로 이어준다.

- F3 실행
- 기존 섹션과 중복되는 설명을 줄임
- 예상 완료: **M-Epic-3**

### Phase D (2026-05-06 ~ 2026-05-08) — 애니메이션과 상태 표현

**이유**: MVP 섹션의 구조가 확정된 뒤 motion과 mock state를 얹어야 재작업이 줄어든다.

- F4 실행
- reduced motion, mobile layout 확인

### Phase E (2026-05-08 ~ 2026-05-10) — 자산, 메타데이터, 검증

**이유**: 공개 전 신뢰도와 배포성을 고정한다.

- F5 실행
- clean build와 문구 스캔 결과 정리
- 예상 완료: **M-Epic-4**

---

## 4. 진행 대시보드

| Feature | 상태 | TASK 진행 | 테스트 | 번들 영향 | 리뷰 |
|---|:---:|:---:|:---:|:---:|:---:|
| F1 | feature-package-ready | dev-feature 완료 | 계획됨 | 낮음 | dev-run 대기 |
| F2 | pending | — | — | — | — |
| F3 | pending | — | — | — | — |
| F4 | pending | — | — | — | — |
| F5 | pending | — | — | — | — |

상태 값: `pending` / `screening` / `approved` / `draft` / `scope-reviewed` / `bridged` / `feature-package-ready` / `active` / `archived`.

---

## 5. Screening 권장 순서

자식 Feature를 IDEA로 등록한 뒤 `/plan-screen`을 실행할 권장 순서다.

1. **F1 — 브랜드, 로고, CTA 최소 반영**: 작고 즉시 혼란을 줄이는 선행 작업
2. **F2 — 카피와 제품 라인업 정리**: 신규 섹션의 문구 기준
3. **F3 — 업무 매뉴얼형 스크롤 섹션 MVP**: Epic의 핵심 가치
4. **F4 — 업무 흐름 애니메이션과 상태 표현**: 구조 확정 후 고도화
5. **F5 — 브랜드 자산, 메타데이터, 검증 정리**: release readiness 마무리

---

## 6. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-28 | 초안 — `final-prompt-package` 기반 5개 자식 Feature와 Phase 실행 순서 정리 |
| 2026-04-28 | F1 자식 IDEA `IDEA-20260428-001` 등록 및 screening 대기 상태 반영 |
| 2026-04-28 | F1 screening 완료 — Go 제안, Lite lane, 사용자 승인 대기 |
| 2026-04-28 | F1 사용자 Go 승인 — `20-approved` 이동 |
| 2026-04-28 | Epic `planning` 전환 및 F1 Draft `f1-optic-brand-cta` 생성 |
| 2026-04-28 | F1 Draft scope review 통과 — 다음 단계 `/plan-bridge` |
| 2026-04-28 | F1 Bridge context 생성 — 다음 단계 `/dev-feature` |
| 2026-04-28 | F1 Feature Package 생성 — 다음 단계 `/dev-run` |
