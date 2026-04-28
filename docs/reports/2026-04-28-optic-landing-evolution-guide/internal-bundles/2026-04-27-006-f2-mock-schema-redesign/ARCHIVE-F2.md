# Archive: F2 Mock 스키마 재설계

> **Key**: F2 | **Slug**: `f2-mock-schema-redesign` | **IDEA**: IDEA-20260424-001
> **Category**: Standard | **RICE Score**: 77.65 (Go) | **Archived**: 2026-04-27
> **Code Location**: `src/lib/mock-data.ts`, `src/lib/preview-steps.ts`, `src/components/dashboard-preview/**`
> **Pipeline**: Idea -> Screening -> Draft -> PRD -> Review -> Bridge -> Dev -> Verify -> Archive
> **Epic**: EPIC-20260422-001

---

## 1. 요약

Phase B의 dash-preview mock data 신뢰도 Feature다. AI가 추출한 값(`extractedFrame`)과 폼에 적용된 값(`appliedFrame`)을 분리하고, preview loop마다 demo-safe scenario를 random 순환하도록 변경했다.

추가 사용자 피드백으로 `AI_APPLY` 전에는 CompanyManager 외 추출 대상 값을 모두 숨기고, `AI_APPLY` 내부에서는 상차지 -> 하차지 -> 예상 운임/거리 -> 화물/차량+운송 옵션 -> 정산 정보 순서로 값이 적용되게 했다. 애니메이션도 파트별 적용을 눈으로 확인할 수 있도록 느리게 조정했다.

## 2. 원본 파일 매니페스트

| 원본 경로 | 현재 위치 | 유형 |
|---|---|---|
| `.plans/ideas/20-approved/IDEA-20260424-001.md` | `sources/ideas/IDEA-20260424-001.md` | IDEA |
| `.plans/ideas/20-approved/SCREENING-20260424-001.md` | `sources/ideas/SCREENING-20260424-001.md` | Screening |
| `.plans/drafts/f2-mock-schema-redesign/` | `sources/drafts/` | Draft / PRD / Review / Routing |
| `.plans/features/active/f2-mock-schema-redesign/` | `sources/feature-package/` | Feature Package / Dev Notes |

## 3. 완료 근거

| 항목 | 결과 | 근거 |
|---|---|---|
| TASK | 완료 | T-F2-SCHEMA-01~06 + T-F2-RANDOM-07 + T-F2-STAGED-08 |
| Feature 상태 | archived | 2026-04-27 archive bundle 생성 및 원본 이동 |
| Unit/Component tests | 통과 | `pnpm test` 45 files / 1039 tests PASS |
| Typecheck | 통과 | `pnpm typecheck` PASS |
| Lint | 통과 | `pnpm lint` PASS with existing warnings |
| Build | 통과 | `pnpm build` 단독 재실행 PASS |
| Manual preview | 통과 | `output/verification/dash-preview-step4-staged-samples.json`, `output/verification/dash-preview-step4-staged-final.png` |

## 4. 주요 결정

| Decision | 내용 |
|---|---|
| D-F2-008 | compatibility helper API 확정 |
| D-F2-009 | `jsonViewerOpen=false`를 `extractedFrame.aiResult`에 유지 |
| D-F2-010 | `mismatch-risk`는 fixture-only, user-facing UI 제외 |
| D-F2-011 | demo-safe scenario 3개를 loop 시작 시 random 선택 |
| D-F2-012 | CompanyManager 외 추출 대상 전체를 적용 전 placeholder/neutral 처리 |
| D-F2-013 | `formRevealTimeline`으로 `AI_APPLY` 내부 적용 순서 확정 |
| D-F2-014 | Step duration, focus interval, number rolling, option stroke timing을 느리게 조정 |
| D-F2-015 | archive 전 fresh verification PASS 기록 |

## 5. 구현 결과

| 영역 | 결과 |
|---|---|
| Scenario schema | `PREVIEW_MOCK_SCENARIOS` 5개, `randomizable` flag 추가 |
| Demo random pool | `default`, `regional-cold-chain`, `short-industrial-hop` |
| Fixture-only | `partial`, `mismatch-risk` |
| Helper | `selectPreviewMockScenario`, `getDefaultPreviewMockScenario`, `getRandomizablePreviewMockScenarios`, `selectRandomPreviewMockScenario`, `createPreviewMockData` |
| Display before apply | `LocationForm`, `DateTimeCard`, `CargoInfoForm`, `TransportOptionCard`, `EstimateInfoCard`, `SettlementSection` 값 숨김 |
| Apply timing | `pickupAt=0`, `deliveryAt=650`, `estimateAt=900`, `cargoAt=1300`, `optionsAt=1300`, `fareAt=1950`, `settlementAt=2200` |
| Animation | `INITIAL=800ms`, `AI_INPUT=2200ms`, `AI_EXTRACT=1400ms`, `AI_APPLY=4200ms`, partial interval `650ms`, all beat `1200ms` |

## 6. 남은 참고사항

- `pnpm lint`와 `pnpm build`는 통과했지만 기존 unused var / hook dependency / Next.js workspace warning은 남아 있다.
- 테스트와 빌드를 병렬 실행했을 때 `/_document` module 관련 transient build failure가 1회 있었고, build 단독 재실행은 통과했다.
- `output/verification/**` evidence는 archive source로 이동하지 않고 경로 참조만 남긴다.
- F3 옵션-추가요금 파생은 F2의 `formData.options`, `settlement.additionalFees`, scenario consistency rule 위에서 진행한다.

## 7. Phase 연결

F2 archive 완료로 Phase B의 mock schema / staged apply 축은 닫혔다. F4도 이미 archived 상태이므로 Phase B 종료 조건은 충족됐다. 다음 단계는 F3 옵션↔추가요금 파생 로직 등록과 착수다.
