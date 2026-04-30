# Dev Output Summary - F3 업무 매뉴얼형 스크롤 섹션 MVP

> `/dev-run .plans/features/active/f3-workflow-manual-section/` 실행 결과 요약.
> 작성일: 2026-04-29

---

## 1. 결과

F3 업무 매뉴얼형 스크롤 섹션을 구현했다. 신규 섹션은 `Products` 이후, `Integrations` 이전에 배치되며 `AI 오더 등록 → 상하차지 관리 → 배차/운송 상태 → 화물맨 연동 → 정산 자동화 → 세금계산서 관리` 흐름을 보여준다.

화주/주선사별 커스텀 가능성은 요청 양식, 배차 방식, 정산 기준, 전송 필드 조율 수준으로 표현했다. 실제 API 연동, 설정 저장, 자동 처리 완료 같은 범위 초과 약속은 넣지 않았다.

---

## 2. 변경 파일

| 영역 | 파일 | 내용 |
|---|---|---|
| Workflow data | `src/lib/landing-workflow.ts` | 6단계 workflow data, stable id, customization copy |
| Section UI | `src/components/sections/workflow-manual.tsx` | 신규 `WorkflowManual` section, CTA, semantic `ol/li`, responsive layout |
| Page composition | `src/app/page.tsx` | `Products` 이후 `WorkflowManual`, `Integrations` 이전 배치 |
| Data test | `src/__tests__/lib/landing-workflow.test.ts` | step order, Hwamulman 위치, copy guard |
| Section test | `src/components/sections/__tests__/workflow-manual.test.tsx` | heading, intro, 6단계 렌더링, 제품 카드 반복 방지 |
| Page test | `src/__tests__/app/page.test.tsx` | page section order regression |

---

## 3. 검증 결과

| 검증 | 결과 | 메모 |
|---|---|---|
| Red test | 확인 | 구현 전 신규 data/component/page 테스트 실패 확인 |
| `pnpm test -- landing-workflow workflow-manual page` | 통과 | 3 files, 7 tests |
| `pnpm typecheck` | 통과 | TypeScript error 0 |
| `pnpm test` | 통과 | 55 files, 1118 tests |
| `pnpm lint` | 통과 | error 0, 기존 dashboard-preview warning 존재 |
| `pnpm build` | 통과 | static export 성공, 기존 warning 동일 |
| 문구 scan | 통과 | 필수 문구 존재, 금지 문구 없음 |
| Browser 1440px | 통과 | Products → Workflow → Integrations 순서 확인 |
| Browser 768px | 통과 | viewport overflow 0건 |
| Browser 375px | 통과 | mobile overflow 0건 |
| CTA focus | 통과 | focus ring box-shadow 확인 |

---

## 4. 브라우저 Evidence

정적 preview server:

```txt
http://localhost:3105
```

스크린샷:

```txt
C:/Users/user/AppData/Local/Temp/landing-f3-workflow-desktop.png
C:/Users/user/AppData/Local/Temp/landing-f3-workflow-mobile.png
```

자동 점검 결과:

```json
{
  "order": {
    "products": 3,
    "workflow": 4,
    "integrations": 5
  },
  "mobileOverflow": [],
  "focusEvidence": "도입 문의하기 CTA focus ring 확인"
}
```

---

## 5. Self Review

| 항목 | Severity | Confidence | Action | 결과 |
|---|---|---|---|---|
| 신규 소스 한글 카피 인코딩 깨짐 | high | confirmed | auto-fixed | `landing-workflow`, `workflow-manual`, 테스트 문자열 정상 한글로 복구 |
| sticky header가 workflow section 상단을 가릴 수 있음 | medium | likely | auto-fixed | 신규 section에 `scroll-mt-24 lg:scroll-mt-28` 추가 |
| 기존 dashboard-preview warning | low | confirmed | queued | F3 범위 밖이므로 남김 |

---

## 6. 다음 단계

```powershell
/dev-verify .plans/features/active/f3-workflow-manual-section/
```
