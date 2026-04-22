# Decision Log: dash-preview Phase 3 Wireframe

> **Slug**: `dash-preview-phase3`
> **PRD**: [`01-prd-freeze.md`](../../00-context/01-prd-freeze.md)
> **Last Updated**: 2026-04-17
> **Authored by**: plan-wireframe-designer

---

## 0. 이 문서 구성

Phase 3 와이어프레임 단계에서 내린 **설계 결정**을 시간순으로 기록한다. 각 결정은 근거·대안 기각 사유·후속 반영 위치를 포함한다.

---

## 1. 2026-04-17 — AI_APPLY 2단 구조: 안 B (내부 타임라인 분할) 확정

> **상세**: [`components.md` §1-1](./components.md#1-1-ai_apply-2단-구조-확정-안-b-내부-타임라인-분할) 참조.

### 요약

AI_APPLY 단계의 "파트별 → 전체" 2단 시연 요구(G4, REQ-DASH3-040)를 충족하기 위해 **안 B (Step 분할 없이 AI_APPLY 내부 타임라인 2-beat)** 를 확정했다. Step 개수는 4로 유지(INITIAL/AI_INPUT/AI_EXTRACT/AI_APPLY), partial→all 경계는 오버랩 없이 자연 연결.

### 대안 기각 근거

- **안 A (Step 분할 5단계)**: Phase 1 스펙 §1-1 "4단계 한정" 원칙 위배. StepIndicator 5-dot 복귀로 REQ-DASH-014 모순.
- **안 C (모드별 분기 토글)**: PRD G2 "단일 흐름" 원칙 위배. UX 혼란 야기.

### 반영 위치

- `screens.md` §2-5 (STATE-004a partial), §2-6 (STATE-004b all)
- `navigation.md` §2-4 Mermaid flowchart + 하단 대각 흐름 표
- `components.md` §3, §4 interactions 주입 지점 + §4-3 타이밍 트랙 스케치

---

## 2. 2026-04-17 — UI 시각 힌트 위치 확정

> **상세**: [`components.md` §1-2](./components.md#1-2-ui-시각-힌트-확정-req-dash3-044) 참조.

### 요약

REQ-DASH3-044에서 위임된 "골라 받을 수도, 한 번에 받을 수도 있다" UI 힌트의 위치·형태를 다음과 같이 확정.

- **위치**: Preview 프레임 외곽 직하 (StepIndicator 아래, chrome 내부)
- **형태**: inline caption — 💡 아이콘 + `text-xs text-muted-foreground` (Tablet text-[10px])
- **노출 조건**: AI_APPLY 단계 partial beat 시작 ~ HOLD 종료에만 `opacity 0→1 (200ms fade-in)`
- **접근성**: `aria-live="polite"` — 스크린리더 1회 읽기
- **Mobile**: 미표시 (CardView 타이틀로 대체)

### 대안 기각 근거

- chrome header 우측 뱃지 → Phase 2 `[인터랙티브 모드]` 뱃지와 공간 충돌
- AiPanel 상단 툴팁 → StepIndicator와 시선 경합
- 캡션 상시 표시 → "스크린샷 나열" 인상 유발 (G2 위배)

### 반영 위치

- `screens.md` §2-1 (공통 외곽 구조 도식), §2-5 (STATE-004a partial에 fade-in 시점)

---

## 3. 2026-04-17 — OrderForm 3-column 재현 + Tablet C안 (0.40 + 3-column 유지) 확정

### 요약

**사용자 피드백 "OrderForm의 각 컴포넌트 배치가 원본 데스크탑 화면의 배치대로 보여졌으면 함"**을 수용하여, 원본 `register-form.tsx:939`의 `grid grid-cols-1 lg:grid-cols-3 gap-4` 구조를 Phase 3에서 **1:1 재현**하기로 확정했다. 이에 따라 기존 wireframe의 "OrderForm 9섹션 세로 나열" 구조를 **3-column grid 배치**로 전면 재작성한다. 동시에 Tablet(768~1023px)은 원본과의 의도적 divergence를 감수하고 **scale 0.40 + 3-column 유지 (C안)**를 채택한다.

### 근거

- **3-column 재현**: Phase 3의 목표 G1(픽셀 정확도 95%+)과 G2(Cursor.com 수준 체감)는 원본 구조를 충실히 재현할 때만 달성 가능. 9섹션 세로 나열은 원본과 시각 구조가 근본적으로 다르므로 "축약"이 아닌 "축소된 원본"이 되어야 함.
- **Tablet C안 근거**: 원본은 `lg:grid-cols-3` breakpoint가 1024px이므로 Tablet에서 1-col reflow되나, 랜딩 demo는 "원본을 대표하는 화면"이므로 Tablet에서도 **데스크탑 구조의 압축 버전**을 보여주는 것이 마케팅 가치가 높다. scale을 0.32 → **0.40**으로 상향 조정하여 3-column 가독성을 절충한다.
- **조작감 #10 재정의 근거**: 3-column 축소 렌더(scale 0.45)에서는 `scrollIntoView`가 실질 효과가 없음. 따라서 기존 "Section Scroll Snap + Border Pulse"를 **Column-wise Border Pulse** (outline 2px + box-shadow glow 400ms)로 재정의한다. 이는 Column 단위 시선 유도에 더 효과적이며, 파트별/전체 beat의 Column 이동 경로(Col 1→2→3→1→3)를 시각적으로 강조한다.

### 구조 규약

**Column별 포함 섹션 (원본 라인 대응):**

| Column | 포함 섹션 | 원본 라인 |
|--------|-----------|-----------|
| **Col 1** | CompanyManagerSection → LocationForm(상차) → LocationForm(하차) | 942~1140 |
| **Col 2** | 예상거리 Info → DateTimeCard 2-col(md:grid-cols-2) → CargoInfoForm | 1143~1278 |
| **Col 3** | TransportOptionCard → EstimateInfoCard → SettlementSection | 1281~ |

**AI_APPLY Column 이동 경로 (대각 흐름):**

- Partial beat: Col 1(상차) → Col 1(하차)+Col 2(DT) → Col 2(Cargo) → Col 3(Estimate 일부)
- All beat: Col 1(Company 되감기) → Col 3(Options→자동배차→Settlement)
- 시선 이동: 읽기 방향(좌→우) + 최종 합계로 수렴 (Col 3 하단)

### 대안 기각 근거

| 대안 | 기각 사유 |
|------|----------|
| **기존 9섹션 세로 나열 유지** | 원본과 시각 구조 불일치. G1/G2 목표 미달성. 사용자 피드백 직접 위배. |
| **Tablet에서 원본 동일 1-col reflow** | 랜딩 demo의 "데스크탑 대표 화면" 성격 상실. Tablet 방문자가 데스크탑 구조를 보지 못함. |
| **Tablet scale 유지 0.32 + 3-col** | 가독성 심각 저하 (Col당 너비 ~80 CSS px). Milestone 5 A/B 검증 기준 하한 근접. |
| **#10 scrollIntoView 유지** | scale 0.45 축소 렌더에서 실질 효과 0. 구현 비용은 있으나 체감 가치 없음. |

### 반영 위치

- `screens.md` §1 뷰포트 매트릭스 (3-col 구조 명시) + §1 하단 신규 "OrderForm 3-column 배치 규약" 표
- `screens.md` §2-1 공통 외곽 구조 (3-col ASCII 재작성)
- `screens.md` §2-2 ~ §2-6 모든 Step(INITIAL/AI_INPUT/AI_EXTRACT/AI_APPLY partial/all) ASCII 전면 재작성
- `screens.md` §3 Tablet (scale 0.40 + 3-col 유지 C안 명시, 기존 0.32 → 상향 근거 주석)
- `screens.md` §5-1 히트 영역 오버레이 도식 재작성 + §5-2 매핑 표에 **Col 좌표 열** 추가 (20개 재매핑)
- `screens.md` §6 반응형 비교 표 + 원본과의 divergence 행 추가
- `components.md` §4-0 **신규**: 3-column grid 배치 도식 + Column별 포함 섹션 표 + 대각 흐름 타임라인
- `components.md` §4-2 order-form/index.tsx 조작감 명세 `columnPulseTargets`로 재정의
- `components.md` §5-2 #10 Column-wise Border Pulse 재정의 (scrollIntoView 제거 근거 명시)
- `components.md` §6-1 `InteractionsTrack` 타입에 `columnPulseTargets` 필드 추가
- `components.md` §4-3 타이밍 트랙 스케치에 partial/all 비트별 columnPulseTargets 주입 샘플
- `components.md` §8 PCC-04 self-check 20→**24**로 확장 (3-column 항목 4건 신규 통과)
- `navigation.md` §2-4 Mermaid flowchart 각 beat 노드에 `<b>Col N row M</b>` 표기 추가 + 하단 대각 흐름 표 신규
- `navigation.md` §3-1 Gantt 타임라인 각 AI_APPLY 라벨에 `[Col N row M]` 주석 추가 + Column 이동 타임라인 ASCII 보조 도식 신규
- `navigation.md` §3-2 #10 Column-wise Border Pulse로 재정의
- `navigation.md` §3-3 동시 실행 규칙 업데이트 (동일 섹션 #6+#10 허용, Column 간 2 Column 동시 pulse 허용)

### 수용 기준 (Dev 단계에서 검증)

- [ ] `order-form/index.tsx` 루트 엘리먼트에 `grid grid-cols-1 lg:grid-cols-3 gap-4` 클래스 존재
- [ ] 자식 `<div>` 3개가 각각 `lg:col-span-1 space-y-4` 클래스로 Col 1/2/3 구성
- [ ] Col 1: CompanyManagerSection, LocationForm(pickup), LocationForm(delivery) 순서 배치
- [ ] Col 2: 예상거리 Info, DateTimeCard(md:grid-cols-2 2-col), CargoInfoForm 순서 배치
- [ ] Col 3: TransportOptionCard, EstimateInfoCard, SettlementSection 순서 배치
- [ ] Tablet(<1024px) 뷰포트에서 3-column 유지 (CSS reflow 차단 확인)
- [ ] Desktop scale 0.45 / Tablet scale 0.40 / Mobile MobileCardView fallback
- [ ] #10 Column-wise Border Pulse: AI_APPLY 파트별/전체 beat에 정의된 Column 순서대로 400ms glow 발생
- [ ] scrollIntoView 호출 0건 (#10 구현에서 제거)

### 후속 영향

- **PRD PCC 재확인**: REQ-DASH-003/007/023/024 + REQ-DASH3-029는 이미 PRD에 반영 완료 (사용자 메시지 기준). 본 decision-log가 wireframe 단계의 최종 근거 문서.
- **R5 리스크 영향**: Tablet scale 0.40 + 3-col 유지는 Milestone 5 A/B 검증 대상. 실패 시 폴백 옵션은 ① Tablet scale 0.45 상향 또는 ② 원본 동일 1-col reflow.
- **Dev 단계 TDD 순서**: `order-form/index.tsx` 루트 grid 컨테이너 테스트 → Column별 자식 배치 테스트 → columnPulseTargets 적용 테스트.

---

## 4. 2026-04-17 — 가상 화주 "옵틱물류" + 담당자 이매니저 pre-filled 확정 (SSOT)

> **본 섹션은 전체 기획 자료의 mock 값 SSOT (Single Source of Truth)**. PRD/screens.md/navigation.md는 간략 언급만 하고 본 섹션을 참조한다. 세부 컴포넌트 props·상태는 `components.md` §4-2 CompanyManagerSection 명세에 주입 형태로 중복 기술.

### 4-1. 요약

사용자 피드백 **"OrderForm에 컴퍼니는 옵틱물류라는 가상 화주로 설정해서 셋팅되게 하죠. 이 부분 전체 기획 자료에 반영해주세요"** (2026-04-17)를 수용하여, `CompanyManagerSection`은 **INITIAL 시점부터 가상 화주 "옵틱물류" + 담당자 이매니저로 pre-filled 상태**로 렌더링한다. 본 결정은 단순 mock 값 설정을 넘어 **시연 플로우 해석**에 다음 3가지 파급을 가진다.

1. **INITIAL부터 CompanyManagerSection pre-filled**: 로그인 + 회사 선택 완료 상태를 시뮬레이션. 원본 ai-register는 broker가 로그인 → 회사 선택 → 주문 등록 flow인데, 랜딩 데모는 앞의 "사전 세팅"을 생략하고 주문 등록 flow에만 집중한다.
2. **AI_APPLY 단계에서 CompanyManagerSection은 변화 없음**: AI가 회사/담당자를 변경하지 않음. 파트별 beat는 기존대로 상차지→하차지→화물→운임 (CompanyManager 불포함). #6 fill-in caret 및 #10 Column-wise Border Pulse 대상에서 CompanyManagerSection 제외.
3. **AI_APPLY 전체 beat 내용 재조정**: 기존 "남은 필드(담당자 연락처, 옵션 토글, 정산 항목)"에서 담당자 연락처 제거. **옵션 토글(TransportOptionCard 8개) / 자동 배차 토글(EstimateInfoCard) / 정산 추가 요금(SettlementSection)** 중심으로 재작성.

### 4-2. 결정 사유

| 사유 | 근거 |
|------|------|
| **데모 집중도 향상** | 회사·담당자는 실제 OPTIC에서 "로그인 직후 1회 선택" 성격이므로 매 주문 등록마다 반복 노출되면 **핵심 가치(AI 화물 등록)에 시선이 분산**. pre-filled 처리로 "앞 단계는 완료된 상태"임을 암묵 표현하고, AI 적용이 실제 새로 채우는 필드(상차/하차/화물/운임/옵션/정산)에만 집중 가능. |
| **로그인 시뮬레이션 생략** | 랜딩 데모는 3초 내에 방문자가 가치 제안을 인지해야 하는 환경. 로그인 → 회사 선택 flow를 렌더링하면 총 루프 6~8초 안에 담을 수 없음. pre-filled로 "보이지 않는 사전 설정"을 시뮬레이션. |
| **메시지 일관성** | "골라 받을 수도, 한 번에 받을 수도 있다" UI 힌트는 **AI 추출 결과의 선택적 적용**을 강조. 회사·담당자는 AI 추출 대상이 아니므로 이 메시지 맥락과 무관해야 함. pre-filled 처리로 meta 시각 분리 달성. |
| **회귀 방지** | 기존 PRD §5-4 REQ-DASH3-022 "Location/Cargo/DateTime/CompanyManager 모든 필드"에서 CompanyManager 부분만 제외하면 #6 유틸 자체는 다른 섹션에서 동일 로직 재사용 가능. 구현 복잡도 증가 없음. |

### 4-3. Mock 값 전체 표 (SSOT)

아래 값이 **전체 기획 자료에서 유일한 진실**이다. 다른 파일은 이 표를 참조해야 하며, **본 문서 이외의 수정 금지**.

#### 회사 (shipper, 화주)

| 필드 | 값 | 비고 |
|------|----|----|
| 회사명 | **옵틱물류** | 가상 회사명. 실존 기업과 무관. |
| 사업자등록번호 | `***-**-*****` | 가상 번호 (유효성 검증 통과 불필요) |
| 대표 | 김옵틱 | 가상 |

#### 담당자 (manager)

| 필드 | 값 | 비고 |
|------|----|----|
| 이름 | **이매니저** | |
| 연락처 | `010-****-****` | |
| 이메일 | `example@optics.com` | `optics.com`은 가상 도메인 |
| 부서 | 물류운영팀 | |

### 4-4. AI_APPLY 영향 범위 (제외 결정)

| 조작감 레이어 | 원래 CompanyManager 적용 여부 | Phase 3 최종 | 근거 |
|--------------|------------------------------|-------------|------|
| **#6 fill-in caret** (REQ-DASH3-022) | 적용 예정이었음 | **미적용** | CompanyManager는 INITIAL부터 pre-filled. caret blink는 "AI가 지금 채우고 있다" 시각 메시지인데, 이미 채워진 값에는 부적합. |
| **#10 Column-wise Border Pulse** (REQ-DASH3-029) | AI_APPLY 전체 beat T=0에서 Col 1 pulse 대상 | **미적용 (Col 1 전체 beat T=0 pulse 삭제)** | Col 1은 pre-filled Company + 파트별 beat에서 완료된 Location 상/하차만 포함. AI_APPLY 전체 beat 시점에서 Col 1에 새 변화가 없음 → pulse 대상 없음. 전체 beat의 pulse 시작점은 **T=150 Col 3 TransportOption**으로 이동. |
| **#3 button-press / #4 ripple** (AiPanel) | 해당 없음 | 변화 없음 | AiButtonItem의 카테고리는 상차/하차/화물/운임 4종으로 고정. 회사 카테고리 버튼 없음. |
| **히트 영역 #11 `company-manager`** (REQ-DASH3-037) | Should (전체 beat T=0 대상) | **비활성 (pre-filled, 참고 hover만)** | 인터랙티브 모드에서 클릭 시 mock 동작 없음. hover 툴팁 "로그인 시 선택된 회사/담당자 정보"만 표시. |

**AI_APPLY 전체 beat 구성 재정리 (REQ-DASH3-043):**

| 기존 (담당자 연락처 포함) | 수정 (pre-filled 반영) |
|-------------------------|------------------------|
| 1) Company + 담당자 연락처 fill-in (T=0~) | **(제거 — pre-filled)** |
| 2) TransportOption 3옵션 stroke (T=150) | TransportOption **8옵션 전체** stroke (T=0, stagger 60ms) ← 기존 "3옵션 동시"에서 확장 |
| 3) EstimateInfoCard 자동배차 stroke (T=250) | EstimateInfoCard 자동배차 stroke (T=150) ← 100ms 앞당김 |
| 4) Settlement 청구/지급 rolling (T=300) | Settlement 청구/지급 rolling (T=200) ← 100ms 앞당김 |
| 5) Settlement 합계 rolling (T=500) | Settlement **추가 요금 +30k** + 합계 rolling (T=400) ← 추가 요금 신규 편입 |

