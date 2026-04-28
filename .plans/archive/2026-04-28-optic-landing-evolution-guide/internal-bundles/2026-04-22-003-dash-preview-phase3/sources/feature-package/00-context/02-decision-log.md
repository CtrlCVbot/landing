# Decision Log: dash-preview-phase3 (기획 단계 P1~P5)

> **Feature**: Dashboard Preview Phase 3
> **Slug**: `dash-preview-phase3`
> **범위**: 기획 결정 (P1 Idea ~ P5 Wireframe). 시각 설계 결정은 [`sources/wireframes/decision-log.md`](../sources/wireframes/decision-log.md)로 분리 기록.
> **Created**: 2026-04-17
> **Last Updated**: 2026-04-17

---

## 0. 이 문서 구성

본 문서는 Phase 3 **기획 파이프라인(P1~P5)** 에서 내린 결정을 시간순으로 정리한다. 시각 설계 중심 결정(ASCII 도식, 조작감 타이밍, Column 이동 경로 등)은 wireframe decision-log에 있으며, 여기서는 **기획 판정(Go/Hold, 시나리오, Feature 유형) + PCC/선결 질문 해소 이력 + PRD 주요 결정**을 기록한다.

중복 방지: wireframe decision-log §1~§5 내용은 참조 링크만 남김.

---

## 1. 2026-04-17 — P1 IDEA 승인

### 요약

첫 승인 진입점. IDEA-20260417-001 "Dashboard Preview Phase 3: Pixel-Perfect Preview + 조작감 10종"이 inbox → approved 승격.

### 배경

- Phase 1/2는 축약 재구성(7 컴포넌트 + 라이브러리 2 + 인터랙티브 오버레이 1) 규모의 "시네마틱 + 인터랙티브 데모"로 완료.
- Cursor.com `demo-window-cursor-ide` 벤치마크 대비 픽셀 정확도·조작감 모두 열위 판정.
- 사용자 피드백 "진짜 제품처럼 보였으면 좋겠다" 수용 → Phase 3 제안.

### 반영 위치

- `.plans/ideas/20-approved/IDEA-20260417-001.md`

---

## 2. 2026-04-17 — P2 Screening (RICE 70.0 / Go)

### 요약

RICE 기준 재평가 후 **Go** 판정. 점수 **70.0**. Screening 문서에 re-scoring 이력 포함.

### 주요 평가

| 축 | 근거 |
|----|------|
| Reach | 랜딩 방문자 전체. Hero 영역 placeholder 교체 효과 |
| Impact | 도입 의사결정 단축 + 전환율 기여 (영업 자료 재사용 가능) |
| Confidence | Phase 1/2 학습 기반. 원본 broker 접근 가능 |
| Effort | 18~22일 (Spike 1일 포함 시 19~23일) |

### 반영 위치

- `.plans/ideas/20-approved/SCREENING-20260417-001.md`
- **승인 게이트 통과**: 사용자 "추천항목들로 진행" 명시 승인

---

## 3. 2026-04-17 — P3 Draft 3중 판정

### 판정 결과

| 항목 | 확정 |
|------|------|
| Lite/Standard | **Standard** (claude-kit 6개 트리거 전부 충족) |
| 시나리오 | **C (충실도 교정)** — Spike 결과에 따라 A 전환 여지 유지 |
| Feature 유형 | **Hybrid (reference-only)** — `/copy-reference-refresh`만 활용, visual/interaction review는 Phase 1 스펙을 spec source로 대체 |

### Standard 판정 트리거 (6개 전부 충족)

1. 신규 컴포넌트 10개 이상 생성 (21+)
2. 기존 컴포넌트 구조적 변경 (dashboard-preview 전면 확장)
3. 외부 라이브러리 신규 도입 (shadcn 3-C 하이브리드)
4. 18~22일(1 FT) 공수
5. 테스트 전략 재설계 필요
6. 성능 예산 재협상 필요 (승인 완료)

### Hybrid (reference-only) 운영 모드

- **copy 요소**: ai-register 원본 대응, 시각/인터랙션 차이 닫기
- **dev 요소**: 조작감 레이어 10종은 landing 독자 연출 (원본에 없음)
- **특수성**: 원본이 **운영 URL 아닌 source code** → 일반 copy live 캡처 워크플로우 상이

