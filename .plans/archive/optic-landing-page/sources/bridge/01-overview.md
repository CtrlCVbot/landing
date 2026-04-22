# Bridge: OPTIC 랜딩 페이지 — Feature Overview 요약

> **IDEA**: IDEA-001 | **카테고리**: Lite | **판정**: Go (80.25점)
> **소스**: `.plans/features/active/optic-landing-page.md`

---

## 목적

OPTIC 브랜드 공식 랜딩 페이지 제작. 잠재 고객(화주, 주선사, 운송사)에게 제품 가치를 전달하고 도입 문의를 유도.

## 대상 사용자

| 사용자 | 니즈 |
|--------|------|
| 화주 (의사결정자) | 운송 의뢰 프로세스 간소화 솔루션 탐색 |
| 주선사 (대표/관리자) | 오더~정산 통합 관리 시스템 도입 검토 |
| 운송사/차주 | 배차 수락·운송 관리 디지털화 방안 검토 |

## 성공 기준

- 핵심 가치 전달 5초 이내 (First Meaningful Paint)
- 브랜딩 가이드 v1.0 전 섹션 준수
- 모바일/태블릿/데스크탑 반응형 정상 동작
- CTA(문의하기) 버튼 접근 가능

## 유저 스토리 (5개)

1. 화주 → Hero 카피로 서비스 즉시 파악
2. 주선사 → Features로 기존 업무 대체 기능 확인
3. 운송사 → Products로 역할별 제품 확인
4. 잠재 고객 → Integrations로 외부 연동 확인
5. 관심 고객 → CTA로 도입 상담 요청

## 구현 범위

### In-Scope
- 단일 페이지 8개 섹션 (Header, Hero, Problems, Features, Products, Integrations, CTA, Footer)
- 반응형 디자인 (Desktop/Tablet/Mobile)
- 스크롤 애니메이션
- CTA 버튼 (mailto 또는 외부 폼)
- SEO 메타데이터

### Out-of-Scope
- 문의 폼 백엔드, 다국어, 블로그, 로그인, A/B 테스트, 데모 페이지

## 완료 기준 (DoD)

- [ ] 8개 섹션 구현 + 브랜딩 가이드 준수
- [ ] 반응형 3단계 정상 동작
- [ ] Lighthouse Performance 90+, Accessibility 90+
- [ ] 빌드 성공 (0 에러)
- [ ] Vercel 프리뷰 배포 확인
