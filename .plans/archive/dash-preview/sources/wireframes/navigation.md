# Navigation & State Flow: Dashboard Preview

> **PRD**: `dash-preview` (Approved 2026-04-14)
> **Last Updated**: 2026-04-14

---

## 1. 전체 네비게이션 플로우

```mermaid
flowchart TD
    subgraph Hero["Hero Section"]
        H1[h1: 운송 운영을 한눈에]
        SUB[p: 오더부터 정산까지]
        CTA1[도입 문의하기 버튼]
        CTA2[데모 보기 버튼]
        DP[DashboardPreview]
    end

    H1 --> SUB --> CTA1 & CTA2 --> DP

    DP -->|Desktop/Tablet| CHROME[PreviewChrome 프레임]
    DP -->|Mobile < 768px| MOBILE[Mobile 카드 뷰]

    CHROME --> CINEMATIC[시네마틱 모드 Phase 1]
    CHROME -->|내부 클릭 Phase 2| INTERACTIVE[인터랙티브 모드]

    MOBILE --> MOBILE_AUTO[2단계 자동 전환]
```

---

## 2. Phase 1 상태 머신: 시네마틱 자동 재생

```mermaid
stateDiagram-v2
    [*] --> INITIAL : 마운트 + delay 0.6s

    INITIAL --> AI_INPUT : 3초 경과
    AI_INPUT --> AI_EXTRACT : 4초 경과
    AI_EXTRACT --> AI_APPLY : 4초 경과
    AI_APPLY --> COMPLETE : 4초 경과
    COMPLETE --> INITIAL : 3초 경과 (루프)

    state "Step 1: INITIAL" as INITIAL {
        note right of INITIAL
            빈 폼 + AiPanel 열림
            textarea 비어있음
            추출하기 disabled
        end note
    }

    state "Step 2: AI_INPUT" as AI_INPUT {
        note right of AI_INPUT
            카톡 메시지 타이핑
            추출하기 활성화
        end note
    }

    state "Step 3: AI_EXTRACT" as AI_EXTRACT {
        note right of AI_EXTRACT
            로딩 스피너
            4개 카테고리 버튼 생성 (파랑)
        end note
    }

    state "Step 4: AI_APPLY" as AI_APPLY {
        note right of AI_APPLY
            버튼 순차 초록 전환
            폼 필드 자동 채움
            금액 카운팅
        end note
    }

    state "Step 5: COMPLETE" as COMPLETE {
        note right of COMPLETE
            모든 버튼 초록
            모든 필드 채워짐
            420,000원 표시
        end note
    }
```

### 타이밍 상세

| Step | ID | Duration | 누적 시간 | 내부 애니메이션 |
|------|-----|---------|----------|----------------|
| 1 | INITIAL | 3s | 0~3s | 없음 (정적) |
| 2 | AI_INPUT | 4s | 3~7s | 타이핑 효과 (글자 단위) |
| 3 | AI_EXTRACT | 4s | 7~11s | 0~1s: 버튼 클릭 효과 + 스피너, 1~4s: 버튼 stagger 등장 |
| 4 | AI_APPLY | 4s | 11~15s | 0.5s 간격 stagger: 상차지->하차지->화물->운임 |
| 5 | COMPLETE | 3s | 15~18s | settled 상태, 미묘한 완료 강조 |
| (루프) | -> INITIAL | - | 18s~ | cross-fade 전환 |

**전체 루프**: 18초 (범위: 16~22초, REQ-DASH-011)

---

## 3. Phase 1 인터랙션 상태: Hover/Click

```mermaid
stateDiagram-v2
    state "자동 재생 중" as PLAYING
    state "일시 정지" as PAUSED

    [*] --> PLAYING : 마운트

    PLAYING --> PAUSED : hover 진입
    PLAYING --> PAUSED : step indicator 클릭
    PAUSED --> PLAYING : hover 해제 후 2초
    PAUSED --> PLAYING : step 클릭 후 5초 비활동

    note right of PAUSED
        Timeout 우선순위:
        step 클릭(5초) > hover 해제(2초)
        
        동시 발생 시:
        step 클릭 + 즉시 mouseout
        = 5초 후 재개 (2초가 아님)
    end note
```

