# OPTIC 랜딩 페이지 — 컴포넌트 명세

> 각 섹션의 UI 컴포넌트 타입, 상태, 동작, 반응형 변형 정의

---

## 공통 컴포넌트

### SectionWrapper


| 속성      | 값                                            |
| ------- | -------------------------------------------- |
| 타입      | Container                                    |
| 역할      | 모든 섹션의 공통 래퍼 (max-width, padding, id anchor) |
| Desktop | max-width: 1280px, padding: 0 80px           |
| Tablet  | padding: 0 40px                              |
| Mobile  | padding: 0 20px                              |


### SectionTitle


| 속성      | 값                                                     |
| ------- | ----------------------------------------------------- |
| 타입      | Typography (h2)                                       |
| Desktop | font-size: 40px, font-weight: 700, text-align: center |
| Mobile  | font-size: 28px                                       |
| 애니메이션   | scroll-triggered fade-in-up                           |


### SectionSubtitle


| 속성      | 값                                                    |
| ------- | ---------------------------------------------------- |
| 타입      | Typography (p)                                       |
| Desktop | font-size: 18px, color: gray-400, text-align: center |
| Mobile  | font-size: 16px                                      |


---

## SCR-001: Header 컴포넌트


| 컴포넌트               | 타입        | 상태                       | 동작                            | 반응형             |
| ------------------ | --------- | ------------------------ | ----------------------------- | --------------- |
| Logo               | Image/SVG | default                  | 클릭 → scroll to top            | 모든 뷰포트          |
| NavLink            | Anchor    | default / hover / active | 클릭 → smooth scroll to section | Desktop/Tablet만 |
| CTAButton (Header) | Button    | default / hover          | 클릭 → scroll to #contact       | Desktop/Tablet만 |
| HamburgerIcon      | Button    | closed / open            | 클릭 → mobile menu toggle       | Mobile만         |
| MobileMenu         | Overlay   | hidden / visible         | slide-down 메뉴, NavLink 목록     | Mobile만         |


### NavLink 상태


| 상태                   | 스타일                            |
| -------------------- | ------------------------------ |
| default              | color: gray-300, no underline  |
| hover                | color: white, subtle underline |
| active (in viewport) | color: white, underline accent |


---

## SCR-002: Hero 컴포넌트


| 컴포넌트         | 타입              | 상태                       | 동작                       | 반응형                                  |
| ------------ | --------------- | ------------------------ | ------------------------ | ------------------------------------ |
| HeroTitle    | Typography (h1) | default                  | 페이지 로드 시 fade-in         | Desktop: 48-64px / Mobile: 32px      |
| HeroSubtitle | Typography (p)  | default                  | 페이지 로드 시 fade-in (delay) | Desktop: 20-24px / Mobile: 16px      |
| PrimaryCTA   | Button          | default / hover / active | 클릭 → scroll to #contact  | Desktop: inline / Mobile: full-width |
| SecondaryCTA | Button          | default / hover / active | 클릭 → 외부 데모 링크 (새 탭)      | Desktop: inline / Mobile: full-width |
| HeroVisual   | Image/Animation | loading / loaded         | 페이지 로드 시 fade-in (delay) | Desktop: 넓은 폭 / Mobile: 축소           |
| GradientGlow | Decorative      | default                  | 배경 그라데이션 효과              | 모든 뷰포트                               |


### Button 변형


| 변형              | 스타일                                                                         |
| --------------- | --------------------------------------------------------------------------- |
| Primary (도입 문의) | bg: accent gradient, color: white, px: 32, py: 16, rounded-lg               |
| Secondary (데모)  | bg: transparent, border: 1px gray-600, color: gray-200, hover: border-white |


---

## SCR-003: Problems 컴포넌트