**전체 beat 총 지속시간**: 기존 0.5~0.8s → **유지** (구성 변화만 있음, 숫자는 Spike 단계 재측정).

### 4-5. 반영 위치 (파일별)

| 파일 | 섹션 | 수정 내용 |
|------|------|-----------|
| `01-prd-freeze.md` | §5-3 | REQ-DASH3-014 신설 — "CompanyManagerSection pre-filled 가상 화주" |
| `01-prd-freeze.md` | §5-4 REQ-DASH3-022 | 적용 대상에서 CompanyManagerSection 제외 명시 |
| `01-prd-freeze.md` | §6-1 | 시연 플로우 INITIAL 설명에 "CompanyManagerSection pre-filled (옵틱물류)" 반영 |
| `01-prd-freeze.md` | §6-2 | AI_APPLY 전체 beat 담당자 연락처 제거, 옵션/자동배차/정산 중심 재작성 |
| `01-prd-freeze.md` | §6-6 | 화면 흐름 CompanyManagerSection 옆 주석 "← INITIAL pre-filled, AI_APPLY 영향 없음" 추가 |
| `screens.md` | §2-2 ~ §2-6 | 모든 Step ASCII에서 CompanyManagerSection을 pre-filled 상태로 표시 (회사: **옵틱물류** / 담당자: 이매니저 · 010-****-**** / 부서: 물류운영팀) |
| `screens.md` | §2-6 AI_APPLY 전체 beat | "CompanyManager는 pre-filled이므로 fill-in 대상 아님" 명시 + 전체 beat 옵션/정산 중심 재작성 |
| `screens.md` | §5-2 히트 영역 표 | #11 `company-manager` 우선순위 "Should → **비활성 (pre-filled, 참고 hover만)**" |
| `components.md` | §4-2 | CompanyManagerSection 명세에 mock 고정값 표 + `aiApplied: false` 고정 + 조작감 주입 지점 "**없음 (pre-filled, AI_APPLY 영향 없음)**" 명시 |
| `components.md` | §4-3 | 타이밍 트랙 스케치에서 CompanyManager 관련 `columnPulseTargets` / `fillInFields` 제거 |
| `components.md` | §8 PCC-04 | 신규 항목 04-25/26/27 추가 (pre-filled 확인, 전체 beat 재조정 확인, 조작감 제외 확인) |
| `navigation.md` | §2-4 AI_APPLY 2단 Mermaid | 전체 beat 노드에서 "담당자 연락처" 제거, ALL1 노드 "TransportOption 8옵션 stroke"로 변경 |
| `navigation.md` | §3-1 Gantt | 전체 beat 구간 영향 섹션 재작성 (Transport/Estimate 자동배차/Settlement 중심) |

