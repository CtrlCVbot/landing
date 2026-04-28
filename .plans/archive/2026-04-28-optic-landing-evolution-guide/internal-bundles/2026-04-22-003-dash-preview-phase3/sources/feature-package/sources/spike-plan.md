# Spike Plan — dash-preview-phase3 T-DASH3-SPIKE-01

> **Feature**: `dash-preview-phase3`
> **연결 TASK**: `T-DASH3-SPIKE-01` (08-dev-tasks.md §1)
> **실행 방식**: **Hybrid (옵션 C)** — Claude 보일러플레이트 + 개발자 검증/측정
> **Status**: ready
> **Created**: 2026-04-17
> **결과 기록 파일**: [`spike-notes.md`](./spike-notes.md)

---

## 0. 개요

### 0-1. 목적

PRD §8-0 및 08-dev-tasks.md `T-DASH3-SPIKE-01` 기반:

- **R4 (복제 공수 과소평가) 정량 검증** — 1개 복제에 사람 기준 몇 시간?
- **#6 전체 beat 타이밍 예비 실측** — AI_APPLY 2단 연출이 0.8초에 가능한가?
- **전체 4-Step flow 감각 확보** — 설계 재조정 트리거 조기 발견

### 0-2. 실행 방식 선택 근거 (Hybrid)

| 관점 | 개발자 직접 (A) | **Hybrid (C)** | Claude 전담 (B) |
|------|:---:|:---:|:---:|
| 공수 측정 신뢰도 | 🟢 높음 | 🟢 "조정 시간" 측정 가능 | 🔴 의미 소실 |
| 속도 | 🟡 1일 | 🟢 0.75일 | 🟢 0.3일 |
| 학습 내재화 | 🟢 깊음 | 🟡 검토 중심 | 🔴 얕음 |
| 보일러플레이트 | 수동 | Claude가 빠르게 | Claude |

**선정 사유**: Phase 1/2 경험으로 원본 broker 구조에 부분 친숙. Claude 초안 + 개발자 조정 조합이 속도 + 실측 신뢰도 균형 최적.

### 0-3. 총 예상 시간

**6시간 (0.75일)**. 순수 "개발자 조정 시간" **3시간**이 R4 검증 실측의 핵심 지표.

---

## 1. 역할 분담 매트릭스

| Phase | 담당 | 시간 | 주요 활동 | 산출물 |
|:---:|:---:|:---:|------|------|
| 0 | Claude | 15분 | 디렉토리 + TDD bypass + 환경 스켈레톤 | 디렉토리 구조, 수정된 `dev-tdd-guard.js` |
| 1 | Claude | 60분 | 10개 파일 보일러플레이트 생성 | 컴포넌트 4 + 유틸 3 + mock 2 + shell 1 |
| 2 | 개발자 | 180분 | 원본 diff 확인, 렌더링 체크, 조정 | `spike-notes.md §3-1` 조정 기록 |
| 3 | 개발자 | 120분 | 번들·LCP·타이밍 실측 | `spike-notes.md §2` 실측값 |
| 4 | 공동 | 30분 | 결과 분석 + 의사결정 | `spike-notes.md §4~5` 완성 |

---

## 2. Phase 0 — 환경 준비 (Claude)

### 2-1. 디렉토리 생성

```
apps/landing/src/components/dashboard-preview/
  ai-register-main/
    spike/                        # Spike 전용 (이관 or 폐기)
      ai-panel/
      order-form/
    interactions/                 # M1 재사용 예정
  ui/                             # shadcn
```

### 2-2. TDD 가드 bypass

`.claude/hooks/dev-tdd-guard.js`에 `spike/` 경로 예외 추가. Spike 종료 시 제거.

### 2-3. 개발자가 실행할 CLI (Claude 안내만)

```bash
# shadcn 2개 설치
pnpm dlx shadcn@latest add button input

# 환경변수
echo 'NEXT_PUBLIC_DASH_V3=spike' >> apps/landing/.env.local
```

---

