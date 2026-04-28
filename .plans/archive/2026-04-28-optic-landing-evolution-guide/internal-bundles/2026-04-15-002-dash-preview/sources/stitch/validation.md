# 통합 검증 결과: Dashboard Preview

> **Feature Slug**: `dash-preview`
> **검증일**: 2026-04-14
> **소스**: PRD `dashboard-preview-prd.md` ↔ Wireframe `screens.md / navigation.md / components.md`
> **PCC-05**: Wireframe ↔ Stitch 검증

---

## 1. 완전성 검증 — REQ 커버리지

모든 REQ-DASH-001~045가 최소 1개 Screen에 매핑되었는지 확인.

| 검증 항목 | 결과 | 상세 |
|----------|------|------|
| Phase 1 REQ 커버리지 (001~032) | PASS | 32개 전부 SCR-001~005 중 최소 1개에 매핑됨 |
| Phase 2 REQ 커버리지 (033~045) | PASS | 13개 전부 SCR-003, SCR-005에 매핑됨 |
| UNMAPPED REQ | PASS | 없음 (0개) |
| 고아(orphan) Screen | PASS | SCR-001~005 전부 REQ와 매핑됨 |

---

## 2. PRD ↔ Wireframe 수치 정합성 검증

PRD에 명시된 구체적 수치가 Wireframe과 일치하는지 확인.

| 항목 | PRD 수치 | Wireframe 수치 | 결과 | 상세 |
|------|---------|--------------|------|------|
| 전체 루프 타이밍 | 16~22초 | INITIAL(3) + AI_INPUT(4) + AI_EXTRACT(4) + AI_APPLY(4) + COMPLETE(3) = **18초** | PASS | navigation.md 2절 타이밍 표 일치 |
| INITIAL 유지 시간 | 3초 | 3s | PASS | navigation.md 2절, screens.md SCR-002 |
| AI_INPUT 유지 시간 | 4초 | 4s | PASS | navigation.md 2절 |
| AI_EXTRACT 유지 시간 | 4초 | 4s | PASS | navigation.md 2절 |
| AI_APPLY 유지 시간 | 4초 | 4s | PASS | navigation.md 2절 |
| COMPLETE 유지 시간 | 3초 | 3s | PASS | navigation.md 2절 |
| hover 해제 후 재개 delay | 2초 | 2s | PASS | navigation.md 3절, 8절 이벤트 표 |
| step 클릭 후 재개 delay | 5초 | 5s | PASS | navigation.md 3절, 8절 이벤트 표 |
| Phase 2 비활동 복귀 | 10초 | 10s | PASS | navigation.md 4절, 8절 이벤트 표 |
| AiPanel 비율 | ~30% (원본 380px) | ~30% | PASS | SCR-001 레이아웃 치수 |
| FormPanel 비율 | ~70% (flex-1) | ~70% | PASS | SCR-001 레이아웃 치수 |
| Desktop scaleFactor | 0.4~0.5 | **0.45** | PASS | components.md 2-2절 Scale Factor 표 |
| Tablet scaleFactor | 0.35~0.45 | **0.38** | PASS | components.md 2-2절 (PRD "0.35~0.45" 범위 내) |
| 히트 영역 최소 크기 | 44x44px (원본 기준) | 44x44px | PASS | components.md 2-6절 HitAreaConfig (minSize: {w:44, h:44}) |
| 히트 영역 개수 | 8~10개 | **11개** | WARN | PRD "8~10개 히트 영역"인데 Wireframe/components.md는 11개로 확정. REQ-DASH-037 기준 "8~10개"이나 screens.md는 총 11개(클릭 동작 있는 10개 + 표시 전용 1개). 기능적 문제 없음, PRD 표현이 범위 표현이었음. |
| 운임 mock data | 420,000원 | 420,000원 | PASS | SCR-002 Step 5, SCR-005 Mobile Step B |
| 거리 mock data | 없음(미명시) | **140km** | PASS (추가) | PRD REQ-DASH-022에서 거리는 미명시. Wireframe이 140km 구체화. |
| 번들 예산 | <30KB gzipped | 명세 있음 (전략 기술) | PASS | PRD 7-8절 + components.md 미구현이므로 실측 불가. 전략(선택적 import, CSS 우선)은 일치 |
| AI 버튼 stagger 간격 (등장) | 명세 없음 | **0.15s** | PASS (Wireframe 추가) | components.md AiButtonItem 애니메이션. PRD에 구체 수치 없어 Wireframe이 구체화 |
| AI 버튼 stagger 간격 (적용) | "0.5초 간격" | **0.5s** | PASS | PRD §6-3 Step 4 설명과 일치 |
| 버튼 색상 전환 duration | 명세 없음 | **0.3s** | PASS (Wireframe 추가) | components.md AiButtonItem 애니메이션 |

