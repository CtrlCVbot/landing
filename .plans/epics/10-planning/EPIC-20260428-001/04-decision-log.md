# Decision Log — EPIC-20260428-001

| 날짜 | 결정 | 근거 | 영향 |
|---|---|---|---|
| 2026-04-28 | Epic을 생성하되 상태는 `draft`로 둔다 | `plan-epic-workflow`상 `planning` 진입에는 자식 IDEA 최소 1건이 필요하지만 아직 IDEA 생성 요청은 없었다 | Epic 구조화는 진행하고, `/plan-idea --epic=EPIC-20260428-001`는 다음 단계로 분리 |
| 2026-04-28 | 고객 전면 브랜드는 `OPTIC`, 내부 엔진/보조 문구는 `OPTICS`로 분리한다 | `00-brand-application-guide.md`, `04-copy-and-cta-guide.md` | Header, hero, 제품명, CTA는 `OPTIC`; footer/About만 `Powered by OPTICS` 허용 |
| 2026-04-28 | 기본 구현 전략은 `A안 + C안 일부 + E안 CTA`로 둔다 | `02-improvement-options.md`, `05-final-recommendation-and-review.md` | 업무 매뉴얼형 스크롤을 MVP로 만들고, 핵심 자동화 애니메이션과 실제 서비스 CTA를 결합 |
| 2026-04-28 | hero는 유지하고 hero 이후 섹션을 확장한다 | `03-animation-section-manual.md`, `07-implementation-roadmap.md` | 기존 AI 오더 등록 경험을 보존하고 하위 업무 흐름으로 가치를 확장 |
| 2026-04-28 | `OPTIC 바로가기`는 실제 서비스 이동 CTA로 정의한다 | `04-copy-and-cta-guide.md` | `서비스 테스트` 같은 내부 검증 문구를 쓰지 않음 |
| 2026-04-28 | 매출 정산 번들을 MVP 중심으로 둔다 | `03-animation-section-manual.md`, `05-final-recommendation-and-review.md` | 매입 정산 상세 플로우는 확장 Feature 후보로 보류 |
| 2026-04-28 | 로고 권리/상표 검토는 구현 전 또는 release 전 게이트로 분리한다 | `05-final-recommendation-and-review.md`, `06-logo-asset-application-guide.md` | F1에서는 임시 자산 또는 기존 컴포넌트 개선으로 시작 가능 |
| 2026-04-28 | Epic을 `planning`으로 전환한다 | F1 approved IDEA가 생겨 `draft → planning` 게이트를 충족했다 | F1 Draft와 후속 Feature IDEA 등록을 병행할 수 있다 |
| 2026-04-28 | F1은 Lite Draft 후 PRD를 생략할 수 있다 | Screening `Lite`, 외부 API/DB/인증/도메인 변경 없음 | Draft scope 승인 후 `/plan-bridge` 또는 Lite dev handoff로 진행 |