### 4-6. 수용 기준 (Dev 단계에서 검증)

- [ ] `mock-data.ts`의 `formData.companyManager` 초기값이 **본 §4-3 표의 값과 정확히 일치**
- [ ] `preview-steps.ts`의 STATE-001(INITIAL) 스냅샷에서 `formState.companyManagerFilled = true` 고정
- [ ] STATE-002/003/004a/004b **전 Step**에서 CompanyManagerSection 렌더 시 pre-filled 값 유지
- [ ] STATE-004b(all beat) `interactions.fillInFields`에 `company-name` / `manager-name` / `manager-contact` 관련 entry **0건**
- [ ] STATE-004b `interactions.columnPulseTargets`에 `sectionId: 'company-manager'` entry **0건**
- [ ] STATE-004b(all beat) `interactions.strokeBeats`가 **TransportOption 8옵션 + Estimate 자동배차** 대상 (최소 9건)
- [ ] 히트 영역 `#11 company-manager`는 인터랙티브 모드 클릭 시 mock 동작 없음, hover 툴팁만 동작
- [ ] AI_APPLY 전체 beat 총 지속 ≤ 0.8s 유지 (구성 변경이 타이밍 예산에 영향 없음)

### 4-7. 대안 기각 근거

| 대안 | 기각 사유 |
|------|----------|
| **CompanyManager도 AI_APPLY 전체 beat에서 fill-in 수행** | AI가 회사/담당자를 변경한다는 잘못된 메시지 전달. 원본 ai-register에서 회사는 "로그인 시 선택"이지 "메시지에서 추출"이 아님. |
| **CompanyManager 영역 자체를 숨김** | 3-column grid 구조(Col 1 row 1) 원본 재현 목표(G1 픽셀 정확도 95%)와 충돌. 원본에 있는 섹션을 숨기는 것은 "축약"이지 "복제"가 아님. |
| **회사만 pre-filled, 담당자는 AI_APPLY에서 채움** | 회사와 담당자는 원본 `CompanyManagerSection` 내부에서 **묶인 단위**. 일부만 pre-filled 처리 시 UI 모순 (섹션 내 필드 일부는 값 있고 일부는 빈 값). |
| **실명 사용 (OPTIC, LogiShm 등)** | 랜딩은 공개 자산. 특정 기업명 사용 시 해당 기업과의 계약/승인 필요. **가상 회사 "옵틱물류"** 사용으로 회피. "옵틱"은 OPTIC 제품명 연상을 주되 가상성을 유지. |