| 컴포넌트        | 타입         | 상태      | 동작                                   | 반응형                              |
| ----------- | ---------- | ------- | ------------------------------------ | -------------------------------- |
| ProblemCard | Card       | default | scroll-triggered fade-in (staggered) | Desktop: 2열 / Mobile: 1열 stacked |
| BeforeLabel | Badge      | default | 정적                                   | ❌ 빨간 악센트                         |
| AfterLabel  | Badge      | default | 정적                                   | ✅ 녹색 악센트                         |
| BeforeText  | Typography | default | 정적                                   | 취소선 또는 흐린 색상                     |
| AfterText   | Typography | default | 정적                                   | 밝은 색상, 강조                        |


---

## SCR-004: Features 컴포넌트


| 컴포넌트               | 타입              | 상태              | 동작                                                  | 반응형                                   |
| ------------------ | --------------- | --------------- | --------------------------------------------------- | ------------------------------------- |
| FeatureCard        | Card            | default / hover | hover: subtle lift + glow, scroll-triggered fade-in | Desktop: 3열 / Tablet: 2열 / Mobile: 1열 |
| FeatureIcon        | Icon/SVG        | default         | 정적                                                  | 40x40px                               |
| FeatureTitle       | Typography (h3) | default         | 정적                                                  | font-size: 20px, font-weight: 600     |
| FeatureDescription | Typography (p)  | default         | 정적                                                  | font-size: 14px, color: gray-400      |


### FeatureCard 상태


| 상태      | 스타일                                                                    |
| ------- | ---------------------------------------------------------------------- |
| default | bg: gray-900/50, border: 1px gray-800, rounded-xl, p: 24               |
| hover   | transform: translateY(-4px), border-color: accent/30, box-shadow: glow |


---

## SCR-005: Products 컴포넌트


| 컴포넌트               | 타입              | 상태               | 동작                | 반응형                           |
| ------------------ | --------------- | ---------------- | ----------------- | ----------------------------- |
| ProductTab         | Tab             | default / active | 클릭 → 제품 콘텐츠 전환    | Desktop: 가로 탭바 / Mobile: 스와이프 |
| ProductContent     | Panel           | hidden / visible | 탭 전환 시 fade 애니메이션 | 모든 뷰포트                        |
| ProductTitle       | Typography (h3) | default          | 정적                | font-size: 28px               |
| ProductDescription | Typography (p)  | default          | 정적                | font-size: 16px               |
| ProductFeatureList | List            | default          | 정적                | ✓ prefix, 각 항목                |
| ProductVisual      | Image           | loading / loaded | 탭 전환 시 fade-in    | Desktop: 우측 배치 / Mobile: 하단   |


### ProductTab 상태


| 상태      | 스타일                                     |
| ------- | --------------------------------------- |
| default | color: gray-400, border-bottom: none    |
| hover   | color: gray-200                         |
| active  | color: white, border-bottom: 2px accent |


### 제품 데이터


| Tab Key    | 라벨               | 설명                  | 기능 목록                       |
| ---------- | ---------------- | ------------------- | --------------------------- |
| broker     | OPTIC Broker     | 주선사를 위한 통합 운영 솔루션   | 오더 생성, 배차/진행, 정산, 거래처/차주 관리 |
| shipper    | OPTIC Shipper    | 화주를 위한 운송 요청 솔루션    | 오더 생성/조회, 상하차지/거래처 관리       |
| carrier    | OPTIC Carrier    | 운송사/차주를 위한 배차 솔루션   | 배차 수락, 운송 수행, 상하차지 확인       |
| operations | OPTIC Operations | 운영/관제팀을 위한 모니터링 솔루션 | 전체 현황 모니터링, 데이터 유지보수        |
| billing    | OPTIC Billing    | 회계/정산 담당을 위한 정산 솔루션 | 매출/매입 정산, 대사, 세금계산서         |


---

## SCR-006: Integrations 컴포넌트


