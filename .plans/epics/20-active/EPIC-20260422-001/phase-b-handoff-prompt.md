# Phase B 인수인계 프롬프트

> **용도**: 다음 Claude Code 세션 또는 다른 AI에 이 문서 내용을 그대로 붙여넣어 Phase B (F2 Mock 재설계 + F4 레이아웃/Hit-Area) 실행을 시작한다.
> **작성일**: 2026-04-24 (Phase A 완료 세션 종료 시점)
> **대상 Epic**: EPIC-20260422-001 (dash-preview Phase 4 — Phase 3 피드백 반영)

---

## 사용법

1. 새 Claude Code 세션 열기 (또는 다른 AI에 붙여넣기)
2. 아래 `## 프롬프트 내용` 섹션의 모든 마크다운을 **한 번에** 복사 붙여넣기
3. AI가 Phase A 잔여 확인 → Phase B Step 1부터 순차 진행

---

## 프롬프트 내용

복사 시작 지점 ↓

---

### 작업 컨텍스트

mologado 모노레포의 `apps/landing` 에서 **EPIC-20260422-001 (dash-preview Phase 4 — Phase 3 피드백 반영)** 의 Phase B 를 진행한다.

- **레포**: `C:\Program Files (user)\mologado\apps\landing`
- **브랜치**: `main`
- **Epic 문서**: `.plans/epics/20-active/EPIC-20260422-001/`
  - `00-epic-brief.md` — Epic 개요
  - `01-children-features.md` — 5 Feature 실행 지도 + Phase A/B/C 로드맵
- **프로젝트 아키텍처 SSOT**: `.plans/project/00-dev-architecture.md`

---

### Phase A 완료 상태 (읽어서 파악)

Phase A (F1 + F5 병렬) 는 2026-04-24 완료. main 에 머지된 구현 커밋:

- `a7bbda4` T-THEME-08 (F1 PR-6 dash-preview 7파일)
- `8e3523f` / `af70fb4` / `9555339` — F1 PR-7 D-016 확장 (ai-panel 8 + legacy 4 + products/integrations/problems/order-form 미세)
- `446c718` / `08cabd6` — F1 PR-7 D-017 확장 (order-form 5파일 + 팔레트)
- `eb8aedd` — Phase A 완결 문서 + /dev-verify 보고서

**구현 완료 (F1 + F5 모두 `implemented` 상태)**:

- F1: 980/980 tests PASS, 14 TASK (T-06 skip), globals.css 이중화 + landing 전역 토큰 치환 완료
- F5: 624 tests PASS, AiExtractJsonViewer 렌더 제거 + "자동 배차 대기" 라벨 완료

**Phase A 잔여 상태 — 2026-04-24 업데이트**:

1. **사용자 육안 QA** (브라우저 1440/1280/768/390 + 다크 회귀)
   - 완료. 2026-04-24 사용자 확인.
2. **/plan-archive f1-landing-light-theme** — 완료
   - `.plans/archive/f1-landing-light-theme/ARCHIVE-F1.md` 생성, 원본은 `sources/` 로 이동.
3. **/plan-archive f5-ui-residue-cleanup** — 완료
   - `.plans/archive/f5-ui-residue-cleanup/ARCHIVE-F5.md` 생성, 원본은 `sources/` 로 이동.

---

### Phase B 목표 (M-Epic-2, 예정 2026-05-14)

`.plans/epics/20-active/EPIC-20260422-001/01-children-features.md` §3 Phase B 섹션 참조.

- **F2 — Mock 스키마 재설계** (Standard, pending)
  - `src/lib/mock-data.ts` 에 `extractedFrame` / `appliedFrame` 분리
  - `PREVIEW_MOCK_SCENARIOS: [세트A, B, C, ...]` 배열화 + 선택기 함수
  - `order-form/index.tsx` 에서 Step 기반 가시성 제어
  - AI 카테고리 `fare` 값을 `estimate.amount` 와 일치
  - 포함 이슈: [2-1], [2-2], [2-3], [2-4]

- **F4 — 레이아웃 정비 + Hit-Area 재정렬** (Standard, pending)
  - Col 2 내부 pickup/delivery DateTimeCard 를 `grid-cols-2 gap-4` 로 래핑
  - `src/components/dashboard-preview/hit-areas.ts` 의 19 bounds 재측정
  - `TABLET_HIT_AREAS = DESKTOP_HIT_AREAS` 단일화 유지 여부 결정
  - `interactive-overlay.tsx` 앵커를 ScaledContent 내부로 이동 여부
  - 포함 이슈: [3], [4]

**의존성 매트릭스** (§2): F2 ↔ F4 = `✓` 완전 독립 병렬 가능.
**선행 완료 필수**: F5 (UI 잔재 정리) — 이미 implemented 상태.

---

### Phase B 실행 파이프라인 (§4 Phase A Step 재활용)

F2 와 F4 에 대해 각각:

