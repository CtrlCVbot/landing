# 01. PRD Freeze - F1 브랜드, 로고, CTA 최소 반영

> Lite lane으로 PRD를 생략한 Feature다.
> 이 문서는 승인된 Draft + Scope Review를 `/dev-feature`용 PRD 대체 스냅샷으로 동결한다.

---

## 1. Source Documents

| 문서 | 경로 | 상태 |
|---|---|:---:|
| Draft | [01-draft.md](../../../../drafts/f1-optic-brand-cta/01-draft.md) | bridged |
| Scope Review | [03-scope-review.md](../../../../drafts/f1-optic-brand-cta/03-scope-review.md) | Approve |
| Routing Metadata | [07-routing-metadata.md](../../../../drafts/f1-optic-brand-cta/07-routing-metadata.md) | bridge done |
| Architecture Binding | [06-architecture-binding.md](./06-architecture-binding.md) | current |

## 2. Frozen Decision

| 항목 | 값 |
|---|---|
| Lane | Lite |
| Scenario | A |
| Feature type | dev |
| Hybrid | false |
| PRD required | false |
| Wireframe required | false |
| Stitch required | false |

## 3. Frozen Scope

### In

- 브랜드 상수화: `OPTIC`, `OPTICS`, 서비스 URL, CTA label
- Header CTA: desktop/mobile에 `OPTIC 바로가기`와 `도입 문의하기` 분리
- Footer 보조 표기: `Powered by OPTICS`는 보조 표기로 유지
- Logo 확인: 기존 텍스트/SVG 기반 임시 로고와 접근성 이름 유지
- Tests: Header/Footer/constants 중심의 자동 검증

### Out

- Hero 구조 변경
- DashboardPreview 동작 변경
- 업무 매뉴얼형 섹션 추가
- 카피 전면 교체
- 공식 도메인 전환
- 신규 로고 최종 승인

### Deferred

| 항목 | 상태 | 처리 |
|---|---|---|
| 서비스 URL 공개 가능성 | needs-verification | 구현 전 확인 |
| 로고 asset 최종 승인 | queued | F5 release gate |
| 모바일 CTA 시각 검수 | queued | 구현 검증 |

## 4. Acceptance Criteria

| AC | 기준 |
|---|---|
| AC-BRAND-01 | 고객 노출 주 브랜드는 `OPTIC`으로 보인다 |
| AC-BRAND-02 | `OPTICS`는 보조 표기 수준으로만 남는다 |
| AC-BRAND-03 | desktop header와 mobile menu에 `OPTIC 바로가기`가 있다 |
| AC-BRAND-04 | `OPTIC 바로가기`는 `https://mm-broker-test.vercel.app/`를 새 탭으로 연다 |
| AC-BRAND-05 | `도입 문의하기`는 문의 CTA로 유지된다 |
| AC-BRAND-06 | mobile menu에서 두 CTA가 겹치거나 같은 목적처럼 보이지 않는다 |
| AC-BRAND-07 | 접근성 label, 외부 링크 속성, responsive 확인 결과가 남는다 |

## 5. Dev Handoff

다음 단계는 `/dev-run .plans/features/active/f1-optic-brand-cta/`다.
구현자는 이 문서보다 [01-requirements.md](../02-package/01-requirements.md)를 요구사항 SSOT로 사용한다.
