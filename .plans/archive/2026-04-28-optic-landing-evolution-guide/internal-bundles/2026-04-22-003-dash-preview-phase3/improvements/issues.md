# dash-preview Phase 3 — 이슈 현황 진단

> 아이디어·계획 수립 전 단계의 **문제 파악 문서**. 해결 방안·우선순위·공수 추정은 포함하지 않는다.
>
> - 입력: [`추가 수정사항.md`](.plans/archive/dash-preview-phase3/improvements/추가%20수정사항.md) (사용자 원본 피드백 4건)
> - 범위: `apps/landing` 내 dash-preview 관련 컴포넌트·페이지·상태·목 데이터
> - 작성일: 2026-04-22

## 이슈 요약

| ID | 제목 | 관련 영역 |
|----|------|-----------|
| [1] | 전역 다크 단일 팔레트 — 라이트 모드 인프라 없음 | 전역 테마, dash-preview 전반 |
| [2-1] | 하차지명 — AI 추출값과 폼 적용값이 완전히 다른 도시 | `lib/mock-data.ts` AI 카테고리 / formData |
| [2-2] | 화물 품목 — AI 추출값과 폼 적용값이 서로 다른 품목 | `lib/mock-data.ts` AI 카테고리 / formData |
| [2-3] | 거리·소요·운임 — AI_EXTRACT 전부터 완성 수치가 이미 노출됨 | `estimate-info-card`, `order-form/index` |
| [2-4] | 목 데이터 — 단일 시나리오 고정, 랜덤 3~4개 세트 기능 없음 | `PREVIEW_MOCK_DATA` 설계 |
| [2-5] | 추가 요금 — `options` 토글과 `additionalFees` 사이 파생 로직 없음 | `settlement-section`, `transport-option-card` |
| [3] | Col 2 내부 `DateTimeCard` 2장이 수직 스택 (space-y-4) | `ai-register-main/order-form/index.tsx` |
| [4] | 인터랙티브 오버레이 테두리가 실제 컴포넌트 박스와 어긋남 | `interactive-overlay`, `hit-areas`, `preview-chrome` |
| [5] | AI 패널 "추출 결과 JSON" 뷰어가 항상 렌더 중 | `ai-panel`, `ai-extract-json-viewer`, `hit-areas`, `mock-data` |
| [6] | EstimateInfoCard "자동 배차" 토글 라벨 문구 | `estimate-info-card` |

---

## [1] 전역 다크 단일 팔레트 — 라이트 모드 인프라 없음

