# 01. PRD Freeze — F5 UI 잔재 정리

> **Frozen at**: 2026-04-23 (Phase A Step 9 `/dev-feature` 진입 시점)
> **Draft source (SSOT)**: [`../../../../drafts/f5-ui-residue-cleanup/01-draft.md`](../../../../drafts/f5-ui-residue-cleanup/01-draft.md)
> **PRD 생략**: Lane `Lite` 로 PRD 단계 생략 (Draft + Bridge 로 개발 진입, IDEA-20260423-001 승인됨)
> **Freeze 의미**: 본 Feature 구현 시점의 Draft 스냅샷. Draft 원본 변경 시 Feature Package 재승인 필요.

---

## 1. 범위 (Scope)

- **Lane**: Lite
- **시나리오**: B (Partial — Phase 3 archived dash-preview 교정, copy 도메인 활성 convention 기록용)
- **Feature 유형**: dev (코드 내 렌더 제거·mock 엔트리 제거·라벨 치환)
- **Hybrid**: false (레퍼런스 캡처 불필요)
- **파일 범위**: 6 파일 (편집 4 + 테스트 2)

---

## 2. 요구사항 요약 (Draft §3 승계)

### R1 ~ R9 (편집 + 테스트 갱신)

| ID | 파일 | 라인 | 변경 |
|----|------|------|------|
| R1 | `ai-panel/index.tsx` | 45 | `import { AiExtractJsonViewer }` 삭제 |
| R2 | `ai-panel/index.tsx` | 201-204 | `<AiExtractJsonViewer ... />` JSX 제거 |
| R3 | `dashboard-preview/hit-areas.ts` | 99-102 | `{ id: 'ai-json-viewer', ... }` 엔트리 제거 |
| R4 | `lib/mock-data.ts` | 407 | `'ai-json-viewer': '...'` tooltip 제거 |
| R5 | `ai-panel/*.test.tsx` | 전체 | JSON 뷰어 렌더 단정 → 미렌더 단정 |
| R6 | `order-form/estimate-info-card.tsx` | 226 | "자동 배차" → "자동 배차 대기" |
| R7 | `order-form/estimate-info-card.tsx` | 2, 13, 19-20, 51 | JSDoc "자동 배차 토글" → "자동 배차 대기 토글" |
| R8 | `lib/mock-data.ts` | 414 | tooltip `'auto-dispatch'` 문구 변경 (T-CLEANUP-04) |
| R9 | `order-form/estimate-info-card.test.tsx` | 117, 154, 168 | 기대 문자열 "자동 배차 대기" 동기 |

### 유지 (NOOP — 가역성 확보)

| # | 파일 | 항목 |
|---|------|------|
| K1 | `ai-panel/ai-extract-json-viewer.tsx` | 컴포넌트 파일 유지 |
| K2 | `ai-panel/ai-extract-json-viewer.test.tsx` | 단위 테스트 유지 |
| K3 | `lib/mock-data.ts` line 160, 438 | `jsonViewerOpen` 타입·값 유지 (F2 이관 대기) |
| K4 | `lib/preview-steps.ts` | 각 Step `jsonViewerOpen` 필드 유지 (F2 이관 대기) |
| K5 | `dashboard-preview/hit-areas.ts` | `form-auto-dispatch` / `auto-dispatch` key 유지 (구조적 식별자) |

---

## 3. 성공 지표 (Draft §2 → 00-context/01-product-context §2 승계)

| # | 지표 | 측정 |
|---|------|------|
| 1 | `AiExtractJsonViewer` 화면 비노출 | `grep -rn "<AiExtractJsonViewer" src/` → 0 결과 |
| 2 | 미사용 식별자 제거 | `grep -rn "ai-json-viewer" src/components/dashboard-preview/hit-areas.ts src/lib/mock-data.ts` → 0 |
| 3 | `jsonViewerOpen` mock 보존 | `grep -rn "jsonViewerOpen" src/lib/mock-data.ts src/lib/preview-steps.ts` → 여러 결과 |
| 4 | 라벨 반영 | `grep -n "자동 배차" estimate-info-card.tsx` → 모두 "자동 배차 대기" |
| 5 | Tooltip 동기 | `'auto-dispatch'` 값 "자동 배차 대기 중 — 조건 충족 시 자동 배차합니다" |
| 6 | 미렌더 단정 갱신 | 통합 테스트 `queryByTestId('ai-extract-json-viewer').not.toBeInTheDocument()` |

---

## 4. Milestones (Draft §5 기반)

| TASK | 기간 | 의존 |
|------|------|------|
| T-CLEANUP-01 | 0.5 인·일 (D+0 ~ D+0.5) | — |
| T-CLEANUP-02 | 0.25 인·일 (D+0.5 ~ D+0.75) | — (병렬 가능) |
| T-CLEANUP-03 | 0.75 인·일 (D+0.75 ~ D+1.5) | T-CLEANUP-01 선행 (RED 기반) |
| T-CLEANUP-04 | 0.25 인·일 (D+1.5 ~ D+1.75) | T-CLEANUP-02 병합 권고 |

**총 기간**: 1.75 인·일 (RICE Effort 2 인·일 이내).
**Epic Phase A 기여**: F1 병렬 상대 — F5 선행 merge 권고.

---

## 5. Risks (Draft §6)

| ID | 리스크 | 완화 |
|----|--------|-----|
| R5-1 | 라인 번호 shift (기존 수정으로 인한 drift) | TASK 직전 `grep -n` 재확인 + Draft §3 라인 번호 검증 |
| R5-2 | 미식별 `AiExtractJsonViewer` import 잔존 (다른 파일) | `grep -rn "AiExtractJsonViewer" src/` 전수 검증 |
| R5-3 | 테스트 데이터 의존 (`jsonViewerOpen` 필드 참조 코드) | 필드 유지 원칙 (K3) 으로 해소 |
| R5-4 | F1 병렬 실행 시 라인 충돌 | F5 선행 merge + F1 rebase (02-scope-boundaries §4) |

---

## 6. Freeze 조건 변경 시

Draft 원본 (`01-draft.md`) 의 다음 항목 변경 시 본 freeze 무효:

- R1~R9 / K1~K5 추가·삭제·수정
- Lane 재판정 (Lite → Standard)
- 시나리오 재판정
- Hybrid 재판정

변경 발생 시 `/dev-feature` 재실행.