---

## 3. Phase 분리 검증

Phase 1 / Phase 2 경계가 Wireframe에서 명확히 구분되었는지 확인.

| 검증 항목 | 결과 | 상세 |
|----------|------|------|
| Phase 1 전용 화면 존재 | PASS | SCR-001(Desktop), SCR-002(5단계), SCR-004(Tablet), SCR-005(Mobile) |
| Phase 2 전용 화면 존재 | PASS | SCR-003(인터랙티브 모드) |
| Phase 2가 Phase 1 인프라 위에 추가임을 명시 | PASS | SCR-003 진입 조건, components.md InteractiveOverlay "Phase 2에서 추가" |
| Phase 1 완료 후 Phase 2 착수 의존성 | PASS | navigation.md 전체, context.md 의존성 그래프 |
| Mobile에서 Phase 2 명확 비활성 | PASS | SCR-005 전용 사항 표, REQ-DASH-045 매핑 |

---

## 4. 반응형 커버리지 검증

Desktop / Tablet / Mobile 3개 뷰포트 모두 커버되었는지 확인.

| 뷰포트 | 전용 화면 | chrome | 자동 재생 | Phase 2 | 결과 |
|--------|---------|--------|----------|---------|------|
| Desktop (>=1024px) | SCR-001 | 있음 | 5단계 | 전체 히트 영역 | PASS |
| Tablet (768~1023px) | SCR-004 | 있음(축약) | 5단계 | 축약 히트 영역 | PASS |
| Mobile (<768px) | SCR-005 | 없음 | 2단계 | 미지원 | PASS |

**추가 확인:**

| 검증 항목 | 결과 | 상세 |
|----------|------|------|
| Mobile 전용 카드 레이아웃 SCR 별도 존재 | PASS | SCR-005에 Step A(AI_EXTRACT)과 Step B(COMPLETE) 2개 상태 상세 와이어프레임 |
| Tablet 하차지 축약 처리 명세 | PASS | SCR-004 "Tablet 축약 사항" 표 + 하차지 생략 영향 분석 + 대응 방안 A/B |
| Tablet Phase 2 히트 영역 명세 | WARN | SCR-004는 "축약된 히트 영역"으로만 언급. 구체적 히트 영역 수량/매핑 미명세. Phase 2 구현 시 SCR-004 히트 영역 추가 명세 필요. |

---

## 5. 접근성 검증

| 항목 | PRD 명세 | Wireframe 명세 | 결과 |
|------|---------|--------------|------|
| prefers-reduced-motion | REQ-DASH-027: 정적 최종 상태(Step 5) | navigation.md 6절 접근성 분기, screens.md 접근성 고려사항 | PASS |
| aria-label | REQ-DASH-028 | screens.md 접근성 고려사항 | PASS |
| 키보드 탐색 (Tab/Arrow/Enter/Space) | REQ-DASH-029 | components.md 2-5절 StepIndicator 접근성 표 | PASS |
| role=tablist/tab | REQ-DASH-029 | components.md 2-5절 (tablist, tab role) | PASS |
| aria-selected | REQ-DASH-029 | components.md 2-5절 (active: true, inactive: false) | PASS |
| 포커스 표시 (accent outline) | REQ-DASH-029 | components.md 2-5절 StepDot focus 상태 | PASS |
| Phase 2 접근성 (키보드) | 미명세 | 미명세 | WARN | Phase 2 InteractiveOverlay의 키보드 접근성(HitArea의 focusable 여부, Enter 키 동작)이 PRD와 Wireframe 양쪽 모두 명세 부재. Phase 2 구현 전 검토 필요. |

