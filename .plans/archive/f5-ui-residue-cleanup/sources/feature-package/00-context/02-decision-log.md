# 02. Decision Log — F5 UI 잔재 정리

> 본 Feature 구현 중 발생하는 **추가 결정** 을 누적 기록한다.
> 기 확정 결정 (Draft 단계) 은 [`03-design-decisions.md`](./03-design-decisions.md) SSOT 참조.

---

## 1. 기 확정 결정 요약 (참조용)

Draft §4 에서 확정된 결정. 상세는 [`03-design-decisions.md`](./03-design-decisions.md) SSOT.

| # | 결정 | 선택값 |
|:-:|------|--------|
| 1 | Tooltip `auto-dispatch` 문구 | `"자동 배차 대기 중 — 조건 충족 시 자동 배차합니다"` (라벨과 UX 일관성) |
| 2 | hit-area key 네임스페이스 (`form-auto-dispatch`, `auto-dispatch`) | 변경 금지 (구조적 식별자) |
| 3 | Import line 처리 방식 | 주석 처리 아닌 **완전 삭제** (코드 정리) |

---

## 2. /dev-feature 추가 결정

### D-001. Feature Package 경로 규약

| 항목 | 선택값 |
|------|--------|
| 결정일 | 2026-04-23 |
| 결정자 | 사용자 + `/dev-feature` |
| 내용 | plan-bridge 기존 00-context 파일 유지 + `/dev-feature` 추가 파일 공존 (F1 D-001과 동일 원칙) |
| 근거 | Document Non-Duplication (golden #13) |

### D-002. 실행 전략 (수정 2026-04-23)

| 항목 | 선택값 |
|------|--------|
| 결정일 | 2026-04-23 |
| 내용 | **현 세션 순차** — F5 먼저 완료 (Lite, 1.75 인·일) → commit → F1 진행. TeamCreate 사용 안 함. F1 PR-6 (T-THEME-08) 은 F5 merge 완료 후 진입. |
| 근거 | 사용자 선택 (AskUserQuestion 2026-04-23). context 50% 규칙 + Epic F1↔F5 `✓` + F5 Lite 우선순위. |
| 폐기된 대안 | TeamCreate 병렬, 세션 분리. |

### D-004. 승인 게이트 정책

| 항목 | 선택값 |
|------|--------|
| 결정일 | 2026-04-23 |
| 결정자 | 사용자 (AskUserQuestion) |
| 내용 | `autoProceedOnPass: false` — 각 TASK 완료 후 `dev-code-reviewer` PASS 시에도 **사용자 명시 승인 필요**. Phase A 종료 시 M-Epic-1 체크리스트 사용자 최종 승인. |
| 근거 | 10 인·일 규모 Phase A + NFR-007 리스크 → 사용자 관여 유지로 리뷰 품질 확보. F5 는 1.75 인·일 소규모지만 정책 일관성 유지. |
| 로그 | `checkpoint-policy.md` §4 준수. |

### D-003. Lite → PRD 생략 확정

| 항목 | 선택값 |
|------|--------|
| 결정일 | 2026-04-23 |
| 내용 | F5 Lane `Lite` — PRD 단계 생략. Draft + Bridge 기반으로 바로 개발 진입. |
| 근거 | plan 도메인 §4 Step 6 "Lite 는 PRD 생략 가능 (draft + bridge 로 개발 진입)". IDEA/Draft/Scope Boundaries/Design Decisions/Implementation Hints 가 이미 상세하여 PRD 중복 작성 비용 대비 효용 낮음. |

---

## 3. 구현 중 신규 결정

### D-005. R8 Tooltip 문구 수정 (SSOT: 01-requirements.md)

| 항목 | 값 |
|------|-----|
| 결정일 | 2026-04-23 |
| 결정자 | 사용자 (직접 편집) |
| 배경 | Draft §4-1 원안 "자동 배차 대기 중 — 조건 충족 시 자동 배차합니다" 가 이벤트 흐름 (배차요청 → 자동 승인 → 배차대기) 을 덜 명확히 표현. 사용자가 실제 서비스 사용자 언어와 정합한 문구로 업데이트. |
| 선택값 | **"자동 배차 대기 중 — 배차요청 자동 승인되어 배차대기상태로 전환합니다"** |
| SSOT | [`../02-package/01-requirements.md §R8`](../02-package/01-requirements.md) — 최종값. 다른 문서는 참조용 copy. |
| 영향 범위 | `mock-data.ts` line 414 실제 구현 문구. 02-package 4 파일 동기 완료 (2026-04-23). 00-context frozen 문서는 plan 단계 원안 유지. |
| Rollback | 원안 복원 시 01-requirements.md R8 수정 + 02-package 4 파일 재동기. |

---

### D-006. T-CLEANUP-03 실제 테스트 영향 범위 확장

| 항목 | 값 |
|------|-----|
| 결정일 | 2026-04-23 |
| 결정자 | 메인 세션 (grep 조사) |
| 배경 | 08-dev-tasks.md T-CLEANUP-03 범위는 "ai-panel 통합 테스트 + estimate-info-card.test.tsx" 2 파일. 실제 grep 결과 3 개 파일이 영향: `ai-panel/__tests__/index.test.tsx` (223, 451행), `__tests__/hit-areas.test.ts` (49행), `src/__tests__/lib/mock-data.test.ts` (183행). |
| 선택값 | T-CLEANUP-03 scope 을 3 개 테스트 파일 + estimate-info-card.test.tsx 로 확장. 모두 "ai-json-viewer"/"AiExtractJsonViewer" 단정문 갱신. |
| 영향 범위 | T-CLEANUP-03 파일 수: 2 → 4. Effort: 0.75 → 1.0 인·일. F5 합계: 1.75 → 2.0 인·일 (RICE 2 인·일 이내 유지). |
| Rollback | scope 축소 시 grep 결과 잔존 (CI 실패). 확장 확정. |

### D-007. TDD 순서 명확화 (T-CLEANUP-01 RED 선행)

| 항목 | 값 |
|------|-----|
| 결정일 | 2026-04-23 |
| 결정자 | 메인 세션 |
| 배경 | 08-dev-tasks.md 는 T-CLEANUP-03 을 T-CLEANUP-01 뒤에 배치했지만 TDD 원칙상 RED 가 선행해야 함. dev-tdd-guard.js 가 테스트 없는 구현을 차단. |
| 선택값 | T-CLEANUP-01 내부 RED-GREEN-IMPROVE 자체 완결: (1) index.test.tsx 에 JSON 뷰어 미렌더 단정 **추가** (RED) → (2) ai-panel/index.tsx + hit-areas.ts + mock-data.ts 구현 (GREEN) → (3) 스냅샷/regression 확인 (IMPROVE). T-CLEANUP-03 은 **나머지 관련 테스트** (mock-data.test.ts, hit-areas.test.ts, index.test.tsx 기타 라인, estimate-info-card.test.tsx R9) 갱신. |
| 영향 범위 | T-CLEANUP-01 내부에 index.test.tsx RED 작성 포함. T-CLEANUP-03 scope 재조정. |
| Rollback | TDD 원칙 준수 필수 — 재조정 불가. |

---

## 3-X. 구현 중 신규 결정 (TODO — TASK 진행 중 추가)

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
| Rollback | {되돌리기 가능한가} |
```

---

## 4. 거절 이력 (Rejected alternatives)

Draft §4 의 거절된 대안은 [`03-design-decisions.md`](./03-design-decisions.md) 참조.

**구현 중 추가 거절** (아직 없음).

---

## 5. 변경 이력

| 날짜 | 변경 |
|------|------|
| 2026-04-23 | 초안 — `/dev-feature` Phase A 진입. D-001, D-002, D-003 등록. |
