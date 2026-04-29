# Roadmap — EPIC-20260428-001

> `final-prompt-package/07-implementation-roadmap.md`를 Epic 실행 단위로 재정리한 문서다.

---

## 1. Phase 요약

| Phase | 기간 | 목표 | 주요 산출물 |
|---|---|---|---|
| A | 2026-04-29 ~ 2026-04-30 | 브랜드/로고/CTA 최소 반영 | Header/Footer CTA, `OPTIC` 표기 기준 |
| B | 2026-04-30 ~ 2026-05-02 | 카피와 제품 라인업 정리 | 문구 상수, 제품 설명, 외부 브랜드명 제한 |
| C | 2026-05-02 ~ 2026-05-06 | 업무 매뉴얼형 섹션 MVP | `workflow-manual` 섹션과 데이터 구조 |
| D | 2026-05-06 ~ 2026-05-08 | 애니메이션과 상태 표현 | 단계별 motion, mock 상태 UI, 모바일 대응 |
| E | 2026-05-08 ~ 2026-05-10 | 자산/메타/검증 정리 | 로고 후보, Open Graph, 접근성, build/test evidence |

---

## 2. 구현 순서 원칙

1. 브랜드와 CTA를 먼저 고정한다.
2. 카피 기준을 맞춘 뒤 신규 섹션을 만든다.
3. 업무 섹션 MVP가 안정된 뒤 애니메이션을 붙인다.
4. production 성격이 강한 로고 권리/URL 공개 여부는 release gate로 분리한다.
5. 구현이 끝난 뒤가 아니라 각 Phase 종료 시 문구 스캔과 responsive 확인을 수행한다.

---

## 3. 검증 묶음

| 검증 | 실행 시점 | 통과 기준 |
|---|---|---|
| 문구 스캔 | Phase B 이후, Phase E | `Optic Cargo`, `서비스 테스트`, 금지 외부 브랜드명 잔존 없음 |
| 타입 체크 | 각 구현 Feature 종료 시 | TypeScript 오류 없음 |
| 테스트 | F1/F3/F5 종료 시 | Header CTA, workflow 렌더링, 접근성 테스트 통과 |
| 빌드 | Phase E | Next.js build 성공 |
| responsive 확인 | F3/F4/F5 | desktop/mobile에서 CTA와 섹션 텍스트 겹침 없음 |
| clean build | Phase E | workspace 의존 없이 `npm ci` + build 통과 |

---

## 4. 게이트

| 게이트 | 결정 필요 시점 | 기본 가정 | 막히면 |
|---|---|---|---|
| 로고 사용 권리 | F1 시작 전 또는 F5 release 전 | 제공 이미지는 시안 기준 | 기존 `OpticLogo` 개선으로 대체 |
| 실제 서비스 URL 공개 | F1 시작 전 | `https://mm-broker-test.vercel.app/` 새 탭 연결 | CTA 상수 분리 후 비활성 또는 내부 링크 처리 |
| 매입 정산 포함 | F3 시작 전 | MVP는 매출 정산 중심 | 매입 정산은 확장 Feature 후보로 분리 |
| 애니메이션 강도 | F4 시작 전 | 카드/타임라인 중심 | 고난도 motion은 후속 Feature로 분리 |
| 공식 도메인 | F5 release 전 | 현 URL 유지 | 도메인 정책 확정 전 Open Graph/CTA 문구만 정리 |

---

## 5. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-29 | F2 archive 완료 - `ARCHIVE-F2.md` 생성 및 sources 이동 |
| 2026-04-29 | F3 IDEA, screening, draft 완료 - `f3-workflow-manual-section` 생성 및 다음 단계 `/plan-prd` |
