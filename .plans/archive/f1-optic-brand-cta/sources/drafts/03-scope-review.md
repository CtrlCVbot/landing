# Scope Review — f1-optic-brand-cta

> **대상**: [01-draft.md](./01-draft.md)
> **IDEA**: [IDEA-20260428-001](../../ideas/20-approved/IDEA-20260428-001.md)
> **Screening**: [SCREENING-20260428-001](../../ideas/20-approved/SCREENING-20260428-001.md)
> **Epic**: [EPIC-20260428-001](../../epics/10-planning/EPIC-20260428-001/00-epic-brief.md)
> **작성일**: 2026-04-28
> **판정**: Approve

---

## 1. 결론

F1 Draft scope는 승인 가능하다. 변경 범위가 `constants`, `Header`, `Footer`, `OpticLogo`, CTA 테스트에 국한되어 있고, Screening의 Lite 판정과 일치한다.

PRD, Wireframe, Stitch는 생략 가능하다. 다음 단계는 `/plan-bridge f1-optic-brand-cta` 또는 Lite dev handoff다.

## 2. 리뷰 기준

| 축 | 등급 | 근거 |
|---|:---:|---|
| 완전성 | A | 목표, 사용자 스토리, 요구사항, out-of-scope, 결정 포인트, 검증 계획이 모두 있다 |
| 일관성 | A | IDEA, Screening, Epic의 브랜드/CTA 범위와 일치한다 |
| 실현가능성 | A | 현재 코드에 대상 파일이 존재하고, 변경이 UI/상수 범위에 머문다 |
| 사용자 중심성 | A | 방문자, 모바일 사용자, 후속 구현자 관점의 스토리가 분리되어 있다 |

## 3. PCC 검증

| PCC | 결과 | 근거 |
|---|:---:|---|
| PCC-01 Idea ↔ Screen | PASS | IDEA는 `approved`, Screening은 `Go / Lite / approved`다 |
| PCC-02 Screen ↔ Feature | PASS | approved IDEA에 대응하는 Draft가 존재한다 |
| PCC-08 상태 동기 | PASS | backlog, screening-matrix, Epic children, Draft 상태가 F1 진행 상태를 같은 방향으로 가리킨다 |
| PCC-09 의존성 현재성 | PASS | F1은 Phase A 선행 작업이며 F2~F5의 기준점 역할과 맞다 |

## 4. Scope 판정

| 구분 | 판정 | 메모 |
|---|:---:|---|
| 브랜드 상수화 | In | `OPTIC`, `OPTICS`, 서비스 URL, CTA label 정리 |
| Header CTA | In | desktop/mobile에서 `OPTIC 바로가기`와 문의 CTA 구분 |
| Footer 보조 표기 | In | `Powered by OPTICS`는 보조 표기로 유지 |
| Logo 최종 승인 | Deferred | F5 release gate에서 처리 |
| hero 구조 변경 | Out | F1 범위 초과 |
| 업무 매뉴얼형 섹션 | Out | F3 범위 |
| 카피 전면 교체 | Out | F2 범위 |

## 5. 조건부 확인 사항

| 항목 | Severity | Confidence | Action | 메모 |
|---|---|---|---|---|
| 서비스 URL 공개 가능성 | medium | likely | needs-verification | 구현 전 `https://mm-broker-test.vercel.app/` 공개 노출 가능성을 확인한다 |
| 로고 자산 승인 | medium | likely | queued | F1에서는 임시/기존 로고 기준으로 진행하고 F5에서 release gate 처리 |
| 모바일 CTA 배치 | low | likely | queued | 구현 시 375px 기준 겹침 없는지 확인한다 |

## 6. 다음 단계

1. `/plan-bridge f1-optic-brand-cta`로 개발 핸드오프 문서를 만든다.
2. Bridge에서 service URL 공개 가능성 확인 항목을 유지한다.
3. 구현 단계에서 CTA 링크 속성, 접근성 label, 모바일 메뉴 렌더 테스트를 포함한다.