### Timeout 우선순위 규칙 (REQ-DASH-019)

```mermaid
flowchart TD
    A{일시정지 원인?} -->|hover만| B[hover 해제 후 2초 대기]
    A -->|step 클릭만| C[클릭 후 5초 대기]
    A -->|hover + step 클릭 동시| D[5초 대기 우선]

    B --> E[자동 재생 재개]
    C --> E
    D --> E

    style D fill:#f59e0b,color:#000
```

### useAutoPlay 훅 상태 다이어그램

```mermaid
stateDiagram-v2
    state "isPlaying: true" as Playing
    state "isPlaying: false" as Paused

    [*] --> Playing : mount

    Playing --> Paused : pause(source: 'hover')
    Playing --> Paused : pause(source: 'click')

    Paused --> Playing : resume() [hover: 2s delay]
    Paused --> Playing : resume() [click: 5s delay]

    note left of Paused
        pauseSource 저장
        'click' > 'hover'
        timer ID 관리
    end note
```

---

## 4. Phase 2 모드 전환 플로우

```mermaid
stateDiagram-v2
    state "시네마틱 모드" as CINEMATIC
    state "인터랙티브 모드" as INTERACTIVE

    [*] --> CINEMATIC : 기본 모드

    CINEMATIC --> INTERACTIVE : 축소 뷰 내부 클릭
    INTERACTIVE --> CINEMATIC : 10초 비활동

    state INTERACTIVE {
        [*] --> IDLE_INTERACTIVE
        IDLE_INTERACTIVE --> HOVERING : 히트 영역 hover
        HOVERING --> IDLE_INTERACTIVE : hover 해제
        HOVERING --> CLICKING : 히트 영역 클릭
        CLICKING --> IDLE_INTERACTIVE : mock 실행 완료
    }

    note right of CINEMATIC
        자동 재생 활성
        Step Indicator 클릭/hover만
    end note

    note right of INTERACTIVE
        자동 재생 정지
        오버레이 레이어 활성
        커서: pointer
        10초 비활동 타이머
    end note
```

### Phase 2 인터랙션 시퀀스

```mermaid
sequenceDiagram
    participant U as 사용자
    participant O as 오버레이 레이어
    participant A as AiPanel
    participant F as FormPanel

    Note over U,F: 인터랙티브 모드 진입 (축소 뷰 내부 클릭)

    U->>O: hover on AiInputArea
    O->>O: accent border 2px 표시
    O->>U: 툴팁: "카카오톡 메시지를 붙여넣으면..."

    U->>O: click AiInputArea
    O->>A: 카톡 메시지 타이핑 효과 (2초)
    A-->>O: textarea 채워짐

    U->>O: click 추출하기 버튼
    O->>A: 로딩 스피너 (1.5초)
    A-->>O: AI 결과 버튼 4개 생성 (파랑)

    U->>O: click AI결과-상차지
    O->>A: 상차지 버튼 파랑->초록
    O->>F: LocationForm 상차지 값 채움
    A-->>O: 체크 아이콘 표시

    U->>O: click AI결과-하차지
    O->>A: 하차지 버튼 초록 전환
    O->>F: LocationForm 하차지 값 채움

    U->>O: click AI결과-화물/차량
    O->>A: 화물 버튼 초록 전환
    O->>F: CargoInfoForm 값 채움

    U->>O: click AI결과-운임
    O->>A: 운임 버튼 초록 전환
    O->>F: EstimateInfoCard 카운팅 애니메이션

    Note over U,F: 10초 비활동 -> 시네마틱 모드 복귀
```

---

## 5. Mobile 전용 상태 플로우

