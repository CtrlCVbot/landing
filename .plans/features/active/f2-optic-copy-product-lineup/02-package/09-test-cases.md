# 09. Test Cases - F2 카피와 제품 라인업 정리

---

## 1. Test Case 목록

| TC | REQ | 검증 대상 | 권장 명령 |
|---|---|---|---|
| TC-F2-01 | REQ-F2-001, REQ-F2-002, REQ-F2-003 | 브랜드와 금지 문구 constants scan | `pnpm test -- constants.test.ts` |
| TC-F2-02 | REQ-F2-004, REQ-F2-005, REQ-F2-006, REQ-F2-009, REQ-F2-010 | Features/Problems 데이터가 업무 결과 중심 문구를 가짐 | `pnpm test -- constants.test.ts` |
| TC-F2-03 | REQ-F2-009, REQ-F2-011 | Features 렌더에 `화물맨 연동`과 배차 문맥이 보임 | `pnpm test -- features.test.tsx` |
| TC-F2-04 | REQ-F2-006, REQ-F2-007, REQ-F2-008, REQ-F2-014 | Products 렌더에 한글 역할명, 보조 라벨, 구현 예정 구분이 보임 | `pnpm test -- products.test.tsx` |
| TC-F2-05 | REQ-F2-011 | Integrations에서 `화물맨` 외 provider명이 전면 노출되지 않음 | `pnpm test -- integrations.test.tsx` |
| TC-F2-06 | REQ-F2-003, REQ-F2-011 | copy scan에서 금지 문구와 제한 provider명 잔존 없음 | `Select-String` scan |
| TC-F2-07 | REQ-F2-001, REQ-F2-002, REQ-F2-012 | Hero/Header/Footer F1 회귀 없음 | `pnpm test -- hero.test.tsx header.test.tsx footer.test.tsx` |
| TC-F2-08 | REQ-F2-013, REQ-F2-014 | F3 handoff 흐름과 desktop/mobile 텍스트 overflow 확인 | browser spot check + package review |

## 2. Red-Green 권장 순서

1. constants test에서 금지 문구와 새 제품 데이터 shape 기대값을 RED로 만든다.
2. Features test에서 `화물맨 연동`과 배차 문맥 기대값을 RED로 만든다.
3. Products test에서 한글 역할명과 구현 예정 상태 기대값을 RED로 만든다.
4. Integrations test에서 provider명 일반화 기대값을 RED로 만든다.
5. 구현 후 targeted tests를 GREEN으로 만든다.
6. `pnpm typecheck`, `pnpm lint`, `pnpm build`를 실행한다.

## 3. Browser QA Matrix

| 상태 | Viewport | 확인 |
|---|---|---|
| desktop | 1440px | Products 2개 구현 대상과 3개 구현 예정이 구분됨 |
| tablet | 768px | 제품 카드 줄바꿈과 간격 유지 |
| mobile | 375px | 긴 한글 역할명과 기능 목록이 카드 밖으로 넘치지 않음 |
| keyboard | any | 제품 tab/card CTA가 있으면 focus visible |

## 4. Forbidden Diff Check

```powershell
git diff --name-only -- src/components/dashboard-preview src/lib/mock-data.ts src/lib/preview-steps.ts package.json pnpm-lock.yaml package-lock.json
```

기대 결과는 빈 출력이다.