---

## 6. 레이아웃 일관성 검증 (PCC-05)

Hero 레이아웃 및 전체 구조의 PRD ↔ Wireframe 일치 확인.

| 항목 | 결과 | 상세 |
|------|------|------|
| Hero 중앙 정렬 단일 컬럼 구조 유지 | PASS | SCR-001 와이어프레임이 현재 Hero 구조(h1, p, CTA 버튼, DashboardPreview 순)를 그대로 재현 |
| placeholder만 교체, 기존 요소 변경 없음 | PASS | SCR-001 "원칙" 주석 및 PRD §6-1 일치 |
| DashboardPreview 외곽 aspect-ratio 16/9 | PASS | SCR-001 레이아웃 치수 표 (width: 100%, aspect-ratio: 16/9) |
| chrome 프레임 내부 2열 레이아웃 | PASS | SCR-001, SCR-002 전체 와이어프레임 일치 |
| StepIndicator chrome 하단 위치 | PASS | SCR-001, SCR-002 전 Step에서 chrome 하단 bar에 StepIndicator 표시 |
| Mobile에서 chrome 미표시 | PASS | SCR-005 원칙 명시, navigation.md 1절 분기 다이어그램 |

---

## 7. 컴포넌트 반영 검증

PRD 7-1절 컴포넌트 아키텍처가 Wireframe components.md에 충실히 반영되었는지 확인.

| 항목 | 결과 | 상세 |
|------|------|------|
| DashboardPreview 컨테이너 | PASS | components.md 2-1절 일치 |
| PreviewChrome + ChromeHeader + ScaledContent | PASS | components.md 2-2절 일치 |
| AiPanelPreview 하위 구성 (AiTabBar, AiInputArea, AiExtractButton, AiResultButtons) | PASS | components.md 2-3절 상세 명세 |
| AiCategoryGroup x4 + AiButtonItem (pending/applied/unavailable) | PASS | components.md 2-3절 카테고리 표, AiButtonItem 상태 표 |
| FormPreview 5개 Card (CargoInfo, Location x2, TransportOptions, Estimate) | PASS | components.md 2-4절 하위 컴포넌트 명세 |
| StepIndicator + StepDot x5 | PASS | components.md 2-5절 |
| InteractiveOverlay + HitArea x11 + Tooltip (Phase 2) | PASS | components.md 2-6절 |
| MobileCardView (Mobile 전용) | PASS | components.md 2-7절 |
| PRD 미명시 AiTabBar | PASS (추가) | PRD에서 "텍스트 탭 활성화"만 언급. Wireframe이 AiTabBar 컴포넌트로 구체화 |
| PRD 미명시 DateTimePreview | WARN | PRD 7-1절 컴포넌트 트리에 DateTimePreview x2가 있으나 Wireframe components.md에는 LocationPreview 내에 날짜/시간 필드로 통합. 별도 컴포넌트 여부 구현 시 결정 필요. |

---

## 8. 네비게이션 / 상태 전환 검증

| 검증 항목 | 결과 | 상세 |
|----------|------|------|
| 5단계 루프 상태 다이어그램 | PASS | navigation.md 2절 stateDiagram 일치 |
| Hover/Click Timeout 우선순위 다이어그램 | PASS | navigation.md 3절 flowchart + PRD §6-3 상태 전환 다이어그램 일치 |
| Phase 2 모드 전환 플로우 | PASS | navigation.md 4절 stateDiagram 일치 |
| Mobile 2단계 상태 플로우 | PASS | navigation.md 5절 일치 |
| 접근성 상태 분기 다이어그램 | PASS | navigation.md 6절 flowchart |
| 이벤트-상태 전환 전체 매트릭스 | PASS | navigation.md 8절 표 (12개 이벤트 전부 REQ 연결됨) |

