# Bridge: Wireframe Summary — dash-preview

> **Source**: `.plans/wireframes/dash-preview/` (screens.md, navigation.md, components.md)
> **Created**: 2026-04-14

---

## 화면 목록

| Screen ID | 이름 | 뷰포트 | Phase | 핵심 |
|-----------|------|--------|-------|------|
| SCR-001 | Desktop Hero 전체 | >=1024px | 1 | Hero 중앙 정렬 유지, placeholder를 DashboardPreview로 교체 |
| SCR-002 | DashboardPreview 내부 5단계 | Desktop | 1 | INITIAL→AI_INPUT→AI_EXTRACT→AI_APPLY→COMPLETE 시네마틱 루프 |
| SCR-003 | 인터랙티브 모드 | Desktop | 2 | 11개 히트 영역, hover 하이라이트+툴팁, 클릭 mock 실행 |
| SCR-004 | Tablet 축약 뷰 | 768~1023px | 1 | chrome 유지, FormPanel 3개 Card로 축소 |
| SCR-005 | Mobile 카드 뷰 | <768px | 1 | chrome 없음, 2단계(AI_EXTRACT→COMPLETE) 자동 전환 |

## 핵심 레이아웃

```
chrome frame 내부 (Header/Breadcrumb/Sidebar 제외):
┌─ AiPanel (~30%) ─┐┌─ FormPanel (~70%) ─┐
│ AiInputArea      ││ CargoInfoForm Card │
│ [추출하기]        ││ LocationForm x2    │
│ AiResultButtons  ││ TransportOptions   │
│  (4 카테고리)     ││ EstimateInfoCard   │
└──────────────────┘└────────────────────┘
        ● ● ● ● ● (StepIndicator)
```

## 상태 머신

5단계 자동 재생 (18초 루프): INITIAL(3s) → AI_INPUT(4s) → AI_EXTRACT(4s) → AI_APPLY(4s) → COMPLETE(3s) → 루프

## 컴포넌트 수

- Phase 1: 컴포넌트 7개 + 라이브러리 2개
- Phase 2: 추가 1개 (interactive-overlay.tsx)
- 테스트: 7개 파일
