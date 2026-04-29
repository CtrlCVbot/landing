# 10. Release Checklist - F3 업무 매뉴얼형 스크롤 섹션 MVP

---

## 1. Scope Checklist

- [ ] 신규 `WorkflowManual` section이 추가되었다.
- [ ] workflow data가 `src/lib/landing-workflow.ts`에 분리되었다.
- [ ] `src/app/page.tsx`에서 Products 이후에 배치되었다.
- [ ] DashboardPreview 관련 파일을 수정하지 않았다.
- [ ] 신규 dependency를 추가하지 않았다.

## 2. Copy Checklist

- [ ] `AI 오더 등록`이 보인다.
- [ ] `상하차지 관리`가 보인다.
- [ ] `배차/운송 상태`가 보인다.
- [ ] `화물맨 연동`이 배차 단계로 보인다.
- [ ] `정산 자동화`와 `세금계산서 관리`가 분리되어 보인다.
- [ ] 화주/주선사별 커스텀 가능성이 요청 양식, 배차 방식, 정산 기준 조율 수준으로 표현된다.
- [ ] 실제 API 연동 또는 설정 저장을 약속하지 않는다.

## 3. Verification Checklist

```powershell
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

- [ ] unit/component tests 통과
- [ ] TypeScript error 0
- [ ] lint error 0
- [ ] production build 성공
- [ ] 필수 문구 scan 완료
- [ ] 금지/주의 문구 scan 완료

## 4. Browser Checklist

- [ ] desktop 1440px 확인
- [ ] tablet 768px 확인
- [ ] mobile 375px 확인
- [ ] CTA focus visible 확인
- [ ] hover/focus로 card height가 흔들리지 않음

## 5. Handoff Checklist

- [ ] F4가 사용할 stable id와 order가 유지된다.
- [ ] F4로 넘길 animation/live state scope가 F3에 섞이지 않았다.
- [ ] `/dev-verify .plans/features/active/f3-workflow-manual-section/`로 넘어갈 수 있다.
- [ ] 구현 완료 후 archive 대상 source 목록에 `02-package`가 포함된다.

## 6. Release Decision

| 판정 | 조건 |
|---|---|
| Ready for `/dev-verify` | 구현 완료, 테스트/타입/lint/build 통과, browser spot check 완료 |
| Needs Fix | 모바일 overflow, 과장 문구, 순서 오류, forbidden path diff 발생 |
| Hold | 실제 API/DB/dependency 변경이 필요해진 경우 |