```mermaid
stateDiagram-v2
    state "Mobile 뷰 (<768px)" as MOBILE

    state MOBILE {
        [*] --> AI_EXTRACT_CARD : 마운트 + delay

        AI_EXTRACT_CARD --> COMPLETE_CARD : 자동 전환
        COMPLETE_CARD --> AI_EXTRACT_CARD : 자동 전환 (루프)
    }

    note right of AI_EXTRACT_CARD
        AI 분석 결과 카드
        상차지/하차지/화물/운임
        "AI가 분석한 결과"
    end note

    note right of COMPLETE_CARD
        완성된 오더 카드
        모든 필드 채워진 상태
        420,000원
        "AI가 완성한 화물등록"
    end note
```

### Mobile 2단계 타이밍

| Step | 카드 | Duration | 설명 |
|------|------|---------|------|
| A | AI_EXTRACT | 4s | AI가 분석한 4개 카테고리 결과 표시 |
| B | COMPLETE | 4s | 완성된 폼 데이터 카드 |
| 전환 | cross-fade | 0.3s | opacity 전환. Desktop(0.4s)보다 짧은 이유: 모바일 카드 뷰는 콘텐츠가 단순하여 빠른 전환이 자연스러움 |

---

## 6. 접근성 상태 분기

```mermaid
flowchart TD
    A[DashboardPreview 마운트] --> B{prefers-reduced-motion?}

    B -->|Yes| C[정적 최종 상태: Step 5 COMPLETE]
    B -->|No| D{뷰포트 크기?}

    D -->|Desktop >= 1024px| E[5단계 시네마틱 + Phase 2]
    D -->|Tablet 768~1023px| F[5단계 시네마틱 + 축약 Phase 2]
    D -->|Mobile < 768px| G[2단계 카드 자동 전환]

    C --> H[StepIndicator 클릭만 허용]

    style C fill:#3b82f6,color:#fff
```

---

## 7. 전체 상태 요약 매트릭스

| 상태 | isPlaying | mode | currentStep | 트리거 |
|------|-----------|------|-------------|--------|
| 자동 재생 중 | true | cinematic | 0~4 순환 | 마운트, timeout 완료 |
| hover 일시정지 | false | cinematic | 현재 유지 | Preview hover |
| step 클릭 일시정지 | false | cinematic | 클릭한 step | StepIndicator 클릭 |
| 인터랙티브 활성 | false | interactive | 현재 유지 | 축소 뷰 내부 클릭 |
| 인터랙티브 hover | false | interactive | 현재 유지 | 히트 영역 hover |
| 인터랙티브 클릭 | false | interactive | 현재 유지 | 히트 영역 클릭 |
| reduced-motion 정적 | false | static | 4 (COMPLETE) | prefers-reduced-motion |
| Mobile 자동 전환 | true | mobile | A/B 순환 | Mobile 뷰 마운트 |

---

## 8. 이벤트-상태 전환 표

| 이벤트 | 현재 상태 | 다음 상태 | 조건 | REQ |
|--------|----------|----------|------|-----|
| timer tick | PLAYING(step N) | PLAYING(step N+1) | duration 경과 | REQ-DASH-010~012 |
| timer tick | PLAYING(step 4) | PLAYING(step 0) | 루프 | REQ-DASH-012 |
| mouseenter | PLAYING | PAUSED(hover) | - | REQ-DASH-017 |
| mouseleave | PAUSED(hover) | PLAYING | 2초 후 | REQ-DASH-018 |
| step click | PLAYING/PAUSED | PAUSED(click, step=N) | - | REQ-DASH-015~016 |
| idle 5s | PAUSED(click) | PLAYING | 비활동 | REQ-DASH-016 |
| click + mouseout | PAUSED(click) | PLAYING | 5초 후 (우선) | REQ-DASH-019 |
| inner click | CINEMATIC | INTERACTIVE | Desktop/Tablet만 | REQ-DASH-034 |
| idle 10s | INTERACTIVE | CINEMATIC | 비활동 | REQ-DASH-035 |
| hit hover | INTERACTIVE | INTERACTIVE(hover) | - | REQ-DASH-036~038 |
| hit click | INTERACTIVE | INTERACTIVE(action) | mock 실행 | REQ-DASH-039~041 |
