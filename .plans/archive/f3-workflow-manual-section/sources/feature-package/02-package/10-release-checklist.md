# 10. Release Checklist - F3 업무 매뉴얼형 스크롤 섹션 MVP

> **Release 후보 상태**: ready for `/dev-verify`
> **마지막 갱신**: 2026-04-29

---

## 1. Scope Checklist

- [x] 신규 `WorkflowManual` section을 추가했다.
- [x] workflow data를 `src/lib/landing-workflow.ts`로 분리했다.
- [x] `src/app/page.tsx`에서 Products 이후에 배치했다.
- [x] DashboardPreview 관련 파일은 수정하지 않았다.
- [x] 신규 dependency를 추가하지 않았다.
- [x] 기존 Products/Features/Integrations section 역할을 유지했다.

---

## 2. Copy Checklist

- [x] `AI 오더 등록`이 보인다.
- [x] `상하차지 관리`가 보인다.
- [x] `배차/운송 상태`가 보인다.
- [x] `화물맨 연동`이 배차 단계로 보인다.
- [x] `정산 자동화`와 `세금계산서 관리`가 분리되어 보인다.
- [x] 화주/주선사별 커스텀 가능성이 요청 양식, 배차 방식, 정산 기준 조율 수준으로 표현된다.
- [x] 실제 API 연동 또는 설정 저장을 약속하지 않는다.
- [x] 한글 카피 인코딩 깨짐을 복구했다.

---

## 3. Verification Checklist

```powershell
pnpm test -- landing-workflow workflow-manual page
pnpm typecheck
pnpm test
pnpm lint
pnpm build
```

- [x] targeted unit/component/page tests 통과
- [x] full test 통과
- [x] TypeScript error 0
- [x] lint error 0
- [x] production build 성공
- [x] 필수 문구 scan 완료
- [x] 금지/주의 문구 scan 완료

---

## 4. Browser Checklist

- [x] desktop 1440px 확인
- [x] tablet 768px 확인
- [x] mobile 375px 확인
- [x] CTA focus visible 확인
- [x] hover/focus로 card height가 흔들리지 않음
- [x] sticky header가 workflow section 진입 시 제목을 덮지 않도록 `scroll-margin` 보강

---

## 5. Handoff Checklist

- [x] F4가 사용할 stable id와 order가 유지된다.
- [x] F4로 넘길 animation/live state scope가 F3에 섞이지 않았다.
- [x] `/dev-verify .plans/features/active/f3-workflow-manual-section/`로 이어갈 수 있다.
- [x] 구현 완료 후 archive 대상 source 목록에 `02-package`와 `03-dev-notes`를 포함할 수 있다.

---

## 6. Release Decision

| 판정 | 조건 | 현재 상태 |
|---|---|---|
| Ready for `/dev-verify` | 구현 완료, 테스트/타입/lint/build 통과, browser spot check 완료 | 충족 |
| Needs Fix | 모바일 overflow, 과장 문구, 순서 오류, forbidden path diff 발생 | 해당 없음 |
| Hold | 실제 API/DB/dependency 변경이 필요해진 경우 | 해당 없음 |

---

## 7. Known Warnings

`pnpm lint`와 `pnpm build`에서 기존 dashboard-preview 영역의 warning이 남아 있다. F3 변경 파일과 직접 관련된 신규 lint error는 없다.

| 파일/영역 | warning |
|---|---|
| `src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/ai-result-buttons.test.tsx` | `_groupId` unused |
| `src/components/dashboard-preview/interactions/use-focus-walk.ts` | `useMemo` dependency `targets` |
| dashboard-preview legacy/test 파일 | `_rest` unused |