```bash
# Step 1: IDEA 등록 (Epic 연결 optional 이지만 권장)
/plan-idea "F2 Mock 스키마 재설계 — extractedFrame/appliedFrame 분리 + ..." --epic=EPIC-20260422-001
/plan-idea "F4 레이아웃 정비 — Col 2 2열 래핑 + hit-areas 재측정 + ..." --epic=EPIC-20260422-001

# Step 2: Screening (초기 승인 게이트, Critical checkpoint — 자동 통과 금지)
/plan-screen {F2-IDEA-ID} --framework=rice
/plan-screen {F4-IDEA-ID} --framework=rice

# Step 3: Draft (Lite/Standard 판정 + 시나리오 + copy/dev 유형)
/plan-draft {F2-IDEA-ID}   # 예상: Standard/B(부분 완성)/dev
/plan-draft {F4-IDEA-ID}   # 예상: Standard/B/dev

# Step 4: PRD (Standard Feature 만)
/plan-prd .plans/drafts/{F2-slug}/
/plan-prd .plans/drafts/{F4-slug}/

# Step 5: Bridge (Feature Package 전환 + Epic binding 생성)
/plan-bridge {F2-slug}
/plan-bridge {F4-slug}

# Step 6: Feature Package 공식 승격 + TASK 정의
/dev-feature .plans/features/active/{F2-slug}/
/dev-feature .plans/features/active/{F4-slug}/

# Step 7: 병렬 구현 (dev-implementer 에이전트 자율 TDD 루프)
/dev-run .plans/features/active/{F2-slug}/
/dev-run .plans/features/active/{F4-slug}/
# 또는 TeamCreate 로 병렬화

# Step 8: 검증 + 아카이브
/dev-verify .plans/features/active/{F2-slug}/
/dev-verify .plans/features/active/{F4-slug}/
/plan-archive {F2-slug}
/plan-archive {F4-slug}

# Step 9: Phase C 진입 준비 (F3 옵션↔요금 파생)
```

---

### 준수 사항

1. **TDD 필수** — `dev-tdd-guard.js` 가 테스트 없는 구현 Edit 차단. Red → Green → Improve 사이클.
2. **Architecture binding** — 각 Feature 의 `06-architecture-binding.md` §2 Allowed Target Paths 범위만 수정. 범위 이탈 시 binding 먼저 갱신.
3. **Decision Log** — 각 Feature 의 `02-decision-log.md` 에 D-00N 번호로 누적. Phase A 의 D-001~D-017 은 F1/F5 용이므로 별도 번호 체계.
4. **Commit 분할** — 기능 단위 커밋 분할 (1 TASK = 1 커밋 권장, 또는 논리 단위 묶음). 테스트는 해당 구현 커밋에 포함 (append-only light-theme.test.tsx 분할 선례 참조).
5. **Critical Checkpoint** — `/plan-screen` 후 사용자 Go 승인, PRD 리뷰 후 승인, 각 TASK 완료 후 `dev-code-reviewer` PASS + 사용자 승인. `autoProceedOnPass` false 기본 (D-004).
6. **Agent Edit Race** — write-capable 에이전트(dev-implementer, plan-*-writer 등) 완료 후 메인 세션이 같은 파일 Edit 전 Read 재호출 필수. `verification.md` § Agent Edit Race 참조.
7. **Date calculation** — 날짜·요일·D-day 계산 시 반드시 `date` 또는 `python3` 사용. 머릿속 계산 금지 (`date-calculation.md`).

---

### 참고 자산 (읽어 볼 것)

| 파일 | 역할 |
|------|------|
| `.plans/epics/20-active/EPIC-20260422-001/00-epic-brief.md` | Epic 개요 + 성공 지표 |
| `.plans/epics/20-active/EPIC-20260422-001/01-children-features.md` | 5 Feature 실행 지도 + 의존성 매트릭스 + Phase A/B/C 로드맵 |
| `.plans/archive/dash-preview-phase3/improvements/issues.md` | 10 이슈 원본 (F2 범위 [2-1~2-5], F4 범위 [3], [4]) |
| `.plans/archive/dash-preview-phase3/improvements/proposals.md` | 방안 A/B/C + 공통 C1/C2 |
| `.plans/archive/f1-landing-light-theme/sources/feature-package/00-context/02-decision-log.md` | Phase A D-001~D-017 (참고용) |
| `.plans/archive/f1-landing-light-theme/sources/feature-package/03-dev-notes/dev-verification-report.md` | Phase A DVC 검증 결과 |
| `.plans/project/00-dev-architecture.md` | 프로젝트 아키텍처 SSOT |
| `CLAUDE.md` (루트 + `apps/landing/`) | 프로젝트 핵심 원칙 |

---

### 요청

Phase B 착수 전 먼저:

1. Epic `01-children-features.md` §3 Phase B + §4 Step 1~9 숙지
2. **Phase A 잔여 3건** 확인 — 사용자에게 육안 QA + `/plan-archive` 2건 실행 여부 확인. 미실행이면 먼저 처리 권장.
3. F2/F4 의존성 매트릭스 재확인 (`✓` 병렬 가능)
4. 현재 레포 상태 확인:
   - `git log --oneline -15`
   - `git status`
   - `pnpm test` (980+ PASS 기준 baseline)

그 후 **Step 1 F2 IDEA 등록**부터 순차 진행.

필요한 경우 사용자에게 경로·범위·판정을 질문하여 가정을 명시한 뒤 진행 (`interaction.md` "State Assumptions Before Coding" 원칙).

**Phase B 목표**: M-Epic-2 (2026-05-14) 까지 F2 + F4 `implemented` + `archived`.

---

복사 종료 지점 ↑

---

## 문서 메타

| 항목 | 값 |
|------|-----|
| 작성일 | 2026-04-24 |
| 작성자 | Phase A 완료 세션 (Claude Opus 4.7) |
| 적용 Epic | EPIC-20260422-001 Phase B |
| 적용 Feature | F2 (Mock 재설계) + F4 (레이아웃/Hit-Area) |
| 이전 Phase | Phase A 완료 (커밋 `eb8aedd` 까지) |
| 다음 Phase | Phase C (F3 옵션↔요금 파생) — Phase B 완료 후 별도 인수인계 예정 |
| 관련 선례 | `.plans/archive/f1-landing-light-theme/sources/feature-package/02-package/08-dev-tasks.md` (14 TASK 분할 패턴 참조) |