### 반영 위치

- [`00-context/07-routing-metadata.md`](./07-routing-metadata.md)
- [`drafts/dash-preview-phase3/first-pass.md`](../../../drafts/dash-preview-phase3/first-pass.md)

---

## 4. 2026-04-17 — P4 PRD 작성 및 UX 피드백 반영 (다회)

### 요약

PRD 초안(REQ-DASH3-001~074) 작성 → 리뷰 피드백 2차 + UX 피드백 5차 반영 → review passed (2026-04-17).

### 주요 결정 사항 (시간순)

#### 4-1. PRD 초안

- 12 섹션 (필수 10 + PCC/다음단계 2)
- REQ 그룹: 복제(001~007) / 데이터모델(010~014) / 조작감(020~031) / AI_APPLY 2단(040~044) / 아키(050~053) / 성능접근성(060~066) / 테스트(070~074) — 7개 그룹 47 ID sparse 할당

#### 4-2. 리뷰 피드백 반영

| 심각도 | 건수 | 주요 이슈 |
|-------|------|-----------|
| MEDIUM | 2 | REQ-DASH3-072 유틸 개수 정합, REQ-DASH-027 재정의 분류 |
| LOW | 3 | 변경이력 정밀화, REQ-DASH3-003/004 파일 수 표현, G4 권고/확정 분리 |

#### 4-3. UX 피드백 반영 ("끊김 없는 연속 동작" 원칙)

| 변경 | 내용 |
|------|------|
| 총 루프 단축 | 13~18초 → **6~8초** (약 50% 단축) |
| 연속 동작 원칙 | §2-3 / G2에 "스크린샷 나열 아닌 단일 흐름" 명시 |
| Step 전환 재정의 | cross-fade → **오버랩 100~200ms** (REQ-DASH-013 재작성) |
| Step별 duration | INITIAL ≤ 500ms / AI_INPUT ≤ 2000ms / AI_EXTRACT ≤ 1000ms / AI_APPLY ≤ 2500ms |
| 조작감 duration 단축 | REQ-DASH3-020/022/023/042/043/063 재조정 |

#### 4-4. 레이아웃 피드백 반영 (3-column 재현 + Tablet C안)

| 변경 | 내용 |
|------|------|
| OrderForm 구조 | 축약 9섹션 세로 나열 → **원본 `register-form.tsx:939` `grid grid-cols-1 lg:grid-cols-3 gap-4` 1:1 재현** |
| Desktop scale | 0.45 유지 + 3-column grid |
| **Tablet scale** | 0.32 → **0.40**, **3-column 유지 C안** (원본은 Tablet에서 1-col reflow하나 Phase 3는 의도적 divergence) |
| Mobile | MobileCardView 유지 (Phase 1/2 승계, 불변) |
| REQ-DASH3-029 재정의 | Section Scroll Snap → **Column-wise Border Pulse** (scale 축소 렌더에서 scrollIntoView 효과 없음) |

#### 4-5. 가상 화주 피드백 반영 (REQ-DASH3-014 신설)

