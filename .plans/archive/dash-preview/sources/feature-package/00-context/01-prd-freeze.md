# PRD Freeze Reference: dash-preview

> **Frozen PRD**: `.plans/prd/10-approved/dashboard-preview-prd.md`
> **Frozen Version**: Draft v4 (Approved)
> **Frozen Date**: 2026-04-14

---

## PRD 핵심 요약

- **Feature**: Hero placeholder를 AI 화물 등록 시네마틱 축소 뷰로 교체
- **Phase 1**: 자동 재생 5단계 (INITIAL→AI_INPUT→AI_EXTRACT→AI_APPLY→COMPLETE, 18s 루프)
- **Phase 2**: 인터랙티브 탐색 (hover 하이라이트 + 클릭 mock 실행)
- **요구사항**: 45개 (Phase 1: Must 25 + Should 7 / Phase 2: Must 11 + Should 2)
- **Goals**: G1~G9 (Phase 1: G1~G6, Phase 2: G7~G9)
- **Non-Goals**: NG1~NG6 (실제 DB/API 없음, 단일 시나리오, 다국어 없음)

## 변경 금지 항목

PRD 동결 후 다음 항목은 변경 시 PRD 재승인이 필요하다:

- 5단계 시퀀스 구조 및 순서
- Mock data 데이터 구조 (값은 변경 가능)
- Hero 레이아웃 보존 원칙
- 참조 UI (ai-register/page.tsx main 영역)
- 번들 예산 30KB, LCP +100ms 제한
- Phase 1/2 경계

## 변경 가능 항목

PRD 재승인 없이 개발 단계에서 조정 가능:

- Mock data 구체적 값 (카톡 메시지 텍스트, 주소, 금액 등)
- 축소 스케일 팩터 (0.4~0.5 범위 내 조정)
- 애니메이션 easing/duration 미세 조정
- Step별 유지 시간 미세 조정 (총합 16~22초 범위 내)
- 컴포넌트 내부 구현 방식 (props 구조, 훅 분리 등)
