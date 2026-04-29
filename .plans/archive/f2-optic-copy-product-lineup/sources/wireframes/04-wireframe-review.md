# Wireframe Review: f2-optic-copy-product-lineup

> **Screens**: [screens.md](./screens.md)
> **Navigation**: [navigation.md](./navigation.md)
> **Components**: [components.md](./components.md)
> **작성일**: 2026-04-29
> **판정**: Approve
> **상태**: PASS

---

## 1. Review Summary

| 항목 | 판정 | 근거 |
|---|---|---|
| 주요 화면 포함 | PASS | Products desktop/mobile과 copy-only section preservation 포함 |
| 레이아웃 명확성 | PASS | 구현 대상 2개 카드와 구현 예정 3개 compact 영역이 ASCII로 구분됨 |
| 네비게이션 플로우 | PASS | 기존 landing scroll flow와 products 내부 interaction flow 포함 |
| 컴포넌트 명세 | PASS | 제품 카드, 상태 badge, 보조 라벨, 구현 예정 목록 명세 포함 |
| 상태별 표현 | PASS | implemented/upcoming/hover/focus/mobile 상태 포함 |
| 반응형 고려 | PASS | desktop/tablet/mobile 기준과 375px guard 포함 |
| PRD 매핑 | PASS | `REQ-F2-007/008/009/010/011/014` 매핑 |
| 접근성 고려 | PASS | focus visible, status text, screen reader badge 기준 포함 |

## 2. PCC 검증

| PCC | 판정 | 근거 |
|---|---|---|
| PCC-01 Idea ↔ Screen | PASS | IDEA와 SCREENING은 approved 상태 |
| PCC-02 Screen ↔ Feature | PASS | Draft와 routing metadata 존재 |
| PCC-03 Feature ↔ PRD | PASS | PRD approved, PRD review Approve |
| PCC-04 PRD ↔ Wireframe | PASS | PRD 제품 라인업/상태/반응형 요구사항이 wireframe에 반영됨 |
| PCC-05 Wireframe ↔ Stitch | SKIP | F2는 visual design handoff가 아니라 dev Feature Package로 직행 |
| PCC-07 Epic Binding | PASS | Epic F2 항목과 active feature context가 같은 slug를 가리킴 |
| PCC-08 Feature 상태 동기 | PASS with refresh | Bridge 이후 wireframe이 추가되어 Bridge context를 wireframe-aware 상태로 갱신함 |
| PCC-09 의존성 매트릭스 | PASS | F2는 F3 선행 카피/제품 구조 정렬 작업 |

## 3. Feedback Items

| 항목 | Severity | Score | Confidence | Action | 결과 |
|---|---|---:|---|---|---|
| Bridge 이후 wireframe 추가로 context stale 가능성 | medium | 4 | confirmed | auto-fixed | Bridge context와 routing metadata를 wireframe-aware 상태로 갱신 |
| 제품 섹션 변경이 tab UI와 충돌할 수 있음 | medium | 4 | likely | queued | dev package에서 2-card layout 또는 2-active-tab + upcoming 영역 중 하나로 확정 |
| 구현 예정 항목이 모바일에서 길어질 수 있음 | medium | 3 | likely | auto-fixed | mobile wireframe에서 compact list fallback 명시 |

### Severity Score Detail

| 항목 | Impact | Reach | Recovery | Total | Confidence | Action |
|---|---:|---:|---:|---:|---|---|
| Bridge stale risk | 2 | 1 | 1 | 4 | confirmed | auto-fixed |
| Product tab conflict | 2 | 1 | 1 | 4 | likely | queued |
| Upcoming mobile length | 1 | 1 | 1 | 3 | likely | auto-fixed |

## 4. Review Decision

**Approve**.

Wireframe은 F2의 핵심 UI 변경점인 제품 라인업 표시 구조를 충분히 고정한다. F2는 전체 랜딩 레이아웃 재설계가 아니라 제품 섹션 구조와 주변 copy-only 섹션 정리이므로, Stitch는 생략하고 Bridge context를 wireframe-aware 상태로 refresh한 뒤 `/dev-feature`로 진행한다.

## 5. Next Steps

1. Bridge context의 source docs에 wireframe과 review를 포함한다.
2. `/dev-feature .plans/features/active/f2-optic-copy-product-lineup/`로 개발 패키지를 생성한다.