- **원본 메모**: "1. 전체 디자인 다크모드로 되어있는데 밝은 모드로 전환해서 반영될수 있게 dash-preview도 마찬가지."
- **관련 위치**
  - [src/app/globals.css:9-40](src/app/globals.css#L9-L40) — `@theme inline` 블록에 `--color-background: #0a0a0a`, `--color-foreground: #ffffff`, `--color-card: oklch(0.15 0.01 260 / 0.5)`, `--color-border: #1f2937` 등 **다크 값 단일 팔레트** 하드코딩.
  - [src/app/layout.tsx:46](src/app/layout.tsx#L46) — `<html lang="ko" className={inter.variable}>`. `dark` 클래스나 `data-theme` 속성 부여 없음, `ThemeProvider`/`next-themes` 등 테마 전환 인프라 없음.
  - dash-preview 컴포넌트 대부분이 **다크 전제 Tailwind 클래스**를 인라인 하드코딩:
    - [datetime-card.tsx:76-77](src/components/dashboard-preview/ai-register-main/order-form/datetime-card.tsx#L76-L77) — `bg-white/5 border border-white/10 ...`
    - [estimate-info-card.tsx:72](src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx#L72) — `bg-white/5 border border-white/10 ...`
    - [settlement-section.tsx:67-68](src/components/dashboard-preview/ai-register-main/order-form/settlement-section.tsx#L67-L68) — 동일 패턴
    - [transport-option-card.tsx:66-67](src/components/dashboard-preview/ai-register-main/order-form/transport-option-card.tsx#L66-L67) — 동일 패턴
    - [order-form/index.tsx:234](src/components/dashboard-preview/ai-register-main/order-form/index.tsx#L234) — `bg-gradient-to-br from-gray-900/50 to-gray-950/50`
    - [preview-chrome.tsx:92](src/components/dashboard-preview/preview-chrome.tsx#L92) — `border-gray-800 bg-gray-900/50`
    - [interactive-tooltip.tsx:74](src/components/dashboard-preview/interactive-tooltip.tsx#L74) — `bg-gray-900/90 text-white`
- **현재 동작**: 테마 토글/쿼리/클래스와 무관하게 항상 다크 팔레트만 렌더. 라이트 대체 색 정의 없음.
- **관찰된 문제**: 라이트 모드로 "전환"하려 해도 토큰(dark/light 매핑)도, 전환 트리거도, 컴포넌트 레벨의 다크/라이트 변형 클래스도 존재하지 않는다. 컴포넌트 전반의 `text-white`, `bg-white/5`, `border-white/10`, `from-gray-900/50` 같은 다크 전용 색값이 개별 파일에 분산되어 있어 토큰 치환만으로는 밝은 배경에서 텍스트·선·카드가 식별되지 않을 가능성이 크다.
- **모호한 점**: 원문이 "토글 지원"을 요구하는지, "다크 제거 후 라이트 전면 교체"를 요구하는지 명시되지 않음. 전환 트리거(시스템 `prefers-color-scheme`, 사용자 토글, 빌드타임 분기) 기준 미정.

---

## [2-1] 하차지명 — AI 추출값과 폼 적용값이 완전히 다른 도시

- **원본 메모**: "2. dash-preview 기능 중 데이터가 불일치 하는 부분이 있음 추출된 정보랑 적용된 정보가 다름 — 하차지 명다름."
- **관련 위치**
  - [mock-data.ts:298-299](src/lib/mock-data.ts#L298-L299) — `AI_INPUT_MESSAGE`: "서울 강남구 물류센터에서 **대전 유성구 산업단지**로 ..."
  - [mock-data.ts:329-343](src/lib/mock-data.ts#L329-L343) — AI 카테고리 `destination.buttons[0].displayValue`: **"대전 유성구 산업단지"**
  - [mock-data.ts:432-436](src/lib/mock-data.ts#L432-L436) — `aiResult.evidence['destination-address1']`: **"대전 유성구 산업단지"**
  - [mock-data.ts:232-245](src/lib/mock-data.ts#L232-L245) — `DELIVERY_MOCK`: `company: '부산물류허브'`, `address: '부산광역시 강서구 녹산산업중로 333'`
- **현재 동작**: AI 입력 메시지와 AI 추출 결과는 "대전 유성구"로 일관된다. 그러나 OrderForm의 `delivery` 위치(LocationForm 및 DateTimeCard가 소비하는 값)는 "부산광역시 강서구"로, 추출 결과와 **서로 다른 도시·기관명**이다.
- **관찰된 문제**: AI_APPLY Step에서 "추출 결과가 폼에 적용된다"는 데모 내러티브가 성립하지 않는다. 추출된 하차지와 폼에 채워지는 하차지가 애초부터 무관한 데이터라 사용자에게는 "다른 값으로 바뀌어 들어갔다"로 보인다.

---

## [2-2] 화물 품목 — AI 추출값과 폼 적용값이 서로 다른 품목

- **원본 메모**: "화물 품목 다름"
- **관련 위치**
  - [mock-data.ts:299](src/lib/mock-data.ts#L299) — 입력 메시지: "... 5톤 카고 파레트 **공산품** 3파레트 ..."
  - [mock-data.ts:344-366](src/lib/mock-data.ts#L344-L366) — AI 카테고리 `cargo.buttons[1].displayValue`: **"파레트 적재 공산품 3파레트"**
  - [mock-data.ts:253-256](src/lib/mock-data.ts#L253-L256) — `CARGO_MOCK`: `name: '전자제품'`, `remark: '파손 주의'`
  - [mock-data.ts:247-251](src/lib/mock-data.ts#L247-L251) — `VEHICLE_MOCK.recentCargoSuggestions: ['전자제품', '공산품', '가구']` — 폼 suggestion 드롭다운용 소스 (AI 추출과 독립).
- **현재 동작**: AI 카테고리 `cargo` 섹션은 "공산품"을 추출값으로 노출한다. 실제 폼(`CargoInfoForm`)에 주입되는 `formData.cargo.name`은 "전자제품"으로 고정.
- **관찰된 문제**: [2-1]과 동일 구조의 불일치. 추출 vs 적용 값이 다름.

---

## [2-3] 거리·소요·운임 — AI_EXTRACT 전부터 완성 수치가 이미 노출됨

- **원본 메모**: "정산 정보는 이미 데이터 고정되어있음 (예상 운임/거리 표기되는 부분은 이미 360km, 300분, 운임이 고정되어 있음 추출되기도 전에.)"
- **관련 위치**
  - [mock-data.ts:270-275](src/lib/mock-data.ts#L270-L275) — `ESTIMATE_MOCK`: `distance: 360, duration: 300, amount: 850000, autoDispatch: true`
  - [mock-data.ts:277-288](src/lib/mock-data.ts#L277-L288) — `SETTLEMENT_MOCK`: `chargeBaseAmount: 850000, dispatchBaseAmount: 750000`, totals `{chargeTotal: 880000, dispatchTotal: 780000, profit: 100000}` 고정.
  - [mock-data.ts:375-381](src/lib/mock-data.ts#L375-L381) — AI 카테고리 `fare.buttons[0].displayValue`: **"420,000원"** (formData.estimate.amount = 850,000 과도 불일치)
  - [order-form/index.tsx:276-280](src/components/dashboard-preview/ai-register-main/order-form/index.tsx#L276-L280) — `EstimateDistanceInfo`의 `visible` 조건: `step.id === 'AI_APPLY'`. AI_APPLY 이전 Step에서는 이 컴포넌트만 placeholder 처리.
  - [order-form/index.tsx:324-336](src/components/dashboard-preview/ai-register-main/order-form/index.tsx#L324-L336) — `EstimateInfoCard`/`SettlementSection`은 Step 분기 없이 항상 렌더, `active={allBeat.active}`만 전달.
  - [estimate-info-card.tsx:106-119](src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx#L106-L119) — `useNumberRolling(waiting ? 0 : distance, options)`. `active=false` 경로(AI_APPLY 외 Step)에서 `waiting=false` 이며 `useNumberRolling`이 **즉시 target 값을 반환** → 초기 Step부터 360/300/850,000이 정적 노출.
  - [settlement-section.tsx:100-108](src/components/dashboard-preview/ai-register-main/order-form/settlement-section.tsx#L100-L108) — 동일 구조. `active=false`일 때 합계 3종이 즉시 target 값.
- **현재 동작**: `EstimateDistanceInfo`만 AI_APPLY 진입 이전에 placeholder로 가려진다. 같은 컬럼의 `EstimateInfoCard`, `SettlementSection`은 AI_APPLY 여부와 무관하게 항상 최종 수치(360km·300분·850,000원, 청구/지급/수익 합계)가 보인다.
- **관찰된 문제**: 사용자가 AI 추출 전부터 완성된 견적·정산 수치를 보게 된다. "추출 → 적용"의 내러티브가 동작하지 않고, AI 추출 결과 운임 "420,000원"과도 자릿수부터 상이해 일관성 검증에도 실패한다.

---

## [2-4] 목 데이터 — 단일 시나리오 고정, 랜덤 3~4개 세트 기능 없음

- **원본 메모**: "3~4개 목 데이터 랜덤하게 작성 추출 반영되는 기능이 있었으면 함."
- **관련 위치**
  - [mock-data.ts:421-454](src/lib/mock-data.ts#L421-L454) — `PREVIEW_MOCK_DATA` 단일 `const` export.
  - [dashboard-preview.tsx:8](src/components/dashboard-preview/dashboard-preview.tsx#L8), [dashboard-preview.tsx:171](src/components/dashboard-preview/dashboard-preview.tsx#L171) — `import { PREVIEW_MOCK_DATA } from '@/lib/mock-data'` 후 `<AiRegisterMain ... mockData={PREVIEW_MOCK_DATA} />` 로 그대로 전달.
  - [mock-data.ts:247-256](src/lib/mock-data.ts#L247-L256) — `recentCargoSuggestions: ['전자제품', '공산품', '가구']` — 이름만 "suggestions"이지 `CargoInfoForm`의 suggestion 드롭다운용 목록. 시나리오 전체(상·하차지/화물/운임)를 함께 교체하는 로직과는 무관.
- **현재 동작**: 전체 미리보기는 항상 동일한 한 세트(서울 강남 → 부산/대전, 공산품/전자제품, 360km/850,000원)를 렌더. 시나리오를 2개 이상 정의하는 구조 없음.
- **관찰된 문제**: "3~4개 세트를 무작위로 돌려가며 보여주기"라는 요청을 만족시킬 데이터 모델·선택 로직이 **미존재**. 신규 설계가 필요한 항목.
- **모호한 점**: 랜덤 트리거 시점(마운트마다 1회 / 주기적 교체 / 재생 버튼 클릭 시) 미정. "추출 반영되는 기능"이 입력 메시지까지 세트에 포함되는지도 원문만으론 확정 불가.

---

## [2-5] 추가 요금 — `options` 토글과 `additionalFees` 사이 파생 로직 없음

- **원본 메모**: "추가 요금도 운송옵션이 체크되면 적용되는 방식으로 보여줬으면함."
- **관련 위치**
  - [mock-data.ts:277-288](src/lib/mock-data.ts#L277-L288) — `SETTLEMENT_MOCK.additionalFees`: `[{ id: 'fee-toll', type: '고속료', amount: 30000, memo: '경부/남해선', target: 'both' }]` — **하드코딩 1건 고정**.
  - [mock-data.ts:258-268](src/lib/mock-data.ts#L258-L268) — `OPTIONS_MOCK`: 8 bool 필드 (`fast`/`roundTrip`/`direct`/`trace`/`forklift`/`manual`/`cod`/`special`), `direct: true, forklift: true` 고정.
  - [transport-option-card.tsx:140-200](src/components/dashboard-preview/ai-register-main/order-form/transport-option-card.tsx#L140-L200) — `options`를 SVG 체크마크 렌더에만 사용. 외부 콜백/파생값 없음.
  - [settlement-section.tsx:230-255](src/components/dashboard-preview/ai-register-main/order-form/settlement-section.tsx#L230-L255) — `AdditionalFeesList`는 주어진 `fees` 배열을 그대로 렌더. options를 참조하지 않음.
  - [order-form/index.tsx:319-336](src/components/dashboard-preview/ai-register-main/order-form/index.tsx#L319-L336) — `TransportOptionCard`와 `SettlementSection`이 같은 `formData`를 받지만 두 컴포넌트 사이에 파생 계산 없음.
- **현재 동작**: `options` 중 어떤 옵션이 켜지든 `additionalFees`는 항상 고속료 30,000원 1건만 노출.
- **관찰된 문제**: "옵션 체크 → 해당 비용이 추가 요금 목록에 자동 반영"이라는 관계가 데이터 모델·계산 로직·렌더 연결 어디에도 없다. 옵션 키(`forklift`, `special`, `manual` 등)와 수수료 항목(`type`, `amount`)의 매핑 정의 자체가 존재하지 않음.
- **모호한 점**: 각 옵션이 어떤 비용 항목으로 환산되는지(금액·이름)에 대한 스펙 미정.

---

## [3] Col 2 내부 `DateTimeCard` 2장이 수직 스택

- **원본 메모**: "3. 상차 일시, 하차 일시 카드가 위아래로 배치 되있음 2열로 양옆으로 배치해주세요 쓸데없이 높이가 늘어나서 그럼."
- **관련 위치**
  - [order-form/index.tsx:267-305](src/components/dashboard-preview/ai-register-main/order-form/index.tsx#L267-L305) — Col 2 컨테이너 `className="lg:col-span-1 space-y-4 rounded-lg transition-shadow duration-200"` 아래에 `EstimateDistanceInfo` → `DateTimeCard(pickup)` → `DateTimeCard(delivery)` → `CargoInfoForm` 4개가 **flow 순서대로 수직 스택**.
  - [datetime-card.tsx:194-253](src/components/dashboard-preview/ai-register-main/order-form/datetime-card.tsx#L194-L253) — 카드 자체는 반응형 너비 가정 (외부 래퍼의 너비에 따름). 헤더 + 프리셋 3버튼 + 날짜/시간 2필드 = 세로 ~180px 추정.
  - [hit-areas.ts:134-142](src/components/dashboard-preview/hit-areas.ts#L134-L142) — hit 영역이 `pickup-datetime: {x: 766, y: 106, width: 344, height: 96}`, `delivery-datetime: {x: 766, y: 214, width: 344, height: 96}` 로 **세로 스택 전제**의 좌표로 하드코딩되어 있음 ([이슈 4와 결합 영향 있음]).
- **현재 동작**: 한 열(Col 2) 안에서 4개 카드가 세로로 쌓임. DateTimeCard 두 개가 각각 한 층씩 차지하며 Col 2 전체 세로 길이를 늘리는 주 원인.
- **관찰된 문제**: 원문 요청("2열로 양옆으로")을 만족하려면 Col 2 내부에서 pickup/delivery DateTimeCard만 `grid grid-cols-2` 또는 `flex gap-*`로 횡배치가 필요하다. 현재 그 래퍼가 없다. 부가로 `hit-areas.ts`가 세로 스택을 전제로 수동 좌표를 박아두어 배치를 바꾸면 hit 영역도 함께 갱신해야 한다(이슈 4와 교차 영향).

---

## [4] 인터랙티브 오버레이 테두리가 실제 컴포넌트 박스와 어긋남

- **원본 메모**: "4. 그리고 애니메이션 기능 왜. 마우스로 컴포넌트 클릭했을때 툴팁이 나올때 컴포넌트를 감싸는 테두리가 각 컴포넌트에 정확한 위치에 잡히지 않음 컴포넌트를 가린다든지 크기가 안맞고 위치가 안맞는 경우가 많음."
- **관련 위치**
  - [hit-areas.ts:40-172](src/components/dashboard-preview/hit-areas.ts#L40-L172) — 19개 HitArea의 `bounds: {x, y, width, height}`가 원본 1440×900 가상 좌표로 **수동 하드코딩**. 주석(`// 외곽 chrome 을 제외한 콘텐츠 영역: 1440 × 900 px`)으로 "chrome 제외" 전제 명시.
  - [hit-areas.ts:179](src/components/dashboard-preview/hit-areas.ts#L179) — `TABLET_HIT_AREAS = DESKTOP_HIT_AREAS`. 뷰포트별 좌표 분기 없음.
  - [interactive-overlay.tsx:119-171](src/components/dashboard-preview/interactive-overlay.tsx#L119-L171) — `<div ... className={cn('absolute inset-0 pointer-events-none', className)}>` 로 **PreviewChrome 전체**(dashboard-preview.tsx:167의 `<div className="relative">` 안)를 덮는다. 각 버튼 위치는 `left: bounds.x * scaleFactor`, `top: bounds.y * scaleFactor`만 사용. ChromeHeader offset 보정 없음.
  - [interactive-overlay.tsx:138-149](src/components/dashboard-preview/interactive-overlay.tsx#L138-L149) — `isHighlighted` 시 `'ring-2 ring-purple-500'`로 **버튼 자체 테두리**만 그린다. 별도 "테두리 레이어"가 실제 DOM 요소 경계를 측정해 그리는 로직 없음.
  - [preview-chrome.tsx:34-100](src/components/dashboard-preview/preview-chrome.tsx#L34-L100) — `<ChromeHeader>` (padding `px-3 py-2` + dot 2.5×2.5 + "OPTIC Broker" 텍스트)가 overlay 상단에 포함됨. 그 아래 `ScaledContent`가 `transform: scale(scaleFactor); transformOrigin: 'top left'` 로 내용을 축소.
- **현재 동작**: 19 hit 영역 모두 원본 좌표의 비율 축소만으로 버튼을 배치한다. 그 좌표계는 "ChromeHeader를 제외한 OrderForm/AiPanel 콘텐츠 (0,0)" 기준으로 주석에 명시되어 있지만, overlay 자체는 ChromeHeader를 포함한 PreviewChrome 바깥 박스를 기준으로 `inset-0`.
- **관찰된 문제**:
  - ChromeHeader 높이(`px-3 py-2` + 2.5px dot ≈ ~28~36px)만큼 **모든 hit 영역이 위로 어긋나는 전역 오프셋** 가능성 (좌표 원점 불일치).
  - bounds가 실제 DOM bounding box가 아닌 수동 상수이므로, DateTimeCard/CargoInfoForm 등 내부 레이아웃이 바뀌면 즉시 어긋남. 예: 이슈 [3]대로 pickup/delivery DateTimeCard를 2열 배치로 바꾸면 `form-pickup-datetime`(x=766,y=106,w=344,h=96)과 `form-delivery-datetime`(x=766,y=214,w=344,h=96)은 실제 요소 위치와 완전히 어긋나게 된다.
  - Tablet도 Desktop과 동일 좌표를 사용(`TABLET_HIT_AREAS = DESKTOP_HIT_AREAS`)하므로, 뷰포트별 실제 렌더 크기(scaleFactor 0.40 vs 0.45)만 비율 보정되고 origin/레이아웃 차이는 보정되지 않음.
- **모호한 점**: 원문 "툴팁이 나올때 … 테두리"라는 표현이 `ring-2 ring-purple-500` 하이라이트를 가리키는지, `InteractiveTooltip` 자체의 말풍선 위치도 포함하는지 원문만으론 확정 불가. 툴팁 좌표도 동일 `bounds * scaleFactor` 기반(interactive-tooltip.tsx:58-85)이므로 같은 원인을 공유할 가능성.

---

## [5] AI 패널 "추출 결과 JSON" 뷰어가 항상 렌더 중

- **원본 메모**: "추출 결과 json은 화면에서 없애주고" — 사용자 추가 전달 (2026-04-22)
- **관련 위치**
  - 컴포넌트: [ai-extract-json-viewer.tsx](src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer.tsx) 전체.
  - 라벨 텍스트: [ai-extract-json-viewer.tsx:85](src/components/dashboard-preview/ai-register-main/ai-panel/ai-extract-json-viewer.tsx#L85) — `<span className="font-semibold">추출 결과 JSON</span>`.
  - 호출부: [ai-panel/index.tsx:45](src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx#L45) (import), [ai-panel/index.tsx:201-204](src/components/dashboard-preview/ai-register-main/ai-panel/index.tsx#L201-L204) (`<AiExtractJsonViewer json={aiResult.evidence} defaultOpen={aiResult.jsonViewerOpen} />`).
  - Mock 필드: [mock-data.ts:160](src/lib/mock-data.ts#L160) 타입 `jsonViewerOpen: boolean`, [mock-data.ts:438](src/lib/mock-data.ts#L438) 값 `jsonViewerOpen: false`.
  - Mock tooltip: [mock-data.ts:407](src/lib/mock-data.ts#L407) — `'ai-json-viewer': '원본 추출 결과를 JSON 형태로 확인합니다'`.
  - Preview Step 타입: [preview-steps.ts:54](src/lib/preview-steps.ts#L54), 각 Step 값: [:444](src/lib/preview-steps.ts#L444) · [:475](src/lib/preview-steps.ts#L475) · [:506](src/lib/preview-steps.ts#L506) · [:537](src/lib/preview-steps.ts#L537) 에서 `jsonViewerOpen: false`.
  - Hit Area: [hit-areas.ts:99-102](src/components/dashboard-preview/hit-areas.ts#L99-L102) — `{ id: 'ai-json-viewer', bounds: { x: 16, y: 580, ... }, tooltipKey: 'ai-json-viewer' }`.
  - 테스트: [ai-extract-json-viewer.test.tsx](src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/ai-extract-json-viewer.test.tsx) 전용 스위트, [ai-panel index.test.tsx:223-232](src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/index.test.tsx#L223-L232) · [:451](src/components/dashboard-preview/ai-register-main/ai-panel/__tests__/index.test.tsx#L451), [hit-areas.test.ts:49](src/components/dashboard-preview/__tests__/hit-areas.test.ts#L49), [mock-data.test.ts:65-68](src/__tests__/lib/mock-data.test.ts#L65-L68) · [:183](src/__tests__/lib/mock-data.test.ts#L183).
- **현재 동작**: `AiPanelContainer` 본문 마지막에 `AiExtractJsonViewer`가 항상 렌더되며 기본 접힘 상태. 토글 클릭 시 펼쳐져 `aiResult.evidence`를 pretty-print JSON으로 노출. hit-area 19개 중 하나(`ai-json-viewer`)로 등록되어 인터랙티브 모드에서 툴팁·테두리 대상이기도 함.
- **관찰된 문제**: 제거 참조 지점이 한 곳이 아니다 — 컴포넌트 파일·호출부·hit-area·tooltip·mock 필드·각 Step의 `jsonViewerOpen` 값·다수 테스트에 참조가 분산되어 있어 "어느 선까지 걷어낼지"가 범위 결정 포인트.

---

## [6] EstimateInfoCard "자동 배차" 토글 라벨 문구

- **원본 메모**: "'자동 배차' 파트는 '자동 배차 대기'로 변경해줘" — 사용자 추가 전달 (2026-04-22)
- **관련 위치**
  - 라벨: [estimate-info-card.tsx:226](src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx#L226) — `<span className="text-xs font-medium">자동 배차</span>`.
  - ON/OFF 뱃지: [estimate-info-card.tsx:227-229](src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx#L227-L229) — `{autoDispatch ? 'ON' : 'OFF'}`.
  - 파일 상단 JSDoc: [estimate-info-card.tsx:2](src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx#L2) · [:13](src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx#L13) · [:19-20](src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx#L19-L20) · [:51](src/components/dashboard-preview/ai-register-main/order-form/estimate-info-card.tsx#L51) — "자동 배차 토글" 표기.
  - Tooltip: [mock-data.ts:414](src/lib/mock-data.ts#L414) — `'auto-dispatch': '조건에 맞는 차량에 자동으로 배차합니다'`.
  - Hit Area: [hit-areas.ts:167-172](src/components/dashboard-preview/hit-areas.ts#L167-L172) — `id: 'form-auto-dispatch', tooltipKey: 'auto-dispatch'`.
  - 테스트 문자열: [estimate-info-card.test.tsx:117](src/components/dashboard-preview/ai-register-main/order-form/__tests__/estimate-info-card.test.tsx#L117) · [:154](src/components/dashboard-preview/ai-register-main/order-form/__tests__/estimate-info-card.test.tsx#L154) · [:168](src/components/dashboard-preview/ai-register-main/order-form/__tests__/estimate-info-card.test.tsx#L168) (테스트 설명(describe/it)에 "자동 배차" 포함).
- **현재 동작**: 라벨 "자동 배차"가 `text-xs font-medium` 스타일로 표시되고 우측에 `autoDispatch` 값에 따라 `ON`/`OFF` 뱃지가 `tabular-nums`로 노출. tooltip·hit-area key는 `auto-dispatch` 문자열로 묶여 있음.
- **모호한 점**: 변경 범위가 화면 라벨 1곳에 한정되는지, `ON/OFF` 뱃지·tooltip 문구·JSDoc 주석·테스트 기대 문자열까지 포함인지 원문에 없음.

---

## 확인 필요 (원문만으로 단정 불가한 항목)

- [1] 라이트 모드가 토글 방식인지 전면 교체인지.
- [2-4] 랜덤 시나리오 교체 트리거(마운트/주기/버튼) 및 입력 메시지까지 세트 포함 여부.
- [2-5] 옵션 키별 추가 요금 항목(이름·금액) 매핑 스펙.
- [4] 원문의 "테두리"가 `ring` 하이라이트만인지, `InteractiveTooltip` 말풍선 위치까지인지.
- [5] 제거 범위 — hit-area(`ai-json-viewer`) / tooltip(`ai-json-viewer`) / mock 필드(`jsonViewerOpen`) / Preview Step 각 단계 값 / 관련 테스트까지 포함할지.
- [6] 문구 변경 범위 — `ON`/`OFF` 뱃지 / tooltip 문구(`auto-dispatch`) / JSDoc 주석 / 테스트 기대 문자열까지 포함할지.
