# Decision Log: dash-preview

> **Feature**: Dashboard Preview (Hero Interactive Demo)
> **Created**: 2026-04-14

---

## DEC-001: 시나리오를 AI 화물 등록으로 변경

- **날짜**: 2026-04-14
- **결정**: 수동 주문 등록(First-Pass 원안) → AI 화물 등록 과정으로 전환
- **근거**: OPTIC의 핵심 경쟁력인 AI 자동화를 첫 화면에서 시각적으로 증명
- **영향**: 5단계 시퀀스가 INITIAL→AI_INPUT→AI_EXTRACT→AI_APPLY→COMPLETE로 변경
- **PRD 반영**: v2에서 반영

## DEC-002: 참조 UI를 ai-register/page.tsx로 변경

- **날짜**: 2026-04-14
- **결정**: `register/page.tsx` → `ai-register/page.tsx`로 참조 변경
- **근거**: ai-register가 AI 화물 등록의 실제 구현체 (AiPanel + OrderRegisterForm)
- **영향**: 컴포넌트 트리가 실제 ai-register 구조에 맞게 재구성
- **PRD 반영**: v3에서 반영

## DEC-003: chrome 내부에서 Header/Breadcrumb 제외

- **날짜**: 2026-04-14
- **결정**: chrome 프레임 내부에는 main 컨텐츠(AiPanel + Form)만 표시
- **근거**: 페이지 셸 요소는 chrome 프레임이 대체. 순수 기능 영역만 보여야 밀도 전달 효과적
- **영향**: REQ-DASH-003 변경, 내부 레이아웃 단순화
- **PRD 반영**: v3에서 반영

## DEC-004: Hero 레이아웃 변경 철회

- **날짜**: 2026-04-14
- **결정**: 좌/우 분할 제안 철회 → 현재 중앙 정렬 단일 컬럼 유지
- **근거**: 기존 구성 요소(headline, subtitle, CTA) 변경 범위를 최소화
- **영향**: DashboardPreview는 placeholder 위치에만 삽입
- **PRD 반영**: v2에서 반영

## DEC-005: Phase 1/2 분리

- **날짜**: 2026-04-14
- **결정**: Phase 1(시네마틱 뷰) + Phase 2(인터랙티브 탐색)로 분리
- **근거**: Phase 1이 독립적 가치를 제공하고, Phase 2는 그 위에 레이어 추가
- **영향**: 요구사항 REQ-DASH-033~045 추가, Milestones 재구성
- **PRD 반영**: v4에서 반영

## DEC-006: 시네마틱 축소 뷰 (CSS transform: scale)

- **날짜**: 2026-04-14
- **결정**: OrderRegisterForm을 CSS `transform: scale(0.4~0.5)`로 축소하여 영상처럼 표현
- **근거**: 읽기 위한 UI가 아니라 밀도와 느낌을 전달하는 비주얼. 실제 컴포넌트가 아닌 시각 모형
- **영향**: 폰트/컴포넌트 모두 축소, 히트 영역에 scale 역변환 필요(Phase 2)
- **PRD 반영**: v2에서 반영

## DEC-007: Mobile 인터랙티브 모드 미지원

- **날짜**: 2026-04-14
- **결정**: Mobile(<768px)에서 Phase 2 인터랙티브 모드 비활성화
- **근거**: 터치 정밀도 한계로 축소 뷰 내 히트 영역 조작 불가
- **영향**: REQ-DASH-045 추가
- **PRD 반영**: v4에서 반영

## DEC-008: 히트 영역 11개로 확정

- **날짜**: 2026-04-14
- **결정**: Phase 2 히트 영역을 11개로 확정 (PRD 원안 "8~10개"에서 확장)
- **근거**: Wireframe 설계 시 DateTimePreview x2 + 표시 전용 영역이 추가되어 총 11개가 됨. 클릭 동작이 있는 영역 10개 + 표시 전용 1개. 기능적으로 문제 없으며 사용자 탐색 범위가 넓어지는 이점
- **영향**: PRD REQ-DASH-037의 "8~10개"를 "8~11개"로 범위 확장. Package 01-requirements.md 반영
- **PRD Amendment**: REQ-DASH-037 수치 범위 "8~10개" → "8~11개"

