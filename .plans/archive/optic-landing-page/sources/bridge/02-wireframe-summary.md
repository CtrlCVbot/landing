# Bridge: OPTIC 랜딩 페이지 — 와이어프레임 요약

> **소스**: `.plans/wireframes/optic-landing-page/` (screens, navigation, components)

---

## 페이지 구조 (8개 섹션)

| SCR | 섹션 | 핵심 요소 | 그리드 (Desktop) |
|-----|------|----------|-----------------|
| 001 | Header (고정) | 로고 + 네비게이션 4개 + CTA 버튼 | 단일 행 |
| 002 | Hero | 메인/서브 카피 + 2x CTA + 대시보드 비주얼 | 중앙 정렬, 100vh |
| 003 | Problems | Before/After 대비 6개 항목 | 2열 (before \| after) |
| 004 | Features | 6개 기능 카드 (아이콘+제목+설명) | 3x2 그리드 |
| 005 | Products | 5개 제품 탭 + 콘텐츠 패널 | 탭바 + 콘텐츠 영역 |
| 006 | Integrations | 4개 연동 서비스 카드 | 4열 그리드 |
| 007 | CTA | 카피 + 대형 CTA 버튼 | 중앙 정렬 |
| 008 | Footer | 3열 링크 + 하단 바 | 3열 + 풀폭 하단 |

## 반응형 브레이크포인트

| 뷰포트 | 너비 | 주요 변경 |
|---------|------|----------|
| Desktop | 1280px+ | 3열 그리드, 탭 네비, 넓은 여백 |
| Tablet | 768-1279px | 2열 그리드, 여백 축소 |
| Mobile | ~767px | 1열, 풀폭 버튼, 햄버거 메뉴, 스와이프 탭 |

## 핵심 인터랙션

| 인터랙션 | 트리거 | 동작 |
|----------|--------|------|
| Header 앵커 스크롤 | 네비 링크 클릭 | smooth scroll to 섹션 |
| Header 블러 | scrollY >= 100px | 배경 blur + opacity 전환 |
| 섹션 페이드인 | scroll into viewport | fade-in-up (0.6s, staggered) |
| Feature 카드 호버 | mouse enter | lift(-4px) + glow |
| Product 탭 전환 | 탭 클릭/스와이프 | 콘텐츠 fade 전환 (0.3s) |
| CTA 클릭 (Hero) | 버튼 클릭 | scroll to #contact |
| CTA 클릭 (문의) | 버튼 클릭 | mailto 또는 외부 폼 (새 탭) |

## 디자인 토큰 (OpenAI Codex 스타일)

| 토큰 | 값 |
|------|-----|
| bg-primary | #0a0a0a |
| bg-card | gray-900/50 |
| border-card | gray-800 |
| text-primary | white |
| text-secondary | gray-400 |
| accent | gradient (purple → blue 계열) |
| font-heading | 48-64px (Desktop) / 28-32px (Mobile) |
| font-body | 16-18px |
| spacing-section | 120px (Desktop) / 80px (Mobile) |
| border-radius | xl (12px) / lg (8px) |
