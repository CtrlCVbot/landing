# IDEA-001: OPTIC 랜딩 페이지

- **카테고리**: feature
- **상태**: ready-to-dev (Go, 80.25점, Lite, Key: OLP)
- **등록일**: 2026-03-31
- **소스**: `.plan/idea/2026-03-31-optic-landing-page/`

---

## 요약

OPTIC 브랜드 공식 랜딩 페이지 제작. OpenAI Codex 페이지 스타일의 모던 디자인으로 OPTIC 제품 라인업(Broker, Shipper, Carrier, Operations, Billing)과 핵심 기능을 소개.

## 핵심 요구사항

1. **디자인 레퍼런스**: OpenAI Codex 페이지 (색감, 레이아웃, 전체 UX)
2. **브랜딩 적용**: OPTIC 브랜드 가이드 v1.0 준수
   - 외부 브랜드: OPTIC (OPTICS는 "Powered by OPTICS"로만)
   - 카피: "운송 운영을 한눈에 / 오더부터 정산까지"
3. **서비스 소개 콘텐츠**: handbook-claude 문서 기반 기능 정리
   - 주문 관리 / 배차 / 정산 / 세금계산서 / AI 주문서 추출 / 외부 연동
4. **제품 라인업 섹션**: 5개 제품별 역할/기능 소개
   - OPTIC Broker (주선사) — 오더 생성, 배차/진행, 정산, 거래처/차주 관리
   - OPTIC Shipper (화주) — 오더 생성/조회, 상하차지/거래처 관리
   - OPTIC Carrier (운송사/차주) — 배차/운송 수행, 상하차지 확인
   - OPTIC Operations (운영/관제) — 전체 현황 모니터링, 데이터 유지보수
   - OPTIC Billing (회계/정산) — 매출/매입 정산, 대사, 세금계산서
5. **도메인**: optic.app (메인 랜딩)

## 기술 스택 (현재 OPTIC 기반)

- Next.js 15.3 (App Router) + React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- PostgreSQL + Drizzle ORM
- Vercel 배포

## 현재 구현된 서비스

- optic.app — 기본 웹서비스
- brkr.optic.app — 기본 주선사 웹서비스
- brkr.theu.optic.app — 주선사 '더유' 커스텀 웹서비스
- shpr.optic.app — 기본 화주 웹서비스

## 외부 연동

- Google Gemini AI (주문서 자동 추출)
- 카카오 맵 (주소 검색, 경로/거리 계산)
- 팝빌 (세금계산서 발행)
- 로지스엠/화물맨 (물류 플랫폼 연동)

## 스크리닝 결과 (RICE)

**스크리닝일**: 2026-03-31

| 축 | 가중치 | 점수 | 가중 점수 | 근거 |
|----|--------|------|-----------|------|
| 비즈니스 가치 | 30% | 85 | 25.5 | 브랜드 공식 진입점, 5개 제품 라인업 소개로 리드 생성 핵심 채널 |
| 사용자 영향 | 25% | 70 | 17.5 | 대상: 화주/주선사/운송사 의사결정자. 공식 랜딩 부재로 서비스 이해도 향상 |
| 기술적 실현성 | 20% | 90 | 18.0 | 기존 스택 100% 활용. 정적 페이지, 복잡도 낮음 |
| 전략적 정렬 | 15% | 85 | 12.75 | OPTIC 브랜드 가이드 v1.0 직접 구현. 제품 포지셔닝 공식화 |
| 긴급도 | 10% | 65 | 6.5 | 서비스 운영 중이나 공식 소개 페이지 부재 |

| 항목 | 값 |
|------|-----|
| **가중 합산 점수** | **80.25 / 100** |
| **판정** | **Go** |
| **카테고리** | **Lite** |

### 리스크 요인

| 리스크 | 영향도 | 대응 |
|--------|--------|------|
| 디자인 품질 | 중 | OpenAI Codex 레퍼런스로 방향 명확 |
| 콘텐츠 완성도 | 중 | handbook-claude 8개 문서에서 기능 정보 충분 |
| 반응형 대응 | 낮 | Tailwind 유틸리티로 기본 대응 가능 |

## 참조 자료

- `.plan/idea/2026-03-31-optic-landing-page/memo.md`
- `.plan/idea/2026-03-31-optic-landing-page/optic-branding.md`
- `.references/code/mm-broker/docs/handbook-claude/` (8개 문서)

## 파이프라인 이력

| 단계 | 상태 | 산출물 |
|------|------|--------|
| Idea | done | `IDEA-001.md` |
| Screen | done | 80.25점, Go, Lite |
| Draft | done | `.plans/features/active/optic-landing-page.md` |
| Wireframe | done | `.plans/wireframes/optic-landing-page/` |
| Bridge | done | `.plans/bridge/optic-landing-page/` |
| Feature Plan | done | `.plans/features/active/optic-landing-page/feature-plan-lite.md` |
| Dev | done | `apps/landing/` |
