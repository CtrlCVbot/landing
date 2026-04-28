# Epic: dash-preview Phase 4 — Phase 3 피드백 반영

> **ID**: EPIC-20260422-001
> **상태**: active
> **기간**: 2026-04-23 ~ 2026-05-20 (예상, 약 4주)
> **책임자**: landing 프론트엔드 팀
> **예상 RICE (가중합)**: 자식 Feature 5건 RICE 평균 산정 예정 (Phase 2 스크리닝 후 확정)

---

## 1. 목적 (Why)

dash-preview Phase 3 가 2026-04-22 archived 상태로 종료된 직후, 사용자는 실제 미리보기를 사용해 본 뒤 10건의 후속 피드백을 전달했다 (출처: `.plans/archive/dash-preview-phase3/improvements/issues.md`). 피드백은 "라이트 모드 부재·데이터 불일치·레이아웃 밀도·상호작용 정확도·UI 잔재" 5 영역에 걸쳐 있으며, 단일 Feature 로는 다룰 수 없는 cross-cutting 성격(테마 토큰·mock 스키마·hit-area 좌표 등)이 강하다.

본 Epic 은 Phase 3 아카이브된 dash-preview 제품 라인의 **충실도·신뢰성·접근성** 을 Round 2 로 끌어올리는 것을 목표로, 10건 이슈를 5 개 Feature 로 그룹화해 의존성을 명시적으로 관리하며 순차·병렬 실행한다. Phase 3 에서 확립한 "AI 추출 → 폼 적용" 내러티브가 실제로 일관되게 동작하도록 mock 스키마를 재설계하고, 라이트 모드 지원으로 접근성 기준(WCAG AA)을 확장한다.

---

## 2. 성공 지표 (What)

- **지표 1 — AI 추출값 ↔ 폼 적용값 완전 일치**: `DELIVERY_MOCK` · `CARGO_MOCK` · `ESTIMATE_MOCK` 의 모든 표시 필드가 AI 카테고리 표시값과 1:1 일치 (텍스트·숫자·단위). 단위 테스트 로 자동 검증.
- **지표 2 — AI_APPLY 이전 단계에서 완성 수치 미노출**: CompanyManager 외 상/하차지, 일시, 화물, 옵션, estimate, settlement가 Step 미만일 때 placeholder 또는 neutral state. 스텝별 가시성 테스트 추가.
- **지표 3 — 3 개 이상 시나리오 세트 순환**: `PREVIEW_MOCK_SCENARIOS` 배열에 demo-safe randomizable 세트 3개 이상 등록 + 선택기 함수 동작. preview loop가 새 cycle로 돌아올 때 직전 세트를 제외하고 random 선택.
- **지표 4 — 라이트/다크 양 팔레트 지원 + 전환 경로**: `prefers-color-scheme` 또는 토글 기준으로 라이트 모드 전환 시 **landing 사이트 전역** (hero·features·pricing·footer·navbar·dash-preview 포함) 모든 컴포넌트가 식별 가능한 대비 확보. axe-core 라이트 모드 0 violations.
- **지표 5 — 인터랙티브 오버레이 위치 정확도**: 19 개 hit-area 의 실제 DOM bounding box 와 `ring-2` 하이라이트의 편차 ≤ 2 px (Desktop 1440 · Tablet 768 양 뷰포트 기준). 스냅샷 비교 테스트.

---

## 3. 범위 (Scope)

### In-scope (자식 Feature 목록)

- **F1 — 라이트 모드 전환 인프라 (landing 전역)** (IDEA-20260423-002)
  - 범위: `globals.css` 토큰 이중화 + `tailwind.config.ts` 변수 매핑, `ThemeProvider` 도입, **landing 사이트 전역** 컴포넌트 (hero · features · pricing · footer · navbar + dash-preview 하위 7 개 파일 + shared UI) 의 다크 하드코딩 클래스 (`bg-white/5`·`text-white`·`from-gray-900/50` 등) 토큰 치환, `layout.tsx` 통합. 이슈 [1] 전체.

- **F2 — Mock 스키마 재설계 (추출/적용 분리 + 시나리오 세트)** (IDEA-20260424-001)
  - 범위: `PREVIEW_MOCK_DATA` 단일 상수를 `extractedFrame`/`appliedFrame` 분리 구조 + `PREVIEW_MOCK_SCENARIOS` 배열로 전환. demo-safe random scenario 3개 순환, fixture-only scenario 분리, CompanyManager 외 추출 대상 전체 pre-apply hidden, `AI_APPLY` 내부 staged reveal timeline 도입. 이슈 [2-1], [2-2], [2-3], [2-4].