## 3. Phase 1 — 초기 파일 생성 (Claude)

### 3-1. 생성 파일 목록 (10개)

| # | 파일 | 내용 | 연결 조작감 |
|---|------|------|:---:|
| 1 | `lib/mock-data-spike.ts` | Spike 최소 mock (옵틱물류 pre-filled + AI 입력 1건 + Estimate 값) | — |
| 2 | `lib/preview-steps-spike.ts` | 4-Step 스냅샷 + interactions 타이밍 트랙 | — |
| 3 | `interactions/use-fake-typing.ts` | 변동 리듬 타이핑 훅 | **#1** |
| 4 | `interactions/use-button-press.ts` | scale + shadow press 훅 | **#3** |
| 5 | `interactions/use-number-rolling.ts` | 숫자 카운터 롤링 훅 | **#8** |
| 6 | `ai-register-main/spike/index.tsx` | 4-Step 컨테이너 + Feature flag 분기 | — |
| 7 | `spike/ai-panel/ai-input-area.tsx` | 원본 `.references/code/mm-broker/.../ai-input-area.tsx` 복제 | #1 적용 |
| 8 | `spike/ai-panel/ai-extract-button.tsx` | 원본 복제 | #3 적용 |
| 9 | `spike/order-form/estimate-info-card.tsx` | 원본 복제 | #8 적용 |
| 10 | `spike/order-form/company-manager-section.tsx` | 정적 pre-filled (조작감 없음) | — |

### 3-2. Hero.tsx 연결 (Claude)

```tsx
// Feature flag 분기 추가
{searchParams.spike === '1'
  ? <DashboardPreviewSpike />
  : <DashboardPreview />}
```

### 3-3. 복제 원본 경로

`.references/code/mm-broker/app/broker/order/ai-register/_components/` 하위:
- `ai-input-area.tsx`
- `ai-panel.tsx` 내부 AiExtractButton 부분
- `estimate-info-card.tsx`
- `company-manager-section.tsx`

**복제 규칙**: DOM 1:1, 비즈니스 로직(zustand/RHF/API) 제거, stateless props

---

## 4. Phase 2 — 개발자 검증 (개발자)

### 4-1. 설치·실행

- [ ] `pnpm install` 성공
- [ ] `pnpm dev` 실행
- [ ] `http://localhost:3000/?spike=1` 접속 시 Spike 뷰 렌더링

### 4-2. 자동 재생 확인

- [ ] 4-Step 자동 재생 동작 (INITIAL → AI_INPUT → AI_EXTRACT → AI_APPLY)
- [ ] 총 루프 시간 6~8초 체감
- [ ] Step 전환 오버랩 100~200ms

### 4-3. 조작감 MVP 3종 검증

- [ ] **#1 fake-typing**: 고유명사 느리게, 조사 빠르게 (표준편차 > 0)
- [ ] **#3 button-press**: scale 0.97 + shadow, 150ms
- [ ] **#8 number-rolling**: 0.3~0.5초, 최종값 mock-data 일치

### 4-4. 원본 대비 충실도

- [ ] 원본 AiInputArea vs 복제본 **DOM 구조 1:1** (diff 도구)
- [ ] CompanyManagerSection pre-filled 표시 (옵틱물류/이매니저/`010-****-****`/`example@optics.com`/물류운영팀)
- [ ] Tablet scale 0.40 Col 1 가독성 (눈대중)

### 4-5. 조정 기록

조정이 필요했던 지점 **개수 + 소요 시간**을 `spike-notes.md §3-1`에 기록. 이것이 R4 검증의 핵심 지표.

---

## 5. Phase 3 — 측정 (개발자)

### 5-1. 번들 크기

```bash
pnpm build
# .next/build-output 또는 analyze 결과 확인
```
→ `spike-notes.md §2-2`: Spike chunk KB + 21개 확장 추정

### 5-2. LCP (Lighthouse CI)

```bash
pnpm dlx @lhci/cli autorun
```
→ `spike-notes.md §2-3`: before vs after, +100ms 미만 여부

