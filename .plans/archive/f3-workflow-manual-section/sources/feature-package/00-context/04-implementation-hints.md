# Implementation Hints: f3-workflow-manual-section

> `/dev-feature`와 `/dev-run`에서 유지할 구현 힌트다. 실제 TASK SSOT는 `/dev-feature`가 생성할 `02-package` 문서다.
> 화면 구조는 [wireframe screens](../../../../wireframes/f3-workflow-manual-section/screens.md)와 [components](../../../../wireframes/f3-workflow-manual-section/components.md)를 우선 참조한다.

---

## 1. Workflow Content Seed

| order | id | title | description | customization |
|---:|---|---|---|---|
| 1 | `ai-order` | AI 오더 등록 | 여러 형식의 운송 요청을 오더 정보로 정리한다 | 화주별 요청 양식, 필수 입력값 |
| 2 | `locations` | 상하차지 관리 | 장소, 담당자, 현장 메모를 반복 입력 없이 재사용한다 | 장소명, 담당자, 현장 메모 |
| 3 | `dispatch-status` | 배차/운송 상태 | 배차 진행과 운송 상태를 한 흐름에서 확인한다 | 상태명, 승인 흐름 |
| 4 | `hwamulman` | 화물맨 연동 | 배차 단계에서 운송 정보를 외부 채널로 이어 보낸다 | 전송 시점, 전송 필드 |
| 5 | `settlement` | 정산 자동화 | 운송 완료 후 매출 정산 기준을 묶어 관리한다 | 청구 기준, 정산 기준 |
| 6 | `invoice` | 세금계산서 관리 | 정산 이후 증빙 상태까지 이어서 확인한다 | 발행 상태, 담당자 확인 |

---

## 2. Suggested Data Shape

```ts
type WorkflowStep = {
  id: 'ai-order' | 'locations' | 'dispatch-status' | 'hwamulman' | 'settlement' | 'invoice'
  order: number
  title: string
  description: string
  customization: string[]
  handoff?: string
  statusLabel?: string
}
```

필드명은 구현자가 repo convention에 맞게 바꿀 수 있지만, F4 handoff를 위해 stable `id`와 `order`는 유지한다.

---

## 3. Layout Guidance

| Viewport | 방향 |
|---|---|
| Desktop | intro/CTA + timeline split layout |
| Tablet | intro top + timeline single column 또는 2열 fallback |
| Mobile | intro + step cards single column |

기본 배치는 Products 직후다. 이 위치가 실제 `page.tsx` 흐름과 충돌하면 PRD/Wireframe에 기록된 이유를 보존한 채 가장 가까운 제품 라인업 이후 위치를 택한다.

---

## 4. Suggested Test Targets

| 테스트 | 목적 |
|---|---|
| workflow data test | 6단계 id/order/title 순서 검증 |
| section render test | headline, 6단계 제목, 화물맨/정산/세금계산서 문구 노출 |
| copy guard test 또는 scan | 실제 API/설정 저장 구현처럼 보이는 과장 표현 방지 |
| page composition test 또는 smoke | Products 이후 Workflow section 렌더링 확인 |
| responsive browser spot check | 375px mobile 텍스트 겹침 확인 |

---

## 5. Verification Commands

```powershell
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

문구 스캔은 `rg`가 막히면 PowerShell `Select-String`을 사용한다.

```powershell
Select-String -Path 'src\**\*.ts','src\**\*.tsx' -Pattern 'AI 오더 등록','화물맨 연동','정산 자동화','세금계산서 관리'
Select-String -Path 'src\**\*.ts','src\**\*.tsx' -Pattern '설정 저장','실시간 API','자동 연동 완료'
```

---

## 6. Guardrails

- `src/components/dashboard-preview/**`는 F3 구현 대상이 아니다.
- F2 제품 라인업 카드 구조를 중복하지 않는다.
- 실제 화물맨 API, 정산 API, 세금계산서 API를 추가하지 않는다.
- `package.json`에 신규 dependency를 추가하지 않는다.
- F4 애니메이션과 live 상태 mock을 F3에 끌어오지 않는다.
- 375px 모바일에서 문구가 겹치면 카피 길이와 layout을 함께 조정한다.
