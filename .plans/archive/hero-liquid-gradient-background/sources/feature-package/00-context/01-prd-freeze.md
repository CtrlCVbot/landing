# 01. PRD Freeze — Hero 섹션 liquid gradient 배경

> **Frozen at**: 2026-04-27 (Bridge 생성 시점)
> **PRD source**: [`../../../../drafts/hero-liquid-gradient-background/02-prd.md`](../../../../drafts/hero-liquid-gradient-background/02-prd.md)
> **PRD Review**: [`../../../../drafts/hero-liquid-gradient-background/03-prd-review.md`](../../../../drafts/hero-liquid-gradient-background/03-prd-review.md) — PASS with noted follow-up
> **Freeze 의미**: 구현은 아래 범위를 기준으로 진행한다. PRD 원본 변경 시 Bridge 재승인 필요.

---

## 1. 고정 범위

| 항목 | 값 |
|---|---|
| Lane | Lite |
| Scenario | B |
| Feature type | dev |
| Hybrid | true |
| Epic | 없음 |
| Implementation path | CSS-first MVP |
| WebGL / `Three.js` | deferred |
| Reference policy | CodePen reference-only, source copy 금지 |

## 2. 고정 요구사항

| ID | 요약 | 우선순위 |
|---|---|:---:|
| REQ-hero-liquid-gradient-background-001 | Hero 전용 liquid gradient background layer 추가 | Must |
| REQ-hero-liquid-gradient-background-002 | background layer가 상호작용을 가로채지 않음 | Must |
| REQ-hero-liquid-gradient-background-003 | 기존 `GradientBlob` fallback 또는 reduced-motion 대안 보존 | Must |
| REQ-hero-liquid-gradient-background-004 | CSS-first MVP로 구현 | Must |
| REQ-hero-liquid-gradient-background-005 | `prefers-reduced-motion` 지원 | Must |
| REQ-hero-liquid-gradient-background-006 | 현재 landing theme에 맞는 purple/blue adaptation | Must |
| REQ-hero-liquid-gradient-background-007 | Hero content 가독성 유지 | Must |
| REQ-hero-liquid-gradient-background-008 | `DashboardPreview` 가시성 유지 | Must |
| REQ-hero-liquid-gradient-background-009 | mobile horizontal overflow 방지 | Must |
| REQ-hero-liquid-gradient-background-010 | CodePen source code 직접 복사 금지 | Must |
| REQ-hero-liquid-gradient-background-011 | light/dark theme별 gradient variant 제공 | Must |
| REQ-hero-liquid-gradient-background-012 | 기존 theme token 체계와 연결 | Must |
| REQ-hero-liquid-gradient-background-013 | stacking context 명시 | Must |
| REQ-hero-liquid-gradient-background-014 | theme 전환 flash와 hydration mismatch 방지 | Must |
| REQ-hero-liquid-gradient-background-015 | visual reference evidence 상태 명시 | Should |
| REQ-hero-liquid-gradient-background-016 | WebGL 전환 조건을 별도 gate로 둠 | Should |

## 3. 성공 지표

| ID | 목표 |
|---|---|
| SM-hero-liquid-gradient-001 | Hero에 새 decorative background layer 존재 |
| SM-hero-liquid-gradient-002 | `#contact` CTA가 계속 클릭 가능한 구조 유지 |
| SM-hero-liquid-gradient-003 | headline, subtitle, CTA, `DashboardPreview`가 배경과 충돌하지 않음 |
| SM-hero-liquid-gradient-004 | reduced motion에서 animation 제거 또는 크게 축소 |
| SM-hero-liquid-gradient-005 | 390px viewport에서 horizontal overflow 없음 |
| SM-hero-liquid-gradient-006 | CSS-first MVP에서 `three` dependency 추가 없음 |
| SM-hero-liquid-gradient-007 | light/dark mode에서 gradient contrast와 opacity가 각각 적절함 |
| SM-hero-liquid-gradient-008 | gradient가 기존 theme token 또는 양쪽 theme에 정의된 `--hero-gradient-*` token을 사용 |
| SM-hero-liquid-gradient-009 | background가 content/preview 위로 올라오지 않음 |
| SM-hero-liquid-gradient-010 | theme toggle 후 이전 theme gradient가 남지 않음 |
| SM-hero-liquid-gradient-011 | CodePen source code 직접 복사 없음 |
| SM-hero-liquid-gradient-012 | hero 관련 test pass |

## 4. PRD Review 후속 피드백

| 항목 | Severity | Action | 처리 시점 |
|---|---|---|---|
| CodePen visual capture blocked | medium | queued | visual similarity 기준이 필요하면 구현 전 manual capture 재시도 |
| light/dark gradient 대응 | high | auto-fixed | 구현 TASK acceptance criteria에 유지 |
| 기존 F1 theme token 연결 | medium | auto-fixed | 구현 TASK acceptance criteria에 유지 |
| stacking context 명시 | medium | auto-fixed | component test + screenshot review에 유지 |
| theme toggle 안정성 | medium | auto-fixed | browser check에 유지 |

## 5. Freeze 무효 조건

- CSS-first MVP 대신 WebGL / `Three.js`를 즉시 Must 범위로 승격하는 경우.
- light/dark theme별 gradient variant를 제거하는 경우.
- 기존 theme token 체계와 분리된 hard-coded 단일 palette로 구현하는 경우.
- `DashboardPreview` 내부 구조 변경을 본 Feature 범위에 포함하는 경우.
- CodePen source code를 직접 복사하거나 demo UI를 가져오는 경우.