### 5-3. 전체 beat 타이밍

- `preview-steps-spike.ts`에 `Performance.now()` 로깅
- Chrome DevTools Console에서 각 Step duration 관찰
- 또는 스톱워치로 스트레스 테스트

→ `spike-notes.md §2-4`: PRD 목표값 대비 실측

### 5-4. 스크린샷 비교 (선택)

Playwright 또는 수동. 원본 broker 빌드 vs 복제본 스크린샷 diff. 시간 있으면 수행.

---

## 6. Phase 4 — 결과 분석 (Claude + 개발자)

### 6-1. Claude 자동 수행

- `spike-notes.md` 실측값 기반 예상 대비 차이율 계산
- 21개 확장 추정
- 의사결정 분기 자동 판정 제안

### 6-2. 의사결정 분기 (PRD §8-0)

| 조건 | 판정 | 다음 단계 |
|------|:---:|------|
| R4 ≤ +30% + 전체 beat 6~8초 범위 | 🟢 **정상** | `/dev-run` 진입 → M1 착수 (첫 TASK: `T-DASH3-M1-07` Legacy 격리) |
| R4 +30~50% | 🟡 **애매** | 사용자 확인 → 범위·일정 조정 후 진입 |
| R4 > +50% | 🔴 **심각** | 시나리오 C→A 전환 재평가 (새 IDEA 등록) |
| 전체 beat < 6초 or > 8초 | 🟡 duration 재조정 | PRD §6-2 업데이트 |
| Spike chunk > 10KB | 🟡 번들 재검토 | 확장 시 100KB 초과 위험 |

### 6-3. Spike 산출물 운명

- **정상**: `spike/` → `ai-register-main/`으로 이관 (M1 TASK 일부에 흡수), 추가 TDD 테스트 작성
- **실패**: `spike/` 전체 삭제 + TDD bypass 제거 + stage-manifest 롤백

---

## 7. 시작 전 최종 체크

| 체크 | 확인 |
|------|:---:|
| 개발자 연속 투입 시간 3~5시간 확보? (측정 재실행 부담 방지) | [ ] |
| `pnpm install` / Node 버전 호환 확인 | [ ] |
| `.references/code/mm-broker` submodule SHA 유지 (`bcb7631...`) | [ ] |
| Feature flag `NEXT_PUBLIC_DASH_V3=spike` 설정 합의 | [ ] |
| Spike 실패 시 롤백 합의 (C→A 전환 가능성 수용) | [ ] |

---

## 8. 파이프라인 위치

```
[기획 완료]                    [개발]
/plan-* 전체 ✅                /dev-feature ✅
                                   │
                                   ▼
                              🎯 Spike (여기) ← T-DASH3-SPIKE-01
                                   │
                                   ▼
                              /dev-run → M1 → M2 → M3 → M4 → M5
```

Spike는 `/dev-feature` **이후**, `/dev-run` **이전** 단계. 선행 조건은 08-dev-tasks.md `T-DASH3-SPIKE-01` 완료.

---

## 9. 참고 자료

- PRD §8-0 Spike: [`../00-context/01-prd-freeze.md`](../00-context/01-prd-freeze.md)
- TASK `T-DASH3-SPIKE-01`: [`../02-package/08-dev-tasks.md`](../02-package/08-dev-tasks.md)
- 실측 기록: [`spike-notes.md`](./spike-notes.md)
- Phase 1 스펙 §3 복제 매니페스트: [`../../../archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md#3-복제-대상-매니페스트`](../../../archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md)
- Phase 1 스펙 §11 조작감: [`../../../archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md#11-조작감-강화-레이어-신규`](../../../archive/dash-preview/improvements/IMP-DASH-001-option-b-spec-phase1.md)
- mock 값 SSOT: [`wireframes/decision-log.md §4-3`](./wireframes/decision-log.md)

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-04-17 | Spike Plan v1 작성 (Hybrid 방식, 6시간 분담 매트릭스) |
