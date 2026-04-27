# PRD Review: F2 Mock 스키마 재설계

> **대상 PRD**: [02-prd.md](./02-prd.md)
> **대상 Draft**: [01-draft.md](./01-draft.md)
> **IDEA**: [IDEA-20260424-001](../../ideas/20-approved/IDEA-20260424-001.md)
> **Epic**: [EPIC-20260422-001](../../epics/20-active/EPIC-20260422-001/00-epic-brief.md)
> **작성일**: 2026-04-24
> **리뷰 범위**: PRD 품질 + PCC 일관성 검토. Bridge 생성은 제외.

---

## 1. Verdict

| 항목 | 판정 | 메모 |
|---|---|---|
| 최종 판정 | Approve | PRD 10 섹션과 요구사항 ID 체계가 충족됨 |
| 다음 단계 | archive 완료 | `/plan-bridge`, `/dev-feature`, `/dev-run`, fresh verification, archive 완료 |
| 차단 이슈 | 없음 | critical/high 피드백 없음 |
| 남은 피드백 | 해소 | schema compatibility helper, `jsonViewerOpen`, random scenario, staged reveal 결정 기록 완료 |

## 2. 4축 평가

| 평가 축 | 등급 | 근거 |
|---|:---:|---|
| 완전성 | A | PRD 10 섹션, REQ 10건, Metric 6건 포함 |
| 일관성 | A | Draft의 extracted/applied split, scenario count, Step visibility 결정이 PRD에 반영됨 |
| 실행 가능성 | A- | deterministic default helper로 테스트 안정성을 확보했으나 테스트 마이그레이션 비용은 큼 |
| 사용자 중심성 | A | Step별 완성 수치 미노출과 AI 추출/폼 적용 구분을 사용자 관점으로 정리 |

## 3. PRD 12항목 체크리스트

| # | 항목 | 결과 | 근거 |
|---|---|:---:|---|
| 1 | 10개 필수 섹션 존재 | PASS | §1~§10 존재 |
| 2 | 모든 요구사항 REQ-ID 부여 | PASS | REQ-f2-mock-schema-001~010 |
| 3 | User Story 표준 형식 | PASS | As a / I want / So that 형식 |
| 4 | 비기능 요구 포함 | PASS | 테스트 안정성, deterministic selector, Step visibility 포함 |
| 5 | Success Metrics 측정 가능 | PASS | scenario count, frame source, visibility, fee consistency 측정 가능 |
| 6 | Risks와 Mitigations 포함 | PASS | §9에 5개 리스크와 완화책 포함 |
| 7 | Non-Goals 명시 | PASS | real AI, F3, F4, selector UI, backend 제외 |
| 8 | 기술 제약과 의존성 포함 | PASS | F3 선행 기반, F4 병렬 충돌 회피, adapter 고려 포함 |
| 9 | Milestones 현실성 | PASS | review → bridge → schema → visibility → consistency/test 순서 |
| 10 | 용어 일관성 | PASS | `extractedFrame`, `appliedFrame`, `PREVIEW_MOCK_SCENARIOS` 일관 |
| 11 | 내부 참조 일관성 | PASS | IDEA, Screening, Draft, Routing metadata 참조 |
| 12 | 이전 단계 범위와 일치 | PASS | Draft §2~§5의 범위를 확장 없이 반영 |

## 4. PCC 검증

| PCC | 결과 | 근거 |
|---|:---:|---|
| PCC-01 Idea → Screen | PASS | IDEA-20260424-001와 SCREENING-20260424-001가 연결됨 |
| PCC-02 Screen → Draft | PASS | Go / Standard / Scenario B / dev 판정이 Draft에 반영됨 |
| PCC-03 Draft → PRD | PASS | Draft의 acceptance criteria와 decisions가 REQ/Metric으로 전개됨 |
| PCC-08 Feature 상태 SSOT | PASS | IDEA, children, handoff 동기화 대상이 명확함 |
| PCC-09 의존성 매트릭스 | PASS | F2 → F3 순차, F2 ↔ F4 병렬 가능 관계가 유지됨 |

## 5. 피드백

| ID | Severity | Impact / Reach / Recovery / Total | Confidence | Action | 메모 |
|---|---|---|---|---|---|
| F2-PRD-FB-01 | medium | 2 / 1 / 1 / 4 | likely | queued | 기존 test migration을 줄일 compatibility helper의 실제 API는 Bridge/Dev 단계에서 고정 필요 |
| F2-PRD-FB-02 | medium | 2 / 1 / 1 / 4 | likely | queued | `jsonViewerOpen` 유지/이관/제거 결정은 구현 전에 decision log에서 확정 필요 |
| F2-PRD-FB-03 | low | 1 / 1 / 0 / 2 | tentative | queued | scenario selector UI는 Could로 분리되어 있으나, 사용자 요청이 생기면 별도 scope 확인 필요 |

### 2026-04-27 피드백 반영 결과

| ID | 상태 | 반영 |
|---|---|---|
| F2-PRD-FB-01 | resolved | `selectPreviewMockScenario`, `getDefaultPreviewMockScenario`, `createPreviewMockData`, `selectRandomPreviewMockScenario`로 helper API 확정 |
| F2-PRD-FB-02 | resolved | `jsonViewerOpen=false`를 `extractedFrame.aiResult` 내부에 유지 |
| F2-PRD-FB-03 | resolved | 공개 selector UI는 제외하고 random preview loop만 적용 |

## 6. 자동 반영 여부

| 항목 | 상태 | 이유 |
|---|---|---|
| critical/high 피드백 | 없음 | 즉시 수정이 필요한 차단 항목 없음 |
| medium 피드백 | 보류 | schema API와 잔재 필드 처리는 Feature Package/Dev Task에서 실제 파일 구조를 보고 결정해야 함 |
| low 피드백 | 보류 | MVP 범위 관리 메모로 충분함 |

## 7. 승인 조건

사용자 승인 후 Bridge 단계에 진입할 수 있다. 2026-04-24 후속 실행으로 아래 Bridge는 완료되었다.

```bash
/plan-bridge f2-mock-schema-redesign
```

본 리뷰에서는 Bridge 파일을 생성하지 않았다.

후속 산출물: [`.plans/features/active/f2-mock-schema-redesign/00-context/`](../../features/active/f2-mock-schema-redesign/00-context/00-index.md)

## 8. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-24 | F2 PRD 리뷰 작성 — Approve 판정, PCC 5종 PASS, medium 2건/low 1건 후속 피드백 등록. |
| 2026-04-24 | 후속 `/plan-bridge f2-mock-schema-redesign` 완료 링크 추가. |
| 2026-04-27 | 구현 완료 후 리뷰 피드백 3건 해소 상태로 갱신. |
