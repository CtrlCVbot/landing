# 02. Decision Log — F1 라이트 모드 전환 인프라

> 본 Feature 구현 중 발생하는 **추가 결정** 을 누적 기록한다.
> 기 확정 결정 (Draft/PRD 단계) 은 [`03-design-decisions.md`](./03-design-decisions.md) SSOT 참조. 본 로그는 **구현 중 신규 결정** 용.

---

## 1. 기 확정 결정 요약 (참조용)

Draft §4 + PRD §7 에서 확정된 6 결정 + Tailwind 4 정정. 상세는 [`03-design-decisions.md`](./03-design-decisions.md) SSOT.

| # | 결정 | 선택값 |
|:-:|------|--------|
| 1 | ThemeProvider 구현 방식 | `next-themes` v0.3+ 라이브러리 채택 |
| 2 | 초기 모드 | `prefers-color-scheme` 시스템 follow + 수동 토글 (`defaultTheme="system" enableSystem`) |
| 3 | SSR Hydration Mismatch 대응 | 3 중 방어 조합 (`suppressHydrationWarning` + `disableTransitionOnChange` + mounted state) |
| 4 | 전환 트리거 UI 배치 | navbar 우측 상단 |
| 5 | 토글 아이콘 | `lucide-react` Sun / Moon |
| 6 | 섹션별 PR 분할 | 6 개 PR (Infra / Navbar / Hero+Features / Pricing+Testimonials / Footer+SharedUI / Dash-Preview) |
| 정정 | Tailwind 4 | `tailwind.config.ts` 미사용 — `globals.css` `@theme inline` 이 대체 |

---

## 2. /dev-feature 추가 결정

### D-001. Feature Package 경로 규약

| 항목 | 선택값 | 근거 |
|------|--------|------|
| 결정일 | 2026-04-23 |
| 결정자 | 사용자 (풀 파이프라인 선택) + `/dev-feature` |
| 내용 | plan-bridge 기존 00-context 파일 (`01-product-context`, `02-scope-boundaries`, `03-design-decisions`, `04-implementation-hints`, `08-epic-binding`) **유지** + `/dev-feature` 가 추가하는 신규 파일 (`00-index`, `01-prd-freeze`, `02-decision-log`, `02-package/*`) **공존** |
| 근거 | Document Non-Duplication (golden #13) — 기존 문서를 SSOT로 유지하고 신규 파일은 포인터·freeze·로그 역할 분담. 이름 충돌 없음 (다른 suffix). |

### D-002. 실행 전략 (수정 2026-04-23)

| 항목 | 선택값 |
|------|--------|
| 결정일 | 2026-04-23 |
| 내용 | **현 세션 순차** — F5 먼저 완료 (Lite, 1.75 인·일) → commit → F1 진행. TeamCreate 사용 안 함 (단일 세션 context 부담 경감). context 50% 도달 시점에 새 세션 전환 (예: PR-1 이후). |
| 근거 | 사용자 선택 (AskUserQuestion 2026-04-23). context 50% 규칙 + Epic 의존성 매트릭스 F1↔F5 `✓` — F5 선행 merge 시 F1 rebase 용이. |
| 폐기된 대안 | TeamCreate 병렬 (에이전트 토큰 비용), 세션 분리 (사용자 전환 비용). |

### D-003. PR-4 Skip (Pricing + Testimonials 미존재)

| 항목 | 선택값 |
|------|--------|
| 결정일 | 2026-04-23 |
| 결정자 | 사용자 (AskUserQuestion) |
| 배경 | `src/components/sections/` 실제 파일 감사 결과 `pricing.tsx`, `testimonials.tsx` 미존재. PRD §5 REQ-010 은 6 섹션을 가정하고 있으나 landing 실제 구조는 hero/features/footer/header/integrations/problems/products/cta 8 파일. |
| 선택값 | T-THEME-06 (PR-4) **Skip**. 6 PR → 5 PR 재구성 (PR-4 없음, PR-5 은 번호 유지). PRD 대비 범위 축소는 "현재 landing 실체 반영" 으로 수용. |
| 영향 범위 | dev-tasks.md T-THEME-06 `⚠️ SKIPPED`, test-cases.md TC-F1-06 skip, overview.md §3/§7/§9 조정, release-checklist PR-4 skip. |
| Rollback | Pricing/Testimonials 섹션 신규 요구 발생 시 별도 Feature 로 등록. 본 F1 은 skip 상태로 완결. |

### D-004. 승인 게이트 정책

| 항목 | 선택값 |
|------|--------|
| 결정일 | 2026-04-23 |
| 결정자 | 사용자 (AskUserQuestion) |
| 내용 | `autoProceedOnPass: false` — 각 TASK 완료 후 `dev-code-reviewer` PASS 시에도 **사용자 명시 승인 필요**. Phase A 종료 시 M-Epic-1 체크리스트 사용자 최종 승인. Critical 항목 (destructive, breaking-change, SPIKE 발동 등) 은 항상 정지. |
| 근거 | 10 인·일 규모 + 6 PR 분할 + NFR-007 리스크 높음 → 사용자 관여 유지로 리뷰 품질 확보. |
| 로그 | `checkpoint-policy.md` §4 준수. 각 Checkpoint `type` 명시. |

---

## 3. 구현 중 신규 결정 (TODO — TASK 진행 중 추가)

(아직 없음 — TASK 실행 중 새 결정 발생 시 표 형식으로 추가)

**기록 형식**:

```
### D-NNN. {결정 제목}

| 항목 | 값 |
|------|-----|
| 결정일 | YYYY-MM-DD |
| 결정자 | {사용자/에이전트} |
| 배경 | {왜 결정이 필요했는가} |
| 선택값 | {확정값} |
| 근거 | {왜 이 선택인가} |
| 영향 범위 | {어떤 TASK · 파일 영향} |
| Rollback | {되돌리기 가능한가 · 비용} |
```

---

## 4. 거절 이력 (Rejected alternatives)

Draft §4 각 결정 항목의 "거절된 대안" 은 [`03-design-decisions.md`](./03-design-decisions.md) 참조.

**구현 중 추가 거절** (아직 없음):

(TASK 진행 중 대안이 거절되면 여기에 사유 기록)

---

## 5. 변경 이력

| 날짜 | 변경 |
|------|------|
| 2026-04-23 | 초안 — `/dev-feature` Phase A 진입. D-001, D-002 등록. |