---

## 변경 이력

| 날짜 | 항목 | 작성자 |
|------|------|--------|
| 2026-04-17 | 초안 — AI_APPLY 안 B, UI 힌트 위치, OrderForm 3-column 재현 + Tablet C안 확정 | plan-wireframe-designer |
| 2026-04-17 | §4 신규 — **가상 화주 "옵틱물류" + 담당자 이매니저 pre-filled 확정** (SSOT). CompanyManagerSection AI_APPLY 제외 결정, 전체 beat 구성 재조정 (담당자 연락처 제거, 옵션/자동배차/정산 중심), 반영 위치 13건 열거, 수용 기준 8건, 대안 기각 4건 | plan-wireframe-designer |
| 2026-04-17 | §4-3 mock 값 조정 — 담당자 성씨 변경(**박매니저 → 이매니저**), 이메일 도메인 변경(`park@opticlogis.com` → `example@optics.com`). 5개 파일 전체 동기화 반영 | manual |
| 2026-04-17 | §4-3 연락처 마스킹 표기 — 담당자(`010-9876-5432` → `010-****-****`), pickup/delivery 담당자 mock 연락처도 동일 마스킹. 개인정보 보호 + 랜딩 demo 실전화번호 노출 회피 | manual |
| 2026-04-17 | §4-3 사업자등록번호 마스킹 표기 — `123-45-67890` → `***-**-*****` (전체 마스킹, 자릿수 보존). 연락처와 동일한 개인정보 노출 회피 기조 | manual |
| 2026-04-17 | Spike 범위 **수직 슬라이스** 확정 (PRD §8-0) — AiPanel 2 + OrderForm Col 3 1 + Company 정적 pre-filled + 4-Step 골격 + MVP #1/#3/#8. 1일 원칙 유지. 2차 확인 #6 예비 실측, #7/#8은 M4/M5로 이관 | manual |