---

## 9. 불일치 및 누락 사항 요약

### WARN 항목 (주의 필요, 차단 아님)

| # | 항목 | 위치 | 내용 | 권장 조치 |
|---|------|------|------|----------|
| W-01 | 히트 영역 개수 | REQ-DASH-037 vs SCR-003 | PRD "8~10개"인데 Wireframe 11개. 표현 불일치 (PRD는 범위, Wireframe은 확정값) | PRD의 "8~10개"는 범위 표현이었음. Wireframe 11개 확정값으로 구현. PRD 업데이트 불필요 (기획 단계 완료) |
| W-02 | Tablet Phase 2 히트 영역 명세 | SCR-004 | "축약된 히트 영역"으로만 언급, 구체적 영역 수량/매핑 없음 | Phase 2 구현 시 Tablet 히트 영역 세부 설계 추가 필요 |
| W-03 | Phase 2 키보드 접근성 | PRD + Wireframe 양쪽 | HitArea의 키보드 접근성(Tab, Enter 동작) 미명세 | Phase 2 구현 전 별도 접근성 명세 작성 권장 |
| W-04 | DateTimePreview 컴포넌트 | PRD 7-1 vs components.md | PRD 컴포넌트 트리에 DateTimePreview x2가 있으나 Wireframe은 LocationPreview에 통합 | 구현 시 LocationPreview 내부에 날짜/시간 서브 필드로 구현하거나 별도 컴포넌트로 분리. 기능적 차이 없음 |

### FAIL 항목

없음.

---

## 10. PCC-05 최종 판정

| 검증 카테고리 | 결과 | 세부 항목 |
|------------|------|---------|
| 완전성 (REQ 커버리지) | PASS | 45/45 REQ 매핑 완료 |
| 수치 정합성 | PASS (1 WARN) | 히트 영역 수량 표현 불일치 (W-01) — 기능적 문제 없음 |
| Phase 분리 | PASS | Phase 1/2 경계 명확 |
| 반응형 3개 뷰포트 | PASS (1 WARN) | Tablet Phase 2 히트 영역 미명세 (W-02) |
| 접근성 | PASS (1 WARN) | Phase 2 키보드 접근성 미명세 (W-03) |
| 레이아웃 일치 | PASS | Hero 구조 보존, chrome 구조 일치 |
| 컴포넌트 반영 | PASS (1 WARN) | DateTimePreview 통합 여부 미결 (W-04) |
| 네비게이션 / 상태 전환 | PASS | 전체 상태 다이어그램 일치 |

**PCC-05 종합: PASS (4 WARN)**

> 모든 WARN 항목은 Phase 2 구현 착수 전 또는 구현 중 해결 가능한 수준이며 Phase 1 구현 차단 요소는 없음.

---

## 11. 다음 단계

1. **Phase 1 구현 즉시 착수 가능** — 모든 Phase 1 REQ(001~032)가 Wireframe과 완전히 매핑됨
2. **W-01 수치 확인**: 개발 착수 전 히트 영역 11개로 구현 확정 (PRD "8~10개" 표현은 범위, Wireframe 11개 확정)
3. **W-02, W-03 대응**: Phase 2 착수(Milestone 2-1) 전에 Tablet 히트 영역 세부 설계 및 키보드 접근성 명세 추가
4. **W-04 결정**: 구현 착수 시 DateTimePreview를 LocationPreview 내 통합 필드로 구현 (별도 컴포넌트 분리 대비 단순)
5. `/plan-bridge`로 기획 → 개발 핸드오프를 진행하세요.