| 변경 | 내용 |
|------|------|
| CompanyManagerSection pre-filled | INITIAL부터 가상 화주 "옵틱물류" + 담당자 이매니저로 pre-filled (로그인 + 회사 선택 완료 시뮬레이션) |
| AI_APPLY 제외 | CompanyManagerSection은 #6 fill-in caret 대상 제외, #10 Column Pulse Col 1 대상 제외 |
| 전체 beat 재조정 | 담당자 연락처 제거 → **옵션 토글(TransportOption 8개) / 자동배차 / 정산(청구/지급/추가/합계)** 중심 재작성 |
| mock 값 SSOT | wireframe decision-log [§4-3](../sources/wireframes/decision-log.md#4-3-mock-값-전체-표-ssot) 표 참조 (실명 사용 금지, 마스킹 적용) |

#### 4-6. Spike 범위 확정 — 수직 슬라이스 (PRD §8-0)

| 범위 | 설명 |
|------|------|
| AiPanel | `ai-input-area.tsx` + `ai-extract-button.tsx` + 조작감 #1 fake-typing + #3 button-press |
| OrderForm Col 3 | `estimate-info-card.tsx` + 조작감 #8 number-rolling |
| OrderForm Col 1 | `company-manager-section.tsx` **정적 pre-filled** (조작감 없음, Tablet 0.40 Col 1 눈대중 평가) |
| 4-Step 골격 | INITIAL → AI_INPUT → AI_EXTRACT → AI_APPLY 자동재생 + MVP 조작감 3종(#1/#3/#8) 통합 |
| 공수 | **1일 원칙 유지** |

### PCC 체크리스트 (P4 PRD)

- [x] 요구사항 ID 중복 없음 (REQ-DASH-NNN 기존과 REQ-DASH3-NNN 신규 구분 명확)
- [x] User Story ↔ Requirements ↔ Success Metrics 대조 통과
- [x] Phase 1 스펙 §3/§5/§6/§7/§11/§13/§14/§16 섹션 번호 링크 유효
- [x] Goals ↔ Non-Goals 모순 없음 (COMPLETE 단계, 모바일 조작감)
- [x] Milestones 합계 공수 일치 (18~22일 + Spike 1일)
- [x] 리스크 9종 승계 + 추가 6종 모두 대응 명시
- [x] 잔여 선결 질문 (Q2/Q7) 해소 시점 명시

### 반영 위치

- [`00-context/01-prd-freeze.md`](./01-prd-freeze.md) §1 ~ §12 + 변경 이력 7건

---

## 5. 2026-04-17 — P5 Wireframe 설계 결정

### 요약

와이어프레임 단계의 4대 설계 결정 확정. 상세 결정 근거는 [`sources/wireframes/decision-log.md`](../sources/wireframes/decision-log.md) §1~§4 참조 (재복제 금지).

### 결정 목록

| # | 결정 | 요약 | 상세 링크 |
|---|------|------|-----------|
| 1 | AI_APPLY 2단 구조 **안 B** 확정 | Step 분할 없이 AI_APPLY 내부 `partialBeat` + `allBeat` 2-비트 타이밍 트랙으로 구분. 4-dot StepIndicator 유지 | [wireframe §1](../sources/wireframes/decision-log.md#1-2026-04-17--ai_apply-2단-구조-안-b-내부-타임라인-분할-확정) |
| 2 | UI 시각 힌트 위치 확정 | Preview 프레임 외곽 직하 (StepIndicator 아래, chrome 내부) + 💡 아이콘 + `text-xs text-muted-foreground` + `aria-live="polite"` + AI_APPLY 중만 fade-in 200ms | [wireframe §2](../sources/wireframes/decision-log.md#2-2026-04-17--ui-시각-힌트-위치-확정) |
| 3 | OrderForm 3-column 재현 + Tablet C안 | 원본 `lg:grid-cols-3` 1:1 재현. Tablet(768~1023) scale 0.32 → 0.40 + 3-col 유지(원본과 의도적 divergence). #10 `columnPulseTargets` 재정의 | [wireframe §3](../sources/wireframes/decision-log.md#3-2026-04-17--orderform-3-column-재현--tablet-c안-040--3-column-유지-확정) |
| 4 | 가상 화주 "옵틱물류" pre-filled SSOT | mock 값 표 SSOT 확정 (회사/담당자/연락처 마스킹). AI_APPLY 전체 beat 재조정 (담당자 연락처 제거, 옵션/자동배차/정산 중심). 히트 영역 #11 `company-manager` 비활성 | [wireframe §4](../sources/wireframes/decision-log.md#4-2026-04-17--가상-화주-옵틱물류--담당자-이매니저-pre-filled-확정-ssot) |

### PCC-04 자체 사전 점검 결과

| 건수 | 결과 | 비고 |
|------|------|------|
| 28/28 | **전부 pass** | 3-column 재매핑 4건 + pre-filled 검증 3건 신규 추가 |

### 반영 위치

- [`sources/wireframes/screens.md`](../sources/wireframes/screens.md) §1 ~ §9
- [`sources/wireframes/components.md`](../sources/wireframes/components.md) §1 ~ §8
- [`sources/wireframes/navigation.md`](../sources/wireframes/navigation.md) §2-4 Mermaid + §3 Gantt
- [`sources/wireframes/decision-log.md`](../sources/wireframes/decision-log.md) §1 ~ §4

---

## 6. 선결 질문 (Q1 ~ Q9) 해소 이력

| Q# | 질문 | 해소 시점 | 결과 |
|----|------|-----------|------|
| Q1 | 번들 예산 80~100KB 수용 여부 | 2026-04-17 (IDEA 재판정) | **해소** — REQ-DASH3-060에 반영 |
| Q2 | broker 통합 일정 (6개월 이내?) | **미해소** — 아키 파일 구조 확정 전 | REQ-DASH3-050 Option A 전환 설계에 영향. Option A 대비 shared 추출 경계를 `ai-register-main/` 단위로 설계 유지 (본 Bridge의 `06-architecture-binding.md`에 반영) |
| Q3 | shadcn 3-C 하이브리드 확정 | PRD (P4) | **해소** — REQ-DASH3-051 Button/Input/Textarea/Card/Badge 5개만 |
| Q7 | 테스트 legacy 격리 전략 | **해소 (A안, Phase B)** | REQ-DASH3-071. `T-DASH3-M1-07` 추가. 본 Bridge `02-package/09-test-cases.md` §6 A안 기준 |
| Q9 | 조작감 MVP 4종 합의 | PRD (P4) | **해소** — #1/#3/#6/#8 (REQ-DASH3-020~023) |

### Q2 처리 방침 (본 Bridge)

`06-architecture-binding.md` §4 "Future Migration Alignment"에서 Option A 전환 대비 경계 설계 방침 명시. Q2 미해소 상태로 Dev 진입 허용 (Option A는 별도 Feature로 분리 운영 예정).

### Q7 처리 방침 (본 Bridge) — **A안 확정 (Phase B)**

`09-test-cases.md` §6 A안 기준으로 확정. `T-DASH3-M1-07` TASK 추가.

- **A안 (확정)**: `__tests__/dashboard-preview/legacy/` 디렉터리로 이동 + `vitest.config.ts` include 패턴 재구성. M1 3일 범위 내 0.5일 흡수.
- **B안 (rejected)**: 파일 이동 없는 suite 태그 방식 → 각 테스트 파일마다 조건부 래핑이 필요해 가독성이 저하됨.
- **C안 (rejected)**: 전체 삭제 → Feature flag 롤백 시 Phase 1/2 회귀 안전망 상실로 위험도 높음.

---

## 7. 2026-04-17 — P8 /dev-feature Phase A (Context Build)

### 요약

`/dev-feature dash-preview-phase3` Phase A (Context Build) 진입. 구조 계약 5종 검증 + 누락 항목 보강. Phase B (Human Review) 전환을 위한 미결정 사항 정리.

### 수행 작업

1. 필수 3개 문서 일관성 점검
   - [`01-prd-freeze.md`](./01-prd-freeze.md) §7 Technical Considerations
   - [`06-architecture-binding.md`](./06-architecture-binding.md) §1~§8 전체
   - [`.plans/project/00-dev-architecture.md`](../../../../project/00-dev-architecture.md) Structure Mode / Layer Mapping / Shared vs Local Rules
2. [`02-package/00-overview.md`](../02-package/00-overview.md) Structure Contract 5종 체크리스트 검증 결과:
   - ✅ §4-1 Structure Mode (`feature-local` 명시)
   - ✅ §4-2 Allowed Target Paths (35 파일 요약표)
   - ✅ §4-3 Stack Contract (PRD §7-6 제약 보강 완료)
   - ✅ §4-4 Layer Mapping (Presentation/Interaction/UI Primitive/Infrastructure/Test 신규 명시)
   - ✅ §4-5 Shared-vs-Local Rule (Future Migration Alignment Q2 대비 요약 명시)
3. PRD ↔ Overview 일관성
   - REQ-DASH3-050 (Phase 1 스펙 §5 구조) — 06-architecture-binding.md §2와 일치
   - REQ-DASH3-051 (shadcn 3-C) — §3-1 신규 패키지와 일치
   - REQ-DASH-007 (3-column grid) — §2-1 In-scope #11과 일치

### Phase B 준비 — 미결정 사항 (Dev 착수 Gate)

| # | 항목 | 게이트 |
|---|------|-------|
| 1 | Q7 Legacy 격리 (A/B/C) | **해소 완료 — A안 확정 (Phase B, 2026-04-17)** |
| 2 | Q2 broker 통합 일정 | Option A 전환 대비 경계 유지 (Bridge 반영 완료) |
| 3 | `use-animated-number.ts` 처리 | Spike에서 실측 후 확정 |
| 4 | Playwright 통합 스냅샷 도입 | M3 통합 테스트 착수 전 확정 |
| 5 | Tablet 0.40 가독성 | M5 A/B 검증 결과 기반 |

### 다음 단계

Phase B 승인 후 Phase C (01-requirements.md 등 세부 TASK 분해) 별도 호출.

### 반영 위치

- [`02-package/00-overview.md`](../02-package/00-overview.md) §4-3 (제약 추가), §4-4, §4-5 (신규)

---

## 8. 변경 이력

| 날짜 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-17 | 초안 — P1~P5 결정 요약, PCC/선결 질문 해소 이력, wireframe decision-log 참조 링크 | plan-bridge |
| 2026-04-17 | P8 /dev-feature Phase A (Context Build) — 구조 계약 5종 검증 + §7 Layer Mapping/Shared-vs-Local 보강 추가 | dev-architect |
| 2026-04-17 | Phase B 승인 (Q7 A안, Q2~Q5 OK) | 사용자 |
| 2026-04-17 | Phase C 완료 (09/08/10/01/00/stage-manifest 반영) | dev-doc-updater |
| 2026-04-17 | **T-DASH3-SPIKE-01 완료 (Hybrid, Phase 0/1/2/3/4 자체 수행)** — 번들 **+6.6KB**, 전체 beat **5.5초(하한 0.5초 미달)**, **비계획 이슈 3건 발견** (1 HIGH Hero max-w / 1 MED Mobile 분기 / 1 LOW Strict Mode 로그). **판정 🟢 정상 진입 허용 (조건부)** — M1에 `T-DASH3-M1-08` + `T-DASH3-M1-09` 추가. 상세: [`sources/spike-notes.md`](../sources/spike-notes.md) | Claude (Spike) |
| 2026-04-17 | **Milestone 1 완료 (M1-01~09 전 9 TASK)** — landing 별도 git 레포로 분리(CtrlCVbot 로컬 계정), 9개 원자적 커밋. 최종 테스트 **493/493 pass (LEGACY=true 회귀 포함)**. M1 완료 게이트 10항목 모두 충족: mock-data SSOT / preview-steps 4-Step + interactions / interactions 6 유틸 × 28 tests / shadcn 3-C + Radix 1 / 3-column grid exact match / legacy 격리 + LEGACY 토글 / Hero max-w 1440 / Mobile MobileCardView + dynamic import / typecheck+lint 0 errors. 커밋 해시: 4691486(Spike+M1-07) → 32c8d4c → 157a24b → a7b593b → 900258e → d249cb4 → 66f9f8b → d822e5b → cf61f6b. M2 착수 가능. | Claude (M1 전체 TDD) |
| 2026-04-17 | **M1 홀리스틱 리뷰 → Top 3 이슈 해소 + M1 게이트 PASS 전환** (dev-code-reviewer 판정 WARN → PASS). (1) ESLint 설정 복구 + 3 오류 해소 → `pnpm build` exit 0 복원 (971977a). (2) Spike 코드베이스 완전 제거 + TDD 가드 예외 제거 → 코드 -1006줄, First Load JS **169KB → 162KB** (be2e997). (3) `computeInputText` 진행률 비례 slice 구현 → Phase 1/2 legacy consumer 의미 보존 (5f79bd5). 최종: 195 기본 + 492 LEGACY tests pass, typecheck/lint/build 모두 0 error. **M2 착수 준비 완료**. | Claude (리뷰 반영) |
