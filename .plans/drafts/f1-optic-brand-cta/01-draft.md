# F1 브랜드, 로고, CTA 최소 반영 — 1차 기능 기획 (Draft)

> **Feature slug**: `f1-optic-brand-cta`
> **IDEA**: [IDEA-20260428-001](../../ideas/20-approved/IDEA-20260428-001.md)
> **Epic**: [EPIC-20260428-001](../../epics/10-planning/EPIC-20260428-001/00-epic-brief.md) (Phase A, F1)
> **작성일**: 2026-04-28
> **상태**: bridged
> **Lane**: Lite

---

## 1. 3중 판정 결과

| 축 | 결과 | 근거 |
|---|---|---|
| Lane | Lite | DB, API, 인증, 도메인 로직 변경 없음. `constants`, `Header`, `Footer`, `OpticLogo` 중심의 국소 UI/문구 변경이다. |
| 시나리오 | A | 신규 레퍼런스 copy 작업이 아니라 `final-prompt-package`를 현재 랜딩에 반영하는 브랜드 기준 정렬이다. |
| Feature 유형 | dev | 구현 대상은 코드 상수, UI 컴포넌트, 링크 속성, 접근성 라벨이다. |
| Hybrid | false | 별도 reference capture나 copy fidelity gap board가 필요하지 않다. |

## 2. 사용자 스토리

1. **As a** 랜딩 방문자, **I want** 제품명을 `OPTIC`으로 일관되게 인지하기를, **so that** 어떤 서비스를 기억하고 클릭해야 하는지 헷갈리지 않는다.
2. **As a** 서비스 도입을 검토하는 사용자, **I want** `OPTIC 바로가기`와 `도입 문의하기`가 서로 다른 행동임을 알기를, **so that** 서비스 확인과 문의를 빠르게 선택할 수 있다.
3. **As a** 모바일 방문자, **I want** 메뉴 안에서도 서비스 CTA와 문의 CTA가 구분되기를, **so that** 작은 화면에서도 주요 행동을 놓치지 않는다.
4. **As a** 이후 F2~F5를 구현할 개발자, **I want** 브랜드명, 서비스 URL, 보조 `OPTICS` 표기 기준이 상수와 문서에 남기를, **so that** 후속 카피와 자산 작업이 같은 기준을 따른다.

## 3. 러프 요구사항

### 3.1 브랜드 상수와 CTA 기준

- **R1**: `src/lib/constants.ts`에 주 브랜드 `OPTIC`, 보조 브랜드 `OPTICS`, 서비스 URL `https://mm-broker-test.vercel.app/`, CTA label을 한 곳에서 참조할 수 있게 정리한다.
- **R2**: `OPTIC 바로가기`는 서비스 확인 CTA로 사용하고, `도입 문의하기`는 문의 CTA로 유지한다.
- **R3**: `OPTICS`는 footer/About의 `Powered by OPTICS` 수준으로 제한한다.
- **R4**: `서비스 테스트` 같은 내부 검증성 문구는 F1 범위에서 새로 추가하지 않는다.

### 3.2 Header와 Mobile Menu

- **R5**: `src/components/sections/header.tsx`의 desktop header에 `OPTIC 바로가기` CTA를 추가하거나 기존 CTA와 함께 정렬한다.
- **R6**: `OPTIC 바로가기`는 새 탭 링크로 열고 `rel="noopener noreferrer"`를 포함한다.
- **R7**: 모바일 메뉴에도 `OPTIC 바로가기`와 `도입 문의하기`가 모두 보이게 하되, 목적이 다른 버튼처럼 구분한다.
- **R8**: 모바일 메뉴 CTA 클릭 시 기존처럼 메뉴가 닫힌다.

### 3.3 Footer와 Logo