- **F3 — 옵션↔추가요금 파생 로직** (IDEA-20260427-002)
  - 범위: `OPTION_FEE_MAP` 도입, `options` 변화에 따라 `additionalFees` 파생. `settlement-section` 소스 전환. 이슈 [2-5] 단일.

- **F4 — 레이아웃 정비 + Hit-Area 재정렬** (IDEA-20260424-002)
  - 범위: Col 2 내부 pickup/delivery `DateTimeCard` 2열 grid 재배치, `hit-areas.ts` 전면 좌표 재측정 (ChromeHeader offset 보정 포함 여부 결정), Tablet 좌표 분리 여부 결정. 이슈 [3], [4].

- **F5 — UI 잔재 정리 (JSON 뷰어 숨김 + 라벨 변경)** (IDEA-20260423-001)
  - 범위: `AiExtractJsonViewer` 의 `ai-panel/index.tsx` 렌더 제거 + `hit-areas.ts` · tooltip 엔트리 제거 (컴포넌트 파일·`jsonViewerOpen` mock 필드는 유지 — F2 에서 일괄 이관 예정). 통합 테스트는 "JSON 뷰어 미렌더" 단정으로 갱신. `estimate-info-card` 의 "자동 배차" 라벨을 "자동 배차 대기"로 교체 (tooltip·JSDoc·테스트 기대 문자열 동기 범위 결정). 이슈 [5], [6].

### Out-of-scope

- 토큰 치환을 기회로 한 대규모 디자인 시스템 리팩토링 — 차기 Epic 후보
- AI 실호출 연동 (현재 mock 시네마틱 한정) — Epic 5+ 수준의 별도 Theme
- SSR/SSG 전환 (현재 CSR 가정) — 인프라 레벨 변경, 별도 Phase
- 모바일 390 px 이하 가로 뷰 재설계 — Phase 5+ 후보
- 다국어(i18n) 문구 — 현재 모든 라벨 한국어 고정

---

## 4. 자식 Feature 요약

상세는 [`01-children-features.md`](./01-children-features.md) 참조.

| Feature | 예상 RICE | 권장 순서 | Lane | Target 기간 |
|---|:---:|:---:|:---:|---|
| F1 — 라이트 모드 전환 (landing 전역) | 미정 (Phase A) | 1차 | Standard | 2026-04-23 ~ 2026-05-06 (범위 확장으로 타이트) |
| F5 — UI 잔재 정리 | 미정 (Phase A) | 1차 병렬 | Lite | 2026-04-23 ~ 2026-04-27 |
| F2 — Mock 스키마 재설계 | 미정 (Phase B) | 2차 | Standard | 2026-05-01 ~ 2026-05-14 |
| F4 — 레이아웃+Hit-Area | 미정 (Phase B) | 2차 병렬 | Standard | 2026-05-01 ~ 2026-05-10 |
| F3 — 옵션↔추가요금 파생 | 미정 (Phase C) | 3차 (F2 이후) | Lite | 2026-05-14 ~ 2026-05-20 |

---

## 5. 마일스톤 (Epic 수준)

- **M-Epic-1 (2026-05-06)**: Phase A 완료 — 라이트 모드 MVP (**landing 전역**) + JSON 뷰어 숨김 + 라벨 변경 반영. 테마 토글 또는 자동 전환 중 하나 동작.
- **M-Epic-2 (2026-05-14)**: Phase B 완료 — mock 재설계 (3 세트 이상) + AI 추출/적용 일관성 100% + DateTime 2열 + hit-area 재정렬.
- **M-Epic-3 (2026-05-20)**: Phase C 완료 — 옵션↔추가요금 파생 반영 + Epic archive 준비 (5 Feature 모두 archived).

---

## 6. 리스크