## DEC-009: Tablet scaleFactor 0.38 허용

- **날짜**: 2026-04-14
- **결정**: Tablet 뷰포트에서 축소 스케일 0.38을 허용 (PRD 범위 0.4~0.5에서 하향 확장)
- **근거**: Tablet(768~1023px)에서 chrome 프레임 + AiPanel + Form을 모두 수용하려면 0.4에서는 넘침 발생 가능. 0.38은 시각적 인지 한계 내
- **영향**: PRD의 축소 스케일 범위를 "0.38~0.5"로 확장. prd-freeze.md 변경 가능 항목 범위 갱신
- **PRD Amendment**: 축소 스케일 범위 "0.4~0.5" → "0.38~0.5"

## DEC-010: ScaledContent ref 기반 동적 높이 측정

- **날짜**: 2026-04-15
- **결정**: ScaledContent의 외부 래퍼 높이를 ref 기반 동적 측정(내부 scrollHeight × scaleFactor)으로 제한
- **근거**: CSS `transform: scale()`은 시각적으로만 축소하고 레이아웃 공간은 원본 크기를 유지. 높이 제한 없이 overflow: hidden만 적용하면 외부 컨테이너가 원본 높이(~800px+)를 차지하여 Hero에서 과도한 공간을 차지하는 버그 발생
- **영향**: preview-chrome.tsx ScaledContent에 useRef + useEffect + ResizeObserver 추가. 테스트 setup에 ResizeObserver mock 추가
- **대안 기각**: 고정 aspect-ratio(aspect-[16/9]) — 콘텐츠 변경 시 비율 재조정 필요하여 유지보수성이 낮음

## DEC-011: DateTimePreview를 LocationPreview 내부 필드로 통합

- **날짜**: 2026-04-15
- **결정**: PRD Section 7-1 컴포넌트 트리의 DateTimePreview x2를 별도 컴포넌트로 분리하지 않고 LocationPreview 내부의 날짜/시간 서브 필드로 구현
- **근거**: ai-register 페이지의 LocationForm이 주소 + 담당자 + 연락처 + 일시를 하나의 Card로 묶어 표시. 축소 뷰에서도 동일 구조 유지가 자연스러움. 컴포넌트 파일을 1개 줄여 번들 크기 최적화
- **영향**: Phase 1 구현에서 FormPreview의 LocationCard 내부에 일시 필드 포함. 별도 DateTimePreview 파일 없음. W-04 해결
- **PRD 반영**: Section 7-1 컴포넌트 트리 업데이트 필요 (DateTimePreview 제거)

## DEC-012: Phase 1 실측 결과 반영

- **날짜**: 2026-04-15
- **결정**: Phase 1 구현 및 시각 검증 후 다음 값을 확정
- **확정값**:
  - Desktop scaleFactor: **0.45** (PRD 범위 0.4~0.5 내)
  - Tablet scaleFactor: **0.38** (DEC-009에 의한 확장 범위)
  - ScaledContent 높이: ref 기반 동적 측정 (DEC-010)
  - 전체 루프 시간: **18초** (INITIAL 3 + AI_INPUT 4 + AI_EXTRACT 4 + AI_APPLY 4 + COMPLETE 3)
  - 번들 크기: **55.7KB** (전체 페이지, dash-preview chunk 단독은 측정 불가, 전체 예산 내)
  - 테스트 수: **154개** (Phase 1 완료 + 선택적 개선 3건)
- **영향**: Phase 2 설계 시 이 확정값을 기준으로 사용. Tablet 히트 영역 크기는 scaleFactor 0.38 기준으로 계산(16x16px 최소)
- **PRD 반영**: 별도 수정 불필요 (모두 PRD 허용 범위 내)
