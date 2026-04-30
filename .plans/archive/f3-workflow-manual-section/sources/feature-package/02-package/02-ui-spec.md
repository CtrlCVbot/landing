# 02. UI Spec - F3 업무 매뉴얼형 스크롤 섹션 MVP

---

## 1. Section Placement

| 항목 | 기준 | 연결 REQ |
|---|---|---|
| 기본 위치 | `Products` 직후, `Integrations` 이전 | REQ-F3-001, REQ-F3-008 |
| section id | `workflow` 또는 `workflow-manual` | REQ-F3-001 |
| layout role | 제품 카드가 아니라 업무 순서 설명 section | REQ-F3-008 |

`src/app/page.tsx` 기준 권장 순서:

```tsx
<Products />
<WorkflowManual />
<Integrations />
```

## 2. Content Structure

| 영역 | 필수 내용 | 연결 REQ |
|---|---|---|
| Eyebrow | `업무 흐름` 또는 유사한 짧은 라벨 | REQ-F3-001 |
| H2 | 화주와 주선사별 운영을 하나의 흐름으로 조율한다는 메시지 | REQ-F3-004 |
| Intro copy | 요청 양식, 배차 방식, 정산 기준, 외부 채널 연동 조율 | REQ-F3-004, REQ-F3-013 |
| Customization summary | 화주/주선사별 커스텀 가능 범위 요약 | REQ-F3-005 |
| Workflow list | 6단계 step card 또는 timeline | REQ-F3-002, REQ-F3-003 |
| CTA | 기존 `CTA_LINKS.service` 또는 `CTA_LINKS.contact` 재사용 가능 | REQ-F3-012 |

## 3. Workflow Step UI

| order | id | title | 표시 기준 |
|---:|---|---|---|
| 1 | `ai-order` | AI 오더 등록 | 여러 형식의 운송 요청을 오더 정보로 정리 |
| 2 | `locations` | 상하차지 관리 | 장소, 담당자, 현장 메모 재사용 |
| 3 | `dispatch-status` | 배차/운송 상태 | 배차 진행과 운송 상태 확인 |
| 4 | `hwamulman` | 화물맨 연동 | 배차 단계에서 운송 정보를 외부 채널로 전송 |
| 5 | `settlement` | 정산 자동화 | 운송 완료 후 정산 기준 관리 |
| 6 | `invoice` | 세금계산서 관리 | 정산 이후 증빙 상태 확인 |

각 step은 최소한 아래 정보를 보여준다.

- step number 또는 order
- title
- 짧은 description
- customization label 1개 이상

## 4. Layout

| Viewport | 레이아웃 | 기준 |
|---|---|---|
| Desktop 1280px+ | intro/CTA 왼쪽 + timeline/list 오른쪽 split | 한 화면에서 가치 메시지와 6단계 흐름 비교 가능 |
| Tablet 768px-1279px | intro 상단 + 2열 또는 single column list | 카드 너비가 좁아지면 single column으로 전환 |
| Mobile 375px-767px | intro + step cards single column | 긴 한글 문구가 줄바꿈되며 겹치지 않음 |

## 5. Visual Rules

| 항목 | 기준 |
|---|---|
| 카드 radius | 기존 section 카드 톤과 맞추고 8~12px 범위 유지 |
| hover | background/border 강조만 허용, card height 변화 금지 |
| icon | 필요 시 `lucide-react`에서 선택, manual SVG 추가 금지 |
| typography | section heading은 기존 `text-3xl md:text-4xl` 톤에 맞춤 |
| color | 기존 theme token만 사용, 신규 one-off color 추가 금지 |
| spacing | `SectionWrapper`의 기본 여백 사용 |

## 6. Accessibility

| 항목 | 기준 |
|---|---|
| Heading | section에 명확한 `h2` 제공 |
| List semantics | workflow steps는 `ol/li` 또는 접근 가능한 반복 구조 사용 |
| Focus | CTA가 있으면 visible focus 유지 |
| Motion | F3에서는 정보 전달을 animation에 의존하지 않음 |
| Reduced motion | F4 이전에는 static layout만으로 완전 이해 가능해야 함 |

## 7. Copy Guard

금지 또는 주의 문구:

```txt
실시간 API 자동 연동 완료
고객별 설정 저장 제공
화물맨 배차 성공 보장
정산/세금계산서 자동 발행 완료
```

허용 방향:

```txt
회사별 요청 양식에 맞춰 정리합니다
배차 단계에서 화물맨으로 이어 보냅니다
정산 기준과 증빙 상태를 흐름 안에서 관리합니다
```