| 컴포넌트            | 타입              | 상태              | 동작                                    | 반응형                                   |
| --------------- | --------------- | --------------- | ------------------------------------- | ------------------------------------- |
| IntegrationCard | Card            | default / hover | hover: glow, scroll-triggered fade-in | Desktop: 4열 / Tablet: 2열 / Mobile: 1열 |
| IntegrationLogo | Image           | default         | 정적                                    | 48x48px 또는 64x64px                    |
| IntegrationName | Typography (h4) | default         | 정적                                    | font-size: 18px, font-weight: 600     |
| IntegrationDesc | Typography (p)  | default         | 정적                                    | font-size: 14px, color: gray-400      |


### 연동 데이터


| Key     | 로고               | 이름               | 설명           |
| ------- | ---------------- | ---------------- | ------------ |
| gemini  | Google Gemini 로고 | Google Gemini AI | 주문서 자동 추출    |
| kakao   | 카카오 맵 로고         | 카카오 맵            | 주소 검색, 경로 계산 |
| popbill | 팝빌 로고            | 팝빌               | 세금계산서 발행     |
| logishm | 로지스엠 로고          | 로지스엠/화물맨         | 물류 플랫폼 연동    |


---

## SCR-007: CTA 컴포넌트


| 컴포넌트             | 타입              | 상태                       | 동작                       | 반응형                                |
| ---------------- | --------------- | ------------------------ | ------------------------ | ---------------------------------- |
| CTATitle         | Typography (h2) | default                  | scroll-triggered fade-in | Desktop: 36px / Mobile: 28px       |
| CTASubtitle      | Typography (p)  | default                  | fade-in (delay)          | Desktop: 18px / Mobile: 16px       |
| CTAButton (Main) | Button          | default / hover / active | 클릭 → mailto 또는 외부 폼      | Desktop: auto / Mobile: full-width |
| GradientBg       | Decorative      | default                  | 정적 그라데이션 배경              | 모든 뷰포트                             |


---

## SCR-008: Footer 컴포넌트


| 컴포넌트              | 타입                | 상태              | 동작               | 반응형                                                |
| ----------------- | ----------------- | --------------- | ---------------- | -------------------------------------------------- |
| FooterLogo        | Image/SVG         | default         | 정적               | 모든 뷰포트                                             |
| FooterColumnTitle | Typography (h4)   | default         | 정적               | font-size: 14px, font-weight: 600, color: gray-200 |
| FooterLink        | Anchor            | default / hover | 클릭 → 외부 링크 (새 탭) | Desktop: 열 배치 / Mobile: inline                     |
| PoweredBy         | Typography (span) | default         | 정적               | "Powered by OPTICS", font-size: 12px               |
| Copyright         | Typography (span) | default         | 정적               | font-size: 12px, color: gray-500                   |
| Divider           | Decorative (hr)   | default         | 정적               | border: 1px gray-800                               |


### Footer 링크 데이터


| 그룹    | 링크들                                           |
| ----- | --------------------------------------------- |
| 제품    | Broker, Shipper, Carrier, Operations, Billing |
| 회사    | 회사 소개, 채용                                     |
| 법적 고지 | 이용약관, 개인정보처리방침                                |


---

## 애니메이션 명세


| 효과             | 적용 위치                        | 트리거                  | 상세                                                  |
| -------------- | ---------------------------- | -------------------- | --------------------------------------------------- |
| fade-in-up     | SectionTitle, 카드             | scroll into viewport | translateY(20px) → 0, opacity 0 → 1, duration: 0.6s |
| staggered-fade | ProblemCard, FeatureCard     | scroll into viewport | 각 카드 0.1s delay 추가                                  |
| tab-transition | ProductContent               | 탭 클릭                 | opacity 0 → 1, duration: 0.3s                       |
| header-blur    | Header bg                    | scrollY >= 100px     | background opacity 0 → 0.8, backdrop-blur 0 → 12px  |
| hover-lift     | FeatureCard                  | mouse enter/leave    | translateY(0) → -4px, duration: 0.2s                |
| glow           | FeatureCard, IntegrationCard | mouse enter/leave    | box-shadow accent color, duration: 0.3s             |