- **R9**: `src/components/sections/footer.tsx`는 주 표기를 `OPTIC`으로 유지하고, `Powered by OPTICS`를 보조 표기로만 둔다.
- **R10**: `src/components/icons/optic-logo.tsx`는 production 승인 전까지 텍스트 기반 또는 기존 SVG 기반 임시 로고로 유지한다.
- **R11**: 로고나 브랜드 링크에는 접근성 이름이 남아 있어야 한다.

### 3.4 Out-of-scope

- hero 구조와 DashboardPreview 핵심 동작 재설계
- 공식 도메인 전환
- 신규 로고 권리/상표 최종 승인
- F2 카피 전면 교체, F3 업무 매뉴얼형 섹션 추가

## 4. 결정 포인트

| 항목 | 결정 | 근거 |
|---|---|---|
| 서비스 URL | `https://mm-broker-test.vercel.app/`를 상수로 분리해 사용 | 공개 불가 시 한 곳에서 비활성 또는 대체 URL 처리 가능 |
| 로고 | F1에서는 기존 `OpticLogo` 또는 텍스트 기반 임시 로고 유지 | 신규 이미지 권리/상표 리스크는 F5 release gate로 분리 |
| `OPTICS` 노출 | footer/About 보조 문구로 제한 | 고객이 기억할 주 브랜드는 `OPTIC`이어야 함 |
| PRD 필요 여부 | 생략 가능 | Lite lane이며 결정 포인트가 본 Draft에서 닫힘 |

## 5. 예상 작업 범위

| 영역 | 파일 | 작업 |
|---|---|---|
| 상수 | `src/lib/constants.ts` | 브랜드명, 서비스 URL, CTA label 상수화 |
| Header | `src/components/sections/header.tsx` | desktop/mobile CTA 분리, 외부 링크 속성 추가 |
| Footer | `src/components/sections/footer.tsx` | 주/보조 브랜드 표기 기준 유지 및 상수 참조 |
| Logo | `src/components/icons/optic-logo.tsx` | 접근성 label과 임시 로고 기준 확인 |
| Tests | 관련 test 파일 또는 신규 테스트 | CTA href, 새 탭 속성, 모바일 메뉴 렌더 확인 |

## 6. Acceptance Criteria

- 고객 노출 주 브랜드는 `OPTIC`으로 보인다.
- `OPTICS`는 보조 표기 수준으로만 남는다.
- desktop header와 mobile menu에 `OPTIC 바로가기`가 있다.
- `OPTIC 바로가기`는 `https://mm-broker-test.vercel.app/`를 새 탭으로 연다.
- `도입 문의하기`는 문의 CTA로 유지된다.
- 모바일 메뉴에서 두 CTA가 겹치거나 같은 목적처럼 보이지 않는다.
- 접근성 label, 외부 링크 속성, responsive 확인 결과가 남는다.

## 7. 검증 계획

| 검증 | 기준 |
|---|---|
| 문구 스캔 | `OPTIC`, `OPTICS`, `OPTIC 바로가기`, `서비스 테스트` 노출 위치 확인 |
| 테스트 | CTA href/target/rel, 모바일 메뉴 렌더 테스트 추가 또는 기존 테스트 갱신 |
| 타입 체크 | TypeScript 오류 없음 |
| 빌드 | landing app build 성공 |
| 수동 확인 | desktop/mobile에서 header와 mobile menu CTA 확인 |

## 8. 다음 단계

1. Bridge context가 생성되었으므로 `/dev-feature .plans/features/active/f1-optic-brand-cta/`로 진행한다.
2. 구현 전 `https://mm-broker-test.vercel.app/` 공개 가능성을 최종 확인한다.
3. 구현 단계에서 테스트와 responsive 확인 evidence를 남긴다.

## 9. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-28 | 초안 — F1 approved IDEA 기반 Lite Draft 생성 |
| 2026-04-28 | Scope review 통과 — PRD/Wireframe/Stitch 생략 가능, 다음 단계 `/plan-bridge` |
| 2026-04-28 | Bridge context 생성 — 다음 단계 `/dev-feature` |