| # | 리스크 | 완화 |
|---|---|---|
| 1 | F1 의 **landing 전역 토큰 스윕** (2026-04-23 확장) 이 F2·F3·F4 의 dash-preview 컴포넌트 편집과 광범위 충돌 가능 — 머지 충돌 + 리뷰 범위 확대 | Phase A (F1) · Phase B/C (F2/F3/F4) 로 Phase 분리. 병렬 구간은 F5 (독립 파일) 로 한정. F1 내부는 **섹션별 PR 분할** (hero / features / pricing / footer / dash-preview 등 5~6 개 PR) 권장 |
| 2 | F2 mock 스키마 재설계 후 기존 테스트 대량 갱신 필요 (mock-data.test.ts, ai-panel 통합 테스트 등) | 스키마 설계 완료 시점에 테스트 마이그레이션 계획 별도 수립. F5 의 테스트 제거와 같은 파일 충돌 사전 차단 |
| 3 | F4 hit-area 재정렬이 DateTimeCard 2열 배치 결정에 의존 — 독립 작업 불가 | F4 를 단일 Feature 로 유지 (이슈 [3] + [4] 같은 Feature 내부 순차) |
| 4 | F3 `OPTION_FEE_MAP` 의 매핑 스펙이 원문 부재 — 사용자 추가 확정 필요 | `/plan-idea F3` 등록 시 "매핑 스펙 확정 필요" 를 pending question 으로 명시. Phase C 진입 전 결정 게이트 |
| 5 | 라이트 모드 전환 트리거 (토글 vs `prefers-color-scheme`) 가 원문 불명확 | `/plan-draft F1` 에서 Lite/Standard 판정과 함께 트리거 방식 A/B/C 옵션 사용자 선택 |
| 6 | F1 범위 확장 (dash-preview → landing 전역) 으로 Phase A 2주 Target 이 타이트 — M-Epic-1 (2026-05-06) 슬립 위험 | 토큰 매핑 결정표를 Phase A 초기에 선행 작성 + 섹션별 독립 PR 로 단계 merge. 위험 감지 시 Phase A 만 1주 연장 (2026-05-13) 재판단 |

---

## 7. 자식 IDEA 링크

(Phase 2 `/plan-idea --epic=EPIC-20260422-001` 실행 시 자동 등록)

- [IDEA-20260423-002 — F1 라이트 모드 전환 인프라](../../../archive/f1-landing-light-theme/sources/ideas/IDEA-20260423-002.md)
- [IDEA-20260424-001 — F2 Mock 스키마 재설계](../../../archive/f2-mock-schema-redesign/sources/ideas/IDEA-20260424-001.md)
- [IDEA-20260427-002 — F3 옵션↔추가요금 파생 로직](../../../ideas/10-screening/IDEA-20260427-002.md)
- [IDEA-20260424-002 — F4 레이아웃 정비 + Hit-Area 재정렬](../../../archive/f4-layout-hit-area-realignment/sources/ideas/IDEA-20260424-002.md)
- [IDEA-20260423-001 — F5 UI 잔재 정리 (JSON 뷰어 + 라벨)](../../../archive/f5-ui-residue-cleanup/sources/ideas/IDEA-20260423-001.md)

---

## 8. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-22 | 초안 — Phase 3 improvements/issues.md (10건) + proposals.md (A/B/C + C1/C2) 분석 기반 5 Feature 구성 확정 |
| 2026-04-23 | F5 자식 IDEA 등록 (IDEA-20260423-001) — §7 링크 반영 |
| 2026-04-23 | F1 자식 IDEA 등록 (IDEA-20260423-002) — §7 링크 반영 |
| 2026-04-23 | F5 A 섹션 방향 수정 — 파일 삭제 → 화면 숨김 (컴포넌트 파일·`jsonViewerOpen` mock 필드 유지). §3 F5 범위 + §5 M-Epic-1 문구 동기 |
| 2026-04-23 | F1 범위 확장 — dash-preview 한정 → **landing 사이트 전역**. §2 지표 4 + §3 F1 범위 (IDEA-20260423-002 링크 반영) + §4 표 제목 + §5 M-Epic-1 + §6 리스크 1 수정 + 리스크 6 추가 동기 |
| 2026-04-27 | F4 archive 완료 — §7 IDEA 링크를 archive sources 경로로 갱신 |
| 2026-04-24 | Epic 상태를 active 로 동기화하고, F1/F5 archive 링크와 F2/F4 신규 IDEA 링크를 반영 |
| 2026-04-24 | F2/F4 screening Go 승인 및 draft 생성 링크를 approved IDEA 경로로 동기화 |
| 2026-04-24 | F2/F4 PRD 작성 및 PRD review 완료 상태를 반영. 두 리뷰 모두 Approve, critical/high 없음. |
| 2026-04-24 | F2/F4 Bridge 완료 — active feature `00-context` 생성 및 Epic binding 작성. |
| 2026-04-27 | F2 archive 완료 — mock schema split, random scenario rotation, pre-apply hidden, staged apply timing 반영. §2/§3/§7 링크를 archive 기준으로 갱신. |
| 2026-04-27 | F3 IDEA 등록 — IDEA-20260427-002 링크를 §3/§7 에 반영하고 Phase C 진입 상태로 동기화. |
| 2026-04-27 | F3 screening 완료 — Go 제안, 77.8점, Lite lane. 사용자 승인 후 draft 진입 예정. |
