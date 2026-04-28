# Bridge: Stitch Summary — dash-preview-phase3 (SKIPPED)

> **Feature**: Dashboard Preview Phase 3
> **Slug**: `dash-preview-phase3`
> **P6 Stitch 상태**: **skipped**
> **Created**: 2026-04-17

---

## 0. 결론

본 Feature는 **Stitch 단계(P6)를 건너뛴다**. `stage-manifest.json`의 `P6.status = "skipped"`, `P6.reason = "no external design stitch needed (hybrid reference-only)"`.

---

## 1. Skipped 근거

### 1-1. Stitch 단계의 본질

`/plan-stitch` 는 **외부 HTML/디자인 시안(Figma export, Stitch, Webflow 등)을 PRD/Wireframe과 통합**하는 단계다. 전형적 용도:
- 디자이너가 Figma로 내보낸 HTML/CSS 시안을 PRD 요구사항과 매핑
- 외부 디자인 시스템과 구현 컴포넌트 네이밍 통일
- 시안 ↔ 와이어프레임 불일치 검증

### 1-2. Phase 3에 Stitch가 필요하지 않은 이유

| 이유 | 설명 |
|------|------|
| **Hybrid (reference-only) 모드** | 본 Feature는 [`07-routing-metadata.md`](./07-routing-metadata.md)에서 Hybrid reference-only 확정. `/copy-reference-refresh`만 활용하고 visual/interaction review는 생략한다. |
| **외부 HTML 시안 없음** | Phase 3의 시각 SSOT는 **wireframe ASCII 도식** ([`screens.md`](../sources/wireframes/screens.md)) + **원본 ai-register source code** (`.references/code/mm-broker/app/broker/order/ai-register/`). 별도 Figma/Stitch export 없음. |
| **원본이 URL이 아닌 source code** | 일반 copy live 캡처 워크플로우와 상이. Stitch가 제공하는 "HTML 시안 분해 → 컴포넌트 매핑" 절차가 부적합. 대신 **`register-form.tsx:939`의 원본 구조를 1:1 재현** (REQ-DASH-003/007). |
| **디자인 시스템 중복** | shadcn/ui 3-C 하이브리드 (Button/Input/Textarea/Card/Badge) 5개만 도입. 디자인 시스템 자체는 기존 landing의 Tailwind + clsx + tailwind-merge를 그대로 사용. |

### 1-3. 대체 수행 작업

Stitch가 할 일을 다음 문서들이 **분산 수행**한다:

| Stitch의 역할 | 대체 수행 | 위치 |
|---------------|-----------|------|
| 외부 시안 ↔ PRD 매핑 | wireframe decision-log §3 (원본 `register-form.tsx:939` 1:1 재현 결정) | [`sources/wireframes/decision-log.md`](../sources/wireframes/decision-log.md#3-2026-04-17--orderform-3-column-재현--tablet-c안-040--3-column-유지-확정) |
| 컴포넌트 네이밍 통일 | components.md §2 컴포넌트 트리 + 파일 구조 | [`sources/wireframes/components.md`](../sources/wireframes/components.md) |
| 시안 ↔ 와이어 불일치 검증 | PCC-04 자체 사전 점검 28/28 | [`sources/wireframes/components.md`](../sources/wireframes/components.md) §8 |
| 디자인 토큰 매핑 | `03-bridge-wireframe.md` §6 CSS 토큰 ↔ Tailwind | [`03-bridge-wireframe.md`](./03-bridge-wireframe.md#6-css-디자인-토큰--tailwind-매핑) |

---

## 2. 향후 Stitch 진입 조건

다음 중 **하나라도 발생 시** Stitch 단계를 재개한다:

| 조건 | 설명 |
|------|------|
| 외부 Figma/Stitch export 제작 | 디자이너가 Phase 3 와이어프레임을 기반으로 별도 HTML 시안을 제작한 경우 |
| 디자인 시스템 변경 | landing 전체의 토큰/컴포넌트 라이브러리가 교체되어 통합 매핑이 필요한 경우 |
| Phase 4 COMPLETE 단계 착수 | RegisterSuccessDialog 시연 연출이 Phase 4에서 추가될 때, 해당 다이얼로그 시안이 별도 제작되면 Stitch 필요 |
| Option A 전환 (Q2 해소) | broker 앱 모노레포 통합 시 shared 디자인 시스템 매핑 필요 |

재개 절차:
1. `/plan-stitch dash-preview-phase3` 실행
2. 본 문서 내 "Skipped 근거"를 **변경 사유**와 함께 갱신
3. `stage-manifest.json`의 `P6.status = "in-progress"` 변경

---

## 3. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-04-17 | 초안 — Stitch skipped 확정 + 근거(Hybrid reference-only, 외부 HTML 시안 없음) + 향후 진입 조건 기록 |
